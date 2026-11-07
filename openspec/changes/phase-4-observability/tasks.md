# Tasks: Phase 4.2 Observabilidad

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 500-700 |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 1: Foundation + Sentry + Analytics → PR 2: Web Vitals + Bundle Analysis → PR 3: Health Check UI + Testing |
| Delivery strategy | ask-on-risk |
| Chain strategy | stacked-to-main |

Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: stacked-to-main
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Sentry error tracking + Plausible analytics + API client Sentry integration | PR 1 | Foundation: config, deps, sentry.ts, analytics.ts, client.ts, middleware.ts, admin layout script |
| 2 | Web Vitals + Bundle Analysis | PR 2 | Depends on PR 1 (Sentry init). Adds web-vitals integration, rollup-plugin-visualizer |
| 3 | Health Check UI + Full Testing Suite | PR 3 | Depends on PR 1 (admin layout). Creates health.astro, HealthDashboard.tsx, Sidebar nav, all tests |

---

## Phase 1: Foundation & Infrastructure

- [x] 1.1 Update `package.json` — add `@sentry/astro@^9.x`, `web-vitals@^4.x`, `rollup-plugin-visualizer@^5.x` to dependencies
- [x] 1.2 Update `astro.config.mjs` — add `@sentry/astro` integration with DSN from `VITE_SENTRY_DSN`, add `rollup-plugin-visualizer` gated by `VITE_BUNDLE_ANALYZE`
- [x] 1.3 Create `src/lib/sentry.ts` — implement `initSentry()` with browserTracingIntegration, replayIntegration, production-only enable; implement `initWebVitals()` with web-vitals callbacks → `Sentry.setMeasurement()`
- [x] 1.4 Create `src/lib/analytics.ts` — implement typed `EventName` union and `trackEvent(name, props?)` helper with `window.plausible` guard and graceful fallback
- [x] 1.5 Modify `src/middleware.ts` — set Sentry `requestId` tag from incoming request header (`x-request-id`) for SSR error correlation

---

## Phase 2: Core Implementation — Error Tracking & Analytics

- [x] 2.1 Modify `src/lib/api/client.ts` — in `beforeError` hook: attach `requestId` + error details to Sentry scope via `Sentry.setTag('requestId')` and `Sentry.setExtra()` before throwing; cover `ApiHttpError`, `ApiNetworkError`, `ApiValidationError`, `ApiTimeoutError`
- [x] 2.2 Modify `src/pages/admin/layout.astro` — add Plausible script tag conditional on `VITE_PLAUSIBLE_DOMAIN`; call `initSentry()` and `initWebVitals()` from sentry.ts in inline script
- [x] 2.3 Instrument Plausible events — add `trackEvent('search_combination')` in search form submit; `trackEvent('admin_login')`/`admin_login_failed` in login page; `trackEvent('import_start')`/`import_commit`/`import_error` in import wizard

---

## Phase 3: Integration — Health Check UI

- [ ] 3.1 Modify `src/components/admin/Sidebar.tsx` — import `Activity` icon from lucide-react; add "Salud del sistema" nav item with href `/admin/health`, conditional render based on auth state
- [ ] 3.2 Create `src/pages/admin/health.astro` — Astro page with auth protection (inherits admin layout), passes initial health data via props to React island
- [ ] 3.3 Create `src/components/admin/HealthDashboard.tsx` — React component with: API/DB status cards (green/red), auto-refresh every 30s, manual refresh button, history table persisted in localStorage, loading/error states
- [ ] 3.4 Wire health data fetching — in health.astro, call `healthCheck()` and `healthDbCheck()` from API client server-side for initial render; pass to HealthDashboard as `initialApiHealth`/`initialDbHealth` props

---

## Phase 4: Testing

- [ ] 4.1 Unit: `src/lib/analytics.test.ts` — Vitest tests for `trackEvent()`: calls plausible when available, no-op when not, correct event names and props
- [x] 4.2 Unit: `src/lib/sentry.test.ts` — Vitest tests for `initSentry()` config, `initWebVitals()` calls Sentry.setMeasurement for each metric (mock web-vitals callbacks)
- [ ] 4.3 Unit: `src/lib/api/client.sentry.test.ts` — Vitest tests for `beforeError` hook: requestId tag set, extra context attached for each error type (Http, Network, Validation, Timeout)
- [ ] 4.4 Unit: `src/components/admin/HealthDashboard.test.tsx` — React Testing Library + MSW: renders status cards, triggers refresh, updates history, persists to localStorage
- [ ] 4.5 Integration: `tests/integration/sentry-init.spec.ts` — Playwright: dev/prod Sentry init, trigger API error → verify Sentry receives requestId tag (via MSW mock Sentry endpoint)
- [ ] 4.6 Integration: `tests/integration/plausible-load.spec.ts` — Playwright: verify Plausible script present on `/admin/*`, absent on `/buscar`, `/sorteos`
- [x] 4.7 Integration: `tests/integration/bundle-analysis.spec.ts` — CI build with `VITE_BUNDLE_ANALYZE=true` → assert `dist/stats.html` and `dist/bundle-stats.json` exist
- [ ] 4.8 E2E: `tests/e2e/health-page.spec.ts` — Playwright: login → `/admin/health` → verify status cards, auto-refresh (wait 35s), manual refresh click, history table shows entries
- [ ] 4.9 E2E: `tests/e2e/analytics-events.spec.ts` — Playwright: perform search → verify `plausible('search_combination')` called; login → verify `admin_login`; import flow → verify `import_start`/`import_commit`

---

## Phase 5: Cleanup & Documentation

- [ ] 5.1 Verify Lighthouse CI performance score >= 0.99 after changes
- [ ] 5.2 Update `.env.example` with `VITE_SENTRY_DSN`, `VITE_PLAUSIBLE_DOMAIN`, `VITE_BUNDLE_ANALYZE` variables
- [ ] 5.3 Verify rollback plan works: remove Sentry integration, Plausible script, health page, Sidebar item, dependencies, visualizer config
