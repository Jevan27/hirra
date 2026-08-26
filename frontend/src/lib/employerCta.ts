import { toast } from 'sonner';

/**
 * Shared action for the "Start Hiring!" / "Start Hiring for Free" CTAs.
 *
 * The employer onboarding / post-job flow does not exist yet. When it does,
 * replace the body of this function with navigation to that route
 * (e.g. `navigate('/post-job')`) — every CTA on the For Employers page
 * routes through here, so the change is a one-liner.
 */
export const startHiring = () => {
  toast('Employer accounts are coming soon', {
    description:
      "We're putting the finishing touches on employer onboarding. Soon you'll be able to create your company and post your first job for free.",
  });
};

/** Smoothly scrolls to an in-page section id, respecting reduced-motion. */
export const scrollToSection = (id: string) => {
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
};
