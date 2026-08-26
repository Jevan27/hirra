import React from 'react';
import { cn } from '@/lib/utils';

interface RatingBarProps {
  label: string;
  value: number; // 0 to 5
  className?: string;
}

export const RatingBar: React.FC<RatingBarProps> = ({ label, value, className }) => {
  const percentage = (value / 5) * 100;

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <span className="text-sm font-medium text-slate-600 dark:text-slate-400 w-32 truncate">
        {label}
      </span>
      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden dark:bg-slate-800">
        <div
          className="h-full bg-amber-400 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-sm font-semibold text-slate-900 dark:text-white w-8 text-right">
        {value.toFixed(1)}
      </span>
    </div>
  );
};
