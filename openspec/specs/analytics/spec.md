# Analytics Specification

## Purpose

This specification defines the Plausible analytics integration for tracking key user events: search, login, and import actions, with privacy-friendly implementation.

## Requirements

### Requirement: Plausible Script Integration

The system SHALL include the Plausible script in the admin layout for event tracking.

#### Scenario: Plausible script loads in admin pages

- GIVEN an admin page loads
- WHEN `AdminLayout.astro` renders
- THEN Plausible script tag injects with `data-domain` from `VITE_PLAUSIBLE_DOMAIN`
- AND script loads asynchronously
- AND no blocking occurs on page render

#### Scenario: Plausible script excluded from public pages

- GIVEN a public page loads
- WHEN the page renders without admin layout
- THEN Plausible script does not load
- AND no analytics events fire

#### Scenario: Plausible fails gracefully if blocked

- GIVEN ad blocker prevents Plausible script load
- WHEN page loads
- THEN no JavaScript errors occur
- AND application functions normally
- AND events silently drop (acceptable data loss)

### Requirement: Event Tracking Helper

The system SHALL provide a `trackEvent()` helper function for consistent event tracking.

#### Scenario: Track event with name and properties

- GIVEN code calls `trackEvent('search', { query: 'quini6', results: 5 })`
- WHEN the function executes
- THEN Plausible `plausible()` function calls with event name and props
- AND event sends to Plausible endpoint
- AND properties include custom metadata

#### Scenario: Track event without properties

- GIVEN code calls `trackEvent('login')`
- WHEN the function executes
- THEN Plausible `plausible()` function calls with event name only
- AND event sends successfully

#### Scenario: Track event handles missing Plausible gracefully

- GIVEN Plausible script failed to load
- WHEN `trackEvent()` calls
- THEN no error throws
- AND function returns early without side effects

### Requirement: Search Event Tracking

The system SHALL track search actions with relevant metadata.

#### Scenario: Track combination search

- GIVEN user performs exact combination search
- WHEN search completes with results
- THEN `trackEvent('search_combination', { numbers: [5,12,23,34,41,46], matchCount: 3 })` fires
- AND event includes search parameters (not PII)

#### Scenario: Track frequency analysis search

- GIVEN user requests number frequency data
- WHEN request completes
- THEN `trackEvent('search_frequency', { dateRange: '2024-01-01/2024-12-31', numbersAnalyzed: 46 })` fires

### Requirement: Login Event Tracking

The system SHALL track admin login events.

#### Scenario: Track successful login

- GIVEN admin submits valid credentials
- WHEN login API returns success
- THEN `trackEvent('admin_login', { method: 'email' })` fires
- AND no sensitive data (password, token) included

#### Scenario: Track failed login

- GIVEN admin submits invalid credentials
- WHEN login API returns 401
- THEN `trackEvent('admin_login_failed', { reason: 'invalid_credentials' })` fires

### Requirement: Import Event Tracking

The system SHALL track bulk import actions.

#### Scenario: Track import upload start

- GIVEN admin selects file for import
- WHEN upload begins
- THEN `trackEvent('import_start', { fileName: 'draws-2024.csv', fileSize: 102400 })` fires

#### Scenario: Track import commit

- GIVEN admin confirms import preview
- WHEN commit API returns success
- THEN `trackEvent('import_commit', { drawsImported: 50, drawsSkipped: 2 })` fires

#### Scenario: Track import error

- GIVEN import fails validation or API error
- WHEN error occurs
- THEN `trackEvent('import_error', { errorType: 'validation', errorCount: 3 })` fires