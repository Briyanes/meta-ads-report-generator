import { NextRequest, NextResponse } from 'next/server'
// import { analyzeCSVWithZAI } from '@/lib/zai'
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
    
    // Get all form data entries
    const entries = Array.from(formData.entries())
    
    for (const [key, value] of entries) {
      if (key.startsWith('breakdownThisWeek_') && value instanceof File) {
        breakdownThisWeek.push(value)
      }
      if (key.startsWith('breakdownLastWeek_') && value instanceof File) {
        breakdownLastWeek.push(value)
      }
    }
    
    // Debug log (remove in production)
    console.log('Main files:', {
      thisWeek: fileThisWeek?.name,
      lastWeek: fileLastWeek?.name
    })
    console.log('Breakdown files:', {
      thisWeek: breakdownThisWeek.map(f => f.name),
      lastWeek: breakdownLastWeek.map(f => f.name)
    })

    // Parse main CSV files
    const parsedDataThisWeek = await parseCSV(fileThisWeek)
    const parsedDataLastWeek = await parseCSV(fileLastWeek)
    
    // Helper to aggregate breakdown data by dimension (age, platform, etc.)
    const aggregateBreakdownData = (data: any[], dimensionKey: string): any[] => {
      if (data.length === 0) return []
      
      const parseNum = (val: any): number => {
        if (!val && val !== 0) return 0
        const str = String(val).replace(/,/g, '')
        const num = parseFloat(str)
        return isNaN(num) ? 0 : num
      }
      
      // Group by dimension (age, platform, placement, etc.)
      const grouped: Record<string, any[]> = {}
      for (const row of data) {
        const key = row[dimensionKey] || 'Unknown'
        if (!grouped[key]) {
          grouped[key] = []
        }
        grouped[key].push(row)
      }
      
      // Aggregate each group
      const aggregated: any[] = []
      for (const [key, rows] of Object.entries(grouped)) {
        if (rows.length === 0) continue
        
        const firstRow = rows[0]
        const aggregatedRow: any = { [dimensionKey]: key }
        
        // Sum numeric fields, keep first value for non-numeric
        for (const fieldKey of Object.keys(firstRow)) {
          if (fieldKey === dimensionKey || 
              fieldKey === 'Reporting starts' || 
              fieldKey === 'Reporting ends' ||
              fieldKey === 'Day' ||
              fieldKey === 'Date') {
            aggregatedRow[fieldKey] = firstRow[fieldKey]
            continue
          }
          
          const values = rows.map(r => r[fieldKey])
          const numericValues = values.map(v => parseNum(v)).filter(v => !isNaN(v))
          
          if (numericValues.length > 0) {
            aggregatedRow[fieldKey] = numericValues.reduce((sum, val) => sum + val, 0)
          } else {
            aggregatedRow[fieldKey] = values[0] || ''
          }
        }
        
        aggregated.push(aggregatedRow)
      }
      
      return aggregated
    }
    
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
      
      // Aggregate breakdown data by dimension
      let aggregatedData = parsed.data
      if (fileType === 'age' && parsed.data.length > 0) {
        aggregatedData = aggregateBreakdownData(parsed.data, 'Age')
      } else if (fileType === 'gender' && parsed.data.length > 0) {
        aggregatedData = aggregateBreakdownData(parsed.data, 'Gender')
      } else if (fileType === 'region' && parsed.data.length > 0) {
        aggregatedData = aggregateBreakdownData(parsed.data, 'Region')
      } else if (fileType === 'platform' && parsed.data.length > 0) {
        aggregatedData = aggregateBreakdownData(parsed.data, 'Platform')
      } else if (fileType === 'placement' && parsed.data.length > 0) {
        aggregatedData = aggregateBreakdownData(parsed.data, 'Placement')
      } else if (fileType === 'objective' && parsed.data.length > 0) {
        aggregatedData = aggregateBreakdownData(parsed.data, 'Objective')
      }
      
      breakdownDataThisWeek[fileType] = aggregatedData
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
      
      // Aggregate breakdown data by dimension
      let aggregatedData = parsed.data
      if (fileType === 'age' && parsed.data.length > 0) {
        aggregatedData = aggregateBreakdownData(parsed.data, 'Age')
      } else if (fileType === 'gender' && parsed.data.length > 0) {
        aggregatedData = aggregateBreakdownData(parsed.data, 'Gender')
      } else if (fileType === 'region' && parsed.data.length > 0) {
        aggregatedData = aggregateBreakdownData(parsed.data, 'Region')
      } else if (fileType === 'platform' && parsed.data.length > 0) {
        aggregatedData = aggregateBreakdownData(parsed.data, 'Platform')
      } else if (fileType === 'placement' && parsed.data.length > 0) {
        aggregatedData = aggregateBreakdownData(parsed.data, 'Placement')
      } else if (fileType === 'objective' && parsed.data.length > 0) {
        aggregatedData = aggregateBreakdownData(parsed.data, 'Objective')
      }
      
      breakdownDataLastWeek[fileType] = aggregatedData
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

    // Extract data from CSV directly (Z AI commented out for now)
    // const combinedData = `MINGGU INI (This Week) - Main Data:\n${csvTextThisWeek}${breakdownTextThisWeek}\n\nMINGGU LALU (Last Week) - Main Data:\n${csvTextLastWeek}${breakdownTextLastWeek}`
    
    // let analysis: string
    // try {
    //   analysis = await analyzeCSVWithZAI(
    //     combinedData,
    //     analysisPrompt
    //   )
    // } catch (zaiError: any) {
    //   // If Z AI fails, extract data from CSV and create structured analysis
    //   console.warn('Z AI API failed, extracting data from CSV:', zaiError.message)
    
    // Helper to parse numbers
    const parseNum = (val: any): number => {
      if (!val && val !== 0) return 0
      const str = String(val).replace(/,/g, '')
      const num = parseFloat(str)
      return isNaN(num) ? 0 : num
    }
    
    // Helper to aggregate CSV data (sum all rows for numeric fields)
    const aggregateCSVData = (data: any[]): any => {
      if (data.length === 0) return {}
      if (data.length === 1) return data[0]
      
      // Get all keys from first row
      const keys = Object.keys(data[0])
      const aggregated: any = {}
      
      // Helper to check if field should be summed (case-insensitive, partial match)
      const shouldSumField = (key: string): boolean => {
        const keyLower = key.toLowerCase()
        const sumFieldPatterns = [
          'amount spent', 'impressions', 'link clicks', 'outbound clicks', 'clicks (all)',
          'reach', 'content views', 'content views with shared items',
          'adds to cart', 'adds to cart with shared items',
          'purchases', 'purchases with shared items',
          'messaging conversations started', 'checkouts initiated',
          'atc conversion value', 'atc conversion value (shared only)',
          'purchases conversion value', 'purchases conversion value for shared items only',
          'adds to cart conversion value for shared items only',
          'results'
        ]
        return sumFieldPatterns.some(pattern => keyLower.includes(pattern.toLowerCase()))
      }
      
      // Helper to check if field should be recalculated (case-insensitive, partial match)
      const shouldRecalcField = (key: string): boolean => {
        const keyLower = key.toLowerCase()
        const recalcFieldPatterns = [
          'ctr (link click-through rate)', 'ctr (all)', 'cpc (cost per link click)', 
          'cpm (cost per 1,000 impressions)', 'cost per 1,000 accounts center accounts reached',
          'cost /cv', 'cost /atc', 'cost /purchase', 'cost per result',
          'frequency', 'purchase roas for shared items only', 'aov',
          '* lc to cv', '* cv to atc', 'atc to purchase', 'conversion rate ranking'
        ]
        return recalcFieldPatterns.some(pattern => keyLower.includes(pattern.toLowerCase()))
      }
      
      // For each key, sum all values if numeric, otherwise keep first value
      for (const key of keys) {
        // Skip date and text fields
        if (key === 'Day' || key === 'Delivery status' || key === 'Delivery level' || 
            key === 'Reporting starts' || key === 'Reporting ends' || key === 'Result type') {
          aggregated[key] = data[0][key] || ''
          continue
        }
        
        // For fields that should be recalculated, skip summing
        if (shouldRecalcField(key)) {
          aggregated[key] = '' // Will be recalculated later if needed
          continue
        }
        
        const values = data.map(row => row[key])
        const numericValues = values.map(v => parseNum(v)).filter(v => !isNaN(v))
        
        if (numericValues.length > 0) {
          // Sum numeric values for sumFields
          if (shouldSumField(key)) {
            aggregated[key] = numericValues.reduce((sum, val) => sum + val, 0)
          } else {
            // For other numeric fields, try to sum, but if all values are same, keep first
            const allSame = numericValues.length > 0 && numericValues.every(v => v === numericValues[0])
            aggregated[key] = allSame ? numericValues[0] : numericValues.reduce((sum, val) => sum + val, 0)
          }
        } else {
          // Keep first non-numeric value, or 0 if empty
          // But if it's a numeric field that should be summed, use 0 instead of empty string
          if (shouldSumField(key)) {
            aggregated[key] = 0
          } else {
            aggregated[key] = values[0] || 0
          }
        }
      }
      
      // Recalculate CTR, CPC, CPM after aggregation
      // Find the exact field names (case-insensitive, exact match preferred)
      // Note: Papa.parse removes quotes from field names, so 'Link clicks' not '"Link clicks"'
      const linkClicksKey = keys.find(k => k === 'Link clicks') || 
                           keys.find(k => k.toLowerCase() === 'link clicks') ||
                           keys.find(k => k.toLowerCase().includes('link clicks') && !k.toLowerCase().includes('cost'))
      const impressionsKey = keys.find(k => k === 'Impressions') || 
                            keys.find(k => k.toLowerCase() === 'impressions')
      const reachKey = keys.find(k => k === 'Reach') || 
                      keys.find(k => k.toLowerCase() === 'reach')
      const amountSpentKey = keys.find(k => k === 'Amount spent (IDR)') ||
                            keys.find(k => k.toLowerCase().includes('amount spent'))
      const contentViewsKey = keys.find(k => k === 'Content views with shared items') ||
                             keys.find(k => k.toLowerCase().includes('content views with shared items'))
      const addsToCartKey = keys.find(k => k === 'Adds to cart with shared items') ||
                           keys.find(k => k.toLowerCase().includes('adds to cart with shared items'))
      const purchasesKey = keys.find(k => k === 'Purchases with shared items') ||
                          keys.find(k => k.toLowerCase().includes('purchases with shared items'))
      const purchasesCVKey = keys.find(k => k === 'Purchases conversion value for shared items only') ||
                            keys.find(k => k.toLowerCase().includes('purchases conversion value for shared items only'))
      const ctrKey = keys.find(k => k === 'CTR (link click-through rate)') ||
                    keys.find(k => k.toLowerCase().includes('ctr (link click-through rate)'))
      const cpcKey = keys.find(k => k === 'CPC (cost per link click)') ||
                    keys.find(k => k.toLowerCase().includes('cpc (cost per link click)'))
      const cpmKey = keys.find(k => k === 'CPM (cost per 1,000 impressions)') ||
                    keys.find(k => k.toLowerCase().includes('cpm (cost per 1,000 impressions)'))
      const frequencyKey = keys.find(k => k === 'Frequency') ||
                          keys.find(k => k.toLowerCase() === 'frequency')
      
      // Recalculate CTR (CSV format is already percentage, so we calculate from aggregated values)
      if (linkClicksKey && impressionsKey && ctrKey) {
        const linkClicks = parseNum(aggregated[linkClicksKey])
        const impressions = parseNum(aggregated[impressionsKey])
        if (linkClicks > 0 && impressions > 0) {
          aggregated[ctrKey] = (linkClicks / impressions) * 100
        } else {
          aggregated[ctrKey] = 0
        }
      }
      
      // Recalculate CPC
      if (linkClicksKey && amountSpentKey && cpcKey) {
        const linkClicks = parseNum(aggregated[linkClicksKey])
        const amountSpent = parseNum(aggregated[amountSpentKey])
        if (linkClicks > 0 && amountSpent > 0) {
          aggregated[cpcKey] = amountSpent / linkClicks
        } else {
          aggregated[cpcKey] = 0
        }
      }
      
      // Recalculate CPM
      if (impressionsKey && amountSpentKey && cpmKey) {
        const impressions = parseNum(aggregated[impressionsKey])
        const amountSpent = parseNum(aggregated[amountSpentKey])
        if (impressions > 0 && amountSpent > 0) {
          aggregated[cpmKey] = (amountSpent / impressions) * 1000
        } else {
          aggregated[cpmKey] = 0
        }
      }
      
      // Recalculate Frequency
      if (impressionsKey && reachKey && frequencyKey) {
        const impressions = parseNum(aggregated[impressionsKey])
        const reach = parseNum(aggregated[reachKey])
        if (impressions > 0 && reach > 0) {
          aggregated[frequencyKey] = impressions / reach
        } else {
          aggregated[frequencyKey] = 0
        }
      }
      
      // Recalculate Cost per Reach
      if (reachKey && amountSpentKey && aggregated[reachKey] > 0 && aggregated[amountSpentKey] > 0) {
        const costPerReachKey = keys.find(k => k.toLowerCase().includes('cost per 1,000 accounts center accounts reached'))
        if (costPerReachKey) {
          aggregated[costPerReachKey] = (aggregated[amountSpentKey] / aggregated[reachKey]) * 1000
        }
      }
      
      // Recalculate Cost per Content View
      if (contentViewsKey && amountSpentKey && aggregated[contentViewsKey] > 0 && aggregated[amountSpentKey] > 0) {
        const costPerCVKey = keys.find(k => k.toLowerCase().includes('cost /cv'))
        if (costPerCVKey) {
          aggregated[costPerCVKey] = aggregated[amountSpentKey] / aggregated[contentViewsKey]
        }
      }
      
      // Recalculate Cost per ATC
      if (addsToCartKey && amountSpentKey && aggregated[addsToCartKey] > 0 && aggregated[amountSpentKey] > 0) {
        const costPerATCKey = keys.find(k => k.toLowerCase().includes('cost /atc'))
        if (costPerATCKey) {
          aggregated[costPerATCKey] = aggregated[amountSpentKey] / aggregated[addsToCartKey]
        }
      }
      
      // Recalculate Cost per Purchase
      if (purchasesKey && amountSpentKey && aggregated[purchasesKey] > 0 && aggregated[amountSpentKey] > 0) {
        const costPerPurchaseKey = keys.find(k => k.toLowerCase().includes('cost /purchase'))
        if (costPerPurchaseKey) {
          aggregated[costPerPurchaseKey] = aggregated[amountSpentKey] / aggregated[purchasesKey]
        }
      }
      
      // Recalculate ROAS
      if (purchasesCVKey && amountSpentKey && aggregated[purchasesCVKey] > 0 && aggregated[amountSpentKey] > 0) {
        const roasKey = keys.find(k => k.toLowerCase().includes('purchase roas for shared items only'))
        if (roasKey) {
          aggregated[roasKey] = aggregated[purchasesCVKey] / aggregated[amountSpentKey]
        }
      }
      
      // Recalculate AOV
      if (purchasesKey && purchasesCVKey && aggregated[purchasesKey] > 0 && aggregated[purchasesCVKey] > 0) {
        const aovKey = keys.find(k => k.toLowerCase().includes('aov'))
        if (aovKey) {
          aggregated[aovKey] = aggregated[purchasesCVKey] / aggregated[purchasesKey]
        }
      }
      
      return aggregated
    }
    
    // Aggregate data from CSV (in case CSV has multiple rows/days)
    const thisWeekData = aggregateCSVData(parsedDataThisWeek.data)
    const lastWeekData = aggregateCSVData(parsedDataLastWeek.data)
    
    // Debug: Log aggregated data to verify
    console.log('=== AGGREGATION DEBUG ===')
    console.log('This Week Data Keys:', Object.keys(thisWeekData))
    console.log('This Week Sample Values:', {
      'Reach': thisWeekData['Reach'],
      'Link clicks': thisWeekData['Link clicks'],
      'Frequency': thisWeekData['Frequency'],
      'CTR (link click-through rate)': thisWeekData['CTR (link click-through rate)'],
      'CPC (cost per link click)': thisWeekData['CPC (cost per link click)'],
      'CPM (cost per 1,000 impressions)': thisWeekData['CPM (cost per 1,000 impressions)'],
      'Amount spent (IDR)': thisWeekData['Amount spent (IDR)'],
      'Impressions': thisWeekData['Impressions']
    })
    console.log('Last Week Data Keys:', Object.keys(lastWeekData))
    console.log('Last Week Sample Values:', {
      'Reach': lastWeekData['Reach'],
      'Link clicks': lastWeekData['Link clicks'],
      'Frequency': lastWeekData['Frequency'],
      'CTR (link click-through rate)': lastWeekData['CTR (link click-through rate)'],
      'CPC (cost per link click)': lastWeekData['CPC (cost per link click)'],
      'CPM (cost per 1,000 impressions)': lastWeekData['CPM (cost per 1,000 impressions)'],
      'Amount spent (IDR)': lastWeekData['Amount spent (IDR)'],
      'Impressions': lastWeekData['Impressions'],
      'Adds to cart conversion value for shared items only': lastWeekData['Adds to cart conversion value for shared items only']
    })
    
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
    
    // Helper to get field value with case-insensitive matching
    const getFieldValue = (data: any, fieldName: string, alternatives: string[] = []): any => {
      if (!data || typeof data !== 'object') return undefined
      
      const allFields = [fieldName, ...alternatives]
      const dataKeys = Object.keys(data)
      
      for (const field of allFields) {
        // Try exact match first
        if (data[field] !== undefined && data[field] !== null && data[field] !== '') {
          return data[field]
        }
        // Try case-insensitive exact match
        const exactMatch = dataKeys.find(key => key.toLowerCase() === field.toLowerCase())
        if (exactMatch && data[exactMatch] !== undefined && data[exactMatch] !== null && data[exactMatch] !== '') {
          return data[exactMatch]
        }
        // Try partial match (for fields with variations)
        const partialMatch = dataKeys.find(key => {
          const keyLower = key.toLowerCase()
          const fieldLower = field.toLowerCase()
          return keyLower.includes(fieldLower) || fieldLower.includes(keyLower)
        })
        if (partialMatch && data[partialMatch] !== undefined && data[partialMatch] !== null && data[partialMatch] !== '') {
          return data[partialMatch]
        }
      }
      return undefined
    }
    
    // Build performance summary with all fields
    const buildPerformanceData = (data: any, results: number, cpr: number) => {
      const base = {
        amountSpent: parseNum(getFieldValue(data, 'Amount spent (IDR)')),
        impressions: parseNum(getFieldValue(data, 'Impressions')),
        linkClicks: parseNum(getFieldValue(data, 'Link clicks')),
        ctr: (() => {
          const ctrValue = parseNum(getFieldValue(data, 'CTR (link click-through rate)'))
          // CTR in CSV is already in percentage format (e.g., 1.3 means 1.3%), convert to decimal (0.013)
          return ctrValue > 1 ? ctrValue / 100 : ctrValue
        })(),
        cpc: parseNum(getFieldValue(data, 'CPC (cost per link click)')),
        cpm: parseNum(getFieldValue(data, 'CPM (cost per 1,000 impressions)')),
        outboundClicks: parseNum(getFieldValue(data, 'Outbound clicks')),
        frequency: parseNum(getFieldValue(data, 'Frequency')),
        reach: parseNum(getFieldValue(data, 'Reach')),
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
          atcConversionValue: parseNum(getFieldValue(data, 'Adds to cart conversion value for shared items only', [
            'ATC conversion value (shared only)',
            'ATC conversion value',
            'Adds to cart conversion value for shared items only'
          ])),
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
    
    const analysis = {
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

