import React from 'react';

export interface PrizeTableProps {
  prizes: {
    category: string;
    winners: number;
    amount: number;
  }[];
}

export const PrizeTable: React.FC<PrizeTableProps> = ({ prizes }) => {
  return (
    <table className="w-full border-collapse" role="table">
      <thead>
        <tr className="bg-neutral-50 dark:bg-neutral-800">
          <th className="border-b border-border p-3 text-left text-sm font-semibold text-text-primary">
            Categoría
          </th>
          <th className="border-b border-border p-3 text-right text-sm font-semibold text-text-primary">
            Ganadores
          </th>
          <th className="border-b border-border p-3 text-right text-sm font-semibold text-text-primary">
            Premio
          </th>
        </tr>
      </thead>
      <tbody>
        {prizes.map((prize, index) => (
          <tr
            key={index}
            className={index % 2 === 0 ? 'bg-surface' : 'dark:bg-neutral-800/50 bg-neutral-50'}
          >
            <td className="border-border/50 border-b p-3 text-sm text-text-primary">
              {prize.category}
            </td>
            <td className="border-border/50 border-b p-3 text-right text-sm text-text-secondary">
              {prize.winners.toLocaleString('es-AR')}
            </td>
            <td className="border-border/50 border-b p-3 text-right text-sm font-medium text-primary-600 dark:text-primary-400">
              ${prize.amount.toLocaleString('es-AR')}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PrizeTable;
