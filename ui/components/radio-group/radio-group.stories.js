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
    <span class="nds-radio">
      <input type="radio" id="radio-15" name="options" value="on">
      <label class="nds-radio__label" for="radio-15">
        <span class="nds-radio_faux"></span>
        <span class="nds-form-element__label">Radio Label One</span>
      </label>
    </span>
    <span class="nds-radio">
      <input type="radio" id="radio-16" name="options" value="on">
      <label class="nds-radio__label" for="radio-16">
        <span class="nds-radio_faux"></span>
        <span class="nds-form-element__label">Radio Label Two</span>
      </label>
    </span>
  </div>
</fieldset>`);
  })
  .add('Disabled (states)', () => {
    return withExample(`<fieldset class="nds-form-element">
  <legend class="nds-form-element__legend nds-form-element__label">Radio Group Label</legend>
  <div class="nds-form-element__control">
    <span class="nds-radio">
      <input type="radio" id="radio-9" name="options" disabled="" value="on">
      <label class="nds-radio__label" for="radio-9">
        <span class="nds-radio_faux"></span>
        <span class="nds-form-element__label">Radio Label One</span>
      </label>
    </span>
    <span class="nds-radio">
      <input type="radio" id="radio-10" name="options" value="on">
      <label class="nds-radio__label" for="radio-10">
        <span class="nds-radio_faux"></span>
        <span class="nds-form-element__label">Radio Label Two</span>
      </label>
    </span>
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
    <span class="nds-radio">
      <input type="radio" id="radio-11" name="options" value="on">
      <label class="nds-radio__label" for="radio-11">
        <span class="nds-radio_faux"></span>
        <span class="nds-form-element__label">Radio Label One</span>
      </label>
    </span>
    <span class="nds-radio">
      <input type="radio" id="radio-12" name="options" value="on">
      <label class="nds-radio__label" for="radio-12">
        <span class="nds-radio_faux"></span>
        <span class="nds-form-element__label">Radio Label Two</span>
      </label>
    </span>
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
    <span class="nds-radio">
      <input type="radio" id="radio-13" name="options" aria-describedby="error_01" value="on">
      <label class="nds-radio__label" for="radio-13">
        <span class="nds-radio_faux"></span>
        <span class="nds-form-element__label">Radio Label One</span>
      </label>
    </span>
    <span class="nds-radio">
      <input type="radio" id="radio-14" name="options" aria-describedby="error_01" value="on">
      <label class="nds-radio__label" for="radio-14">
        <span class="nds-radio_faux"></span>
        <span class="nds-form-element__label">Radio Label Two</span>
      </label>
    </span>
  </div>
  <div id="error_01" class="nds-form-element__help">This field is required</div>
</fieldset>`);
  });
