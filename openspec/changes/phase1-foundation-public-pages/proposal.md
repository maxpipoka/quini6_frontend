# Proposal: Phase 1 Foundation & Public Pages

## Intent

Establish the Astro + Tailwind project foundation and implement all 6 public pages (Home, Último Sorteo, Historial, Detalle SSG, Búsqueda Exacta) using the Kombai Canvas "Inicio A" design system. This delivers the complete public-facing lottery statistics experience before adding admin capabilities.

## Scope

### In Scope

- Project scaffolding: Astro config, Tailwind setup, CSS custom properties theming
- Base UI component library (Button, Card, Input, Select, Modal, Toast, Table)
- Specialized components: NumberInput (6-number combination), DatePicker (draw dates)
- 6 public pages with responsive layouts (desktop + mobile from Inicio A)
- Static generation for draw detail pages via getStaticPaths
- Vercel Deploy Hook integration for rebuilds on new draws
- SEO meta tags, Open Graph, sitemap.xml generation
- Accessibility: WCAG AA, semantic HTML, keyboard navigation

### Out of Scope

- Admin area (login, draw CRUD, bulk import) — Phase 2
- Backend API integration — Phase 3 (NestJS on Vercel)
- JWT auth, CSRF protection — Phase 3
- User accounts, favorites, notifications — future

## Capabilities

### New Capabilities

- `project-foundation`: Astro + Tailwind + TypeScript project scaffolding and build config
- `design-system`: Kombai Canvas Inicio A component library with CSS custom properties theming
- `public-pages`: 6 public page routes with responsive layouts and SSG for draw details
- `draw-data-display`: Components for rendering draw results, prize tables, number statistics
- `combination-search`: Exact match search with NumberInput and date filtering
- `static-regeneration`: Vercel Deploy Hook integration for incremental static regeneration

### Modified Capabilities

- None (greenfield project)

## Approach

Follow the exploration's recommended stack: Astro 5 with static output, Tailwind CSS for styling, CSS custom properties for theming. Implement pages as Astro components with React/Preact islands only for interactive components (NumberInput, DatePicker, search). Use getStaticPaths for draw detail pages with fallback for new draws. Configure Vercel Deploy Hook to trigger rebuilds when new draws are published.

## Affected Areas

| Area                          | Impact | Description                                                               |
| ----------------------------- | ------ | ------------------------------------------------------------------------- |
| `src/pages/`                  | New    | 6 page routes: index, ultimo-sorteo, historial, detalle/[id], busqueda    |
| `src/components/ui/`          | New    | Base component library (Button, Card, Input, Select, Modal, Toast, Table) |
| `src/components/specialized/` | New    | NumberInput (6 numbers), DatePicker (draw dates)                          |
| `src/components/draw/`        | New    | DrawCard, PrizeTable, NumberFrequency, DrawDetail                         |
| `src/layouts/`                | New    | MainLayout, PageLayout with header/footer                                 |
| `src/styles/`                 | New    | global.css with CSS custom properties, Tailwind directives                |
| `astro.config.mjs`            | New    | Astro config with static output, integrations                             |
| `tailwind.config.mjs`         | New    | Tailwind config with design tokens from Inicio A                          |
| `vercel.json`                 | New    | Deploy hook configuration for ISR                                         |

## Risks

| Risk                                               | Likelihood | Mitigation                                                                         |
| -------------------------------------------------- | ---------- | ---------------------------------------------------------------------------------- |
| Design token mismatch with Inicio A variants       | Medium     | Extract tokens directly from Kombai Canvas; validate with visual regression tests  |
| SSG scalability for thousands of draw detail pages | Low        | Use getStaticPaths with pagination; fallback to on-demand rendering for edge cases |
| Vercel Deploy Hook reliability                     | Low        | Implement idempotent rebuild endpoint; add monitoring/alerting                     |
| Mobile responsiveness gaps                         | Medium     | Test both Inicio A mobile/desktop variants; use Playwright device emulation        |

## Rollback Plan

Revert to empty Astro starter project. Delete `openspec/changes/phase1-foundation-public-pages/`. No database migrations or external dependencies to clean up.

## Dependencies

- Node.js 20+ for Astro 5
- Vercel account for deployment and Deploy Hooks
- Kombai Canvas "Inicio A" design tokens exported

## Success Criteria

- [ ] Astro + Tailwind project builds and runs locally (`npm run dev`)
- [ ] All 6 pages render correctly on desktop and mobile (visual parity with Inicio A)
- [ ] Draw detail pages generate statically via getStaticPaths (test with 50+ draws)
- [ ] Vercel Deploy Hook triggers rebuild and new draw appears within 2 minutes
- [ ] Lighthouse scores: Performance > 90, Accessibility > 95, SEO > 95
- [ ] Zero TypeScript errors, zero lint warnings
- [ ] Storybook stories for all base and specialized components
- [ ] Playwright e2e tests pass for critical user flows (home → detail, search exact match)
