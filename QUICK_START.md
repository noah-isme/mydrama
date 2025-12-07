# 🚀 Quick Start Guide - DramaBox React + Vite

Panduan cepat untuk menjalankan project DramaBox dengan React dan Vite.

## ⚡ Langkah Cepat (Quick Steps)

### 1. Install Dependencies
```bash
npm install
```

### 2. Jalankan Backend API Server
Buka terminal pertama:
```bash
npm run server
```
Server API akan berjalan di **http://localhost:3000**

### 3. Jalankan Frontend React + Vite
Buka terminal kedua (biarkan server tetap berjalan):
```bash
npm run dev
```
Frontend akan berjalan di **http://localhost:5173**

### 4. Buka di Browser
Akses aplikasi di: **http://localhost:5173**

---

## 📋 Checklist Sebelum Mulai

- [ ] Node.js versi 16+ sudah terinstall
- [ ] NPM atau Yarn sudah terinstall
- [ ] Port 3000 dan 5173 tidak digunakan aplikasi lain
- [ ] Koneksi internet aktif (untuk fetching data)

---

## 🎯 Workflow Development

### Skenario 1: Development Normal
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run dev
```

### Skenario 2: Production Build
```bash
# Build frontend
npm run build

# Preview production build
npm run preview

# Backend tetap dijalankan terpisah
npm run server
```

---

## 🛠️ Troubleshooting Umum

### Error: Port 3000 already in use
```bash
# Cari process yang menggunakan port 3000
# Linux/Mac:
lsof -i :3000

# Windows:
netstat -ano | findstr :3000

# Atau ubah port di server.js
```

### Error: Port 5173 already in use
```bash
# Ubah port di vite.config.js
server: {
  port: 5174, // atau port lain
}
```

### Error: Module not found
```bash
# Hapus node_modules dan install ulang
rm -rf node_modules package-lock.json
npm install
```

### CORS Error
Pastikan:
1. Backend server (npm run server) sudah berjalan
2. Backend berjalan di http://localhost:3000
3. Proxy di vite.config.js sudah benar

### Cannot GET / (404 Error)
Pastikan Anda mengakses:
- Frontend: http://localhost:5173 (bukan 3000)
- Backend API: http://localhost:3000 (untuk testing API)

---

## 📂 File Penting

| File | Deskripsi |
|------|-----------|
| `src/App.jsx` | Komponen React utama |
| `src/main.jsx` | Entry point React |
| `src/index.css` | Global styles |
| `vite.config.js` | Konfigurasi Vite |
| `server.js` | Backend API server |
| `package.json` | Dependencies & scripts |

---

## 🎨 Kustomisasi

### Mengubah Warna Tema
Edit `src/index.css`:
```css
body {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  /* Ubah gradient sesuai keinginan */
}
```

### Mengubah API Base URL
Edit `src/App.jsx`:
```javascript
const API_BASE = '/api' // atau URL custom
```

### Menambah Fitur Baru
1. Buat komponen di `src/components/`
2. Import di `App.jsx`
3. Gunakan useState/useEffect untuk state management

---

## 📦 Production Deployment

### Deploy Frontend (Vercel/Netlify)
```bash
npm run build
# Upload folder 'dist/' ke hosting
```

### Deploy Backend (Railway/Render)
```bash
# Push server.js dan dependencies ke platform
# Set environment variables jika perlu
```

### Environment Variables (Production)
Buat file `.env`:
```env
VITE_API_URL=https://your-backend-api.com
```

Update `App.jsx`:
```javascript
const API_BASE = import.meta.env.VITE_API_URL || '/api'
```

---

## 🎓 Tips Development

1. **Hot Reload**: Vite otomatis reload saat Anda edit file
2. **React DevTools**: Install extension untuk debugging
3. **Console Logs**: Cek browser console untuk error/info
4. **Network Tab**: Monitor API requests di browser DevTools
5. **Component Structure**: Pisahkan komponen besar jadi komponen kecil

---

## 📚 Resource Belajar

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Modern JavaScript](https://javascript.info)

---

## ✅ Checklist Setelah Install

- [ ] `npm run server` berjalan tanpa error
- [ ] `npm run dev` berjalan tanpa error
- [ ] Browser terbuka di http://localhost:5173
- [ ] Bisa load drama terbaru
- [ ] Search drama berfungsi
- [ ] Video player bisa play episode

---

## 🆘 Butuh Bantuan?

1. Cek error message di terminal
2. Cek console browser (F12)
3. Pastikan kedua server (backend & frontend) berjalan
4. Restart kedua server jika perlu

---

**Happy Coding! 🎉**