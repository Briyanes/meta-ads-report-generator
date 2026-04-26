import { chromium, Browser, BrowserContext } from 'playwright';
import * as path from 'path';
import * as fs from 'fs';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

/**
 * Automate CTWA report generation for RMODA Workshop
 * This script uploads CSV files and generates PDF report automatically
 */
async function generateRMODAReport() {
  let browser: Browser | null = null;
  let context: BrowserContext | null = null;

  try {
    console.log('🚀 Starting Playwright automation for RMODA Workshop CTWA report...\n');
    console.log('📍 Base URL:', BASE_URL);

    // Launch browser
    console.log('\n📌 Step 1: Launching Chromium browser...');
    browser = await chromium.launch({
      headless: false, // Set to true for headless mode
      slowMo: 300 // Slow down for visibility
    });

    context = await browser.newContext({
      acceptDownloads: true,
      viewport: { width: 1920, height: 1080 }
    });

    const page = await context.newPage();

    // Navigate to Meta Ads page
    console.log('📌 Step 2: Navigating to Meta Ads page...');
    await page.goto(`${BASE_URL}/meta-ads`, { waitUntil: 'domcontentloaded' });
    console.log('✅ Page loaded');

    // Wait for page to be fully interactive
    await page.waitForTimeout(2000);

    // Select CTWA objective type if dropdown is visible
    console.log('\n📌 Step 3: Selecting CTWA objective type...');
    try {
      // Try to find select element for objective type
      const selectExists = await page.locator('select').count() > 0;
      if (selectExists) {
        const objectiveSelect = page.locator('select').first();
        await objectiveSelect.selectOption('ctwa');
        console.log('✅ CTWA objective selected');
      } else {
        console.log('ℹ️  No objective dropdown found, using default');
      }
    } catch (e) {
      console.log('ℹ️  Objective selection skipped:', (e as Error).message);
    }

    // Get file paths
    const thisMonthPath = path.join(process.cwd(), 'test-data/bulan ini');
    const lastMonthPath = path.join(process.cwd(), 'test-data/bulan lalu');

    // Upload this month files
    console.log('\n📌 Step 4: Uploading THIS MONTH files...');
    const thisMonthFiles = [
      'rmoda-workshop-bulan-ini-ad-creative.csv',
      'rmoda-workshop-bulan-ini-age-gender.csv',
      'rmoda-workshop-bulan-ini-objective.csv',
      'rmoda-workshop-bulan-ini-platform-placement.csv',
      'rmoda-workshop-bulan-ini-region.csv'
    ];

    // Look for file input for this month/this period
    const fileInputs = await page.$$('input[type="file"]');
    console.log(`   Found ${fileInputs.length} file input(s)`);

    if (fileInputs.length >= 1) {
      for (const file of thisMonthFiles) {
        const filePath = path.join(thisMonthPath, file);
        if (fs.existsSync(filePath)) {
          console.log(`  📄 Uploading: ${file}`);
          await fileInputs[0].setInputFiles(filePath);
          await page.waitForTimeout(300);
        } else {
          console.log(`  ⚠️  File not found: ${file}`);
        }
      }
      console.log('✅ This month files uploaded');
    } else {
      console.log('❌ No file input found for this month');
    }

    // Upload last month files
    console.log('\n📌 Step 5: Upload LAST MONTH files...');
    const lastMonthFiles = [
      'rmoda-workshop-bulan-lalu-ad-creative.csv',
      'rmoda-workshop-bulan-lalu-age-gender.csv',
      'rmoda-workshop-bulan-lalu-objective.csv',
      'rmoda-workshop-bulan-lalu-platform-placement.csv',
      'rmoda-workshop-bulan-lalu-region.csv'
    ];

    if (fileInputs.length >= 2) {
      for (const file of lastMonthFiles) {
        const filePath = path.join(lastMonthPath, file);
        if (fs.existsSync(filePath)) {
          console.log(`  📄 Uploading: ${file}`);
          await fileInputs[1].setInputFiles(filePath);
          await page.waitForTimeout(300);
        } else {
          console.log(`  ⚠️  File not found: ${file}`);
        }
      }
      console.log('✅ Last month files uploaded');
    } else {
      console.log('❌ No file input found for last month');
    }

    // Wait for files to be processed
    console.log('\n📌 Step 6: Waiting for files to be processed...');
    await page.waitForTimeout(3000);

    // Take screenshot before clicking analyze
    console.log('\n📸 Taking screenshot (before analysis)...');
    await page.screenshot({
      path: 'playwright-report/01-before-analyze.png',
      fullPage: true
    });

    // Click Analyze button
    console.log('\n📌 Step 7: Clicking Analyze button...');
    try {
      const analyzeButton = page.locator('button:has-text("Analyze"), button:has-text("analyze")').first();
      await analyzeButton.click();
      console.log('✅ Analyze button clicked');

      // Wait for analysis to complete
      console.log('⏳ Waiting for analysis (may take 10-30 seconds)...');
      await page.waitForTimeout(15000);

    } catch (e) {
      console.log('⚠️  Analyze button not found or click failed:', (e as Error).message);
    }

    // Take screenshot after analysis
    console.log('\n📸 Taking screenshot (after analysis)...');
    await page.screenshot({
      path: 'playwright-report/02-after-analyze.png',
      fullPage: true
    });

    // Click Generate Report button
    console.log('\n📌 Step 8: Clicking Generate Report button...');
    try {
      const generateButton = page.locator('button:has-text("Generate Report"), button:has-text("Generate")').first();
      await generateButton.click();
      console.log('✅ Generate button clicked');

      // Wait for PDF generation
      console.log('⏳ Waiting for PDF generation (may take 10-30 seconds)...');
      await page.waitForTimeout(20000);

    } catch (e) {
      console.log('⚠️  Generate button not found or click failed:', (e as Error).message);
    }

    // Take screenshot after generation
    console.log('\n📸 Taking screenshot (after generation)...');
    await page.screenshot({
      path: 'playwright-report/03-after-generate.png',
      fullPage: true
    });

    // Look for download button
    console.log('\n📌 Step 9: Looking for download button...');
    try {
      const downloadButton = page.locator('button:has-text("Download PDF"), button:has-text("Download"), a:has-text("Download")').first();

      if (await downloadButton.isVisible({ timeout: 5000 })) {
        console.log('✅ Download button found');

        // Setup download handler
        const [download] = await Promise.all([
          page.waitForEvent('download'),
          downloadButton.click()
        ]);

        // Save download
        const downloadPath = path.join(process.cwd(), 'downloads');
        if (!fs.existsSync(downloadPath)) {
          fs.mkdirSync(downloadPath, { recursive: true });
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        const filename = `RMODA-WORKSHOP-CTWA-${timestamp}.pdf`;
        const savePath = path.join(downloadPath, filename);

        await download.saveAs(savePath);

        console.log(`\n✅ Report downloaded: ${filename}`);
        const stats = fs.statSync(savePath);
        console.log(`📊 File size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
        console.log(`📁 Saved to: ${savePath}`);

      } else {
        console.log('⚠️  Download button not found');
        console.log('ℹ️  Report might still be generating or download is automatic');

        // Check if download happened automatically
        console.log('🔍 Checking for automatic downloads...');
      }

    } catch (e) {
      console.log('⚠️  Download failed:', (e as Error).message);
    }

    // Final screenshot
    console.log('\n📸 Taking final screenshot...');
    await page.screenshot({
      path: 'playwright-report/04-final.png',
      fullPage: true
    });

    // Keep browser open for inspection
    console.log('\n⏳ Keeping browser open for 10 seconds for manual inspection...');
    console.log('💡 You can interact with the browser if needed');
    await page.waitForTimeout(10000);

    console.log('\n✨ Automation completed!');
    console.log('\n📁 Screenshots saved to: playwright-report/');
    console.log('📁 Downloads saved to: downloads/');

  } catch (error) {
    console.error('\n❌ Error during automation:', error);

    // Take error screenshot
    if (context) {
      const pages = context.pages();
      if (pages.length > 0) {
        await pages[0].screenshot({
          path: 'playwright-report/error-screenshot.png',
          fullPage: true
        });
        console.log('📸 Error screenshot saved');
      }
    }

    throw error;
  } finally {
    if (context) {
      await context.close();
    }
    if (browser) {
      await browser.close();
    }
  }
}

// Check if dev server is needed
async function checkDevServer() {
  console.log('🔍 Checking if dev server is running...');

  try {
    const response = await fetch(`${BASE_URL}/api/health`).catch(() => null);
    if (response) {
      console.log('✅ Dev server is running');
      return true;
    }
  } catch (e) {
    // Ignore
  }

  console.log('⚠️  Dev server is NOT running');
  console.log('\n💡 Please start the dev server in another terminal:');
  console.log('   npm run dev');
  console.log('\nThen run this script again.');
  return false;
}

// Main execution
(async () => {
  console.log('═════════════════════════════════════════════════════════');
  console.log('   RMODA WORKSHOP - CTWA Report Automation');
  console.log('═════════════════════════════════════════════════════════\n');

  // Check if dev server is running
  const serverRunning = await checkDevServer();

  if (!serverRunning) {
    console.log('\n❌ Cannot proceed without dev server');
    console.log('\n💡 To run everything automatically, use:');
    console.log('   Terminal 1: npm run dev');
    console.log('   Terminal 2: npm run automate:rmoda');
    process.exit(1);
  }

  await generateRMODAReport();
})();
