// Shared CSS styles for all report templates
// COMPACT DESIGN - Optimized for dense, readable reports
// Reduced font sizes by 15-20%, tighter spacing, more efficient layouts

// BUG #10 FIX: Import centralized parseNum from csvParser
import { parseNum as csvParserParseNum } from '@/lib/csvParser'
// BUG #19 FIX: Import rounding helper
import { roundToDecimals } from '@/lib/medium-priority-helpers'
// BUG #23 FIX: Import color constants and style helpers
export { CSS_COLORS } from '@/lib/style-helpers'
export { metricIconStyle, badgeStyle, textColorStyle, bgColorStyle } from '@/lib/style-helpers'

export const parseNum = csvParserParseNum

export const SHARED_CSS = `
        :root {
            --primary-blue: #2B46BB;
            --primary-yellow: #ECDC43;
            --green-growth: #10B981;
            --red-decline: #EF4444;
            --warning-amber: #F59E0B;
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

            /* Compact spacing system */
            --space-xs: 4px;
            --space-sm: 8px;
            --space-md: 12px;
            --space-lg: 16px;
            --space-xl: 20px;
            --space-2xl: 24px;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'SF Pro Display', sans-serif;
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            color: var(--neutral-800);
            line-height: 1.4; /* Reduced from 1.6 for compact design */
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }

        .slide {
            min-height: 900px;
            background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
            padding: 32px 40px; /* Reduced from 48px 48px */
            position: relative;
            overflow: hidden;
            page-break-inside: avoid;
        }

        .slide::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px; /* Reduced from 4px */
            background: linear-gradient(90deg, var(--primary-blue) 0%, var(--primary-yellow) 100%);
        }

        /* Compact logo */
        .logo {
            position: absolute;
            top: 32px; /* Reduced from 40px */
            left: 48px;
            width: 40px; /* Reduced from 48px */
            height: 40px; /* Reduced from 48px */
            border-radius: 10px; /* Reduced from 12px */
            object-fit: contain;
        }

        /* COMPACT TYPOGRAPHY - Reduced by 15-20% */
        h1 {
            font-size: 24px; /* Reduced from 28px */
            font-weight: 700;
            color: var(--primary-blue);
            margin-bottom: 6px; /* Reduced from 8px */
        }

        h2 {
            font-size: 15px; /* Reduced from 18px */
            font-weight: 600;
            color: #64748b;
            margin-bottom: 3px; /* Reduced from 4px */
        }

        h3 {
            font-size: 13px; /* Reduced from 15px */
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 8px; /* Reduced from 12px */
        }

        .subtitle {
            font-size: 12px; /* Reduced from 14px */
            color: #94a3b8;
            margin-bottom: 16px; /* Reduced from 24px */
        }

        /* COMPACT CARDS */
        .card {
            background: white;
            border: 1px solid rgba(226, 232, 240, 0.8);
            border-radius: 12px; /* Reduced from 16px */
            padding: 14px; /* Reduced from 20px */
            box-shadow: 0 2px 6px rgba(43, 70, 187, 0.05), 0 1px 2px rgba(0, 0, 0, 0.05);
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
        }

        .card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 2px; /* Reduced from 3px */
            background: linear-gradient(90deg, var(--primary-blue) 0%, var(--primary-yellow) 100%);
            opacity: 0;
            transition: opacity 0.2s ease;
        }

        .card:hover {
            transform: translateY(-2px); /* Reduced from -4px */
            box-shadow: 0 6px 16px rgba(43, 70, 187, 0.1), 0 2px 8px rgba(0, 0, 0, 0.06);
            border-color: rgba(43, 70, 187, 0.15);
        }

        .card:hover::before {
            opacity: 1;
        }

        /* COMPACT METRICS */
        .metric-value {
            font-size: 28px; /* Reduced from 36px */
            font-weight: 700;
            color: var(--primary-blue);
            margin: 6px 0; /* Reduced from 8px */
            background: linear-gradient(135deg, var(--primary-blue) 0%, #1e3088 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .metric-label {
            font-size: 11px; /* Reduced from 12px */
            color: #64748b;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.06em; /* Reduced from 0.08em */
        }

        /* Growth indicators */
        .growth-positive {
            color: var(--green-growth);
            font-weight: 600;
        }

        .growth-negative {
            color: var(--red-decline);
            font-weight: 600;
        }

        /* COMPACT BADGES */
        .badge {
            display: inline-flex;
            align-items: center;
            padding: 4px 10px; /* Reduced from 5px 12px */
            border-radius: 6px; /* Reduced from 8px */
            font-size: 10px; /* Reduced from 11px */
            font-weight: 700;
            letter-spacing: 0.02em; /* Reduced from 0.03em */
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
        }

        .badge-green {
            background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
            color: #065f46;
            border: 1px solid #6ee7b7;
        }

        .badge-red {
            background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
            color: #991b1b;
            border: 1px solid #fca5a5;
        }

        .badge-yellow {
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            color: #92400e;
            border: 1px solid #fcd34d;
        }

        /* COMPACT TABLES */
        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 11px; /* Reduced from 13px */
            background: white;
            border-radius: 10px; /* Reduced from 12px */
            overflow: hidden;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
        }

        th {
            background: linear-gradient(135deg, var(--primary-blue) 0%, #1e3088 100%);
            color: white;
            font-weight: 600;
            text-align: left;
            padding: 10px 12px; /* Reduced from 14px 16px */
            font-size: 11px; /* Reduced from 12px */
            text-transform: uppercase;
            letter-spacing: 0.04em; /* Reduced from 0.05em */
            position: relative;
            white-space: nowrap;
        }

        th::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(90deg, var(--primary-yellow) 0%, var(--primary-yellow) 100%);
            opacity: 0.3;
        }

        td {
            padding: 8px 12px; /* Reduced from 12px 16px */
            border-bottom: 1px solid #f1f5f9;
            transition: background 0.2s ease;
            font-size: 11px; /* Reduced from 13px */
        }

        tr:last-child td {
            border-bottom: none;
        }

        tr:hover td {
            background: linear-gradient(90deg, rgba(43, 70, 187, 0.02) 0%, rgba(236, 220, 67, 0.02) 100%);
        }

        tbody tr {
            transition: transform 0.15s ease;
        }

        tbody tr:hover {
            transform: scale(1.003); /* Reduced from 1.005 */
        }

        .text-right { text-align: right; }
        .text-center { text-align: center; }

        /* COMPACT KEY INSIGHT */
        .key-insight {
            background: linear-gradient(135deg, #fef9c3 0%, #fef08a 100%);
            border-left: 3px solid var(--primary-yellow); /* Reduced from 4px */
            padding: 14px; /* Reduced from 20px */
            border-radius: 10px; /* Reduced from 12px */
            margin-top: 16px; /* Reduced from 24px */
            box-shadow: 0 3px 8px rgba(236, 220, 67, 0.15);
            position: relative;
            overflow: hidden;
        }

        .key-insight::before {
            content: '💡';
            position: absolute;
            top: -8px; /* Reduced from -10px */
            right: -8px; /* Reduced from -10px */
            font-size: 48px; /* Reduced from 60px */
            opacity: 0.1;
        }

        .key-insight p {
            font-size: 12px; /* Reduced from 14px */
            color: #854d0e;
            margin: 0;
            line-height: 1.5; /* Reduced from 1.7 */
            font-weight: 500;
            position: relative;
            z-index: 1;
        }

        /* Highlight/Lowlight columns */
        .highlight-col {
            background: #f0fdf4;
            border-left: 3px solid var(--green-growth); /* Reduced from 4px */
        }

        .lowlight-col {
            background: #fef2f2;
            border-left: 3px solid var(--red-decline); /* Reduced from 4px */
        }

        .point-item {
            padding: 8px 10px; /* Reduced from 10px 12px */
            background: white;
            border-radius: 6px; /* Reduced from 8px */
            margin-bottom: 6px; /* Reduced from 8px */
            font-size: 11px; /* Reduced from 13px */
            display: flex;
            align-items: flex-start;
            gap: 6px; /* Reduced from 8px */
        }

        /* Divider */
        .divider {
            border: none;
            border-top: 1px solid #e2e8f0;
            margin: 12px 0; /* Reduced from 16px */
        }

        /* NEW: COMPACT LAYOUT UTILITIES */
        .grid-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px; /* Compact gap */
        }

        .grid-3 {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
        }

        .grid-4 {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
        }

        .flex-between {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 8px;
        }

        .flex-wrap {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }

        /* NEW: CALLOUT BOX FOR KEY INSIGHTS */
        .callout-box {
            background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
            border-left: 3px solid var(--primary-blue);
            padding: 12px;
            border-radius: 8px;
            margin: 12px 0;
        }

        .callout-box.success {
            background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
            border-left-color: var(--green-growth);
        }

        .callout-box.warning {
            background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
            border-left-color: var(--warning-amber);
        }

        .callout-box.error {
            background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
            border-left-color: var(--red-decline);
        }

        .callout-title {
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            margin-bottom: 6px;
            color: var(--neutral-700);
        }

        .callout-content {
            font-size: 11px;
            line-height: 1.4;
            color: var(--neutral-600);
        }

        /* NEW: COMPACT TABLE VARIANTS */
        .table-compact td {
            padding: 6px 8px; /* Ultra compact */
            font-size: 10px;
        }

        .table-compact th {
            padding: 8px 10px;
            font-size: 10px;
        }

        .table-condensed {
            font-size: 10px;
        }

        .table-condensed td,
        .table-condensed th {
            padding: 5px 8px;
        }

        /* NEW: DENSE GRID LAYOUTS */
        .dense-grid {
            display: grid;
            gap: 8px;
        }

        .dense-grid-2 {
            grid-template-columns: repeat(2, 1fr);
        }

        .dense-grid-3 {
            grid-template-columns: repeat(3, 1fr);
        }

        .dense-grid-4 {
            grid-template-columns: repeat(4, 1fr);
        }

        .dense-grid-6 {
            grid-template-columns: repeat(6, 1fr);
        }

        /* NEW: MINI METRIC CARDS */
        .mini-card {
            background: white;
            border: 1px solid rgba(226, 232, 240, 0.8);
            border-radius: 8px;
            padding: 10px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .mini-metric-value {
            font-size: 20px;
            font-weight: 700;
            color: var(--primary-blue);
            margin: 4px 0;
        }

        .mini-metric-label {
            font-size: 10px;
            color: #64748b;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.04em;
        }

        /* Print styles - Already optimized */
        @media print {
            .nav-controls, .slide-indicator, .progress-bar { display: none !important; }

            * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }

            body {
                background: white !important;
                margin: 0 !important;
                padding: 0 !important;
                font-size: 10px !important;
            }

            .slide {
                page-break-after: always !important;
                page-break-inside: avoid !important;
                margin: 0 !important;
                padding: 20px 25px !important; /* Compact print padding */
                min-height: auto !important;
            }

            .slide:last-child {
                page-break-after: auto !important;
            }

            @page {
                size: A4 landscape !important;
                margin: 0.3cm !important; /* Reduced margin */
            }

            h1 { font-size: 16px !important; margin-bottom: 6px !important; }
            h2 { font-size: 12px !important; margin-bottom: 4px !important; }
            h3 { font-size: 10px !important; margin-bottom: 6px !important; }
            p { font-size: 9px !important; line-height: 1.3 !important; }

            .metric-value { font-size: 14px !important; margin: 3px 0 !important; }
            .metric-label { font-size: 9px !important; }

            table { font-size: 8px !important; }
            th { padding: 5px 6px !important; font-size: 8px !important; }
            td { padding: 4px 6px !important; font-size: 8px !important; }

            .card { padding: 8px 10px !important; margin-bottom: 8px !important; }
            .key-insight { font-size: 9px !important; padding: 8px 10px !important; }
            .logo { width: 32px !important; height: 32px !important; }
            .badge { font-size: 7px !important; padding: 2px 5px !important; }

            .grid-2, .grid-3, .grid-4 { gap: 6px !important; }
            .callout-box { padding: 8px !important; margin: 8px 0 !important; }
        }
    `

