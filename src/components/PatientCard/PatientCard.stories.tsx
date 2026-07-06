import type { Meta, StoryObj } from '@storybook/react';
import { PatientCard } from './PatientCard';

const meta = {
  title: 'Components/PatientCard',
  component: PatientCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    onToggleFavorite: () => {},
  },
  argTypes: {
    onToggleFavorite: { action: 'toggled favorite' },
    onEdit: { action: 'clicked edit' },
  },
} satisfies Meta<typeof PatientCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockPatient = {
  id: '1',
  name: 'John Doe',
  avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
  createdAt: new Date('2023-01-01T10:00:00Z').toISOString(),
  description: 'Patient is generally healthy with no prior medical history. Regular checkups recommended.',
  website: 'https://johndoe.com',
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

export const WithoutWebsite: Story = {
  args: {
    patient: {
      ...mockPatient,
      website: '',
    },
    isFavorite: false,
  },
};
