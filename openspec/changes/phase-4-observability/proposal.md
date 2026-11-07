# Proposal: Phase 4.2 Observabilidad

## Intent

Add production observability: error tracking (Sentry) with requestId correlation, privacy-friendly analytics (Plausible), Web Vitals monitoring, bundle analysis, and a health check UI page for admin operations.

## Scope

### In Scope
- Sentry integration via `@sentry/astro` with requestId correlation from existing API client
- Plausible analytics for key events: search, login, import
- Web Vitals collection via `web-vitals` library, sent to Sentry
- Bundle analysis via `rollup-plugin-visualizer`
- Admin health check page (`/admin/health`) using existing `healthCheck()` and `healthDbCheck()` API methods

### Out of Scope
- Custom dashboard / Grafana / Prometheus infrastructure
- Log aggregation (ELK, Loki)
- Distributed tracing beyond requestId correlation
- A/B testing or feature flags
- Real user monitoring (RUM) beyond Web Vitals

## Capabilities

### New Capabilities
- `error-tracking`: Sentry error capture with requestId correlation for end-to-end tracing
- `analytics`: Plausible event tracking for search, login, import actions
- `performance-monitoring`: Web Vitals (LCP, FID, CLS, TTFB, FCP) sent to Sentry
- `bundle-analysis`: Visual bundle size reports via rollup-plugin-visualizer
- `health-check-ui`: Admin page displaying API and DB health status

### Modified Capabilities
- `api-client`: Extend error handling to include Sentry context (requestId already present)
- `admin-layout`: Add health check navigation item to Sidebar

## Approach

1. **Sentry**: Install `@sentry/astro`, configure DSN via `VITE_SENTRY_DSN`, enable `requestId` tag from API client errors
2. **Plausible**: Add script tag in layout, create `trackEvent()` helper, instrument search, login, import
3. **Web Vitals**: Use `web-vitals` library `onCLS`, `onFID`, `onLCP`, `onTTFB`, `onFCP` callbacks → send to Sentry as measurements
4. **Bundle Analysis**: Add `rollup-plugin-visualizer` to Vite config, generate `stats.html` on build
5. **Health UI**: Create `/src/pages/admin/health.astro` with React island calling `healthCheck()` and `healthDbCheck()`, add to Sidebar nav

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `astro.config.mjs` | Modified | Add Sentry integration, rollup-plugin-visualizer |
| `src/lib/api/client.ts` | Modified | Pass requestId to Sentry scope on errors |
| `src/components/admin/Sidebar.tsx` | Modified | Add "Salud del sistema" nav item |
| `src/pages/admin/health.astro` | New | Health check UI page |
| `src/layouts/AdminLayout.astro` | Modified | Add Plausible script, Sentry init |
| `src/lib/analytics.ts` | New | Plausible event helper functions |
| `src/lib/sentry.ts` | New | Sentry config and Web Vitals integration |
| `package.json` | Modified | Add @sentry/astro, web-vitals, plausible-tracker, rollup-plugin-visualizer |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Sentry DSN not configured in production | Med | Fail gracefully; log warning instead of crashing |
| Plausible blocked by ad blockers | High | Accept data loss; events are non-critical |
| Web Vitals noise in dev | Low | Only send in production (`import.meta.env.PROD`) |
| Bundle analysis increases build time | Low | Run only on CI, not local dev |
| Health check exposes internal info | Low | Page only accessible to authenticated admins |

## Rollback Plan

1. Remove `@sentry/astro` integration from astro.config.mjs
2. Remove Plausible script from AdminLayout
3. Delete `src/pages/admin/health.astro`
4. Remove nav item from Sidebar
5. Remove new dependencies from package.json
6. Revert Vite config changes for visualizer

## Dependencies

- `@sentry/astro` ^9.x
- `web-vitals` ^4.x
- `plausible-tracker` ^0.3.x (or inline script)
- `rollup-plugin-visualizer` ^5.x

## Success Criteria

- [ ] Errors in production appear in Sentry with requestId tag
- [ ] Search, login, import events visible in Plausible dashboard
- [ ] Web Vitals (LCP, FID, CLS) reported to Sentry as measurements
- [ ] Bundle analysis report generated on CI build (`dist/stats.html`)
- [ ] `/admin/health` page shows API/DB status for authenticated admins
- [ ] Lighthouse CI performance score remains >= 0.99