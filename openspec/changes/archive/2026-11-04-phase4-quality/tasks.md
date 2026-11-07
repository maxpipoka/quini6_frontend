# SDD Task Breakdown: phase4-quality

**Change**: Phase 4 Quality — Focus, PWA, SEO  
**Total Tasks**: 24  
**Estimated Effort**: ~16 tasks (S), ~6 tasks (M), ~2 tasks (L)  
**Critical Path**: Focus-trap utility → Header → ClientRouter → Navigation focus → PWA config → SEO fixes → Tests  
**Delivery Strategy**: CI-green incremental — deliver focus + Header first, then PWA, then SEO, then tests

---

## Task Groups

### Group A: Focus Management (Foundation)

#### A1. Create shared focus-trap utility
- **Title**: Extract focus-trap/restore logic from Modal into `src/lib/focus-trap.ts`
- **Affected Files**: `src/lib/focus-trap.ts` (new), `src/components/modal/Modal.astro` (read-only reference)
- **Acceptance Criteria**:
  - Exports `trapFocus(options)`, `restoreFocus(element)`, `getFocusableElements(container)` per design interfaces
  - `trapFocus` cycles Tab/Shift+Tab within container, calls `onEscape` on Escape key
  - `restoreFocus` focuses provided element or no-ops on null
  - Unit tests pass (see A5)
- **Size**: S
- **Dependencies**: None (unblocks A2)
- **Spec Link**: focus-management spec — "Mobile Menu Focus Trap and Restore" scenarios

#### A2. Wire focus-trap into Header mobile menu
- **Title**: Replace Header.astro inline menu script with shared focus-trap
- **Affected Files**: `src/components/layout/Header.astro`, `src/lib/focus-trap.ts` (import)
- **Acceptance Criteria**:
  - Mobile menu open → focus trapped inside menu (Tab cycles within)
  - Escape key → menu closes, focus returns to toggle button
  - Clicking toggle/close control → menu closes, focus stays on toggle button
  - No focus leaks to page content behind menu
- **Size**: M
- **Dependencies**: A1 (focus-trap utility)
- **Spec Link**: focus-management spec — "Focus is trapped while the menu is open", "Escape closes the menu and restores focus", "Closing via the toggle control does not lose focus"

#### A3. Audit and fix focus visibility styles
- **Title**: Ensure global CSS does not suppress focus indicators on any interactive element
- **Affected Files**: `src/styles/global.css`, any component-scoped styles
- **Acceptance Criteria**:
  - `:focus-visible` styles present for links, buttons, inputs
  - No `outline: none` or `outline: 0` without visible replacement
  - Lighthouse a11y ≥ 0.95 focus-related audits pass on 5 CI URLs
- **Size**: S
- **Dependencies**: None (can run in parallel with A1/A2)
- **Spec Link**: focus-management spec — "Keyboard focus is visible on all controls", "Style rules do not remove focus rings"

#### A4. Verify logical tab order (no positive tabindex)
- **Title**: Audit and fix tab order to match visual/reading order across public pages
- **Affected Files**: `src/layouts/Layout.astro`, `src/components/layout/Header.astro`, page components
- **Acceptance Criteria**:
  - Tab from top of page advances in DOM order matching visual order
  - No element receives focus out of sequence
  - No unintended keyboard traps (only intentional ones in open overlays)
  - No positive `tabindex` values in codebase
- **Size**: S
- **Dependencies**: A2 (Header menu must not create traps when closed)
- **Spec Link**: focus-management spec — "Tab order matches document order", "No unintended keyboard traps"

#### A5. Unit tests for focus-trap utility
- **Title**: Vitest unit tests for `focus-trap.ts` functions
- **Affected Files**: `tests/unit/focus-trap.test.ts` (new)
- **Acceptance Criteria**:
  - `trapFocus` cycles focus among focusable children
  - `trapFocus` calls `onEscape` handler on Escape key
  - `restoreFocus` focuses element when provided, no-ops on null
  - `getFocusableElements` returns correct interactive elements
- **Size**: S
- **Dependencies**: A1 (utility must exist)
- **Spec Link**: Testing Strategy — Unit layer for focus-trap.ts

---

### Group B: Client-Side Navigation Focus

