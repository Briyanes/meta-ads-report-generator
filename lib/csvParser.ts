import Papa from 'papaparse'

// =====================================
// FIELD NAME CONSTANTS
// Centralized mapping for Meta Ads CSV field names
// Handle variations in column naming across different CSV exports
// =====================================

export const FIELD_NAMES = {
  // Spend & Budget
  AMOUNT_SPENT: ['Amount spent (IDR)', 'Amount Spent', 'amount spent', 'Spend'],
  
  // Reach & Impressions
  REACH: ['Reach', 'reach', 'Accounts Center accounts reached'],
  IMPRESSIONS: ['Impressions', 'impressions'],
  FREQUENCY: ['Frequency', 'frequency'],
  
  // Clicks
  LINK_CLICKS: ['Link clicks', 'link clicks', 'Link Clicks'],
  OUTBOUND_CLICKS: ['Outbound clicks', 'outbound clicks', 'Outbound Clicks'],
  CLICKS_ALL: ['Clicks (all)', 'clicks (all)', 'Clicks'],
  
  // CTR & CPC
  CTR_LINK: ['CTR (link click-through rate)', 'CTR (link)', 'ctr link'],
  CTR_ALL: ['CTR (all)', 'ctr all'],
  CPC: ['CPC (cost per link click)', 'CPC', 'cpc'],
  CPM: ['CPM (cost per 1,000 impressions)', 'CPM', 'cpm'],
  
  // Conversions - CTWA
  MESSAGING_CONVERSATIONS: ['Messaging conversations started', 'messaging conversations started'],
  COST_PER_MESSAGING: ['Cost per messaging conversation started'],
  
  // Conversions - CTLPTOWA
  CHECKOUTS_INITIATED: ['Checkouts initiated', 'checkouts initiated', 'Checkouts Initiated'],
  LANDING_PAGE_VIEWS: ['Website landing page views', 'Landing page views', 'landing page views'],
  CONTENT_VIEWS: ['Content views', 'content views'],
  
  // Conversions - CPAS
  ADDS_TO_CART: ['Adds to cart with shared items', 'Adds to cart', 'adds to cart'],
  ATC_VALUE: ['Adds to cart conversion value for shared items only', 'ATC Value'],
  PURCHASES: ['Purchases with shared items', 'Purchases', 'purchases'],
  PURCHASES_VALUE: ['Purchases conversion value for shared items only', 'Purchase Value'],
  ROAS: ['ROAS', 'Results ROAS', 'roas'],
  AOV: ['AOV (IDR)', 'AOV', 'aov'],
  
  // Breakdown Dimensions
  AGE: ['Age', 'age'],
  GENDER: ['Gender', 'gender'],
  REGION: ['Region', 'region', 'Location'],
  PLATFORM: ['Platform', 'platform', 'Publisher platform'],
  PLACEMENT: ['Placement', 'placement', 'Publisher placement'],
  OBJECTIVE: ['Objective', 'objective', 'Campaign objective'],
} as const

// Helper function to get field value with multiple fallback names
export function getFieldByName(data: Record<string, any>, fieldNames: readonly string[]): any {
  for (const name of fieldNames) {
    if (data[name] !== undefined && data[name] !== null && data[name] !== '') {
      return data[name]
    }
  }
  return undefined
}

// Centralized parseNum function - single source of truth
export function parseNum(val: any): number {
  if (typeof val === 'number') return val
  if (!val || val === '-' || val === 'N/A') return 0
  // Remove commas, whitespace, currency symbols
  const cleanStr = String(val).replace(/[,\s]/g, '').replace(/^Rp\s*/i, '')
  const parsed = parseFloat(cleanStr)
  return isNaN(parsed) ? 0 : parsed
}

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
  let numValue: number
  if (typeof num === 'string') {
    // Remove commas and whitespace before parsing
    const cleanStr = num.replace(/,/g, '').replace(/\s+/g, '')
    numValue = parseFloat(cleanStr)
  } else {
    numValue = num
  }
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

