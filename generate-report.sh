#!/bin/bash

# Meta Ads Report Generator - Quick Automation Script
# Usage: ./generate-report.sh <objective> <client-name> <this-period-path> <last-period-path>

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default values
OBJECTIVE=${1:-"ctwa"}
CLIENT_NAME=${2:-"RMODA WORKSHOP"}
THIS_PERIOD=${3:-"test-data/bulan ini"}
LAST_PERIOD=${4:-"test-data/bulan lalu"}

echo -e "${BLUE}═════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}   Meta Ads Report Generator - Automation${NC}"
echo -e "${BLUE}═════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${GREEN}Configuration:${NC}"
echo "  Objective:    ${OBJECTIVE}"
echo "  Client:       ${CLIENT_NAME}"
echo "  This Period:  ${THIS_PERIOD}"
echo "  Last Period:  ${LAST_PERIOD}"
echo ""

# Check if directories exist
if [ ! -d "$THIS_PERIOD" ]; then
  echo -e "${YELLOW}⚠️  This period directory not found: ${THIS_PERIOD}${NC}"
  echo "Please check the path and try again."
  exit 1
fi

if [ ! -d "$LAST_PERIOD" ]; then
  echo -e "${YELLOW}⚠️  Last period directory not found: ${LAST_PERIOD}${NC}"
  echo "Please check the path and try again."
  exit 1
fi

# Count CSV files
THIS_COUNT=$(find "$THIS_PERIOD" -name "*.csv" | wc -l)
LAST_COUNT=$(find "$LAST_PERIOD" -name "*.csv" | wc -l)

echo -e "${GREEN}Files found:${NC}"
echo "  This Period:  ${THIS_COUNT} CSV files"
echo "  Last Period:  ${LAST_COUNT} CSV files"
echo ""

if [ $THIS_COUNT -eq 0 ] || [ $LAST_COUNT -eq 0 ]; then
  echo -e "${YELLOW}⚠️  Not enough CSV files found. Please check your data directories.${NC}"
  exit 1
fi

# Check if dev server is running
echo -e "${BLUE}🔍 Checking if dev server is running...${NC}"
if curl -s http://localhost:3000 > /dev/null; then
  echo -e "${GREEN}✅ Dev server is running${NC}"
else
  echo -e "${YELLOW}⚠️  Dev server is NOT running${NC}"
  echo ""
  echo "Please start the dev server in another terminal:"
  echo "  npm run dev"
  echo ""
  exit 1
fi

echo ""
echo -e "${BLUE}🚀 Starting Playwright automation...${NC}"
echo ""

# Run Playwright test
npx playwright test --config=app/playwright.config.ts e2e/generate-all-objectives.spec.ts --project=chromium "$@"

echo ""
echo -e "${GREEN}✨ Automation completed!${NC}"
echo ""
echo -e "${BLUE}📁 Check downloads folder for generated reports:${NC}"
echo "  downloads/"
echo ""
