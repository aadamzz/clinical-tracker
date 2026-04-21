"use client";

import { useState, useCallback, FormEvent } from "react";
import { Search, X } from "lucide-react";
import { useTrialStore } from "@/lib/store/useTrialStore";

interface SearchBarProps {
  onSearch?: (query: string) => void;
}

const SUGGESTIONS = [
  "Breast cancer",
  "Diabetes type 2",
  "Alzheimer's disease",
  "COVID-19",
  "Melanoma",
  "Rheumatoid arthritis",
];

export function SearchBar({ onSearch }: SearchBarProps) {
  const { searchQuery, setSearchQuery } = useTrialStore();
  const [localQuery, setLocalQuery] = useState(searchQuery);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const trimmed = localQuery.trim();
      if (trimmed) {
        setSearchQuery(trimmed);
        onSearch?.(trimmed);
      }
    },
    [localQuery, setSearchQuery, onSearch]
  );

  const handleClear = useCallback(() => {
    setLocalQuery("");
    setSearchQuery("");
  }, [setSearchQuery]);

  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      setLocalQuery(suggestion);
      setSearchQuery(suggestion);
      onSearch?.(suggestion);
    },
    [setSearchQuery, onSearch]
  );

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          placeholder="Search clinical trials — disease, drug, sponsor…"
          className="block w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 py-3.5 pl-12 pr-24 text-base text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm transition-all focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
          aria-label="Search clinical trials"
        />
        {localQuery && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-24 flex items-center pr-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <button
          type="submit"
          className="absolute inset-y-0 right-0 flex items-center rounded-r-xl bg-sky-600 px-5 text-sm font-medium text-white transition-colors hover:bg-sky-700 active:bg-sky-800"
        >
          Search
        </button>
      </form>

      {/* Quick suggestions — only show when no active search */}
      {!searchQuery && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-500">Try:</span>
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => handleSuggestionClick(s)}
              className="rounded-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-1 text-xs text-slate-600 dark:text-slate-400 transition-colors hover:border-sky-300 dark:hover:border-sky-600 hover:bg-sky-50 dark:hover:bg-sky-900/30 hover:text-sky-700 dark:hover:text-sky-400"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