#### B1. Add ClientRouter to Layout.astro
- **Title**: Insert `<ClientRouter />` in Layout.astro after `<slot />`
- **Affected Files**: `src/layouts/Layout.astro`
- **Acceptance Criteria**:
  - ClientRouter component rendered inside `<body>` after slot
  - Internal link clicks trigger client-side navigation (no full reload)
  - `astro:after-swap` event fires on navigation
- **Size**: S
- **Dependencies**: A2 (focus management should work before adding router)
- **Spec Link**: focus-management spec — "Client-Side Navigation Focus Move" scenarios

#### B2. Implement navigation focus move (sessionStorage-gated)
- **Title**: Add client script for `astro:after-swap` → focus main heading, gated by sessionStorage
- **Affected Files**: `src/layouts/Layout.astro` (script block)
- **Acceptance Criteria**:
  - First load (no sessionStorage flag) → no programmatic focus move
  - Subsequent ClientRouter navigations → focus moves to destination page's `h1` (or `main > h1`)
  - `sessionStorage.setItem('hasNavigated', 'true')` set after first navigation
  - Screen reader announces new page context (verified in E2E)
- **Size**: M
- **Dependencies**: B1 (ClientRouter must be present)
- **Spec Link**: focus-management spec — "Focus moves to the main heading after navigation", "Initial page load leaves focus untouched"

#### B3. E2E tests for focus management
- **Title**: Playwright e2e specs for focus visibility, menu trap, navigation focus move, tab order
- **Affected Files**: `tests/e2e/focus.spec.ts` (new)
- **Acceptance Criteria**:
  - Focus visible on all interactive elements (visual + keyboard)
  - Mobile menu: Tab cycles, Escape restores, close button retains focus
  - Navigation: focus moves to h1 on ClientRouter nav, not on first load
  - Tab order matches visual order, no positive tabindex
- **Size**: M
- **Dependencies**: A2, A3, A4, B2 (all focus behavior must be implemented)
- **Spec Link**: Testing Strategy — Integration + E2E rows for focus

---

### Group C: PWA (Service Worker + Offline)

#### C1. Add @vite-pwa/astro dependency
- **Title**: Install `@vite-pwa/astro` in package.json
- **Affected Files**: `package.json`
- **Acceptance Criteria**:
  - `@vite-pwa/astro` added as dependency (version compatible with Astro 5)
  - `npm install` succeeds
- **Size**: S
- **Dependencies**: None (unblocks C2)
- **Spec Link**: progressive-web-app spec — "Service Worker Generation" scenarios

#### C2. Configure Workbox in astro.config.mjs
- **Title**: Add @vite-pwa/astro integration with precache, runtime caching, navigateFallback, autoUpdate
- **Affected Files**: `astro.config.mjs`
- **Acceptance Criteria**:
  - Integration added with `generateSW` mode
  - `workbox.cleanupOutdatedCaches: true`
  - `workbox.navigateFallback: '/offline.html'`
  - Runtime caching: `/_astro/*` → CacheFirst (maxEntries: 50), images → CacheFirst (maxEntries: 100)
  - No rule for `/api/*` → NetworkOnly by default
  - `registerType: 'autoUpdate'`
  - `site` config uses `SITE_URL` from env/constant
  - Sitemap filter excludes `/admin` and `/test-fixtures`
- **Size**: M
- **Dependencies**: C1 (package installed), C6 (site.ts for SITE_URL constant)
- **Spec Link**: progressive-web-app spec — all scenarios; static-regeneration spec — sitemap filter

#### C3. Create offline fallback page
- **Title**: Add `public/offline.html` with message and home/retry link
- **Affected Files**: `public/offline.html` (new)
- **Acceptance Criteria**:
  - Page renders offline message
  - Link to home (`/`) works
  - No external dependencies (inline styles/scripts only)
  - Served for unvisited routes when offline
- **Size**: S
- **Dependencies**: None (can parallelize)
- **Spec Link**: progressive-web-app spec — "Unvisited page offline shows the fallback page"

#### C4. Update manifest.json with 512px icon
- **Title**: Ensure manifest has 512×512 PNG icon (generate from SVG) and installability fields
- **Affected Files**: `public/manifest.json`, `astro.config.mjs` (pwa.manifest config if auto-generating)
- **Acceptance Criteria**:
  - Manifest includes 512×512 icon (PNG)
  - `name`, `short_name`, `start_url`, `display`, `theme_color`, `background_color` present
  - Lighthouse installability checks pass
