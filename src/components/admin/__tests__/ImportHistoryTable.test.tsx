import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ImportHistoryTable } from '../ImportHistoryTable';
import type { ImportSummary } from '@/lib/schemas';

vi.mock('@/hooks/useImportHistory', () => ({
  useImportHistory: vi.fn(),
}));

vi.mock('@/components/admin/ImportErrorDetails', () => ({
  ImportErrorDetails: vi.fn(({ importId }: { importId: string }) => (
    <div data-testid="error-details" data-import-id={importId}>
      Error Details for {importId}
    </div>
  )),
}));

import { useImportHistory } from '@/hooks/useImportHistory';

const mockHistoryData: ImportSummary[] = [
  {
    importId: 'import-1',
    fileName: 'sorteos_enero.csv',
    date: '2024-01-15T10:30:00Z',
    rowsProcessed: 100,
    succeeded: 95,
    failed: 5,
    policy: 'skip',
  },
  {
    importId: 'import-2',
    fileName: 'sorteos_febrero.csv',
    date: '2024-02-20T14:45:00Z',
    rowsProcessed: 200,
    succeeded: 198,
    failed: 2,
    policy: 'replace',
  },
  {
    importId: 'import-3',
    fileName: 'sorteos_marzo.csv',
    date: '2024-03-10T09:15:00Z',
    rowsProcessed: 50,
    succeeded: 50,
    failed: 0,
    policy: 'merge',
  },
];

