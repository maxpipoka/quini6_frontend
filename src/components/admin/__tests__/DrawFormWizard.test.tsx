import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DrawFormWizard } from '../DrawFormWizard';
import { MODALITY_ORDER, MODALITY_LABELS, type Modality } from '@/lib/schemas';

const mockOnSubmit = vi.fn();
const mockOnCancel = vi.fn();
const user = userEvent.setup();

const renderWizard = (props = {}) => {
  return render(
    <DrawFormWizard
      onSubmit={mockOnSubmit}
      onCancel={mockOnCancel}
      isLoading={false}
      {...props}
    />
  );
};

function getSubmitButton() {
  return screen.getByRole('button', { name: /^(Crear|Actualizar|Guardando)$/i });
}

async function waitForStep(expectedStep: number) {
  console.log('waitForStep: waiting for step', expectedStep);
  await waitFor(() => {
    const progress = screen.getByRole('progressbar');
    const current = progress.getAttribute('aria-valuenow');
    console.log('waitForStep: current step is', current);
    expect(progress).toHaveAttribute('aria-valuenow', String(expectedStep));
  });
  console.log('waitForStep: reached step', expectedStep);
}

async function fillCurrentStepNumbers(startNumber: number, isLastStep = false) {
  const inputs = screen.getAllByRole('spinbutton');
  const inputElements = inputs as HTMLInputElement[];
  console.log('fillCurrentStepNumbers: found', inputElements.length, 'spinbuttons');
  for (let i = 0; i < 6; i++) {
    const value = String(startNumber + i);
    await act(async () => {
      fireEvent.change(inputElements[i + 1]!, { target: { value } });
    });
  }
  if (!isLastStep) {
    console.log('fillCurrentStepNumbers: waiting for next button to be enabled');
    await waitFor(() => {
      const nextBtn = screen.getByRole('button', { name: 'Siguiente' });
      const disabled = nextBtn.hasAttribute('disabled');
      console.log('fillCurrentStepNumbers: next button disabled =', disabled);
      expect(nextBtn).not.toBeDisabled();
    });
    console.log('fillCurrentStepNumbers: next button enabled');
  }
}

async function clickNextAndWaitForStep(expectedStep: number) {
  console.log('clickNextAndWaitForStep: clicking next, expecting step', expectedStep);
  const nextBtn = screen.getByRole('button', { name: 'Siguiente' });
  await act(async () => {
    fireEvent.click(nextBtn);
  });
  await waitForStep(expectedStep);
  console.log('clickNextAndWaitForStep: reached step', expectedStep);
}

