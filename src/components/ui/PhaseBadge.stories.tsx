import type { Meta, StoryObj } from "@storybook/react";
import { PhaseBadge } from "@/components/ui/PhaseBadge";

const meta: Meta<typeof PhaseBadge> = {
  title: "UI/PhaseBadge",
  component: PhaseBadge,
  tags: ["autodocs"],
  argTypes: {
    phase: {
      control: "select",
      options: [
        "EARLY_PHASE1",
        "PHASE1",
        "PHASE2",
        "PHASE3",
        "PHASE4",
        "NA",
      ],
    },
    size: {
      control: "radio",
      options: ["sm", "md"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof PhaseBadge>;

export const Phase1: Story = {
  args: { phase: "PHASE1", size: "sm" },
};

export const Phase2: Story = {
  args: { phase: "PHASE2", size: "sm" },
};

export const Phase3: Story = {
  args: { phase: "PHASE3", size: "sm" },
};

export const Phase4: Story = {
  args: { phase: "PHASE4", size: "sm" },
};

export const EarlyPhase1: Story = {
  args: { phase: "EARLY_PHASE1", size: "sm" },
};

export const NotApplicable: Story = {
  args: { phase: "NA", size: "sm" },
};

export const AllPhases: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <PhaseBadge phase="EARLY_PHASE1" />
      <PhaseBadge phase="PHASE1" />
      <PhaseBadge phase="PHASE2" />
      <PhaseBadge phase="PHASE3" />
      <PhaseBadge phase="PHASE4" />
      <PhaseBadge phase="NA" />
    </div>
  ),
};
