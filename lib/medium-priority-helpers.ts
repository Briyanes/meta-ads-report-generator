/**
 * Utility functions for Medium Priority Bug fixes
 * BUG #15-20 FIX: Common patterns for file processing, validation, and precision
 */

/**
 * BUG #15 FIX: Parallel file processing instead of sequential
 * Process multiple files concurrently with Promise.all
 */
export async function parseFilesInParallel<T>(
  files: File[],
  parseFunction: (file: File) => Promise<T>
): Promise<T[]> {
  if (!files || files.length === 0) {
    return []
  }

  try {
    return await Promise.all(
      files.map(file =>
        parseFunction(file).catch(error => {
          console.error(`[PARSE ERROR] Failed to parse file "${file.name}":`, error.message)
          throw error
        })
      )
    )
  } catch (error: any) {
    console.error('[PARALLEL PARSE] Error parsing files:', error.message)
    throw new Error(`Failed to parse files: ${error.message}`)
  }
}

/**
 * BUG #16 FIX: Normalize date types for reliable comparison
 */
export function normalizeDate(date: any): Date | null {
  if (!date) return null

  // Already a Date object
  if (date instanceof Date) {
    return isValidDate(date) ? date : null
  }

  // String format
  if (typeof date === 'string') {
    const parsed = new Date(date)
    return isValidDate(parsed) ? parsed : null
  }

  // Number (timestamp)
  if (typeof date === 'number') {
    const parsed = new Date(date)
    return isValidDate(parsed) ? parsed : null
  }

  return null
}

/**
 * Validate date object
 */
export function isValidDate(date: any): boolean {
  return date instanceof Date && !isNaN(date.getTime())
}

/**
 * BUG #16 FIX: Safe date range comparison
 */
export function isDateInRange(
  date: any,
  startDate: any,
  endDate: any
): boolean {
  const normalized = normalizeDate(date)
  const normalizedStart = normalizeDate(startDate)
  const normalizedEnd = normalizeDate(endDate)

  if (!normalized || !normalizedStart || !normalizedEnd) {
    console.warn('[DATE RANGE] Invalid date provided for comparison')
    return false
  }

  return normalized >= normalizedStart && normalized <= normalizedEnd
}

/**
 * BUG #17 FIX: Async retry with timeout
 */
export async function asyncRetryWithTimeout<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  timeoutMs: number = 5000,
  delayMs: number = 500
): Promise<T> {
  const startTime = Date.now()
  let lastError: Error | null = null

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    // Check timeout
    if (Date.now() - startTime > timeoutMs) {
      throw new Error(
        `Operation timeout after ${timeoutMs}ms (${attempt} attempts)`
      )
    }

    try {
      return await operation()
    } catch (error: any) {
      lastError = error
      console.warn(`[RETRY] Attempt ${attempt + 1}/${maxRetries} failed:`, error.message)

      // Don't delay on last attempt
      if (attempt < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delayMs))
      }
    }
  }

  throw lastError || new Error('Operation failed after all retries')
}

/**
 * BUG #18 FIX: Safe array operations with validation
 */
export function safeArrayOperation<T>(
  array: T[] | undefined | null,
  operation: (arr: T[]) => T[],
  fallback: T[] = []
): T[] {
  if (!Array.isArray(array) || array.length === 0) {
    return fallback
  }

  try {
    return operation(array)
  } catch (error: any) {
    console.error('[SAFE ARRAY] Error during array operation:', error.message)
    return fallback
  }
}

/**
 * BUG #18 FIX: Safe sort and slice
 */
export function safeSortAndSlice<T extends Record<string, any>>(
  array: T[] | undefined | null,
  sortFn: (a: T, b: T) => number,
  limit: number = 10
): T[] {
  return safeArrayOperation(array, arr => {
    if (arr.length === 0) return []
    
    const sorted = [...arr].sort(sortFn)
    return sorted.slice(0, Math.min(limit, sorted.length))
  })
}

/**
 * BUG #19 FIX: Round floating point numbers for display
 */
export function roundToDecimals(value: number, decimals: number = 2): number {
  if (!isFinite(value)) return 0
  
  const factor = Math.pow(10, decimals)
  return Math.round(value * factor) / factor
}

/**
 * BUG #19 FIX: Format percentage with proper rounding
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  const rounded = roundToDecimals(value, decimals)
  return `${rounded}%`
}

/**
 * BUG #19 FIX: Format currency with proper rounding
 */
export function formatCurrencyValue(value: number): string {
  const rounded = roundToDecimals(value, 0)
  return `Rp ${Math.round(rounded).toLocaleString('id-ID')}`
}

/**
 * BUG #20 FIX: Safe slice with bounds checking
 */
export function safeSlice<T>(
  array: T[] | undefined | null,
  start: number = 0,
  end?: number
): T[] {
  if (!Array.isArray(array) || array.length === 0) {
    return []
  }

  // Validate bounds
  const validStart = Math.max(0, Math.min(start, array.length - 1))
  const validEnd = end ? Math.max(validStart + 1, Math.min(end, array.length)) : undefined

  return array.slice(validStart, validEnd)
}

/**
 * BUG #20 FIX: Safe top N items extraction
 */
export function getTopItems<T extends Record<string, any>>(
  array: T[] | undefined | null,
  n: number = 10,
  sortFn: (a: T, b: T) => number
): T[] {
  if (!Array.isArray(array) || array.length === 0 || n <= 0) {
    return []
  }

  const sorted = [...array].sort(sortFn)
  const validN = Math.min(n, sorted.length)

  return safeSlice(sorted, 0, validN)
}

/**
 * Create empty slide placeholder when no data available
 */
export function createEmptyDataPlaceholder(slideName: string): string {
  return `
    <!-- SLIDE: ${slideName} -->
    <div class="slide" data-slide="empty">
        <div style="display: flex; align-items: center; justify-content: center; height: 100%; min-height: 800px;">
            <div style="text-align: center;">
                <h2 style="color: #94a3b8; font-size: 18px; margin-bottom: 12px;">
                    No Data Available
                </h2>
                <p style="color: #cbd5e1; font-size: 14px;">
                    ${slideName} contains no data for the selected period.
                </p>
            </div>
        </div>
    </div>`
}
