import { TrialPhase, PHASE_LABELS } from "@/lib/types/trials";

const PHASE_COLORS: Record<TrialPhase, string> = {
  EARLY_PHASE1: "bg-amber-100 text-amber-800 border-amber-200",
  PHASE1: "bg-yellow-100 text-yellow-800 border-yellow-200",
  PHASE2: "bg-orange-100 text-orange-800 border-orange-200",
  PHASE3: "bg-emerald-100 text-emerald-800 border-emerald-200",
  PHASE4: "bg-sky-100 text-sky-800 border-sky-200",
  NA: "bg-slate-100 text-slate-600 border-slate-200",
};

interface PhaseBadgeProps {
  phase: TrialPhase;
  size?: "sm" | "md";
}

export function PhaseBadge({ phase, size = "sm" }: PhaseBadgeProps) {
  const colors = PHASE_COLORS[phase] ?? PHASE_COLORS.NA;
  const sizeClasses =
    size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm";

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${colors} ${sizeClasses}`}
    >
      {PHASE_LABELS[phase] ?? phase}
    </span>
  );
}
