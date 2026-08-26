import React from 'react';
import { cn } from '@/lib/utils';
import { useInView } from '@/hooks/useInView';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Stagger delay in ms before the reveal transition starts. */
  delay?: number;
}

/**
 * Scroll-reveal wrapper. Fades content upward as it enters the viewport,
 * reusing the page's decel easing. The global prefers-reduced-motion rule
 * collapses the transition so content appears instantly for those users.
 */
export const Reveal: React.FC<RevealProps> = ({ children, className, delay = 0 }) => {
  const { ref, isInView } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-500 ease-out will-change-transform',
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
        className
      )}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
};
