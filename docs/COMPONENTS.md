# 📦 Dokumentasi Komponen React

Dokumen ini menjelaskan struktur dan penggunaan komponen-komponen React dalam aplikasi DramaBox.

## 📁 Struktur Komponen

```
src/
├── components/
│   ├── Header.jsx          # Header aplikasi
│   ├── Message.jsx         # Notifikasi pesan
│   ├── DramaCard.jsx       # Card untuk menampilkan drama
│   └── VideoPlayer.jsx     # Video player dengan kontrol
├── App.jsx                 # Komponen utama (monolithic)
├── App-modular.jsx         # Komponen utama (modular)
├── main.jsx               # Entry point
└── index.css              # Global styles
```

---

## 🎯 Komponen Utama

### App.jsx

Komponen root aplikasi yang mengelola semua state dan logika.

**State Management:**
- `activeTab`: Tab yang aktif ('latest' atau 'search')
- `searchKeyword`: Kata kunci pencarian
- `latestDramas`: Array drama terbaru
- `searchResults`: Array hasil pencarian
- `loading`: Status loading
- `message`: Pesan notifikasi
- `currentDrama`: Drama yang sedang diputar
- `currentEpisode`: Episode saat ini
- `maxEpisode`: Maksimal episode
- `videoUrl`: URL video streaming

**Key Functions:**
- `loadLatestDramas()`: Memuat drama terbaru dari API
- `searchDrama()`: Mencari drama berdasarkan keyword
- `selectDrama()`: Memilih drama untuk diputar
- `loadEpisode()`: Memuat episode tertentu
- `changeEpisode()`: Mengubah episode
- `previousEpisode()`: Episode sebelumnya
- `nextEpisode()`: Episode selanjutnya

---

## 🧩 Komponen Reusable

### 1. Header.jsx

Komponen header aplikasi yang menampilkan judul dan tagline.

**Props:** Tidak ada

**Usage:**
```jsx
import Header from './components/Header'

<Header />
```

**Output:**
- Judul: "🎬 DramaBox"
- Tagline: "Nonton Drama Favorit Kamu"

---

### 2. Message.jsx

Komponen untuk menampilkan pesan notifikasi (success/error).

**Props:**
- `message` (string): Teks pesan yang ditampilkan
- `type` (string): Tipe pesan ('success' atau 'error')

**Usage:**
```jsx
import Message from './components/Message'

<Message 
  message="✅ Episode berhasil dimuat!" 
  type="success" 
/>
```

**Styling:**
- `.error`: Background merah untuk error
- `.success`: Background hijau untuk success
- Auto-hide setelah 5 detik (diatur di parent)

---

### 3. DramaCard.jsx

Komponen card untuk menampilkan informasi drama.

**Props:**
- `drama` (object): Data drama
  - `bookId`: ID drama
  - `name`: Nama drama
  - `cover`: URL cover image
  - `verticalCover`: URL cover vertikal
  - `description`: Deskripsi drama
  - `introduction`: Intro drama (alternatif)
  - `chapterNum`: Jumlah episode
  - `chapterCount`: Jumlah episode (alternatif)
  - `viewNum`: Jumlah views
- `onSelect` (function): Callback saat drama diklik

**Usage:**
```jsx
import DramaCard from './components/DramaCard'

<DramaCard 
  drama={dramaObject} 
  onSelect={(bookId, name, desc, episodes) => {
    // Handle drama selection
  }}
/>
```

**Features:**
- Menampilkan cover image drama
- Format angka views (K/M)
- Fallback jika image error
- Lazy loading image
- Click handler untuk memilih drama

---

### 4. VideoPlayer.jsx

Komponen video player dengan kontrol episode.

**Props:**
- `currentDrama` (object): Drama yang sedang diputar
  - `name`: Nama drama
  - `description`: Deskripsi drama
- `currentEpisode` (number): Episode saat ini
- `maxEpisode` (number): Maksimal episode
- `videoUrl` (string): URL video streaming
- `onEpisodeChange` (function): Callback saat episode diubah
- `onPrevious` (function): Callback tombol previous
- `onNext` (function): Callback tombol next

**Usage:**
```jsx
import VideoPlayer from './components/VideoPlayer'

<VideoPlayer
  currentDrama={dramaObject}
  currentEpisode={1}
  maxEpisode={100}
  videoUrl="https://example.com/video.mp4"
  onEpisodeChange={(ep) => handleEpisodeChange(ep)}
  onPrevious={() => handlePrevious()}
  onNext={() => handleNext()}
/>
```

