# Error Tracking Specification

## Purpose

This specification defines the Sentry error tracking integration with requestId correlation for end-to-end error tracing across frontend and backend.

## Requirements

### Requirement: Sentry Initialization

The system SHALL initialize Sentry on application startup with DSN configuration from environment variables.

#### Scenario: Sentry initializes with valid DSN

- GIVEN the application starts in production
- WHEN `VITE_SENTRY_DSN` environment variable is set
- THEN Sentry SDK initializes with the DSN
- AND error tracking is enabled
- AND `requestId` tag is available for correlation

#### Scenario: Sentry fails gracefully without DSN

- GIVEN the application starts without `VITE_SENTRY_DSN`
- WHEN Sentry initialization runs
- THEN Sentry initializes in disabled mode
- AND a warning logs to console
- AND application continues without crashing

#### Scenario: Sentry does not initialize in development

- GIVEN the application runs in development mode
- WHEN `import.meta.env.DEV` is true
- THEN Sentry initializes but only captures locally
- AND no events send to Sentry servers

### Requirement: Error Capture with RequestId Correlation

The system SHALL capture all unhandled errors and associate them with the requestId from the API client.

#### Scenario: Unhandled error captures with requestId

- GIVEN an unhandled error occurs in a component
- WHEN the error boundary or global handler catches it
- THEN Sentry captures the error
- AND the event includes `requestId` tag from the failing request
- AND the event includes component stack trace

#### Scenario: API error captures with requestId

- GIVEN an API request fails with `ApiHttpError` or `ApiNetworkError`
- WHEN the error throws from the API client
- THEN Sentry captures the error
- AND the event includes the error's `requestId` property
- AND the event includes HTTP status and response body (if available)

#### Scenario: Manual error capture with context

- GIVEN code calls `captureException(error, { extra: { userId: 123 } })`
- WHEN the error captures
- THEN Sentry event includes the extra context
- AND the event includes current requestId if available

### Requirement: RequestId Tag Propagation

The system SHALL ensure requestId from API client errors propagates to Sentry scope.

#### Scenario: RequestId from API error attaches to Sentry scope

- GIVEN an API client error with `requestId` property
- WHEN the error is caught and sent to Sentry
- THEN Sentry scope sets tag `requestId` to the error's requestId
- AND subsequent breadcrumbs in same scope inherit the tag

#### Scenario: RequestId from middleware attaches to Sentry scope

- GIVEN a request passes through Astro middleware
- WHEN middleware generates or extracts requestId
- THEN Sentry scope sets tag `requestId` for the request duration
- AND any errors during request inherit the tag

### Requirement: Source Maps Upload

The system SHALL support source map upload for production builds.

#### Scenario: Source maps upload on build

- GIVEN a production build completes
- WHEN `sentry-cli` runs with auth token
- THEN source maps upload to Sentry
- AND minified files map to original TypeScript sources
- AND stack traces in Sentry show original line numbers

#### Scenario: Build fails gracefully if upload fails

- GIVEN source map upload fails (network, auth)
- WHEN the build pipeline runs
- THEN build continues without failing
- AND warning logs indicate upload failure