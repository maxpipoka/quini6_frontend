import React from 'react';
import { NumberBall } from './NumberBall';

export interface NumberFrequencyProps {
  data: {
    number: number;
    count: number;
    percentage: number;
  }[];
  highlightNumber?: number;
}

export const NumberFrequency: React.FC<NumberFrequencyProps> = ({ data, highlightNumber }) => {
  return (
    <div className="grid grid-cols-10 gap-2" role="list" aria-label="Frecuencia de números">
      {data.map((item) => (
        <article
          key={item.number}
          className={`
            rounded-lg border border-border bg-surface p-2
            text-center transition-all duration-150
            ${item.number === highlightNumber ? 'ring-2 ring-primary-500' : ''}
          `}
          role="listitem"
        >
          <NumberBall number={item.number} size="sm" />
          <div className="mt-1 space-y-1">
            <div
              className="h-2 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700"
              role="progressbar"
              aria-valuenow={item.percentage}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Frecuencia del número ${item.number}: ${item.percentage}%`}
            >
              <div
                className="h-full bg-primary-500 transition-all duration-300"
                style={{ width: `${item.percentage}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-text-muted">
              <span>{item.count}</span>
              <span>{item.percentage.toFixed(1)}%</span>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};

export default NumberFrequency;
