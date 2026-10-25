# API Client - Delta Specification (Phase 3 Bulk Import)

## Purpose

This delta specification defines modifications to the existing api-client capability to add bulk import endpoints with typed request/response schemas. The base API client specification exists at `openspec/specs/api-client/spec.md`.

## Existing Requirements (UNCHANGED)

All existing requirements from the base API client specification remain unchanged:
- Typed API Client Factory
- Zod Schema Validation
- Error Handling with RequestId Correlation
- Retry Logic with Exponential Backoff
- Draw API Endpoints (getLatestDraw, getDraw, getDrawHistory, searchExactCombination, getNumberFrequency)
- Health Check Endpoint

---

## ADDED Sections

### Requirement: Import Preview Endpoint

The system SHALL provide a typed method to submit parsed rows for preview and receive an importId.

#### Scenario: Import preview submits validated rows

- GIVEN an array of validated draw rows
- WHEN calling `importPreview(rows)`
- THEN POST request to `/admin/imports/preview` with body `{ rows }`
- AND request includes CSRF header and credentials
- AND response validates against ImportPreviewResponseSchema
- AND returns `{ importId: string, validCount: number, invalidCount: number }`

#### Scenario: Import preview validates request body

- GIVEN rows array with invalid structure
- WHEN calling `importPreview(rows)`
- THEN Zod validates request against ImportPreviewRequestSchema
- AND validation errors throw before network request
- AND TypeScript ensures compile-time correctness

#### Scenario: Import preview handles server validation errors

- GIVEN server returns 400 with validation errors
- WHEN the request completes
- THEN ApiHttpError throws with status 400
- AND error body validates against ErrorResponse schema
- AND error includes requestId for debugging

### Requirement: Import Commit Endpoint

The system SHALL provide a typed method to commit a previewed import with a conflict resolution policy.

#### Scenario: Import commit with policy

- GIVEN an importId from preview and a policy (skip|replace|merge)
- WHEN calling `importCommit(importId, policy)`
- THEN POST request to `/admin/imports/{importId}/commit?policy={policy}`
- AND request includes CSRF header and credentials
- AND response validates against ImportCommitResponseSchema
- AND returns `{ created: number, updated: number, skipped: number, failed: number, errors: ImportError[] }`

#### Scenario: Import commit maps policy to backend enum

- GIVEN policy "skip" | "replace" | "merge"
- WHEN the request is made
- THEN query parameter `policy` matches exactly
- AND invalid policy throws TypeScript error at compile time

#### Scenario: Import commit progress polling (optional)

- GIVEN a long-running import
- WHEN calling `importCommit(importId, policy, { onProgress })`
- THEN the client polls `/admin/imports/{importId}/status` or uses SSE
- AND onProgress callback receives `{ stage: 'processing'|'committing'|'completed', progress: number }`
- AND polling stops on completion or error

### Requirement: Import History Endpoint

The system SHALL provide a typed method to fetch paginated import history.

#### Scenario: Get import history with pagination

- GIVEN page and limit parameters
- WHEN calling `getImportHistory({ page: 1, limit: 10, sort: 'date', order: 'desc' })`
- THEN GET request to `/admin/imports?page=1&limit=10&sort=date&order=desc`
- AND response validates against ImportHistoryResponseSchema
- AND returns `{ data: ImportSummary[], page: number, limit: number, total: number, totalPages: number }`

#### Scenario: Import history supports filtering

- GIVEN optional filter parameters
- WHEN calling `getImportHistory({ page: 1, limit: 10, startDate, endDate, policy })`
- THEN query parameters include filters
- AND response returns filtered results

### Requirement: Import Errors Endpoint

The system SHALL provide a typed method to fetch detailed errors for a specific import.

#### Scenario: Get import errors

- GIVEN an importId with failed rows
- WHEN calling `getImportErrors(importId)`
- THEN GET request to `/admin/imports/{importId}/errors`
- AND response validates against ImportErrorsResponseSchema
- AND returns `{ errors: ImportErrorDetail[] }` with rowNumber, field, message, rawValue

#### Scenario: Import errors empty for successful imports

- GIVEN an importId with zero failed rows
- WHEN calling `getImportErrors(importId)`
- THEN response returns `{ errors: [] }`
- AND no error thrown

---

## MODIFIED Sections

### Requirement: API Client Factory (MODIFIED - Extended)

**Original:** Creates client with base URL, default headers, interceptors

**Modified:** Creates client with base URL, default headers, interceptors, **and import methods**

