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
    return withExample(`<div class="nds-form-element">
  <div class="nds-form-element__control nds-form-element__control-animated-label">
    <input type="text" id="text-input-id-1" class="nds-input nds-has-value" required="">
    <label class="nds-form-element__label" for="text-input-id-1">Input Label</label>
  </div>
</div>`);
  })
  .add('Input Required (states)', () => {
    return withExample(`<div class="nds-form-element">
  <div class="nds-form-element__control nds-form-element__control-animated-label">
    <input type="text" required="" id="text-input-id-1" class="nds-input nds-has-value">
    <label class="nds-form-element__label" for="text-input-id-1">
      <abbr class="nds-required" title="required">*</abbr>


      Input Label

    </label>
  </div>
</div>`);
  })
  .add('Input Disabled (states)', () => {
    return withExample(`<div class="nds-form-element">
  <div class="nds-form-element__control nds-form-element__control-animated-label">
    <input type="text" disabled="" id="text-input-id-1" class="nds-input nds-has-value" required="">
    <label class="nds-form-element__label" for="text-input-id-1">Input Label</label>
  </div>
</div>`);
  })
  .add('Input Error (states)', () => {
    return withExample(`<div class="nds-form-element nds-has-error">
  <div class="nds-form-element__control nds-form-element__control-animated-label">
    <input type="text" required="" aria-describedby="error-message" id="text-input-id-1" class="nds-input nds-has-value">
    <label class="nds-form-element__label" for="text-input-id-1">
      <abbr class="nds-required" title="required">*</abbr>


      Input Label

    </label>
  </div>
  <div id="error-message" class="nds-form-element__help">This field is required</div>
</div>`);
  })
  .add('Input Error Icon (states)', () => {
    return withExample(`<div class="nds-form-element nds-has-error">
  <div class="nds-form-element__control nds-form-element__control-animated-label nds-input-has-icon nds-input-has-icon_left">
    <svg class="nds-input__icon" aria-hidden="true">
      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#warning"></use>
    </svg>
    <input type="text" required="" aria-describedby="error-message" id="text-input-id-1" class="nds-input nds-has-value">
    <label class="nds-form-element__label" for="text-input-id-1">
      <abbr class="nds-required" title="required">*</abbr>


      Input Label

    </label>
  </div>
  <div id="error-message" class="nds-form-element__help">This field is required</div>
</div>`);
  })
  .add('Read Only (states)', () => {
    return withExample(`<div class="nds-form-element">
  <div class="nds-form-element__control nds-form-element__control-animated-label">
    <input type="text" readonly="" placeholder="" id="text-input-id-1" class="nds-input nds-has-value" required="" value="Read Only">
    <label class="nds-form-element__label" for="text-input-id-1">Input Label</label>
  </div>
</div>`);
  })
  .add('Static (states)', () => {
    return withExample(`<div class="nds-form-element">
  <div class="nds-form-element__control nds-form-element__control-animated-label">
    <span class="nds-form-element__static">Read Only</span>
    <span class="nds-form-element__label">Input Label</span>
  </div>
</div>`);
  })
  .add('Left Icon (examples)', () => {
    return withExample(`<div class="nds-form-element">
  <div class="nds-form-element__control nds-form-element__control-animated-label nds-input-has-icon nds-input-has-icon_left">
    <svg class="nds-icon nds-input__icon nds-input__icon_left nds-icon-text-default" aria-hidden="true">
      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#search"></use>
    </svg>
    <input type="text" id="text-input-id-1" class="nds-input nds-has-value" required="">
    <label class="nds-form-element__label" for="text-input-id-1">Input Label</label>
  </div>
</div>`);
  })
  .add('Right Icon (examples)', () => {
    return withExample(`<div class="nds-form-element">
  <div class="nds-form-element__control nds-form-element__control-animated-label nds-input-has-icon nds-input-has-icon_right">
    <svg class="nds-icon nds-input__icon nds-input__icon_right nds-icon-text-default" aria-hidden="true">
      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#search"></use>
    </svg>
    <input type="text" id="text-input-id-1" class="nds-input nds-has-value" required="">
    <label class="nds-form-element__label" for="text-input-id-1">Input Label</label>
  </div>
</div>`);
  })
  .add('Double Icon (examples)', () => {
    return withExample(`<div class="nds-form-element">
  <div class="nds-form-element__control nds-form-element__control-animated-label nds-input-has-icon nds-input-has-icon_left-right">
    <svg class="nds-icon nds-input__icon nds-input__icon_left nds-icon-text-default" aria-hidden="true">
      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#search"></use>
    </svg>
    <input type="text" id="text-input-id-1" class="nds-input nds-has-value" required="">
    <button class="nds-input__icon nds-input__icon_right nds-button nds-button_icon">
      <svg class="nds-button__icon nds-icon-text-light" aria-hidden="true">
        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#clear"></use>
      </svg>
      <span class="nds-assistive-text">Clear</span>
    </button>
    <label class="nds-form-element__label" for="text-input-id-1">Input Label</label>
  </div>
</div>`);
  })
  .add('Double Icon Spinner (examples)', () => {
    return withExample(`<div class="nds-form-element">
  <div class="nds-form-element__control nds-form-element__control-animated-label nds-input-has-icon nds-input-has-icon_left-right">
    <svg class="nds-icon nds-input__icon nds-input__icon_left nds-icon-text-default" aria-hidden="true">
      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#search"></use>
    </svg>
    <input type="text" id="text-input-id-1" class="nds-input nds-has-value" required="">
    <div class="nds-input__icon-group nds-input__icon-group_right">
      <div role="status" class="nds-spinner nds-spinner_brand nds-spinner_x-small nds-input__spinner">
        <span class="nds-assistive-text">Loading</span>
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
          <circle cy="50">
            <animateTransform attributeName="transform" dur="1s" type="translate" values="0 15 ; 0 -15; 0 15" repeatCount="indefinite" begin="0.1"></animateTransform>
          </circle>
          <circle cy="50">
            <animateTransform attributeName="transform" dur="1s" type="translate" values="0 10 ; 0 -10; 0 10" repeatCount="indefinite" begin="0.2"></animateTransform>
          </circle>
          <circle cy="50">
            <animateTransform attributeName="transform" dur="1s" type="translate" values="0 5 ; 0 -5; 0 5" repeatCount="indefinite" begin="0.3"></animateTransform>
          </circle>
        </svg>
      </div>
      <button class="nds-input__icon nds-input__icon_right nds-button nds-button_icon">
        <svg class="nds-button__icon nds-icon-text-light" aria-hidden="true">
          <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#clear"></use>
        </svg>
        <span class="nds-assistive-text">Clear</span>
      </button>
    </div>
    <label class="nds-form-element__label" for="text-input-id-1">Input Label</label>
  </div>
</div>`);
  })
  .add('Fixed Text (examples)', () => {
    return withExample(`<div class="nds-form-element">
  <div class="nds-form-element__control nds-form-element__control-animated-label nds-input-has-fixed-addon">
    <span class="nds-form-element__addon">$</span>
    <input type="text" id="text-input-id-1" class="nds-input nds-has-value" required="">
    <span class="nds-form-element__addon">euro</span>
    <label class="nds-form-element__label" for="text-input-id-1">Input Label</label>
  </div>
</div>`);
  })
  .add('Field Level Help (examples)', () => {
    return withExample(`<div class="demo-only" style="padding-top: 5rem;">
  <div class="nds-form-element">
    <div class="nds-form-element__control nds-form-element__control-animated-label">
      <input type="text" class="nds-input" id="form-help" placeholder="Field Level Help">
      <div class="nds-form-element__label nds-align-middle" for="form-help">
        <label>Text Label</label>
        <div class="nds-form-element__icon">
          <button aria-describedby="help" class="nds-button nds-button_icon">
            <svg class="nds-icon nds-icon_x-small nds-icon-text-default" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#info"></use>
            </svg>
            <span class="nds-assistive-text">Help</span>
          </button>
          <div class="nds-popover nds-popover_tooltip nds-nubbin_bottom-left" id="help" role="tooltip" style="position: absolute; top: -41px; left: 1px; margin-left: -1rem; width: 20rem;">
            <div class="nds-popover__body nds-text-longform">
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci facere eligendi reiciendis obcaecati.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>`);
  });
