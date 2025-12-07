# 🔧 Konfigurasi API DramaBox

## ✅ Status: Production Ready (dengan CORS Bypass)

Project ini menggunakan **CORS Proxy Server** untuk bypass CORS dan fetch data dari API production.

### 🌐 Arsitektur

```
Browser (index.html)
    ↓ fetch ke localhost:3000
CORS Proxy Server (server.js) 
    ↓ proxy ke production API
https://dramabox.sansekai.my.id/api/dramabox
```

### 📍 Production API Endpoints

**Production Base URL:** `https://dramabox.sansekai.my.id/api/dramabox`

1. **Latest Dramas**
   - Endpoint: `/latest`
   - Method: GET
   - Description: Mendapatkan daftar drama terbaru

2. **Search Dramas**
   - Endpoint: `/search?query={keyword}`
   - Method: GET
   - Description: Mencari drama berdasarkan keyword

3. **Stream Video**
   - Endpoint: `/stream?bookId={bookId}&episode={episode}`
   - Method: GET
   - Description: Mendapatkan link streaming video

### 🚀 Cara Penggunaan

**PENTING:** Anda HARUS menjalankan server proxy untuk bypass CORS!

#### 1. Start Server Proxy
```bash
npm start
```

Server akan berjalan di: `http://localhost:3000`

#### 2. Buka Aplikasi
Buka browser dan akses: `http://localhost:3000/index.html`

### 🔄 Cara Kerja CORS Bypass

1. `index.html` fetch ke `http://localhost:3000/latest`
2. `server.js` (proxy) menerima request dan fetch ke `https://dramabox.sansekai.my.id/api/dramabox/latest`
3. `server.js` menambahkan CORS headers dan return response ke browser
4. Browser menerima data tanpa CORS error

### 📝 Catatan Penting

- ✅ **TIDAK** ada mock data
- ✅ **TIDAK** ada data palsu/dummy  
- ✅ **TIDAK** ada local API server
- ✅ Semua data 100% berasal dari API production: `https://dramabox.sansekai.my.id/api/dramabox`
- ✅ Server lokal HANYA sebagai CORS proxy (tidak menyimpan/membuat data)
- ✅ Server proxy meneruskan semua request ke API production

### 🔍 Verifikasi

Untuk memastikan tidak ada mock data, cek:

1. **index.html** - Fetch ke `http://localhost:3000` (proxy lokal)
2. **server.js** - Line 48, 88, 118: Semua endpoint proxy ke `https://dramabox.sansekai.my.id/api/dramabox`
3. **server.js** - TIDAK ada endpoint `/mock/*`
4. **Console log** - Akan menampilkan "🔄 Proxying:" saat fetch data dari API production

### 🛠️ Troubleshooting

**Jika masih ada CORS error:**
```bash
# Stop server
Ctrl + C

# Restart server
npm start

# Buka di browser
http://localhost:3000/index.html
```

**Jika API tidak merespon:**
- Pastikan server proxy berjalan (`npm start`)
- Cek console log untuk melihat proxy activity
- Pastikan endpoint production aktif: `https://dramabox.sansekai.my.id/api/dramabox`
- Cek koneksi internet

**Untuk test manual:**
```bash
# Test API production langsung (akan dapat CORS error di browser)
curl https://dramabox.sansekai.my.id/api/dramabox/latest

# Test via proxy (seharusnya berhasil)
curl http://localhost:3000/latest
```
