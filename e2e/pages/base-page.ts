/**
 * Base Page Object - Shared functionality for all page objects
 */
import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
  readonly page: Page;
  protected pageUrl: string = '';

  // Common elements across all pages
  readonly navbar: Locator;
  readonly messageToast: Locator;
  readonly loadingSpinner: Locator;

  constructor(page: Page, pageUrl: string = '') {
    this.page = page;
    this.pageUrl = pageUrl;

    // Common locators
    this.navbar = page.getByTestId('navbar');
    this.messageToast = page.locator('.message-container');
    this.loadingSpinner = page.locator('.loading-spinner');
    this.navbarSearchInput = page.locator('.navbar-search .search-input');
    this.navbarSearchButton = page.locator('.navbar-search .search-button');
    this.themeToggle = page.locator('.theme-toggle');
  }

  readonly navbarSearchInput: Locator;
  readonly navbarSearchButton: Locator;
  readonly themeToggle: Locator;

  async searchViaNavbar(query: string) {
    await this.navbarSearchInput.fill(query);
    await this.navbarSearchButton.click();
    await this.waitForLoading();
  }

  /**
   * Navigate to page URL
   */
  async goto(options?: { waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' }) {
    await this.page.goto(this.pageUrl, options);
  }

  /**
   * Wait for page load state
   */
  async waitForLoadState(state: 'load' | 'domcontentloaded' | 'networkidle' = 'load') {
    await this.page.waitForLoadState(state);
  }

  /**
   * Wait for loading spinner to disappear
   */
  async waitForLoading() {
    await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 15_000 }).catch(() => {
      // Spinner might not appear for fast responses
    });
  }

  /**
   * Check if toast message is visible with specific text
   * Toast is conditionally rendered - wait for it to appear
   */
  async expectToastMessage(text: string | RegExp, type?: 'success' | 'error' | 'warning' | 'info') {
    // Wait for toast container to appear (conditionally rendered)
    const toastSelector = type
      ? `.message-container .message.${type}`
      : '.message-container .message';
    
    const toast = this.page.locator(toastSelector);
    await toast.waitFor({ state: 'visible', timeout: 10_000 });
    
    // Check text content inside .message-text
    const messageText = toast.locator('.message-text');
    await expect(messageText).toContainText(text);
  }

  /**
   * Navigate using navbar
   */
  async navigateViaNavbar(destination: 'home' | 'favorites' | 'history' | 'auth') {
    const linkMap = {
      home: '/',
      favorites: '/favorites',
      history: '/history',
      auth: '/auth',
    };
    await this.page.getByTestId(`navbar-link-${destination}`).click();
    await this.page.waitForURL(`**${linkMap[destination]}`);
  }

  /**
   * Get localStorage value
   */
  async getLocalStorage<T>(key: string): Promise<T | null> {
    const value = await this.page.evaluate((k) => localStorage.getItem(k), key);
    return value ? JSON.parse(value) : null;
  }

  /**
   * Set localStorage value
   */
  async setLocalStorage(key: string, value: unknown): Promise<void> {
    await this.page.evaluate(
      ({ k, v }) => localStorage.setItem(k, JSON.stringify(v)),
      { k: key, v: value }
    );
  }

  /**
   * Clear localStorage
   */
  async clearLocalStorage(): Promise<void> {
    await this.page.evaluate(() => localStorage.clear());
  }

  /**
   * Take screenshot for debugging
   */
  async screenshot(name: string) {
    await this.page.screenshot({ path: `test-results/screenshots/${name}.png` });
  }
}
