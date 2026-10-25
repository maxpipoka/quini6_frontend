import { useState, useCallback, useEffect } from 'react';
import { getApiClient } from '@/lib/api/client';
import * as schemas from '@/lib/schemas';

interface UseImportHistoryOptions {
  initialPage?: number;
  initialPageSize?: number;
  initialSort?: { key: string; order: 'asc' | 'desc' };
  initialFilters?: {
    startDate?: string;
    endDate?: string;
    policy?: schemas.ImportPolicy;
  };
}

interface UseImportHistoryReturn {
  data: schemas.ImportHistoryResponse | null;
  isLoading: boolean;
  error: Error | null;
  page: number;
  setPage: (page: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  sort: { key: string; order: 'asc' | 'desc' };
  setSort: (sort: { key: string; order: 'asc' | 'desc' }) => void;
  filters: {
    startDate?: string;
    endDate?: string;
    policy?: schemas.ImportPolicy;
  };
  setFilters: (filters: UseImportHistoryOptions['initialFilters']) => void;
  refetch: () => Promise<void>;
}

export function useImportHistory(options: UseImportHistoryOptions = {}): UseImportHistoryReturn {
  const {
    initialPage = 1,
    initialPageSize = 20,
    initialSort = { key: 'date', order: 'desc' },
    initialFilters = {},
  } = options;

  const [data, setData] = useState<schemas.ImportHistoryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sort, setSort] = useState(initialSort);
  const [filters, setFilters] = useState(initialFilters);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const api = getApiClient();
      const params: schemas.ImportHistoryParams = {
        page,
        limit: pageSize,
        sort: sort.key as schemas.ImportHistoryParams['sort'],
        order: sort.order,
        startDate: filters.startDate,
        endDate: filters.endDate,
        policy: filters.policy,
      };

      const response = await api.getImportHistory(params);
      const validated = schemas.ImportHistoryResponseSchema.parse(response);
      setData(validated);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error al cargar historial'));
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, sort, filters]);

  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setPage(1);
  }, [pageSize, sort, filters]);

  return {
    data,
    isLoading,
    error,
    page,
    setPage,
    pageSize,
    setPageSize,
    sort,
    setSort,
    filters,
    setFilters,
    refetch,
  };
}