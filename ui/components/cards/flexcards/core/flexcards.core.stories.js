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
  .add('Basic Card', () => {
    return withExample('Basic Card', '<div class="nds-grid nds-wrap nds-card nds-p-around_x-small nds-m-bottom_x-small"></div>');
  });
