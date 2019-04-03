import { storiesOf } from '@storybook/html';
import base from 'paths.macro';
import notes from '../doc.md';
import scss from './_index.scss';
import {
  withExample,
  withDocs,
  commentToHTML
} from '../../../../scripts/storybook';

storiesOf(`${base}`, module)
  .addDecorator(withDocs(notes))
  .addDecorator(commentToHTML(scss))
  .add('Default (default)', () => {
    return withExample(`<div class="nds-icon-eq nds-is-animated" title="Description of the icon when needed">
  <div class="nds-icon-eq__bar"></div>
  <div class="nds-icon-eq__bar"></div>
  <div class="nds-icon-eq__bar"></div>
  <span class="nds-assistive-text">Text alternative when needed</span>
</div>`);
  });
