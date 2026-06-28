import { ChevronDown, ChevronRight, ChevronUp } from 'lucide-react';
import { AdminToolShowcase } from './AdminToolShowcase';

/**
 * "How it works" diagram for the typing-UX system. Each user's behavioral data
 * flows through their personalization layer back to them (updated personalized
 * settings), and also up to the Admin App, whose tuning publishes updated global
 * typing settings to all users. Styled to match the system-diagram reference
 * (card surfaces, blue/teal accents, animated dashed connectors, no icons).
 */

function Box({
  title,
  accent = false,
  className = '',
}: {
  title: string;
  accent?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center justify-center rounded-xl border bg-card px-4 py-3 text-center text-sm font-semibold leading-snug shadow-sm ${
        accent ? 'border-accent/40' : 'border-border'
      } ${className}`}
    >
      {title}
    </div>
  );
}

/** Horizontal animated dashed connector with an optional label above. */
function HArrow({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 self-center px-1 text-primary/70">
      {label && (
        <span className="whitespace-nowrap text-[10px] font-mono uppercase tracking-wide text-muted-foreground/80">
          {label}
        </span>
      )}
      <div className="flex w-full items-center">
        <span className="flow-dash-h h-0.5 flex-1" aria-hidden />
        <ChevronRight className="-ml-1 h-4 w-4 shrink-0" aria-hidden />
      </div>
    </div>
  );
}

/** Vertical animated dashed connector (up or down) with a label below. */
function VArrow({ label, up = false }: { label?: string; up?: boolean }) {
  return (
    <div className="flex w-full max-w-[15rem] flex-col items-center gap-1 text-primary/70">
      {up && <ChevronUp className="-mb-1 h-4 w-4" aria-hidden />}
      <span
        className="flow-dash-v h-10 w-0.5"
        style={up ? { animationDirection: 'reverse' } : undefined}
        aria-hidden
      />
      {!up && <ChevronDown className="-mt-1 h-4 w-4" aria-hidden />}
      {label && (
        <span className="text-center text-[10px] font-mono uppercase tracking-wide text-muted-foreground/80">
          {label}
        </span>
      )}
    </div>
  );
}

const USERS = ['User #1', 'User #2', 'User #3'];

/** A bordered container that groups the three user/profile boxes with a
 *  caption beneath them. Used for all three stages so they read as a set. */
function Group({ caption, accent = false }: { caption: string; accent?: boolean }) {
  return (
    <div className="flex h-full flex-col rounded-2xl border-2 border-border/80 p-3">
      <div className="flex flex-1 flex-col justify-between gap-3">
        {USERS.map((u) => (
          <Box key={u} title={u} accent={accent} />
        ))}
      </div>
      <div className="mt-3 text-center text-xs font-medium text-muted-foreground">{caption}</div>
    </div>
  );
}

const GROUP_BEHAVIOR = "Each user's typing behavior";
const GROUP_PERSONALIZATION = "Learns each user's typing profile, on device";
const GROUP_ALL_USERS = 'All Users';

export function TypingFlowDiagram() {
  return (
    <div className="reveal mt-8 rounded-2xl border border-border bg-card/60 p-6 shadow-sm lg:p-8">
      <div className="mb-6">
        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
          How it works
        </div>
        <h4 className="text-base font-semibold tracking-tight">
          From typing behavior to a better keyboard
        </h4>
      </div>

      {/* Top flow — desktop: user group → personalization layer → all users. */}
      <div className="hidden items-stretch gap-x-2 lg:grid lg:grid-cols-[minmax(0,1fr)_8rem_minmax(0,1fr)_8rem_minmax(0,1fr)]">
        <Group caption={GROUP_BEHAVIOR} accent />
        <HArrow label="Individual behavioral data" />
        <Group caption={GROUP_PERSONALIZATION} />
        <HArrow label="Updated personalized settings" />
        <Group caption={GROUP_ALL_USERS} accent />
      </div>

      {/* Top flow — mobile: stacked. */}
      <div className="space-y-4 lg:hidden">
        <Group caption={GROUP_BEHAVIOR} accent />
        <div className="flex justify-center">
          <VArrow label="Individual behavioral data" />
        </div>
        <Group caption={GROUP_PERSONALIZATION} />
        <div className="flex justify-center">
          <VArrow label="Updated personalized settings" />
        </div>
        <Group caption={GROUP_ALL_USERS} accent />
      </div>

      {/* Loop connectors: behavioral data flows down (centered on the left user
          group) to the Admin App; global settings flow back up (centered on the
          All Users group). */}
      <div className="mt-6 hidden lg:grid lg:grid-cols-[minmax(0,1fr)_8rem_minmax(0,1fr)_8rem_minmax(0,1fr)]">
        <div className="col-start-1 flex justify-center">
          <VArrow label="Behavioral data" />
        </div>
        <div className="col-start-5 flex justify-center">
          <VArrow up label="Updated global typing settings" />
        </div>
      </div>
      <div className="mt-6 grid grid-cols-2 items-start gap-4 lg:hidden">
        <div className="flex justify-center">
          <VArrow label="Behavioral data" />
        </div>
        <div className="flex justify-center">
          <VArrow up label="Updated global typing settings" />
        </div>
      </div>

      {/* Admin App — the embedded tuning tool. */}
      <div className="mt-1 rounded-2xl border border-border bg-card/40 p-4 sm:p-6">
        <AdminToolShowcase />
      </div>
    </div>
  );
}
