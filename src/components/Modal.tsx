import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

import { Button } from '@/components/Button';
import { cn } from '@/components/ui/cn';

export interface ModalProps {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export const Modal = ({
  children,
  className,
  description,
  onClose,
  open,
  title,
}: ModalProps): JSX.Element | null => {
  useEffect(() => {
    if (!open || typeof document === 'undefined') {
      return undefined;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, open]);

  if (!open || typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"
      role="dialog"
      onClick={onClose}
    >
      <div
        className={cn('w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl', className)}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
            {description ? <p className="text-sm text-slate-500">{description}</p> : null}
          </div>

          <Button
            aria-label="Cerrar modal"
            className="h-10 w-10 rounded-full p-0"
            variant="ghost"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {children}
      </div>
    </div>,
    document.body,
  );
};
