import { useCallback, useEffect, useRef } from 'react';
import { Drama } from '../types';
import { addToHistory, getHistoryItem } from '../utils/storage';

interface WatchProgressData {
  bookId: string;
  episode: number;
  position: number;
  duration: number;
  percentage: number;
  updatedAt: string;
}

const PROGRESS_STORAGE_KEY = 'dramabox_watch_progress';

function getProgressFromStorage(): Record<string, WatchProgressData> {
  try {
    const stored = localStorage.getItem(PROGRESS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveProgressToStorage(bookId: string, data: WatchProgressData): void {
  try {
    const all = getProgressFromStorage();
    all[bookId] = data;
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(all));
  } catch (error) {
    console.error('Failed to save progress:', error);
  }
}

export function useWatchProgress(
  videoRef: React.RefObject<HTMLVideoElement>,
  bookId: string,
  episode: number,
  drama?: Drama
) {
  const lastSaveTimeRef = useRef<number>(0);
  const saveIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const getProgress = useCallback((): WatchProgressData | null => {
    const all = getProgressFromStorage();
    return all[bookId] || null;
  }, [bookId]);

  const saveProgress = useCallback((position: number, duration: number) => {
    const now = Date.now();
    if (now - lastSaveTimeRef.current < 5000) return;
    
    lastSaveTimeRef.current = now;
    
    const percentage = duration > 0 ? (position / duration) * 100 : 0;
    
    const progressData: WatchProgressData = {
      bookId,
      episode,
      position,
      duration,
      percentage,
      updatedAt: new Date().toISOString(),
    };
    
    saveProgressToStorage(bookId, progressData);
    
    if (drama) {
      addToHistory(drama, episode, percentage);
    }
  }, [bookId, episode, drama]);

  const clearProgress = useCallback(() => {
    try {
      const all = getProgressFromStorage();
      delete all[bookId];
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(all));
    } catch (error) {
      console.error('Failed to clear progress:', error);
    }
  }, [bookId]);

  const resumeFromProgress = useCallback(() => {
    const progress = getProgress();
    if (progress && videoRef.current && progress.episode === episode) {
      if (progress.percentage < 95 && progress.position > 5) {
        videoRef.current.currentTime = progress.position;
        return true;
      }
    }
    return false;
  }, [getProgress, episode, videoRef]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (video.currentTime > 0 && video.duration > 0) {
        saveProgress(video.currentTime, video.duration);
      }
    };

    const handlePause = () => {
      if (video.currentTime > 0 && video.duration > 0) {
        lastSaveTimeRef.current = 0;
        saveProgress(video.currentTime, video.duration);
      }
    };

    const handleEnded = () => {
      if (video.duration > 0) {
        const progressData: WatchProgressData = {
          bookId,
          episode,
          position: video.duration,
          duration: video.duration,
          percentage: 100,
          updatedAt: new Date().toISOString(),
        };
        saveProgressToStorage(bookId, progressData);
        
        if (drama) {
          addToHistory(drama, episode, 100);
        }
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    saveIntervalRef.current = setInterval(() => {
      if (video.currentTime > 0 && video.duration > 0 && !video.paused) {
        lastSaveTimeRef.current = 0;
        saveProgress(video.currentTime, video.duration);
      }
    }, 30000);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
      
      if (saveIntervalRef.current) {
        clearInterval(saveIntervalRef.current);
      }

      if (video.currentTime > 0 && video.duration > 0) {
        lastSaveTimeRef.current = 0;
        saveProgress(video.currentTime, video.duration);
      }
    };
  }, [videoRef, bookId, episode, drama, saveProgress]);

  return {
    getProgress,
    saveProgress,
    clearProgress,
    resumeFromProgress,
    getHistoryProgress: () => {
      const historyItem = getHistoryItem(bookId);
      return historyItem?.progress || 0;
    },
  };
}

export function getWatchProgress(bookId: string): WatchProgressData | null {
  const all = getProgressFromStorage();
  return all[bookId] || null;
}

export function getAllWatchProgress(): WatchProgressData[] {
  const all = getProgressFromStorage();
  return Object.values(all).sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export default useWatchProgress;
