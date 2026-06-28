import {
  ArrowDown,
  ArrowRight,
  Gauge,
  Keyboard,
  Network,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/**
 * Simple flow diagram for the "The need for better typing UX" subsection.
 * Shows how typing behavior moves from devices into two paths: the on-device
 * personalization layer (which adapts each user's typing UX) and the admin
 * tuning tool (whose published settings shape the shipped typing experience).
 *
 * Static, presentational, and styled with the same tokens as the page's other
 * diagram cards (rounded-2xl muted card, primary icon badges, arrow connectors).
 */
function Node({
  icon: Icon,
  title,
  sub,
  accent = false,
  className = '',
}: {
  icon: LucideIcon;
  title: string;
  sub: string;
  accent?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${
        accent ? 'border-primary/30 bg-primary/5' : 'border-border/60 bg-background/70'
      } ${className}`}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <div className="text-sm font-semibold leading-snug">{title}</div>
        <div className="mt-0.5 text-xs leading-snug text-muted-foreground">{sub}</div>
      </div>
    </div>
  );
}

/**
 * Arrow connector: points down when nodes are stacked, right once they sit in a
 * row. `at` is the breakpoint where the surrounding layout turns horizontal —
 * 'lg' for the device→paths split, 'sm' for the node→outcome steps within a path.
 */
function Arrow({ label, at }: { label?: string; at: 'sm' | 'lg' }) {
  const wrap = at === 'lg' ? 'lg:flex-col' : 'sm:flex-col';
  const down = at === 'lg' ? 'lg:hidden' : 'sm:hidden';
  const right = at === 'lg' ? 'hidden lg:block' : 'hidden sm:block';
  return (
    <div className={`flex shrink-0 items-center justify-center gap-1 ${wrap}`}>
      <ArrowDown className={`h-4 w-4 text-muted-foreground ${down}`} />
      <ArrowRight className={`h-4 w-4 text-muted-foreground ${right}`} />
      {label && (
        <span className="text-[10px] font-mono uppercase tracking-wide text-muted-foreground/80">
          {label}
        </span>
      )}
    </div>
  );
}

export function TypingFlowDiagram() {
  return (
    <div className="reveal mt-8 rounded-2xl bg-muted/40 p-6 lg:p-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Network className="h-5 w-5" />
        </div>
        <div>
          <div className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
            How it works
          </div>
          <h4 className="text-base font-semibold">From typing behavior to a better keyboard</h4>
        </div>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <Node
          icon={Smartphone}
          title="Individual devices"
          sub="Each user's typing behavior"
          className="lg:w-56"
        />
        <Arrow label="behavior data" at="lg" />

        <div className="flex flex-1 flex-col gap-4">
          {/* On-device personalization path */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Node
              icon={Sparkles}
              title="Personalization layer"
              sub="Learns each user's typing profile, on device"
              className="flex-1"
            />
            <Arrow at="sm" />
            <Node
              icon={Keyboard}
              title="Personalized typing UX"
              sub="Corrections adapt to each user in the moment"
              accent
              className="flex-1"
            />
          </div>

          {/* Admin-tuning path */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Node
              icon={SlidersHorizontal}
              title="Typing-UX admin tool"
              sub="Aggregates behavior, scores it, recommends settings"
              className="flex-1"
            />
            <Arrow label="settings" at="sm" />
            <Node
              icon={Gauge}
              title="Tuned typing experience"
              sub="Published settings tune the shipped keyboard for everyone"
              accent
              className="flex-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
