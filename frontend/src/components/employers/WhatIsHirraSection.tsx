import React from 'react';
import { ArrowDown, Building, Users } from 'lucide-react';
import { Reveal } from '@/components/common/Reveal';
import { Badge } from '@/components/ui/badge';
import { HIRRA_ECOSYSTEM_FEATURES } from '@/data/mockEmployers';

export const WhatIsHirraSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Reveal className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-5 dark:text-white">
            What is Hirra?
          </h2>
          <p className="text-slate-600 leading-relaxed mb-4 dark:text-slate-400">
            Hirra is a job and career platform built to connect companies with people
            looking for their next opportunity.
          </p>
          <p className="text-slate-600 leading-relaxed dark:text-slate-400">
            We believe finding great talent shouldn't be complicated — and discovering a
            great job shouldn't depend on having the perfect network.
          </p>
        </Reveal>

        {/* Ecosystem visual: Companies <-> Candidates */}
        <Reveal delay={100}>
          <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-stretch justify-center gap-3 md:gap-2">
            {/* Companies node */}
            <div className="flex-1 max-w-xs mx-auto w-full rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 mb-3 dark:bg-indigo-950/60 dark:text-indigo-400">
                <Building size={20} />
              </span>
              <p className="font-bold text-slate-900 mb-1 dark:text-white">Companies</p>
              <p className="text-xs text-slate-500 leading-relaxed dark:text-slate-400">
                Post jobs and share who they are
              </p>
            </div>

            {/* Connector */}
            <div className="relative flex items-center justify-center py-1 md:w-36 md:py-0">
              {/* Mobile: simple down arrow */}
              <ArrowDown
                aria-hidden="true"
                size={18}
                className="md:hidden text-indigo-300 dark:text-indigo-700"
              />
              {/* Desktop: animated dashed line */}
              <svg
                aria-hidden="true"
                className="hidden md:block absolute inset-x-0 top-1/2 -translate-y-1/2 w-full h-px"
              >
                <line
                  x1="0"
                  y1="0.5"
                  x2="100%"
                  y2="0.5"
                  strokeDasharray="6 6"
                  className="stroke-indigo-300 anim-dash-march dark:stroke-indigo-700"
                />
              </svg>
              <span className="relative z-10 inline-flex items-center rounded-full bg-indigo-600 text-white px-4 py-1.5 text-xs font-extrabold tracking-wide shadow-md shadow-indigo-600/25 dark:bg-indigo-500">
                Hirra
              </span>
            </div>

            {/* Candidates node */}
            <div className="flex-1 max-w-xs mx-auto w-full rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-violet-50 text-violet-600 mb-3 dark:bg-violet-950/60 dark:text-violet-400">
                <Users size={20} />
              </span>
              <p className="font-bold text-slate-900 mb-1 dark:text-white">Candidates</p>
              <p className="text-xs text-slate-500 leading-relaxed dark:text-slate-400">
                Discover opportunities and companies
              </p>
            </div>
          </div>
        </Reveal>

        {/* Ecosystem chips */}
        <Reveal delay={180} className="mt-10 flex flex-wrap justify-center gap-2.5">
          {HIRRA_ECOSYSTEM_FEATURES.map((feature) => (
            <Badge key={feature} variant="outline" className="!py-1.5 !px-3.5">
              {feature}
            </Badge>
          ))}
        </Reveal>

        <Reveal delay={240} className="mt-8 text-center">
          <p className="text-sm font-semibold text-slate-500 max-w-xl mx-auto leading-relaxed dark:text-slate-400">
            More than a job-posting form — an ecosystem where companies get opportunities
            to hire, and candidates get opportunities to grow.
          </p>
        </Reveal>
      </div>
    </section>
  );
};
