const CPAS_TEMPLATE = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CPAS Report - {REPORT_NAME} | Hadona Digital Media</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary-blue: #2B46BB;
            --primary-yellow: #ECDC43;
            --success-green: #10B981;
            --warning-amber: #F59E0B;
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

        /* Agency Header */
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
            max-width: 100%;
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

        /* Slide Footer */
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

        /* Typography */
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

        h3 {
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 16px;
        }

        /* Card Styles */
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

        /* Metric Styles */
        .metric-value {
            font-size: 42px;
            font-weight: 800;
            color: var(--primary-blue);
            margin: 12px 0;
            letter-spacing: -0.04em;
            line-height: 1;
        }

        .metric-label {
            font-size: 12px;
            color: var(--neutral-500);
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.03em;
        }

        .metric-sublabel {
            font-size: 11px;
            color: var(--neutral-400);
            margin-top: 4px;
        }

        /* Growth Indicators */
        .growth-positive {
            color: var(--success-green);
            font-weight: 700;
        }

        .growth-negative {
            color: var(--danger-red);
            font-weight: 700;
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

        /* Table Styles */
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

        th:first-child {
            border-top-left-radius: 12px;
        }

        th:last-child {
            border-top-right-radius: 12px;
        }

        .text-right {
            text-align: right;
        }

        tbody tr {
            border-bottom: 1px solid var(--neutral-100);
            transition: background-color 0.15s ease;
        }

        tbody tr:hover {
            background: var(--neutral-50);
        }

        tbody tr:last-child {
            border-bottom: none;
        }

        td {
            padding: 12px;
            font-size: 11px;
            color: var(--neutral-700);
        }

        tbody tr:nth-child(even) {
            background: #fafbfc;
        }

        tbody tr:nth-child(even):hover {
            background: var(--neutral-50);
        }

        /* Compact Table */
        .compact-table td,
        .compact-table th {
            padding: 10px 10px;
            font-size: 11px;
        }

        /* Badge Styles */
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

        .badge-yellow {
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            color: #92400e;
            border: 1px solid #fde68a;
        }

        .badge-blue {
            background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
            color: #1e40af;
            border: 1px solid #bfdbfe;
        }

        /* Insight Box */
        .insight-box {
            background: linear-gradient(135deg, #fef9c3 0%, #fef08a 100%);
            border-left: 5px solid var(--primary-yellow);
            padding: 24px;
            border-radius: 12px;
            position: relative;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(236, 220, 67, 0.2);
        }

        .insight-box::before {
            content: '💡';
            position: absolute;
            top: -15px;
            right: -10px;
            font-size: 80px;
            opacity: 0.15;
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

        .insight-box strong {
            color: #713f12;
            font-weight: 700;
        }

        /* Highlight/Lowlight Boxes - Consistent colors */
        .highlight-box {
            background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
            border-left: 4px solid var(--success-green);
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 1px 3px rgba(16, 185, 129, 0.1);
        }

        .lowlight-box {
            background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
            border-left: 4px solid var(--danger-red);
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 1px 3px rgba(239, 68, 68, 0.1);
        }

        /* Progress Bar */
        .progress-bar {
            width: 100%;
            height: 8px;
            background: var(--neutral-200);
            border-radius: 10px;
            overflow: hidden;
            margin-top: 8px;
        }

        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, var(--primary-blue) 0%, var(--primary-yellow) 100%);
            border-radius: 10px;
            transition: width 0.3s ease;
        }

        /* Icon Badge */
        .icon-badge {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 28px;
            height: 28px;
            border-radius: 8px;
            font-size: 14px;
            margin-right: 8px;
        }

        .icon-badge-success {
            background: var(--success-green);
            color: white;
        }

        .icon-badge-danger {
            background: var(--danger-red);
            color: white;
        }

        /* Separator */
        .separator {
            height: 1px;
            background: linear-gradient(90deg, transparent 0%, var(--neutral-200) 50%, transparent 100%);
            margin: 24px 0;
        }

        /* Period Badge */
        .period-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            background: linear-gradient(135deg, var(--primary-blue) 0%, #3d5ee0 100%);
            color: white;
            font-size: 13px;
            font-weight: 600;
            border-radius: 24px;
            box-shadow: 0 4px 12px rgba(43, 70, 187, 0.25);
        }

        /* Cover Slide Special */
        .slide-cover {
            text-align: center;
            padding: 120px 64px;
            background: linear-gradient(135deg, white 0%, var(--neutral-50) 100%);
        }

        .slide-cover h1 {
            font-size: 56px;
            background: linear-gradient(135deg, var(--primary-blue) 0%, #3d5ee0 50%, var(--primary-yellow) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 24px;
            letter-spacing: -0.04em;
        }

        /* Print Styles */
        @media print {
            body {
                background: white;
            }

            .slide {
                box-shadow: none;
                margin: 0;
                page-break-after: always;
            }

            .slide:last-child {
                page-break-after: auto;
            }
        }
    </style>
</head>
<body>
    <!-- SLIDE 1: WELCOME -->
    <div class="slide slide-cover">
        <div class="agency-logo" style="justify-content: center; margin-bottom: 48px;">
            <img src="https://report.hadona.id/logo/logo-header-pdf.webp" alt="Hadona Digital Media" class="agency-logo-icon">
        </div>

        <h1>CPAS Performance Report</h1>

        <p style="font-size: 24px; color: var(--neutral-600); font-weight: 600; margin-bottom: 32px;">
            {REPORT_NAME}
        </p>

        <div class="period-badge">
            <span>📅</span>
            <span>{PERIOD_LABEL}</span>
        </div>

        <div style="margin-top: 64px;">
            <div class="confidential-badge">
                <span>🔒</span>
                <span>Confidential Report</span>
            </div>
        </div>

        <div style="position: absolute; bottom: 56px; left: 64px; right: 64px;">
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: var(--neutral-500);">
                <span>© 2026 Hadona Digital Media. All rights reserved.</span>
                <span>Generated: {REPORT_DATE}</span>
            </div>
        </div>
    </div>

    <!-- SLIDE 2: PERFORMANCE SUMMARY -->
    <div class="slide">
        <!-- Agency Header -->
        <div class="agency-header">
            <div class="agency-logo">
                <img src="https://report.hadona.id/logo/logo-header-pdf.webp" alt="Hadona Digital Media" class="agency-logo-icon">
                <div>
                    <div class="agency-name">Hadona Digital Media</div>
                    <div class="agency-tagline">Performance Marketing</div>
                </div>
            </div>
            <div class="report-meta">
                <div class="report-date">Generated: {REPORT_DATE}</div>
                <div class="confidential-badge">🔒 Confidential</div>
            </div>
        </div>

        <h1>Performance Summary</h1>
        <h2>Key Metrics Overview</h2>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px;">
            <!-- This Month -->
            <div class="card">
                <div class="card-header">
                    <div class="card-title">{THIS_PERIOD_LABEL}</div>
                    <div class="card-badge">Current</div>
                </div>
                <div style="margin-top: 20px;">
                    <div class="metric-label">Amount Spent</div>
                    <div class="metric-value">{THIS_SPEND}</div>
                </div>
                <div style="margin-top: 20px;">
                    <div class="metric-label">Results (Add to Cart)</div>
                    <div class="metric-value">{THIS_ATC}</div>
                </div>
                <div style="margin-top: 20px;">
                    <div class="metric-label">Cost per Result</div>
                    <div class="metric-value">{THIS_CPR}</div>
                </div>
                <div style="margin-top: 24px;">
                    <div class="growth-indicator {GROWTH_INDICATOR_CLASS}">
                        <span>{GROWTH_ARROW}</span>
                        <span>Growth: {GROWTH_PERCENT}%</span>
                    </div>
                </div>
            </div>

            <!-- Last Month -->
            <div class="card">
                <div class="card-header">
                    <div class="card-title">{LAST_PERIOD_LABEL}</div>
                    <div class="card-badge" style="background: var(--neutral-400);">Previous</div>
                </div>
                <div style="margin-top: 20px;">
                    <div class="metric-label">Amount Spent</div>
                    <div class="metric-value" style="color: var(--neutral-700);">{LAST_SPEND}</div>
                </div>
                <div style="margin-top: 20px;">
                    <div class="metric-label">Results (Add to Cart)</div>
                    <div class="metric-value" style="color: var(--neutral-700);">{LAST_ATC}</div>
                </div>
                <div style="margin-top: 20px;">
                    <div class="metric-label">Cost per Result</div>
                    <div class="metric-value" style="color: var(--neutral-700);">{LAST_CPR}</div>
                </div>
            </div>
        </div>

        <div class="insight-box" style="margin-top: 32px;">
            <p>
                <strong>Key Insight:</strong> {PERIOD_TYPE} ini menunjukkan performa yang {GROWTH_SENTIMENT} dengan {THIS_ATC} add to cart dan CPR {THIS_CPR}.
                Pertumbuhan spend sebesar {SPEND_GROWTH}% {SPEND_SENTIMENT} dengan hasil yang {PERFORMANCE_SENTIMENT}.
                {CONVERSION_SENTIMENT}
            </p>
        </div>

        <!-- Slide Footer -->
        <div class="slide-footer">
            <span>Hadona Digital Media • CPAS Performance Report</span>
            <span class="slide-number">Page 2</span>
        </div>
    </div>

    <!-- SLIDE 3: DETAILED METRICS -->
    <div class="slide">
        <div class="agency-header">
            <div class="agency-logo">
                <img src="https://report.hadona.id/logo/logo-header-pdf.webp" alt="Hadona Digital Media" class="agency-logo-icon">
                <div>
                    <div class="agency-name">Hadona Digital Media</div>
                    <div class="agency-tagline">Performance Marketing</div>
                </div>
            </div>
            <div class="report-meta">
                <div class="report-date">Generated: {REPORT_DATE}</div>
            </div>
        </div>

        <h1>Detailed Performance Metrics</h1>
        <h2>Complete {PERIOD_TYPE} Comparison</h2>

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
                        <td><strong>CPM</strong></td>
                        <td class="text-right">{LAST_CPM}</td>
                        <td class="text-right">{THIS_CPM}</td>
                        <td class="text-right {CPM_CLASS}">{CPM_DIFF}</td>
                        <td class="text-right"><span class="badge {CPM_BADGE_CLASS}">{CPM_GROWTH}%</span></td>
                    </tr>
                    <tr>
                        <td><strong>Outbound Clicks</strong></td>
                        <td class="text-right">{LAST_OUTBOUND_CLICKS}</td>
                        <td class="text-right">{THIS_OUTBOUND_CLICKS}</td>
                        <td class="text-right {OUTBOUND_CLICKS_CLASS}">{OUTBOUND_CLICKS_DIFF}</td>
                        <td class="text-right"><span class="badge {OUTBOUND_CLICKS_BADGE_CLASS}">{OUTBOUND_CLICKS_GROWTH}%</span></td>
                    </tr>
                    <tr>
                        <td><strong>CTR (link click-through rate)</strong></td>
                        <td class="text-right">{LAST_CTR}</td>
                        <td class="text-right">{THIS_CTR}</td>
                        <td class="text-right {CTR_CLASS}">{CTR_DIFF}</td>
                        <td class="text-right"><span class="badge {CTR_BADGE_CLASS}">{CTR_GROWTH}%</span></td>
                    </tr>
                    <tr>
                        <td><strong>Adds to cart with shared items</strong></td>
                        <td class="text-right">{LAST_ATC}</td>
                        <td class="text-right">{THIS_ATC}</td>
                        <td class="text-right {ATC_CLASS}">{ATC_DIFF}</td>
                        <td class="text-right"><span class="badge {ATC_BADGE_CLASS}">{ATC_GROWTH}%</span></td>
                    </tr>
                    <tr>
                        <td><strong>Cost per add to cart with shared items</strong></td>
                        <td class="text-right">{LAST_COST_PER_ATC}</td>
                        <td class="text-right">{THIS_COST_PER_ATC}</td>
                        <td class="text-right {COST_PER_ATC_CLASS}">{COST_PER_ATC_DIFF}</td>
                        <td class="text-right"><span class="badge {COST_PER_ATC_BADGE_CLASS}">{COST_PER_ATC_GROWTH}%</span></td>
                    </tr>
                    <tr>
                        <td><strong>ATC conversion value (shared only)</strong></td>
                        <td class="text-right">{LAST_ATC_CV}</td>
                        <td class="text-right">{THIS_ATC_CV}</td>
                        <td class="text-right {ATC_CV_CLASS}">{ATC_CV_DIFF}</td>
                        <td class="text-right"><span class="badge {ATC_CV_BADGE_CLASS}">{ATC_CV_GROWTH}%</span></td>
                    </tr>
                    <tr>
                        <td><strong>Purchases with shared items</strong></td>
                        <td class="text-right">{LAST_PURCHASES}</td>
                        <td class="text-right">{THIS_PURCHASES}</td>
                        <td class="text-right {PURCH_CLASS}">{PURCH_DIFF}</td>
                        <td class="text-right"><span class="badge {PURCH_BADGE_CLASS}">{PURCH_GROWTH}%</span></td>
                    </tr>
                    <tr>
                        <td><strong>Cost per purchases with shared items</strong></td>
                        <td class="text-right">{LAST_COST_PER_PURCHASE}</td>
                        <td class="text-right">{THIS_COST_PER_PURCHASE}</td>
                        <td class="text-right {COST_PER_PURCHASE_CLASS}">{COST_PER_PURCHASE_DIFF}</td>
                        <td class="text-right"><span class="badge {COST_PER_PURCHASE_BADGE_CLASS}">{COST_PER_PURCHASE_GROWTH}%</span></td>
                    </tr>
                    <tr>
                        <td><strong>Purchases conversion value for shared items only</strong></td>
                        <td class="text-right">{LAST_PURCHASE_CV}</td>
                        <td class="text-right">{THIS_PURCHASE_CV}</td>
                        <td class="text-right {PURCHASE_CV_CLASS}">{PURCHASE_CV_DIFF}</td>
                        <td class="text-right"><span class="badge {PURCHASE_CV_BADGE_CLASS}">{PURCHASE_CV_GROWTH}%</span></td>
                    </tr>
                    <tr>
                        <td><strong>Conversion Rate (Purchase ÷ Click)</strong></td>
                        <td class="text-right">{LAST_CONVERSION_RATE}</td>
                        <td class="text-right">{THIS_CONVERSION_RATE}</td>
                        <td class="text-right {CONVERSION_RATE_CLASS}">{CONVERSION_RATE_DIFF}</td>
                        <td class="text-right"><span class="badge {CONVERSION_RATE_BADGE_CLASS}">{CONVERSION_RATE_GROWTH}%</span></td>
                    </tr>
                    <tr>
                        <td><strong>ROAS (return on ad spend)</strong></td>
                        <td class="text-right">{LAST_ROAS}</td>
                        <td class="text-right">{THIS_ROAS}</td>
                        <td class="text-right {ROAS_CLASS}">{ROAS_DIFF}</td>
                        <td class="text-right"><span class="badge {ROAS_BADGE_CLASS}">{ROAS_GROWTH}%</span></td>
                    </tr>
                    <tr>
                        <td><strong>Average purchases conversion value</strong></td>
                        <td class="text-right">{LAST_AOV}</td>
                        <td class="text-right">{THIS_AOV}</td>
                        <td class="text-right {AOV_CLASS}">{AOV_DIFF}</td>
                        <td class="text-right"><span class="badge {AOV_BADGE_CLASS}">{AOV_GROWTH}%</span></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="insight-box" style="margin-top: 32px;">
            <p>
                <strong>Insight Utama:</strong> Performa {PERIOD_TYPE} ini {METRIC_PERFORMANCE_DESC}.
                {TOP_PERFORMER_METRIC} adalah top performer dengan {TOP_PERFORMER_GROWTH}% pertumbuhan.
                {CTR_SENTIMENT} CTR sebesar {THIS_CTR}%.
                Rekomendasi: {METRICS_RECOMMENDATION}
            </p>
        </div>

        <div class="slide-footer">
            <span>Hadona Digital Media • CPAS Performance Report</span>
            <span class="slide-number">Page 3</span>
        </div>
    </div>

    <!-- SLIDE 4: KEY INSIGHTS -->
    <div class="slide">
        <div class="agency-header">
            <div class="agency-logo">
                <img src="https://report.hadona.id/logo/logo-header-pdf.webp" alt="Hadona Digital Media" class="agency-logo-icon">
                <div>
                    <div class="agency-name">Hadona Digital Media</div>
                    <div class="agency-tagline">Performance Marketing</div>
                </div>
            </div>
            <div class="report-meta">
                <div class="report-date">Generated: {REPORT_DATE}</div>
            </div>
        </div>

        <h1>Key Insights</h1>
        <h2>Analysis & Recommendations</h2>

        <!-- Two Column Layout: Highlights and Lowlights -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 28px; margin-bottom: 28px;">

            <!-- HIGHLIGHTS COLUMN -->
            <div>
                <h3 style="color: var(--success-green); margin-bottom: 16px; font-size: 18px; font-weight: 700;">
                    Highlights
                </h3>
                <div class="highlight-box">
                    <ul style="list-style: none; padding: 0; margin: 0; line-height: 2;">
                        <li style="margin-bottom: 12px; color: var(--neutral-800);">
                            <span class="icon-badge icon-badge-success">✓</span>
                            <strong>{THIS_ATC} Add to Cart</strong>
                            <div style="font-size: 13px; color: var(--neutral-600); margin-top: 4px; margin-left: 36px;">
                                Konversi pertama tercapai dengan CPR {THIS_CPR}
                            </div>
                        </li>
                        <li style="margin-bottom: 12px; color: var(--neutral-800);">
                            <span class="icon-badge icon-badge-success">✓</span>
                            <strong>{THIS_PURCHASES} Purchases</strong>
                            <div style="font-size: 13px; color: var(--neutral-600); margin-top: 4px; margin-left: 36px;">
                                ROAS {THIS_ROAS}, AOV {THIS_AOV}
                            </div>
                        </li>
                        <li style="margin-bottom: 12px; color: var(--neutral-800);">
                            <span class="icon-badge icon-badge-success">✓</span>
                            <strong>CPM {CPM_SENTIMENT} {CPM_CHANGE_ABS}%</strong>
                            <div style="font-size: 13px; color: var(--neutral-600); margin-top: 4px; margin-left: 36px;">
                                {CPM_INSIGHT}
                            </div>
                        </li>
                        <li style="margin-bottom: 12px; color: var(--neutral-800);">
                            <span class="icon-badge icon-badge-success">✓</span>
                            <strong>{THIS_IG_FOLLOWS} New Followers</strong>
                            <div style="font-size: 13px; color: var(--neutral-600); margin-top: 4px; margin-left: 36px;">
                                Instagram community growth
                            </div>
                        </li>
                        <li style="color: var(--neutral-800);">
                            <span class="icon-badge icon-badge-success">✓</span>
                            <strong>{THIS_IG_PROFILE_VISITS} Profile Visits</strong>
                            <div style="font-size: 13px; color: var(--neutral-600); margin-top: 4px; margin-left: 36px;">
                                Significant brand awareness increase
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- LOWLIGHTS COLUMN -->
            <div>
                <h3 style="color: var(--danger-red); margin-bottom: 16px; font-size: 18px; font-weight: 700;">
                    Lowlights
                </h3>
                <div class="lowlight-box">
                    <ul style="list-style: none; padding: 0; margin: 0; line-height: 2;">
                        <li style="margin-bottom: 12px; color: var(--neutral-800);">
                            <span class="icon-badge icon-badge-danger">!</span>
                            <strong>CTR {CTR_SENTIMENT_LOW} {CTR_CHANGE_ABS}%</strong>
                            <div style="font-size: 13px; color: var(--neutral-600); margin-top: 4px; margin-left: 36px;">
                                {CTR_INSIGHT}
                            </div>
                        </li>
                        <li style="margin-bottom: 12px; color: var(--neutral-800);">
                            <span class="icon-badge icon-badge-danger">!</span>
                            <strong>CPC {CPC_SENTIMENT} {CPC_CHANGE_ABS}%</strong>
                            <div style="font-size: 13px; color: var(--neutral-600); margin-top: 4px; margin-left: 36px;">
                                {CPC_INSIGHT}
                            </div>
                        </li>
                        <li style="color: var(--neutral-800);">
                            <span class="icon-badge icon-badge-danger">!</span>
                            <strong>{LOWLIGHT_THIRD_ITEM}</strong>
                            <div style="font-size: 13px; color: var(--neutral-600); margin-top: 4px; margin-left: 36px;">
                                {LOWLIGHT_THIRD_DETAIL}
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- INSIGHT BOX -->
        <div class="insight-box">
            <p>
                <strong>Insight:</strong> {INSIGHT_SUMMARY}
            </p>
        </div>

        <div class="slide-footer">
            <span>Hadona Digital Media • CPAS Performance Report</span>
            <span class="slide-number">Page 4</span>
        </div>
    </div>

    <!-- SLIDE 5: AUDIENCE - AGE BREAKDOWN -->
    <div class="slide">
        <!-- Agency Header -->
        <div class="agency-header">
            <div class="agency-logo">
                <img src="https://report.hadona.id/logo/logo-header-pdf.webp" alt="Hadona Digital Media" class="agency-logo-icon">
                <div>
                    <div class="agency-name">Hadona Digital Media</div>
                    <div class="agency-tagline">Performance Marketing</div>
                </div>
            </div>
            <div class="report-meta">
                <div class="report-date">Generated: {REPORT_DATE}</div>
            </div>
        </div>

        <h1>Audience Performance - Age</h1>
        <h2>Demographic Analysis by Age Group (Sorted by Amount Spent)</h2>

        {AGE_BREAKDOWN_TABLE}

        <div class="insight-box" style="margin-top: 24px;">
            <p>
                <strong>Insight:</strong> {AGE_INSIGHT}
            </p>
        </div>

        <!-- Slide Footer -->
        <div class="slide-footer">
            <span>Hadona Digital Media • CPAS Performance Report</span>
            <span class="slide-number">Page 5</span>
        </div>
    </div>

    <!-- SLIDE 6: AUDIENCE - GENDER BREAKDOWN -->
    <div class="slide">
        <!-- Agency Header -->
        <div class="agency-header">
            <div class="agency-logo">
                <img src="https://report.hadona.id/logo/logo-header-pdf.webp" alt="Hadona Digital Media" class="agency-logo-icon">
                <div>
                    <div class="agency-name">Hadona Digital Media</div>
                    <div class="agency-tagline">Performance Marketing</div>
                </div>
            </div>
            <div class="report-meta">
                <div class="report-date">Generated: {REPORT_DATE}</div>
            </div>
        </div>

        <h1>Audience Performance - Gender</h1>
        <h2>Demographic Analysis by Gender (Sorted by Amount Spent)</h2>

        {GENDER_BREAKDOWN_TABLE}

        <div class="insight-box" style="margin-top: 24px;">
            <p>
                <strong>Insight:</strong> {GENDER_INSIGHT}
            </p>
        </div>

        <!-- Slide Footer -->
        <div class="slide-footer">
            <span>Hadona Digital Media • CPAS Performance Report</span>
            <span class="slide-number">Page 6</span>
        </div>
    </div>

    <!-- SLIDE 7: AUDIENCE - REGION BREAKDOWN -->
    <div class="slide">
        <!-- Agency Header -->
        <div class="agency-header">
            <div class="agency-logo">
                <img src="https://report.hadona.id/logo/logo-header-pdf.webp" alt="Hadona Digital Media" class="agency-logo-icon">
                <div>
                    <div class="agency-name">Hadona Digital Media</div>
                    <div class="agency-tagline">Performance Marketing</div>
                </div>
            </div>
            <div class="report-meta">
                <div class="report-date">Generated: {REPORT_DATE}</div>
            </div>
        </div>

        <h1>Audience Performance - Region</h1>
        <h2>Geographic Performance Analysis (Top 10 by Amount Spent)</h2>

        {REGION_BREAKDOWN_TABLE}

        <div class="insight-box" style="margin-top: 24px;">
            <p>
                <strong>Insight:</strong> {REGION_INSIGHT}
            </p>
        </div>

        <!-- Slide Footer -->
        <div class="slide-footer">
            <span>Hadona Digital Media • CPAS Performance Report</span>
            <span class="slide-number">Page 7</span>
        </div>
    </div>

    <!-- SLIDE 8: PLATFORM PERFORMANCE -->
    <div class="slide">
        <!-- Agency Header -->
        <div class="agency-header">
            <div class="agency-logo">
                <img src="https://report.hadona.id/logo/logo-header-pdf.webp" alt="Hadona Digital Media" class="agency-logo-icon">
                <div>
                    <div class="agency-name">Hadona Digital Media</div>
                    <div class="agency-tagline">Performance Marketing</div>
                </div>
            </div>
            <div class="report-meta">
                <div class="report-date">Generated: {REPORT_DATE}</div>
            </div>
        </div>

        <h1>Platform Performance</h1>
        <h2>Instagram vs Facebook vs Others (Sorted by Amount Spent)</h2>

        {PLATFORM_BREAKDOWN_TABLE}

        <div class="insight-box" style="margin-top: 24px;">
            <p>
                <strong>Insight:</strong> {PLATFORM_INSIGHT}
            </p>
        </div>

        <!-- Slide Footer -->
        <div class="slide-footer">
            <span>Hadona Digital Media • CPAS Performance Report</span>
            <span class="slide-number">Page 8</span>
        </div>
    </div>

    <!-- SLIDE 9: PLACEMENT PERFORMANCE -->
    <div class="slide">
        <!-- Agency Header -->
        <div class="agency-header">
            <div class="agency-logo">
                <img src="https://report.hadona.id/logo/logo-header-pdf.webp" alt="Hadona Digital Media" class="agency-logo-icon">
                <div>
                    <div class="agency-name">Hadona Digital Media</div>
                    <div class="agency-tagline">Performance Marketing</div>
                </div>
            </div>
            <div class="report-meta">
                <div class="report-date">Generated: {REPORT_DATE}</div>
            </div>
        </div>

        <h1>Placement Performance</h1>
        <h2>Ad Placement Analysis - Top 10 (Feed, Stories, Reels, Explore, etc.)</h2>

        {PLACEMENT_BREAKDOWN_TABLE}

        <div class="insight-box" style="margin-top: 24px;">
            <p>
                <strong>Insight:</strong> {PLACEMENT_INSIGHT}
            </p>
        </div>

        <!-- Slide Footer -->
        <div class="slide-footer">
            <span>Hadona Digital Media • CPAS Performance Report</span>
            <span class="slide-number">Page 9</span>
        </div>
    </div>

    <!-- SLIDE 10: CAMPAIGN OBJECTIVE PERFORMANCE -->
    <div class="slide">
        <!-- Agency Header -->
        <div class="agency-header">
            <div class="agency-logo">
                <img src="https://report.hadona.id/logo/logo-header-pdf.webp" alt="Hadona Digital Media" class="agency-logo-icon">
                <div>
                    <div class="agency-name">Hadona Digital Media</div>
                    <div class="agency-tagline">Performance Marketing</div>
                </div>
            </div>
            <div class="report-meta">
                <div class="report-date">Generated: {REPORT_DATE}</div>
            </div>
        </div>

        <h1>Campaign Objective Performance</h1>
        <h2>Performance by Campaign Objective (Sorted by Amount Spent)</h2>

        {OBJECTIVE_BREAKDOWN_TABLE}

        <div class="insight-box" style="margin-top: 24px;">
            <p>
                <strong>Insight:</strong> {OBJECTIVE_INSIGHT}
            </p>
        </div>

        <!-- Slide Footer -->
        <div class="slide-footer">
            <span>Hadona Digital Media • CPAS Performance Report</span>
            <span class="slide-number">Page 10</span>
        </div>
    </div>

    <!-- SLIDE 11: CREATIVE PERFORMANCE -->
    <div class="slide">
        <!-- Agency Header -->
        <div class="agency-header">
            <div class="agency-logo">
                <img src="https://report.hadona.id/logo/logo-header-pdf.webp" alt="Hadona Digital Media" class="agency-logo-icon">
                <div>
                    <div class="agency-name">Hadona Digital Media</div>
                    <div class="agency-tagline">Performance Marketing</div>
                </div>
            </div>
            <div class="report-meta">
                <div class="report-date">Generated: {REPORT_DATE}</div>
            </div>
        </div>

        <h1>Creative Performance</h1>
        <h2>Top 10 Performing Ad Creatives (Sorted by Purchases CV)</h2>

        {CREATIVE_BREAKDOWN_TABLE}

        <div class="insight-box" style="margin-top: 24px;">
            <p>
                <strong>Insight:</strong> {CREATIVE_INSIGHT}
            </p>
        </div>

        <!-- Slide Footer -->
        <div class="slide-footer">
            <span>Hadona Digital Media • CPAS Performance Report</span>
            <span class="slide-number">Page 11</span>
        </div>
    </div>

    <!-- SLIDE 12: TWINDATE EVENT HIGHLIGHTS -->
    <div class="slide">
        <!-- Agency Header -->
        <div class="agency-header">
            <div class="agency-logo">
                <img src="https://report.hadona.id/logo/logo-header-pdf.webp" alt="Hadona Digital Media" class="agency-logo-icon">
                <div>
                    <div class="agency-name">Hadona Digital Media</div>
                    <div class="agency-tagline">Performance Marketing</div>
                </div>
            </div>
            <div class="report-meta">
                <div class="report-date">Generated: {REPORT_DATE}</div>
            </div>
        </div>

        <h1>Event MoM Analysis - Twindate</h1>
        <h2>Performance During Twin Date Period (H-4 to H)</h2>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px;">
            <!-- HIGHLIGHTS -->
            <div>
                <h3 style="color: var(--success-green); margin-bottom: 16px; font-size: 18px; font-weight: 700;">
                    Highlights (Best Performing)
                </h3>
                <div class="highlight-box">
                    <ul style="list-style: none; padding: 0; margin: 0; line-height: 1.8;">
                        {TWINDATE_HIGHLIGHTS}
                    </ul>
                </div>
            </div>

            <!-- LOWLIGHTS -->
            <div>
                <h3 style="color: var(--danger-red); margin-bottom: 16px; font-size: 18px; font-weight: 700;">
                    Lowlights (Needs Improvement)
                </h3>
                <div class="lowlight-box">
                    <ul style="list-style: none; padding: 0; margin: 0; line-height: 1.8;">
                        {TWINDATE_LOWLIGHTS}
                    </ul>
                </div>
            </div>
        </div>

        {TWINDATE_COMPARISON_TABLE}

        <div class="insight-box" style="margin-top: 24px;">
            <p>
                <strong>Action Plan:</strong> {TWINDATE_ACTION_PLAN}
            </p>
        </div>

        <!-- Slide Footer -->
        <div class="slide-footer">
            <span>Hadona Digital Media • CPAS Performance Report</span>
            <span class="slide-number">Page 12</span>
        </div>
    </div>

    <!-- SLIDE 13: PAYDAY EVENT HIGHLIGHTS -->
    <div class="slide">
        <!-- Agency Header -->
        <div class="agency-header">
            <div class="agency-logo">
                <img src="https://report.hadona.id/logo/logo-header-pdf.webp" alt="Hadona Digital Media" class="agency-logo-icon">
                <div>
                    <div class="agency-name">Hadona Digital Media</div>
                    <div class="agency-tagline">Performance Marketing</div>
                </div>
            </div>
            <div class="report-meta">
                <div class="report-date">Generated: {REPORT_DATE}</div>
            </div>
        </div>

        <h1>Event MoM Analysis - Payday (≥25)</h1>
        <h2>Performance During Payday Period (Dates 21-31 and 1-5)</h2>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px;">
            <!-- HIGHLIGHTS -->
            <div>
                <h3 style="color: var(--success-green); margin-bottom: 16px; font-size: 18px; font-weight: 700;">
                    Highlights (Best Performing)
                </h3>
                <div class="highlight-box">
                    <ul style="list-style: none; padding: 0; margin: 0; line-height: 1.8;">
                        {PAYDAY_HIGHLIGHTS}
                    </ul>
                </div>
            </div>

            <!-- LOWLIGHTS -->
            <div>
                <h3 style="color: var(--danger-red); margin-bottom: 16px; font-size: 18px; font-weight: 700;">
                    Lowlights (Needs Improvement)
                </h3>
                <div class="lowlight-box">
                    <ul style="list-style: none; padding: 0; margin: 0; line-height: 1.8;">
                        {PAYDAY_LOWLIGHTS}
                    </ul>
                </div>
            </div>
        </div>

        {PAYDAY_COMPARISON_TABLE}

        <div class="insight-box" style="margin-top: 24px;">
            <p>
                <strong>Action Plan:</strong> {PAYDAY_ACTION_PLAN}
            </p>
        </div>

        <!-- Slide Footer -->
        <div class="slide-footer">
            <span>Hadona Digital Media • CPAS Performance Report</span>
            <span class="slide-number">Page 13</span>
        </div>
    </div>

    <!-- SLIDE 14: CONCLUSION -->
    <div class="slide">
        <div class="agency-header">
            <div class="agency-logo">
                <img src="https://report.hadona.id/logo/logo-header-pdf.webp" alt="Hadona Digital Media" class="agency-logo-icon">
                <div>
                    <div class="agency-name">Hadona Digital Media</div>
                    <div class="agency-tagline">Performance Marketing</div>
                </div>
            </div>
            <div class="report-meta">
                <div class="report-date">Generated: {REPORT_DATE}</div>
            </div>
        </div>

        <h1>Conclusion</h1>
        <h2>Summary & Key Takeaways</h2>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 32px;">
            <div class="highlight-box" style="padding: 28px;">
                <h3 style="color: #14532d; margin-bottom: 20px; font-size: 20px; font-weight: 700;">
                    Wins
                </h3>
                <ul style="color: #14532d; line-height: 2; margin-left: 20px; font-weight: 600;">
                    <li>{THIS_ATC} Add to Cart conversions achieved</li>
                    <li>Pertumbuhan kuat {SPEND_GROWTH}% dalam spend</li>
                    <li>CPR terjaga di {THIS_CPR}</li>
                    <li>{CONVERSION_RATE_WIN}% conversion rate dari ATC</li>
                </ul>
            </div>

            <div class="lowlight-box" style="padding: 28px;">
                <h3 style="color: #7f1d1d; margin-bottom: 20px; font-size: 20px; font-weight: 700;">
                    Areas for Improvement
                </h3>
                <ul style="color: #7f1d1d; line-height: 2; margin-left: 20px; font-weight: 600;">
                    <li>Optimasi CTR untuk engagement lebih baik</li>
                    <li>Tingkatkan conversion rate dari ATC ke Purchase</li>
                    <li>Test format kreatif baru untuk variety</li>
                    <li>{IMPROVEMENT_AREA}</li>
                </ul>
            </div>
        </div>

        <div class="insight-box">
            <p>
                <strong>Kesimpulan:</strong> {PERIOD_TYPE} ini menunjukkan performa {GROWTH_SENTIMENT} dengan {THIS_ATC} konversi.
                Campaign ini berada di jalur yang {EFFICIENCY_SENTIMENT} dengan CPR {THIS_CPR}.
                Fokus utama bulan depan: {NEXT_PERIOD_FOCUS}
            </p>
        </div>

        <div class="slide-footer">
            <span>Hadona Digital Media • CPAS Performance Report</span>
            <span class="slide-number">Page 14</span>
        </div>
    </div>

    <!-- SLIDE 15: NEXT STEPS -->
    <div class="slide">
        <div class="agency-header">
            <div class="agency-logo">
                <img src="https://report.hadona.id/logo/logo-header-pdf.webp" alt="Hadona Digital Media" class="agency-logo-icon">
                <div>
                    <div class="agency-name">Hadona Digital Media</div>
                    <div class="agency-tagline">Performance Marketing</div>
                </div>
            </div>
            <div class="report-meta">
                <div class="report-date">Generated: {REPORT_DATE}</div>
            </div>
        </div>

        <h1>Next Steps</h1>
        <h2>Action Plan for Upcoming Period</h2>

        <div class="card" style="padding: 32px;">
            <ol style="color: var(--neutral-800); line-height: 2.2; margin-left: 20px; font-weight: 600;">
                <li style="margin-bottom: 16px;"><strong style="color: var(--primary-blue);">Scale Winning Creatives:</strong> {ACTION_STEP_1}</li>
                <li style="margin-bottom: 16px;"><strong style="color: var(--primary-blue);">Audience Optimization:</strong> {ACTION_STEP_2}</li>
                <li style="margin-bottom: 16px;"><strong style="color: var(--primary-blue);">Placement Testing:</strong> {ACTION_STEP_3}</li>
                <li style="margin-bottom: 16px;"><strong style="color: var(--primary-blue);">Bid Strategy Review:</strong> {ACTION_STEP_4}</li>
                <li style="margin-bottom: 16px;"><strong style="color: var(--primary-blue);">Creative Refresh:</strong> {ACTION_STEP_5}</li>
                <li><strong style="color: var(--primary-blue);">Budget Allocation:</strong> {ACTION_STEP_6}</li>
            </ol>
        </div>

        <div class="insight-box" style="margin-top: 32px;">
            <p>
                <strong>Target Bulan Depan:</strong> {NEXT_MONTH_TARGET}. Dengan implementasi action plan ini,
                kita menargetkan pertumbuhan {TARGET_GROWTH}% pada Add to Cart dan penurunan CPR menjadi {TARGET_CPR}.
            </p>
        </div>

        <div class="slide-footer">
            <span>Hadona Digital Media • CPAS Performance Report</span>
            <span class="slide-number">Page 15</span>
        </div>
    </div>

    <!-- SLIDE 16: THANK YOU -->
    <div class="slide" style="text-align: center; padding: 120px 64px; background: linear-gradient(135deg, white 0%, var(--neutral-50) 100%);">
        <div class="agency-logo" style="justify-content: center; margin-bottom: 48px;">
            <img src="https://report.hadona.id/logo/logo-header-pdf.webp" alt="Hadona Digital Media" class="agency-logo-icon" style="width: 200px;">
        </div>

        <h1 style="font-size: 64px; margin-bottom: 24px; background: linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-yellow) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
            Thank You!
        </h1>
        <p style="font-size: 20px; color: var(--neutral-600); margin-bottom: 56px; font-weight: 500;">
            We appreciate your trust in managing your Meta Ads campaigns
        </p>

        <div style="background: linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-yellow) 100%);
                    padding: 40px; border-radius: 20px; color: white; max-width: 640px; margin: 0 auto; box-shadow: 0 8px 24px rgba(43, 70, 187, 0.25);">
            <p style="font-size: 20px; margin-bottom: 12px; font-weight: 700;">
                Questions or Feedback?
            </p>
            <p style="font-size: 15px; opacity: 0.95; line-height: 1.7;">
                Contact us anytime for campaign consultation
            </p>
            <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid rgba(255, 255, 255, 0.3); font-size: 13px; opacity: 0.9;">
                © 2026 Hadona Digital Media. All rights reserved.
            </div>
        </div>
    </div>

    <!-- End of slides -->
</body>
</html>`

/**
 * Generate comprehensive CPAS breakdown table with all metrics
 */
const generateComprehensiveBreakdown = (
  breakdownData: any[],
  dimensionName: string,
  dimensionKey: string,
  sortBy: 'spend' | 'purchasesCV' = 'spend',
  topN: number = 10,
  includeCreativeName: boolean = false
): string => {
  const parseNum = (val: any): number => {
    if (typeof val === 'number') return val
    if (!val) return 0
    const parsed = parseFloat(String(val).replace(/,/g, ''))
    return isNaN(parsed) ? 0 : parsed
  }

  if (!breakdownData || breakdownData.length === 0) {
    return `<div style="background: #f8fafc; padding: 24px; border-radius: 12px; text-align: center;">
      <p style="color: #64748b; font-size: 14px;">${dimensionName} breakdown data will be displayed here when CSV is provided.</p>
    </div>`
  }

  // Sort by spend or purchases CV
  const sorted = [...breakdownData].sort((a, b) => {
    if (sortBy === 'spend') {
      return parseNum(b['Amount spent (IDR)'] || b.spend || 0) - parseNum(a['Amount spent (IDR)'] || a.spend || 0)
    } else {
      return parseNum(b['Purchases conversion value'] || b['Purchases conversion value for shared items only'] || 0) -
             parseNum(a['Purchases conversion value'] || a['Purchases conversion value for shared items only'] || 0)
    }
  }).slice(0, topN)

  const formatCurrency = (num: number) => 'Rp ' + Math.round(num).toLocaleString('id-ID')
  const formatNumber = (num: number) => Math.round(num).toLocaleString('id-ID')
  const formatPercent = (num: number) => num.toFixed(2) + '%'

  const rows = sorted.map((item: any, idx: number) => {
    // Get creative name with fallback logic
    let creativeName = ''
    if (includeCreativeName) {
      // Try to extract from "Ads" column first (format: "Ads X || Creative Name;...")
      if (item['Ads']) {
        const adsText = item['Ads']
        const match = adsText.match(/\|\|\s*([^;]+)/);
        if (match && match[1]) {
          creativeName = match[1].trim();
        }
      }

      // Fallback to other fields if "Ads" parsing didn't work
      if (!creativeName) {
        const creativeFields = ['Ad name', 'Ad Name', 'Name', 'Creative name', 'ad_name', 'Ads']
        creativeName = creativeFields.find(field => item[field] && field !== 'Ads') || item.name || `Creative ${idx + 1}`
      }
    }

    const name = item[dimensionKey] || item.dimension || `Item ${idx + 1}`
    const spend = parseNum(item['Amount spent (IDR)'] || item.spend || 0)
    const impressions = parseNum(item['Impressions'] || 0)
    const linkClicks = parseNum(item['Link clicks'] || item['Outbound clicks'] || 0)
    const ctr = impressions > 0 ? (linkClicks / impressions * 100) : 0
    const atc = parseNum(item['Adds to cart with shared items'] || 0)
    const purchases = parseNum(item['Purchases with shared items'] || 0)
    const purchasesCV = parseNum(item['Purchases conversion value'] || item['Purchases conversion value for shared items only'] || 0)

    // Check if ATC and Purchases data exists (not all zeros)
    const hasAtcData = atc > 0
    const hasPurchasesData = purchases > 0

    const rowStyle = idx % 2 === 0 ? 'background: #ffffff;' : 'background: #f9fafb;'

    return `
      <tr style="${rowStyle}">
        ${includeCreativeName ? `<td style="font-size: 11px;"><strong>${creativeName}</strong></td>` : ''}
        ${includeCreativeName ? '' : `<td style="font-size: 11px;"><strong>${name}</strong></td>`}
        <td class="text-right" style="font-size: 11px;">${formatNumber(impressions)}</td>
        <td class="text-right" style="font-size: 11px;">${formatNumber(linkClicks)}</td>
        <td class="text-right" style="font-size: 11px;">${formatPercent(ctr)}</td>
        <td class="text-right" style="font-size: 11px; ${!hasAtcData ? 'color: #94a3b8;' : ''}">${hasAtcData ? formatNumber(atc) : '-'}</td>
        <td class="text-right" style="font-size: 11px; ${!hasPurchasesData ? 'color: #94a3b8;' : ''}">${hasPurchasesData ? formatNumber(purchases) : '-'}</td>
        <td class="text-right" style="font-size: 11px;">${formatCurrency(spend)}</td>
      </tr>
    `
  }).join('')

  return `
    <div style="overflow-x: auto;">
      <table class="compact-table">
        <thead>
          <tr>
            ${includeCreativeName ? '<th style="width: 25%;">Creative Name</th>' : '<th style="width: 15%;">' + dimensionName + '</th>'}
            <th class="text-right" style="width: ${includeCreativeName ? '11.5' : '10'}%;">Impr</th>
            <th class="text-right" style="width: ${includeCreativeName ? '10' : '8'}%;">Clicks</th>
            <th class="text-right" style="width: ${includeCreativeName ? '9' : '8'}%;">CTR</th>
            <th class="text-right" style="width: ${includeCreativeName ? '9' : '8'}%;">ATC</th>
            <th class="text-right" style="width: ${includeCreativeName ? '9' : '8'}%;">Purch</th>
            <th class="text-right" style="width: ${includeCreativeName ? '12.5' : '12'}%;">Spend</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `
}

/**
 * Generate event comparison table for Twindate/Payday
 */
const generateEventComparisonTable = (
  thisEvent: any,
  lastEvent: any,
  eventName: string
): string => {
  const formatCurrency = (num: number) => 'Rp ' + Math.round(num).toLocaleString('id-ID')
  const formatNumber = (num: number) => Math.round(num).toLocaleString('id-ID')
  const formatPercent = (num: number) => num.toFixed(2) + '%'
  const formatROAS = (num: number) => num.toFixed(2)

  const calcGrowth = (thisVal: number, lastVal: number) => {
    if (lastVal === 0) return { value: 0, text: 'N/A' }
    const growth = ((thisVal - lastVal) / lastVal) * 100
    const text = (growth > 0 ? '+' : '') + growth.toFixed(2) + '%'
    const color = growth >= 0 ? '#10b981' : '#ef4444'
    return { value: growth, text, color }
  }

  const metrics = [
    { name: 'Amount Spent', thisVal: thisEvent.amountSpent || 0, lastVal: lastEvent.amountSpent || 0, format: formatCurrency },
    { name: 'Impressions', thisVal: thisEvent.impressions || 0, lastVal: lastEvent.impressions || 0, format: formatNumber },
    { name: 'Link Clicks', thisVal: thisEvent.linkClicks || 0, lastVal: lastEvent.linkClicks || 0, format: formatNumber },
    { name: 'CTR', thisVal: (thisEvent.ctr || 0) * 100, lastVal: (lastEvent.ctr || 0) * 100, format: formatPercent },
    { name: 'Adds to Cart', thisVal: thisEvent.addsToCart || 0, lastVal: lastEvent.addsToCart || 0, format: formatNumber },
    { name: 'Purchases', thisVal: thisEvent.purchases || 0, lastVal: lastEvent.purchases || 0, format: formatNumber },
    { name: 'Purchases CV', thisVal: thisEvent.purchasesConversionValue || 0, lastVal: lastEvent.purchasesConversionValue || 0, format: formatCurrency },
    { name: 'ROAS', thisVal: thisEvent.roas || 0, lastVal: lastEvent.roas || 0, format: formatROAS },
    { name: 'Cost per Purchase', thisVal: thisEvent.costPerPurchase || 0, lastVal: lastEvent.costPerPurchase || 0, format: formatCurrency },
  ]

  const rows = metrics.map(metric => {
    const growth = calcGrowth(metric.thisVal, metric.lastVal)
    return `
      <tr>
        <td style="font-size: 12px;"><strong>${metric.name}</strong></td>
        <td class="text-right" style="font-size: 12px;">${metric.format(metric.lastVal)}</td>
        <td class="text-right" style="font-size: 12px;">${metric.format(metric.thisVal)}</td>
        <td class="text-right" style="font-size: 12px; color: ${growth.color}; font-weight: 600;">${growth.text}</td>
      </tr>
    `
  }).join('')

  return `
    <div style="overflow-x: auto;">
      <table>
        <thead>
          <tr>
            <th style="width: 30%;">Metric</th>
            <th class="text-right" style="width: 25%;">${eventName === 'Twindate' ? 'Last Twindate' : 'Last Payday'}</th>
            <th class="text-right" style="width: 25%;">This ${eventName}</th>
            <th class="text-right" style="width: 20%;">MoM Growth</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `
}

/**
 * Generate event highlights/lowlights
 */
const generateEventHighlights = (eventData: any, type: 'highlights' | 'lowlights'): string => {
  if (!eventData || Object.keys(eventData).length === 0) {
    return `<li style="margin-bottom: 8px; font-size: 13px;">No ${type} data available</li>`
  }

  const parseNum = (val: any) => typeof val === 'number' ? val : 0
  const formatCurrency = (num: number) => 'Rp ' + Math.round(num).toLocaleString('id-ID')
  const formatNumber = (num: number) => Math.round(num).toLocaleString('id-ID')

  const getGrowth = (current: number, previous: number) => {
    if (previous === 0) return null
    return ((current - previous) / previous) * 100
  }

  const items: string[] = []
  const spend = parseNum(eventData.amountSpent)
  const purchases = parseNum(eventData.purchases)
  const purchasesCV = parseNum(eventData.purchasesConversionValue)
  const roas = parseNum(eventData.roas)
  const atc = parseNum(eventData.addsToCart)
  const ctr = parseNum(eventData.ctr) * 100

  if (type === 'highlights') {
    if (purchasesCV > 0 && spend > 0) {
      items.push(`<li style="margin-bottom: 8px; font-size: 13px;"><span style="color: #10b981; font-weight: 600;">✓</span> Purchases CV: <strong>${formatCurrency(purchasesCV)}</strong></li>`)
    }
    if (roas >= 2) {
      items.push(`<li style="margin-bottom: 8px; font-size: 13px;"><span style="color: #10b981; font-weight: 600;">✓</span> Healthy ROAS: <strong>${roas.toFixed(2)}x</strong></li>`)
    }
    if (atc > 0) {
      items.push(`<li style="margin-bottom: 8px; font-size: 13px;"><span style="color: #10b981; font-weight: 600;">✓</span> Add to Cart: <strong>${formatNumber(atc)}</strong></li>`)
    }
    if (ctr >= 1.5) {
      items.push(`<li style="margin-bottom: 8px; font-size: 13px;"><span style="color: #10b981; font-weight: 600;">✓</span> Strong CTR: <strong>${ctr.toFixed(2)}%</strong></li>`)
    }
  } else {
    if (roas > 0 && roas < 1.5) {
      items.push(`<li style="margin-bottom: 8px; font-size: 13px;"><span style="color: #ef4444; font-weight: 600;">!</span> Low ROAS: <strong>${roas.toFixed(2)}x</strong> (Target: ≥2.0x)</li>`)
    }
    if (ctr > 0 && ctr < 1.0) {
      items.push(`<li style="margin-bottom: 8px; font-size: 13px;"><span style="color: #ef4444; font-weight: 600;">!</span> Weak CTR: <strong>${ctr.toFixed(2)}%</strong> (Target: ≥1.5%)</li>`)
    }
    if (spend > 0 && purchases === 0) {
      items.push(`<li style="margin-bottom: 8px; font-size: 13px;"><span style="color: #ef4444; font-weight: 600;">!</span> Zero conversions with spend of ${formatCurrency(spend)}</li>`)
    }
    const costPerPurchase = parseNum(eventData.costPerPurchase)
    if (costPerPurchase > 15000) {
      items.push(`<li style="margin-bottom: 8px; font-size: 13px;"><span style="color: #ef4444; font-weight: 600;">!</span> High Cost per Purchase: <strong>${formatCurrency(costPerPurchase)}</strong></li>`)
    }
  }

  if (items.length === 0) {
    items.push(`<li style="margin-bottom: 8px; font-size: 13px;">No significant ${type}</li>`)
  }

  return items.join('')
}

/**
 * Generate CPAS Report using inline template
 * This works without external file dependencies
 */
export function generateReactTailwindReport(analysisData: any, reportName?: string, retentionType?: string, objectiveType?: string): string {
  console.log('[CPAS Template] Starting report generation...')

  const { thisWeek, lastWeek, breakdown, eventAnalysis, performanceSummary } = analysisData || {}

  // Get data from performanceSummary or fallback to direct properties
  const thisMonthData = performanceSummary?.thisWeek || thisWeek || {}
  const lastMonthData = performanceSummary?.lastWeek || lastWeek || {}
  const breakdownThisWeek = breakdown?.thisWeek || {}
  const breakdownLastWeek = breakdown?.lastWeek || {}
  const events = eventAnalysis || {}

  // Extract and calculate all metrics with proper formulas
  const parseNum = (val: any): number => {
    if (typeof val === 'number') return val
    if (!val) return 0
    const parsed = parseFloat(String(val).replace(/,/g, ''))
    return isNaN(parsed) ? 0 : parsed
  }

  // Check if this is a new client (no last month data) - check BEFORE parsing
  const rawLastMonthSpend = parseNum(lastMonthData.amountSpent)
  const rawLastMonthImpr = parseNum(lastMonthData.impressions)
  const rawLastMonthATC = parseNum(lastMonthData.addToCart || lastMonthData.addsToCart)
  const isNewClient = rawLastMonthSpend === 0 && rawLastMonthImpr === 0 && rawLastMonthATC === 0

  // Format functions that handle new clients
  const formatCurrency = (num: number) => 'Rp ' + Math.round(num).toLocaleString('id-ID')
  const formatNumber = (num: number) => Math.round(num).toLocaleString('id-ID')
  const formatPercent = (num: number) => num.toFixed(2) + '%'

  // Override format functions for new clients - show "-" when last month is 0
  const smartFormatCurrency = (num: number, isLastPeriod: boolean = false) => {
    if (isLastPeriod && isNewClient && num === 0) return '-'
    return formatCurrency(num)
  }

  const smartFormatNumber = (num: number, isLastPeriod: boolean = false) => {
    if (isLastPeriod && isNewClient && num === 0) return '-'
    return formatNumber(num)
  }

  const smartFormatPercent = (num: number, isLastPeriod: boolean = false) => {
    if (isLastPeriod && isNewClient && num === 0) return '-'
    return num.toFixed(2) + '%'
  }

  // Extract basic metrics
  const thisMonthSpend = parseNum(thisMonthData.amountSpent)
  const lastMonthSpend = parseNum(lastMonthData.amountSpent)
  const thisMonthATC = parseNum(thisMonthData.addToCart || thisMonthData.addsToCart)
  const lastMonthATC = parseNum(lastMonthData.addToCart || lastMonthData.addsToCart)
  const thisMonthPurchases = parseNum(thisMonthData.purchases)
  const lastMonthPurchases = parseNum(lastMonthData.purchases)
  const thisMonthImpressions = parseNum(thisMonthData.impressions)
  const lastMonthImpressions = parseNum(lastMonthData.impressions)

  // Helper functions to format last period values (show "-" for new clients)
  const formatLastPeriod = (value: number) => isNewClient && value === 0 ? '-' : formatNumber(value)
  const formatLastPeriodCurrency = (value: number) => isNewClient && value === 0 ? '-' : formatCurrency(value)
  const formatLastPeriodPercent = (value: number) => isNewClient && value === 0 ? '-' : value.toFixed(2) + '%'
  const formatGrowthForNewClient = (growth: number) => isNewClient ? 'N/A' : getGrowthText(growth)

  const thisMonthClicks = parseNum(thisMonthData.linkClicks || thisMonthData.outboundClicks)
  const lastMonthClicks = parseNum(lastMonthData.linkClicks || lastMonthData.outboundClicks)
  const thisMonthCTR = thisMonthData.ctr || (thisMonthClicks > 0 && thisMonthImpressions > 0 ? (thisMonthClicks / thisMonthImpressions * 100) : 0)
  const lastMonthCTR = lastMonthData.ctr || (lastMonthClicks > 0 && lastMonthImpressions > 0 ? (lastMonthClicks / lastMonthImpressions * 100) : 0)
  const thisMonthCPM = thisMonthData.cpm || (thisMonthImpressions > 0 ? (thisMonthSpend / thisMonthImpressions * 1000) : 0)
  const lastMonthCPM = lastMonthData.cpm || (lastMonthImpressions > 0 ? (lastMonthSpend / lastMonthImpressions * 1000) : 0)
  const thisMonthCPC = thisMonthData.cpc || (thisMonthClicks > 0 ? (thisMonthSpend / thisMonthClicks) : 0)
  const lastMonthCPC = lastMonthData.cpc || (lastMonthClicks > 0 ? (lastMonthSpend / lastMonthClicks) : 0)

  // CPAS-specific metrics
  const thisMonthATCCV = parseNum(thisMonthData.atcConversionValue)
  const lastMonthATCCV = parseNum(lastMonthData.atcConversionValue)
  const thisMonthPurchaseCV = parseNum(thisMonthData.purchasesConversionValue)
  const lastMonthPurchaseCV = parseNum(lastMonthData.purchasesConversionValue)
  const thisMonthROAS = thisMonthData.roas || (thisMonthSpend > 0 ? (thisMonthPurchaseCV / thisMonthSpend) : 0)
  const lastMonthROAS = lastMonthData.roas || (lastMonthSpend > 0 ? (lastMonthPurchaseCV / lastMonthSpend) : 0)
  const thisMonthAOV = thisMonthData.aov || (thisMonthPurchases > 0 ? (thisMonthPurchaseCV / thisMonthPurchases) : 0)
  const lastMonthAOV = lastMonthData.aov || (lastMonthPurchases > 0 ? (lastMonthPurchaseCV / lastMonthPurchases) : 0)

  // Calculate growth with proper formula: ((thisWeek - lastWeek) / lastWeek) * 100
  const calcGrowth = (thisVal: number, lastVal: number): number => {
    if (lastVal === 0) return 0
    return ((thisVal - lastVal) / lastVal) * 100
  }

  const spendGrowth = calcGrowth(thisMonthSpend, lastMonthSpend)
  const atcGrowth = calcGrowth(thisMonthATC, lastMonthATC)
  const purchGrowth = calcGrowth(thisMonthPurchases, lastMonthPurchases)
  const imprGrowth = calcGrowth(thisMonthImpressions, lastMonthImpressions)
  const clicksGrowth = calcGrowth(thisMonthClicks, lastMonthClicks)
  const ctrGrowth = calcGrowth(thisMonthCTR, lastMonthCTR)
  const cpmGrowth = calcGrowth(thisMonthCPM, lastMonthCPM)
  const cpcGrowth = calcGrowth(thisMonthCPC, lastMonthCPC)
  const atcCVGrowth = calcGrowth(thisMonthATCCV, lastMonthATCCV)
  const purchaseCVGrowth = calcGrowth(thisMonthPurchaseCV, lastMonthPurchaseCV)
  const roasGrowth = calcGrowth(thisMonthROAS, lastMonthROAS)
  const aovGrowth = calcGrowth(thisMonthAOV, lastMonthAOV)

  const cprThisMonth = thisMonthATC > 0 ? (thisMonthSpend / thisMonthATC) : 0
  const cprLastMonth = lastMonthATC > 0 ? (lastMonthSpend / lastMonthATC) : 0
  const cprGrowth = calcGrowth(cprThisMonth, cprLastMonth)

  const conversionRateThis = thisMonthClicks > 0 ? (thisMonthPurchases / thisMonthClicks) * 100 : 0
  const conversionRateLast = lastMonthClicks > 0 ? (lastMonthPurchases / lastMonthClicks) * 100 : 0
  const conversionRateGrowth = calcGrowth(conversionRateThis, conversionRateLast)

  // Additional metrics
  const thisMonthContentViews = parseNum(thisMonthData.contentViews || 0)
  const lastMonthContentViews = parseNum(lastMonthData.contentViews || 0)
  const thisMonthIGProfileVisits = parseNum(thisMonthData.igProfileVisits || 0)
  const lastMonthIGProfileVisits = parseNum(lastMonthData.igProfileVisits || 0)
  const thisMonthIGFollows = parseNum(thisMonthData.igFollows || 0)
  const lastMonthIGFollows = parseNum(lastMonthData.igFollows || 0)
  const thisMonthCostPerATC = thisMonthData.costPerATC || (thisMonthATC > 0 ? (thisMonthSpend / thisMonthATC) : 0)
  const lastMonthCostPerATC = lastMonthData.costPerATC || (lastMonthATC > 0 ? (lastMonthSpend / lastMonthATC) : 0)
  const thisMonthCostPerPurchase = thisMonthData.costPerPurchase || (thisMonthPurchases > 0 ? (thisMonthSpend / thisMonthPurchases) : 0)
  const lastMonthCostPerPurchase = lastMonthData.costPerPurchase || (lastMonthPurchases > 0 ? (lastMonthSpend / lastMonthPurchases) : 0)

  // Helper functions for badges and diffs
  const getBadgeClass = (growth: number) => growth >= 0 ? 'badge-green' : 'badge-red'
  const getGrowthText = (growth: number) => (growth > 0 ? '+' : '') + growth.toFixed(2) + '%'
  const getDiffText = (thisVal: number, lastVal: number) => {
    const diff = thisVal - lastVal
    const sign = diff >= 0 ? '+' : ''
    return sign + formatNumber(Math.abs(diff))
  }
  const getDiffClass = (thisVal: number, lastVal: number) => (thisVal - lastVal) >= 0 ? 'growth-positive' : 'growth-negative'

  // Generate comprehensive breakdown tables
  const ageBreakdownTable = generateComprehensiveBreakdown(breakdownThisWeek.age || [], 'Age', 'Age', 'spend', 10)
  const genderBreakdownTable = generateComprehensiveBreakdown(breakdownThisWeek.gender || [], 'Gender', 'Gender', 'spend', 10)
  const regionBreakdownTable = generateComprehensiveBreakdown(breakdownThisWeek.region || [], 'Region', 'Region', 'spend', 10)
  const platformBreakdownTable = generateComprehensiveBreakdown(breakdownThisWeek.platform || [], 'Platform', 'Platform', 'spend', 10)
  const placementBreakdownTable = generateComprehensiveBreakdown(breakdownThisWeek.placement || [], 'Placement', 'Placement', 'spend', 10)
  const objectiveBreakdownTable = generateComprehensiveBreakdown(breakdownThisWeek.objective || [], 'Objective', 'Objective', 'spend', 10)
  const creativeBreakdownTable = generateComprehensiveBreakdown(breakdownThisWeek['ad-creative'] || breakdownThisWeek.creative || [], 'Creative', 'Ad name', 'purchasesCV', 10, true)

  // Generate event analysis slides
  const twindateComparisonTable = generateEventComparisonTable(events.twindateThis || {}, events.twindateLast || {}, 'Twindate')
  const paydayComparisonTable = generateEventComparisonTable(events.paydayThis || {}, events.paydayLast || {}, 'Payday')

  const twindateHighlights = generateEventHighlights(events.twindateThis || {}, 'highlights')
  const twindateLowlights = generateEventHighlights(events.twindateThis || {}, 'lowlights')
  const paydayHighlights = generateEventHighlights(events.paydayThis || {}, 'highlights')
  const paydayLowlights = generateEventHighlights(events.paydayThis || {}, 'lowlights')

  // Generate insights based on data
  const findBestPerformer = (data: any[], metric: string) => {
    if (!data || data.length === 0) return 'N/A'
    const sorted = [...data].sort((a, b) => parseNum(b[metric]) - parseNum(a[metric]))
    return sorted[0]?.Age || sorted[0]?.Gender || sorted[0]?.Region || sorted[0]?.Platform || sorted[0]?.Placement || 'N/A'
  }

  // Helper to get top performer with metrics
  const getTopAgePerformer = () => {
    const data = breakdownThisWeek.age || []
    if (!data || data.length === 0) return { name: '25-34', spend: 0, atc: 0, roas: 0 }
    const sorted = [...data].sort((a, b) => parseNum(b['Amount spent (IDR)'] || b.spend || 0) - parseNum(a['Amount spent (IDR)'] || a.spend || 0))
    const top = sorted[0]
    const spend = parseNum(top['Amount spent (IDR)'] || top.spend || 0)
    const atc = parseNum(top['Adds to cart with shared items'] || 0)
    const purchases = parseNum(top['Purchases with shared items'] || 0)
    const purchasesCV = parseNum(top['Purchases conversion value'] || 0)
    const roas = spend > 0 ? purchasesCV / spend : 0
    return {
      name: top?.Age || '25-34',
      spend,
      atc,
      roas
    }
  }

  const topAgePerformer = getTopAgePerformer()

  // Age Insight - Comprehensive Bahasa Indonesia
  const ageInsight = `Segment usia ${topAgePerformer.name} mendominasi performa campaign dengan kontribusi spend terbesar sebesar ${formatCurrency(topAgePerformer.spend)}. Rekomendasi: Fokuskan 70-80% budget pada segment usia produktif (25-44 tahun) yang menunjukkan konversi terkuat. Pertimbangkan untuk exclude usia di atas 50+ jika ROAS di bawah target guna meningkatkan efisiensi campaign secara keseluruhan.`

  // Gender Insight - Comprehensive Bahasa Indonesia
  const getGenderDistribution = () => {
    const data = breakdownThisWeek.gender || []
    if (!data || data.length === 0) return { female: 65, male: 35 }
    const totalSpend = data.reduce((sum: number, item: any) => sum + parseNum(item['Amount spent (IDR)'] || item.spend || 0), 0)
    const female = data.find((d: any) => (d.Gender || '').toLowerCase().includes('female'))
    const male = data.find((d: any) => (d.Gender || '').toLowerCase().includes('male'))
    const femalePct = totalSpend > 0 ? (parseNum(female?.['Amount spent (IDR)'] || female?.spend || 0) / totalSpend * 100) : 65
    const malePct = 100 - femalePct
    return { female: Math.round(femalePct), male: Math.round(malePct) }
  }

  const genderDist = getGenderDistribution()
  const genderInsight = `Segmen ${genderDist.female >= 50 ? 'Perempuan' : 'Laki-laki'} mendominasi kontribusi konversi sebesar approximately ${genderDist.female >= 50 ? genderDist.female : genderDist.male}% dari total Add to Cart. Rekomendasi: Pertahankan alokasi budget ${genderDist.female >= 50 ? '65-75% Female' : '60-70% Male'} untuk reach yang efisien namun tetap pertahankan 25-35% untuk gender balancing guna mengoptimalkan market penetration.`

  // Region Insight - Comprehensive Bahasa Indonesia
  const getTopRegion = () => {
    const data = breakdownThisWeek.region || []
    if (!data || data.length === 0) return { name: 'Jakarta', contribution: 40 }
    const sorted = [...data].sort((a, b) => parseNum(b['Amount spent (IDR)'] || b.spend || 0) - parseNum(a['Amount spent (IDR)'] || a.spend || 0))
    const totalSpend = data.reduce((sum: number, item: any) => sum + parseNum(item['Amount spent (IDR)'] || item.spend || 0), 0)
    const top = sorted[0]
    const topSpend = parseNum(top['Amount spent (IDR)'] || top.spend || 0)
    const contribution = totalSpend > 0 ? (topSpend / totalSpend * 100) : 40
    return { name: top?.Region || 'Jakarta', contribution: Math.round(contribution) }
  }

  const topRegion = getTopRegion()
  const regionInsight = `Region ${topRegion.name} menjadi kontributor terbesar dengan pangsa spend sebesar ${topRegion.contribution}% dari total budget. Rekomendasi: Scale agresif di high-performing regions (Java + Jakarta) yang menyumbang 75-80% konversi sebelum expanding ke low-performing regions. Pertimbangkan geo-targeting optimization untuk exclude regions dengan ROAS < 1.0 guna meningkatkan efisiensi campaign.`

  // Platform Insight - Comprehensive Bahasa Indonesia
  const getPlatformSplit = () => {
    const data = breakdownThisWeek.platform || []
    if (!data || data.length === 0) return { ig: 70, fb: 30 }
    const totalSpend = data.reduce((sum: number, item: any) => sum + parseNum(item['Amount spent (IDR)'] || item.spend || 0), 0)
    const ig = data.find((d: any) => (d.Platform || '').toLowerCase().includes('instagram'))
    const fb = data.find((d: any) => (d.Platform || '').toLowerCase().includes('facebook'))
    const igPct = totalSpend > 0 ? (parseNum(ig?.['Amount spent (IDR)'] || ig?.spend || 0) / totalSpend * 100) : 70
    const fbPct = 100 - igPct
    return { ig: Math.round(igPct), fb: Math.round(fbPct) }
  }

  const platformSplit = getPlatformSplit()
  const platformInsight = `Instagram mendominasi performa dengan kontribusi ${platformSplit.ig}% terhadap total konversi dibanding Facebook ${platformSplit.fb}%. Rekomendasi: Pertahankan alokasi budget 60:40 atau 65:35 (Instagram:Facebook) untuk diversification yang sehat. Scale top-performing Instagram ad sets sambil tetap maintain presence di Facebook untuk reach yang lebih luas dan cost efficiency yang optimal.`

  // Placement Insight - Comprehensive Bahasa Indonesia
  const getTopPlacement = () => {
    const data = breakdownThisWeek.placement || []
    if (!data || data.length === 0) return { name: 'Instagram Reels', ctr: 1.5, roas: 2.5 }
    const sorted = [...data].sort((a, b) => parseNum(b['Amount spent (IDR)'] || b.spend || 0) - parseNum(a['Amount spent (IDR)'] || a.spend || 0))
    const top = sorted[0]
    const clicks = parseNum(top['Link clicks'] || top['Outbound clicks'] || 0)
    const impr = parseNum(top['Impressions'] || 0)
    const ctr = impr > 0 ? (clicks / impr * 100) : 1.5
    const spend = parseNum(top['Amount spent (IDR)'] || top.spend || 0)
    const cv = parseNum(top['Purchases conversion value'] || 0)
    const roas = spend > 0 ? cv / spend : 2.5
    return { name: top?.Placement || 'Instagram Reels', ctr, roas }
  }

  const topPlacement = getTopPlacement()
  const placementInsight = `Placement ${topPlacement.name} menunjukkan performa terbaik dengan CTR ${topPlacement.ctr.toFixed(2)}% dan ROAS ${topPlacement.roas.toFixed(2)}. Rekomendasi: Re-alokasi budget sesuai performa dengan 70% ke Reels (IG + FB), 25% ke Feed, dan 5% ke Stories. Scale high-ROAS placements dan pause underperforming placements untuk maximize efficiency dan achieve target CPR.`

  // Objective Insight - Comprehensive Bahasa Indonesia
  const objectiveInsight = `Campaign dengan objective OUTCOME_SALES menjadi primary driver konversi dengan contribution rate terbesar. Rekomendasi: Optimize bidding strategy berdasarkan funnel stage - gunakan Cost Cap untuk upper funnel (Add to Cart) dengan target CPA sesuai benchmark, dan Lowest Cost atau Bid Cap untuk lower funnel (Purchase) untuk maximize conversion volume. Implement value-based bidding untuk ROAS optimization pada campaigns yang sudah mature.`

  // Creative Insight - Comprehensive Bahasa Indonesia
  const getTopCreativeFormat = () => {
    const data = breakdownThisWeek['ad-creative'] || breakdownThisWeek.creative || []
    if (!data || data.length === 0) return { format: 'Collection Ads', share: 85 }
    const sorted = [...data].sort((a, b) => parseNum(b['Purchases conversion value'] || 0) - parseNum(a['Purchases conversion value'] || 0))
    const top = sorted[0]
    const totalCV = data.reduce((sum: number, item: any) => sum + parseNum(item['Purchases conversion value'] || 0), 0)
    const topCV = parseNum(top['Purchases conversion value'] || 0)
    const share = totalCV > 0 ? (topCV / totalCV * 100) : 85
    return { format: 'Collection Ads', share: Math.round(share) }
  }

  const topCreative = getTopCreativeFormat()
  const creativeInsight = `Format ${topCreative.format} mendominasi top performers dengan pangsa ${topCreative.share}% dari total Purchases Conversion Value. Rekomendasi: Scale winning collection ads dengan increase budget 20-30% sambil test variasi produk dalam collection. Pause single-image ads dengan ROAS < 1.5 dan realokasi budget ke top-performing collections. Launch 3-5 new creative variations per week untuk prevent ad fatigue dan maintain engagement levels.`

  // Event-based action plans with comprehensive Bahasa Indonesia
  const twindateActionPlan = events.twindateThis?.purchasesConversionValue > 0
    ? `Twindate campaign menunjukkan performa positif dengan Purchases CV sebesar ${formatCurrency(parseNum(events.twindateThis?.purchasesConversionValue || 0))}. Action Plan: Scale high-performing Twindate creatives dan audiences dengan increase budget 20-30% untuk next Twindate event. Prepare H-4 dengan pre-warming audiences dan test new creative variants yang aligned dengan Twindate themes. Implement bid acceleration during peak hours (H-2 to H) untuk maximize visibility dan conversion.`
    : `Twindate campaign belum menunjukkan hasil optimal dengan conversion masih di bawah target. Action Plan: Analyze underperforming elements - review creative relevance, audience targeting, dan offer competitiveness. Test minimum 3 new creative angles dengan messaging yang lebih spesifik ke Twindate. Experiment dengan limited-time offers atau exclusive deals untuk drive urgency. Review dan adjust bidding strategy untuk lebih aggressive selama Twindate period.`

  const paydayActionPlan = events.paydayThis?.roas >= 2
    ? `Payday campaign menunjukkan performa excellent dengan ROAS ${parseNum(events.paydayThis?.roas || 0).toFixed(2)} yang di atas target. Action Plan: Increase budget 25-35% selama Payday periods (dates 21-31 dan 1-5) untuk capitalize pada high purchase intent. Implement aggressive bidding strategy dengan cost cap yang di-adjust upward 15-20% selama peak Payday days. Scale winning creatives dan expand audiences ke lookalike 1-3% berdasarkan top converters dari Payday periods sebelumnya. Prepare creative inventory dengan minimum 5 fresh variants untuk prevent ad fatigue.`
    : `Payday campaign menunjukkan performa di bawah target dengan ROAS ${parseNum(events.paydayThis?.roas || 0).toFixed(2)} yang perlu dioptimasi. Action Plan: Review dan restructure campaign setup - consider splitting campaigns berdasarkan product tier dengan different bidding strategies. Test urgency-driven creative messaging seperti "Payday Special", "Limited Time Offer", atau "Flash Sale" untuk trigger immediate action. Experiment dengan different ad formats - collection ads untuk showcase multiple products, single-image ads untuk focused messaging, dan video ads untuk storytelling. Implement dayparting untuk focus budget pada high-converting hours selama Payday period.`

  // Sentiment analysis
  const sentiment = spendGrowth >= 0 && atcGrowth >= 0 ? 'positif' : spendGrowth >= 0 ? 'mixed' : 'negatif'
  const spendSentiment = spendGrowth >= 0 ? 'sebanding' : 'perlu evaluasi'
  const performanceSentiment = atcGrowth >= 0 ? 'menggembirakan' : 'perlu improvement'
  const growthSentiment = spendGrowth >= 0 ? 'pertumbuhan' : 'penurunan'
  const efficiencySentiment = thisMonthROAS >= 2 ? 'efisien' : thisMonthROAS >= 1 ? 'moderat' : 'kurang efisien'

  const conversionSentiment = thisMonthPurchases > 0 && thisMonthATC > 0
    ? `Conversion rate dari ATC ke Purchase adalah ${conversionRateThis.toFixed(1)}%`
    : 'Perlu optimalisasi funnel konversi'

  // Period labels
  const isWeek = retentionType === 'week'
  const thisPeriodLabel = isWeek ? 'Minggu Ini' : 'Bulan Ini'
  const lastPeriodLabel = isWeek ? 'Minggu Lalu' : 'Bulan Lalu'
  const periodType = isWeek ? 'Weekly' : 'Monthly'

  // Find top performer metric
  const metrics = [
    { name: 'Impressions', growth: imprGrowth },
    { name: 'Link Clicks', growth: clicksGrowth },
    { name: 'Add to Cart', growth: atcGrowth },
    { name: 'Purchases', growth: purchGrowth }
  ]
  const topPerformer = metrics.reduce((prev, current) => (prev.growth > current.growth) ? prev : current)

  const metricPerformanceDesc = atcGrowth > 50 ? 'sangat impresif dengan pertumbuhan signifikan'
    : atcGrowth > 0 ? 'positif dengan tren kenaikan'
    : 'perlu evaluasi dan optimalisasi'

  const ctrSentiment = thisMonthCTR > 1.5 ? 'CTR yang sehat' : thisMonthCTR > 1.0 ? 'CTR yang moderat' : 'CTR yang perlu dioptimasi'
  const metricsRecommendation = thisMonthCTR < 1.5
    ? 'Optimasi creative dan copywriting untuk meningkatkan CTR di atas 1.5%'
    : 'Pertahankan performa dan scale winning ad sets'

  const improvementArea = thisMonthCTR < 1.5
    ? 'CTR perlu ditingkatkan di atas 1.5% untuk efficiency lebih baik'
    : cprThisMonth > 10000
      ? 'CPR perlu ditekan di bawah Rp 10.000 untuk profitability'
      : 'Explore new placements dan platforms untuk scaling'

  const nextPeriodFocus = atcGrowth < 0
    ? 'mengembalikan performa konversi ke level positif'
    : 'scaling winning campaigns sambil mempertahankan efisiensi'

  const conversionRateWin = thisMonthATC > 0 && thisMonthPurchases > 0
    ? ((thisMonthPurchases / thisMonthATC) * 100).toFixed(1)
    : '0.0'

  // Action steps
  const actionStep1 = atcGrowth > 0
    ? `Increase budget 20-30% untuk top-performing ads dengan CPR di bawah ${formatCurrency(cprThisMonth * 1.2)}`
    : 'Identify dan pause underperforming ads, realokasi budget ke potential winners'

  const actionStep2 = thisMonthCTR < 1.5
    ? 'Refine targeting dengan exclude non-converters dan focus pada high-intent audiences'
    : 'Expand audience reach dengan lookalike audiences berdasarkan top converters'

  const actionStep3 = cprThisMonth < 5000
    ? 'Scale ke Reels dan Explore placement dengan budget allocation 70:25:5 (Reels:Feed:Stories)'
    : 'Test new creative formats dan placements untuk menemukan combination CPR terbaik'

  const actionStep4 = thisMonthPurchases === 0
    ? 'Switch ke lowest cost bidding atau cost cap dengan target CPA Rp 10.000'
    : 'Implement bid strategy berdasarkan stage funnel: cost cap untuk ATC, lowest cost untuk purchase'

  const actionStep5 = atcGrowth < 0
    ? 'Refresh 100% creative assets dengan new concepts, angles, dan formats'
    : 'Launch 3-5 new creative variations per week untuk prevent ad fatigue'

  const actionStep6 = spendGrowth > 50
    ? 'Maintain current budget allocation dengan focus 80% pada top 30% performing ad sets'
    : 'Increase total budget 20-30% dengan prioritaskan pada channels dengan CPR terbaik'

  // Next month targets
  const nextMonthTarget = atcGrowth > 0
    ? `Scale campaigns untuk mencapai ${formatNumber(thisMonthATC * 1.5)} Add to Cart`
    : `Mencapai minimal ${formatNumber(thisMonthATC * 1.2)} Add to Cart dengan optimalisasi`

  const targetGrowth = 20
  const targetCPR = cprThisMonth > 5000 ? formatCurrency(cprThisMonth * 0.8) : formatCurrency(cprThisMonth)

  // Generate report date
  const reportDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  // Growth indicator class and arrow
  const growthIndicatorClass = spendGrowth >= 0 ? 'positive' : 'negative'
  const growthArrow = spendGrowth >= 0 ? '📈' : '📉'

  // Replace all placeholders in template
  let html = CPAS_TEMPLATE
    // Slide 1 & 2
    .replace(/{REPORT_NAME}/g, reportName || 'CPAS Report')
    .replace(/{REPORT_DATE}/g, reportDate)
    .replace(/{PERIOD_LABEL}/g, `${thisPeriodLabel} vs ${lastPeriodLabel}`)
    .replace(/{THIS_PERIOD_LABEL}/g, thisPeriodLabel)
    .replace(/{LAST_PERIOD_LABEL}/g, lastPeriodLabel)
    .replace(/{PERIOD_TYPE}/g, periodType)
    .replace(/{THIS_SPEND}/g, formatCurrency(thisMonthSpend))
    .replace(/{LAST_SPEND}/g, formatLastPeriodCurrency(lastMonthSpend))
    .replace(/{THIS_ATC}/g, formatNumber(thisMonthATC))
    .replace(/{LAST_ATC}/g, formatLastPeriod(lastMonthATC))
    .replace(/{THIS_CPR}/g, formatCurrency(cprThisMonth))
    .replace(/{LAST_CPR}/g, cprLastMonth > 0 ? formatCurrency(cprLastMonth) : '-')
    .replace(/{GROWTH_COLOR}/g, spendGrowth >= 0 ? '#10B981' : '#EF4444')
    .replace(/{GROWTH_PERCENT}/g, formatGrowthForNewClient(spendGrowth))
    .replace(/{GROWTH_INDICATOR_CLASS}/g, growthIndicatorClass)
    .replace(/{GROWTH_ARROW}/g, growthArrow)
    // Slide 2 - Key Insight
    .replace(/{SPEND_SENTIMENT}/g, spendSentiment)
    .replace(/{PERFORMANCE_SENTIMENT}/g, performanceSentiment)
    .replace(/{CONVERSION_SENTIMENT}/g, conversionSentiment)
    // Slide 3 - Detailed Metrics
    .replace(/{THIS_IMPRESSIONS}/g, formatNumber(thisMonthImpressions))
    .replace(/{LAST_IMPRESSIONS}/g, formatLastPeriod(lastMonthImpressions))
    .replace(/{THIS_OUTBOUND_CLICKS}/g, formatNumber(thisMonthClicks))
    .replace(/{LAST_OUTBOUND_CLICKS}/g, formatLastPeriod(lastMonthClicks))
    .replace(/{THIS_PURCHASES}/g, formatNumber(thisMonthPurchases))
    .replace(/{LAST_PURCHASES}/g, formatLastPeriod(lastMonthPurchases))
    .replace(/{SPEND_DIFF}/g, isNewClient ? '-' : getDiffText(thisMonthSpend, lastMonthSpend))
    .replace(/{SPEND_CLASS}/g, getDiffClass(thisMonthSpend, lastMonthSpend))
    .replace(/{SPEND_BADGE_CLASS}/g, getBadgeClass(spendGrowth))
    .replace(/{SPEND_GROWTH}/g, formatGrowthForNewClient(spendGrowth))
    .replace(/{IMPR_DIFF}/g, isNewClient ? '-' : getDiffText(thisMonthImpressions, lastMonthImpressions))
    .replace(/{IMPR_CLASS}/g, getDiffClass(thisMonthImpressions, lastMonthImpressions))
    .replace(/{IMPR_BADGE_CLASS}/g, getBadgeClass(imprGrowth))
    .replace(/{IMPR_GROWTH}/g, formatGrowthForNewClient(imprGrowth))
    .replace(/{OUTBOUND_CLICKS_DIFF}/g, isNewClient ? '-' : getDiffText(thisMonthClicks, lastMonthClicks))
    .replace(/{OUTBOUND_CLICKS_CLASS}/g, getDiffClass(thisMonthClicks, lastMonthClicks))
    .replace(/{OUTBOUND_CLICKS_BADGE_CLASS}/g, getBadgeClass(clicksGrowth))
    .replace(/{OUTBOUND_CLICKS_GROWTH}/g, formatGrowthForNewClient(clicksGrowth))
    .replace(/{ATC_DIFF}/g, isNewClient ? '-' : getDiffText(thisMonthATC, lastMonthATC))
    .replace(/{ATC_CLASS}/g, getDiffClass(thisMonthATC, lastMonthATC))
    .replace(/{ATC_BADGE_CLASS}/g, getBadgeClass(atcGrowth))
    .replace(/{ATC_GROWTH}/g, formatGrowthForNewClient(atcGrowth))
    .replace(/{PURCH_DIFF}/g, isNewClient ? '-' : getDiffText(thisMonthPurchases, lastMonthPurchases))
    .replace(/{PURCH_CLASS}/g, getDiffClass(thisMonthPurchases, lastMonthPurchases))
    .replace(/{PURCH_BADGE_CLASS}/g, getBadgeClass(purchGrowth))
    .replace(/{PURCH_GROWTH}/g, formatGrowthForNewClient(purchGrowth))
    // Additional metrics
    .replace(/{LAST_CTR}/g, formatLastPeriodPercent(lastMonthCTR))
    .replace(/{THIS_CTR}/g, thisMonthCTR.toFixed(2) + '%')
    .replace(/{CTR_DIFF}/g, isNewClient ? '-' : (thisMonthCTR - lastMonthCTR >= 0 ? '+' : '') + (thisMonthCTR - lastMonthCTR).toFixed(2) + '%')
    .replace(/{CTR_CLASS}/g, getDiffClass(thisMonthCTR, lastMonthCTR))
    .replace(/{CTR_BADGE_CLASS}/g, getBadgeClass(ctrGrowth))
    .replace(/{CTR_GROWTH}/g, formatGrowthForNewClient(ctrGrowth))
    .replace(/{LAST_CPC}/g, formatLastPeriodCurrency(lastMonthCPC))
    .replace(/{THIS_CPC}/g, formatCurrency(thisMonthCPC))
    .replace(/{CPC_DIFF}/g, isNewClient ? '-' : (thisMonthCPC - lastMonthCPC >= 0 ? '+' : '') + formatCurrency(Math.abs(thisMonthCPC - lastMonthCPC)))
    .replace(/{CPC_CLASS}/g, getDiffClass(thisMonthCPC, lastMonthCPC))
    .replace(/{CPC_BADGE_CLASS}/g, getBadgeClass(cpcGrowth))
    .replace(/{CPC_GROWTH}/g, formatGrowthForNewClient(cpcGrowth))
    .replace(/{LAST_CPM}/g, formatLastPeriodCurrency(lastMonthCPM))
    .replace(/{THIS_CPM}/g, formatCurrency(thisMonthCPM))
    .replace(/{CPM_DIFF}/g, isNewClient ? '-' : (thisMonthCPM - lastMonthCPM >= 0 ? '+' : '') + formatCurrency(Math.abs(thisMonthCPM - lastMonthCPM)))
    .replace(/{CPM_CLASS}/g, getDiffClass(thisMonthCPM, lastMonthCPM))
    .replace(/{CPM_BADGE_CLASS}/g, getBadgeClass(cpmGrowth))
    .replace(/{CPM_GROWTH}/g, formatGrowthForNewClient(cpmGrowth))
    .replace(/{LAST_COST_PER_ATC}/g, formatLastPeriodCurrency(lastMonthCostPerATC))
    .replace(/{THIS_COST_PER_ATC}/g, formatCurrency(thisMonthCostPerATC))
    .replace(/{COST_PER_ATC_DIFF}/g, isNewClient ? '-' : (thisMonthCostPerATC - lastMonthCostPerATC >= 0 ? '+' : '') + formatCurrency(Math.abs(thisMonthCostPerATC - lastMonthCostPerATC)))
    .replace(/{COST_PER_ATC_CLASS}/g, getDiffClass(thisMonthCostPerATC, lastMonthCostPerATC))
    .replace(/{COST_PER_ATC_BADGE_CLASS}/g, getBadgeClass(calcGrowth(thisMonthCostPerATC, lastMonthCostPerATC)))
    .replace(/{COST_PER_ATC_GROWTH}/g, formatGrowthForNewClient(calcGrowth(thisMonthCostPerATC, lastMonthCostPerATC)))
    .replace(/{LAST_ATC_CV}/g, formatLastPeriodCurrency(lastMonthATCCV))
    .replace(/{THIS_ATC_CV}/g, formatCurrency(thisMonthATCCV))
    .replace(/{ATC_CV_DIFF}/g, isNewClient ? '-' : (thisMonthATCCV - lastMonthATCCV >= 0 ? '+' : '') + formatCurrency(Math.abs(thisMonthATCCV - lastMonthATCCV)))
    .replace(/{ATC_CV_CLASS}/g, getDiffClass(thisMonthATCCV, lastMonthATCCV))
    .replace(/{ATC_CV_BADGE_CLASS}/g, getBadgeClass(atcCVGrowth))
    .replace(/{ATC_CV_GROWTH}/g, formatGrowthForNewClient(atcCVGrowth))
    .replace(/{LAST_COST_PER_PURCHASE}/g, formatLastPeriodCurrency(lastMonthCostPerPurchase))
    .replace(/{THIS_COST_PER_PURCHASE}/g, formatCurrency(thisMonthCostPerPurchase))
    .replace(/{COST_PER_PURCHASE_DIFF}/g, isNewClient ? '-' : (thisMonthCostPerPurchase - lastMonthCostPerPurchase >= 0 ? '+' : '') + formatCurrency(Math.abs(thisMonthCostPerPurchase - lastMonthCostPerPurchase)))
    .replace(/{COST_PER_PURCHASE_CLASS}/g, getDiffClass(thisMonthCostPerPurchase, lastMonthCostPerPurchase))
    .replace(/{COST_PER_PURCHASE_BADGE_CLASS}/g, getBadgeClass(calcGrowth(thisMonthCostPerPurchase, lastMonthCostPerPurchase)))
    .replace(/{COST_PER_PURCHASE_GROWTH}/g, formatGrowthForNewClient(calcGrowth(thisMonthCostPerPurchase, lastMonthCostPerPurchase)))
    .replace(/{LAST_PURCHASE_CV}/g, formatLastPeriodCurrency(lastMonthPurchaseCV))
    .replace(/{THIS_PURCHASE_CV}/g, formatCurrency(thisMonthPurchaseCV))
    .replace(/{PURCHASE_CV_DIFF}/g, isNewClient ? '-' : (thisMonthPurchaseCV - lastMonthPurchaseCV >= 0 ? '+' : '') + formatCurrency(Math.abs(thisMonthPurchaseCV - lastMonthPurchaseCV)))
    .replace(/{PURCHASE_CV_CLASS}/g, getDiffClass(thisMonthPurchaseCV, lastMonthPurchaseCV))
    .replace(/{PURCHASE_CV_BADGE_CLASS}/g, getBadgeClass(purchaseCVGrowth))
    .replace(/{PURCHASE_CV_GROWTH}/g, formatGrowthForNewClient(purchaseCVGrowth))
    .replace(/{LAST_CONVERSION_RATE}/g, formatLastPeriodPercent(conversionRateLast))
    .replace(/{THIS_CONVERSION_RATE}/g, conversionRateThis.toFixed(2) + '%')
    .replace(/{CONVERSION_RATE_DIFF}/g, isNewClient ? '-' : (conversionRateThis - conversionRateLast >= 0 ? '+' : '') + (conversionRateThis - conversionRateLast).toFixed(2) + '%')
    .replace(/{CONVERSION_RATE_CLASS}/g, getDiffClass(conversionRateThis, conversionRateLast))
    .replace(/{CONVERSION_RATE_BADGE_CLASS}/g, getBadgeClass(conversionRateGrowth))
    .replace(/{CONVERSION_RATE_GROWTH}/g, formatGrowthForNewClient(conversionRateGrowth))
    .replace(/{LAST_ROAS}/g, isNewClient && lastMonthROAS === 0 ? '-' : lastMonthROAS.toFixed(2))
    .replace(/{THIS_ROAS}/g, thisMonthROAS.toFixed(2))
    .replace(/{ROAS_DIFF}/g, isNewClient ? '-' : (thisMonthROAS - lastMonthROAS >= 0 ? '+' : '') + (thisMonthROAS - lastMonthROAS).toFixed(2))
    .replace(/{ROAS_CLASS}/g, getDiffClass(thisMonthROAS, lastMonthROAS))
    .replace(/{ROAS_BADGE_CLASS}/g, getBadgeClass(roasGrowth))
    .replace(/{ROAS_GROWTH}/g, formatGrowthForNewClient(roasGrowth))
    .replace(/{LAST_AOV}/g, formatLastPeriodCurrency(lastMonthAOV))
    .replace(/{THIS_AOV}/g, formatCurrency(thisMonthAOV))
    .replace(/{AOV_DIFF}/g, isNewClient ? '-' : (thisMonthAOV - lastMonthAOV >= 0 ? '+' : '') + formatCurrency(Math.abs(thisMonthAOV - lastMonthAOV)))
    .replace(/{AOV_CLASS}/g, getDiffClass(thisMonthAOV, lastMonthAOV))
    .replace(/{AOV_BADGE_CLASS}/g, getBadgeClass(aovGrowth))
    .replace(/{AOV_GROWTH}/g, formatGrowthForNewClient(aovGrowth))
    .replace(/{LAST_CONTENT_VIEWS}/g, formatLastPeriod(lastMonthContentViews))
    .replace(/{THIS_CONTENT_VIEWS}/g, formatNumber(thisMonthContentViews))
    .replace(/{CONTENT_VIEWS_DIFF}/g, isNewClient ? '-' : getDiffText(thisMonthContentViews, lastMonthContentViews))
    .replace(/{CONTENT_VIEWS_CLASS}/g, getDiffClass(thisMonthContentViews, lastMonthContentViews))
    .replace(/{CONTENT_VIEWS_BADGE_CLASS}/g, getBadgeClass(calcGrowth(thisMonthContentViews, lastMonthContentViews)))
    .replace(/{CONTENT_VIEWS_GROWTH}/g, formatGrowthForNewClient(calcGrowth(thisMonthContentViews, lastMonthContentViews)))
    .replace(/{LAST_IG_PROFILE_VISITS}/g, formatLastPeriod(lastMonthIGProfileVisits))
    .replace(/{THIS_IG_PROFILE_VISITS}/g, formatNumber(thisMonthIGProfileVisits))
    .replace(/{IG_PROFILE_VISITS_DIFF}/g, isNewClient ? '-' : getDiffText(thisMonthIGProfileVisits, lastMonthIGProfileVisits))
    .replace(/{IG_PROFILE_VISITS_CLASS}/g, getDiffClass(thisMonthIGProfileVisits, lastMonthIGProfileVisits))
    .replace(/{IG_PROFILE_VISITS_BADGE_CLASS}/g, getBadgeClass(calcGrowth(thisMonthIGProfileVisits, lastMonthIGProfileVisits)))
    .replace(/{IG_PROFILE_VISITS_GROWTH}/g, formatGrowthForNewClient(calcGrowth(thisMonthIGProfileVisits, lastMonthIGProfileVisits)))
    .replace(/{LAST_IG_FOLLOWS}/g, formatLastPeriod(lastMonthIGFollows))
    .replace(/{THIS_IG_FOLLOWS}/g, formatNumber(thisMonthIGFollows))
    .replace(/{IG_FOLLOWS_DIFF}/g, isNewClient ? '-' : getDiffText(thisMonthIGFollows, lastMonthIGFollows))
    .replace(/{IG_FOLLOWS_CLASS}/g, getDiffClass(thisMonthIGFollows, lastMonthIGFollows))
    .replace(/{IG_FOLLOWS_BADGE_CLASS}/g, getBadgeClass(calcGrowth(thisMonthIGFollows, lastMonthIGFollows)))
    .replace(/{IG_FOLLOWS_GROWTH}/g, formatGrowthForNewClient(calcGrowth(thisMonthIGFollows, lastMonthIGFollows)))
    // Slide 3 - Insight
    .replace(/{METRIC_PERFORMANCE_DESC}/g, metricPerformanceDesc)
    .replace(/{TOP_PERFORMER_METRIC}/g, topPerformer.name)
    .replace(/{TOP_PERFORMER_GROWTH}/g, getGrowthText(topPerformer.growth))
    .replace(/{CTR_SENTIMENT}/g, ctrSentiment)
    .replace(/{THIS_CTR}/g, thisMonthCTR.toFixed(2))
    .replace(/{METRICS_RECOMMENDATION}/g, metricsRecommendation)
    // Slide 4 - Key Insights
    .replace(/{CPM_SENTIMENT}/g, cpmGrowth >= 0 ? 'Naik' : 'Turun')
    .replace(/{CPM_CHANGE_ABS}/g, Math.abs(cpmGrowth).toFixed(2))
    .replace(/{CPM_INSIGHT}/g, `CPM ${cpmGrowth >= 0 ? 'naik' : 'turun'} ${Math.abs(cpmGrowth).toFixed(2)}% dari Rp ${formatNumber(lastMonthCPM)} ke Rp ${formatNumber(thisMonthCPM)}`)
    .replace(/{CTR_SENTIMENT_LOW}/g, ctrGrowth >= 0 ? 'Naik' : 'Turun')
    .replace(/{CTR_CHANGE_ABS}/g, Math.abs(ctrGrowth).toFixed(2))
    .replace(/{CTR_INSIGHT}/g, lastMonthCTR > 0 ? `Dari ${lastMonthCTR.toFixed(2)}% ke ${thisMonthCTR.toFixed(2)}%` : `CTR mencapai ${thisMonthCTR.toFixed(2)}%`)
    .replace(/{CPC_SENTIMENT}/g, cpcGrowth >= 0 ? 'Naik' : 'Turun')
    .replace(/{CPC_CHANGE_ABS}/g, Math.abs(cpcGrowth).toFixed(2))
    .replace(/{CPC_INSIGHT}/g, lastMonthCPC > 0 ? `Dari Rp ${formatNumber(lastMonthCPC)} ke Rp ${formatNumber(thisMonthCPC)}` : `CPC Rp ${formatNumber(thisMonthCPC)}`)
    .replace(/{LOWLIGHT_THIRD_ITEM}/g, lastMonthATC === 0 && lastMonthPurchases === 0 ? `${lastPeriodLabel} Tanpa Konversi` : 'Perlu optimalisasi konversi')
    .replace(/{LOWLIGHT_THIRD_DETAIL}/g, lastMonthATC === 0 && lastMonthPurchases === 0 ? `Campaign ${lastPeriodLabel} belum mencapai konversi` : 'Tingkatkan conversion rate')
    .replace(/{INSIGHT_SUMMARY}/g, `Campaign performance ${thisPeriodLabel} menunjukkan ${atcGrowth >= 0 ? 'pertumbuhan positif' : 'tantangan'} dengan ${formatNumber(thisMonthATC)} Add to Cart. ${thisMonthPurchases > 0 ? `ROAS ${thisMonthROAS.toFixed(2)} menunjukkan ${thisMonthROAS >= 1 ? 'profitabilitas baik' : 'perlu improvement'}.` : 'Perlu fokus pada peningkatan conversion rate.'}`)
    // Slides 5-11: Breakdown tables
    .replace(/{AGE_BREAKDOWN_TABLE}/g, ageBreakdownTable)
    .replace(/{AGE_INSIGHT}/g, ageInsight)
    .replace(/{GENDER_BREAKDOWN_TABLE}/g, genderBreakdownTable)
    .replace(/{GENDER_INSIGHT}/g, genderInsight)
    .replace(/{REGION_BREAKDOWN_TABLE}/g, regionBreakdownTable)
    .replace(/{REGION_INSIGHT}/g, regionInsight)
    .replace(/{PLATFORM_BREAKDOWN_TABLE}/g, platformBreakdownTable)
    .replace(/{PLATFORM_INSIGHT}/g, platformInsight)
    .replace(/{PLACEMENT_BREAKDOWN_TABLE}/g, placementBreakdownTable)
    .replace(/{PLACEMENT_INSIGHT}/g, placementInsight)
    .replace(/{OBJECTIVE_BREAKDOWN_TABLE}/g, objectiveBreakdownTable)
    .replace(/{OBJECTIVE_INSIGHT}/g, objectiveInsight)
    .replace(/{CREATIVE_BREAKDOWN_TABLE}/g, creativeBreakdownTable)
    .replace(/{CREATIVE_INSIGHT}/g, creativeInsight)
    // Slides 12-13: Event analysis
    .replace(/{TWINDATE_HIGHLIGHTS}/g, twindateHighlights)
    .replace(/{TWINDATE_LOWLIGHTS}/g, twindateLowlights)
    .replace(/{TWINDATE_COMPARISON_TABLE}/g, twindateComparisonTable)
    .replace(/{TWINDATE_ACTION_PLAN}/g, twindateActionPlan)
    .replace(/{PAYDAY_HIGHLIGHTS}/g, paydayHighlights)
    .replace(/{PAYDAY_LOWLIGHTS}/g, paydayLowlights)
    .replace(/{PAYDAY_COMPARISON_TABLE}/g, paydayComparisonTable)
    .replace(/{PAYDAY_ACTION_PLAN}/g, paydayActionPlan)
    // Conclusion & Next Steps slides
    .replace(/{CONVERSION_RATE_WIN}/g, conversionRateWin)
    .replace(/{IMPROVEMENT_AREA}/g, improvementArea)
    .replace(/{NEXT_PERIOD_FOCUS}/g, nextPeriodFocus)
    .replace(/{ACTION_STEP_1}/g, actionStep1)
    .replace(/{ACTION_STEP_2}/g, actionStep2)
    .replace(/{ACTION_STEP_3}/g, actionStep3)
    .replace(/{ACTION_STEP_4}/g, actionStep4)
    .replace(/{ACTION_STEP_5}/g, actionStep5)
    .replace(/{ACTION_STEP_6}/g, actionStep6)
    .replace(/{NEXT_MONTH_TARGET}/g, nextMonthTarget)
    .replace(/{TARGET_GROWTH}/g, targetGrowth.toString())
    .replace(/{TARGET_CPR}/g, targetCPR)
    .replace(/{GROWTH_SENTIMENT}/g, growthSentiment)
    .replace(/{EFFICIENCY_SENTIMENT}/g, efficiencySentiment)

  console.log('[CPAS Template] Report generated successfully, length:', html.length)
  return html
}
