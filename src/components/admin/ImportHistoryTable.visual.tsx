import React from 'react';
import type { ImportHistoryResponse } from '@/lib/schemas';

interface ImportHistory {
  data: ImportHistoryResponse | null;
  isLoading: boolean;
  error: Error | null;
  page: number;
  setPage: (page: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  sort: { key: string; order: 'asc' | 'desc' };
  setSort: (sort: { key: string; order: 'asc' | 'desc' }) => void;
  refetch: () => Promise<void>;
}

const mockData: ImportHistory = {
  data: {
    data: [
      {
        importId: '11111111-1111-4111-8111-111111111111',
        fileName: 'draws-jan.csv',
        date: '2024-01-20T10:00:00Z',
        rowsProcessed: 10,
        succeeded: 10,
        failed: 0,
        policy: 'skip',
      },
      {
        importId: '22222222-2222-4222-8222-222222222222',
        fileName: 'draws-feb.csv',
        date: '2024-02-15T14:30:00Z',
        rowsProcessed: 15,
        succeeded: 12,
        failed: 3,
        policy: 'replace',
      },
      {
        importId: '33333333-3333-4333-8333-333333333333',
        fileName: 'draws-mar.csv',
        date: '2024-03-10T09:15:00Z',
        rowsProcessed: 8,
        succeeded: 8,
        failed: 0,
        policy: 'merge',
      },
    ],
    total: 3,
    totalPages: 1,
    page: 1,
    limit: 10,
  },
  isLoading: false,
  error: null,
  page: 1,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setPage: (_page: number) => {},
  pageSize: 10,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setPageSize: (_size: number) => {},
  sort: { key: 'date', order: 'desc' },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setSort: (_sort: { key: string; order: 'asc' | 'desc' }) => {},
  refetch: () => Promise.resolve(),
};

const mockEmptyData: ImportHistory = {
  data: { data: [], total: 0, totalPages: 0, page: 1, limit: 10 },
  isLoading: false,
  error: null,
  page: 1,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setPage: (_page: number) => {},
  pageSize: 10,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setPageSize: (_size: number) => {},
  sort: { key: 'date', order: 'desc' },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setSort: (_sort: { key: string; order: 'asc' | 'desc' }) => {},
  refetch: () => Promise.resolve(),
};

const mockLoadingData: ImportHistory = {
  data: null,
  isLoading: true,
  error: null,
  page: 1,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setPage: (_page: number) => {},
  pageSize: 10,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setPageSize: (_size: number) => {},
  sort: { key: 'date', order: 'desc' },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setSort: (_sort: { key: string; order: 'asc' | 'desc' }) => {},
  refetch: () => Promise.resolve(),
};

const mockErrorData: ImportHistory = {
  data: null,
  isLoading: false,
  error: new Error('Error de conexión'),
  page: 1,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setPage: (_page: number) => {},
  pageSize: 10,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setPageSize: (_size: number) => {},
  sort: { key: 'date', order: 'desc' },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setSort: (_sort: { key: string; order: 'asc' | 'desc' }) => {},
  refetch: () => Promise.resolve(),
};

const mockPaginationData: ImportHistory = {
  data: {
    data: Array.from({ length: 25 }, (_, i) => ({
      importId: `${String(i + 1).padStart(32, '0')}`,
      fileName: `draws-${i + 1}.csv`,
      date: '2024-01-20T10:00:00Z',
      rowsProcessed: 10,
      succeeded: 9,
      failed: 1,
      policy: 'skip',
    })),
    total: 25,
    totalPages: 3,
    page: 1,
    limit: 10,
  },
  isLoading: false,
  error: null,
  page: 1,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setPage: (_page: number) => {},
  pageSize: 10,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setPageSize: (_size: number) => {},
  sort: { key: 'date', order: 'desc' },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setSort: (_sort: { key: string; order: 'asc' | 'desc' }) => {},
  refetch: () => Promise.resolve(),
};

interface ImportHistoryTableProps {
  data: ImportHistory['data'];
  isLoading: ImportHistory['isLoading'];
  error: ImportHistory['error'];
  page: ImportHistory['page'];
  setPage: ImportHistory['setPage'];
  pageSize: ImportHistory['pageSize'];
  setPageSize: ImportHistory['setPageSize'];
  sort: ImportHistory['sort'];
  setSort: ImportHistory['setSort'];
  refetch: ImportHistory['refetch'];
}

const ImportHistoryTableVisualWrapper: React.FC<ImportHistoryTableProps> = ({
  data,
  isLoading,
  error,
  page,
  setPage,
  pageSize,
  setPageSize,
  sort,
  setSort,
  refetch,
}) => {
  const columns = [
    { key: 'fileName', header: 'Archivo', width: '25%' },
    { key: 'date', header: 'Fecha', width: '15%' },
    { key: 'processed', header: 'Procesados', align: 'center' as const, width: '10%' },
    { key: 'succeeded', header: 'Éxitos', align: 'center' as const, width: '10%' },
    { key: 'failed', header: 'Fallidos', align: 'center' as const, width: '10%' },
    { key: 'policy', header: 'Política', align: 'center' as const, width: '10%' },
    { key: 'actions', header: 'Acciones', align: 'center' as const, width: '10%' },
  ];

  const formatPolicy = (policy: string): string => {
    const labels: Record<string, string> = {
      skip: 'Omitir',
      replace: 'Reemplazar',
      merge: 'Fusionar',
    };
    return labels[policy] ?? policy;
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

  const getPolicyBadgeClass = (policy: string): string => {
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
            <span className="size-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></span>
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
          <svg
            className="text-error-500/50 mx-auto size-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <p className="mt-4 text-text-primary">Error al cargar el historial</p>
          <p className="mt-1 text-sm text-text-secondary">{error.message}</p>
          <button
            onClick={() => void refetch()}
            className="hover:bg-primary-500/90 mt-4 inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white"
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
          <svg
            className="mx-auto size-16 text-text-muted"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-text-primary">Sin importaciones</h3>
          <p className="mt-2 text-text-secondary">No hay importaciones registradas aún</p>
          <a
            href="/admin/imports/upload"
            className="hover:bg-primary-500/90 mt-6 inline-flex items-center gap-2 rounded-lg bg-primary-500 px-5 py-2.5 text-sm font-medium text-white"
          >
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
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
                    onClick={() =>
                      col.key !== 'actions' &&
                      setSort({
                        key: col.key,
                        order: sort.key === col.key && sort.order === 'asc' ? 'desc' : 'asc',
                      })
                    }
                  >
                    <div className="flex items-center justify-center gap-1">
                      {col.header}
                      {col.key !== 'actions' && (
                        <span className="inline-flex">
                          {sort.key === col.key ? (
                            sort.order === 'asc' ? (
                              <svg
                                className="size-3.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 15l7-7 7 7"
                                />
                              </svg>
                            ) : (
                              <svg
                                className="size-3.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
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
                  <td className="p-4 text-center text-sm font-medium text-success-500">
                    {importItem.succeeded}
                  </td>
                  <td className="p-4 text-center text-sm font-medium text-error-500">
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
                    <button
                      className="hover:text-primary-500/80 text-sm font-medium text-primary-500"
                      aria-label={`Ver errores de ${importItem.fileName}`}
                    >
                      <svg
                        className="mx-auto inline-block size-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </button>
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
                className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-text-primary focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
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
                        ? 'bg-primary-500 text-white'
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
};

export const ImportHistoryTableVisual: React.FC<{ state: string }> = ({ state }) => {
  let data = mockData;

  switch (state) {
    case 'empty':
      data = mockEmptyData;
      break;
    case 'loading':
      data = mockLoadingData;
      break;
    case 'error':
      data = mockErrorData;
      break;
    case 'pagination':
      data = mockPaginationData;
      break;
  }

  return (
    <ImportHistoryTableVisualWrapper
      data={data.data}
      isLoading={data.isLoading}
      error={data.error}
      page={data.page}
      setPage={data.setPage}
      pageSize={data.pageSize}
      setPageSize={data.setPageSize}
      sort={data.sort}
      setSort={data.setSort}
      refetch={data.refetch}
    />
  );
};
