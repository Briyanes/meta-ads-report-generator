const fs = require('fs');

let content = fs.readFileSync('lib/reportTemplate-ctwa.ts', 'utf8');

// Pattern: formatNumber(${variable})
// Replace with: formatNumber(variable) assigned to a const first

const lines = content.split('\n');
let inMap = false;
let mapVars = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Detect start of map function
  if (line.includes('.map((item: any) => {')) {
    inMap = true;
    mapVars = [];
  }
  
  if (inMap) {
    // Extract variable assignments
    const constMatch = line.match(/const (\w+) = item\[[^\]]+\] \|\|/);
    if (constMatch) {
      mapVars.push(constMatch[1]);
    }
    
    // Check for formatNumber(${variable})
    const formatMatch = line.match(/formatNumber\(\$\{(\w+)\}\)/);
    if (formatMatch) {
      const varName = formatMatch[1];
      const newVarName = `formatted_${varName}`;
      
      // Add const assignment before the return statement
      const returnIndex = lines.findIndex((l, idx) => 
        idx > i && l.includes('return') && l.includes('`')
      );
      
      if (returnIndex > i) {
        // Insert const before return
        lines[returnIndex] = `          const ${newVarName} = formatNumber(${varName})\n` + lines[returnIndex];
        // Replace formatNumber(${var}) with ${newVar}
        lines[i] = line.replace(`formatNumber(\${${varName}})`, `\${${newVarName}}`);
      }
    }
  }
  
  // Detect end of map
  if (inMap && line.includes('}).join')) {
    inMap = false;
    mapVars = [];
  }
}

content = lines.join('\n');
fs.writeFileSync('lib/reportTemplate-ctwa.ts', content);
console.log('Fixed formatNumber template literals');
