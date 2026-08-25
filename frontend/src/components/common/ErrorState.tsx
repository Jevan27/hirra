import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "We're having trouble loading jobs.",
  message = "Please check your network connection or verify that the backend API server is running on port 5000.",
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 bg-white rounded-2xl border border-red-100 dark:bg-slate-900 dark:border-red-950/50 my-8 shadow-sm">
      <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center text-red-600 mb-4 dark:bg-red-950/60 dark:text-red-400">
        <AlertTriangle size={32} />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2 dark:text-white">
        {title}
      </h3>
      <p className="text-sm text-slate-500 max-w-md mb-6 dark:text-slate-400">
        {message}
      </p>
      {onRetry && (
        <Button onClick={onRetry} className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
          <RefreshCw size={15} />
          Try Again
        </Button>
      )}
    </div>
  );
};
