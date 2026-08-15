import React from 'react';
import type { PriorityLevel } from '../../types/email';
import { cn } from '../../utils/classNames';

interface PriorityBadgeProps {
  priority: PriorityLevel;
  className?: string;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, className }) => {
  const styles = {
    urgent: 'bg-error-container/30 text-error border-error/30',
    high: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    medium: 'bg-primary/20 text-primary border-primary/30',
    low: 'bg-white/5 text-on-surface-variant border-white/10',
  };

  return (
    <span
      className={cn(
        'px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border',
        styles[priority],
        className
      )}
    >
      {priority}
    </span>
  );
};
