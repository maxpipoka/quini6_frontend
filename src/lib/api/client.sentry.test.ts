import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Hoisted mocks for Sentry - must be at top level for vi.mock
const {
  mockSentrySetTag,
  mockSentrySetExtra,
  mockSentrySetUser,
  mockSentryAddBreadcrumb,
  mockSentryCaptureException,
} = vi.hoisted(() => ({
  mockSentrySetTag: vi.fn(),
  mockSentrySetExtra: vi.fn(),
  mockSentrySetUser: vi.fn(),
  mockSentryAddBreadcrumb: vi.fn(),
  mockSentryCaptureException: vi.fn(),
}));

vi.mock('@sentry/astro', () => ({
  setTag: mockSentrySetTag,
  setExtra: mockSentrySetExtra,
  setUser: mockSentrySetUser,
  addBreadcrumb: mockSentryAddBreadcrumb,
  captureException: mockSentryCaptureException,
  init: vi.fn(),
  browserTracingIntegration: vi.fn(),
  replayIntegration: vi.fn(),
}));

vi.mock('ky', () => {
  class TimeoutError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'TimeoutError';
    }
  }
  return {
    default: { create: vi.fn() },
    TimeoutError,
  };
});

vi.mock('uuid', () => ({
  v4: vi.fn(() => 'test-request-id-123'),
}));

import { createBeforeErrorHook } from './beforeError';
import { extractRequestId, isNonRetryableStatus } from './client';
import { ApiHttpError, ApiNetworkError, ApiValidationError, ApiTimeoutError } from './errors';

interface KyResult {
  json: () => Promise<unknown>;
  headers: Headers;
  status: number;
  url: string;
  ok: boolean;
}

const createMockResponse = (
  data: unknown,
  status: number,
  headers: Record<string, string> = {}
): KyResult => {
  const h = new Headers();
  Object.entries(headers).forEach(([key, value]) => h.set(key, value));
  const response = {
    json: () => Promise.resolve(data),
    headers: h,
    status,
    url: 'http://localhost:3000/test',
    ok: status >= 200 && status < 300,
    clone: function () {
      return this;
    },
  };
  return response;
};

// Helper to create a ky-like error object that beforeError hook expects
const createKyError = (response: KyResult, message = 'HTTP error') => {
  const error = new Error(message);
  (error as any).response = response;
  return error;
};

// Helper to create network error
const createNetworkError = (url = 'http://localhost:3000/test') => {
  const error = new TypeError('Failed to fetch');
  (error as any).request = { url };
  return error;
};

