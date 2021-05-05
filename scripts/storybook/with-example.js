/* eslint-env browser */
import { number } from '@storybook/addon-knobs';
import hljs from 'highlight.js';
const { html: htmlBeautify } = require('js-beautify');
let id = 0;

const beautify = html =>
  htmlBeautify(html, {
    indent_size: 2,
    indent_char: ' ',
    unformatted: ['a'],
    'wrap_line_length ': 78,
    indent_inner_html: true
  });

export function withExampleAndHeight() {
  const numberOfArgs = arguments.length;
  if (numberOfArgs === 2) {
    return wrapWithExample(null, null, arguments[0], arguments[1]);
  }
  if (numberOfArgs === 3) {
    return wrapWithExample(arguments[0], null, arguments[1], arguments[2]);
  }
  if (numberOfArgs === 4) {
    return wrapWithExample(arguments[0], arguments[1], arguments[2], arguments[3]);
  }
}

export function withExample() {
  const numberOfArgs = arguments.length;
  if (numberOfArgs === 1) {
   return wrapWithExample(null, null, arguments[0]);
  }
  if (numberOfArgs === 2) {
    return wrapWithExample(arguments[0], null, arguments[1]);
  }
  if (numberOfArgs === 3) {
    return wrapWithExample(arguments[0], arguments[1], arguments[2]);
  }
}

function wrapWithExample(title, details, string, height) {
  const newId = id++;
  requestAnimationFrame(() => {
    const pretty = beautify(string);
    requestAnimationFrame(() => {
      const dom = hljs.highlight('html', pretty).value;
      const el = document.getElementById(`sourcecode-${newId}`);
      el.innerHTML = dom;
    });
  });

  return (title ? `<h2 class="nds-text-heading_medium">${title}</h2>` : '') +
  (details ? `<p class="">${details}</p>` : '') +
     `<div class="nds-box nds-theme_default nds-m-vertical_medium">
          <div class="nds-is-relative example-code-wrapper" ${height ? `style="height: ${height}"` : ''}>
          ${string}
          </div>
          <div class="nds-border_top nds-m-vertical_small">
            <div class="nds-grid nds-grid_align-spread nds-m-top_small">
              <h2 class="nds-text-heading_medium">Code</h2>
              <button class="nds-button nds-button_neutral" onclick="document.getElementById('sourcecode-${newId}').classList.toggle('hidden-code')">Show Code</button>
            </div>
            <pre id="sourcecode-${newId}" class="hidden-code">Loading...</pre>
          </div>
        </div>
    `;
}
