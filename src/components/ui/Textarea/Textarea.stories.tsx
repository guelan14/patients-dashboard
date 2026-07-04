import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './Textarea';

const meta = {
    title: 'UI/Textarea',
    component: Textarea,
    tags: ['autodocs'],
    argTypes: {
        onChange: { action: 'changed' },
    },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        placeholder: 'Type something here...',
    },
};

export const WithError: Story = {
    args: {
        placeholder: 'Type something here...',
        hasError: true,
    },
};
