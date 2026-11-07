# Health Check UI Specification

## Purpose

This specification defines the admin health check page (`/admin/health`) that displays API and database health status using existing `healthCheck()` and `healthDbCheck()` API methods.

## Requirements

### Requirement: Health Check Page Route

The system SHALL provide a health check page at `/admin/health` accessible only to authenticated admins.

#### Scenario: Authenticated admin accesses health page

- GIVEN admin is logged in with valid session
- WHEN navigating to `/admin/health`
- THEN page renders with health status components
- AND sidebar highlights "Salud del sistema" navigation item

#### Scenario: Unauthenticated user redirects to login

- GIVEN user is not authenticated
- WHEN navigating to `/admin/health`
- THEN middleware redirects to `/admin/login`
- AND redirect includes return URL

#### Scenario: Page requires admin role

- GIVEN authenticated user without admin role (future)
- WHEN accessing `/admin/health`
- THEN 403 Forbidden returns
- AND appropriate error page shows

### Requirement: API Health Check Display

The system SHALL display API health status by calling `healthCheck()`.

#### Scenario: API health check shows healthy status

- GIVEN health page loads
- WHEN `healthCheck()` API call returns `{ status: 'ok', timestamp, version }`
- THEN UI displays green status indicator
- AND timestamp shows in local timezone
- AND version displays

#### Scenario: API health check shows degraded status

- GIVEN health page loads
- WHEN `healthCheck()` API call returns `{ status: 'degraded', ... }`
- THEN UI displays yellow/warning status indicator
- AND details show degradation reason if available

#### Scenario: API health check handles network error

- GIVEN health page loads
- WHEN `healthCheck()` throws network error
- THEN UI displays red/error status indicator
- AND error message shows "API unreachable"
- AND retry button available

#### Scenario: API health check shows loading state

- GIVEN health page loads
- WHEN `healthCheck()` is in-flight
- THEN UI shows skeleton/spinner for API status
- AND no error state displays prematurely

### Requirement: Database Health Check Display

The system SHALL display database health status by calling `healthDbCheck()`.

#### Scenario: Database health check shows healthy status

- GIVEN health page loads
- WHEN `healthDbCheck()` API call returns `{ status: 'ok', latencyMs: 5 }`
- THEN UI displays green status indicator
- AND latency shows in milliseconds

#### Scenario: Database health check shows slow response

- GIVEN health page loads
- WHEN `healthDbCheck()` returns `{ status: 'ok', latencyMs: 500 }`
- THEN UI displays yellow status indicator
- AND latency shows with warning threshold note

#### Scenario: Database health check handles connection failure

- GIVEN health page loads
- WHEN `healthDbCheck()` throws or returns error status
- THEN UI displays red/error status indicator
- AND error message shows "Database connection failed"

### Requirement: Auto-Refresh and Manual Refresh

The system SHALL support automatic and manual health check refresh.

#### Scenario: Auto-refresh polls every 30 seconds

- GIVEN health page is open
- WHEN 30 seconds elapse
- THEN both health checks re-run automatically
- AND UI updates with new status without full page reload

#### Scenario: Manual refresh button triggers checks

- GIVEN health page is open
- WHEN admin clicks "Actualizar" button
- THEN both health checks run immediately
- AND button shows loading state during checks
- AND results update on completion

#### Scenario: Auto-refresh pauses when tab hidden

- GIVEN health page open but tab not visible
- WHEN `document.visibilityState === 'hidden'`
- THEN auto-refresh pauses
- AND resumes when tab becomes visible again

### Requirement: Health Check History (Optional)

The system MAY display recent health check history.

#### Scenario: Last 10 checks display with timestamps

- GIVEN health page loads
- WHEN checks complete
- THEN history table shows last 10 results
- AND each row shows timestamp, API status, DB status, latency

#### Scenario: History persists across refreshes

- GIVEN history displayed
- WHEN manual or auto refresh runs
- THEN new entry prepends to history
- AND oldest entry removes if > 10 entries