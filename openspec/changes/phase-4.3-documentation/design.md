# Design: Phase 4.3 Documentation

## Technical Approach

This design implements comprehensive developer documentation covering four areas: project README, Storybook component guide, TypeDoc-generated API client documentation, and operational runbooks. The approach leverages existing project infrastructure (Astro, Storybook, CI pipeline, TypeScript/Zod) and adds TypeDoc for API documentation generation with GitHub Actions for Storybook deployment to GitHub Pages.

## Architecture Decisions

### Decision: Documentation Format — Markdown over MDX

| Option | Tradeoff | Decision |
|--------|----------|----------|
| **Markdown (.md)** | Simpler, universal rendering on GitHub/GitLab, no build step | ✅ Chosen |
| **MDX (.mdx)** | Supports React components, but requires compilation, not natively rendered on GitHub | Rejected |

**Rationale**: All docs will live in `docs/` and render natively on GitHub. Markdown is sufficient for guides, runbooks, and TypeDoc output. No need for interactive components in documentation.

---

### Decision: TypeDoc Plugin — typedoc-plugin-markdown

| Option | Tradeoff | Decision |
|--------|----------|----------|
| **typedoc-plugin-markdown** | Single-file output, simple config, widely used | ✅ Chosen |
| **typedoc-plugin-mdn** | Multi-file output, MDN-style, more complex | Rejected |

**Rationale**: Specs require single-file output at `docs/api/client.md`. `typedoc-plugin-markdown` supports `--out` to single file with `--entryPointStrategy expand`. Better fit for CI validation and simpler deployment.

---

### Decision: Storybook Deployment — GitHub Actions to GitHub Pages

| Option | Tradeoff | Decision |
|--------|----------|----------|
| **GitHub Actions + GitHub Pages** | Free, integrated, uses existing CI, full control | ✅ Chosen |
| **Chromatic** | Visual regression built-in, but paid for private repos, external dependency | Rejected |

**Rationale**: Project is private (likely), GitHub Pages is free for private repos with Actions. Workflow can reuse `build-storybook` output. Chromatic adds cost and external dependency without clear benefit for this use case.

---

### Decision: CI Step Ordering — Docs Job in Parallel

| Option | Tradeoff | Decision |
|--------|----------|----------|
| **Parallel with typecheck/lint/test** | Fastest pipeline, docs don't block other jobs | ✅ Chosen |
| **Sequential after build** | Guarantees build passes first, but adds latency | Rejected |

**Rationale**: Specs require "does not block other jobs". Docs generation only needs source files, not build output. Running in parallel with typecheck/lint minimizes pipeline time.

---

### Decision: TypeDoc Entry Points — src/lib/api/ + src/lib/schemas.ts

