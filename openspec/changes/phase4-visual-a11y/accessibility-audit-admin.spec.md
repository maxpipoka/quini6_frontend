# Accessibility Audit Admin Specification

## Purpose

This specification defines automated and manual accessibility validation for the admin bulk import workflow components. It combines Storybook a11y addon, Playwright + axe-core E2E tests, and manual verification checklists to ensure WCAG 2.1 AA compliance.

## Capability

**New Capability**: `accessibility-audit-admin`

## Requirements

### Requirement: Storybook Accessibility Addon Integration

The system SHALL configure Storybook with the a11y addon for all 5 admin components with automated axe-core checks.

#### Scenario: Storybook a11y addon configured and enabled

- GIVEN `.storybook/main.ts` configuration
- WHEN Storybook starts with `npm run storybook`
- THEN `@storybook/addon-a11y` is registered in addons
- AND `a11y` parameter enabled globally
- AND Accessibility panel appears in Storybook UI for all stories

#### Scenario: All 5 admin components have stories with a11y checks

- GIVEN story files for each component
- WHEN viewing stories in Storybook
- THEN stories exist for:
  - `FileDropzone` - all 6 states (default, hover, focus, error, loading, disabled)
  - `ImportPreviewTable` - all 4 states (default, empty, error, loading)
  - `ImportHistoryTable` - all 4 states (default, empty, loading, pagination)
  - `ImportProgress` - all 4 states (default, inProgress, success, error)
  - `Progress` - all 5 states (default, partial, complete, indeterminate, error)
- AND each story renders without a11y violations in Accessibility panel
- AND violations (if any) link to specific WCAG criteria (WCAG 2.1 AA)

#### Scenario: Story controls test interactive states for a11y

- GIVEN a component story with interactive controls
- WHEN toggling props via Controls panel (e.g., `disabled`, `error`, `isLoading`)
- THEN Accessibility panel re-runs axe checks automatically
- AND focus management validated for state changes
- AND ARIA attributes update correctly

### Requirement: Playwright + axe-core E2E Accessibility Tests

The system SHALL run automated accessibility tests for the complete admin import flow using Playwright and @axe-core/playwright.

#### Scenario: E2E a11y tests cover critical admin import flow

- GIVEN Playwright test file `tests/e2e/a11y-admin-import.spec.ts`
- WHEN running `npm run test:e2e -- --project=chromium`
- THEN tests execute for this flow:
  1. Navigate to admin import page
  2. FileDropzone - drag/drop CSV file
  3. PreviewTable - verify table semantics, headers, sorting
  4. ImportProgress - verify ARIA live region announcements
  5. HistoryTable - verify pagination keyboard navigation
- AND `@axe-core/playwright` injects axe into each page
- AND `axeBuilder()` analyzes full page or component scope
- AND violations fail the test with detailed report

#### Scenario: axe-core configuration for admin context

- GIVEN axe-core configuration in test setup
- WHEN a11y tests run
- THEN ruleset includes: `wcag2aa`, `wcag21aa`, `best-practice`
- AND these rules are **disabled** (known false positives in admin):
  - `region` (admin pages may have landmark issues)
  - `landmark-one-main` (admin layout differs from public)
- AND these rules are **enabled** with strict checking:
  - `color-contrast` (minimum 4.5:1)
  - `keyboard` (focus visible, tab order)
  - `aria-required-attr` (required ARIA attributes present)
  - `aria-valid-attr-value` (ARIA values valid)
  - `label` (form inputs have labels)

#### Scenario: CI integration for automated a11y tests

- GIVEN a pull request opens
- WHEN GitHub Actions runs E2E tests
- THEN a11y tests run in Chromium
- AND violations block PR merge
- AND detailed axe report attaches as artifact
- AND report includes: violation type, WCAG criterion, element selector, fix suggestion

### Requirement: Manual Verification Checklist

The system SHALL provide a structured manual verification checklist for keyboard navigation and screen reader flows that cannot be fully automated.

#### Scenario: Keyboard navigation verification

- GIVEN the admin import page loaded in browser
- WHEN tester presses Tab repeatedly
- THEN focus order follows logical visual order:
  1. FileDropzone drop zone / file input
  2. FileDropzone "Browse" button
  3. PreviewTable column headers (sortable)
  4. PreviewTable row actions (if any)
  5. ImportProgress "Start Import" button
  6. ImportProgress cancel/close (if applicable)
  7. HistoryTable pagination controls
  8. HistoryTable column headers
  9. HistoryTable row actions
