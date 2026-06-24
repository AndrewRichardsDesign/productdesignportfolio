import { useState } from 'react';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PasswordModal } from '@/components/PasswordModal';
import { isProjectUnlocked } from '@/lib/projectAuth';

interface ProjectGateProps {
  /** When true (admin/editing mode), the gate is bypassed entirely. */
  bypass?: boolean;
  children: React.ReactNode;
}

/**
 * Guards a project page so it can only be viewed after the password has been
 * entered. Protects direct navigation to the page URL, not just clicks from
 * the project cards.
 */
export function ProjectGate({ bypass = false, children }: ProjectGateProps) {
  const [unlocked, setUnlocked] = useState(() => bypass || isProjectUnlocked());
  const [modalOpen, setModalOpen] = useState(false);

  if (unlocked) return <>{children}</>;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <Lock className="h-7 w-7 text-primary" />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Protected project</h1>
        <p className="max-w-sm text-muted-foreground">
          This project is password protected. Enter the password to view it.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button onClick={() => setModalOpen(true)}>Enter password</Button>
        <Button variant="outline" onClick={() => (window.location.hash = '')}>
          Back to home
        </Button>
      </div>

      <PasswordModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSuccess={() => setUnlocked(true)}
      />
    </div>
  );
}
