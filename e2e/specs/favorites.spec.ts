import { test, expect } from '../fixtures/test-fixtures';

test.describe('Favorites', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
    await homePage.page.evaluate(() => localStorage.clear());
    await homePage.page.reload();
    await homePage.waitForLoading();
  });

  test('should add drama to favorites', async ({ homePage, page }) => {
    await homePage.toggleFavoriteByIndex(0);

    const favorites = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('dramabox_favorites') || '[]')
    );
    expect(favorites.length).toBe(1);
  });

  test('should remove drama from favorites', async ({ homePage, page }) => {
    await homePage.toggleFavoriteByIndex(0);
    await homePage.toggleFavoriteByIndex(0);

    const favorites = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('dramabox_favorites') || '[]')
    );
    expect(favorites.length).toBe(0);
  });

  test('should show success message when adding favorite', async ({ homePage }) => {
    await homePage.toggleFavoriteByIndex(0);
    await homePage.expectToastMessage(/favorites/i, 'success');
  });

  test('should persist favorites across page reloads', async ({ homePage, page }) => {
    await homePage.toggleFavoriteByIndex(0);
    await page.reload();
    await homePage.waitForLoading();

    const favorites = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('dramabox_favorites') || '[]')
    );
    expect(favorites.length).toBe(1);
  });
});

test.describe('Favorites Page', () => {
  test.beforeEach(async ({ favoritesPage }) => {
    await favoritesPage.goto();
    await favoritesPage.page.evaluate(() => localStorage.clear());
  });

  test('should show empty state when no favorites', async ({ favoritesPage }) => {
    await favoritesPage.goto();
    await favoritesPage.expectEmpty();
  });

  test('should display favorites after adding', async ({ homePage, favoritesPage, page }) => {
    await homePage.goto();
    await homePage.waitForLoading();
    await homePage.toggleFavoriteByIndex(0);

    await favoritesPage.goto();
    await favoritesPage.expectNotEmpty();
    await favoritesPage.expectFavoriteCount(1);
  });

  test('should remove favorite from favorites page', async ({ homePage, favoritesPage, page }) => {
    await homePage.goto();
    await homePage.waitForLoading();
    await homePage.toggleFavoriteByIndex(0);

    await favoritesPage.goto();
    await favoritesPage.expectFavoriteCount(1);

    const firstCard = page.locator('.drama-card').first();
    await firstCard.locator('.drama-card-favorite').click();

    await favoritesPage.expectEmpty();
  });

  test('should open video player when clicking favorite', async ({ homePage, favoritesPage, videoPlayerPage }) => {
    await homePage.goto();
    await homePage.waitForLoading();
    await homePage.toggleFavoriteByIndex(0);

    await favoritesPage.goto();
    await favoritesPage.favoriteCards.first().click();

    await videoPlayerPage.expectPlayerOpen();
  });
});
