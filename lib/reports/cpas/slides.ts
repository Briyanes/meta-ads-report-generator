// lib/reports/cpas/slides.ts
// HTML generators untuk semua slide di CPAS report

// NOTE: Ini adalah temporary bridge ke file lama
// Menggunakan fungsi generateReactTailwindReport dari reportTemplate-cpas.ts
// TODO: Refactor pelan-pelan untuk memecah setiap slide ke function terpisah

import { generateReactTailwindReport as generateOldCPASTemplate } from '../../reportTemplate-cpas'

/**
 * Generate all slides for CPAS report
 *
 * Temporary implementation: Delegates to the old template file
 * TODO: Refactor to use individual slide generators from this module
 */
export async function generateAllSlides(
  data: any,
  metrics: any,
  insights: any,
  reportName: string,
  retentionType?: string
): Promise<string> {
  // For now, use the old template generator
  // The old function already has all the HTML generators
  return await generateOldCPASTemplate(data, reportName, retentionType, 'cpas')
}

// Export slide generator functions (to be implemented)
export {
  generateCoverSlide,
  generatePerformanceSummarySlide,
  generateDetailedMetricsSlide,
  generateKeyInsightsSlide,
  generateBreakdownSlide,
  generateConclusionSlide,
} from './slide-generators'

// Placeholder for future modular slide generators
// TODO: Implement these functions gradually
function generateCoverSlide(reportName: string): string {
  return `<!-- Cover slide for ${reportName} -->`
}

function generatePerformanceSummarySlide(metrics: any): string {
  return `<!-- Performance Summary -->`
}

function generateDetailedMetricsSlide(metrics: any): string {
  return `<!-- Detailed Metrics -->`
}

function generateKeyInsightsSlide(insights: any): string {
  return `<!-- Key Insights -->`
}

function generateBreakdownSlide(title: string, data: any[]): string {
  return `<!-- Breakdown: ${title} -->`
}

function generateConclusionSlide(metrics: any, insights: any): string {
  return `<!-- Conclusion -->`
}


/**
 * Placeholder: Generate cover slide
 */
function generateCoverSlide(reportName: string): string {
  return `
    <div class="slide cpas-cover">
      <div style="text-align: center; padding: 60px 40px;">
        <h1 style="font-size: 48px; font-weight: bold; margin-bottom: 20px;">
          CPAS Performance Report
        </h1>
        <h2 style="font-size: 32px; margin-bottom: 40px;">${reportName}</h2>
        <p style="font-size: 18px; opacity: 0.9;">
          Meta Ads Performance Analysis
        </p>
      </div>
    </div>
  `
}

/**
 * Placeholder: Generate performance summary slide
 */
function generatePerformanceSummarySlide(metrics: any): string {
  const { thisMonth, lastMonth, growth, isNewClient } = metrics

  return `
    <div class="slide performance-summary">
      <h2>Performance Summary</h2>
      <table class="performance-table">
        <thead>
          <tr>
            <th>Metric</th>
            <th>Last Period</th>
            <th>This Period</th>
            <th>Difference</th>
            <th>Growth</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Amount Spent</strong></td>
            <td>${formatLastPeriodCurrency(lastMonth.spend, isNewClient)}</td>
            <td>${formatCurrency(thisMonth.spend)}</td>
            <td class="${getDiffClass(thisMonth.spend, lastMonth.spend)}">
              ${thisMonth.spend - lastMonth.spend >= 0 ? '+' : ''}${formatCurrency(Math.abs(thisMonth.spend - lastMonth.spend))}
            </td>
            <td><span class="badge ${getBadgeClass(growth.spend)}">${formatGrowthForNewClient(growth.spend, isNewClient)}</span></td>
          </tr>
          <tr>
            <td><strong>Add to Cart</strong></td>
            <td>${formatLastPeriod(lastMonth.atc, isNewClient)}</td>
            <td>${formatNumber(thisMonth.atc)}</td>
            <td class="${getDiffClass(thisMonth.atc, lastMonth.atc)}">
              ${thisMonth.atc - lastMonth.atc >= 0 ? '+' : ''}${formatNumber(Math.abs(thisMonth.atc - lastMonth.atc))}
            </td>
            <td><span class="badge ${getBadgeClass(growth.atc)}">${formatGrowthForNewClient(growth.atc, isNewClient)}</span></td>
          </tr>
          <tr>
            <td><strong>Purchases</strong></td>
            <td>${formatLastPeriod(lastMonth.purchases, isNewClient)}</td>
            <td>${formatNumber(thisMonth.purchases)}</td>
            <td class="${getDiffClass(thisMonth.purchases, lastMonth.purchases)}">
              ${thisMonth.purchases - lastMonth.purchases >= 0 ? '+' : ''}${formatNumber(Math.abs(thisMonth.purchases - lastMonth.purchases))}
            </td>
            <td><span class="badge ${getBadgeClass(growth.purchases)}">${formatGrowthForNewClient(growth.purchases, isNewClient)}</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  `
}

