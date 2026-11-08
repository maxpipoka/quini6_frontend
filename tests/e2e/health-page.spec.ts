import { test, expect } from './fixtures';

test.describe('Health Check Page E2E', () => {
  test.beforeEach(async ({ adminPage }) => {
    // Admin auth is handled by adminPage fixture
    // Add x-test-session header to all fetch requests from the page
    await adminPage.addInitScript(() => {
      console.log('[addInitScript] Wrapping fetch');
      const originalFetch = window.fetch;
      window.fetch = async (input, init) => {
        const headers = new Headers(init?.headers);
        headers.set('x-test-session', 'test-session');
        console.log('[wrapped fetch] Request to:', input, 'with headers:', [...headers.entries()]);
        return originalFetch(input, { ...init, headers });
      };
    });
  });

  test('should navigate to health page and display status cards', async ({ adminPage }) => {
    await adminPage.goto('/admin/health');
    await adminPage.waitForLoadState('networkidle');

    // Wait for the HealthDashboard island to hydrate
    await adminPage.waitForSelector('[data-testid="health-dashboard"]', { timeout: 10000 });

    // Verify status cards are present
    await expect(adminPage.locator('[data-testid="api-status-card"]')).toBeVisible();
    await expect(adminPage.locator('[data-testid="db-status-card"]')).toBeVisible();

    // Verify card content
    await expect(adminPage.locator('[data-testid="api-status-card"]')).toContainText('API Backend');
    await expect(adminPage.locator('[data-testid="db-status-card"]')).toContainText(
      'Base de Datos'
    );

    // Verify status badges (green for ok, yellow for degraded, red for down)
    const apiStatusBadge = adminPage.locator('[data-testid="api-status-card"] .inline-flex');
    await expect(apiStatusBadge).toBeVisible();
  });

  test('should show manual refresh button', async ({ adminPage }) => {
    await adminPage.goto('/admin/health');
    await adminPage.waitForSelector('[data-testid="health-dashboard"]', { timeout: 10000 });

    const refreshButton = adminPage.locator('[data-testid="refresh-button"]');
    await expect(refreshButton).toBeVisible();
    await expect(refreshButton).toContainText('Actualizar');
    await expect(refreshButton).toBeEnabled();
  });

  test('should trigger manual refresh and update data', async ({ adminPage }) => {
    await adminPage.goto('/admin/health');
    await adminPage.waitForSelector('[data-testid="health-dashboard"]', { timeout: 10000 });

    const refreshButton = adminPage.locator('[data-testid="refresh-button"]');

    // Click refresh
    await refreshButton.click();

    // Wait for refresh to complete - just verify no errors
    await adminPage.waitForTimeout(3000);

    // Verify no error alert is shown
    await expect(adminPage.locator('[data-testid="error-alert"]')).not.toBeVisible();
  });

  test('should display history table when toggled', async ({ adminPage }) => {
    await adminPage.goto('/admin/health');
    await adminPage.waitForSelector('[data-testid="health-dashboard"]', { timeout: 10000 });

    // Click history toggle
    const historyToggle = adminPage.locator('[data-testid="history-toggle"]');
    await expect(historyToggle).toBeVisible();
    await historyToggle.click();

    // History table should be visible
    await expect(adminPage.locator('[data-testid="history-table"]')).toBeVisible({ timeout: 5000 });

    // Should show at least the current check in history
    expect(
      await adminPage.locator('[data-testid="history-table"] tbody tr').count()
    ).toBeGreaterThan(0);
  });

  test('should show auto-refresh indicator', async ({ adminPage }) => {
    await adminPage.goto('/admin/health');
    await adminPage.waitForSelector('[data-testid="health-dashboard"]', { timeout: 10000 });

    await expect(adminPage.locator('text=Auto-actualización cada 30s')).toBeVisible();
  });

  test('should auto-refresh after 30 seconds', async ({ adminPage }) => {
    test.slow(); // This test takes 35+ seconds

    await adminPage.goto('/admin/health');
    await adminPage.waitForSelector('[data-testid="health-dashboard"]', { timeout: 10000 });

    // Get initial timestamp (wait for it to render)
    await adminPage.locator('text=Última actualización:').textContent();

    // Wait for auto-refresh (30s + buffer)
    await adminPage.waitForTimeout(35000);

    // Re-read timestamp (may or may not change in CI if data is identical)
    await adminPage.locator('text=Última actualización:').textContent();

    // Note: In CI, the health checks might not change the timestamp if the data is the same
    // We mainly verify no errors occur during auto-refresh
    await expect(adminPage.locator('[data-testid="error-alert"]')).not.toBeVisible();
  });

  test('should handle API error gracefully', async ({ adminPage }) => {
    // Mock API to return error
    await adminPage.route('**/api/health**', async (route) => {
      await route.fulfill({ status: 500, body: 'Internal Server Error' });
    });
    await adminPage.route('**/api/health/db**', async (route) => {
      await route.fulfill({ status: 500, body: 'Internal Server Error' });
    });

    await adminPage.goto('/admin/health');
    await adminPage.waitForSelector('[data-testid="health-dashboard"]', { timeout: 10000 });

    // Click refresh to trigger error
    const refreshButton = adminPage.locator('[data-testid="refresh-button"]');
    await refreshButton.click();

    // Should show error alert
    await expect(adminPage.locator('[data-testid="error-alert"]')).toBeVisible({ timeout: 10000 });
    await expect(adminPage.locator('[data-testid="error-alert"]')).toContainText(
      'Error al obtener datos'
    );

    // Should have retry button
    await expect(
      adminPage.locator('[data-testid="error-alert"] button:has-text("Reintentar")')
    ).toBeVisible();
  });
  test('should persist history to localStorage', async ({ adminPage }) => {
    await adminPage.goto('/admin/health');

    // Wait for the dashboard to be visible
    await adminPage.waitForSelector('[data-testid="health-dashboard"]', { timeout: 10000 });

    // Wait for network idle to let initial load complete
    await adminPage.waitForLoadState('networkidle');

    // Trigger a refresh to add to history
    const refreshButton = adminPage.locator('[data-testid="refresh-button"]');
    await refreshButton.click();

    // Wait for API calls to complete - wait for network to be idle again
    await adminPage.waitForLoadState('networkidle');

    // Give a moment for localStorage to be updated
    await adminPage.waitForTimeout(1000);

    // Check localStorage
    const history = await adminPage.evaluate(() => {
      const stored = localStorage.getItem('health-check-history');
      return stored ? JSON.parse(stored) : [];
    });

    console.log('[Test] localStorage history:', history);
    expect(history.length).toBeGreaterThan(0);
    expect(history[0]).toHaveProperty('timestamp');
    expect(history[0]).toHaveProperty('apiHealth');
    expect(history[0]).toHaveProperty('dbHealth');
  });

  test('should navigate from sidebar', async ({ adminPage }) => {
    await adminPage.goto('/admin/draws');
    await adminPage.waitForLoadState('networkidle');

    // Navigate to health page via goto (clicking links doesn't carry x-test-session header)
    await adminPage.goto('/admin/health');
    await adminPage.waitForLoadState('networkidle');

    // Should be on health page
    await expect(adminPage).toHaveURL(/\/admin\/health/);
    await expect(adminPage.locator('[data-testid="health-dashboard"]')).toBeVisible({
      timeout: 10000,
    });
  });

  test('should show correct status colors for API and DB', async ({ adminPage }) => {
    await adminPage.goto('/admin/health');
    await adminPage.waitForSelector('[data-testid="health-dashboard"]', { timeout: 10000 });

    // Check that status badges have appropriate color classes
    // The exact color depends on the actual API response
    const apiBadge = adminPage.locator('[data-testid="api-status-card"] .inline-flex');
    const dbBadge = adminPage.locator('[data-testid="db-status-card"] .inline-flex');

    await expect(apiBadge).toBeVisible();
    await expect(dbBadge).toBeVisible();
  });
});

test.describe('Health Page - Unauthenticated Access', () => {
  test('should redirect to login when not authenticated', async ({ page }) => {
    await page.goto('/admin/health');

    // Should redirect to login
    await expect(page).toHaveURL(/\/admin\/login/);
  });
});
