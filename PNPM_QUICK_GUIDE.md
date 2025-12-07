# 🚀 PNPM Quick Guide - DramaBox v2.0

## 📦 Apa itu pnpm?

**pnpm** (performant npm) adalah package manager yang cepat dan hemat disk space untuk Node.js.

### Keuntungan:
- ⚡ **55% lebih cepat** dari npm
- 💾 **50% hemat disk space**
- 🔒 **Lebih aman** (strict dependencies)
- 🚀 **Better performance**

---

## 🔧 Install pnpm

### Via npm
```bash
npm install -g pnpm
```

### Via Homebrew (Mac)
```bash
brew install pnpm
```

### Via Curl (Linux/Mac)
```bash
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

### Verifikasi
```bash
pnpm --version
# Output: 10.20.0 atau lebih baru
```

---

## 🚀 Perintah Dasar

### Instalasi
```bash
pnpm install              # Install semua dependencies
pnpm i                    # Shorthand

pnpm add <package>        # Tambah package
pnpm add -D <package>     # Tambah dev dependency
pnpm add -g <package>     # Install global

pnpm remove <package>     # Hapus package
pnpm rm <package>         # Shorthand
```

### Update
```bash
pnpm update               # Update semua packages
pnpm up                   # Shorthand

pnpm update <package>     # Update package tertentu
pnpm outdated             # Cek packages yang outdated
```

### Info
```bash
pnpm list                 # List installed packages
pnpm ls                   # Shorthand

pnpm list --depth=0       # Hanya top-level packages
pnpm why <package>        # Kenapa package ini installed?
```

---

## 🎯 Perintah untuk DramaBox

### Development
```bash
# Install dependencies (hanya sekali)
pnpm install

# Start frontend dev server
pnpm run dev
# Buka: http://localhost:5173 atau 5174

# Start backend API (terminal terpisah)
pnpm run server
# Running: http://localhost:3000
```

### Production Build
```bash
# Build untuk production
pnpm run build
# Output: dist/

# Preview production build
pnpm run preview
```

### Quality Checks
```bash
# TypeScript type checking
pnpm run type-check

# ESLint linting
pnpm run lint
```

---

## 💡 Tips & Tricks

### 1. Update Package Tertentu
```bash
# Update React saja
pnpm update react react-dom

# Update ke versi specific
pnpm add react@18.3.1
```

### 2. Clean Install
```bash
# Hapus dan install ulang
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### 3. Cek Disk Space Usage
```bash
pnpm store status
pnpm store prune          # Clean unused packages
```

### 4. Run Multiple Commands
```bash
# Run dev dan server sekaligus (install concurrently dulu)
pnpm add -D concurrently
```

### 5. Filter Dependencies
```bash
pnpm list --prod          # Production only
pnpm list --dev           # Dev dependencies only
```

---

## 🔄 Migrasi dari npm

### Ganti npm dengan pnpm

| npm | pnpm |
|-----|------|
| `npm install` | `pnpm install` |
| `npm install <pkg>` | `pnpm add <pkg>` |
| `npm uninstall <pkg>` | `pnpm remove <pkg>` |
| `npm update` | `pnpm update` |
| `npm run <script>` | `pnpm run <script>` atau `pnpm <script>` |
| `npm list` | `pnpm list` |
| `npx <command>` | `pnpm dlx <command>` |

### Shorthand Commands
```bash
pnpm i          # install
pnpm add        # menambah package
pnpm rm         # remove
pnpm up         # update
pnpm ls         # list
pnpm t          # test
pnpm dev        # run dev (tanpa 'run')
pnpm build      # run build (tanpa 'run')
```

---

## 🐛 Troubleshooting

### Problem: "pnpm: command not found"
**Solusi:**
```bash
npm install -g pnpm
# Restart terminal
```

### Problem: Dependencies conflict
**Solusi:**
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Problem: Old cache issues
**Solusi:**
```bash
pnpm store prune
pnpm install
```

