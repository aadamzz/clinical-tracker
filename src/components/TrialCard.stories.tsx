import type { Meta, StoryObj } from "@storybook/react";
import { TrialCard } from "@/components/TrialCard";
import type { Trial } from "@/lib/types/trials";

const sampleTrial: Trial = {
  nctId: "NCT05432101",
  briefTitle:
    "A Phase 3 Study of Drug X for the Treatment of Advanced Non-Small Cell Lung Cancer",
  officialTitle:
    "A Randomized, Double-Blind, Phase 3 Study to Evaluate the Efficacy and Safety of Drug X vs Placebo in Patients With Advanced NSCLC",
  status: "RECRUITING",
  phases: ["PHASE3"],
  startDate: "2024-03",
  primaryCompletionDate: "2026-12",
  completionDate: "2027-06",
  sponsor: "Global Pharma Inc.",
  sponsorClass: "INDUSTRY",
  enrollmentCount: 450,
  enrollmentType: "ESTIMATED",
  briefSummary:
    "This study evaluates whether Drug X, combined with standard chemotherapy, can improve outcomes for patients with advanced non-small cell lung cancer who have not received prior treatment.",
  conditions: ["Non-Small Cell Lung Cancer", "NSCLC", "Lung Neoplasms"],
  keywords: ["immunotherapy", "checkpoint inhibitor"],
  studyType: "INTERVENTIONAL",
  interventions: [
    { type: "DRUG", name: "Drug X", description: "Experimental treatment" },
    { type: "DRUG", name: "Placebo", description: "Matching placebo" },
  ],
  locations: [
    { facility: "Mayo Clinic", city: "Rochester", state: "MN", country: "United States" },
    { facility: "Johns Hopkins", city: "Baltimore", state: "MD", country: "United States" },
    { facility: "Charité Berlin", city: "Berlin", country: "Germany" },
  ],
  primaryOutcomes: [
    {
      measure: "Overall Survival",
      description: "Time from randomization to death",
      timeFrame: "Up to 36 months",
    },
  ],
  secondaryOutcomes: [],
  hasResults: false,
};

const completedTrial: Trial = {
  ...sampleTrial,
  nctId: "NCT03210987",
  briefTitle: "Efficacy of Metformin in Preventing Type 2 Diabetes in Prediabetic Adults",
  status: "COMPLETED",
  phases: ["PHASE4"],
  startDate: "2020-01",
  completionDate: "2023-08",
  sponsor: "National Institutes of Health",
  sponsorClass: "NIH",
  enrollmentCount: 1200,
  enrollmentType: "ACTUAL",
  briefSummary:
    "A completed study investigating whether metformin can prevent or delay the onset of type 2 diabetes in adults with prediabetes.",
  conditions: ["Prediabetes", "Type 2 Diabetes"],
  interventions: [{ type: "DRUG", name: "Metformin", description: "500mg twice daily" }],
  locations: [
    { facility: "UCLA Medical Center", city: "Los Angeles", state: "CA", country: "United States" },
  ],
  hasResults: true,
};

const earlyPhaseTrial: Trial = {
  ...sampleTrial,
  nctId: "NCT06789012",
  briefTitle: "First-in-Human Study of ABC-123 for Alzheimer's Disease",
  status: "NOT_YET_RECRUITING",
  phases: ["PHASE1"],
  startDate: "2025-06",
  sponsor: "Neuro Biotech Ltd.",
  sponsorClass: "INDUSTRY",
  enrollmentCount: 30,
  enrollmentType: "ESTIMATED",
  briefSummary:
    "A first-in-human dose escalation study to evaluate the safety, tolerability, and pharmacokinetics of ABC-123 in patients with early Alzheimer's disease.",
  conditions: ["Alzheimer Disease"],
  interventions: [{ type: "BIOLOGICAL", name: "ABC-123" }],
  locations: [],
};

const meta: Meta<typeof TrialCard> = {
  title: "Components/TrialCard",
  component: TrialCard,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="max-w-2xl p-6 bg-slate-50">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof TrialCard>;

export const Recruiting: Story = {
  args: { trial: sampleTrial },
};

export const Completed: Story = {
  args: { trial: completedTrial },
};

export const EarlyPhase: Story = {
  args: { trial: earlyPhaseTrial },
};

export const MultipleCards: Story = {
  render: () => (
    <div className="space-y-4">
      <TrialCard trial={sampleTrial} />
      <TrialCard trial={completedTrial} />
      <TrialCard trial={earlyPhaseTrial} />
    </div>
  ),
};
