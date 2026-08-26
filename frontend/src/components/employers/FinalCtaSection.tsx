import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/common/Reveal';
import { startHiring } from '@/lib/employerCta';

export const FinalCtaSection: React.FC = () => {
  return (
    <section className="pb-20 pt-4 md:pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 px-6 py-14 sm:px-12 sm:py-16 text-center shadow-xl shadow-indigo-600/25">
            {/* Decorative dots */}
            <svg
              aria-hidden="true"
              className="absolute inset-0 w-full h-full opacity-[0.12] pointer-events-none"
            >
              <defs>
                <pattern
                  id="final-cta-dots"
                  x="0"
                  y="0"
                  width="22"
                  height="22"
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="2" cy="2" r="1.5" className="fill-white" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#final-cta-dots)" />
            </svg>

            {/* Ambient orbs */}
            <div
              aria-hidden="true"
              className="absolute -top-24 -left-16 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-28 -right-16 w-80 h-80 rounded-full bg-violet-400/25 blur-3xl pointer-events-none"
            />

            <div className="relative max-w-2xl mx-auto">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/20 px-3.5 py-1.5 text-xs font-bold text-white mb-6">
                <Zap size={13} />
                $0 to post your first job
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-white tracking-tight leading-tight mb-5">
                Your Next Great Hire Could Be One Job Post Away.
              </h2>

              <p className="text-indigo-100 leading-relaxed max-w-xl mx-auto mb-9">
                Start building your team today. Post your job for free and give the right
                candidate an opportunity to become part of what you're building.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
                <Button
                  size="lg"
                  onClick={startHiring}
                  className="group bg-white text-indigo-700 hover:bg-indigo-50 shadow-lg shadow-indigo-900/20 font-bold"
                >
                  Start Hiring!
                  <ArrowRight
                    size={18}
                    className="ml-2 group-hover:translate-x-1 transition-transform duration-200"
                  />
                </Button>
                <Button
                  size="lg"
                  asChild
                  className="border border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white shadow-none"
                >
                  <Link to="/jobs">Explore Hirra</Link>
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
