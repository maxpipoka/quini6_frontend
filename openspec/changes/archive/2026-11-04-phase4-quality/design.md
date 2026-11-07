# Design: Phase 4 Quality — Focus, PWA, SEO

## Technical Approach

Implement three capabilities (focus-management, progressive-web-app) and tighten two existing ones (public-pages SEO, static-regeneration sitemap) per the proposal and four delta specs. Reuse the existing Modal focus-trap/restore pattern in Header for the mobile menu. Adopt Astro `ClientRouter` for view transitions and move focus to the main heading on `astro:after-swap`, gated by `sessionStorage` so first load is untouched. Add `@vite-pwa/astro` (Workbox `generateSW`) with precache of build assets, runtime caching for `/_astro/` and images, `NetworkOnly` for `/api/*`, and `autoUpdate`. Ship a single `public/og-default.jpg` placeholder; add `WebSite` JSON-LD alongside existing `Organization`. Unify site URL to a single constant (`VITE_SITE_URL` / Astro `site`). Tighten sitemap `filter` to exclude `/admin` and `/test-fixtures`. All changes are static-output compatible; no API/data changes.

## Architecture Decisions

### Decision: Focus Trap Pattern Reuse

**Choice**: Extract the focus-trap/restore logic from `Modal.astro` into a shared utility (`src/lib/focus-trap.ts`) and consume it in `Header.astro` for the mobile menu.

**Alternatives considered**: 
- Duplicate the logic inline in Header (rejected: violates DRY, harder to maintain)
- Use a React island for the menu (rejected: adds unnecessary hydration; current vanilla script is sufficient)

**Rationale**: The Modal implementation is already WCAG-compliant (traps Tab/Shift+Tab, restores focus on close, handles Escape). Extracting it avoids duplication and ensures consistency. The utility will be framework-agnostic (vanilla TS) so both Astro scripts and React components can import it.

### Decision: ClientRouter Focus Move with sessionStorage Gate

**Choice**: Add `<ClientRouter />` in `Layout.astro` (inside `<body>`, after `<slot />`). In a client script, listen for `astro:after-swap`, check `sessionStorage.getItem('hasNavigated')`. If absent, set it and do nothing (first load). If present, find the destination page's `h1` (or `main > h1`) and `focus()` it.

**Alternatives considered**:
- Move focus on every navigation including first load (rejected: spec explicitly forbids)
- Use `astro:page-load` (rejected: fires on full reloads too; `astro:after-swap` is ClientRouter-specific)

**Rationale**: `astro:after-swap` fires only on ClientRouter navigations. The `sessionStorage` gate is simple, survives page refreshes within the session, and resets on new tab — matching the "first load untouched" requirement.

### Decision: PWA with @vite-pwa/astro generateSW

**Choice**: Add `@vite-pwa/astro` to `astro.config.mjs` integrations. Configure `workbox: { cleanupOutdatedCaches: true, navigateFallback: '/offline.html', runtimeCaching: [ { urlPattern: /^\/_astro\/.*/, handler: 'CacheFirst', options: { cacheName: 'astro-assets', expiration: { maxEntries: 50 } } }, { urlPattern: /\.(?:png|jpg|jpeg|svg|webp|avif)$/, handler: 'CacheFirst', options: { cacheName: 'images', expiration: { maxEntries: 100 } } } ], }`. Set `registerType: 'autoUpdate'`. Add `manifest.json` with 512px icon (generate from existing SVG).

**Alternatives considered**:
- `injectManifest` with custom SW (rejected: overkill; generateSW covers all requirements)
- `navigateFallbackAllowlist` to restrict offline pages (rejected: spec says "previously visited only" — `navigateFallback` with precache + runtime cache naturally achieves this)

**Rationale**: `generateSW` is zero-config for precaching build outputs. `navigateFallback: '/offline.html'` serves the fallback for unvisited routes. Runtime caching rules match spec: `/_astro/*` and images cached; `/api/*` excluded (no rule = NetworkOnly by default). `autoUpdate` activates new SW silently.

### Decision: Single Site URL Constant

**Choice**: Create `src/config/site.ts` exporting `SITE_URL = import.meta.env.VITE_SITE_URL || 'https://quini6.com'` and `SITE_NAME = 'Quini 6 Estadísticas'`. Update `astro.config.mjs` `site: import.meta.env.VITE_SITE_URL || 'https://quini6.com'`. Update `Layout.astro` to import from `site.ts`. Update `robots.txt` at build time via a small script or Astro integration to inject the same URL.

