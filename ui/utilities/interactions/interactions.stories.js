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
  .add('Reset (examples)', () => {
    return withExample(
      `<a href="javascript:void(0);" class="nds-text-link_reset">Link</a>`
    );
  })
  .add('Link (examples)', () => {
    return withExample(`<a href="javascript:void(0);" class="nds-text-link_reset">
  <!-- react-text: 3 -->This text is a link but looks like normal text...
  <!-- /react-text -->
  <span class="nds-text-link">More</span>
  <!-- react-text: 5 -->.
  <!-- /react-text -->
</a>`);
  })
  .add('Halo Focus (examples)', () => {
    return withExample(
      `<a href="javascript:void(0);" class="nds-has-blur-focus">Link with halo focus</a>`
    );
  })
  .add('Button Reset (examples)', () => {
    return withExample(
      `<button class="nds-button nds-text-link_reset">Button</button>`
    );
  })
  .add('Faux (examples)', () => {
    return withExample(
      `<span class="nds-text-link_faux">Span with faux link interactions</span>`
    );
  });
