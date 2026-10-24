# Design: Phase 1 Foundation & Public Pages

## Technical Approach

Build a complete Astro 5 + Tailwind CSS v4 static site with React islands for interactive components. The project uses CSS custom properties for design tokens extracted from Kombai Canvas "Inicio A", enabling theming and dark mode. Pages are implemented as Astro components with `getStaticPaths` for draw detail SSG. Vercel Deploy Hooks trigger incremental rebuilds when new draws are published. Interactive components (NumberInput, DatePicker, search) are React islands using `client:visible` hydration.

## Architecture Decisions

### Decision: Astro 5 with Static Output

**Choice**: Astro 5 configured for static site generation (`output: 'static'`)
**Alternatives considered**: Next.js (SSR/ISR), Remix, VitePress
**Rationale**: Zero-JS default for content-heavy pages; built-in `getStaticPaths` for SSG; excellent performance; simpler mental model for static lottery data

### Decision: Tailwind CSS v4 with CSS Custom Properties

**Choice**: Tailwind v4 JIT with design tokens as CSS custom properties in `global.css`
**Alternatives considered**: Plain CSS Modules, Styled Components, UnoCSS
**Rationale**: Design token system from Inicio A maps 1:1 to CSS custom properties; Tailwind utilities reference tokens; changing tokens updates entire design system; OKLCH color format for wide-gamut support

### Decision: React Islands for Interactive Components

**Choice**: NumberInput, DatePicker, and search functionality as React components with `client:visible`
**Alternatives considered**: Full React app, Preact islands, vanilla JS, Alpine.js
**Rationale**: Only 3 components need interactivity; Astro's island architecture ships zero JS for static pages; React ecosystem for complex form state (6-number selection, date ranges)

### Decision: Vercel Deploy Hook for Incremental Regeneration

**Choice**: Vercel Deploy Hook endpoint triggers rebuild on new draw publication
**Alternatives considered**: ISR with `revalidate`, cron jobs, manual rebuilds
**Rationale**: Draws published infrequently (2x/week); Deploy Hook gives instant static generation; no stale data; idempotent payload validation prevents duplicate builds

### Decision: API Client with Zod Validation

**Choice**: Typed API client factory with Zod schemas for request/response validation
**Alternatives considered**: Raw fetch, TanStack Query, SWR, Axios
**Rationale**: Compile-time TypeScript types + runtime validation; `requestId` correlation for debugging; exponential backoff retry logic; ready for Phase 3 backend integration

### Decision: Vitest + Playwright + Storybook Testing Stack

**Choice**: Vitest (unit), Playwright (E2E), Storybook (component docs), Lighthouse CI (performance)
**Alternatives considered**: Jest, Cypress, Chromatic only
**Rationale**: Vitest native ESM + Astro integration; Playwright cross-browser + device emulation; Storybook for design system documentation; Lighthouse CI enforces performance budgets in CI

## Data Flow

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Backend   │────▶│   API Client     │────▶│  getStaticPaths │
│   API       │     │  (Zod validated) │     │  (build time)   │
└─────────────┘     └──────────────────┘     └────────┬────────┘
                                                      │
                                                      ▼
┌─────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Browser   │◀───│  Static HTML     │◀───│  Astro Pages    │
│  Request    │     │  (Vercel Edge)   │     │  (SSG + fallback)│
└─────────────┘     └──────────────────┘     └─────────────────┘
                          │
                          ▼
                   ┌──────────────────┐
                   │  React Islands   │
                   │ (NumberInput,    │
                   │  DatePicker,     │
                   │  Search)         │
                   └──────────────────┘
