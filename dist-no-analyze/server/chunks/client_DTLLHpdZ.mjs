;!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="7ef37e91-803a-4575-b5df-7d29740f155d",e._sentryDebugIdIdentifier="sentry-dbid-7ef37e91-803a-4575-b5df-7d29740f155d")}catch(e){}}();import ky from 'ky';
import { v4 } from 'uuid';
import './_sentry-release-injection-file_BwnRfS4D.mjs';
import * as Sentry from '@sentry/astro';
import { D as DrawResponseSchema, P as PaginatedDrawsResponseSchema, c as ExactSearchResponseSchema, E as ExactSearchRequestSchema, F as FrequencyResponseSchema, H as HealthCheckSchema, d as HealthDbSchema, L as LoginSchema, e as ChangePasswordSchema, C as CreateDrawSchema, U as UpdateDrawSchema, g as CommitImportSchema, h as ImportPreviewResponseSchema, i as ImportPreviewRequestSchema, j as ImportCommitResponseSchema, I as ImportHistoryResponseSchema, b as ImportErrorsResponseSchema } from './schemas_BWmv8V5v.mjs';

class ApiError extends Error {
  requestId;
  statusCode;
  timestamp;
  path;
  constructor(message, requestId, statusCode, timestamp, path) {
    super(message);
    this.name = this.constructor.name;
    this.requestId = requestId;
    this.statusCode = statusCode;
    this.timestamp = timestamp;
    this.path = path;
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
      path: this.path
    };
  }
}
class ApiValidationError extends ApiError {
  errors;
  constructor(message, requestId, statusCode, timestamp, path, errors = []) {
    super(message, requestId, statusCode, timestamp, path);
    this.name = "ApiValidationError";
    this.errors = errors;
  }
  toJSON() {
    return {
      ...super.toJSON(),
      errors: this.errors
    };
  }
}
class ApiNetworkError extends ApiError {
  originalError;
  constructor(message, requestId, originalError, path) {
    super(message, requestId, 0, (/* @__PURE__ */ new Date()).toISOString(), path);
    this.name = "ApiNetworkError";
    this.originalError = originalError;
  }
  toJSON() {
    return {
      ...super.toJSON(),
      originalError: this.originalError.message
    };
  }
}
class ApiHttpError extends ApiError {
  responseBody;
  constructor(message, requestId, statusCode, timestamp, path, responseBody = null) {
    super(message, requestId, statusCode, timestamp, path);
    this.name = "ApiHttpError";
    this.responseBody = responseBody;
  }
  toJSON() {
    return {
      ...super.toJSON(),
      responseBody: this.responseBody
    };
  }
}
class ApiTimeoutError extends ApiError {
  constructor(requestId, path, timeout) {
    super(`Request timed out after ${timeout}ms`, requestId, 408, (/* @__PURE__ */ new Date()).toISOString(), path);
    this.name = "ApiTimeoutError";
  }
}
class ApiRetryError extends ApiError {
  attempts;
  lastError;
  constructor(message, requestId, statusCode, timestamp, path, attempts, lastError) {
    super(message, requestId, statusCode, timestamp, path);
    this.name = "ApiRetryError";
    this.attempts = attempts;
    this.lastError = lastError;
  }
  toJSON() {
    return {
      ...super.toJSON(),
      attempts: this.attempts,
      lastError: this.lastError.message
    };
  }
}
function isApiValidationError(error) {
  return error instanceof ApiValidationError;
}
function isApiHttpError(error) {
  return error instanceof ApiHttpError;
}

