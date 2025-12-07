# 🎨 Panduan Pengembangan UI/UX DramaBox

Panduan praktis pengembangan antarmuka pengguna (UI) dan pengalaman pengguna (UX) untuk DramaBox Frontend.

---

## 📋 Daftar Isi

1. [Sistem Desain](#sistem-desain)
2. [Komponen-Komponen](#komponen-komponen)
3. [Sistem Tema](#sistem-tema)
4. [Desain Responsif](#desain-responsif)
5. [Cara Styling](#cara-styling)
6. [Tips & Trik](#tips--trik)

---

## 🎨 Sistem Desain

### Palet Warna

#### Tema Gelap (Default)
```css
Merah Utama:      #e50914  (Warna Netflix)
Merah Hover:      #f40612
Merah Tua:        #b20710

Background:       #141414  (Hitam)
Background 2:     #1f1f1f  (Abu gelap)
Background 3:     #2a2a2a  (Abu lebih terang)

Teks Putih:       #ffffff
Teks Abu:         #a0a0a0
Border:           #333333
```

#### Tema Terang
```css
Background:       #ffffff  (Putih)
Background 2:     #f5f5f5  (Abu terang)
Teks Hitam:       #141414
Teks Abu:         #666666
Border:           #e0e0e0
```

#### Warna Status
```css
Sukses:   #10b981  (Hijau)
Error:    #e50914  (Merah)
Warning:  #f59e0b  (Oranye)
Info:     #3b82f6  (Biru)
```

### Ukuran Font

```css
Extra Small:  12px  (0.75rem)
Small:        14px  (0.875rem)
Normal:       16px  (1rem)
Large:        18px  (1.125rem)
Extra Large:  20px  (1.25rem)
Heading:      24px  (1.5rem)
Hero:         48px  (3rem)
```

### Spacing (Jarak)

```css
Kecil:    8px   (0.5rem)
Sedang:   16px  (1rem)
Besar:    24px  (1.5rem)
X-Besar:  32px  (2rem)
```

---

## 📦 Komponen-Komponen

### 1. Navbar (Navigation Bar)

**Lokasi:** `src/components/Navbar.tsx`

**Fitur:**
- Logo DramaBox
- Menu navigasi (Home, Favorites, History)
- Search bar
- Tombol toggle tema (☀️/🌙)
- Menu user dengan avatar
- Badge counter untuk favorites & history
- Mobile menu (hamburger)

**Cara Pakai:**
```tsx
import Navbar from './components/Navbar';

<Navbar onSearch={handleSearch} />
```

---

### 2. DramaCard (Kartu Drama)

**Lokasi:** `src/components/DramaCard.tsx`

**Fitur:**
- Gambar thumbnail drama
- Judul dan info drama
- Jumlah episode
- Jumlah views
- Rating (jika ada)
- Tombol favorite (❤️)
- Progress bar (jika sudah ditonton)
- Hover effect yang smooth

**Cara Pakai:**
```tsx
import DramaCard from './components/DramaCard';

<DramaCard
  drama={drama}
  onSelect={handleClick}
  isFavorite={isFavorite(drama.bookId)}
  onToggleFavorite={() => toggleFavorite(drama)}
  progress={50}  // 50% progress
  showProgress={true}
/>
```

---

### 3. FilterBar (Bar Filter)

**Lokasi:** `src/components/FilterBar.tsx`

**Fitur:**
- Filter by genre (12 genre tersedia)
- Filter by rating (All, 5+, 6+, 7+, 8+, 9+)
- Sort by (Popular, Latest, Rating, Name)
- Toggle sort order (Asc/Desc)
- Clear all filters
- Tag-based UI yang modern

**Genre yang Tersedia:**
- Romance
- Action
- Comedy
- Drama
- Thriller
- Horror
- Fantasy
- Sci-Fi
- Mystery
- Historical
- Crime
- Adventure

**Cara Pakai:**
```tsx
import FilterBar from './components/FilterBar';

<FilterBar
  onFilterChange={handleFilterChange}
  activeFilters={filters}
/>
```

---

### 4. Header/Hero Section

**Lokasi:** `src/components/Header.tsx`

**Fitur:**
- Hero section dengan background gradient
- Judul besar dan deskripsi
- Call-to-action button
- Search integration
- Animated entrance

**Cara Pakai:**
```tsx
import Hero from './components/Header';

<Hero
  onExplore={scrollToDramas}
  onSearch={handleSearch}
/>
```

---

### 5. VideoPlayer

**Lokasi:** `src/components/VideoPlayer.tsx`

**Fitur:**
- HTML5 video player
- Episode navigation (Previous/Next)
- Info drama
- Favorite toggle
- Auto-play next episode
- Loading & error states

**Cara Pakai:**
```tsx
import VideoPlayer from './components/VideoPlayer';

<VideoPlayer
  bookId={bookId}
  episode={currentEpisode}
  onEpisodeChange={setCurrentEpisode}
  totalEpisodes={drama.chapterCount}
/>
```

---

## 🌓 Sistem Tema

### Cara Kerja

DramaBox punya 2 tema: **Dark** (default) dan **Light**.

#### Menggunakan Theme Context

```tsx
import { useTheme } from './contexts/ThemeContext';

const MyComponent = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={toggleTheme}>
        Toggle Theme
      </button>
    </div>
  );
};
```

#### Menggunakan CSS Variables

```css
.my-component {
  /* Otomatis berubah sesuai tema */
  background: var(--color-background);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}
```

### CSS Variables yang Tersedia

```css
/* Background */
var(--color-background)
var(--color-background-secondary)
var(--color-background-tertiary)

/* Text */
var(--color-text)
var(--color-text-secondary)
var(--color-text-muted)

/* Colors */
var(--color-primary)
var(--color-primary-hover)
var(--color-success)
var(--color-error)
var(--color-warning)

/* Border */
var(--color-border)
var(--color-border-light)

/* Transitions */
var(--transition-fast)   /* 0.15s */
var(--transition-normal) /* 0.3s */
var(--transition-slow)   /* 0.5s */

/* Shadows */
var(--shadow-sm)
var(--shadow-md)
var(--shadow-lg)
var(--shadow-xl)
```

---

## 📱 Desain Responsif

### Breakpoints

```css
/* Mobile: 320px - 767px */
@media (max-width: 767px) {
  /* Styles untuk mobile */
}

/* Tablet: 768px - 1023px */
@media (min-width: 768px) and (max-width: 1023px) {
  /* Styles untuk tablet */
}

/* Desktop: 1024px+ */
@media (min-width: 1024px) {
  /* Styles untuk desktop */
}
```

### Grid Responsif

```css
.drama-grid {
  display: grid;
  gap: 1.5rem;
  
  /* Mobile: 1 kolom */
  grid-template-columns: 1fr;
  
  /* Tablet: 2 kolom */
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  /* Desktop: 4 kolom */
  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

### Tips Mobile

✅ **DO:**
- Gunakan touch-friendly tap targets (min 44x44px)
- Test di device asli, bukan cuma browser resize
- Gunakan viewport meta tag: `<meta name="viewport" content="width=device-width, initial-scale=1">`
- Prioritaskan konten penting di atas
- Gunakan hamburger menu untuk mobile

❌ **DON'T:**
- Jangan paksa horizontal scroll
- Jangan gunakan hover effects di mobile
- Jangan gunakan fixed width dalam pixels
- Jangan lupakan landscape orientation

---

## 🎨 Cara Styling

### Approach: CSS-in-JS dengan Style Tags

Kita pakai **scoped `<style>` tags** di dalam komponen:

```tsx
const MyComponent = () => {
  return (
    <div className="my-component">
      <h1 className="title">Hello World</h1>
      <p className="description">This is a description</p>
      
      <style>{`
        .my-component {
          padding: 2rem;
          background: var(--color-background);
          border-radius: 0.5rem;
        }
        
        .title {
          color: var(--color-primary);
          font-size: 2rem;
          margin-bottom: 1rem;
        }
        
        .description {
          color: var(--color-text-muted);
          line-height: 1.5;
        }
        
        /* Responsive */
        @media (max-width: 767px) {
          .my-component {
            padding: 1rem;
          }
          
          .title {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};
```

### Kenapa Pakai Cara Ini?

✅ **Kelebihan:**
- Styles langsung di component (mudah maintain)
- Tidak perlu import CSS file terpisah
- Tidak ada konflik class name global
- Support CSS variables
- TypeScript friendly

⚠️ **Kekurangan:**
- Bundle size sedikit lebih besar
- Tidak ada syntax highlighting sempurna
- Tidak bisa pakai SASS/LESS

### Best Practices

```css
/* ✅ BAGUS: Pakai CSS variables */
.component {
  color: var(--color-text);
  background: var(--color-background);
}

/* ✅ BAGUS: Pakai class names yang jelas */
.drama-card { }
.drama-card-title { }
.drama-card-image { }

/* ✅ BAGUS: Pakai transitions */
.button {
  transition: var(--transition-normal);
}

.button:hover {
  transform: translateY(-2px);
}

/* ❌ JELEK: Hardcode colors */
.component {
  color: #ffffff;  /* Jangan! Pakai var(--color-text) */
}

/* ❌ JELEK: Pakai !important */
.component {
  color: red !important;  /* Hindari ini! */
}
```

---

## 💡 Tips & Trik

### 1. Buttons

```css
/* Primary Button (Tombol Utama) */
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

/* Secondary Button (Tombol Sekunder) */
.btn-secondary {
  background: transparent;
  color: var(--color-text);
  border: 2px solid var(--color-border);
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  cursor: pointer;
}

.btn-secondary:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}
```

### 2. Input Fields

```css
.input {
  width: 100%;
  padding: 0.75rem 1rem;
  background: var(--color-background-secondary);
  border: 1px solid var(--color-border);
  border-radius: 0.375rem;
  color: var(--color-text);
  font-size: 1rem;
  transition: var(--transition-fast);
}

.input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(229, 9, 20, 0.1);
}

.input::placeholder {
  color: var(--color-text-muted);
}
```

### 3. Cards dengan Hover Effect

```css
.card {
  background: var(--color-background-secondary);
  border-radius: 0.75rem;
  padding: 1.5rem;
  transition: var(--transition-normal);
  cursor: pointer;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}
```

### 4. Badges (Label Kecil)

```css
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
```

### 5. Loading Spinner

```css
.spinner {
  border: 3px solid var(--color-border);
  border-top: 3px solid var(--color-primary);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

### 6. Toast/Message Notification

```css
.toast {
  position: fixed;
  top: 2rem;
  right: 2rem;
  background: var(--color-background-secondary);
  color: var(--color-text);
  padding: 1rem 1.5rem;
  border-radius: 0.5rem;
  box-shadow: var(--shadow-xl);
  animation: slideIn 0.3s ease;
  z-index: var(--z-toast);
}

.toast.success {
  border-left: 4px solid var(--color-success);
}

.toast.error {
  border-left: 4px solid var(--color-error);
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
```

---

## 🎯 Checklist Membuat Komponen Baru

Saat membuat komponen baru, pastikan:

- [ ] ✅ Sudah pakai TypeScript dengan interface Props
- [ ] ✅ Pakai CSS variables untuk colors & spacing
- [ ] ✅ Responsive di mobile, tablet, desktop
- [ ] ✅ Support kedua tema (dark & light)
- [ ] ✅ Ada hover states untuk interactive elements
- [ ] ✅ Ada loading states
- [ ] ✅ Ada error states & fallbacks
- [ ] ✅ Accessible (keyboard navigation, ARIA labels)
- [ ] ✅ Optimized (lazy loading images, memoization)

---

## 📊 Statistik UI

### Komponen yang Sudah Ada

```
Navbar:         603 baris
DramaCard:      389 baris
FilterBar:      401 baris
Header:         293 baris
VideoPlayer:    ~200 baris

HomePage:       532 baris
FavoritesPage:  386 baris
HistoryPage:    535 baris
AuthPage:       598 baris

Total:          ~3,937 baris kode UI
```

### Fitur UI/UX

```
✅ Dark Theme (default)
✅ Light Theme
✅ Responsive Design (Mobile, Tablet, Desktop)
✅ Theme Toggle
✅ Mobile Menu
✅ Search Bar
✅ Filters (Genre, Rating, Sort)
✅ Favorites System
✅ Watch History
✅ User Authentication UI
✅ Video Player
✅ Progress Indicators
✅ Badge Counters
✅ Loading States
✅ Error Handling
✅ Smooth Animations
```

---

## 🚀 Fitur UI yang Akan Datang

### v2.3.0 (Planned)

1. **Advanced Video Player**
   - Picture-in-Picture (PiP)
   - Playback speed control (0.5x - 2x)
   - Quality selection (1080p, 720p, 480p)
   - Subtitle support
   - Keyboard shortcuts

2. **Animations**
   - Page transitions
   - Micro-interactions
   - Loading animations
   - Skeleton screens

3. **Enhanced UI**
   - Drag & drop playlists
   - Grid/List view toggle
   - Infinite scroll
   - Quick preview on hover

---

## 📚 Referensi Cepat

### Import Komponen

```tsx
// Components
import Navbar from './components/Navbar';
import DramaCard from './components/DramaCard';
import FilterBar from './components/FilterBar';
import Hero from './components/Header';
import VideoPlayer from './components/VideoPlayer';

// Pages
import HomePage from './pages/HomePage';
import FavoritesPage from './pages/FavoritesPage';
import HistoryPage from './pages/HistoryPage';
import AuthPage from './pages/AuthPage';

// Contexts
import { useTheme } from './contexts/ThemeContext';
import { useAuth } from './contexts/AuthContext';

// Hooks
import { useFavorites } from './hooks/useFavorites';
import { useHistory } from './hooks/useHistory';
```

### Contoh Lengkap Komponen

```tsx
import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface MyComponentProps {
  title: string;
  onAction: () => void;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, onAction }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { theme } = useTheme();

  return (
    <div 
      className="my-component"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h2 className="title">{title}</h2>
      <button className="action-btn" onClick={onAction}>
        Click Me
      </button>
      
      <style>{`
        .my-component {
          padding: 2rem;
          background: var(--color-background-secondary);
          border-radius: 0.75rem;
          transition: var(--transition-normal);
        }
        
        .my-component:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }
        
        .title {
          color: var(--color-text);
          font-size: 1.5rem;
          margin-bottom: 1rem;
        }
        
        .action-btn {
          background: var(--color-primary);
          color: white;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 0.375rem;
          cursor: pointer;
          transition: var(--transition-normal);
        }
        
        .action-btn:hover {
          background: var(--color-primary-hover);
        }
        
        @media (max-width: 767px) {
          .my-component {
            padding: 1rem;
          }
          
          .title {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
};

export default MyComponent;
```

---

## 🎨 Color Palette Reference

Gunakan warna-warna ini di design tools (Figma, Adobe XD, etc):

```
Primary Colors:
#e50914 - Netflix Red (Primary)
#f40612 - Hover Red
#b20710 - Dark Red

Dark Theme:
#141414 - Background
#1f1f1f - Background Secondary
#2a2a2a - Background Tertiary
#ffffff - Text
#a0a0a0 - Text Muted
#333333 - Border

Light Theme:
#ffffff - Background
#f5f5f5 - Background Secondary
#eeeeee - Background Tertiary
#141414 - Text
#666666 - Text Muted
#e0e0e0 - Border

Status Colors:
#10b981 - Success (Green)
#e50914 - Error (Red)
#f59e0b - Warning (Orange)
#3b82f6 - Info (Blue)
```

---

## 🆘 Troubleshooting UI

### Tema Tidak Berubah?

```tsx
// Pastikan ThemeProvider membungkus app
<ThemeProvider>
  <App />
</ThemeProvider>

// Check localStorage
localStorage.getItem('dramabox_theme'); // 'dark' or 'light'
```

### Responsive Tidak Jalan?

```html
<!-- Pastikan ada viewport meta tag di index.html -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

### Hover Effect Tidak Smooth?

```css
/* Tambahkan transition */
.element {
  transition: var(--transition-normal);
}
```

### CSS Variables Tidak Bekerja?

```tsx
// Import themes.css di App.tsx atau main.tsx
import './styles/themes.css';
```

---

**Version:** 2.1.0  
**Last Updated:** 2024-01-01  
**Status:** Production Ready ✨

Dibuat dengan ❤️ menggunakan React + TypeScript + Vite