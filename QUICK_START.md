# ⚡ Quick Start Guide

## 🚀 Setup Cepat (5 Menit)

### 1. Install Dependencies
```bash
npm install
```

### 2. Buat File .env.local
Copy isi dari `.env.example` atau buat manual dengan credentials yang sudah disiapkan.

### 3. Setup Supabase
Jalankan SQL dari `supabase/schema.sql` di Supabase SQL Editor.

### 4. Run Development
```bash
npm run dev
```

Buka: http://localhost:3000

## 📝 Cara Pakai

1. **Upload CSV** dari Meta Ads Dashboard
2. **Click "Analyze CSV"** - tunggu analisis selesai
3. **Click "Generate HTML Report"** - tunggu generate selesai
4. **Click "Download PDF"** - download file PDF

## 🔗 Deploy ke Production

### Push ke GitHub
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### Setup Vercel
1. Import project dari GitHub di Vercel Dashboard
2. Add environment variables (lihat SETUP.md)
3. Deploy!

## ✅ Checklist

- [x] Project structure sudah lengkap
- [x] Dependencies sudah di-setup
- [x] API routes sudah dibuat
- [x] Frontend components sudah dibuat
- [x] Supabase integration sudah setup
- [x] Z AI integration sudah setup
- [x] PDF generation sudah setup
- [x] GitHub & Vercel config sudah dibuat

## 🎯 Next Steps

1. Test dengan CSV sample
2. Adjust prompt di `PROMPT_Z_AI.md` jika perlu
3. Customize styling di `app/globals.css`
4. Deploy dan test di production

---

**Selamat menggunakan! 🎉**


