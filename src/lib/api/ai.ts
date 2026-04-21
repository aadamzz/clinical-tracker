import { Trial, PHASE_LABELS, STATUS_LABELS } from "@/lib/types/trials";

/**
 * Generate a plain-language summary of a clinical trial using AI.
 * This calls our own Next.js API route which proxies to the Anthropic API.
 */
export async function generateAISummary(trial: Trial): Promise<string> {
  const response = await fetch("/api/ai/summary", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nctId: trial.nctId,
      title: trial.briefTitle,
      status: STATUS_LABELS[trial.status] ?? trial.status,
      phases: trial.phases.map((p) => PHASE_LABELS[p] ?? p).join(", ") || "N/A",
      sponsor: trial.sponsor,
      conditions: trial.conditions.join(", "),
      interventions: trial.interventions
        .map((i) => `${i.name} (${i.type})`)
        .join(", "),
      enrollmentCount: trial.enrollmentCount,
      briefSummary: trial.briefSummary,
      eligibilityCriteria: trial.eligibilityCriteria,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(
      (error as { error: string }).error || `AI Summary error: ${response.status}`
    );
  }

  const data: { summary: string } = await response.json();
  return data.summary;
}
