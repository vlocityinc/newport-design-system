/* eslint-env browser */
import parse from 'comment-parser';
let id = 0;

export function commentToHTML(scssFilePath) {
  const newId = id++;

  return function(storyFn) {
    requestAnimationFrame(() => {
      const commentAST = parse(scssFilePath);
      const selectorTable = `
      <h2 class="nds-text-heading_medium nds-m-vertical_large">Overview of CSS Classes</h2>
      ${prettyPrintAST(commentAST)}`;
      const el = document.getElementById(`comments-${newId}`);
      el.innerHTML = selectorTable;
    });
    return `${storyFn()}<article id="comments-${newId}">Loading...</article>`;
  };
}

function prettyPrintAST(commentAST) {
  if (Array.isArray(commentAST)) {
    return commentAST
      .map(comment => {
        return prettyPrintAST(comment);
      })
      .join('<br/>');
  }

  const tagMap = commentAST.tags.reduce((map, tag) => {
    map[tag.tag] = tag;
    return map;
  }, {});

  if (!tagMap.selector) {
    return '';
  }

  return `
  <table class="nds-table nds-table_bordered nds-table_fixed-layout nds-max-medium-table_tacked nds-no-row-hover nds-m-bottom_large">
    <tr>
      <th style="width: 10em">Selector</th>
      <td class="nds-cell-wrap">
        <code>${tagMap.selector.name}</code>
      </td>
    </tr>
    <tr>
      <th>Summary</th>
      <td class="nds-cell-wrap">${tagMap.summary
        ? tagMap.summary.name + ' ' + tagMap.summary.description
        : commentAST.description}</td>
    </tr>
    <tr>
      <th>Restrict</th>
      <td class="nds-cell-wrap">
        <code>${tagMap.restrict
          ? tagMap.restrict.name + ' ' + tagMap.restrict.description
          : ''}</code>
      </td>
    </tr>
  </table>
  `;
}
