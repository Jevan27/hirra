import React from 'react';
import {
  Bell,
  BriefcaseBusiness,
  Building,
  CalendarCheck,
  Clock,
  Eye,
  FileText,
  LayoutDashboard,
  MapPin,
  Search,
  Settings,
  Users,
} from 'lucide-react';
import {
  EMPLOYER_DASHBOARD_STATS,
  EMPLOYER_JOB_ROWS,
  RECENT_APPLICANTS,
} from '@/data/mockEmployers';
import { HiringPipelinePlaceholder } from './HiringPipelinePlaceholder';
import { CandidateCardPlaceholder } from './CandidateCardPlaceholder';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const STAT_ICONS = [BriefcaseBusiness, FileText, Eye, CalendarCheck];

const SIDEBAR_ITEMS = [
  { icon: LayoutDashboard, label: 'Overview', active: false },
  { icon: BriefcaseBusiness, label: 'Jobs', active: true },
  { icon: Users, label: 'Candidates', active: false },
  { icon: Building, label: 'Company Profile', active: false },
  { icon: Settings, label: 'Settings', active: false },
];

interface DashboardPlaceholderProps {
  /** `compact` for the hero; `full` adds pipeline + recent applicants. */
  variant?: 'compact' | 'full';
  className?: string;
}

/**
 * High-fidelity Hirra employer dashboard preview.
 * Purely visual mock — no interactivity, no live data.
 */
export const DashboardPlaceholder: React.FC<DashboardPlaceholderProps> = ({
  variant = 'compact',
  className,
}) => {
  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-200 bg-white shadow-search overflow-hidden text-left dark:border-slate-800 dark:bg-slate-900',
        className
      )}
    >
      {/* Window chrome */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-900/80">
        <span className="flex items-center gap-1.5" aria-hidden="true">
          <i className="w-2.5 h-2.5 rounded-full bg-rose-300 dark:bg-rose-500/60" />
          <i className="w-2.5 h-2.5 rounded-full bg-amber-300 dark:bg-amber-500/60" />
          <i className="w-2.5 h-2.5 rounded-full bg-emerald-300 dark:bg-emerald-500/60" />
        </span>
        <p className="text-xs font-bold text-slate-500 truncate dark:text-slate-400">
          Hirra <span className="text-slate-300 dark:text-slate-600">·</span>{' '}
          Employer Dashboard
        </p>

        <div className="ml-auto flex items-center gap-2.5">
          <span className="hidden md:inline-flex items-center gap-1.5 rounded-lg bg-white border border-slate-200 px-2.5 py-1 text-[11px] font-medium text-slate-400 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-500">
            <Search size={11} />
            Search candidates
          </span>
          <span className="relative flex items-center justify-center w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-400 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-500">
            <Bell size={13} />
            <i className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-indigo-500 anim-live-dot" />
          </span>
          <span className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white text-[10px] font-bold flex items-center justify-center">
            NT
          </span>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar (desktop only) */}
        <aside className="hidden lg:flex w-44 shrink-0 flex-col gap-1 p-3 border-r border-slate-100 dark:border-slate-800">
          {SIDEBAR_ITEMS.map((item) => (
            <span
              key={item.label}
              className={cn(
                'flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold',
                item.active
                  ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400'
                  : 'text-slate-500 dark:text-slate-400'
              )}
            >
              <item.icon size={14} />
              {item.label}
            </span>
          ))}
        </aside>

        {/* Main panel */}
        <div className="flex-1 min-w-0 p-4 sm:p-5 space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
            {EMPLOYER_DASHBOARD_STATS.map((stat, index) => {
              const Icon = STAT_ICONS[index % STAT_ICONS.length];
              return (
                <div
                  key={stat.label}
                  className="rounded-xl border border-slate-100 bg-slate-50/60 p-3 dark:border-slate-800 dark:bg-slate-800/40"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="flex items-center justify-center w-6 h-6 rounded-md bg-indigo-50 text-indigo-500 dark:bg-indigo-950/60 dark:text-indigo-400">
                      <Icon size={12} />
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                      {stat.delta}
                    </span>
                  </div>
                  <p className="text-xl font-extrabold leading-tight text-slate-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p className="text-[11px] font-medium text-slate-500 truncate dark:text-slate-400">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>

          {variant === 'full' && (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 dark:text-slate-500">
                Hiring Pipeline
              </p>
              <HiringPipelinePlaceholder />
            </div>
          )}

          {/* Job rows */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 dark:text-slate-500">
              Your Job Posts
            </p>
            <div className="space-y-2">
              {EMPLOYER_JOB_ROWS.map((job) => (
                <div
                  key={job.title}
                  className="flex items-center gap-3 rounded-xl border border-slate-100 p-2.5 dark:border-slate-800"
                >
                  <span className="shrink-0 hidden sm:flex w-8 h-8 rounded-lg items-center justify-center text-[11px] font-bold">
                    {job.status === 'Active' ? (
                      <Badge variant="remote" className="!px-1.5 !py-0 !text-[10px]">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="onsite" className="!px-1.5 !py-0 !text-[10px]">
                        Review
                      </Badge>
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-bold text-slate-900 truncate dark:text-white">
                      {job.title}
                    </p>
                    <p className="flex items-center gap-1.5 text-[11px] text-slate-500 truncate dark:text-slate-400">
                      <MapPin size={10} className="shrink-0" />
                      {job.location}
                      <Clock size={10} className="shrink-0 hidden md:inline" />
                      <span className="hidden md:inline">{job.postedLabel}</span>
                    </p>
                  </div>
                  <p className="shrink-0 text-[11px] font-bold text-slate-600 dark:text-slate-300">
                    {job.applicants}
                    <span className="hidden lg:inline font-medium text-slate-400 dark:text-slate-500">
                      {' '}
                      applicants
                    </span>
                  </p>
                  <span className="shrink-0 inline-flex items-center justify-center h-7 rounded-lg border border-slate-200 bg-white px-3 text-[11px] font-bold text-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-indigo-400">
                    Review
                  </span>
                </div>
              ))}
            </div>
          </div>

          {variant === 'full' && (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 dark:text-slate-500">
                Recent Applicants
              </p>
              <div className="grid md:grid-cols-2 gap-2">
                {RECENT_APPLICANTS.map((applicant) => (
                  <CandidateCardPlaceholder key={applicant.name} applicant={applicant} compact />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
