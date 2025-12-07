# 🔧 Troubleshooting Guide

Panduan lengkap untuk mengatasi masalah umum yang mungkin terjadi pada DramaBox API.

---

## 📋 Daftar Isi

1. [TLS Connection Errors](#tls-connection-errors)
2. [CORS Errors](#cors-errors)
3. [Video Playback Issues](#video-playback-issues)
4. [Search Not Working](#search-not-working)
5. [Missing Thumbnails](#missing-thumbnails)
6. [Performance Issues](#performance-issues)
7. [Build & Development Errors](#build--development-errors)

---

## 🔐 TLS Connection Errors

### Error: "Client network socket disconnected before secure TLS connection was established"

**Gejala:**
```
❌ Error: request to https://dramabox.sansekai.my.id/api/dramabox/stream?bookId=41000114584&episode=1 failed, 
reason: Client network socket disconnected before secure TLS connection was established
```

**Penyebab:**
- Keep-alive connections yang tidak di-manage dengan baik
- Connection pooling yang tidak optimal
- TLS handshake failures pada koneksi yang di-reuse
- Network timeout yang terlalu pendek
- DNS resolution issues

**Solusi yang Sudah Diimplementasikan (v2.0+):**

✅ **Enhanced HTTP Agent Configuration:**
```javascript
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
  keepAlive: true,
  keepAliveMsecs: 1000,
  maxSockets: 50,
  maxFreeSockets: 10,
  timeout: 60000,
  freeSocketTimeout: 30000,
});
```

✅ **Automatic Retry Logic:**
- Maximum 3 retry attempts
- Exponential backoff (1s, 2s, 4s)
- Handles retryable errors: ECONNRESET, ETIMEDOUT, ENOTFOUND, dll.

✅ **Request Timeout:**
- 30 second timeout per request
- Automatic abort on timeout

**Manual Troubleshooting:**

1. **Restart Backend Server:**
   ```bash
   # Stop server (Ctrl+C)
   pnpm dev:backend
   ```

2. **Check Network Connection:**
   ```bash
   # Test connectivity to upstream API
   curl -I https://dramabox.sansekai.my.id/api/dramabox/latest
   ```

3. **Clear DNS Cache (Linux):**
   ```bash
   sudo systemd-resolve --flush-caches
   # or
   sudo /etc/init.d/nscd restart
   ```

4. **Check System Resources:**
   ```bash
   # Check available file descriptors
   ulimit -n
   
   # If too low, increase it
   ulimit -n 4096
   ```

5. **Monitor Active Connections:**
   ```bash
   # Check active sockets
   netstat -an | grep ESTABLISHED | wc -l
   ```

**Logs to Look For:**
```
⚠️  Retry 1/3 after 1000ms...
⚠️  Retry 2/3 after 2000ms...
⚠️  Retry 3/3 after 4000ms...
```

Jika Anda melihat log retry, artinya sistem sedang mencoba mengatasi error secara otomatis.

---

## 🌐 CORS Errors

### Error: "Access to fetch at '...' from origin '...' has been blocked by CORS policy"

**Penyebab:**
- Backend proxy tidak berjalan
- Frontend mengakses API upstream secara langsung

**Solusi:**

1. **Pastikan Backend Berjalan:**
   ```bash
   pnpm dev:backend
   ```
   
   Harus melihat output:
   ```
   🎬 DramaBox CORS Proxy: http://localhost:3000
   ✅ CORS BYPASS ENABLED!
   ```

2. **Cek Frontend Config:**
   File `src/services/api.ts` harus menggunakan:
   ```typescript
   const API_BASE_URL = 'http://localhost:3000';
   ```

3. **Jangan Akses Upstream Langsung:**
   ❌ Salah: `https://dramabox.sansekai.my.id/api/dramabox/latest`
   ✅ Benar: `http://localhost:3000/latest`

---

## 🎥 Video Playback Issues

### Video Tidak Mau Diputar / Loading Terus

**Penyebab:**
- Stream URL tidak valid
- Video format tidak didukung browser
- Network issues
- CORS issues pada video CDN

**Solusi:**

1. **Check Browser Console:**
   - Buka Developer Tools (F12)
   - Lihat tab Console dan Network

2. **Test Stream Endpoint:**
   ```bash
   curl "http://localhost:3000/stream?bookId=41000114584&episode=1"
   ```
   
   Should return:
   ```json
   {
     "status": true,
     "data": {
       "url": "https://...",
       "episode": 1,
       "bookId": "41000114584"
     }
   }
   ```

3. **Try Different Browser:**
   - Chrome/Edge: Best compatibility
   - Firefox: Good support
   - Safari: Limited codec support

4. **Check Video URL:**
   - Pastikan URL valid dan accessible
   - Test URL langsung di browser

---

## 🔍 Search Not Working

### Search Tidak Mengembalikan Hasil

**Penyebab:**
- Keyword terlalu pendek
- API upstream down
- Network issues

**Solusi:**

1. **Test Search Endpoint:**
   ```bash
   curl "http://localhost:3000/search?keyword=love"
   ```

2. **Check Minimum Length:**
   - Keyword harus minimal 1 karakter
   - Gunakan keyword yang spesifik

3. **Check Backend Logs:**
   ```
   🔍 Proxying search: love
   ✅ Returned: 25 results
   ```

---

## 🖼️ Missing Thumbnails

### Gambar/Thumbnail Tidak Muncul

**Penyebab:**
- Field name mismatch antara API responses
- Image URL tidak valid
- CORS issues pada image CDN

**Solusi yang Sudah Diimplementasikan:**

✅ Backend sudah normalize semua field names:
```javascript
{
  cover: item.cover || item.coverWap,
  verticalCover: item.cover || item.coverWap,
  name: item.bookName,
  tags: item.tagNames || item.tags || [],
}
```

**Manual Check:**

1. **Inspect Element:**
   - Right-click pada area gambar
   - Pilih "Inspect"
   - Check `src` attribute di img tag

2. **Test Image URL:**
   - Copy image URL
   - Paste di browser address bar
   - Cek apakah bisa diakses

3. **Check Network Tab:**
   - Buka Developer Tools (F12)
   - Tab Network
   - Filter: Img
   - Lihat status code setiap image request

---

## 🐌 Performance Issues

### Aplikasi Lambat / Lag

**Penyebab:**
- Too many API calls
- Large dataset rendering
- Memory leaks
- Network latency

**Solusi:**

1. **Enable Production Build:**
   ```bash
   pnpm build
   pnpm preview
   ```

2. **Check Memory Usage:**
   - Chrome DevTools > Memory
   - Take heap snapshot
   - Look for memory leaks

3. **Monitor Network:**
   - DevTools > Network
   - Check number of requests
   - Look for slow requests

4. **Optimize Backend:**
   - Restart backend server regularly
   - Monitor connection pool:
   ```bash
   # Check active connections
   lsof -i :3000
   ```

5. **Clear Browser Cache:**
   - Ctrl+Shift+Delete
   - Clear cache and cookies
   - Hard reload (Ctrl+Shift+R)

---

## 🛠️ Build & Development Errors

### pnpm install Gagal

**Error:**
```
ENOENT: no such file or directory
```

**Solusi:**
```bash
# Clean install
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

---

### TypeScript Errors

**Error:**
```
Cannot find module 'X' or its corresponding type declarations
```

**Solusi:**
```bash
# Reinstall dependencies
pnpm install

# Rebuild TypeScript cache
rm -rf node_modules/.vite
pnpm dev
```

---

### Vite Build Errors

**Error:**
```
[vite]: Rollup failed to resolve import
```

**Solusi:**

1. **Check Import Paths:**
   ```typescript
   // ✅ Correct
   import { api } from './services/api';
   
   // ❌ Wrong
   import { api } from 'services/api';
   ```

2. **Check vite.config.ts:**
   ```typescript
   resolve: {
     alias: {
       '@': path.resolve(__dirname, './src'),
     },
   }
   ```

3. **Clean Build:**
   ```bash
   rm -rf dist
   pnpm build
   ```

---

### Port Already in Use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solusi:**

```bash
# Find process using port 3000
lsof -i :3000
# or
netstat -tulpn | grep :3000

# Kill process
kill -9 <PID>

# Or change port in backend/server.js
const PORT = 3001; // Change to different port
```

---

## 🆘 Still Having Issues?

### Langkah Debug Umum:

1. **Check All Services Running:**
   ```bash
   # Terminal 1: Backend
   pnpm dev:backend
   
   # Terminal 2: Frontend
   pnpm dev
   ```

2. **Check Health Endpoint:**
   ```bash
   curl http://localhost:3000/health
   ```
   
   Should return:
   ```json
   {
     "status": "ok",
     "uptime": 123.456,
     "timestamp": "2024-01-01T00:00:00.000Z"
   }
   ```

3. **Enable Verbose Logging:**
   Edit `backend/server.js`, add:
   ```javascript
   console.log('DEBUG:', JSON.stringify(data, null, 2));
   ```

4. **Check Browser Console:**
   - F12 > Console
   - Look for red errors
   - Copy error message for debugging

5. **Test with cURL:**
   ```bash
   # Test each endpoint
   curl http://localhost:3000/latest
   curl http://localhost:3000/search?keyword=test
   curl "http://localhost:3000/stream?bookId=123&episode=1"
   ```

---

## 📊 Performance Monitoring

### Check Backend Performance:

```bash
# Install pm2 for production monitoring
npm install -g pm2

# Start with monitoring
pm2 start backend/server.js --name dramabox-api
pm2 monit
```

### Memory Usage:

```bash
# Check Node.js memory
node --max-old-space-size=4096 backend/server.js
```

### Request Logging:

Add to `backend/server.js`:
```javascript
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});
```

---

## 🔒 Security Issues

### Unsafe TLS Warning

**Warning:**
```
rejectUnauthorized: false
```

**Note:** 
- Ini diperlukan untuk bypass certificate validation
- Hanya untuk development/testing
- Untuk production, gunakan proper SSL certificates

---

## 📝 Reporting Bugs

Jika masih ada masalah, report dengan informasi berikut:

1. **Error Message:** Copy full error dari console
2. **Browser:** Chrome/Firefox/Safari + version
3. **OS:** Linux/Windows/Mac
4. **Steps to Reproduce:** Langkah-langkah untuk recreate error
5. **Logs:** Copy output dari terminal (backend & frontend)
6. **Network Tab:** Screenshot dari DevTools > Network

---

## ✅ Quick Checklist

Sebelum report bug, pastikan sudah coba:

- [ ] Restart backend server
- [ ] Clear browser cache & cookies
- [ ] Hard reload (Ctrl+Shift+R)
- [ ] Check backend logs for errors
- [ ] Check browser console for errors
- [ ] Test dengan browser berbeda
- [ ] Check internet connection
- [ ] Verify all dependencies installed (`pnpm install`)
- [ ] Check port tidak dipakai aplikasi lain
- [ ] Test health endpoint working

---

**Last Updated:** 2024-01-01  
**Version:** 2.0.0  
**Maintained by:** DramaBox API Team

Made with ❤️ using React + TypeScript + Vite + pnpm