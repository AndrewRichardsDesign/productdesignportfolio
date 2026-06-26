import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  Sparkles,
  ShieldCheck,
  HelpCircle,
  GraduationCap,
  Globe,
  SlidersHorizontal,
  ChevronLeft,
  Video,
  Plus,
  Mic,
  ArrowBigUp,
  Delete,
  Wifi,
  SignalHigh,
  BatteryFull,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*  Data                                                                       */
/* -------------------------------------------------------------------------- */

type ControlId = 'lang' | 'reword' | 'check' | 'clarify' | 'learn' | 'nuance';

type Control = {
  id: ControlId;
  icon: LucideIcon;
  tag: string;
  title: string;
  desc: string;
};

const CONTROLS: Control[] = [
  {
    id: 'lang',
    icon: Globe,
    tag: 'Language pair',
    title: 'Language pair',
    desc: 'Set the two languages you’re translating between. Arcatext lives inside any messaging app, so the pair travels with you across iMessage, WhatsApp, HelloTalk, and more.',
  },
  {
    id: 'reword',
    icon: Sparkles,
    tag: 'Reword & translate',
    title: 'Reword & translate',
    desc: 'Translate or refine your message while preserving intent, tone, and language-specific nuance — including same-language clean-ups for clarity and grammar.',
  },
  {
    id: 'check',
    icon: ShieldCheck,
    tag: 'Check',
    title: 'Check before you send',
    desc: 'Inspect the result before sending. Reverse translation, alternate phrasings, and a glanceable naturalness read build trust in the output and confidence in you.',
  },
  {
    id: 'clarify',
    icon: HelpCircle,
    tag: 'Clarify',
    title: 'Clarify the meaning',
    desc: 'Resolve ambiguity — homographs, gender, formality, and script — so the meaning stays in your control instead of hidden inside a translation black box.',
  },
  {
    id: 'learn',
    icon: GraduationCap,
    tag: 'Learn',
    title: 'Learn from every message',
    desc: 'Turn each interaction into vocabulary, grammar, and confidence — building a personalized learning path from the real conversations you actually want to have.',
  },
  {
    id: 'nuance',
    icon: SlidersHorizontal,
    tag: 'Nuance controls',
    title: 'Nuance controls',
    desc: 'Expose hidden translation decisions like gender, register, and writing system, with romanization to bridge non-Roman scripts before full literacy.',
  },
];

/* -------------------------------------------------------------------------- */
/*  Geometry helpers                                                           */
/* -------------------------------------------------------------------------- */

type Pt = { x: number; y: number };
type Line = { x1: number; y1: number; x2: number; y2: number };

/** Point where the ray from a rect's center toward `target` crosses its border. */
function borderPoint(
  rect: { x: number; y: number; w: number; h: number },
  target: Pt
): Pt {
  const cx = rect.x + rect.w / 2;
  const cy = rect.y + rect.h / 2;
  const dx = target.x - cx;
  const dy = target.y - cy;
  if (dx === 0 && dy === 0) return { x: cx, y: cy };
  const hw = rect.w / 2;
  const hh = rect.h / 2;
  const scale = 1 / Math.max(Math.abs(dx) / hw, Math.abs(dy) / hh);
  return { x: cx + dx * scale, y: cy + dy * scale };
}

/* -------------------------------------------------------------------------- */
/*  Hotspot dot                                                                */
/* -------------------------------------------------------------------------- */

