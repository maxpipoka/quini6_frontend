**Quini6 Frontend v0.0.1**

***

# Quini6 Frontend

A modern Astro + React + TypeScript frontend for the Quini6 lottery application.

## 🚀 Project Structure

```
/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components (Astro + React)
│   │   ├── admin/         # Admin-specific components
│   │   ├── ui/            # Base UI components
│   │   └── ...
│   ├── pages/             # Astro pages (routes)
│   │   ├── admin/         # Admin panel pages
│   │   └── ...
│   ├── layouts/           # Page layouts
│   ├── lib/               # Core libraries and utilities
│   │   ├── api/          # API client and types
│   │   ├── analytics.ts   # Plausible analytics wrapper
│   │   └── ...
│   ├── hooks/             # Custom React hooks
│   ├── styles/            # Global styles
│   └── types/             # TypeScript type definitions
├── tests/                 # Test files
│   ├── e2e/              # Playwright E2E tests
│   └── integration/      # Integration tests
├── docs/                  # Documentation
│   ├── api/              # Generated TypeDoc API docs
│   ├── components/       # Component guides
│   └── runbooks/         # Operational runbooks
├── .storybook/           # Storybook configuration
└── package.json
```

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                      | Action                                           |
| :--------------------------- | :----------------------------------------------- |
| `npm install`                | Installs dependencies                            |
| `npm run dev`                | Starts local dev server at `localhost:4321`      |
| `npm run build`              | Build your production site to `./dist/`          |
| `npm run preview`            | Preview your build locally, before deploying     |
| `npm run astro ...`          | Run CLI commands like `astro add`, `astro check` |
| `npm run lint`               | Run ESLint on all files                          |
| `npm run lint:fix`           | Run ESLint with auto-fix                         |
| `npm run format`             | Format code with Prettier                        |
| `npm run format:check`       | Check code formatting                            |
| `npm run typecheck`          | Run TypeScript type checking                     |
| `npm run test`               | Run Vitest unit tests                            |
| `npm run test:watch`         | Run Vitest in watch mode                         |
| `npm run test:coverage`      | Run tests with coverage report                   |
| `npm run test:e2e`           | Run Playwright E2E tests                         |
| `npm run test:e2e:ui`        | Run Playwright with UI                           |
| `npm run test:visual`        | Run visual regression tests                      |
| `npm run test:a11y`          | Run accessibility tests                          |
| `npm run test:visual:update` | Update visual snapshots                          |
| `npm run storybook`          | Start Storybook dev server                       |
| `npm run build-storybook`    | Build Storybook static site                      |
| `npm run lighthouse`         | Run Lighthouse CI                                |
| `npm run docs:generate`      | Generate TypeDoc API documentation               |
| `npm run docs:validate`      | Validate TypeDoc documentation                   |

## 🏗️ Architecture

### Tech Stack

- **Framework**: Astro 5.x (Static Site Generation + Islands)
- **UI Library**: React 18.x (for interactive components)
- **Styling**: Tailwind CSS 3.x
- **Language**: TypeScript 5.x (strict mode)
- **Testing**: Vitest (unit), Playwright (E2E/integration/visual/a11y)
- **Documentation**: TypeDoc + typedoc-plugin-markdown
- **Component Explorer**: Storybook 8.x
- **Error Tracking**: Sentry
- **Analytics**: Plausible

### Key Patterns

1. **Islands Architecture**: Astro renders static HTML by default; React components are hydrated only where needed via `client:*` directives
2. **Container-Presentational**: Smart containers (data fetching, logic) separate from presentational components (pure UI)
3. **Type-Safe API**: Zod schemas for runtime validation + TypeScript types
4. **Server-First**: Prefer server-side data fetching in `.astro` files; pass data to islands as props
5. **Accessibility First**: Semantic HTML, ARIA attributes, keyboard navigation, WCAG AA compliance

### Admin Panel

The admin panel (`/admin/*`) includes:

- **Authentication**: Protected routes with session-based auth
- **Health Dashboard** (`/admin/health`): Real-time API/DB health monitoring with auto-refresh
- **Import Management**: CSV/Excel import with preview and validation
- **Sentry Integration**: Error tracking with requestId correlation
- **Plausible Analytics**: Privacy-friendly analytics on admin pages only

### Environment Variables

| Variable                | Description                    | Required   |
| :---------------------- | :----------------------------- | :--------- |
| `VITE_API_BASE_URL`     | Backend API base URL           | Yes        |
| `VITE_SENTRY_DSN`       | Sentry DSN for error tracking  | Production |
| `VITE_PLAUSIBLE_DOMAIN` | Plausible domain for analytics | Production |
| `VITE_BUNDLE_ANALYZE`   | Enable bundle analyzer         | No         |

Copy `.env.example` to `.env` and configure for your environment.

## 📚 Documentation

- **API Reference**: Run `npm run docs:generate` to generate `docs/api/`
- **Component Guide**: See `docs/components/guide.md`
- **Runbooks**: See `docs/runbooks/` for operational procedures

## 🧪 Testing Strategy

1. **Unit Tests** (Vitest): Pure functions, hooks, utilities, React components
2. **Integration Tests** (Playwright + MSW): API client, Sentry, Plausible integration
3. **E2E Tests** (Playwright): Critical user flows (login, health page, analytics)
4. **Visual Regression** (Playwright): Component and page snapshots
5. **Accessibility** (Playwright + axe-core): WCAG AA compliance

## 🚢 Deployment

- **Platform**: Vercel (recommended) or any static hosting
- **Build Output**: `dist/` directory
- **Preview**: `npm run preview` serves the built site locally
- **Rollback**: See `docs/runbooks/rollback.md`

## 🔧 Development

### Prerequisites

- Node.js >= 22.23.4
- npm >= 10.x

### Setup

```bash
npm install
npm run dev
```

### Code Quality

- **Linting**: ESLint with TypeScript, Astro, React, Tailwind plugins
- **Formatting**: Prettier with Astro and Tailwind plugins
- **Type Checking**: `tsc --noEmit` (strict mode)
- **Pre-commit**: Husky + lint-staged

### Adding Components

1. Create component in `src/components/` (Astro) or `src/components/` with `.tsx` (React)
2. Add Storybook story in `.stories.tsx` alongside component
3. Add unit tests in `.test.tsx` alongside component
4. Document in `docs/components/guide.md` if reusable

## 📖 Learn More

- [Astro Documentation](https://docs.astro.build)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeDoc](https://typedoc.org)
- [Storybook](https://storybook.js.org)
- [Playwright](https://playwright.dev)
