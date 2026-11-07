# Phase 3: Integration — Health Check UI

- [x] 3.1 Modify `src/components/admin/Sidebar.tsx` — import `Activity` icon from lucide-react; add "Salud del sistema" nav item with href `/admin/health`, conditional render based on auth state
- [x] 3.2 Create `src/pages/admin/health.astro` — Astro page with auth protection (inherits admin layout), passes initial health data via props to React island
- [x] 3.3 Create `src/components/admin/HealthDashboard.tsx` — React component with: API/DB status cards (green/red), auto-refresh every 30s, manual refresh button, history table persisted in localStorage, loading/error states
- [x] 3.4 Wire health data fetching — in health.astro, call `healthCheck()` and `healthDbCheck()` from API client server-side for initial render; pass to HealthDashboard as `initialApiHealth`/`initialDbHealth` props

# Phase 4: Remaining Testing

- [x] 4.1 Unit: `src/lib/analytics.test.ts` — Vitest tests for `trackEvent()`: calls plausible when available, no-op when not, correct event names and props
- [x] 4.3 Unit: `src/lib/api/client.sentry.test.ts` — Vitest tests for `beforeError` hook: requestId tag set, extra context attached for each error type (Http, Network, Validation, Timeout)
- [x] 4.4 Unit: `src/components/admin/HealthDashboard.test.tsx` — React Testing Library + MSW: renders status cards, triggers refresh, updates history, persists to localStorage
- [x] 4.5 Integration: `tests/integration/sentry-init.spec.ts` — Playwright: dev/prod Sentry init, trigger API error → verify Sentry receives requestId tag (via MSW mock Sentry endpoint)
- [x] 4.6 Integration: `tests/integration/plausible-load.spec.ts` — Playwright: verify Plausible script present on `/admin/*`, absent on `/buscar`, `/sorteos`
- [x] 4.8 E2E: `tests/e2e/health-page.spec.ts` — Playwright: login → `/admin/health` → verify status cards, auto-refresh (wait 35s), manual refresh click, history table shows entries
- [x] 4.9 E2E: `tests/e2e/analytics-events.spec.ts` — Playwright: perform search → verify `plausible('search_combination')` called; login → verify `admin_login`; import flow → verify `import_start`/`import_commit`

# Phase 5: Cleanup & Documentation

- [ ] 5.1 Verify Lighthouse CI performance score >= 0.99 after changes
- [ ] 5.2 Update `.env.example` with `VITE_SENTRY_DSN`, `VITE_PLAUSIBLE_DOMAIN`, `VITE_BUNDLE_ANALYZE` variables
- [ ] 5.3 Verify rollback plan works: remove Sentry integration, Plausible script, health page, Sidebar item, dependencies, visualizer config