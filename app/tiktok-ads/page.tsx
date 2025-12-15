'use client'

import { useRouter } from 'next/navigation'

export default function TikTokAdsPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
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
                <h1 className="text-2xl font-bold text-gray-900">TikTok Ads Report Generator</h1>
                <p className="text-xs text-gray-500">Powered by Z AI GLM 4.6</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Coming Soon Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 text-5xl">
            🎵
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Coming Soon</h2>
          <p className="text-xl text-gray-600 mb-8">
            TikTok Ads reporting dashboard is currently under development.
          </p>
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">What to Expect</h3>
            <ul className="text-left space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="text-pink-500 mr-3">✓</span>
                <span>Comprehensive TikTok Ads performance analytics</span>
              </li>
              <li className="flex items-start">
                <span className="text-pink-500 mr-3">✓</span>
                <span>AI-powered insights and recommendations</span>
              </li>
              <li className="flex items-start">
                <span className="text-pink-500 mr-3">✓</span>
                <span>Detailed campaign breakdowns and metrics</span>
              </li>
              <li className="flex items-start">
                <span className="text-pink-500 mr-3">✓</span>
                <span>Export to PDF functionality</span>
              </li>
            </ul>
          </div>
          <button
            onClick={() => router.push('/home')}
            className="mt-8 px-6 py-3 bg-pink-600 text-white rounded-lg font-semibold hover:bg-pink-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </main>
    </div>
  )
}

