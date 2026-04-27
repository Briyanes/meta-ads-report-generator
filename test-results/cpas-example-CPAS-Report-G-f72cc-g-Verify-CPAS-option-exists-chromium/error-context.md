# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cpas-example.spec.ts >> CPAS Report Generation >> Debug: Verify CPAS option exists
- Location: app/e2e/cpas-example.spec.ts:120:7

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected value: "CPAS"
Received array: []
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
  29  | 
  30  |     // Step 2: Upload CSV files (same structure as CTWA)
  31  |     console.log('📌 Step 2: Uploading CSV files...');
  32  |     const thisMonthPath = path.join(process.cwd(), 'test-data/cpas-this-month');
  33  |     const lastMonthPath = path.join(process.cwd(), 'test-data/cpas-last-month');
  34  | 
  35  |     // Check if paths exist
  36  |     if (!fs.existsSync(thisMonthPath) || !fs.existsSync(lastMonthPath)) {
  37  |       console.log('⚠️  CPAS data folders not found. Using RMODA data as example...');
  38  |       // Fall back to RMODA data for demonstration
  39  |       console.log('💡 To use actual CPAS data, create test-data/cpas-this-month and test-data/cpas-last-month folders');
  40  | 
  41  |       // Continue with RMODA data for demo
  42  |       // In production, you would have actual CPAS CSV files
  43  |     }
  44  | 
  45  |     const fileInputs = page.locator('input[type="file"]');
  46  |     const inputCount = await fileInputs.count();
  47  | 
  48  |     // Upload files (using RMODA data for demo)
  49  |     const thisMonthFiles = fs.readdirSync('test-data/bulan ini')
  50  |       .filter(f => f.endsWith('.csv'))
  51  |       .sort();
  52  | 
  53  |     const lastMonthFiles = fs.readdirSync('test-data/bulan lalu')
  54  |       .filter(f => f.endsWith('.csv'))
  55  |       .sort();
  56  | 
  57  |     if (inputCount >= 1 && thisMonthFiles.length > 0) {
  58  |       console.log(`  📄 Uploading ${thisMonthFiles.length} this period files...`);
  59  |       for (const file of thisMonthFiles) {
  60  |         const filePath = path.join(process.cwd(), 'test-data/bulan ini', file);
  61  |         await fileInputs.nth(0).setInputFiles(filePath);
  62  |         await page.waitForTimeout(300);
  63  |       }
  64  |     }
  65  | 
  66  |     if (inputCount >= 2 && lastMonthFiles.length > 0) {
  67  |       console.log(`  📄 Uploading ${lastMonthFiles.length} last period files...`);
  68  |       for (const file of lastMonthFiles) {
  69  |         const filePath = path.join(process.cwd(), 'test-data/bulan lalu', file);
  70  |         await fileInputs.nth(1).setInputFiles(filePath);
  71  |         await page.waitForTimeout(300);
  72  |       }
  73  |     }
  74  | 
  75  |     console.log('✅ Files uploaded');
  76  | 
  77  |     // Step 3: Analyze
  78  |     await page.waitForTimeout(3000);
  79  |     console.log('📌 Step 3: Clicking Analyze...');
  80  |     await page.locator('button:has-text("Analyze")').first().click();
  81  |     console.log('✅ Analyze clicked');
  82  | 
  83  |     // Wait for analysis
  84  |     console.log('⏳ Waiting for analysis...');
  85  |     await page.waitForSelector('button:has-text("Generate HTML Report")', { timeout: 60000 });
  86  |     console.log('✅ Analysis complete!');
  87  | 
  88  |     // Step 4: Generate Report
  89  |     console.log('📌 Step 4: Generating HTML Report...');
  90  |     await page.locator('button:has-text("Generate HTML Report")').first().click();
  91  |     console.log('✅ Generate clicked');
  92  | 
  93  |     // Wait for PDF
  94  |     console.log('⏳ Waiting for PDF generation...');
  95  |     await page.waitForSelector('button:has-text("Download PDF")', { timeout: 60000 });
  96  |     console.log('✅ PDF ready!');
  97  | 
  98  |     // Step 5: Download
  99  |     console.log('📌 Step 5: Downloading PDF...');
  100 |     const downloadButton = page.locator('button:has-text("Download PDF")').first();
  101 | 
  102 |     if (await downloadButton.isVisible()) {
  103 |       const downloadPromise = page.waitForEvent('download', { timeout: 30000 });
  104 |       await downloadButton.click();
  105 | 
  106 |       try {
  107 |         const download = await downloadPromise;
  108 |         const filename = download.suggestedFilename() || `CPAS-Report-${Date.now()}.pdf`;
  109 |         await download.saveAs(path.join('downloads', filename));
  110 |         console.log(`✅ Downloaded: ${filename}`);
  111 |       } catch (e) {
  112 |         console.log('ℹ️  Download completed (event not captured)');
  113 |       }
  114 |     }
  115 | 
  116 |     await page.screenshot({ path: 'playwright-report/cpas-final.png', fullPage: true });
  117 |     console.log('\n✨ CPAS automation completed!');
  118 |   });
  119 | 
  120 |   test('Debug: Verify CPAS option exists', async ({ page }) => {
  121 |     await page.waitForTimeout(2000);
  122 | 
  123 |     const secondSelect = page.locator('select').nth(1);
  124 |     const options = await secondSelect.locator('option').allTextContents();
  125 | 
  126 |     console.log('\n📋 Available objectives:');
  127 |     options.forEach(opt => console.log(`  - ${opt}`));
  128 | 
> 129 |     expect(options).toContain('CPAS');
      |                     ^ Error: expect(received).toContain(expected) // indexOf
  130 |     console.log('\n✅ CPAS option is available!');
  131 |   });
  132 | });
  133 | 
```