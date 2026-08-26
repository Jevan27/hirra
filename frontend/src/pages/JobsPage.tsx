import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import { JobSearch } from '@/components/jobs/JobSearch';
import { JobGrid } from '@/components/jobs/JobGrid';
import { JobFilters } from '@/components/jobs/JobFilters';
import { JobDetailDrawer } from '@/components/jobs/JobDetailDrawer';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useJobs } from '@/hooks/useJobs';

export const JobsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [arrangement, setArrangement] = useState('all');
  const [employmentType, setEmploymentType] = useState('all');
  const [experienceLevel, setExperienceLevel] = useState('all');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const filters = {
    q: query,
    location,
    workArrangement: arrangement,
    employmentType,
    experienceLevel,
  };

  const { data, isLoading, isError, error, refetch } = useJobs(filters);

  const handleSearch = (q: string, loc: string) => {
    setQuery(q);
    setLocation(loc);
  };

  const handleResetFilters = () => {
    setQuery('');
    setLocation('');
    setArrangement('all');
    setEmploymentType('all');
    setExperienceLevel('all');
    setSearchParams({});
  };

  return (
    <>
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Top Search Bar */}
        <div className="mb-10 anim-fade-up">
          <JobSearch
            onSearch={handleSearch}
            initialQuery={query}
            initialLocation={location}
            showPopularTags={false}
          />
        </div>

        {/* Header Summary & Mobile Filter Toggle */}
        <div className="flex items-center justify-between mb-6 anim-fade-up anim-delay-1">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight dark:text-white">
              Explore All Jobs
            </h1>
            <p className="text-sm text-slate-500 mt-1 dark:text-slate-400">
              {isLoading
                ? 'Searching opportunities...'
                : `Showing ${data?.jobs?.length || 0} open positions`}
            </p>
          </div>

          {/* Mobile Filter Button */}
          <div className="lg:hidden">
            <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="gap-2 anim-active-press">
                  <SlidersHorizontal size={16} />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] overflow-y-auto">
                <SheetHeader className="mb-4">
                  <SheetTitle>Filter Positions</SheetTitle>
                </SheetHeader>
                <JobFilters
                  arrangement={arrangement}
                  onArrangementChange={(v) => {
                    setArrangement(v);
                    setMobileFiltersOpen(false);
                  }}
                  employmentType={employmentType}
                  onEmploymentTypeChange={(v) => {
                    setEmploymentType(v);
                    setMobileFiltersOpen(false);
                  }}
                  experienceLevel={experienceLevel}
                  onExperienceLevelChange={(v) => {
                    setExperienceLevel(v);
                    setMobileFiltersOpen(false);
                  }}
                  onReset={() => {
                    handleResetFilters();
                    setMobileFiltersOpen(false);
                  }}
                />
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* 2-Column Desktop Layout: Sidebar Filters & Results */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start anim-fade-up anim-delay-2">
          
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block lg:col-span-1 sticky top-28">
            <JobFilters
              arrangement={arrangement}
              onArrangementChange={setArrangement}
              employmentType={employmentType}
              onEmploymentTypeChange={setEmploymentType}
              experienceLevel={experienceLevel}
              onExperienceLevelChange={setExperienceLevel}
              onReset={handleResetFilters}
            />
          </div>

          {/* Jobs Grid Column */}
          <div className="lg:col-span-3">
            <JobGrid
              jobs={data?.jobs}
              isLoading={isLoading}
              isError={isError}
              error={error}
              onRetry={refetch}
              onResetFilters={handleResetFilters}
              onSelectJob={(job) => setSelectedJobId(job.id)}
              skeletonCount={6}
            />
          </div>

        </div>

      </div>

      {/* Slide-over Job Details Drawer */}
      <JobDetailDrawer
        jobId={selectedJobId}
        onClose={() => setSelectedJobId(null)}
      />
    </>
  );
};
