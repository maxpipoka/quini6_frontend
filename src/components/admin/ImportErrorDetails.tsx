import { useState } from 'react';
import { getApiClient } from '@/lib/api/client';
import * as schemas from '@/lib/schemas';
import { ChevronDownIcon, ChevronUpIcon, XCircleIcon, AlertCircleIcon, FileIcon } from './icons';

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
    return fieldLabels[field] || field;
  };

  if (isLoading) {
    return (
      <button
        onClick={handleToggle}
        class="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-text-muted hover:text-text-primary transition-colors"
        aria-label="Cargando detalles..."
        disabled
      >
        <span class="loading loading-spinner loading-sm"></span>
      </button>
    );
  }

  const hasErrors = errors && errors.length > 0;

  return (
    <>
      <button
        onClick={handleToggle}
        class={`inline-flex items-center gap-1 px-3 py-1.5 text-sm transition-colors rounded-lg ${
          hasErrors
            ? 'bg-error/10 text-error hover:bg-error/20'
            : 'bg-success/10 text-success hover:bg-success/20'
        }`}
        aria-expanded={isExpanded}
        aria-label={isExpanded ? 'Ocultar detalles de errores' : hasErrors ? 'Ver detalles de errores' : 'Sin errores'}
      >
        {hasErrors ? (
          <>
            <AlertCircleIcon class="size-3.5" />
            <span>{errors?.length} error{errors && errors.length !== 1 ? 'es' : ''}</span>
          </>
        ) : (
          <>
            <XCircleIcon class="size-3.5" />
            <span>Sin errores</span>
          </>
        )}
        {isExpanded ? <ChevronUpIcon class="size-3.5" /> : <ChevronDownIcon class="size-3.5" />}
      </button>

      {isExpanded && hasErrors && errors && (
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="error-details-title">
          <div class="fixed inset-0 bg-black/50" onClick={() => setIsExpanded(false)} />
          
          <div class="relative z-10 w-full max-w-2xl max-h-[80vh] overflow-hidden rounded-xl bg-surface-elevated shadow-xl">
            <div class="sticky top-0 flex items-center justify-between border-b border-border bg-surface px-4 py-3">
              <h3 id="error-details-title" class="font-medium text-text-primary">Detalles de errores - {errors.length} error{errors.length !== 1 ? 'es' : ''}</h3>
              <button
                onClick={() => setIsExpanded(false)}
                class="p-1 rounded-lg text-text-muted hover:bg-surface-elevated hover:text-text-primary transition-colors"
                aria-label="Cerrar"
              >
                <XCircleIcon class="size-5" />
              </button>
            </div>

            <div class="overflow-y-auto max-h-[calc(80vh_-_64px)] p-4">
              <div class="space-y-3">
                {errors.map((err, index) => (
                  <div
                    key={`${err.rowNumber}-${err.field}-${index}`}
                    class="rounded-lg border border-error/20 bg-error/5 p-4"
                  >
                    <div class="flex items-start gap-3">
                      <AlertCircleIcon class="size-5 text-error flex-shrink-0 mt-0.5" />
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2 text-sm">
                          <span class="font-medium text-text-primary">Fila {err.rowNumber}</span>
                          <span class="px-2 py-0.5 rounded text-xs font-medium bg-error/10 text-error">
                            {formatField(err.field)}
                          </span>
                        </div>
                        <p class="mt-1 text-sm text-text-secondary">{err.message}</p>
                        {err.rawValue !== undefined && err.rawValue !== null && (
                          <div class="mt-2">
                            <span class="text-xs font-medium text-text-muted">Valor original:</span>
                            <code class="ml-2 text-sm font-mono text-text-secondary bg-surface px-1.5 py-0.5 rounded">
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