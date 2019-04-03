import MarkdownIt from 'markdown-it';
const md = new MarkdownIt();

export function renderMarkdown(markdown) {
  return md
    .render(markdown)
    .replace(/<h1>/g, '<h1 class="nds-text-heading_large">')
    .replace(/<h2>/g, '<h2 class="nds-text-heading_medium">')
    .replace(/<h3>/g, '<h3 class="nds-text-heading_small">');
}

function wrap(markdown) {
  return '<div class="nds-text-longform">' + markdown + '</div>';
}

export function renderAsMarkdown(storyFn) {
  return wrap(renderMarkdown(storyFn()));
}

export function withDocs(markdown) {
  const renderedMd = renderMarkdown(markdown);
  const splitAt = renderedMd.indexOf('</p>');
  const firstPart = renderedMd.substring(0, splitAt);
  const lastPart = renderedMd.substring(splitAt);
  return function(storyFn) {
    return wrap(firstPart) + storyFn() + wrap(lastPart);
  };
}
