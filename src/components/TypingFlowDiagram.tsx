import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from 'lucide-react';
import { AdminToolShowcase } from './AdminToolShowcase';

/**
 * "How it works" diagram for the typing-UX system, animated as a two-step loop:
 *
 *   Step 1 (data out):  each user's behavior flows right into their
 *     personalization layer, and the aggregate flows down to the Admin App.
 *   Step 2 (settings back): updated personalized settings flow left back to
 *     each user, and updated global typing settings flow up from the Admin App.
 *
 * The "All Users" group (users + personalization layer + the labelled channel
 * between them) is centered and only as wide as it needs to be; the Admin App
 * preview spans the full width beneath it. Styled to match the system-diagram
 * reference (card surfaces, blue/teal accents, animated dashed connectors).
 */

const USERS = ['User #1', 'User #2', 'User #3'];

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

const LABEL = 'text-center text-[10px] font-mono uppercase leading-tight tracking-wide text-muted-foreground/90';

/** A single horizontal flow line + arrowhead, flowing right or (reverse) left. */
function HFlow({ reverse = false }: { reverse?: boolean }) {
  return (
    <div className="flex w-full items-center text-primary/80">
      {reverse && <ChevronLeft className="-mr-1 h-4 w-4 shrink-0" aria-hidden />}
      <span
        className="flow-dash-h h-0.5 flex-1"
        style={reverse ? { animationDirection: 'reverse' } : undefined}
        aria-hidden
      />
      {!reverse && <ChevronRight className="-ml-1 h-4 w-4 shrink-0" aria-hidden />}
    </div>
  );
}

/** A single vertical flow line + arrowhead with a label beneath it. */
function VFlow({ label, up = false }: { label: string; up?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1 text-primary/80">
      {up && <ChevronUp className="-mb-2 h-4 w-4" aria-hidden />}
      <span
        className="flow-dash-v h-12 w-0.5"
        style={up ? { animationDirection: 'reverse' } : undefined}
        aria-hidden
      />
      {!up && <ChevronDown className="-mt-2 h-4 w-4" aria-hidden />}
      <span className={`mt-1 max-w-[12rem] ${LABEL}`}>{label}</span>
    </div>
  );
}

/** The vertical connector between "All Users" and the Admin App: step 1 sends
 *  aggregated data down, step 2 sends updated settings up. */
function VConnector() {
  return (
    <div className="my-5 grid justify-center">
      <div className="col-start-1 row-start-1 flow-step-a">
        <VFlow label="Aggregated behavioral data" />
      </div>
      <div className="col-start-1 row-start-1 flow-step-b">
        <VFlow up label="Updated global typing settings" />
      </div>
    </div>
  );
}

/** The "All Users" group: users on the left, personalization layers on the
 *  right, with the labelled two-way channel in the middle. */
function AllUsersGroup() {
  return (
    <div className="mx-auto w-full max-w-3xl rounded-2xl border-2 border-border/80 p-5">
      {/* Desktop: three columns (users · channel · personalization). */}
      <div
        className="hidden items-stretch gap-x-1 gap-y-3 sm:grid"
        style={{
          gridTemplateColumns: 'minmax(5.5rem,1fr) minmax(7rem,12rem) minmax(5.5rem,1fr)',
          gridTemplateRows: '1.5rem repeat(3, minmax(3rem, auto))',
        }}
      >
        {/* Channel: bordered box spanning the label row + the three user rows. */}
        <div
          style={{ gridColumn: 2, gridRow: '1 / span 4' }}
          className="pointer-events-none relative rounded-lg border border-border/70"
        >
          <div className="absolute inset-x-1 top-1.5 grid">
            <span className={`col-start-1 row-start-1 flow-step-a ${LABEL}`}>
              Individual behavioral data
            </span>
            <span className={`col-start-1 row-start-1 flow-step-b ${LABEL}`}>
              Updated personalized settings
            </span>
          </div>
        </div>

        {USERS.map((u, i) => (
          <div key={u} style={{ gridColumn: 1, gridRow: i + 2 }} className="flex">
            <Box title={u} accent className="w-full" />
          </div>
        ))}
        {USERS.map((_, i) => (
          <div
            key={i}
            style={{ gridColumn: 3, gridRow: i + 2 }}
            className="flex"
          >
            <Box title="Personalization Layer" className="w-full" />
          </div>
        ))}

        {/* Two-way arrows, one per row: right in step 1, left in step 2. */}
        {USERS.map((_, i) => (
          <div key={`a${i}`} className="relative" style={{ gridColumn: 2, gridRow: i + 2 }}>
            <div className="absolute inset-0 flex items-center px-1 flow-step-a">
              <HFlow />
            </div>
            <div className="absolute inset-0 flex items-center px-1 flow-step-b">
              <HFlow reverse />
            </div>
          </div>
        ))}
      </div>

      {/* Mobile: stacked (users → channel → personalization). */}
      <div className="sm:hidden">
        <div className="space-y-3">
          {USERS.map((u) => (
            <Box key={u} title={u} accent />
          ))}
        </div>
        <div className="my-3 grid justify-center">
          <div className="col-start-1 row-start-1 flow-step-a">
            <VFlow label="Individual behavioral data" />
          </div>
          <div className="col-start-1 row-start-1 flow-step-b">
            <VFlow up label="Updated personalized settings" />
          </div>
        </div>
        <div className="space-y-3">
          {USERS.map((_, i) => (
            <Box key={i} title="Personalization Layer" />
          ))}
        </div>
      </div>

      <div className="mt-4 text-center text-xs font-medium text-muted-foreground">All Users</div>
    </div>
  );
}

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

      {/* Centered, intrinsic-width group. */}
      <AllUsersGroup />

      {/* Centered vertical connector to the Admin App. */}
      <VConnector />

      {/* Admin App — full width. */}
      <div className="w-full rounded-2xl border border-border bg-card/40 p-4 sm:p-6">
        <AdminToolShowcase />
      </div>
    </div>
  );
}
