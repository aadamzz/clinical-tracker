import { TrialStatus, STATUS_LABELS } from "@/lib/types/trials";

const STATUS_CONFIG: Record<
  string,
  { dot: string; bg: string; text: string; animate?: boolean }
> = {
  RECRUITING: {
    dot: "bg-emerald-500",
    bg: "bg-emerald-50 border-emerald-200",
    text: "text-emerald-700",
    animate: true,
  },
  ACTIVE_NOT_RECRUITING: {
    dot: "bg-sky-500",
    bg: "bg-sky-50 border-sky-200",
    text: "text-sky-700",
  },
  COMPLETED: {
    dot: "bg-slate-400",
    bg: "bg-slate-50 border-slate-200",
    text: "text-slate-600",
  },
  ENROLLING_BY_INVITATION: {
    dot: "bg-violet-500",
    bg: "bg-violet-50 border-violet-200",
    text: "text-violet-700",
  },
  NOT_YET_RECRUITING: {
    dot: "bg-amber-500",
    bg: "bg-amber-50 border-amber-200",
    text: "text-amber-700",
  },
  SUSPENDED: {
    dot: "bg-red-400",
    bg: "bg-red-50 border-red-200",
    text: "text-red-700",
  },
  TERMINATED: {
    dot: "bg-red-600",
    bg: "bg-red-50 border-red-200",
    text: "text-red-800",
  },
  WITHDRAWN: {
    dot: "bg-gray-500",
    bg: "bg-gray-50 border-gray-200",
    text: "text-gray-600",
  },
};

const DEFAULT_CONFIG = {
  dot: "bg-slate-400",
  bg: "bg-slate-50 border-slate-200",
  text: "text-slate-600",
};

interface StatusBadgeProps {
  status: TrialStatus;
  size?: "sm" | "md";
}

export function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? DEFAULT_CONFIG;
  const sizeClasses =
    size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${config.bg} ${config.text} ${sizeClasses}`}
    >
      <span className="relative flex h-2 w-2">
        {config.animate && (
          <span
            className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${config.dot}`}
          />
        )}
        <span
          className={`relative inline-flex h-2 w-2 rounded-full ${config.dot}`}
        />
      </span>
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}
