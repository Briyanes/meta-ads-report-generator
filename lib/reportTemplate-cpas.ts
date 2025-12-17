/**
 * Complete HTML Report Template with React + Tailwind CSS for CPAS Objective
 * All 13 slides included
 */

export function generateReactTailwindReport(analysisData: any, reportName?: string, retentionType: string = 'wow', objectiveType: string = 'cpas'): string {
  // Handle both string and object formats
  let data: any
  if (typeof analysisData === 'string') {
    try {
      data = JSON.parse(analysisData)
    } catch (e) {
      console.error('Failed to parse analysisData as JSON:', e)
      data = {}
    }
  } else {
    data = analysisData || {}
  }
  
  // Extract data with fallbacks
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
    'cpas': 'CPAS (Cost Per Action/Sale)',
    'ctlptowa': 'CTLP to WA (Click to Landing Page to WhatsApp)'
  }
  const objectiveLabel = objectiveLabels[objectiveType] || 'CPAS (Cost Per Action/Sale)'
  
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
  const calculateGrowth = (current: number, previous: number) => {
    if (!previous || previous === 0) return 0
    return ((current - previous) / previous) * 100
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
    <script src="https://cdn.jsdelivr.net/npm/react@18.0.0/umd/react.development.js" crossorigin></script>
    <script src="https://cdn.jsdelivr.net/npm/react-dom@18.0.0/umd/react-dom.development.js" crossorigin></script>
    <script src="https://cdn.jsdelivr.net/npm/@babel/standalone/babel.min.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.css">
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
        // Ensure React and ReactDOM are loaded before rendering
        const checkAndRender = () => {
            if (typeof React !== 'undefined' && typeof ReactDOM !== 'undefined' && document.getElementById('root')) {
                const App = () => {
                    // Safely stringify data with error handling
                    let reportData;
                    try {
                        reportData = ${JSON.stringify(data)};
                    } catch (e) {
                        console.error('Error stringifying reportData:', e);
                        reportData = {};
                    }
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
                // Round to integer (no decimals)
                const rounded = Math.round(n);
                return 'Rp ' + rounded.toLocaleString('id-ID');
            };
            
            const formatPercent = (num) => {
                if (!num && num !== 0) return '0%';
                const n = typeof num === 'string' ? parseFloat(String(num)) : num;
                return isNaN(n) ? '0%' : n.toFixed(2) + '%';
            };
            
            // Safely extract data with multiple fallback levels
            const perf = (reportData && reportData.performanceSummary) ? reportData.performanceSummary : {};
            const thisWeek = (perf && perf.thisWeek) ? perf.thisWeek : {};
            const lastWeek = (perf && perf.lastWeek) ? perf.lastWeek : {};
            const breakdown = (reportData && reportData.breakdown) ? reportData.breakdown : {};
            
            // Debug: Log data structure
            console.log('DEBUG reportData:', reportData);
            console.log('DEBUG perf:', perf);
            console.log('DEBUG thisWeek:', thisWeek);
            console.log('DEBUG thisWeek.reach:', thisWeek.reach, 'type:', typeof thisWeek.reach);
            console.log('DEBUG lastWeek.reach:', lastWeek.reach, 'type:', typeof lastWeek.reach);
            console.log('DEBUG formatNumber(thisWeek.reach):', formatNumber(thisWeek.reach || 0));
            
            const spendGrowth = ${spendGrowth.toFixed(2)};
            const resultsGrowth = ${resultsGrowth.toFixed(2)};
            const cpaGrowth = ${cpaGrowth.toFixed(2)};
            const clientName = ${JSON.stringify(clientName)};
            const periodLabel = ${JSON.stringify(periodLabel)};
            const periodLabelId = ${JSON.stringify(periodLabelId)};
            const periodLabelEn = ${JSON.stringify(periodLabelEn)};
            const thisPeriodLabel = ${JSON.stringify(thisPeriodLabel)};
            const lastPeriodLabel = ${JSON.stringify(lastPeriodLabel)};
            const comparisonLabel = ${JSON.stringify(comparisonLabel)};
            const objectiveLabel = ${JSON.stringify(objectiveLabel)};
            
            function calculateGrowth(current, previous) {
                if (!previous || previous === 0) return 0;
                return ((current - previous) / previous) * 100;
            }
            
            // Helper function to get trend icon JSX as string (for use in template strings)
            const getTrendIconJSX = (isPositive) => {
                return isPositive 
                    ? '<i className="bi bi-arrow-up-circle-fill" style={{color: "#10b981", fontSize: "1.2em"}}></i>' 
                    : '<i className="bi bi-arrow-down-circle-fill" style={{color: "#ef4444", fontSize: "1.2em"}}></i>'
            }
            
            // Helper function to get field value with multiple variations
            const getFieldValue = (item, fieldName, alternatives = []) => {
                if (!item || typeof item !== 'object') return undefined
                
                const allFields = [fieldName, ...alternatives]
                const itemKeys = Object.keys(item)
                
                for (const field of allFields) {
                    // Try exact match first
                    if (item[field] !== undefined && item[field] !== null && item[field] !== '') {
                        return item[field]
                    }
                    // Try case-insensitive exact match
                    const exactMatch = itemKeys.find(key => key.toLowerCase() === field.toLowerCase())
                    if (exactMatch && item[exactMatch] !== undefined && item[exactMatch] !== null && item[exactMatch] !== '') {
                        return item[exactMatch]
                    }
                    // Try partial match
                    const partialMatch = itemKeys.find(key => {
                        const keyLower = key.toLowerCase()
                        const fieldLower = field.toLowerCase()
                        return keyLower.includes(fieldLower) || fieldLower.includes(keyLower)
                    })
                    if (partialMatch && item[partialMatch] !== undefined && item[partialMatch] !== null && item[partialMatch] !== '') {
                        return item[partialMatch]
                    }
                }
                return undefined
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
                            {reportName && reportName !== (isMoM ? 'Month-on-Month Report' : 'Week-on-Week Report') && reportName !== 'Month-on-Month Report' && reportName !== 'Week-on-Week Report' && (
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
                                            <span>Result (Purchases with shared items)</span>
                                            <span className="font-bold">{formatNumber(thisWeek.purchases || 0)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Cost per purchases with shared items</span>
                                            <span className="font-bold">{formatCurrency((thisWeek.purchases && thisWeek.amountSpent) ? (thisWeek.amountSpent / thisWeek.purchases) : 0)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Growth %</span>
                                            <span className={\`font-bold ${spendGrowth >= 0 ? 'text-green-500' : 'text-red-500'}\`}>{spendGrowth >= 0 ? '+' : ''}{formatPercent(spendGrowth)}</span>
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
                                            <span>Result (Purchases with shared items)</span>
                                            <span className="font-bold">{formatNumber(lastWeek.purchases || 0)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Cost per purchases with shared items</span>
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
                                <p className="text-xs"><i className="fas fa-lightbulb text-yellow-500 mr-2"></i> <strong>Key Insight:</strong> {spendGrowth >= 0 ? 'Performance meningkat' : 'Performance menurun'} {Math.abs(spendGrowth).toFixed(1)}% dengan {resultsGrowth >= 0 ? 'peningkatan' : 'penurunan'} {Math.abs(resultsGrowth).toFixed(1)}% purchases dan efisiensi cost yang {cpaGrowth <= 0 ? 'lebih baik' : 'perlu optimasi'}.</p>
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
                                            <td className="border border-gray-300 p-2 text-xs">Amount spent</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatCurrency(lastWeek.amountSpent || 0)}</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatCurrency(thisWeek.amountSpent || 0)}</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatCurrency((thisWeek.amountSpent || 0) - (lastWeek.amountSpent || 0))}</td>
                                            <td className={\`border border-gray-300 p-2 text-right text-xs ${spendGrowth >= 0 ? 'text-green-500' : 'text-red-500'}\`}>{spendGrowth >= 0 ? '+' : ''}{formatPercent(spendGrowth)}</td>
                                        </tr>
                                        <tr className="bg-gray-50">
                                            <td className="border border-gray-300 p-2 text-xs">Reach</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatNumber(lastWeek.reach || 0)}</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatNumber(thisWeek.reach || 0)}</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatNumber((thisWeek.reach || 0) - (lastWeek.reach || 0))}</td>
                                            <td className={\`border border-gray-300 p-2 text-right text-xs ${(thisWeek.reach || 0) >= (lastWeek.reach || 0) ? 'text-green-500' : 'text-red-500'}\`}>{(thisWeek.reach || 0) >= (lastWeek.reach || 0) ? '+' : ''}{formatPercent(calculateGrowth(thisWeek.reach || 0, lastWeek.reach || 0))}</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 p-2 text-xs">Impressions</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatNumber(lastWeek.impressions || 0)}</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatNumber(thisWeek.impressions || 0)}</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatNumber((thisWeek.impressions || 0) - (lastWeek.impressions || 0))}</td>
                                            <td className={\`border border-gray-300 p-2 text-right text-xs ${(thisWeek.impressions || 0) >= (lastWeek.impressions || 0) ? 'text-green-500' : 'text-red-500'}\`}>{(thisWeek.impressions || 0) >= (lastWeek.impressions || 0) ? '+' : ''}{formatPercent(calculateGrowth(thisWeek.impressions || 0, lastWeek.impressions || 0))}</td>
                                        </tr>
                                        <tr className="bg-gray-50">
                                            <td className="border border-gray-300 p-2 text-xs">CPM</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatCurrency(lastWeek.cpm || 0)}</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatCurrency(thisWeek.cpm || 0)}</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatCurrency((thisWeek.cpm || 0) - (lastWeek.cpm || 0))}</td>
                                            <td className={\`border border-gray-300 p-2 text-right text-xs ${(thisWeek.cpm || 0) <= (lastWeek.cpm || 0) ? 'text-green-500' : 'text-red-500'}\`}>{(thisWeek.cpm || 0) <= (lastWeek.cpm || 0) ? '' : '+'}{formatPercent(calculateGrowth(thisWeek.cpm || 0, lastWeek.cpm || 0))}</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 p-2 text-xs">Frequency</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatNumber(lastWeek.frequency || 0)}</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatNumber(thisWeek.frequency || 0)}</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatNumber((thisWeek.frequency || 0) - (lastWeek.frequency || 0))}</td>
                                            <td className={\`border border-gray-300 p-2 text-right text-xs ${(thisWeek.frequency || 0) >= (lastWeek.frequency || 0) ? 'text-green-500' : 'text-red-500'}\`}>{(thisWeek.frequency || 0) >= (lastWeek.frequency || 0) ? '+' : ''}{formatPercent(calculateGrowth(thisWeek.frequency || 0, lastWeek.frequency || 0))}</td>
                                        </tr>
                                        <tr className="bg-gray-50">
                                            <td className="border border-gray-300 p-2 text-xs">Link clicks</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatNumber(lastWeek.linkClicks || 0)}</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatNumber(thisWeek.linkClicks || 0)}</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatNumber((thisWeek.linkClicks || 0) - (lastWeek.linkClicks || 0))}</td>
                                            <td className={\`border border-gray-300 p-2 text-right text-xs ${(thisWeek.linkClicks || 0) >= (lastWeek.linkClicks || 0) ? 'text-green-500' : 'text-red-500'}\`}>{(thisWeek.linkClicks || 0) >= (lastWeek.linkClicks || 0) ? '+' : ''}{formatPercent(calculateGrowth(thisWeek.linkClicks || 0, lastWeek.linkClicks || 0))}</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 p-2 text-xs">CTR (link click-through rate)</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatPercent((lastWeek.ctr || 0) * 100)}</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatPercent((thisWeek.ctr || 0) * 100)}</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatPercent(((thisWeek.ctr || 0) - (lastWeek.ctr || 0)) * 100)}</td>
                                            <td className={\`border border-gray-300 p-2 text-right text-xs ${(thisWeek.ctr || 0) >= (lastWeek.ctr || 0) ? 'text-green-500' : 'text-red-500'}\`}>{(thisWeek.ctr || 0) >= (lastWeek.ctr || 0) ? '+' : ''}{formatPercent(calculateGrowth((thisWeek.ctr || 0) * 100, (lastWeek.ctr || 0) * 100))}</td>
                                        </tr>
                                        <tr className="bg-gray-50">
                                            <td className="border border-gray-300 p-2 text-xs">CPC (link)</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatCurrency(lastWeek.cpc || 0)}</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatCurrency(thisWeek.cpc || 0)}</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatCurrency((thisWeek.cpc || 0) - (lastWeek.cpc || 0))}</td>
                                            <td className={\`border border-gray-300 p-2 text-right text-xs ${(thisWeek.cpc || 0) <= (lastWeek.cpc || 0) ? 'text-green-500' : 'text-red-500'}\`}>{(thisWeek.cpc || 0) <= (lastWeek.cpc || 0) ? '' : '+'}{formatPercent(calculateGrowth(thisWeek.cpc || 0, lastWeek.cpc || 0))}</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 p-2 text-xs">Content views with shared items</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatNumber(lastWeek.contentViews || 0)}</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatNumber(thisWeek.contentViews || 0)}</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatNumber((thisWeek.contentViews || 0) - (lastWeek.contentViews || 0))}</td>
                                            <td className={\`border border-gray-300 p-2 text-right text-xs ${(thisWeek.contentViews || 0) >= (lastWeek.contentViews || 0) ? 'text-green-500' : 'text-red-500'}\`}>{(thisWeek.contentViews || 0) >= (lastWeek.contentViews || 0) ? '+' : ''}{formatPercent(calculateGrowth(thisWeek.contentViews || 0, lastWeek.contentViews || 0))}</td>
                                        </tr>
                                        <tr className="bg-gray-50">
                                            <td className="border border-gray-300 p-2 text-xs">Cost per content view</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatCurrency((lastWeek.contentViews && lastWeek.amountSpent) ? (lastWeek.amountSpent / lastWeek.contentViews) : 0)}</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatCurrency((thisWeek.contentViews && thisWeek.amountSpent) ? (thisWeek.amountSpent / thisWeek.contentViews) : 0)}</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatCurrency(((thisWeek.contentViews && thisWeek.amountSpent) ? (thisWeek.amountSpent / thisWeek.contentViews) : 0) - ((lastWeek.contentViews && lastWeek.amountSpent) ? (lastWeek.amountSpent / lastWeek.contentViews) : 0))}</td>
                                            <td className={\`border border-gray-300 p-2 text-right text-xs ${((thisWeek.contentViews && thisWeek.amountSpent) ? (thisWeek.amountSpent / thisWeek.contentViews) : 0) <= ((lastWeek.contentViews && lastWeek.amountSpent) ? (lastWeek.amountSpent / lastWeek.contentViews) : 0) ? 'text-green-500' : 'text-red-500'}\`}>{((thisWeek.contentViews && thisWeek.amountSpent) ? (thisWeek.amountSpent / thisWeek.contentViews) : 0) <= ((lastWeek.contentViews && lastWeek.amountSpent) ? (lastWeek.amountSpent / lastWeek.contentViews) : 0) ? '' : '+'}{formatPercent(calculateGrowth((thisWeek.contentViews && thisWeek.amountSpent) ? (thisWeek.amountSpent / thisWeek.contentViews) : 0, (lastWeek.contentViews && lastWeek.amountSpent) ? (lastWeek.amountSpent / lastWeek.contentViews) : 0))}</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 p-2 text-xs">Adds to cart with shared items</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatNumber(lastWeek.addsToCart || 0)}</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatNumber(thisWeek.addsToCart || 0)}</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatNumber((thisWeek.addsToCart || 0) - (lastWeek.addsToCart || 0))}</td>
                                            <td className={\`border border-gray-300 p-2 text-right text-xs ${(thisWeek.addsToCart || 0) >= (lastWeek.addsToCart || 0) ? 'text-green-500' : 'text-red-500'}\`}>{(thisWeek.addsToCart || 0) >= (lastWeek.addsToCart || 0) ? '+' : ''}{formatPercent(calculateGrowth(thisWeek.addsToCart || 0, lastWeek.addsToCart || 0))}</td>
                                        </tr>
                                        <tr className="bg-gray-50">
                                            <td className="border border-gray-300 p-2 text-xs">Cost per add to cart with shared items</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatCurrency((lastWeek.addsToCart && lastWeek.amountSpent) ? (lastWeek.amountSpent / lastWeek.addsToCart) : 0)}</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatCurrency((thisWeek.addsToCart && thisWeek.amountSpent) ? (thisWeek.amountSpent / thisWeek.addsToCart) : 0)}</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatCurrency(((thisWeek.addsToCart && thisWeek.amountSpent) ? (thisWeek.amountSpent / thisWeek.addsToCart) : 0) - ((lastWeek.addsToCart && lastWeek.amountSpent) ? (lastWeek.amountSpent / lastWeek.addsToCart) : 0))}</td>
                                            <td className={\`border border-gray-300 p-2 text-right text-xs ${((thisWeek.addsToCart && thisWeek.amountSpent) ? (thisWeek.amountSpent / thisWeek.addsToCart) : 0) <= ((lastWeek.addsToCart && lastWeek.amountSpent) ? (lastWeek.amountSpent / lastWeek.addsToCart) : 0) ? 'text-green-500' : 'text-red-500'}\`}>{((thisWeek.addsToCart && thisWeek.amountSpent) ? (thisWeek.amountSpent / thisWeek.addsToCart) : 0) <= ((lastWeek.addsToCart && lastWeek.amountSpent) ? (lastWeek.amountSpent / lastWeek.addsToCart) : 0) ? '' : '+'}{formatPercent(calculateGrowth((thisWeek.addsToCart && thisWeek.amountSpent) ? (thisWeek.amountSpent / thisWeek.addsToCart) : 0, (lastWeek.addsToCart && lastWeek.amountSpent) ? (lastWeek.amountSpent / lastWeek.addsToCart) : 0))}</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 p-2 text-xs">ATC conversion value (shared only)</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatCurrency(lastWeek.atcConversionValue || 0)}</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatCurrency(thisWeek.atcConversionValue || 0)}</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatCurrency((thisWeek.atcConversionValue || 0) - (lastWeek.atcConversionValue || 0))}</td>
                                            <td className={\`border border-gray-300 p-2 text-right text-xs ${(thisWeek.atcConversionValue || 0) >= (lastWeek.atcConversionValue || 0) ? 'text-green-500' : 'text-red-500'}\`}>{(thisWeek.atcConversionValue || 0) >= (lastWeek.atcConversionValue || 0) ? '+' : ''}{formatPercent(calculateGrowth(thisWeek.atcConversionValue || 0, lastWeek.atcConversionValue || 0))}</td>
                                        </tr>
                                        <tr className="bg-gray-50">
                                            <td className="border border-gray-300 p-2 text-xs">Purchases with shared items</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatNumber(lastWeek.purchases || 0)}</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatNumber(thisWeek.purchases || 0)}</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatNumber((thisWeek.purchases || 0) - (lastWeek.purchases || 0))}</td>
                                            <td className={\`border border-gray-300 p-2 text-right text-xs ${(thisWeek.purchases || 0) >= (lastWeek.purchases || 0) ? 'text-green-500' : 'text-red-500'}\`}>{(thisWeek.purchases || 0) >= (lastWeek.purchases || 0) ? '+' : ''}{formatPercent(calculateGrowth(thisWeek.purchases || 0, lastWeek.purchases || 0))}</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 p-2 text-xs">Cost per purchases with shared items</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatCurrency((lastWeek.purchases && lastWeek.amountSpent) ? (lastWeek.amountSpent / lastWeek.purchases) : 0)}</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatCurrency((thisWeek.purchases && thisWeek.amountSpent) ? (thisWeek.amountSpent / thisWeek.purchases) : 0)}</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatCurrency(((thisWeek.purchases && thisWeek.amountSpent) ? (thisWeek.amountSpent / thisWeek.purchases) : 0) - ((lastWeek.purchases && lastWeek.amountSpent) ? (lastWeek.amountSpent / lastWeek.purchases) : 0))}</td>
                                            <td className={\`border border-gray-300 p-2 text-right text-xs ${((thisWeek.purchases && thisWeek.amountSpent) ? (thisWeek.amountSpent / thisWeek.purchases) : 0) <= ((lastWeek.purchases && lastWeek.amountSpent) ? (lastWeek.amountSpent / lastWeek.purchases) : 0) ? 'text-green-500' : 'text-red-500'}\`}>{((thisWeek.purchases && thisWeek.amountSpent) ? (thisWeek.amountSpent / thisWeek.purchases) : 0) <= ((lastWeek.purchases && lastWeek.amountSpent) ? (lastWeek.amountSpent / lastWeek.purchases) : 0) ? '' : '+'}{formatPercent(calculateGrowth((thisWeek.purchases && thisWeek.amountSpent) ? (thisWeek.amountSpent / thisWeek.purchases) : 0, (lastWeek.purchases && lastWeek.amountSpent) ? (lastWeek.amountSpent / lastWeek.purchases) : 0))}</td>
                                        </tr>
                                        <tr className="bg-gray-50">
                                            <td className="border border-gray-300 p-2 text-xs">Purchases conversion value for shared items only</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatCurrency(lastWeek.purchasesConversionValue || 0)}</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatCurrency(thisWeek.purchasesConversionValue || 0)}</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatCurrency((thisWeek.purchasesConversionValue || 0) - (lastWeek.purchasesConversionValue || 0))}</td>
                                            <td className={\`border border-gray-300 p-2 text-right text-xs ${(thisWeek.purchasesConversionValue || 0) >= (lastWeek.purchasesConversionValue || 0) ? 'text-green-500' : 'text-red-500'}\`}>{(thisWeek.purchasesConversionValue || 0) >= (lastWeek.purchasesConversionValue || 0) ? '+' : ''}{formatPercent(calculateGrowth(thisWeek.purchasesConversionValue || 0, lastWeek.purchasesConversionValue || 0))}</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 p-2 text-xs">Conversion Rate (Purchase ÷ Click)</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatPercent((lastWeek.linkClicks && lastWeek.purchases) ? (lastWeek.purchases / lastWeek.linkClicks * 100) : 0)}</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatPercent((thisWeek.linkClicks && thisWeek.purchases) ? (thisWeek.purchases / thisWeek.linkClicks * 100) : 0)}</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatPercent(((thisWeek.linkClicks && thisWeek.purchases) ? (thisWeek.purchases / thisWeek.linkClicks * 100) : 0) - ((lastWeek.linkClicks && lastWeek.purchases) ? (lastWeek.purchases / lastWeek.linkClicks * 100) : 0))}</td>
                                            <td className={\`border border-gray-300 p-2 text-right text-xs ${((thisWeek.linkClicks && thisWeek.purchases) ? (thisWeek.purchases / thisWeek.linkClicks * 100) : 0) >= ((lastWeek.linkClicks && lastWeek.purchases) ? (lastWeek.purchases / lastWeek.linkClicks * 100) : 0) ? 'text-green-500' : 'text-red-500'}\`}>{((thisWeek.linkClicks && thisWeek.purchases) ? (thisWeek.purchases / thisWeek.linkClicks * 100) : 0) >= ((lastWeek.linkClicks && lastWeek.purchases) ? (lastWeek.purchases / lastWeek.linkClicks * 100) : 0) ? '+' : ''}{formatPercent(calculateGrowth((thisWeek.linkClicks && thisWeek.purchases) ? (thisWeek.purchases / thisWeek.linkClicks * 100) : 0, (lastWeek.linkClicks && lastWeek.purchases) ? (lastWeek.purchases / lastWeek.linkClicks * 100) : 0))}</td>
                                        </tr>
                                        <tr className="bg-gray-50">
                                            <td className="border border-gray-300 p-2 text-xs">Purchase ROAS (return on ad spend)</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatNumber((lastWeek.purchasesConversionValue && lastWeek.amountSpent) ? (lastWeek.purchasesConversionValue / lastWeek.amountSpent) : 0)}</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatNumber((thisWeek.purchasesConversionValue && thisWeek.amountSpent) ? (thisWeek.purchasesConversionValue / thisWeek.amountSpent) : 0)}</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatNumber(((thisWeek.purchasesConversionValue && thisWeek.amountSpent) ? (thisWeek.purchasesConversionValue / thisWeek.amountSpent) : 0) - ((lastWeek.purchasesConversionValue && lastWeek.amountSpent) ? (lastWeek.purchasesConversionValue / lastWeek.amountSpent) : 0))}</td>
                                            <td className={\`border border-gray-300 p-2 text-right text-xs ${((thisWeek.purchasesConversionValue && thisWeek.amountSpent) ? (thisWeek.purchasesConversionValue / thisWeek.amountSpent) : 0) >= ((lastWeek.purchasesConversionValue && lastWeek.amountSpent) ? (lastWeek.purchasesConversionValue / lastWeek.amountSpent) : 0) ? 'text-green-500' : 'text-red-500'}\`}>{((thisWeek.purchasesConversionValue && thisWeek.amountSpent) ? (thisWeek.purchasesConversionValue / thisWeek.amountSpent) : 0) >= ((lastWeek.purchasesConversionValue && lastWeek.amountSpent) ? (lastWeek.purchasesConversionValue / lastWeek.amountSpent) : 0) ? '+' : ''}{formatPercent(calculateGrowth((thisWeek.purchasesConversionValue && thisWeek.amountSpent) ? (thisWeek.purchasesConversionValue / thisWeek.amountSpent) : 0, (lastWeek.purchasesConversionValue && lastWeek.amountSpent) ? (lastWeek.purchasesConversionValue / lastWeek.amountSpent) : 0))}</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 p-2 text-xs">Average purchases conversion value</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatCurrency((lastWeek.purchases && lastWeek.purchasesConversionValue) ? (lastWeek.purchasesConversionValue / lastWeek.purchases) : 0)}</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatCurrency((thisWeek.purchases && thisWeek.purchasesConversionValue) ? (thisWeek.purchasesConversionValue / thisWeek.purchases) : 0)}</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{formatCurrency(((thisWeek.purchases && thisWeek.purchasesConversionValue) ? (thisWeek.purchasesConversionValue / thisWeek.purchases) : 0) - ((lastWeek.purchases && lastWeek.purchasesConversionValue) ? (lastWeek.purchasesConversionValue / lastWeek.purchases) : 0))}</td>
                                            <td className={\`border border-gray-300 p-2 text-right text-xs ${((thisWeek.purchases && thisWeek.purchasesConversionValue) ? (thisWeek.purchasesConversionValue / thisWeek.purchases) : 0) >= ((lastWeek.purchases && lastWeek.purchasesConversionValue) ? (lastWeek.purchasesConversionValue / lastWeek.purchases) : 0) ? 'text-green-500' : 'text-red-500'}\`}>{((thisWeek.purchases && thisWeek.purchasesConversionValue) ? (thisWeek.purchasesConversionValue / thisWeek.purchases) : 0) >= ((lastWeek.purchases && lastWeek.purchasesConversionValue) ? (lastWeek.purchasesConversionValue / lastWeek.purchases) : 0) ? '+' : ''}{formatPercent(calculateGrowth((thisWeek.purchases && thisWeek.purchasesConversionValue) ? (thisWeek.purchasesConversionValue / thisWeek.purchases) : 0, (lastWeek.purchases && lastWeek.purchasesConversionValue) ? (lastWeek.purchasesConversionValue / lastWeek.purchases) : 0))}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-4 space-y-2">
                                <div className="p-3 bg-yellow-50 rounded-lg">
                                    <div className="flex items-start">
                                        <i className="fas fa-chart-line text-blue-500 mr-2 mt-0.5"></i>
                                        <div className="flex-1">
                                            <p className="text-xs"><strong>Kesimpulan:</strong> {spendGrowth >= 0 ? 'Peningkatan' : 'Penurunan'} performa {Math.abs(spendGrowth).toFixed(1)}% di semua metrik.</p>
                                            <p className="text-xs mt-1">{resultsGrowth >= 0 ? 'Engagement' : 'Cost efficiency'} menjadi {resultsGrowth >= 0 ? 'driver utama' : 'area perbaikan'} {isMoM ? 'bulan' : 'minggu'} ini.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-3 bg-green-50 rounded-lg">
                                    <div className="flex items-start">
                                        <i className="fas fa-lightbulb text-green-500 mr-2 mt-0.5"></i>
                                        <div className="flex-1">
                                            <p className="text-xs"><strong>Rekomendasi:</strong> {spendGrowth >= 0 ? 'Pertahankan momentum dengan' : 'Fokus pada optimasi'} {resultsGrowth >= 0 ? 'scaling budget ke performa terbaik' : 'cost efficiency dan targeting'}.</p>
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
                                            <span><strong>Purchases</strong> {resultsGrowth >= 0 ? 'meningkat' : 'menurun'} {Math.abs(resultsGrowth).toFixed(1)}% dengan {resultsGrowth >= 0 ? 'peningkatan' : 'penurunan'} conversion rate</span>
                                        </li>
                                        <li className="flex items-start">
                                            <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                                            <span><strong>Click-Through Rate</strong> {thisWeek.ctr >= lastWeek.ctr ? 'stabil' : 'meningkat'} di {formatPercent((thisWeek.ctr || 0) * 100)} meskipun impressions {thisWeek.impressions >= lastWeek.impressions ? 'meningkat' : 'menurun'}</span>
                                        </li>
                                        <li className="flex items-start">
                                            <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                                            <span><strong>Cost Efficiency</strong> {cpaGrowth <= 0 ? 'meningkat' : 'menurun'} dengan CPA {cpaGrowth <= 0 ? 'turun' : 'naik'} {Math.abs(cpaGrowth).toFixed(1)}%</span>
                                        </li>
                                        <li className="flex items-start">
                                            <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                                            <span><strong>Budget Utilization</strong> optimal dengan spend {spendGrowth >= 0 ? 'meningkat' : 'menurun'} {Math.abs(spendGrowth).toFixed(1)}%</span>
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
                                            <p className="text-xs"><strong>Kesimpulan:</strong> Fokus optimasi {thisWeek.cpc > lastWeek.cpc ? 'CPC' : 'CTR'} untuk efisiensi sambil {thisWeek.impressions < lastWeek.impressions ? 'expand reach' : 'maintain reach'} dan meningkatkan conversion rate.</p>
                                            <p className="text-xs mt-1">Growth berkelanjutan memerlukan monitoring metrik kunci (purchases, CPA, conversion rate) secara berkala dan penyesuaian strategi.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-3 bg-green-50 rounded-lg">
                                    <div className="flex items-start">
                                        <i className="fas fa-lightbulb text-green-500 mr-2 mt-0.5"></i>
                                        <div className="flex-1">
                                            <p className="text-xs"><strong>Rekomendasi:</strong> {thisWeek.cpc > lastWeek.cpc ? 'Optimasi CPC dengan testing creative dan targeting untuk menurunkan cost per purchase.' : 'Tingkatkan CTR dengan testing creative dan optimasi placement untuk meningkatkan purchases.'}</p>
                                            <p className="text-xs mt-1">{thisWeek.impressions < lastWeek.impressions ? 'Ekspansi reach dengan penambahan audience dan budget untuk meningkatkan exposure dan purchases.' : 'Pertahankan reach sambil fokus pada optimasi conversion rate (purchase/click) dan cost efficiency (CPA).'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    ${generateBreakdownSlides(breakdown, thisWeek, lastWeek, thisPeriodLabel, lastPeriodLabel)}

                    ${generateEventAnalysisSlides(data, thisWeek, lastWeek, thisPeriodLabel, lastPeriodLabel, isMoM)}

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

                // Use React 18 createRoot API instead of ReactDOM.render
                const rootElement = document.getElementById('root');
                // Check if createRoot is available (React 18+)
                if (typeof ReactDOM !== 'undefined' && ReactDOM.createRoot) {
                    const root = ReactDOM.createRoot(rootElement);
                    root.render(<App />);
                } else if (typeof ReactDOM !== 'undefined' && ReactDOM.render) {
                    // Fallback for React 17
                    ReactDOM.render(<App />, rootElement);
                } else {
                    console.error('ReactDOM is not available');
                }
            } else {
                // Retry after a short delay
                setTimeout(checkAndRender, 100);
            }
        };

        // Start rendering when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', checkAndRender);
        } else {
            checkAndRender();
        }
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
        // Try multiple field name variations for purchases
        const getPurchases = (item: any) => {
          let purchasesRaw = item['Purchases with shared items'] || 
                              item['Purchases'] || 
                              item['Purchases with shared items only'] ||
                              item['Purchases (shared items)'] ||
                              0
          
          // If purchases is empty/0, calculate from conversion value and AOV
          if (!purchasesRaw || parseFloat(String(purchasesRaw).replace(/,/g, '')) === 0) {
            const purchasesCV = parseFloat(String(item['Purchases conversion value for shared items only'] || item['Purchases conversion value'] || 0).replace(/,/g, '')) || 0
            const aov = parseFloat(String(item['AOV (IDR)'] || item['AOV'] || 0).replace(/,/g, '')) || 0
            if (purchasesCV > 0 && aov > 0) {
              purchasesRaw = purchasesCV / aov
            }
          }
          
          return parseFloat(String(purchasesRaw).replace(/,/g, '')) || 0
        }
        const resultA = getPurchases(a)
        const resultB = getPurchases(b)
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
          // Try multiple field name variations for purchases
          let purchasesRaw = item['Purchases with shared items'] || 
                              item['Purchases'] || 
                              item['Purchases with shared items only'] ||
                              item['Purchases (shared items)'] ||
                              0
          
          // If purchases is empty/0, calculate from conversion value and AOV
          if (!purchasesRaw || parseFloat(String(purchasesRaw).replace(/,/g, '')) === 0) {
            const purchasesCV = parseFloat(String(item['Purchases conversion value for shared items only'] || item['Purchases conversion value'] || 0).replace(/,/g, '')) || 0
            const aov = parseFloat(String(item['AOV (IDR)'] || item['AOV'] || 0).replace(/,/g, '')) || 0
            if (purchasesCV > 0 && aov > 0) {
              purchasesRaw = purchasesCV / aov
            }
          }
          
          const result = parseFloat(String(purchasesRaw).replace(/,/g, '')) || 0
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
          // Try multiple field name variations for purchases
          let purchasesRaw = item['Purchases with shared items'] || 
                              item['Purchases'] || 
                              item['Purchases with shared items only'] ||
                              item['Purchases (shared items)'] ||
                              0
          
          // If purchases is empty/0, calculate from conversion value and AOV
          if (!purchasesRaw || parseFloat(String(purchasesRaw).replace(/,/g, '')) === 0) {
            const purchasesCV = parseFloat(String(item['Purchases conversion value for shared items only'] || item['Purchases conversion value'] || 0).replace(/,/g, '')) || 0
            const aov = parseFloat(String(item['AOV (IDR)'] || item['AOV'] || 0).replace(/,/g, '')) || 0
            if (purchasesCV > 0 && aov > 0) {
              purchasesRaw = purchasesCV / aov
            }
          }
          
          const purchases = parseFloat(String(purchasesRaw).replace(/,/g, '')) || 0
          const amountSpentRaw = item['Amount spent (IDR)'] || item['Amount spent'] || 0
          const amountSpent = parseFloat(String(amountSpentRaw).replace(/,/g, '')) || 0
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
                                <div className="p-3 bg-yellow-50 rounded-lg">
                                    <div className="flex items-start">
                                        <i className="fas fa-users text-blue-500 mr-2 mt-0.5"></i>
                                        <div className="flex-1">
                                            <p className="text-xs"><strong>Kesimpulan:</strong> ${sortedAge.length > 0 ? (() => {
          const topAge = sortedAge[0]
          let purchases = topAge['Purchases with shared items'] || 
                           topAge['Purchases'] || 
                           topAge['Purchases with shared items only'] ||
                           topAge['Purchases (shared items)'] ||
                           0
          
          // If purchases is empty/0, calculate from conversion value and AOV
          if (!purchases || parseFloat(String(purchases).replace(/,/g, '')) === 0) {
            const purchasesCV = parseFloat(String(topAge['Purchases conversion value for shared items only'] || topAge['Purchases conversion value'] || 0).replace(/,/g, '')) || 0
            const aov = parseFloat(String(topAge['AOV (IDR)'] || topAge['AOV'] || 0).replace(/,/g, '')) || 0
            if (purchasesCV > 0 && aov > 0) {
              purchases = purchasesCV / aov
            }
          }
          
          return 'Demografi ' + topAge.Age + ' menghasilkan ' + Math.round(purchases) + ' purchases dengan CPA terendah.'
        })() : 'Data age breakdown menunjukkan variasi performa signifikan.'}</p>
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
                                <div className="p-3 bg-yellow-50 rounded-lg">
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
                                <div className="p-3 bg-yellow-50 rounded-lg">
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
        const getPurchases = (item: any) => {
          const purchasesRaw = item['Purchases with shared items'] || 
                              item['Purchases'] || 
                              item['Purchases with shared items only'] ||
                              item['Purchases (shared items)'] ||
                              0
          return parseFloat(String(purchasesRaw).replace(/,/g, '')) || 0
        }
        return getPurchases(b) - getPurchases(a)
      })
    
    slides += `
                    {/* SLIDE 8 - PLATFORM PERFORMANCE */}
                    <div className="bg-white p-8 border-t-4 border-hadona-blue">
                        <div className="max-w-6xl mx-auto">
                            <h2 className="text-2xl font-bold text-hadona-blue mb-4">Platform Performance</h2>
                            <div className="grid grid-cols-2 gap-0">
                                <div className="border-r-2 border-gray-300 pr-6">
                                    <h3 className="text-base font-semibold mb-3">Total Purchases</h3>
                                    <div className="space-y-2">
                                        ${sortedPlatform.map((item: any) => {
          const platform = item.Platform || 'Unknown'
          const purchasesRaw = item['Purchases with shared items'] || 
                              item['Purchases'] || 
                              item['Purchases with shared items only'] ||
                              item['Purchases (shared items)'] ||
                              0
          const purchases = parseFloat(String(purchasesRaw).replace(/,/g, '')) || 0
          return `<div className="flex justify-between items-center">
                                            <span className="text-xs">${platform}</span>
                                            <span className="font-bold text-xs">{formatNumber(${purchases})}</span>
                                        </div>`
        }).join('')}
                                    </div>
                                </div>
                                <div className="pl-6">
                                    <h3 className="text-base font-semibold mb-3">CPA (Cost Per Purchase)</h3>
                                    <div className="space-y-2">
                                        ${sortedPlatform.map((item: any) => {
          const platform = item.Platform || 'Unknown'
          const purchasesRaw = item['Purchases with shared items'] || 
                              item['Purchases'] || 
                              item['Purchases with shared items only'] ||
                              item['Purchases (shared items)'] ||
                              0
          const purchases = parseFloat(String(purchasesRaw).replace(/,/g, '')) || 0
          const amountSpentRaw = item['Amount spent (IDR)'] || item['Amount spent'] || 0
          const amountSpent = parseFloat(String(amountSpentRaw).replace(/,/g, '')) || 0
          const cpa = purchases > 0 ? (amountSpent / purchases) : 0
          return `<div className="flex justify-between items-center">
                                            <span className="text-xs">${platform}</span>
                                            <span className="font-bold text-xs">{formatCurrency(${cpa})}</span>
                                        </div>`
        }).join('')}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 space-y-2">
                                <div className="p-3 bg-yellow-50 rounded-lg">
                                    <div className="flex items-start">
                                        <i className="fab fa-instagram text-purple-500 mr-2 mt-0.5"></i>
                                        <div className="flex-1">
                                            <p className="text-xs"><strong>Kesimpulan:</strong> ${sortedPlatform.length > 0 ? (() => {
          const topPlatform = sortedPlatform[0]
          const purchases = topPlatform['Purchases with shared items'] || 
                           topPlatform['Purchases'] || 
                           topPlatform['Purchases with shared items only'] ||
                           topPlatform['Purchases (shared items)'] ||
                           0
          return topPlatform.Platform + ' menghasilkan ' + purchases + ' purchases dengan CPA terendah.'
        })() : 'Platform breakdown menunjukkan variasi performa signifikan antar platform.'}</p>
                                            <p className="text-xs mt-1">${sortedPlatform.length > 0 ? 'Platform ini menjadi pilihan terbaik untuk optimasi budget dan scaling campaign.' : 'Perlu analisis lebih lanjut untuk identifikasi platform terbaik.'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-3 bg-green-50 rounded-lg">
                                    <div className="flex items-start">
                                        <i className="fas fa-lightbulb text-green-500 mr-2 mt-0.5"></i>
                                        <div className="flex-1">
                                            <p className="text-xs"><strong>Rekomendasi:</strong> ${sortedPlatform.length > 0 ? 'Alokasikan lebih banyak budget ke platform ' + sortedPlatform[0].Platform + ' untuk hasil maksimal.' : 'Lakukan testing pada berbagai platform untuk menemukan performa terbaik.'}</p>
                                            <p className="text-xs mt-1">Pertimbangkan ekspansi ke platform lain dengan performa baik untuk diversifikasi dan meningkatkan purchases.</p>
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
        const getPurchases = (item: any) => {
          const purchasesRaw = item['Purchases with shared items'] || 
                              item['Purchases'] || 
                              item['Purchases with shared items only'] ||
                              item['Purchases (shared items)'] ||
                              0
          return parseFloat(String(purchasesRaw).replace(/,/g, '')) || 0
        }
        return getPurchases(b) - getPurchases(a)
      })
      .slice(0, 5)
    
    slides += `
                    {/* SLIDE 9 - CONTENT PERFORMANCE: PLACEMENT */}
                    <div className="bg-white p-8 border-t-4 border-hadona-blue">
                        <div className="max-w-6xl mx-auto">
                            <h2 className="text-2xl font-bold text-hadona-blue mb-4">Content Performance: Placement</h2>
                            <div className="grid grid-cols-2 gap-0">
                                <div className="border-r-2 border-gray-300 pr-6">
                                    <h3 className="text-base font-semibold mb-3">Total Purchases</h3>
                                    <div className="space-y-2">
                                        ${sortedPlacement.map((item: any) => {
          const placement = item.Placement || 'Unknown'
          const purchasesRaw = item['Purchases with shared items'] || 
                              item['Purchases'] || 
                              item['Purchases with shared items only'] ||
                              item['Purchases (shared items)'] ||
                              0
          const purchases = parseFloat(String(purchasesRaw).replace(/,/g, '')) || 0
          return `<div className="flex justify-between items-center">
                                            <span className="text-xs">${placement}</span>
                                            <span className="font-bold text-xs">{formatNumber(${purchases})}</span>
                                        </div>`
        }).join('')}
                                    </div>
                                </div>
                                <div className="pl-6">
                                    <h3 className="text-base font-semibold mb-3">CPA (Cost Per Purchase)</h3>
                                    <div className="space-y-2">
                                        ${sortedPlacement.map((item: any) => {
          const placement = item.Placement || 'Unknown'
          const purchasesRaw = item['Purchases with shared items'] || 
                              item['Purchases'] || 
                              item['Purchases with shared items only'] ||
                              item['Purchases (shared items)'] ||
                              0
          const purchases = parseFloat(String(purchasesRaw).replace(/,/g, '')) || 0
          const amountSpentRaw = item['Amount spent (IDR)'] || item['Amount spent'] || 0
          const amountSpent = parseFloat(String(amountSpentRaw).replace(/,/g, '')) || 0
          const cpa = purchases > 0 ? (amountSpent / purchases) : 0
          return `<div className="flex justify-between items-center">
                                            <span className="text-xs">${placement}</span>
                                            <span className="font-bold text-xs">{formatCurrency(${cpa})}</span>
                                        </div>`
        }).join('')}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 space-y-2">
                                <div className="p-3 bg-yellow-50 rounded-lg">
                                    <div className="flex items-start">
                                        <i className="fas fa-photo-video text-blue-500 mr-2 mt-0.5"></i>
                                        <div className="flex-1">
                                            <p className="text-xs"><strong>Kesimpulan:</strong> ${sortedPlacement.length > 0 ? (() => {
          const topPlacement = sortedPlacement[0]
          const purchases = topPlacement['Purchases with shared items'] || 
                           topPlacement['Purchases'] || 
                           topPlacement['Purchases with shared items only'] ||
                           topPlacement['Purchases (shared items)'] ||
                           0
          return topPlacement.Placement + ' menghasilkan ' + purchases + ' purchases dengan CPA terendah.'
        })() : 'Placement breakdown menunjukkan variasi performa signifikan antar format.'}</p>
                                            <p className="text-xs mt-1">${sortedPlacement.length > 0 ? 'Format konten ini menjadi pilihan terbaik untuk optimasi dan scaling.' : 'Perlu analisis lebih lanjut untuk identifikasi format terbaik.'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-3 bg-green-50 rounded-lg">
                                    <div className="flex items-start">
                                        <i className="fas fa-lightbulb text-green-500 mr-2 mt-0.5"></i>
                                        <div className="flex-1">
                                            <p className="text-xs"><strong>Rekomendasi:</strong> ${sortedPlacement.length > 0 ? 'Buat lebih banyak konten dengan format ' + sortedPlacement[0].Placement + ' untuk hasil optimal.' : 'Lakukan testing pada berbagai format placement untuk menemukan performa terbaik.'}</p>
                                            <p className="text-xs mt-1">Pertimbangkan ekspansi ke format placement lain dengan performa baik untuk diversifikasi konten dan meningkatkan purchases.</p>
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
    // Get top 5 performers based on: Purchases + Instagram Visits + Followers
    const sortedCreative = [...creativeThisWeek]
      .filter((c: any) => {
        const purchases = c['Purchases with shared items'] || 
                         c['Purchases'] || 
                         c['Purchases with shared items only'] ||
                         c['Purchases (shared items)'] ||
                         0
        const instagramVisits = c['Instagram profile visits'] || 0
        const instagramFollows = c['Instagram follows'] || 0
        // Filter ads that have at least one of these metrics > 0
        return purchases > 0 || instagramVisits > 0 || instagramFollows > 0
      })
      .map((item: any) => {
        const purchasesRaw = item['Purchases with shared items'] || 
                            item['Purchases'] || 
                            item['Purchases with shared items only'] ||
                            item['Purchases (shared items)'] ||
                            0
        const purchases = parseFloat(String(purchasesRaw).replace(/,/g, '')) || 0
        const instagramVisits = parseFloat(String(item['Instagram profile visits'] || 0).replace(/,/g, '')) || 0
        const instagramFollows = parseFloat(String(item['Instagram follows'] || 0).replace(/,/g, '')) || 0
        // Calculate combined score (weighted)
        const combinedScore = (purchases * 3) + (instagramVisits * 1) + (instagramFollows * 2)
        return { ...item, _combinedScore: combinedScore }
      })
      .sort((a: any, b: any) => b._combinedScore - a._combinedScore)
      .slice(0, 5)
    
    slides += `
                    {/* SLIDE 10 - CREATIVE PERFORMANCE: AD ANALYSIS */}
                    <div className="bg-white p-8 border-t-4 border-hadona-blue">
                        <div className="max-w-6xl mx-auto">
                            <h2 className="text-2xl font-bold text-hadona-blue mb-4">Creative Performance: Ad Analysis</h2>
                            <div className="mb-3">
                                <p className="text-xs text-gray-600">
                                    <i className="fas fa-info-circle text-blue-500 mr-2"></i>
                                    Top 5 Iklan berdasarkan kombinasi: Purchases, Instagram Profile Visits, dan Instagram Follows
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
          
          const purchasesRaw = item['Purchases with shared items'] || 
                              item['Purchases'] || 
                              item['Purchases with shared items only'] ||
                              item['Purchases (shared items)'] ||
                              0
          const purchases = parseFloat(String(purchasesRaw).replace(/,/g, '')) || 0
          const instagramVisits = parseFloat(String(item['Instagram profile visits'] || 0).replace(/,/g, '')) || 0
          const instagramFollows = parseFloat(String(item['Instagram follows'] || 0).replace(/,/g, '')) || 0
          const amountSpentRaw = item['Amount spent (IDR)'] || item['Amount spent'] || 0
          const amountSpent = parseFloat(String(amountSpentRaw).replace(/,/g, '')) || 0
          const cpr = item['Cost per purchase'] || item['Cost per purchases with shared items'] || item['Cost /Purchase (IDR)'] || (amountSpent > 0 && purchases > 0 ? (amountSpent / purchases) : 0)
          const ctr = (item['CTR (link click-through rate)'] || item['CTR (all)'] || 0) * 100
          const impressions = item['Impressions'] || 0
          const outboundClicks = item['Outbound clicks'] || item['Clicks (all)'] || 0
          
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
                                                    <div className="text-xs text-gray-600 mb-1">Instagram Visits</div>
                                                    <div className="text-sm font-bold text-purple-600">{formatNumber(${instagramVisits})}</div>
                                                </div>
                                                <div className="bg-white p-3 rounded border">
                                                    <div className="text-xs text-gray-600 mb-1">Instagram Follows</div>
                                                    <div className="text-sm font-bold text-pink-600">{formatNumber(${instagramFollows})}</div>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-4 gap-3 mt-3 pt-3 border-t">
                                                <div>
                                                    <div className="text-xs text-gray-600">CPR</div>
                                                    <div className="text-sm font-semibold">{formatCurrency(${cpr})}</div>
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
                                            <p className="text-xs"><strong>Kesimpulan:</strong> ${sortedCreative.length > 0 ? 'Top iklan menghasilkan ' + (sortedCreative[0]['Purchases'] || sortedCreative[0]['Purchases with shared items'] || 0) + ' Purchases dengan ' + (sortedCreative[0]['Instagram profile visits'] || 0) + ' Instagram visits.' : 'Creative breakdown menunjukkan variasi performa signifikan antar iklan.'}</p>
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
        const purchasesA = a['Purchases'] || a['Purchases with shared items'] || 0
        const purchasesB = b['Purchases'] || b['Purchases with shared items'] || 0
        return purchasesB - purchasesA
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
          const purchasesRaw = item['Purchases with shared items'] || 
                              item['Purchases'] || 
                              item['Purchases with shared items only'] ||
                              item['Purchases (shared items)'] ||
                              0
          const purchases = parseFloat(String(purchasesRaw).replace(/,/g, '')) || 0
          const impressions = parseFloat(String(item.Impressions || 0).replace(/,/g, '')) || 0
          const clicks = parseFloat(String(item['Outbound clicks'] || item['Clicks (all)'] || 0).replace(/,/g, '')) || 0
          const ctr = (item['CTR (link click-through rate)'] || item['CTR (all)'] || 0) * 100
          return `<div>
                                            <h3 className="text-base font-semibold mb-3">${objective}</h3>
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span>Purchases</span>
                                                    <span className="font-bold">{formatNumber(${purchases})}</span>
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
                                <div className="p-3 bg-yellow-50 rounded-lg">
                                    <div className="flex items-start">
                                        <i className="fas fa-bullseye text-blue-500 mr-2 mt-0.5"></i>
                                        <div className="flex-1">
                                            <p className="text-xs"><strong>Kesimpulan:</strong> ${sortedObjective.length > 0 ? sortedObjective[0]['Campaign objective'] + ' menghasilkan ' + (sortedObjective[0]['Purchases'] || sortedObjective[0]['Purchases with shared items'] || 0) + ' purchases dengan performa terbaik.' : 'Objective breakdown menunjukkan variasi performa signifikan antar objective.'}</p>
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
                                            <span className="text-xs"><strong>Performa ${thisPeriodLabel}:</strong> ${thisWeek.amountSpent >= lastWeek.amountSpent ? 'Meningkat' : 'Menurun'} ${Math.abs(((thisWeek.amountSpent || 0) - (lastWeek.amountSpent || 0)) / (lastWeek.amountSpent || 1) * 100).toFixed(1)}% dengan spend ${((thisWeek.purchases && thisWeek.amountSpent) ? (thisWeek.amountSpent / thisWeek.purchases) : 0) <= ((lastWeek.purchases && lastWeek.amountSpent) ? (lastWeek.amountSpent / lastWeek.purchases) : 0) ? 'lebih efisien' : 'kurang efisien'}</span>
                                        </li>
                                        <li className="flex items-start">
                                            <i className="fas fa-check-circle text-green-500 mt-1 mr-2 text-xs"></i>
                                            <span className="text-xs"><strong>Platform Terbaik:</strong> ${platformThisWeek.length > 0 ? platformThisWeek[0]?.Platform || 'Platform tertentu' : 'Platform tertentu'} memberikan hasil terbaik</span>
                                        </li>
                                        <li className="flex items-start">
                                            <i className="fas fa-check-circle text-green-500 mt-1 mr-2 text-xs"></i>
                                            <span className="text-xs"><strong>Demografi Terbaik:</strong> ${ageThisWeek.length > 0 ? ageThisWeek.find((a: any) => a.Age && a.Age.trim())?.Age || '25-34 tahun' : '25-34 tahun'} dengan cost per result terendah</span>
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
                                            <span className="text-xs"><strong>TARGETING:</strong> Fokus pada demografi yang memberikan cost per purchase (CPA) terendah</span>
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
                                <div className="p-3 bg-yellow-50 rounded-lg">
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
                                            <p className="text-xs"><strong>Rekomendasi:</strong> Alokasikan budget ke performa terbaik dan fokus targeting pada demografi dengan cost per result terendah.</p>
                                            <p className="text-xs mt-1">Lakukan A/B testing creative dan ekspansi ke segment serupa untuk meningkatkan reach dan diversifikasi.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`
  
  return slides
}


function generateEventAnalysisSlides(data: any, thisWeek: any, lastWeek: any, thisPeriodLabel: string, lastPeriodLabel: string, isMoM: boolean): string {
  // Extract event data from analysisData
  const eventData = data?.eventAnalysis || {}
  const twindateThis = eventData.twindateThis || {}
  const twindateLast = eventData.twindateLast || {}
  const paydayThis = eventData.paydayThis || {}
  const paydayLast = eventData.paydayLast || {}
  
  // Check if we have event data
  // Since aggregateEventData always returns object with all fields (even if 0),
  // we check if there's meaningful data (amountSpent > 0) in at least one period
  // This ensures we only show slides when there's actual data to display
  const hasTwindateData = (twindateThis.amountSpent !== undefined && twindateThis.amountSpent > 0) || 
                          (twindateLast.amountSpent !== undefined && twindateLast.amountSpent > 0) ||
                          (twindateThis.purchases !== undefined && twindateThis.purchases > 0) ||
                          (twindateLast.purchases !== undefined && twindateLast.purchases > 0)
  const hasPaydayData = (paydayThis.amountSpent !== undefined && paydayThis.amountSpent > 0) || 
                        (paydayLast.amountSpent !== undefined && paydayLast.amountSpent > 0) ||
                        (paydayThis.purchases !== undefined && paydayThis.purchases > 0) ||
                        (paydayLast.purchases !== undefined && paydayLast.purchases > 0)
  
  if (!hasTwindateData && !hasPaydayData) {
    // If no event data, return empty string (no slides)
    return ''
  }
  
  // Helper functions
  const calculateGrowth = (current: number, previous: number) => {
    if (!previous || previous === 0) return { value: 0, percentage: 0, isPositive: current >= 0 }
    const growth = current - previous
    const percentage = (growth / previous) * 100
    return { value: growth, percentage: Math.round(percentage * 100) / 100, isPositive: growth >= 0 }
  }
  
  const formatCurrency = (num: number) => {
    if (!num || isNaN(num)) return 'Rp 0'
    return 'Rp ' + num.toLocaleString('id-ID')
  }
  
  const formatNumber = (num: number) => {
    if (!num || isNaN(num)) return '0'
    return num.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }
  
  const formatPercent = (num: number) => {
    if (!num || isNaN(num)) return '0%'
    return num.toFixed(2) + '%'
  }
  
  // Helper function to get trend icon JSX as string (for use in template strings)
  const getTrendIconJSX = (isPositive: boolean) => {
    return isPositive 
      ? '<i className="bi bi-arrow-up-circle-fill" style={{color: "#10b981", fontSize: "1.2em"}}></i>' 
      : '<i className="bi bi-arrow-down-circle-fill" style={{color: "#ef4444", fontSize: "1.2em"}}></i>'
  }
  
  let slides = ''
  
  // Calculate Twindate metrics
  const twindateMetrics: any = {}
  if (hasTwindateData) {
    twindateMetrics.amountSpent = calculateGrowth(twindateThis.amountSpent || 0, twindateLast.amountSpent || 0)
    twindateMetrics.purchases = calculateGrowth(twindateThis.purchases || 0, twindateLast.purchases || 0)
    twindateMetrics.costPerPurchase = calculateGrowth(twindateThis.costPerPurchase || 0, twindateLast.costPerPurchase || 0)
    twindateMetrics.purchasesConversionValue = calculateGrowth(twindateThis.purchasesConversionValue || 0, twindateLast.purchasesConversionValue || 0)
    twindateMetrics.conversionRate = calculateGrowth((twindateThis.conversionRate || 0) * 100, (twindateLast.conversionRate || 0) * 100)
    twindateMetrics.purchaseROAS = calculateGrowth(twindateThis.purchaseROAS || 0, twindateLast.purchaseROAS || 0)
    twindateMetrics.avgPurchaseValue = calculateGrowth(twindateThis.avgPurchaseValue || 0, twindateLast.avgPurchaseValue || 0)
    twindateMetrics.addsToCart = calculateGrowth(twindateThis.addsToCart || 0, twindateLast.addsToCart || 0)
    twindateMetrics.costPerATC = calculateGrowth(twindateThis.costPerATC || 0, twindateLast.costPerATC || 0)
    twindateMetrics.atcConversionValue = calculateGrowth(twindateThis.atcConversionValue || 0, twindateLast.atcConversionValue || 0)
    twindateMetrics.ctr = calculateGrowth((twindateThis.ctr || 0) * 100, (twindateLast.ctr || 0) * 100)
    twindateMetrics.cpc = calculateGrowth(twindateThis.cpc || 0, twindateLast.cpc || 0)
    twindateMetrics.frequency = calculateGrowth(twindateThis.frequency || 0, twindateLast.frequency || 0)
    twindateMetrics.cpm = calculateGrowth(twindateThis.cpm || 0, twindateLast.cpm || 0)
  }
  
  // Calculate Payday metrics
  const paydayMetrics: any = {}
  if (hasPaydayData) {
    paydayMetrics.amountSpent = calculateGrowth(paydayThis.amountSpent || 0, paydayLast.amountSpent || 0)
    paydayMetrics.purchases = calculateGrowth(paydayThis.purchases || 0, paydayLast.purchases || 0)
    paydayMetrics.costPerPurchase = calculateGrowth(paydayThis.costPerPurchase || 0, paydayLast.costPerPurchase || 0)
    paydayMetrics.purchasesConversionValue = calculateGrowth(paydayThis.purchasesConversionValue || 0, paydayLast.purchasesConversionValue || 0)
    paydayMetrics.conversionRate = calculateGrowth((paydayThis.conversionRate || 0) * 100, (paydayLast.conversionRate || 0) * 100)
    paydayMetrics.purchaseROAS = calculateGrowth(paydayThis.purchaseROAS || 0, paydayLast.purchaseROAS || 0)
    paydayMetrics.avgPurchaseValue = calculateGrowth(paydayThis.avgPurchaseValue || 0, paydayLast.avgPurchaseValue || 0)
    paydayMetrics.addsToCart = calculateGrowth(paydayThis.addsToCart || 0, paydayLast.addsToCart || 0)
    paydayMetrics.costPerATC = calculateGrowth(paydayThis.costPerATC || 0, paydayLast.costPerATC || 0)
    paydayMetrics.atcConversionValue = calculateGrowth(paydayThis.atcConversionValue || 0, paydayLast.atcConversionValue || 0)
    paydayMetrics.ctr = calculateGrowth((paydayThis.ctr || 0) * 100, (paydayLast.ctr || 0) * 100)
    paydayMetrics.cpc = calculateGrowth(paydayThis.cpc || 0, paydayLast.cpc || 0)
    paydayMetrics.frequency = calculateGrowth(paydayThis.frequency || 0, paydayLast.frequency || 0)
    paydayMetrics.cpm = calculateGrowth(paydayThis.cpm || 0, paydayLast.cpm || 0)
  }
  
  // Helper function to get metric value
  const getMetricValue = (eventData: any, key: string) => {
    switch(key) {
      case 'amountSpent': return eventData.amountSpent || 0
      case 'purchases': return eventData.purchases || 0
      case 'costPerPurchase': return eventData.costPerPurchase || 0
      case 'purchasesConversionValue': return eventData.purchasesConversionValue || 0
      case 'conversionRate': return (eventData.conversionRate || 0) * 100
      case 'purchaseROAS': return eventData.purchaseROAS || 0
      case 'avgPurchaseValue': return eventData.avgPurchaseValue || 0
      case 'addsToCart': return eventData.addsToCart || 0
      case 'costPerATC': return eventData.costPerATC || 0
      case 'atcConversionValue': return eventData.atcConversionValue || 0
      case 'ctr': return (eventData.ctr || 0) * 100
      case 'cpc': return eventData.cpc || 0
      case 'frequency': return eventData.frequency || 0
      case 'cpm': return eventData.cpm || 0
      default: return 0
    }
  }
  
  // Helper function to format metric value
  const formatMetricValue = (key: string, value: number) => {
    const currencyKeys = ['amountSpent', 'costPerPurchase', 'costPerATC', 'cpc', 'cpm', 'purchasesConversionValue', 'atcConversionValue', 'avgPurchaseValue']
    const percentKeys = ['ctr', 'conversionRate']
    
    if (currencyKeys.includes(key)) {
      return formatCurrency(value)
    } else if (percentKeys.includes(key)) {
      return formatPercent(value)
    } else {
      return formatNumber(value)
    }
  }
  
  // Generate Twindate slides if data exists
  if (hasTwindateData) {
    // Get highlights and lowlights for Twindate
    const twindateHighlights = Object.entries(twindateMetrics)
      .filter(([_, metric]: [string, any]) => metric.isPositive && Math.abs(metric.percentage) >= 1)
      .sort(([_, a]: [string, any], [__, b]: [string, any]) => Math.abs(b.percentage) - Math.abs(a.percentage))
      .slice(0, 10)
    
    const twindateLowlights = Object.entries(twindateMetrics)
      .filter(([_, metric]: [string, any]) => !metric.isPositive && Math.abs(metric.percentage) >= 1)
      .sort(([_, a]: [string, any], [__, b]: [string, any]) => Math.abs(b.percentage) - Math.abs(a.percentage))
      .slice(0, 5)
    
    const metricLabels: Record<string, string> = {
      amountSpent: 'Amount spent',
      purchases: 'Purchases with shared items',
      costPerPurchase: 'Cost per purchases with shared items',
      purchasesConversionValue: 'Purchases conversion value for shared items only',
      conversionRate: 'Conversion Rate (Purchase ÷ Click)',
      purchaseROAS: 'Purchase ROAS (return on ad spend)',
      avgPurchaseValue: 'Average purchases conversion value',
      addsToCart: 'Adds to cart with shared items',
      costPerATC: 'Cost per add to cart with shared items',
      atcConversionValue: 'ATC conversion value (shared only)',
      ctr: 'CTR (link click-through rate)',
      cpc: 'CPC (link)',
      frequency: 'Frequency',
      cpm: 'CPM'
    }
    
    // Slide: Twindate Highlight (always show before Lowlight)
    slides += `
                    {/* EVENT ANALYSIS - TWINDATE HIGHLIGHT */}
                    <div className="bg-white p-8 border-t-4 border-hadona-blue">
                        <div className="max-w-6xl mx-auto">
                            <h2 className="text-2xl font-bold text-hadona-blue mb-4">Highlight (Event MoM) — Twindate</h2>
                            ${twindateHighlights.length > 0 ? `
                            <ul className="space-y-2 text-sm">
                                ${twindateHighlights.map(([key, metric]: [string, any]) => {
      const label = metricLabels[key] || key
      const thisValue = getMetricValue(twindateThis, key)
      const lastValue = getMetricValue(twindateLast, key)
      const formattedThis = formatMetricValue(key, thisValue)
      const formattedLast = formatMetricValue(key, lastValue)
      
      const icon = getTrendIconJSX(metric.isPositive)
      return '<li className="flex items-start"><span className="mr-2">' + icon + '</span><span className="text-xs"><strong>' + label + ':</strong> ' + (metric.percentage >= 0 ? '' : '') + Math.abs(metric.percentage).toFixed(2) + '% (' + formattedLast + ' → ' + formattedThis + ')</span></li>'
    }).join('')}
                            </ul>
                            ` : `
                            <p className="text-sm text-gray-500 italic">Tidak ada highlight untuk periode ini.</p>
                            `}
                        </div>
                    </div>`
    
    // Slide: Twindate Lowlight (always show after Highlight)
    slides += `
                    {/* EVENT ANALYSIS - TWINDATE LOWLIGHT */}
                    <div className="bg-white p-8 border-t-4 border-hadona-blue">
                        <div className="max-w-6xl mx-auto">
                            <h2 className="text-2xl font-bold text-hadona-blue mb-4">Lowlight (Event MoM) — Twindate</h2>
                            ${twindateLowlights.length > 0 ? `
                            <ul className="space-y-2 text-sm">
                                ${twindateLowlights.map(([key, metric]: [string, any]) => {
        const label = metricLabels[key] || key
        const thisValue = getMetricValue(twindateThis, key)
        const lastValue = getMetricValue(twindateLast, key)
        const formattedThis = formatMetricValue(key, thisValue)
        const formattedLast = formatMetricValue(key, lastValue)
        
        return `<li className="flex items-start">
                                                <span className="mr-2">${getTrendIconJSX(metric.isPositive)}</span>
                                                <span className="text-xs"><strong>${label}:</strong> ${metric.percentage >= 0 ? '' : ''}${Math.abs(metric.percentage).toFixed(2)}% (${formattedLast} → ${formattedThis})</span>
                                            </li>`
      }).join('')}
                            </ul>
                            ` : `
                            <p className="text-sm text-gray-500 italic">Tidak ada lowlight untuk periode ini.</p>
                            `}
                        </div>
                    </div>`
    
    // Slide: Twindate Table
    slides += `
                    {/* EVENT ANALYSIS - TWINDATE TABLE */}
                    <div className="bg-white p-8 border-t-4 border-hadona-blue">
                        <div className="max-w-6xl mx-auto">
                            <h2 className="text-2xl font-bold text-hadona-blue mb-4">Tabel Metric (MoM — Twindate)</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs border-collapse">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="border p-2 text-left">Metric</th>
                                            <th className="border p-2 text-right">${lastPeriodLabel}</th>
                                            <th className="border p-2 text-right">${thisPeriodLabel}</th>
                                            <th className="border p-2 text-right">∆%</th>
                                            <th className="border p-2 text-center">Trend</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="border p-2">Amount spent</td>
                                            <td className="border p-2 text-right">${formatCurrency(twindateLast.amountSpent || 0)}</td>
                                            <td className="border p-2 text-right">${formatCurrency(twindateThis.amountSpent || 0)}</td>
                                            <td className="border p-2 text-right">${twindateMetrics.amountSpent.percentage.toFixed(2)}%</td>
                                            <td className="border p-2 text-center">${getTrendIconJSX(twindateMetrics.amountSpent.isPositive)}</td>
                                        </tr>
                                        <tr>
                                            <td className="border p-2">Purchases with shared items</td>
                                            <td className="border p-2 text-right">${formatNumber(twindateLast.purchases || 0)}</td>
                                            <td className="border p-2 text-right">${formatNumber(twindateThis.purchases || 0)}</td>
                                            <td className="border p-2 text-right">${twindateMetrics.purchases.percentage.toFixed(2)}%</td>
                                            <td className="border p-2 text-center">${getTrendIconJSX(twindateMetrics.purchases.isPositive)}</td>
                                        </tr>
                                        <tr>
                                            <td className="border p-2">Cost per purchases with shared items</td>
                                            <td className="border p-2 text-right">${formatCurrency(twindateLast.costPerPurchase || 0)}</td>
                                            <td className="border p-2 text-right">${formatCurrency(twindateThis.costPerPurchase || 0)}</td>
                                            <td className="border p-2 text-right">${twindateMetrics.costPerPurchase.percentage.toFixed(2)}%</td>
                                            <td className="border p-2 text-center">${getTrendIconJSX(twindateMetrics.costPerPurchase.isPositive)}</td>
                                        </tr>
                                        <tr>
                                            <td className="border p-2">Purchases conversion value for shared items only</td>
                                            <td className="border p-2 text-right">${formatCurrency(twindateLast.purchasesConversionValue || 0)}</td>
                                            <td className="border p-2 text-right">${formatCurrency(twindateThis.purchasesConversionValue || 0)}</td>
                                            <td className="border p-2 text-right">${twindateMetrics.purchasesConversionValue.percentage.toFixed(2)}%</td>
                                            <td className="border p-2 text-center">${getTrendIconJSX(twindateMetrics.purchasesConversionValue.isPositive)}</td>
                                        </tr>
                                        <tr>
                                            <td className="border p-2">Conversion Rate (Purchase ÷ Click)</td>
                                            <td className="border p-2 text-right">${formatPercent((twindateLast.conversionRate || 0) * 100)}</td>
                                            <td className="border p-2 text-right">${formatPercent((twindateThis.conversionRate || 0) * 100)}</td>
                                            <td className="border p-2 text-right">${twindateMetrics.conversionRate.percentage.toFixed(2)}%</td>
                                            <td className="border p-2 text-center">${getTrendIconJSX(twindateMetrics.conversionRate.isPositive)}</td>
                                        </tr>
                                        <tr>
                                            <td className="border p-2">Purchase ROAS (return on ad spend)</td>
                                            <td className="border p-2 text-right">${formatNumber(twindateLast.purchaseROAS || 0)}</td>
                                            <td className="border p-2 text-right">${formatNumber(twindateThis.purchaseROAS || 0)}</td>
                                            <td className="border p-2 text-right">${twindateMetrics.purchaseROAS.percentage.toFixed(2)}%</td>
                                            <td className="border p-2 text-center">${getTrendIconJSX(twindateMetrics.purchaseROAS.isPositive)}</td>
                                        </tr>
                                        <tr>
                                            <td className="border p-2">Average purchases conversion value</td>
                                            <td className="border p-2 text-right">${formatCurrency(twindateLast.avgPurchaseValue || 0)}</td>
                                            <td className="border p-2 text-right">${formatCurrency(twindateThis.avgPurchaseValue || 0)}</td>
                                            <td className="border p-2 text-right">${twindateMetrics.avgPurchaseValue.percentage.toFixed(2)}%</td>
                                            <td className="border p-2 text-center">${getTrendIconJSX(twindateMetrics.avgPurchaseValue.isPositive)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>`
  }
  
  // Generate Payday slides if data exists
  if (hasPaydayData) {
    // Get highlights and lowlights for Payday
    const paydayHighlights = Object.entries(paydayMetrics)
      .filter(([_, metric]: [string, any]) => metric.isPositive && Math.abs(metric.percentage) >= 1)
      .sort(([_, a]: [string, any], [__, b]: [string, any]) => Math.abs(b.percentage) - Math.abs(a.percentage))
      .slice(0, 10)
    
    const paydayLowlights = Object.entries(paydayMetrics)
      .filter(([_, metric]: [string, any]) => !metric.isPositive && Math.abs(metric.percentage) >= 1)
      .sort(([_, a]: [string, any], [__, b]: [string, any]) => Math.abs(b.percentage) - Math.abs(a.percentage))
      .slice(0, 5)
    
    const metricLabels: Record<string, string> = {
      amountSpent: 'Amount spent',
      purchases: 'Purchases with shared items',
      costPerPurchase: 'Cost per purchases with shared items',
      purchasesConversionValue: 'Purchases conversion value for shared items only',
      conversionRate: 'Conversion Rate (Purchase ÷ Click)',
      purchaseROAS: 'Purchase ROAS (return on ad spend)',
      avgPurchaseValue: 'Average purchases conversion value',
      addsToCart: 'Adds to cart with shared items',
      costPerATC: 'Cost per add to cart with shared items',
      atcConversionValue: 'ATC conversion value (shared only)',
      ctr: 'CTR (link click-through rate)',
      cpc: 'CPC (link)',
      frequency: 'Frequency',
      cpm: 'CPM'
    }
    
    // Slide: Payday Highlight
    if (paydayHighlights.length > 0) {
      slides += `
                    {/* EVENT ANALYSIS - PAYDAY HIGHLIGHT */}
                    <div className="bg-white p-8 border-t-4 border-hadona-blue">
                        <div className="max-w-6xl mx-auto">
                            <h2 className="text-2xl font-bold text-hadona-blue mb-4">Highlight (Event MoM) — Payday (≥25)</h2>
                            <ul className="space-y-2 text-sm">
                                ${paydayHighlights.map(([key, metric]: [string, any]) => {
      const label = metricLabels[key] || key
      const thisValue = getMetricValue(paydayThis, key)
      const lastValue = getMetricValue(paydayLast, key)
      const formattedThis = formatMetricValue(key, thisValue)
      const formattedLast = formatMetricValue(key, lastValue)
      
      return `<li className="flex items-start">
                                            <span className="mr-2">${getTrendIconJSX(metric.isPositive)}</span>
                                            <span className="text-xs"><strong>${label}:</strong> ${metric.percentage >= 0 ? '' : ''}${Math.abs(metric.percentage).toFixed(2)}% (${formattedLast} → ${formattedThis})</span>
                                        </li>`
    }).join('')}
                            </ul>
                        </div>
                    </div>`
    }
    
    // Slide: Payday Lowlight
    if (paydayLowlights.length > 0) {
      slides += `
                    {/* EVENT ANALYSIS - PAYDAY LOWLIGHT */}
                    <div className="bg-white p-8 border-t-4 border-hadona-blue">
                        <div className="max-w-6xl mx-auto">
                            <h2 className="text-2xl font-bold text-hadona-blue mb-4">Lowlight (Event MoM) — Payday (≥25)</h2>
                            <ul className="space-y-2 text-sm">
                                ${paydayLowlights.map(([key, metric]: [string, any]) => {
        const label = metricLabels[key] || key
        const thisValue = getMetricValue(paydayThis, key)
        const lastValue = getMetricValue(paydayLast, key)
        const formattedThis = formatMetricValue(key, thisValue)
        const formattedLast = formatMetricValue(key, lastValue)
        
        return `<li className="flex items-start">
                                                <span className="mr-2">${getTrendIconJSX(metric.isPositive)}</span>
                                                <span className="text-xs"><strong>${label}:</strong> ${metric.percentage >= 0 ? '' : ''}${Math.abs(metric.percentage).toFixed(2)}% (${formattedLast} → ${formattedThis})</span>
                                            </li>`
      }).join('')}
                            </ul>
                        </div>
                    </div>`
    }
    
    // Slide: Payday Table
    slides += `
                    {/* EVENT ANALYSIS - PAYDAY TABLE */}
                    <div className="bg-white p-8 border-t-4 border-hadona-blue">
                        <div className="max-w-6xl mx-auto">
                            <h2 className="text-2xl font-bold text-hadona-blue mb-4">Tabel Metric (MoM — Payday)</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs border-collapse">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="border p-2 text-left">Metric</th>
                                            <th className="border p-2 text-right">Bulan-2 (≥25)</th>
                                            <th className="border p-2 text-right">Bulan-1 (≥25)</th>
                                            <th className="border p-2 text-right">∆%</th>
                                            <th className="border p-2 text-center">Trend</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="border p-2">Amount spent</td>
                                            <td className="border p-2 text-right">${formatCurrency(paydayLast.amountSpent || 0)}</td>
                                            <td className="border p-2 text-right">${formatCurrency(paydayThis.amountSpent || 0)}</td>
                                            <td className="border p-2 text-right">${paydayMetrics.amountSpent.percentage.toFixed(2)}%</td>
                                            <td className="border p-2 text-center">${getTrendIconJSX(paydayMetrics.amountSpent.isPositive)}</td>
                                        </tr>
                                        <tr>
                                            <td className="border p-2">Purchases with shared items</td>
                                            <td className="border p-2 text-right">${formatNumber(paydayLast.purchases || 0)}</td>
                                            <td className="border p-2 text-right">${formatNumber(paydayThis.purchases || 0)}</td>
                                            <td className="border p-2 text-right">${paydayMetrics.purchases.percentage.toFixed(2)}%</td>
                                            <td className="border p-2 text-center">${getTrendIconJSX(paydayMetrics.purchases.isPositive)}</td>
                                        </tr>
                                        <tr>
                                            <td className="border p-2">Cost per purchases with shared items</td>
                                            <td className="border p-2 text-right">${formatCurrency(paydayLast.costPerPurchase || 0)}</td>
                                            <td className="border p-2 text-right">${formatCurrency(paydayThis.costPerPurchase || 0)}</td>
                                            <td className="border p-2 text-right">${paydayMetrics.costPerPurchase.percentage.toFixed(2)}%</td>
                                            <td className="border p-2 text-center">${getTrendIconJSX(paydayMetrics.costPerPurchase.isPositive)}</td>
                                        </tr>
                                        <tr>
                                            <td className="border p-2">Purchases conversion value for shared items only</td>
                                            <td className="border p-2 text-right">${formatCurrency(paydayLast.purchasesConversionValue || 0)}</td>
                                            <td className="border p-2 text-right">${formatCurrency(paydayThis.purchasesConversionValue || 0)}</td>
                                            <td className="border p-2 text-right">${paydayMetrics.purchasesConversionValue.percentage.toFixed(2)}%</td>
                                            <td className="border p-2 text-center">${getTrendIconJSX(paydayMetrics.purchasesConversionValue.isPositive)}</td>
                                        </tr>
                                        <tr>
                                            <td className="border p-2">Conversion Rate (Purchase ÷ Click)</td>
                                            <td className="border p-2 text-right">${formatPercent((paydayLast.conversionRate || 0) * 100)}</td>
                                            <td className="border p-2 text-right">${formatPercent((paydayThis.conversionRate || 0) * 100)}</td>
                                            <td className="border p-2 text-right">${paydayMetrics.conversionRate.percentage.toFixed(2)}%</td>
                                            <td className="border p-2 text-center">${getTrendIconJSX(paydayMetrics.conversionRate.isPositive)}</td>
                                        </tr>
                                        <tr>
                                            <td className="border p-2">Purchase ROAS (return on ad spend)</td>
                                            <td className="border p-2 text-right">${formatNumber(paydayLast.purchaseROAS || 0)}</td>
                                            <td className="border p-2 text-right">${formatNumber(paydayThis.purchaseROAS || 0)}</td>
                                            <td className="border p-2 text-right">${paydayMetrics.purchaseROAS.percentage.toFixed(2)}%</td>
                                            <td className="border p-2 text-center">${getTrendIconJSX(paydayMetrics.purchaseROAS.isPositive)}</td>
                                        </tr>
                                        <tr>
                                            <td className="border p-2">Average purchases conversion value</td>
                                            <td className="border p-2 text-right">${formatCurrency(paydayLast.avgPurchaseValue || 0)}</td>
                                            <td className="border p-2 text-right">${formatCurrency(paydayThis.avgPurchaseValue || 0)}</td>
                                            <td className="border p-2 text-right">${paydayMetrics.avgPurchaseValue.percentage.toFixed(2)}%</td>
                                            <td className="border p-2 text-center">${getTrendIconJSX(paydayMetrics.avgPurchaseValue.isPositive)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>`
  }
  
  // Slide: Next Action Plan (Event)
  if (hasTwindateData || hasPaydayData) {
    slides += `
                    {/* EVENT ANALYSIS - NEXT ACTION PLAN */}
                    <div className="bg-white p-8 border-t-4 border-hadona-blue">
                        <div className="max-w-6xl mx-auto">
                            <h2 className="text-2xl font-bold text-hadona-blue mb-4">Next Action Plan (Event)</h2>
                            <ul className="space-y-2 text-sm">
                                <li className="flex items-start">
                                    <i className="fas fa-arrow-right text-blue-500 mt-1 mr-2 text-xs"></i>
                                    <span className="text-xs">Pulihkan metrik yang turun pada window event; aktifkan pre-heat 3–5 hari sebelum puncak.</span>
                                </li>
                                <li className="flex items-start">
                                    <i className="fas fa-arrow-right text-blue-500 mt-1 mr-2 text-xs"></i>
                                    <span className="text-xs">Pakai countdown & scarcity copy spesifik (contoh: 'Hanya hari ini 9.9').</span>
                                </li>
                                <li className="flex items-start">
                                    <i className="fas fa-arrow-right text-blue-500 mt-1 mr-2 text-xs"></i>
                                    <span className="text-xs">Budget pacing: naikkan 20–30% H-1 s/d H+1 jika ROAS stabil; turunkan jika CPC/CPM naik.</span>
                                </li>
                                <li className="flex items-start">
                                    <i className="fas fa-arrow-right text-blue-500 mt-1 mr-2 text-xs"></i>
                                    <span className="text-xs">Bundling/upsell untuk dorong Average purchases conversion value.</span>
                                </li>
                                <li className="flex items-start">
                                    <i className="fas fa-arrow-right text-blue-500 mt-1 mr-2 text-xs"></i>
                                    <span className="text-xs">Aktifkan Advantage+ placement & optimasi katalog saat traffic puncak.</span>
                                </li>
                            </ul>
                        </div>
                    </div>`
  }
  
  return slides
}