**Alternatives considered**:
- Keep `VITE_SITE_URL` in Layout and `site` in astro.config separately (rejected: spec requires single source of truth)
- Hardcode production domain (rejected: domain not chosen; placeholder must remain swappable)

**Rationale**: Single constant ensures canonical, `og:url`, JSON-LD, sitemap, and robots all derive from one value. Domain swap = one edit in `.env` (or the constant fallback).

### Decision: WebSite JSON-LD Alongside Organization

**Choice**: In `Layout.astro`, emit a second `<script type="application/ld+json">` block with `@type: 'WebSite'`, `url: SITE_URL`, `name: SITE_NAME`, `potentialAction: { @type: 'SearchAction', target: { @type: 'EntryPoint', urlTemplate: `${SITE_URL}/buscar?q={search_term_string}` }, query-input: 'required name=search_term_string' }`. Keep existing `Organization` block.

**Alternatives considered**: Merge into one graph (rejected: separate blocks are valid and clearer; Google recommends both).

**Rationale**: `WebSite` enables Sitelinks Search Box in SERPs. `Organization` provides brand info. Both are complementary.

### Decision: Sitemap Filter Exclusion

**Choice**: Update `astro.config.mjs` sitemap `filter` to `return !page.includes('/admin') && !page.includes('/test-fixtures');`. Keep existing `serialize` logic for `changefreq`/`lastmod`.

**Alternatives considered**: Filter by route pattern at dev time (rejected: build-time filter is simpler and guaranteed).

**Rationale**: Spec requires exclusion of `/admin` and `/test-fixtures` while preserving public and detail pages. The filter runs at build time on generated URLs.

## Data Flow

### Focus Move on Client Navigation

```
User clicks internal link
        │
        ▼
ClientRouter intercepts, fetches new page
        │
        ▼
astro:after-swap fires
        │
        ▼
sessionStorage.hasNavigated?
   ├─ No → set flag, do nothing (first load)
   └─ Yes → query destination h1 → .focus()
```

### Service Worker Lifecycle

```
Build (astro build)
        │
        ▼
@vite-pwa/astro generates sw.js + precache manifest
        │
        ▼
First visit: SW registers, precaches /_astro/*, HTML, manifest
        │
        ▼
User navigates → pages cached via navigateFallback + runtime rules
        │
        ▼
Offline request:
   ├─ Previously visited → serve from cache (CacheFirst)
   ├─ /_astro/* or image → serve from runtime cache
   ├─ /api/* → NetworkOnly (fail offline)
   └─ Unvisited page → serve /offline.html (navigateFallback)
        │
        ▼
New deploy → autoUpdate activates new SW on next visit
```

### Site URL Propagation

