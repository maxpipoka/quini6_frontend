import type { Meta, StoryObj } from '@storybook/react';
import { Progress } from '../ui/Progress';

const meta: Meta<typeof Progress> = {
  title: 'UI/Progress',
  component: Progress,
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
    value: { control: 'number', description: 'Valor del progreso (0-100), undefined para indeterminado' },
    stage: {
      control: 'select',
      options: ['processing', 'committing', 'completed', 'error'],
      description: 'Etapa actual',
    },
    label: { control: 'text', description: 'Etiqueta personalizada' },
    showPercentage: { control: 'boolean', description: 'Mostrar porcentaje' },
    'aria-live': {
      control: 'select',
      options: ['polite', 'assertive'],
      description: 'Modo aria-live',
    },
    className: { control: 'text', description: 'Clases CSS adicionales' },
  },
};

export default meta;
type Story = StoryObj<typeof Progress>;

export const Default: Story = {
  args: {
    stage: 'processing',
    value: 45,
  },
};

export const Partial: Story = {
  args: {
    stage: 'committing',
    value: 75,
  },
};

export const Complete: Story = {
  args: {
    stage: 'completed',
    value: 100,
  },
};

export const Indeterminate: Story = {
  args: {
    stage: 'processing',
    value: undefined,
  },
};

export const Error: Story = {
  args: {
    stage: 'error',
    value: 0,
  },
};

export const WithCustomLabel: Story = {
  args: {
    stage: 'processing',
    value: 60,
    label: 'Cargando datos del sorteo...',
  },
};

export const WithoutPercentage: Story = {
  args: {
    stage: 'completed',
    value: 100,
    showPercentage: false,
  },
};