/**
 * Placeholder: Generate detailed metrics slide
 */
function generateDetailedMetricsSlide(metrics: any): string {
  const { thisMonth, lastMonth, growth, isNewClient } = metrics

  return `
    <div class="slide detailed-metrics">
      <h2>Detailed Performance Metrics</h2>
      <table class="performance-table">
        <thead>
          <tr>
            <th>Metric</th>
            <th>Last Period</th>
            <th>This Period</th>
            <th>Difference</th>
            <th>Growth</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>CTR (link click-through rate)</strong></td>
            <td>${formatLastPeriodPercent(lastMonth.ctr, isNewClient)}</td>
            <td>${formatPercent(thisMonth.ctr)}</td>
            <td class="${getDiffClass(thisMonth.ctr, lastMonth.ctr)}">
              ${(thisMonth.ctr - lastMonth.ctr) >= 0 ? '+' : ''}${formatPercent(Math.abs(thisMonth.ctr - lastMonth.ctr))}
            </td>
            <td><span class="badge ${getBadgeClass(growth.ctr)}">${formatGrowthForNewClient(growth.ctr, isNewClient)}</span></td>
          </tr>
          <tr>
            <td><strong>CPC (cost per click)</strong></td>
            <td>${formatLastPeriodCurrency(lastMonth.cpc, isNewClient)}</td>
            <td>${formatCurrency(thisMonth.cpc)}</td>
            <td class="${getDiffClass(thisMonth.cpc, lastMonth.cpc)}">
              ${(thisMonth.cpc - lastMonth.cpc) >= 0 ? '+' : ''}${formatCurrency(Math.abs(thisMonth.cpc - lastMonth.cpc))}
            </td>
            <td><span class="badge ${getBadgeClass(growth.cpc)}">${formatGrowthForNewClient(growth.cpc, isNewClient)}</span></td>
          </tr>
          <tr>
            <td><strong>CPM (cost per 1,000 impressions)</strong></td>
            <td>${formatLastPeriodCurrency(lastMonth.cpm, isNewClient)}</td>
            <td>${formatCurrency(thisMonth.cpm)}</td>
            <td class="${getDiffClass(thisMonth.cpm, lastMonth.cpm)}">
              ${(thisMonth.cpm - lastMonth.cpm) >= 0 ? '+' : ''}${formatCurrency(Math.abs(thisMonth.cpm - lastMonth.cpm))}
            </td>
            <td><span class="badge ${getBadgeClass(growth.cpm)}">${formatGrowthForNewClient(growth.cpm, isNewClient)}</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  `
}

/**
 * Placeholder: Generate key insights slide
 */
function generateKeyInsightsSlide(
  metrics: any,
  insights: GeneratedInsights
): string {
  const { highlights, lowlights, recommendations } = insights

  return `
    <div class="slide key-insights">
      <h2>Key Insights</h2>

      ${highlights.length > 0 ? `
        <div class="insight-section">
          <h3 style="color: #10b981;">Highlights</h3>
          <ul>
            ${highlights.map(h => `<li>${h}</li>`).join('')}
          </ul>
        </div>
      ` : ''}

      ${lowlights.length > 0 ? `
        <div class="insight-section">
          <h3 style="color: #ef4444;">Areas for Improvement</h3>
          <ul>
            ${lowlights.map(l => `<li>${l}</li>`).join('')}
          </ul>
        </div>
      ` : ''}

      ${recommendations.length > 0 ? `
        <div class="insight-section">
          <h3 style="color: #3b82f6;">Recommendations</h3>
          <ul>
            ${recommendations.map(r => `<li>${r}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
    </div>
  `
}

/**
 * Placeholder: Generate breakdown slide
 */
function generateBreakdownSlide(
  title: string,
  breakdownData: any[],
  insight: string
): string {
  return `
    <div class="slide breakdown">
      <h2>${title} Breakdown</h2>
      <p>${insight}</p>
      <p style="color: #6b7280; font-style: italic;">
        Detailed breakdown table will be generated here
      </p>
    </div>
  `
}

/**
 * Placeholder: Generate conclusion slide
 */
function generateConclusionSlide(
  metrics: any,
  insights: GeneratedInsights
): string {
  return `
    <div class="slide conclusion">
      <h2>Conclusion & Next Steps</h2>
      <p>Thank you for reviewing this CPAS Performance Report.</p>
    </div>
  `
}

// Export all slide generators
export {
  generateCoverSlide,
  generatePerformanceSummarySlide,
  generateDetailedMetricsSlide,
  generateKeyInsightsSlide,
  generateBreakdownSlide,
  generateConclusionSlide,
}
