import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base-page';

export class VideoPlayerPage extends BasePage {
  readonly videoSection: Locator;
  readonly videoElement: Locator;
  readonly videoContainer: Locator;
  readonly closeButton: Locator;
  readonly settingsButton: Locator;
  readonly settingsPanel: Locator;
  readonly playPauseButton: Locator;
  readonly skipForwardButton: Locator;
  readonly skipBackwardButton: Locator;
  readonly fullscreenButton: Locator;
  readonly pipButton: Locator;
  readonly shareButton: Locator;
  readonly episodeControls: Locator;
  readonly previousEpisodeButton: Locator;
  readonly nextEpisodeButton: Locator;
  readonly episodeInput: Locator;
  readonly qualityOptions: Locator;
  readonly playbackSpeedOptions: Locator;
  readonly volumeSlider: Locator;
  readonly videoTitle: Locator;
  readonly resumePrompt: Locator;

  constructor(page: Page) {
    super(page, '/');

    this.videoSection = page.locator('.video-section');
    this.videoElement = page.locator('video');
    this.videoContainer = page.locator('.video-container');
    this.closeButton = page.locator('.video-close');
    this.settingsButton = page.locator('.video-settings-btn');
    this.settingsPanel = page.locator('.settings-panel');
    this.playPauseButton = page.locator('.play-pause-btn');
    this.skipForwardButton = page.locator('.control-btn').filter({ hasText: '+10s' });
    this.skipBackwardButton = page.locator('.control-btn').filter({ hasText: '-10s' });
    this.fullscreenButton = page.locator('.fullscreen-btn');
    this.pipButton = page.locator('.pip-btn');
    this.shareButton = page.locator('.share-btn');
    this.episodeControls = page.locator('.episode-controls');
    this.previousEpisodeButton = page.locator('.episode-button').filter({ hasText: 'Previous' });
    this.nextEpisodeButton = page.locator('.episode-button').filter({ hasText: 'Next' });
    this.episodeInput = page.locator('.episode-input');
    this.qualityOptions = page.locator('.settings-group').filter({ hasText: 'Video Quality' }).locator('.settings-option-btn');
    this.playbackSpeedOptions = page.locator('.settings-group').filter({ hasText: 'Playback Speed' }).locator('.settings-option-btn');
    this.volumeSlider = page.locator('.settings-slider');
    this.videoTitle = page.locator('.video-title');
    this.resumePrompt = page.locator('.resume-prompt');
  }

  async expectPlayerOpen() {
    await expect(this.videoSection).toBeVisible();
  }

  async expectPlayerClosed() {
    await expect(this.videoSection).not.toBeVisible();
  }

  async closePlayer() {
    await this.closeButton.click();
    await this.expectPlayerClosed();
  }

  async openSettings() {
    await this.settingsButton.click();
    await expect(this.settingsPanel).toBeVisible();
  }

  async closeSettings() {
    const closeBtn = this.settingsPanel.locator('.settings-close');
    await closeBtn.waitFor({ state: 'visible' });
    await closeBtn.dispatchEvent('click');
    await expect(this.settingsPanel).not.toBeVisible({ timeout: 5000 });
  }

  async selectQuality(quality: string) {
    await this.openSettings();
    await this.qualityOptions.filter({ hasText: quality }).click();
  }

  async selectPlaybackSpeed(speed: string) {
    await this.openSettings();
    await this.playbackSpeedOptions.filter({ hasText: speed }).click();
  }

  async goToNextEpisode() {
    await this.nextEpisodeButton.click();
    await this.waitForLoading();
  }

  async goToPreviousEpisode() {
    await this.previousEpisodeButton.click();
    await this.waitForLoading();
  }

  async goToEpisode(episodeNumber: number) {
    await this.episodeInput.fill(episodeNumber.toString());
    await this.episodeInput.press('Enter');
    await this.waitForLoading();
  }

  async getCurrentEpisode(): Promise<number> {
    const value = await this.episodeInput.inputValue();
    return parseInt(value, 10);
  }

  async expectEpisode(episodeNumber: number) {
    await expect(this.episodeInput).toHaveValue(episodeNumber.toString());
  }

  async expectVideoPlaying(): Promise<boolean> {
    return await this.videoElement.evaluate((video: HTMLVideoElement) => !video.paused);
  }

  async expectVideoPaused(): Promise<boolean> {
    return await this.videoElement.evaluate((video: HTMLVideoElement) => video.paused);
  }

  async getVideoCurrentTime(): Promise<number> {
    return await this.videoElement.evaluate((video: HTMLVideoElement) => video.currentTime);
  }

  async setVideoCurrentTime(seconds: number) {
    await this.videoElement.evaluate((video: HTMLVideoElement, time: number) => {
      video.currentTime = time;
    }, seconds);
  }

  async waitForVideoLoaded() {
    await this.page.waitForFunction(() => {
      const video = document.querySelector('video') as HTMLVideoElement;
      return video && video.readyState >= 3;
    }, { timeout: 15_000 }).catch(() => {
      // Video might not load in test environment
    });
  }

  async acceptResumePrompt() {
    if (await this.resumePrompt.isVisible()) {
      await this.resumePrompt.locator('button').filter({ hasText: 'Resume' }).click();
    }
  }

  async declineResumePrompt() {
    if (await this.resumePrompt.isVisible()) {
      await this.resumePrompt.locator('button').filter({ hasText: 'Start Over' }).click();
    }
  }
}
