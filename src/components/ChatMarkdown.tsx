"use client";

import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
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
  LineChart,
  Line,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";

interface ChatMarkdownProps {
  content: string;
}

/* ─── Color palettes ─── */
const CHART_COLORS = [
  "#6366f1", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444",
  "#8b5cf6", "#ec4899", "#14b8a6", "#f97316", "#06b6d4",
];

const STATUS_COLORS: Record<string, string> = {
  Recruiting: "#10b981",
  Completed: "#94a3b8",
  "Active, not recruiting": "#0ea5e9",
  "Not yet recruiting": "#f59e0b",
  Terminated: "#ef4444",
  Suspended: "#dc2626",
  Withdrawn: "#6b7280",
};

/* ─── Chart data types ─── */
interface ChartDataItem {
  name: string;
  value: number;
  color?: string;
  [key: string]: unknown;
}

interface ChartSpec {
  type: "pie" | "bar" | "line" | "radar" | "donut" | "horizontal-bar";
  title?: string;
  data: ChartDataItem[];
  dataKey?: string;
  nameKey?: string;
}

/* ─── Chart renderer ─── */
function InlineChart({ spec }: { spec: ChartSpec }) {
  const data = spec.data.map((d, i) => ({
    ...d,
    color: d.color || STATUS_COLORS[d.name] || CHART_COLORS[i % CHART_COLORS.length],
  }));

  const dataKey = spec.dataKey || "value";

  return (
    <div className="my-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-4 overflow-hidden">
      {spec.title && (
        <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-3 text-center">
          {spec.title}
        </h4>
      )}
      <ResponsiveContainer width="100%" height={220}>
        {renderChart(spec.type, data, dataKey)}
      </ResponsiveContainer>
    </div>
  );
}

function renderChart(type: string, data: ChartDataItem[], dataKey: string) {
  switch (type) {
    case "pie":
    case "donut":
      return (
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={type === "donut" ? 45 : 0}
            outerRadius={80}
            paddingAngle={2}
            dataKey={dataKey}
            label={({ name, percent }) =>
              `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`
            }
            labelLine={{ stroke: "#94a3b8", strokeWidth: 1 }}
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color as string} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: "0.5rem",
              border: "1px solid #e2e8f0",
              fontSize: "0.75rem",
            }}
          />
        </PieChart>
      );

    case "horizontal-bar":
      return (
        <BarChart data={data} layout="vertical" margin={{ left: 10, right: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis type="number" fontSize={11} />
          <YAxis
            type="category"
            dataKey="name"
            width={100}
            fontSize={10}
            tick={{ fill: "#64748b" }}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "0.5rem",
              border: "1px solid #e2e8f0",
              fontSize: "0.75rem",
            }}
          />
          <Bar dataKey={dataKey} radius={[0, 4, 4, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color as string} />
            ))}
          </Bar>
        </BarChart>
      );

    case "bar":
      return (
        <BarChart data={data} margin={{ left: -10, right: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="name" fontSize={10} tick={{ fill: "#64748b" }} />
          <YAxis fontSize={11} />
          <Tooltip
            contentStyle={{
              borderRadius: "0.5rem",
              border: "1px solid #e2e8f0",
              fontSize: "0.75rem",
            }}
          />
          <Bar dataKey={dataKey} radius={[4, 4, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color as string} />
            ))}
          </Bar>
        </BarChart>
      );

    case "line":
      return (
        <LineChart data={data} margin={{ left: -10, right: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="name" fontSize={10} tick={{ fill: "#64748b" }} />
          <YAxis fontSize={11} />
          <Tooltip
            contentStyle={{
              borderRadius: "0.5rem",
              border: "1px solid #e2e8f0",
              fontSize: "0.75rem",
            }}
          />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke="#6366f1"
            strokeWidth={2}
            dot={{ fill: "#6366f1", r: 4 }}
          />
        </LineChart>
      );

    case "radar":
      return (
        <RadarChart cx="50%" cy="50%" outerRadius={70} data={data}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis dataKey="name" fontSize={10} />
          <PolarRadiusAxis fontSize={9} />
          <Radar
            dataKey={dataKey}
            stroke="#6366f1"
            fill="#6366f1"
            fillOpacity={0.3}
          />
          <Legend />
        </RadarChart>
      );

    default:
      return (
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="name" fontSize={10} />
          <YAxis fontSize={11} />
          <Tooltip />
          <Bar dataKey={dataKey} fill="#6366f1" radius={[4, 4, 0, 0]} />
        </BarChart>
      );
  }
}

