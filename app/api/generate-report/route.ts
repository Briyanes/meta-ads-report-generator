import { NextRequest, NextResponse } from 'next/server'
// import { generateHTMLReportWithZAI } from '@/lib/zai'
// Supabase import commented out - not needed for now
// import { supabaseAdmin } from '@/lib/supabase'

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

// Security: Validate retention and objective types
function isValidRetentionType(value: string): boolean {
  return ['wow', 'mom'].includes(value)
}

function isValidObjectiveType(value: string): boolean {
  return ['ctwa', 'cpas', 'ctlptowa'].includes(value)
}

// Security: Sanitize report name to prevent XSS
function sanitizeReportName(name: string): string {
  if (!name) return ''
  // Remove any HTML tags and special characters
  return name
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>:"/\\|?*\x00-\x1f]/g, '') // Remove invalid filename characters
    .trim()
    .slice(0, 100) // Limit length
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

    // Parse request body with error handling
    let body
    try {
      body = await request.json()
    } catch (parseError: any) {
      console.error('Error parsing request body:', parseError)
      console.error('Request headers:', Object.fromEntries(request.headers.entries()))

      // Try to get more details about the request
      try {
        const text = await request.text()
        console.error('Body length:', text.length)
        console.error('Body preview:', text.substring(0, 500))
      } catch (textError) {
        console.error('Could not read request body for debugging')
      }

      return NextResponse.json(
        {
          error: 'Invalid JSON in request body',
          details: parseError.message,
          hint: 'Please try re-uploading your CSV file'
        },
        { status: 400 }
      )
    }

    const { analysisData, reportName, retentionType = 'wow', objectiveType = 'ctwa' } = body

    if (!analysisData) {
      return NextResponse.json(
        { error: 'Analysis data is required' },
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

    // Security: Sanitize report name
    const sanitizedName = sanitizeReportName(reportName || '')
    

    // Import template based on objective type
    let generateReport: (analysisData: any, reportName?: string, retentionType?: string, objectiveType?: string) => string | Promise<string>

    // console.log('[Generate Report] Objective type:', objectiveType)
    // console.log('[Generate Report] Analysis data keys:', analysisData ? Object.keys(analysisData).slice(0, 20) : 'null')
    // console.log('[Generate Report] Report name:', reportName)
    // console.log('[Generate Report] Retention type:', retentionType)
    
    // Debug: Check ad-creative data
    if (analysisData?.breakdown?.thisWeek?.['ad-creative']) {
      const adCreative = analysisData.breakdown.thisWeek['ad-creative']
      // console.log('[Generate Report] Ad Creative data count:', adCreative.length)
      if (adCreative.length > 0) {
        // console.log('[Generate Report] First ad creative:', JSON.stringify({
          name: adCreative[0]?.Ads || adCreative[0]?.['Ad name'],
          wa: adCreative[0]?.['Messaging conversations started'],
          oc: adCreative[0]?.['Outbound clicks']
        }))
      }
    }

    try {
      if (objectiveType === 'cpas') {
        // console.log('[Generate Report] Loading CPAS template...')
        const { generateReactTailwindReport: generateCPAS } = await import('@/lib/reports/cpas/template')
        generateReport = generateCPAS
        // console.log('[Generate Report] CPAS template loaded successfully')
      } else if (objectiveType === 'ctwa') {
        // console.log('[Generate Report] Loading CTWA template...')
        const { generateReactTailwindReport: generateCTWA } = await import('@/lib/reports/ctwa/template')
        generateReport = generateCTWA
        // console.log('[Generate Report] CTWA template loaded successfully')
      } else if (objectiveType === 'ctlptowa') {
        // console.log('[Generate Report] Loading CTLPTOWA template...')
        const { generateReactTailwindReport: generateCTLP } = await import('@/lib/reports/ctlptowa/template')
        generateReport = generateCTLP
        // console.log('[Generate Report] CTLPTOWA template loaded successfully')
      } else {
        // Fallback to CTWA
        const { generateReactTailwindReport: generateCTWA } = await import('@/lib/reports/ctwa/template')
        generateReport = generateCTWA
      }
    } catch (importError) {
      // If specific template doesn't exist, use default CTWA template
      console.warn('Template import failed, using default CTWA template:', importError)
      const { generateReactTailwindReport: generateCTWA } = await import('@/lib/reports/ctwa/template')
      generateReport = generateCTWA
    }

    // Generate HTML report directly using React + Tailwind template based on objective type
    // This ensures each objective type has its own isolated template and doesn't affect others
    let htmlReport: string
    try {
      // console.log('[Generate Report] Calling generateReport function...')
      htmlReport = await generateReport(analysisData, sanitizedName, retentionType, objectiveType)
      // console.log('[Generate Report] HTML report generated, length:', htmlReport?.length)
      // console.log('[Generate Report] HTML preview (first 200 chars):', htmlReport?.substring(0, 200))

      if (!htmlReport || htmlReport.length < 100) {
        console.error('[Generate Report] HTML report too short or empty')
        throw new Error('Generated HTML report is too short or empty')
      }

      // Validate HTML structure - Templates return HTML fragments (slide-based), not full documents
      const hasValidHTML = htmlReport.includes('<div') || htmlReport.includes('<!DOCTYPE html>') || htmlReport.includes('<html')
      const hasRoot = htmlReport.includes('class="slide') || htmlReport.includes('<div id="root">')

      // console.log('[Generate Report] Validation - hasValidHTML:', hasValidHTML, 'hasRoot:', hasRoot)

      if (!hasValidHTML) {
        console.error('[Generate Report] HTML validation failed - missing valid HTML structure')
        throw new Error('Generated HTML report is missing required HTML structure')
      }

      if (!hasRoot) {
        console.error('[Generate Report] HTML validation failed - missing root element')
        throw new Error('Generated HTML report is missing root element (div id="root" or class="slide")')
      }

      // console.log('[Generate Report] HTML validation passed, returning success')

    } catch (templateError: any) {
      console.error('[Generate Report] Template generation error:', templateError)
      console.error('[Generate Report] Error stack:', templateError.stack)
      throw new Error(`Failed to generate report template: ${templateError.message}`)
    }

    // Save to Supabase (optional - commented out for now)
    // const { data, error } = await supabaseAdmin
    //   .from('reports')
    //   .insert({
    //     name: reportName || `Report ${new Date().toISOString()}`,
    //     html_content: htmlReport,
    //     analysis_data: analysisData,
    //     created_at: new Date().toISOString()
    //   })
    //   .select()
    //   .single()

    // if (error) {
    //   console.error('Supabase error:', error)
    //   // Continue even if Supabase fails
    // }

    return NextResponse.json({
      success: true,
      html: htmlReport,
      // reportId: data?.id
    })
  } catch (error: any) {
    console.error('Report generation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate report' },
      { status: 500 }
    )
  }
}
