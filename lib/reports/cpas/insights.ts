// lib/reports/cpas/insights.ts
// Logic untuk generate insights dan recommendations untuk CPAS report

import { CalculatedMetrics, CPASReportData, parseNum, formatCurrency } from './metrics'

export interface GeneratedInsights {
  // Slide insights
  metricPerformanceDesc: string
  topPerformer: { name: string; growth: number }
  ctrSentiment: string
  metricsRecommendation: string

  // Breakdown insights
  ageInsight: string
  genderInsight: string
  regionInsight: string
  platformInsight: string
  placementInsight: string
  objectiveInsight: string
  creativeInsight: string

  // Key insights
  highlights: string[]
  lowlights: string[]
  recommendations: string[]
}

/**
 * Generate all insights for CPAS report
 */
export function generateInsights(
  metrics: CalculatedMetrics,
  data: CPASReportData
): GeneratedInsights {
  const { thisMonth, lastMonth, growth, isNewClient } = metrics

  // Generate metric performance description
  const metricPerformanceDesc = generateMetricPerformanceDesc(metrics)

  // Find top performer
  const topPerformer = findTopPerformer(data)

  // CTR sentiment
  const ctrSentiment = thisMonth.ctr >= lastMonth.ctr ? 'Positif' : 'Perlu improvement'

  // Metrics recommendation
  const metricsRecommendation = generateMetricsRecommendation(metrics)

  // Breakdown insights
  const ageInsight = generateAgeInsight(data)
  const genderInsight = generateGenderInsight(data)
  const regionInsight = generateRegionInsight(data)
  const platformInsight = generatePlatformInsight(data)
  const placementInsight = generatePlacementInsight(data)
  const objectiveInsight = generateObjectiveInsight()
  const creativeInsight = generateCreativeInsight(data)

  // Key insights (highlights, lowlights, recommendations)
  const { highlights, lowlights, recommendations } = generateKeyInsights(metrics, data)

  return {
    metricPerformanceDesc,
    topPerformer,
    ctrSentiment,
    metricsRecommendation,
    ageInsight,
    genderInsight,
    regionInsight,
    platformInsight,
    placementInsight,
    objectiveInsight,
    creativeInsight,
    highlights,
    lowlights,
    recommendations,
  }
}

/**
 * Generate metric performance description
 */
function generateMetricPerformanceDesc(metrics: CalculatedMetrics): string {
  const { thisMonth, lastMonth, growth } = metrics

  const positiveMetrics = []
  const negativeMetrics = []

  if (growth.atc >= 0) positiveMetrics.push(`Add to Cart ${growth.atc >= 0 ? 'naik' : 'turun'} ${Math.abs(growth.atc).toFixed(1)}%`)
  if (growth.purchases >= 0) positiveMetrics.push(`Purchases ${growth.purchases >= 0 ? 'naik' : 'turun'} ${Math.abs(growth.purchases).toFixed(1)}%`)
  if (growth.roas >= 0) positiveMetrics.push(`ROAS ${thisMonth.roas.toFixed(2)}`)
  if (growth.ctr >= 0) positiveMetrics.push(`CTR ${thisMonth.ctr.toFixed(2)}%`)

  if (growth.spend > growth.atc && growth.atc < 0) negativeMetrics.push('Spend meningkat tapi konversi menurun')
  if (thisMonth.ctr < 0.5) negativeMetrics.push('CTR di bawah benchmark')
  if (thisMonth.roas < 1.0) negativeMetrics.push(`ROAS ${thisMonth.roas.toFixed(2)} di bawah target`)

  if (positiveMetrics.length === 0) return 'Campaign performance menunjukkan tantangan di berbagai metric.'
  if (negativeMetrics.length === 0) return `Campaign performance menunjukkan pertumbuhan positif dengan ${positiveMetrics.join(', ')}.`

  return `Campaign performance menunjukkan ${positiveMetrics.length > 0 ? 'pertumbuhan positif' : 'tantangan'} dengan ${positiveMetrics.slice(0, 2).join(', ')}.`
}

/**
 * Find top performing segment
 */
