import { storiesOf } from '@storybook/html';
import base from 'paths.macro';
import notes from './doc.md';
import scss from './base/_index.scss';
import {
  withExample,
  withDocs,
  commentToHTML
} from '../../../scripts/storybook';

storiesOf(`${base}`, module)
  .addDecorator(withDocs(notes))
  .addDecorator(commentToHTML(scss))
  .add('Default', () => {
    return withExample(`<div class="nds-checkbox_add-button">
  <input type="checkbox" class="nds-assistive-text" id="add-checkbox-1" value="on">
  <label for="add-checkbox-1" class="nds-checkbox_faux">
    <span class="nds-assistive-text">Add product</span>
  </label>
</div>`);
  })
  .add('Add Button Checked State', () => {
    return withExample(`<div class="nds-checkbox_add-button">
  <input type="checkbox" class="nds-assistive-text" id="add-checkbox-2" value="on" checked="checked">
  <label for="add-checkbox-2" class="nds-checkbox_faux">
    <span class="nds-assistive-text">Add product</span>
  </label>
</div>`);
  })
  .add('Add Button Disabled', () => {
    return withExample(`<div class="nds-checkbox_add-button">
  <input type="checkbox" class="nds-assistive-text" id="add-checkbox-3" disabled="" value="on">
  <label for="add-checkbox-3" class="nds-checkbox_faux">
    <span class="nds-assistive-text">Add product</span>
  </label>
</div>`);
  });
