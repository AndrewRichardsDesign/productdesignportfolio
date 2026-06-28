import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Maximize2, X } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

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

export function AdminToolShowcase() {
  const [open, setOpen] = useState(false);
  const previewRef = useRef<HTMLIFrameElement>(null);
  // Hovering the preview plays a scripted demo on the (same-origin) tool:
  //   1. raise the Decision-margin tiers (precise→3, average→4, loose→6),
  //   2. lower Same-row strictness (→0.5),
  //   3. reset every slider to its default,
  // looping for as long as the cursor stays on the preview. Values outside a
  // slider's range are clamped by the range input (loose maxes out, same-row
  // bottoms out).
  const DECISION_MARGIN_KEY = 'rekeys.tb.decisionMargin';
  const SAME_ROW_KEY = 'rekeys.tb.sameRowMult';
  const defaultsRef = useRef<Map<HTMLInputElement, string>>(new Map());
  const beatRef = useRef<number | null>(null);

  const previewDoc = () => {
    try {
      return previewRef.current?.contentDocument ?? null;
    } catch {
      return null;
    }
  };
  const snapshotSliders = (doc: Document) => {
    const map = defaultsRef.current;
    map.clear();
    doc.querySelectorAll<HTMLInputElement>('#knobs input').forEach((i) => map.set(i, i.value));
  };
  const restoreSliders = () => {
    defaultsRef.current.forEach((v, i) => {
      i.value = v;
    });
  };
  // Set a slider (and its paired number chip) to a value, clamped to its range.
  const setSlider = (doc: Document, key: string, tier: string, value: number) => {
    const tierSel = tier ? `[data-tier="${tier}"]` : ':not([data-tier])';
    const range = doc.querySelector<HTMLInputElement>(
      `input[type=range][data-key="${key}"]${tierSel}`
    );
    if (!range) return;
    range.value = String(value); // the range input clamps to its [min, max]
    const clamped = range.value;
    doc
      .querySelectorAll<HTMLInputElement>(`input.valuechip[data-key="${key}"]${tierSel}`)
      .forEach((c) => {
        c.value = clamped;
      });
  };

  const runStep = (step: number) => {
    const doc = previewDoc();
    if (!doc) return;
    if (step === 0) {
      setSlider(doc, DECISION_MARGIN_KEY, 'precise', 3);
      setSlider(doc, DECISION_MARGIN_KEY, 'average', 4);
      setSlider(doc, DECISION_MARGIN_KEY, 'loose', 6);
    } else if (step === 1) {
      setSlider(doc, SAME_ROW_KEY, '', 0.5);
    } else {
      restoreSliders();
    }
  };

  const handleEnter = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const doc = previewDoc();
    if (!doc) return;
    snapshotSliders(doc);
    let step = 0;
    runStep(step);
    beatRef.current = window.setInterval(() => {
      step = (step + 1) % 3;
      runStep(step);
    }, 900);
  };
  const handleLeave = () => {
    if (beatRef.current) {
      clearInterval(beatRef.current);
      beatRef.current = null;
    }
    restoreSliders();
  };
  useEffect(
    () => () => {
      if (beatRef.current) clearInterval(beatRef.current);
    },
    []
  );

  // Follow the portfolio's theme: dark → the tool's "midnight" (blue-accented
  // dark) palette, light → "daylight". Passed via ?theme=; the tool seeds this
  // before booting. The user can still switch themes inside the modal.
  const { resolvedTheme } = useTheme();
  const toolSrc = useMemo(
    () => `${TOOL_SRC}?theme=${resolvedTheme === 'dark' ? 'midnight' : 'daylight'}`,
    [resolvedTheme]
  );

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
    <div>
      <div className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-accent">
        Admin App (fully responsive)
      </div>
      <p className="mb-3 text-sm text-muted-foreground">
        Typing-UX admin tool. Aggregates behavior, scores it, recommends settings.
      </p>

      {/* Full-width, non-interactive preview. The tool is responsive, so the
          iframe renders at the container's real width. Hovering plays a scripted
          slider demo on the tool. */}
      <div
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        className="relative h-[560px] w-full overflow-hidden rounded-xl border border-border bg-card shadow-sm sm:h-[720px] lg:h-[820px]"
      >
        <iframe
          ref={previewRef}
          src={toolSrc}
          title="Typing-UX admin tool preview"
          loading="lazy"
          tabIndex={-1}
          aria-hidden
          className="pointer-events-none h-full w-full border-0"
        />
        {/* Click-catcher: the whole preview opens the tool. */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Expand the admin tool"
          className="absolute inset-0 cursor-pointer bg-transparent"
        />
      </div>

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-3 flex w-full items-center justify-center gap-2 text-sm font-medium text-primary transition hover:opacity-80"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" aria-hidden />
        Interact
        <Maximize2 className="h-4 w-4" />
      </button>

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
              src={toolSrc}
              title="Typing-UX admin tool"
              className="min-h-0 w-full flex-1 border-0"
            />
          </div>,
          document.body
        )}
    </div>
  );
}
