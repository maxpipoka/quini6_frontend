// eslint-disable-next-line storybook/no-renderer-packages
import type { Meta, StoryObj } from '@storybook/react';
import { PrizeTable } from '../draws/PrizeTable';

const meta: Meta<typeof PrizeTable> = {
  title: 'Draws/PrizeTable',
  component: PrizeTable,
  tags: ['autodocs'],
  argTypes: {
    prizes: { control: 'object' },
  },
};

export default meta;
type Story = StoryObj<typeof PrizeTable>;

const mockPrizes = [
  { category: '6 aciertos', winners: 0, amount: 0 },
  { category: '5 aciertos + C', winners: 2, amount: 125000 },
  { category: '5 aciertos', winners: 45, amount: 3500 },
  { category: '4 aciertos', winners: 2100, amount: 50 },
  { category: '3 aciertos', winners: 45000, amount: 10 },
  { category: '2 aciertos', winners: 580000, amount: 4 },
  { category: 'Reintegro', winners: 1200000, amount: 1 },
];

export const Default: Story = {
  args: {
    prizes: mockPrizes,
  },
};

export const Empty: Story = {
  args: {
    prizes: [],
  },
};

export const SinglePrize: Story = {
  args: {
    prizes: [{ category: '6 aciertos', winners: 1, amount: 5000000 }],
  },
};
