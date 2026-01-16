import { test, expect } from '../fixtures/test-fixtures';

test.describe('Navbar Search', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
    await homePage.waitForLoading();
  });

  test('should search dramas via navbar', async ({ homePage, page }) => {
    const query = 'Test Drama 1';
    await homePage.searchViaNavbar(query);

    await expect(page).toHaveURL(new RegExp(`q=${encodeURIComponent(query)}`));

    await homePage.waitForLoading();
    await homePage.expectDramaCount(1);
    await homePage.expectDramaTitle(query);
  });

  test('should handle empty search from navbar', async ({ homePage, page }) => {
    await homePage.navbarSearchInput.fill('');
    await homePage.navbarSearchButton.click();
    
    await expect(page).not.toHaveURL(/q=/);
  });

  test('should toggle theme', async ({ homePage }) => {
    await expect(homePage.themeToggle).toBeVisible();
    
    const initialText = await homePage.themeToggle.textContent();
    await homePage.themeToggle.click();
    const newText = await homePage.themeToggle.textContent();
    
    expect(newText).not.toBe(initialText);
  });
});
