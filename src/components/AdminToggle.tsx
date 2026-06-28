import { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { tryUnlockAdmin } from '@/lib/adminAuth';

/**
 * Subtle "Admin" button shown at the bottom of every page. Opens a password
 * prompt; a correct password enters admin (inline editing) mode, which then
 * persists across navigation. Hidden once admin is active — the AdminBar
 * handles editing and exiting from there.
 */
export function AdminToggle({ isAdmin }: { isAdmin: boolean }) {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  if (isAdmin) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tryUnlockAdmin(password)) {
      setOpen(false);
      setPassword('');
    } else {
      setError(true);
    }
  };

  return (
    <div className="relative border-t border-border/20 py-6 text-center">
      <button
        type="button"
        onClick={() => {
          setPassword('');
          setError(false);
          setOpen(true);
        }}
        className="text-xs font-medium text-muted-foreground/50 hover:text-foreground transition-colors"
      >
        Admin
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 sm:mx-0">
              <ShieldCheck className="h-5 w-5 text-primary" />
            </div>
            <DialogTitle>Admin mode</DialogTitle>
            <DialogDescription>
              Enter the admin password to edit page content inline.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Input
                type="password"
                autoFocus
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(false);
                }}
                placeholder="Password"
                aria-invalid={error}
                aria-label="Admin password"
              />
              {error && (
                <p className="text-sm text-destructive">Incorrect password. Please try again.</p>
              )}
            </div>

            <DialogFooter>
              <Button type="submit" className="w-full sm:w-auto">
                Enter admin mode
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
