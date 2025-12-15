'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { parseCSV } from '@/lib/csvParser'
import { generatePDFFromHTML, downloadPDF } from '@/lib/pdfGenerator'

export default function MetaAdsPage() {
  const router = useRouter()
  const [filesThisWeek, setFilesThisWeek] = useState<File[]>([])
  const [filesLastWeek, setFilesLastWeek] = useState<File[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false)
  const [analysis, setAnalysis] = useState<any>(null)
  const [htmlReport, setHtmlReport] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [reportName, setReportName] = useState('')
  const [generationProgress, setGenerationProgress] = useState<string>('')
  const [retentionType, setRetentionType] = useState<'wow' | 'mom'>('wow')
  const [objectiveType, setObjectiveType] = useState<'ctwa' | 'cpas' | 'ctlptowa'>('ctwa')
  const [showDocumentation, setShowDocumentation] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'thisWeek' | 'lastWeek') => {
    const selectedFiles = Array.from(e.target.files || [])
    const csvFiles = selectedFiles.filter(file => file.type === 'text/csv' || file.name.endsWith('.csv'))
    
    if (csvFiles.length > 0) {
      if (type === 'thisWeek') {
        setFilesThisWeek(prev => [...prev, ...csvFiles])
      } else {
        setFilesLastWeek(prev => [...prev, ...csvFiles])
      }
      setError(null)
    } else {
      setError('Please upload valid CSV files')
    }
  }
  
  const removeFile = (index: number, type: 'thisWeek' | 'lastWeek') => {
    if (type === 'thisWeek') {
      setFilesThisWeek(prev => prev.filter((_, i) => i !== index))
    } else {
      setFilesLastWeek(prev => prev.filter((_, i) => i !== index))
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.currentTarget.classList.add('dragover')
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.currentTarget.classList.remove('dragover')
  }

  const handleDrop = (e: React.DragEvent, type: 'thisWeek' | 'lastWeek') => {
    e.preventDefault()
    e.currentTarget.classList.remove('dragover')
    
    const droppedFiles = Array.from(e.dataTransfer.files)
    const csvFiles = droppedFiles.filter(file => file.type === 'text/csv' || file.name.endsWith('.csv'))
    
    if (csvFiles.length > 0) {
      if (type === 'thisWeek') {
        setFilesThisWeek(prev => [...prev, ...csvFiles])
      } else {
        setFilesLastWeek(prev => [...prev, ...csvFiles])
      }
      setError(null)
    }
  }

  const handleAnalyze = async () => {
    if (filesThisWeek.length === 0 || filesLastWeek.length === 0) {
      setError('Please upload files for both periods')
      return
    }

    setIsAnalyzing(true)
    setError(null)

    try {
      const formData = new FormData()
      
      // Add this week files
      filesThisWeek.forEach(file => {
        formData.append('thisWeek', file)
      })
      
      // Add last week files
      filesLastWeek.forEach(file => {
        formData.append('lastWeek', file)
      })

      formData.append('retentionType', retentionType)
      formData.append('objectiveType', objectiveType)

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Analysis failed')
      }

      const data = await response.json()
      setAnalysis(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleGenerateReport = async () => {
    if (!analysis) {
      setError('Please analyze data first')
      return
    }

    setIsGenerating(true)
    setError(null)
    setGenerationProgress('Generating report...')

    try {
      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          analysisData: analysis,
          reportName: reportName || undefined,
          retentionType,
          objectiveType
        })
      })

      const contentType = response.headers.get('content-type')
      
      if (!contentType?.includes('application/json')) {
        const text = await response.text()
        throw new Error(`Expected JSON, got: ${text.substring(0, 100)}`)
      }

      const data = await response.json()
      
      if (data.html) {
        setHtmlReport(data.html)
        setGenerationProgress('Report generated successfully!')
      } else {
        throw new Error('No HTML report received')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Report generation failed')
      setGenerationProgress('')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownloadPDF = async () => {
    if (!htmlReport) {
      setError('Please generate report first')
      return
    }

    setIsDownloadingPDF(true)
    try {
      // Use window.print() for better reliability
      const iframe = document.querySelector('iframe[title="Report Preview"]') as HTMLIFrameElement
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.print()
      } else {
        // Fallback to html2canvas method
        const blob = await generatePDFFromHTML(htmlReport, 'meta-ads-report.pdf')
        downloadPDF(blob, reportName || 'Meta Ads Report')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'PDF download failed')
    } finally {
      setIsDownloadingPDF(false)
    }
  }

  const handleNewAnalysis = () => {
    // Reset all state
    setFilesThisWeek([])
    setFilesLastWeek([])
    setAnalysis(null)
    setHtmlReport(null)
    setError(null)
    setReportName('')
    setGenerationProgress('')
    setShowDocumentation(false)
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const getExportRequirements = () => {
    const requirements: Record<string, any> = {
      ctwa: {
        main: ['Amount spent', 'Messaging conversations started', 'Outbound clicks', 'Impressions', 'CTR (link click-through rate)', 'Cost per messaging conversation started'],
        breakdown: ['Age', 'Gender', 'Region', 'Platform', 'Placement', 'Campaign objective', 'Ad creative/Ad name']
      },
      cpas: {
        main: ['Amount spent', 'Purchases', 'Purchases with shared items', 'Cost per purchase', 'Link clicks', 'CTR (all)', 'Purchases conversion value'],
        breakdown: ['Age', 'Gender', 'Region', 'Platform', 'Placement', 'Campaign objective', 'Ad creative/Ad name']
      },
      ctlptowa: {
        main: ['Amount spent', 'Checkouts initiated', 'Landing page views', 'Clicks (all)', 'CTR (all)', 'Cost per checkout initiated', 'Outbound clicks'],
        breakdown: ['Age', 'Gender', 'Region', 'Platform', 'Placement', 'Campaign objective', 'Ad creative/Ad name']
      }
    }
    return requirements[objectiveType] || requirements.ctwa
  }

  const requirements = getExportRequirements()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/home')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← Back to Home
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Meta Ads Report Generator</h1>
                <p className="text-xs text-gray-500">Powered by Z AI GLM 4.6</p>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full font-medium">
                AI-Powered
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Report Configuration */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nama Report (Opsional)
              </label>
              <input
                type="text"
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
                placeholder="Weekly Report - Week 1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Pemilihan Retensi
              </label>
              <select
                value={retentionType}
                onChange={(e) => setRetentionType(e.target.value as 'wow' | 'mom')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="wow">WoW (Week-on-Week)</option>
                <option value="mom">MoM (Month-on-Month)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Pemilihan Iklan Objective
              </label>
              <select
                value={objectiveType}
                onChange={(e) => setObjectiveType(e.target.value as 'ctwa' | 'cpas' | 'ctlptowa')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ctwa">CTWA</option>
                <option value="cpas">CPAS</option>
                <option value="ctlptowa">CTLP to WA</option>
              </select>
            </div>
          </div>
        </div>

        {/* Documentation Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">📋 Export Requirements & Documentation</h2>
            <button
              onClick={() => setShowDocumentation(!showDocumentation)}
              className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-semibold"
            >
              {showDocumentation ? 'Hide' : 'Show'} Documentation
            </button>
          </div>

          {showDocumentation && (
            <div className="mt-4 space-y-4">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <h3 className="font-semibold text-gray-900 mb-2">Required Exports from Meta Ads Manager:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-sm text-gray-700 mb-2">Main Export File:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {requirements.main.map((metric: string, idx: number) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          <span>{metric}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-700 mb-2">Breakdown Export Files:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {requirements.breakdown.map((breakdown: string, idx: number) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          <span>{breakdown}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                <h3 className="font-semibold text-gray-900 mb-2">💡 Tips:</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Export data untuk kedua periode (This Week/This Month dan Last Week/Last Month)</li>
                  <li>• Pastikan semua kolom metrik yang diperlukan ada di export</li>
                  <li>• File breakdown harus sesuai dengan dimensi yang dipilih (age, gender, region, dll)</li>
                  <li>• Format file harus CSV (Comma Separated Values)</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* File Upload Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Upload CSV Files untuk {retentionType === 'wow' ? 'Week-on-Week' : 'Month-on-Month'} Analysis
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Upload file utama + file breakdown (age, gender, region, platform, placement, objective, ad-creative)
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* This Week/Month */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📅 {retentionType === 'wow' ? 'Minggu Ini (This Week)' : 'Bulan Ini (This Month)'} - {filesThisWeek.length} file(s)
              </label>
              <label
                htmlFor="fileInputThisWeek"
                className="block border-2 border-dashed border-blue-400 rounded-lg p-8 text-center cursor-pointer hover:bg-blue-50 transition-colors"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, 'thisWeek')}
              >
                <input
                  id="fileInputThisWeek"
                  type="file"
                  accept=".csv,text/csv"
                  multiple
                  onChange={(e) => handleFileChange(e, 'thisWeek')}
                  className="hidden"
                />
                <div className="space-y-2">
                  <p className="text-gray-700 font-medium">📄 Drag & Drop atau click untuk upload</p>
                  <p className="text-sm text-gray-500">CSV files (bisa multiple)</p>
                </div>
                {filesThisWeek.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {filesThisWeek.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span className="text-sm text-gray-700">✓ {file.name}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            removeFile(index, 'thisWeek')
                          }}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </label>
            </div>

            {/* Last Week/Month */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📅 {retentionType === 'wow' ? 'Minggu Lalu (Last Week)' : 'Bulan Lalu (Last Month)'} - {filesLastWeek.length} file(s)
              </label>
              <label
                htmlFor="fileInputLastWeek"
                className="block border-2 border-dashed border-blue-400 rounded-lg p-8 text-center cursor-pointer hover:bg-blue-50 transition-colors"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, 'lastWeek')}
              >
                <input
                  id="fileInputLastWeek"
                  type="file"
                  accept=".csv,text/csv"
                  multiple
                  onChange={(e) => handleFileChange(e, 'lastWeek')}
                  className="hidden"
                />
                <div className="space-y-2">
                  <p className="text-gray-700 font-medium">📄 Drag & Drop atau click untuk upload</p>
                  <p className="text-sm text-gray-500">CSV files (bisa multiple)</p>
                </div>
                {filesLastWeek.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {filesLastWeek.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span className="text-sm text-gray-700">✓ {file.name}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            removeFile(index, 'lastWeek')
                          }}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || filesThisWeek.length === 0 || filesLastWeek.length === 0}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isAnalyzing ? 'Analyzing...' : '1. Analyze CSV'}
          </button>

          {analysis && (
            <button
              onClick={handleGenerateReport}
              disabled={isGenerating}
              className="px-6 py-3 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isGenerating ? 'Generating...' : '2. Generate HTML Report'}
            </button>
          )}

          {htmlReport && (
            <button
              onClick={handleDownloadPDF}
              disabled={isDownloadingPDF}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isDownloadingPDF ? 'Downloading...' : '📥 Download PDF'}
            </button>
          )}

          {htmlReport && (
            <button
              onClick={handleNewAnalysis}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              🔄 Analisa Data Baru
            </button>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Analysis Results */}
        {analysis && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded mb-6">
            <p className="text-green-700 font-semibold">✓ Analysis Complete!</p>
            <div className="mt-2 text-sm text-green-600">
              <p>This Period: {analysis.thisPeriod?.rows || 0} rows</p>
              <p>Last Period: {analysis.lastPeriod?.rows || 0} rows</p>
            </div>
          </div>
        )}

        {/* Report Preview */}
        {htmlReport && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Preview Report</h2>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <iframe
                srcDoc={htmlReport}
                className="w-full h-[600px] border-0"
                title="Report Preview"
              />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

