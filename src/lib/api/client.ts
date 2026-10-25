/**
 * API Client - ky-based HTTP client with Zod validation, retry logic, and error handling
 */

import ky, { type KyInstance, type Options, TimeoutError } from 'ky';
import { v4 as uuidv4 } from 'uuid';

import type { ApiErrorResponse, ApiHttpError } from './errors';
import {
  ApiNetworkError,
  ApiTimeoutError,
  ApiRetryError,
  ApiValidationError as ApiValidationErrorClass,
  ApiHttpError as ApiHttpErrorClass,
  isApiValidationError,
  isApiHttpError,
} from './errors';
import * as schemas from '../schemas';
import type { z } from 'zod';

// ============================================================================
// Types
// ============================================================================

export interface ApiClientConfig {
  baseUrl: string;
  timeout?: number;
  defaultHeaders?: Record<string, string>;
  retryAttempts?: number;
  retryDelay?: (attempt: number) => number;
}

export interface RequestOptions extends Options {
  validateWith?: z.ZodSchema<unknown>;
  validateBodyWith?: z.ZodSchema<unknown>;
}

export type ApiResponse<T> = T;

// ============================================================================
// Utility Functions (exported for testing)
// ============================================================================

export function generateRequestId(): string {
  return uuidv4();
}

export function isRetryableError(error: Error, statusCode: number): boolean {
  // Network errors are retryable
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return true;
  }
  // 5xx errors are retryable
  if (statusCode >= 500 && statusCode < 600) {
    return true;
  }
  // 408 timeout is retryable
  if (statusCode === 408) {
    return true;
  }
  // 429 rate limit - we'll handle separately
  if (statusCode === 429) {
    return true;
  }
  return false;
}

export function isNonRetryableStatus(statusCode: number): boolean {
  return [400, 401, 403, 404].includes(statusCode);
}

export function calculateRetryDelay(attempt: number, baseDelay = 100): number {
  // Exponential backoff with jitter: 100ms, 200ms, 400ms + random jitter
  const exponentialDelay = baseDelay * Math.pow(2, attempt - 1);
  const jitter = Math.random() * 0.3 * exponentialDelay; // 0-30% jitter
  return Math.floor(exponentialDelay + jitter);
}

export function extractRequestId(headers: Headers): string {
  return headers.get('x-request-id') ?? headers.get('request-id') ?? generateRequestId();
}

// ============================================================================
// API Client Class
// ============================================================================

export class ApiClient {
  private client: KyInstance;
  private config: Required<ApiClientConfig>;
  private refreshPromise: Promise<void> | null = null;

  private getCsrfToken(): string | null {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(/(?:^|; )csrf_token=([^;]*)/);
    return match?.[1] ? decodeURIComponent(match[1]) : null;
  }

