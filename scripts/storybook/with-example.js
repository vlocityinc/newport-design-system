const t = document.createElement('textarea');

export function withExample(string) {
  t.innerHTML = string;
  return `${string}
        <div class="nds-box nds-theme_default nds-m-vertical_large">
            <pre>${t.innerHTML}</pre>
        </div>
    `;
}
