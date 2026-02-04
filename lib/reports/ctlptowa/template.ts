import { 
  SHARED_CSS, 
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
  const { thisWeek, lastWeek, breakdown, performanceSummary } = analysisData || {}

  const thisWeekData = performanceSummary?.thisWeek || thisWeek || {}
  const lastWeekData = performanceSummary?.lastWeek || lastWeek || {}
  const breakdownThisWeek = breakdown?.thisWeek || {}
  const breakdownLastWeek = breakdown?.lastWeek || {}

  // Labels
  const isMoM = retentionType === 'mom'
  const comparisonLabel = isMoM ? 'Month-over-Month' : 'Week-over-Week'
  const thisPeriodLabel = isMoM ? 'Bulan Ini' : 'Minggu Ini'
  const lastPeriodLabel = isMoM ? 'Bulan Lalu' : 'Minggu Lalu'
  const periodType = isMoM ? 'Month on Month' : 'Week on Week'
  const defaultReportName = reportName || 'Meta Ads Performance Report'

  // Extract metrics
  const thisSpent = parseNum(thisWeekData.amountSpent)
  const lastSpent = parseNum(lastWeekData.amountSpent)
  const thisResults = parseNum(thisWeekData.checkoutsInitiated || thisWeekData.results)
  const lastResults = parseNum(lastWeekData.checkoutsInitiated || lastWeekData.results)
  const thisReach = parseNum(thisWeekData.reach)
  const lastReach = parseNum(lastWeekData.reach)
  const thisImpr = parseNum(thisWeekData.impressions)
  const lastImpr = parseNum(lastWeekData.impressions)
  const thisLinkClicks = parseNum(thisWeekData.linkClicks)
  const lastLinkClicks = parseNum(lastWeekData.linkClicks)
  const thisFrequency = parseNum(thisWeekData.frequency)
  const lastFrequency = parseNum(lastWeekData.frequency)

  // Derived metrics
  const thisCPR = thisResults > 0 ? thisSpent / thisResults : 0
  const lastCPR = lastResults > 0 ? lastSpent / lastResults : 0
  const thisCTR = thisImpr > 0 ? (thisLinkClicks / thisImpr) * 100 : 0
  const lastCTR = lastImpr > 0 ? (lastLinkClicks / lastImpr) * 100 : 0
  const thisCPC = thisLinkClicks > 0 ? thisSpent / thisLinkClicks : 0
  const lastCPC = lastLinkClicks > 0 ? lastSpent / lastLinkClicks : 0
  const thisCPM = thisImpr > 0 ? (thisSpent / thisImpr) * 1000 : 0
  const lastCPM = lastImpr > 0 ? (lastSpent / lastImpr) * 1000 : 0
  const thisConvRate = thisLinkClicks > 0 ? (thisResults / thisLinkClicks) * 100 : 0
  const lastConvRate = lastLinkClicks > 0 ? (lastResults / lastLinkClicks) * 100 : 0

  // Growth calculations
  const spendGrowth = calculateGrowth(thisSpent, lastSpent)
  const reachGrowth = calculateGrowth(thisReach, lastReach)
  const imprGrowth = calculateGrowth(thisImpr, lastImpr)
  const linkClicksGrowth = calculateGrowth(thisLinkClicks, lastLinkClicks)
  const resultsGrowth = calculateGrowth(thisResults, lastResults)
  const cprGrowth = calculateGrowth(thisCPR, lastCPR)
  const ctrGrowth = calculateGrowth(thisCTR, lastCTR)
  const cpcGrowth = calculateGrowth(thisCPC, lastCPC)
  const cpmGrowth = calculateGrowth(thisCPM, lastCPM)
  const convRateGrowth = calculateGrowth(thisConvRate, lastConvRate)
  const freqGrowth = calculateGrowth(thisFrequency, lastFrequency)

  // Breakdown data
  const ageData = breakdownThisWeek.age || []
  const genderData = breakdownThisWeek.gender || []
  const regionData = breakdownThisWeek.region || []
  const platformData = breakdownThisWeek.platform || []
  const placementData = breakdownThisWeek.placement || []
  const objectiveData = breakdownThisWeek.objective || []
  const adCreativeData = breakdownThisWeek['ad-creative'] || breakdownThisWeek.adCreative || []

  const ageDataLast = breakdownLastWeek.age || []
  const genderDataLast = breakdownLastWeek.gender || []
  const regionDataLast = breakdownLastWeek.region || []
  const platformDataLast = breakdownLastWeek.platform || []
  const placementDataLast = breakdownLastWeek.placement || []

  const isGoodPerformance = cprGrowth <= 0 || (resultsGrowth > 0 && cprGrowth < 10)

  let slideNumber = 0

  let html = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CTLP to WA Report - ${defaultReportName}</title>
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

        .slide-header .logo {
            height: 40px;
            width: auto;
        }

        .slide-header .slide-number {
            font-size: 12px;
            color: var(--gray-400);
            font-weight: 500;
        }

        .slide-title {
            margin-bottom: 32px;
        }

        .slide-title h1 {
            font-size: 28px;
            font-weight: 700;
            color: var(--gray-900);
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .slide-title h1 i {
            color: var(--primary);
        }

        .slide-title p {
            font-size: 15px;
            color: var(--gray-500);
        }

        /* Cards */
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

        .card-header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 16px;
            padding-bottom: 12px;
            border-bottom: 1px solid var(--gray-100);
        }

        .card-header i {
            font-size: 18px;
            color: var(--primary);
        }

        .card-header span {
            font-size: 13px;
            font-weight: 600;
            color: var(--gray-600);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        /* Metrics */
        .metric-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
        }

        .metric-card {
            background: var(--gray-50);
            border: 1px solid var(--gray-200);
            border-radius: 12px;
            padding: 20px;
            text-align: center;
        }

        .metric-card.highlight {
            background: var(--primary-light);
            border-color: var(--primary);
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

        .metric-compare {
            font-size: 12px;
            color: var(--gray-500);
            margin-bottom: 8px;
        }

        /* Badge */
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

        /* Tables */
        .table-container {
            border: 1px solid var(--gray-200);
            border-radius: 12px;
            overflow: hidden;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        thead {
            background: var(--primary);
            color: white;
        }

        th {
            padding: 14px 16px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            text-align: left;
        }

        th:not(:first-child) {
            text-align: right;
        }

        td {
            padding: 12px 16px;
            font-size: 13px;
            border-bottom: 1px solid var(--gray-100);
        }

        td:not(:first-child) {
            text-align: right;
        }

        tbody tr:hover {
            background: var(--gray-50);
        }

        tbody tr.highlight {
            background: var(--warning-light);
        }

        /* Funnel */
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
            min-width: 160px;
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

        .funnel-arrow i {
            font-size: 24px;
            color: var(--gray-400);
        }

        .funnel-arrow .rate {
            font-size: 11px;
            font-weight: 600;
            padding: 4px 8px;
            border-radius: 4px;
            background: var(--warning-light);
            color: var(--warning);
        }

        /* Two Column Layout */
        .two-col {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 24px;
        }

        /* Highlights Box */
        .highlight-box {
            border-radius: 12px;
            padding: 24px;
        }

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

        .highlight-item i {
            font-size: 16px;
            margin-top: 2px;
        }

        .highlight-item strong {
            display: block;
            font-size: 13px;
            color: var(--gray-800);
            margin-bottom: 2px;
        }

        .highlight-item p {
            font-size: 12px;
            color: var(--gray-500);
            margin: 0;
        }

        /* Info Box - Konsisten dengan Summary Box */
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

        .info-box p {
            font-size: 13px;
            color: var(--gray-700);
            line-height: 1.7;
            margin: 0 0 8px 0;
        }

        .info-box p:last-child {
            margin-bottom: 0;
        }

        .info-box strong {
            color: var(--primary-dark);
        }

        .info-box ul {
            margin: 0 0 12px 0;
            padding-left: 20px;
            font-size: 13px;
            color: var(--gray-700);
            line-height: 1.7;
        }

        .info-box ul li {
            margin-bottom: 6px;
        }

        .info-box ul li:last-child {
            margin-bottom: 0;
        }

        .reco-box {
            background: linear-gradient(135deg, var(--warning-light) 0%, #fffbeb 100%);
            border-left: 4px solid var(--warning);
            border-radius: 8px;
            padding: 14px 18px;
            margin-top: 12px;
        }

        .reco-box h4 {
            font-size: 12px;
            font-weight: 700;
            color: var(--warning);
            margin-bottom: 6px;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .reco-box p {
            font-size: 13px;
            color: var(--gray-700);
            line-height: 1.6;
            margin: 0;
        }

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

        .cover-slide h1 {
            font-size: 48px;
            font-weight: 800;
            margin-bottom: 16px;
        }

        .cover-slide h2 {
            font-size: 24px;
            font-weight: 500;
            opacity: 0.9;
            margin-bottom: 8px;
        }

        .cover-slide .period {
            font-size: 16px;
            opacity: 0.8;
            margin-bottom: 48px;
        }

        .cover-slide .confidential {
            background: rgba(255,255,255,0.1);
            border: 1px solid rgba(255,255,255,0.2);
            padding: 16px 24px;
            border-radius: 12px;
            max-width: 400px;
        }

        .cover-slide .confidential p {
            font-size: 13px;
            margin: 0;
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

        .status-badge.good {
            background: var(--success-light);
            color: var(--success);
            border: 2px solid var(--success);
        }

        .status-badge.warning {
            background: var(--warning-light);
            color: var(--warning);
            border: 2px solid var(--warning);
        }

        /* Bar Chart */
        .bar-chart-item {
            margin-bottom: 16px;
        }

        .bar-chart-label {
            display: flex;
            justify-content: space-between;
            margin-bottom: 6px;
            font-size: 13px;
        }

        .bar-chart-label .name {
            font-weight: 600;
            color: var(--gray-800);
        }

        .bar-chart-label .value {
            color: var(--gray-600);
        }

        .bar-chart-track {
            height: 24px;
            background: var(--gray-100);
            border-radius: 6px;
            overflow: hidden;
        }

        .bar-chart-fill {
            height: 100%;
            background: linear-gradient(90deg, var(--primary) 0%, var(--primary-dark) 100%);
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            padding-right: 8px;
            min-width: 40px;
        }

        .bar-chart-fill span {
            font-size: 11px;
            font-weight: 600;
            color: white;
        }

        /* Gender Cards */
        .gender-card {
            text-align: center;
            padding: 24px;
        }

        .gender-card .icon {
            width: 64px;
            height: 64px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 16px;
            font-size: 32px;
        }

        .gender-card.male .icon {
            background: var(--primary-light);
            color: var(--primary);
        }

        .gender-card.female .icon {
            background: #fce7f3;
            color: #db2777;
        }

        /* Platform Cards */
        .platform-card {
            display: flex;
            align-items: flex-start;
            gap: 16px;
            padding: 20px;
        }

        .platform-card .icon {
            width: 48px;
            height: 48px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
        }

        .platform-card .icon.facebook { background: #e7f3ff; color: #1877f2; }
        .platform-card .icon.instagram { background: #fce7f3; color: #e4405f; }
        .platform-card .icon.messenger { background: #e7f3ff; color: #0084ff; }

        /* Summary Box */
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

        .summary-box p {
            font-size: 14px;
            color: var(--gray-700);
            line-height: 1.7;
        }

        /* Numbered List */
        .numbered-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .numbered-item {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            background: white;
            padding: 12px 16px;
            border-radius: 8px;
            border: 1px solid var(--gray-200);
        }

        .numbered-item .number {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: 700;
            flex-shrink: 0;
        }

        .numbered-item .number.blue {
            background: var(--primary);
            color: white;
        }

        .numbered-item .number.orange {
            background: var(--warning);
            color: white;
        }

        .numbered-item p {
            font-size: 13px;
            color: var(--gray-700);
            line-height: 1.5;
            margin: 0;
        }

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

        .thankyou-slide h1 {
            font-size: 56px;
            font-weight: 800;
            margin-bottom: 16px;
        }

        .thankyou-slide p {
            font-size: 18px;
            opacity: 0.9;
            margin-bottom: 32px;
        }

        .thankyou-slide .contact-box {
            background: rgba(255,255,255,0.15);
            border: 1px solid rgba(255,255,255,0.3);
            padding: 24px 40px;
            border-radius: 16px;
        }

        /* Mini Stats */
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

        .mini-stat .value {
            font-size: 14px;
            font-weight: 700;
            color: var(--gray-800);
        }

        /* Scrollable Table - for screen display */
        .scrollable-table {
            max-height: 320px;
            overflow-y: auto;
            border: 1px solid var(--gray-200);
            border-radius: 12px;
        }

        /* Full table without scroll - for PDF export */
        .full-table {
            border: 1px solid var(--gray-200);
            border-radius: 12px;
            overflow: visible;
        }

        .scrollable-table thead,
        .full-table thead {
            position: sticky;
            top: 0;
            z-index: 10;
        }

        /* Print/PDF styles - remove scroll constraints */
        @media print {
            .scrollable-table,
            .full-table {
                max-height: none !important;
                overflow: visible !important;
            }
            .slide {
                page-break-after: always;
                page-break-inside: avoid;
            }
        }

        /* Priority Badge */
        .priority-high { background: var(--danger-light); color: var(--danger); }
        .priority-medium { background: var(--warning-light); color: var(--warning); }
        .priority-low { background: var(--success-light); color: var(--success); }

        .growth-up { color: var(--success); }
        .growth-down { color: var(--danger); }
    </style>
</head>
<body>

    <!-- SLIDE 1: COVER -->
    <div class="slide cover-slide" data-slide="${++slideNumber}">
        <img src="${LOGO_URL}" alt="Logo" class="logo">
        
        <div class="badge-period">${periodType.toUpperCase()}</div>
        
        <h1>CTLP to WA Monthly Report</h1>
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
            <p>Quick Overview - ${comparisonLabel}</p>
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
            <div class="card" style="text-align: center; border-top: 4px solid var(--primary);">
                <div class="metric-icon blue">${icon('wallet2', 24)}</div>
                <div class="metric-label">Total Spend</div>
                <div class="metric-value">${formatCurrency(thisSpent)}</div>
                <div style="margin-top: 8px;">${getGrowthBadgeNew(spendGrowth, true)}</div>
            </div>
            <div class="card" style="text-align: center; border-top: 4px solid var(--success);">
                <div class="metric-icon green">${icon('chat-dots-fill', 24)}</div>
                <div class="metric-label">Checkouts</div>
                <div class="metric-value">${formatNumber(thisResults)}</div>
                <div style="margin-top: 8px;">${getGrowthBadgeNew(resultsGrowth)}</div>
            </div>
            <div class="card" style="text-align: center; border-top: 4px solid var(--warning);">
                <div class="metric-icon orange">${icon('currency-dollar', 24)}</div>
                <div class="metric-label">Cost per Checkout</div>
                <div class="metric-value">${formatCurrency(thisCPR)}</div>
                <div style="margin-top: 8px;">${getGrowthBadgeNew(cprGrowth, true)}</div>
            </div>
            <div class="card" style="text-align: center; border-top: 4px solid #8b5cf6;">
                <div class="metric-icon" style="background: #ede9fe; color: #8b5cf6;">${icon('people-fill', 24)}</div>
                <div class="metric-label">Reach</div>
                <div class="metric-value">${formatNumber(thisReach)}</div>
                <div style="margin-top: 8px;">${getGrowthBadgeNew(reachGrowth)}</div>
            </div>
        </div>

        <!-- Summary Box -->
        <div class="summary-box">
            <h3>${icon('lightbulb-fill', 16)} Summary</h3>
            <p>
                Performa iklan CTWA periode ${thisPeriodLabel} menunjukkan 
                <strong>${resultsGrowth >= 0 ? 'peningkatan' : 'penurunan'} ${Math.abs(resultsGrowth).toFixed(1)}%</strong> 
                pada Checkouts Initiated (${formatNumber(lastResults)} → ${formatNumber(thisResults)}).
                ${cprGrowth <= 0 ?
                    `<span class="growth-up">CPC membaik ${Math.abs(cprGrowth).toFixed(1)}%</span> (${formatCurrency(lastCPR)} → ${formatCurrency(thisCPR)}) menunjukkan efisiensi biaya yang lebih baik.` :
                    `<span class="growth-down">CPR naik ${cprGrowth.toFixed(1)}%</span> yang perlu dioptimasi.`}
            </p>
        </div>

        <!-- Mini Stats -->
        <div class="mini-stats">
            <div class="mini-stat">
                <div class="label">Impressions</div>
                <div class="value">${formatNumber(thisImpr)}</div>
            </div>
            <div class="mini-stat">
                <div class="label">Link Clicks</div>
                <div class="value">${formatNumber(thisLinkClicks)}</div>
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
                <div class="label">CPM</div>
                <div class="value">${formatCurrency(thisCPM)}</div>
            </div>
            <div class="mini-stat">
                <div class="label">Frequency</div>
                <div class="value">${thisFrequency.toFixed(2)}</div>
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
            <p>Customer Journey dari Impression ke Conversation</p>
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
                <div class="rate" style="background: var(--success-light); color: var(--success);">Conv: ${thisConvRate.toFixed(2)}%</div>
            </div>

            <div class="funnel-step" style="border-color: var(--success); background: var(--success-light);">
                <div class="step-label">${icon('chat-dots-fill', 14)} Checkouts</div>
                <div class="step-value">${formatNumber(thisResults)}</div>
                ${getGrowthBadgeNew(resultsGrowth)}
            </div>
        </div>

        <!-- Comparison Table -->
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Metric</th>
                        <th>${lastPeriodLabel}</th>
                        <th>${thisPeriodLabel}</th>
                        <th>Change</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>${icon('eye', 14)} Impressions</td>
                        <td>${formatNumber(lastImpr)}</td>
                        <td><strong>${formatNumber(thisImpr)}</strong></td>
                        <td>${getGrowthBadgeNew(imprGrowth)}</td>
                    </tr>
                    <tr>
                        <td>${icon('percent', 14)} CTR</td>
                        <td>${lastCTR.toFixed(2)}%</td>
                        <td><strong>${thisCTR.toFixed(2)}%</strong></td>
                        <td>${getGrowthBadgeNew(ctrGrowth)}</td>
                    </tr>
                    <tr>
                        <td>${icon('hand-index-thumb', 14)} Link Clicks</td>
                        <td>${formatNumber(lastLinkClicks)}</td>
                        <td><strong>${formatNumber(thisLinkClicks)}</strong></td>
                        <td>${getGrowthBadgeNew(linkClicksGrowth)}</td>
                    </tr>
                    <tr>
                        <td>${icon('arrow-repeat', 14)} Conversion Rate</td>
                        <td>${lastConvRate.toFixed(2)}%</td>
                        <td><strong>${thisConvRate.toFixed(2)}%</strong></td>
                        <td>${getGrowthBadgeNew(convRateGrowth)}</td>
                    </tr>
                    <tr style="background: var(--primary-light);">
                        <td><strong>${icon('chat-dots-fill', 14)} Checkouts</strong></td>
                        <td>${formatNumber(lastResults)}</td>
                        <td><strong style="color: var(--primary);">${formatNumber(thisResults)}</strong></td>
                        <td>${getGrowthBadgeNew(resultsGrowth)}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="info-box">
            <p><strong>${icon('info-circle-fill', 14)} Insight:</strong> ${thisCTR > lastCTR ? 'CTR meningkat menunjukkan creative lebih menarik.' : 'CTR menurun, perlu evaluasi creative.'} ${thisConvRate > lastConvRate ? 'Conversion rate membaik menunjukkan landing page/CTA efektif.' : 'Conversion rate menurun, perlu optimasi CTA atau targeting.'}</p>
        </div>
    </div>

    <!-- SLIDE 4: PERFORMANCE SUMMARY -->
    <div class="slide" data-slide="${++slideNumber}">
        <div class="slide-header">
            <img src="${LOGO_URL}" alt="Logo" class="logo">
            <span class="slide-number">Slide ${slideNumber}</span>
        </div>

        <div class="slide-title">
            <h1>${icon('bar-chart-fill')} Performance Summary</h1>
            <p>${comparisonLabel} - All Metrics Comparison</p>
        </div>

        <!-- 6 Main Metrics -->
        <div class="metric-grid" style="margin-bottom: 20px;">
            ${generateMetricCard('wallet2', 'Amount Spent', formatCurrency(thisSpent), formatCurrency(lastSpent), spendGrowth, true, thisPeriodLabel, lastPeriodLabel)}
            ${generateMetricCard('people-fill', 'Reach', formatNumber(thisReach), formatNumber(lastReach), reachGrowth, false, thisPeriodLabel, lastPeriodLabel)}
            ${generateMetricCard('eye-fill', 'Impressions', formatNumber(thisImpr), formatNumber(lastImpr), imprGrowth, false, thisPeriodLabel, lastPeriodLabel)}
            ${generateMetricCard('link-45deg', 'Link Clicks', formatNumber(thisLinkClicks), formatNumber(lastLinkClicks), linkClicksGrowth, false, thisPeriodLabel, lastPeriodLabel)}
            ${generateMetricCard('chat-dots-fill', 'Checkouts', formatNumber(thisResults), formatNumber(lastResults), resultsGrowth, false, thisPeriodLabel, lastPeriodLabel, true)}
            ${generateMetricCard('currency-dollar', 'Cost per Checkout', formatCurrency(thisCPR), formatCurrency(lastCPR), cprGrowth, true, thisPeriodLabel, lastPeriodLabel, false, cprGrowth <= 0)}
        </div>

        <!-- Additional Metrics -->
        <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px;">
            ${generateMiniMetric('CTR', `${thisCTR.toFixed(2)}%`, ctrGrowth)}
            ${generateMiniMetric('CPC', formatCurrency(thisCPC), cpcGrowth, true)}
            ${generateMiniMetric('CPM', formatCurrency(thisCPM), cpmGrowth, true)}
            ${generateMiniMetric('Frequency', thisFrequency.toFixed(2), freqGrowth)}
            ${generateMiniMetric('Conv Rate', `${thisConvRate.toFixed(2)}%`, convRateGrowth)}
        </div>

        <div class="info-box">
            <p><strong>${icon('info-circle-fill', 14)} Key Insight:</strong> ${spendGrowth < 0 ? 'Penghematan budget' : 'Peningkatan budget'} sebesar <strong>${Math.abs(spendGrowth).toFixed(2)}%</strong> dengan ${resultsGrowth >= 0 ? 'peningkatan' : 'penurunan'} Checkouts Initiated sebesar <strong>${Math.abs(resultsGrowth).toFixed(2)}%</strong>. CPR ${cprGrowth <= 0 ? 'membaik' : 'naik'} <strong>${Math.abs(cprGrowth).toFixed(2)}%</strong>.</p>
        </div>
    </div>

    <!-- SLIDE 5: HIGHLIGHTS & LOWLIGHTS -->
    <div class="slide" data-slide="${++slideNumber}">
        <div class="slide-header">
            <img src="${LOGO_URL}" alt="Logo" class="logo">
            <span class="slide-number">Slide ${slideNumber}</span>
        </div>

        <div class="slide-title">
            <h1>${icon('lightning-fill')} Highlights & Lowlights</h1>
            <p>${comparisonLabel} Analysis</p>
        </div>

        <div class="two-col">
            <!-- Highlights -->
            <div class="highlight-box success">
                <h3>${icon('check-circle-fill', 18)} Highlights</h3>
                ${generateHighlightItems(true, cprGrowth, spendGrowth, resultsGrowth, ctrGrowth, convRateGrowth, reachGrowth, thisCPR, lastCPR, thisSpent, lastSpent, thisResults, lastResults, imprGrowth, linkClicksGrowth, cpmGrowth, cpcGrowth, freqGrowth)}
            </div>

            <!-- Lowlights -->
            <div class="highlight-box danger">
                <h3>${icon('x-circle-fill', 18)} Lowlights</h3>
                ${generateHighlightItems(false, cprGrowth, spendGrowth, resultsGrowth, ctrGrowth, convRateGrowth, reachGrowth, thisCPR, lastCPR, thisSpent, lastSpent, thisResults, lastResults, imprGrowth, linkClicksGrowth, cpmGrowth, cpcGrowth, freqGrowth)}
            </div>
        </div>

        <div class="info-box" style="margin-top: 24px;">
            <p><strong>${icon('info-circle-fill', 14)} Summary:</strong> ${cprGrowth <= 0 ? 'Meskipun volume menurun, efisiensi biaya membaik dengan CPR yang lebih rendah.' : 'Perlu optimasi untuk meningkatkan efisiensi biaya.'} ${resultsGrowth < 0 ? `Penurunan checkouts sebesar ${Math.abs(resultsGrowth).toFixed(2)}% perlu diimbangi dengan strategi untuk meningkatkan volume.` : `Peningkatan checkouts menunjukkan strategi yang efektif.`}</p>
        </div>
    </div>`

  // Age Breakdown
  if (ageData.length > 0) {
    html += generateAgeSlide(ageData, ageDataLast, thisPeriodLabel, lastPeriodLabel, ++slideNumber)
  }

  // Gender Breakdown
  if (genderData.length > 0) {
    html += generateGenderSlide(genderData, genderDataLast, thisPeriodLabel, lastPeriodLabel, ++slideNumber)
  }

  // Region Breakdown
  if (regionData.length > 0) {
    html += generateRegionSlide(regionData, regionDataLast, thisPeriodLabel, lastPeriodLabel, ++slideNumber)
  }

  // Placement Breakdown
  if (placementData.length > 0) {
    html += generatePlacementSlide(placementData, placementDataLast, thisPeriodLabel, lastPeriodLabel, ++slideNumber)
  }

  // Platform Breakdown
  if (platformData.length > 0) {
    html += generatePlatformSlide(platformData, platformDataLast, thisPeriodLabel, lastPeriodLabel, ++slideNumber)
  }

  // Objective Breakdown
  if (objectiveData.length > 0) {
    html += generateObjectiveSlide(objectiveData, ++slideNumber)
  }

  // Ad Creative Breakdown
  if (adCreativeData.length > 0) {
    html += generateAdCreativeSlide(adCreativeData, ++slideNumber)
    html += generateContentPerformanceSlide(adCreativeData, ++slideNumber)
  }

  // Conclusion
  html += generateConclusionSlide(
    { thisSpent, lastSpent, spendGrowth },
    { thisReach, lastReach, reachGrowth },
    { thisImpr, lastImpr, imprGrowth },
    { thisLinkClicks, lastLinkClicks, linkClicksGrowth },
    { thisResults, lastResults, resultsGrowth },
    { thisCPR, lastCPR, cprGrowth },
    { thisCTR, lastCTR, ctrGrowth },
    { thisConvRate, lastConvRate, convRateGrowth },
    ++slideNumber
  )

  // Next Month Target
  html += generateNextMonthTargetSlide(
    { thisSpent, thisResults, thisCPR, thisReach },
    { resultsGrowth, cprGrowth },
    ++slideNumber
  )

  // Thank You
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

  return html
}

// ============ HELPER FUNCTIONS ============

function getGrowthBadgeNew(growth: number, inverse: boolean = false): string {
  const isPositive = inverse ? growth <= 0 : growth >= 0
  const badgeClass = isPositive ? 'badge-success' : 'badge-danger'
  const iconName = growth >= 0 ? 'arrow-up' : 'arrow-down'
  return `<span class="badge ${badgeClass}"><i class="bi bi-${iconName}"></i> ${Math.abs(growth).toFixed(1)}%</span>`
}

function generateMetricCard(iconName: string, label: string, thisValue: string, lastValue: string, growth: number, inverse: boolean, thisPeriodLabel: string, lastPeriodLabel: string, highlight: boolean = false, isGood: boolean = false): string {
  const borderColor = highlight ? 'var(--primary)' : isGood ? 'var(--success)' : growth > 0 && !inverse ? 'var(--success)' : 'var(--gray-200)'
  return `
    <div class="card" style="padding: 16px; ${highlight ? 'border: 2px solid var(--primary); background: var(--primary-light);' : isGood ? 'border: 2px solid var(--success);' : ''}">
        <div class="card-header" style="margin-bottom: 12px; padding-bottom: 8px;">
            <i class="bi bi-${iconName}" style="font-size: 16px; color: var(--primary);"></i>
            <span style="font-size: 11px;">${label}</span>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px;">
            <div>
                <div style="font-size: 10px; color: var(--gray-500);">${thisPeriodLabel}</div>
                <div style="font-size: 16px; font-weight: 700; color: var(--gray-900);">${thisValue}</div>
            </div>
            <div>
                <div style="font-size: 10px; color: var(--gray-500);">${lastPeriodLabel}</div>
                <div style="font-size: 14px; font-weight: 600; color: var(--gray-500);">${lastValue}</div>
            </div>
        </div>
        <div>${getGrowthBadgeNew(growth, inverse)}</div>
    </div>`
}

function generateMiniMetric(label: string, value: string, growth: number, inverse: boolean = false): string {
  return `
    <div class="mini-stat">
        <div class="label">${label}</div>
        <div class="value">${value}</div>
        <div style="margin-top: 4px;">${getGrowthBadgeNew(growth, inverse)}</div>
    </div>`
}

function generateHighlightItems(isHighlight: boolean, cprGrowth: number, spendGrowth: number, resultsGrowth: number, ctrGrowth: number, convRateGrowth: number, reachGrowth: number, thisCPR: number, lastCPR: number, thisSpent: number, lastSpent: number, thisResults: number, lastResults: number, imprGrowth?: number, linkClicksGrowth?: number, cpmGrowth?: number, cpcGrowth?: number, freqGrowth?: number): string {
  const items: string[] = []
  const iconCheck = '<i class="bi bi-check-lg" style="color: var(--success);"></i>'
  const iconX = '<i class="bi bi-x-lg" style="color: var(--danger);"></i>'

  if (isHighlight) {
    // Primary highlights - cost efficiency
    if (cprGrowth < 0) {
      items.push(`<div class="highlight-item">${iconCheck}<div><strong>CPR Turun ${Math.abs(cprGrowth).toFixed(1)}%</strong><p>${formatCurrency(lastCPR)} → ${formatCurrency(thisCPR)}</p></div></div>`)
    }
    if (spendGrowth < 0) {
      items.push(`<div class="highlight-item">${iconCheck}<div><strong>Budget Hemat ${Math.abs(spendGrowth).toFixed(1)}%</strong><p>${formatCurrency(lastSpent)} → ${formatCurrency(thisSpent)}</p></div></div>`)
    }
    
    // Volume & engagement highlights
    if (resultsGrowth > 0) {
      items.push(`<div class="highlight-item">${iconCheck}<div><strong>Checkouts Naik ${resultsGrowth.toFixed(1)}%</strong><p>${formatNumber(lastResults)} → ${formatNumber(thisResults)}</p></div></div>`)
    }
    if (ctrGrowth > 0) {
      items.push(`<div class="highlight-item">${iconCheck}<div><strong>CTR Meningkat ${ctrGrowth.toFixed(1)}%</strong><p>Creative lebih menarik</p></div></div>`)
    }
    if (convRateGrowth > 0) {
      items.push(`<div class="highlight-item">${iconCheck}<div><strong>Conv Rate Naik ${convRateGrowth.toFixed(1)}%</strong><p>CTA lebih efektif</p></div></div>`)
    }
    if (reachGrowth > 0) {
      items.push(`<div class="highlight-item">${iconCheck}<div><strong>Reach Naik ${reachGrowth.toFixed(1)}%</strong><p>Jangkauan audiens meningkat</p></div></div>`)
    }
    if (linkClicksGrowth && linkClicksGrowth > 0) {
      items.push(`<div class="highlight-item">${iconCheck}<div><strong>Link Clicks Naik ${linkClicksGrowth.toFixed(1)}%</strong><p>Engagement meningkat</p></div></div>`)
    }
    if (imprGrowth && imprGrowth > 0) {
      items.push(`<div class="highlight-item">${iconCheck}<div><strong>Impressions Naik ${imprGrowth.toFixed(1)}%</strong><p>Exposure iklan meningkat</p></div></div>`)
    }
    if (cpmGrowth && cpmGrowth < 0) {
      items.push(`<div class="highlight-item">${iconCheck}<div><strong>CPM Turun ${Math.abs(cpmGrowth).toFixed(1)}%</strong><p>Biaya per 1000 impr lebih murah</p></div></div>`)
    }
    if (cpcGrowth && cpcGrowth < 0) {
      items.push(`<div class="highlight-item">${iconCheck}<div><strong>CPC Turun ${Math.abs(cpcGrowth).toFixed(1)}%</strong><p>Biaya per klik lebih murah</p></div></div>`)
    }
    
    // Fallback items if not enough highlights
    if (items.length < 4) {
      if (thisResults > 0) {
        items.push(`<div class="highlight-item">${iconCheck}<div><strong>Campaign Aktif & Produktif</strong><p>${formatNumber(thisResults)} checkouts dihasilkan</p></div></div>`)
      }
      if (items.length < 4 && thisCPR > 0) {
        items.push(`<div class="highlight-item">${iconCheck}<div><strong>Cost Efficiency Terjaga</strong><p>CPR ${formatCurrency(thisCPR)} per checkout</p></div></div>`)
      }
      if (items.length < 4) {
        items.push(`<div class="highlight-item">${iconCheck}<div><strong>Iklan Terus Berjalan</strong><p>Campaign tetap aktif dan menghasilkan</p></div></div>`)
      }
      if (items.length < 4) {
        items.push(`<div class="highlight-item">${iconCheck}<div><strong>Audience Terbangun</strong><p>Database leads terus bertambah</p></div></div>`)
      }
    }
  } else {
    // Lowlights - areas for improvement
    if (resultsGrowth < 0) {
      items.push(`<div class="highlight-item">${iconX}<div><strong>Checkouts Turun ${Math.abs(resultsGrowth).toFixed(1)}%</strong><p>${formatNumber(lastResults)} → ${formatNumber(thisResults)}</p></div></div>`)
    }
    if (cprGrowth > 0) {
      items.push(`<div class="highlight-item">${iconX}<div><strong>CPR Naik ${cprGrowth.toFixed(1)}%</strong><p>Biaya per hasil meningkat</p></div></div>`)
    }
    if (reachGrowth < 0) {
      items.push(`<div class="highlight-item">${iconX}<div><strong>Reach Turun ${Math.abs(reachGrowth).toFixed(1)}%</strong><p>Jangkauan audiens berkurang</p></div></div>`)
    }
    if (linkClicksGrowth && linkClicksGrowth < 0) {
      items.push(`<div class="highlight-item">${iconX}<div><strong>Link Clicks Turun ${Math.abs(linkClicksGrowth).toFixed(1)}%</strong><p>Engagement berkurang</p></div></div>`)
    }
    if (ctrGrowth < 0) {
      items.push(`<div class="highlight-item">${iconX}<div><strong>CTR Turun ${Math.abs(ctrGrowth).toFixed(1)}%</strong><p>Creative perlu di-refresh</p></div></div>`)
    }
    if (imprGrowth && imprGrowth < 0) {
      items.push(`<div class="highlight-item">${iconX}<div><strong>Impressions Turun ${Math.abs(imprGrowth).toFixed(1)}%</strong><p>Exposure iklan berkurang</p></div></div>`)
    }
    if (convRateGrowth < 0) {
      items.push(`<div class="highlight-item">${iconX}<div><strong>Conv Rate Turun ${Math.abs(convRateGrowth).toFixed(1)}%</strong><p>Landing page perlu dioptimasi</p></div></div>`)
    }
    if (cpmGrowth && cpmGrowth > 0) {
      items.push(`<div class="highlight-item">${iconX}<div><strong>CPM Naik ${cpmGrowth.toFixed(1)}%</strong><p>Biaya impresi meningkat</p></div></div>`)
    }
    if (cpcGrowth && cpcGrowth > 0) {
      items.push(`<div class="highlight-item">${iconX}<div><strong>CPC Naik ${cpcGrowth.toFixed(1)}%</strong><p>Biaya per klik meningkat</p></div></div>`)
    }
    if (spendGrowth > 0 && resultsGrowth <= 0) {
      items.push(`<div class="highlight-item">${iconX}<div><strong>Budget Naik ${spendGrowth.toFixed(1)}%</strong><p>Tanpa peningkatan hasil</p></div></div>`)
    }
    if (freqGrowth && freqGrowth > 10) {
      items.push(`<div class="highlight-item">${iconX}<div><strong>Frequency Tinggi ${freqGrowth.toFixed(1)}%</strong><p>Audiens perlu diperluas</p></div></div>`)
    }
    
    // Fallback items if not enough lowlights
    if (items.length < 4) {
      items.push(`<div class="highlight-item">${iconX}<div><strong>Perlu Optimasi Budget</strong><p>Alokasi budget perlu ditinjau ulang</p></div></div>`)
    }
    if (items.length < 4) {
      items.push(`<div class="highlight-item">${iconX}<div><strong>Creative Refresh Diperlukan</strong><p>Test creative baru untuk hasil lebih baik</p></div></div>`)
    }
    if (items.length < 4) {
      items.push(`<div class="highlight-item">${iconX}<div><strong>Target Audience Review</strong><p>Evaluasi targeting untuk efisiensi</p></div></div>`)
    }
    if (items.length < 4) {
      items.push(`<div class="highlight-item">${iconX}<div><strong>Monitoring Intensif</strong><p>Pantau performa secara berkala</p></div></div>`)
    }
  }

  return items.slice(0, 5).join('')
}

// ============ BREAKDOWN SLIDES ============

function generateAgeSlide(data: any[], lastData: any[], thisPeriodLabel: string, lastPeriodLabel: string, slideNumber: number): string {
  const totalResults = data.reduce((sum, item) => sum + parseNum(item['Messaging checkouts started'] || item['Results'] || 0), 0)
  const totalSpent = data.reduce((sum, item) => sum + parseNum(item['Amount spent (IDR)'] || 0), 0)
  
  const sortedData = [...data].sort((a, b) => parseNum(b['Messaging checkouts started'] || b['Results'] || 0) - parseNum(a['Messaging checkouts started'] || a['Results'] || 0))

  const tableRows = sortedData.map((item, index) => {
    const age = item['Age'] || 'Unknown'
    const results = parseNum(item['Messaging checkouts started'] || item['Results'] || 0)
    const spent = parseNum(item['Amount spent (IDR)'] || 0)
    const reach = parseNum(item['Reach'] || 0)
    const impressions = parseNum(item['Impressions'] || 0)
    const linkClicks = parseNum(item['Link clicks'] || 0)
    const cpr = results > 0 ? spent / results : 0
    const ctr = impressions > 0 ? (linkClicks / impressions) * 100 : 0
    const percentage = totalResults > 0 ? (results / totalResults) * 100 : 0
    
    const lastItem = lastData.find(l => l['Age'] === age)
    const lastResults = lastItem ? parseNum(lastItem['Messaging checkouts started'] || lastItem['Results'] || 0) : 0
    const lastCpr = lastItem ? (lastResults > 0 ? parseNum(lastItem['Amount spent (IDR)'] || 0) / lastResults : 0) : 0
    const resultsGrowth = calculateGrowth(results, lastResults)
    const cprGrowth = calculateGrowth(cpr, lastCpr)

    return `
                    <tr>
                        <td><strong>${age}</strong></td>
                        <td>${formatNumber(results)} <span style="color: var(--gray-400); font-size: 11px;">(${percentage.toFixed(1)}%)</span></td>
                        <td>${formatCurrency(cpr)}</td>
                        <td>${formatCurrency(spent)}</td>
                        <td>${formatNumber(reach)}</td>
                        <td>${ctr.toFixed(2)}%</td>
                        <td style="text-align: center;">${getGrowthBadgeNew(resultsGrowth)}</td>
                    </tr>`
  }).join('')

  return `
    <!-- SLIDE: AGE BREAKDOWN -->
    <div class="slide" data-slide="${slideNumber}">
        <div class="slide-header">
            <img src="${LOGO_URL}" alt="Logo" class="logo">
            <span class="slide-number">Slide ${slideNumber}</span>
        </div>

        <div class="slide-title">
            <h1><i class="bi bi-calendar3"></i> Age Breakdown</h1>
            <p>Performance by Age Group</p>
        </div>

        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Age Group</th>
                        <th>Results</th>
                        <th>CPR</th>
                        <th>Spent</th>
                        <th>Reach</th>
                        <th>CTR</th>
                        <th style="text-align: center;">Growth</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>
        </div>

        <div class="info-box">
            <h4><i class="bi bi-lightbulb-fill"></i> Key Insight</h4>
            <ul>
                <li><strong>${sortedData[0]?.['Age'] || 'N/A'}</strong> (${formatNumber(parseNum(sortedData[0]?.['Messaging checkouts started'] || sortedData[0]?.['Results'] || 0))} WA) dan <strong>${sortedData[1]?.['Age'] || 'N/A'}</strong> (${formatNumber(parseNum(sortedData[1]?.['Messaging checkouts started'] || sortedData[1]?.['Results'] || 0))} WA) menyumbang <strong>${((parseNum(sortedData[0]?.['Messaging checkouts started'] || sortedData[0]?.['Results'] || 0) + parseNum(sortedData[1]?.['Messaging checkouts started'] || sortedData[1]?.['Results'] || 0)) / totalResults * 100).toFixed(0)}%</strong> total WA → segmen inti untuk scale.</li>
                <li>Efisiensi terbaik di <strong>${sortedData[0]?.['Age'] || 'N/A'}</strong> dengan Cost/WA <strong>${formatCurrency(parseNum(sortedData[0]?.['Messaging checkouts started'] || sortedData[0]?.['Results'] || 0) > 0 ? parseNum(sortedData[0]?.['Amount spent (IDR)'] || 0) / parseNum(sortedData[0]?.['Messaging checkouts started'] || sortedData[0]?.['Results'] || 0) : 0)}</strong>.</li>
                <li>Age group dengan volume rendah perlu dievaluasi untuk efisiensi budget.</li>
            </ul>
            <div class="reco-box">
                <h4><i class="bi bi-pencil-square"></i> Rekomendasi</h4>
                <p>Prioritaskan budget ke <strong>${sortedData[0]?.['Age'] || 'N/A'}</strong> dan <strong>${sortedData[1]?.['Age'] || 'N/A'}</strong> untuk volume optimal; tes hemat di age group dengan CPR rendah.</p>
            </div>
        </div>
    </div>`
}

function generateGenderSlide(data: any[], lastData: any[], thisPeriodLabel: string, lastPeriodLabel: string, slideNumber: number): string {
  const totalResults = data.reduce((sum, item) => sum + parseNum(item['Messaging checkouts started'] || item['Results'] || 0), 0)
  
  const genderCards = data.map(item => {
    const gender = item['Gender'] || 'Unknown'
    const results = parseNum(item['Messaging checkouts started'] || item['Results'] || 0)
    const spent = parseNum(item['Amount spent (IDR)'] || 0)
    const percentage = totalResults > 0 ? (results / totalResults) * 100 : 0
    const cpr = results > 0 ? spent / results : 0
    
    const lastItem = lastData.find(l => l['Gender'] === gender)
    const lastResults = lastItem ? parseNum(lastItem['Messaging checkouts started'] || lastItem['Results'] || 0) : 0
    const growth = calculateGrowth(results, lastResults)
    
    const genderLower = gender.toLowerCase()
    const isMale = genderLower === 'male'
    const isFemale = genderLower === 'female'
    const iconName = isMale ? 'gender-male' : isFemale ? 'gender-female' : 'person-fill'
    const cardClass = isMale ? 'male' : isFemale ? 'female' : 'unknown'
    const iconColor = isMale ? 'var(--primary)' : isFemale ? '#db2777' : 'var(--gray-600)'

    return `
      <div class="card gender-card ${cardClass}">
        <div class="icon" style="${!isMale && !isFemale ? 'background: var(--gray-100); color: var(--gray-600);' : ''}"><i class="bi bi-${iconName}"></i></div>
        <h3 style="font-size: 20px; margin-bottom: 8px;">${gender}</h3>
        <div style="font-size: 32px; font-weight: 700; color: ${iconColor};">${percentage.toFixed(1)}%</div>
        <p style="color: var(--gray-500); margin-bottom: 16px;">${formatNumber(results)} checkouts</p>
        
        <div style="background: var(--gray-50); border-radius: 8px; padding: 12px; margin-bottom: 12px;">
          <div style="font-size: 11px; color: var(--gray-500); text-transform: uppercase;">Amount Spent</div>
          <div style="font-size: 16px; font-weight: 600;">${formatCurrency(spent)}</div>
        </div>
        
        <div style="background: var(--gray-50); border-radius: 8px; padding: 12px; margin-bottom: 12px;">
          <div style="font-size: 11px; color: var(--gray-500); text-transform: uppercase;">Cost per Checkout</div>
          <div style="font-size: 16px; font-weight: 600;">${formatCurrency(cpr)}</div>
        </div>
        
        ${getGrowthBadgeNew(growth)}
      </div>`
  }).join('')

  return `
    <!-- SLIDE: GENDER BREAKDOWN -->
    <div class="slide" data-slide="${slideNumber}">
        <div class="slide-header">
            <img src="${LOGO_URL}" alt="Logo" class="logo">
            <span class="slide-number">Slide ${slideNumber}</span>
        </div>

        <div class="slide-title">
            <h1><i class="bi bi-people-fill"></i> Gender Breakdown</h1>
            <p>Performance by Gender</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(${data.length}, 1fr); gap: 24px;">
            ${genderCards}
        </div>

        <div class="info-box">
            <h4><i class="bi bi-lightbulb-fill"></i> Key Insight</h4>
            <ul>
                ${(() => {
                  const sorted = [...data].sort((a, b) => parseNum(b['Messaging checkouts started'] || b['Results'] || 0) - parseNum(a['Messaging checkouts started'] || a['Results'] || 0))
                  const top = sorted[0] || {}
                  const sec = sorted[1] || {}
                  const topG = top['Gender'] || 'N/A'
                  const topR = parseNum(top['Messaging checkouts started'] || top['Results'] || 0)
                  const topS = parseNum(top['Amount spent (IDR)'] || 0)
                  const topCPR = topR > 0 ? topS / topR : 0
                  const secG = sec['Gender'] || 'N/A'
                  const secR = parseNum(sec['Messaging checkouts started'] || sec['Results'] || 0)
                  const secS = parseNum(sec['Amount spent (IDR)'] || 0)
                  const secCPR = secR > 0 ? secS / secR : 0
                  const pct = totalResults > 0 ? (topR / totalResults * 100) : 0
                  const pctStr = pct.toFixed(0)
                  return `<li><strong>${topG}</strong> dominan dengan total <strong>${formatNumber(topR)} WA</strong> (${pctStr}%) dan Cost/WA <strong>${formatCurrency(topCPR)}</strong>.</li><li><strong>${secG}</strong> kontribusi <strong>${formatNumber(secR)} WA</strong> dengan Cost/WA <strong>${formatCurrency(secCPR)}</strong> ${secCPR > topCPR ? '(lebih mahal)' : '(lebih efisien)'}.</li><li>Distribusi gender menunjukkan ${pct > 70 ? 'dominasi kuat' : 'targeting yang seimbang'} pada audiens ${topG.toLowerCase()}.</li>`
                })()}
            </ul>
            <div class="reco-box">
                <h4><i class="bi bi-pencil-square"></i> Rekomendasi</h4>
                <p>${(() => {
                  const sorted = [...data].sort((a, b) => parseNum(b['Messaging checkouts started'] || b['Results'] || 0) - parseNum(a['Messaging checkouts started'] || a['Results'] || 0))
                  const topG = sorted[0]?.['Gender'] || 'dominan'
                  const secG = sorted[1]?.['Gender'] || 'lainnya'
                  return `Fokus budget pada <strong>${topG.toLowerCase()}</strong>; untuk <strong>${secG.toLowerCase()}</strong> cukup tes kreatif spesifik dengan copy/visual yang lebih relevan.`
                })()}</p>
            </div>
        </div>
    </div>`
}

function generatePlacementSlide(data: any[], lastData: any[], thisPeriodLabel: string, lastPeriodLabel: string, slideNumber: number): string {
  const sortedData = [...data].sort((a, b) => parseNum(b['Messaging checkouts started'] || b['Results'] || 0) - parseNum(a['Messaging checkouts started'] || a['Results'] || 0))

  const rows = sortedData.map((item, index) => {
    const placement = item['Placement'] || 'Unknown'
    const results = parseNum(item['Messaging checkouts started'] || item['Results'] || 0)
    const spent = parseNum(item['Amount spent (IDR)'] || 0)
    const reach = parseNum(item['Reach'] || 0)
    const impr = parseNum(item['Impressions'] || 0)
    const cpr = results > 0 ? spent / results : 0
    
    const rankBg = '#2563eb'
    const rowClass = index < 3 ? 'highlight' : ''

    return `
      <tr class="${rowClass}">
        <td><span style="display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 50%; background: ${rankBg}; color: white; font-weight: 700; font-size: 12px; margin-right: 8px;">${index + 1}</span><strong>${placement}</strong></td>
        <td><strong>${formatNumber(results)}</strong></td>
        <td>${formatCurrency(cpr)}</td>
        <td>${formatCurrency(spent)}</td>
        <td>${formatNumber(reach)}</td>
        <td>${formatNumber(impr)}</td>
      </tr>`
  }).join('')

  return `
    <!-- SLIDE: PLACEMENT BREAKDOWN -->
    <div class="slide" data-slide="${slideNumber}">
        <div class="slide-header">
            <img src="${LOGO_URL}" alt="Logo" class="logo">
            <span class="slide-number">Slide ${slideNumber}</span>
        </div>

        <div class="slide-title">
            <h1><i class="bi bi-grid-fill"></i> Placement Breakdown</h1>
            <p>Performance by Ad Placement</p>
        </div>

        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Placement</th>
                        <th>Results</th>
                        <th>CPR</th>
                        <th>Spent</th>
                        <th>Reach</th>
                        <th>Impressions</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>
        </div>

        <div class="info-box">
            <h4><i class="bi bi-lightbulb-fill"></i> Key Insight</h4>
            <ul>
                ${(() => {
                  const top = sortedData[0] || {}
                  const sec = sortedData[1] || {}
                  const third = sortedData[2] || {}
                  const topP = top['Placement'] || 'N/A'
                  const topR = parseNum(top['Messaging checkouts started'] || top['Results'] || 0)
                  const topS = parseNum(top['Amount spent (IDR)'] || 0)
                  const topCPR = topR > 0 ? topS / topR : 0
                  const topOC = parseNum(top['Outbound clicks'] || 0)
                  const secP = sec['Placement'] || 'N/A'
                  const secR = parseNum(sec['Messaging checkouts started'] || sec['Results'] || 0)
                  const secS = parseNum(sec['Amount spent (IDR)'] || 0)
                  const secCPR = secR > 0 ? secS / secR : 0
                  const thirdP = third['Placement'] || null
                  const thirdR = parseNum(third['Messaging checkouts started'] || third['Results'] || 0)
                  let html = `<li><strong>${topP}</strong> paling efektif dengan <strong>${formatNumber(topR)} WA</strong> dan Cost/WA <strong>${formatCurrency(topCPR)}</strong>.</li>`
                  html += `<li><strong>${secP}</strong> di posisi kedua dengan <strong>${formatNumber(secR)} WA</strong> dan Cost/WA <strong>${formatCurrency(secCPR)}</strong> ${secCPR > topCPR ? '(lebih mahal)' : '(lebih efisien)'}.</li>`
                  if (thirdP) html += `<li><strong>${thirdP}</strong> kontribusi <strong>${formatNumber(thirdR)} WA</strong> → bisa dijadikan placement tambahan untuk jangkauan.</li>`
                  return html
                })()}
            </ul>
            <div class="reco-box">
                <h4><i class="bi bi-pencil-square"></i> Rekomendasi</h4>
                <p>Naikkan porsi budget untuk <strong>${sortedData[0]?.['Placement'] || 'N/A'}</strong> untuk efisiensi; placement lain tetap aktif untuk menjaga jangkauan audiens.</p>
            </div>
        </div>
    </div>`
}

function generatePlatformSlide(data: any[], lastData: any[], thisPeriodLabel: string, lastPeriodLabel: string, slideNumber: number): string {
  const platformCards = data.map(item => {
    const platform = item['Platform'] || 'Unknown'
    const results = parseNum(item['Messaging checkouts started'] || item['Results'] || 0)
    const spent = parseNum(item['Amount spent (IDR)'] || 0)
    const reach = parseNum(item['Reach'] || 0)
    const cpr = results > 0 ? spent / results : 0
    
    const lastItem = lastData.find(l => l['Platform'] === platform)
    const lastResults = lastItem ? parseNum(lastItem['Messaging checkouts started'] || lastItem['Results'] || 0) : 0
    const growth = calculateGrowth(results, lastResults)
    
    const iconName = platform.toLowerCase().includes('facebook') ? 'facebook' : platform.toLowerCase().includes('instagram') ? 'instagram' : platform.toLowerCase().includes('messenger') ? 'messenger' : 'phone'
    const iconClass = platform.toLowerCase().includes('facebook') ? 'facebook' : platform.toLowerCase().includes('instagram') ? 'instagram' : 'messenger'

    return `
      <div class="card platform-card">
        <div class="icon ${iconClass}"><i class="bi bi-${iconName}"></i></div>
        <div style="flex: 1;">
          <h3 style="font-size: 16px; margin-bottom: 4px;">${platform}</h3>
          ${getGrowthBadgeNew(growth)}
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 12px;">
            <div style="background: var(--gray-50); padding: 10px; border-radius: 8px;">
              <div style="font-size: 10px; color: var(--gray-500); text-transform: uppercase;">Results</div>
              <div style="font-size: 18px; font-weight: 700; color: var(--primary);">${formatNumber(results)}</div>
            </div>
            <div style="background: var(--gray-50); padding: 10px; border-radius: 8px;">
              <div style="font-size: 10px; color: var(--gray-500); text-transform: uppercase;">CPR</div>
              <div style="font-size: 14px; font-weight: 700; color: var(--primary);">${formatCurrency(cpr)}</div>
            </div>
          </div>
        </div>
      </div>`
  }).join('')

  return `
    <!-- SLIDE: PLATFORM BREAKDOWN -->
    <div class="slide" data-slide="${slideNumber}">
        <div class="slide-header">
            <img src="${LOGO_URL}" alt="Logo" class="logo">
            <span class="slide-number">Slide ${slideNumber}</span>
        </div>

        <div class="slide-title">
            <h1><i class="bi bi-phone-fill"></i> Platform Breakdown</h1>
            <p>Performance by Platform</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(${Math.min(data.length, 3)}, 1fr); gap: 20px;">
            ${platformCards}
        </div>

        <div class="info-box">
            <h4><i class="bi bi-lightbulb-fill"></i> Key Insight</h4>
            <ul>
                ${(() => {
                  const sorted = [...data].sort((a, b) => parseNum(b['Messaging checkouts started'] || b['Results'] || 0) - parseNum(a['Messaging checkouts started'] || a['Results'] || 0))
                  const totalR = data.reduce((s, i) => s + parseNum(i['Messaging checkouts started'] || i['Results'] || 0), 0)
                  const top = sorted[0] || {}
                  const topP = top['Platform'] || 'N/A'
                  const topR = parseNum(top['Messaging checkouts started'] || top['Results'] || 0)
                  const topS = parseNum(top['Amount spent (IDR)'] || 0)
                  const topCPR = topR > 0 ? topS / topR : 0
                  const topOC = parseNum(top['Outbound clicks'] || 0)
                  const pct = totalR > 0 ? (topR / totalR * 100).toFixed(0) : 0
                  let html = `<li><strong>${topP}</strong> menyumbang <strong>${pct}%</strong> total WA (<strong>${formatNumber(topR)} WA</strong>) dengan Cost/WA <strong>${formatCurrency(topCPR)}</strong>.</li>`
                  html += `<li>Outbound clicks dari ${topP}: <strong>${formatNumber(topOC)}</strong> menunjukkan tingkat engagement yang ${topOC > 1000 ? 'tinggi' : 'sedang'}.</li>`
                  html += `<li>Platform ${sorted.length > 1 ? 'lainnya kontribusi minor dan bisa dipertimbangkan untuk tes' : 'tunggal mendominasi seluruh hasil'}.</li>`
                  return html
                })()}
            </ul>
            <div class="reco-box">
                <h4><i class="bi bi-pencil-square"></i> Rekomendasi</h4>
                <p>${(() => {
                  const sorted = [...data].sort((a, b) => parseNum(b['Messaging checkouts started'] || b['Results'] || 0) - parseNum(a['Messaging checkouts started'] || a['Results'] || 0))
                  const topP = sorted[0]?.['Platform'] || 'utama'
                  return `Fokus optimasi penuh di <strong>${topP}</strong> (format, placement, dan CTA). Platform lain bisa dijadikan eksperimen untuk diversifikasi.`
                })()}</p>
            </div>
        </div>
    </div>`
}

function generateRegionSlide(data: any[], lastData: any[], thisPeriodLabel: string, lastPeriodLabel: string, slideNumber: number): string {
  // Sort by Amount Spent (since region-level Results/checkouts aren't always available)
  const sortedData = [...data].sort((a, b) => parseNum(b['Amount spent (IDR)'] || 0) - parseNum(a['Amount spent (IDR)'] || 0)).slice(0, 10)

  const rows = sortedData.map((item, index) => {
    const region = item['Region'] || 'Unknown'
    const spent = parseNum(item['Amount spent (IDR)'] || 0)
    const reach = parseNum(item['Reach'] || 0)
    const impr = parseNum(item['Impressions'] || 0)
    const linkClicks = parseNum(item['Link clicks'] || 0)
    const ctr = impr > 0 ? (linkClicks / impr) * 100 : 0
    
    const rankBg = '#2563eb'
    const rowClass = index < 3 ? 'highlight' : ''

    return `
      <tr class="${rowClass}">
        <td style="text-align: center;"><span style="display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 50%; background: ${rankBg}; color: white; font-weight: 700; font-size: 13px;">${index + 1}</span></td>
        <td>${region}</td>
        <td><strong>${formatCurrency(spent)}</strong></td>
        <td>${formatNumber(reach)}</td>
        <td>${formatNumber(impr)}</td>
        <td>${ctr.toFixed(2)}%</td>
      </tr>`
  }).join('')

  return `
    <!-- SLIDE: REGION BREAKDOWN -->
    <div class="slide" data-slide="${slideNumber}">
        <div class="slide-header">
            <img src="${LOGO_URL}" alt="Logo" class="logo">
            <span class="slide-number">Slide ${slideNumber}</span>
        </div>

        <div class="slide-title">
            <h1><i class="bi bi-geo-alt-fill"></i> Region Breakdown</h1>
            <p>Top 10 Regions by Ad Spend</p>
        </div>

        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th style="text-align: center; width: 50px;">No.</th>
                        <th>Region</th>
                        <th>Spent</th>
                        <th>Reach</th>
                        <th>Impressions</th>
                        <th>CTR</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>
        </div>

        <div class="info-box">
            <h4><i class="bi bi-lightbulb-fill"></i> Key Insight</h4>
            <ul>
                <li><strong>${sortedData[0]?.['Region'] || 'N/A'}</strong> dengan spend terbesar <strong>${formatCurrency(parseNum(sortedData[0]?.['Amount spent (IDR)'] || 0))}</strong> dan reach <strong>${formatNumber(parseNum(sortedData[0]?.['Reach'] || 0))}</strong>.</li>
                <li><strong>${sortedData[1]?.['Region'] || 'N/A'}</strong> di posisi kedua dengan spend <strong>${formatCurrency(parseNum(sortedData[1]?.['Amount spent (IDR)'] || 0))}</strong> → potensi untuk ekspansi volume.</li>
                <li>Top 3 region menyerap mayoritas budget, perlu evaluasi ROI masing-masing untuk efisiensi.</li>
            </ul>
            <div class="reco-box">
                <h4><i class="bi bi-pencil-square"></i> Rekomendasi</h4>
                <p>Evaluasi ROI per region; alihkan sebagian budget eksplorasi ke <strong>${sortedData[1]?.['Region'] || 'region potensial'}</strong> untuk tambah volume dengan efisiensi.</p>
            </div>
        </div>
    </div>`
}

function generateObjectiveSlide(data: any[], slideNumber: number): string {
  // Debug: Log keys to see what fields are available
  if (data.length > 0) {
    // console.log('[Objective Slide] Available keys:', Object.keys(data[0]))
    // console.log('[Objective Slide] All data items:', data.map(d => ({ Objective: d['Objective'], WA: d['Messaging checkouts started'], IG: d['Instagram follows'], Spent: d['Amount spent (IDR)'] })))
  }
  
  // Filter out rows without objective (summary rows) and sort by Result WA
  const filteredData = [...data].filter(item => {
    const obj = item['Objective']
    return obj && obj !== '' && obj !== '(No Objective)' && obj !== 'undefined'
  })
  
  const sortedData = filteredData.sort((a, b) => parseNum(b['Messaging checkouts started'] || b['Results'] || 0) - parseNum(a['Messaging checkouts started'] || a['Results'] || 0))

  // Calculate totals ONLY from filtered/valid objective data
  const totalResultWA = sortedData.reduce((sum, item) => sum + parseNum(item['Messaging checkouts started'] || item['Results'] || 0), 0)
  const totalIGFollowers = sortedData.reduce((sum, item) => sum + parseNum(item['Instagram follows'] || 0), 0)
  const totalSpent = sortedData.reduce((sum, item) => sum + parseNum(item['Amount spent (IDR)'] || 0), 0)
  const totalReach = sortedData.reduce((sum, item) => sum + parseNum(item['Reach'] || 0), 0)
  const avgCPRWA = totalResultWA > 0 ? totalSpent / totalResultWA : 0
  const avgCPRIG = totalIGFollowers > 0 ? totalSpent / totalIGFollowers : 0

  // console.log('[Objective Slide] Filtered data count:', sortedData.length)
  // console.log('[Objective Slide] Totals:', { totalResultWA, totalIGFollowers, totalSpent, totalReach })

  const rows = sortedData.map((item, index) => {
    const objective = item['Objective'] || '(No Objective)'
    const resultWA = parseNum(item['Messaging checkouts started'] || item['Results'] || 0)
    const newIGFollowers = parseNum(item['Instagram follows'] || item['Follows or likes'] || item['Page likes'] || 0)
    const spent = parseNum(item['Amount spent (IDR)'] || 0)
    const reach = parseNum(item['Reach'] || 0)
    const cprWA = resultWA > 0 ? spent / resultWA : 0
    const cprIG = newIGFollowers > 0 ? spent / newIGFollowers : 0
    
    const rankBg = '#2563eb'
    const status = index === 0 ? '<span class="badge badge-success">Winner</span>' : index === 1 ? '<span class="badge badge-warning">Monitor</span>' : '<span class="badge badge-danger">Review</span>'
    const rowClass = index < 3 ? 'highlight' : ''

    return `
      <tr class="${rowClass}">
        <td><span style="display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 50%; background: ${rankBg}; color: white; font-weight: 700; font-size: 12px; margin-right: 8px;">${index + 1}</span><strong>${objective}</strong></td>
        <td><strong>${formatNumber(resultWA)}</strong></td>
        <td>${formatCurrency(cprWA)}</td>
        <td><strong>${formatNumber(newIGFollowers)}</strong></td>
        <td>${formatCurrency(cprIG)}</td>
        <td>${formatCurrency(spent)}</td>
        <td>${formatNumber(reach)}</td>
        <td style="text-align: center;">${status}</td>
      </tr>`
  }).join('')

  return `
    <!-- SLIDE: OBJECTIVE BREAKDOWN -->
    <div class="slide" data-slide="${slideNumber}">
        <div class="slide-header">
            <img src="${LOGO_URL}" alt="Logo" class="logo">
            <span class="slide-number">Slide ${slideNumber}</span>
        </div>

        <div class="slide-title">
            <h1><i class="bi bi-bullseye"></i> Objective Performance</h1>
            <p>Performance by Campaign Objective</p>
        </div>

        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Objective</th>
                        <th>Result WA</th>
                        <th>CPR WA</th>
                        <th>New IG Followers</th>
                        <th>CPR IG</th>
                        <th>Spent</th>
                        <th>Reach</th>
                        <th style="text-align: center;">Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
                <tfoot>
                    <tr style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; font-weight: 600;">
                        <td><strong>TOTAL</strong></td>
                        <td><strong>${formatNumber(totalResultWA)}</strong></td>
                        <td><strong>${formatCurrency(avgCPRWA)}</strong></td>
                        <td><strong>${formatNumber(totalIGFollowers)}</strong></td>
                        <td><strong>${formatCurrency(avgCPRIG)}</strong></td>
                        <td><strong>${formatCurrency(totalSpent)}</strong></td>
                        <td><strong>${formatNumber(totalReach)}</strong></td>
                        <td></td>
                    </tr>
                </tfoot>
            </table>
        </div>

        <div class="info-box">
            <h4><i class="bi bi-lightbulb-fill"></i> Key Insight</h4>
            <ul>
                ${(() => {
                  const top = sortedData[0] || {}
                  const sec = sortedData[1] || {}
                  const topO = top['Objective'] || '(Default)'
                  const topR = parseNum(top['Messaging checkouts started'] || top['Results'] || 0)
                  const topS = parseNum(top['Amount spent (IDR)'] || 0)
                  const topCPR = topR > 0 ? topS / topR : 0
                  const topIG = parseNum(top['Instagram follows'] || 0)
                  const topCPRIG = topIG > 0 ? topS / topIG : 0
                  const secO = sec['Objective'] || null
                  const secR = parseNum(sec['Messaging checkouts started'] || sec['Results'] || 0)
                  const secS = parseNum(sec['Amount spent (IDR)'] || 0)
                  const secCPR = secR > 0 ? secS / secR : 0
                  const topContrib = totalResultWA > 0 ? ((topR / totalResultWA) * 100).toFixed(1) : '0'
                  let html = `<li>Objective <strong>${topO}</strong> menghasilkan <strong>${formatNumber(topR)} WA</strong> (CPR <strong>${formatCurrency(topCPR)}</strong>) dan <strong>${formatNumber(topIG)} IG Followers</strong> (CPR <strong>${formatCurrency(topCPRIG)}</strong>).</li>`
                  if (secO) {
                    const secIG = parseNum(sec['Instagram follows'] || 0)
                    html += `<li>Objective <strong>${secO}</strong>: <strong>${formatNumber(secR)} WA</strong> (CPR ${formatCurrency(secCPR)}) dan <strong>${formatNumber(secIG)} IG Followers</strong>.</li>`
                  }
                  html += `<li>Total keseluruhan: <strong>${formatNumber(totalResultWA)} WA</strong> dan <strong>${formatNumber(totalIGFollowers)} IG Followers</strong> dengan spend <strong>${formatCurrency(totalSpent)}</strong>.</li>`
                  return html
                })()}
            </ul>
            <div class="reco-box">
                <h4><i class="bi bi-pencil-square"></i> Rekomendasi</h4>
                <p>Fokuskan <strong>70-80% budget</strong> pada objective dengan CPR terendah untuk memaksimalkan konversi. Gunakan objective lainnya dengan <strong>20-30% budget</strong> untuk awareness dan diversifikasi strategi.</p>
            </div>
        </div>
    </div>`
}

function generateAdCreativeSlide(data: any[], slideNumber: number): string {
  const firstItem = data[0] || {}
  const creativeNameKey = Object.keys(firstItem).find(k => k.toLowerCase() === 'ads' || k.toLowerCase() === 'ad name' || k.toLowerCase().includes('ad name') || k.toLowerCase().includes('creative')) || 'Ads'

  // console.log('[Ad Creative] Detected name key:', creativeNameKey)
  // console.log('[Ad Creative] Total items:', data.length)

  // Sort by Link Clicks (more reliable metric for ad creative comparison)
  const sortedData = [...data].filter(item => {
    const name = item[creativeNameKey]
    return name && String(name).trim() !== ''
  }).sort((a, b) => parseNum(b['Link clicks'] || 0) - parseNum(a['Link clicks'] || 0))

  const totalClicks = sortedData.reduce((sum, item) => sum + parseNum(item['Link clicks'] || 0), 0)
  const totalSpent = sortedData.reduce((sum, item) => sum + parseNum(item['Amount spent (IDR)'] || 0), 0)
  const avgCPC = totalClicks > 0 ? totalSpent / totalClicks : 0

  const rows = sortedData.map((item, index) => {
    const name = String(item[creativeNameKey] || 'Unknown').slice(0, 45) + (String(item[creativeNameKey] || '').length > 45 ? '...' : '')
    const spent = parseNum(item['Amount spent (IDR)'] || 0)
    const impr = parseNum(item['Impressions'] || 0)
    const linkClicks = parseNum(item['Link clicks'] || 0)
    const reach = parseNum(item['Reach'] || 0)
    const cpc = linkClicks > 0 ? spent / linkClicks : 0
    const ctr = impr > 0 ? (linkClicks / impr) * 100 : 0
    
    const rankBg = '#2563eb'
    const status = linkClicks > 0 && cpc < avgCPC ? '<span class="badge badge-success">Top</span>' : linkClicks > 0 ? '<span class="badge badge-warning">OK</span>' : '<span class="badge badge-danger">Low</span>'
    const rowClass = index < 3 ? 'highlight' : ''

    return `
      <tr class="${rowClass}">
        <td><span style="display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 50%; background: ${rankBg}; color: white; font-weight: 700; font-size: 12px; margin-right: 8px;">${index + 1}</span><strong>${name}</strong></td>
        <td><strong>${formatNumber(linkClicks)}</strong></td>
        <td>${formatCurrency(cpc)}</td>
        <td>${ctr.toFixed(2)}%</td>
        <td>${formatCurrency(spent)}</td>
        <td>${formatNumber(reach)}</td>
        <td style="text-align: center;">${status}</td>
      </tr>`
  }).join('')

  return `
    <!-- SLIDE: AD CREATIVE BREAKDOWN -->
    <div class="slide" data-slide="${slideNumber}">
        <div class="slide-header">
            <img src="${LOGO_URL}" alt="Logo" class="logo">
            <span class="slide-number">Slide ${slideNumber}</span>
        </div>

        <div class="slide-title">
            <h1><i class="bi bi-image-fill"></i> Ad Creative Performance</h1>
            <p>All Creatives (${sortedData.length} Total)</p>
        </div>

        <div class="full-table">
            <table>
                <thead>
                    <tr>
                        <th>Ad Name</th>
                        <th>Clicks</th>
                        <th>CPC</th>
                        <th>CTR</th>
                        <th>Spent</th>
                        <th>Reach</th>
                        <th style="text-align: center;">Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>
        </div>

        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-top: 16px;">
            <div class="mini-stat">
                <div class="label">Total Creatives</div>
                <div class="value">${sortedData.length}</div>
            </div>
            <div class="mini-stat">
                <div class="label">Total Clicks</div>
                <div class="value">${formatNumber(totalClicks)}</div>
            </div>
            <div class="mini-stat">
                <div class="label">Total Spent</div>
                <div class="value">${formatCurrency(totalSpent)}</div>
            </div>
            <div class="mini-stat">
                <div class="label">Avg CPC</div>
                <div class="value">${formatCurrency(avgCPC)}</div>
            </div>
        </div>

        <div class="info-box">
            <h4><i class="bi bi-lightbulb-fill"></i> Key Insight</h4>
            <ul>
                ${(() => {
                  const top3 = sortedData.slice(0, 3)
                  if (top3.length === 0) return '<li>Tidak ada data creative.</li>'
                  const topName = String(top3[0]?.[creativeNameKey] || 'N/A').slice(0, 35)
                  const topClicks = parseNum(top3[0]?.['Link clicks'] || 0)
                  const topSpent = parseNum(top3[0]?.['Amount spent (IDR)'] || 0)
                  const topCPC = topClicks > 0 ? topSpent / topClicks : 0
                  const topImpr = parseNum(top3[0]?.['Impressions'] || 0)
                  const topReach = parseNum(top3[0]?.['Reach'] || 0)
                  const topCTR = topImpr > 0 ? (topClicks / topImpr * 100).toFixed(2) : '0.00'
                  const topContrib = totalClicks > 0 ? ((topClicks / totalClicks) * 100).toFixed(1) : '0'
                  const belowAvgCount = sortedData.filter(item => {
                    const clicks = parseNum(item['Link clicks'] || 0)
                    const spent = parseNum(item['Amount spent (IDR)'] || 0)
                    const cpc = clicks > 0 ? spent / clicks : 999999
                    return clicks > 0 && cpc < avgCPC
                  }).length
                  let html = `<li>Top creative <strong>"${topName}${topName.length >= 35 ? '...' : ''}"</strong> menghasilkan <strong>${formatNumber(topClicks)} clicks</strong> dengan CPC <strong>${formatCurrency(topCPC)}</strong> dan CTR <strong>${topCTR}%</strong>.</li>`
                  html += `<li>Creative ini berkontribusi <strong>${topContrib}%</strong> dari total clicks dengan spend <strong>${formatCurrency(topSpent)}</strong> dan reach <strong>${formatNumber(topReach)}</strong>.</li>`
                  html += `<li>Dari <strong>${sortedData.length} creative</strong> aktif, <strong>${belowAvgCount} creative</strong> memiliki CPC dibawah rata-rata (<strong>${formatCurrency(avgCPC)}</strong>).</li>`
                  return html
                })()}
            </ul>
            <div class="reco-box">
                <h4><i class="bi bi-pencil-square"></i> Rekomendasi</h4>
                <p><strong>Scale budget</strong> untuk creative dengan CPC dibawah rata-rata (<strong>${formatCurrency(avgCPC)}</strong>). Pertimbangkan untuk <strong>pause atau revisi</strong> creative dengan CTR dibawah 0.5% untuk optimasi efisiensi.</p>
            </div>
        </div>
    </div>`
}

function generateContentPerformanceSlide(data: any[], slideNumber: number): string {
  const firstItem = data[0] || {}
  const creativeNameKey = Object.keys(firstItem).find(k => k.toLowerCase() === 'ads' || k.toLowerCase() === 'ad name' || k.toLowerCase().includes('ad name') || k.toLowerCase().includes('creative')) || 'Ads'

  // Sort by WA results (Messaging checkouts started ONLY - no fallback to Results to avoid bad data)
  const sortedData = [...data].filter(item => {
    const name = item[creativeNameKey]
    return name && String(name).trim() !== ''
  }).sort((a, b) => parseNum(b['Messaging checkouts started'] || 0) - parseNum(a['Messaging checkouts started'] || 0))

  // Get top 5 creatives
  const top5 = sortedData.slice(0, 5)
  
  // Calculate averages for comparison (use Messaging checkouts started ONLY)
  const totalWA = sortedData.reduce((sum, item) => sum + parseNum(item['Messaging checkouts started'] || 0), 0)
  const totalOC = sortedData.reduce((sum, item) => sum + parseNum(item['Outbound clicks'] || 0), 0)
  const totalSpent = sortedData.reduce((sum, item) => sum + parseNum(item['Amount spent (IDR)'] || 0), 0)
  const avgCostPerWA = totalWA > 0 ? totalSpent / totalWA : 0
  const avgConvRate = totalOC > 0 ? (totalWA / totalOC) * 100 : 0

  // Generate analysis for each creative
  const generateAnalysis = (item: any, rank: number): { metrics: string, analysis: string } => {
    const name = String(item[creativeNameKey] || 'Unknown')
    const waResults = parseNum(item['Messaging checkouts started'] || 0)
    const outboundClicks = parseNum(item['Outbound clicks'] || 0)
    const spent = parseNum(item['Amount spent (IDR)'] || 0)
    const impr = parseNum(item['Impressions'] || 0)
    const linkClicks = parseNum(item['Link clicks'] || 0)
    
    const convRate = outboundClicks > 0 ? (waResults / outboundClicks) * 100 : 0
    const ctr = impr > 0 ? (linkClicks / impr) * 100 : 0
    const costPerWA = waResults > 0 ? spent / waResults : 0
    
    const metrics = `→ <strong>${formatNumber(waResults)} WA</strong> / ${formatNumber(outboundClicks)} OC (${convRate.toFixed(1)}%), CTR ${ctr.toFixed(2)}%, Cost/WA <strong>${formatCurrency(costPerWA)}</strong>`
    
    // Generate dynamic analysis based on performance
    let analysis = ''
    
    if (rank === 1) {
      if (costPerWA <= avgCostPerWA) {
        analysis = `Paling tinggi volume WA dengan biaya efisien. <strong>Scale dengan penyesuaian hook</strong> untuk tingkatkan konversi.`
      } else {
        analysis = `Volume WA tertinggi tapi biaya per WA di atas rata-rata. <strong>Optimasi targeting</strong> untuk efisiensi lebih baik.`
      }
    } else if (costPerWA < avgCostPerWA * 0.8) {
      // Very efficient (20%+ below average)
      analysis = `Biaya per WA <strong>paling efisien</strong>. Ideal untuk <strong>duplikasi ke Stories/Reels</strong> atau kampanye hemat budget.`
    } else if (convRate > avgConvRate * 1.2) {
      // High conversion rate
      analysis = `Konversi OC→WA <strong>tertinggi</strong>. <strong>Scale agresif</strong> dan duplikasi ke format lain.`
    } else if (ctr > 0.7) {
      // High CTR but maybe low conversion
      if (convRate < avgConvRate * 0.8) {
        analysis = `CTR tinggi tapi konversi WA rendah. <strong>Perkuat CTA</strong> dan gunakan prefilled message untuk dorong percakapan.`
      } else {
        analysis = `CTR dan konversi solid. <strong>Maintain performance</strong> dan test variasi copy.`
      }
    } else if (costPerWA > avgCostPerWA * 1.2) {
      // Expensive
      analysis = `Biaya per WA lebih tinggi dari rata-rata. <strong>Optimasi copy/visual</strong> atau pertimbangkan pause.`
    } else {
      // Average performance
      analysis = `Performa cukup solid. <strong>Test variasi</strong> untuk tingkatkan efisiensi.`
    }
    
    return { metrics, analysis }
  }

  const creativeItems = top5.map((item, index) => {
    const name = String(item[creativeNameKey] || 'Unknown')
    const displayName = name.length > 50 ? name.slice(0, 50) + '…' : name
    const { metrics, analysis } = generateAnalysis(item, index + 1)
    
    return `
      <div class="content-item">
        <div class="content-header">
          <span class="content-rank">${index + 1}</span>
          <span class="content-name">${displayName}</span>
        </div>
        <div class="content-metrics">${metrics}</div>
        <div class="content-analysis">→ ${analysis}</div>
      </div>`
  }).join('')

  return `
    <!-- SLIDE: CONTENT PERFORMANCE ANALYSIS -->
    <div class="slide" data-slide="${slideNumber}">
        <div class="slide-header">
            <img src="${LOGO_URL}" alt="Logo" class="logo">
            <span class="slide-number">Slide ${slideNumber}</span>
        </div>

        <div class="slide-title">
            <h1><i class="bi bi-bar-chart-line-fill"></i> Content Performance Analisis</h1>
            <p>Top 5 Creatives by WhatsApp Results</p>
        </div>

        <style>
            .content-item {
                background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
                border-left: 4px solid var(--primary);
                border-radius: 12px;
                padding: 16px 20px;
                margin-bottom: 14px;
            }
            .content-item:nth-child(1) {
                background: linear-gradient(135deg, #fef3c7 0%, #fef9c3 100%);
                border-left-color: #f59e0b;
            }
            .content-header {
                display: flex;
                align-items: center;
                gap: 12px;
                margin-bottom: 8px;
            }
            .content-rank {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 28px;
                height: 28px;
                border-radius: 50%;
                background: var(--primary);
                color: white;
                font-weight: 700;
                font-size: 14px;
            }
            .content-item:nth-child(1) .content-rank {
                background: #f59e0b;
            }
            .content-name {
                font-weight: 600;
                font-size: 13px;
                color: var(--gray-800);
                flex: 1;
            }
            .content-metrics {
                font-size: 12px;
                color: var(--gray-600);
                margin-left: 40px;
                margin-bottom: 6px;
            }
            .content-analysis {
                font-size: 12px;
                color: var(--gray-700);
                margin-left: 40px;
                line-height: 1.5;
            }
        </style>

        <div class="content-list">
            ${creativeItems}
        </div>

        <div class="info-box" style="margin-top: 20px;">
            <h4><i class="bi bi-lightbulb-fill"></i> Summary</h4>
            <p>Dari <strong>${sortedData.length} creative</strong> aktif, top 5 menghasilkan <strong>${formatNumber(top5.reduce((sum, item) => sum + parseNum(item['Messaging checkouts started'] || item['Results'] || 0), 0))} WA</strong> (${totalWA > 0 ? ((top5.reduce((sum, item) => sum + parseNum(item['Messaging checkouts started'] || item['Results'] || 0), 0) / totalWA) * 100).toFixed(1) : 0}% dari total). Rata-rata Cost/WA: <strong>${formatCurrency(avgCostPerWA)}</strong>, Rata-rata konversi OC→WA: <strong>${avgConvRate.toFixed(1)}%</strong>.</p>
        </div>
    </div>`
}

function generateConclusionSlide(
  spend: { thisSpent: number, lastSpent: number, spendGrowth: number },
  reach: { thisReach: number, lastReach: number, reachGrowth: number },
  impr: { thisImpr: number, lastImpr: number, imprGrowth: number },
  linkClicks: { thisLinkClicks: number, lastLinkClicks: number, linkClicksGrowth: number },
  results: { thisResults: number, lastResults: number, resultsGrowth: number },
  cpr: { thisCPR: number, lastCPR: number, cprGrowth: number },
  ctr: { thisCTR: number, lastCTR: number, ctrGrowth: number },
  convRate: { thisConvRate: number, lastConvRate: number, convRateGrowth: number },
  slideNumber: number
): string {
  
  // Generate dynamic insights berdasarkan data
  const insights: string[] = []
  
  // Volume insight
  if (results.resultsGrowth > 0) {
    insights.push(`WA naik <strong>+${results.resultsGrowth.toFixed(1)}%</strong> (${formatNumber(results.lastResults)} → ${formatNumber(results.thisResults)})`)
  } else if (results.resultsGrowth < 0) {
    insights.push(`WA turun <strong>${results.resultsGrowth.toFixed(1)}%</strong> (${formatNumber(results.lastResults)} → ${formatNumber(results.thisResults)})`)
  }
  
  // Efficiency insight
  if (cpr.cprGrowth < 0) {
    insights.push(`CPC membaik <strong>${Math.abs(cpr.cprGrowth).toFixed(1)}%</strong> (${formatCurrency(cpr.lastCPR)} → ${formatCurrency(cpr.thisCPR)})`)
  } else if (cpr.cprGrowth > 0) {
    insights.push(`CPR naik <strong>+${cpr.cprGrowth.toFixed(1)}%</strong> - perlu optimasi`)
  }
  
  // Additional metrics
  if (ctr.ctrGrowth > 0) {
    insights.push(`CTR naik <strong>+${ctr.ctrGrowth.toFixed(1)}%</strong> - creative efektif`)
  } else if (ctr.ctrGrowth < -10) {
    insights.push(`CTR turun <strong>${ctr.ctrGrowth.toFixed(1)}%</strong> - refresh creative`)
  }

  const insightsList = insights.slice(0, 4).map((insight, i) => `
    <div class="numbered-item">
      <div class="number blue">${i + 1}</div>
      <p>${insight}</p>
    </div>`).join('')

  // Dynamic recommendations based on performance
  const recommendations: string[] = []
  if (cpr.cprGrowth <= 0) {
    recommendations.push('Pertahankan strategi saat ini, CPR sudah efisien')
  } else {
    recommendations.push('Optimalkan targeting untuk turunkan CPR')
  }
  if (results.resultsGrowth < 0) {
    recommendations.push('Scale budget untuk tingkatkan volume WA')
  } else {
    recommendations.push('Duplikasi winning ads untuk pertahankan volume')
  }
  recommendations.push('Test 2-3 creative baru per minggu')
  recommendations.push('Fokus budget ke placement & platform terbaik')

  const recoList = recommendations.slice(0, 4).map((reco, i) => `
    <div class="numbered-item">
      <div class="number orange">${i + 1}</div>
      <p>${reco}</p>
    </div>`).join('')

  // Overall summary
  let overallSummary = ''
  if (results.resultsGrowth > 0 && cpr.cprGrowth < 0) {
    overallSummary = `Performa sangat baik. Volume naik dan biaya turun - scaling berhasil.`
  } else if (results.resultsGrowth > 0 && cpr.cprGrowth > 0) {
    overallSummary = `Volume meningkat tapi efisiensi perlu dijaga. Fokus optimasi CPR.`
  } else if (results.resultsGrowth < 0 && cpr.cprGrowth < 0) {
    overallSummary = `Efisiensi membaik tapi volume turun. Perlu strategi scale.`
  } else {
    overallSummary = `Perlu evaluasi menyeluruh pada targeting dan creative.`
  }

  return `
    <!-- SLIDE: CONCLUSION -->
    <div class="slide" data-slide="${slideNumber}">
        <div class="slide-header">
            <img src="${LOGO_URL}" alt="Logo" class="logo">
            <span class="slide-number">Slide ${slideNumber}</span>
        </div>

        <div class="slide-title">
            <h1><i class="bi bi-clipboard-check-fill"></i> Kesimpulan & Rekomendasi</h1>
            <p>Summary & Action Items</p>
        </div>

        <div class="summary-box" style="margin-bottom: 24px;">
            <h3><i class="bi bi-bar-chart-fill"></i> Kesimpulan</h3>
            <p>
                WA Started <span class="${results.resultsGrowth >= 0 ? 'growth-up' : 'growth-down'}">${results.resultsGrowth >= 0 ? '+' : ''}${results.resultsGrowth.toFixed(1)}%</span> 
                (${formatNumber(results.lastResults)} → ${formatNumber(results.thisResults)}), 
                CPR <span class="${cpr.cprGrowth <= 0 ? 'growth-up' : 'growth-down'}">${cpr.cprGrowth >= 0 ? '+' : ''}${cpr.cprGrowth.toFixed(1)}%</span>
                (${formatCurrency(cpr.lastCPR)} → ${formatCurrency(cpr.thisCPR)}).
                <strong>${overallSummary}</strong>
            </p>
        </div>

        <div class="two-col">
            <div>
                <h3 style="color: var(--primary); margin-bottom: 16px;"><i class="bi bi-lightbulb-fill"></i> Key Insight</h3>
                <div class="numbered-list">
                    ${insightsList}
                </div>
            </div>
            <div>
                <h3 style="color: var(--warning); margin-bottom: 16px;"><i class="bi bi-pencil-square"></i> Rekomendasi</h3>
                <div class="numbered-list">
                    ${recoList}
                </div>
            </div>
        </div>
    </div>`
}

function generateNextMonthTargetSlide(
  current: { thisSpent: number, thisResults: number, thisCPR: number, thisReach: number },
  growth: { resultsGrowth: number, cprGrowth: number },
  slideNumber: number
): string {
  const targetGrowthRate = growth.resultsGrowth >= 0 ? 0.15 : 0.30
  const targetSpend = current.thisSpent * (1 + (growth.resultsGrowth >= 0 ? 0.10 : 0.20))
  const targetResults = Math.ceil(current.thisResults * (1 + targetGrowthRate))
  const targetCPR = current.thisCPR * (growth.cprGrowth <= 0 ? 0.95 : 0.90)
  const targetReach = Math.ceil(current.thisReach * 1.20)

  return `
    <!-- SLIDE: NEXT MONTH TARGET -->
    <div class="slide" data-slide="${slideNumber}">
        <div class="slide-header">
            <img src="${LOGO_URL}" alt="Logo" class="logo">
            <span class="slide-number">Slide ${slideNumber}</span>
        </div>

        <div class="slide-title">
            <h1><i class="bi bi-bullseye"></i> Next Month Target</h1>
            <p>Performance Goals & KPIs</p>
        </div>

        <!-- Target Cards -->
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 24px;">
            <div class="card" style="text-align: center; border-top: 4px solid var(--primary);">
                <div class="metric-icon blue"><i class="bi bi-wallet2"></i></div>
                <div class="metric-label">Budget Target</div>
                <div style="font-size: 12px; color: var(--gray-400); margin-bottom: 4px;">Current: ${formatCurrency(current.thisSpent)}</div>
                <div class="metric-value">${formatCurrency(targetSpend)}</div>
                <span class="badge badge-success"><i class="bi bi-arrow-up"></i> +${((targetSpend / current.thisSpent - 1) * 100).toFixed(0)}%</span>
            </div>
            <div class="card" style="text-align: center; border-top: 4px solid var(--success);">
                <div class="metric-icon green"><i class="bi bi-chat-dots-fill"></i></div>
                <div class="metric-label">Conv. Target</div>
                <div style="font-size: 12px; color: var(--gray-400); margin-bottom: 4px;">Current: ${formatNumber(current.thisResults)}</div>
                <div class="metric-value">${formatNumber(targetResults)}</div>
                <span class="badge badge-success"><i class="bi bi-arrow-up"></i> +${(targetGrowthRate * 100).toFixed(0)}%</span>
            </div>
            <div class="card" style="text-align: center; border-top: 4px solid var(--warning);">
                <div class="metric-icon orange"><i class="bi bi-currency-dollar"></i></div>
                <div class="metric-label">CPR Target</div>
                <div style="font-size: 12px; color: var(--gray-400); margin-bottom: 4px;">Current: ${formatCurrency(current.thisCPR)}</div>
                <div class="metric-value">${formatCurrency(targetCPR)}</div>
                <span class="badge badge-success"><i class="bi bi-arrow-down"></i> -${((1 - targetCPR / current.thisCPR) * 100).toFixed(0)}%</span>
            </div>
            <div class="card" style="text-align: center; border-top: 4px solid #8b5cf6;">
                <div class="metric-icon" style="background: #ede9fe; color: #8b5cf6;"><i class="bi bi-people-fill"></i></div>
                <div class="metric-label">Reach Target</div>
                <div style="font-size: 12px; color: var(--gray-400); margin-bottom: 4px;">Current: ${formatNumber(current.thisReach)}</div>
                <div class="metric-value">${formatNumber(targetReach)}</div>
                <span class="badge badge-success"><i class="bi bi-arrow-up"></i> +20%</span>
            </div>
        </div>

        <!-- Action Items -->
        <div class="table-container">
            <table>
                <thead style="background: var(--primary);">
                    <tr>
                        <th><i class="bi bi-list-check"></i> Action Items</th>
                        <th style="text-align: center;">Priority</th>
                        <th style="text-align: center;">Timeline</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Scale budget untuk winning placement & audience</td>
                        <td style="text-align: center;"><span class="badge priority-high">HIGH</span></td>
                        <td style="text-align: center;">Week 1</td>
                    </tr>
                    <tr>
                        <td>A/B test 3-5 creative variants baru</td>
                        <td style="text-align: center;"><span class="badge priority-high">HIGH</span></td>
                        <td style="text-align: center;">Week 1-2</td>
                    </tr>
                    <tr>
                        <td>Pause underperforming ad sets (CPR > ${formatCurrency(current.thisCPR * 1.5)})</td>
                        <td style="text-align: center;"><span class="badge priority-medium">MEDIUM</span></td>
                        <td style="text-align: center;">Immediate</td>
                    </tr>
                    <tr>
                        <td>Test new lookalike audiences</td>
                        <td style="text-align: center;"><span class="badge priority-medium">MEDIUM</span></td>
                        <td style="text-align: center;">Week 2</td>
                    </tr>
                    <tr>
                        <td>Review & optimize bidding strategy</td>
                        <td style="text-align: center;"><span class="badge priority-low">LOW</span></td>
                        <td style="text-align: center;">Week 3</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="info-box" style="margin-top: 20px;">
            <p><strong><i class="bi bi-info-circle-fill"></i> Note:</strong> Target ini disusun berdasarkan performa bulan ini. Evaluasi mingguan diperlukan untuk memastikan pencapaian target.</p>
        </div>
    </div>`
}