export const LOGO_URL = '/logo/logo-hadona.png'
export const HEADER_LOGO_URL = '/logo/logo-header-pdf.webp'

// Helper functions for templates
// BUG #19 FIX: Use centralized rounding for consistent precision
export const formatNumber = (num: number): string => {
  if (num === null || num === undefined || isNaN(num)) return '0'
  const rounded = roundToDecimals(num, 0)
  return Math.round(rounded).toLocaleString('id-ID')
}

export const formatCurrency = (num: number): string => {
  if (num === null || num === undefined || isNaN(num)) return 'Rp 0'
  const rounded = roundToDecimals(num, 0)
  return 'Rp ' + Math.round(rounded).toLocaleString('id-ID')
}

export const formatPercent = (num: number): string => {
  if (num === null || num === undefined || isNaN(num)) return '0%'
  const rounded = roundToDecimals(num, 2)
  return rounded.toFixed(1) + '%' /* 1 decimal for compact display */
}

export const calculateGrowth = (current: number, previous: number): number => {
  if (!previous || previous === 0) return current > 0 ? 100 : 0
  return ((current - previous) / previous) * 100
}

export const getGrowthBadge = (growth: number, inverted: boolean = false): string => {
  const isPositive = inverted ? growth <= 0 : growth >= 0
  const badgeClass = isPositive ? 'badge-green' : 'badge-red'
  const sign = growth >= 0 ? '+' : ''
  return `<span class="badge ${badgeClass}">${sign}${growth.toFixed(1)}%</span>` /* 1 decimal */
}

