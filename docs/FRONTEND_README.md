# 🎬 DramaBox Frontend - Panduan Penggunaan

Aplikasi web untuk menonton drama dari DramaBox API dengan antarmuka yang user-friendly.

## 📋 Fitur

- ✅ Pencarian drama berdasarkan kata kunci
- ✅ Menampilkan daftar drama terbaru
- ✅ Memutar video drama
- ✅ Navigasi episode (sebelumnya/selanjutnya)
- ✅ UI responsif dan modern
- ✅ Auto-load drama terbaru saat halaman dibuka
- ✅ **CORS Bypass terintegrasi**

## 🚀 Cara Menjalankan

### 1. Install Dependencies

```bash
npm install
```

### 2. Jalankan Server

**Opsi 1: Server Utama (dengan CORS bypass)**
```bash
npm start
```

**Opsi 2: CORS Proxy Standalone (port 3001)**
```bash
npm run proxy
```

### 3. Buka Browser

Akses aplikasi di: **http://localhost:3000**

## 🔓 CORS Bypass

Aplikasi ini sudah dilengkapi dengan CORS bypass untuk mengatasi masalah Cross-Origin:

### Server Utama (server.js)
- Middleware `cors` terintegrasi
- Headers CORS custom untuk bypass lengkap
- Mendukung semua origins (`*`)
- Support preflight OPTIONS request

### CORS Proxy Standalone (cors-proxy.js)
Jika butuh proxy terpisah untuk request eksternal:
```bash
npm run proxy
```

Gunakan: `http://localhost:3001/proxy?url=TARGET_URL`

## 📖 Cara Menggunakan

### Menonton Drama Terbaru

1. Saat halaman dibuka, daftar drama terbaru akan otomatis dimuat
2. Klik pada card drama yang ingin ditonton
3. Video player akan muncul dengan episode 1
4. Gunakan tombol kontrol untuk navigasi episode

### Mencari Drama

1. Klik tab "Cari Drama"
2. Masukkan kata kunci (contoh: "pewaris", "istri", "CEO")
3. Klik tombol "🔍 Cari" atau tekan Enter
4. Pilih drama dari hasil pencarian

### Kontrol Video Player

- **Episode Input**: Masukkan nomor episode langsung
- **◀ Sebelumnya**: Putar episode sebelumnya
- **Selanjutnya ▶**: Putar episode selanjutnya
- **Video Controls**: Play, pause, volume, fullscreen

## 📡 API Endpoints

Server menyediakan 3 endpoint utama:

### 1. GET /latest
Mendapatkan daftar drama terbaru
```
GET http://localhost:3000/latest?page=1
```

### 2. GET /search
Mencari drama berdasarkan keyword
```
GET http://localhost:3000/search?keyword=pewaris
```

### 3. GET /stream
Mendapatkan link streaming episode
```
GET http://localhost:3000/stream?bookId=41000102902&episode=1
```

## 🎨 Teknologi yang Digunakan

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js, Express.js
- **CORS**: CORS middleware untuk bypass
- **API**: DramaBox API
- **Video Player**: HTML5 Video Element

## ⚙️ Konfigurasi

### Mode API (index.html)
Edit variabel di file `index.html`:

```javascript
const USE_LOCAL_SERVER = true;  // true = localhost:3000, false = API eksternal
const API_BASE = USE_LOCAL_SERVER ? 'http://localhost:3000' : 'https://dramabox.sansekai.my.id';
```

### CORS Headers (server.js)
CORS sudah dikonfigurasi dengan:
- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`
- `Access-Control-Allow-Headers: *`
- Preflight OPTIONS support

## 📝 Catatan

- Server berjalan di port 3000 (dapat diubah di file server.js)
- API menggunakan token yang didapat dari endpoint eksternal
- Link streaming bersifat sementara dan dapat expired
- Pastikan koneksi internet stabil untuk streaming

## 🔧 Troubleshooting

### Video tidak bisa diputar
- Cek koneksi internet
- Refresh halaman dan coba lagi
- Coba episode lain

### Pencarian tidak menampilkan hasil
- Pastikan keyword tidak kosong
- Coba keyword lain yang lebih umum
- Cek console browser untuk error

### Server tidak bisa dijalankan
- Pastikan sudah menjalankan `npm install`
- Cek apakah port 3000 sudah digunakan aplikasi lain
- Pastikan Node.js versi 14+ terinstall

### CORS Error
- Pastikan server berjalan di `localhost:3000`
- Set `USE_LOCAL_SERVER = true` di index.html
- Coba jalankan CORS proxy: `npm run proxy`
- Clear browser cache dan reload

## 🛡️ CORS Bypass Details

### Fitur CORS yang Diimplementasi:
1. **CORS Middleware** - Package `cors` untuk handling otomatis
2. **Custom Headers** - Header manual untuk bypass tambahan
3. **Preflight Handling** - OPTIONS request otomatis ter-handle
4. **Wildcard Origin** - Allow semua origin dengan `*`
5. **Credentials Support** - CORS dengan credentials enabled

### Testing CORS:
```bash
# Test dengan curl
curl -H "Origin: http://example.com" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     http://localhost:3000/latest
```

## 📞 Support

Untuk pertanyaan atau masalah, silakan buka issue di repository ini.

---

Selamat menonton! 🎭✨
