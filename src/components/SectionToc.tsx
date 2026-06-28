import { useEffect, useRef, useState } from 'react';
import { useContent } from '@/content/ContentContext';

export interface TocItem {
  /** The id of the <section> this entry links to (e.g. "sec-01"). */
  id: string;
  /** The display number for the entry (e.g. "01"). */
  n: string;
}

interface SectionTocProps {
  items: TocItem[];
  /** Human-readable label per item, index-aligned with `items`. */
  labels: string[];
  /** Hash route for this page (e.g. "#/arcatext"), used to preserve the URL. */
  routeHash: string;
}

/**
 * Section navigation for the long-form project pages.
 *
 * Renders in one of two mutually-exclusive layouts depending on available width
 * so the nav NEVER overlaps the centred content column (max-w-6xl):
 *
 *   - Wide screens (>=1600px): a fixed vertical rail in the left gutter. The
 *     1600px floor guarantees the gutter is wide enough to hold the rail clear
 *     of the content, even for the longest section labels.
 *   - Narrower screens (<1600px): a sticky, top-aligned horizontal tab bar that
 *     sits directly under the fixed top bar (h-16). Tabs scroll horizontally
 *     when they exceed the viewport width, and the active tab is kept centred.
 */
export function SectionToc({ items, labels, routeHash }: SectionTocProps) {
  const { isAdmin } = useContent();
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? '');
  const activeTabRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: '-30% 0px -55% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [items]);

  // Keep the active tab in view within the horizontal (small-screen) bar.
  // `block: 'nearest'` prevents any vertical page jump.
  useEffect(() => {
    activeTabRef.current?.scrollIntoView({
      block: 'nearest',
      inline: 'center',
    });
  }, [activeId]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Preserve the admin flag so scrolling doesn't drop out of edit mode.
      history.replaceState(null, '', isAdmin ? `${routeHash}?admin` : routeHash);
    }
  };

  return (
    <>
      {/* Wide screens: fixed vertical rail in the left gutter. */}
      <nav
        aria-label="Section navigation"
        className="hidden min-[1600px]:block fixed top-1/2 left-6 -translate-y-1/2 z-40"
      >
        <ol className="space-y-3 text-sm">
          {items.map((item, i) => {
            const isActive = activeId === item.id;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => handleClick(e, item.id)}
                  className={`group flex items-baseline gap-3 py-1 transition-colors duration-200 ${
                    isActive
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <span
                    className={`text-xs font-mono ${
                      isActive ? 'text-primary' : 'text-muted-foreground/70'
                    }`}
                  >
                    {item.n}
                  </span>
                  <span
                    className={`relative leading-snug ${
                      isActive
                        ? 'underline underline-offset-4 decoration-primary decoration-2'
                        : 'no-underline'
                    }`}
                  >
                    {labels[i]}
                  </span>
                </a>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Narrower screens: sticky, top-aligned horizontal tab bar. */}
      <nav
        aria-label="Section navigation"
        className="min-[1600px]:hidden sticky top-16 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <ol className="flex items-stretch gap-1 overflow-x-auto py-1 text-sm [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {items.map((item, i) => {
              const isActive = activeId === item.id;
              return (
                <li key={item.id} className="shrink-0">
                  <a
                    ref={isActive ? activeTabRef : undefined}
                    href={`#${item.id}`}
                    onClick={(e) => handleClick(e, item.id)}
                    className={`flex items-baseline gap-2 whitespace-nowrap rounded-md px-3 py-2 transition-colors duration-200 ${
                      isActive
                        ? 'text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <span
                      className={`text-xs font-mono ${
                        isActive ? 'text-primary' : 'text-muted-foreground/70'
                      }`}
                    >
                      {item.n}
                    </span>
                    <span
                      className={`leading-snug ${
                        isActive
                          ? 'underline underline-offset-4 decoration-primary decoration-2'
                          : 'no-underline'
                      }`}
                    >
                      {labels[i]}
                    </span>
                  </a>
                </li>
              );
            })}
          </ol>
        </div>
      </nav>
    </>
  );
}
