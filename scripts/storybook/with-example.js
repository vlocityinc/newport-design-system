/* eslint-env browser */
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

export function withExample(string) {
  const newId = id++;
  requestAnimationFrame(() => {
    const pretty = beautify(string);
    requestAnimationFrame(() => {
      const dom = hljs.highlight('html', pretty).value;
      const el = document.getElementById(`sourcecode-${newId}`);
      el.innerHTML = dom;
    });
  });

  return `<div class="nds-box nds-theme_default nds-m-vertical_medium">
          ${string}
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
