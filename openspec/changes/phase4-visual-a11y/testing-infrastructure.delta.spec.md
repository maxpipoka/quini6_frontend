# Testing Infrastructure Delta Specification

## Purpose

This delta spec documents the modifications to the existing `testing-infrastructure` capability to extend visual regression and accessibility testing scope for the phase4-visual-a11y change.

## Capability

**Modified Capability**: `testing-infrastructure` (delta)

## Changes from Base Spec

The base specification is at `openspec/specs/testing-infrastructure/spec.md`. This delta adds to and modifies the following requirements.

---

### Modified Requirement: Playwright E2E Testing

**Base Spec Lines 45-92** - Extended with new visual regression and a11y test scopes.

#### Added Scenario: Component-level visual regression for admin components

- GIVEN the extended visual test suite
- WHEN running `npm run test:e2e -- --project=chromium`
- THEN visual tests execute for 5 admin components:
  - FileDropzone (6 states × 2 viewports = 12 tests)
  - ImportPreviewTable (4 states × 2 viewports = 8 tests)
  - ImportHistoryTable (4 states × 2 viewports = 8 tests)
  - ImportProgress (4 states × 2 viewports = 8 tests)
  - Progress (5 states × 2 viewports = 10 tests)
- AND total 46 new visual test cases added
- AND tests use temporary Astro fixture pages at `tests/e2e/fixtures/`
- AND animations disabled via `data-test-animate="false"`

#### Added Scenario: Accessibility E2E tests for admin import flow

- GIVEN `@axe-core/playwright` installed
- WHEN running `npm run test:e2e -- --project=chromium`
- THEN new test file `tests/e2e/a11y-admin-import.spec.ts` executes
- AND tests cover complete flow: FileDropzone → PreviewTable → ImportProgress → HistoryTable
- AND axe-core analyzes each step with `wcag2aa`, `wcag21aa`, `best-practice` rulesets
- AND violations fail the test with detailed report

#### Modified Scenario: Cross-browser testing (lines 62-67)

- GIVEN Playwright config with visual and a11y tests
- WHEN tests run in CI
- THEN **visual tests execute in Chromium only** (unchanged from base)
- AND **a11y tests execute in Chromium only** (for speed, consistent results)
- AND functional E2E tests still execute in Chromium, Firefox, WebKit (unchanged)

#### Modified Scenario: Test commands (lines 180-191)

- GIVEN the package.json scripts
- WHEN running commands:
  - `npm run test:e2e` - NOW includes visual regression + a11y tests
  - `npm run test:e2e:ui` - NOW includes visual/a11y test debugging
  - NEW: `npm run test:a11y` - runs only accessibility E2E tests
  - NEW: `npm run test:visual` - runs only visual regression tests
- THEN each command executes correctly

---

### Modified Requirement: Storybook Component Documentation

**Base Spec Lines 93-137** - Extended with a11y addon for new admin components.

#### Added Scenario: Admin component stories with a11y addon

- GIVEN Storybook with `@storybook/addon-a11y` enabled
- WHEN running `npm run storybook`
- THEN stories exist for 5 new admin components (per accessibility-audit-admin spec):
  - FileDropzone (6 state variants)
  - ImportPreviewTable (4 state variants)
  - ImportHistoryTable (4 state variants)
  - ImportProgress (4 state variants)
  - Progress (5 state variants)
- AND Accessibility panel shows zero violations for all stories
- AND Controls panel allows testing interactive states (disabled, error, loading)
- AND Actions panel logs event handlers for verification

#### Modified Scenario: Stories include accessibility addon (lines 123-130)

- GIVEN a story with a11y addon enabled
- WHEN the story renders
- THEN the Accessibility panel shows violations
- AND **zero violations for all base components** (unchanged)
- AND **zero violations for all new admin components** (NEW)
- AND violations link to WCAG criteria

---

### Modified Requirement: Test Commands and CI Integration

**Base Spec Lines 176-212** - Extended with new test commands and CI steps.

#### Modified Scenario: CI pipeline runs all tests (lines 193-205)

- GIVEN a GitHub Actions workflow
- WHEN a PR opens or pushes to main
- THEN the pipeline runs:
  1. TypeScript type check (unchanged)
  2. ESLint + Prettier (unchanged)
  3. Unit tests with coverage (unchanged)
  4. Build verification (unchanged)
  5. **E2E tests - Chromium only (includes visual + a11y)** (MODIFIED: was E2E only)
  6. Lighthouse CI (on PRs to main) (unchanged)
- AND all must pass for merge

#### Added Scenario: Visual and a11y test artifacts on failure

