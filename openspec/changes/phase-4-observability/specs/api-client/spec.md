# Delta for api-client

## ADDED Requirements

### Requirement: Sentry Context Integration on Errors

The system SHALL attach requestId and error context to Sentry scope when API errors occur.

#### Scenario: ApiHttpError includes requestId in Sentry scope

- GIVEN an API request fails with 4xx/5xx response
- WHEN `ApiHttpError` throws with `requestId` property
- THEN Sentry scope sets tag `requestId` to error's requestId
- AND Sentry scope sets extra `apiError` with status, statusText, errorBody
- AND Sentry captures exception with enriched context

#### Scenario: ApiNetworkError includes requestId in Sentry scope

- GIVEN an API request fails with network error
- WHEN `ApiNetworkError` throws with `requestId` property
- THEN Sentry scope sets tag `requestId` to error's requestId
- AND Sentry scope sets extra `networkError` with original error message
- AND Sentry captures exception with enriched context

#### Scenario: ApiValidationError includes requestId in Sentry scope

- GIVEN an API response fails Zod validation
- WHEN `ApiValidationError` throws with `requestId` property
- THEN Sentry scope sets tag `requestId` to error's requestId
- AND Sentry scope sets extra `validationErrors` with Zod issue details
- AND Sentry captures exception with enriched context

#### Scenario: RequestId available for manual Sentry capture

- GIVEN code catches API error and calls `captureException(error)`
- WHEN error has `requestId` property
- THEN Sentry event automatically includes requestId tag
- AND no manual tag setting required

## MODIFIED Requirements

### Requirement: Error Handling with RequestId Correlation

The system SHALL provide structured error types with requestId for end-to-end tracing AND Sentry context propagation.
(Previously: Only provided structured error types with requestId for end-to-end tracing)

#### Scenario: Network error includes requestId

- GIVEN a network failure (timeout, DNS, connection refused)
- WHEN the request fails
- THEN an `ApiNetworkError` throws
- AND the error includes the requestId
- AND the error includes the original error cause
- AND Sentry scope receives requestId tag for correlation

#### Scenario: HTTP error responses parse correctly

- GIVEN a 4xx or 5xx response with JSON error body
- WHEN the request completes
- THEN an `ApiHttpError` throws with status, statusText, and error body
- AND the error includes the requestId
- AND the error body validates against ErrorResponse schema
- AND Sentry scope receives requestId tag and error details

#### Scenario: Error boundary integration

- GIVEN an API error thrown in a component
- WHEN the error boundary catches it
- THEN the requestId displays in the fallback UI
- AND a "Report Issue" button includes the requestId in mailto link
- AND Sentry already captured the error with requestId context

#### Scenario: Validation error includes requestId

- GIVEN a response missing required fields
- WHEN the client calls the endpoint
- THEN a `ApiValidationError` throws with Zod issue details
- AND the error includes the requestId for debugging
- AND the raw response is attached for inspection
- AND Sentry scope receives requestId tag and validation details