The `createApiClient` factory now returns an object that includes:
```typescript
{
  // ... existing methods
  importPreview: (rows: DrawRow[]) => Promise<ImportPreviewResponse>,
  importCommit: (importId: string, policy: 'skip'|'replace'|'merge', options?: { onProgress?: (p: ImportProgress) => void }) => Promise<ImportCommitResponse>,
  getImportHistory: (params: ImportHistoryParams) => Promise<ImportHistoryResponse>,
  getImportErrors: (importId: string) => Promise<ImportErrorsResponse>,
}
```

### Requirement: Zod Schema Validation (MODIFIED - Extended)

**Original:** Validates all API responses against Zod schemas

**Modified:** Validates all API responses against Zod schemas **including new import schemas**

New schemas added to `src/lib/schemas.ts`:
- `ImportPreviewRequestSchema` - validates rows array
- `ImportPreviewResponseSchema` - validates `{ importId, validCount, invalidCount }`
- `ImportCommitRequestSchema` - validates policy param
- `ImportCommitResponseSchema` - validates `{ created, updated, skipped, failed, errors }`
- `ImportHistoryResponseSchema` - validates paginated import summaries
- `ImportErrorsResponseSchema` - validates error details array
- `ImportErrorSchema` - individual error structure
- `ImportErrorDetailSchema` - detailed error with rowNumber, field, message, rawValue
- `ImportProgressSchema` - progress stage and percentage

### Requirement: Draw API Endpoints (MODIFIED - Extended)

**Original:** Provides typed methods for all draw-related endpoints

**Modified:** Provides typed methods for all draw-related endpoints **and import endpoints**

The API client now includes import methods alongside draw methods. All import methods follow the same patterns:
- Use `credentials: 'include'`
- Inject CSRF header via `beforeRequest` hook
- Handle 401 refresh via `afterResponse` hook
- Validate request/response with Zod
- Throw typed errors with requestId

---

## REMOVED Sections

None - no existing functionality removed.

---

## New TypeScript Interfaces (Added to schemas.ts)

```typescript
// Request/Response types for import endpoints
export interface ImportPreviewRequest {
  rows: DrawRowInput[];
}

export interface ImportPreviewResponse {
  importId: string;
  validCount: number;
  invalidCount: number;
}

export type ImportPolicy = 'skip' | 'replace' | 'merge';

export interface ImportCommitRequest {
  importId: string;
  policy: ImportPolicy;
}

export interface ImportCommitResponse {
  created: number;
  updated: number;
  skipped: number;
  failed: number;
  errors: ImportError[];
}

export interface ImportError {
  row: number;
  field: string;
  message: string;
}

export interface ImportHistoryParams {
  page?: number;
  limit?: number;
  sort?: 'date' | 'fileName' | 'processed' | 'succeeded' | 'failed';
  order?: 'asc' | 'desc';
  startDate?: string;
  endDate?: string;
  policy?: ImportPolicy;
}

export interface ImportSummary {
  importId: string;
  fileName: string;
  date: string;
  rowsProcessed: number;
  succeeded: number;
  failed: number;
  policy: ImportPolicy;
}

export interface ImportHistoryResponse {
  data: ImportSummary[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ImportErrorDetail {
  rowNumber: number;
  field: string;
  message: string;
  rawValue: unknown;
}

export interface ImportErrorsResponse {
  errors: ImportErrorDetail[];
}

export type ImportProgressStage = 'processing' | 'committing' | 'completed';

export interface ImportProgress {
  stage: ImportProgressStage;
  progress: number; // 0-100
}
```

## Integration Notes

### CSRF and Credentials
All new import endpoints use the existing `beforeRequest` hook for CSRF header injection and `credentials: 'include'` for session cookies. No additional auth logic needed.

### Error Handling
Import endpoints follow existing error handling:
- `ApiValidationError` for Zod validation failures
- `ApiHttpError` for 4xx/5xx responses with validated error body
- `ApiNetworkError` for network failures
- All errors include `requestId` for tracing

### Retry Logic
Import preview/commit are **non-retryable** (POST with side effects):
- They should NOT be retried on 5xx
- The existing retry logic excludes non-idempotent methods
- Add import endpoints to non-retryable list in client config

### Backend Contract Alignment
Endpoints match backend spec:
- `POST /admin/imports/preview` → `{ importId, validCount, invalidCount }`
- `POST /admin/imports/{importId}/commit?policy=` → `{ created, updated, skipped, failed, errors }`
- `GET /admin/imports` (paginated) → `{ data: ImportSummary[], ... }`
- `GET /admin/imports/{importId}/errors` → `{ errors: ImportErrorDetail[] }`