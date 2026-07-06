import type { Meta, StoryObj } from '@storybook/react';
import { PatientProfileSkeleton } from './PatientProfileSkeleton';

const meta = {
  title: 'Components/Skeleton/PatientProfileSkeleton',
  component: PatientProfileSkeleton,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PatientProfileSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
