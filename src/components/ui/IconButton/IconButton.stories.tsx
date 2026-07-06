import type { Meta, StoryObj } from '@storybook/react';
import { IconButton } from './IconButton';
import { StarIcon } from '../Icons/Icons';

const meta = {
  title: 'UI/IconButton',
  component: IconButton,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    onClick: { action: 'clicked' },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <StarIcon className="w-5 h-5" />,
    'aria-label': 'Star',
  },
};
