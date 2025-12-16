import { NextRequest, NextResponse } from 'next/server'
// import { generateHTMLReportWithZAI } from '@/lib/zai'
// Supabase import commented out - not needed for now
// import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
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

    // Import template based on objective type
    let generateReport: (analysisData: any, reportName?: string, retentionType?: string, objectiveType?: string) => string
    
    try {
      if (objectiveType === 'ctwa') {
        const { generateReactTailwindReport: generateCTWA } = await import('@/lib/reportTemplate-ctwa')
        generateReport = generateCTWA
      } else if (objectiveType === 'cpas') {
        const { generateReactTailwindReport: generateCPAS } = await import('@/lib/reportTemplate-cpas')
        generateReport = generateCPAS
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
      console.log(`Generating HTML report for objective type: ${objectiveType}, retention: ${retentionType}`)
      console.log('Analysis data structure:', {
        hasPerformanceSummary: !!analysisData?.performanceSummary,
        hasBreakdown: !!analysisData?.breakdown,
        performanceSummaryKeys: analysisData?.performanceSummary ? Object.keys(analysisData.performanceSummary) : [],
        thisWeekData: analysisData?.performanceSummary?.thisWeek ? Object.keys(analysisData.performanceSummary.thisWeek) : [],
        lastWeekData: analysisData?.performanceSummary?.lastWeek ? Object.keys(analysisData.performanceSummary.lastWeek) : []
      })
      htmlReport = generateReport(analysisData, reportName, retentionType, objectiveType)
      console.log(`Generated HTML report length: ${htmlReport?.length || 0} characters`)
      
      if (!htmlReport || htmlReport.length < 100) {
        throw new Error('Generated HTML report is too short or empty')
      }
      
      // Validate HTML structure
      if (!htmlReport.includes('<!DOCTYPE html>') && !htmlReport.includes('<html')) {
        throw new Error('Generated HTML report is missing required HTML structure')
      }
      
      if (!htmlReport.includes('<div id="root">')) {
        throw new Error('Generated HTML report is missing root element')
      }
      
      console.log('HTML report generated successfully')
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
