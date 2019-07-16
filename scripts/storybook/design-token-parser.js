/* eslint-env browser */
import yaml from 'js-yaml';

export function generateDesignTokenDocs(yamlText) {
  const obj = yaml.load(yamlText);
  if (obj.imports) {
    obj.imports.forEach(importUrl => {
      fetch(importUrl)
        .then(function(response) {
          return response.text();
        })
        .then(text => {
          console.log(JSON.stringify(yaml.load(text), null, 2));
        });
    });
  }
  return function(storyFn) {
    return '<pre>' + JSON.stringify(obj, null, 2) + '</pre>' + storyFn();
  };
}
