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
  })
  .add('With tooltip', () => {
    return withExample(`<fieldset class="nds-form-element">
<legend class="nds-form-element__legend nds-form-element__label nds-form-element__control-help">
<span>Radio Group Label</span>
<div class="nds-tooltip_container">
                                  <div class="nds-nonfocused_control nds-inline-help-text">
                                    <svg aria-hidden="true" class="nds-icon nds-icon_small " xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" icon="'info'" viewBox="0 0 52 52" alt="info">
                                      <path fill="inherit" xmlns="http://www.w3.org/2000/svg" d="m26 2c-13.3 0-24 10.7-24 24s10.7 24 24 24 24-10.7 24-24-10.7-24-24-24z m0 12.1c1.7 0 3 1.3 3 3s-1.3 3-3 3-3-1.3-3-3 1.3-3 3-3z m5 21c0 0.5-0.4 0.9-1 0.9h-8c-0.5 0-1-0.3-1-0.9v-2c0-0.5 0.4-1.1 1-1.1 0.5 0 1-0.3 1-0.9v-4c0-0.5-0.4-1.1-1-1.1-0.5 0-1-0.3-1-0.9v-2c0-0.5 0.4-1.1 1-1.1h6c0.5 0 1 0.5 1 1.1v8c0 0.5 0.4 0.9 1 0.9 0.5 0 1 0.5 1 1.1v2z"></path>
                                    </svg>
                                    <div class="nds-is-absolute">
                                      <div class="nds-popover nds-popover_tooltip nds-nubbin_bottom-right" role="tooltip">
                                        <div class="nds-popover__body">This is a Radio picklist</div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
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
  });
