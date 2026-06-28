import { Children, Fragment, cloneElement, isValidElement } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { Check, GripVertical } from 'lucide-react';
import { useContent } from '@/content/ContentContext';

/**
 * Wraps a page's top-level <section> elements and renders them in the
 * admin-controlled order (content[pageKey].sectionOrder). For everyone it just
 * reorders; in admin "Move" mode it overlays each section with a click target
 * for selection and shows insertion lines between sections so selected sections
 * can be moved as a group.
 *
 * Each child must be a <section> with a stable `id` prop (e.g. "sec-01").
 */
export function ReorderableSections({
  pageKey,
  children,
}: {
  pageKey: string;
  children: ReactNode;
}) {
  const { content, isAdmin, moveMode, selection, toggleSectionSelection, moveSectionsTo } =
    useContent();

  const elements = Children.toArray(children).filter(isValidElement) as ReactElement<{
    id?: string;
  }>[];
  const naturalIds = elements.map((el) => el.props.id).filter((id): id is string => !!id);
  const byId = new Map(elements.map((el) => [el.props.id, el] as const));

  const stored = (content as unknown as Record<string, { sectionOrder?: string[] }>)[pageKey]
    ?.sectionOrder;
  const order =
    stored && stored.length
      ? [
          ...stored.filter((id) => byId.has(id)),
          ...naturalIds.filter((id) => !stored.includes(id)),
        ]
      : naturalIds;

  const inMove = isAdmin && moveMode;
  const sectionMoveActive =
    inMove && selection?.domain === 'section' && selection.ids.length > 0;

  const line = (gap: number) =>
    sectionMoveActive ? (
      <SectionInsertLine
        key={`line-${gap}`}
        count={selection!.domain === 'section' ? selection!.ids.length : 0}
        onClick={() => moveSectionsTo(pageKey, naturalIds, gap)}
      />
    ) : null;

  return (
    <>
      {order.map((id, i) => {
        const el = byId.get(id);
        if (!el) return null;
        const keyed = cloneElement(el, { key: id });

        if (!inMove) {
          return <Fragment key={id}>{keyed}</Fragment>;
        }

        const selected = selection?.domain === 'section' && selection.ids.includes(id);
        return (
          <Fragment key={id}>
            {line(i)}
            <div
              className={`relative ${
                selected
                  ? 'rounded-3xl ring-2 ring-primary ring-offset-4 ring-offset-background'
                  : ''
              }`}
            >
              {/* The "Section" chip selects the whole section. (A full overlay
                  can't be used: GSAP .reveal transforms create stacking
                  contexts, so an overlay would block the per-block handles.) */}
              <button
                type="button"
                aria-label={`Select section ${id}`}
                onClick={() => toggleSectionSelection(id)}
                className={`absolute left-3 top-3 z-30 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium shadow-sm backdrop-blur transition-colors ${
                  selected
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border/70 bg-background/90 text-muted-foreground hover:border-primary/60 hover:text-foreground'
                }`}
              >
                {selected ? <Check className="h-3.5 w-3.5" /> : <GripVertical className="h-3.5 w-3.5" />}
                Section
              </button>
              {keyed}
            </div>
          </Fragment>
        );
      })}
      {line(order.length)}
    </>
  );
}

/** Clickable "move selected here" line shown between sections in move mode. */
function SectionInsertLine({ count, onClick }: { count: number; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Move selected sections here"
      className="group/line relative z-30 flex w-full items-center gap-2 py-3"
    >
      <span className="whitespace-nowrap text-[11px] font-medium uppercase tracking-wide text-primary/70 transition-colors group-hover/line:text-primary">
        Move {count} here
      </span>
      <span className="h-0.5 flex-1 rounded-full bg-primary/30 transition-colors group-hover/line:bg-primary" />
    </button>
  );
}
