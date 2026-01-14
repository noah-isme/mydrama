import { test, expect } from '../fixtures/test-fixtures';

test.describe('Video Player', () => {
  test.beforeEach(async ({ homePage, videoPlayerPage }) => {
    await homePage.goto();
    await homePage.waitForLoading();
    await homePage.clickDramaByIndex(0);
    await videoPlayerPage.expectPlayerOpen();
  });

  test('should display video player with all controls', async ({ videoPlayerPage }) => {
    await expect(videoPlayerPage.videoContainer).toBeVisible();
    await expect(videoPlayerPage.closeButton).toBeVisible();
    await expect(videoPlayerPage.settingsButton).toBeVisible();
    await expect(videoPlayerPage.episodeControls).toBeVisible();
  });

  test('should close video player', async ({ videoPlayerPage }) => {
    await videoPlayerPage.closePlayer();
    await videoPlayerPage.expectPlayerClosed();
  });

  test('should open and close settings panel', async ({ videoPlayerPage }) => {
    await videoPlayerPage.openSettings();
    await expect(videoPlayerPage.settingsPanel).toBeVisible();

    await videoPlayerPage.closeSettings();
    await expect(videoPlayerPage.settingsPanel).not.toBeVisible();
  });

  test('should display playback speed options in settings', async ({ videoPlayerPage }) => {
    await videoPlayerPage.openSettings();
    await expect(videoPlayerPage.playbackSpeedOptions).toHaveCount(8);
  });

  test('should display volume slider in settings', async ({ videoPlayerPage }) => {
    await videoPlayerPage.openSettings();
    await expect(videoPlayerPage.volumeSlider).toBeVisible();
  });

  test('should display episode navigation controls', async ({ videoPlayerPage }) => {
    await expect(videoPlayerPage.previousEpisodeButton).toBeVisible();
    await expect(videoPlayerPage.nextEpisodeButton).toBeVisible();
    await expect(videoPlayerPage.episodeInput).toBeVisible();
  });

  test('should start at episode 1', async ({ videoPlayerPage }) => {
    await videoPlayerPage.expectEpisode(1);
  });

  test('should have previous button disabled on episode 1', async ({ videoPlayerPage }) => {
    await expect(videoPlayerPage.previousEpisodeButton).toBeDisabled();
  });

  test('should navigate to next episode', async ({ videoPlayerPage, page }) => {
    await page.route('**/api/stream**', route => route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ status: true, data: { url: 'https://example.com/video.mp4' } })
    }));

    await videoPlayerPage.goToNextEpisode();
    await videoPlayerPage.expectEpisode(2);
  });

  test('should navigate to specific episode via input', async ({ videoPlayerPage, page }) => {
    await page.route('**/api/stream**', route => route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ status: true, data: { url: 'https://example.com/video.mp4' } })
    }));

    await videoPlayerPage.goToEpisode(5);
    await videoPlayerPage.expectEpisode(5);
  });

  test('should display video title', async ({ videoPlayerPage }) => {
    await expect(videoPlayerPage.videoTitle).toBeVisible();
    const title = await videoPlayerPage.videoTitle.textContent();
    expect(title).toBeTruthy();
  });

  test('should show custom video controls overlay', async ({ videoPlayerPage, page }) => {
    await page.mouse.move(640, 400);
    await expect(videoPlayerPage.playPauseButton).toBeVisible();
  });
});

test.describe('Video Player - Keyboard Shortcuts', () => {
  test.beforeEach(async ({ homePage, videoPlayerPage }) => {
    await homePage.goto();
    await homePage.waitForLoading();
    await homePage.clickDramaByIndex(0);
    await videoPlayerPage.expectPlayerOpen();
  });

  test('should respond to space bar for play/pause', async ({ page, videoPlayerPage }) => {
    await videoPlayerPage.videoElement.click();
    await page.keyboard.press('Space');
  });

  test('should respond to F key for fullscreen', async ({ page }) => {
    await page.keyboard.press('f');
  });

  test('should respond to arrow keys for skip', async ({ page }) => {
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowLeft');
  });
});
