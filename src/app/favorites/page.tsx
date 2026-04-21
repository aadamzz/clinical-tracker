"use client";

import { useQueries } from "@tanstack/react-query";
import { Heart, Trash2 } from "lucide-react";
import { useTrialStore } from "@/lib/store/useTrialStore";
import { getTrialById } from "@/lib/api/clinicaltrials";
import { TrialCard } from "@/components/TrialCard";
import { TrialCardSkeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { usePageContext } from "@/lib/chat/usePageContext";

export default function FavoritesPage() {
  const { favorites, toggleFavorite } = useTrialStore();

  // Fetch all favorite trials in parallel
  const trialQueries = useQueries({
    queries: favorites.map((nctId) => ({
      queryKey: ["trial", nctId],
      queryFn: () => getTrialById(nctId),
      staleTime: 60 * 60 * 1000,
    })),
  });

  const isLoading = trialQueries.some((q) => q.isLoading);
  const loadedTrials = trialQueries
    .filter((q) => q.isSuccess && q.data != null)
    .map((q) => q.data!);

  // Set chat widget context
  usePageContext({
    pageType: "favorites",
    pageTitle: `Saved Trials (${favorites.length})`,
    data: {
      savedCount: favorites.length,
      trials: loadedTrials.map((t) => ({
        nctId: t.nctId,
        title: t.briefTitle,
        status: t.status,
        phases: t.phases,
        sponsor: t.sponsor,
        conditions: t.conditions,
        enrollmentCount: t.enrollmentCount,
      })),
    },
    suggestedQuestions: loadedTrials.length > 0
      ? [
          "Summarize all my saved trials in a table",
          "What conditions do my saved trials cover?",
          "Which saved trials are actively recruiting?",
          "Find common themes across my saved trials",
          "Which sponsors appear most in my favorites?",
        ]
      : [
          "How do I save trials to favorites?",
          "What types of trials should I look for?",
          "Explain the different trial phases",
        ],
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white">
          <Heart className="h-6 w-6 text-rose-500" fill="currentColor" />
          Saved Trials
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {favorites.length === 0
            ? "No saved trials yet. Heart a trial from search results to save it here."
            : `${favorites.length} trial${favorites.length !== 1 ? "s" : ""} saved`}
        </p>
      </div>

      {favorites.length === 0 && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-12 text-center">
          <Heart className="mx-auto h-12 w-12 text-slate-200 dark:text-slate-600" />
          <h2 className="mt-4 text-lg font-semibold text-slate-700 dark:text-slate-300">
            No saved trials
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Start exploring clinical trials and save the ones you&apos;re
            interested in.
          </p>
          <Link href="/">
            <Button variant="primary" className="mt-6">
              Search trials
            </Button>
          </Link>
        </div>
      )}

      {isLoading && favorites.length > 0 && (
        <div className="space-y-4">
          {favorites.map((nctId) => (
            <TrialCardSkeleton key={nctId} />
          ))}
        </div>
      )}

      {!isLoading && loadedTrials.length > 0 && (
        <div className="space-y-4">
          {loadedTrials.map((trial) => (
            <div key={trial.nctId} className="relative">
              <TrialCard trial={trial} />
            </div>
          ))}
        </div>
      )}

      {/* Failed to load some trials */}
      {trialQueries.some((q) => q.isError) && (
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm text-amber-800">
            Some saved trials could not be loaded. They may have been removed
            from ClinicalTrials.gov.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {trialQueries.map((q, idx) =>
              q.isError ? (
                <div
                  key={favorites[idx]}
                  className="flex items-center gap-2 rounded-lg border border-amber-200 dark:border-amber-800 bg-white dark:bg-slate-800 px-3 py-1.5"
                >
                  <span className="text-xs font-mono text-amber-700 dark:text-amber-400">
                    {favorites[idx]}
                  </span>
                  <button
                    onClick={() => toggleFavorite(favorites[idx])}
                    className="text-amber-400 dark:text-amber-500 hover:text-red-500"
                    aria-label={`Remove ${favorites[idx]} from favorites`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : null
            )}
          </div>
        </div>
      )}
    </div>
  );
}
