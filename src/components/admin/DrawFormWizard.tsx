import { useReducer, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { ChevronLeft, ChevronRight, Check, AlertCircle, X, Loader2 } from 'lucide-react';
import { NumberInputField } from './NumberInputField';
import {
  MODALITY_ORDER,
  MODALITY_LABELS,
  type Modality,
  type CreateDrawInput,
  type UpdateDrawInput,
  CreateDrawSchema,
  UpdateDrawSchema,
} from '../../lib/schemas';

export interface DrawFormWizardProps {
  initialData?: Partial<CreateDrawInput>;
  isEditing?: boolean;
  drawId?: string;
  onSubmit: (data: CreateDrawInput | UpdateDrawInput) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

interface StepState {
  modality: Modality;
  numbers: (number | null)[];
  errors: string[];
  isValid: boolean;
}

interface WizardState {
  currentStep: number;
  steps: StepState[];
  officialNumber: string;
  drawDate: string;
  officialNumberError: string;
  drawDateError: string;
  submitError: string | null;
}

type WizardAction =
  | { type: 'SET_NUMBER'; step: number; index: number; value: number | null }
  | { type: 'SET_OFFICIAL_NUMBER'; value: string }
  | { type: 'SET_DRAW_DATE'; value: string }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'GO_TO_STEP'; step: number }
  | { type: 'SET_SUBMIT_ERROR'; error: string | null }
  | { type: 'RESET'; initialData?: Partial<CreateDrawInput> };

const initialStepState: StepState = {
  modality: 'TRADICIONAL',
  numbers: [null, null, null, null, null, null],
  errors: [],
  isValid: false,
};

function validateStep(numbers: (number | null)[]): { isValid: boolean; errors: string[] } {
  const filled = numbers.filter((n): n is number => n !== null);
  const errors: string[] = [];

  if (filled.length !== 6) {
    errors.push('Debe seleccionar exactamente 6 números');
  } else {
    const unique = new Set(filled);
    if (unique.size !== 6) {
      errors.push('Los números no pueden repetirse');
    }
    const outOfRange = filled.some((n) => n < 0 || n > 45);
    if (outOfRange) {
      errors.push('Los números deben estar entre 0 y 45');
    }
  }

  return { isValid: errors.length === 0, errors };
}

function reducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case 'SET_NUMBER': {
      const newSteps = [...state.steps];
      const step = newSteps[action.step];
      if (!step) return state;
      const newNumbers = [...step.numbers];
      newNumbers[action.index] = action.value;

      const { isValid, errors } = validateStep(newNumbers);

      newSteps[action.step] = {
        ...step,
        numbers: newNumbers,
        isValid,
        errors,
      };

      return { ...state, steps: newSteps };
    }

    case 'SET_OFFICIAL_NUMBER': {
      const num = parseInt(action.value, 10);
      const officialNumberError =
        action.value && (isNaN(num) || num <= 0) ? 'El número oficial debe ser positivo' : '';
      return { ...state, officialNumber: action.value, officialNumberError };
    }

    case 'SET_DRAW_DATE': {
      const drawDateError = action.value && isNaN(Date.parse(action.value)) ? 'Fecha inválida' : '';
      return { ...state, drawDate: action.value, drawDateError };
    }

    case 'NEXT_STEP': {
      const currentStep = state.steps[state.currentStep];
      if (state.currentStep < 3 && currentStep?.isValid) {
        return { ...state, currentStep: state.currentStep + 1 };
      }
      return state;
    }

    case 'PREV_STEP': {
      if (state.currentStep > 0) {
        return { ...state, currentStep: state.currentStep - 1 };
      }
      return state;
    }

    case 'GO_TO_STEP': {
      if (action.step >= 0 && action.step <= 3) {
        return { ...state, currentStep: action.step };
      }
      return state;
    }

    case 'SET_SUBMIT_ERROR': {
      return { ...state, submitError: action.error };
    }

    case 'RESET': {
      const steps = MODALITY_ORDER.map((modality) => {
        const existingResult = action.initialData?.results?.find((r) => r.modality === modality);
        const numbers = existingResult
          ? existingResult.numbers.map((n) => n ?? null)
          : [null, null, null, null, null, null];
        const { isValid, errors } = validateStep(numbers);
        return {
          ...initialStepState,
          modality,
          numbers,
          isValid,
          errors,
        };
      });

      return {
        currentStep: 0,
        steps,
        officialNumber: action.initialData?.officialNumber?.toString() ?? '',
        drawDate: action.initialData?.drawDate ?? '',
        officialNumberError: '',
        drawDateError: '',
        submitError: null,
      };
    }

    default:
      return state;
  }
}

