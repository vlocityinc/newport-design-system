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
  <legend class="nds-form-element__legend nds-form-element__label">Radio Group Label</legend>
  <div class="nds-form-element__control">
    <div class="nds-radio_button-group">
      <span class="nds-button nds-radio_button">
        <input type="radio" name="radio" id="male" value="on">
        <label class="nds-radio_button__label" for="male">
          <span class="nds-radio_faux">Male</span>
          <div class="nds-radio-overlay"></div>
        </label>
      </span>
      <span class="nds-button nds-radio_button">
        <input type="radio" name="radio" id="female" value="on">
        <label class="nds-radio_button__label" for="female">
          <span class="nds-radio_faux">Female</span>
          <div class="nds-radio-overlay"></div>
        </label>
      </span>
    </div>
  </div>
</fieldset>`);
  })
  .add('Disabled (states)', () => {
    return withExample(`<fieldset class="nds-form-element">
  <legend class="nds-form-element__legend nds-form-element__label">Radio Group Label</legend>
  <div class="nds-form-element__control">
    <div class="nds-radio_button-group">
      <span class="nds-button nds-radio_button">
        <input type="radio" name="radio" id="male" value="on">
        <label class="nds-radio_button__label" for="male">
          <span class="nds-radio_faux">Male</span>
          <div class="nds-radio-overlay"></div>
        </label>
      </span>
      <span class="nds-button nds-radio_button">
        <input type="radio" name="radio" id="female" value="on">
        <label class="nds-radio_button__label" for="female">
          <span class="nds-radio_faux">Female</span>
          <div class="nds-radio-overlay"></div>
        </label>
      </span>
    </div>
  </div>
</fieldset>`);
  })
  .add('Required (states)', () => {
    return withExample(`<fieldset class="nds-form-element">
  <legend class="nds-form-element__legend nds-form-element__label">
    <abbr class="nds-required" title="required">*</abbr>
    Radio Group Label

  </legend>
  <div class="nds-form-element__control">
    <div class="nds-radio_button-group">
      <span class="nds-button nds-radio_button">
        <input type="radio" name="radio" id="male" value="on">
        <label class="nds-radio_button__label" for="male">
          <span class="nds-radio_faux">Male</span>
          <div class="nds-radio-overlay"></div>
        </label>
      </span>
      <span class="nds-button nds-radio_button">
        <input type="radio" name="radio" id="female" value="on">
        <label class="nds-radio_button__label" for="female">
          <span class="nds-radio_faux">Female</span>
          <div class="nds-radio-overlay"></div>
        </label>
      </span>
    </div>
  </div>
</fieldset>`);
  })
  .add('Error (states)', () => {
    return withExample(`<fieldset class="nds-form-element nds-has-error">
  <legend class="nds-form-element__legend nds-form-element__label">
    <abbr class="nds-required" title="required">*</abbr>
    Radio Group Label

  </legend>
  <div class="nds-form-element__control">
    <div class="nds-radio_button-group">
      <span class="nds-button nds-radio_button">
        <input type="radio" name="radio" id="male" aria-describedby="error_01" value="on">
        <label class="nds-radio_button__label" for="male">
          <span class="nds-radio_faux">Male</span>
          <div class="nds-radio-overlay"></div>
        </label>
      </span>
      <span class="nds-button nds-radio_button">
        <input type="radio" name="radio" id="female" aria-describedby="error_01" value="on">
        <label class="nds-radio_button__label" for="female">
          <span class="nds-radio_faux">Female</span>
          <div class="nds-radio-overlay"></div>
        </label>
      </span>
    </div>
    <div id="error_01" class="nds-form-element__help">This field is required</div>
  </div>
</fieldset>`);
  });
