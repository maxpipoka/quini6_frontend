import { test, expect } from '@playwright/test';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, '..', '..', '..');
const projectRoot = __dirname;

test.describe('Plausible Analytics Script Loading', () => {
  test.describe('Admin pages (/admin/*) - requires dev server running', () => {
    test('should include Plausible script on admin login page', async ({ page }) => {
      await page.goto('/admin/login');
      await page.waitForLoadState('networkidle');

      // Wait for the dynamically added script
      await expect(page.locator('script[data-domain]')).toHaveAttribute(
        'data-domain',
        'quini6.example.com',
        { timeout: 10000 }
      );
      await expect(page.locator('script[data-domain]')).toHaveAttribute(
        'src',
        'https://plausible.io/js/script.js'
      );
    });

    test('should include Plausible script on admin draws page', async ({ page }) => {
      await page.goto('/admin/draws');
      await page.waitForLoadState('networkidle');

      await expect(page.locator('script[data-domain]')).toHaveAttribute(
        'data-domain',
        'quini6.example.com',
        { timeout: 10000 }
      );
    });

    test('should include Plausible script on admin health page', async ({ page }) => {
      await page.goto('/admin/health');
      await page.waitForLoadState('networkidle');

      await expect(page.locator('script[data-domain]')).toHaveAttribute(
        'data-domain',
        'quini6.example.com',
        { timeout: 10000 }
      );
    });

    test('should include Plausible script on admin imports page', async ({ page }) => {
      await page.goto('/admin/imports/upload');
      await page.waitForLoadState('networkidle');

      await expect(page.locator('script[data-domain]')).toHaveAttribute(
        'data-domain',
        'quini6.example.com',
        { timeout: 10000 }
      );
    });

    test('should include Plausible script on admin change-password page', async ({ page }) => {
      await page.goto('/admin/change-password');
      await page.waitForLoadState('networkidle');

      await expect(page.locator('script[data-domain]')).toHaveAttribute(
        'data-domain',
        'quini6.example.com',
        { timeout: 10000 }
      );
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

      await expect(page.locator('script[data-domain]')).toHaveAttribute('defer', '', {
        timeout: 10000,
      });
    });

    test('Plausible script should be in document', async ({ page }) => {
      await page.goto('/admin/login');
      await page.waitForLoadState('networkidle');

      await expect(page.locator('script[data-domain]')).toHaveCount(1, { timeout: 10000 });
    });
  });

  test.describe('Environment variable control (unit-level verification)', () => {
    test('should have VITE_PLAUSIBLE_DOMAIN in env.example', () => {
      const envExamplePath = join(projectRoot, '.env.example');
      expect(existsSync(envExamplePath)).toBe(true);

      const content = readFileSync(envExamplePath, 'utf-8');
      expect(content).toContain('VITE_PLAUSIBLE_DOMAIN');
    });

    test('admin layout conditionally adds Plausible script', () => {
      // Verify the admin layout has the conditional logic
      const adminLayoutPath = join(projectRoot, 'src/pages/admin/layout.astro');
      const content = readFileSync(adminLayoutPath, 'utf-8');

      // Check for conditional Plausible script
      expect(content).toContain('plausibleDomain');
      expect(content).toContain('plausible.io/js/script.js');
      expect(content).toContain('data-domain');
    });
  });
});
