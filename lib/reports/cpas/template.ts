import { 
  LOGO_URL, 
  formatNumber,
  formatCurrency,
  formatPercent,
  parseNum,
  calculateGrowth,
} from '../shared-styles'
import {
  getSafeBreakdownData,
  getTopPerformer,
  getTopItems,
  getDimensionValue
} from '../breakdown-helpers'

// Bootstrap Icons CDN
const BOOTSTRAP_ICONS_CDN = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css'

// Icon helper
const icon = (name: string, size: number = 16, color?: string) => {
  const colorStyle = color ? `color: ${color};` : ''
  return `<i class="bi bi-${name}" style="font-size: ${size}px; ${colorStyle}"></i>`
}

// Compact formatters
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

const getGrowthBadgeNew = (growth: number, inverse: boolean = false): string => {
  const isGood = inverse ? growth < 0 : growth > 0
  const ic = growth > 0 ? '↑' : growth < 0 ? '↓' : '→'
  const color = isGood ? 'var(--success)' : 'var(--danger)'
  const bgColor = isGood ? 'var(--success-light)' : 'var(--danger-light)'
  if (growth === 0) return `<span style="font-size: 9px; padding: 2px 6px; border-radius: 4px; background: var(--gray-200); color: var(--gray-600); font-weight: 600;">0%</span>`
  return `<span style="font-size: 9px; padding: 2px 6px; border-radius: 4px; background: ${bgColor}; color: ${color}; font-weight: 600;">${ic}${Math.abs(growth).toFixed(1)}%</span>`
}