- GIVEN a test failure in CI (visual or a11y)
- WHEN the workflow fails
- THEN Playwright traces upload as artifacts (unchanged)
- AND **visual diff images upload as artifacts** (NEW)
- AND **axe-core violation reports upload as artifacts** (NEW)
- AND Lighthouse reports upload as artifacts (unchanged)
- AND coverage reports upload as artifacts (unchanged)

---

### Added Configuration Requirements

#### New Playwright Projects for Visual/A11y

```typescript
// playwright.config.ts additions
projects: [
  // Existing projects...
  {
    name: 'chromium',
    use: { ...devices['Desktop Chrome'] },
  },
  // Visual regression tests - Chromium only
  {
    name: 'visual',
    use: { 
      ...devices['Desktop Chrome'],
      viewport: { width: 1280, height: 720 },
    },
  },
  {
    name: 'visual-mobile',
    use: { 
      ...devices['iPhone 14'],
      viewport: { width: 375, height: 667 },
    },
  },
  // A11y tests - Chromium only
  {
    name: 'a11y',
    use: { ...devices['Desktop Chrome'] },
  },
],
```

#### New NPM Scripts

```json
// package.json additions
"scripts": {
  "test:e2e": "playwright test",
  "test:e2e:ui": "playwright test --ui",
  "test:visual": "playwright test --project=visual --project=visual-mobile",
  "test:a11y": "playwright test --project=a11y --grep a11y",
  "test:visual:update": "playwright test --project=visual --project=visual-mobile --update-snapshots"
}
```

#### New Dependencies

```json
// package.json additions
"devDependencies": {
  "@axe-core/playwright": "^4.8.0",
  "@storybook/addon-a11y": "^7.6.0"
}
```

---

### Modified File Structure

| File | Change Type | Description |
|------|-------------|-------------|
| `playwright.config.ts` | Modified | Add visual/a11y projects, snapshot config |
| `tests/e2e/visual.spec.ts` | Modified | Add 46 new component visual tests |
| `tests/e2e/a11y-admin-import.spec.ts` | New | Axe-core E2E tests for admin flow |
| `tests/e2e/a11y-setup.ts` | New | Shared axe-core configuration |
| `tests/e2e/fixtures/*.astro` | New | 5 temporary Astro pages for visual tests |
| `.storybook/main.ts` | Modified | Enable a11y addon globally |
| `.storybook/preview.ts` | Modified | Configure a11y parameters |
| `stories/FileDropzone.stories.tsx` | New | 6 state variants with a11y |
| `stories/ImportPreviewTable.stories.tsx` | New | 4 state variants with a11y |
| `stories/ImportHistoryTable.stories.tsx` | New | 4 state variants with a11y |
| `stories/ImportProgress.stories.tsx` | New | 4 state variants with a11y |
| `stories/Progress.stories.tsx` | New | 5 state variants with a11y |
| `package.json` | Modified | New scripts and dependencies |
| `.github/workflows/ci.yml` | Modified | Add visual/a11y test steps |

---

## Acceptance Criteria for Delta

1. **Playwright config** includes visual and a11y projects (Chromium only)
2. **Visual tests** pass for all 5 admin components × states × viewports (46 tests)
3. **A11y E2E tests** pass for complete admin import flow
4. **Storybook** shows zero a11y violations for all 5 new component stories
5. **NPM scripts** `test:visual` and `test:a11y` execute correctly
6. **CI pipeline** runs visual + a11y tests on PR and blocks merge on failure
7. **Artifacts** include visual diffs and axe reports on failure
8. **No regression** in existing testing-infrastructure functionality

## Rollback Plan (Delta-Specific)

1. Revert `playwright.config.ts` to remove visual/a11y projects
2. Revert `tests/e2e/visual.spec.ts` to remove admin component tests
3. Delete `tests/e2e/a11y-admin-import.spec.ts` and `tests/e2e/a11y-setup.ts`
4. Delete `tests/e2e/fixtures/*-visual.astro` files
5. Revert `.storybook/main.ts` and `.storybook/preview.ts` a11y config
6. Delete 5 new story files in `stories/`
7. Revert `package.json` scripts and dependencies
8. Revert `.github/workflows/ci.yml` visual/a11y steps

## Dependencies

- Base: `testing-infrastructure` spec at `openspec/specs/testing-infrastructure/spec.md`
- New: `@axe-core/playwright` ^4.8.0
- New: `@storybook/addon-a11y` ^7.6.0
- Existing: Playwright, Vitest, Storybook, Lighthouse CI (per base spec)