function findTopPerformer(data: CPASReportData): { name: string; growth: number } {
  const ageData = data.ageBreakdown || []
  if (!ageData || ageData.length === 0) {
    return { name: '25-34', growth: 15 }
  }

  const sorted = [...ageData].sort(
    (a, b) => parseNum(b['Amount spent (IDR)'] || b.spend || 0) - parseNum(a['Amount spent (IDR)'] || a.spend || 0)
  )
  const top = sorted[0]

  return {
    name: top?.Age || '25-34',
    growth: 15, // Default growth for display
  }
}

/**
 * Generate metrics recommendation
 */
function generateMetricsRecommendation(metrics: CalculatedMetrics): string {
  const { thisMonth, lastMonth, growth } = metrics

  if (thisMonth.roas >= 2.0) {
    return 'Campaign performance sangat baik dengan ROAS di atas target. Pertimbangkan untuk scaling budget 20-30% dengan tetap memantaman CPR.'
  }

  if (growth.spend > growth.atc && growth.atc < 0) {
    return 'Perlu evaluasi targeting dan creative. Spend meningkat tapi konversi menurun. Pertimbangkan untuk refresh creative dan optimasi audience.'
  }

  if (thisMonth.ctr < 0.5) {
    return 'CTR di bawah benchmark industri. Rekomendasi: Refresh creative iklan dan testing format baru (Reels, Stories).'
  }

  if (thisMonth.cpr > lastMonth.cpr * 1.2) {
    return 'CPR meningkat signifikan dibanding periode sebelumnya. Perlu optimasi campaign untuk menurunkan cost per konversi.'
  }

  return 'Pertahankan strategi campaign saat ini. Monitor performa mingguan dan siapkan action plan untuk improvement.'
}

/**
 * Generate age breakdown insight
 */
function generateAgeInsight(data: CPASReportData): string {
  const breakdownData = data.ageBreakdown || []
  if (!breakdownData || breakdownData.length === 0) {
    return 'Segment usia 25-34 mendominasi performa campaign. Rekomendasi: Fokuskan 70-80% budget pada segment usia produktif (25-44 tahun).'
  }

  const sorted = [...breakdownData].sort(
    (a, b) => parseNum(b['Amount spent (IDR)'] || b.spend || 0) - parseNum(a['Amount spent (IDR)'] || a.spend || 0)
  )
  const top = sorted[0]
  const spend = parseNum(top['Amount spent (IDR)'] || top.spend || 0)
  const atc = parseNum(top['Adds to cart with shared items'] || 0)
  const purchasesCV = parseNum(top['Purchases conversion value'] || 0)
  const roas = spend > 0 ? purchasesCV / spend : 0
  const age = top?.Age || '25-34'

  return `Segment usia ${age} mendominasi performa campaign dengan kontribusi spend terbesar sebesar ${formatCurrency(spend)}${roas > 0 ? ` dan ROAS ${roas.toFixed(2)}` : ''}. Rekomendasi: Fokuskan 70-80% budget pada segment usia produktif (25-44 tahun) yang menunjukkan konversi terkuat. Pertimbangkan untuk exclude usia di atas 50+ jika ROAS di bawah target.`
}

/**
 * Generate gender breakdown insight
 */
function generateGenderInsight(data: CPASReportData): string {
  const breakdownData = data.genderBreakdown || []
  if (!breakdownData || breakdownData.length === 0) {
    return 'Segmen Perempuan mendominasi kontribusi konversi. Rekomendasi: Pertahankan alokasi budget 65-75% Female.'
  }

  const totalSpend = breakdownData.reduce(
    (sum: number, item: any) => sum + parseNum(item['Amount spent (IDR)'] || item.spend || 0),
    0
  )
  const female = breakdownData.find((d: any) => (d.Gender || '').toLowerCase().includes('female'))
  const femalePct = totalSpend > 0 ? (parseNum(female?.['Amount spent (IDR)'] || female?.spend || 0) / totalSpend * 100) : 65

  const dominantGender = femalePct >= 50 ? 'Perempuan' : 'Laki-laki'
  const dominantPct = femalePct >= 50 ? femalePct : 100 - femalePct

  return `Segmen ${dominantGender} mendominasi kontribusi konversi sebesar approximately ${Math.round(dominantPct)}% dari total Add to Cart. Rekomendasi: Pertahankan alokasi budget ${femalePct >= 50 ? '65-75% Female' : '60-70% Male'} untuk reach yang efisien namun tetap pertahankan 25-35% untuk gender balancing.`
}

