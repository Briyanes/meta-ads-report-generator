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

  // Extract metrics - match API field names
  const thisSpent = parseNum(thisWeekData.amountSpent)
  const lastSpent = parseNum(lastWeekData.amountSpent)
  const thisResults = parseNum(thisWeekData.messagingConversations || thisWeekData.results)
  const lastResults = parseNum(lastWeekData.messagingConversations || lastWeekData.results)
  const thisCPR = parseNum(thisWeekData.costPerWA || thisWeekData.costPerMessagingConversation)
  const lastCPR = parseNum(lastWeekData.costPerWA || lastWeekData.costPerMessagingConversation)
  const thisImpr = parseNum(thisWeekData.impressions)
  const lastImpr = parseNum(lastWeekData.impressions)
  const thisCTR = parseNum(thisWeekData.ctr || thisWeekData.ctrAll || 0)
  const lastCTR = parseNum(lastWeekData.ctr || lastWeekData.ctrAll || 0)
  const thisCPC = parseNum(thisWeekData.cpc)
  const lastCPC = parseNum(lastWeekData.cpc)
  const thisOutboundClicks = parseNum(thisWeekData.outboundClicks)
  const lastOutboundClicks = parseNum(lastWeekData.outboundClicks)

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
                    <td><strong>Outbound Clicks</strong></td>
                    <td class="text-right">${formatNumber(lastOutboundClicks)}</td>
                    <td class="text-right">${formatNumber(thisOutboundClicks)}</td>
                    <td class="text-right">${formatNumber(thisOutboundClicks - lastOutboundClicks)}</td>
                    <td class="text-right"><span class="badge ${calculateGrowth(thisOutboundClicks, lastOutboundClicks) >= 0 ? 'badge-green' : 'badge-red'}">${calculateGrowth(thisOutboundClicks, lastOutboundClicks) >= 0 ? '+' : ''}${formatPercent(calculateGrowth(thisOutboundClicks, lastOutboundClicks))}</span></td>
                </tr>
                <tr>
                    <td><strong>Impressions</strong></td>
                    <td class="text-right">${formatNumber(lastImpr)}</td>
                    <td class="text-right">${formatNumber(thisImpr)}</td>
                    <td class="text-right">${formatNumber(thisImpr - lastImpr)}</td>
                    <td class="text-right"><span class="badge ${calculateGrowth(thisImpr, lastImpr) >= 0 ? 'badge-green' : 'badge-red'}">${calculateGrowth(thisImpr, lastImpr) >= 0 ? '+' : ''}${formatPercent(calculateGrowth(thisImpr, lastImpr))}</span></td>
                </tr>
                <tr>
                    <td><strong>Click-Through Rate (CTR)</strong></td>
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
                <tr>
                    <td><strong>OC → WA Landing Ratio</strong></td>
                    <td class="text-right">${formatPercent((lastOutboundClicks && lastResults) ? (lastResults / lastOutboundClicks * 100) : 0)}</td>
                    <td class="text-right">${formatPercent((thisOutboundClicks && thisResults) ? (thisResults / thisOutboundClicks * 100) : 0)}</td>
                    <td class="text-right">${formatPercent(((thisOutboundClicks && thisResults) ? (thisResults / thisOutboundClicks * 100) : 0) - ((lastOutboundClicks && lastResults) ? (lastResults / lastOutboundClicks * 100) : 0))}</td>
                    <td class="text-right"><span class="badge ${((thisOutboundClicks && thisResults) ? (thisResults / thisOutboundClicks) : 0) >= ((lastOutboundClicks && lastResults) ? (lastResults / lastOutboundClicks) : 0) ? 'badge-green' : 'badge-red'}">${((thisOutboundClicks && thisResults) ? (thisResults / thisOutboundClicks) : 0) >= ((lastOutboundClicks && lastResults) ? (lastResults / lastOutboundClicks) : 0) ? '+' : ''}${formatPercent(calculateGrowth((thisOutboundClicks && thisResults) ? (thisResults / thisOutboundClicks) : 0, (lastOutboundClicks && lastResults) ? (lastResults / lastOutboundClicks) : 0))}</span></td>
                </tr>
            </tbody>
        </table>

        <div class="insight-box">
            <p><strong>Insight Utama:</strong> ${spendGrowth >= 0 ? 'Peningkatan' : 'Penurunan'} performa sebesar ${Math.abs(spendGrowth).toFixed(1)}% dengan ${resultsGrowth >= 0 ? 'peningkatan' : 'penurunan'} messaging conversations. CPR ${cprGrowth <= 0 ? 'turun' : 'naik'} ${Math.abs(cprGrowth).toFixed(1)}% menunjukkan efisiensi biaya yang ${cprGrowth <= 0 ? 'lebih baik' : 'perlu diperbaiki'}.</p>
        </div>

        <div class="slide-footer">
            <span>Hadona Digital Media • CTWA Performance Report</span>
            <span class="slide-number">Page 3</span>
        </div>
    </div>`

  // Analysis & Recommendations Slide
  html += `
    <!-- SLIDE: ANALYSIS & RECOMMENDATIONS -->
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

        <h1>Analysis & Recommendations</h1>
        <h2>Performance Evaluation</h2>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px;">
            <!-- Highlights -->
            <div>
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
                    <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #10B981 0%, #059669 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px;">✓</div>
                    <h3 style="font-size: 18px; font-weight: 700; color: var(--success-green); margin: 0;">Highlights</h3>
                </div>

                <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); padding: 24px; border-radius: 16px; border-left: 5px solid var(--success-green);">
                    <div style="display: flex; flex-direction: column; gap: 16px;">
                        ${resultsGrowth > 0 ? `
                        <div style="padding-bottom: 12px; border-bottom: 1px solid #bbf7d0;">
                            <div style="font-size: 13px; color: #166534; font-weight: 600; margin-bottom: 4px;">Pertumbuhan Messaging Conversations</div>
                            <div style="font-size: 11px; color: #15803d;">Meningkat sebesar ${resultsGrowth.toFixed(1)}% dibanding ${lastPeriodLabel === 'Last Month' ? 'bulan lalu' : 'minggu lalu'}, menunjukkan engagement pengguna yang kuat.</div>
                        </div>
                        ` : ''}

                        ${cprGrowth < 0 ? `
                        <div style="padding-bottom: 12px; border-bottom: 1px solid #bbf7d0;">
                            <div style="font-size: 13px; color: #166534; font-weight: 600; margin-bottom: 4px;">Efisiensi Biaya Meningkat</div>
                            <div style="font-size: 11px; color: #15803d;">CPR turun sebesar ${Math.abs(cprGrowth).toFixed(1)}%, menghasilkan ROI yang lebih baik dan pengeluaran iklan yang optimal.</div>
                        </div>
                        ` : ''}

                        ${thisCTR > 0.4 ? `
                        <div style="padding-bottom: 12px; border-bottom: 1px solid #bbf7d0;">
                            <div style="font-size: 13px; color: #166534; font-weight: 600; margin-bottom: 4px;">Click-Through Rate Kuat</div>
                            <div style="font-size: 11px; color: #15803d;">CTR sebesar ${(thisCTR * 100).toFixed(2)}% menunjukkan creative iklan yang menarik dan targeting yang efektif.</div>
                        </div>
                        ` : ''}

                        ${thisOutboundClicks > lastOutboundClicks ? `
                        <div style="padding-bottom: 12px; border-bottom: 1px solid #bbf7d0;">
                            <div style="font-size: 13px; color: #166534; font-weight: 600; margin-bottom: 4px;">Outbound Clicks Lebih Tinggi</div>
                            <div style="font-size: 11px; color: #15803d;">Outbound clicks meningkat sebesar ${calculateGrowth(thisOutboundClicks, lastOutboundClicks).toFixed(1)}%, mengarahkan lebih banyak trafik ke WhatsApp.</div>
                        </div>
                        ` : ''}

                        <div style="${resultsGrowth <= 0 && cprGrowth >= 0 && thisCTR <= 0.4 && thisOutboundClicks <= lastOutboundClicks ? '' : 'padding-bottom: 12px; border-bottom: 1px solid #bbf7d0;'}">
                            <div style="font-size: 13px; color: #166534; font-weight: 600; margin-bottom: 4px;">Performa Konsisten</div>
                            <div style="font-size: 11px; color: #15803d;">Mempertahankan messaging conversations stabil dengan total ${formatNumber(thisResults)} hasil ${retentionType === 'mom' ? 'bulan ini' : 'minggu ini'}.</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Lowlights -->
            <div>
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
                    <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px;">⚠</div>
                    <h3 style="font-size: 18px; font-weight: 700; color: var(--danger-red); margin: 0;">Lowlights</h3>
                </div>

                <div style="background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); padding: 24px; border-radius: 16px; border-left: 5px solid var(--danger-red);">
                    <div style="display: flex; flex-direction: column; gap: 16px;">
                        ${cprGrowth > 0 ? `
                        <div style="padding-bottom: 12px; border-bottom: 1px solid #fecaca;">
                            <div style="font-size: 13px; color: #991b1b; font-weight: 600; margin-bottom: 4px;">Biaya per Hasil Meningkat</div>
                            <div style="font-size: 11px; color: #b91c1c;">CPR naik sebesar ${cprGrowth.toFixed(1)}%, perlu optimasi untuk mempertahankan profitabilitas.</div>
                        </div>
                        ` : ''}

                        ${resultsGrowth < 0 ? `
                        <div style="padding-bottom: 12px; border-bottom: 1px solid #fecaca;">
                            <div style="font-size: 13px; color: #991b1b; font-weight: 600; margin-bottom: 4px;">Penurunan Messaging Conversations</div>
                            <div style="font-size: 11px; color: #b91c1c;">Hasil menurun sebesar ${Math.abs(resultsGrowth).toFixed(1)}%, mengindikasikan kemungkinan audience fatigue atau creative fatigue.</div>
                        </div>
                        ` : ''}

                        ${thisCTR < 0.3 ? `
                        <div style="padding-bottom: 12px; border-bottom: 1px solid #fecaca;">
                            <div style="font-size: 13px; color: #991b1b; font-weight: 600; margin-bottom: 4px;">CTR Di Bawah Rata-Rata</div>
                            <div style="font-size: 11px; color: #b91c1c;">CTR sebesar ${(thisCTR * 100).toFixed(2)}% di bawah benchmark industri. Pertimbangkan untuk refresh creative iklan dan testing format baru.</div>
                        </div>
                        ` : ''}

                        ${spendGrowth > resultsGrowth && resultsGrowth > 0 ? `
                        <div style="padding-bottom: 12px; border-bottom: 1px solid #fecaca;">
                            <div style="font-size: 13px; color: #991b1b; font-weight: 600; margin-bottom: 4px;">Pengembalian yang Menurun</div>
                            <div style="font-size: 11px; color: #b91c1c;">Pertumbuhan spend (${spendGrowth.toFixed(1)}%) melebihi pertumbuhan hasil (${resultsGrowth.toFixed(1)}%). Perlu peningkatan efisiensi konversi.</div>
                        </div>
                        ` : ''}

                        <div style="${cprGrowth <= 0 && resultsGrowth >= 0 && thisCTR >= 0.3 && !(spendGrowth > resultsGrowth && resultsGrowth > 0) ? '' : 'padding-bottom: 12px; border-bottom: 1px solid #fecaca;'}">
                            <div style="font-size: 13px; color: #991b1b; font-weight: 600; margin-bottom: 4px;">Peluang Optimasi</div>
                            <div style="font-size: 11px; color: #b91c1c;">Fokus pada segmen dengan performa terbaik yang teridentifikasi dalam analisis breakdown untuk memaksimalkan ROI.</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="insight-box" style="margin-top: 32px;">
            <p><strong>Rekomendasi Strategis:</strong> ${spendGrowth >= 0 && resultsGrowth >= 0 && cprGrowth <= 0 ? 'Performa kuat dengan efisiensi yang meningkat. Lanjutkan scaling audience dan creative terbaik sambil mempertahankan strategi optimasi saat ini.' : spendGrowth >= 0 && resultsGrowth >= 0 ? 'Trah pertumbuhan positif namun biaya meningkat. Optimalkan pengeluaran iklan dengan mengalokasikan ulang budget ke segmen terbaik dan testing variasi creative baru.' : resultsGrowth < 0 ? 'Hasil menurun. Perlu tindakan segera: refresh creative iklan, tinjau audience targeting, dan pause ad set yang underperform.' : 'Performa stabil. Fokus pada peningkatan bertahap melalui A/B testing dan ekspansi audience bertahap.'}</p>
        </div>

        <div class="slide-footer">
            <span>Hadona Digital Media • CTWA Performance Report</span>
            <span class="slide-number">Page 4</span>
        </div>
    </div>`

  // Generate breakdown slides
  const ageData = breakdownThisWeek.age || []
  const genderData = breakdownThisWeek.gender || []
  const regionData = breakdownThisWeek.region || []
  const platformData = breakdownThisWeek.platform || []
  const placementData = breakdownThisWeek.placement || []
  const objectiveData = breakdownThisWeek.objective || []
  const creativeData = breakdownThisWeek['ad-creative'] || []

  let slideNumber = 5

  // Age Breakdown Slide
  if (ageData.length > 0) {
    html += generateBreakdownSlide(
      'Audience Performance: Age',
      ageData,
      breakdownLastWeek.age || [],
      'Messaging conversations started',
      'Age',
      formatNumber,
      slideNumber++
    )
  }

  // Gender Breakdown Slide
  if (genderData.length > 0) {
    html += generateBreakdownSlide(
      'Audience Performance: Gender',
      genderData,
      breakdownLastWeek.gender || [],
      'Messaging conversations started',
      'Gender',
      formatNumber,
      slideNumber++
    )
  }

  // Region Breakdown Slide
  if (regionData.length > 0) {
    html += generateBreakdownSlide(
      'Audience Performance: Region',
      regionData,
      breakdownLastWeek.region || [],
      'Messaging conversations started',
      'Region',
      formatNumber,
      slideNumber++
    )
  }

  // Platform Performance Slide
  if (platformData.length > 0) {
    html += generateBreakdownSlide(
      'Platform Performance',
      platformData,
      breakdownLastWeek.platform || [],
      'Messaging conversations started',
      'Platform',
      formatNumber,
      slideNumber++
    )
  }

  // Placement Performance Slide
  if (placementData.length > 0) {
    html += generateBreakdownSlide(
      'Placement Performance',
      placementData,
      breakdownLastWeek.placement || [],
      'Messaging conversations started',
      'Placement',
      formatNumber,
      slideNumber++
    )
  }

  // Creative Performance Slide (Top Ads)
  if (creativeData.length > 0) {
    const sortedCreative = [...creativeData]
      .filter(item => item['Ad name'] || item['Ad Name'] || item['ad_name'])
      .sort((a, b) => {
        const resultA = a['Messaging conversations started'] || 0
        const resultB = b['Messaging conversations started'] || 0
        return resultB - resultA
      })
      .slice(0, 5)

    const creativeRows = sortedCreative.map((item, index) => {
      const adName = item['Ad name'] || item['Ad Name'] || item['ad_name'] || 'Unknown'
      const results = item['Messaging conversations started'] || 0
      const impressions = item['Impressions'] || 0
      const ctr = item['CTR (link click-through rate)'] || 0
      const spend = item['Amount spent (IDR)'] || item['Amount Spent'] || 0

      const badgeClass = index === 0 ? 'background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); color: #92400e;' :
                        index === 1 ? 'background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); color: #065f46;' :
                        index === 2 ? 'background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); color: #1e40af;' :
                        'background: var(--neutral-50); color: var(--neutral-700);'

      return `                <tr style="${index === 0 ? 'background: #fef9c3;' : ''}">
                    <td>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span style="display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 50%; font-size: 11px; font-weight: 700; ${badgeClass}">#${index + 1}</span>
                            <span style="font-size: 11px; font-weight: 600;">${adName.length > 50 ? adName.substring(0, 47) + '...' : adName}</span>
                        </div>
                    </td>
                    <td class="text-right">${formatNumber(results)}</td>
                    <td class="text-right">${formatNumber(impressions)}</td>
                    <td class="text-right">${formatPercent(ctr * 100)}</td>
                    <td class="text-right">${formatCurrency(spend)}</td>
                </tr>`
    }).join('\n')

    html += `
    <!-- SLIDE: CREATIVE PERFORMANCE -->
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

        <h1>Creative Performance</h1>
        <h2>Top Performing Ads</h2>

        <table>
            <thead>
                <tr>
                    <th>Ad Name</th>
                    <th class="text-right">Results</th>
                    <th class="text-right">Impressions</th>
                    <th class="text-right">CTR</th>
                    <th class="text-right">Spend</th>
                </tr>
            </thead>
            <tbody>
