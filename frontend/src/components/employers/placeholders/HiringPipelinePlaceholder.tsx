import React from 'react';
import { ChevronRight } from 'lucide-react';
import { HIRING_PIPELINE_STAGES } from '@/data/mockEmployers';
import { cn } from '@/lib/utils';

const STAGE_ACCENTS = [
  'bg-indigo-500 dark:bg-indigo-400',
  'bg-violet-500 dark:bg-violet-400',
  'bg-sky-500 dark:bg-sky-400',
  'bg-emerald-500 dark:bg-emerald-400',
];

interface HiringPipelinePlaceholderProps {
  className?: string;
}

/**
 * Miniature hiring pipeline: Applicants → Review → Interview → Offer,
 * with proportional progress bars and connecting arrows.
 */
export const HiringPipelinePlaceholder: React.FC<HiringPipelinePlaceholderProps> = ({
  className,
}) => {
  const total = HIRING_PIPELINE_STAGES[0]?.count || 1;

  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-3 sm:flex sm:items-stretch sm:gap-3',
        className
      )}
    >
      {HIRING_PIPELINE_STAGES.map((stage, index) => {
        const isLast = index === HIRING_PIPELINE_STAGES.length - 1;
        return (
          <div key={stage.label} className="relative flex-1 min-w-0">
            <div
              className={cn(
                'h-full rounded-xl border border-slate-200 bg-slate-50/60 p-3 dark:border-slate-800 dark:bg-slate-800/40',
                !isLast && 'sm:mr-4'
              )}
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <span
                  className={cn(
                    'w-1.5 h-1.5 rounded-full',
                    STAGE_ACCENTS[index % STAGE_ACCENTS.length]
                  )}
                />
                <p className="text-[11px] font-semibold text-slate-500 truncate dark:text-slate-400">
                  {stage.label}
                </p>
              </div>
              <p className="text-lg font-extrabold leading-none text-slate-900 dark:text-white">
                {stage.count}
              </p>
              <div className="mt-2 h-1 rounded-full bg-slate-200/80 overflow-hidden dark:bg-slate-700/60">
                <div
                  className={cn(
                    'h-full rounded-full',
                    STAGE_ACCENTS[index % STAGE_ACCENTS.length],
                    'opacity-70'
                  )}
                  style={{ width: `${Math.max((stage.count / total) * 100, 6)}%` }}
                />
              </div>
            </div>

            {!isLast && (
              <span
                aria-hidden="true"
                className="hidden sm:flex absolute top-1/2 right-0 -translate-y-1/2 w-6 h-6 rounded-full bg-white border border-slate-200 shadow-sm items-center justify-center text-slate-400 z-10 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-500"
              >
                <ChevronRight size={13} />
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};
