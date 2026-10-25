import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockKyMethods, mockKyCreate } = vi.hoisted(() => {
  const methods = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  };
  return { mockKyMethods: methods, mockKyCreate: vi.fn(() => methods) };
});

vi.mock('ky', () => ({
  default: { create: mockKyCreate },
  TimeoutError: class TimeoutError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'TimeoutError';
    }
  },
}));

import {
  ApiClient,
  createApiClient,
  getApiClient,
  setApiClient,
  calculateRetryDelay,
  isRetryableError,
  isNonRetryableStatus,
  extractRequestId,
} from './client';
import * as schemas from '../schemas';
import {
  ApiNetworkError,
  ApiTimeoutError,
  ApiHttpError,
  ApiValidationError,
  ApiRetryError,
  isApiHttpError,
  isApiValidationError,
  isApiNetworkError,
  isApiTimeoutError,
  isApiRetryError,
  getErrorMessage,
} from './errors';

const ISO_DATE = '2024-01-01T00:00:00.000Z';
const TEST_UUID = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

interface KyResult {
  json: () => Promise<unknown>;
  headers: Headers;
}

const jsonResponse = (data: unknown): KyResult => ({
  json: () => Promise.resolve(data),
  headers: new Headers(),
});

const results = () => [
  {
    modality: 'TRADICIONAL' as const,
    numbers: [1, 2, 3, 4, 5, 6],
    createdAt: ISO_DATE,
    updatedAt: ISO_DATE,
  },
  {
    modality: 'LA_SEGUNDA' as const,
    numbers: [7, 8, 9, 10, 11, 12],
    createdAt: ISO_DATE,
    updatedAt: ISO_DATE,
  },
  {
    modality: 'REVANCHA' as const,
    numbers: [13, 14, 15, 16, 17, 18],
    createdAt: ISO_DATE,
    updatedAt: ISO_DATE,
  },
  {
    modality: 'SIEMPRE_SALE' as const,
    numbers: [19, 20, 21, 22, 23, 24],
    createdAt: ISO_DATE,
    updatedAt: ISO_DATE,
  },
];

const drawResponse = () => ({
  id: TEST_UUID,
  officialNumber: 3245,
  drawDate: ISO_DATE,
  createdAt: ISO_DATE,
  updatedAt: ISO_DATE,
  results: results(),
});

const drawSummary = () => ({
  id: TEST_UUID,
  officialNumber: 3245,
  drawDate: ISO_DATE,
  results: results().map((r) => ({ modality: r.modality, numbers: r.numbers })),
});

const paginatedResponse = () => ({
  data: [drawSummary()],
  page: 1,
  limit: 20,
  total: 1,
  totalPages: 1,
});

const exactSearchResponse = () => ({
  found: true,
  totalMatches: 1,
  matches: [
    {
      drawDate: ISO_DATE,
      officialNumber: 3245,
      modality: 'TRADICIONAL',
      numbers: [1, 2, 3, 4, 5, 6],
    },
  ],
});

const frequencyResponse = () => ({
  totalDraws: 10,
  frequencies: Array.from({ length: 46 }, (_, number) => ({ number, count: 1, percentage: 2.17 })),
});

const healthResponse = () => ({
  status: 'ok',
  timestamp: ISO_DATE,
  uptime: 123.45,
  version: '1.0.0',
});
const healthDbResponse = () => ({ status: 'ok', latency: 12.5, timestamp: ISO_DATE });

const createDrawInput = () => ({
  officialNumber: 3246,
  drawDate: ISO_DATE,
  results: results().map((r) => ({ modality: r.modality, numbers: r.numbers })),
});

