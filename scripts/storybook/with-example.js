import hljs from 'highlight.js';
import { prettyPrint } from 'html';
let id = 0;

export function withExample(string) {
  const newId = id++;
  requestAnimationFrame(() => {
    const pretty = prettyPrint(string);
    requestAnimationFrame(() => {
      const dom = hljs.highlight('html', pretty).value;
      const el = document.getElementById(`sourcecode-${newId}`);
      el.innerHTML = dom;
    });
  });

  return `<div class="nds-box nds-theme_default nds-m-vertical_medium">
          ${string}
          <div class="nds-border_top nds-m-vertical_small">
            <pre id="sourcecode-${newId}"></pre>
          </div>
        </div>
    `;
}
