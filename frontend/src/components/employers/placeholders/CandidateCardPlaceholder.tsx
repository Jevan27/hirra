import React from 'react';
import { TrendingUp } from 'lucide-react';
import type { MockApplicant } from '@/data/mockEmployers';
import { cn } from '@/lib/utils';

interface CandidateCardPlaceholderProps {
  applicant: MockApplicant;
  className?: string;
  compact?: boolean;
}

/**
 * High-fidelity candidate profile card placeholder:
 * avatar, name, headline, skills, and a match indicator.
 */
export const CandidateCardPlaceholder: React.FC<CandidateCardPlaceholderProps> = ({
  applicant,
  className,
  compact = false,
}) => {
  return (
    <div
      className={cn(
        'bg-white border border-slate-200 rounded-2xl p-3.5 shadow-card dark:bg-slate-900 dark:border-slate-800',
        className
      )}
    >
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <span className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white text-xs font-bold flex items-center justify-center shadow-sm">
          {applicant.initials}
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-slate-900 truncate dark:text-white">
            {applicant.name}
          </p>
          <p className="text-xs text-slate-500 truncate dark:text-slate-400">
            {applicant.headline}
          </p>
        </div>

        {/* Match indicator */}
        <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-100 px-2 py-1 text-[11px] font-bold text-emerald-600 dark:bg-emerald-950/50 dark:border-emerald-900/50 dark:text-emerald-400">
          <TrendingUp size={12} />
          {applicant.match}%
        </span>
      </div>

      {!compact && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {applicant.skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300"
            >
              {skill}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
