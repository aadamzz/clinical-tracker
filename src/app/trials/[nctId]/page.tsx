"use client";

import { use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Users,
  Building2,
  MapPin,
  ExternalLink,
  Heart,
  ClipboardList,
  Target,
  Shield,
  Info,
} from "lucide-react";
import { useTrialDetail } from "@/lib/hooks/useTrials";
import { useTrialStore } from "@/lib/store/useTrialStore";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PhaseBadge } from "@/components/ui/PhaseBadge";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { PhaseTimeline } from "@/components/PhaseTimeline";
import { AISummary } from "@/components/AISummary";
import { ExportPdfButton } from "@/components/ExportPdfButton";
import { usePageContext } from "@/lib/chat/usePageContext";
import { PHASE_LABELS, STATUS_LABELS } from "@/lib/types/trials";

interface TrialDetailPageProps {
  params: Promise<{ nctId: string }>;
}

export default function TrialDetailPage({ params }: TrialDetailPageProps) {
  const { nctId } = use(params);
  const { data: trial, isLoading, isError, error } = useTrialDetail(nctId);
  const { isFavorite, toggleFavorite } = useTrialStore();

  // Must be called before any early returns (Rules of Hooks)
  usePageContext({
    pageType: "trial-detail",
    pageTitle: trial
      ? trial.briefTitle.length > 50
        ? trial.briefTitle.substring(0, 50) + "…"
        : trial.briefTitle
      : `Trial ${nctId}`,
    data: trial
      ? {
          nctId: trial.nctId,
          title: trial.briefTitle,
          status: STATUS_LABELS[trial.status],
          phases: trial.phases.map((p) => PHASE_LABELS[p]).join(", "),
          sponsor: trial.sponsor,
          conditions: trial.conditions,
          interventions: trial.interventions.map((i) => ({ name: i.name, type: i.type })),
          enrollmentCount: trial.enrollmentCount,
          briefSummary: trial.briefSummary,
          eligibilityCriteria: trial.eligibilityCriteria?.substring(0, 1500),
          primaryOutcomes: trial.primaryOutcomes.map((o) => o.measure),
          secondaryOutcomes: trial.secondaryOutcomes.map((o) => o.measure),
          locations: trial.locations.slice(0, 5).map((l) => ({
            facility: l.facility,
            city: l.city,
            country: l.country,
          })),
          totalLocations: trial.locations.length,
          startDate: trial.startDate,
          completionDate: trial.completionDate,
          minimumAge: trial.minimumAge,
          maximumAge: trial.maximumAge,
          sex: trial.sex,
          healthyVolunteers: trial.healthyVolunteers,
        }
      : { nctId },
    suggestedQuestions: trial
      ? [
          "Am I eligible for this study? What are the criteria?",
          "Explain this trial in simple terms",
          "Show a chart of the study timeline",
          "Generate a summary table of key trial information",
          "Visualize conditions and interventions in a chart",
        ]
      : [
          "What information does a trial detail page show?",
          "What are the most important things to look for in a trial?",
        ],
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <Skeleton className="mb-6 h-4 w-24" />
        <Skeleton className="mb-2 h-8 w-3/4" />
        <Skeleton className="mb-6 h-5 w-1/3" />
        <div className="space-y-4">
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-60 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError || !trial) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to search
        </Link>
        <div className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/30 p-8 text-center">
          <p className="text-lg font-medium text-red-800 dark:text-red-200">
            Could not load trial
          </p>
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">
            {error instanceof Error
              ? error.message
              : `Trial ${nctId} not found`}
          </p>
        </div>
      </div>
    );
  }

  const favorited = isFavorite(trial.nctId);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* Breadcrumb */}
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to search
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold leading-tight text-slate-900 dark:text-white sm:text-3xl">
              {trial.briefTitle}
            </h1>
            <div className="mt-2 flex items-center gap-3">
              <span className="text-sm font-mono text-slate-400">
                {trial.nctId}
              </span>
              <a
                href={`https://clinicaltrials.gov/study/${trial.nctId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium text-sky-600 hover:text-sky-700"
              >
                View on ClinicalTrials.gov
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ExportPdfButton trial={trial} />
            <Button
              variant={favorited ? "primary" : "outline"}
              size="icon"
              onClick={() => toggleFavorite(trial.nctId)}
              className={
                favorited
                  ? "bg-rose-500 hover:bg-rose-600 text-white"
                  : ""
              }
              aria-label={
                favorited ? "Remove from favorites" : "Add to favorites"
              }
            >
              <Heart
                className="h-5 w-5"
                fill={favorited ? "currentColor" : "none"}
              />
            </Button>
          </div>
        </div>

        {/* Badges */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <StatusBadge status={trial.status} size="md" />
          {trial.phases.map((phase) => (
            <PhaseBadge key={phase} phase={phase} size="md" />
          ))}
          {trial.studyType && (
            <span className="rounded-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-1 text-sm text-slate-600 dark:text-slate-400">
              {trial.studyType}
            </span>
          )}
        </div>
      </div>

      {/* AI Summary */}
      <div className="mb-8">
        <AISummary trial={trial} />
      </div>

      {/* Phase Timeline */}
      <section className="mb-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
          <Target className="h-5 w-5 text-sky-600" />
          Study Phase
        </h2>
        <PhaseTimeline trial={trial} />
      </section>

      {/* Key Information Grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Building2 className="h-4 w-4" />
            Sponsor
          </div>
          <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
            {trial.sponsor}
          </p>
          {trial.sponsorClass && (
            <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
              {trial.sponsorClass}
            </p>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Users className="h-4 w-4" />
            Enrollment
          </div>
          <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
            {trial.enrollmentCount?.toLocaleString() ?? "N/A"} participants
          </p>
          {trial.enrollmentType && (
            <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
              {trial.enrollmentType}
            </p>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Calendar className="h-4 w-4" />
            Start Date
          </div>
          <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
            {trial.startDate ?? "N/A"}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Calendar className="h-4 w-4" />
            Completion
          </div>
          <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
            {trial.primaryCompletionDate ?? trial.completionDate ?? "N/A"}
          </p>
        </div>
      </div>

      {/* Description */}
      {trial.briefSummary && (
        <section className="mb-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
            <Info className="h-5 w-5 text-sky-600" />
            Study Description
          </h2>
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 whitespace-pre-line">
            {trial.briefSummary}
          </p>
          {trial.detailedDescription && (
            <details className="mt-4">
              <summary className="cursor-pointer text-sm font-medium text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300">
                Show detailed description
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400 whitespace-pre-line">
                {trial.detailedDescription}
              </p>
            </details>
          )}
        </section>
      )}

      {/* Conditions & Interventions */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        {trial.conditions.length > 0 && (
          <section className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
            <h2 className="mb-3 text-base font-semibold text-slate-900 dark:text-white">
              Conditions
            </h2>
            <div className="flex flex-wrap gap-2">
              {trial.conditions.map((c) => (
                <span
                  key={c}
                  className="rounded-md bg-indigo-50 dark:bg-indigo-900/30 px-2.5 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-400"
                >
                  {c}
                </span>
              ))}
            </div>
          </section>
        )}

        {trial.interventions.length > 0 && (
          <section className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
            <h2 className="mb-3 text-base font-semibold text-slate-900 dark:text-white">
              Interventions
            </h2>
            <div className="space-y-2">
              {trial.interventions.map((intervention, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 rounded-lg bg-slate-50 dark:bg-slate-900/50 p-3"
                >
                  <span className="mt-0.5 shrink-0 rounded bg-sky-100 dark:bg-sky-900/50 px-1.5 py-0.5 text-[10px] font-bold uppercase text-sky-700 dark:text-sky-400">
                    {intervention.type}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      {intervention.name}
                    </p>
                    {intervention.description && (
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        {intervention.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Eligibility */}
      {trial.eligibilityCriteria && (
        <section className="mb-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
            <Shield className="h-5 w-5 text-sky-600" />
            Eligibility Criteria
          </h2>
          <div className="flex flex-wrap gap-3 mb-4 text-xs text-slate-500 dark:text-slate-400">
            {trial.sex && trial.sex !== "ALL" && (
              <span className="rounded-full border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 px-2.5 py-1">
                Sex: {trial.sex}
              </span>
            )}
            {trial.minimumAge && (
              <span className="rounded-full border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 px-2.5 py-1">
                Min age: {trial.minimumAge}
              </span>
            )}
            {trial.maximumAge && (
              <span className="rounded-full border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 px-2.5 py-1">
                Max age: {trial.maximumAge}
              </span>
            )}
            {trial.healthyVolunteers !== undefined && (
              <span className="rounded-full border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 px-2.5 py-1">
                Healthy volunteers:{" "}
                {trial.healthyVolunteers ? "Yes" : "No"}
              </span>
            )}
          </div>
          <div className="rounded-lg bg-slate-50 dark:bg-slate-900/50 p-4">
            <pre className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 whitespace-pre-wrap font-sans">
              {trial.eligibilityCriteria}
            </pre>
          </div>
        </section>
      )}

      {/* Outcomes */}
      {(trial.primaryOutcomes.length > 0 ||
        trial.secondaryOutcomes.length > 0) && (
        <section className="mb-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
            <ClipboardList className="h-5 w-5 text-sky-600" />
            Outcome Measures
          </h2>

          {trial.primaryOutcomes.length > 0 && (
            <div className="mb-4">
              <h3 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                Primary Outcomes
              </h3>
              <div className="space-y-2">
                {trial.primaryOutcomes.map((outcome, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg border border-emerald-100 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/30 p-3"
                  >
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      {outcome.measure}
                    </p>
                    {outcome.description && (
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {outcome.description}
                      </p>
                    )}
                    {outcome.timeFrame && (
                      <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
                        Time frame: {outcome.timeFrame}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {trial.secondaryOutcomes.length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                Secondary Outcomes
              </h3>
              <div className="space-y-2">
                {trial.secondaryOutcomes.slice(0, 5).map((outcome, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg bg-slate-50 dark:bg-slate-900/50 p-3"
                  >
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      {outcome.measure}
                    </p>
                    {outcome.timeFrame && (
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        Time frame: {outcome.timeFrame}
                      </p>
                    )}
                  </div>
                ))}
                {trial.secondaryOutcomes.length > 5 && (
                  <p className="text-xs text-slate-400 pl-3">
                    +{trial.secondaryOutcomes.length - 5} more secondary
                    outcomes
                  </p>
                )}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Locations */}
      {trial.locations.length > 0 && (
        <section className="mb-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
            <MapPin className="h-5 w-5 text-sky-600" />
            Study Locations ({trial.locations.length})
          </h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {trial.locations.slice(0, 10).map((location, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 rounded-lg bg-slate-50 dark:bg-slate-900/50 p-3"
              >
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-slate-500" />
                <div>
                  {location.facility && (
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      {location.facility}
                    </p>
                  )}
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {[location.city, location.state, location.country]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {trial.locations.length > 10 && (
            <p className="mt-3 text-sm text-slate-400">
              +{trial.locations.length - 10} more locations
            </p>
          )}
        </section>
      )}

    </div>
  );
}