| Option | Tradeoff | Decision |
|--------|----------|----------|
| **Both entry points** | Complete API surface (client + schemas), single docs file | ✅ Chosen |
| **Only src/lib/api/** | Misses Zod schemas and inferred types | Rejected |

**Rationale**: Specs explicitly require both. The `index.ts` barrel export re-exports schemas, but TypeDoc needs explicit entry points to document Zod schema shapes and inferred types.

---

## Data Flow

```
Source Code (src/lib/api/, src/lib/schemas.ts)
         │
         ▼
    TypeDoc (typedoc.json config)
         │
         ▼
    typedoc-plugin-markdown
         │
         ▼
    docs/api/client.md  ◄─── CI validates existence & non-empty
         │
         ▼
    GitHub Pages (via storybook.yml)  ◄─── Separate workflow
         │
         ▼
    https://<org>.github.io/quini6_frontend/
```

**CI Pipeline (ci.yml) — Parallel Jobs:**
```
typecheck ──┐
lint        ├─► build ──► e2e ──► lighthouse
test        │
docs ◄──────┘  (new job, runs in parallel)
```

**Storybook Deployment (storybook.yml):**
```
push to main
    │
    ▼
build-storybook
    │
    ▼
Deploy to gh-pages branch via actions/configure-pages + actions/upload-pages-artifact + actions/deploy-pages
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `README.md` | Modify | Complete rewrite with setup, scripts table, Mermaid architecture diagram, contribution guidelines, project structure |
| `docs/components/guide.md` | Create | Storybook usage guide, component catalog (base + feature), writing stories guide, deployment docs |
| `docs/api/client.md` | Generate | TypeDoc output from `src/lib/api/` and `src/lib/schemas.ts` |
| `docs/runbooks/deploy.md` | Create | Vercel deployment process, preview deployments, environment configuration |
| `docs/runbooks/rollback.md` | Create | Immediate Vercel rollback, git-based rollback, API compatibility considerations |
| `docs/runbooks/debugging.md` | Create | Build failures, runtime errors, performance issues, API integration, Storybook deployment issues |
| `docs/runbooks/incident-response.md` | Create | Severity classification, communication process, post-incident review |
| `package.json` | Modify | Add `typedoc`, `typedoc-plugin-markdown` to devDependencies; add `docs:generate` script |
| `typedoc.json` | Create | TypeDoc configuration: entryPoints, plugin, output, options |
| `.github/workflows/ci.yml` | Modify | Add `docs` job (parallel), upload docs artifact on failure, add to pipeline steps |
| `.github/workflows/storybook.yml` | Create | GitHub Actions workflow for Storybook deployment to GitHub Pages |
| `.storybook/main.ts` | Verify | Confirm base config works with GitHub Pages base path (may need `viteFinal` base config) |

## Interfaces / Contracts

### package.json — New Scripts
```json
{
  "scripts": {
    "docs:generate": "typedoc",
    "docs:validate": "test -f docs/api/client.md && test -s docs/api/client.md"
  },
  "devDependencies": {
    "typedoc": "^0.26.x",
    "typedoc-plugin-markdown": "^4.2.x"
  }
}
```

### typedoc.json — Configuration
```json
{
  "entryPoints": ["src/lib/api/", "src/lib/schemas.ts"],
  "entryPointStrategy": "expand",
  "out": "docs/api/client.md",
  "plugin": ["typedoc-plugin-markdown"],
  "theme": "markdown",
  "excludePrivate": true,
  "excludeProtected": true,
  "excludeInternal": true,
  "readme": "none",
  "githubPages": false,
  "cname": false,
  "cleanOutputDir": true,
  "tsconfig": "tsconfig.json",
  "projectDocuments": [],
  "categorizeByGroup": false,
  "defaultCategory": "API Reference",
  "categoryOrder": ["API Client", "Schemas", "Errors", "Utilities"]
}
```

### .github/workflows/ci.yml — New Docs Job
```yaml
docs:
  name: Generate Documentation
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'
    - run: npm ci
    - run: npm run docs:generate
    - run: npm run docs:validate
    - uses: actions/upload-artifact@v4
      if: failure()
      with:
        name: generated-docs
        path: docs/api/client.md
        retention-days: 7
```

### .github/workflows/storybook.yml — New Workflow
```yaml
name: Deploy Storybook

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'
      - run: npm ci
      - run: npm run build-storybook
      - uses: actions/upload-pages-artifact@v3
        with:
          path: storybook-static

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

### .storybook/main.ts — Verify base config
```typescript
// May need to add for GitHub Pages:
viteFinal: async (config) => {
  config.base = '/quini6_frontend/';  // Repository name for GitHub Pages
  // ... existing alias config
  return config;
}
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|--------------|----------|
| Unit | TypeDoc generates valid markdown | Run `npm run docs:generate` locally, verify `docs/api/client.md` exists and contains expected modules |
| Integration | CI docs job passes | Push PR, verify GitHub Actions runs docs job in parallel, artifact uploaded on failure |
| Integration | Storybook deploys to GitHub Pages | Push to main, verify workflow completes, check deployed URL renders Storybook |
| E2E | README renders on GitHub | Push to main, verify Mermaid diagram renders, links work |
| Manual | Runbooks accuracy | Follow deploy/rollback/debugging steps in staging, verify commands work |

## Migration / Rollout

**No migration required** — This is additive documentation only. No runtime behavior changes.

**Rollout plan:**
1. Create `docs/` directory structure and markdown files
2. Add TypeDoc dependencies and configuration
3. Add `docs:generate` script and verify locally
4. Add docs job to CI (parallel, non-blocking initially)
5. Create Storybook deployment workflow
6. Enable GitHub Pages in repository settings (gh-pages branch)
7. Push to main to trigger first Storybook deployment
8. Verify all docs render correctly on GitHub and GitHub Pages

## Open Questions

- [ ] **GitHub Pages base path**: Repository name confirmed as `quini6_frontend`? Need to verify `.storybook/main.ts` base config matches.
- [ ] **GitHub Pages permissions**: Repository settings must allow GitHub Actions to write to Pages. Confirm `pages: write` permission works.
- [ ] **TypeDoc Zod schema rendering**: Complex Zod schemas (refine, transform) may not render ideally. May need custom type formatting or accept limitations.
- [ ] **README Mermaid diagram**: Ensure GitHub renders Mermaid (enabled by default on GitHub). No extra config needed.
- [ ] **Runbooks Vercel specifics**: Some Vercel CLI commands may need `vercel` CLI installed in CI. Current CI doesn't have it — runbooks should reference dashboard UI as primary.

## Summary

- **Approach**: Additive documentation layer using existing tooling (TypeDoc, Storybook, GitHub Actions) with Markdown format
- **Key Decisions**: 5 documented (format, TypeDoc plugin, Storybook deployment, CI ordering, entry points)
- **Files Affected**: 11 new/modified files (4 new docs, 3 new workflow/config, 4 modified existing)
- **Testing Strategy**: Unit (local TypeDoc), Integration (CI jobs), E2E (GitHub rendering), Manual (runbook validation)
- **Next Step**: Ready for task breakdown (sdd-tasks)