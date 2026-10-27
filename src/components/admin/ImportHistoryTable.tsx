import { useCallback, useMemo } from 'react';
import type * as schemas from '@/lib/schemas';
import { useImportHistory } from '@/hooks/useImportHistory';
import { ImportErrorDetails } from './ImportErrorDetails';
import { ChevronDownIcon, ChevronUpIcon, FileIcon, AlertCircleIcon } from './icons';

export function ImportHistoryTable() {
  const { data, isLoading, error, page, setPage, pageSize, setPageSize, sort, setSort, refetch } =
    useImportHistory();

  const columns = useMemo(
    () => [
      { key: 'fileName', header: 'Archivo', width: '25%' },
      { key: 'date', header: 'Fecha', width: '15%' },
      { key: 'processed', header: 'Procesados', align: 'center' as const, width: '10%' },
      { key: 'succeeded', header: 'Éxitos', align: 'center' as const, width: '10%' },
      { key: 'failed', header: 'Fallidos', align: 'center' as const, width: '10%' },
      { key: 'policy', header: 'Política', align: 'center' as const, width: '10%' },
      { key: 'actions', header: '', align: 'center' as const, width: '10%' },
    ],
    []
  );

  const handleSort = useCallback(
    (key: string) => {
      if (sort.key === key) {
        setSort({ key, order: sort.order === 'asc' ? 'desc' : 'asc' });
      } else {
        setSort({ key, order: 'asc' });
      }
    },
    [sort, setSort]
  );

  const formatPolicy = (policy: schemas.ImportPolicy): string => {
    const labels: Record<schemas.ImportPolicy, string> = {
      skip: 'Omitir',
      replace: 'Reemplazar',
      merge: 'Fusionar',
    };
    return labels[policy] || policy;
  };

  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPolicyBadgeClass = (policy: schemas.ImportPolicy): string => {
    switch (policy) {
      case 'skip':
        return 'bg-amber-100 text-amber-800';
      case 'replace':
        return 'bg-blue-100 text-blue-800';
      case 'merge':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };

  if (isLoading && !data) {
    return (
      <div className="overflow-hidden rounded-xl border border-border bg-surface-elevated">
        <div className="p-6 text-center">
          <div className="inline-flex items-center gap-3 text-text-secondary">
            <span className="loading loading-spinner loading-lg"></span>
            <span>Cargando historial...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="overflow-hidden rounded-xl border border-border bg-surface-elevated">
        <div className="p-6 text-center">
          <AlertCircleIcon className="text-error/50 mx-auto size-12" />
          <p className="mt-4 text-text-primary">Error al cargar el historial</p>
          <p className="mt-1 text-sm text-text-secondary">{error.message}</p>
          <button
            onClick={refetch}
            className="bg-primary hover:bg-primary/90 mt-4 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <div className="overflow-hidden rounded-xl border border-border bg-surface-elevated">
        <div className="p-12 text-center">
          <FileIcon className="mx-auto size-16 text-text-muted" />
          <h3 className="mt-4 text-lg font-medium text-text-primary">Sin importaciones</h3>
          <p className="mt-2 text-text-secondary">No hay importaciones registradas aún</p>
          <a
            href="/admin/imports/upload"
            className="bg-primary hover:bg-primary/90 mt-6 inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-white"
          >
            <FileIcon className="size-4" />
            Primera importación
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-border bg-surface-elevated">
        <div className="overflow-x-auto">
          <table className="w-full" role="table">
            <thead className="bg-surface">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    scope="col"
                    className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary ${col.align === 'center' ? 'text-center' : ''} cursor-pointer hover:bg-surface-elevated`}
                    style={{ width: col.width }}
                    onClick={() => col.key !== 'actions' && handleSort(col.key)}
                  >
                    <div className="flex items-center justify-center gap-1">
                      {col.header}
                      {col.key !== 'actions' && (
                        <span className="inline-flex">
                          {sort.key === col.key ? (
                            sort.order === 'asc' ? (
                              <ChevronUpIcon className="size-3.5" />
                            ) : (
                              <ChevronDownIcon className="size-3.5" />
                            )
                          ) : (
                            <span className="size-3.5 opacity-0" aria-hidden="true" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border" id="history-table-body">
              {data.data.map((importItem) => (
                <tr key={importItem.importId} className="transition-colors hover:bg-neutral-50">
                  <td className="p-4 font-mono text-sm text-text-primary">{importItem.fileName}</td>
                  <td className="p-4 text-sm text-text-secondary">{formatDate(importItem.date)}</td>
                  <td className="p-4 text-center text-sm text-text-primary">
                    {importItem.rowsProcessed}
                  </td>
                  <td className="text-success p-4 text-center text-sm font-medium">
                    {importItem.succeeded}
                  </td>
                  <td className="text-error p-4 text-center text-sm font-medium">
                    {importItem.failed}
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getPolicyBadgeClass(importItem.policy)}`}
                    >
                      {formatPolicy(importItem.policy)}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <ImportErrorDetails importId={importItem.importId} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {data.totalPages > 1 && (
          <div className="flex flex-col gap-4 border-t border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <label htmlFor="page-size" className="font-medium">
                Mostrar:
              </label>
              <select
                id="page-size"
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="focus:border-primary focus:ring-primary rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-text-primary focus:outline-none focus:ring-1"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span>de {data.total} registros</span>
            </div>

            <nav className="flex items-center justify-center gap-2" aria-label="Paginación">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="rounded-lg bg-surface px-3 py-1.5 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-elevated disabled:cursor-not-allowed disabled:opacity-50"
              >
                Anterior
              </button>

              {Array.from({ length: Math.min(5, data.totalPages) }, (_, i) => {
                let pageNum: number;
                if (data.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= data.totalPages - 2) {
                  pageNum = data.totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                      pageNum === page
                        ? 'bg-primary text-white'
                        : 'text-text-secondary hover:bg-surface-elevated'
                    }`}
                    aria-current={pageNum === page ? 'page' : undefined}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => setPage(page + 1)}
                disabled={page === data.totalPages}
                className="rounded-lg bg-surface px-3 py-1.5 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-elevated disabled:cursor-not-allowed disabled:opacity-50"
              >
                Siguiente
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}
