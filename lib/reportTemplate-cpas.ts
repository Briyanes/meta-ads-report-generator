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

  // Extract data with multiple fallback field names
  const thisMonthSpend = thisMonthData.amountSpent || thisMonthData.spend || 0
  const lastMonthSpend = lastMonthData.amountSpent || lastMonthData.spend || 0
  const thisMonthATC = thisMonthData.addToCart || thisMonthData.addsToCart || thisMonthData.results || 0
  const lastMonthATC = lastMonthData.addToCart || lastMonthData.addsToCart || lastMonthData.results || 0

  console.log('[CPAS Template] Extracted values:', {
    thisMonthSpend,
    lastMonthSpend,
    thisMonthATC,
    lastMonthATC
  })

  // Calculate growth
  const spendGrowth = lastMonthSpend > 0 ? ((thisMonthSpend - lastMonthSpend) / lastMonthSpend * 100) : 0
  const cprThisMonth = thisMonthATC > 0 ? (thisMonthSpend / thisMonthATC) : 0
  const cprLastMonth = lastMonthATC > 0 ? (lastMonthSpend / lastMonthATC) : 0

  // Format helpers
  const formatCurrency = (num: number) => 'Rp ' + num.toLocaleString('id-ID')
  const formatNumber = (num: number) => num.toLocaleString('id-ID')
  const formatPercent = (num: number) => num.toFixed(2)

  // Period labels
  const isWeek = retentionType === 'week'
  const thisPeriodLabel = isWeek ? 'Minggu Ini' : 'Bulan Ini'
  const lastPeriodLabel = isWeek ? 'Minggu Lalu' : 'Bulan Lalu'

  // Replace placeholders
  let html = CPAS_TEMPLATE
    .replace(/{REPORT_NAME}/g, reportName || 'CPAS Report')
    .replace(/{PERIOD_LABEL}/g, `${thisPeriodLabel} vs ${lastPeriodLabel}`)
    .replace(/{THIS_PERIOD_LABEL}/g, thisPeriodLabel)
    .replace(/{LAST_PERIOD_LABEL}/g, lastPeriodLabel)
    .replace(/{THIS_SPEND}/g, formatCurrency(thisMonthSpend))
    .replace(/{LAST_SPEND}/g, formatCurrency(lastMonthSpend))
    .replace(/{THIS_ATC}/g, formatNumber(thisMonthATC))
    .replace(/{LAST_ATC}/g, formatNumber(lastMonthATC))
    .replace(/{THIS_CPR}/g, formatCurrency(cprThisMonth))
    .replace(/{LAST_CPR}/g, cprLastMonth > 0 ? formatCurrency(cprLastMonth) : '-')
    .replace(/{GROWTH_COLOR}/g, spendGrowth >= 0 ? '#10B981' : '#EF4444')
    .replace(/{GROWTH_PERCENT}/g, (spendGrowth > 0 ? '+' : '') + formatPercent(spendGrowth))

  console.log('[CPAS Template] Report generated successfully (inline), length:', html.length)
  return html
}
