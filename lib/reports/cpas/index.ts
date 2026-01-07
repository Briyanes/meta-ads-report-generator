// lib/reports/cpas/index.ts
// Main entry point untuk CPAS report generation

import { calculateAllMetrics, CPASReportData } from './metrics'
import { generateInsights } from './insights'
import { generateAllSlides } from './slides'

/**
 * Generate CPAS Report
 *
 * Main function yang dipanggil oleh API untuk generate CPAS report
 *
 * @param data - Report data dari API
 * @param reportName - Nama report
 * @param retentionType - Tipe retention (optional)
 * @returns HTML string untuk report
 */
export async function generateCPASReport(
  data: CPASReportData,
  reportName: string,
  retentionType?: string
): Promise<string> {
  try {
    // Step 1: Calculate all metrics
    const metrics = calculateAllMetrics(data)

    // Step 2: Generate insights
    const insights = generateInsights(metrics, data)

    // Step 3: Generate all slides
    const html = generateAllSlides(data, metrics, insights, reportName, retentionType)

    return html
  } catch (error) {
    console.error('Error generating CPAS report:', error)
    throw error
  }
}

/**
 * Export types untuk digunakan oleh API
 */
export type { CPASReportData } from './metrics'
export type { CalculatedMetrics } from './metrics'
export type { GeneratedInsights } from './insights'
