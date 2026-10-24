import React, { useState, useEffect, useCallback } from 'react';

// ============================================================================
// Types
// ============================================================================

export interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  min?: string;
  max?: string;
}

// ============================================================================
// Validation
// ============================================================================

function validateDate(value: string, min?: string, max?: string): string | undefined {
  if (!value) return undefined;

  const date = new Date(value);
  if (isNaN(date.getTime())) return 'Fecha inválida';

  if (min) {
    const minDate = new Date(min);
    if (!isNaN(minDate.getTime()) && date < minDate) {
      return `La fecha debe ser posterior a ${formatDateForDisplay(min)}`;
    }
  }

  if (max) {
    const maxDate = new Date(max);
    if (!isNaN(maxDate.getTime()) && date > maxDate) {
      return `La fecha debe ser anterior a ${formatDateForDisplay(max)}`;
    }
  }

  return undefined;
}

function formatDateForDisplay(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('es-AR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  } catch {
    return isoString;
  }
}

function toISO8601UTC(localDateTime: string): string {
  // localDateTime is in format "YYYY-MM-DDTHH:mm"
  // We need to treat it as local time and convert to UTC ISO string
  const date = new Date(localDateTime);
  if (isNaN(date.getTime())) return '';
  return date.toISOString();
}

function fromISO8601UTC(isoString: string): string {
  // Convert UTC ISO string to local datetime-local format
  try {
    const date = new Date(isoString);
    // Format as YYYY-MM-DDTHH:mm for datetime-local input
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  } catch {
    return '';
  }
}

// ============================================================================
// DatePicker Component
// ============================================================================

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  error,
  disabled = false,
  min,
  max,
}) => {
  const [localValue, setLocalValue] = useState<string>('');
  const [localError, setLocalError] = useState<string | undefined>(undefined);
  const [touched, setTouched] = useState(false);

  // Convert ISO UTC value to local datetime-local format
  useEffect(() => {
    if (value) {
      setLocalValue(fromISO8601UTC(value));
    } else {
      setLocalValue('');
    }
  }, [value]);

  // Validate on local value change
  useEffect(() => {
    if (touched) {
      const validationError = validateDate(localValue, min, max);
      setLocalError(validationError);
    }
  }, [localValue, min, max, touched]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setLocalValue(newValue);

      if (newValue) {
        const isoValue = toISO8601UTC(newValue);
        onChange(isoValue);
      } else {
        onChange('');
      }
    },
    [onChange]
  );

  const handleBlur = useCallback(() => {
    setTouched(true);
    const validationError = validateDate(localValue, min, max);
    setLocalError(validationError);
  }, [localValue, min, max]);

  // Determine which error to show
  const displayError = touched && localError ? localError : error;

  // Convert min/max to local format for input attributes
  const localMin = min ? fromISO8601UTC(min) : undefined;
  const localMax = max ? fromISO8601UTC(max) : undefined;

  return (
    <div className="w-full">
      <label htmlFor="draw-date" className="mb-1.5 block font-medium text-text-primary">
        Fecha del sorteo
      </label>
      <input
        id="draw-date"
        type="datetime-local"
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={disabled}
        min={localMin}
        max={localMax}
        aria-invalid={displayError ? 'true' : 'false'}
        aria-describedby={displayError ? 'date-error' : undefined}
        className={`
          w-full
          rounded-lg border bg-surface
          px-4 py-2.5 text-text-primary placeholder-text-muted
          transition-colors duration-150
          focus:outline-none focus:ring-2
          focus:ring-offset-0 disabled:cursor-not-allowed
          disabled:bg-neutral-50 disabled:opacity-50 dark:disabled:bg-neutral-800
          ${
            displayError
              ? 'dark:focus:ring-error-900/30 border-error-500 focus:border-error-500 focus:ring-error-100'
              : 'border-border focus:border-focus focus:ring-focus-ring'
          }
        `}
      />
      {displayError && (
        <p
          id="date-error"
          className="mt-1.5 text-sm text-error-600 dark:text-error-400"
          role="alert"
        >
          {displayError}
        </p>
      )}
    </div>
  );
};

export default DatePicker;
