import { test, expect } from '@playwright/test';

test.use({ baseURL: 'http://localhost:4323' });

test.describe('Plausible Analytics Script Loading', () => {
  test.describe('Admin pages (/admin/*)', () => {
    test('should include Plausible script on admin login page', async ({ page }) => {
      await page.goto('/admin/login');
      await page.waitForLoadState('networkidle');

      // Wait for the dynamically added script
      await expect(page.locator('script[data-domain]')).toHaveAttribute('data-domain', 'quini6.example.com', { timeout: 10000 });
      await expect(page.locator('script[data-domain]')).toHaveAttribute('src', 'https://plausible.io/js/script.js');
    });

    test('should include Plausible script on admin draws page', async ({ page }) => {
      // We need to login first - mock auth
      await page.goto('/admin/draws');
      await page.waitForLoadState('networkidle');

      await expect(page.locator('script[data-domain]')).toHaveAttribute('data-domain', 'quini6.example.com', { timeout: 10000 });
    });

    test('should include Plausible script on admin health page', async ({ page }) => {
      await page.goto('/admin/health');
      await page.waitForLoadState('networkidle');

      await expect(page.locator('script[data-domain]')).toHaveAttribute('data-domain', 'quini6.example.com', { timeout: 10000 });
    });

    test('should include Plausible script on admin imports page', async ({ page }) => {
      await page.goto('/admin/imports/upload');
      await page.waitForLoadState('networkidle');

      await expect(page.locator('script[data-domain]')).toHaveAttribute('data-domain', 'quini6.example.com', { timeout: 10000 });
    });

    test('should include Plausible script on admin change-password page', async ({ page }) => {
      await page.goto('/admin/change-password');
      await page.waitForLoadState('networkidle');

      await expect(page.locator('script[data-domain]')).toHaveAttribute('data-domain', 'quini6.example.com', { timeout: 10000 });
    });
  });

  test.describe('Public pages (no Plausible)', () => {
    test('should NOT include Plausible script on home page', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      await expect(page.locator('script[data-domain]')).toHaveCount(0);
    });

    test('should NOT include Plausible script on /buscar page', async ({ page }) => {
      await page.goto('/buscar');
      await page.waitForLoadState('networkidle');

      await expect(page.locator('script[data-domain]')).toHaveCount(0);
    });

    test('should NOT include Plausible script on /sorteos page', async ({ page }) => {
      await page.goto('/sorteos');
      await page.waitForLoadState('networkidle');

      await expect(page.locator('script[data-domain]')).toHaveCount(0);
    });

    test('should NOT include Plausible script on draw detail page', async ({ page }) => {
      await page.goto('/sorteos/3245');
      await page.waitForLoadState('networkidle');

      await expect(page.locator('script[data-domain]')).toHaveCount(0);
    });
  });

  test.describe('Script attributes', () => {
    test('Plausible script should have defer attribute', async ({ page }) => {
      await page.goto('/admin/login');
      await page.waitForLoadState('networkidle');

      await expect(page.locator('script[data-domain]')).toHaveAttribute('defer', '', { timeout: 10000 });
    });

    test('Plausible script should be in document head', async ({ page }) => {
      await page.goto('/admin/login');
      await page.waitForLoadState('networkidle');

      await expect(page.locator('head script[data-domain]')).toHaveCount(1, { timeout: 10000 });
    });
  });

  test.describe('Environment variable control', () => {
    test('should NOT load Plausible when VITE_PLAUSIBLE_DOMAIN is not set', () => {
      // This test would need a separate build without the env var
      // For now we verify the logic exists in the code
      test.skip(true, 'Requires separate build without VITE_PLAUSIBLE_DOMAIN');
    });
  });
});
