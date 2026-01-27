import { 
  SHARED_CSS, 
  LOGO_URL, 
  formatNumber, 
  formatCurrency, 
  formatPercent, 
  parseNum, 
  calculateGrowth,
  getGrowthBadge,
  getGrowthClass,
  generateCoverSlide
} from '../shared-styles'

export function generateReactTailwindReport(analysisData: any, reportName?: string, retentionType?: string, objectiveType: string = 'ctlptowa'): string {
  console.log('[CTLPTOWA Template] Starting report generation...')

  const data = typeof analysisData === 'string' ? JSON.parse(analysisData) : analysisData
  const perf = data?.performanceSummary || {}
  const thisWeek = perf.thisWeek || {}
  const lastWeek = perf.lastWeek || {}
  const breakdown = data?.breakdown || {}

  // Labels
  const isMoM = retentionType === 'mom'
  const comparisonLabel = isMoM ? 'Month-over-Month' : 'Week-over-Week'
  const thisPeriodLabel = isMoM ? 'Bulan Ini (This Month)' : 'Minggu Ini (This Week)'
  const lastPeriodLabel = isMoM ? 'Bulan Lalu (Last Month)' : 'Minggu Lalu (Last Week)'
  const shortThisPeriod = isMoM ? 'Bulan Ini' : 'Minggu Ini'
  const shortLastPeriod = isMoM ? 'Bulan Lalu' : 'Minggu Lalu'
  const defaultReportName = reportName || 'Meta Ads Performance Report'

  const thisWeekData = thisWeek || {}
  const lastWeekData = lastWeek || {}
  const breakdownThisWeek = breakdown?.thisWeek || {}
  const breakdownLastWeek = breakdown?.lastWeek || {}

  // Extract metrics - CTLPTOWA specific
  const thisSpent = parseNum(thisWeekData.amountSpent)
  const lastSpent = parseNum(lastWeekData.amountSpent)
  const thisResults = parseNum(thisWeekData.checkoutsInitiated || thisWeekData.checkoutInitiated || 0)
  const lastResults = parseNum(lastWeekData.checkoutsInitiated || lastWeekData.checkoutInitiated || 0)

  // Calculate CPR manually: Amount Spent / Checkouts Initiated
  const thisCPR = thisResults > 0 ? thisSpent / thisResults : 0
  const lastCPR = lastResults > 0 ? lastSpent / lastResults : 0

  const thisImpr = parseNum(thisWeekData.impressions)
  const lastImpr = parseNum(lastWeekData.impressions)
  const thisReach = parseNum(thisWeekData.reach)
  const lastReach = parseNum(lastWeekData.reach)
  const thisCTR = parseNum(thisWeekData.ctr || thisWeekData.ctrAll || 0)
  const lastCTR = parseNum(lastWeekData.ctr || lastWeekData.ctrAll || 0)
  const thisCPC = parseNum(thisWeekData.cpc)
  const lastCPC = parseNum(lastWeekData.cpc)
  const thisCPM = parseNum(thisWeekData.cpm)
  const lastCPM = parseNum(lastWeekData.cpm)
  const thisOutboundClicks = parseNum(thisWeekData.outboundClicks)
  const lastOutboundClicks = parseNum(lastWeekData.outboundClicks)
  const thisLinkClicks = parseNum(thisWeekData.linkClicks)
  const lastLinkClicks = parseNum(lastWeekData.linkClicks)
  const thisLPV = parseNum(thisWeekData.landingPageViews)
  const lastLPV = parseNum(lastWeekData.landingPageViews)

  // Calculate growth
  const spendGrowth = calculateGrowth(thisSpent, lastSpent)
  const resultsGrowth = calculateGrowth(thisResults, lastResults)
  const cprGrowth = calculateGrowth(thisCPR, lastCPR)
  const imprGrowth = calculateGrowth(thisImpr, lastImpr)
  const reachGrowth = calculateGrowth(thisReach, lastReach)
  const ctrGrowth = calculateGrowth(thisCTR, lastCTR)
  const cpcGrowth = calculateGrowth(thisCPC, lastCPC)
  const cpmGrowth = calculateGrowth(thisCPM, lastCPM)
  const clicksGrowth = calculateGrowth(thisOutboundClicks, lastOutboundClicks)
  const lpvGrowth = calculateGrowth(thisLPV, lastLPV)

  // CTLPTOWA specific ratios
  const thisOCtoLPV = thisOutboundClicks > 0 ? (thisLPV / thisOutboundClicks) * 100 : 0
  const lastOCtoLPV = lastOutboundClicks > 0 ? (lastLPV / lastOutboundClicks) * 100 : 0
  const thisLPVtoIC = thisLPV > 0 ? (thisResults / thisLPV) * 100 : 0
  const lastLPVtoIC = lastLPV > 0 ? (lastResults / lastLPV) * 100 : 0

  // Breakdown data
  const ageData = breakdownThisWeek.age || []
  const genderData = breakdownThisWeek.gender || []
  const regionData = breakdownThisWeek.region || []
  const platformData = breakdownThisWeek.platform || []
  const placementData = breakdownThisWeek.placement || []
  const objectiveData = breakdownThisWeek.objective || []
  const adCreativeData = breakdownThisWeek['ad-creative'] || breakdownThisWeek.adCreative || []

  let slideNumber = 1

  // Generate HTML
  let html = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${comparisonLabel} CTLPTOWA Report - ${defaultReportName}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        ${SHARED_CSS}
    </style>
</head>
<body>

    ${generateCoverSlide(defaultReportName, `${shortLastPeriod} vs ${shortThisPeriod}`, 'ctlptowa', comparisonLabel)}

    <!-- SLIDE 2: PERFORMANCE SUMMARY -->
    <div class="slide" data-slide="${++slideNumber}">
        <img src="${LOGO_URL}" alt="Hadona Logo" class="logo">

        <div style="margin-top: 60px; margin-bottom: 24px;">
            <h1>Performance Summary</h1>
            <h2>${comparisonLabel} Comparison</h2>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 24px;">
            <!-- This Period -->
            <div class="card">
                <div class="metric-label">${thisPeriodLabel}</div>
                <div style="margin-top: 16px;">
                    <div class="metric-label">Amount Spent</div>
                    <div class="metric-value">${formatCurrency(thisSpent)}</div>
                </div>
                <div style="margin-top: 16px;">
                    <div class="metric-label">Results (Checkouts Initiated)</div>
                    <div class="metric-value">${formatNumber(thisResults)}</div>
                </div>
                <div style="margin-top: 16px;">
                    <div class="metric-label">Cost per Checkout</div>
                    <div class="metric-value">${formatCurrency(thisCPR)}</div>
                </div>
                <div style="margin-top: 16px;">
                    ${getGrowthBadge(spendGrowth)}
                </div>
            </div>

            <!-- Last Period -->
            <div class="card">
                <div class="metric-label">${lastPeriodLabel}</div>
                <div style="margin-top: 16px;">
                    <div class="metric-label">Amount Spent</div>
                    <div class="metric-value">${formatCurrency(lastSpent)}</div>
                </div>
                <div style="margin-top: 16px;">
                    <div class="metric-label">Results (Checkouts Initiated)</div>
                    <div class="metric-value">${formatNumber(lastResults)}</div>
                </div>
                <div style="margin-top: 16px;">
                    <div class="metric-label">Cost per Checkout</div>
                    <div class="metric-value">${formatCurrency(lastCPR)}</div>
                </div>
                <div style="margin-top: 16px;">
                    <span class="badge badge-yellow">Previous Period</span>
                </div>
            </div>
        </div>

        <div class="key-insight">
            <p><strong>Key Insight:</strong> ${spendGrowth >= 0 ? 'Peningkatan' : 'Penurunan'} spend sebesar ${Math.abs(spendGrowth).toFixed(1)}% dengan ${resultsGrowth >= 0 ? 'peningkatan' : 'penurunan'} checkouts initiated sebesar ${Math.abs(resultsGrowth).toFixed(1)}%. CPR ${cprGrowth <= 0 ? 'turun' : 'naik'} ${Math.abs(cprGrowth).toFixed(1)}% menunjukkan efisiensi biaya yang ${cprGrowth <= 0 ? 'lebih baik' : 'perlu diperbaiki'}.</p>
        </div>
    </div>

    <!-- SLIDE 3: DETAILED METRICS -->
    <div class="slide" data-slide="${++slideNumber}">
        <img src="${LOGO_URL}" alt="Hadona Logo" class="logo">

        <div style="margin-top: 60px; margin-bottom: 20px;">
            <h1>Detailed Performance Metrics</h1>
            <h2>Complete ${comparisonLabel} Comparison</h2>
        </div>

        <div style="overflow-x: auto;">
            <table>
                <thead>
                    <tr>
                        <th>Metrik</th>
                        <th class="text-right">${shortLastPeriod}</th>
                        <th class="text-right">${shortThisPeriod}</th>
                        <th class="text-right">Trending Value</th>
                        <th class="text-right">Trending %</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Amount Spent (IDR)</strong></td>
                        <td class="text-right">${formatNumber(lastSpent)}</td>
                        <td class="text-right">${formatNumber(thisSpent)}</td>
                        <td class="text-right ${getGrowthClass(spendGrowth)}">${thisSpent - lastSpent >= 0 ? '+' : ''}${formatNumber(thisSpent - lastSpent)}</td>
                        <td class="text-right">${getGrowthBadge(spendGrowth)}</td>
                    </tr>
                    <tr>
                        <td><strong>Reach</strong></td>
                        <td class="text-right">${formatNumber(lastReach)}</td>
                        <td class="text-right">${formatNumber(thisReach)}</td>
                        <td class="text-right ${getGrowthClass(reachGrowth)}">${thisReach - lastReach >= 0 ? '+' : ''}${formatNumber(thisReach - lastReach)}</td>
                        <td class="text-right">${getGrowthBadge(reachGrowth)}</td>
                    </tr>
                    <tr>
                        <td><strong>Impressions</strong></td>
                        <td class="text-right">${formatNumber(lastImpr)}</td>
                        <td class="text-right">${formatNumber(thisImpr)}</td>
                        <td class="text-right ${getGrowthClass(imprGrowth)}">${thisImpr - lastImpr >= 0 ? '+' : ''}${formatNumber(thisImpr - lastImpr)}</td>
                        <td class="text-right">${getGrowthBadge(imprGrowth)}</td>
                    </tr>
                    <tr>
                        <td><strong>Link Clicks</strong></td>
                        <td class="text-right">${formatNumber(lastLinkClicks)}</td>
                        <td class="text-right">${formatNumber(thisLinkClicks)}</td>
                        <td class="text-right ${getGrowthClass(clicksGrowth)}">${thisLinkClicks - lastLinkClicks >= 0 ? '+' : ''}${formatNumber(thisLinkClicks - lastLinkClicks)}</td>
                        <td class="text-right">${getGrowthBadge(clicksGrowth)}</td>
                    </tr>
                    <tr>
                        <td><strong>Outbound Clicks</strong></td>
                        <td class="text-right">${formatNumber(lastOutboundClicks)}</td>
                        <td class="text-right">${formatNumber(thisOutboundClicks)}</td>
                        <td class="text-right ${getGrowthClass(clicksGrowth)}">${thisOutboundClicks - lastOutboundClicks >= 0 ? '+' : ''}${formatNumber(thisOutboundClicks - lastOutboundClicks)}</td>
                        <td class="text-right">${getGrowthBadge(clicksGrowth)}</td>
                    </tr>
                    <tr>
                        <td><strong>Landing Page Views</strong></td>
                        <td class="text-right">${formatNumber(lastLPV)}</td>
                        <td class="text-right">${formatNumber(thisLPV)}</td>
                        <td class="text-right ${getGrowthClass(lpvGrowth)}">${thisLPV - lastLPV >= 0 ? '+' : ''}${formatNumber(thisLPV - lastLPV)}</td>
                        <td class="text-right">${getGrowthBadge(lpvGrowth)}</td>
                    </tr>
                    <tr>
                        <td><strong>CTR (Link)</strong></td>
                        <td class="text-right">${formatPercent(lastCTR)}</td>
                        <td class="text-right">${formatPercent(thisCTR)}</td>
                        <td class="text-right ${getGrowthClass(ctrGrowth)}">${thisCTR - lastCTR >= 0 ? '+' : ''}${formatPercent(thisCTR - lastCTR)}</td>
                        <td class="text-right">${getGrowthBadge(ctrGrowth)}</td>
                    </tr>
                    <tr>
                        <td><strong>CPC (Link)</strong></td>
                        <td class="text-right">${formatCurrency(lastCPC)}</td>
                        <td class="text-right">${formatCurrency(thisCPC)}</td>
                        <td class="text-right ${getGrowthClass(cpcGrowth, true)}">${thisCPC - lastCPC >= 0 ? '+' : ''}${formatCurrency(thisCPC - lastCPC)}</td>
                        <td class="text-right">${getGrowthBadge(cpcGrowth, true)}</td>
                    </tr>
                    <tr>
                        <td><strong>CPM</strong></td>
                        <td class="text-right">${formatCurrency(lastCPM)}</td>
                        <td class="text-right">${formatCurrency(thisCPM)}</td>
                        <td class="text-right ${getGrowthClass(cpmGrowth, true)}">${thisCPM - lastCPM >= 0 ? '+' : ''}${formatCurrency(thisCPM - lastCPM)}</td>
                        <td class="text-right">${getGrowthBadge(cpmGrowth, true)}</td>
                    </tr>
                    <tr>
                        <td><strong>Checkouts Initiated</strong></td>
                        <td class="text-right">${formatNumber(lastResults)}</td>
                        <td class="text-right">${formatNumber(thisResults)}</td>
                        <td class="text-right ${getGrowthClass(resultsGrowth)}">${thisResults - lastResults >= 0 ? '+' : ''}${formatNumber(thisResults - lastResults)}</td>
                        <td class="text-right">${getGrowthBadge(resultsGrowth)}</td>
                    </tr>
                    <tr>
                        <td><strong>Cost per Checkout (CPR)</strong></td>
                        <td class="text-right">${formatCurrency(lastCPR)}</td>
                        <td class="text-right">${formatCurrency(thisCPR)}</td>
                        <td class="text-right ${getGrowthClass(cprGrowth, true)}">${thisCPR - lastCPR >= 0 ? '+' : ''}${formatCurrency(thisCPR - lastCPR)}</td>
                        <td class="text-right">${getGrowthBadge(cprGrowth, true)}</td>
                    </tr>
                    <tr>
                        <td><strong>OC → LPV Ratio</strong></td>
                        <td class="text-right">${formatPercent(lastOCtoLPV)}</td>
                        <td class="text-right">${formatPercent(thisOCtoLPV)}</td>
                        <td class="text-right ${getGrowthClass(thisOCtoLPV - lastOCtoLPV)}">${thisOCtoLPV - lastOCtoLPV >= 0 ? '+' : ''}${formatPercent(thisOCtoLPV - lastOCtoLPV)}</td>
                        <td class="text-right">${getGrowthBadge(calculateGrowth(thisOCtoLPV, lastOCtoLPV))}</td>
                    </tr>
                    <tr>
                        <td><strong>LPV → Checkout Ratio</strong></td>
                        <td class="text-right">${formatPercent(lastLPVtoIC)}</td>
                        <td class="text-right">${formatPercent(thisLPVtoIC)}</td>
                        <td class="text-right ${getGrowthClass(thisLPVtoIC - lastLPVtoIC)}">${thisLPVtoIC - lastLPVtoIC >= 0 ? '+' : ''}${formatPercent(thisLPVtoIC - lastLPVtoIC)}</td>
                        <td class="text-right">${getGrowthBadge(calculateGrowth(thisLPVtoIC, lastLPVtoIC))}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="key-insight">
            <p><strong>Kesimpulan:</strong> ${thisResults > lastResults ? 'Performa meningkat' : 'Performa menurun'} dengan ${formatNumber(thisResults)} checkouts initiated. Funnel conversion: OC→LPV ${formatPercent(thisOCtoLPV)}, LPV→Checkout ${formatPercent(thisLPVtoIC)}. ${thisCPR < lastCPR ? 'CPR turun menjadi lebih efisien' : 'CPR naik, perlu optimasi landing page'}.</p>
        </div>
    </div>

    <!-- SLIDE 4: HIGHLIGHTS & LOWLIGHTS -->
    <div class="slide" data-slide="${++slideNumber}">
        <img src="${LOGO_URL}" alt="Hadona Logo" class="logo">

        <div style="margin-top: 60px; margin-bottom: 20px;">
            <h1>${comparisonLabel} Analysis</h1>
            <h2>Highlights & Lowlights</h2>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
            <!-- Highlights -->
            <div class="highlight-col" style="padding: 20px; border-radius: 12px;">
                <h3 style="color: var(--green-growth); margin-bottom: 16px;">
                    ↑ Highlights
                </h3>
                ${resultsGrowth > 0 ? `
                <div class="point-item">
                    <span style="color: var(--green-growth);">✓</span>
                    <div>
                        <strong>+${formatNumber(thisResults - lastResults)} Checkouts Initiated</strong><br>
                        Meningkat ${resultsGrowth.toFixed(1)}% dari periode sebelumnya
                    </div>
                </div>
                ` : ''}
                ${cprGrowth < 0 ? `
                <div class="point-item">
                    <span style="color: var(--green-growth);">✓</span>
                    <div>
                        <strong>CPR Turun ${Math.abs(cprGrowth).toFixed(1)}%</strong><br>
                        Dari ${formatCurrency(lastCPR)} ke ${formatCurrency(thisCPR)}
                    </div>
                </div>
                ` : ''}
                ${lpvGrowth > 0 ? `
                <div class="point-item">
                    <span style="color: var(--green-growth);">✓</span>
                    <div>
                        <strong>Landing Page Views +${lpvGrowth.toFixed(1)}%</strong><br>
                        Meningkat ke ${formatNumber(thisLPV)} views
                    </div>
                </div>
                ` : ''}
                ${cpmGrowth < 0 ? `
                <div class="point-item">
                    <span style="color: var(--green-growth);">✓</span>
                    <div>
                        <strong>CPM Turun ${Math.abs(cpmGrowth).toFixed(1)}%</strong><br>
                        Biaya impressi lebih efisien (${formatCurrency(thisCPM)})
                    </div>
                </div>
                ` : ''}
            </div>

            <!-- Lowlights -->
            <div class="lowlight-col" style="padding: 20px; border-radius: 12px;">
                <h3 style="color: var(--red-decline); margin-bottom: 16px;">
                    ↓ Lowlights
                </h3>
                ${resultsGrowth < 0 ? `
                <div class="point-item">
                    <span style="color: var(--red-decline);">✗</span>
                    <div>
                        <strong>Checkouts Turun ${Math.abs(resultsGrowth).toFixed(1)}%</strong><br>
                        Dari ${formatNumber(lastResults)} ke ${formatNumber(thisResults)}
                    </div>
                </div>
                ` : ''}
                ${cprGrowth > 0 ? `
                <div class="point-item">
                    <span style="color: var(--red-decline);">✗</span>
                    <div>
                        <strong>CPR Naik ${cprGrowth.toFixed(1)}%</strong><br>
                        Dari ${formatCurrency(lastCPR)} ke ${formatCurrency(thisCPR)}
                    </div>
                </div>
                ` : ''}
                ${ctrGrowth < 0 ? `
                <div class="point-item">
                    <span style="color: var(--red-decline);">✗</span>
                    <div>
                        <strong>CTR Turun ${Math.abs(ctrGrowth).toFixed(1)}%</strong><br>
                        Dari ${formatPercent(lastCTR)} ke ${formatPercent(thisCTR)}
                    </div>
                </div>
                ` : ''}
                ${thisLPVtoIC < lastLPVtoIC ? `
                <div class="point-item">
                    <span style="color: var(--red-decline);">✗</span>
                    <div>
                        <strong>Conversion Rate Turun</strong><br>
                        LPV→Checkout dari ${formatPercent(lastLPVtoIC)} ke ${formatPercent(thisLPVtoIC)}
                    </div>
                </div>
                ` : ''}
            </div>
        </div>

        <div class="key-insight">
            <p><strong>Insight Utama:</strong> ${resultsGrowth >= 0 && cprGrowth <= 0 ? 'Performa campaign sangat baik dengan peningkatan checkouts dan efisiensi biaya yang lebih baik.' : resultsGrowth >= 0 ? 'Checkouts meningkat namun perlu perhatian pada efisiensi biaya dan landing page conversion.' : 'Perlu optimasi funnel dari landing page ke checkout untuk meningkatkan konversi.'}</p>
        </div>
    </div>`

  // Breakdown slides
  slideNumber++

  // Age Breakdown
  if (ageData.length > 0) {
    html += generateBreakdownSlide(
      'Audience Performance: Age',
      ageData,
      breakdownLastWeek.age || [],
      'Checkouts initiated',
      'Age',
      formatNumber,
      ++slideNumber
    )
  }

  // Gender Breakdown
  if (genderData.length > 0) {
    html += generateBreakdownSlide(
      'Audience Performance: Gender',
      genderData,
      breakdownLastWeek.gender || [],
      'Checkouts initiated',
      'Gender',
      formatNumber,
      ++slideNumber
    )
  }

  // Region Breakdown
  if (regionData.length > 0) {
    html += generateBreakdownSlide(
      'Audience Performance: Region',
      regionData,
      breakdownLastWeek.region || [],
      'Checkouts initiated',
      'Region',
      formatNumber,
      ++slideNumber
    )
  }

  // Platform Breakdown
  if (platformData.length > 0) {
    html += generateBreakdownSlide(
      'Platform Performance',
      platformData,
      breakdownLastWeek.platform || [],
      'Checkouts initiated',
      'Platform',
      formatNumber,
      ++slideNumber
    )
  }

  // Placement Breakdown
  if (placementData.length > 0) {
    html += generateBreakdownSlide(
      'Placement Performance',
      placementData,
      breakdownLastWeek.placement || [],
      'Checkouts initiated',
      'Placement',
      formatNumber,
      ++slideNumber
    )
  }

  // Objective Breakdown
  if (objectiveData.length > 0) {
    html += generateObjectiveSlide(
      objectiveData,
      breakdownLastWeek.objective || [],
      'Checkouts initiated',
      formatNumber,
      ++slideNumber
    )
  }

  // Ad Creative Breakdown
  if (adCreativeData.length > 0) {
    html += generateAdCreativeSlide(
      adCreativeData,
      breakdownLastWeek['ad-creative'] || breakdownLastWeek.adCreative || [],
      'Checkouts initiated',
      formatNumber,
      ++slideNumber
    )
  }

  // Conclusion & Thank You
  html += `
    <!-- SLIDE: CONCLUSION -->
    <div class="slide" data-slide="${++slideNumber}">
        <img src="${LOGO_URL}" alt="Hadona Logo" class="logo">

        <div style="margin-top: 60px; margin-bottom: 24px;">
            <h1>Kesimpulan & Rekomendasi</h1>
            <h2>Strategic Action Plan</h2>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
            <div>
                <h3 style="color: var(--green-growth); margin-bottom: 16px;">✓ Yang Berfungsi Baik</h3>
                <div style="background: var(--neutral-50); padding: 20px; border-radius: 12px; border-left: 4px solid var(--green-growth);">
                    <ul style="list-style: none; padding: 0; margin: 0;">
                        <li style="padding: 8px 0; border-bottom: 1px solid var(--neutral-200); font-size: 13px;">
                            <strong>Checkouts Initiated:</strong> ${formatNumber(thisResults)} total checkouts
                        </li>
                        <li style="padding: 8px 0; border-bottom: 1px solid var(--neutral-200); font-size: 13px;">
                            <strong>Cost per Checkout:</strong> ${formatCurrency(thisCPR)}
                        </li>
                        <li style="padding: 8px 0; font-size: 13px;">
                            <strong>LPV to Checkout:</strong> ${formatPercent(thisLPVtoIC)} conversion rate
                        </li>
                    </ul>
                </div>
            </div>

            <div>
                <h3 style="color: var(--warning-amber); margin-bottom: 16px;">⚡ Item Aksi</h3>
                <div style="background: var(--neutral-50); padding: 20px; border-radius: 12px; border-left: 4px solid var(--warning-amber);">
                    <ul style="list-style: none; padding: 0; margin: 0;">
                        <li style="padding: 8px 0; border-bottom: 1px solid var(--neutral-200); font-size: 13px;">
                            <strong>1. Optimasi Landing Page:</strong> Tingkatkan conversion rate LPV→Checkout
                        </li>
                        <li style="padding: 8px 0; border-bottom: 1px solid var(--neutral-200); font-size: 13px;">
                            <strong>2. A/B Test CTA:</strong> Tes variasi tombol dan copy untuk meningkatkan checkout
                        </li>
                        <li style="padding: 8px 0; font-size: 13px;">
                            <strong>3. Retargeting:</strong> Target ulang pengunjung yang belum checkout
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="key-insight">
            <p><strong>Rekomendasi Strategis:</strong> ${resultsGrowth >= 0 && cprGrowth <= 0 ? 'Lanjutkan scaling dengan strategi saat ini. Fokus pada optimasi landing page untuk meningkatkan conversion rate.' : 'Fokus pada perbaikan funnel conversion. Optimalkan landing page dan checkout flow untuk menurunkan CPR.'}</p>
        </div>
    </div>

    <!-- SLIDE: THANK YOU -->
    <div class="slide" style="text-align: center; padding: 120px 64px; background: linear-gradient(135deg, white 0%, var(--neutral-50) 100%);" data-slide="${++slideNumber}">
        <img src="${LOGO_URL}" alt="Hadona Logo" style="width: 80px; height: 80px; margin: 0 auto 32px; display: block; border-radius: 16px;">

        <h1 style="font-size: 48px; margin-bottom: 24px; background: linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-yellow) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
            Thank You!
        </h1>
        <p style="font-size: 18px; color: var(--neutral-600); margin-bottom: 48px; font-weight: 500;">
            We appreciate your trust in managing your Meta Ads campaigns
        </p>

        <div style="background: linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-yellow) 100%);
                    padding: 32px; border-radius: 16px; color: white; max-width: 500px; margin: 0 auto; box-shadow: 0 8px 24px rgba(43, 70, 187, 0.25);">
            <p style="font-size: 18px; margin-bottom: 8px; font-weight: 700;">Questions or Feedback?</p>
            <p style="font-size: 14px; opacity: 0.9;">Contact us anytime for campaign consultation</p>
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.3); font-size: 12px; opacity: 0.8;">
                © 2026 Hadona Digital Media. All rights reserved.
            </div>
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
    return ''
  }

  const sortedData = [...thisWeekData]
    .filter(item => item[labelKey] && item[labelKey].trim && item[labelKey].trim())
    .sort((a, b) => {
      const resultA = parseNum(a[metricKey] || 0)
      const resultB = parseNum(b[metricKey] || 0)
      return resultB - resultA
    })
    .slice(0, 6)

  const topPerformer = sortedData[0]
  const topPerformerName = topPerformer ? topPerformer[labelKey] : 'N/A'
  const topPerformerValue = topPerformer ? parseNum(topPerformer[metricKey] || 0) : 0
  const totalValue = sortedData.reduce((sum, item) => sum + parseNum(item[metricKey] || 0), 0)
  const topPerformerPercentage = totalValue > 0 ? ((topPerformerValue / totalValue) * 100).toFixed(1) : '0'

  const avgCTR = sortedData.reduce((sum, item) => {
    const ctr = parseNum(item['CTR (link click-through rate)'] || 0)
    return sum + ctr
  }, 0) / Math.max(sortedData.length, 1)

  const tableRows = sortedData.map((item, index) => {
    const label = item[labelKey] || 'Unknown'
    const value = parseNum(item[metricKey] || 0)
    const impressions = parseNum(item['Impressions'] || 0)
    const linkClicks = parseNum(item['Outbound clicks'] || item['Link clicks'] || 0)
    const ctrLinkClick = parseNum(item['CTR (link click-through rate)'] || 0)
    const rowBg = index === 0 ? 'style="background: #f0fdf4;"' : index === 1 ? 'style="background: #fef9c3;"' : index === 2 ? 'style="background: #fed7aa;"' : ''
    const medal = index === 0 ? ' 🥇' : index === 1 ? ' 🥈' : index === 2 ? ' 🥉' : ''

    return `                    <tr ${rowBg}>
                        <td><strong>${label}${medal}</strong></td>
                        <td class="text-right">${formatFn(value)}</td>
                        <td class="text-right">${formatNumber(impressions)}</td>
                        <td class="text-right">${formatNumber(linkClicks)}</td>
                        <td class="text-right">${formatPercent(ctrLinkClick)}</td>
                    </tr>`
  }).join('\n')

  return `
    <!-- SLIDE: ${title} -->
    <div class="slide" data-slide="${slideNumber}">
        <img src="${LOGO_URL}" alt="Hadona Logo" class="logo">

        <div style="margin-top: 60px; margin-bottom: 20px;">
            <h1>${title}</h1>
            <h2>Top Performers by ${labelKey}</h2>
        </div>

        <div style="margin-bottom: 20px;">
            <h3 style="margin-bottom: 12px;">🏆 Performa Berdasarkan ${labelKey} (Top 3 Highlighted)</h3>
            <div style="overflow-x: auto;">
                <table style="font-size: 12px;">
                    <thead>
                        <tr>
                            <th>${labelKey}</th>
                            <th class="text-right">Checkouts Initiated</th>
                            <th class="text-right">Impressions</th>
                            <th class="text-right">Link Clicks</th>
                            <th class="text-right">CTR</th>
                        </tr>
                    </thead>
                    <tbody>
${tableRows}
                    </tbody>
                </table>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 20px;">
            <div class="card">
                <div class="metric-label">🏅 Top Performer</div>
                <div class="metric-value" style="font-size: 20px;">${topPerformerName}</div>
                <div style="margin-top: 8px;">
                    <div class="metric-label">Total Checkouts</div>
                    <div style="font-size: 18px; font-weight: 700; color: var(--primary-blue);">${formatFn(topPerformerValue)}</div>
                </div>
            </div>

            <div class="card">
                <div class="metric-label">📊 Market Share</div>
                <div class="metric-value" style="font-size: 20px;">${topPerformerPercentage}%</div>
                <div style="margin-top: 8px;">
                    <div class="metric-label">dari total konversi</div>
                </div>
            </div>

            <div class="card">
                <div class="metric-label">📈 Avg CTR</div>
                <div class="metric-value" style="font-size: 20px;">${avgCTR.toFixed(2)}%</div>
                <div style="margin-top: 8px;">
                    <div class="metric-label">di semua segmen</div>
                </div>
            </div>
        </div>

        <div class="key-insight">
            <p><strong>Insight:</strong> Top performer <strong>${topPerformerName}</strong> berkontribusi <strong>${topPerformerPercentage}%</strong> dari total checkouts dengan ${formatFn(topPerformerValue)} hasil. ${avgCTR > 1 ? 'CTR sangat baik di atas rata-rata industri.' : avgCTR > 0.5 ? 'CTR cukup baik.' : 'CTR perlu ditingkatkan.'}</p>
        </div>
    </div>`
}

