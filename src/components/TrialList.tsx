"use client";

import { Trial } from "@/lib/types/trials";
import { TrialCard } from "@/components/TrialCard";
import { TrialCardSkeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { Loader2 } from "lucide-react";

interface TrialListProps {
  trials: Trial[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  totalCount: number;
  onLoadMore: () => void;
}

export function TrialList({
  trials,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  totalCount,
  onLoadMore,
}: TrialListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <TrialCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (trials.length === 0) {
    return null;
  }

  return (
    <div>
      <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
        Showing <span className="font-medium text-slate-700 dark:text-slate-300">{trials.length}</span> of{" "}
        <span className="font-medium text-slate-700 dark:text-slate-300">{totalCount.toLocaleString()}</span>{" "}
        results
      </p>

      <div className="space-y-4">
        {trials.map((trial) => (
          <TrialCard key={trial.nctId} trial={trial} />
        ))}
      </div>

      {hasNextPage && (
        <div className="mt-6 flex justify-center">
          <Button
            variant="outline"
            onClick={onLoadMore}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading…
              </>
            ) : (
              "Load more results"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
