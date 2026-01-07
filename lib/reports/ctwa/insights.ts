// lib/reports/ctwa/insights.ts
// Logic untuk generate insights dan recommendations untuk CTWA report

import { CalculatedMetrics, CTWAReportData } from './metrics'

export interface GeneratedInsights {
  highlights: string[]
  lowlights: string[]
  recommendations: string[]
}

/**
 * Generate all insights for CTWA report
 */
export function generateInsights(
  metrics: CalculatedMetrics,
  data: CTWAReportData
): GeneratedInsights {
  const { thisWeek, lastWeek, growth } = metrics

  const highlights: string[] = []
  const lowlights: string[] = []
  const recommendations: string[] = []

  // Analyze messaging conversations
  if (growth.results > 20) {
    highlights.push(`Messaging conversations naik ${growth.results.toFixed(1)}%`)
  } else if (growth.results < 0) {
    lowlights.push('Messaging conversations menurun')
    recommendations.push('Optimasi creative dan targeting untuk increase conversations')
  }

  // Analyze CPR
  if (thisWeek.cpr < lastWeek.cpr) {
    highlights.push('CPR menurun - efisiensi meningkat')
  } else if (thisWeek.cpr > lastWeek.cpr * 1.2) {
    lowlights.push('CPR naik signifikan')
    recommendations.push('Review targeting dan bidding strategy')
  }

  // Analyze CTR
  if (thisWeek.ctr >= 1.0) {
    highlights.push(`CTR ${thisWeek.ctr.toFixed(2)}% - good engagement`)
  } else if (thisWeek.ctr < 0.5) {
    lowlights.push('CTR di bawah benchmark')
    recommendations.push('Refresh creative untuk improve engagement')
  }

  // Add default recommendations if empty
  if (recommendations.length === 0) {
    recommendations.push('Pertahankan strategi campaign saat ini')
    recommendations.push('Monitor performa harian dan optimasi sesuai kebutuhan')
  }

  return { highlights, lowlights, recommendations }
}
