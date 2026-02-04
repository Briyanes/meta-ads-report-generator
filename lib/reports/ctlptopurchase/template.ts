import { 
  LOGO_URL, 
  formatNumber, 
  formatCurrency, 
  formatPercent, 
  parseNum, 
  calculateGrowth,
  getGrowthBadge,
  getGrowthClass
} from '../shared-styles'

// Bootstrap Icons CDN
const BOOTSTRAP_ICONS_CDN = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css'

// Icon helper function
const icon = (name: string, size: number = 16, color?: string) => {
  const colorStyle = color ? `color: ${color};` : ''
  return `<i class="bi bi-${name}" style="font-size: ${size}px; ${colorStyle}"></i>`
}

export function generateReactTailwindReport(analysisData: any, reportName?: string, retentionType?: string): string {
  console.log('[CTLP to Purchase Template] Starting report generation...')

  const data = typeof analysisData === 'string' ? JSON.parse(analysisData) : analysisData
  const perf = data?.performanceSummary || {}
  const thisWeek = perf.thisWeek || {}
  const lastWeek = perf.lastWeek || {}
  const breakdown = data?.breakdown || {}

  // DEBUG: Log raw data received
  console.log('[CTLP to Purchase] thisWeek data:', JSON.stringify({
    amountSpent: thisWeek.amountSpent,
    purchases: thisWeek.purchases,
    addsToCart: thisWeek.addsToCart,
    contentViews: thisWeek.contentViews,
    impressions: thisWeek.impressions,
    linkClicks: thisWeek.linkClicks,
    purchasesConversionValue: thisWeek.purchasesConversionValue
  }))
  console.log('[CTLP to Purchase] lastWeek data:', JSON.stringify({
    amountSpent: lastWeek.amountSpent,
    purchases: lastWeek.purchases,
    addsToCart: lastWeek.addsToCart
  }))

  // Labels
  const isMoM = retentionType === 'mom'
  const comparisonLabel = isMoM ? 'Month-over-Month' : 'Week-over-Week'
  const thisPeriodLabel = isMoM ? 'Bulan Ini' : 'Minggu Ini'
  const lastPeriodLabel = isMoM ? 'Bulan Lalu' : 'Minggu Lalu'
  const periodType = isMoM ? 'Month on Month' : 'Week on Week'
  const defaultReportName = reportName || 'Meta Ads Performance Report'

  const thisWeekData = thisWeek || {}
  const lastWeekData = lastWeek || {}
  const breakdownThisWeek = breakdown?.thisWeek || {}
  const breakdownLastWeek = breakdown?.lastWeek || {}

  // =============================================
  // EXTRACT E-COMMERCE METRICS
  // =============================================
  
  const thisSpent = parseNum(thisWeekData.amountSpent)
  const lastSpent = parseNum(lastWeekData.amountSpent)
  const thisPurchases = parseNum(thisWeekData.purchases || thisWeekData.results || 0)
  const lastPurchases = parseNum(lastWeekData.purchases || lastWeekData.results || 0)
  const thisATC = parseNum(thisWeekData.addsToCart || 0)
  const lastATC = parseNum(lastWeekData.addsToCart || 0)
  const thisCV = parseNum(thisWeekData.contentViews || 0)
  const lastCV = parseNum(lastWeekData.contentViews || 0)
  const thisPurchaseValue = parseNum(thisWeekData.purchasesConversionValue || 0)
  const lastPurchaseValue = parseNum(lastWeekData.purchasesConversionValue || 0)
  const thisImpr = parseNum(thisWeekData.impressions)
  const lastImpr = parseNum(lastWeekData.impressions)
  const thisReach = parseNum(thisWeekData.reach)
  const lastReach = parseNum(lastWeekData.reach)
  const thisLinkClicks = parseNum(thisWeekData.linkClicks)
  const lastLinkClicks = parseNum(lastWeekData.linkClicks)
  const thisFrequency = parseNum(thisWeekData.frequency)
  const lastFrequency = parseNum(lastWeekData.frequency)
  
  // =============================================
  // CALCULATE KPIs
  // =============================================
  
  const thisCPP = thisPurchases > 0 ? thisSpent / thisPurchases : 0
  const lastCPP = lastPurchases > 0 ? lastSpent / lastPurchases : 0
  const thisCPATC = thisATC > 0 ? thisSpent / thisATC : 0
  const lastCPATC = lastATC > 0 ? lastSpent / lastATC : 0
  const thisROAS = thisSpent > 0 ? thisPurchaseValue / thisSpent : 0
  const lastROAS = lastSpent > 0 ? lastPurchaseValue / lastSpent : 0
  const thisAOV = thisPurchases > 0 ? thisPurchaseValue / thisPurchases : 0
  const lastAOV = lastPurchases > 0 ? lastPurchaseValue / lastPurchases : 0
  const thisCTR = thisImpr > 0 ? (thisLinkClicks / thisImpr) * 100 : 0
  const lastCTR = lastImpr > 0 ? (lastLinkClicks / lastImpr) * 100 : 0
  const thisCPC = thisLinkClicks > 0 ? thisSpent / thisLinkClicks : 0
  const lastCPC = lastLinkClicks > 0 ? lastSpent / lastLinkClicks : 0
  const thisCPM = thisImpr > 0 ? (thisSpent / thisImpr) * 1000 : 0
  const lastCPM = lastImpr > 0 ? (lastSpent / lastImpr) * 1000 : 0
  
  // Funnel Conversion Rates
  const thisLCtoCV = thisLinkClicks > 0 ? (thisCV / thisLinkClicks) * 100 : 0
  const lastLCtoCV = lastLinkClicks > 0 ? (lastCV / lastLinkClicks) * 100 : 0
  const thisCVtoATC = thisCV > 0 ? (thisATC / thisCV) * 100 : 0
  const lastCVtoATC = lastCV > 0 ? (lastATC / lastCV) * 100 : 0
  const thisATCtoPurchase = thisATC > 0 ? (thisPurchases / thisATC) * 100 : 0
  const lastATCtoPurchase = lastATC > 0 ? (lastPurchases / lastATC) * 100 : 0
  const thisConvRate = thisLinkClicks > 0 ? (thisPurchases / thisLinkClicks) * 100 : 0
  const lastConvRate = lastLinkClicks > 0 ? (lastPurchases / lastLinkClicks) * 100 : 0

  // =============================================
  // GROWTH CALCULATIONS
  // =============================================
  const spendGrowth = calculateGrowth(thisSpent, lastSpent)
  const purchasesGrowth = calculateGrowth(thisPurchases, lastPurchases)
  const atcGrowth = calculateGrowth(thisATC, lastATC)
  const cvGrowth = calculateGrowth(thisCV, lastCV)
  const cppGrowth = calculateGrowth(thisCPP, lastCPP)
  const cpatcGrowth = calculateGrowth(thisCPATC, lastCPATC)
  const roasGrowth = calculateGrowth(thisROAS, lastROAS)
  const aovGrowth = calculateGrowth(thisAOV, lastAOV)
  const revenueGrowth = calculateGrowth(thisPurchaseValue, lastPurchaseValue)
  const imprGrowth = calculateGrowth(thisImpr, lastImpr)
  const reachGrowth = calculateGrowth(thisReach, lastReach)
  const linkClicksGrowth = calculateGrowth(thisLinkClicks, lastLinkClicks)
  const ctrGrowth = calculateGrowth(thisCTR, lastCTR)
  const cpcGrowth = calculateGrowth(thisCPC, lastCPC)
  const cpmGrowth = calculateGrowth(thisCPM, lastCPM)
  const freqGrowth = calculateGrowth(thisFrequency, lastFrequency)
  const convRateGrowth = calculateGrowth(thisConvRate, lastConvRate)

  // Breakdown data
  const ageData = breakdownThisWeek.age || []
  const genderData = breakdownThisWeek.gender || []
  const regionData = breakdownThisWeek.region || []
  const platformData = breakdownThisWeek.platform || []
  const placementData = breakdownThisWeek.placement || []
  const adCreativeData = breakdownThisWeek['ad-creative'] || breakdownThisWeek.adCreative || []
  const objectiveData = breakdownThisWeek.objective || []
  const ageDataLast = breakdownLastWeek.age || []
  const genderDataLast = breakdownLastWeek.gender || []

  const isGoodPerformance = cppGrowth <= 0 || (purchasesGrowth > 0 && cppGrowth < 10)

  let slideNumber = 0

  let html = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CTLP to Purchase Report - ${defaultReportName}</title>
    <link href="${BOOTSTRAP_ICONS_CDN}" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: #2563eb;
            --primary-dark: #1d4ed8;
            --primary-light: #dbeafe;
            --success: #059669;
            --success-light: #d1fae5;
            --danger: #dc2626;
            --danger-light: #fee2e2;
            --warning: #d97706;
            --warning-light: #fef3c7;
            --gray-50: #f9fafb;
            --gray-100: #f3f4f6;
            --gray-200: #e5e7eb;
            --gray-300: #d1d5db;
            --gray-400: #9ca3af;
            --gray-500: #6b7280;
            --gray-600: #4b5563;
            --gray-700: #374151;
            --gray-800: #1f2937;
            --gray-900: #111827;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: var(--gray-100);
            color: var(--gray-800);
            line-height: 1.5;
            -webkit-font-smoothing: antialiased;
        }

        .slide {
            width: 100%;
            min-height: 100vh;
            background: white;
            padding: 40px 56px;
            position: relative;
            page-break-after: always;
            border-bottom: 1px solid var(--gray-200);
        }

        .slide-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 32px;
            padding-bottom: 20px;
            border-bottom: 2px solid var(--gray-100);
        }

        .slide-header .logo { height: 40px; width: auto; }
        .slide-header .slide-number { font-size: 12px; color: var(--gray-400); font-weight: 500; }

        .slide-title { margin-bottom: 32px; }
        .slide-title h1 {
            font-size: 28px;
            font-weight: 700;
            color: var(--gray-900);
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .slide-title h1 i { color: var(--primary); }
        .slide-title p { font-size: 15px; color: var(--gray-500); }

        .card {
            background: white;
            border: 1px solid var(--gray-200);
            border-radius: 12px;
            padding: 20px;
            transition: all 0.2s ease;
        }
        .card:hover {
            border-color: var(--primary);
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.1);
        }

        .metric-icon {
            width: 48px;
            height: 48px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 12px;
            font-size: 24px;
        }
        .metric-icon.blue { background: var(--primary-light); color: var(--primary); }
        .metric-icon.green { background: var(--success-light); color: var(--success); }
        .metric-icon.orange { background: var(--warning-light); color: var(--warning); }
        .metric-icon.red { background: var(--danger-light); color: var(--danger); }

        .metric-label {
            font-size: 12px;
            font-weight: 600;
            color: var(--gray-500);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 8px;
        }

        .metric-value {
            font-size: 24px;
            font-weight: 700;
            color: var(--gray-900);
            margin-bottom: 4px;
        }

        .badge {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 4px 10px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 600;
        }
        .badge-success { background: var(--success-light); color: var(--success); }
        .badge-danger { background: var(--danger-light); color: var(--danger); }
        .badge-warning { background: var(--warning-light); color: var(--warning); }
        .badge-primary { background: var(--primary-light); color: var(--primary); }

        .table-container {
            border: 1px solid var(--gray-200);
            border-radius: 12px;
            overflow: hidden;
        }

        table { width: 100%; border-collapse: collapse; }
        thead { background: var(--primary); color: white; }
        th {
            padding: 14px 16px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            text-align: left;
        }
        th:not(:first-child) { text-align: right; }
        td {
            padding: 12px 16px;
            font-size: 13px;
            border-bottom: 1px solid var(--gray-100);
        }
        td:not(:first-child) { text-align: right; }
        tbody tr:hover { background: var(--gray-50); }
        tbody tr.highlight { background: var(--warning-light); }

        .funnel-container {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 16px;
            padding: 24px;
            background: var(--gray-50);
            border-radius: 16px;
            margin-bottom: 24px;
        }

        .funnel-step {
            background: white;
            border: 2px solid var(--gray-200);
            border-radius: 12px;
            padding: 20px 24px;
            text-align: center;
            min-width: 140px;
        }

        .funnel-step.active {
            border-color: var(--primary);
            background: var(--primary-light);
        }

        .funnel-step .step-label {
            font-size: 11px;
            font-weight: 600;
            color: var(--gray-500);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 8px;
        }

        .funnel-step .step-value {
            font-size: 24px;
            font-weight: 700;
            color: var(--gray-900);
        }

        .funnel-arrow {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
        }
        .funnel-arrow i { font-size: 24px; color: var(--gray-400); }
        .funnel-arrow .rate {
            font-size: 11px;
            font-weight: 600;
            padding: 4px 8px;
            border-radius: 4px;
            background: var(--warning-light);
            color: var(--warning);
        }

        .highlight-box { border-radius: 12px; padding: 24px; }
        .highlight-box.success {
            background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
            border: 1px solid #a7f3d0;
        }
        .highlight-box.danger {
            background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
            border: 1px solid #fecaca;
        }
        .highlight-box h3 {
            font-size: 16px;
            font-weight: 700;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .highlight-box.success h3 { color: var(--success); }
        .highlight-box.danger h3 { color: var(--danger); }

        .highlight-item {
            background: white;
            border-radius: 8px;
            padding: 12px 16px;
            margin-bottom: 10px;
            display: flex;
            align-items: flex-start;
            gap: 12px;
        }
        .highlight-item i { font-size: 16px; margin-top: 2px; }
        .highlight-item strong { display: block; font-size: 13px; color: var(--gray-800); margin-bottom: 2px; }
        .highlight-item p { font-size: 12px; color: var(--gray-500); margin: 0; }

        .summary-box {
            background: linear-gradient(135deg, var(--primary-light) 0%, #eff6ff 100%);
            border-left: 4px solid var(--primary);
            border-radius: 12px;
            padding: 20px 24px;
            margin-bottom: 24px;
        }
        .summary-box h3 {
            font-size: 14px;
            font-weight: 700;
            color: var(--primary-dark);
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .summary-box p { font-size: 14px; color: var(--gray-700); line-height: 1.7; }

        .info-box {
            background: linear-gradient(135deg, var(--primary-light) 0%, #eff6ff 100%);
            border-left: 4px solid var(--primary);
            border-radius: 12px;
            padding: 20px 24px;
            margin-top: 24px;
        }
        .info-box h4 {
            font-size: 13px;
            font-weight: 700;
            color: var(--primary-dark);
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .info-box p { font-size: 13px; color: var(--gray-700); line-height: 1.7; margin: 0; }

        /* Cover Slide */
        .cover-slide {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            min-height: 100vh;
            background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
            color: white;
        }
        .cover-slide .logo {
            width: 80px;
            height: 80px;
            margin-bottom: 32px;
            background: white;
            border-radius: 16px;
            padding: 12px;
        }
        .cover-slide .badge-period {
            background: rgba(255,255,255,0.2);
            padding: 8px 20px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            letter-spacing: 1px;
            margin-bottom: 24px;
        }
        .cover-slide h1 { font-size: 48px; font-weight: 800; margin-bottom: 16px; }
        .cover-slide h2 { font-size: 24px; font-weight: 500; opacity: 0.9; margin-bottom: 8px; }
        .cover-slide .period { font-size: 16px; opacity: 0.8; margin-bottom: 48px; }
        .cover-slide .confidential {
            background: rgba(255,255,255,0.1);
            border: 1px solid rgba(255,255,255,0.2);
            padding: 16px 24px;
            border-radius: 12px;
            max-width: 400px;
        }
        .cover-slide .confidential p { font-size: 13px; margin: 0; }

        /* Thank You Slide */
        .thankyou-slide {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            min-height: 100vh;
            background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
            color: white;
        }
        .thankyou-slide h1 { font-size: 56px; font-weight: 800; margin-bottom: 16px; }
        .thankyou-slide p { font-size: 18px; opacity: 0.9; margin-bottom: 32px; }
        .thankyou-slide .contact-box {
            background: rgba(255,255,255,0.15);
            border: 1px solid rgba(255,255,255,0.3);
            padding: 24px 40px;
            border-radius: 16px;
        }

        /* Status Badge */
        .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 12px 24px;
            border-radius: 50px;
            font-size: 14px;
            font-weight: 700;
            margin-bottom: 24px;
        }
        .status-badge.good { background: var(--success-light); color: var(--success); border: 2px solid var(--success); }
        .status-badge.warning { background: var(--warning-light); color: var(--warning); border: 2px solid var(--warning); }

        .mini-stats {
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            gap: 12px;
            margin-top: 20px;
        }
        .mini-stat {
            background: var(--gray-50);
            border: 1px solid var(--gray-200);
            border-radius: 8px;
            padding: 12px;
            text-align: center;
        }
        .mini-stat .label {
            font-size: 10px;
            font-weight: 600;
            color: var(--gray-500);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
        }
        .mini-stat .value { font-size: 14px; font-weight: 700; color: var(--gray-800); }

        .growth-up { color: var(--success); }
        .growth-down { color: var(--danger); }

        .priority-high { background: var(--danger-light); color: var(--danger); }
        .priority-medium { background: var(--warning-light); color: var(--warning); }
        .priority-low { background: var(--success-light); color: var(--success); }

        @media print {
            .slide { page-break-after: always; page-break-inside: avoid; }
        }
    </style>
</head>
<body>

    <!-- SLIDE 1: COVER -->
    <div class="slide cover-slide" data-slide="${++slideNumber}">
        <img src="${LOGO_URL}" alt="Logo" class="logo">
        
        <div class="badge-period">${periodType.toUpperCase()}</div>
        
        <h1>CTLP to Purchase Report</h1>
        <h2>${defaultReportName}</h2>
        <p class="period">${lastPeriodLabel} vs ${thisPeriodLabel}</p>
        
        <div class="confidential">
            <p>${icon('lock-fill', 14)} <strong>Private & Confidential</strong></p>
            <p style="margin-top: 8px; opacity: 0.8;">This report contains proprietary insights prepared exclusively for our valued client.</p>
        </div>
    </div>

    <!-- SLIDE 2: EXECUTIVE SUMMARY -->
    <div class="slide" data-slide="${++slideNumber}">
        <div class="slide-header">
            <img src="${LOGO_URL}" alt="Logo" class="logo">
            <span class="slide-number">Slide ${slideNumber}</span>
        </div>

        <div class="slide-title">
            <h1>${icon('speedometer2')} Executive Summary</h1>
            <p>E-Commerce Performance - ${comparisonLabel}</p>
        </div>

        <!-- Status Badge -->
        <div style="text-align: center; margin-bottom: 24px;">
            <div class="status-badge ${isGoodPerformance ? 'good' : 'warning'}">
                ${isGoodPerformance ? icon('check-circle-fill', 20) : icon('exclamation-triangle-fill', 20)}
                ${isGoodPerformance ? 'GOOD PERFORMANCE' : 'NEEDS ATTENTION'}
            </div>
        </div>

        <!-- 4 Key Metrics -->
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 24px;">
            <div class="card" style="text-align: center; border-top: 4px solid var(--success);">
                <div class="metric-icon green">${icon('cash-stack', 24)}</div>
                <div class="metric-label">Revenue</div>
                <div class="metric-value">${formatCurrency(thisPurchaseValue)}</div>
                <div style="margin-top: 8px;">${getGrowthBadgeNew(revenueGrowth)}</div>
            </div>
            <div class="card" style="text-align: center; border-top: 4px solid var(--primary);">
                <div class="metric-icon blue">${icon('bag-check-fill', 24)}</div>
                <div class="metric-label">Purchases</div>
                <div class="metric-value">${formatNumber(thisPurchases)}</div>
                <div style="margin-top: 8px;">${getGrowthBadgeNew(purchasesGrowth)}</div>
            </div>
            <div class="card" style="text-align: center; border-top: 4px solid var(--warning);">
                <div class="metric-icon orange">${icon('currency-dollar', 24)}</div>
                <div class="metric-label">Cost per Purchase</div>
                <div class="metric-value">${formatCurrency(thisCPP)}</div>
                <div style="margin-top: 8px;">${getGrowthBadgeNew(cppGrowth, true)}</div>
            </div>
            <div class="card" style="text-align: center; border-top: 4px solid #8b5cf6;">
                <div class="metric-icon" style="background: #ede9fe; color: #8b5cf6;">${icon('graph-up-arrow', 24)}</div>
                <div class="metric-label">ROAS</div>
                <div class="metric-value">${thisROAS.toFixed(2)}x</div>
                <div style="margin-top: 8px;">${getGrowthBadgeNew(roasGrowth)}</div>
            </div>
        </div>

        <!-- Summary Box -->
        <div class="summary-box">
            <h3>${icon('lightbulb-fill', 16)} Summary</h3>
            <p>
                Performa iklan CTLP to Purchase periode ${thisPeriodLabel} menunjukkan 
                <strong>${purchasesGrowth >= 0 ? 'peningkatan' : 'penurunan'} ${Math.abs(purchasesGrowth).toFixed(1)}%</strong> 
                pada Purchases (${formatNumber(lastPurchases)} → ${formatNumber(thisPurchases)}).
                ${cppGrowth <= 0 ?
                    `<span class="growth-up">CPP membaik ${Math.abs(cppGrowth).toFixed(1)}%</span> (${formatCurrency(lastCPP)} → ${formatCurrency(thisCPP)}).` :
                    `<span class="growth-down">CPP naik ${cppGrowth.toFixed(1)}%</span> yang perlu dioptimasi.`}
                Revenue total <strong>${formatCurrency(thisPurchaseValue)}</strong> dengan ROAS <strong>${thisROAS.toFixed(2)}x</strong>.
            </p>
        </div>

        <!-- Mini Stats -->
        <div class="mini-stats">
            <div class="mini-stat">
                <div class="label">Total Spend</div>
                <div class="value">${formatCurrency(thisSpent)}</div>
            </div>
            <div class="mini-stat">
                <div class="label">Add to Cart</div>
                <div class="value">${formatNumber(thisATC)}</div>
            </div>
            <div class="mini-stat">
                <div class="label">AOV</div>
                <div class="value">${formatCurrency(thisAOV)}</div>
            </div>
            <div class="mini-stat">
                <div class="label">CTR</div>
                <div class="value">${thisCTR.toFixed(2)}%</div>
            </div>
            <div class="mini-stat">
                <div class="label">CPC</div>
                <div class="value">${formatCurrency(thisCPC)}</div>
            </div>
            <div class="mini-stat">
                <div class="label">Reach</div>
                <div class="value">${formatNumber(thisReach)}</div>
            </div>
        </div>
    </div>

    <!-- SLIDE 3: FUNNEL ANALYSIS -->
    <div class="slide" data-slide="${++slideNumber}">
        <div class="slide-header">
            <img src="${LOGO_URL}" alt="Logo" class="logo">
            <span class="slide-number">Slide ${slideNumber}</span>
        </div>

        <div class="slide-title">
            <h1>${icon('funnel-fill')} Funnel Analysis</h1>
            <p>Customer Journey dari Impression ke Purchase</p>
        </div>

        <!-- Funnel Visualization -->
        <div class="funnel-container">
            <div class="funnel-step" style="border-color: var(--primary); background: var(--primary-light);">
                <div class="step-label">${icon('eye', 14)} Impressions</div>
                <div class="step-value">${formatNumber(thisImpr)}</div>
                ${getGrowthBadgeNew(imprGrowth)}
            </div>

            <div class="funnel-arrow">
                ${icon('arrow-right', 28)}
                <div class="rate">CTR: ${thisCTR.toFixed(2)}%</div>
            </div>

            <div class="funnel-step" style="border-color: var(--warning); background: var(--warning-light);">
                <div class="step-label">${icon('hand-index-thumb', 14)} Link Clicks</div>
                <div class="step-value">${formatNumber(thisLinkClicks)}</div>
                ${getGrowthBadgeNew(linkClicksGrowth)}
            </div>

            <div class="funnel-arrow">
                ${icon('arrow-right', 28)}
                <div class="rate" style="background: var(--primary-light); color: var(--primary);">CV: ${thisLCtoCV.toFixed(1)}%</div>
            </div>

            <div class="funnel-step">
                <div class="step-label">${icon('cart-plus', 14)} Add to Cart</div>
                <div class="step-value">${formatNumber(thisATC)}</div>
                ${getGrowthBadgeNew(atcGrowth)}
            </div>

            <div class="funnel-arrow">
                ${icon('arrow-right', 28)}
                <div class="rate" style="background: var(--success-light); color: var(--success);">Conv: ${thisATCtoPurchase.toFixed(1)}%</div>
            </div>

            <div class="funnel-step" style="border-color: var(--success); background: var(--success-light);">
                <div class="step-label">${icon('bag-check-fill', 14)} Purchases</div>
                <div class="step-value">${formatNumber(thisPurchases)}</div>
                ${getGrowthBadgeNew(purchasesGrowth)}
            </div>
        </div>

        <!-- Funnel Metrics Table -->
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Funnel Stage</th>
                        <th>${lastPeriodLabel}</th>
                        <th>${thisPeriodLabel}</th>
                        <th>Change</th>
                        <th>Growth</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>${icon('eye', 14)} Impressions</strong></td>
                        <td>${formatNumber(lastImpr)}</td>
                        <td>${formatNumber(thisImpr)}</td>
                        <td>${thisImpr - lastImpr >= 0 ? '+' : ''}${formatNumber(thisImpr - lastImpr)}</td>
                        <td>${getGrowthBadgeNew(imprGrowth)}</td>
                    </tr>
                    <tr>
                        <td><strong>${icon('hand-index-thumb', 14)} Link Clicks</strong></td>
                        <td>${formatNumber(lastLinkClicks)}</td>
                        <td>${formatNumber(thisLinkClicks)}</td>
                        <td>${thisLinkClicks - lastLinkClicks >= 0 ? '+' : ''}${formatNumber(thisLinkClicks - lastLinkClicks)}</td>
                        <td>${getGrowthBadgeNew(linkClicksGrowth)}</td>
                    </tr>
                    <tr>
                        <td><strong>${icon('file-earmark-text', 14)} Content Views</strong></td>
                        <td>${formatNumber(lastCV)}</td>
                        <td>${formatNumber(thisCV)}</td>
                        <td>${thisCV - lastCV >= 0 ? '+' : ''}${formatNumber(thisCV - lastCV)}</td>
                        <td>${getGrowthBadgeNew(cvGrowth)}</td>
                    </tr>
                    <tr>
                        <td><strong>${icon('cart-plus', 14)} Add to Cart</strong></td>
                        <td>${formatNumber(lastATC)}</td>
                        <td>${formatNumber(thisATC)}</td>
                        <td>${thisATC - lastATC >= 0 ? '+' : ''}${formatNumber(thisATC - lastATC)}</td>
                        <td>${getGrowthBadgeNew(atcGrowth)}</td>
                    </tr>
                    <tr class="highlight">
                        <td><strong>${icon('bag-check-fill', 14)} Purchases</strong></td>
                        <td>${formatNumber(lastPurchases)}</td>
                        <td>${formatNumber(thisPurchases)}</td>
                        <td>${thisPurchases - lastPurchases >= 0 ? '+' : ''}${formatNumber(thisPurchases - lastPurchases)}</td>
                        <td>${getGrowthBadgeNew(purchasesGrowth)}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="info-box">
            <h4>${icon('info-circle-fill', 14)} Funnel Insight</h4>
            <p>
                Overall Conversion Rate (LC → Purchase): <strong>${thisConvRate.toFixed(2)}%</strong>.
                ${thisATCtoPurchase < 50 ? `Cart abandonment rate ${(100 - thisATCtoPurchase).toFixed(1)}% - perlu optimasi checkout flow.` : `Checkout rate ${thisATCtoPurchase.toFixed(1)}% tergolong baik.`}
            </p>
        </div>
    </div>

    <!-- SLIDE 4: DETAILED METRICS -->
    <div class="slide" data-slide="${++slideNumber}">
        <div class="slide-header">
            <img src="${LOGO_URL}" alt="Logo" class="logo">
            <span class="slide-number">Slide ${slideNumber}</span>
        </div>

        <div class="slide-title">
            <h1>${icon('table')} Detailed Metrics</h1>
            <p>Complete ${comparisonLabel} Comparison</p>
        </div>

        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Metric</th>
                        <th>${lastPeriodLabel}</th>
                        <th>${thisPeriodLabel}</th>
                        <th>Change</th>
                        <th>Growth</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="background: var(--gray-50);"><td colspan="5"><strong>Spend & Cost</strong></td></tr>
                    <tr>
                        <td>Amount Spent</td>
                        <td>${formatCurrency(lastSpent)}</td>
                        <td>${formatCurrency(thisSpent)}</td>
                        <td>${thisSpent - lastSpent >= 0 ? '+' : ''}${formatCurrency(thisSpent - lastSpent)}</td>
                        <td>${getGrowthBadgeNew(spendGrowth, true)}</td>
                    </tr>
                    <tr>
                        <td>CPC</td>
                        <td>${formatCurrency(lastCPC)}</td>
                        <td>${formatCurrency(thisCPC)}</td>
                        <td>${thisCPC - lastCPC >= 0 ? '+' : ''}${formatCurrency(thisCPC - lastCPC)}</td>
                        <td>${getGrowthBadgeNew(cpcGrowth, true)}</td>
                    </tr>
                    <tr>
                        <td>CPM</td>
                        <td>${formatCurrency(lastCPM)}</td>
                        <td>${formatCurrency(thisCPM)}</td>
                        <td>${thisCPM - lastCPM >= 0 ? '+' : ''}${formatCurrency(thisCPM - lastCPM)}</td>
                        <td>${getGrowthBadgeNew(cpmGrowth, true)}</td>
                    </tr>
                    <tr style="background: var(--gray-50);"><td colspan="5"><strong>Traffic</strong></td></tr>
                    <tr>
                        <td>Reach</td>
                        <td>${formatNumber(lastReach)}</td>
                        <td>${formatNumber(thisReach)}</td>
                        <td>${thisReach - lastReach >= 0 ? '+' : ''}${formatNumber(thisReach - lastReach)}</td>
                        <td>${getGrowthBadgeNew(reachGrowth)}</td>
                    </tr>
                    <tr>
                        <td>Impressions</td>
                        <td>${formatNumber(lastImpr)}</td>
                        <td>${formatNumber(thisImpr)}</td>
                        <td>${thisImpr - lastImpr >= 0 ? '+' : ''}${formatNumber(thisImpr - lastImpr)}</td>
                        <td>${getGrowthBadgeNew(imprGrowth)}</td>
                    </tr>
                    <tr>
                        <td>CTR</td>
                        <td>${formatPercent(lastCTR)}</td>
                        <td>${formatPercent(thisCTR)}</td>
                        <td>${(thisCTR - lastCTR).toFixed(2)}%</td>
                        <td>${getGrowthBadgeNew(ctrGrowth)}</td>
                    </tr>
                    <tr>
                        <td>Frequency</td>
                        <td>${lastFrequency.toFixed(2)}</td>
                        <td>${thisFrequency.toFixed(2)}</td>
                        <td>${(thisFrequency - lastFrequency).toFixed(2)}</td>
                        <td>${getGrowthBadgeNew(freqGrowth, true)}</td>
                    </tr>
                    <tr style="background: var(--gray-50);"><td colspan="5"><strong>E-Commerce</strong></td></tr>
                    <tr>
                        <td>Add to Cart</td>
                        <td>${formatNumber(lastATC)}</td>
                        <td>${formatNumber(thisATC)}</td>
                        <td>${thisATC - lastATC >= 0 ? '+' : ''}${formatNumber(thisATC - lastATC)}</td>
                        <td>${getGrowthBadgeNew(atcGrowth)}</td>
                    </tr>
                    <tr>
                        <td>Cost per ATC</td>
                        <td>${formatCurrency(lastCPATC)}</td>
                        <td>${formatCurrency(thisCPATC)}</td>
                        <td>${thisCPATC - lastCPATC >= 0 ? '+' : ''}${formatCurrency(thisCPATC - lastCPATC)}</td>
                        <td>${getGrowthBadgeNew(cpatcGrowth, true)}</td>
                    </tr>
                    <tr class="highlight">
                        <td><strong>Purchases</strong></td>
                        <td><strong>${formatNumber(lastPurchases)}</strong></td>
                        <td><strong>${formatNumber(thisPurchases)}</strong></td>
                        <td><strong>${thisPurchases - lastPurchases >= 0 ? '+' : ''}${formatNumber(thisPurchases - lastPurchases)}</strong></td>
                        <td>${getGrowthBadgeNew(purchasesGrowth)}</td>
                    </tr>
                    <tr class="highlight">
                        <td><strong>Cost per Purchase</strong></td>
                        <td><strong>${formatCurrency(lastCPP)}</strong></td>
                        <td><strong>${formatCurrency(thisCPP)}</strong></td>
                        <td><strong>${thisCPP - lastCPP >= 0 ? '+' : ''}${formatCurrency(thisCPP - lastCPP)}</strong></td>
                        <td>${getGrowthBadgeNew(cppGrowth, true)}</td>
                    </tr>
                    <tr style="background: var(--gray-50);"><td colspan="5"><strong>Revenue</strong></td></tr>
                    <tr class="highlight">
                        <td><strong>Revenue</strong></td>
                        <td><strong>${formatCurrency(lastPurchaseValue)}</strong></td>
                        <td><strong>${formatCurrency(thisPurchaseValue)}</strong></td>
                        <td><strong>${thisPurchaseValue - lastPurchaseValue >= 0 ? '+' : ''}${formatCurrency(thisPurchaseValue - lastPurchaseValue)}</strong></td>
                        <td>${getGrowthBadgeNew(revenueGrowth)}</td>
                    </tr>
                    <tr>
                        <td><strong>ROAS</strong></td>
                        <td><strong>${lastROAS.toFixed(2)}x</strong></td>
                        <td><strong>${thisROAS.toFixed(2)}x</strong></td>
                        <td><strong>${(thisROAS - lastROAS).toFixed(2)}x</strong></td>
                        <td>${getGrowthBadgeNew(roasGrowth)}</td>
                    </tr>
                    <tr>
                        <td>AOV</td>
                        <td>${formatCurrency(lastAOV)}</td>
                        <td>${formatCurrency(thisAOV)}</td>
                        <td>${thisAOV - lastAOV >= 0 ? '+' : ''}${formatCurrency(thisAOV - lastAOV)}</td>
                        <td>${getGrowthBadgeNew(aovGrowth)}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <!-- SLIDE 5: HIGHLIGHTS & LOWLIGHTS -->
    <div class="slide" data-slide="${++slideNumber}">
        <div class="slide-header">
            <img src="${LOGO_URL}" alt="Logo" class="logo">
            <span class="slide-number">Slide ${slideNumber}</span>
        </div>

        <div class="slide-title">
            <h1>${icon('clipboard-data')} Performance Analysis</h1>
            <p>Highlights & Areas for Improvement</p>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
            <!-- Highlights -->
            <div class="highlight-box success">
                <h3>${icon('arrow-up-circle-fill', 18)} Highlights</h3>
                
                ${purchasesGrowth > 0 ? `
                <div class="highlight-item">
                    <i class="bi bi-check-circle-fill" style="color: var(--success);"></i>
                    <div>
                        <strong>Pertumbuhan Purchases +${purchasesGrowth.toFixed(1)}%</strong>
                        <p>Meningkat dari ${formatNumber(lastPurchases)} → ${formatNumber(thisPurchases)} purchases</p>
                    </div>
                </div>
                ` : ''}
                
                ${revenueGrowth > 0 ? `
                <div class="highlight-item">
                    <i class="bi bi-check-circle-fill" style="color: var(--success);"></i>
                    <div>
                        <strong>Revenue Meningkat +${revenueGrowth.toFixed(1)}%</strong>
                        <p>Total revenue ${formatCurrency(thisPurchaseValue)} dari ${formatNumber(thisPurchases)} transaksi</p>
                    </div>
                </div>
                ` : ''}
                
                ${cppGrowth < 0 ? `
                <div class="highlight-item">
                    <i class="bi bi-check-circle-fill" style="color: var(--success);"></i>
                    <div>
                        <strong>CPP Lebih Efisien ${Math.abs(cppGrowth).toFixed(1)}%</strong>
                        <p>Turun dari ${formatCurrency(lastCPP)} → ${formatCurrency(thisCPP)}</p>
                    </div>
                </div>
                ` : ''}
                
                ${thisROAS >= 2 ? `
                <div class="highlight-item">
                    <i class="bi bi-check-circle-fill" style="color: var(--success);"></i>
                    <div>
                        <strong>ROAS ${thisROAS.toFixed(2)}x Profitable</strong>
                        <p>Sudah mencapai target profitabilitas (min 2x)</p>
                    </div>
                </div>
                ` : ''}
                
                ${thisCTR > 0.5 ? `
                <div class="highlight-item">
                    <i class="bi bi-check-circle-fill" style="color: var(--success);"></i>
                    <div>
                        <strong>CTR Kuat ${thisCTR.toFixed(2)}%</strong>
                        <p>Creative iklan menarik dengan engagement rate tinggi</p>
                    </div>
                </div>
                ` : ''}
                
                ${thisATCtoPurchase >= 50 ? `
                <div class="highlight-item">
                    <i class="bi bi-check-circle-fill" style="color: var(--success);"></i>
                    <div>
                        <strong>Conversion Rate Baik ${thisATCtoPurchase.toFixed(1)}%</strong>
                        <p>${formatNumber(thisATC)} ATC → ${formatNumber(thisPurchases)} purchases</p>
                    </div>
                </div>
                ` : ''}
                
                <!-- Default item jika tidak ada kondisi terpenuhi -->
                <div class="highlight-item" style="${purchasesGrowth <= 0 && revenueGrowth <= 0 && cppGrowth >= 0 && thisROAS < 2 && thisCTR <= 0.5 && thisATCtoPurchase < 50 ? '' : 'display: none;'}">
                    <i class="bi bi-check-circle-fill" style="color: var(--success);"></i>
                    <div>
                        <strong>Performa Konsisten</strong>
                        <p>Total ${formatNumber(thisPurchases)} purchases dengan spending ${formatCurrency(thisSpent)}</p>
                    </div>
                </div>
            </div>

            <!-- Lowlights / Areas for Improvement -->
            <div class="highlight-box danger">
                <h3>${icon('arrow-down-circle-fill', 18)} Areas for Improvement</h3>
                
                ${cppGrowth > 0 ? `
                <div class="highlight-item">
                    <i class="bi bi-x-circle-fill" style="color: var(--danger);"></i>
                    <div>
                        <strong>CPP Meningkat +${cppGrowth.toFixed(1)}%</strong>
                        <p>Naik dari ${formatCurrency(lastCPP)} → ${formatCurrency(thisCPP)}, perlu optimasi</p>
                    </div>
                </div>
                ` : ''}
                
                ${purchasesGrowth < 0 ? `
                <div class="highlight-item">
                    <i class="bi bi-x-circle-fill" style="color: var(--danger);"></i>
                    <div>
                        <strong>Penurunan Purchases ${Math.abs(purchasesGrowth).toFixed(1)}%</strong>
                        <p>Turun dari ${formatNumber(lastPurchases)} → ${formatNumber(thisPurchases)}, kemungkinan audience fatigue</p>
                    </div>
                </div>
                ` : ''}
                
                ${thisROAS < 2 ? `
                <div class="highlight-item">
                    <i class="bi bi-exclamation-triangle-fill" style="color: var(--warning);"></i>
                    <div>
                        <strong>ROAS ${thisROAS.toFixed(2)}x Di Bawah Target</strong>
                        <p>Target ROAS minimal 2x untuk profitabilitas</p>
                    </div>
                </div>
                ` : ''}
                
                ${thisATCtoPurchase < 50 ? `
                <div class="highlight-item">
                    <i class="bi bi-exclamation-triangle-fill" style="color: var(--warning);"></i>
                    <div>
                        <strong>Cart Abandonment ${(100 - thisATCtoPurchase).toFixed(1)}%</strong>
                        <p>${formatNumber(thisATC)} ATC, hanya ${formatNumber(thisPurchases)} purchase (${thisATCtoPurchase.toFixed(1)}% conv)</p>
                    </div>
                </div>
                ` : ''}
                
                ${thisCTR < 0.3 ? `
                <div class="highlight-item">
                    <i class="bi bi-exclamation-triangle-fill" style="color: var(--warning);"></i>
                    <div>
                        <strong>CTR Rendah ${thisCTR.toFixed(2)}%</strong>
                        <p>Di bawah benchmark, refresh creative dan test format baru</p>
                    </div>
                </div>
                ` : ''}
                
                ${spendGrowth > purchasesGrowth && purchasesGrowth > 0 ? `
                <div class="highlight-item">
                    <i class="bi bi-exclamation-triangle-fill" style="color: var(--warning);"></i>
                    <div>
                        <strong>Diminishing Returns</strong>
                        <p>Spend +${spendGrowth.toFixed(1)}% vs Purchases +${purchasesGrowth.toFixed(1)}%, efisiensi menurun</p>
                    </div>
                </div>
                ` : ''}
                
                <!-- Default item jika tidak ada kondisi terpenuhi -->
                <div class="highlight-item" style="${cppGrowth <= 0 && purchasesGrowth >= 0 && thisROAS >= 2 && thisATCtoPurchase >= 50 && thisCTR >= 0.3 && !(spendGrowth > purchasesGrowth && purchasesGrowth > 0) ? '' : 'display: none;'}">
                    <i class="bi bi-info-circle-fill" style="color: var(--primary);"></i>
                    <div>
                        <strong>Peluang Optimasi</strong>
                        <p>Fokus pada A/B testing creative dan ekspansi audience untuk growth lebih lanjut</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="info-box" style="margin-top: 24px;">
            <h4>${icon('lightbulb-fill', 14)} Rekomendasi</h4>
            <p>
                ${purchasesGrowth > 0 && cppGrowth <= 0 ? 'Performa kuat dengan efisiensi yang meningkat. Lanjutkan scaling audience dan creative terbaik sambil mempertahankan strategi optimasi saat ini. ' : ''}
                ${purchasesGrowth > 0 && cppGrowth > 0 ? 'Pertumbuhan positif namun biaya meningkat. Optimalkan pengeluaran iklan dengan mengalokasikan ulang budget ke segmen terbaik dan testing variasi creative baru. ' : ''}
                ${purchasesGrowth < 0 ? 'Purchases menurun. Perlu tindakan segera: refresh creative iklan, tinjau audience targeting, dan pause ad set yang underperform. ' : ''}
                ${thisROAS < 2 ? 'Fokus pada peningkatan ROAS dengan mengoptimasi targeting audience yang lebih profitable. ' : ''}
                ${thisATCtoPurchase < 50 ? 'Perbaiki checkout flow untuk mengurangi cart abandonment. ' : ''}
            </p>
        </div>
    </div>
`

  // ============ BREAKDOWN SLIDES ============
  
  // Helper function
  const extractMetrics = (item: any) => {
    const purchases = parseNum(item['Purchases with shared items'] || item['Purchases'] || item['Results'] || 0)
    const spent = parseNum(item['Amount spent (IDR)'] || item['Amount Spent'] || 0)
    const revenue = parseNum(item['Purchases conversion value for shared items only'] || item['Purchases conversion value'] || 0)
    const atc = parseNum(item['Adds to cart with shared items'] || item['Adds to cart'] || 0)
    const cpp = purchases > 0 ? spent / purchases : 0
    const roas = spent > 0 ? revenue / spent : 0
    return { purchases, spent, revenue, atc, cpp, roas }
  }

  // AGE BREAKDOWN
  if (ageData.length > 0) {
    const sortedAge = [...ageData].sort((a, b) => extractMetrics(b).purchases - extractMetrics(a).purchases)
    const totalPurchases = sortedAge.reduce((sum, item) => sum + extractMetrics(item).purchases, 0)
    const topAge = sortedAge[0]
    const topAgeMetrics = extractMetrics(topAge)
    const topAgeName = topAge?.Age || topAge?.age || 'N/A'
    const topAgeShare = totalPurchases > 0 ? (topAgeMetrics.purchases / totalPurchases) * 100 : 0
    const topAgeClicks = parseNum(topAge?.['Link clicks'] || topAge?.['Clicks (all)'] || 0)

    html += `
    <div class="slide" data-slide="${++slideNumber}">
        <div class="slide-header">
            <img src="${LOGO_URL}" alt="Logo" class="logo">
            <span class="slide-number">Slide ${slideNumber}</span>
        </div>

        <div class="slide-title">
            <h1>${icon('person-fill')} Purchase by Age</h1>
            <p>Demographic Performance Analysis</p>
        </div>

        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Age</th>
                        <th>Purchases</th>
                        <th>% Share</th>
                        <th>Spent</th>
                        <th>CPP</th>
                        <th>ROAS</th>
                    </tr>
                </thead>
                <tbody>
                    ${sortedAge.slice(0, 8).map((item, idx) => {
                      const m = extractMetrics(item)
                      const share = totalPurchases > 0 ? (m.purchases / totalPurchases) * 100 : 0
                      return `
                      <tr ${idx === 0 ? 'class="highlight"' : ''}>
                          <td><strong>${item.Age || item.age || 'N/A'}</strong></td>
                          <td>${formatNumber(m.purchases)}</td>
                          <td>${share.toFixed(1)}%</td>
                          <td>${formatCurrency(m.spent)}</td>
                          <td>${formatCurrency(m.cpp)}</td>
                          <td class="${m.roas >= 2 ? 'growth-up' : m.roas < 1 ? 'growth-down' : ''}">${m.roas.toFixed(2)}x</td>
                      </tr>`
                    }).join('')}
                </tbody>
            </table>
        </div>

        <!-- Key Insight Box -->
        <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); padding: 24px; border-radius: 16px; border-left: 5px solid var(--primary); margin-top: 24px;">
            <h4 style="color: var(--primary); font-size: 14px; font-weight: 700; margin-bottom: 12px;">${icon('lightbulb-fill', 14)} Key Insight</h4>
            <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px;">
                <li style="font-size: 13px; color: var(--gray-700);">• <strong style="color: var(--primary);">${topAgeName}</strong> menyumbang <strong style="color: var(--primary);">${topAgeShare.toFixed(1)}%</strong> total Purchase (<strong style="color: var(--primary);">${formatNumber(topAgeMetrics.purchases)} Purchase</strong>) dengan Cost/Purchase <strong style="color: ${topAgeMetrics.cpp <= thisCPP ? 'var(--success)' : 'var(--danger)'};">${formatCurrency(topAgeMetrics.cpp)}</strong>.</li>
                <li style="font-size: 13px; color: var(--gray-700);">• Outbound clicks dari ${topAgeName}: <strong style="color: var(--primary);">${formatNumber(topAgeClicks)}</strong> menunjukkan tingkat engagement yang ${topAgeClicks > 500 ? 'kuat' : topAgeClicks > 200 ? 'sedang' : 'perlu ditingkatkan'}.</li>
                <li style="font-size: 13px; color: var(--gray-700);">• ${sortedAge.length > 2 ? 'Multiple age segments aktif menunjukkan diversifikasi audience.' : 'Segment tunggal mendominasi seluruh hasil.'}</li>
            </ul>
        </div>

        <!-- Recommendation Box -->
        <div style="background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); padding: 20px 24px; border-radius: 12px; border-left: 5px solid #d97706; margin-top: 16px;">
            <h4 style="color: #d97706; font-size: 13px; font-weight: 700; margin-bottom: 8px;">${icon('star-fill', 12)} Rekomendasi</h4>
            <p style="font-size: 13px; color: var(--gray-700); margin: 0;">Fokus optimasi penuh di age group <strong style="color: var(--primary);">${topAgeName}</strong> (format, placement, dan CTA). Age group lain bisa dijadikan eksperimen untuk diversifikasi.</p>
        </div>
    </div>`
  }

  // GENDER BREAKDOWN
  if (genderData.length > 0) {
    const sortedGender = [...genderData].sort((a, b) => extractMetrics(b).purchases - extractMetrics(a).purchases)
    const totalGenderPurchases = sortedGender.reduce((sum, item) => sum + extractMetrics(item).purchases, 0)
    const topGender = sortedGender[0]
    const topGenderMetrics = extractMetrics(topGender)
    const topGenderName = topGender?.Gender || topGender?.gender || 'N/A'
    const topGenderShare = totalGenderPurchases > 0 ? (topGenderMetrics.purchases / totalGenderPurchases) * 100 : 0
    const topGenderClicks = parseNum(topGender?.['Link clicks'] || topGender?.['Clicks (all)'] || 0)

    html += `
    <div class="slide" data-slide="${++slideNumber}">
        <div class="slide-header">
            <img src="${LOGO_URL}" alt="Logo" class="logo">
            <span class="slide-number">Slide ${slideNumber}</span>
        </div>

        <div class="slide-title">
            <h1>${icon('gender-ambiguous')} Purchase by Gender</h1>
            <p>Gender Performance Comparison</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(${Math.min(genderData.length, 3)}, 1fr); gap: 24px;">
            ${sortedGender.map((item, idx) => {
              const m = extractMetrics(item)
              const genderIcon = (item.Gender || item.gender || '').toLowerCase().includes('female') ? 'gender-female' : 'gender-male'
              return `
              <div class="card" style="text-align: center; ${idx === 0 ? 'border: 2px solid var(--primary);' : ''}">
                  <div class="metric-icon ${idx === 0 ? 'blue' : ''}" style="${idx !== 0 ? 'background: var(--gray-100); color: var(--gray-600);' : ''}">
                      ${icon(genderIcon, 28)}
                  </div>
                  <div class="metric-label">${item.Gender || item.gender || 'N/A'}</div>
                  <div class="metric-value">${formatNumber(m.purchases)}</div>
                  <p style="font-size: 12px; color: var(--gray-500); margin: 8px 0;">Purchases</p>
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--gray-100);">
                      <div>
                          <div style="font-size: 10px; color: var(--gray-500);">CPP</div>
                          <div style="font-size: 14px; font-weight: 600;">${formatCurrency(m.cpp)}</div>
                      </div>
                      <div>
                          <div style="font-size: 10px; color: var(--gray-500);">ROAS</div>
                          <div style="font-size: 14px; font-weight: 600; ${m.roas >= 2 ? 'color: var(--success);' : m.roas < 1 ? 'color: var(--danger);' : ''}">${m.roas.toFixed(2)}x</div>
                      </div>
                  </div>
              </div>`
            }).join('')}
        </div>

        <!-- Key Insight Box -->
        <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); padding: 24px; border-radius: 16px; border-left: 5px solid var(--primary); margin-top: 24px;">
            <h4 style="color: var(--primary); font-size: 14px; font-weight: 700; margin-bottom: 12px;">${icon('lightbulb-fill', 14)} Key Insight</h4>
            <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px;">
                <li style="font-size: 13px; color: var(--gray-700);">• <strong style="color: var(--primary);">${topGenderName}</strong> menyumbang <strong style="color: var(--primary);">${topGenderShare.toFixed(1)}%</strong> total Purchase (<strong style="color: var(--primary);">${formatNumber(topGenderMetrics.purchases)} Purchase</strong>) dengan Cost/Purchase <strong style="color: ${topGenderMetrics.cpp <= thisCPP ? 'var(--success)' : 'var(--danger)'};">${formatCurrency(topGenderMetrics.cpp)}</strong>.</li>
                <li style="font-size: 13px; color: var(--gray-700);">• Outbound clicks dari ${topGenderName}: <strong style="color: var(--primary);">${formatNumber(topGenderClicks)}</strong> menunjukkan tingkat engagement yang ${topGenderClicks > 500 ? 'kuat' : topGenderClicks > 200 ? 'sedang' : 'perlu ditingkatkan'}.</li>
                <li style="font-size: 13px; color: var(--gray-700);">• ${sortedGender.length > 1 ? 'Dual gender targeting aktif menunjukkan diversifikasi audience.' : 'Gender tunggal mendominasi seluruh hasil.'}</li>
            </ul>
        </div>

        <!-- Recommendation Box -->
        <div style="background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); padding: 20px 24px; border-radius: 12px; border-left: 5px solid #d97706; margin-top: 16px;">
            <h4 style="color: #d97706; font-size: 13px; font-weight: 700; margin-bottom: 8px;">${icon('star-fill', 12)} Rekomendasi</h4>
            <p style="font-size: 13px; color: var(--gray-700); margin: 0;">Fokus optimasi penuh di <strong style="color: var(--primary);">${topGenderName}</strong> (format, placement, dan CTA). Gender lain bisa dijadikan eksperimen untuk diversifikasi.</p>
        </div>
    </div>`
  }

  // REGION BREAKDOWN
  if (regionData.length > 0) {
    const sortedRegion = [...regionData].sort((a, b) => {
      const spentA = parseNum(a['Amount spent (IDR)'] || a['Amount Spent'] || 0)
      const spentB = parseNum(b['Amount spent (IDR)'] || b['Amount Spent'] || 0)
      return spentB - spentA
    })
    const topRegion = sortedRegion[0]
    const topRegionName = topRegion?.Region || topRegion?.region || 'N/A'
    const topRegionSpent = parseNum(topRegion?.['Amount spent (IDR)'] || topRegion?.['Amount Spent'] || 0)
    const topRegionReach = parseNum(topRegion?.['Reach'] || 0)
    const topRegionImpr = parseNum(topRegion?.['Impressions'] || 0)
    const topRegionClicks = parseNum(topRegion?.['Link clicks'] || topRegion?.['Clicks (all)'] || 0)
    const topRegionCTR = topRegionImpr > 0 ? (topRegionClicks / topRegionImpr) * 100 : 0

    html += `
    <div class="slide" data-slide="${++slideNumber}">
        <div class="slide-header">
            <img src="${LOGO_URL}" alt="Logo" class="logo">
            <span class="slide-number">Slide ${slideNumber}</span>
        </div>

        <div class="slide-title">
            <h1>${icon('geo-alt-fill')} Purchase by Region</h1>
            <p>Geographic Performance Analysis</p>
        </div>

        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Region</th>
                        <th>Spent</th>
                        <th>Reach</th>
                        <th>Impressions</th>
                        <th>Link Click</th>
                        <th>CTR</th>
                    </tr>
                </thead>
                <tbody>
                    ${sortedRegion.slice(0, 10).map((item, idx) => {
                      const spent = parseNum(item['Amount spent (IDR)'] || item['Amount Spent'] || 0)
                      const reach = parseNum(item['Reach'] || 0)
                      const impressions = parseNum(item['Impressions'] || 0)
                      const linkClicks = parseNum(item['Link clicks'] || item['Clicks (all)'] || 0)
                      const ctr = impressions > 0 ? (linkClicks / impressions) * 100 : 0
                      return `
                      <tr ${idx < 3 ? 'class="highlight"' : ''}>
                          <td><strong>${item.Region || item.region || 'N/A'}</strong></td>
                          <td>${formatCurrency(spent)}</td>
                          <td>${formatNumber(reach)}</td>
                          <td>${formatNumber(impressions)}</td>
                          <td>${formatNumber(linkClicks)}</td>
                          <td class="${ctr >= 1 ? 'growth-up' : ctr < 0.5 ? 'growth-down' : ''}">${ctr.toFixed(2)}%</td>
                      </tr>`
                    }).join('')}
                </tbody>
            </table>
        </div>

        <!-- Key Insight Box -->
        <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); padding: 24px; border-radius: 16px; border-left: 5px solid var(--primary); margin-top: 24px;">
            <h4 style="color: var(--primary); font-size: 14px; font-weight: 700; margin-bottom: 12px;">${icon('lightbulb-fill', 14)} Key Insight</h4>
            <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px;">
                <li style="font-size: 13px; color: var(--gray-700);">• <strong style="color: var(--primary);">${topRegionName}</strong> memiliki spend tertinggi <strong style="color: var(--primary);">${formatCurrency(topRegionSpent)}</strong> dengan reach <strong style="color: var(--primary);">${formatNumber(topRegionReach)}</strong>.</li>
                <li style="font-size: 13px; color: var(--gray-700);">• Link clicks dari ${topRegionName}: <strong style="color: var(--primary);">${formatNumber(topRegionClicks)}</strong> dengan CTR <strong style="color: ${topRegionCTR >= 1 ? 'var(--success)' : 'var(--danger)'};">${topRegionCTR.toFixed(2)}%</strong>.</li>
                <li style="font-size: 13px; color: var(--gray-700);">• ${sortedRegion.length > 3 ? 'Multiple regions aktif menunjukkan diversifikasi geografis yang baik.' : 'Beberapa region mendominasi hasil.'}</li>
            </ul>
        </div>

        <!-- Recommendation Box -->
        <div style="background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); padding: 20px 24px; border-radius: 12px; border-left: 5px solid #d97706; margin-top: 16px;">
            <h4 style="color: #d97706; font-size: 13px; font-weight: 700; margin-bottom: 8px;">${icon('star-fill', 12)} Rekomendasi</h4>
            <p style="font-size: 13px; color: var(--gray-700); margin: 0;">Fokus optimasi penuh di <strong style="color: var(--primary);">${topRegionName}</strong> (format, placement, dan CTA). Region lain bisa dijadikan eksperimen untuk diversifikasi.</p>
        </div>
    </div>`
  }

  // PLATFORM BREAKDOWN
  if (platformData.length > 0) {
    const sortedPlatform = [...platformData].sort((a, b) => extractMetrics(b).purchases - extractMetrics(a).purchases)
    const totalPlatformPurchases = sortedPlatform.reduce((sum, item) => sum + extractMetrics(item).purchases, 0)
    const topPlatform = sortedPlatform[0]
    const topPlatformMetrics = extractMetrics(topPlatform)
    const topPlatformName = (topPlatform?.Platform || topPlatform?.platform || 'N/A').toLowerCase()
    const topPlatformShare = totalPlatformPurchases > 0 ? (topPlatformMetrics.purchases / totalPlatformPurchases) * 100 : 0
    const topPlatformClicks = parseNum(topPlatform?.['Link clicks'] || topPlatform?.['Clicks (all)'] || 0)

    html += `
    <div class="slide" data-slide="${++slideNumber}">
        <div class="slide-header">
            <img src="${LOGO_URL}" alt="Logo" class="logo">
            <span class="slide-number">Slide ${slideNumber}</span>
        </div>

        <div class="slide-title">
            <h1>${icon('phone-fill')} Purchase by Platform</h1>
            <p>Platform Performance Comparison</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(${Math.min(platformData.length, 4)}, 1fr); gap: 20px;">
            ${sortedPlatform.map((item, idx) => {
              const m = extractMetrics(item)
              const platform = (item.Platform || item.platform || '').toLowerCase()
              const platformIcon = platform.includes('instagram') ? 'instagram' : platform.includes('facebook') ? 'facebook' : 'globe'
              const iconBg = platform.includes('instagram') ? '#fce7f3' : platform.includes('facebook') ? '#e7f3ff' : 'var(--gray-100)'
              const iconColor = platform.includes('instagram') ? '#e4405f' : platform.includes('facebook') ? '#1877f2' : 'var(--gray-600)'
              return `
              <div class="card" style="text-align: center; ${idx === 0 ? 'border: 2px solid var(--primary);' : ''}">
                  <div class="metric-icon" style="background: ${iconBg}; color: ${iconColor};">
                      ${icon(platformIcon, 28)}
                  </div>
                  <div class="metric-label">${item.Platform || item.platform || 'N/A'}</div>
                  <div class="metric-value">${formatNumber(m.purchases)}</div>
                  <p style="font-size: 12px; color: var(--gray-500); margin: 8px 0;">Purchases</p>
                  <div style="font-size: 12px; margin-top: 8px;">
                      <span>CPP: ${formatCurrency(m.cpp)}</span><br>
                      <span style="${m.roas >= 2 ? 'color: var(--success);' : m.roas < 1 ? 'color: var(--danger);' : ''}">ROAS: ${m.roas.toFixed(2)}x</span>
                  </div>
              </div>`
            }).join('')}
        </div>

        <!-- Key Insight Box -->
        <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); padding: 24px; border-radius: 16px; border-left: 5px solid var(--primary); margin-top: 24px;">
            <h4 style="color: var(--primary); font-size: 14px; font-weight: 700; margin-bottom: 12px;">${icon('lightbulb-fill', 14)} Key Insight</h4>
            <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px;">
                <li style="font-size: 13px; color: var(--gray-700);">• <strong style="color: var(--primary);">${topPlatformName}</strong> menyumbang <strong style="color: var(--primary);">${topPlatformShare.toFixed(1)}%</strong> total Purchase (<strong style="color: var(--primary);">${formatNumber(topPlatformMetrics.purchases)} Purchase</strong>) dengan Cost/Purchase <strong style="color: ${topPlatformMetrics.cpp <= thisCPP ? 'var(--success)' : 'var(--danger)'};">${formatCurrency(topPlatformMetrics.cpp)}</strong>.</li>
                <li style="font-size: 13px; color: var(--gray-700);">• Outbound clicks dari ${topPlatformName}: <strong style="color: var(--primary);">${formatNumber(topPlatformClicks)}</strong> menunjukkan tingkat engagement yang ${topPlatformClicks > 500 ? 'kuat' : topPlatformClicks > 200 ? 'sedang' : 'perlu ditingkatkan'}.</li>
                <li style="font-size: 13px; color: var(--gray-700);">• ${sortedPlatform.length > 1 ? 'Platform tunggal mendominasi seluruh hasil.' : 'Single platform strategy aktif.'}</li>
            </ul>
        </div>

        <!-- Recommendation Box -->
        <div style="background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); padding: 20px 24px; border-radius: 12px; border-left: 5px solid #d97706; margin-top: 16px;">
            <h4 style="color: #d97706; font-size: 13px; font-weight: 700; margin-bottom: 8px;">${icon('star-fill', 12)} Rekomendasi</h4>
            <p style="font-size: 13px; color: var(--gray-700); margin: 0;">Fokus optimasi penuh di <strong style="color: var(--primary);">${topPlatformName}</strong> (format, placement, dan CTA). Platform lain bisa dijadikan eksperimen untuk diversifikasi.</p>
        </div>
    </div>`
  }

  // PLACEMENT BREAKDOWN
  if (placementData.length > 0) {
    const sortedPlacement = [...placementData].sort((a, b) => extractMetrics(b).purchases - extractMetrics(a).purchases)
    const totalPlacementPurchases = sortedPlacement.reduce((sum, item) => sum + extractMetrics(item).purchases, 0)
    const topPlacement = sortedPlacement[0]
    const topPlacementMetrics = extractMetrics(topPlacement)
    const topPlacementName = topPlacement?.Placement || topPlacement?.placement || 'N/A'
    const topPlacementShare = totalPlacementPurchases > 0 ? (topPlacementMetrics.purchases / totalPlacementPurchases) * 100 : 0
    const topPlacementClicks = parseNum(topPlacement?.['Link clicks'] || topPlacement?.['Clicks (all)'] || 0)

    html += `
    <div class="slide" data-slide="${++slideNumber}">
        <div class="slide-header">
            <img src="${LOGO_URL}" alt="Logo" class="logo">
            <span class="slide-number">Slide ${slideNumber}</span>
        </div>

        <div class="slide-title">
            <h1>${icon('layout-split')} Purchase by Placement</h1>
            <p>Placement Performance Comparison</p>
        </div>

        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th style="width: 30%;">Placement</th>
                        <th>Purchases</th>
                        <th>Spent</th>
                        <th>CPP</th>
                        <th>ROAS</th>
                    </tr>
                </thead>
                <tbody>
                    ${sortedPlacement.slice(0, 10).map((item, idx) => {
                      const m = extractMetrics(item)
                      const placement = item.Placement || item.placement || 'N/A'
                      return `
                      <tr ${idx < 3 ? 'class="highlight"' : ''}>
                          <td><strong>${placement}</strong></td>
                          <td>${formatNumber(m.purchases)}</td>
                          <td>${formatCurrency(m.spent)}</td>
                          <td>${formatCurrency(m.cpp)}</td>
                          <td class="${m.roas >= 2 ? 'growth-up' : m.roas < 1 ? 'growth-down' : ''}">${m.roas.toFixed(2)}x</td>
                      </tr>`
                    }).join('')}
                </tbody>
            </table>
        </div>

        <!-- Key Insight Box -->
        <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); padding: 24px; border-radius: 16px; border-left: 5px solid var(--primary); margin-top: 24px;">
            <h4 style="color: var(--primary); font-size: 14px; font-weight: 700; margin-bottom: 12px;">${icon('lightbulb-fill', 14)} Key Insight</h4>
            <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px;">
                <li style="font-size: 13px; color: var(--gray-700);">• <strong style="color: var(--primary);">${topPlacementName}</strong> menyumbang <strong style="color: var(--primary);">${topPlacementShare.toFixed(1)}%</strong> total Purchase (<strong style="color: var(--primary);">${formatNumber(topPlacementMetrics.purchases)} Purchase</strong>) dengan Cost/Purchase <strong style="color: ${topPlacementMetrics.cpp <= thisCPP ? 'var(--success)' : 'var(--danger)'};">${formatCurrency(topPlacementMetrics.cpp)}</strong>.</li>
                <li style="font-size: 13px; color: var(--gray-700);">• Outbound clicks dari ${topPlacementName}: <strong style="color: var(--primary);">${formatNumber(topPlacementClicks)}</strong> menunjukkan tingkat engagement yang ${topPlacementClicks > 500 ? 'kuat' : topPlacementClicks > 200 ? 'sedang' : 'perlu ditingkatkan'}.</li>
                <li style="font-size: 13px; color: var(--gray-700);">• ${sortedPlacement.length > 3 ? 'Multiple placements aktif menunjukkan diversifikasi yang baik.' : 'Beberapa placement mendominasi hasil.'}</li>
            </ul>
        </div>

        <!-- Recommendation Box -->
        <div style="background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); padding: 20px 24px; border-radius: 12px; border-left: 5px solid #d97706; margin-top: 16px;">
            <h4 style="color: #d97706; font-size: 13px; font-weight: 700; margin-bottom: 8px;">${icon('star-fill', 12)} Rekomendasi</h4>
            <p style="font-size: 13px; color: var(--gray-700); margin: 0;">Fokus optimasi penuh di <strong style="color: var(--primary);">${topPlacementName}</strong> (format, placement, dan CTA). Placement lain bisa dijadikan eksperimen untuk diversifikasi.</p>
        </div>
    </div>`
  }

  // OBJECTIVE PERFORMANCE SLIDE
  if (objectiveData.length > 0) {
    const sortedObjective = [...objectiveData]
      .filter(item => item['Objective'] || item['objective'])
      .sort((a, b) => {
        const spendA = parseNum(a['Amount spent (IDR)'] || a['Amount Spent'] || 0)
        const spendB = parseNum(b['Amount spent (IDR)'] || b['Amount Spent'] || 0)
        return spendB - spendA
      })

    const totalObjPurchases = sortedObjective.reduce((sum, item) => {
      return sum + parseNum(item['Purchases'] || item['Purchases with shared items'] || item['Results'] || 0)
    }, 0)
    const totalObjSpent = sortedObjective.reduce((sum, item) => {
      return sum + parseNum(item['Amount spent (IDR)'] || item['Amount Spent'] || 0)
    }, 0)
    const totalObjReach = sortedObjective.reduce((sum, item) => {
      return sum + parseNum(item['Reach'] || 0)
    }, 0)

    // Find winner (lowest CPP with significant purchases)
    const objWithCPP = sortedObjective.map(item => {
      const purchases = parseNum(item['Purchases'] || item['Purchases with shared items'] || item['Results'] || 0)
      const spent = parseNum(item['Amount spent (IDR)'] || item['Amount Spent'] || 0)
      const cpp = purchases > 0 ? spent / purchases : Infinity
      return { ...item, calculatedCPP: cpp, calculatedPurchases: purchases }
    }).filter(item => item.calculatedPurchases > 0)

    const winner = objWithCPP.length > 0 ? objWithCPP.reduce((a, b) => a.calculatedCPP < b.calculatedCPP ? a : b) : null
    const winnerName = winner ? (winner['Objective'] || winner['objective'] || 'N/A') : 'N/A'

    html += `
    <div class="slide" data-slide="${++slideNumber}">
        <div class="slide-header">
            <img src="${LOGO_URL}" alt="Logo" class="logo">
            <span class="slide-number">Slide ${slideNumber}</span>
        </div>

        <div class="slide-title">
            <h1>${icon('bullseye')} Objective Performance</h1>
            <p>Performance by Campaign Objective</p>
        </div>

        <div class="table-container">
            <table>
                <thead>
                    <tr style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white;">
                        <th style="padding: 14px 16px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">Objective</th>
                        <th style="padding: 14px 16px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; text-align: center;">Purchases</th>
                        <th style="padding: 14px 16px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; text-align: center;">CPP</th>
                        <th style="padding: 14px 16px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; text-align: center;">Spent</th>
                        <th style="padding: 14px 16px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; text-align: center;">Reach</th>
                        <th style="padding: 14px 16px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; text-align: center;">Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${sortedObjective.map((item, idx) => {
                      const objective = item['Objective'] || item['objective'] || 'Unknown'
                      const purchases = parseNum(item['Purchases'] || item['Purchases with shared items'] || item['Results'] || 0)
                      const spent = parseNum(item['Amount spent (IDR)'] || item['Amount Spent'] || 0)
                      const reach = parseNum(item['Reach'] || 0)
                      const cpp = purchases > 0 ? spent / purchases : 0
                      const isWinner = winner && objective === winnerName && purchases > 0
                      const status = isWinner ? 'Winner' : purchases > 0 ? 'Monitor' : 'Low'
                      const statusColor = isWinner ? 'var(--success)' : purchases > 0 ? 'var(--warning)' : 'var(--gray-400)'
                      const statusBg = isWinner ? 'var(--success-light)' : purchases > 0 ? 'var(--warning-light)' : 'var(--gray-100)'
                      
                      return `
                      <tr style="border-bottom: 1px solid var(--gray-200);">
                          <td style="padding: 14px 16px;">
                              <div style="display: flex; align-items: center; gap: 10px;">
                                  <span style="width: 24px; height: 24px; background: ${isWinner ? 'var(--success)' : 'var(--primary)'}; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700;">${idx + 1}</span>
                                  <strong style="font-size: 13px;">${objective}</strong>
                              </div>
                          </td>
                          <td style="padding: 14px 16px; text-align: center; font-weight: 600;">${formatNumber(purchases)}</td>
                          <td style="padding: 14px 16px; text-align: center;">${formatCurrency(cpp)}</td>
                          <td style="padding: 14px 16px; text-align: center;">${formatCurrency(spent)}</td>
                          <td style="padding: 14px 16px; text-align: center;">${formatNumber(reach)}</td>
                          <td style="padding: 14px 16px; text-align: center;">
                              <span style="display: inline-block; padding: 4px 12px; background: ${statusBg}; color: ${statusColor}; border-radius: 20px; font-size: 11px; font-weight: 600;">${status}</span>
                          </td>
                      </tr>`
                    }).join('')}
                    <tr style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); font-weight: 700;">
                        <td style="padding: 14px 16px; color: white;"><strong>TOTAL</strong></td>
                        <td style="padding: 14px 16px; text-align: center; color: white;">${formatNumber(totalObjPurchases)}</td>
                        <td style="padding: 14px 16px; text-align: center; color: white;">${formatCurrency(totalObjPurchases > 0 ? totalObjSpent / totalObjPurchases : 0)}</td>
                        <td style="padding: 14px 16px; text-align: center; color: white;">${formatCurrency(totalObjSpent)}</td>
                        <td style="padding: 14px 16px; text-align: center; color: white;">${formatNumber(totalObjReach)}</td>
                        <td style="padding: 14px 16px;"></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Key Insight Box -->
        <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); padding: 24px; border-radius: 16px; border-left: 5px solid var(--primary); margin-top: 24px;">
            <h4 style="color: var(--primary); font-size: 14px; font-weight: 700; margin-bottom: 12px;">${icon('lightbulb-fill', 14)} Key Insight</h4>
            <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px;">
                ${sortedObjective.slice(0, 2).map(item => {
                  const objective = item['Objective'] || item['objective'] || 'Unknown'
                  const purchases = parseNum(item['Purchases'] || item['Purchases with shared items'] || item['Results'] || 0)
                  const spent = parseNum(item['Amount spent (IDR)'] || item['Amount Spent'] || 0)
                  const cpp = purchases > 0 ? spent / purchases : 0
                  return `<li style="font-size: 13px; color: var(--gray-700);">• Objective <strong style="color: var(--primary);">${objective}</strong> menghasilkan <strong style="color: var(--primary);">${formatNumber(purchases)} Purchases</strong> (CPP <strong style="color: ${cpp <= thisCPP ? 'var(--success)' : 'var(--danger)'};">${formatCurrency(cpp)}</strong>).</li>`
                }).join('')}
                <li style="font-size: 13px; color: var(--gray-700);">• Total keseluruhan: <strong style="color: var(--primary);">${formatNumber(totalObjPurchases)} Purchases</strong> dengan spend <strong style="color: var(--primary);">${formatCurrency(totalObjSpent)}</strong>.</li>
            </ul>
        </div>

        <!-- Recommendation Box -->
        <div style="background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); padding: 20px 24px; border-radius: 12px; border-left: 5px solid #d97706; margin-top: 16px;">
            <h4 style="color: #d97706; font-size: 13px; font-weight: 700; margin-bottom: 8px;">${icon('star-fill', 12)} Rekomendasi</h4>
            <p style="font-size: 13px; color: var(--gray-700); margin: 0;">Fokuskan <strong style="color: var(--primary);">70-80% budget</strong> pada objective dengan CPP terendah untuk memaksimalkan konversi. Gunakan objective lainnya dengan <strong style="color: var(--primary);">20-30% budget</strong> untuk awareness dan diversifikasi strategi.</p>
        </div>
    </div>`
  }

  // AD CREATIVE BREAKDOWN
  if (adCreativeData.length > 0) {
    const sortedCreative = [...adCreativeData].sort((a, b) => extractMetrics(b).purchases - extractMetrics(a).purchases)

    html += `
    <div class="slide" data-slide="${++slideNumber}">
        <div class="slide-header">
            <img src="${LOGO_URL}" alt="Logo" class="logo">
            <span class="slide-number">Slide ${slideNumber}</span>
        </div>

        <div class="slide-title">
            <h1>${icon('image-fill')} Top Performing Creatives</h1>
            <p>Ad Creative Performance Analysis</p>
        </div>

        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th style="width: 40%;">Creative</th>
                        <th>Purchases</th>
                        <th>Spent</th>
                        <th>CPP</th>
                        <th>ROAS</th>
                    </tr>
                </thead>
                <tbody>
                    ${sortedCreative.slice(0, 8).map((item, idx) => {
                      const m = extractMetrics(item)
                      const name = item.Ads || item.ads || item['Ad name'] || 'N/A'
                      const displayName = name.length > 50 ? name.substring(0, 47) + '...' : name
                      return `
                      <tr ${idx < 3 ? 'class="highlight"' : ''}>
                          <td title="${name}"><strong>${displayName}</strong></td>
                          <td>${formatNumber(m.purchases)}</td>
                          <td>${formatCurrency(m.spent)}</td>
                          <td>${formatCurrency(m.cpp)}</td>
                          <td class="${m.roas >= 2 ? 'growth-up' : m.roas < 1 ? 'growth-down' : ''}">${m.roas.toFixed(2)}x</td>
                      </tr>`
                    }).join('')}
                </tbody>
            </table>
        </div>

        <!-- Summary Cards -->
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-top: 24px;">
            <div style="text-align: center; padding: 20px; background: white; border: 1px solid var(--gray-200); border-radius: 12px;">
                <div style="font-size: 11px; color: var(--gray-500); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Total Creatives</div>
                <div style="font-size: 28px; font-weight: 800; color: var(--gray-800);">${sortedCreative.length}</div>
            </div>
            <div style="text-align: center; padding: 20px; background: white; border: 1px solid var(--gray-200); border-radius: 12px;">
                <div style="font-size: 11px; color: var(--gray-500); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Total Clicks</div>
                <div style="font-size: 28px; font-weight: 800; color: var(--gray-800);">${formatNumber(sortedCreative.reduce((sum, c) => sum + parseNum(c['Link clicks'] || c['Clicks (all)'] || 0), 0))}</div>
            </div>
            <div style="text-align: center; padding: 20px; background: white; border: 1px solid var(--gray-200); border-radius: 12px;">
                <div style="font-size: 11px; color: var(--gray-500); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Total Spent</div>
                <div style="font-size: 28px; font-weight: 800; color: var(--gray-800);">${formatCurrency(sortedCreative.reduce((sum, c) => sum + extractMetrics(c).spent, 0))}</div>
            </div>
            <div style="text-align: center; padding: 20px; background: white; border: 1px solid var(--gray-200); border-radius: 12px;">
                <div style="font-size: 11px; color: var(--gray-500); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Avg CPP</div>
                <div style="font-size: 28px; font-weight: 800; color: var(--gray-800);">${formatCurrency(sortedCreative.reduce((sum, c) => sum + extractMetrics(c).spent, 0) / Math.max(sortedCreative.reduce((sum, c) => sum + extractMetrics(c).purchases, 0), 1))}</div>
            </div>
        </div>
    </div>`

    // CONTENT PERFORMANCE ANALYSIS SLIDE
    const totalCreativePurchases = sortedCreative.reduce((sum, c) => sum + extractMetrics(c).purchases, 0)
    const avgCPP = sortedCreative.reduce((sum, c) => sum + extractMetrics(c).spent, 0) / Math.max(totalCreativePurchases, 1)

    html += `
    <div class="slide" data-slide="${++slideNumber}">
        <div class="slide-header">
            <img src="${LOGO_URL}" alt="Logo" class="logo">
            <span class="slide-number">Slide ${slideNumber}</span>
        </div>

        <div class="slide-title">
            <h1>${icon('bar-chart-fill')} Content Performance Analysis</h1>
            <p>Top 5 Creatives by Purchase Results</p>
        </div>

        <div style="display: flex; flex-direction: column; gap: 16px;">
            ${sortedCreative.slice(0, 5).map((item, idx) => {
              const m = extractMetrics(item)
              const name = item.Ads || item.ads || item['Ad name'] || 'N/A'
              const displayName = name.length > 40 ? name.substring(0, 37) + '...' : name
              const clicks = parseNum(item['Link clicks'] || item['Clicks (all)'] || 0)
              const impr = parseNum(item['Impressions'] || 0)
              const ctr = impr > 0 ? (clicks / impr) * 100 : 0
              const purchaseShare = totalCreativePurchases > 0 ? (m.purchases / totalCreativePurchases) * 100 : 0
              const isTopPerformer = idx === 0
              const isBelowAvg = m.cpp > avgCPP * 1.2
              
              let recommendation = ''
              if (isTopPerformer) {
                recommendation = 'Paling tinggi volume purchase dengan biaya efisien. <strong>Scale dengan penyesuaian hook</strong> untuk tingkatkan konversi.'
              } else if (m.roas >= 2) {
                recommendation = 'ROAS profitable. <strong>Scale agresif</strong> dan duplikasi ke format lain.'
              } else if (isBelowAvg) {
                recommendation = 'Biaya per purchase lebih tinggi dari rata-rata. <strong>Optimasi copy/visual</strong> atau pertimbangkan pause.'
              } else {
                recommendation = 'Performa stabil. Monitor dan <strong>test variasi</strong> untuk improvement.'
              }
              
              const bgStyle = isTopPerformer ? 'linear-gradient(135deg, #fefce8 0%, #fef9c3 100%)' : 'var(--gray-50)'
              const borderColor = isTopPerformer ? '#eab308' : 'var(--primary)'
              const rankBg = isTopPerformer ? '#eab308' : 'var(--primary)'
              const cppColor = m.cpp <= avgCPP ? 'var(--success)' : 'var(--danger)'
              
              return '<div style="background: ' + bgStyle + '; padding: 20px; border-radius: 16px; border-left: 4px solid ' + borderColor + ';">' +
                  '<div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">' +
                      '<div style="width: 32px; height: 32px; background: ' + rankBg + '; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px;">' + (idx + 1) + '</div>' +
                      '<div style="font-weight: 700; font-size: 15px; color: var(--gray-800);">' + displayName + '</div>' +
                  '</div>' +
                  '<div style="font-size: 13px; color: var(--gray-600); margin-bottom: 8px;">' +
                      '→ <strong style="color: var(--primary);">' + formatNumber(m.purchases) + ' Purchases</strong> / ' + formatNumber(clicks) + ' OC (' + purchaseShare.toFixed(1) + '%), CTR ' + ctr.toFixed(2) + '%, CPP <strong style="color: ' + cppColor + ';">' + formatCurrency(m.cpp) + '</strong>' +
                  '</div>' +
                  '<div style="font-size: 12px; color: var(--gray-500);">' +
                      '→ ' + recommendation +
                  '</div>' +
              '</div>'
            }).join('')}
        </div>
    </div>`
  }

  // KESIMPULAN & REKOMENDASI SLIDE (Final Summary)
  html += `
    <div class="slide" data-slide="${++slideNumber}">
        <div class="slide-header">
            <img src="${LOGO_URL}" alt="Logo" class="logo">
            <span class="slide-number">Slide ${slideNumber}</span>
        </div>

        <div class="slide-title">
            <h1>${icon('clipboard-check-fill')} Kesimpulan & Rekomendasi</h1>
            <p>Summary & Action Items</p>
        </div>

        <!-- Main Conclusion Box -->
        <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); padding: 24px; border-radius: 16px; border-left: 5px solid var(--primary); margin-bottom: 24px;">
            <h4 style="color: var(--primary); font-size: 14px; font-weight: 700; margin-bottom: 12px;">Kesimpulan</h4>
            <p style="font-size: 14px; color: var(--gray-700); margin: 0;">
                Purchases ${purchasesGrowth >= 0 ? `<strong style="color: var(--success);">+${purchasesGrowth.toFixed(1)}%</strong>` : `<strong style="color: var(--danger);">${purchasesGrowth.toFixed(1)}%</strong>`} (${formatNumber(lastPurchases)} → ${formatNumber(thisPurchases)}), CPP ${cppGrowth <= 0 ? `<strong style="color: var(--success);">${cppGrowth.toFixed(1)}%</strong>` : `<strong style="color: var(--danger);">+${cppGrowth.toFixed(1)}%</strong>`} (${formatCurrency(lastCPP)} → ${formatCurrency(thisCPP)}). <strong>${isGoodPerformance ? 'Performa sangat baik. Volume naik dan biaya turun - scaling berhasil.' : 'Perlu optimasi untuk meningkatkan efisiensi campaign.'}</strong>
            </p>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
            <!-- Key Insight Column -->
            <div>
                <h4 style="color: var(--primary); font-size: 14px; font-weight: 700; margin-bottom: 16px;">Key Insight</h4>
                <div style="display: flex; flex-direction: column; gap: 12px;">
                    <div style="background: white; padding: 16px; border-radius: 12px; border: 1px solid var(--gray-200); display: flex; align-items: center; gap: 12px;">
                        <div style="width: 28px; height: 28px; background: var(--primary); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 12px;">1</div>
                        <span style="font-size: 13px; color: var(--gray-700);">Purchases ${purchasesGrowth >= 0 ? 'naik' : 'turun'} <strong style="color: ${purchasesGrowth >= 0 ? 'var(--success)' : 'var(--danger)'};">${Math.abs(purchasesGrowth).toFixed(1)}%</strong> (${formatNumber(lastPurchases)} → ${formatNumber(thisPurchases)})</span>
                    </div>
                    <div style="background: white; padding: 16px; border-radius: 12px; border: 1px solid var(--gray-200); display: flex; align-items: center; gap: 12px;">
                        <div style="width: 28px; height: 28px; background: ${cppGrowth <= 0 ? 'var(--success)' : 'var(--danger)'}; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 12px;">2</div>
                        <span style="font-size: 13px; color: var(--gray-700);">CPP ${cppGrowth <= 0 ? 'membaik' : 'naik'} <strong style="color: ${cppGrowth <= 0 ? 'var(--success)' : 'var(--danger)'};">${Math.abs(cppGrowth).toFixed(1)}%</strong> (${formatCurrency(lastCPP)} → ${formatCurrency(thisCPP)})</span>
                    </div>
                </div>
            </div>

            <!-- Rekomendasi Column -->
            <div>
                <h4 style="color: #d97706; font-size: 14px; font-weight: 700; margin-bottom: 16px;">Rekomendasi</h4>
                <div style="display: flex; flex-direction: column; gap: 12px;">
                    <div style="background: white; padding: 16px; border-radius: 12px; border: 1px solid var(--gray-200); display: flex; align-items: center; gap: 12px;">
                        <div style="width: 28px; height: 28px; background: #d97706; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 12px;">1</div>
                        <span style="font-size: 13px; color: var(--gray-700);">${isGoodPerformance ? 'Pertahankan strategi saat ini, CPP sudah efisien' : 'Optimasi targeting dan creative untuk turunkan CPP'}</span>
                    </div>
                    <div style="background: white; padding: 16px; border-radius: 12px; border: 1px solid var(--gray-200); display: flex; align-items: center; gap: 12px;">
                        <div style="width: 28px; height: 28px; background: #d97706; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 12px;">2</div>
                        <span style="font-size: 13px; color: var(--gray-700);">Duplikasi winning ads untuk pertahankan volume</span>
                    </div>
                    <div style="background: white; padding: 16px; border-radius: 12px; border: 1px solid var(--gray-200); display: flex; align-items: center; gap: 12px;">
                        <div style="width: 28px; height: 28px; background: #d97706; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 12px;">3</div>
                        <span style="font-size: 13px; color: var(--gray-700);">Test 2-3 creative baru per minggu</span>
                    </div>
                    <div style="background: white; padding: 16px; border-radius: 12px; border: 1px solid var(--gray-200); display: flex; align-items: center; gap: 12px;">
                        <div style="width: 28px; height: 28px; background: #d97706; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 12px;">4</div>
                        <span style="font-size: 13px; color: var(--gray-700);">Fokus budget ke placement & platform terbaik</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
