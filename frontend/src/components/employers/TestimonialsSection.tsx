import React from 'react';
import { Quote } from 'lucide-react';
import { Reveal } from '@/components/common/Reveal';
import { Badge } from '@/components/ui/badge';
import { TESTIMONIALS } from '@/data/mockEmployers';

const AVATAR_GRADIENTS = [
  'from-indigo-500 to-violet-500',
  'from-sky-500 to-indigo-500',
  'from-violet-500 to-fuchsia-500',
];

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4 dark:text-white">
            Built to Help Companies Grow
          </h2>
          <Badge variant="outline" className="mb-4">
            Illustrative examples
          </Badge>
          <p className="text-sm text-slate-500 leading-relaxed max-w-xl mx-auto dark:text-slate-400">
            Hirra is a place where companies and candidates discover each other. These are
            example stories representing the teams we're building for — not customer
            quotes yet.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((testimonial, index) => (
            <Reveal key={testimonial.name} delay={index * 90}>
              <figure className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col anim-hover-lift hover:shadow-card-hover dark:border-slate-800 dark:bg-slate-900">
                <Quote
                  size={26}
                  className="text-indigo-200 mb-4 dark:text-indigo-800"
                  aria-hidden="true"
                />
                <blockquote className="flex-1 text-sm sm:text-[15px] text-slate-700 leading-relaxed mb-5 dark:text-slate-300">
                  "{testimonial.quote}"
                </blockquote>
                <figcaption className="pt-4 border-t border-slate-100 flex items-center gap-3 dark:border-slate-800">
                  <span
                    className={`w-10 h-10 rounded-full bg-gradient-to-br ${AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length]} text-white text-xs font-bold flex items-center justify-center shrink-0`}
                  >
                    {testimonial.initials}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-bold text-slate-900 truncate dark:text-white">
                      {testimonial.name}
                    </span>
                    <span className="block text-xs text-slate-500 truncate dark:text-slate-400">
                      {testimonial.role} · {testimonial.company}
                    </span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