- **Size**: S
- **Dependencies**: C2 (PWA config may auto-generate icons)
- **Spec Link**: progressive-web-app spec — "Manifest passes installability checks"

#### C5. E2E tests for PWA
- **Title**: Playwright e2e specs for SW registration, offline behavior, installability
- **Affected Files**: `tests/e2e/pwa.spec.ts` (new)
- **Acceptance Criteria**:
  - SW registers, precache manifest includes build assets
  - Previously visited page loads offline (cached)
  - Unvisited page offline → offline.html fallback
  - `/api/*` requests bypass cache (online) and fail offline (no stale data)
  - Manifest passes installability (icons, fields)
- **Size**: M
- **Dependencies**: C2, C3, C4 (full PWA must work)
- **Spec Link**: Testing Strategy — Integration + E2E rows for PWA

---

### Group D: SEO (Site URL, OG, JSON-LD, Sitemap, Robots)

#### D1. Create single site URL constant
- [x] Complete
- **Title**: Add `src/config/site.ts` exporting `SITE_URL` and `SITE_NAME`
- **Affected Files**: `src/config/site.ts` (new)
- **Acceptance Criteria**:
  - `SITE_URL = import.meta.env.VITE_SITE_URL || 'https://quini6.com'`
  - `SITE_NAME = 'Quini 6 Estadísticas'`
  - Unit test verifies env var vs fallback resolution
- **Size**: S
- **Dependencies**: None (unblocks D2, D3, D4, D5, D6)
- **Spec Link**: public-pages spec — "Single Site URL Configuration" scenarios

#### D2. Update astro.config.mjs site config to use SITE_URL
- [x] Complete
- **Title**: Wire astro.config.mjs `site` to the same constant
- **Affected Files**: `astro.config.mjs`
- **Acceptance Criteria**:
  - `site: import.meta.env.VITE_SITE_URL || 'https://quini6.com'` (or import from site.ts if build-time)
  - Sitemap and canonical URLs derive from this value
- **Size**: S
- **Dependencies**: D1 (site.ts exists)
- **Spec Link**: public-pages spec — "One source of truth for the site URL"

#### D3. Update Layout.astro to import SITE_URL
- [x] Complete
- **Title**: Replace any hardcoded site URLs in Layout with import from `site.ts`
- **Affected Files**: `src/layouts/Layout.astro`
- **Acceptance Criteria**:
  - Canonical URL uses `SITE_URL`
  - `og:url` uses `SITE_URL`
  - JSON-LD references use `SITE_URL`
  - No hardcoded `https://quini6.com` in Layout
- **Size**: S
- **Dependencies**: D1
- **Spec Link**: public-pages spec — "One source of truth for the site URL"

#### D4. Add WebSite JSON-LD to Layout.astro
- [x] Complete
- **Title**: Emit `WebSite` structured data alongside existing `Organization`
- **Affected Files**: `src/layouts/Layout.astro`
- **Acceptance Criteria**:
  - Second `<script type="application/ld+json">` block with `@type: 'WebSite'`
  - Includes `url`, `name`, `potentialAction` (SearchAction with urlTemplate)
  - Existing `Organization` block preserved
  - Valid JSON-LD parsed by Google Rich Results Test
- **Size**: S
- **Dependencies**: D3 (SITE_URL available in Layout)
- **Spec Link**: public-pages spec — "WebSite JSON-LD present on public pages", "JSON-LD is valid"

#### D5. Create default OG image asset
- [x] Complete
- **Title**: Add `public/og-default.jpg` (1200×630) placeholder
- **Affected Files**: `public/og-default.jpg` (new)
- **Acceptance Criteria**:
  - 1200×630 pixels, reasonable file size (<200KB)
  - Serves at `/og-default.jpg` with HTTP 200
  - Declared in Layout meta with `og:image:width` and `og:image:height`
- **Size**: S
- **Dependencies**: None (can parallelize)
- **Spec Link**: public-pages spec — "og:image resolves with declared dimensions", "single default asset serves pages without a page-specific image"

