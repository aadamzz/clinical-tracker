"use client";

import { useState, useCallback } from "react";
import { Sparkles, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Trial } from "@/lib/types/trials";
import { generateAISummary } from "@/lib/api/ai";
import { Button } from "@/components/ui/Button";

interface AISummaryProps {
  trial: Trial;
}

type SummaryState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; summary: string }
  | { status: "error"; message: string };

export function AISummary({ trial }: AISummaryProps) {
  const [state, setState] = useState<SummaryState>({ status: "idle" });

  const handleGenerate = useCallback(async () => {
    setState({ status: "loading" });
    try {
      const summary = await generateAISummary(trial);
      setState({ status: "success", summary });
    } catch (err) {
      setState({
        status: "error",
        message:
          err instanceof Error ? err.message : "Failed to generate summary",
      });
    }
  }, [trial]);

  return (
    <div className="rounded-xl border border-indigo-200 dark:border-indigo-800 bg-gradient-to-br from-indigo-50 to-sky-50 dark:from-indigo-950/50 dark:to-sky-950/50 p-5">
      <div className="flex items-center gap-2 mb-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/50">
          <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-indigo-900 dark:text-indigo-200">
            AI Plain-Language Summary
          </h3>
          <p className="text-xs text-indigo-600/70 dark:text-indigo-400/70">
            Powered by Claude — simplified for patients &amp; caregivers
          </p>
        </div>
      </div>

      {state.status === "idle" && (
        <Button
          variant="primary"
          onClick={handleGenerate}
          className="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800"
        >
          <Sparkles className="h-4 w-4" />
          Explain this study
        </Button>
      )}

      {state.status === "loading" && (
        <div className="flex items-center gap-3 rounded-lg bg-white/60 dark:bg-slate-800/60 p-4">
          <Loader2 className="h-5 w-5 animate-spin text-indigo-600 dark:text-indigo-400" />
          <div>
            <p className="text-sm font-medium text-indigo-800 dark:text-indigo-200">
              Generating summary…
            </p>
            <p className="text-xs text-indigo-600/70 dark:text-indigo-400/70">
              AI is analyzing the study data
            </p>
          </div>
        </div>
      )}

      {state.status === "success" && (
        <div className="space-y-3">
          <div className="rounded-lg bg-white/80 dark:bg-slate-800/80 p-4">
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-line">
              {state.summary}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleGenerate}>
              <RefreshCw className="h-3.5 w-3.5" />
              Regenerate
            </Button>
            <span className="text-[10px] text-indigo-400">
              AI-generated summary — always verify with your healthcare provider
            </span>
          </div>
        </div>
      )}

      {state.status === "error" && (
        <div className="space-y-3">
          <div className="flex items-start gap-2 rounded-lg bg-red-50 dark:bg-red-900/30 p-4">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500 dark:text-red-400" />
            <div>
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                Could not generate summary
              </p>
              <p className="mt-0.5 text-xs text-red-600 dark:text-red-400">{state.message}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleGenerate}>
            <RefreshCw className="h-3.5 w-3.5" />
            Try again
          </Button>
        </div>
      )}
    </div>
  );
}