describe('DrawFormWizard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockOnSubmit.mockReset();
    mockOnCancel.mockReset();
  });

  describe('Reducer logic (via component interaction)', () => {
    it('initializes with 4 steps for each modality', () => {
      renderWizard();

      MODALITY_ORDER.forEach((modality) => {
        expect(screen.getByText(MODALITY_LABELS[modality])).toBeInTheDocument();
      });

      expect(screen.getByText('Paso 1 de 4: Tradicional')).toBeInTheDocument();
    });

    it('validates official number and draw date', async () => {
      renderWizard();

      // Fill step 1 (Tradicional)
      await fillCurrentStepNumbers(1);
      await clickNextAndWaitForStep(2);

      // Fill step 2 (La Segunda)
      await fillCurrentStepNumbers(7);
      await clickNextAndWaitForStep(3);

      // Fill step 3 (Revancha)
      await fillCurrentStepNumbers(13);
      await clickNextAndWaitForStep(4);

      // Fill step 4 (Siempre Sale) - last step, no "Siguiente" button
      await fillCurrentStepNumbers(19, true);

      // Fill official number and date
      fireEvent.change(screen.getByLabelText('Número Oficial *'), { target: { value: '123' } });
      fireEvent.change(screen.getByLabelText('Fecha del Sorteo *'), { target: { value: '2024-01-15T20:00' } });

      const submitBtn = getSubmitButton();
      expect(submitBtn).not.toBeDisabled();
    });

    it('validates 6 unique numbers per step', async () => {
      renderWizard();

      // Fill only 5 numbers in step 1
      const inputs = screen.getAllByRole('spinbutton');
      const inputElements = inputs as HTMLInputElement[];
      for (let i = 0; i < 5; i++) {
        await user.type(inputElements[i + 1]!, String(i + 1));
      }

      const nextBtn = screen.getByRole('button', { name: 'Siguiente' });
      expect(nextBtn).toBeDisabled();

      // Fill 6th number (inputs[6] since inputs[0] is official number, inputs[1-6] are the 6 number fields)
      await user.type(inputElements[6]!, '6');
      expect(nextBtn).not.toBeDisabled();
    });

    it('prevents duplicate numbers in same step', async () => {
      renderWizard();

      const inputs = screen.getAllByRole('spinbutton');
      const inputElements = inputs as HTMLInputElement[];
      // Fill all 6 fields first, then create a duplicate
      // Type 1-5 in first 5 fields
      for (let i = 0; i < 5; i++) {
        await user.type(inputElements[i + 1]!, String(i + 1));
      }
      // Fill 6th field with '5' (duplicate of first field)
      await user.type(inputElements[6]!, '5');

      // Error should appear in the step error container (by role alert)
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(/Los números no pueden repetirse/);
      });

      const nextBtn = screen.getByRole('button', { name: 'Siguiente' });
      expect(nextBtn).toBeDisabled();
    });

    it('sets aria-invalid on out-of-range number input', async () => {
      renderWizard();

      const inputs = screen.getAllByRole('spinbutton');
      const inputElements = inputs as HTMLInputElement[];
      // Fill 5 valid numbers (inputs[1-6] are the step's number fields)
      for (let i = 0; i < 5; i++) {
        await user.type(inputElements[i + 1]!, String(i + 1));
      }
      // Fill 6th with an invalid number using fireEvent
      fireEvent.change(inputElements[6]!, { target: { value: '99' } });

      // The input should have aria-invalid="true" due to validation error
      await waitFor(() => {
        expect(inputs[6]).toHaveAttribute('aria-invalid', 'true');
      });

      const nextBtn = screen.getByRole('button', { name: 'Siguiente' });
      expect(nextBtn).toBeDisabled();
    });

    it('navigates to next step when valid', async () => {
      renderWizard();

      const inputs = screen.getAllByRole('spinbutton');
      const inputElements = inputs as HTMLInputElement[];
      for (let i = 0; i < 6; i++) {
        await user.type(inputElements[i + 1]!, String(i + 1));
      }

      await clickNextAndWaitForStep(2);

      expect(screen.getByText(/Paso 2 de 4/)).toBeInTheDocument();
    });

    it('navigates back to previous step', async () => {
      renderWizard();

      const inputs = screen.getAllByRole('spinbutton');
      const inputElements = inputs as HTMLInputElement[];
      for (let i = 0; i < 6; i++) {
        await user.type(inputElements[i + 1]!, String(i + 1));
      }

      await clickNextAndWaitForStep(2);
      await user.click(screen.getByRole('button', { name: 'Anterior' }));
      await waitForStep(1);
    });

    it('shows error for invalid official number', async () => {
      renderWizard();

      // Fill all 4 steps
      await fillCurrentStepNumbers(1);
      await clickNextAndWaitForStep(2);
      await fillCurrentStepNumbers(7);
      await clickNextAndWaitForStep(3);
      await fillCurrentStepNumbers(13);
      await clickNextAndWaitForStep(4);
      await fillCurrentStepNumbers(19, true);

      fireEvent.change(screen.getByLabelText('Número Oficial *'), { target: { value: '0' } });

      await waitFor(() => {
        expect(screen.getByText('El número oficial debe ser positivo')).toBeInTheDocument();
      });

      const submitBtn = getSubmitButton();
      expect(submitBtn).toBeDisabled();
    });

    it('shows error for invalid draw date', async () => {
      renderWizard();

      // Fill all 4 steps
      await fillCurrentStepNumbers(1);
      await clickNextAndWaitForStep(2);
      await fillCurrentStepNumbers(7);
      await clickNextAndWaitForStep(3);
      await fillCurrentStepNumbers(13);
      await clickNextAndWaitForStep(4);
      await fillCurrentStepNumbers(19, true);

      fireEvent.change(screen.getByLabelText('Número Oficial *'), { target: { value: '123' } });

      const drawDateInput = screen.getByLabelText('Fecha del Sorteo *');
      // Use a value that passes schema validation (valid ISO format) but fails Date.parse (NaN)
      // Month 13 is invalid - Date.parse returns NaN
      await act(async () => {
        Object.defineProperty(drawDateInput, 'value', { value: '2024-13-45T99:99:99', writable: true });
        drawDateInput.dispatchEvent(new Event('input', { bubbles: true }));
        drawDateInput.dispatchEvent(new Event('change', { bubbles: true }));
      });

      await waitFor(() => {
        expect(drawDateInput).toHaveAttribute('aria-invalid', 'true');
      });

      const submitBtn = getSubmitButton();
      expect(submitBtn).toBeDisabled();
    });

    it('calls onCancel when cancel button clicked', async () => {
      renderWizard();

      await user.click(screen.getByText('Cancelar'));

      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });

    it('disables buttons when isLoading', async () => {
      renderWizard({ isLoading: true });

      const nextBtn = screen.getByRole('button', { name: 'Siguiente' });
      const cancelBtn = screen.getByRole('button', { name: 'Cancelar' });
      expect(nextBtn).toBeDisabled();
      expect(cancelBtn).toBeDisabled();
    });

    it('shows submit error when onSubmit throws', async () => {
      mockOnSubmit.mockRejectedValueOnce(new Error('Server error'));

      renderWizard();

      // Fill all 4 steps
      await fillCurrentStepNumbers(1);
      await clickNextAndWaitForStep(2);
      await fillCurrentStepNumbers(7);
      await clickNextAndWaitForStep(3);
      await fillCurrentStepNumbers(13);
      await clickNextAndWaitForStep(4);
      await fillCurrentStepNumbers(19, true);

fireEvent.change(screen.getByLabelText('Número Oficial *'), { target: { value: '123' } });
      // Set draw date directly on input element using native event
      await act(async () => {
        const dateInput = screen.getByLabelText('Fecha del Sorteo *') as HTMLInputElement;
        Object.defineProperty(dateInput, 'value', { value: '2024-01-15T20:00:00Z', writable: true });
        dateInput.dispatchEvent(new Event('input', { bubbles: true }));
        dateInput.dispatchEvent(new Event('change', { bubbles: true }));
      });

      // Debug: check form state
      console.log('Official number input value:', (screen.getByLabelText('Número Oficial *') as HTMLInputElement).value);
      console.log('Draw date input value:', (screen.getByLabelText('Fecha del Sorteo *') as HTMLInputElement).value);

      // Debug: check submit button state
      const submitBtn = getSubmitButton();
      console.log('Submit button disabled:', submitBtn.hasAttribute('disabled'));

      // Use userEvent.click for proper form submission
      await user.click(submitBtn);

      // Check if onSubmit was called
      console.log('onSubmit called:', mockOnSubmit.mock.calls.length);
      console.log('onSubmit args:', mockOnSubmit.mock.calls);

      // The error message is rendered in a div with role="alert"
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('Server error');
      });
    });

    it('uses isEditing mode and shows Actualizar button', async () => {
      renderWizard({ isEditing: true });

      // Fill all 4 steps
      await fillCurrentStepNumbers(1);
      await clickNextAndWaitForStep(2);
      await fillCurrentStepNumbers(7);
      await clickNextAndWaitForStep(3);
      await fillCurrentStepNumbers(13);
      await clickNextAndWaitForStep(4);
      await fillCurrentStepNumbers(19, true);

      fireEvent.change(screen.getByLabelText('Número Oficial *'), { target: { value: '123' } });
      fireEvent.change(screen.getByLabelText('Fecha del Sorteo *'), { target: { value: '2024-01-15T20:00' } });

      // Check that submit button has "Actualizar" text
      const submitBtn = getSubmitButton();
      expect(submitBtn).toHaveTextContent('Actualizar');
    });

    it('pre-fills data from initialData prop', async () => {
      const initialData = {
        officialNumber: 999,
        drawDate: '2024-06-15T20:00',
        results: [
          { modality: 'TRADICIONAL' as Modality, numbers: [1, 2, 3, 4, 5, 6] },
          { modality: 'LA_SEGUNDA' as Modality, numbers: [7, 8, 9, 10, 11, 12] },
          { modality: 'REVANCHA' as Modality, numbers: [13, 14, 15, 16, 17, 18] },
          { modality: 'SIEMPRE_SALE' as Modality, numbers: [19, 20, 21, 22, 23, 24] },
        ],
      };

      renderWizard({ initialData });

      // Official number is a string in the component state
      const officialNumberInput = screen.getByLabelText('Número Oficial *');
      expect(officialNumberInput).toHaveValue(999);
      expect(screen.getByLabelText('Fecha del Sorteo *')).toHaveValue('2024-06-15T20:00');

      // Check first step numbers - skip the official number input (also a spinbutton)
      const inputs = screen.getAllByRole('spinbutton');
      // inputs[0] is the official number, inputs[1-6] are the 6 number fields for Tradicional
      for (let i = 0; i < 6; i++) {
        expect(inputs[i + 1]).toHaveValue(i + 1);
      }
    });
  });
});