function createBeforeErrorHook(options) {
  return async (error) => {
    const { response } = error;
    if (response) {
      const requestId = extractRequestId(response.headers);
      const timestamp = (/* @__PURE__ */ new Date()).toISOString();
      const path = response.url;
      let errorData = null;
      try {
        errorData = await response.clone().json();
      } catch {
      }
      Sentry.setTag("requestId", requestId);
      Sentry.setExtra("responseStatus", response.status);
      Sentry.setExtra("responseUrl", response.url);
      Sentry.setExtra("errorTimestamp", timestamp);
      if (errorData) {
        Sentry.setExtra("errorData", errorData);
      }
      if (response.status === 400 && errorData?.message) {
        const errors = Array.isArray(errorData.message) ? errorData.message : [errorData.message];
        throw new ApiValidationError(
          Array.isArray(errorData.message) ? errorData.message.join(", ") : errorData.message,
          requestId,
          response.status,
          timestamp,
          path,
          errors
        );
      }
      if (isNonRetryableStatus(response.status)) {
        throw new ApiHttpError(
          errorData?.message ?? `HTTP ${response.status}`,
          requestId,
          response.status,
          timestamp,
          path,
          errorData
        );
      }
      throw new ApiHttpError(
        errorData?.message ?? `HTTP ${response.status}`,
        requestId,
        response.status,
        timestamp,
        path,
        errorData
      );
    }
    if (error instanceof TypeError) {
      const requestId = generateRequestId();
      Sentry.setTag("requestId", requestId);
      Sentry.setExtra("errorType", "network");
      Sentry.setExtra("originalError", error.message);
      throw new ApiNetworkError(
        "Network error: Failed to fetch",
        requestId,
        error,
        error.request?.url ?? ""
      );
    }
    if (error.name === "TimeoutError") {
      const requestId = generateRequestId();
      Sentry.setTag("requestId", requestId);
      Sentry.setExtra("errorType", "timeout");
      Sentry.setExtra("timeoutMs", options.timeout);
      throw new ApiTimeoutError(requestId, error.request?.url ?? "", options.timeout);
    }
    throw error;
  };
}