#### D6. Fix detail page og:image fallback
- [x] Complete
- **Title**: Ensure draw detail pages fall back to og-default.jpg when per-draw image missing
- **Affected Files**: `src/layouts/Layout.astro` (ogImage prop handling), draw detail page components
- **Acceptance Criteria**:
  - Detail pages without specific og:image use `/og-default.jpg`
  - `og:image` returns 200 with dimensions declared
  - No 404 for `/og-draw-*.jpg` references
- **Size**: S
- **Dependencies**: D5 (default asset exists), D3 (SITE_URL for absolute URL)
- **Spec Link**: public-pages spec — "Draw detail has dynamic meta", "og:image resolves"

#### D7. Tighten sitemap filter
- [x] Complete
- **Title**: Update sitemap `filter` in astro.config.mjs to exclude `/admin` and `/test-fixtures`
- **Affected Files**: `astro.config.mjs`
- **Acceptance Criteria**:
  - Generated `sitemap.xml` includes `/`, `/ultimo-sorteo`, `/historial`, `/busqueda`, all `/detalle/[id]`
  - No URLs containing `/admin` or `/test-fixtures`
  - `lastmod` reflects draw date for detail pages
  - `changefreq` weekly for listings, yearly for details
- **Size**: S
- **Dependencies**: D2 (site config must be correct for sitemap URLs)
- **Spec Link**: static-regeneration spec — "Sitemap includes all public pages", "Sitemap excludes non-public routes"

#### D8. Create robots.txt endpoint with sitemap reference
- [x] Complete
- **Title**: Add build-time robots.txt generation (Astro endpoint) injecting SITE_URL
- **Affected Files**: `src/pages/robots.txt.ts` (new endpoint) or `scripts/inject-robots-url.mjs` (build script)
- **Acceptance Criteria**:
  - `robots.txt` served at `/robots.txt`
  - Contains `Sitemap: {SITE_URL}/sitemap.xml`
  - No private/admin paths allowed
  - Uses same `SITE_URL` constant
- **Size**: S
- **Dependencies**: D1, D7 (sitemap must generate correctly)
- **Spec Link**: static-regeneration spec — "Sitemap respects robots.txt"

#### D9. E2E tests for SEO
- [x] Complete
- **Title**: Playwright e2e specs for og:image, JSON-LD, sitemap, robots
- **Affected Files**: `tests/e2e/seo.spec.ts` (new)
- **Acceptance Criteria**:
  - Every page: og:image 200 + width/height declared
  - WebSite JSON-LD present and valid on all public pages
  - sitemap.xml excludes `/admin` and `/test-fixtures`, includes public + detail
  - robots.txt references sitemap URL
- **Size**: M
- **Dependencies**: D3, D4, D5, D6, D7, D8 (all SEO fixes implemented)
- **Spec Link**: Testing Strategy — E2E row for SEO tags

---

### Group E: Visual & Lighthouse Gates

#### E1. Visual focus indicator tests
- **Title**: Playwright visual regression for `:focus-visible` styles on all interactive elements
- **Affected Files**: `tests/visual/focus.spec.ts` (new)
- **Acceptance Criteria**:
  - Screenshots of focused states match baselines
  - Covers links, buttons, inputs, menu items
  - Runs in CI
- **Size**: S
- **Dependencies**: A3 (focus styles must be correct)
- **Spec Link**: Testing Strategy — Visual layer for focus indicators

#### E2. Lighthouse CI configuration
- **Title**: Add `lhci` config and CI step for a11y ≥ 0.95, SEO ≥ 0.95 on 5 URLs
- **Affected Files**: `lighthouserc.json` (new), CI workflow (e.g., `.github/workflows/lighthouse.yml`)
- **Acceptance Criteria**:
  - `lhci autorun` executes on 5 URLs (home, ultimo-sorteo, historial, busqueda, one detail)
  - a11y score ≥ 0.95, SEO score ≥ 0.95
  - Fails CI if thresholds not met
- **Size**: M
- **Dependencies**: A3, D4, D5, D6, D7 (all a11y/SEO fixes must be in place)
- **Spec Link**: Success Criteria — Lighthouse gates; Testing Strategy — Lighthouse CI gates

---

### Group F: Unit Tests (Supporting)

#### F1. Unit tests for site.ts
- [x] Complete
- **Title**: Vitest for `site.ts` constant resolution (env var vs fallback)
- **Affected Files**: `tests/unit/site.test.ts` (new)
- **Acceptance Criteria**:
  - `SITE_URL` reads `VITE_SITE_URL` when set
  - `SITE_URL` falls back to `'https://quini6.com'` when env not set
  - `SITE_NAME` is constant
