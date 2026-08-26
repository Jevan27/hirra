import React from 'react';
import { Reveal } from '@/components/common/Reveal';
import { HOW_IT_WORKS_STEPS } from '@/data/mockEmployers';

export const HowItWorksSection: React.FC = () => {
  return (
    <section id="how-it-works" className="scroll-mt-24 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4 dark:text-white">
            Start Hiring in Three Steps
          </h2>
          <p className="text-slate-600 leading-relaxed dark:text-slate-400">
            From empty seat to signed offer — getting started on Hirra is deliberately
            simple.
          </p>
        </Reveal>

        <div className="relative">
          {/* Connecting line (desktop) */}
          <div
            aria-hidden="true"
            className="hidden md:block absolute top-[72px] left-[18%] right-[18%] border-t-2 border-dashed border-indigo-200 dark:border-indigo-900"
          />

          <div className="grid md:grid-cols-3 gap-6">
            {HOW_IT_WORKS_STEPS.map((step, index) => (
              <Reveal key={step.step} delay={index * 110}>
                <div className="relative h-full rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-sm anim-hover-lift hover:shadow-card-hover dark:border-slate-800 dark:bg-slate-900">
                  <span className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-500 text-white text-lg font-extrabold shadow-md shadow-indigo-600/25 mb-5 dark:from-indigo-500 dark:to-violet-500">
                    {step.step}
                  </span>
                  <h3 className="font-bold text-lg text-slate-900 mb-2 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed max-w-[26ch] mx-auto dark:text-slate-400">
                    {step.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
