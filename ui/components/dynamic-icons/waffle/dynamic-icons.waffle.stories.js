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
    return withExample(`<button class="nds-button nds-icon-waffle_container" title="Description of the icon when needed">
  <span class="nds-icon-waffle">
    <span class="nds-r1"></span>
    <span class="nds-r2"></span>
    <span class="nds-r3"></span>
    <span class="nds-r4"></span>
    <span class="nds-r5"></span>
    <span class="nds-r6"></span>
    <span class="nds-r7"></span>
    <span class="nds-r8"></span>
    <span class="nds-r9"></span>
  </span>
  <span class="nds-assistive-text">Open App Launcher</span>
</button>`);
  });
