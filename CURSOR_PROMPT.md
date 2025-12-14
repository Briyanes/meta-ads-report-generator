# 🎯 PROMPT LENGKAP UNTUK CURSOR/ROO CODE

## PROMPT UNTUK BUILD PROJECT INI

```
Saya ingin build tools Meta Ads Report Generator dengan spesifikasi berikut:

TECH STACK:
- Next.js 14 dengan App Router
- TypeScript
- Supabase untuk database
- Z AI GLM-4.6 untuk AI analysis
- Vercel untuk hosting
- GitHub untuk version control

FITUR UTAMA:
1. Upload CSV file dari Meta Ads Dashboard
2. Analisis CSV dengan Z AI GLM-4.6 API
3. Generate HTML report profesional (13 slides)
4. Export ke PDF
5. Save reports ke Supabase

REQUIREMENTS DETAIL:
- CSV parsing dengan papaparse
- Z AI API integration untuk analisis dan HTML generation
- PDF generation dari HTML dengan jsPDF + html2canvas
- Supabase untuk store reports
- Modern UI dengan brand colors (#2B46BB biru, #ECDC43 kuning)
- Responsive design
- Error handling yang proper
- Loading states

STRUKTUR REPORT (13 SLIDES):
1. Welcome - Cover dengan branding Hadona
2. Performance Summary - Week-on-Week comparison
3. Tabel Ringkasan Metrik - Detail metrics
4. Week-on-Week Analysis - Highlight & Lowlight
5. Audience Performance: AGE
6. Audience Performance: GENDER
7. Audience Performance: REGION
8. Platform Performance - Fokus Instagram
9. Content Performance: PLACEMENT - Stories, Reels, Feed
10. Creative Performance: AD ANALYSIS
11. Campaign Objective Performance
12. Overall Conclusion & Strategic Action Plan
13. Thank You

BRANDING:
- Logo: https://hadona.id/wp-content/uploads/2024/12/cropped-Hadona-Logo-1-300x300.png
- Colors: Biru #2B46BB, Kuning #ECDC43
- Growth naik: Hijau, Growth turun: Merah
- Font: Modern & profesional

API CREDENTIALS:
- Supabase URL: https://dhxvwbbdztjcwozesmxy.supabase.co
- Supabase Anon Key: [dari .env]
- Supabase Service Role: [dari .env]
- Z AI API Key: [dari .env]
- Z AI API URL: https://api.z.ai/v1/chat/completions

DEPLOYMENT:
- GitHub: git@github.com:Briyanes/meta-ads-report-generator.git
- Vercel: Auto-deploy dari GitHub
- Supabase: Cloud database

Buat project structure yang lengkap dengan:
- Next.js App Router structure
- API routes untuk analyze dan generate-report
- Client components untuk UI
- Library functions untuk utilities
- TypeScript types
- Error handling
- Loading states
- Responsive design
```

## PROMPT UNTUK UPDATE/FIX ISSUES

```
Saya punya Meta Ads Report Generator project dengan Next.js + TypeScript.

[DESCRIBE ISSUE ATAU FEATURE YANG INGIN DITAMBAHKAN]

File structure:
- app/ - Next.js App Router
- lib/ - Utility functions
- supabase/ - Database schema

Tech stack:
- Next.js 14
- TypeScript
- Supabase
- Z AI GLM-4.6
- jsPDF + html2canvas

Tolong bantu fix/implement [ISSUE/FEATURE].
```

## PROMPT UNTUK CUSTOMIZE REPORT

```
Saya ingin customize HTML report output dari Meta Ads Report Generator.

Current structure: 13 slides dengan format HTML
Brand colors: #2B46BB (biru), #ECDC43 (kuning)

Saya ingin:
[DESCRIBE PERUBAHAN YANG DIINGINKAN]

Contoh:
- Tambahkan slide baru untuk [TOPIC]
- Ubah layout slide [NUMBER] menjadi [NEW LAYOUT]
- Tambahkan chart/visualization untuk [METRIC]
- Ubah warna untuk [ELEMENT]
- Tambahkan section [SECTION NAME]

File yang perlu di-update:
- lib/zai.ts - Prompt untuk HTML generation
- PROMPT_Z_AI.md - Prompt reference
```

## PROMPT UNTUK DEBUG

```
Saya mengalami error di Meta Ads Report Generator:

Error message: [ERROR MESSAGE]
File: [FILE PATH]
Line: [LINE NUMBER] (jika ada)

Context:
- [DESCRIBE APA YANG SEDANG DILAKUKAN SAAT ERROR]
- [STEPS UNTUK REPRODUCE ERROR]

Tech stack:
- Next.js 14
- TypeScript
- Supabase
- Z AI API

Tolong bantu debug dan fix error ini.
```

---

**Gunakan prompt-prompt ini saat bekerja dengan Cursor/Roo Code untuk development atau maintenance project ini.**

