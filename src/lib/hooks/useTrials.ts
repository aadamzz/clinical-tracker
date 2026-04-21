"use client";

import {
  useQuery,
  useInfiniteQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import { searchTrials, getTrialById } from "@/lib/api/clinicaltrials";
import { Trial, TrialFilters } from "@/lib/types/trials";

/**
 * Infinite query for paginated trial search
 */
export function useTrialSearch(query: string, filters: TrialFilters) {
  return useInfiniteQuery({
    queryKey: ["trials", query, filters] as const,
    queryFn: ({ pageParam }) =>
      searchTrials({
        query,
        filters,
        pageToken: pageParam as string | undefined,
        pageSize: 20,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextPageToken,
    enabled: query.length > 0,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Single trial detail by NCT ID
 */
export function useTrialDetail(
  nctId: string,
  options?: Partial<UseQueryOptions<Trial>>
) {
  return useQuery<Trial>({
    queryKey: ["trial", nctId],
    queryFn: () => getTrialById(nctId),
    staleTime: 60 * 60 * 1000, // 1 hour
    ...options,
  });
}
