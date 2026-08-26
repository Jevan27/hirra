import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LocationAutocomplete } from './LocationAutocomplete';
import { POPULAR_SEARCH_TAGS } from '@/lib/constants';

interface JobSearchProps {
  onSearch?: (query: string, location: string) => void;
  initialQuery?: string;
  initialLocation?: string;
  showPopularTags?: boolean;
}

export const JobSearch: React.FC<JobSearchProps> = ({
  onSearch,
  initialQuery = '',
  initialLocation = '',
  showPopularTags = true,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [location, setLocation] = useState(initialLocation);

  // Sync state if initial props change
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    setLocation(initialLocation);
  }, [initialLocation]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (onSearch) {
      onSearch(query, location);
    }
  };

  const handleTagClick = (tagQuery: string) => {
    setQuery(tagQuery);
    if (onSearch) {
      onSearch(tagQuery, location);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Main Large Search Card from Reference */}
      <form
        onSubmit={handleSearch}
        autoComplete="off"
        className="bg-white rounded-2xl p-2.5 sm:p-3 shadow-search border border-slate-100/90 flex flex-col md:flex-row items-center gap-3 anim-focus-ring anim-transition-shadow focus-within:ring-2 focus-within:ring-indigo-500/30 dark:bg-slate-900 dark:border-slate-800"
      >
        {/* Keyword Input */}
        <div className="flex-1 w-full flex items-center gap-3.5 px-4 py-2 sm:py-2.5">
          <Search size={21} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
          <input
            type="text"
            name="hirra_job_keyword"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Job title, keyword, or company"
            className="w-full text-sm sm:text-base font-medium text-slate-800 placeholder:text-slate-400 bg-transparent focus:outline-none dark:text-slate-100 dark:placeholder:text-slate-500"
          />
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px h-8 bg-slate-200 dark:bg-slate-700" />

        {/* Mapbox Location Autocomplete Input */}
        <LocationAutocomplete
          value={location}
          onChange={setLocation}
          onSelect={(selectedLoc) => {
            setLocation(selectedLoc);
          }}
          placeholder="Location or Remote"
        />

        {/* Search Jobs Button */}
        <Button
          type="submit"
          className="w-full md:w-auto h-12 px-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-base shadow-md shadow-indigo-600/30 active:scale-98 transition-all shrink-0"
        >
          Search Jobs
        </Button>
      </form>

      {/* Popular Search Tags Bar */}
      {showPopularTags && (
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-6">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Popular:
          </span>
          {POPULAR_SEARCH_TAGS.map((tag) => (
            <button
              key={tag.label}
              type="button"
              onClick={() => handleTagClick(tag.query)}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100/60 hover:bg-indigo-100 hover:text-indigo-900 transition-all duration-150 active:scale-95 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-900/60 dark:hover:bg-indigo-900/80"
            >
              {tag.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
