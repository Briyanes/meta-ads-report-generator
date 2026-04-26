/**
 * TypeScript interfaces for analysis data structures
 * BUG #11 FIX: Proper type safety for all analysis data
 */

// Single metric data
export interface MetricValue {
  amount?: number
  value?: number
  count?: number
  rate?: number
  roas?: number
  aov?: number
  cpr?: number
  cpp?: number
  cpc?: number
  cpm?: number
  ctr?: number
  [key: string]: number | undefined
}

// Period data (Week or Month)
export interface PeriodData {
  amountSpent?: number
  amount_spent?: number
  spend?: number
  
  // Reach & Impressions
  reach?: number
  impressions?: number
  frequency?: number
  
  // Clicks
  linkClicks?: number
  link_clicks?: number
  outboundClicks?: number
  outbound_clicks?: number
  clicksAll?: number
  clicks_all?: number
  
  // CTR & CPC
  ctr?: number
  ctrLinkClick?: number
  ctrAll?: number
  cpc?: number
  cpm?: number
  
  // Conversions
  results?: number
  addsToCart?: number
  adds_to_cart?: number
  addToCart?: number
  checkoutsInitiated?: number
  checkouts_initiated?: number
  landingPageViews?: number
  landing_page_views?: number
  contentViews?: number
  content_views?: number
  messagingConversations?: number
  messaging_conversations?: number
  purchases?: number
  
  // Conversion values
  purchasesConversionValue?: number
  purchases_conversion_value?: number
  purchaseValue?: number
  atcConversionValue?: number
  atc_conversion_value?: number
  atcValue?: number
  
  // Metrics
  roas?: number
  aov?: number
  cpr?: number
  cpp?: number
  conversionRate?: number
  conversion_rate?: number
  
  // Allow additional fields
  [key: string]: any
}

// Breakdown item (for age, gender, region, etc.)
export interface BreakdownItemData {
  name?: string
  dimension?: string
  value?: number
  count?: number
  rate?: number
  [key: string]: any
}

// Breakdown by dimension
export interface BreakdownDimension {
  age?: BreakdownItemData[]
  gender?: BreakdownItemData[]
  region?: BreakdownItemData[]
  platform?: BreakdownItemData[]
  placement?: BreakdownItemData[]
  objective?: BreakdownItemData[]
  'ad-creative'?: BreakdownItemData[]
  adCreative?: BreakdownItemData[]
  [key: string]: BreakdownItemData[] | undefined
}

// Breakdown data for a period
export interface PeriodBreakdown {
  age?: BreakdownItemData[]
  gender?: BreakdownItemData[]
  region?: BreakdownItemData[]
  platform?: BreakdownItemData[]
  placement?: BreakdownItemData[]
  objective?: BreakdownItemData[]
  'ad-creative'?: BreakdownItemData[]
  adCreative?: BreakdownItemData[]
  [key: string]: BreakdownItemData[] | undefined
}

// All breakdown data
export interface BreakdownData {
  thisWeek?: PeriodBreakdown
  lastWeek?: PeriodBreakdown
  thisMonth?: PeriodBreakdown
  lastMonth?: PeriodBreakdown
  [key: string]: PeriodBreakdown | undefined
}

// Performance summary
export interface PerformanceSummary {
  thisWeek?: PeriodData
  lastWeek?: PeriodData
  thisMonth?: PeriodData
  lastMonth?: PeriodData
  [key: string]: PeriodData | undefined
}

// Complete analysis data structure
export interface AnalysisData {
  performanceSummary?: PerformanceSummary
  breakdown?: BreakdownData
  thisWeek?: PeriodData
  lastWeek?: PeriodData
  thisMonth?: PeriodData
  lastMonth?: PeriodData
  dateRange?: {
    start?: string
    end?: string
  }
  metadata?: {
    totalRows?: number
    objectiveType?: string
    retentionType?: string
    reportName?: string
    [key: string]: any
  }
  [key: string]: any
}

/**
 * Type guard to validate analysis data structure
 */
export function isValidAnalysisData(data: any): data is AnalysisData {
  return (
    typeof data === 'object' &&
    data !== null &&
    (typeof data.performanceSummary === 'object' ||
      typeof data.breakdown === 'object' ||
      typeof data.thisWeek === 'object' ||
      typeof data.thisMonth === 'object')
  )
}

/**
 * Type guard to validate period data
 */
export function isValidPeriodData(data: any): data is PeriodData {
  return typeof data === 'object' && data !== null
}

/**
 * Type guard to validate breakdown data
 */
export function isValidBreakdownData(data: any): data is BreakdownData {
  return typeof data === 'object' && data !== null
}

/**
 * Safe getter for analysis data with type checking
 */
export function getAnalysisValue(
  data: any,
  path: string[],
  fallback: any = undefined
): any {
  try {
    let current = data
    for (const key of path) {
      if (current == null || typeof current !== 'object') {
        return fallback
      }
      current = current[key]
    }
    return current ?? fallback
  } catch (error) {
    console.error('[ANALYSIS TYPE] Error accessing path:', path, error)
    return fallback
  }
}
