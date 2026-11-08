# Rollback Plan: Phase 4.2 Observabilidad

This document describes how to rollback all observability changes introduced in Phase 4.2 if issues arise in production.

## Overview

Phase 4.2 added:
1. Sentry error tracking (@sentry/astro)
2. Plausible Analytics (plausible.io script)
3. Web Vitals monitoring
4. Bundle Analysis (rollup-plugin-visualizer)
5. Health Check UI (/admin/health)

## Rollback Steps

### 1. Remove Sentry Integration

**File: `astro.config.mjs`**
```diff
- import sentry from '@sentry/astro';
- 
- export default defineConfig({
-   integrations: [
-     sentry({
-       dsn: import.meta.env.VITE_SENTRY_DSN,
-       // ... sentry config
-     }),
-   ],
- });
```

**File: `src/lib/sentry.ts`** — Delete entirely

**File: `src/middleware.ts`** — Remove Sentry requestId tag logic
```diff
- import * as Sentry from '@sentry/astro';
- 
- export async function onRequest(context, next) {
-   const requestId = context.request.headers.get('x-request-id') || crypto.randomUUID();
-   Sentry.setTag('requestId', requestId);
-   return next();
- }
```

**File: `src/lib/api/client.ts`** — Remove `beforeError` hook Sentry integration
```diff
- import * as Sentry from '@sentry/astro';
- 
- beforeError: (error) => {
-   if (error.requestId) {
-     Sentry.setTag('requestId', error.requestId);
-   }
-   Sentry.setExtra('error', error);
-   throw error;
- }
```

**File: `src/pages/admin/layout.astro`** — Remove Sentry init script
```diff
- <script is:inline>
-   import { initSentry, initWebVitals } from '@lib/sentry';
-   if (import.meta.env.PROD) {
-     initSentry();
-     initWebVitals();
-   }
- </script>
```

### 2. Remove Plausible Analytics

**File: `src/pages/admin/layout.astro`** — Remove Plausible script tag
```diff
- const plausibleDomain = import.meta.env.VITE_PLAUSIBLE_DOMAIN ?? '';
- 
- <!-- Plausible Analytics Script -->
- {
-   plausibleDomain && (
-     <script
-       is:inline
-       set:html={`const script = document.createElement('script'); script.defer = true; script.dataset.domain = '${plausibleDomain}'; script.src = 'https://plausible.io/js/script.js'; document.head.appendChild(script);`}
-     />
-   )
- }
```

**File: `src/lib/analytics.ts`** — Delete entirely

**Files instrumenting Plausible events:**
- `src/pages/buscar.astro` — Remove `trackEvent('search_combination')`
- `src/pages/admin/login.astro` — Remove `trackEvent('admin_login')` / `admin_login_failed`
- `src/components/admin/ImportWizard.tsx` — Remove `trackEvent('import_start')` / `import_commit` / `import_error`

### 3. Remove Web Vitals

**File: `src/lib/sentry.ts`** — Already removed in step 1 (contained `initWebVitals`)

**File: `package.json`** — Remove dependency
```diff
- "web-vitals": "^4.x",
```

### 4. Remove Bundle Analysis

**File: `astro.config.mjs`** — Remove visualizer integration
```diff
- import { visualizer } from 'rollup-plugin-visualizer';
- 
- export default defineConfig({
-   vite: {
-     plugins: [
-       import.meta.env.VITE_BUNDLE_ANALYZE && visualizer({
-         open: false,
-         filename: 'stats.html',
-         gzipSize: true,
-         brotliSize: true,
-       }),
-     ],
-   },
- });
```

**File: `package.json`** — Remove dependency
```diff
- "rollup-plugin-visualizer": "^5.x",
```

**File: `tests/integration/bundle-analysis.spec.ts`** — Delete test file

### 5. Remove Health Check UI

**File: `src/components/admin/Sidebar.tsx`** — Remove "Salud del sistema" nav item
```diff
- import { Activity } from 'lucide-react';
- 
- <NavLink href="/admin/health" icon={<Activity />} />
```

**File: `src/pages/admin/health.astro`** — Delete entirely

**File: `src/components/admin/HealthDashboard.tsx`** — Delete entirely

**File: `src/lib/api/client.ts`** — Remove `healthCheck()` and `healthDbCheck()` functions (if not used elsewhere)

### 6. Remove Dependencies

**File: `package.json`** — Remove all observability dependencies
```diff
- "@sentry/astro": "^9.x",
- "web-vitals": "^4.x",
- "rollup-plugin-visualizer": "^5.x",
```

Run `npm install` to clean node_modules.

### 7. Environment Variables

**File: `.env.example`** — Keep variables (they're optional and commented), or remove if desired:
```diff
- # Optional: Sentry DSN for error tracking (production only)
- # VITE_SENTRY_DSN=https://your-key@sentry.io/your-project-id
-
- # Optional: Plausible Analytics domain (enables analytics on admin pages)
- # VITE_PLAUSIBLE_DOMAIN=quini6.example.com
-
- # Optional: Enable bundle analysis visualizer (generates stats.html and bundle-stats.json)
- # VITE_BUNDLE_ANALYZE=false
```

## Verification After Rollback

1. Run tests: `npm test` — all 538 tests should pass
2. Run lint: `npm run lint` — 0 errors
3. Run build: `npm run build` — completes successfully
4. Verify no Sentry/Plausible/health references remain in codebase:
   ```bash
   grep -r "sentry\|plausible\|healthCheck\|HealthDashboard" src/ --include="*.ts" --include="*.tsx" --include="*.astro"
   ```
   Should return no results (except test files which should also be cleaned)

## Rollback Testing

Test the rollback locally before applying to production:
1. Create a test branch
2. Apply all rollback steps above
3. Run full test suite
4. Build and verify no errors
5. Deploy to staging and verify functionality

## Emergency Rollback (Production)

If immediate rollback needed in production:
1. Revert the Phase 4.2 merge commit: `git revert <merge-commit-sha>`
2. Deploy the reverted version
3. Then apply the detailed rollback steps above to clean up codebase

## Files Modified Summary

| File | Action |
|------|--------|
| `astro.config.mjs` | Remove Sentry integration, visualizer plugin |
| `src/lib/sentry.ts` | Delete |
| `src/lib/analytics.ts` | Delete |
| `src/middleware.ts` | Remove Sentry requestId logic |
| `src/lib/api/client.ts` | Remove Sentry beforeError hook, healthCheck functions |
| `src/pages/admin/layout.astro` | Remove Plausible script, Sentry init script |
| `src/components/admin/Sidebar.tsx` | Remove health nav item |
| `src/pages/admin/health.astro` | Delete |
| `src/components/admin/HealthDashboard.tsx` | Delete |
| `src/pages/buscar.astro` | Remove Plausible trackEvent |
| `src/pages/admin/login.astro` | Remove Plausible trackEvent |
| `src/components/admin/ImportWizard.tsx` | Remove Plausible trackEvent |
| `package.json` | Remove @sentry/astro, web-vitals, rollup-plugin-visualizer |
| `tests/integration/bundle-analysis.spec.ts` | Delete |
| `.env.example` | Optional: remove commented observability vars |

## Time Estimate

- Code rollback: ~30 minutes
- Test & build verification: ~10 minutes
- Total: ~40 minutes