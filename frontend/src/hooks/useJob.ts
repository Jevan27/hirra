import { useQuery } from '@tanstack/react-query';
import { fetchJobById, Job } from '../lib/api/jobs';

export function useJob(id: string | undefined) {
  return useQuery<Job, Error>({
    queryKey: ['job', id],
    queryFn: () => {
      if (!id) throw new Error('Job ID is required');
      return fetchJobById(id);
    },
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
  });
}
