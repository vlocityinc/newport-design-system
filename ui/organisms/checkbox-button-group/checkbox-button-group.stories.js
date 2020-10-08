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
    return withExample(`<fieldset class="nds-form-element">
  <legend class="nds-form-element__legend nds-form-element__label">Scheduled Day(s)</legend>
  <div class="nds-form-element__control">
    <div class="nds-checkbox_button-group">
      <span class="nds-button nds-checkbox_button">
        <input type="checkbox" id="monday" name="checkbox" value="on">
        <label class="nds-checkbox_button__label" for="monday">
          <span class="nds-checkbox_faux">Mon</span>
        </label>
      </span>
      <span class="nds-button nds-checkbox_button">
        <input type="checkbox" id="tuesday" name="checkbox" value="on">
        <label class="nds-checkbox_button__label" for="tuesday">
          <span class="nds-checkbox_faux">Tue</span>
        </label>
      </span>
      <span class="nds-button nds-checkbox_button">
        <input type="checkbox" id="wednesday" name="checkbox" value="on">
        <label class="nds-checkbox_button__label" for="wednesday">
          <span class="nds-checkbox_faux">Wed</span>
        </label>
      </span>
      <span class="nds-button nds-checkbox_button">
        <input type="checkbox" id="thursday" name="checkbox" value="on">
        <label class="nds-checkbox_button__label" for="thursday">
          <span class="nds-checkbox_faux">Thu</span>
        </label>
      </span>
      <span class="nds-button nds-checkbox_button">
        <input type="checkbox" id="friday" name="checkbox" value="on">
        <label class="nds-checkbox_button__label" for="friday">
          <span class="nds-checkbox_faux">Fri</span>
        </label>
      </span>
    </div>
  </div>
</fieldset>`);
  })
  .add('Has Error (states)', () => {
    return withExample(`<fieldset class="nds-form-element nds-has-error">
  <legend class="nds-form-element__legend nds-form-element__label">Scheduled Day(s)</legend>
  <div class="nds-form-element__control">
    <div class="nds-checkbox_button-group">
      <span class="nds-button nds-checkbox_button">
        <input type="checkbox" aria-describedby="error_01" id="monday" name="checkbox" value="on">
        <label class="nds-checkbox_button__label" for="monday">
          <span class="nds-checkbox_faux">Mon</span>
        </label>
      </span>
      <span class="nds-button nds-checkbox_button">
        <input type="checkbox" aria-describedby="error_01" id="tuesday" name="checkbox" value="on">
        <label class="nds-checkbox_button__label" for="tuesday">
          <span class="nds-checkbox_faux">Tue</span>
        </label>
      </span>
      <span class="nds-button nds-checkbox_button">
        <input type="checkbox" aria-describedby="error_01" id="wednesday" name="checkbox" value="on">
        <label class="nds-checkbox_button__label" for="wednesday">
          <span class="nds-checkbox_faux">Wed</span>
        </label>
      </span>
      <span class="nds-button nds-checkbox_button">
        <input type="checkbox" aria-describedby="error_01" id="thursday" name="checkbox" value="on">
        <label class="nds-checkbox_button__label" for="thursday">
          <span class="nds-checkbox_faux">Thu</span>
        </label>
      </span>
      <span class="nds-button nds-checkbox_button">
        <input type="checkbox" aria-describedby="error_01" id="friday" name="checkbox" value="on">
        <label class="nds-checkbox_button__label" for="friday">
          <span class="nds-checkbox_faux">Fri</span>
        </label>
      </span>
    </div>
    <div id="error_01" class="nds-form-element__help">This field is required</div>
  </div>
</fieldset>`);
  })
  .add('Disabled (states)', () => {
    return withExample(`<fieldset class="nds-form-element">
  <legend class="nds-form-element__legend nds-form-element__label">Scheduled Day(s)</legend>
  <div class="nds-form-element__control">
    <div class="nds-checkbox_button-group">
      <span class="nds-button nds-checkbox_button">
        <input type="checkbox" disabled="" id="monday" name="checkbox" value="on">
        <label class="nds-checkbox_button__label" for="monday">
          <span class="nds-checkbox_faux">Mon</span>
        </label>
      </span>
      <span class="nds-button nds-checkbox_button">
        <input type="checkbox" disabled="" id="tuesday" name="checkbox" value="on">
        <label class="nds-checkbox_button__label" for="tuesday">
          <span class="nds-checkbox_faux">Tue</span>
        </label>
      </span>
      <span class="nds-button nds-checkbox_button">
        <input type="checkbox" disabled="" id="wednesday" name="checkbox" value="on">
        <label class="nds-checkbox_button__label" for="wednesday">
          <span class="nds-checkbox_faux">Wed</span>
        </label>
      </span>
      <span class="nds-button nds-checkbox_button">
        <input type="checkbox" disabled="" id="thursday" name="checkbox" value="on">
        <label class="nds-checkbox_button__label" for="thursday">
          <span class="nds-checkbox_faux">Thu</span>
        </label>
      </span>
      <span class="nds-button nds-checkbox_button">
        <input type="checkbox" disabled="" id="friday" name="checkbox" value="on">
        <label class="nds-checkbox_button__label" for="friday">
          <span class="nds-checkbox_faux">Fri</span>
        </label>
      </span>
    </div>
  </div>
</fieldset>`);
  });
