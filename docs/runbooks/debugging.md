# Debugging Runbook

This runbook covers common debugging scenarios for the Quini6 Frontend.

## 🔍 Debugging Tools

### Browser DevTools

| Tool | Purpose |
| :--- | :------ |
| **Console** | JavaScript errors, logs, network requests |
| **Network** | API requests, timing, failed requests |
| **React DevTools** | Component tree, props, state, hooks |
| **Application** | localStorage, sessionStorage, cookies |
| **Performance** | Profiling, flame charts, memory |
| **Lighthouse** | Performance, accessibility, SEO audits |

### VS Code Debugging

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Debug Astro Dev",
      "url": "http://localhost:4321",
      "webRoot": "${workspaceFolder}/src",
      "sourceMaps": true
    },
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Vitest",
      "program": "${workspaceFolder}/node_modules/vitest/vitest.mjs",
      "args": ["run"],
      "console": "integratedTerminal"
    }
  ]
}
```

## 🐛 Common Issues & Solutions

### 1. Build Errors

#### TypeScript Errors

```bash
# Run typecheck for details
npm run typecheck

# Common fixes:
# - Add missing type imports
# - Fix strict null checks
# - Update @types packages
```

#### Astro Build Failures

```bash
# Check build output
npm run build 2>&1 | head -100

# Common issues:
# - Missing imports in .astro files
# - Invalid frontmatter
# - Image optimization failures (check public/ images)
```

### 2. Runtime Errors

#### Hydration Mismatches

**Symptoms**: Console warnings about hydration mismatch, UI flickering

**Causes**:
- Server/client render difference
- Random values (Date.now(), Math.random())
- Browser-only APIs in server code

**Fix**:
```astro
---
// Use client:only for browser-only components
---
<BrowserOnlyComponent client:only="react" />

<!-- Or move browser-only logic to onMount -->
<script>
  import { onMount } from 'svelte'; // or useEffect in React
  onMount(() => {
    // Browser-only code here
  });
</script>
```

#### Sentry Errors Not Appearing

**Checklist**:
- [ ] `VITE_SENTRY_DSN` set in environment
- [ ] Sentry initialized in `src/lib/sentry.ts`
- [ ] `beforeSend` filter not dropping events
- [ ] Network tab shows request to `sentry.io`

```typescript
// Debug Sentry init
import * as Sentry from '@sentry/astro';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  debug: true, // Enable debug logging
  beforeSend(event) {
    console.log('Sentry event:', event);
    return event;
  },
});
```

#### Plausible Analytics Not Tracking

**Checklist**:
- [ ] `VITE_PLAUSIBLE_DOMAIN` set
- [ ] Script loads on admin pages only
- [ ] No ad blockers interfering
- [ ] `plausible` function available on window

```typescript
// Debug Plausible
declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, any> }) => void;
  }
}

// In component
useEffect(() => {
  console.log('Plausible available:', !!window.plausible);
  window.plausible?.('test_event');
}, []);
```

### 3. API Integration Issues

#### Failed API Requests

```bash
# Check network tab for:
# - 401: Authentication issue (check token/session)
# - 403: Permission denied (check RBAC)
# - 404: Wrong endpoint (check VITE_API_BASE_URL)
# - 500: Backend error (check backend logs)
# - CORS: Check backend CORS config
```

#### MSW Not Mocking in Tests

```typescript
// vitest.setup.ts
import { setupServer } from 'msw/node';
import { handlers } from './mocks/handlers';

export const server = setupServer(...handlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### 4. Styling Issues

#### Tailwind Classes Not Applied

```bash
# Check:
# - Content paths in tailwind.config.mjs include all template files
# - Class names spelled correctly
# - No conflicting CSS specificity
# - Run: npx tailwindcss -i ./src/styles/global.css -o /dev/stdout --watch
```

#### Dark Mode Not Working

```astro
<!-- Ensure html has class="dark" or use media query -->
<html class="dark">
<!-- or -->
<script is:inline>
  if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  }
</script>
```

### 5. Performance Issues

#### Large Bundle Size

```bash
# Analyze bundle
npm run build
# Check dist/ stats or use:
npm run build && npx vite-bundle-analyzer dist/
```

**Common culprits**:
- Heavy libraries (moment.js → date-fns)
- Unused imports
- Missing code splitting

#### Slow Page Loads

```bash
# Run Lighthouse
npm run lighthouse

# Check:
# - Large images (optimize, use WebP/AVIF)
# - Blocking scripts (defer, async)
# - Unused CSS (purgecss)
# - Waterfall requests (bundle, prefetch)
```

## 🧪 Debugging Tests

### Vitest Debugging

```bash
# Run single test with debug
npm run test -- --reporter=verbose src/lib/api/client.test.ts

# Debug in VS Code: Use "Debug Vitest" launch config
```

### Playwright Debugging

```bash
# Debug mode (opens browser)
npm run test:e2e -- --debug

# Headed mode (visible browser)
npm run test:e2e -- --headed

# Trace viewer
npm run test:e2e -- --trace on
npx playwright show-trace trace.zip
```

### Visual Regression Debugging

```bash
# Update snapshots
npm run test:visual:update

# View diff
npx playwright show-report
```

## 📊 Logging & Observability

### Console Logging Standards

```typescript
// Use structured logging
console.log('[ComponentName] Action performed', { 
  userId, 
  timestamp: new Date().toISOString(),
  metadata 
});

// Error logging
console.error('[ComponentName] Error', error, { context });

// Performance marks
performance.mark('api-fetch-start');
const data = await fetchApi();
performance.mark('api-fetch-end');
performance.measure('api-fetch', 'api-fetch-start', 'api-fetch-end');
```

### Sentry Breadcrumbs

```typescript
// Add context before errors
Sentry.addBreadcrumb({
  category: 'user-action',
  message: 'User clicked import button',
  level: 'info',
  data: { fileName: 'data.xlsx' },
});
```

## 🔧 Environment-Specific Debugging

### Development

```bash
# Hot reload issues
# - Check file watchers (inotify limit on Linux)
# - Restart dev server: npm run dev

# Port conflicts
# - Default: 4321
# - Change: astro dev --port 3000
```

### Production

```bash
# Can't reproduce locally?
# - Check Sentry for exact error + context
# - Compare env variables (Vercel → Settings → Environment Variables)
# - Check build output differences (npm run build locally vs CI)
```

## 📝 Debugging Log Template

```
Date: YYYY-MM-DD HH:MM
Issue: [Brief description]
Environment: [local/dev/staging/prod]
Browser: [Chrome 120 / Firefox 119 / Safari 17]
Steps to Reproduce:
1. 
2. 
3. 
Expected: 
Actual: 
Console Errors: [paste relevant errors]
Network Failures: [failed requests]
Sentry Event: [link if available]
Root Cause: [found after investigation]
Fix: [what was changed]
Verification: [how verified fixed]
```

## 🔗 Related Runbooks

- [Deploy Runbook](./deploy.md)
- [Rollback Runbook](./rollback.md)
- [Monitoring Runbook](./monitoring.md)