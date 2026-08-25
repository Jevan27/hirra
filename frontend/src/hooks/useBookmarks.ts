import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'hirra_bookmarked_jobs';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const item = localStorage.getItem(STORAGE_KEY);
      return item ? JSON.parse(item) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
    } catch (e) {
      console.error('Failed to save bookmarks to localStorage', e);
    }
  }, [bookmarks]);

  const toggleBookmark = useCallback((jobId: string) => {
    setBookmarks((prev) => {
      const exists = prev.includes(jobId);
      if (exists) {
        return prev.filter((id) => id !== jobId);
      } else {
        return [...prev, jobId];
      }
    });
  }, []);

  const isBookmarked = useCallback(
    (jobId: string) => bookmarks.includes(jobId),
    [bookmarks]
  );

  return {
    bookmarks,
    toggleBookmark,
    isBookmarked,
    count: bookmarks.length,
  };
}