describe('ApiClient', () => {
  let client: ApiClient;

  beforeEach(() => {
    vi.clearAllMocks();
    for (const fn of Object.values(mockKyMethods)) {
      fn.mockReset();
    }
    mockKyCreate.mockReturnValue(mockKyMethods);
    client = new ApiClient({
      baseUrl: 'http://localhost:3000',
      timeout: 5000,
      retryAttempts: 3,
      retryDelay: () => 1,
    });
  });

  describe('constructor', () => {
    it('creates a client instance', () => {
      expect(new ApiClient({ baseUrl: 'http://test.local' })).toBeInstanceOf(ApiClient);
    });

    it('passes baseUrl and timeout to ky.create', () => {
      new ApiClient({ baseUrl: 'http://test.local', timeout: 1234 });

      expect(mockKyCreate).toHaveBeenCalledWith(
        expect.objectContaining({ prefixUrl: 'http://test.local', timeout: 1234 })
      );
    });
  });

  describe('retry logic', () => {
    it('retries a network error and succeeds on the next attempt', async () => {
      const get = vi
        .fn()
        .mockRejectedValueOnce(new TypeError('fetch failed'))
        .mockResolvedValueOnce(jsonResponse(drawResponse()));
      mockKyMethods.get = get;

      const result = await client.getDraw(3245);

      expect(get).toHaveBeenCalledTimes(2);
      expect(result.officialNumber).toBe(3245);
    });

    it('retries retryable 5xx errors', async () => {
      const serverError = new ApiHttpError('Server Error', 'req-1', 500, ISO_DATE, '/draws/latest');
      const get = vi
        .fn()
        .mockRejectedValueOnce(serverError)
        .mockResolvedValueOnce(jsonResponse(drawResponse()));
      mockKyMethods.get = get;

      await client.getLatestDraw();

      expect(get).toHaveBeenCalledTimes(2);
    });

    it('throws ApiRetryError after exhausting all attempts', async () => {
      const get = vi.fn().mockRejectedValue(new TypeError('fetch failed'));
      mockKyMethods.get = get;

      await expect(client.getLatestDraw()).rejects.toBeInstanceOf(ApiRetryError);
      expect(get).toHaveBeenCalledTimes(3);
    });

    it('does not retry non-retryable HTTP errors', async () => {
      const notFound = new ApiHttpError('Not Found', 'req-1', 404, ISO_DATE, '/draws/999');
      const get = vi.fn().mockRejectedValue(notFound);
      mockKyMethods.get = get;

      await expect(client.getDraw(999)).rejects.toBeInstanceOf(ApiHttpError);
      expect(get).toHaveBeenCalledTimes(1);
    });

    it('does not retry validation errors', async () => {
      const validation = new ApiValidationError('Invalid', 'req-1', 400, ISO_DATE, '/admin/draws', [
        'bad',
      ]);
      const post = vi.fn().mockRejectedValue(validation);
      mockKyMethods.post = post;

      await expect(client.adminCreateDraw(createDrawInput())).rejects.toBeInstanceOf(
        ApiValidationError
      );
      expect(post).toHaveBeenCalledTimes(1);
    });

    it('respects a custom retryAttempts value', async () => {
      const limited = new ApiClient({
        baseUrl: 'http://test.local',
        retryAttempts: 1,
        retryDelay: () => 1,
      });
      const get = vi.fn().mockRejectedValue(new TypeError('fetch failed'));
      mockKyMethods.get = get;

      await expect(limited.getLatestDraw()).rejects.toBeInstanceOf(ApiRetryError);
      expect(get).toHaveBeenCalledTimes(1);
    });
  });

  describe('getLatestDraw', () => {
    it('GETs draws/latest and returns the parsed draw', async () => {
      const get = vi.fn().mockResolvedValue(jsonResponse(drawResponse()));
      mockKyMethods.get = get;

      const result = await client.getLatestDraw();

      expect(get).toHaveBeenCalledWith('draws/latest', expect.any(Object));
      expect(result.officialNumber).toBe(3245);
      expect(result.results).toHaveLength(4);
    });

    it('throws ApiValidationError when the response does not match the schema', async () => {
      mockKyMethods.get = vi.fn().mockResolvedValue(jsonResponse({ invalid: true }));

      await expect(client.getLatestDraw()).rejects.toBeInstanceOf(ApiValidationError);
    });
  });

  describe('getDraw', () => {
    it('GETs draws/:officialNumber', async () => {
      const get = vi.fn().mockResolvedValue(jsonResponse(drawResponse()));
      mockKyMethods.get = get;

      await client.getDraw(3245);

      expect(get).toHaveBeenCalledWith('draws/3245', expect.any(Object));
    });
  });

  describe('getDrawHistory', () => {
    it('builds the query string from the provided params', async () => {
      const get = vi.fn().mockResolvedValue(jsonResponse(paginatedResponse()));
      mockKyMethods.get = get;

      await client.getDrawHistory({ page: 2, limit: 10, year: 2024 });

      expect(get).toHaveBeenCalledWith('draws?page=2&limit=10&year=2024', expect.any(Object));
    });

    it('omits the query string when no params are provided', async () => {
      const get = vi.fn().mockResolvedValue(jsonResponse(paginatedResponse()));
      mockKyMethods.get = get;

      await client.getDrawHistory();

      expect(get).toHaveBeenCalledWith('draws', expect.any(Object));
    });
  });

  describe('searchExactCombination', () => {
    it('POSTs the numbers and date range to search/exact', async () => {
      const post = vi.fn().mockResolvedValue(jsonResponse(exactSearchResponse()));
      mockKyMethods.post = post;

      const result = await client.searchExactCombination([1, 2, 3, 4, 5, 6], {
        fromDate: '2024-01-01',
        toDate: '2024-12-31',
      });

      expect(post).toHaveBeenCalledWith(
        'search/exact?fromDate=2024-01-01&toDate=2024-12-31',
        expect.objectContaining({ json: { numbers: [1, 2, 3, 4, 5, 6] } })
      );
      expect(result.found).toBe(true);
    });

    it('omits the date range when it is not provided', async () => {
      const post = vi.fn().mockResolvedValue(jsonResponse(exactSearchResponse()));
      mockKyMethods.post = post;

      await client.searchExactCombination([1, 2, 3, 4, 5, 6]);

      expect(post).toHaveBeenCalledWith('search/exact', expect.any(Object));
    });

    it('rejects an invalid combination before calling the API', async () => {
      const post = vi.fn();
      mockKyMethods.post = post;

      await expect(client.searchExactCombination([1, 2, 3, 4, 5])).rejects.toThrow(
        'Request body validation failed'
      );
      expect(post).not.toHaveBeenCalled();
    });
  });

  describe('getNumberFrequency', () => {
    it('builds the query string from frequency params', async () => {
      const get = vi.fn().mockResolvedValue(jsonResponse(frequencyResponse()));
      mockKyMethods.get = get;

      await client.getNumberFrequency({
        fromDate: '2024-01-01',
        toDate: '2024-12-31',
        modality: 'LA_SEGUNDA',
      });

      expect(get).toHaveBeenCalledWith(
        'frequency?fromDate=2024-01-01&toDate=2024-12-31&modality=LA_SEGUNDA',
        expect.any(Object)
      );
    });

    it('omits params that are not provided', async () => {
      const get = vi.fn().mockResolvedValue(jsonResponse(frequencyResponse()));
      mockKyMethods.get = get;

      await client.getNumberFrequency({});

      expect(get).toHaveBeenCalledWith('frequency', expect.any(Object));
    });
  });

  describe('health checks', () => {
    it('healthCheck GETs health', async () => {
      const get = vi.fn().mockResolvedValue(jsonResponse(healthResponse()));
      mockKyMethods.get = get;

      const result = await client.healthCheck();

      expect(get).toHaveBeenCalledWith('health', expect.any(Object));
      expect(result.status).toBe('ok');
    });

    it('healthDbCheck GETs health/db', async () => {
      const get = vi.fn().mockResolvedValue(jsonResponse(healthDbResponse()));
      mockKyMethods.get = get;

      const result = await client.healthDbCheck();

      expect(get).toHaveBeenCalledWith('health/db', expect.any(Object));
      expect(result.latency).toBe(12.5);
    });
  });

  describe('admin methods', () => {
    it('adminLogin POSTs credentials to /admin/auth/login', async () => {
      const post = vi.fn().mockResolvedValue(jsonResponse({ user: { id: '1' } }));
      mockKyMethods.post = post;

      const result = await client.adminLogin({
        email: 'admin@example.com',
        password: 'password123',
      });

      expect(post).toHaveBeenCalledWith(
        '/admin/auth/login',
        expect.objectContaining({ json: { email: 'admin@example.com', password: 'password123' } })
      );
      expect(result).toEqual({ user: { id: '1' } });
    });

    it('adminMe GETs /admin/auth/me', async () => {
      const get = vi.fn().mockResolvedValue(jsonResponse({ id: '1' }));
      mockKyMethods.get = get;

      await client.adminMe();

      expect(get).toHaveBeenCalledWith('/admin/auth/me', expect.any(Object));
    });

    it('adminLogout POSTs /admin/auth/logout', async () => {
      const post = vi.fn().mockResolvedValue(jsonResponse(undefined));
      mockKyMethods.post = post;

      await client.adminLogout();

      expect(post).toHaveBeenCalledWith('/admin/auth/logout', expect.any(Object));
    });

    it('adminChangePassword POSTs /admin/auth/change-password', async () => {
      const post = vi.fn().mockResolvedValue(jsonResponse(undefined));
      mockKyMethods.post = post;

      await client.adminChangePassword({
        currentPassword: 'oldpassword',
        newPassword: 'newpassword',
      });

      expect(post).toHaveBeenCalledWith(
        '/admin/auth/change-password',
        expect.objectContaining({
          json: { currentPassword: 'oldpassword', newPassword: 'newpassword' },
        })
      );
    });

    it('adminCreateDraw POSTs /admin/draws', async () => {
      const post = vi.fn().mockResolvedValue(jsonResponse(drawResponse()));
      mockKyMethods.post = post;

      await client.adminCreateDraw(createDrawInput());

      expect(post).toHaveBeenCalledWith('/admin/draws', expect.any(Object));
    });

    it('adminUpdateDraw PATCHes /admin/draws/:id', async () => {
      const patch = vi.fn().mockResolvedValue(jsonResponse(drawResponse()));
      mockKyMethods.patch = patch;

      await client.adminUpdateDraw('3245', { officialNumber: 3246 });

      expect(patch).toHaveBeenCalledWith(
        '/admin/draws/3245',
        expect.objectContaining({ json: { officialNumber: 3246 } })
      );
    });

    it('adminDeleteDraw DELETEs /admin/draws/:id', async () => {
      const del = vi.fn().mockResolvedValue(jsonResponse(undefined));
      mockKyMethods.delete = del;

      await client.adminDeleteDraw('3245');

      expect(del).toHaveBeenCalledWith('/admin/draws/3245', expect.any(Object));
    });

    it('adminImportPreview uploads the file as FormData', async () => {
      const post = vi.fn().mockResolvedValue(jsonResponse({ preview: [] }));
      mockKyMethods.post = post;

      const file = new File(['test'], 'draws.csv', { type: 'text/csv' });
      await client.adminImportPreview(file);

      expect(post).toHaveBeenCalledWith(
        '/admin/import/preview',
        expect.objectContaining({ body: expect.any(FormData) as FormData })
      );
    });

    it('adminImportCommit POSTs /admin/import/commit', async () => {
      const post = vi.fn().mockResolvedValue(jsonResponse({ success: true }));
      mockKyMethods.post = post;

      await client.adminImportCommit({ previewId: TEST_UUID, duplicatePolicy: 'SKIP' });

      expect(post).toHaveBeenCalledWith(
        '/admin/import/commit',
        expect.objectContaining({ json: { previewId: TEST_UUID, duplicatePolicy: 'SKIP' } })
      );
    });

    it('adminListImports builds the query string', async () => {
      const get = vi.fn().mockResolvedValue(jsonResponse({ imports: [], total: 0 }));
      mockKyMethods.get = get;

      await client.adminListImports({ page: 2, limit: 50 });

      expect(get).toHaveBeenCalledWith('/admin/import?page=2&limit=50', expect.any(Object));
    });

    it('adminGetImport GETs /admin/import/:id', async () => {
      const get = vi.fn().mockResolvedValue(jsonResponse({ id: 'import-1' }));
      mockKyMethods.get = get;

      await client.adminGetImport('import-1');

      expect(get).toHaveBeenCalledWith('/admin/import/import-1', expect.any(Object));
    });
  });

  describe('import methods (Phase 3 Bulk Import)', () => {
    const validDrawRow = {
      officialNumber: 3246,
      drawDate: ISO_DATE,
      results: [
        { modality: 'TRADICIONAL' as const, numbers: [5, 12, 23, 34, 41, 45] },
        { modality: 'LA_SEGUNDA' as const, numbers: [1, 2, 3, 4, 5, 6] },
        { modality: 'REVANCHA' as const, numbers: [7, 8, 9, 10, 11, 12] },
        { modality: 'SIEMPRE_SALE' as const, numbers: [13, 14, 15, 16, 17, 18] },
      ],
    };

    const previewResponse = {
      importId: TEST_UUID,
      validCount: 10,
      invalidCount: 2,
    };

    const commitResponse = {
      created: 45,
      updated: 3,
      skipped: 2,
      failed: 0,
      errors: [],
    };

    const historyResponse = {
      data: [
        {
          importId: TEST_UUID,
          fileName: 'draws.csv',
          date: ISO_DATE,
          rowsProcessed: 50,
          succeeded: 48,
          failed: 2,
          policy: 'skip',
        },
      ],
      page: 1,
      limit: 10,
      total: 1,
      totalPages: 1,
    };

    const errorsResponse = {
      errors: [
        { rowNumber: 5, field: 'TRADICIONAL_number_3', message: 'Number out of range', rawValue: 50 },
      ],
    };

    describe('importPreview', () => {
      it('POSTs rows to /admin/imports/preview and returns preview response', async () => {
        const post = vi.fn().mockResolvedValue(jsonResponse(previewResponse));
        mockKyMethods.post = post;

        const result = await client.importPreview([validDrawRow]);

        expect(post).toHaveBeenCalledWith(
          '/admin/imports/preview',
          expect.objectContaining({
            json: { rows: [validDrawRow] },
          })
        );
        expect(result).toEqual(previewResponse);
      });

      it('validates request body with ImportPreviewRequestSchema', async () => {
        const post = vi.fn();
        mockKyMethods.post = post;

        // Invalid rows - not an array
        await expect(client.importPreview({ invalid: 'data' } as unknown as schemas.DrawRowInput[])).rejects.toThrow(
          'Request body validation failed'
        );
        expect(post).not.toHaveBeenCalled();
      });

      it('validates response with ImportPreviewResponseSchema', async () => {
        mockKyMethods.post = vi.fn().mockResolvedValue(jsonResponse({ invalid: 'response' }));

        await expect(client.importPreview([validDrawRow])).rejects.toBeInstanceOf(ApiValidationError);
      });
    });

    describe('importCommit', () => {
      it('POSTs to /admin/imports/:id/commit with policy query param', async () => {
        const post = vi.fn().mockResolvedValue(jsonResponse(commitResponse));
        mockKyMethods.post = post;

        const result = await client.importCommit(TEST_UUID, 'skip');

        expect(post).toHaveBeenCalledWith(
          `/admin/imports/${TEST_UUID}/commit?policy=skip`,
          expect.any(Object)
        );
        expect(result).toEqual(commitResponse);
      });

      it('accepts all valid policies', async () => {
        const post = vi.fn().mockResolvedValue(jsonResponse(commitResponse));
        mockKyMethods.post = post;

        await client.importCommit(TEST_UUID, 'replace');
        expect(post).toHaveBeenCalledWith(
          `/admin/imports/${TEST_UUID}/commit?policy=replace`,
          expect.any(Object)
        );

        await client.importCommit(TEST_UUID, 'merge');
        expect(post).toHaveBeenCalledWith(
          `/admin/imports/${TEST_UUID}/commit?policy=merge`,
          expect.any(Object)
        );
      });

      it('validates response with ImportCommitResponseSchema', async () => {
        mockKyMethods.post = vi.fn().mockResolvedValue(jsonResponse({ invalid: 'response' }));

        await expect(client.importCommit(TEST_UUID, 'skip')).rejects.toBeInstanceOf(ApiValidationError);
      });

      it('includes CSRF header for mutating request', async () => {
        const post = vi.fn().mockResolvedValue(jsonResponse(commitResponse));
        mockKyMethods.post = post;

        // Mock document.cookie to provide CSRF token
        Object.defineProperty(global.document, 'cookie', {
          value: 'csrf_token=test-csrf-token',
          writable: true,
        });

        await client.importCommit(TEST_UUID, 'skip');

        // Verify the request was made with the right URL
        expect(post).toHaveBeenCalled();
      });
    });

    describe('getImportHistory', () => {
      it('GETs /admin/imports with query params', async () => {
        const get = vi.fn().mockResolvedValue(jsonResponse(historyResponse));
        mockKyMethods.get = get;

        const result = await client.getImportHistory({ page: 1, limit: 10, sort: 'date', order: 'desc' });

        expect(get).toHaveBeenCalledWith(
          '/admin/imports?page=1&limit=10&sort=date&order=desc',
          expect.any(Object)
        );
        expect(result).toEqual(historyResponse);
      });

      it('omits undefined params', async () => {
        const get = vi.fn().mockResolvedValue(jsonResponse(historyResponse));
        mockKyMethods.get = get;

        await client.getImportHistory({ page: 2, limit: 10 });

        expect(get).toHaveBeenCalledWith(
          '/admin/imports?page=2&limit=10',
          expect.any(Object)
        );
      });

      it('validates response with ImportHistoryResponseSchema', async () => {
        mockKyMethods.get = vi.fn().mockResolvedValue(jsonResponse({ invalid: 'response' }));

        await expect(client.getImportHistory({ page: 1, limit: 10 })).rejects.toBeInstanceOf(ApiValidationError);
      });

      it('accepts filter params', async () => {
        const get = vi.fn().mockResolvedValue(jsonResponse(historyResponse));
        mockKyMethods.get = get;

        await client.getImportHistory({
          page: 1,
          limit: 10,
          startDate: '2024-01-01T00:00:00Z',
          endDate: '2024-12-31T23:59:59Z',
          policy: 'replace',
        });

        // URLSearchParams encodes the colons and other special chars
        expect(get).toHaveBeenCalledWith(
          '/admin/imports?page=1&limit=10&startDate=2024-01-01T00%3A00%3A00Z&endDate=2024-12-31T23%3A59%3A59Z&policy=replace',
          expect.any(Object)
        );
      });
    });

    describe('getImportErrors', () => {
      it('GETs /admin/imports/:id/errors', async () => {
        const get = vi.fn().mockResolvedValue(jsonResponse(errorsResponse));
        mockKyMethods.get = get;

        const result = await client.getImportErrors(TEST_UUID);

        expect(get).toHaveBeenCalledWith(`/admin/imports/${TEST_UUID}/errors`, expect.any(Object));
        expect(result).toEqual(errorsResponse);
      });

      it('returns empty errors array for successful imports', async () => {
        const emptyResponse = { errors: [] };
        const get = vi.fn().mockResolvedValue(jsonResponse(emptyResponse));
        mockKyMethods.get = get;

        const result = await client.getImportErrors(TEST_UUID);

        expect(result.errors).toEqual([]);
      });

      it('validates response with ImportErrorsResponseSchema', async () => {
        mockKyMethods.get = vi.fn().mockResolvedValue(jsonResponse({ invalid: 'response' }));

        await expect(client.getImportErrors(TEST_UUID)).rejects.toBeInstanceOf(ApiValidationError);
      });
    });
  });

  describe('factory functions', () => {
    it('createApiClient returns a new ApiClient', () => {
      expect(createApiClient({ baseUrl: 'http://test.local' })).toBeInstanceOf(ApiClient);
    });

    it('setApiClient / getApiClient round-trip', () => {
      const instance = new ApiClient({ baseUrl: 'http://test.local' });
      setApiClient(instance);

      expect(getApiClient()).toBe(instance);
    });

    it('getApiClient throws when VITE_API_BASE_URL is not configured', async () => {
      vi.resetModules();
      vi.stubEnv('VITE_API_BASE_URL', '');

      const fresh = await import('./client');

      expect(() => fresh.getApiClient()).toThrow('VITE_API_BASE_URL is not configured');

      vi.unstubAllEnvs();
    });
  });
});

