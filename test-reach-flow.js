// Test script to verify Reach data flow from CSV to template
const fs = require('fs');
const path = require('path');

// Read CSV files
const thisMonthCSV = fs.readFileSync(path.join(__dirname, 'test-data/cpas-this-month/aum-bulan-ini.csv'), 'utf-8');
const lastMonthCSV = fs.readFileSync(path.join(__dirname, 'test-data/cpas-last-month/aum-bulan-lalu.csv'), 'utf-8');

// Parse CSV headers
const thisMonthLines = thisMonthCSV.split('\n').filter(line => line.trim());
const lastMonthLines = lastMonthCSV.split('\n').filter(line => line.trim());

const thisMonthHeaders = thisMonthLines[0].split(',').map(h => h.trim());
const lastMonthHeaders = lastMonthLines[0].split(',').map(h => h.trim());

console.log('=== THIS MONTH HEADERS ===');
thisMonthHeaders.forEach((h, i) => {
  if (h.toLowerCase().includes('reach')) {
    console.log(`[${i}] ${h} - REACH FOUND!`);
  } else {
    console.log(`[${i}] ${h}`);
  }
});

console.log('\n=== LAST MONTH HEADERS ===');
lastMonthHeaders.forEach((h, i) => {
  if (h.toLowerCase().includes('reach')) {
    console.log(`[${i}] ${h} - REACH FOUND!`);
  } else {
    console.log(`[${i}] ${h}`);
  }
});

// Parse first data row
if (thisMonthLines.length > 1) {
  const thisMonthData = thisMonthLines[1].split(',');
  const thisMonthRow = {};
  thisMonthHeaders.forEach((header, i) => {
    thisMonthRow[header] = thisMonthData[i] || '';
  });
  
  console.log('\n=== THIS MONTH REACH VALUES ===');
  Object.keys(thisMonthRow).forEach(key => {
    if (key.toLowerCase().includes('reach')) {
      console.log(`${key}: ${thisMonthRow[key]}`);
    }
  });
}

if (lastMonthLines.length > 1) {
  const lastMonthData = lastMonthLines[1].split(',');
  const lastMonthRow = {};
  lastMonthHeaders.forEach((header, i) => {
    lastMonthRow[header] = lastMonthData[i] || '';
  });
  
  console.log('\n=== LAST MONTH REACH VALUES ===');
  Object.keys(lastMonthRow).forEach(key => {
    if (key.toLowerCase().includes('reach')) {
      console.log(`${key}: ${lastMonthRow[key]}`);
    }
  });
}