- AND focus indicator visible (3px solid outline, 2px offset, #005fcc)
- AND no focus traps except Modal (which traps correctly)
- AND Shift+Tab reverses order correctly

#### Scenario: Screen reader announcement verification

- GIVEN NVDA (Windows) or VoiceOver (macOS) running
- WHEN tester performs these actions:
  - Drop file on FileDropzone → announces "File selected, [filename]. Ready to import."
  - Click "Start Import" → announces "Import started. Processing row 1 of 100."
  - Progress updates → announces "Progress 45 percent. Importing row 45 of 100."
  - Import completes → announces "Import completed successfully. 100 records imported."
  - Import fails → announces "Import failed at row 67. Duplicate key error."
  - Navigate HistoryTable pagination → announces "Page 2 of 5. 10 items per page."
- THEN all dynamic updates use ARIA live regions (`aria-live="polite"` or `assertive`)
- AND ImportProgress uses `role="status"` with `aria-live="polite"`
- AND error states use `role="alert"` with `aria-live="assertive"`

#### Scenario: Color contrast verification

- GIVEN the admin import page in light and dark mode
- WHEN testing with axe DevTools or Colour Contrast Analyser
- THEN all text meets 4.5:1 contrast ratio (WCAG AA)
- AND large text (18px+ or 14px+ bold) meets 3:1
- AND UI components (borders, focus indicators) meet 3:1
- AND error states (red text on background) meet 4.5:1
- AND disabled states meet 3:1 (per WCAG 2.1)

#### Scenario: ARIA and semantic HTML verification

- GIVEN component inspection in browser DevTools
- WHEN verifying each component:
  - **FileDropzone**: `role="region"`, `aria-label="File upload"`, input has `aria-describedby` for error
  - **ImportPreviewTable**: `<table>` with `<thead>`, `<th scope="col">`, `<tbody>`, sortable headers have `aria-sort`
  - **ImportHistoryTable**: same as PreviewTable + pagination `nav[aria-label="Pagination"]`, buttons have `aria-label="Page X"`
  - **ImportProgress**: `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-live="polite"`
  - **Progress**: `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-label` for context
- THEN all ARIA attributes valid and present
- AND no redundant ARIA (e.g., `role="button"` on `<button>`)

## Acceptance Criteria

1. **Storybook a11y panel** shows zero violations for all 5 component stories across all states
2. **Playwright + axe E2E tests** pass for complete admin import flow
3. **Manual checklist** completed and signed off:
   - Keyboard tab order logical and complete
   - Focus indicators visible and consistent
   - Screen reader announcements accurate for all dynamic updates
   - Color contrast ≥ 4.5:1 for text, ≥ 3:1 for UI components
   - ARIA attributes valid and semantic HTML used
4. **CI pipeline** runs automated a11y tests on every PR
5. **Zero critical/high violations** in automated tests
6. **Documented suppressions** for any known false positives with justification

## Test Data and Configuration

### Sample Import Data for Testing

```typescript
// tests/e2e/fixtures/import-test-data.ts
export const sampleImportData = [
  { drawDate: '2024-01-15', numbers: '05,12,23,34,41,45', reintegro: '7', complementario: '3' },
  { drawDate: '2024-01-22', numbers: '02,18,29,31,38,44', reintegro: '4', complementario: '9' },
  // ... 10 rows for pagination testing
];

export const sampleHistoryData = [
  { id: 1, filename: 'draws-jan.csv', status: 'completed', records: 10, date: '2024-01-20' },
  { id: 2, filename: 'draws-feb.csv', status: 'failed', records: 5, date: '2024-02-15', error: 'Duplicate draw date' },
  // ... 25 rows for pagination testing
];

export const importColumns = [
  { key: 'drawDate', header: 'Draw Date', sortable: true },
  { key: 'numbers', header: 'Numbers', sortable: false },
  { key: 'reintegro', header: 'Reintegro', sortable: true },
  { key: 'complementario', header: 'Complementario', sortable: true },
];
```

### Axe Configuration

```typescript
// tests/e2e/a11y-setup.ts
import { AxeBuilder } from '@axe-core/playwright';

export async function runA11yCheck(page: Page, context?: string) {
  const builder = new AxeBuilder({ page })
    .withTags(['wcag2aa', 'wcag21aa', 'best-practice'])
    .disableRules(['region', 'landmark-one-main']);
  
  if (context) {
    builder.include(context);
  }
  
  const results = await builder.analyze();
  return results;
}
```

## Test Commands

```bash
# Run Storybook with a11y panel
npm run storybook

# Run E2E accessibility tests
npm run test:e2e -- --project=chromium --grep a11y

# Run all E2E tests including a11y
npm run test:e2e -- --project=chromium

# Build Storybook static for Chromatic/CI
npm run build-storybook
```

## Dependencies

- `@storybook/addon-a11y` (per testing-infrastructure spec)
- `@axe-core/playwright` npm package
- Existing Playwright E2E infrastructure (per testing-infrastructure spec)
- Chromium browser for automated tests
- NVDA/VoiceOver for manual verification
- Colour Contrast Analyser or axe DevTools for contrast verification