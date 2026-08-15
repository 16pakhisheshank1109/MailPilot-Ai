import React from 'react';
import type { EmailCategory } from '../../types/email';
import { cn } from '../../utils/classNames';

interface CategoryBadgeProps {
  category: EmailCategory;
  className?: string;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, className }) => {
  return (
    <span
      className={cn(
        'px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-white/5 border border-white/10 text-on-surface-variant',
        className
      )}
    >
      {category}
    </span>
  );
};
