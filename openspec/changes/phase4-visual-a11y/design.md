# Technical Design: Phase 4 Visual Regression & Accessibility Audit

## Overview

This design extends the existing Playwright visual testing infrastructure and Storybook setup to cover 5 new admin components with component-level visual regression tests and comprehensive accessibility validation.

---

## 1. Visual Regression Testing Design

### 1.1 Architecture Approach

**Strategy**: Extend existing `tests/e2e/visual.spec.ts` pattern with component-level tests using temporary Astro fixture pages.

**Why this approach**:
- Reuses existing Playwright visual test infrastructure (no new test runner)
- Component isolation via Astro pages ensures consistent rendering
- Follows existing pattern: page-level visual tests → component-level visual tests
- Chromium-only execution for visual tests (per existing spec)

### 1.2 Component Test Matrix

| Component | States | Viewports | Test Cases |
|-----------|--------|-----------|------------|
| FileDropzone | 6 (default, hover, focus, error, loading, disabled) | 2 (desktop, mobile) | 12 |
| ImportPreviewTable | 4 (default, empty, error, loading) | 2 | 8 |
| ImportHistoryTable | 4 (default, empty, loading, pagination) | 2 | 8 |
| ImportProgress | 4 (default, inProgress, success, error) | 2 | 8 |
| Progress | 5 (default, partial, complete, indeterminate, error) | 2 | 10 |
| **Total** | | | **46** |

### 1.3 Temporary Astro Fixture Pages

**Location**: `tests/e2e/fixtures/{component}-visual.astro`

**Pattern**:
```astro
---
// tests/e2e/fixtures/FileDropzone-visual.astro
import FileDropzone from '@/components/ui/FileDropzone';
import { sampleProps } from '../fixtures/visual-test-data';

const { state, viewport } = Astro.props;
const props = sampleProps.FileDropzone[state];
---

<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Visual Test: FileDropzone - {state}</title>
    <style>
      /* Disable animations for consistent screenshots */
      [data-test-animate="false"],
      [data-test-animate="false"] *,
      [data-test-animate="false"] *::before,
      [data-test-animate="false"] *::after {
        animation-duration: 0s !important;
        transition-duration: 0s !important;
      }
    </style>
  </head>
  <body data-test-animate="false" class="min-h-screen p-8 bg-neutral-50 dark:bg-neutral-900">
    <FileDropzone {...props} client:load />
  </body>
</html>
```

**Key decisions**:
- Each fixture page accepts `state` and `viewport` as props
- `data-test-animate="false"` disables CSS animations/transitions
- Consistent padding and background for component isolation
- Uses `client:load` for interactive components (FileDropzone, Progress)

### 1.4 Test Data Fixtures

**Location**: `tests/e2e/fixtures/visual-test-data.ts`

```typescript
export const sampleProps = {
  FileDropzone: {
    default: { accept: '.csv', maxSize: 1048576 },
    hover: { accept: '.csv', maxSize: 1048576, isDragActive: true },
    focus: { accept: '.csv', maxSize: 1048576, isFocused: true },
    error: { accept: '.csv', maxSize: 1048576, error: 'File must be CSV format' },
    loading: { accept: '.csv', maxSize: 1048576, isLoading: true },
    disabled: { accept: '.csv', maxSize: 1048576, disabled: true },
  },
  ImportPreviewTable: {
    default: { data: sampleImportData, columns: importColumns },
    empty: { data: [], columns: importColumns },
    error: { data: sampleImportData, columns: importColumns, rowErrors: { 2: 'Invalid date' } },
    loading: { data: [], columns: importColumns, isLoading: true },
  },
  // ... similar for other components
};
```

**Deterministic data**: All test data uses fixed values (no timestamps, random IDs, or dynamic content).

### 1.5 Extended Visual Spec

**File**: `tests/e2e/visual.spec.ts` (extended)