function getInitialState(initialData?: Partial<CreateDrawInput>): WizardState {
  const steps = MODALITY_ORDER.map((modality) => {
    const existingResult = initialData?.results?.find((r) => r.modality === modality);
    const numbers = existingResult
      ? existingResult.numbers.map((n) => n ?? null)
      : [null, null, null, null, null, null];
    const { isValid, errors } = validateStep(numbers);
    return {
      ...initialStepState,
      modality,
      numbers,
      isValid,
      errors,
    };
  });

  return {
    currentStep: 0,
    steps,
    officialNumber: initialData?.officialNumber?.toString() ?? '',
    drawDate: initialData?.drawDate ?? '',
    officialNumberError: '',
    drawDateError: '',
    submitError: null,
  };
}

export function DrawFormWizard({
  initialData,
  isEditing = false,
  drawId,
  onSubmit,
  onCancel,
  isLoading = false,
}: DrawFormWizardProps) {
  const [state, dispatch] = useReducer(reducer, initialData, getInitialState);

  // Fetch initial data when editing and drawId is provided
  useEffect(() => {
    if (isEditing && drawId && !initialData) {
      fetch(`/api/admin/draws/${drawId}`, { credentials: 'include' })
        .then(async (res) => {
          if (!res.ok) return null;
          const json: unknown = await res.json();
          // Type narrowing for the response data
          const isValidData =
            json !== null &&
            typeof json === 'object' &&
            'officialNumber' in json &&
            typeof (json as Record<string, unknown>).officialNumber === 'number' &&
            'drawDate' in json &&
            typeof (json as Record<string, unknown>).drawDate === 'string' &&
            'results' in json &&
            Array.isArray((json as Record<string, unknown>).results);
          return isValidData ? json : null;
        })
        .then((data) => {
          if (data) {
            const typedData = data as {
              officialNumber: number;
              drawDate: string;
              results: { modality: string; numbers: (number | null)[] }[];
            };
            const results = typedData.results.map((r) => ({
              modality: r.modality as Modality,
              numbers: r.numbers.filter((n): n is number => n !== null),
            }));
            dispatch({
              type: 'RESET',
              initialData: {
                officialNumber: typedData.officialNumber,
                drawDate: typedData.drawDate,
                results,
              },
            });
          }
        })
        .catch((err) => console.error('Failed to fetch draw data:', err));
    }
  }, [isEditing, drawId, initialData]);

  const currentStepData = state.steps[state.currentStep] ?? initialStepState;
  const isLastStep = state.currentStep === 3;
  const isFirstStep = state.currentStep === 0;
  const canGoNext = currentStepData.isValid;
  const allStepsValid = state.steps.every((s) => s.isValid);
  const hasOfficialNumber = state.officialNumber.trim() !== '';
  const hasDrawDate = state.drawDate.trim() !== '';
  const canSubmit =
    allStepsValid &&
    hasOfficialNumber &&
    hasDrawDate &&
    !state.officialNumberError &&
    !state.drawDateError;

  const handleNumberChange = (index: number, value: number | null) => {
    dispatch({ type: 'SET_NUMBER', step: state.currentStep, index, value });
  };

  const handleOfficialNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_OFFICIAL_NUMBER', value: e.target.value });
  };

  const handleDrawDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_DRAW_DATE', value: e.target.value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit || isLoading) return;

    dispatch({ type: 'SET_SUBMIT_ERROR', error: null });

    const results = state.steps.map((step) => ({
      modality: step.modality,
      numbers: step.numbers.filter((n): n is number => n !== null),
    }));

    const payload = {
      officialNumber: parseInt(state.officialNumber, 10),
      drawDate: state.drawDate,
      results,
    };

    const schema = isEditing ? UpdateDrawSchema : CreateDrawSchema;
    const result = schema.safeParse(payload);

    if (!result.success) {
      dispatch({
        type: 'SET_SUBMIT_ERROR',
        error: result.error.errors.map((e) => e.message).join(', '),
      });
      return;
    }

    onSubmit(payload).catch((error: unknown) => {
      dispatch({
        type: 'SET_SUBMIT_ERROR',
        error: error instanceof Error ? error.message : 'Error al guardar el sorteo',
      });
    });
  };

  const stepIndicators = MODALITY_ORDER.map((modality, index) => {
    const step = state.steps[index];
    const isComplete = step?.isValid ?? false;
    const isCurrent = index === state.currentStep;

    return (
      <div key={modality} className="flex flex-col items-center">
        <div
          className={`flex size-10 items-center justify-center rounded-full text-sm font-semibold transition-all ${
            isComplete
              ? 'bg-primary-500 text-white'
              : isCurrent
                ? 'bg-primary-500/20 border-2 border-primary-500 text-primary-500'
                : 'border-2 border-border bg-surface text-text-muted'
          }`}
        >
          {isComplete ? <Check className="size-5" aria-hidden="true" /> : index + 1}
        </div>
        <span
          className={`mt-1 text-center text-xs font-medium ${isCurrent ? 'text-primary-500' : 'text-text-muted'}`}
        >
          {MODALITY_LABELS[modality]}
        </span>
        <div
          className={`mt-1 h-1 w-20 transition-colors ${index < 3 ? (step?.isValid ? 'bg-primary-500' : 'bg-border') : ''}`}
        />
      </div>
    );
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div
        className="mb-4 flex flex-col items-center gap-2"
        role="progressbar"
        aria-valuenow={state.currentStep + 1}
        aria-valuemin={1}
        aria-valuemax={4}
        aria-label="Progreso del asistente"
      >
        <div className="flex items-center gap-2">{stepIndicators}</div>
        <p className="text-sm text-text-secondary">
          Paso {state.currentStep + 1} de 4: {MODALITY_LABELS[currentStepData.modality]}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label
            htmlFor="official-number"
            className="mb-1 block text-sm font-medium text-text-secondary"
          >
            Número Oficial *
          </label>
          <input
            type="number"
            id="official-number"
            value={state.officialNumber}
            onChange={handleOfficialNumberChange}
            min="1"
            required
            disabled={isLoading}
            className={`w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-text-primary placeholder-text-muted transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50 ${
              state.officialNumberError ? 'border-error-500 focus:ring-error-500' : ''
            }`}
            aria-invalid={!!state.officialNumberError}
            aria-describedby={state.officialNumberError ? 'official-number-error' : undefined}
          />
          {state.officialNumberError && (
            <p id="official-number-error" className="mt-1 text-sm text-error-500" role="alert">
              {state.officialNumberError}
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="draw-date" className="mb-1 block text-sm font-medium text-text-secondary">
            Fecha del Sorteo *
          </label>
          <input
            type="datetime-local"
            id="draw-date"
            value={state.drawDate}
            onChange={handleDrawDateChange}
            required
            disabled={isLoading}
            className={`w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-text-primary placeholder-text-muted transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50 ${
              state.drawDateError ? 'border-error-500 focus:ring-error-500' : ''
            }`}
            aria-invalid={!!state.drawDateError}
            aria-describedby={state.drawDateError ? 'draw-date-error' : undefined}
          />
          {state.drawDateError && (
            <p id="draw-date-error" className="mt-1 text-sm text-error-500" role="alert">
              {state.drawDateError}
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <fieldset className="space-y-3">
            <legend className="text-sm font-medium text-text-secondary">
              {MODALITY_LABELS[currentStepData.modality]} - 6 números (0-45, sin repetir)
            </legend>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {currentStepData.numbers.map((number, index) => (
                <NumberInputField
                  key={index}
                  value={number}
                  onChange={(value) => handleNumberChange(index, value)}
                  min={0}
                  max={45}
                  placeholder={`${index + 1}`}
                  disabled={isLoading}
                  error={currentStepData.errors.length > 0}
                  ariaLabel={`Número ${index + 1} de ${MODALITY_LABELS[currentStepData.modality]}`}
                  ariaDescribedBy={
                    currentStepData.errors.length > 0
                      ? `${currentStepData.modality}-errors`
                      : undefined
                  }
                />
              ))}
            </div>
            {currentStepData.errors.length > 0 && (
              <p
                id={`${currentStepData.modality}-errors`}
                className="text-sm text-error-500"
                role="alert"
              >
                {currentStepData.errors.join('. ')}
              </p>
            )}
          </fieldset>
        </div>
      </div>

      {state.submitError && (
        <div
          className="bg-error-500/10 border-error-500/20 flex items-center gap-2 rounded-lg border p-3 text-error-500"
          role="alert"
        >
          <AlertCircle className="size-5 flex-shrink-0" aria-hidden="true" />
          <span className="text-sm">{state.submitError}</span>
        </div>
      )}

      <div className="flex items-center justify-between border-t border-border pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-text-secondary transition-colors hover:bg-surface hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          <X className="size-4" aria-hidden="true" />
          <span>Cancelar</span>
        </button>

        <div className="flex items-center gap-3">
          {!isFirstStep && (
            <button
              type="button"
              onClick={() => dispatch({ type: 'PREV_STEP' })}
              disabled={isLoading}
              className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-text-secondary transition-colors hover:bg-surface hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
              <span>Anterior</span>
            </button>
          )}

          {isLastStep ? (
            <button
              type="submit"
              disabled={!canSubmit || isLoading}
              className="hover:bg-primary-500/90 flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2.5 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <span>{isEditing ? 'Actualizar' : 'Crear'}</span>
                  <ChevronRight className="size-4" aria-hidden="true" />
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => dispatch({ type: 'NEXT_STEP' })}
              disabled={!canGoNext || isLoading}
              className="hover:bg-primary-500/90 flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2.5 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span>Siguiente</span>
              <ChevronRight className="size-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
