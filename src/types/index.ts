// ============================================================================
// Type Definitions for DramaBox Application
// ============================================================================

/**
 * Drama object from API
 */
export interface Drama {
  bookId: string;
  name?: string;
  bookName?: string;
  description?: string;
  cover?: string;
  verticalCover?: string;
  chapterNum?: number;
  viewNum?: number;
  coverVerticalUrl?: string;
  coverHorizontalUrl?: string;
  coverWap?: string;
  totalEpisodes?: number;
  chapterCount?: number;
  tags?: string[];
  score?: number;
  view?: number;
  playCount?: string;
  author?: string;
  updateTime?: string;
  introduction?: string;
  year?: number | string;
  releaseYear?: number | string;
  duration?: string;
  episodeDuration?: string;
  cast?: string[];
  actors?: string[];
  director?: string;
  genre?: string;
  genres?: string[];
  country?: string;
  language?: string;
  status?: 'ongoing' | 'completed' | string;
  rating?: number;
}

/**
 * API Response wrapper
 */
export interface ApiResponse<T = any> {
  status: boolean;
  data?: T;
  message?: string;
  url?: string;
}

/**
 * Video quality option
 */
export interface VideoQuality {
  url: string;
  quality: string;
  isDefault: boolean;
  bitrate?: number | null;
}

/**
 * Video stream data
 */
export interface StreamData {
  url: string;
  bookId: string;
  episode: number;
  qualities?: VideoQuality[];
}

/**
 * Message/Toast notification
 */
export interface Message {
  text: string;
  type: "success" | "error" | "info" | "warning";
}

/**
 * Tab types
 */
export type TabType = "latest" | "search" | "favorites" | "history";

/**
 * Theme mode
 */
export type ThemeMode = "light" | "dark";

/**
 * User authentication data
 */
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  createdAt?: string;
}

/**
 * Authentication context value
 */
export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string,
  ) => Promise<void>;
  logout: () => void;
}

/**
 * Favorite/Bookmark item
 */
export interface Favorite {
  drama: Drama;
  addedAt: string;
}

/**
 * Watch history item
 */
export interface HistoryItem {
  drama: Drama;
  episode: number;
  watchedAt: string;
  progress?: number;
  thumbnail?: string;
}

/**
 * Filter options
 */
export interface FilterOptions {
  genre?: string[];
  rating?: number;
  year?: number;
  sortBy?: "popular" | "latest" | "rating" | "name";
  order?: "asc" | "desc";
}

/**
 * Theme context value
 */
export interface ThemeContextValue {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
}

/**
 * Local storage keys
 */
export enum StorageKeys {
  FAVORITES = "dramabox_favorites",
  HISTORY = "dramabox_history",
  THEME = "dramabox_theme",
  USER = "dramabox_user",
  AUTH_TOKEN = "dramabox_token",
}

/**
 * Component props types
 */
export interface NavbarProps {
  onSearch: (keyword: string) => void;
}

export interface HeroProps {
  onExplore: () => void;
  onSearch: (keyword: string) => void;
}

export interface DramaCardProps {
  drama: Drama;
  onSelect: (
    bookId: string,
    name: string,
    description: string,
    totalEpisodes: number,
  ) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (drama: Drama) => void;
  showProgress?: boolean;
  progress?: number;
}

export interface VideoPlayerProps {
  currentDrama: {
    bookId: string;
    name: string;
    description?: string;
  };
  currentEpisode: number;
  maxEpisode: number;
  videoUrl?: string;
  qualities?: VideoQuality[];
  onEpisodeChange: (episode: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  onClose: () => void;
  onQualityChange?: (quality: VideoQuality) => void;
}

export interface FilterBarProps {
  onFilterChange: (filters: FilterOptions) => void;
  activeFilters: FilterOptions;
}

/**
 * Genre list
 */
export const GENRES = [
  "Romance",
  "Action",
  "Comedy",
  "Drama",
  "Thriller",
  "Horror",
  "Fantasy",
  "Sci-Fi",
  "Mystery",
  "Historical",
  "Crime",
  "Adventure",
] as const;

export type Genre = (typeof GENRES)[number];

/**
 * Sort options
 */
export const SORT_OPTIONS = [
  { value: "popular", label: "Most Popular" },
  { value: "latest", label: "Latest" },
  { value: "rating", label: "Highest Rated" },
  { value: "name", label: "A-Z" },
] as const;
