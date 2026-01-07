// lib/reports/cpas/metrics.ts
// Semua rumus dan kalkulasi metrics untuk CPAS report

export interface CPASMonthData {
  amountSpent?: any
  addToCart?: any
  addsToCart?: any
  purchases?: any
  impressions?: any
  linkClicks?: any
  outboundClicks?: any
  ctr?: any
  cpm?: any
  cpc?: any
  atcConversionValue?: any
  purchasesConversionValue?: any
  roas?: any
  aov?: any
  amountSpentUsd?: any
}

export interface CPASReportData {
  thisMonthData: CPASMonthData
  lastMonthData: CPASMonthData
  ageBreakdown?: any[]
  genderBreakdown?: any[]
  regionBreakdown?: any[]
  platformBreakdown?: any[]
  placementBreakdown?: any[]
  objectiveBreakdown?: any[]
  creativeBreakdown?: any[]
  eventAnalysis?: any
  thisPeriodLabel?: string
  lastPeriodLabel?: string
}

export interface CalculatedMetrics {
  // Basic metrics
  thisMonth: {
    spend: number
    atc: number
    purchases: number
    impressions: number
    linkClicks: number
    ctr: number
    cpm: number
    cpc: number
    atcCV: number
    purchaseCV: number
    roas: number
    aov: number
    conversionRate: number
    cpr: number
  }
  lastMonth: {
    spend: number
    atc: number
    purchases: number
    impressions: number
    linkClicks: number
    ctr: number
    cpm: number
    cpc: number
    atcCV: number
    purchaseCV: number
    roas: number
    aov: number
    conversionRate: number
    cpr: number
  }
  // Growth metrics
  growth: {
    spend: number
    atc: number
    purchases: number
    impressions: number
    linkClicks: number
    ctr: number
    cpm: number
    cpc: number
    atcCV: number
    purchaseCV: number
    roas: number
    aov: number
    conversionRate: number
    cpr: number
  }
  // Flags
  isNewClient: boolean
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
export const calcGrowth = (thisVal: number, lastVal: number): number => {
  if (lastVal === 0) return 0
  return ((thisVal - lastVal) / lastVal) * 100
}

/**
 * Format currency to Indonesian Rupiah
 */
export const formatCurrency = (num: number): string => {
  return 'Rp ' + Math.round(num).toLocaleString('id-ID')
}

/**
 * Format number with thousand separators
 */
export const formatNumber = (num: number): string => {
  return Math.round(num).toLocaleString('id-ID')
}

/**
 * Format number as percentage
 */
export const formatPercent = (num: number): string => {
  return num.toFixed(2) + '%'
}

/**
 * Get CSS class for difference value
 */
export const getDiffClass = (thisVal: number, lastVal: number): string => {
  return thisVal >= lastVal ? 'text-green-600' : 'text-red-600'
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

// ===== FORMAT FUNCTIONS FOR NEW CLIENTS =====

/**
 * Format currency with smart handling for new clients
 */
export const smartFormatCurrency = (num: number, isNewClient: boolean, isLastPeriod: boolean = false): string => {
  if (isLastPeriod && isNewClient && num === 0) return '-'
  return formatCurrency(num)
}

/**
 * Format number with smart handling for new clients
 */
export const smartFormatNumber = (num: number, isNewClient: boolean, isLastPeriod: boolean = false): string => {
  if (isLastPeriod && isNewClient && num === 0) return '-'
  return formatNumber(num)
}

/**
 * Format percent with smart handling for new clients
 */
export const smartFormatPercent = (num: number, isNewClient: boolean, isLastPeriod: boolean = false): string => {
  if (isLastPeriod && isNewClient && num === 0) return '-'
  return num.toFixed(2) + '%'
}

/**
 * Format last period value (show "-" for new clients)
 */
export const formatLastPeriod = (value: number, isNewClient: boolean): string => {
  return isNewClient && value === 0 ? '-' : formatNumber(value)
}

/**
 * Format last period currency (show "-" for new clients)
 */
export const formatLastPeriodCurrency = (value: number, isNewClient: boolean): string => {
  return isNewClient && value === 0 ? '-' : formatCurrency(value)
}

/**
 * Format last period percent (show "-" for new clients)
 */
export const formatLastPeriodPercent = (value: number, isNewClient: boolean): string => {
  return isNewClient && value === 0 ? '-' : value.toFixed(2) + '%'
}

/**
 * Format growth for new clients (show "N/A" instead of percentage)
 */
export const formatGrowthForNewClient = (growth: number, isNewClient: boolean): string => {
  return isNewClient ? 'N/A' : getGrowthText(growth)
}

// ===== CORE METRICS CALCULATION =====

/**
 * Calculate all metrics for CPAS report
 */
export function calculateAllMetrics(data: CPASReportData): CalculatedMetrics {
  const { thisMonthData, lastMonthData } = data

  // Check if this is a new client (no last month data)
  const rawLastMonthSpend = parseNum(lastMonthData.amountSpent)
  const rawLastMonthImpr = parseNum(lastMonthData.impressions)
  const rawLastMonthATC = parseNum(lastMonthData.addToCart || lastMonthData.addsToCart)
  const isNewClient = rawLastMonthSpend === 0 && rawLastMonthImpr === 0 && rawLastMonthATC === 0

  // Extract basic metrics - this month
  const thisMonthSpend = parseNum(thisMonthData.amountSpent)
  const thisMonthATC = parseNum(thisMonthData.addToCart || thisMonthData.addsToCart)
  const thisMonthPurchases = parseNum(thisMonthData.purchases)
  const thisMonthImpressions = parseNum(thisMonthData.impressions)
  const thisMonthClicks = parseNum(thisMonthData.linkClicks || thisMonthData.outboundClicks)

  // Extract basic metrics - last month
  const lastMonthSpend = parseNum(lastMonthData.amountSpent)
  const lastMonthATC = parseNum(lastMonthData.addToCart || lastMonthData.addsToCart)
  const lastMonthPurchases = parseNum(lastMonthData.purchases)
  const lastMonthImpressions = parseNum(lastMonthData.impressions)
  const lastMonthClicks = parseNum(lastMonthData.linkClicks || lastMonthData.outboundClicks)

  // Calculate derived metrics - this month
  const thisMonthCTR = thisMonthData.ctr || (thisMonthClicks > 0 && thisMonthImpressions > 0 ? (thisMonthClicks / thisMonthImpressions * 100) : 0)
  const thisMonthCPM = thisMonthData.cpm || (thisMonthImpressions > 0 ? (thisMonthSpend / thisMonthImpressions * 1000) : 0)
  const thisMonthCPC = thisMonthData.cpc || (thisMonthClicks > 0 ? (thisMonthSpend / thisMonthClicks) : 0)

  // CPAS-specific metrics - this month
  const thisMonthATCCV = parseNum(thisMonthData.atcConversionValue)
  const thisMonthPurchaseCV = parseNum(thisMonthData.purchasesConversionValue)
  const thisMonthROAS = thisMonthData.roas || (thisMonthSpend > 0 ? (thisMonthPurchaseCV / thisMonthSpend) : 0)
  const thisMonthAOV = thisMonthData.aov || (thisMonthPurchases > 0 ? (thisMonthPurchaseCV / thisMonthPurchases) : 0)
  const cprThisMonth = thisMonthATC > 0 ? (thisMonthSpend / thisMonthATC) : 0
  const conversionRateThis = thisMonthClicks > 0 ? (thisMonthPurchases / thisMonthClicks) * 100 : 0

  // Calculate derived metrics - last month
  const lastMonthCTR = lastMonthData.ctr || (lastMonthClicks > 0 && lastMonthImpressions > 0 ? (lastMonthClicks / lastMonthImpressions * 100) : 0)
  const lastMonthCPM = lastMonthData.cpm || (lastMonthImpressions > 0 ? (lastMonthSpend / lastMonthImpressions * 1000) : 0)
  const lastMonthCPC = lastMonthData.cpm || (lastMonthClicks > 0 ? (lastMonthSpend / lastMonthClicks) : 0)

  // CPAS-specific metrics - last month
  const lastMonthATCCV = parseNum(lastMonthData.atcConversionValue)
  const lastMonthPurchaseCV = parseNum(lastMonthData.purchasesConversionValue)
  const lastMonthROAS = lastMonthData.roas || (lastMonthSpend > 0 ? (lastMonthPurchaseCV / lastMonthSpend) : 0)
  const lastMonthAOV = lastMonthData.aov || (lastMonthPurchases > 0 ? (lastMonthPurchaseCV / lastMonthPurchases) : 0)
  const cprLastMonth = lastMonthATC > 0 ? (lastMonthSpend / lastMonthATC) : 0
  const conversionRateLast = lastMonthClicks > 0 ? (lastMonthPurchases / lastMonthClicks) * 100 : 0

  // Calculate all growth metrics
  const spendGrowth = calcGrowth(thisMonthSpend, lastMonthSpend)
  const atcGrowth = calcGrowth(thisMonthATC, lastMonthATC)
  const purchGrowth = calcGrowth(thisMonthPurchases, lastMonthPurchases)
  const imprGrowth = calcGrowth(thisMonthImpressions, lastMonthImpressions)
  const clicksGrowth = calcGrowth(thisMonthClicks, lastMonthClicks)
  const ctrGrowth = calcGrowth(thisMonthCTR, lastMonthCTR)
  const cpmGrowth = calcGrowth(thisMonthCPM, lastMonthCPM)
  const cpcGrowth = calcGrowth(thisMonthCPC, lastMonthCPC)
  const atcCVGrowth = calcGrowth(thisMonthATCCV, lastMonthATCCV)
  const purchaseCVGrowth = calcGrowth(thisMonthPurchaseCV, lastMonthPurchaseCV)
  const roasGrowth = calcGrowth(thisMonthROAS, lastMonthROAS)
  const aovGrowth = calcGrowth(thisMonthAOV, lastMonthAOV)
  const cprGrowth = calcGrowth(cprThisMonth, cprLastMonth)
  const conversionRateGrowth = calcGrowth(conversionRateThis, conversionRateLast)

  return {
    thisMonth: {
      spend: thisMonthSpend,
      atc: thisMonthATC,
      purchases: thisMonthPurchases,
      impressions: thisMonthImpressions,
      linkClicks: thisMonthClicks,
      ctr: thisMonthCTR,
      cpm: thisMonthCPM,
      cpc: thisMonthCPC,
      atcCV: thisMonthATCCV,
      purchaseCV: thisMonthPurchaseCV,
      roas: thisMonthROAS,
      aov: thisMonthAOV,
      conversionRate: conversionRateThis,
      cpr: cprThisMonth,
    },
    lastMonth: {
      spend: lastMonthSpend,
      atc: lastMonthATC,
      purchases: lastMonthPurchases,
      impressions: lastMonthImpressions,
      linkClicks: lastMonthClicks,
      ctr: lastMonthCTR,
      cpm: lastMonthCPM,
      cpc: lastMonthCPC,
      atcCV: lastMonthATCCV,
      purchaseCV: lastMonthPurchaseCV,
      roas: lastMonthROAS,
      aov: lastMonthAOV,
      conversionRate: conversionRateLast,
      cpr: cprLastMonth,
    },
    growth: {
      spend: spendGrowth,
      atc: atcGrowth,
      purchases: purchGrowth,
      impressions: imprGrowth,
      linkClicks: clicksGrowth,
      ctr: ctrGrowth,
      cpm: cpmGrowth,
      cpc: cpcGrowth,
      atcCV: atcCVGrowth,
      purchaseCV: purchaseCVGrowth,
      roas: roasGrowth,
      aov: aovGrowth,
      conversionRate: conversionRateGrowth,
      cpr: cprGrowth,
    },
    isNewClient,
  }
}

// ===== ADDITIONAL METRICS (untuk breakdown sections) =====

/**
 * Calculate metrics for breakdown items (age, gender, region, etc.)
 */
export function calculateBreakdownMetrics(items: any[], metricKey: string = 'Amount spent (IDR)') {
  return items.map(item => ({
    ...item,
    amountSpent: parseNum(item['Amount spent (IDR)'] || item.amountSpent),
    impressions: parseNum(item.impressions || item.Impressions),
    results: parseNum(item[metricKey]),
  }))
}
