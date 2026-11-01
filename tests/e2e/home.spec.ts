import { test, expect } from '@playwright/test';

async function openMobileMenu(page) {
  const menuToggle = page.locator('#mobile-menu-toggle');
  const mobileMenu = page.locator('#mobile-menu');
  
  // Check if mobile menu button is visible (mobile viewport)
  const isMobile = await menuToggle.isVisible();
  if (isMobile) {
    await menuToggle.click();
    // Wait for menu to open - check that links are visible
    await expect(mobileMenu.locator('a[href="/sorteos"]')).toBeVisible();
  }
  return isMobile;
}

test.describe('Home Page', () => {
  test('loads with the site title and main heading', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Quini 6/);
    await expect(page.locator('main h1')).toContainText('Quini 6');
  });

  test('shows the latest draw', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Último sorteo', { exact: true })).toBeVisible();
    await expect(page.getByText('Sorteo Nº 3245', { exact: true }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /Buscar mi combinación/ })).toBeVisible();
  });

  test('navigation to sorteos works', async ({ page }) => {
    await page.goto('/');
    
    const isMobile = await openMobileMenu(page);
    
    if (isMobile) {
      // On mobile, click from mobile menu
      await page.locator('#mobile-menu a[href="/sorteos"]').click();
    } else {
      // On desktop, click from header nav
      await page.locator('header nav a[href="/sorteos"]').first().click();
    }
    
    await expect(page).toHaveURL(/\/sorteos$/);
    await expect(page.locator('main h1')).toContainText('Historial de sorteos');
  });

  test('navigation to buscar works', async ({ page }) => {
    await page.goto('/');
    
    const isMobile = await openMobileMenu(page);
    
    if (isMobile) {
      // On mobile, click from mobile menu
      await page.locator('#mobile-menu a[href="/buscar"]').click();
    } else {
      // On desktop, click from header nav
      await page.locator('header nav a[href="/buscar"]').first().click();
    }
    
    await expect(page).toHaveURL(/\/buscar$/);
    await expect(page.locator('main h1')).toContainText('Buscar combinación');
  });

  test('has a single main landmark', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('main')).toHaveCount(1);
  });
});
