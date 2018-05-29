const fs = require('fs');
const prefix = 'node_modules/@salesforce-ux/design-system-previewer/';
const filesToFix = [
  'public/__ASSETS__/scripts/bundle/previewer.js',
  'public/__ASSETS__/scripts/bundle/iframe.js',
  'server/app.js'
];

filesToFix.forEach(previewFile => {
  fs.readFile(prefix + previewFile, 'utf8', (err, data) => {
    if (err) {
      return console.log(err);
    }
    var result = data
      .replace(/SLDS/g, 'NDS')
      .replace(/slds/g, 'nds')
      .replace(/salesforce1/g, 'connected_apps');

    fs.writeFile(prefix + previewFile, result, 'utf8', err => {
      if (err) return console.log(err);
    });
  });
});
