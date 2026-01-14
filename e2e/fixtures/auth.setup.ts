import { test as setup } from '@playwright/test';
import { setupApiMocks } from '../utils/api-mocks';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  await setupApiMocks(page);
  await page.goto('/auth');

  await page.locator('#username').fill('testuser');
  await page.locator('#password').fill('password123');
  await page.getByRole('button', { name: 'Sign In' }).click();

  await page.waitForURL('/');

  await page.context().storageState({ path: authFile });
});
