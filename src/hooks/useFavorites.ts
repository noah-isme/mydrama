// ============================================================================
// useFavorites Hook - Favorites Management
// ============================================================================

import { useState, useEffect, useCallback } from 'react';
import { Drama, Favorite } from '../types';
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  isFavorite,
  toggleFavorite,
  clearFavorites,
} from '../utils/storage';

/**
 * Custom hook for managing favorites
 */
export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(false);

  /**
   * Load favorites from storage
   */
  const loadFavorites = useCallback(() => {
    setLoading(true);
    try {
      const data = getFavorites();
      setFavorites(data);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Add drama to favorites
   */
  const addToFavorites = useCallback((drama: Drama): boolean => {
    const success = addFavorite(drama);
    if (success) {
      loadFavorites();
    }
    return success;
  }, [loadFavorites]);

  /**
   * Remove drama from favorites
   */
  const removeFromFavorites = useCallback((bookId: string): boolean => {
    const success = removeFavorite(bookId);
    if (success) {
      loadFavorites();
    }
    return success;
  }, [loadFavorites]);

  /**
   * Toggle favorite status
   */
  const toggleFavoriteStatus = useCallback((drama: Drama): boolean => {
    const success = toggleFavorite(drama);
    loadFavorites();
    return success;
  }, [loadFavorites]);

  /**
   * Check if drama is favorite
   */
  const checkIsFavorite = useCallback((bookId: string): boolean => {
    return isFavorite(bookId);
  }, []);

  /**
   * Clear all favorites
   */
  const clearAllFavorites = useCallback(() => {
    clearFavorites();
    loadFavorites();
  }, [loadFavorites]);

  /**
   * Get favorite dramas only
   */
  const getFavoriteDramas = useCallback((): Drama[] => {
    return favorites.map(fav => fav.drama);
  }, [favorites]);

  // Load favorites on mount
  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  return {
    favorites,
    favoriteDramas: getFavoriteDramas(),
    loading,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite: toggleFavoriteStatus,
    isFavorite: checkIsFavorite,
    clearFavorites: clearAllFavorites,
    reload: loadFavorites,
    count: favorites.length,
  };
};

export default useFavorites;
