import React from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  Globe,
  Landmark,
  Plus,
  Rocket,
  Sprout,
  TrendingUp,
  Users,
} from 'lucide-react';
import { Reveal } from '@/components/common/Reveal';
import { AUDIENCE_CARDS } from '@/data/mockEmployers';
import { cn } from '@/lib/utils';

const AUDIENCE_ICONS: Record<string, LucideIcon> = {
  sprout: Sprout,
  rocket: Rocket,
  landmark: Landmark,
  globe: Globe,
};

/* Small decorative tile used inside the mini illustrations */
const Tile: React.FC<{ children?: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <span
    className={cn(
      'inline-flex items-center justify-center rounded-xl bg-white border border-slate-200 shadow-sm text-indigo-500 dark:bg-slate-800 dark:border-slate-700 dark:text-indigo-400',
      className
    )}
  >
    {children}
  </span>
);

const AUDIENCE_ILLUSTRATIONS: Record<string, React.ReactNode> = {
  sprout: (
    <div className="relative flex items-center justify-center">
      <Tile className="w-14 h-14">
        <Sprout size={26} />
      </Tile>
      <Tile className="absolute -right-3 -bottom-1 w-7 h-7 rounded-lg text-slate-400 dark:text-slate-500">
        <Plus size={14} />
      </Tile>
    </div>
  ),
  rocket: (
    <div className="relative flex items-center justify-center">
      <Tile className="w-11 h-11 -mr-2 rotate-[-6deg]">
        <Rocket size={19} />
      </Tile>
      <Tile className="w-11 h-11 z-10">
        <Users size={19} />
      </Tile>
      <Tile className="w-11 h-11 -ml-2 rotate-[6deg]">
        <TrendingUp size={19} />
      </Tile>
    </div>
  ),
  landmark: (
    <div className="flex items-center justify-center gap-2.5">
      <Tile className="w-12 h-12">
        <Landmark size={22} />
      </Tile>
      <div className="grid grid-cols-2 gap-1.5">
        <Tile className="w-6 h-6 !rounded-md" />
        <Tile className="w-6 h-6 !rounded-md" />
        <Tile className="w-6 h-6 !rounded-md" />
        <Tile className="w-6 h-6 !rounded-md text-slate-300 dark:text-slate-600">
          <Plus size={11} />
        </Tile>
      </div>
    </div>
  ),
  globe: (
    <div className="relative flex items-center justify-center">
      <Tile className="w-14 h-14 !rounded-full">
        <Globe size={26} />
      </Tile>
      <span className="absolute top-0 right-2 w-2.5 h-2.5 rounded-full bg-indigo-400 anim-live-dot" />
      <span className="absolute bottom-1 left-4 w-2 h-2 rounded-full bg-violet-400" />
      <span className="absolute bottom-3 right-6 w-2 h-2 rounded-full bg-emerald-400" />
    </div>
  ),
};

export const AudienceSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4 dark:text-white">
            Built for Companies at Every Stage
          </h2>
          <p className="text-slate-600 leading-relaxed dark:text-slate-400">
            Wherever your hiring journey begins, Hirra grows with you.
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {AUDIENCE_CARDS.map((card, index) => {
            const Icon = AUDIENCE_ICONS[card.icon] ?? Sprout;
            return (
              <Reveal key={card.id} delay={index * 80}>
                <div className="group h-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm anim-hover-lift hover:shadow-card-hover hover:border-indigo-200 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-900/60">
                  {/* Mini illustration area */}
                  <div className="relative h-28 rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100/70 flex items-center justify-center overflow-hidden mb-4 dark:from-indigo-950/50 dark:to-violet-950/30 dark:border-indigo-900/40">
                    {AUDIENCE_ILLUSTRATIONS[card.icon]}
                  </div>

                  <div className="flex items-center gap-2 mb-1.5">
                    <Icon size={15} className="text-indigo-500 dark:text-indigo-400" />
                    <h3 className="font-bold text-slate-900 dark:text-white">
                      {card.title}
                    </h3>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed dark:text-slate-400">
                    {card.description}
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
