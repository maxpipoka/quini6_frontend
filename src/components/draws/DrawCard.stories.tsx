import type { Meta, StoryObj } from '@storybook/react';
import { DrawCard } from '../draws/DrawCard';

const meta: Meta<typeof DrawCard> = {
  title: 'Draws/DrawCard',
  component: DrawCard,
  tags: ['autodocs'],
  argTypes: {
    draw: { control: 'object' },
    onClick: { action: 'clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof DrawCard>;

const mockDraw = {
  officialNumber: 3245,
  date: '2024-01-15',
  numbers: [5, 12, 23, 34, 41, 45],
  complementary: 3,
  reintegro: 7,
};

export const Default: Story = {
  args: {
    draw: mockDraw,
  },
};

export const Clickable: Story = {
  args: {
    draw: mockDraw,
    onClick: () => console.log('Card clicked'),
  },
};