  private async handleUnauthorized(): Promise<void> {
    if (this.refreshPromise) return this.refreshPromise;

    this.refreshPromise = (async () => {
      try {
        await fetch(`${this.config.baseUrl}/admin/auth/me`, {
          credentials: 'include',
          headers: {
            'X-CSRF-Token': this.getCsrfToken() ?? '',
          },
        });
      } catch {
        // Refresh failed - will be handled by auth context
      } finally {
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  constructor(config: ApiClientConfig) {
    this.config = {
      baseUrl: config.baseUrl,
      timeout: config.timeout ?? 30000,
      defaultHeaders: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...config.defaultHeaders,
      },
      retryAttempts: config.retryAttempts ?? 3,
      retryDelay: config.retryDelay ?? calculateRetryDelay,
    };

    this.client = ky.create({
      prefixUrl: this.config.baseUrl,
      timeout: this.config.timeout,
      headers: this.config.defaultHeaders,
      credentials: 'include',
      hooks: {
        beforeRequest: [
          (request) => {
            // Add request ID to all requests
            request.headers.set('X-Request-ID', generateRequestId());

            // Inject CSRF token for mutating requests
            const method = request.method.toUpperCase();
            if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
              const csrfToken = this.getCsrfToken();
              if (csrfToken) {
                request.headers.set('X-CSRF-Token', csrfToken);
              }
            }
          },
        ],
        afterResponse: [
          async (_request, _options, response) => {
            // Handle 401 - trigger silent refresh
            if (response.status === 401) {
              await this.handleUnauthorized();
              // Note: retry logic would need to be handled at a higher level
              // since ky doesn't support retry after afterResponse easily
            }
            return response;
          },
        ],
        beforeError: [
          async (error) => {
            const { response } = error;
            if (response) {
              const requestId = extractRequestId(response.headers);
              const timestamp = new Date().toISOString();
              const path = response.url;

              let errorData: ApiErrorResponse | null = null;
              try {
                errorData = (await response.clone().json()) as ApiErrorResponse;
              } catch {
                // Ignore JSON parse errors
              }

              // Create appropriate error based on status code
              if (response.status === 400 && errorData?.message) {
                const errors = Array.isArray(errorData.message)
                  ? errorData.message
                  : [errorData.message];
                throw new ApiValidationErrorClass(
                  Array.isArray(errorData.message)
                    ? errorData.message.join(', ')
                    : errorData.message,
                  requestId,
                  response.status,
                  timestamp,
                  path,
                  errors
                );
              }

              if (isNonRetryableStatus(response.status)) {
                throw new ApiHttpErrorClass(
                  (errorData?.message as string) || `HTTP ${response.status}`,
                  requestId,
                  response.status,
                  timestamp,
                  path,
                  errorData
                );
              }

              // For retryable errors, throw a generic error that will trigger retry
              throw new ApiHttpErrorClass(
                (errorData?.message as string) || `HTTP ${response.status}`,
                requestId,
                response.status,
                timestamp,
                path,
                errorData
              );
            }

            // Network error
            if (error instanceof TypeError) {
              const requestId = generateRequestId();
              throw new ApiNetworkError(
                'Network error: Failed to fetch',
                requestId,
                error,
                error.request?.url || ''
              );
            }

            // Timeout error
            if (error instanceof TimeoutError) {
              const requestId = generateRequestId();
              throw new ApiTimeoutError(requestId, error.request?.url || '', this.config.timeout);
            }

            throw error;
          },
        ],
      },
    });
  }

  // ============================================================================
  // Private Methods
  // ============================================================================

  private async request<T>(method: string, url: string, options: RequestOptions = {}): Promise<T> {
    const { validateWith, validateBodyWith, ...kyOptions } = options;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.config.retryAttempts; attempt++) {
      try {
        // Validate request body if schema provided
        if (validateBodyWith && kyOptions.json) {
          const validationResult = validateBodyWith.safeParse(kyOptions.json);
          if (!validationResult.success) {
            throw new ApiValidationErrorClass(
              'Request body validation failed',
              generateRequestId(),
              400,
              new Date().toISOString(),
              url,
              validationResult.error.errors.map((e: z.ZodIssue) => e.message)
            );
          }
        }

        const response = await this.client[method as 'get' | 'post' | 'put' | 'patch' | 'delete'](
          url,
          kyOptions
        );

        const data = await response.json();

        // Validate response if schema provided
        if (validateWith) {
          const validationResult = validateWith.safeParse(data);
          if (!validationResult.success) {
            const requestId = extractRequestId(response.headers);
            throw new ApiValidationErrorClass(
              'Response validation failed',
              requestId,
              500,
              new Date().toISOString(),
              url,
              validationResult.error.errors.map((e: z.ZodIssue) => e.message)
            );
          }
          return validationResult.data as T;
        }

        return data as T;
      } catch (error: unknown) {
        lastError = error as Error;

        // Don't retry on non-retryable errors
        if (isApiValidationError(error) || isApiHttpError(error)) {
          const httpError = error as ApiHttpError;
          if (isNonRetryableStatus(httpError.statusCode)) {
            throw error;
          }
        }

        // Don't retry on last attempt
        if (attempt === this.config.retryAttempts) {
          break;
        }

        // Check if error is retryable
        const statusCode = isApiHttpError(error) ? error.statusCode : 0;
        if (!isRetryableError(error as Error, statusCode)) {
          throw error;
        }

        // Wait before retry
        const delay = this.config.retryDelay(attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    // All retries exhausted
    const requestId = generateRequestId();
    throw new ApiRetryError(
      `Request failed after ${this.config.retryAttempts} attempts`,
      requestId,
      isApiHttpError(lastError) ? lastError.statusCode : 0,
      new Date().toISOString(),
      url,
      this.config.retryAttempts,
      lastError!
    );
  }

  // ============================================================================
  // Public API Methods
  // ============================================================================

  async getLatestDraw(): Promise<schemas.DrawResponse> {
    return this.request('get', 'draws/latest', {
      validateWith: schemas.DrawResponseSchema,
    });
  }

  async getDraw(officialNumber: number): Promise<schemas.DrawResponse> {
    return this.request('get', `draws/${officialNumber}`, {
      validateWith: schemas.DrawResponseSchema,
    });
  }

  async getDrawHistory(
    params: {
      page?: number;
      limit?: number;
      year?: number;
    } = {}
  ): Promise<schemas.PaginatedDrawsResponse> {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set('page', String(params.page));
    if (params.limit) searchParams.set('limit', String(params.limit));
    if (params.year) searchParams.set('year', String(params.year));

    const url = `draws${searchParams.toString() ? `?${searchParams}` : ''}`;
    return this.request('get', url, {
      validateWith: schemas.PaginatedDrawsResponseSchema,
    });
  }

  async searchExactCombination(
    numbers: schemas.SixUniqueNumbers,
    dateRange?: { fromDate?: string; toDate?: string }
  ): Promise<schemas.ExactSearchResponse> {
    const body = { numbers };
    const searchParams = new URLSearchParams();
    if (dateRange?.fromDate) searchParams.set('fromDate', dateRange.fromDate);
    if (dateRange?.toDate) searchParams.set('toDate', dateRange.toDate);

    const url = `search/exact${searchParams.toString() ? `?${searchParams}` : ''}`;
    return this.request('post', url, {
      json: body,
      validateBodyWith: schemas.ExactSearchRequestSchema,
      validateWith: schemas.ExactSearchResponseSchema,
    });
  }

  async getNumberFrequency(
    params: schemas.FrequencyParams = {}
  ): Promise<schemas.FrequencyResponse> {
    const searchParams = new URLSearchParams();
    if (params.fromDate) searchParams.set('fromDate', params.fromDate);
    if (params.toDate) searchParams.set('toDate', params.toDate);
    if (params.modality) searchParams.set('modality', params.modality);

    const url = `frequency${searchParams.toString() ? `?${searchParams}` : ''}`;
    return this.request('get', url, {
      validateWith: schemas.FrequencyResponseSchema,
    });
  }

  async healthCheck(): Promise<schemas.HealthCheck> {
    return this.request('get', 'health', {
      validateWith: schemas.HealthCheckSchema,
    });
  }

  async healthDbCheck(): Promise<schemas.HealthDb> {
    return this.request('get', 'health/db', {
      validateWith: schemas.HealthDbSchema,
    });
  }

  // ============================================================================
  // Admin Methods (require authentication)
  // ============================================================================

  async adminLogin(credentials: schemas.LoginInput): Promise<{ user: unknown }> {
    return this.request('post', '/admin/auth/login', {
      json: credentials,
      validateBodyWith: schemas.LoginSchema,
    });
  }

  async adminMe(): Promise<unknown> {
    return this.request('get', '/admin/auth/me');
  }

  async adminLogout(): Promise<void> {
    await this.request('post', '/admin/auth/logout');
  }

  async adminChangePassword(data: schemas.ChangePasswordInput): Promise<void> {
    return this.request('post', '/admin/auth/change-password', {
      json: data,
      validateBodyWith: schemas.ChangePasswordSchema,
    });
  }

  async adminCreateDraw(data: schemas.CreateDrawInput): Promise<schemas.DrawResponse> {
    return this.request('post', '/admin/draws', {
      json: data,
      validateBodyWith: schemas.CreateDrawSchema,
      validateWith: schemas.DrawResponseSchema,
    });
  }

  async adminUpdateDraw(id: string, data: schemas.UpdateDrawInput): Promise<schemas.DrawResponse> {
    return this.request('patch', `/admin/draws/${id}`, {
      json: data,
      validateBodyWith: schemas.UpdateDrawSchema,
      validateWith: schemas.DrawResponseSchema,
    });
  }

  async adminDeleteDraw(id: string): Promise<void> {
    await this.request('delete', `/admin/draws/${id}`);
  }

  async adminImportPreview(file: File): Promise<unknown> {
    const formData = new FormData();
    formData.append('file', file);
    return this.request('post', '/admin/import/preview', {
      body: formData,
      // Don't set Content-Type - let browser set it with boundary
      headers: {},
    });
  }

  async adminImportCommit(data: schemas.CommitImportInput): Promise<unknown> {
    return this.request('post', '/admin/import/commit', {
      json: data,
      validateBodyWith: schemas.CommitImportSchema,
    });
  }

  async adminListImports(
    params: schemas.ImportListParams = { page: 1, limit: 20 }
  ): Promise<unknown> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.set(key, String(value));
      }
    });
    const url = `/admin/import${searchParams.toString() ? `?${searchParams}` : ''}`;
    return this.request('get', url);
  }

