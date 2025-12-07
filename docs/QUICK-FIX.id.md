# ⚡ Quick Fix - Solusi Cepat Error Umum

Panduan singkat untuk mengatasi error yang sering muncul di DramaBox API.

---

## 🔴 Error: TLS Connection Disconnected

```
❌ Error: Client network socket disconnected before secure TLS connection was established
```

### ✅ Solusi Cepat:
```bash
# 1. Restart backend server
# Tekan Ctrl+C di terminal backend, lalu:
pnpm dev:backend

# 2. Jika masih error, coba restart dengan clean slate:
pkill -9 node
pnpm dev:backend
```

### 💡 Penjelasan:
- Error ini sudah **otomatis di-handle** oleh sistem retry v2.1.0
- Sistem akan **retry 3x** dengan delay 1s, 2s, 4s
- Jika masih muncul setelah retry, kemungkinan ada masalah jaringan

### 🔍 Cek Status:
```bash
# Test health endpoint
curl http://localhost:3000/health

# Should return:
# {"status":"ok","uptime":123.45,"timestamp":"..."}
```

---

## 🌐 Error: CORS Blocked

```
❌ Access to fetch at '...' has been blocked by CORS policy
```

### ✅ Solusi Cepat:
```bash
# Pastikan backend berjalan di terminal terpisah
pnpm dev:backend

# Di terminal lain, jalankan frontend
pnpm dev
```

### 💡 Penjelasan:
- Frontend HARUS menggunakan backend proxy
- Jangan akses `https://dramabox.sansekai.my.id` langsung
- Gunakan `http://localhost:3000` untuk semua API calls

---

## ⏱️ Error: Request Timeout

```
❌ Error: timeout of 30000ms exceeded
```

### ✅ Solusi Cepat:
```bash
# 1. Cek koneksi internet
ping google.com

# 2. Test upstream API
curl -I https://dramabox.sansekai.my.id/api/dramabox/latest

# 3. Restart backend
pnpm dev:backend
```

### 💡 Penjelasan:
- Request timeout setelah 30 detik
- Sistem akan **auto-retry** maksimal 3x
- Cek koneksi internet dan upstream API

---

## 🖼️ Error: Gambar Tidak Muncul

```
Missing thumbnails / Images not loading
```

### ✅ Solusi Cepat:
```bash
# 1. Hard reload browser
Ctrl + Shift + R (Windows/Linux)
Cmd + Shift + R (Mac)

# 2. Clear cache
Ctrl + Shift + Delete
> Clear cache and cookies

# 3. Cek network tab di DevTools (F12)
# Lihat apakah ada error pada image requests
```

### 💡 Penjelasan:
- Backend sudah normalize semua field names (v2.0+)
- Kemungkinan masalah di browser cache
- Atau image URL dari upstream API tidak valid

---

## 🎥 Error: Video Tidak Play

```
Video player stuck loading / Video not playing
```

### ✅ Solusi Cepat:
```bash
# 1. Cek stream endpoint
curl "http://localhost:3000/stream?bookId=YOUR_BOOK_ID&episode=1"

# 2. Coba browser lain
# Chrome/Edge: Best support
# Firefox: Good support
# Safari: Limited codec support

# 3. Restart backend
pnpm dev:backend
```

### 💡 Penjelasan:
- Stream URL bisa expired atau tidak valid
- Browser compatibility issues
- Network timeout saat fetch stream URL

---

## 🔍 Error: Search Tidak Ada Hasil

```
Search returns empty results
```

### ✅ Solusi Cepat:
```bash
# 1. Cek backend logs
# Harus melihat: "🔍 Proxying search: <keyword>"

# 2. Test search endpoint
curl "http://localhost:3000/search?keyword=love"

# 3. Coba keyword yang berbeda
# Minimal 1 karakter, gunakan keyword spesifik
```

### 💡 Penjelasan:
- Keyword terlalu umum atau tidak match
- Backend proxy tidak berjalan
- Upstream API tidak mengembalikan data

---

## 🔌 Error: Port Already in Use

```
❌ Error: listen EADDRINUSE: address already in use :::3000
```

### ✅ Solusi Cepat:
```bash
# Find and kill process on port 3000
npx kill-port 3000

# Or manual:
lsof -ti:3000 | xargs kill -9

# Or change port in backend/server.js
# const PORT = 3001;
```

---

## 📦 Error: pnpm install Gagal

```
❌ ENOENT: no such file or directory
```

### ✅ Solusi Cepat:
```bash
# Clean install
rm -rf node_modules pnpm-lock.yaml
pnpm install

# If still error, check pnpm version
pnpm --version  # Should be 10.x or higher

# Update pnpm if needed
npm install -g pnpm@latest
```

