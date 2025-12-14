import { NextRequest, NextResponse } from 'next/server'
import { analyzeCSVWithZAI } from '@/lib/zai'
import { parseCSV, analyzeDataStructure } from '@/lib/csvParser'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const fileThisWeek = formData.get('fileThisWeek') as File
    const fileLastWeek = formData.get('fileLastWeek') as File

    if (!fileThisWeek || !fileLastWeek) {
      return NextResponse.json(
        { error: 'Please provide both main CSV files (This Week & Last Week)' },
        { status: 400 }
      )
    }

    // Collect breakdown files
    const breakdownThisWeek: File[] = []
    const breakdownLastWeek: File[] = []
    
    for (const [key, value] of formData.entries()) {
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
      
      // Calculate CPR (Cost Per Result)
      const thisWeekSpend = parseNum(thisWeekData['Amount spent (IDR)'])
      const thisWeekResults = parseNum(thisWeekData['Messaging conversations started'])
      const thisWeekCPR = thisWeekResults > 0 ? thisWeekSpend / thisWeekResults : 0
      
      const lastWeekSpend = parseNum(lastWeekData['Amount spent (IDR)'])
      const lastWeekResults = parseNum(lastWeekData['Messaging conversations started'])
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
      
      analysis = JSON.stringify({
        performanceSummary: {
          thisWeek: {
            amountSpent: thisWeekSpend,
            impressions: parseNum(thisWeekData['Impressions']),
            linkClicks: parseNum(thisWeekData['Link clicks']),
            ctr: parseNum(thisWeekData['CTR (link click-through rate)']),
            cpc: parseNum(thisWeekData['CPC (cost per link click)']),
            cpm: parseNum(thisWeekData['CPM (cost per 1,000 impressions)']),
            outboundClicks: parseNum(thisWeekData['Outbound clicks']),
            messagingConversations: thisWeekResults,
            costPerWA: parseNum(thisWeekData['Cost per messaging conversation started']),
            frequency: parseNum(thisWeekData['Frequency']),
            reach: parseNum(thisWeekData['Reach']),
            cpr: thisWeekCPR
          },
          lastWeek: {
            amountSpent: lastWeekSpend,
            impressions: parseNum(lastWeekData['Impressions']),
            linkClicks: parseNum(lastWeekData['Link clicks']),
            ctr: parseNum(lastWeekData['CTR (link click-through rate)']),
            cpc: parseNum(lastWeekData['CPC (cost per link click)']),
            cpm: parseNum(lastWeekData['CPM (cost per 1,000 impressions)']),
            outboundClicks: parseNum(lastWeekData['Outbound clicks']),
            messagingConversations: lastWeekResults,
            costPerWA: parseNum(lastWeekData['Cost per messaging conversation started']),
            frequency: parseNum(lastWeekData['Frequency']),
            reach: parseNum(lastWeekData['Reach']),
            cpr: lastWeekCPR
          },
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
        fileNames: allFileNames,
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

