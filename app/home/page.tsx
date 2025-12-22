'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function HomePage() {
  const router = useRouter()
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [openFaqs, setOpenFaqs] = useState<Set<number>>(new Set())
  const [isScrolled, setIsScrolled] = useState(false)
  
  const toggleFaq = (index: number) => {
    setOpenFaqs(prev => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsScrolled(scrollPosition > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const platforms = [
    {
      id: 'meta',
      name: 'Meta Ads',
      description: 'Generate comprehensive Meta Ads performance reports with detailed analytics',
      logo: '/logo/meta.png',
      color: 'linear-gradient(135deg, #0084FF 0%, #0066CC 100%)',
      available: true,
      route: '/meta-ads'
    },
    {
      id: 'google',
      name: 'Google Ads',
      description: 'Google Ads reporting dashboard (Coming Soon)',
      logo: '/logo/google.png',
      color: 'linear-gradient(135deg, #4285F4 0%, #1a73e8 100%)',
      available: false,
      route: null
    },
    {
      id: 'tiktok',
      name: 'TikTok Ads',
      description: 'TikTok Ads reporting dashboard (Coming Soon)',
      logo: '/logo/tiktok.png',
      color: 'linear-gradient(135deg, #000000 0%, #333333 100%)',
      available: false,
      route: null
    }
  ]

  const handlePlatformClick = (platform: typeof platforms[0]) => {
    if (platform.available && platform.route) {
      router.push(platform.route)
    }
  }

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
          <div>
            <h1 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#111827',
              margin: 0,
              marginBottom: '4px'
            }}>
              Ads Report Generator
            </h1>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              margin: 0
            }}>
              Powered by <span style={{ fontWeight: '600' }}>Hadona Digital Media</span>
            </p>
          </div>
          <div style={{
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

      {/* Main Content */}
      <main className="responsive-container" style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '48px'
      }}>
        {/* Hero Section */}
        <div className="responsive-hero" style={{
          textAlign: 'center',
          marginBottom: '64px',
          padding: '64px 32px',
          background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)',
          borderRadius: '16px',
          border: '1px solid #e0f2fe'
        }}>
          <h1 className="hero-title" style={{
            fontSize: '56px',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '24px',
            margin: '0 0 24px 0',
            lineHeight: '1.2'
          }}>
            Generate Professional<br />
            <span style={{ color: '#2563eb' }}> Advertising Reports</span> in Minutes
          </h1>
          <p style={{
            fontSize: '20px',
            color: '#4b5563',
            maxWidth: '700px',
            margin: '0 auto 32px auto',
            lineHeight: '1.6'
          }}>
            Transform your raw advertising data into comprehensive, presentation-ready reports with AI-powered analytics. No manual work required.
          </p>
          <div className="responsive-hero-buttons" style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => router.push('/meta-ads')}
              style={{
                padding: '16px 32px',
                fontSize: '18px',
                fontWeight: '600',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.3)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1e40af'
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 12px 20px -3px rgba(37, 99, 235, 0.4)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#2563eb'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(37, 99, 235, 0.3)'
              }}
            >
              <i className="bi bi-rocket-takeoff" style={{ marginRight: '8px' }}></i>Start Generating Reports
            </button>
            <button
              onClick={() => {
                const workflowSection = document.getElementById('how-it-works')
                workflowSection?.scrollIntoView({ behavior: 'smooth' })
              }}
              style={{
                padding: '16px 32px',
                fontSize: '18px',
                fontWeight: '600',
                backgroundColor: '#ffffff',
                color: '#2563eb',
                borderRadius: '12px',
                border: '2px solid #2563eb',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#eff6ff'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <i className="bi bi-info-circle" style={{ marginRight: '8px' }}></i>Learn More
            </button>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="responsive-statistics" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '24px',
          marginBottom: '64px'
        }}>
          <div style={{
            textAlign: 'center',
            padding: '24px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: '#2563eb',
              marginBottom: '8px'
            }}>
              13+
            </div>
            <div style={{
              fontSize: '16px',
              color: '#4b5563',
              fontWeight: '600'
            }}>
              Professional Slides
            </div>
          </div>
          <div style={{
            textAlign: 'center',
            padding: '24px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: '#10b981',
              marginBottom: '8px'
            }}>
              <i className="bi bi-clock" style={{ fontSize: '40px' }}></i>
            </div>
            <div style={{
              fontSize: '16px',
              color: '#4b5563',
              fontWeight: '600'
            }}>
              Generate in Minutes
            </div>
          </div>
          <div style={{
            textAlign: 'center',
            padding: '24px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: '#9333ea',
              marginBottom: '8px'
            }}>
              <i className="bi bi-robot" style={{ fontSize: '40px' }}></i>
            </div>
            <div style={{
              fontSize: '16px',
              color: '#4b5563',
              fontWeight: '600'
            }}>
              AI-Powered Analysis
            </div>
          </div>
          <div style={{
            textAlign: 'center',
            padding: '24px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: '#f59e0b',
              marginBottom: '8px'
            }}>
              100%
            </div>
            <div style={{
              fontSize: '16px',
              color: '#4b5563',
              fontWeight: '600'
            }}>
              Automated Process
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 className="responsive-platform-title" style={{
            fontSize: '40px',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '16px',
            margin: '0 0 16px 0',
            lineHeight: '1.2'
          }}>
            Choose Your Advertising Platform
          </h2>
          <p className="cta-description-single-line" style={{
            fontSize: '18px',
            color: '#4b5563',
            maxWidth: '800px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Generate comprehensive performance reports for your advertising campaigns with AI-powered analytics
          </p>
        </div>

        {/* Platform Cards */}
        <div className="responsive-grid-3" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '32px',
          marginBottom: '48px'
        }}>
          {platforms.map((platform) => (
            <div
              key={platform.id}
              onClick={() => handlePlatformClick(platform)}
              onMouseEnter={() => setHoveredCard(platform.id)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                position: 'relative',
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                boxShadow: hoveredCard === platform.id && platform.available
                  ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                  : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                border: '2px solid',
                borderColor: platform.available
                  ? hoveredCard === platform.id ? '#60a5fa' : '#e5e7eb'
                  : '#e5e7eb',
                cursor: platform.available ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s ease',
                transform: hoveredCard === platform.id && platform.available ? 'translateY(-4px) scale(1.02)' : 'translateY(0) scale(1)',
                opacity: platform.available ? 1 : 0.75
              }}
            >
              {/* Badge */}
              {!platform.available && (
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px'
                }}>
                  <span style={{
                    padding: '4px 12px',
                    backgroundColor: '#f3f4f6',
                    color: '#4b5563',
                    fontSize: '12px',
                    fontWeight: '600',
                    borderRadius: '9999px'
                  }}>
                    Coming Soon
                  </span>
                </div>
              )}

              <div style={{ padding: '32px' }}>
                {/* Logo */}
                <div style={{
                  width: '80px',
                  height: '80px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                  margin: '0 auto 16px auto',
                  opacity: platform.available ? 1 : 0.6
                }}>
                  <Image
                    src={platform.logo}
                    alt={`${platform.name} logo`}
                    width={64}
                    height={64}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      filter: platform.id === 'tiktok' && !platform.available ? 'grayscale(100%)' : 'none'
                    }}
                  />
                </div>

                {/* Title */}
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#111827',
                  marginBottom: '12px',
                  textAlign: 'center',
                  margin: '0 0 12px 0'
                }}>
                  {platform.name}
                </h3>

                {/* Description */}
                <p style={{
                  color: '#4b5563',
                  textAlign: 'center',
                  marginBottom: '24px',
                  lineHeight: '1.6',
                  margin: '0 0 24px 0'
                }}>
                  {platform.description}
                </p>

                {/* Action Button */}
                <button
                  disabled={!platform.available}
                  onClick={(e) => {
                    e.stopPropagation()
                    if (platform.available && platform.route) {
                      router.push(platform.route)
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    transition: 'all 0.2s ease',
                    cursor: platform.available ? 'pointer' : 'not-allowed',
                    background: platform.available ? platform.color : '#e5e7eb',
                    color: platform.available ? '#ffffff' : '#9ca3af',
                    border: 'none',
                    fontSize: '16px',
                    boxShadow: platform.available && hoveredCard === platform.id
                      ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                      : 'none',
                    transform: platform.available && hoveredCard === platform.id ? 'scale(1.05)' : 'scale(1)'
                  }}
                >
                  {platform.available ? 'Get Started' : 'Coming Soon'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Workflow Section */}
        <div id="how-it-works" className="responsive-section" style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          padding: '28px',
          border: '1px solid #e5e7eb',
          marginBottom: '48px'
        }}>
          <h3 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '8px',
            textAlign: 'center',
            margin: '0 0 8px 0'
          }}>
            How It Works
          </h3>
          <p style={{
            fontSize: '16px',
            color: '#6b7280',
            textAlign: 'center',
            marginBottom: '40px',
            margin: '0 0 40px 0'
          }}>
            Simple workflow to generate professional advertising performance reports
          </p>
          
          <div className="responsive-workflow" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            {/* Step 1: Upload Manual */}
            <div style={{
              textAlign: 'center',
              position: 'relative',
              flex: '1',
              minWidth: '200px'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                backgroundColor: '#eff6ff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
                border: '3px solid #3b82f6',
                position: 'relative'
              }}>
                <i className="bi bi-cloud-upload" style={{ fontSize: '32px', color: '#2563eb' }}></i>
                <div style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  width: '28px',
                  height: '28px',
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  border: '2px solid #ffffff'
                }}>
                  1
                </div>
              </div>
              <h4 style={{
                fontWeight: '600',
                color: '#111827',
                marginBottom: '8px',
                margin: '0 0 8px 0',
                fontSize: '18px'
              }}>
                Upload Manual
              </h4>
              <p style={{
                fontSize: '14px',
                color: '#4b5563',
                margin: 0,
                lineHeight: '1.6'
              }}>
                Upload your CSV export files from Meta Ads Manager (main data + breakdown files)
              </p>
            </div>

            {/* Arrow */}
            <div className="arrow" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flex: '0 0 auto',
              padding: '0 8px'
            }}>
              <i className="bi bi-arrow-right" style={{ fontSize: '24px', color: '#3b82f6' }}></i>
            </div>

            {/* Step 2: Z AI Analyst */}
            <div style={{
              textAlign: 'center',
              position: 'relative',
              flex: '1',
              minWidth: '200px'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                backgroundColor: '#f0fdf4',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
                border: '3px solid #10b981',
                position: 'relative'
              }}>
                <i className="bi bi-robot" style={{ fontSize: '32px', color: '#059669' }}></i>
                <div style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  width: '28px',
                  height: '28px',
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  border: '2px solid #ffffff'
                }}>
                  2
                </div>
              </div>
              <h4 style={{
                fontWeight: '600',
                color: '#111827',
                marginBottom: '8px',
                margin: '0 0 8px 0',
                fontSize: '18px'
              }}>
                AI Analyst Performance
              </h4>
              <p style={{
                fontSize: '14px',
                color: '#4b5563',
                margin: 0,
                lineHeight: '1.6'
              }}>
                Z AI analyzes your ad performance data, identifies trends, and generates insights
              </p>
            </div>

            {/* Arrow */}
            <div className="arrow" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flex: '0 0 auto',
              padding: '0 8px'
            }}>
              <i className="bi bi-arrow-right" style={{ fontSize: '24px', color: '#3b82f6' }}></i>
            </div>

            {/* Step 3: Generate Report HTML */}
            <div style={{
              textAlign: 'center',
              position: 'relative',
              flex: '1',
              minWidth: '200px'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                backgroundColor: '#fef3c7',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
                border: '3px solid #f59e0b',
                position: 'relative'
              }}>
                <i className="bi bi-file-earmark-text" style={{ fontSize: '32px', color: '#d97706' }}></i>
                <div style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  width: '28px',
                  height: '28px',
                  backgroundColor: '#f59e0b',
                  color: '#ffffff',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  border: '2px solid #ffffff'
                }}>
                  3
                </div>
              </div>
              <h4 style={{
                fontWeight: '600',
                color: '#111827',
                marginBottom: '8px',
                margin: '0 0 8px 0',
                fontSize: '18px'
              }}>
                Generate Report HTML
              </h4>
              <p style={{
                fontSize: '14px',
                color: '#4b5563',
                margin: 0,
                lineHeight: '1.6'
              }}>
                System generates comprehensive HTML report with 13+ slides including metrics, breakdowns, and recommendations
              </p>
            </div>

            {/* Arrow */}
            <div className="arrow" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flex: '0 0 auto',
              padding: '0 8px'
            }}>
              <i className="bi bi-arrow-right" style={{ fontSize: '24px', color: '#3b82f6' }}></i>
            </div>

            {/* Step 4: Save PDF */}
            <div style={{
              textAlign: 'center',
              position: 'relative',
              flex: '1',
              minWidth: '200px'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                backgroundColor: '#fce7f3',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
                border: '3px solid #ec4899',
                position: 'relative'
              }}>
                <i className="bi bi-file-pdf" style={{ fontSize: '32px', color: '#db2777' }}></i>
                <div style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  width: '28px',
                  height: '28px',
                  backgroundColor: '#ec4899',
                  color: '#ffffff',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  border: '2px solid #ffffff'
                }}>
                  4
                </div>
              </div>
              <h4 style={{
                fontWeight: '600',
                color: '#111827',
                marginBottom: '8px',
                margin: '0 0 8px 0',
                fontSize: '18px'
              }}>
                Save PDF
              </h4>
              <p style={{
                fontSize: '14px',
                color: '#4b5563',
                margin: 0,
                lineHeight: '1.6'
              }}>
                Download your professional report as PDF, ready for presentation and sharing with stakeholders
              </p>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="responsive-section" style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          padding: '28px',
          border: '1px solid #e5e7eb',
          marginBottom: '48px'
        }}>
          <h3 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '8px',
            textAlign: 'center',
            margin: '0 0 8px 0'
          }}>
            Why Choose Our Report Generator?
          </h3>
          <p style={{
            fontSize: '16px',
            color: '#6b7280',
            textAlign: 'center',
            marginBottom: '40px',
            margin: '0 0 40px 0'
          }}>
            Save time, impress clients, and make data-driven decisions with our AI-powered reporting tool
          </p>
          <div className="responsive-benefits" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '24px'
          }}>
            <div style={{
              display: 'flex',
              gap: '16px',
              padding: '24px',
              backgroundColor: '#f9fafb',
              borderRadius: '12px',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#dbeafe',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <i className="bi bi-clock-history" style={{ fontSize: '24px', color: '#2563eb' }}></i>
              </div>
              <div>
                <h4 style={{
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '8px',
                  margin: '0 0 8px 0',
                  fontSize: '18px'
                }}>
                  Save Hours of Manual Work
                </h4>
                <p style={{
                  fontSize: '14px',
                  color: '#4b5563',
                  margin: 0,
                  lineHeight: '1.6'
                }}>
                  No more spending hours creating reports manually. Generate professional reports in minutes, not days.
                </p>
              </div>
            </div>
            <div style={{
              display: 'flex',
              gap: '16px',
              padding: '24px',
              backgroundColor: '#f9fafb',
              borderRadius: '12px',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#d1fae5',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <i className="bi bi-award" style={{ fontSize: '24px', color: '#10b981' }}></i>
              </div>
              <div>
                <h4 style={{
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '8px',
                  margin: '0 0 8px 0',
                  fontSize: '18px'
                }}>
                  Professional Presentation-Ready Reports
                </h4>
                <p style={{
                  fontSize: '14px',
                  color: '#4b5563',
                  margin: 0,
                  lineHeight: '1.6'
                }}>
                  Impress your clients with beautifully designed reports that include comprehensive analytics and insights.
                </p>
              </div>
            </div>
            <div style={{
              display: 'flex',
              gap: '16px',
              padding: '24px',
              backgroundColor: '#f9fafb',
              borderRadius: '12px',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#f3e8ff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <i className="bi bi-lightbulb" style={{ fontSize: '24px', color: '#9333ea' }}></i>
              </div>
              <div>
                <h4 style={{
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '8px',
                  margin: '0 0 8px 0',
                  fontSize: '18px'
                }}>
                  AI-Powered Insights
                </h4>
                <p style={{
                  fontSize: '14px',
                  color: '#4b5563',
                  margin: 0,
                  lineHeight: '1.6'
                }}>
                  Get intelligent analysis and recommendations powered by advanced AI to optimize your campaigns.
                </p>
              </div>
            </div>
            <div style={{
              display: 'flex',
              gap: '16px',
              padding: '24px',
              backgroundColor: '#f9fafb',
              borderRadius: '12px',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#fef3c7',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <i className="bi bi-file-pdf" style={{ fontSize: '24px', color: '#f59e0b' }}></i>
              </div>
              <div>
                <h4 style={{
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '8px',
                  margin: '0 0 8px 0',
                  fontSize: '18px'
                }}>
                  Ready for Presentation
                </h4>
                <p style={{
                  fontSize: '14px',
                  color: '#4b5563',
                  margin: 0,
                  lineHeight: '1.6'
                }}>
                  Download reports as PDF and share with stakeholders immediately. No additional editing needed.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Use Cases Section */}
        <div className="responsive-section" style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          padding: '28px',
          border: '1px solid #e5e7eb',
          marginBottom: '48px'
        }}>
          <h3 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '8px',
            textAlign: 'center',
            margin: '0 0 8px 0'
          }}>
            Perfect For
          </h3>
          <p style={{
            fontSize: '16px',
            color: '#6b7280',
            textAlign: 'center',
            marginBottom: '40px',
            margin: '0 0 40px 0'
          }}>
            Support multiple advertising platforms and objectives
          </p>
          <div className="responsive-use-cases" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px'
          }}>
            <div style={{
              padding: '32px',
              backgroundColor: '#f9fafb',
              borderRadius: '12px',
              border: '2px dashed #2563eb',
              textAlign: 'center'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
                position: 'relative'
              }}>
                <Image
                  src="/logo/meta.png"
                  alt="Meta Ads"
                  width={64}
                  height={64}
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <h4 style={{
                fontWeight: '600',
                color: '#111827',
                marginBottom: '12px',
                margin: '0 0 12px 0',
                fontSize: '18px'
              }}>
                Meta Ads Reports
              </h4>
              <p style={{
                fontSize: '14px',
                color: '#4b5563',
                margin: 0,
                lineHeight: '1.6',
                marginBottom: '16px'
              }}>
                Generate comprehensive reports for:
              </p>
              <div style={{
                fontSize: '14px',
                color: '#374151',
                lineHeight: '1.8',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}>
                  <div style={{
                    fontWeight: '600',
                    color: '#111827',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <i className="bi bi-whatsapp" style={{ fontSize: '18px', color: '#25d366' }}></i>
                    <span>CTWA</span>
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: '#6b7280',
                    paddingLeft: '32px'
                  }}>
                    Click to WhatsApp, Visit Profile
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}>
                  <div style={{
                    fontWeight: '600',
                    color: '#111827',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <i className="bi bi-link-45deg" style={{ fontSize: '18px', color: '#2563eb' }}></i>
                    <span>CTLP to WA</span>
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: '#6b7280',
                    paddingLeft: '32px'
                  }}>
                    Click to Landing Page to WhatsApp Button
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}>
                  <div style={{
                    fontWeight: '600',
                    color: '#111827',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <i className="bi bi-graph-up-arrow" style={{ fontSize: '18px', color: '#10b981' }}></i>
                    <span>CPAS</span>
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: '#6b7280',
                    paddingLeft: '32px'
                  }}>
                    Collaborative Performance Advertising Solution (Shopee, Lazada, Tokopedia)
                  </div>
                </div>
              </div>
            </div>
            <div style={{
              padding: '32px',
              backgroundColor: '#f3f4f6',
              borderRadius: '12px',
              border: '1px solid #d1d5db',
              textAlign: 'center',
              opacity: 0.8
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
                position: 'relative',
                filter: 'grayscale(100%)'
              }}>
                <Image
                  src="/logo/google.png"
                  alt="Google Ads"
                  width={64}
                  height={64}
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <h4 style={{
                fontWeight: '600',
                color: '#6b7280',
                marginBottom: '12px',
                margin: '0 0 12px 0',
                fontSize: '18px'
              }}>
                Google Ads
              </h4>
              <div style={{
                display: 'inline-block',
                backgroundColor: '#9ca3af',
                color: '#ffffff',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '600',
                marginBottom: '12px'
              }}>
                Coming Soon
              </div>
              <p style={{
                fontSize: '14px',
                color: '#9ca3af',
                margin: 0,
                lineHeight: '1.6'
              }}>
                Google Ads reporting dashboard will be available soon
              </p>
            </div>
            <div style={{
              padding: '32px',
              backgroundColor: '#f3f4f6',
              borderRadius: '12px',
              border: '1px solid #d1d5db',
              textAlign: 'center',
              opacity: 0.8
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
                position: 'relative',
                filter: 'grayscale(100%)'
              }}>
                <Image
                  src="/logo/tiktok.png"
                  alt="TikTok Ads"
                  width={64}
                  height={64}
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <h4 style={{
                fontWeight: '600',
                color: '#6b7280',
                marginBottom: '12px',
                margin: '0 0 12px 0',
                fontSize: '18px'
              }}>
                TikTok Ads
              </h4>
              <div style={{
                display: 'inline-block',
                backgroundColor: '#9ca3af',
                color: '#ffffff',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '600',
                marginBottom: '12px'
              }}>
                Coming Soon
              </div>
              <p style={{
                fontSize: '14px',
                color: '#9ca3af',
                margin: 0,
                lineHeight: '1.6'
              }}>
                TikTok Ads reporting dashboard will be available soon
              </p>
            </div>
          </div>
        </div>

        {/* Demo Preview Section */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          padding: '28px',
          border: '1px solid #e5e7eb',
          marginBottom: '48px'
        }}>
          <h3 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '8px',
            textAlign: 'center',
            margin: '0 0 8px 0'
          }}>
            See It In Action
          </h3>
          <p style={{
            fontSize: '16px',
            color: '#6b7280',
            textAlign: 'center',
            marginBottom: '40px',
            margin: '0 0 40px 0'
          }}>
            Preview sample reports for each advertising objective
          </p>
          <div className="responsive-demo" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px'
          }}>
            {/* CTWA Demo */}
            <div style={{
              backgroundColor: '#f9fafb',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              overflow: 'hidden',
              transition: 'all 0.3s ease'
            }}>
              <div style={{
                padding: '20px',
                backgroundColor: '#eff6ff',
                borderBottom: '1px solid #e5e7eb'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '8px'
                }}>
                  <i className="bi bi-whatsapp" style={{ fontSize: '24px', color: '#25d366' }}></i>
                  <h4 style={{
                    fontWeight: '600',
                    color: '#111827',
                    margin: 0,
                    fontSize: '18px'
                  }}>
                    CTWA Report
                  </h4>
                </div>
                <p style={{
                  fontSize: '13px',
                  color: '#6b7280',
                  margin: 0
                }}>
                  Click to WhatsApp, Visit Profile
                </p>
              </div>
              <div className="demo-preview-container" style={{
                width: '100%',
                height: '365px',
                overflow: 'hidden',
                position: 'relative',
                backgroundColor: '#f3f4f6',
                borderRadius: '0 0 12px 12px',
                margin: '0 auto'
              }}>
                <iframe
                  src="/demo/report-ctwa.pdf#view=FitH&toolbar=0&navpanes=0&scrollbar=0"
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    borderRadius: '0 0 12px 12px'
                  }}
                  title="CTWA Report Preview"
                  loading="lazy"
                />
                <div className="demo-gradient-overlay" style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '80px',
                  background: 'linear-gradient(to top, rgba(249, 250, 251, 0.98), rgba(249, 250, 251, 0.5), transparent)',
                  pointerEvents: 'none',
                  borderRadius: '0 0 12px 12px',
                  zIndex: 1
                }}></div>
              </div>
              <div className="demo-button-container" style={{
                marginTop: '-8px',
                padding: '18px 12px',
                textAlign: 'center'
              }}>
                <a
                  href="/demo/report-ctwa.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 50%, #1e3a8a 100%)',
                    color: '#ffffff',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    fontSize: '15px',
                    fontWeight: '600',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 4px 14px 0 rgba(37, 99, 235, 0.39)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)'
                    e.currentTarget.style.boxShadow = '0 8px 25px 0 rgba(37, 99, 235, 0.5)'
                    e.currentTarget.style.background = 'linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1e40af 100%)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)'
                    e.currentTarget.style.boxShadow = '0 4px 14px 0 rgba(37, 99, 235, 0.39)'
                    e.currentTarget.style.background = 'linear-gradient(135deg, #2563eb 0%, #1e40af 50%, #1e3a8a 100%)'
                  }}
                >
                  <i className="bi bi-file-earmark-pdf-fill" style={{ fontSize: '18px', marginRight: '8px' }}></i>
                  <span>View Full Report</span>
                  <i className="bi bi-arrow-right" style={{ fontSize: '14px', marginLeft: '8px', transition: 'transform 0.3s ease' }}></i>
                </a>
              </div>
            </div>

            {/* CTLP to WA Demo */}
            <div style={{
              backgroundColor: '#f9fafb',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              overflow: 'hidden',
              transition: 'all 0.3s ease'
            }}>
              <div style={{
                padding: '20px',
                backgroundColor: '#f0fdf4',
                borderBottom: '1px solid #e5e7eb'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '8px'
                }}>
                  <i className="bi bi-link-45deg" style={{ fontSize: '24px', color: '#2563eb' }}></i>
                  <h4 style={{
                    fontWeight: '600',
                    color: '#111827',
                    margin: 0,
                    fontSize: '18px'
                  }}>
                    CTLP to WA Report
                  </h4>
                </div>
                <p style={{
                  fontSize: '13px',
                  color: '#6b7280',
                  margin: 0
                }}>
                  Click to Landing Page to WhatsApp Button
                </p>
              </div>
              <div className="demo-preview-container" style={{
                width: '100%',
                height: '365px',
                overflow: 'hidden',
                position: 'relative',
                backgroundColor: '#f3f4f6',
                borderRadius: '0 0 12px 12px',
                margin: '0 auto'
              }}>
                <iframe
                  src="/demo/report-ctlptowa.pdf#view=FitH&toolbar=0&navpanes=0&scrollbar=0"
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    borderRadius: '0 0 12px 12px'
                  }}
                  title="CTLP to WA Report Preview"
                  loading="lazy"
                />
                <div className="demo-gradient-overlay" style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '80px',
                  background: 'linear-gradient(to top, rgba(249, 250, 251, 0.98), rgba(249, 250, 251, 0.5), transparent)',
                  pointerEvents: 'none',
                  borderRadius: '0 0 12px 12px',
                  zIndex: 1
                }}></div>
              </div>
              <div className="demo-button-container" style={{
                marginTop: '-8px',
                padding: '18px 12px',
                textAlign: 'center'
              }}>
                <a
                  href="/demo/report-ctlptowa.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 50%, #1e3a8a 100%)',
                    color: '#ffffff',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    fontSize: '15px',
                    fontWeight: '600',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 4px 14px 0 rgba(37, 99, 235, 0.39)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)'
                    e.currentTarget.style.boxShadow = '0 8px 25px 0 rgba(37, 99, 235, 0.5)'
                    e.currentTarget.style.background = 'linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1e40af 100%)'
                    const arrow = e.currentTarget.querySelector('.bi-arrow-right') as HTMLElement
                    if (arrow) arrow.style.transform = 'translateX(4px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)'
                    e.currentTarget.style.boxShadow = '0 4px 14px 0 rgba(37, 99, 235, 0.39)'
                    e.currentTarget.style.background = 'linear-gradient(135deg, #2563eb 0%, #1e40af 50%, #1e3a8a 100%)'
                    const arrow = e.currentTarget.querySelector('.bi-arrow-right') as HTMLElement
                    if (arrow) arrow.style.transform = 'translateX(0)'
                  }}
                >
                  <i className="bi bi-file-earmark-pdf-fill" style={{ fontSize: '18px', marginRight: '8px' }}></i>
                  <span>View Full Report</span>
                  <i className="bi bi-arrow-right" style={{ fontSize: '14px', marginLeft: '8px', transition: 'transform 0.3s ease' }}></i>
                </a>
              </div>
            </div>

            {/* CPAS Demo */}
            <div style={{
              backgroundColor: '#f9fafb',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              overflow: 'hidden',
              transition: 'all 0.3s ease'
            }}>
              <div style={{
                padding: '20px',
                backgroundColor: '#fef3c7',
                borderBottom: '1px solid #e5e7eb'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '8px'
                }}>
                  <i className="bi bi-graph-up-arrow" style={{ fontSize: '24px', color: '#10b981' }}></i>
                  <h4 style={{
                    fontWeight: '600',
                    color: '#111827',
                    margin: 0,
                    fontSize: '18px'
                  }}>
                    CPAS Report
                  </h4>
                </div>
                <p style={{
                  fontSize: '13px',
                  color: '#6b7280',
                  margin: 0
                }}>
                  Collaborative Performance Advertising Solution
                </p>
              </div>
              <div className="demo-preview-container" style={{
                width: '100%',
                height: '365px',
                overflow: 'hidden',
                position: 'relative',
                backgroundColor: '#f3f4f6',
                borderRadius: '0 0 12px 12px',
                margin: '0 auto'
              }}>
                <iframe
                  src="/demo/report-cpas.pdf#view=FitH&toolbar=0&navpanes=0&scrollbar=0"
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    borderRadius: '0 0 12px 12px'
                  }}
                  title="CPAS Report Preview"
                  loading="lazy"
                />
                <div className="demo-gradient-overlay" style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '80px',
                  background: 'linear-gradient(to top, rgba(249, 250, 251, 0.98), rgba(249, 250, 251, 0.5), transparent)',
                  pointerEvents: 'none',
                  borderRadius: '0 0 12px 12px',
                  zIndex: 1
                }}></div>
              </div>
              <div className="demo-button-container" style={{
                marginTop: '-8px',
                padding: '18px 12px',
                textAlign: 'center'
              }}>
                <a
                  href="/demo/report-cpas.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 50%, #1e3a8a 100%)',
                    color: '#ffffff',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    fontSize: '15px',
                    fontWeight: '600',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 4px 14px 0 rgba(37, 99, 235, 0.39)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)'
                    e.currentTarget.style.boxShadow = '0 8px 25px 0 rgba(37, 99, 235, 0.5)'
                    e.currentTarget.style.background = 'linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1e40af 100%)'
                    const arrow = e.currentTarget.querySelector('.bi-arrow-right') as HTMLElement
                    if (arrow) arrow.style.transform = 'translateX(4px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)'
                    e.currentTarget.style.boxShadow = '0 4px 14px 0 rgba(37, 99, 235, 0.39)'
                    e.currentTarget.style.background = 'linear-gradient(135deg, #2563eb 0%, #1e40af 50%, #1e3a8a 100%)'
                    const arrow = e.currentTarget.querySelector('.bi-arrow-right') as HTMLElement
                    if (arrow) arrow.style.transform = 'translateX(0)'
                  }}
                >
                  <i className="bi bi-file-earmark-pdf-fill" style={{ fontSize: '18px', marginRight: '8px' }}></i>
                  <span>View Full Report</span>
                  <i className="bi bi-arrow-right" style={{ fontSize: '14px', marginLeft: '8px', transition: 'transform 0.3s ease' }}></i>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          padding: '32px',
          border: '1px solid #e5e7eb',
          marginBottom: '48px'
        }}>
          <h3 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '24px',
            textAlign: 'center',
            margin: '0 0 24px 0'
          }}>
            Key Features
          </h3>
          <div className="responsive-features" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px'
          }}>
            <div className="feature-card" style={{ 
              textAlign: 'center',
              padding: '24px',
              borderRadius: '12px',
              transition: 'all 0.3s ease',
              cursor: 'default'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                backgroundColor: '#dbeafe',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto',
                transition: 'transform 0.3s ease'
              }}>
                <i className="bi bi-robot" style={{ fontSize: '28px', color: '#2563eb' }}></i>
              </div>
              <h4 style={{
                fontWeight: '600',
                color: '#111827',
                marginBottom: '12px',
                margin: '0 0 12px 0',
                fontSize: '18px'
              }}>
                AI-Powered Analysis
              </h4>
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                margin: 0,
                lineHeight: '1.6'
              }}>
                Advanced AI technology analyzes your Meta Ads data to provide actionable insights and recommendations
              </p>
            </div>
            <div className="feature-card" style={{ 
              textAlign: 'center',
              padding: '24px',
              borderRadius: '12px',
              transition: 'all 0.3s ease',
              cursor: 'default'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                backgroundColor: '#d1fae5',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto',
                transition: 'transform 0.3s ease'
              }}>
                <i className="bi bi-graph-up" style={{ fontSize: '28px', color: '#10b981' }}></i>
              </div>
              <h4 style={{
                fontWeight: '600',
                color: '#111827',
                marginBottom: '12px',
                margin: '0 0 12px 0',
                fontSize: '18px'
              }}>
                Comprehensive Reports
              </h4>
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                margin: 0,
                lineHeight: '1.6'
              }}>
                13 detailed slides covering performance metrics, audience insights, and strategic recommendations
              </p>
            </div>
            <div className="feature-card" style={{ 
              textAlign: 'center',
              padding: '24px',
              borderRadius: '12px',
              transition: 'all 0.3s ease',
              cursor: 'default'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                backgroundColor: '#f3e8ff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto',
                transition: 'transform 0.3s ease'
              }}>
                <i className="bi bi-lightning-fill" style={{ fontSize: '28px', color: '#9333ea' }}></i>
              </div>
              <h4 style={{
                fontWeight: '600',
                color: '#111827',
                marginBottom: '12px',
                margin: '0 0 12px 0',
                fontSize: '18px'
              }}>
                Fast & Easy
              </h4>
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                margin: 0,
                lineHeight: '1.6'
              }}>
                Upload your CSV file and get professional reports in minutes - no technical skills required
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="responsive-section" style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          padding: '28px',
          border: '1px solid #e5e7eb',
          marginBottom: '48px'
        }}>
          <h3 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '8px',
            textAlign: 'center',
            margin: '0 0 8px 0'
          }}>
            Frequently Asked Questions
          </h3>
          <p style={{
            fontSize: '16px',
            color: '#6b7280',
            textAlign: 'center',
            marginBottom: '40px',
            margin: '0 0 40px 0'
          }}>
            Everything you need to know about our report generator
          </p>
          <div className="responsive-faq" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {[
              {
                q: 'What file formats are supported?',
                a: 'We support CSV files exported directly from Meta Ads Manager. Make sure to include all required metrics and breakdown dimensions.'
              },
              {
                q: 'How do I export data from Meta Ads Manager?',
                a: 'Go to Meta Ads Manager → Reports → Export. Select your date range, choose custom metrics, and include breakdowns for Age, Gender, Region, Platform, Placement, Objective, and Creative.'
              },
              {
                q: 'How long does it take to generate a report?',
                a: 'Typically, reports are generated within 2-5 minutes depending on the size of your data. The AI analysis and HTML generation process is fully automated.'
              },
              {
                q: 'What advertising objectives are supported?',
                a: 'We currently support CTWA (Click to WhatsApp), CPAS (Collaborative Performance Advertising Solution), and CTLP to WA (Click to Landing Page to WhatsApp). More objectives coming soon!'
              },
              {
                q: 'Can I customize the report format?',
                a: 'The report format is standardized to ensure consistency and professionalism. However, you can add a custom report name and all reports include comprehensive analytics tailored to your data.'
              },
              {
                q: 'Is my data secure?',
                a: 'Yes! We process your data securely and do not store your CSV files permanently. Reports are generated on-demand and you can download them immediately.'
              }
            ].map((faq, index) => {
              const isOpen = openFaqs.has(index)
              return (
                <div key={index} style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  boxShadow: isOpen ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                }}>
                  <button
                    onClick={() => toggleFaq(index)}
                    style={{
                      width: '100%',
                      padding: '20px 24px',
                      backgroundColor: isOpen ? '#f9fafb' : 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      textAlign: 'left',
                      gap: '16px',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!isOpen) {
                        e.currentTarget.style.backgroundColor = '#f9fafb'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isOpen) {
                        e.currentTarget.style.backgroundColor = 'transparent'
                      } else {
                        e.currentTarget.style.backgroundColor = '#f9fafb'
                      }
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '16px',
                      flex: 1
                    }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        backgroundColor: '#eff6ff',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <i className="bi bi-question-circle-fill" style={{ color: '#2563eb', fontSize: '18px' }}></i>
                      </div>
                      <h4 style={{
                        fontWeight: '600',
                        color: '#111827',
                        margin: 0,
                        fontSize: '16px',
                        lineHeight: '1.5',
                        flex: 1
                      }}>
                        {faq.q}
                      </h4>
                    </div>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <i 
                        className={`bi ${isOpen ? 'bi-chevron-up' : 'bi-chevron-down'}`}
                        style={{ 
                          color: '#2563eb', 
                          fontSize: '18px',
                          transition: 'transform 0.3s ease'
                        }}
                      ></i>
                    </div>
                  </button>
                  <div style={{
                    maxHeight: isOpen ? '500px' : '0',
                    overflow: 'hidden',
                    transition: 'max-height 0.3s ease, padding 0.3s ease, opacity 0.3s ease',
                    padding: isOpen ? '20px 24px 20px 72px' : '0 24px',
                    opacity: isOpen ? 1 : 0
                  }}>
                    <p style={{
                      fontSize: '14px',
                      color: '#4b5563',
                      margin: 0,
                      lineHeight: '1.6'
                    }}>
                      {faq.a}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Trust Badges & Support Section */}
        <div className="responsive-trust" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px',
          marginBottom: '12px'
        }}>
          {/* Trust Badges */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            padding: '32px',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '24px',
              margin: '0 0 24px 0'
            }}>
              Trust & Security
            </h3>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <i className="bi bi-shield-check" style={{ fontSize: '24px', color: '#10b981' }}></i>
                <div>
                  <div style={{
                    fontWeight: '600',
                    color: '#111827',
                    marginBottom: '4px',
                    fontSize: '14px'
                  }}>
                    Secure & Private
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#6b7280'
                  }}>
                    Your data is processed securely
                  </div>
                </div>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <i className="bi bi-database-x" style={{ fontSize: '24px', color: '#2563eb' }}></i>
                <div>
                  <div style={{
                    fontWeight: '600',
                    color: '#111827',
                    marginBottom: '4px',
                    fontSize: '14px'
                  }}>
                    No Data Storage
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#6b7280'
                  }}>
                    Files are processed on-demand only
                  </div>
                </div>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <i className="bi bi-building" style={{ fontSize: '24px', color: '#9333ea' }}></i>
                <div>
                  <div style={{
                    fontWeight: '600',
                    color: '#111827',
                    marginBottom: '4px',
                    fontSize: '14px'
                  }}>
                    Powered by <span style={{ fontWeight: '600' }}>Hadona Digital Media</span>
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#6b7280'
                  }}>
                    Trusted digital marketing agency
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Support & Contact */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            padding: '32px',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '24px',
              margin: '0 0 24px 0'
            }}>
              Need Help?
            </h3>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <a href="mailto:support@hadona.id" className="social-link" style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <i className="bi bi-envelope" style={{ fontSize: '24px', color: '#2563eb' }}></i>
                  <div>
                    <div style={{
                      fontWeight: '600',
                      color: '#111827',
                      marginBottom: '4px',
                      fontSize: '14px'
                    }}>
                      Email Support
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: '#6b7280'
                    }}>
                      support@hadona.id
                    </div>
                  </div>
                </div>
              </a>
              <a href="https://wa.me/6285158000123" target="_blank" rel="noopener noreferrer" className="social-link" style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <i className="bi bi-whatsapp" style={{ fontSize: '24px', color: '#25d366' }}></i>
                  <div>
                    <div style={{
                      fontWeight: '600',
                      color: '#111827',
                      marginBottom: '4px',
                      fontSize: '14px'
                    }}>
                      WhatsApp
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: '#6b7280'
                    }}>
                      +62 851 5800 0123
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* Follow Us */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            padding: '32px',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '24px',
              margin: '0 0 24px 0'
            }}>
              Follow Us
            </h3>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <a href="https://www.instagram.com/hadona.id" target="_blank" rel="noopener noreferrer" className="social-link" style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <i className="bi bi-instagram" style={{ fontSize: '24px', color: '#ec4899' }}></i>
                  <div>
                    <div style={{
                      fontWeight: '600',
                      color: '#111827',
                      marginBottom: '4px',
                      fontSize: '14px'
                    }}>
                      Social Media
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: '#6b7280'
                    }}>
                      @hadona.id
                    </div>
                  </div>
                </div>
              </a>
              <a href="https://www.linkedin.com/company/pt-hadona-digital-media/" target="_blank" rel="noopener noreferrer" className="social-link" style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <i className="bi bi-linkedin" style={{ fontSize: '24px', color: '#0077b5' }}></i>
                  <div>
                    <div style={{
                      fontWeight: '600',
                      color: '#111827',
                      marginBottom: '4px',
                      fontSize: '14px'
                    }}>
                      LinkedIn
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: '#6b7280'
                    }}>
                      PT. Hadona Digital Media
                    </div>
                  </div>
                </div>
              </a>
              <a href="https://www.facebook.com/profile.php?id=61552533756847" target="_blank" rel="noopener noreferrer" className="social-link" style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <i className="bi bi-facebook" style={{ fontSize: '24px', color: '#1877f2' }}></i>
                  <div>
                    <div style={{
                      fontWeight: '600',
                      color: '#111827',
                      marginBottom: '4px',
                      fontSize: '14px'
                    }}>
                      Facebook
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: '#6b7280'
                    }}>
                      Hadona Digital Media
                    </div>
                  </div>
                </div>
              </a>
              <a href="https://www.tiktok.com/@hadona.id" target="_blank" rel="noopener noreferrer" className="social-link" style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <i className="bi bi-tiktok" style={{ fontSize: '24px', color: '#000000' }}></i>
                  <div>
                    <div style={{
                      fontWeight: '600',
                      color: '#111827',
                      marginBottom: '4px',
                      fontSize: '14px'
                    }}>
                      TikTok
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: '#6b7280'
                    }}>
                      @hadona.id
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Final CTA Section */}
        <div className="responsive-cta-section" style={{
          backgroundColor: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
          background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
          borderRadius: '16px',
          padding: '64px 48px',
          marginBottom: '48px',
          textAlign: 'center',
          boxShadow: '0 20px 25px -5px rgba(37, 99, 235, 0.3)'
        }}>
          <h2 className="responsive-cta-heading" style={{
            fontSize: '40px',
            fontWeight: 'bold',
            color: '#ffffff',
            marginBottom: '16px',
            margin: '0 0 16px 0'
          }}>
            Ready to Generate Your First Report?
          </h2>
          <p className="cta-description-single-line" style={{
            fontSize: '18px',
            color: 'rgba(255, 255, 255, 0.9)',
            maxWidth: '600px',
            margin: '0 auto 32px auto',
            lineHeight: '1.6'
          }}>
            Start creating professional advertising reports in minutes. No credit card required.
          </p>
          <button
            className="responsive-cta-button"
            onClick={() => router.push('/meta-ads')}
            style={{
              padding: '18px 40px',
              fontSize: '18px',
              fontWeight: '600',
              backgroundColor: '#ffffff',
              color: '#2563eb',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 12px 20px -3px rgba(0, 0, 0, 0.3)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.2)'
            }}
          >
            <i className="bi bi-rocket-takeoff" style={{ marginRight: '8px' }}></i>
            Get Started Now - It&apos;s Free
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
