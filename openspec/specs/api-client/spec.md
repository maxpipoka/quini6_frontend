# API Client Specification

## Purpose

This specification defines the typed API client for communicating with the backend API (Phase 3). It includes Zod validation schemas, error handling with requestId correlation, retry logic, and TypeScript types for all API contracts.

## Requirements

### Requirement: Typed API Client Factory

The system SHALL provide a factory function to create a typed API client with base URL, default headers, and interceptors.

#### Scenario: Client creates with correct base configuration

- GIVEN the API client factory
- WHEN creating a client with `createApiClient({ baseUrl: 'https://api.quini6.com' })`
- THEN the client has baseUrl configured
- AND default headers include `Content-Type: application/json`
- AND `Accept: application/json`

#### Scenario: Client attaches requestId to all requests

- GIVEN an API client instance
- WHEN any request is made
- THEN `X-Request-ID` header is added with a UUID v4
- AND the same requestId is available in response metadata

### Requirement: Zod Schema Validation

The system SHALL validate all API responses against Zod schemas and throw typed errors on validation failure.

#### Scenario: Valid response parses successfully

- GIVEN a response matching the Draw schema
- WHEN the client calls `getDraw(123)`
- THEN the response validates against the schema
- AND a typed Draw object returns
- AND no validation errors occur

#### Scenario: Invalid response throws validation error

- GIVEN a response missing required fields
- WHEN the client calls the endpoint
- THEN a `ApiValidationError` throws with Zod issue details
- AND the error includes the requestId for debugging
- AND the raw response is attached for inspection

#### Scenario: Request validation before send

- GIVEN a request body for POST/PUT
- WHEN the client prepares the request
- THEN the body validates against the request schema
- AND validation errors throw before network request
- AND TypeScript ensures compile-time body correctness

### Requirement: Error Handling with RequestId Correlation

The system SHALL provide structured error types with requestId for end-to-end tracing.

#### Scenario: Network error includes requestId

- GIVEN a network failure (timeout, DNS, connection refused)
- WHEN the request fails
- THEN an `ApiNetworkError` throws
- AND the error includes the requestId
- AND the error includes the original error cause

#### Scenario: HTTP error responses parse correctly

- GIVEN a 4xx or 5xx response with JSON error body
- WHEN the request completes
- THEN an `ApiHttpError` throws with status, statusText, and error body
- AND the error includes the requestId
- AND the error body validates against ErrorResponse schema

#### Scenario: Error boundary integration

- GIVEN an API error thrown in a component
- WHEN the error boundary catches it
- THEN the requestId displays in the fallback UI
- AND a "Report Issue" button includes the requestId in mailto link

### Requirement: Retry Logic with Exponential Backoff

The system SHALL automatically retry failed requests with exponential backoff for transient errors.

#### Scenario: Transient errors retry automatically

- GIVEN a 503 response or network timeout
- WHEN the request fails
- THEN the client retries up to 3 times
- AND delays follow exponential backoff (100ms, 200ms, 400ms)
- AND jitter is applied to prevent thundering herd

#### Scenario: Non-retryable errors fail fast

- GIVEN a 400, 401, 403, 404 response
- WHEN the request completes
- THEN no retry occurs
- AND the error throws immediately

#### Scenario: Retry configuration is customizable

- GIVEN client created with `retry: { maxAttempts: 5, baseDelay: 200 }`
- WHEN retries occur
- THEN the custom configuration applies
- AND default configuration works when not specified

### Requirement: Draw API Endpoints

The system SHALL provide typed methods for all draw-related endpoints.

#### Scenario: Get latest draw

- GIVEN the API client
- WHEN calling `getLatestDraw()`
- THEN GET request to `/draws/latest`
- AND response validates against Draw schema
- AND returns typed Draw object

#### Scenario: Get draw by ID

- GIVEN the API client
- WHEN calling `getDraw(123)`
- THEN GET request to `/draws/123`
- AND response validates against Draw schema

#### Scenario: Get draw history with pagination

- GIVEN the API client
- WHEN calling `getDrawHistory({ page: 1, limit: 10, year: 2024 })`
- THEN GET request to `/draws?page=1&limit=10&year=2024`
- AND response validates against PaginatedResponse<DrawSummary> schema
- AND returns typed paginated result

#### Scenario: Search exact combination

- GIVEN the API client
- WHEN calling `searchExactCombination([5, 12, 23, 34, 41, 46], { startDate, endDate })`
- THEN POST request to `/draws/search/exact` with body
- AND response validates against SearchResult schema
- AND returns exact matches and partial matches grouped

#### Scenario: Get number frequency

- GIVEN the API client
- WHEN calling `getNumberFrequency({ startDate, endDate })`
- THEN GET request to `/draws/statistics/frequency`
- AND response validates against FrequencyResponse schema
- AND returns array of 46 numbers with counts and percentages

### Requirement: Health Check Endpoint

The system SHALL provide a health check method for monitoring.

#### Scenario: Health check returns status

- GIVEN the API client
- WHEN calling `healthCheck()`
- THEN GET request to `/health`
- AND response validates against HealthCheck schema
- AND returns `{ status: 'ok', timestamp, version }`
