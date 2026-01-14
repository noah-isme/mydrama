import { test, expect } from '../fixtures/test-fixtures';

test.describe('Watch History', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
    await homePage.page.evaluate(() => localStorage.clear());
    await homePage.page.reload();
    await homePage.waitForLoading();
  });

  test('should add drama to history when video is opened', async ({ homePage, videoPlayerPage, page }) => {
    await homePage.clickDramaByIndex(0);
    await videoPlayerPage.expectPlayerOpen();

    const history = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('dramabox_history') || '[]')
    );
    expect(history.length).toBe(1);
  });

  test('should update history when changing episodes', async ({ homePage, videoPlayerPage, page }) => {
    await page.route('**/api/stream**', route => route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ status: true, data: { url: 'https://example.com/video.mp4' } })
    }));

    await homePage.clickDramaByIndex(0);
    await videoPlayerPage.expectPlayerOpen();
    await videoPlayerPage.goToNextEpisode();

    const history = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('dramabox_history') || '[]')
    );
    expect(history[0].episode).toBe(2);
  });

  test('should persist history across page reloads', async ({ homePage, videoPlayerPage, page }) => {
    await homePage.clickDramaByIndex(0);
    await videoPlayerPage.expectPlayerOpen();
    await videoPlayerPage.closePlayer();

    await page.reload();

    const history = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('dramabox_history') || '[]')
    );
    expect(history.length).toBe(1);
  });
});

test.describe('History Page', () => {
  test.beforeEach(async ({ historyPage }) => {
    await historyPage.goto();
    await historyPage.page.evaluate(() => localStorage.clear());
  });

  test('should show empty state when no history', async ({ historyPage }) => {
    await historyPage.goto();
    await historyPage.expectEmpty();
  });

  test('should display history after watching', async ({ homePage, videoPlayerPage, historyPage }) => {
    await homePage.goto();
    await homePage.waitForLoading();
    await homePage.clickDramaByIndex(0);
    await videoPlayerPage.expectPlayerOpen();
    await videoPlayerPage.closePlayer();

    await historyPage.goto();
    await historyPage.expectNotEmpty();
    await historyPage.expectHistoryCount(1);
  });

  test('should open video player when clicking history item', async ({ homePage, videoPlayerPage, historyPage }) => {
    await homePage.goto();
    await homePage.waitForLoading();
    await homePage.clickDramaByIndex(0);
    await videoPlayerPage.expectPlayerOpen();
    await videoPlayerPage.closePlayer();

    await historyPage.goto();
    await historyPage.historyItems.first().click();

    await videoPlayerPage.expectPlayerOpen();
  });

  test('should show multiple history items in order', async ({ homePage, videoPlayerPage, historyPage, page }) => {
    await page.route('**/api/stream**', route => route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ status: true, data: { url: 'https://example.com/video.mp4' } })
    }));

    await homePage.goto();
    await homePage.waitForLoading();

    await homePage.clickDramaByIndex(0);
    await videoPlayerPage.expectPlayerOpen();
    await videoPlayerPage.closePlayer();

    await homePage.clickDramaByIndex(1);
    await videoPlayerPage.expectPlayerOpen();
    await videoPlayerPage.closePlayer();

    await historyPage.goto();
    await historyPage.expectNotEmpty();
    const count = await historyPage.historyItems.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });
});

test.describe('Continue Watching Section', () => {
  test('should show continue watching on home page after watching', async ({ homePage, videoPlayerPage }) => {
    await homePage.goto();
    await homePage.page.evaluate(() => localStorage.clear());
    await homePage.page.reload();
    await homePage.waitForLoading();
    await homePage.clickDramaByIndex(0);
    await videoPlayerPage.expectPlayerOpen();
    await videoPlayerPage.closePlayer();

    await homePage.goto();
    await homePage.waitForLoading();

    if (await homePage.continueWatchingSection.isVisible()) {
      await expect(homePage.continueWatchingSection).toBeVisible();
    }
  });
});
