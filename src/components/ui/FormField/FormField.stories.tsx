import type { Meta, StoryObj } from '@storybook/react';
import { FormField } from './FormField';
import { Input } from '../Input/Input';

const meta = {
  title: 'UI/FormField',
  component: FormField,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof FormField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Username',
    children: <Input placeholder="Enter your username" />,
  },
};

export const Required: Story = {
  args: {
    label: 'Email',
    required: true,
    children: <Input type="email" placeholder="Enter your email" />,
  },
};

export const WithError: Story = {
  args: {
    label: 'Password',
    required: true,
    error: 'Password must be at least 8 characters long.',
    children: <Input type="password" hasError />,
  },
};
