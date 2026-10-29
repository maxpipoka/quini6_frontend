import React, { useState } from 'react';
import { NumberInput } from '../draws/NumberInput';
import { NumberBall } from '../draws/NumberBall';
import { MODALITY_LABELS } from '../../lib/schemas';
import type { ExactSearchResponse, Modality } from '../../lib/schemas';

const MODALITY_COLORS: Record<Modality, 'primary' | 'secondary' | 'success' | 'warning'> = {
  TRADICIONAL: 'primary',
  LA_SEGUNDA: 'secondary',
  REVANCHA: 'success',
  SIEMPRE_SALE: 'warning',
};

function formatLongDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export interface SearchFormProps {
  apiBaseUrl?: string;
}

export const SearchForm: React.FC<SearchFormProps> = ({ apiBaseUrl }) => {
  const [numbers, setNumbers] = useState<(number | null)[]>(Array(6).fill(null));
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [result, setResult] = useState<ExactSearchResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorRequestId, setErrorRequestId] = useState('');

  const filledNumbers = numbers.filter((n): n is number => n !== null);
  const isComplete = filledNumbers.length === 6;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isComplete) {
      setStatus('error');
      setErrorMessage('Debe ingresar exactamente 6 números únicos entre 0 y 45.');
      return;
    }

    if (!apiBaseUrl) {
      setStatus('error');
      setErrorMessage('La API no está configurada. Intente más tarde.');
      return;
    }

    setStatus('loading');
    setResult(null);
    setErrorMessage('');
    setErrorRequestId('');

    try {
      const response = await fetch(`${apiBaseUrl}/search/exact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numbers: filledNumbers }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          message?: string;
          requestId?: string;
        } | null;
        setErrorMessage(payload?.message ?? `Error ${response.status}`);
        setErrorRequestId(payload?.requestId ?? '');
        setStatus('error');
        return;
      }

      setResult((await response.json()) as ExactSearchResponse);
      setStatus('success');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Error inesperado');
      setStatus('error');
    }
  };

  const handleClear = () => {
    setNumbers(Array(6).fill(null));
    setResult(null);
    setStatus('idle');
    setErrorMessage('');
    setErrorRequestId('');
  };

  return (
    <div>
      <form
        className="card-elevated p-6 md:p-8"
        onSubmit={handleSubmit}
        noValidate
        data-testid="search-form"
      >
        <div className="mb-6">
          <p className="mb-3 block text-sm font-medium text-text-secondary">Sus 6 números</p>
          <NumberInput value={numbers} onChange={(value) => setNumbers(value)} autoAdvance={true} />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            className="rounded-lg border border-border bg-surface px-4 py-2 font-medium text-text-primary transition-colors hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-700"
            onClick={handleClear}
          >
            Limpiar
          </button>
          <button
            type="submit"
            data-testid="search-button"
            className="rounded-lg bg-primary-600 px-4 py-2 font-medium text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Buscando...' : 'Buscar combinación'}
          </button>
        </div>
      </form>

      <section className="mt-8" aria-live="polite">
        {status === 'loading' && (
          <div className="card-elevated p-12 text-center" role="status">
            <svg
              className="mx-auto size-8 animate-spin text-primary-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            <p className="mt-4 text-text-secondary">Buscando combinación...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="card-elevated p-8 text-center" role="alert" data-testid="search-error">
            <h3 className="mb-2 font-sans text-heading-md text-text-primary">
              No pudimos realizar la búsqueda
            </h3>
            <p className="mb-4 text-text-secondary">
              {errorMessage}
              {errorRequestId ? ` (ID: ${errorRequestId})` : ''}
            </p>
          </div>
        )}

        {status === 'success' && result && result.matches.length > 0 && (
          <div data-testid="search-results">
            <p className="mb-6 text-text-secondary">
              Se encontraron <strong>{result.totalMatches}</strong> coincidencia
              {result.totalMatches !== 1 ? 's' : ''}.
            </p>

            <div className="space-y-4" role="list" aria-label="Resultados de la búsqueda">
              {result.matches.map((match) => (
                <article
                  key={`${match.officialNumber}-${match.modality}`}
                  className="card-elevated p-6"
                  role="listitem"
                >
                  <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold text-text-primary">
                        Sorteo Nº {match.officialNumber}
                      </p>
                      <p className="text-text-secondary">{formatLongDate(match.drawDate)}</p>
                    </div>
                    <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700 dark:bg-primary-900 dark:text-primary-300">
                      {MODALITY_LABELS[match.modality as Modality] ?? match.modality}
                    </span>
                  </div>
                  <div
                    className="flex flex-wrap justify-center gap-1.5"
                    role="img"
                    aria-label={`Números: ${match.numbers.map((n) => n.toString().padStart(2, '0')).join(', ')}`}
                  >
                    {match.numbers.map((num) => (
                      <NumberBall
                        key={num}
                        number={num}
                        size="md"
                        variant={MODALITY_COLORS[match.modality as Modality] ?? 'primary'}
                      />
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {status === 'success' && result && result.matches.length === 0 && (
          <div className="card-elevated p-8 text-center" role="status" data-testid="no-results">
            <h3 className="mb-2 font-sans text-heading-md text-text-primary">
              No encontramos esta combinación
            </h3>
            <p className="mb-4 text-text-secondary">
              Los números{' '}
              <strong>{filledNumbers.map((n) => n.toString().padStart(2, '0')).join(', ')}</strong>{' '}
              no han salido juntos en ningún sorteo registrado.
            </p>
            <p className="text-sm text-text-muted">
              Intente con otra combinación o revise el historial completo.
            </p>
          </div>
        )}

        {status === 'idle' && (
          <div className="card-elevated p-8 text-center">
            <p className="text-text-muted">
              Ingrese sus 6 números arriba y pulse &quot;Buscar combinación&quot; para ver los
              resultados.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default SearchForm;
