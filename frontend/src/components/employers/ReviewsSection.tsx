import React from 'react';
import { ThumbsUp } from 'lucide-react';
import { Reveal } from '@/components/common/Reveal';
import { StarRating } from '@/components/ui/StarRating';
import { Badge } from '@/components/ui/badge';
import {
  COMPANY_REVIEWS_SUMMARY,
  COMPANY_SAMPLE_REVIEWS,
} from '@/data/mockEmployers';

export const ReviewsSection: React.FC = () => {
  const { rating, reviewCount, recommendPercentage, categoryRatings } =
    COMPANY_REVIEWS_SUMMARY;

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Visual */}
          <Reveal className="order-2 lg:order-1">
            <div className="relative max-w-lg mx-auto w-full lg:max-w-none">
              <div
                aria-hidden="true"
                className="absolute inset-x-8 top-10 bottom-0 rounded-full bg-gradient-to-tr from-indigo-300/30 to-violet-300/25 blur-3xl dark:from-indigo-600/20 dark:to-purple-700/15 pointer-events-none"
              />

              <div className="relative rounded-2xl border border-slate-200 bg-white shadow-card p-6 sm:p-7 dark:border-slate-800 dark:bg-slate-900">
                {/* Summary */}
                <div className="flex flex-wrap items-end gap-x-4 gap-y-2 mb-2">
                  <p className="text-5xl font-extrabold leading-none text-slate-900 dark:text-white">
                    {rating.toFixed(1)}
                  </p>
                  <div className="pb-0.5">
                    <StarRating rating={rating} />
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Based on {reviewCount} employee reviews
                    </p>
                  </div>
                </div>

                {/* Recommend bar */}
                <div className="mt-5 rounded-xl bg-emerald-50/70 border border-emerald-100 p-3.5 dark:bg-emerald-950/30 dark:border-emerald-900/40">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                      <ThumbsUp size={13} />
                      Would recommend working here
                    </span>
                    <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                      {recommendPercentage}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-emerald-100 overflow-hidden dark:bg-emerald-950/60">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{ width: `${recommendPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Category ratings (reuses existing RatingBar) */}
                <div className="mt-5 space-y-3">
                  {categoryRatings.map((category) => (
                    <CategoryBar
                      key={category.label}
                      label={category.label}
                      value={category.value}
                    />
                  ))}
                </div>

                {/* Sample reviews */}
                <div className="mt-6 pt-5 border-t border-slate-100 space-y-4 dark:border-slate-800">
                  {COMPANY_SAMPLE_REVIEWS.map((review) => (
                    <div key={review.author}>
                      <StarRating rating={review.rating} size="sm" />
                      <p className="mt-1.5 text-sm text-slate-600 leading-relaxed dark:text-slate-300">
                        "{review.quote}"
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {review.author}
                        </span>
                        <Badge variant="secondary" className="!py-0 !text-[10px]">
                          {review.employmentStatus}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          {/* Copy */}
          <Reveal delay={120} className="order-1 lg:order-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-indigo-600 mb-4 dark:bg-indigo-950/60 dark:border-indigo-900/50 dark:text-indigo-400">
              Company Reviews
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4 dark:text-white">
              Candidates Want to Know Where They're Applying
            </h2>
            <p className="text-slate-600 leading-relaxed max-w-lg mb-6 dark:text-slate-400">
              Candidates don't only look at job titles — they want to understand the
              companies behind them.
            </p>
            <p className="text-slate-600 leading-relaxed max-w-lg mb-8 dark:text-slate-400">
              With company reviews on Hirra, great workplaces get the recognition they
              deserve, and candidates can apply with confidence.
            </p>

            <ul className="space-y-3 text-sm font-medium text-slate-700 dark:text-slate-300">
              <li className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                Build trust before the first conversation
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                Show off what makes your workplace worth joining
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                Stand next to your reviews, not just your job posts
              </li>
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

/* Local compact rating row built on the same visual language as RatingBar */
const CategoryBar: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div className="flex items-center gap-3">
    <span className="text-xs font-semibold text-slate-500 w-32 truncate dark:text-slate-400">
      {label}
    </span>
    <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden dark:bg-slate-800">
      <div
        className="h-full rounded-full bg-amber-400"
        style={{ width: `${(value / 5) * 100}%` }}
      />
    </div>
    <span className="text-xs font-bold text-slate-900 w-7 text-right dark:text-white">
      {value.toFixed(1)}
    </span>
  </div>
);
