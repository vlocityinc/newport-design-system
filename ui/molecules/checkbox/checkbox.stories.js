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
    return withExample(`<div class="nds-form-element">
  <div class="nds-form-element__control">
    <label class="nds-checkbox">
      <input type="checkbox" name="options" id="checkbox-1" value="on">
      <span class="nds-checkbox_faux"></span>
      <label class="nds-checkbox__label">
        <span class="nds-form-element__label">Checkbox Label</span>
      </label>
    </label>
  </div>
</div>`);
  })
  .add('Indetermine', () => {
    return withExample(`<div class="nds-form-element">
  <div class="nds-form-element__control">
    <label class="nds-checkbox">
      <input type="checkbox" name="options" id="checkbox-indeterminate-01" value="on">
      <span class="nds-checkbox_faux"></span>
      <label class="nds-checkbox__label">
        <span class="nds-form-element__label">Indeterminate Checkbox Label</span>
      </label>
    </label>
  </div>
</div>`);
  })
  .add('Require', () => {
    return withExample(`<div class="nds-form-element">
  <div class="nds-form-element__control">
    <label class="nds-checkbox">
      <abbr class="nds-required" title="required">*</abbr>
      <input type="checkbox" name="options" id="checkbox-5" value="on">
      <span class="nds-checkbox_faux"></span>
      <label class="nds-checkbox__label">
        <span class="nds-form-element__label">Checkbox Label</span>
      </label>
    </label>
  </div>
</div>`);
  })
  .add('Error', () => {
    return withExample(`<div class="nds-form-element nds-has-error">
  <div class="nds-form-element__control">
    <label class="nds-checkbox">
      <abbr class="nds-required" title="required">*</abbr>
      <input type="checkbox" name="options" id="checkbox-6" aria-describedby="error_01" value="on">
      <span class="nds-checkbox_faux"></span>
      <label class="nds-checkbox__label">
        <span class="nds-form-element__label">Checkbox Label</span>
      </label>
    </label>
  </div>
  <div id="error_01" class="nds-form-element__help">This field is required</div>
</div>`);
  })
  .add('Disabled', () => {
    return withExample(`<div class="nds-form-element">
  <div class="nds-form-element__control">
    <label class="nds-checkbox">
      <input type="checkbox" name="options" id="checkbox-7" disabled="" value="on">
      <span class="nds-checkbox_faux"></span>
      <label class="nds-checkbox__label">
        <span class="nds-form-element__label">Checkbox Label</span>
      </label>
    </label>
  </div>
</div>`);
  })
  .add('Group', () => {
    return withExample(`<fieldset class="nds-form-element">
  <legend class="nds-form-element__legend nds-form-element__label">Checkbox Group Label</legend>
  <div class="nds-form-element__control">
    <label class="nds-checkbox">
      <input type="checkbox" name="options" id="checkbox-8" value="on">
      <span class="nds-checkbox_faux"></span>
      <label class="nds-checkbox__label">
        <span class="nds-form-element__label">Checkbox Label</span>
      </label>
    </label>
    <label class="nds-checkbox">
      <input type="checkbox" name="options" id="checkbox-9" value="on">
      <span class="nds-checkbox_faux"></span>
      <label class="nds-checkbox__label">
        <span class="nds-form-element__label">Checkbox Label</span>
      </label>
    </label>
  </div>
</fieldset>`);
  })
  .add('Group Required', () => {
    return withExample(`<fieldset class="nds-form-element">
  <legend class="nds-form-element__legend nds-form-element__label">
    <abbr class="nds-required" title="required">*</abbr>
    Checkbox Group Label
  </legend>
  <div class="nds-form-element__control">
    <label class="nds-checkbox">
      <input type="checkbox" name="options" id="checkbox-3" value="on">
      <span class="nds-checkbox_faux"></span>
      <label class="nds-checkbox__label">
        <span class="nds-form-element__label">Checkbox Label</span>
      </label>
    </label>
    <label class="nds-checkbox">
      <input type="checkbox" name="options" id="checkbox-4" value="on">
      <span class="nds-checkbox_faux"></span>
      <label class="nds-checkbox__label">
        <span class="nds-form-element__label">Checkbox Label</span>
      </label>
    </label>
  </div>
</fieldset>`);
  })
  .add('Group Error', () => {
    return withExample(`<fieldset class="nds-form-element nds-has-error">
  <legend class="nds-form-element__legend nds-form-element__label">
    <abbr class="nds-required" title="required">*</abbr>
    Checkbox Group Label
  </legend>
  <div class="nds-form-element__control">
    <label class="nds-checkbox">
      <input type="checkbox" name="options" id="checkbox-10" aria-describedby="error_01" value="on">
      <span class="nds-checkbox_faux"></span>
      <label class="nds-checkbox__label">
        <span class="nds-form-element__label">Checkbox Label</span>
      </label>
    </label>
    <label class="nds-checkbox">
      <input type="checkbox" name="options" id="checkbox-11" aria-describedby="error_01" value="on">
      <span class="nds-checkbox_faux"></span>
      <label class="nds-checkbox__label">
        <span class="nds-form-element__label">Checkbox Label</span>
      </label>
    </label>
  </div>
  <div id="error_01" class="nds-form-element__help">This field is required</div>
</fieldset>`);
  })
  .add('Group Disabled', () => {
    return withExample(`<fieldset class="nds-form-element">
  <legend class="nds-form-element__legend nds-form-element__label">Checkbox Group Label</legend>
  <div class="nds-form-element__control">
    <label class="nds-checkbox">
      <input type="checkbox" name="options" id="checkbox-12" disabled="" value="on">
      <span class="nds-checkbox_faux"></span>
      <label class="nds-checkbox__label">
        <span class="nds-form-element__label">Checkbox Label</span>
      </label>
    </label>
    <label class="nds-checkbox">
      <input type="checkbox" name="options" id="checkbox-13" disabled="" value="on">
      <span class="nds-checkbox_faux"></span>
      <label class="nds-checkbox__label">
        <span class="nds-form-element__label">Checkbox Label</span>
      </label>
    </label>
  </div>
</fieldset>`);
  })
  .add('Newport Group Default', () => {
    return withExample(`<fieldset class="nds-form-element">
<legend class="nds-form-element__legend nds-form-element__label">Scheduled Day(s)</legend>
<div class="nds-form-element__control">
  <div class="nds-checkbox_custom-group nds-clearfix">
    <span class="nds-button nds-checkbox_button nds-float_left  nds-cont-width">
      <input type="checkbox" id="monday" name="checkbox" value="on">
      <label class="nds-checkbox_button__label" for="monday">
        <img src="https://vlocity.com/cms/resources/vlocity-comms-bugreversed.svg">
        <span class="nds-checkbox_custom-faux">Mon</span>
      </label>
    </span>
    <span class="nds-button nds-checkbox_button nds-float_left  nds-cont-width">
      <input type="checkbox" id="tuesday" name="checkbox" value="on">
      <label class="nds-checkbox_button__label" for="tuesday">
        <img src="https://vlocity.com/cms/resources/vlocity-comms-bugreversed.svg">
        <span class="nds-checkbox_custom-faux">Tue</span>
      </label>
    </span>
    <span class="nds-button nds-checkbox_button nds-float_left  nds-cont-width">
      <input type="checkbox" id="wednesday" name="checkbox" value="on">
      <label class="nds-checkbox_button__label" for="wednesday">
        <img src="https://vlocity.com/cms/resources/vlocity-comms-bugreversed.svg">
        <span class="nds-checkbox_custom-faux">Wed</span>
      </label>
    </span>
    <span class="nds-button nds-checkbox_button nds-float_left  nds-cont-width">
      <input type="checkbox" id="thursday" name="checkbox" value="on">
      <label class="nds-checkbox_button__label" for="thursday">
        <img src="https://vlocity.com/cms/resources/vlocity-comms-bugreversed.svg">
        <span class="nds-checkbox_custom-faux">Thu</span>
      </label>
    </span>
    <span class="nds-button nds-checkbox_button nds-float_left  nds-cont-width">
      <input type="checkbox" id="friday" name="checkbox" value="on">
      <label class="nds-checkbox_button__label" for="friday">
        <img src="https://vlocity.com/cms/resources/vlocity-comms-bugreversed.svg">
        <span class="nds-checkbox_custom-faux">Fri</span>
      </label>
    </span>
  </div>
</div>
</fieldset>`);
  })
  .add('Newport Group No Images', () => {
    return withExample(`<fieldset class="nds-form-element">
<legend class="nds-form-element__legend nds-form-element__label">Scheduled Day(s)</legend>
<div class="nds-form-element__control">
  <div class="nds-checkbox_custom-group nds-clearfix">
    <span class="nds-button nds-checkbox_button nds-float_left nds-cont-width">
      <input type="checkbox" id="monday" name="checkbox" value="on">
      <label class="nds-checkbox_button__label" for="monday">
        <span class="nds-checkbox_custom-faux nds-title">Mon</span>
        <div class="nds-icon_container nds-icon-utility-check nds-multi-select">
          <span class="nds-icon_container nds-icon-utility-check" title="Description of icon when needed">
            <svg class="nds-icon nds-list__icon--size" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
            </svg>
            <span class="nds-assistive-text">Description of icon</span>
          </span>
        </div>
      </label>
    </span>
    <span class="nds-button nds-checkbox_button nds-float_left nds-cont-width">
      <input type="checkbox" id="tuesday" name="checkbox" value="on">
      <label class="nds-checkbox_button__label" for="tuesday">
        <span class="nds-checkbox_custom-faux nds-title">Tue</span>
        <div class="nds-icon_container nds-icon-utility-check nds-multi-select">
          <span class="nds-icon_container nds-icon-utility-check" title="Description of icon when needed">
            <svg class="nds-icon nds-list__icon--size" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
            </svg>
            <span class="nds-assistive-text">Description of icon</span>
          </span>
        </div>
      </label>
    </span>
    <span class="nds-button nds-checkbox_button nds-float_left nds-cont-width">
      <input type="checkbox" id="wednesday" name="checkbox" value="on">
      <label class="nds-checkbox_button__label" for="wednesday">
        <span class="nds-checkbox_custom-faux nds-title">Wed</span>
        <div class="nds-icon_container nds-icon-utility-check nds-multi-select">
          <span class="nds-icon_container nds-icon-utility-check" title="Description of icon when needed">
            <svg class="nds-icon nds-list__icon--size" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
            </svg>
            <span class="nds-assistive-text">Description of icon</span>
          </span>
        </div>
      </label>
    </span>
    <span class="nds-button nds-checkbox_button nds-float_left nds-cont-width">
      <input type="checkbox" id="thursday" name="checkbox" value="on">
      <label class="nds-checkbox_button__label" for="thursday">
        <span class="nds-checkbox_custom-faux nds-title">Thu</span>
        <div class="nds-icon_container nds-icon-utility-check nds-multi-select">
          <span class="nds-icon_container nds-icon-utility-check" title="Description of icon when needed">
            <svg class="nds-icon nds-list__icon--size" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
            </svg>
            <span class="nds-assistive-text">Description of icon</span>
          </span>
        </div>
      </label>
    </span>
    <span class="nds-button nds-checkbox_button nds-float_left nds-cont-width">
      <input type="checkbox" id="friday" name="checkbox" value="on">
      <label class="nds-checkbox_button__label" for="friday">
        <span class="nds-checkbox_custom-faux nds-title">Fri</span>
        <div class="nds-icon_container nds-icon-utility-check nds-multi-select">
          <span class="nds-icon_container nds-icon-utility-check" title="Description of icon when needed">
            <svg class="nds-icon nds-list__icon--size" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
            </svg>
            <span class="nds-assistive-text">Description of icon</span>
          </span>
        </div>
      </label>
    </span>
  </div>
</div>
</fieldset>`);
  })
  .add('Newport Group Has Error', () => {
    return withExample(`<fieldset class="nds-form-element nds-has-error">
<legend class="nds-form-element__legend nds-form-element__label">Scheduled Day(s)</legend>
<div class="nds-form-element__control">
  <div class="nds-checkbox_custom-group nds-clearfix">
    <span class="nds-button nds-checkbox_button nds-float_left  nds-cont-width">
      <input type="checkbox" aria-describedby="error_01" id="monday" name="checkbox" value="on">
      <label class="nds-checkbox_button__label" for="monday">
        <img src="https://vlocity.com/cms/resources/vlocity-comms-bugreversed.svg">
        <span class="nds-checkbox_custom-faux">Mon</span>
      </label>
    </span>
    <span class="nds-button nds-checkbox_button nds-float_left  nds-cont-width">
      <input type="checkbox" aria-describedby="error_01" id="tuesday" name="checkbox" value="on">
      <label class="nds-checkbox_button__label" for="tuesday">
        <img src="https://vlocity.com/cms/resources/vlocity-comms-bugreversed.svg">
        <span class="nds-checkbox_custom-faux">Tue</span>
      </label>
    </span>
    <span class="nds-button nds-checkbox_button nds-float_left  nds-cont-width">
      <input type="checkbox" aria-describedby="error_01" id="wednesday" name="checkbox" value="on">
      <label class="nds-checkbox_button__label" for="wednesday">
        <img src="https://vlocity.com/cms/resources/vlocity-comms-bugreversed.svg">
        <span class="nds-checkbox_custom-faux">Wed</span>
      </label>
    </span>
    <span class="nds-button nds-checkbox_button nds-float_left  nds-cont-width">
      <input type="checkbox" aria-describedby="error_01" id="thursday" name="checkbox" value="on">
      <label class="nds-checkbox_button__label" for="thursday">
        <img src="https://vlocity.com/cms/resources/vlocity-comms-bugreversed.svg">
        <span class="nds-checkbox_custom-faux">Thu</span>
      </label>
    </span>
    <span class="nds-button nds-checkbox_button nds-float_left  nds-cont-width">
      <input type="checkbox" aria-describedby="error_01" id="friday" name="checkbox" value="on">
      <label class="nds-checkbox_button__label" for="friday">
        <img src="https://vlocity.com/cms/resources/vlocity-comms-bugreversed.svg">
        <span class="nds-checkbox_custom-faux">Fri</span>
      </label>
    </span>
  </div>
  <div id="error_01" class="nds-form-element__help">This field is required</div>
</div>
</fieldset>`);
  })
  .add('Newport Group Disabled', () => {
    return withExample(`<fieldset class="nds-form-element">
<legend class="nds-form-element__legend nds-form-element__label">Scheduled Day(s)</legend>
<div class="nds-form-element__control">
  <div class="nds-checkbox_custom-group nds-clearfix">
    <span class="nds-button nds-checkbox_button nds-float_left  nds-cont-width">
      <input type="checkbox" disabled="" id="monday" name="checkbox" value="on">
      <label class="nds-checkbox_button__label" for="monday">
        <img src="https://vlocity.com/cms/resources/vlocity-comms-bugreversed.svg">
        <span class="nds-checkbox_custom-faux">Mon</span>
      </label>
    </span>
    <span class="nds-button nds-checkbox_button nds-float_left  nds-cont-width">
      <input type="checkbox" disabled="" id="tuesday" name="checkbox" value="on">
      <label class="nds-checkbox_button__label" for="tuesday">
        <img src="https://vlocity.com/cms/resources/vlocity-comms-bugreversed.svg">
        <span class="nds-checkbox_custom-faux">Tue</span>
      </label>
    </span>
    <span class="nds-button nds-checkbox_button nds-float_left  nds-cont-width">
      <input type="checkbox" disabled="" id="wednesday" name="checkbox" value="on">
      <label class="nds-checkbox_button__label" for="wednesday">
        <img src="https://vlocity.com/cms/resources/vlocity-comms-bugreversed.svg">
        <span class="nds-checkbox_custom-faux">Wed</span>
      </label>
    </span>
    <span class="nds-button nds-checkbox_button nds-float_left  nds-cont-width">
      <input type="checkbox" disabled="" id="thursday" name="checkbox" value="on">
      <label class="nds-checkbox_button__label" for="thursday">
        <img src="https://vlocity.com/cms/resources/vlocity-comms-bugreversed.svg">
        <span class="nds-checkbox_custom-faux">Thu</span>
      </label>
    </span>
    <span class="nds-button nds-checkbox_button nds-float_left  nds-cont-width">
      <input type="checkbox" disabled="" id="friday" name="checkbox" value="on">
      <label class="nds-checkbox_button__label" for="friday">
        <img src="https://vlocity.com/cms/resources/vlocity-comms-bugreversed.svg">
        <span class="nds-checkbox_custom-faux">Fri</span>
      </label>
    </span>
  </div>
</div>
</fieldset>`);
  });
