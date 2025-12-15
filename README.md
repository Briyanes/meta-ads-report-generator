# Meta Ads Report Generator

Tools profesional untuk generate laporan performa iklan Meta Ads dengan integrasi Z AI GLM-4.6. Generate laporan PDF profesional untuk meeting dengan client.

## 🚀 Fitur

- ✅ Upload CSV dari Meta Ads Dashboard
- ✅ Analisis data dengan Z AI GLM-4.6
- ✅ Generate HTML report profesional (13 slides)
- ✅ Export ke PDF
- ✅ Integrasi dengan Supabase untuk storage
- ✅ Auto-deploy ke Vercel via GitHub

## 📋 Prerequisites

- Node.js 18+ dan npm
- Akun Supabase (sudah disiapkan)
- Akun Vercel (sudah terhubung dengan GitHub)
- Z AI API Key (sudah disiapkan)

## 🛠️ Setup Local Development

### 1. Clone Repository

```bash
cd "/Users/mac/VSC Project/Meta Ads Report Generator"
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Buat file `.env.local` di root project dengan isi:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Z AI Configuration
Z_AI_API_KEY=your_z_ai_api_key
Z_AI_API_URL=https://api.z.ai/api/paas/v4/chat/completions
```

**Note:** Dapatkan credentials dari:
- Supabase Dashboard → Settings → API
- Z AI Dashboard → API Keys

### 4. Setup Supabase Database

1. Login ke [Supabase Dashboard](https://supabase.com/dashboard)
2. Pilih project: `dhxvwbbdztjcwozesmxy`
3. Masuk ke SQL Editor
4. Jalankan script dari file `supabase/schema.sql` untuk membuat table `reports`

### 5. Run Development Server

```bash
npm run dev
```

Buka browser di [http://localhost:3000](http://localhost:3000)

## 📦 Build untuk Production

```bash
npm run build
npm start
```

## 🔗 Setup GitHub & Vercel

### 1. Initialize Git Repository

```bash
git init
git add .
git commit -m "Initial commit: Meta Ads Report Generator"
```

### 2. Connect ke GitHub

```bash
git remote add origin git@github.com:Briyanes/meta-ads-report-generator.git
git branch -M main
git push -u origin main
```

### 3. Setup Vercel Environment Variables

1. Login ke [Vercel Dashboard](https://vercel.com/dashboard)
2. Pilih project `meta-ads-report-generator`
3. Masuk ke Settings > Environment Variables
4. Tambahkan environment variables berikut:

```
NEXT_PUBLIC_SUPABASE_URL = your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY = your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY = your_supabase_service_role_key
Z_AI_API_KEY = your_z_ai_api_key
Z_AI_API_URL = https://api.z.ai/api/paas/v4/chat/completions
```

### 4. Auto Deploy

Setelah setup, setiap push ke GitHub akan otomatis trigger deploy di Vercel.

## 📊 Struktur Report (13 Slides)

1. **Welcome** - Cover slide dengan branding Hadona
2. **Performance Summary** - Ringkasan performa Week-on-Week
3. **Tabel Ringkasan Metrik** - Detail metrics comparison
4. **Week-on-Week Analysis** - Highlight & Lowlight
5. **Audience Performance: AGE** - Analisis demografi usia
6. **Audience Performance: GENDER** - Analisis gender
7. **Audience Performance: REGION** - Analisis region
8. **Platform Performance** - Fokus Instagram
9. **Content Performance: PLACEMENT** - Stories, Reels, Feed
10. **Creative Performance: AD ANALYSIS** - Best & worst ads
11. **Campaign Objective Performance** - Sales, Traffic, dll
12. **Overall Conclusion & Strategic Action Plan** - Kesimpulan & rekomendasi
13. **Thank You** - Closing slide

## 🎨 Brand Colors

- **Biru**: `#2B46BB`
- **Kuning**: `#ECDC43`
- **Growth Naik**: Hijau
- **Growth Turun**: Merah

## 📝 Cara Penggunaan

1. **Export CSV dari Meta Ads Dashboard**
   - Buka Meta Ads Manager
   - Export dengan custom metrics yang sudah ada
   - Include demographics: AGE, GENDER, REGION, PLATFORM, PLACEMENT, OBJECTIVE, CREATIVE

2. **Upload CSV**
   - Buka aplikasi di browser
   - Drag & drop atau click untuk upload CSV file

3. **Analyze**
   - Click tombol "Analyze CSV"
   - Tunggu proses analisis dengan Z AI

4. **Generate Report**
   - Setelah analisis selesai, click "Generate HTML Report"
   - Tunggu proses generate HTML

5. **Download PDF**
   - Preview report di browser
   - Click "Download PDF" untuk download file PDF

## 🗂️ Project Structure

```
Meta Ads Report Generator/
├── app/
│   ├── api/
│   │   ├── analyze/route.ts          # API untuk analisis CSV
│   │   └── generate-report/route.ts  # API untuk generate HTML report
│   ├── globals.css                   # Global styles
│   ├── layout.tsx                    # Root layout
│   └── page.tsx                      # Main page
├── lib/
│   ├── csvParser.ts                  # CSV parsing utilities
│   ├── pdfGenerator.ts               # PDF generation utilities
│   ├── supabase.ts                   # Supabase client
│   └── zai.ts                        # Z AI API integration
├── supabase/
│   └── schema.sql                    # Database schema
├── .env.example                      # Example environment variables
├── .gitignore
├── next.config.js
├── package.json
├── README.md
├── tsconfig.json
└── vercel.json
```

## 🔧 Troubleshooting

### Error: "Failed to analyze CSV"
- Pastikan CSV file valid dan tidak corrupt
- Check Z AI API key di environment variables
- Pastikan format CSV sesuai dengan Meta Ads export

### Error: "Failed to generate report"
- Check koneksi internet
- Pastikan Z AI API key valid
- Check console untuk error details

### PDF tidak ter-generate
- Pastikan browser support HTML2Canvas
- Try dengan browser lain (Chrome recommended)

## 📞 Support

Untuk pertanyaan atau issue, silakan buat issue di GitHub repository.

## 📄 License

Private project untuk Hadona Digital Media.

---

**Made with ❤️ for Hadona Digital Media**

