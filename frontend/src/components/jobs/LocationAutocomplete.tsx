import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Globe, X, Loader2, AlertCircle } from 'lucide-react';
import { useLocationAutocomplete } from '@/hooks/useLocationAutocomplete';
import { LocationSuggestion } from '@/lib/api/location';

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({
  value,
  onChange,
  onSelect,
  placeholder = 'Location or Remote',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { suggestions, isLoading, rateLimitMessage, clearSuggestions } = useLocationAutocomplete(
    value,
    isOpen
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (suggestion: LocationSuggestion) => {
    const selectedText = suggestion.isRemote ? 'Remote' : suggestion.place_name || suggestion.text;
    onChange(selectedText);
    if (onSelect) {
      onSelect(selectedText);
    }
    setIsOpen(false);
    setActiveIndex(-1);
    clearSuggestions();
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    if (onSelect) {
      onSelect('');
    }
    clearSuggestions();
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === 'ArrowDown') {
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
        break;
      case 'Enter':
        if (activeIndex >= 0 && activeIndex < suggestions.length) {
          e.preventDefault();
          handleSelect(suggestions[activeIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setActiveIndex(-1);
        break;
    }
  };

  return (
    <div ref={containerRef} className={`relative flex-1 w-full flex items-center ${className}`}>
      <div className="flex items-center gap-3.5 px-4 py-2 sm:py-2.5 w-full">
        {/* Leading Icon: Globe if Remote, MapPin otherwise */}
        {value.trim().toLowerCase() === 'remote' ? (
          <Globe size={21} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
        ) : (
          <MapPin size={21} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
        )}

        {/* Input Field with full autofill suppression */}
        <input
          ref={inputRef}
          type="text"
          name="hirra_location_search"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          data-lpignore="true"
          data-form-type="other"
          data-1p-ignore="true"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setActiveIndex(-1);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          role="combobox"
          aria-expanded={isOpen && suggestions.length > 0}
          aria-autocomplete="list"
          aria-controls="location-autocomplete-listbox"
          aria-activedescendant={
            activeIndex >= 0 ? `location-option-${activeIndex}` : undefined
          }
          className="w-full text-sm sm:text-base font-medium text-slate-800 placeholder:text-slate-400 bg-transparent focus:outline-none dark:text-slate-100 dark:placeholder:text-slate-500 pr-6"
        />

        {/* Right action indicators: Loading spinner or Clear button */}
        <div className="flex items-center gap-1.5 shrink-0">
          {isLoading && (
            <Loader2 size={16} className="animate-spin text-indigo-500 dark:text-indigo-400" />
          )}

          {value && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear location"
              className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors dark:text-slate-500 dark:hover:text-slate-300 dark:hover:bg-slate-800"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Autocomplete Suggestions Dropdown */}
      {isOpen && (suggestions.length > 0 || rateLimitMessage) && (
        <div
          id="location-autocomplete-listbox"
          role="listbox"
          className="absolute left-0 right-0 sm:min-w-[340px] top-full mt-2.5 z-50 bg-white/95 backdrop-blur-md dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80 anim-fade-up scrollbar-thin"
        >
          {rateLimitMessage && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0 text-amber-600 dark:text-amber-400" />
              <span>{rateLimitMessage}</span>
            </div>
          )}

          {suggestions.map((suggestion, index) => {
            const isActive = index === activeIndex;
            const isRemote = suggestion.isRemote;

            return (
              <div
                key={suggestion.id || index}
                id={`location-option-${index}`}
                role="option"
                aria-selected={isActive}
                onClick={() => handleSelect(suggestion)}
                onMouseEnter={() => setActiveIndex(index)}
                className={`px-4 py-3 cursor-pointer flex items-center gap-3 transition-colors ${
                  isActive
                    ? 'bg-indigo-50/90 text-indigo-900 dark:bg-indigo-950/70 dark:text-indigo-200'
                    : 'text-slate-700 hover:bg-slate-50/80 dark:text-slate-200 dark:hover:bg-slate-800/60'
                }`}
              >
                <div
                  className={`p-1.5 rounded-lg shrink-0 ${
                    isRemote
                      ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                      : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400'
                  }`}
                >
                  {isRemote ? <Globe size={16} /> : <MapPin size={16} />}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate leading-snug">
                    {suggestion.text || suggestion.place_name}
                  </p>
                  {suggestion.place_name && suggestion.place_name !== suggestion.text && (
                    <p className="text-xs text-slate-400 dark:text-slate-500 truncate mt-0.5">
                      {suggestion.place_name}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
