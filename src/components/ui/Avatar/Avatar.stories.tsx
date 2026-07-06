import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from './Avatar';

const meta = {
  title: 'UI/Avatar',
  component: Avatar,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'John Doe',
  },
};

export const WithImage: Story = {
  args: {
    name: 'Jane Smith',
    src: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
  },
};

export const Large: Story = {
  args: {
    name: 'Large Avatar',
    className: 'w-16 h-16',
  },
};

export const Small: Story = {
  args: {
    name: 'Small Avatar',
    className: 'w-8 h-8',
  },
};
