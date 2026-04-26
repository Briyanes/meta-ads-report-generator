// Helper utilities for safe breakdown data access
// BUG #3 FIX: Prevent crashes from undefined breakdown data

// BUG #10 FIX: Import centralized parseNum from csvParser
import { parseNum as centralizedParseNum } from '@/lib/csvParser'

// Use centralized parseNum everywhere for consistency
const parseNum = centralizedParseNum

export interface BreakdownItem {
  [key: string]: any
}

/**
 * Safely get breakdown data with fallback
 * BUG #3 FIX: Prevents crashes when breakdown data is undefined/empty
 */
export function getSafeBreakdownData(breakdown: BreakdownItem[] | undefined | null): BreakdownItem[] {
  if (!breakdown || !Array.isArray(breakdown) || breakdown.length === 0) {
    return []
  }
  return breakdown
}

/**
 * Get top performer from breakdown data safely
 */
export function getTopPerformer(
  breakdown: BreakdownItem[] | undefined | null,
  sortBy: string = 'Amount spent (IDR)',
  fallbackValue: Partial<BreakdownItem> = {}
): BreakdownItem {
  const data = getSafeBreakdownData(breakdown)
  
  if (data.length === 0) {
    return {
      name: 'N/A',
      value: 0,
      ...fallbackValue
    }
  }

  try {
    const sorted = [...data].sort((a, b) => {
      const aVal = parseNum(a[sortBy] || 0)
      const bVal = parseNum(b[sortBy] || 0)
      return bVal - aVal
    })

    return sorted[0] || { name: 'N/A', value: 0, ...fallbackValue }
  } catch (error) {
    console.error('[SAFE BREAKDOWN] Error getting top performer:', error)
    return { name: 'N/A', value: 0, ...fallbackValue }
  }
}

/**
 * Get top N items from breakdown data safely
 */
export function getTopItems(
  breakdown: BreakdownItem[] | undefined | null,
  count: number = 10,
  sortBy: string = 'Amount spent (IDR)'
): BreakdownItem[] {
  const data = getSafeBreakdownData(breakdown)
  
  if (data.length === 0) {
    return []
  }

  try {
    return [...data]
      .sort((a, b) => {
        const aVal = parseNum(a[sortBy] || 0)
        const bVal = parseNum(b[sortBy] || 0)
        return bVal - aVal
      })
      .slice(0, Math.max(count, 1))
  } catch (error) {
    console.error('[SAFE BREAKDOWN] Error getting top items:', error)
    return data.slice(0, count)
  }
}

/**
 * Safely calculate breakdown statistics
 */
export function getBreakdownStats(
  breakdown: BreakdownItem[] | undefined | null,
  metricField: string = 'Amount spent (IDR)'
): {
  total: number
  count: number
  average: number
  min: number
  max: number
} {
  const data = getSafeBreakdownData(breakdown)

  if (data.length === 0) {
    return { total: 0, count: 0, average: 0, min: 0, max: 0 }
  }

  try {
    const values = data
      .map(item => parseNum(item[metricField] || 0))
      .filter(v => !isNaN(v) && v !== Infinity && v !== -Infinity && v > 0)

    if (values.length === 0) {
      return { total: 0, count: data.length, average: 0, min: 0, max: 0 }
    }

    const total = values.reduce((sum, v) => sum + v, 0)
    const average = total / values.length
    const min = Math.min(...values)
    const max = Math.max(...values)

    return { total, count: data.length, average, min, max }
  } catch (error) {
    console.error('[SAFE BREAKDOWN] Error calculating stats:', error)
    return { total: 0, count: data.length, average: 0, min: 0, max: 0 }
  }
}

/**
 * Safely get breakdown dimension value
 */
export function getDimensionValue(
  item: BreakdownItem | undefined | null,
  dimensionKey: string,
  fallback: string = 'N/A'
): string {
  if (!item || typeof item !== 'object') return fallback
  
  const value = item[dimensionKey]
  if (value === null || value === undefined || value === '') return fallback
  
  return String(value)
}
