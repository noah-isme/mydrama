// ============================================================================
// LocalStorage Utility Functions
// ============================================================================

import { Drama, Favorite, HistoryItem, StorageKeys } from '../types';

/**
 * Get data from localStorage
 */
const getFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error);
    return defaultValue;
  }
};

/**
 * Save data to localStorage
 */
const saveToStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving to localStorage (${key}):`, error);
  }
};

/**
 * Remove data from localStorage
 */
const removeFromStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage (${key}):`, error);
  }
};

// ============================================================================
// Favorites Management
// ============================================================================

/**
 * Get all favorites
 */
export const getFavorites = (): Favorite[] => {
  return getFromStorage<Favorite[]>(StorageKeys.FAVORITES, []);
};

/**
 * Add drama to favorites
 */
export const addFavorite = (drama: Drama): boolean => {
  try {
    const favorites = getFavorites();

    // Check if already exists
    const exists = favorites.some(fav => fav.drama.bookId === drama.bookId);
    if (exists) {
      return false;
    }

    const newFavorite: Favorite = {
      drama,
      addedAt: new Date().toISOString(),
    };

    favorites.unshift(newFavorite);
    saveToStorage(StorageKeys.FAVORITES, favorites);
    return true;
  } catch (error) {
    console.error('Error adding favorite:', error);
    return false;
  }
};

/**
 * Remove drama from favorites
 */
export const removeFavorite = (bookId: string): boolean => {
  try {
    const favorites = getFavorites();
    const filtered = favorites.filter(fav => fav.drama.bookId !== bookId);

    if (filtered.length === favorites.length) {
      return false; // Not found
    }

    saveToStorage(StorageKeys.FAVORITES, filtered);
    return true;
  } catch (error) {
    console.error('Error removing favorite:', error);
    return false;
  }
};

/**
 * Check if drama is in favorites
 */
export const isFavorite = (bookId: string): boolean => {
  const favorites = getFavorites();
  return favorites.some(fav => fav.drama.bookId === bookId);
};

/**
 * Toggle favorite status
 */
export const toggleFavorite = (drama: Drama): boolean => {
  if (isFavorite(drama.bookId)) {
    return removeFavorite(drama.bookId);
  } else {
    return addFavorite(drama);
  }
};

/**
 * Clear all favorites
 */
export const clearFavorites = (): void => {
  saveToStorage(StorageKeys.FAVORITES, []);
};

// ============================================================================
// Watch History Management
// ============================================================================

/**
 * Get watch history
 */
export const getHistory = (): HistoryItem[] => {
  return getFromStorage<HistoryItem[]>(StorageKeys.HISTORY, []);
};

/**
 * Add or update watch history
 */
export const addToHistory = (
  drama: Drama,
  episode: number,
  progress?: number
): boolean => {
  try {
    let history = getHistory();

    // Remove existing entry for this drama
    history = history.filter(item => item.drama.bookId !== drama.bookId);

    // Add new entry at the beginning
    const newHistoryItem: HistoryItem = {
      drama,
      episode,
      watchedAt: new Date().toISOString(),
      progress: progress || 0,
      thumbnail: drama.coverVerticalUrl || drama.coverHorizontalUrl,
    };

    history.unshift(newHistoryItem);

    // Keep only last 50 items
    if (history.length > 50) {
      history = history.slice(0, 50);
    }

    saveToStorage(StorageKeys.HISTORY, history);
    return true;
  } catch (error) {
    console.error('Error adding to history:', error);
    return false;
  }
};

/**
 * Remove drama from history
 */
export const removeFromHistory = (bookId: string): boolean => {
  try {
    const history = getHistory();
    const filtered = history.filter(item => item.drama.bookId !== bookId);

    if (filtered.length === history.length) {
      return false; // Not found
    }

    saveToStorage(StorageKeys.HISTORY, filtered);
    return true;
  } catch (error) {
    console.error('Error removing from history:', error);
    return false;
  }
};

/**
 * Get history item for specific drama
 */
export const getHistoryItem = (bookId: string): HistoryItem | null => {
  const history = getHistory();
  return history.find(item => item.drama.bookId === bookId) || null;
};

/**
 * Clear all history
 */
export const clearHistory = (): void => {
  saveToStorage(StorageKeys.HISTORY, []);
};

/**
 * Clear old history items (older than X days)
 */
export const clearOldHistory = (daysOld: number = 30): void => {
  try {
    const history = getHistory();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const filtered = history.filter(item => {
      const watchedDate = new Date(item.watchedAt);
      return watchedDate > cutoffDate;
    });

    saveToStorage(StorageKeys.HISTORY, filtered);
  } catch (error) {
    console.error('Error clearing old history:', error);
  }
};

// ============================================================================
// Theme Management
// ============================================================================

/**
 * Get theme from storage
 */
export const getTheme = (): 'light' | 'dark' => {
  return getFromStorage<'light' | 'dark'>(StorageKeys.THEME, 'dark');
};

/**
 * Save theme to storage
 */
export const saveTheme = (theme: 'light' | 'dark'): void => {
  saveToStorage(StorageKeys.THEME, theme);
};

// ============================================================================
// User/Auth Management
// ============================================================================

/**
 * Get user from storage
 */
export const getUser = (): any => {
  return getFromStorage(StorageKeys.USER, null);
};

/**
 * Save user to storage
 */
export const saveUser = (user: any): void => {
  saveToStorage(StorageKeys.USER, user);
};

/**
 * Remove user from storage
 */
export const removeUser = (): void => {
  removeFromStorage(StorageKeys.USER);
};

/**
 * Get auth token
 */
export const getAuthToken = (): string | null => {
  return getFromStorage<string | null>(StorageKeys.AUTH_TOKEN, null);
};

/**
 * Save auth token
 */
export const saveAuthToken = (token: string): void => {
  saveToStorage(StorageKeys.AUTH_TOKEN, token);
};

/**
 * Remove auth token
 */
export const removeAuthToken = (): void => {
  removeFromStorage(StorageKeys.AUTH_TOKEN);
};

/**
 * Clear all storage
 */
export const clearAllStorage = (): void => {
  Object.values(StorageKeys).forEach(key => {
    removeFromStorage(key);
  });
};

// ============================================================================
// Export all utilities
// ============================================================================

export default {
  // Favorites
  getFavorites,
  addFavorite,
  removeFavorite,
  isFavorite,
  toggleFavorite,
  clearFavorites,

  // History
  getHistory,
  addToHistory,
  removeFromHistory,
  getHistoryItem,
  clearHistory,
  clearOldHistory,

  // Theme
  getTheme,
  saveTheme,

  // User/Auth
  getUser,
  saveUser,
  removeUser,
  getAuthToken,
  saveAuthToken,
  removeAuthToken,

  // General
  clearAllStorage,
};
