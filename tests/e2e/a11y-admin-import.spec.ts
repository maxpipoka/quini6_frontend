import { test, expect } from '@playwright/test';
import { runA11yCheck, assertNoA11yViolations } from './a11y-setup';

const componentFixtures = [
  { path: '/test-fixtures/FileDropzone-visual?state=default', name: 'FileDropzone - default' },
  { path: '/test-fixtures/FileDropzone-visual?state=disabled', name: 'FileDropzone - disabled' },
  { path: '/test-fixtures/ImportPreviewTable-visual?state=default', name: 'ImportPreviewTable - default' },
  { path: '/test-fixtures/ImportPreviewTable-visual?state=empty', name: 'ImportPreviewTable - empty' },
  { path: '/test-fixtures/ImportHistoryTable-visual?state=default', name: 'ImportHistoryTable - default' },
  { path: '/test-fixtures/ImportHistoryTable-visual?state=empty', name: 'ImportHistoryTable - empty' },
  { path: '/test-fixtures/ImportHistoryTable-visual?state=loading', name: 'ImportHistoryTable - loading' },
  { path: '/test-fixtures/ImportHistoryTable-visual?state=pagination', name: 'ImportHistoryTable - pagination' },
  { path: '/test-fixtures/ImportProgress-visual?state=default', name: 'ImportProgress - default' },
  { path: '/test-fixtures/ImportProgress-visual?state=inProgress', name: 'ImportProgress - inProgress' },
  { path: '/test-fixtures/ImportProgress-visual?state=success', name: 'ImportProgress - success' },
  { path: '/test-fixtures/ImportProgress-visual?state=error', name: 'ImportProgress - error' },
  { path: '/test-fixtures/Progress-visual?state=default', name: 'Progress - default' },
  { path: '/test-fixtures/Progress-visual?state=partial', name: 'Progress - partial' },
  { path: '/test-fixtures/Progress-visual?state=complete', name: 'Progress - complete' },
  { path: '/test-fixtures/Progress-visual?state=indeterminate', name: 'Progress - indeterminate' },
  { path: '/test-fixtures/Progress-visual?state=error', name: 'Progress - error' },
];

test.describe('Accessibility Audit - Admin Import Components', () => {
  for (const fixture of componentFixtures) {
    test(`${fixture.name}`, async ({ page }) => {
      await page.goto(fixture.path);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(500);

      const accessibilityScanResults = await runA11yCheck(page);

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  }
});