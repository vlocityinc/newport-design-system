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
    return withExample(
    `<div style="width: 200px;">
       <p class="nds-break-word">The quick brown fox jumps over the lazy dog. The-quick-brown-fox-jumps-over-the-lazy-dog. The_quick_brown_fox_jumps_over_the_lazy_dog.</p>
     </div>`
    );
  });
