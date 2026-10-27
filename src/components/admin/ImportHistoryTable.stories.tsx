import type { Meta, StoryObj } from '@storybook/react';
import { ImportHistoryTable } from './ImportHistoryTable';

const meta: Meta<typeof ImportHistoryTable> = {
  title: 'Admin/Import/ImportHistoryTable',
  component: ImportHistoryTable,
  parameters: {
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: true }],
      },
    },
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '100%', minWidth: '800px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ImportHistoryTable>;

export const Default: Story = {};

export const Empty: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: '100%', minWidth: '800px' }}>
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    // The empty state is handled by the component when data is empty
  },
};

export const Loading: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: '100%', minWidth: '800px' }}>
        <Story />
      </div>
    ),
  ],
};

export const WithData: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: '100%', minWidth: '800px' }}>
        <Story />
      </div>
    ),
  ],
};

export const WithPagination: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: '100%', minWidth: '800px' }}>
        <Story />
      </div>
    ),
  ],
};

export const ErrorState: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: '100%', minWidth: '800px' }}>
        <Story />
      </div>
    ),
  ],
};