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
  .add('Default (default)', () => {
    return withExample(`<div style="padding: 1rem;">
  <div class="nds-align_absolute-center" style="text-align: center; width: 8rem; background-color: rgb(255, 255, 255);">
    <div>This should have a border.</div>
  </div>
</div>`);
  })
  .add('Top (examples)', () => {
    return withExample(`<div style="padding: 1rem;">
  <div class="nds-align_absolute-center" style="text-align: center; width: 8rem; background-color: rgb(255, 255, 255);">
    <div class="nds-border_top">This should have a top border.</div>
  </div>
</div>`);
  })
  .add('Right (examples)', () => {
    return withExample(`<div style="padding: 1rem;">
  <div class="nds-align_absolute-center" style="text-align: center; width: 8rem; background-color: rgb(255, 255, 255);">
    <div class="nds-border_right">This should have a right border.</div>
  </div>
</div>`);
  })
  .add('Bottom (examples)', () => {
    return withExample(`<div style="padding: 1rem;">
  <div class="nds-align_absolute-center" style="text-align: center; width: 8rem; background-color: rgb(255, 255, 255);">
    <div class="nds-border_bottom">This should have a bottom border.</div>
  </div>
</div>`);
  })
  .add('Left (examples)', () => {
    return withExample(`<div style="padding: 1rem;">
  <div class="nds-align_absolute-center" style="text-align: center; width: 8rem; background-color: rgb(255, 255, 255);">
    <div class="nds-border_left">This should have a left border.</div>
  </div>
</div>`);
  });