---

## 🛠️ Error: TypeScript/Build Error

```
❌ Cannot find module 'X' or its corresponding type declarations
```

### ✅ Solusi Cepat:
```bash
# 1. Clean install
rm -rf node_modules pnpm-lock.yaml
pnpm install

# 2. Clear Vite cache
rm -rf node_modules/.vite

# 3. Rebuild
pnpm build
```

---

## 🐌 Aplikasi Lambat / Lag

### ✅ Solusi Cepat:
```bash
# 1. Build production
pnpm build
pnpm preview  # Test production build

# 2. Clear browser cache
Ctrl + Shift + Delete

# 3. Restart backend
pnpm dev:backend

# 4. Check memory usage
# Chrome DevTools > Memory > Take snapshot
```

---

## 🆘 Nuclear Option (Reset Semua)

Jika semua solusi di atas tidak berhasil:

```bash
# 1. Kill semua process Node.js
pkill -9 node

# 2. Clean everything
rm -rf node_modules pnpm-lock.yaml dist backend/node_modules

# 3. Fresh install
pnpm install

# 4. Rebuild
pnpm build

# 5. Start backend
pnpm dev:backend

# 6. Start frontend (terminal baru)
pnpm dev
```

---

## 📊 Health Check Checklist

Sebelum report bug, cek dulu:

- [ ] ✅ Backend running? → `curl http://localhost:3000/health`
- [ ] ✅ Frontend running? → Buka http://localhost:5173
- [ ] ✅ Internet OK? → `ping google.com`
- [ ] ✅ Upstream API OK? → `curl -I https://dramabox.sansekai.my.id`
- [ ] ✅ Node.js version? → `node -v` (Should be 16+)
- [ ] ✅ pnpm installed? → `pnpm -v` (Should be 10.x)
- [ ] ✅ Browser console clean? → F12, check for errors
- [ ] ✅ Cache cleared? → Ctrl+Shift+R hard reload

---

## 🔍 Debug Mode

Untuk debugging lebih detail:

```bash
# Enable verbose logging (edit backend/server.js)
# Add this after each endpoint:
console.log('DEBUG:', JSON.stringify(data, null, 2));

# Or use pm2 for advanced monitoring
npm install -g pm2
pm2 start backend/server.js --name dramabox
pm2 monit
pm2 logs dramabox
```

---

## 📞 Masih Bermasalah?

1. **Baca dokumentasi lengkap:**
   - `docs/TROUBLESHOOTING.md` - Troubleshooting lengkap
   - `docs/NETWORK-RELIABILITY.id.md` - Detail network reliability
   - `docs/CHANGELOG.md` - Version history & breaking changes

2. **Cek logs:**
   - Backend: Terminal output
   - Frontend: Browser console (F12)
   - Network: DevTools > Network tab

3. **Test dengan cURL:**
   ```bash
   curl http://localhost:3000/health
   curl http://localhost:3000/latest
   curl http://localhost:3000/search?keyword=test
   curl "http://localhost:3000/stream?bookId=123&episode=1"
   ```

4. **Report bug dengan info:**
   - Error message lengkap
   - Browser + version
   - OS (Linux/Windows/Mac)
   - Steps to reproduce
   - Backend & frontend logs
   - Network tab screenshot

---

## 💡 Tips & Tricks

### Speed Up Development:
```bash
# Use PM2 for auto-restart on changes
pm2 start backend/server.js --watch --name dramabox

# Use concurrently to run both
pnpm dev:all  # If configured in package.json
```

### Monitor Performance:
```bash
# Check active connections
netstat -an | grep ESTABLISHED | wc -l

# Check memory usage
node --max-old-space-size=4096 backend/server.js

# Monitor logs
tail -f backend.log
```

### Production Deployment:
```bash
# Build for production
pnpm build

# Test production build locally
pnpm preview

# Start backend in production mode
NODE_ENV=production node backend/server.js
```

---

## 🎯 Quick Commands Reference

| Command | Description |
|---------|-------------|
| `pnpm install` | Install dependencies |
| `pnpm dev` | Start frontend dev server |
| `pnpm dev:backend` | Start backend dev server |
| `pnpm build` | Build for production |
| `pnpm preview` | Preview production build |
| `curl http://localhost:3000/health` | Check backend health |
| `Ctrl+Shift+R` | Hard reload browser |
| `F12` | Open DevTools |
| `pkill -9 node` | Kill all Node processes |

---

**Last Updated:** 2024-01-01  
**Version:** 2.1.0  
**Status:** Production Ready ✨

Made with ❤️ by DramaBox API Team