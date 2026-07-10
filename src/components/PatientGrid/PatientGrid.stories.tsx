import type { Meta, StoryObj } from '@storybook/react';
import { PatientGrid } from './PatientGrid';
import type { Patient } from '../../types/patient';

const meta = {
  title: 'Components/PatientGrid',
  component: PatientGrid,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  args: {
    onToggleFavorite: () => {},
    onEdit: () => {},
    onArchive: () => {},
  },
  argTypes: {
    onToggleFavorite: { action: 'toggled favorite' },
    onEdit: { action: 'clicked edit' },
    onArchive: { action: 'clicked archive' },
  },
} satisfies Meta<typeof PatientGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
    createdAt: new Date('2023-01-01T10:00:00Z').toISOString(),
    description: 'Patient is generally healthy.',
    website: '',
  },
  {
    id: '2',
    name: 'Bob Smith',
    avatar: '',
    createdAt: new Date('2023-02-15T12:30:00Z').toISOString(),
    description: 'Has a history of allergies.',
    website: '',
  },
  {
    id: '3',
    name: 'Charlie Brown',
    avatar: '',
    website: 'https://charlie.example.com',
    createdAt: new Date('2023-03-20T08:15:00Z').toISOString(),
    description: 'Regular checkups required.',
  },
];

export const Default: Story = {
  args: {
    patients: mockPatients,
    isFavorite: (id) => id === '2', // Mock implementation
  },
};

export const Loading: Story = {
  args: {
    patients: [],
    loading: true,
    isFavorite: () => false,
  },
};

export const Empty: Story = {
  args: {
    patients: [],
    isFavorite: () => false,
  },
};
