import type { Meta, StoryObj } from '@storybook/react';
import { ImportPreviewTable } from './ImportPreviewTable';
import type { ImportPreviewRow } from '@/lib/schemas';

const meta: Meta<typeof ImportPreviewTable> = {
  title: 'Admin/Import/ImportPreviewTable',
  component: ImportPreviewTable,
  parameters: {
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: true }],
      },
    },
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    rows: { control: 'object', description: 'Array de filas de preview' },
    onRowSelect: { action: 'rowSelect' },
    selectedRows: { control: 'object', description: 'Set de índices seleccionados' },
  },
};

export default meta;
type Story = StoryObj<typeof ImportPreviewTable>;

const sampleRows: ImportPreviewRow[] = [
  {
    rowNumber: 1,
    date: '2024-01-15',
    modality: 'Tradicional',
    tradicional: ['05', '12', '23', '34', '41', '45'],
    laSegunda: null,
    revancha: null,
    siempreSale: null,
    reintegro: 7,
    isValid: true,
    errors: [],
  },
  {
    rowNumber: 2,
    date: '2024-01-22',
    modality: 'La Segunda',
    tradicional: null,
    laSegunda: ['03', '18', '27', '31', '39', '44'],
    revancha: null,
    siempreSale: null,
    reintegro: 2,
    isValid: true,
    errors: [],
  },
  {
    rowNumber: 3,
    date: '2024-01-29',
    modality: 'Revancha',
    tradicional: null,
    laSegunda: null,
    revancha: ['01', '14', '26', '33', '40', '43'],
    siempreSale: null,
    reintegro: 9,
    isValid: false,
    errors: [
      { field: 'date', message: 'Fecha inválida', rawValue: '2024-01-29' },
      { field: 'reintegro', message: 'Reintegro fuera de rango', rawValue: 9 },
    ],
  },
];

export const Default: Story = {
  args: {
    rows: sampleRows,
  },
};

export const Empty: Story = {
  args: {
    rows: [],
  },
};

export const AllInvalid: Story = {
  args: {
    rows: [
      {
        rowNumber: 1,
        date: 'invalid',
        modality: 'Tradicional',
        tradicional: ['05', '12'],
        laSegunda: null,
        revancha: null,
        siempreSale: null,
        reintegro: 99,
        isValid: false,
        errors: [
          { field: 'date', message: 'Formato de fecha inválido', rawValue: 'invalid' },
          { field: 'tradicional', message: 'Se requieren 6 números', rawValue: '05, 12' },
          { field: 'reintegro', message: 'Debe ser entre 0-9', rawValue: 99 },
        ],
      },
    ],
  },
};

export const WithSelection: Story = {
  args: {
    rows: sampleRows,
    selectedRows: new Set([0, 1]),
  },
};

export const Loading: Story = {
  args: {
    rows: [],
  },
  decorators: [
    (Story) => (
      <div className="relative">
        <Story />
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-neutral-900/80">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      </div>
    ),
  ],
};