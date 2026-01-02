// Test script to check template generation
const fs = require('fs');
const path = require('path');

// Read CTWA template
const ctwaTemplate = fs.readFileSync('./lib/reportTemplate-ctwa.ts', 'utf8');

// Check for common issues
console.log('Checking template...');

// Check for duplicate h2
const duplicateH2 = (ctwaTemplate.match(/<h2>Key Metrics Overview<\/h2>/g) || []).length;
console.log('Duplicate h2 tags:', duplicateH2);

// Check for className vs class
const classAttrs = (ctwaTemplate.match(/ class=/g) || []).length;
const classNameAttrs = (ctwaTemplate.match(/ className=/g) || []).length;
console.log('class= attributes:', classAttrs);
console.log('className= attributes:', classNameAttrs);

// Check for template literal syntax
const templateLiterals = (ctwaTemplate.match(/\$\{/g) || []).length;
console.log('Template literal variables:', templateLiterals);

// Check for unbalanced braces
const openBraces = (ctwaTemplate.match(/\{/g) || []).length;
const closeBraces = (ctwaTemplate.match(/\}/g) || []).length;
console.log('Open braces:', openBraces);
console.log('Close braces:', closeBraces);
console.log('Difference:', openBraces - closeBraces);

console.log('\nTemplate check complete!');
