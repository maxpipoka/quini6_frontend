import type { Meta, StoryObj } from '@storybook/react';
import { DrawDetail } from '../draws/DrawDetail';

const meta: Meta<typeof DrawDetail> = {
  title: 'Draws/DrawDetail',
  component: DrawDetail,
  tags: ['autodocs'],
  argTypes: {
    draw: { control: 'object' },
    hasPrev: { control: 'boolean' },
    hasNext: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof DrawDetail>;

const mockDraw = {
  officialNumber: 3245,
  date: '2024-01-15T10:00:00Z',
  numbers: [5, 12, 23, 34, 41, 45],
  complementary: 3,
  reintegro: 7,
  prizes: [
    { category: '6 aciertos', winners: 0, amount: 0 },
    { category: '5 aciertos + C', winners: 2, amount: 125000 },
    { category: '5 aciertos', winners: 45, amount: 3500 },
    { category: '4 aciertos', winners: 2100, amount: 50 },
    { category: '3 aciertos', winners: 45000, amount: 10 },
    { category: '2 aciertos', winners: 580000, amount: 4 },
    { category: 'Reintegro', winners: 1200000, amount: 1 },
  ],
  frequencies: Array.from({ length: 46 }, (_, i) => ({
    number: i,
    count: Math.floor(Math.random() * 200),
    percentage: Math.random() * 50,
  })),
};

export const Default: Story = {
  args: {
    draw: mockDraw,
    hasPrev: true,
    hasNext: true,
  },
};

export const FirstDraw: Story = {
  args: {
    draw: { ...mockDraw, officialNumber: 1 },
    hasPrev: false,
    hasNext: true,
  },
};

export const LastDraw: Story = {
  args: {
    draw: { ...mockDraw, officialNumber: 3500 },
    hasPrev: true,
    hasNext: false,
  },
};

export const NoPrizes: Story = {
  args: {
    draw: {
      ...mockDraw,
      prizes: [{ category: 'Sin premios', winners: 0, amount: 0 }],
    },
    hasPrev: true,
    hasNext: true,
  },
};
