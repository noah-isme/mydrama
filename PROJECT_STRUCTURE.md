# 📂 Project Structure Guide

Complete visual guide of the DramaBox project structure after React + Vite migration.

---

## 🌲 Full Directory Tree

```
DramaBox-API/
│
├── 📁 src/                          # React Frontend Source Code
│   ├── 📁 components/               # Reusable React Components
│   │   ├── 📄 Header.jsx            # Application header
│   │   ├── 📄 Message.jsx           # Notification/toast messages
│   │   ├── 📄 DramaCard.jsx         # Drama card display
│   │   └── 📄 VideoPlayer.jsx       # Video player with controls
│   │
│   ├── 📄 App.jsx                   # Main application (monolithic)
│   ├── 📄 App-modular.jsx           # Main app (modular version)
│   ├── 📄 main.jsx                  # React entry point
│   └── 📄 index.css                 # Global CSS styles
│
├── 📁 backend/                      # Express.js Backend API
│   ├── 📄 server.js                 # Main Express server
│   ├── 📄 cors-proxy.js             # CORS proxy server
│   ├── 📄 latest.js                 # Latest dramas logic
│   ├── 📄 search.js                 # Search dramas logic
│   ├── 📄 link-stream.js            # Stream link logic
│   └── 📄 get-token.js              # Token utility
│
├── 📁 public/                       # Static Public Assets
│   └── 📄 vite.svg                  # Vite logo
│
├── 📁 docs/                         # Documentation
│   ├── 📄 README_VITE.md            # Complete React+Vite guide
│   ├── 📄 COMPONENTS.md             # Component documentation
│   ├── 📄 MIGRATION_SUMMARY.md      # Migration details
│   ├── 📄 API_CONFIGURATION.md      # API configuration guide
│   ├── 📄 API_STATUS.md             # API status information
│   ├── 📄 CORS_INFO.md              # CORS setup info
│   ├── 📄 ERROR_FIX.md              # Common error fixes
│   └── 📄 FRONTEND_README.md        # Frontend specific guide
│
├── 📁 backup/                       # Backup & Archive Files
│   ├── 📄 index-old.html            # Original HTML version
│   ├── 📄 server-backup.js          # Server backup
│   └── 📄 test-cors.html            # CORS testing file
│
├── 📁 dist/                         # Production Build Output (generated)
│   └── (Generated after npm run build)
│
├── 📁 node_modules/                 # NPM Dependencies (generated)
│   └── (Generated after npm install)
│
├── 📄 vite.config.js                # Vite Configuration
├── 📄 package.json                  # NPM Dependencies & Scripts
├── 📄 package-lock.json             # NPM Lock File
├── 📄 .eslintrc.cjs                 # ESLint Configuration
├── 📄 .gitignore                    # Git Ignore Rules
├── 📄 index.html                    # Vite HTML Entry Point
├── 📄 README.md                     # Main Documentation (This!)
├── 📄 CHANGELOG.md                  # Version History
├── 📄 QUICK_START.md                # Quick Start Guide
├── 📄 PROJECT_STRUCTURE.md          # This File
└── 📄 server.log                    # Server Logs
```

---

## 📦 Component Structure

### Frontend Components Hierarchy

```
App.jsx (Root Component)
│
├── Header.jsx
│   └── <header>
│       ├── <h1>🎬 DramaBox</h1>
│       └── <p>Nonton Drama Favorit Kamu</p>
│
├── Message.jsx
│   └── <div className="message">
│       └── <div className={type}>
│           └── {message text}
│
├── SearchSection
│   ├── Tabs
│   │   ├── Latest Tab Button
│   │   └── Search Tab Button
│   │
│   ├── Latest Tab Content
│   │   ├── Load Button
│   │   └── Drama Grid
│   │       └── DramaCard.jsx (multiple)
│   │           ├── <img> Drama Cover
│   │           └── <div> Drama Info
│   │
│   └── Search Tab Content
│       ├── Search Input
│       ├── Search Button
│       └── Results Grid
│           └── DramaCard.jsx (multiple)
│
└── VideoPlayer.jsx
    ├── VideoInfo
    │   ├── <h2> Drama Title
    │   └── <p> Drama Description
    │
    ├── EpisodeControls
    │   ├── Previous Button
    │   ├── Episode Input
    │   └── Next Button
    │
    └── VideoFrame
        └── <video> HTML5 Player
```

