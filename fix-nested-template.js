const fs = require('fs');

let content = fs.readFileSync('lib/reportTemplate-ctwa.ts', 'utf8');
const lines = content.split('\n');

let i = 0;
while (i < lines.length) {
  const line = lines[i];

  // Check if we're in a map function with nested template literal
  if (line.includes('.map((item: any) => {')) {
    // Find the end of this map function (look for }).join('}') )
    let mapEnd = -1;
    let braceCount = 0;
    let inMap = false;

    for (let j = i; j < lines.length; j++) {
      const mapLine = lines[j];
      if (mapLine.includes('return `')) {
        inMap = true;
      }
      if (inMap) {
        braceCount += (mapLine.match(/{/g) || []).length;
        braceCount -= (mapLine.match(/}/g) || []).length;
      }
      if (inMap && braceCount === 0 && mapLine.includes('}).join')) {
        mapEnd = j;
        break;
      }
    }

    if (mapEnd > 0) {
      // Process this map function
      const formattedVars = new Map();

      for (let j = i; j <= mapEnd; j++) {
        const mapLine = lines[j];

        // Find const declarations
        const constMatch = mapLine.match(/const (\w+) = /);
        if (constMatch) {
          const varName = constMatch[1];

          // Find lines using this variable in format functions
          const formatMatches = [...mapLine.matchAll(/\{format(\w+)\(\$\{\w+\}\)\}/g)];
          for (const match of formatMatches) {
            const formatType = match[1]; // Number, Currency, Percent
            const formattedVarName = `formatted${varName.charAt(0).toUpperCase() + varName.slice(1)}`;

            // Add formatted var declaration after the original const
            if (!formattedVars.has(formattedVarName)) {
              const indent = mapLine.match(/^\s*/)[0];
              const newLine = `${indent}const ${formattedVarName} = format${formatType}(${varName})`;
              lines.splice(j + 1, 0, newLine);
              formattedVars.set(formattedVarName, varName);
              mapEnd++; // Adjust mapEnd since we added a line
              j++; // Skip the newly added line
            }
          }
        }
      }

      // Now replace all formatXXX(${var}) with ${formattedVar}
      for (let j = i; j <= mapEnd; j++) {
        for (const [formattedVar, origVar] of formattedVars) {
          lines[j] = lines[j].replace(
            new RegExp(`\\{format\\w+\\(\\$\\{${origVar}\\}\\)\\}`, 'g'),
            `$\{${formattedVar}\}`
          );
        }
      }

      i = mapEnd + 1;
      continue;
    }
  }

  i++;
}

content = lines.join('\n');
fs.writeFileSync('lib/reportTemplate-ctwa.ts', content);
console.log('Fixed nested template literals');
