import React from 'react';
import { ImportHistoryTable } from './ImportHistoryTable';

const mockData = {
  data: {
    data: [
      { importId: '11111111-1111-4111-8111-111111111111', fileName: 'draws-jan.csv', date: '2024-01-20T10:00:00Z', rowsProcessed: 10, succeeded: 10, failed: 0, policy: 'skip' as const },
      { importId: '22222222-2222-4222-8222-222222222222', fileName: 'draws-feb.csv', date: '2024-02-15T14:30:00Z', rowsProcessed: 15, succeeded: 12, failed: 3, policy: 'replace' as const },
      { importId: '33333333-3333-4333-8333-333333333333', fileName: 'draws-mar.csv', date: '2024-03-10T09:15:00Z', rowsProcessed: 8, succeeded: 8, failed: 0, policy: 'merge' as const },
    ],
    total: 3,
    totalPages: 1,
    page: 1,
    pageSize: 10,
  },
  isLoading: false,
  error: null,
  page: 1,
  setPage: () => {},
  pageSize: 10,
  setPageSize: () => {},
  sort: { key: 'date', order: 'desc' as const },
  setSort: () => {},
  refetch: () => {},
};

const mockEmptyData = {
  data: { data: [], total: 0, totalPages: 0, page: 1, pageSize: 10 },
  isLoading: false,
  error: null,
  page: 1,
  setPage: () => {},
  pageSize: 10,
  setPageSize: () => {},
  sort: { key: 'date', order: 'desc' as const },
  setSort: () => {},
  refetch: () => {},
};

const mockLoadingData = {
  data: null,
  isLoading: true,
  error: null,
  page: 1,
  setPage: () => {},
  pageSize: 10,
  setPageSize: () => {},
  sort: { key: 'date', order: 'desc' as const },
  setSort: () => {},
  refetch: () => {},
};

const mockErrorData = {
  data: null,
  isLoading: false,
  error: new Error('Error de conexión'),
  page: 1,
  setPage: () => {},
  pageSize: 10,
  setPageSize: () => {},
  sort: { key: 'date', order: 'desc' as const },
  setSort: () => {},
  refetch: () => {},
};

const mockPaginationData = {
  data: {
    data: Array.from({ length: 25 }, (_, i) => ({
      importId: `${String(i + 1).padStart(32, '0')}`,
      fileName: `draws-${i + 1}.csv`,
      date: '2024-01-20T10:00:00Z',
      rowsProcessed: 10,
      succeeded: 9,
      failed: 1,
      policy: 'skip' as const,
    })),
    total: 25,
    totalPages: 3,
    page: 1,
    pageSize: 10,
  },
  isLoading: false,
  error: null,
  page: 1,
  setPage: () => {},
  pageSize: 10,
  setPageSize: () => {},
  sort: { key: 'date', order: 'desc' as const },
  setSort: () => {},
  refetch: () => {},
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
    <ImportHistoryTableWrapper data={data} />
  );
};

const ImportHistoryTableWrapper: React.FC<{ data: typeof mockData }> = ({ data }) => {
  return (
    <div style={{ width: '100%', minWidth: '800px' }}>
      <ImportHistoryTable />
    </div>
  );
};