${creativeRows}
            </tbody>
        </table>

        <div class="insight-box">
            <p><strong>Insight Utama:</strong> Top 3 iklan berkontribusi ${Math.round(sortedCreative.slice(0, 3).reduce((sum, item) => sum + (item['Messaging conversations started'] || 0), 0) / Math.max(thisResults, 1) * 100)}% dari total messaging conversations. Fokuskan budget pada top performers dan lakukan A/B test untuk format creative yang serupa.</p>
        </div>

        <div class="slide-footer">
            <span>Hadona Digital Media • CTWA Performance Report</span>
            <span class="slide-number">Page ${slideNumber++}</span>
        </div>
    </div>`
  }

  // Conclusion & Action Plan Slide
  html += `
    <!-- SLIDE: CONCLUSION & STRATEGIC ACTION PLAN -->
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

        <h1>Conclusion & Strategic Action Plan</h1>
        <h2>Recommendations for Next Period</h2>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px;">
            <div>
                <h3 style="font-size: 16px; font-weight: 700; margin-bottom: 16px; color: var(--success-green);">✓ What's Working</h3>
                <div style="background: var(--neutral-50); padding: 20px; border-radius: 12px; border-left: 4px solid var(--success-green);">
                    <ul style="list-style: none; padding: 0; margin: 0; space-y: 12px;">
                        <li style="padding: 8px 0; border-bottom: 1px solid var(--neutral-200); font-size: 13px;">
                            <strong>Spend Efficiency:</strong> CPR ${cprGrowth <= 0 ? 'improved by' : 'is'} ${Math.abs(cprGrowth).toFixed(1)}%
                        </li>
                        <li style="padding: 8px 0; border-bottom: 1px solid var(--neutral-200); font-size: 13px;">
                            <strong>Engagement:</strong> ${resultsGrowth >= 0 ? 'Increased' : 'Stable'} messaging conversations
                        </li>
                        <li style="padding: 8px 0; font-size: 13px;">
                            <strong>Top Platform:</strong> ${platformData.length > 0 ? platformData[0].Platform || platformData[0].platform || 'Facebook' : 'Facebook'} leading performance
                        </li>
                    </ul>
                </div>
            </div>

            <div>
                <h3 style="font-size: 16px; font-weight: 700; margin-bottom: 16px; color: var(--warning-amber);">⚡ Action Items</h3>
                <div style="background: var(--neutral-50); padding: 20px; border-radius: 12px; border-left: 4px solid var(--warning-amber);">
                    <ul style="list-style: none; padding: 0; margin: 0;">
                        <li style="padding: 8px 0; border-bottom: 1px solid var(--neutral-200); font-size: 13px;">
                            <strong>1. Budget Optimization:</strong> Allocate 60-70% budget to top 3 performing ads
                        </li>
                        <li style="padding: 8px 0; border-bottom: 1px solid var(--neutral-200); font-size: 13px;">
                            <strong>2. Creative Testing:</strong> Test 3-5 new ad variations based on top performers
                        </li>
                        <li style="padding: 8px 0; font-size: 13px;">
                            <strong>3. Audience Expansion:</strong> Scale winning audiences to similar segments
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="insight-box">
            <p><strong>Rekomendasi Strategis:</strong> ${spendGrowth >= 0 && resultsGrowth >= 0 ? 'Lanjutkan scaling dengan strategi saat ini. Pertahankan pembagian 70/30 antara proven winners dan tes baru.' : 'Optimalkan iklan yang underperform. Fokus pada penurunan CPR sambil mempertahankan volume percakapan. Tinjau parameter targeting.'}</p>
        </div>

        <div class="slide-footer">
            <span>Hadona Digital Media • CTWA Performance Report</span>
            <span class="slide-number">Page ${slideNumber++}</span>
        </div>
    </div>

    <!-- SLIDE: THANK YOU -->
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

