import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base-page';

export class HomePage extends BasePage {
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly dramaGrid: Locator;
  readonly dramaCards: Locator;
  readonly trendingTab: Locator;
  readonly searchTab: Locator;
  readonly filterToggle: Locator;
  readonly refreshButton: Locator;
  readonly heroSection: Locator;
  readonly exploreButton: Locator;
  readonly continueWatchingSection: Locator;
  readonly moodDiscovery: Locator;

  constructor(page: Page) {
    super(page, '/');

    this.searchInput = page.locator('.search-box .search-input');
    this.searchButton = page.locator('.search-box .search-button');
    this.dramaGrid = page.locator('.drama-grid');
    this.dramaCards = page.locator('.drama-card');
    this.trendingTab = page.locator('.tab').filter({ hasText: 'Trending' });
    this.searchTab = page.locator('.tab').filter({ hasText: 'Search' });
    this.filterToggle = page.locator('button').filter({ hasText: /Filters/ });
    this.refreshButton = page.locator('button').filter({ hasText: 'Refresh' });
    this.heroSection = page.locator('.hero-section, [class*="hero"]').first();
    this.exploreButton = page.getByRole('button', { name: /explore/i });
    this.continueWatchingSection = page.locator('.section').filter({ hasText: 'Continue Watching' });
    this.moodDiscovery = page.locator('section').filter({ has: page.locator('h3:has-text("mood")') }).first();
  }

  async searchDrama(keyword: string) {
    await this.searchInput.fill(keyword);
    await this.searchButton.click();
    await this.waitForLoading();
  }

  async searchDramaViaEnter(keyword: string) {
    await this.searchInput.fill(keyword);
    await this.searchInput.press('Enter');
    await this.waitForLoading();
  }

  getDramaCard(title: string): Locator {
    return this.dramaCards.filter({ hasText: title });
  }

  getDramaCardByIndex(index: number): Locator {
    return this.dramaCards.nth(index);
  }

  async clickDrama(title: string) {
    await this.getDramaCard(title).click();
  }

  async clickDramaByIndex(index: number) {
    await this.getDramaCardByIndex(index).click();
  }

  async toggleFavorite(dramaTitle: string) {
    const card = this.getDramaCard(dramaTitle);
    await card.locator('.drama-card-favorite').click();
  }

  async toggleFavoriteByIndex(index: number) {
    const card = this.getDramaCardByIndex(index);
    await card.locator('.drama-card-favorite').click();
  }

  async expectDramaVisible(title: string) {
    await expect(this.getDramaCard(title)).toBeVisible();
  }

  async expectDramaCount(count: number) {
    await expect(this.dramaCards).toHaveCount(count);
  }

  async expectMinDramaCount(minCount: number) {
    const count = await this.dramaCards.count();
    expect(count).toBeGreaterThanOrEqual(minCount);
  }

  async switchToTrendingTab() {
    await this.trendingTab.click();
    await this.waitForLoading();
  }

  async switchToSearchTab() {
    await this.searchTab.click();
  }

  async selectMood(mood: string) {
    await this.moodDiscovery.getByRole('button', { name: new RegExp(mood, 'i') }).click();
    await this.waitForLoading();
  }

  async clickExplore() {
    await this.exploreButton.click();
    await this.waitForLoading();
  }

  async getFirstDramaInfo(): Promise<{ title: string; bookId: string }> {
    const firstCard = this.dramaCards.first();
    const title = await firstCard.locator('.drama-card-title').textContent() || '';
    const bookId = await firstCard.getAttribute('data-book-id') || '';
    return { title: title.trim(), bookId };
  }
}
