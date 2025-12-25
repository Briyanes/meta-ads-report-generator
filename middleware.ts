import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rate limiting configuration
const RATE_LIMIT = {
  // 100 requests per 5 minutes
  windowMs: 5 * 60 * 1000,
  maxRequests: 100,
}

// Simple in-memory rate limiting store
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Clean up expired entries
function cleanupRateLimitStore() {
  const now = Date.now()
  const entries = Array.from(rateLimitStore.entries())
  for (const [key, value] of entries) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key)
    }
  }
}

// Run cleanup every minute
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupRateLimitStore, 60000)
}

// Get client identifier
function getClientIdentifier(request: NextRequest): string {
  // Try to get a unique identifier from the request
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const ip = forwarded?.split(',')[0] || realIp || 'unknown'

  // Don't track during development
  if (process.env.NODE_ENV === 'development') {
    return 'dev'
  }

  return ip
}

// Rate limiting middleware
export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Add security headers
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')

  // Rate limiting for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const identifier = getClientIdentifier(request)
    const now = Date.now()

    // Get or create rate limit entry
    let entry = rateLimitStore.get(identifier)

    if (!entry || now > entry.resetTime) {
      // Create new entry or reset expired one
      entry = {
        count: 1,
        resetTime: now + RATE_LIMIT.windowMs
      }
      rateLimitStore.set(identifier, entry)
    } else {
      // Increment count
      entry.count++
    }

    // Check if rate limit exceeded
    if (entry.count > RATE_LIMIT.maxRequests) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    // Add rate limit headers
    response.headers.set('X-RateLimit-Limit', RATE_LIMIT.maxRequests.toString())
    response.headers.set('X-RateLimit-Remaining', Math.max(0, RATE_LIMIT.maxRequests - entry.count).toString())
    response.headers.set('X-RateLimit-Reset', entry.resetTime.toString())
  }

  return response
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    '/api/:path*',
    // Add other routes if needed
  ],
}
