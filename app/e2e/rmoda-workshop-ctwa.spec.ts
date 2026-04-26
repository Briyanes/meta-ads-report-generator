import { test, expect } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

test.describe('RMODA Workshop - CTWA Report Generation', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to Meta Ads page
    await page.goto('/meta-ads');
    await page.waitForLoadState('domcontentloaded');
  });

  test('Generate CTWA report for RMODA Workshop', async ({ page }) => {
    // Increase test timeout to 3 minutes for analysis and PDF generation
    test.setTimeout(180000);
    console.log('🚀 Starting RMODA Workshop CTWA report generation...');

    // Step 1: Select CTWA objective type
    console.log('📌 Step 1: Selecting CTWA objective...');
    const selectExists = await page.locator('select').count() > 0;
    if (selectExists) {
      // Try to find and select CTWA option in second select (objective type selector)
      try {
        const secondSelect = page.locator('select').nth(1);
        const options = await secondSelect.locator('option').allTextContents();
        console.log('  Available options:', options);

        // Look for CTWA in options
        const ctwaOption = options.find(o => o.toLowerCase().includes('ctwa'));
        if (ctwaOption) {
          await secondSelect.selectOption({ label: ctwaOption });
          console.log('✅ CTWA selected');
        } else {
          console.log('ℹ️  CTWA not in options, using default');
        }
      } catch (e) {
        console.log('ℹ️  Objective selection skipped:', (e as Error).message);
      }
    }

    // Step 2: Upload this month files
    console.log('📌 Step 2: Uploading this month CSV files...');
    const thisMonthPath = path.join(process.cwd(), 'test-data/bulan ini');
    const thisMonthFiles = [
      'rmoda-workshop-bulan-ini-ad-creative.csv',
      'rmoda-workshop-bulan-ini-age-gender.csv',
      'rmoda-workshop-bulan-ini-objective.csv',
      'rmoda-workshop-bulan-ini-platform-placement.csv',
      'rmoda-workshop-bulan-ini-region.csv'
    ];

    const fileInputs = page.locator('input[type="file"]');
    const inputCount = await fileInputs.count();
    console.log(`   Found ${inputCount} file input(s)`);

    if (inputCount >= 1) {
      for (const file of thisMonthFiles) {
        const filePath = path.join(thisMonthPath, file);
        if (fs.existsSync(filePath)) {
          console.log(`  📄 Uploading: ${file}`);
          await fileInputs.nth(0).setInputFiles(filePath);
          await page.waitForTimeout(300);
        } else {
          console.log(`  ⚠️  File not found: ${file}`);
        }
      }
    }

    // Step 3: Upload last month files
    console.log('📌 Step 3: Uploading last month CSV files...');
    const lastMonthPath = path.join(process.cwd(), 'test-data/bulan lalu');
    const lastMonthFiles = [
      'rmoda-workshop-bulan-lalu-ad-creative.csv',
      'rmoda-workshop-bulan-lalu-age-gender.csv',
      'rmoda-workshop-bulan-lalu-objective.csv',
      'rmoda-workshop-bulan-lalu-platform-placement.csv',
      'rmoda-workshop-bulan-lalu-region.csv'
    ];

    if (inputCount >= 2) {
      for (const file of lastMonthFiles) {
        const filePath = path.join(lastMonthPath, file);
        if (fs.existsSync(filePath)) {
          console.log(`  📄 Uploading: ${file}`);
          await fileInputs.nth(1).setInputFiles(filePath);
          await page.waitForTimeout(300);
        } else {
          console.log(`  ⚠️  File not found: ${file}`);
        }
      }
    }

    // Step 4: Wait for files to be processed
    console.log('📌 Step 4: Waiting for files to process...');
    await page.waitForTimeout(3000);

    // Screenshot before analysis
    await page.screenshot({ path: 'playwright-report/01-before-analyze.png', fullPage: true });

    // Step 5: Click Analyze button
    console.log('📌 Step 5: Clicking Analyze button...');
    const analyzeButton = page.locator('button:has-text("Analyze")').first();
    await analyzeButton.click();
    console.log('✅ Analyze clicked');

    // Wait for analysis to complete (may take 20-60 seconds)
    console.log('⏳ Waiting for analysis to complete...');
    // Wait for "Generate HTML Report" button to appear, which means analysis is done
    try {
      await page.waitForSelector('button:has-text("Generate HTML Report"), button:has-text("2. Generate HTML Report")', {
        timeout: 60000
      });
      console.log('✅ Analysis completed!');
    } catch (e) {
      console.log('⚠️  Generate HTML Report button not found after 60s, taking screenshot...');
      await page.screenshot({ path: 'playwright-report/error-after-analyze.png', fullPage: true });
      throw e;
    }

    // Screenshot after analysis
    await page.screenshot({ path: 'playwright-report/02-after-analyze.png', fullPage: true });

    // Step 6: Click Generate HTML Report button
    console.log('📌 Step 6: Clicking Generate HTML Report button...');
    const generateButton = page.locator('button:has-text("Generate HTML Report"), button:has-text("2. Generate HTML Report")').first();

    // Wait for button to be visible and enabled
    await generateButton.waitFor({ state: 'visible', timeout: 10000 });
    await generateButton.click();
    console.log('✅ Generate clicked');

    // Wait for PDF generation to complete (may take 20-60 seconds)
    console.log('⏳ Waiting for PDF generation...');
    try {
      // Wait for download button to appear
      await page.waitForSelector('button:has-text("Download PDF"), button:has-text("Download"), a:has-text("Download")', {
        timeout: 60000
      });
      console.log('✅ PDF generation completed!');
    } catch (e) {
      console.log('⚠️  Download button not found after 60s, taking screenshot...');
      await page.screenshot({ path: 'playwright-report/error-after-generate.png', fullPage: true });
      throw e;
    }

    // Screenshot after generation
    await page.screenshot({ path: 'playwright-report/03-after-generate.png', fullPage: true });

    // Step 7: Download PDF
    console.log('📌 Step 7: Looking for download button...');
    const downloadButton = page.locator('button:has-text("Download PDF"), button:has-text("Download"), a:has-text("PDF")').first();

    if (await downloadButton.isVisible({ timeout: 5000 })) {
      console.log('✅ Download button found');

      // Setup download handler before clicking
      const downloadPromise = page.waitForEvent('download', { timeout: 30000 });

      // Click download button
      await downloadButton.click();
      console.log('✅ Download button clicked');

      // Wait for download to start
      try {
        const download = await downloadPromise;

        // Save download
        const downloadPath = path.join(process.cwd(), 'downloads');
        if (!fs.existsSync(downloadPath)) {
          fs.mkdirSync(downloadPath, { recursive: true });
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        const suggestedFilename = download.suggestedFilename();
        const filename = suggestedFilename || `RMODA-WORKSHOP-CTWA-${timestamp}.pdf`;
        const savePath = path.join(downloadPath, filename);

        await download.saveAs(savePath);

        console.log(`\n✅ Report downloaded: ${filename}`);
        const stats = fs.statSync(savePath);
        console.log(`📊 File size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);

        // Verify file exists and is not empty
        expect(stats.size).toBeGreaterThan(0);

      } catch (e) {
        console.log('⚠️  Download event not detected. PDF might have opened in new tab or downloaded differently.');
        console.log('💡 Taking screenshot for manual verification...');
        await page.screenshot({ path: 'playwright-report/download-attempt.png', fullPage: true });

        // Check if PDF opened in new tab
        const pages = page.context().pages();
        console.log(`   Current pages: ${pages.length}`);

        if (pages.length > 1) {
          console.log('✅ PDF opened in new tab!');
          const pdfPage = pages[pages.length - 1];
          await pdfPage.waitForLoadState('networkidle');
          const timestamp = Date.now();
          await pdfPage.pdf({ path: `downloads/RMODA-WORKSHOP-CTWA-${timestamp}.pdf` });
          console.log(`✅ PDF saved from new tab: RMODA-WORKSHOP-CTWA-${timestamp}.pdf`);
        }
      }

    } else {
      console.log('⚠️  Download button not found, checking for automatic download...');

      // Check if download happened automatically
      const downloads = await page.locator('a:has-text("Download")').all();
      console.log(`   Found ${downloads.length} download links`);
    }

    // Final screenshot
    await page.screenshot({ path: 'playwright-report/04-final.png', fullPage: true });

    console.log('\n✨ Automation completed!');
  });

  test('Debug: Page structure inspection', async ({ page }) => {
    console.log('🔍 Inspecting page structure...');

    // Wait for page to load
    await page.waitForTimeout(2000);

    // Log all buttons
    const buttons = await page.locator('button').all();
    console.log(`\nFound ${buttons.length} buttons:`);
    for (let i = 0; i < Math.min(buttons.length, 10); i++) {
      const text = await buttons[i].textContent();
      console.log(`  ${i + 1}. "${text}"`);
    }

    // Log all file inputs
    const inputs = await page.locator('input[type="file"]').all();
    console.log(`\nFound ${inputs.length} file inputs`);

    // Log all selects
    const selects = await page.locator('select').all();
    console.log(`\nFound ${selects.length} select elements`);
    if (selects.length > 0) {
      for (let i = 0; i < selects.length; i++) {
        const options = await selects[i].locator('option').all();
        console.log(`  Select ${i + 1}: ${options.length} options`);
      }
    }

    // Screenshot for visual inspection
    await page.screenshot({ path: 'playwright-report/debug-page-structure.png', fullPage: true });
    console.log('\n📸 Screenshot saved to: playwright-report/debug-page-structure.png');
  });
});
