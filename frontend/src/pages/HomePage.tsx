import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { JobSearch } from '@/components/jobs/JobSearch';
import { JobGrid } from '@/components/jobs/JobGrid';
import { JobDetailDrawer } from '@/components/jobs/JobDetailDrawer';
import { useFeaturedJobs } from '@/hooks/useFeaturedJobs';
import { useJobs } from '@/hooks/useJobs';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState<{ q: string; location: string } | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const {
    data: featuredJobs,
    isLoading: isFeaturedLoading,
    isError: isFeaturedError,
    error: featuredError,
    refetch: refetchFeatured,
  } = useFeaturedJobs();

  // If the user performs a search on the home hero, we fetch live query results
  const {
    data: searchResults,
    isLoading: isSearchLoading,
    isError: isSearchError,
    error: searchError,
    refetch: refetchSearch,
  } = useJobs(searchParams ? { q: searchParams.q, location: searchParams.location } : undefined);

  const handleHeroSearch = (query: string, location: string) => {
    if (!query && (!location || location === 'Manila, Philippines')) {
      setSearchParams(null);
      return;
    }
    setSearchParams({ q: query, location });
  };

  const handleResetSearch = () => {
    setSearchParams(null);
  };

  const isCustomSearch = Boolean(searchParams);
  const displayJobs = isCustomSearch ? searchResults?.jobs : featuredJobs;
  const isLoading = isCustomSearch ? isSearchLoading : isFeaturedLoading;
  const isError = isCustomSearch ? isSearchError : isFeaturedError;
  const error = isCustomSearch ? searchError : featuredError;
  const onRetry = isCustomSearch ? refetchSearch : refetchFeatured;

  return (
    <div className="min-h-screen flex flex-col bg-[#fafbfc] dark:bg-slate-950 transition-colors">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section with Reference Design Background Blobs & Dots */}
        <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
          
          {/* Seamless Theme-Aware Ambient Radial Glow Layer */}
          <div className="hero-ambient-glow" />

          {/* Top-Right Oversized Ambient Blurred Orb (Zero Hard Seams) */}
          <div
            aria-hidden="true"
            className="absolute -top-40 -right-40 sm:-top-52 sm:-right-52 w-[600px] sm:w-[800px] lg:w-[900px] h-[600px] sm:h-[800px] lg:h-[900px] rounded-full bg-gradient-to-bl from-indigo-200/40 via-purple-200/20 to-transparent blur-[100px] sm:blur-[140px] pointer-events-none z-0 dark:from-indigo-600/18 dark:via-purple-800/10 dark:to-transparent"
          />

          {/* Top-Left 6x6 Dot Matrix Grid */}
          <div className="absolute top-12 left-6 sm:left-12 lg:left-20 pointer-events-none hidden md:block select-none z-0">
            <svg width="110" height="110" viewBox="0 0 110 110" fill="none" className="opacity-75 dark:opacity-25">
              <pattern id="hirra-dots" x="0" y="0" width="18" height="18" patternUnits="userSpaceOnUse">
                <circle cx="3" cy="3" r="2" className="fill-indigo-400 dark:fill-indigo-300" />
              </pattern>
              <rect width="110" height="110" fill="url(#hirra-dots)" />
            </svg>
          </div>

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            
            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-4 anim-fade-up dark:text-white">
              Find work that works for <span className="text-indigo-600 dark:text-indigo-400">you.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 md:mb-12 font-normal leading-relaxed anim-fade-up anim-delay-1 dark:text-slate-400">
              Search thousands of opportunities from companies looking for their next great hire.
            </p>

            {/* Large Search Component */}
            <div className="anim-fade-up anim-delay-2">
              <JobSearch onSearch={handleHeroSearch} showPopularTags={true} />
            </div>
          </div>
        </section>

        {/* Featured Opportunities Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 anim-fade-up anim-delay-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight dark:text-white">
                {isCustomSearch ? 'Search Results' : 'Featured Opportunities'}
              </h2>
              <p className="text-sm font-medium text-slate-500 mt-1 dark:text-slate-400">
                {isCustomSearch
                  ? `Showing opportunities matching "${searchParams?.q || 'All'}" in "${searchParams?.location || 'All'}"`
                  : 'Top picks based on market demand.'}
              </p>
            </div>

            <div className="flex items-center gap-4">
              {isCustomSearch && (
                <button
                  onClick={handleResetSearch}
                  className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors dark:text-slate-400 dark:hover:text-white"
                >
                  Clear Search
                </button>
              )}
              <Link
                to="/jobs"
                className="group inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-700 anim-transition-colors dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                <span>View All</span>
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform duration-200"
                />
              </Link>
            </div>
          </div>

          {/* Job Grid Container */}
          <div className="anim-fade-up anim-delay-4">
            <JobGrid
              jobs={displayJobs}
              isLoading={isLoading}
              isError={isError}
              error={error}
              onRetry={onRetry}
              onResetFilters={handleResetSearch}
              onSelectJob={(job) => setSelectedJobId(job.id)}
              skeletonCount={6}
            />
          </div>
        </section>
      </main>

      {/* Slide-over Job Details Drawer */}
      <JobDetailDrawer
        jobId={selectedJobId}
        onClose={() => setSelectedJobId(null)}
      />

      <Footer />
    </div>
  );
};
