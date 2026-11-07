# Design: Phase 4.2 Observabilidad

## Technical Approach

Implement production observability across five capabilities using the existing Astro 5 + React architecture. Sentry integrates via `@sentry/astro` for error tracking with requestId correlation from the API client. Plausible analytics loads only on admin pages via a lightweight script helper. Web Vitals collection uses `web-vitals` library callbacks reporting to Sentry measurements. Bundle analysis adds `rollup-plugin-visualizer` to Vite config gated by `VITE_BUNDLE_ANALYZE`. Health check UI creates a new `/admin/health` Astro page with a React island calling existing `healthCheck()` and `healthDbCheck()` API methods.

## Architecture Decisions

### Decision: Sentry Integration via @sentry/astro

**Choice**: Use official `@sentry/astro` integration (v9.x) instead of manual SDK initialization
**Alternatives considered**: Manual `@sentry/browser` init in layout; `@sentry/node` for SSR errors
**Rationale**: `@sentry/astro` handles both client and server errors automatically, injects Sentry into Astro's error boundaries, supports source map upload via `sentry-cli`, and provides `Sentry.setMeasurement()` for Web Vitals. Aligns with Astro 5 patterns.

### Decision: Plausible Script in AdminLayout Only

**Choice**: Inject Plausible script in `src/pages/admin/layout.astro` (not root Layout)
**Alternatives considered**: Global script in root Layout with conditional firing; `plausible-tracker` npm package
**Rationale**: Keeps public pages free of analytics scripts (privacy-friendly). AdminLayout already wraps all admin routes. Inline script avoids extra dependency; `plausible-tracker` adds bundle weight for simple `plausible()` calls.

### Decision: Web Vitals Reported to Sentry as Measurements

**Choice**: Use `web-vitals` library callbacks → `Sentry.setMeasurement()` on active transaction
**Alternatives considered**: Send to custom endpoint; use Sentry's automatic Web Vitals (limited to browser transactions)
**Rationale**: `web-vitals` library provides all 5 metrics (LCP, FID, CLS, TTFB, FCP) with ratings. Sentry measurements attach to page-load transactions for correlation with errors. Production-only via `import.meta.env.PROD` check.

### Decision: Bundle Analysis Gated by Environment Variable

**Choice**: `rollup-plugin-visualizer` only runs when `VITE_BUNDLE_ANALYZE=true`
**Alternatives considered**: Always run; separate `analyze` script command
**Rationale**: Keeps local dev builds fast. CI sets the variable. Generates both `stats.html` (visual) and `bundle-stats.json` (programmatic) for size regression detection.

### Decision: Health Check Page as Astro + React Island

**Choice**: `src/pages/admin/health.astro` with `<HealthDashboard client:visible />` React island
**Alternatives considered**: Pure Astro with server-side fetch; full React page
**Rationale**: Astro page handles auth middleware + layout. React island provides reactive auto-refresh (30s interval), manual refresh, loading states, and history without full-page reloads. Uses existing `healthCheck()` and `healthDbCheck()` from API client.

## Data Flow

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────┐
│  Browser    │────▶│  @sentry/astro   │────▶│   Sentry    │
│  (errors)   │     │  (auto-capture)  │     │   Cloud     │
└─────────────┘     └──────────────────┘     └─────────────┘
       │                    │
       │ requestId          │ requestId tag
       ▼                    ▼
┌─────────────┐     ┌──────────────────┐
│ ApiClient   │────▶│  Sentry Scope    │
│ (beforeError)            │  (tag + extra) │
└─────────────┘     └──────────────────┘

┌─────────────┐     ┌──────────────────┐     ┌─────────────┐
│  web-vitals │────▶│  Sentry.setMeas. │────▶│   Sentry    │
│  callbacks  │     │  (transaction)   │     │   Cloud     │
└─────────────┘     └──────────────────┘     └─────────────┘

┌─────────────┐     ┌──────────────────┐     ┌─────────────┐
│ Admin Page  │────▶│  Plausible       │────▶│  Plausible  │
│  (events)   │     │  trackEvent()    │     │  Endpoint   │
└─────────────┘     └──────────────────┘     └─────────────┘

