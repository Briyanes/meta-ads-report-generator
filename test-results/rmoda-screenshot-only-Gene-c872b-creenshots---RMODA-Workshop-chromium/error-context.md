# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: rmoda-screenshot-only.spec.ts >> Generate CTWA report and save screenshots - RMODA Workshop
- Location: app/e2e/rmoda-screenshot-only.spec.ts:5:5

# Error details

```
Test timeout of 180000ms exceeded.
```

```
Error: locator.selectOption: Test timeout of 180000ms exceeded.
Call log:
  - waiting for locator('select').nth(1)

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - banner [ref=e3]:
      - generic [ref=e4]:
        - link "Navigate back to home page" [ref=e5] [cursor=pointer]:
          - /url: /home
          - generic [ref=e6]:
            - heading "Meta Ads Report Generator" [level=1] [ref=e7]
            - paragraph [ref=e8]: Powered by Hadona Digital Media•v2.0.0
        - link "Hadona Digital Media" [ref=e10] [cursor=pointer]:
          - /url: https://hadona.id
          - img "Hadona Digital Media" [ref=e11]
    - main [ref=e13]:
      - generic [ref=e14]:
        - generic [ref=e16]:
          - generic [ref=e17]:
            - generic [ref=e18]: Nama Report (Opsional)
            - textbox "Weekly Report - Week 1" [ref=e19]
          - generic [ref=e20]:
            - generic [ref=e21]: Pemilihan Retensi
            - combobox "Select retention comparison type" [ref=e22] [cursor=pointer]:
              - option "WoW (Week-on-Week)" [selected]
              - option "MoM (Month-on-Month)"
          - generic [ref=e23]:
            - generic [ref=e24]: Pemilihan Iklan Objective
            - generic [ref=e25]:
              - radio "Click to WhatsApp objective" [checked] [ref=e26] [cursor=pointer]:
                - generic [ref=e28]: 
                - generic [ref=e29]:
                  - generic [ref=e31]: 
                  - generic [ref=e32]:
                    - paragraph [ref=e33]: CTWA
                    - paragraph [ref=e34]: Click to WhatsApp
                - paragraph [ref=e35]: Optimize for WhatsApp conversations
              - radio "Collaborative Ads with creators objective" [ref=e36] [cursor=pointer]:
                - generic [ref=e37]:
                  - generic [ref=e39]: 
                  - generic [ref=e40]:
                    - paragraph [ref=e41]: CPAS
                    - paragraph [ref=e42]: Collab Ads
                - paragraph [ref=e43]: Collaborative advertising with creators
              - radio "Click to Link to WhatsApp objective" [ref=e44] [cursor=pointer]:
                - generic [ref=e45]:
                  - generic [ref=e47]: 
                  - generic [ref=e48]:
                    - paragraph [ref=e49]: CTLP to WA
                    - paragraph [ref=e50]: Click Link to WhatsApp
                - paragraph [ref=e51]: Link clicks to WhatsApp conversations
              - radio "Click to Link to Purchase objective" [ref=e52] [cursor=pointer]:
                - generic [ref=e53]:
                  - generic [ref=e55]: 
                  - generic [ref=e56]:
                    - paragraph [ref=e57]: CTLP to Purchase
                    - paragraph [ref=e58]: Click Link to Purchase
                - paragraph [ref=e59]: Link clicks to website purchases
        - generic [ref=e61]:
          - heading " Metrics for CTWA" [level=2] [ref=e62]:
            - generic [ref=e63]: 
            - text: Metrics for CTWA
          - button " Read More" [ref=e64] [cursor=pointer]:
            - generic [ref=e65]: 
            - text: Read More
        - generic [ref=e66]:
          - 'heading "Upload CSV Files untuk: Week-on-Week Analysis" [level=2] [ref=e67]':
            - text: "Upload CSV Files untuk:"
            - text: Week-on-Week Analysis
          - paragraph [ref=e68]: Upload file utama + file breakdown (age, gender, region, platform, placement, objective, ad-creative)
          - generic [ref=e69]:
            - generic [ref=e70]:
              - generic [ref=e71]:
                - generic [ref=e72]: 
                - text: Minggu Ini (This Week) - 0 file(s)
              - generic [ref=e73] [cursor=pointer]:
                - generic [ref=e74]:
                  - paragraph [ref=e75]:
                    - generic [ref=e76]: 
                    - text: Drag & Drop atau click untuk upload
                  - paragraph [ref=e77]: CSV files (bisa multiple)
                - generic:
                  - generic:
                    - generic: 
            - generic [ref=e78]:
              - generic [ref=e79]:
                - generic [ref=e80]: 
                - text: Minggu Lalu (Last Week) - 0 file(s)
              - generic [ref=e81] [cursor=pointer]:
                - generic [ref=e82]:
                  - paragraph [ref=e83]:
                    - generic [ref=e84]: 
                    - text: Drag & Drop atau click untuk upload
                  - paragraph [ref=e85]: CSV files (bisa multiple)
                - generic:
                  - generic:
                    - generic: 
        - generic [ref=e86]:
          - button " Back to Home" [ref=e87] [cursor=pointer]:
            - generic [ref=e88]: 
            - text: Back to Home
          - button "Analyze uploaded CSV files" [disabled] [ref=e90]:
            - generic [ref=e91]: 
            - text: 1. Analyze CSV
        - generic [ref=e93]:
          - paragraph [ref=e94]: © 2025 Ads Report Generator. Powered byHadona Digital Media
          - paragraph [ref=e95]: Designed & Developed by Briyanes
    - status [ref=e96]
  - alert [ref=e97]
```

