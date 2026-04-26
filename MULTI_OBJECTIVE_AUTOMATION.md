# Multi-Objective Automation Guide

## 🎯 Supported Objectives

Automation ini mendukung SEMUA objectives yang ada di dashboard:

1. **CTWA** (Click to WhatsApp) - ✅ Tested
2. **CPAS** (Commerce Pages Account Spend)
3. **CTLPTOWA** (Click to Landing Page to WhatsApp)
4. **CTLPTOPURCHASE** (Click to Landing Page to Purchase)

## 📋 Prerequisites

Sama seperti CTWA automation:
- CSV files untuk this period dan last period
- Dev server running
- Playwright browsers installed

## 🚀 Usage

### Method 1: NPM Scripts (Recommended)

**Generate ALL configured reports:**
```bash
npm run automate:all           # Dengan browser
npm run automate:all:headless  # Tanpa browser (faster)
```

**Generate specific objective only:**
Edit `app/e2e/generate-all-objectives.spec.ts` dan tambahkan/remove objectives dari array `reports`.

### Method 2: Shell Script

```bash
# Basic usage (defaults to RMODA WORKSHOP CTWA)
./generate-report.sh

# Custom objective
./generate-report.sh cpas

# Custom objective + client name
./generate-report.sh cpas "CLIENT NAME"

# Custom paths
./generate-report.sh cpas "CLIENT NAME" "path/to/this" "path/to/last"
```

### Method 3: Direct Playwright

```bash
# All objectives
npx playwright test --config=app/playwright.config.ts e2e/generate-all-objectives.spec.ts

# Headless mode
npx playwright test --config=app/playwright.config.ts e2e/generate-all-objectives.spec.ts --project=chromium
```

## 📁 Data Structure

Untuk setiap objective, siapkan CSV files dalam struktur berikut:

```
test-data/
├── cpas-this-month/
│   ├── main-file.csv
│   ├── age-gender.csv
│   ├── region.csv
│   ├── platform-placement.csv
│   ├── objective.csv
│   └── ad-creative.csv
├── cpas-last-month/
│   └── ... (same files)
├── ctlptowa-this-week/
│   └── ... (same files)
├── ctlptowa-last-week/
│   └── ... (same files)
└── ... (other objectives)
```

## ⚙️ Configuration

Edit `app/e2e/generate-all-objectives.spec.ts`:

```typescript
const reports: ReportConfig[] = [
  {
    clientName: 'RMODA WORKSHOP',
    objective: 'ctwa',
    thisPeriodPath: path.join(process.cwd(), 'test-data/bulan ini'),
    lastPeriodPath: path.join(process.cwd(), 'test-data/bulan lalu'),
  },
  {
    clientName: 'ANOTHER CLIENT',
    objective: 'cpas',
    thisPeriodPath: path.join(process.cwd(), 'test-data/cpas-this-month'),
    lastPeriodPath: path.join(process.cwd(), 'test-data/cpas-last-month'),
  },
  // Add more reports as needed
];
```

## 🎨 Objective Mapping

| Code | Dropdown Option | Description |
|------|----------------|-------------|
| `ctwa` | CTWA | Click to WhatsApp |
| `cpas` | CPAS | Commerce Pages Account Spend |
| `ctlptowa` | CTLP to WA | Click to Landing Page to WhatsApp |
| `ctlptopurchase` | CTLP to Purchase | Click to Landing Page to Purchase |

## 📊 Expected Output

Untuk setiap report, automation akan:
1. ✅ Select objective type
2. ✅ Upload CSV files (this period)
3. ✅ Upload CSV files (last period)
4. ✅ Click "Analyze CSV"
5. ✅ Wait for analysis completion
6. ✅ Click "Generate HTML Report"
7. ✅ Wait for PDF generation
8. ✅ Click "Download PDF"
9. ✅ Save PDF to `downloads/` folder

## 🔍 Debugging

**List available objectives:**
```bash
npx playwright test --config=app/playwright.config.ts e2e/generate-all-objectives.spec.ts:222
```

**Debug mode:**
```bash
npm run test:playwright:debug
```

**UI mode (interactive):**
```bash
npm run test:playwright:ui
```

## 💡 Tips

1. **Batch Processing**: Add multiple clients to the `reports` array to generate reports for all clients at once
2. **Schedule Automation**: Use cron jobs or GitHub Actions to run automation automatically
3. **Parallel Execution**: Playwright runs tests in parallel by default - great for batch processing!
4. **Headless Mode**: Use `--headless` flag for faster execution (no GUI)

## ⚠️ Common Issues

**"Dev server is NOT running"**
- Start dev server: `npm run dev`

**"Files not found"**
- Check CSV file paths in configuration
- Verify file permissions

**"Objective not found"**
- Check exact spelling in dropdown
- Use debug mode to see available options

**"Download button not found"**
- Increase timeout in test
- Check if PDF generation completed successfully

## 🎯 Examples

**Generate CTWA report for RMODA:**
```bash
./generate-report.sh ctwa "RMODA WORKSHOP"
```

**Generate CPAS report for Client X:**
```bash
./generate-report.sh cpas "Client X" "test-data/cpas-this" "test-data/cpas-last"
```

**Generate ALL reports (configured in file):**
```bash
npm run automate:all:headless
```

## 📈 Performance

- **Single report**: ~40-50 seconds
- **Multiple reports (parallel)**: ~40-60 seconds total (not per report!)
- **Headless mode**: 20-30% faster

## 🔄 Next Steps

- [ ] Setup cron job for daily/weekly reports
- [ ] Integrate with cloud storage (Google Drive, Dropbox)
- [ ] Add email notifications
- [ ] Create dashboard for tracking report generation
- [ ] Add retry logic for failed reports