---

## 🔄 Data Flow

```
User Action
    ↓
React Component (Event Handler)
    ↓
State Update (useState)
    ↓
API Call (fetch)
    ↓
Backend API Server
    ↓
External Drama API
    ↓
Response Data
    ↓
Update React State
    ↓
Re-render Component
    ↓
Display to User
```

---

## 🗂️ File Types Overview

### JavaScript/JSX Files

| File | Type | Purpose |
|------|------|---------|
| `*.jsx` | React Component | UI components with JSX syntax |
| `*.js` | JavaScript | Backend logic, utilities |
| `main.jsx` | Entry Point | React application entry |
| `vite.config.js` | Config | Vite build configuration |
| `.eslintrc.cjs` | Config | ESLint rules |

### Style Files

| File | Type | Purpose |
|------|------|---------|
| `index.css` | CSS | Global styles for all components |

### Config Files

| File | Purpose |
|------|---------|
| `package.json` | Dependencies & scripts |
| `vite.config.js` | Vite configuration |
| `.eslintrc.cjs` | ESLint rules |
| `.gitignore` | Git ignore patterns |

### Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | Main documentation |
| `QUICK_START.md` | Quick setup guide |
| `CHANGELOG.md` | Version history |
| `docs/*.md` | Detailed documentation |

---

## 🎯 Entry Points

### Frontend Entry Point

```
Browser Request
    ↓
index.html (Vite entry)
    ↓
<script src="/src/main.jsx">
    ↓
main.jsx (React root)
    ↓
ReactDOM.render(<App />)
    ↓
App.jsx (Main component)
```

### Backend Entry Point

```
npm run server
    ↓
node backend/server.js
    ↓
Express App Initialize
    ↓
Routes Setup
    ↓
Listen on Port 3000
```

---

## 📊 Size Overview

### Approximate File Sizes

```
Frontend:
├── src/App.jsx              ~10 KB
├── src/components/*.jsx     ~2-5 KB each
├── src/index.css            ~7 KB
└── Total Source:            ~30 KB

Backend:
├── backend/server.js        ~5 KB
├── backend/*.js             ~2-3 KB each
└── Total Backend:           ~20 KB

Documentation:
├── docs/*.md                ~5-15 KB each
└── Total Docs:              ~100 KB

Dependencies:
├── node_modules/            ~150 MB
└── After Build (dist/):     ~200 KB
```

---

## 🔗 File Dependencies

### Frontend Dependencies Graph

```
main.jsx
    └── imports App.jsx
        └── imports components/
            ├── Header.jsx
            ├── Message.jsx
            ├── DramaCard.jsx
            └── VideoPlayer.jsx
```

### Backend Dependencies Graph

```
server.js
    ├── requires latest.js
    ├── requires search.js
    ├── requires link-stream.js
    └── requires get-token.js
```

---

## 🚀 Build Process

### Development Mode

```
npm run dev
    ↓
Vite Dev Server Start
    ↓
Parse vite.config.js
    ↓
Load index.html
    ↓
Transform src/main.jsx
    ↓
Hot Module Replacement Active
    ↓
Serve on localhost:5173
```

### Production Build

```
npm run build
    ↓
Vite Build Process
    ↓
Bundle all src/*.jsx files
    ↓
Minify JavaScript
    ↓
Optimize CSS
    ↓
Generate dist/ folder
    ├── index.html
    ├── assets/
    │   ├── index-[hash].js
    │   └── index-[hash].css
    └── vite.svg
```