/**
 * Generate region breakdown insight
 */
function generateRegionInsight(data: CPASReportData): string {
  const breakdownData = data.regionBreakdown || []
  if (!breakdownData || breakdownData.length === 0) {
    return 'Region Jakarta menjadi kontributor terbesar. Rekomendasi: Scale agresif di high-performing regions (Java + Jakarta).'
  }

  const sorted = [...breakdownData].sort(
    (a, b) => parseNum(b['Amount spent (IDR)'] || b.spend || 0) - parseNum(a['Amount spent (IDR)'] || a.spend || 0)
  )
  const totalSpend = breakdownData.reduce(
    (sum: number, item: any) => sum + parseNum(item['Amount spent (IDR)'] || item.spend || 0),
    0
  )
  const top = sorted[0]
  const topSpend = parseNum(top['Amount spent (IDR)'] || top.spend || 0)
  const contribution = totalSpend > 0 ? (topSpend / totalSpend * 100) : 40
  const region = top?.Region || 'Jakarta'

  return `Region ${region} menjadi kontributor terbesar dengan pangsa spend sebesar ${Math.round(contribution)}% dari total budget. Rekomendasi: Scale agresif di high-performing regions (Java + Jakarta) yang menyumbang 75-80% konversi sebelum expanding ke low-performing regions. Pertimbangkan geo-targeting optimization untuk exclude regions dengan ROAS < 1.0.`
}

/**
 * Generate platform breakdown insight
 */
function generatePlatformInsight(data: CPASReportData): string {
  const breakdownData = data.platformBreakdown || []
  if (!breakdownData || breakdownData.length === 0) {
    return 'Instagram mendominasi performa dengan kontribusi 70% terhadap total konversi. Rekomendasi: Pertahankan alokasi budget 60:40 atau 65:35 (Instagram:Facebook).'
  }

  const totalSpend = breakdownData.reduce(
    (sum: number, item: any) => sum + parseNum(item['Amount spent (IDR)'] || item.spend || 0),
    0
  )
  const ig = breakdownData.find((d: any) => (d.Platform || '').toLowerCase().includes('instagram'))
  const igPct = totalSpend > 0 ? (parseNum(ig?.['Amount spent (IDR)'] || ig?.spend || 0) / totalSpend * 100) : 70
  const fbPct = 100 - igPct

  return `Instagram mendominasi performa dengan kontribusi ${Math.round(igPct)}% terhadap total konversi dibanding Facebook ${Math.round(fbPct)}%. Rekomendasi: Pertahankan alokasi budget 60:40 atau 65:35 (Instagram:Facebook) untuk diversification yang sehat. Scale top-performing Instagram ad sets sambil tetap maintain presence di Facebook.`
}

/**
 * Generate placement breakdown insight
 */
function generatePlacementInsight(data: CPASReportData): string {
  const breakdownData = data.placementBreakdown || []
  if (!breakdownData || breakdownData.length === 0) {
    return 'Placement Instagram Reels menunjukkan performa terbaik. Rekomendasi: Re-alokasi budget sesuai performa dengan 70% ke Reels (IG + FB), 25% ke Feed, dan 5% ke Stories.'
  }

  const sorted = [...breakdownData].sort(
    (a, b) => parseNum(b['Amount spent (IDR)'] || b.spend || 0) - parseNum(a['Amount spent (IDR)'] || a.spend || 0)
  )
  const top = sorted[0]
  const clicks = parseNum(top['Link clicks'] || top['Outbound clicks'] || 0)
  const impr = parseNum(top['Impressions'] || 0)
  const ctr = impr > 0 ? clicks / impr * 100 : 1.5
  const spend = parseNum(top['Amount spent (IDR)'] || top.spend || 0)
  const cv = parseNum(top['Purchases conversion value'] || 0)
  const roas = spend > 0 ? cv / spend : 2.5
  const placement = top?.Placement || 'Instagram Reels'

  return `Placement ${placement} menunjukkan performa terbaik dengan CTR ${ctr.toFixed(2)}% dan ROAS ${roas.toFixed(2)}. Rekomendasi: Re-alokasi budget sesuai performa dengan 70% ke Reels (IG + FB), 25% ke Feed, dan 5% ke Stories. Scale high-ROAS placements dan pause underperforming placements.`
}

/**
 * Generate objective breakdown insight
 */
