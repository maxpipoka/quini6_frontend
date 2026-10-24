# Tasks: Phase 1 Foundation & Public Pages

**Change Name**: `phase1-foundation-public-pages`
**Total Files**: 63 new files
**Phases**: 7 implementation phases

---

## Phase 1: Foundation/Infrastructure (Days 1-3)

### 1.1 Project Scaffolding

- [ ] Initialize Astro 5 project with `npm create astro@latest` — configure for static output, TypeScript strict
- [ ] Create `package.json` with all dependencies:
  - **Core**: `astro@^5.0`, `typescript@^5.4`, `@astrojs/tailwind@^5.1`, `@astrojs/react@^3.5`, `@astrojs/sitemap@^3.1`
  - **UI**: `tailwindcss@^3.4`, `react@^18.3`, `react-dom@^18.3`
  - **Validation**: `zod@^3.22`
  - **Testing**: `vitest@^1.4`, `@vitest/coverage-v8@^1.4`, `@playwright/test@^1.43`, `@astrojs/test@^0.8`, `msw@^2.2`
  - **Storybook**: `@storybook/astro@^8.0`, `storybook@^8.0`, `@storybook/addon-a11y@^8.0`
  - **Lighthouse**: `@lhci/cli@^0.13`
  - **Utils**: `date-fns@^3.3`, `clsx@^2.1`
  - **Dev**: `eslint@^8.57`, `prettier@^3.2`, `husky@^9.0`, `lint-staged@^15.2`
- [ ] Create `astro.config.mjs`:
  - `output: 'static'`
  - Integrations: `tailwind()`, `react()`, `sitemap()`
  - TypeScript strict: `extends: 'astro/tsconfigs/strict'`
  - Path aliases: `@/*` → `src/*`, `@components/*` → `src/components/*`, `@lib/*` → `src/lib/*`
- [ ] Create `tailwind.config.mjs`:
  - `content` paths for Astro, React components
  - `theme.extend` mapping CSS custom properties (colors, spacing, typography, shadows, radius)
  - Custom utilities: `.container-page`, `.card-elevated`, `.text-gradient`
- [ ] Create `tsconfig.json` extending `astro/tsconfigs/strict` with path aliases
- [ ] Create `.eslintrc.cjs` with plugins: `astro`, `typescript-eslint`, `jsx-a11y`, `prettier`
- [ ] Create `.prettierrc` with single quotes, trailing commas, 100 char line width
- [ ] Create `husky/pre-commit` hook running `lint-staged`
- [ ] Create `lint-staged.config.js` for Astro, TS, JS, CSS, MD files
- [ ] Create `vercel.json`:
  - `buildCommand: "npm run build"`
  - `outputDirectory: "dist"`
  - `framework: "astro"`
  - Headers: static assets `Cache-Control: public, max-age=31536000, immutable`
  - Rewrites for SPA fallback
  - Deploy hook endpoint route

### 1.2 Design Tokens & Global Styles

- [ ] Create `src/styles/global.css` with CSS custom properties:
  - **Colors (OKLCH)**: Primary palette (500-900), Secondary, Accent, Neutral, Semantic (success, error, warning, info)
  - **Spacing**: `--space-1` (4px) through `--space-24` (96px) in 4px increments
  - **Typography**: Fluid `clamp()` scales for display, heading, body, caption; Inter font family
  - **Shadows**: `--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-xl`
  - **Border Radius**: `--radius-sm` (4px), `--radius-md` (8px), `--radius-lg` (12px), `--radius-full` (9999px)
  - **Breakpoints**: `--bp-sm` (640px), `--bp-md` (768px), `--bp-lg` (1024px), `--bp-xl` (1280px)
  - **Dark mode**: `@media (prefers-color-scheme: dark)` overrides + `[data-theme="dark"]` class overrides
- [ ] Create `src/styles/reset.css` with modern CSS reset (box-sizing, margin/padding normalization, focus-visible)

### 1.3 Environment & Type Declarations

- [ ] Create `src/env.d.ts` with `ImportMetaEnv` interface for `PUBLIC_API_BASE_URL`, `VERCEL_DEPLOY_HOOK_SECRET`, `PUBLIC_SITE_URL`
- [ ] Create `.env.example` with placeholder values
- [ ] Create `src/lib/utils/format.ts`: `formatCurrencyES()`, `formatDateES()`, `formatNumber()`
- [ ] Create `src/lib/utils/validation.ts`: `validateUniqueNumbers1to46()`, `validateDateRange()`, `validateDrawNumber()`
- [ ] Create `src/lib/utils/seo.ts`: `generatePageMeta()`, `generateDrawDetailMeta()`, `generateOGImageUrl()`

