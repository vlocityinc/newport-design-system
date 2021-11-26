import { storiesOf } from '@storybook/html';
import base from 'paths.macro';
import notes from './doc.md';
import scss from './_index.scss';
import {
  withExample,
  withDocs,
  commentToHTML
} from '../../../scripts/storybook';

storiesOf(`${base}`.replace(/(^\/)|(\/$)/g, ''),  module)
  .addDecorator(withDocs(notes))
  .addDecorator(commentToHTML(scss))
  .add('Name Value Pair Horizontal (examples)', () => {
    return withExample(`<dl class="nds-list_horizontal nds-wrap">
  <dt class="nds-item_label nds-text-color_weak nds-truncate" title="First Label">First Label:</dt>
  <dd class="nds-item_detail nds-truncate" title="Description for first label">Description for first label</dd>
  <dt class="nds-item_label nds-text-color_weak nds-truncate" title="Second Label">Second Label:</dt>
  <dd class="nds-item_detail nds-truncate" title="Description for second label">Description for second label</dd>
</dl>`);
  })
  .add('Name Value Pair Inline (examples)', () => {
    return withExample(`<dl class="nds-list_inline">
  <dt class="nds-item_label nds-text-color_weak nds-truncate" title="First Label">First Label:</dt>
  <dd class="nds-item_detail nds-truncate" title="Description for first label">Description for first label</dd>
  <dt class="nds-item_label nds-text-color_weak nds-truncate" title="Second Label">Second Label:</dt>
  <dd class="nds-item_detail nds-truncate" title="Description for second label">Description for second label</dd>
</dl>`);
  })
  .add('Name Value Pair Stacked (examples)', () => {
    return withExample(`<dl class="nds-list_stacked">
  <dt class="nds-item_label nds-text-color_weak nds-truncate" title="First Label">First Label:</dt>
  <dd class="nds-item_detail nds-truncate" title="Description for first label">Description for first label</dd>
  <dt class="nds-item_label nds-text-color_weak nds-truncate" title="Second Label">Second Label:</dt>
  <dd class="nds-item_detail nds-truncate" title="Second description">Second description</dd>
</dl>`);
  });
