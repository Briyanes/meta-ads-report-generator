// Shared CSS styles for all report templates
// Based on cpas-reference-template.html design

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
            line-height: 1.6;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }

        .slide {
            min-height: 900px;
            background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
            padding: 48px 48px;
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
            height: 4px;
            background: linear-gradient(90deg, var(--primary-blue) 0%, var(--primary-yellow) 100%);
        }

        /* Logo */
        .logo {
            position: absolute;
            top: 40px;
            left: 56px;
            width: 48px;
            height: 48px;
            border-radius: 12px;
            object-fit: contain;
        }

        /* Typography */
        h1 {
            font-size: 28px;
            font-weight: 700;
            color: var(--primary-blue);
            margin-bottom: 8px;
        }

        h2 {
            font-size: 18px;
            font-weight: 600;
            color: #64748b;
            margin-bottom: 4px;
        }

        h3 {
            font-size: 15px;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 12px;
        }

        .subtitle {
            font-size: 14px;
            color: #94a3b8;
            margin-bottom: 24px;
        }

        /* Cards */
        .card {
            background: white;
            border: 1px solid rgba(226, 232, 240, 0.8);
            border-radius: 16px;
            padding: 20px;
            box-shadow: 0 2px 8px rgba(43, 70, 187, 0.06), 0 1px 3px rgba(0, 0, 0, 0.06);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
        }

        .card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, var(--primary-blue) 0%, var(--primary-yellow) 100%);
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .card:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 24px rgba(43, 70, 187, 0.12), 0 4px 12px rgba(0, 0, 0, 0.08);
            border-color: rgba(43, 70, 187, 0.2);
        }

        .card:hover::before {
            opacity: 1;
        }

        .metric-value {
            font-size: 36px;
            font-weight: 700;
            color: var(--primary-blue);
            margin: 8px 0;
            background: linear-gradient(135deg, var(--primary-blue) 0%, #1e3088 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .metric-label {
            font-size: 12px;
            color: #64748b;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.08em;
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

        .badge {
            display: inline-flex;
            align-items: center;
            padding: 5px 12px;
            border-radius: 8px;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.03em;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
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

        /* Table */
        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        th {
            background: linear-gradient(135deg, var(--primary-blue) 0%, #1e3088 100%);
            color: white;
            font-weight: 600;
            text-align: left;
            padding: 14px 16px;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            position: relative;
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
            padding: 12px 16px;
            border-bottom: 1px solid #f1f5f9;
            transition: background 0.2s ease;
        }

        tr:last-child td {
            border-bottom: none;
        }

        tr:hover td {
            background: linear-gradient(90deg, rgba(43, 70, 187, 0.03) 0%, rgba(236, 220, 67, 0.03) 100%);
        }

        tbody tr {
            transition: transform 0.2s ease;
        }

        tbody tr:hover {
            transform: scale(1.005);
        }

        .text-right { text-align: right; }
        .text-center { text-align: center; }

        /* Key insight box */
        .key-insight {
            background: linear-gradient(135deg, #fef9c3 0%, #fef08a 100%);
            border-left: 4px solid var(--primary-yellow);
            padding: 20px;
            border-radius: 12px;
            margin-top: 24px;
            box-shadow: 0 4px 12px rgba(236, 220, 67, 0.2);
            position: relative;
            overflow: hidden;
        }

        .key-insight::before {
            content: '💡';
            position: absolute;
            top: -10px;
            right: -10px;
            font-size: 60px;
            opacity: 0.1;
        }

        .key-insight p {
            font-size: 14px;
            color: #854d0e;
            margin: 0;
            line-height: 1.7;
            font-weight: 500;
            position: relative;
            z-index: 1;
        }

        /* Highlight/Lowlight columns */
        .highlight-col {
            background: #f0fdf4;
            border-left: 4px solid var(--green-growth);
        }

        .lowlight-col {
            background: #fef2f2;
            border-left: 4px solid var(--red-decline);
        }

        .point-item {
            padding: 10px 12px;
            background: white;
            border-radius: 8px;
            margin-bottom: 8px;
            font-size: 13px;
            display: flex;
            align-items: flex-start;
            gap: 8px;
        }

        /* Divider */
        .divider {
            border: none;
            border-top: 1px solid #e2e8f0;
            margin: 16px 0;
        }

        /* Print styles */
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
                padding: 25px 30px !important;
                min-height: auto !important;
            }

            .slide:last-child {
                page-break-after: auto !important;
            }

            @page {
                size: A4 portrait !important;
                margin: 0.4cm !important;
            }

            h1 { font-size: 18px !important; margin-bottom: 8px !important; }
            h2 { font-size: 13px !important; margin-bottom: 6px !important; }
            h3 { font-size: 11px !important; margin-bottom: 8px !important; }
            p { font-size: 10px !important; line-height: 1.4 !important; }

            .metric-value { font-size: 16px !important; margin: 4px 0 !important; }
            .metric-label { font-size: 10px !important; }

            table { font-size: 9px !important; }
            th { padding: 6px 8px !important; font-size: 9px !important; }
            td { padding: 5px 8px !important; font-size: 9px !important; }

            .card { padding: 10px 12px !important; margin-bottom: 10px !important; }
            .key-insight { font-size: 10px !important; padding: 10px 12px !important; }
            .logo { width: 36px !important; height: 36px !important; }
            .badge { font-size: 8px !important; padding: 3px 6px !important; }
        }
`

export const LOGO_URL = 'https://hadona.id/wp-content/uploads/2024/12/cropped-Hadona-Logo-1-300x300.png'
export const HEADER_LOGO_URL = 'https://report.hadona.id/logo/logo-header-pdf.webp'

// Helper functions for templates
export const formatNumber = (num: number): string => {
  if (num === null || num === undefined || isNaN(num)) return '0'
  return Math.round(num).toLocaleString('id-ID')
}

export const formatCurrency = (num: number): string => {
  if (num === null || num === undefined || isNaN(num)) return 'Rp 0'
  return 'Rp ' + Math.round(num).toLocaleString('id-ID')
}

export const formatPercent = (num: number): string => {
  if (num === null || num === undefined || isNaN(num)) return '0%'
  return num.toFixed(2) + '%'
}

export const parseNum = (val: any): number => {
  if (typeof val === 'number') return val
  if (!val || val === '-' || val === 'N/A') return 0
  const cleanStr = String(val).replace(/[,\s]/g, '').replace(/^Rp\s*/i, '')
  const parsed = parseFloat(cleanStr)
  return isNaN(parsed) ? 0 : parsed
}

export const calculateGrowth = (current: number, previous: number): number => {
  if (!previous || previous === 0) return current > 0 ? 100 : 0
  return ((current - previous) / previous) * 100
}

export const getGrowthBadge = (growth: number, inverted: boolean = false): string => {
  // For metrics where lower is better (like CPR, CPC), inverted = true
  const isPositive = inverted ? growth <= 0 : growth >= 0
  const badgeClass = isPositive ? 'badge-green' : 'badge-red'
  const sign = growth >= 0 ? '+' : ''
  return `<span class="badge ${badgeClass}">${sign}${growth.toFixed(2)}%</span>`
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

// Slide footer component
export const generateSlideFooter = (reportType: string, slideNumber: number): string => {
  return `
        <div style="position: absolute; bottom: 24px; left: 48px; right: 48px; display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: var(--neutral-500);">
            <span>Hadona Digital Media • ${reportType} Performance Report</span>
            <span style="font-weight: 600; color: var(--primary-blue);">Page ${slideNumber}</span>
        </div>
  `
}

// Cover slide component
export const generateCoverSlide = (
  reportName: string,
  periodLabel: string,
  objectiveType: string,
  comparisonLabel: string
): string => {
  const objectiveLabels: Record<string, string> = {
    'ctwa': 'CTWA (Click to WhatsApp)',
    'cpas': 'CPAS (Collaborative Performance Advertising Solution)',
    'ctlptowa': 'CTLP to WA (Click to Landing Page to WhatsApp)'
  }
  const objectiveLabel = objectiveLabels[objectiveType] || objectiveType.toUpperCase()

  return `
    <!-- SLIDE 1: COVER -->
    <div class="slide" data-slide="1">
        <img src="${LOGO_URL}" alt="Hadona Logo" class="logo">

        <div style="max-width: 900px; margin: 80px auto 0; text-align: center;">
            <h1 style="font-size: 42px; margin-bottom: 16px;">${comparisonLabel} Reporting</h1>
            <h2 style="font-size: 20px;">Meta Ads – ${reportName}</h2>
            <div class="divider" style="max-width: 200px; margin: 24px auto; border-top: 3px solid var(--primary-yellow);"></div>
            <p class="subtitle" style="font-size: 16px; margin-top: 24px;">
                <strong>Periode:</strong> ${periodLabel}
            </p>
            <p class="subtitle" style="font-size: 14px; margin-top: 8px;">
                <strong>Objective:</strong> ${objectiveLabel}
            </p>
        </div>

        <div style="position: absolute; bottom: 60px; left: 56px; right: 56px;">
            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 8px;">
                <p style="font-size: 13px; color: #92400e; margin: 0; font-weight: 600;">
                    🔒 Private & Confidential
                </p>
                <p style="font-size: 12px; color: #78350f; margin: 8px 0 0 0; line-height: 1.6;">
                    This presentation contains proprietary insights prepared exclusively for our valued client. Redistribution or disclosure is not permitted.
                </p>
            </div>
        </div>
    </div>
  `
}
