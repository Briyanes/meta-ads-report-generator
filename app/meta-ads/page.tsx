'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
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
  const [objectiveType, setObjectiveType] = useState<'ctwa' | 'cpas' | 'ctlptowa' | 'ctlptopurchase'>('ctwa')
  const [showMetrics, setShowMetrics] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsScrolled(scrollPosition > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // NEW: Memoized scroll handler to prevent memory leak (BUG #7 FIX)
  const memoizedHandleScroll = useCallback(() => {
    const scrollPosition = window.scrollY
    setIsScrolled(scrollPosition > 10)
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'thisWeek' | 'lastWeek') => {
    const selectedFiles = Array.from(e.target.files || [])
    // More robust CSV detection - check MIME type or file extension
    const csvFiles = selectedFiles.filter(file => {
      const fileName = file.name.toLowerCase()
      const fileType = file.type.toLowerCase()
      return fileType === 'text/csv' || 
             fileType === 'application/csv' ||
             fileType === 'text/comma-separated-values' ||
             fileType === 'application/vnd.ms-excel' ||
             fileName.endsWith('.csv')
    })
    
    if (csvFiles.length > 0) {
      if (type === 'thisWeek') {
        setFilesThisWeek(prev => [...prev, ...csvFiles])
      } else {
        setFilesLastWeek(prev => [...prev, ...csvFiles])
      }
      setError(null)
      // Reset input to allow selecting the same file again
      e.target.value = ''
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
    e.stopPropagation()
    e.currentTarget.classList.remove('dragover')
    
    const droppedFiles = Array.from(e.dataTransfer.files)
    // More robust CSV detection - check MIME type or file extension
    const csvFiles = droppedFiles.filter(file => {
      const fileName = file.name.toLowerCase()
      const fileType = file.type.toLowerCase()
      return fileType === 'text/csv' || 
             fileType === 'application/csv' ||
             fileType === 'text/comma-separated-values' ||
             fileType === 'application/vnd.ms-excel' ||
             fileName.endsWith('.csv')
    })
    
    if (csvFiles.length > 0) {
      if (type === 'thisWeek') {
        setFilesThisWeek(prev => [...prev, ...csvFiles])
      } else {
        setFilesLastWeek(prev => [...prev, ...csvFiles])
      }
      setError(null)
    } else {
      setError('Please drop valid CSV files')
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
      
      // Check if we have combined files (new format from rmoda workshop)
      const combinedPatterns = ['age-gender', 'platform-placement', 'campaign-name-ad-creative']
      const isCombinedFile = (fileName: string) => {
        const nameLower = fileName.toLowerCase()
        return combinedPatterns.some(pattern => nameLower.includes(pattern))
      }
      
      const hasCombinedFilesThisWeek = filesThisWeek.some(f => isCombinedFile(f.name))
      const hasCombinedFilesLastWeek = filesLastWeek.some(f => isCombinedFile(f.name))
      
      // Find main CSV files (files without breakdown keywords)
      // Main file is typically the one without breakdown dimension keywords
      const breakdownKeywords = ['-age', '-gender', '-region', '-platform', '-placement', '-objective', '-ad-creative', '-creative', '-adcreative']
      
      let finalMainThisWeek: File | null = null
      let finalMainLastWeek: File | null = null
      
      if (hasCombinedFilesThisWeek) {
        // For combined format, use the first combined file as main (will be processed specially in API)
        finalMainThisWeek = filesThisWeek.find(f => isCombinedFile(f.name)) || filesThisWeek[0]
      } else {
        const mainThisWeek = filesThisWeek.find(file => {
          const name = file.name.toLowerCase()
          const hasBreakdownKeyword = breakdownKeywords.some(keyword => name.includes(keyword))
          return !hasBreakdownKeyword
        })
        
        // If no main file found, try to find the largest file or file with most common name pattern
        const findMainFileFallback = (files: File[]) => {
          if (files.length === 0) return null
          const mainPatterns = ['main', 'data', 'report', 'summary']
          for (const pattern of mainPatterns) {
            const found = files.find(f => f.name.toLowerCase().includes(pattern))
            if (found) return found
          }
          return files.reduce((prev, current) => 
            current.name.length > prev.name.length ? current : prev
          )
        }
        
        finalMainThisWeek = mainThisWeek || findMainFileFallback(filesThisWeek)
      }
      
      if (hasCombinedFilesLastWeek) {
        // For combined format, use the first combined file as main (will be processed specially in API)
        finalMainLastWeek = filesLastWeek.find(f => isCombinedFile(f.name)) || filesLastWeek[0]
      } else {
        const mainLastWeek = filesLastWeek.find(file => {
          const name = file.name.toLowerCase()
          const hasBreakdownKeyword = breakdownKeywords.some(keyword => name.includes(keyword))
          return !hasBreakdownKeyword
        })
        
        const findMainFileFallback = (files: File[]) => {
          if (files.length === 0) return null
          const mainPatterns = ['main', 'data', 'report', 'summary']
          for (const pattern of mainPatterns) {
            const found = files.find(f => f.name.toLowerCase().includes(pattern))
            if (found) return found
          }
          return files.reduce((prev, current) => 
            current.name.length > prev.name.length ? current : prev
          )
        }
        
        finalMainLastWeek = mainLastWeek || findMainFileFallback(filesLastWeek)
      }

      if (!finalMainThisWeek || !finalMainLastWeek) {
        setError('Please upload CSV files for both periods')
        setIsAnalyzing(false)
        return
      }

      // Debug: Log detected files
      console.log('[DEBUG] Main file this week:', finalMainThisWeek.name)
      console.log('[DEBUG] Main file last week:', finalMainLastWeek.name)
      console.log('[DEBUG] Combined format detected - This Week:', hasCombinedFilesThisWeek, 'Last Week:', hasCombinedFilesLastWeek)

      // Add main CSV files
      formData.append('fileThisWeek', finalMainThisWeek)
      formData.append('fileLastWeek', finalMainLastWeek)
      
      // Add breakdown files for this week (all files except main)
      filesThisWeek.forEach((file, index) => {
        if (file !== finalMainThisWeek) {
          formData.append(`breakdownThisWeek_${index}`, file)
        }
      })
      
      // Add breakdown files for last week (all files except main)
      filesLastWeek.forEach((file, index) => {
        if (file !== finalMainLastWeek) {
          formData.append(`breakdownLastWeek_${index}`, file)
        }
      })

      formData.append('retentionType', retentionType)
      formData.append('objectiveType', objectiveType)

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Analysis failed' }))
        throw new Error(errorData.error || errorData.message || `Analysis failed: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      
      // Validate response structure
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response from server')
      }
      
      // Ensure summary structure exists
      if (!data.summary) {
        data.summary = {
          thisWeek: { totalRows: 0, rows: 0, breakdownFiles: 0, breakdownRows: 0, breakdownTypes: [] },
          lastWeek: { totalRows: 0, rows: 0, breakdownFiles: 0, breakdownRows: 0, breakdownTypes: [] }
        }
      }
      
      setAnalysis(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed')
    } finally {
      setIsAnalyzing(false)
    }
  }

  /**
   * Sanitize analysis data to remove non-serializable values
   * Removes functions, undefined values, and circular references
   */
  const sanitizeAnalysisData = (data: any): any => {
    if (data === null || data === undefined) {
      return null
    }

    // Skip functions
    if (typeof data === 'function') {
      return null
    }

    // Primitive types
    if (typeof data !== 'object') {
      return data
    }

    // Arrays
    if (Array.isArray(data)) {
      return data.map(sanitizeAnalysisData).filter(item => item !== null)
    }

    // Objects - recursively sanitize each property
    const cleaned: any = {}

    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const value = data[key]

        // Skip functions and undefined
        if (typeof value === 'function' || value === undefined) {
          continue
        }

        // Serialize primitive values directly
        if (typeof value !== 'object' || value === null) {
          cleaned[key] = value
        } else {
          // Recursively sanitize objects
          cleaned[key] = sanitizeAnalysisData(value)
        }
      }
    }

    return cleaned
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
      // Extract analysis data - handle both structures: {analysis: {...}} or direct analysis object
      const rawData = (analysis.analysis && typeof analysis.analysis === 'object')
        ? analysis.analysis
        : (analysis.analysis && typeof analysis.analysis === 'string')
        ? JSON.parse(analysis.analysis)
        : analysis

      // Sanitize data to remove non-serializable values (functions, undefined, circular refs)
      const analysisData = sanitizeAnalysisData(rawData)

      // Prepare request body with error handling
      let requestBody
      try {
        requestBody = JSON.stringify({
          analysisData: analysisData,
          reportName: reportName || undefined,
          retentionType: retentionType || analysis.analysis?.retentionType || analysis.retentionType || 'wow',
          objectiveType: objectiveType || analysis.analysis?.objectiveType || analysis.objectiveType || 'cpas'
        })
      } catch (stringifyError: any) {
        console.error('Failed to stringify request body:', stringifyError)
        setError(`Data serialization error: ${stringifyError.message}. Please try re-uploading your CSV.`)
        setGenerationProgress('')
        setIsGenerating(false)
        return
      }

      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: requestBody
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

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const getExportRequirements = () => {
    const requirements: Record<string, any> = {
      ctwa: {
        main: [
          'Amount spent (IDR)',
          'Messaging conversations started',
          'Link clicks',
          'CPC (cost per link click)',
          'CTR (link click-through rate)',
          'Outbound clicks',
          'Impressions',
          'CPM (cost per 1,000 impressions)',
          'Reach',
          'Cost per 1,000 Accounts Center accounts reached',
          'Frequency',
          'Clicks (all)',
          'CTR (all)',
          'CPC (all)',
          'Instagram follows'
        ],
        breakdown: {
          'Age (age.csv)': [
            'Age',
            'Impressions',
            'CTR (link click-through rate)',
            'Outbound clicks',
            'Messaging conversations started',
            'Amount spent (IDR)'
          ],
          'Gender (gender.csv)': [
            'Gender',
            'Impressions',
            'CTR (link click-through rate)',
            'Outbound clicks',
            'Messaging conversations started',
            'Amount spent (IDR)'
          ],
          'Region (region.csv)': [
            'Region',
            'Impressions',
            'CTR (link click-through rate)',
            'Outbound clicks',
            'Messaging conversations started',
            'Amount spent (IDR)'
          ],
          'Platform (platform.csv)': [
            'Platform',
            'Impressions',
            'CTR (link click-through rate)',
            'Outbound clicks',
            'Messaging conversations started',
            'Amount spent (IDR)'
          ],
          'Placement (placement.csv)': [
            'Placement',
            'Impressions',
            'CTR (link click-through rate)',
            'Outbound clicks',
            'Messaging conversations started',
            'Amount spent (IDR)'
          ],
          'Campaign objective (objective.csv)': [
            'Campaign objective',
            'Impressions',
            'CTR (link click-through rate)',
            'Outbound clicks',
            'Messaging conversations started',
            'Amount spent (IDR)'
          ],
          'Ad creative/Ad name (ad-creative.csv)': [
            'Ad creative/Ad name',
            'Impressions',
            'CTR (link click-through rate)',
            'Messaging conversations started',
            'Amount spent (IDR)'
          ]
        }
      },
      cpas: {
        main: [
          'Amount spent (IDR)',
          'Purchases with shared items',
          'Cost /Purchase (IDR)',
          'Purchase ROAS for shared items only',
          'Purchases conversion value for shared items only',
          'Adds to cart with shared items',
          'Cost /ATC (IDR)',
          'Content views with shared items',
          'Cost /CV (IDR)',
          '* LC to CV',
          'VC to ATC',
          'ATC → Purchases',
          'Link clicks',
          'CPC (cost per link click)',
          'CTR (link click-through rate)',
          'Outbound clicks',
          'Impressions',
          'CPM (cost per 1,000 impressions)',
          'Reach',
          'Cost per 1,000 Accounts Center accounts reached',
          'Frequency',
          'Clicks (all)',
          'CTR (all)',
          'CPC (all)',
          'AOV (IDR)',
          'Instagram profile visits',
          'Instagram follows',
          '* COST /Follow (IDR)'
        ],
        breakdown: {
          'Age (age.csv)': [
            'Age',
            'Impressions',
            'Outbound clicks',
            'CTR (link click-through rate)',
            'Content views with shared items',
            'Adds to cart with shared items',
            'Adds to cart conversion value for shared items only',
            'Purchases with shared items',
            'Cost /Purchase (IDR)',
            'Purchase ROAS for shared items only',
            'Purchases conversion value for shared items only',
            'AOV (IDR)',
            'Instagram profile visits',
            'Instagram follows',
            '* COST /Follow (IDR)',
            'Amount spent (IDR)'
          ],
          'Gender (gender.csv)': [
            'Gender',
            'Impressions',
            'Outbound clicks',
            'CTR (link click-through rate)',
            'Content views with shared items',
            'Adds to cart with shared items',
            'Adds to cart conversion value for shared items only',
            'Purchases with shared items',
            'Cost /Purchase (IDR)',
            'Purchase ROAS for shared items only',
            'Purchases conversion value for shared items only',
            'AOV (IDR)',
            'Instagram profile visits',
            'Instagram follows',
            '* COST /Follow (IDR)',
            'Amount spent (IDR)'
          ],
          'Region (region.csv)': [
            'Region',
            'Impressions',
            'Outbound clicks',
            'CTR (link click-through rate)',
            'Content views with shared items',
            'Adds to cart with shared items',
            'Adds to cart conversion value for shared items only',
            'Purchases with shared items',
            'Cost /Purchase (IDR)',
            'Purchase ROAS for shared items only',
            'Purchases conversion value for shared items only',
            'AOV (IDR)',
            'Instagram profile visits',
            'Instagram follows',
            '* COST /Follow (IDR)',
            'Amount spent (IDR)'
          ],
          'Platform (platform.csv)': [
            'Platform',
            'Impressions',
            'Outbound clicks',
            'CTR (link click-through rate)',
            'Content views with shared items',
            'Adds to cart with shared items',
            'Adds to cart conversion value for shared items only',
            'Purchases with shared items',
            'Cost /Purchase (IDR)',
            'Purchase ROAS for shared items only',
            'Purchases conversion value for shared items only',
            'AOV (IDR)',
            'Instagram profile visits',
            'Instagram follows',
            '* COST /Follow (IDR)',
            'Amount spent (IDR)'
          ],
          'Placement (placement.csv)': [
            'Placement',
            'Impressions',
            'Outbound clicks',
            'CTR (link click-through rate)',
            'Content views with shared items',
            'Adds to cart with shared items',
            'Adds to cart conversion value for shared items only',
            'Purchases with shared items',
            'Cost /Purchase (IDR)',
            'Purchase ROAS for shared items only',
            'Purchases conversion value for shared items only',
            'AOV (IDR)',
            'Instagram profile visits',
            'Instagram follows',
            '* COST /Follow (IDR)',
            'Amount spent (IDR)'
          ],
          'Campaign objective (objective.csv)': [
            'Campaign objective',
            'Impressions',
            'Outbound clicks',
            'CTR (link click-through rate)',
            'Content views with shared items',
            'Adds to cart with shared items',
            'Adds to cart conversion value for shared items only',
            'Purchases with shared items',
            'Cost /Purchase (IDR)',
            'Purchase ROAS for shared items only',
            'Purchases conversion value for shared items only',
            'AOV (IDR)',
            'Instagram profile visits',
            'Instagram follows',
            '* COST /Follow (IDR)',
            'Amount spent (IDR)'
          ],
          'Ad creative/Ad name (ad-creative.csv)': [
            'Ad creative/Ad name',
            'Impressions',
            'Outbound clicks',
            'CTR (link click-through rate)',
            'Content views with shared items',
            'Adds to cart with shared items',
            'Adds to cart conversion value for shared items only',
            'Purchases with shared items',
            'Cost /Purchase (IDR)',
            'Purchase ROAS for shared items only',
            'Purchases conversion value for shared items only',
            'AOV (IDR)',
            'Instagram profile visits',
            'Instagram follows',
            '* COST /Follow (IDR)',
            'Amount spent (IDR)'
          ]
        }
      },
      ctlptowa: {
        main: [
          'Amount spent (IDR)',
          'Website landing page views',
          'Cost per landing page view',
          'Checkouts initiated',
          'Cost per checkout initiated',
          'Link clicks',
          'CPC (cost per link click)',
          'CTR (link click-through rate)',
          'Outbound clicks',
          '* OC to LPV',
          '* LC to LPV',
          '* LPV to IC',
          'Content views',
          'Impressions',
          'CPM (cost per 1,000 impressions)',
          'Reach',
          'Cost per 1,000 Accounts Center accounts reached',
          'Frequency',
          'Clicks (all)',
          'CTR (all)',
          'CPC (all)',
          'Instagram profile visits',
          'Instagram follows',
          '* COST / Follow (IDR)'
        ],
        breakdown: {
          'Age (age.csv)': [
            'Age',
            'Impressions',
            'Outbound clicks',
            'CTR (link click-through rate)',
            'Website landing page views',
            'Checkouts initiated',
            'Cost per checkout initiated',
            'Instagram profile visits',
            'Instagram follows',
            'Amount spent (IDR)'
          ],
          'Gender (gender.csv)': [
            'Gender',
            'Impressions',
            'Outbound clicks',
            'CTR (link click-through rate)',
            'Website landing page views',
            'Checkouts initiated',
            'Cost per checkout initiated',
            'Instagram profile visits',
            'Instagram follows',
            'Amount spent (IDR)'
          ],
          'Region (region.csv)': [
            'Region',
            'Impressions',
            'Outbound clicks',
            'CTR (link click-through rate)',
            'Website landing page views',
            'Checkouts initiated',
            'Cost per checkout initiated',
            'Instagram profile visits',
            'Instagram follows',
            'Amount spent (IDR)'
          ],
          'Platform (platform.csv)': [
            'Platform',
            'Impressions',
            'Outbound clicks',
            'CTR (link click-through rate)',
            'Website landing page views',
            'Checkouts initiated',
            'Cost per checkout initiated',
            'Instagram profile visits',
            'Instagram follows',
            'Amount spent (IDR)'
          ],
          'Placement (placement.csv)': [
            'Placement',
            'Impressions',
            'Outbound clicks',
            'CTR (link click-through rate)',
            'Website landing page views',
            'Checkouts initiated',
            'Cost per checkout initiated',
            'Instagram profile visits',
            'Instagram follows',
            'Amount spent (IDR)'
          ],
          'Campaign objective (objective.csv)': [
            'Campaign objective',
            'Impressions',
            'Outbound clicks',
            'CTR (link click-through rate)',
            'Website landing page views',
            'Checkouts initiated',
            'Cost per checkout initiated',
            'Instagram profile visits',
            'Instagram follows',
            'Amount spent (IDR)'
          ],
          'Ad creative/Ad name (ad-creative.csv)': [
            'Ad creative/Ad name',
            'Impressions',
            'Outbound clicks',
            'CTR (link click-through rate)',
            'Website landing page views',
            'Checkouts initiated',
            'Cost per checkout initiated',
            'Instagram profile visits',
            'Instagram follows',
            'Amount spent (IDR)'
          ]
        }
      }
    }
    return requirements[objectiveType] || requirements.ctwa
  }

  const requirements = getExportRequirements()

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #f9fafb, #ffffff, #f3f4f6)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <header className="floating-header" style={{
        backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        boxShadow: isScrolled
          ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
          : '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        borderBottom: '1px solid #e5e7eb',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        zIndex: 1000,
        transition: 'all 0.3s ease'
      }}>
        <div className="responsive-header" style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '24px 48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Link href="/home" style={{ textDecoration: 'none', cursor: 'pointer' }}>
            <div>
              <h1 className="responsive-header-title" style={{
                fontSize: '26px',
                fontWeight: '700',
                color: '#111827',
                margin: 0,
                marginBottom: '6px',
                lineHeight: '1.3',
                letterSpacing: '-0.01em'
              }}>
                Meta Ads Report Generator
              </h1>
              <p className="responsive-header-subtitle" style={{
                fontSize: '13px',
                color: '#6b7280',
                margin: 0,
                lineHeight: '1.5',
                fontWeight: '400'
              }}>
                Powered by <span style={{ fontWeight: '600' }}>Hadona Digital Media</span>
                <span style={{ margin: '0 8px', color: '#d1d5db' }}>•</span>
                <span style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  color: '#059669',
                  backgroundColor: '#d1fae5',
                  padding: '2px 8px',
                  borderRadius: '4px'
                }}>
                  v2.0.0
                </span>
              </p>
            </div>
          </Link>
          <div className="responsive-header-logo-container" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <a
              href="https://hadona.id"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'opacity 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.8'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1'
              }}
            >
              <Image
                src="/logo/logo-hadona.png"
                alt="Hadona Digital Media"
                className="responsive-header-logo"
                width={200}
                height={80}
                style={{
                  height: '80px',
                  width: 'auto',
                  objectFit: 'contain'
                }}
              />
            </a>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="header-spacer" style={{ height: '120px' }}></div>

      {/* Back to Home Button - Fixed Position */}
      <button
        className="back-to-home-fixed"
        onClick={() => router.push('/home')}
        style={{
          position: 'fixed',
          top: '120px',
          left: '24px',
          zIndex: 999,
          color: '#000000',
          background: '#ECDC43',
          border: 'none',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '600',
          padding: '10px 20px',
          borderRadius: '8px',
          transition: 'all 0.2s ease',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          boxShadow: '0 4px 6px -1px rgba(236, 220, 67, 0.3)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#d4c539'
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = '0 6px 8px -1px rgba(236, 220, 67, 0.4)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#ECDC43'
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(236, 220, 67, 0.3)'
        }}
      >
        <i className="bi bi-arrow-left"></i>
        <span className="back-to-home-text">Back to Home</span>
      </button>

      <main className="responsive-container" style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '48px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        {/* Back to Home Button - Mobile Position (above hero) */}
        <div className="back-to-home-mobile-container" style={{ display: 'none' }}>
          <button
            className="back-to-home-mobile"
            onClick={() => router.push('/home')}
            style={{
              color: '#000000',
              background: '#ECDC43',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              padding: '10px 20px',
              borderRadius: '8px',
              transition: 'all 0.2s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 6px -1px rgba(236, 220, 67, 0.3)',
              marginBottom: '16px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#d4c539'
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 6px 8px -1px rgba(236, 220, 67, 0.4)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ECDC43'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(236, 220, 67, 0.3)'
            }}
          >
            <i className="bi bi-arrow-left"></i>
            <span className="back-to-home-text">Back to Home</span>
          </button>
        </div>
        
        {/* Report Configuration */}
        <div className="responsive-card" style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          padding: '24px',
          marginBottom: '24px'
        }}>
          <div className="responsive-grid-3" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px',
            marginBottom: '16px'
          }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px',
                letterSpacing: '0.01em'
              }}>
                Nama Report (Opsional)
              </label>
              <input
                type="text"
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
                placeholder="Weekly Report - Week 1"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1.5px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  backgroundColor: '#ffffff',
                  lineHeight: '1.5'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#2B46BB'
                  e.currentTarget.style.boxShadow = '0 0 0 4px rgba(43, 70, 187, 0.1)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e5e7eb'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
            </div>
            <div>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px',
                letterSpacing: '0.01em'
              }}>
                Pemilihan Retensi
              </label>
              <select
                value={retentionType}
                onChange={(e) => setRetentionType(e.target.value as 'wow' | 'mom')}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  paddingRight: '36px',
                  border: '1.5px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  backgroundColor: '#ffffff',
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  appearance: 'none',
                  lineHeight: '1.5',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23374151' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 12px center',
                  backgroundSize: '12px'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#2B46BB'
                  e.currentTarget.style.boxShadow = '0 0 0 4px rgba(43, 70, 187, 0.1)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e5e7eb'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <option value="wow">WoW (Week-on-Week)</option>
                <option value="mom">MoM (Month-on-Month)</option>
              </select>
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px',
                letterSpacing: '0.01em'
              }}>
                Pemilihan Iklan Objective
              </label>
              <div className="objective-cards-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '12px'
              }}>
                {/* CTWA Card */}
                <div
                  onClick={() => setObjectiveType('ctwa')}
                  style={{
                    padding: '16px',
                    border: `2px solid ${objectiveType === 'ctwa' ? '#2B46BB' : '#e5e7eb'}`,
                    borderRadius: '12px',
                    backgroundColor: objectiveType === 'ctwa' ? '#eff6ff' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    if (objectiveType !== 'ctwa') {
                      e.currentTarget.style.borderColor = '#2B46BB'
                      e.currentTarget.style.backgroundColor = '#f9fafb'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (objectiveType !== 'ctwa') {
                      e.currentTarget.style.borderColor = '#e5e7eb'
                      e.currentTarget.style.backgroundColor = '#ffffff'
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = 'none'
                    }
                  }}
                >
                  {objectiveType === 'ctwa' && (
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      backgroundColor: '#2B46BB',
                      color: '#ffffff',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px'
                    }}>
                      <i className="bi bi-check-lg"></i>
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div style={{
                      backgroundColor: objectiveType === 'ctwa' ? '#2B46BB' : '#dbeafe',
                      borderRadius: '8px',
                      padding: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <i className="bi bi-megaphone" style={{
                        fontSize: '18px',
                        color: objectiveType === 'ctwa' ? '#ffffff' : '#2B46BB'
                      }}></i>
                    </div>
                    <div>
                      <p style={{
                        fontSize: '15px',
                        fontWeight: '700',
                        color: '#111827',
                        margin: 0,
                        lineHeight: '1.3',
                        letterSpacing: '0.01em'
                      }}>
                        CTWA
                      </p>
                      <p style={{
                        fontSize: '12px',
                        color: '#6b7280',
                        margin: '3px 0 0 0',
                        lineHeight: '1.4',
                        fontWeight: '500'
                      }}>
                        Click to WhatsApp
                      </p>
                    </div>
                  </div>
                  <p style={{
                    fontSize: '13px',
                    color: '#6b7280',
                    margin: '8px 0 0 0',
                    lineHeight: '1.5'
                  }}>
                    Optimize for WhatsApp conversations
                  </p>
                </div>

                {/* CPAS Card */}
                <div
                  onClick={() => setObjectiveType('cpas')}
                  style={{
                    padding: '16px',
                    border: `2px solid ${objectiveType === 'cpas' ? '#2B46BB' : '#e5e7eb'}`,
                    borderRadius: '12px',
                    backgroundColor: objectiveType === 'cpas' ? '#eff6ff' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    if (objectiveType !== 'cpas') {
                      e.currentTarget.style.borderColor = '#2B46BB'
                      e.currentTarget.style.backgroundColor = '#f9fafb'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (objectiveType !== 'cpas') {
                      e.currentTarget.style.borderColor = '#e5e7eb'
                      e.currentTarget.style.backgroundColor = '#ffffff'
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = 'none'
                    }
                  }}
                >
                  {objectiveType === 'cpas' && (
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      backgroundColor: '#2B46BB',
                      color: '#ffffff',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px'
                    }}>
                      <i className="bi bi-check-lg"></i>
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div style={{
                      backgroundColor: objectiveType === 'cpas' ? '#2B46BB' : '#dbeafe',
                      borderRadius: '8px',
                      padding: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <i className="bi bi-cart3" style={{
                        fontSize: '18px',
                        color: objectiveType === 'cpas' ? '#ffffff' : '#2B46BB'
                      }}></i>
                    </div>
                    <div>
                      <p style={{
                        fontSize: '15px',
                        fontWeight: '700',
                        color: '#111827',
                        margin: 0,
                        lineHeight: '1.3',
                        letterSpacing: '0.01em'
                      }}>
                        CPAS
                      </p>
                      <p style={{
                        fontSize: '12px',
                        color: '#6b7280',
                        margin: '3px 0 0 0',
                        lineHeight: '1.4',
                        fontWeight: '500'
                      }}>
                        Collab Ads
                      </p>
                    </div>
                  </div>
                  <p style={{
                    fontSize: '13px',
                    color: '#6b7280',
                    margin: '8px 0 0 0',
                    lineHeight: '1.5'
                  }}>
                    Collaborative advertising with creators
                  </p>
                </div>

                {/* CTLP to WA Card */}
                <div
                  onClick={() => setObjectiveType('ctlptowa')}
                  style={{
                    padding: '16px',
                    border: `2px solid ${objectiveType === 'ctlptowa' ? '#2B46BB' : '#e5e7eb'}`,
                    borderRadius: '12px',
                    backgroundColor: objectiveType === 'ctlptowa' ? '#eff6ff' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    if (objectiveType !== 'ctlptowa') {
                      e.currentTarget.style.borderColor = '#2B46BB'
                      e.currentTarget.style.backgroundColor = '#f9fafb'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (objectiveType !== 'ctlptowa') {
                      e.currentTarget.style.borderColor = '#e5e7eb'
                      e.currentTarget.style.backgroundColor = '#ffffff'
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = 'none'
                    }
                  }}
                >
                  {objectiveType === 'ctlptowa' && (
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      backgroundColor: '#2B46BB',
                      color: '#ffffff',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px'
                    }}>
                      <i className="bi bi-check-lg"></i>
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div style={{
                      backgroundColor: objectiveType === 'ctlptowa' ? '#2B46BB' : '#dbeafe',
                      borderRadius: '8px',
                      padding: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <i className="bi bi-link-45deg" style={{
                        fontSize: '18px',
                        color: objectiveType === 'ctlptowa' ? '#ffffff' : '#2B46BB'
                      }}></i>
                    </div>
                    <div>
                      <p style={{
                        fontSize: '15px',
                        fontWeight: '700',
                        color: '#111827',
                        margin: 0,
                        lineHeight: '1.3',
                        letterSpacing: '0.01em'
                      }}>
                        CTLP to WA
                      </p>
                      <p style={{
                        fontSize: '12px',
                        color: '#6b7280',
                        margin: '3px 0 0 0',
                        lineHeight: '1.4',
                        fontWeight: '500'
                      }}>
                        Click Link to WhatsApp
                      </p>
                    </div>
                  </div>
                  <p style={{
                    fontSize: '13px',
                    color: '#6b7280',
                    margin: '8px 0 0 0',
                    lineHeight: '1.5'
                  }}>
                    Link clicks to WhatsApp conversations
                  </p>
                </div>

                {/* CTLP to Purchase Card */}
                <div
                  onClick={() => setObjectiveType('ctlptopurchase')}
                  style={{
                    padding: '16px',
                    border: `2px solid ${objectiveType === 'ctlptopurchase' ? '#2B46BB' : '#e5e7eb'}`,
                    borderRadius: '12px',
                    backgroundColor: objectiveType === 'ctlptopurchase' ? '#eff6ff' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    if (objectiveType !== 'ctlptopurchase') {
                      e.currentTarget.style.borderColor = '#2B46BB'
                      e.currentTarget.style.backgroundColor = '#f9fafb'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (objectiveType !== 'ctlptopurchase') {
                      e.currentTarget.style.borderColor = '#e5e7eb'
                      e.currentTarget.style.backgroundColor = '#ffffff'
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = 'none'
                    }
                  }}
                >
                  {objectiveType === 'ctlptopurchase' && (
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      backgroundColor: '#2B46BB',
                      color: '#ffffff',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px'
                    }}>
                      <i className="bi bi-check-lg"></i>
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div style={{
                      backgroundColor: objectiveType === 'ctlptopurchase' ? '#2B46BB' : '#dbeafe',
                      borderRadius: '8px',
                      padding: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <i className="bi bi-bag-check" style={{
                        fontSize: '18px',
                        color: objectiveType === 'ctlptopurchase' ? '#ffffff' : '#2B46BB'
                      }}></i>
                    </div>
                    <div>
                      <p style={{
                        fontSize: '15px',
                        fontWeight: '700',
                        color: '#111827',
                        margin: 0,
                        lineHeight: '1.3',
                        letterSpacing: '0.01em'
                      }}>
                        CTLP to Purchase
                      </p>
                      <p style={{
                        fontSize: '12px',
                        color: '#6b7280',
                        margin: '3px 0 0 0',
                        lineHeight: '1.4',
                        fontWeight: '500'
                      }}>
                        Click Link to Purchase
                      </p>
                    </div>
                  </div>
                  <p style={{
                    fontSize: '13px',
                    color: '#6b7280',
                    margin: '8px 0 0 0',
                    lineHeight: '1.5'
                  }}>
                    Link clicks to website purchases
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Objective Metrics Section */}
        <div className="responsive-card" style={{
          backgroundColor: '#fffbeb',
          borderRadius: '16px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          border: 'none',
          borderLeft: '4px solid #f59e0b',
          padding: '32px',
          marginBottom: '24px',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = '0 25px 30px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.06)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: showMetrics ? '24px' : '0px',
            transition: 'margin-bottom 0.2s ease'
          }}>
            <h2 style={{
              fontSize: '17px',
              fontWeight: '700',
              color: '#111827',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              letterSpacing: '0.01em'
            }}>
              <i className="bi bi-info-circle" style={{ color: '#f59e0b', fontSize: '18px' }}></i>
              Metrics for {objectiveType === 'ctwa' ? 'CTWA' : objectiveType === 'cpas' ? 'CPAS' : objectiveType === 'ctlptowa' ? 'CTLP to WA' : 'CTLP to Purchase'}
            </h2>
            <button
              onClick={() => setShowMetrics(!showMetrics)}
              style={{
                padding: '8px 16px',
                backgroundColor: showMetrics ? '#f59e0b' : '#e5e7eb',
                color: showMetrics ? '#ffffff' : '#111827',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap',
                letterSpacing: '0.01em'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)'
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              {showMetrics ? (
                <>
                  <i className="bi bi-chevron-up" style={{ fontSize: '14px' }}></i>
                  Read Less
                </>
              ) : (
                <>
                  <i className="bi bi-chevron-down" style={{ fontSize: '14px' }}></i>
                  Read More
                </>
              )}
            </button>
          </div>

          {showMetrics && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '20px',
              animation: 'fadeIn 0.3s ease'
            }}>
              {/* Main Metrics */}
              <div>
                <h3 style={{
                  fontSize: '15px',
                  fontWeight: '700',
                  color: '#111827',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  letterSpacing: '0.01em'
                }}>
                  <i className="bi bi-graph-up" style={{ color: '#f59e0b', fontSize: '16px' }}></i>
                  Main Metrics
                </h3>
                <div style={{
                  backgroundColor: '#ffffff',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid #fde68a'
                }}>
                  <ul style={{
                    fontSize: '13px',
                    color: '#4b5563',
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                    gap: '8px'
                  }}>
                    {requirements.main.map((metric: string, idx: number) => (
                      <li key={idx} style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        paddingLeft: '16px',
                        paddingRight: '8px'
                      }}>
                        <span style={{ color: '#f59e0b', marginRight: '8px', fontSize: '12px', marginTop: '2px', flexShrink: 0 }}>✓</span>
                        <span>{metric}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Breakdown Metrics */}
              <div>
                <h3 style={{
                  fontSize: '15px',
                  fontWeight: '700',
                  color: '#111827',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  letterSpacing: '0.01em'
                }}>
                  <i className="bi bi-pie-chart" style={{ color: '#f59e0b', fontSize: '16px' }}></i>
                  Breakdown Metrics by Dimension
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '12px'
                }}>
                  {Object.entries(requirements.breakdown).map(([fileName, metrics]: [string, any]) => (
                    <div key={fileName} style={{
                      padding: '14px',
                      backgroundColor: '#ffffff',
                      borderRadius: '8px',
                      border: '1px solid #fde68a',
                      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                    }}>
                      <div style={{
                        fontWeight: '600',
                        color: '#111827',
                        marginBottom: '10px',
                        fontSize: '13px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <i className="bi bi-file-earmark-spreadsheet" style={{ color: '#f59e0b', fontSize: '14px' }}></i>
                        {fileName}
                      </div>
                      <ul style={{
                        fontSize: '11px',
                        color: '#4b5563',
                        listStyle: 'none',
                        padding: 0,
                        margin: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px'
                      }}>
                        {metrics.map((metric: string, idx: number) => (
                          <li key={idx} style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            paddingLeft: '16px'
                          }}>
                            <span style={{ color: '#f59e0b', marginRight: '6px', fontSize: '10px', marginTop: '2px', flexShrink: 0 }}>▸</span>
                            <span style={{ lineHeight: '1.4' }}>{metric}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* File Upload Section */}
        <div className="responsive-card" style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          border: 'none',
          padding: '32px',
          marginBottom: '24px',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = '0 25px 30px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.06)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '12px',
            letterSpacing: '0.01em'
          }}>
            Upload CSV Files untuk:
            <br />
            {retentionType === 'wow' ? 'Week-on-Week' : 'Month-on-Month'} Analysis
          </h2>
          <p style={{
            fontSize: '14px',
            color: '#6b7280',
            marginBottom: '24px',
            lineHeight: '1.5'
          }}>
            Upload file utama + file breakdown (age, gender, region, platform, placement, objective, ad-creative)
          </p>

          <div className="responsive-grid-2" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '24px'
          }}>
            {/* This Week/Month */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '12px',
                letterSpacing: '0.01em'
              }}>
                <i className="bi bi-calendar" style={{ marginRight: '8px', color: '#2B46BB', fontSize: '14px' }}></i>
                {retentionType === 'wow' ? 'Minggu Ini (This Week)' : 'Bulan Ini (This Month)'} - {filesThisWeek.length} file(s)
              </label>
              <label
                htmlFor="fileInputThisWeek"
                style={{
                  display: 'block',
                  border: '2px dashed #2B46BB',
                  borderRadius: '12px',
                  padding: '40px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  backgroundColor: '#f8fafc'
                }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, 'thisWeek')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#eff6ff'
                  e.currentTarget.style.borderColor = '#1e35a0'
                  e.currentTarget.style.transform = 'scale(1.01)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8fafc'
                  e.currentTarget.style.borderColor = '#2B46BB'
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              >
                <input
                  id="fileInputThisWeek"
                  type="file"
                  accept=".csv,text/csv"
                  multiple
                  onChange={(e) => handleFileChange(e, 'thisWeek')}
                  style={{ display: 'none' }}
                />
                <div>
                  <p style={{
                    color: '#374151',
                    fontWeight: '600',
                    fontSize: '15px',
                    marginBottom: '8px',
                    letterSpacing: '0.01em'
                  }}>
                    <i className="bi bi-file-earmark" style={{ marginRight: '8px', fontSize: '18px' }}></i>
                    Drag & Drop atau click untuk upload
                  </p>
                  <p style={{
                    fontSize: '13px',
                    color: '#6b7280',
                    fontWeight: '400'
                  }}>
                    CSV files (bisa multiple)
                  </p>
                </div>
                {filesThisWeek.length > 0 && (
                  <div style={{ marginTop: '16px' }}>
                    {filesThisWeek.map((file, index) => (
                      <div key={index} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        gap: '8px',
                        backgroundColor: '#f9fafb',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        marginBottom: '8px',
                        textAlign: 'left'
                      }}>
                        <i className="bi bi-check-circle" style={{ color: '#16a34a', flexShrink: 0 }}></i>
                        <span style={{
                          fontSize: '14px',
                          color: '#374151',
                          flex: 1,
                          textAlign: 'left',
                          wordBreak: 'break-word'
                        }}>
                          {file.name}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            removeFile(index, 'thisWeek')
                          }}
                          style={{
                            color: '#ef4444',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '14px',
                            padding: '4px',
                            flexShrink: 0
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.color = '#dc2626'}
                          onMouseLeave={(e) => e.currentTarget.style.color = '#ef4444'}
                        >
                          <i className="bi bi-x-circle"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </label>
            </div>

            {/* Last Week/Month */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '12px',
                letterSpacing: '0.01em'
              }}>
                <i className="bi bi-calendar" style={{ marginRight: '8px', color: '#2B46BB', fontSize: '14px' }}></i>
                {retentionType === 'wow' ? 'Minggu Lalu (Last Week)' : 'Bulan Lalu (Last Month)'} - {filesLastWeek.length} file(s)
              </label>
              <label
                htmlFor="fileInputLastWeek"
                style={{
                  display: 'block',
                  border: '2px dashed #2B46BB',
                  borderRadius: '12px',
                  padding: '40px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  backgroundColor: '#f8fafc'
                }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, 'lastWeek')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#eff6ff'
                  e.currentTarget.style.borderColor = '#1e35a0'
                  e.currentTarget.style.transform = 'scale(1.01)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8fafc'
                  e.currentTarget.style.borderColor = '#2B46BB'
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              >
                <input
                  id="fileInputLastWeek"
                  type="file"
                  accept=".csv,text/csv"
                  multiple
                  onChange={(e) => handleFileChange(e, 'lastWeek')}
                  style={{ display: 'none' }}
                />
                <div>
                  <p style={{
                    color: '#374151',
                    fontWeight: '600',
                    fontSize: '15px',
                    marginBottom: '8px',
                    letterSpacing: '0.01em'
                  }}>
                    <i className="bi bi-file-earmark" style={{ marginRight: '8px', fontSize: '18px' }}></i>
                    Drag & Drop atau click untuk upload
                  </p>
                  <p style={{
                    fontSize: '13px',
                    color: '#6b7280',
                    fontWeight: '400'
                  }}>
                    CSV files (bisa multiple)
                  </p>
                </div>
                {filesLastWeek.length > 0 && (
                  <div style={{ marginTop: '16px' }}>
                    {filesLastWeek.map((file, index) => (
                      <div key={index} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        gap: '8px',
                        backgroundColor: '#f9fafb',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        marginBottom: '8px',
                        textAlign: 'left'
                      }}>
                        <i className="bi bi-check-circle" style={{ color: '#16a34a', flexShrink: 0 }}></i>
                        <span style={{
                          fontSize: '14px',
                          color: '#374151',
                          flex: 1,
                          textAlign: 'left',
                          wordBreak: 'break-word'
                        }}>
                          {file.name}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            removeFile(index, 'lastWeek')
                          }}
                          style={{
                            color: '#ef4444',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '14px',
                            padding: '4px',
                            flexShrink: 0
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.color = '#dc2626'}
                          onMouseLeave={(e) => e.currentTarget.style.color = '#ef4444'}
                        >
                          <i className="bi bi-x-circle"></i>
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
        <div className="action-buttons-wrapper" style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '24px',
          justifyContent: 'space-between',
          alignItems: 'center'
          }}>
          {/* Back to Home Button - Desktop Position */}
          <button
            className="back-to-home-desktop"
            onClick={() => router.push('/home')}
            style={{
              color: '#000000',
              background: '#ECDC43',
              border: 'none',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: '600',
              padding: '12px 24px',
              borderRadius: '8px',
              transition: 'all 0.2s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 6px -1px rgba(236, 220, 67, 0.3)',
              letterSpacing: '0.01em'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#d4c539'
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 6px 8px -1px rgba(236, 220, 67, 0.4)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ECDC43'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(236, 220, 67, 0.3)'
            }}
          >
            <i className="bi bi-arrow-left" style={{ fontSize: '14px' }}></i>
            Back to Home
          </button>
          
          <div className="action-buttons-container" style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            alignItems: 'center'
          }}>
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || filesThisWeek.length === 0 || filesLastWeek.length === 0}
              style={{
                padding: '12px 24px',
                backgroundColor: (isAnalyzing || filesThisWeek.length === 0 || filesLastWeek.length === 0) ? '#9ca3af' : '#000000',
                color: '#ffffff',
                borderRadius: '8px',
                fontWeight: '600',
                border: 'none',
                cursor: (isAnalyzing || filesThisWeek.length === 0 || filesLastWeek.length === 0) ? 'not-allowed' : 'pointer',
                fontSize: '15px',
                transition: 'all 0.2s ease',
                boxShadow: (isAnalyzing || filesThisWeek.length === 0 || filesLastWeek.length === 0) ? 'none' : '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
                letterSpacing: '0.01em',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                if (!isAnalyzing && filesThisWeek.length > 0 && filesLastWeek.length > 0) {
                  e.currentTarget.style.backgroundColor = '#1f2937'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 6px 8px -1px rgba(0, 0, 0, 0.4)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isAnalyzing && filesThisWeek.length > 0 && filesLastWeek.length > 0) {
                  e.currentTarget.style.backgroundColor = '#000000'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
                }
              }}
            >
              {isAnalyzing ? (
                <>
                  <i className="bi bi-hourglass-split" style={{ fontSize: '16px' }}></i>
                  Analyzing...
                </>
              ) : (
                <>
                  <i className="bi bi-cpu" style={{ fontSize: '16px' }}></i>
                  1. Analyze CSV
                </>
              )}
            </button>

          {analysis && (
            <button
              onClick={handleGenerateReport}
              disabled={isGenerating}
              style={{
                padding: '12px 24px',
                backgroundColor: isGenerating ? '#9ca3af' : '#fbbf24',
                color: '#000000',
                borderRadius: '8px',
                fontWeight: '600',
                border: 'none',
                cursor: isGenerating ? 'not-allowed' : 'pointer',
                fontSize: '15px',
                transition: 'all 0.2s ease',
                boxShadow: isGenerating ? 'none' : '0 4px 6px -1px rgba(251, 191, 36, 0.3)',
                letterSpacing: '0.01em',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                if (!isGenerating) {
                  e.currentTarget.style.backgroundColor = '#f59e0b'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 6px 8px -1px rgba(251, 191, 36, 0.4)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isGenerating) {
                  e.currentTarget.style.backgroundColor = '#fbbf24'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(251, 191, 36, 0.3)'
                }
              }}
            >
              {isGenerating ? (
                <>
                  <i className="bi bi-hourglass-split" style={{ fontSize: '16px' }}></i>
                  Generating...
                </>
              ) : (
                <>
                  <i className="bi bi-file-earmark-code" style={{ fontSize: '16px' }}></i>
                  2. Generate HTML Report
                </>
              )}
            </button>
          )}

            {htmlReport && (
              <button
                onClick={handleDownloadPDF}
                disabled={isDownloadingPDF}
                style={{
                  padding: '12px 24px',
                  backgroundColor: isDownloadingPDF ? '#9ca3af' : '#059669',
                  color: '#ffffff',
                  borderRadius: '8px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: isDownloadingPDF ? 'not-allowed' : 'pointer',
                  fontSize: '15px',
                  transition: 'all 0.2s ease',
                  boxShadow: isDownloadingPDF ? 'none' : '0 4px 6px -1px rgba(5, 150, 105, 0.3)',
                  letterSpacing: '0.01em',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  if (!isDownloadingPDF) {
                    e.currentTarget.style.backgroundColor = '#047857'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 6px 8px -1px rgba(5, 150, 105, 0.4)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isDownloadingPDF) {
                    e.currentTarget.style.backgroundColor = '#059669'
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(5, 150, 105, 0.3)'
                  }
                }}
              >
                {isDownloadingPDF ? (
                  <>
                    <i className="bi bi-hourglass-split" style={{ fontSize: '16px' }}></i>
                    Downloading...
                  </>
                ) : (
                  <>
                    <i className="bi bi-file-earmark-pdf" style={{ fontSize: '16px' }}></i>
                    3. Download PDF Report
                  </>
                )}
              </button>
            )}

            {htmlReport && (
              <button
                onClick={handleNewAnalysis}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#7c3aed',
                  color: '#ffffff',
                  borderRadius: '8px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '15px',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 6px -1px rgba(124, 58, 237, 0.3)',
                  letterSpacing: '0.01em',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#6d28d9'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 6px 8px -1px rgba(124, 58, 237, 0.4)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#7c3aed'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(124, 58, 237, 0.3)'
                }}
              >
                <i className="bi bi-arrow-clockwise" style={{ fontSize: '16px' }}></i>
                Analisa Data Baru
              </button>
            )}
          </div>
        </div>

        {/* Loading State - Analyzing */}
        {isAnalyzing && (
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '24px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            border: '2px solid #e5e7eb'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '20px'
            }}>
              <div style={{
                backgroundColor: '#2B46BB',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
              }}>
                <i className="bi bi-cpu" style={{ fontSize: '24px', color: '#ffffff' }}></i>
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{
                  fontSize: '17px',
                  fontWeight: '700',
                  color: '#111827',
                  margin: 0,
                  marginBottom: '6px',
                  letterSpacing: '0.01em'
                }}>
                  Analyzing Your Data...
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  margin: 0,
                  lineHeight: '1.5'
                }}>
                  Please wait while we process your CSV files
                </p>
              </div>
            </div>

            {/* Progress Steps */}
            <div style={{
              backgroundColor: '#f9fafb',
              borderRadius: '12px',
              padding: '20px',
              marginTop: '16px'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    backgroundColor: '#059669',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <i className="bi bi-check" style={{ fontSize: '14px', color: '#ffffff' }}></i>
                  </div>
                  <span style={{
                    fontSize: '14px',
                    color: '#374151',
                    fontWeight: '500'
                  }}>
                    Files uploaded successfully
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    backgroundColor: '#2B46BB',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                  }}>
                    <i className="bi bi-arrow-repeat" style={{ fontSize: '14px', color: '#ffffff', animation: 'spin 1s linear infinite' }}></i>
                  </div>
                  <span style={{
                    fontSize: '14px',
                    color: '#2B46BB',
                    fontWeight: '500'
                  }}>
                    Processing data...
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    backgroundColor: '#e5e7eb',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <i className="bi bi-hourglass" style={{ fontSize: '14px', color: '#9ca3af' }}></i>
                  </div>
                  <span style={{
                    fontSize: '14px',
                    color: '#9ca3af',
                    fontWeight: '500'
                  }}>
                    Generating insights...
                  </span>
                </div>
              </div>
            </div>

            <style>{`
              @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
              }
              @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        )}

        {/* Loading State - Generating Report */}
        {isGenerating && (
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '24px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            border: '2px solid #fbbf24'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '20px'
            }}>
              <div style={{
                backgroundColor: '#fbbf24',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
              }}>
                <i className="bi bi-file-earmark-text" style={{ fontSize: '24px', color: '#000000' }}></i>
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#111827',
                  margin: 0,
                  marginBottom: '4px'
                }}>
                  Generating Your Report...
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  margin: 0
                }}>
                  Creating comprehensive insights and visualizations
                </p>
              </div>
            </div>

            {/* Progress Steps */}
            <div style={{
              backgroundColor: '#fffbeb',
              borderRadius: '12px',
              padding: '20px',
              marginTop: '16px'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    backgroundColor: '#059669',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <i className="bi bi-check" style={{ fontSize: '14px', color: '#ffffff' }}></i>
                  </div>
                  <span style={{
                    fontSize: '14px',
                    color: '#374151',
                    fontWeight: '500'
                  }}>
                    Data analysis complete
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    backgroundColor: '#fbbf24',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                  }}>
                    <i className="bi bi-arrow-repeat" style={{ fontSize: '14px', color: '#000000', animation: 'spin 1s linear infinite' }}></i>
                  </div>
                  <span style={{
                    fontSize: '14px',
                    color: '#b45309',
                    fontWeight: '500'
                  }}>
                    Building report slides...
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    backgroundColor: '#e5e7eb',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <i className="bi bi-hourglass" style={{ fontSize: '14px', color: '#9ca3af' }}></i>
                  </div>
                  <span style={{
                    fontSize: '14px',
                    color: '#9ca3af',
                    fontWeight: '500'
                  }}>
                    Finalizing report...
                  </span>
                </div>
              </div>
            </div>

            <style>{`
              @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
              }
              @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            borderLeft: '4px solid #ef4444',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '24px',
            boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.1)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px'
            }}>
              <i className="bi bi-exclamation-triangle-fill" style={{
                color: '#ef4444',
                fontSize: '20px',
                flexShrink: 0,
                marginTop: '2px'
              }}></i>
              <div style={{ flex: 1 }}>
                <p style={{
                  color: '#b91c1c',
                  fontWeight: '700',
                  margin: 0,
                  marginBottom: '6px',
                  fontSize: '15px',
                  letterSpacing: '0.01em'
                }}>
                  Error
                </p>
                <p style={{
                  color: '#991b1b',
                  margin: 0,
                  fontSize: '14px',
                  lineHeight: '1.5'
                }}>
                  {error}
                </p>
              </div>
              <button
                onClick={() => setError(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#b91c1c',
                  cursor: 'pointer',
                  fontSize: '18px',
                  padding: '0',
                  lineHeight: 1,
                  flexShrink: 0
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                <i className="bi bi-x"></i>
              </button>
            </div>
          </div>
        )}

        {/* Analysis Results */}
        {analysis && (
          <>
            {/* Quick Stats Preview Card */}
            <div style={{
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '24px',
              boxShadow: '0 20px 25px -5px rgba(5, 150, 105, 0.3), 0 10px 10px -5px rgba(5, 150, 105, 0.2)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    padding: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <i className="bi bi-graph-up-arrow" style={{ fontSize: '24px', color: '#ffffff' }}></i>
                  </div>
                  <div>
                    <h3 style={{
                      fontSize: '20px',
                      fontWeight: 'bold',
                      color: '#ffffff',
                      margin: 0,
                      marginBottom: '4px'
                    }}>
                      Analysis Complete!
                    </h3>
                    <p style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.9)',
                      margin: 0
                    }}>
                      Your data is ready for report generation
                    </p>
                  </div>
                </div>
                <div style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#ffffff'
                }}>
                  v2.0.0
                </div>
              </div>

              {/* Quick Stats Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginTop: '20px'
              }}>
                <div style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <i className="bi bi-calendar-check" style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px' }}></i>
                    <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)', fontWeight: '500' }}>
                      This Period
                    </span>
                  </div>
                  <p style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#ffffff',
                    margin: 0,
                    lineHeight: '1.2'
                  }}>
                    {analysis.summary?.thisWeek?.totalRows || analysis.summary?.thisWeek?.rows || 0}
                  </p>
                  <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)', margin: '4px 0 0 0' }}>
                    rows loaded
                  </p>
                </div>

                <div style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <i className="bi bi-calendar-range" style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px' }}></i>
                    <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)', fontWeight: '500' }}>
                      Last Period
                    </span>
                  </div>
                  <p style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#ffffff',
                    margin: 0,
                    lineHeight: '1.2'
                  }}>
                    {analysis.summary?.lastWeek?.totalRows || analysis.summary?.lastWeek?.rows || 0}
                  </p>
                  <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)', margin: '4px 0 0 0' }}>
                    rows loaded
                  </p>
                </div>

                {((analysis.summary?.thisWeek?.breakdownFiles && analysis.summary.thisWeek.breakdownFiles > 0) ||
                  (analysis.summary?.lastWeek?.breakdownFiles && analysis.summary.lastWeek.breakdownFiles > 0)) && (
                  <>
                    <div style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '12px',
                      padding: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <i className="bi bi-files" style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px' }}></i>
                        <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)', fontWeight: '500' }}>
                          Breakdown Files
                        </span>
                      </div>
                      <p style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: '#ffffff',
                        margin: 0,
                        lineHeight: '1.2'
                      }}>
                        {analysis.summary?.thisWeek?.breakdownFiles || 0}
                      </p>
                      <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)', margin: '4px 0 0 0' }}>
                        {analysis.summary?.thisWeek?.breakdownRows || 0} breakdown rows
                      </p>
                    </div>

                    {analysis.summary?.thisWeek?.breakdownTypes &&
                     Array.isArray(analysis.summary.thisWeek.breakdownTypes) &&
                     analysis.summary.thisWeek.breakdownTypes.length > 0 && (
                      <div style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '12px',
                        padding: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <i className="bi bi-layers" style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px' }}></i>
                          <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)', fontWeight: '500' }}>
                            Breakdown Types
                          </span>
                        </div>
                        <p style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#ffffff',
                          margin: 0,
                          lineHeight: '1.3'
                        }}>
                          {analysis.summary.thisWeek.breakdownTypes
                            .map((type: string) => {
                              return type
                                .replace(/-/g, ' ')
                                .replace(/\b\w/g, (l: string) => l.toUpperCase())
                                .replace(/Age/g, 'Age')
                                .replace(/Gender/g, 'Gender')
                                .replace(/Region/g, 'Region')
                                .replace(/Platform/g, 'Platform')
                                .replace(/Placement/g, 'Placement')
                                .replace(/Objective/g, 'Objective')
                                .replace(/Ad Creative/g, 'Ad Creative')
                            })
                            .join(', ')}
                        </p>
                        <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)', margin: '4px 0 0 0' }}>
                          {analysis.summary.thisWeek.breakdownTypes.length} dimension{analysis.summary.thisWeek.breakdownTypes.length > 1 ? 's' : ''} detected
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </>
        )}

        {/* Report Success Card */}
        {htmlReport && (
          <div style={{
            background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '24px',
            boxShadow: '0 20px 25px -5px rgba(5, 150, 105, 0.3), 0 10px 10px -5px rgba(5, 150, 105, 0.2)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}>
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <i className="bi bi-check-circle-fill" style={{ fontSize: '32px', color: '#ffffff' }}></i>
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: '#ffffff',
                  margin: 0,
                  marginBottom: '4px'
                }}>
                  Report Generated Successfully!
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  margin: 0,
                  marginBottom: '12px'
                }}>
                  Your report is ready for preview and download
                </p>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  flexWrap: 'wrap'
                }}>
                  <div style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#ffffff'
                  }}>
                    v2.0.0
                  </div>
                  <div style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#ffffff'
                  }}>
                    {objectiveType.toUpperCase()}
                  </div>
                  <div style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#ffffff'
                  }}>
                    {retentionType === 'wow' ? 'Week-over-Week' : 'Month-over-Month'}
                  </div>
                  <div style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#ffffff'
                  }}>
                    {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Report Preview */}
        {htmlReport && (
          <div className="responsive-card" style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            border: 'none',
            padding: '32px',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 25px 30px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.06)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}>
            <h2 style={{
              fontSize: '22px',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '20px'
            }}>
              Preview Report
            </h2>
            <div style={{
              border: '2px solid #e5e7eb',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <iframe
                srcDoc={htmlReport}
                style={{
                  width: '100%',
                  height: '600px',
                  border: 'none'
                }}
                title="Report Preview"
              />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e5e7eb',
        marginTop: '12px'
      }}>
        <div className="responsive-footer" style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '24px 48px',
          textAlign: 'center'
        }}>
          <p className="footer-line-1" style={{
            fontSize: '14px',
            color: '#6b7280',
            margin: 0,
            marginBottom: '8px'
          }}>
            <span className="footer-text-1">© 2025 Ads Report Generator. Powered by</span>
            <span className="footer-hadona" style={{ fontWeight: '600', color: '#2563eb', marginLeft: '4px' }}>Hadona Digital Media</span>
          </p>
          <p style={{
            fontSize: '12px',
            color: '#9ca3af',
            margin: 0
          }}>
            Designed & Developed by <span style={{ fontWeight: '600', color: '#6b7280' }}>Briyanes</span>
          </p>
        </div>
      </footer>
    </div>
  )
}

