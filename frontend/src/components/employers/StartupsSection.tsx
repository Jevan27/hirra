import React from 'react';
import { ArrowRight, BriefcaseBusiness, CalendarCheck, ChevronRight, HeartHandshake, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Reveal } from '@/components/common/Reveal';
import { CulturePlaceholder } from './placeholders/CulturePlaceholder';
import { HIRRA_COMPANY, STARTUP_STORY_LINES } from '@/data/mockEmployers';
import { startHiring } from '@/lib/employerCta';

export const StartupsSection: React.FC = () => {
  return (
    <section className="py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-hirra-footer text-slate-300 shadow-xl">
            {/* Ambient glows */}
            <div
              aria-hidden="true"
              className="absolute -top-32 -left-24 w-[480px] h-[480px] rounded-full bg-indigo-600/20 blur-[110px] pointer-events-none"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-40 -right-24 w-[460px] h-[460px] rounded-full bg-violet-600/15 blur-[110px] pointer-events-none"
            />

            {/* Dot texture */}
            <svg
              aria-hidden="true"
              className="absolute inset-0 w-full h-full opacity-[0.07] pointer-events-none"
            >
              <defs>
                <pattern
                  id="startups-dots"
                  x="0"
                  y="0"
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="2" cy="2" r="1.5" className="fill-white" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#startups-dots)" />
            </svg>

            <div className="relative grid lg:grid-cols-2 gap-10 lg:gap-14 p-7 sm:p-10 lg:p-14">
              {/* Emotional copy */}
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-3 py-1 text-xs font-bold text-indigo-200 mb-6">
                  <HeartHandshake size={13} />
                  For startups & small businesses
                </span>

                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-5">
                  Big Companies Aren't the Only Ones That Deserve Great Talent.
                </h2>

                <p className="text-slate-300/90 leading-relaxed mb-7 max-w-lg">
                  Starting a company is already difficult. Hiring shouldn't be another
                  barrier. Hirra gives newer and smaller companies a real chance to
                  compete for the people they need.
                </p>

                <ul className="space-y-3 mb-9">
                  {STARTUP_STORY_LINES.map((line) => (
                    <li key={line} className="flex items-start gap-2.5">
                      <ChevronRight
                        size={17}
                        className="shrink-0 mt-0.5 text-indigo-400"
                      />
                      <span className="text-sm sm:text-[15px] font-medium text-slate-200 leading-relaxed">
                        {line}
                      </span>
                    </li>
                  ))}
                  <li className="flex items-start gap-2.5">
                    <ChevronRight size={17} className="shrink-0 mt-0.5 text-indigo-400" />
                    <span className="text-sm sm:text-[15px] font-bold text-white leading-relaxed">
                      Hirra gives you a place to share those opportunities — for free.
                    </span>
                  </li>
                </ul>

                <Button size="lg" variant="brand" onClick={startHiring} className="group">
                  Start Hiring for Free
                  <ArrowRight
                    size={18}
                    className="ml-2 group-hover:translate-x-1 transition-transform duration-200"
                  />
                </Button>
              </div>

              {/* Company visual story */}
              <div className="flex items-center">
                <div className="w-full rounded-2xl overflow-hidden border border-white/10 bg-slate-900/70 backdrop-blur shadow-2xl">
                  <CulturePlaceholder
                    companyName={HIRRA_COMPANY.name}
                    onDark
                    className="!rounded-none border-0 border-b border-white/10 !min-h-[200px] sm:!min-h-[230px]"
                  />

                  <div className="p-5 sm:p-6">
                    {/* Identity */}
                    <div className="flex items-center gap-3 mb-3">
                      <span className="w-11 h-11 rounded-xl bg-indigo-500 text-white text-base font-extrabold flex items-center justify-center shrink-0">
                        H
                      </span>
                      <div className="min-w-0">
                        <p className="font-extrabold text-white truncate">
                          {HIRRA_COMPANY.name}
                        </p>
                        <p className="text-xs text-slate-400 truncate">
                          {HIRRA_COMPANY.industry} · {HIRRA_COMPANY.location}
                        </p>
                      </div>
                      <Badge
                        variant="remote"
                        className="ml-auto shrink-0 !bg-emerald-500/15 !border-emerald-400/20 !text-emerald-300"
                      >
                        Hiring on Hirra
                      </Badge>
                    </div>

                    <blockquote className="border-l-2 border-indigo-500 pl-3.5 text-sm italic text-slate-300 leading-relaxed mb-5">
                      "{HIRRA_COMPANY.quote}"
                    </blockquote>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2.5">
                      {[
                        { icon: Users, label: HIRRA_COMPANY.employees },
                        {
                          icon: BriefcaseBusiness,
                          label: `${HIRRA_COMPANY.openRoles} open roles`,
                        },
                        { icon: CalendarCheck, label: HIRRA_COMPANY.founded },
                      ].map((stat) => (
                        <div
                          key={stat.label}
                          className="rounded-xl bg-white/5 border border-white/10 px-2.5 py-2.5 text-center"
                        >
                          <stat.icon size={14} className="mx-auto text-indigo-400 mb-1" />
                          <p className="text-[11px] font-semibold text-slate-300 leading-tight">
                            {stat.label}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