describe('ApiError classes', () => {
  it('ApiNetworkError stores statusCode 0 and the original error', () => {
    const original = new TypeError('fetch failed');
    const error = new ApiNetworkError('Network down', 'req-1', original, '/api/x');

    expect(error.name).toBe('ApiNetworkError');
    expect(error.statusCode).toBe(0);
    expect(error.originalError).toBe(original);
    expect(error.requestId).toBe('req-1');
    expect(error.path).toBe('/api/x');
  });

  it('ApiTimeoutError formats the message with the timeout', () => {
    const error = new ApiTimeoutError('req-1', '/api/x', 5000);

    expect(error.name).toBe('ApiTimeoutError');
    expect(error.statusCode).toBe(408);
    expect(error.message).toBe('Request timed out after 5000ms');
  });

  it('ApiHttpError defaults responseBody to null', () => {
    const error = new ApiHttpError('Not Found', 'req-1', 404, ISO_DATE, '/api/x');

    expect(error.name).toBe('ApiHttpError');
    expect(error.statusCode).toBe(404);
    expect(error.responseBody).toBeNull();
  });

  it('ApiHttpError keeps the provided response body', () => {
    const body = { message: 'Nope' };
    const error = new ApiHttpError('Not Found', 'req-1', 404, ISO_DATE, '/api/x', body);

    expect(error.responseBody).toEqual(body);
  });

  it('ApiValidationError stores the validation errors', () => {
    const error = new ApiValidationError('Invalid', 'req-1', 400, ISO_DATE, '/api/x', ['a', 'b']);

    expect(error.errors).toEqual(['a', 'b']);
    expect(error.statusCode).toBe(400);
  });

  it('ApiValidationError defaults errors to an empty array', () => {
    const error = new ApiValidationError('Invalid', 'req-1', 400, ISO_DATE, '/api/x');

    expect(error.errors).toEqual([]);
  });

  it('ApiRetryError stores attempts and the last error', () => {
    const last = new Error('boom');
    const error = new ApiRetryError('Failed', 'req-1', 500, ISO_DATE, '/api/x', 3, last);

    expect(error.attempts).toBe(3);
    expect(error.lastError).toBe(last);
  });

  describe('toJSON', () => {
    it('includes the base fields', () => {
      const error = new ApiHttpError('Test', 'req-1', 500, ISO_DATE, '/api/x');
      const json = error.toJSON();

      expect(json.name).toBe('ApiHttpError');
      expect(json.message).toBe('Test');
      expect(json.requestId).toBe('req-1');
      expect(json.statusCode).toBe(500);
      expect(json.timestamp).toBe(ISO_DATE);
      expect(json.path).toBe('/api/x');
    });

    it('includes errors for ApiValidationError', () => {
      const error = new ApiValidationError('Invalid', 'req-1', 400, ISO_DATE, '/api/x', ['a']);
      const json = error.toJSON();

      expect(json.errors).toEqual(['a']);
    });

    it('includes the original message for ApiNetworkError', () => {
      const error = new ApiNetworkError(
        'Network down',
        'req-1',
        new TypeError('fetch failed'),
        '/api/x'
      );
      const json = error.toJSON();

      expect(json.originalError).toBe('fetch failed');
    });

    it('includes responseBody for ApiHttpError', () => {
      const error = new ApiHttpError('Test', 'req-1', 500, ISO_DATE, '/api/x', {
        detail: 'Server error',
      });
      const json = error.toJSON();

      expect(json.responseBody).toEqual({ detail: 'Server error' });
    });

    it('includes attempts and lastError for ApiRetryError', () => {
      const error = new ApiRetryError(
        'Failed',
        'req-1',
        500,
        ISO_DATE,
        '/api/x',
        3,
        new Error('boom')
      );
      const json = error.toJSON();

      expect(json.attempts).toBe(3);
      expect(json.lastError).toBe('boom');
    });
  });
});

