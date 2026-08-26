import React from 'react';
import '@/components/employers/employers.css';
import { EmployerHero } from '@/components/employers/EmployerHero';
import { FreeToPostSection } from '@/components/employers/FreeToPostSection';
import { WhatIsHirraSection } from '@/components/employers/WhatIsHirraSection';
import { WhyPostSection } from '@/components/employers/WhyPostSection';
import { StartupsSection } from '@/components/employers/StartupsSection';
import { HowItWorksSection } from '@/components/employers/HowItWorksSection';
import { ProductPreviewSection } from '@/components/employers/ProductPreviewSection';
import { CompanyProfileSection } from '@/components/employers/CompanyProfileSection';
import { ReviewsSection } from '@/components/employers/ReviewsSection';
import { AudienceSection } from '@/components/employers/AudienceSection';
import { TestimonialsSection } from '@/components/employers/TestimonialsSection';
import { FinalCtaSection } from '@/components/employers/FinalCtaSection';

/**
 * For Employers landing page.
 *
 * Pure content — the shared Layout (Navbar/Footer) wraps this page via
 * the pathless layout route in App.tsx.
 */
export const EmployersPage: React.FC = () => {
  return (
    <div className="overflow-x-clip">
      <EmployerHero />
      <FreeToPostSection />
      <WhatIsHirraSection />
      <WhyPostSection />
      <StartupsSection />
      <HowItWorksSection />
      <ProductPreviewSection />
      <CompanyProfileSection />
      <ReviewsSection />
      <AudienceSection />
      <TestimonialsSection />
      <FinalCtaSection />
    </div>
  );
};
