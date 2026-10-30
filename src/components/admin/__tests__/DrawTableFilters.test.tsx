import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DrawTableFilters } from '../DrawTableFilters';

describe('DrawTableFilters', () => {
  const mockOnFilterChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockOnFilterChange.mockReset();
  });

  const renderFilters = (props = {}) => {
    return render(
      <DrawTableFilters onFilterChange={mockOnFilterChange} isLoading={false} {...props} />
    );
  };

  it('renders date inputs and modality select', () => {
    renderFilters();

    expect(screen.getByLabelText('Fecha desde')).toBeInTheDocument();
    expect(screen.getByLabelText('Fecha hasta')).toBeInTheDocument();
    expect(screen.getByLabelText('Modalidad')).toBeInTheDocument();
  });

  it('shows "Todas" as default modality option', () => {
    renderFilters();

    const _select = screen.getByLabelText('Modalidad');
    expect(_select).toHaveValue('');
  });

  it('shows all modalities in select', () => {
    renderFilters();

    screen.getByLabelText('Modalidad');
    expect(screen.getByRole('option', { name: 'Todas' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Tradicional' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'La segunda' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Revancha' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Siempre sale' })).toBeInTheDocument();
  });

  it('calls onFilterChange when start date changes', async () => {
    renderFilters();

    fireEvent.change(screen.getByLabelText('Fecha desde'), { target: { value: '2024-01-01' } });

    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenCalledWith(
        expect.objectContaining({ startDate: '2024-01-01' })
      );
    });
  });

  it('calls onFilterChange when end date changes', async () => {
    renderFilters();

    fireEvent.change(screen.getByLabelText('Fecha hasta'), { target: { value: '2024-12-31' } });

    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenCalledWith(
        expect.objectContaining({ endDate: '2024-12-31' })
      );
    });
  });

  it('calls onFilterChange when modality changes', async () => {
    renderFilters();

    fireEvent.change(screen.getByLabelText('Modalidad'), { target: { value: 'TRADICIONAL' } });

    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenCalledWith(
        expect.objectContaining({ modality: 'TRADICIONAL' })
      );
    });
  });

  it('shows clear button when filters are active', async () => {
    renderFilters();

    fireEvent.change(screen.getByLabelText('Fecha desde'), { target: { value: '2024-01-01' } });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Limpiar filtros' })).toBeInTheDocument();
    });
  });

  it('hides clear button when no filters active', () => {
    renderFilters();

    expect(screen.queryByRole('button', { name: 'Limpiar filtros' })).not.toBeInTheDocument();
  });

  it('clears all filters when clear button clicked', async () => {
    renderFilters();

    fireEvent.change(screen.getByLabelText('Fecha desde'), { target: { value: '2024-01-01' } });
    fireEvent.change(screen.getByLabelText('Modalidad'), { target: { value: 'TRADICIONAL' } });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Limpiar filtros' })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Limpiar filtros' }));

    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenCalledWith({
        startDate: '',
        endDate: '',
        modality: '',
      });
      expect(screen.queryByRole('button', { name: 'Limpiar filtros' })).not.toBeInTheDocument();
    });
  });

  it('uses initialFilters prop', () => {
    renderFilters({
      initialFilters: {
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        modality: 'REVANCHA',
      },
    });

    expect(screen.getByLabelText('Fecha desde')).toHaveValue('2024-01-01');
    expect(screen.getByLabelText('Fecha hasta')).toHaveValue('2024-12-31');
    expect(screen.getByLabelText('Modalidad')).toHaveValue('REVANCHA');
  });

  it('disables inputs when isLoading', () => {
    renderFilters({ isLoading: true });

    expect(screen.getByLabelText('Fecha desde')).toBeDisabled();
    expect(screen.getByLabelText('Fecha hasta')).toBeDisabled();
    expect(screen.getByLabelText('Modalidad')).toBeDisabled();
  });

  it('calls onFilterChange on mount with initial filters', () => {
    renderFilters({
      initialFilters: {
        startDate: '2024-01-01',
      },
    });

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      startDate: '2024-01-01',
      endDate: '',
      modality: '',
    });
  });
});
