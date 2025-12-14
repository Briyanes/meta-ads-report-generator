import Papa from 'papaparse'

export interface MetaAdsData {
  [key: string]: any
}

export interface ParsedData {
  data: MetaAdsData[]
  headers: string[]
  summary: {
    totalRows: number
    dateRange?: {
      start: string
      end: string
    }
  }
}

export async function parseCSV(file: File | string): Promise<ParsedData> {
  // If file is a string (CSV text), parse directly
  // If file is a File object, read it as text first
  let csvText: string
  
  if (typeof file === 'string') {
    csvText = file
  } else {
    // Read file as text (works in both browser and Node.js)
    csvText = await file.text()
  }
  
  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data as MetaAdsData[]
        const headers = results.meta.fields || []
        
        resolve({
          data,
          headers,
          summary: {
            totalRows: data.length
          }
        })
      },
      error: (error: any) => {
        reject(new Error(`Failed to parse CSV: ${error.message}`))
      }
    })
  })
}

export function analyzeDataStructure(data: MetaAdsData[]): {
  hasAge: boolean
  hasGender: boolean
  hasRegion: boolean
  hasPlatform: boolean
  hasPlacement: boolean
  hasObjective: boolean
  hasCreative: boolean
} {
  if (data.length === 0) {
    return {
      hasAge: false,
      hasGender: false,
      hasRegion: false,
      hasPlatform: false,
      hasPlacement: false,
      hasObjective: false,
      hasCreative: false
    }
  }

  const firstRow = data[0]
  const keys = Object.keys(firstRow).map(k => k.toLowerCase())

  return {
    hasAge: keys.some(k => k.includes('age')),
    hasGender: keys.some(k => k.includes('gender')),
    hasRegion: keys.some(k => k.includes('region') || k.includes('location')),
    hasPlatform: keys.some(k => k.includes('platform') || k.includes('device')),
    hasPlacement: keys.some(k => k.includes('placement')),
    hasObjective: keys.some(k => k.includes('objective') || k.includes('campaign')),
    hasCreative: keys.some(k => k.includes('creative') || k.includes('ad name'))
  }
}

export function formatNumber(num: number | string): string {
  const numValue = typeof num === 'string' ? parseFloat(num) : num
  if (isNaN(numValue)) return '0'
  return numValue.toLocaleString('id-ID')
}

export function calculateGrowth(current: number, previous: number): {
  value: number
  percentage: number
  isPositive: boolean
} {
  if (previous === 0) {
    return {
      value: current,
      percentage: current > 0 ? 100 : 0,
      isPositive: current > 0
    }
  }

  const growth = current - previous
  const percentage = (growth / previous) * 100

  return {
    value: growth,
    percentage: Math.round(percentage * 100) / 100,
    isPositive: growth >= 0
  }
}

