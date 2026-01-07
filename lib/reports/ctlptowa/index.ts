// lib/reports/ctlptowa/index.ts
// Main entry point untuk CTLPTOWA report generation

import { calculateAllMetrics, CTLPTOWAReportData } from './metrics'
import { generateInsights } from './insights'
import { generateAllSlides } from './slides'

export async function generateCTLPTOWAReport(
  data: CTLPTOWAReportData,
  reportName: string,
  retentionType?: string
): Promise<string> {
  try {
    const metrics = calculateAllMetrics(data)
    const insights = generateInsights(metrics, data)
    const html = await generateAllSlides(data, metrics, insights, reportName, retentionType)
    return html
  } catch (error) {
    console.error('Error generating CTLPTOWA report:', error)
    throw error
  }
}

export type { CTLPTOWAReportData } from './metrics'
export type { CalculatedMetrics } from './metrics'
export type { GeneratedInsights } from './insights'
