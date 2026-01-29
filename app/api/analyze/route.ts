import { NextRequest, NextResponse } from 'next/server'
// import { analyzeCSVWithZAI } from '@/lib/zai'
import { parseCSV, analyzeDataStructure } from '@/lib/csvParser'

// Security: Check origin
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(',') || [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:3003',
  'https://meta-ads-report-generator.vercel.app',
  'https://hadona.id',
  'https://report.hadona.id',
  'https://*.vercel.app' // Allow all Vercel preview/deployment URLs
]

function isValidOrigin(origin: string | null): boolean {
  if (!origin) return false
  return ALLOWED_ORIGINS.some(allowed => {
    // Exact match
    if (origin === allowed) return true

    // Wildcard match (e.g., https://*.vercel.app)
    if (allowed.includes('*')) {
      const wildcardPattern = allowed.replace('*', '.*')
      const regex = new RegExp('^' + wildcardPattern)
      return regex.test(origin)
    }

    // Subdomain match
    const allowedDomain = allowed.replace('https://', '').replace('http://', '')
    const originDomain = origin.replace('https://', '').replace('http://', '')
    // Check if origin is exactly the allowed domain OR a subdomain of it
    return originDomain === allowedDomain ||
           originDomain.endsWith('.' + allowedDomain) ||
           allowedDomain.startsWith(originDomain + '.')
  })
}

// Security: Validate file type and size
const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

function isValidFile(file: File): boolean {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return false
  }
  // Check file extension
  if (!file.name.toLowerCase().endsWith('.csv')) {
    return false
  }
  // MIME type check is optional - browsers send different MIME types for CSV
  // We trust the file extension and will validate content during parsing
  return true
}

// Security: Validate retention and objective types
function isValidRetentionType(value: string): boolean {
  return ['wow', 'mom'].includes(value)
}

function isValidObjectiveType(value: string): boolean {
  return ['ctwa', 'cpas', 'ctlptowa'].includes(value)
}

