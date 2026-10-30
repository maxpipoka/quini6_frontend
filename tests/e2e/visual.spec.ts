import { test, expect } from '@playwright/test';
import { components, viewports } from './fixtures/visual-test-matrix';

const pages = [
  { path: '/', name: 'home' },
  { path: '/sorteos', name: 'sorteos' },
  { path: '/buscar', name: 'buscar' },
  { path: '/sorteos/3245', name: 'detalle-3245' },
];

test.describe('Visual Regression - Pages', () => {
  for (const page of pages) {
    for (const viewport of viewports) {
      test(`${page.name} - ${viewport.name}`, async ({ page: pageObj }) => {
        await pageObj.setViewportSize({ width: viewport.width, height: viewport.height });
        await pageObj.goto(page.path);

        // Wait for network idle with longer timeout
        await pageObj.waitForLoadState('networkidle', { timeout: 60000 });

        // Take screenshot and compare with baseline
        await expect(pageObj).toHaveScreenshot(`${page.name}-${viewport.name}.png`, {
          fullPage: true,
          animations: 'disabled',
        });
      });
    }
  }
});

test.describe('Visual Regression - Admin Components', () => {
  for (const component of components) {
    for (const state of component.states) {
      for (const viewport of viewports) {
        test(`${component.name} - ${state} - ${viewport.name}`, async ({ page }) => {
          await page.setViewportSize({ width: viewport.width, height: viewport.height });

          // Navigate to the temporary Astro fixture page
          const fixturePath = `/test-fixtures/${component.name}-visual?state=${state}`;
          await page.goto(fixturePath);

          // Wait for component to hydrate - use domcontentloaded only
          await page.waitForLoadState('domcontentloaded');
          // Wait a bit for React hydration
          await page.waitForTimeout(500);

          // Take screenshot and compare with baseline
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