function generateObjectiveSlide(
  thisWeekData: any[],
  lastWeekData: any[],
  metricKey: string,
  formatFn: (val: number) => string,
  slideNumber: number
): string {
  if (thisWeekData.length === 0) return ''

  const sortedData = [...thisWeekData]
    .filter(item => item['Objective'] && item['Objective'].trim && item['Objective'].trim())
    .sort((a, b) => {
      const resultA = parseNum(a[metricKey] || a['Results'] || 0)
      const resultB = parseNum(b[metricKey] || b['Results'] || 0)
      return resultB - resultA
    })
    .slice(0, 6)

  const totalSpent = sortedData.reduce((sum, item) => sum + parseNum(item['Amount spent (IDR)'] || 0), 0)
  const totalResults = sortedData.reduce((sum, item) => sum + parseNum(item[metricKey] || item['Results'] || 0), 0)

  const tableRows = sortedData.map((item, index) => {
    const objective = item['Objective'] || 'Unknown'
    const spent = parseNum(item['Amount spent (IDR)'] || 0)
    const results = parseNum(item[metricKey] || item['Results'] || 0)
    const cpr = results > 0 ? spent / results : 0
    const impressions = parseNum(item['Impressions'] || 0)
    const lpv = parseNum(item['Landing page views'] || 0)
    const rowBg = index === 0 ? 'style="background: #f0fdf4;"' : index === 1 ? 'style="background: #fef9c3;"' : index === 2 ? 'style="background: #fed7aa;"' : ''
    const medal = index === 0 ? ' 🥇' : index === 1 ? ' 🥈' : index === 2 ? ' 🥉' : ''

    return `                    <tr ${rowBg}>
                        <td><strong>${objective}${medal}</strong></td>
                        <td class="text-right">${formatCurrency(spent)}</td>
                        <td class="text-right">${formatFn(results)}</td>
                        <td class="text-right">${formatCurrency(cpr)}</td>
                        <td class="text-right">${formatNumber(lpv)}</td>
                        <td class="text-right">${formatNumber(impressions)}</td>
                    </tr>`
  }).join('\n')

  const topObjective = sortedData[0]
  const topObjectiveName = topObjective ? topObjective['Objective'] : 'N/A'
  const topObjectiveResults = topObjective ? parseNum(topObjective[metricKey] || topObjective['Results'] || 0) : 0
  const topObjectiveSpent = topObjective ? parseNum(topObjective['Amount spent (IDR)'] || 0) : 0
  const topObjectiveCPR = topObjectiveResults > 0 ? topObjectiveSpent / topObjectiveResults : 0

  return `
    <!-- SLIDE: OBJECTIVE PERFORMANCE -->
    <div class="slide" data-slide="${slideNumber}">
        <img src="${LOGO_URL}" alt="Hadona Logo" class="logo">

        <div style="margin-top: 60px; margin-bottom: 20px;">
            <h1>Objective Performance</h1>
            <h2>Performance by Campaign Objective</h2>
        </div>

        <div style="margin-bottom: 20px;">
            <h3 style="margin-bottom: 12px;">🎯 Performa Berdasarkan Objective (Top 3 Highlighted)</h3>
            <div style="overflow-x: auto;">
                <table style="font-size: 12px;">
                    <thead>
                        <tr>
                            <th>Objective</th>
                            <th class="text-right">Amount Spent</th>
                            <th class="text-right">Checkouts</th>
                            <th class="text-right">Cost/Checkout</th>
                            <th class="text-right">LPV</th>
                            <th class="text-right">Impressions</th>
                        </tr>
                    </thead>
                    <tbody>
${tableRows}
                    </tbody>
                </table>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-top: 20px;">
            <div class="card">
                <div class="metric-label">🎯 Top Objective</div>
                <div class="metric-value" style="font-size: 16px;">${topObjectiveName}</div>
            </div>
            <div class="card">
                <div class="metric-label">💰 Total Spent</div>
                <div class="metric-value" style="font-size: 16px;">${formatCurrency(totalSpent)}</div>
            </div>
            <div class="card">
                <div class="metric-label">📊 Total Checkouts</div>
                <div class="metric-value" style="font-size: 16px;">${formatFn(totalResults)}</div>
            </div>
            <div class="card">
                <div class="metric-label">💵 Best CPR</div>
                <div class="metric-value" style="font-size: 16px;">${formatCurrency(topObjectiveCPR)}</div>
            </div>
        </div>

        <div class="key-insight">
            <p><strong>Insight:</strong> Objective <strong>${topObjectiveName}</strong> menghasilkan <strong>${formatFn(topObjectiveResults)}</strong> checkouts dengan cost per checkout <strong>${formatCurrency(topObjectiveCPR)}</strong>. ${topObjectiveCPR < (totalSpent / totalResults) ? 'CPR lebih rendah dari rata-rata, sangat efisien!' : 'Pertimbangkan optimasi untuk menurunkan CPR.'}</p>
        </div>
    </div>`
}