---

## 📝 Folder Purpose Summary

| Folder | Purpose | Generated? |
|--------|---------|-----------|
| `src/` | React source code | ❌ Manual |
| `backend/` | Express API code | ❌ Manual |
| `public/` | Static assets | ❌ Manual |
| `docs/` | Documentation | ❌ Manual |
| `backup/` | Archived files | ❌ Manual |
| `dist/` | Production build | ✅ Auto |
| `node_modules/` | Dependencies | ✅ Auto |

---

## 🎨 Styling Structure

### CSS Organization

```
src/index.css
│
├── Global Resets
│   ├── * { margin: 0; padding: 0; }
│   └── Box-sizing
│
├── Body Styles
│   ├── Background Gradient
│   ├── Font Family
│   └── Padding
│
├── Component Styles
│   ├── .container
│   ├── .header
│   ├── .search-section
│   ├── .drama-card
│   ├── .video-section
│   └── .video-player
│
├── Utility Classes
│   ├── .loading
│   ├── .error
│   ├── .success
│   └── .message
│
└── Responsive Styles
    └── @media (max-width: 768px)
```

---

## 🔌 API Routing

### Backend Routes

```
Express Server (Port 3000)
│
├── GET /latest
│   └── backend/latest.js
│
├── GET /search?query=...
│   └── backend/search.js
│
└── GET /stream?bookId=...&episode=...
    └── backend/link-stream.js
```

### Frontend Proxy

```
Vite Dev Server (Port 5173)
│
└── Proxy: /api/* → http://localhost:3000/*
    │
    ├── /api/latest → http://localhost:3000/latest
    ├── /api/search → http://localhost:3000/search
    └── /api/stream → http://localhost:3000/stream
```

---

## 📦 NPM Scripts Workflow

```
Development:
npm run dev ────────────► Vite Dev Server (Frontend)
npm run server ─────────► Express Server (Backend)

Production:
npm run build ──────────► Create dist/ folder
npm run preview ────────► Preview production build

Quality:
npm run lint ───────────► ESLint check

Utility:
npm install ────────────► Install dependencies
npm run proxy ──────────► CORS proxy server
```

---

## 🎯 Key Files Explanation

### Must-Know Files

1. **src/App.jsx**
   - Main application logic
   - All state management
   - API calls
   - Component rendering

2. **backend/server.js**
   - Express server setup
   - API routes definition
   - CORS configuration
   - Port configuration

3. **vite.config.js**
   - Dev server settings
   - Build configuration
   - Proxy setup
   - Plugin configuration

4. **package.json**
   - Dependencies list
   - NPM scripts
   - Project metadata

5. **index.html**
   - Vite entry point
   - React mount point
   - Meta tags

---

## 🛠️ Modification Guide

### To Add New Component

1. Create: `src/components/NewComponent.jsx`
2. Import in: `src/App.jsx`
3. Use in JSX: `<NewComponent />`

### To Add New API Endpoint

1. Create: `backend/new-endpoint.js`
2. Import in: `backend/server.js`
3. Add route: `app.get('/new-endpoint', ...)`
4. Update frontend to use it

### To Change Styling

1. Edit: `src/index.css`
2. Changes auto-reload
3. No build needed in dev mode

### To Add New Page

1. Install: `npm install react-router-dom`
2. Create: `src/pages/NewPage.jsx`
3. Setup routes in: `src/App.jsx`

---

## ✅ Structure Best Practices

- ✅ Components in `src/components/`
- ✅ Backend code in `backend/`
- ✅ Documentation in `docs/`
- ✅ Backup files in `backup/`
- ✅ Static assets in `public/`
- ✅ Don't commit `node_modules/` or `dist/`
- ✅ Keep components small and focused
- ✅ Separate logic from presentation

---

**Last Updated:** December 2024  
**Version:** 2.0.0  
**Status:** ✅ Complete