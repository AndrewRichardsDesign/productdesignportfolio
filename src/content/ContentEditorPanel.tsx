import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useContent } from './ContentContext';

/**
 * A full content editor that auto-generates an input for every field in the
 * content store. This guarantees *all* content is editable — including values
 * that can't use inline editing (link URLs, image paths, form placeholders,
 * select options, numbers). On-page inline editing remains for convenience.
 */
export function ContentEditorPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { content } = useContent();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[110] flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative flex h-full w-full max-w-md flex-col bg-background shadow-2xl">
        <header className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="text-base font-semibold">Edit all content</h2>
            <p className="text-xs text-muted-foreground">Every field on the site. Changes save with the admin bar.</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
            <X className="h-4 w-4" />
          </Button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {Object.entries(content as unknown as Record<string, unknown>).map(([key, value]) => (
            <details key={key} className="border-b border-border/60 py-2" open={key === 'nav'}>
              <summary className="cursor-pointer select-none py-2 text-sm font-semibold capitalize">
                {prettify(key)}
              </summary>
              <div className="space-y-3 pb-3 pl-1">
                <Node value={value} path={key} label="" depth={0} />
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}

function Node({
  value,
  path,
  label,
  depth,
}: {
  value: unknown;
  path: string;
  label: string;
  depth: number;
}) {
  if (typeof value === 'string' || typeof value === 'number') {
    return <FieldInput path={path} value={value} label={label || prettify(lastKey(path))} numeric={typeof value === 'number'} />;
  }

  if (Array.isArray(value)) {
    return (
      <div className="space-y-3">
        {value.map((item, i) => (
          <div
            key={i}
            className={
              typeof item === 'object' && item !== null
                ? 'rounded-lg border border-border/60 p-3'
                : ''
            }
          >
            {typeof item === 'object' && item !== null && (
              <div className="mb-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                {(label || prettify(lastKey(path)))} {i + 1}
              </div>
            )}
            <Node value={item} path={`${path}.${i}`} label={`${label || prettify(lastKey(path))} ${i + 1}`} depth={depth + 1} />
          </div>
        ))}
      </div>
    );
  }

  if (typeof value === 'object' && value !== null) {
    return (
      <div className={depth > 0 ? 'space-y-3 border-l border-border/40 pl-3' : 'space-y-3'}>
        {Object.entries(value as Record<string, unknown>).map(([k, v]) => (
          <Node key={k} value={v} path={`${path}.${k}`} label={prettify(k)} depth={depth + 1} />
        ))}
      </div>
    );
  }

  return null;
}

function FieldInput({
  path,
  value,
  label,
  numeric,
}: {
  path: string;
  value: string | number;
  label: string;
  numeric: boolean;
}) {
  const { setText } = useContent();
  const current = String(value);

  // Uncontrolled (defaultValue + key) so typing never triggers a global
  // re-render; the value is committed to the store on blur. The key remounts
  // the field if the value changes externally (e.g. via inline editing).
  const commit = (raw: string) => {
    if (numeric) {
      const n = Number(raw);
      setText(path, Number.isFinite(n) ? n : 0);
    } else if (raw !== current) {
      setText(path, raw);
    }
  };

  const multiline = !numeric && current.length > 48;
  const baseClass =
    'w-full rounded-md border border-border bg-card/50 px-2.5 py-1.5 text-xs text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/20';

  return (
    <label className="block space-y-1">
      <span className="text-[11px] font-medium text-muted-foreground">{label}</span>
      {multiline ? (
        <textarea
          key={current}
          defaultValue={current}
          rows={3}
          spellCheck={false}
          onBlur={(e) => commit(e.target.value)}
          className={`${baseClass} resize-y`}
        />
      ) : (
        <input
          key={current}
          defaultValue={current}
          type={numeric ? 'number' : 'text'}
          spellCheck={false}
          onBlur={(e) => commit(e.target.value)}
          className={baseClass}
        />
      )}
    </label>
  );
}

function lastKey(path: string): string {
  const parts = path.split('.');
  return parts[parts.length - 1];
}

function prettify(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}