/* ─── Parse chart blocks from content ─── */

function extractChartSpecs(raw: string): ChartSpec[] {
  const specs: ChartSpec[] = [];
  const regex = /```chart\s*\n([\s\S]*?)```/g;
  let match;
  while ((match = regex.exec(raw)) !== null) {
    try {
      const parsed = JSON.parse(match[1].trim());
      if (parsed && parsed.type && Array.isArray(parsed.data)) {
        specs.push(parsed as ChartSpec);
      }
    } catch {
      // Skip invalid JSON
    }
  }
  return specs;
}

function stripChartBlocks(raw: string): string {
  return raw.replace(/```chart\s*\n[\s\S]*?```/g, "\n%%CHART%%\n");
}

/**
 * ChatMarkdown — renders AI assistant responses with rich formatting
 * including interactive Recharts charts.
 *
 * The AI can embed charts using fenced code blocks with language "chart"
 * containing JSON chart specifications:
 *
 * ```chart
 * {"type":"pie","title":"Phase Distribution","data":[{"name":"Phase 1","value":5},{"name":"Phase 2","value":12}]}
 * ```
 *
 * Supported chart types: pie, donut, bar, horizontal-bar, line, radar
 */
export function ChatMarkdown({ content }: ChatMarkdownProps) {
  const charts = useMemo(() => extractChartSpecs(content), [content]);
  const textWithPlaceholders = useMemo(() => stripChartBlocks(content), [content]);

  // Split by chart placeholders and interleave markdown + charts
  const segments = textWithPlaceholders.split("%%CHART%%");
  let chartIdx = 0;

  return (
    <div className="chat-markdown">
      {segments.map((segment, i) => (
        <div key={i}>
          {segment.trim() && (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={markdownComponents}
            >
              {segment.trim()}
            </ReactMarkdown>
          )}
          {i < segments.length - 1 && charts[chartIdx] && (
            <InlineChart spec={charts[chartIdx++]} />
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Markdown component overrides ─── */
const markdownComponents: Components = {
  // Paragraphs
  p: ({ children }) => (
    <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 mb-2 last:mb-0">
      {children}
    </p>
  ),

  // Headings
  h1: ({ children }) => (
    <h1 className="text-base font-bold text-slate-900 dark:text-white mt-3 mb-1.5">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-sm font-bold text-slate-900 dark:text-white mt-3 mb-1.5">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-2 mb-1">
      {children}
    </h3>
  ),

  // Bold / italic
  strong: ({ children }) => (
    <strong className="font-semibold text-slate-900 dark:text-white">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="italic text-slate-600 dark:text-slate-400">{children}</em>
  ),

  // Lists
  ul: ({ children }) => (
    <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-1 mb-2 ml-4 list-disc">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="text-sm text-slate-700 dark:text-slate-300 space-y-1 mb-2 ml-4 list-decimal">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,

  // Code — regular code blocks (non-chart)
  code: ({ children, className }) => {
    const isBlock = className?.includes("language-");
    if (isBlock) {
      return (
        <code className="block rounded-lg bg-slate-900 dark:bg-slate-950 p-3 text-xs text-emerald-400 font-mono overflow-x-auto my-2">
          {children}
        </code>
      );
    }
    return (
      <code className="rounded bg-violet-100 dark:bg-violet-900/50 px-1.5 py-0.5 text-xs font-mono text-violet-700 dark:text-violet-300">
        {children}
      </code>
    );
  },
  pre: ({ children }) => <div className="my-2">{children}</div>,

  // Tables
  table: ({ children }) => (
    <div className="my-3 overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
      <table className="w-full text-xs">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
      {children}
    </thead>
  ),
  tbody: ({ children }) => (
    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">{children}</tbody>
  ),
  tr: ({ children }) => (
    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">{children}</tr>
  ),
  th: ({ children }) => (
    <th className="px-3 py-2 text-left font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-3 py-2 text-slate-600 dark:text-slate-400">{children}</td>
  ),

  // Blockquotes
  blockquote: ({ children }) => (
    <blockquote className="my-2 border-l-3 border-violet-400 bg-violet-50 dark:bg-violet-950/30 pl-3 py-1.5 rounded-r-lg text-sm text-slate-600 dark:text-slate-400 italic">
      {children}
    </blockquote>
  ),

  // Horizontal rule
  hr: () => <hr className="my-3 border-slate-200 dark:border-slate-700" />,

  // Links
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-violet-600 dark:text-violet-400 underline underline-offset-2 hover:text-violet-700 dark:hover:text-violet-300"
    >
      {children}
    </a>
  ),
};
