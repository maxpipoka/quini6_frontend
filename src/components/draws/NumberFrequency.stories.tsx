import type { Meta, StoryObj } from '@storybook/react';
import { NumberFrequency } from '../draws/NumberFrequency';

const meta: Meta<typeof NumberFrequency> = {
  title: 'Draws/NumberFrequency',
  component: NumberFrequency,
  tags: ['autodocs'],
  argTypes: {
    data: { control: 'object' },
    highlightNumber: { control: 'number', min: 0, max: 45 },
  },
};

export default meta;
type Story = StoryObj<typeof NumberFrequency>;

const mockData = Array.from({ length: 46 }, (_, i) => ({
  number: i,
  count: Math.floor(Math.random() * 200),
  percentage: Math.random() * 50,
}));

export const Default: Story = {
  args: {
    data: mockData,
  },
};

export const WithHighlight: Story = {
  args: {
    data: mockData,
    highlightNumber: 23,
  },
};
