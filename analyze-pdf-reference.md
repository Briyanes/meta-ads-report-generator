# Analisis PDF Referensi: REPORT AUM APRIL VS MEI.pdf

## Instruksi untuk Extract Text dari PDF

Untuk mengekstrak teks dari PDF, jalankan salah satu perintah berikut di terminal:

### Opsi 1: Menggunakan Python dengan pdfplumber (Recommended)
```bash
cd "/Users/mac/VSC Project/Meta Ads Report Generator"
pip3 install pdfplumber
python3 extract-pdf-text.py
```

### Opsi 2: Menggunakan Python dengan PyPDF2
```bash
pip3 install PyPDF2
# Edit extract-pdf-text.py untuk menggunakan PyPDF2
python3 extract-pdf-text.py
```

### Opsi 3: Menggunakan pdftotext (jika terinstall)
```bash
pdftotext "test-data/REPORT AUM APRIL VS MEI.pdf" "test-data/REPORT_AUM_APRIL_VS_MEI_extracted.txt"
```

## Elemen yang Perlu Dianalisis dari PDF Referensi

Setelah teks berhasil diekstrak, analisis elemen-elemen berikut untuk dijadikan referensi template CPAS:

### 1. **Struktur Slide/Halaman**
- [ ] Jumlah total slide/halaman
- [ ] Urutan slide (Cover, Summary, Breakdown, dll)
- [ ] Layout setiap slide (grid, single column, dll)

### 2. **Cover Page (Slide 1)**
- [ ] Judul report
- [ ] Client name
- [ ] Periode report (April vs Mei)
- [ ] Logo dan branding
- [ ] Disclaimer/confidentiality notice

### 3. **Performance Summary (Slide 2)**
- [ ] Metrik yang ditampilkan (Spend, Purchases, CPA, ROAS, dll)
- [ ] Format perbandingan (tabel, card, dll)
- [ ] Visualisasi (charts, graphs, dll)
- [ ] Growth indicators (arrows, colors, dll)

### 4. **Metric Summary Table (Slide 3)**
- [ ] Daftar metrik lengkap
- [ ] Format tabel (kolom: Metrik, Bulan Lalu, Bulan Ini, Trending)
- [ ] Styling tabel (colors, borders, dll)
- [ ] Format angka (currency, percentage, dll)

### 5. **Breakdown Slides**
- [ ] **Age Performance**: Format, metrik, visualisasi
- [ ] **Gender Performance**: Format, metrik, visualisasi
- [ ] **Platform Performance**: Format, metrik, visualisasi
- [ ] **Placement Performance**: Format, metrik, visualisasi
- [ ] **Creative Performance**: Format, metrik, visualisasi
- [ ] **Objective Performance**: Format, metrik, visualisasi

### 6. **Event Analysis (Jika Ada)**
- [ ] Twindate analysis format
- [ ] Payday analysis format
- [ ] Highlight/Lowlight format
- [ ] Comparison table format

### 7. **Week-on-Week / Month-on-Month Analysis**
- [ ] Highlight section format
- [ ] Lowlight section format
- [ ] Conclusion box format
- [ ] Recommendation box format

### 8. **Overall Conclusion & Strategic Action Plan**
- [ ] Conclusion format
- [ ] Action items format
- [ ] Next steps format

### 9. **Visual Design Elements**
- [ ] Color scheme (primary, secondary, accent colors)
- [ ] Typography (fonts, sizes, weights)
- [ ] Icons (style, placement, colors)
- [ ] Charts/graphs (type, styling)
- [ ] Spacing and padding
- [ ] Borders and dividers

### 10. **Data Presentation**
- [ ] Number formatting (IDR currency, thousand separators)
- [ ] Percentage formatting
- [ ] Date formatting
- [ ] Growth indicators (positive/negative colors)
- [ ] Trend arrows/icons

### 11. **Additional Sections (Jika Ada)**
- [ ] Executive summary
- [ ] Key insights
- [ ] Recommendations
- [ ] Appendix
- [ ] Thank you page

## Checklist Perbaikan Template Berdasarkan Referensi

Setelah menganalisis PDF, periksa apakah template CPAS saat ini sudah memiliki:

- [ ] Semua slide yang ada di referensi
- [ ] Format yang sama dengan referensi
- [ ] Metrik yang sama dengan referensi
- [ ] Visual design yang konsisten
- [ ] Data presentation yang sesuai
- [ ] Conclusion dan recommendation sections
- [ ] Event analysis (Twindate, Payday)
- [ ] Breakdown slides lengkap

## Catatan Penting

1. **Field Names**: Pastikan field names di template sesuai dengan CSV export dari Meta Ads
2. **Data Aggregation**: Pastikan data di-aggregate dengan benar untuk breakdown slides
3. **Formatting**: Pastikan formatting (currency, percentage, dll) konsisten
4. **Responsive**: Pastikan template responsive untuk berbagai ukuran layar
5. **Performance**: Pastikan template tidak terlalu berat untuk di-render

## Langkah Selanjutnya

1. Extract text dari PDF menggunakan script di atas
2. Analisis struktur dan elemen-elemen di atas
3. Bandingkan dengan template CPAS saat ini (`lib/reportTemplate-cpas.ts`)
4. Identifikasi perbedaan dan area yang perlu diperbaiki
5. Update template sesuai dengan referensi PDF

