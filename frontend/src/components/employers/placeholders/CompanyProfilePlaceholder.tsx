import React from 'react';
import { ArrowUpRight, BadgeCheck, MapPin } from 'lucide-react';
import { COMPANY_PROFILE_OPEN_JOBS, HIRRA_COMPANY } from '@/data/mockEmployers';
import { StarRating } from '@/components/ui/StarRating';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface CompanyProfilePlaceholderProps {
  className?: string;
}

/**
 * Miniature Hirra company profile preview — cover image, logo,
 * rating/recommend summary, and open roles. Connects visually with the
 * existing Companies & Reviews pages.
 */
export const CompanyProfilePlaceholder: React.FC<CompanyProfilePlaceholderProps> = ({
  className,
}) => {
  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-200 bg-white shadow-card overflow-hidden dark:border-slate-800 dark:bg-slate-900',
        className
      )}
    >
      {/* Cover */}
      <div className="relative h-24 sm:h-32 bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-500">
        <svg
          aria-hidden="true"
          className="absolute inset-0 h-full w-full opacity-20"
        >
          <defs>
            <pattern
              id="profile-cover-dots"
              x="0"
              y="0"
              width="22"
              height="22"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1.5" className="fill-white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#profile-cover-dots)" />
        </svg>
        <span className="absolute bottom-2 right-3 rounded-full bg-white/15 backdrop-blur-sm px-2 py-0.5 text-[10px] font-semibold text-white/90">
          Cover photo
        </span>
      </div>

      <div className="px-4 sm:px-5 pb-5">
        {/* Logo + identity */}
        <div className="flex items-end gap-3 pt-4 mb-3">
          <span className="w-14 h-14 rounded-2xl bg-indigo-600 text-white text-xl font-extrabold flex items-center justify-center ring-4 ring-white shadow-md dark:ring-slate-900 shrink-0">
            H
          </span>
          <div className="pb-0.5 min-w-0">
            <p className="flex items-center gap-1.5 text-base sm:text-lg font-extrabold text-slate-900 truncate dark:text-white">
              {HIRRA_COMPANY.name}
              <BadgeCheck size={16} className="shrink-0 text-indigo-500 dark:text-indigo-400" />
            </p>
          </div>
          <Badge variant="remote" className="ml-auto mb-0.5 shrink-0 hidden sm:inline-flex">
            Hiring
          </Badge>
        </div>

        <p className="flex items-center gap-1.5 text-xs text-slate-500 mb-2.5 dark:text-slate-400">
          <MapPin size={12} />
          {HIRRA_COMPANY.industry} · {HIRRA_COMPANY.location}
        </p>

        {/* Rating row */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mb-4">
          <span className="flex items-center gap-1.5">
            <StarRating rating={4.8} size="sm" />
            <span className="text-sm font-bold text-slate-900 dark:text-white">4.8</span>
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500">27 reviews</span>
          <Badge variant="secondary">93% recommend</Badge>
        </div>

        {/* Decorative tabs (visual only) */}
        <div
          aria-hidden="true"
          className="flex items-center gap-5 border-b border-slate-100 mb-3.5 text-xs font-bold dark:border-slate-800"
        >
          <span className="pb-2 text-slate-400 dark:text-slate-500">About</span>
          <span className="pb-2 border-b-2 border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400">
            Open Jobs
          </span>
          <span className="pb-2 text-slate-400 dark:text-slate-500">Reviews</span>
        </div>

        {/* Open jobs */}
        <div className="space-y-2">
          {COMPANY_PROFILE_OPEN_JOBS.map((job) => (
            <div
              key={job.title}
              className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5 dark:bg-slate-800/50"
            >
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-bold text-slate-800 truncate dark:text-slate-100">
                  {job.title}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">{job.meta}</p>
              </div>
              <ArrowUpRight
                size={14}
                className="shrink-0 text-indigo-500 dark:text-indigo-400"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