- **Size**: S
- **Dependencies**: D1 (site.ts exists)
- **Spec Link**: Testing Strategy — Unit layer for site.ts

---

## Dependency Graph (Critical Path)

```
A1 (focus-trap util)
  └─→ A2 (Header menu) ──→ A4 (tab order) ──→ B1 (ClientRouter) ──→ B2 (nav focus) ──→ B3 (focus e2e)
        │
        └─→ A3 (focus styles) ──→ E1 (visual focus)

C1 (@vite-pwa/astro)
  └─→ C2 (Workbox config) ──→ C3 (offline.html) ──→ C4 (manifest) ──→ C5 (PWA e2e)
        │
        └─← D1 (site.ts) ──→ D2 (astro site) ──→ D3 (Layout SITE_URL) ──→ D4 (WebSite JSON-LD)
                                                           │
                                                           ├─→ D5 (og-default.jpg) ──→ D6 (detail fallback)
                                                           ├─→ D7 (sitemap filter)
                                                           └─→ D8 (robots.txt) ──→ D9 (SEO e2e)

F1 (site.ts unit) ← D1
A5 (focus-trap unit) ← A1
E2 (Lighthouse CI) ← A3, D4, D5, D6, D7
```

## Unblocking Notes

- **A1 unblocks A2, A5** — do first
- **D1 unblocks D2, D3, D4, D6, D7, D8, F1** — do early (parallel with A1)
- **C1 unblocks C2** — do early
- **B1 unblocks B2** — do after A2
- **C2, D2, D7 all modify astro.config.mjs** — coordinate to avoid conflicts
- **E2 (Lighthouse) is final gate** — runs after all fixes

---

## Open Questions to Resolve During Implementation

1. **ClientRouter + SW interaction**: If SW serves cached page and ClientRouter swaps, does `astro:after-swap` fire? Test offline→online navigation; fallback to `astro:page-load` if needed.
2. **512px icon**: Use `@vite-pwa/astro` `manifest.icons` auto-generation from SVG, or add PNG to repo?
3. **Detail og:image fallback**: Verify current `ogImage` prop usage on detail pages; ensure Layout falls back to default.
4. **robots.txt approach**: Use Astro endpoint `src/pages/robots.txt.ts` (preferred) vs build script.

---

## 400-Line Budget Forecast

| Area | Est. Lines | Notes |
|------|-----------|-------|
| Focus (A1-A5, B1-B3) | ~180 | New utility + Header + Layout scripts + 3 test files |
| PWA (C1-C5) | ~120 | Config + offline.html + manifest + test file |
| SEO (D1-D9) | ~150 | site.ts + Layout updates + assets + endpoint + test file |
| Visual/Lighthouse (E1-E2) | ~60 | Visual test + lhci config + CI workflow |
| **Total** | **~510** | **Exceeds 400-line budget** |

**Decision needed before apply**: Yes  
**Chained PRs recommended**: Yes  
**400-line budget risk**: High

### Recommended Chained PR Slices

| PR | Scope | Est. Lines | Rationale |
|----|-------|-----------|-----------|
| PR #1 | Focus foundation (A1, A2, A3, A4, A5, F1) | ~160 | Atomic, testable, unblocks navigation focus |
| PR #2 | ClientRouter + nav focus (B1, B2, B3) | ~100 | Depends on PR #1; delivers focus move |
| PR #3 | PWA (C1, C2, C3, C4, C5) | ~120 | Independent capability; separate testing |
| PR #4 | SEO (D1-D9) | ~150 | Touches Layout, config, assets; cohesive |
| PR #5 | Visual + Lighthouse (E1, E2) | ~60 | Final gates; depends on all above |

Each slice has clear start/finish, autonomous scope, verification (tests), and rollback (revert commit).

---

## Next Step

**Run `sdd-apply`** with delivery strategy `auto-chain` (or `chained` with explicit slices above) to implement tasks in PR order.

---

## Artifacts

- **Tasks file**: `openspec/changes/phase4-quality/tasks.md`
- **Engram**: `topic_key: sdd/phase4-quality/tasks`, type: `architecture`