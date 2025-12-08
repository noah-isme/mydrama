# 🚀 Deploy ke Vercel

Panduan lengkap untuk deploy DramaBox API ke Vercel.

## 📋 Persiapan

### 1. Install Vercel CLI (Opsional)
```bash
pnpm add -g vercel
```

### 2. Login ke Vercel
```bash
vercel login
```

## 🌐 Deploy via Website Vercel

### Metode 1: Import dari GitHub (Recommended)

1. **Push ke GitHub**
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. **Import di Vercel**
   - Buka [vercel.com/new](https://vercel.com/new)
   - Pilih repository Anda
   - Klik **Import**

3. **Konfigurasi Project**
   - **Framework Preset**: Vite
   - **Build Command**: `pnpm build` (sudah otomatis)
   - **Output Directory**: `dist` (sudah otomatis)
   - **Install Command**: `pnpm install`

4. **Environment Variables** (jika diperlukan)
   - Tidak ada environment variables yang wajib untuk saat ini
   - API menggunakan upstream public API

5. **Deploy**
   - Klik **Deploy**
   - Tunggu proses build selesai (2-3 menit)

### Metode 2: Deploy via CLI

```bash
# Deploy ke production
vercel --prod

# Deploy ke preview
vercel
```

## 📁 Struktur File Deploy

```
DramaBox-API/
├── api/
│   └── index.js          # Serverless function endpoint
├── backend/
│   └── server.js         # Express app (modified for serverless)
├── dist/                 # Built frontend (generated)
├── src/                  # React source
├── vercel.json          # Vercel configuration
├── .vercelignore        # Files to ignore
└── package.json
```

## ⚙️ Konfigurasi Vercel

File `vercel.json` sudah dikonfigurasi dengan:
- **Build command**: `pnpm build`
- **API routes**: `/api/*` → serverless function
- **Static files**: Frontend dari `/dist`
- **Rewrites**: API proxy untuk CORS

## 🔗 Endpoints Setelah Deploy

Setelah deploy, aplikasi akan tersedia di:
```
https://your-project.vercel.app
```

API endpoints:
```
https://your-project.vercel.app/api/latest
https://your-project.vercel.app/api/search?q=drama
https://your-project.vercel.app/api/link-stream?bookId=123&episode=1
```

## 🐛 Troubleshooting

### Build Failed
- Pastikan semua dependencies terinstall
- Check error di Vercel deployment logs
- Jalankan `pnpm build` lokal untuk test

### API Not Working
- Check Vercel Functions logs
- Pastikan `/api/*` routes terkonfigurasi
- Test serverless function di Vercel dashboard

### CORS Issues
- Vercel otomatis handle CORS untuk serverless functions
- Backend sudah dikonfigurasi dengan CORS middleware

## 📊 Monitoring

- **Deployment logs**: Vercel Dashboard → Your Project → Deployments
- **Function logs**: Vercel Dashboard → Your Project → Functions
- **Analytics**: Vercel Dashboard → Your Project → Analytics

## 🔄 Auto Deploy

Setiap push ke `main` branch akan otomatis trigger deployment baru.

Untuk disable auto deploy:
1. Vercel Dashboard → Project Settings
2. Git → Deploy Hooks
3. Toggle off "Production Branch"

## 💡 Tips

1. **Preview Deployments**: Setiap PR/branch akan dapat preview URL
2. **Rollback**: Bisa rollback ke deployment sebelumnya di dashboard
3. **Custom Domain**: Tambahkan domain custom di Project Settings → Domains
4. **Environment Variables**: Set di Project Settings → Environment Variables

## 📝 Notes

- Vercel free tier: 100GB bandwidth/month
- Serverless functions: 10s execution limit (free tier)
- Build minutes: 6000 minutes/month (free tier)
- Unlimited deployments

## ✅ Checklist Deploy

- [x] File `vercel.json` created
- [x] File `.vercelignore` created
- [x] Backend modified untuk serverless
- [x] API folder dengan serverless function
- [x] `.gitignore` updated
- [ ] Push ke GitHub
- [ ] Import di Vercel
- [ ] Deploy success
- [ ] Test semua endpoints
- [ ] Configure custom domain (optional)

## 🎉 Selesai!

Aplikasi Anda sekarang live di Vercel!
