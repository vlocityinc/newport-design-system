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
    return withExample(`<div class="nds-form nds-form_stacked">
  <div class="nds-form-element">
    <label class="nds-form-element__label" for="input-id-01">
      Text Input

    </label>
    <div class="nds-form-element__control">
      <input type="text" id="input-id-01" class="nds-input" placeholder="Placeholder Text">
    </div>
  </div>
  <div class="nds-form-element">
    <label class="nds-form-element__label" for="input-id-02">
      Textarea Label

    </label>
    <div class="nds-form-element__control">
      <textarea id="input-id-02" class="nds-textarea" placeholder="Placeholder Text"></textarea>
    </div>
  </div>
  <fieldset class="nds-form-element">
    <legend class="nds-form-element__legend nds-form-element__label">Checkbox Group label</legend>
    <div class="nds-form-element__control">
      <label class="nds-checkbox">
        <input type="checkbox" name="default" id="checkbox-115" value="on">
        <span class="nds-checkbox_faux"></span>
        <label class="nds-checkbox__label">
          <span class="nds-form-element__label">All opportunities owned by you</span>
        </label>
      </label>
      <label class="nds-checkbox">
        <input type="checkbox" name="default" id="checkbox-116" value="on">
        <span class="nds-checkbox_faux"></span>
        <label class="nds-checkbox__label">
          <span class="nds-form-element__label">All contacts in the account owned by you</span>
        </label>
      </label>
    </div>
  </fieldset>
  <fieldset class="nds-form-element">
    <legend class="nds-form-element__legend nds-form-element__label">Checkbox Group label</legend>
    <div class="nds-form-element__control">
      <span class="nds-radio">
        <input type="radio" id="radio-5" name="options" value="on">
        <label class="nds-radio__label" for="radio-5">
          <span class="nds-radio_faux"></span>
          <span class="nds-form-element__label">Lead Generation</span>
        </label>
      </span>
      <span class="nds-radio">
        <input type="radio" id="radio-6" name="options" value="on">
        <label class="nds-radio__label" for="radio-6">
          <span class="nds-radio_faux"></span>
          <span class="nds-form-element__label">Education Leads</span>
        </label>
      </span>
    </div>
  </fieldset>
</div>`);
  })
  .add('Horizontal (states)', () => {
    return withExample(`<div class="nds-form nds-form_horizontal">
  <div class="nds-form-element">
    <label class="nds-form-element__label" for="input-id-01">
      Text Input

    </label>
    <div class="nds-form-element__control">
      <input type="text" id="input-id-01" class="nds-input" placeholder="Placeholder Text">
    </div>
  </div>
  <div class="nds-form-element">
    <label class="nds-form-element__label" for="input-id-02">
      Textarea Label

    </label>
    <div class="nds-form-element__control">
      <textarea id="input-id-02" class="nds-textarea" placeholder="Placeholder Text"></textarea>
    </div>
  </div>
  <fieldset class="nds-form-element">
    <legend class="nds-form-element__legend nds-form-element__label">Checkbox Group label</legend>
    <div class="nds-form-element__control">
      <label class="nds-checkbox">
        <input type="checkbox" name="default" id="checkbox-117" value="on">
        <span class="nds-checkbox_faux"></span>
        <label class="nds-checkbox__label">
          <span class="nds-form-element__label">All opportunities owned by you</span>
        </label>
      </label>
      <label class="nds-checkbox">
        <input type="checkbox" name="default" id="checkbox-118" value="on">
        <span class="nds-checkbox_faux"></span>
        <label class="nds-checkbox__label">
          <span class="nds-form-element__label">All contacts in the account owned by you</span>
        </label>
      </label>
    </div>
  </fieldset>
  <fieldset class="nds-form-element">
    <legend class="nds-form-element__legend nds-form-element__label">Checkbox Group label</legend>
    <div class="nds-form-element__control">
      <span class="nds-radio">
        <input type="radio" id="radio-7" name="options" value="on">
        <label class="nds-radio__label" for="radio-7">
          <span class="nds-radio_faux"></span>
          <span class="nds-form-element__label">Lead Generation</span>
        </label>
      </span>
      <span class="nds-radio">
        <input type="radio" id="radio-8" name="options" value="on">
        <label class="nds-radio__label" for="radio-8">
          <span class="nds-radio_faux"></span>
          <span class="nds-form-element__label">Education Leads</span>
        </label>
      </span>
    </div>
  </fieldset>
</div>`);
  });
