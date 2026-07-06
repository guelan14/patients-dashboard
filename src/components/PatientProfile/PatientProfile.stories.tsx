import type { Meta, StoryObj } from '@storybook/react';
import { PatientProfile } from './PatientProfile';

const meta = {
  title: 'Components/PatientProfile',
  component: PatientProfile,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    onToggleFavorite: { action: 'toggled favorite' },
    onEdit: { action: 'clicked edit' },
    onDelete: { action: 'clicked delete' },
  },
} satisfies Meta<typeof PatientProfile>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockPatient = {
  id: '1234567890abcdef',
  name: 'Sarah Williams',
  avatar: 'https://i.pravatar.cc/150?u=sarah',
  createdAt: new Date('2023-05-10T14:00:00Z').toISOString(),
  description: 'Patient has a history of asthma. Needs regular monitoring during spring season.',
  website: 'https://sarahwilliams.design',
};

export const Default: Story = {
  args: {
    patient: mockPatient,
    isFavorite: false,
  },
};

export const Favorited: Story = {
  args: {
    patient: mockPatient,
    isFavorite: true,
  },
};

export const WithoutDescriptionOrWebsite: Story = {
  args: {
    patient: {
      ...mockPatient,
      description: '',
      website: '',
    },
    isFavorite: false,
  },
};
