/**
 * API Error Classes
 * Typed error classes with requestId for debugging
 */

export interface ApiErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
  timestamp: string;
  path: string;
  requestId: string;
}

export abstract class ApiError extends Error {
  public readonly requestId: string;
  public readonly statusCode: number;
  public readonly timestamp: string;
  public readonly path: string;

  constructor(
    message: string,
    requestId: string,
    statusCode: number,
    timestamp: string,
    path: string
  ) {
    super(message);
    this.name = this.constructor.name;
    this.requestId = requestId;
    this.statusCode = statusCode;
    this.timestamp = timestamp;
    this.path = path;

    // Maintains proper stack trace in V8 environments
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      requestId: this.requestId,
      statusCode: this.statusCode,
      timestamp: this.timestamp,
      path: this.path,
    };
  }
}

export class ApiValidationError extends ApiError {
  public readonly errors: string[];

  constructor(
    message: string,
    requestId: string,
    statusCode: number,
    timestamp: string,
    path: string,
    errors: string[] = []
  ) {
    super(message, requestId, statusCode, timestamp, path);
    this.name = 'ApiValidationError';
    this.errors = errors;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      errors: this.errors,
    };
  }
}

export class ApiNetworkError extends ApiError {
  public readonly originalError: Error;

  constructor(message: string, requestId: string, originalError: Error, path: string) {
    super(message, requestId, 0, new Date().toISOString(), path);
    this.name = 'ApiNetworkError';
    this.originalError = originalError;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      originalError: this.originalError.message,
    };
  }
}

export class ApiHttpError extends ApiError {
  public readonly responseBody: unknown;

  constructor(
    message: string,
    requestId: string,
    statusCode: number,
    timestamp: string,
    path: string,
    responseBody: unknown = null
  ) {
    super(message, requestId, statusCode, timestamp, path);
    this.name = 'ApiHttpError';
    this.responseBody = responseBody;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      responseBody: this.responseBody,
    };
  }
}

export class ApiTimeoutError extends ApiError {
  constructor(requestId: string, path: string, timeout: number) {
    super(`Request timed out after ${timeout}ms`, requestId, 408, new Date().toISOString(), path);
    this.name = 'ApiTimeoutError';
  }
}

export class ApiRetryError extends ApiError {
  public readonly attempts: number;
  public readonly lastError: Error;

  constructor(
    message: string,
    requestId: string,
    statusCode: number,
    timestamp: string,
    path: string,
    attempts: number,
    lastError: Error
  ) {
    super(message, requestId, statusCode, timestamp, path);
    this.name = 'ApiRetryError';
    this.attempts = attempts;
    this.lastError = lastError;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      attempts: this.attempts,
      lastError: this.lastError.message,
    };
  }
}

// Type guard functions
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function isApiValidationError(error: unknown): error is ApiValidationError {
  return error instanceof ApiValidationError;
}

export function isApiNetworkError(error: unknown): error is ApiNetworkError {
  return error instanceof ApiNetworkError;
}

export function isApiHttpError(error: unknown): error is ApiHttpError {
  return error instanceof ApiHttpError;
}

export function isApiTimeoutError(error: unknown): error is ApiTimeoutError {
  return error instanceof ApiTimeoutError;
}

export function isApiRetryError(error: unknown): error is ApiRetryError {
  return error instanceof ApiRetryError;
}

// Helper to extract user-friendly message
export function getErrorMessage(error: unknown): string {
  if (isApiValidationError(error)) {
    return error.errors.length > 0 ? error.errors.join(', ') : error.message;
  }
  if (isApiHttpError(error)) {
    return error.message;
  }
  if (isApiNetworkError(error)) {
    return 'Error de conexión. Verifique su conexión a internet.';
  }
  if (isApiTimeoutError(error)) {
    return 'La solicitud tardó demasiado. Intente nuevamente.';
  }
  if (isApiRetryError(error)) {
    return `Falló después de ${error.attempts} intentos. ${error.lastError.message}`;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Error desconocido';
}
