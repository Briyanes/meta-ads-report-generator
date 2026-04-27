'use client'

import { useState, useEffect, useRef } from 'react'

interface ReportPreviewProps {
  htmlReport: string
}

export default function ReportPreview({ htmlReport }: ReportPreviewProps) {
  const [isInView, setIsInView] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Immediately load the report since user has scrolled to this section
    const timer = setTimeout(() => {
      setIsInView(true)
    }, 100)

    // Also use IntersectionObserver as backup
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: '200px',
        threshold: 0.1
      }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [])

  const handleIframeLoad = () => {
    setIsLoaded(true)
  }

  // Show loading state if htmlReport is empty
  if (!htmlReport || htmlReport.length < 100) {
    return (
      <div className="responsive-card" style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        border: 'none',
        padding: '32px'
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
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#f9fafb',
          minHeight: '600px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            textAlign: 'center',
            color: '#9ca3af',
            padding: '40px'
          }}>
            <i className="bi bi-hourglass" style={{
              fontSize: '48px',
              marginBottom: '16px',
              display: 'block'
            }} />
            <p style={{
              fontSize: '14px',
              fontWeight: '500'
            }}>
              Waiting for report generation...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="responsive-card" ref={containerRef} style={{
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
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#f9fafb',
        minHeight: '600px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {!isInView ? (
          <div style={{
            textAlign: 'center',
            color: '#9ca3af',
            padding: '40px'
          }}>
            <i className="bi bi-eye" style={{
              fontSize: '48px',
              marginBottom: '16px',
              display: 'block'
            }} />
            <p style={{
              fontSize: '14px',
              fontWeight: '500'
            }}>
              Loading preview...
            </p>
          </div>
        ) : (
          <iframe
            ref={iframeRef}
            srcDoc={htmlReport}
            onLoad={handleIframeLoad}
            style={{
              width: '100%',
              height: '600px',
              border: 'none',
              opacity: isLoaded ? 1 : 0.5,
              transition: 'opacity 0.3s ease'
            }}
            title="Report Preview"
          />
        )}
      </div>
    </div>
  )
}
