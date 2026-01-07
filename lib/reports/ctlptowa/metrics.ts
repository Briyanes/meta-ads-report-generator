// lib/reports/ctlptowa/metrics.ts
// Semua rumus dan kalkulasi metrics untuk CTLPTOWA report

export interface CTLPTOWAWeekData {
  amountSpent?: any
  checkoutsInitiated?: any
  results?: any
  impressions?: any
  linkClicks?: any
  outboundClicks?: any
  clicksAll?: any
  ctr?: any
  ctrAll?: any
  cpc?: any
  cpm?: any
}

export interface CTLPTOWAReportData {
  thisWeek?: CTLPTOWAWeekData
  lastWeek?: CTLPTOWAWeekData
  thisWeekData?: CTLPTOWAWeekData
  lastWeekData?: CTLPTOWAWeekData
  breakdown?: any
}

export interface CalculatedMetrics {
  thisWeek: {
    spend: number
    results: number
    cpr: number
    impressions: number
    linkClicks: number
    outboundClicks: number
    clicksAll: number
    ctr: number
    ctrAll: number
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
    clicksAll: number
    ctr: number
    ctrAll: number
    cpc: number
    cpm: number
  }
  growth: {
    spend: number
    results: number
    cpr: number
    impressions: number
    ctr: number
    cpc: number
  }
}

// Helper functions
export const parseNum = (val: any): number => {
  if (typeof val === 'number') return val
  if (!val) return 0
  const parsed = parseFloat(String(val).replace(/,/g, ''))
  return isNaN(parsed) ? 0 : parsed
}

export const calculateGrowth = (current: number, previous: number): number => {
  if (!previous || previous === 0) return 0
  return ((current - previous) / previous) * 100
}

export const formatCurrency = (num: number): string => {
  if (num === null || num === undefined || isNaN(num)) return 'Rp 0'
  return 'Rp ' + Math.round(num).toLocaleString('id-ID')
}

export const formatNumber = (num: number): string => {
  if (num === null || num === undefined || isNaN(num)) return '0'
  return Math.round(num).toLocaleString('id-ID')
}

export const formatPercent = (num: number): string => {
  if (num === null || num === undefined || isNaN(num)) return '0%'
  return num.toFixed(2) + '%'
}

/**
 * Calculate all metrics for CTLPTOWA report
 */
export function calculateAllMetrics(data: CTLPTOWAReportData): CalculatedMetrics {
  const thisWeekData = data.thisWeek || data.thisWeekData || {}
  const lastWeekData = data.lastWeek || data.lastWeekData || {}

  // Extract metrics - this week
  const thisSpent = parseNum(thisWeekData.amountSpent)
  const thisResults = parseNum(thisWeekData.checkoutsInitiated || thisWeekData.results)
  const thisImpr = parseNum(thisWeekData.impressions)
  const thisLinkClicks = parseNum(thisWeekData.linkClicks || 0)
  const thisOutboundClicks = parseNum(thisWeekData.outboundClicks || 0)
  const thisClicksAll = parseNum(thisWeekData.clicksAll || 0)
  const thisCTR = parseNum(thisWeekData.ctr || 0)
  const thisCTRAll = parseNum(thisWeekData.ctrAll || 0)
  const thisCPC = parseNum(thisWeekData.cpc || 0)

  // Extract metrics - last week
  const lastSpent = parseNum(lastWeekData.amountSpent)
  const lastResults = parseNum(lastWeekData.checkoutsInitiated || lastWeekData.results)
  const lastImpr = parseNum(lastWeekData.impressions)
  const lastLinkClicks = parseNum(lastWeekData.linkClicks || 0)
  const lastOutboundClicks = parseNum(lastWeekData.outboundClicks || 0)
  const lastClicksAll = parseNum(lastWeekData.clicksAll || 0)
  const lastCTR = parseNum(lastWeekData.ctr || 0)
  const lastCTRAll = parseNum(lastWeekData.ctrAll || 0)
  const lastCPC = parseNum(lastWeekData.cpc || 0)

  // Calculate CPR: Amount Spent / Checkouts Initiated
  const thisCPR = thisResults > 0 ? thisSpent / thisResults : 0
  const lastCPR = lastResults > 0 ? lastSpent / lastResults : 0

  // Calculate CPM
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
      clicksAll: thisClicksAll,
      ctr: thisCTR,
      ctrAll: thisCTRAll,
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
      clicksAll: lastClicksAll,
      ctr: lastCTR,
      ctrAll: lastCTRAll,
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