export const getGrowthClass = (growth: number, inverted: boolean = false): string => {
  const isPositive = inverted ? growth <= 0 : growth >= 0
  return isPositive ? 'growth-positive' : 'growth-negative'
}

// Slide header component
export const generateSlideHeader = (): string => {
  return `
        <img src="${LOGO_URL}" alt="Hadona Logo" class="logo">
  `
}

// Slide footer component - More compact
export const generateSlideFooter = (reportType: string, slideNumber: number): string => {
  return `
        <div style="position: absolute; bottom: 16px; left: 40px; right: 40px; display: flex; justify-content: space-between; align-items: center; font-size: 9px; color: var(--neutral-500);">
            <span>Hadona Digital Media • ${reportType} Performance Report</span>
            <span style="font-weight: 600; color: var(--primary-blue);">Page ${slideNumber}</span>
        </div>
  `
}

// NEW: Executive Summary Component
export const generateExecutiveSummary = (
  reportName: string,
  periodLabel: string,
  keyMetrics: { name: string; value: string; growth: number; good: boolean }[]
): string => {
  const topWins = keyMetrics.filter(m => m.good).slice(0, 3)
  const improvements = keyMetrics.filter(m => !m.good).slice(0, 3)

  return `
    <!-- EXECUTIVE SUMMARY SLIDE -->
    <div class="slide" data-slide="2">
        <img src="${LOGO_URL}" alt="Hadona Logo" class="logo">

        <div style="margin-top: 60px;">
            <h1>Executive Summary</h1>
            <h2>${reportName} • ${periodLabel}</h2>

            <!-- Key Metrics Grid -->
            <div class="grid-3" style="margin-top: 20px;">
                ${keyMetrics.slice(0, 6).map(metric => `
                    <div class="mini-card">
                        <div class="mini-metric-label">${metric.name}</div>
                        <div class="mini-metric-value">${metric.value}</div>
                        ${getGrowthBadge(metric.growth, metric.name.toLowerCase().includes('cpr') || metric.name.toLowerCase().includes('cpc'))}
                    </div>
                `).join('')}
            </div>

            <!-- Key Takeaways -->
            <div class="callout-box success" style="margin-top: 16px;">
                <div class="callout-title">🎯 Key Wins</div>
                <div class="callout-content">
                    ${topWins.map(m => `• ${m.name}: ${m.value} (${m.growth >= 0 ? '+' : ''}${m.growth.toFixed(1)}%)`).join('<br>')}
                </div>
            </div>

            <div class="callout-box warning" style="margin-top: 12px;">
                <div class="callout-title">📈 Areas for Improvement</div>
                <div class="callout-content">
                    ${improvements.map(m => `• ${m.name}: ${m.value} (${m.growth >= 0 ? '+' : ''}${m.growth.toFixed(1)}%)`).join('<br>')}
                </div>
            </div>
        </div>

        ${generateSlideFooter('CTWA', 2)}
    </div>
  `
}

