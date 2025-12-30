// Test script to generate CPAS report
const fs = require('fs');
const path = require('path');

async function testGenerateReport() {
  const FormData = require('form-data');
  const fetch = require('node-fetch');

  const form = new FormData();
  form.append('objectiveType', 'cpas');

  // Add this week CSV
  const thisWeekPath = path.join(__dirname, 'test-data/cpas-this-month/aum-bulan-ini.csv');
  form.append('fileThisWeek', fs.createReadStream(thisWeekPath));

  // Add last week CSV
  const lastWeekPath = path.join(__dirname, 'test-data/cpas-last-month/aum-bulan-lalu.csv');
  form.append('fileLastWeek', fs.createReadStream(lastWeekPath));

  // Add breakdown files
  const breakdownThisWeek = [
    'test-data/cpas-this-month/aum-bulan-ini-age.csv',
    'test-data/cpas-this-month/aum-bulan-ini-gender.csv',
    'test-data/cpas-this-month/aum-bulan-ini-platform.csv',
    'test-data/cpas-this-month/aum-bulan-ini-placement.csv',
    'test-data/cpas-this-month/aum-bulan-ini-region.csv',
    'test-data/cpas-this-month/aum-bulan-ini-objective.csv',
    'test-data/cpas-this-month/aum-bulan-ini-ad-creatice.csv'
  ];

  const breakdownLastWeek = [
    'test-data/cpas-last-month/aum-bulan-lalu-age.csv',
    'test-data/cpas-last-month/aum-bulan-lalu-gender.csv',
    'test-data/cpas-last-month/aum-bulan-lalu-platform.csv',
    'test-data/cpas-last-month/aum-bulan-lalu-placement.csv',
    'test-data/cpas-last-month/aum-bulan-lalu-region.csv',
    'test-data/cpas-last-month/aum-bulan-lalu-objective.csv',
    'test-data/cpas-last-month/aum-bulan-lalu-ad-creative.csv'
  ];

  for (const file of breakdownThisWeek) {
    form.append('breakdownThisWeek', fs.createReadStream(path.join(__dirname, file)));
  }

  for (const file of breakdownLastWeek) {
    form.append('breakdownLastWeek', fs.createReadStream(path.join(__dirname, file)));
  }

  console.log('Sending request to API...');
  const response = await fetch('http://localhost:3000/api/analyze', {
    method: 'POST',
    body: form,
    headers: form.getHeaders()
  });

  console.log('Response status:', response.status);

  const data = await response.json();

  if (data.error) {
    console.error('Error:', data.error);
    process.exit(1);
  }

  // Save HTML report
  const outputPath = path.join(__dirname, 'test-output.html');
  fs.writeFileSync(outputPath, data.html);
  console.log('Report saved to:', outputPath);

  // Log key metrics from HTML
  const html = data.html;

  // Extract metrics using regex
  const reachMatch = html.match(/<td[^>]*>Reach<\/td>\s*<td[^>]*>([\d,]+)<\/td>/);
  const freqMatch = html.match(/<td[^>]*>Frequency<\/td>\s*<td[^>]*>([\d,.,]+)<\/td>/);
  const linkClicksMatch = html.match(/<td[^>]*>Link clicks<\/td>\s*<td[^>]*>([\d,]+)<\/td>/);
  const clicksAllMatch = html.match(/<td[^>]*>Clicks \(all\)<\/td>\s*<td[^>]*>([\d,]+)<\/td>/);
  const ctrAllMatch = html.match(/<td[^>]*>CTR \(all\)<\/td>\s*<td[^>]*>([\d,.,%]+)<\/td>/);

  console.log('\n=== METRICS FROM GENERATED REPORT ===');
  console.log('Reach:', reachMatch ? reachMatch[1] : 'NOT FOUND');
  console.log('Frequency:', freqMatch ? freqMatch[1] : 'NOT FOUND');
  console.log('Link clicks:', linkClicksMatch ? linkClicksMatch[1] : 'NOT FOUND');
  console.log('Clicks (all):', clicksAllMatch ? clicksAllMatch[1] : 'NOT FOUND');
  console.log('CTR (all):', ctrAllMatch ? ctrAllMatch[1] : 'NOT FOUND');
}

testGenerateReport().catch(console.error);
