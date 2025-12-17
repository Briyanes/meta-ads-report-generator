#!/bin/bash

# Script untuk reset dev server dan clear cache
# Usage: ./scripts/dev-reset.sh

echo "🔄 Resetting development environment..."

# Kill existing Next.js dev servers
echo "1. Stopping existing dev servers..."
pkill -f "next dev" 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

# Wait a moment
sleep 2

# Clear Next.js cache
echo "2. Clearing Next.js cache..."
rm -rf .next

# Clear node_modules cache if exists
if [ -d "node_modules/.cache" ]; then
  echo "3. Clearing node_modules cache..."
  rm -rf node_modules/.cache
fi

echo "✅ Cache cleared!"
echo ""
echo "🚀 Starting dev server..."
echo "   Server will be available at http://localhost:3000"
echo "   Press Ctrl+C to stop"
echo ""

npm run dev