function Hotspot({
  active,
  control,
  onToggle,
  registerRef,
}: {
  active: boolean;
  control: Control;
  onToggle: (id: ControlId) => void;
  registerRef: (id: ControlId, el: HTMLButtonElement | null) => void;
}) {
  return (
    <button
      type="button"
      ref={(el) => registerRef(control.id, el)}
      onClick={(e) => {
        e.stopPropagation();
        onToggle(control.id);
      }}
      aria-label={`${control.title} — show description`}
      aria-pressed={active}
      className="absolute left-1/2 top-1/2 z-30 flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
    >
      {/* pulsing ring */}
      {!active && (
        <span
          className="absolute h-3 w-3 rounded-full motion-safe:animate-ping"
          style={{ backgroundColor: '#3b82f6', opacity: 0.65 }}
        />
      )}
      {/* solid dot */}
      <span
        className="relative h-3 w-3 rounded-full ring-2 ring-white"
        style={{
          backgroundColor: active ? '#1d4ed8' : '#3b82f6',
          boxShadow: active
            ? '0 0 0 5px rgba(29,78,216,0.25)'
            : '0 0 0 4px rgba(59,130,246,0.22)',
        }}
      />
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*  Phone pieces                                                               */
/* -------------------------------------------------------------------------- */

/** A keyboard key. */
function Key({
  children,
  flex,
  wide,
  icon: Icon,
  dark,
}: {
  children?: React.ReactNode;
  flex?: boolean;
  wide?: boolean;
  icon?: LucideIcon;
  dark?: boolean;
}) {
  return (
    <div
      className={[
        'flex h-9 items-center justify-center rounded-[5px] text-[13px] font-medium text-neutral-900 select-none',
        dark ? 'bg-[#abb0bb]' : 'bg-white',
        'shadow-[0_1px_0_rgba(0,0,0,0.28)]',
        flex ? 'flex-1' : '',
        wide ? 'px-3' : 'min-w-[20px] flex-1',
      ].join(' ')}
    >
      {Icon ? <Icon className="h-[18px] w-[18px] text-neutral-800" strokeWidth={2} /> : children}
    </div>
  );
}

function ToolButton({
  control,
  primary,
  activeId,
  onToggle,
  registerRef,
}: {
  control: Control;
  primary?: boolean;
  activeId: ControlId | null;
  onToggle: (id: ControlId) => void;
  registerRef: (id: ControlId, el: HTMLButtonElement | null) => void;
}) {
  const Icon = control.icon;
  const active = activeId === control.id;
  return (
    <div
      className={[
        'relative flex h-10 flex-1 flex-col items-center justify-center gap-[3px] rounded-xl transition-colors',
        primary ? 'text-white' : 'text-neutral-700',
        active ? 'ring-2 ring-[#3b82f6]/60' : '',
      ].join(' ')}
      style={
        primary
          ? { backgroundImage: 'linear-gradient(135deg,#6d5ef0,#3aa6c9)' }
          : { backgroundColor: '#eef0f4' }
      }
    >
      <Icon className="h-[17px] w-[17px]" strokeWidth={2} />
      <span className="text-[8.5px] font-semibold leading-none">{control.tag.split(' ')[0]}</span>
      <Hotspot
        active={active}
        control={control}
        onToggle={onToggle}
        registerRef={registerRef}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main component                                                             */
/* -------------------------------------------------------------------------- */

export default function ArcatextKeyboardDiagram() {
  const [activeId, setActiveId] = useState<ControlId | null>('reword');
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [line, setLine] = useState<Line | null>(null);

  const registerRef = useCallback((id: ControlId, el: HTMLButtonElement | null) => {
    dotRefs.current[id] = el;
  }, []);

  const onToggle = useCallback((id: ControlId) => {
    setActiveId((cur) => (cur === id ? null : id));
  }, []);

  const measure = useCallback(() => {
    const container = containerRef.current;
    const card = cardRef.current;
    if (!container || !card || !activeId) {
      setLine(null);
      return;
    }
    const dot = dotRefs.current[activeId];
    if (!dot) {
      setLine(null);
      return;
    }
    const cb = container.getBoundingClientRect();
    const db = dot.getBoundingClientRect();
    const kb = card.getBoundingClientRect();

    const dotC: Pt = {
      x: db.left + db.width / 2 - cb.left,
      y: db.top + db.height / 2 - cb.top,
    };
    const cardRect = {
      x: kb.left - cb.left,
      y: kb.top - cb.top,
      w: kb.width,
      h: kb.height,
    };

    const start = borderPoint(cardRect, dotC);
    // Stop the arrow head a touch short of the dot center.
    const ang = Math.atan2(dotC.y - start.y, dotC.x - start.x);
    const end: Pt = {
      x: dotC.x - Math.cos(ang) * 11,
      y: dotC.y - Math.sin(ang) * 11,
    };
    setLine({ x1: start.x, y1: start.y, x2: end.x, y2: end.y });
  }, [activeId]);

  useLayoutEffect(() => {
    measure();
    const raf = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(raf);
  }, [measure]);

  useEffect(() => {
    const onResize = () => measure();
    window.addEventListener('resize', onResize);
    const ro = new ResizeObserver(() => measure());
    if (containerRef.current) ro.observe(containerRef.current);
    // Re-measure once fonts settle.
    const t = setTimeout(measure, 250);
    return () => {
      window.removeEventListener('resize', onResize);
      ro.disconnect();
      clearTimeout(t);
    };
  }, [measure]);

  const activeIndex = CONTROLS.findIndex((c) => c.id === activeId);
  const active = activeIndex >= 0 ? CONTROLS[activeIndex] : null;

  return (
    <div className="reveal">
      {/* Heading */}
      <div className="mb-10 max-w-2xl">
        <div className="mb-4 flex items-baseline gap-4">
          <span className="font-mono text-sm tracking-wider text-primary/70">◆</span>
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Interactive · The keyboard
          </span>
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          The Arcatext keyboard, <span className="gradient-text">up close</span>
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          A custom keyboard that lives inside any messaging app. Tap a glowing blue
          dot to see what each control does.
        </p>
      </div>

      {/* Diagram */}
      <div
        ref={containerRef}
        onClick={() => setActiveId(null)}
        className="relative flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:justify-center lg:gap-16"
      >
        {/* connector arrow */}
        <svg
          className="pointer-events-none absolute inset-0 z-20 h-full w-full overflow-visible"
          aria-hidden="true"
        >
          <defs>
            <marker
              id="arc-arrowhead"
              markerWidth="9"
              markerHeight="9"
              refX="6"
              refY="3"
              orient="auto"
            >
              <path d="M0,0 L6,3 L0,6 Z" fill="#3b82f6" />
            </marker>
          </defs>
          {line && (
            <line
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="#3b82f6"
              strokeWidth={2}
              strokeDasharray="5 4"
              markerEnd="url(#arc-arrowhead)"
            />
          )}
        </svg>

        {/* ---------------- iPhone ---------------- */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative z-10 w-[286px] shrink-0 sm:w-[300px]"
        >
          <div className="relative rounded-[2.7rem] bg-neutral-900 p-2.5 shadow-2xl ring-1 ring-black/50">
            {/* side buttons */}
            <div className="absolute -left-[3px] top-24 h-12 w-[3px] rounded-l bg-neutral-700" />
            <div className="absolute -left-[3px] top-40 h-12 w-[3px] rounded-l bg-neutral-700" />
            <div className="absolute -right-[3px] top-32 h-16 w-[3px] rounded-r bg-neutral-700" />

            <div className="relative overflow-hidden rounded-[2.2rem] bg-[#f3f3f7]">
              {/* dynamic island */}
              <div className="absolute left-1/2 top-2 z-20 h-6 w-[86px] -translate-x-1/2 rounded-full bg-black" />

              {/* status bar */}
              <div className="flex items-center justify-between px-6 pb-1 pt-2.5 text-[11px] font-semibold text-neutral-900">
                <span>9:41</span>
                <div className="flex items-center gap-1">
                  <SignalHigh className="h-3.5 w-3.5" />
                  <Wifi className="h-3.5 w-3.5" />
                  <BatteryFull className="h-4 w-4" />
                </div>
              </div>

              {/* messages header */}
              <div className="flex items-center gap-2 border-b border-black/10 bg-[#f7f7fa]/90 px-3 py-2 backdrop-blur">
                <ChevronLeft className="h-5 w-5 text-[#1f8aff]" />
                <div className="flex flex-1 flex-col items-center">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#6d5ef0] to-[#3aa6c9] text-[11px] font-semibold text-white">
                    S
                  </div>
                  <span className="mt-0.5 text-[10px] font-medium text-neutral-700">
                    Sofía · Español
                  </span>
                </div>
                <Video className="h-5 w-5 text-[#1f8aff]" />
              </div>

              {/* conversation */}
              <div className="space-y-2 px-3 py-3">
                <div className="flex justify-start">
                  <div className="max-w-[78%] rounded-2xl rounded-bl-md bg-[#e9e9eb] px-3 py-2 text-[12.5px] leading-snug text-neutral-900">
                    ¿Vienes a la fiesta el sábado?
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="max-w-[78%] rounded-2xl rounded-br-md bg-[#1f8aff] px-3 py-2 text-[12.5px] leading-snug text-white">
                    ¡Claro! ¿A qué hora empieza?
                  </div>
                </div>
              </div>

              {/* compose field */}
              <div className="flex items-center gap-2 px-3 pb-2">
                <Plus className="h-5 w-5 text-neutral-500" />
                <div className="flex flex-1 items-center justify-between rounded-full border border-black/10 bg-white px-3 py-1.5">
                  <span className="text-[12.5px] text-neutral-800">
                    Are you coming Saturday?
                  </span>
                  <Mic className="h-4 w-4 text-neutral-400" />
                </div>
              </div>

              {/* ---------------- Arcatext keyboard ---------------- */}
              <div className="bg-[#d3d6dd]">
                {/* Arcatext toolbar */}
                <div className="border-b border-black/10 bg-white/85 px-2.5 py-2 backdrop-blur">
                  {/* language pair + live translation preview */}
                  <div className="mb-2 flex items-center gap-2">
                    <div className="relative flex items-center gap-1 rounded-full bg-[#eef0f4] px-2.5 py-1">
                      <Globe className="h-3.5 w-3.5 text-neutral-600" />
                      <span className="text-[10px] font-semibold text-neutral-700">
                        EN&nbsp;→&nbsp;ES
                      </span>
                      <Hotspot
                        active={activeId === 'lang'}
                        control={CONTROLS[0]}
                        onToggle={onToggle}
                        registerRef={registerRef}
                      />
                    </div>
                    <div className="min-w-0 flex-1 leading-tight">
                      <div className="text-[8px] font-semibold uppercase tracking-wide text-neutral-400">
                        Spanish
                      </div>
                      <div className="truncate text-[11.5px] font-medium text-neutral-800">
                        ¿Vienes el sábado?
                      </div>
                    </div>
                  </div>

                  {/* action buttons */}
                  <div className="flex items-stretch gap-1.5">
                    <ToolButton control={CONTROLS[1]} primary activeId={activeId} onToggle={onToggle} registerRef={registerRef} />
                    <ToolButton control={CONTROLS[2]} activeId={activeId} onToggle={onToggle} registerRef={registerRef} />
                    <ToolButton control={CONTROLS[3]} activeId={activeId} onToggle={onToggle} registerRef={registerRef} />
                    <ToolButton control={CONTROLS[4]} activeId={activeId} onToggle={onToggle} registerRef={registerRef} />
                    <ToolButton control={CONTROLS[5]} activeId={activeId} onToggle={onToggle} registerRef={registerRef} />
                  </div>
                </div>

                {/* QWERTY */}
                <div className="space-y-1.5 px-1.5 pb-1.5 pt-2">
                  <div className="flex gap-[5px]">
                    {'qwertyuiop'.split('').map((k) => (
                      <Key key={k}>{k}</Key>
                    ))}
                  </div>
                  <div className="flex gap-[5px] px-3">
                    {'asdfghjkl'.split('').map((k) => (
                      <Key key={k}>{k}</Key>
                    ))}
                  </div>
                  <div className="flex gap-[5px]">
                    <Key dark wide icon={ArrowBigUp} />
                    {'zxcvbnm'.split('').map((k) => (
                      <Key key={k}>{k}</Key>
                    ))}
                    <Key dark wide icon={Delete} />
                  </div>
                  <div className="flex gap-[5px]">
                    <Key dark wide>
                      <span className="text-[12px]">123</span>
                    </Key>
                    <Key dark icon={Globe} />
                    <div className="flex h-9 flex-[4] items-center justify-center rounded-[5px] bg-white text-[12px] font-medium text-neutral-500 shadow-[0_1px_0_rgba(0,0,0,0.28)]">
                      space
                    </div>
                    <div className="flex h-9 flex-[2] items-center justify-center rounded-[5px] bg-[#1f8aff] text-[12px] font-semibold text-white shadow-[0_1px_0_rgba(0,0,0,0.28)]">
                      return
                    </div>
                  </div>
                  {/* home indicator */}
                  <div className="flex justify-center pt-1.5">
                    <div className="h-1 w-28 rounded-full bg-black/30" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ---------------- Annotation card ---------------- */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md self-center lg:w-[340px]"
        >
          <div ref={cardRef}>
            {active ? (
              <div className="rounded-2xl border border-border/60 bg-card/80 p-6 shadow-lg backdrop-blur lg:p-7">
                <div className="mb-3 flex items-center gap-3">
                  <span
                    className="flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold text-white"
                    style={{ backgroundColor: '#3b82f6' }}
                  >
                    {activeIndex + 1}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    Keyboard control
                  </span>
                </div>
                <h3 className="mb-2 text-xl font-semibold">{active.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {active.desc}
                </p>

                {/* mini step rail */}
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {CONTROLS.map((c, i) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setActiveId(c.id)}
                      className={[
                        'rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors',
                        c.id === activeId
                          ? 'bg-primary/15 text-primary'
                          : 'bg-muted/60 text-muted-foreground hover:text-foreground',
                      ].join(' ')}
                    >
                      {i + 1}. {c.tag}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border/60 bg-card/40 p-6 text-center lg:p-7">
                <div className="mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#3b82f6]/15">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: '#3b82f6' }} />
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Tap a glowing blue dot on the keyboard to reveal what each Arcatext
                  control does and how it turns a message into a learning moment.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
