import React from 'react';
import { AlertOctagon, RotateCw } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'Failed to load requested resource from FastAPI endpoint.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center border border-error-container/30 rounded-3xl bg-error-container/10">
      <AlertOctagon className="w-10 h-10 text-error mb-3" />
      <h4 className="text-base font-bold text-on-surface">{title}</h4>
      <p className="text-xs text-on-surface-variant max-w-xs mt-1 mb-4">{message}</p>
      {onRetry && (
        <Button variant="danger" size="sm" leftIcon={<RotateCw className="w-3.5 h-3.5" />} onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
};
