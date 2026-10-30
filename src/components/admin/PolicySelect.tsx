import React, { useId } from 'react';

import type { ImportPolicy } from '../../lib/schemas';

interface PolicyOption {
  value: ImportPolicy;
  label: string;
  description: string;
}

const POLICY_OPTIONS: PolicyOption[] = [
  {
    value: 'skip',
    label: 'Omitir duplicados',
    description:
      'Mantiene los sorteos existentes, ignora los nuevos que coincidan en fecha y modalidad',
  },
  {
    value: 'replace',
    label: 'Reemplazar',
    description: 'Elimina los sorteos existentes y crea nuevos con los datos importados',
  },
  {
    value: 'merge',
    label: 'Fusionar',
    description: 'Actualiza sorteos existentes y crea nuevos, combinando números si es posible',
  },
];

interface Props {
  value: ImportPolicy;
  onChange: (policy: ImportPolicy) => void;
  disabled?: boolean;
  validCount?: number;
  'aria-describedby'?: string;
}

export const PolicySelect: React.FC<Props> = ({
  value,
  onChange,
  disabled = false,
  validCount = 0,
  'aria-describedby': ariaDescribedBy,
}) => {
  const radioGroupId = useId();

  const isDisabled = disabled || validCount === 0;

  return (
    <fieldset className="space-y-3" aria-describedby={ariaDescribedBy}>
      <legend className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
        Política de conflicto
      </legend>
      <div
        className="space-y-2"
        role="radiogroup"
        aria-labelledby={`${radioGroupId}-legend`}
        id={radioGroupId}
      >
        {POLICY_OPTIONS.map((option) => (
          // eslint-disable-next-line jsx-a11y/label-has-associated-control -- label wraps input; text is in nested <p>
          <label
            key={option.value}
            className={`flex cursor-pointer items-start gap-3 rounded-lg border-2 p-3 transition-all duration-200
              ${
                value === option.value
                  ? 'dark:bg-primary-900/20 border-primary-500 bg-primary-50'
                  : 'border-neutral-200 hover:border-neutral-300 dark:border-neutral-700 dark:hover:border-neutral-600'
              }
              ${isDisabled ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            <input
              type="radio"
              name={radioGroupId}
              value={option.value}
              checked={value === option.value}
              onChange={() => !isDisabled && onChange(option.value)}
              disabled={isDisabled}
              className="mt-1 size-4 border-neutral-300 text-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
              aria-describedby={`${option.value}-description`}
            />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-neutral-900 dark:text-neutral-100">{option.label}</p>
              <p
                id={`${option.value}-description`}
                className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400"
              >
                {option.description}
              </p>
            </div>
          </label>
        ))}
      </div>
      {isDisabled && validCount === 0 && (
        <p className="text-xs italic text-neutral-500 dark:text-neutral-400">
          Seleccione una política después de validar el archivo (mínimo 1 fila válida)
        </p>
      )}
    </fieldset>
  );
};

export default PolicySelect;
