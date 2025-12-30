/**
 * Complete HTML Report Template with React + Tailwind CSS for CPAS Objective
 * Refactored to match CTWA structure - simple template strings
 * All 13 slides included
 */

export function generateReactTailwindReport(analysisData: any, reportName?: string, retentionType: string = 'wow', objectiveType: string = 'cpas'): string {
  const data = typeof analysisData === 'string' ? JSON.parse(analysisData) : analysisData

  // Extract data
  const perf = data?.performanceSummary || {}
  const thisWeek = perf.thisWeek || {}
  const lastWeek = perf.lastWeek || {}
  const breakdown = data?.breakdown || {}

  // Determine period labels based on retention type
  const isMoM = retentionType === 'mom'
  const periodLabel = isMoM ? 'Month' : 'Week'
  const periodLabelId = isMoM ? 'Bulan' : 'Minggu'
  const periodLabelEn = isMoM ? 'Month' : 'Week'
  const thisPeriodLabel = isMoM ? 'Bulan Ini (This Month)' : 'Minggu Ini (This Week)'
  const lastPeriodLabel = isMoM ? 'Bulan Lalu (Last Month)' : 'Minggu Lalu (Last Week)'
  const comparisonLabel = isMoM ? 'Month-on-Month' : 'Week-on-Week'

  // Determine objective label
  const objectiveLabels: Record<string, string> = {
    'ctwa': 'CTWA (Click to WhatsApp)',
    'cpas': 'CPAS (Collaborative Performance Advertising Solution)',
    'ctlptowa': 'CTLP to WA (Click to Landing Page to WhatsApp)'
  }
  const objectiveLabel = objectiveLabels[objectiveType] || 'CPAS (Collaborative Performance Advertising Solution)'

  // Extract client name from reportName or analysisData
  const extractClientName = (): string => {
    // Try to extract from reportName first
    if (reportName) {
      const nameLower = reportName.toLowerCase()
      // Check for common location patterns
      if (nameLower.includes('makasar') || nameLower.includes('makassar')) {
        return 'RMODA Studio Makasar'
      }
      if (nameLower.includes('bsd')) {
        return 'RMODA Studio BSD'
      }
      // If reportName contains "RMODA Studio", use it
      if (nameLower.includes('rmoda studio')) {
        // Extract the full client name from reportName
        const match = reportName.match(/RMODA\s+Studio\s+([A-Za-z\s]+)/i)
        if (match) {
          return `RMODA Studio ${match[1].trim()}`
        }
        return 'RMODA Studio'
      }
    }

    // Try to extract from analysisData if it contains file names
    const fileNames = data?.fileNames || []
    for (const fileName of fileNames) {
      const nameLower = fileName.toLowerCase()
      if (nameLower.includes('makasar') || nameLower.includes('makassar')) {
        return 'RMODA Studio Makasar'
      }
      if (nameLower.includes('bsd')) {
        return 'RMODA Studio BSD'
      }
    }

    // Default fallback
    return 'RMODA Studio'
  }

  const clientName = extractClientName()

  // Calculate growth percentage
  const calculateGrowth = (current: number | string, previous: number | string) => {
    const curr = typeof current === 'string' ? parseFloat(current.toString().replace(/,/g, '')) : (current || 0);
    const prev = typeof previous === 'string' ? parseFloat(previous.toString().replace(/,/g, '')) : (previous || 0);

    if (prev === 0) {
      return {
        value: curr,
        percent: 'N/A',
        isPositive: curr > 0
      };
    }

    const growth = curr - prev;
    const percent = ((growth / prev) * 100).toFixed(2);

    return {
      value: growth,
      percent: percent + '%',
      isPositive: growth > 0
    };
  }

  const spendGrowth = calculateGrowth(thisWeek.amountSpent || 0, lastWeek.amountSpent || 0)
  const resultsGrowth = calculateGrowth(thisWeek.purchases || 0, lastWeek.purchases || 0)
  const cpaGrowth = calculateGrowth(
    (thisWeek.purchases && thisWeek.amountSpent) ? (thisWeek.amountSpent / thisWeek.purchases) : 0,
    (lastWeek.purchases && lastWeek.amountSpent) ? (lastWeek.amountSpent / lastWeek.purchases) : 0
  )

  // Process breakdown data for slides
  const ageData = breakdown.thisWeek?.age || []
  const genderData = breakdown.thisWeek?.gender || []
  const regionData = breakdown.thisWeek?.region || []
  const platformData = breakdown.thisWeek?.platform || []
  const placementData = breakdown.thisWeek?.placement || []
  const objectiveData = breakdown.thisWeek?.objective || []
  const creativeData = breakdown.thisWeek?.['ad-creative'] || []

  return `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${comparisonLabel} Meta Ads Performance Report</title>
    <script src="https://cdn.jsdelivr.net/npm/react@18.0.0/umd/react.development.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/react-dom@18.0.0/umd/react-dom.development.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@babel/standalone/babel.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
    <link rel="stylesheet" href="/css/bootstrap-icons-custom.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; }
        .bg-hadona-blue { background-color: #2B46BB; }
        .text-hadona-blue { color: #2B46BB; }
        .bg-hadona-yellow { background-color: #ECDC43; }
        .text-hadona-yellow { color: #ECDC43; }
        .border-hadona-blue { border-color: #2B46BB; }
        .border-hadona-yellow { border-color: #ECDC43; }

        @media print {
            * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
            }
            body {
                margin: 0;
                padding: 0;
                background: white !important;
                font-size: 16px !important;
                width: 100% !important;
                overflow: visible !important;
            }
            /* Container optimization for landscape */
            .min-h-screen {
                min-height: auto !important;
                height: auto !important;
                width: 100% !important;
            }
            .max-w-6xl {
                max-width: 95% !important;
                margin-left: auto !important;
                margin-right: auto !important;
            }
            /* Remove all min-height constraints for print */
            .bg-white {
                min-height: auto !important;
                height: auto !important;
                padding: 1.5rem !important;
                width: 100% !important;
                box-sizing: border-box !important;
            }
            /* Prevent slides from being cut - force page break before each slide if needed */
            .bg-white.border-t-4 {
                page-break-before: auto !important;
                page-break-after: auto !important;
                page-break-inside: avoid !important;
                break-inside: avoid !important;
                min-height: auto !important;
                height: auto !important;
                width: 100% !important;
                orphans: 3 !important;
                widows: 3 !important;
            }
            /* Ensure each slide container doesn't break */
            .bg-white.border-t-4 > div {
                page-break-inside: avoid !important;
                break-inside: avoid !important;
            }
            /* Force page break if slide is too tall for one page */
            .bg-white.border-t-4:not(:first-child) {
                page-break-before: auto !important;
            }
            /* Grid optimization for landscape */
            .grid {
                display: grid !important;
            }
            .grid-cols-2 {
                grid-template-columns: repeat(2, 1fr) !important;
                gap: 1rem !important;
            }
            .grid-cols-3 {
                grid-template-columns: repeat(3, 1fr) !important;
                gap: 0.75rem !important;
            }
            .grid-cols-4 {
                grid-template-columns: repeat(4, 1fr) !important;
                gap: 0.75rem !important;
            }
            /* Enlarge all text sizes for presentation */
            h1 { font-size: 2.5rem !important; }
            h2 { font-size: 2rem !important; }
            h3 { font-size: 1.5rem !important; }
            h4 { font-size: 1.25rem !important; }
            .text-4xl { font-size: 2.5rem !important; }
            .text-3xl { font-size: 2rem !important; }
            .text-2xl { font-size: 1.75rem !important; }
            .text-xl { font-size: 1.5rem !important; }
            .text-lg { font-size: 1.25rem !important; }
            .text-base { font-size: 1.125rem !important; }
            .text-sm { font-size: 1rem !important; }
            .text-xs { font-size: 0.9rem !important; }
            /* Table optimization for landscape */
            table {
                font-size: 1rem !important;
                width: 100% !important;
                table-layout: auto !important;
            }
            th, td {
                font-size: 1rem !important;
                padding: 0.5rem !important;
                word-wrap: break-word !important;
            }
            /* Optimize spacing for landscape - more breathing room */
            .space-y-2 > * + * { margin-top: 0.75rem !important; }
            .space-y-3 > * + * { margin-top: 1rem !important; }
            .space-y-4 > * + * { margin-top: 1.25rem !important; }
            .mb-2 { margin-bottom: 0.75rem !important; }
            .mb-3 { margin-bottom: 1rem !important; }
            .mb-4 { margin-bottom: 1.5rem !important; }
            .mb-6 { margin-bottom: 2rem !important; }
            .mt-4 { margin-top: 1.5rem !important; }
            .mt-1 { margin-top: 0.5rem !important; }
            .p-3 { padding: 1rem !important; }
            .p-4 { padding: 1.25rem !important; }
            .p-6 { padding: 1.5rem !important; }
            .p-8 { padding: 2rem !important; }
            /* Gap optimization - more space between grid items */
            .gap-3 { gap: 1rem !important; }
            .gap-4 { gap: 1.25rem !important; }
            .gap-8 { gap: 2rem !important; }
            /* Add spacing between slides */
            .bg-white.border-t-4 {
                margin-bottom: 2rem !important;
            }
            /* Add spacing in grid containers */
            .grid {
                gap: 1rem !important;
            }
            .grid.grid-cols-2 {
                gap: 1.5rem !important;
            }
            .grid.grid-cols-3 {
                gap: 1rem !important;
            }
            .grid.grid-cols-4 {
                gap: 0.75rem !important;
            }
            /* Enlarge icons */
            .fas, .fab { font-size: 1.25rem !important; }
            /* Enlarge borders */
            .border-t-4 {
                border-top-width: 4px !important;
            }
            .border-r-2 {
                border-right-width: 2px !important;
            }
            .bg-white {
                background-color: white !important;
            }
            .bg-blue-50 {
                background-color: #eff6ff !important;
            }
            .bg-gray-50 {
                background-color: #f9fafb !important;
            }
            .bg-yellow-50 {
                background-color: #fefce8 !important;
            }
            .bg-green-50 {
                background-color: #f0fdf4 !important;
            }
            .bg-hadona-blue {
                background-color: #2B46BB !important;
            }
            .bg-hadona-yellow {
                background-color: #ECDC43 !important;
            }
            .text-hadona-blue {
                color: #2B46BB !important;
            }
            .text-hadona-yellow {
                color: #ECDC43 !important;
            }
            /* Prevent breaking inside important elements */
            table, thead, tbody, tr {
                page-break-inside: avoid !important;
                break-inside: avoid !important;
            }
            /* Prevent breaking in key sections */
            .space-y-2, .space-y-3, .space-y-4 {
                page-break-inside: avoid !important;
                break-inside: avoid !important;
            }
            /* Prevent breaking in grid items */
            .grid > div {
                page-break-inside: avoid !important;
                break-inside: avoid !important;
            }
            /* Prevent breaking in flex containers */
            .flex {
                page-break-inside: avoid !important;
                break-inside: avoid !important;
            }
            /* Ensure images don't break */
            img {
                page-break-inside: avoid !important;
                break-inside: avoid !important;
            }
            /* Image optimization */
            img {
                max-width: 100% !important;
                height: auto !important;
            }
            /* Flex optimization */
            .flex {
                display: flex !important;
            }
            /* Overflow handling */
            .overflow-x-auto {
                overflow-x: visible !important;
            }
            /* Additional rules to prevent content cutting */
            ul, ol {
                page-break-inside: avoid !important;
                break-inside: avoid !important;
            }
            li {
                page-break-inside: avoid !important;
                break-inside: avoid !important;
            }
            /* Ensure rounded boxes don't break */
            .rounded-lg, .rounded {
                page-break-inside: avoid !important;
                break-inside: avoid !important;
            }
            /* Prevent breaking in conclusion boxes */
            .bg-blue-50, .bg-yellow-50, .bg-green-50 {
                page-break-inside: avoid !important;
                break-inside: avoid !important;
            }
            /* Prevent breaking in space-y containers */
            .space-y-2, .space-y-3, .space-y-4 {
                page-break-inside: avoid !important;
                break-inside: avoid !important;
            }
            /* Ensure full slide containers don't break */
            .min-h-screen {
                page-break-inside: avoid !important;
                break-inside: avoid !important;
            }
            /* Prevent breaking in centered content */
            .text-center {
                page-break-inside: avoid !important;
                break-inside: avoid !important;
            }
            @page {
                margin: 10mm;
                size: A4 landscape;
            }
        }
    </style>
</head>
<body>
    <div id="root"></div>

    <script type="text/babel">
        const App = () => {
            const reportData = ${JSON.stringify(data)};
            const isMoM = ${JSON.stringify(isMoM)};
            const defaultReportName = isMoM ? 'Month-on-Month Report' : 'Week-on-Week Report';
            const reportName = ${JSON.stringify(reportName || (isMoM ? 'Month-on-Month Report' : 'Week-on-Week Report'))};

            const formatNumber = (num) => {
                if (!num && num !== 0) return '0';
                const n = typeof num === 'string' ? parseFloat(String(num).replace(/,/g, '')) : num;
                return isNaN(n) ? '0' : n.toLocaleString('id-ID');
            };

            const formatCurrency = (num) => {
                if (!num && num !== 0) return 'Rp 0';
                const n = typeof num === 'string' ? parseFloat(String(num).replace(/,/g, '')) : num;
                if (isNaN(n)) return 'Rp 0';
                // Don't round - preserve decimals from CSV for accuracy
                return 'Rp ' + n.toLocaleString('id-ID');
            };

            const formatPercent = (num) => {
                if (!num && num !== 0) return '0%';
                const n = typeof num === 'string' ? parseFloat(String(num).replace(/,/g, '')) : num;
                return isNaN(n) ? '0%' : n.toFixed(2) + '%';
            };

            const perf = reportData.performanceSummary || {};
            const thisWeek = perf.thisWeek || {};
            const lastWeek = perf.lastWeek || {};
            const breakdown = reportData.breakdown || {};

            const spendGrowth = {
              value: ${spendGrowth.value},
              percent: ${JSON.stringify(spendGrowth.percent)},
              isPositive: ${spendGrowth.isPositive}
            };
            const resultsGrowth = {
              value: ${resultsGrowth.value},
              percent: ${JSON.stringify(resultsGrowth.percent)},
              isPositive: ${resultsGrowth.isPositive}
            };
            const cpaGrowth = {
              value: ${cpaGrowth.value},
              percent: ${JSON.stringify(cpaGrowth.percent)},
              isPositive: ${cpaGrowth.isPositive}
            };
            const clientName = ${JSON.stringify(clientName)};
            const periodLabel = ${JSON.stringify(periodLabel)};
            const periodLabelId = ${JSON.stringify(periodLabelId)};
            const periodLabelEn = ${JSON.stringify(periodLabelEn)};
            const thisPeriodLabel = ${JSON.stringify(thisPeriodLabel)};
            const lastPeriodLabel = ${JSON.stringify(lastPeriodLabel)};
            const comparisonLabel = ${JSON.stringify(comparisonLabel)};
            const objectiveLabel = ${JSON.stringify(objectiveLabel)};

            function calculateGrowth(current, previous) {
                const curr = typeof current === 'string' ? parseFloat(current.toString().replace(/,/g, '')) : (current || 0);
                const prev = typeof previous === 'string' ? parseFloat(previous.toString().replace(/,/g, '')) : (previous || 0);

                if (prev === 0) {
                  return {
                    value: curr,
                    percent: 'N/A',
                    isPositive: curr > 0
                  };
                }

                const growth = curr - prev;
                const percent = ((growth / prev) * 100).toFixed(2);

                return {
                  value: growth,
                  percent: percent + '%',
                  isPositive: growth > 0
                };
            }

            // Helper function to get ROAS with fallback
            function getROAS(week) {
                if (week.purchaseROAS) return week.purchaseROAS;
                if (week.purchasesConversionValue && week.amountSpent) return week.purchasesConversionValue / week.amountSpent;
                return 0;
            }

            // Helper function to get AOV with fallback
            function getAOV(week) {
                if (week.aov) return week.aov;
                if (week.purchases && week.purchasesConversionValue) return week.purchasesConversionValue / week.purchases;
                return 0;
            }

            // Age data
            const ageData = ${JSON.stringify(ageData)};
            const genderData = ${JSON.stringify(genderData)};
            const regionData = ${JSON.stringify(regionData)};
            const platformData = ${JSON.stringify(platformData)};
            const placementData = ${JSON.stringify(placementData)};
            const objectiveData = ${JSON.stringify(objectiveData)};
            const creativeData = ${JSON.stringify(creativeData)};

            return (
                <div className="min-h-screen bg-gray-50">
                    {/* SLIDE 1 - WELCOME */}
                    <div className="bg-white p-8 min-h-screen flex items-center border-t-4 border-hadona-blue">
                        <div className="max-w-6xl mx-auto w-full text-center">
                            <img src="https://hadona.id/wp-content/uploads/2024/12/cropped-Hadona-Logo-1-300x300.png" alt="Hadona Logo" className="mx-auto mb-6" style={{width: '80px', height: '80px'}} />
                            <h1 className="text-4xl font-bold text-hadona-blue mb-3">{comparisonLabel} Reporting</h1>
                            <p className="text-2xl font-semibold text-hadona-blue mb-2">{objectiveLabel}</p>
                            {reportName && reportName !== defaultReportName && (
                                <p className="text-xl font-semibold text-hadona-blue mb-4">{reportName}</p>
                            )}
                            <p className="text-lg text-gray-500 mb-6">{periodLabel} vs {periodLabel}</p>
                            <div className="bg-gray-100 p-6 rounded-lg max-w-2xl mx-auto">
                                <p className="text-sm text-gray-700 font-semibold mb-2">Private & Confidential</p>
                                <p className="text-sm text-gray-600">This presentation contains proprietary insights prepared exclusively for our valued client. Redistribution or disclosure is not permitted.</p>
                            </div>
                        </div>
                    </div>

                    {/* SLIDE 2 - PERFORMANCE SUMMARY */}
                    <div className="bg-white p-8 border-t-4 border-hadona-blue">
                        <div className="max-w-6xl mx-auto">
                            <h2 className="text-2xl font-bold text-hadona-blue mb-4">Performance Summary</h2>
                            <div className="grid grid-cols-2 gap-8">
                                <div className="bg-blue-50 p-6 rounded-lg border-2 border-hadona-blue">
                                    <h3 className="text-lg font-semibold text-hadona-blue mb-3">{thisPeriodLabel}</h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between">
                                            <span>Spend</span>
                                            <span className="font-bold">{formatCurrency(thisWeek.amountSpent || 0)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Result (Purchases)</span>
                                            <span className="font-bold">{formatNumber(thisWeek.purchases || 0)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Cost per Purchase</span>
                                            <span className="font-bold">{formatCurrency((thisWeek.purchases && thisWeek.amountSpent) ? (thisWeek.amountSpent / thisWeek.purchases) : 0)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Growth %</span>
                                            <span className={\`font-bold \${spendGrowth.isPositive ? 'text-green-500' : 'text-red-500'}\`}>{spendGrowth.isPositive ? '+' : ''}{spendGrowth.percent}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-300">
                                    <h3 className="text-lg font-semibold text-gray-600 mb-3">{lastPeriodLabel}</h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between">
                                            <span>Spend</span>
                                            <span className="font-bold">{formatCurrency(lastWeek.amountSpent || 0)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Result (Purchases)</span>
                                            <span className="font-bold">{formatNumber(lastWeek.purchases || 0)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Cost per Purchase</span>
                                            <span className="font-bold">{formatCurrency((lastWeek.purchases && lastWeek.amountSpent) ? (lastWeek.amountSpent / lastWeek.purchases) : 0)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Growth %</span>
                                            <span className="font-bold text-gray-500">-</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 p-3 bg-yellow-50 rounded-lg border-l-4 border-hadona-yellow">
                                <p className="text-xs"><i className="fas fa-lightbulb text-yellow-500 mr-2"></i> <strong>Key Insight:</strong> {spendGrowth.isPositive ? 'Performance meningkat' : 'Performance menurun'} {spendGrowth.percent} dengan {resultsGrowth.isPositive ? 'peningkatan' : 'penurunan'} {resultsGrowth.percent} purchases dan efisiensi cost yang {cpaGrowth.value <= 0 ? 'lebih baik' : 'perlu optimasi'}.</p>
                            </div>
                        </div>
                    </div>

                    {/* SLIDE 3 - TABEL RINGKASAN METRIK */}
                    <div className="bg-white p-8 border-t-4 border-hadona-blue">
                        <div className="max-w-6xl mx-auto">
                            <h2 className="text-2xl font-bold text-hadona-blue mb-4">Tabel Ringkasan Metrik</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse border border-gray-300 text-sm">
                                    <thead>
                                        <tr className="bg-hadona-blue text-white">
                                            <th className="border border-gray-300 p-2 text-left text-xs">Metrik</th>
                                            <th className="border border-gray-300 p-2 text-right text-xs">{lastPeriodLabel}</th>
                                            <th className="border border-gray-300 p-2 text-right text-xs">{thisPeriodLabel}</th>
                                            <th className="border border-gray-300 p-2 text-right text-xs">Trending Value</th>
                                            <th className="border border-gray-300 p-2 text-right text-xs">Trending %</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="border border-gray-300 p-2 text-xs">Amount Spent</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatCurrency(lastWeek.amountSpent || 0)}</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatCurrency(thisWeek.amountSpent || 0)}</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatCurrency((thisWeek.amountSpent || 0) - (lastWeek.amountSpent || 0))}</td>
                                            <td className={\`border border-gray-300 p-2 text-right text-xs \${spendGrowth.isPositive ? 'text-green-500' : 'text-red-500'}\`}>{spendGrowth.isPositive ? '+' : ''}{spendGrowth.percent}</td>
                                        </tr>
                                        <tr className="bg-gray-50">
                                            <td className="border border-gray-300 p-2 text-xs">Purchases</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatNumber(lastWeek.purchases || 0)}</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatNumber(thisWeek.purchases || 0)}</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatNumber((thisWeek.purchases || 0) - (lastWeek.purchases || 0))}</td>
                                            <td className={\`border border-gray-300 p-2 text-right text-xs \${resultsGrowth.isPositive ? 'text-green-500' : 'text-red-500'}\`}>{resultsGrowth.isPositive ? '+' : ''}{resultsGrowth.percent}</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 p-2 text-xs">Cost per Purchase</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatCurrency((lastWeek.purchases && lastWeek.amountSpent) ? (lastWeek.amountSpent / lastWeek.purchases) : 0)}</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatCurrency((thisWeek.purchases && thisWeek.amountSpent) ? (thisWeek.amountSpent / thisWeek.purchases) : 0)}</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatCurrency(((thisWeek.purchases && thisWeek.amountSpent) ? (thisWeek.amountSpent / thisWeek.purchases) : 0) - ((lastWeek.purchases && lastWeek.amountSpent) ? (lastWeek.amountSpent / lastWeek.purchases) : 0))}</td>
                                            <td className={\`border border-gray-300 p-2 text-right text-xs \${cpaGrowth.value <= 0 ? 'text-green-500' : 'text-red-500'}\`}>{cpaGrowth.value <= 0 ? '' : '+'}{cpaGrowth.percent}</td>
                                        </tr>
                                        <tr className="bg-gray-50">
                                            <td className="border border-gray-300 p-2 text-xs">ROAS</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{getROAS(lastWeek).toFixed(2)}x</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{getROAS(thisWeek).toFixed(2)}x</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{(getROAS(thisWeek) - getROAS(lastWeek)).toFixed(2)}x</td>
                                            <td className={\`border border-gray-300 p-2 text-right text-xs \${getROAS(thisWeek) >= getROAS(lastWeek) ? 'text-green-500' : 'text-red-500'}\`}>{getROAS(thisWeek) >= getROAS(lastWeek) ? '+' : ''}{formatPercent(calculateGrowth(getROAS(thisWeek), getROAS(lastWeek)))}</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 p-2 text-xs">Impressions</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatNumber(lastWeek.impressions || 0)}</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatNumber(thisWeek.impressions || 0)}</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatNumber((thisWeek.impressions || 0) - (lastWeek.impressions || 0))}</td>
                                            <td className={\`border border-gray-300 p-2 text-right text-xs \${(thisWeek.impressions || 0) >= (lastWeek.impressions || 0) ? 'text-green-500' : 'text-red-500'}\`}>{(thisWeek.impressions || 0) >= (lastWeek.impressions || 0) ? '+' : ''}{formatPercent(calculateGrowth(thisWeek.impressions || 0, lastWeek.impressions || 0))}</td>
                                        </tr>
                                        <tr className="bg-gray-50">
                                            <td className="border border-gray-300 p-2 text-xs">Reach</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatNumber(lastWeek.reach || 0)}</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatNumber(thisWeek.reach || 0)}</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatNumber((thisWeek.reach || 0) - (lastWeek.reach || 0))}</td>
                                            <td className={\`border border-gray-300 p-2 text-right text-xs \${(thisWeek.reach || 0) >= (lastWeek.reach || 0) ? 'text-green-500' : 'text-red-500'}\`}>{(thisWeek.reach || 0) >= (lastWeek.reach || 0) ? '+' : ''}{formatPercent(calculateGrowth(thisWeek.reach || 0, lastWeek.reach || 0))}</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 p-2 text-xs">Link Clicks</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatNumber(lastWeek.linkClicks || 0)}</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatNumber(thisWeek.linkClicks || 0)}</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatNumber((thisWeek.linkClicks || 0) - (lastWeek.linkClicks || 0))}</td>
                                            <td className={\`border border-gray-300 p-2 text-right text-xs \${(thisWeek.linkClicks || 0) >= (lastWeek.linkClicks || 0) ? 'text-green-500' : 'text-red-500'}\`}>{(thisWeek.linkClicks || 0) >= (lastWeek.linkClicks || 0) ? '+' : ''}{formatPercent(calculateGrowth(thisWeek.linkClicks || 0, lastWeek.linkClicks || 0))}</td>
                                        </tr>
                                        <tr className="bg-gray-50">
                                            <td className="border border-gray-300 p-2 text-xs">CTR (Link)</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatPercent((lastWeek.ctr || 0) * 100)}</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatPercent((thisWeek.ctr || 0) * 100)}</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatPercent(((thisWeek.ctr || 0) - (lastWeek.ctr || 0)) * 100)}</td>
                                            <td className={\`border border-gray-300 p-2 text-right text-xs \${(thisWeek.ctr || 0) >= (lastWeek.ctr || 0) ? 'text-green-500' : 'text-red-500'}\`}>{(thisWeek.ctr || 0) >= (lastWeek.ctr || 0) ? '+' : ''}{formatPercent(calculateGrowth((thisWeek.ctr || 0) * 100, (lastWeek.ctr || 0) * 100))}</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 p-2 text-xs">CPC (Link)</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatCurrency(lastWeek.cpc || 0)}</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatCurrency(thisWeek.cpc || 0)}</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatCurrency((thisWeek.cpc || 0) - (lastWeek.cpc || 0))}</td>
                                            <td className={\`border border-gray-300 p-2 text-right text-xs \${(thisWeek.cpc || 0) <= (lastWeek.cpc || 0) ? 'text-green-500' : 'text-red-500'}\`}>{(thisWeek.cpc || 0) <= (lastWeek.cpc || 0) ? '' : '+'}{formatPercent(calculateGrowth(thisWeek.cpc || 0, lastWeek.cpc || 0))}</td>
                                        </tr>
                                        <tr className="bg-gray-50">
                                            <td className="border border-gray-300 p-2 text-xs">CPM</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatCurrency(lastWeek.cpm || 0)}</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatCurrency(thisWeek.cpm || 0)}</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatCurrency((thisWeek.cpm || 0) - (lastWeek.cpm || 0))}</td>
                                            <td className={\`border border-gray-300 p-2 text-right text-xs \${(thisWeek.cpm || 0) <= (lastWeek.cpm || 0) ? 'text-green-500' : 'text-red-500'}\`}>{(thisWeek.cpm || 0) <= (lastWeek.cpm || 0) ? '' : '+'}{formatPercent(calculateGrowth(thisWeek.cpm || 0, lastWeek.cpm || 0))}</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 p-2 text-xs">Frequency</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatNumber(lastWeek.frequency || 0)}</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatNumber(thisWeek.frequency || 0)}</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatNumber((thisWeek.frequency || 0) - (lastWeek.frequency || 0))}</td>
                                            <td className={\`border border-gray-300 p-2 text-right text-xs \${(thisWeek.frequency || 0) >= (lastWeek.frequency || 0) ? 'text-green-500' : 'text-red-500'}\`}>{(thisWeek.frequency || 0) >= (lastWeek.frequency || 0) ? '+' : ''}{formatPercent(calculateGrowth(thisWeek.frequency || 0, lastWeek.frequency || 0))}</td>
                                        </tr>
                                        <tr className="bg-gray-50">
                                            <td className="border border-gray-300 p-2 text-xs">Avg Order Value</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatCurrency(getAOV(lastWeek))}</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatCurrency(getAOV(thisWeek))}</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatCurrency(getAOV(thisWeek) - getAOV(lastWeek))}</td>
                                            <td className={\`border border-gray-300 p-2 text-right text-xs \${getAOV(thisWeek) >= getAOV(lastWeek) ? 'text-green-500' : 'text-red-500'}\`}>{getAOV(thisWeek) >= getAOV(lastWeek) ? '+' : ''}{formatPercent(calculateGrowth(getAOV(thisWeek), getAOV(lastWeek)))}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-4 space-y-2">
                                <div className="p-3 bg-blue-50 rounded-lg">
                                    <div className="flex items-start">
                                        <i className="fas fa-chart-line text-blue-500 mr-2 mt-0.5"></i>
                                        <div className="flex-1">
                                            <p className="text-xs"><strong>Kesimpulan:</strong> {spendGrowth.isPositive ? 'Peningkatan' : 'Penurunan'} performa {spendGrowth.percent} di semua metrik.</p>
                                            <p className="text-xs mt-1">{resultsGrowth.isPositive ? 'Purchases' : 'Cost efficiency'} menjadi {resultsGrowth.isPositive ? 'driver utama' : 'area perbaikan'} ${isMoM ? 'bulan' : 'minggu'} ini.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-3 bg-green-50 rounded-lg">
                                    <div className="flex items-start">
                                        <i className="fas fa-lightbulb text-green-500 mr-2 mt-0.5"></i>
                                        <div className="flex-1">
                                            <p className="text-xs"><strong>Rekomendasi:</strong> {spendGrowth.isPositive ? 'Pertahankan momentum dengan' : 'Fokus pada optimasi'} {resultsGrowth.isPositive ? 'scaling budget ke performa terbaik' : 'cost efficiency dan targeting'}.</p>
                                            <p className="text-xs mt-1">Monitor metrik kunci secara berkala untuk memastikan growth berkelanjutan.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SLIDE 4 - WEEK-ON-WEEK ANALYSIS */}
                    <div className="bg-white p-8 border-t-4 border-hadona-blue">
                        <div className="max-w-6xl mx-auto">
                            <h2 className="text-2xl font-bold text-hadona-blue mb-4">{comparisonLabel} Analysis</h2>
                            <div className="grid grid-cols-2 gap-0">
                                <div className="border-r-2 border-gray-300 pr-6">
                                    <h3 className="text-lg font-semibold text-green-600 mb-3"><i className="fas fa-arrow-up mr-2"></i>Highlight</h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-start">
                                            <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                                            <span><strong>Purchases</strong> {resultsGrowth.isPositive ? 'meningkat' : 'menurun'} {resultsGrowth.percent} dengan {resultsGrowth.isPositive ? 'peningkatan' : 'penurunan'} konversi</span>
                                        </li>
                                        <li className="flex items-start">
                                            <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                                            <span><strong>ROAS</strong> {getROAS(thisWeek) >= getROAS(lastWeek) ? 'meningkat' : 'stabil'} di {getROAS(thisWeek).toFixed(2)}x dengan {resultsGrowth.isPositive ? 'scaling' : 'maintaining'} budget</span>
                                        </li>
                                        <li className="flex items-start">
                                            <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                                            <span><strong>Click-Through Rate</strong> {thisWeek.ctr >= lastWeek.ctr ? 'stabil' : 'meningkat'} di {formatPercent((thisWeek.ctr || 0) * 100)} meskipun impressions {thisWeek.impressions >= lastWeek.impressions ? 'meningkat' : 'menurun'}</span>
                                        </li>
                                        <li className="flex items-start">
                                            <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                                            <span><strong>Budget Utilization</strong> optimal dengan spend {spendGrowth.isPositive ? 'meningkat' : 'menurun'} {spendGrowth.percent}</span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="pl-6">
                                    <h3 className="text-lg font-semibold text-red-600 mb-3"><i className="fas fa-arrow-down mr-2"></i>Lowlight</h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-start">
                                            <i className="fas fa-exclamation-circle text-red-500 mt-1 mr-2"></i>
                                            <span><strong>CPC Link</strong> {thisWeek.cpc > lastWeek.cpc ? 'meningkat' : 'stabil'} {thisWeek.cpc > lastWeek.cpc ? 'meskipun hasil baik' : ''}</span>
                                        </li>
                                        <li className="flex items-start">
                                            <i className="fas fa-exclamation-circle text-red-500 mt-1 mr-2"></i>
                                            <span><strong>Impressions</strong> {thisWeek.impressions < lastWeek.impressions ? 'menurun' : 'meningkat'} {Math.abs(calculateGrowth(thisWeek.impressions || 0, lastWeek.impressions || 0)).toFixed(1)}% {thisWeek.impressions < lastWeek.impressions ? 'perlu optimasi targeting' : ''}</span>
                                        </li>
                                        <li className="flex items-start">
                                            <i className="fas fa-exclamation-circle text-red-500 mt-1 mr-2"></i>
                                            <span><strong>Frequency</strong> {thisWeek.frequency > lastWeek.frequency ? 'meningkat' : 'stabil'} {thisWeek.frequency > lastWeek.frequency ? '- perlu monitor ad fatigue' : ''}</span>
                                        </li>
                                        <li className="flex items-start">
                                            <i className="fas fa-exclamation-circle text-red-500 mt-1 mr-2"></i>
                                            <span><strong>Reach</strong> {thisWeek.reach < lastWeek.reach ? 'menurun' : 'meningkat'} {thisWeek.reach < lastWeek.reach ? '- perlu expand audience' : ''}</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="mt-4 space-y-2">
                                <div className="p-3 bg-yellow-50 rounded-lg">
                                    <div className="flex items-start">
                                        <i className="fas fa-lightbulb text-yellow-500 mr-2 mt-0.5"></i>
                                        <div className="flex-1">
                                            <p className="text-xs"><strong>Kesimpulan:</strong> Fokus optimasi {thisWeek.cpc > lastWeek.cpc ? 'CPC' : 'CTR'} untuk efisiensi sambil {thisWeek.impressions < lastWeek.impressions ? 'expand reach' : 'maintain reach'}.</p>
                                            <p className="text-xs mt-1">Growth berkelanjutan memerlukan monitoring metrik kunci secara berkala dan penyesuaian strategi.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-3 bg-green-50 rounded-lg">
                                    <div className="flex items-start">
                                        <i className="fas fa-lightbulb text-green-500 mr-2 mt-0.5"></i>
                                        <div className="flex-1">
                                            <p className="text-xs"><strong>Rekomendasi:</strong> {thisWeek.cpc > lastWeek.cpc ? 'Optimasi CPC dengan testing creative dan targeting untuk menurunkan cost.' : 'Tingkatkan CTR dengan testing creative dan optimasi placement.'}</p>
                                            <p className="text-xs mt-1">{thisWeek.impressions < lastWeek.impressions ? 'Ekspansi reach dengan penambahan audience dan budget untuk meningkatkan exposure.' : 'Pertahankan reach sambil fokus pada optimasi conversion rate dan cost efficiency.'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    ${generateBreakdownSlides(breakdown, thisWeek, lastWeek, thisPeriodLabel, lastPeriodLabel)}

                    {/* SLIDE 13 - THANK YOU */}
                    <div className="bg-white p-8 border-t-4 border-hadona-blue min-h-screen flex items-center">
                        <div className="max-w-6xl mx-auto w-full text-center">
                            <img src="https://hadona.id/wp-content/uploads/2024/12/cropped-Hadona-Logo-1-300x300.png" alt="Hadona Logo" className="mx-auto mb-6" style={{width: '100px', height: '100px'}} />
                            <h2 className="text-4xl font-bold text-hadona-blue mb-6">Terima Kasih</h2>
                            <div className="space-y-3 mb-6">
                                <p className="text-xl"><i className="fab fa-instagram text-purple-500 mr-2"></i> Instagram: @hadona.id</p>
                                <p className="text-xl"><i className="fab fa-tiktok text-black mr-2"></i> TikTok: @hadona.id</p>
                                <p className="text-xl"><i className="fas fa-globe text-blue-500 mr-2"></i> Website: www.hadona.id</p>
                            </div>
                            <div className="mt-8 pt-6 border-t border-gray-300">
                                <p className="text-sm text-gray-500">Powered by <span className="font-semibold text-gray-700">Hadona Digital Media</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            );
        };

        ReactDOM.render(<App />, document.getElementById('root'));
    </script>
</body>
</html>`
}

