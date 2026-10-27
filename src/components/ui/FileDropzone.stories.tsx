import type { Meta, StoryObj } from '@storybook/react';
import { FileDropzone } from './FileDropzone';

const meta: Meta<typeof FileDropzone> = {
  title: 'Admin/Import/FileDropzone',
  component: FileDropzone,
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
    accept: { control: 'text', description: 'Tipos de archivo permitidos' },
    maxSize: { control: 'number', description: 'Tamaño máximo en bytes' },
    disabled: { control: 'boolean', description: 'Deshabilita el componente' },
    onFileSelected: { action: 'fileSelected' },
    onError: { action: 'error' },
  },
};

export default meta;
type Story = StoryObj<typeof FileDropzone>;

export const Default: Story = {
  args: {
    accept: '.csv,.xlsx',
    maxSize: 10 * 1024 * 1024,
  },
};

export const Disabled: Story = {
  args: {
    accept: '.csv,.xlsx',
    maxSize: 10 * 1024 * 1024,
    disabled: true,
  },
};

export const WithFileSelected: Story = {
  args: {
    accept: '.csv,.xlsx',
    maxSize: 10 * 1024 * 1024,
  },
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input[type="file"]') as HTMLInputElement;
    if (input) {
      const file = new File(['test'], 'test.csv', { type: 'text/csv' });
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      input.files = dataTransfer.files;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
  },
};

export const ErrorState: Story = {
  args: {
    accept: '.csv,.xlsx',
    maxSize: 100,
    onError: (error: string) => console.log('Error:', error),
  },
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input[type="file"]') as HTMLInputElement;
    if (input) {
      const file = new File(['x'.repeat(200)], 'large.csv', { type: 'text/csv' });
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      input.files = dataTransfer.files;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
  },
};

export const FocusState: Story = {
  args: {
    accept: '.csv,.xlsx',
    maxSize: 10 * 1024 * 1024,
  },
};