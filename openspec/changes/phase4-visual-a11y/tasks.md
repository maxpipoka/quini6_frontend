# Tasks: Phase 4 Visual Regression & Accessibility Audit

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 1800-2500 |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 1: Visual regression infrastructure + tests → PR 2: Storybook a11y stories → PR 3: Playwright axe-core E2E + CI |
| Delivery strategy | ask-on-risk |
| Chain strategy | stacked-to-main |

Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: stacked-to-main
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Visual regression infrastructure, test data, Astro fixtures, visual.spec.ts (46 tests) | PR 1 | Foundation: playground config, deterministic data, component isolation |
| 2 | Storybook stories for 5 components (23 stories) with a11y addon | PR 2 | Independent; can run in parallel with PR 1 |
| 3 | Playwright + axe-core E2E a11y tests, CI integration, npm scripts | PR 3 | Depends on PR 1 (visual fixtures) and PR 2 (story coverage) |

---

## Phase 1: Visual Regression Infrastructure & Test Data

- [ ] 1.1 Create `tests/e2e/fixtures/visual-test-data.ts` with deterministic props for all 5 components (6 FileDropzone states, 4 ImportPreviewTable states, 4 ImportHistoryTable states, 4 ImportProgress states, 5 Progress states)
- [ ] 1.2 Create `tests/e2e/fixtures/visual-test-matrix.ts` exporting `components[]` and `viewports[]` arrays matching the 46 test case matrix
- [ ] 1.3 Add `@axe-core/playwright` to `package.json` devDependencies
- [ ] 1.4 Update `playwright.config.ts` — add `visual`, `visual-mobile`, `a11y` projects (Chromium only); set `snapshotDir` and `snapshotPathTemplate`
- [ ] 1.5 Add npm scripts to `package.json`: `test:visual`, `test:a11y`, `test:visual:update`

---

## Phase 2: Visual Regression Test Fixtures & Tests

- [ ] 2.1 Create `tests/e2e/fixtures/FileDropzone-visual.astro` — renders FileDropzone with state/viewport props, disables animations via `data-test-animate="false"`
- [ ] 2.2 Create `tests/e2e/fixtures/ImportPreviewTable-visual.astro` — same pattern for ImportPreviewTable
- [ ] 2.3 Create `tests/e2e/fixtures/ImportHistoryTable-visual.astro` — same pattern for ImportHistoryTable
- [ ] 2.4 Create `tests/e2e/fixtures/ImportProgress-visual.astro` — same pattern for ImportProgress
- [ ] 2.5 Create `tests/e2e/fixtures/Progress-visual.astro` — same pattern for Progress
- [ ] 2.6 Add sample CSV file `tests/e2e/fixtures/sample-draws.csv` for file upload testing
- [ ] 2.7 Extend `tests/e2e/visual.spec.ts` — add `test.describe('Visual Regression - Admin Components')` with nested loops over components × states × viewports (46 tests)
- [ ] 2.8 Run `npm run test:visual:update` to generate baseline screenshots in `tests/e2e/visual-snapshots/`
- [ ] 2.9 Commit baseline screenshots; verify `npm run test:visual` passes locally

---

## Phase 3: Storybook Stories with A11y Addon

- [ ] 3.1 Verify `.storybook/main.ts` has `@storybook/addon-a11y` in addons array
- [ ] 3.2 Update `.storybook/preview.tsx` — extend `a11y.config.rules` with color-contrast, label, aria-required-attr, aria-valid-attr-value, keyboard
- [ ] 3.3 Create `stories/FileDropzone.stories.tsx` — 6 variants (Default, Hover, Focus, Error, Loading, Disabled) using visual-test-data props; configure argTypes for Controls
- [ ] 3.4 Create `stories/ImportPreviewTable.stories.tsx` — 4 variants (Default, Empty, Error, Loading)
- [ ] 3.5 Create `stories/ImportHistoryTable.stories.tsx` — 4 variants (Default, Empty, Loading, Pagination)
- [ ] 3.6 Create `stories/ImportProgress.stories.tsx` — 4 variants (Default, InProgress, Success, Error)
- [ ] 3.7 Create `stories/Progress.stories.tsx` — 5 variants (Default, Partial, Complete, Indeterminate, Error)
- [ ] 3.8 Run `npm run storybook` locally; verify Accessibility panel shows zero violations for all 23 stories

---

## Phase 4: Playwright + axe-core E2E Accessibility Tests

- [ ] 4.1 Create `tests/e2e/a11y-setup.ts` — export `runA11yCheck(page, context?)` and `assertNoA11yViolations(results)` with wcag2aa, wcag21aa, best-practice tags; disable region, landmark-one-main
- [ ] 4.2 Create `tests/e2e/a11y-admin-import.spec.ts` — test the complete admin import flow:
  - Navigate to `/admin/imports/upload`
  - FileDropzone file upload → verify ARIA live
  - PreviewTable table semantics + keyboard nav
  - ImportProgress start import → verify `role="status"` aria-live
  - HistoryTable pagination keyboard nav
  - axe check after each step
- [ ] 4.3 Run `npm run test:a11y` locally; verify all E2E a11y tests pass
- [ ] 4.4 Create manual verification checklist document (markdown) covering:
  - Keyboard tab order (9 steps from spec)
  - Focus indicator (3px solid outline, 2px offset, #005fcc)
  - Screen reader announcements (6 dynamic updates from spec)
  - Color contrast (≥4.5:1 text, ≥3:1 UI components)
  - ARIA/semantic HTML verification per component (5 components)

---

## Phase 5: CI Integration & Pipeline

- [ ] 5.1 Update `.github/workflows/ci.yml` — add visual/a11y test steps:
  - Install Playwright with Chromium deps
  - Start dev server in background
  - Run `npm run test:e2e -- --project=chromium` (includes visual + a11y)
  - Upload Playwright traces on failure
  - Upload visual diff images (`*.diff.png`) on failure
  - Upload axe reports (`a11y-*.json`) on failure
- [ ] 5.2 Verify CI pipeline runs successfully on a test PR
- [ ] 5.3 Document any known false positive suppressions with justification in `tests/e2e/a11y-setup.ts` comments

---

## Phase 6: Final Verification & Cleanup

- [ ] 6.1 Run full test suite: `npm run test:e2e -- --project=chromium` — verify all visual + a11y + existing tests pass
- [ ] 6.2 Complete manual verification checklist (Phase 4.4) and sign off
- [ ] 6.3 Verify zero a11y violations in Storybook for all 5 components
- [ ] 6.4 Verify visual regression tests pass on desktop + mobile viewports
- [ ] 6.5 Ensure no regressions in existing testing-infrastructure functionality