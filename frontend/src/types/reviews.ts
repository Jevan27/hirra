import { Company } from '@/lib/api/jobs';

export interface CompanyRatingBreakdown {
  5: number; // percentage
  4: number;
  3: number;
  2: number;
  1: number;
}

export interface CompanyCategoryRatings {
  workLifeBalance: number;
  compensationBenefits: number;
  careerGrowth: number;
  management: number;
  culture: number;
}

export interface CompanyWithReviews extends Company {
  rating: number;
  reviewCount: number;
  recommendPercentage: number;
  openJobs: number;
  ratingBreakdown: CompanyRatingBreakdown;
  categoryRatings: CompanyCategoryRatings;
  featured?: boolean;
}

export interface Review {
  id: string;
  companyId: string;
  reviewerTitle: string;
  employmentStatus: 'Current Employee' | 'Former Employee';
  location: string;
  rating: number;
  title: string;
  body: string;
  pros: string[];
  cons: string[];
  date: string;
  helpfulCount: number;
  verified: boolean;
}
