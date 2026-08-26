import React from 'react';
import { Link } from 'react-router-dom';
import { CompanyWithReviews } from '@/types/reviews';
import { CompanyLogo } from './CompanyLogo';
import { StarRating } from '../ui/StarRating';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

interface CompanyCardProps {
  company: CompanyWithReviews;
}

export const CompanyCard: React.FC<CompanyCardProps> = ({ company }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all dark:bg-slate-900 dark:border-slate-800">
      <div className="flex items-start gap-4 mb-4">
        <CompanyLogo company={company} size="md" />
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white truncate">
            {company.name}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
            {company.industry} • {company.location}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-2 mb-4">
        <StarRating rating={company.rating} size="sm" />
        <span className="text-sm font-semibold text-slate-900 dark:text-white">
          {company.rating.toFixed(1)}
        </span>
        <span className="text-sm text-slate-500 dark:text-slate-400">
          ({company.reviewCount} reviews)
        </span>
      </div>

      <div className="flex gap-2 mb-4">
        <Badge variant="secondary">{company.recommendPercentage}% Recommend</Badge>
        <Badge variant="outline">{company.openJobs} Jobs</Badge>
      </div>

      <Link to={`/companies/${company.slug}`}>
        <Button className="w-full" variant="outline">View Reviews</Button>
      </Link>
    </div>
  );
};
