import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base-page';

export class AuthPage extends BasePage {
  readonly usernameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly submitButton: Locator;
  readonly toggleModeLink: Locator;
  readonly authTitle: Locator;
  readonly authCard: Locator;
  readonly demoNotice: Locator;

  constructor(page: Page) {
    super(page, '/auth');

    this.usernameInput = page.locator('#username');
    this.emailInput = page.locator('#email');
    this.passwordInput = page.locator('#password');
    this.confirmPasswordInput = page.locator('#confirmPassword');
    this.submitButton = page.locator('.auth-form button[type="submit"]');
    this.toggleModeLink = page.locator('.btn-link');
    this.authTitle = page.locator('.auth-title');
    this.authCard = page.locator('.auth-card');
    this.demoNotice = page.locator('.demo-notice');
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async register(username: string, email: string, password: string, confirmPassword?: string) {
    await this.usernameInput.fill(username);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(confirmPassword || password);
    await this.submitButton.click();
  }

  async switchToRegister() {
    await this.toggleModeLink.click();
    await expect(this.authTitle).toHaveText('Create Account');
  }

  async switchToLogin() {
    await this.toggleModeLink.click();
    await expect(this.authTitle).toHaveText('Welcome Back');
  }

  async expectLoginMode() {
    await expect(this.authTitle).toHaveText('Welcome Back');
    await expect(this.emailInput).not.toBeVisible();
    await expect(this.confirmPasswordInput).not.toBeVisible();
  }

  async expectRegisterMode() {
    await expect(this.authTitle).toHaveText('Create Account');
    await expect(this.emailInput).toBeVisible();
    await expect(this.confirmPasswordInput).toBeVisible();
  }

  async expectValidationError(message: string | RegExp) {
    await this.expectToastMessage(message, 'error');
  }

  async expectLoginSuccess() {
    await this.expectToastMessage(/login successful/i, 'success');
  }

  async expectRegisterSuccess() {
    await this.expectToastMessage(/registration successful/i, 'success');
  }
}
