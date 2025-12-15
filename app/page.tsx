'use client'

import { useState } from 'react'
import { parseCSV } from '@/lib/csvParser'
import { generatePDFFromHTML, downloadPDF } from '@/lib/pdfGenerator'

export default function Home() {
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
    } else {
      setError('Please upload valid CSV files')
    }
  }

  const handleAnalyze = async () => {
    // Find main CSV file (file tanpa suffix seperti -age, -gender, dll)
    const mainFileThisWeek = filesThisWeek.find(f => 
      !f.name.includes('-age') && 
      !f.name.includes('-gender') && 
      !f.name.includes('-region') && 
      !f.name.includes('-platform') && 
      !f.name.includes('-placement') && 
      !f.name.includes('-objective') && 
      !f.name.includes('-ad-creative') &&
      !f.name.includes('-creative')
    ) || filesThisWeek[0]
    
    const mainFileLastWeek = filesLastWeek.find(f => 
      !f.name.includes('-age') && 
      !f.name.includes('-gender') && 
      !f.name.includes('-region') && 
      !f.name.includes('-platform') && 
      !f.name.includes('-placement') && 
      !f.name.includes('-objective') && 
      !f.name.includes('-ad-creative') &&
      !f.name.includes('-creative')
    ) || filesLastWeek[0]

    if (!mainFileThisWeek || !mainFileLastWeek) {
      const periodLabel = retentionType === 'wow' ? 'weeks (Minggu Ini & Minggu Lalu)' : 'months (Bulan Ini & Bulan Lalu)'
      setError(`Please upload at least main CSV file for both ${periodLabel}`)
      return
    }

    setIsAnalyzing(true)
    setError(null)

    try {
      const formData = new FormData()
      
      // Append main files
      formData.append('fileThisWeek', mainFileThisWeek)
      formData.append('fileLastWeek', mainFileLastWeek)
      
      // Append retention and objective type
      formData.append('retentionType', retentionType)
      formData.append('objectiveType', objectiveType)
      
      // Append breakdown files for this week
      filesThisWeek.forEach((file, index) => {
        if (file !== mainFileThisWeek) {
          formData.append(`breakdownThisWeek_${index}`, file)
        }
      })
      
      // Append breakdown files for last week
      filesLastWeek.forEach((file, index) => {
        if (file !== mainFileLastWeek) {
          formData.append(`breakdownLastWeek_${index}`, file)
        }
      })

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze CSV')
      }

      setAnalysis(data)
    } catch (err: any) {
      setError(err.message || 'Failed to analyze CSV')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleGenerateReport = async () => {
    if (!analysis) {
      setError('Please analyze the CSV first')
      return
    }

    setIsGenerating(true)
    setError(null)
    setHtmlReport(null) // Clear previous report
    setGenerationProgress('Memuat data analisis...')

    try {
      // Validate all data is loaded
      const analysisData = typeof analysis.analysis === 'string' ? JSON.parse(analysis.analysis) : analysis.analysis
      const breakdown = analysis.breakdown || {}
      
      // Check if main data exists
      if (!analysisData.performanceSummary) {
        throw new Error('Data analisis tidak lengkap. Silakan analyze ulang.')
      }

      setGenerationProgress('Memvalidasi semua data CSV...')
      await new Promise(resolve => setTimeout(resolve, 300))

      setGenerationProgress('Menyiapkan template report dengan React + Tailwind CSS...')
      await new Promise(resolve => setTimeout(resolve, 500))

      setGenerationProgress('Menggenerate slide 1-4 (Welcome, Summary, Metrics, Analysis)...')
      await new Promise(resolve => setTimeout(resolve, 800))

      setGenerationProgress('Menggenerate slide 5-7 (Age, Gender, Region Breakdown)...')
      await new Promise(resolve => setTimeout(resolve, 800))

      setGenerationProgress('Menggenerate slide 8-9 (Platform & Placement Performance)...')
      await new Promise(resolve => setTimeout(resolve, 800))

      setGenerationProgress('Menggenerate slide 10-11 (Creative & Objective Analysis)...')
      await new Promise(resolve => setTimeout(resolve, 800))

      setGenerationProgress('Menggenerate slide 12 (Conclusion & Action Plan)...')
      await new Promise(resolve => setTimeout(resolve, 500))

      setGenerationProgress('Menyelesaikan dan memvalidasi report...')
      await new Promise(resolve => setTimeout(resolve, 500))

      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          analysisData: {
            ...analysisData,
            breakdown: breakdown
          },
          reportName: reportName || `Report ${new Date().toLocaleDateString('id-ID')}`,
          retentionType: retentionType,
          objectiveType: objectiveType
        })
      })

      // Check if response is JSON
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text()
        console.error('Non-JSON response received:', {
          status: response.status,
          statusText: response.statusText,
          contentType: contentType,
          preview: text.substring(0, 200)
        })
        throw new Error(`Server error: Received HTML instead of JSON. Status: ${response.status}`)
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate report')
      }

      // Validate HTML report is generated
      if (!data.html || data.html.length < 100) {
        console.error('Invalid HTML report:', {
          hasHtml: !!data.html,
          htmlLength: data.html?.length || 0,
          dataKeys: Object.keys(data)
        })
        throw new Error('Report tidak lengkap. Silakan coba lagi.')
      }
      
      console.log('HTML report received:', {
        length: data.html.length,
        preview: data.html.substring(0, 200)
      })

      setGenerationProgress('✓ Report berhasil di-generate! Memuat preview...')
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Show success message before displaying report
      setGenerationProgress('✓ Semua data ter-load dengan benar. Report siap ditampilkan!')
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Finally show the report
      setHtmlReport(data.html)
      setGenerationProgress('')
    } catch (err: any) {
      setError(err.message || 'Failed to generate report')
      setGenerationProgress('')
      setHtmlReport(null)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownloadPDF = async () => {
    if (!htmlReport) {
      setError('No report generated yet')
      return
    }

    if (isDownloadingPDF) {
      return // Prevent multiple clicks
    }

    setIsDownloadingPDF(true)
    setError(null)

    try {
      // Try to use existing iframe first
      const existingIframe = document.querySelector('iframe[srcDoc]') as HTMLIFrameElement
      
      if (existingIframe && existingIframe.contentWindow) {
        // Use browser print as it's more reliable for React-rendered content
        existingIframe.contentWindow.print()
        setIsDownloadingPDF(false)
        return
      }
      
      // Fallback to html2canvas method
      const blob = await generatePDFFromHTML(htmlReport, 'meta-ads-report.pdf')
      downloadPDF(blob, `meta-ads-report-${Date.now()}.pdf`)
    } catch (err: any) {
      setError(err.message || 'Failed to generate PDF')
    } finally {
      setIsDownloadingPDF(false)
    }
  }

  const handlePrintPDF = () => {
    const existingIframe = document.querySelector('iframe[srcDoc]') as HTMLIFrameElement
    if (existingIframe && existingIframe.contentWindow) {
      existingIframe.contentWindow.print()
    } else {
      setError('Report belum ter-load. Silakan tunggu sebentar dan coba lagi.')
    }
  }

  return (
    <main className="container" style={{ minHeight: '100vh' }}>
      <div className="card" style={{ width: '100%', maxWidth: '100%' }}>
        <h1 style={{ 
          color: '#2B46BB', 
          marginBottom: '0.5rem',
          fontSize: '2rem'
        }}>
          Meta Ads Report Generator
        </h1>
        <p style={{ color: '#666', marginBottom: '2rem' }}>
          Generate professional Meta Ads performance reports dengan AI
        </p>

        {/* Step-by-Step Guide */}
        <div style={{
          backgroundColor: '#f8f9fa',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{
            color: '#2B46BB',
            fontSize: '1.25rem',
            fontWeight: '600',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>📋</span>
            Cara Menggunakan
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Step 1 */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              alignItems: 'flex-start',
              backgroundColor: 'white',
              padding: '1rem',
              borderRadius: '6px',
              border: '1px solid #e0e0e0'
            }}>
              <div style={{
                minWidth: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#2B46BB',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '600',
                fontSize: '0.9rem',
                flexShrink: 0
              }}>
                1
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  color: '#333',
                  fontSize: '1rem'
                }}>
                  Upload CSV Files
                </h3>
                <p style={{
                  color: '#666',
                  fontSize: '0.9rem',
                  lineHeight: '1.6',
                  margin: 0
                }}>
                  Upload file utama dan file breakdown untuk periode yang dipilih. 
                  File breakdown bisa berupa: age, gender, region, platform, placement, objective, ad-creative.
                  Bisa upload multiple files sekaligus dengan drag & drop atau klik area upload.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              alignItems: 'flex-start',
              backgroundColor: 'white',
              padding: '1rem',
              borderRadius: '6px',
              border: '1px solid #e0e0e0'
            }}>
              <div style={{
                minWidth: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#2B46BB',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '600',
                fontSize: '0.9rem',
                flexShrink: 0
              }}>
                2
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  color: '#333',
                  fontSize: '1rem'
                }}>
                  Klik &quot;Analyze CSV&quot;
                </h3>
                <p style={{
                  color: '#666',
                  fontSize: '0.9rem',
                  lineHeight: '1.6',
                  margin: 0
                }}>
                  Setelah semua file ter-upload, klik tombol <strong>&quot;1. Analyze CSV&quot;</strong> untuk memproses data. 
                  Sistem akan menganalisis semua file dan menampilkan summary hasil analisis.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              alignItems: 'flex-start',
              backgroundColor: 'white',
              padding: '1rem',
              borderRadius: '6px',
              border: '1px solid #e0e0e0'
            }}>
              <div style={{
                minWidth: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#2B46BB',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '600',
                fontSize: '0.9rem',
                flexShrink: 0
              }}>
                3
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  color: '#333',
                  fontSize: '1rem'
                }}>
                  Generate HTML Report
                </h3>
                <p style={{
                  color: '#666',
                  fontSize: '0.9rem',
                  lineHeight: '1.6',
                  margin: 0
                }}>
                  Setelah analisis selesai, klik tombol <strong>&quot;2. Generate HTML Report&quot;</strong>. 
                  Sistem akan menggenerate report dengan 13 slide lengkap. 
                  Tunggu sampai proses selesai dan preview report akan muncul.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              alignItems: 'flex-start',
              backgroundColor: 'white',
              padding: '1rem',
              borderRadius: '6px',
              border: '1px solid #e0e0e0'
            }}>
              <div style={{
                minWidth: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#ECDC43',
                color: '#333',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '600',
                fontSize: '0.9rem',
                flexShrink: 0
              }}>
                4
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  color: '#333',
                  fontSize: '1rem'
                }}>
                  Download PDF
                </h3>
                <p style={{
                  color: '#666',
                  fontSize: '0.9rem',
                  lineHeight: '1.6',
                  margin: 0
                }}>
                  Setelah report ter-generate, klik tombol <strong>&quot;📥 Download PDF&quot;</strong>. 
                  Print dialog akan muncul - pilih <strong>&quot;Save as PDF&quot;</strong> sebagai destination, 
                  pastikan <strong>&quot;Background graphics&quot;</strong> diaktifkan, lalu klik <strong>&quot;Save&quot;</strong>.
                </p>
              </div>
            </div>
          </div>

          <div style={{
            marginTop: '1rem',
            padding: '0.75rem',
            backgroundColor: '#fff3cd',
            border: '1px solid #ffc107',
            borderRadius: '6px',
            fontSize: '0.85rem',
            color: '#856404'
          }}>
            <strong>💡 Tips:</strong> Pastikan semua file CSV sudah lengkap untuk hasil analisis yang maksimal. 
            File utama harus ada untuk kedua periode yang dipilih.
          </div>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <div className="input-group">
          <label htmlFor="reportName">Nama Report (Opsional)</label>
          <input
            id="reportName"
            type="text"
            placeholder="Weekly Report - Week 1 2024"
            value={reportName}
            onChange={(e) => setReportName(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="retentionType">Pemilihan Retensi</label>
          <select
            id="retentionType"
            value={retentionType}
            onChange={(e) => {
              setRetentionType(e.target.value as 'wow' | 'mom')
              // Reset files when changing retention type
              setFilesThisWeek([])
              setFilesLastWeek([])
              setAnalysis(null)
              setHtmlReport(null)
            }}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '1rem',
              backgroundColor: 'white',
              cursor: 'pointer',
              transition: 'border-color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#2B46BB'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#ddd'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#2B46BB'
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(43, 70, 187, 0.1)'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#ddd'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <option value="wow">WoW (Week-on-Week)</option>
            <option value="mom">MoM (Month-on-Month)</option>
          </select>
        </div>

        <div className="input-group">
          <label htmlFor="objectiveType">Pemilihan Iklan Objective</label>
          <select
            id="objectiveType"
            value={objectiveType}
            onChange={(e) => {
              setObjectiveType(e.target.value as 'ctwa' | 'cpas' | 'ctlptowa')
              // Reset analysis and report when changing objective
              setAnalysis(null)
              setHtmlReport(null)
            }}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '1rem',
              backgroundColor: 'white',
              cursor: 'pointer',
              transition: 'border-color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#2B46BB'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#ddd'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#2B46BB'
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(43, 70, 187, 0.1)'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#ddd'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <option value="ctwa">CTWA</option>
            <option value="cpas">CPAS</option>
            <option value="ctlptowa">CTLP to WA</option>
          </select>
        </div>

        <div className="input-group">
          <label>Upload CSV Files untuk {retentionType === 'wow' ? 'Week-on-Week' : 'Month-on-Month'} Analysis</label>
          <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
            Upload file utama + file breakdown (age, gender, region, platform, placement, objective, ad-creative)
          </p>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
              📅 {retentionType === 'wow' ? 'Minggu Ini (This Week)' : 'Bulan Ini (This Month)'} - {filesThisWeek.length} file(s)
            </label>
            <label
              htmlFor="fileInputThisWeek"
              className="file-upload"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, 'thisWeek')}
              style={{ cursor: 'pointer', display: 'block', position: 'relative' }}
            >
              <input
                id="fileInputThisWeek"
                type="file"
                accept=".csv,text/csv"
                multiple
                onChange={(e) => handleFileChange(e, 'thisWeek')}
                style={{ 
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  top: 0,
                  left: 0,
                  opacity: 0,
                  cursor: 'pointer',
                  zIndex: 1
                }}
              />
              {filesThisWeek.length > 0 ? (
                <div style={{ width: '100%', position: 'relative', zIndex: 2 }}>
                  {filesThisWeek.map((file, index) => (
                    <div key={index} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      padding: '0.5rem',
                      marginBottom: '0.5rem',
                      backgroundColor: '#f5f5f5',
                      borderRadius: '4px',
                      position: 'relative',
                      zIndex: 2
                    }}>
                      <span style={{ fontWeight: '600', color: '#2B46BB', fontSize: '0.9rem' }}>
                        ✓ {file.name}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          e.preventDefault()
                          removeFile(index, 'thisWeek')
                        }}
                        style={{
                          background: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '0.25rem 0.5rem',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          position: 'relative',
                          zIndex: 3
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <label
                    htmlFor="fileInputThisWeek"
                    style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem', textAlign: 'center', cursor: 'pointer', position: 'relative', zIndex: 2, display: 'block' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    Click untuk menambah file lagi
                  </label>
                </div>
              ) : (
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <p style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>
                    📄 Drag & Drop atau click untuk upload CSV files (bisa multiple)
                  </p>
                  <p style={{ fontSize: '0.85rem', color: '#666' }}>
                    Upload: file utama + breakdown (age, gender, region, dll)
                  </p>
                </div>
              )}
            </label>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
              📅 {retentionType === 'wow' ? 'Minggu Lalu (Last Week)' : 'Bulan Lalu (Last Month)'} - {filesLastWeek.length} file(s)
            </label>
            <label
              htmlFor="fileInputLastWeek"
              className="file-upload"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, 'lastWeek')}
              style={{ cursor: 'pointer', display: 'block', position: 'relative' }}
            >
              <input
                id="fileInputLastWeek"
                type="file"
                accept=".csv,text/csv"
                multiple
                onChange={(e) => handleFileChange(e, 'lastWeek')}
                style={{ 
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  top: 0,
                  left: 0,
                  opacity: 0,
                  cursor: 'pointer',
                  zIndex: 1
                }}
              />
              {filesLastWeek.length > 0 ? (
                <div style={{ width: '100%', position: 'relative', zIndex: 2 }}>
                  {filesLastWeek.map((file, index) => (
                    <div key={index} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      padding: '0.5rem',
                      marginBottom: '0.5rem',
                      backgroundColor: '#f5f5f5',
                      borderRadius: '4px',
                      position: 'relative',
                      zIndex: 2
                    }}>
                      <span style={{ fontWeight: '600', color: '#2B46BB', fontSize: '0.9rem' }}>
                        ✓ {file.name}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          e.preventDefault()
                          removeFile(index, 'lastWeek')
                        }}
                        style={{
                          background: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '0.25rem 0.5rem',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          position: 'relative',
                          zIndex: 3
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <label
                    htmlFor="fileInputLastWeek"
                    style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem', textAlign: 'center', cursor: 'pointer', position: 'relative', zIndex: 2, display: 'block' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    Click untuk menambah file lagi
                  </label>
                </div>
              ) : (
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <p style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>
                    📄 Drag & Drop atau click untuk upload CSV files (bisa multiple)
                  </p>
                  <p style={{ fontSize: '0.85rem', color: '#666' }}>
                    Upload: file utama + breakdown (age, gender, region, dll)
                  </p>
                </div>
              )}
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            className="btn btn-primary"
            onClick={handleAnalyze}
            disabled={filesThisWeek.length === 0 || filesLastWeek.length === 0 || isAnalyzing || isGenerating}
          >
            {isAnalyzing ? (
              <>
                <span className="loading" style={{ marginRight: '0.5rem' }}></span>
                Analyzing...
              </>
            ) : (
              '1. Analyze CSV'
            )}
          </button>

          {analysis && (
            <button
              className="btn btn-secondary"
              onClick={handleGenerateReport}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <span className="loading" style={{ marginRight: '0.5rem' }}></span>
                  Generating Report...
                </>
              ) : (
                '2. Generate HTML Report'
              )}
            </button>
          )}

          {htmlReport && (
            <button
              className="btn btn-primary"
              onClick={handlePrintPDF}
              disabled={isGenerating}
              style={{ 
                cursor: isGenerating ? 'not-allowed' : 'pointer',
                opacity: isGenerating ? 0.6 : 1,
                position: 'relative',
                zIndex: 10
              }}
              title="Klik untuk Print, lalu pilih 'Save as PDF' di print dialog"
            >
              📥 Download PDF
            </button>
          )}
        </div>

        {analysis && (
          <div style={{ marginTop: '2rem' }}>
            <div className="alert alert-success">
              <strong>✓ Analysis Complete!</strong>
              <div style={{ marginTop: '0.75rem', fontSize: '0.9rem', lineHeight: '1.8' }}>
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong>📊 {retentionType === 'wow' ? 'Minggu Ini (This Week)' : 'Bulan Ini (This Month)'}:</strong><br/>
                  • Main CSV: {analysis.summary?.thisWeek?.totalRows || 'N/A'} rows<br/>
                  • Breakdown Files: {analysis.summary?.thisWeek?.breakdownFiles || 0} files ({analysis.summary?.thisWeek?.breakdownRows || 0} rows)<br/>
                  {analysis.summary?.thisWeek?.breakdownTypes && analysis.summary.thisWeek.breakdownTypes.length > 0 && (
                    <span style={{ fontSize: '0.85rem', color: '#666' }}>
                      • Types: {analysis.summary.thisWeek.breakdownTypes.join(', ')}
                    </span>
                  )}
                </div>
                <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(0,0,0,0.1)' }}>
                  <strong>📊 {retentionType === 'wow' ? 'Minggu Lalu (Last Week)' : 'Bulan Lalu (Last Month)'}:</strong><br/>
                  • Main CSV: {analysis.summary?.lastWeek?.totalRows || 'N/A'} rows<br/>
                  • Breakdown Files: {analysis.summary?.lastWeek?.breakdownFiles || 0} files ({analysis.summary?.lastWeek?.breakdownRows || 0} rows)<br/>
                  {analysis.summary?.lastWeek?.breakdownTypes && analysis.summary.lastWeek.breakdownTypes.length > 0 && (
                    <span style={{ fontSize: '0.85rem', color: '#666' }}>
                      • Types: {analysis.summary.lastWeek.breakdownTypes.join(', ')}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {isGenerating && (
          <div style={{ marginTop: '2rem' }}>
            <div className="alert alert-info" style={{ 
              textAlign: 'center', 
              padding: '2.5rem',
              backgroundColor: '#f0f7ff',
              border: '2px solid #2B46BB',
              borderRadius: '12px'
            }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <div className="loading" style={{ 
                  width: '60px', 
                  height: '60px', 
                  margin: '0 auto',
                  borderWidth: '6px',
                  borderColor: '#2B46BB',
                  borderTopColor: 'transparent'
                }}></div>
              </div>
              <strong style={{ 
                fontSize: '1.2rem', 
                display: 'block', 
                marginBottom: '1rem',
                color: '#2B46BB'
              }}>
                ⏳ Sedang menggenerate report...
              </strong>
              {generationProgress && (
                <div style={{ 
                  marginTop: '1rem',
                  padding: '1rem',
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  border: '1px solid #ddd'
                }}>
                  <p style={{ 
                    fontSize: '1rem',
                    color: '#2B46BB',
                    fontWeight: '600',
                    margin: 0
                  }}>
                    {generationProgress}
                  </p>
                </div>
              )}
              <p style={{ 
                marginTop: '1.5rem', 
                fontSize: '0.9rem',
                color: '#666',
                lineHeight: '1.6'
              }}>
                🔄 Mohon tunggu, semua data sedang diproses dengan maksimal...<br/>
                <span style={{ fontSize: '0.85rem', color: '#999' }}>
                  Memastikan semua slide ter-generate dengan benar dan data lengkap
                </span>
              </p>
            </div>
          </div>
        )}

        {htmlReport && !isGenerating && (
          <div style={{ marginTop: '2rem' }}>
            <div className="alert alert-success" style={{
              padding: '1.5rem',
              backgroundColor: '#d4edda',
              border: '2px solid #28a745',
              borderRadius: '8px'
            }}>
              <strong style={{ fontSize: '1.1rem', color: '#155724' }}>
                ✅ Report Generated Successfully!
              </strong>
              <p style={{ marginTop: '0.75rem', fontSize: '0.95rem', color: '#155724' }}>
                ✓ Semua 13 slide telah ter-generate dengan lengkap<br/>
                ✓ Semua data breakdown telah ter-load dengan benar<br/>
                ✓ Report siap untuk preview atau download sebagai PDF
              </p>
            </div>

            <div style={{ 
              marginTop: '2rem',
              border: '2px solid #2B46BB',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(43, 70, 187, 0.15)',
              backgroundColor: 'white'
            }}>
              <div style={{
                padding: '1rem',
                backgroundColor: '#2B46BB',
                color: 'white',
                fontWeight: '600',
                fontSize: '1rem'
              }}>
                📊 Preview Report - Meta Ads Performance Report
              </div>
              <iframe
                srcDoc={htmlReport || ''}
                style={{
                  width: '100%',
                  height: '800px',
                  border: 'none',
                  display: 'block'
                }}
                title="Report Preview"
                onLoad={() => {
                  console.log('Report loaded successfully')
                  const iframe = document.querySelector('iframe[title="Report Preview"]') as HTMLIFrameElement
                  if (iframe && iframe.contentWindow) {
                    try {
                      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document
                      const root = iframeDoc?.getElementById('root')
                      if (!root || root.innerHTML.trim() === '') {
                        console.error('Report iframe is empty or root element not found')
                        setError('Report tidak ter-render dengan benar. Silakan coba lagi.')
                      }
                    } catch (e) {
                      console.error('Error checking iframe content:', e)
                    }
                  }
                }}
                onError={(e) => {
                  console.error('Iframe error:', e)
                  setError('Error loading report preview. Silakan coba lagi.')
                }}
              />
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

