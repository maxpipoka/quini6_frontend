import { test, expect } from '@playwright/test';

test.describe('Sorteos Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/sorteos');
  });

  test('loads the history heading', async ({ page }) => {
    await expect(page.locator('main h1')).toContainText('Historial de sorteos');
  });

  test('shows the draws table with the latest draw', async ({ page }) => {
    await expect(page.locator('table tbody tr')).toHaveCount(20);
    await expect(page.locator('table tbody tr').first()).toContainText('3245');
  });

  test('pagination is shown when there are multiple pages', async ({ page }) => {
    await expect(
      page.getByRole('navigation', { name: 'Paginación del historial de sorteos' })
    ).toBeVisible();
  });

  test('pagination navigates to the next page', async ({ page }) => {
    await page.getByRole('link', { name: 'Página siguiente' }).click();
    await expect(page).toHaveURL(/page=2/);
    await expect(page.locator('main h1')).toContainText('Historial de sorteos');
  });

  test('year filter navigates with the year param', async ({ page }) => {
    await page.getByLabel('Seleccionar año').selectOption('2024');
    await expect(page).toHaveURL(/year=2024/);
    await expect(page.locator('table tbody tr').first()).toBeVisible();
  });

  test('clicking a drawer link navigates to the detail page', async ({ page }) => {
    await page
      .getByRole('link', { name: /Ver resultados/ })
      .first()
      .click();
    await expect(page).toHaveURL(/\/sorteos\/\d+/);
    await expect(page.locator('main h1')).toContainText('Sorteo');
  });

  test('mobile card layout renders draw cards', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const cards = page.locator('article[data-row-index]');
    await expect(cards.first()).toBeVisible();
  });
});
