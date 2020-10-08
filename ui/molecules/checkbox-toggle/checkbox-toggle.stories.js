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
  .add('Default (default)', () => {
    return withExample(`<div class="demo-only nds-size_1-of-2">
  <div class="nds-form-element">
    <label class="nds-checkbox_toggle nds-grid">
      <span class="nds-form-element__label nds-m-bottom_none">Toggle Label</span>
      <input type="checkbox" name="checkbox" aria-describedby="toggle-desc" value="on">
      <span id="toggle-desc" class="nds-checkbox_faux_container" aria-live="assertive">
        <span class="nds-checkbox_faux"></span>
        <span class="nds-checkbox_on">Enabled</span>
        <span class="nds-checkbox_off">Disabled</span>
      </span>
    </label>
  </div>
</div>`);
  })
  .add('Checkbox Toggle Checked (states)', () => {
    return withExample(`<div class="demo-only nds-size_1-of-2">
  <div class="nds-form-element">
    <label class="nds-checkbox_toggle nds-grid">
      <span class="nds-form-element__label nds-m-bottom_none">Toggle Label</span>
      <input type="checkbox" name="checkbox" aria-describedby="toggle-desc" value="on">
      <span id="toggle-desc" class="nds-checkbox_faux_container" aria-live="assertive">
        <span class="nds-checkbox_faux"></span>
        <span class="nds-checkbox_on">Enabled</span>
        <span class="nds-checkbox_off">Disabled</span>
      </span>
    </label>
  </div>
</div>`);
  })
  .add('Checkbox Toggle Disabled (states)', () => {
    return withExample(`<div class="demo-only nds-size_1-of-2">
  <div class="nds-form-element">
    <label class="nds-checkbox_toggle nds-grid">
      <span class="nds-form-element__label nds-m-bottom_none">Toggle Label</span>
      <input type="checkbox" name="checkbox" disabled="" aria-describedby="toggle-desc" value="on">
      <span id="toggle-desc" class="nds-checkbox_faux_container" aria-live="assertive">
        <span class="nds-checkbox_faux"></span>
        <span class="nds-checkbox_on">Enabled</span>
        <span class="nds-checkbox_off">Disabled</span>
      </span>
    </label>
  </div>
</div>`);
  });
