/**
 * Script untuk mengkonversi file CSV dari folder "rmoda workshop"
 * ke format yang kompatibel dengan aplikasi Meta Ads Report Generator
 * 
 * Format input: 
 * - campaign-name-ad-creative-age-gender-objective.csv
 * - campaign-name-ad-creative-platform-placement-objective.csv
 * - campaign-name-ad-creative-region-objective.csv
 * 
 * Format output yang dibutuhkan:
 * - main-report.csv (agregat total)
 * - age.csv
 * - gender.csv
 * - region.csv
 * - platform.csv
 * - placement.csv
 * - objective.csv
 * - ad-creative.csv
 */

const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

const SOURCE_DIR = path.join(__dirname, 'rmoda workshop');
const OUTPUT_DIR = path.join(__dirname, 'rmoda-workshop-converted');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Helper to parse numbers
function parseNum(val) {
  if (typeof val === 'number') return val;
  if (!val || val === '-' || val === 'N/A') return 0;
  const cleanStr = String(val).replace(/[,\s]/g, '');
  const parsed = parseFloat(cleanStr);
  return isNaN(parsed) ? 0 : parsed;
}

// Read and parse CSV file
function readCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const result = Papa.parse(content, { header: true, skipEmptyLines: true });
  return result.data;
}

// Write CSV file
function writeCSV(filePath, data) {
  const csv = Papa.unparse(data);
  fs.writeFileSync(filePath, csv, 'utf-8');
  console.log(`✓ Written: ${path.basename(filePath)} (${data.length} rows)`);
}

// Aggregate data by dimension
function aggregateByDimension(data, dimensionKey) {
  const grouped = {};
  
  for (const row of data) {
    const key = row[dimensionKey] || 'Unknown';
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(row);
  }
  
  const result = [];
  for (const [key, rows] of Object.entries(grouped)) {
    if (rows.length === 0) continue;
    
    const aggregated = { [dimensionKey]: key };
    const numericFields = [
      'Reach', 'Impressions', 'Frequency', 'Link clicks', 'Clicks (all)',
      'Amount spent (IDR)', 'Messaging conversations started', 
      'Cost per messaging conversation started', 'Instagram follows',
      'Outbound clicks', 'Results'
    ];
    
    for (const field of numericFields) {
      const sum = rows.reduce((acc, r) => acc + parseNum(r[field]), 0);
      if (sum > 0) aggregated[field] = sum;
    }
    
    // Calculate derived metrics
    if (aggregated['Impressions'] > 0 && aggregated['Amount spent (IDR)'] > 0) {
      aggregated['CPM (cost per 1,000 impressions)'] = (aggregated['Amount spent (IDR)'] / aggregated['Impressions']) * 1000;
    }
    if (aggregated['Link clicks'] > 0 && aggregated['Impressions'] > 0) {
      aggregated['CTR (link click-through rate)'] = (aggregated['Link clicks'] / aggregated['Impressions']) * 100;
    }
    if (aggregated['Link clicks'] > 0 && aggregated['Amount spent (IDR)'] > 0) {
      aggregated['CPC (cost per link click)'] = aggregated['Amount spent (IDR)'] / aggregated['Link clicks'];
    }
    if (aggregated['Messaging conversations started'] > 0 && aggregated['Amount spent (IDR)'] > 0) {
      aggregated['Cost per messaging conversation started'] = aggregated['Amount spent (IDR)'] / aggregated['Messaging conversations started'];
    }
    
    // Keep date range
    if (rows[0]['Reporting starts']) aggregated['Reporting starts'] = rows[0]['Reporting starts'];
    if (rows[0]['Reporting ends']) aggregated['Reporting ends'] = rows[0]['Reporting ends'];
    
    result.push(aggregated);
  }
  
  return result;
}