### 1.4 API Client & Schemas

- [ ] Create `src/lib/api/schemas.ts` with all Zod schemas (Draw, DrawSummary, PaginatedResponse, SearchResult, FrequencyResponse, HealthCheck)
- [ ] Create `src/lib/api/errors.ts` with typed error classes: `ApiValidationError`, `ApiNetworkError`, `ApiHttpError` — all including `requestId`
- [ ] Create `src/lib/api/client.ts`:
  - `createApiClient(config)` factory with baseUrl, default headers, interceptors
  - Automatic `X-Request-ID` (UUID v4) on all requests
  - Response validation via Zod schemas
  - Request body validation before send
  - Retry logic: 3 attempts, exponential backoff (100ms, 200ms, 400ms) + jitter for 5xx/network errors
  - Non-retryable: 400, 401, 403, 404
  - Typed methods: `getLatestDraw()`, `getDraw(id)`, `getDrawHistory(params)`, `searchExactCombination(numbers, dateRange)`, `getNumberFrequency(params)`, `healthCheck()`
- [ ] Create `src/lib/api/index.ts` barrel export

### 1.5 Mock Data for Development (Optional)

- [ ] Create `src/mock/draws.json` with 50 sample draws for local development and `getStaticPaths` testing

---

## Phase 2: Base UI Components (Days 3-5)

### 2.1 Atomic Components

- [ ] Create `src/components/ui/Button.astro` — variants: primary, secondary, ghost, danger; sizes: sm, md, lg; loading, disabled states; full TypeScript interface with JSDoc
- [ ] Create `src/components/ui/Input.astro` — types: text, email, number, password; label, error, helper text; validation states (aria-invalid); full TypeScript interface
- [ ] Create `src/components/ui/Select.astro` — native select with option groups, placeholder, error state; full TypeScript interface
- [ ] Create `src/components/ui/Spinner.astro` — sizes: sm, md, lg; variants: default, inline; full TypeScript interface

### 2.2 Composite Components

- [ ] Create `src/components/ui/Card.astro` — elevation variants (flat, elevated, outlined); slots for header, body, footer; full TypeScript interface
- [ ] Create `src/components/ui/Modal.astro` — portal-rendered (using `<Teleport>` or fixed positioning), focus trap, ESC to close, backdrop click, focus return to trigger; full TypeScript interface
- [ ] Create `src/components/ui/Toast.astro` — auto-dismiss (5s default), hover pauses, action button, variants: success, error, info, warning; full TypeScript interface
- [ ] Create `src/components/ui/Table.astro` — sortable columns, responsive horizontal scroll wrapper, sticky header, empty state, striped rows; full TypeScript interface
- [ ] Create `src/components/ui/Pagination.astro` — page numbers, prev/next, first/last, aria labels, URL sync; full TypeScript interface

---

## Phase 3: Specialized Components - React Islands (Days 5-7)

### 3.1 NumberInput (6-Number Combination)

- [ ] Create `src/components/specialized/NumberInput.tsx`:
  - Grid of 46 clickable numbers (1-46)
  - Select exactly 6 unique numbers — visual feedback on selection
  - Duplicate rejection with shake animation + toast
  - Out-of-range rejection (0, 47+) with validation message
  - Number removal via click on selected chip
  - "Selección aleatoria" button — generates 6 unique random numbers
  - Keyboard accessible: Tab navigation, Enter/Space select, Arrow keys navigate, visible focus rings
  - Props: `value: number[]`, `onChange: (numbers: number[]) => void`, `disabled?: boolean`, `error?: string`

### 3.2 DatePicker (Date Range)

- [ ] Create `src/components/specialized/DatePicker.tsx`:
  - Calendar view with month/year navigation
  - Range selection: start date + end date
  - Single date mode (start only → "from this date forward")
  - Preset buttons: "Último año", "Últimos 5 años", "Todo el historial"
  - Validation: start ≤ end, within min/max bounds
  - Keyboard navigation: arrows between days, Enter confirm, Escape close
  - Props: `value: { startDate?: Date; endDate?: Date }`, `onChange`, `minDate?`, `maxDate?`, `disabled?`

### 3.3 CombinationSearch (Orchestrator)

