"use client";

import { useQueries } from "@tanstack/react-query";
import Link from "next/link";
import {
  ArrowLeft,
  GitCompareArrows,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { useTrialStore } from "@/lib/store/useTrialStore";
import { getTrialById } from "@/lib/api/clinicaltrials";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PhaseBadge } from "@/components/ui/PhaseBadge";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { Trial, PHASE_LABELS } from "@/lib/types/trials";
import { usePageContext } from "@/lib/chat/usePageContext";

const COMPARE_FIELDS: {
  label: string;
  getValue: (t: Trial) => string;
}[] = [
  { label: "Status", getValue: (t) => t.status },
  {
    label: "Phase",
    getValue: (t) =>
      t.phases.map((p) => PHASE_LABELS[p]).join(", ") || "N/A",
  },
  { label: "Sponsor", getValue: (t) => t.sponsor },
  { label: "Sponsor Type", getValue: (t) => t.sponsorClass ?? "N/A" },
  { label: "Study Type", getValue: (t) => t.studyType ?? "N/A" },
  {
    label: "Enrollment",
    getValue: (t) =>
      t.enrollmentCount != null
        ? `${t.enrollmentCount.toLocaleString()} (${t.enrollmentType ?? "N/A"})`
        : "N/A",
  },
  { label: "Start Date", getValue: (t) => t.startDate ?? "N/A" },
  {
    label: "Completion",
    getValue: (t) => t.primaryCompletionDate ?? t.completionDate ?? "N/A",
  },
  { label: "Conditions", getValue: (t) => t.conditions.join(", ") || "N/A" },
  {
    label: "Interventions",
    getValue: (t) =>
      t.interventions.map((i) => `${i.name} (${i.type})`).join(", ") || "N/A",
  },
  { label: "Age Range", getValue: (t) => {
    const parts = [];
    if (t.minimumAge) parts.push(`Min: ${t.minimumAge}`);
    if (t.maximumAge) parts.push(`Max: ${t.maximumAge}`);
    return parts.length > 0 ? parts.join(", ") : "N/A";
  }},
  { label: "Sex", getValue: (t) => t.sex ?? "All" },
  {
    label: "Healthy Volunteers",
    getValue: (t) =>
      t.healthyVolunteers !== undefined
        ? t.healthyVolunteers
          ? "Yes"
          : "No"
        : "N/A",
  },
  {
    label: "Locations",
    getValue: (t) =>
      t.locations.length > 0
        ? `${t.locations.length} site${t.locations.length > 1 ? "s" : ""} in ${[...new Set(t.locations.map((l) => l.country).filter(Boolean))].join(", ")}`
        : "N/A",
  },
  { label: "Has Results", getValue: (t) => (t.hasResults ? "Yes" : "No") },
];

export default function ComparePage() {
  const { compareList, removeFromCompare, clearCompare } = useTrialStore();

  const trialQueries = useQueries({
    queries: compareList.map((nctId) => ({
      queryKey: ["trial", nctId],
      queryFn: () => getTrialById(nctId),
      staleTime: 60 * 60 * 1000,
    })),
  });

  const isLoading = trialQueries.some((q) => q.isLoading);
  const trials = trialQueries
    .filter((q) => q.isSuccess && q.data != null)
    .map((q) => q.data!);

  // Set chat widget context
  usePageContext({
    pageType: "compare",
    pageTitle: `Compare (${compareList.length} trials)`,
    data: {
      trialCount: compareList.length,
      trials: trials.map((t) => ({
        nctId: t.nctId,
        title: t.briefTitle,
        status: t.status,
        phases: t.phases.map((p) => PHASE_LABELS[p]).join(", "),
        sponsor: t.sponsor,
        conditions: t.conditions.join(", "),
        interventions: t.interventions.map((i) => `${i.name} (${i.type})`).join(", "),
        enrollmentCount: t.enrollmentCount,
        startDate: t.startDate,
        completionDate: t.completionDate,
        locations: t.locations.length,
      })),
    },
    suggestedQuestions: trials.length >= 2
      ? [
          "What are the key differences between these trials?",
          "Create a bar chart comparing enrollment numbers",
          "Generate a detailed comparison table",
          "Visualize the phases of each trial in a chart",
          "Summarize pros and cons of each trial",
        ]
      : [
          "How does the trial comparison feature work?",
          "What should I look for when comparing trials?",
          "What are the most important factors to compare?",
        ],
  });

  if (compareList.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white mb-4">
          <GitCompareArrows className="h-6 w-6 text-sky-600" />
          Compare Trials
        </h1>
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-12 text-center">
          <GitCompareArrows className="mx-auto h-12 w-12 text-slate-200 dark:text-slate-600" />
          <h2 className="mt-4 text-lg font-semibold text-slate-700 dark:text-slate-300">
            No trials to compare
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Add trials to comparison from search results using the compare
            button on each trial card.
          </p>
          <Link href="/">
            <Button variant="primary" className="mt-6">
              Search trials
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link
            href="/"
            className="mb-2 inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to search
          </Link>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white">
            <GitCompareArrows className="h-6 w-6 text-sky-600" />
            Compare Trials ({compareList.length})
          </h1>
        </div>
        <Button variant="ghost" size="sm" onClick={clearCompare}>
          <Trash2 className="h-4 w-4" />
          Clear all
        </Button>
      </div>

      {isLoading && (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full rounded-xl" />
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      )}

      {!isLoading && trials.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <table className="w-full text-sm">
            {/* Trial headers */}
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                <th className="sticky left-0 z-10 bg-slate-50 dark:bg-slate-900 p-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider min-w-[140px]">
                  Field
                </th>
                {trials.map((trial) => (
                  <th
                    key={trial.nctId}
                    className="p-4 text-left min-w-[260px]"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                          <Link
                          href={`/trials/${trial.nctId}`}
                          className="text-sm font-semibold text-slate-900 dark:text-slate-100 hover:text-sky-600 dark:hover:text-sky-400 line-clamp-2"
                        >
                          {trial.briefTitle}
                        </Link>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-xs font-mono text-slate-400">
                            {trial.nctId}
                          </span>
                          <a
                            href={`https://clinicaltrials.gov/study/${trial.nctId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-sky-500"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCompare(trial.nctId)}
                        className="shrink-0 rounded-full p-1 text-slate-300 dark:text-slate-500 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-500"
                        aria-label={`Remove ${trial.nctId} from comparison`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {COMPARE_FIELDS.map((field, idx) => (
                <tr
                  key={field.label}
                  className={
                    idx % 2 === 0 ? "bg-white dark:bg-slate-800" : "bg-slate-50/50 dark:bg-slate-900/50"
                  }
                >
                  <td className="sticky left-0 z-10 p-3 text-xs font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap bg-inherit border-r border-slate-100 dark:border-slate-700">
                    {field.label}
                  </td>
                  {trials.map((trial) => {
                    const value = field.getValue(trial);
                    return (
                      <td key={trial.nctId} className="p-3">
                        {field.label === "Status" ? (
                          <StatusBadge status={trial.status} />
                        ) : field.label === "Phase" ? (
                          <div className="flex flex-wrap gap-1">
                            {trial.phases.length > 0 ? (
                              trial.phases.map((p) => (
                                <PhaseBadge key={p} phase={p} />
                              ))
                            ) : (
                              <span className="text-xs text-slate-400">
                                N/A
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-slate-700 dark:text-slate-300">
                            {value}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
