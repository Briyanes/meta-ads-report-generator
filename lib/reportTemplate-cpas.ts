import { readFile } from 'fs/promises'
import { join } from 'path'

/**
 * Generate CPAS Report using Report Manual template structure
 * This produces HTML output matching the Report Manual style exactly
 */
export async function generateReactTailwindReport(analysisData: any, reportName?: string, retentionType?: string, objectiveType?: string): Promise<string> {
  // This function returns Promise<string>, which is compatible with the expected type
  const { thisWeek, lastWeek, breakdown, config } = analysisData

  // Read the Report Manual reference template
  const templatePath = join(process.cwd(), 'lib', 'cpas-reference-template.html')
  let html = await readFile(templatePath, 'utf-8')

  // Extract data from analysis
  const thisMonth = thisWeek || {}
  const lastMonth = lastWeek || {}

  const thisMonthSpend = thisMonth.amountSpent || 0
  const lastMonthSpend = lastMonth.amountSpent || 0
  const thisMonthATC = thisMonth.addToCart || thisMonth.addsToCart || 0
  const lastMonthATC = lastMonth.addToCart || lastMonth.addsToCart || 0
  const thisMonthPurchases = thisMonth.purchases || 0
  const lastMonthPurchases = lastMonth.purchases || 0

  // Calculate growth
  const spendGrowth = lastMonthSpend > 0 ? ((thisMonthSpend - lastMonthSpend) / lastMonthSpend * 100) : 0
  const atcGrowth = lastMonthATC > 0 ? ((thisMonthATC - lastMonthATC) / lastMonthATC * 100) : 0
  const cprThisMonth = thisMonthATC > 0 ? (thisMonthSpend / thisMonthATC) : 0
  const cprLastMonth = lastMonthATC > 0 ? (lastMonthSpend / lastMonthATC) : 0

  // Format currency
  const formatCurrency = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID')
  }

  const formatNumber = (num: number) => {
    return num.toLocaleString('id-ID')
  }

  const formatPercent = (num: number) => {
    return num.toFixed(2) + '%'
  }

  // Replace placeholder values in template - SLIDE 2: Performance Summary
  html = html.replace(
    /Rp 2,130,319/g,
    formatCurrency(thisMonthSpend)
  ).replace(
    /653/g,
    formatNumber(thisMonthATC)
  ).replace(
    /Rp 3,262/g,
    formatCurrency(cprThisMonth)
  ).replace(
    /\+461\.42%/g,
    (spendGrowth > 0 ? '+' : '') + formatPercent(spendGrowth)
  ).replace(
    /Rp 379,401/g,
    formatCurrency(lastMonthSpend)
  ).replace(
    /<div class="metric-value">0<\/div>/g,
    (match) => {
      // Check if this is ATC value for last month
      if (html.includes('Bulan Lalu')) {
        return `<div class="metric-value">${formatNumber(lastMonthATC)}</div>`
      }
      return match
    }
  ).replace(
    /November/g,
    retentionType === 'week' ? 'Minggu Ini' : 'Bulan Ini'
  ).replace(
    /Oktober/g,
    retentionType === 'week' ? 'Minggu Lalu' : 'Bulan Lalu'
  )

  // TODO: Add more replacements for all slides (3-13)
  // This is the beginning - need to replace ALL hardcoded values

  return html
}