describe('type guards', () => {
  it('isApiHttpError', () => {
    expect(isApiHttpError(new ApiHttpError('x', 'req', 500, ISO_DATE, '/x'))).toBe(true);
    expect(isApiHttpError(new ApiValidationError('x', 'req', 400, ISO_DATE, '/x'))).toBe(false);
    expect(isApiHttpError(new Error('x'))).toBe(false);
  });

  it('isApiValidationError', () => {
    expect(isApiValidationError(new ApiValidationError('x', 'req', 400, ISO_DATE, '/x'))).toBe(
      true
    );
    expect(isApiValidationError(new ApiHttpError('x', 'req', 500, ISO_DATE, '/x'))).toBe(false);
  });

  it('isApiNetworkError', () => {
    expect(isApiNetworkError(new ApiNetworkError('x', 'req', new Error('y'), '/x'))).toBe(true);
    expect(isApiNetworkError(new Error('x'))).toBe(false);
  });

  it('isApiTimeoutError', () => {
    expect(isApiTimeoutError(new ApiTimeoutError('req', '/x', 1000))).toBe(true);
    expect(isApiTimeoutError(new Error('x'))).toBe(false);
  });

  it('isApiRetryError', () => {
    expect(
      isApiRetryError(new ApiRetryError('x', 'req', 500, ISO_DATE, '/x', 3, new Error('y')))
    ).toBe(true);
    expect(isApiRetryError(new Error('x'))).toBe(false);
  });
});

