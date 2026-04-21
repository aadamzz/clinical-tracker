import { Trial, PHASE_LABELS } from "@/lib/types/trials";

interface PhaseTimelineProps {
  trial: Trial;
}

const PHASE_ORDER = ["EARLY_PHASE1", "PHASE1", "PHASE2", "PHASE3", "PHASE4"] as const;

const PHASE_COLORS: Record<string, { active: string; inactive: string; line: string }> = {
  EARLY_PHASE1: {
    active: "bg-amber-500 text-white border-amber-500",
    inactive: "bg-white dark:bg-slate-800 text-amber-500 border-amber-300 dark:border-amber-700",
    line: "bg-amber-400",
  },
  PHASE1: {
    active: "bg-yellow-500 text-white border-yellow-500",
    inactive: "bg-white dark:bg-slate-800 text-yellow-500 border-yellow-300 dark:border-yellow-700",
    line: "bg-yellow-400",
  },
  PHASE2: {
    active: "bg-orange-500 text-white border-orange-500",
    inactive: "bg-white dark:bg-slate-800 text-orange-500 border-orange-300 dark:border-orange-700",
    line: "bg-orange-400",
  },
  PHASE3: {
    active: "bg-emerald-500 text-white border-emerald-500",
    inactive: "bg-white dark:bg-slate-800 text-emerald-500 border-emerald-300 dark:border-emerald-700",
    line: "bg-emerald-400",
  },
  PHASE4: {
    active: "bg-sky-500 text-white border-sky-500",
    inactive: "bg-white dark:bg-slate-800 text-sky-500 border-sky-300 dark:border-sky-700",
    line: "bg-sky-400",
  },
};

export function PhaseTimeline({ trial }: PhaseTimelineProps) {
  const trialPhases = trial.phases;

  if (trialPhases.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-4 text-center text-sm text-slate-500 dark:text-slate-400">
        Phase information not available for this study
      </div>
    );
  }

  // Find the highest active phase index
  const highestActiveIndex = PHASE_ORDER.reduce((maxIdx, phase, idx) => {
    return trialPhases.includes(phase) ? idx : maxIdx;
  }, -1);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {PHASE_ORDER.map((phase, index) => {
          const isActive = trialPhases.includes(phase);
          const isPast = index < highestActiveIndex;
          const colors = PHASE_COLORS[phase];
          const isCompleted = isActive || isPast;

          return (
            <div key={phase} className="flex flex-1 items-center">
              {/* Node */}
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-xs font-bold transition-all ${
                    isActive
                      ? colors.active
                      : isPast
                        ? colors.active + " opacity-60"
                        : "bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-600"
                  }`}
                >
                  {index + 1}
                </div>
                <span
                  className={`mt-2 text-[11px] font-medium text-center ${
                    isActive
                      ? "text-slate-800 dark:text-slate-200"
                      : isCompleted
                        ? "text-slate-500 dark:text-slate-400"
                        : "text-slate-400 dark:text-slate-500"
                  }`}
                >
                  {PHASE_LABELS[phase]}
                </span>
              </div>

              {/* Connector line */}
              {index < PHASE_ORDER.length - 1 && (
                <div className="mx-1 flex-1">
                  <div
                    className={`h-1 w-full rounded-full ${
                      isCompleted ? colors.line : "bg-slate-200"
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