// Create main report (aggregated total)
function createMainReport(allData) {
  const totals = {
    'Reach': 0,
    'Impressions': 0,
    'Link clicks': 0,
    'Clicks (all)': 0,
    'Amount spent (IDR)': 0,
    'Messaging conversations started': 0,
    'Instagram follows': 0,
    'Outbound clicks': 0
  };
  
  // Use Set to avoid double-counting same campaign rows
  const uniqueRows = new Map();
  
  for (const row of allData) {
    // Use Campaign name + breakdown values as unique key
    const key = `${row['Campaign name'] || ''}_${row['Age'] || ''}_${row['Gender'] || ''}_${row['Platform'] || ''}_${row['Placement'] || ''}_${row['Region'] || ''}`;
    if (!uniqueRows.has(key)) {
      uniqueRows.set(key, row);
    }
  }
  
  for (const row of uniqueRows.values()) {
    for (const field of Object.keys(totals)) {
      totals[field] += parseNum(row[field]);
    }
  }
  
  // Calculate derived metrics
  totals['Frequency'] = totals['Reach'] > 0 ? totals['Impressions'] / totals['Reach'] : 0;
  totals['CPM (cost per 1,000 impressions)'] = totals['Impressions'] > 0 ? (totals['Amount spent (IDR)'] / totals['Impressions']) * 1000 : 0;
  totals['CTR (link click-through rate)'] = totals['Impressions'] > 0 ? (totals['Link clicks'] / totals['Impressions']) * 100 : 0;
  totals['CPC (cost per link click)'] = totals['Link clicks'] > 0 ? totals['Amount spent (IDR)'] / totals['Link clicks'] : 0;
  totals['Cost per messaging conversation started'] = totals['Messaging conversations started'] > 0 ? totals['Amount spent (IDR)'] / totals['Messaging conversations started'] : 0;
  
  // Get date range from first data row
  const firstRow = allData.find(r => r['Reporting starts']);
  if (firstRow) {
    totals['Reporting starts'] = firstRow['Reporting starts'];
    totals['Reporting ends'] = firstRow['Reporting ends'];
  }
  
  return [totals];
}

// Process files for a period (bulan-ini or bulan-lalu)
function processFiles(period) {
  console.log(`\n📁 Processing: ${period}`);
  
  const files = fs.readdirSync(SOURCE_DIR).filter(f => f.includes(period) && f.endsWith('.csv'));
  console.log(`Found ${files.length} files for ${period}`);
  
  let allData = [];
  
  for (const file of files) {
    const filePath = path.join(SOURCE_DIR, file);
    const data = readCSV(filePath);
    console.log(`  - ${file}: ${data.length} rows`);
    allData = allData.concat(data);
  }
  
  if (allData.length === 0) {
    console.log('No data found!');
    return;
  }
  
  const prefix = period.replace('bulan-', '');
  const outputSubDir = path.join(OUTPUT_DIR, prefix);
  if (!fs.existsSync(outputSubDir)) {
    fs.mkdirSync(outputSubDir, { recursive: true });
  }
  
  // Create main report
  const mainReport = createMainReport(allData);
  writeCSV(path.join(outputSubDir, `main-report.csv`), mainReport);
  
  // Create breakdown files
  if (allData.some(r => r['Age'])) {
    const ageData = aggregateByDimension(allData.filter(r => r['Age']), 'Age');
    writeCSV(path.join(outputSubDir, `age.csv`), ageData);
  }
  
  if (allData.some(r => r['Gender'])) {
    const genderData = aggregateByDimension(allData.filter(r => r['Gender']), 'Gender');
    writeCSV(path.join(outputSubDir, `gender.csv`), genderData);
  }
  
  if (allData.some(r => r['Region'])) {
    const regionData = aggregateByDimension(allData.filter(r => r['Region']), 'Region');
    writeCSV(path.join(outputSubDir, `region.csv`), regionData);
  }
  
  if (allData.some(r => r['Platform'])) {
    const platformData = aggregateByDimension(allData.filter(r => r['Platform']), 'Platform');
    writeCSV(path.join(outputSubDir, `platform.csv`), platformData);
  }
  
  if (allData.some(r => r['Placement'])) {
    const placementData = aggregateByDimension(allData.filter(r => r['Placement']), 'Placement');
    writeCSV(path.join(outputSubDir, `placement.csv`), placementData);
  }
  
  if (allData.some(r => r['Objective'])) {
    const objectiveData = aggregateByDimension(allData.filter(r => r['Objective']), 'Objective');
    writeCSV(path.join(outputSubDir, `objective.csv`), objectiveData);
  }
  
  if (allData.some(r => r['Ads'])) {
    const adCreativeData = aggregateByDimension(allData.filter(r => r['Ads']), 'Ads');
    writeCSV(path.join(outputSubDir, `ad-creative.csv`), adCreativeData);
  }
}

// Main execution
console.log('🚀 Converting RMODA Workshop CSV files...');
console.log('Source:', SOURCE_DIR);
console.log('Output:', OUTPUT_DIR);

processFiles('bulan-ini');
processFiles('bulan-lalu');

console.log('\n✅ Conversion complete!');
console.log(`\nFiles are in: ${OUTPUT_DIR}`);
console.log('\nUse these files in the Meta Ads Report Generator:');
console.log('- "ini" folder → Bulan Ini files');
console.log('- "lalu" folder → Bulan Lalu files');
