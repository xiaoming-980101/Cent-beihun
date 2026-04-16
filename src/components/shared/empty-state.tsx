import { CircleAlert } from 'lucide-react';
import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/utils';

interface EmptyStateAction {
  label: string;
  onClick: () => void;
}

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: EmptyStateAction;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn('flex flex-col items-center justify-center px-4 py-12 text-center', className)}
      role="status"
      aria-live="polite"
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center text-text-secondary" aria-hidden="true">
        {icon ?? <CircleAlert className="h-10 w-10" />}
      </div>

      <h3 className="mb-1 text-lg font-semibold text-foreground">{title}</h3>

      {description ? <p className="mb-4 max-w-sm text-sm text-text-secondary">{description}</p> : null}

      {action ? (
        <Button type="button" onClick={action.onClick}>
          {action.label}
        </Button>
      ) : null}
    </div>
  );
}
