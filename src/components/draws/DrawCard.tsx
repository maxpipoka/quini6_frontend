import React from 'react';
import { NumberBall } from './NumberBall';
import { formatDate } from '../../lib/utils/format';

export interface DrawCardProps {
  draw: {
    officialNumber: number;
    date: string;
    numbers: number[];
    complementary: number;
    reintegro: number;
  };
  onClick?: () => void;
  variant?: 'default' | 'compact';
}

export const DrawCard: React.FC<DrawCardProps> = ({ draw, onClick, variant = 'default' }) => {
  const cardClass = `
    p-4 rounded-xl border border-border bg-surface
    transition-all duration-200
    ${onClick ? 'cursor-pointer text-left hover:border-primary-300 hover:shadow-lg' : ''}
    ${variant === 'compact' ? 'p-3' : ''}
  `;

  const content = (
    <>
      <header className="mb-3 flex items-center justify-between">
        <span className="text-caption text-text-muted">Sorteo #{draw.officialNumber}</span>
        <time className="text-caption text-text-secondary" dateTime={draw.date}>
          {formatDate(draw.date, 'dd/MM/yyyy')}
        </time>
      </header>

      <div
        className="mb-3 flex flex-wrap gap-2"
        role="img"
        aria-label={`Números ganadores: ${draw.numbers.join(', ')}`}
      >
        {draw.numbers.map((num) => (
          <NumberBall key={num} number={num} size={variant === 'compact' ? 'sm' : 'md'} />
        ))}
      </div>

      <footer className="flex items-center justify-between text-caption text-text-secondary">
        <div className="flex items-center gap-2">
          <span className="dark:bg-primary-900/30 rounded bg-primary-100 px-2 py-0.5 text-primary-700 dark:text-primary-300">
            C: <NumberBall number={draw.complementary} size="sm" variant="secondary" />
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded bg-amber-100 px-2 py-0.5 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
            R: <NumberBall number={draw.reintegro} size="sm" variant="warning" />
          </span>
        </div>
      </footer>
    </>
  );

  if (onClick) {
    return (
      <button type="button" className={cardClass} onClick={onClick}>
        {content}
      </button>
    );
  }

  return <article className={cardClass}>{content}</article>;
};

export default DrawCard;
