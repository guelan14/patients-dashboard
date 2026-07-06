import type { Meta, StoryObj } from '@storybook/react';
import { FavoritesSidebar } from './FavoritesSidebar';

const meta = {
  title: 'Components/FavoritesSidebar',
  component: FavoritesSidebar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FavoritesSidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Close clicked'),
  },
};

export const Closed: Story = {
  args: {
    isOpen: false,
    onClose: () => console.log('Close clicked'),
  },
};
