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
import {
  getSafeBreakdownData,
  getTopPerformer,
  getTopItems,
  getDimensionValue
} from '../breakdown-helpers'

// Bootstrap Icons CDN
const BOOTSTRAP_ICONS_CDN = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css'

// Icon helper function
const icon = (name: string, size: number = 16, color?: string) => {
  const colorStyle = color ? `color: ${color};` : ''
  return `<i class="bi bi-${name}" style="font-size: ${size}px; ${colorStyle}"></i>`
}

// Compact formatters for dense displays
const formatNumberCompact = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toFixed(0)
}

const formatCurrencyCompact = (amount: number): string => {
  if (amount >= 1000000) return 'Rp' + (amount / 1000000).toFixed(1) + 'M'
  if (amount >= 1000) return 'Rp' + (amount / 1000).toFixed(1) + 'K'
  return 'Rp' + amount.toFixed(0)
}

// Compact growth badge for dense displays
const getGrowthBadgeNew = (growth: number, inverse: boolean = false): string => {
  const isGood = inverse ? growth < 0 : growth > 0
  const icon = growth > 0 ? '↑' : growth < 0 ? '↓' : '→'
  const color = isGood ? 'var(--success)' : 'var(--danger)'
  const bgColor = isGood ? 'var(--success-light)' : 'var(--danger-light)'

  if (growth === 0) return `<span style="font-size: 9px; padding: 2px 6px; border-radius: 4px; background: var(--gray-200); color: var(--gray-600); font-weight: 600;">0%</span>`

  return `<span style="font-size: 9px; padding: 2px 6px; border-radius: 4px; background: ${bgColor}; color: ${color}; font-weight: 600;">${icon}${Math.abs(growth).toFixed(1)}%</span>`
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
  const thisResults = parseNum(thisWeekData.messagingConversations || thisWeekData.results)
  const lastResults = parseNum(lastWeekData.messagingConversations || lastWeekData.results)
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
  const thisROAS = thisSpent > 0 ? (thisSpent / thisResults) * 10 : 0 // Simplified ROAS
  const lastROAS = lastSpent > 0 ? (lastSpent / lastResults) * 10 : 0

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

  // Breakdown data - BUG #3 FIX: Safe breakdown access
  const ageData = getSafeBreakdownData(breakdownThisWeek.age)
  const genderData = getSafeBreakdownData(breakdownThisWeek.gender)
  const regionData = getSafeBreakdownData(breakdownThisWeek.region)
  const platformData = getSafeBreakdownData(breakdownThisWeek.platform)
  const placementData = getSafeBreakdownData(breakdownThisWeek.placement)
  const objectiveData = getSafeBreakdownData(breakdownThisWeek.objective)
  const adCreativeData = getSafeBreakdownData(breakdownThisWeek['ad-creative'] || breakdownThisWeek.adCreative)

  const ageDataLast = getSafeBreakdownData(breakdownLastWeek.age)
  const genderDataLast = getSafeBreakdownData(breakdownLastWeek.gender)
  const regionDataLast = getSafeBreakdownData(breakdownLastWeek.region)
  const platformDataLast = getSafeBreakdownData(breakdownLastWeek.platform)
  const placementDataLast = getSafeBreakdownData(breakdownLastWeek.placement)

  const isGoodPerformance = cprGrowth <= 0 || (resultsGrowth > 0 && cprGrowth < 10)

  let slideNumber = 0

  let html = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CTWA Report - ${defaultReportName}</title>
    <link href="${BOOTSTRAP_ICONS_CDN}" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        /* COMPACT DESIGN SYSTEM - Font sizes reduced 15-20%, tighter spacing */
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

            /* Compact spacing variables */
            --space-xs: 4px;
            --space-sm: 8px;
            --space-md: 12px;
            --space-lg: 16px;
            --space-xl: 20px;
            --space-2xl: 24px;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: var(--gray-100);
            color: var(--gray-800);
            line-height: 1.4; /* COMPACT: Reduced from 1.5 */
            -webkit-font-smoothing: antialiased;
        }

        .slide {
            width: 100%;
            min-height: 100vh;
            background: white;
            padding: 28px 40px; /* COMPACT: Reduced from 40px 56px */
            position: relative;
            page-break-after: always;
            border-bottom: 1px solid var(--gray-200);
        }

        .slide-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 20px; /* COMPACT: Reduced from 32px */
            padding-bottom: 12px; /* COMPACT: Reduced from 20px */
            border-bottom: 2px solid var(--gray-100);
        }

        .slide-header .logo {
            height: 32px; /* COMPACT: Reduced from 40px */
            width: auto;
        }

        .slide-header .slide-number {
            font-size: 10px; /* COMPACT: Reduced from 12px */
            color: var(--gray-400);
            font-weight: 500;
        }

        .slide-title {
            margin-bottom: 20px; /* COMPACT: Reduced from 32px */
        }

        .slide-title h1 {
            font-size: 22px; /* COMPACT: Reduced from 28px */
            font-weight: 700;
            color: var(--gray-900);
            margin-bottom: 6px; /* COMPACT: Reduced from 8px */
            display: flex;
            align-items: center;
            gap: 10px; /* COMPACT: Reduced from 12px */
        }

        .slide-title h1 i {
            color: var(--primary);
        }

        .slide-title p {
            font-size: 13px; /* COMPACT: Reduced from 15px */
            color: var(--gray-500);
        }

        /* COMPACT CARDS */
        .card {
            background: white;
            border: 1px solid var(--gray-200);
            border-radius: 10px; /* COMPACT: Reduced from 12px */
            padding: 14px; /* COMPACT: Reduced from 20px */
            transition: all 0.2s ease;
        }

        .card:hover {
            border-color: var(--primary);
            box-shadow: 0 3px 8px rgba(37, 99, 235, 0.08); /* COMPACT: Reduced shadow */
        }

        .card-header {
            display: flex;
            align-items: center;
            gap: 8px; /* COMPACT: Reduced from 10px */
            margin-bottom: 12px; /* COMPACT: Reduced from 16px */
            padding-bottom: 8px; /* COMPACT: Reduced from 12px */
            border-bottom: 1px solid var(--gray-100);
        }

        .card-header i {
            font-size: 16px; /* COMPACT: Reduced from 18px */
            color: var(--primary);
        }

        .card-header span {
            font-size: 11px; /* COMPACT: Reduced from 13px */
            font-weight: 600;
            color: var(--gray-600);
            text-transform: uppercase;
            letter-spacing: 0.4px; /* COMPACT: Reduced from 0.5px */
        }

        /* COMPACT METRICS */
        .metric-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 14px; /* COMPACT: Reduced from 20px */
        }

        .metric-card {
            background: var(--gray-50);
            border: 1px solid var(--gray-200);
            border-radius: 10px; /* COMPACT: Reduced from 12px */
            padding: 14px; /* COMPACT: Reduced from 20px */
            text-align: center;
        }

        .metric-card.highlight {
            background: var(--primary-light);
            border-color: var(--primary);
        }

        .metric-icon {
            width: 40px; /* COMPACT: Reduced from 48px */
            height: 40px; /* COMPACT: Reduced from 48px */
            border-radius: 10px; /* COMPACT: Reduced from 12px */
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 10px; /* COMPACT: Reduced from 12px */
            font-size: 20px; /* COMPACT: Reduced from 24px */
        }

        .metric-icon.blue { background: var(--primary-light); color: var(--primary); }
        .metric-icon.green { background: var(--success-light); color: var(--success); }
        .metric-icon.orange { background: var(--warning-light); color: var(--warning); }
        .metric-icon.red { background: var(--danger-light); color: var(--danger); }

        .metric-label {
            font-size: 11px; /* COMPACT: Reduced from 12px */
            font-weight: 600;
            color: var(--gray-500);
            text-transform: uppercase;
            letter-spacing: 0.4px; /* COMPACT: Reduced from 0.5px */
            margin-bottom: 6px; /* COMPACT: Reduced from 8px */
        }

        .metric-value {
            font-size: 20px; /* COMPACT: Reduced from 24px */
            font-weight: 700;
            color: var(--gray-900);
            margin-bottom: 3px; /* COMPACT: Reduced from 4px */
        }

        .metric-compare {
            font-size: 11px; /* COMPACT: Reduced from 12px */
            color: var(--gray-500);
            margin-bottom: 6px; /* COMPACT: Reduced from 8px */
        }

        /* COMPACT BADGES */
        .badge {
            display: inline-flex;
            align-items: center;
            gap: 3px; /* COMPACT: Reduced from 4px */
            padding: 3px 8px; /* COMPACT: Reduced from 4px 10px */
            border-radius: 5px; /* COMPACT: Reduced from 6px */
            font-size: 10px; /* COMPACT: Reduced from 12px */
            font-weight: 600;
        }

        .badge-success { background: var(--success-light); color: var(--success); }
        .badge-danger { background: var(--danger-light); color: var(--danger); }
        .badge-warning { background: var(--warning-light); color: var(--warning); }
        .badge-primary { background: var(--primary-light); color: var(--primary); }

        /* COMPACT TABLES */
        .table-container {
            border: 1px solid var(--gray-200);
            border-radius: 10px; /* COMPACT: Reduced from 12px */
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
            padding: 10px 12px; /* COMPACT: Reduced from 14px 16px */
            font-size: 11px; /* COMPACT: Reduced from 12px */
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.4px; /* COMPACT: Reduced from 0.5px */
            text-align: left;
            white-space: nowrap; /* COMPACT: Prevent wrapping */
        }

        th:not(:first-child) {
            text-align: right;
        }

        td {
            padding: 8px 12px; /* COMPACT: Reduced from 12px 16px */
            font-size: 11px; /* COMPACT: Reduced from 13px */
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

        /* Funnel - COMPACT */
        .funnel-container {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px; /* COMPACT: Reduced from 16px */
            padding: 16px; /* COMPACT: Reduced from 24px */
            background: var(--gray-50);
            border-radius: 12px; /* COMPACT: Reduced from 16px */
            margin-bottom: 16px; /* COMPACT: Reduced from 24px */
        }

        .funnel-step {
            background: white;
            border: 2px solid var(--gray-200);
            border-radius: 10px; /* COMPACT: Reduced from 12px */
            padding: 14px 16px; /* COMPACT: Reduced from 20px 24px */
            text-align: center;
            min-width: 140px; /* COMPACT: Reduced from 160px */
        }

        .funnel-step.active {
            border-color: var(--primary);
            background: var(--primary-light);
        }

        .funnel-step .step-label {
            font-size: 10px; /* COMPACT: Reduced from 11px */
            font-weight: 600;
            color: var(--gray-500);
            text-transform: uppercase;
            letter-spacing: 0.4px; /* COMPACT: Reduced from 0.5px */
            margin-bottom: 6px; /* COMPACT: Reduced from 8px */
        }

        .funnel-step .step-value {
            font-size: 20px; /* COMPACT: Reduced from 24px */
            font-weight: 700;
            color: var(--gray-900);
        }

        .funnel-arrow {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 3px; /* COMPACT: Reduced from 4px */
        }

        .funnel-arrow i {
            font-size: 20px; /* COMPACT: Reduced from 24px */
            color: var(--gray-400);
        }

        .funnel-arrow .rate {
            font-size: 10px; /* COMPACT: Reduced from 11px */
            font-weight: 600;
            padding: 3px 6px; /* COMPACT: Reduced from 4px 8px */
            border-radius: 4px;
            background: var(--warning-light);
            color: var(--warning);
        }

        /* Two Column Layout - COMPACT */
        .two-col {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px; /* COMPACT: Reduced from 24px */
        }

        /* Highlights Box - COMPACT */
        .highlight-box {
            border-radius: 10px; /* COMPACT: Reduced from 12px */
            padding: 16px; /* COMPACT: Reduced from 24px */
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
            font-size: 13px; /* COMPACT: Reduced from 16px */
            font-weight: 700;
            margin-bottom: 12px; /* COMPACT: Reduced from 16px */
            display: flex;
            align-items: center;
            gap: 6px; /* COMPACT: Reduced from 8px */
        }

        .highlight-box.success h3 { color: var(--success); }
        .highlight-box.danger h3 { color: var(--danger); }

        .highlight-item {
            background: white;
            border-radius: 6px; /* COMPACT: Reduced from 8px */
            padding: 10px 12px; /* COMPACT: Reduced from 12px 16px */
            margin-bottom: 8px; /* COMPACT: Reduced from 10px */
            display: flex;
            align-items: flex-start;
            gap: 10px; /* COMPACT: Reduced from 12px */
        }

        .highlight-item i {
            font-size: 14px; /* COMPACT: Reduced from 16px */
            margin-top: 1px; /* COMPACT: Reduced from 2px */
        }

        .highlight-item strong {
            display: block;
            font-size: 11px; /* COMPACT: Reduced from 13px */
            color: var(--gray-800);
            margin-bottom: 2px;
        }

        .highlight-item p {
            font-size: 10px; /* COMPACT: Reduced from 12px */
            color: var(--gray-500);
            margin: 0;
        }

        /* Info Box - Konsisten dengan Summary Box - COMPACT */
        .info-box {
            background: linear-gradient(135deg, var(--primary-light) 0%, #eff6ff 100%);
            border-left: 4px solid var(--primary);
            border-radius: 10px; /* COMPACT: Reduced from 12px */
            padding: 14px 16px; /* COMPACT: Reduced from 20px 24px */
            margin-top: 16px; /* COMPACT: Reduced from 24px */
        }

        .info-box h4 {
            font-size: 12px; /* COMPACT: Reduced from 13px */
            font-weight: 700;
            color: var(--primary-dark);
            margin-bottom: 8px; /* COMPACT: Reduced from 10px */
            display: flex;
            align-items: center;
            gap: 6px; /* COMPACT: Reduced from 8px */
        }

        .info-box p {
            font-size: 11px; /* COMPACT: Reduced from 13px */
            color: var(--gray-700);
            line-height: 1.5; /* COMPACT: Reduced from 1.7 */
            margin: 0 0 6px 0; /* COMPACT: Reduced from 8px */
        }

        .info-box p:last-child {
            margin-bottom: 0;
        }

        .info-box strong {
            color: var(--primary-dark);
        }

        .info-box ul {
            margin: 0 0 8px 0; /* COMPACT: Reduced from 12px */
            padding-left: 16px; /* COMPACT: Reduced from 20px */
            font-size: 11px; /* COMPACT: Reduced from 13px */
            color: var(--gray-700);
            line-height: 1.5; /* COMPACT: Reduced from 1.7 */
        }

        .info-box ul li {
            margin-bottom: 4px; /* COMPACT: Reduced from 6px */
        }

        .info-box ul li:last-child {
            margin-bottom: 0;
        }

        .reco-box {
            background: linear-gradient(135deg, var(--warning-light) 0%, #fffbeb 100%);
            border-left: 4px solid var(--warning);
            border-radius: 6px; /* COMPACT: Reduced from 8px */
            padding: 10px 12px; /* COMPACT: Reduced from 14px 18px */
            margin-top: 8px; /* COMPACT: Reduced from 12px */
        }

        .reco-box h4 {
            font-size: 11px; /* COMPACT: Reduced from 12px */
            font-weight: 700;
            color: var(--warning);
            margin-bottom: 4px; /* COMPACT: Reduced from 6px */
            display: flex;
            align-items: center;
            gap: 5px; /* COMPACT: Reduced from 6px */
        }

        .reco-box p {
            font-size: 11px; /* COMPACT: Reduced from 13px */
            color: var(--gray-700);
            line-height: 1.4; /* COMPACT: Reduced from 1.6 */
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

        /* Status Badge - COMPACT */
        .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px; /* COMPACT: Reduced from 8px */
            padding: 8px 18px; /* COMPACT: Reduced from 12px 24px */
            border-radius: 50px;
            font-size: 12px; /* COMPACT: Reduced from 14px */
            font-weight: 700;
            margin-bottom: 16px; /* COMPACT: Reduced from 24px */
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

        /* Bar Chart - COMPACT */
        .bar-chart-item {
            margin-bottom: 12px; /* COMPACT: Reduced from 16px */
        }

        .bar-chart-label {
            display: flex;
            justify-content: space-between;
            margin-bottom: 4px; /* COMPACT: Reduced from 6px */
            font-size: 11px; /* COMPACT: Reduced from 13px */
        }

        .bar-chart-label .name {
            font-weight: 600;
            color: var(--gray-800);
        }

        .bar-chart-label .value {
            color: var(--gray-600);
        }

        .bar-chart-track {
            height: 18px; /* COMPACT: Reduced from 24px */
            background: var(--gray-100);
            border-radius: 5px; /* COMPACT: Reduced from 6px */
            overflow: hidden;
        }

        .bar-chart-fill {
            height: 100%;
            background: linear-gradient(90deg, var(--primary) 0%, var(--primary-dark) 100%);
            border-radius: 5px; /* COMPACT: Reduced from 6px */
            display: flex;
            align-items: center;
            justify-content: flex-end;
            padding-right: 6px; /* COMPACT: Reduced from 8px */
            min-width: 30px; /* COMPACT: Reduced from 40px */
        }

        .bar-chart-fill span {
            font-size: 10px; /* COMPACT: Reduced from 11px */
            font-weight: 600;
            color: white;
        }

        /* Gender Cards - COMPACT */
        .gender-card {
            text-align: center;
            padding: 16px; /* COMPACT: Reduced from 24px */
        }

        .gender-card .icon {
            width: 48px; /* COMPACT: Reduced from 64px */
            height: 48px; /* COMPACT: Reduced from 64px */
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 12px; /* COMPACT: Reduced from 16px */
            font-size: 24px; /* COMPACT: Reduced from 32px */
        }

        .gender-card.male .icon {
            background: var(--primary-light);
            color: var(--primary);
        }

        .gender-card.female .icon {
            background: #fce7f3;
            color: #db2777;
        }

        /* Platform Cards - COMPACT */
        .platform-card {
            display: flex;
            align-items: flex-start;
            gap: 12px; /* COMPACT: Reduced from 16px */
            padding: 14px; /* COMPACT: Reduced from 20px */
        }

        .platform-card .icon {
            width: 40px; /* COMPACT: Reduced from 48px */
            height: 40px; /* COMPACT: Reduced from 48px */
            border-radius: 10px; /* COMPACT: Reduced from 12px */
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px; /* COMPACT: Reduced from 24px */
        }

        .platform-card .icon.facebook { background: #e7f3ff; color: #1877f2; }
        .platform-card .icon.instagram { background: #fce7f3; color: #e4405f; }
        .platform-card .icon.messenger { background: #e7f3ff; color: #0084ff; }

        /* Summary Box - COMPACT */
        .summary-box {
            background: linear-gradient(135deg, var(--primary-light) 0%, #eff6ff 100%);
            border-left: 4px solid var(--primary);
            border-radius: 10px; /* COMPACT: Reduced from 12px */
            padding: 14px 16px; /* COMPACT: Reduced from 20px 24px */
            margin-bottom: 16px; /* COMPACT: Reduced from 24px */
        }

        .summary-box h3 {
            font-size: 12px; /* COMPACT: Reduced from 14px */
            font-weight: 700;
            color: var(--primary-dark);
            margin-bottom: 6px; /* COMPACT: Reduced from 8px */
            display: flex;
            align-items: center;
            gap: 6px; /* COMPACT: Reduced from 8px */
        }

        .summary-box p {
            font-size: 12px; /* COMPACT: Reduced from 14px */
            color: var(--gray-700);
            line-height: 1.5; /* COMPACT: Reduced from 1.7 */
        }

        /* Numbered List - COMPACT */
        .numbered-list {
            display: flex;
            flex-direction: column;
            gap: 8px; /* COMPACT: Reduced from 10px */
        }

        .numbered-item {
            display: flex;
            align-items: flex-start;
            gap: 10px; /* COMPACT: Reduced from 12px */
            background: white;
            padding: 10px 12px; /* COMPACT: Reduced from 12px 16px */
            border-radius: 6px; /* COMPACT: Reduced from 8px */
            border: 1px solid var(--gray-200);
        }

        .numbered-item .number {
            width: 20px; /* COMPACT: Reduced from 24px */
            height: 20px; /* COMPACT: Reduced from 24px */
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 11px; /* COMPACT: Reduced from 12px */
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
            font-size: 11px; /* COMPACT: Reduced from 13px */
            color: var(--gray-700);
            line-height: 1.4; /* COMPACT: Reduced from 1.5 */
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

        /* Mini Stats - COMPACT */
        .mini-stats {
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            gap: 8px; /* COMPACT: Reduced from 12px */
            margin-top: 14px; /* COMPACT: Reduced from 20px */
        }

        .mini-stat {
            background: var(--gray-50);
            border: 1px solid var(--gray-200);
            border-radius: 6px; /* COMPACT: Reduced from 8px */
            padding: 8px; /* COMPACT: Reduced from 12px */
            text-align: center;
        }

        .mini-stat .label {
            font-size: 9px; /* COMPACT: Reduced from 10px */
            font-weight: 600;
            color: var(--gray-500);
            text-transform: uppercase;
            letter-spacing: 0.4px; /* COMPACT: Reduced from 0.5px */
            margin-bottom: 3px; /* COMPACT: Reduced from 4px */
        }

        .mini-stat .value {
            font-size: 12px; /* COMPACT: Reduced from 14px */
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

        /* Print/PDF styles - LANDSCAPE ORIENTATION */
        @page {
            size: A4 landscape;
            margin: 0;
        }

        @media print {
            .scrollable-table,
            .full-table {
                max-height: none !important;
                overflow: visible !important;
            }
            .slide {
                page-break-after: always;
                page-break-inside: avoid;
                min-height: 100vh;
            }
            body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
        }

        /* Priority Badge */
        .priority-high { background: var(--danger-light); color: var(--danger); }
        .priority-medium { background: var(--warning-light); color: var(--warning); }
        .priority-low { background: var(--success-light); color: var(--success); }

        .growth-up { color: var(--success); }
        .growth-down { color: var(--danger); }

        /* Version Footer */
        .version-footer {
            position: fixed;
            bottom: 8px;
            right: 12px;
            font-size: 7px;
            font-weight: 600;
            color: var(--gray-400);
            opacity: 0.6;
            letter-spacing: 0.3px;
            z-index: 1000;
        }

        @media print {
            .version-footer {
                position: fixed;
                bottom: 6px;
                right: 10px;
                font-size: 6px;
            }
        }
    </style>
</head>
<body>

    <!-- Version Footer - Appears on all slides -->
    <div class="version-footer">
        v2.0.0 • Compact Design System
    </div>

    <!-- SLIDE 1: COVER -->
    <div class="slide cover-slide" data-slide="${++slideNumber}">
        <img src="${LOGO_URL}" alt="Logo" class="logo">
        
        <div class="badge-period">${periodType.toUpperCase()}</div>
        
        <h1>CTWA Monthly Report</h1>
        <h2>${defaultReportName}</h2>
        <p class="period">${lastPeriodLabel} vs ${thisPeriodLabel}</p>
        
        <div class="confidential">
            <p>${icon('lock-fill', 14)} <strong>Private & Confidential</strong></p>
            <p style="margin-top: 8px; opacity: 0.8;">This report contains proprietary insights prepared exclusively for our valued client.</p>
        </div>

        <!-- Version Badge on Cover -->
        <div style="margin-top: 24px; padding: 8px 20px; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3); border-radius: 20px; display: inline-block;">
            <p style="font-size: 11px; margin: 0; opacity: 0.9;">
                <strong style="color: var(--warning);">Version 2.0.0</strong> • Compact Design System
            </p>
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

        <!-- Status Badge with Inline Summary - COMPACT -->
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 16px; padding: 10px 14px; background: ${isGoodPerformance ? 'var(--success-light)' : 'var(--warning-light)'}; border-left: 4px solid ${isGoodPerformance ? 'var(--success)' : 'var(--warning)'}; border-radius: 8px;">
            <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 11px; font-weight: 700; color: ${isGoodPerformance ? 'var(--success)' : 'var(--warning)'};">
                    ${isGoodPerformance ? icon('check-circle-fill', 16) : icon('exclamation-triangle-fill', 16)}
                    ${isGoodPerformance ? 'GOOD PERFORMANCE' : 'NEEDS ATTENTION'}
                </span>
            </div>
            <div style="font-size: 10px; color: var(--gray-700);">
                <strong>${resultsGrowth >= 0 ? '↑' : '↓'} ${Math.abs(resultsGrowth).toFixed(1)}%</strong> Conversations •
                CPR: ${cprGrowth <= 0 ? '↓' : '↑'} ${Math.abs(cprGrowth).toFixed(1)}%
            </div>
        </div>

        <!-- 6 Compact Key Metrics Grid - DENSE -->
        <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 10px; margin-bottom: 14px;">
            <div class="card" style="text-align: center; padding: 10px 8px; border-top: 3px solid var(--primary);">
                <div class="metric-label" style="margin-bottom: 4px; font-size: 9px;">Spend</div>
                <div class="metric-value" style="font-size: 16px;">${formatCurrencyCompact(thisSpent)}</div>
                <div style="margin-top: 4px; font-size: 9px;">${getGrowthBadgeNew(spendGrowth, true)}</div>
            </div>
            <div class="card" style="text-align: center; padding: 10px 8px; border-top: 3px solid var(--success);">
                <div class="metric-label" style="margin-bottom: 4px; font-size: 9px;">Conv</div>
                <div class="metric-value" style="font-size: 16px;">${formatNumberCompact(thisResults)}</div>
                <div style="margin-top: 4px; font-size: 9px;">${getGrowthBadgeNew(resultsGrowth)}</div>
            </div>
            <div class="card" style="text-align: center; padding: 10px 8px; border-top: 3px solid var(--warning);">
                <div class="metric-label" style="margin-bottom: 4px; font-size: 9px;">CPR</div>
                <div class="metric-value" style="font-size: 16px;">${formatCurrencyCompact(thisCPR)}</div>
                <div style="margin-top: 4px; font-size: 9px;">${getGrowthBadgeNew(cprGrowth, true)}</div>
            </div>
            <div class="card" style="text-align: center; padding: 10px 8px; border-top: 3px solid #8b5cf6;">
                <div class="metric-label" style="margin-bottom: 4px; font-size: 9px;">Reach</div>
                <div class="metric-value" style="font-size: 16px;">${formatNumberCompact(thisReach)}</div>
                <div style="margin-top: 4px; font-size: 9px;">${getGrowthBadgeNew(reachGrowth)}</div>
            </div>
            <div class="card" style="text-align: center; padding: 10px 8px; border-top: 3px solid #06b6d4;">
                <div class="metric-label" style="margin-bottom: 4px; font-size: 9px;">Impr</div>
                <div class="metric-value" style="font-size: 16px;">${formatNumberCompact(thisImpr)}</div>
                <div style="margin-top: 4px; font-size: 9px;">${getGrowthBadgeNew(imprGrowth)}</div>
            </div>
            <div class="card" style="text-align: center; padding: 10px 8px; border-top: 3px solid #f59e0b;">
                <div class="metric-label" style="margin-bottom: 4px; font-size: 9px;">Clicks</div>
                <div class="metric-value" style="font-size: 16px;">${formatNumberCompact(thisLinkClicks)}</div>
                <div style="margin-top: 4px; font-size: 9px;">${getGrowthBadgeNew(linkClicksGrowth)}</div>
            </div>
        </div>

        <!-- Compact Callout Boxes - DENSE INSIGHTS -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 14px;">
            <!-- Performance Insight -->
            <div style="padding: 10px 12px; background: linear-gradient(135deg, var(--success-light) 0%, #d1fae5 100%); border-left: 3px solid var(--success); border-radius: 8px;">
                <div style="font-size: 10px; font-weight: 700; color: var(--success); margin-bottom: 4px; display: flex; align-items: center; gap: 5px;">
                    ${icon('lightbulb-fill', 12)} KEY INSIGHT
                </div>
                <p style="font-size: 10px; color: var(--gray-700); line-height: 1.4; margin: 0;">
                    <strong>${resultsGrowth >= 0 ? 'Peningkatan' : 'Penurunan'} ${Math.abs(resultsGrowth).toFixed(1)}%</strong> pada Conversations (${formatNumberCompact(lastResults)} → ${formatNumberCompact(thisResults)})
                </p>
            </div>

            <!-- Efficiency Insight -->
            <div style="padding: 10px 12px; background: linear-gradient(135deg, ${cprGrowth <= 0 ? 'var(--success-light)' : 'var(--warning-light)'} 0%, ${cprGrowth <= 0 ? '#d1fae5' : '#fef3c7'} 100%); border-left: 3px solid ${cprGrowth <= 0 ? 'var(--success)' : 'var(--warning)'}; border-radius: 8px;">
                <div style="font-size: 10px; font-weight: 700; color: ${cprGrowth <= 0 ? 'var(--success)' : 'var(--warning)'}; margin-bottom: 4px; display: flex; align-items: center; gap: 5px;">
                    ${icon('currency-dollar', 12)} EFFICIENCY
                </div>
                <p style="font-size: 10px; color: var(--gray-700); line-height: 1.4; margin: 0;">
                    CPR <strong class="${cprGrowth <= 0 ? 'growth-up' : 'growth-down'}">${cprGrowth <= 0 ? 'membaik' : 'naik'} ${Math.abs(cprGrowth).toFixed(1)}%</strong> (${formatCurrencyCompact(lastCPR)} → ${formatCurrencyCompact(thisCPR)})
                </p>
            </div>
        </div>

        <!-- Ultra Compact Mini Stats Row -->
        <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 6px; margin-top: 12px;">
            <div style="text-align: center; padding: 6px; background: var(--gray-50); border-radius: 6px; border: 1px solid var(--gray-200);">
                <div style="font-size: 8px; font-weight: 600; color: var(--gray-500); text-transform: uppercase; margin-bottom: 2px;">CTR</div>
                <div style="font-size: 11px; font-weight: 700; color: var(--gray-800);">${thisCTR.toFixed(2)}%</div>
            </div>
            <div style="text-align: center; padding: 6px; background: var(--gray-50); border-radius: 6px; border: 1px solid var(--gray-200);">
                <div style="font-size: 8px; font-weight: 600; color: var(--gray-500); text-transform: uppercase; margin-bottom: 2px;">CPC</div>
                <div style="font-size: 11px; font-weight: 700; color: var(--gray-800);">${formatCurrencyCompact(thisCPC)}</div>
            </div>
            <div style="text-align: center; padding: 6px; background: var(--gray-50); border-radius: 6px; border: 1px solid var(--gray-200);">
                <div style="font-size: 8px; font-weight: 600; color: var(--gray-500); text-transform: uppercase; margin-bottom: 2px;">CPM</div>
                <div style="font-size: 11px; font-weight: 700; color: var(--gray-800);">${formatCurrencyCompact(thisCPM)}</div>
            </div>
            <div style="text-align: center; padding: 6px; background: var(--gray-50); border-radius: 6px; border: 1px solid var(--gray-200);">
                <div style="font-size: 8px; font-weight: 600; color: var(--gray-500); text-transform: uppercase; margin-bottom: 2px;">Conv Rate</div>
                <div style="font-size: 11px; font-weight: 700; color: var(--gray-800);">${thisConvRate.toFixed(2)}%</div>
            </div>
            <div style="text-align: center; padding: 6px; background: var(--gray-50); border-radius: 6px; border: 1px solid var(--gray-200);">
                <div style="font-size: 8px; font-weight: 600; color: var(--gray-500); text-transform: uppercase; margin-bottom: 2px;">Freq</div>
                <div style="font-size: 11px; font-weight: 700; color: var(--gray-800);">${thisFrequency.toFixed(2)}</div>
            </div>
            <div style="text-align: center; padding: 6px; background: var(--gray-50); border-radius: 6px; border: 1px solid var(--gray-200);">
                <div style="font-size: 8px; font-weight: 600; color: var(--gray-500); text-transform: uppercase; margin-bottom: 2px;">ROAS</div>
                <div style="font-size: 11px; font-weight: 700; color: var(--gray-800);">${thisROAS.toFixed(2)}x</div>
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
                <div class="step-label">${icon('chat-dots-fill', 14)} Conversations</div>
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
                        <td><strong>${icon('chat-dots-fill', 14)} Conversations</strong></td>
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
            ${generateMetricCard('chat-dots-fill', 'Conversations', formatNumber(thisResults), formatNumber(lastResults), resultsGrowth, false, thisPeriodLabel, lastPeriodLabel, true)}
            ${generateMetricCard('currency-dollar', 'Cost per Result', formatCurrency(thisCPR), formatCurrency(lastCPR), cprGrowth, true, thisPeriodLabel, lastPeriodLabel, false, cprGrowth <= 0)}
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
            <p><strong>${icon('info-circle-fill', 14)} Key Insight:</strong> ${spendGrowth < 0 ? 'Penghematan budget' : 'Peningkatan budget'} sebesar <strong>${Math.abs(spendGrowth).toFixed(2)}%</strong> dengan ${resultsGrowth >= 0 ? 'peningkatan' : 'penurunan'} Messaging Conversations sebesar <strong>${Math.abs(resultsGrowth).toFixed(2)}%</strong>. CPR ${cprGrowth <= 0 ? 'membaik' : 'naik'} <strong>${Math.abs(cprGrowth).toFixed(2)}%</strong>.</p>
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
            <p><strong>${icon('info-circle-fill', 14)} Summary:</strong> ${cprGrowth <= 0 ? 'Meskipun volume menurun, efisiensi biaya membaik dengan CPR yang lebih rendah.' : 'Perlu optimasi untuk meningkatkan efisiensi biaya.'} ${resultsGrowth < 0 ? `Penurunan conversations sebesar ${Math.abs(resultsGrowth).toFixed(2)}% perlu diimbangi dengan strategi untuk meningkatkan volume.` : `Peningkatan conversations menunjukkan strategi yang efektif.`}</p>
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

        <p style="margin-top: 32px; font-size: 11px; opacity: 0.7;">
            <strong>Version 2.0.0</strong> • Compact Design System • Generated on ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
        </p>
        <p style="margin-top: 24px; font-size: 11px; opacity: 0.6;">© 2026 Hadona Digital Media. All rights reserved.</p>
    </div>

</body>
</html>`

  return html
}

// ============ HELPER FUNCTIONS ============
// getGrowthBadgeNew moved to top of file for use in executive summary

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
      items.push(`<div class="highlight-item">${iconCheck}<div><strong>Conversations Naik ${resultsGrowth.toFixed(1)}%</strong><p>${formatNumber(lastResults)} → ${formatNumber(thisResults)}</p></div></div>`)
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
        items.push(`<div class="highlight-item">${iconCheck}<div><strong>Campaign Aktif & Produktif</strong><p>${formatNumber(thisResults)} conversations dihasilkan</p></div></div>`)
      }
      if (items.length < 4 && thisCPR > 0) {
        items.push(`<div class="highlight-item">${iconCheck}<div><strong>Cost Efficiency Terjaga</strong><p>CPR ${formatCurrency(thisCPR)} per conversation</p></div></div>`)
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
      items.push(`<div class="highlight-item">${iconX}<div><strong>Conversations Turun ${Math.abs(resultsGrowth).toFixed(1)}%</strong><p>${formatNumber(lastResults)} → ${formatNumber(thisResults)}</p></div></div>`)
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
  const totalResults = data.reduce((sum, item) => sum + parseNum(item['Messaging conversations started'] || item['Results'] || 0), 0)
  const totalSpent = data.reduce((sum, item) => sum + parseNum(item['Amount spent (IDR)'] || 0), 0)

  const sortedData = [...data].sort((a, b) => parseNum(b['Messaging conversations started'] || b['Results'] || 0) - parseNum(a['Messaging conversations started'] || a['Results'] || 0))

  // Show only top 10 in table
  const top10Data = sortedData.slice(0, 10)

  const tableRows = top10Data.map((item, index) => {
    const age = item['Age'] || 'Unknown'
    const results = parseNum(item['Messaging conversations started'] || item['Results'] || 0)
    const spent = parseNum(item['Amount spent (IDR)'] || 0)
    const cpr = results > 0 ? spent / results : 0
    const percentage = totalResults > 0 ? (results / totalResults) * 100 : 0
    const isTopPerformer = index < 2

    const lastItem = lastData.find(l => l['Age'] === age)
    const lastResults = lastItem ? parseNum(lastItem['Messaging conversations started'] || lastItem['Results'] || 0) : 0
    const resultsGrowth = calculateGrowth(results, lastResults)

    return `
                    <tr ${isTopPerformer ? 'style="background: var(--warning-light);"' : ''}>
                        <td><strong>${age}</strong>${isTopPerformer ? '<span style="font-size: 8px; background: var(--warning); color: white; padding: 2px 4px; border-radius: 3px; margin-left: 4px;">TOP</span>' : ''}</td>
                        <td>${formatNumberCompact(results)} <span style="color: var(--gray-400); font-size: 9px;">(${percentage.toFixed(0)}%)</span></td>
                        <td>${formatCurrencyCompact(cpr)}</td>
                        <td>${formatCurrencyCompact(spent)}</td>
                        <td>${getGrowthBadgeNew(resultsGrowth)}</td>
                    </tr>`
  }).join('')

  const topAge = sortedData[0]?.['Age'] || 'N/A'
  const top2Age = sortedData[1]?.['Age'] || 'N/A'
  const topPercentage = ((parseNum(sortedData[0]?.['Messaging conversations started'] || sortedData[0]?.['Results'] || 0) + parseNum(sortedData[1]?.['Messaging conversations started'] || sortedData[1]?.['Results'] || 0)) / totalResults * 100).toFixed(0)

  return `
    <!-- SLIDE: AGE BREAKDOWN - COMPACT -->
    <div class="slide" data-slide="${slideNumber}">
        <div class="slide-header">
            <img src="${LOGO_URL}" alt="Logo" class="logo">
            <span class="slide-number">Slide ${slideNumber}</span>
        </div>

        <div class="slide-title">
            <h1>${icon('calendar3')} Age Breakdown</h1>
            <p>Performance by Age Group • ${thisPeriodLabel}</p>
        </div>

        <!-- Compact Callout -->
        <div style="padding: 8px 12px; background: var(--warning-light); border-left: 3px solid var(--warning); border-radius: 6px; margin-bottom: 12px;">
            <p style="font-size: 10px; margin: 0; color: var(--gray-700);">
                <strong>Top 2:</strong> ${topAge} + ${top2Age} = <strong>${topPercentage}%</strong> total results • Prioritaskan untuk scale
            </p>
        </div>

        <div class="table-container" style="font-size: 10px;">
            <table>
                <thead>
                    <tr>
                        <th style="padding: 8px 10px; font-size: 10px;">Age</th>
                        <th style="padding: 8px 10px; font-size: 10px;">Results</th>
                        <th style="padding: 8px 10px; font-size: 10px;">CPR</th>
                        <th style="padding: 8px 10px; font-size: 10px;">Spent</th>
                        <th style="padding: 8px 10px; font-size: 10px; text-align: center;">Growth</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>
        </div>
    </div>`
}

function generateGenderSlide(data: any[], lastData: any[], thisPeriodLabel: string, lastPeriodLabel: string, slideNumber: number): string {
  const totalResults = data.reduce((sum, item) => sum + parseNum(item['Messaging conversations started'] || item['Results'] || 0), 0)

  const sortedData = [...data].sort((a, b) => parseNum(b['Messaging conversations started'] || b['Results'] || 0) - parseNum(a['Messaging conversations started'] || a['Results'] || 0))

  const genderCards = sortedData.map((item, index) => {
    const gender = item['Gender'] || 'Unknown'
    const results = parseNum(item['Messaging conversations started'] || item['Results'] || 0)
    const spent = parseNum(item['Amount spent (IDR)'] || 0)
    const percentage = totalResults > 0 ? (results / totalResults) * 100 : 0
    const cpr = results > 0 ? spent / results : 0
    const isTop = index === 0

    const lastItem = lastData.find(l => l['Gender'] === gender)
    const lastResults = lastItem ? parseNum(lastItem['Messaging conversations started'] || lastItem['Results'] || 0) : 0
    const growth = calculateGrowth(results, lastResults)

    const genderLower = gender.toLowerCase()
    const isMale = genderLower === 'male'
    const isFemale = genderLower === 'female'
    const iconName = isMale ? 'gender-male' : isFemale ? 'gender-female' : 'person-fill'
    const iconColor = isMale ? 'var(--primary)' : isFemale ? '#db2777' : 'var(--gray-600)'

    return `
      <div class="card" style="text-align: center; padding: 12px; border-top: 3px solid ${iconColor}; ${isTop ? 'background: var(--warning-light); border: 2px solid var(--warning);' : ''}">
        <div style="display: flex; align-items: center; justify-content: center; gap: 6px; margin-bottom: 6px;">
          <i class="bi bi-${iconName}" style="font-size: 20px; color: ${iconColor};"></i>
          <span style="font-size: 14px; font-weight: 700;">${gender}</span>
          ${isTop ? '<span style="font-size: 8px; background: var(--warning); color: white; padding: 2px 4px; border-radius: 3px;">TOP</span>' : ''}
        </div>
        <div style="font-size: 24px; font-weight: 700; color: ${iconColor}; margin-bottom: 4px;">${percentage.toFixed(1)}%</div>
        <p style="font-size: 10px; color: var(--gray-500); margin-bottom: 8px;">${formatNumberCompact(results)} results</p>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 6px;">
          <div style="background: var(--gray-50); border-radius: 4px; padding: 6px;">
            <div style="font-size: 8px; color: var(--gray-500);">Spent</div>
            <div style="font-size: 12px; font-weight: 600;">${formatCurrencyCompact(spent)}</div>
          </div>
          <div style="background: var(--gray-50); border-radius: 4px; padding: 6px;">
            <div style="font-size: 8px; color: var(--gray-500);">CPR</div>
            <div style="font-size: 12px; font-weight: 600;">${formatCurrencyCompact(cpr)}</div>
          </div>
        </div>
        ${getGrowthBadgeNew(growth)}
      </div>`
  }).join('')

  const topGender = sortedData[0]?.['Gender'] || 'N/A'
  const topPct = (parseNum(sortedData[0]?.['Messaging conversations started'] || sortedData[0]?.['Results'] || 0) / totalResults * 100).toFixed(0)

  return `
    <!-- SLIDE: GENDER BREAKDOWN - COMPACT -->
    <div class="slide" data-slide="${slideNumber}">
        <div class="slide-header">
            <img src="${LOGO_URL}" alt="Logo" class="logo">
            <span class="slide-number">Slide ${slideNumber}</span>
        </div>

        <div class="slide-title">
            <h1>${icon('people-fill')} Gender Breakdown</h1>
            <p>Performance by Gender • ${thisPeriodLabel}</p>
        </div>

        <!-- Compact Callout -->
        <div style="padding: 8px 12px; background: var(--warning-light); border-left: 3px solid var(--warning); border-radius: 6px; margin-bottom: 12px;">
            <p style="font-size: 10px; margin: 0; color: var(--gray-700);">
                <strong>${topGender}</strong> dominates with <strong>${topPct}%</strong> of total results • Focus targeting here
            </p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(${data.length}, 1fr); gap: 12px;">
            ${genderCards}
        </div>
    </div>`
}

function generatePlacementSlide(data: any[], lastData: any[], thisPeriodLabel: string, lastPeriodLabel: string, slideNumber: number): string {
  const sortedData = [...data].sort((a, b) => parseNum(b['Messaging conversations started'] || b['Results'] || 0) - parseNum(a['Messaging conversations started'] || a['Results'] || 0))

  const totalResults = data.reduce((sum, item) => sum + parseNum(item['Messaging conversations started'] || item['Results'] || 0), 0)

  const rows = sortedData.map((item, index) => {
    const placement = item['Placement'] || 'Unknown'
    const results = parseNum(item['Messaging conversations started'] || item['Results'] || 0)
    const spent = parseNum(item['Amount spent (IDR)'] || 0)
    const reach = parseNum(item['Reach'] || 0)
    const impr = parseNum(item['Impressions'] || 0)
    const cpr = results > 0 ? spent / results : 0
    const percentage = totalResults > 0 ? (results / totalResults) * 100 : 0
    const isTopPerformer = index < 2

    const lastItem = lastData.find(l => l['Placement'] === placement)
    const lastResults = lastItem ? parseNum(lastItem['Messaging conversations started'] || lastItem['Results'] || 0) : 0
    const resultsGrowth = calculateGrowth(results, lastResults)

    return `
      <tr ${isTopPerformer ? 'style="background: var(--warning-light);"' : ''}>
        <td><strong>${placement}</strong>${isTopPerformer ? '<span style="font-size: 8px; background: var(--warning); color: white; padding: 2px 4px; border-radius: 3px; margin-left: 4px;">TOP</span>' : ''}</td>
        <td>${formatNumberCompact(results)} <span style="color: var(--gray-400); font-size: 9px;">(${percentage.toFixed(0)}%)</span></td>
        <td>${formatCurrencyCompact(cpr)}</td>
        <td>${formatCurrencyCompact(spent)}</td>
        <td>${getGrowthBadgeNew(resultsGrowth)}</td>
      </tr>`
  }).join('')

  const topPlacement = sortedData[0]?.['Placement'] || 'N/A'
  const top2Placement = sortedData[1]?.['Placement'] || 'N/A'
  const top2Pct = ((parseNum(sortedData[0]?.['Messaging conversations started'] || sortedData[0]?.['Results'] || 0) + parseNum(sortedData[1]?.['Messaging conversations started'] || sortedData[1]?.['Results'] || 0)) / totalResults * 100).toFixed(0)

  return `
    <!-- SLIDE: PLACEMENT BREAKDOWN - COMPACT -->
    <div class="slide" data-slide="${slideNumber}">
        <div class="slide-header">
            <img src="${LOGO_URL}" alt="Logo" class="logo">
            <span class="slide-number">Slide ${slideNumber}</span>
        </div>

        <div class="slide-title">
            <h1>${icon('grid-fill')} Placement Breakdown</h1>
            <p>Performance by Ad Placement • ${thisPeriodLabel}</p>
        </div>

        <!-- Compact Callout -->
        <div style="padding: 8px 12px; background: var(--warning-light); border-left: 3px solid var(--warning); border-radius: 6px; margin-bottom: 12px;">
            <p style="font-size: 10px; margin: 0; color: var(--gray-700);">
                <strong>Top 2:</strong> ${topPlacement} + ${top2Placement} = <strong>${top2Pct}%</strong> of results • Focus budget here
            </p>
        </div>

        <div class="table-container" style="font-size: 10px;">
            <table>
                <thead>
                    <tr>
                        <th style="padding: 8px 10px; font-size: 10px;">Placement</th>
                        <th style="padding: 8px 10px; font-size: 10px;">Results</th>
                        <th style="padding: 8px 10px; font-size: 10px;">CPR</th>
                        <th style="padding: 8px 10px; font-size: 10px;">Spent</th>
                        <th style="padding: 8px 10px; font-size: 10px; text-align: center;">Growth</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>
        </div>
    </div>`
}

function generatePlatformSlide(data: any[], lastData: any[], thisPeriodLabel: string, lastPeriodLabel: string, slideNumber: number): string {
  const totalResults = data.reduce((sum, item) => sum + parseNum(item['Messaging conversations started'] || item['Results'] || 0), 0)

  const sortedData = [...data].sort((a, b) => parseNum(b['Messaging conversations started'] || b['Results'] || 0) - parseNum(a['Messaging conversations started'] || a['Results'] || 0))

  const platformCards = sortedData.map((item, index) => {
    const platform = item['Platform'] || 'Unknown'
    const results = parseNum(item['Messaging conversations started'] || item['Results'] || 0)
    const spent = parseNum(item['Amount spent (IDR)'] || 0)
    const percentage = totalResults > 0 ? (results / totalResults) * 100 : 0
    const cpr = results > 0 ? spent / results : 0
    const isTop = index === 0

    const lastItem = lastData.find(l => l['Platform'] === platform)
    const lastResults = lastItem ? parseNum(lastItem['Messaging conversations started'] || lastItem['Results'] || 0) : 0
    const growth = calculateGrowth(results, lastResults)

    const iconName = platform.toLowerCase().includes('facebook') ? 'facebook' : platform.toLowerCase().includes('instagram') ? 'instagram' : platform.toLowerCase().includes('messenger') ? 'messenger' : 'phone'
    const iconColor = platform.toLowerCase().includes('facebook') ? '#1877f2' : platform.toLowerCase().includes('instagram') ? '#e4405f' : platform.toLowerCase().includes('messenger') ? '#0084ff' : 'var(--gray-600)'

    return `
      <div class="card" style="text-align: center; padding: 12px; border-top: 3px solid ${iconColor}; ${isTop ? 'background: var(--warning-light); border: 2px solid var(--warning);' : ''}">
        <div style="display: flex; align-items: center; justify-content: center; gap: 6px; margin-bottom: 6px;">
          <i class="bi bi-${iconName}" style="font-size: 20px; color: ${iconColor};"></i>
          <span style="font-size: 14px; font-weight: 700;">${platform}</span>
          ${isTop ? '<span style="font-size: 8px; background: var(--warning); color: white; padding: 2px 4px; border-radius: 3px;">TOP</span>' : ''}
        </div>
        <div style="font-size: 24px; font-weight: 700; color: ${iconColor}; margin-bottom: 4px;">${percentage.toFixed(1)}%</div>
        <p style="font-size: 10px; color: var(--gray-500); margin-bottom: 8px;">${formatNumberCompact(results)} results</p>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 6px;">
          <div style="background: var(--gray-50); border-radius: 4px; padding: 6px;">
            <div style="font-size: 8px; color: var(--gray-500);">Spent</div>
            <div style="font-size: 12px; font-weight: 600;">${formatCurrencyCompact(spent)}</div>
          </div>
          <div style="background: var(--gray-50); border-radius: 4px; padding: 6px;">
            <div style="font-size: 8px; color: var(--gray-500);">CPR</div>
            <div style="font-size: 12px; font-weight: 600;">${formatCurrencyCompact(cpr)}</div>
          </div>
        </div>
        ${getGrowthBadgeNew(growth)}
      </div>`
  }).join('')

  const topPlatform = sortedData[0]?.['Platform'] || 'N/A'
  const topPct = (parseNum(sortedData[0]?.['Messaging conversations started'] || sortedData[0]?.['Results'] || 0) / totalResults * 100).toFixed(0)

  return `
    <!-- SLIDE: PLATFORM BREAKDOWN - COMPACT -->
    <div class="slide" data-slide="${slideNumber}">
        <div class="slide-header">
            <img src="${LOGO_URL}" alt="Logo" class="logo">
            <span class="slide-number">Slide ${slideNumber}</span>
        </div>

        <div class="slide-title">
            <h1>${icon('phone-fill')} Platform Breakdown</h1>
            <p>Performance by Platform • ${thisPeriodLabel}</p>
        </div>

        <!-- Compact Callout -->
        <div style="padding: 8px 12px; background: var(--warning-light); border-left: 3px solid var(--warning); border-radius: 6px; margin-bottom: 12px;">
            <p style="font-size: 10px; margin: 0; color: var(--gray-700);">
                <strong>${topPlatform}</strong> dominates with <strong>${topPct}%</strong> of results • Focus optimization here
            </p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(${Math.min(data.length, 3)}, 1fr); gap: 12px;">
            ${platformCards}
        </div>
    </div>`
}

function generateRegionSlide(data: any[], lastData: any[], thisPeriodLabel: string, lastPeriodLabel: string, slideNumber: number): string {
  // Sort by Amount Spent (since region-level Results/conversations aren't always available)
  const sortedData = [...data].sort((a, b) => parseNum(b['Amount spent (IDR)'] || 0) - parseNum(a['Amount spent (IDR)'] || 0)).slice(0, 10)

  const totalSpent = sortedData.reduce((sum, item) => sum + parseNum(item['Amount spent (IDR)'] || 0), 0)
  const top3Spent = sortedData.slice(0, 3).reduce((sum, item) => sum + parseNum(item['Amount spent (IDR)'] || 0), 0)

  const rows = sortedData.map((item, index) => {
    const region = item['Region'] || 'Unknown'
    const spent = parseNum(item['Amount spent (IDR)'] || 0)
    const reach = parseNum(item['Reach'] || 0)
    const impr = parseNum(item['Impressions'] || 0)
    const linkClicks = parseNum(item['Link clicks'] || 0)
    const ctr = impr > 0 ? (linkClicks / impr) * 100 : 0
    const percentage = totalSpent > 0 ? (spent / totalSpent) * 100 : 0
    const isTop3 = index < 3

    return `
      <tr ${isTop3 ? 'style="background: var(--warning-light);"' : ''}>
        <td style="text-align: center; font-weight: 700;">${isTop3 ? `<span style="background: var(--warning); color: white; padding: 2px 6px; border-radius: 3px; font-size: 9px;">${index + 1}</span>` : index + 1}</td>
        <td><strong>${region}</strong></td>
        <td>${formatCurrencyCompact(spent)} <span style="color: var(--gray-400); font-size: 9px;">(${percentage.toFixed(0)}%)</span></td>
        <td>${formatNumberCompact(reach)}</td>
        <td>${ctr.toFixed(2)}%</td>
      </tr>`
  }).join('')

  const topRegion = sortedData[0]?.['Region'] || 'N/A'
  const top3Pct = (top3Spent / totalSpent * 100).toFixed(0)

  return `
    <!-- SLIDE: REGION BREAKDOWN - COMPACT -->
    <div class="slide" data-slide="${slideNumber}">
        <div class="slide-header">
            <img src="${LOGO_URL}" alt="Logo" class="logo">
            <span class="slide-number">Slide ${slideNumber}</span>
        </div>

        <div class="slide-title">
            <h1>${icon('geo-alt-fill')} Region Breakdown</h1>
            <p>Top 10 Regions by Ad Spend • ${thisPeriodLabel}</p>
        </div>

        <!-- Compact Callout -->
        <div style="padding: 8px 12px; background: var(--warning-light); border-left: 3px solid var(--warning); border-radius: 6px; margin-bottom: 12px;">
            <p style="font-size: 10px; margin: 0; color: var(--gray-700);">
                <strong>Top 3 regions:</strong> ${topRegion} + 2 others = <strong>${top3Pct}%</strong> of total spend • Consider geo-experiments
            </p>
        </div>

        <div class="table-container" style="font-size: 10px;">
            <table>
                <thead>
                    <tr>
                        <th style="padding: 8px 10px; font-size: 10px; text-align: center; width: 40px;">#</th>
                        <th style="padding: 8px 10px; font-size: 10px;">Region</th>
                        <th style="padding: 8px 10px; font-size: 10px;">Spent</th>
                        <th style="padding: 8px 10px; font-size: 10px;">Reach</th>
                        <th style="padding: 8px 10px; font-size: 10px;">CTR</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>
        </div>
    </div>`
}

function generateObjectiveSlide(data: any[], slideNumber: number): string {
  // Debug: Log keys to see what fields are available
  if (data.length > 0) {
    // console.log('[Objective Slide] Available keys:', Object.keys(data[0]))
    // console.log('[Objective Slide] All data items:', data.map(d => ({ Objective: d['Objective'], WA: d['Messaging conversations started'], IG: d['Instagram follows'], Spent: d['Amount spent (IDR)'] })))
  }
  
  // Filter out rows without objective (summary rows) and sort by Result WA
  const filteredData = [...data].filter(item => {
    const obj = item['Objective']
    return obj && obj !== '' && obj !== '(No Objective)' && obj !== 'undefined'
  })
  
  const sortedData = filteredData.sort((a, b) => parseNum(b['Messaging conversations started'] || b['Results'] || 0) - parseNum(a['Messaging conversations started'] || a['Results'] || 0))

  // Calculate totals ONLY from filtered/valid objective data
  const totalResultWA = sortedData.reduce((sum, item) => sum + parseNum(item['Messaging conversations started'] || item['Results'] || 0), 0)
  const totalIGFollowers = sortedData.reduce((sum, item) => sum + parseNum(item['Instagram follows'] || 0), 0)
  const totalSpent = sortedData.reduce((sum, item) => sum + parseNum(item['Amount spent (IDR)'] || 0), 0)
  const totalReach = sortedData.reduce((sum, item) => sum + parseNum(item['Reach'] || 0), 0)
  const avgCPRWA = totalResultWA > 0 ? totalSpent / totalResultWA : 0
  const avgCPRIG = totalIGFollowers > 0 ? totalSpent / totalIGFollowers : 0

  // console.log('[Objective Slide] Filtered data count:', sortedData.length)
  // console.log('[Objective Slide] Totals:', { totalResultWA, totalIGFollowers, totalSpent, totalReach })

  const rows = sortedData.map((item, index) => {
    const objective = item['Objective'] || '(No Objective)'
    const resultWA = parseNum(item['Messaging conversations started'] || item['Results'] || 0)
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
                  const topR = parseNum(top['Messaging conversations started'] || top['Results'] || 0)
                  const topS = parseNum(top['Amount spent (IDR)'] || 0)
                  const topCPR = topR > 0 ? topS / topR : 0
                  const topIG = parseNum(top['Instagram follows'] || 0)
                  const topCPRIG = topIG > 0 ? topS / topIG : 0
                  const secO = sec['Objective'] || null
                  const secR = parseNum(sec['Messaging conversations started'] || sec['Results'] || 0)
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
  const adIdKey = Object.keys(firstItem).find(k => k.toLowerCase() === 'ad id' || k.toLowerCase().includes('ad id')) || 'Ad ID'

  // Sort by WA results (Messaging conversations started ONLY - no fallback to Results to avoid bad data)
  // Filter to only show ads with actual spending (> 0) to avoid showing ads that never ran
  const sortedData = [...data].filter(item => {
    const name = item[creativeNameKey]
    const amountSpent = parseNum(item['Amount spent (IDR)'] || 0)

    // Only include ads that:
    // 1. Have a valid name
    // 2. Have actual spending (> 0) - regardless of delivery status
    // This allows showing inactive/not_delivering ads that still had budget spent
    return name && String(name).trim() !== '' && amountSpent > 0
  }).sort((a, b) => parseNum(b['Messaging conversations started'] || 0) - parseNum(a['Messaging conversations started'] || 0))

  // Get top 10 creatives
  const top10 = sortedData.slice(0, 10)

  // Calculate averages for comparison (use Messaging conversations started ONLY)
  const totalWA = sortedData.reduce((sum, item) => sum + parseNum(item['Messaging conversations started'] || 0), 0)
  const totalOC = sortedData.reduce((sum, item) => sum + parseNum(item['Outbound clicks'] || 0), 0)
  const totalSpent = sortedData.reduce((sum, item) => sum + parseNum(item['Amount spent (IDR)'] || 0), 0)
  const avgCostPerWA = totalWA > 0 ? totalSpent / totalWA : 0
  const avgConvRate = totalOC > 0 ? (totalWA / totalOC) * 100 : 0

  // Generate analysis for each creative
  const generateAnalysis = (item: any, rank: number): { metrics: string, analysis: string } => {
    const name = String(item[creativeNameKey] || 'Unknown')
    const waResults = parseNum(item['Messaging conversations started'] || 0)
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

  const creativeItems = top10.map((item, index) => {
    const name = String(item[creativeNameKey] || 'Unknown')
    const displayName = name.length > 50 ? name.slice(0, 50) + '…' : name
    const { metrics, analysis } = generateAnalysis(item, index + 1)
    const adId = item[adIdKey] || ''

    // Show Ad ID for easy copy-paste to search in Meta Ads dashboard
    const adIdText = adId ? `<div class="content-analysis">→ Ad ID: ${adId}</div>` : ''

    return `
      <div class="content-item" style="position: relative;">
        <div class="content-header">
          <span class="content-rank">${index + 1}</span>
          <span class="content-name">${displayName}</span>
        </div>
        <div class="content-metrics">${metrics}</div>
        <div class="content-analysis">→ ${analysis}</div>
        ${adIdText}
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
            <p>Top 10 Creatives by WhatsApp Results</p>
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
            <p>Dari <strong>${sortedData.length} creative</strong> aktif, top 10 menghasilkan <strong>${formatNumber(top10.reduce((sum, item) => sum + parseNum(item['Messaging conversations started'] || item['Results'] || 0), 0))} WA</strong> (${totalWA > 0 ? ((top10.reduce((sum, item) => sum + parseNum(item['Messaging conversations started'] || item['Results'] || 0), 0) / totalWA) * 100).toFixed(1) : 0}% dari total). Rata-rata Cost/WA: <strong>${formatCurrency(avgCostPerWA)}</strong>, Rata-rata konversi OC→WA: <strong>${avgConvRate.toFixed(1)}%</strong>.</p>
        </div>

        <div class="strategy-box" style="margin-top: 16px; background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-left: 4px solid #10b981; border-radius: 12px; padding: 20px;">
            <h4 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 700; color: #065f46; display: flex; align-items: center; gap: 8px;">
                <i class="bi bi-lightbulb-fill" style="font-size: 20px;"></i>
                Rekomendasi Strategi
            </h4>
            ${generateStrategicRecommendations(top10, avgCostPerWA, avgConvRate, totalWA)}
        </div>
    </div>`

  function generateStrategicRecommendations(topCreatives: any[], avgCostPerWA: number, avgConvRate: number, totalWA: number): string {
    const recommendations: string[] = []

    // Get top performer
    const topPerformer = topCreatives[0]
    const topWA = parseNum(topPerformer['Messaging conversations started'] || 0)
    const topCostPerWA = topWA > 0 ? parseNum(topPerformer['Amount spent (IDR)'] || 0) / topWA : 0

    // Recommendation 1: Scale or optimize top performer
    if (topCostPerWA <= avgCostPerWA) {
      recommendations.push(`🚀 <strong>Scale Ads #1</strong> - Performa tinggi dengan biaya efisien. Increase budget 20-30% atau duplikasi ke Stories/Reels.`)
    } else {
      recommendations.push(`🔧 <strong>Optimasi Ads #1</strong> - Volume tinggi tapi biaya mahal. Test new creative atau adjust targeting sebelum scale.`)
    }

    // Recommendation 2: Budget allocation based on efficiency
    const efficientAds = topCreatives.slice(0, 5).filter((item) => {
      const spent = parseNum(item['Amount spent (IDR)'] || 0)
      const wa = parseNum(item['Messaging conversations started'] || 0)
      const costPerWA = wa > 0 ? spent / wa : 0
      return costPerWA < avgCostPerWA * 0.9
    })

    if (efficientAds.length >= 3) {
      recommendations.push(`💰 <strong>Fokus ke Top 5 Efisien</strong> - ${efficientAds.length} dari 5 top ads punya CPR di bawah rata-rata. Shift 70-80% budget ke ads ini.`)
    }

    // Recommendation 3: Conversion rate optimization
    if (avgConvRate < 20) {
      recommendations.push(`📈 <strong>Improve Konversi</strong> - OC→WA rate ${avgConvRate.toFixed(1)}% masih rendah. Test prefilled WhatsApp messages dan simplify CTA.`)
    }

    // Recommendation 4: Underperformers action
    const bottomAds = topCreatives.slice(7, 10)
    const totalBottomSpent = bottomAds.reduce((sum, item) => sum + parseNum(item['Amount spent (IDR)'] || 0), 0)
    const totalBottomWA = bottomAds.reduce((sum, item) => sum + parseNum(item['Messaging conversations started'] || 0), 0)
    const bottomCPR = totalBottomWA > 0 ? totalBottomSpent / totalBottomWA : 0

    if (bottomCPR > avgCostPerWA * 1.5 && totalBottomSpent > 500000) {
      recommendations.push(`⏸️ <strong>Pause Bottom 3-5</strong> - Ads ranking buncit spend >500K dengan CPR tinggi. Pause dan realokasi budget ke top performers.`)
    }

    // Default recommendation
    if (recommendations.length < 3) {
      recommendations.push(`📊 <strong>Maintain & Monitor</strong> - Performa stabil. Test 2-3 new creatives, scale winners 20%, dan pause ads dengan CPR >150% rata-rata.`)
    }

    // Limit to 5 recommendations max
    const finalRecommendations = recommendations.slice(0, 5)

    return `<ul style="margin: 0; padding-left: 20px; font-size: 13px; line-height: 1.8; color: #064e3b;">
        ${finalRecommendations.map(rec => `<li style="margin-bottom: 12px;">${rec}</li>`).join('')}
      </ul>`
  }
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
    insights.push(`CPR membaik <strong>${Math.abs(cpr.cprGrowth).toFixed(1)}%</strong> (${formatCurrency(cpr.lastCPR)} → ${formatCurrency(cpr.thisCPR)})`)
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

