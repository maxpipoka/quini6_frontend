# Progressive Web App Specification

## Purpose

This specification defines service-worker behavior for installability and offline resilience: build-asset precaching, offline fallback limited to previously-visited pages, runtime caching for immutable assets, and strict network-only rules for the API.

## Requirements

### Requirement: Service Worker Generation

The system SHALL generate a service worker at build time using `@vite-pwa/astro` with Workbox `generateSW`, precaching the build's static assets, and update mode `autoUpdate`.

#### Scenario: Build emits a service worker with precache

- GIVEN `npm run build` completes
- WHEN the service worker is generated
- THEN the precache manifest includes built JS/CSS/HTML assets (including `/_astro/` artifacts)
- AND the worker registers on page load without errors

#### Scenario: New versions apply silently on the next visit

- GIVEN a new deployment replaces the previous one
- WHEN a returning visitor loads any page
- THEN the updated service worker installs and activates without a reload prompt
- AND the visitor sees updated assets on the next navigation or reload

### Requirement: Offline Fallback for Previously Visited Pages

The system SHALL serve a previously-visited page from cache when the network is unavailable, and SHALL serve a dedicated offline fallback page when no cached copy exists.

#### Scenario: Previously visited page loads offline

- GIVEN the user visited `/historial` while online
- WHEN the user goes offline and requests `/historial`
- THEN the cached page renders

#### Scenario: Unvisited page offline shows the fallback page

- GIVEN the user has never visited `/busqueda`
- WHEN the user is offline and requests `/busqueda`
- THEN the offline fallback page renders with a message and a way back (home or retry link)
- AND the browser does not display a raw network error

### Requirement: Runtime Caching for Static Assets

The system SHALL cache `/_astro/` build assets and images at runtime so repeat visits do not refetch them.

#### Scenario: Build assets are served from cache

- GIVEN a page was loaded once while online
- WHEN the user is offline and requests a `/_astro/` JS/CSS asset
- THEN the cached asset serves

#### Scenario: Images are reused from cache

- GIVEN an image was fetched at least once
- WHEN it is requested again (online or offline)
- THEN a cached copy serves within configured cache limits

### Requirement: API Requests Are Never Cached

The system SHALL treat `/api/*` as network-only: API responses MUST NOT be written to, or served from, the service-worker cache.

#### Scenario: API calls bypass the cache while online

- GIVEN the service worker is active
- WHEN a page issues a request to `/api/*`
- THEN the request goes directly to the network
- AND no cached API response is returned

#### Scenario: Offline API call fails instead of serving stale data

- GIVEN the service worker is active and the device is offline
- WHEN a page issues a request to `/api/*`
- THEN the request fails and the app shows its normal error handling
- AND no API response is stored in the cache

### Requirement: Installability

The system SHALL be installable as a PWA: a valid web app manifest with name, icons (including 512px), theme color, and start URL, served over HTTPS.

#### Scenario: Manifest passes installability checks

- GIVEN the deployed site over HTTPS
- WHEN Lighthouse installability checks run
- THEN the manifest provides name, icons, `start_url`, and `display`
- AND no installability errors are reported

---

## ADDED Sections

All requirements above are ADDED for this new capability.

## MODIFIED Sections

None — this is a new capability.

## REMOVED Sections

None — this is a new capability.
