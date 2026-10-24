import { test, expect } from '@playwright/test';

const pages = [
  { path: '/', name: 'home' },
  { path: '/sorteos', name: 'sorteos' },
  { path: '/buscar', name: 'buscar' },
  { path: '/sorteos/3245', name: 'detalle-3245' },
];

const viewports = [
  { name: 'desktop', width: 1280, height: 720 },
  { name: 'mobile', width: 375, height: 667 },
];

test.describe('Visual Regression', () => {
  for (const page of pages) {
    for (const viewport of viewports) {
      test(`${page.name} - ${viewport.name}`, async ({ page: pageObj }) => {
        await pageObj.setViewportSize({ width: viewport.width, height: viewport.height });
        await pageObj.goto(page.path);

        // Wait for network idle
        await pageObj.waitForLoadState('networkidle');

        // Take screenshot and compare with baseline
        await expect(pageObj).toHaveScreenshot(`${page.name}-${viewport.name}.png`, {
          fullPage: true,
          animations: 'disabled',
        });
      });
    }
  }
});
