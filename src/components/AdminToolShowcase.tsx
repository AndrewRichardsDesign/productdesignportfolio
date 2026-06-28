import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Maximize2, X } from 'lucide-react';

/**
 * Embeds a working copy of the Arcatext "Typing-UX Admin Tool".
 *
 * The tool is a self-contained static page (public/arcatext-admin-tool.html)
 * generated from the real tool by tools/sync-admin-tool.mjs. It is fully
 * interactive but every network call is stubbed, so it never talks to the app
 * or Supabase. Shown here as a scaled, readable preview with an "Expand &
 * interact" button that opens it full-screen.
 */
const TOOL_SRC = `${import.meta.env.BASE_URL}arcatext-admin-tool.html`;
// The tool's natural canvas (3-column layout). The preview scales this to fit.
const FRAME_W = 1200;
const FRAME_H = 820;

export function AdminToolShowcase() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);

  // Scale the preview iframe to fill the available width (keeps text readable).
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setScale(Math.min(1, el.clientWidth / FRAME_W));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Lock body scroll + close on Esc while the modal is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <div className="mt-8">
      <div className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-accent">
        The tuning tool
      </div>

      {/* Scaled, non-interactive preview. */}
      <div
        ref={wrapRef}
        className="relative w-full overflow-hidden rounded-xl border border-border bg-card shadow-sm"
        style={{ height: FRAME_H * scale }}
      >
        <iframe
          src={TOOL_SRC}
          title="Typing-UX admin tool preview"
          loading="lazy"
          tabIndex={-1}
          aria-hidden
          className="pointer-events-none origin-top-left border-0"
          style={{ width: FRAME_W, height: FRAME_H, transform: `scale(${scale})` }}
        />
        {/* Click-catcher: the whole preview opens the tool. */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Expand the admin tool"
          className="absolute inset-0 cursor-pointer bg-transparent"
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-md text-xs text-muted-foreground">
          A working copy of the Typing-UX admin tool — interactive, with sample data only. Nothing
          is sent to the app or Supabase.
        </p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90"
        >
          <Maximize2 className="h-4 w-4" />
          Expand &amp; interact
        </button>
      </div>

      {/* Full-screen interactive modal — portalled to <body> so it escapes any
          transformed (GSAP .reveal) ancestor and truly covers the viewport. */}
      {open &&
        createPortal(
          <div className="fixed inset-0 z-[200] flex flex-col bg-background">
            <div className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border px-4">
              <div className="flex min-w-0 items-center gap-2">
                <span className="truncate text-sm font-semibold">Typing-UX Admin Tool</span>
                <span className="hidden shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground sm:inline">
                  Interactive demo · sample data only
                </span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <iframe
              src={TOOL_SRC}
              title="Typing-UX admin tool"
              className="min-h-0 w-full flex-1 border-0"
            />
          </div>,
          document.body
        )}
    </div>
  );
}
