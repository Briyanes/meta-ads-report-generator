import { NextRequest, NextResponse } from 'next/server'
import { analyzeCSVWithZAI } from '@/lib/zai'
import { parseCSV, analyzeDataStructure } from '@/lib/csvParser'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const fileThisWeek = formData.get('fileThisWeek') as File
    const fileLastWeek = formData.get('fileLastWeek') as File
    const retentionType = (formData.get('retentionType') as string) || 'wow'
    const objectiveType = (formData.get('objectiveType') as string) || 'ctwa'

    if (!fileThisWeek || !fileLastWeek) {
      return NextResponse.json(
        { error: 'Please provide both main CSV files (This Week & Last Week)' },
        { status: 400 }
      )
    }

    // Collect breakdown files
    const breakdownThisWeek: File[] = []
    const breakdownLastWeek: File[] = []
    
    for (const [key, value] of Array.from(formData.entries())) {
      if (key.startsWith('breakdownThisWeek_') && value instanceof File) {
        breakdownThisWeek.push(value)
      }
      if (key.startsWith('breakdownLastWeek_') && value instanceof File) {
        breakdownLastWeek.push(value)
      }
    }

    // Parse main CSV files
    const parsedDataThisWeek = await parseCSV(fileThisWeek)
    const parsedDataLastWeek = await parseCSV(fileLastWeek)
    
    // Parse breakdown files
    const breakdownDataThisWeek: Record<string, any> = {}
    const breakdownDataLastWeek: Record<string, any> = {}
    
    for (const file of breakdownThisWeek) {
      const parsed = await parseCSV(file)
      const fileType = file.name.includes('-age') ? 'age' :
                      file.name.includes('-gender') ? 'gender' :
                      file.name.includes('-region') ? 'region' :
                      file.name.includes('-platform') ? 'platform' :
                      file.name.includes('-placement') ? 'placement' :
                      file.name.includes('-objective') ? 'objective' :
                      file.name.includes('-ad-creative') || file.name.includes('-creative') ? 'ad-creative' : 'other'
      breakdownDataThisWeek[fileType] = parsed.data
    }
    
    for (const file of breakdownLastWeek) {
      const parsed = await parseCSV(file)
      const fileType = file.name.includes('-age') ? 'age' :
                      file.name.includes('-gender') ? 'gender' :
                      file.name.includes('-region') ? 'region' :
                      file.name.includes('-platform') ? 'platform' :
                      file.name.includes('-placement') ? 'placement' :
                      file.name.includes('-objective') ? 'objective' :
                      file.name.includes('-ad-creative') || file.name.includes('-creative') ? 'ad-creative' : 'other'
      breakdownDataLastWeek[fileType] = parsed.data
    }
    
    // Analyze data structure
    const structure = analyzeDataStructure(parsedDataThisWeek.data)
    
    // Update structure based on breakdown files
    structure.hasAge = structure.hasAge || !!breakdownDataThisWeek.age
    structure.hasGender = structure.hasGender || !!breakdownDataThisWeek.gender
    structure.hasRegion = structure.hasRegion || !!breakdownDataThisWeek.region
    structure.hasPlatform = structure.hasPlatform || !!breakdownDataThisWeek.platform
    structure.hasPlacement = structure.hasPlacement || !!breakdownDataThisWeek.placement
    structure.hasObjective = structure.hasObjective || !!breakdownDataThisWeek.objective
    structure.hasCreative = structure.hasCreative || !!breakdownDataThisWeek['ad-creative']

    // Read CSV files first (can only read once)
    const csvTextThisWeek = await fileThisWeek.text()
    const csvTextLastWeek = await fileLastWeek.text()
    
    // Combine breakdown data
    let breakdownTextThisWeek = ''
    let breakdownTextLastWeek = ''
    
    for (const [type, data] of Object.entries(breakdownDataThisWeek)) {
      if (data && data.length > 0) {
        breakdownTextThisWeek += `\n\n${type.toUpperCase()} Breakdown (Minggu Ini):\n${JSON.stringify(data, null, 2)}`
      }
    }
    
    for (const [type, data] of Object.entries(breakdownDataLastWeek)) {
      if (data && data.length > 0) {
        breakdownTextLastWeek += `\n\n${type.toUpperCase()} Breakdown (Minggu Lalu):\n${JSON.stringify(data, null, 2)}`
      }
    }

    // Prepare analysis prompt for Week-on-Week comparison
    const analysisPrompt = `
Analyze these Meta Ads CSV data for Week-on-Week comparison and extract the following insights:

1. Performance Summary (Week-on-Week comparison):
   - Amount Spent
   - Impressions
   - Link Clicks
   - CTR (Link)
   - CPC (Link)
   - CPM
   - Outbound Clicks
   - Messaging Conversations Started (WA)
   - Cost per WA
   - Frequency (Weighted Avg)
   - Avg Daily Reach
   - OC → WA Landing Ratio

2. Demographics Analysis (if available):
   - Age performance (Result, CPR)
   - Gender performance (Impressions, Outbound Click, CTR)
   - Region performance (Impressions, Link Click, CTR)

3. Platform Performance:
   - Instagram focus (Result, CPR, Impressions, Outbound Click, CTR)

4. Placement Performance:
   - Stories, Reels, Feed (Result, CPR, Impressions, Outbound Click, CTR)

5. Creative Performance:
   - Best and worst performing ads (Result, CPR, Impressions, Outbound Click, CTR)

6. Campaign Objective Performance:
   - Outbox_Sales → Sales
   - Link_Clicks → Traffic
   - Messaging Conversation, Result, Instagram Profile Visits, Instagram Follower

7. Week-on-Week Analysis:
   - Highlights (3-5 points)
   - Lowlights (3-5 points)

8. Overall Conclusion & Strategic Action Plan

Return the analysis as structured JSON data that can be used to generate the HTML report.
`

    // Analyze with Z AI
    const combinedData = `MINGGU INI (This Week) - Main Data:\n${csvTextThisWeek}${breakdownTextThisWeek}\n\nMINGGU LALU (Last Week) - Main Data:\n${csvTextLastWeek}${breakdownTextLastWeek}`
    
    let analysis: string
    try {
      analysis = await analyzeCSVWithZAI(
        combinedData,
        analysisPrompt
      )
    } catch (zaiError: any) {
      // If Z AI fails, extract data from CSV and create structured analysis
      console.warn('Z AI API failed, extracting data from CSV:', zaiError.message)
      
      // Extract data from CSV
      const thisWeekData = parsedDataThisWeek.data[0] || {}
      const lastWeekData = parsedDataLastWeek.data[0] || {}
      
      // Helper to parse numbers
      const parseNum = (val: any): number => {
        if (!val && val !== 0) return 0
        const str = String(val).replace(/,/g, '')
        const num = parseFloat(str)
        return isNaN(num) ? 0 : num
      }
      
      // Calculate base metrics
      const thisWeekSpend = parseNum(thisWeekData['Amount spent (IDR)'])
      const lastWeekSpend = parseNum(lastWeekData['Amount spent (IDR)'])
      
      // Extract results based on objective type
      let thisWeekResults = 0
      let lastWeekResults = 0
      
      if (objectiveType === 'cpas') {
        // CPAS: Use purchases
        thisWeekResults = parseNum(thisWeekData['Purchases'] || thisWeekData['Purchases with shared items'] || 0)
        lastWeekResults = parseNum(lastWeekData['Purchases'] || lastWeekData['Purchases with shared items'] || 0)
      } else if (objectiveType === 'ctlptowa') {
        // CTLP to WA: Use checkouts initiated
        thisWeekResults = parseNum(thisWeekData['Checkouts initiated'] || 0)
        lastWeekResults = parseNum(lastWeekData['Checkouts initiated'] || 0)
      } else {
        // CTWA: Use messaging conversations
        thisWeekResults = parseNum(thisWeekData['Messaging conversations started'] || 0)
        lastWeekResults = parseNum(lastWeekData['Messaging conversations started'] || 0)
      }
      
      const thisWeekCPR = thisWeekResults > 0 ? thisWeekSpend / thisWeekResults : 0
      const lastWeekCPR = lastWeekResults > 0 ? lastWeekSpend / lastWeekResults : 0
      
      // Calculate growth
      const spendGrowth = lastWeekSpend > 0 ? ((thisWeekSpend - lastWeekSpend) / lastWeekSpend * 100) : 0
      const resultsGrowth = lastWeekResults > 0 ? ((thisWeekResults - lastWeekResults) / lastWeekResults * 100) : 0
      
      // Collect all file names for client name extraction
      const allFileNames = [
        fileThisWeek.name,
        fileLastWeek.name,
        ...breakdownThisWeek.map(f => f.name),
        ...breakdownLastWeek.map(f => f.name)
      ]
      
      // Build performance summary with all fields
      const buildPerformanceData = (data: any, results: number, cpr: number) => {
        const base = {
          amountSpent: parseNum(data['Amount spent (IDR)']),
          impressions: parseNum(data['Impressions']),
          linkClicks: parseNum(data['Link clicks']),
          ctr: parseNum(data['CTR (link click-through rate)']),
          cpc: parseNum(data['CPC (cost per link click)']),
          cpm: parseNum(data['CPM (cost per 1,000 impressions)']),
          outboundClicks: parseNum(data['Outbound clicks']),
          frequency: parseNum(data['Frequency']),
          reach: parseNum(data['Reach']),
          cpr: cpr
        }
        
        // CTWA fields
        if (objectiveType === 'ctwa') {
          return {
            ...base,
            messagingConversations: results,
            costPerWA: parseNum(data['Cost per messaging conversation started'])
          }
        }
        
        // CTLP to WA fields
        if (objectiveType === 'ctlptowa') {
          // Extract ratio fields (they're already calculated in CSV)
          const ocToLPV = parseNum(data['* OC to LPV'] || 0)
          const lcToLPV = parseNum(data['* LC to LPV'] || 0)
          const lpvToIC = parseNum(data['* LPV to IC'] || 0)
          
          return {
            ...base,
            checkoutsInitiated: results,
            landingPageViews: parseNum(data['Website landing page views'] || data['Landing page views'] || 0),
            contentViews: parseNum(data['Content views'] || 0),
            clicksAll: parseNum(data['Clicks (all)'] || 0),
            ctrAll: parseNum(data['CTR (all)'] || 0),
            ocToLPV: ocToLPV, // Ratio from CSV (0-1 format)
            lcToLPV: lcToLPV, // Ratio from CSV (0-1 format)
            lpvToIC: lpvToIC  // Ratio from CSV (0-1 format)
          }
        }
        
        // CPAS fields
        if (objectiveType === 'cpas') {
          return {
            ...base,
            purchases: results,
            addsToCart: parseNum(data['Adds to cart'] || data['Adds to cart with shared items']),
            contentViews: parseNum(data['Content views'] || data['Content views with shared items']),
            atcConversionValue: parseNum(data['ATC conversion value'] || data['ATC conversion value (shared only)']),
            purchasesConversionValue: parseNum(data['Purchases conversion value'] || data['Purchases conversion value for shared items only'])
          }
        }
        
        // Default (CTWA)
        return {
          ...base,
          messagingConversations: results,
          costPerWA: parseNum(data['Cost per messaging conversation started'])
        }
      }
      
      // Extract event data if CSV has date column (for CPAS only)
      let eventAnalysis: any = {}
      if (objectiveType === 'cpas') {
        eventAnalysis = extractEventData(parsedDataThisWeek.data, parsedDataLastWeek.data, retentionType)
      }
      
      analysis = JSON.stringify({
        performanceSummary: {
          thisWeek: buildPerformanceData(thisWeekData, thisWeekResults, thisWeekCPR),
          lastWeek: buildPerformanceData(lastWeekData, lastWeekResults, lastWeekCPR),
          growth: {
            spend: spendGrowth,
            results: resultsGrowth,
            cpr: lastWeekCPR > 0 ? ((thisWeekCPR - lastWeekCPR) / lastWeekCPR * 100) : 0
          }
        },
        breakdown: {
          thisWeek: breakdownDataThisWeek,
          lastWeek: breakdownDataLastWeek
        },
        eventAnalysis: eventAnalysis,
        fileNames: allFileNames,
        retentionType: retentionType,
        objectiveType: objectiveType,
        note: 'Data extracted from CSV. Configure Z AI API for full AI analysis.'
      }, null, 2)
    }

    // Calculate breakdown summary
    const breakdownSummaryThisWeek = {
      totalFiles: Object.keys(breakdownDataThisWeek).length,
      totalRows: Object.values(breakdownDataThisWeek).reduce((sum: number, data: any) => {
        return sum + (Array.isArray(data) ? data.length : 0)
      }, 0),
      types: Object.keys(breakdownDataThisWeek)
    }
    
    const breakdownSummaryLastWeek = {
      totalFiles: Object.keys(breakdownDataLastWeek).length,
      totalRows: Object.values(breakdownDataLastWeek).reduce((sum: number, data: any) => {
        return sum + (Array.isArray(data) ? data.length : 0)
      }, 0),
      types: Object.keys(breakdownDataLastWeek)
    }

    return NextResponse.json({
      success: true,
      analysis,
      structure,
      summary: {
        thisWeek: {
          ...parsedDataThisWeek.summary,
          breakdownFiles: breakdownSummaryThisWeek.totalFiles,
          breakdownRows: breakdownSummaryThisWeek.totalRows,
          breakdownTypes: breakdownSummaryThisWeek.types
        },
        lastWeek: {
          ...parsedDataLastWeek.summary,
          breakdownFiles: breakdownSummaryLastWeek.totalFiles,
          breakdownRows: breakdownSummaryLastWeek.totalRows,
          breakdownTypes: breakdownSummaryLastWeek.types
        }
      },
      breakdown: {
        thisWeek: breakdownDataThisWeek,
        lastWeek: breakdownDataLastWeek
      }
    })
  } catch (error: any) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to analyze CSV' },
      { status: 500 }
    )
  }
}

