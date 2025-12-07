// ============================================================================
// Theme Context - Light/Dark Mode Management
// ============================================================================

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeMode, ThemeContextValue } from '../types';
import { getTheme, saveTheme } from '../utils/storage';

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * Theme Provider Component
 * Manages light/dark mode state and persistence
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    // Initialize from localStorage or default to dark
    return getTheme();
  });

  // Apply theme to document root
  useEffect(() => {
    const root = document.documentElement;

    // Remove both classes first
    root.classList.remove('light-theme', 'dark-theme');

    // Add the current theme class
    root.classList.add(`${theme}-theme`);

    // Set data attribute for CSS
    root.setAttribute('data-theme', theme);

    // Save to localStorage
    saveTheme(theme);
  }, [theme]);

  /**
   * Toggle between light and dark mode
   */
  const toggleTheme = () => {
    setThemeState(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  /**
   * Set specific theme
   */
  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
  };

  const value: ThemeContextValue = {
    theme,
    toggleTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Custom hook to use theme context
 */
export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};

export default ThemeContext;
