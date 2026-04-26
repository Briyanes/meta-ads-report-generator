import { test, expect } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

interface ReportConfig {
  clientName: string;
  objective: 'ctwa' | 'cpas' | 'ctlptowa' | 'ctlptopurchase';
  thisPeriodPath: string;
  lastPeriodPath: string;
}

test.describe('Meta Ads Report Generator - All Objectives', () => {
  const reports: ReportConfig[] = [
    {
      clientName: 'RMODA WORKSHOP',
      objective: 'ctwa',
      thisPeriodPath: path.join(process.cwd(), 'test-data/bulan ini'),
      lastPeriodPath: path.join(process.cwd(), 'test-data/bulan lalu'),
    },
    // Add more reports here as needed
    // {
    //   clientName: 'ANOTHER CLIENT',
    //   objective: 'cpas',
    //   thisPeriodPath: path.join(process.cwd(), 'test-data/cpas-this-month'),
    //   lastPeriodPath: path.join(process.cwd(), 'test-data/cpas-last-month'),
    // },
  ];

  reports.forEach((report) => {
    test(`Generate ${report.objective.toUpperCase()} report for ${report.clientName}`, async ({ page }) => {
      console.log(`\n🚀 Generating ${report.objective.toUpperCase()} report for ${report.clientName}...`);

      // Navigate to Meta Ads page
      await page.goto('/meta-ads');
      await page.waitForLoadState('domcontentloaded');

      // Step 1: Select objective type
      console.log(`📌 Step 1: Selecting ${report.objective.toUpperCase()} objective...`);
      const selectExists = await page.locator('select').count() > 0;
      if (selectExists) {
        try {
          const secondSelect = page.locator('select').nth(1);
          const options = await secondSelect.locator('option').allTextContents();
          console.log('  Available options:', options);

          // Map objective names to option labels
          const objectiveMap: Record<string, string> = {
            'ctwa': 'CTWA',
            'cpas': 'CPAS',
            'ctlptowa': 'CTLP to WA',
            'ctlptopurchase': 'CTLP to Purchase',
          };

          const targetOption = objectiveMap[report.objective];
          if (targetOption && options.includes(targetOption)) {
            await secondSelect.selectOption({ label: targetOption });
            console.log(`✅ ${targetOption} selected`);
          } else {
            console.log(`⚠️  ${targetOption} not found, using default`);
          }
        } catch (e) {
          console.log('ℹ️  Objective selection skipped:', (e as Error).message);
        }
      }

      // Step 2: Get CSV files from directories
      console.log('📌 Step 2: Getting CSV files...');
      const thisMonthFiles = fs.readdirSync(report.thisPeriodPath)
        .filter(f => f.endsWith('.csv'))
        .sort();

      const lastMonthFiles = fs.readdirSync(report.lastPeriodPath)
        .filter(f => f.endsWith('.csv'))
        .sort();

      console.log(`   Found ${thisMonthFiles.length} files for this period`);
      console.log(`   Found ${lastMonthFiles.length} files for last period`);

      // Step 3: Upload this period files
      console.log('📌 Step 3: Uploading this period CSV files...');
      const fileInputs = page.locator('input[type="file"]');
      const inputCount = await fileInputs.count();
      console.log(`   Found ${inputCount} file input(s)`);

      if (inputCount >= 1) {
        for (const file of thisMonthFiles) {
          const filePath = path.join(report.thisPeriodPath, file);
          if (fs.existsSync(filePath)) {
            console.log(`  📄 Uploading: ${file}`);
            await fileInputs.nth(0).setInputFiles(filePath);
            await page.waitForTimeout(300);
          }
        }
        console.log(`✅ Uploaded ${thisMonthFiles.length} this period files`);
      }

      // Step 4: Upload last period files
      console.log('📌 Step 4: Upload last period CSV files...');
      if (inputCount >= 2) {
        for (const file of lastMonthFiles) {
          const filePath = path.join(report.lastPeriodPath, file);
          if (fs.existsSync(filePath)) {
            console.log(`  📄 Uploading: ${file}`);
            await fileInputs.nth(1).setInputFiles(filePath);
            await page.waitForTimeout(300);
          }
        }
        console.log(`✅ Uploaded ${lastMonthFiles.length} last period files`);
      }

      // Step 5: Wait for files to process
      console.log('📌 Step 5: Waiting for files to process...');
      await page.waitForTimeout(3000);

      // Step 6: Click Analyze button
      console.log('📌 Step 6: Clicking Analyze button...');
      const analyzeButton = page.locator('button:has-text("Analyze")').first();
      await analyzeButton.click();
      console.log('✅ Analyze clicked');

      // Wait for analysis to complete
      console.log('⏳ Waiting for analysis to complete...');
      try {
        await page.waitForSelector('button:has-text("Generate HTML Report"), button:has-text("2. Generate HTML Report")', {
          timeout: 60000
        });
        console.log('✅ Analysis completed!');
      } catch (e) {
        console.log('⚠️  Analysis timeout, taking screenshot...');
        await page.screenshot({
          path: `playwright-report/${report.objective}-error-after-analyze.png`,
          fullPage: true
        });
        throw e;
      }

      // Step 7: Click Generate Report button
      console.log('📌 Step 7: Clicking Generate HTML Report button...');
      const generateButton = page.locator('button:has-text("Generate HTML Report"), button:has-text("2. Generate HTML Report")').first();
      await generateButton.waitFor({ state: 'visible', timeout: 10000 });
      await generateButton.click();
      console.log('✅ Generate clicked');

      // Wait for PDF generation
      console.log('⏳ Waiting for PDF generation...');
      try {
        await page.waitForSelector('button:has-text("Download PDF"), button:has-text("Download"), a:has-text("PDF")', {
          timeout: 60000
        });
        console.log('✅ PDF generation completed!');
      } catch (e) {
        console.log('⚠️  PDF generation timeout, taking screenshot...');
        await page.screenshot({
          path: `playwright-report/${report.objective}-error-after-generate.png`,
          fullPage: true
        });
        throw e;
      }

      // Step 8: Download PDF
      console.log('📌 Step 8: Looking for download button...');
      const downloadButton = page.locator('button:has-text("Download PDF"), button:has-text("Download"), a:has-text("PDF")').first();

      if (await downloadButton.isVisible({ timeout: 5000 })) {
        console.log('✅ Download button found');

        // Setup download handler
        const downloadPromise = page.waitForEvent('download', { timeout: 30000 });
        await downloadButton.click();
        console.log('✅ Download button clicked');

        try {
          const download = await downloadPromise;

          // Save download
          const downloadPath = path.join(process.cwd(), 'downloads');
          if (!fs.existsSync(downloadPath)) {
            fs.mkdirSync(downloadPath, { recursive: true });
          }

          const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
          const suggestedFilename = download.suggestedFilename();
          const filename = suggestedFilename || `${report.clientName}-${report.objective}-${timestamp}.pdf`;
          const savePath = path.join(downloadPath, filename);

          await download.saveAs(savePath);

          console.log(`\n✅ Report downloaded: ${filename}`);
          const stats = fs.statSync(savePath);
          console.log(`📊 File size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);

          // Verify file exists and is not empty
          expect(stats.size).toBeGreaterThan(0);

        } catch (e) {
          console.log('⚠️  Download event not detected. Taking screenshot...');
          await page.screenshot({
            path: `playwright-report/${report.objective}-download-attempt.png`,
            fullPage: true
          });
        }

      } else {
        console.log('⚠️  Download button not found');
      }

      // Final screenshot
      await page.screenshot({
        path: `playwright-report/${report.objective}-final.png`,
        fullPage: true
      });

      console.log(`\n✨ ${report.objective.toUpperCase()} automation completed!`);
    });
  });

  test('Debug: List all available objectives', async ({ page }) => {
    console.log('🔍 Checking available objectives...');

    await page.goto('/meta-ads');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    const secondSelect = page.locator('select').nth(1);
    const options = await secondSelect.locator('option').allTextContents();

    console.log('\n📋 Available objectives:');
    options.forEach((option, index) => {
      console.log(`  ${index + 1}. ${option}`);
    });

    console.log('\n💡 You can use these objectives in your automation:');
    console.log('  - ctwa       (CTWA)');
    console.log('  - cpas       (CPAS)');
    console.log('  - ctlptowa   (CTLP to WA)');
    console.log('  - ctlptopurchase (CTLP to Purchase)');
  });
});
