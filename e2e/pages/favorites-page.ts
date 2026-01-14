import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base-page';

export class FavoritesPage extends BasePage {
  readonly pageTitle: Locator;
  readonly favoritesGrid: Locator;
  readonly favoriteCards: Locator;
  readonly emptyState: Locator;
  readonly clearAllButton: Locator;

  constructor(page: Page) {
    super(page, '/favorites');

    this.pageTitle = page.locator('h1, h2').filter({ hasText: /favorites/i });
    this.favoritesGrid = page.locator('.drama-grid, .favorites-grid');
    this.favoriteCards = page.locator('.drama-card');
    this.emptyState = page.locator('.empty-state');
    this.clearAllButton = page.getByRole('button', { name: /clear all/i });
  }

  async expectEmpty() {
    await expect(this.emptyState).toBeVisible();
  }

  async expectNotEmpty() {
    await expect(this.favoriteCards.first()).toBeVisible();
  }

  async expectFavoriteCount(count: number) {
    await expect(this.favoriteCards).toHaveCount(count);
  }

  async expectFavoriteVisible(title: string) {
    await expect(this.favoriteCards.filter({ hasText: title })).toBeVisible();
  }

  async removeFavorite(title: string) {
    const card = this.favoriteCards.filter({ hasText: title });
    await card.locator('.drama-card-favorite').click();
  }

  async clickFavorite(title: string) {
    await this.favoriteCards.filter({ hasText: title }).click();
  }

  async clearAll() {
    if (await this.clearAllButton.isVisible()) {
      await this.clearAllButton.click();
    }
  }
}
