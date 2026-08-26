import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Bookmark, 
  MapPin, 
  Building2, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  Share2, 
  Check, 
  Send 
} from 'lucide-react';
import { CompanyLogo } from '@/components/companies/CompanyLogo';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ErrorState } from '@/components/common/ErrorState';
import { LoadingState } from '@/components/common/LoadingState';
import { useJob } from '@/hooks/useJob';
import { useBookmarks } from '@/hooks/useBookmarks';
import { formatSalary } from '@/lib/utils';

export const JobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: job, isLoading, isError, error, refetch } = useJob(id);
  const { isBookmarked, toggleBookmark } = useBookmarks();
  
  const [applied, setApplied] = useState(false);
  const [copied, setCopied] = useState(false);

  const bookmarked = id ? isBookmarked(id) : false;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApply = () => {
    setApplied(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <LoadingState message="Loading position details..." />
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 w-full">
        <ErrorState
          title="Job Not Found"
          message={error?.message || "The position you are looking for may have expired or does not exist."}
          onRetry={refetch}
        />
        <div className="text-center mt-4">
          <Button variant="outline" onClick={() => navigate('/jobs')}>
            Back to All Jobs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-sm font-medium text-slate-500 mb-8 dark:text-slate-400">
          <Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">
            Home
          </Link>
          <span>/</span>
          <Link to="/jobs" className="hover:text-indigo-600 dark:hover:text-indigo-400">
            Jobs
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold truncate max-w-xs dark:text-slate-100">
            {job.title}
          </span>
        </div>

        {/* Back Link */}
        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-indigo-600 mb-6 transition-colors dark:text-slate-400 dark:hover:text-indigo-400"
        >
          <ArrowLeft size={16} />
          Back to Listings
        </Link>

        {/* Job Header Hero Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm mb-8 dark:bg-slate-900 dark:border-slate-800">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-start sm:items-center gap-4 sm:gap-6">
              <CompanyLogo
                company={job.company}
                companyName={job.companyName}
                size="lg"
                className="w-16 h-16 sm:w-20 sm:h-20"
              />
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight dark:text-white">
                  {job.title}
                </h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                  <span className="font-bold text-slate-900 dark:text-slate-200">
                    {job.companyName}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin size={14} className="text-slate-400" />
                    {job.location}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} className="text-slate-400" />
                    {job.postedTime || 'Recently'}
                  </span>
                </div>
              </div>
            </div>

            {/* Header Action Buttons */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                type="button"
                onClick={handleShare}
                aria-label="Share Job"
                className="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
                title="Copy Link"
              >
                {copied ? <Check size={18} className="text-emerald-600" /> : <Share2 size={18} />}
              </button>

              <button
                type="button"
                onClick={() => id && toggleBookmark(id)}
                aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark job'}
                className="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors dark:border-slate-800 dark:hover:bg-slate-800"
              >
                <Bookmark
                  size={18}
                  className={
                    bookmarked
                      ? 'fill-indigo-600 stroke-indigo-600 dark:fill-indigo-400 dark:stroke-indigo-400'
                      : 'stroke-slate-400 dark:stroke-slate-500'
                  }
                />
              </button>

              <Button
                onClick={handleApply}
                disabled={applied}
                className="flex-1 md:flex-initial h-12 px-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md shadow-indigo-600/30 gap-2 text-base"
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
          </div>

          {/* Key Quick Badges Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                Salary
              </span>
              <span className="text-base font-extrabold text-slate-900 dark:text-white">
                {job.salary?.formatted || formatSalary(job.salary)}
              </span>
            </div>

            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                Work Type
              </span>
              <Badge variant="hybrid" className="text-xs">
                {job.workArrangement}
              </Badge>
            </div>

            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                Employment
              </span>
              <Badge variant="secondary" className="text-xs">
                {job.employmentType}
              </Badge>
            </div>

            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                Level
              </span>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {job.experienceLevel || 'Mid-Senior'}
              </span>
            </div>
          </div>
        </div>

        {/* 2-Column Detail Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Job Body */}
          <div className="lg:col-span-2 space-y-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm dark:bg-slate-900 dark:border-slate-800">
            
            {/* Description */}
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-3 dark:text-white">
                About the Role
              </h2>
              <p className="text-slate-600 leading-relaxed dark:text-slate-300">
                {job.description}
              </p>
            </div>

            {/* Responsibilities */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-3 dark:text-white">
                  Key Responsibilities
                </h2>
                <ul className="space-y-2.5">
                  {job.responsibilities.map((resp, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                      <CheckCircle2 size={18} className="text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-3 dark:text-white">
                  Requirements & Qualifications
                </h2>
                <ul className="space-y-2.5">
                  {job.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                      <div className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 shrink-0 mt-2" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Benefits */}
            {job.benefits && job.benefits.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-3 dark:text-white">
                  Perks & Benefits
                </h2>
                <ul className="space-y-2.5">
                  {job.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                      <Sparkles size={17} className="text-amber-500 shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tags */}
            {job.tags && job.tags.length > 0 && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 dark:text-slate-500">
                  Skills & Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold dark:bg-slate-800 dark:text-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar: Company Card */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm dark:bg-slate-900 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 mb-4 dark:text-white">
                About {job.companyName}
              </h3>
              <p className="text-sm text-slate-600 mb-4 leading-relaxed dark:text-slate-400">
                {job.company?.description ||
                  `${job.companyName} is a top technology innovator offering market-leading products and rewarding career opportunities.`}
              </p>
              <div className="space-y-2.5 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex justify-between py-1.5 border-b border-slate-50 dark:border-slate-800">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Industry</span>
                  <span>{job.company?.industry || 'Technology'}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-50 dark:border-slate-800">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Company Size</span>
                  <span>{job.company?.size || '500+ employees'}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-50 dark:border-slate-800">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Headquarters</span>
                  <span>{job.company?.location || 'Metro Manila'}</span>
                </div>
              </div>

              {job.company?.website && (
                <a
                  href={job.company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 w-full inline-flex items-center justify-center py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Visit Company Website ↗
                </a>
              )}
            </div>

            {/* Sticky Apply CTA Box */}
            <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100 dark:bg-indigo-950/40 dark:border-indigo-900/40">
              <h3 className="text-base font-bold text-indigo-950 dark:text-indigo-200 mb-2">
                Interested in this role?
              </h3>
              <p className="text-xs text-indigo-700 dark:text-indigo-300 mb-4">
                Applications submitted through Hirra receive priority review by hiring managers.
              </p>
              <Button
                onClick={handleApply}
                disabled={applied}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl h-11"
              >
                {applied ? 'Application Sent' : 'Apply for this Job'}
              </Button>
            </div>
          </div>

        </div>

    </div>
  );
};
