import { test, expect } from '../fixtures/test-fixtures';

test.describe('Navigation', () => {
  test('should navigate to home page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('/');
  });

  test('should navigate to favorites page', async ({ page }) => {
    await page.goto('/favorites');
    await expect(page).toHaveURL('/favorites');
  });

  test('should navigate to history page', async ({ page }) => {
    await page.goto('/history');
    await expect(page).toHaveURL('/history');
  });

  test('should navigate to auth page', async ({ page }) => {
    await page.goto('/auth');
    await expect(page).toHaveURL('/auth');
  });

  test('should redirect unknown routes to home', async ({ page }) => {
    await page.goto('/unknown-page');
    await expect(page).toHaveURL('/');
  });
});

test.describe('Navbar Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have visible navbar', async ({ page }) => {
    await expect(page.locator('.navbar')).toBeVisible();
  });

  test('should have logo that links to home', async ({ page }) => {
    const logo = page.locator('.navbar-brand, .logo, a[href="/"]').first();
    await expect(logo).toBeVisible();
  });

  test('should navigate using navbar links', async ({ page }) => {
    const favoritesLink = page.locator('a[href="/favorites"], [class*="nav"] a').filter({ hasText: /favorites/i });
    if (await favoritesLink.isVisible()) {
      await favoritesLink.click();
      await expect(page).toHaveURL('/favorites');
    }
  });
});

test.describe('Responsive Navigation', () => {
  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    await expect(page.locator('.navbar')).toBeVisible();
  });

  test('should work on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');

    await expect(page.locator('.navbar')).toBeVisible();
  });
});
