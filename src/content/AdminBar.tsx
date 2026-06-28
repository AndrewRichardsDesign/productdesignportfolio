import { useState } from 'react';
import { Check, ExternalLink, Eye, EyeOff, List, Loader2, LogOut, RotateCcw, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ADMIN_TARGET, useContent } from './ContentContext';
import { ContentEditorPanel } from './ContentEditorPanel';
import { lockAdmin } from '@/lib/adminAuth';

/**
 * Floating control bar shown only in admin mode (#/admin). Lets the editor
 * paste a GitHub token, commit changes back to the repo, and exit.
 */
export function AdminBar() {
  const { isAdmin, dirty, token, branch, saveState, setToken, setBranch, save, discardChanges } =
    useContent();
  const [showToken, setShowToken] = useState(false);
  const [open, setOpen] = useState(true);
  const [panelOpen, setPanelOpen] = useState(false);

  if (!isAdmin) return null;

  const exitAdmin = () => {
    // Strip any admin URL flag first, then clear the persistent session so the
    // flag can't immediately re-unlock it.
    const hash = window.location.hash;
    const path = hash.startsWith('#/') ? hash.slice(2).split('?')[0] : '';
    const dest = path === 'admin' ? '' : path;
    const target = dest ? `#/${dest}` : '#/';
    if (window.location.hash !== target) window.location.hash = target;
    lockAdmin();
  };

  const saving = saveState.status === 'saving';

  return (
    <>
    <ContentEditorPanel open={panelOpen} onClose={() => setPanelOpen(false)} />
    <div className="fixed bottom-4 left-1/2 z-[100] w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2">
      <div className="rounded-2xl border border-border/70 bg-background/95 shadow-2xl backdrop-blur-xl">
        {/* Header row */}
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="inline-flex h-2.5 w-2.5 flex-shrink-0 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-semibold">Admin mode</span>
            {dirty ? (
              <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400">
                Unsaved changes
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">No unsaved changes</span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <Button
              size="sm"
              variant="ghost"
              className="h-8 px-2 text-xs"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? 'Hide settings' : 'Settings'}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={exitAdmin}
              title="Exit admin mode"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {open && (
          <div className="space-y-3 border-t border-border/60 px-4 py-3">
            {/* Token + branch */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                GitHub token (fine-grained, with “Contents: write” on this repo)
              </label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Input
                    type={showToken ? 'text' : 'password'}
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="github_pat_…"
                    autoComplete="off"
                    spellCheck={false}
                    className="h-9 pr-9 font-mono text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowToken((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showToken ? 'Hide token' : 'Show token'}
                  >
                    {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <Input
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  placeholder="branch"
                  spellCheck={false}
                  className="h-9 w-28 text-xs"
                  title="Branch to commit to"
                />
              </div>
              <p className="text-[11px] leading-snug text-muted-foreground">
                Commits to{' '}
                <code className="rounded bg-muted px-1 py-0.5">
                  {ADMIN_TARGET.owner}/{ADMIN_TARGET.repo}
                </code>{' '}
                at <code className="rounded bg-muted px-1 py-0.5">{ADMIN_TARGET.path}</code>. The
                token is stored only in this browser.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <Button size="sm" onClick={save} disabled={saving || !dirty} className="gap-1.5">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {saving ? 'Saving…' : 'Save to GitHub'}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPanelOpen(true)}
                className="gap-1.5"
              >
                <List className="h-4 w-4" />
                Edit all content
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={discardChanges}
                disabled={!dirty || saving}
                className="gap-1.5"
              >
                <RotateCcw className="h-4 w-4" />
                Discard
              </Button>
              <a
                href={`https://github.com/${ADMIN_TARGET.owner}/${ADMIN_TARGET.repo}/commits/${branch}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                View commits <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            {/* Status */}
            {saveState.status === 'success' && (
              <div className="flex items-start gap-2 rounded-lg bg-emerald-500/10 px-3 py-2 text-xs text-emerald-700 dark:text-emerald-400">
                <Check className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>{saveState.message}</span>
              </div>
            )}
            {saveState.status === 'error' && (
              <div className="flex items-start gap-2 rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-700 dark:text-red-400">
                <X className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>{saveState.message}</span>
              </div>
            )}

            <p className="text-[11px] leading-snug text-muted-foreground">
              Click any text on the page to edit it (Enter confirms, click away to finish), or
              click an image to change it. Use <span className="font-medium">Edit all content</span>{' '}
              for every field, including links and form options.
            </p>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
