# 🎨 UI/UX Frontend Development Documentation

Dokumentasi lengkap pengembangan UI/UX untuk DramaBox Frontend menggunakan React + TypeScript + Vite.

---

## 📋 Daftar Isi

1. [Design System](#design-system)
2. [Component Architecture](#component-architecture)
3. [Theme System](#theme-system)
4. [Responsive Design](#responsive-design)
5. [Component Library](#component-library)
6. [Styling Approach](#styling-approach)
7. [UI Guidelines](#ui-guidelines)
8. [Best Practices](#best-practices)
9. [Accessibility](#accessibility)
10. [Performance Optimization](#performance-optimization)

---

## 🎨 Design System

### Color Palette

#### Dark Theme (Default)
```css
Primary:              #e50914 (Netflix Red)
Primary Hover:        #f40612
Primary Dark:         #b20710
Secondary:            #ff4458

Background:           #141414
Background Secondary: #1f1f1f
Background Tertiary:  #2a2a2a
Background Overlay:   rgba(0, 0, 0, 0.85)

Text:                 #ffffff
Text Secondary:       #e5e5e5
Text Muted:           #a0a0a0
Text Disabled:        #666666

Border:               #333333
Border Light:         #444444
Border Dark:          #222222
```

#### Light Theme
```css
Primary:              #e50914
Primary Hover:        #f40612
Primary Dark:         #b20710
Secondary:            #ff4458

Background:           #ffffff
Background Secondary: #f5f5f5
Background Tertiary:  #eeeeee
Background Overlay:   rgba(255, 255, 255, 0.95)

Text:                 #141414
Text Secondary:       #2a2a2a
Text Muted:           #666666
Text Disabled:        #a0a0a0

Border:               #e0e0e0
Border Light:         #f0f0f0
Border Dark:          #d0d0d0
```

#### Status Colors
```css
Success:  #10b981 (Green)
Error:    #e50914 (Red)
Warning:  #f59e0b (Orange)
Info:     #3b82f6 (Blue)
```

### Typography

```css
Font Family:
  - Primary: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif
  - Monospace: "Courier New", monospace

Font Sizes:
  - xs:   0.75rem  (12px)
  - sm:   0.875rem (14px)
  - base: 1rem     (16px)
  - lg:   1.125rem (18px)
  - xl:   1.25rem  (20px)
  - 2xl:  1.5rem   (24px)
  - 3xl:  1.875rem (30px)
  - 4xl:  2.25rem  (36px)
  - 5xl:  3rem     (48px)

Font Weights:
  - Light:    300
  - Regular:  400
  - Medium:   500
  - Semibold: 600
  - Bold:     700
  - Black:    900

Line Heights:
  - Tight:   1.2
  - Normal:  1.5
  - Relaxed: 1.75
  - Loose:   2
```

### Spacing System

```css
Spacing Scale (rem):
  - 0:   0
  - 1:   0.25rem  (4px)
  - 2:   0.5rem   (8px)
  - 3:   0.75rem  (12px)
  - 4:   1rem     (16px)
  - 5:   1.25rem  (20px)
  - 6:   1.5rem   (24px)
  - 8:   2rem     (32px)
  - 10:  2.5rem   (40px)
  - 12:  3rem     (48px)
  - 16:  4rem     (64px)
  - 20:  5rem     (80px)
  - 24:  6rem     (96px)
```

### Border Radius

```css
Border Radius:
  - none:  0
  - sm:    0.25rem (4px)
  - base:  0.375rem (6px)
  - md:    0.5rem  (8px)
  - lg:    0.75rem (12px)
  - xl:    1rem    (16px)
  - 2xl:   1.5rem  (24px)
  - full:  9999px
```

### Shadows

```css
Shadows:
  - sm:  0 1px 2px rgba(0, 0, 0, 0.3)
  - md:  0 4px 6px rgba(0, 0, 0, 0.4)
  - lg:  0 10px 25px rgba(0, 0, 0, 0.5)
  - xl:  0 20px 60px rgba(0, 0, 0, 0.6)
```

### Transitions

```css
Transition Speeds:
  - fast:   0.15s ease
  - normal: 0.3s ease
  - slow:   0.5s ease
```

### Z-Index Layers

```css
Z-Index Hierarchy:
  - navbar:       1000
  - dropdown:     2000
  - modal:        3000
  - toast:        4000
  - video-player: 5000
```

---

## 🏗️ Component Architecture

### Component Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.tsx       # Navigation bar (603 lines)
│   ├── DramaCard.tsx    # Drama card component (389 lines)
│   ├── FilterBar.tsx    # Filter bar component (401 lines)
│   ├── Header.tsx       # Hero section (293 lines)
│   └── VideoPlayer.tsx  # Video player component
├── pages/               # Page components
│   ├── HomePage.tsx     # Home page (532 lines)
│   ├── FavoritesPage.tsx # Favorites page (386 lines)
│   ├── HistoryPage.tsx  # History page (535 lines)
│   └── AuthPage.tsx     # Authentication page (598 lines)
├── contexts/            # React contexts
│   ├── ThemeContext.tsx # Theme management (82 lines)
│   └── AuthContext.tsx  # Auth management (132 lines)
├── hooks/               # Custom React hooks
│   ├── useFavorites.ts  # Favorites hook (110 lines)
│   └── useHistory.ts    # History hook (132 lines)
├── types/               # TypeScript types
│   └── index.ts         # Type definitions (200+ lines)
├── utils/               # Utility functions
│   └── storage.ts       # Storage utilities (338 lines)
└── styles/              # Global styles
    └── themes.css       # Theme variables (346 lines)
```

### Component Hierarchy

```
App
├── ThemeProvider
│   └── AuthProvider
│       └── Router
│           ├── Navbar (global)
│           │   ├── Logo
│           │   ├── Navigation Links
│           │   ├── Search Bar
│           │   ├── Theme Toggle
│           │   ├── User Menu
│           │   └── Mobile Menu
│           │
│           └── Routes
│               ├── HomePage
│               │   ├── Header/Hero
│               │   ├── FilterBar
│               │   └── DramaGrid
│               │       └── DramaCard (multiple)
│               │
│               ├── FavoritesPage
│               │   ├── Page Header
│               │   ├── Sort Controls
│               │   └── DramaGrid
│               │       └── DramaCard (multiple)
│               │
│               ├── HistoryPage
│               │   ├── Page Header
│               │   ├── Continue Watching
│               │   └── History List
│               │       └── DramaCard (multiple)
│               │
│               ├── AuthPage
│               │   ├── Login Form
│               │   └── Register Form
│               │
│               └── VideoPlayer (route param)
│                   ├── Video Controls
│                   ├── Episode Navigation
│                   └── Drama Info
```

---

## 🌓 Theme System

### Implementation

#### ThemeContext Provider

```typescript
// src/contexts/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('dramabox_theme');
    return (saved as Theme) || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('dramabox_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
```

#### Using Theme in Components

```typescript
import { useTheme } from '../contexts/ThemeContext';

const MyComponent = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme}>
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
};
```

#### CSS Variables Usage

```css
.my-component {
  background: var(--color-background);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  transition: var(--transition-normal);
}

.my-component:hover {
  background: var(--color-background-secondary);
}
```

### Theme Features

✅ **Implemented:**
- Dark theme (default)
- Light theme
- LocalStorage persistence
- Smooth transitions between themes
- Theme toggle button in navbar
- All components support both themes
- CSS variables for dynamic theming

---

## 📱 Responsive Design

### Breakpoints

```css
/* Mobile First Approach */

/* Extra Small Devices (Phones) */
@media (max-width: 480px) {
  /* 320px - 480px */
}

/* Small Devices (Large Phones) */
@media (max-width: 767px) {
  /* 481px - 767px */
}

/* Medium Devices (Tablets) */
@media (max-width: 1023px) {
  /* 768px - 1023px */
}

/* Large Devices (Desktops) */
@media (min-width: 1024px) {
  /* 1024px+ */
}

/* Extra Large Devices */
@media (min-width: 1440px) {
  /* 1440px+ */
}
```

### Responsive Grid System

```css
/* Drama Card Grid - Responsive */
.drama-grid {
  display: grid;
  gap: 1.5rem;
  
  /* Mobile: 1 column */
  grid-template-columns: 1fr;
  
  /* Tablet: 2 columns */
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  /* Desktop: 3 columns */
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  /* Large Desktop: 4 columns */
  @media (min-width: 1280px) {
    grid-template-columns: repeat(4, 1fr);
  }
  
  /* Extra Large: 5 columns */
  @media (min-width: 1536px) {
    grid-template-columns: repeat(5, 1fr);
  }
}
```

### Mobile Menu

```typescript
// Mobile menu implementation
const [showMobileMenu, setShowMobileMenu] = useState(false);

// Toggle on hamburger click
<button 
  className="mobile-menu-toggle"
  onClick={() => setShowMobileMenu(!showMobileMenu)}
>
  {showMobileMenu ? '✕' : '☰'}
</button>

// Mobile menu
{showMobileMenu && (
  <div className="mobile-menu">
    <Link to="/" onClick={() => setShowMobileMenu(false)}>Home</Link>
    <Link to="/favorites" onClick={() => setShowMobileMenu(false)}>Favorites</Link>
    <Link to="/history" onClick={() => setShowMobileMenu(false)}>History</Link>
  </div>
)}
```

### Responsive Features

✅ **Implemented:**
- Mobile-first approach
- Responsive grid layouts
- Mobile navigation menu
- Touch-friendly tap targets (min 44px)
- Responsive typography
- Flexible images
- Collapsible sections
- Swipe gestures ready
- Viewport meta tag configured

---

## 📦 Component Library

### 1. Navbar Component

**File:** `src/components/Navbar.tsx` (603 lines)

**Features:**
- Fixed position on scroll
- Search functionality
- Theme toggle (☀️/🌙)
- User authentication menu
- Favorites badge counter
- History badge counter
- Mobile responsive menu
- Active link highlighting
- Smooth scroll effects

**Props:**
```typescript
interface NavbarProps {
  onSearch?: (query: string) => void;
}
```

**Usage:**
```tsx
<Navbar onSearch={handleSearch} />
```

---

### 2. DramaCard Component

**File:** `src/components/DramaCard.tsx` (389 lines)

**Features:**
- Drama thumbnail image
- Title and metadata display
- Episode count
- View count formatting
- Rating display
- Favorite heart icon
- Progress indicator (if in history)
- Hover effects
- Click to play
- Responsive design

**Props:**
```typescript
interface DramaCardProps {
  drama: Drama;
  onSelect: (bookId: string, episode: number) => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  progress?: number;
  showProgress?: boolean;
}
```

**Usage:**
```tsx
<DramaCard
  drama={drama}
  onSelect={handleSelect}
  isFavorite={isFavorite(drama.bookId)}
  onToggleFavorite={() => toggleFavorite(drama)}
  progress={getProgress(drama.bookId)}
  showProgress={true}
/>
```

---

### 3. FilterBar Component

**File:** `src/components/FilterBar.tsx` (401 lines)

**Features:**
- Genre multi-selection (12 genres)
- Rating filter (All, 5+, 6+, 7+, 8+, 9+)
- Sort options (Popular, Latest, Rating, Name)
- Sort order toggle (Asc/Desc)
- Tag-based UI
- Clear filters button
- Real-time filtering
- Mobile responsive
- Collapsible on mobile

**Props:**
```typescript
interface FilterBarProps {
  onFilterChange: (filters: FilterOptions) => void;
  activeFilters: FilterOptions;
}

interface FilterOptions {
  genres: string[];
  minRating: number;
  sortBy: 'popular' | 'latest' | 'rating' | 'name';
  sortOrder: 'asc' | 'desc';
}
```

**Usage:**
```tsx
<FilterBar
  onFilterChange={handleFilterChange}
  activeFilters={filters}
/>
```

---

### 4. Header/Hero Component

**File:** `src/components/Header.tsx` (293 lines)

**Features:**
- Hero section with gradient background
- Call-to-action button
- Search integration
- Animated entrance
- Responsive layout
- Background image support

**Props:**
```typescript
interface HeroProps {
  onExplore: () => void;
  onSearch?: (keyword: string) => void;
}
```

**Usage:**
```tsx
<Hero
  onExplore={scrollToDramas}
  onSearch={handleSearch}
/>
```

---

### 5. VideoPlayer Component

**File:** `src/components/VideoPlayer.tsx`

**Features:**
- HTML5 video player
- Episode navigation (prev/next)
- Drama information display
- Favorite toggle
- Responsive layout
- Auto-play next episode
- Loading states
- Error handling

**Props:**
```typescript
interface VideoPlayerProps {
  bookId: string;
  episode: number;
  onEpisodeChange: (episode: number) => void;
  totalEpisodes: number;
}
```

**Usage:**
```tsx
<VideoPlayer
  bookId={bookId}
  episode={currentEpisode}
  onEpisodeChange={setCurrentEpisode}
  totalEpisodes={drama.chapterCount}
/>
```

---

## 🎨 Styling Approach

### CSS-in-JS with Style Tags

We use **scoped `<style>` tags** within components for component-specific styling:

```tsx
const MyComponent = () => {
  return (
    <div className="my-component">
      <h1>Hello World</h1>
      
      <style>{`
        .my-component {
          padding: 2rem;
          background: var(--color-background);
        }
        
        .my-component h1 {
          color: var(--color-primary);
          font-size: 2rem;
        }
      `}</style>
    </div>
  );
};
```

### Why This Approach?

✅ **Pros:**
- Component-scoped styles (no global pollution)
- Co-located with component logic
- Easy to understand and maintain
- No external CSS files to manage
- TypeScript-friendly
- Supports CSS variables
- No build tool configuration needed

⚠️ **Cons:**
- Larger bundle size for components
- No CSS preprocessing (SASS/LESS)
- Limited syntax highlighting

### Global Styles

Global theme variables in `src/styles/themes.css`:

```css
/* Import in main.tsx or App.tsx */
import './styles/themes.css';
```

### Style Organization

```typescript
// Component structure
const MyComponent = () => {
  // 1. Hooks and state
  const [state, setState] = useState();
  
  // 2. Event handlers
  const handleClick = () => {};
  
  // 3. JSX
  return (
    <div className="component">
      {/* markup */}
      
      {/* 4. Styles at the end */}
      <style>{`
        /* Component styles here */
      `}</style>
    </div>
  );
};
```

### CSS Best Practices

```css
/* ✅ DO: Use CSS variables */
.component {
  color: var(--color-text);
  background: var(--color-background);
}

/* ✅ DO: Use BEM-like naming */
.drama-card { }
.drama-card__title { }
.drama-card__image { }
.drama-card--featured { }

/* ✅ DO: Use transitions */
.button {
  transition: var(--transition-normal);
}

/* ❌ DON'T: Hardcode colors */
.component {
  color: #ffffff; /* Bad */
}

/* ❌ DON'T: Use !important */
.component {
  color: red !important; /* Bad */
}

/* ❌ DON'T: Over-specify selectors */
div.container > ul > li > a.link { /* Too specific */
}
```

---

## 📐 UI Guidelines

### Button Styles

```css
/* Primary Button */
.btn-primary {
  background: var(--color-primary);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-normal);
}

.btn-primary:hover {
  background: var(--color-primary-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

/* Secondary Button */
.btn-secondary {
  background: transparent;
  color: var(--color-text);
  border: 2px solid var(--color-border);
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-normal);
}

.btn-secondary:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

/* Icon Button */
.btn-icon {
  background: transparent;
  border: none;
  padding: 0.5rem;
  border-radius: 50%;
  cursor: pointer;
  transition: var(--transition-fast);
}

.btn-icon:hover {
  background: var(--color-background-secondary);
}
```

### Input Styles

```css
/* Text Input */
.input {
  width: 100%;
  padding: 0.75rem 1rem;
  background: var(--color-input-bg);
  border: 1px solid var(--color-input-border);
  border-radius: 0.375rem;
  color: var(--color-text);
  font-size: 1rem;
  transition: var(--transition-fast);
}

.input:focus {
  outline: none;
  border-color: var(--color-input-focus);
  box-shadow: 0 0 0 3px rgba(229, 9, 20, 0.1);
}

.input::placeholder {
  color: var(--color-text-muted);
}

/* Search Input */
.search-input {
  padding-left: 2.5rem; /* Space for icon */
  background-image: url("data:image/svg+xml,...");
  background-position: 0.75rem center;
  background-repeat: no-repeat;
}
```

### Card Styles

```css
/* Base Card */
.card {
  background: var(--color-card-bg);
  border: 1px solid var(--color-card-border);
  border-radius: 0.75rem;
  padding: 1.5rem;
  transition: var(--transition-normal);
}

.card:hover {
  background: var(--color-card-hover);
  box-shadow: var(--shadow-lg);
  transform: translateY(-4px);
}

/* Drama Card */
.drama-card {
  position: relative;
  border-radius: 0.5rem;
  overflow: hidden;
  cursor: pointer;
  background: var(--color-card-bg);
  transition: var(--transition-normal);
}

.drama-card:hover {
  transform: scale(1.05);
  box-shadow: var(--shadow-xl);
  z-index: 10;
}
```

### Badge Styles

```css
/* Badge */
.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.25rem;
  height: 1.25rem;
  padding: 0 0.375rem;
  background: var(--color-primary);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 9999px;
}

/* Badge Positions */
.badge-top-right {
  position: absolute;
  top: -0.5rem;
  right: -0.5rem;
}
```

### Modal/Overlay Styles

```css
/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--color-background-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
  backdrop-filter: blur(4px);
}

/* Modal Content */
.modal-content {
  background: var(--color-background-secondary);
  border-radius: 1rem;
  padding: 2rem;
  max-width: 32rem;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow-xl);
}
```

---

## ✨ Best Practices

### 1. Component Design

```typescript
// ✅ DO: Use TypeScript interfaces
interface Props {
  title: string;
  onAction: () => void;
}

// ✅ DO: Destructure props
const Component: React.FC<Props> = ({ title, onAction }) => {
  // component logic
};

// ✅ DO: Use meaningful names
const handleSubmit = () => {};
const isLoading = false;
const userData = {};

// ❌ DON'T: Use generic names
const handle = () => {};
const flag = false;
const data = {};
```

### 2. State Management

```typescript
// ✅ DO: Use appropriate hooks
const [count, setCount] = useState(0);
const [user, setUser] = useState<User | null>(null);

// ✅ DO: Keep state close to where it's used
// If only one component needs it, keep it there

// ✅ DO: Use Context for global state
const { theme } = useTheme();
const { user } = useAuth();

// ❌ DON'T: Prop drill excessively
// Use Context or composition instead
```

### 3. Performance

```typescript
// ✅ DO: Memoize expensive computations
const filteredData = useMemo(() => {
  return data.filter(item => item.active);
}, [data]);

// ✅ DO: Memoize callbacks
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);

// ✅ DO: Lazy load images
<img loading="lazy" src={url} alt={alt} />

// ✅ DO: Code splitting
const VideoPlayer = lazy(() => import('./VideoPlayer'));
```

### 4. Accessibility

```typescript
// ✅ DO: Use semantic HTML
<button onClick={handleClick}>Click me</button>
<nav>...</nav>
<main>...</main>
<article>...</article>

// ✅ DO: Add ARIA labels
<button aria-label="Close modal" onClick={close}>×</button>

// ✅ DO: Support keyboard navigation
<div 
  role="button" 
  tabIndex={0}
  onKeyPress={handleKeyPress}
  onClick={handleClick}
>
  Clickable div
</div>

// ❌ DON'T: Use divs for everything
<div onClick={handleClick}>Click me</div> // Bad
```

### 5. Error Handling

```typescript
// ✅ DO: Handle errors gracefully
try {
  const data = await fetchData();
  setData(data);
} catch (error) {
  console.error('Failed to fetch:', error);
  setError('Failed to load data. Please try again.');
}

// ✅ DO: Show user-friendly error messages
{error && (
  <div className="error-message">
    {error}
  </div>
)}

// ✅ DO: Provide fallback UI
<img 
  src={imageUrl} 
  onError={(e) => {
    e.currentTarget.src = '/placeholder.png';
  }}
/>
```

---

## ♿ Accessibility

### WCAG 2.1 Compliance

#### Level A (Must Have)

✅ **Keyboard Navigation**
```typescript
// All interactive elements accessible via keyboard
<button onClick={handleClick}>Click</button>
<a href="/page">Link</a>
<input type="text" />
```

✅ **Alternative Text**
```tsx
<img src={drama.cover} alt={drama.name} />
```

✅ **Color Contrast**
- Text on background: 4.5:1 ratio minimum
- Large text: 3:1 ratio minimum
- Checked with contrast checkers

#### Level AA (Should Have)

✅ **Focus Indicators**
```css
button:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

✅ **Responsive Text**
```css
/* Text scales up to 200% without loss of functionality */
html {
  font-size: 16px;
}

@media (min-width: 1024px) {
  html {
    font-size: 18px;
  }
}
```

#### Best Practices

```tsx
// ✅ Semantic HTML
<header>
  <nav>
    <ul>
      <li><a href="/">Home</a></li>
    </ul>
  </nav>
</header>

// ✅ ARIA labels
<button aria-label="Toggle theme" onClick={toggleTheme}>
  {theme === 'dark' ? '☀️' : '🌙'}
</button>

// ✅ Skip links
<a href="#main-content" className="skip-link">
  Skip to main content
</a>

// ✅ Form labels
<label htmlFor="search">Search dramas</label>
<input id="search" type="text" />

// ✅ Live regions for dynamic content
<div aria-live="polite" aria-atomic="true">
  {message}
</div>
```

### Screen Reader Support

```tsx
// Hidden text for screen readers
<span className="sr-only">
  Loading content
</span>

<style>{`
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
`}</style>
```

---

## ⚡ Performance Optimization

### 1. Image Optimization

```tsx
// Lazy loading
<img loading="lazy" src={url} alt={alt} />

// Responsive images
<img
  srcSet={`
    ${url}-small.jpg 480w,
    ${url}-medium.jpg 768w,
    ${url}-large.jpg 1024w
  `}
  sizes="(max-width: 768px) 100vw, 50vw"
  src={url}
  alt={alt}
/>

// Error fallback
<img
  src={drama.cover}
  onError={(e) => {
    e.currentTarget.style.display = 'none';
  }}
  alt={drama.name}
/>
```

### 2. Code Splitting

```tsx
// Lazy load routes
import { lazy, Suspense } from 'react';

const VideoPlayer = lazy(() => import('./components/VideoPlayer'));

// Use with Suspense
<Suspense fallback={<div>Loading...</div>}>
  <VideoPlayer />
</Suspense>
```

### 3. Memoization

```tsx
import { useMemo, useCallback } from 'react';

// Memoize expensive calculations
const filteredDramas = useMemo(() => {
  return dramas
    .filter(d => d.genre.includes(selectedGenre))
    .sort((a, b) => b.rating - a.rating);
}, [dramas, selectedGenre]);

// Memoize callbacks
const handleSelect = useCallback((id: string) => {
  navigate(`/watch/${id}`);
}, [navigate]);
```

### 4. Virtual Scrolling

```tsx
// For large lists, consider react-window or react-virtualized
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={dramas.length}
  itemSize={200}
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>
      <DramaCard drama={dramas[index]} />
    </div>
  )}
</FixedSizeList>
```

### 5. Debouncing

```tsx
// Debounce search input
import { useState, useEffect } from 'react';

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

// Usage
const [searchQuery, setSearchQuery] = useState('');
const debouncedQuery = useDebounce(searchQuery, 500);

useEffect(() => {
  if (debouncedQuery) {
    searchDramas(debouncedQuery);
  }
}, [debouncedQuery]);
```

---

## 📊 UI Metrics

### Current Implementation Stats

```
Total Components:  9
Total Pages:       4
Total Lines:       3,300+
TypeScript:        100%
Responsive:        ✅ Yes
Theme Support:     ✅ Dark + Light
Accessibility:     ✅ WCAG 2.1 Level A
Performance:       ✅ Optimized
```

### Component Lines of Code

```
Navbar:         603 lines
DramaCard:      389 lines
FilterBar:      401 lines
Header:         293 lines
VideoPlayer:    ~200 lines

HomePage:       532 lines
FavoritesPage:  386 lines
HistoryPage:    535 lines
AuthPage:       598 lines

Total:          ~3,937 lines
```

### Theme System

```
CSS Variables:  70+
Color Tokens:   28
Themes:         2 (Dark, Light)
Transitions:    3 speeds
Breakpoints:    5
Z-Index Layers: 5
```

---

## 🚀 Future UI/UX Enhancements

### Planned for v2.3.0

1. **Advanced Video Player**
   - Picture-in-Picture (PiP)
   - Playback speed control
   - Quality selection
   - Subtitle support
   - Keyboard shortcuts
   - Preview thumbnails on scrub

2. **Animations**
   - Framer Motion integration
   - Page transitions
   - Micro-interactions
   - Loading animations
   - Skeleton screens

3. **Enhanced Filters**
   - Year range slider
   - Duration filter
   - Release date filter
   - Country/language filter
   - More sort options

4. **Improved Cards**
   - Hover preview videos
   - Quick actions menu
   - Share functionality
   - Add to playlist
   - Mark as watched

### Ideas for v3.0.0

1. **Design System Library**
   - Storybook integration
   - Component documentation
   - Design tokens
   - Icon library
   - Pattern library

2. **Advanced Features**
   - Drag & drop playlists
   - Custom themes
   - Layout customization
   - Grid/List view toggle
   - Infinite scroll

3. **Social Features**
   - User profiles
   - Comments UI
   - Rating system
   - Share to social media
   - Activity feed

---

## 📚 Resources

### Design Inspiration

- **Netflix** - Primary design reference
- **Disney+** - Card layouts
- **HBO Max** - Navigation patterns
- **Spotify** - Theme system
- **YouTube** - Video player

### Tools & Libraries

- **React** 18.3.1 - UI library
- **TypeScript** 5.9.3 - Type safety
- **Vite** 5.4.21 - Build tool
- **React Router** 6.x - Routing
- **CSS Variables** - Theming

### Learning Resources

- [React Docs](https://react.dev)
- [TypeScript Docs](https://typescriptlang.org)
- [MDN Web Docs](https://developer.mozilla.org)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [CSS Tricks](https://css-tricks.com)

---

## 🎯 Quick Reference

### Color Usage Guide

```
Background:      Use var(--color-background)
Text:            Use var(--color-text)
Primary Action:  Use var(--color-primary)
Borders:         Use var(--color-border)
Success:         Use var(--color-success)
Error:           Use var(--color-error)
```

### Component Checklist

When creating new components:

- [ ] TypeScript interfaces defined
- [ ] Props documented
- [ ] Responsive design implemented
- [ ] Theme support (CSS variables)
- [ ] Keyboard accessible
- [ ] ARIA labels added
- [ ] Error states handled
- [ ] Loading states handled
- [ ] Mobile tested
- [ ] Performance optimized

---

**Last Updated:** 2024-01-01  
**Version:** 2.1.0  
**Status:** Production Ready ✨

Made with ❤️ using React + TypeScript + Vite