```

**Build-time flow**: API Client → `getStaticPaths` fetches all draw IDs → generates static paths → each `/detalle/[id]` page fetches full draw data → renders to static HTML

**Runtime flow**: Browser requests static page → Vercel Edge serves cached HTML → React islands hydrate for interactive components → Search executes client-side via API Client → Results update without navigation

## File Changes

| File                                               | Action | Description                                                                                   |
| -------------------------------------------------- | ------ | --------------------------------------------------------------------------------------------- |
| `astro.config.mjs`                                 | Create | Astro config: static output, integrations (Tailwind, React, sitemap), TypeScript strict       |
| `tailwind.config.mjs`                              | Create | Tailwind v4 config extending theme with design tokens from CSS custom properties              |
| `vercel.json`                                      | Create | Vercel config: static output, headers, rewrites, deploy hook endpoint                         |
| `package.json`                                     | Create | Dependencies: astro, tailwindcss, @astrojs/react, react, zod, vitest, playwright, storybook   |
| `tsconfig.json`                                    | Create | TypeScript strict mode, path aliases, Astro types                                             |
| `.eslintrc.cjs`                                    | Create | ESLint config with astro, typescript, jsx-a11y plugins                                        |
| `.prettierrc`                                      | Create | Prettier config for consistent formatting                                                     |
| `husky/pre-commit`                                 | Create | Husky pre-commit hook running lint-staged                                                     |
| `src/styles/global.css`                            | Create | CSS custom properties for all design tokens (colors, spacing, typography, shadows, radius)    |
| `src/styles/reset.css`                             | Create | CSS reset and base styles                                                                     |
| `src/layouts/MainLayout.astro`                     | Create | Root layout with header, footer, SEO meta, theme toggle script                                |
| `src/layouts/PageLayout.astro`                     | Create | Page wrapper with container, breadcrumbs, skip link                                           |
| `src/pages/index.astro`                            | Create | Home page: hero, latest draw card, quick stats, navigation cards                              |
| `src/pages/ultimo-sorteo.astro`                    | Create | Latest draw page with winning numbers, prize table, jackpot                                   |
| `src/pages/historial.astro`                        | Create | Paginated, filterable history list with year filter                                           |
| `src/pages/detalle/[id].astro`                     | Create | SSG draw detail page with getStaticPaths, fallback, prize table, frequency                    |
| `src/pages/busqueda.astro`                         | Create | Exact search page with NumberInput, DatePicker, results display                               |
| `src/pages/404.astro`                              | Create | Friendly 404 page with search/home links                                                      |
| `src/components/ui/Button.astro`                   | Create | Button component (variants: primary, secondary, ghost, danger; sizes: sm, md, lg)             |
| `src/components/ui/Card.astro`                     | Create | Card component with elevation variants                                                        |
| `src/components/ui/Input.astro`                    | Create | Input with label, error, helper text, validation states                                       |
| `src/components/ui/Select.astro`                   | Create | Native select with option groups, placeholder, error                                          |
| `src/components/ui/Modal.astro`                    | Create | Portal-rendered modal with focus trap, ESC/backdrop close                                     |
| `src/components/ui/Toast.astro`                    | Create | Toast with auto-dismiss, action button, variants                                              |
| `src/components/ui/Spinner.astro`                  | Create | Spinner (sizes: sm, md, lg; variants: default, inline)                                        |
| `src/components/ui/Table.astro`                    | Create | Responsive table with sortable columns, horizontal scroll, empty state                        |
| `src/components/ui/Pagination.astro`               | Create | Pagination with page numbers, prev/next, first/last, aria labels                              |
| `src/components/specialized/NumberInput.tsx`       | Create | React island: 6-number selection (1-46), duplicate rejection, quick pick, keyboard accessible |
| `src/components/specialized/DatePicker.tsx`        | Create | React island: date range picker, presets, keyboard navigation                                 |
| `src/components/specialized/CombinationSearch.tsx` | Create | React island: orchestrates NumberInput + DatePicker + search execution                        |
| `src/components/draw/NumberBall.astro`             | Create | Styled lottery number ball (variants: default, reintegro; sizes: sm, md, lg)                  |
| `src/components/draw/DrawCard.astro`               | Create | Draw summary card with numbers, date, link to detail                                          |
| `src/components/draw/PrizeTable.astro`             | Create | Responsive prize table with currency formatting (ES locale)                                   |
| `src/components/draw/NumberFrequency.astro`        | Create | Frequency chart for numbers 1-46 with hot/cold highlighting                                   |
| `src/components/draw/DrawDetail.astro`             | Create | Composed draw detail view: numbers, prize table, frequency, navigation                        |
| `src/lib/api/client.ts`                            | Create | Typed API client factory with Zod validation, requestId, retry logic                          |
| `src/lib/api/schemas.ts`                           | Create | Zod schemas for Draw, DrawSummary, SearchResult, FrequencyResponse, PaginatedResponse         |
| `src/lib/api/errors.ts`                            | Create | Typed error classes: ApiValidationError, ApiNetworkError, ApiHttpError                        |
| `src/lib/utils/format.ts`                          | Create | Formatting utilities: currency (ES), date (ES), numbers                                       |
| `src/lib/utils/validation.ts`                      | Create | Validation helpers: unique numbers 1-46, date ranges                                          |
| `src/lib/utils/seo.ts`                             | Create | SEO meta tag generators for each page type                                                    |
| `src/env.d.ts`                                     | Create | TypeScript declarations for import.meta.env                                                   |
| `src/content/draws/`                               | Create | Content collection for draw data (if using Astro content layer)                               |
| `public/robots.txt`                                | Create | Robots.txt referencing sitemap.xml                                                            |
| `.github/workflows/ci.yml`                         | Create | CI pipeline: typecheck, lint, test, build, e2e, lighthouse                                    |
| `.github/workflows/lighthouse.yml`                 | Create | Lighthouse CI workflow for PRs                                                                |
| `playwright.config.ts`                             | Create | Playwright config: chromium, firefox, webkit, mobile projects                                 |
| `vitest.config.ts`                                 | Create | Vitest config: coverage thresholds, JSDOM, Astro component testing                            |
| `.storybook/main.ts`                               | Create | Storybook config for Astro components                                                         |
| `.storybook/preview.ts`                            | Create | Storybook preview with global decorators, a11y addon                                          |
| `lighthouserc.json`                                | Create | Lighthouse CI budgets: perf>90, a11y>95, bp>90, seo>95                                        |

## Interfaces / Contracts

### API Response Types (Zod Schemas)

```typescript
// src/lib/api/schemas.ts
import { z } from 'zod';

