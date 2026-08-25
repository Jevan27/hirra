import { useQuery } from '@tanstack/react-query';
import { fetchJobs, JobFilters, Job } from '../lib/api/jobs';

export function useJobs(filters?: JobFilters) {
  return useQuery<{ jobs: Job[]; pagination?: any }, Error>({
    queryKey: ['jobs', filters],
    queryFn: () => fetchJobs(filters),
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: 2,
  });
}
