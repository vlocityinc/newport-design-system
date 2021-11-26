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
  .add('Description List (examples)', () => {
    return withExample(`<dl>
  <dt>First Label:</dt>
  <dd>Description for first label</dd>
  <dt>Second Label:</dt>
  <dd>Description for second label</dd>
</dl>`);
  })
  .add('Description List Inline (examples)', () => {
    return withExample(`<dl class="nds-dl_inline">
  <dt class="nds-dl_inline__label">First Label:</dt>
  <dd class="nds-dl_inline__detail">Description for first label</dd>
  <dt class="nds-dl_inline__label">Second Label:</dt>
  <dd class="nds-dl_inline__detail">Description for second label</dd>
</dl>`);
  })
  .add('Description List Horizontal (examples)', () => {
    return withExample(`<dl class="nds-dl_horizontal">
  <dt class="nds-dl_horizontal__label">First Label:</dt>
  <dd class="nds-dl_horizontal__detail">Description for first label</dd>
  <dt class="nds-dl_horizontal__label">Second Label:</dt>
  <dd class="nds-dl_horizontal__detail">Second description</dd>
</dl>`);
  });