export async function POST(request: NextRequest) {
  try {
    // Security: Check origin
    const origin = request.headers.get('origin')
    if (origin && !isValidOrigin(origin)) {
      return NextResponse.json(
        { error: 'Unauthorized origin' },
        { status: 403 }
      )
    }

    const formData = await request.formData()
    const fileThisWeek = formData.get('fileThisWeek') as File
    const fileLastWeek = formData.get('fileLastWeek') as File
    const retentionType = (formData.get('retentionType') as string) || 'wow'
    const objectiveType = (formData.get('objectiveType') as string) || 'ctwa'

    // Validate inputs
    if (!fileThisWeek || !fileLastWeek) {
      return NextResponse.json(
        { error: 'Please provide both main CSV files (This Week & Last Week)' },
        { status: 400 }
      )
    }

    // Security: Validate files
    if (!isValidFile(fileThisWeek)) {
      return NextResponse.json(
        { error: 'Invalid file: This Week file must be a CSV under 50MB' },
        { status: 400 }
      )
    }

    if (!isValidFile(fileLastWeek)) {
      return NextResponse.json(
        { error: 'Invalid file: Last Week file must be a CSV under 50MB' },
        { status: 400 }
      )
    }

    // Security: Validate retention type
    if (!isValidRetentionType(retentionType)) {
      return NextResponse.json(
        { error: 'Invalid retention type' },
        { status: 400 }
      )
    }

    // Security: Validate objective type
    if (!isValidObjectiveType(objectiveType)) {
      return NextResponse.json(
        { error: 'Invalid objective type' },
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
    
    // Helper: Detect if file is a "combined" format (contains multiple breakdown dimensions)
    const isCombinedFile = (fileName: string): boolean => {
      const nameLower = fileName.toLowerCase()
      // Combined files typically have patterns like "age-gender" or "platform-placement" together
      const combinedPatterns = [
        'age-gender',
        'platform-placement',
        'campaign-name-ad-creative'
      ]
      return combinedPatterns.some(pattern => nameLower.includes(pattern))
    }
    
    // Helper: Extract breakdown data from combined CSV file
    const extractBreakdownsFromCombinedFile = async (file: File): Promise<Record<string, any[]>> => {
      const parsed = await parseCSV(file)
      const data = parsed.data
      const headers = parsed.headers
      
      const breakdowns: Record<string, any[]> = {}
      
      // Check which dimensions exist in the data
      const hasAge = headers.includes('Age') && data.some((r: any) => r['Age'])
      const hasGender = headers.includes('Gender') && data.some((r: any) => r['Gender'])
      const hasRegion = headers.includes('Region') && data.some((r: any) => r['Region'])
      const hasPlatform = headers.includes('Platform') && data.some((r: any) => r['Platform'])
      const hasPlacement = headers.includes('Placement') && data.some((r: any) => r['Placement'])
      const hasObjective = headers.includes('Objective') && data.some((r: any) => r['Objective'])
      const hasAds = headers.includes('Ads') && data.some((r: any) => r['Ads'])

      if (hasAge) breakdowns['age'] = data.filter((r: any) => r['Age'])
      if (hasGender) breakdowns['gender'] = data.filter((r: any) => r['Gender'])
      if (hasRegion) breakdowns['region'] = data.filter((r: any) => r['Region'])
      if (hasPlatform) breakdowns['platform'] = data.filter((r: any) => r['Platform'])
      if (hasPlacement) breakdowns['placement'] = data.filter((r: any) => r['Placement'])
      if (hasObjective) breakdowns['objective'] = data.filter((r: any) => r['Objective'])
      if (hasAds) breakdowns['ad-creative'] = data.filter((r: any) => r['Ads'])
      
      return breakdowns
    }
    
    // Helper: Create aggregated main report from combined files
    const createMainReportFromCombinedFiles = async (files: File[]): Promise<any[]> => {
      const parseNum = (val: any): number => {
        if (!val && val !== 0) return 0
        let str = String(val).replace(/,/g, '').replace(/\s+/g, '')
        const num = parseFloat(str)
        return isNaN(num) ? 0 : num
      }
      
      // First, read the summary row (first row after header which usually contains totals)
      // In Meta Ads exports, the first data row is often the total row
      let summaryRow: any = null
      let reportingStarts = ''
      let reportingEnds = ''
      
      for (const file of files) {
        const parsed = await parseCSV(file)
        if (parsed.data.length > 0) {
          // Check if first row is a summary row (no campaign name, just totals)
          const firstRow = parsed.data[0]
          if (!firstRow['Campaign name'] && firstRow['Amount spent (IDR)']) {
            // This is a summary row
            if (!summaryRow) {
              summaryRow = { ...firstRow }
            }
          }
          // Get reporting dates from any row
          for (const row of parsed.data) {
            if (!reportingStarts && row['Reporting starts']) {
              reportingStarts = row['Reporting starts']
              reportingEnds = row['Reporting ends']
              break
            }
          }
        }
      }
      
      // If we found a summary row, use it directly (most accurate)
      if (summaryRow) {
        summaryRow['Reporting starts'] = reportingStarts
        summaryRow['Reporting ends'] = reportingEnds
        // Recalculate derived metrics
        const totals = summaryRow
        totals['Frequency'] = parseNum(totals['Reach']) > 0 ? parseNum(totals['Impressions']) / parseNum(totals['Reach']) : 0
        totals['CPM (cost per 1,000 impressions)'] = parseNum(totals['Impressions']) > 0 ? (parseNum(totals['Amount spent (IDR)']) / parseNum(totals['Impressions'])) * 1000 : 0
        totals['CTR (link click-through rate)'] = parseNum(totals['Impressions']) > 0 ? (parseNum(totals['Link clicks']) / parseNum(totals['Impressions'])) * 100 : 0
        totals['CPC (cost per link click)'] = parseNum(totals['Link clicks']) > 0 ? parseNum(totals['Amount spent (IDR)']) / parseNum(totals['Link clicks']) : 0
        totals['Cost per messaging conversation started'] = parseNum(totals['Messaging conversations started']) > 0 ? parseNum(totals['Amount spent (IDR)']) / parseNum(totals['Messaging conversations started']) : 0
        return [totals]
      }
      
      // Fallback: Aggregate from detail rows (less accurate due to potential overlaps)
      const totals: Record<string, number> = {
        'Reach': 0,
        'Impressions': 0,
        'Link clicks': 0,
        'Clicks (all)': 0,
        'Amount spent (IDR)': 0,
        'Messaging conversations started': 0,
        'Instagram follows': 0,
        'Outbound clicks': 0
      }
      
      // Use objective-level aggregation to avoid double-counting
      // Only count from ONE file to avoid duplicates across files
      let bestFile: File | null = null
      let bestRowCount = 0
      
      for (const file of files) {
        const parsed = await parseCSV(file)
        const dataRows = parsed.data.filter((r: any) => r['Campaign name']) // Only detail rows
        if (dataRows.length > bestRowCount) {
          bestRowCount = dataRows.length
          bestFile = file
        }
      }
      
      if (bestFile) {
        const parsed = await parseCSV(bestFile)
        for (const row of parsed.data) {
          if (row['Campaign name']) { // Only detail rows
            for (const field of Object.keys(totals)) {
              totals[field] += parseNum(row[field])
            }
          }
        }
      }
      
      // Calculate derived metrics
      const result: any = { ...totals }
      result['Frequency'] = totals['Reach'] > 0 ? totals['Impressions'] / totals['Reach'] : 0
      result['CPM (cost per 1,000 impressions)'] = totals['Impressions'] > 0 ? (totals['Amount spent (IDR)'] / totals['Impressions']) * 1000 : 0
      result['CTR (link click-through rate)'] = totals['Impressions'] > 0 ? (totals['Link clicks'] / totals['Impressions']) * 100 : 0
      result['CPC (cost per link click)'] = totals['Link clicks'] > 0 ? totals['Amount spent (IDR)'] / totals['Link clicks'] : 0
      result['Cost per messaging conversation started'] = totals['Messaging conversations started'] > 0 ? totals['Amount spent (IDR)'] / totals['Messaging conversations started'] : 0
      result['Reporting starts'] = reportingStarts
      result['Reporting ends'] = reportingEnds
      
      return [result]
    }
    
    // Check if we're dealing with combined files (new format from rmoda workshop)
    const allThisWeekFiles = [fileThisWeek, ...breakdownThisWeek]
    const allLastWeekFiles = [fileLastWeek, ...breakdownLastWeek]
    const hasCombinedFilesThisWeek = allThisWeekFiles.some(f => isCombinedFile(f.name))
    const hasCombinedFilesLastWeek = allLastWeekFiles.some(f => isCombinedFile(f.name))
    
    // console.log('[DEBUG] Has combined files - This Week:', hasCombinedFilesThisWeek, 'Last Week:', hasCombinedFilesLastWeek)

    // Parse main CSV files - handle combined format
    let parsedDataThisWeek: any
    let parsedDataLastWeek: any
    
    if (hasCombinedFilesThisWeek) {
      // Create aggregated main report from all combined files
      const mainData = await createMainReportFromCombinedFiles(allThisWeekFiles)
      parsedDataThisWeek = { data: mainData, headers: Object.keys(mainData[0] || {}), summary: { totalRows: 1 } }
      // console.log('[DEBUG] Created aggregated main report for This Week from combined files')
    } else {
      parsedDataThisWeek = await parseCSV(fileThisWeek)
    }
    
    if (hasCombinedFilesLastWeek) {
      // Create aggregated main report from all combined files
      const mainData = await createMainReportFromCombinedFiles(allLastWeekFiles)
      parsedDataLastWeek = { data: mainData, headers: Object.keys(mainData[0] || {}), summary: { totalRows: 1 } }
      // console.log('[DEBUG] Created aggregated main report for Last Week from combined files')
    } else {
      parsedDataLastWeek = await parseCSV(fileLastWeek)
    }
    
    // Helper to aggregate breakdown data by dimension (age, platform, etc.)
    const aggregateBreakdownData = (data: any[], dimensionKey: string): any[] => {
      if (data.length === 0) return []
      
      const parseNum = (val: any): number => {
        if (!val && val !== 0) return 0
        // Remove commas first, then remove ALL whitespace (including newlines, tabs, carriage returns)
        let str = String(val).replace(/,/g, '')
        str = str.replace(/\s+/g, '')  // KEY FIX: removes \n, \r, \t, spaces
        const num = parseFloat(str)
        return isNaN(num) ? 0 : num
      }
      
      // Filter out rows with empty/blank dimension key (these are usually summary rows)
      const filteredData = data.filter(row => {
        const dimValue = row[dimensionKey]
        return dimValue && String(dimValue).trim() !== '' && dimValue !== 'Unknown'
      })
      
      // Group by dimension (age, platform, placement, etc.)
      const grouped: Record<string, any[]> = {}
      for (const row of filteredData) {
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
        // Skip 'Unknown' key as it's likely a summary row
        if (key === 'Unknown' || key === '') continue
        
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

    // console.log('[DEBUG] breakdownThisWeek files:', breakdownThisWeek.map(f => f.name))
    // console.log('[DEBUG] hasCombinedFilesThisWeek:', hasCombinedFilesThisWeek)

    // Process this week files
    if (hasCombinedFilesThisWeek) {
      // Extract breakdowns from combined files - only extract each type ONCE to avoid duplicates
      // Track which breakdown types have already been extracted
      const extractedTypes = new Set<string>()

      for (const file of allThisWeekFiles) {
        if (isCombinedFile(file.name)) {
          const extractedBreakdowns = await extractBreakdownsFromCombinedFile(file)
          for (const [type, data] of Object.entries(extractedBreakdowns)) {
            // Only add if this type hasn't been extracted yet (prevents duplicate counting)
            if (!extractedTypes.has(type)) {
              breakdownDataThisWeek[type] = data
              extractedTypes.add(type)
            }
          }
        }
      }
      // Aggregate each breakdown type
      for (const [type, data] of Object.entries(breakdownDataThisWeek)) {
        const dimensionKey = type === 'age' ? 'Age' :
                            type === 'gender' ? 'Gender' :
                            type === 'region' ? 'Region' :
                            type === 'platform' ? 'Platform' :
                            type === 'placement' ? 'Placement' :
                            type === 'objective' ? 'Objective' :
                            type === 'ad-creative' ? 'Ads' : type
        breakdownDataThisWeek[type] = aggregateBreakdownData(data, dimensionKey)
      }

      // IMPORTANT: Also check for dedicated objective.csv file and use it (better data quality)
      // Combined files don't have proper WA data per objective
      for (const file of allThisWeekFiles) {
        const fileName = file.name.toLowerCase()
        // Check if this is a dedicated objective file (not a combined file with objective)
        const isObjectiveOnly = fileName === 'objective.csv' ||
          fileName.match(/^objective-.*\.csv$/) ||
          (fileName.endsWith('-objective.csv') &&
           !fileName.includes('creative') &&
           !fileName.includes('region') &&
           !fileName.includes('age') &&
           !fileName.includes('gender') &&
           !fileName.includes('platform') &&
           !fileName.includes('placement'))

        if (isObjectiveOnly) {
          const parsed = await parseCSV(file)
          if (parsed.data.length > 0) {
            // console.log('[DEBUG] Found dedicated objective file (This Week):', file.name)
            // console.log('[DEBUG] Objective file sample:', JSON.stringify(parsed.data[0], null, 2))
            breakdownDataThisWeek['objective'] = aggregateBreakdownData(parsed.data, 'Objective')
          }
        }

        // IMPORTANT: Also check for dedicated ad-creative.csv file (better data quality)
        // Combined files have WA=0 per creative because they are broken down by other dimensions
        const isAdCreativeOnly = fileName === 'ad-creative.csv' ||
          fileName.match(/^ad-creative-.*\.csv$/) ||
          (fileName.endsWith('-ad-creative.csv') &&
           !fileName.includes('region') &&
           !fileName.includes('age') &&
           !fileName.includes('gender') &&
           !fileName.includes('platform') &&
           !fileName.includes('placement') &&
           !fileName.includes('objective'))

        if (isAdCreativeOnly) {
          const parsed = await parseCSV(file)
          if (parsed.data.length > 0) {
            // console.log('[DEBUG] Found dedicated ad-creative file (This Week):', file.name)
            // console.log('[DEBUG] Ad Creative file sample:', JSON.stringify(parsed.data[0], null, 2))
            // Use 'Ads' or 'Ad name' as the dimension key
            const adNameKey = Object.keys(parsed.data[0]).find(k =>
              k.toLowerCase() === 'ads' || k.toLowerCase() === 'ad name' || k.toLowerCase().includes('ad name')
            ) || 'Ads'
            const aggregatedCreatives = aggregateBreakdownData(parsed.data, adNameKey)
            breakdownDataThisWeek['ad-creative'] = aggregatedCreatives
          }
        }

        // IMPORTANT: Also check for dedicated region.csv file
        // Region files are often separate (not combined) files
        const isRegionOnly = fileName === 'region.csv' ||
          fileName.match(/^region-.*\.csv$/) ||
          (fileName.includes('-region.') &&
           !fileName.includes('creative') &&
           !fileName.includes('age') &&
           !fileName.includes('gender') &&
           !fileName.includes('platform') &&
           !fileName.includes('placement') &&
           !fileName.includes('objective'))

        if (isRegionOnly) {
          const parsed = await parseCSV(file)
          if (parsed.data.length > 0) {
            const aggregatedRegion = aggregateBreakdownData(parsed.data, 'Region')
            breakdownDataThisWeek['region'] = aggregatedRegion
          }
        }
      }
      
    } else {
      // Original logic for separate breakdown files
      for (const file of breakdownThisWeek) {
        const parsed = await parseCSV(file)
        const fileName = file.name.toLowerCase()
        const fileType = fileName.startsWith('age-') || fileName.includes('-age') ? 'age' :
                        fileName.startsWith('gender-') || fileName.includes('-gender') ? 'gender' :
                        fileName.startsWith('region-') || fileName.includes('-region') ? 'region' :
                        fileName.startsWith('platform-') || fileName.includes('-platform') ? 'platform' :
                        fileName.startsWith('placement-') || fileName.includes('-placement') ? 'placement' :
                        fileName.startsWith('objective-') || fileName.includes('-objective') ? 'objective' :
                        fileName.includes('ad-creative') || fileName.includes('creative') ? 'ad-creative' : 'other'

        // console.log('[DEBUG] File:', fileName, '→ Detected as:', fileType)

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
    }
    
    // console.log('[DEBUG] breakdownLastWeek files:', breakdownLastWeek.map(f => f.name))
    // console.log('[DEBUG] hasCombinedFilesLastWeek:', hasCombinedFilesLastWeek)

    // Process last week files
    if (hasCombinedFilesLastWeek) {
      // Extract breakdowns from combined files - only extract each type ONCE to avoid duplicates
      // Track which breakdown types have already been extracted
      const extractedTypesLast = new Set<string>()
      
      for (const file of allLastWeekFiles) {
        if (isCombinedFile(file.name)) {
          const extractedBreakdowns = await extractBreakdownsFromCombinedFile(file)
          for (const [type, data] of Object.entries(extractedBreakdowns)) {
            // Only add if this type hasn't been extracted yet (prevents duplicate counting)
            if (!extractedTypesLast.has(type)) {
              breakdownDataLastWeek[type] = data
              extractedTypesLast.add(type)
            }
          }
        }
      }
      // Aggregate each breakdown type
      for (const [type, data] of Object.entries(breakdownDataLastWeek)) {
        const dimensionKey = type === 'age' ? 'Age' :
                            type === 'gender' ? 'Gender' :
                            type === 'region' ? 'Region' :
                            type === 'platform' ? 'Platform' :
                            type === 'placement' ? 'Placement' :
                            type === 'objective' ? 'Objective' :
                            type === 'ad-creative' ? 'Ads' : type
        breakdownDataLastWeek[type] = aggregateBreakdownData(data, dimensionKey)
      }
      
      // IMPORTANT: Also check for dedicated objective.csv file and use it (better data quality)
      for (const file of allLastWeekFiles) {
        const fileName = file.name.toLowerCase()
        // Check if this is a dedicated objective file (not a combined file with objective)
        const isObjectiveOnly = fileName === 'objective.csv' || 
          fileName.match(/^objective-.*\.csv$/) || 
          (fileName.endsWith('-objective.csv') && 
           !fileName.includes('creative') && 
           !fileName.includes('region') && 
           !fileName.includes('age') && 
           !fileName.includes('gender') && 
           !fileName.includes('platform') && 
           !fileName.includes('placement'))
        
        if (isObjectiveOnly) {
          const parsed = await parseCSV(file)
          if (parsed.data.length > 0) {
            // console.log('[DEBUG] Found dedicated objective file (Last Week):', file.name)
            // console.log('[DEBUG] Objective file sample:', JSON.stringify(parsed.data[0], null, 2))
            breakdownDataLastWeek['objective'] = aggregateBreakdownData(parsed.data, 'Objective')
          }
        }
        
        // IMPORTANT: Also check for dedicated ad-creative.csv file (better data quality)
        const isAdCreativeOnly = fileName === 'ad-creative.csv' || 
          fileName.match(/^ad-creative-.*\.csv$/) || 
          (fileName.endsWith('-ad-creative.csv') && 
           !fileName.includes('region') && 
           !fileName.includes('age') && 
           !fileName.includes('gender') && 
           !fileName.includes('platform') && 
           !fileName.includes('placement') &&
           !fileName.includes('objective'))
        
        if (isAdCreativeOnly) {
          const parsed = await parseCSV(file)
          if (parsed.data.length > 0) {
            // console.log('[DEBUG] Found dedicated ad-creative file (Last Week):', file.name)
            // console.log('[DEBUG] Ad Creative file sample:', JSON.stringify(parsed.data[0], null, 2))
            // Use 'Ads' or 'Ad name' as the dimension key
            const adNameKey = Object.keys(parsed.data[0]).find(k => 
              k.toLowerCase() === 'ads' || k.toLowerCase() === 'ad name' || k.toLowerCase().includes('ad name')
            ) || 'Ads'
            breakdownDataLastWeek['ad-creative'] = aggregateBreakdownData(parsed.data, adNameKey)
          }
        }

        // IMPORTANT: Also check for dedicated region.csv file
        // Region files are often separate (not combined) files
        const isRegionOnly = fileName === 'region.csv' ||
          fileName.match(/^region-.*\.csv$/) ||
          (fileName.includes('-region.') &&
           !fileName.includes('creative') &&
           !fileName.includes('age') &&
           !fileName.includes('gender') &&
           !fileName.includes('platform') &&
           !fileName.includes('placement') &&
           !fileName.includes('objective'))

        if (isRegionOnly) {
          const parsed = await parseCSV(file)
          if (parsed.data.length > 0) {
            const aggregatedRegion = aggregateBreakdownData(parsed.data, 'Region')
            breakdownDataLastWeek['region'] = aggregatedRegion
          }
        }
      }
      
      // console.log('[DEBUG] Extracted breakdowns from combined files (Last Week):', Object.keys(breakdownDataLastWeek))
    } else {
      // Original logic for separate breakdown files
      for (const file of breakdownLastWeek) {
        const parsed = await parseCSV(file)
        const fileName = file.name.toLowerCase()
        const fileType = fileName.startsWith('age-') || fileName.includes('-age') ? 'age' :
                        fileName.startsWith('gender-') || fileName.includes('-gender') ? 'gender' :
                        fileName.startsWith('region-') || fileName.includes('-region') ? 'region' :
                        fileName.startsWith('platform-') || fileName.includes('-platform') ? 'platform' :
                        fileName.startsWith('placement-') || fileName.includes('-placement') ? 'placement' :
                        fileName.startsWith('objective-') || fileName.includes('-objective') ? 'objective' :
                        fileName.includes('ad-creative') || fileName.includes('creative') ? 'ad-creative' : 'other'

        // console.log('[DEBUG] File:', fileName, '→ Detected as:', fileType)

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
      // Remove commas first, then remove ALL whitespace (including newlines, tabs, carriage returns)
      let str = String(val).replace(/,/g, '')
      str = str.replace(/\s+/g, '')  // KEY FIX: removes \n, \r, \t, spaces
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
      
      // Debug: Log Reach-related keys
      const reachKeys = keys.filter(k => k.toLowerCase().includes('reach'))

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
        const numericValues = values.map(v => parseNum(v)).filter(v => !isNaN(v) && v !== null && v !== undefined)
        
        if (numericValues.length > 0) {
          // Sum numeric values for sumFields
          if (shouldSumField(key)) {
            const sum = numericValues.reduce((sum, val) => sum + val, 0)
            aggregated[key] = sum
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

    // Aggregate main CSV data to get totals (including conversion values)
    const aggregatedMainThisWeek = aggregateCSVData(parsedDataThisWeek.data)
    const aggregatedMainLastWeek = aggregateCSVData(parsedDataLastWeek.data)

    // For CTWA (and most objectives), use aggregatedMain which contains total across all objectives
    // For combined files, this already has the correct totals from the summary row or aggregation
    // The objective breakdown is only used for breakdown analysis, not main metrics
    
    // Use aggregatedMain data as the primary source (this is the TOTAL across all objectives)
    let thisWeekData = aggregatedMainThisWeek
    let lastWeekData = aggregatedMainLastWeek
    
    // Only use objective[0] for CPAS where we need specific objective metrics
    if (objectiveType === 'cpas' && breakdownDataThisWeek.objective?.length > 0) {
      // For CPAS, we need the OUTCOME_SALES objective specifically
      thisWeekData = breakdownDataThisWeek.objective.find((o: any) => o.Objective === 'OUTCOME_SALES') || aggregatedMainThisWeek
      lastWeekData = breakdownDataLastWeek.objective?.find((o: any) => o.Objective === 'OUTCOME_SALES') || aggregatedMainLastWeek
    }

    // Validate data exists
    if (!thisWeekData || Object.keys(thisWeekData).length === 0) {
      console.error('[ERROR] No data found for thisWeek!')
      return NextResponse.json(
        { error: 'Could not parse data from uploaded files. Please check the CSV format.' },
        { status: 400 }
      )
    }

    // For last week, allow missing objective data (for new clients with no historical data)
    if (!lastWeekData || Object.keys(lastWeekData).length === 0) {
      console.warn('[WARN] Objective breakdown file not found for lastWeek - this is expected for new clients')
    }

    // Calculate base metrics
    const thisWeekSpend = parseNum(thisWeekData['Amount spent (IDR)'])
    const lastWeekSpend = lastWeekData ? parseNum(lastWeekData['Amount spent (IDR)']) : 0

    // Extract results based on objective type
    let thisWeekResults = 0
    let lastWeekResults = 0

    if (objectiveType === 'cpas') {
      // CRITICAL FIX: For CPAS, "Results" = Add to Cart (NOT Purchases!)
      // Report Manual uses ATC for CPR calculation: 2,130,319 / 653 = 3,262
      thisWeekResults = parseNum(thisWeekData['Adds to cart with shared items'])
      lastWeekResults = lastWeekData ? parseNum(lastWeekData['Adds to cart with shared items']) : 0
    } else if (objectiveType === 'ctlptowa') {
      // CTLP to WA: Use checkouts initiated
      thisWeekResults = parseNum(thisWeekData['Checkouts initiated'] || 0)
      lastWeekResults = lastWeekData ? parseNum(lastWeekData['Checkouts initiated'] || 0) : 0
    } else {
      // CTWA: Use messaging conversations
      thisWeekResults = parseNum(thisWeekData['Messaging conversations started'] || 0)
      lastWeekResults = lastWeekData ? parseNum(lastWeekData['Messaging conversations started'] || 0) : 0
    }

    // Calculate CPR manually (matching Report Manual approach)
    // Report Manual: spentThis / atcThis = 2,130,319 / 653 = 3,262
    // Don't use CSV field because objective.csv may have blank/undefined Cost per result
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
        // Try exact match first - BUT allow 0 and empty string as valid values
        if (data[field] !== undefined) {
          return data[field]
        }
        // Try case-insensitive exact match - BUT allow 0 and empty string as valid values
        const exactMatch = dataKeys.find(key => key.toLowerCase() === field.toLowerCase())
        if (exactMatch && data[exactMatch] !== undefined) {
          return data[exactMatch]
        }
        // Try partial match (for fields with variations) - BUT allow 0 and empty string as valid values
        const partialMatch = dataKeys.find(key => {
          const keyLower = key.toLowerCase()
          const fieldLower = field.toLowerCase()
          return keyLower.includes(fieldLower) || fieldLower.includes(keyLower)
        })
        if (partialMatch && data[partialMatch] !== undefined) {
          return data[partialMatch]
        }
      }
      // Final fallback: try direct access with original field name (for exact column names from CSV)
      if (data[fieldName] !== undefined) {
        return data[fieldName]
      }
      return undefined
    }
    
    // Build performance summary with all fields
    const buildPerformanceData = (data: any, results: number, cpr: number) => {
      // Extract base metrics
      const amountSpent = parseNum(getFieldValue(data, 'Amount spent (IDR)'))
      const impressions = parseNum(getFieldValue(data, 'Impressions'))
      const linkClicks = parseNum(getFieldValue(data, 'Link clicks', ['Link clicks', 'link clicks', 'Link Clicks']))

      const base = {
        amountSpent: amountSpent,
        impressions: impressions,
        linkClicks: linkClicks,
        ctr: (() => {
          const ctrValue = parseNum(getFieldValue(data, 'CTR (link click-through rate)'))
          // CTR in CSV is already in percentage format (e.g., 1.3 means 1.3%)
          // Return as-is to maintain consistency across all templates
          return ctrValue
        })(),
        // Calculate CPC manually if not in CSV
        cpc: (() => {
          const cpcValue = parseNum(getFieldValue(data, 'CPC (cost per link click)'))
          if (cpcValue > 0) return cpcValue
          // Calculate CPC from amount spent and link clicks
          return linkClicks > 0 ? (amountSpent / linkClicks) : 0
        })(),
        // Calculate CPM manually if not in CSV
        cpm: (() => {
          const cpmValue = parseNum(getFieldValue(data, 'CPM (cost per 1,000 impressions)'))
          if (cpmValue > 0) return cpmValue
          // Calculate CPM from amount spent and impressions
          return impressions > 0 ? ((amountSpent / impressions) * 1000) : 0
        })(),
        outboundClicks: parseNum(getFieldValue(data, 'Outbound clicks')),
        frequency: parseNum(getFieldValue(data, 'Frequency')),
        // Reach: try multiple field name variations to match Meta CSV export
        reach: parseNum(getFieldValue(data, 'Reach', ['Reach', 'reach', 'Accounts Center accounts reached'])),
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
        const actualPurchases = parseNum(data['Purchases with shared items'] || data['Purchases'] || 0)
        const cpasData = {
          ...base,
          purchases: actualPurchases,
          addsToCart: parseNum(data['Adds to cart with shared items'] || data['Adds to cart'] || 0),
          contentViews: parseNum(data['Content views with shared items'] || data['Content views'] || 0),
          atcConversionValue: parseNum(getFieldValue(data, 'Adds to cart conversion value for shared items only', [
            'ATC conversion value (shared only)',
            'ATC conversion value',
            'Adds to cart conversion value for shared items only'
          ])),
          purchasesConversionValue: parseNum(data['Purchases conversion value'] || data['Purchases conversion value for shared items only']),
          // Additional CPAS metrics from CSV
          clicksAll: parseNum(data['Clicks (all)'] || 0),
          ctrAll: parseNum(getFieldValue(data, 'CTR (all)', ['CTR (all)'])),
          costPerCV: parseNum(getFieldValue(data, 'Cost /CV (IDR)', ['Cost /CV (IDR)', 'Cost per content view'])),
          // Calculate cost per ATC manually (not in CSV)
          costPerATC: 0, // Will be calculated below
          // Calculate cost per purchase manually (not in CSV)
          costPerPurchase: 0, // Will be calculated below
          // ROAS - will be calculated below using formula: Purchases CV ÷ Amount Spent
          roas: 0,
          // AOV - will be calculated below using formula: Purchases CV ÷ Purchases
          aov: 0,
          lcToCV: parseNum(getFieldValue(data, '* LC to CV', ['* LC to CV', 'LC to CV'])),
          cvToATC: parseNum(getFieldValue(data, '* CV to ATC', ['* CV to ATC', 'CV to ATC'])),
          atcToPurchase: parseNum(getFieldValue(data, 'ATC to Purchase', ['ATC to Purchase', 'ATC to Purchase conversion rate'])),
          // Instagram metrics
          igProfileVisits: parseNum(data['Instagram profile visits'] || 0),
          igFollows: parseNum(data['Instagram follows'] || 0),
        }

        // Calculate cost metrics manually
        const addsToCart = parseNum(data['Adds to cart with shared items'] || data['Adds to cart'] || 0)
        const purchases = parseNum(data['Purchases with shared items'] || data['Purchases'] || 0)
        const amountSpent = parseNum(data['Amount spent (IDR)'] || 0)

        cpasData.costPerATC = addsToCart > 0 ? (amountSpent / addsToCart) : 0
        cpasData.costPerPurchase = purchases > 0 ? (amountSpent / purchases) : 0

        // Calculate ROAS using formula: Purchases conversion value for shared items only ÷ Amount spent
        const purchasesConvValue = parseNum(data['Purchases conversion value'] || data['Purchases conversion value for shared items only'] || 0)
        if (purchasesConvValue > 0 && amountSpent > 0) {
          cpasData.roas = purchasesConvValue / amountSpent
        } else {
          // Fallback: try to get ROAS from CSV if calculation is not possible
          const csvROAS = parseNum(getFieldValue(data, 'Results ROAS', [
            'Results ROAS',
            'Purchase ROAS for shared items only',
            'Purchase ROAS',
            'ROAS'
          ]))
          if (csvROAS > 0) {
            cpasData.roas = csvROAS
          }
        }

        // Calculate AOV using formula: Purchases conversion value for shared items only ÷ Purchases
        if (purchasesConvValue > 0 && purchases > 0) {
          cpasData.aov = purchasesConvValue / purchases
        } else {
          // Fallback: try to get AOV from CSV
          const csvAOV = parseNum(getFieldValue(data, 'AOV (IDR)', ['AOV (IDR)', 'AOV', 'Average order value']))
          if (csvAOV > 0) {
            cpasData.aov = csvAOV
          }
        }

        return cpasData
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

    // Merge objective.csv data with main CSV aggregated data
    // objective.csv has basic metrics, main CSV has conversion values
    const thisWeekDataMerged = { ...thisWeekData, ...aggregatedMainThisWeek }
    const lastWeekDataMerged = { ...lastWeekData, ...aggregatedMainLastWeek }

    const thisWeekPerf = buildPerformanceData(thisWeekDataMerged, thisWeekResults, thisWeekCPR)
    const lastWeekPerf = buildPerformanceData(lastWeekDataMerged, lastWeekResults, lastWeekCPR)

    const analysis = {
        performanceSummary: {
          thisWeek: thisWeekPerf,
          lastWeek: lastWeekPerf,
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
// ===== HELPER FUNCTIONS FOR EVENT DATA EXTRACTION =====
// Moved outside extractEventData to avoid JSON serialization issues

/**
 * Helper function to parse date - handles multiple formats
 */
function parseEventDate(dateStr: string): Date | null {
    if (!dateStr) return null
    
    // Clean the string
    const cleaned = String(dateStr).trim()
    if (!cleaned) return null
    
    // Try ISO format first (YYYY-MM-DD)
    let date = new Date(cleaned)
    if (!isNaN(date.getTime())) {
      return date
    }
    
    // Try DD/MM/YYYY or DD-MM-YYYY format
    const ddmmyyyyMatch = cleaned.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/)
    if (ddmmyyyyMatch) {
      const [, day, month, year] = ddmmyyyyMatch
      date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
      if (!isNaN(date.getTime())) {
        return date
      }
    }
    
    // Try YYYY/MM/DD or YYYY-MM-DD format
    const yyyymmddMatch = cleaned.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/)
    if (yyyymmddMatch) {
      const [, year, month, day] = yyyymmddMatch
      date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
      if (!isNaN(date.getTime())) {
        return date
      }
    }
    
    // Try MM/DD/YYYY format (US format)
    const mmddyyyyMatch = cleaned.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/)
    if (mmddyyyyMatch) {
      const [, month, day, year] = mmddyyyyMatch
      date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
      if (!isNaN(date.getTime())) {
        return date
      }
    }
    
    // Fallback to native Date parsing
    date = new Date(cleaned)
    if (!isNaN(date.getTime())) {
      return date
    }
    
    return null
}

/**
 * Helper function to check if date is within Twindate period
 * Twindate: iklan start H-4 sebelum tanggal kembar dan mati setelah twindate selesai
 * Contoh: Twindate 12.12 = iklan start 8 Desember, mati setelah 12 Desember selesai
 * Jadi periode: 8 Desember - 12 Desember (sampai akhir hari 12 Desember)
 */
function isTwindateEvent(date: Date): boolean {
  if (!date || isNaN(date.getTime())) return false

  // List semua tanggal kembar (1.1, 2.2, ..., 12.12)
  const twindateDates = [
    { month: 1, day: 1 },   // 1.1
    { month: 2, day: 2 },   // 2.2
    { month: 3, day: 3 },   // 3.3
    { month: 4, day: 4 },   // 4.4
    { month: 5, day: 5 },   // 5.5
    { month: 6, day: 6 },   // 6.6
    { month: 7, day: 7 },   // 7.7
    { month: 8, day: 8 },   // 8.8
    { month: 9, day: 9 },   // 9.9
    { month: 10, day: 10 }, // 10.10
    { month: 11, day: 11 }, // 11.11
    { month: 12, day: 12 }  // 12.12
  ]

  const checkDate = new Date(date)
  checkDate.setHours(0, 0, 0, 0) // Normalize to start of day

  // Check each twindate
  for (const twindate of twindateDates) {
    // Calculate twindate date (H)
    const twindateDate = new Date(checkDate.getFullYear(), twindate.month - 1, twindate.day)
    twindateDate.setHours(0, 0, 0, 0)

    // Start date is H-4 (4 days before twindate)
    const startDate = new Date(twindateDate)
    startDate.setDate(startDate.getDate() - 4)

    // End date is H (twindate date) sampai akhir hari (setelah twindate selesai)
    const endDate = new Date(twindateDate)
    endDate.setHours(23, 59, 59, 999) // End of twindate day

    // Check if date is within range [startDate, endDate]
    if (checkDate >= startDate && checkDate <= endDate) {
      return true
    }

    // Also check for previous year (for dates like 1.1 that might span year boundary)
    const prevYearTwindateDate = new Date(checkDate.getFullYear() - 1, twindate.month - 1, twindate.day)
    prevYearTwindateDate.setHours(0, 0, 0, 0)
    const prevYearStartDate = new Date(prevYearTwindateDate)
    prevYearStartDate.setDate(prevYearStartDate.getDate() - 4)
    const prevYearEndDate = new Date(prevYearTwindateDate)
    prevYearEndDate.setHours(23, 59, 59, 999) // End of twindate day

    if (checkDate >= prevYearStartDate && checkDate <= prevYearEndDate) {
      return true
    }
  }

  return false
}

/**
 * Helper function to check if date is Payday (tanggal 21-5: dari tanggal 21 bulan ini sampai tanggal 5 bulan berikutnya)
 * Payday: tanggal 21-31 (akhir bulan) atau tanggal 1-5 (awal bulan)
 */
function isPaydayEvent(date: Date): boolean {
  const day = date.getDate()
  // Payday: tanggal 21-31 (akhir bulan) atau tanggal 1-5 (awal bulan)
  return day >= 21 || day <= 5
}

/**
 * Helper function to aggregate data for event
 * Returns default structure with all fields set to 0 if no data
 * This ensures consistent structure for both periods
 */
function aggregateEventData(data: any[], dateColumn: string | null): any {
  // Return default structure with all fields set to 0 if no data
  if (data.length === 0) {
      return {
        amountSpent: 0,
        purchases: 0,
        addsToCart: 0,
        contentViews: 0,
        atcConversionValue: 0,
        purchasesConversionValue: 0,
        linkClicks: 0,
        impressions: 0,
        ctr: 0,
        cpc: 0,
        cpm: 0,
        frequency: 0,
        roas: 0,
        costPerPurchase: 0,
        costPerATC: 0,
        conversionRate: 0,
        avgPurchaseValue: 0
      }
    }
    
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
    // Use field names that match Meta Ads CSV export format
    const amountSpent = parseNum(aggregated['Amount spent (IDR)'] || aggregated['Amount spent'])
    const purchases = parseNum(aggregated['Purchases with shared items'] || aggregated['Purchases'])
    const addsToCart = parseNum(aggregated['Adds to cart with shared items'] || aggregated['Adds to cart'])
    const contentViews = parseNum(aggregated['Content views with shared items'] || aggregated['Content views'])
    // Meta CSV uses "Adds to cart conversion value for shared items only"
    const atcConversionValue = parseNum(aggregated['Adds to cart conversion value for shared items only'] || 
                                       aggregated['ATC conversion value (shared only)'] ||
                                       aggregated['ATC conversion value'])
    const purchasesConversionValue = parseNum(aggregated['Purchases conversion value for shared items only'] ||
                                            aggregated['Purchases conversion value'])
    const linkClicks = parseNum(aggregated['Link clicks'])
    const impressions = parseNum(aggregated['Impressions'])
    const ctr = linkClicks > 0 && impressions > 0 ? linkClicks / impressions : 0
    const cpc = linkClicks > 0 ? parseNum(aggregated['CPC (cost per link click)']) : 0
    const cpm = parseNum(aggregated['CPM (cost per 1,000 impressions)'])
    const frequency = parseNum(aggregated['Frequency'])
    const roas = amountSpent > 0 ? purchasesConversionValue / amountSpent : 0
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
      roas,
      costPerPurchase,
      costPerATC,
      conversionRate,
      avgPurchaseValue
    }
}

/**
 * Main function to extract event data from CSV
 * Uses the helper functions defined above
 */
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

  // Filter and aggregate Twindate data for this period
  // Twindate: iklan start H-4 sebelum tanggal kembar dan mati setelah twindate selesai
  // Deteksi berdasarkan tanggal yang ada di CSV, bukan berdasarkan periode report
  // Contoh: Jika file "bulan ini" berisi data 10.10 (6-10 Oktober), akan terdeteksi sebagai Twindate
  // Semua tanggal yang masuk dalam periode H-4 sampai H (tanggal kembar) akan terdeteksi
  const twindateThisData = thisWeekData.filter(row => {
    const dateStr = row[dateColumn!]
    if (!dateStr) return false
    const date = parseEventDate(dateStr)
    if (!date) return false
    return isTwindateEvent(date)
  })

  // Filter and aggregate Twindate data for last period
  // Deteksi berdasarkan tanggal yang ada di CSV, bukan berdasarkan periode report
  const twindateLastData = lastWeekData.filter(row => {
    const dateStr = row[dateColumn!]
    if (!dateStr) return false
    const date = parseEventDate(dateStr)
    if (!date) return false
    return isTwindateEvent(date)
  })

  // Filter and aggregate Payday data for this period
  // Payday: tanggal 21-31 (akhir bulan) atau tanggal 1-5 (awal bulan)
  // Note: Payday akan selalu muncul karena periode report (26-25) selalu mencakup tanggal 21-31 atau 1-5
  const paydayThisData = thisWeekData.filter(row => {
    const dateStr = row[dateColumn!]
    if (!dateStr) return false
    const date = parseEventDate(dateStr)
    if (!date) return false
    return isPaydayEvent(date)
  })

  // Filter and aggregate Payday data for last period
  const paydayLastData = lastWeekData.filter(row => {
    const dateStr = row[dateColumn!]
    if (!dateStr) return false
    const date = parseEventDate(dateStr)
    if (!date) return false
    return isPaydayEvent(date)
  })

  // Aggregate event data - always aggregate even if empty to ensure consistent structure
  // This ensures both periods have the same structure even if one has no data
  eventAnalysis.twindateThis = aggregateEventData(twindateThisData, dateColumn)
  eventAnalysis.twindateLast = aggregateEventData(twindateLastData, dateColumn)
  eventAnalysis.paydayThis = aggregateEventData(paydayThisData, dateColumn)
  eventAnalysis.paydayLast = aggregateEventData(paydayLastData, dateColumn)
  
  return eventAnalysis
}

