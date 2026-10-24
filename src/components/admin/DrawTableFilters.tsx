import { useState, useEffect, type ChangeEvent } from 'react';
import { X, Filter, Calendar } from 'lucide-react';
import { MODALITY_ORDER } from '../../lib/schemas';

type DrawModality = 'TRADICIONAL' | 'LA_SEGUNDA' | 'REVANCHA' | 'SIEMPRE_SALE' | '';

export interface DrawFilters {
  startDate: string;
  endDate: string;
  modality: DrawModality;
}

export interface DrawTableFiltersProps {
  initialFilters?: Partial<DrawFilters>;
  onFilterChange: (filters: DrawFilters) => void;
  isLoading?: boolean;
}

export function DrawTableFilters({
  initialFilters,
  onFilterChange,
  isLoading = false,
}: DrawTableFiltersProps) {
  const [filters, setFilters] = useState<DrawFilters>({
    startDate: initialFilters?.startDate ?? '',
    endDate: initialFilters?.endDate ?? '',
    modality: initialFilters?.modality ?? '',
  });

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handleChange = (field: keyof DrawFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleClear = () => {
    const cleared: DrawFilters = { startDate: '', endDate: '', modality: '' };
    setFilters(cleared);
    onFilterChange(cleared);
  };

  const hasActiveFilters = filters.startDate || filters.endDate || filters.modality;

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface-elevated p-4 lg:flex-row">
      <div className="flex-1">
        <label htmlFor="start-date" className="mb-1 block text-sm font-medium text-text-secondary">
          <Calendar className="mr-1 inline size-4" aria-hidden="true" />
          Fecha desde
        </label>
        <input
          type="date"
          id="start-date"
          value={filters.startDate}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('startDate', e.target.value)}
          disabled={isLoading}
          className="focus:ring-primary w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-text-primary placeholder-text-muted transition-colors focus:border-transparent focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      <div className="flex-1">
        <label htmlFor="end-date" className="mb-1 block text-sm font-medium text-text-secondary">
          <Calendar className="mr-1 inline size-4" aria-hidden="true" />
          Fecha hasta
        </label>
        <input
          type="date"
          id="end-date"
          value={filters.endDate}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('endDate', e.target.value)}
          disabled={isLoading}
          className="focus:ring-primary w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-text-primary placeholder-text-muted transition-colors focus:border-transparent focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      <div className="flex-1">
        <label
          htmlFor="modality-filter"
          className="mb-1 block text-sm font-medium text-text-secondary"
        >
          <Filter className="mr-1 inline size-4" aria-hidden="true" />
          Modalidad
        </label>
        <select
          id="modality-filter"
          value={filters.modality}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            handleChange('modality', e.target.value as DrawModality)
          }
          disabled={isLoading}
          className="focus:ring-primary w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-text-primary transition-colors focus:border-transparent focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">Todas</option>
          {MODALITY_ORDER.map((modality) => (
            <option key={modality} value={modality}>
              {modality.charAt(0) + modality.slice(1).toLowerCase().replace('_', ' ')}
            </option>
          ))}
        </select>
      </div>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={handleClear}
          disabled={isLoading}
          className="flex h-fit items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-text-secondary transition-colors hover:bg-surface hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Limpiar filtros"
        >
          <X className="size-4" aria-hidden="true" />
          <span className="font-medium">Limpiar filtros</span>
        </button>
      )}
    </div>
  );
}
