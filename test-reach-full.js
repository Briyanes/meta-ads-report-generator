// Full test to verify Reach data flow
const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

async function testReachFlow() {
  // Read CSV files
  const thisMonthCSV = fs.readFileSync(path.join(__dirname, 'test-data/cpas-this-month/aum-bulan-ini.csv'), 'utf-8');
  const lastMonthCSV = fs.readFileSync(path.join(__dirname, 'test-data/cpas-last-month/aum-bulan-lalu.csv'), 'utf-8');

  // Parse CSV
  const parseCSV = (csvText) => {
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          resolve({
            data: results.data,
            headers: results.meta.fields || []
          });
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  };

  const thisMonthParsed = await parseCSV(thisMonthCSV);
  const lastMonthParsed = await parseCSV(lastMonthCSV);

  console.log('=== THIS MONTH HEADERS ===');
  thisMonthParsed.headers.forEach((h, i) => {
    if (h && h.toLowerCase().includes('reach')) {
      console.log(`[${i}] "${h}" - REACH FOUND!`);
    }
  });

  console.log('\n=== LAST MONTH HEADERS ===');
  lastMonthParsed.headers.forEach((h, i) => {
    if (h && h.toLowerCase().includes('reach')) {
      console.log(`[${i}] "${h}" - REACH FOUND!`);
    }
  });

  // Helper function to get field value (similar to analyze route)
  const getFieldValue = (data, fieldName, alternatives = []) => {
    if (!data || typeof data !== 'object') return undefined;
    
    const allFields = [fieldName, ...alternatives];
    const dataKeys = Object.keys(data);
    
    for (const field of allFields) {
      // Try exact match first
      if (data[field] !== undefined && data[field] !== null && data[field] !== '') {
        return data[field];
      }
      // Try case-insensitive exact match
      const exactMatch = dataKeys.find(key => key.toLowerCase() === field.toLowerCase());
      if (exactMatch && data[exactMatch] !== undefined && data[exactMatch] !== null && data[exactMatch] !== '') {
        return data[exactMatch];
      }
      // Try partial match
      const partialMatch = dataKeys.find(key => {
        const keyLower = key.toLowerCase();
        const fieldLower = field.toLowerCase();
        return keyLower.includes(fieldLower) || fieldLower.includes(keyLower);
      });
      if (partialMatch && data[partialMatch] !== undefined && data[partialMatch] !== null && data[partialMatch] !== '') {
        return data[partialMatch];
      }
    }
    return undefined;
  };

  const parseNum = (val) => {
    if (val === null || val === undefined || val === '') return 0;
    if (typeof val === 'number') return val;
    const str = String(val).replace(/[^\d.-]/g, '');
    const num = parseFloat(str);
    return isNaN(num) ? 0 : num;
  };

  // Aggregate Reach from all rows
  let thisMonthReachTotal = 0;
  let lastMonthReachTotal = 0;

  console.log('\n=== THIS MONTH REACH VALUES (first 5 rows) ===');
  thisMonthParsed.data.slice(0, 5).forEach((row, i) => {
    const reach = parseNum(getFieldValue(row, 'Reach', ['Reach', 'reach', 'Accounts Center accounts reached']));
    thisMonthReachTotal += reach;
    console.log(`Row ${i + 1}: Reach = ${reach}`);
  });

  console.log('\n=== LAST MONTH REACH VALUES (first 5 rows) ===');
  lastMonthParsed.data.slice(0, 5).forEach((row, i) => {
    const reach = parseNum(getFieldValue(row, 'Reach', ['Reach', 'reach', 'Accounts Center accounts reached']));
    lastMonthReachTotal += reach;
    console.log(`Row ${i + 1}: Reach = ${reach}`);
  });

  // Calculate total Reach
  thisMonthParsed.data.forEach(row => {
    const reach = parseNum(getFieldValue(row, 'Reach', ['Reach', 'reach', 'Accounts Center accounts reached']));
    thisMonthReachTotal += reach;
  });

  lastMonthParsed.data.forEach(row => {
    const reach = parseNum(getFieldValue(row, 'Reach', ['Reach', 'reach', 'Accounts Center accounts reached']));
    lastMonthReachTotal += reach;
  });

  console.log('\n=== TOTAL REACH ===');
  console.log(`This Month Total Reach: ${thisMonthReachTotal.toLocaleString('id-ID')}`);
  console.log(`Last Month Total Reach: ${lastMonthReachTotal.toLocaleString('id-ID')}`);

  // Check first row structure
  if (thisMonthParsed.data.length > 0) {
    console.log('\n=== FIRST ROW KEYS (This Month) ===');
    Object.keys(thisMonthParsed.data[0]).forEach(key => {
      if (key && key.toLowerCase().includes('reach')) {
        console.log(`"${key}": ${thisMonthParsed.data[0][key]}`);
      }
    });
  }
}

testReachFlow().catch(console.error);