```typescript
import { test, expect } from '@playwright/test';
import { components, viewports } from './fixtures/visual-test-matrix';

test.describe('Visual Regression - Admin Components', () => {
  for (const component of components) {
    for (const state of component.states) {
      for (const viewport of viewports) {
        test(`${component.name} - ${state} - ${viewport.name}`, async ({ page }) => {
          await page.setViewportSize({ width: viewport.width, height: viewport.height });
          await page.goto(`/test-fixtures/${component.name}-visual.astro?state=${state}`);
          await page.waitForLoadState('networkidle');
          
          await expect(page).toHaveScreenshot(`${component.name}-${state}-${viewport.name}.png`, {
            fullPage: true,
            animations: 'disabled',
            threshold: 0.002,
          });
        });
      }
    }
  }
});
```

### 1.6 Playwright Config Updates

**File**: `playwright.config.ts` - Add visual projects:

```typescript
projects: [
  // Existing projects...
  {
    name: 'chromium',
    use: { ...devices['Desktop Chrome'] },
  },
  // Visual regression projects (Chromium only)
  {
    name: 'visual',
    use: { 
      ...devices['Desktop Chrome'],
      viewport: { width: 1280, height: 720 },
    },
    testMatch: '**/visual.spec.ts',
  },
  {
    name: 'visual-mobile',
    use: { 
      ...devices['iPhone 14'],
      viewport: { width: 375, height: 667 },
    },
    testMatch: '**/visual.spec.ts',
  },
  // A11y project
  {
    name: 'a11y',
    use: { ...devices['Desktop Chrome'] },
    testMatch: '**/a11y-admin-import.spec.ts',
  },
],
snapshotDir: './tests/e2e/visual-snapshots',
snapshotPathTemplate: '{snapshotDir}/{arg}{ext}',
```

---

## 2. Storybook Stories Design

### 2.1 Story Structure

**Location**: `stories/{ComponentName}.stories.tsx`

**Pattern** (for each component):
```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { FileDropzone } from '@/components/ui/FileDropzone';
import { sampleProps } from '../tests/e2e/fixtures/visual-test-data';

const meta: Meta<typeof FileDropzone> = {
  title: 'Admin/FileDropzone',
  component: FileDropzone,
  parameters: {
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'label', enabled: true },
          { id: 'aria-required-attr', enabled: true },
        ],
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    error: { control: 'text' },
    isLoading: { control: 'boolean' },
    isDragActive: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof FileDropzone>;

export const Default: Story = { args: sampleProps.FileDropzone.default };
export const Hover: Story = { args: sampleProps.FileDropzone.hover };
export const Focus: Story = { args: sampleProps.FileDropzone.focus };
export const Error: Story = { args: sampleProps.FileDropzone.error };
export const Loading: Story = { args: sampleProps.FileDropzone.loading };
export const Disabled: Story = { args: sampleProps.FileDropzone.disabled };
```

**Story count per component**:
- FileDropzone: 6 stories
- ImportPreviewTable: 4 stories
- ImportHistoryTable: 4 stories
- ImportProgress: 4 stories
- Progress: 5 stories
- **Total: 23 stories**

### 2.2 Storybook Config Updates

**File**: `.storybook/main.ts` - Already has a11y addon ✓

**File**: `.storybook/preview.tsx` - Extend a11y config:

```tsx
const preview: Preview = {
  parameters: {
    // ... existing config
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'label', enabled: true },
          { id: 'aria-required-attr', enabled: true },
          { id: 'aria-valid-attr-value', enabled: true },
          { id: 'keyboard', enabled: true },
        ],
      },
    },
  },
  // ... existing decorators, globalTypes
};
```

---

## 3. Playwright + axe-core E2E Accessibility Tests

### 3.1 Test File Structure

**Location**: `tests/e2e/a11y-admin-import.spec.ts`

**Shared setup**: `tests/e2e/a11y-setup.ts`

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

export function assertNoA11yViolations(results: AxeResults) {
  const violations = results.violations.filter(v => 
    v.impact === 'critical' || v.impact === 'serious' || v.impact === 'moderate'
  );
  
  if (violations.length > 0) {
    const details = violations.map(v => 
      `${v.id} (${v.impact}): ${v.description}\n  WCAG: ${v.tags.join(', ')}\n  Elements: ${v.nodes.map(n => n.target).join(', ')}`
    ).join('\n\n');
    throw new Error(`Accessibility violations found:\n${details}`);
  }
}
```

### 3.2 Admin Import Flow Test

```typescript
// tests/e2e/a11y-admin-import.spec.ts
import { test, expect } from '@playwright/test';
import { runA11yCheck, assertNoA11yViolations } from './a11y-setup';