  async adminGetImport(id: string): Promise<unknown> {
    return this.request('get', `/admin/import/${id}`);
  }

  // ============================================================================
  // Import Methods (Phase 3 Bulk Import)
  // ============================================================================

  /**
   * Submit parsed rows for import preview
   * POST /admin/imports/preview
   */
  async importPreview(rows: schemas.DrawRowInput[]): Promise<schemas.ImportPreviewResponse> {
    return this.request('post', '/admin/imports/preview', {
      json: { rows },
      validateBodyWith: schemas.ImportPreviewRequestSchema,
      validateWith: schemas.ImportPreviewResponseSchema,
    });
  }

  /**
   * Commit a previewed import with conflict resolution policy
   * POST /admin/imports/{importId}/commit?policy={policy}
   */
  async importCommit(
    importId: string,
    policy: schemas.ImportPolicy,
    options?: { onProgress?: (progress: schemas.ImportProgress) => void }
  ): Promise<schemas.ImportCommitResponse> {
    // Note: import commit is non-retryable (POST with side effects)
    // The polling for progress is handled at a higher level if needed
    const url = `/admin/imports/${importId}/commit?policy=${policy}`;
    return this.request('post', url, {
      validateWith: schemas.ImportCommitResponseSchema,
    });
  }

  /**
   * Get paginated import history
   * GET /admin/imports
   */
  async getImportHistory(
    params: schemas.ImportHistoryParams = { page: 1, limit: 10 }
  ): Promise<schemas.ImportHistoryResponse> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.set(key, String(value));
      }
    });
    const url = `/admin/imports${searchParams.toString() ? `?${searchParams}` : ''}`;
    return this.request('get', url, {
      validateWith: schemas.ImportHistoryResponseSchema,
    });
  }

  /**
   * Get detailed errors for a specific import
   * GET /admin/imports/{importId}/errors
   */
  async getImportErrors(importId: string): Promise<schemas.ImportErrorsResponse> {
    return this.request('get', `/admin/imports/${importId}/errors`, {
      validateWith: schemas.ImportErrorsResponseSchema,
    });
  }
}

// ============================================================================
// Factory Function
// ============================================================================

let apiClientInstance: ApiClient | null = null;

export function createApiClient(config: ApiClientConfig): ApiClient {
  return new ApiClient(config);
}

export function getApiClient(): ApiClient {
  if (!apiClientInstance) {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    if (!baseUrl) {
      throw new Error('VITE_API_BASE_URL is not configured');
    }
    apiClientInstance = createApiClient({ baseUrl });
  }
  return apiClientInstance;
}

export function setApiClient(client: ApiClient): void {
  apiClientInstance = client;
}

// ============================================================================
// Export everything
// ============================================================================

export * from './errors';
// Note: Schemas are exported via index.ts to avoid ApiErrorResponse conflict
