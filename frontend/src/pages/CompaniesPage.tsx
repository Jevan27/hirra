import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowUpDown, Search } from 'lucide-react';
import { MOCK_COMPANIES } from '@/data/mockReviews';
import { CompanyCard } from '@/components/companies/CompanyCard';
import { EmptyState } from '@/components/common/EmptyState';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type SortOption = 'rating' | 'reviews' | 'jobs';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'rating', label: 'Highest Rated' },
  { value: 'reviews', label: 'Most Reviews' },
  { value: 'jobs', label: 'Most Open Jobs' },
];

export const CompaniesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [industry, setIndustry] = useState('All');
  const [sortBy, setSortBy] = useState<SortOption>('rating');

  const industries = useMemo(
    () => ['All', ...Array.from(new Set(MOCK_COMPANIES.map((c) => c.industry)))],
    []
  );

  const filteredCompanies = useMemo(() => {
    const q = query.trim().toLowerCase();

    const result = MOCK_COMPANIES.filter((company) => {
      const matchesQuery =
        !q ||
        company.name.toLowerCase().includes(q) ||
        company.industry.toLowerCase().includes(q) ||
        company.location.toLowerCase().includes(q);
      const matchesIndustry = industry === 'All' || company.industry === industry;
      return matchesQuery && matchesIndustry;
    });

    return [...result].sort((a, b) => {
      switch (sortBy) {
        case 'reviews':
          return b.reviewCount - a.reviewCount;
        case 'jobs':
          return b.openJobs - a.openJobs;
        default:
          return b.rating - a.rating;
      }
    });
  }, [query, industry, sortBy]);

  const handleSearchChange = (value: string) => {
    setQuery(value);
    const next = new URLSearchParams(searchParams);
    if (value.trim()) {
      next.set('q', value);
    } else {
      next.delete('q');
    }
    setSearchParams(next, { replace: true });
  };

  const handleReset = () => {
    setQuery('');
    setIndustry('All');
    setSortBy('rating');
    setSearchParams({}, { replace: true });
  };

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

      {/* Hero */}
      <div className="text-center mb-10 anim-fade-up">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3 dark:text-white">
          Discover What It's Really Like to Work There
        </h1>
        <p className="text-base sm:text-lg text-slate-600 mb-8 dark:text-slate-400">
          Read honest reviews from employees at top companies.
        </p>
        <div className="max-w-xl mx-auto flex gap-2">
          <Input
            value={query}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search by company, industry, or location..."
            className="h-11"
            aria-label="Search companies"
          />
          <Button className="h-11" aria-label="Search">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
      </div>

      {/* Industry Filter Chips + Sort */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6 anim-fade-up anim-delay-1">
        <div className="flex flex-wrap gap-2">
          {industries.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setIndustry(item)}
              className={cn(
                'px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors',
                industry === item
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:border-indigo-700 dark:hover:text-indigo-400'
              )}
            >
              {item}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 text-sm font-medium text-slate-500 shrink-0 dark:text-slate-400">
          <ArrowUpDown size={15} />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            aria-label="Sort companies"
            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Results Count */}
      <p className="text-sm text-slate-500 mb-6 anim-fade-up anim-delay-2 dark:text-slate-400">
        Showing {filteredCompanies.length} of {MOCK_COMPANIES.length} companies
      </p>

      {/* Grid */}
      {filteredCompanies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 anim-fade-up anim-delay-2">
          {filteredCompanies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No companies found"
          description="We couldn't find any companies matching your search or filter criteria. Try adjusting your filters or search keywords."
          onReset={handleReset}
        />
      )}
    </div>
  );
};
