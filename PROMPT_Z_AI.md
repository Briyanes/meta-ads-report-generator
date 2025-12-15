# 📝 PROMPT LENGKAP UNTUK Z AI GLM-4.6

## PROMPT UNTUK ANALISIS CSV DATA

```
Anda adalah expert Meta Ads analyst. Analisis data CSV dari Meta Ads Dashboard dan ekstrak insights berikut:

1. PERFORMANCE SUMMARY (Week-on-Week Comparison):
   - Amount Spent (total dan per periode)
   - Impressions
   - Link Clicks
   - CTR (Link) - Click Through Rate
   - CPC (Link) - Cost Per Click
   - CPM - Cost Per Mille
   - Outbound Clicks
   - Messaging Conversations Started (WA Started)
   - Cost per WA Started
   - Frequency (Weighted Average)
   - Average Daily Reach
   - OC → WA Landing Ratio (Outbound Clicks to WA Started conversion)

2. DEMOGRAPHICS ANALYSIS (jika tersedia di data):
   - AGE Performance:
     * Breakdown per age group
     * Total Result / Messaging Conversation per age
     * CPR (Cost Per Result) per age
     * Best performing age group
   
   - GENDER Performance:
     * Breakdown per gender (Male, Female, Unknown)
     * Impressions per gender
     * Outbound Clicks per gender
     * CTR (Link) per gender
     * Best performing gender
   
   - REGION Performance:
     * Top regions berdasarkan Impressions
     * Link Clicks per region
     * CTR (Link) per region
     * Best performing regions

3. PLATFORM PERFORMANCE:
   - Fokus pada Instagram performance
   - Messaging Conversation / Result dari Instagram
   - CPR dari Instagram
   - Impressions, Outbound Click, CTR (Link) untuk Instagram
   - Comparison dengan platform lain (Facebook, Messenger, dll)

4. PLACEMENT PERFORMANCE:
   - Breakdown per placement: Stories, Reels, Feed
   - Total Result / Messaging Conversation per placement
   - CPR per placement
   - Impressions, Outbound Click, CTR (Link) per placement
   - Best performing placement

5. CREATIVE PERFORMANCE:
   - Identifikasi iklan dengan performa terbaik (berdasarkan Result dan CPR)
   - Identifikasi iklan dengan performa terendah
   - Untuk setiap iklan: Impressions, Outbound Click, CTR (Link)
   - Analisis creative yang efektif

6. CAMPAIGN OBJECTIVE PERFORMANCE:
   - Breakdown per objective:
     * Outbox_Sales → rename sebagai "Sales"
     * Link_Clicks → rename sebagai "Traffic"
   - Metrics per objective:
     * Messaging Conversation
     * Result
     * Instagram Profile Visits
     * Instagram Follower
   - Impressions, Outbound Click, CTR (Link) per objective

7. WEEK-ON-WEEK ANALYSIS:
   - HIGHLIGHTS (minimal 3-5 poin):
     * Pencapaian positif
     * Growth yang signifikan
     * Performance yang outstanding
   
   - LOWLIGHTS (minimal 3-5 poin):
     * Penurunan yang perlu diperhatikan
     * Area yang perlu improvement
     * Alasan singkat untuk setiap lowlight (1 kalimat)

8. OVERALL CONCLUSION & STRATEGIC ACTION PLAN:
   - Ringkasan performa keseluruhan
   - Insight utama yang dapat diambil
   - Rencana aksi strategis yang konkret dan actionable

Return hasil analisis dalam format JSON yang terstruktur dengan key-value pairs yang jelas, sehingga mudah untuk di-generate menjadi HTML report.
```

## PROMPT UNTUK GENERATE HTML REPORT

