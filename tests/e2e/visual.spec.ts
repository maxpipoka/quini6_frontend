import { test, expect } from '@playwright/test';
import { components, viewports } from './fixtures/visual-test-matrix';

const pages = [
  { path: '/', name: 'home' },
  { path: '/sorteos', name: 'sorteos' },
  { path: '/buscar', name: 'buscar' },
  { path: '/sorteos/3245', name: 'detalle-3245' },
];

function getViewportForProject(): typeof viewports[0] {
  const projectName = test.info().project.name;
  if (projectName === 'visual') {
    return viewports.find(v => v.name === 'desktop')!;
  }
  if (projectName === 'visual-mobile') {
    return viewports.find(v => v.name === 'mobile')!;
  }
  throw new Error(`Unknown visual project: ${projectName}`);
}

test.describe('Visual Regression - Pages', () => {
  for (const page of pages) {
    test(`${page.name}`, async ({ page: pageObj }) => {
      const viewport = getViewportForProject();
      await pageObj.setViewportSize({ width: viewport.width, height: viewport.height });
      await pageObj.goto(page.path);

      // Wait for network idle with longer timeout
      await pageObj.waitForLoadState('networkidle', { timeout: 60000 });
      // Additional wait for animations/transitions to settle
      await pageObj.waitForTimeout(1000);

      // Take screenshot and compare with baseline
      await expect(pageObj).toHaveScreenshot(`${page.name}-${viewport.name}.png`, {
        fullPage: true,
        animations: 'disabled',
        threshold: 0.015,
      });
    });
  }
});

test.describe('Visual Regression - Admin Components', () => {
  for (const component of components) {
    for (const state of component.states) {
      test(`${component.name} - ${state}`, async ({ page }) => {
        const viewport = getViewportForProject();
        await page.setViewportSize({ width: viewport.width, height: viewport.height });

        // Navigate to the temporary Astro fixture page
        const fixturePath = `/test-fixtures/${component.name}-visual?state=${state}`;
        await page.goto(fixturePath);

        // Wait for network idle to ensure all assets loaded
        await page.waitForLoadState('networkidle', { timeout: 60000 });
        // Additional wait for animations/transitions to settle
        await page.waitForTimeout(1000);

        // Take screenshot and compare with baseline
        await expect(page).toHaveScreenshot(`${component.name}-${state}-${viewport.name}.png`, {
          fullPage: true,
          animations: 'disabled',
          threshold: 0.01,
        });
      });
    }
  }
});
