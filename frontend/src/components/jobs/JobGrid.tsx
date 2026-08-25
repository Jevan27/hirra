import React from 'react';
import { Job } from '@/lib/api/jobs';
import { JobCard } from './JobCard';
import { JobGridSkeleton } from './JobSkeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';

interface JobGridProps {
  jobs?: Job[];
  isLoading?: boolean;
  isError?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  onResetFilters?: () => void;
  skeletonCount?: number;
}

export const JobGrid: React.FC<JobGridProps> = ({
  jobs = [],
  isLoading = false,
  isError = false,
  error,
  onRetry,
  onResetFilters,
  skeletonCount = 6,
}) => {
  if (isLoading) {
    return <JobGridSkeleton count={skeletonCount} />;
  }

  if (isError) {
    return (
      <ErrorState
        message={error?.message || "We couldn't connect to the jobs server."}
        onRetry={onRetry}
      />
    );
  }

  if (!jobs || jobs.length === 0) {
    return <EmptyState onReset={onResetFilters} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
};
