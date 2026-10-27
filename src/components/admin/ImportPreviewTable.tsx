import React, { useMemo, useState, useCallback } from 'react';
import { ChevronDownIcon, AlertCircleIcon, CheckCircleIcon } from './icons';
import type { ImportPreviewRow } from '../../lib/schemas';

interface Props {
  rows: ImportPreviewRow[];
  onRowSelect?: (rowIndex: number, selected: boolean) => void;
  selectedRows?: Set<number>;
}

export const ImportPreviewTable: React.FC<Props> = ({
  rows,
  onRowSelect,
  selectedRows = new Set(),
}) => {
  const [sorting, setSorting] = useState<{ id: string; desc: boolean }[]>([]);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const handleSort = useCallback((columnId: string) => {
    setSorting((prev) => {
      const existing = prev.find((s) => s.id === columnId);
      if (existing) {
        if (existing.desc) {
          return prev.filter((s) => s.id !== columnId);
        }
        return prev.map((s) => (s.id === columnId ? { ...s, desc: true } : s));
      }
      return [...prev, { id: columnId, desc: false }];
    });
  }, []);

  const handleRowSelect = useCallback(
    (rowIndex: number, selected: boolean) => {
      onRowSelect?.(rowIndex, selected);
    },
    [onRowSelect]
  );

  const handleToggleAllRows = useCallback(
    (selected: boolean) => {
      rows.forEach((_, index) => {
        const row = rows[index];
        if (row?.isValid) {
          handleRowSelect(index, selected);
        }
      });
    },
    [rows, handleRowSelect]
  );

  const handleExpandRow = useCallback((rowId: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [rowId]: !prev[rowId],
    }));
  }, []);

  const sortedRows = useMemo(() => {
    if (sorting.length === 0) return rows;
    return [...rows].sort((a, b) => {
      for (const sort of sorting) {
        let aVal: any = (a as any)[sort.id];
        let bVal: any = (b as any)[sort.id];

        if (aVal === undefined || aVal === null) aVal = '';
        if (bVal === undefined || bVal === null) bVal = '';

        if (typeof aVal === 'string') aVal = aVal.toLowerCase();
        if (typeof bVal === 'string') bVal = bVal.toLowerCase();

        if (aVal < bVal) return sort.desc ? 1 : -1;
        if (aVal > bVal) return sort.desc ? -1 : 1;
      }
      return 0;
    });
  }, [rows, sorting]);

  const allValidSelected =
    sortedRows.length > 0 &&
    sortedRows.filter((r) => r.isValid).every((_, i) => selectedRows.has(i));

  const someValidSelected = sortedRows.filter((r) => r.isValid).some((_, i) => selectedRows.has(i));

  const columns = [
    { id: 'select', header: 'Seleccionar', width: 48, sortable: false },
    { id: 'rowNumber', header: 'N°', width: 60, sortable: true },
    { id: 'date', header: 'Fecha', width: 120, sortable: true },
    { id: 'modality', header: 'Modalidad', width: 130, sortable: true },
    { id: 'tradicional', header: 'Tradicional', width: 150, sortable: false },
    { id: 'laSegunda', header: 'La Segunda', width: 150, sortable: false },
    { id: 'revancha', header: 'Revancha', width: 150, sortable: false },
    { id: 'siempreSale', header: 'Siempre Sale', width: 150, sortable: false },
    { id: 'reintegro', header: 'Reintegro', width: 80, sortable: false },
    { id: 'status', header: 'Estado', width: 100, sortable: false },
    { id: 'expand', header: 'Acciones', width: 48, sortable: false },
  ];

  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-700">
      <table className="w-full text-sm" role="grid">
        <thead className="dark:bg-neutral-800/50 bg-neutral-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.id}
                className={`px-3 py-2 text-left font-medium text-neutral-700 dark:text-neutral-300 ${
                  col.sortable
                    ? 'cursor-pointer select-none hover:bg-neutral-100 dark:hover:bg-neutral-700'
                    : ''
                }`}
                style={{ width: col.width }}
                onClick={() => col.sortable && handleSort(col.id)}
                aria-sort={
                  sorting.find((s) => s.id === col.id)?.desc === true
                    ? 'descending'
                    : sorting.find((s) => s.id === col.id)
                      ? 'ascending'
                      : 'none'
                }
              >
                <div className="flex items-center gap-1">
                  {col.header}
                  {col.sortable && sorting.find((s) => s.id === col.id) && (
                    <span className="text-primary-600" aria-hidden="true">
                      {sorting.find((s) => s.id === col.id)?.desc ? '↓' : '↑'}
                    </span>
                  )}
                  {col.id === 'select' && (
                    <input
                      type="checkbox"
                      checked={allValidSelected}
                      onChange={(e) => handleToggleAllRows(e.target.checked)}
                      className="size-4 rounded border-neutral-300 text-primary-600 focus:ring-2 focus:ring-primary-500"
                      aria-label="Seleccionar todas las filas válidas"
                    />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
          {sortedRows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-neutral-500 dark:text-neutral-400"
              >
                No hay datos para mostrar
              </td>
            </tr>
          ) : (
            sortedRows.map((row, index) => (
              <React.Fragment key={row.rowNumber}>
                <tr
                  className={`transition-colors ${
                    row.isValid ? '' : 'dark:bg-error-900/10 bg-error-50'
                  }`}
                >
                  <td className="px-3 py-2 text-neutral-900 dark:text-neutral-100">
                    <input
                      type="checkbox"
                      checked={selectedRows.has(index)}
                      onChange={(e) => handleRowSelect(index, e.target.checked)}
                      className="size-4 rounded border-neutral-300 text-primary-600 focus:ring-2 focus:ring-primary-500"
                      aria-label={`Seleccionar fila ${index + 1}`}
                      disabled={!row.isValid}
                    />
                  </td>
                  <td className="px-3 py-2 text-neutral-900 dark:text-neutral-100">
                    {row.rowNumber}
                  </td>
                  <td className="px-3 py-2 text-neutral-900 dark:text-neutral-100">{row.date}</td>
                  <td className="px-3 py-2">
                    <span className="dark:bg-primary-900/30 inline-flex items-center rounded-full bg-primary-100 px-2 py-1 text-xs font-medium text-primary-800 dark:text-primary-200">
                      {row.modality}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-neutral-900 dark:text-neutral-100">
                    {row.tradicional?.join(' - ') || '-'}
                  </td>
                  <td className="px-3 py-2 text-neutral-900 dark:text-neutral-100">
                    {row.laSegunda?.join(' - ') || '-'}
                  </td>
                  <td className="px-3 py-2 text-neutral-900 dark:text-neutral-100">
                    {row.revancha?.join(' - ') || '-'}
                  </td>
                  <td className="px-3 py-2 text-neutral-900 dark:text-neutral-100">
                    {row.siempreSale?.join(' - ') || '-'}
                  </td>
                  <td className="px-3 py-2 text-neutral-900 dark:text-neutral-100">
                    {row.reintegro?.toString() || '-'}
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium ${
                        row.isValid
                          ? 'dark:bg-success-900/30 text-success-800 dark:text-success-200 bg-success-100'
                          : 'dark:bg-error-900/30 text-error-800 dark:text-error-200 bg-error-100'
                      }`}
                    >
                      {row.isValid ? (
                        <>
                          <CheckCircleIcon className="size-3.5" aria-hidden={true} />
                          Válido
                        </>
                      ) : (
                        <>
                          <AlertCircleIcon className="size-3.5" aria-hidden={true} />
                          Inválido
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <button
                      onClick={() => handleExpandRow(String(row.rowNumber))}
                      className="rounded p-1 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      aria-label={
                        expandedRows[String(row.rowNumber)]
                          ? 'Contraer detalles'
                          : 'Expandir detalles'
                      }
                      aria-expanded={expandedRows[String(row.rowNumber)]}
                    >
                      <ChevronDownIcon
                        className={`size-4 text-neutral-500 transition-transform ${expandedRows[String(row.rowNumber)] ? 'rotate-180' : ''}`}
                        aria-hidden={true}
                      />
                    </button>
                  </td>
                </tr>
                {expandedRows[String(row.rowNumber)] && row.errors.length > 0 && (
                  <tr className="dark:bg-neutral-800/50 bg-neutral-50">
                    <td colSpan={columns.length} className="px-4 py-3">
                      <div className="ml-12 space-y-2 border-l-2 border-neutral-200 pl-4 dark:border-neutral-700">
                        <p className="text-sm font-medium text-error-600 dark:text-error-400">
                          Errores en fila {row.rowNumber}:
                        </p>
                        <ul className="space-y-1">
                          {row.errors.map((error, idx) => (
                            <li
                              key={idx}
                              className="text-sm text-neutral-600 dark:text-neutral-400"
                            >
                              <span className="font-mono text-error-600 dark:text-error-400">
                                {error.field}:{' '}
                              </span>
                              {error.message}
                              {error.rawValue !== undefined && (
                                <span className="ml-2 font-mono text-xs text-neutral-400 dark:text-neutral-500">
                                  (valor: {String(error.rawValue)})
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ImportPreviewTable;
