import React from 'react';
import { SearchX, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  title?: string;
  description?: string;
  onReset?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No jobs found',
  description = 'We couldn\'t find any jobs matching your current search or filter criteria. Try adjusting your filters or search keywords.',
  onReset,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 bg-white rounded-2xl border border-slate-100 dark:bg-slate-900 dark:border-slate-800 my-8">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4 dark:bg-indigo-950/60 dark:text-indigo-400">
        <SearchX size={32} />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2 dark:text-white">
        {title}
      </h3>
      <p className="text-sm text-slate-500 max-w-md mb-6 dark:text-slate-400">
        {description}
      </p>
      {onReset && (
        <Button onClick={onReset} variant="outline" className="gap-2">
          <RotateCcw size={15} />
          Reset Filters & Search
        </Button>
      )}
    </div>
  );
};
