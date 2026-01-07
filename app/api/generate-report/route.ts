import { NextRequest, NextResponse } from 'next/server'
// import { generateHTMLReportWithZAI } from '@/lib/zai'
// Supabase import commented out - not needed for now
// import { supabaseAdmin } from '@/lib/supabase'

// Security: Check origin
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(',') || [
  'http://localhost:3000',
  'http://localhost:3001',
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
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
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
    
    try {
      if (objectiveType === 'cpas') {
        const { generateReactTailwindReport: generateCPAS } = await import('@/lib/reportTemplate-cpas')
        generateReport = generateCPAS
      } else if (objectiveType === 'ctwa') {
        const { generateReactTailwindReport: generateCTWA } = await import('@/lib/reportTemplate-ctwa')
        generateReport = generateCTWA
      } else if (objectiveType === 'ctlptowa') {
        const { generateReactTailwindReport: generateCTLP } = await import('@/lib/reportTemplate-ctlptowa')
        generateReport = generateCTLP
      } else {
        // Fallback to CTWA
        const { generateReactTailwindReport: generateCTWA } = await import('@/lib/reportTemplate-ctwa')
        generateReport = generateCTWA
      }
    } catch (importError) {
      // If specific template doesn't exist, use default CTWA template
      console.warn('Template import failed, using default CTWA template:', importError)
      const { generateReactTailwindReport: generateCTWA } = await import('@/lib/reportTemplate-ctwa')
      generateReport = generateCTWA
    }

    // Generate HTML report directly using React + Tailwind template based on objective type
    // This ensures each objective type has its own isolated template and doesn't affect others
    let htmlReport: string
    try {
      htmlReport = await generateReport(analysisData, sanitizedName, retentionType, objectiveType)
      
      if (!htmlReport || htmlReport.length < 100) {
        throw new Error('Generated HTML report is too short or empty')
      }

      // Validate HTML structure - CPAS uses different format
      const hasValidHTML = htmlReport.includes('<!DOCTYPE html>') || htmlReport.includes('<html')
      const hasRoot = htmlReport.includes('<div id="root">') || htmlReport.includes('class="slide')

      if (!hasValidHTML) {
        throw new Error('Generated HTML report is missing required HTML structure')
      }

      if (!hasRoot) {
        throw new Error('Generated HTML report is missing root element (div id="root" or class="slide")')
      }
      
    } catch (templateError: any) {
      console.error('Template generation error:', templateError)
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