function generateBreakdownSlide(
  title: string,
  thisWeekData: any[],
  lastWeekData: any[],
  metricKey: string,
  labelKey: string,
  formatFn: (val: number) => string,
  slideNumber: number
): string {
  if (thisWeekData.length === 0 && lastWeekData.length === 0) {
    return '' // Skip slide if no data
  }

  const sortedData = [...thisWeekData]
    .filter(item => item[labelKey] && item[labelKey].trim())
    .sort((a, b) => {
      const resultA = a[metricKey] || 0
      const resultB = b[metricKey] || 0
      return resultB - resultA
    })
    .slice(0, 6)

  // Calculate insights
  const topPerformer = sortedData[0]
  const topPerformerName = topPerformer ? topPerformer[labelKey] : 'N/A'
  const topPerformerValue = topPerformer ? topPerformer[metricKey] || 0 : 0
  const totalValue = sortedData.reduce((sum, item) => sum + (item[metricKey] || 0), 0)
  const topPerformerPercentage = totalValue > 0 ? ((topPerformerValue / totalValue) * 100).toFixed(1) : '0'

  // Calculate average CTR
  const avgCTR = sortedData.reduce((sum, item) => {
    const ctr = item['CTR (link click-through rate)'] || 0
    return sum + ctr
  }, 0) / Math.max(sortedData.length, 1)

  const tableRows = sortedData.map(item => {
    const label = item[labelKey] || 'Unknown'
    const value = item[metricKey] || 0
    const formattedValue = formatFn(value)

    // Extract additional metrics
    const impressions = item['Impressions'] || 0
    const linkClicks = item['Outbound clicks'] || 0
    const ctrLinkClick = item['CTR (link click-through rate)'] || 0

    // Format additional metrics
    const formatNum = (val: number): string => {
      if (val === null || val === undefined || isNaN(val)) return '0'
      return Math.round(val).toLocaleString('id-ID')
    }
    const formatPercentVal = (val: number): string => {
      if (val === null || val === undefined || isNaN(val)) return '0%'
      return val.toFixed(2) + '%'
    }

    return `                <tr>
                    <td><strong>${label}</strong></td>
                    <td class="text-right">${formattedValue}</td>
                    <td class="text-right">${formatNum(impressions)}</td>
                    <td class="text-right">${formatNum(linkClicks)}</td>
                    <td class="text-right">${formatPercentVal(ctrLinkClick)}</td>
                </tr>`
  }).join('\n')

  return `
    <!-- SLIDE: ${title} -->
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

        <h1>${title}</h1>
        <h2>Performance by ${title.split(':').pop()}</h2>

        <table>
            <thead>
                <tr>
                    <th>${labelKey}</th>
                    <th class="text-right">Messaging Conversations</th>
                    <th class="text-right">Impressions</th>
                    <th class="text-right">Link Click</th>
                    <th class="text-right">CTR Link Click</th>
                </tr>
            </thead>
            <tbody>
${tableRows}
            </tbody>
        </table>

        <div class="insight-box">
            <p><strong>Insight Utama:</strong> Top performer <strong>${topPerformerName}</strong> berkontribusi <strong>${topPerformerPercentage}%</strong> dari total messaging conversations dengan ${formatFn(topPerformerValue)} hasil. Rata-rata CTR di semua segmen adalah <strong>${avgCTR.toFixed(2)}%</strong>, menunjukkan tingkat engagement ${avgCTR > 0.5 ? 'kuat' : avgCTR > 0.3 ? 'sedang' : 'rendah'}.</p>
        </div>

        <div class="slide-footer">
            <span>Hadona Digital Media • CTWA Performance Report</span>
            <span class="slide-number">Page ${slideNumber}</span>
        </div>
    </div>`
}
