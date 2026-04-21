import type { Meta, StoryObj } from "@storybook/react";
import { PhaseTimeline } from "@/components/PhaseTimeline";
import type { Trial } from "@/lib/types/trials";

const baseTrial: Trial = {
  nctId: "NCT00000001",
  briefTitle: "Sample Clinical Trial",
  status: "RECRUITING",
  phases: [],
  sponsor: "Acme Pharma",
  conditions: ["Diabetes"],
  keywords: [],
  interventions: [],
  locations: [],
  primaryOutcomes: [],
  secondaryOutcomes: [],
  hasResults: false,
};

const meta: Meta<typeof PhaseTimeline> = {
  title: "Components/PhaseTimeline",
  component: PhaseTimeline,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="max-w-2xl p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof PhaseTimeline>;

export const Phase1: Story = {
  args: {
    trial: { ...baseTrial, phases: ["PHASE1"] },
  },
};

export const Phase2: Story = {
  args: {
    trial: { ...baseTrial, phases: ["PHASE2"] },
  },
};

export const Phase3: Story = {
  args: {
    trial: { ...baseTrial, phases: ["PHASE3"] },
  },
};

export const Phase4: Story = {
  args: {
    trial: { ...baseTrial, phases: ["PHASE4"] },
  },
};

export const Phase1And2Combined: Story = {
  args: {
    trial: { ...baseTrial, phases: ["PHASE1", "PHASE2"] },
  },
};

export const NoPhase: Story = {
  args: {
    trial: { ...baseTrial, phases: [] },
  },
};
