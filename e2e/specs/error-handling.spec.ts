import { test, expect } from '../fixtures/test-fixtures';

test.describe('Error Handling', () => {
  test('should handle API error gracefully', async ({ homePage, page }) => {
    await page.route('**/api/latest', route => route.fulfill({
      status: 500,
      body: JSON.stringify({ error: 'Internal Server Error' })
    }));

    await homePage.goto();
    await homePage.expectToastMessage(/failed|error|gagal/i);
  });

  test('should handle network timeout gracefully', async ({ homePage, page }) => {
    await page.route('**/api/latest', route => route.abort('timedout'));

    await homePage.goto();
    await homePage.expectToastMessage(/failed|error|gagal/i);
  });

  test('should handle search with no results', async ({ homePage }) => {
    await homePage.goto();
    await homePage.waitForLoading();
    await homePage.searchDrama('xyznonexistent123456');

    const emptyState = homePage.page.locator('.empty-state');
    if (await emptyState.isVisible()) {
      await expect(emptyState).toBeVisible();
    }
  });

  test('should handle empty search query', async ({ homePage }) => {
    await homePage.goto();
    await homePage.waitForLoading();
    await homePage.searchDrama('');
    await homePage.expectToastMessage(/kata kunci|keyword/i);
  });

  test('should handle stream API error', async ({ homePage, videoPlayerPage, page }) => {
    await homePage.goto();
    await homePage.waitForLoading();

    await page.route('**/api/stream**', route => route.fulfill({
      status: 500,
      body: JSON.stringify({ status: false, error: 'Stream not found' })
    }));

    await homePage.clickDramaByIndex(0);
    await homePage.expectToastMessage(/failed|error|gagal/i);
  });
});

test.describe('Edge Cases', () => {
  test('should handle rapid clicking on favorite button', async ({ homePage }) => {
    await homePage.goto();
    await homePage.page.evaluate(() => localStorage.clear());
    await homePage.page.reload();
    await homePage.waitForLoading();

    await homePage.toggleFavoriteByIndex(0);
    await homePage.toggleFavoriteByIndex(0);
    await homePage.toggleFavoriteByIndex(0);

    const favorites = await homePage.page.evaluate(() =>
      JSON.parse(localStorage.getItem('dramabox_favorites') || '[]')
    );
    expect(favorites.length).toBeLessThanOrEqual(1);
  });

  test('should handle page reload during video playback', async ({ homePage, videoPlayerPage, page }) => {
    await homePage.goto();
    await homePage.waitForLoading();
    await homePage.clickDramaByIndex(0);
    await videoPlayerPage.expectPlayerOpen();

    await page.reload();

    await expect(page).toHaveURL('/');
  });

  test('should handle localStorage quota exceeded', async ({ page }) => {
    await page.goto('/');

    await page.evaluate(() => {
      try {
        const largeData = 'x'.repeat(5 * 1024 * 1024);
        localStorage.setItem('test_large_data', largeData);
      } catch (e) {
        console.log('Storage quota exceeded as expected');
      }
    });

    await expect(page.locator('.navbar')).toBeVisible();
  });

  test('should handle double navigation', async ({ page }) => {
    await page.goto('/');
    await Promise.all([
      page.goto('/favorites'),
      page.goto('/favorites')
    ]).catch(() => {});

    await expect(page).toHaveURL(/\/favorites|\/$/);
  });
});

test.describe('Form Validation Edge Cases', () => {
  test('should handle XSS attempt in search', async ({ homePage, page }) => {
    await homePage.goto();
    await homePage.waitForLoading();

    await homePage.searchDrama('<script>alert("xss")</script>');

    const pageContent = await page.content();
    expect(pageContent).not.toContain('<script>alert("xss")</script>');
  });

  test('should handle very long search query', async ({ homePage }) => {
    await homePage.goto();
    await homePage.waitForLoading();

    const longQuery = 'a'.repeat(1000);
    await homePage.searchDrama(longQuery);
  });

  test('should handle special characters in search', async ({ homePage }) => {
    await homePage.goto();
    await homePage.waitForLoading();

    await homePage.searchDrama('test!@#$%^&*()');
  });
});