// Cover slide component - More compact
export const generateCoverSlide = (
  reportName: string,
  periodLabel: string,
  objectiveType: string,
  comparisonLabel: string
): string => {
  const objectiveLabels: Record<string, string> = {
    'ctwa': 'CTWA (Click to WhatsApp)',
    'cpas': 'CPAS (Collaborative Performance Advertising Solution)',
    'ctlptowa': 'CTLP to WA (Click to Landing Page to WhatsApp)',
    'ctlptopurchase': 'CTLP to Purchase (Click to Landing Page to Purchase)'
  }
  const objectiveLabel = objectiveLabels[objectiveType] || objectiveType.toUpperCase()

  return `
    <!-- SLIDE 1: COVER -->
    <div class="slide" data-slide="1">
        <img src="${LOGO_URL}" alt="Hadona Logo" class="logo">

        <div style="max-width: 800px; margin: 60px auto 0; text-align: center;">
            <h1 style="font-size: 36px; margin-bottom: 12px;">${comparisonLabel} Reporting</h1>
            <h2 style="font-size: 16px;">${reportName}</h2>
            <div class="divider" style="max-width: 160px; margin: 16px auto; border-top: 2px solid var(--primary-yellow);"></div>
            <p class="subtitle" style="font-size: 14px; margin-top: 16px;">
                <strong>Periode:</strong> ${periodLabel}
            </p>
            <p class="subtitle" style="font-size: 12px; margin-top: 6px;">
                <strong>Objective:</strong> ${objectiveLabel}
            </p>
        </div>

        <div style="position: absolute; bottom: 48px; left: 48px; right: 48px;">
            <div style="background: #fef3c7; border-left: 3px solid #f59e0b; padding: 12px; border-radius: 6px;">
                <p style="font-size: 11px; color: #92400e; margin: 0; font-weight: 600;">
                    🔒 Private & Confidential
                </p>
                <p style="font-size: 10px; color: #78350f; margin: 6px 0 0 0; line-height: 1.4;">
                    This presentation contains proprietary insights prepared exclusively for our valued client. Redistribution or disclosure is not permitted.
                </p>
            </div>
        </div>

        ${generateSlideFooter('CTWA', 1)}
    </div>
  `
}