- [ ] Create `src/components/specialized/CombinationSearch.tsx`:
  - Composes NumberInput + DatePicker + Submit button
  - Loading state during search (spinner, disabled form)
  - Error handling with toast notifications
  - Calls `onSearch(combination, dateRange)` returning `Promise<SearchResult>`
  - Share button generating URL with search params
  - Props: `onSearch`, `initialCombination?`, `initialDateRange?`

---

## Phase 4: Layout Components (Days 7-8)

### 4.1 Main Layout

- [ ] Create `src/layouts/MainLayout.astro`:
  - Root HTML structure with `<head>` SEO meta tags (title, description, canonical, OG, Twitter)
  - Header: logo, navigation links (Inicio, Último Sorteo, Historial, Búsqueda)
  - Theme toggle button (persists to localStorage, respects prefers-color-scheme)
  - Footer: copyright, links, social icons
  - Slot for page content
  - Global Toast container (portal target)
  - Inline script for theme initialization (prevents flash)

### 4.2 Page Layout

- [ ] Create `src/layouts/PageLayout.astro`:
  - Container with max-width and responsive padding (uses `.container-page` utility)
  - Skip link for accessibility
  - Optional breadcrumbs slot
  - Consistent vertical rhythm between sections

---

## Phase 5: Page Implementation (Days 8-12)

### 5.1 Home Page (`src/pages/index.astro`)

- [ ] Hero section: headline, subheadline, CTA button → `/busqueda`
- [ ] Latest Draw Card: draw number, date, 6 NumberBalls + reintegro, jackpot amount, link to `/ultimo-sorteo`
- [ ] Quick Stats: total draws, total prizes awarded, biggest jackpot (from API/mock data)
- [ ] Navigation Cards: 3 cards linking to `/ultimo-sorteo`, `/historial`, `/busqueda`
- [ ] Responsive: mobile stacks vertically, touch targets ≥44px

### 5.2 Último Sorteo Page (`src/pages/ultimo-sorteo.astro`)

- [ ] Fetch latest draw via API client at build time (or mock)
- [ ] Display: draw number, date, 6 winning NumberBalls (lg), reintegro (accent variant)
- [ ] PrizeTable with all categories, winners, formatted amounts (ES locale)
- [ ] Jackpot highlight with prominent styling
- [ ] Empty state if no draws exist: friendly message + link to `/historial`
- [ ] SEO meta with draw-specific title/description

### 5.3 Historial Page (`src/pages/historial.astro`)

- [ ] Paginated list: 10 draws per page, reverse chronological
- [ ] Year filter dropdown (Select component) — updates URL with `?year=2024&page=1`
- [ ] Pagination component with URL sync
- [ ] Desktop: table view with draw number, date, 6 mini NumberBalls (sm)
- [ ] Mobile: card view per draw (DrawCard component)
- [ ] Each row/card links to `/detalle/[id]`

### 5.4 Detalle Sorteo Page (`src/pages/detalle/[id].astro`) — SSG

- [ ] Implement `getStaticPaths()` fetching all draw IDs from API/mock
- [ ] Generate static paths for all historical draws (batch if >1000)
- [ ] Fallback: `fallback: 'blocking'` for new draws not in build
- [ ] Page fetches full draw data (including frequency) via API client
- [ ] Compose DrawDetail component: winning numbers (prominent), PrizeTable, NumberFrequency, prev/next navigation
- [ ] Share button generating canonical URL
- [ ] 404 for invalid IDs not in fallback
- [ ] Dynamic SEO meta: title includes draw number/date, description includes winning numbers, og:image URL

### 5.5 Búsqueda Exacta Page (`src/pages/busqueda.astro`)

- [ ] Render CombinationSearch React island with `client:visible`
- [ ] Pass `onSearch` handler calling API client `searchExactCombination()`
- [ ] Display results: exact match with "¡Ganaste!" badge, partial matches grouped by category (5+1, 5, 4+1, 4, 3+1, 3, 2+1)
- [ ] "No matches" friendly state with suggestion
- [ ] Applied date filter display with "Limpiar filtro" link
- [ ] Share button with URL containing numbers + date range
- [ ] URL sync: search params in URL for shareability

### 5.6 404 Page (`src/pages/404.astro`)

- [ ] Friendly illustration/message ("Página no encontrada")
- [ ] Links to Home (`/`) and Búsqueda Exacta (`/busqueda`)
- [ ] Returns HTTP 404 status via `export const prerender = false` + `Astro.response.headers.set('status', '404')`

---

## Phase 6: Static Generation + Deploy Hook (Days 12-13)

