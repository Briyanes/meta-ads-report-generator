import { test } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

test('Generate CTWA report and save screenshots - RMODA Workshop', async ({ page }) => {
  test.setTimeout(180000);

  console.log('🚀 Generating CTWA report for RMODA Workshop...\n');

  // Navigate to page
  await page.goto('/meta-ads');
  await page.waitForLoadState('domcontentloaded');

  // Select CTWA
  console.log('📌 Selecting CTWA...');
  await page.locator('select').nth(1).selectOption('CTWA');

  // Upload files
  console.log('📌 Uploading CSV files...');
  const fileInputs = page.locator('input[type="file"]');

  // This month
  const thisMonthFiles = fs.readdirSync('test-data/bulan ini')
    .filter(f => f.endsWith('.csv'))
    .sort();

  for (const file of thisMonthFiles) {
    const filePath = path.join('test-data/bulan ini', file);
    await fileInputs.nth(0).setInputFiles(filePath);
    await page.waitForTimeout(200);
  }

  // Last month
  const lastMonthFiles = fs.readdirSync('test-data/bulan lalu')
    .filter(f => f.endsWith('.csv'))
    .sort();

  for (const file of lastMonthFiles) {
    const filePath = path.join('test-data/bulan lalu', file);
    await fileInputs.nth(1).setInputFiles(filePath);
    await page.waitForTimeout(200);
  }

  console.log(`✅ Uploaded ${thisMonthFiles.length} + ${lastMonthFiles.length} files\n`);

  // Analyze
  console.log('📌 Analyzing data...');
  await page.locator('button:has-text("Analyze")').first().click();

  console.log('⏳ Waiting for analysis (may take 30-60 seconds)...');
  await page.waitForSelector('button:has-text("Generate HTML Report")', { timeout: 60000 });
  console.log('✅ Analysis complete!\n');

  // Screenshot analysis result
  await page.screenshot({
    path: 'playwright-report/rmoda-analysis-result.png',
    fullPage: true
  });
  console.log('📸 Screenshot: Analysis result saved\n');

  // Generate report
  console.log('📌 Generating HTML Report...');
  await page.locator('button:has-text("Generate HTML Report")').first().click();

  console.log('⏳ Waiting for PDF generation (may take 20-40 seconds)...');
  await page.waitForSelector('button:has-text("Download PDF")', { timeout: 60000 });
  console.log('✅ PDF generated!\n');

  // Wait a bit for rendering
  await page.waitForTimeout(3000);

  // Screenshot the generated report
  await page.screenshot({
    path: 'playwright-report/rmoda-generated-report.png',
    fullPage: true
  });
  console.log('📸 Screenshot: Generated report saved\n');

  // Take multiple screenshots of different sections
  const viewportHeight = 1080;
  const totalHeight = await page.evaluate(() => document.body.scrollHeight);

  console.log(`📸 Capturing report sections...`);
  for (let y = 0; y < totalHeight; y += viewportHeight - 100) {
    await page.evaluate((yPos) => window.scrollTo(0, yPos), y);
    await page.waitForTimeout(500);

    const sectionNum = Math.floor(y / (viewportHeight - 100)) + 1;
    await page.screenshot({
      path: `playwright-report/rmoda-section-${sectionNum}.png`,
      fullPage: false
    });
  }

  console.log(`✅ Captured ${Math.ceil(totalHeight / (viewportHeight - 100))} sections\n`);

  // Click download (even if we can't capture the event)
  console.log('📌 Clicking download...');
  const downloadButton = page.locator('button:has-text("Download PDF")').first();

  if (await downloadButton.isVisible()) {
    await downloadButton.click();
    console.log('✅ Download clicked\n');
    console.log('💡 Please check your browser downloads or ~/Downloads folder for the PDF\n');
  }

  // Keep browser open for 30 seconds for manual inspection
  console.log('⏳ Keeping browser open for 30 seconds for manual inspection...');
  console.log('💡 You can check the report in the browser window!\n');
  await page.waitForTimeout(30000);

  console.log('✨ Done! Check playwright-report/ for screenshots');
  console.log('📁 Report should be in ~/Downloads or browser downloads folder\n');
});