export const DrawSchema = z.object({
  id: z.number().int().positive(),
  drawNumber: z.number().int().positive(),
  date: z.string().datetime(),
  winningNumbers: z.array(z.number().int().min(1).max(46)).length(6),
  reintegro: z.number().int().min(1).max(9),
  jackpot: z.number().nonnegative(),
  prizes: z.array(
    z.object({
      category: z.string(),
      winners: z.number().int().nonnegative(),
      amountPerWinner: z.number().nonnegative(),
    })
  ),
  frequency: z
    .array(
      z.object({
        number: z.number().int().min(1).max(46),
        count: z.number().int().nonnegative(),
        percentage: z.number().min(0).max(100),
      })
    )
    .length(46),
});

export const DrawSummarySchema = DrawSchema.pick({
  id: true,
  drawNumber: true,
  date: true,
  winningNumbers: true,
  reintegro: true,
});

export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    data: z.array(itemSchema),
    pagination: z.object({
      page: z.number().int().positive(),
      limit: z.number().int().positive(),
      total: z.number().int().nonnegative(),
      totalPages: z.number().int().nonnegative(),
    }),
  });

export const SearchResultSchema = z.object({
  exactMatches: z.array(DrawSummarySchema),
  partialMatches: z.record(z.string(), z.array(DrawSummarySchema)),
  searchedCombination: z.array(z.number().int().min(1).max(46)).length(6),
  dateRange: z
    .object({
      startDate: z.string().datetime().optional(),
      endDate: z.string().datetime().optional(),
    })
    .optional(),
});

export const FrequencyResponseSchema = z.object({
  numbers: z
    .array(
      z.object({
        number: z.number().int().min(1).max(46),
        count: z.number().int().nonnegative(),
        percentage: z.number().min(0).max(100),
        classification: z.enum(['hot', 'cold', 'normal']),
      })
    )
    .length(46),
  period: z.object({
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
  }),
});

export const HealthCheckSchema = z.object({
  status: z.literal('ok'),
  timestamp: z.string().datetime(),
  version: z.string(),
});

// Type exports
export type Draw = z.infer<typeof DrawSchema>;
export type DrawSummary = z.infer<typeof DrawSummarySchema>;
export type PaginatedResponse<T> = z.infer<typeof PaginatedResponseSchema>;
export type SearchResult = z.infer<typeof SearchResultSchema>;
export type FrequencyResponse = z.infer<typeof FrequencyResponseSchema>;
export type HealthCheck = z.infer<typeof HealthCheckSchema>;
```

### Component Prop Interfaces

```typescript
// src/components/ui/Button.astro
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  children: string | AstroHTMLAttributes<'button'>['children'];
}

