# Proposal: Phase 4 Quality — Focus, PWA, SEO

## Intent

FASE 4.1 "Calidad": runtime keyboard/focus (WCAG AA), PWA (SW + offline), SEO correctness (OG images, sitemap hygiene). Complements `phase4-visual-a11y` (runtime only).

## Scope

### In Scope
- **Focus**: audit focus visibility (styles exist; fix overrides); trap/Escape/restore for Header mobile menu (bare `hidden` toggle); focus move to main heading on client-side navigation (ClientRouter adopted); tab-order checks.
- **PWA** via `@vite-pwa/astro` (Workbox): SW, offline fallback (visited pages), precache of build assets, runtime caching for `/_astro/`+images; `/api/*` never cached; `autoUpdate`.
- **SEO**: og:image must resolve (add `public/og-default.jpg`; detail pages reference missing `/og-draw-*.jpg`), dimensions, `WebSite` JSON-LD, unify `site` vs `VITE_SITE_URL`, restrict sitemap (filter leaks `/admin`), robots → sitemap.

### Out of Scope
- **i18n / react-i18next** — rejected: es-AR-only niche; lottery only playable in Argentina.
- Visual regression + axe audit infra (in `phase4-visual-a11y`); per-draw OG card generation (deferred to build-time phase; static default ships).
- **Production domain selection** — domain not yet chosen; ship with current placeholder `site` URL in one constant, swap when domain is defined.

## Capabilities

### New Capabilities
- `focus-management`: focus visibility, trap/restore in drawers/dialogs, route-change focus move, tab order (WCAG 2.2 AA).
- `progressive-web-app`: SW generation, offline fallback, no-API caching rules, installability.

### Modified Capabilities
- `public-pages`: "SEO Meta Tags and Open Graph" — og:image MUST resolve with dimensions; WebSite structured data.
- `static-regeneration`: "Sitemap Generation" — exclude `/admin`, `/test-fixtures`; keep public + detail coverage.

## Approach
- **Focus**: reuse trap/restore from `Modal.astro`/`Modal.tsx` in `Header.astro`; adopt Astro `ClientRouter` and move focus to main heading on `astro:after-swap`, gated by sessionStorage (first load untouched).
- **PWA**: add `@vite-pwa/astro` (peer `astro ^5.0.0`, verified) to `astro.config.mjs`; generateSW; offline page navigation fallback; NetworkOnly `/api/*`.
- **SEO**: default OG asset + dimensions; `WebSite` JSON-LD beside `Organization`; tighten sitemap `filter`.

## Affected Areas

| Area | Impact |
|------|--------|
| `Header.astro`, `global.css` | Modified — focus trap/audit |
| `Layout.astro` | Modified — ClientRouter, focus, OG, JSON-LD |
| `astro.config.mjs`, `package.json` | Modified — PWA, sitemap filter |
| `public/og-default.jpg`, offline page | New |
| `tests/e2e/` | New — focus, offline specs |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Stale SW after deploy | Med | autoUpdate; e2e update check |
| Focus move disrupts AT | Low | sessionStorage gate |
| Sitemap filter regressions | Low | e2e asserts URLs |

## Rollback Plan
Revert commits: remove PWA integration, offline page, focus scripts. No data/API changes; SW self-heals via autoUpdate.

## Dependencies
- `@vite-pwa/astro` (Astro 5 compatible, verified); production `site` URL TBD (domain under evaluation — placeholder until defined); existing Playwright infra.

## Success Criteria
- [ ] Lighthouse a11y ≥ 0.95 on 5 CI URLs; menu traps, Escape, focus restore
- [ ] Focus moves to main heading on navigation, not first load
- [ ] Offline fallback serves visited page; `/api/*` never cached
- [ ] og:image 200; sitemap excludes `/admin`+`/test-fixtures`
- [ ] Lighthouse SEO ≥ 0.95; lint/typecheck/e2e pass