function generateRequestId() {
  return v4();
}
function isRetryableError(error, statusCode) {
  if (error instanceof TypeError && error.message.includes("fetch")) {
    return true;
  }
  if (statusCode >= 500 && statusCode < 600) {
    return true;
  }
  if (statusCode === 408) {
    return true;
  }
  if (statusCode === 429) {
    return true;
  }
  return false;
}
function isNonRetryableStatus(statusCode) {
  return [400, 401, 403, 404].includes(statusCode);
}
function calculateRetryDelay(attempt, baseDelay = 100) {
  const exponentialDelay = baseDelay * Math.pow(2, attempt - 1);
  const jitter = Math.random() * 0.3 * exponentialDelay;
  return Math.floor(exponentialDelay + jitter);
}
function extractRequestId(headers) {
  return headers.get("x-request-id") ?? headers.get("request-id") ?? generateRequestId();
}
class ApiClient {
  client;
  config;
  refreshPromise = null;
  getCsrfToken() {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(/(?:^|; )csrf_token=([^;]*)/);
    return match?.[1] ? decodeURIComponent(match[1]) : null;
  }
  async handleUnauthorized() {
    if (this.refreshPromise) return this.refreshPromise;
    this.refreshPromise = (async () => {
      try {
        await fetch(`${this.config.baseUrl}/admin/auth/me`, {
          credentials: "include",
          headers: {
            "X-CSRF-Token": this.getCsrfToken() ?? ""
          }
        });
      } catch {
      } finally {
        this.refreshPromise = null;
      }
    })();
    return this.refreshPromise;
  }
  constructor(config) {
    this.config = {
      baseUrl: config.baseUrl,
      timeout: config.timeout ?? 3e4,
      defaultHeaders: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...config.defaultHeaders
      },
      retryAttempts: config.retryAttempts ?? 3,
      retryDelay: config.retryDelay ?? calculateRetryDelay
    };
    this.client = ky.create({
      prefixUrl: this.config.baseUrl,
      timeout: this.config.timeout,
      headers: this.config.defaultHeaders,
      credentials: "include",
      hooks: {
        beforeRequest: [
          (request) => {
            request.headers.set("X-Request-ID", generateRequestId());
            const method = request.method.toUpperCase();
            if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
              const csrfToken = this.getCsrfToken();
              if (csrfToken) {
                request.headers.set("X-CSRF-Token", csrfToken);
              }
            }
          }
        ],
        afterResponse: [
          async (_request, _options, response) => {
            if (response.status === 401) {
              await this.handleUnauthorized();
            }
            return response;
          }
        ],
        beforeError: [createBeforeErrorHook({ timeout: this.config.timeout })]
      }
    });
  }
  // ============================================================================
  // Private Methods
  // ============================================================================
  async request(method, url, options = {}) {
    const { validateWith, validateBodyWith, ...kyOptions } = options;
    let lastError = null;
    for (let attempt = 1; attempt <= this.config.retryAttempts; attempt++) {
      try {
        if (validateBodyWith && kyOptions.json) {
          const validationResult = validateBodyWith.safeParse(kyOptions.json);
          if (!validationResult.success) {
            throw new ApiValidationError(
              "Request body validation failed",
              generateRequestId(),
              400,
              (/* @__PURE__ */ new Date()).toISOString(),
              url,
              validationResult.error.errors.map((e) => e.message)
            );
          }
        }
        const response = await this.client[method](
          url,
          kyOptions
        );
        const data = await response.json();
        if (validateWith) {
          const validationResult = validateWith.safeParse(data);
          if (!validationResult.success) {
            const requestId2 = extractRequestId(response.headers);
            throw new ApiValidationError(
              "Response validation failed",
              requestId2,
              500,
              (/* @__PURE__ */ new Date()).toISOString(),
              url,
              validationResult.error.errors.map((e) => e.message)
            );
          }
          return validationResult.data;
        }
        return data;
      } catch (error) {
        lastError = error;
        if (isApiValidationError(error) || isApiHttpError(error)) {
          const httpError = error;
          if (isNonRetryableStatus(httpError.statusCode)) {
            throw error;
          }
        }
        if (attempt === this.config.retryAttempts) {
          break;
        }
        const statusCode = isApiHttpError(error) ? error.statusCode : 0;
        if (!isRetryableError(error, statusCode)) {
          throw error;
        }
        const delay = this.config.retryDelay(attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
    const requestId = generateRequestId();
    throw new ApiRetryError(
      `Request failed after ${this.config.retryAttempts} attempts`,
      requestId,
      isApiHttpError(lastError) ? lastError.statusCode : 0,
      (/* @__PURE__ */ new Date()).toISOString(),
      url,
      this.config.retryAttempts,
      lastError
    );
  }
  // ============================================================================
  // Public API Methods
  // ============================================================================
  async getLatestDraw() {
    return this.request("get", "draws/latest", {
      validateWith: DrawResponseSchema
    });
  }
  async getDraw(officialNumber) {
    return this.request("get", `draws/${officialNumber}`, {
      validateWith: DrawResponseSchema
    });
  }
  async getDrawHistory(params = {}) {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set("page", String(params.page));
    if (params.limit) searchParams.set("limit", String(params.limit));
    if (params.year) searchParams.set("year", String(params.year));
    const url = `draws${searchParams.toString() ? `?${searchParams}` : ""}`;
    return this.request("get", url, {
      validateWith: PaginatedDrawsResponseSchema
    });
  }
  async searchExactCombination(numbers, dateRange) {
    const body = { numbers };
    const searchParams = new URLSearchParams();
    if (dateRange?.fromDate) searchParams.set("fromDate", dateRange.fromDate);
    if (dateRange?.toDate) searchParams.set("toDate", dateRange.toDate);
    const url = `search/exact${searchParams.toString() ? `?${searchParams}` : ""}`;
    return this.request("post", url, {
      json: body,
      validateBodyWith: ExactSearchRequestSchema,
      validateWith: ExactSearchResponseSchema
    });
  }
  async getNumberFrequency(params = {}) {
    const searchParams = new URLSearchParams();
    if (params.fromDate) searchParams.set("fromDate", params.fromDate);
    if (params.toDate) searchParams.set("toDate", params.toDate);
    if (params.modality) searchParams.set("modality", params.modality);
    const url = `frequency${searchParams.toString() ? `?${searchParams}` : ""}`;
    return this.request("get", url, {
      validateWith: FrequencyResponseSchema
    });
  }
  async healthCheck() {
    return this.request("get", "health", {
      validateWith: HealthCheckSchema
    });
  }
  async healthDbCheck() {
    return this.request("get", "health/db", {
      validateWith: HealthDbSchema
    });
  }
  // ============================================================================
  // Admin Methods (require authentication)
  // ============================================================================
  async adminLogin(credentials) {
    return this.request("post", "admin/auth/login", {
      json: credentials,
      validateBodyWith: LoginSchema
    });
  }
  async adminMe() {
    return this.request("get", "admin/auth/me");
  }
  async adminLogout() {
    await this.request("post", "admin/auth/logout");
  }
  async adminChangePassword(data) {
    return this.request("post", "admin/auth/change-password", {
      json: data,
      validateBodyWith: ChangePasswordSchema
    });
  }
  async adminCreateDraw(data) {
    return this.request("post", "admin/draws", {
      json: data,
      validateBodyWith: CreateDrawSchema,
      validateWith: DrawResponseSchema
    });
  }
  async adminUpdateDraw(id, data) {
    return this.request("patch", `admin/draws/${id}`, {
      json: data,
      validateBodyWith: UpdateDrawSchema,
      validateWith: DrawResponseSchema
    });
  }
  async adminDeleteDraw(id) {
    await this.request("delete", `admin/draws/${id}`);
  }
  async adminImportPreview(file) {
    const formData = new FormData();
    formData.append("file", file);
    return this.request("post", "admin/import/preview", {
      body: formData,
      headers: {}
    });
  }
  async adminImportCommit(data) {
    return this.request("post", "admin/import/commit", {
      json: data,
      validateBodyWith: CommitImportSchema
    });
  }
  async adminListImports(params = { page: 1, limit: 20 }) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== void 0) {
        searchParams.set(key, String(value));
      }
    });
    const url = `admin/import${searchParams.toString() ? `?${searchParams}` : ""}`;
    return this.request("get", url);
  }
  async adminGetImport(id) {
    return this.request("get", `admin/import/${id}`);
  }
  // ============================================================================
  // Import Methods (Phase 3 Bulk Import)
  // ============================================================================
  /**
   * Submit parsed rows for import preview
   * POST /admin/imports/preview
   */
  async importPreview(rows) {
    return this.request("post", "admin/imports/preview", {
      json: { rows },
      validateBodyWith: ImportPreviewRequestSchema,
      validateWith: ImportPreviewResponseSchema
    });
  }
  /**
   * Commit a previewed import with conflict resolution policy
   * POST /admin/imports/{importId}/commit?policy={policy}
   */
  async importCommit(importId, policy, _options) {
    const url = `admin/imports/${importId}/commit?policy=${policy}`;
    return this.request("post", url, {
      validateWith: ImportCommitResponseSchema
    });
  }
  /**
   * Get paginated import history
   * GET /admin/imports
   */
  async getImportHistory(params = { page: 1, limit: 10 }) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== void 0) {
        searchParams.set(key, String(value));
      }
    });
    const url = `admin/imports${searchParams.toString() ? `?${searchParams}` : ""}`;
    return this.request("get", url, {
      validateWith: ImportHistoryResponseSchema
    });
  }
  /**
   * Get detailed errors for a specific import
   * GET /admin/imports/{importId}/errors
   */
  async getImportErrors(importId) {
    return this.request("get", `admin/imports/${importId}/errors`, {
      validateWith: ImportErrorsResponseSchema
    });
  }
}
let apiClientInstance = null;
function createApiClient(config) {
  return new ApiClient(config);
}
function getApiClient() {
  if (!apiClientInstance) {
    const baseUrl = "https://api.quini6.com/api";
    apiClientInstance = createApiClient({ baseUrl });
  }
  return apiClientInstance;
}

export { getApiClient as g };
