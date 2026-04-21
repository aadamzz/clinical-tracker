"use client";

import Link from "next/link";
import {
  Heart,
  Calendar,
  Users,
  Building2,
  MapPin,
  GitCompareArrows,
} from "lucide-react";
import { Trial, PHASE_LABELS } from "@/lib/types/trials";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PhaseBadge } from "@/components/ui/PhaseBadge";
import { useTrialStore } from "@/lib/store/useTrialStore";

interface TrialCardProps {
  trial: Trial;
}

export function TrialCard({ trial }: TrialCardProps) {
  const { isFavorite, toggleFavorite, isInCompare, addToCompare, removeFromCompare, compareList } = useTrialStore();
  const favorited = isFavorite(trial.nctId);
  const compared = isInCompare(trial.nctId);

  const locationSummary = trial.locations.length > 0
    ? [...new Set(trial.locations.map((l) => l.country).filter(Boolean))].join(
        ", "
      )
    : null;

  return (
    <article className="group relative rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm transition-all hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <Link
            href={`/trials/${trial.nctId}`}
            className="block"
          >
            <h3 className="text-base font-semibold leading-snug text-slate-900 dark:text-slate-100 group-hover:text-sky-700 dark:group-hover:text-sky-400 transition-colors line-clamp-2">
              {trial.briefTitle}
            </h3>
          </Link>
          <p className="mt-1 text-xs font-medium text-slate-400">
            {trial.nctId}
          </p>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() =>
              compared
                ? removeFromCompare(trial.nctId)
                : addToCompare(trial.nctId)
            }
            disabled={!compared && compareList.length >= 3}
            className={`rounded-full p-2 transition-colors ${
              compared
                ? "text-sky-600 hover:text-sky-700 bg-sky-50 dark:bg-sky-900/30"
                : compareList.length >= 3
                  ? "text-slate-200 dark:text-slate-600 cursor-not-allowed"
                  : "text-slate-300 dark:text-slate-500 hover:text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/30"
            }`}
            aria-label={
              compared
                ? `Remove ${trial.nctId} from comparison`
                : `Add ${trial.nctId} to comparison`
            }
            title={!compared && compareList.length >= 3 ? "Max 3 trials" : undefined}
          >
            <GitCompareArrows className="h-4 w-4" />
          </button>
          <button
            onClick={() => toggleFavorite(trial.nctId)}
            className={`rounded-full p-2 transition-colors ${
              favorited
                ? "text-rose-500 hover:text-rose-600 bg-rose-50 dark:bg-rose-900/30"
                : "text-slate-300 dark:text-slate-500 hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30"
            }`}
            aria-label={
              favorited
                ? `Remove ${trial.nctId} from favorites`
                : `Add ${trial.nctId} to favorites`
            }
          >
            <Heart
              className="h-5 w-5"
              fill={favorited ? "currentColor" : "none"}
            />
          </button>
        </div>
      </div>

      {/* Badges */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <StatusBadge status={trial.status} />
        {trial.phases.map((phase) => (
          <PhaseBadge
            key={phase}
            phase={phase}
          />
        ))}
        {trial.phases.length === 0 && (
          <span className="rounded-full border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-2 py-0.5 text-xs text-slate-500 dark:text-slate-400">
            {PHASE_LABELS.NA}
          </span>
        )}
      </div>

      {/* Summary */}
      {trial.briefSummary && (
        <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-2">
          {trial.briefSummary}
        </p>
      )}

      {/* Meta */}
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500 dark:text-slate-400">
        {trial.sponsor && (
          <span className="inline-flex items-center gap-1">
            <Building2 className="h-3.5 w-3.5" />
            <span className="max-w-[180px] truncate">{trial.sponsor}</span>
          </span>
        )}
        {trial.enrollmentCount != null && (
          <span className="inline-flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {trial.enrollmentCount.toLocaleString()} participants
          </span>
        )}
        {trial.startDate && (
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {trial.startDate}
          </span>
        )}
        {locationSummary && (
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            <span className="max-w-[160px] truncate">{locationSummary}</span>
          </span>
        )}
      </div>

      {/* Conditions */}
      {trial.conditions.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {trial.conditions.slice(0, 3).map((condition) => (
            <span
              key={condition}
              className="rounded-md bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 text-[11px] font-medium text-indigo-600 dark:text-indigo-400"
            >
              {condition}
            </span>
          ))}
          {trial.conditions.length > 3 && (
            <span className="text-[11px] text-slate-400">
              +{trial.conditions.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* ClinicalTrials.gov link */}
      <div className="mt-3 border-t border-slate-100 dark:border-slate-700 pt-3">
        <Link
          href={`/trials/${trial.nctId}`}
          className="text-xs font-medium text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors"
        >
          View full details →
        </Link>
      </div>
    </article>
  );
}
