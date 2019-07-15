const fs = require('fs');
const path = require('path');

const scss = fs.readFileSync(path.join('.', 'ui', '_design-tokens.scss'), 'UTF-8');

const rows = scss.split('\n');
const output = [];
const seenTokens = {};
rows.forEach(row => {

  if (/^\$.*:/.test(row)) {
    const token = row.match(/^(\$.*):/)[0];
    if (!seenTokens[token]) {
      output.push(row);
      seenTokens[token] = true;
    } else {
      console.log(`Duplicate skipped: ${token} `);
    }
  } else {
    output.push(row);
  }

});

fs.writeFileSync(path.join('.', 'ui', '_design-tokens.fixed.scss'), output.join('\n'), 'UTF-8');
