import type { Meta, StoryObj } from '@storybook/react';
import { PatientModal } from './PatientModal';

const meta = {
  title: 'Components/PatientModal',
  component: PatientModal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    onClose: () => {},
    onSave: () => {},
  },
  argTypes: {
    onClose: { action: 'closed' },
    onSave: { action: 'saved' },
  },
} satisfies Meta<typeof PatientModal>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockPatient = {
  id: '1',
  name: 'John Doe',
  avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
  createdAt: new Date('2023-01-01T10:00:00Z').toISOString(),
  description: 'Regular checkups recommended.',
  website: 'https://johndoe.com',
};

export const AddPatient: Story = {
  args: {
    isOpen: true,
    patient: null,
  },
};

export const EditPatient: Story = {
  args: {
    isOpen: true,
    patient: mockPatient,
  },
};