test.describe('Admin Import Flow - Accessibility', () => {
  test('complete import flow has no a11y violations', async ({ page }) => {
    // 1. Navigate to admin import page
    await page.goto('/admin/imports/upload');
    await page.waitForLoadState('networkidle');
    
    let results = await runA11yCheck(page);
    assertNoA11yViolations(results);
    
    // 2. FileDropzone - upload CSV
    await page.setInputFiles('input[type="file"]', 'tests/fixtures/sample-draws.csv');
    await page.waitForSelector('[data-testid="file-dropzone"] [aria-live="polite"]');
    
    results = await runA11yCheck(page);
    assertNoA11yViolations(results);
    
    // 3. PreviewTable - verify table semantics
    await expect(page.locator('table[role="grid"]')).toBeVisible();
    await page.keyboard.press('Tab'); // Navigate to sortable headers
    
    results = await runA11yCheck(page);
    assertNoA11yViolations(results);
    
    // 4. Start import - ImportProgress ARIA live
    await page.click('button:has-text("Iniciar importación")');
    await expect(page.locator('[role="status"][aria-live="polite"]')).toBeVisible();
    
    results = await runA11yCheck(page);
    assertNoA11yViolations(results);
    
    // 5. HistoryTable - pagination keyboard nav
    await page.goto('/admin/imports/history');
    await page.waitForLoadState('networkidle');
    await page.keyboard.press('Tab'); // Navigate to pagination
    
    results = await runA11yCheck(page);
    assertNoA11yViolations(results);
  });
});
```

### 3.3 Axe Configuration

**Rulesets enabled**:
- `wcag2aa` - WCAG 2.0 AA
- `wcag21aa` - WCAG 2.1 AA
- `best-practice` - Best practices

**Rules disabled** (known false positives in admin):
- `region` - Admin pages may have landmark issues
- `landmark-one-main` - Admin layout differs from public

**Strict rules** (must pass):
- `color-contrast` - Minimum 4.5:1
- `keyboard` - Focus visible, tab order
- `aria-required-attr` - Required ARIA attributes
- `aria-valid-attr-value` - Valid ARIA values
- `label` - Form inputs have labels

---

## 4. CI Integration Design

### 4.1 New NPM Scripts

**File**: `package.json` - Add scripts:

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:visual": "playwright test --project=visual --project=visual-mobile",
    "test:a11y": "playwright test --project=a11y --grep a11y",
    "test:visual:update": "playwright test --project=visual --project=visual-mobile --update-snapshots",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
  }
}
```

### 4.2 New Dependencies

```json
{
  "devDependencies": {
    "@axe-core/playwright": "^4.8.0"
  }
}
```

### 4.3 GitHub Actions Workflow Updates

**File**: `.github/workflows/ci.yml` - Add visual/a11y steps:

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run typecheck
        run: npm run typecheck
      
      - name: Run lint
        run: npm run lint
      
      - name: Run unit tests
        run: npm run test:coverage
      
      - name: Build
        run: npm run build
      
      - name: Install Playwright
        run: npx playwright install --with-deps chromium
      
      - name: Start dev server
        run: npm run dev --background
      
      - name: Run E2E tests (includes visual + a11y)
        run: npm run test:e2e -- --project=chromium
        env:
          VISUAL: '1'
      
      - name: Upload Playwright traces
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-traces
          path: test-results/
      
      - name: Upload visual diff images
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: visual-diffs
          path: tests/e2e/visual-snapshots/**/*.diff.png
      
      - name: Upload axe reports
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: a11y-reports
          path: test-results/a11y-*.json
      
      - name: Lighthouse CI
        if: github.event_name == 'pull_request' && github.base_ref == 'main'
        run: npm run lighthouse
