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
  <label class="nds-form-element__label" for="text-input-id-1">Input Label</label>
  <div class="nds-form-element__control">
    <input type="text" id="text-input-id-1" class="nds-input" placeholder="Placeholder Text">
  </div>
</div>`);
  })
  .add('Input Required (states)', () => {
    return withExample(`<div class="nds-form-element">
  <label class="nds-form-element__label" for="text-input-id-1">
    <abbr class="nds-required" title="required">*</abbr>
    <!-- react-text: 5 -->
    <!-- /react-text -->
    <!-- react-text: 6 -->Input Label
    <!-- /react-text -->
  </label>
  <div class="nds-form-element__control">
    <input type="text" required="" id="text-input-id-1" class="nds-input" placeholder="Placeholder Text">
  </div>
</div>`);
  })
  .add('Input Disabled (states)', () => {
    return withExample(`<div class="nds-form-element">
  <label class="nds-form-element__label" for="text-input-id-1">Input Label</label>
  <div class="nds-form-element__control">
    <input type="text" disabled="" id="text-input-id-1" class="nds-input" placeholder="Placeholder Text">
  </div>
</div>`);
  })
  .add('Input Error (states)', () => {
    return withExample(`<div class="nds-form-element nds-has-error">
  <label class="nds-form-element__label" for="text-input-id-1">
    <abbr class="nds-required" title="required">*</abbr>
    <!-- react-text: 5 -->
    <!-- /react-text -->
    <!-- react-text: 6 -->Input Label
    <!-- /react-text -->
  </label>
  <div class="nds-form-element__control">
    <input type="text" required="" aria-describedby="error-message" id="text-input-id-1" class="nds-input" placeholder="Placeholder Text">
  </div>
  <div id="error-message" class="nds-form-element__help">This field is required</div>
</div>`);
  })
  .add('Input Error Icon (states)', () => {
    return withExample(`<div class="nds-form-element nds-has-error">
  <label class="nds-form-element__label" for="text-input-id-1">
    <abbr class="nds-required" title="required">*</abbr>
    <!-- react-text: 5 -->
    <!-- /react-text -->
    <!-- react-text: 6 -->Input Label
    <!-- /react-text -->
  </label>
  <div class="nds-form-element__control nds-input-has-icon nds-input-has-icon_left">
    <svg class="nds-input__icon" aria-hidden="true">
      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#warning"></use>
    </svg>
    <input type="text" required="" aria-describedby="error-message" id="text-input-id-1" class="nds-input" placeholder="Placeholder Text">
  </div>
  <div id="error-message" class="nds-form-element__help">This field is required</div>
</div>`);
  })
  .add('Read Only (states)', () => {
    return withExample(`<div class="nds-form-element">
  <label class="nds-form-element__label" for="text-input-id-1">Input Label</label>
  <div class="nds-form-element__control">
    <input type="text" readonly="" placeholder="Placeholder Text" id="text-input-id-1" class="nds-input" value="Read Only">
  </div>
</div>`);
  })
  .add('Static (states)', () => {
    return withExample(`<div class="nds-form-element">
  <span class="nds-form-element__label">Input Label</span>
  <div class="nds-form-element__control">
    <span class="nds-form-element__static">Read Only</span>
  </div>
</div>`);
  })
  .add('Left Icon (examples)', () => {
    return withExample(`<div class="nds-form-element">
  <label class="nds-form-element__label" for="text-input-id-1">Input Label</label>
  <div class="nds-form-element__control nds-input-has-icon nds-input-has-icon_left">
    <svg class="nds-icon nds-input__icon nds-input__icon_left nds-icon-text-default" aria-hidden="true">
      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#search"></use>
    </svg>
    <input type="text" id="text-input-id-1" class="nds-input" placeholder="Placeholder Text">
  </div>
</div>`);
  })
  .add('Right Icon (examples)', () => {
    return withExample(`<div class="nds-form-element">
  <label class="nds-form-element__label" for="text-input-id-1">Input Label</label>
  <div class="nds-form-element__control nds-input-has-icon nds-input-has-icon_right">
    <svg class="nds-icon nds-input__icon nds-input__icon_right nds-icon-text-default" aria-hidden="true">
      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#search"></use>
    </svg>
    <input type="text" id="text-input-id-1" class="nds-input" placeholder="Placeholder Text">
  </div>
</div>`);
  })
  .add('Double Icon (examples)', () => {
    return withExample(`<div class="nds-form-element">
  <label class="nds-form-element__label" for="text-input-id-1">Input Label</label>
  <div class="nds-form-element__control nds-input-has-icon nds-input-has-icon_left-right">
    <svg class="nds-icon nds-input__icon nds-input__icon_left nds-icon-text-default" aria-hidden="true">
      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#search"></use>
    </svg>
    <input type="text" id="text-input-id-1" class="nds-input" placeholder="Placeholder Text">
    <button class="nds-input__icon nds-input__icon_right nds-button nds-button_icon">
      <svg class="nds-button__icon nds-icon-text-light" aria-hidden="true">
        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#clear"></use>
      </svg>
      <span class="nds-assistive-text">Clear</span>
    </button>
  </div>
</div>`);
  })
  .add('Double Icon Spinner (examples)', () => {
    return withExample(`<div class="nds-form-element">
  <label class="nds-form-element__label" for="text-input-id-1">Input Label</label>
  <div class="nds-form-element__control nds-input-has-icon nds-input-has-icon_left-right">
    <svg class="nds-icon nds-input__icon nds-input__icon_left nds-icon-text-default" aria-hidden="true">
      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#search"></use>
    </svg>
    <input type="text" id="text-input-id-1" class="nds-input" placeholder="Placeholder Text">
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
  </div>
</div>`);
  })
  .add('Fixed Text (examples)', () => {
    return withExample(`<div class="nds-form-element">
  <label class="nds-form-element__label" for="text-input-id-1">Input Label</label>
  <div class="nds-form-element__control nds-input-has-fixed-addon">
    <span class="nds-form-element__addon">$</span>
    <input type="text" id="text-input-id-1" class="nds-input" placeholder="Placeholder Text">
    <span class="nds-form-element__addon">euro</span>
  </div>
</div>`);
  })
  .add('Field Level Help (examples)', () => {
    return withExample(`<div class="demo-only" style="padding-top: 5rem;">
  <div class="nds-form-element">
    <label class="nds-form-element__label nds-align-middle" for="form-help">Text Label</label>
    <div class="nds-form-element__icon">
      <button aria-describedby="help" class="nds-button nds-button_icon">
        <svg class="nds-icon nds-icon_x-small nds-icon-text-default" aria-hidden="true">
          <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#info"></use>
        </svg>
        <span class="nds-assistive-text">Help</span>
      </button>
    </div>
    <div class="nds-form-element__control">
      <input type="text" class="nds-input" id="form-help" placeholder="Field Level Help">
    </div>
  </div>
  <div class="nds-popover nds-popover_tooltip nds-nubbin_bottom-left" id="help" role="tooltip" style="position: absolute; top: 15px; left: 72px; margin-left: -1rem; width: 20rem;">
    <div class="nds-popover__body nds-text-longform">
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci facere eligendi reiciendis obcaecati.</p>
    </div>
  </div>
</div>`);
  });
