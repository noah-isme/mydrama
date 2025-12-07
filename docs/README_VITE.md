# 🎬 DramaBox - React + Vite

Aplikasi web untuk menonton drama menggunakan React dan Vite dengan backend API Express.

## 📋 Deskripsi

Project ini telah diubah dari HTML vanilla menjadi React dengan Vite sebagai build tool. Frontend menggunakan React untuk UI yang lebih modern dan maintainable, sementara backend API tetap menggunakan Express.js.

## 🚀 Teknologi yang Digunakan

### Frontend
- **React 18** - Library UI
- **Vite 5** - Build tool & dev server yang cepat
- **CSS Vanilla** - Styling

### Backend
- **Express.js** - Web framework
- **Axios** - HTTP client
- **CORS** - Cross-Origin Resource Sharing
- **Node Fetch** - Fetch API untuk Node.js

## 📦 Instalasi

1. Clone repository ini
```bash
git clone <repository-url>
cd DramaBox-API
```

2. Install dependencies
```bash
npm install
```

## 🎮 Cara Menjalankan

### Menjalankan Frontend (React + Vite)

Development mode dengan hot reload:
```bash
npm run dev
```

Frontend akan berjalan di `http://localhost:5173`

Build untuk production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

### Menjalankan Backend API

Di terminal terpisah, jalankan server API:
```bash
npm run server
```

Backend API akan berjalan di `http://localhost:3000`

### Menjalankan CORS Proxy (Opsional)

Jika diperlukan proxy tambahan:
```bash
npm run proxy
```

## 📁 Struktur Project

```
DramaBox-API/
├── src/                      # Source code React
│   ├── components/           # Komponen React (kosong, siap digunakan)
│   ├── App.jsx              # Komponen utama aplikasi
│   ├── main.jsx             # Entry point React
│   └── index.css            # Global styles
├── public/                   # Static assets
├── dist/                     # Production build (generated)
├── server.js                 # Backend API server
├── cors-proxy.js             # CORS proxy server
├── get-token.js              # Token utility
├── latest.js                 # Latest dramas endpoint logic
├── link-stream.js            # Stream link endpoint logic
├── search.js                 # Search endpoint logic
├── vite.config.js           # Konfigurasi Vite
├── package.json             # Dependencies & scripts
├── index.html               # HTML entry point untuk Vite
└── index-old.html           # HTML lama (backup)
```

## 🔧 Konfigurasi

### Vite Config

File `vite.config.js` sudah dikonfigurasi dengan:
- React plugin
- Dev server di port 5173
- Proxy untuk API requests dari `/api` ke `http://localhost:3000`

### API Endpoints

Frontend mengakses backend melalui proxy `/api`:
- `GET /api/latest` - Mendapatkan drama terbaru
- `GET /api/search?query=<keyword>` - Mencari drama
- `GET /api/stream?bookId=<id>&episode=<num>` - Mendapatkan link streaming

## 🎯 Fitur

- ✅ Browse drama terbaru
- ✅ Pencarian drama
- ✅ Video player dengan kontrol episode
- ✅ Navigasi episode (previous/next)
- ✅ Responsive design
- ✅ Loading states
- ✅ Error handling
- ✅ Auto-hide notifications

## 🛠️ Development

### Menambah Komponen Baru

Buat komponen baru di folder `src/components/`:

```jsx
// src/components/MyComponent.jsx
function MyComponent() {
  return <div>Hello World</div>
}

export default MyComponent
```

Import di `App.jsx`:
```jsx
import MyComponent from './components/MyComponent'
```

### Styling

Gunakan CSS di `src/index.css` atau buat file CSS terpisah untuk setiap komponen.

### State Management

Saat ini menggunakan React hooks (useState, useEffect). Untuk aplikasi yang lebih kompleks, pertimbangkan menggunakan:
- Context API
- Redux
- Zustand

## 📝 Scripts NPM

| Script | Deskripsi |
|--------|-----------|
| `npm run dev` | Menjalankan Vite dev server (frontend) |
| `npm run build` | Build production frontend |
| `npm run preview` | Preview production build |
| `npm run server` | Menjalankan Express API server (backend) |
| `npm run proxy` | Menjalankan CORS proxy server |

## 🔒 Keamanan

- Video player menggunakan `controlsList="nodownload"` untuk mencegah download
- API requests menggunakan CORS
- Environment variables untuk sensitive data (recommended untuk production)

## 📱 Responsive Design

Aplikasi sudah responsive dan dapat diakses dari:
- Desktop
- Tablet
- Mobile devices

## 🐛 Troubleshooting

### Port sudah digunakan

Jika port 5173 atau 3000 sudah digunakan:
1. Ubah port di `vite.config.js` (frontend)
2. Ubah port di `server.js` (backend)
3. Update API_BASE di `App.jsx` jika perlu

### CORS Error

Pastikan:
1. Backend server berjalan di `http://localhost:3000`
2. Vite proxy sudah dikonfigurasi dengan benar
3. CORS middleware sudah diaktifkan di server

### Module not found

Jalankan:
```bash
npm install
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)

1. Build production:
```bash
npm run build
```

2. Deploy folder `dist/`

### Backend (Railway/Render)

1. Deploy file backend (server.js, dll)
2. Set environment variables
3. Update API_BASE di frontend dengan URL production backend

## 📄 Lisensi

ISC

## 👨‍💻 Author

DramaBox API

---

**Note**: File `index-old.html` adalah backup dari HTML original sebelum migrasi ke React.