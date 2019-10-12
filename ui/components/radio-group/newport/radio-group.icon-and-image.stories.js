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
    return withExample(`<fieldset class="nds-form-element">
  <legend class="nds-form-element__legend nds-form-element__label">Radio Group Label</legend>
  <div class="nds-form-element__control">
    <div class="nds-radio_custom-group nds-clearfix">
      <span class="nds-button nds-radio_button nds-float_left nds-cont-width">
        <input type="radio" name="radio" id="monday" value="on">
        <label class="nds-radio_button__label" for="monday">
          <img src="https://vlocity.com/cms/resources/vlocity-comms-bugreversed.svg">
          <div class="nds-radio_custom-faux">Mon</div>
        </label>
      </span>
      <span class="nds-button nds-radio_button nds-float_left nds-cont-width">
        <input type="radio" name="radio" id="tuesday" value="on">
        <label class="nds-radio_button__label" for="tuesday">
          <img src="https://vlocity.com/cms/resources/vlocity-comms-bugreversed.svg">
          <div class="nds-radio_custom-faux">Tue</div>
        </label>
      </span>
      <span class="nds-button nds-radio_button nds-float_left nds-cont-width">
        <input type="radio" name="radio" id="wednesday" value="on">
        <label class="nds-radio_button__label" for="wednesday">
          <img src="https://vlocity.com/cms/resources/vlocity-comms-bugreversed.svg">
          <div class="nds-radio_custom-faux">Wed</div>
        </label>
      </span>
      <span class="nds-button nds-radio_button nds-float_left nds-cont-width">
        <input type="radio" name="radio" id="thursday" value="on">
        <label class="nds-radio_button__label" for="thursday">
          <img src="https://vlocity.com/cms/resources/vlocity-comms-bugreversed.svg">
          <div class="nds-radio_custom-faux">Thu</div>
        </label>
      </span>
      <span class="nds-button nds-radio_button nds-float_left nds-cont-width">
        <input type="radio" name="radio" id="friday" value="on">
        <label class="nds-radio_button__label" for="friday">
          <img src="https://vlocity.com/cms/resources/vlocity-comms-bugreversed.svg">
          <div class="nds-radio_custom-faux">Fri</div>
        </label>
      </span>
    </div>
  </div>
</fieldset>`);
  })
  .add('Noimage (states)', () => {
    return withExample(`<fieldset class="nds-form-element">
  <legend class="nds-form-element__legend nds-form-element__label">Radio Group Label Without Image</legend>
  <div class="nds-form-element__control">
    <div class="nds-radio_custom-group nds-clearfix">
      <span class="nds-button nds-radio_button nds-float_left nds-cont-width">
        <input type="radio" name="radio" id="monday" value="on">
        <label class="nds-radio_button__label" for="monday">
          <div class="nds-radio_custom-faux nds-title">Mon</div>
        </label>
      </span>
      <span class="nds-button nds-radio_button nds-float_left nds-cont-width">
        <input type="radio" name="radio" id="tuesday" value="on">
        <label class="nds-radio_button__label" for="tuesday">
          <div class="nds-radio_custom-faux nds-title">Tue</div>
        </label>
      </span>
      <span class="nds-button nds-radio_button nds-float_left nds-cont-width">
        <input type="radio" name="radio" id="wednesday" value="on">
        <label class="nds-radio_button__label" for="wednesday">
          <div class="nds-radio_custom-faux nds-title">Wed</div>
        </label>
      </span>
      <span class="nds-button nds-radio_button nds-float_left nds-cont-width">
        <input type="radio" name="radio" id="thursday" value="on">
        <label class="nds-radio_button__label" for="thursday">
          <div class="nds-radio_custom-faux nds-title">Thu</div>
        </label>
      </span>
      <span class="nds-button nds-radio_button nds-float_left nds-cont-width">
        <input type="radio" name="radio" id="friday" value="on">
        <label class="nds-radio_button__label" for="friday">
          <div class="nds-radio_custom-faux nds-title">Fri</div>
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
    <div class="nds-radio_custom-group nds-clearfix">
      <span class="nds-button nds-radio_button nds-float_left nds-cont-width">
        <input type="radio" name="radio" id="monday" disabled="" value="on">
        <label class="nds-radio_button__label" for="monday">
          <img src="https://vlocity.com/cms/resources/vlocity-comms-bugreversed.svg">
          <div class="nds-radio_custom-faux">Mon</div>
        </label>
      </span>
      <span class="nds-button nds-radio_button nds-float_left nds-cont-width">
        <input type="radio" name="radio" id="tuesday" disabled="" value="on">
        <label class="nds-radio_button__label" for="tuesday">
          <img src="https://vlocity.com/cms/resources/vlocity-comms-bugreversed.svg">
          <div class="nds-radio_custom-faux">Tue</div>
        </label>
      </span>
      <span class="nds-button nds-radio_button nds-float_left nds-cont-width">
        <input type="radio" name="radio" id="wednesday" disabled="" value="on">
        <label class="nds-radio_button__label" for="wednesday">
          <img src="https://vlocity.com/cms/resources/vlocity-comms-bugreversed.svg">
          <div class="nds-radio_custom-faux">Wed</div>
        </label>
      </span>
      <span class="nds-button nds-radio_button nds-float_left nds-cont-width">
        <input type="radio" name="radio" id="thursday" disabled="" value="on">
        <label class="nds-radio_button__label" for="thursday">
          <img src="https://vlocity.com/cms/resources/vlocity-comms-bugreversed.svg">
          <div class="nds-radio_custom-faux">Thu</div>
        </label>
      </span>
      <span class="nds-button nds-radio_button nds-float_left nds-cont-width">
        <input type="radio" name="radio" id="friday" disabled="" value="on">
        <label class="nds-radio_button__label" for="friday">
          <img src="https://vlocity.com/cms/resources/vlocity-comms-bugreversed.svg">
          <div class="nds-radio_custom-faux">Fri</div>
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
    <div class="nds-radio_custom-group nds-clearfix">
      <span class="nds-button nds-radio_button nds-float_left nds-cont-width">
        <input type="radio" name="radio" id="monday" value="on">
        <label class="nds-radio_button__label" for="monday">
          <img src="https://vlocity.com/cms/resources/vlocity-comms-bugreversed.svg">
          <div class="nds-radio_custom-faux">Mon</div>
        </label>
      </span>
      <span class="nds-button nds-radio_button nds-float_left nds-cont-width">
        <input type="radio" name="radio" id="tuesday" value="on">
        <label class="nds-radio_button__label" for="tuesday">
          <img src="https://vlocity.com/cms/resources/vlocity-comms-bugreversed.svg">
          <div class="nds-radio_custom-faux">Tue</div>
        </label>
      </span>
      <span class="nds-button nds-radio_button nds-float_left nds-cont-width">
        <input type="radio" name="radio" id="wednesday" value="on">
        <label class="nds-radio_button__label" for="wednesday">
          <img src="https://vlocity.com/cms/resources/vlocity-comms-bugreversed.svg">
          <div class="nds-radio_custom-faux">Wed</div>
        </label>
      </span>
      <span class="nds-button nds-radio_button nds-float_left nds-cont-width">
        <input type="radio" name="radio" id="thursday" value="on">
        <label class="nds-radio_button__label" for="thursday">
          <img src="https://vlocity.com/cms/resources/vlocity-comms-bugreversed.svg">
          <div class="nds-radio_custom-faux">Thu</div>
        </label>
      </span>
      <span class="nds-button nds-radio_button nds-float_left nds-cont-width">
        <input type="radio" name="radio" id="friday" value="on">
        <label class="nds-radio_button__label" for="friday">
          <img src="https://vlocity.com/cms/resources/vlocity-comms-bugreversed.svg">
          <div class="nds-radio_custom-faux">Fri</div>
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
    <div class="nds-radio_custom-group nds-clearfix">
      <span class="nds-button nds-radio_button nds-float_left nds-cont-width">
        <input type="radio" name="radio" id="monday" aria-describedby="error_01" value="on">
        <label class="nds-radio_button__label" for="monday">
          <img src="https://vlocity.com/cms/resources/vlocity-comms-bugreversed.svg">
          <div class="nds-radio_custom-faux">Mon</div>
        </label>
      </span>
      <span class="nds-button nds-radio_button nds-float_left nds-cont-width">
        <input type="radio" name="radio" id="tuesday" aria-describedby="error_01" value="on">
        <label class="nds-radio_button__label" for="tuesday">
          <img src="https://vlocity.com/cms/resources/vlocity-comms-bugreversed.svg">
          <div class="nds-radio_custom-faux">Tue</div>
        </label>
      </span>
      <span class="nds-button nds-radio_button nds-float_left nds-cont-width">
        <input type="radio" name="radio" id="wednesday" aria-describedby="error_01" value="on">
        <label class="nds-radio_button__label" for="wednesday">
          <img src="https://vlocity.com/cms/resources/vlocity-comms-bugreversed.svg">
          <div class="nds-radio_custom-faux">Wed</div>
        </label>
      </span>
      <span class="nds-button nds-radio_button nds-float_left nds-cont-width">
        <input type="radio" name="radio" id="thursday" aria-describedby="error_01" value="on">
        <label class="nds-radio_button__label" for="thursday">
          <img src="https://vlocity.com/cms/resources/vlocity-comms-bugreversed.svg">
          <div class="nds-radio_custom-faux">Thu</div>
        </label>
      </span>
      <span class="nds-button nds-radio_button nds-float_left nds-cont-width">
        <input type="radio" name="radio" id="friday" aria-describedby="error_01" value="on">
        <label class="nds-radio_button__label" for="friday">
          <img src="https://vlocity.com/cms/resources/vlocity-comms-bugreversed.svg">
          <div class="nds-radio_custom-faux">Fri</div>
        </label>
      </span>
    </div>
    <div id="error_01" class="nds-form-element__help">This field is required</div>
  </div>
</fieldset>`);
  })
  .add('With tooltip', () => {
    return withExample(`<fieldset class="nds-form-element">
  <legend class="nds-form-element__legend nds-form-element__label">
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
    <div class="nds-radio_custom-group nds-clearfix">
      <span class="nds-button nds-radio_button nds-float_left nds-cont-width">
        <input type="radio" name="radio" id="monday" value="on">
        <label class="nds-radio_button__label" for="monday">
          <img src="https://vlocity.com/cms/resources/vlocity-comms-bugreversed.svg">
          <div class="nds-radio_custom-faux">Mon</div>
        </label>
      </span>
      <span class="nds-button nds-radio_button nds-float_left nds-cont-width">
        <input type="radio" name="radio" id="tuesday" value="on">
        <label class="nds-radio_button__label" for="tuesday">
          <img src="https://vlocity.com/cms/resources/vlocity-comms-bugreversed.svg">
          <div class="nds-radio_custom-faux">Tue</div>
        </label>
      </span>
      <span class="nds-button nds-radio_button nds-float_left nds-cont-width">
        <input type="radio" name="radio" id="wednesday" value="on">
        <label class="nds-radio_button__label" for="wednesday">
          <img src="https://vlocity.com/cms/resources/vlocity-comms-bugreversed.svg">
          <div class="nds-radio_custom-faux">Wed</div>
        </label>
      </span>
      <span class="nds-button nds-radio_button nds-float_left nds-cont-width">
        <input type="radio" name="radio" id="thursday" value="on">
        <label class="nds-radio_button__label" for="thursday">
          <img src="https://vlocity.com/cms/resources/vlocity-comms-bugreversed.svg">
          <div class="nds-radio_custom-faux">Thu</div>
        </label>
      </span>
      <span class="nds-button nds-radio_button nds-float_left nds-cont-width">
        <input type="radio" name="radio" id="friday" value="on">
        <label class="nds-radio_button__label" for="friday">
          <img src="https://vlocity.com/cms/resources/vlocity-comms-bugreversed.svg">
          <div class="nds-radio_custom-faux">Fri</div>
        </label>
      </span>
    </div>
  </div>
</fieldset>`);
  });
