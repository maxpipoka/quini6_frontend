import React from 'react';
import { DrawCard } from './DrawCard';
import { PrizeTable } from './PrizeTable';
import { NumberFrequency } from './NumberFrequency';
import { formatDate } from '../../lib/utils/format';

export interface DrawDetailProps {
  draw: {
    officialNumber: number;
    date: string;
    numbers: number[];
    complementary: number;
    reintegro: number;
    prizes: {
      category: string;
      winners: number;
      amount: number;
    }[];
    frequencies: {
      number: number;
      count: number;
      percentage: number;
    }[];
  };
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

export const DrawDetail: React.FC<DrawDetailProps> = ({
  draw,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}) => {
  return (
    <article className="space-y-6">
      {/* Header with navigation */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-heading-xl font-bold text-text-primary">
            Sorteo #{draw.officialNumber}
          </h1>
          <time className="text-base text-text-secondary" dateTime={draw.date}>
            {formatDate(draw.date, 'EEEE, dd MMMM yyyy')}
          </time>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onPrev}
            disabled={!hasPrev}
            className="rounded-lg border border-border bg-surface px-4 py-2 text-text-primary hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-neutral-800"
            aria-label="Sorteo anterior"
          >
            ← Anterior
          </button>
          <button
            onClick={onNext}
            disabled={!hasNext}
            className="rounded-lg border border-border bg-surface px-4 py-2 text-text-primary hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-neutral-800"
            aria-label="Sorteo siguiente"
          >
            Siguiente →
          </button>
        </div>
      </header>

      {/* Winning Numbers */}
      <section aria-labelledby="numbers-heading" className="space-y-2">
        <h2 id="numbers-heading" className="text-heading-md font-semibold text-text-primary">
          Números ganadores
        </h2>
        <DrawCard
          draw={{
            officialNumber: draw.officialNumber,
            date: draw.date,
            numbers: draw.numbers,
            complementary: draw.complementary,
            reintegro: draw.reintegro,
          }}
        />
      </section>

      {/* Prize Table */}
      <section aria-labelledby="prizes-heading" className="space-y-2">
        <h2 id="prizes-heading" className="text-heading-md font-semibold text-text-primary">
          Premios
        </h2>
        <div className="overflow-x-auto">
          <PrizeTable prizes={draw.prizes} />
        </div>
      </section>

      {/* Number Frequency */}
      <section aria-labelledby="frequency-heading" className="space-y-2">
        <h2 id="frequency-heading" className="text-heading-md font-semibold text-text-primary">
          Frecuencia histórica de números
        </h2>
        <NumberFrequency data={draw.frequencies} />
      </section>
    </article>
  );
};

export default DrawDetail;
