import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://report.hadona.id'),
  title: 'Meta Ads Report Generator - Hadona Digital Media',
  description: 'Generate professional Meta Ads performance reports with AI. Automatically analyze your Facebook & Instagram ads performance with detailed insights and recommendations.',
  icons: {
    icon: '/logo/logo-hadona.png',
    apple: '/logo/logo-hadona.png',
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://report.hadona.id',
    title: 'Meta Ads Report Generator - Hadona Digital Media',
    description: 'Generate professional Meta Ads performance reports with AI. Automatically analyze your Facebook & Instagram ads performance with detailed insights and recommendations.',
    siteName: 'Hadona Digital Media',
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
    title: 'Meta Ads Report Generator - Hadona Digital Media',
    description: 'Generate professional Meta Ads performance reports with AI. Automatically analyze your Facebook & Instagram ads performance with detailed insights and recommendations.',
    images: ['/logo/logo-hadona.png'],
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


