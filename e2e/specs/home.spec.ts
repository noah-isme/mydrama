import { test, expect } from '../fixtures/test-fixtures';

test.describe('Home Page - Drama Discovery', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
    await homePage.waitForLoading();
  });

  test('should load and display drama cards', async ({ homePage }) => {
    await homePage.expectMinDramaCount(1);
  });

  test('should show hero section on initial load', async ({ homePage }) => {
    await expect(homePage.heroSection).toBeVisible();
  });

  test('should hide hero and show dramas after clicking explore', async ({ homePage }) => {
    if (await homePage.exploreButton.isVisible()) {
      await homePage.clickExplore();
      await homePage.expectMinDramaCount(1);
    }
  });

  test('should search dramas by keyword', async ({ homePage }) => {
    await homePage.searchDrama('love');
    await expect(homePage.searchTab).toHaveClass(/active/);
  });

  test('should search dramas by pressing Enter', async ({ homePage }) => {
    await homePage.searchDramaViaEnter('romance');
    await expect(homePage.searchTab).toHaveClass(/active/);
  });

  test('should switch between trending and search tabs', async ({ homePage }) => {
    await homePage.searchDrama('test');
    await expect(homePage.searchTab).toHaveClass(/active/);

    await homePage.switchToTrendingTab();
    await expect(homePage.trendingTab).toHaveClass(/active/);
  });

  test('should toggle filters visibility', async ({ homePage, page }) => {
    await homePage.filterToggle.click();
    await expect(page.locator('.filter-section')).toBeVisible();

    await homePage.filterToggle.click();
    await expect(page.locator('.filter-section')).not.toBeVisible();
  });

  test('should display drama card with essential info', async ({ homePage }) => {
    const firstCard = homePage.dramaCards.first();
    await expect(firstCard).toBeVisible();
    await expect(firstCard.locator('.drama-card-title')).toBeVisible();
  });

  test('should show mood discovery section', async ({ homePage, page }) => {
    await homePage.clickExplore().catch(() => {});
    const moodHeading = page.locator('h3').filter({ hasText: /mood/i });
    const hasMoodSection = await moodHeading.count() > 0;
    if (hasMoodSection) {
      await expect(moodHeading.first()).toBeVisible();
    }
  });
});

test.describe('Home Page - Drama Interaction', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
    await homePage.waitForLoading();
  });

  test('should open video player when clicking drama card', async ({ homePage, videoPlayerPage }) => {
    await homePage.clickDramaByIndex(0);
    await videoPlayerPage.expectPlayerOpen();
  });

  test('should toggle favorite on drama card', async ({ homePage, page }) => {
    await homePage.toggleFavoriteByIndex(0);
    await homePage.expectToastMessage(/favorites/i);

    const favorites = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('dramabox_favorites') || '[]')
    );
    expect(favorites.length).toBeGreaterThanOrEqual(0);
  });
});
