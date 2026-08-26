import { useEffect, useRef, useState } from 'react';

interface UseInViewOptions {
  threshold?: number;
  rootMargin?: string;
}

/**
 * Observes an element and reports when it first enters the viewport.
 * Fires only once, then disconnects. Falls back to an immediate reveal
 * when IntersectionObserver is unavailable so content is never hidden.
 */
export function useInView<T extends HTMLElement>(options?: UseInViewOptions) {
  const { threshold = 0.1, rootMargin = '0px 0px -48px 0px' } = options ?? {};
  const ref = useRef<T | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const show = () => setIsInView(true);

    if (typeof IntersectionObserver === 'undefined') {
      const timer = window.setTimeout(show, 0);
      return () => window.clearTimeout(timer);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          show();
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return { ref, isInView };
}
