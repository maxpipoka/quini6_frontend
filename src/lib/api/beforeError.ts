/**
 * beforeError hook logic - extracted for testability
 * Handles Sentry error correlation and transforms ky errors to typed ApiErrors
 */

import * as Sentry from '@sentry/astro';
import type { ApiErrorResponse } from './errors';
import { ApiNetworkError, ApiTimeoutError, ApiValidationError, ApiHttpError } from './errors';
import { extractRequestId, isNonRetryableStatus, generateRequestId } from './client';

interface BeforeErrorOptions {
  timeout: number;
}

/** Shape of ky errors handled by the hook (HTTP, network, timeout). */
interface KyLikeError {
  name?: string;
  message?: string;
  request?: { url?: string };
  response?: {
    status: number;
    url: string;
    headers: Headers;
    clone: () => { json: () => Promise<unknown> };
  };
}

/**
 * Creates the beforeError hook for ky
 * This function is extracted for testability
 */
export function createBeforeErrorHook(options: BeforeErrorOptions) {
  return async (error: KyLikeError) => {
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

      // Attach to Sentry scope for error correlation
      Sentry.setTag('requestId', requestId);
      Sentry.setExtra('responseStatus', response.status);
      Sentry.setExtra('responseUrl', response.url);
      Sentry.setExtra('errorTimestamp', timestamp);
      if (errorData) {
        Sentry.setExtra('errorData', errorData);
      }

      // Create appropriate error based on status code
      if (response.status === 400 && errorData?.message) {
        const errors = Array.isArray(errorData.message) ? errorData.message : [errorData.message];
        throw new ApiValidationError(
          Array.isArray(errorData.message) ? errorData.message.join(', ') : errorData.message,
          requestId,
          response.status,
          timestamp,
          path,
          errors
        );
      }

      if (isNonRetryableStatus(response.status)) {
        throw new ApiHttpError(
          (errorData?.message as string) ?? `HTTP ${response.status}`,
          requestId,
          response.status,
          timestamp,
          path,
          errorData
        );
      }

      // For retryable errors, throw a generic error that will trigger retry
      throw new ApiHttpError(
        (errorData?.message as string) ?? `HTTP ${response.status}`,
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
      Sentry.setTag('requestId', requestId);
      Sentry.setExtra('errorType', 'network');
      Sentry.setExtra('originalError', error.message);
      throw new ApiNetworkError(
        'Network error: Failed to fetch',
        requestId,
        error,
        (error as KyLikeError).request?.url ?? ''
      );
    }

    // Timeout error - check by name since instanceof may not work across module boundaries
    if (error.name === 'TimeoutError') {
      const requestId = generateRequestId();
      Sentry.setTag('requestId', requestId);
      Sentry.setExtra('errorType', 'timeout');
      Sentry.setExtra('timeoutMs', options.timeout);
      throw new ApiTimeoutError(requestId, error.request?.url ?? '', options.timeout);
    }

    throw error;
  };
}
