import React, { useState, useCallback } from 'react';

interface NumberInputFieldProps {
  value: number | null;
  onChange: (value: number | null) => void;
  min?: number;
  max?: number;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  ariaLabel?: string;
  ariaDescribedBy?: string | undefined;
}

export function NumberInputField({
  value,
  onChange,
  min = 0,
  max = 45,
  placeholder,
  disabled = false,
  error = false,
  ariaLabel,
  ariaDescribedBy,
}: NumberInputFieldProps) {
  const [localValue, setLocalValue] = useState<string>(value === null ? '' : value.toString());

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;

      if (!/^\d*$/.test(newValue)) return;

      if (newValue.length > 2) return;

      setLocalValue(newValue);

      if (newValue === '') {
        onChange(null);
      } else {
        const num = parseInt(newValue, 10);
        if (!isNaN(num) && num >= min && num <= max) {
          onChange(num);
        }
      }
    },
    [min, max, onChange]
  );

  const handleBlur = useCallback(() => {
    if (localValue === '') {
      onChange(null);
    }
  }, [localValue, onChange]);

  return (
    <input
      type="number"
      inputMode="numeric"
      value={localValue}
      onChange={handleChange}
      onBlur={handleBlur}
      min={min}
      max={max}
      placeholder={placeholder}
      disabled={disabled}
      maxLength={2}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-invalid={error}
      className={`
        w-full rounded-lg border bg-surface px-4 py-2.5 text-center text-text-primary
        placeholder-text-muted transition-colors focus:border-transparent focus:outline-none focus:ring-2
        disabled:cursor-not-allowed disabled:opacity-50
        ${error ? 'border-error focus:ring-error' : 'focus:ring-primary border-border'}
      `}
    />
  );
}
