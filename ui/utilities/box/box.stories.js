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
  .add('Default (examples)', () => {
    return withExample(`<div class="nds-box">
  <p>This is a regular-sized box.</p>
</div>`);
  })
  .add('Small (examples)', () => {
    return withExample(`<div class="nds-box nds-box_small">
  <p>This is a small box.</p>
</div>`);
  })
  .add('X Small (examples)', () => {
    return withExample(`<div class="nds-box nds-box_x-small">
  <p>This is an extra-small box.</p>
</div>`);
  })
  .add('Xx Small (examples)', () => {
    return withExample(`<div class="nds-box nds-box_xx-small">
  <p>This is an extra-extra-small box.</p>
</div>`);
  });
