"use client";

import { useState, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { PieLabelRenderProps } from "recharts";
import { searchTrials } from "@/lib/api/clinicaltrials";
import { PHASE_LABELS, STATUS_LABELS, TrialPhase, TrialStatus } from "@/lib/types/trials";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, Loader2, Sparkles, TrendingUp, Users, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { usePageContext } from "@/lib/chat/usePageContext";

const PHASE_COLORS: Record<string, string> = {
  EARLY_PHASE1: "#f59e0b",
  PHASE1: "#eab308",
  PHASE2: "#f97316",
  PHASE3: "#10b981",
  PHASE4: "#0ea5e9",
  NA: "#94a3b8",
};

const STATUS_COLORS: Record<string, string> = {
  RECRUITING: "#10b981",
  ACTIVE_NOT_RECRUITING: "#0ea5e9",
  COMPLETED: "#94a3b8",
  NOT_YET_RECRUITING: "#f59e0b",
  SUSPENDED: "#ef4444",
  TERMINATED: "#dc2626",
  WITHDRAWN: "#6b7280",
  ENROLLING_BY_INVITATION: "#8b5cf6",
};

const SEARCH_TOPICS = [
  "cancer",
  "diabetes",
  "alzheimer",
  "covid-19",
  "depression",
  "heart failure",
];

export default function AnalyticsPage() {
  const [topic, setTopic] = useState("cancer");
  const [customTopic, setCustomTopic] = useState("");

  const activeTopic = customTopic || topic;

  const { data, isLoading } = useQuery({
    queryKey: ["analytics", activeTopic],
    queryFn: () => searchTrials({ query: activeTopic, pageSize: 100 }),
    staleTime: 10 * 60 * 1000,
  });

  const trials = useMemo(() => data?.trials ?? [], [data]);

  // Compute analytics
  const phaseData = useMemo(() => {
    const counts: Record<string, number> = {};
    trials.forEach((t) => {
      if (t.phases.length === 0) {
        counts["NA"] = (counts["NA"] || 0) + 1;
      } else {
        t.phases.forEach((p) => {
          counts[p] = (counts[p] || 0) + 1;
        });
      }
    });
    return Object.entries(counts)
      .map(([phase, count]) => ({
        name: PHASE_LABELS[phase as TrialPhase] ?? phase,
        value: count,
        color: PHASE_COLORS[phase] ?? "#94a3b8",
      }))
      .sort((a, b) => b.value - a.value);
  }, [trials]);

  const statusData = useMemo(() => {
    const counts: Record<string, number> = {};
    trials.forEach((t) => {
      counts[t.status] = (counts[t.status] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([status, count]) => ({
        name: STATUS_LABELS[status as TrialStatus] ?? status,
        value: count,
        color: STATUS_COLORS[status] ?? "#94a3b8",
      }))
      .sort((a, b) => b.value - a.value);
  }, [trials]);

  const sponsorData = useMemo(() => {
    const counts: Record<string, number> = {};
    trials.forEach((t) => {
      if (t.sponsor) {
        counts[t.sponsor] = (counts[t.sponsor] || 0) + 1;
      }
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({
        name: name.length > 25 ? name.substring(0, 25) + "…" : name,
        fullName: name,
        count,
      }));
  }, [trials]);

  const interventionTypeData = useMemo(() => {
    const counts: Record<string, number> = {};
    trials.forEach((t) => {
      t.interventions.forEach((i) => {
        const type = i.type || "OTHER";
        counts[type] = (counts[type] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .map(([type, count]) => ({
        name: type.charAt(0) + type.slice(1).toLowerCase().replace(/_/g, " "),
        value: count,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [trials]);

  const totalEnrollment = useMemo(
    () => trials.reduce((sum, t) => sum + (t.enrollmentCount ?? 0), 0),
    [trials]
  );

  // Set chat widget context
  usePageContext({
    pageType: "analytics",
    pageTitle: `Analytics: ${activeTopic}`,
    data: {
      topic: activeTopic,
      totalStudies: data?.totalCount ?? 0,
      analyzedCount: trials.length,
      totalEnrollment,
      activelyRecruiting: trials.filter((t) => t.status === "RECRUITING").length,
      uniqueSponsors: new Set(trials.map((t) => t.sponsor)).size,
      phaseDistribution: phaseData,
      statusBreakdown: statusData,
      topSponsors: sponsorData,
      interventionTypes: interventionTypeData,
    },
    suggestedQuestions: [
      `Show me a chart of phase distribution for ${activeTopic}`,
      "Generate a comparison chart of recruiting vs completed trials",
      "Visualize the top sponsors as a bar chart",
      "What trends do you see in this data?",
      "Create a breakdown chart of intervention types",
    ],
  });

  const handleCustomSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const input = (e.target as HTMLFormElement).elements.namedItem(
      "topic"
    ) as HTMLInputElement;
    if (input.value.trim()) {
      setCustomTopic(input.value.trim());
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white">
          <BarChart3 className="h-6 w-6 text-sky-600" />
          Analytics Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Visualize clinical trial landscape for any condition or treatment area
        </p>
      </div>

      {/* Topic selector */}
      <div className="mb-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
        <p className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">
          Select a research area to analyze:
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {SEARCH_TOPICS.map((t) => (
            <button
              key={t}
              onClick={() => {
                setTopic(t);
                setCustomTopic("");
              }}
              className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                activeTopic === t
                  ? "border-sky-500 bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400"
                  : "border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-500"
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <form onSubmit={handleCustomSearch} className="flex gap-2">
          <input
            name="topic"
            type="text"
            placeholder="Or type your own topic…"
            className="flex-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
          <Button type="submit" variant="primary" size="sm">
            Analyze
          </Button>
        </form>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-sky-600" />
          <span className="ml-3 text-sm text-slate-500 dark:text-slate-400">
            Fetching trial data for &quot;{activeTopic}&quot;…
          </span>
        </div>
      )}

      {!isLoading && trials.length > 0 && (
        <>
          {/* Summary cards */}
          <div className="mb-8 grid gap-4 sm:grid-cols-4">
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <FlaskConical className="h-4 w-4" />
                Total Studies
              </div>
              <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                {data?.totalCount.toLocaleString()}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                {trials.length} analyzed
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <Users className="h-4 w-4" />
                Total Enrollment
              </div>
              <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                {totalEnrollment.toLocaleString()}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500">across analyzed studies</p>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <TrendingUp className="h-4 w-4" />
                Actively Recruiting
              </div>
              <p className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {trials.filter((t) => t.status === "RECRUITING").length}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500">of {trials.length} analyzed</p>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <Sparkles className="h-4 w-4" />
                Unique Sponsors
              </div>
              <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                {new Set(trials.map((t) => t.sponsor)).size}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500">organizations</p>
            </div>
          </div>

          {/* Charts grid */}
          <div className="mb-8 grid gap-6 lg:grid-cols-2">
            {/* Phase distribution */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
              <h2 className="mb-4 text-base font-semibold text-slate-900 dark:text-white">
                Phase Distribution
              </h2>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={phaseData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={(props: PieLabelRenderProps) => {
                      const name = props.name ?? "";
                      const percent = typeof props.percent === "number" ? props.percent : 0;
                      return `${name} (${(percent * 100).toFixed(0)}%)`;
                    }}
                  >
                    {phaseData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Status breakdown */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
              <h2 className="mb-4 text-base font-semibold text-slate-900 dark:text-white">
                Status Breakdown
              </h2>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={statusData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" fontSize={12} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={140}
                    fontSize={11}
                    tick={{ fill: "#64748b" }}
                  />
                  <Tooltip />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {statusData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Top sponsors */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
              <h2 className="mb-4 text-base font-semibold text-slate-900 dark:text-white">
                Top 10 Sponsors
              </h2>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={sponsorData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" fontSize={12} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={150}
                    fontSize={10}
                    tick={{ fill: "#64748b" }}
                  />
                  <Tooltip
                    formatter={(value) => [String(value), "Studies"]}
                    labelFormatter={(label) => {
                      const l = String(label);
                      const item = sponsorData.find((d) => d.name === l);
                      return item?.fullName ?? l;
                    }}
                  />
                  <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Intervention types */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
              <h2 className="mb-4 text-base font-semibold text-slate-900 dark:text-white">
                Intervention Types
              </h2>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={interventionTypeData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={(props: PieLabelRenderProps) => {
                      const name = props.name ?? "";
                      const percent = typeof props.percent === "number" ? props.percent : 0;
                      return `${name} (${(percent * 100).toFixed(0)}%)`;
                    }}
                  >
                    {interventionTypeData.map((_, idx) => (
                      <Cell
                        key={idx}
                        fill={
                          [
                            "#6366f1",
                            "#0ea5e9",
                            "#10b981",
                            "#f59e0b",
                            "#ef4444",
                            "#8b5cf6",
                            "#ec4899",
                            "#14b8a6",
                          ][idx % 8]
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

        </>
      )}

      {!isLoading && trials.length === 0 && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-12 text-center">
          <p className="text-lg font-medium text-slate-700 dark:text-slate-300">No data found</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Try a different research topic
          </p>
        </div>
      )}
    </div>
  );
}
