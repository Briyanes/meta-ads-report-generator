export function generateReactTailwindReport(analysisData: any, reportName?: string, retentionType?: string, objectiveType?: string): string {
  console.log('[CTWA Template] Starting report generation...')

  const { thisWeek, lastWeek, breakdown, performanceSummary } = analysisData || {}

  // Get data from performanceSummary or fallback to direct properties
  const thisWeekData = performanceSummary?.thisWeek || thisWeek || {}
  const lastWeekData = performanceSummary?.lastWeek || lastWeek || {}
  const breakdownThisWeek = breakdown?.thisWeek || {}
  const breakdownLastWeek = breakdown?.lastWeek || {}

  // Parse numbers safely
  const parseNum = (val: any): number => {
    if (typeof val === 'number') return val
    if (!val) return 0
    const parsed = parseFloat(String(val).replace(/,/g, ''))
    return isNaN(parsed) ? 0 : parsed
  }

  // Helper functions
  const formatNumber = (num: number): string => {
    if (num === null || num === undefined || isNaN(num)) return '0'
    return Math.round(num).toLocaleString('id-ID')
  }

  const formatCurrency = (num: number): string => {
    if (num === null || num === undefined || isNaN(num)) return 'Rp 0'
    return 'Rp ' + Math.round(num).toLocaleString('id-ID')
  }

  const formatPercent = (num: number): string => {
    if (num === null || num === undefined || isNaN(num)) return '0%'
    return num.toFixed(2) + '%'
  }

  const calculateGrowth = (current: number, previous: number): number => {
    if (!previous || previous === 0) return 0
    return ((current - previous) / previous) * 100
  }

  // Labels
  const comparisonLabel = retentionType === 'mom' ? 'Month-over-Month' : 'Week-over-Week'
  const thisPeriodLabel = retentionType === 'mom' ? 'This Month' : 'This Week'
  const lastPeriodLabel = retentionType === 'mom' ? 'Last Month' : 'Last Week'
  const defaultReportName = 'Meta Ads Performance Report'
  const objectiveLabel = 'CTWA (Click to WhatsApp)'

  // Extract metrics
  const thisSpent = parseNum(thisWeekData.amountSpent)
  const lastSpent = parseNum(lastWeekData.amountSpent)
  const thisResults = parseNum(thisWeekData.messagingConversations)
  const lastResults = parseNum(lastWeekData.messagingConversations)
  const thisCPR = parseNum(thisWeekData.costPerMessagingConversation)
  const lastCPR = parseNum(lastWeekData.costPerMessagingConversation)
  const thisImpr = parseNum(thisWeekData.impressions)
  const lastImpr = parseNum(lastWeekData.impressions)
  const thisCTR = parseNum(thisWeekData.ctr || 0)
  const lastCTR = parseNum(lastWeekData.ctr || 0)
  const thisCPC = parseNum(thisWeekData.cpc || 0)
  const lastCPC = parseNum(lastWeekData.cpc || 0)

  // Calculate growth
  const spendGrowth = calculateGrowth(thisSpent, lastSpent)
  const resultsGrowth = calculateGrowth(thisResults, lastResults)
  const cprGrowth = calculateGrowth(thisCPR, lastCPR)

  // Format all values
  const thisWeekSpent = formatCurrency(thisSpent)
  const lastWeekSpent = formatCurrency(lastSpent)
  const thisWeekResults = formatNumber(thisResults)
  const lastWeekResults = formatNumber(lastResults)
  const thisWeekCPR = formatCurrency(thisCPR)
  const lastWeekCPR = formatCurrency(lastCPR)

  // Generate HTML string directly (no nested template literals)
  let html = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${comparisonLabel} CTWA Report - ${reportName || defaultReportName}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary-blue: #2B46BB;
            --primary-yellow: #ECDC43;
            --success-green: #10B981;
            --danger-red: #EF4444;
            --neutral-50: #f8fafc;
            --neutral-100: #f1f5f9;
            --neutral-200: #e2e8f0;
            --neutral-300: #cbd5e1;
            --neutral-400: #94a3b8;
            --neutral-500: #64748b;
            --neutral-600: #475569;
            --neutral-700: #334155;
            --neutral-800: #1e293b;
            --neutral-900: #0f172a;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            color: var(--neutral-800);
            line-height: 1.6;
            -webkit-font-smoothing: antialiased;
        }

        .slide {
            min-height: 900px;
            background: white;
            padding: 56px 64px;
            margin: 0 auto 24px;
            page-break-inside: avoid;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06);
            position: relative;
        }

        .slide::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 6px;
            background: linear-gradient(90deg, var(--primary-blue) 0%, var(--primary-yellow) 100%);
        }

        .agency-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 32px;
            padding-bottom: 20px;
            border-bottom: 2px solid var(--neutral-100);
        }

        .agency-logo {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .agency-logo-icon {
            width: 65px;
            height: auto;
            object-fit: contain;
        }

        .agency-name {
            font-size: 20px;
            font-weight: 700;
            color: var(--neutral-900);
            letter-spacing: -0.02em;
        }

        .agency-tagline {
            font-size: 12px;
            color: var(--neutral-500);
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .report-meta {
            text-align: right;
        }

        .report-date {
            font-size: 11px;
            color: var(--neutral-500);
            font-weight: 500;
        }

        .confidential-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 6px 12px;
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            color: #92400e;
            font-size: 10px;
            font-weight: 700;
            border-radius: 20px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-top: 8px;
        }

        .slide-footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid var(--neutral-200);
            font-size: 10px;
            color: var(--neutral-500);
        }

        .slide-number {
            font-weight: 600;
            color: var(--primary-blue);
        }

        h1 {
            font-size: 32px;
            font-weight: 800;
            color: var(--primary-blue);
            letter-spacing: -0.03em;
            margin-bottom: 8px;
            line-height: 1.2;
        }

        h2 {
            font-size: 14px;
            color: var(--neutral-500);
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 32px;
        }

        .card {
            background: var(--neutral-50);
            border: 1px solid var(--neutral-200);
            border-radius: 16px;
            padding: 24px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
            transition: all 0.2s ease;
        }

        .card:hover {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            border-color: var(--neutral-300);
        }

        .card-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 16px;
        }

        .card-title {
            font-size: 11px;
            color: var(--neutral-500);
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .card-badge {
            padding: 4px 10px;
            background: var(--primary-blue);
            color: white;
            font-size: 10px;
            font-weight: 700;
            border-radius: 12px;
            text-transform: uppercase;
            letter-spacing: 0.03em;
        }

        .metric-label {
            font-size: 12px;
            color: var(--neutral-500);
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.03em;
        }

        .metric-value {
            font-size: 42px;
            font-weight: 800;
            color: var(--primary-blue);
            margin: 12px 0;
            letter-spacing: -0.04em;
            line-height: 1;
        }

        .growth-indicator {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 700;
        }

        .growth-indicator.positive {
            background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
            color: #065f46;
        }

        .growth-indicator.negative {
            background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
            color: #991b1b;
        }

        table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
            font-size: 12px;
        }

        thead {
            background: linear-gradient(135deg, var(--primary-blue) 0%, #3d5ee0 100%);
        }

        th {
            color: white;
            padding: 14px 12px;
            text-align: left;
            font-weight: 700;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            white-space: nowrap;
        }

        th:first-child { border-top-left-radius: 12px; }
        th:last-child { border-top-right-radius: 12px; }

        .text-right { text-align: right; }

        tbody tr {
            border-bottom: 1px solid var(--neutral-100);
            transition: background-color 0.15s ease;
        }

        tbody tr:hover { background: var(--neutral-50); }
        tbody tr:last-child { border-bottom: none; }

        td {
            padding: 12px;
            font-size: 11px;
            color: var(--neutral-700);
        }

        tbody tr:nth-child(even) { background: #fafbfc; }
        tbody tr:nth-child(even):hover { background: var(--neutral-50); }

        .badge {
            padding: 5px 10px;
            border-radius: 20px;
            font-weight: 700;
            font-size: 10px;
            display: inline-block;
            text-transform: uppercase;
            letter-spacing: 0.03em;
        }

        .badge-green {
            background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
            color: #065f46;
            border: 1px solid #a7f3d0;
        }

        .badge-red {
            background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
            color: #991b1b;
            border: 1px solid #fecaca;
        }

        .insight-box {
            background: linear-gradient(135deg, #fef9c3 0%, #fef08a 100%);
            border-left: 5px solid var(--primary-yellow);
            padding: 24px;
            border-radius: 12px;
            position: relative;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(236, 220, 67, 0.2);
            margin-top: 24px;
        }

        .insight-box p {
            font-size: 14px;
            color: #854d0e;
            line-height: 1.8;
            font-weight: 500;
            position: relative;
            z-index: 1;
            margin: 0;
        }

        @media print {
            body { background: white; }
            .slide {
                box-shadow: none;
                margin: 0;
                page-break-after: always;
            }
            .slide:last-child { page-break-after: auto; }
        }
    </style>
</head>
<body>
    <!-- SLIDE 1: COVER -->
    <div class="slide" style="display: flex; align-items: center; justify-content: center; text-align: center;">
        <div style="max-width: 800px;">
            <img src="https://report.hadona.id/logo/logo-header-pdf.webp" alt="Hadona Logo" style="width: 100px; height: auto; margin-bottom: 40px;" />
            <h1 style="font-size: 48px; margin-bottom: 16px;">${comparisonLabel} Reporting</h1>
            <p style="font-size: 24px; color: var(--primary-blue); font-weight: 600; margin-bottom: 16px;">${objectiveLabel}</p>
            ${reportName && reportName !== defaultReportName ? `<p style="font-size: 20px; color: var(--neutral-700); font-weight: 600; margin-bottom: 24px;">${reportName}</p>` : ''}
            <div style="display: inline-flex; align-items: center; gap: 8px; padding: 12px 20px; background: linear-gradient(135deg, var(--primary-blue) 0%, #3d5ee0 100%); color: white; border-radius: 24px; font-size: 14px; font-weight: 600; box-shadow: 0 4px 12px rgba(43, 70, 187, 0.25);">
                <span>📅</span>
                <span>${retentionType === 'mom' ? 'Month-over-Month Comparison' : 'Week-over-Week Comparison'}</span>
            </div>
            <div style="margin-top: 48px; padding: 24px; background: var(--neutral-50); border-radius: 12px; border: 1px solid var(--neutral-200);">
                <p style="font-size: 14px; color: var(--neutral-700); font-weight: 600; margin-bottom: 8px;">🔒 Private & Confidential</p>
                <p style="font-size: 13px; color: var(--neutral-600); line-height: 1.6;">This report contains proprietary insights prepared exclusively for our valued client. Redistribution or disclosure is not permitted.</p>
            </div>
        </div>
    </div>

    <!-- SLIDE 2: PERFORMANCE SUMMARY -->
    <div class="slide">
        <div class="agency-header">
            <div class="agency-logo">
                <img src="https://report.hadona.id/logo/logo-header-pdf.webp" alt="Hadona" class="agency-logo-icon" />
                <div>
                    <div class="agency-name">Hadona Digital Media</div>
                    <div class="agency-tagline">Performance Marketing</div>
                </div>
            </div>
            <div class="report-meta">
                <div class="report-date">Generated: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                <div class="confidential-badge">🔒 Confidential</div>
            </div>
        </div>

        <h1>Performance Summary</h1>
        <h2>Key Metrics Overview</h2>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px;">
            <div class="card">
                <div class="card-header">
                    <div class="card-title">${thisPeriodLabel}</div>
                    <div class="card-badge">Current</div>
                </div>
                <div style="margin-top: 20px;">
                    <div class="metric-label">Amount Spent</div>
                    <div class="metric-value">${thisWeekSpent}</div>
                </div>
                <div style="margin-top: 20px;">
                    <div class="metric-label">Messaging Conversations Started</div>
                    <div class="metric-value">${thisWeekResults}</div>
                </div>
                <div style="margin-top: 20px;">
                    <div class="metric-label">Cost per Messaging Conversation</div>
                    <div class="metric-value">${thisWeekCPR}</div>
                </div>
                <div style="margin-top: 24px;">
                    <div class="growth-indicator ${spendGrowth >= 0 ? 'positive' : 'negative'}">
                        <span>${spendGrowth >= 0 ? '↑' : '↓'}</span>
                        <span>Spend Growth: ${spendGrowth >= 0 ? '+' : ''}${formatPercent(spendGrowth)}</span>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <div class="card-title">${lastPeriodLabel}</div>
                    <div class="card-badge">Previous</div>
                </div>
                <div style="margin-top: 20px;">
                    <div class="metric-label">Amount Spent</div>
                    <div class="metric-value">${lastWeekSpent}</div>
                </div>
                <div style="margin-top: 20px;">
                    <div class="metric-label">Messaging Conversations Started</div>
                    <div class="metric-value">${lastWeekResults}</div>
                </div>
                <div style="margin-top: 20px;">
                    <div class="metric-label">Cost per Messaging Conversation</div>
                    <div class="metric-value">${lastWeekCPR}</div>
                </div>
                <div style="margin-top: 24px; padding: 12px; background: var(--neutral-100); border-radius: 8px; font-size: 12px; color: var(--neutral-600);">
                    Comparison Period
                </div>
            </div>
        </div>

        <div class="slide-footer">
            <span>Hadona Digital Media • CTWA Performance Report</span>
            <span class="slide-number">Page 2</span>
        </div>
    </div>

    <!-- SLIDE 3: DETAILED METRICS TABLE -->
    <div class="slide">
        <div class="agency-header">
            <div class="agency-logo">
                <img src="https://report.hadona.id/logo/logo-header-pdf.webp" alt="Hadona" class="agency-logo-icon" />
                <div>
                    <div class="agency-name">Hadona Digital Media</div>
                    <div class="agency-tagline">Performance Marketing</div>
                </div>
            </div>
            <div class="report-meta">
                <div class="report-date">Generated: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                <div class="confidential-badge">🔒 Confidential</div>
            </div>
        </div>

        <h1>Period Comparison</h1>
        <h2>Key Metrics Overview</h2>

        <table>
            <thead>
                <tr>
                    <th>Metrik</th>
                    <th class="text-right">${lastPeriodLabel}</th>
                    <th class="text-right">${thisPeriodLabel}</th>
                    <th class="text-right">Trending Value</th>
                    <th class="text-right">Trending %</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>Amount Spent</strong></td>
                    <td class="text-right">${lastWeekSpent}</td>
                    <td class="text-right">${thisWeekSpent}</td>
                    <td class="text-right">${formatCurrency(thisSpent - lastSpent)}</td>
                    <td class="text-right"><span class="badge ${spendGrowth >= 0 ? 'badge-green' : 'badge-red'}">${spendGrowth >= 0 ? '+' : ''}${formatPercent(spendGrowth)}</span></td>
                </tr>
                <tr>
                    <td><strong>Messaging Conversations Started</strong></td>
                    <td class="text-right">${lastWeekResults}</td>
                    <td class="text-right">${thisWeekResults}</td>
                    <td class="text-right">${formatNumber(thisResults - lastResults)}</td>
                    <td class="text-right"><span class="badge ${resultsGrowth >= 0 ? 'badge-green' : 'badge-red'}">${resultsGrowth >= 0 ? '+' : ''}${formatPercent(resultsGrowth)}</span></td>
                </tr>
                <tr>
                    <td><strong>Cost per Messaging Conversation</strong></td>
                    <td class="text-right">${lastWeekCPR}</td>
                    <td class="text-right">${thisWeekCPR}</td>
                    <td class="text-right">${formatCurrency(thisCPR - lastCPR)}</td>
                    <td class="text-right"><span class="badge ${cprGrowth <= 0 ? 'badge-green' : 'badge-red'}">${cprGrowth <= 0 ? '' : '+'}${formatPercent(cprGrowth)}</span></td>
                </tr>
                <tr>
                    <td><strong>Impressions</strong></td>
                    <td class="text-right">${formatNumber(lastImpr)}</td>
                    <td class="text-right">${formatNumber(thisImpr)}</td>
                    <td class="text-right">${formatNumber(thisImpr - lastImpr)}</td>
                    <td class="text-right"><span class="badge ${calculateGrowth(thisImpr, lastImpr) >= 0 ? 'badge-green' : 'badge-red'}">${calculateGrowth(thisImpr, lastImpr) >= 0 ? '+' : ''}${formatPercent(calculateGrowth(thisImpr, lastImpr))}</span></td>
                </tr>
                <tr>
                    <td><strong>Click-Through Rate</strong></td>
                    <td class="text-right">${formatPercent(lastCTR * 100)}</td>
                    <td class="text-right">${formatPercent(thisCTR * 100)}</td>
                    <td class="text-right">${formatPercent((thisCTR - lastCTR) * 100)}</td>
                    <td class="text-right"><span class="badge ${calculateGrowth(thisCTR, lastCTR) >= 0 ? 'badge-green' : 'badge-red'}">${calculateGrowth(thisCTR, lastCTR) >= 0 ? '+' : ''}${formatPercent(calculateGrowth(thisCTR, lastCTR))}</span></td>
                </tr>
                <tr>
                    <td><strong>Cost per Click (CPC)</strong></td>
                    <td class="text-right">${formatCurrency(lastCPC)}</td>
                    <td class="text-right">${formatCurrency(thisCPC)}</td>
                    <td class="text-right">${formatCurrency(thisCPC - lastCPC)}</td>
                    <td class="text-right"><span class="badge ${calculateGrowth(thisCPC, lastCPC) <= 0 ? 'badge-green' : 'badge-red'}">${calculateGrowth(thisCPC, lastCPC) <= 0 ? '' : '+'}${formatPercent(calculateGrowth(thisCPC, lastCPC))}</span></td>
                </tr>
            </tbody>
        </table>

        <div class="insight-box">
            <p><strong>Key Insight:</strong> ${spendGrowth >= 0 ? 'Peningkatan' : 'Penurunan'} performa sebesar ${Math.abs(spendGrowth).toFixed(1)}% dengan ${resultsGrowth >= 0 ? 'peningkatan' : 'penurunan'} messaging conversations. CPR ${cprGrowth <= 0 ? 'turun' : 'naik'} ${Math.abs(cprGrowth).toFixed(1)}% menunjukkan efisiensi biola yang ${cprGrowth <= 0 ? 'lebih baik' : 'perlu diperbaiki'}.</p>
        </div>

        <div class="slide-footer">
            <span>Hadona Digital Media • CTWA Performance Report</span>
            <span class="slide-number">Page 3</span>
        </div>
    </div>

    <!-- SLIDE 13: THANK YOU -->
    <div class="slide" style="text-align: center; padding: 120px 64px; background: linear-gradient(135deg, white 0%, var(--neutral-50) 100%);">
        <img src="https://report.hadona.id/logo/logo-header-pdf.webp" alt="Hadona Logo" style="width: 100px; height: auto; margin-bottom: 48px;" />
        <h1 style="font-size: 56px; background: linear-gradient(135deg, var(--primary-blue) 0%, #3d5ee0 50%, var(--primary-yellow) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 24px; letter-spacing: -0.04em;">Thank You</h1>
        <p style="font-size: 20px; color: var(--neutral-600); font-weight: 600; margin-bottom: 48px;">Terima Kasih</p>
        <div style="display: flex; justify-content: center; gap: 32px; margin-top: 64px;">
            <div style="font-size: 16px; color: var(--neutral-700);">
                <strong>Instagram:</strong> @hadona.id
            </div>
            <div style="font-size: 16px; color: var(--neutral-700);">
                <strong>TikTok:</strong> @hadona.id
            </div>
            <div style="font-size: 16px; color: var(--neutral-700);">
                <strong>Website:</strong> www.hadona.id
            </div>
        </div>
        <div style="margin-top: 64px; font-size: 14px; color: var(--neutral-500);">
            Powered by <strong style="color: var(--primary-blue);">Hadona Digital Media</strong>
        </div>
    </div>
</body>
</html>`

  return html
}
