// ──────────────────────────────────────────────
// ClinicalTrials.gov API v2 — typed response
// ──────────────────────────────────────────────

/** Raw shapes coming back from the API */
export interface CTGStudyResponse {
  studies: CTGStudy[];
  nextPageToken?: string;
  totalCount?: number;
}

export interface CTGStudy {
  protocolSection: {
    identificationModule: {
      nctId: string;
      briefTitle: string;
      officialTitle?: string;
      organization?: {
        fullName: string;
        class: string;
      };
    };
    statusModule: {
      overallStatus: TrialStatus;
      startDateStruct?: { date: string; type?: string };
      primaryCompletionDateStruct?: { date: string; type?: string };
      completionDateStruct?: { date: string; type?: string };
      lastUpdatePostDateStruct?: { date: string; type?: string };
    };
    sponsorCollaboratorsModule?: {
      leadSponsor?: {
        name: string;
        class: string;
      };
    };
    descriptionModule?: {
      briefSummary?: string;
      detailedDescription?: string;
    };
    conditionsModule?: {
      conditions?: string[];
      keywords?: string[];
    };
    designModule?: {
      studyType?: string;
      phases?: string[];
      designInfo?: {
        allocation?: string;
        interventionModel?: string;
        primaryPurpose?: string;
        maskingInfo?: {
          masking?: string;
        };
      };
      enrollmentInfo?: {
        count: number;
        type?: string;
      };
    };
    armsInterventionsModule?: {
      interventions?: {
        type: string;
        name: string;
        description?: string;
      }[];
    };
    eligibilityModule?: {
      eligibilityCriteria?: string;
      healthyVolunteers?: boolean;
      sex?: string;
      minimumAge?: string;
      maximumAge?: string;
      stdAges?: string[];
    };
    contactsLocationsModule?: {
      locations?: {
        facility?: string;
        city?: string;
        state?: string;
        country?: string;
        geoPoint?: {
          lat: number;
          lon: number;
        };
      }[];
      centralContacts?: {
        name?: string;
        role?: string;
        phone?: string;
        email?: string;
      }[];
    };
    outcomesModule?: {
      primaryOutcomes?: {
        measure: string;
        description?: string;
        timeFrame?: string;
      }[];
      secondaryOutcomes?: {
        measure: string;
        description?: string;
        timeFrame?: string;
      }[];
    };
  };
  hasResults?: boolean;
}

// ──────────────────────────────────────────────
// Normalised domain types used in the UI
// ──────────────────────────────────────────────

export type TrialStatus =
  | "RECRUITING"
  | "ACTIVE_NOT_RECRUITING"
  | "COMPLETED"
  | "ENROLLING_BY_INVITATION"
  | "NOT_YET_RECRUITING"
  | "SUSPENDED"
  | "TERMINATED"
  | "WITHDRAWN"
  | "AVAILABLE"
  | "NO_LONGER_AVAILABLE"
  | "TEMPORARILY_NOT_AVAILABLE"
  | "APPROVED_FOR_MARKETING"
  | "WITHHELD"
  | "UNKNOWN";

export type TrialPhase =
  | "EARLY_PHASE1"
  | "PHASE1"
  | "PHASE2"
  | "PHASE3"
  | "PHASE4"
  | "NA";

export type InterventionType =
  | "DRUG"
  | "DEVICE"
  | "BIOLOGICAL"
  | "PROCEDURE"
  | "RADIATION"
  | "BEHAVIORAL"
  | "GENETIC"
  | "DIETARY_SUPPLEMENT"
  | "COMBINATION_PRODUCT"
  | "DIAGNOSTIC_TEST"
  | "OTHER";

export interface Trial {
  nctId: string;
  briefTitle: string;
  officialTitle?: string;
  status: TrialStatus;
  phases: TrialPhase[];
  startDate?: string;
  primaryCompletionDate?: string;
  completionDate?: string;
  lastUpdateDate?: string;
  sponsor: string;
  sponsorClass?: string;
  enrollmentCount?: number;
  enrollmentType?: string;
  briefSummary?: string;
  detailedDescription?: string;
  conditions: string[];
  keywords: string[];
  studyType?: string;
  interventions: {
    type: string;
    name: string;
    description?: string;
  }[];
  eligibilityCriteria?: string;
  healthyVolunteers?: boolean;
  sex?: string;
  minimumAge?: string;
  maximumAge?: string;
  locations: {
    facility?: string;
    city?: string;
    state?: string;
    country?: string;
  }[];
  primaryOutcomes: {
    measure: string;
    description?: string;
    timeFrame?: string;
  }[];
  secondaryOutcomes: {
    measure: string;
    description?: string;
    timeFrame?: string;
  }[];
  hasResults: boolean;
}