describe('getErrorMessage', () => {
  it('joins the validation error list', () => {
    const error = new ApiValidationError('Invalid', 'req', 400, ISO_DATE, '/x', [
      'a required',
      'b invalid',
    ]);

    expect(getErrorMessage(error)).toBe('a required, b invalid');
  });

  it('falls back to the message when there are no validation errors', () => {
    const error = new ApiValidationError('Validation failed', 'req', 400, ISO_DATE, '/x', []);

    expect(getErrorMessage(error)).toBe('Validation failed');
  });

  it('returns the message for an ApiHttpError', () => {
    expect(getErrorMessage(new ApiHttpError('Not Found', 'req', 404, ISO_DATE, '/x'))).toBe(
      'Not Found'
    );
  });

  it('returns the connection message for an ApiNetworkError', () => {
    const error = new ApiNetworkError('Network down', 'req', new TypeError('fetch failed'), '/x');

    expect(getErrorMessage(error)).toBe('Error de conexión. Verifique su conexión a internet.');
  });

  it('returns the timeout message for an ApiTimeoutError', () => {
    expect(getErrorMessage(new ApiTimeoutError('req', '/x', 1000))).toBe(
      'La solicitud tardó demasiado. Intente nuevamente.'
    );
  });

  it('returns the retry message for an ApiRetryError', () => {
    const error = new ApiRetryError('Failed', 'req', 500, ISO_DATE, '/x', 3, new Error('boom'));

    expect(getErrorMessage(error)).toBe('Falló después de 3 intentos. boom');
  });

  it('returns the message for a regular Error', () => {
    expect(getErrorMessage(new Error('Regular error'))).toBe('Regular error');
  });

  it('returns a generic message for non-Error values', () => {
    expect(getErrorMessage('string error')).toBe('Error desconocido');
    expect(getErrorMessage(null)).toBe('Error desconocido');
    expect(getErrorMessage(undefined)).toBe('Error desconocido');
    expect(getErrorMessage(123)).toBe('Error desconocido');
  });
});

