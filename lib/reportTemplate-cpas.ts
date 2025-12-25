/**
 * IMPROVED HTML Report Template with React + Tailwind CSS for CPAS Objective
 * Focus on Business-Focused Reporting with Data Validation
 *
 * Key Improvements:
 * 1. Business-focused Executive Summary
 * 2. Data validation for breakdown files
 * 3. Funnel Analysis (CV → ATC → Purchase)
 * 4. Evidence-based recommendations
 * 5. Product-level analysis (if data available)
 * 6. Consistent Indonesian language
 *
 * @version 2.0.0
 * @date 2025-12-26
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
  const periodLabelId = isMoM ? 'Bulan' : 'Minggu'
  const thisPeriodLabel = isMoM ? 'Bulan Ini' : 'Minggu Ini'
  const lastPeriodLabel = isMoM ? 'Bulan Lalu' : 'Minggu Lalu'
  const comparisonLabel = isMoM ? 'Month-on-Month' : 'Week-on-Week'

  // Extract client name from reportName or analysisData
  const extractClientName = (): string => {
    if (reportName) {
      const nameLower = reportName.toLowerCase()
      if (nameLower.includes('makasar') || nameLower.includes('makassar')) {
        return 'RMODA Studio Makasar'
      }
      if (nameLower.includes('bsd')) {
        return 'RMODA Studio BSD'
      }
      if (nameLower.includes('rmoda studio')) {
        const match = reportName.match(/RMODA\s+Studio\s+([A-Za-z\s]+)/i)
        if (match) {
          return \`RMODA Studio \${match[1].trim()}\`
        }
        return 'RMODA Studio'
      }
      return reportName
    }

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

    return 'Klien Terhormat'
  }

  const clientName = extractClientName()

  // ============================================
  // HELPER FUNCTIONS - IMPROVED LOGIC
  // ============================================

  /**
   * Calculate growth percentage with proper handling of edge cases
   */
  const calculateGrowth = (current: number, previous: number): { value: number, isPositive: boolean, isZeroToNonZero: boolean } => {
    if (!previous || previous === 0) {
      if (current > 0) {
        return { value: 100, isPositive: true, isZeroToNonZero: true }
      }
      return { value: 0, isPositive: false, isZeroToNonZero: false }
    }
    const growth = ((current - previous) / previous) * 100
    return {
      value: Math.round(growth * 100) / 100,
      isPositive: growth >= 0,
      isZeroToNonZero: false
    }
  }

  /**
   * Validate breakdown data consistency
   */
  const validateBreakdownData = (): { isValid: boolean, issues: string[] } => {
    const issues: string[] = []

    const agePurchases = breakdown.thisWeek?.age?.reduce((sum: number, item: any) => {
      const purchases = item['Purchases with shared items'] || item.Purchases || 0
      return sum + (Number(purchases) || 0)
    }, 0) || 0

    const totalPurchases = thisWeek.purchases || 0

    if (totalPurchases > 0 && agePurchases === 0) {
      issues.push('Data demografi usia tidak memiliki informasi pembelian. Silakan re-export breakdown file dengan metrik "Purchases".')
    }

    const platformPurchases = breakdown.thisWeek?.platform?.reduce((sum: number, item: any) => {
      const purchases = item['Purchases with shared items'] || item.Purchases || 0
      return sum + (Number(purchases) || 0)
    }, 0) || 0

    if (totalPurchases > 0 && platformPurchases === 0) {
      issues.push('Data platform tidak memiliki informasi pembelian. Silakan re-export breakdown file dengan metrik "Purchases".')
    }

    return {
      isValid: issues.length === 0,
      issues
    }
  }

  /**
   * Calculate ROAS
   */
  const calculateROAS = (revenue: number, spend: number): number => {
    if (!spend || spend === 0) return 0
    return Number((revenue / spend).toFixed(2))
  }

  /**
   * Calculate CPA (Cost Per Acquisition)
   */
  const calculateCPA = (spend: number, purchases: number): number => {
    if (!purchases || purchases === 0) return 0
    return Number((spend / purchases).toFixed(0))
  }

  /**
   * Calculate conversion rate
   */
  const calculateConversionRate = (conversions: number, clicks: number): number => {
    if (!clicks || clicks === 0) return 0
    return Number(((conversions / clicks) * 100).toFixed(2))
  }

  /**
   * Format currency in IDR
   */
  const formatCurrency = (amount: number): string => {
    if (amount >= 1000000000) {
      return \`Rp \${(amount / 1000000000).toFixed(1)}M\`
    } else if (amount >= 1000000) {
      return \`Rp \${(amount / 1000000).toFixed(1)}M\`
    } else if (amount >= 1000) {
      return \`Rp \${(amount / 1000).toFixed(0)}K\`
    }
    return \`Rp \${amount.toFixed(0)}\`
  }

  /**
   * Format number with thousand separator
   */
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('id-ID').format(Math.round(num))
  }

  /**
   * Get trend icon
   */
  const getTrendIcon = (isPositive: boolean, isNeutral: boolean = false): string => {
    if (isNeutral) return '➖'
    return isPositive ? '📈' : '📉'
  }

  /**
   * Get trend color class
   */
  const getTrendColor = (isPositive: boolean): string => {
    return isPositive ? 'text-green-600' : 'text-red-600'
  }

  // ============================================
  // CALCULATE KEY METRICS
  // ============================================

  const thisSpend = thisWeek.amountSpent || 0
  const lastSpend = lastWeek.amountSpent || 0
  const thisPurchases = thisWeek.purchases || 0
  const lastPurchases = lastWeek.purchases || 0
  const thisRevenue = thisWeek.purchasesConversionValue || 0
  const lastRevenue = lastWeek.purchasesConversionValue || 0
  const thisATC = thisWeek.addToCart || thisWeek.addsToCart || 0
  const lastATC = lastWeek.addToCart || lastWeek.addsToCart || 0
  const thisCV = thisWeek.contentViews || 0
  const lastCV = lastWeek.contentViews || 0
  const thisClicks = thisWeek.linkClicks || thisWeek.outboundClicks || 0
  const lastClicks = lastWeek.linkClicks || lastWeek.outboundClicks || 0

  // Calculate ROAS
  const thisROAS = calculateROAS(thisRevenue, thisSpend)
  const lastROAS = calculateROAS(lastRevenue, lastSpend)

  // Calculate CPA
  const thisCPA = calculateCPA(thisSpend, thisPurchases)
  const lastCPA = calculateCPA(lastSpend, lastPurchases)

  // Calculate AOV
  const thisAOV = thisPurchases > 0 ? (thisRevenue / thisPurchases) : 0
  const lastAOV = lastPurchases > 0 ? (lastRevenue / lastPurchases) : 0

  // Calculate funnel conversion rates
  const thisCVToATC = calculateConversionRate(thisATC, thisCV)
  const lastCVToATC = calculateConversionRate(lastATC, lastCV)
  const thisATCToPurchase = calculateConversionRate(thisPurchases, thisATC)
  const lastATCToPurchase = calculateConversionRate(lastPurchases, lastATC)
  const thisCVToPurchase = calculateConversionRate(thisPurchases, thisCV)
  const lastCVToPurchase = calculateConversionRate(lastPurchases, lastCV)

  // Calculate growth
  const spendGrowth = calculateGrowth(thisSpend, lastSpend)
  const purchasesGrowth = calculateGrowth(thisPurchases, lastPurchases)
  const revenueGrowth = calculateGrowth(thisRevenue, lastRevenue)
  const roasGrowth = calculateGrowth(thisROAS, lastROAS)
  const cpaGrowth = calculateGrowth(thisCPA, lastCPA)
  const aovGrowth = calculateGrowth(thisAOV, lastAOV)

  // Determine overall performance status
  const performanceStatus = thisROAS >= lastROAS ? 'IMPROVING' : 'DECLINING'

  // Validate breakdown data
  const dataValidation = validateBreakdownData()

  // ============================================
  // GENERATE BUSINESS INSIGHTS
  // ============================================

  const generateBusinessInsights = (): { title: string, insights: string[], priority: string }[] => {
    const insights: { title: string, insights: string[], priority: string }[] = []

    // Profitability Analysis
    if (thisROAS < 1.0) {
      insights.push({
        title: '⚠️ Peringatan Profitabilitas',
        insights: [
          \`ROAS saat ini \${thisROAS.toFixed(2)}x artinya campaign masih belum break-even.\`,
          \`Setiap Rp 1 juta yang di-spent, hanya menghasilkan Rp \${(thisROAS * 1000000).toFixed(0)} revenue.\`,
          \`Rekomendasi: Fokus improve ROAS ke minimal 2.0x sebelum scaling budget.\`
        ],
        priority: 'HIGH'
      })
    } else if (thisROAS < 2.0) {
      insights.push({
        title: '💡 Tip Profitabilitas',
        insights: [
          \`ROAS \${thisROAS.toFixed(2)}x sudah mendekati break-even (target 2.0x).\`,
          \`Rekomendasi: Optimize CPA dari \${formatCurrency(thisCPA)} ke bawah untuk improve profitability.\`
        ],
        priority: 'MEDIUM'
      })
    } else {
      insights.push({
        title: '✅ Profitabilitas Baik',
        insights: [
          \`ROAS \${thisROAS.toFixed(2)}x sudah di atas break-even point.\`,
          \`Campaign sudah profitable, pertimbangkan scaling dengan hati-hati.\`
        ],
        priority: 'LOW'
      })
    }

    // Funnel Analysis
    if (thisCVToATC < 5 && thisCV > 0) {
      insights.push({
        title: '🔻 Masalah Funnel: CV ke ATC',
        insights: [
          \`Hanya \${thisCVToATC.toFixed(1)}% content view yang add to cart (rendah).\`,
          \`Ini menunjukkan product interest ada, tapi price/offer kurang menarik.\`,
          \`Rekomendasi: Test diskon, bundle, atau free shipping offer.\`
        ],
        priority: 'HIGH'
      })
    }

    if (thisATCToPurchase < 5 && thisATC > 0) {
      insights.push({
        title: '🔻 Masalah Funnel: ATC ke Purchase',
        insights: [
          \`Hanya \${thisATCToPurchase.toFixed(1)}% ATC yang menjadi purchase (rendah).\`,
          \`Ini menunjukkan ada friction di checkout process.\`,
          \`Rekomendasi: Review payment flow, ongkos kirim, atau stock availability.\`
        ],
        priority: 'HIGH'
      })
    }

    // Spend vs Revenue Analysis
    if (thisSpend > thisRevenue && thisSpend > 0) {
      insights.push({
        title: '💸 Peringatan Over-Spending',
        insights: [
          \`Spend (\${formatCurrency(thisSpend)}) lebih tinggi dari revenue (\${formatCurrency(thisRevenue)}).\`,
          \`Loss: \${formatCurrency(thisSpend - thisRevenue)} - ini tidak sustainable.\`,
          \`Rekomendasi: PAUSE campaign dan re-evaluate targeting/creative.\`
        ],
        priority: 'HIGH'
      })
    }

    // Trend Analysis
    if (roasGrowth.value < -20 && lastROAS > 0) {
      insights.push({
        title: '📉 Penurunan Performa',
        insights: [
          \`ROAS turun \${Math.abs(roasGrowth.value).toFixed(1)}% dari \${lastPeriodLabel}.\`,
          \`Investigate: Apakah ada perubahan creative, targeting, atau kompetitor?\`,
          \`Rekomendasi: A/B test new creatives dan review target audience.\`
        ],
        priority: 'HIGH'
      })
    }

    return insights
  }

  const businessInsights = generateBusinessInsights()

  // ============================================
  // GENERATE EVIDENCE-BASED RECOMMENDATIONS
  // ============================================

  const generateRecommendations = (): string[] => {
    const recommendations: string[] = []

    // Platform-based recommendations
    const platformData = breakdown.thisWeek?.platform || []
    if (platformData.length > 0) {
      const sortedByPurchases = [...platformData].sort((a: any, b: any) => {
        const purchasesA = Number(a['Purchases with shared items'] || a.Purchases || 0)
        const purchasesB = Number(b['Purchases with shared items'] || b.Purchases || 0)
        return purchasesB - purchasesA
      })

      const topPlatform = sortedByPurchases[0]
      if (topPlatform) {
        const platform = topPlatform.Platform || topPlatform.platform || 'Platform'
        const purchases = Number(topPlatform['Purchases with shared items'] || topPlatform.Purchases || 0)
        const spend = Number(topPlatform['Amount spent (IDR)'] || topPlatform.amountSpent || 0)
        const platformROAS = spend > 0 ? calculateROAS(
          Number(topPlatform['Purchases conversion value for shared items only'] || 0),
          spend
        ) : 0

        if (purchases > 0 && platformROAS >= 2.0) {
          recommendations.push(\`**SCALE \${platform.toUpperCase()}**: Platform ini menghasilkan \${purchases} purchases dengan ROAS \${platformROAS.toFixed(2)}x. Pertimbangkan increase budget 20-30%.\`)
        } else if (purchases > 0 && platformROAS < 1.0) {
          recommendations.push(\`**OPTIMIZE \${platform.toUpperCase()}**: Platform ini menghasilkan \${purchases} purchases tapi ROAS \${platformROAS.toFixed(2)}x (belum break-even). Review creative dan targeting.\`)
        }
      }

      const bottomPlatform = sortedByPurchases[sortedByPurchases.length - 1]
      if (bottomPlatform) {
        const platform = bottomPlatform.Platform || bottomPlatform.platform || 'Platform'
        const purchases = Number(bottomPlatform['Purchases with shared items'] || bottomPlatform.Purchases || 0)
        const spend = Number(bottomPlatform['Amount spent (IDR)'] || bottomPlatform.amountSpent || 0)

        if (spend > 100000 && purchases === 0) {
          recommendations.push(\`**PAUSE \${platform.toUpperCase()}**: Sudah spend \${formatCurrency(spend)} tapi 0 purchases. Hentikan atau re-strategikan.\`)
        }
      }
    }

    // Funnel-based recommendations
    if (thisCVToATC < 5 && thisCV > 0) {
      recommendations.push(\`**IMPROVE ATC RATE**: Dari \${formatNumber(thisCV)} content views, hanya \${thisATC} yang ATC (\${thisCVToATC.toFixed(1)}%). Test promotional offers, bundling, atau urgency messaging.\`)
    }

    if (thisATCToPurchase < 5 && thisATC > 0) {
      recommendations.push(\`**IMPROVE CONVERSION RATE**: Dari \${thisATC} ATC, hanya \${thisPurchases} yang purchase (\${thisATCToPurchase.toFixed(1)}%). Review checkout process, payment methods, dan shipping cost.\`)
    }

    // CPA-based recommendations
    if (thisCPA > thisAOV && thisAOV > 0) {
      recommendations.push(\`**REDUCE CPA**: CPA \${formatCurrency(thisCPA)} lebih tinggi dari AOV \${formatCurrency(thisAOV)}. Perlu turunkan CPA ke minimal di bawah AOV untuk break-even.\`)
    }

    // Budget recommendations
    if (thisROAS >= 2.0 && roasGrowth.isPositive && lastROAS > 0) {
      recommendations.push(\`**SCALE BUDGET**: ROAS \${thisROAS.toFixed(2)}x dan trending upward. Pertimbangkan increase budget 20-30% untuk capture lebih banyak sales.\`)
    } else if (thisROAS < 1.0) {
      recommendations.push(\`**REDUCE BUDGET**: ROAS \${thisROAS.toFixed(2)}x belum break-even. Reduce budget dan fix foundation issues dulu.\`)
    }

    return recommendations
  }

  const recommendations = generateRecommendations()

  
  // ============================================
  // GENERATE HTML REPORT
  // ============================================

  let slides = ''

  // ============================================
  // SLIDE 1: COVER PAGE
  // ============================================
  slides += \`
                    {/* SLIDE 1 - COVER PAGE */}
                    <div className="bg-white p-8 border-t-4 border-blue-600">
                        <div className="max-w-6xl mx-auto">
                            <div className="text-center mb-8">
                                <h1 className="text-4xl font-bold text-blue-600 mb-2">Laporan Performa Iklan Meta Ads</h1>
                                <h2 className="text-2xl font-semibold text-gray-700 mb-4">CPAS - Collaborative Performance Advertising Solution</h2>
                                <div className="h-1 w-32 bg-blue-600 mx-auto mb-6"></div>
                                <h3 className="text-xl font-semibold text-gray-800">\${clientName}</h3>
                                <p className="text-lg text-gray-600 mt-4">\${comparisonLabel} Comparison Report</p>
                                <p className="text-md text-gray-500 mt-2">\${thisPeriodLabel} vs \${lastPeriodLabel}</p>
                            </div>
                            <div className="mt-12 text-center text-sm text-gray-500">
                                <p>Dicetak pada: \${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            </div>
                        </div>
                    </div>\`

  // ============================================
  // SLIDE 2: EXECUTIVE SUMMARY (REDESIGNED - BUSINESS FOCUSED)
  // ============================================
  slides += \`
                    {/* SLIDE 2 - EXECUTIVE SUMMARY */}
                    <div className="bg-white p-8 border-t-4 border-blue-600">
                        <div className="max-w-6xl mx-auto">
                            <h2 className="text-3xl font-bold text-blue-600 mb-6">Ringkasan Eksekutif</h2>

                            \${dataValidation.issues.length > 0 ? \`
                            <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                                <div className="flex items-start">
                                    <span className="text-2xl mr-3">⚠️</span>
                                    <div>
                                        <h4 className="font-semibold text-yellow-800">Peringatan Kualitas Data</h4>
                                        <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside">
                                            \${dataValidation.issues.map((issue) => \`<li>\${issue}</li>\`).join('')}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            \` : ''}

                            {/* Overall Performance Status */}
                            <div className="mb-6 p-6 \${thisROAS >= lastROAS ? 'bg-green-50 border-l-4 border-green-500' : 'bg-red-50 border-l-4 border-red-500'} rounded">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold \${thisROAS >= lastROAS ? 'text-green-700' : 'text-red-700'}">
                                            Status Performa: \${performanceStatus}
                                        </h3>
                                        <p className="text-gray-700 mt-2">
                                            \${thisROAS >= lastROAS
                                              ? \`Campaign mengalami perbaikan dengan ROAS \${thisROAS.toFixed(2)}x, lebih tinggi dari \${lastPeriodLabel} (\${lastROAS.toFixed(2)}x).\`
                                              : \`Campaign mengalami penurunan performa. ROAS turun dari \${lastROAS.toFixed(2)}x ke \${thisROAS.toFixed(2)}x (\${Math.abs(roasGrowth.value).toFixed(1)}% decline).\`
                                            }
                                        </p>
                                    </div>
                                    <div className="text-5xl">\${thisROAS >= lastROAS ? '✅' : '❌'}</div>
                                </div>
                            </div>

                            {/* Key Metrics Comparison */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="border rounded-lg p-4">
                                    <div className="text-sm text-gray-600 mb-1">Total Spend</div>
                                    <div className="text-2xl font-bold text-gray-800">\${formatCurrency(thisSpend)}</div>
                                    <div className="text-sm \${getTrendColor(spendGrowth.isPositive)} mt-1">
                                        \${getTrendIcon(spendGrowth.isPositive)} \${Math.abs(spendGrowth.value).toFixed(1)}% vs \${lastPeriodLabel}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">\${formatCurrency(lastSpend)} → \${formatCurrency(thisSpend)}</div>
                                </div>

                                <div className="border rounded-lg p-4">
                                    <div className="text-sm text-gray-600 mb-1">Total Purchases</div>
                                    <div className="text-2xl font-bold text-gray-800">\${formatNumber(thisPurchases)}</div>
                                    <div className="text-sm \${getTrendColor(purchasesGrowth.isPositive)} mt-1">
                                        \${getTrendIcon(purchasesGrowth.isPositive)} \${purchasesGrowth.isZeroToNonZero ? '∞' : Math.abs(purchasesGrowth.value).toFixed(1) + '%'} vs \${lastPeriodLabel}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">\${formatNumber(lastPurchases)} → \${formatNumber(thisPurchases)}</div>
                                </div>

                                <div className="border rounded-lg p-4">
                                    <div className="text-sm text-gray-600 mb-1">Total Revenue</div>
                                    <div className="text-2xl font-bold text-gray-800">\${formatCurrency(thisRevenue)}</div>
                                    <div className="text-sm \${getTrendColor(revenueGrowth.isPositive)} mt-1">
                                        \${getTrendIcon(revenueGrowth.isPositive)} \${Math.abs(revenueGrowth.value).toFixed(1)}% vs \${lastPeriodLabel}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">\${formatCurrency(lastRevenue)} → \${formatCurrency(thisRevenue)}</div>
                                </div>

                                <div className="border rounded-lg p-4">
                                    <div className="text-sm text-gray-600 mb-1">ROAS</div>
                                    <div className="text-2xl font-bold \${thisROAS >= 2.0 ? 'text-green-600' : thisROAS >= 1.0 ? 'text-yellow-600' : 'text-red-600'}">\${thisROAS.toFixed(2)}x</div>
                                    <div className="text-sm \${getTrendColor(roasGrowth.isPositive)} mt-1">
                                        \${getTrendIcon(roasGrowth.isPositive)} \${lastROAS > 0 ? Math.abs(roasGrowth.value).toFixed(1) + '%' : 'N/A'} vs \${lastPeriodLabel}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">\${lastROAS.toFixed(2)}x → \${thisROAS.toFixed(2)}x</div>
                                </div>

                                <div className="border rounded-lg p-4">
                                    <div className="text-sm text-gray-600 mb-1">Cost Per Purchase</div>
                                    <div className="text-2xl font-bold text-gray-800">\${formatCurrency(thisCPA)}</div>
                                    <div className="text-sm \${getTrendColor(!cpaGrowth.isPositive)} mt-1">
                                        \${getTrendIcon(!cpaGrowth.isPositive)} \${lastCPA > 0 ? Math.abs(cpaGrowth.value).toFixed(1) + '%' : 'N/A'} vs \${lastPeriodLabel}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">\${formatCurrency(lastCPA)} → \${formatCurrency(thisCPA)}</div>
                                </div>

                                <div className="border rounded-lg p-4">
                                    <div className="text-sm text-gray-600 mb-1">Average Order Value</div>
                                    <div className="text-2xl font-bold text-gray-800">\${formatCurrency(thisAOV)}</div>
                                    <div className="text-sm \${getTrendColor(aovGrowth.isPositive)} mt-1">
                                        \${getTrendIcon(aovGrowth.isPositive)} \${lastAOV > 0 ? Math.abs(aovGrowth.value).toFixed(1) + '%' : 'N/A'} vs \${lastPeriodLabel}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">\${formatCurrency(lastAOV)} → \${formatCurrency(thisAOV)}</div>
                                </div>
                            </div>

                            {/* Profit/Loss Summary */}
                            <div className="p-4 \${thisRevenue >= thisSpend ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'} rounded-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-semibold \${thisRevenue >= thisSpend ? 'text-green-700' : 'text-red-700'}">
                                            \${thisRevenue >= thisSpend ? 'Net Profit' : 'Net Loss'}
                                        </h4>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Revenue (\${formatCurrency(thisRevenue)}) \${thisRevenue >= thisSpend ? '>' : '<'} Spend (\${formatCurrency(thisSpend)})
                                        </p>
                                    </div>
                                    <div className="text-2xl font-bold \${thisRevenue >= thisSpend ? 'text-green-600' : 'text-red-600'}">
                                        \${formatCurrency(Math.abs(thisRevenue - thisSpend))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>\`

  // ============================================
  // SLIDE 3: FUNNEL ANALYSIS (NEW)
  // ============================================
  slides += \`
                    {/* SLIDE 3 - FUNNEL ANALYSIS */}
                    <div className="bg-white p-8 border-t-4 border-blue-600">
                        <div className="max-w-6xl mx-auto">
                            <h2 className="text-3xl font-bold text-blue-600 mb-6">Analisis Funnel Pembelian</h2>
                            <p className="text-gray-600 mb-6">
                                Memahami customer journey dari melihat konten hingga melakukan pembelian
                            </p>

                            {/* Funnel Visualization */}
                            <div className="mb-8">
                                \${[{
                                  label: 'Content Views',
                                  thisValue: thisCV,
                                  lastValue: lastCV,
                                  thisRate: 100,
                                  lastRate: 100,
                                  icon: '👁️'
                                }, {
                                  label: 'Adds to Cart',
                                  thisValue: thisATC,
                                  lastValue: lastATC,
                                  thisRate: thisCV > 0 ? (thisATC / thisCV) * 100 : 0,
                                  lastRate: lastCV > 0 ? (lastATC / lastCV) * 100 : 0,
                                  icon: '🛒'
                                }, {
                                  label: 'Purchases',
                                  thisValue: thisPurchases,
                                  lastValue: lastPurchases,
                                  thisRate: thisATC > 0 ? (thisPurchases / thisATC) * 100 : 0,
                                  lastRate: lastATC > 0 ? (lastPurchases / lastATC) * 100 : 0,
                                  icon: '💰'
                                }].map((stage, index) => \`
                                <div className="mb-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center">
                                            <span class="text-2xl mr-2">\${stage.icon}</span>
                                            <span class="font-semibold text-gray-700">\${stage.label}</span>
                                        </div>
                                        <div class="text-right">
                                            <div class="text-lg font-bold text-gray-800">\${formatNumber(stage.thisValue)}</div>
                                            <div class="text-xs text-gray-500">\${lastPeriodLabel}: \${formatNumber(stage.lastValue)}</div>
                                        </div>
                                    </div>
                                    <div class="w-full bg-gray-200 rounded-full h-4">
                                        <div class="h-4 rounded-full \${index === 0 ? 'bg-blue-500' : index === 1 ? 'bg-yellow-500' : 'bg-green-500'}"
                                            style="width: \${Math.max(stage.thisRate, 5)}%"></div>
                                    </div>
                                    <div class="flex justify-between text-xs text-gray-600 mt-1">
                                        <span>\${thisPeriodLabel}: \${stage.thisRate.toFixed(1)}%</span>
                                        <span>\${lastPeriodLabel}: \${stage.lastRate.toFixed(1)}%</span>
                                    </div>
                                </div>
                                \`).join('')}
                            </div>

                            {/* Funnel Insights */}
                            <div class="grid grid-cols-2 gap-4">
                                <div class="border rounded-lg p-4 \${thisCVToATC >= 5 ? 'bg-green-50' : 'bg-red-50'}">
                                    <h4 class="font-semibold text-gray-700 mb-2">Conversion: View → ATC</h4>
                                    <div class="text-2xl font-bold \${thisCVToATC >= 5 ? 'text-green-600' : 'text-red-600'}">\${thisCVToATC.toFixed(1)}%</div>
                                    <p class="text-sm text-gray-600 mt-2">
                                        \${thisCVToATC >= 5
                                          ? '✅ Rate bagus. Product interest tinggi.'
                                          : '❌ Rate rendah. Perlu improve offer/price.'
                                        }
                                    </p>
                                </div>

                                <div class="border rounded-lg p-4 \${thisATCToPurchase >= 5 ? 'bg-green-50' : 'bg-red-50'}">
                                    <h4 class="font-semibold text-gray-700 mb-2">Conversion: ATC → Purchase</h4>
                                    <div class="text-2xl font-bold \${thisATCToPurchase >= 5 ? 'text-green-600' : 'text-red-600'}">\${thisATCToPurchase.toFixed(1)}%</div>
                                    <p class="text-sm text-gray-600 mt-2">
                                        \${thisATCToPurchase >= 5
                                          ? '✅ Rate bagus. Checkout process smooth.'
                                          : '❌ Rate rendah. Perlu review checkout flow.'
                                        }
                                    </p>
                                </div>
                            </div>

                            {/* Overall Conversion Rate */}
                            <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <div class="flex items-center justify-between">
                                    <div>
                                        <h4 class="font-semibold text-blue-700">Overall Conversion Rate</h4>
                                        <p class="text-sm text-gray-600">Dari Content View ke Purchase</p>
                                    </div>
                                    <div class="text-3xl font-bold text-blue-600">\${thisCVToPurchase.toFixed(2)}%</div>
                                </div>
                                <p class="text-xs text-gray-500 mt-2">
                                    \${lastPeriodLabel}: \${lastCVToPurchase.toFixed(2)}% → \${thisPeriodLabel}: \${thisCVToPurchase.toFixed(2)}%
                                    (\${thisCVToPurchase >= lastCVToPurchase ? '↑' : '↓'} \${Math.abs(thisCVToPurchase - lastCVToPurchase).toFixed(2)}pp)
                                </p>
                            </div>
                        </div>
                    </div>\`

  // ============================================
  // SLIDE 4: BUSINESS INSIGHTS (NEW)
  // ============================================
  slides += \`
                    {/* SLIDE 4 - BUSINESS INSIGHTS */}
                    <div className="bg-white p-8 border-t-4 border-blue-600">
                        <div className="max-w-6xl mx-auto">
                            <h2 className="text-3xl font-bold text-blue-600 mb-6">Insight Bisnis</h2>
                            <p className="text-gray-600 mb-6">
                                Analisis mendalam untuk pengambilan keputusan strategis
                            </p>

                            <div className="space-y-4">
                                \${businessInsights.map(insight => \`
                                <div className="p-4 rounded-lg border-l-4 \${insight.priority === 'HIGH' ? 'bg-red-50 border-red-500' : insight.priority === 'MEDIUM' ? 'bg-yellow-50 border-yellow-500' : 'bg-green-50 border-green-500'}">
                                    <div className="flex items-start">
                                        <h4 className="font-bold text-lg \${insight.priority === 'HIGH' ? 'text-red-700' : insight.priority === 'MEDIUM' ? 'text-yellow-700' : 'text-green-700'} mb-2">
                                            \${insight.title}
                                        </h4>
                                        <span class="ml-auto text-xs font-semibold px-2 py-1 rounded \${insight.priority === 'HIGH' ? 'bg-red-200 text-red-800' : insight.priority === 'MEDIUM' ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'}">
                                            \${insight.priority}
                                        </span>
                                    </div>
                                    <ul className="mt-3 space-y-2">
                                        \${insight.insights.map(item => \`
                                        <li className="flex items-start text-sm text-gray-700">
                                            <span className="mr-2">•</span>
                                            <span>\${item}</span>
                                        </li>
                                        \`).join('')}
                                    </ul>
                                </div>
                                \`).join('')}
                            </div>
                        </div>
                    </div>\`

  // ============================================
  // SLIDE 5: PLATFORM PERFORMANCE (IMPROVED)
  // ============================================
  const platformData = breakdown.thisWeek?.platform || []
  if (platformData.length > 0) {
    const sortedPlatform = [...platformData].sort((a: any, b: any) => {
      const purchasesA = Number(a['Purchases with shared items'] || a.Purchases || 0)
      const purchasesB = Number(b['Purchases with shared items'] || b.Purchases || 0)
      return purchasesB - purchasesA
    })

    slides += \`
                    {/* SLIDE 5 - PLATFORM PERFORMANCE */}
                    <div className="bg-white p-8 border-t-4 border-blue-600">
                        <div className="max-w-6xl mx-auto">
                            <h2 className="text-3xl font-bold text-blue-600 mb-6">Performa Berdasarkan Platform</h2>
                            <p className="text-gray-600 mb-6">
                                Analisis performa iklan di berbagai platform Meta
                            </p>

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm border-collapse">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="border p-3 text-left">Platform</th>
                                            <th className="border p-3 text-right">Spend</th>
                                            <th className="border p-3 text-right">Impressions</th>
                                            <th className="border p-3 text-right">Clicks</th>
                                            <th className="border p-3 text-right">Purchases</th>
                                            <th className="border p-3 text-right">Revenue</th>
                                            <th className="border p-3 text-right">ROAS</th>
                                            <th className="border p-3 text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        \${sortedPlatform.map((platform: any) => {
                                          const platformName = platform.Platform || platform.platform || 'Unknown'
                                          const spend = Number(platform['Amount spent (IDR)'] || platform.amountSpent || 0)
                                          const impressions = Number(platform.Impressions || platform.impressions || 0)
                                          const clicks = Number(platform['Outbound clicks'] || platform.clicks || 0)
                                          const purchases = Number(platform['Purchases with shared items'] || platform.Purchases || 0)
                                          const revenue = Number(platform['Purchases conversion value for shared items only'] || 0)
                                          const roas = spend > 0 ? calculateROAS(revenue, spend) : 0

                                          const ctr = clicks > 0 && impressions > 0 ? (clicks / impressions) * 100 : 0

                                          let status = '⚪'
                                          let statusText = 'Insufficient Data'

                                          if (purchases > 0 && roas >= 2.0) {
                                            status = '🟢'
                                            statusText = 'Excellent'
                                          } else if (purchases > 0 && roas >= 1.0) {
                                            status = '🟡'
                                            statusText = 'Good'
                                          } else if (purchases > 0 && roas < 1.0) {
                                            status = '🔴'
                                            statusText = 'Below Break-even'
                                          } else if (spend > 100000) {
                                            status = '🔴'
                                            statusText = 'No Sales'
                                          }

                                          return \`
                                        <tr class="\${purchases === 0 ? 'bg-red-50' : ''}">
                                            <td class="border p-3 font-semibold">\${platformName}</td>
                                            <td class="border p-3 text-right">\${formatCurrency(spend)}</td>
                                            <td class="border p-3 text-right">\${formatNumber(impressions)}</td>
                                            <td class="border p-3 text-right">\${formatNumber(clicks)}</td>
                                            <td class="border p-3 text-right">\${purchases > 0 ? \`<span class="font-bold text-green-600">\${formatNumber(purchases)}</span>\` : '<span class="text-red-600">0</span>'}</td>
                                            <td class="border p-3 text-right">\${formatCurrency(revenue)}</td>
                                            <td class="border p-3 text-right font-bold \${roas >= 2.0 ? 'text-green-600' : roas >= 1.0 ? 'text-yellow-600' : 'text-red-600'}">\${roas.toFixed(2)}x</td>
                                            <td class="border p-3 text-center">\${status} \${statusText}</td>
                                        </tr>\`
                                        }).join('')}
                                    </tbody>
                                </table>
                            </div>

                            {/* Platform Recommendations */}
                            <div className="mt-6 grid grid-cols-3 gap-4">
                                \${(() => {
                                  const topPlatform = sortedPlatform[0]
                                  if (!topPlatform) return ''

                                  const platformName = topPlatform.Platform || topPlatform.platform || 'Platform'
                                  const purchases = Number(topPlatform['Purchases with shared items'] || topPlatform.Purchases || 0)
                                  const spend = Number(topPlatform['Amount spent (IDR)'] || topPlatform.amountSpent || 0)
                                  const revenue = Number(topPlatform['Purchases conversion value for shared items only'] || 0)
                                  const roas = spend > 0 ? calculateROAS(revenue, spend) : 0

                                  if (purchases > 0 && roas >= 2.0) {
                                    return \`
                                    <div class="p-4 bg-green-50 border border-green-200 rounded">
                                        <h4 class="font-semibold text-green-700 mb-2">✅ Scale</h4>
                                        <p class="text-sm text-gray-700"><strong>\${platformName}</strong> performa terbaik dengan \${purchases} purchases dan ROAS \${roas.toFixed(2)}x.</p>
                                    </div>\`
                                  } else if (purchases > 0 && roas < 1.0) {
                                    return \`
                                    <div class="p-4 bg-yellow-50 border border-yellow-200 rounded">
                                        <h4 class="font-semibold text-yellow-700 mb-2">⚠️ Optimize</h4>
                                        <p class="text-sm text-gray-700"><strong>\${platformName}</strong> ada sales (\${purchases}) tapi ROAS \${roas.toFixed(2)}x belum break-even.</p>
                                    </div>\`
                                  }
                                  return ''
                                })()}

                                \${(() => {
                                  const zeroSalesPlatforms = sortedPlatform.filter((p: any) => {
                                    const purchases = Number(p['Purchases with shared items'] || p.Purchases || 0)
                                    const spend = Number(p['Amount spent (IDR)'] || p.amountSpent || 0)
                                    return purchases === 0 && spend > 50000
                                  })

                                  if (zeroSalesPlatforms.length > 0) {
                                    const platform = zeroSalesPlatforms[0]
                                    const platformName = platform.Platform || platform.platform || 'Platform'
                                    return \`
                                    <div class="p-4 bg-red-50 border border-red-200 rounded">
                                        <h4 class="font-semibold text-red-700 mb-2">❌ Pause/Review</h4>
                                        <p class="text-sm text-gray-700"><strong>\${platformName}</strong> sudah spend tapi 0 sales. Pertimbangkan pause.</p>
                                    </div>\`
                                  }
                                  return ''
                                })()}
                            </div>
                        </div>
                    </div>\`
  }

  // ============================================
  // SLIDE 6-10: DEMOGRAPHICS & BREAKDOWNS (WITH VALIDATION)
  // ============================================
  const ageData = breakdown.thisWeek?.age || []
  const genderData = breakdown.thisWeek?.gender || []
  const regionData = breakdown.thisWeek?.region || []
  const placementData = breakdown.thisWeek?.placement || []
  const objectiveData = breakdown.thisWeek?.objective || []

  // AGE BREAKDOWN
  if (ageData.length > 0 && !dataValidation.issues.some(issue => issue.includes('usia'))) {
    slides += \`
                    {/* SLIDE 6 - AGE DEMOGRAPHICS */}
                    <div className="bg-white p-8 border-t-4 border-blue-600">
                        <div className="max-w-6xl mx-auto">
                            <h2 className="text-3xl font-bold text-blue-600 mb-6">Demografi: Kelompok Usia</h2>

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm border-collapse">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="border p-3 text-left">Kelompok Usia</th>
                                            <th className="border p-3 text-right">Impressions</th>
                                            <th className="border p-3 text-right">Clicks</th>
                                            <th className="border p-3 text-right">CTR</th>
                                            <th className="border p-3 text-right">Purchases</th>
                                            <th className="border p-3 text-right">Spend</th>
                                            <th className="border p-3 text-right">CPA</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        \${ageData.map((age: any) => {
                                          const ageGroup = age.Age || age.age || 'Unknown'
                                          const impressions = Number(age.Impressions || 0)
                                          const clicks = Number(age['Outbound clicks'] || 0)
                                          const ctr = clicks > 0 && impressions > 0 ? (clicks / impressions) * 100 : 0
                                          const purchases = Number(age['Purchases with shared items'] || age.Purchases || 0)
                                          const spend = Number(age['Amount spent (IDR)'] || 0)
                                          const cpa = purchases > 0 ? spend / purchases : 0

                                          return \`
                                          <tr>
                                              <td className="border p-3 font-semibold">\${ageGroup}</td>
                                              <td className="border p-3 text-right">\${formatNumber(impressions)}</td>
                                              <td className="border p-3 text-right">\${formatNumber(clicks)}</td>
                                              <td className="border p-3 text-right">\${ctr.toFixed(2)}%</td>
                                              <td className="border p-3 text-right \${purchases > 0 ? 'font-bold text-green-600' : 'text-red-600'}">\${purchases}</td>
                                              <td className="border p-3 text-right">\${formatCurrency(spend)}</td>
                                              <td className="border p-3 text-right">\${purchases > 0 ? formatCurrency(cpa) : '-'}</td>
                                          </tr>\`
                                        }).join('')}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>\`
  }

  // GENDER BREAKDOWN
  if (genderData.length > 0) {
    slides += \`
                    {/* SLIDE 7 - GENDER DEMOGRAPHICS */}
                    <div className="bg-white p-8 border-t-4 border-blue-600">
                        <div className="max-w-6xl mx-auto">
                            <h2 className="text-3xl font-bold text-blue-600 mb-6">Demografi: Jenis Kelamin</h2>

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm border-collapse">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="border p-3 text-left">Jenis Kelamin</th>
                                            <th className="border p-3 text-right">Impressions</th>
                                            <th className="border p-3 text-right">Clicks</th>
                                            <th className="border p-3 text-right">CTR</th>
                                            <th className="border p-3 text-right">Purchases</th>
                                            <th className="border p-3 text-right">Spend</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        \${genderData.map((gender: any) => {
                                          const genderName = gender.Gender || gender.gender || 'Unknown'
                                          const impressions = Number(gender.Impressions || 0)
                                          const clicks = Number(gender['Outbound clicks'] || 0)
                                          const ctr = clicks > 0 && impressions > 0 ? (clicks / impressions) * 100 : 0
                                          const purchases = Number(gender['Purchases with shared items'] || gender.Purchases || 0)
                                          const spend = Number(gender['Amount spent (IDR)'] || 0)

                                          return \`
                                          <tr>
                                              <td className="border p-3 font-semibold">\${genderName}</td>
                                              <td className="border p-3 text-right">\${formatNumber(impressions)}</td>
                                              <td className="border p-3 text-right">\${formatNumber(clicks)}</td>
                                              <td className="border p-3 text-right">\${ctr.toFixed(2)}%</td>
                                              <td className="border p-3 text-right \${purchases > 0 ? 'font-bold text-green-600' : 'text-red-600'}">\${purchases}</td>
                                              <td className="border p-3 text-right">\${formatCurrency(spend)}</td>
                                          </tr>\`
                                        }).join('')}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>\`
  }

  // REGION BREAKDOWN
  if (regionData.length > 0) {
    slides += \`
                    {/* SLIDE 8 - REGION BREAKDOWN */}
                    <div className="bg-white p-8 border-t-4 border-blue-600">
                        <div className="max-w-6xl mx-auto">
                            <h2 className="text-3xl font-bold text-blue-600 mb-6">Performa Berdasarkan Wilayah</h2>

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm border-collapse">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="border p-3 text-left">Wilayah</th>
                                            <th className="border p-3 text-right">Impressions</th>
                                            <th className="border p-3 text-right">Clicks</th>
                                            <th className="border p-3 text-right">Purchases</th>
                                            <th className="border p-3 text-right">Spend</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        \${regionData.slice(0, 10).map((region: any) => {
                                          const regionName = region.Region || region.region || 'Unknown'
                                          const impressions = Number(region.Impressions || 0)
                                          const clicks = Number(region['Outbound clicks'] || 0)
                                          const purchases = Number(region['Purchases with shared items'] || region.Purchases || 0)
                                          const spend = Number(region['Amount spent (IDR)'] || 0)

                                          return \`
                                          <tr>
                                              <td className="border p-3 font-semibold">\${regionName}</td>
                                              <td className="border p-3 text-right">\${formatNumber(impressions)}</td>
                                              <td className="border p-3 text-right">\${formatNumber(clicks)}</td>
                                              <td className="border p-3 text-right \${purchases > 0 ? 'font-bold text-green-600' : 'text-red-600'}">\${purchases}</td>
                                              <td className="border p-3 text-right">\${formatCurrency(spend)}</td>
                                          </tr>\`
                                        }).join('')}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>\`
  }

  // PLACEMENT BREAKDOWN
  if (placementData.length > 0) {
    slides += \`
                    {/* SLIDE 9 - PLACEMENT PERFORMANCE */}
                    <div className="bg-white p-8 border-t-4 border-blue-600">
                        <div className="max-w-6xl mx-auto">
                            <h2 className="text-3xl font-bold text-blue-600 mb-6">Performa Berdasarkan Placement</h2>

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm border-collapse">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="border p-3 text-left">Placement</th>
                                            <th className="border p-3 text-right">Impressions</th>
                                            <th className="border p-3 text-right">Clicks</th>
                                            <th className="border p-3 text-right">Purchases</th>
                                            <th className="border p-3 text-right">Spend</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        \${placementData.map((placement: any) => {
                                          const placementName = placement.Placement || placement.placement || 'Unknown'
                                          const impressions = Number(placement.Impressions || 0)
                                          const clicks = Number(placement['Outbound clicks'] || 0)
                                          const purchases = Number(placement['Purchases with shared items'] || placement.Purchases || 0)
                                          const spend = Number(placement['Amount spent (IDR)'] || 0)

                                          return \`
                                          <tr>
                                              <td className="border p-3 font-semibold">\${placementName}</td>
                                              <td className="border p-3 text-right">\${formatNumber(impressions)}</td>
                                              <td className="border p-3 text-right">\${formatNumber(clicks)}</td>
                                              <td className="border p-3 text-right \${purchases > 0 ? 'font-bold text-green-600' : 'text-red-600'}">\${purchases}</td>
                                              <td className="border p-3 text-right">\${formatCurrency(spend)}</td>
                                          </tr>\`
                                        }).join('')}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>\`
  }

  // OBJECTIVE BREAKDOWN
  if (objectiveData.length > 0) {
    slides += \`
                    {/* SLIDE 10 - OBJECTIVE PERFORMANCE */}
                    <div className="bg-white p-8 border-t-4 border-blue-600">
                        <div className="max-w-6xl mx-auto">
                            <h2 className="text-3xl font-bold text-blue-600 mb-6">Performa Berdasarkan Objective</h2>

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm border-collapse">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="border p-3 text-left">Objective</th>
                                            <th className="border p-3 text-right">Impressions</th>
                                            <th className="border p-3 text-right">Clicks</th>
                                            <th className="border p-3 text-right">Purchases</th>
                                            <th className="border p-3 text-right">Spend</th>
                                            <th className="border p-3 text-right">ROAS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        \${objectiveData.map((objective: any) => {
                                          const objectiveName = objective.Objective || objective.objective || 'Unknown'
                                          const impressions = Number(objective.Impressions || 0)
                                          const clicks = Number(objective['Outbound clicks'] || 0)
                                          const purchases = Number(objective['Purchases with shared items'] || objective.Purchases || 0)
                                          const spend = Number(objective['Amount spent (IDR)'] || 0)
                                          const revenue = Number(objective['Purchases conversion value for shared items only'] || 0)
                                          const roas = spend > 0 ? calculateROAS(revenue, spend) : 0

                                          return \`
                                          <tr>
                                              <td className="border p-3 font-semibold">\${objectiveName}</td>
                                              <td className="border p-3 text-right">\${formatNumber(impressions)}</td>
                                              <td className="border p-3 text-right">\${formatNumber(clicks)}</td>
                                              <td className="border p-3 text-right \${purchases > 0 ? 'font-bold text-green-600' : 'text-red-600'}">\${purchases}</td>
                                              <td className="border p-3 text-right">\${formatCurrency(spend)}</td>
                                              <td className="border p-3 text-right font-bold \${roas >= 2.0 ? 'text-green-600' : roas >= 1.0 ? 'text-yellow-600' : 'text-red-600'}">\${roas > 0 ? roas.toFixed(2) + 'x' : '-'}</td>
                                          </tr>\`
                                        }).join('')}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>\`
  }

  // ============================================
  // SLIDE 11: ACTIONABLE RECOMMENDATIONS (NEW)
  // ============================================
  slides += \`
                    {/* SLIDE 11 - ACTIONABLE RECOMMENDATIONS */}
                    <div className="bg-white p-8 border-t-4 border-blue-600">
                        <div className="max-w-6xl mx-auto">
                            <h2 className="text-3xl font-bold text-blue-600 mb-6">Rekomendasi Tindakan</h2>
                            <p className="text-gray-600 mb-6">
                                Langkah konkret untuk mengoptimalkan performa campaign bulan depan
                            </p>

                            \${recommendations.length > 0 ? \`
                            <div class="space-y-4">
                                \${recommendations.map((rec, index) => \`
                                <div class="flex items-start p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <div class="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                                        \${index + 1}
                                    </div>
                                    <div class="flex-1">
                                        <p class="text-gray-800">\${rec.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</p>
                                    </div>
                                </div>
                                \`).join('')}
                            </div>
                            \` : \`
                            <div class="p-4 bg-gray-50 border border-gray-200 rounded">
                                <p class="text-gray-600">Insufficient data untuk generate recommendations. Silakan upload breakdown files yang lengkap.</p>
                            </div>
                            \`}

                            <div class="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <h4 class="font-semibold text-yellow-800 mb-2">📅 Checklist Bulan Depan</h4>
                                <ul class="space-y-2 text-sm text-gray-700">
                                    <li class="flex items-start">
                                        <input type="checkbox" class="mt-1 mr-2" />
                                        <span>Review dan implementasi rekomendasi di atas</span>
                                    </li>
                                    <li class="flex items-start">
                                        <input type="checkbox" class="mt-1 mr-2" />
                                        <span>A/B test new creatives berdasarkan best performing ads</span>
                                    </li>
                                    <li class="flex items-start">
                                        <input type="checkbox" class="mt-1 mr-2" />
                                        <span>Monitor funnel metrics harian untuk detect early warning signs</span>
                                    </li>
                                    <li class="flex items-start">
                                        <input type="checkbox" class="mt-1 mr-2" />
                                        <span>Optimize berdasarkan data \${thisPeriodLabel.toLowerCase()} untuk improvement berkelanjutan</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>\`

  // ============================================
  // SLIDE 12: NEXT STEPS (NEW)
  // ============================================
  slides += \`
                    {/* SLIDE 12 - NEXT STEPS */}
                    <div className="bg-white p-8 border-t-4 border-blue-600">
                        <div className="max-w-6xl mx-auto">
                            <h2 className="text-3xl font-bold text-blue-600 mb-6">Langkah Selanjutnya</h2>

                            <div class="grid grid-cols-2 gap-6">
                                <div>
                                    <h3 class="text-xl font-semibold text-gray-800 mb-4">🎯 Prioritas Tinggi</h3>
                                    <ul class="space-y-3">
                                        <li class="flex items-start">
                                            <span class="text-red-600 mr-2">1.</span>
                                            <span class="text-gray-700">\${thisROAS < 1.0 ? 'Investigate dan fix root cause of low ROAS sebelum scaling' : 'Validate dan scale winning campaigns dengan hati-hati'}</span>
                                        </li>
                                        <li class="flex items-start">
                                            <span class="text-red-600 mr-2">2.</span>
                                            <span class="text-gray-700">\${thisCVToATC < 5 ? 'Improve ATC rate dengan testing offer/price' : 'Maintain ATC rate dan explore upsell opportunities'}</span>
                                        </li>
                                        <li class="flex items-start">
                                            <span class="text-red-600 mr-2">3.</span>
                                            <span class="text-gray-700">\${thisATCToPurchase < 5 ? 'Review dan optimize checkout process' : 'Optimize average order value dengan bundling'}</span>
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 class="text-xl font-semibold text-gray-800 mb-4">📊 Monitoring Plan</h3>
                                    <ul class="space-y-3 text-sm text-gray-700">
                                        <li class="flex items-start">
                                            <span class="text-blue-600 mr-2">•</span>
                                            <span>Track ROAS harian untuk detect trend early</span>
                                        </li>
                                        <li class="flex items-start">
                                            <span class="text-blue-600 mr-2">•</span>
                                            <span>Monitor funnel metrics setiap 3 hari</span>
                                        </li>
                                        <li class="flex items-start">
                                            <span class="text-blue-600 mr-2">•</span>
                                            <span>Review platform performance weekly</span>
                                        </li>
                                        <li class="flex items-start">
                                            <span class="text-blue-600 mr-2">•</span>
                                            <span>Prepare report \${isMoM ? 'bulan' : 'minggu'} depan untuk comparison</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <h4 class="font-semibold text-blue-800 mb-2">💬 Diskusi dengan Tim</h4>
                                <p class="text-sm text-gray-700">
                                    Jadwalkan meeting dengan tim untuk membahas:
                                    1) Hasil implementasi rekomendasi, 2) Hasil A/B test creatives,
                                    3) Budget allocation untuk \${isMoM ? 'bulan' : 'minggu'} depan, 4) Strategic priorities
                                </p>
                            </div>
                        </div>
                    </div>\`

  // ============================================
  // SLIDE 13: CLOSING
  // ============================================
  slides += \`
                    {/* SLIDE 13 - CLOSING */}
                    <div className="bg-white p-8 border-t-4 border-blue-600">
                        <div className="max-w-6xl mx-auto text-center">
                            <h2 className="text-3xl font-bold text-blue-600 mb-6">Terima Kasih</h2>
                            <p className="text-lg text-gray-700 mb-4">
                                Laporan ini dihasilkan oleh Meta Ads Report Generator
                            </p>
                            <p className="text-gray-600 mb-8">
                                Untuk pertanyaan atau diskusi lebih lanjut, silakan hubungi tim marketing Anda
                            </p>
                            <div className="h-1 w-32 bg-blue-600 mx-auto mb-6"></div>
                            <p class="text-sm text-gray-500">
                                \${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </div>
                    </div>\`

  // Close HTML tags
  slides += \`
                    </div>
                </body>
            </html>\`

  return slides
}
