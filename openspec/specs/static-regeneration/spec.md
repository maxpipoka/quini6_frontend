# Static Regeneration Specification

## Purpose

This specification defines the static site generation and incremental regeneration strategy for draw detail pages. It covers `getStaticPaths` configuration, Vercel Deploy Hook integration, and on-demand rendering fallback for scalability with thousands of historical draws.

## Requirements

### Requirement: getStaticPaths for Draw Detail Pages

The system SHALL generate static paths for draw detail pages at build time with configurable batching for large datasets.

#### Scenario: Build generates paths for all historical draws

- GIVEN 500 historical draws in the data source
- WHEN `npm run build` executes
- THEN `getStaticPaths` returns 500 paths for `/detalle/1` through `/detalle/500`
- AND all 500 HTML files generate in `dist/detalle/[id]/index.html`
- AND build completes within 3 minutes

#### Scenario: Paginated getStaticPaths for large datasets

- GIVEN 5000+ historical draws
- WHEN `getStaticPaths` executes with pagination config
- THEN paths generate in batches of 100 per build step
- AND memory usage stays under 512MB
- AND all paths eventually generate

#### Scenario: Fallback for new draws not in build

- GIVEN a new draw published after the last build
- WHEN user accesses `/detalle/501` (not in static paths)
- THEN the page renders via fallback (on-demand rendering)
- AND `stale-while-revalidate: 60` header is set
- AND subsequent requests within 60s serve cached version
- AND background regeneration updates the cache

#### Scenario: Fallback returns 404 for invalid IDs

- GIVEN user accesses `/detalle/99999` (never existed)
- WHEN the fallback handler executes
- THEN a 404 response returns within 500ms
- AND no static file is created for the invalid ID

### Requirement: Vercel Deploy Hook Integration

The system SHALL integrate with Vercel Deploy Hooks to trigger incremental rebuilds when new draws are published.

#### Scenario: Deploy hook triggers rebuild

- GIVEN a new draw is published in the CMS/backend
- WHEN the deploy hook URL is called via POST
- THEN Vercel starts a new deployment
- AND the build includes the new draw in `getStaticPaths`
- AND the new draw detail page generates statically
- AND deployment completes within 2 minutes

#### Scenario: Deploy hook payload validation

- GIVEN a deploy hook call with payload
- WHEN the hook endpoint receives the request
- THEN the payload is validated (contains drawId, drawDate)
- AND invalid payloads return 400 with error details
- AND valid payloads trigger rebuild and return 202

#### Scenario: Idempotent rebuilds

- GIVEN multiple deploy hook calls for the same draw
- WHEN the hook processes duplicate calls
- THEN only one rebuild triggers
- AND subsequent calls return 200 with "already building" status

#### Scenario: Deploy hook authentication

- GIVEN the deploy hook endpoint
- WHEN called without valid secret token
- THEN the request is rejected with 401
- AND the secret is configurable via environment variable

### Requirement: ISR Configuration for Vercel

The system SHALL configure Vercel for Incremental Static Regeneration with appropriate cache headers.

#### Scenario: Static pages serve with long-term cache

- GIVEN a pre-generated draw detail page
- WHEN the page is requested
- THEN `Cache-Control: public, max-age=31536000, immutable` header is set
- AND the page serves from Vercel Edge Network

#### Scenario: Fallback pages serve with SWR cache

- GIVEN a fallback-rendered draw detail page
- WHEN the page is requested
- THEN `Cache-Control: public, max-age=0, stale-while-revalidate=60` header is set
- AND the page revalidates in background after 60 seconds

#### Scenario: Manual purge via Vercel API

- GIVEN a need to purge specific draw pages
- WHEN Vercel Purge API is called with paths
- THEN the specified pages are purged from edge cache
- AND next request triggers fresh generation

### Requirement: Sitemap Generation

The system SHALL generate a complete `sitemap.xml` at build time including all draw detail pages.

#### Scenario: Sitemap includes all public pages

- GIVEN the build completes
- WHEN `sitemap.xml` is generated
- THEN URLs for `/`, `/ultimo-sorteo`, `/historial`, `/busqueda` are included
- AND all draw detail pages `/detalle/[id]` are included
- AND `lastmod` reflects the draw date for detail pages
- AND `changefreq` is "weekly" for listing pages, "yearly" for detail pages

#### Scenario: Sitemap respects robots.txt

- GIVEN the project has a `robots.txt`
- WHEN sitemap generates
- THEN sitemap URL is referenced in robots.txt
- AND no private/admin paths are included

### Requirement: Build Performance Budgets

The system SHALL meet build performance targets for static generation.

#### Scenario: Build completes within time budget

- GIVEN 5000 historical draws
- WHEN full build executes on Vercel
- THEN `npm run build` completes within 5 minutes
- AND static generation for draw details completes within 3 minutes

#### Scenario: Build memory stays within limits

- GIVEN the build process
- WHEN generating 5000+ static pages
- THEN peak memory usage stays under 1GB
- AND no out-of-memory errors occur
