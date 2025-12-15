# 🚀 Setup Guide - Meta Ads Report Generator

## Langkah-langkah Setup Lengkap

### Step 1: Install Dependencies

```bash
cd "/Users/mac/VSC Project/Meta Ads Report Generator"
npm install
```

### Step 2: Setup Environment Variables

Buat file `.env.local` di root project:

```bash
touch .env.local
```

Copy isi berikut ke `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
Z_AI_API_KEY=your_z_ai_api_key
Z_AI_API_URL=https://api.z.ai/api/paas/v4/chat/completions
```

**Note:** Dapatkan credentials dari:
- Supabase Dashboard → Settings → API
- Z AI Dashboard → API Keys

### Step 3: Setup Supabase Database

1. Buka [Supabase Dashboard](https://supabase.com/dashboard)
2. Login dan pilih project: `dhxvwbbdztjcwozesmxy`
3. Klik **SQL Editor** di sidebar kiri
4. Copy semua isi dari file `supabase/schema.sql`
5. Paste di SQL Editor
6. Klik **Run** untuk execute SQL

### Step 4: Test Local Development

```bash
npm run dev
```

Buka browser: http://localhost:3000

### Step 5: Setup GitHub Repository

```bash
# Initialize git (jika belum)
git init

# Add semua file
git add .

# Commit pertama
git commit -m "Initial commit: Meta Ads Report Generator"

# Add remote repository
git remote add origin git@github.com:Briyanes/meta-ads-report-generator.git

# Push ke GitHub
git branch -M main
git push -u origin main
```

### Step 6: Setup Vercel Deployment

1. Buka [Vercel Dashboard](https://vercel.com/dashboard)
2. Pastikan sudah terhubung dengan GitHub account
3. Klik **Add New Project**
4. Pilih repository: `Briyanes/meta-ads-report-generator`
5. Klik **Import**

6. **Setup Environment Variables:**
   - Klik **Settings** > **Environment Variables**
   - Tambahkan satu per satu:

   ```
   Name: NEXT_PUBLIC_SUPABASE_URL
   Value: https://dhxvwbbdztjcwozesmxy.supabase.co
   Environment: Production, Preview, Development
   ```

   ```
   Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
   Value: your_supabase_anon_key
   Environment: Production, Preview, Development
   ```

   ```
   Name: SUPABASE_SERVICE_ROLE_KEY
   Value: your_supabase_service_role_key
   Environment: Production, Preview, Development
   ```

   ```
   Name: Z_AI_API_KEY
   Value: your_z_ai_api_key
   Environment: Production, Preview, Development
   ```

   ```
   Name: Z_AI_API_URL
   Value: https://api.z.ai/v1/chat/completions
   Environment: Production, Preview, Development
   ```

7. Klik **Deploy**

### Step 7: Verify Auto-Deploy

Setelah setup selesai, setiap kali push ke GitHub:

```bash
git add .
git commit -m "Update: description"
git push
```

Vercel akan otomatis:
- Detect perubahan
- Build project
- Deploy ke production

## ✅ Checklist Setup

- [ ] Dependencies terinstall (`npm install`)
- [ ] File `.env.local` sudah dibuat dengan semua variables
- [ ] Supabase database sudah setup (table `reports` sudah dibuat)
- [ ] Local development berjalan (`npm run dev`)
- [ ] GitHub repository sudah di-push
- [ ] Vercel project sudah dibuat dan terhubung dengan GitHub
- [ ] Semua environment variables sudah di-set di Vercel
- [ ] Deploy pertama berhasil
- [ ] Test upload CSV dan generate report

## 🐛 Troubleshooting

### Error saat npm install
```bash
# Clear cache dan install ulang
rm -rf node_modules package-lock.json
npm install
```

### Error: Cannot find module
```bash
# Pastikan semua dependencies terinstall
npm install
```

### Error: Environment variables not found
- Pastikan file `.env.local` ada di root project
- Pastikan semua variables sudah di-set di Vercel
- Restart development server setelah edit `.env.local`

### Supabase connection error
- Check Supabase URL dan keys di `.env.local`
- Pastikan table `reports` sudah dibuat
- Check Supabase dashboard untuk status project

### Z AI API error
- Verify API key di `.env.local`
- Check API endpoint URL
- Pastikan quota API masih tersedia

## 📞 Next Steps

Setelah setup selesai:

1. Test dengan upload CSV sample dari Meta Ads
2. Verify report generation berjalan dengan baik
3. Check PDF output quality
4. Monitor Vercel logs untuk error
5. Update README jika ada perubahan

---

**Happy Coding! 🚀**

