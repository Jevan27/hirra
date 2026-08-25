import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark } from 'lucide-react';
import { Job } from '@/lib/api/jobs';
import { CompanyLogo } from '@/components/companies/CompanyLogo';
import { Badge } from '@/components/ui/badge';
import { useBookmarks } from '@/hooks/useBookmarks';
import { cn, formatSalary } from '@/lib/utils';

interface JobCardProps {
  job: Job;
  className?: string;
  onSelect?: (job: Job) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, className, onSelect }) => {
  const navigate = useNavigate();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = isBookmarked(job.id);

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    toggleBookmark(job.id);
  };

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(job);
    } else {
      navigate(`/jobs/${job.id}`);
    }
  };

  const getArrangementVariant = (arrangement: string) => {
    switch (arrangement?.toLowerCase()) {
      case 'remote':
        return 'remote';
      case 'hybrid':
        return 'hybrid';
      case 'on-site':
      case 'onsite':
        return 'onsite';
      default:
        return 'secondary';
    }
  };

  const getTypeVariant = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'contract':
        return 'contract';
      case 'full-time':
      case 'fulltime':
        return 'fulltime';
      default:
        return 'secondary';
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={cn(
        'group relative flex flex-col justify-between p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-card-hover hover:border-indigo-100 anim-hover-lift anim-active-press cursor-pointer dark:bg-slate-900/90 dark:border-slate-800 dark:hover:border-indigo-900/60',
        className
      )}
    >
      <div>
        {/* Top Header: Logo and Bookmark Button */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <CompanyLogo company={job.company} companyName={job.companyName} size="md" />
          
          <button
            type="button"
            onClick={handleBookmarkClick}
            aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark job'}
            className={cn(
              'p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-slate-50 transition-colors dark:hover:bg-slate-800 dark:hover:text-indigo-400',
              bookmarked && 'text-indigo-600 dark:text-indigo-400'
            )}
          >
            <Bookmark
              size={20}
              className={cn(
                'transition-transform duration-200',
                bookmarked ? 'fill-indigo-600 stroke-indigo-600 dark:fill-indigo-400 dark:stroke-indigo-400' : 'stroke-slate-400 dark:stroke-slate-500'
              )}
            />
          </button>
        </div>

        {/* Job Title & Company */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 dark:text-white dark:group-hover:text-indigo-400">
            {job.title}
          </h3>
          <p className="text-sm font-medium text-slate-500 mt-1 dark:text-slate-400">
            {job.companyName}
          </p>
        </div>

        {/* Badges: Work Arrangement & Employment Type */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <Badge variant={getArrangementVariant(job.workArrangement) as any}>
            {job.workArrangement}
          </Badge>
          <Badge variant={getTypeVariant(job.employmentType) as any}>
            {job.employmentType}
          </Badge>
        </div>
      </div>

      {/* Footer: Salary & Posted Time */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-50 dark:border-slate-800/60">
        <span className="text-base font-bold text-slate-900 dark:text-slate-100">
          {job.salary?.formatted || formatSalary(job.salary)}
        </span>
        <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
          {job.postedTime || 'Recently'}
        </span>
      </div>
    </div>
  );
};
