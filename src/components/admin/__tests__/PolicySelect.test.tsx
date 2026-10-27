import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PolicySelect } from '../PolicySelect';
import type { ImportPolicy } from '@/lib/schemas';

describe('PolicySelect', () => {
  let onChange: ReturnType<typeof vi.fn>;
  const defaultProps = {
    value: 'skip' as ImportPolicy,
    validCount: 5,
  };

  beforeEach(() => {
    onChange = vi.fn();
  });

  it('renders all three policy options', () => {
    render(<PolicySelect {...defaultProps} onChange={onChange} />);

    expect(screen.getByText('Omitir duplicados')).toBeInTheDocument();
    expect(screen.getByText('Reemplazar')).toBeInTheDocument();
    expect(screen.getByText('Fusionar')).toBeInTheDocument();
  });

  it('renders descriptions for each option', () => {
    render(<PolicySelect {...defaultProps} onChange={onChange} />);

    expect(
      screen.getByText(
        'Mantiene los sorteos existentes, ignora los nuevos que coincidan en fecha y modalidad'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText('Elimina los sorteos existentes y crea nuevos con los datos importados')
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Actualiza sorteos existentes y crea nuevos, combinando números si es posible'
      )
    ).toBeInTheDocument();
  });

  it('shows selected policy as highlighted', () => {
    render(<PolicySelect {...defaultProps} onChange={onChange} />);

    const skipOption = screen.getByText('Omitir duplicados').closest('label');
    expect(skipOption).toHaveClass('border-primary-500');
    expect(skipOption).toHaveClass('bg-primary-50');
  });

  it('calls onChange when a different option is selected', () => {
    render(<PolicySelect {...defaultProps} onChange={onChange} />);

    const replaceOption = screen.getByText('Reemplazar').closest('label');
    fireEvent.click(replaceOption!.querySelector('input')!);

    expect(onChange).toHaveBeenCalledWith('replace');
  });

  it('does not call onChange when clicking already selected option', () => {
    render(<PolicySelect {...defaultProps} onChange={onChange} />);

    const skipOption = screen.getByText('Omitir duplicados').closest('label');
    fireEvent.click(skipOption!.querySelector('input')!);

    expect(onChange).not.toHaveBeenCalled();
  });

  it('disables all options when disabled prop is true', () => {
    render(<PolicySelect {...defaultProps} onChange={onChange} disabled={true} />);

    const inputs = screen.getAllByRole('radio');
    inputs.forEach((input) => {
      expect(input).toBeDisabled();
    });
  });

  it('disables all options when validCount is 0', () => {
    render(<PolicySelect {...defaultProps} onChange={onChange} validCount={0} />);

    const inputs = screen.getAllByRole('radio');
    inputs.forEach((input) => {
      expect(input).toBeDisabled();
    });
  });

  it('shows helper text when validCount is 0', () => {
    render(<PolicySelect {...defaultProps} onChange={onChange} validCount={0} />);

    expect(
      screen.getByText(
        'Seleccione una política después de validar el archivo (mínimo 1 fila válida)'
      )
    ).toBeInTheDocument();
  });

  it('does not show helper text when validCount > 0', () => {
    render(<PolicySelect {...defaultProps} onChange={onChange} validCount={1} />);

    expect(
      screen.queryByText('Seleccione una política después de validar el archivo')
    ).not.toBeInTheDocument();
  });

  it('does not call onChange when disabled and clicked', () => {
    render(<PolicySelect {...defaultProps} onChange={onChange} disabled={true} />);

    const replaceOption = screen.getByText('Reemplazar').closest('label');
    fireEvent.click(replaceOption!.querySelector('input')!);

    expect(onChange).not.toHaveBeenCalled();
  });

  it('does not call onChange when validCount is 0 and clicked', () => {
    render(<PolicySelect {...defaultProps} onChange={onChange} validCount={0} />);

    const replaceOption = screen.getByText('Reemplazar').closest('label');
    fireEvent.click(replaceOption!.querySelector('input')!);

    expect(onChange).not.toHaveBeenCalled();
  });

  it('has correct aria attributes', () => {
    render(<PolicySelect {...defaultProps} onChange={onChange} />);

    const fieldset = screen.getByRole('radiogroup');
    expect(fieldset).toBeInTheDocument();

    const legend = screen.getByText('Política de conflicto');
    expect(legend).toBeInTheDocument();
  });

  it('each radio has aria-describedby pointing to description', () => {
    render(<PolicySelect {...defaultProps} onChange={onChange} />);

    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(3);

    expect(radios[0]).toHaveAttribute('aria-describedby', 'skip-description');
    expect(radios[1]).toHaveAttribute('aria-describedby', 'replace-description');
    expect(radios[2]).toHaveAttribute('aria-describedby', 'merge-description');
  });

  it('applies correct visual state for each policy', () => {
    const { rerender } = render(<PolicySelect {...defaultProps} onChange={onChange} />);

    // skip selected
    expect(screen.getByText('Omitir duplicados').closest('label')).toHaveClass(
      'border-primary-500'
    );

    // replace selected
    rerender(<PolicySelect {...defaultProps} onChange={onChange} value="replace" />);
    expect(screen.getByText('Reemplazar').closest('label')).toHaveClass('border-primary-500');
    expect(screen.getByText('Omitir duplicados').closest('label')).not.toHaveClass(
      'border-primary-500'
    );

    // merge selected
    rerender(<PolicySelect {...defaultProps} onChange={onChange} value="merge" />);
    expect(screen.getByText('Fusionar').closest('label')).toHaveClass('border-primary-500');
    expect(screen.getByText('Reemplazar').closest('label')).not.toHaveClass('border-primary-500');
  });

  it('applies custom aria-describedby to fieldset', () => {
    render(<PolicySelect {...defaultProps} onChange={onChange} aria-describedby="custom-desc" />);

    const fieldset = screen.getByRole('radiogroup').parentElement!;
    expect(fieldset).toHaveAttribute('aria-describedby', 'custom-desc');
  });
});