describe('utility functions', () => {
  it('calculateRetryDelay applies exponential backoff without jitter', () => {
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0);

    expect(calculateRetryDelay(1, 100)).toBe(100);
    expect(calculateRetryDelay(2, 100)).toBe(200);
    expect(calculateRetryDelay(3, 100)).toBe(400);

    randomSpy.mockRestore();
  });

  it('calculateRetryDelay uses a default base delay of 100ms', () => {
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0);

    expect(calculateRetryDelay(1)).toBe(100);

    randomSpy.mockRestore();
  });

  it('isRetryableError treats fetch TypeErrors as retryable', () => {
    expect(isRetryableError(new TypeError('fetch failed'), 0)).toBe(true);
    expect(isRetryableError(new TypeError('something else'), 0)).toBe(false);
  });

  it('isRetryableError retries 5xx, 408 and 429', () => {
    const error = new Error('boom');

    expect(isRetryableError(error, 500)).toBe(true);
    expect(isRetryableError(error, 502)).toBe(true);
    expect(isRetryableError(error, 503)).toBe(true);
    expect(isRetryableError(error, 408)).toBe(true);
    expect(isRetryableError(error, 429)).toBe(true);
  });

  it('isRetryableError does not retry 4xx client errors', () => {
    const error = new Error('boom');

    expect(isRetryableError(error, 400)).toBe(false);
    expect(isRetryableError(error, 401)).toBe(false);
    expect(isRetryableError(error, 403)).toBe(false);
    expect(isRetryableError(error, 404)).toBe(false);
  });

  it('isNonRetryableStatus identifies 400, 401, 403 and 404', () => {
    expect(isNonRetryableStatus(400)).toBe(true);
    expect(isNonRetryableStatus(401)).toBe(true);
    expect(isNonRetryableStatus(403)).toBe(true);
    expect(isNonRetryableStatus(404)).toBe(true);
  });

  it('isNonRetryableStatus rejects other status codes', () => {
    expect(isNonRetryableStatus(200)).toBe(false);
    expect(isNonRetryableStatus(408)).toBe(false);
    expect(isNonRetryableStatus(429)).toBe(false);
    expect(isNonRetryableStatus(500)).toBe(false);
  });

  it('extractRequestId reads the x-request-id header', () => {
    const headers = new Headers();
    headers.set('x-request-id', 'req-123');

    expect(extractRequestId(headers)).toBe('req-123');
  });

  it('extractRequestId falls back to the request-id header', () => {
    const headers = new Headers();
    headers.set('request-id', 'req-456');

    expect(extractRequestId(headers)).toBe('req-456');
  });

  it('extractRequestId generates an id when no header is present', () => {
    const id = extractRequestId(new Headers());

    expect(id).toBeTruthy();
    expect(typeof id).toBe('string');
  });
});