// ──────────────────────────────────────────────
// Filter / search types
// ──────────────────────────────────────────────

export interface TrialFilters {
  phases: TrialPhase[];
  statuses: TrialStatus[];
  interventionTypes: InterventionType[];
  sortBy: "relevance" | "date" | "enrollment";
  sortOrder: "asc" | "desc";
}

export const DEFAULT_FILTERS: TrialFilters = {
  phases: [],
  statuses: [],
  interventionTypes: [],
  sortBy: "relevance",
  sortOrder: "desc",
};

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────

export function normalizeStudy(raw: CTGStudy): Trial {
  const p = raw.protocolSection;
  const id = p.identificationModule;
  const st = p.statusModule;
  const sp = p.sponsorCollaboratorsModule;
  const desc = p.descriptionModule;
  const cond = p.conditionsModule;
  const design = p.designModule;
  const arms = p.armsInterventionsModule;
  const elig = p.eligibilityModule;
  const loc = p.contactsLocationsModule;
  const outcomes = p.outcomesModule;

  return {
    nctId: id.nctId,
    briefTitle: id.briefTitle,
    officialTitle: id.officialTitle,
    status: st.overallStatus,
    phases: (design?.phases as TrialPhase[]) ?? [],
    startDate: st.startDateStruct?.date,
    primaryCompletionDate: st.primaryCompletionDateStruct?.date,
    completionDate: st.completionDateStruct?.date,
    lastUpdateDate: st.lastUpdatePostDateStruct?.date,
    sponsor: sp?.leadSponsor?.name ?? id.organization?.fullName ?? "Unknown",
    sponsorClass: sp?.leadSponsor?.class ?? id.organization?.class,
    enrollmentCount: design?.enrollmentInfo?.count,
    enrollmentType: design?.enrollmentInfo?.type,
    briefSummary: desc?.briefSummary,
    detailedDescription: desc?.detailedDescription,
    conditions: cond?.conditions ?? [],
    keywords: cond?.keywords ?? [],
    studyType: design?.studyType,
    interventions:
      arms?.interventions?.map((i) => ({
        type: i.type,
        name: i.name,
        description: i.description,
      })) ?? [],
    eligibilityCriteria: elig?.eligibilityCriteria,
    healthyVolunteers: elig?.healthyVolunteers,
    sex: elig?.sex,
    minimumAge: elig?.minimumAge,
    maximumAge: elig?.maximumAge,
    locations:
      loc?.locations?.map((l) => ({
        facility: l.facility,
        city: l.city,
        state: l.state,
        country: l.country,
      })) ?? [],
    primaryOutcomes: outcomes?.primaryOutcomes ?? [],
    secondaryOutcomes: outcomes?.secondaryOutcomes ?? [],
    hasResults: raw.hasResults ?? false,
  };
}

/** Human-readable labels */
export const PHASE_LABELS: Record<TrialPhase, string> = {
  EARLY_PHASE1: "Early Phase 1",
  PHASE1: "Phase 1",
  PHASE2: "Phase 2",
  PHASE3: "Phase 3",
  PHASE4: "Phase 4",
  NA: "N/A",
};

export const STATUS_LABELS: Record<TrialStatus, string> = {
  RECRUITING: "Recruiting",
  ACTIVE_NOT_RECRUITING: "Active, not recruiting",
  COMPLETED: "Completed",
  ENROLLING_BY_INVITATION: "Enrolling by invitation",
  NOT_YET_RECRUITING: "Not yet recruiting",
  SUSPENDED: "Suspended",
  TERMINATED: "Terminated",
  WITHDRAWN: "Withdrawn",
  AVAILABLE: "Available",
  NO_LONGER_AVAILABLE: "No longer available",
  TEMPORARILY_NOT_AVAILABLE: "Temporarily not available",
  APPROVED_FOR_MARKETING: "Approved for marketing",
  WITHHELD: "Withheld",
  UNKNOWN: "Unknown",
};
