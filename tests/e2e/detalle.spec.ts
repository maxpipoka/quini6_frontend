import { test, expect } from '@playwright/test';

test.describe('Detalle Sorteo Page', () => {
  test('renders the draw header and modalities', async ({ page }) => {
    await page.goto('/sorteos/3245');
    await expect(page.locator('main h1')).toContainText('Sorteo Nº 3245');
    await expect(page.locator('[role="img"][aria-label^="Tradicional:"]')).toBeVisible();
    await expect(page.locator('[role="img"][aria-label^="La Segunda:"]')).toBeVisible();
    await expect(page.locator('[role="img"][aria-label^="Revancha:"]')).toBeVisible();
    await expect(page.locator('[role="img"][aria-label^="Siempre Sale:"]')).toBeVisible();
  });

  test('shows exactly four modality blocks', async ({ page }) => {
    await page.goto('/sorteos/3245');
    await expect(page.locator('main article')).toHaveCount(4);
  });

  test('prev/next navigation works for a middle draw', async ({ page }) => {
    await page.goto('/sorteos/3244');
    await expect(page.getByRole('link', { name: /Sorteo anterior/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /Sorteo siguiente/ })).toBeVisible();
  });

  test('unknown draw returns 404', async ({ page }) => {
    const response = await page.goto('/sorteos/999999');
    expect(response?.status()).toBe(404);
    await expect(page.locator('main h1')).toContainText('Página no encontrada');
  });

  test('mobile responsive', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/sorteos/3245');
    await expect(page.locator('main h1')).toBeVisible();
    await expect(page.locator('[role="img"][aria-label^="Tradicional:"]')).toBeVisible();
  });
});
