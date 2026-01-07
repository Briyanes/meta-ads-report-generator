// lib/reports/ctwa/metrics.ts
// Semua rumus dan kalkulasi metrics untuk CTWA report

export interface CTWAWeekData {
  amountSpent?: any
  messagingConversations?: any
  results?: any
  impressions?: any
  linkClicks?: any
  outboundClicks?: any
  ctr?: any
  ctrAll?: any
  cpc?: any
  cpm?: any
}

export interface CTWAReportData {
  thisWeek?: CTWAWeekData
  lastWeek?: CTWAWeekData
  thisWeekData?: CTWAWeekData
  lastWeekData?: CTWAWeekData
  breakdown?: any
  performanceSummary?: any
  thisPeriodLabel?: string
  lastPeriodLabel?: string
}

export interface CalculatedMetrics {
  // Basic metrics
  thisWeek: {
    spend: number
    results: number
    cpr: number
    impressions: number
    linkClicks: number
    outboundClicks: number
    ctr: number
    cpc: number
    cpm: number
  }
  lastWeek: {
    spend: number
    results: number
    cpr: number
    impressions: number
    linkClicks: number
    outboundClicks: number
    ctr: number
    cpc: number
    cpm: number
  }
  // Growth metrics
  growth: {
    spend: number
    results: number
    cpr: number
    impressions: number
    ctr: number
    cpc: number
  }
}

// ===== HELPER FUNCTIONS =====

/**
 * Parse any value to number safely
 */
export const parseNum = (val: any): number => {
  if (typeof val === 'number') return val
  if (!val) return 0
  const parsed = parseFloat(String(val).replace(/,/g, ''))
  return isNaN(parsed) ? 0 : parsed
}

/**
 * Calculate growth percentage
 */
export const calculateGrowth = (current: number, previous: number): number => {
  if (!previous || previous === 0) return 0
  return ((current - previous) / previous) * 100
}

/**
 * Format currency to Indonesian Rupiah
 */
export const formatCurrency = (num: number): string => {
  if (num === null || num === undefined || isNaN(num)) return 'Rp 0'
  return 'Rp ' + Math.round(num).toLocaleString('id-ID')
}

/**
 * Format number with thousand separators
 */
export const formatNumber = (num: number): string => {
  if (num === null || num === undefined || isNaN(num)) return '0'
  return Math.round(num).toLocaleString('id-ID')
}

/**
 * Format number as percentage
 */
export const formatPercent = (num: number): string => {
  if (num === null || num === undefined || isNaN(num)) return '0%'
  return num.toFixed(2) + '%'
}

/**
 * Get CSS class for badge based on growth
 */
export const getBadgeClass = (growth: number): string => {
  return growth >= 0 ? 'badge-green' : 'badge-red'
}

/**
 * Get growth text with sign
 */
export const getGrowthText = (growth: number): string => {
  const sign = growth >= 0 ? '+' : ''
  return sign + growth.toFixed(2) + '%'
}

// ===== CORE METRICS CALCULATION =====

/**
 * Calculate all metrics for CTWA report
 */
export function calculateAllMetrics(data: CTWAReportData): CalculatedMetrics {
  // Get data from performanceSummary or fallback to direct properties
  const thisWeekData = data.performanceSummary?.thisWeek || data.thisWeek || data.thisWeekData || {}
  const lastWeekData = data.performanceSummary?.lastWeek || data.lastWeek || data.lastWeekData || {}

  // Extract metrics - this week
  const thisSpent = parseNum(thisWeekData.amountSpent)
  const thisResults = parseNum(thisWeekData.messagingConversations || thisWeekData.results)
  const thisImpr = parseNum(thisWeekData.impressions)
  const thisLinkClicks = parseNum(thisWeekData.linkClicks || 0)
  const thisOutboundClicks = parseNum(thisWeekData.outboundClicks || 0)
  const thisCTR = parseNum(thisWeekData.ctr || thisWeekData.ctrAll || 0)
  const thisCPC = parseNum(thisWeekData.cpc || 0)

  // Extract metrics - last week
  const lastSpent = parseNum(lastWeekData.amountSpent)
  const lastResults = parseNum(lastWeekData.messagingConversations || lastWeekData.results)
  const lastImpr = parseNum(lastWeekData.impressions)
  const lastLinkClicks = parseNum(lastWeekData.linkClicks || 0)
  const lastOutboundClicks = parseNum(lastWeekData.outboundClicks || 0)
  const lastCTR = parseNum(lastWeekData.ctr || lastWeekData.ctrAll || 0)
  const lastCPC = parseNum(lastWeekData.cpc || 0)

  // Calculate CPR manually: Amount Spent / Messaging Conversations
  const thisCPR = thisResults > 0 ? thisSpent / thisResults : 0
  const lastCPR = lastResults > 0 ? lastSpent / lastResults : 0

  // Calculate CPM manually
  const thisCPM = thisImpr > 0 ? (thisSpent / thisImpr) * 1000 : 0
  const lastCPM = lastImpr > 0 ? (lastSpent / lastImpr) * 1000 : 0

  // Calculate growth
  const spendGrowth = calculateGrowth(thisSpent, lastSpent)
  const resultsGrowth = calculateGrowth(thisResults, lastResults)
  const cprGrowth = calculateGrowth(thisCPR, lastCPR)
  const imprGrowth = calculateGrowth(thisImpr, lastImpr)
  const ctrGrowth = calculateGrowth(thisCTR, lastCTR)
  const cpcGrowth = calculateGrowth(thisCPC, lastCPC)

  return {
    thisWeek: {
      spend: thisSpent,
      results: thisResults,
      cpr: thisCPR,
      impressions: thisImpr,
      linkClicks: thisLinkClicks,
      outboundClicks: thisOutboundClicks,
      ctr: thisCTR,
      cpc: thisCPC,
      cpm: thisCPM,
    },
    lastWeek: {
      spend: lastSpent,
      results: lastResults,
      cpr: lastCPR,
      impressions: lastImpr,
      linkClicks: lastLinkClicks,
      outboundClicks: lastOutboundClicks,
      ctr: lastCTR,
      cpc: lastCPC,
      cpm: lastCPM,
    },
    growth: {
      spend: spendGrowth,
      results: resultsGrowth,
      cpr: cprGrowth,
      impressions: imprGrowth,
      ctr: ctrGrowth,
      cpc: cpcGrowth,
    },
  }
}
