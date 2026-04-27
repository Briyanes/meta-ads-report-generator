# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: rmoda-workshop-ctwa.spec.ts >> RMODA Workshop - CTWA Report Generation >> Generate CTWA report for RMODA Workshop
- Location: app/e2e/rmoda-workshop-ctwa.spec.ts:12:7

# Error details

```
Test timeout of 180000ms exceeded.
```

```
Error: locator.click: Test timeout of 180000ms exceeded.
Call log:
  - waiting for locator('button:has-text("Analyze")').first()
    - locator resolved to <button disabled aria-busy="false" aria-describedby="analyze-error" aria-label="Analyze uploaded CSV files">…</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is not enabled
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is not enabled
    - retrying click action
      - waiting 100ms
    323 × waiting for element to be visible, enabled and stable
        - element is not enabled
      - retrying click action
        - waiting 500ms

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
  2   | import * as path from 'path';
  3   | import * as fs from 'fs';
  4   | 
  5   | test.describe('RMODA Workshop - CTWA Report Generation', () => {
  6   |   test.beforeEach(async ({ page }) => {
  7   |     // Navigate to Meta Ads page
  8   |     await page.goto('/meta-ads');
  9   |     await page.waitForLoadState('domcontentloaded');
  10  |   });
  11  | 
  12  |   test('Generate CTWA report for RMODA Workshop', async ({ page }) => {
  13  |     // Increase test timeout to 3 minutes for analysis and PDF generation
  14  |     test.setTimeout(180000);
  15  |     console.log('🚀 Starting RMODA Workshop CTWA report generation...');
  16  | 
  17  |     // Step 1: Select CTWA objective type
  18  |     console.log('📌 Step 1: Selecting CTWA objective...');
  19  |     const selectExists = await page.locator('select').count() > 0;
  20  |     if (selectExists) {
  21  |       // Try to find and select CTWA option in second select (objective type selector)
  22  |       try {
  23  |         const secondSelect = page.locator('select').nth(1);
  24  |         const options = await secondSelect.locator('option').allTextContents();
  25  |         console.log('  Available options:', options);
  26  | 
  27  |         // Look for CTWA in options
  28  |         const ctwaOption = options.find(o => o.toLowerCase().includes('ctwa'));
  29  |         if (ctwaOption) {
  30  |           await secondSelect.selectOption({ label: ctwaOption });
  31  |           console.log('✅ CTWA selected');
  32  |         } else {
  33  |           console.log('ℹ️  CTWA not in options, using default');
  34  |         }
  35  |       } catch (e) {
  36  |         console.log('ℹ️  Objective selection skipped:', (e as Error).message);
  37  |       }
  38  |     }
  39  | 
  40  |     // Step 2: Upload this month files
  41  |     console.log('📌 Step 2: Uploading this month CSV files...');
  42  |     const thisMonthPath = path.join(process.cwd(), 'test-data/bulan ini');
  43  |     const thisMonthFiles = [
  44  |       'rmoda-workshop-bulan-ini-ad-creative.csv',
  45  |       'rmoda-workshop-bulan-ini-age-gender.csv',
  46  |       'rmoda-workshop-bulan-ini-objective.csv',
  47  |       'rmoda-workshop-bulan-ini-platform-placement.csv',
  48  |       'rmoda-workshop-bulan-ini-region.csv'
  49  |     ];
  50  | 
  51  |     const fileInputs = page.locator('input[type="file"]');
  52  |     const inputCount = await fileInputs.count();
  53  |     console.log(`   Found ${inputCount} file input(s)`);
  54  | 
  55  |     if (inputCount >= 1) {
  56  |       for (const file of thisMonthFiles) {
  57  |         const filePath = path.join(thisMonthPath, file);
  58  |         if (fs.existsSync(filePath)) {
  59  |           console.log(`  📄 Uploading: ${file}`);
  60  |           await fileInputs.nth(0).setInputFiles(filePath);
  61  |           await page.waitForTimeout(300);
  62  |         } else {
  63  |           console.log(`  ⚠️  File not found: ${file}`);
  64  |         }
  65  |       }
  66  |     }
  67  | 
  68  |     // Step 3: Upload last month files
  69  |     console.log('📌 Step 3: Uploading last month CSV files...');
  70  |     const lastMonthPath = path.join(process.cwd(), 'test-data/bulan lalu');
  71  |     const lastMonthFiles = [
  72  |       'rmoda-workshop-bulan-lalu-ad-creative.csv',
  73  |       'rmoda-workshop-bulan-lalu-age-gender.csv',
  74  |       'rmoda-workshop-bulan-lalu-objective.csv',
  75  |       'rmoda-workshop-bulan-lalu-platform-placement.csv',
  76  |       'rmoda-workshop-bulan-lalu-region.csv'
  77  |     ];
  78  | 
  79  |     if (inputCount >= 2) {
  80  |       for (const file of lastMonthFiles) {
  81  |         const filePath = path.join(lastMonthPath, file);
  82  |         if (fs.existsSync(filePath)) {
  83  |           console.log(`  📄 Uploading: ${file}`);
  84  |           await fileInputs.nth(1).setInputFiles(filePath);
  85  |           await page.waitForTimeout(300);
  86  |         } else {
  87  |           console.log(`  ⚠️  File not found: ${file}`);
  88  |         }
  89  |       }
  90  |     }
  91  | 
  92  |     // Step 4: Wait for files to be processed
  93  |     console.log('📌 Step 4: Waiting for files to process...');
  94  |     await page.waitForTimeout(3000);
  95  | 
  96  |     // Screenshot before analysis
  97  |     await page.screenshot({ path: 'playwright-report/01-before-analyze.png', fullPage: true });
  98  | 
  99  |     // Step 5: Click Analyze button
  100 |     console.log('📌 Step 5: Clicking Analyze button...');
  101 |     const analyzeButton = page.locator('button:has-text("Analyze")').first();
> 102 |     await analyzeButton.click();
      |                         ^ Error: locator.click: Test timeout of 180000ms exceeded.
  103 |     console.log('✅ Analyze clicked');
  104 | 
  105 |     // Wait for analysis to complete (may take 20-60 seconds)
  106 |     console.log('⏳ Waiting for analysis to complete...');
  107 |     // Wait for "Generate HTML Report" button to appear, which means analysis is done
  108 |     try {
  109 |       await page.waitForSelector('button:has-text("Generate HTML Report"), button:has-text("2. Generate HTML Report")', {
  110 |         timeout: 60000
  111 |       });
  112 |       console.log('✅ Analysis completed!');
  113 |     } catch (e) {
  114 |       console.log('⚠️  Generate HTML Report button not found after 60s, taking screenshot...');
  115 |       await page.screenshot({ path: 'playwright-report/error-after-analyze.png', fullPage: true });
  116 |       throw e;
  117 |     }
  118 | 
  119 |     // Screenshot after analysis
  120 |     await page.screenshot({ path: 'playwright-report/02-after-analyze.png', fullPage: true });
  121 | 
  122 |     // Step 6: Click Generate HTML Report button
  123 |     console.log('📌 Step 6: Clicking Generate HTML Report button...');
  124 |     const generateButton = page.locator('button:has-text("Generate HTML Report"), button:has-text("2. Generate HTML Report")').first();
  125 | 
  126 |     // Wait for button to be visible and enabled
  127 |     await generateButton.waitFor({ state: 'visible', timeout: 10000 });
  128 |     await generateButton.click();
  129 |     console.log('✅ Generate clicked');
  130 | 
  131 |     // Wait for PDF generation to complete (may take 20-60 seconds)
  132 |     console.log('⏳ Waiting for PDF generation...');
  133 |     try {
  134 |       // Wait for download button to appear
  135 |       await page.waitForSelector('button:has-text("Download PDF"), button:has-text("Download"), a:has-text("Download")', {
  136 |         timeout: 60000
  137 |       });
  138 |       console.log('✅ PDF generation completed!');
  139 |     } catch (e) {
  140 |       console.log('⚠️  Download button not found after 60s, taking screenshot...');
  141 |       await page.screenshot({ path: 'playwright-report/error-after-generate.png', fullPage: true });
  142 |       throw e;
  143 |     }
  144 | 
  145 |     // Screenshot after generation
  146 |     await page.screenshot({ path: 'playwright-report/03-after-generate.png', fullPage: true });
  147 | 
  148 |     // Step 7: Download PDF
  149 |     console.log('📌 Step 7: Looking for download button...');
  150 |     const downloadButton = page.locator('button:has-text("Download PDF"), button:has-text("Download"), a:has-text("PDF")').first();
  151 | 
  152 |     if (await downloadButton.isVisible({ timeout: 5000 })) {
  153 |       console.log('✅ Download button found');
  154 | 
  155 |       // Setup download handler before clicking
  156 |       const downloadPromise = page.waitForEvent('download', { timeout: 30000 });
  157 | 
  158 |       // Click download button
  159 |       await downloadButton.click();
  160 |       console.log('✅ Download button clicked');
  161 | 
  162 |       // Wait for download to start
  163 |       try {
  164 |         const download = await downloadPromise;
  165 | 
  166 |         // Save download
  167 |         const downloadPath = path.join(process.cwd(), 'downloads');
  168 |         if (!fs.existsSync(downloadPath)) {
  169 |           fs.mkdirSync(downloadPath, { recursive: true });
  170 |         }
  171 | 
  172 |         const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  173 |         const suggestedFilename = download.suggestedFilename();
  174 |         const filename = suggestedFilename || `RMODA-WORKSHOP-CTWA-${timestamp}.pdf`;
  175 |         const savePath = path.join(downloadPath, filename);
  176 | 
  177 |         await download.saveAs(savePath);
  178 | 
  179 |         console.log(`\n✅ Report downloaded: ${filename}`);
  180 |         const stats = fs.statSync(savePath);
  181 |         console.log(`📊 File size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
  182 | 
  183 |         // Verify file exists and is not empty
  184 |         expect(stats.size).toBeGreaterThan(0);
  185 | 
  186 |       } catch (e) {
  187 |         console.log('⚠️  Download event not detected. PDF might have opened in new tab or downloaded differently.');
  188 |         console.log('💡 Taking screenshot for manual verification...');
  189 |         await page.screenshot({ path: 'playwright-report/download-attempt.png', fullPage: true });
  190 | 
  191 |         // Check if PDF opened in new tab
  192 |         const pages = page.context().pages();
  193 |         console.log(`   Current pages: ${pages.length}`);
  194 | 
  195 |         if (pages.length > 1) {
  196 |           console.log('✅ PDF opened in new tab!');
  197 |           const pdfPage = pages[pages.length - 1];
  198 |           await pdfPage.waitForLoadState('networkidle');
  199 |           const timestamp = Date.now();
  200 |           await pdfPage.pdf({ path: `downloads/RMODA-WORKSHOP-CTWA-${timestamp}.pdf` });
  201 |           console.log(`✅ PDF saved from new tab: RMODA-WORKSHOP-CTWA-${timestamp}.pdf`);
  202 |         }
```