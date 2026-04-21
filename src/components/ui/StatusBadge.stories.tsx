import type { Meta, StoryObj } from "@storybook/react";
import { StatusBadge } from "@/components/ui/StatusBadge";

const meta: Meta<typeof StatusBadge> = {
  title: "UI/StatusBadge",
  component: StatusBadge,
  tags: ["autodocs"],
  argTypes: {
    status: {
      control: "select",
      options: [
        "RECRUITING",
        "ACTIVE_NOT_RECRUITING",
        "COMPLETED",
        "ENROLLING_BY_INVITATION",
        "NOT_YET_RECRUITING",
        "SUSPENDED",
        "TERMINATED",
        "WITHDRAWN",
      ],
    },
    size: {
      control: "radio",
      options: ["sm", "md"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof StatusBadge>;

export const Recruiting: Story = {
  args: { status: "RECRUITING", size: "sm" },
};

export const ActiveNotRecruiting: Story = {
  args: { status: "ACTIVE_NOT_RECRUITING", size: "sm" },
};

export const Completed: Story = {
  args: { status: "COMPLETED", size: "sm" },
};

export const NotYetRecruiting: Story = {
  args: { status: "NOT_YET_RECRUITING", size: "sm" },
};

export const Suspended: Story = {
  args: { status: "SUSPENDED", size: "sm" },
};

export const Terminated: Story = {
  args: { status: "TERMINATED", size: "sm" },
};

export const Medium: Story = {
  args: { status: "RECRUITING", size: "md" },
};

export const AllStatuses: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <StatusBadge status="RECRUITING" />
      <StatusBadge status="ACTIVE_NOT_RECRUITING" />
      <StatusBadge status="COMPLETED" />
      <StatusBadge status="ENROLLING_BY_INVITATION" />
      <StatusBadge status="NOT_YET_RECRUITING" />
      <StatusBadge status="SUSPENDED" />
      <StatusBadge status="TERMINATED" />
      <StatusBadge status="WITHDRAWN" />
    </div>
  ),
};
