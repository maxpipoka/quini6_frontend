// eslint-disable-next-line storybook/no-renderer-packages
import type { Meta, StoryObj } from '@storybook/react';
import { ImportProgress } from './ImportProgress';
import type { ImportProgressStage as _ImportProgressStage } from '@/lib/schemas';

const meta: Meta<typeof ImportProgress> = {
  title: 'Admin/Import/ImportProgress',
  component: ImportProgress,
  parameters: {
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: true }],
      },
    },
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    importId: { control: 'text', description: 'ID de la importación' },
    stage: {
      control: 'select',
      options: ['processing', 'committing', 'completed'],
      description: 'Etapa actual del progreso',
    },
    progress: { control: 'number', description: 'Porcentaje de progreso (0-100)' },
    onComplete: { action: 'complete' },
    onError: { action: 'error' },
    pollInterval: { control: 'number', description: 'Intervalo de polling en ms' },
  },
};

export default meta;
type Story = StoryObj<typeof ImportProgress>;

export const Default: Story = {
  args: {
    importId: 'imp_abc123def456',
    stage: 'processing',
    progress: 35,
  },
};

export const Processing: Story = {
  args: {
    importId: 'imp_abc123def456',
    stage: 'processing',
    progress: 45,
  },
};

export const Committing: Story = {
  args: {
    importId: 'imp_abc123def456',
    stage: 'committing',
    progress: 75,
  },
};

export const Success: Story = {
  args: {
    importId: 'imp_abc123def456',
    stage: 'completed',
    progress: 100,
  },
};

export const Error: Story = {
  args: {
    importId: 'imp_abc123def456',
    stage: 'processing',
    progress: 50,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              setTimeout(() => {
                const event = new CustomEvent('import-error', { detail: new Error('Error de conexión') });
                document.dispatchEvent(event);
              }, 1000);
            `,
          }}
        />
      </div>
    ),
  ],
};
