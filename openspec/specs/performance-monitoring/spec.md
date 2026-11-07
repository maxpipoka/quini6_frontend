# Performance Monitoring Specification

## Purpose

This specification defines Web Vitals collection (LCP, FID, CLS, TTFB, FCP) and reporting to Sentry as measurements for production performance monitoring.

## Requirements

### Requirement: Web Vitals Collection

The system SHALL collect all Core Web Vitals and additional metrics using the `web-vitals` library.

#### Scenario: LCP measurement collects and reports

- GIVEN page loads and Largest Contentful Paint occurs
- WHEN `onLCP` callback fires
- THEN metric sends to Sentry as measurement with name `LCP`
- AND value reports in milliseconds
- AND metric includes `rating` (good/needs-improvement/poor)

#### Scenario: FID measurement collects and reports

- GIVEN user first interacts with page
- WHEN `onFID` callback fires
- THEN metric sends to Sentry as measurement with name `FID`
- AND value reports in milliseconds
- AND metric includes `rating`

#### Scenario: CLS measurement collects and reports

- GIVEN layout shifts occur during page load
- WHEN `onCLS` callback fires (session value)
- THEN metric sends to Sentry as measurement with name `CLS`
- AND value reports as unitless score
- AND metric includes `rating`

#### Scenario: TTFB measurement collects and reports

- GIVEN page receives first byte from server
- WHEN `onTTFB` callback fires
- THEN metric sends to Sentry as measurement with name `TTFB`
- AND value reports in milliseconds
- AND metric includes `rating`

#### Scenario: FCP measurement collects and reports

- GIVEN page renders first content
- WHEN `onFCP` callback fires
- THEN metric sends to Sentry as measurement with name `FCP`
- AND value reports in milliseconds
- AND metric includes `rating`

### Requirement: Sentry Measurement Reporting

The system SHALL send Web Vitals to Sentry as measurements on transactions.

#### Scenario: Metrics attach to current transaction

- GIVEN a Sentry transaction is active (page load)
- WHEN Web Vitals callback fires
- THEN `Sentry.setMeasurement()` calls with metric name and value
- AND measurement attaches to active transaction

#### Scenario: Metrics create standalone transaction if none active

- GIVEN no Sentry transaction is active
- WHEN Web Vitals callback fires
- THEN a new transaction creates with name `web-vitals`
- AND measurement attaches to new transaction

### Requirement: Production-Only Reporting

The system SHALL only send Web Vitals to Sentry in production environment.

#### Scenario: Metrics send in production

- GIVEN `import.meta.env.PROD` is true
- WHEN Web Vitals callbacks fire
- THEN metrics send to Sentry

#### Scenario: Metrics do not send in development

- GIVEN `import.meta.env.DEV` is true
- WHEN Web Vitals callbacks fire
- THEN metrics log to console only
- AND no network requests to Sentry

#### Scenario: Metrics do not send in test

- GIVEN `import.meta.env.MODE === 'test'`
- WHEN Web Vitals callbacks fire
- Then metrics do not send
- AND no console noise in test output

### Requirement: Custom Metadata on Metrics

The system SHALL include page context with Web Vitals measurements.

#### Scenario: Metrics include page URL and route

- GIVEN Web Vitals callback fires
- WHEN measurement sends to Sentry
- THEN measurement includes `page.url` and `page.route` tags
- AND route reflects Astro route pattern (e.g., `/admin/draws/[id]`)

#### Scenario: Metrics include connection info

- GIVEN browser supports Navigation Timing API
- WHEN TTFB/FCP/LCP fire
- THEN measurement includes `connection.effectiveType` and `connection.downlink` if available