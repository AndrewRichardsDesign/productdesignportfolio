import { useEffect, useState } from 'react';
import { Lock } from 'lucide-react';
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
import { tryUnlockProject } from '@/lib/projectAuth';

interface PasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called after a correct password is entered. */
  onSuccess: () => void;
}

/**
 * Password prompt shown before navigating to a protected project page.
 */
export function PasswordModal({ open, onOpenChange, onSuccess }: PasswordModalProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  // Reset the field whenever the modal is reopened.
  useEffect(() => {
    if (open) {
      setPassword('');
      setError(false);
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tryUnlockProject(password)) {
      onOpenChange(false);
      onSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 sm:mx-0">
            <Lock className="h-5 w-5 text-primary" />
          </div>
          <DialogTitle>Protected project</DialogTitle>
          <DialogDescription>
            This project is password protected. Enter the password to continue.
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
              aria-label="Password"
            />
            {error && (
              <p className="text-sm text-destructive">Incorrect password. Please try again.</p>
            )}
          </div>

          <DialogFooter>
            <Button type="submit" className="w-full sm:w-auto">
              Unlock
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
