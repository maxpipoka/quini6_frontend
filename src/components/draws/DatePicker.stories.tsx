// eslint-disable-next-line storybook/no-renderer-packages
import type { Meta, StoryObj } from '@storybook/react';
import { DatePicker } from '../draws/DatePicker';

const meta: Meta<typeof DatePicker> = {
  title: 'Draws/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'text' },
    error: { control: 'text' },
    disabled: { control: 'boolean' },
    min: { control: 'text' },
    max: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {
  args: {
    value: '2024-01-15T10:00:00.000Z',
    onChange: (v) => console.log('Changed:', v),
  },
};

export const Empty: Story = {
  args: {
    value: '',
    onChange: (v) => console.log('Changed:', v),
  },
};

export const WithError: Story = {
  args: {
    value: '2024-01-15T10:00:00.000Z',
    error: 'La fecha debe ser anterior a hoy',
    onChange: (v) => console.log('Changed:', v),
  },
};

export const Disabled: Story = {
  args: {
    value: '2024-01-15T10:00:00.000Z',
    disabled: true,
    onChange: (v) => console.log('Changed:', v),
  },
};

export const WithMinMax: Story = {
  args: {
    value: '2024-06-15T10:00:00.000Z',
    min: '2024-01-01T00:00:00.000Z',
    max: '2024-12-31T23:59:59.000Z',
    onChange: (v) => console.log('Changed:', v),
  },
};

export const PastDate: Story = {
  args: {
    value: '2023-12-15T10:00:00.000Z',
    onChange: (v) => console.log('Changed:', v),
  },
};
