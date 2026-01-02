const fs = require('fs');

console.log('Validating CTWA template...\n');

const ctwa = fs.readFileSync('./lib/reportTemplate-ctwa.ts', 'utf8');

const issues = [];

// Check for unclosed div tags
const openDivs = (ctwa.match(/<div/g) || []).length;
const closeDivs = (ctwa.match(/<\/div>/g) || []).length;
if (openDivs !== closeDivs) {
  issues.push(`Unclosed divs: open ${openDivs}, close ${closeDivs}`);
}

// Check for unclosed table tags
const openTable = (ctwa.match(/<table/g) || []).length;
const closeTable = (ctwa.match(/<\/table>/g) || []).length;
if (openTable !== closeTable) {
  issues.push(`Unclosed tables: open ${openTable}, close ${closeTable}`);
}

// Check for unclosed tbody tags
const openTbody = (ctwa.match(/<tbody/g) || []).length;
const closeTbody = (ctwa.match(/<\/tbody>/g) || []).length;
if (openTbody !== closeTbody) {
  issues.push(`Unclosed tbody: open ${openTbody}, close ${closeTbody}`);
}

// Check for unclosed tr tags
const openTr = (ctwa.match(/<tr/g) || []).length;
const closeTr = (ctwa.match(/<\/tr>/g) || []).length;
if (openTr !== closeTr) {
  issues.push(`Unclosed tr: open ${openTr}, close ${closeTr}`);
}

// Check for unclosed td/th tags
const openTd = (ctwa.match(/<t[dh]/g) || []).length;
const closeTd = (ctwa.match(/<\/t[dh]>/g) || []).length;
if (openTd !== closeTd) {
  issues.push(`Unclosed td/th: open ${openTd}, close ${closeTd}`);
}

// Check for className vs class
const classAttrs = (ctwa.match(/ class=/g) || []).length;
if (classAttrs > 0) {
  issues.push(`Found 'class=' attributes instead of 'className=': ${classAttrs} times`);
}

// Check for unclosed braces in template literals
const lines = ctwa.split('\n');
let openBraces = 0;
let inTemplate = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // Track if we're in a template literal
  if (line.includes('`')) {
    inTemplate = !inTemplate;
  }

  if (inTemplate) {
    const opens = (line.match(/\$\{/g) || []).length;
    const closes = (line.match(/\}/g) || []).length;
    openBraces += opens - closes;
  }
}

if (openBraces !== 0) {
  issues.push(`Unmatched braces in template literals: ${openBraces > 0 ? '+' : ''}${openBraces}`);
}

// Check for duplicate closing tags
const duplicateH2 = ctwa.match(/<\/h2>\s*<\/h2>/g);
if (duplicateH2) {
  issues.push(`Found duplicate closing tags: ${duplicateH2.length} instances`);
}

// Check for malformed JSX
const malformedClass = ctwa.match(/className=\{[^}]*\s+[^}]*\}/g);
if (malformedClass) {
  issues.push(`Potentially malformed className attributes: ${malformedClass.length} instances`);
}

console.log('Validation Results:');
if (issues.length > 0) {
  console.log('\n❌ ISSUES FOUND:\n');
  issues.forEach(issue => console.log(`  - ${issue}`));
  process.exit(1);
} else {
  console.log('\n✅ No syntax errors found!\n');
  process.exit(0);
}
