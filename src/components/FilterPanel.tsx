"use client";

import { X, SlidersHorizontal } from "lucide-react";
import { useTrialStore } from "@/lib/store/useTrialStore";
import { TrialPhase, TrialStatus, PHASE_LABELS, STATUS_LABELS } from "@/lib/types/trials";
import { Button } from "@/components/ui/Button";

const FILTERABLE_PHASES: TrialPhase[] = [
  "EARLY_PHASE1",
  "PHASE1",
  "PHASE2",
  "PHASE3",
  "PHASE4",
];

const FILTERABLE_STATUSES: TrialStatus[] = [
  "RECRUITING",
  "ACTIVE_NOT_RECRUITING",
  "COMPLETED",
  "NOT_YET_RECRUITING",
  "ENROLLING_BY_INVITATION",
  "SUSPENDED",
  "TERMINATED",
  "WITHDRAWN",
];

export function FilterPanel() {
  const {
    filters,
    togglePhase,
    toggleStatus,
    resetFilters,
    setSortBy,
    isFilterPanelOpen,
    setFilterPanelOpen,
  } = useTrialStore();

  const activeFilterCount =
    filters.phases.length +
    filters.statuses.length +
    filters.interventionTypes.length;

  return (
    <div className="w-full">
      {/* Toggle button */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setFilterPanelOpen(!isFilterPanelOpen)}
          className="gap-1.5"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-sky-600 text-[10px] font-bold text-white">
              {activeFilterCount}
            </span>
          )}
        </Button>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <label htmlFor="sort-select" className="text-xs font-medium text-slate-500">
            Sort:
          </label>
          <select
            id="sort-select"
            value={filters.sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as "relevance" | "date" | "enrollment")
            }
            className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            <option value="relevance">Relevance</option>
            <option value="date">Last Updated</option>
            <option value="enrollment">Enrollment</option>
          </select>
        </div>

        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            <X className="h-3.5 w-3.5" />
            Clear all
          </Button>
        )}
      </div>

      {/* Expandable panel */}
      {isFilterPanelOpen && (
        <div className="mt-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Phase filters */}
            <div>
              <h3 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                Phase
              </h3>
              <div className="flex flex-wrap gap-2">
                {FILTERABLE_PHASES.map((phase) => {
                  const active = filters.phases.includes(phase);
                  return (
                    <button
                      key={phase}
                      onClick={() => togglePhase(phase)}
                      className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                        active
                          ? "border-sky-500 bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400"
                          : "border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700"
                      }`}
                    >
                      {PHASE_LABELS[phase]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Status filters */}
            <div>
              <h3 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                Status
              </h3>
              <div className="flex flex-wrap gap-2">
                {FILTERABLE_STATUSES.map((status) => {
                  const active = filters.statuses.includes(status);
                  return (
                    <button
                      key={status}
                      onClick={() => toggleStatus(status)}
                      className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                        active
                          ? "border-sky-500 bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400"
                          : "border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700"
                      }`}
                    >
                      {STATUS_LABELS[status]}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
