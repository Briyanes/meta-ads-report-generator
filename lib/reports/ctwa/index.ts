// lib/reports/ctwa/index.ts
// Main entry point untuk CTWA report generation

import { calculateAllMetrics, CTWAReportData } from './metrics'
import { generateInsights } from './insights'
import { generateAllSlides } from './slides'

/**
 * Generate CTWA Report
 *
 * Main function yang dipanggil oleh API untuk generate CTWA report
 */
export async function generateCTWAReport(
  data: CTWAReportData,
  reportName: string,
  retentionType?: string
): Promise<string> {
  try {
    // Step 1: Calculate all metrics
    const metrics = calculateAllMetrics(data)

    // Step 2: Generate insights
    const insights = generateInsights(metrics, data)

    // Step 3: Generate all slides
    const html = await generateAllSlides(data, metrics, insights, reportName, retentionType)

    return html
  } catch (error) {
    console.error('Error generating CTWA report:', error)
    throw error
  }
}

/**
 * Export types untuk digunakan oleh API
 */
export type { CTWAReportData } from './metrics'
export type { CalculatedMetrics } from './metrics'
export type { GeneratedInsights } from './insights'
