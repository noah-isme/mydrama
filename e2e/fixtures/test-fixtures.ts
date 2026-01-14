import { test as base, expect } from '@playwright/test';
import { HomePage, AuthPage, VideoPlayerPage, FavoritesPage, HistoryPage } from '../pages';
import { setupApiMocks } from '../utils/api-mocks';

type TestFixtures = {
  homePage: HomePage;
  authPage: AuthPage;
  videoPlayerPage: VideoPlayerPage;
  favoritesPage: FavoritesPage;
  historyPage: HistoryPage;
};

export const test = base.extend<TestFixtures>({
  homePage: async ({ page }, use) => {
    await setupApiMocks(page);
    const homePage = new HomePage(page);
    await use(homePage);
  },

  authPage: async ({ page }, use) => {
    await setupApiMocks(page);
    const authPage = new AuthPage(page);
    await use(authPage);
  },

  videoPlayerPage: async ({ page }, use) => {
    await setupApiMocks(page);
    const videoPlayerPage = new VideoPlayerPage(page);
    await use(videoPlayerPage);
  },

  favoritesPage: async ({ page }, use) => {
    await setupApiMocks(page);
    const favoritesPage = new FavoritesPage(page);
    await use(favoritesPage);
  },

  historyPage: async ({ page }, use) => {
    await setupApiMocks(page);
    const historyPage = new HistoryPage(page);
    await use(historyPage);
  },
});

export { expect };
