// ============================================================================
// useHistory Hook - Watch History Management
// ============================================================================

import { useState, useEffect, useCallback } from 'react';
import { Drama, HistoryItem } from '../types';
import {
  getHistory,
  addToHistory,
  removeFromHistory,
  getHistoryItem,
  clearHistory,
  clearOldHistory,
} from '../utils/storage';

/**
 * Custom hook for managing watch history
 */
export const useHistory = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  /**
   * Load history from storage
   */
  const loadHistory = useCallback(() => {
    setLoading(true);
    try {
      const data = getHistory();
      setHistory(data);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Add or update drama in history
   */
  const addToWatchHistory = useCallback((
    drama: Drama,
    episode: number,
    progress?: number
  ): boolean => {
    const success = addToHistory(drama, episode, progress);
    if (success) {
      loadHistory();
    }
    return success;
  }, [loadHistory]);

  /**
   * Remove drama from history
   */
  const removeFromWatchHistory = useCallback((bookId: string): boolean => {
    const success = removeFromHistory(bookId);
    if (success) {
      loadHistory();
    }
    return success;
  }, [loadHistory]);

  /**
   * Get history item for specific drama
   */
  const getHistoryItemForDrama = useCallback((bookId: string): HistoryItem | null => {
    return getHistoryItem(bookId);
  }, []);

  /**
   * Clear all history
   */
  const clearAllHistory = useCallback(() => {
    clearHistory();
    loadHistory();
  }, [loadHistory]);

  /**
   * Clear old history items
   */
  const clearOldHistoryItems = useCallback((daysOld: number = 30) => {
    clearOldHistory(daysOld);
    loadHistory();
  }, [loadHistory]);

  /**
   * Get history dramas only
   */
  const getHistoryDramas = useCallback((): Drama[] => {
    return history.map(item => item.drama);
  }, [history]);

  /**
   * Check if drama is in history
   */
  const isInHistory = useCallback((bookId: string): boolean => {
    return history.some(item => item.drama.bookId === bookId);
  }, [history]);

  /**
   * Get continue watching list (dramas not finished)
   */
  const getContinueWatching = useCallback((): HistoryItem[] => {
    return history.filter(item => {
      const totalEps = item.drama.totalEpisodes || 100;
      return item.episode < totalEps;
    });
  }, [history]);

  // Load history on mount
  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return {
    history,
    historyDramas: getHistoryDramas(),
    continueWatching: getContinueWatching(),
    loading,
    addToHistory: addToWatchHistory,
    removeFromHistory: removeFromWatchHistory,
    getHistoryItem: getHistoryItemForDrama,
    clearHistory: clearAllHistory,
    clearOldHistory: clearOldHistoryItems,
    isInHistory,
    reload: loadHistory,
    count: history.length,
  };
};

export default useHistory;
