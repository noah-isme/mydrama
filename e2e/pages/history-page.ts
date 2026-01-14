import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base-page';

export class HistoryPage extends BasePage {
  readonly pageTitle: Locator;
  readonly historyList: Locator;
  readonly historyItems: Locator;
  readonly emptyState: Locator;
  readonly clearHistoryButton: Locator;

  constructor(page: Page) {
    super(page, '/history');

    this.pageTitle = page.locator('h1, h2').filter({ hasText: /history/i });
    this.historyList = page.locator('.history-grid');
    this.historyItems = page.locator('.history-item');
    this.emptyState = page.locator('.empty-state');
    this.clearHistoryButton = page.getByRole('button', { name: /clear/i });
  }

  async expectEmpty() {
    await expect(this.emptyState).toBeVisible();
  }

  async expectNotEmpty() {
    await expect(this.historyItems.first()).toBeVisible();
  }

  async expectHistoryCount(count: number) {
    await expect(this.historyItems).toHaveCount(count);
  }

  async expectHistoryItemVisible(title: string) {
    await expect(this.historyItems.filter({ hasText: title })).toBeVisible();
  }

  async clickHistoryItem(title: string) {
    await this.historyItems.filter({ hasText: title }).click();
  }

  async removeHistoryItem(title: string) {
    const item = this.historyItems.filter({ hasText: title });
    const removeButton = item.locator('[class*="remove"], button[title*="Remove"]');
    if (await removeButton.isVisible()) {
      await removeButton.click();
    }
  }

  async clearHistory() {
    if (await this.clearHistoryButton.isVisible()) {
      await this.clearHistoryButton.click();
    }
  }
}
