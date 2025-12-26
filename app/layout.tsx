import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://report.hadona.id'),
  title: {
    default: 'Meta Ads Report Generator - Generate Professional Ads Performance Reports',
    template: '%s | Hadona Report Generator',
  },
  icons: {
    icon: '/logo/logo-hadona.png',
    apple: '/logo/logo-hadona.png',
  },
  description:
    'Generate professional Meta Ads performance reports with AI-powered analytics. Automatically analyze your Facebook & Instagram ads performance with detailed insights, recommendations, and actionable data for CPAS, CTWA, and CTL objectives.',
  keywords: [
    'Hadona',
    'Digital Media',
    'Meta Ads Report',
    'Facebook Ads',
    'Instagram Ads',
    'Performance Analytics',
    'CPAS',
    'CTWA',
    'CTL',
    'Ads Analysis',
    'Marketing Report',
    'Social Media Analytics',
  ],
  authors: [{ name: 'Hadona Digital Media' }],
  creator: 'Hadona Digital Media',
  publisher: 'Hadona Digital Media',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: 'https://report.hadona.id',
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://report.hadona.id',
    siteName: 'report.hadona.id',
    title: 'Meta Ads Report Generator - Professional Ads Performance Analytics',
    description:
      'Generate comprehensive Meta Ads performance reports with AI-powered insights. Analyze Facebook & Instagram ads campaigns with detailed metrics, trends, and actionable recommendations.',
    images: [
      {
        url: '/logo/logo-hadona.png',
        width: 1200,
        height: 630,
        alt: 'Hadona Digital Media - Meta Ads Report Generator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Meta Ads Report Generator - Professional Performance Analytics',
    description:
      'AI-powered Meta Ads performance reporting. Analyze Facebook & Instagram ads with detailed insights and actionable recommendations.',
    images: ['/logo/logo-hadona.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add Google Search Console verification if available
    // google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.css" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}


