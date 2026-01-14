# AGENTS.md - DramaBox Codebase Guide

This document provides essential information for AI agents working on this codebase.

## Project Overview

**DramaBox** is a React + TypeScript streaming platform for watching dramas. It uses Vite as the build tool and Express.js for the backend API.

## Build, Lint, and Test Commands

```bash
# Install dependencies (uses pnpm)
pnpm install

# Development
pnpm run dev          # Start Vite dev server on http://localhost:5173
pnpm run server       # Start Express backend on http://localhost:3000

# Type checking & linting
pnpm run type-check   # TypeScript type checking (tsc --noEmit)
pnpm run lint         # ESLint with --max-warnings 0

# Production
pnpm run build        # tsc && vite build → outputs to dist/
pnpm run preview      # Preview production build

# Other
pnpm run proxy        # Start CORS proxy server
```

**No test framework is configured.** There are no test commands or test files.

## Project Structure

```
src/
├── components/       # React UI components (*.tsx)
├── contexts/         # React context providers (ThemeContext, AuthContext)
├── hooks/            # Custom React hooks (useFavorites, useHistory, etc.)
├── pages/            # Page components (HomePage, FavoritesPage, etc.)
├── types/            # TypeScript type definitions
├── utils/            # Utility functions (storage.ts)
├── App.tsx           # Main app with Router
├── main.tsx          # Entry point
└── index.css         # Global styles with CSS variables

backend/
├── server.js         # Express API server (ES modules)
├── cors-proxy.js     # CORS proxy
└── *.js              # API endpoint handlers
```

## Code Style Guidelines

### TypeScript

- **Strict mode enabled**: `strict: true` in tsconfig.json
- **No unused variables**: `noUnusedLocals` and `noUnusedParameters` are enforced
- **Target**: ES2020 with ESNext modules
- **Path aliases**: Use `@/`, `@components/`, `@utils/`, `@types/`, `@hooks/`, `@contexts/`, `@pages/`

```typescript
// CORRECT: Use path aliases
import { Drama } from "@/types";
import { useFavorites } from "@hooks/useFavorites";

// AVOID: Relative paths for deep imports
import { Drama } from "../../../types";
```

### React Components

- **Functional components only** with React.FC type annotation
- **Props interfaces** defined above component
- **File naming**: PascalCase for components (e.g., `DramaCard.tsx`)
- **Export style**: Default export for components

```typescript
// Component structure pattern
interface MyComponentProps {
  prop1: string;
  prop2?: number;
}

const MyComponent: React.FC<MyComponentProps> = ({ prop1, prop2 = 0 }) => {
  // hooks first
  const [state, setState] = useState(false);
  
  // handlers
  const handleClick = () => { /* ... */ };
  
  // render
  return <div>...</div>;
};

export default MyComponent;
```

### Hooks

- **Custom hooks** in `src/hooks/` directory
- **Naming**: `use` prefix (e.g., `useFavorites`, `useWatchProgress`)
- **Return object** with named properties

```typescript
export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  // ...
  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    // ...
  };
};
```

### Imports

**Order** (enforced by ESLint):
1. React and React-related imports
2. Third-party libraries
3. Path alias imports (@/...)
4. Relative imports
5. Type-only imports

```typescript
import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Drama } from "@/types";
import { useFavorites } from "@hooks/useFavorites";
import "./styles.css";
```

### Styling

- **CSS Variables**: Use variables from `:root` in `index.css`
- **Inline styles via `<style>` tags**: Components use scoped CSS via `<style>{...}</style>` pattern
- **CSS Variable naming**: `--color-*`, `--spacing-*`, `--radius-*`, `--shadow-*`, `--z-*`

```typescript
// Common CSS variables
var(--color-primary)          // #e50914 (Netflix red)
var(--color-text)             // Text color
var(--color-background)       // Background
var(--color-border)           // Border color
var(--shadow-lg)              // Large shadow
var(--spacing-md)             // 16px
var(--radius-md)              // 8px
```

### Type Definitions

- **All types** in `src/types/index.ts`
- **Interface naming**: PascalCase, descriptive (e.g., `Drama`, `VideoQuality`, `HistoryItem`)
- **Props types**: `ComponentNameProps` (e.g., `DramaCardProps`)

```typescript
// Core types available:
Drama           // Drama data object
VideoQuality    // Video quality option
Message         // Toast notification
User            // Auth user
Favorite        // Favorite item
HistoryItem     // Watch history item
```

### Error Handling

- **Try-catch blocks** with console.error logging
- **Return boolean** for success/failure in utility functions
- **Show user feedback** via Message/Toast component

```typescript
const addFavorite = (drama: Drama): boolean => {
  try {
    // ... operation
    return true;
  } catch (error) {
    console.error('Error adding favorite:', error);
    return false;
  }
};
```

### ESLint Rules

Key rules from `.eslintrc.cjs`:
- `@typescript-eslint/no-explicit-any`: warn (avoid `any`, but not blocked)
- `@typescript-eslint/no-unused-vars`: warn with `_` prefix exception
- `react-refresh/only-export-components`: warn
- `react/no-unknown-property`: error (except `jsx` prop)

```typescript
// Unused variables: prefix with underscore
const handleClick = (_event: React.MouseEvent) => { /* ... */ };
```

### Context Providers

- **Pattern**: Context + Provider + useHook
- **Located in**: `src/contexts/`

```typescript
// Usage pattern
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<Props> = ({ children }) => {
  // state and methods
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
```

### Storage Utilities

Use `src/utils/storage.ts` for localStorage operations:

```typescript
import { getFavorites, addFavorite, getHistory } from "@utils/storage";
```

Storage keys are defined in `StorageKeys` enum.

### API Calls

- **Frontend**: Uses `/api/*` proxy to backend
- **Backend**: Express.js with ES modules (`"type": "module"` in package.json)
- **Fetch pattern**:

```typescript
const fetchAPI = async (endpoint: string, params: Record<string, any> = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = `${API_BASE}${endpoint}${queryString ? "?" + queryString : ""}`;
  const response = await fetch(url, { method: "GET", headers: { ... } });
  // ...
};
```

### Component File Structure

Standard section comments used throughout:
```typescript
// ============================================================================
// ComponentName - Brief Description
// ============================================================================
```

### JSDoc Comments

Use JSDoc for function documentation:
```typescript
/**
 * Toggle favorite status
 */
const toggleFavoriteStatus = useCallback((drama: Drama): boolean => {
  // ...
}, []);
```

## Important Notes

1. **No test files exist** - consider adding Vitest if tests are needed
2. **Backend uses ES modules** - `import/export` syntax, not CommonJS
3. **Vite proxy** configured for `/api` → `http://localhost:3000`
4. **Dark theme is default** - CSS variables support theming
5. **pnpm is required** - do not use npm or yarn
6. **React 18** with strict mode patterns
