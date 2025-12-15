'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function HomePage() {
  const router = useRouter()
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  const platforms = [
    {
      id: 'meta',
      name: 'Meta Ads',
      description: 'Generate comprehensive Meta Ads performance reports with detailed analytics',
      icon: '📊',
      color: 'from-blue-500 to-blue-600',
      available: true,
      route: '/meta-ads'
    },
    {
      id: 'google',
      name: 'Google Ads',
      description: 'Google Ads reporting dashboard (Coming Soon)',
      icon: '🔍',
      color: 'from-green-500 to-green-600',
      available: false,
      route: null
    },
    {
      id: 'tiktok',
      name: 'TikTok Ads',
      description: 'TikTok Ads reporting dashboard (Coming Soon)',
      icon: '🎵',
      color: 'from-pink-500 to-pink-600',
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Ads Report Generator</h1>
              <p className="text-sm text-gray-500 mt-1">Powered by Z AI GLM 4.6</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full font-medium">
                AI-Powered Analytics
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Advertising Platform
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Generate comprehensive performance reports for your advertising campaigns with AI-powered analytics
          </p>
        </div>

        {/* Platform Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {platforms.map((platform) => (
            <div
              key={platform.id}
              onClick={() => handlePlatformClick(platform)}
              onMouseEnter={() => setHoveredCard(platform.id)}
              onMouseLeave={() => setHoveredCard(null)}
              className={`
                relative bg-white rounded-xl shadow-lg border-2 transition-all duration-300 cursor-pointer
                ${platform.available 
                  ? 'border-gray-200 hover:border-blue-400 hover:shadow-2xl hover:-translate-y-1' 
                  : 'border-gray-200 opacity-75 cursor-not-allowed'
                }
                ${hoveredCard === platform.id && platform.available ? 'scale-105' : ''}
              `}
            >
              {/* Badge */}
              {!platform.available && (
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
                    Coming Soon
                  </span>
                </div>
              )}

              <div className="p-8">
                {/* Icon */}
                <div className={`
                  w-16 h-16 rounded-full bg-gradient-to-br ${platform.color} 
                  flex items-center justify-center text-3xl mb-4 mx-auto
                  ${platform.available ? 'shadow-lg' : 'opacity-50'}
                `}>
                  {platform.icon}
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">
                  {platform.name}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-center mb-6">
                  {platform.description}
                </p>

                {/* Action Button */}
                <button
                  disabled={!platform.available}
                  className={`
                    w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200
                    ${platform.available
                      ? `bg-gradient-to-r ${platform.color} text-white hover:shadow-lg hover:scale-105`
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }
                  `}
                >
                  {platform.available ? 'Get Started' : 'Coming Soon'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Key Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">AI-Powered Analysis</h4>
              <p className="text-sm text-gray-600">Powered by Z AI GLM 4.6 for intelligent insights</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Comprehensive Reports</h4>
              <p className="text-sm text-gray-600">Detailed analytics and performance breakdowns</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Fast & Easy</h4>
              <p className="text-sm text-gray-600">Generate reports in minutes with simple uploads</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>© 2024 Ads Report Generator. Powered by <span className="font-semibold text-blue-600">Z AI GLM 4.6</span></p>
          </div>
        </div>
      </footer>
    </div>
  )
}

