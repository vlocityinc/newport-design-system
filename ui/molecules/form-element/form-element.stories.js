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
    return withExample(`<div class="nds-form-element">
  <label class="nds-form-element__label" for="input-unique-id">
    Form Element Label

  </label>
  <div class="nds-form-element__control">
    <input type="text" id="input-unique-id" class="nds-input" placeholder="Placeholder Text">
  </div>
</div>`);
  })
  .add('Required (states)', () => {
    return withExample(`<div class="nds-form-element">
  <label class="nds-form-element__label" for="input-unique-id">
    <abbr class="nds-required" title="required">*</abbr>
    Form Element Label

  </label>
  <div class="nds-form-element__control">
    <input type="text" id="input-unique-id" required="" class="nds-input" placeholder="Placeholder Text">
  </div>
</div>`);
  })
  .add('Error (states)', () => {
    return withExample(`<div class="nds-form-element nds-has-error">
  <label class="nds-form-element__label" for="input-unique-id">
    <abbr class="nds-required" title="required">*</abbr>
    Form Element Label

  </label>
  <div class="nds-form-element__control">
    <input type="text" id="input-unique-id" required="" aria-describedby="error-message-unique-id" class="nds-input" placeholder="Placeholder Text">
  </div>
  <div class="nds-form-element__help" id="error-message-unique-id">This field is required</div>
</div>`);
  })
  .add('Input (examples)', () => {
    return withExample(`<div class="nds-form-element">
  <label class="nds-form-element__label" for="input-unique-id">
    Form Element Label

  </label>
  <div class="nds-form-element__control">
    <input type="text" id="input-unique-id" class="nds-input" placeholder="Placeholder Text">
  </div>
</div>`);
  })
  .add('Textarea (examples)', () => {
    return withExample(`<div class="nds-form-element">
  <label class="nds-form-element__label" for="input-unique-id">
    Form Element Label

  </label>
  <div class="nds-form-element__control">
    <textarea id="input-unique-id" class="nds-textarea" placeholder="Placeholder Text"></textarea>
  </div>
</div>`);
  })
  .add('Checkbox (examples)', () => {
    return withExample(`<div class="nds-form-element">
  <div class="nds-form-element__control">
    <label class="nds-checkbox">
      <input type="checkbox" name="options" id="checkbox-113" value="on">
      <span class="nds-checkbox_faux"></span>
      <label class="nds-checkbox__label">
        <span class="nds-form-element__label">Checkbox Label</span>
      </label>
    </label>
  </div>
</div>`);
  })
  .add('Radio Group (examples)', () => {
    return withExample(`<fieldset class="nds-form-element">
  <legend class="nds-form-element__legend nds-form-element__label">Form Element Label</legend>
  <div class="nds-form-element__control">
    <span class="nds-radio">
      <input type="radio" id="radio-1" name="options" value="on">
      <label class="nds-radio__label" for="radio-1">
        <span class="nds-radio_faux"></span>
        <span class="nds-form-element__label">Radio Label One</span>
      </label>
    </span>
    <span class="nds-radio">
      <input type="radio" id="radio-2" name="options" value="on">
      <label class="nds-radio__label" for="radio-2">
        <span class="nds-radio_faux"></span>
        <span class="nds-form-element__label">Radio Label Two</span>
      </label>
    </span>
  </div>
</fieldset>`);
  })
  .add('Inline Help (examples)', () => {
    return withExample(`<div class="nds-form-element">
  <label class="nds-form-element__label" for="input-unique-id">
    Form Element Label

  </label>
  <div class="nds-form-element__control">
    <input type="text" id="input-unique-id" class="nds-input" placeholder="Placeholder Text">
  </div>
  <div class="nds-form-element__help">ex: (415)111-2222</div>
</div>`);
  })
  .add('Tooltip Help (examples)', () => {
    return withExample(`<div class="nds-form-element">
  <label class="nds-form-element__label" for="input-unique-id">
    Form Element Label

  </label>
  <div class="nds-form-element__icon">
    <button aria-describedby="help" class="nds-button nds-button_icon">
      <svg class="nds-icon nds-icon_x-small nds-icon-text-default" aria-hidden="true">
        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#info"></use>
      </svg>
      <span class="nds-assistive-text">Help</span>
    </button>
  </div>
  <div class="nds-form-element__control">
    <input type="text" id="input-unique-id" class="nds-input" placeholder="Placeholder Text">
  </div>
</div>`);
  });
