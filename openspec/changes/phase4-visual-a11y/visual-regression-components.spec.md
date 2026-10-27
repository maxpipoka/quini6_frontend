# Visual Regression Components Specification

## Purpose

This specification defines component-level visual regression testing for admin UI components. It extends the existing Playwright visual testing infrastructure to cover 5 new admin components across multiple states and viewports.

## Capability

**New Capability**: `visual-regression-components`

## Requirements

### Requirement: Component-Level Visual Tests for Admin Components

The system SHALL provide visual regression tests for the following 5 admin components:
- `FileDropzone` (src/components/ui/FileDropzone.tsx)
- `ImportPreviewTable` (src/components/admin/ImportPreviewTable.tsx)
- `ImportHistoryTable` (src/components/admin/ImportHistoryTable.tsx)
- `ImportProgress` (src/components/admin/ImportProgress.tsx)
- `Progress` (src/components/ui/Progress.tsx)

#### Scenario: Visual tests run for each component in all required states

- GIVEN the visual test suite in `tests/e2e/visual.spec.ts`
- WHEN running `npm run test:e2e -- --project=chromium`
- THEN visual tests execute for each component in these states:
  - Default (initial render)
  - Hover (mouse over interactive elements)
  - Focus (keyboard focus visible)
  - Error (validation/error state)
  - Loading (async operation in progress)
  - Disabled (where applicable)
- AND tests capture screenshots at desktop (1280x720) viewport
- AND tests capture screenshots at mobile (375x667) viewport
- AND pixel threshold is 0.2% difference from baseline

#### Scenario: Baseline screenshots committed and versioned

- GIVEN initial test run with `--update-snapshots`
- WHEN baseline screenshots are generated
- THEN screenshots commit to `tests/e2e/visual-snapshots/`
- AND file naming convention: `{component}-{state}-{viewport}.png`
- AND baselines locked to Chromium only (per existing testing-infrastructure spec)

#### Scenario: Visual test isolation via temporary Astro pages

- GIVEN each component needs isolated rendering
- WHEN visual tests execute
- THEN tests create temporary Astro pages at `tests/e2e/fixtures/{component}-visual.astro`
- AND each page imports and renders the component with specific props for the state
- AND pages disable animations via `data-test-animate="false"` attribute
- AND pages apply test-specific CSS to ensure consistent rendering

#### Scenario: CI integration for visual regression

- GIVEN a pull request opens
- WHEN GitHub Actions runs visual tests
- THEN tests execute in Chromium only (for speed)
- AND failures produce diff images as artifacts
- AND trace.zip attaches for debugging
- AND PR cannot merge until visual tests pass or baselines are intentionally updated

### Requirement: Test Data and Configuration

#### Test Data: Component State Props

Each component test shall use these prop configurations:

**FileDropzone:**
- Default: `{ accept: '.csv', maxSize: 1048576 }`
- Hover: `{ ...default, isDragActive: true }`
- Focus: `{ ...default, isFocused: true }`
- Error: `{ ...default, error: 'File must be CSV format' }`
- Loading: `{ ...default, isLoading: true }`
- Disabled: `{ ...default, disabled: true }`

**ImportPreviewTable:**
- Default: `{ data: sampleImportData, columns: importColumns }`
- Empty: `{ data: [], columns: importColumns }`
- Error: `{ data: sampleImportData, columns: importColumns, rowErrors: { 2: 'Invalid date' } }`
- Loading: `{ data: [], columns: importColumns, isLoading: true }`

**ImportHistoryTable:**
- Default: `{ data: sampleHistoryData, onPageChange: fn, onSort: fn }`
- Empty: `{ data: [], onPageChange: fn, onSort: fn }`
- Loading: `{ data: [], onPageChange: fn, onSort: fn, isLoading: true }`
- Pagination: `{ data: largeHistoryData, onPageChange: fn, onSort: fn, page: 2, pageSize: 10 }`

**ImportProgress:**
- Default: `{ progress: 0, status: 'pending', message: 'Ready to import' }`
- InProgress: `{ progress: 45, status: 'processing', message: 'Importing row 45 of 100' }`
- Success: `{ progress: 100, status: 'success', message: 'Import completed: 100 records' }`
- Error: `{ progress: 67, status: 'error', message: 'Failed at row 67: duplicate key' }`

**Progress:**
- Default: `{ value: 0, max: 100 }`
- Partial: `{ value: 50, max: 100 }`
- Complete: `{ value: 100, max: 100 }`
- Indeterminate: `{ value: null, max: 100 }`
- Error: `{ value: 30, max: 100, status: 'error' }`

#### Configuration: Playwright Visual Test Config

- GIVEN `playwright.config.ts`
- WHEN visual tests run
- THEN `projects` includes `chromium` for visual tests
- AND `snapshotDir` set to `tests/e2e/visual-snapshots`
- AND `snapshotPathTemplate` uses `{snapshotDir}/{arg}{ext}`
- AND `threshold` = 0.002 (0.2%)
- AND `animations` = 'disabled'
- AND `clip` captures full page for each component fixture

## Acceptance Criteria

1. **All 5 components** have visual tests covering 6 states × 2 viewports = 60 test cases minimum
2. **Baseline screenshots** committed and passing in CI
3. **Threshold** of 0.2% pixel difference enforced
4. **Animations disabled** during visual test execution
5. **Diff images** generated on failure for visual comparison
6. **CI pipeline** runs visual tests on every PR
7. **No flakiness** from dynamic content (timestamps, random IDs) - use deterministic test data

## Test Commands

```bash
# Run visual tests locally
npm run test:e2e -- --project=chromium

# Update baselines (after intentional UI changes)
npm run test:e2e -- --project=chromium --update-snapshots

# Run with UI for debugging
npm run test:e2e:ui -- --project=chromium
```

## Dependencies

- Existing Playwright visual test infrastructure (per testing-infrastructure spec)
- Chromium browser only for visual tests
- Baseline screenshots storage in repo (`tests/e2e/visual-snapshots/`)