export function generateReactTailwindReport(analysisData: any, reportName?: string, retentionType?: string, objectiveType: string = 'cpas'): string {
  const { thisWeek, lastWeek, breakdown, performanceSummary } = analysisData || {}
  const thisWeekData = performanceSummary?.thisWeek || thisWeek || {}
  const lastWeekData = performanceSummary?.lastWeek || lastWeek || {}
  const breakdownThisWeek = breakdown?.thisWeek || {}
  const breakdownLastWeek = breakdown?.lastWeek || {}

  const isMoM = retentionType === 'mom'
  const comparisonLabel = isMoM ? 'Month-over-Month' : 'Week-over-Week'
  const thisPeriodLabel = isMoM ? 'Bulan Ini' : 'Minggu Ini'
  const lastPeriodLabel = isMoM ? 'Bulan Lalu' : 'Minggu Lalu'
  const periodType = isMoM ? 'Month on Month' : 'Week on Week'
  const defaultReportName = reportName || 'Meta Ads CPAS Performance Report'

  // CPAS-specific metrics
  const thisSpent = parseNum(thisWeekData.amountSpent)
  const lastSpent = parseNum(lastWeekData.amountSpent)
  const thisATC = parseNum(thisWeekData.addsToCart || thisWeekData.results || 0)
  const lastATC = parseNum(lastWeekData.addsToCart || lastWeekData.results || 0)
  const thisPurchases = parseNum(thisWeekData.purchases || 0)
  const lastPurchases = parseNum(lastWeekData.purchases || 0)
  const thisPurchaseValue = parseNum(thisWeekData.purchasesConversionValue || thisWeekData.purchaseValue || 0)
  const lastPurchaseValue = parseNum(lastWeekData.purchasesConversionValue || lastWeekData.purchaseValue || 0)
  const thisContentViews = parseNum(thisWeekData.contentViews || 0)
  const lastContentViews = parseNum(lastWeekData.contentViews || 0)
  const thisImpr = parseNum(thisWeekData.impressions)
  const lastImpr = parseNum(lastWeekData.impressions)
  const thisReach = parseNum(thisWeekData.reach)
  const lastReach = parseNum(lastWeekData.reach)
  const thisLinkClicks = parseNum(thisWeekData.linkClicks)
  const lastLinkClicks = parseNum(lastWeekData.linkClicks)
  const thisFrequency = parseNum(thisWeekData.frequency || 0)
  const lastFrequency = parseNum(lastWeekData.frequency || 0)

  // Derived CPAS metrics
  const thisCPR = thisATC > 0 ? thisSpent / thisATC : 0
  const lastCPR = lastATC > 0 ? lastSpent / lastATC : 0
  const thisCPP = thisPurchases > 0 ? thisSpent / thisPurchases : 0
  const lastCPP = lastPurchases > 0 ? lastSpent / lastPurchases : 0
  const thisROAS = thisSpent > 0 ? thisPurchaseValue / thisSpent : 0
  const lastROAS = lastSpent > 0 ? lastPurchaseValue / lastSpent : 0
  const thisAOV = thisPurchases > 0 ? thisPurchaseValue / thisPurchases : 0
  const lastAOV = lastPurchases > 0 ? lastPurchaseValue / lastPurchases : 0
  const thisCTR = thisImpr > 0 ? (thisLinkClicks / thisImpr) * 100 : parseNum(thisWeekData.ctr || 0)
  const lastCTR = lastImpr > 0 ? (lastLinkClicks / lastImpr) * 100 : parseNum(lastWeekData.ctr || 0)
  const thisCPM = thisImpr > 0 ? (thisSpent / thisImpr) * 1000 : parseNum(thisWeekData.cpm || 0)
  const lastCPM = lastImpr > 0 ? (lastSpent / lastImpr) * 1000 : parseNum(lastWeekData.cpm || 0)
  const thisCPC = thisLinkClicks > 0 ? thisSpent / thisLinkClicks : parseNum(thisWeekData.cpc || 0)
  const lastCPC = lastLinkClicks > 0 ? lastSpent / lastLinkClicks : parseNum(lastWeekData.cpc || 0)
  const thisLPVRate = thisLinkClicks > 0 ? (thisContentViews / thisLinkClicks) * 100 : 0
  const lastLPVRate = lastLinkClicks > 0 ? (lastContentViews / lastLinkClicks) * 100 : 0
  const thisATCRate = thisContentViews > 0 ? (thisATC / thisContentViews) * 100 : 0
  const lastATCRate = lastContentViews > 0 ? (lastATC / lastContentViews) * 100 : 0
  const thisP2ARate = thisATC > 0 ? (thisPurchases / thisATC) * 100 : 0
  const lastP2ARate = lastATC > 0 ? (lastPurchases / lastATC) * 100 : 0

  // Growth calculations
  const spendGrowth = calculateGrowth(thisSpent, lastSpent)
  const atcGrowth = calculateGrowth(thisATC, lastATC)
  const purchasesGrowth = calculateGrowth(thisPurchases, lastPurchases)
  const purchaseValueGrowth = calculateGrowth(thisPurchaseValue, lastPurchaseValue)
  const contentViewsGrowth = calculateGrowth(thisContentViews, lastContentViews)
  const cprGrowth = calculateGrowth(thisCPR, lastCPR)
  const cppGrowth = calculateGrowth(thisCPP, lastCPP)
  const roasGrowth = calculateGrowth(thisROAS, lastROAS)
  const aovGrowth = calculateGrowth(thisAOV, lastAOV)
  const imprGrowth = calculateGrowth(thisImpr, lastImpr)
  const reachGrowth = calculateGrowth(thisReach, lastReach)
  const ctrGrowth = calculateGrowth(thisCTR, lastCTR)
  const cpcGrowth = calculateGrowth(thisCPC, lastCPC)
  const cpmGrowth = calculateGrowth(thisCPM, lastCPM)
  const linkClicksGrowth = calculateGrowth(thisLinkClicks, lastLinkClicks)
  const freqGrowth = calculateGrowth(thisFrequency, lastFrequency)
  const lpvRateGrowth = calculateGrowth(thisLPVRate, lastLPVRate)
  const atcRateGrowth = calculateGrowth(thisATCRate, lastATCRate)
  const p2aRateGrowth = calculateGrowth(thisP2ARate, lastP2ARate)

  // Breakdown data
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

  const isGoodPerformance = roasGrowth > 0 || (atcGrowth > 0 && cprGrowth < 10)
  let slideNumber = 0

  let html = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CPAS Report - ${defaultReportName}</title>
    <link href="${BOOTSTRAP_ICONS_CDN}" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: #059669;
            --primary-dark: #047857;
            --primary-light: #d1fae5;
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
            line-height: 1.4;
            -webkit-font-smoothing: antialiased;
        }
        .slide {
            width: 100%;
            min-height: 100vh;
            background: white;
            padding: 28px 40px;
            position: relative;
            page-break-after: always;
            border-bottom: 1px solid var(--gray-200);
        }
        .slide-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 20px;
            padding-bottom: 12px;
            border-bottom: 2px solid var(--gray-100);
        }
        .slide-header .logo { height: 32px; width: auto; }
        .slide-header .slide-number { font-size: 10px; color: var(--gray-400); font-weight: 500; }
        .slide-title { margin-bottom: 20px; }
        .slide-title h1 { font-size: 22px; font-weight: 700; color: var(--gray-900); margin-bottom: 6px; display: flex; align-items: center; gap: 10px; }
        .slide-title h1 i { color: var(--primary); }
        .slide-title p { font-size: 13px; color: var(--gray-500); }
        .card { background: white; border: 1px solid var(--gray-200); border-radius: 10px; padding: 14px; transition: all 0.2s ease; }
        .card:hover { border-color: var(--primary); box-shadow: 0 3px 8px rgba(5, 150, 105, 0.08); }
        .card-header { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid var(--gray-100); }
        .card-header i { font-size: 16px; color: var(--primary); }
        .card-header span { font-size: 11px; font-weight: 600; color: var(--gray-600); text-transform: uppercase; letter-spacing: 0.4px; }
        .metric-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
        .metric-card { background: var(--gray-50); border: 1px solid var(--gray-200); border-radius: 10px; padding: 14px; text-align: center; }
        .metric-card.highlight { background: var(--primary-light); border-color: var(--primary); }
        .metric-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; font-size: 20px; }
        .metric-icon.green { background: var(--success-light); color: var(--success); }
        .metric-icon.orange { background: var(--warning-light); color: var(--warning); }
        .metric-icon.red { background: var(--danger-light); color: var(--danger); }
        .metric-icon.blue { background: #dbeafe; color: #2563eb; }
        .metric-label { font-size: 11px; font-weight: 600; color: var(--gray-500); text-transform: uppercase; letter-spacing: 0.4px; margin-bottom: 6px; }
        .metric-value { font-size: 20px; font-weight: 700; color: var(--gray-900); margin-bottom: 3px; }
        .metric-compare { font-size: 11px; color: var(--gray-500); margin-bottom: 6px; }
        .badge { display: inline-flex; align-items: center; gap: 3px; padding: 3px 8px; border-radius: 5px; font-size: 10px; font-weight: 600; }
        .badge-success { background: var(--success-light); color: var(--success); }
        .badge-danger { background: var(--danger-light); color: var(--danger); }
        .badge-warning { background: var(--warning-light); color: var(--warning); }
        .badge-primary { background: var(--primary-light); color: var(--primary); }
        .table-container { border: 1px solid var(--gray-200); border-radius: 10px; overflow: hidden; }
        table { width: 100%; border-collapse: collapse; }
        thead { background: var(--primary); color: white; }
        th { padding: 10px 12px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.4px; text-align: left; white-space: nowrap; }
        th:not(:first-child) { text-align: right; }
        td { padding: 8px 12px; font-size: 11px; border-bottom: 1px solid var(--gray-100); }
        td:not(:first-child) { text-align: right; }
        tbody tr:hover { background: var(--gray-50); }
        tbody tr.highlight { background: var(--warning-light); }
        .funnel-container { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 16px; background: var(--gray-50); border-radius: 12px; margin-bottom: 16px; flex-wrap: wrap; }
        .funnel-step { background: white; border: 2px solid var(--gray-200); border-radius: 10px; padding: 12px 14px; text-align: center; min-width: 95px; }
        .funnel-step.active { border-color: var(--primary); background: var(--primary-light); }
        .funnel-step .step-label { font-size: 9px; font-weight: 600; color: var(--gray-500); text-transform: uppercase; letter-spacing: 0.4px; margin-bottom: 4px; }
        .funnel-step .step-value { font-size: 17px; font-weight: 700; color: var(--gray-900); }
        .funnel-arrow { display: flex; flex-direction: column; align-items: center; gap: 3px; }
        .funnel-arrow i { font-size: 16px; color: var(--gray-400); }
        .funnel-arrow .rate { font-size: 9px; font-weight: 600; padding: 2px 5px; border-radius: 4px; background: var(--warning-light); color: var(--warning); }
        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .highlight-box { border-radius: 10px; padding: 16px; }
        .highlight-box.success { background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border: 1px solid #a7f3d0; }
        .highlight-box.danger { background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); border: 1px solid #fecaca; }
        .highlight-box h3 { font-size: 13px; font-weight: 700; margin-bottom: 12px; display: flex; align-items: center; gap: 6px; }
        .highlight-box.success h3 { color: var(--success); }
        .highlight-box.danger h3 { color: var(--danger); }
        .highlight-item { background: white; border-radius: 6px; padding: 10px 12px; margin-bottom: 8px; display: flex; align-items: flex-start; gap: 10px; }
        .highlight-item i { font-size: 14px; margin-top: 1px; }
        .highlight-item strong { display: block; font-size: 11px; color: var(--gray-800); margin-bottom: 2px; }
        .highlight-item p { font-size: 10px; color: var(--gray-500); margin: 0; }
        .info-box { background: linear-gradient(135deg, var(--primary-light) 0%, #ecfdf5 100%); border-left: 4px solid var(--primary); border-radius: 10px; padding: 14px 16px; margin-top: 16px; }
        .info-box h4 { font-size: 12px; font-weight: 700; color: var(--primary-dark); margin-bottom: 8px; display: flex; align-items: center; gap: 6px; }
        .info-box p { font-size: 11px; color: var(--gray-700); line-height: 1.5; margin: 0 0 6px 0; }
        .info-box p:last-child { margin-bottom: 0; }
        .info-box strong { color: var(--primary-dark); }
        .info-box ul { margin: 0 0 8px 0; padding-left: 16px; font-size: 11px; color: var(--gray-700); line-height: 1.5; }
        .info-box ul li { margin-bottom: 4px; }
        .reco-box { background: linear-gradient(135deg, var(--warning-light) 0%, #fffbeb 100%); border-left: 4px solid var(--warning); border-radius: 6px; padding: 10px 12px; margin-top: 8px; }
        .reco-box h4 { font-size: 11px; font-weight: 700; color: var(--warning); margin-bottom: 4px; display: flex; align-items: center; gap: 5px; }
        .reco-box p { font-size: 11px; color: var(--gray-700); line-height: 1.4; margin: 0; }
        .cover-slide { display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; min-height: 100vh; background: linear-gradient(135deg, #064e3b 0%, #059669 100%); color: white; }
        .cover-slide .logo { width: 80px; height: 80px; margin-bottom: 32px; background: white; border-radius: 16px; padding: 12px; }
        .cover-slide .badge-period { background: rgba(255,255,255,0.2); padding: 8px 20px; border-radius: 20px; font-size: 12px; font-weight: 600; letter-spacing: 1px; margin-bottom: 24px; }
        .cover-slide h1 { font-size: 48px; font-weight: 800; margin-bottom: 16px; }
        .cover-slide h2 { font-size: 24px; font-weight: 500; opacity: 0.9; margin-bottom: 8px; }
        .cover-slide .period { font-size: 16px; opacity: 0.8; margin-bottom: 48px; }
        .cover-slide .confidential { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); padding: 16px 24px; border-radius: 12px; max-width: 400px; }
        .cover-slide .confidential p { font-size: 13px; margin: 0; }
        .status-badge { display: inline-flex; align-items: center; gap: 6px; padding: 8px 18px; border-radius: 50px; font-size: 12px; font-weight: 700; margin-bottom: 16px; }
        .status-badge.good { background: var(--success-light); color: var(--success); border: 2px solid var(--success); }
        .status-badge.warning { background: var(--warning-light); color: var(--warning); border: 2px solid var(--warning); }
        .mini-stats { display: grid; grid-template-columns: repeat(6, 1fr); gap: 8px; margin-top: 14px; }
        .mini-stat { background: var(--gray-50); border: 1px solid var(--gray-200); border-radius: 6px; padding: 8px; text-align: center; }
        .mini-stat .label { font-size: 9px; font-weight: 600; color: var(--gray-500); text-transform: uppercase; letter-spacing: 0.4px; margin-bottom: 3px; }
        .mini-stat .value { font-size: 12px; font-weight: 700; color: var(--gray-800); }
        .summary-box { background: linear-gradient(135deg, var(--primary-light) 0%, #ecfdf5 100%); border-left: 4px solid var(--primary); border-radius: 10px; padding: 14px 16px; margin-bottom: 16px; }
        .summary-box h3 { font-size: 12px; font-weight: 700; color: var(--primary-dark); margin-bottom: 6px; display: flex; align-items: center; gap: 6px; }
        .summary-box p { font-size: 12px; color: var(--gray-700); line-height: 1.5; }
        .numbered-list { display: flex; flex-direction: column; gap: 8px; }
        .numbered-item { display: flex; align-items: flex-start; gap: 10px; background: white; padding: 10px 12px; border-radius: 6px; border: 1px solid var(--gray-200); }
        .numbered-item .number { width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; flex-shrink: 0; }
        .numbered-item .number.green { background: var(--primary); color: white; }
        .numbered-item .number.orange { background: var(--warning); color: white; }
        .numbered-item p { font-size: 11px; color: var(--gray-700); line-height: 1.4; margin: 0; }
        .thankyou-slide { display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; min-height: 100vh; background: linear-gradient(135deg, #064e3b 0%, #059669 100%); color: white; }
        .thankyou-slide h1 { font-size: 56px; font-weight: 800; margin-bottom: 16px; }
        .thankyou-slide p { font-size: 18px; opacity: 0.9; margin-bottom: 32px; }
        .thankyou-slide .contact-box { background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3); padding: 24px 40px; border-radius: 16px; }
        .full-table { border: 1px solid var(--gray-200); border-radius: 12px; overflow: visible; }
        .full-table thead { position: sticky; top: 0; z-index: 10; }
        .growth-up { color: var(--success); }
        .growth-down { color: var(--danger); }
        .version-footer { position: fixed; bottom: 8px; right: 12px; font-size: 7px; font-weight: 600; color: var(--gray-400); opacity: 0.6; letter-spacing: 0.3px; z-index: 1000; }
        @page { size: A4 landscape; margin: 0; }
        @media print {
            .slide { page-break-after: always; page-break-inside: avoid; min-height: 100vh; }
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .version-footer { position: fixed; bottom: 6px; right: 10px; font-size: 6px; }
        }
    </style>
</head>
<body>

    <div class="version-footer">v2.0.0 CPAS Compact Design</div>

    <!-- SLIDE 1: COVER -->
    <div class="slide cover-slide" data-slide="${++slideNumber}">
        <img src="${LOGO_URL}" alt="Logo" class="logo">
        <div class="badge-period">${periodType.toUpperCase()} CPAS</div>
        <h1>CPAS Monthly Report</h1>
        <h2>${defaultReportName}</h2>
        <p class="period">${lastPeriodLabel} vs ${thisPeriodLabel}</p>
        <div class="confidential">
            <p>${icon('lock-fill', 14)} <strong>Private & Confidential</strong></p>
            <p style="margin-top: 8px; opacity: 0.8;">This report contains proprietary CPAS performance insights prepared exclusively for our valued client.</p>
        </div>
        <div style="margin-top: 24px; padding: 8px 20px; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3); border-radius: 20px; display: inline-block;">
            <p style="font-size: 11px; margin: 0; opacity: 0.9;"><strong style="color: #fbbf24;">CPAS</strong> Collaborative Performance Advertising Solution</p>
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

        <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 16px; padding: 10px 14px; background: ${isGoodPerformance ? 'var(--success-light)' : 'var(--warning-light)'}; border-left: 4px solid ${isGoodPerformance ? 'var(--success)' : 'var(--warning)'}; border-radius: 8px;">
            <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 11px; font-weight: 700; color: ${isGoodPerformance ? 'var(--success)' : 'var(--warning)'};">
                    ${isGoodPerformance ? icon('check-circle-fill', 16) : icon('exclamation-triangle-fill', 16)}
                    ${isGoodPerformance ? 'GOOD PERFORMANCE' : 'NEEDS ATTENTION'}
                </span>
            </div>
            <div style="font-size: 10px; color: var(--gray-700);">
                <strong>${atcGrowth >= 0 ? '+' : ''}${Math.abs(atcGrowth).toFixed(1)}%</strong> ATC &bull;
                ROAS: ${thisROAS.toFixed(2)}x &bull;
                CPR: ${cprGrowth <= 0 ? '↓' : '↑'}${Math.abs(cprGrowth).toFixed(1)}%
            </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 10px; margin-bottom: 14px;">
            <div class="card" style="text-align: center; padding: 10px 8px; border-top: 3px solid var(--primary);">
                <div class="metric-label" style="margin-bottom: 4px; font-size: 9px;">ATC</div>
                <div class="metric-value" style="font-size: 16px;">${formatNumberCompact(thisATC)}</div>
                <div style="margin-top: 4px; font-size: 9px;">${getGrowthBadgeNew(atcGrowth)}</div>
            </div>
            <div class="card" style="text-align: center; padding: 10px 8px; border-top: 3px solid #7c3aed;">
                <div class="metric-label" style="margin-bottom: 4px; font-size: 9px;">ROAS</div>
                <div class="metric-value" style="font-size: 16px;">${thisROAS.toFixed(2)}x</div>
                <div style="margin-top: 4px; font-size: 9px;">${getGrowthBadgeNew(roasGrowth)}</div>
            </div>
            <div class="card" style="text-align: center; padding: 10px 8px; border-top: 3px solid var(--warning);">
                <div class="metric-label" style="margin-bottom: 4px; font-size: 9px;">Spend</div>
                <div class="metric-value" style="font-size: 16px;">${formatCurrencyCompact(thisSpent)}</div>
                <div style="margin-top: 4px; font-size: 9px;">${getGrowthBadgeNew(spendGrowth, true)}</div>
            </div>
            <div class="card" style="text-align: center; padding: 10px 8px; border-top: 3px solid #f59e0b;">
                <div class="metric-label" style="margin-bottom: 4px; font-size: 9px;">Purchases</div>
                <div class="metric-value" style="font-size: 16px;">${formatNumberCompact(thisPurchases)}</div>
                <div style="margin-top: 4px; font-size: 9px;">${getGrowthBadgeNew(purchasesGrowth)}</div>
            </div>
            <div class="card" style="text-align: center; padding: 10px 8px; border-top: 3px solid #06b6d4;">
                <div class="metric-label" style="margin-bottom: 4px; font-size: 9px;">Reach</div>
                <div class="metric-value" style="font-size: 16px;">${formatNumberCompact(thisReach)}</div>
                <div style="margin-top: 4px; font-size: 9px;">${getGrowthBadgeNew(reachGrowth)}</div>
            </div>
            <div class="card" style="text-align: center; padding: 10px 8px; border-top: 3px solid #ec4899;">
                <div class="metric-label" style="margin-bottom: 4px; font-size: 9px;">Impr</div>
                <div class="metric-value" style="font-size: 16px;">${formatNumberCompact(thisImpr)}</div>
                <div style="margin-top: 4px; font-size: 9px;">${getGrowthBadgeNew(imprGrowth)}</div>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 14px;">
            <div style="padding: 10px 12px; background: linear-gradient(135deg, var(--success-light) 0%, #d1fae5 100%); border-left: 3px solid var(--success); border-radius: 8px;">
                <div style="font-size: 10px; font-weight: 700; color: var(--success); margin-bottom: 4px; display: flex; align-items: center; gap: 5px;">
                    ${icon('cart-plus-fill', 12)} ATC PERFORMANCE
                </div>
                <p style="font-size: 10px; color: var(--gray-700); line-height: 1.4; margin: 0;">
                    <strong>${atcGrowth >= 0 ? 'Peningkatan' : 'Penurunan'} ${Math.abs(atcGrowth).toFixed(1)}%</strong> pada Add to Cart (${formatNumberCompact(lastATC)} &rarr; ${formatNumberCompact(thisATC)}), CPR ${formatCurrencyCompact(thisCPR)}
                </p>
            </div>
            <div style="padding: 10px 12px; background: linear-gradient(135deg, ${roasGrowth >= 0 ? 'var(--success-light)' : 'var(--warning-light)'} 0%, ${roasGrowth >= 0 ? '#d1fae5' : '#fef3c7'} 100%); border-left: 3px solid ${roasGrowth >= 0 ? 'var(--success)' : 'var(--warning)'}; border-radius: 8px;">
                <div style="font-size: 10px; font-weight: 700; color: ${roasGrowth >= 0 ? 'var(--success)' : 'var(--warning)'}; margin-bottom: 4px; display: flex; align-items: center; gap: 5px;">
                    ${icon('graph-up-arrow', 12)} ROAS & PURCHASES
                </div>
                <p style="font-size: 10px; color: var(--gray-700); line-height: 1.4; margin: 0;">
                    ROAS <strong class="${roasGrowth >= 0 ? 'growth-up' : 'growth-down'}">${roasGrowth >= 0 ? 'naik' : 'turun'} ${Math.abs(roasGrowth).toFixed(1)}%</strong> (${lastROAS.toFixed(2)}x &rarr; ${thisROAS.toFixed(2)}x), ${formatNumberCompact(thisPurchases)} Purchases
                </p>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 6px; margin-top: 12px;">
            <div style="text-align: center; padding: 6px; background: var(--gray-50); border-radius: 6px; border: 1px solid var(--gray-200);">
                <div style="font-size: 8px; font-weight: 600; color: var(--gray-500); text-transform: uppercase; margin-bottom: 2px;">CPR</div>
                <div style="font-size: 11px; font-weight: 700; color: var(--gray-800);">${formatCurrencyCompact(thisCPR)}</div>
            </div>
            <div style="text-align: center; padding: 6px; background: var(--gray-50); border-radius: 6px; border: 1px solid var(--gray-200);">
                <div style="font-size: 8px; font-weight: 600; color: var(--gray-500); text-transform: uppercase; margin-bottom: 2px;">CPP</div>
                <div style="font-size: 11px; font-weight: 700; color: var(--gray-800);">${formatCurrencyCompact(thisCPP)}</div>
            </div>
            <div style="text-align: center; padding: 6px; background: var(--gray-50); border-radius: 6px; border: 1px solid var(--gray-200);">
                <div style="font-size: 8px; font-weight: 600; color: var(--gray-500); text-transform: uppercase; margin-bottom: 2px;">AOV</div>
                <div style="font-size: 11px; font-weight: 700; color: var(--gray-800);">${formatCurrencyCompact(thisAOV)}</div>
            </div>
            <div style="text-align: center; padding: 6px; background: var(--gray-50); border-radius: 6px; border: 1px solid var(--gray-200);">
                <div style="font-size: 8px; font-weight: 600; color: var(--gray-500); text-transform: uppercase; margin-bottom: 2px;">CTR</div>
                <div style="font-size: 11px; font-weight: 700; color: var(--gray-800);">${thisCTR.toFixed(2)}%</div>
            </div>
            <div style="text-align: center; padding: 6px; background: var(--gray-50); border-radius: 6px; border: 1px solid var(--gray-200);">
                <div style="font-size: 8px; font-weight: 600; color: var(--gray-500); text-transform: uppercase; margin-bottom: 2px;">CPM</div>
                <div style="font-size: 11px; font-weight: 700; color: var(--gray-800);">${formatCurrencyCompact(thisCPM)}</div>
            </div>
            <div style="text-align: center; padding: 6px; background: var(--gray-50); border-radius: 6px; border: 1px solid var(--gray-200);">
                <div style="font-size: 8px; font-weight: 600; color: var(--gray-500); text-transform: uppercase; margin-bottom: 2px;">P.Value</div>
                <div style="font-size: 11px; font-weight: 700; color: var(--gray-800);">${formatCurrencyCompact(thisPurchaseValue)}</div>
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
            <p>Customer Journey dari Impression ke  CPAS Catalog</p>Purchase 
        </div>

        <div class="funnel-container">
            <div class="funnel-step" style="border-color: var(--primary); background: var(--primary-light);">
                <div class="step-label">${icon('eye', 12)} Impressions</div>
                <div class="step-value">${formatNumber(thisImpr)}</div>
                ${getGrowthBadgeNew(imprGrowth)}
            </div>
            <div class="funnel-arrow">
                ${icon('arrow-right', 20)}
                <div class="rate">CTR: ${thisCTR.toFixed(2)}%</div>
            </div>
            <div class="funnel-step" style="border-color: var(--warning); background: var(--warning-light);">
                <div class="step-label">${icon('hand-index-thumb', 12)} Link Clicks</div>
                <div class="step-value">${formatNumber(thisLinkClicks)}</div>
                ${getGrowthBadgeNew(linkClicksGrowth)}
            </div>
            <div class="funnel-arrow">
                ${icon('arrow-right', 20)}
                <div class="rate">LPV: ${thisLPVRate.toFixed(1)}%</div>
            </div>
            <div class="funnel-step" style="border-color: #7c3aed; background: #ede9fe;">
                <div class="step-label">${icon('eye-fill', 12)} Content Views</div>
                <div class="step-value">${thisContentViews > 0 ? formatNumber(thisContentViews) : 'N/A'}</div>
                ${thisContentViews > 0 ? getGrowthBadgeNew(contentViewsGrowth) : ''}
            </div>
            <div class="funnel-arrow">
                ${icon('arrow-right', 20)}
                <div class="rate">ATC: ${thisATCRate.toFixed(1)}%</div>
            </div>
            <div class="funnel-step" style="border-color: var(--primary); background: var(--primary-light);">
                <div class="step-label">${icon('cart-plus-fill', 12)} Add to Cart</div>
                <div class="step-value">${formatNumber(thisATC)}</div>
                ${getGrowthBadgeNew(atcGrowth)}
            </div>
            <div class="funnel-arrow">
                ${icon('arrow-right', 20)}
                <div class="rate" style="background: var(--success-light); color: var(--success);">P2A: ${thisP2ARate.toFixed(1)}%</div>
            </div>
            <div class="funnel-step" style="border-color: #059669; background: var(--success-light);">
                <div class="step-label">${icon('bag-check-fill', 12)} Purchases</div>
                <div class="step-value">${formatNumber(thisPurchases)}</div>
                ${getGrowthBadgeNew(purchasesGrowth)}
            </div>
        </div>

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
                        <td>${icon('eye-fill', 14)} Content Views (LPV)</td>
                        <td>${lastContentViews > 0 ? formatNumber(lastContentViews) : 'N/A'}</td>
                        <td><strong>${thisContentViews > 0 ? formatNumber(thisContentViews) : 'N/A'}</strong></td>
                        <td>${thisContentViews > 0 ? getGrowthBadgeNew(contentViewsGrowth) : '-'}</td>
                    </tr>
                    <tr style="background: var(--primary-light);">
                        <td><strong>${icon('cart-plus-fill', 14)} Add to Cart</strong></td>
                        <td>${formatNumber(lastATC)}</td>
                        <td><strong style="color: var(--primary);">${formatNumber(thisATC)}</strong></td>
                        <td>${getGrowthBadgeNew(atcGrowth)}</td>
                    </tr>
                    <tr style="background: var(--success-light);">
                        <td><strong>${icon('bag-check-fill', 14)} Purchases</strong></td>
                        <td>${formatNumber(lastPurchases)}</td>
                        <td><strong style="color: var(--success);">${formatNumber(thisPurchases)}</strong></td>
                        <td>${getGrowthBadgeNew(purchasesGrowth)}</td>
                    </tr>
                    <tr>
                        <td>${icon('graph-up-arrow', 14)} Purchase Value</td>
                        <td>${formatCurrency(lastPurchaseValue)}</td>
                        <td><strong>${formatCurrency(thisPurchaseValue)}</strong></td>
                        <td>${getGrowthBadgeNew(purchaseValueGrowth)}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="info-box">
            <p><strong>${icon('info-circle-fill', 14)} Insight:</strong> ${thisCTR > lastCTR ? 'CTR meningkat — creative catalog lebih menarik.' : 'CTR menurun — perlu optimasi creative catalog.'} ${thisP2ARate > lastP2ARate ? 'P2A Rate membaik — konversi ATC ke Purchase meningkat.' : 'P2A Rate menurun — perlu optimasi checkout atau retargeting.'} ROAS saat ini: <strong>${thisROAS.toFixed(2)}x</strong>.</p>
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
            <p>${comparisonLabel} All Metrics Comparison</p>
        </div>

        <div class="metric-grid" style="margin-bottom: 20px;">
            ${generateMetricCard('wallet2', 'Amount Spent', formatCurrency(thisSpent), formatCurrency(lastSpent), spendGrowth, true, thisPeriodLabel, lastPeriodLabel)}
            ${generateMetricCard('cart-plus-fill', 'Add to Cart', formatNumber(thisATC), formatNumber(lastATC), atcGrowth, false, thisPeriodLabel, lastPeriodLabel, true)}
            ${generateMetricCard('bag-check-fill', 'Purchases', formatNumber(thisPurchases), formatNumber(lastPurchases), purchasesGrowth, false, thisPeriodLabel, lastPeriodLabel)}
            ${generateMetricCard('graph-up-arrow', 'Purchase Value', formatCurrency(thisPurchaseValue), formatCurrency(lastPurchaseValue), purchaseValueGrowth, false, thisPeriodLabel, lastPeriodLabel)}
            ${generateMetricCard('trophy-fill', 'ROAS', thisROAS.toFixed(2) + 'x', lastROAS.toFixed(2) + 'x', roasGrowth, false, thisPeriodLabel, lastPeriodLabel, false, roasGrowth >= 0)}
            ${generateMetricCard('currency-dollar', 'Cost per ATC', formatCurrency(thisCPR), formatCurrency(lastCPR), cprGrowth, true, thisPeriodLabel, lastPeriodLabel, false, cprGrowth <= 0)}
        </div>

        <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px;">
            ${generateMiniMetric('CPP', formatCurrency(thisCPP), cppGrowth, true)}
            ${generateMiniMetric('AOV', formatCurrency(thisAOV), aovGrowth)}
            ${generateMiniMetric('CTR', thisCTR.toFixed(2) + '%', ctrGrowth)}
            ${generateMiniMetric('CPM', formatCurrency(thisCPM), cpmGrowth, true)}
            ${generateMiniMetric('P2A Rate', thisP2ARate.toFixed(1) + '%', p2aRateGrowth)}
        </div>

        <div class="info-box">
            <p><strong>${icon('info-circle-fill', 14)} Key Insight:</strong> ${spendGrowth < 0 ? 'Penghematan budget' : 'Peningkatan budget'} sebesar <strong>${Math.abs(spendGrowth).toFixed(2)}%</strong> dengan ${atcGrowth >= 0 ? 'peningkatan' : 'penurunan'} ATC sebesar <strong>${Math.abs(atcGrowth).toFixed(2)}%</strong>. ROAS ${roasGrowth >= 0 ? 'meningkat' : 'turun'} <strong>${Math.abs(roasGrowth).toFixed(2)}%</strong> menjadi <strong>${thisROAS.toFixed(2)}x</strong>. CPR ${cprGrowth <= 0 ? 'membaik' : 'naik'} <strong>${Math.abs(cprGrowth).toFixed(2)}%</strong>.</p>
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
            <div class="highlight-box success">
                <h3>${icon('check-circle-fill', 18)} Highlights</h3>
                ${generateCPASHighlightItems(true, atcGrowth, purchasesGrowth, roasGrowth, cprGrowth, cppGrowth, spendGrowth, reachGrowth, ctrGrowth, purchaseValueGrowth, aovGrowth, thisATC, lastATC, thisPurchases, lastPurchases, thisROAS, lastROAS, thisCPR, lastCPR, thisSpent, lastSpent, imprGrowth, linkClicksGrowth, cpmGrowth, cpcGrowth)}
            </div>
            <div class="highlight-box danger">
                <h3>${icon('x-circle-fill', 18)} Lowlights</h3>
                ${generateCPASHighlightItems(false, atcGrowth, purchasesGrowth, roasGrowth, cprGrowth, cppGrowth, spendGrowth, reachGrowth, ctrGrowth, purchaseValueGrowth, aovGrowth, thisATC, lastATC, thisPurchases, lastPurchases, thisROAS, lastROAS, thisCPR, lastCPR, thisSpent, lastSpent, imprGrowth, linkClicksGrowth, cpmGrowth, cpcGrowth)}
            </div>
        </div>

        <div class="info-box" style="margin-top: 24px;">
            <p><strong>${icon('info-circle-fill', 14)} Summary:</strong> ${roasGrowth >= 0 ? 'ROAS meningkat ' + roasGrowth.toFixed(2) + '% menjadi ' + thisROAS.toFixed(2) + 'x — catalog ads efektif.' : 'ROAS turun ' + Math.abs(roasGrowth).toFixed(2) + '% — perlu optimasi produk catalog dan audience.'} ${atcGrowth < 0 ? 'Penurunan ATC sebesar ' + Math.abs(atcGrowth).toFixed(2) + '% perlu ditangani dengan refresh creative catalog.' : 'Peningkatan ATC menunjukkan user intent tinggi terhadap produk di catalog.'}</p>
        </div>
    </div>`


  // Breakdown Slides
  if (ageData.length > 0) {
    html += generateCPASAgeSlide(ageData, ageDataLast, thisPeriodLabel, lastPeriodLabel, ++slideNumber)
  }
  if (genderData.length > 0) {
    html += generateCPASGenderSlide(genderData, genderDataLast, thisPeriodLabel, lastPeriodLabel, ++slideNumber)
  }
  if (regionData.length > 0) {
    html += generateCPASRegionSlide(regionData, regionDataLast, thisPeriodLabel, lastPeriodLabel, ++slideNumber)
  }
  if (placementData.length > 0) {
    html += generateCPASPlacementSlide(placementData, placementDataLast, thisPeriodLabel, lastPeriodLabel, ++slideNumber)
  }
  if (platformData.length > 0) {
    html += generateCPASPlatformSlide(platformData, platformDataLast, thisPeriodLabel, lastPeriodLabel, ++slideNumber)
  }
  if (objectiveData.length > 0) {
    html += generateCPASObjectiveSlide(objectiveData, ++slideNumber)
  }
  if (adCreativeData.length > 0) {
    html += generateCPASAdCreativeSlide(adCreativeData, ++slideNumber)
    html += generateCPASContentPerformanceSlide(adCreativeData, ++slideNumber)
  }

  html += generateCPASConclusionSlide(
    { thisSpent, lastSpent, spendGrowth },
    { thisATC, lastATC, atcGrowth },
    { thisPurchases, lastPurchases, purchasesGrowth },
    { thisPurchaseValue, lastPurchaseValue, purchaseValueGrowth },
    { thisROAS, lastROAS, roasGrowth },
    { thisCPR, lastCPR, cprGrowth },
    { thisCPP, lastCPP, cppGrowth },
    ++slideNumber
  )

  html += `
    <!-- SLIDE: THANK YOU -->
    <div class="slide thankyou-slide" data-slide="${++slideNumber}">
        <img src="${LOGO_URL}" alt="Logo" style="width: 80px; height: 80px; margin-bottom: 32px; background: white; border-radius: 16px; padding: 12px;">
        <h1>Thank You!</h1>
        <p>We appreciate your trust in managing your Meta CPAS campaigns</p>
        <div class="contact-box">
            <p style="font-size: 16px; font-weight: 600; margin-bottom: 8px;">${icon('chat-square-text-fill', 18)} Questions or Feedback?</p>
            <p>Contact us anytime for CPAS campaign consultation</p>
        </div>
        <p style="margin-top: 32px; font-size: 11px; opacity: 0.7;">
            <strong>Version 2.0.0</strong> &bull; CPAS Compact Design System &bull; Generated on ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
        </p>
        <p style="margin-top: 24px; font-size: 11px; opacity: 0.6;">&copy; 2026 Hadona Digital Media. All rights reserved.</p>
    </div>
</body>
</html>`

  return html
}

// ============ HELPER FUNCTIONS ============

function generateMetricCard(iconName: string, label: string, thisValue: string, lastValue: string, growth: number, inverse: boolean, thisPeriodLabel: string, lastPeriodLabel: string, highlight: boolean = false, isGood: boolean = false): string {
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

function generateCPASHighlightItems(
  isHighlight: boolean,
  atcGrowth: number, purchasesGrowth: number, roasGrowth: number,
  cprGrowth: number, cppGrowth: number, spendGrowth: number, reachGrowth: number,
  ctrGrowth: number, purchaseValueGrowth: number, aovGrowth: number,
  thisATC: number, lastATC: number, thisPurchases: number, lastPurchases: number,
  thisROAS: number, lastROAS: number, thisCPR: number, lastCPR: number,
  thisSpent: number, lastSpent: number,
  imprGrowth?: number, linkClicksGrowth?: number, cpmGrowth?: number, cpcGrowth?: number
): string {
  const items: string[] = []
  const iconCheck = '<i class="bi bi-check-lg" style="color: var(--success);"></i>'
  const iconX = '<i class="bi bi-x-lg" style="color: var(--danger);"></i>'

  if (isHighlight) {
    if (roasGrowth > 0) items.push(`<div class="highlight-item">${iconCheck}<div><strong>ROAS Naik ${roasGrowth.toFixed(1)}%</strong><p>${lastROAS.toFixed(2)}x &rarr; ${thisROAS.toFixed(2)}x</p></div></div>`)
    if (atcGrowth > 0) items.push(`<div class="highlight-item">${iconCheck}<div><strong>ATC Naik ${atcGrowth.toFixed(1)}%</strong><p>${formatNumberCompact(lastATC)} &rarr; ${formatNumberCompact(thisATC)} Add to Cart</p></div></div>`)
    if (purchasesGrowth > 0) items.push(`<div class="highlight-item">${iconCheck}<div><strong>Purchases Naik ${purchasesGrowth.toFixed(1)}%</strong><p>${formatNumberCompact(lastPurchases)} &rarr; ${formatNumberCompact(thisPurchases)}</p></div></div>`)
    if (cprGrowth < 0) items.push(`<div class="highlight-item">${iconCheck}<div><strong>CPR Turun ${Math.abs(cprGrowth).toFixed(1)}%</strong><p>${formatCurrencyCompact(lastCPR)} &rarr; ${formatCurrencyCompact(thisCPR)}</p></div></div>`)
    if (cppGrowth < 0) items.push(`<div class="highlight-item">${iconCheck}<div><strong>CPP Turun ${Math.abs(cppGrowth).toFixed(1)}%</strong><p>Cost per Purchase lebih efisien</p></div></div>`)
    if (spendGrowth < 0) items.push(`<div class="highlight-item">${iconCheck}<div><strong>Budget Hemat ${Math.abs(spendGrowth).toFixed(1)}%</strong><p>${formatCurrencyCompact(lastSpent)} &rarr; ${formatCurrencyCompact(thisSpent)}</p></div></div>`)
    if (purchaseValueGrowth > 0) items.push(`<div class="highlight-item">${iconCheck}<div><strong>Purchase Value Naik ${purchaseValueGrowth.toFixed(1)}%</strong><p>Revenue catalog meningkat</p></div></div>`)
    if (aovGrowth > 0) items.push(`<div class="highlight-item">${iconCheck}<div><strong>AOV Naik ${aovGrowth.toFixed(1)}%</strong><p>Nilai order rata-rata meningkat</p></div></div>`)
    if (ctrGrowth > 0) items.push(`<div class="highlight-item">${iconCheck}<div><strong>CTR Naik ${ctrGrowth.toFixed(1)}%</strong><p>Creative catalog lebih menarik</p></div></div>`)
    if (reachGrowth > 0) items.push(`<div class="highlight-item">${iconCheck}<div><strong>Reach Naik ${reachGrowth.toFixed(1)}%</strong><p>Jangkauan audiens meningkat</p></div></div>`)
    if (cpmGrowth && cpmGrowth < 0) items.push(`<div class="highlight-item">${iconCheck}<div><strong>CPM Turun ${Math.abs(cpmGrowth).toFixed(1)}%</strong><p>Biaya per 1000 impr lebih murah</p></div></div>`)
    if (items.length < 4) items.push(`<div class="highlight-item">${iconCheck}<div><strong>Catalog Aktif</strong><p>${formatNumberCompact(thisATC)} ATC dari catalog</p></div></div>`)
    if (items.length < 4) items.push(`<div class="highlight-item">${iconCheck}<div><strong>ROAS Terjaga</strong><p>Return ${thisROAS.toFixed(2)}x per Rp yang diinvestasikan</p></div></div>`)
    if (items.length < 4) items.push(`<div class="highlight-item">${iconCheck}<div><strong>Catalog Terus Berjalan</strong><p>Campaign aktif menghasilkan konversi</p></div></div>`)
    if (items.length < 4) items.push(`<div class="highlight-item">${iconCheck}<div><strong>Database Pembeli Bertambah</strong><p>Reach catalog terus berkembang</p></div></div>`)
  } else {
    if (roasGrowth < 0) items.push(`<div class="highlight-item">${iconX}<div><strong>ROAS Turun ${Math.abs(roasGrowth).toFixed(1)}%</strong><p>${lastROAS.toFixed(2)}x &rarr; ${thisROAS.toFixed(2)}x — review catalog</p></div></div>`)
    if (atcGrowth < 0) items.push(`<div class="highlight-item">${iconX}<div><strong>ATC Turun ${Math.abs(atcGrowth).toFixed(1)}%</strong><p>${formatNumberCompact(lastATC)} &rarr; ${formatNumberCompact(thisATC)}</p></div></div>`)
    if (purchasesGrowth < 0) items.push(`<div class="highlight-item">${iconX}<div><strong>Purchases Turun ${Math.abs(purchasesGrowth).toFixed(1)}%</strong><p>Konversi ke transaksi menurun</p></div></div>`)
    if (cprGrowth > 0) items.push(`<div class="highlight-item">${iconX}<div><strong>CPR Naik ${cprGrowth.toFixed(1)}%</strong><p>Biaya per ATC meningkat</p></div></div>`)
    if (cppGrowth > 0) items.push(`<div class="highlight-item">${iconX}<div><strong>CPP Naik ${cppGrowth.toFixed(1)}%</strong><p>Cost per Purchase meningkat</p></div></div>`)
    if (reachGrowth < 0) items.push(`<div class="highlight-item">${iconX}<div><strong>Reach Turun ${Math.abs(reachGrowth).toFixed(1)}%</strong><p>Jangkauan audiens berkurang</p></div></div>`)
    if (ctrGrowth < 0) items.push(`<div class="highlight-item">${iconX}<div><strong>CTR Turun ${Math.abs(ctrGrowth).toFixed(1)}%</strong><p>Creative catalog perlu di-refresh</p></div></div>`)
    if (purchaseValueGrowth < 0) items.push(`<div class="highlight-item">${iconX}<div><strong>Purchase Value Turun ${Math.abs(purchaseValueGrowth).toFixed(1)}%</strong><p>Revenue catalog menurun</p></div></div>`)
    if (spendGrowth > 0 && atcGrowth <= 0) items.push(`<div class="highlight-item">${iconX}<div><strong>Budget Naik ${spendGrowth.toFixed(1)}%</strong><p>Tanpa peningkatan ATC/Purchase</p></div></div>`)
    if (cpmGrowth && cpmGrowth > 0) items.push(`<div class="highlight-item">${iconX}<div><strong>CPM Naik ${cpmGrowth.toFixed(1)}%</strong><p>Biaya impresi meningkat</p></div></div>`)
    if (items.length < 4) items.push(`<div class="highlight-item">${iconX}<div><strong>Perlu Optimasi Catalog</strong><p>Review produk dan harga di catalog</p></div></div>`)
    if (items.length < 4) items.push(`<div class="highlight-item">${iconX}<div><strong>Creative Refresh Diperlukan</strong><p>Test visual baru untuk catalog ads</p></div></div>`)
    if (items.length < 4) items.push(`<div class="highlight-item">${iconX}<div><strong>Target Audience Review</strong><p>Evaluasi lookalike dan interest targeting</p></div></div>`)
    if (items.length < 4) items.push(`<div class="highlight-item">${iconX}<div><strong>Monitoring Intensif</strong><p>Pantau ROAS dan CPP secara harian</p></div></div>`)
  }

  return items.slice(0, 5).join('')
}

function generateCPASAgeSlide(data: any[], lastData: any[], thisPeriodLabel: string, lastPeriodLabel: string, slideNumber: number): string {
  const getATC = (item: any) => parseNum(item['Adds to cart with shared items'] || item['Results'] || 0)
  const totalATC = data.reduce((sum, item) => sum + getATC(item), 0)
  const sortedData = [...data].sort((a, b) => getATC(b) - getATC(a))
  const top10 = sortedData.slice(0, 10)

  const tableRows = top10.map((item, index) => {
    const age = item['Age'] || 'Unknown'
    const atc = getATC(item)
    const spent = parseNum(item['Amount spent (IDR)'] || 0)
    const purchases = parseNum(item['Purchases with shared items'] || 0)
    const cpr = atc > 0 ? spent / atc : 0
    const pct = totalATC > 0 ? (atc / totalATC) * 100 : 0
    const isTop = index < 2
    const lastItem = lastData.find((l: any) => l['Age'] === age)
    const lastATC2 = lastItem ? getATC(lastItem) : 0
    const growth = calculateGrowth(atc, lastATC2)
    return `
      <tr ${isTop ? 'style="background: var(--warning-light);"' : ''}>
        <td><strong>${age}</strong>${isTop ? '<span style="font-size:8px;background:var(--warning);color:white;padding:2px 4px;border-radius:3px;margin-left:4px;">TOP</span>' : ''}</td>
        <td>${formatNumberCompact(atc)} <span style="color:var(--gray-400);font-size:9px;">(${pct.toFixed(0)}%)</span></td>
        <td>${formatCurrencyCompact(cpr)}</td>
        <td>${formatNumberCompact(purchases)}</td>
        <td>${formatCurrencyCompact(spent)}</td>
        <td>${getGrowthBadgeNew(growth)}</td>
      </tr>`
  }).join('')

  const topAge = sortedData[0]?.['Age'] || 'N/A'
  const top2Age = sortedData[1]?.['Age'] || 'N/A'
  const top2ATCSum = getATC(sortedData[0] || {}) + getATC(sortedData[1] || {})
  const topPct = totalATC > 0 ? (top2ATCSum / totalATC * 100).toFixed(0) : '0'

  return `
    <div class="slide" data-slide="${slideNumber}">
        <div class="slide-header"><img src="${LOGO_URL}" alt="Logo" class="logo"><span class="slide-number">Slide ${slideNumber}</span></div>
        <div class="slide-title"><h1>${icon('calendar3')} Age Breakdown</h1><p>Performance by Age Group &bull; ${thisPeriodLabel}</p></div>
        <div style="padding:8px 12px;background:var(--warning-light);border-left:3px solid var(--warning);border-radius:6px;margin-bottom:12px;">
            <p style="font-size:10px;margin:0;color:var(--gray-700);"><strong>Top 2:</strong> ${topAge} + ${top2Age} = <strong>${topPct}%</strong> total ATC</p>
        </div>
        <div class="table-container" style="font-size:10px;">
            <table>
                <thead><tr>
                    <th style="padding:8px 10px;font-size:10px;">Age</th>
                    <th style="padding:8px 10px;font-size:10px;">ATC</th>
                    <th style="padding:8px 10px;font-size:10px;">CPR</th>
                    <th style="padding:8px 10px;font-size:10px;">Purchases</th>
                    <th style="padding:8px 10px;font-size:10px;">Spent</th>
                    <th style="padding:8px 10px;font-size:10px;text-align:center;">Growth</th>
                </tr></thead>
                <tbody>${tableRows}</tbody>
            </table>
        </div>
    </div>`
}

function generateCPASGenderSlide(data: any[], lastData: any[], thisPeriodLabel: string, lastPeriodLabel: string, slideNumber: number): string {
  const getATC = (item: any) => parseNum(item['Adds to cart with shared items'] || item['Results'] || 0)
  const totalATC = data.reduce((sum, item) => sum + getATC(item), 0)
  const sortedData = [...data].sort((a, b) => getATC(b) - getATC(a))

  const genderCards = sortedData.map((item, index) => {
    const gender = item['Gender'] || 'Unknown'
    const atc = getATC(item)
    const spent = parseNum(item['Amount spent (IDR)'] || 0)
    const purchases = parseNum(item['Purchases with shared items'] || 0)
    const pct = totalATC > 0 ? (atc / totalATC) * 100 : 0
    const cpr = atc > 0 ? spent / atc : 0
    const isTop = index === 0
    const lastItem = lastData.find((l: any) => l['Gender'] === gender)
    const lastATC2 = lastItem ? getATC(lastItem) : 0
    const growth = calculateGrowth(atc, lastATC2)
    const genderLower = gender.toLowerCase()
    const isMale = genderLower === 'male'
    const isFemale = genderLower === 'female'
    const iconName = isMale ? 'gender-male' : isFemale ? 'gender-female' : 'person-fill'
    const iconColor = isMale ? 'var(--primary)' : isFemale ? '#db2777' : 'var(--gray-600)'
    return `
      <div class="card" style="text-align:center;padding:12px;border-top:3px solid ${iconColor};${isTop ? 'background:var(--warning-light);border:2px solid var(--warning);' : ''}">
        <div style="display:flex;align-items:center;justify-content:center;gap:6px;margin-bottom:6px;">
          <i class="bi bi-${iconName}" style="font-size:20px;color:${iconColor};"></i>
          <span style="font-size:14px;font-weight:700;">${gender}</span>
          ${isTop ? '<span style="font-size:8px;background:var(--warning);color:white;padding:2px 4px;border-radius:3px;">TOP</span>' : ''}
        </div>
        <div style="font-size:24px;font-weight:700;color:${iconColor};margin-bottom:4px;">${pct.toFixed(1)}%</div>
        <p style="font-size:10px;color:var(--gray-500);margin-bottom:8px;">${formatNumberCompact(atc)} ATC</p>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px;margin-bottom:6px;">
          <div style="background:var(--gray-50);border-radius:4px;padding:5px;"><div style="font-size:8px;color:var(--gray-500);">Spent</div><div style="font-size:11px;font-weight:600;">${formatCurrencyCompact(spent)}</div></div>
          <div style="background:var(--gray-50);border-radius:4px;padding:5px;"><div style="font-size:8px;color:var(--gray-500);">CPR</div><div style="font-size:11px;font-weight:600;">${formatCurrencyCompact(cpr)}</div></div>
          <div style="background:var(--gray-50);border-radius:4px;padding:5px;"><div style="font-size:8px;color:var(--gray-500);">Purchases</div><div style="font-size:11px;font-weight:600;">${formatNumberCompact(purchases)}</div></div>
        </div>
        ${getGrowthBadgeNew(growth)}
      </div>`
  }).join('')

  const topGender = sortedData[0]?.['Gender'] || 'N/A'
  const topPct = totalATC > 0 ? (getATC(sortedData[0] || {}) / totalATC * 100).toFixed(0) : '0'

  return `
    <div class="slide" data-slide="${slideNumber}">
        <div class="slide-header"><img src="${LOGO_URL}" alt="Logo" class="logo"><span class="slide-number">Slide ${slideNumber}</span></div>
        <div class="slide-title"><h1>${icon('people-fill')} Gender Breakdown</h1><p>Performance by Gender &bull; ${thisPeriodLabel}</p></div>
        <div style="padding:8px 12px;background:var(--warning-light);border-left:3px solid var(--warning);border-radius:6px;margin-bottom:12px;">
            <p style="font-size:10px;margin:0;color:var(--gray-700);"><strong>${topGender}</strong> dominates with <strong>${topPct}%</strong> ATC</p>
        </div>
        <div style="display:grid;grid-template-columns:repeat(${data.length}, 1fr);gap:12px;">${genderCards}</div>
    </div>`
}

function generateCPASRegionSlide(data: any[], lastData: any[], thisPeriodLabel: string, lastPeriodLabel: string, slideNumber: number): string {
  const sortedData = [...data].sort((a, b) => parseNum(b['Amount spent (IDR)'] || 0) - parseNum(a['Amount spent (IDR)'] || 0)).slice(0, 15)
  const totalSpent = data.reduce((sum, item) => sum + parseNum(item['Amount spent (IDR)'] || 0), 0)
  const top3Spent = sortedData.slice(0, 3).reduce((sum, item) => sum + parseNum(item['Amount spent (IDR)'] || 0), 0)

  const rows = sortedData.map((item, index) => {
    const region = item['Region'] || 'Unknown'
    const spent = parseNum(item['Amount spent (IDR)'] || 0)
    const reach = parseNum(item['Reach'] || 0)
    const atc = parseNum(item['Adds to cart with shared items'] || item['Results'] || 0)
    const purchases = parseNum(item['Purchases with shared items'] || 0)
    const cpr = atc > 0 ? spent / atc : 0
    const pct = totalSpent > 0 ? (spent / totalSpent) * 100 : 0
    const isTop3 = index < 3
    return `
      <tr ${isTop3 ? 'style="background:var(--warning-light);"' : ''}>
        <td style="text-align:center;font-weight:700;">${isTop3 ? `<span style="background:var(--warning);color:white;padding:2px 6px;border-radius:3px;font-size:9px;">${index + 1}</span>` : index + 1}</td>
        <td><strong>${region}</strong></td>
        <td>${formatCurrencyCompact(spent)} <span style="color:var(--gray-400);font-size:9px;">(${pct.toFixed(0)}%)</span></td>
        <td>${formatNumberCompact(reach)}</td>
        <td>${formatNumberCompact(atc)}</td>
        <td>${formatNumberCompact(purchases)}</td>
        <td>${atc > 0 ? formatCurrencyCompact(cpr) : '-'}</td>
      </tr>`
  }).join('')

  const topRegion = sortedData[0]?.['Region'] || 'N/A'
  const top3Pct = totalSpent > 0 ? (top3Spent / totalSpent * 100).toFixed(0) : '0'

  return `
    <div class="slide" data-slide="${slideNumber}">
        <div class="slide-header"><img src="${LOGO_URL}" alt="Logo" class="logo"><span class="slide-number">Slide ${slideNumber}</span></div>
        <div class="slide-title"><h1>${icon('geo-alt-fill')} Region Breakdown</h1><p>Top Regions by Ad Spend &bull; ${thisPeriodLabel}</p></div>
        <div style="padding:8px 12px;background:var(--warning-light);border-left:3px solid var(--warning);border-radius:6px;margin-bottom:12px;">
            <p style="font-size:10px;margin:0;color:var(--gray-700);"><strong>Top 3 regions</strong> = <strong>${top3Pct}%</strong> of total spend</p>
        </div>
        <div class="table-container" style="font-size:10px;">
            <table>
                <thead><tr>
                    <th style="padding:8px;font-size:10px;text-align:center;width:40px;">#</th>
                    <th style="padding:8px;font-size:10px;">Region</th>
                    <th style="padding:8px;font-size:10px;">Spent</th>
                    <th style="padding:8px;font-size:10px;">Reach</th>
                    <th style="padding:8px;font-size:10px;">ATC</th>
                    <th style="padding:8px;font-size:10px;">Purchases</th>
                    <th style="padding:8px;font-size:10px;">CPR</th>
                </tr></thead>
                <tbody>${rows}</tbody>
            </table>
        </div>
    </div>`
}

function generateCPASPlacementSlide(data: any[], lastData: any[], thisPeriodLabel: string, lastPeriodLabel: string, slideNumber: number): string {
  const getATC = (item: any) => parseNum(item['Adds to cart with shared items'] || item['Results'] || 0)
  const totalATC = data.reduce((sum, item) => sum + getATC(item), 0)
  const sortedData = [...data].sort((a, b) => getATC(b) - getATC(a))

  const rows = sortedData.map((item, index) => {
    const placement = item['Placement'] || item['Platform position'] || 'Unknown'
    const atc = getATC(item)
    const spent = parseNum(item['Amount spent (IDR)'] || 0)
    const purchases = parseNum(item['Purchases with shared items'] || 0)
    const cpr = atc > 0 ? spent / atc : 0
    const pct = totalATC > 0 ? (atc / totalATC) * 100 : 0
    const isTop = index < 2
    const lastItem = lastData.find((l: any) => (l['Placement'] || l['Platform position']) === placement)
    const lastATC2 = lastItem ? getATC(lastItem) : 0
    const growth = calculateGrowth(atc, lastATC2)
    return `
      <tr ${isTop ? 'style="background:var(--warning-light);"' : ''}>
        <td><strong>${placement}</strong>${isTop ? '<span style="font-size:8px;background:var(--warning);color:white;padding:2px 4px;border-radius:3px;margin-left:4px;">TOP</span>' : ''}</td>
        <td>${formatNumberCompact(atc)} <span style="color:var(--gray-400);font-size:9px;">(${pct.toFixed(0)}%)</span></td>
        <td>${formatNumberCompact(purchases)}</td>
        <td>${atc > 0 ? formatCurrencyCompact(cpr) : '-'}</td>
        <td>${formatCurrencyCompact(spent)}</td>
        <td>${getGrowthBadgeNew(growth)}</td>
      </tr>`
  }).join('')

  return `
    <div class="slide" data-slide="${slideNumber}">
        <div class="slide-header"><img src="${LOGO_URL}" alt="Logo" class="logo"><span class="slide-number">Slide ${slideNumber}</span></div>
        <div class="slide-title"><h1>${icon('grid-fill')} Placement Breakdown</h1><p>Performance by Ad Placement &bull; ${thisPeriodLabel}</p></div>
        <div class="table-container" style="font-size:10px;">
            <table>
                <thead><tr>
                    <th style="padding:8px;font-size:10px;">Placement</th>
                    <th style="padding:8px;font-size:10px;">ATC</th>
                    <th style="padding:8px;font-size:10px;">Purchases</th>
                    <th style="padding:8px;font-size:10px;">CPR</th>
                    <th style="padding:8px;font-size:10px;">Spent</th>
                    <th style="padding:8px;font-size:10px;text-align:center;">Growth</th>
                </tr></thead>
                <tbody>${rows}</tbody>
            </table>
        </div>
    </div>`
}

function generateCPASPlatformSlide(data: any[], lastData: any[], thisPeriodLabel: string, lastPeriodLabel: string, slideNumber: number): string {
  const getATC = (item: any) => parseNum(item['Adds to cart with shared items'] || item['Results'] || 0)
  const totalATC = data.reduce((sum, item) => sum + getATC(item), 0)
  const sortedData = [...data].sort((a, b) => getATC(b) - getATC(a))

  const platformCards = sortedData.map((item, index) => {
    const platform = item['Platform'] || item['Publisher Platform'] || 'Unknown'
    const atc = getATC(item)
    const spent = parseNum(item['Amount spent (IDR)'] || 0)
    const purchases = parseNum(item['Purchases with shared items'] || 0)
    const pct = totalATC > 0 ? (atc / totalATC) * 100 : 0
    const cpr = atc > 0 ? spent / atc : 0
    const isTop = index === 0
    const lastItem = lastData.find((l: any) => (l['Platform'] || l['Publisher Platform']) === platform)
    const lastATC2 = lastItem ? getATC(lastItem) : 0
    const growth = calculateGrowth(atc, lastATC2)
    const pl = platform.toLowerCase()
    const iconName = pl.includes('facebook') ? 'facebook' : pl.includes('instagram') ? 'instagram' : 'phone'
    const iconColor = pl.includes('facebook') ? '#1877f2' : pl.includes('instagram') ? '#e4405f' : 'var(--gray-600)'
    return `
      <div class="card" style="text-align:center;padding:12px;border-top:3px solid ${iconColor};${isTop ? 'background:var(--warning-light);border:2px solid var(--warning);' : ''}">
        <div style="display:flex;align-items:center;justify-content:center;gap:6px;margin-bottom:8px;">
          <i class="bi bi-${iconName}" style="font-size:24px;color:${iconColor};"></i>
          <span style="font-size:13px;font-weight:700;">${platform}</span>
          ${isTop ? '<span style="font-size:8px;background:var(--warning);color:white;padding:2px 4px;border-radius:3px;">TOP</span>' : ''}
        </div>
        <div style="font-size:24px;font-weight:700;color:${iconColor};margin-bottom:4px;">${pct.toFixed(1)}%</div>
        <p style="font-size:10px;color:var(--gray-500);margin-bottom:8px;">${formatNumberCompact(atc)} ATC</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;margin-bottom:6px;">
          <div style="background:var(--gray-50);border-radius:4px;padding:6px;"><div style="font-size:8px;color:var(--gray-500);">Spent</div><div style="font-size:11px;font-weight:600;">${formatCurrencyCompact(spent)}</div></div>
          <div style="background:var(--gray-50);border-radius:4px;padding:6px;"><div style="font-size:8px;color:var(--gray-500);">Purchases</div><div style="font-size:11px;font-weight:600;">${formatNumberCompact(purchases)}</div></div>
          <div style="background:var(--gray-50);border-radius:4px;padding:6px;"><div style="font-size:8px;color:var(--gray-500);">CPR</div><div style="font-size:11px;font-weight:600;">${cpr > 0 ? formatCurrencyCompact(cpr) : 'N/A'}</div></div>
          <div style="background:var(--gray-50);border-radius:4px;padding:6px;"><div style="font-size:8px;color:var(--gray-500);">Growth</div><div style="font-size:11px;">${getGrowthBadgeNew(growth)}</div></div>
        </div>
      </div>`
  }).join('')

  return `
    <div class="slide" data-slide="${slideNumber}">
        <div class="slide-header"><img src="${LOGO_URL}" alt="Logo" class="logo"><span class="slide-number">Slide ${slideNumber}</span></div>
        <div class="slide-title"><h1>${icon('phone-fill')} Platform Breakdown</h1><p>Performance by Publisher Platform &bull; ${thisPeriodLabel}</p></div>
        <div style="display:grid;grid-template-columns:repeat(${Math.min(data.length, 4)}, 1fr);gap:12px;">${platformCards}</div>
    </div>`
}

function generateCPASObjectiveSlide(data: any[], slideNumber: number): string {
  const filteredData = data.filter(item => item['Objective'] && item['Objective'] !== '' && item['Objective'] !== '(No Objective)')
  const sortedData = filteredData.sort((a, b) =>
    parseNum(b['Adds to cart with shared items'] || b['Results'] || 0) - parseNum(a['Adds to cart with shared items'] || a['Results'] || 0)
  )
  const totalATC = sortedData.reduce((sum, item) => sum + parseNum(item['Adds to cart with shared items'] || item['Results'] || 0), 0)
  const totalPurchases = sortedData.reduce((sum, item) => sum + parseNum(item['Purchases with shared items'] || 0), 0)
  const totalPurchaseValue = sortedData.reduce((sum, item) => sum + parseNum(item['Purchases conversion value for shared items only'] || 0), 0)
  const totalSpent = sortedData.reduce((sum, item) => sum + parseNum(item['Amount spent (IDR)'] || 0), 0)
  const totalReach = sortedData.reduce((sum, item) => sum + parseNum(item['Reach'] || 0), 0)
  const avgCPR = totalATC > 0 ? totalSpent / totalATC : 0
  const avgROAS = totalSpent > 0 ? totalPurchaseValue / totalSpent : 0

  const rows = sortedData.map((item, index) => {
    const objective = item['Objective'] || '(No Objective)'
    const atc = parseNum(item['Adds to cart with shared items'] || item['Results'] || 0)
    const purchases = parseNum(item['Purchases with shared items'] || 0)
    const purchaseValue = parseNum(item['Purchases conversion value for shared items only'] || 0)
    const spent = parseNum(item['Amount spent (IDR)'] || 0)
    const reach = parseNum(item['Reach'] || 0)
    const cpr = atc > 0 ? spent / atc : 0
    const cpp = purchases > 0 ? spent / purchases : 0
    const roas = spent > 0 ? purchaseValue / spent : parseNum(item['Purchase ROAS (return on ad spend)'] || 0)
    const status = index === 0 ? '<span class="badge badge-success">Winner</span>' : index === 1 ? '<span class="badge badge-warning">Monitor</span>' : '<span class="badge badge-danger">Review</span>'
    return `
      <tr class="${index < 3 ? 'highlight' : ''}">
        <td><span style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:50%;background:#059669;color:white;font-weight:700;font-size:12px;margin-right:8px;">${index + 1}</span><strong>${objective}</strong></td>
        <td><strong>${formatNumber(atc)}</strong></td>
        <td>${formatCurrency(cpr)}</td>
        <td><strong>${formatNumber(purchases)}</strong></td>
        <td>${purchases > 0 ? formatCurrency(cpp) : '-'}</td>
        <td><strong>${roas.toFixed(2)}x</strong></td>
        <td>${formatCurrency(spent)}</td>
        <td>${formatNumber(reach)}</td>
        <td style="text-align:center;">${status}</td>
      </tr>`
  }).join('')

  const top = sortedData[0] || {}
  const topO = top['Objective'] || '(Default)'
  const topATC = parseNum(top['Adds to cart with shared items'] || top['Results'] || 0)
  const topSpent2 = parseNum(top['Amount spent (IDR)'] || 0)
  const topCPR2 = topATC > 0 ? topSpent2 / topATC : 0
  const topPurchases = parseNum(top['Purchases with shared items'] || 0)
  const topPurchaseVal = parseNum(top['Purchases conversion value for shared items only'] || 0)
  const topROAS = topSpent2 > 0 ? topPurchaseVal / topSpent2 : parseNum(top['Purchase ROAS (return on ad spend)'] || 0)

  return `
    <div class="slide" data-slide="${slideNumber}">
        <div class="slide-header"><img src="${LOGO_URL}" alt="Logo" class="logo"><span class="slide-number">Slide ${slideNumber}</span></div>
        <div class="slide-title"><h1>${icon('bullseye')} Objective Performance</h1><p>CPAS Performance by Campaign Objective</p></div>
        <div class="table-container">
            <table>
                <thead><tr>
                    <th>Objective</th><th>ATC</th><th>CPR</th><th>Purchases</th><th>CPP</th><th>ROAS</th><th>Spent</th><th>Reach</th><th style="text-align:center;">Status</th>
                </tr></thead>
                <tbody>${rows}</tbody>
                <tfoot>
                    <tr style="background:linear-gradient(135deg,#064e3b 0%,#059669 100%);color:white;font-weight:600;">
                        <td><strong>TOTAL</strong></td>
                        <td><strong>${formatNumber(totalATC)}</strong></td>
                        <td><strong>${formatCurrency(avgCPR)}</strong></td>
                        <td><strong>${formatNumber(totalPurchases)}</strong></td>
                        <td><strong>${totalPurchases > 0 ? formatCurrency(totalSpent / totalPurchases) : '-'}</strong></td>
                        <td><strong>${avgROAS.toFixed(2)}x</strong></td>
                        <td><strong>${formatCurrency(totalSpent)}</strong></td>
                        <td><strong>${formatNumber(totalReach)}</strong></td>
                        <td></td>
                    </tr>
                </tfoot>
            </table>
        </div>
        <div class="info-box">
            <h4>${icon('lightbulb-fill', 14)} Key Insight</h4>
            <ul>
                <li>Objective <strong>${topO}</strong>: <strong>${formatNumber(topATC)} ATC</strong> (CPR ${formatCurrency(topCPR2)}), <strong>${formatNumber(topPurchases)} Purchases</strong> (ROAS ${topROAS.toFixed(2)}x).</li>
                <li>Total: <strong>${formatNumber(totalATC)} ATC</strong>, <strong>${formatNumber(totalPurchases)} Purchases</strong>, ROAS <strong>${avgROAS.toFixed(2)}x</strong>, CPR <strong>${formatCurrency(avgCPR)}</strong>.</li>
            </ul>
            <div class="reco-box"><h4>${icon('pencil-square', 12)} Rekomendasi</h4><p>Fokuskan <strong>70-80% budget</strong> pada objective dengan ROAS tertinggi. Scale dengan <strong>Advantage+ Catalog</strong>.</p></div>
        </div>
    </div>`
}

function generateCPASAdCreativeSlide(data: any[], slideNumber: number): string {
  const firstItem = data[0] || {}
  const creativeNameKey = Object.keys(firstItem).find(k => k.toLowerCase() === 'ads' || k.toLowerCase() === 'ad name' || k.toLowerCase().includes('ad name')) || 'Ads'

  const sortedData = [...data].filter(item => {
    const name = item[creativeNameKey]
    return name && String(name).trim() !== '' && parseNum(item['Amount spent (IDR)'] || 0) > 0
  }).sort((a, b) => parseNum(b['Adds to cart with shared items'] || b['Results'] || 0) - parseNum(a['Adds to cart with shared items'] || a['Results'] || 0))

  const top10 = sortedData.slice(0, 10)
  const totalATC = sortedData.reduce((sum, item) => sum + parseNum(item['Adds to cart with shared items'] || item['Results'] || 0), 0)
  const totalSpent = sortedData.reduce((sum, item) => sum + parseNum(item['Amount spent (IDR)'] || 0), 0)
  const totalPurchases = sortedData.reduce((sum, item) => sum + parseNum(item['Purchases with shared items'] || 0), 0)
  const avgCPR = totalATC > 0 ? totalSpent / totalATC : 0

  const rows = top10.map((item, index) => {
    const rawName = String(item[creativeNameKey] || 'Unknown')
    const name = rawName.length > 40 ? rawName.slice(0, 40) + '...' : rawName
    const atc = parseNum(item['Adds to cart with shared items'] || item['Results'] || 0)
    const purchases = parseNum(item['Purchases with shared items'] || 0)
    const spent = parseNum(item['Amount spent (IDR)'] || 0)
    const impr = parseNum(item['Impressions'] || 0)
    const linkClicks = parseNum(item['Link clicks'] || 0)
    const cpr = atc > 0 ? spent / atc : 0
    const ctr = impr > 0 ? (linkClicks / impr) * 100 : 0
    const purchaseValue = parseNum(item['Purchases conversion value for shared items only'] || 0)
    const roas = spent > 0 ? purchaseValue / spent : parseNum(item['Purchase ROAS (return on ad spend)'] || 0)
    const status = atc > 0 && cpr < avgCPR ? '<span class="badge badge-success">Top</span>' : atc > 0 ? '<span class="badge badge-warning">OK</span>' : '<span class="badge badge-danger">Low</span>'
    return `
      <tr class="${index < 5 ? 'highlight' : ''}">
        <td><span style="display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;border-radius:50%;background:#059669;color:white;font-weight:700;font-size:10px;margin-right:6px;">${index + 1}</span><strong>${name}</strong></td>
        <td><strong>${formatNumber(atc)}</strong></td>
        <td>${atc > 0 ? formatCurrency(cpr) : '-'}</td>
        <td>${formatNumber(purchases)}</td>
        <td>${roas > 0 ? roas.toFixed(2) + 'x' : '-'}</td>
        <td>${ctr.toFixed(2)}%</td>
        <td>${formatCurrency(spent)}</td>
        <td style="text-align:center;">${status}</td>
      </tr>`
  }).join('')

  return `
    <div class="slide" data-slide="${slideNumber}">
        <div class="slide-header"><img src="${LOGO_URL}" alt="Logo" class="logo"><span class="slide-number">Slide ${slideNumber}</span></div>
        <div class="slide-title"><h1>${icon('image-fill')} Ad Creative Performance</h1><p>Top 10 Creatives by ATC (${sortedData.length} Total)</p></div>
        <div class="full-table">
            <table>
                <thead><tr>
                    <th>Ad Name</th><th>ATC</th><th>CPR</th><th>Purchases</th><th>ROAS</th><th>CTR</th><th>Spent</th><th style="text-align:center;">Status</th>
                </tr></thead>
                <tbody>${rows}</tbody>
            </table>
        </div>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:16px;">
            <div class="mini-stat"><div class="label">Total Creatives</div><div class="value">${sortedData.length}</div></div>
            <div class="mini-stat"><div class="label">Total ATC</div><div class="value">${formatNumber(totalATC)}</div></div>
            <div class="mini-stat"><div class="label">Total Purchases</div><div class="value">${formatNumber(totalPurchases)}</div></div>
            <div class="mini-stat"><div class="label">Avg CPR</div><div class="value">${formatCurrency(avgCPR)}</div></div>
        </div>
    </div>`
}

function generateCPASContentPerformanceSlide(data: any[], slideNumber: number): string {
  const firstItem = data[0] || {}
  const creativeNameKey = Object.keys(firstItem).find(k => k.toLowerCase() === 'ads' || k.toLowerCase() === 'ad name' || k.toLowerCase().includes('ad name')) || 'Ads'

  const sortedData = [...data].filter(item => {
    const name = item[creativeNameKey]
    return name && String(name).trim() !== '' && parseNum(item['Amount spent (IDR)'] || 0) > 0
  }).sort((a, b) => parseNum(b['Purchases with shared items'] || 0) - parseNum(a['Purchases with shared items'] || 0))

  const top5 = sortedData.slice(0, 5)
  const totalPurchases = sortedData.reduce((sum, item) => sum + parseNum(item['Purchases with shared items'] || 0), 0)
  const totalSpent = sortedData.reduce((sum, item) => sum + parseNum(item['Amount spent (IDR)'] || 0), 0)
  const totalPurchaseValue = sortedData.reduce((sum, item) => sum + parseNum(item['Purchases conversion value for shared items only'] || 0), 0)
  const avgCPP = totalPurchases > 0 ? totalSpent / totalPurchases : 0
  const avgROAS = totalSpent > 0 ? totalPurchaseValue / totalSpent : 0

  const top5Purchases = top5.reduce((sum, item) => sum + parseNum(item['Purchases with shared items'] || 0), 0)
  const top5Pct = totalPurchases > 0 ? (top5Purchases / totalPurchases * 100).toFixed(1) : '0'

  const creativeItems = top5.map((item, index) => {
    const rawName = String(item[creativeNameKey] || 'Unknown')
    const displayName = rawName.length > 50 ? rawName.slice(0, 50) + '...' : rawName
    const purchases = parseNum(item['Purchases with shared items'] || 0)
    const atc = parseNum(item['Adds to cart with shared items'] || item['Results'] || 0)
    const spent = parseNum(item['Amount spent (IDR)'] || 0)
    const purchaseValue = parseNum(item['Purchases conversion value for shared items only'] || 0)
    const cpp = purchases > 0 ? spent / purchases : 0
    const roas = spent > 0 ? purchaseValue / spent : parseNum(item['Purchase ROAS (return on ad spend)'] || 0)
    const p2aRate = atc > 0 ? (purchases / atc) * 100 : 0
    let analysis = ''
    if (index === 0) analysis = roas >= avgROAS ? `Top performer — ROAS ${roas.toFixed(2)}x di atas rata-rata. Scale budget 20-30%.` : `Volume purchase tertinggi tapi ROAS perlu ditingkatkan. Evaluasi harga produk.`
    else if (index === 1) analysis = purchases > 0 ? `Runner-up — monitor CPP vs top performer.` : `ATC tinggi tapi konversi ke purchase rendah. Cek checkout experience.`
    else analysis = roas >= avgROAS * 0.8 ? `ROAS efisien — pertahankan alokasi budget.` : `ROAS di bawah rata-rata. Pertimbangkan optimasi.`
    return `
      <div class="content-item">
        <div class="content-header">
          <span class="content-rank">${index + 1}</span>
          <span class="content-name">${displayName}</span>
        </div>
        <div class="content-metrics">&rarr; <strong>${formatNumber(purchases)} Purchases</strong> / ${formatNumber(atc)} ATC (P2A: ${p2aRate.toFixed(1)}%), ROAS <strong>${roas.toFixed(2)}x</strong>, CPP <strong>${formatCurrency(cpp)}</strong></div>
        <div class="content-analysis">&rarr; ${analysis}</div>
      </div>`
  }).join('')

  return `
    <div class="slide" data-slide="${slideNumber}">
        <div class="slide-header"><img src="${LOGO_URL}" alt="Logo" class="logo"><span class="slide-number">Slide ${slideNumber}</span></div>
        <div class="slide-title"><h1>${icon('bar-chart-line-fill')} Content Performance Analisis</h1><p>Top 5 Creatives by Purchases &mdash; CPAS Catalog</p></div>

        <style>
            .content-item { background:linear-gradient(135deg,#f8fafc 0%,#f1f5f9 100%); border-left:4px solid var(--primary); border-radius:12px; padding:14px 18px; margin-bottom:12px; }
            .content-item:nth-child(1) { background:linear-gradient(135deg,#fef3c7 0%,#fef9c3 100%); border-left-color:#f59e0b; }
            .content-header { display:flex; align-items:center; gap:10px; margin-bottom:6px; }
            .content-rank { display:inline-flex; align-items:center; justify-content:center; width:26px; height:26px; border-radius:50%; background:var(--primary); color:white; font-weight:700; font-size:13px; }
            .content-item:nth-child(1) .content-rank { background:#f59e0b; }
            .content-name { font-weight:600; font-size:13px; color:var(--gray-800); flex:1; }
            .content-metrics { font-size:12px; color:var(--gray-600); margin-left:36px; margin-bottom:4px; }
            .content-analysis { font-size:11px; color:var(--gray-700); margin-left:36px; font-style:italic; }
        </style>

        <div>${creativeItems}</div>

        <div class="info-box" style="margin-top:16px;">
            <h4>${icon('lightbulb-fill', 14)} Summary</h4>
            <p>Top 5 dari <strong>${sortedData.length} creative</strong> = <strong>${formatNumber(top5Purchases)} Purchases</strong> (${top5Pct}% dari total). Avg ROAS: <strong>${avgROAS.toFixed(2)}x</strong>, Avg CPP: <strong>${formatCurrency(avgCPP)}</strong>.</p>
        </div>

        <div style="margin-top:16px;background:linear-gradient(135deg,#ecfdf5 0%,#d1fae5 100%);border-left:4px solid var(--success);border-radius:12px;padding:18px;">
            <h4 style="margin:0 0 10px 0;font-size:15px;font-weight:700;color:#064e3b;">${icon('lightbulb-fill', 16)} Rekomendasi Strategi CPAS</h4>
            <ul style="margin:0;padding-left:18px;font-size:12px;line-height:1.8;color:#064e3b;">
                <li>&#x1F680; <strong>Scale Creative #1</strong> — Highest purchases, increase budget 20-30%.</li>
                <li>&#x1F4E6; <strong>Optimalkan Catalog</strong> — Pastikan harga &amp; stok produk terbaru di catalog.</li>
                <li>&#x1F3AF; <strong>Retargeting ATC</strong> — Buat audience dari pengguna ATC belum purchase.</li>
                <li>&#x1F4CA; <strong>Pause Low ROAS Ads</strong> — Creative dengan ROAS di bawah 1.0x sebaiknya di-pause.</li>
                ${avgROAS < 2 ? '<li>&#x26A0;&#xFE0F; <strong>ROAS Target</strong> &mdash; ROAS ' + avgROAS.toFixed(2) + 'x masih rendah. Review harga produk dan audience.</li>' : '<li>&#x2705; <strong>Maintain Performance</strong> &mdash; ROAS ' + avgROAS.toFixed(2) + 'x positif. Scale winning creatives.</li>'}
            </ul>
        </div>
    </div>`
}

function generateCPASConclusionSlide(
  spend: { thisSpent: number, lastSpent: number, spendGrowth: number },
  atc: { thisATC: number, lastATC: number, atcGrowth: number },
  purchases: { thisPurchases: number, lastPurchases: number, purchasesGrowth: number },
  purchaseValue: { thisPurchaseValue: number, lastPurchaseValue: number, purchaseValueGrowth: number },
  roas: { thisROAS: number, lastROAS: number, roasGrowth: number },
  cpr: { thisCPR: number, lastCPR: number, cprGrowth: number },
  cpp: { thisCPP: number, lastCPP: number, cppGrowth: number },
  slideNumber: number
): string {
  const insights: string[] = []
  if (atc.atcGrowth > 0) insights.push(`ATC naik <strong>+${atc.atcGrowth.toFixed(1)}%</strong> (${formatNumber(atc.lastATC)} &rarr; ${formatNumber(atc.thisATC)})`)
  else if (atc.atcGrowth < 0) insights.push(`ATC turun <strong>${atc.atcGrowth.toFixed(1)}%</strong> (${formatNumber(atc.lastATC)} &rarr; ${formatNumber(atc.thisATC)})`)
  if (purchases.purchasesGrowth > 0) insights.push(`Purchases naik <strong>+${purchases.purchasesGrowth.toFixed(1)}%</strong> (${formatNumber(purchases.lastPurchases)} &rarr; ${formatNumber(purchases.thisPurchases)})`)
  else if (purchases.purchasesGrowth < 0) insights.push(`Purchases turun <strong>${purchases.purchasesGrowth.toFixed(1)}%</strong> &mdash; perlu retargeting`)
  if (roas.roasGrowth > 0) insights.push(`ROAS membaik <strong>+${roas.roasGrowth.toFixed(1)}%</strong> (${roas.lastROAS.toFixed(2)}x &rarr; ${roas.thisROAS.toFixed(2)}x)`)
  else if (roas.roasGrowth < 0) insights.push(`ROAS turun <strong>${roas.roasGrowth.toFixed(1)}%</strong> menjadi ${roas.thisROAS.toFixed(2)}x &mdash; review catalog`)
  if (cpr.cprGrowth < 0) insights.push(`CPR membaik <strong>${Math.abs(cpr.cprGrowth).toFixed(1)}%</strong> (${formatCurrency(cpr.lastCPR)} &rarr; ${formatCurrency(cpr.thisCPR)})`)
  else if (cpr.cprGrowth > 0) insights.push(`CPR naik <strong>+${cpr.cprGrowth.toFixed(1)}%</strong> &mdash; perlu optimasi targeting`)

  const insightsList = insights.slice(0, 4).map((insight, i) => `
    <div class="numbered-item"><div class="number green">${i + 1}</div><p>${insight}</p></div>`).join('')

  const recos: string[] = []
  if (roas.roasGrowth <= 0) recos.push('Evaluasi produk catalog &mdash; pilih produk dengan margin terbaik')
  else recos.push('Pertahankan strategi catalog saat ini, ROAS sedang positif')
  if (purchases.purchasesGrowth < 0) recos.push('Aktifkan retargeting ATC audience untuk dorong konversi')
  else recos.push('Duplikasi winning ads dan expand ke lookalike audience pembeli')
  recos.push('Test 2-3 format catalog baru (Carousel vs Single Image vs Video)')
  recos.push('Fokus budget ke platform &amp; placement dengan ROAS tertinggi')

  const recoList = recos.slice(0, 4).map((reco, i) => `
    <div class="numbered-item"><div class="number orange">${i + 1}</div><p>${reco}</p></div>`).join('')

  let overallSummary = ''
  if (atc.atcGrowth > 0 && roas.roasGrowth > 0) overallSummary = 'Performa sangat baik &mdash; catalog campaign efektif.'
  else if (atc.atcGrowth > 0 && roas.roasGrowth < 0) overallSummary = 'Volume ATC meningkat namun ROAS turun. Fokus ke produk margin lebih tinggi.'
  else if (atc.atcGrowth < 0 && roas.roasGrowth > 0) overallSummary = 'ROAS membaik namun volume ATC turun. Perlu scale budget.'
  else overallSummary = 'Perlu evaluasi menyeluruh pada catalog, targeting, dan creative.'

  return `
    <div class="slide" data-slide="${slideNumber}">
        <div class="slide-header"><img src="${LOGO_URL}" alt="Logo" class="logo"><span class="slide-number">Slide ${slideNumber}</span></div>
        <div class="slide-title"><h1>${icon('clipboard-check-fill')} Kesimpulan &amp; Rekomendasi</h1><p>CPAS Summary &amp; Action Items</p></div>

        <div class="summary-box" style="margin-bottom:20px;">
            <h3>${icon('bar-chart-fill', 14)} Kesimpulan</h3>
            <p>
                ATC <span class="${atc.atcGrowth >= 0 ? 'growth-up' : 'growth-down'}">${atc.atcGrowth >= 0 ? '+' : ''}${atc.atcGrowth.toFixed(1)}%</span>
                (${formatNumber(atc.lastATC)} &rarr; ${formatNumber(atc.thisATC)}),
                Purchases <span class="${purchases.purchasesGrowth >= 0 ? 'growth-up' : 'growth-down'}">${purchases.purchasesGrowth >= 0 ? '+' : ''}${purchases.purchasesGrowth.toFixed(1)}%</span>
                (${formatNumber(purchases.lastPurchases)} &rarr; ${formatNumber(purchases.thisPurchases)}),
                ROAS <span class="${roas.roasGrowth >= 0 ? 'growth-up' : 'growth-down'}">${roas.thisROAS.toFixed(2)}x</span>.
                <strong>${overallSummary}</strong>
            </p>
        </div>

        <div class="two-col">
            <div>
                <h3 style="color:var(--primary);margin-bottom:14px;">${icon('lightbulb-fill', 16)} Key Insight</h3>
                <div class="numbered-list">${insightsList}</div>
            </div>
            <div>
                <h3 style="color:var(--warning);margin-bottom:14px;">${icon('pencil-square', 16)} Rekomendasi</h3>
                <div class="numbered-list">${recoList}</div>
            </div>
        </div>
    </div>`
}
