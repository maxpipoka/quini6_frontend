import React, { useState, useEffect, useCallback } from 'react';
import { formatDrawNumber } from '../../lib/schemas';

// ============================================================================
// Types
// ============================================================================

export interface NumberInputProps {
  value: (number | null)[];
  onChange: (value: number[]) => void;
  error?: string;
  disabled?: boolean;
  autoAdvance?: boolean;
}

interface NumberFieldProps {
  index: number;
  value: string;
  onChange: (index: number, value: string) => void;
  onBlur: (index: number) => void;
  error: string;
  disabled: boolean;
  autoAdvance: boolean;
}

// ============================================================================
// Validation
// ============================================================================

function validateNumber(value: string): string | undefined {
  if (value === '') return undefined;
  const num = parseInt(value, 10);
  if (isNaN(num)) return 'Debe ser un número';
  if (num < 0 || num > 45) return 'Debe estar entre 0 y 45';
  return undefined;
}

function validateUniqueNumbers(numbers: number[]): string | undefined {
  const unique = new Set(numbers);
  if (unique.size !== numbers.length) return 'Los números no pueden repetirse';
  return undefined;
}

// ============================================================================
// NumberField Component
// ============================================================================

function NumberField(props: NumberFieldProps) {
  const { index, value, onChange, onBlur, error, disabled, autoAdvance } = props;
  const displayError = error ?? '';
  const [localValue, setLocalValue] = useState(value);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Sync with props
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    // Only allow digits
    if (!/^\d*$/.test(newValue)) return;

    // Limit to 2 digits
    if (newValue.length > 2) return;

    setLocalValue(newValue);
    onChange(index, newValue);

    // Auto-advance on 2 digits
    if (autoAdvance && newValue.length === 2) {
      const nextInput = document.querySelector(`[data-number-index="${index + 1}"]`);
      (nextInput as HTMLInputElement | null)?.focus();
    }
  };

  const handleBlur = () => {
    onBlur(index);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow backspace to go back
    if (e.key === 'Backspace' && localValue === '' && index > 0) {
      const prevInput = document.querySelector(`[data-number-index="${index - 1}"]`);
      (prevInput as HTMLInputElement | null)?.focus();
    }

    // Allow arrow keys for navigation
    if (e.key === 'ArrowRight' && index < 5) {
      const nextInput = document.querySelector(`[data-number-index="${index + 1}"]`);
      (nextInput as HTMLInputElement | null)?.focus();
    }

    if (e.key === 'ArrowLeft' && index > 0) {
      const prevInput = document.querySelector(`[data-number-index="${index - 1}"]`);
      (prevInput as HTMLInputElement | null)?.focus();
    }
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        maxLength={2}
        aria-label={`Número ${index + 1}`}
        data-number-index={index}
        className={`
          w-full rounded-lg
          border bg-surface p-2
          text-center text-heading-md font-semibold text-text-primary
          placeholder-text-muted transition-colors
          duration-150 focus:outline-none
          focus-visible:ring-2 focus-visible:ring-offset-0
          disabled:cursor-not-allowed disabled:bg-neutral-50
          disabled:opacity-50 dark:disabled:bg-neutral-800
          ${
            displayError
              ? 'dark:focus-visible:ring-error-900/30 border-error-500 focus-visible:border-error-500 focus-visible:ring-error-100'
              : 'border-border focus-visible:border-focus focus-visible:ring-focus-ring'
          }
        `}
        placeholder="--"
      />
      {displayError && (
        <p
          className="absolute bottom-full left-0 mb-1 text-xs text-error-600 dark:text-error-400"
          role="alert"
        >
          {displayError}
        </p>
      )}
    </div>
  );
}

// ============================================================================
// NumberInput Component
// ============================================================================

export const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  error,
  disabled = false,
  autoAdvance = true,
}) => {
  const [fieldValues, setFieldValues] = useState<string[]>(
    value.map((n) => (n === null ? '' : formatDrawNumber(n)))
  );
  const [fieldErrors, setFieldErrors] = useState<string[]>(Array(6).fill(''));
  const [touched, setTouched] = useState<boolean[]>(Array(6).fill(false));

  // Sync field values with value prop
  useEffect(() => {
    setFieldValues(value.map((n) => (n === null ? '' : formatDrawNumber(n))));
  }, [value]);

  const handleFieldChange = useCallback(
    (index: number, newValue: string) => {
      const newFieldValues = [...fieldValues];
      newFieldValues[index] = newValue;
      setFieldValues(newFieldValues);

      // Validate single field
      const fieldError = validateNumber(newValue);
      const newFieldErrors = [...fieldErrors];
      newFieldErrors[index] = fieldError ?? '';
      setFieldErrors(newFieldErrors);

      // Convert to numbers array and validate uniqueness
      const numbers = newFieldValues
        .map((v) => (v === '' ? null : parseInt(v, 10)))
        .filter((n): n is number => n !== null);

      if (numbers.length === 6) {
        const uniqueError = validateUniqueNumbers(numbers);
        if (uniqueError) {
          // Mark all fields with duplicate error
          const dupErrors = fieldErrors.map((_, i) => {
            const num = numbers[i];
            return num !== undefined && numbers.indexOf(num) !== numbers.lastIndexOf(num)
              ? 'Los números no pueden repetirse'
              : '';
          });
          setFieldErrors(dupErrors);
        }
      }

      // Call onChange with valid numbers only
      const validNumbers = newFieldValues
        .map((v) => (v === '' ? null : parseInt(v, 10)))
        .filter((n): n is number => n !== null && n >= 0 && n <= 45);

      if (validNumbers.length === 6) {
        const uniqueError = validateUniqueNumbers(validNumbers);
        if (!uniqueError) {
          onChange(validNumbers);
        }
      }
    },
    [fieldValues, fieldErrors, onChange]
  );

  const handleFieldBlur = useCallback(
    (index: number) => {
      const newTouched = [...touched];
      newTouched[index] = true;
      setTouched(newTouched);
    },
    [touched]
  );

  // Determine which field has the overall error
  const hasUniqueError = fieldErrors.some((e) => e === 'Los números no pueden repetirse');
  const uniqueErrorIndex = fieldErrors.findIndex((e) => e === 'Los números no pueden repetirse');

  return (
    <div className="flex gap-2" role="group" aria-label="Selección de 6 números">
      {Array.from({ length: 6 }).map((_, i) => {
        const shouldShowError = touched[i] && fieldErrors[i];
        const hasUniqueErrorAtIndex = hasUniqueError && uniqueErrorIndex === i;
        const fieldError = shouldShowError
          ? (fieldErrors[i] ?? '')
          : hasUniqueErrorAtIndex
            ? (fieldErrors[i] ?? '')
            : '';

        return (
          <NumberField
            key={i}
            index={i}
            value={fieldValues[i]!}
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
            error={fieldError}
            disabled={disabled}
            autoAdvance={autoAdvance}
          />
        );
      })}
      {error && !hasUniqueError && (
        <p className="mt-2 text-sm text-error-600 dark:text-error-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default NumberInput;
