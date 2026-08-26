import React from 'react';
import { Reveal } from '@/components/common/Reveal';
import { DashboardPlaceholder } from './placeholders/DashboardPlaceholder';

export const ProductPreviewSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4 dark:text-white">
            Everything You Need to Start Hiring
          </h2>
          <p className="text-slate-600 leading-relaxed dark:text-slate-400">
            Track active jobs, review applications, and move candidates through your
            hiring pipeline — all in one place.
          </p>
        </Reveal>

        {/* Large product visual */}
        <Reveal delay={120}>
          <div className="relative max-w-5xl mx-auto">
            <div
              aria-hidden="true"
              className="absolute inset-x-10 top-8 bottom-0 rounded-full bg-gradient-to-tr from-indigo-300/30 to-violet-300/25 blur-3xl dark:from-indigo-600/20 dark:to-purple-700/15 pointer-events-none"
            />
            <DashboardPlaceholder variant="full" className="relative" />
          </div>
          <p className="mt-6 text-center text-xs font-medium text-slate-400 dark:text-slate-500">
            Illustrative preview of the Hirra employer workspace.
          </p>
        </Reveal>
      </div>
    </section>
  );
};
