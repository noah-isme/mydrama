import { test, expect } from '../fixtures/test-fixtures';

test.describe('Authentication', () => {
  test.beforeEach(async ({ authPage }) => {
    await authPage.goto();
  });

  test('should display login form by default', async ({ authPage }) => {
    await authPage.expectLoginMode();
    await expect(authPage.demoNotice).toBeVisible();
  });

  test('should switch between login and register modes', async ({ authPage }) => {
    await authPage.expectLoginMode();

    await authPage.switchToRegister();
    await authPage.expectRegisterMode();

    await authPage.switchToLogin();
    await authPage.expectLoginMode();
  });

  test('should show validation error for empty login fields', async ({ authPage }) => {
    await authPage.submitButton.click();
    await authPage.expectValidationError(/fill in all fields/i);
  });

  test('should show validation error for short password', async ({ authPage }) => {
    await authPage.login('testuser', '123');
    await authPage.expectValidationError(/at least 6 characters/i);
  });

  test('should login successfully with valid credentials', async ({ authPage, page }) => {
    await authPage.login('testuser', 'password123');
    await authPage.expectLoginSuccess();
    await page.waitForURL('/');
  });

  test('should show browser validation for invalid email in register', async ({ authPage, page }) => {
    await authPage.switchToRegister();
    await authPage.usernameInput.fill('testuser');
    await authPage.emailInput.fill('invalid-email');
    await authPage.passwordInput.fill('password123');
    await authPage.confirmPasswordInput.fill('password123');
    
    const emailInput = authPage.emailInput;
    await authPage.submitButton.click();
    
    const isInvalid = await emailInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
    expect(isInvalid).toBe(true);
  });

  test('should show validation error for password mismatch', async ({ authPage }) => {
    await authPage.switchToRegister();
    await authPage.register('testuser', 'test@example.com', 'password123', 'different123');
    await authPage.expectValidationError(/passwords do not match/i);
  });

  test('should register successfully with valid data', async ({ authPage, page }) => {
    await authPage.switchToRegister();
    await authPage.register('newuser', 'newuser@example.com', 'password123');
    await authPage.expectRegisterSuccess();
    await page.waitForURL('/');
  });

  test('should persist authentication in localStorage', async ({ authPage, page }) => {
    await authPage.login('testuser', 'password123');
    await authPage.expectLoginSuccess();
    await page.waitForURL('/', { timeout: 5000 });

    const user = await authPage.getLocalStorage('dramabox_user');
    expect(user).toBeTruthy();
    expect(user).toHaveProperty('username', 'testuser');

    const token = await authPage.getLocalStorage('dramabox_token');
    expect(token).toBeTruthy();
  });
});
