const fs = require('fs');
const prefix = 'node_modules/@salesforce-ux/design-system-markup/';
const filesToFix = ['lib/validate.js'];

filesToFix.forEach(previewFile => {
  fs.readFile(prefix + previewFile, 'utf8', (err, data) => {
    if (err) {
      return console.log(err);
    }
    var result = data.replace(/SLDS/g, 'NDS').replace(/slds/g, 'nds');

    fs.writeFile(prefix + previewFile, result, 'utf8', err => {
      if (err) return console.log(err);
    });
  });
});
