import type { Meta, StoryObj } from '@storybook/react';
import { Toast } from './Toast';

const meta = {
  title: 'UI/Toast',
  component: Toast,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    onClose: { action: 'closed' },
  },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: {
    message: 'Operation completed successfully.',
    type: 'success',
  },
};

export const Error: Story = {
  args: {
    message: 'An error occurred during the operation.',
    type: 'error',
  },
};

export const Info: Story = {
  args: {
    message: 'This is some information for the user.',
    type: 'info',
  },
};