`

  // THANK YOU SLIDE
  html += `
    <!-- SLIDE: THANK YOU -->
    <div class="slide thankyou-slide" data-slide="${++slideNumber}">
        <img src="${LOGO_URL}" alt="Logo" style="width: 80px; height: 80px; margin-bottom: 32px; background: white; border-radius: 16px; padding: 12px;">
        
        <h1>Thank You!</h1>
        <p>We appreciate your trust in managing your Meta Ads campaigns</p>
        
        <div class="contact-box">
            <p style="font-size: 16px; font-weight: 600; margin-bottom: 8px;">${icon('chat-square-text-fill', 18)} Questions or Feedback?</p>
            <p>Contact us anytime for campaign consultation</p>
        </div>
        
        <p style="margin-top: 48px; font-size: 12px; opacity: 0.6;">© 2026 Hadona Digital Media. All rights reserved.</p>
    </div>

</body>
</html>`

  console.log('[CTLP to Purchase Template] Report generation complete')
  return html
}

// ============ HELPER FUNCTIONS ============

function getGrowthBadgeNew(growth: number, inverse: boolean = false): string {
  const isPositive = inverse ? growth <= 0 : growth >= 0
  const badgeClass = isPositive ? 'badge-success' : 'badge-danger'
  const iconName = growth >= 0 ? 'arrow-up' : 'arrow-down'
  return `<span class="badge ${badgeClass}"><i class="bi bi-${iconName}"></i> ${Math.abs(growth).toFixed(1)}%</span>`
}
