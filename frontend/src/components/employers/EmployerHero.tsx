import React from 'react';
import { ArrowRight, CircleCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DashboardPlaceholder } from './placeholders/DashboardPlaceholder';
import { CandidateCardPlaceholder } from './placeholders/CandidateCardPlaceholder';
import { NEW_APPLICATION_PING, RECENT_APPLICANTS } from '@/data/mockEmployers';
import { scrollToSection, startHiring } from '@/lib/employerCta';

const TRUST_POINTS = ['Free to post', 'No credit card needed', 'Built for growing teams'];

export const EmployerHero: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-10 pb-16 md:pt-16 md:pb-24">
      {/* Theme-aware ambient glow (shared with HomePage hero) */}
      <div className="hero-ambient-glow" />

      {/* Oversized ambient orb */}
      <div
        aria-hidden="true"
        className="absolute -top-48 -right-48 w-[700px] h-[700px] rounded-full bg-gradient-to-bl from-indigo-200/40 via-purple-200/20 to-transparent blur-[120px] pointer-events-none z-0 dark:from-indigo-600/18 dark:via-purple-800/10 dark:to-transparent"
      />

      {/* Dot matrix accent */}
      <div className="absolute top-14 left-6 lg:left-20 pointer-events-none hidden md:block select-none z-0">
        <svg width="110" height="110" viewBox="0 0 110 110" fill="none" className="opacity-75 dark:opacity-25">
          <pattern id="employers-hero-dots" x="0" y="0" width="18" height="18" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="2" className="fill-indigo-400 dark:fill-indigo-300" />
          </pattern>
          <rect width="110" height="110" fill="url(#employers-hero-dots)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1.02fr_1fr] gap-12 lg:gap-16 items-center">
          {/* Copy */}
          <div>
            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-5 anim-fade-up anim-delay-1 dark:text-white">
              Build Your Team.{' '}
              <span className="text-indigo-600 dark:text-indigo-400">Start Hiring.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mb-8 anim-fade-up anim-delay-2 dark:text-slate-400">
              Post your jobs for free, reach motivated candidates, and build your team with
              Hirra — whether you're hiring your first employee or growing your next
              department.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-7 anim-fade-up anim-delay-3">
              <Button size="lg" variant="brand" onClick={startHiring} className="group">
                Start Hiring!
                <ArrowRight
                  size={18}
                  className="ml-2 group-hover:translate-x-1 transition-transform duration-200"
                />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollToSection('how-it-works')}
              >
                Learn How Hirra Works
              </Button>
            </div>

            <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 anim-fade-up anim-delay-4">
              {TRUST_POINTS.map((point) => (
                <li
                  key={point}
                  className="flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400"
                >
                  <CircleCheck size={15} className="text-emerald-500 dark:text-emerald-400" />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/* Visual */}
          <div className="relative anim-scale-in anim-delay-2">
            {/* Glow behind dashboard */}
            <div
              aria-hidden="true"
              className="absolute inset-x-6 top-10 bottom-0 rounded-full bg-gradient-to-tr from-indigo-300/30 to-violet-300/25 blur-3xl dark:from-indigo-600/20 dark:to-purple-700/15 pointer-events-none"
            />

            <DashboardPlaceholder variant="compact" className="relative z-10" />

            {/* Floating candidate card */}
            <CandidateCardPlaceholder
              applicant={RECENT_APPLICANTS[0]}
              compact
              className="hidden lg:block absolute z-20 -top-7 -right-5 w-64 anim-float shadow-lg"
            />

            {/* Floating notification chip */}
            <div className="hidden sm:flex absolute z-20 -bottom-5 left-3 lg:-left-6 items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 shadow-card-hover anim-float-delayed dark:border-slate-700 dark:bg-slate-900">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 text-indigo-500 dark:bg-indigo-950/60 dark:text-indigo-400">
                <Sparkles size={15} />
              </span>
              <span>
                <span className="block text-xs font-bold text-slate-900 dark:text-white">
                  {NEW_APPLICATION_PING.title}
                </span>
                <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                  {NEW_APPLICATION_PING.body}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
