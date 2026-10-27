import { useState } from 'react';
import { getApiClient } from '@/lib/api/client';
import * as schemas from '@/lib/schemas';
import { ChevronDownIcon, ChevronUpIcon, XCircleIcon, AlertCircleIcon } from './icons';

interface ImportErrorDetailsProps {
  importId: string;
}

export function ImportErrorDetails({ importId }: ImportErrorDetailsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [errors, setErrors] = useState<schemas.ImportErrorDetail[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchErrors = async () => {
    if (errors !== null) return;

    setIsLoading(true);
    setError(null);

    try {
      const api = getApiClient();
      const response = await api.getImportErrors(importId);
      const validated = schemas.ImportErrorsResponseSchema.parse(response);
      setErrors(validated.errors);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error al cargar detalles'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      fetchErrors();
    }
  };

  const formatField = (field: string): string => {
    const fieldLabels: Record<string, string> = {
      officialNumber: 'Nº Oficial',
      drawDate: 'Fecha del sorteo',
      modality: 'Modalidad',
      numbers: 'Números',
      reintegro: 'Reintegro',
    };
    return fieldLabels[field] ?? field;
  };

  if (isLoading) {
    return (
      <button
        onClick={handleToggle}
        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-text-muted transition-colors hover:text-text-primary"
        aria-label="Cargando detalles..."
        disabled
      >
        <span className="loading loading-spinner loading-sm"></span>
        <span role="status" className="sr-only">
          Cargando detalles...
        </span>
      </button>
    );
  }

  const hasErrors = errors && errors.length > 0;

  return (
    <>
      <button
        onClick={handleToggle}
        className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm transition-colors ${
          hasErrors
            ? 'bg-error/10 text-error hover:bg-error/20'
            : 'bg-success/10 text-success hover:bg-success/20'
        }`}
        aria-expanded={isExpanded}
        aria-label={
          isExpanded
            ? 'Ocultar detalles de errores'
            : hasErrors
              ? 'Ver detalles de errores'
              : 'Sin errores'
        }
      >
        {hasErrors ? (
          <>
            <AlertCircleIcon className="size-3.5" />
            <span>
              {errors?.length} error{errors && errors.length !== 1 ? 'es' : ''}
            </span>
          </>
        ) : (
          <>
            <XCircleIcon className="size-3.5" />
            <span>Sin errores</span>
          </>
        )}
        {isExpanded ? (
          <ChevronUpIcon className="size-3.5" data-testid="chevron-up-icon" />
        ) : (
          <ChevronDownIcon className="size-3.5" data-testid="chevron-down-icon" />
        )}
      </button>

      {error && (
        <p role="alert" className="text-error mt-1 text-xs">
          {error.message}
        </p>
      )}

      {isExpanded && hasErrors && errors && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="error-details-title"
        >
          <button
            type="button"
            aria-label="Cerrar modal"
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsExpanded(false)}
            data-testid="modal-backdrop"
          />

          <div className="relative z-10 max-h-[80vh] w-full max-w-2xl overflow-hidden rounded-xl bg-surface-elevated shadow-xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-border bg-surface px-4 py-3">
              <h3 id="error-details-title" className="font-medium text-text-primary">
                Detalles de errores - {errors.length} error{errors.length !== 1 ? 'es' : ''}
              </h3>
              <button
                onClick={() => setIsExpanded(false)}
                className="rounded-lg p-1 text-text-muted transition-colors hover:bg-surface-elevated hover:text-text-primary"
                aria-label="Cerrar"
              >
                <XCircleIcon className="size-5" />
              </button>
            </div>

            <div className="max-h-[calc(80vh_-_64px)] overflow-y-auto p-4">
              <div className="space-y-3">
                {errors.map((err, index) => (
                  <div
                    key={`${err.rowNumber}-${err.field}-${index}`}
                    className="border-error/20 bg-error/5 rounded-lg border p-4"
                  >
                    <div className="flex items-start gap-3">
                      <AlertCircleIcon className="text-error mt-0.5 size-5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-medium text-text-primary">
                            Fila {err.rowNumber}
                          </span>
                          <span className="bg-error/10 text-error rounded px-2 py-0.5 text-xs font-medium">
                            {formatField(err.field)}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-text-secondary">{err.message}</p>
                        {err.rawValue !== undefined && err.rawValue !== null && (
                          <div className="mt-2">
                            <span className="text-xs font-medium text-text-muted">
                              Valor original:
                            </span>
                            <code className="ml-2 rounded bg-surface px-1.5 py-0.5 font-mono text-sm text-text-secondary">
                              {JSON.stringify(err.rawValue)}
                            </code>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
