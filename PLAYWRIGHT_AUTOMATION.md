# Playwright Automation - RMODA Workshop CTWA Report

## Overview

Automated report generation for RMODA Workshop CTWA (Click to WhatsApp) reports using Playwright.

## Prerequisites

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Prepare data files:**
   - Place CSV files in `test-data/bulan ini/` (this month)
   - Place CSV files in `test-data/bulan lalu/` (last month)

## How to Use

### Method 1: Manual (Recommended)

**Terminal 1 - Start Dev Server:**
```bash
npm run dev
```

**Terminal 2 - Run Automation:**
```bash
npm run automate:rmoda
```

### Method 2: Headless Mode

Edit `playwright-automate-rmoda.ts` and change:
```typescript
headless: false  // Change to: headless: true
```

Then run the script.

## What It Does

1. ✅ Launches Chromium browser
2. ✅ Navigates to Meta Ads report page
3. ✅ Selects CTWA objective type
4. ✅ Uploads this month CSV files (5 files)
5. ✅ Uploads last month CSV files (5 files)
6. ✅ Clicks "Analyze" button
7. ✅ Waits for analysis to complete
8. ✅ Clicks "Generate Report" button
9. ✅ Waits for PDF generation
10. ✅ Downloads the PDF report

## Output

- **PDF Report**: Saved to `downloads/RMODA-WORKSHOP-CTWA-[timestamp].pdf`
- **Screenshots**: Saved to `playwright-report/` for debugging

## CSV File Structure

### This Month Files:
- `rmoda-workshop-bulan-ini-ad-creative.csv`
- `rmoda-workshop-bulan-ini-age-gender.csv`
- `rmoda-workshop-bulan-ini-objective.csv`
- `rmoda-workshop-bulan-ini-platform-placement.csv`
- `rmoda-workshop-bulan-ini-region.csv`

### Last Month Files:
- `rmoda-workshop-bulan-lalu-ad-creative.csv`
- `rmoda-workshop-bulan-lalu-age-gender.csv`
- `rmoda-workshop-bulan-lalu-objective.csv`
- `rmoda-workshop-bulan-lalu-platform-placement.csv`
- `rmoda-workshop-bulan-lalu-region.csv`

## Customization

### Change Base URL
```bash
export BASE_URL=http://localhost:3000
npm run automate:rmoda
```

Or for production:
```bash
export BASE_URL=https://your-domain.com
npm run automate:rmoda
```

### Adjust Speed
Edit `playwright-automate-rmoda.ts`:
```typescript
slowMo: 300  // Increase for slower, decrease for faster
```

## Troubleshooting

### "Dev server is NOT running"
- Make sure to run `npm run dev` in another terminal first

### "File not found"
- Check that CSV files exist in `test-data/bulan ini/` and `test-data/bulan lalu/`
- Verify file names match exactly

### "Button not found"
- Increase wait times in the script
- Check screenshots in `playwright-report/` for debugging

### Download fails
- Check browser popup settings
- Try running in non-headless mode to see what's happening

## Future Enhancements

- [ ] Support for multiple clients
- [ ] Batch processing multiple reports
- [ ] Email report automatically
- [ ] Integration with cloud storage
- [ ] Schedule automatic report generation

## Notes

- The script uses slow motion (300ms delay) for visibility
- Screenshots are saved at each step for debugging
- Browser stays open for 10 seconds after completion for inspection
- All actions are logged to console
