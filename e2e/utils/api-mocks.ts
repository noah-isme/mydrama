import { Page } from '@playwright/test';

export const mockDramaData = [
  {
    bookId: 'test-001',
    bookName: 'Test Drama 1',
    name: 'Test Drama 1',
    description: 'A test drama for E2E testing',
    cover: 'https://via.placeholder.com/300x450',
    coverWap: 'https://via.placeholder.com/300x450',
    chapterCount: 20,
    chapterNum: 20,
    totalEpisodes: 20,
    viewNum: 100000,
    score: 4.5,
    tags: ['Romance', 'Drama'],
    genres: ['Romance', 'Drama'],
  },
  {
    bookId: 'test-002',
    bookName: 'Test Drama 2',
    name: 'Test Drama 2',
    description: 'Another test drama',
    cover: 'https://via.placeholder.com/300x450',
    coverWap: 'https://via.placeholder.com/300x450',
    chapterCount: 15,
    chapterNum: 15,
    totalEpisodes: 15,
    viewNum: 50000,
    score: 4.2,
    tags: ['Action', 'Thriller'],
    genres: ['Action', 'Thriller'],
  },
  {
    bookId: 'test-003',
    bookName: 'Test Drama 3',
    name: 'Test Drama 3',
    description: 'Third test drama',
    cover: 'https://via.placeholder.com/300x450',
    coverWap: 'https://via.placeholder.com/300x450',
    chapterCount: 25,
    chapterNum: 25,
    totalEpisodes: 25,
    viewNum: 75000,
    score: 4.8,
    tags: ['Comedy', 'Romance'],
    genres: ['Comedy', 'Romance'],
  },
];

export const mockStreamData = {
  status: true,
  data: {
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    qualities: [
      { url: 'https://example.com/360p.mp4', quality: '360p', isDefault: false },
      { url: 'https://example.com/720p.mp4', quality: '720p', isDefault: true },
      { url: 'https://example.com/1080p.mp4', quality: '1080p', isDefault: false },
    ],
  },
};

export async function setupApiMocks(page: Page) {
  await page.route('**/api/latest', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ status: true, data: mockDramaData }),
    });
  });

  await page.route('**/api/search**', async (route) => {
    const url = new URL(route.request().url());
    const query = url.searchParams.get('query')?.toLowerCase() || '';

    const filtered = mockDramaData.filter(
      (d) =>
        d.name.toLowerCase().includes(query) ||
        d.tags.some((t) => t.toLowerCase().includes(query))
    );

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        status: true,
        data: filtered.length > 0 ? filtered : [],
      }),
    });
  });

  await page.route('**/api/stream**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockStreamData),
    });
  });

  await page.route('**/api/mood/**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ status: true, data: mockDramaData.slice(0, 2) }),
    });
  });

  await page.route('**/api/recommendations**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ status: true, data: mockDramaData }),
    });
  });
}

export async function clearAllStorageAndMocks(page: Page) {
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
}