# Test source

```ts
  1   | import { test } from '@playwright/test';
  2   | import * as path from 'path';
  3   | import * as fs from 'fs';
  4   | 
  5   | test('Generate CTWA report and save screenshots - RMODA Workshop', async ({ page }) => {
  6   |   test.setTimeout(180000);
  7   | 
  8   |   console.log('🚀 Generating CTWA report for RMODA Workshop...\n');
  9   | 
  10  |   // Navigate to page
  11  |   await page.goto('/meta-ads');
  12  |   await page.waitForLoadState('domcontentloaded');
  13  | 
  14  |   // Select CTWA
  15  |   console.log('📌 Selecting CTWA...');
> 16  |   await page.locator('select').nth(1).selectOption('CTWA');
      |                                       ^ Error: locator.selectOption: Test timeout of 180000ms exceeded.
  17  | 
  18  |   // Upload files
  19  |   console.log('📌 Uploading CSV files...');
  20  |   const fileInputs = page.locator('input[type="file"]');
  21  | 
  22  |   // This month
  23  |   const thisMonthFiles = fs.readdirSync('test-data/bulan ini')
  24  |     .filter(f => f.endsWith('.csv'))
  25  |     .sort();
  26  | 
  27  |   for (const file of thisMonthFiles) {
  28  |     const filePath = path.join('test-data/bulan ini', file);
  29  |     await fileInputs.nth(0).setInputFiles(filePath);
  30  |     await page.waitForTimeout(200);
  31  |   }
  32  | 
  33  |   // Last month
  34  |   const lastMonthFiles = fs.readdirSync('test-data/bulan lalu')
  35  |     .filter(f => f.endsWith('.csv'))
  36  |     .sort();
  37  | 
  38  |   for (const file of lastMonthFiles) {
  39  |     const filePath = path.join('test-data/bulan lalu', file);
  40  |     await fileInputs.nth(1).setInputFiles(filePath);
  41  |     await page.waitForTimeout(200);
  42  |   }
  43  | 
  44  |   console.log(`✅ Uploaded ${thisMonthFiles.length} + ${lastMonthFiles.length} files\n`);
  45  | 
  46  |   // Analyze
  47  |   console.log('📌 Analyzing data...');
  48  |   await page.locator('button:has-text("Analyze")').first().click();
  49  | 
  50  |   console.log('⏳ Waiting for analysis (may take 30-60 seconds)...');
  51  |   await page.waitForSelector('button:has-text("Generate HTML Report")', { timeout: 60000 });
  52  |   console.log('✅ Analysis complete!\n');
  53  | 
  54  |   // Screenshot analysis result
  55  |   await page.screenshot({
  56  |     path: 'playwright-report/rmoda-analysis-result.png',
  57  |     fullPage: true
  58  |   });
  59  |   console.log('📸 Screenshot: Analysis result saved\n');
  60  | 
  61  |   // Generate report
  62  |   console.log('📌 Generating HTML Report...');
  63  |   await page.locator('button:has-text("Generate HTML Report")').first().click();
  64  | 
  65  |   console.log('⏳ Waiting for PDF generation (may take 20-40 seconds)...');
  66  |   await page.waitForSelector('button:has-text("Download PDF")', { timeout: 60000 });
  67  |   console.log('✅ PDF generated!\n');
  68  | 
  69  |   // Wait a bit for rendering
  70  |   await page.waitForTimeout(3000);
  71  | 
  72  |   // Screenshot the generated report
  73  |   await page.screenshot({
  74  |     path: 'playwright-report/rmoda-generated-report.png',
  75  |     fullPage: true
  76  |   });
  77  |   console.log('📸 Screenshot: Generated report saved\n');
  78  | 
  79  |   // Take multiple screenshots of different sections
  80  |   const viewportHeight = 1080;
  81  |   const totalHeight = await page.evaluate(() => document.body.scrollHeight);
  82  | 
  83  |   console.log(`📸 Capturing report sections...`);
  84  |   for (let y = 0; y < totalHeight; y += viewportHeight - 100) {
  85  |     await page.evaluate((yPos) => window.scrollTo(0, yPos), y);
  86  |     await page.waitForTimeout(500);
  87  | 
  88  |     const sectionNum = Math.floor(y / (viewportHeight - 100)) + 1;
  89  |     await page.screenshot({
  90  |       path: `playwright-report/rmoda-section-${sectionNum}.png`,
  91  |       fullPage: false
  92  |     });
  93  |   }
  94  | 
  95  |   console.log(`✅ Captured ${Math.ceil(totalHeight / (viewportHeight - 100))} sections\n`);
  96  | 
  97  |   // Click download (even if we can't capture the event)
  98  |   console.log('📌 Clicking download...');
  99  |   const downloadButton = page.locator('button:has-text("Download PDF")').first();
  100 | 
  101 |   if (await downloadButton.isVisible()) {
  102 |     await downloadButton.click();
  103 |     console.log('✅ Download clicked\n');
  104 |     console.log('💡 Please check your browser downloads or ~/Downloads folder for the PDF\n');
  105 |   }
  106 | 
  107 |   // Keep browser open for 30 seconds for manual inspection
  108 |   console.log('⏳ Keeping browser open for 30 seconds for manual inspection...');
  109 |   console.log('💡 You can check the report in the browser window!\n');
  110 |   await page.waitForTimeout(30000);
  111 | 
  112 |   console.log('✨ Done! Check playwright-report/ for screenshots');
  113 |   console.log('📁 Report should be in ~/Downloads or browser downloads folder\n');
  114 | });
  115 | 
```