```
.env (VITE_SITE_URL) or fallback constant
        │
        ├──► astro.config.mjs → site config → sitemap.xml, robots.txt
        ├──► src/config/site.ts → SITE_URL
        │         ├──► Layout.astro → canonical, og:url, JSON-LD
        │         └──► Components/pages → absolute URL construction
        └──► public/robots.txt (build-time injection) → Sitemap: {SITE_URL}/sitemap.xml
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/lib/focus-trap.ts` | Create | Vanilla TS utility: `trapFocus(container, onEscape?)`, `restoreFocus(prevElement)`, `getFocusableElements(container)` — extracted from `Modal.astro` |
| `src/components/layout/Header.astro` | Modify | Import `trapFocus`, `restoreFocus`; replace inline menu script with focus trap + Escape close + focus restore to toggle button |
| `src/layouts/Layout.astro` | Modify | Import `SITE_URL` from `site.ts`; add `<ClientRouter />` after `<slot />`; add `WebSite` JSON-LD block; add client script for `astro:after-swap` focus move (sessionStorage-gated) |
| `src/config/site.ts` | Create | Single source of truth: `export const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://quini6.com'`, `export const SITE_NAME = 'Quini 6 Estadísticas'` |
| `astro.config.mjs` | Modify | Add `@vite-pwa/astro` integration with Workbox config; update `site` to use `SITE_URL`; tighten sitemap `filter` |
| `package.json` | Modify | Add `@vite-pwa/astro` dependency |
| `public/og-default.jpg` | Create | Placeholder 1200×630 OG image (single static asset) |
| `public/offline.html` | Create | Offline fallback page with message + link to home |
| `public/manifest.json` | Modify | Add 512px icon entry (generate from SVG); ensure installability fields |
| `tests/e2e/focus.spec.ts` | Create | Focus visibility, menu trap/Escape/restore, navigation focus move, tab order |
| `tests/e2e/pwa.spec.ts` | Create | SW registration, offline fallback for visited/unvisited, /api/* NetworkOnly, installability |
| `tests/e2e/seo.spec.ts` | Create | og:image resolves + dimensions, WebSite JSON-LD present, sitemap excludes /admin & /test-fixtures, robots references sitemap |
| `scripts/inject-robots-url.mjs` | Create | Build-time script to inject `SITE_URL` into `public/robots.txt` Sitemap line |

## Interfaces / Contracts

```ts
// src/lib/focus-trap.ts
export interface FocusTrapOptions {
  container: HTMLElement;
  onEscape?: () => void;
  onClose?: () => void;
}

export function trapFocus(options: FocusTrapOptions): () => void;
export function restoreFocus(element: HTMLElement | null): void;
export function getFocusableElements(container: HTMLElement): HTMLElement[];
```

```ts
// src/config/site.ts
export const SITE_URL: string;
export const SITE_NAME: string;
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|--------------|----------|
| Unit | `focus-trap.ts` functions | Vitest: trap cycles, restore, escape handler |
| Unit | `site.ts` constant resolution | Vitest: env var vs fallback |
| Integration | `Header.astro` menu focus trap | Playwright: open menu, Tab cycles, Escape restores, close button retains focus |
| Integration | `Layout.astro` navigation focus | Playwright: ClientRouter nav → focus on h1; first load no move |
| Integration | PWA SW registration | Playwright: `navigator.serviceWorker.ready`, precache manifest includes assets |
| E2E | Offline behavior | Playwright: visit page → go offline → revisit (cached); request unvisited (fallback); request /api/* (fails) |
| E2E | SEO tags | Playwright: og:image 200 + width/height; WebSite JSON-LD parsed; sitemap.xml excludes /admin, /test-fixtures; robots.txt references sitemap |
| Visual | Focus indicators | Playwright visual: `:focus-visible` styles on all interactive elements |
| Lighthouse | CI gates | `lhci autorun`: a11y ≥ 0.95, SEO ≥ 0.95 on 5 URLs |

## Migration / Rollout

No migration required. All changes are additive or config-only. SW self-heals via `autoUpdate`. Rollback = revert commits (remove PWA integration, offline page, focus scripts, ClientRouter).

## Open Questions

- [ ] **ClientRouter + @vite-pwa/astro interaction risk**: `astro:after-swap` fires on client navigation. If SW serves a cached page *and* ClientRouter swaps, does `astro:after-swap` still fire? Need to verify in implementation. Mitigation: test offline-then-online navigation; if `astro:after-swap` doesn't fire on SW-served pages, focus move may not trigger — may need `astro:page-load` fallback for non-ClientRouter loads.
- [ ] **512px icon generation**: Current manifest only has SVG. Need to generate PNG 512×512 at build or add to repo. Can use `@vite-pwa/astro` `manifest.icons` config to auto-generate from SVG.
- [ ] **Draw detail og:image**: Spec says default asset until per-draw cards ship. Detail pages currently reference `/og-draw-*.jpg` which 404. Design must ensure they fall back to `/og-default.jpg` in Layout. Need to verify current `ogImage` prop usage on detail pages.
- [ ] **robots.txt build injection**: Astro doesn't process `public/` files. Options: (a) move to `src/pages/robots.txt.ts` endpoint, (b) build script. (a) is more idiomatic Astro; will design for that.

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| ClientRouter + SW navigation event mismatch | Medium | E2E test covering offline→online navigation; fallback to `astro:page-load` if needed |
| Focus move disrupts AT on dynamic content | Low | sessionStorage gate + test with screen reader |
| Sitemap filter over-excludes | Low | E2E asserts exact URL list |
| og-default.jpg missing dimensions | Low | Generate 1200×630; declare in Layout meta |

---

**Design artifact written to**: `openspec/changes/phase4-quality/design.md`  
**Engram persistence**: `topic_key: sdd/phase4-quality/design`, `type: architecture`, `capture_prompt: false`