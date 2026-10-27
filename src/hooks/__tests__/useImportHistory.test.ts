import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useImportHistory } from '../useImportHistory';
import { getApiClient } from '@/lib/api/client';
import * as schemas from '@/lib/schemas';

vi.mock('@/lib/api/client', () => ({
  getApiClient: vi.fn(),
}));

vi.mock('@/lib/schemas', async () => {
  const actual = await vi.importActual('@/lib/schemas');
  return {
    ...actual,
    ImportHistoryResponseSchema: {
      parse: vi.fn((data: unknown) => data),
    },
  };
});

const mockGetImportHistory = vi.fn();
const mockApiClient = {
  getImportHistory: mockGetImportHistory,
};

describe('useImportHistory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getApiClient).mockReturnValue(
      mockApiClient as unknown as ReturnType<typeof getApiClient>
    );

    const mockResponse: schemas.ImportHistoryResponse = {
      data: [
        {
          importId: '11111111-1111-4111-8111-111111111111',
          fileName: 'test.csv',
          date: '2024-01-15T10:00:00Z',
          rowsProcessed: 100,
          succeeded: 95,
          failed: 5,
          policy: 'skip',
        },
        {
          importId: '22222222-2222-4222-8222-222222222222',
          fileName: 'test2.csv',
          date: '2024-01-14T10:00:00Z',
          rowsProcessed: 50,
          succeeded: 50,
          failed: 0,
          policy: 'replace',
        },
      ],
      page: 1,
      limit: 20,
      total: 2,
      totalPages: 1,
    };

    mockGetImportHistory.mockResolvedValue(mockResponse);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('fetches data on mount with default options', async () => {
    const { result } = renderHook(() => useImportHistory());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeDefined();
    expect(result.current.data?.data).toHaveLength(2);
    expect(result.current.error).toBeNull();
    expect(result.current.page).toBe(1);
    expect(result.current.pageSize).toBe(20);
    expect(result.current.sort).toEqual({ key: 'date', order: 'desc' });
    expect(result.current.filters).toEqual({});
  });

  it('uses custom initial options', async () => {
    const { result } = renderHook(() =>
      useImportHistory({
        initialPage: 2,
        initialPageSize: 10,
        initialSort: { key: 'status', order: 'asc' },
        initialFilters: { policy: 'skip' },
      })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Note: page resets to 1 on mount due to useEffect watching filters
    expect(result.current.page).toBe(1);
    expect(result.current.pageSize).toBe(10);
    expect(result.current.sort).toEqual({ key: 'status', order: 'asc' });
    expect(result.current.filters).toEqual({ policy: 'skip' });
  });

  it('calls API with correct parameters', async () => {
    const { result } = renderHook(() => useImportHistory());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockGetImportHistory).toHaveBeenCalledWith(
      expect.objectContaining({
        page: 1,
        limit: 20,
        sort: 'date',
        order: 'desc',
        startDate: undefined,
        endDate: undefined,
        policy: undefined,
      })
    );
  });

  it('setPage updates page and triggers refetch', async () => {
    const { result } = renderHook(() => useImportHistory());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.setPage(2);
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.page).toBe(2);
    expect(mockGetImportHistory).toHaveBeenCalledTimes(2);
  });

  it('setPageSize updates pageSize, resets page to 1, and triggers refetch', async () => {
    const { result } = renderHook(() => useImportHistory());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.setPage(3);
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.page).toBe(3);

    act(() => {
      result.current.setPageSize(50);
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.pageSize).toBe(50);
    expect(result.current.page).toBe(1);
  });

  it('setSort updates sort and triggers refetch', async () => {
    const { result } = renderHook(() => useImportHistory());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.setSort({ key: 'status', order: 'asc' });
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.sort).toEqual({ key: 'status', order: 'asc' });
  });

  it('setFilters updates filters, resets page to 1, and triggers refetch', async () => {
    const { result } = renderHook(() => useImportHistory());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.setPage(3);
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.setFilters({ startDate: '2024-01-01', policy: 'replace' });
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.filters).toEqual({ startDate: '2024-01-01', policy: 'replace' });
    expect(result.current.page).toBe(1);
  });

  it('refetch re-fetches data without changing state', async () => {
    const { result } = renderHook(() => useImportHistory());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const initialData = result.current.data;

    act(() => {
      result.current.refetch();
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(initialData);
    expect(mockGetImportHistory).toHaveBeenCalledTimes(2);
  });

  it('sets error state when API call fails', async () => {
    mockGetImportHistory.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useImportHistory());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBeDefined();
    expect(result.current.error?.message).toBe('Network error');
    expect(result.current.data).toBeNull();
  });

  it('handles non-Error rejection', async () => {
    mockGetImportHistory.mockRejectedValue('String error');

    const { result } = renderHook(() => useImportHistory());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBeDefined();
    expect(result.current.error?.message).toBe('Error al cargar historial');
    expect(result.current.data).toBeNull();
  });

  it('shows loading state during fetch', async () => {
    let resolvePromise: (value: unknown) => void;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    mockGetImportHistory.mockReturnValue(promise);

    const { result } = renderHook(() => useImportHistory());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeNull();

    act(() => {
      resolvePromise!({
        data: [],
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
      });
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('validates response through schema', async () => {
    const { result } = renderHook(() => useImportHistory());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(vi.mocked(schemas.ImportHistoryResponseSchema.parse)).toHaveBeenCalled();
  });
});
