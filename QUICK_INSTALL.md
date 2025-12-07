# ⚡ Quick Installation Guide - DramaBox v2.0

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies
```bash
cd DramaBox-API
npm install
```

### Step 2: Start Development Servers
```bash
# Terminal 1 - Frontend (Vite)
npm run dev

# Terminal 2 - Backend (Express)
npm run server
```

### Step 3: Open in Browser
```
Frontend: http://localhost:5173
Backend API: http://localhost:3000
```

---

## 📦 What's Included

### ✅ All 7 Features Ready to Use
1. ✨ **TypeScript** - Type-safe code
2. 🧭 **React Router** - Multi-page navigation
3. 🌓 **Light/Dark Mode** - Theme toggle
4. 💖 **Favorites** - Bookmark dramas
5. 📺 **Watch History** - Track viewing
6. 🔐 **Auth UI** - Login/Register (demo)
7. 🎛️ **Advanced Filters** - Filter & sort

---

## 🎯 Quick Tour

### 1. Browse Dramas
- Home page shows trending dramas
- Search for specific titles
- Click "Show Filters" for advanced options

### 2. Toggle Theme
- Click ☀️/🌙 icon in navbar
- Theme saves automatically

### 3. Add Favorites
- Click ❤️ heart icon on any drama
- View all in `/favorites` page

### 4. Watch Dramas
- Click any drama card to play
- History tracked automatically
- Resume from `/history` page

### 5. Sign In (Demo)
- Click "Sign In" button
- Use any username/password
- Profile shows in navbar

### 6. Filter Content
- Click "Show Filters" button
- Select genres, ratings
- Choose sort order
- Results update live

---

## 🔧 Available Commands

```bash
# Development
npm run dev              # Start frontend dev server
npm run server           # Start backend API server

# Building
npm run build            # Build for production
npm run preview          # Preview production build

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # Check TypeScript types

# API Servers
npm run proxy            # Start CORS proxy
```

---

## 📱 Access Points

### Pages
- `/` - Home (trending & search)
- `/favorites` - Your favorites
- `/history` - Watch history
- `/auth` - Login/Register

### API Endpoints
- `GET /api/latest` - Latest dramas
- `GET /api/search?query={keyword}` - Search
- `GET /api/stream?bookId={id}&episode={ep}` - Stream

---

## 🎨 Quick Feature Access

### Theme Toggle
- Location: Navbar (top right)
- Icon: ☀️ (light) / 🌙 (dark)
- Persists: localStorage

### Favorites
- Add: Click ❤️ on drama card
- View: Navbar → "Favorites" or `/favorites`
- Count: Badge on navbar link

### History
- Auto-tracked: When playing videos
- View: Navbar → "History" or `/history`
- Continue: "Continue Watching" tab

### Filters
- Access: "Show Filters" button on home
- Options: Genres, ratings, sort
- Clear: "Clear Filters" button

---

## 💾 Data Storage

All data stored in browser localStorage:
- `dramabox_favorites` - Saved dramas
- `dramabox_history` - Watch history
- `dramabox_theme` - Light/dark preference
- `dramabox_user` - User profile (demo)

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Change Vite port (vite.config.ts)
server: { port: 5174 }

# Change backend port (backend/server.js)
const PORT = 3001;
```

### Dependencies Not Installing
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Build Errors
```bash
npm run type-check  # Check TypeScript errors
npm run lint        # Check code quality
```

### LocalStorage Not Working
- Check browser privacy settings
- Enable cookies/storage
- Try incognito mode

---

## 📱 Mobile Testing

### Local Network Access
```bash
# Find your IP
ifconfig | grep inet  # Mac/Linux
ipconfig              # Windows

# Access from mobile
http://YOUR_IP:5173
```

### Responsive Testing
- Chrome DevTools (F12)
- Toggle device toolbar (Ctrl+Shift+M)
- Test various screen sizes

---

## 🚀 Production Deployment

### Build
```bash
npm run build
```

### Output
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   └── index-[hash].css
└── ...
```

### Deploy To
- **Vercel**: `vercel deploy`
- **Netlify**: Drag & drop `dist/` folder
- **GitHub Pages**: Push to `gh-pages` branch
- **Any Static Host**: Upload `dist/` folder

---

## 🎓 Learn More

### Documentation
- `README.md` - Main documentation
- `NEW_FEATURES_README.md` - Feature details
- `FEATURES_IMPLEMENTATION.md` - Technical guide
- `PROJECT_STRUCTURE.md` - Architecture overview

### Key Files
- `src/App-new.tsx` - Main app with routing
- `src/types/index.ts` - TypeScript types
- `src/contexts/` - Global state
- `src/hooks/` - Custom hooks
- `src/pages/` - Page components

---

## ✅ Verify Installation

### Checklist
- [ ] Dependencies installed (no errors)
- [ ] Frontend runs on port 5173
- [ ] Backend runs on port 3000
- [ ] Can browse dramas
- [ ] Can search dramas
- [ ] Theme toggle works
- [ ] Can add to favorites
- [ ] Watch history records
- [ ] Can sign in
- [ ] Filters work

---

## 🆘 Need Help?

### Check These First
1. All terminals running?
2. Correct Node version? (v18+)
3. Ports available?
4. Browser console errors?
5. Network requests working?

### Common Solutions
- Restart dev servers
- Clear browser cache
- Check backend logs
- Verify API endpoints
- Test in incognito mode

---

## 🎉 You're Ready!

Your DramaBox platform is now running with all 7 features:
- ✅ TypeScript
- ✅ React Router
- ✅ Light/Dark Mode
- ✅ Favorites
- ✅ Watch History
- ✅ User Auth UI
- ✅ Advanced Filters

**Enjoy streaming! 🍿**

---

**Quick Start Time:** ~5 minutes  
**Full Setup Time:** ~10 minutes  
**Version:** 2.0.0