import React, { useState } from 'react';
import { 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  Share2, 
  Check, 
  Send, 
  Bookmark, 
  ExternalLink,
  Briefcase,
  ChevronRight
} from 'lucide-react';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { CompanyLogo } from '@/components/companies/CompanyLogo';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useJob } from '@/hooks/useJob';
import { useBookmarks } from '@/hooks/useBookmarks';
import { cn, formatSalary } from '@/lib/utils';

interface JobDetailDrawerProps {
  jobId: string | null;
  onClose: () => void;
}

export const JobDetailDrawer: React.FC<JobDetailDrawerProps> = ({ jobId, onClose }) => {
  const { data: job, isLoading, isError } = useJob(jobId ?? undefined);
  const { isBookmarked, toggleBookmark } = useBookmarks();
  
  const [applied, setApplied] = useState(false);
  const [copied, setCopied] = useState(false);

  const bookmarked = jobId ? isBookmarked(jobId) : false;

  const handleShare = () => {
    if (!jobId) return;
    const url = `${window.location.origin}/jobs/${jobId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApply = () => {
    setApplied(true);
  };

  const getArrangementVariant = (arrangement?: string) => {
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

  const getTypeVariant = (type?: string) => {
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
    <Sheet open={Boolean(jobId)} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:w-[85vw] md:w-[70vw] lg:w-[48vw] xl:w-[42vw] sm:max-w-none p-0 flex flex-col h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl focus:outline-none"
      >
        {/* Left Border Floating Collapse Arrow Button (Vertically Centered) */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close details panel"
          className="absolute -left-10 top-1/2 -translate-y-1/2 w-10 h-16 bg-white dark:bg-slate-900 border-y border-l border-r-0 border-slate-200 dark:border-slate-800 rounded-l-2xl hidden sm:flex items-center justify-center text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 shadow-md hover:shadow-lg anim-transition-colors anim-active-press group z-50 cursor-pointer"
          title="Collapse panel"
        >
          <ChevronRight size={22} className="group-hover:translate-x-0.5 transition-transform" />
        </button>

        <SheetTitle className="sr-only">
          {job ? `${job.title} at ${job.companyName}` : 'Job Details'}
        </SheetTitle>

        {isLoading ? (
          <div className="flex-1 p-6 space-y-6 overflow-y-auto">
            <div className="flex items-center gap-4 pt-4">
              <Skeleton className="w-16 h-16 rounded-2xl" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-4">
              <Skeleton className="h-16 rounded-xl" />
              <Skeleton className="h-16 rounded-xl" />
            </div>
            <div className="space-y-3 pt-6">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        ) : isError || !job ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-4 dark:bg-red-950/50 dark:text-red-400">
              <Briefcase size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              Unable to load job details
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              The position might have expired or is currently unavailable.
            </p>
            <Button variant="outline" onClick={onClose}>
              Close Panel
            </Button>
          </div>
        ) : (
          <>
            {/* Header: Company & Title Details */}
            <div className="p-6 pb-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 pr-14">
              <div className="flex items-start gap-4">
                <CompanyLogo
                  company={job.company}
                  companyName={job.companyName}
                  size="md"
                  className="w-14 h-14 shrink-0 rounded-2xl shadow-xs"
                />
                <div className="min-w-0 flex-1">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
                    {job.title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-sm text-slate-600 dark:text-slate-400">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {job.companyName}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin size={13} className="text-slate-400" />
                      {job.location}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock size={13} className="text-slate-400" />
                      {job.postedTime || 'Recently'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Bar (Share & Bookmark) */}
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                <button
                  type="button"
                  onClick={handleShare}
                  aria-label="Share Job Link"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-600 anim-transition-colors anim-active-press dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  title="Copy link"
                >
                  {copied ? (
                    <>
                      <Check size={14} className="text-emerald-600 dark:text-emerald-400" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Share2 size={14} />
                      <span>Share</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => jobId && toggleBookmark(jobId)}
                  aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark job'}
                  className={cn(
                    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold anim-transition-colors anim-active-press dark:border-slate-700',
                    bookmarked
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-950/60 dark:border-indigo-900/60 dark:text-indigo-400'
                      : 'hover:bg-slate-100 text-slate-600 dark:text-slate-300 dark:hover:bg-slate-800'
                  )}
                >
                  <Bookmark
                    size={14}
                    className={cn(
                      'transition-transform duration-200',
                      bookmarked
                        ? 'fill-indigo-600 stroke-indigo-600 scale-110 dark:fill-indigo-400 dark:stroke-indigo-400'
                        : 'stroke-slate-500'
                    )}
                  />
                  <span>{bookmarked ? 'Saved' : 'Save'}</span>
                </button>
              </div>
            </div>

            {/* Scrollable Main Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Quick Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 dark:bg-slate-800/50 dark:border-slate-800">
                <div>
                  <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-0.5">
                    Salary
                  </span>
                  <span className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                    {job.salary?.formatted || formatSalary(job.salary)}
                  </span>
                </div>

                <div>
                  <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                    Work Arrangement
                  </span>
                  <Badge variant={getArrangementVariant(job.workArrangement) as any} className="text-xs">
                    {job.workArrangement}
                  </Badge>
                </div>

                <div>
                  <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                    Employment
                  </span>
                  <Badge variant={getTypeVariant(job.employmentType) as any} className="text-xs">
                    {job.employmentType}
                  </Badge>
                </div>

                <div>
                  <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-0.5">
                    Level
                  </span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {job.experienceLevel || 'Mid-Senior'}
                  </span>
                </div>
              </div>

              {/* About Role */}
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                  About the Role
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {job.description}
                </p>
              </div>

              {/* Key Responsibilities */}
              {job.responsibilities && job.responsibilities.length > 0 && (
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">
                    Key Responsibilities
                  </h3>
                  <ul className="space-y-2.5">
                    {job.responsibilities.map((resp, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        <CheckCircle2 size={16} className="text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Requirements & Qualifications */}
              {job.requirements && job.requirements.length > 0 && (
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">
                    Requirements & Qualifications
                  </h3>
                  <ul className="space-y-2.5">
                    {job.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 shrink-0 mt-2" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Perks & Benefits */}
              {job.benefits && job.benefits.length > 0 && (
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">
                    Perks & Benefits
                  </h3>
                  <ul className="space-y-2.5">
                    {job.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        <Sparkles size={15} className="text-amber-500 shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Skills / Tags */}
              {job.tags && job.tags.length > 0 && (
                <div className="pt-2">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2.5">
                    Skills & Technologies
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {job.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold dark:bg-slate-800 dark:text-slate-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* About Company */}
              <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50/70 dark:bg-slate-800/40 dark:border-slate-800 space-y-3">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  About {job.companyName}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {job.company?.description ||
                    `${job.companyName} is an industry-leading company offering market-competitive opportunities and career development.`}
                </p>
                <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 pt-1">
                  <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Industry</span>
                    <span>{job.company?.industry || 'Technology'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Company Size</span>
                    <span>{job.company?.size || '500+ employees'}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Headquarters</span>
                    <span>{job.company?.location || 'Metro Manila'}</span>
                  </div>
                </div>

                {job.company?.website && (
                  <a
                    href={job.company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    <span>Visit Company Website</span>
                    <ExternalLink size={13} />
                  </a>
                )}
              </div>

            </div>

            {/* Sticky Bottom Apply Action Bar */}
            <div className="p-4 sm:p-5 bg-white border-t border-slate-100 dark:bg-slate-900 dark:border-slate-800 flex items-center justify-between gap-4 shadow-lg">
              <div className="hidden sm:block">
                <span className="block text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                  Offered Compensation
                </span>
                <span className="text-base font-extrabold text-slate-900 dark:text-white">
                  {job.salary?.formatted || formatSalary(job.salary)}
                </span>
              </div>

              <Button
                onClick={handleApply}
                disabled={applied}
                className="flex-1 sm:flex-initial sm:min-w-[200px] h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-600/30 gap-2 text-sm"
              >
                {applied ? (
                  <>
                    <CheckCircle2 size={18} />
                    Application Submitted
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Apply Now
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};
