// lib/reports/ctlptowa/insights.ts
// Logic untuk generate insights untuk CTLPTOWA report

import { CalculatedMetrics, CTLPTOWAReportData } from './metrics'

export interface GeneratedInsights {
  highlights: string[]
  lowlights: string[]
  recommendations: string[]
}

export function generateInsights(
  metrics: CalculatedMetrics,
  data: CTLPTOWAReportData
): GeneratedInsights {
  const { thisWeek, lastWeek, growth } = metrics

  const highlights: string[] = []
  const lowlights: string[] = []
  const recommendations: string[] = []

  // Analyze checkouts
  if (growth.results > 20) {
    highlights.push(`Checkouts initiated naik ${growth.results.toFixed(1)}%`)
  } else if (growth.results < 0) {
    lowlights.push('Checkouts menurun')
    recommendations.push('Optimasi landing page dan offer')
  }

  // Analyze CPR
  if (thisWeek.cpr < lastWeek.cpr) {
    highlights.push('CPR menurun - good efficiency')
  } else if (thisWeek.cpr > lastWeek.cpr * 1.2) {
    lowlights.push('CPR naik signifikan')
    recommendations.push('Review funnel dan conversion rate')
  }

  if (recommendations.length === 0) {
    recommendations.push('Pertahankan strategi saat ini')
  }

  return { highlights, lowlights, recommendations }
}
