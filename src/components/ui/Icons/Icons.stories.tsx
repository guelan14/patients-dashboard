import type { Meta, StoryObj } from '@storybook/react';
import * as Icons from './Icons';

// Un componente wrapper simple para renderizar todos los íconos
const IconGallery = () => (
  <div className="grid grid-cols-4 gap-4">
    {Object.entries(Icons).map(([name, Icon]) => (
      <div key={name} className="flex flex-col items-center justify-center p-4 border rounded hover:bg-gray-50">
        <Icon className="w-8 h-8 mb-2" />
        <span className="text-xs text-gray-500">{name}</span>
      </div>
    ))}
  </div>
);

const meta = {
  title: 'UI/Icons',
  component: IconGallery,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof IconGallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllIcons: Story = {};
