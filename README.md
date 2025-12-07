# 🎬 DramaBox - React + Vite

![React](https://img.shields.io/badge/React-18.3.1-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-5.4.21-646CFF?logo=vite)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue?logo=typescript)
![Express](https://img.shields.io/badge/Express-4.22.1-green?logo=express)
![Node.js](https://img.shields.io/badge/Node.js-16+-339933?logo=node.js)
![pnpm](https://img.shields.io/badge/pnpm-10.20.0-F69220?logo=pnpm)

Aplikasi web modern untuk menonton drama menggunakan **React**, **TypeScript**, dan **Vite**, dengan backend API berbasis **Express.js**. Menggunakan **pnpm** sebagai package manager untuk performa dan efisiensi terbaik.

---

## ✨ Fitur Utama

- 🎥 **Video Player** - Streaming drama dengan kontrol episode
- 🔍 **Search & Filter** - Cari drama favorit dengan mudah
- 📺 **Latest Dramas** - Browse drama terbaru
- ❤️ **Favorites** - Simpan drama favorit Anda
- 📖 **Watch History** - Lacak drama yang telah ditonton
- 🎨 **Theme Toggle** - Light/Dark mode
- 🔐 **Authentication** - Login/Register sistem
- 🎯 **Episode Navigation** - Previous/Next episode
- 📱 **Responsive Design** - Works on mobile, tablet, desktop
- ⚡ **Lightning Fast** - Powered by Vite + pnpm
- 🧩 **Component-Based** - React + TypeScript components
- 🎭 **Enterprise Grade** - Production-ready architecture

---

## 📋 Prerequisites

Pastikan sudah terinstall:
- **Node.js** versi 16 atau lebih tinggi
- **pnpm** (package manager) - [Install pnpm](https://pnpm.io/installation)

### Install pnpm

```bash
# Via npm
npm install -g pnpm

# Via Homebrew (Mac)
brew install pnpm

# Via Curl (Linux/Mac)
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

> **Note:** Project ini menggunakan **pnpm** untuk package management yang lebih cepat dan efisien (~50% lebih cepat dari npm).

### 2. Jalankan Backend API

Buka terminal pertama:

```bash
pnpm run server
```

Server API akan berjalan di: **http://localhost:3000**

### 3. Jalankan Frontend React

Buka terminal kedua (biarkan backend tetap berjalan):

```bash
pnpm run dev
```

Frontend akan berjalan di: **http://localhost:5173**

### 4. Buka di Browser

Akses aplikasi di: **http://localhost:5173**

---

## 📁 Struktur Project

```
DramaBox-API/
├── src/                       # Frontend React source
│   ├── components/            # React components
│   │   ├── Header.jsx         # Header component
│   │   ├── Message.jsx        # Notification component
│   │   ├── DramaCard.jsx      # Drama card component
│   │   └── VideoPlayer.jsx    # Video player component
│   ├── App.jsx                # Main app (monolithic)
│   ├── App-modular.jsx        # Main app (modular version)
│   ├── main.jsx               # React entry point
│   └── index.css              # Global styles
│
├── backend/                   # Backend API server
│   ├── server.js              # Express API server
│   ├── cors-proxy.js          # CORS proxy
│   ├── latest.js              # Latest dramas endpoint
│   ├── search.js              # Search endpoint
│   ├── link-stream.js         # Stream link endpoint
│   └── get-token.js           # Token utility
│
├── public/                    # Static assets
│   └── vite.svg               # Vite logo
│
├── docs/                      # Documentation
│   ├── README_VITE.md         # Complete React+Vite guide
│   ├── COMPONENTS.md          # Component documentation
│   ├── MIGRATION_SUMMARY.md   # Migration details
│   ├── API_CONFIGURATION.md   # API config
│   ├── API_STATUS.md          # API status
│   ├── CORS_INFO.md           # CORS information
│   ├── ERROR_FIX.md           # Common errors
│   └── FRONTEND_README.md     # Frontend guide
│
├── backup/                    # Backup files
│   ├── index-old.html         # Original HTML version
│   ├── server-backup.js       # Server backup
│   └── test-cors.html         # CORS test
│
├── dist/                      # Production build (generated)
├── node_modules/              # Dependencies
│
├── vite.config.js             # Vite configuration
├── package.json               # Dependencies & scripts
├── .eslintrc.cjs             # ESLint configuration
├── .gitignore                # Git ignore rules
├── index.html                # Vite HTML entry
├── CHANGELOG.md              # Version history
├── QUICK_START.md            # Quick start guide
└── README.md                 # This file
```

---

## 📜 PNPM Scripts

| Command | Description |
|---------|-------------|
| `pnpm run dev` | Start Vite development server (Frontend) |
| `pnpm run build` | Build for production (TypeScript + Vite) |
| `pnpm run preview` | Preview production build |
| `pnpm run lint` | Run ESLint for code quality |
| `pnpm run type-check` | TypeScript type checking |
| `pnpm run server` | Start Express API server (Backend) |
| `pnpm run proxy` | Start CORS proxy server |

> **Why pnpm?** Faster installs (~50%), saves disk space (~50%), strict dependency resolution, and better monorepo support.

---

## 🔧 Development

### Frontend Development

1. Start backend: `pnpm run server`
2. Start frontend: `pnpm run dev`
3. Edit files in `src/`
4. Changes auto-reload with HMR (Hot Module Replacement)
5. TypeScript type checking in real-time

### Backend Development

1. Edit files in `backend/`
2. Restart server: `pnpm run server`

### TypeScript Development

All components are now in TypeScript (`.tsx`):
- Strong typing for better IDE support
- Catch errors at compile time
- Better refactoring support
- Enhanced autocomplete

Run type checking:
```bash
pnpm run type-check
```

---

## 🏗️ Production Build

### Build Frontend

```bash
pnpm run build
```

Output akan ada di folder `dist/`

**Build Stats:**
- ✓ 50 modules transformed
- Bundle size: ~275 KB (minified + gzipped ~70 KB)
- Built in ~2s

### Preview Build

```bash
pnpm run preview
```

### Deploy

**Frontend (Vercel/Netlify):**
- Upload folder `dist/`
- Set build command: `pnpm run build`
- Set output directory: `dist`
- Set package manager: `pnpm`

**Backend (Railway/Render):**
- Deploy folder `backend/`
- Set start command: `node backend/server.js`
- Set environment variables jika diperlukan

---

## 🎯 API Endpoints

Backend menyediakan endpoints berikut:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/latest` | GET | Get latest dramas |
| `/search?query=<keyword>` | GET | Search dramas |
| `/stream?bookId=<id>&episode=<num>` | GET | Get stream URL |

**Base URL:** `http://localhost:3000`

Frontend mengakses via proxy: `/api/*` → `http://localhost:3000/*`

---

## 🎨 Customization

### Change Theme Colors

Edit `src/index.css`:

```css
body {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  /* Change to your preferred gradient */
}
```

### Add New Component

1. Create file in `src/components/`:

```jsx
// src/components/MyComponent.jsx
function MyComponent() {
  return <div>My Component</div>
}

export default MyComponent
```

2. Import in `App.jsx`:

```jsx
import MyComponent from './components/MyComponent'
```

### Change API URL

Edit `src/App.jsx`:

```javascript
const API_BASE = '/api' // or your custom URL
```

---

## 📚 Documentation

Dokumentasi lengkap tersedia di folder `docs/`:

- **[README_VITE.md](docs/README_VITE.md)** - Panduan lengkap React + Vite
- **[QUICK_START.md](QUICK_START.md)** - Panduan cepat memulai
- **[COMPONENTS.md](docs/COMPONENTS.md)** - Dokumentasi komponen
- **[MIGRATION_SUMMARY.md](docs/MIGRATION_SUMMARY.md)** - Detail migrasi
- **[CHANGELOG.md](CHANGELOG.md)** - Riwayat perubahan

---

## 🐛 Troubleshooting

### Port Already in Use

**Backend (Port 3000):**
```bash
# Find and kill process
lsof -i :3000  # Mac/Linux
netstat -ano | findstr :3000  # Windows
```

Or edit `backend/server.js` to change port.

**Frontend (Port 5173):**

Edit `vite.config.js`:
```javascript
server: {
  port: 5174, // or any available port
}
```

### CORS Error

Pastikan:
1. Backend running di `http://localhost:3000`
2. Proxy configured di `vite.config.js`
3. CORS enabled di backend

### Cannot GET /

Akses frontend di: `http://localhost:5173` atau `http://localhost:5174` (bukan 3000)

### Module Not Found

```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Build Errors

```bash
# Clean install
rm -rf node_modules pnpm-lock.yaml dist
pnpm install
pnpm run build
```

---

## 🔒 Security

- Video player: `controlsList="nodownload"` 
- CORS configured for API security
- Environment variables support ready
- No sensitive data in client-side code

---

## 📊 Tech Stack

### Frontend
- **React 18.3.1** - UI library
- **TypeScript 5.9.3** - Type safety
- **Vite 5.4.21** - Build tool & dev server
- **React Router 6.30.2** - Client-side routing
- **LocalForage 1.10.0** - Offline storage
- **ESLint** - Code linting

### Backend
- **Express 4.22.1** - Web framework
- **Axios 1.13.2** - HTTP client
- **CORS 2.8.5** - CORS middleware
- **Node Fetch 3.3.2** - Fetch API

### Package Manager
- **pnpm 10.20.0** - Fast, disk space efficient package manager
  - ~50% faster than npm
  - ~50% less disk space
  - Strict dependency resolution

---

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Vite Documentation](https://vitejs.dev)
- [pnpm Documentation](https://pnpm.io)
- [Express Documentation](https://expressjs.com)
- [MDN Web Docs](https://developer.mozilla.org)

---

## 📝 Version

**Current Version:** 2.0.0

**Changes from v1.0.0:**
- ✅ Migrated from vanilla HTML to React + TypeScript
- ✅ Added Vite as build tool
- ✅ Migrated from npm to pnpm
- ✅ Component-based architecture with strong typing
- ✅ Modern development workflow
- ✅ Hot Module Replacement
- ✅ Enterprise-grade features (Favorites, History, Auth, Themes)
- ✅ Production-ready with optimized builds

See [CHANGELOG.md](CHANGELOG.md) for details.

---

## 🤝 Contributing

Contributions welcome! 

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

---

## 📄 License

ISC License

---

## 👨‍💻 Author

**DramaBox API**

---

## 🙏 Acknowledgments

- React team for amazing library
- Vite team for blazing fast build tool
- Express.js community
- All contributors and users

---

## 📞 Support

Having issues? Check:

1. **Documentation** in `docs/` folder
2. **Common Issues** in `docs/ERROR_FIX.md`
3. **Quick Start** in `QUICK_START.md`
4. **pnpm Migration** in `PNPM_MIGRATION.md`

---

## 🎉 What's New in v2.0

- 🚀 **100% TypeScript** - Full type safety
- ⚡ **pnpm Package Manager** - 50% faster installs
- ❤️ **Favorites System** - Save your favorite dramas
- 📖 **Watch History** - Track what you've watched
- 🎨 **Theme Toggle** - Light/Dark mode support
- 🔐 **Authentication** - Login/Register ready
- 🎭 **Production Ready** - Optimized builds & enterprise features
- 📦 **379 Packages** - All managed efficiently with pnpm

---

**Happy Coding! 🎉**

Made with ❤️ using React + TypeScript + Vite + pnpm