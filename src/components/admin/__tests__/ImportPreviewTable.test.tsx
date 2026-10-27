import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ImportPreviewTable } from '../ImportPreviewTable';
import type { ImportPreviewRow } from '@/lib/schemas';

const createMockRows = (count: number): ImportPreviewRow[] => {
  return Array.from({ length: count }, (_, i) => ({
    rowNumber: i + 1,
    date: '2024-01-15',
    modality: 'TRADICIONAL',
    tradicional: [1, 2, 3, 4, 5, 6],
    laSegunda: [7, 8, 9, 10, 11, 12],
    revancha: [13, 14, 15, 16, 17, 18],
    siempreSale: [19, 20, 21, 22, 23, 24],
    reintegro: 25,
    isValid: true,
    errors: [],
  }));
};

describe('ImportPreviewTable', () => {
  let mockRows: ImportPreviewRow[];
  let onRowSelect: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockRows = createMockRows(5);
    onRowSelect = vi.fn();
  });

  it('renders table with correct column headers', () => {
    render(<ImportPreviewTable rows={mockRows} onRowSelect={onRowSelect} />);

    expect(screen.getByText('Seleccionar')).toBeInTheDocument();
    expect(screen.getByText('N°')).toBeInTheDocument();
    expect(screen.getByText('Fecha')).toBeInTheDocument();
    expect(screen.getByText('Modalidad')).toBeInTheDocument();
    expect(screen.getByText('Tradicional')).toBeInTheDocument();
    expect(screen.getByText('La Segunda')).toBeInTheDocument();
    expect(screen.getByText('Revancha')).toBeInTheDocument();
    expect(screen.getByText('Siempre Sale')).toBeInTheDocument();
    expect(screen.getByText('Reintegro')).toBeInTheDocument();
    expect(screen.getByText('Estado')).toBeInTheDocument();
  });

  it('renders all rows with correct data', () => {
    render(<ImportPreviewTable rows={mockRows} onRowSelect={onRowSelect} />);

    // Check that rows are rendered (at least 5 data rows)
    const rowNumberCells = screen.getAllByText((_, element) => {
      const text = element?.textContent?.trim() ?? '';
      return /^\d+$/.test(text) && element?.tagName === 'TD';
    });
    expect(rowNumberCells.length).toBeGreaterThanOrEqual(5);

    // Check each row's data appears at least 5 times
    expect(screen.getAllByText('2024-01-15').length).toBeGreaterThanOrEqual(5);
    expect(screen.getAllByText('TRADICIONAL').length).toBeGreaterThanOrEqual(5);
    expect(screen.getAllByText('1 - 2 - 3 - 4 - 5 - 6').length).toBeGreaterThanOrEqual(5);
    expect(screen.getAllByText('25').length).toBeGreaterThanOrEqual(5);
  });

  it('shows valid status badge for valid rows', () => {
    render(<ImportPreviewTable rows={mockRows} onRowSelect={onRowSelect} />);

    expect(screen.getAllByText('Válido')).toHaveLength(5);
  });

  it('shows invalid status badge for invalid rows', () => {
    const invalidRows: ImportPreviewRow[] = [
      {
        ...mockRows[0]!,
        isValid: false,
        errors: [{ rowNumber: 1, field: 'date', message: 'Invalid date', rawValue: 'invalid' }],
      },
    ];
    render(<ImportPreviewTable rows={invalidRows} onRowSelect={onRowSelect} />);

    expect(screen.getByText('Inválido')).toBeInTheDocument();
  });

  it('calls onRowSelect when checkbox is clicked', () => {
    render(<ImportPreviewTable rows={mockRows} onRowSelect={onRowSelect} />);

    const checkbox = screen.getAllByRole('checkbox')[1]!; // First row checkbox
    fireEvent.click(checkbox);

    expect(onRowSelect).toHaveBeenCalledWith(0, true);
  });

  it('disables checkbox for invalid rows', () => {
    const invalidRows: ImportPreviewRow[] = [
      {
        ...mockRows[0]!,
        isValid: false,
        errors: [{ rowNumber: 1, field: 'date', message: 'Invalid date', rawValue: 'invalid' }],
      },
    ];
    render(<ImportPreviewTable rows={invalidRows} onRowSelect={onRowSelect} />);

    const checkbox = screen.getAllByRole('checkbox')[1]!;
    expect(checkbox).toBeDisabled();
  });

  it('select all checkbox selects all valid rows', () => {
    render(<ImportPreviewTable rows={mockRows} onRowSelect={onRowSelect} />);

    const selectAllCheckbox = screen.getAllByRole('checkbox')[0]!;
    fireEvent.click(selectAllCheckbox);

    expect(onRowSelect).toHaveBeenCalledTimes(5);
  });

  it('does not select invalid rows when using select all', () => {
    const mixedRows: ImportPreviewRow[] = [
      { ...mockRows[0]!, isValid: true, errors: [] },
      {
        ...mockRows[1]!,
        isValid: false,
        errors: [{ rowNumber: 2, field: 'date', message: 'Invalid', rawValue: null }],
      },
    ];
    render(<ImportPreviewTable rows={mixedRows} onRowSelect={onRowSelect} />);

    const selectAllCheckbox = screen.getAllByRole('checkbox')[0]!;
    fireEvent.click(selectAllCheckbox);

    expect(onRowSelect).toHaveBeenCalledTimes(1);
    expect(onRowSelect).toHaveBeenCalledWith(0, true);
  });

  it('expands row to show errors when expand button is clicked', () => {
    const rowsWithErrors: ImportPreviewRow[] = [
      {
        ...mockRows[0]!,
        errors: [
          { rowNumber: 1, field: 'date', message: 'Invalid date format', rawValue: 'not-a-date' },
          { rowNumber: 1, field: 'numbers', message: 'Duplicate numbers', rawValue: '1,1,2,3,4,5' },
        ],
      },
    ];
    render(<ImportPreviewTable rows={rowsWithErrors} onRowSelect={onRowSelect} />);

    const expandButton = screen.getByLabelText('Expandir detalles');
    fireEvent.click(expandButton);

    expect(screen.getByText('Errores en fila 1:')).toBeInTheDocument();
    // Use flexible matchers since text is broken across elements
    expect(
      screen.getByText(
        (content) => content.includes('date') && content.includes('Invalid date format')
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        (content) => content.includes('numbers') && content.includes('Duplicate numbers')
      )
    ).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes('not-a-date'))).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes('1,1,2,3,4,5'))).toBeInTheDocument();
  });

  it('collapses row when expand button is clicked again', () => {
    const rowsWithErrors: ImportPreviewRow[] = [
      {
        ...mockRows[0]!,
        errors: [{ rowNumber: 1, field: 'date', message: 'Invalid date', rawValue: 'invalid' }],
      },
    ];
    render(<ImportPreviewTable rows={rowsWithErrors} onRowSelect={onRowSelect} />);

    const expandButton = screen.getByLabelText('Expandir detalles');
    fireEvent.click(expandButton);
    expect(screen.getByText('Errores en fila 1:')).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('Contraer detalles'));
    expect(screen.queryByText('Errores en fila 1:')).not.toBeInTheDocument();
  });

  it('sorts rows by column when header is clicked', () => {
    const unsortedRows: ImportPreviewRow[] = [
      { ...mockRows[0]!, rowNumber: 3, date: '2024-01-20' },
      { ...mockRows[1]!, rowNumber: 1, date: '2024-01-10' },
      { ...mockRows[2]!, rowNumber: 2, date: '2024-01-15' },
    ];
    render(<ImportPreviewTable rows={unsortedRows} onRowSelect={onRowSelect} />);

    const dateHeader = screen.getByText('Fecha');
    fireEvent.click(dateHeader);

    // After sorting by date asc, the dates should be in order
    const dateCells = screen.getAllByText((_, element) => {
      const text = element?.textContent?.trim() ?? '';
      return /^\d{4}-\d{2}-\d{2}$/.test(text) && element?.tagName === 'TD';
    });
    expect(dateCells[0]).toHaveTextContent('2024-01-10');
    expect(dateCells[1]).toHaveTextContent('2024-01-15');
    expect(dateCells[2]).toHaveTextContent('2024-01-20');
  });

  it('sorts descending on second click of same column', () => {
    const unsortedRows: ImportPreviewRow[] = [
      { ...mockRows[0]!, rowNumber: 1, date: '2024-01-10' },
      { ...mockRows[1]!, rowNumber: 2, date: '2024-01-15' },
      { ...mockRows[2]!, rowNumber: 3, date: '2024-01-20' },
    ];
    render(<ImportPreviewTable rows={unsortedRows} onRowSelect={onRowSelect} />);

    const dateHeader = screen.getByText('Fecha');
    fireEvent.click(dateHeader); // asc
    fireEvent.click(dateHeader); // desc

    const dateCells = screen.getAllByText((_, element) => {
      const text = element?.textContent?.trim() ?? '';
      return /^\d{4}-\d{2}-\d{2}$/.test(text) && element?.tagName === 'TD';
    });
    expect(dateCells[0]).toHaveTextContent('2024-01-20');
    expect(dateCells[1]).toHaveTextContent('2024-01-15');
    expect(dateCells[2]).toHaveTextContent('2024-01-10');
  });

  it('shows empty state when no rows', () => {
    render(<ImportPreviewTable rows={[]} onRowSelect={onRowSelect} />);

    expect(screen.getByText('No hay datos para mostrar')).toBeInTheDocument();
  });

  it('passes selectedRows to checkbox checked state', () => {
    const selectedRows = new Set([0, 2]);
    render(
      <ImportPreviewTable rows={mockRows} onRowSelect={onRowSelect} selectedRows={selectedRows} />
    );

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes[1]).toBeChecked(); // row 0
    expect(checkboxes[2]).not.toBeChecked(); // row 1
    expect(checkboxes[3]).toBeChecked(); // row 2
  });

  it('renders horizontal scroll wrapper', () => {
    render(<ImportPreviewTable rows={mockRows} onRowSelect={onRowSelect} />);

    const wrapper = screen.getByRole('grid').parentElement;
    expect(wrapper).toHaveClass('overflow-x-auto');
  });
});
