import { NextRequest, NextResponse } from 'next/server'
import { generateHTMLReportWithZAI } from '@/lib/zai'
import { supabaseAdmin } from '@/lib/supabase'
import { generateReactTailwindReport } from '@/lib/reportTemplate'

export async function POST(request: NextRequest) {
  try {
    const { analysisData, reportName } = await request.json()

    if (!analysisData) {
      return NextResponse.json(
        { error: 'Analysis data is required' },
        { status: 400 }
      )
    }

    // Generate HTML report with Z AI
    let htmlReport: string
    try {
      htmlReport = await generateHTMLReportWithZAI(analysisData)
    } catch (zaiError: any) {
      // If Z AI fails, use React + Tailwind template
      console.warn('Z AI API failed, using React+Tailwind template:', zaiError.message)
      htmlReport = generateReactTailwindReport(analysisData, reportName)
    }

    // Save to Supabase
    const { data, error } = await supabaseAdmin
      .from('reports')
      .insert({
        name: reportName || `Report ${new Date().toISOString()}`,
        html_content: htmlReport,
        analysis_data: analysisData,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      // Continue even if Supabase fails
    }

    return NextResponse.json({
      success: true,
      html: htmlReport,
      reportId: data?.id
    })
  } catch (error: any) {
    console.error('Report generation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate report' },
      { status: 500 }
    )
  }
}
