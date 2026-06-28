import { Fragment, useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useContent } from './ContentContext';
import { Editable } from './Editable';
import {
  blockForTool,
  headerConfig,
  isProseBlock,
  type InsertTool,
  type ProseItem,
} from './proseBlocks';

/** Resolve a nested value out of the content store using a dot path. */
function getByPath(obj: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc == null || typeof acc !== 'object') return undefined;
    return (acc as Record<string, unknown>)[key];
  }, obj);
}

/** Place the text caret at the end of a contentEditable element. */
function focusAtEnd(el: HTMLElement) {
  el.focus();
  const range = document.createRange();
  range.selectNodeContents(el);
  range.collapse(false);
  const sel = window.getSelection();
  sel?.removeAllRanges();
  sel?.addRange(range);
}

/** Short label for the armed tool, used on the insertion line. */
function toolLabel(tool: InsertTool): string {
  return tool.kind === 'paragraph' ? 'Paragraph' : headerConfig(tool.style).label;
}

/** The editable element for a single prose entry (paragraph or heading). */
function blockElement(path: string, index: number, item: ProseItem) {
  const block = isProseBlock(item);
  const textPath = block ? `${path}.${index}.text` : `${path}.${index}`;
  if (block && item.type === 'heading') {
    const cfg = headerConfig(item.style);
    return <Editable as={cfg.tag} path={textPath} className={cfg.className} />;
  }
  return <Editable as="p" multiline path={textPath} />;
}

/**
 * Renders a prose section from the content store as a list of editable blocks.
 *
 * Each entry is either a legacy string (rendered as a paragraph) or a typed
 * block (paragraph or heading). In admin it supports three overlays:
 *   - Insert tool armed: a clickable preview line between every block.
 *   - Move mode: each block becomes selectable, and "move here" lines appear
 *     between blocks once blocks from this list are selected.
 *   - Otherwise: inserted blocks show a hover delete affordance.
 */
export function EditableBlocks({ path }: { path: string }) {
  const { content, isAdmin, moveMode, selection, moveBlocksTo } = useContent();
  const raw = getByPath(content, path);
  const items: ProseItem[] = Array.isArray(raw) ? (raw as ProseItem[]) : [];

  const inMove = isAdmin && moveMode;
  const moveActiveHere =
    inMove && selection?.domain === 'block' && selection.path === path && selection.indices.length > 0;

  const moveLine = (gap: number) =>
    moveActiveHere ? (
      <button
        key={`move-${gap}`}
        type="button"
        aria-label="Move selected blocks here"
        onClick={() => moveBlocksTo(path, gap)}
        className="group/move relative z-40 -my-1 flex w-full items-center gap-2 py-1"
      >
        <span className="whitespace-nowrap text-[10px] font-medium uppercase tracking-wide text-primary/70 transition-colors group-hover/move:text-primary">
          Move {selection!.domain === 'block' ? selection!.indices.length : 0} here
        </span>
        <span className="h-0.5 flex-1 rounded-full bg-primary/40 transition-colors group-hover/move:bg-primary" />
      </button>
    ) : null;

  return (
    <>
      {items.map((item, i) => (
        <Fragment key={i}>
          {inMove ? moveLine(i) : <InsertZone path={path} index={i} />}
          {inMove ? (
            <MoveBlock path={path} index={i} item={item} />
          ) : (
            <Block path={path} index={i} item={item} editable={isAdmin} />
          )}
        </Fragment>
      ))}
      {inMove ? moveLine(items.length) : <InsertZone path={path} index={items.length} />}
    </>
  );
}

/** A block in move mode: a click target that toggles its selection. */
function MoveBlock({ path, index, item }: { path: string; index: number; item: ProseItem }) {
  const { selection, toggleBlockSelection } = useContent();
  const selected =
    selection?.domain === 'block' && selection.path === path && selection.indices.includes(index);

  return (
    <div
      className={cn(
        'relative rounded-lg transition-shadow',
        selected && 'ring-2 ring-primary ring-offset-2 ring-offset-background'
      )}
    >
      {/* z-30 sits above the section-level select overlay (z-20) so clicking a
          paragraph/heading selects the block, not the whole section. */}
      <button
        type="button"
        aria-label="Select block"
        data-move-block={`${path}.${index}`}
        onClick={(e) => {
          e.stopPropagation();
          toggleBlockSelection(path, index);
        }}
        className="absolute inset-0 z-30 cursor-pointer rounded-lg transition-colors hover:bg-primary/10"
      />
      {blockElement(path, index, item)}
    </div>
  );
}

/** A single paragraph or heading entry, with an admin delete affordance for blocks. */
function Block({
  path,
  index,
  item,
  editable,
}: {
  path: string;
  index: number;
  item: ProseItem;
  editable: boolean;
}) {
  const { removeBlock } = useContent();
  const block = isProseBlock(item);
  const el = blockElement(path, index, item);

  // Legacy strings render exactly as before — no wrapper, no controls.
  if (!editable || !block) return el;

  return (
    <div className="group/block relative">
      {el}
      <button
        type="button"
        onClick={() => removeBlock(path, index)}
        title="Delete this block"
        aria-label="Delete this block"
        className="absolute -left-7 top-1 hidden h-5 w-5 items-center justify-center rounded text-muted-foreground opacity-0 transition-opacity hover:bg-muted hover:text-foreground group-hover/block:flex group-hover/block:opacity-100"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

/**
 * A clickable insertion slot for the Insert tool. Renders nothing unless a tool
 * is armed. Shows a primary insertion line plus, on hover, a faded preview of
 * the block that will be created.
 */
function InsertZone({ path, index }: { path: string; index: number }) {
  const { isAdmin, insertTool, insertBlock, setInsertTool } = useContent();
  const [hover, setHover] = useState(false);

  if (!isAdmin || !insertTool) return null;

  const paragraph = insertTool.kind === 'paragraph';
  const cfg = paragraph ? null : headerConfig(insertTool.style);

  const handleInsert = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    insertBlock(path, index, blockForTool(insertTool));
    setInsertTool(null);
    // Focus the new (empty) block once it has rendered.
    const focusPath = `${path}.${index}.text`;
    requestAnimationFrame(() => {
      const el = document.querySelector<HTMLElement>(`[data-editable-path="${focusPath}"]`);
      if (el) focusAtEnd(el);
    });
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Insert ${toolLabel(insertTool)} here`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={handleInsert}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') handleInsert(e as unknown as React.MouseEvent);
      }}
      className="group/zone relative -my-1 cursor-pointer py-1"
    >
      <div className="flex items-center gap-2" aria-hidden>
        <span
          className={cn(
            'text-[10px] font-medium uppercase tracking-wide whitespace-nowrap transition-colors',
            hover ? 'text-primary' : 'text-primary/60'
          )}
        >
          + {toolLabel(insertTool)}
        </span>
        <span
          className={cn(
            'h-0.5 flex-1 rounded-full transition-colors',
            hover ? 'bg-primary' : 'bg-primary/30'
          )}
        />
      </div>

      {hover && (
        <div className="pointer-events-none mt-2 select-none" aria-hidden>
          {paragraph || !cfg ? (
            <p className="opacity-50">New paragraph…</p>
          ) : (
            (() => {
              const Tag = cfg.tag;
              return <Tag className={cn(cfg.className, 'opacity-50')}>{cfg.previewText}</Tag>;
            })()
          )}
        </div>
      )}
    </div>
  );
}
