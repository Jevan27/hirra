import React from 'react';
import { CircleCheck } from 'lucide-react';
import { Reveal } from '@/components/common/Reveal';
import { Badge } from '@/components/ui/badge';
import { FREE_POSTING_POINTS } from '@/data/mockEmployers';

export const FreeToPostSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Copy + checklist */}
          <Reveal>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4 dark:text-white">
              Post Your Jobs. It's Free.
            </h2>
            <p className="text-slate-600 leading-relaxed max-w-lg mb-8 dark:text-slate-400">
              Hiring shouldn't be limited by the size of your recruiting budget. Hirra gives
              employers a simple way to publish opportunities and start finding candidates —
              without paying a job-posting fee.
            </p>

            <ul className="space-y-3.5">
              {FREE_POSTING_POINTS.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <CircleCheck
                    size={19}
                    className="shrink-0 mt-0.5 text-indigo-600 dark:text-indigo-400"
                  />
                  <span className="text-sm sm:text-[15px] font-medium text-slate-700 leading-relaxed dark:text-slate-300">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* $0 panel */}
          <Reveal delay={120}>
            <div className="relative rounded-3xl border border-indigo-100 bg-white p-8 sm:p-12 text-center shadow-card overflow-hidden dark:border-slate-800 dark:bg-slate-900">
              {/* Decorative rings */}
              <div
                aria-hidden="true"
                className="absolute -top-24 left-1/2 -translate-x-1/2 w-[420px] h-[420px] rounded-full border-[28px] border-indigo-50 opacity-70 pointer-events-none dark:border-indigo-950/60"
              />
              <div
                aria-hidden="true"
                className="absolute -top-10 right-6 w-40 h-40 rounded-full bg-violet-100/70 blur-3xl pointer-events-none dark:bg-violet-800/20"
              />

              <Badge variant="secondary" className="relative mb-6">
                No hidden fees · No credit card
              </Badge>

              <p className="relative text-7xl sm:text-8xl font-extrabold tracking-tight bg-gradient-to-br from-indigo-600 via-indigo-500 to-violet-500 bg-clip-text text-transparent mb-2 dark:from-indigo-400 dark:via-indigo-400 dark:to-violet-400">
                $0
              </p>
              <p className="relative text-lg font-bold text-slate-900 mb-1 dark:text-white">
                to post a job
              </p>
              <p className="relative text-sm text-slate-500 max-w-xs mx-auto leading-relaxed dark:text-slate-400">
                Publishing your opportunity on Hirra costs nothing. Start hiring without
                paying just to post.
              </p>

              <div className="relative mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Job posting on Hirra is free
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};