```

---

## 5. File Structure Summary

```
openspec/changes/phase4-visual-a11y/
├── design.md (this file)

tests/
├── e2e/
│   ├── visual.spec.ts                    # Extended with component tests
│   ├── a11y-admin-import.spec.ts         # NEW: axe-core E2E tests
│   ├── a11y-setup.ts                     # NEW: shared axe configuration
│   ├── fixtures/
│   │   ├── visual-test-data.ts           # NEW: deterministic test props
│   │   ├── visual-test-matrix.ts         # NEW: component/state/viewport matrix
│   │   ├── FileDropzone-visual.astro     # NEW: Astro fixture page
│   │   ├── ImportPreviewTable-visual.astro
│   │   ├── ImportHistoryTable-visual.astro
│   │   ├── ImportProgress-visual.astro
│   │   ├── Progress-visual.astro
│   │   └── sample-draws.csv              # NEW: test CSV file
│   └── visual-snapshots/                 # Baseline screenshots (committed)

.storybook/
├── main.ts                               # Existing: a11y addon enabled
└── preview.tsx                           # Extended: a11y rules config

stories/
├── FileDropzone.stories.tsx              # NEW: 6 state variants
├── ImportPreviewTable.stories.tsx        # NEW: 4 state variants
├── ImportHistoryTable.stories.tsx        # NEW: 4 state variants
├── ImportProgress.stories.tsx            # NEW: 4 state variants
└── Progress.stories.tsx                  # NEW: 5 state variants

playwright.config.ts                      # Modified: visual/a11y projects

package.json                              # Modified: new scripts, @axe-core/playwright

.github/workflows/ci.yml                  # Modified: visual/a11y CI steps
```

---

## 6. Key Technical Decisions

| Decision | Rationale |
|----------|-----------|
| Temporary Astro pages for visual tests | Isolates components, uses existing Astro dev server, consistent rendering |
| Chromium-only for visual/a11y tests | Consistent baselines, faster CI, per existing spec |
| 0.2% pixel threshold | Matches existing visual spec requirement |
| Deterministic test data | Prevents flakiness from timestamps/random IDs |
| `@axe-core/playwright` for E2E a11y | Industry standard, integrates with Playwright |
| Storybook a11y addon for component-level | Interactive testing with Controls panel, immediate feedback |
| Disable `region` and `landmark-one-main` rules | Known false positives in admin layout context |
| `data-test-animate="false"` for animation disable | More reliable than CSS-only approaches |

---

## 7. Rollback Plan

1. Revert `tests/e2e/visual.spec.ts` to previous version
2. Delete `tests/e2e/a11y-admin-import.spec.ts` and `tests/e2e/a11y-setup.ts`
3. Delete `tests/e2e/fixtures/*-visual.astro` and `visual-test-*.ts`
4. Revert `playwright.config.ts` to remove visual/a11y projects
5. Revert `.storybook/preview.tsx` a11y config extensions
6. Delete 5 story files in `stories/`
7. Revert `package.json` scripts and `@axe-core/playwright` dependency
8. Revert `.github/workflows/ci.yml` visual/a11y steps

---

## 8. Acceptance Criteria Mapping

| Spec Requirement | Design Implementation |
|------------------|----------------------|
| 46 visual test cases | Component matrix × states × viewports in visual.spec.ts |
| Baseline screenshots committed | `tests/e2e/visual-snapshots/` with naming convention |
| 0.2% threshold | `threshold: 0.002` in visual.spec.ts and playwright.config.ts |
| Animations disabled | `animations: 'disabled'` + `data-test-animate="false"` |
| Diff images on failure | CI uploads `*.diff.png` artifacts |
| CI runs on PR | GitHub Actions workflow with visual/a11y steps |
| Zero a11y violations in Storybook | Extended a11y config in preview.tsx |
| Playwright + axe E2E passes | a11y-admin-import.spec.ts with assertNoA11yViolations |
| Manual checklist documented | Acceptance criteria in design + spec references |
| NPM scripts execute | test:visual, test:a11y, test:visual:update in package.json |