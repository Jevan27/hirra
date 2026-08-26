import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImagePlaceholderProps {
  icon: LucideIcon;
  label: string;
  sublabel?: string;
  className?: string;
  iconClassName?: string;
  /** Force the dark palette for placements on always-dark surfaces. */
  onDark?: boolean;
}

/**
 * Polished, intentional image placeholder.
 * Used anywhere real photography/artwork will eventually live —
 * never a plain gray rectangle or "IMAGE HERE" text.
 */
export const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({
  icon: Icon,
  label,
  sublabel,
  className,
  iconClassName,
  onDark = false,
}) => {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border bg-gradient-to-br',
        onDark
          ? 'border-white/10 from-indigo-500/15 via-slate-800/60 to-violet-500/10'
          : 'border-indigo-100/80 from-indigo-50 via-slate-50 to-violet-50 dark:border-indigo-900/40 dark:from-indigo-950/40 dark:via-slate-900 dark:to-violet-950/30',
        className
      )}
    >
      {/* Dot-matrix texture */}
      <svg
        aria-hidden="true"
        className={cn('absolute inset-0 h-full w-full', onDark ? 'opacity-20' : 'opacity-60 dark:opacity-25')}
      >
        <defs>
          <pattern
            id="image-placeholder-dots"
            x="0"
            y="0"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx="2"
              cy="2"
              r="1.5"
              className={onDark ? 'fill-white' : 'fill-indigo-200 dark:fill-indigo-800'}
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#image-placeholder-dots)" />
      </svg>

      {/* Soft corner glows */}
      <div
        aria-hidden="true"
        className={cn(
          'absolute -top-10 -right-10 w-44 h-44 rounded-full blur-3xl pointer-events-none',
          onDark ? 'bg-indigo-400/15' : 'bg-indigo-200/40 dark:bg-indigo-600/15'
        )}
      />
      <div
        aria-hidden="true"
        className={cn(
          'absolute -bottom-12 -left-8 w-40 h-40 rounded-full blur-3xl pointer-events-none',
          onDark ? 'bg-violet-400/10' : 'bg-violet-200/35 dark:bg-violet-700/10'
        )}
      />

      {/* Centered label chip */}
      <div className="relative h-full flex flex-col items-center justify-center gap-2.5 text-center px-6">
        <span
          className={cn(
            'flex items-center justify-center w-11 h-11 rounded-xl border shadow-sm backdrop-blur-sm',
            onDark
              ? 'bg-white/10 border-white/15 text-indigo-300'
              : 'bg-white/80 border-indigo-100 text-indigo-500 dark:bg-slate-800/80 dark:border-slate-700 dark:text-indigo-400',
            iconClassName
          )}
        >
          <Icon size={20} />
        </span>
        <p
          className={cn(
            'text-sm font-semibold',
            onDark ? 'text-slate-200' : 'text-slate-600 dark:text-slate-300'
          )}
        >
          {label}
        </p>
        {sublabel && (
          <span
            className={cn(
              'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium backdrop-blur-sm border',
              onDark
                ? 'bg-white/10 border-white/15 text-slate-300'
                : 'bg-white/70 border-slate-200 text-slate-500 dark:bg-slate-800/70 dark:border-slate-700 dark:text-slate-400'
            )}
          >
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
};
