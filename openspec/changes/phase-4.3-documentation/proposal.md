# Proposal: Phase 4.3 Documentation

## Intent

Create comprehensive developer documentation for the quini6_frontend project covering setup, components (Storybook), API client types, and operational runbooks. This addresses the current gap where onboarding requires reading scattered files and deployment/debugging knowledge is tribal.

## Scope

### In Scope
- README.md in project root: setup, scripts, architecture diagram, contributing
- docs/components/guide.md: Storybook usage, component catalog, how to run locally
- docs/api/client.md: TypeDoc-generated API client types/interfaces from src/lib/api/ and src/lib/schemas.ts
- docs/runbooks/deploy.md, rollback.md, debugging.md: Vercel deployment, rollback procedures, common issues
- CI integration: TypeDoc generation step in CI pipeline
- Storybook deployment: GitHub Actions workflow for GitHub Pages deployment

### Out of Scope
- Backend API documentation (separate repo)
- User-facing documentation (end-user manuals)
- Translation/internationalization of docs

## Capabilities

### New Capabilities
- `documentation-readme`: Project root README with setup, commands, architecture
- `documentation-components`: Storybook guide and component catalog docs
- `documentation-api-client`: TypeDoc-generated API client documentation
- `documentation-runbooks`: Operational runbooks (deploy, rollback, debugging)

### Modified Capabilities
- `testing-infrastructure`: Add TypeDoc to CI pipeline for docs generation

## Approach

1. **README.md**: Write from existing package.json scripts, astro.config.ts, and project structure. Include Mermaid architecture diagram showing Astro + React + API client flow.

2. **docs/ structure**: Create docs/ directory with components/, api/, runbooks/ subdirectories. Use markdown for all docs.

3. **TypeDoc setup**: Add `typedoc` and `typedoc-plugin-markdown` as devDependencies. Configure typedoc.json to read from src/lib/api/ and src/lib/schemas.ts, output to docs/api/client.md.

4. **Storybook deployment**: Create .github/workflows/storybook.yml that builds Storybook and deploys to GitHub Pages on main branch pushes.

5. **CI integration**: Add docs generation job to ci.yml that runs TypeDoc and validates output.

6. **Runbooks**: Write based on current Vercel deployment, mock API setup, and CI pipeline knowledge.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `README.md` | New/Modified | Complete rewrite with project-specific content |
| `docs/` | New | New directory with components/, api/, runbooks/ |
| `package.json` | Modified | Add TypeDoc, typedoc-plugin-markdown |
| `typedoc.json` | New | TypeDoc configuration |
| `.github/workflows/ci.yml` | Modified | Add docs generation job |
| `.github/workflows/storybook.yml` | New | Storybook deployment to GitHub Pages |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| TypeDoc fails on complex Zod schemas | Medium | Use typedoc-plugin-markdown with custom type formatting; test locally first |
| GitHub Pages deployment conflicts | Low | Use dedicated gh-pages branch; configure workflow permissions |
| CI pipeline time increase | Low | Run docs job in parallel; cache node_modules |

## Rollback Plan

- Revert package.json to remove TypeDoc dependencies
- Delete docs/ directory (or restore from git)
- Remove docs generation job from ci.yml
- Delete storybook.yml workflow
- Revert README.md to previous version

## Dependencies

- TypeDoc + typedoc-plugin-markdown (npm packages)
- GitHub Pages enabled for repository
- Existing CI pipeline (GitHub Actions)

## Success Criteria

- [ ] README.md covers setup, scripts, architecture diagram
- [ ] docs/components/guide.md explains Storybook usage and component catalog
- [ ] docs/api/client.md generated from TypeScript source via TypeDoc
- [ ] docs/runbooks/ covers deploy, rollback, debugging
- [ ] CI generates and validates docs on every PR
- [ ] Storybook deployed to GitHub Pages on main branch pushes