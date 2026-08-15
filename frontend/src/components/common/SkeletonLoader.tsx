import React from 'react';
import { cn } from '../../utils/classNames';

interface SkeletonLoaderProps {
  className?: string;
  count?: number;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ className, count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'animate-pulse bg-white/5 rounded-2xl border border-white/5',
            className || 'h-20 w-full'
          )}
        />
      ))}
    </>
  );
};