// src/components/draw/NumberBall.astro
interface NumberBallProps {
  number: number;
  variant?: 'default' | 'reintegro';
  size?: 'sm' | 'md' | 'lg';
  class?: string;
}

// src/components/draw/DrawCard.astro
interface DrawCardProps {
  draw: DrawSummary;
  showLink?: boolean;
  class?: string;
}

// src/components/draw/PrizeTable.astro
interface PrizeTableProps {
  prizes: Draw['prizes'];
  class?: string;
}

// src/components/specialized/NumberInput.tsx
interface NumberInputProps {
  value: number[];
  onChange: (numbers: number[]) => void;
  disabled?: boolean;
  error?: string;
}

// src/components/specialized/DatePicker.tsx
interface DatePickerProps {
  value: { startDate?: Date; endDate?: Date };
  onChange: (range: { startDate?: Date; endDate?: Date }) => void;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
}

// src/components/specialized/CombinationSearch.tsx
interface CombinationSearchProps {
  onSearch: (
    combination: number[],
    dateRange?: { startDate?: Date; endDate?: Date }
  ) => Promise<SearchResult>;
  initialCombination?: number[];
  initialDateRange?: { startDate?: Date; endDate?: Date };
}
```

### Environment Variables

```typescript
// src/env.d.ts
interface ImportMetaEnv {
  readonly PUBLIC_API_BASE_URL: string;
  readonly VERCEL_DEPLOY_HOOK_SECRET: string;
  readonly PUBLIC_SITE_URL: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

## Testing Strategy

| Layer          | What to Test                                                                           | Approach                                                                |
| -------------- | -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Unit           | Utility functions (format, validation), API client logic, Zod schemas                  | Vitest with JSDOM; mock fetch for API client; test error paths          |
| Unit           | Astro component rendering, props, slots                                                | Vitest + `@astrojs/test` or render to string; snapshot for markup       |
| Unit           | React island components (NumberInput, DatePicker, CombinationSearch)                   | Vitest + React Testing Library; test interactions, validation, keyboard |
| Integration    | Page rendering with real data, getStaticPaths output                                   | Vitest + Astro integration; test build output in `dist/`                |
| Integration    | API client with MSW mock server                                                        | Vitest + MSW; test retry, error correlation, validation                 |
| E2E            | Critical flows: home→detail, último sorteo, historial pagination, búsqueda exacta, 404 | Playwright; Chromium/Firefox/WebKit; mobile emulation (iPhone 14)       |
| E2E            | Visual regression: all pages desktop + mobile                                          | Playwright visual compare; baseline screenshots; 0.2% threshold         |
| Component Docs | All base + specialized components with interactive controls                            | Storybook; Controls panel for all props; Actions for events; a11y addon |
| Performance    | Lighthouse budgets on all public pages                                                 | Lighthouse CI on PR; desktop + mobile; block merge on regression        |

## Migration / Rollout

No migration required — greenfield project. Initial deployment to Vercel preview, then production. Deploy Hook configured in backend/CMS to trigger on new draw publication.

## Open Questions

- [ ] **Design token extraction**: Exact OKLCH values from Kombai Canvas Inicio A export need to be confirmed
- [ ] **Draw data source for build**: Whether to use static JSON files, Astro content collections, or API at build time — decision affects `getStaticPaths` implementation
- [ ] **Vercel Deploy Hook payload format**: Need backend team to confirm exact payload structure (drawId, drawDate, etc.)
- [ ] **Number frequency calculation**: Whether calculated at build time from historical data or fetched from API endpoint
- [ ] **Social card generation (og:image)**: Dynamic image generation approach — Vercel OG Image API, Astro endpoint, or static per draw
- [ ] **Accessibility audit scope**: Whether to target WCAG AA only or also AAA for specific components (color contrast on NumberBall)
- [ ] **Internationalization**: Current spec is Spanish-only; future i18n structure (routing, content) not yet defined
