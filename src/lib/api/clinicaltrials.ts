import {
  CTGStudyResponse,
  Trial,
  TrialFilters,
  normalizeStudy,
} from "@/lib/types/trials";

const BASE_URL = "https://clinicaltrials.gov/api/v2";

interface SearchParams {
  query: string;
  pageSize?: number;
  pageToken?: string;
  filters?: TrialFilters;
}

interface SearchResult {
  trials: Trial[];
  nextPageToken?: string;
  totalCount: number;
}

/**
 * Build the filter.advanced query string for phase & status filtering.
 */
function buildFilterAdvanced(filters?: TrialFilters): string | undefined {
  const parts: string[] = [];

  if (filters?.phases && filters.phases.length > 0) {
    const phaseValues = filters.phases.map((p) => {
      // API expects values like "PHASE1", "PHASE2" etc.
      return p;
    });
    parts.push(`AREA[Phase](${phaseValues.join(" OR ")})`);
  }

  if (filters?.statuses && filters.statuses.length > 0) {
    parts.push(
      `AREA[OverallStatus](${filters.statuses.join(" OR ")})`
    );
  }

  if (filters?.interventionTypes && filters.interventionTypes.length > 0) {
    parts.push(
      `AREA[InterventionType](${filters.interventionTypes.join(" OR ")})`
    );
  }

  return parts.length > 0 ? parts.join(" AND ") : undefined;
}

/**
 * Sort mapping for the API sort parameter.
 */
function buildSort(filters?: TrialFilters): string | undefined {
  if (!filters) return undefined;

  switch (filters.sortBy) {
    case "date":
      return filters.sortOrder === "asc"
        ? "LastUpdatePostDate"
        : "@relevance";
    case "enrollment":
      return "EnrollmentCount";
    default:
      return undefined; // default relevance
  }
}

/**
 * Search clinical trials from ClinicalTrials.gov API v2
 */
export async function searchTrials({
  query,
  pageSize = 20,
  pageToken,
  filters,
}: SearchParams): Promise<SearchResult> {
  const params = new URLSearchParams();

  if (query) params.set("query.term", query);
  params.set("pageSize", String(pageSize));

  if (pageToken) params.set("pageToken", pageToken);

  const filterAdvanced = buildFilterAdvanced(filters);
  if (filterAdvanced) params.set("filter.advanced", filterAdvanced);

  const sort = buildSort(filters);
  if (sort) params.set("sort", sort);

  // Request only the fields we need for the list view to reduce payload
  params.set("countTotal", "true");

  const url = `${BASE_URL}/studies?${params.toString()}`;

  const response = await fetch(url, {
    next: { revalidate: 300 }, // cache for 5 min on server
  });

  if (!response.ok) {
    throw new Error(
      `ClinicalTrials.gov API error: ${response.status} ${response.statusText}`
    );
  }

  const data: CTGStudyResponse = await response.json();

  return {
    trials: data.studies.map(normalizeStudy),
    nextPageToken: data.nextPageToken,
    totalCount: data.totalCount ?? data.studies.length,
  };
}

/**
 * Get a single trial by NCT ID
 */
export async function getTrialById(nctId: string): Promise<Trial> {
  const url = `${BASE_URL}/studies/${nctId}`;

  const response = await fetch(url, {
    next: { revalidate: 3600 }, // cache for 1 hour
  });

  if (!response.ok) {
    throw new Error(
      `ClinicalTrials.gov API error: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();

  // Single study response wraps in protocolSection directly
  return normalizeStudy(data);
}
