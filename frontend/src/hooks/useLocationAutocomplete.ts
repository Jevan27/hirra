import { useState, useEffect, useRef } from 'react';
import { fetchLocationSuggestions, LocationSuggestion } from '@/lib/api/location';
import { ExtendedApiError } from '@/lib/api/client';

const CACHE_TTL_MS = 60 * 1000; // 60 seconds short-lived cache
const MAX_CACHE_SIZE = 20;

interface CacheEntry {
  suggestions: LocationSuggestion[];
  timestamp: number;
}

export const REMOTE_SUGGESTION: LocationSuggestion = {
  id: 'hirra-remote-option',
  place_name: 'Remote (Worldwide / Flexible)',
  text: 'Remote',
  isRemote: true,
};

export function useLocationAutocomplete(inputValue: string, isOpen: boolean) {
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rateLimitMessage, setRateLimitMessage] = useState<string | null>(null);

  const cacheRef = useRef<Map<string, CacheEntry>>(new Map());
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const query = inputValue.trim();
    const isSearchingRemote = 'remote'.startsWith(query.toLowerCase()) && query.length > 0;

    if (!isOpen || query.length < 2) {
      if (isOpen && isSearchingRemote) {
        setSuggestions([REMOTE_SUGGESTION]);
      } else if (isOpen && query.length === 0) {
        // Show default prompt with Remote option when opened without input
        setSuggestions([REMOTE_SUGGESTION]);
      } else {
        setSuggestions([]);
      }
      setIsLoading(false);
      return;
    }

    // Check cache
    const cached = cacheRef.current.get(query.toLowerCase());
    if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
      setSuggestions(cached.suggestions);
      setIsLoading(false);
      return;
    }

    // Cancel in-flight stale request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;
    setIsLoading(true);

    const timer = setTimeout(async () => {
      try {
        const results = await fetchLocationSuggestions(query, controller.signal);
        
        let combined: LocationSuggestion[] = [];
        if (isSearchingRemote) {
          combined.push(REMOTE_SUGGESTION);
        }
        combined = [...combined, ...results];

        // Cache result (LRU eviction if max size reached)
        if (cacheRef.current.size >= MAX_CACHE_SIZE) {
          const oldestKey = cacheRef.current.keys().next().value;
          if (oldestKey) cacheRef.current.delete(oldestKey);
        }
        cacheRef.current.set(query.toLowerCase(), {
          suggestions: combined,
          timestamp: Date.now(),
        });

        setSuggestions(combined);
        setRateLimitMessage(null);
      } catch (err: unknown) {
        const errObj = err as Error;
        if (errObj.name === 'CanceledError' || errObj.name === 'AbortError') {
          return; // Aborted cleanly
        }
        const apiErr = err as ExtendedApiError;
        if (apiErr?.isRateLimited) {
          setRateLimitMessage("You're searching a little too quickly. Please try again in a moment.");
        } else {
          console.warn('[Location Autocomplete] Fallback to manual entry:', apiErr?.message);
        }
        setSuggestions(isSearchingRemote ? [REMOTE_SUGGESTION] : []);
      } finally {
        setIsLoading(false);
      }
    }, 350);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [inputValue, isOpen]);

  const clearSuggestions = () => {
    setSuggestions([]);
    setRateLimitMessage(null);
  };

  return {
    suggestions,
    isLoading,
    rateLimitMessage,
    clearSuggestions,
  };
}
