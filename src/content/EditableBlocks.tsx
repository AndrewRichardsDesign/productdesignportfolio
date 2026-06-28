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

/**
 * Renders a prose section from the content store as a list of editable blocks.
 *
 * Each entry is either a legacy string (rendered as a paragraph, identical to
 * the old behaviour) or a typed block (paragraph or heading). In admin mode,
 * when an insert tool is armed from the admin bar, a clickable preview line
 * appears between every block — styled like the block it will create — so the
 * editor can see exactly where and how a new paragraph/heading will land.
 */
export function EditableBlocks({ path }: { path: string }) {
  const { content, isAdmin } = useContent();
  const raw = getByPath(content, path);
  const items: ProseItem[] = Array.isArray(raw) ? (raw as ProseItem[]) : [];

  // Fragments are transparent in the DOM, so the parent's `space-y-*` rhythm
  // still applies to the real block/zone elements. When no tool is armed the
  // zones render null, leaving the exact markup the pages had before.
  return (
    <>
      {items.map((item, i) => (
        <Fragment key={i}>
          <InsertZone path={path} index={i} />
          <Block path={path} index={i} item={item} editable={isAdmin} />
        </Fragment>
      ))}
      <InsertZone path={path} index={items.length} />
    </>
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
  // Block entries keep their text under `.text`; legacy strings sit at the index.
  const textPath = block ? `${path}.${index}.text` : `${path}.${index}`;

  const heading = block && item.type === 'heading';
  const cfg = heading ? headerConfig(item.style) : null;

  const el =
    heading && cfg ? (
      <Editable as={cfg.tag} path={textPath} className={cfg.className} />
    ) : (
      <Editable as="p" multiline path={textPath} />
    );

  // Legacy strings render exactly as before — no wrapper, no controls — so the
  // existing pages are byte-identical until something is inserted.
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
 * A clickable insertion slot. Renders nothing unless an insert tool is armed.
 * Shows a primary insertion line plus, on hover, a faded preview of the block
 * that will be created (paragraph copy or the chosen heading style).
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
      const el = document.querySelector<HTMLElement>(
        `[data-editable-path="${focusPath}"]`
      );
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