### 6.1 getStaticPaths Optimization

- [ ] Implement batched `getStaticPaths` for 5000+ draws:
  - Fetch draw IDs in batches of 100
  - Return paths incrementally to control memory
  - Target: <512MB memory, <3 min for static generation
- [ ] Configure `fallback: 'blocking'` with `stale-while-revalidate: 60` header

### 6.2 Vercel Deploy Hook Endpoint

- [ ] Create `src/pages/api/deploy-hook.ts` (or Astro endpoint):
  - POST endpoint with secret token validation (`VERCEL_DEPLOY_HOOK_SECRET`)
  - Payload validation: requires `drawId`, `drawDate`
  - Idempotency: track processed drawIds in memory/Redis, return 200 "already building" for duplicates
  - Trigger Vercel rebuild via Deploy Hook URL (server-side fetch)
  - Return 202 Accepted on trigger, 400 on invalid payload, 401 on invalid secret

### 6.3 Sitemap & Robots

- [ ] Verify `@astrojs/sitemap` generates `sitemap.xml` with:
  - All public pages: `/`, `/ultimo-sorteo`, `/historial`, `/busqueda`
  - All draw detail pages: `/detalle/[id]`
  - `lastmod` = draw date for detail pages
  - `changefreq`: weekly (listing), yearly (detail)
- [ ] Create `public/robots.txt` referencing `sitemap.xml`, disallowing admin paths

### 6.4 ISR Cache Headers (vercel.json)

- [ ] Static pages: `Cache-Control: public, max-age=31536000, immutable`
- [ ] Fallback pages: `Cache-Control: public, max-age=0, stale-while-revalidate=60`

---

## Phase 7: Testing & Verification (Days 13-15)

### 7.1 Vitest Unit Tests

- [ ] Create `vitest.config.ts`:
  - `environment: 'jsdom'`
  - Coverage thresholds: statements 80%, branches 70%, functions 80%, lines 80%
  - Include: `src/**/*.test.ts`, `src/**/*.test.tsx`
  - Setup file for MSW, global test utils
- [ ] Test `src/lib/utils/format.test.ts`: currency, date, number formatting
- [ ] Test `src/lib/utils/validation.test.ts`: unique numbers, date ranges, draw numbers
- [ ] Test `src/lib/api/client.test.ts`: mock fetch with MSW, test retry, error correlation, validation
- [ ] Test `src/lib/api/schemas.test.ts`: Zod schema validation (valid/invalid)
- [ ] Test Astro components: render to string, verify props, slots, class composition
- [ ] Test React islands: NumberInput, DatePicker, CombinationSearch with React Testing Library

### 7.2 Playwright E2E Tests

- [ ] Create `playwright.config.ts`:
  - Projects: chromium, firefox, webkit, mobile-chrome (iPhone 14)
  - `baseURL: 'http://localhost:4321'`
  - Trace on failure, screenshot on failure
  - Visual regression: baseline screenshots in `tests/visual/baseline/`
- [ ] Test `tests/e2e/home.spec.ts`: loads, navigation to detail works
- [ ] Test `tests/e2e/ultimo-sorteo.spec.ts`: displays latest draw with numbers, prize table
- [ ] Test `tests/e2e/historial.spec.ts`: pagination works, year filter works, mobile card layout
- [ ] Test `tests/e2e/busqueda.spec.ts`: exact match found, partial matches display, no matches state, date filter, share URL
- [ ] Test `tests/e2e/detalle.spec.ts`: SSG page renders, fallback works, prev/next navigation
- [ ] Test `tests/e2e/404.spec.ts`: displays for invalid routes, returns 404 status
- [ ] Visual regression tests: all 6 pages desktop + mobile

### 7.3 Storybook Configuration

- [ ] Create `.storybook/main.ts`:
  - Framework: `@storybook/astro`
  - Stories: `src/**/*.stories.astro`, `src/**/*.stories.tsx`
  - Addons: `@storybook/addon-a11y`, `@storybook/addon-controls`
- [ ] Create `.storybook/preview.ts`:
  - Global decorators: MainLayout wrapper, ThemeProvider for dark mode
  - Global types for controls
  - a11y addon config
- [ ] Create stories for all 12 base UI components (Button, Input, Select, Modal, Toast, Spinner, Card, Table, Pagination + variants)
- [ ] Create stories for 3 React islands (NumberInput, DatePicker, CombinationSearch)
- [ ] Create stories for 5 draw components (NumberBall, DrawCard, PrizeTable, NumberFrequency, DrawDetail)
- [ ] Verify `npm run build-storybook` outputs to `storybook-static/`

