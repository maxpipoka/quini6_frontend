import { test, expect } from '@playwright/test';

test.describe('404 Page', () => {
  test('displays for invalid routes', async ({ page }) => {
    await page.goto('/invalid-route');
    await expect(page.locator('main h1')).toContainText('Página no encontrada');
    await expect(page.locator('text=404')).toBeVisible();
  });

  test('returns 404 status', async ({ page }) => {
    const response = await page.goto('/invalid-route');
    expect(response?.status()).toBe(404);
  });

  test('has link back to home', async ({ page }) => {
    await page.goto('/invalid-route');
    const homeLink = page.getByRole('link', { name: 'Volver al inicio' });
    await expect(homeLink).toBeVisible();
    await expect(homeLink).toHaveAttribute('href', '/');
  });

  test('displays for invalid sorteo', async ({ page }) => {
    const response = await page.goto('/sorteos/999999');
    expect(response?.status()).toBe(404);
  });

  test('displays for invalid API route', async ({ page }) => {
    const response = await page.goto('/api/invalid');
    expect(response?.status()).toBe(404);
  });
});