// Helper function to extract event data from CSV based on dates
function extractEventData(thisWeekData: any[], lastWeekData: any[], retentionType: string): any {
  const eventAnalysis: any = {
    twindateThis: {},
    twindateLast: {},
    paydayThis: {},
    paydayLast: {}
  }
  
  // Check if CSV has date column
  const dateColumnNames = ['Date', 'Day', 'Day (YYYY-MM-DD)', 'Day (YYYY/MM/DD)', 'Reporting starts', 'Day name']
  let dateColumn: string | null = null
  
  if (thisWeekData.length > 0) {
    const firstRow = thisWeekData[0]
    dateColumn = Object.keys(firstRow).find(key => 
      dateColumnNames.some(name => key.toLowerCase().includes(name.toLowerCase()))
    ) || null
  }
  
  // If no date column found, return empty event analysis
  if (!dateColumn) {
    return eventAnalysis
  }
  
  // Helper function to parse date
  const parseDate = (dateStr: string): Date | null => {
    if (!dateStr) return null
    // Try different date formats
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return null
    return date
  }
  
  // Helper function to check if date is Twindate (tanggal kembar: 11.11, 12.12, dll)
  const isTwindate = (date: Date): boolean => {
    const day = date.getDate()
    const month = date.getMonth() + 1
    // Check if day and month are the same (e.g., 11/11, 12/12)
    return day === month
  }
  
  // Helper function to check if date is Payday (tanggal 21-5: dari tanggal 21 bulan ini sampai tanggal 5 bulan berikutnya)
  const isPayday = (date: Date): boolean => {
    const day = date.getDate()
    // Payday: tanggal 21-31 (akhir bulan) atau tanggal 1-5 (awal bulan)
    return day >= 21 || day <= 5
  }
  
  // Helper function to aggregate data for event
  const aggregateEventData = (data: any[]): any => {
    if (data.length === 0) return {}
    
    const parseNum = (val: any) => {
      if (typeof val === 'string') {
        const cleaned = val.replace(/[^\d.-]/g, '')
        return parseFloat(cleaned) || 0
      }
      return Number(val) || 0
    }
    
    // Sum all numeric values
    const aggregated: any = {}
    const firstRow = data[0]
    
    for (const key of Object.keys(firstRow)) {
      if (key === dateColumn) continue
      const values = data.map(row => parseNum(row[key])).filter(v => !isNaN(v))
      if (values.length > 0) {
        aggregated[key] = values.reduce((sum, val) => sum + val, 0)
      }
    }
    
    // Build performance data similar to buildPerformanceData
    const amountSpent = parseNum(aggregated['Amount spent (IDR)'])
    const purchases = parseNum(aggregated['Purchases with shared items'])
    const addsToCart = parseNum(aggregated['Adds to cart with shared items'])
    const contentViews = parseNum(aggregated['Content views with shared items'])
    const atcConversionValue = parseNum(aggregated['ATC conversion value (shared only)'])
    const purchasesConversionValue = parseNum(aggregated['Purchases conversion value for shared items only'])
    const linkClicks = parseNum(aggregated['Link clicks'])
    const impressions = parseNum(aggregated['Impressions'])
    const ctr = linkClicks > 0 && impressions > 0 ? linkClicks / impressions : 0
    const cpc = linkClicks > 0 ? parseNum(aggregated['CPC (cost per link click)']) : 0
    const cpm = parseNum(aggregated['CPM (cost per 1,000 impressions)'])
    const frequency = parseNum(aggregated['Frequency'])
    const purchaseROAS = amountSpent > 0 ? purchasesConversionValue / amountSpent : 0
    const costPerPurchase = purchases > 0 ? amountSpent / purchases : 0
    const costPerATC = addsToCart > 0 ? amountSpent / addsToCart : 0
    const conversionRate = linkClicks > 0 ? purchases / linkClicks : 0
    const avgPurchaseValue = purchases > 0 ? purchasesConversionValue / purchases : 0
    
    return {
      amountSpent,
      purchases,
      addsToCart,
      contentViews,
      atcConversionValue,
      purchasesConversionValue,
      linkClicks,
      impressions,
      ctr,
      cpc,
      cpm,
      frequency,
      purchaseROAS,
      costPerPurchase,
      costPerATC,
      conversionRate,
      avgPurchaseValue
    }
  }
  
  // Filter and aggregate Twindate data for this period
  const twindateThisData = thisWeekData.filter(row => {
    const dateStr = row[dateColumn!]
    if (!dateStr) return false
    const date = parseDate(dateStr)
    return date ? isTwindate(date) : false
  })
  
  // Filter and aggregate Twindate data for last period
  const twindateLastData = lastWeekData.filter(row => {
    const dateStr = row[dateColumn!]
    if (!dateStr) return false
    const date = parseDate(dateStr)
    return date ? isTwindate(date) : false
  })
  
  // Filter and aggregate Payday data for this period
  const paydayThisData = thisWeekData.filter(row => {
    const dateStr = row[dateColumn!]
    if (!dateStr) return false
    const date = parseDate(dateStr)
    return date ? isPayday(date) : false
  })
  
  // Filter and aggregate Payday data for last period
  const paydayLastData = lastWeekData.filter(row => {
    const dateStr = row[dateColumn!]
    if (!dateStr) return false
    const date = parseDate(dateStr)
    return date ? isPayday(date) : false
  })
  
  // Aggregate event data
  if (twindateThisData.length > 0) {
    eventAnalysis.twindateThis = aggregateEventData(twindateThisData)
  }
  if (twindateLastData.length > 0) {
    eventAnalysis.twindateLast = aggregateEventData(twindateLastData)
  }
  if (paydayThisData.length > 0) {
    eventAnalysis.paydayThis = aggregateEventData(paydayThisData)
  }
  if (paydayLastData.length > 0) {
    eventAnalysis.paydayLast = aggregateEventData(paydayLastData)
  }
  
  return eventAnalysis
}

