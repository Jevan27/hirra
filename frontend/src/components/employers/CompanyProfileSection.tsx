import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BadgeCheck, BriefcaseBusiness, FileText, Star } from 'lucide-react';
import { Reveal } from '@/components/common/Reveal';
import { CompanyProfilePlaceholder } from './placeholders/CompanyProfilePlaceholder';

const PROFILE_BENEFITS = [
  {
    icon: BadgeCheck,
    text: 'Logo, cover photo, and your own branded space',
  },
  {
    icon: FileText,
    text: 'Tell candidates about your mission and story',
  },
  {
    icon: BriefcaseBusiness,
    text: 'Every open role in one discoverable place',
  },
  {
    icon: Star,
    text: 'Reviews that build trust before the first interview',
  },
];

export const CompanyProfileSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Copy */}
          <Reveal>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-indigo-600 mb-4 dark:bg-indigo-950/60 dark:border-indigo-900/50 dark:text-indigo-400">
              Company Profiles
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4 dark:text-white">
              Let Candidates Discover Your Company
            </h2>
            <p className="text-slate-600 leading-relaxed max-w-lg mb-8 dark:text-slate-400">
              A job description tells candidates what they're applying for. Your company
              profile tells them who they could be working with.
            </p>

            <ul className="space-y-3.5 mb-9">
              {PROFILE_BENEFITS.map((benefit) => (
                <li key={benefit.text} className="flex items-start gap-3">
                  <span className="shrink-0 mt-0.5 flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                    <benefit.icon size={15} />
                  </span>
                  <span className="text-sm sm:text-[15px] font-medium text-slate-700 leading-relaxed pt-1.5 dark:text-slate-300">
                    {benefit.text}
                  </span>
                </li>
              ))}
            </ul>

            <Link
              to="/companies"
              className="group inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-700 anim-transition-colors dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Explore company profiles on Hirra
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform duration-200"
              />
            </Link>
          </Reveal>

          {/* Visual */}
          <Reveal delay={120}>
            <div className="relative max-w-lg mx-auto w-full lg:max-w-none">
              <div
                aria-hidden="true"
                className="absolute inset-x-8 top-10 bottom-0 rounded-full bg-gradient-to-tr from-violet-300/30 to-indigo-300/25 blur-3xl dark:from-purple-700/20 dark:to-indigo-600/15 pointer-events-none"
              />
              <CompanyProfilePlaceholder className="relative" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};