function generateAdCreativeSlide(
  thisWeekData: any[],
  lastWeekData: any[],
  metricKey: string,
  formatFn: (val: number) => string,
  slideNumber: number
): string {
  if (thisWeekData.length === 0) return ''

  // Find the creative name column (could be various names)
  const firstItem = thisWeekData[0] || {}
  const creativeNameKey = Object.keys(firstItem).find(k => 
    k.toLowerCase() === 'ads' ||
    k.toLowerCase() === 'ad name' ||
    k.toLowerCase().includes('ad name') || 
    k.toLowerCase().includes('creative') ||
    k.toLowerCase().includes('ad creative') ||
    k.toLowerCase() === 'name'
  ) || 'Ads'

  console.log('[Ad Creative] First item keys:', Object.keys(firstItem))
  console.log('[Ad Creative] Detected name key:', creativeNameKey)
  console.log('[Ad Creative] Total items:', thisWeekData.length)

  // Show ALL creatives, sorted by results
  const sortedData = [...thisWeekData]
    .filter(item => {
      const name = item[creativeNameKey]
      return name && String(name).trim() && String(name).trim() !== ''
    })
    .sort((a, b) => {
      const resultA = parseNum(a[metricKey] || a['Results'] || 0)
      const resultB = parseNum(b[metricKey] || b['Results'] || 0)
      return resultB - resultA
    })

  const totalSpent = sortedData.reduce((sum, item) => sum + parseNum(item['Amount spent (IDR)'] || 0), 0)
  const totalResults = sortedData.reduce((sum, item) => sum + parseNum(item[metricKey] || item['Results'] || 0), 0)
  const totalReach = sortedData.reduce((sum, item) => sum + parseNum(item['Reach'] || 0), 0)
  const totalImpressions = sortedData.reduce((sum, item) => sum + parseNum(item['Impressions'] || 0), 0)
  const totalLinkClicks = sortedData.reduce((sum, item) => sum + parseNum(item['Link clicks'] || item['Link Clicks'] || 0), 0)

  const tableRows = sortedData.map((item, index) => {
    const creativeName = String(item[creativeNameKey] || 'Unknown').slice(0, 50) + (String(item[creativeNameKey] || '').length > 50 ? '...' : '')
    const spent = parseNum(item['Amount spent (IDR)'] || 0)
    const results = parseNum(item[metricKey] || item['Results'] || 0)
    const cpr = results > 0 ? spent / results : 0
    const reach = parseNum(item['Reach'] || 0)
    const impressions = parseNum(item['Impressions'] || 0)
    const linkClicks = parseNum(item['Link clicks'] || item['Link Clicks'] || 0)
    const rowBg = index === 0 ? 'style="background: #f0fdf4;"' : index === 1 ? 'style="background: #fef9c3;"' : index === 2 ? 'style="background: #fed7aa;"' : ''
    const medal = index === 0 ? ' 🥇' : index === 1 ? ' 🥈' : index === 2 ? ' 🥉' : ''

    return `                    <tr ${rowBg}>
                        <td><strong>${creativeName}${medal}</strong></td>
                        <td class="text-right">${formatFn(results)}</td>
                        <td class="text-right">${formatCurrency(cpr)}</td>
                        <td class="text-right">${formatCurrency(spent)}</td>
                        <td class="text-right">${formatNumber(reach)}</td>
                        <td class="text-right">${formatNumber(impressions)}</td>
                        <td class="text-right">${formatNumber(linkClicks)}</td>
                    </tr>`
  }).join('\n')

  return `
    <!-- SLIDE: AD CREATIVE PERFORMANCE -->
    <div class="slide" data-slide="${slideNumber}">
        <img src="${LOGO_URL}" alt="Hadona Logo" class="logo">

        <div style="margin-top: 60px; margin-bottom: 20px;">
            <h1>Ad Creative Performance</h1>
            <h2>Top Performing Creatives</h2>
        </div>

        <div style="margin-bottom: 20px;">
            <h3 style="margin-bottom: 12px;">🎨 All Ad Creatives Performance (${sortedData.length} Creatives)</h3>
            <div style="overflow-x: auto; max-height: 400px; overflow-y: auto;">
                <table style="font-size: 10px;">
                    <thead style="position: sticky; top: 0; z-index: 10;">
                        <tr>
                            <th>Ad Name</th>
                            <th class="text-right">Results (Checkouts)</th>
                            <th class="text-right">CPR</th>
                            <th class="text-right">Amount Spent</th>
                            <th class="text-right">Reach</th>
                            <th class="text-right">Impressions</th>
                            <th class="text-right">Link Clicks</th>
                        </tr>
                    </thead>
                    <tbody>
${tableRows}
                    </tbody>
                </table>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px; margin-top: 20px;">
            <div class="card">
                <div class="metric-label">📊 Total Creatives</div>
                <div class="metric-value" style="font-size: 16px;">${sortedData.length}</div>
            </div>
            <div class="card">
                <div class="metric-label">🛒 Total Results</div>
                <div class="metric-value" style="font-size: 16px;">${formatFn(totalResults)}</div>
            </div>
            <div class="card">
                <div class="metric-label">💰 Total Spent</div>
                <div class="metric-value" style="font-size: 14px;">${formatCurrency(totalSpent)}</div>
            </div>
            <div class="card">
                <div class="metric-label">👥 Total Reach</div>
                <div class="metric-value" style="font-size: 16px;">${formatNumber(totalReach)}</div>
            </div>
            <div class="card">
                <div class="metric-label">👁️ Total Impressions</div>
                <div class="metric-value" style="font-size: 16px;">${formatNumber(totalImpressions)}</div>
            </div>
            <div class="card">
                <div class="metric-label">🔗 Total Link Clicks</div>
                <div class="metric-value" style="font-size: 16px;">${formatNumber(totalLinkClicks)}</div>
            </div>
        </div>

        <div class="key-insight">
            <p><strong>Insight:</strong> Total <strong>${sortedData.length}</strong> ad creatives menghasilkan <strong>${formatFn(totalResults)}</strong> checkouts dengan total spend <strong>${formatCurrency(totalSpent)}</strong>. Average CPR: <strong>${formatCurrency(totalResults > 0 ? totalSpent / totalResults : 0)}</strong>. Top 3 creatives ditandai dengan 🥇🥈🥉.</p>
        </div>
    </div>`
}