### 7.4 Lighthouse CI

- [ ] Create `lighthouserc.json`:
  - CI budgets: Performance >90 (desktop), >85 (mobile); Accessibility >95; Best Practices >90; SEO >95
  - URLs to audit: all 6 public pages
  - Static collection from `dist/` after build
- [ ] Create `.github/workflows/lighthouse.yml`:
  - Runs on PRs to main
  - Fails check if budgets not met
  - Uploads report as artifact

### 7.5 CI/CD Pipeline

- [ ] Create `.github/workflows/ci.yml`:
  - Jobs: typecheck → lint → test (unit + coverage) → build → e2e (chromium) → lighthouse (on main PRs)
  - All must pass for merge
  - Artifacts: Playwright traces, Lighthouse reports, coverage reports on failure
- [ ] Verify `npm run build` completes without errors, outputs to `dist/`
- [ ] Verify `npm run dev` starts on localhost:4321 with HMR

---

## Review Workload Forecast

```
PHASE 1 - Foundation/Infrastructure
  Files: 15 (config, styles, API client, utils, env)
  Est. Lines: ~2,800
  Risk: LOW — Standard boilerplate, well-defined patterns

PHASE 2 - Base UI Components
  Files: 9 (Button, Input, Select, Spinner, Card, Modal, Toast, Table, Pagination)
  Est. Lines: ~2,200
  Risk: MEDIUM — Modal focus trap, Toast portal, Table a11y need careful review

PHASE 3 - Specialized React Islands
  Files: 3 (NumberInput, DatePicker, CombinationSearch)
  Est. Lines: ~1,800
  Risk: HIGH — Complex form state, keyboard a11y, validation logic, animations

PHASE 4 - Layout Components
  Files: 2 (MainLayout, PageLayout)
  Est. Lines: ~600
  Risk: LOW — Standard Astro layout patterns

PHASE 5 - Page Implementation
  Files: 6 (index, ultimo-sorteo, historial, detalle/[id], busqueda, 404)
  Est. Lines: ~2,400
  Risk: MEDIUM — SSG getStaticPaths, fallback, SEO meta, data fetching integration

PHASE 6 - Static Generation + Deploy Hook
  Files: 4 (getStaticPaths optimization, deploy-hook endpoint, sitemap, vercel headers)
  Est. Lines: ~800
  Risk: MEDIUM — Batched paths memory, deploy hook idempotency, cache headers

PHASE 7 - Testing & Verification
  Files: 14 (vitest, playwright, storybook, lighthouse, CI configs + test files)
  Est. Lines: ~3,500
  Risk: HIGH — E2E flakiness, visual regression baselines, Lighthouse budget tuning

TOTAL: 63 files, ~14,100 lines changed
```

### 400-Line Budget Risk Assessment

| Phase | Max Single File                  | Budget Risk | Mitigation                                       |
| ----- | -------------------------------- | ----------- | ------------------------------------------------ |
| 1     | ~400 (client.ts)                 | ✅ LOW      | Split into client.ts, schemas.ts, errors.ts      |
| 2     | ~350 (Table.astro)               | ✅ LOW      | Modular sub-components if needed                 |
| 3     | ~600 (NumberInput.tsx)           | ⚠️ MEDIUM   | Extract NumberGrid, SelectedChips sub-components |
| 4     | ~300 (MainLayout.astro)          | ✅ LOW      | —                                                |
| 5     | ~500 (detalle/[id].astro)        | ⚠️ MEDIUM   | Extract DrawDetail sub-component                 |
| 6     | ~300 (getStaticPaths)            | ✅ LOW      | —                                                |
| 7     | ~400 (playwright.config + tests) | ✅ LOW      | Separate test files per flow                     |

**Overall**: 2 files exceed 400 lines — manageable with sub-component extraction. No chained PRs required for code review.

### Chained PR Recommendation

```
PR 1 (Foundation): Phases 1-2 — Config, design tokens, API client, base UI (24 files, ~5k lines)
  → Can be reviewed independently, establishes all primitives

PR 2 (Interactive): Phase 3 — React islands (3 files, ~1.8k lines)
  → Isolated complex logic, dedicated review for a11y/keyboard

PR 3 (Pages): Phases 4-5 — Layouts + 6 public pages (8 files, ~3k lines)
  → Integration review, visual verification via Storybook/Playwright

PR 4 (SSG + Deploy): Phase 6 — getStaticPaths, deploy hook, sitemap (4 files, ~800 lines)
  → Infrastructure review, performance focus

PR 5 (Testing): Phase 7 — All test infrastructure (14 files, ~3.5k lines)
  → Can merge after PR 1-4 green; config-heavy, low logic risk
```