```
Generate complete HTML report untuk Meta Ads Weekly Performance Report dengan spesifikasi berikut:

1. DESKRIPSI UMUM:
   - Presentasi perbandingan performa iklan Meta Ads untuk client Hadona
   - Periode: Minggu Ini vs Minggu Lalu (Week-on-Week)
   - Style: Profesional, minimalis, mudah dibaca, fokus pada insight & pengambilan keputusan

2. BRAND & WARNA (WAJIB):
   - Biru: #2B46BB (primary color)
   - Kuning: #ECDC43 (accent color)
   - Gunakan turunan dari kedua warna dengan kontras tinggi
   - Growth % naik → Hijau (#28a745 atau similar)
   - Growth % turun → Merah (#dc3545 atau similar)
   - Jika growth turun, WAJIB sertakan alasan singkat (1 kalimat)

3. FITUR TAMBAHAN (WAJIB):
   - Setiap slide HARUS memiliki kesimpulan ringkas / key insight
   - Kalimat penting untuk client boleh di-bold
   - Gunakan ikon dari Bootstrap Icons (via CDN: https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css)
   - Untuk list boleh gunakan angka atau bullet points

4. DESAIN & GAYA VISUAL:
   - Logo Hadona: https://hadona.id/wp-content/uploads/2024/12/cropped-Hadona-Logo-1-300x300.png
   - Ukuran slide: Full width × 720px height
   - Semua angka gunakan format ribuan dengan pemisah koma (contoh: 1,532,000)
   - Font: Modern & profesional (gunakan Google Fonts: Inter atau Poppins)
   - Visualisasi data: Chart/graph yang jelas & relevan (gunakan Chart.js atau similar via CDN)
   - Hindari struktur atas-tengah-bawah yang menumpuk
   - Kontrol tinggi slide agar tidak terlalu panjang
   - Gunakan hover effects / transisi halus bila diperlukan

5. FORMAT OUTPUT:
   - Output HARUS dalam format HTML lengkap dengan <!DOCTYPE html>
   - Include semua CSS inline atau dalam <style> tag
   - Include Bootstrap Icons via CDN
   - Setiap slide dalam container dengan class "slide"
   - Pastikan semua angka diformat benar dengan pemisah ribuan
   - Gunakan hierarki visual yang jelas: Judul > Subjudul > Konten

6. STRUKTUR PRESENTASI (13 SLIDE):

SLIDE 1 – WELCOME:
- Judul: "Weekly over Weekly Reporting"
- Subjudul: "Meta Ads – Hadona × RMODA Studio BSD"
- Periode: "Week vs Week" dengan tanggal
- Pemberitahuan: "Private & Confidential - This presentation contains proprietary insights prepared exclusively for our valued client. Redistribution or disclosure is not permitted."
- Logo Hadona di header

SLIDE 2 – PERFORMANCE SUMMARY:
- Layout 2 kolom: "Minggu Ini" | "Minggu Lalu"
- Setiap kolom berisi widget:
  * Spend (dengan format currency)
  * Result (WA Started / Messaging Conversation)
  * CPR (Cost Per Result)
  * Growth % (dengan warna hijau/merah)
- Key insight singkat di bawah

SLIDE 3 – TABEL RINGKASAN METRIK:
- Tabel full width dengan 5 kolom:
  1. Metrik (Amount Spent, Impressions, Link Clicks, CTR, CPC, CPM, Outbound Clicks, Messaging Conversations Started, Cost per WA, Frequency, Avg Daily Reach, OC → WA Landing Ratio)
  2. Minggu Lalu
  3. Minggu Ini
  4. Trending Value (selisih absolut)
  5. Trending % (dengan warna hijau/merah)
- Kesimpulan ringkas (maks. 2 baris) di bawah tabel

SLIDE 4 – WEEK-ON-WEEK ANALYSIS:
- Layout 2 kolom: "Highlight" | "Lowlight"
- Highlight: Minimal 3-5 poin dengan ikon check/arrow-up
- Lowlight: Minimal 3-5 poin dengan ikon alert/arrow-down + alasan singkat
- Kesimpulan minimal 2 baris di bawah

SLIDE 5 – AUDIENCE PERFORMANCE: AGE:
- Analisis demografi usia terbaik berdasarkan:
  * Total Result / Messaging Conversation
  * CPR
- Tampilkan perbandingan: Result dan CPR per age group
- Chart/visualisasi data age performance
- Kesimpulan ringkas

SLIDE 6 – AUDIENCE PERFORMANCE: GENDER:
- Analisis gender terbaik berdasarkan:
  * Total Result / Messaging Conversation
  * CPR
- Perbandingan: Impressions, Outbound Click, CTR (Link) per gender
- Chart/visualisasi gender performance
- Kesimpulan minimal 2 baris

SLIDE 7 – AUDIENCE PERFORMANCE: REGION:
- Distribusi region terbaik berdasarkan:
  * Impressions
  * Link Click
- Perbandingan: Impressions, Outbound Click, CTR (Link) per region
- Chart/visualisasi region performance (top 5-10 regions)
- Kesimpulan minimal 2 baris

SLIDE 8 – PLATFORM PERFORMANCE:
- Fokus platform Instagram
- Berdasarkan: Messaging Conversation / Result, CPR
- Perbandingan: Impressions, Outbound Click, CTR (Link) untuk Instagram vs platform lain
- Chart/visualisasi platform comparison
- Kesimpulan minimal 2 baris

SLIDE 9 – CONTENT PERFORMANCE: PLACEMENT:
- Placement: Stories, Reels, Feed
- Berdasarkan: Total Result / Messaging Conversation, CPR
- Perbandingan: Impressions, Outbound Click, CTR (Link) per placement
- Chart/visualisasi placement performance
- Kesimpulan minimal 2 baris

SLIDE 10 – CREATIVE PERFORMANCE: AD ANALYSIS:
- Iklan dengan performa terbaik & terendah
- Berdasarkan: Total Result / Messaging Conversation, CPR
- Perbandingan: Impressions, Outbound Click, CTR (Link) untuk top/bottom ads
- Tabel atau chart comparison
- Kesimpulan minimal 2 baris

SLIDE 11 – CAMPAIGN OBJECTIVE PERFORMANCE:
- Ubah penamaan: Outbox_Sales → Sales, Link_Clicks → Traffic
- Analisis berdasarkan: Messaging Conversation, Result, Instagram Profile Visits, Instagram Follower
- Sertakan: Impressions, Outbound Click, CTR (Link) per objective
- Chart/visualisasi objective performance
- Kesimpulan minimal 2 baris

SLIDE 12 – OVERALL CONCLUSION & STRATEGIC ACTION PLAN:
- Ringkasan performa keseluruhan (2-3 paragraf)
- Insight utama (bullet points, 3-5 poin)
- Rencana aksi strategis yang konkret (bullet points, 3-5 poin actionable items)

SLIDE 13 – THANK YOU:
- "Thank You" dengan styling Hadona
- Hadona Digital Media
- Instagram: @hadona.id
- TikTok: @hadona.id
- Website: www.hadona.id
- Logo Hadona

Gunakan data berikut untuk generate HTML:
{analysisData}

Pastikan HTML yang di-generate:
- Valid HTML5
- Responsive design
- Menggunakan warna brand Hadona (#2B46BB dan #ECDC43)
- Semua angka terformat dengan benar
- Visualisasi data yang jelas
- Professional dan mudah dibaca
```

## CATATAN PENTING

1. **Format Data Input**: Pastikan CSV yang di-upload memiliki kolom yang sesuai dengan metrics Meta Ads
2. **API Response**: Z AI akan return HTML string yang langsung bisa digunakan
3. **Error Handling**: Jika API gagal, tampilkan error message yang jelas
4. **Performance**: Untuk CSV besar, pertimbangkan chunking atau pagination

---

**Gunakan prompt ini saat memanggil Z AI API untuk analisis dan generate report.**