┌─────────────┐     ┌──────────────────┐     ┌─────────────┐
│ /admin/health│    │  HealthDashboard │────▶│  ApiClient  │
│  (Astro)    │     │  (React island)  │     │  healthCheck│
└─────────────┘     └──────────────────┘     └─────────────┘
                           │                        │
                           └────── 30s interval ◀───┘
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `astro.config.mjs` | Modify | Add `@sentry/astro` integration, `rollup-plugin-visualizer` plugin gated by `VITE_BUNDLE_ANALYZE` |
| `package.json` | Modify | Add `@sentry/astro@^9.x`, `web-vitals@^4.x`, `rollup-plugin-visualizer@^5.x` dependencies |
| `src/lib/sentry.ts` | Create | Sentry initialization config, Web Vitals integration, `captureException` wrapper with requestId |
| `src/lib/analytics.ts` | Create | Plausible `trackEvent()` helper with graceful fallback, typed event constants |
| `src/pages/admin/layout.astro` | Modify | Add Plausible script tag (conditional on `VITE_PLAUSIBLE_DOMAIN`), ensure Sentry loads |
| `src/components/admin/Sidebar.tsx` | Modify | Add "Salud del sistema" nav item with `Activity` icon, conditional on auth |
| `src/pages/admin/health.astro` | Create | Admin health page with React island `<HealthDashboard client:visible />` |
| `src/components/admin/HealthDashboard.tsx` | Create | React component: API/DB status cards, auto-refresh (30s), manual refresh, history table |
| `src/lib/api/client.ts` | Modify | In `beforeError` hook: attach requestId + error details to Sentry scope before throwing |
| `src/middleware.ts` | Modify | Set Sentry `requestId` tag from incoming request header for SSR error correlation |

## Interfaces / Contracts

### Sentry Config (`src/lib/sentry.ts`)

```typescript
import * as Sentry from '@sentry/astro';

export function initSentry(): void {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
    enabled: import.meta.env.PROD && !!import.meta.env.VITE_SENTRY_DSN,
    tracesSampleRate: 1.0,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({ maskAllText: true }),
    ],
  });
}

export function initWebVitals(): void {
  if (!import.meta.env.PROD) return;
  // onCLS, onFID, onLCP, onTTFB, onFCP → Sentry.setMeasurement()
}
```

### Analytics Helper (`src/lib/analytics.ts`)

```typescript
export type EventName =
  | 'search_combination' | 'search_frequency'
  | 'admin_login' | 'admin_login_failed'
  | 'import_start' | 'import_commit' | 'import_error';

export function trackEvent(name: EventName, props?: Record<string, unknown>): void {
  if (typeof window !== 'undefined' && window.plausible) {
    window.plausible(name, { props });
  }
}
```

### Health Dashboard Props

```typescript
interface HealthDashboardProps {
  initialApiHealth?: schemas.HealthCheck;
  initialDbHealth?: schemas.HealthDb;
}
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | `trackEvent()` helper, Sentry scope attachment, Web Vitals callbacks | Vitest with mocked `window.plausible`, mocked Sentry |
| Unit | `HealthDashboard` component: status rendering, refresh logic, history | React Testing Library with MSW mocking `healthCheck`/`healthDbCheck` |
| Integration | Sentry initialization in Astro dev/prod, requestId propagation | Playwright: trigger API error → verify Sentry receives requestId |
| Integration | Plausible script loads only on admin pages | Playwright: check script presence on `/admin/*` vs `/buscar` |
| Integration | Bundle analysis generates `stats.html` and `bundle-stats.json` | CI build with `VITE_BUNDLE_ANALYZE=true` → assert artifacts exist |
| E2E | Health page: auth redirect, status display, auto-refresh, manual refresh | Playwright: login → `/admin/health` → verify UI updates |
| E2E | Search/Login/Import events fire Plausible | Playwright: perform actions → verify `plausible()` calls via page.evaluate |

## Migration / Rollout

No migration required. All changes are additive. Feature flags via environment variables:
- `VITE_SENTRY_DSN` — enables Sentry (production only)
- `VITE_PLAUSIBLE_DOMAIN` — enables Plausible (admin only)
- `VITE_BUNDLE_ANALYZE` — enables bundle report (CI only)

Rollout: Deploy to staging → verify Sentry events, Plausible dashboard, bundle artifacts → promote to production.

## Open Questions

- [ ] Sentry `tracesSampleRate: 1.0` may be high for production volume — confirm with team or adjust to 0.1
- [ ] Plausible domain configuration: single domain or subdomain per environment?
- [ ] Health check history: persist to localStorage or keep in-memory only? (Spec says "persists across refreshes" — localStorage recommended)
- [ ] Source map upload: need `SENTRY_AUTH_TOKEN` in CI — confirm secrets setup