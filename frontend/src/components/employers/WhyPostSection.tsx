import React from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  Eye,
  MessageSquare,
  MousePointerClick,
  Sprout,
  Users,
  Zap,
} from 'lucide-react';
import { Reveal } from '@/components/common/Reveal';
import { WHY_POST_BENEFITS } from '@/data/mockEmployers';

const BENEFIT_ICONS: LucideIcon[] = [Zap, Users, Eye, Sprout, MessageSquare, MousePointerClick];

export const WhyPostSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-2xl mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4 dark:text-white">
            Why Post Your Job on Hirra?
          </h2>
          <p className="text-slate-600 leading-relaxed dark:text-slate-400">
            You're building something. Hirra helps you find the people who can help you
            build it — without the barriers.
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {WHY_POST_BENEFITS.map((benefit, index) => {
            const Icon = BENEFIT_ICONS[index % BENEFIT_ICONS.length];
            return (
              <Reveal key={benefit.id} delay={index * 70}>
                <div className="group relative h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm overflow-hidden anim-hover-lift hover:shadow-card-hover hover:border-indigo-200 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-900/60">
                  {/* Number watermark */}
                  <span
                    aria-hidden="true"
                    className="absolute top-4 right-5 text-3xl font-extrabold text-slate-100 select-none dark:text-slate-800"
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 mb-5 group-hover:scale-105 transition-transform duration-200 dark:bg-indigo-950/60 dark:text-indigo-400">
                    <Icon size={20} />
                  </span>

                  <h3 className="font-bold text-slate-900 mb-2 leading-snug dark:text-white">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed dark:text-slate-400">
                    {benefit.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};
