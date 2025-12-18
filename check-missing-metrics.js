// Script to check which metrics from CSV are not being extracted
const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

async function checkMissingMetrics() {
  // Read CSV
  const csvText = fs.readFileSync(path.join(__dirname, 'test-data/cpas-this-month/aum-bulan-ini.csv'), 'utf-8');
  
  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const headers = results.meta.fields || [];
        const firstRow = results.data[0] || {};
        
        console.log('=== ALL COLUMNS IN CSV ===');
        headers.forEach((h, i) => {
          console.log(`${i + 1}. "${h}"`);
        });
        
        console.log('\n=== METRICS CURRENTLY EXTRACTED IN buildPerformanceData (CPAS) ===');
        const extractedMetrics = [
          'Amount spent (IDR)',
          'Impressions',
          'Link clicks',
          'CTR (link click-through rate)',
          'CPC (cost per link click)',
          'CPM (cost per 1,000 impressions)',
          'Outbound clicks',
          'Frequency',
          'Reach',
          'Purchases with shared items',
          'Adds to cart with shared items',
          'Content views with shared items',
          'Adds to cart conversion value for shared items only',
          'Purchases conversion value for shared items only'
        ];
        
        extractedMetrics.forEach((m, i) => {
          const found = headers.some(h => h.toLowerCase().includes(m.toLowerCase()) || m.toLowerCase().includes(h.toLowerCase()));
          console.log(`${i + 1}. ${m} ${found ? '✓' : '✗ NOT FOUND IN CSV'}`);
        });
        
        console.log('\n=== METRICS IN CSV BUT NOT EXTRACTED ===');
        const metricsNotExtracted = [];
        
        headers.forEach(header => {
          const headerLower = header.toLowerCase();
          // Check if this metric is not in extracted list
          const isExtracted = extractedMetrics.some(extracted => {
            const extractedLower = extracted.toLowerCase();
            return headerLower.includes(extractedLower) || extractedLower.includes(headerLower);
          });
          
          // Skip non-metric columns
          const isNonMetric = ['Day', 'Delivery status', 'Delivery level', 'Reporting starts', 'Reporting ends', 'Result type'].some(nm => headerLower.includes(nm.toLowerCase()));
          
          if (!isExtracted && !isNonMetric && header.trim()) {
            metricsNotExtracted.push(header);
          }
        });
        
        if (metricsNotExtracted.length === 0) {
          console.log('All metrics are extracted!');
        } else {
          metricsNotExtracted.forEach((m, i) => {
            const value = firstRow[m];
            console.log(`${i + 1}. "${m}" = ${value || '(empty)'}`);
          });
        }
        
        console.log('\n=== CALCULATED METRICS (should be calculated) ===');
        const calculatedMetrics = [
          'Cost /CV (IDR)',
          'Cost /ATC (IDR)',
          'Cost /Purchase (IDR)',
          'Purchase ROAS for shared items only',
          'AOV (IDR)',
          'Conversion rate ranking',
          '* LC to CV',
          '* CV to ATC',
          'ATC to Purchase',
          'Cost per result',
          'Clicks (all)',
          'CTR (all)'
        ];
        
        calculatedMetrics.forEach((m, i) => {
          const found = headers.some(h => h.toLowerCase().includes(m.toLowerCase()) || m.toLowerCase().includes(h.toLowerCase()));
          const value = firstRow[headers.find(h => h.toLowerCase().includes(m.toLowerCase()))] || 'N/A';
          console.log(`${i + 1}. ${m} ${found ? `✓ (value: ${value})` : '✗ NOT FOUND'}`);
        });
        
        resolve();
      },
      error: (error) => {
        reject(error);
      }
    });
  });
}

checkMissingMetrics().catch(console.error);