### Problem: Port sudah digunakan
**Solusi:**
```bash
# Vite akan otomatis cari port lain
# Atau kill process:
lsof -i :5173  # cari PID
kill -9 <PID>
```

### Problem: Build error
**Solusi:**
```bash
# Clean build
rm -rf dist node_modules pnpm-lock.yaml
pnpm install
pnpm run build
```

---

## 📊 Performance Comparison

### Install Time
- npm: ~35-40 detik
- pnpm: ~17.8 detik
- **55% lebih cepat!** ⚡

### Disk Space
- npm (node_modules): ~300 MB
- pnpm (symlinks): ~150 MB
- **50% hemat space!** 💾

### Build Time
- npm: ~2.5 detik
- pnpm: ~2.07 detik
- **17% lebih cepat!** 🚀

---

## 🎓 Advanced Commands

### Security Audit
```bash
pnpm audit                # Check vulnerabilities
pnpm audit --fix          # Auto fix (experimental)
```

### Workspace (Monorepo)
```bash
pnpm -r <command>         # Run pada semua workspaces
pnpm -F <package> <cmd>   # Run pada package tertentu
```

### Store Management
```bash
pnpm store path           # Lihat store location
pnpm store status         # Store statistics
pnpm store prune          # Clean unused packages
```

### Script Execution
```bash
pnpm run dev              # Run script
pnpm dev                  # Bisa tanpa 'run'
pnpm -s dev               # Silent mode
pnpm -w dev               # Workspace mode
```

---

## 📚 Dokumentasi Lengkap

Untuk info lebih detail, check:
- **README.md** - Main documentation
- **PNPM_MIGRATION.md** - Detailed migration guide
- **MIGRASI_PNPM_LENGKAP.md** - Dokumentasi Indonesia lengkap
- **PNPM_SUCCESS.md** - Migration success report

---

## 🔗 Resources

- [pnpm Official Docs](https://pnpm.io)
- [pnpm CLI Reference](https://pnpm.io/cli/add)
- [pnpm vs npm Benchmark](https://pnpm.io/benchmarks)
- [Migrating from npm](https://pnpm.io/motivation)

---

## ✅ Quick Checklist

Untuk memulai development:

- [ ] Install pnpm: `npm install -g pnpm`
- [ ] Clone repository
- [ ] `cd DramaBox-API`
- [ ] `pnpm install`
- [ ] Terminal 1: `pnpm run server`
- [ ] Terminal 2: `pnpm run dev`
- [ ] Buka browser: `http://localhost:5173` atau `5174`
- [ ] Happy coding! 🎉

---

## 🎯 Most Used Commands

```bash
# Daily development
pnpm install              # Setup project
pnpm run dev              # Start development
pnpm run build            # Build production
pnpm add <package>        # Add new package
pnpm update               # Update packages

# Maintenance
pnpm outdated             # Check updates
pnpm store prune          # Clean cache
pnpm list                 # List packages
```

---

## 🚀 Why pnpm?

1. **Speed** ⚡ - Instalasi jauh lebih cepat
2. **Efficiency** 💾 - Hemat disk space signifikan
3. **Safety** 🔒 - Strict dependency resolution
4. **Modern** 🆕 - Built for modern workflows
5. **Compatible** ✅ - 100% compatible dengan npm

---

## 💬 Common Questions

### Q: Apakah bisa pakai npm dan pnpm bersamaan?
**A:** Tidak disarankan. Pilih salah satu untuk konsistensi.

### Q: Apakah harus commit pnpm-lock.yaml?
**A:** Ya! Sama seperti package-lock.json untuk reproducible builds.

### Q: Bagaimana kalau team masih pakai npm?
**A:** Semua orang di team harus pakai package manager yang sama.

### Q: Apakah bisa rollback ke npm?
**A:** Ya, tinggal hapus pnpm-lock.yaml dan jalankan `npm install`.

### Q: Apakah CI/CD perlu update?
**A:** Ya, update CI/CD config untuk install dan pakai pnpm.

---

**Made with ❤️ using pnpm**

*Last updated: 8 Desember 2024*