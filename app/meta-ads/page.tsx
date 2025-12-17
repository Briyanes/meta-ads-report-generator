'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
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
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsScrolled(scrollPosition > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
      
      // Find main CSV files (files without breakdown keywords)
      // Main file is typically the one without breakdown dimension keywords
      const breakdownKeywords = ['-age', '-gender', '-region', '-platform', '-placement', '-objective', '-ad-creative', '-creative', '-adcreative']
      
      const mainThisWeek = filesThisWeek.find(file => {
        const name = file.name.toLowerCase()
        // Check if file contains any breakdown keyword
        const hasBreakdownKeyword = breakdownKeywords.some(keyword => name.includes(keyword))
        // Main file should not have breakdown keywords
        return !hasBreakdownKeyword
      })
      
      const mainLastWeek = filesLastWeek.find(file => {
        const name = file.name.toLowerCase()
        // Check if file contains any breakdown keyword
        const hasBreakdownKeyword = breakdownKeywords.some(keyword => name.includes(keyword))
        // Main file should not have breakdown keywords
        return !hasBreakdownKeyword
      })
      
      // If no main file found, try to find the largest file or file with most common name pattern
      const findMainFileFallback = (files: File[]) => {
        if (files.length === 0) return null
        
        // Try to find file that matches common main file patterns
        const mainPatterns = ['main', 'data', 'report', 'summary']
        for (const pattern of mainPatterns) {
          const found = files.find(f => f.name.toLowerCase().includes(pattern))
          if (found) return found
        }
        
        // If no pattern match, return the file with the longest name (usually main file)
        return files.reduce((prev, current) => 
          current.name.length > prev.name.length ? current : prev
        )
      }
      
      const finalMainThisWeek = mainThisWeek || findMainFileFallback(filesThisWeek)
      const finalMainLastWeek = mainLastWeek || findMainFileFallback(filesLastWeek)

      if (!finalMainThisWeek || !finalMainLastWeek) {
        setError('Please upload main CSV files (without breakdown keywords like -age, -gender, etc.) for both periods')
        setIsAnalyzing(false)
        return
      }

      // Debug: Log detected files
      console.log('Detected main files:', {
        thisWeek: finalMainThisWeek?.name,
        lastWeek: finalMainLastWeek?.name
      })
      console.log('All files this week:', filesThisWeek.map(f => f.name))
      console.log('All files last week:', filesLastWeek.map(f => f.name))

      // Add main CSV files
      formData.append('fileThisWeek', finalMainThisWeek)
      formData.append('fileLastWeek', finalMainLastWeek)
      
      // Add breakdown files for this week
      filesThisWeek.forEach((file, index) => {
        if (file !== finalMainThisWeek) {
          formData.append(`breakdownThisWeek_${index}`, file)
          console.log(`Added breakdown this week: ${file.name}`)
        }
      })
      
      // Add breakdown files for last week
      filesLastWeek.forEach((file, index) => {
        if (file !== finalMainLastWeek) {
          formData.append(`breakdownLastWeek_${index}`, file)
          console.log(`Added breakdown last week: ${file.name}`)
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
          // Extract analysis data - handle both structures: {analysis: {...}} or direct analysis object
          analysisData: (analysis.analysis && typeof analysis.analysis === 'object') 
            ? analysis.analysis 
            : (analysis.analysis && typeof analysis.analysis === 'string')
            ? JSON.parse(analysis.analysis)
            : analysis,
          reportName: reportName || undefined,
          retentionType: retentionType || analysis.analysis?.retentionType || analysis.retentionType || 'wow',
          objectiveType: objectiveType || analysis.analysis?.objectiveType || analysis.objectiveType || 'cpas'
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
        main: [
          'Amount spent (IDR)',
          'Messaging conversations started',
          'Cost per messaging conversation started',
          'Link clicks',
          'CPC (cost per link click)',
          'CTR (link click-through rate)',
          'Outbound clicks',
          '* OC→WA landing ratio',
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
            '* OC→WA landing ratio',
            'Messaging conversations started',
            'Cost per messaging conversation started',
            'Amount spent (IDR)'
          ],
          'Gender (gender.csv)': [
            'Gender',
            'Impressions',
            'CTR (link click-through rate)',
            'Outbound clicks',
            '* OC→WA landing ratio',
            'Messaging conversations started',
            'Cost per messaging conversation started',
            'Amount spent (IDR)'
          ],
          'Region (region.csv)': [
            'Region',
            'Impressions',
            'CTR (link click-through rate)',
            'Outbound clicks',
            '* OC→WA landing ratio',
            'Messaging conversations started',
            'Cost per messaging conversation started',
            'Amount spent (IDR)'
          ],
          'Platform (platform.csv)': [
            'Platform',
            'Impressions',
            'CTR (link click-through rate)',
            'Outbound clicks',
            '* OC→WA landing ratio',
            'Messaging conversations started',
            'Cost per messaging conversation started',
            'Amount spent (IDR)'
          ],
          'Placement (placement.csv)': [
            'Placement',
            'Impressions',
            'CTR (link click-through rate)',
            'Outbound clicks',
            '* OC→WA landing ratio',
            'Messaging conversations started',
            'Cost per messaging conversation started',
            'Amount spent (IDR)'
          ],
          'Campaign objective (objective.csv)': [
            'Campaign objective',
            'Impressions',
            'CTR (link click-through rate)',
            'Outbound clicks',
            '* OC→WA landing ratio',
            'Messaging conversations started',
            'Cost per messaging conversation started',
            'Amount spent (IDR)'
          ],
          'Ad creative/Ad name (ad-creative.csv)': [
            'Ad creative/Ad name',
            'Impressions',
            'CTR (link click-through rate)',
            'Outbound clicks',
            '* OC→WA landing ratio',
            'Messaging conversations started',
            'Cost per messaging conversation started',
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
          justifyContent: 'space-between',
          flexWrap: 'nowrap',
          width: '100%'
        }}>
          <div style={{
            flex: '1 1 0%',
            minWidth: 0,
            maxWidth: 'calc(100% - 100px)'
          }}>
            <h1 className="responsive-header-title" style={{
              fontSize: '36px',
              fontWeight: 'bold',
              color: '#111827',
              margin: 0,
              marginBottom: '4px',
              lineHeight: '1.2'
            }}>
              Meta Ads Report Generator
            </h1>
            <p className="responsive-header-subtitle" style={{
              fontSize: '16px',
              fontWeight: '400',
              color: '#6b7280',
              margin: 0,
              lineHeight: '1.3'
            }}>
              Powered by <span style={{ fontWeight: '600' }}>Hadona Digital Media</span>
            </p>
          </div>
          <div className="responsive-header-logo-container" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '8px',
            flexShrink: 0,
            flexGrow: 0,
            width: 'auto'
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
                  objectFit: 'contain',
                  display: 'block'
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
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            marginBottom: '16px'
          }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '10px'
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
                  padding: '12px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '10px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  backgroundColor: '#ffffff'
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
                fontSize: '14px',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '10px'
              }}>
                Pemilihan Retensi
              </label>
              <select
                value={retentionType}
                onChange={(e) => setRetentionType(e.target.value as 'wow' | 'mom')}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  paddingRight: '40px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '10px',
                  fontSize: '14px',
                  backgroundColor: '#ffffff',
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  appearance: 'none',
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
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '10px'
              }}>
                Pemilihan Iklan Objective
              </label>
              <select
                value={objectiveType}
                onChange={(e) => setObjectiveType(e.target.value as 'ctwa' | 'cpas' | 'ctlptowa')}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  paddingRight: '40px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '10px',
                  fontSize: '14px',
                  backgroundColor: '#ffffff',
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  appearance: 'none',
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
                <option value="ctwa">CTWA</option>
                <option value="cpas">CPAS</option>
                <option value="ctlptowa">CTLP to WA</option>
              </select>
            </div>
          </div>
        </div>

        {/* Documentation Section */}
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
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <h2 style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '20px'
            }}>
              <i className="bi bi-file-earmark-text" style={{ marginRight: '8px' }}></i>
              Export Requirements & Documentation
            </h2>
            <button
              onClick={() => setShowDocumentation(!showDocumentation)}
              style={{
                padding: '10px 20px',
                backgroundColor: '#2B46BB',
                color: '#ffffff',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 6px -1px rgba(43, 70, 187, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1e35a0'
                e.currentTarget.style.transform = 'translateY(-1px)'
                e.currentTarget.style.boxShadow = '0 6px 8px -1px rgba(43, 70, 187, 0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#2B46BB'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(43, 70, 187, 0.2)'
              }}
            >
              {showDocumentation ? 'Hide' : 'Show'} Documentation
            </button>
          </div>

          {showDocumentation && (
            <div style={{ marginTop: '16px' }}>
              <div style={{
                backgroundColor: '#eff6ff',
                borderLeft: '4px solid #3b82f6',
                padding: '16px',
                borderRadius: '8px',
                marginBottom: '16px'
              }}>
                <h3 style={{
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '12px',
                  fontSize: '16px'
                }}>
                  Required Exports from Meta Ads Manager:
                </h3>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px'
                }}>
                  <div>
                    <h4 style={{
                      fontWeight: '600',
                      fontSize: '16px',
                      color: '#111827',
                      marginBottom: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <i className="bi bi-file-earmark-text" style={{ color: '#3b82f6' }}></i>
                      Main Export File (CSV Metrics):
                    </h4>
                    <div style={{
                      backgroundColor: '#f9fafb',
                      padding: '16px',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb'
                    }}>
                      <ul style={{
                        fontSize: '13px',
                        color: '#4b5563',
                        listStyle: 'none',
                        padding: 0,
                        margin: 0,
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                        gap: '6px'
                      }}>
                        {requirements.main.map((metric: string, idx: number) => (
                          <li key={idx} style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            marginBottom: '4px'
                          }}>
                            <span style={{ color: '#3b82f6', marginRight: '8px', fontSize: '12px' }}>•</span>
                            <span>{metric}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div>
                    <h4 style={{
                      fontWeight: '600',
                      fontSize: '16px',
                      color: '#111827',
                      marginBottom: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <i className="bi bi-files" style={{ color: '#3b82f6' }}></i>
                      Breakdown Export Files (with Required Metrics):
                    </h4>
                    <div style={{
                      fontSize: '14px',
                      color: '#4b5563',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                      gap: '12px'
                    }}>
                      {Object.entries(requirements.breakdown).map(([fileName, metrics]: [string, any]) => (
                        <div key={fileName} style={{
                          padding: '14px',
                          backgroundColor: '#ffffff',
                          borderRadius: '8px',
                          border: '1px solid #e5e7eb',
                          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                        }}>
                          <div style={{
                            fontWeight: '600',
                            color: '#111827',
                            marginBottom: '10px',
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}>
                            <i className="bi bi-file-earmark-spreadsheet" style={{ color: '#3b82f6', fontSize: '16px' }}></i>
                            {fileName}
                          </div>
                          <div style={{
                            fontSize: '11px',
                            color: '#6b7280',
                            marginBottom: '8px',
                            fontWeight: '500'
                          }}>
                            Required Metrics:
                          </div>
                          <ul style={{
                            fontSize: '11px',
                            color: '#4b5563',
                            listStyle: 'none',
                            padding: 0,
                            margin: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '3px'
                          }}>
                            {metrics.map((metric: string, idx: number) => (
                              <li key={idx} style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                padding: '2px 0'
                              }}>
                                <span style={{ color: '#3b82f6', marginRight: '6px', fontSize: '10px', marginTop: '2px' }}>▸</span>
                                <span style={{ lineHeight: '1.4' }}>{metric}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{
                backgroundColor: '#fef3c7',
                borderLeft: '4px solid #f59e0b',
                padding: '16px',
                borderRadius: '8px'
              }}>
                <h3 style={{
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '12px',
                  fontSize: '16px'
                }}>
                  <i className="bi bi-lightbulb" style={{ marginRight: '8px' }}></i>
                  Tips:
                </h3>
                <ul style={{
                  fontSize: '14px',
                  color: '#374151',
                  listStyle: 'none',
                  padding: 0,
                  margin: 0
                }}>
                  <li style={{ marginBottom: '4px' }}>• Export data untuk kedua periode (This Week/This Month dan Last Week/Last Month)</li>
                  <li style={{ marginBottom: '4px' }}>• Pastikan semua kolom metrik yang diperlukan ada di export</li>
                  <li style={{ marginBottom: '4px' }}>• File breakdown harus sesuai dengan dimensi yang dipilih (age, gender, region, dll)</li>
                  <li style={{ marginBottom: '4px' }}>• Format file harus CSV (Comma Separated Values)</li>
                </ul>
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
            fontSize: '22px',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '12px'
          }}>
            Upload CSV Files untuk {retentionType === 'wow' ? 'Week-on-Week' : 'Month-on-Month'} Analysis
          </h2>
          <p style={{
            fontSize: '15px',
            color: '#6b7280',
            marginBottom: '24px'
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
                fontSize: '15px',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '12px'
              }}>
                <i className="bi bi-calendar" style={{ marginRight: '8px', color: '#2B46BB' }}></i>
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
                    fontWeight: '500',
                    marginBottom: '8px'
                  }}>
                    <i className="bi bi-file-earmark" style={{ marginRight: '8px' }}></i>
                    Drag & Drop atau click untuk upload
                  </p>
                  <p style={{
                    fontSize: '14px',
                    color: '#6b7280'
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
                        justifyContent: 'space-between',
                        backgroundColor: '#f9fafb',
                        padding: '8px',
                        borderRadius: '6px',
                        marginBottom: '8px'
                      }}>
                        <span style={{
                          fontSize: '14px',
                          color: '#374151'
                        }}>
                          <i className="bi bi-check-circle" style={{ color: '#16a34a', marginRight: '8px' }}></i>
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
                            padding: '4px'
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
                fontSize: '15px',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '12px'
              }}>
                <i className="bi bi-calendar" style={{ marginRight: '8px', color: '#2B46BB' }}></i>
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
                    fontWeight: '500',
                    marginBottom: '8px'
                  }}>
                    <i className="bi bi-file-earmark" style={{ marginRight: '8px' }}></i>
                    Drag & Drop atau click untuk upload
                  </p>
                  <p style={{
                    fontSize: '14px',
                    color: '#6b7280'
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
                        justifyContent: 'space-between',
                        backgroundColor: '#f9fafb',
                        padding: '8px',
                        borderRadius: '6px',
                        marginBottom: '8px'
                      }}>
                        <span style={{
                          fontSize: '14px',
                          color: '#374151'
                        }}>
                          <i className="bi bi-check-circle" style={{ color: '#16a34a', marginRight: '8px' }}></i>
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
                            padding: '4px'
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
              fontSize: '16px',
              fontWeight: '600',
              padding: '14px 28px',
              borderRadius: '10px',
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
                padding: '14px 28px',
                backgroundColor: (isAnalyzing || filesThisWeek.length === 0 || filesLastWeek.length === 0) ? '#9ca3af' : '#000000',
                color: '#ffffff',
                borderRadius: '10px',
                fontWeight: '600',
                border: 'none',
                cursor: (isAnalyzing || filesThisWeek.length === 0 || filesLastWeek.length === 0) ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                transition: 'all 0.2s ease',
                boxShadow: (isAnalyzing || filesThisWeek.length === 0 || filesLastWeek.length === 0) ? 'none' : '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
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
              {isAnalyzing ? 'Analyzing...' : '1. Analyze CSV'}
            </button>

          {analysis && (
            <button
              onClick={handleGenerateReport}
              disabled={isGenerating}
              style={{
                padding: '14px 28px',
                backgroundColor: isGenerating ? '#9ca3af' : '#fbbf24',
                color: '#000000',
                borderRadius: '10px',
                fontWeight: '600',
                border: 'none',
                cursor: isGenerating ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                transition: 'all 0.2s ease',
                boxShadow: isGenerating ? 'none' : '0 4px 6px -1px rgba(251, 191, 36, 0.3)'
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
              {isGenerating ? 'Generating...' : '2. Generate HTML Report'}
            </button>
          )}

            {htmlReport && (
              <button
                onClick={handleDownloadPDF}
                disabled={isDownloadingPDF}
                style={{
                  padding: '14px 28px',
                backgroundColor: isDownloadingPDF ? '#9ca3af' : '#059669',
                color: '#ffffff',
                  borderRadius: '10px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: isDownloadingPDF ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  transition: 'all 0.2s ease',
                  boxShadow: isDownloadingPDF ? 'none' : '0 4px 6px -1px rgba(5, 150, 105, 0.3)'
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
                    <i className="bi bi-hourglass-split" style={{ marginRight: '8px' }}></i>
                    Downloading...
                  </>
                ) : (
                  <>
                    <i className="bi bi-download" style={{ marginRight: '8px' }}></i>
                    Download PDF
                  </>
                )}
              </button>
            )}

            {htmlReport && (
              <button
                onClick={handleNewAnalysis}
                style={{
                  padding: '14px 28px',
                  backgroundColor: '#7c3aed',
                  color: '#ffffff',
                  borderRadius: '10px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 6px -1px rgba(124, 58, 237, 0.3)'
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
                <i className="bi bi-arrow-clockwise" style={{ marginRight: '8px' }}></i>
                Analisa Data Baru
              </button>
            )}
          </div>
        </div>

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
                  fontWeight: '600',
                  margin: 0,
                  marginBottom: '4px',
                  fontSize: '16px'
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
          <div style={{
            backgroundColor: '#f0fdf4',
            borderLeft: '4px solid #16a34a',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '24px'
          }}>
            <p style={{
              color: '#15803d',
              fontWeight: '600',
              marginBottom: '8px'
            }}>
              <i className="bi bi-check-circle" style={{ marginRight: '8px' }}></i>
              Analysis Complete!
            </p>
            <div style={{
              marginTop: '8px',
              fontSize: '14px',
              color: '#16a34a'
            }}>
              <p>This Period: {analysis.summary?.thisWeek?.totalRows || analysis.summary?.thisWeek?.rows || 0} rows</p>
              <p>Last Period: {analysis.summary?.lastWeek?.totalRows || analysis.summary?.lastWeek?.rows || 0} rows</p>
              {((analysis.summary?.thisWeek?.breakdownFiles && analysis.summary.thisWeek.breakdownFiles > 0) || 
                (analysis.summary?.lastWeek?.breakdownFiles && analysis.summary.lastWeek.breakdownFiles > 0)) && (
                <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #86efac' }}>
                  <p style={{ fontWeight: '600', marginBottom: '4px' }}>Breakdown Files:</p>
                  <p style={{ fontSize: '12px', margin: '2px 0' }}>
                    This Period: {analysis.summary?.thisWeek?.breakdownFiles || 0} files 
                    ({analysis.summary?.thisWeek?.breakdownRows || 0} breakdown rows)
                  </p>
                  <p style={{ fontSize: '12px', margin: '2px 0' }}>
                    Last Period: {analysis.summary?.lastWeek?.breakdownFiles || 0} files 
                    ({analysis.summary?.lastWeek?.breakdownRows || 0} breakdown rows)
                  </p>
                  {analysis.summary?.thisWeek?.breakdownTypes && 
                   Array.isArray(analysis.summary.thisWeek.breakdownTypes) && 
                   analysis.summary.thisWeek.breakdownTypes.length > 0 && (
                    <p style={{ fontSize: '11px', marginTop: '4px', color: '#6b7280' }}>
                      Types: {analysis.summary.thisWeek.breakdownTypes
                        .map((type: string) => {
                          // Format breakdown type names nicely
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
                  )}
                  {analysis.summary?.lastWeek?.breakdownTypes && 
                   Array.isArray(analysis.summary.lastWeek.breakdownTypes) && 
                   analysis.summary.lastWeek.breakdownTypes.length > 0 &&
                   JSON.stringify(analysis.summary.lastWeek.breakdownTypes) !== JSON.stringify(analysis.summary.thisWeek.breakdownTypes) && (
                    <p style={{ fontSize: '11px', marginTop: '2px', color: '#6b7280' }}>
                      Last Period Types: {analysis.summary.lastWeek.breakdownTypes
                        .map((type: string) => {
                          return type
                            .replace(/-/g, ' ')
                            .replace(/\b\w/g, (l: string) => l.toUpperCase())
                        })
                        .join(', ')}
                    </p>
                  )}
                </div>
              )}
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

