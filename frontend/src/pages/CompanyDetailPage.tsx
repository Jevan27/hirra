import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { MOCK_COMPANIES, MOCK_REVIEWS } from '@/data/mockReviews';
import { CompanyLogo } from '@/components/companies/CompanyLogo';
import { StarRating } from '@/components/ui/StarRating';
import { RatingBar } from '@/components/ui/RatingBar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const CompanyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const company = MOCK_COMPANIES.find((c) => c.slug === id);
  const reviews = MOCK_REVIEWS.filter((r) => r.companyId === company?.id);

  if (!company) {
    return <Navigate to="/companies" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-8 dark:bg-slate-900 dark:border-slate-800 flex items-start gap-6">
        <CompanyLogo company={company} size="lg" />
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{company.name}</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-2">{company.description}</p>
          <div className="flex gap-2">
            <Badge variant="secondary">{company.industry}</Badge>
            <Badge variant="outline">{company.location}</Badge>
          </div>
        </div>
      </div>

      {/* Ratings & Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Rating Breakdown */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-6 h-fit dark:bg-slate-900 dark:border-slate-800">
          <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">Ratings</h2>
          <div className="flex items-center gap-2 mb-6">
            <span className="text-4xl font-bold text-slate-900 dark:text-white">{company.rating.toFixed(1)}</span>
            <StarRating rating={company.rating} size="lg" />
          </div>
          
          <div className="space-y-3">
            <RatingBar label="Work-Life Balance" value={company.categoryRatings.workLifeBalance} />
            <RatingBar label="Compensation" value={company.categoryRatings.compensationBenefits} />
            <RatingBar label="Career Growth" value={company.categoryRatings.careerGrowth} />
            <RatingBar label="Management" value={company.categoryRatings.management} />
            <RatingBar label="Culture" value={company.categoryRatings.culture} />
          </div>
        </div>

        {/* Reviews Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Reviews ({reviews.length})</h2>
            <Button>Write a Review</Button>
          </div>
          
          {reviews.map((review) => (
            <div key={review.id} className="bg-white border border-slate-200 rounded-2xl p-6 dark:bg-slate-900 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-2">
                <StarRating rating={review.rating} size="sm" />
                <span className="font-semibold text-slate-900 dark:text-white">{review.rating.toFixed(1)}</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">{review.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">{review.body}</p>
              <div className="flex gap-2">
                <Badge variant="outline">{review.reviewerTitle}</Badge>
                <Badge variant="secondary">{review.employmentStatus}</Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
