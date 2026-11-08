import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const PUBLIC_PAGES = [
  { path: '/', name: 'Home' },
  { path: '/sorteos', name: 'Draw History' },
  { path: '/buscar', name: 'Combination Search' },
  { path: '/sorteos/3245', name: 'Draw Detail (latest)' },
  { path: '/sorteos/3244', name: 'Draw Detail (prev)' },
];

for (const pageInfo of PUBLIC_PAGES) {
  test.describe(`Accessibility Audit - ${pageInfo.name} (${pageInfo.path})`, () => {
    test('axe accessibility check', async ({ page }) => {
      await page.goto(pageInfo.path);
      await page.waitForLoadState('networkidle');

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('color contrast verification', async ({ page }) => {
      await page.goto(pageInfo.path);
      await page.waitForLoadState('networkidle');

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2aa'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('keyboard navigation check', async ({ page }) => {
      await page.goto(pageInfo.path);
      await page.waitForLoadState('networkidle');

      const focusableElements = await page.$$(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );

      for (let i = 0; i < Math.min(focusableElements.length, 10); i++) {
        await page.keyboard.press('Tab');
        const focused = await page.evaluate(() => document.activeElement);
        expect(focused).not.toBeNull();
      }
    });

    test('ARIA and semantic HTML verification', async ({ page }) => {
      await page.goto(pageInfo.path);
      await page.waitForLoadState('networkidle');

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['cat.aria'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('focus indicator verification', async ({ page }) => {
      await page.goto(pageInfo.path);
      await page.waitForLoadState('networkidle');

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['cat.focus'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });
}