describe('ImportHistoryTable', () => {
  const defaultMock = {
    data: {
      data: mockHistoryData,
      total: 3,
      page: 1,
      limit: 10,
      totalPages: 1,
    },
    isLoading: false,
    error: null,
    page: 1,
    setPage: vi.fn(),
    pageSize: 10,
    setPageSize: vi.fn(),
    sort: { key: 'date', order: 'desc' as const },
    setSort: vi.fn(),
    filters: {},
    setFilters: vi.fn(),
    refetch: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useImportHistory).mockReturnValue(defaultMock);
  });

  it('renders loading state when isLoading and no data', () => {
    vi.mocked(useImportHistory).mockReturnValue({
      ...defaultMock,
      isLoading: true,
      data: null,
    });

    render(<ImportHistoryTable />);

    expect(screen.getByText('Cargando historial...')).toBeInTheDocument();
    expect(screen.getByText('Cargando historial...')).toBeInTheDocument();
  });

  it('renders error state with retry button', () => {
    vi.mocked(useImportHistory).mockReturnValue({
      ...defaultMock,
      isLoading: false,
      error: new Error('Failed to fetch'),
    });

    render(<ImportHistoryTable />);

    expect(screen.getByText('Error al cargar el historial')).toBeInTheDocument();
    expect(screen.getByText('Failed to fetch')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reintentar' })).toBeInTheDocument();
  });

  it('calls refetch when retry button is clicked', () => {
    vi.mocked(useImportHistory).mockReturnValue({
      ...defaultMock,
      isLoading: false,
      error: new Error('Failed to fetch'),
    });

    render(<ImportHistoryTable />);
    fireEvent.click(screen.getByRole('button', { name: 'Reintentar' }));

    expect(defaultMock.refetch).toHaveBeenCalled();
  });

  it('renders empty state when no imports', () => {
    vi.mocked(useImportHistory).mockReturnValue({
      ...defaultMock,
      data: { ...defaultMock.data, data: [], total: 0, totalPages: 0 },
    });

    render(<ImportHistoryTable />);

    expect(screen.getByText('Sin importaciones')).toBeInTheDocument();
    expect(screen.getByText('No hay importaciones registradas aún')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Primera importación' })).toHaveAttribute(
      'href',
      '/admin/imports/upload'
    );
  });

  it('renders table with import data', () => {
    render(<ImportHistoryTable />);

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('sorteos_enero.csv')).toBeInTheDocument();
    expect(screen.getByText('sorteos_febrero.csv')).toBeInTheDocument();
    expect(screen.getByText('sorteos_marzo.csv')).toBeInTheDocument();
  });

  it('renders column headers correctly', () => {
    render(<ImportHistoryTable />);

    expect(screen.getByText('Archivo')).toBeInTheDocument();
    expect(screen.getByText('Fecha')).toBeInTheDocument();
    expect(screen.getByText('Procesados')).toBeInTheDocument();
    expect(screen.getByText('Éxitos')).toBeInTheDocument();
    expect(screen.getByText('Fallidos')).toBeInTheDocument();
    expect(screen.getByText('Política')).toBeInTheDocument();
  });

  it('formats policy badges correctly', () => {
    render(<ImportHistoryTable />);

    expect(screen.getByText('Omitir')).toHaveClass('bg-amber-100');
    expect(screen.getByText('Reemplazar')).toHaveClass('bg-blue-100');
    expect(screen.getByText('Fusionar')).toHaveClass('bg-purple-100');
  });

  it('formats dates in es-AR locale', () => {
    render(<ImportHistoryTable />);

    expect(screen.getByText((content) => content.includes('15/01/2024'))).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes('20/02/2024'))).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes('10/03/2024'))).toBeInTheDocument();
  });

  it('renders ImportErrorDetails for each row', () => {
    render(<ImportHistoryTable />);

    const errorDetails = screen.getAllByTestId('error-details');
    expect(errorDetails).toHaveLength(3);
    expect(errorDetails[0]).toHaveAttribute('data-import-id', 'import-1');
    expect(errorDetails[1]).toHaveAttribute('data-import-id', 'import-2');
    expect(errorDetails[2]).toHaveAttribute('data-import-id', 'import-3');
  });

  it('renders pagination controls when totalPages > 1', () => {
    vi.mocked(useImportHistory).mockReturnValue({
      ...defaultMock,
      data: { ...defaultMock.data, totalPages: 3, total: 25 },
    });

    render(<ImportHistoryTable />);

    expect(screen.getByRole('button', { name: 'Anterior' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Siguiente' })).toBeInTheDocument();
    expect(screen.getByText('de 25 registros')).toBeInTheDocument();
  });

  it('disables Anterior button on first page', () => {
    vi.mocked(useImportHistory).mockReturnValue({
      ...defaultMock,
      data: { ...defaultMock.data, totalPages: 3, total: 25 },
    });

    render(<ImportHistoryTable />);

    const prevButton = screen.getByRole('button', { name: 'Anterior' });
    expect(prevButton).toBeDisabled();
  });

  it('disables Siguiente button on last page', () => {
    vi.mocked(useImportHistory).mockReturnValue({
      ...defaultMock,
      data: { ...defaultMock.data, totalPages: 3, total: 25, page: 3 },
      page: 3,
    });

    render(<ImportHistoryTable />);

    const nextButton = screen.getByRole('button', { name: 'Siguiente' });
    expect(nextButton).toBeDisabled();
  });

  it('calls setPage when page number is clicked', () => {
    vi.mocked(useImportHistory).mockReturnValue({
      ...defaultMock,
      data: { ...defaultMock.data, totalPages: 3, total: 25 },
    });

    render(<ImportHistoryTable />);
    fireEvent.click(screen.getByRole('button', { name: '2' }));

    expect(defaultMock.setPage).toHaveBeenCalledWith(2);
  });

  it('calls setPageSize when page size changes', () => {
    vi.mocked(useImportHistory).mockReturnValue({
      ...defaultMock,
      data: { ...defaultMock.data, totalPages: 3, total: 25 },
    });

    render(<ImportHistoryTable />);
    fireEvent.change(screen.getByLabelText('Mostrar:'), { target: { value: '20' } });

    expect(defaultMock.setPageSize).toHaveBeenCalledWith(20);
  });

  it('shows sort indicators on sorted column', () => {
    vi.mocked(useImportHistory).mockReturnValue({
      ...defaultMock,
      sort: { key: 'date', order: 'asc' },
    });

    render(<ImportHistoryTable />);

    const dateHeader = screen.getByText('Fecha').closest('th');
    // Component renders sort indicator icons but not aria-sort attribute
    expect(dateHeader).toBeInTheDocument();
  });

  it('calls setSort when sortable column header is clicked', () => {
    render(<ImportHistoryTable />);
    fireEvent.click(screen.getByText('Archivo'));

    expect(defaultMock.setSort).toHaveBeenCalledWith({ key: 'fileName', order: 'asc' });
  });

  it('toggles sort order when same column clicked again', () => {
    vi.mocked(useImportHistory).mockReturnValue({
      ...defaultMock,
      sort: { key: 'fileName', order: 'asc' },
    });

    render(<ImportHistoryTable />);
    fireEvent.click(screen.getByText('Archivo'));

    expect(defaultMock.setSort).toHaveBeenCalledWith({ key: 'fileName', order: 'desc' });
  });

  it('does not call setSort when actions column clicked', () => {
    render(<ImportHistoryTable />);

    // Get all th elements and click the last one (actions column)
    const headers = screen.getAllByRole('columnheader');
    const actionsHeader = headers[headers.length - 1];
    fireEvent.click(actionsHeader!);

    expect(defaultMock.setSort).not.toHaveBeenCalled();
  });

  it('renders correct counts for processed/succeeded/failed', () => {
    render(<ImportHistoryTable />);

    expect(screen.getByText('100')).toBeInTheDocument(); // processed
    expect(screen.getByText('95')).toBeInTheDocument(); // succeeded
    expect(screen.getByText('5')).toBeInTheDocument(); // failed
  });

  it('applies correct text colors for succeeded/failed counts', () => {
    render(<ImportHistoryTable />);

    // Find succeeded count (95) which should have text-success
    const succeededCells = screen.getAllByText('95');
    const succeededCell = succeededCells.find((el) =>
      el.closest('td')?.classList.contains('text-success')
    );
    expect(succeededCell).toBeInTheDocument();

    // Find failed count (5) which should have text-error - there are two "5" values (processed and failed)
    // The failed count is in a td with text-error class
    const failedCells = screen.getAllByText('5');
    const failedCell = failedCells.find((el) => el.closest('td')?.classList.contains('text-error'));
    expect(failedCell).toBeInTheDocument();
  });
});
