import type { Meta, StoryObj } from '@storybook/react';
import { NumberInput } from '../draws/NumberInput';

const meta: Meta<typeof NumberInput> = {
  title: 'Draws/NumberInput',
  component: NumberInput,
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'object' },
    error: { control: 'text' },
    disabled: { control: 'boolean' },
    autoAdvance: { control: 'boolean' },
  },
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;
type Story = StoryObj<typeof NumberInput>;

export const Default: Story = {
  args: {
    value: [0, 0, 0, 0, 0, 0],
    onChange: (v) => console.log('Changed:', v),
  },
};

export const WithValues: Story = {
  args: {
    value: [5, 12, 23, 34, 41, 45],
    onChange: (v) => console.log('Changed:', v),
  },
};

export const PartialValues: Story = {
  args: {
    value: [5, 12, 0, 0, 0, 0],
    onChange: (v) => console.log('Changed:', v),
  },
};

export const WithError: Story = {
  args: {
    value: [5, 12, 23, 34, 41, 45],
    error: 'Esta combinación ya ha sido sorteada',
    onChange: (v) => console.log('Changed:', v),
  },
};

export const Disabled: Story = {
  args: {
    value: [5, 12, 23, 34, 41, 45],
    disabled: true,
    onChange: (v) => console.log('Changed:', v),
  },
};

export const DuplicateError: Story = {
  args: {
    value: [5, 12, 23, 5, 41, 45],
    onChange: (v) => console.log('Changed:', v),
  },
};
