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
  .add('Absolute Center (examples)', () => {
    return withExample(`<div class="nds-align_absolute-center" style="height: 5rem;">
  <div class="nds-align_absolute-center">This content will be positioned in the absolute center of its container</div>
</div>`);
  });
