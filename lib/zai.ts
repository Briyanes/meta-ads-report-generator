import axios from 'axios'

// Z.ai API configuration for GLM Coding Lite Plan
// For GLM Coding subscription, might need different endpoint
const Z_AI_API_BASE = process.env.Z_AI_API_URL || 'https://api.z.ai/api/paas/v4'
const Z_AI_API_URL = `${Z_AI_API_BASE}/chat/completions`
const Z_AI_API_KEY = process.env.Z_AI_API_KEY!

export interface ZAIResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
}

export async function analyzeCSVWithZAI(csvData: string, prompt: string): Promise<string> {
  try {
    const response = await axios.post(
      Z_AI_API_URL,
      {
        model: process.env.Z_AI_MODEL || 'glm-4.6', // GLM-4.6 model
        messages: [
          {
            role: 'system',
            content: 'You are an expert Meta Ads analyst. Analyze the provided CSV data and generate insights based on the requirements.'
          },
          {
            role: 'user',
            content: `${prompt}\n\nCSV Data:\n${csvData}`
          }
        ],
        temperature: 0.7,
        max_tokens: 4000
      },
      {
        headers: {
          'Authorization': `Bearer ${Z_AI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    )

    return response.data.choices[0].message.content
  } catch (error: any) {
    console.error('Z AI API Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      url: Z_AI_API_URL
    })
    
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error?.message ||
                        error.message || 
                        'Unknown error'
    
    throw new Error(`Failed to analyze CSV: ${errorMessage}`)
  }
}

export async function generateHTMLReportWithZAI(analysisData: any): Promise<string> {
  const prompt = `
Generate a complete HTML report for Meta Ads Weekly Performance Report using React + Tailwind CSS format.

REQUIREMENTS:
1. Use React via CDN (react@18.0.0, react-dom@18.0.0, @babel/standalone)
2. Use Tailwind CSS via CDN
3. Use Font Awesome 5.15.3 for icons
4. Use Inter font from Google Fonts
5. Brand colors: #2B46BB (blue), #ECDC43 (yellow)
6. Growth positive: green, Growth negative: red

OUTPUT FORMAT:
- Complete HTML with React component
- All 13 slides as shown in the example
- Use JSX syntax with Babel
- Include all data from analysisData

Generate complete HTML report with the following structure:

1. DESKRIPSI UMUM
- Presentasi perbandingan performa iklan Meta Ads untuk client Hadona dengan periode Minggu Ini vs Minggu Lalu (Week-on-Week)
- Profesional, minimalis, mudah dibaca, fokus pada insight & pengambilan keputusan

2. BRAND & WARNA (WAJIB)
- Biru: #2B46BB
- Kuning: #ECDC43
- Growth % naik → Hijau
- Growth % turun → Merah
- Jika turun, WAJIB sertakan alasan singkat (1 kalimat)

3. FITUR TAMBAHAN (WAJIB)
- Setiap slide HARUS memiliki kesimpulan ringkas / key insight
- Kalimat penting untuk client boleh di-bold
- Gunakan ikon/emoji dari Bootstrap Icons

4. DESAIN & GAYA VISUAL
- Logo Hadona: https://hadona.id/wp-content/uploads/2024/12/cropped-Hadona-Logo-1-300x300.png
- Ukuran slide: Full width × 720px
- Semua angka gunakan format ribuan (contoh: 1,532,000)
- Font modern & profesional
- Visualisasi data yang jelas & relevan

5. STRUKTUR PRESENTASI (13 SLIDE):
- SLIDE 1: WELCOME (Weekly over Weekly Reporting, Meta Ads – Hadona × RMODA Studio BSD)
- SLIDE 2: PERFORMANCE SUMMARY (2 kolom: Minggu Ini vs Minggu Lalu dengan Spend, Result, CPR, Growth %)
- SLIDE 3: TABEL RINGKASAN METRIK (tabel full width dengan 5 kolom)
- SLIDE 4: WEEK-ON-WEEK ANALYSIS (Highlight & Lowlight)
- SLIDE 5: AUDIENCE PERFORMANCE: AGE
- SLIDE 6: AUDIENCE PERFORMANCE: GENDER
- SLIDE 7: AUDIENCE PERFORMANCE: REGION
- SLIDE 8: PLATFORM PERFORMANCE
- SLIDE 9: CONTENT PERFORMANCE: PLACEMENT
- SLIDE 10: CREATIVE PERFORMANCE: AD ANALYSIS
- SLIDE 11: CAMPAIGN OBJECTIVE PERFORMANCE
- SLIDE 12: OVERALL CONCLUSION & STRATEGIC ACTION PLAN
- SLIDE 13: THANK YOU

Generate complete HTML with inline CSS, Bootstrap Icons, and all 13 slides based on this analysis data:
${JSON.stringify(analysisData, null, 2)}
`

  try {
    const response = await axios.post(
      Z_AI_API_URL,
      {
        model: process.env.Z_AI_MODEL || 'glm-4.6', // GLM-4.6 model
        messages: [
          {
            role: 'system',
            content: 'You are an expert HTML/CSS developer specializing in creating professional presentation reports. Generate complete, valid HTML with inline CSS.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 8000
      },
      {
        headers: {
          'Authorization': `Bearer ${Z_AI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    )

    return response.data.choices[0].message.content
  } catch (error: any) {
    console.error('Z AI API Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      url: Z_AI_API_URL
    })
    
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error?.message ||
                        error.message || 
                        'Unknown error'
    
    throw new Error(`Failed to generate HTML report: ${errorMessage}`)
  }
}