function generateBreakdownSlides(breakdown: any, thisWeek: any, lastWeek: any, thisPeriodLabel: string, lastPeriodLabel: string): string {
  let slides = ''

  // Slide 5: Age Performance
  const ageThisWeek = breakdown.thisWeek?.age || []
  const ageLastWeek = breakdown.lastWeek?.age || []

  if (ageThisWeek.length > 0 || ageLastWeek.length > 0) {
    // Sort by purchases (highest first)
    const sortedAge = [...ageThisWeek]
      .filter((a: any) => a.Age && a.Age.trim())
      .sort((a: any, b: any) => {
        const resultA = a['Purchases with shared items'] || a['Purchases'] || 0
        const resultB = b['Purchases with shared items'] || b['Purchases'] || 0
        return resultB - resultA
      })
      .slice(0, 6)

    slides += `
                    {/* SLIDE 5 - AUDIENCE PERFORMANCE: AGE */}
                    <div className="bg-white p-8 border-t-4 border-hadona-blue">
                        <div className="max-w-6xl mx-auto">
                            <h2 className="text-2xl font-bold text-hadona-blue mb-4">Audience Performance: Age</h2>
                            <div className="grid grid-cols-2 gap-0">
                                <div className="border-r-2 border-gray-300 pr-6">
                                    <h3 className="text-base font-semibold mb-3">Total Purchases</h3>
                                    <div className="space-y-2">
                                        ${sortedAge.map((item: any) => {
          const age = item.Age || 'Unknown'
          const result = item['Purchases with shared items'] || item['Purchases'] || 0
          return `<div className="flex justify-between items-center">
                                            <span className="text-xs">${age}</span>
                                            <span className="font-bold text-xs">{formatNumber(${result})}</span>
                                        </div>`
        }).join('')}
                                    </div>
                                </div>
                                <div className="pl-6">
                                    <h3 className="text-base font-semibold mb-3">CPA (Cost Per Purchase)</h3>
                                    <div className="space-y-2">
                                        ${sortedAge.map((item: any) => {
          const age = item.Age || 'Unknown'
          const purchases = item['Purchases with shared items'] || item['Purchases'] || 0
          const amountSpent = item['Amount spent (IDR)'] || item['Amount spent'] || 0
          const cpa = purchases > 0 ? (amountSpent / purchases) : 0
          return `<div className="flex justify-between items-center">
                                            <span className="text-xs">${age}</span>
                                            <span className="font-bold text-xs">{formatCurrency(${cpa})}</span>
                                        </div>`
        }).join('')}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 space-y-2">
                                <div className="p-3 bg-blue-50 rounded-lg">
                                    <div className="flex items-start">
                                        <i className="fas fa-users text-blue-500 mr-2 mt-0.5"></i>
                                        <div className="flex-1">
                                            <p className="text-xs"><strong>Kesimpulan:</strong> ${sortedAge.length > 0 ? 'Demografi ' + sortedAge[0].Age + ' menghasilkan ' + (sortedAge[0]['Purchases with shared items'] || sortedAge[0]['Purchases'] || 0) + ' purchases dengan CPA terendah.' : 'Data age breakdown menunjukkan variasi performa signifikan.'}</p>
                                            <p className="text-xs mt-1">${sortedAge.length > 0 ? 'Segment ini menjadi pilihan terbaik untuk optimasi budget dan scaling.' : 'Perlu analisis lebih lanjut untuk identifikasi segment terbaik.'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-3 bg-green-50 rounded-lg">
                                    <div className="flex items-start">
                                        <i className="fas fa-lightbulb text-green-500 mr-2 mt-0.5"></i>
                                        <div className="flex-1">
                                            <p className="text-xs"><strong>Rekomendasi:</strong> ${sortedAge.length > 0 ? 'Alokasikan lebih banyak budget ke demografi ' + sortedAge[0].Age + ' untuk hasil optimal.' : 'Lakukan A/B testing pada berbagai segment age untuk menemukan performa terbaik.'}</p>
                                            <p className="text-xs mt-1">Pertimbangkan ekspansi ke segment age serupa dengan performa baik untuk meningkatkan reach dan purchases.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`
  }

  // Slide 6: Gender Performance
  const genderThisWeek = breakdown.thisWeek?.gender || []
  if (genderThisWeek.length > 0) {
    // Sort by impressions (highest first)
    const sortedGender = [...genderThisWeek]
      .filter((g: any) => g.Gender && g.Gender.trim())
      .sort((a: any, b: any) => {
        const impA = a.Impressions || 0
        const impB = b.Impressions || 0
        return impB - impA
      })

    slides += `
                    {/* SLIDE 6 - AUDIENCE PERFORMANCE: GENDER */}
                    <div className="bg-white p-8 border-t-4 border-hadona-blue">
                        <div className="max-w-6xl mx-auto">
                            <h2 className="text-2xl font-bold text-hadona-blue mb-4">Audience Performance: Gender</h2>
                            <div className="grid grid-cols-3 gap-0">
                                <div className="border-r-2 border-gray-300 pr-4">
                                    <h3 className="text-base font-semibold mb-3">Impressions</h3>
                                    <div className="space-y-2">
                                        ${sortedGender.map((item: any) => {
          const gender = item.Gender || 'Unknown'
          const impressions = item.Impressions || 0
          return `<div className="flex justify-between items-center">
                                            <span className="text-xs">${gender}</span>
                                            <span className="font-bold text-xs">{formatNumber(${impressions})}</span>
                                        </div>`
        }).join('')}
                                    </div>
                                </div>
                                <div className="border-r-2 border-gray-300 px-4">
                                    <h3 className="text-base font-semibold mb-3">Outbound Click</h3>
                                    <div className="space-y-2">
                                        ${sortedGender.map((item: any) => {
          const gender = item.Gender || 'Unknown'
          const clicks = item['Outbound clicks'] || 0
          return `<div className="flex justify-between items-center">
                                            <span className="text-xs">${gender}</span>
                                            <span className="font-bold text-xs">{formatNumber(${clicks})}</span>
                                        </div>`
        }).join('')}
                                    </div>
                                </div>
                                <div className="pl-4">
                                    <h3 className="text-base font-semibold mb-3">CTR (Link)</h3>
                                    <div className="space-y-2">
                                        ${sortedGender.map((item: any) => {
          const gender = item.Gender || 'Unknown'
          const ctr = (item['CTR (link click-through rate)'] || 0) * 100
          return `<div className="flex justify-between items-center">
                                            <span className="text-xs">${gender}</span>
                                            <span className="font-bold text-xs">{formatPercent(${ctr})}</span>
                                        </div>`
        }).join('')}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 space-y-2">
                                <div className="p-3 bg-blue-50 rounded-lg">
                                    <div className="flex items-start">
                                        <i className="fas fa-venus-mars text-blue-500 mr-2 mt-0.5"></i>
                                        <div className="flex-1">
                                            <p className="text-xs"><strong>Kesimpulan:</strong> ${sortedGender.length > 0 ? sortedGender[0].Gender + ' menghasilkan impressions tertinggi dengan CTR ' + ((sortedGender[0]['CTR (link click-through rate)'] || 0) * 100).toFixed(2) + '%.' : 'Gender breakdown menunjukkan variasi performa signifikan antar segment.'}</p>
                                            <p className="text-xs mt-1">${sortedGender.length > 0 ? 'Segment ini menunjukkan engagement lebih tinggi dibanding segment lainnya.' : 'Perlu analisis lebih lanjut untuk identifikasi segment terbaik.'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-3 bg-green-50 rounded-lg">
                                    <div className="flex items-start">
                                        <i className="fas fa-lightbulb text-green-500 mr-2 mt-0.5"></i>
                                        <div className="flex-1">
                                            <p className="text-xs"><strong>Rekomendasi:</strong> ${sortedGender.length > 0 ? 'Fokus targeting pada segment ' + sortedGender[0].Gender + ' untuk optimasi budget dan hasil maksimal.' : 'Lakukan testing pada berbagai segment gender untuk menemukan performa terbaik.'}</p>
                                            <p className="text-xs mt-1">Pertimbangkan ekspansi ke segment gender lain dengan performa baik untuk diversifikasi audience.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`
  }

  // Slide 7: Region Performance
  const regionThisWeek = breakdown.thisWeek?.region || []
  if (regionThisWeek.length > 0) {
    // Sort by impressions (highest first)
    const sortedRegion = [...regionThisWeek]
      .filter((r: any) => r.Region && r.Region.trim())
      .sort((a: any, b: any) => {
        const impA = a.Impressions || 0
        const impB = b.Impressions || 0
        return impB - impA
      })
      .slice(0, 5)

    slides += `
                    {/* SLIDE 7 - AUDIENCE PERFORMANCE: REGION */}
                    <div className="bg-white p-8 border-t-4 border-hadona-blue">
                        <div className="max-w-6xl mx-auto">
                            <h2 className="text-2xl font-bold text-hadona-blue mb-4">Audience Performance: Region</h2>
                            <div className="grid grid-cols-3 gap-0">
                                <div className="border-r-2 border-gray-300 pr-4">
                                    <h3 className="text-base font-semibold mb-3">Impressions</h3>
                                    <div className="space-y-2">
                                        ${sortedRegion.map((item: any) => {
          const region = item.Region || 'Unknown'
          const impressions = item.Impressions || 0
          return `<div className="flex justify-between items-center">
                                            <span className="text-xs">${region}</span>
                                            <span className="font-bold text-xs">{formatNumber(${impressions})}</span>
                                        </div>`
        }).join('')}
                                    </div>
                                </div>
                                <div className="border-r-2 border-gray-300 px-4">
                                    <h3 className="text-base font-semibold mb-3">Link Click</h3>
                                    <div className="space-y-2">
                                        ${sortedRegion.map((item: any) => {
          const region = item.Region || 'Unknown'
          const clicks = item['Outbound clicks'] || 0
          return `<div className="flex justify-between items-center">
                                            <span className="text-xs">${region}</span>
                                            <span className="font-bold text-xs">{formatNumber(${clicks})}</span>
                                        </div>`
        }).join('')}
                                    </div>
                                </div>
                                <div className="pl-4">
                                    <h3 className="text-base font-semibold mb-3">CTR (Link)</h3>
                                    <div className="space-y-2">
                                        ${sortedRegion.map((item: any) => {
          const region = item.Region || 'Unknown'
          const ctr = (item['CTR (link click-through rate)'] || 0) * 100
          return `<div className="flex justify-between items-center">
                                            <span className="text-xs">${region}</span>
                                            <span className="font-bold text-xs">{formatPercent(${ctr})}</span>
                                        </div>`
        }).join('')}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 space-y-2">
                                <div className="p-3 bg-blue-50 rounded-lg">
                                    <div className="flex items-start">
                                        <i className="fas fa-map-marker-alt text-blue-500 mr-2 mt-0.5"></i>
                                        <div className="flex-1">
                                            <p className="text-xs"><strong>Kesimpulan:</strong> ${sortedRegion.length > 0 ? sortedRegion[0].Region + ' menghasilkan impressions tertinggi dengan CTR ' + ((sortedRegion[0]['CTR (link click-through rate)'] || 0) * 100).toFixed(2) + '%.' : 'Region breakdown menunjukkan variasi performa signifikan antar lokasi.'}</p>
                                            <p className="text-xs mt-1">${sortedRegion.length > 0 ? 'Region ini menjadi pilihan terbaik untuk fokus targeting dan optimasi budget.' : 'Perlu analisis lebih lanjut untuk identifikasi region terbaik.'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-3 bg-green-50 rounded-lg">
                                    <div className="flex items-start">
                                        <i className="fas fa-lightbulb text-green-500 mr-2 mt-0.5"></i>
                                        <div className="flex-1">
                                            <p className="text-xs"><strong>Rekomendasi:</strong> ${sortedRegion.length > 0 ? 'Alokasikan lebih banyak budget ke region ' + sortedRegion[0].Region + ' untuk hasil optimal.' : 'Lakukan testing pada berbagai region untuk menemukan performa terbaik.'}</p>
                                            <p className="text-xs mt-1">Pertimbangkan ekspansi ke region serupa dengan performa baik untuk meningkatkan reach dan diversifikasi.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`
  }

  // Slide 8: Platform Performance
  const platformThisWeek = breakdown.thisWeek?.platform || []
  if (platformThisWeek.length > 0) {
    // Sort by purchases (highest first)
    const sortedPlatform = [...platformThisWeek]
      .filter((p: any) => p.Platform && p.Platform.trim())
      .sort((a: any, b: any) => {
        const convA = a['Purchases with shared items'] || a['Purchases'] || 0
        const convB = b['Purchases with shared items'] || b['Purchases'] || 0
        return convB - convA
      })

    slides += `
                    {/* SLIDE 8 - PLATFORM PERFORMANCE */}
                    <div className="bg-white p-8 border-t-4 border-hadona-blue">
                        <div className="max-w-6xl mx-auto">
                            <h2 className="text-2xl font-bold text-hadona-blue mb-4">Platform Performance</h2>
                            <div className="grid grid-cols-3 gap-0">
                                <div className="border-r-2 border-gray-300 pr-4">
                                    <h3 className="text-base font-semibold mb-3">Purchases</h3>
                                    <div className="space-y-2">
                                        ${sortedPlatform.map((item: any) => {
          const platform = item.Platform || 'Unknown'
          const conv = item['Purchases with shared items'] || item['Purchases'] || 0
          return `<div className="flex justify-between items-center">
                                            <span className="text-xs">${platform}</span>
                                            <span className="font-bold text-xs">{formatNumber(${conv})}</span>
                                        </div>`
        }).join('')}
                                    </div>
                                </div>
                                <div className="border-r-2 border-gray-300 px-4">
                                    <h3 className="text-base font-semibold mb-3">Impressions</h3>
                                    <div className="space-y-2">
                                        ${sortedPlatform.map((item: any) => {
          const platform = item.Platform || 'Unknown'
          const impressions = item.Impressions || 0
          return `<div className="flex justify-between items-center">
                                            <span className="text-xs">${platform}</span>
                                            <span className="font-bold text-xs">{formatNumber(${impressions})}</span>
                                        </div>`
        }).join('')}
                                    </div>
                                </div>
                                <div className="pl-4">
                                    <h3 className="text-base font-semibold mb-3">CTR (Link)</h3>
                                    <div className="space-y-2">
                                        ${sortedPlatform.map((item: any) => {
          const platform = item.Platform || 'Unknown'
          const ctr = (item['CTR (link click-through rate)'] || 0) * 100
          return `<div className="flex justify-between items-center">
                                            <span className="text-xs">${platform}</span>
                                            <span className="font-bold text-xs">{formatPercent(${ctr})}</span>
                                        </div>`
        }).join('')}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 space-y-2">
                                <div className="p-3 bg-blue-50 rounded-lg">
                                    <div className="flex items-start">
                                        <i className="fab fa-instagram text-purple-500 mr-2 mt-0.5"></i>
                                        <div className="flex-1">
                                            <p className="text-xs"><strong>Kesimpulan:</strong> ${sortedPlatform.length > 0 ? sortedPlatform[0].Platform + ' menghasilkan purchases tertinggi dengan CTR ' + ((sortedPlatform[0]['CTR (link click-through rate)'] || 0) * 100).toFixed(2) + '%.' : 'Platform breakdown menunjukkan variasi performa signifikan antar platform.'}</p>
                                            <p className="text-xs mt-1">${sortedPlatform.length > 0 ? 'Platform ini menjadi pilihan terbaik untuk optimasi budget dan scaling campaign.' : 'Perlu analisis lebih lanjut untuk identifikasi platform terbaik.'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-3 bg-green-50 rounded-lg">
                                    <div className="flex items-start">
                                        <i className="fas fa-lightbulb text-green-500 mr-2 mt-0.5"></i>
                                        <div className="flex-1">
                                            <p className="text-xs"><strong>Rekomendasi:</strong> ${sortedPlatform.length > 0 ? 'Alokasikan lebih banyak budget ke platform ' + sortedPlatform[0].Platform + ' untuk hasil maksimal.' : 'Lakukan testing pada berbagai platform untuk menemukan performa terbaik.'}</p>
                                            <p className="text-xs mt-1">Pertimbangkan ekspansi ke platform lain dengan performa baik untuk diversifikasi dan meningkatkan reach.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`
  }

  // Slide 9: Placement Performance
  const placementThisWeek = breakdown.thisWeek?.placement || []
  if (placementThisWeek.length > 0) {
    // Sort by purchases (highest first)
    const sortedPlacement = [...placementThisWeek]
      .filter((p: any) => p.Placement && p.Placement.trim())
      .sort((a: any, b: any) => {
        const resultA = a['Purchases with shared items'] || a['Purchases'] || 0
        const resultB = b['Purchases with shared items'] || b['Purchases'] || 0
        return resultB - resultA
      })
      .slice(0, 5)

    slides += `
                    {/* SLIDE 9 - CONTENT PERFORMANCE: PLACEMENT */}
                    <div className="bg-white p-8 border-t-4 border-hadona-blue">
                        <div className="max-w-6xl mx-auto">
                            <h2 className="text-2xl font-bold text-hadona-blue mb-4">Content Performance: Placement</h2>
                            <div className="grid grid-cols-3 gap-0">
                                <div className="border-r-2 border-gray-300 pr-4">
                                    <h3 className="text-base font-semibold mb-3">Total Purchases</h3>
                                    <div className="space-y-2">
                                        ${sortedPlacement.map((item: any) => {
          const placement = item.Placement || 'Unknown'
          const result = item['Purchases with shared items'] || item['Purchases'] || 0
          return `<div className="flex justify-between items-center">
                                            <span className="text-xs">${placement}</span>
                                            <span className="font-bold text-xs">{formatNumber(${result})}</span>
                                        </div>`
        }).join('')}
                                    </div>
                                </div>
                                <div className="border-r-2 border-gray-300 px-4">
                                    <h3 className="text-base font-semibold mb-3">Impressions</h3>
                                    <div className="space-y-2">
                                        ${sortedPlacement.map((item: any) => {
          const placement = item.Placement || 'Unknown'
          const impressions = item.Impressions || 0
          return `<div className="flex justify-between items-center">
                                            <span className="text-xs">${placement}</span>
                                            <span className="font-bold text-xs">{formatNumber(${impressions})}</span>
                                        </div>`
        }).join('')}
                                    </div>
                                </div>
                                <div className="pl-4">
                                    <h3 className="text-base font-semibold mb-3">CTR (Link)</h3>
                                    <div className="space-y-2">
                                        ${sortedPlacement.map((item: any) => {
          const placement = item.Placement || 'Unknown'
          const ctr = (item['CTR (link click-through rate)'] || 0) * 100
          return `<div className="flex justify-between items-center">
                                            <span className="text-xs">${placement}</span>
                                            <span className="font-bold text-xs">{formatPercent(${ctr})}</span>
                                        </div>`
        }).join('')}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 space-y-2">
                                <div className="p-3 bg-blue-50 rounded-lg">
                                    <div className="flex items-start">
                                        <i className="fas fa-photo-video text-blue-500 mr-2 mt-0.5"></i>
                                        <div className="flex-1">
                                            <p className="text-xs"><strong>Kesimpulan:</strong> ${sortedPlacement.length > 0 ? sortedPlacement[0].Placement + ' menghasilkan purchases tertinggi dengan CTR ' + ((sortedPlacement[0]['CTR (link click-through rate)'] || 0) * 100).toFixed(2) + '%.' : 'Placement breakdown menunjukkan variasi performa signifikan antar format.'}</p>
                                            <p className="text-xs mt-1">${sortedPlacement.length > 0 ? 'Format konten ini menjadi pilihan terbaik untuk optimasi dan scaling.' : 'Perlu analisis lebih lanjut untuk identifikasi format terbaik.'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-3 bg-green-50 rounded-lg">
                                    <div className="flex items-start">
                                        <i className="fas fa-lightbulb text-green-500 mr-2 mt-0.5"></i>
                                        <div className="flex-1">
                                            <p className="text-xs"><strong>Rekomendasi:</strong> ${sortedPlacement.length > 0 ? 'Buat lebih banyak konten dengan format ' + sortedPlacement[0].Placement + ' untuk hasil optimal.' : 'Lakukan testing pada berbagai format placement untuk menemukan performa terbaik.'}</p>
                                            <p className="text-xs mt-1">Pertimbangkan ekspansi ke format placement lain dengan performa baik untuk diversifikasi konten.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`
  }

  // Slide 10: Creative Performance
  const creativeThisWeek = breakdown.thisWeek?.['ad-creative'] || []
  if (creativeThisWeek.length > 0) {
    // Get top 5 performers based on purchases
    const sortedCreative = [...creativeThisWeek]
      .filter((c: any) => {
        const purchases = c['Purchases with shared items'] || c['Purchases'] || 0
        return purchases > 0
      })
      .sort((a: any, b: any) => {
        const purchasesA = a['Purchases with shared items'] || a['Purchases'] || 0
        const purchasesB = b['Purchases with shared items'] || b['Purchases'] || 0
        return purchasesB - purchasesA
      })
      .slice(0, 5)

    slides += `
                    {/* SLIDE 10 - CREATIVE PERFORMANCE: AD ANALYSIS */}
                    <div className="bg-white p-8 border-t-4 border-hadona-blue">
                        <div className="max-w-6xl mx-auto">
                            <h2 className="text-2xl font-bold text-hadona-blue mb-4">Creative Performance: Ad Analysis</h2>
                            <div className="mb-3">
                                <p className="text-xs text-gray-600">
                                    <i className="fas fa-info-circle text-blue-500 mr-2"></i>
                                    Top 5 Iklan berdasarkan Purchases
                                </p>
                            </div>
                            <div className="space-y-4">
                                ${sortedCreative.map((item: any, index: number) => {
          const adNameRaw = item['Ads'] || item['Ad name'] || item['Ad Name'] || item['Campaign name'] || item['Campaign Name'] || item['Ad'] || item['Creative'] || item['Ad creative'] || (item['Campaign'] && item['Ad set'] ? item['Campaign'] + ' - ' + item['Ad set'] : null) || Object.values(item).find((v: any) => typeof v === 'string' && v.length > 0 && !v.match(/^[0-9.,]+$/)) || 'N/A'

          // Parse ad names - split by semicolon and clean up
          let adNamesList: string[] = []
          if (adNameRaw && typeof adNameRaw === 'string') {
            // Split by semicolon
            adNamesList = adNameRaw.split(';').map((name: string) => name.trim()).filter((name: string) => name.length > 0)
            // Remove "...and X more ads" pattern
            adNamesList = adNamesList.map((name: string) => name.replace(/\.\.\.and \d+ more ads?/i, '').trim()).filter((name: string) => name.length > 0)
            // If still empty or only one item, use original
            if (adNamesList.length === 0) {
              adNamesList = [adNameRaw]
            }
          } else {
            adNamesList = [String(adNameRaw || 'N/A')]
          }

          // Take first 3 ad names for display
          const displayAdNames = adNamesList.slice(0, 3)
          const hasMore = adNamesList.length > 3

          const purchases = item['Purchases with shared items'] || item['Purchases'] || 0
          const cpa = purchases > 0 ? ((item['Amount spent (IDR)'] || item['Amount spent'] || 0) / purchases) : 0
          const ctr = (item['CTR (link click-through rate)'] || 0) * 100
          const impressions = item['Impressions'] || 0
          const outboundClicks = item['Outbound clicks'] || 0

          return `<div className="border-2 ${index === 0 ? 'border-yellow-400 bg-yellow-50' : index === 1 ? 'border-green-300 bg-green-50' : index === 2 ? 'border-blue-300 bg-blue-50' : 'border-gray-200 bg-gray-50'} p-3 rounded-lg">
                                            <div className="mb-3">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-base font-bold ${index === 0 ? 'text-yellow-600' : index === 1 ? 'text-green-600' : index === 2 ? 'text-blue-600' : 'text-gray-600'}">#${index + 1}</span>
                                                    <h4 className="font-semibold text-xs text-gray-800">Daftar Nama Ads:</h4>
                                                </div>
                                                <div className="bg-white p-2 rounded border border-gray-200">
                                                    <ul className="space-y-1">
                                                        ${displayAdNames.map((name: string) => {
            const cleanName = name.length > 70 ? name.substring(0, 67) + '...' : name
            return `<li className="text-xs text-gray-700 flex items-start">
                                                            <span className="text-gray-400 mr-2">•</span>
                                                            <span>${cleanName}</span>
                                                        </li>`
          }).join('')}
                                                        ${hasMore ? `<li className="text-xs text-gray-500 italic flex items-start">
                                                            <span className="text-gray-400 mr-2">•</span>
                                                            <span>...dan ${adNamesList.length - 3} ads lainnya</span>
                                                        </li>` : ''}
                                                    </ul>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3 gap-3 mt-3">
                                                <div className="bg-white p-3 rounded border">
                                                    <div className="text-xs text-gray-600 mb-1">Purchases</div>
                                                    <div className="text-sm font-bold text-green-600">{formatNumber(${purchases})}</div>
                                                </div>
                                                <div className="bg-white p-3 rounded border">
                                                    <div className="text-xs text-gray-600 mb-1">CPA</div>
                                                    <div className="text-sm font-bold text-purple-600">{formatCurrency(${cpa})}</div>
                                                </div>
                                                <div className="bg-white p-3 rounded border">
                                                    <div className="text-xs text-gray-600 mb-1">ROAS Est.</div>
                                                    <div className="text-sm font-bold text-pink-600">${purchases > 0 ? ((item['Purchases conversion value'] || 0) / (item['Amount spent (IDR)'] || item['Amount spent'] || 1)).toFixed(2) + 'x' : '0x'}</div>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-4 gap-3 mt-3 pt-3 border-t">
                                                <div>
                                                    <div className="text-xs text-gray-600">CPA</div>
                                                    <div className="text-sm font-semibold">{formatCurrency(${cpa})}</div>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-gray-600">CTR</div>
                                                    <div className="text-sm font-semibold">{formatPercent(${ctr})}</div>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-gray-600">Impressions</div>
                                                    <div className="text-sm font-semibold">{formatNumber(${impressions})}</div>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-gray-600">Outbound Clicks</div>
                                                    <div className="text-sm font-semibold">{formatNumber(${outboundClicks})}</div>
                                                </div>
                                            </div>
                                        </div>`
        }).join('')}
                            </div>
                            <div className="mt-4 space-y-2">
                                <div className="p-3 bg-yellow-50 rounded-lg">
                                    <div className="flex items-start">
                                        <i className="fas fa-palette text-yellow-500 mr-2 mt-0.5"></i>
                                        <div className="flex-1">
                                            <p className="text-xs"><strong>Kesimpulan:</strong> ${sortedCreative.length > 0 ? 'Top iklan menghasilkan ' + (sortedCreative[0]['Purchases with shared items'] || sortedCreative[0]['Purchases'] || 0) + ' purchases dengan CPA ' + Math.round((sortedCreative[0]['Amount spent (IDR)'] || sortedCreative[0]['Amount spent'] || 0) / (sortedCreative[0]['Purchases with shared items'] || sortedCreative[0]['Purchases'] || 1)) + '.' : 'Creative breakdown menunjukkan variasi performa signifikan antar iklan.'}</p>
                                            <p className="text-xs mt-1">${sortedCreative.length > 0 ? 'Format dan strategi ini menunjukkan performa terbaik untuk scaling campaign.' : 'Perlu analisis lebih lanjut untuk identifikasi format creative terbaik.'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-3 bg-green-50 rounded-lg">
                                    <div className="flex items-start">
                                        <i className="fas fa-lightbulb text-green-500 mr-2 mt-0.5"></i>
                                        <div className="flex-1">
                                            <p className="text-xs"><strong>Rekomendasi:</strong> ${sortedCreative.length > 0 ? 'Buat lebih banyak creative dengan format dan strategi serupa untuk hasil maksimal.' : 'Lakukan A/B testing pada berbagai format creative untuk menemukan performa terbaik.'}</p>
                                            <p className="text-xs mt-1">Pertimbangkan variasi creative dengan elemen yang terbukti efektif untuk meningkatkan engagement dan conversion.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`
  }

  // Slide 11: Campaign Objective Performance
  const objectiveThisWeek = breakdown.thisWeek?.objective || []
  if (objectiveThisWeek.length > 0) {
    // Sort by purchases (highest first)
    const sortedObjective = [...objectiveThisWeek]
      .filter((o: any) => o['Campaign objective'] && o['Campaign objective'].trim())
      .sort((a: any, b: any) => {
        const convA = a['Purchases with shared items'] || a['Purchases'] || 0
        const convB = b['Purchases with shared items'] || b['Purchases'] || 0
        return convB - convA
      })
      .slice(0, 4)

    slides += `
                    {/* SLIDE 11 - CAMPAIGN OBJECTIVE PERFORMANCE */}
                    <div className="bg-white p-8 border-t-4 border-hadona-blue">
                        <div className="max-w-6xl mx-auto">
                            <h2 className="text-2xl font-bold text-hadona-blue mb-4">Campaign Objective Performance</h2>
                            <div className="grid grid-cols-4 gap-3">
                                ${sortedObjective.map((item: any) => {
          const objective = item['Campaign objective'] || 'Unknown'
          const conv = item['Purchases with shared items'] || item['Purchases'] || 0
          const impressions = item.Impressions || 0
          const clicks = item['Outbound clicks'] || 0
          const ctr = (item['CTR (link click-through rate)'] || 0) * 100
          return `<div>
                                            <h3 className="text-base font-semibold mb-3">${objective}</h3>
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span>Purchases</span>
                                                    <span className="font-bold">{formatNumber(${conv})}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Impressions</span>
                                                    <span className="font-bold">{formatNumber(${impressions})}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Outbound Click</span>
                                                    <span className="font-bold">{formatNumber(${clicks})}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>CTR</span>
                                                    <span className="font-bold">{formatPercent(${ctr})}</span>
                                                </div>
                                            </div>
                                        </div>`
        }).join('')}
                            </div>
                            <div className="mt-4 space-y-2">
                                <div className="p-3 bg-blue-50 rounded-lg">
                                    <div className="flex items-start">
                                        <i className="fas fa-bullseye text-blue-500 mr-2 mt-0.5"></i>
                                        <div className="flex-1">
                                            <p className="text-xs"><strong>Kesimpulan:</strong> ${sortedObjective.length > 0 ? sortedObjective[0]['Campaign objective'] + ' menghasilkan purchases tertinggi dengan CTR ' + ((sortedObjective[0]['CTR (link click-through rate)'] || 0) * 100).toFixed(2) + '%.' : 'Objective breakdown menunjukkan variasi performa signifikan antar objective.'}</p>
                                            <p className="text-xs mt-1">${sortedObjective.length > 0 ? 'Objective ini menjadi pilihan terbaik untuk optimasi dan scaling campaign.' : 'Perlu analisis lebih lanjut untuk identifikasi objective terbaik.'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-3 bg-green-50 rounded-lg">
                                    <div className="flex items-start">
                                        <i className="fas fa-lightbulb text-green-500 mr-2 mt-0.5"></i>
                                        <div className="flex-1">
                                            <p className="text-xs"><strong>Rekomendasi:</strong> ${sortedObjective.length > 0 ? 'Fokus pada objective ' + sortedObjective[0]['Campaign objective'] + ' untuk hasil optimal dan scaling.' : 'Lakukan testing pada berbagai objective untuk menemukan performa terbaik.'}</p>
                                            <p className="text-xs mt-1">Pertimbangkan kombinasi objective dengan performa baik untuk diversifikasi strategi campaign.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`
  }

  // Slide 12: Overall Conclusion & Strategic Action Plan
  slides += `
                    {/* SLIDE 12 - OVERALL CONCLUSION & STRATEGIC ACTION PLAN */}
                    <div className="bg-white p-8 border-t-4 border-hadona-blue">
                        <div className="max-w-6xl mx-auto">
                            <h2 className="text-2xl font-bold text-hadona-blue mb-4">Overall Conclusion & Strategic Action Plan</h2>
                            <div className="grid grid-cols-2 gap-0">
                                <div className="border-r-2 border-gray-300 pr-6">
                                    <h3 className="text-base font-semibold mb-3">Ringkasan Performa</h3>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-start">
                                            <i className="fas fa-check-circle text-green-500 mt-1 mr-2 text-xs"></i>
                                            <span className="text-xs"><strong>Performa ${thisPeriodLabel}:</strong> ${thisWeek.amountSpent >= lastWeek.amountSpent ? 'Meningkat' : 'Menurun'} ${Math.abs(((thisWeek.amountSpent || 0) - (lastWeek.amountSpent || 0)) / (lastWeek.amountSpent || 1) * 100).toFixed(1)}% dengan spend ${thisWeek.purchases && lastWeek.purchases && (thisWeek.amountSpent / thisWeek.purchases) <= (lastWeek.amountSpent / lastWeek.purchases) ? 'lebih efisien' : 'kurang efisien'}</span>
                                        </li>
                                        <li className="flex items-start">
                                            <i className="fas fa-check-circle text-green-500 mt-1 mr-2 text-xs"></i>
                                            <span className="text-xs"><strong>Platform Terbaik:</strong> ${platformThisWeek.length > 0 ? platformThisWeek[0]?.Platform || 'Platform tertentu' : 'Platform tertentu'} memberikan hasil terbaik</span>
                                        </li>
                                        <li className="flex items-start">
                                            <i className="fas fa-check-circle text-green-500 mt-1 mr-2 text-xs"></i>
                                            <span className="text-xs"><strong>Demografi Terbaik:</strong> ${ageThisWeek.length > 0 ? ageThisWeek.find((a: any) => a.Age && a.Age.trim())?.Age || '25-34 tahun' : '25-34 tahun'} dengan cost per purchase terendah</span>
                                        </li>
                                        <li className="flex items-start">
                                            <i className="fas fa-check-circle text-green-500 mt-1 mr-2 text-xs"></i>
                                            <span className="text-xs"><strong>Content Terbaik:</strong> ${placementThisWeek.length > 0 ? placementThisWeek[0]?.Placement || 'Format tertentu' : 'Format tertentu'} memberikan hasil terbaik</span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="pl-6">
                                    <h3 className="text-base font-semibold mb-3">Rencana Aksi Strategis</h3>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-start">
                                            <i className="fas fa-arrow-right text-blue-500 mt-1 mr-2 text-xs"></i>
                                            <span className="text-xs"><strong>Optimasi Budget:</strong> Alokasikan lebih banyak budget ke platform dan placement yang memberikan hasil terbaik</span>
                                        </li>
                                        <li className="flex items-start">
                                            <i className="fas fa-arrow-right text-blue-500 mt-1 mr-2 text-xs"></i>
                                            <span className="text-xs"><strong>Targeting:</strong> Fokus pada demografi yang memberikan cost per purchase terendah</span>
                                        </li>
                                        <li className="flex items-start">
                                            <i className="fas fa-arrow-right text-blue-500 mt-1 mr-2 text-xs"></i>
                                            <span className="text-xs"><strong>Creative:</strong> Buat lebih banyak konten dengan format yang terbukti efektif</span>
                                        </li>
                                        <li className="flex items-start">
                                            <i className="fas fa-arrow-right text-blue-500 mt-1 mr-2 text-xs"></i>
                                            <span className="text-xs"><strong>Testing:</strong> A/B test berbagai creative untuk meningkatkan CTR dan menurunkan CPA</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="mt-4 space-y-2">
                                <div className="p-3 bg-blue-50 rounded-lg">
                                    <div className="flex items-start">
                                        <i className="fas fa-chart-line text-blue-500 mr-2 mt-0.5"></i>
                                        <div className="flex-1">
                                            <p className="text-xs"><strong>Kesimpulan:</strong> ${thisWeek.amountSpent >= lastWeek.amountSpent ? 'Peningkatan' : 'Penurunan'} performa ${Math.abs(((thisWeek.amountSpent || 0) - (lastWeek.amountSpent || 0)) / (lastWeek.amountSpent || 1) * 100).toFixed(1)}% dengan ${platformThisWeek.length > 0 ? platformThisWeek[0]?.Platform : 'platform'} dan ${ageThisWeek.length > 0 ? ageThisWeek.find((a: any) => a.Age && a.Age.trim())?.Age : 'demografi'} sebagai driver utama.</p>
                                            <p className="text-xs mt-1">Perlu optimasi budget dan targeting untuk scaling dan growth berkelanjutan.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-3 bg-green-50 rounded-lg">
                                    <div className="flex items-start">
                                        <i className="fas fa-lightbulb text-green-500 mr-2 mt-0.5"></i>
                                        <div className="flex-1">
                                            <p className="text-xs"><strong>Rekomendasi:</strong> Alokasikan budget ke performa terbaik dan fokus targeting pada demografi dengan cost per purchase terendah.</p>
                                            <p className="text-xs mt-1">Lakukan A/B testing creative dan ekspansi ke segment serupa untuk meningkatkan reach dan diversifikasi.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`

  return slides
}
