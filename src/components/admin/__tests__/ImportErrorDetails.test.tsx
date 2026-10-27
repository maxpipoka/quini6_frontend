import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ImportErrorDetails } from '../ImportErrorDetails';
import type { ImportErrorDetail } from '@/lib/schemas';

vi.mock('@/lib/api/client', () => ({
  getApiClient: vi.fn(),
}));

import { getApiClient } from '@/lib/api/client';
import type { ImportErrorsResponse } from '@/lib/schemas';

const mockErrors: ImportErrorDetail[] = [
  {
    rowNumber: 5,
    field: 'numbers',
    message: 'Invalid number format: expected 6 numbers',
    rawValue: '1,2,3,4,5',
  },
  {
    rowNumber: 10,
    field: 'drawDate',
    message: 'Invalid date format',
    rawValue: '2024-13-45',
  },
  {
    rowNumber: 15,
    field: 'modality',
    message: 'Unknown modality: "TRADICIONAL"',
    rawValue: 'TRADICIONAL',
  },
];

describe('ImportErrorDetails', () => {
  const mockApi = {
    getImportErrors: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getApiClient).mockReturnValue(mockApi as unknown as ReturnType<typeof getApiClient>);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders button with "Sin errores" when no errors', async () => {
    mockApi.getImportErrors.mockResolvedValue({ errors: [] });

    render(<ImportErrorDetails importId="import-1" />);

    const button = screen.getByRole('button', { name: 'Sin errores' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-success/10');
    expect(button).toHaveClass('text-success');
  });

  it('initially shows "Sin errores" before fetch', () => {
    mockApi.getImportErrors.mockResolvedValue({ errors: mockErrors });

    render(<ImportErrorDetails importId="import-1" />);

    const button = screen.getByRole('button', { name: 'Sin errores' });
    expect(button).toBeInTheDocument();
  });

  it('shows loading spinner while fetching errors', async () => {
    let resolveFn: (value: ImportErrorsResponse) => void;
    mockApi.getImportErrors.mockImplementation(
      () =>
        new Promise<ImportErrorsResponse>((resolve) => {
          resolveFn = resolve;
        })
    );

    render(<ImportErrorDetails importId="import-1" />);

    // Click to expand - this triggers fetch
    fireEvent.click(screen.getByRole('button', { name: 'Sin errores' }));

    // Should show loading state (button becomes disabled with loading spinner)
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Cargando detalles...' })).toBeInTheDocument();
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    // Resolve the promise
    resolveFn!({ errors: mockErrors });
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('opens modal dialog when expanded and has errors', async () => {
    mockApi.getImportErrors.mockResolvedValue({ errors: mockErrors });

    render(<ImportErrorDetails importId="import-1" />);

    fireEvent.click(screen.getByRole('button', { name: 'Sin errores' }));

    await waitFor(() => {
      expect(
        screen.getByRole('dialog', { name: 'Detalles de errores - 3 errores' })
      ).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(mockApi.getImportErrors).toHaveBeenCalledWith('import-1');
    });
  });

  it('closes modal when close button clicked', async () => {
    mockApi.getImportErrors.mockResolvedValue({ errors: mockErrors });

    render(<ImportErrorDetails importId="import-1" />);

    fireEvent.click(screen.getByRole('button', { name: 'Sin errores' }));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Cerrar' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes modal when backdrop clicked', async () => {
    mockApi.getImportErrors.mockResolvedValue({ errors: mockErrors });

    render(<ImportErrorDetails importId="import-1" />);

    fireEvent.click(screen.getByRole('button', { name: 'Sin errores' }));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Click on backdrop (the overlay div)
    const backdrop = screen.getByTestId('modal-backdrop');
    fireEvent.click(backdrop);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('displays error details correctly in modal', async () => {
    mockApi.getImportErrors.mockResolvedValue({ errors: mockErrors });

    render(<ImportErrorDetails importId="import-1" />);

    fireEvent.click(screen.getByRole('button', { name: 'Sin errores' }));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('Fila 5')).toBeInTheDocument();
      expect(screen.getByText('Números')).toBeInTheDocument();
      expect(screen.getByText('Invalid number format: expected 6 numbers')).toBeInTheDocument();
      expect(screen.getByText('"1,2,3,4,5"')).toBeInTheDocument();
    });
  });

  it('formats field names correctly', async () => {
    const errorsWithAllFields: ImportErrorDetail[] = [
      { rowNumber: 1, field: 'officialNumber', message: 'Error', rawValue: 'test' },
      { rowNumber: 2, field: 'drawDate', message: 'Error', rawValue: 'test' },
      { rowNumber: 3, field: 'modality', message: 'Error', rawValue: 'test' },
      { rowNumber: 4, field: 'numbers', message: 'Error', rawValue: 'test' },
      { rowNumber: 5, field: 'reintegro', message: 'Error', rawValue: 'test' },
      { rowNumber: 6, field: 'unknownField', message: 'Error', rawValue: 'test' },
    ];

    mockApi.getImportErrors.mockResolvedValue({ errors: errorsWithAllFields });

    render(<ImportErrorDetails importId="import-1" />);

    fireEvent.click(screen.getByRole('button', { name: 'Sin errores' }));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('Nº Oficial')).toBeInTheDocument();
      expect(screen.getByText('Fecha del sorteo')).toBeInTheDocument();
      expect(screen.getByText('Modalidad')).toBeInTheDocument();
      expect(screen.getByText('Números')).toBeInTheDocument();
      expect(screen.getByText('Reintegro')).toBeInTheDocument();
      expect(screen.getByText('unknownField')).toBeInTheDocument();
    });
  });

  it('shows raw value when present', async () => {
    mockApi.getImportErrors.mockResolvedValue({ errors: mockErrors });

    render(<ImportErrorDetails importId="import-1" />);

    fireEvent.click(screen.getByRole('button', { name: 'Sin errores' }));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getAllByText('Valor original:')).toHaveLength(3);
      expect(screen.getByText('"1,2,3,4,5"')).toBeInTheDocument();
      expect(screen.getByText('"2024-13-45"')).toBeInTheDocument();
      expect(screen.getByText('"TRADICIONAL"')).toBeInTheDocument();
    });
  });

  it('does not show raw value section when rawValue is null/undefined', async () => {
    const errorsWithoutRawValue: ImportErrorDetail[] = [
      { rowNumber: 1, field: 'numbers', message: 'Error', rawValue: null },
      { rowNumber: 2, field: 'drawDate', message: 'Error', rawValue: undefined },
    ];

    mockApi.getImportErrors.mockResolvedValue({ errors: errorsWithoutRawValue });

    render(<ImportErrorDetails importId="import-1" />);

    fireEvent.click(screen.getByRole('button', { name: 'Sin errores' }));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.queryByText('Valor original:')).not.toBeInTheDocument();
    });
  });

  it('shows button but no dialog when fetch fails (no errors to display)', async () => {
    mockApi.getImportErrors.mockRejectedValue(new Error('Network error'));

    render(<ImportErrorDetails importId="import-1" />);

    fireEvent.click(screen.getByRole('button', { name: 'Sin errores' }));

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Ocultar detalles de errores' })
      ).toBeInTheDocument();
    });

    // No dialog should appear because there are no actual errors to display
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('toggles expanded state when button clicked', async () => {
    mockApi.getImportErrors.mockResolvedValue({ errors: mockErrors });

    render(<ImportErrorDetails importId="import-1" />);

    const button = screen.getByRole('button', { name: 'Sin errores' });
    expect(button).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Ocultar detalles de errores' })).toHaveAttribute(
        'aria-expanded',
        'true'
      );
    });

    fireEvent.click(screen.getByRole('button', { name: 'Ocultar detalles de errores' }));

    expect(screen.getByRole('button', { name: 'Ver detalles de errores' })).toHaveAttribute(
      'aria-expanded',
      'false'
    );
  });

  it('does not refetch errors on subsequent expansions', async () => {
    mockApi.getImportErrors.mockResolvedValue({ errors: mockErrors });

    render(<ImportErrorDetails importId="import-1" />);

    fireEvent.click(screen.getByRole('button', { name: 'Sin errores' }));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Cerrar' }));

    expect(mockApi.getImportErrors).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole('button', { name: 'Ver detalles de errores' }));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    expect(mockApi.getImportErrors).toHaveBeenCalledTimes(1);
  });

  it('shows singular "error" for single error', async () => {
    mockApi.getImportErrors.mockResolvedValue({ errors: [mockErrors[0]] });

    render(<ImportErrorDetails importId="import-1" />);

    fireEvent.click(screen.getByRole('button', { name: 'Sin errores' }));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    expect(screen.getByText('1 error')).toBeInTheDocument();
  });

  it('has correct aria attributes on modal', async () => {
    mockApi.getImportErrors.mockResolvedValue({ errors: mockErrors });

    render(<ImportErrorDetails importId="import-1" />);

    fireEvent.click(screen.getByRole('button', { name: 'Sin errores' }));

    await waitFor(() => {
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(dialog).toHaveAttribute('aria-labelledby', 'error-details-title');
    });
  });

  it('renders ChevronUpIcon when expanded, ChevronDownIcon when collapsed', async () => {
    mockApi.getImportErrors.mockResolvedValue({ errors: mockErrors });

    render(<ImportErrorDetails importId="import-1" />);

    // Initially collapsed - should show ChevronDownIcon
    expect(screen.getByTestId('chevron-down-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('chevron-up-icon')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Sin errores' }));

    await waitFor(() => {
      expect(screen.getByTestId('chevron-up-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('chevron-down-icon')).not.toBeInTheDocument();
    });
  });
});
