import { useQuery } from '@tanstack/react-query';
import { fetchFeaturedJobs, Job } from '../lib/api/jobs';

export function useFeaturedJobs() {
  return useQuery<Job[], Error>({
    queryKey: ['jobs', 'featured'],
    queryFn: fetchFeaturedJobs,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
}