**Recommended**: 5 chained PRs (not single 14k-line PR). Each PR <400 lines average per file, focused review scope.

---

## Dependencies Between Phases

```
Phase 1 (Foundation) ──┬──→ Phase 2 (Base UI) ──┐
                       │                        ├──→ Phase 5 (Pages)
                       ├──→ Phase 3 (Islands) ──┘
                       │
                       └──→ Phase 4 (Layouts) ──┘
                                              │
Phase 6 (SSG/Deploy) ←───────────────────────┘ (needs pages + API client)
                                              │
Phase 7 (Testing) ←───────────────────────────┘ (needs all implementation complete)
```

---

## Acceptance Criteria (from Specs)

- [ ] `npm install && npm run build` succeeds, outputs to `dist/`
- [ ] `npm run dev` starts on localhost:4321 with HMR
- [ ] `npx tsc --noEmit` reports zero errors
- [ ] `npm run lint` reports zero errors/warnings
- [ ] `npm run format:check` passes
- [ ] Pre-commit hook blocks commits with lint errors
- [ ] All 6 public pages render matching Inicio A design (desktop + mobile)
- [ ] `getStaticPaths` generates all draw detail pages at build
- [ ] Fallback works for new draws with `stale-while-revalidate: 60`
- [ ] Vercel Deploy Hook triggers rebuild on valid payload
- [ ] NumberInput: 6 unique numbers 1-46, duplicate rejection, quick pick, keyboard accessible
- [ ] DatePicker: range selection, presets, keyboard navigation
- [ ] CombinationSearch: exact + partial matches, shareable URLs, date filter
- [ ] `npm run test` passes with coverage thresholds met
- [ ] `npm run test:e2e` passes on chromium, firefox, webkit, mobile
- [ ] `npm run build-storybook` succeeds with all component stories
- [ ] Lighthouse CI passes budgets on all pages (perf>90, a11y>95, bp>90, seo>95)
- [ ] CI pipeline passes: typecheck → lint → test → build → e2e → lighthouse

---

## Estimated Effort

| Phase | Duration | Parallelizable                                           |
| ----- | -------- | -------------------------------------------------------- |
| 1     | 3 days   | Config files parallel, API client sequential             |
| 2     | 2 days   | Components independent, can parallelize                  |
| 3     | 2 days   | NumberInput/DatePicker parallel, CombinationSearch after |
| 4     | 1 day    | Layouts sequential (PageLayout uses MainLayout)          |
| 5     | 4 days   | Pages independent after layouts done, can parallelize    |
| 6     | 1 day    | Sequential (depends on pages + API client)               |
| 7     | 2 days   | Test writing parallel, CI integration sequential         |

**Total**: ~15 working days (3 weeks) for single developer
**With 2 developers**: ~10 days (Phase 2/3/5 parallelizable)

---

## Notes for Implementer

1. **Start with Phase 1 completely** — all config, types, API client must work before components
2. **Use mock data** (`src/mock/draws.json`) for Phases 2-5 development; swap to real API in Phase 6
3. **Storybook as development tool** — build components in isolation first, then integrate into pages
4. **Test early** — write unit test for each utility/component as you create it
5. **Visual regression baselines** — capture after Phase 5 complete, before Phase 7
6. **Lighthouse budgets** — run locally with `npm run lighthouse` before pushing PRs
7. **Accessibility** — test with screen reader (NVDA/VoiceOver) on NumberInput, Modal, DatePicker
8. **Dark mode** — verify all components in both themes during Phase 2

---

## Open Questions to Resolve Before Starting

- [ ] **Design token extraction**: Confirm exact OKLCH values from Kombai Canvas Inicio A export
- [ ] **Draw data source for build**: Static JSON files vs Astro content collections vs API at build time
- [ ] **Vercel Deploy Hook payload format**: Confirm with backend team (drawId, drawDate, etc.)
- [ ] **Number frequency calculation**: Build-time from historical data or API endpoint?
- [ ] **Social card (og:image)**: Vercel OG Image API, Astro endpoint, or static per draw?
- [ ] **Accessibility target**: WCAG AA only or AAA for NumberBall color contrast?
- [ ] **Internationalization structure**: Plan for future i18n (routing, content)?
