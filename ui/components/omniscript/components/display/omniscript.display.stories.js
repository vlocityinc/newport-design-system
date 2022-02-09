/* eslint-env browser */
import { storiesOf } from '@storybook/html';
import { withKnobs, radios } from '@storybook/addon-knobs';
import base from 'paths.macro';
import notes from './doc.md';
import {
  withExample,
  withDocs,
} from '../../../../../scripts/storybook';

storiesOf(`${base}`.replace(/(^\/)|(\/$)/g, ''), module)
  .addDecorator(withKnobs)
  .addDecorator(withDocs(notes))
  .add('Line Break', () => {
    return withExample('', 'A line break configured in the designer has a property to set the bottom padding value as pixels.', `<div class="nds-size_1-of-1 nds-line_break"
      style="padding-bottom: 20px"></div>`);
  })
  .add('Text Block', () => {
    return withExample(`
      <div class="nds-form-element nds-form-container nds-text-block">
      <lightning-formatted-rich-text class="nds-rich-text-editor__output"><span>
      <p><strong>This is a text block</strong></p>
      </span></lightning-formatted-rich-text>
      </div>`);
  });
