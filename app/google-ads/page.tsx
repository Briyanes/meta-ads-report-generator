'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function GoogleAdsPage() {
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsScrolled(scrollPosition > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <button
              onClick={() => router.push('/home')}
              style={{
                color: '#4b5563',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                padding: '8px',
                borderRadius: '4px',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <i className="bi bi-arrow-left" style={{ marginRight: '4px' }}></i>
              Back to Home
            </button>
            <Link href="/home" style={{ textDecoration: 'none', cursor: 'pointer' }}>
              <div>
                <h1 className="responsive-header-title" style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: '#111827',
                  margin: 0,
                  marginBottom: '4px'
                }}>
                  Google Ads Report Generator
                </h1>
                <p className="responsive-header-subtitle" style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  margin: 0
                }}>
                  Powered by <span style={{ fontWeight: '600' }}>Hadona Digital Media</span>
                </p>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="header-spacer" style={{ height: '120px' }}></div>

      {/* Coming Soon Content */}
      <main className="responsive-container" style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '48px'
      }}>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          padding: '64px 48px',
          textAlign: 'center'
        }}>
          <div style={{
            width: '96px',
            height: '96px',
            backgroundColor: '#f0fdf4',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px auto',
            border: '3px solid #10b981',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
          }}>
            <i className="bi bi-google" style={{ fontSize: '48px', color: '#10b981' }}></i>
          </div>
          <h2 style={{
            fontSize: '36px',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '16px',
            margin: '0 0 16px 0'
          }}>
            Coming Soon
          </h2>
          <p style={{
            fontSize: '18px',
            color: '#6b7280',
            marginBottom: '32px',
            margin: '0 0 32px 0',
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto',
            lineHeight: '1.6'
          }}>
            We&apos;re working hard to bring you Google Ads reporting capabilities. Stay tuned for updates!
          </p>
          <div style={{
            display: 'inline-block',
            padding: '8px 16px',
            backgroundColor: '#f3f4f6',
            color: '#6b7280',
            borderRadius: '9999px',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '32px'
          }}>
            <i className="bi bi-clock" style={{ marginRight: '6px' }}></i>
            Under Development
          </div>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb',
            padding: '32px',
            marginBottom: '32px',
            textAlign: 'left',
            maxWidth: '600px',
            margin: '0 auto 32px auto'
          }}>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '16px',
              margin: '0 0 16px 0'
            }}>
              What to Expect
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              {[
                'Comprehensive Google Ads performance analytics',
                'AI-powered insights and recommendations',
                'Detailed campaign breakdowns and metrics',
                'Export to PDF functionality'
              ].map((item, idx) => (
                <li key={idx} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px'
                }}>
                  <i className="bi bi-check-circle" style={{ color: '#10b981', fontSize: '18px' }}></i>
                  <span style={{ color: '#4b5563', lineHeight: '1.6' }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <button
            onClick={() => router.push('/home')}
            style={{
              padding: '12px 24px',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              borderRadius: '8px',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#1e40af'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#2563eb'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <i className="bi bi-arrow-left"></i>
            Back to Home
          </button>
        </div>
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
