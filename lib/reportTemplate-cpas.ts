const CPAS_TEMPLATE = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CPAS Report - {REPORT_NAME}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        :root {
            --primary-blue: #2B46BB;
            --primary-yellow: #ECDC43;
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Inter', sans-serif;
            background: #f8fafc;
        }
        .slide {
            min-height: 900px;
            background: white;
            padding: 48px;
            page-break-inside: avoid;
        }
        .card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 20px;
        }
        .metric-value {
            font-size: 36px;
            font-weight: 700;
            color: var(--primary-blue);
            margin: 8px 0;
        }
        .metric-label {
            font-size: 12px;
            color: #64748b;
            font-weight: 500;
        }
        .growth-positive { color: #10B981; }
        .growth-negative { color: #EF4444; }
        table {
            width: 100%;
            border-collapse: collapse;
            background: white;
            border-radius: 12px;
            overflow: hidden;
        }
        th {
            background: var(--primary-blue);
            color: white;
            padding: 16px;
            text-align: left;
            font-weight: 600;
        }
        .text-right { text-align: right; }
        td {
            padding: 16px;
            border-bottom: 1px solid #e2e8f0;
        }
        .badge {
            padding: 6px 12px;
            border-radius: 20px;
            font-weight: 600;
            font-size: 12px;
        }
        .badge-green { background: #d1fae5; color: #065f46; }
        .badge-red { background: #fee2e2; color: #991b1b; }
    </style>
</head>
<body>
    <!-- SLIDE 1: WELCOME -->
    <div class="slide">
        <h1 style="font-size: 42px; margin-bottom: 16px; color: var(--primary-blue);">
            CPAS Performance Report
        </h1>
        <h2 style="font-size: 20px; color: #64748b;">
            {REPORT_NAME}
        </h2>
        <p style="margin-top: 24px; font-size: 14px; color: #94a3b8;">
            <strong>Periode:</strong> {PERIOD_LABEL}
        </p>
    </div>

    <!-- SLIDE 2: PERFORMANCE SUMMARY -->
    <div class="slide">
        <h1 style="font-size: 28px; margin-bottom: 24px; color: var(--primary-blue);">
            Performance Summary
        </h1>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px;">
            <!-- This Month -->
            <div class="card">
                <div class="metric-label">{THIS_PERIOD_LABEL}</div>
                <div style="margin-top: 16px;">
                    <div class="metric-label">Amount Spent</div>
                    <div class="metric-value">{THIS_SPEND}</div>
                </div>
                <div style="margin-top: 16px;">
                    <div class="metric-label">Results (Add to Cart)</div>
                    <div class="metric-value">{THIS_ATC}</div>
                </div>
                <div style="margin-top: 16px;">
                    <div class="metric-label">Cost per Result</div>
                    <div class="metric-value">{THIS_CPR}</div>
                </div>
                <div style="margin-top: 16px;">
                    <span style="color: {GROWTH_COLOR}; font-weight: 600;">
                        Growth: {GROWTH_PERCENT}%
                    </span>
                </div>
            </div>

            <!-- Last Month -->
            <div class="card">
                <div class="metric-label">{LAST_PERIOD_LABEL}</div>
                <div style="margin-top: 16px;">
                    <div class="metric-label">Amount Spent</div>
                    <div class="metric-value">{LAST_SPEND}</div>
                </div>
                <div style="margin-top: 16px;">
                    <div class="metric-label">Results (Add to Cart)</div>
                    <div class="metric-value">{LAST_ATC}</div>
                </div>
                <div style="margin-top: 16px;">
                    <div class="metric-label">Cost per Result</div>
                    <div class="metric-value">{LAST_CPR}</div>
                </div>
            </div>
        </div>
    </div>

    <!-- SLIDE 3: DETAILED METRICS -->
    <div class="slide">
        <h1 style="font-size: 28px; margin-bottom: 24px; color: var(--primary-blue);">
            Detailed Performance Metrics
        </h1>
        <h2 style="font-size: 16px; color: #64748b; margin-bottom: 32px;">
            Complete {PERIOD_TYPE} Comparison
        </h2>

        <div style="overflow-x: auto;">
            <table>
                <thead>
                    <tr>
                        <th>Metrik</th>
                        <th class="text-right">{LAST_PERIOD_LABEL}</th>
                        <th class="text-right">{THIS_PERIOD_LABEL}</th>
                        <th class="text-right">Trending Value</th>
                        <th class="text-right">Trending %</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Amount Spent (IDR)</strong></td>
                        <td class="text-right">{LAST_SPEND}</td>
                        <td class="text-right">{THIS_SPEND}</td>
                        <td class="text-right {SPEND_CLASS}">{SPEND_DIFF}</td>
                        <td class="text-right"><span class="badge {SPEND_BADGE_CLASS}">{SPEND_GROWTH}%</span></td>
                    </tr>
                    <tr>
                        <td><strong>Impressions</strong></td>
                        <td class="text-right">{LAST_IMPRESSIONS}</td>
                        <td class="text-right">{THIS_IMPRESSIONS}</td>
                        <td class="text-right {IMPR_CLASS}">{IMPR_DIFF}</td>
                        <td class="text-right"><span class="badge {IMPR_BADGE_CLASS}">{IMPR_GROWTH}%</span></td>
                    </tr>
                    <tr>
                        <td><strong>Link Clicks</strong></td>
                        <td class="text-right">{LAST_CLICKS}</td>
                        <td class="text-right">{THIS_CLICKS}</td>
                        <td class="text-right {CLICKS_CLASS}">{CLICKS_DIFF}</td>
                        <td class="text-right"><span class="badge {CLICKS_BADGE_CLASS}">{CLICKS_GROWTH}%</span></td>
                    </tr>
                    <tr>
                        <td><strong>Add to Cart</strong></td>
                        <td class="text-right">{LAST_ATC}</td>
                        <td class="text-right">{THIS_ATC}</td>
                        <td class="text-right {ATC_CLASS}">{ATC_DIFF}</td>
                        <td class="text-right"><span class="badge {ATC_BADGE_CLASS}">{ATC_GROWTH}%</span></td>
                    </tr>
                    <tr>
                        <td><strong>Purchases</strong></td>
                        <td class="text-right">{LAST_PURCHASES}</td>
                        <td class="text-right">{THIS_PURCHASES}</td>
                        <td class="text-right {PURCH_CLASS}">{PURCH_DIFF}</td>
                        <td class="text-right"><span class="badge {PURCH_BADGE_CLASS}">{PURCH_GROWTH}%</span></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <!-- More slides would be added here -->
</body>
</html>`

/**
 * Generate CPAS Report using inline template
 * This works without external file dependencies
 */
export function generateReactTailwindReport(analysisData: any, reportName?: string, retentionType?: string, objectiveType?: string): string {
  console.log('[CPAS Template] Starting report generation (inline template)...')

  // Debug: Log full analysisData structure
  console.log('[CPAS Template] Full analysisData keys:', Object.keys(analysisData || {}))

  const { thisWeek, lastWeek, breakdown, config, performanceSummary } = analysisData
  console.log('[CPAS Template] Data extracted:', {
    hasThisWeek: !!thisWeek,
    hasLastWeek: !!lastWeek,
    hasPerformanceSummary: !!performanceSummary,
    thisWeek: thisWeek,
    lastWeek: lastWeek,
    performanceSummary: performanceSummary
  })

  // Try to get data from performanceSummary first (newer structure)
  let thisMonthData = performanceSummary?.thisWeek || thisWeek || {}
  let lastMonthData = performanceSummary?.lastWeek || lastWeek || {}

  console.log('[CPAS Template] Month data:', {
    thisMonth: thisMonthData,
    lastMonth: lastMonthData
  })

  // Extract basic data
  const thisMonthSpend = thisMonthData.amountSpent || thisMonthData.spend || 0
  const lastMonthSpend = lastMonthData.amountSpent || lastMonthData.spend || 0
  const thisMonthATC = thisMonthData.addToCart || thisMonthData.addsToCart || thisMonthData.results || 0
  const lastMonthATC = lastMonthData.addToCart || lastMonthData.addsToCart || lastMonthData.results || 0

  // Extract more data for detailed metrics
  const thisMonthImpressions = thisMonthData.impressions || thisMonthData.impression || 0
  const lastMonthImpressions = lastMonthData.impressions || lastMonthData.impression || 0
  const thisMonthClicks = thisMonthData.clicks || thisMonthData.linkClicks || 0
  const lastMonthClicks = lastMonthData.clicks || lastMonthData.linkClicks || 0
  const thisMonthCTR = thisMonthData.ctr || (thisMonthClicks > 0 && thisMonthImpressions > 0 ? (thisMonthClicks / thisMonthImpressions * 100) : 0)
  const lastMonthCTR = lastMonthData.ctr || (lastMonthClicks > 0 && lastMonthImpressions > 0 ? (lastMonthClicks / lastMonthImpressions * 100) : 0)
  const thisMonthPurchases = thisMonthData.purchases || 0
  const lastMonthPurchases = lastMonthData.purchases || 0

  console.log('[CPAS Template] All metrics extracted')

  // Calculate growth
  const spendGrowth = lastMonthSpend > 0 ? ((thisMonthSpend - lastMonthSpend) / lastMonthSpend * 100) : 0
  const imprGrowth = lastMonthImpressions > 0 ? ((thisMonthImpressions - lastMonthImpressions) / lastMonthImpressions * 100) : 0
  const clicksGrowth = lastMonthClicks > 0 ? ((thisMonthClicks - lastMonthClicks) / lastMonthClicks * 100) : 0
  const atcGrowth = lastMonthATC > 0 ? ((thisMonthATC - lastMonthATC) / lastMonthATC * 100) : 0
  const purchGrowth = lastMonthPurchases > 0 ? ((thisMonthPurchases - lastMonthPurchases) / lastMonthPurchases * 100) : 0
  const cprThisMonth = thisMonthATC > 0 ? (thisMonthSpend / thisMonthATC) : 0
  const cprLastMonth = lastMonthATC > 0 ? (lastMonthSpend / lastMonthATC) : 0

  // Helper to determine badge class and growth text
  const getBadgeClass = (growth: number) => growth >= 0 ? 'badge-green' : 'badge-red'
  const getGrowthText = (growth: number) => (growth > 0 ? '+' : '') + formatPercent(growth)
  const getDiffText = (thisVal: number, lastVal: number) => (thisVal - lastVal) >= 0 ? '+' : '' + formatNumber(thisVal - lastVal)
  const getDiffClass = (thisVal: number, lastVal: number) => (thisVal - lastVal) >= 0 ? 'growth-positive' : 'growth-negative'

  // Format helpers - NO decimals for currency
  const formatCurrency = (num: number) => {
    // Round to nearest integer before formatting
    const rounded = Math.round(num)
    return 'Rp ' + rounded.toLocaleString('id-ID')
  }
  const formatNumber = (num: number) => {
    // Round to nearest integer before formatting
    const rounded = Math.round(num)
    return rounded.toLocaleString('id-ID')
  }
  const formatPercent = (num: number) => num.toFixed(2)

  // Period labels
  const isWeek = retentionType === 'week'
  const thisPeriodLabel = isWeek ? 'Minggu Ini' : 'Bulan Ini'
  const lastPeriodLabel = isWeek ? 'Minggu Lalu' : 'Bulan Lalu'

  // Replace placeholders
  let html = CPAS_TEMPLATE
    // Slide 1 & 2
    .replace(/{REPORT_NAME}/g, reportName || 'CPAS Report')
    .replace(/{PERIOD_LABEL}/g, `${thisPeriodLabel} vs ${lastPeriodLabel}`)
    .replace(/{THIS_PERIOD_LABEL}/g, thisPeriodLabel)
    .replace(/{LAST_PERIOD_LABEL}/g, lastPeriodLabel)
    .replace(/{PERIOD_TYPE}/g, isWeek ? 'Weekly' : 'Monthly')
    .replace(/{THIS_SPEND}/g, formatCurrency(thisMonthSpend))
    .replace(/{LAST_SPEND}/g, formatCurrency(lastMonthSpend))
    .replace(/{THIS_ATC}/g, formatNumber(thisMonthATC))
    .replace(/{LAST_ATC}/g, formatNumber(lastMonthATC))
    .replace(/{THIS_CPR}/g, formatCurrency(cprThisMonth))
    .replace(/{LAST_CPR}/g, cprLastMonth > 0 ? formatCurrency(cprLastMonth) : '-')
    .replace(/{GROWTH_COLOR}/g, spendGrowth >= 0 ? '#10B981' : '#EF4444')
    .replace(/{GROWTH_PERCENT}/g, getGrowthText(spendGrowth))
    // Slide 3 - Detailed Metrics
    .replace(/{THIS_IMPRESSIONS}/g, formatNumber(thisMonthImpressions))
    .replace(/{LAST_IMPRESSIONS}/g, formatNumber(lastMonthImpressions))
    .replace(/{THIS_CLICKS}/g, formatNumber(thisMonthClicks))
    .replace(/{LAST_CLICKS}/g, formatNumber(lastMonthClicks))
    .replace(/{THIS_PURCHASES}/g, formatNumber(thisMonthPurchases))
    .replace(/{LAST_PURCHASES}/g, formatNumber(lastMonthPurchases))
    .replace(/{SPEND_DIFF}/g, getDiffText(thisMonthSpend, lastMonthSpend))
    .replace(/{SPEND_CLASS}/g, getDiffClass(thisMonthSpend, lastMonthSpend))
    .replace(/{SPEND_BADGE_CLASS}/g, getBadgeClass(spendGrowth))
    .replace(/{SPEND_GROWTH}/g, getGrowthText(spendGrowth))
    .replace(/{IMPR_DIFF}/g, getDiffText(thisMonthImpressions, lastMonthImpressions))
    .replace(/{IMPR_CLASS}/g, getDiffClass(thisMonthImpressions, lastMonthImpressions))
    .replace(/{IMPR_BADGE_CLASS}/g, getBadgeClass(imprGrowth))
    .replace(/{IMPR_GROWTH}/g, getGrowthText(imprGrowth))
    .replace(/{CLICKS_DIFF}/g, getDiffText(thisMonthClicks, lastMonthClicks))
    .replace(/{CLICKS_CLASS}/g, getDiffClass(thisMonthClicks, lastMonthClicks))
    .replace(/{CLICKS_BADGE_CLASS}/g, getBadgeClass(clicksGrowth))
    .replace(/{CLICKS_GROWTH}/g, getGrowthText(clicksGrowth))
    .replace(/{ATC_DIFF}/g, getDiffText(thisMonthATC, lastMonthATC))
    .replace(/{ATC_CLASS}/g, getDiffClass(thisMonthATC, lastMonthATC))
    .replace(/{ATC_BADGE_CLASS}/g, getBadgeClass(atcGrowth))
    .replace(/{ATC_GROWTH}/g, getGrowthText(atcGrowth))
    .replace(/{PURCH_DIFF}/g, getDiffText(thisMonthPurchases, lastMonthPurchases))
    .replace(/{PURCH_CLASS}/g, getDiffClass(thisMonthPurchases, lastMonthPurchases))
    .replace(/{PURCH_BADGE_CLASS}/g, getBadgeClass(purchGrowth))
    .replace(/{PURCH_GROWTH}/g, getGrowthText(purchGrowth))

  console.log('[CPAS Template] Report generated successfully (inline), length:', html.length)
  return html
}
