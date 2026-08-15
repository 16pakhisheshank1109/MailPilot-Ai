import React from 'react';
import { Inbox } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No items found',
  description = 'Everything is caught up or matches your active filter criteria.',
  actionText,
  onAction,
  icon = <Inbox className="w-12 h-12 text-on-surface-variant/40" />,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-white/10 rounded-3xl bg-surface-container-low/40">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-bold text-on-surface">{title}</h3>
      <p className="text-sm text-on-surface-variant max-w-sm mt-1 mb-6">{description}</p>
      {actionText && onAction && (
        <Button variant="outline" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