describe('ApiClient - beforeError hook Sentry integration', () => {
  let beforeErrorHook: (error: any) => Promise<any>;

  beforeEach(() => {
    vi.clearAllMocks();

    // Create the beforeError hook directly with test options
    beforeErrorHook = createBeforeErrorHook({ timeout: 5000 });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('extractRequestId', () => {
    it('reads the x-request-id header', () => {
      const headers = new Headers();
      headers.set('x-request-id', 'req-123');
      expect(extractRequestId(headers)).toBe('req-123');
    });

    it('falls back to the request-id header', () => {
      const headers = new Headers();
      headers.set('request-id', 'req-456');
      expect(extractRequestId(headers)).toBe('req-456');
    });

    it('generates an id when no header is present', () => {
      const id = extractRequestId(new Headers());
      expect(id).toBeTruthy();
      expect(typeof id).toBe('string');
    });
  });

  describe('isNonRetryableStatus', () => {
    it('identifies 400, 401, 403 and 404 as non-retryable', () => {
      expect(isNonRetryableStatus(400)).toBe(true);
      expect(isNonRetryableStatus(401)).toBe(true);
      expect(isNonRetryableStatus(403)).toBe(true);
      expect(isNonRetryableStatus(404)).toBe(true);
    });

    it('rejects other status codes', () => {
      expect(isNonRetryableStatus(200)).toBe(false);
      expect(isNonRetryableStatus(408)).toBe(false);
      expect(isNonRetryableStatus(429)).toBe(false);
      expect(isNonRetryableStatus(500)).toBe(false);
    });
  });

  describe('beforeError hook - HTTP Error (4xx/5xx)', () => {
    it('sets requestId tag and extra context for 400 validation error', async () => {
      const errorData = { message: 'Invalid input', error: 'Bad Request' };
      const response = createMockResponse(errorData, 400, { 'x-request-id': 'req-400-123' });
      const error = createKyError(response);

      let thrownError: any;
      try {
        await beforeErrorHook(error);
      } catch (e) {
        thrownError = e;
      }

      expect(thrownError).toBeInstanceOf(ApiValidationError);
      expect(mockSentrySetTag).toHaveBeenCalledWith('requestId', 'req-400-123');
      expect(mockSentrySetExtra).toHaveBeenCalledWith('responseStatus', 400);
      expect(mockSentrySetExtra).toHaveBeenCalledWith('responseUrl', 'http://localhost:3000/test');
      expect(mockSentrySetExtra).toHaveBeenCalledWith('errorTimestamp', expect.any(String));
      expect(mockSentrySetExtra).toHaveBeenCalledWith('errorData', errorData);
    });

    it('sets requestId tag and extra context for 401 unauthorized', async () => {
      const response = createMockResponse({ message: 'Unauthorized' }, 401, {
        'x-request-id': 'req-401-123',
      });
      const error = createKyError(response);

      let thrownError: any;
      try {
        await beforeErrorHook(error);
      } catch (e) {
        thrownError = e;
      }

      expect(thrownError).toBeInstanceOf(ApiHttpError);
      expect(mockSentrySetTag).toHaveBeenCalledWith('requestId', 'req-401-123');
      expect(mockSentrySetExtra).toHaveBeenCalledWith('responseStatus', 401);
      expect(mockSentrySetExtra).toHaveBeenCalledWith('responseUrl', 'http://localhost:3000/test');
    });

    it('sets requestId tag and extra context for 404 not found', async () => {
      const response = createMockResponse({ message: 'Not Found' }, 404, {
        'request-id': 'req-404-123',
      });
      const error = createKyError(response);

      let thrownError: any;
      try {
        await beforeErrorHook(error);
      } catch (e) {
        thrownError = e;
      }

      expect(thrownError).toBeInstanceOf(ApiHttpError);
      expect(mockSentrySetTag).toHaveBeenCalledWith('requestId', 'req-404-123');
      expect(mockSentrySetExtra).toHaveBeenCalledWith('responseStatus', 404);
    });

    it('sets requestId tag and extra context for 500 server error', async () => {
      const response = createMockResponse({ message: 'Internal Server Error' }, 500, {
        'x-request-id': 'req-500-123',
      });
      const error = createKyError(response);

      let thrownError: any;
      try {
        await beforeErrorHook(error);
      } catch (e) {
        thrownError = e;
      }

      expect(thrownError).toBeInstanceOf(ApiHttpError);
      expect(mockSentrySetTag).toHaveBeenCalledWith('requestId', 'req-500-123');
      expect(mockSentrySetExtra).toHaveBeenCalledWith('responseStatus', 500);
    });

    it('sets requestId tag and extra context for 429 rate limit', async () => {
      const response = createMockResponse({ message: 'Too Many Requests' }, 429, {
        'x-request-id': 'req-429-123',
      });
      const error = createKyError(response);

      let thrownError: any;
      try {
        await beforeErrorHook(error);
      } catch (e) {
        thrownError = e;
      }

      expect(thrownError).toBeInstanceOf(ApiHttpError);
      expect(mockSentrySetTag).toHaveBeenCalledWith('requestId', 'req-429-123');
      expect(mockSentrySetExtra).toHaveBeenCalledWith('responseStatus', 429);
    });

    it('handles response without x-request-id header', async () => {
      const response = createMockResponse({ message: 'Error' }, 500, {});
      const error = createKyError(response);

      let thrownError: any;
      try {
        await beforeErrorHook(error);
      } catch (e) {
        thrownError = e;
      }

      expect(thrownError).toBeInstanceOf(ApiHttpError);
      // Should generate a request ID
      expect(mockSentrySetTag).toHaveBeenCalledWith('requestId', expect.any(String));
      const setTagCall = mockSentrySetTag.mock.calls.find((call) => call[0] === 'requestId');
      expect(setTagCall?.[1]).toBeTruthy();
    });

    it('handles response with invalid JSON body', async () => {
      const baseResponse = createMockResponse(null, 500, { 'x-request-id': 'req-json-error' });
      const response = {
        ...baseResponse,
        json: () => Promise.reject(new Error('Invalid JSON')),
        clone: function () {
          return this;
        },
      };
      const error = createKyError(response);

      let thrownError: any;
      try {
        await beforeErrorHook(error);
      } catch (e) {
        thrownError = e;
      }

      expect(thrownError).toBeInstanceOf(ApiHttpError);
      expect(mockSentrySetTag).toHaveBeenCalledWith('requestId', 'req-json-error');
      // errorData should be undefined since JSON parsing failed - the hook doesn't call setExtra when errorData is falsy
      const errorDataCalls = mockSentrySetExtra.mock.calls.filter(
        (call) => call[0] === 'errorData'
      );
      expect(errorDataCalls).toHaveLength(0);
    });
  });

  describe('beforeError hook - Network Error', () => {
    it('sets requestId tag and network error context', async () => {
      const networkError = createNetworkError('http://localhost:3000/health');

      let thrownError: any;
      try {
        await beforeErrorHook(networkError);
      } catch (e) {
        thrownError = e;
      }

      expect(thrownError).toBeInstanceOf(ApiNetworkError);
      expect(mockSentrySetTag).toHaveBeenCalledWith('requestId', expect.any(String));
      expect(mockSentrySetExtra).toHaveBeenCalledWith('errorType', 'network');
      expect(mockSentrySetExtra).toHaveBeenCalledWith('originalError', 'Failed to fetch');
    });

    it('uses request URL from error.request', async () => {
      const networkError = createNetworkError('http://localhost:3000/draws/latest');

      let thrownError: any;
      try {
        await beforeErrorHook(networkError);
      } catch (e) {
        thrownError = e;
      }

      expect(thrownError).toBeInstanceOf(ApiNetworkError);
      expect(mockSentrySetExtra).toHaveBeenCalledWith('errorType', 'network');
      // The error should have the correct path
      expect(thrownError.path).toBe('http://localhost:3000/draws/latest');
    });
  });

  describe('beforeError hook - Timeout Error', () => {
    it('sets requestId tag and timeout context', async () => {
      // Import the mocked ky module to get the TimeoutError class
      const ky = await import('ky');
      const timeoutError = new ky.TimeoutError('Request timed out' as unknown as Request);
      (timeoutError as any).request = { url: 'http://localhost:3000/health/db' };

      let thrownError: any;
      try {
        await beforeErrorHook(timeoutError);
      } catch (e) {
        thrownError = e;
      }

      expect(thrownError).toBeInstanceOf(ApiTimeoutError);
      expect(mockSentrySetTag).toHaveBeenCalledWith('requestId', expect.any(String));
      expect(mockSentrySetExtra).toHaveBeenCalledWith('errorType', 'timeout');
      expect(mockSentrySetExtra).toHaveBeenCalledWith('timeoutMs', 5000);
    });
  });

  describe('beforeError hook - Validation Error (400 with details)', () => {
    it('sets requestId tag and validation error context', async () => {
      const errorData = {
        message: ['field1 is required', 'field2 must be a number'],
        error: 'Bad Request',
      };
      const response = createMockResponse(errorData, 400, { 'x-request-id': 'req-validation-123' });
      const error = createKyError(response);

      let thrownError: any;
      try {
        await beforeErrorHook(error);
      } catch (e) {
        thrownError = e;
      }

      expect(thrownError).toBeInstanceOf(ApiValidationError);
      expect(mockSentrySetTag).toHaveBeenCalledWith('requestId', 'req-validation-123');
      expect(mockSentrySetExtra).toHaveBeenCalledWith('errorData', errorData);
      expect(mockSentrySetExtra).toHaveBeenCalledWith('responseStatus', 400);
      // Check errors array is set correctly
      expect(thrownError.errors).toEqual(['field1 is required', 'field2 must be a number']);
    });

    it('handles string message in validation error', async () => {
      const errorData = { message: 'Single error message', error: 'Bad Request' };
      const response = createMockResponse(errorData, 400, { 'x-request-id': 'req-val-string' });
      const error = createKyError(response);

      let thrownError: any;
      try {
        await beforeErrorHook(error);
      } catch (e) {
        thrownError = e;
      }

      expect(thrownError).toBeInstanceOf(ApiValidationError);
      expect(mockSentrySetExtra).toHaveBeenCalledWith('errorData', errorData);
      expect(thrownError.errors).toEqual(['Single error message']);
    });
  });

  describe('beforeError hook - Request ID extraction priority', () => {
    it('prefers x-request-id over request-id header', async () => {
      const response = createMockResponse({ message: 'Error' }, 500, {
        'x-request-id': 'x-request-123',
        'request-id': 'request-456',
      });
      const error = createKyError(response);

      let thrownError: any;
      try {
        await beforeErrorHook(error);
      } catch (e) {
        thrownError = e;
      }

      expect(thrownError).toBeInstanceOf(ApiHttpError);
      expect(mockSentrySetTag).toHaveBeenCalledWith('requestId', 'x-request-123');
    });

    it('falls back to request-id when x-request-id not present', async () => {
      const response = createMockResponse({ message: 'Error' }, 500, {
        'request-id': 'request-789',
      });
      const error = createKyError(response);

      let thrownError: any;
      try {
        await beforeErrorHook(error);
      } catch (e) {
        thrownError = e;
      }

      expect(thrownError).toBeInstanceOf(ApiHttpError);
      expect(mockSentrySetTag).toHaveBeenCalledWith('requestId', 'request-789');
    });

    it('generates UUID when no header present', async () => {
      const response = createMockResponse({ message: 'Error' }, 500, {});
      const error = createKyError(response);

      let thrownError: any;
      try {
        await beforeErrorHook(error);
      } catch (e) {
        thrownError = e;
      }

      expect(thrownError).toBeInstanceOf(ApiHttpError);
      const setTagCalls = mockSentrySetTag.mock.calls;
      const requestIdCall = setTagCalls.find((call) => call[0] === 'requestId');
      expect(requestIdCall?.[1]).toBeTruthy();
      expect(typeof requestIdCall?.[1]).toBe('string');
      expect(requestIdCall?.[1].length).toBeGreaterThan(0);
    });
  });

  describe('beforeError hook - Extra context completeness', () => {
    it('includes all standard extra fields for HTTP errors', async () => {
      const response = createMockResponse({ message: 'Test error', details: 'more info' }, 503, {
        'x-request-id': 'req-complete-123',
      });
      const error = createKyError(response);

      let thrownError: any;
      try {
        await beforeErrorHook(error);
      } catch (e) {
        thrownError = e;
      }

      expect(thrownError).toBeInstanceOf(ApiHttpError);
      // Check all standard extra fields are set
      expect(mockSentrySetExtra).toHaveBeenCalledWith('responseStatus', 503);
      expect(mockSentrySetExtra).toHaveBeenCalledWith('responseUrl', 'http://localhost:3000/test');
      expect(mockSentrySetExtra).toHaveBeenCalledWith('errorTimestamp', expect.any(String));
      expect(mockSentrySetExtra).toHaveBeenCalledWith('errorData', {
        message: 'Test error',
        details: 'more info',
      });
    });

    it('includes errorTimestamp in ISO format', async () => {
      const response = createMockResponse({ message: 'Error' }, 500, {
        'x-request-id': 'req-time',
      });
      const error = createKyError(response);

      const beforeCall = new Date().toISOString();

      let thrownError: any;
      try {
        await beforeErrorHook(error);
      } catch (e) {
        thrownError = e;
      }

      const afterCall = new Date().toISOString();

      expect(thrownError).toBeInstanceOf(ApiHttpError);
      const timestampCall = mockSentrySetExtra.mock.calls.find(
        (call) => call[0] === 'errorTimestamp'
      );
      expect(timestampCall).toBeDefined();
      const timestamp = timestampCall?.[1] as string;
      expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
      expect(timestamp >= beforeCall && timestamp <= afterCall).toBe(true);
    });
  });

  describe('beforeError hook - Multiple error scenarios in sequence', () => {
    it('correctly tags each error with its own requestId', async () => {
      // First error
      const response1 = createMockResponse({ message: 'Error 1' }, 500, {
        'x-request-id': 'req-first',
      });
      const error1 = createKyError(response1);

      try {
        await beforeErrorHook(error1);
      } catch {}

      // Second error
      const response2 = createMockResponse({ message: 'Error 2' }, 404, {
        'x-request-id': 'req-second',
      });
      const error2 = createKyError(response2);

      try {
        await beforeErrorHook(error2);
      } catch {}

      // Verify both request IDs were set
      const requestIdCalls = mockSentrySetTag.mock.calls.filter((call) => call[0] === 'requestId');
      expect(requestIdCalls).toHaveLength(2);
      expect(requestIdCalls[0][1]).toBe('req-first');
      expect(requestIdCalls[1][1]).toBe('req-second');
    });
  });
});
