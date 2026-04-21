"use client";

import { useMemo } from "react";
import { SearchBar } from "@/components/SearchBar";
import { FilterPanel } from "@/components/FilterPanel";
import { TrialList } from "@/components/TrialList";
import { useTrialSearch } from "@/lib/hooks/useTrials";
import { useTrialStore } from "@/lib/store/useTrialStore";
import { usePageContext } from "@/lib/chat/usePageContext";
import { FlaskConical, TrendingUp, Globe, Brain } from "lucide-react";

export default function HomePage() {
  const { searchQuery, filters } = useTrialStore();

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isError,
    error,
  } = useTrialSearch(searchQuery, filters);

  const trials = useMemo(
    () => data?.pages.flatMap((page) => page.trials) ?? [],
    [data]
  );

  const totalCount = data?.pages[0]?.totalCount ?? 0;
  const hasSearched = searchQuery.length > 0;

  // Set chat widget context
  usePageContext({
    pageType: "search",
    pageTitle: hasSearched ? `Search: "${searchQuery}"` : "Search",
    data: {
      searchQuery,
      filters,
      totalCount,
      resultCount: trials.length,
      trials: trials.slice(0, 10).map((t) => ({
        nctId: t.nctId,
        title: t.briefTitle,
        status: t.status,
        phases: t.phases,
        sponsor: t.sponsor,
        conditions: t.conditions,
        enrollmentCount: t.enrollmentCount,
      })),
    },
    suggestedQuestions: hasSearched
      ? [
          `Summarize the top results for "${searchQuery}"`,
          "Show a chart of trial phases in these results",
          "Compare the statuses of these trials in a chart",
          "Which sponsors are running the most trials?",
          "Create a pie chart of intervention types",
        ]
      : [
          "What are the most common clinical trial phases?",
          "How do I find trials for a specific condition?",
          "What does 'recruiting' status mean?",
          "Explain the difference between Phase 1 and Phase 3",
        ],
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Hero section — only show when no search */}
      {!hasSearched && (
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-100 dark:bg-sky-900/50">
            <FlaskConical className="h-8 w-8 text-sky-600 dark:text-sky-400" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Explore Clinical Trials
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-slate-500 dark:text-slate-400">
            Search through hundreds of thousands of clinical studies from{" "}
            <a
              href="https://clinicaltrials.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-sky-600 hover:text-sky-700"
            >
              ClinicalTrials.gov
            </a>
            . Get AI-powered plain-language summaries to understand complex
            medical research.
          </p>
        </div>
      )}

      {/* Search */}
      <div className={hasSearched ? "mb-6" : "mb-8"}>
        <SearchBar />
      </div>

      {/* Results area */}
      {hasSearched && (
        <>
          <div className="mb-6">
            <FilterPanel />
          </div>

          {isError && (
            <div className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/30 p-6 text-center">
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                Something went wrong
              </p>
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {error instanceof Error
                  ? error.message
                  : "Failed to fetch trials"}
              </p>
            </div>
          )}

          {!isError && !isLoading && trials.length === 0 && (
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-12 text-center">
              <p className="text-lg font-medium text-slate-700 dark:text-slate-300">
                No trials found
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Try a different search term or adjust your filters
              </p>
            </div>
          )}

          <TrialList
            trials={trials}
            isLoading={isLoading}
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage ?? false}
            totalCount={totalCount}
            onLoadMore={() => fetchNextPage()}
          />
        </>
      )}

      {/* Feature cards — only show when no search */}
      {!hasSearched && (
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/50">
              <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Real-Time Data
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              Access live data from ClinicalTrials.gov — the world&apos;s
              largest clinical trial registry with 400,000+ studies.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/50">
              <Brain className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              AI Summaries
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              Get plain-language explanations of complex clinical studies,
              powered by Claude AI — written for patients, not scientists.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-sky-100 dark:bg-sky-900/50">
              <Globe className="h-5 w-5 text-sky-600 dark:text-sky-400" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Filter &amp; Track
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              Filter by phase, status, and intervention type. Save interesting
              trials to your favorites for easy access.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