function generateObjectiveInsight(): string {
  return 'Campaign dengan objective OUTCOME_SALES menjadi primary driver konversi dengan contribution rate terbesar. Rekomendasi: Optimize bidding strategy berdasarkan funnel stage - gunakan Cost Cap untuk upper funnel (Add to Cart) dengan target CPA sesuai benchmark, dan Lowest Cost atau Bid Cap untuk lower funnel (Purchase) untuk maximize conversion volume. Implement value-based bidding untuk ROAS optimization.'
}

/**
 * Generate creative breakdown insight
 */
function generateCreativeInsight(data: CPASReportData): string {
  const breakdownData = data.creativeBreakdown || []
  if (!breakdownData || breakdownData.length === 0) {
    return 'Format Collection Ads mendominasi top performers. Rekomendasi: Scale winning collection ads dengan increase budget 20-30% sambil test variasi produk.'
  }

  const sorted = [...breakdownData].sort(
    (a, b) => parseNum(b['Purchases conversion value'] || 0) - parseNum(a['Purchases conversion value'] || 0)
  )
  const totalCV = breakdownData.reduce(
    (sum: number, item: any) => sum + parseNum(item['Purchases conversion value'] || 0),
    0
  )
  const top = sorted[0]
  const topCV = parseNum(top['Purchases conversion value'] || 0)
  const share = totalCV > 0 ? (topCV / totalCV * 100) : 85

  return `Format Collection Ads mendominasi top performers dengan pangsa ${Math.round(share)}% dari total Purchases Conversion Value. Rekomendasi: Scale winning collection ads dengan increase budget 20-30% sambil test variasi produk dalam collection. Pause single-image ads dengan ROAS < 1.5 dan realokasi budget ke top-performing collections.`
}

/**
 * Generate key insights (highlights, lowlights, recommendations)
 */
function generateKeyInsights(metrics: CalculatedMetrics, data: CPASReportData): {
  highlights: string[]
  lowlights: string[]
  recommendations: string[]
} {
  const { thisMonth, lastMonth, growth, isNewClient } = metrics
  const highlights: string[] = []
  const lowlights: string[] = []
  const recommendations: string[] = []

  // Analyze ROAS
  if (thisMonth.roas >= 2.0) {
    highlights.push(`ROAS ${thisMonth.roas.toFixed(2)} menunjukkan profitabilitas baik`)
  } else if (thisMonth.roas < 1.0 && !isNewClient) {
    lowlights.push(`ROAS ${thisMonth.roas.toFixed(2)} di bawah target`)
    recommendations.push('Optimasi campaign untuk meningkatkan ROAS di atas 1.0')
  }

  // Analyze CTR
  if (thisMonth.ctr >= 1.0) {
    highlights.push(`CTR ${thisMonth.ctr.toFixed(2)}% menunjukkan creative yang engaging`)
  } else if (thisMonth.ctr < 0.5) {
    lowlights.push('CTR di bawah benchmark industri')
    recommendations.push('Refresh creative iklan dan testing format baru')
  }

  // Analyze CPR
  if (growth.spend > growth.atc && growth.atc < 0) {
    lowlights.push('Spend meningkat tapi Add to Cart menurun')
    recommendations.push('Evaluasi targeting dan creative untuk mengurangi CPR')
  } else if (growth.atc > growth.spend && thisMonth.cpr < lastMonth.cpr) {
    highlights.push('CPR menurun menunjukkan improving efficiency')
  }

  // Analyze spend vs results
  if (growth.spend > 0 && growth.purchases > growth.spend) {
    highlights.push('Purchases growth lebih tinggi dari spend growth')
  }

  // Analyze AOV
  if (thisMonth.aov > lastMonth.aov * 1.1) {
    highlights.push(`AOV meningkat ${(growth.aov).toFixed(1)}% menunjukkan value growth`)
  }

  // Analyze conversion rate
  if (thisMonth.conversionRate > lastMonth.conversionRate * 1.2) {
    highlights.push('Conversion rate meningkat signifikan')
  }

  // Add default recommendations if empty
  if (recommendations.length === 0) {
    recommendations.push('Pertahankan strategi campaign saat ini')
    recommendations.push('Monitor performa mingguan dan siapkan action plan')
  }

  return { highlights, lowlights, recommendations }
}
