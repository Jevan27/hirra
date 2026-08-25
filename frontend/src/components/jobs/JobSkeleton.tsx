import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const JobCardSkeleton: React.FC = () => {
  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col justify-between h-[230px] dark:bg-slate-900/90 dark:border-slate-800">
      <div>
        <div className="flex items-start justify-between mb-4">
          <Skeleton className="w-12 h-12 rounded-xl" />
          <Skeleton className="w-8 h-8 rounded-lg" />
        </div>
        <Skeleton className="h-6 w-3/4 mb-2 rounded-lg" />
        <Skeleton className="h-4 w-1/2 mb-4 rounded-md" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-md" />
          <Skeleton className="h-6 w-20 rounded-md" />
        </div>
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-slate-50 dark:border-slate-800">
        <Skeleton className="h-5 w-28 rounded-md" />
        <Skeleton className="h-4 w-12 rounded-md" />
      </div>
    </div>
  );
};

export const JobGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <JobCardSkeleton key={idx} />
      ))}
    </div>
  );
};
