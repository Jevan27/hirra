import React from 'react';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  max = 5,
  size = 'md',
  className,
}) => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }[size];

  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {Array.from({ length: max }).map((_, index) => {
        const fill = Math.min(Math.max(rating - index, 0), 1) * 100;
        return (
          <div key={index} className="relative">
            <Star
              className={cn('text-slate-200 fill-slate-200', sizeClasses)}
            />
            <div
              className="absolute top-0 left-0 overflow-hidden"
              style={{ width: `${fill}%` }}
            >
              <Star
                className={cn('text-amber-400 fill-amber-400', sizeClasses)}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
