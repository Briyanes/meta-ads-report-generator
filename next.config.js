/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Optimize images
  images: {
    domains: ['hadona.id'],
    unoptimized: false,
  },
  // Increase build timeout for large files
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  // Output configuration
  output: 'standalone',
}

module.exports = nextConfig