**Features:**
- Video HTML5 dengan controls
- Disable download (controlsList="nodownload")
- Auto-play saat video dimuat
- Input number untuk ganti episode manual
- Button previous/next dengan disable state
- Loading state saat video belum ready

---

## 🔄 App-modular.jsx

Versi modular dari `App.jsx` yang menggunakan komponen-komponen terpisah.

**Perbedaan dengan App.jsx:**
- Menggunakan komponen `Header`
- Menggunakan komponen `Message`
- Menggunakan komponen `DramaCard`
- Menggunakan komponen `VideoPlayer`
- Lebih mudah di-maintain
- Kode lebih bersih dan reusable

**Cara Menggunakan:**

1. Ganti import di `main.jsx`:
```jsx
// Dari:
import App from './App.jsx'

// Menjadi:
import App from './App-modular.jsx'
```

2. Atau rename file:
```bash
mv src/App.jsx src/App-old.jsx
mv src/App-modular.jsx src/App.jsx
```

---

## 🎨 Styling

Semua komponen menggunakan class CSS yang didefinisikan di `src/index.css`.

**Key Classes:**
- `.container`: Container utama
- `.search-section`: Section pencarian
- `.drama-grid`: Grid layout untuk drama cards
- `.drama-card`: Card drama
- `.video-section`: Section video player
- `.video-player`: Container video
- `.episode-controls`: Kontrol episode
- `.loading`: Loading state
- `.message`: Container pesan
- `.error`: Pesan error
- `.success`: Pesan success
- `.tabs`: Tab navigation
- `.tab`: Individual tab

---

## 🔧 Best Practices

### 1. Props Validation

Tambahkan PropTypes untuk validasi (optional):

```jsx
import PropTypes from 'prop-types'

DramaCard.propTypes = {
  drama: PropTypes.shape({
    bookId: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    cover: PropTypes.string,
    // ... props lainnya
  }).isRequired,
  onSelect: PropTypes.func.isRequired
}
```

### 2. Component Splitting

Jika komponen terlalu besar, pecah menjadi sub-komponen:

```jsx
// Contoh: VideoPlayer bisa dipecah
VideoPlayer/
├── index.jsx          # Main component
├── VideoInfo.jsx      # Info drama
├── EpisodeControls.jsx  # Kontrol episode
└── VideoFrame.jsx     # Video element
```

### 3. Custom Hooks

Buat custom hooks untuk logic yang reusable:

```jsx
// hooks/useAPI.js
export function useAPI() {
  const fetchAPI = async (endpoint, params) => {
    // API logic
  }
  return { fetchAPI }
}

// Usage:
import { useAPI } from './hooks/useAPI'
const { fetchAPI } = useAPI()
```

### 4. Context API

Untuk state global, gunakan Context API:

```jsx
// context/DramaContext.jsx
export const DramaContext = createContext()

export function DramaProvider({ children }) {
  const [currentDrama, setCurrentDrama] = useState(null)
  
  return (
    <DramaContext.Provider value={{ currentDrama, setCurrentDrama }}>
      {children}
    </DramaContext.Provider>
  )
}
```

---

## 📊 Component Tree

```
App
├── Header
├── Message
├── SearchSection
│   ├── Tabs
│   ├── LatestTab
│   │   └── DramaCard[] (multiple)
│   └── SearchTab
│       └── DramaCard[] (multiple)
└── VideoPlayer
    ├── VideoInfo
    ├── EpisodeControls
    └── VideoFrame
```

---

## 🚀 Future Improvements

### Komponen yang Bisa Ditambahkan:

1. **LoadingSpinner.jsx**
   - Reusable loading component
   - Different styles (spinner, skeleton, etc)

2. **SearchBox.jsx**
   - Dedicated search component
   - Autocomplete feature
   - Search history

3. **TabNavigation.jsx**
   - Reusable tab component
   - Dynamic tabs from config

4. **DramaGrid.jsx**
   - Grid layout component
   - Pagination
   - Infinite scroll

5. **ErrorBoundary.jsx**
   - Catch React errors
   - Fallback UI

6. **Modal.jsx**
   - Drama details modal
   - Settings modal

7. **Footer.jsx**
   - Footer dengan info
   - Links

---

## 📚 Resources

- [React Docs - Components](https://react.dev/learn/your-first-component)
- [React Patterns](https://reactpatterns.com/)
- [Component Design Patterns](https://www.patterns.dev/posts/react-component-patterns/)

---

**Happy Component Building! 🎉**