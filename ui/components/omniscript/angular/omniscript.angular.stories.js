/* eslint-env browser */
import { storiesOf } from '@storybook/html';
import { withKnobs, number } from '@storybook/addon-knobs';
import base from 'paths.macro';
import notes from './doc.md';
import scss from '../base/_index.scss';
import {
  withExample,
  withDocs,
  commentToHTML
} from '../../../../scripts/storybook';

const label = 'Element Widths';
const defaultValue = 12;
const options = {
  range: true,
  min: 0,
  max: 12,
  step: 1
};
const groupId = 'GROUP-ID1';

storiesOf(`${base}`, module)
.addDecorator(withKnobs)
.addDecorator(withDocs(notes))
.addDecorator(commentToHTML(scss))
.add('Angular Omniscript', () => {
  requestAnimationFrame(() => {
    const bpView = document.getElementById(`VlocityBPView`);
    bpView.addEventListener('change', event => {
      if (event.target.value) {
        event.target.classList.add('nds-has-value');
      } else {
        event.target.classList.remove('nds-has-value');
      }
    });
  });
  const width = number(label, defaultValue, options, groupId);
  return withExample(`<div class="vlocity via-slds via-omni via-nds"
  id="VlocityBP">
  <ng-view autoscroll="true"
  id="VlocityBPView">


  <div class="nds-cont-wrapper ">

  <div class="nds-col nds-clearfix ">
  <div vlc-slds-step-chart=""
  map="StepChart">
  <section class="nds-page-header nds-m-top_x-small ">

  <div class="nds-size_1-of-1">

  <div class="nds-omniscript_stepform nds-size_1-of-1 nds-small-size_1-of-1 nds-medium-size_8-of-12 nds-large-size_6-of-12 nds-align_absolute-center nds-grid">

  <div class="nds-size_1-of-1">
  <div class="nds-progress nds-size_1-of-1">
  <ol class="nds-progress__list">
  <li class="nds-progress__item nds-is-relative nds-progress__visited completed nds-is-completed"
  state="false"
  vlc-slds-step-styler=""
  role="button"
  tabindex="0">
  <button class="nds-button nds-progress__marker ">
  <svg aria-hidden="true"
  class="slds-icon slds-icon--small nds-icon nds-icon_small nds-button__icon"
  xmlns="http://www.w3.org/2000/svg"
  preserveAspectRatio="xMidYMid meet"
  sprite="'utility'"
  icon="'success'"
  size="'small'"
  extra-classes="'nds-button__icon'"
  viewBox="0 0 52 52"
  alt="success">
  <path fill="inherit"
  xmlns="http://www.w3.org/2000/svg"
  d="m26 2c-13.3 0-24 10.7-24 24s10.7 24 24 24 24-10.7 24-24-10.7-24-24-24z m13.4 18l-15.3 15.5c-0.6 0.6-1.6 0.6-2.2 0l-8.4-8.5c-0.6-0.6-0.6-1.6 0-2.2l2.2-2.2c0.6-0.6 1.6-0.6 2.2 0l4.4 4.5c0.4 0.4 1.1 0.4 1.5 0l11.2-11.6c0.6-0.6 1.6-0.6 2.2 0l2.2 2.2c0.7 0.6 0.7 1.6 0 2.3z"></path>
  </svg>
  </button>



  <div class="nds-is-absolute ">
  <div class="nds-popover nds-popover_tooltip nds-nubbin_bottom"
  role="tooltip">
  <div class="nds-popover__body ">This is step one</div>
  </div>
  </div>
  </li>
  <li class="nds-progress__item nds-is-relative active nds-progress__visited nds-is-active"
  state="true"
  vlc-slds-step-styler=""
  role="button"
  tabindex="0">


  <button class="nds-button nds-progress__marker "
  aria-hidden="false">
  </button>
  <div class="nds-is-absolute ">
  <div class="nds-m-top_medium nds-is-relative nds-progress__step-label">
  <div class="">Step Chart Label 1</div>
  </div>
  </div>

  </li>
  <li class="nds-progress__item nds-is-relative "
  state="false"
  vlc-slds-step-styler=""
  role="button"
  tabindex="0">


  <button class="nds-button nds-progress__marker "
  aria-hidden="false">
  </button>

  <div class="nds-is-absolute ">
  <div class="nds-popover nds-popover_tooltip nds-nubbin_bottom"
  role="tooltip">
  <div class="nds-popover__body ">Step2</div>
  </div>
  </div>
  </li>
  <li class="nds-progress__item nds-is-relative "
  state="false"
  vlc-slds-step-styler=""
  role="button"
  tabindex="0">


  <button class="nds-button nds-progress__marker "
  aria-hidden="false">
  </button>

  <div class="nds-is-absolute ">
  <div class="nds-popover nds-popover_tooltip nds-nubbin_bottom"
  role="tooltip">
  <div class="nds-popover__body ">Step2</div>
  </div>
  </div>
  </li>
  <li class="nds-progress__item nds-is-relative "
  state="false"
  vlc-slds-step-styler=""
  role="button"
  tabindex="0">


  <button class="nds-button nds-progress__marker "
  aria-hidden="false">
  </button>

  <div class="nds-is-absolute ">
  <div class="nds-popover nds-popover_tooltip nds-nubbin_bottom"
  role="tooltip">
  <div class="nds-popover__body ">This is step three</div>
  </div>
  </div>
  </li>
  </ol>
  <div class="nds-progress-bar nds-progress-bar_x-small "
  aria-valuemin="0"
  aria-valuemax="100"
  aria-valuenow="0"
  role="progressbar">
  <span class="nds-progress-bar__value"
  style="width: 95.5px; background: rgb(94, 180, 255);">
  <span class="nds-assistive-text">Progress: 0%</span>
  </span>
  </div>
  </div>
  </div>

  </div>

  </div>

  </section>
  </div>
  <div>
  <bptree class="nds-clearfix">
  <!-- deleted the section element to check the markup -->


  <child>
  <div class="nds-grid vlc-slds-step_container nds-size_1-of-1 "
  vlc-slds-window-scroll="test">

  <section id="Inputs"
  class="step-step nds-size_1-of-1"
  aria-hidden="false">

  <!-- banner template -->

  <!-- article when embedded in omniscript -->

  <div class="nds-size_1-of-1 nds-small-size_1-of-1 nds-medium-size_8-of-12 nds-col_padded nds-align_absolute-center nds-p-top_xx-large">
  <h1 class="nds-step_label "
  prev="false">
  Step One
  </h1>
  </div>

  <form novalidate=""
  role="form"
  stepform=""
  name="a0Z1J00000FGWtHUAX-0"
  id="a0Z1J00000FGWtHUAX-0"
  vlc-slds-disable-auto-complete="testing"
  class="nds-omniscript_stepform nds-size_1-of-1 nds-small-size_1-of-1 nds-medium-size_8-of-12 nds-grid nds-wrap nds-align_absolute-center nds-p-top_xx-large"
  autocomplete="off"
  autocorrect="off"
  autocapitalize="off"
  spellcheck="false"
  style="border: 0px;">

  <!-- child controls in the step new comment-->
  <div class="nds-col_padded nds-size_1-of-1">
  <div class="nds-grid nds-wrap nds-grid_pull-padded">


  <child class="nds-size_1-of-1 nds-max-small-size_1-of-1 nds-small-size_${width}-of-12"
  aria-hidden="false">
  <div class="nds-size_1-of-1 ">

  <ng-form name="loopform"
  class="nds-form-element nds-m-bottom_large nds-p-around_small">

  <div class="nds-form-element__control">
  <label class="nds-checkbox">
  <input id="Checkbox"
  type="checkbox"
  name="loopname"
  vlc-slds-check-val-checker="response"
  aria-invalid="false">

  <span class="nds-checkbox_faux"></span>

  <label class="nds-checkbox__label"
  vlc-bubble-canceller="test">
  <span class="nds-form-element__label nds-form-element__control-help ">Checkbox Label</span>

  <a class="nds-tooltip_container "
  vlc-slds-tool-tip="test"
  nubbin-direction="auto top-left"
  tabindex="0">
  <div class="nds-nonfocused_control nds-inline-help-text ">
  <svg aria-hidden="true"
  class="slds-icon slds-icon--small nds-icon nds-icon_small "
  xmlns="http://www.w3.org/2000/svg"
  preserveAspectRatio="xMidYMid meet"
  sprite="'utility'"
  icon="'info'"
  size="'small'"
  viewBox="0 0 52 52"
  alt="info">
  <path fill="inherit"
  xmlns="http://www.w3.org/2000/svg"
  d="m26 2c-13.3 0-24 10.7-24 24s10.7 24 24 24 24-10.7 24-24-10.7-24-24-24z m0 12.1c1.7 0 3 1.3 3 3s-1.3 3-3 3-3-1.3-3-3 1.3-3 3-3z m5 21c0 0.5-0.4 0.9-1 0.9h-8c-0.5 0-1-0.3-1-0.9v-2c0-0.5 0.4-1.1 1-1.1 0.5 0 1-0.3 1-0.9v-4c0-0.5-0.4-1.1-1-1.1-0.5 0-1-0.3-1-0.9v-2c0-0.5 0.4-1.1 1-1.1h6c0.5 0 1 0.5 1 1.1v8c0 0.5 0.4 0.9 1 0.9 0.5 0 1 0.5 1 1.1v2z"></path>
  </svg>
  </div>
  </a>
  <div class="nds-control-action__container">



  </div>
  </label>
  </label>
  </div>

  <div>
  <div>
  <div class="nds-has-error nds-hide"
  aria-hidden="true">
  <small class="nds-form-element__help "></small>
  </div>


  <div class="nds-has-error nds-grid nds-grid_vertical ">
  <small class="nds-form-element__help nds-m-right_x-small  nds-hide"
  aria-hidden="true">Minimum length of </small>
  <small class="nds-form-element__help nds-m-right_x-small  nds-hide"
  aria-hidden="true">Maximum length of </small>
  <small class="nds-form-element__help  nds-hide"
  aria-hidden="true">This date has been disabled.</small>

  <small class="nds-form-element__help nds-m-right_x-small  nds-hide"
  aria-hidden="true">Minimum Permitted Value: -9007199254740991</small>
  <small class="nds-form-element__help nds-m-right_x-small  nds-hide"
  aria-hidden="true">Maximum Permitted Value: 9007199254740991</small>
  <small class="nds-form-element__help nds-m-right_x-small  nds-hide"
  aria-hidden="true">Required</small>
  <small class="nds-form-element__help nds-m-right_x-small  nds-hide"
  aria-hidden="true"></small>
  </div>
  </div>
  </div>
  </ng-form>
  </div>
  </child>


  <child class="nds-size_1-of-1 nds-max-small-size_1-of-1 nds-small-size_${width}-of-12"
  aria-hidden="false">
  <div class="nds-size_1-of-1 ">


  <ng-form name="loopform"
  class="nds-form-element nds-size_1-of-1 nds-m-bottom_large nds-p-around_small nds-input__tooltip   ">

  <!-- should put an icon in the text field -->
  <div class="nds-form-element__control nds-form-element__control-animated-label nds-input-has-icon nds-input-has-icon_right nds-grid">

  <span class="nds-form-element__addon ">$</span>

  <div class="nds-cont-wrapper">
  <input id="Currency"
  type="tel"
  ui-number-mask="::control.propSetMap.mask"
  ui-currency-setting="::bpTree.oSCurrencySetting"
  ui-negative-number="false"
  ui-hide-group-sep="false"
  min="::control.propSetMap.min"
  max="::control.propSetMap.max"
  name="loopname"
  class="nds-input    "
  vlc-slds-val-check-currency="response"
  vlc-slds-val-checker="response"
  vlc-slds-toggle-help-text=""
  aria-invalid="false">

  <label for="Currency"
  class="nds-form-element__label ">
  Currency

  </label>
  </div>

  <svg aria-hidden="true"
  class="slds-icon slds-icon--small nds-icon nds-icon_small "
  xmlns="http://www.w3.org/2000/svg"
  preserveAspectRatio="xMidYMid meet"
  sprite="'utility'"
  icon="'moneybag'"
  size="'small'"
  viewBox="0 0 52 52"
  alt="moneybag">
  <path fill="inherit"
  xmlns="http://www.w3.org/2000/svg"
  d="m20.5 9.1c0.2 0.6 0.8 0.9 1.4 0.9h8.1c0.6 0 1.2-0.3 1.4-0.9l3.2-5.9c0.2-0.6-0.2-1.2-0.8-1.2h-15.6c-0.6 0-1 0.6-0.7 1.1l3 6z m10.2 5.6h-9.4c-7.9 0-14.3 6.5-14.3 14.5v16c0 2.6 2.1 4.8 4.8 4.8h28.4c2.6 0 4.8-2.2 4.8-4.8v-16c0-8-6.5-14.5-14.3-14.5z m-2.3 27v2.7c0 0.5-0.5 0.8-1 0.8h-3.2c-0.5 0-0.6-0.3-0.6-0.8v-2.6c-2.4-0.5-4.4-1.5-4.9-2-0.6-0.6-0.8-1.1-0.3-1.8l1-1.6c0.2-0.4 0.7-0.6 1.2-0.6 0.3 0 0.6 0.1 0.8 0.2h0.1c1.6 1 3 1.4 4 1.4 1.1 0 2-0.6 2-1.2 0-0.5-0.3-1.3-3.3-2.3-2.7-1-6-2.6-6-6.3 0-2.2 1.4-4.7 5.4-5.5v-2.4c0-0.5 0.2-0.8 0.6-0.8h3.2c0.5 0 1 0.3 1 0.8v2.3c1.6 0.4 3.3 1.2 3.9 1.6 0.3 0.2 0.5 0.6 0.6 1 0.1 0.4-0.1 0.8-0.3 1l-1.4 1.4c-0.3 0.4-0.9 0.7-1.3 0.7-0.2 0-0.5-0.1-0.7-0.2-1.6-0.9-2.9-1.4-3.8-1.4-1.3 0-1.9 0.6-1.9 1 0 0.6 0.3 1.2 3 2.2 3.3 1.1 7 2.9 7 6.7 0.1 2.6-2 4.9-5.1 5.7z"></path>
  </svg>
  <div class="nds-control-action__container">



  </div>

  </div>

  <div class="nds-form-element__control-help  ">Help Text</div>

  <div>
  <div>
  <div class="nds-has-error nds-hide"
  aria-hidden="true">
  <small class="nds-form-element__help "></small>
  </div>


  </div>
  </div>

  </ng-form>
  </div>
  </child>


  <child class="nds-size_1-of-1 nds-max-small-size_1-of-1 nds-small-size_${width}-of-12"
  aria-hidden="false">
  <div class="nds-size_1-of-1 ">


  <ng-form name="loopform"
  class="nds-form-element nds-m-bottom_large nds-p-around_small     ">

  <div class="nds-grid nds-form--multi-input__container">
  <div class="nds-cont-wrapper nds-form-element__control nds-form-element__control-animated-label">

  <input id="Date"
  name="loopname"
  type="text"
  placement="none"
  class="nds-input      "
  data-date-format="MM-dd-yyyy"
  data-max-date=""
  data-min-date=""
  date-type="string"
  model-date-format="yyyy-MM-dd"
  days-of-week-disabled=""
  slds-date-picker=""
  autocomplete="off"
  vlc-slds-val-checker="response"
  aria-invalid="false">

  <label for="Date"
  class="nds-form-element__label ">
  Date

  </label>
  </div>


  <a class="nds-tooltip_container "
  vlc-slds-tool-tip="test"
  tabindex="0">
  <div class="nds-nonfocused_control nds-inline-help-text ">
  <svg aria-hidden="true"
  class="slds-icon slds-icon--small nds-icon nds-icon_small "
  xmlns="http://www.w3.org/2000/svg"
  preserveAspectRatio="xMidYMid meet"
  sprite="'utility'"
  icon="'info'"
  size="'small'"
  viewBox="0 0 52 52"
  alt="info">
  <path fill="inherit"
  xmlns="http://www.w3.org/2000/svg"
  d="m26 2c-13.3 0-24 10.7-24 24s10.7 24 24 24 24-10.7 24-24-10.7-24-24-24z m0 12.1c1.7 0 3 1.3 3 3s-1.3 3-3 3-3-1.3-3-3 1.3-3 3-3z m5 21c0 0.5-0.4 0.9-1 0.9h-8c-0.5 0-1-0.3-1-0.9v-2c0-0.5 0.4-1.1 1-1.1 0.5 0 1-0.3 1-0.9v-4c0-0.5-0.4-1.1-1-1.1-0.5 0-1-0.3-1-0.9v-2c0-0.5 0.4-1.1 1-1.1h6c0.5 0 1 0.5 1 1.1v8c0 0.5 0.4 0.9 1 0.9 0.5 0 1 0.5 1 1.1v2z"></path>
  </svg>
  </div>
  </a>
  <div class="nds-control-action__container">



  </div>
  </div>


  <div>
  <div>
  <div class="nds-has-error nds-hide"
  aria-hidden="true">
  <small class="nds-form-element__help "></small>
  </div>


  </div>
  </div>

  </ng-form>

  </div>
  </child>


  <child class="nds-size_1-of-1 nds-max-small-size_1-of-1 nds-small-size_${width}-of-12"
  aria-hidden="false">
  <div class="nds-size_1-of-1 ">


  <ng-form name="loopform"
  class="nds-form-element nds-m-bottom_large nds-p-around_small nds-input__tooltip     ">

  <div class="nds-grid nds-form--multi-input__container">
  <div class="nds-form-element__control nds-form-element__control-animated-label nds-size_2-of-3 nds-p-right_small">

  <input id="Date/Time"
  name="loopname"
  type="text"
  placement="none"
  class="nds-input      "
  data-date-format="MM-dd-yyyy"
  data-max-date=""
  data-min-date=""
  timezone="-60"
  slds-date-picker=""
  autocomplete="off"
  vlc-slds-val-checker="response"
  vlc-slds-toggle-help-text=""
  aria-invalid="false">

  <label for="Date/Time"
  class="nds-form-element__label ">
  Date/Time

  </label>

  </div>
  <div class="nds-form-element__control nds-form-element__control-animated-label"
  style="width: 100%;">
  <input type="text"
  placement="none"
  class="nds-input     "
  name="timectrl"
  data-time-format="hh:mm a"
  timezone="-60"
  slds-time-picker=""
  data-default-date="today"
  vlc-slds-val-checker="reponse"
  autocomplete="off"
  vlc-slds-toggle-help-text=""
  aria-invalid="false">
  </div>
  <div class="nds-control-action__container">



  </div>
  </div>


  <div class="nds-form-element__control-help  ">Help Text</div>

  <div>
  <div>
  <div class="nds-has-error nds-hide"
  aria-hidden="true">
  <small class="nds-form-element__help "></small>
  </div>


  </div>
  </div>

  </ng-form>

  </div>
  </child>


  <child class="nds-size_1-of-1 nds-max-small-size_1-of-1 nds-small-size_${width}-of-12"
  aria-hidden="false">
  <div class="nds-size_1-of-1 ">

  <ng-form name="loopform"
  class="nds-form-element nds-size_1-of-1 nds-m-bottom_large nds-p-around_small ">

  <div class="nds-form-element__control">

  <!-- safely binds the html content in the editor to the element  -->
  <div class="nds-disclosure">
  <div class="nds-form-element__label nds-m-bottom_x-small ">
  Disclosure

  </div>
  <div class="nds-box">
  <p vlc-bind-html="::control.propSetMap.text">
  <p>This is a disclosure</p>
  </p>
  </div>
  <div class="nds-m-top_x-small">
  <!-- checkbox at the bottom -->
  <label class="nds-checkbox">
  <input id="Disclosure"
  type="checkbox"
  name="loopname"
  vlc-slds-val-checker="response"
  class=" "
  aria-invalid="false">

  <span class="nds-checkbox_faux"></span>
  <span class="nds-form-element__label "></span>

  </label>

  </div>

  </div>

  <!-- generic error block styling needs to be done -->

  <div>
  <div>
  <div class="nds-has-error nds-hide"
  aria-hidden="true">
  <small class="nds-form-element__help "></small>
  </div>


  </div>
  </div>

  </div>

  </ng-form>

  </div>
  </child>


  <child class="nds-size_1-of-1 nds-max-small-size_1-of-1 nds-small-size_${width}-of-12"
  aria-hidden="false">
  <div class="nds-size_1-of-1 ">

  <ng-form name="loopform"
  class="nds-form-element nds-m-bottom_large nds-p-around_small nds-input__tooltip   ">

  <div class="nds-form-element__control nds-form-element__control-animated-label nds-grid">

  <input id="Email"
  type="email"
  class="nds-input form-control    "
  name="loopname"
  vlc-slds-ng-pattern=""
  vlc-slds-val-checker="response"
  vlc-slds-toggle-help-text=""
  aria-invalid="false">

  <label for="Email"
  class="nds-form-element__label ">
  Email

  </label>

  <div class="nds-control-action__container">



  </div>

  </div>

  <div class="nds-form-element__control-help  ">Help Text</div>

  <div>
  <div>
  <div class="nds-has-error nds-hide"
  aria-hidden="true">
  <small class="nds-form-element__help "></small>
  </div>


  </div>
  </div>

  </ng-form>
  </div>
  </child>


  <child class="nds-size_1-of-1 nds-max-small-size_1-of-1 nds-small-size_${width}-of-12"
  aria-hidden="false">
  <div class="nds-size_1-of-1 ">


  <ng-form name="loopform"
  class="nds-form-element nds-m-bottom_large nds-p-around_small">

  <div class="nds-form-element__control nds-grid">

  <div class="nds-file-selector nds-file-custom-selector nds-file-selector_files">

  <div class="nds-file-selector__dropzone">

  <input type="file"
  id="File"
  name="loopname"
  class="nds-input nds-file-selector__input "
  multiple=""
  app-filereader=""
  aria-invalid="false">

  <label for="File"
  class="nds-file-selector__body nds-form-element__control-help">
  <span class="nds-file-selector__button nds-button nds-button_neutral ">File</span>

  <span class="nds-file-icon">
  <svg aria-hidden="true"
  class="nds-button__icon slds-icon slds-icon--large nds-icon nds-icon_large "
  xmlns="http://www.w3.org/2000/svg"
  preserveAspectRatio="xMidYMid meet"
  sprite="'utility'"
  icon="'attach'"
  size="'large'"
  viewBox="0 0 52 52"
  alt="attach">
  <path fill="inherit"
  xmlns="http://www.w3.org/2000/svg"
  d="m17.6 36.7c0.6 0.6 1.5 0.5 2.1 0l10-10c0.7-0.7 1.9-0.8 2.8 0 0.9 0.8 0.8 2.2 0 3l-12.3 12.1c-2.7 2.7-7.2 2.7-9.9 0l-0.1-0.1c-2.7-2.7-2.7-7.2 0-9.9l21.7-21.7c2.7-2.7 7.2-2.7 9.9 0l0.1 0.1c2.7 2.7 2.7 7.2 0 9.9l-0.1 0.1c-0.5 0.5-0.6 1.2-0.2 1.8 0.6 1.1 1.1 2.3 1.4 3.5 0.2 0.8 1.1 1 1.7 0.5 0.8-0.8 1.5-1.6 1.5-1.6 5.1-5.1 5.1-13.4 0-18.5h-0.2c-5.1-5.1-13.4-5.1-18.5 0l-21.7 21.6c-5.1 5.1-5.1 13.4 0 18.5l0.2 0.2c5.1 5.1 13.3 5.1 18.4 0l12.4-12.3c3.2-3.2 3.1-8.4-0.2-11.6-3.2-3.1-8.4-2.9-11.5 0.3l-9.8 9.8c-0.6 0.6-0.6 1.6 0 2.2l2.3 2.1z"></path>
  </svg>
  </span>
  </label>

  <!-- list that populates the uploaded files -->
  <ul class="nds-file-list nds-hide"
  aria-hidden="true">

  </ul>

  </div>

  </div>

  <a class="nds-tooltip_container "
  vlc-slds-tool-tip="test"
  tabindex="0">
  <div class="nds-nonfocused_control nds-inline-help-text ">
  <svg aria-hidden="true"
  class="slds-icon slds-icon--small nds-icon nds-icon_small "
  xmlns="http://www.w3.org/2000/svg"
  preserveAspectRatio="xMidYMid meet"
  sprite="'utility'"
  icon="'info'"
  size="'small'"
  viewBox="0 0 52 52"
  alt="info">
  <path fill="inherit"
  xmlns="http://www.w3.org/2000/svg"
  d="m26 2c-13.3 0-24 10.7-24 24s10.7 24 24 24 24-10.7 24-24-10.7-24-24-24z m0 12.1c1.7 0 3 1.3 3 3s-1.3 3-3 3-3-1.3-3-3 1.3-3 3-3z m5 21c0 0.5-0.4 0.9-1 0.9h-8c-0.5 0-1-0.3-1-0.9v-2c0-0.5 0.4-1.1 1-1.1 0.5 0 1-0.3 1-0.9v-4c0-0.5-0.4-1.1-1-1.1-0.5 0-1-0.3-1-0.9v-2c0-0.5 0.4-1.1 1-1.1h6c0.5 0 1 0.5 1 1.1v8c0 0.5 0.4 0.9 1 0.9 0.5 0 1 0.5 1 1.1v2z"></path>
  </svg>
  </div>
  </a>
  </div>

  <div>
  <div>
  <div class="nds-has-error nds-hide"
  aria-hidden="true">
  <small class="nds-form-element__help "></small>
  </div>


  </div>
  </div>

  </ng-form>

  </div>
  </child>


  <child class="nds-size_1-of-1 nds-max-small-size_1-of-1 nds-small-size_${width}-of-12"
  aria-hidden="false">
  <div class="nds-size_1-of-1 ">


  <ng-form name="loopform"
  class="nds-form-element nds-m-bottom_large nds-p-around_small">

  <div class="nds-form-element__control nds-grid">

  <div class="nds-file-selector nds-file-custom-selector nds-file-selector_files nds-file__image">

  <div class="nds-file-selector__dropzone">

  <input type="file"
  id="Image"
  name="loopname"
  class="nds-file-selector__input "
  vlc-slds-file-select="false"
  app-filereader=""
  accept="image/*"
  aria-invalid="false">

  <label for="Image"
  class="nds-file-selector__body nds-form-element__control-help">
  <span class="nds-file-selector__button nds-button nds-button_neutral ">Image</span>

  <span class="nds-file-icon">
  <svg aria-hidden="true"
  class="nds-button__icon slds-icon slds-icon--large nds-icon nds-icon_large "
  xmlns="http://www.w3.org/2000/svg"
  preserveAspectRatio="xMidYMid meet"
  sprite="'utility'"
  icon="'attach'"
  size="'large'"
  viewBox="0 0 52 52"
  alt="attach">
  <path fill="inherit"
  xmlns="http://www.w3.org/2000/svg"
  d="m17.6 36.7c0.6 0.6 1.5 0.5 2.1 0l10-10c0.7-0.7 1.9-0.8 2.8 0 0.9 0.8 0.8 2.2 0 3l-12.3 12.1c-2.7 2.7-7.2 2.7-9.9 0l-0.1-0.1c-2.7-2.7-2.7-7.2 0-9.9l21.7-21.7c2.7-2.7 7.2-2.7 9.9 0l0.1 0.1c2.7 2.7 2.7 7.2 0 9.9l-0.1 0.1c-0.5 0.5-0.6 1.2-0.2 1.8 0.6 1.1 1.1 2.3 1.4 3.5 0.2 0.8 1.1 1 1.7 0.5 0.8-0.8 1.5-1.6 1.5-1.6 5.1-5.1 5.1-13.4 0-18.5h-0.2c-5.1-5.1-13.4-5.1-18.5 0l-21.7 21.6c-5.1 5.1-5.1 13.4 0 18.5l0.2 0.2c5.1 5.1 13.3 5.1 18.4 0l12.4-12.3c3.2-3.2 3.1-8.4-0.2-11.6-3.2-3.1-8.4-2.9-11.5 0.3l-9.8 9.8c-0.6 0.6-0.6 1.6 0 2.2l2.3 2.1z"></path>
  </svg>
  </span>
  </label>

  <!-- list that populates the uploaded files -->
  <ul class="nds-file-list nds-hide"
  aria-hidden="true">

  </ul>
  </div>

  </div>


  <a class="nds-tooltip_container "
  vlc-slds-tool-tip="test"
  tabindex="0">
  <div class="nds-nonfocused_control nds-inline-help-text ">
  <svg aria-hidden="true"
  class="slds-icon slds-icon--small nds-icon nds-icon_small "
  xmlns="http://www.w3.org/2000/svg"
  preserveAspectRatio="xMidYMid meet"
  sprite="'utility'"
  icon="'info'"
  size="'small'"
  viewBox="0 0 52 52"
  alt="info">
  <path fill="inherit"
  xmlns="http://www.w3.org/2000/svg"
  d="m26 2c-13.3 0-24 10.7-24 24s10.7 24 24 24 24-10.7 24-24-10.7-24-24-24z m0 12.1c1.7 0 3 1.3 3 3s-1.3 3-3 3-3-1.3-3-3 1.3-3 3-3z m5 21c0 0.5-0.4 0.9-1 0.9h-8c-0.5 0-1-0.3-1-0.9v-2c0-0.5 0.4-1.1 1-1.1 0.5 0 1-0.3 1-0.9v-4c0-0.5-0.4-1.1-1-1.1-0.5 0-1-0.3-1-0.9v-2c0-0.5 0.4-1.1 1-1.1h6c0.5 0 1 0.5 1 1.1v8c0 0.5 0.4 0.9 1 0.9 0.5 0 1 0.5 1 1.1v2z"></path>
  </svg>
  </div>
  </a>
  </div>

  <div>
  <div>
  <div class="nds-has-error nds-hide"
  aria-hidden="true">
  <small class="nds-form-element__help "></small>
  </div>


  </div>
  </div>

  </ng-form>

  </div>
  </child>


  <child class="nds-size_1-of-1 nds-max-small-size_1-of-1 nds-small-size_${width}-of-12"
  aria-hidden="false">
  <div class="nds-size_1-of-1 ">

  <ng-form name="loopform"
  class="nds-form-element nds-m-bottom_large nds-p-around_small  "
  autocomplete="off">

  <div class="nds-form-element__control nds-lookup nds-input-has-icon nds-grid nds-form-element__control-animated-label">

  <div class="nds-grid nds-cont-wrapper">
  <svg aria-hidden="true"
  class="nds-button__icon nds-m-right_xx-small slds-icon slds-icon--small nds-icon nds-icon_small "
  xmlns="http://www.w3.org/2000/svg"
  preserveAspectRatio="xMidYMid meet"
  sprite="'utility'"
  icon="'search'"
  size="'small'"
  viewBox="0 0 52 52"
  alt="search">
  <title></title>
  <desc></desc>
  <path d="m49.6 45.3l-13.4-13.3c2.7-3.8 4.1-8.6 3.4-13.7-1.2-8.6-8.2-15.4-16.9-16.2-11.8-1.2-21.8 8.8-20.6 20.7 0.8 8.6 7.6 15.7 16.2 16.9 5.1 0.7 9.9-0.7 13.7-3.4l13.3 13.3c0.6 0.6 1.5 0.6 2.1 0l2.1-2.1c0.6-0.6 0.6-1.6 0.1-2.2z m-41.6-24.4c0-7.1 5.8-12.9 12.9-12.9 7.1 0 12.9 5.8 12.9 12.9 0 7.1-5.8 12.9-12.9 12.9-7.1 0-12.9-5.7-12.9-12.9z"
  fill="inherit"
  xmlns="http://www.w3.org/2000/svg"></path>
  </svg>

  <input id="Lookup"
  name="loopname"
  type="text"
  class="nds-input   "
  vlc-slds-lookup-control="test"
  vlc-disable-auto-complete="off"
  autocomplete="off"
  readonly="readonly"
  aria-invalid="false">

  <label for="Lookup"
  class="nds-form-element__label nds-p-left_large ">
  Lookup

  </label>

  <!-- list of matched items -->
  <ul class="nds-list_vertical nds-dropdown-list nds-hide"
  role="button"
  tabindex="0"
  aria-hidden="true">

  <!-- clear option-->
  <li class="nds-list__item"
  role="button"
  tabindex="0">
  --
  </li>



  </ul>
  </div>

  <a class="nds-tooltip_container "
  vlc-slds-tool-tip="test"
  tabindex="0">
  <div class="nds-nonfocused_control nds-inline-help-text ">
  <svg aria-hidden="true"
  class="slds-icon slds-icon--small nds-icon nds-icon_small "
  xmlns="http://www.w3.org/2000/svg"
  preserveAspectRatio="xMidYMid meet"
  sprite="'utility'"
  icon="'info'"
  size="'small'"
  viewBox="0 0 52 52"
  alt="info">
  <path fill="inherit"
  xmlns="http://www.w3.org/2000/svg"
  d="m26 2c-13.3 0-24 10.7-24 24s10.7 24 24 24 24-10.7 24-24-10.7-24-24-24z m0 12.1c1.7 0 3 1.3 3 3s-1.3 3-3 3-3-1.3-3-3 1.3-3 3-3z m5 21c0 0.5-0.4 0.9-1 0.9h-8c-0.5 0-1-0.3-1-0.9v-2c0-0.5 0.4-1.1 1-1.1 0.5 0 1-0.3 1-0.9v-4c0-0.5-0.4-1.1-1-1.1-0.5 0-1-0.3-1-0.9v-2c0-0.5 0.4-1.1 1-1.1h6c0.5 0 1 0.5 1 1.1v8c0 0.5 0.4 0.9 1 0.9 0.5 0 1 0.5 1 1.1v2z"></path>
  </svg>
  </div>
  </a>
  <div class="nds-control-action__container">



  </div>
  </div>


  <div>
  <div>
  <div class="nds-has-error nds-hide"
  aria-hidden="true">
  <small class="nds-form-element__help "></small>
  </div>


  </div>
  </div>
  </ng-form>
  </div>
  </child>


  <child class="nds-size_1-of-1 nds-max-small-size_1-of-1 nds-small-size_${width}-of-12"
  aria-hidden="false">
  <div class="nds-size_1-of-1 ">

  <ng-form name="loopform"
  class="nds-form-element nds-m-bottom_large nds-p-around_small "
  id="Multi-select-vertical-manual|0"
  aria-required="false">

  <div class="nds-form-element">
  <div class="nds-form-element__legend nds-form-element__label"
  for="Multi-select-vertical-manual|0">
  <span>Multi-select Vertical Manual</span>


  <a class="nds-tooltip_container "
  vlc-slds-tool-tip="test"
  nubbin-direction="auto top-left"
  tabindex="0">
  <div class="nds-nonfocused_control nds-inline-help-text ">
  <svg aria-hidden="true"
  class="slds-icon slds-icon--small nds-icon nds-icon_small "
  xmlns="http://www.w3.org/2000/svg"
  preserveAspectRatio="xMidYMid meet"
  sprite="'utility'"
  icon="'info'"
  size="'small'"
  viewBox="0 0 52 52"
  alt="info">
  <path fill="inherit"
  xmlns="http://www.w3.org/2000/svg"
  d="m26 2c-13.3 0-24 10.7-24 24s10.7 24 24 24 24-10.7 24-24-10.7-24-24-24z m0 12.1c1.7 0 3 1.3 3 3s-1.3 3-3 3-3-1.3-3-3 1.3-3 3-3z m5 21c0 0.5-0.4 0.9-1 0.9h-8c-0.5 0-1-0.3-1-0.9v-2c0-0.5 0.4-1.1 1-1.1 0.5 0 1-0.3 1-0.9v-4c0-0.5-0.4-1.1-1-1.1-0.5 0-1-0.3-1-0.9v-2c0-0.5 0.4-1.1 1-1.1h6c0.5 0 1 0.5 1 1.1v8c0 0.5 0.4 0.9 1 0.9 0.5 0 1 0.5 1 1.1v2z"></path>
  </svg>
  </div>
  </a>
  <div class="nds-control-action__container">



  </div>
  </div>


  <div class="nds-form-element__control  nds-vertical_checkbox">
  <label class="nds-checkbox ">
  <input id="Multi-select-vertical-manual"
  type="checkbox"
  vlc-slds-mu-val-checker="response"
  aria-invalid="false">

  <span class="nds-checkbox__label"
  for="Multi-select-vertical-manual">
  <span class="nds-checkbox_faux"></span>
  <span class="nds-form-element__label ">One</span>
  </span>
  </label><label class="nds-checkbox ">
  <input id="Multi-select-vertical-manual"
  type="checkbox"
  vlc-slds-mu-val-checker="response"
  aria-invalid="false">

  <span class="nds-checkbox__label"
  for="Multi-select-vertical-manual">
  <span class="nds-checkbox_faux"></span>
  <span class="nds-form-element__label ">Two</span>
  </span>
  </label><label class="nds-checkbox ">
  <input id="Multi-select-vertical-manual"
  type="checkbox"
  vlc-slds-mu-val-checker="response"
  aria-invalid="false">

  <span class="nds-checkbox__label"
  for="Multi-select-vertical-manual">
  <span class="nds-checkbox_faux"></span>
  <span class="nds-form-element__label ">Three</span>
  </span>
  </label>
  </div>




  </div>
  <div class="nds-has-error nds-grid">
  <div aria-hidden="false">
  <small class="nds-form-element__help  nds-hide"
  aria-hidden="true">Required</small>
  </div>
  <div aria-hidden="true"
  class="nds-hide">
  <small class="nds-form-element__help  nds-hide"
  aria-hidden="true"></small>
  </div>
  </div>
  </ng-form>
  </div>
  </child>


  <child class="nds-size_1-of-1 nds-max-small-size_1-of-1 nds-small-size_${width}-of-12"
  aria-hidden="false">
  <div class="nds-size_1-of-1 ">

  <ng-form name="loopform"
  class="nds-form-element nds-m-bottom_large nds-p-around_small "
  id="Multi-select-horizontal-manual|0"
  aria-required="false">

  <div class="nds-form-element">
  <div class="nds-form-element__legend nds-form-element__label"
  for="Multi-select-horizontal-manual|0">
  <span>Multi-select Horizontal Manual</span>


  <a class="nds-tooltip_container "
  vlc-slds-tool-tip="test"
  nubbin-direction="auto top-left"
  tabindex="0">
  <div class="nds-nonfocused_control nds-inline-help-text ">
  <svg aria-hidden="true"
  class="slds-icon slds-icon--small nds-icon nds-icon_small "
  xmlns="http://www.w3.org/2000/svg"
  preserveAspectRatio="xMidYMid meet"
  sprite="'utility'"
  icon="'info'"
  size="'small'"
  viewBox="0 0 52 52"
  alt="info">
  <path fill="inherit"
  xmlns="http://www.w3.org/2000/svg"
  d="m26 2c-13.3 0-24 10.7-24 24s10.7 24 24 24 24-10.7 24-24-10.7-24-24-24z m0 12.1c1.7 0 3 1.3 3 3s-1.3 3-3 3-3-1.3-3-3 1.3-3 3-3z m5 21c0 0.5-0.4 0.9-1 0.9h-8c-0.5 0-1-0.3-1-0.9v-2c0-0.5 0.4-1.1 1-1.1 0.5 0 1-0.3 1-0.9v-4c0-0.5-0.4-1.1-1-1.1-0.5 0-1-0.3-1-0.9v-2c0-0.5 0.4-1.1 1-1.1h6c0.5 0 1 0.5 1 1.1v8c0 0.5 0.4 0.9 1 0.9 0.5 0 1 0.5 1 1.1v2z"></path>
  </svg>
  </div>
  </a>
  <div class="nds-control-action__container">



  </div>
  </div>


  <div class="nds-form-element__control  nds-horizontal_checkbox">
  <label class="nds-checkbox ">
  <input id="Multi-select-horizontal-manual"
  type="checkbox"
  vlc-slds-mu-val-checker="response"
  aria-invalid="false">

  <span class="nds-checkbox__label"
  for="Multi-select-horizontal-manual">
  <span class="nds-checkbox_faux"></span>
  <span class="nds-form-element__label ">One</span>
  </span>
  </label><label class="nds-checkbox ">
  <input id="Multi-select-horizontal-manual"
  type="checkbox"
  vlc-slds-mu-val-checker="response"
  aria-invalid="false">

  <span class="nds-checkbox__label"
  for="Multi-select-horizontal-manual">
  <span class="nds-checkbox_faux"></span>
  <span class="nds-form-element__label ">Two</span>
  </span>
  </label><label class="nds-checkbox ">
  <input id="Multi-select-horizontal-manual"
  type="checkbox"
  vlc-slds-mu-val-checker="response"
  aria-invalid="false">

  <span class="nds-checkbox__label"
  for="Multi-select-horizontal-manual">
  <span class="nds-checkbox_faux"></span>
  <span class="nds-form-element__label ">Three</span>
  </span>
  </label>
  </div>




  </div>
  <div class="nds-has-error nds-grid">
  <div aria-hidden="false">
  <small class="nds-form-element__help  nds-hide"
  aria-hidden="true">Required</small>
  </div>
  <div aria-hidden="true"
  class="nds-hide">
  <small class="nds-form-element__help  nds-hide"
  aria-hidden="true"></small>
  </div>
  </div>
  </ng-form>
  </div>
  </child>


  <child class="nds-size_1-of-1 nds-max-small-size_1-of-1 nds-small-size_${width}-of-12"
  aria-hidden="false">
  <div class="nds-size_1-of-1 ">

  <ng-form name="loopform"
  class="nds-form-element nds-m-bottom_large nds-p-around_small "
  id="Multi-select-image-image|0"
  aria-required="false">

  <div class="nds-form-element">
  <div class="nds-form-element__legend nds-form-element__label"
  for="Multi-select-image-image|0">
  <span>Multi-select Image Image</span>


  <a class="nds-tooltip_container "
  vlc-slds-tool-tip="test"
  nubbin-direction="auto top-left"
  tabindex="0">
  <div class="nds-nonfocused_control nds-inline-help-text ">
  <svg aria-hidden="true"
  class="slds-icon slds-icon--small nds-icon nds-icon_small "
  xmlns="http://www.w3.org/2000/svg"
  preserveAspectRatio="xMidYMid meet"
  sprite="'utility'"
  icon="'info'"
  size="'small'"
  viewBox="0 0 52 52"
  alt="info">
  <path fill="inherit"
  xmlns="http://www.w3.org/2000/svg"
  d="m26 2c-13.3 0-24 10.7-24 24s10.7 24 24 24 24-10.7 24-24-10.7-24-24-24z m0 12.1c1.7 0 3 1.3 3 3s-1.3 3-3 3-3-1.3-3-3 1.3-3 3-3z m5 21c0 0.5-0.4 0.9-1 0.9h-8c-0.5 0-1-0.3-1-0.9v-2c0-0.5 0.4-1.1 1-1.1 0.5 0 1-0.3 1-0.9v-4c0-0.5-0.4-1.1-1-1.1-0.5 0-1-0.3-1-0.9v-2c0-0.5 0.4-1.1 1-1.1h6c0.5 0 1 0.5 1 1.1v8c0 0.5 0.4 0.9 1 0.9 0.5 0 1 0.5 1 1.1v2z"></path>
  </svg>
  </div>
  </a>
  <div class="nds-control-action__container">



  </div>
  </div>




  <div class="nds-form-element__control ">
  <div class="nds-checkbox_custom-group nds-clearfix">
  <label class="nds-button nds-checkbox_button nds-checkbox_aspect-ratio  nds-float_left"
  style="width: calc(33.3333% - 1.25rem); padding-top: 100px; margin-bottom: 1.5rem;">

  <input id="Multi-select-image-image"
  type="checkbox"
  vlc-slds-mu-val-checker="response"
  aria-invalid="false">

  <span class="nds-checkbox_button__label ">
  <img class="imgItem "
  <img src="/assets/images/avatar1.jpg"
  alt="One"
  title="One">

  </span>


  </label><label class="nds-button nds-checkbox_button nds-checkbox_aspect-ratio  nds-float_left"
  style="width: calc(33.3333% - 1.25rem); padding-top: 100px; margin-bottom: 1.5rem;">

  <input id="Multi-select-image-image"
  type="checkbox"
  vlc-slds-mu-val-checker="response"
  aria-invalid="false">

  <span class="nds-checkbox_button__label ">
  <img class="imgItem "
  <img src="/assets/images/avatar1.jpg"
  alt="Two"
  title="Two">

  </span>


  </label><label class="nds-button nds-checkbox_button nds-checkbox_aspect-ratio  nds-float_left"
  style="width: calc(33.3333% - 1.25rem); padding-top: 100px; margin-bottom: 1.5rem;">

  <input id="Multi-select-image-image"
  type="checkbox"
  vlc-slds-mu-val-checker="response"
  aria-invalid="false">

  <span class="nds-checkbox_button__label ">
  <img class="imgItem "
  <img src="/assets/images/avatar1.jpg"
  alt="Three"
  title="Three">

  </span>


  </label>
  </div>
  </div>


  </div>
  <div class="nds-has-error nds-grid">
  <div aria-hidden="false">
  <small class="nds-form-element__help  nds-hide"
  aria-hidden="true">Required</small>
  </div>
  <div aria-hidden="true"
  class="nds-hide">
  <small class="nds-form-element__help  nds-hide"
  aria-hidden="true"></small>
  </div>
  </div>
  </ng-form>
  </div>
  </child>





  <child class="nds-size_1-of-1 nds-max-small-size_1-of-1 nds-small-size_${width}-of-12"
  aria-hidden="false">
  <div class="nds-size_1-of-1 ">


  <ng-form name="loopform"
  class="nds-form-element nds-m-bottom_large nds-p-around_small nds-input__tooltip   ">

  <div class="nds-form-element__control nds-form-element__control-animated-label nds-grid">

  <input id="Number"
  type="tel"
  name="loopname"
  class="nds-input form-control    "
  via-mask="::control.propSetMap.mask"
  vlc-slds-ng-pattern=""
  vlc-slds-num-val-checker="response"
  vlc-slds-only-numeric="response"
  vlc-slds-attr="placeholder"
  vlc-slds-toggle-help-text=""
  aria-invalid="false">

  <label for="Number"
  class="nds-form-element__label ">
  Number

  </label>

  <div class="nds-control-action__container">



  </div>

  </div>

  <div class="nds-form-element__control-help  ">Help Text</div>

  <div>
  <div>
  <div class="nds-has-error nds-hide"
  aria-hidden="true">
  <small class="nds-form-element__help "></small>
  </div>


  </div>
  </div>

  </ng-form>

  </div>
  </child>


  <child class="nds-size_1-of-1 nds-max-small-size_1-of-1 nds-small-size_${width}-of-12"
  aria-hidden="false">
  <div class="nds-size_1-of-1 ">


  <ng-form name="loopform"
  class="nds-form-element nds-size_1-of-1 nds-m-bottom_large nds-p-around_small nds-input__tooltip   ">

  <div class="nds-form-element__control nds-form-element__control-animated-label nds-grid">

  <input id="Password"
  type="password"
  name="loopname"
  class="nds-input form-control    "
  vlc-slds-ng-pattern=""
  vlc-slds-val-checker="response"
  vlc-slds-toggle-help-text=""
  aria-invalid="false">

  <label for="Password"
  class="nds-form-element__label ">
  Password

  </label>

  <div class="nds-control-action__container">



  </div>

  </div>

  <div class="nds-form-element__control-help  ">Help Text</div>

  <div>
  <div>
  <div class="nds-has-error nds-hide"
  aria-hidden="true">
  <small class="nds-form-element__help "></small>
  </div>


  </div>
  </div>

  </ng-form>

  </div>
  </child>


  <child class="nds-size_1-of-1 nds-max-small-size_1-of-1 nds-small-size_${width}-of-12"
  aria-hidden="false">
  <div class="nds-size_1-of-1 ">

  <ng-form name="loopform"
  id="Radio-vertical-manual|0"
  class="nds-form-element nds-p-around_small   nds-m-bottom_large  ">

  <div class="nds-form-element">
  <div class="nds-form-element__legend nds-form-element__label nds-form-element__control-help"
  for="Radio-vertical-manual|0">
  <span>Radio Vertical Manual</span>



  <a class="nds-tooltip_container "
  vlc-slds-tool-tip="test"
  nubbin-direction="auto top-left"
  tabindex="0">
  <div class="nds-nonfocused_control nds-inline-help-text ">
  <svg aria-hidden="true"
  class="slds-icon slds-icon--small nds-icon nds-icon_small "
  xmlns="http://www.w3.org/2000/svg"
  preserveAspectRatio="xMidYMid meet"
  sprite="'utility'"
  icon="'info'"
  size="'small'"
  viewBox="0 0 52 52"
  alt="info">
  <path fill="inherit"
  xmlns="http://www.w3.org/2000/svg"
  d="m26 2c-13.3 0-24 10.7-24 24s10.7 24 24 24 24-10.7 24-24-10.7-24-24-24z m0 12.1c1.7 0 3 1.3 3 3s-1.3 3-3 3-3-1.3-3-3 1.3-3 3-3z m5 21c0 0.5-0.4 0.9-1 0.9h-8c-0.5 0-1-0.3-1-0.9v-2c0-0.5 0.4-1.1 1-1.1 0.5 0 1-0.3 1-0.9v-4c0-0.5-0.4-1.1-1-1.1-0.5 0-1-0.3-1-0.9v-2c0-0.5 0.4-1.1 1-1.1h6c0.5 0 1 0.5 1 1.1v8c0 0.5 0.4 0.9 1 0.9 0.5 0 1 0.5 1 1.1v2z"></path>
  </svg>
  </div>
  </a>
  <div class="nds-control-action__container">



  </div>
  </div>


  <div class="nds-form-element__control nds-vertical_radio ">
  <label class="nds-radio ">
  <input id="Radio-vertical-manual"
  type="radio"
  vlc-slds-val-checker="response"
  class=" "
  name="229"
  value="One"
  aria-invalid="false">
  <div class="nds-radio__label"
  for="Radio-vertical-manual"
  style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">
  <span class="nds-radio_faux"></span>
  <span class="nds-form-element__label ">One</span>
  </div>
  </label><label class="nds-radio ">
  <input id="Radio-vertical-manual"
  type="radio"
  vlc-slds-val-checker="response"
  class=" "
  name="231"
  value="Two"
  aria-invalid="false">
  <div class="nds-radio__label"
  for="Radio-vertical-manual"
  style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">
  <span class="nds-radio_faux"></span>
  <span class="nds-form-element__label ">Two</span>
  </div>
  </label><label class="nds-radio ">
  <input id="Radio-vertical-manual"
  type="radio"
  vlc-slds-val-checker="response"
  class=" "
  name="233"
  value="Three"
  aria-invalid="false">
  <div class="nds-radio__label"
  for="Radio-vertical-manual"
  style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">
  <span class="nds-radio_faux"></span>
  <span class="nds-form-element__label ">Three</span>
  </div>
  </label>
  </div>








  </div>


  <div class="nds-has-error ">
  <div>
  <div class="nds-has-error nds-hide"
  aria-hidden="true">
  <small class="nds-form-element__help "></small>
  </div>


  </div>
  </div>
  </ng-form>

  </div>
  </child>


  <child class="nds-size_1-of-1 nds-max-small-size_1-of-1 nds-small-size_${width}-of-12"
  aria-hidden="false">
  <div class="nds-size_1-of-1 ">

  <ng-form name="loopform"
  id="Radio-horiztonal-manual|0"
  class="nds-form-element nds-p-around_small   nds-m-bottom_large  ">

  <div class="nds-form-element">
  <div class="nds-form-element__legend nds-form-element__label nds-form-element__control-help"
  for="Radio-horiztonal-manual|0">
  <span>Radio Horizontal Manual</span>



  <a class="nds-tooltip_container "
  vlc-slds-tool-tip="test"
  nubbin-direction="auto top-left"
  tabindex="0">
  <div class="nds-nonfocused_control nds-inline-help-text ">
  <svg aria-hidden="true"
  class="slds-icon slds-icon--small nds-icon nds-icon_small "
  xmlns="http://www.w3.org/2000/svg"
  preserveAspectRatio="xMidYMid meet"
  sprite="'utility'"
  icon="'info'"
  size="'small'"
  viewBox="0 0 52 52"
  alt="info">
  <path fill="inherit"
  xmlns="http://www.w3.org/2000/svg"
  d="m26 2c-13.3 0-24 10.7-24 24s10.7 24 24 24 24-10.7 24-24-10.7-24-24-24z m0 12.1c1.7 0 3 1.3 3 3s-1.3 3-3 3-3-1.3-3-3 1.3-3 3-3z m5 21c0 0.5-0.4 0.9-1 0.9h-8c-0.5 0-1-0.3-1-0.9v-2c0-0.5 0.4-1.1 1-1.1 0.5 0 1-0.3 1-0.9v-4c0-0.5-0.4-1.1-1-1.1-0.5 0-1-0.3-1-0.9v-2c0-0.5 0.4-1.1 1-1.1h6c0.5 0 1 0.5 1 1.1v8c0 0.5 0.4 0.9 1 0.9 0.5 0 1 0.5 1 1.1v2z"></path>
  </svg>
  </div>
  </a>
  <div class="nds-control-action__container">



  </div>
  </div>




  <div class="nds-form-element__control nds-horizontal_radio ">
  <label class="nds-radio ">
  <input id="Radio-horiztonal-manual"
  type="radio"
  vlc-slds-val-checker="response"
  class=" "
  name="240"
  value="One"
  aria-invalid="false">

  <div class="nds-radio__label"
  for="Radio-horiztonal-manual">
  <span class="nds-radio_faux"></span>
  <span class="nds-form-element__label ">One</span>
  </div>
  </label><label class="nds-radio ">
  <input id="Radio-horiztonal-manual"
  type="radio"
  vlc-slds-val-checker="response"
  class=" "
  name="242"
  value="Two"
  aria-invalid="false">

  <div class="nds-radio__label"
  for="Radio-horiztonal-manual">
  <span class="nds-radio_faux"></span>
  <span class="nds-form-element__label ">Two</span>
  </div>
  </label><label class="nds-radio ">
  <input id="Radio-horiztonal-manual"
  type="radio"
  vlc-slds-val-checker="response"
  class=" "
  name="244"
  value="Three"
  aria-invalid="false">

  <div class="nds-radio__label"
  for="Radio-horiztonal-manual">
  <span class="nds-radio_faux"></span>
  <span class="nds-form-element__label ">Three</span>
  </div>
  </label>
  </div>






  </div>


  <div class="nds-has-error ">
  <div>
  <div class="nds-has-error nds-hide"
  aria-hidden="true">
  <small class="nds-form-element__help "></small>
  </div>


  </div>
  </div>
  </ng-form>

  </div>
  </child>


  <child class="nds-size_1-of-1 nds-max-small-size_1-of-1 nds-small-size_${width}-of-12"
  aria-hidden="false">
  <div class="nds-size_1-of-1 ">

  <ng-form name="loopform"
  id="Radio-image-image|0"
  class="nds-form-element nds-p-around_small   nds-m-bottom_large  ">

  <div class="nds-form-element">
  <div class="nds-form-element__legend nds-form-element__label nds-form-element__control-help"
  for="Radio-image-image|0">
  <span>Radio Image Image</span>



  <a class="nds-tooltip_container "
  vlc-slds-tool-tip="test"
  nubbin-direction="auto top-left"
  tabindex="0">
  <div class="nds-nonfocused_control nds-inline-help-text ">
  <svg aria-hidden="true"
  class="slds-icon slds-icon--small nds-icon nds-icon_small "
  xmlns="http://www.w3.org/2000/svg"
  preserveAspectRatio="xMidYMid meet"
  sprite="'utility'"
  icon="'info'"
  size="'small'"
  viewBox="0 0 52 52"
  alt="info">
  <path fill="inherit"
  xmlns="http://www.w3.org/2000/svg"
  d="m26 2c-13.3 0-24 10.7-24 24s10.7 24 24 24 24-10.7 24-24-10.7-24-24-24z m0 12.1c1.7 0 3 1.3 3 3s-1.3 3-3 3-3-1.3-3-3 1.3-3 3-3z m5 21c0 0.5-0.4 0.9-1 0.9h-8c-0.5 0-1-0.3-1-0.9v-2c0-0.5 0.4-1.1 1-1.1 0.5 0 1-0.3 1-0.9v-4c0-0.5-0.4-1.1-1-1.1-0.5 0-1-0.3-1-0.9v-2c0-0.5 0.4-1.1 1-1.1h6c0.5 0 1 0.5 1 1.1v8c0 0.5 0.4 0.9 1 0.9 0.5 0 1 0.5 1 1.1v2z"></path>
  </svg>
  </div>
  </a>
  <div class="nds-control-action__container">



  </div>
  </div>








  <div class="nds-form-element__control ">


  <div class="nds-radio_custom-group nds-clearfix ">
  <label class="nds-button nds-radio_button nds-radio_aspect-ratio  nds-float_left"
  style="width: calc(33.3333% - 1.25rem); padding-top: 100px; margin-bottom: 1.5rem;">
  <input id="Radio-image-image"
  type="radio"
  vlc-slds-val-checker="response"
  class=" "
  name="253"
  value="One"
  aria-invalid="false">
  <span class="nds-radio_button__label "
  for="Radio-image-image_0">
  <img class="imgItem "
  <img src="/assets/images/avatar1.jpg"
  alt="One"
  title="One">

  </span>


  </label><label class="nds-button nds-radio_button nds-radio_aspect-ratio  nds-float_left"
  style="width: calc(33.3333% - 1.25rem); padding-top: 100px; margin-bottom: 1.5rem;">
  <input id="Radio-image-image"
  type="radio"
  vlc-slds-val-checker="response"
  class=" "
  name="255"
  value="Two"
  aria-invalid="false">
  <span class="nds-radio_button__label "
  for="Radio-image-image_1">
  <img class="imgItem "
  <img src="/assets/images/avatar1.jpg"
  alt="Two"
  title="Two">

  </span>


  </label><label class="nds-button nds-radio_button nds-radio_aspect-ratio  nds-float_left"
  style="width: calc(33.3333% - 1.25rem); padding-top: 100px; margin-bottom: 1.5rem;">
  <input id="Radio-image-image"
  type="radio"
  vlc-slds-val-checker="response"
  class=" "
  name="257"
  value="Three"
  aria-invalid="false">
  <span class="nds-radio_button__label "
  for="Radio-image-image_2">
  <img class="imgItem "
  <img src="/assets/images/avatar1.jpg"
  alt="Three"
  title="Three">

  </span>


  </label>
  </div>
  </div>


  <div class="nds-form-element__control ">

  </div>
  </div>


  <div class="nds-has-error ">
  <div>
  <div class="nds-has-error nds-hide"
  aria-hidden="true">
  <small class="nds-form-element__help "></small>
  </div>


  </div>
  </div>
  </ng-form>

  </div>
  </child>


  <child class="nds-size_1-of-1 nds-max-small-size_1-of-1 nds-small-size_${width}-of-12"
  aria-hidden="false">
  <div class="nds-size_1-of-1 ">

  <ng-form name="loopform"
  id="Radio-segment-manual|0"
  class="nds-form-element nds-p-around_small   nds-m-bottom_large  ">

  <div class="nds-form-element">
  <div class="nds-form-element__legend nds-form-element__label nds-form-element__control-help"
  for="Radio-segment-manual|0">
  <span>Radio Segment manual</span>



  <a class="nds-tooltip_container "
  vlc-slds-tool-tip="test"
  nubbin-direction="auto top-left"
  tabindex="0">
  <div class="nds-nonfocused_control nds-inline-help-text ">
  <svg aria-hidden="true"
  class="slds-icon slds-icon--small nds-icon nds-icon_small "
  xmlns="http://www.w3.org/2000/svg"
  preserveAspectRatio="xMidYMid meet"
  sprite="'utility'"
  icon="'info'"
  size="'small'"
  viewBox="0 0 52 52"
  alt="info">
  <path fill="inherit"
  xmlns="http://www.w3.org/2000/svg"
  d="m26 2c-13.3 0-24 10.7-24 24s10.7 24 24 24 24-10.7 24-24-10.7-24-24-24z m0 12.1c1.7 0 3 1.3 3 3s-1.3 3-3 3-3-1.3-3-3 1.3-3 3-3z m5 21c0 0.5-0.4 0.9-1 0.9h-8c-0.5 0-1-0.3-1-0.9v-2c0-0.5 0.4-1.1 1-1.1 0.5 0 1-0.3 1-0.9v-4c0-0.5-0.4-1.1-1-1.1-0.5 0-1-0.3-1-0.9v-2c0-0.5 0.4-1.1 1-1.1h6c0.5 0 1 0.5 1 1.1v8c0 0.5 0.4 0.9 1 0.9 0.5 0 1 0.5 1 1.1v2z"></path>
  </svg>
  </div>
  </a>
  <div class="nds-control-action__container">



  </div>
  </div>






  <div class="nds-form-element__control nds-radio_horizontal "
  style="position: relative; height: 2.0625rem;">
  <div class="nds-radio_button-group">
  <label class="nds-button nds-radio_button "
  style="width:33.333333333333336%">
  <input id="Radio-segment-manual"
  type="radio"
  vlc-slds-val-checker="response"
  class=" "
  name="306"
  value="One"
  aria-invalid="false">
  <span class="nds-radio_button__label">
  <span class="nds-radio_faux ">One</span>
  <div class="nds-radio-overlay"></div>
  </span>
  </label><label class="nds-button nds-radio_button "
  style="width:33.333333333333336%">
  <input id="Radio-segment-manual"
  type="radio"
  vlc-slds-val-checker="response"
  class=" "
  name="308"
  value="Two"
  aria-invalid="false">
  <span class="nds-radio_button__label">
  <span class="nds-radio_faux ">Two</span>
  <div class="nds-radio-overlay"></div>
  </span>
  </label><label class="nds-button nds-radio_button "
  style="width:33.333333333333336%">
  <input id="Radio-segment-manual"
  type="radio"
  vlc-slds-val-checker="response"
  class=" "
  name="310"
  value="Three"
  aria-invalid="false">
  <span class="nds-radio_button__label">
  <span class="nds-radio_faux ">Three</span>
  <div class="nds-radio-overlay"></div>
  </span>
  </label>
  </div>
  </div>




  </div>


  <div class="nds-has-error ">
  <div>
  <div class="nds-has-error nds-hide"
  aria-hidden="true">
  <small class="nds-form-element__help "></small>
  </div>


  </div>
  </div>
  </ng-form>

  </div>
  </child>


  <child class="nds-size_1-of-1 nds-max-small-size_1-of-1 nds-small-size_${width}-of-12"
  aria-hidden="false">
  <div class="nds-size--1-of-1 ">

  <ng-form name="loopform"
  class="nds-form-element nds-m-bottom_large nds-p-around_small vlc-slds-range-control  ">

  <div class="nds-form-element__control nds-m-bottom_medium nds-range">

  <label for="Range"
  class="nds-form-element__label nds-is-expanded nds-element_text-font">
  <span class="nds-slider-label">
  <span class="nds-slider-label__label nds-slider-label__span">Range</span>


  <a class="nds-tooltip_container "
  vlc-slds-tool-tip="test"
  nubbin-direction="auto top-left"
  tabindex="0">
  <div class="nds-nonfocused_control nds-inline-help-text ">
  <svg aria-hidden="true"
  class="slds-icon slds-icon--small nds-icon nds-icon_small "
  xmlns="http://www.w3.org/2000/svg"
  preserveAspectRatio="xMidYMid meet"
  sprite="'utility'"
  icon="'info'"
  size="'small'"
  viewBox="0 0 52 52"
  alt="info">
  <path fill="inherit"
  xmlns="http://www.w3.org/2000/svg"
  d="m26 2c-13.3 0-24 10.7-24 24s10.7 24 24 24 24-10.7 24-24-10.7-24-24-24z m0 12.1c1.7 0 3 1.3 3 3s-1.3 3-3 3-3-1.3-3-3 1.3-3 3-3z m5 21c0 0.5-0.4 0.9-1 0.9h-8c-0.5 0-1-0.3-1-0.9v-2c0-0.5 0.4-1.1 1-1.1 0.5 0 1-0.3 1-0.9v-4c0-0.5-0.4-1.1-1-1.1-0.5 0-1-0.3-1-0.9v-2c0-0.5 0.4-1.1 1-1.1h6c0.5 0 1 0.5 1 1.1v8c0 0.5 0.4 0.9 1 0.9 0.5 0 1 0.5 1 1.1v2z"></path>
  </svg>
  </div>
  </a>
  <div class="nds-control-action__container">



  </div>
  </span>
  </label>

  <div class="vlc-control-wrapper">
  <div class="nds-form-element__control">
  <div class="nds-slider">
  <input id="Range"
  type="range"
  name="loopname"
  step="1"
  ng-model="
  control.response"
  mask=""
  aria-valuenow="5"
  vlc-slds-val-checker="response"
  class="nds-slider__range   "
  vlc-newport-range-slider=""
  min="5"
  max="10"
  aria-valuemin="5"
  aria-valuemax="10"
  aria-invalid="false">
  <span class="nds-slider__value "
  aria-hidden="true">5</span>
  </div>

  <div>
  <div>
  <div class="nds-has-error nds-hide"
  aria-hidden="true">
  <small class="nds-form-element__help "></small>
  </div>


  <div class="nds-has-error nds-grid nds-grid_vertical ">
  <small class="nds-form-element__help nds-m-right_x-small  nds-hide"
  aria-hidden="true">Minimum length of </small>
  <small class="nds-form-element__help nds-m-right_x-small  nds-hide"
  aria-hidden="true">Maximum length of </small>
  <small class="nds-form-element__help  nds-hide"
  aria-hidden="true">This date has been disabled.</small>

  <small class="nds-form-element__help nds-m-right_x-small  nds-hide"
  aria-hidden="true">Minimum Permitted Value: -9007199254740991</small>
  <small class="nds-form-element__help nds-m-right_x-small  nds-hide"
  aria-hidden="true">Maximum Permitted Value: 9007199254740991</small>
  <small class="nds-form-element__help nds-m-right_x-small  nds-hide"
  aria-hidden="true">Required</small>
  <small class="nds-form-element__help nds-m-right_x-small  nds-hide"
  aria-hidden="true"></small>
  </div>
  </div>
  </div>
  </div>
  </div>

  </div>
  </ng-form>
  </div>
  </child>


  <child class="nds-size_1-of-1 nds-max-small-size_1-of-1 nds-small-size_${width}-of-12"
  aria-hidden="false">
  <div class="nds-size_1-of-1 ">

  <ng-form name="loopform"
  class="nds-form-element nds-m-bottom_large nds-p-around_small ">
  <div class="nds-grid nds-cont-wrapper nds-select-wrapper">
  <div class="nds-form-element__control nds-select_container nds-form-element__control-animated-label"
  style="height: 2rem;">

  <!-- this select control should not be visible to the user -->
  <select name="loopname"
  id="Select"
  chainup="test"
  class="nds-select  "
  vlc-slds-val-checker="response"
  aria-invalid="false">
  <option value=""
  selected="selected"></option>
  <option label="One"
  value="One">One</option>
  <option label="Two"
  value="Two">Two</option>
  <option label="Three"
  value="Three">Three</option>
  </select>

  <label for="Select"
  class="nds-form-element__label ">
  Select

  </label>
  </div>

  <a class="nds-tooltip_container "
  vlc-slds-tool-tip="test"
  tabindex="0">
  <div class="nds-nonfocused_control nds-inline-help-text ">
  <svg aria-hidden="true"
  class="slds-icon slds-icon--small nds-icon nds-icon_small "
  xmlns="http://www.w3.org/2000/svg"
  preserveAspectRatio="xMidYMid meet"
  sprite="'utility'"
  icon="'info'"
  size="'small'"
  viewBox="0 0 52 52"
  alt="info">
  <path fill="inherit"
  xmlns="http://www.w3.org/2000/svg"
  d="m26 2c-13.3 0-24 10.7-24 24s10.7 24 24 24 24-10.7 24-24-10.7-24-24-24z m0 12.1c1.7 0 3 1.3 3 3s-1.3 3-3 3-3-1.3-3-3 1.3-3 3-3z m5 21c0 0.5-0.4 0.9-1 0.9h-8c-0.5 0-1-0.3-1-0.9v-2c0-0.5 0.4-1.1 1-1.1 0.5 0 1-0.3 1-0.9v-4c0-0.5-0.4-1.1-1-1.1-0.5 0-1-0.3-1-0.9v-2c0-0.5 0.4-1.1 1-1.1h6c0.5 0 1 0.5 1 1.1v8c0 0.5 0.4 0.9 1 0.9 0.5 0 1 0.5 1 1.1v2z"></path>
  </svg>
  </div>
  </a>
  <div class="nds-control-action__container">



  </div>
  </div>


  <div>
  <div>
  <div class="nds-has-error nds-hide"
  aria-hidden="true">
  <small class="nds-form-element__help "></small>
  </div>


  </div>
  </div>
  </ng-form>
  </div>
  </child>


  <child class="nds-size_1-of-1 nds-max-small-size_1-of-1 nds-small-size_${width}-of-12"
  aria-hidden="false">
  <div class="nds-size_1-of-1 ">


  <ng-form name="loopform"
  class="nds-form-element nds-m-bottom_large nds-p-around_small nds-input__tooltip   ">

  <div class="nds-form-element__control nds-form-element__control-animated-label nds-grid">

  <input id="Signature"
  type="text"
  name="loopname"
  class="nds-input form-control    "
  style="font-family: cursive !important;"
  vlc-slds-val-watch="response"
  vlc-slds-val-checker="response"
  vlc-slds-toggle-help-text=""
  aria-invalid="false">

  <label for="Signature"
  class="nds-form-element__label ">
  Signature

  </label>
  <div class="nds-control-action__container">



  </div>

  </div>

  <div class="nds-form-element__control-help  ">Help Text</div>

  <div>
  <div>
  <div class="nds-has-error nds-hide"
  aria-hidden="true">
  <small class="nds-form-element__help "></small>
  </div>


  </div>
  </div>

  </ng-form>

  </div>
  </child>


  <child class="nds-size_1-of-1 nds-max-small-size_1-of-1 nds-small-size_${width}-of-12"
  aria-hidden="false">
  <div class="nds-size_1-of-1 ">


  <ng-form name="loopform"
  class="nds-form-element nds-m-bottom_large nds-p-around_small nds-input__tooltip    ">

  <div class="nds-form-element__control nds-form-element__control-animated-label nds-grid">

  <input id="Telephone"
  type="text"
  name="loopname"
  class="nds-input     "
  vlc-slds-val-checker="telControl"
  ui-mask="(999) 999-9999"
  vlc-slds-ng-pattern=""
  vlc-slds-attr="placeholder"
  vlc-slds-toggle-help-text=""
  placeholder="(___) ___-____"
  aria-invalid="false">

  <label for="Telephone"
  class="nds-form-element__label ">
  Telephone

  </label>

  <div class="nds-control-action__container">



  </div>

  </div>

  <div class="nds-form-element__control-help  ">Help Text</div>

  <div>
  <div>
  <div class="nds-has-error nds-hide"
  aria-hidden="true">
  <small class="nds-form-element__help "></small>
  </div>


  </div>
  </div>

  </ng-form>

  </div>
  </child>


  <child class="nds-size_1-of-1 nds-max-small-size_1-of-1 nds-small-size_${width}-of-12"
  aria-hidden="false">
  <div class="nds-size_1-of-1 ">

  <ng-form name="loopform"
  class="nds-form-element nds-size_1-of-1 nds-m-bottom_large nds-p-around_small nds-input__tooltip   ">

  <div class="nds-form-element__control nds-form-element__control-animated-label nds-grid">
  <input id="Text"
  type="text"
  name="loopname"
  class="nds-input    "
  ui-mask=""
  vlc-slds-ng-pattern=""
  vlc-slds-min-max-len="response"
  vlc-slds-val-checker="response"
  vlc-slds-toggle-help-text=""
  aria-invalid="false">

  <label for="Text"
  class="nds-form-element__label ">
  Text

  </label>
  <div class="nds-control-action__container">



  </div>
  </div>

  <div class="nds-form-element__control-help  ">Help Text</div>

  <div>
  <div>
  <div class="nds-has-error nds-hide"
  aria-hidden="true">
  <small class="nds-form-element__help "></small>
  </div>


  </div>
  </div>
  </ng-form>
  </div>
  </child>


  <child class="nds-size_1-of-1 nds-max-small-size_1-of-1 nds-small-size_${width}-of-12"
  aria-hidden="false">
  <div class="nds-size_1-of-1 ">


  <ng-form name="loopform"
  class="nds-form-element nds-m-bottom_large nds-p-around_small nds-input__tooltip   ">

  <div class="nds-form-element__control nds-form-element__control-animated-label nds-grid">

  <textarea id="TextArea"
  name="loopname"
  class="nds-textarea    "
  vlc-slds-ng-pattern=""
  vlc-slds-val-checker="response"
  vlc-slds-toggle-help-text=""
  aria-invalid="false">            </textarea>

  <label for="TextArea"
  class="nds-form-element__label ">
  TextArea

  </label>

  <div class="nds-control-action__container">



  </div>

  </div>

  <div class="nds-form-element__control-help  ">Help Text</div>

  <div>
  <div>
  <div class="nds-has-error nds-hide"
  aria-hidden="true">
  <small class="nds-form-element__help "></small>
  </div>


  </div>
  </div>

  </ng-form>

  </div>
  </child>


  <child class="nds-size_1-of-1 nds-max-small-size_1-of-1 nds-small-size_${width}-of-12"
  aria-hidden="false">
  <div class="nds-size_1-of-1 ">

  <ng-form name="loopform"
  class="nds-form-element nds-m-bottom_large nds-p-around_small nds-input__tooltip    ">

  <div class="nds-form-element__control nds-form-element__control-animated-label nds-grid">

  <input id="Time"
  placement="none"
  type="text"
  name="loopname"
  class="nds-input nds-time-picker     "
  slds-time-picker=""
  data-time-format="hh:mm a"
  data-max-time=""
  data-min-time=""
  time-type="string"
  model-time-format="HH:mm:ss.sss'Z'"
  vlc-slds-val-checker="response"
  vlc-slds-toggle-help-text=""
  aria-invalid="false">

  <label for="Time"
  class="nds-form-element__label ">
  Time

  </label>

  <div class="nds-control-action__container">



  </div>

  </div>

  <div class="nds-form-element__control-help  ">Help Text</div>

  <div>
  <div>
  <div class="nds-has-error nds-hide"
  aria-hidden="true">
  <small class="nds-form-element__help "></small>
  </div>


  </div>
  </div>

  </ng-form>

  </div>
  </child>


  <child class="nds-size_1-of-1 nds-max-small-size_1-of-1 nds-small-size_${width}-of-12"
  aria-hidden="false">
  <div class="nds-size_1-of-1 ">


  <ng-form name="loopform"
  class="nds-form-element nds-m-bottom_large nds-p-around_small nds-input__tooltip   ">

  <div class="nds-form-element__control nds-form-element__control-animated-label nds-grid">

  <input id="URL"
  type="url"
  name="loopname"
  class="nds-input form-control    "
  vlc-slds-ng-pattern="(ht|f)tps?:\/\/[a-z0-9-\.]+\.[a-z]{2,4}\/?([^\s<>\#%\,\{\}\\|\\\^\[\]]+)?"
  vlc-slds-val-checker="response"
  vlc-slds-toggle-help-text=""
  aria-invalid="false">

  <label for="URL"
  class="nds-form-element__label ">
  URL

  </label>

  <div class="nds-control-action__container">



  </div>

  </div>

  <div class="nds-form-element__control-help  ">Help Text</div>

  <div>
  <div>
  <div class="nds-has-error nds-hide"
  aria-hidden="true">
  <small class="nds-form-element__help "></small>
  </div>


  </div>
  </div>

  </ng-form>
  </div>
  </child>


  <child class="nds-size_1-of-1 nds-max-small-size_1-of-1 nds-small-size_${width}-of-12"
  aria-hidden="false">
  <div class="nds-size_1-of-1 ">


  <ng-form name="loopform"
  class="nds-form-element nds-size_1-of-1 nds-m-bottom_large nds-p-around_small">

  <div class="nds-form-element__control nds-form-element__control-animated-label nds-input-has-icon_right nds-grid">



  <!-- ngIf: control.propSetMap.dataType != 'Number' &&
  control.propSetMap.dataType != 'Date' &&
  control.propSetMap.dataType != 'Currency' &&
  performCalculation(this, control) --><input id="AggregateBoolean"
  type="text"
  name="loopname"
  class="nds-input  "
  ng-if="control.propSetMap.dataType != 'Number' &amp;&amp;
  control.propSetMap.dataType != 'Date' &amp;&amp;
  control.propSetMap.dataType != 'Currency' &amp;&amp;
  performCalculation(this, control)"
  vlc-slds-readonly="test"
  readonly="readonly"
  disabled="disabled"
  cloned="dirty"
  aria-invalid="false">
  <!-- end ngIf: control.propSetMap.dataType != 'Number' &&
  control.propSetMap.dataType != 'Date' &&
  control.propSetMap.dataType != 'Currency' &&
  performCalculation(this, control) -->







  <label for="AggregateBoolean"
  class="nds-form-element__label ">
  Aggregate Boolean

  </label>

  <div class="nds-control-action__container">



  </div>

  </div>


  <div>
  <div>
  <div class="nds-has-error nds-hide"
  aria-hidden="true">
  <small class="nds-form-element__help "></small>
  </div>


  </div>
  </div>

  </ng-form>

  </div>
  </child>


  <child class="nds-size_1-of-1 nds-max-small-size_1-of-1 nds-small-size_${width}-of-12"
  aria-hidden="false">
  <div class="nds-size_1-of-1 ">


  <ng-form name="loopform"
  class="nds-form-element nds-size_1-of-1 nds-m-bottom_large nds-p-around_small  ">

  <div class="nds-form-element__control nds-form-element__control-animated-label nds-input-has-icon_right nds-grid">



  <!-- ngIf: control.propSetMap.dataType != 'Number' &&
  control.propSetMap.dataType != 'Date' &&
  control.propSetMap.dataType != 'Currency' &&
  performCalculation(this, control) -->

  <input id="AggregateCurrency"
  type="text"
  name="loopname"
  class="nds-input    "
  via-mask="::control.propSetMap.mask"
  vlc-slds-readonly="test"
  autocomplete="off"
  readonly="readonly"
  disabled="disabled"
  cloned="dirty"
  aria-invalid="false">





  <label for="AggregateCurrency"
  class="nds-form-element__label  nds-p-left_large">
  Aggregate Currency

  </label>

  <div class="nds-control-action__container">



  </div>

  </div>


  <div>
  <div>
  <div class="nds-has-error nds-hide"
  aria-hidden="true">
  <small class="nds-form-element__help "></small>
  </div>


  </div>
  </div>

  </ng-form>

  </div>
  </child>


  <child class="nds-size_1-of-1 nds-max-small-size_1-of-1 nds-small-size_${width}-of-12"
  aria-hidden="false">
  <div class="nds-size_1-of-1 ">


  <ng-form name="loopform"
  class="nds-form-element nds-size_1-of-1 nds-m-bottom_large nds-p-around_small">

  <div class="nds-form-element__control nds-form-element__control-animated-label nds-input-has-icon_right nds-grid">



  <!-- ngIf: control.propSetMap.dataType != 'Number' &&
  control.propSetMap.dataType != 'Date' &&
  control.propSetMap.dataType != 'Currency' &&
  performCalculation(this, control) -->



  <input id="AggregateDate"
  type="text"
  class="nds-input "
  name="loopname"
  date-format="MM-dd-yyyy"
  value=""
  vlc-slds-readonly="test"
  vlc-disable-auto-complete="off"
  readonly="readonly"
  disabled="disabled"
  cloned="dirty"
  autocomplete="off">



  <label for="AggregateDate"
  class="nds-form-element__label ">
  Aggregate Date

  </label>

  <div class="nds-control-action__container">



  </div>

  </div>


  <div>
  <div>
  <div class="nds-has-error nds-hide"
  aria-hidden="true">
  <small class="nds-form-element__help "></small>
  </div>


  </div>
  </div>

  </ng-form>

  </div>
  </child>


  <child class="nds-size_1-of-1 nds-max-small-size_1-of-1 nds-small-size_${width}-of-12"
  aria-hidden="false">
  <div class="nds-size_1-of-1 ">


  <ng-form name="loopform"
  class="nds-form-element nds-size_1-of-1 nds-m-bottom_large nds-p-around_small  ">

  <div class="nds-form-element__control nds-form-element__control-animated-label nds-input-has-icon_right nds-grid">



  <!-- ngIf: control.propSetMap.dataType != 'Number' &&
  control.propSetMap.dataType != 'Date' &&
  control.propSetMap.dataType != 'Currency' &&
  performCalculation(this, control) -->





  <input id="AggregateNumber"
  type="text"
  name="loopname"
  class="nds-input    "
  via-mask="::control.propSetMap.mask"
  vlc-slds-readonly="test"
  autocomplete="off"
  readonly="readonly"
  disabled="disabled"
  cloned="dirty"
  aria-invalid="false">

  <label for="AggregateNumber"
  class="nds-form-element__label ">
  Aggregate Number

  </label>

  <div class="nds-control-action__container">



  </div>

  </div>


  <div>
  <div>
  <div class="nds-has-error nds-hide"
  aria-hidden="true">
  <small class="nds-form-element__help "></small>
  </div>


  </div>
  </div>

  </ng-form>

  </div>
  </child>


  <child class="nds-size_1-of-1 nds-max-small-size_1-of-1 nds-small-size_${width}-of-12"
  aria-hidden="false">
  <div class="nds-size_1-of-1 ">


  <ng-form name="loopform"
  class="nds-form-element nds-size_1-of-1 nds-m-bottom_large nds-p-around_small">

  <div class="nds-form-element__control nds-form-element__control-animated-label nds-input-has-icon_right nds-grid">



  <!-- ngIf: control.propSetMap.dataType != 'Number' &&
  control.propSetMap.dataType != 'Date' &&
  control.propSetMap.dataType != 'Currency' &&
  performCalculation(this, control) --><input id="AggregateText"
  type="text"
  name="loopname"
  class="nds-input  "
  ng-if="control.propSetMap.dataType != 'Number' &amp;&amp;
  control.propSetMap.dataType != 'Date' &amp;&amp;
  control.propSetMap.dataType != 'Currency' &amp;&amp;
  performCalculation(this, control)"
  vlc-slds-readonly="test"
  readonly="readonly"
  disabled="disabled"
  cloned="dirty"
  aria-invalid="false">
  <!-- end ngIf: control.propSetMap.dataType != 'Number' &&
  control.propSetMap.dataType != 'Date' &&
  control.propSetMap.dataType != 'Currency' &&
  performCalculation(this, control) -->







  <label for="AggregateText"
  class="nds-form-element__label ">
  Aggregate Text

  </label>

  <div class="nds-control-action__container">



  </div>

  </div>


  <div>
  <div>
  <div class="nds-has-error nds-hide"
  aria-hidden="true">
  <small class="nds-form-element__help "></small>
  </div>


  </div>
  </div>

  </ng-form>

  </div>
  </child>


  <child class="nds-size_1-of-1 nds-max-small-size_1-of-1 nds-small-size_${width}-of-12"
  aria-hidden="false">
  <div class="nds-size_1-of-1 ">


  <ng-form name="loopform"
  class="nds-form-element nds-size_1-of-1 nds-m-bottom_large nds-p-around_small">

  <div class="nds-form-element__control nds-form-element__control-animated-label nds-input-has-icon_right nds-grid">



  <!-- ngIf: control.propSetMap.dataType != 'Number' &&
  control.propSetMap.dataType != 'Date' &&
  control.propSetMap.dataType != 'Currency' &&
  performCalculation(this, control) --><input id="FormulaBoolean"
  type="text"
  name="loopname"
  class="nds-input  "
  ng-if="control.propSetMap.dataType != 'Number' &amp;&amp;
  control.propSetMap.dataType != 'Date' &amp;&amp;
  control.propSetMap.dataType != 'Currency' &amp;&amp;
  performCalculation(this, control)"
  vlc-slds-readonly="test"
  readonly="readonly"
  disabled="disabled"
  cloned="dirty"
  aria-invalid="false">
  <!-- end ngIf: control.propSetMap.dataType != 'Number' &&
  control.propSetMap.dataType != 'Date' &&
  control.propSetMap.dataType != 'Currency' &&
  performCalculation(this, control) -->







  <label for="FormulaBoolean"
  class="nds-form-element__label ">
  Formula Boolean

  </label>

  <div class="nds-control-action__container">



  </div>

  </div>


  <div>
  <div>
  <div class="nds-has-error nds-hide"
  aria-hidden="true">
  <small class="nds-form-element__help "></small>
  </div>


  </div>
  </div>

  </ng-form>

  </div>
  </child>


  <child class="nds-size_1-of-1 nds-max-small-size_1-of-1 nds-small-size_${width}-of-12"
  aria-hidden="false">
  <div class="nds-size_1-of-1 ">


  <ng-form name="loopform"
  class="nds-form-element nds-size_1-of-1 nds-m-bottom_large nds-p-around_small  ">

  <div class="nds-form-element__control nds-form-element__control-animated-label nds-input-has-icon_right nds-grid">



  <!-- ngIf: control.propSetMap.dataType != 'Number' &&
  control.propSetMap.dataType != 'Date' &&
  control.propSetMap.dataType != 'Currency' &&
  performCalculation(this, control) -->

  <input id="FormulaCurrency"
  type="text"
  name="loopname"
  class="nds-input    "
  via-mask="::control.propSetMap.mask"
  vlc-slds-readonly="test"
  autocomplete="off"
  readonly="readonly"
  disabled="disabled"
  cloned="dirty"
  aria-invalid="false">





  <label for="FormulaCurrency"
  class="nds-form-element__label  nds-p-left_large">
  Formula Currency

  </label>

  <div class="nds-control-action__container">



  </div>

  </div>


  <div>
  <div>
  <div class="nds-has-error nds-hide"
  aria-hidden="true">
  <small class="nds-form-element__help "></small>
  </div>


  </div>
  </div>

  </ng-form>

  </div>
  </child>


  <child class="nds-size_1-of-1 nds-max-small-size_1-of-1 nds-small-size_${width}-of-12"
  aria-hidden="false">
  <div class="nds-size_1-of-1 ">


  <ng-form name="loopform"
  class="nds-form-element nds-size_1-of-1 nds-m-bottom_large nds-p-around_small">

  <div class="nds-form-element__control nds-form-element__control-animated-label nds-input-has-icon_right nds-grid">



  <!-- ngIf: control.propSetMap.dataType != 'Number' &&
  control.propSetMap.dataType != 'Date' &&
  control.propSetMap.dataType != 'Currency' &&
  performCalculation(this, control) -->



  <input id="FormulaDate"
  type="text"
  class="nds-input "
  name="loopname"
  date-format="MM-dd-yyyy"
  value=""
  vlc-slds-readonly="test"
  vlc-disable-auto-complete="off"
  readonly="readonly"
  disabled="disabled"
  cloned="dirty"
  autocomplete="off">



  <label for="FormulaDate"
  class="nds-form-element__label ">
  Formula Date

  </label>

  <div class="nds-control-action__container">



  </div>

  </div>


  <div>
  <div>
  <div class="nds-has-error nds-hide"
  aria-hidden="true">
  <small class="nds-form-element__help "></small>
  </div>


  </div>
  </div>

  </ng-form>

  </div>
  </child>


  <child class="nds-size_1-of-1 nds-max-small-size_1-of-1 nds-small-size_${width}-of-12"
  aria-hidden="false">
  <div class="nds-size_1-of-1 ">


  <ng-form name="loopform"
  class="nds-form-element nds-size_1-of-1 nds-m-bottom_large nds-p-around_small  ">

  <div class="nds-form-element__control nds-form-element__control-animated-label nds-input-has-icon_right nds-grid">



  <!-- ngIf: control.propSetMap.dataType != 'Number' &&
  control.propSetMap.dataType != 'Date' &&
  control.propSetMap.dataType != 'Currency' &&
  performCalculation(this, control) -->





  <input id="FormulaNumber"
  type="text"
  name="loopname"
  class="nds-input    "
  via-mask="::control.propSetMap.mask"
  vlc-slds-readonly="test"
  autocomplete="off"
  readonly="readonly"
  disabled="disabled"
  cloned="dirty"
  aria-invalid="false">

  <label for="FormulaNumber"
  class="nds-form-element__label ">
  Formula Number

  </label>

  <div class="nds-control-action__container">



  </div>

  </div>


  <div>
  <div>
  <div class="nds-has-error nds-hide"
  aria-hidden="true">
  <small class="nds-form-element__help "></small>
  </div>


  </div>
  </div>

  </ng-form>

  </div>
  </child>


  <child class="nds-size_1-of-1 nds-max-small-size_1-of-1 nds-small-size_${width}-of-12"
  aria-hidden="false">
  <div class="nds-size_1-of-1 ">


  <ng-form name="loopform"
  class="nds-form-element nds-size_1-of-1 nds-m-bottom_large nds-p-around_small">

  <div class="nds-form-element__control nds-form-element__control-animated-label nds-input-has-icon_right nds-grid">



  <!-- ngIf: control.propSetMap.dataType != 'Number' &&
  control.propSetMap.dataType != 'Date' &&
  control.propSetMap.dataType != 'Currency' &&
  performCalculation(this, control) --><input id="FormulaText"
  type="text"
  name="loopname"
  class="nds-input  "
  ng-if="control.propSetMap.dataType != 'Number' &amp;&amp;
  control.propSetMap.dataType != 'Date' &amp;&amp;
  control.propSetMap.dataType != 'Currency' &amp;&amp;
  performCalculation(this, control)"
  vlc-slds-readonly="test"
  readonly="readonly"
  disabled="disabled"
  cloned="dirty"
  aria-invalid="false">
  <!-- end ngIf: control.propSetMap.dataType != 'Number' &&
  control.propSetMap.dataType != 'Date' &&
  control.propSetMap.dataType != 'Currency' &&
  performCalculation(this, control) -->







  <label for="FormulaText"
  class="nds-form-element__label ">
  Formula Text

  </label>

  <div class="nds-control-action__container">



  </div>

  </div>


  <div>
  <div>
  <div class="nds-has-error nds-hide"
  aria-hidden="true">
  <small class="nds-form-element__help "></small>
  </div>


  </div>
  </div>

  </ng-form>

  </div>
  </child>


  <child class="nds-size_1-of-1 nds-max-small-size_1-of-1 nds-small-size_-of-12"
  aria-hidden="false">
  <div class="nds-col--padded nds-size--1-of-1 ">

  <ng-form name="loopform"
  class="nds-form-element vlc-flex nds-m-bottom_large nds-geolocation">

  <div class="nds-form-element__control">

  <!-- add block label -->
  <label class="nds-form-element__label nds-clearfix "
  role="button"
  tabindex="0">

  <svg aria-hidden="true"
  class="slds-icon slds-icon--small nds-icon nds-icon_small nds-button__icon nds-button__icon_large"
  xmlns="http://www.w3.org/2000/svg"
  preserveAspectRatio="xMidYMid meet"
  sprite="'utility'"
  icon="'location'"
  size="'small'"
  extra-classes="'nds-button__icon nds-button__icon_large'"
  viewBox="0 0 52 52"
  alt="location">
  <path fill="inherit"
  xmlns="http://www.w3.org/2000/svg"
  d="m48.8 9.5l-14.4-7.2c-0.7-0.3-1.5-0.3-2.1 0l-13.3 6.7-13.4-6.7c-0.8-0.4-1.8-0.4-2.5 0.1-0.7 0.4-1.1 1.2-1.1 2v36c0 0.9 0.5 1.7 1.3 2.1l14.4 7.2c0.7 0.3 1.5 0.3 2.1 0l13.4-6.7 13.3 6.7c0.3 0.2 0.7 0.3 1.1 0.3 0.4 0 0.9-0.1 1.3-0.4 0.7-0.4 1.1-1.2 1.1-2v-36c0-0.9-0.4-1.7-1.2-2.1z m-3.8 4.6v19c0 1.1-1 1.9-2 1.5-3.7-1.4-0.7-7.6-3.4-11-2.5-3.1-5.7 0.1-8.8-4.8-2.9-4.7 1-8.1 4.6-9.9 0.5-0.2 1-0.2 1.4 0l7.4 3.7c0.6 0.3 0.8 0.9 0.8 1.5z m-20.1 27.8c-0.6 0.3-1.3 0.2-1.8-0.2-1-0.9-1.8-2.3-1.8-3.7 0-2.4-4-1.6-4-6.4 0-3.9-4.6-4.9-8.5-4.5-1 0.1-1.7-0.6-1.7-1.6v-14.6c0-1.2 1.2-2 2.2-1.4l8.6 4.3c0.1 0 0.2 0.1 0.2 0.1l0.3 0.2c3.6 2.1 2.9 3.8 1.4 6.4-1.7 2.9-2.4 0-4.8-0.8s-4.8 0.8-4 2.4 3.2 0 4.8 1.6 1.6 4 6.4 2.4 5.6-0.8 7.2 0.8c1.6 1.6 2.4 4.8 0 7.2-1.4 1.4-2 4.4-2.6 6.4-0.1 0.4-0.4 0.8-0.8 1l-1.1 0.4z"></path>
  </svg>

  <span>Geolocation</span>

  </label>

  <div class="nds-col">

  <!-- css for the leaflet plugin are included in the main scss file -->


  </div>

  </div>

  </ng-form>

  </div>
  </child>


  <child class="nds-size_1-of-1 nds-max-small-size_1-of-1 nds-small-size_${width}-of-12"
  aria-hidden="false">
  <div class="nds-size_1-of-1 ">


  <ng-form name="loopform"
  class="nds-form-element nds-size_1-of-1 nds-m-bottom_large nds-p-around_small ">

  <div class="nds-form-element__control nds-form-element__control-animated-label nds-grid">



  <div class="message description "
  msg="Success">
  <span class="nds-icon_container nds-icon_container_circle">
  <svg aria-hidden="true"
  class="slds-icon slds-icon--small nds-icon nds-icon_small "
  xmlns="http://www.w3.org/2000/svg"
  preserveAspectRatio="xMidYMid meet"
  sprite="'utility'"
  icon="icon[msg.type]"
  size="'small'"
  viewBox="0 0 52 52"
  alt="check">
  <path fill="inherit"
  xmlns="http://www.w3.org/2000/svg"
  d="m19.1 42.5l-16.5-16.6c-0.6-0.6-0.6-1.6 0-2.2l2.2-2.2c0.6-0.6 1.6-0.6 2.2 0l12.4 12.5c0.4 0.4 1.1 0.4 1.5 0l24.3-24.5c0.6-0.6 1.6-0.6 2.2 0l2.2 2.2c0.6 0.6 0.6 1.6 0 2.2l-28.3 28.6c-0.6 0.7-1.6 0.7-2.2 0z"></path>
  </svg>
  </span>
  <span class="nds-m-left_small ">
  Success
  </span>
  </div>




  <input id="Messaging"
  type="text"
  name="loopname"
  class="nds-input  nds-hide"
  vlc-slds-val-checker="response"
  readonly=""
  aria-hidden="true"
  aria-invalid="false">



  </div>

  </ng-form>

  </div>
  </child>


  <child class="nds-size_1-of-1 nds-max-small-size_1-of-1 nds-small-size_${width}-of-12"
  aria-hidden="false">
  <div class="nds-size_1-of-1 ">

  <ng-form name="loopform"
  class="nds-form-element nds-clearfix nds-block nds-p-around_small      "
  id="Block">

  <div class="nds-form-element__control nds-block_container">
  <!-- add block label -->
  <label vlc-slds-toggle="toggle"
  class="nds-form-element__label nds-clearfix  clicked"
  role="button"
  tabindex="0">

  <svg aria-hidden="true"
  class="slds-icon slds-icon--small nds-icon nds-icon_small nds-collapse nds-button__icon nds-button__icon_large"
  xmlns="http://www.w3.org/2000/svg"
  preserveAspectRatio="xMidYMid meet"
  sprite="'utility'"
  icon="'chevrondown'"
  size="'small'"
  extra-classes="'nds-collapse nds-button__icon nds-button__icon_large'"
  viewBox="0 0 52 52"
  alt="chevrondown">
  <path fill="inherit"
  xmlns="http://www.w3.org/2000/svg"
  d="m47.6 17.8l-20.5 20.7c-0.6 0.6-1.6 0.6-2.2 0l-20.5-20.7c-0.6-0.6-0.6-1.6 0-2.2l2.2-2.2c0.6-0.6 1.6-0.6 2.2 0l16.1 16.3c0.6 0.6 1.6 0.6 2.2 0l16.1-16.2c0.6-0.6 1.6-0.6 2.2 0l2.2 2.2c0.5 0.6 0.5 1.5 0 2.1z"></path>
  </svg>

  <svg aria-hidden="true"
  class="slds-icon slds-icon--small nds-icon nds-icon_small nds-expand nds-button__icon nds-button__icon_large"
  xmlns="http://www.w3.org/2000/svg"
  preserveAspectRatio="xMidYMid meet"
  sprite="'utility'"
  icon="'chevronup'"
  size="'small'"
  extra-classes="'nds-expand nds-button__icon nds-button__icon_large'"
  viewBox="0 0 52 52"
  alt="chevronup">
  <path fill="inherit"
  xmlns="http://www.w3.org/2000/svg"
  d="m4.4 34.2l20.5-20.7c0.6-0.6 1.6-0.6 2.2 0l20.5 20.7c0.6 0.6 0.6 1.6 0 2.2l-2.2 2.2c-0.6 0.6-1.6 0.6-2.2 0l-16.1-16.4c-0.6-0.6-1.6-0.6-2.2 0l-16.1 16.3c-0.6 0.6-1.6 0.6-2.2 0l-2.2-2.2c-0.5-0.6-0.5-1.5 0-2.1z"></path>
  </svg>

  <div class="nds-form-element__label_toggleText ">
  Block

  </div>

  <div class="nds-control-action__container"
  vlc-bubble-canceller="testing">



  </div>
  </label>

  <!-- block withing the main grid  nds-hide hides hthe block by default-->
  <div class="nds-size_1-of-1"
  vlc-slds-toggle-cust-elem="visible"
  aria-hidden="false"
  aria-expanded="true">



  <div class="nds-grid nds-wrap nds-grid_pull-padded">


  <child vlc-slds-change-inline-templates="::child.eleArray[0].propSetMap.showInputWidth"
  class="nds-size_1-of-1 nds-medium-size_12-of-12"
  aria-hidden="false">
  <div class="nds-size_1-of-1 ">

  <ng-form name="loopform"
  class="nds-form-element nds-size_1-of-1 nds-m-bottom_large nds-p-around_small nds-input__tooltip   ">

  <div class="nds-form-element__control nds-form-element__control-animated-label nds-grid">
  <input id="TextInBlock"
  type="text"
  name="loopname"
  class="nds-input    "
  ui-mask=""
  vlc-slds-ng-pattern=""
  vlc-slds-min-max-len="response"
  vlc-slds-val-checker="response"
  vlc-slds-toggle-help-text=""
  aria-invalid="false">

  <label for="TextInBlock"
  class="nds-form-element__label ">
  Text in Block

  </label>
  <div class="nds-control-action__container">



  </div>
  </div>

  <div class="nds-form-element__control-help  ">Help text</div>

  <div>
  <div>
  <div class="nds-has-error nds-hide"
  aria-hidden="true">
  <small class="nds-form-element__help "></small>
  </div>


  </div>
  </div>
  </ng-form>
  </div>
  </child>


  <child vlc-slds-change-inline-templates="::child.eleArray[0].propSetMap.showInputWidth"
  class="nds-size_1-of-1 nds-medium-size_12-of-12"
  aria-hidden="false">
  <div class="nds-size_1-of-1 ">


  <ng-form name="loopform"
  class="nds-form-element nds-m-bottom_large nds-p-around_small nds-input__tooltip   ">

  <div class="nds-form-element__control nds-form-element__control-animated-label nds-grid">

  <input id="NumberInBlock"
  type="tel"
  name="loopname"
  class="nds-input form-control    "
  via-mask="::control.propSetMap.mask"
  vlc-slds-ng-pattern=""
  vlc-slds-num-val-checker="response"
  vlc-slds-only-numeric="response"
  vlc-slds-attr="placeholder"
  vlc-slds-toggle-help-text=""
  aria-invalid="false">

  <label for="NumberInBlock"
  class="nds-form-element__label ">
  Number In Block

  </label>

  <div class="nds-control-action__container">



  </div>

  </div>


  <div>
  <div>
  <div class="nds-has-error nds-hide"
  aria-hidden="true">
  <small class="nds-form-element__help "></small>
  </div>


  </div>
  </div>

  </ng-form>

  </div>
  </child>


  <child vlc-slds-change-inline-templates="::child.eleArray[0].propSetMap.showInputWidth"
  class="nds-size_1-of-1 nds-medium-size_12-of-12"
  aria-hidden="false">
  <div class="nds-size_1-of-1 ">


  <ng-form name="loopform"
  class="nds-form-element nds-m-bottom_large nds-p-around_small nds-input__tooltip    ">

  <div class="nds-form-element__control nds-form-element__control-animated-label nds-grid">

  <input id="TelephoneInBlock"
  type="text"
  name="loopname"
  class="nds-input     "
  vlc-slds-val-checker="telControl"
  ui-mask="(999) 999-9999"
  vlc-slds-ng-pattern=""
  vlc-slds-attr="placeholder"
  vlc-slds-toggle-help-text=""
  placeholder="(___) ___-____"
  aria-invalid="false">

  <label for="TelephoneInBlock"
  class="nds-form-element__label ">
  Telephone In Block

  </label>

  <div class="nds-control-action__container">



  </div>

  </div>

  <div class="nds-form-element__control-help  ">Help Text</div>

  <div>
  <div>
  <div class="nds-has-error nds-hide"
  aria-hidden="true">
  <small class="nds-form-element__help "></small>
  </div>


  </div>
  </div>

  </ng-form>

  </div>
  </child>

  </div>
  </div>

  </div>
  </ng-form>
  </div>
  </child>


  <child class="nds-size_1-of-1 nds-max-small-size_1-of-1 nds-small-size_${width}-of-12"
  aria-hidden="false">
  <!-- vlcEditBlock.html -->
  <div class="nds-col_padded nds-size_1-of-1 nds-element_text-font nds-table_custom  ">

  <div class="nds-size_12-of-12 nds-medium-size_12-of-12 nds-large-size_12-of-12 nds-m-bottom_x-small">
  <div>
  Edit Block
  </div>

  </div>

  <table class="nds-table nds-table_bordered nds-table_cell-buffer nds-border_right nds-max-medium-table_stacked-horizontal ">
  <thead>
  <tr class="nds-text-title_caps">
  <th width="20px"
  style="padding:0px; border-radius: 5px 5px 0 0;"></th>

  <th scope="col"
  aria-hidden="false"
  style="width: 50%;">
  <div class="nds-truncate ">Edit Block Text</div>
  </th>
  <th scope="col"
  aria-hidden="false"
  style="width: 50%;">
  <div class="nds-truncate ">Edit Block Number</div>
  </th>
  <th width="70px"
  style="border-radius: 5px 5px 0 0;"></th>
  </tr>
  </thead>
  <tbody>


  <tr ng-form=""
  name="vlcEditBlockFormMain_0"
  id="EditBlock"
  class="    "
  role="button"
  tabindex="0">
  <td>

  </td>

  <td data-label="Edit Block Text"
  aria-hidden="false">


  <form name="editblockform"
  class="  ">
  <div>


  </div>







  <div class=" ">
  <child class="nds-truncate nds-edit-block_child "
  noformattereb="true"
  style="display:none"
  aria-hidden="false">
  <div class="nds-size_1-of-1 ">

  <ng-form name="loopform"
  class="nds-form-element nds-size_1-of-1 nds-m-bottom_large nds-p-around_small nds-input__tooltip   ">

  <div class="nds-form-element__control nds-form-element__control-animated-label nds-grid">
  <input id="EditBlockText"
  type="text"
  name="loopname"
  class="nds-input    "
  ui-mask=""
  vlc-slds-ng-pattern=""
  vlc-slds-min-max-len="response"
  vlc-slds-val-checker="response"
  vlc-slds-toggle-help-text=""
  aria-invalid="false">

  <label for="EditBlockText"
  class="nds-form-element__label ">
  Edit Block Text

  </label>
  <div class="nds-control-action__container">



  </div>
  </div>


  <div>
  <div>
  <div class="nds-has-error nds-hide"
  aria-hidden="true">
  <small class="nds-form-element__help "></small>
  </div>


  <div class="nds-has-error nds-grid nds-grid_vertical ">
  <small class="nds-form-element__help nds-m-right_x-small  nds-hide"
  aria-hidden="true">Minimum length of 0</small>
  <small class="nds-form-element__help nds-m-right_x-small  nds-hide"
  aria-hidden="true">Maximum length of 255</small>
  <small class="nds-form-element__help  nds-hide"
  aria-hidden="true">This date has been disabled.</small>

  <small class="nds-form-element__help nds-m-right_x-small  nds-hide"
  aria-hidden="true">Minimum Permitted Value: -9007199254740991</small>
  <small class="nds-form-element__help nds-m-right_x-small  nds-hide"
  aria-hidden="true">Maximum Permitted Value: 9007199254740991</small>
  <small class="nds-form-element__help nds-m-right_x-small  nds-hide"
  aria-hidden="true">Required</small>
  <small class="nds-form-element__help nds-m-right_x-small  nds-hide"
  aria-hidden="true"></small>
  </div>
  </div>
  </div>
  </ng-form>
  </div>
  </child>
  <span class=" "
  aria-hidden="false">


  One
  </span>


  </div>
  </form>
  </td>
  <td data-label="Edit Block Number"
  aria-hidden="false">


  <form name="editblockform"
  class="  ">
  <div>


  </div>







  <div class=" ">
  <child class="nds-truncate nds-edit-block_child "
  noformattereb="true"
  style="display:none"
  aria-hidden="false">
  <div class="nds-size_1-of-1 ">


  <ng-form name="loopform"
  class="nds-form-element nds-m-bottom_large nds-p-around_small nds-input__tooltip   ">

  <div class="nds-form-element__control nds-form-element__control-animated-label nds-grid">

  <input id="EditBlockNumber"
  type="tel"
  name="loopname"
  class="nds-input form-control    "
  via-mask="::control.propSetMap.mask"
  vlc-slds-ng-pattern=""
  vlc-slds-num-val-checker="response"
  vlc-slds-only-numeric="response"
  vlc-slds-attr="placeholder"
  vlc-slds-toggle-help-text=""
  aria-invalid="false">

  <label for="EditBlockNumber"
  class="nds-form-element__label ">
  Edit Block Number

  </label>

  <div class="nds-control-action__container">



  </div>

  </div>


  <div>
  <div>
  <div class="nds-has-error nds-hide"
  aria-hidden="true">
  <small class="nds-form-element__help "></small>
  </div>


  <div class="nds-has-error nds-grid nds-grid_vertical ">
  <small class="nds-form-element__help nds-m-right_x-small  nds-hide"
  aria-hidden="true">Minimum length of </small>
  <small class="nds-form-element__help nds-m-right_x-small  nds-hide"
  aria-hidden="true">Maximum length of </small>
  <small class="nds-form-element__help  nds-hide"
  aria-hidden="true">This date has been disabled.</small>

  <small class="nds-form-element__help nds-m-right_x-small  nds-hide"
  aria-hidden="true">Minimum Permitted Value: -9007199254740991</small>
  <small class="nds-form-element__help nds-m-right_x-small  nds-hide"
  aria-hidden="true">Maximum Permitted Value: 9007199254740991</small>
  <small class="nds-form-element__help nds-m-right_x-small  nds-hide"
  aria-hidden="true">Required</small>
  <small class="nds-form-element__help nds-m-right_x-small  nds-hide"
  aria-hidden="true"></small>
  </div>
  </div>
  </div>

  </ng-form>

  </div>
  </child>
  <span class=" "
  aria-hidden="false">


  2
  </span>


  </div>
  </form>
  </td>
  <td data-label="Menu">
  <div class="nds-float_right">
  <div class="nds-dropdown-trigger nds-dropdown-trigger_click  ng-isolate-scope"
  content="[]"
  template-url="vlcEditBlockDropdown.html"
  role="button"
  tabindex="0">
  <button class="nds-button nds-button_icon-border-filled nds-editblock_action-button nds-element_text-font"
  aria-haspopup="true"
  title="Show More">
  <svg aria-hidden="true"
  class="slds-button__icon slds-button__icon--small nds-button__icon nds-button__icon_small "
  xmlns="http://www.w3.org/2000/svg"
  preserveAspectRatio="xMidYMid meet"
  sprite="'utility'"
  icon="'chevrondown'"
  size="'small'"
  role="button"
  tabindex="0"
  viewBox="0 0 52 52"
  alt="chevrondown">
  <path fill="inherit"
  xmlns="http://www.w3.org/2000/svg"
  d="m47.6 17.8l-20.5 20.7c-0.6 0.6-1.6 0.6-2.2 0l-20.5-20.7c-0.6-0.6-0.6-1.6 0-2.2l2.2-2.2c0.6-0.6 1.6-0.6 2.2 0l16.1 16.3c0.6 0.6 1.6 0.6 2.2 0l16.1-16.2c0.6-0.6 1.6-0.6 2.2 0l2.2 2.2c0.5 0.6 0.5 1.5 0 2.1z"></path>
  </svg>
  </button>

  <div class="nds-dropdown nds-dropdown_right">
  <ul class="nds-dropdown__list"
  role="menu">

  <li id="foo"
  class="nds-dropdown__item "
  role="presentation"
  tabindex="0">
  <a href="javascript:void(0);"
  role="menuitem"
  tabindex="-1">
  <span class="nds-truncate ">Edit</span>
  </a>
  </li>

  <li class="nds-has-divider_top-space"
  role="separator"></li>

  <li id="foo"
  class="nds-dropdown__item "
  role="presentation"
  tabindex="0">
  <a href="javascript:void(0);"
  role="menuitem"
  tabindex="-1">
  <span class="nds-truncate ">Delete</span>
  </a>
  </li>
  </ul>
  </div>
  </div>
  </div>
  </td>
  </tr>

  </tbody>
  </table>
  <button class="nds-button nds-float_right nds-m-top_x-small nds-editblock_add-button "
  title="Add">
  <svg aria-hidden="true"
  class="slds-button__icon slds-button__icon--small nds-button__icon nds-button__icon_small "
  xmlns="http://www.w3.org/2000/svg"
  preserveAspectRatio="xMidYMid meet"
  sprite="'utility'"
  size="'small'"
  icon="'add'"
  viewBox="0 0 52 52"
  alt="add">
  <path fill="inherit"
  xmlns="http://www.w3.org/2000/svg"
  d="m30 29h16.5c0.8 0 1.5-0.7 1.5-1.5v-3c0-0.8-0.7-1.5-1.5-1.5h-16.5c-0.6 0-1-0.4-1-1v-16.5c0-0.8-0.7-1.5-1.5-1.5h-3c-0.8 0-1.5 0.7-1.5 1.5v16.5c0 0.6-0.4 1-1 1h-16.5c-0.8 0-1.5 0.7-1.5 1.5v3c0 0.8 0.7 1.5 1.5 1.5h16.5c0.6 0 1 0.4 1 1v16.5c0 0.8 0.7 1.5 1.5 1.5h3c0.8 0 1.5-0.7 1.5-1.5v-16.5c0-0.6 0.4-1 1-1z"></path>
  </svg>
  <span>New</span>
  </button>
  </div>
  </child>


  <child class="nds-size_1-of-1 nds-max-small-size_1-of-1 nds-small-size_-of-12"
  aria-hidden="false">
  <div class="nds-size_1-of-1 ">


  <ng-form name="loopform"
  class="nds-form-element vlc-flex nds-clearfix nds-block nds-p-around_small"
  id="FilterBlock">

  <div class="nds-form-element__control nds-block_container">

  <label vlc-slds-toggle="toggle"
  class="nds-form-element__label nds-clearfix  clicked"
  role="button"
  tabindex="0">

  <svg aria-hidden="true"
  class="slds-icon slds-icon--small nds-icon nds-icon_small nds-collapse nds-button__icon nds-button__icon_large"
  xmlns="http://www.w3.org/2000/svg"
  preserveAspectRatio="xMidYMid meet"
  sprite="'utility'"
  icon="'chevrondown'"
  size="'small'"
  extra-classes="'nds-collapse nds-button__icon nds-button__icon_large'"
  viewBox="0 0 52 52"
  alt="chevrondown">
  <path fill="inherit"
  xmlns="http://www.w3.org/2000/svg"
  d="m47.6 17.8l-20.5 20.7c-0.6 0.6-1.6 0.6-2.2 0l-20.5-20.7c-0.6-0.6-0.6-1.6 0-2.2l2.2-2.2c0.6-0.6 1.6-0.6 2.2 0l16.1 16.3c0.6 0.6 1.6 0.6 2.2 0l16.1-16.2c0.6-0.6 1.6-0.6 2.2 0l2.2 2.2c0.5 0.6 0.5 1.5 0 2.1z"></path>
  </svg>

  <svg aria-hidden="true"
  class="slds-icon slds-icon--small nds-icon nds-icon_small nds-expand nds-button__icon nds-button__icon_large"
  xmlns="http://www.w3.org/2000/svg"
  preserveAspectRatio="xMidYMid meet"
  sprite="'utility'"
  icon="'chevronup'"
  size="'small'"
  extra-classes="'nds-expand nds-button__icon nds-button__icon_large'"
  viewBox="0 0 52 52"
  alt="chevronup">
  <path fill="inherit"
  xmlns="http://www.w3.org/2000/svg"
  d="m4.4 34.2l20.5-20.7c0.6-0.6 1.6-0.6 2.2 0l20.5 20.7c0.6 0.6 0.6 1.6 0 2.2l-2.2 2.2c-0.6 0.6-1.6 0.6-2.2 0l-16.1-16.4c-0.6-0.6-1.6-0.6-2.2 0l-16.1 16.3c-0.6 0.6-1.6 0.6-2.2 0l-2.2-2.2c-0.5-0.6-0.5-1.5 0-2.1z"></path>
  </svg>

  <div class="nds-form-element__label_toggleText ">
  FilterBlock
  </div>

  </label>

  <!-- block withing the main grid  nds-hide hides hthe block by default-->
  <div class="nds-size_1-of-1"
  vlc-slds-toggle-cust-elem="visible"
  aria-hidden="false"
  aria-expanded="true">

  <div class="nds-grid nds-wrap nds-grid_pull-padded">


  <child class="nds-size_1-of-1 nds-medium_1-of-1 nds-large-size_12-of-12 vlc-slds-filter__item "
  aria-hidden="false">
  <div class="nds-col_padded nds-size_1-of-1 ">


  <ng-form name="loopform"
  class="nds-form-element vlc-flex nds-select_filter-control">

  <div class="nds-grid nds-cont-wrapper nds-select-wrapper">
  <div class="nds-form-element__control nds-select_container nds-form-element__control-animated-label"
  style="height: 2rem;">

  <!-- this select control should not be visible to the user -->
  <select name="loopname"
  id="Filter"
  chainup="test"
  class="nds-select  "
  vlc-slds-val-watch="response"
  vlc-slds-val-checker="response"
  aria-invalid="false">
  <option value=""
  selected="selected"></option>
  </select>

  <label for="Filter"
  class="nds-form-element__label ">
  Filter

  </label>
  </div>
  </div>

  </ng-form>

  </div>
  </child>

  </div>

  <ng-form class="nds-size_1-of-1 nds-select_filter-button nds-clearfix  ">
  <button type="button"
  class="nds-button nds-button_brand nds-float_left ">
  Fetch
  </button>
  </ng-form>

  </div>

  </div>

  </ng-form>

  </div>
  </child>


  <child class="nds-size_1-of-1 nds-max-small-size_1-of-1 nds-small-size_-of-12"
  aria-hidden="false">
  <div class="nds-col_padded nds-size_1-of-1 ">

  <ng-form name="loopform"
  class="nds-form-element vlc-flex vlc-slds-input_block"
  id="InputBlock">


  <!-- ngInclude: -->
  <ng-include class="nds-size_1-of-1 nds-clearfix "
  src="::control.propSetMap.HTMLTemplateId">
  <div class="nds-size_1-of-1 nds-element_text-font nds-table_custom ">
  <div class="nds-form-element__label nds-element_text-font nds-m-bottom_x-small">
  <label>Input Block</label>
  </div>
  <table class="nds-table nds-table_bordered nds-table_cell-buffer nds-border_right nds-max-medium-table_stacked-horizontal">
  <thead>
  <tr class="nds-text-title_caps">
  <th scope="col"
  style="border-radius: 5px 5px 0 0;">
  <div class="nds-truncate">field1</div>
  </th>
  <th scope="col">
  <div class="nds-truncate">field2</div>
  </th>
  <th scope="col"
  style="border-radius: 5px 5px 0 0;">
  <div class="nds-truncate">field3</div>
  </th>
  </tr>
  </thead>
  <tbody>

  </tbody>
  </table>
  <button id="save&amp;next"
  class="nds-button nds-float_right nds-m-top_x-small nds-editblock_add-button"
  title="Save &amp; Next">
  Save &amp; Next
  </button>
  </div>
  </ng-include>
  </ng-form>
  </div>
  </child>


  <child class="nds-size_1-of-1 nds-max-small-size_1-of-1 nds-small-size_${width}-of-12"
  aria-hidden="false">
  <div class="nds-size_1-of-1 ">

  <ng-form name="loopform"
  class="nds-form-element nds-grid nds-grid_vertical nds-m-bottom_large nds-p-around_small nds-radio_group "
  id="RadioGroup|0">

  <label for="RadioGroup|0"
  class="nds-form-element__legend nds-form-element__label nds-p-left_none nds-text-heading_small">
  <span>Radio Group</span>


  <a class="nds-tooltip_container "
  vlc-slds-tool-tip="test"
  tabindex="0">
  <div class="nds-nonfocused_control nds-inline-help-text ">
  <svg aria-hidden="true"
  class="slds-icon slds-icon--small nds-icon nds-icon_small "
  xmlns="http://www.w3.org/2000/svg"
  preserveAspectRatio="xMidYMid meet"
  sprite="'utility'"
  icon="'info'"
  size="'small'"
  viewBox="0 0 52 52"
  alt="info">
  <path fill="inherit"
  xmlns="http://www.w3.org/2000/svg"
  d="m26 2c-13.3 0-24 10.7-24 24s10.7 24 24 24 24-10.7 24-24-10.7-24-24-24z m0 12.1c1.7 0 3 1.3 3 3s-1.3 3-3 3-3-1.3-3-3 1.3-3 3-3z m5 21c0 0.5-0.4 0.9-1 0.9h-8c-0.5 0-1-0.3-1-0.9v-2c0-0.5 0.4-1.1 1-1.1 0.5 0 1-0.3 1-0.9v-4c0-0.5-0.4-1.1-1-1.1-0.5 0-1-0.3-1-0.9v-2c0-0.5 0.4-1.1 1-1.1h6c0.5 0 1 0.5 1 1.1v8c0 0.5 0.4 0.9 1 0.9 0.5 0 1 0.5 1 1.1v2z"></path>
  </svg>
  </div>
  </a>
  <div class="nds-control-action__container">



  </div>

  </label>

  <div id="RadioGroup">
  <div class="nds-grid ">
  <div class="nds-col nds-size_6-of-12">
  </div>
  <div class="nds-col nds-size_6-of-12 nds-grid">
  <label class="nds-col set-all "
  style="width:33.333333333333336%">

  </label><label class="nds-col set-all "
  style="width:33.333333333333336%">

  </label><label class="nds-col set-all "
  style="width:33.333333333333336%">

  </label>
  </div>
  </div>

  <div id="Four"
  class="nds-grid nds-form-element__control nds-p-vertical_x-small ">

  <div class="nds-grid nds-col nds-size_6-of-12">
  <label class="nds-radio nds-p-right_x-small">
  <span class="nds-form-element__label ">
  Four
  </span>
  </label>
  </div>
  <div class=" nds-grid nds-col nds-size_6-of-12">
  <label class="nds-radio "
  style="width:33.333333333333336%">

  <input type="radio"
  vlc-slds-mu-val-checker="response"
  class=" "
  name="600"
  value="One"
  aria-invalid="false">

  <span class="nds-radio_faux nds-m-right_none"></span>
  <span class="nds-form-element__label nds-m-right_none nds-hyphenate ">One</span>
  </label><label class="nds-radio "
  style="width:33.333333333333336%">

  <input type="radio"
  vlc-slds-mu-val-checker="response"
  class=" "
  name="602"
  value="Two"
  aria-invalid="false">

  <span class="nds-radio_faux nds-m-right_none"></span>
  <span class="nds-form-element__label nds-m-right_none nds-hyphenate ">Two</span>
  </label><label class="nds-radio "
  style="width:33.333333333333336%">

  <input type="radio"
  vlc-slds-mu-val-checker="response"
  class=" "
  name="604"
  value="Three"
  aria-invalid="false">

  <span class="nds-radio_faux nds-m-right_none"></span>
  <span class="nds-form-element__label nds-m-right_none nds-hyphenate ">Three</span>
  </label>
  </div>
  </div>
  </div>
  <div class="nds-has-error nds-grid">
  <div aria-hidden="true"
  class="nds-hide">
  <small class="nds-form-element__help  nds-hide"
  aria-hidden="true">Required</small>
  </div>
  <div aria-hidden="true"
  class="nds-hide">
  <small class="nds-form-element__help  nds-hide"
  aria-hidden="true"></small>
  </div>
  </div>
  </ng-form>
  </div>
  </child>


  <child class="nds-size_1-of-1 nds-max-small-size_1-of-1 nds-small-size_${width}-of-12"
  aria-hidden="false">
  <div class="nds-size_1-of-1 ">


  <ng-form name="loopform"
  class="nds-form-element nds-size_1-of-1 nds-m-bottom_large nds-p-around_small nds-rich-text-editor__output"
  id="Headline">

  <div class="nds-form-element__control">

  <h1 ng-bind-html="control.propSetMap.value"
  class=" ">
  <p>A Headline Block</p>
  </h1>
  </div>
  </ng-form>

  </div>
  </child>


  <child class="nds-size_1-of-1 nds-max-small-size_1-of-1 nds-small-size_-of-12"
  aria-hidden="false">
  <div class="nds-size_1-of-1 nds-line_break ">


  <ng-form name="loopform"
  class="nds-form-element"
  style="padding-bottom: 0px;">

  <div class="nds-form-element__control"></div>

  </ng-form>

  </div>
  </child>


  <child class="nds-size_1-of-1 nds-max-small-size_1-of-1 nds-small-size_${width}-of-12"
  aria-hidden="false">
  <div class="nds-size_1-of-1 ">

  <ng-form name="loopform"
  class="nds-form-element nds-size_1-of-1 nds-m-bottom_large nds-p-around_small nds-rich-text-editor__output"
  id="TextBlock">

  <div class="nds-form-element__control">
  <p vlc-bind-html="::control.propSetMap.value">
  <p><strong>This is a text block</strong></p>
  </p>
  </div>

  </ng-form>

  </div>
  </child>

  </div>
  </div>

  <div class="nds-col_padded nds-size_1-of-1 nds-m-top_medium nds-m-bottom_xx-large">

  <div class="nds-grid nds-wrap vlc-slds-button_footer nds-form-element__control-help">

  <div class="nds-grid nds-size_1-of-1 nds-p-bottom_small">


  <div class="nds-cursor-pointer  "
  id="vlc-step-cancel-btn"
  confirmed-click="cancel()"
  role="button"
  tabindex="0">
  Cancel
  </div>

  <!-- test -->



  <div class="nds-col_bump-left nds-cursor-pointer  "
  id="vlc-step-save-btn"
  confirmed-click="saveForLater(child)"
  role="button"
  tabindex="0">
  Save for later
  </div>

  </div>


  <div class="nds-size_1-of-1 nds-header__desktop ">

  <div class="nds-wrap">

  <div class="nds-align_absolute-center">
  <button class="nds-button nds-button_brand nds-p-around_xx-small nds-size_1-of-1 nds-medium-size_3-of-12 nds-hide"
  type="button"
  id="Inputs_nextBtn"
  vlc-animation-slider="test"
  aria-hidden="true">
  Next
  </button>
  </div>
  <div class="nds-align_absolute-center nds-p-around_xx-small">

  </div>

  </div>
  </div>



  </div>

  </div>

  </form>
  </section>
  </div>
  </child>

  </bptree>
  </div>
  </div>

  <div class="nds-container">

  <div class="nds-right_panel ">
  <!-- knowledge component will go here -->






  </div>
  </div>
  </div>
  </ng-view>
  <div class="modal-backdrop fade in nds-hide"
  aria-hidden="true"></div>
  </div>`);
});
