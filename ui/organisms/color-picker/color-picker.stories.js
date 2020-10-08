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
    return withExample(`<div class="nds-color-picker">
  <div class="nds-color-picker__summary">
    <label class="nds-color-picker__summary-label" for="color-picker-summary-input">Choose Color</label>
    <button class="nds-button nds-color-picker__summary-button nds-button_icon nds-button_icon-more">
      <span class="nds-swatch" style="background: rgb(87, 123, 193) none repeat scroll 0% 0%;">
        <span class="nds-assistive-text">hsl(220, 46%, 55%)</span>
      </span>
      <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
      </svg>
      <span class="nds-assistive-text">Choose a color. Current color: #5679C0</span>
    </button>
    <div class="nds-form-element nds-color-picker__summary-input">
      <div class="nds-form-element__control">
        <input type="text" id="color-picker-summary-input" class="nds-input" placeholder="Placeholder Text" value="#5679C0">
      </div>
    </div>
  </div>
  <section class="nds-popover nds-color-picker__selector nds-hide" role="dialog" aria-label="Choose a color" aria-describedby="dialog-body-id-1">
    <div class="nds-popover__body" id="dialog-body-id-1">
      <div class="nds-tabs_default">
        <ul class="nds-tabs_default__nav" role="tablist">
          <li class="nds-tabs_default__item nds-is-active" title="Default" role="presentation">
            <a class="nds-tabs_default__link" href="javascript:void(0);" role="tab" tabindex="0" aria-selected="true" aria-controls="color-picker-default" id="color-picker-default__item">Default</a>
          </li>
          <li class="nds-tabs_default__item" title="Custom" role="presentation">
            <a class="nds-tabs_default__link" href="javascript:void(0);" role="tab" tabindex="-1" aria-selected="false" aria-controls="color-picker-custom" id="color-picker-custom__item">Custom</a>
          </li>
        </ul>
        <div id="color-picker-default" class="nds-tabs_default__content nds-show" role="tabpanel" aria-labelledby="color-picker-default__item">
          <ul class="nds-color-picker__swatches" role="listbox">
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="0">
                <span class="nds-swatch" style="background: rgb(227, 171, 236) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#e3abec</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(194, 219, 247) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#c2dbf7</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(159, 214, 255) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#9fd6ff</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(157, 231, 218) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#9de7da</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(157, 240, 192) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#9df0c0</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(255, 240, 153) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#fff099</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(254, 212, 154) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#fed49a</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(208, 115, 224) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#d073e0</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(134, 186, 243) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#86baf3</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(94, 187, 255) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#5ebbff</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(68, 216, 190) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#44d8be</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(59, 226, 130) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#3be282</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(255, 230, 84) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#ffe654</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(255, 183, 88) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#ffb758</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(189, 53, 189) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#bd35bd</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(87, 121, 193) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#5779c1</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(94, 187, 255) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#5ebbff</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(0, 174, 169) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#00aea9</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(60, 186, 76) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#3cba4c</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(245, 188, 37) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#f5bc25</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(249, 146, 33) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#f99221</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(88, 13, 140) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#580d8c</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(0, 25, 112) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#001970</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(10, 35, 153) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#0a2399</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(11, 116, 119) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#0b7477</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(11, 107, 80) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#0b6b50</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(182, 126, 17) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#b67e11</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(184, 93, 13) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#b85d0d</span>
                </span>
              </a>
            </li>
          </ul>
        </div>
        <div id="color-picker-custom" class="nds-tabs_default__content nds-hide" role="tabpanel" aria-labelledby="color-picker-custom__item">
          <div class="nds-color-picker__custom">
            <p id="color-picker-instructions" class="nds-assistive-text">Use arrow keys to select a saturation and brightness, on an x and y axis.</p>
            <div class="nds-color-picker__custom-range" style="background: rgb(0, 85, 255) none repeat scroll 0% 0%;">
              <a class="nds-color-picker__range-indicator" href="#" aria-live="assertive" aria-atomic="true" aria-describedby="color-picker-instructions" style="bottom: 45%; left: 46%;">
                <span class="nds-assistive-text">Saturation: 46%. Brightness: 45%.</span>
              </a>
            </div>
            <div class="nds-color-picker__hue-and-preview">
              <label class="nds-assistive-text" for="color-picker-input-range-1">Select Hue</label>
              <input type="range" min="0" max="360" class="nds-color-picker__hue-slider" id="color-picker-input-range-1" value="208">
              <span class="nds-swatch" style="background: rgb(86, 121, 192) none repeat scroll 0% 0%;">
                <span class="nds-assistive-text" aria-hidden="true">#5679C0</span>
              </span>
            </div>
            <div class="nds-color-picker__custom-inputs">
              <div class="nds-form-element nds-color-picker__input-custom-hex">
                <label class="nds-form-element__label" for="color-picker-input-hex-1">
                  Hex

                </label>
                <div class="nds-form-element__control">
                  <input type="text" id="color-picker-input-hex-1" class="nds-input" placeholder="Placeholder Text" value="#5679C0">
                </div>
              </div>
              <div class="nds-form-element">
                <label class="nds-form-element__label" for="color-picker-input-r-1">
                  <abbr title="Red">R</abbr>
                </label>
                <div class="nds-form-element__control">
                  <input type="text" id="color-picker-input-r-1" class="nds-input" placeholder="Placeholder Text" value="86">
                </div>
              </div>
              <div class="nds-form-element">
                <label class="nds-form-element__label" for="color-picker-input-g-1">
                  <abbr title="Green">G</abbr>
                </label>
                <div class="nds-form-element__control">
                  <input type="text" id="color-picker-input-g-1" class="nds-input" placeholder="Placeholder Text" value="121">
                </div>
              </div>
              <div class="nds-form-element">
                <label class="nds-form-element__label" for="color-picker-input-b-1">
                  <abbr title="blue">B</abbr>
                </label>
                <div class="nds-form-element__control">
                  <input type="text" id="color-picker-input-b-1" class="nds-input" placeholder="Placeholder Text" value="192">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <footer class="nds-popover__footer">
      <div class="nds-color-picker__selector-footer">
        <button class="nds-button nds-button_neutral">Cancel</button>
        <button class="nds-button nds-button_brand">Done</button>
      </div>
    </footer>
  </section>
</div>`);
  })
  .add('Summary Error (states)', () => {
    return withExample(`<div class="nds-color-picker">
  <div class="nds-color-picker__summary">
    <label class="nds-color-picker__summary-label" for="color-picker-summary-input">Choose Color</label>
    <button class="nds-button nds-color-picker__summary-button nds-button_icon nds-button_icon-more">
      <span class="nds-swatch" style="background: rgb(87, 123, 193) none repeat scroll 0% 0%;">
        <span class="nds-assistive-text">hsl(220, 46%, 55%)</span>
      </span>
      <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
      </svg>
      <span class="nds-assistive-text">Choose a color. Current color: #5679C0</span>
    </button>
    <div class="nds-form-element nds-color-picker__summary-input nds-has-error">
      <div class="nds-form-element__control">
        <input type="text" id="color-picker-summary-input" aria-describedby="color-picker-summary-error" class="nds-input" placeholder="Placeholder Text" value="#5679C0">
      </div>
    </div>
    <p class="nds-form-error" id="color-picker-summary-error">Please ensure value is correct</p>
  </div>
  <section class="nds-popover nds-color-picker__selector nds-hide" role="dialog" aria-label="Choose a color" aria-describedby="dialog-body-id-2">
    <div class="nds-popover__body" id="dialog-body-id-2">
      <div class="nds-tabs_default">
        <ul class="nds-tabs_default__nav" role="tablist">
          <li class="nds-tabs_default__item nds-is-active" title="Default" role="presentation">
            <a class="nds-tabs_default__link" href="javascript:void(0);" role="tab" tabindex="0" aria-selected="true" aria-controls="color-picker-default" id="color-picker-default__item">Default</a>
          </li>
          <li class="nds-tabs_default__item" title="Custom" role="presentation">
            <a class="nds-tabs_default__link" href="javascript:void(0);" role="tab" tabindex="-1" aria-selected="false" aria-controls="color-picker-custom" id="color-picker-custom__item">Custom</a>
          </li>
        </ul>
        <div id="color-picker-default" class="nds-tabs_default__content nds-show" role="tabpanel" aria-labelledby="color-picker-default__item">
          <ul class="nds-color-picker__swatches" role="listbox">
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="0">
                <span class="nds-swatch" style="background: rgb(227, 171, 236) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#e3abec</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(194, 219, 247) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#c2dbf7</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(159, 214, 255) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#9fd6ff</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(157, 231, 218) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#9de7da</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(157, 240, 192) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#9df0c0</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(255, 240, 153) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#fff099</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(254, 212, 154) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#fed49a</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(208, 115, 224) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#d073e0</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(134, 186, 243) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#86baf3</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(94, 187, 255) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#5ebbff</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(68, 216, 190) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#44d8be</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(59, 226, 130) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#3be282</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(255, 230, 84) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#ffe654</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(255, 183, 88) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#ffb758</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(189, 53, 189) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#bd35bd</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(87, 121, 193) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#5779c1</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(94, 187, 255) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#5ebbff</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(0, 174, 169) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#00aea9</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(60, 186, 76) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#3cba4c</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(245, 188, 37) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#f5bc25</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(249, 146, 33) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#f99221</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(88, 13, 140) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#580d8c</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(0, 25, 112) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#001970</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(10, 35, 153) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#0a2399</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(11, 116, 119) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#0b7477</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(11, 107, 80) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#0b6b50</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(182, 126, 17) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#b67e11</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(184, 93, 13) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#b85d0d</span>
                </span>
              </a>
            </li>
          </ul>
        </div>
        <div id="color-picker-custom" class="nds-tabs_default__content nds-hide" role="tabpanel" aria-labelledby="color-picker-custom__item">
          <div class="nds-color-picker__custom">
            <p id="color-picker-instructions" class="nds-assistive-text">Use arrow keys to select a saturation and brightness, on an x and y axis.</p>
            <div class="nds-color-picker__custom-range" style="background: rgb(0, 85, 255) none repeat scroll 0% 0%;">
              <a class="nds-color-picker__range-indicator" href="#" aria-live="assertive" aria-atomic="true" aria-describedby="color-picker-instructions" style="bottom: 45%; left: 46%;">
                <span class="nds-assistive-text">Saturation: 46%. Brightness: 45%.</span>
              </a>
            </div>
            <div class="nds-color-picker__hue-and-preview">
              <label class="nds-assistive-text" for="color-picker-input-range-2">Select Hue</label>
              <input type="range" min="0" max="360" class="nds-color-picker__hue-slider" id="color-picker-input-range-2" value="208">
              <span class="nds-swatch" style="background: rgb(86, 121, 192) none repeat scroll 0% 0%;">
                <span class="nds-assistive-text" aria-hidden="true">#5679C0</span>
              </span>
            </div>
            <div class="nds-color-picker__custom-inputs">
              <div class="nds-form-element nds-color-picker__input-custom-hex">
                <label class="nds-form-element__label" for="color-picker-input-hex-2">
                  Hex

                </label>
                <div class="nds-form-element__control">
                  <input type="text" id="color-picker-input-hex-2" class="nds-input" placeholder="Placeholder Text" value="#5679C0">
                </div>
              </div>
              <div class="nds-form-element">
                <label class="nds-form-element__label" for="color-picker-input-r-2">
                  <abbr title="Red">R</abbr>
                </label>
                <div class="nds-form-element__control">
                  <input type="text" id="color-picker-input-r-2" class="nds-input" placeholder="Placeholder Text" value="86">
                </div>
              </div>
              <div class="nds-form-element">
                <label class="nds-form-element__label" for="color-picker-input-g-2">
                  <abbr title="Green">G</abbr>
                </label>
                <div class="nds-form-element__control">
                  <input type="text" id="color-picker-input-g-2" class="nds-input" placeholder="Placeholder Text" value="121">
                </div>
              </div>
              <div class="nds-form-element">
                <label class="nds-form-element__label" for="color-picker-input-b-2">
                  <abbr title="blue">B</abbr>
                </label>
                <div class="nds-form-element__control">
                  <input type="text" id="color-picker-input-b-2" class="nds-input" placeholder="Placeholder Text" value="192">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <footer class="nds-popover__footer">
      <div class="nds-color-picker__selector-footer">
        <button class="nds-button nds-button_neutral">Cancel</button>
        <button class="nds-button nds-button_brand">Done</button>
      </div>
    </footer>
  </section>
</div>`);
  })
  .add('Color Picker Open (states)', () => {
    return withExample(`<div class="nds-color-picker">
  <div class="nds-color-picker__summary">
    <label class="nds-color-picker__summary-label" for="color-picker-summary-input">Choose Color</label>
    <button class="nds-button nds-color-picker__summary-button nds-button_icon nds-button_icon-more">
      <span class="nds-swatch" style="background: rgb(87, 123, 193) none repeat scroll 0% 0%;">
        <span class="nds-assistive-text">hsl(220, 46%, 55%)</span>
      </span>
      <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
      </svg>
      <span class="nds-assistive-text">Choose a color. Current color: #5679C0</span>
    </button>
    <div class="nds-form-element nds-color-picker__summary-input">
      <div class="nds-form-element__control">
        <input type="text" id="color-picker-summary-input" class="nds-input" placeholder="Placeholder Text" value="#5679C0">
      </div>
    </div>
  </div>
  <section class="nds-popover nds-color-picker__selector nds-show" role="dialog" aria-label="Choose a color" aria-describedby="dialog-body-id-3">
    <div class="nds-popover__body" id="dialog-body-id-3">
      <div class="nds-tabs_default">
        <ul class="nds-tabs_default__nav" role="tablist">
          <li class="nds-tabs_default__item nds-is-active" title="Default" role="presentation">
            <a class="nds-tabs_default__link" href="javascript:void(0);" role="tab" tabindex="0" aria-selected="true" aria-controls="color-picker-default" id="color-picker-default__item">Default</a>
          </li>
          <li class="nds-tabs_default__item" title="Custom" role="presentation">
            <a class="nds-tabs_default__link" href="javascript:void(0);" role="tab" tabindex="-1" aria-selected="false" aria-controls="color-picker-custom" id="color-picker-custom__item">Custom</a>
          </li>
        </ul>
        <div id="color-picker-default" class="nds-tabs_default__content nds-show" role="tabpanel" aria-labelledby="color-picker-default__item">
          <ul class="nds-color-picker__swatches" role="listbox">
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="0">
                <span class="nds-swatch" style="background: rgb(227, 171, 236) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#e3abec</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(194, 219, 247) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#c2dbf7</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(159, 214, 255) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#9fd6ff</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(157, 231, 218) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#9de7da</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(157, 240, 192) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#9df0c0</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(255, 240, 153) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#fff099</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(254, 212, 154) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#fed49a</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(208, 115, 224) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#d073e0</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(134, 186, 243) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#86baf3</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(94, 187, 255) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#5ebbff</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(68, 216, 190) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#44d8be</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(59, 226, 130) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#3be282</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(255, 230, 84) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#ffe654</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(255, 183, 88) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#ffb758</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(189, 53, 189) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#bd35bd</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(87, 121, 193) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#5779c1</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(94, 187, 255) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#5ebbff</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(0, 174, 169) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#00aea9</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(60, 186, 76) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#3cba4c</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(245, 188, 37) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#f5bc25</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(249, 146, 33) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#f99221</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(88, 13, 140) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#580d8c</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(0, 25, 112) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#001970</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(10, 35, 153) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#0a2399</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(11, 116, 119) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#0b7477</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(11, 107, 80) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#0b6b50</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(182, 126, 17) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#b67e11</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(184, 93, 13) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#b85d0d</span>
                </span>
              </a>
            </li>
          </ul>
        </div>
        <div id="color-picker-custom" class="nds-tabs_default__content nds-hide" role="tabpanel" aria-labelledby="color-picker-custom__item">
          <div class="nds-color-picker__custom">
            <p id="color-picker-instructions" class="nds-assistive-text">Use arrow keys to select a saturation and brightness, on an x and y axis.</p>
            <div class="nds-color-picker__custom-range" style="background: rgb(0, 85, 255) none repeat scroll 0% 0%;">
              <a class="nds-color-picker__range-indicator" href="#" aria-live="assertive" aria-atomic="true" aria-describedby="color-picker-instructions" style="bottom: 45%; left: 46%;">
                <span class="nds-assistive-text">Saturation: 46%. Brightness: 45%.</span>
              </a>
            </div>
            <div class="nds-color-picker__hue-and-preview">
              <label class="nds-assistive-text" for="color-picker-input-range-3">Select Hue</label>
              <input type="range" min="0" max="360" class="nds-color-picker__hue-slider" id="color-picker-input-range-3" value="208">
              <span class="nds-swatch" style="background: rgb(86, 121, 192) none repeat scroll 0% 0%;">
                <span class="nds-assistive-text" aria-hidden="true">#5679C0</span>
              </span>
            </div>
            <div class="nds-color-picker__custom-inputs">
              <div class="nds-form-element nds-color-picker__input-custom-hex">
                <label class="nds-form-element__label" for="color-picker-input-hex-3">
                  Hex

                </label>
                <div class="nds-form-element__control">
                  <input type="text" id="color-picker-input-hex-3" class="nds-input" placeholder="Placeholder Text" value="#5679C0">
                </div>
              </div>
              <div class="nds-form-element">
                <label class="nds-form-element__label" for="color-picker-input-r-3">
                  <abbr title="Red">R</abbr>
                </label>
                <div class="nds-form-element__control">
                  <input type="text" id="color-picker-input-r-3" class="nds-input" placeholder="Placeholder Text" value="86">
                </div>
              </div>
              <div class="nds-form-element">
                <label class="nds-form-element__label" for="color-picker-input-g-3">
                  <abbr title="Green">G</abbr>
                </label>
                <div class="nds-form-element__control">
                  <input type="text" id="color-picker-input-g-3" class="nds-input" placeholder="Placeholder Text" value="121">
                </div>
              </div>
              <div class="nds-form-element">
                <label class="nds-form-element__label" for="color-picker-input-b-3">
                  <abbr title="blue">B</abbr>
                </label>
                <div class="nds-form-element__control">
                  <input type="text" id="color-picker-input-b-3" class="nds-input" placeholder="Placeholder Text" value="192">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <footer class="nds-popover__footer">
      <div class="nds-color-picker__selector-footer">
        <button class="nds-button nds-button_neutral">Cancel</button>
        <button class="nds-button nds-button_brand">Done</button>
      </div>
    </footer>
  </section>
</div>`);
  })
  .add('Custom Tab Selected (states)', () => {
    return withExample(`<div class="nds-color-picker">
  <div class="nds-color-picker__summary">
    <label class="nds-color-picker__summary-label" for="color-picker-summary-input">Choose Color</label>
    <button class="nds-button nds-color-picker__summary-button nds-button_icon nds-button_icon-more">
      <span class="nds-swatch" style="background: rgb(87, 123, 193) none repeat scroll 0% 0%;">
        <span class="nds-assistive-text">hsl(220, 46%, 55%)</span>
      </span>
      <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
      </svg>
      <span class="nds-assistive-text">Choose a color. Current color: #5679C0</span>
    </button>
    <div class="nds-form-element nds-color-picker__summary-input">
      <div class="nds-form-element__control">
        <input type="text" id="color-picker-summary-input" class="nds-input" placeholder="Placeholder Text" value="#5679C0">
      </div>
    </div>
  </div>
  <section class="nds-popover nds-color-picker__selector nds-show" role="dialog" aria-label="Choose a color" aria-describedby="dialog-body-id-4">
    <div class="nds-popover__body" id="dialog-body-id-4">
      <div class="nds-tabs_default">
        <ul class="nds-tabs_default__nav" role="tablist">
          <li class="nds-tabs_default__item" title="Default" role="presentation">
            <a class="nds-tabs_default__link" href="javascript:void(0);" role="tab" tabindex="-1" aria-selected="false" aria-controls="color-picker-default" id="color-picker-default__item">Default</a>
          </li>
          <li class="nds-tabs_default__item nds-is-active" title="Custom" role="presentation">
            <a class="nds-tabs_default__link" href="javascript:void(0);" role="tab" tabindex="0" aria-selected="true" aria-controls="color-picker-custom" id="color-picker-custom__item">Custom</a>
          </li>
        </ul>
        <div id="color-picker-default" class="nds-tabs_default__content nds-hide" role="tabpanel" aria-labelledby="color-picker-default__item">
          <ul class="nds-color-picker__swatches" role="listbox">
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="0">
                <span class="nds-swatch" style="background: rgb(227, 171, 236) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#e3abec</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(194, 219, 247) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#c2dbf7</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(159, 214, 255) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#9fd6ff</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(157, 231, 218) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#9de7da</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(157, 240, 192) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#9df0c0</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(255, 240, 153) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#fff099</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(254, 212, 154) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#fed49a</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(208, 115, 224) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#d073e0</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(134, 186, 243) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#86baf3</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(94, 187, 255) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#5ebbff</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(68, 216, 190) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#44d8be</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(59, 226, 130) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#3be282</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(255, 230, 84) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#ffe654</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(255, 183, 88) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#ffb758</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(189, 53, 189) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#bd35bd</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(87, 121, 193) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#5779c1</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(94, 187, 255) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#5ebbff</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(0, 174, 169) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#00aea9</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(60, 186, 76) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#3cba4c</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(245, 188, 37) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#f5bc25</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(249, 146, 33) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#f99221</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(88, 13, 140) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#580d8c</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(0, 25, 112) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#001970</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(10, 35, 153) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#0a2399</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(11, 116, 119) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#0b7477</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(11, 107, 80) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#0b6b50</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(182, 126, 17) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#b67e11</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(184, 93, 13) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#b85d0d</span>
                </span>
              </a>
            </li>
          </ul>
        </div>
        <div id="color-picker-custom" class="nds-tabs_default__content nds-show" role="tabpanel" aria-labelledby="color-picker-custom__item">
          <div class="nds-color-picker__custom">
            <p id="color-picker-instructions" class="nds-assistive-text">Use arrow keys to select a saturation and brightness, on an x and y axis.</p>
            <div class="nds-color-picker__custom-range" style="background: rgb(0, 85, 255) none repeat scroll 0% 0%;">
              <a class="nds-color-picker__range-indicator" href="#" aria-live="assertive" aria-atomic="true" aria-describedby="color-picker-instructions" style="bottom: 45%; left: 46%;">
                <span class="nds-assistive-text">Saturation: 46%. Brightness: 45%.</span>
              </a>
            </div>
            <div class="nds-color-picker__hue-and-preview">
              <label class="nds-assistive-text" for="color-picker-input-range-4">Select Hue</label>
              <input type="range" min="0" max="360" class="nds-color-picker__hue-slider" id="color-picker-input-range-4" value="208">
              <span class="nds-swatch" style="background: rgb(86, 121, 192) none repeat scroll 0% 0%;">
                <span class="nds-assistive-text" aria-hidden="true">#5679C0</span>
              </span>
            </div>
            <div class="nds-color-picker__custom-inputs">
              <div class="nds-form-element nds-color-picker__input-custom-hex">
                <label class="nds-form-element__label" for="color-picker-input-hex-4">
                  Hex

                </label>
                <div class="nds-form-element__control">
                  <input type="text" id="color-picker-input-hex-4" class="nds-input" placeholder="Placeholder Text" value="#5679C0">
                </div>
              </div>
              <div class="nds-form-element">
                <label class="nds-form-element__label" for="color-picker-input-r-4">
                  <abbr title="Red">R</abbr>
                </label>
                <div class="nds-form-element__control">
                  <input type="text" id="color-picker-input-r-4" class="nds-input" placeholder="Placeholder Text" value="86">
                </div>
              </div>
              <div class="nds-form-element">
                <label class="nds-form-element__label" for="color-picker-input-g-4">
                  <abbr title="Green">G</abbr>
                </label>
                <div class="nds-form-element__control">
                  <input type="text" id="color-picker-input-g-4" class="nds-input" placeholder="Placeholder Text" value="121">
                </div>
              </div>
              <div class="nds-form-element">
                <label class="nds-form-element__label" for="color-picker-input-b-4">
                  <abbr title="blue">B</abbr>
                </label>
                <div class="nds-form-element__control">
                  <input type="text" id="color-picker-input-b-4" class="nds-input" placeholder="Placeholder Text" value="192">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <footer class="nds-popover__footer">
      <div class="nds-color-picker__selector-footer">
        <button class="nds-button nds-button_neutral">Cancel</button>
        <button class="nds-button nds-button_brand">Done</button>
      </div>
    </footer>
  </section>
</div>`);
  })
  .add('Custom Tab Selected Error (states)', () => {
    return withExample(`<div class="nds-color-picker">
  <div class="nds-color-picker__summary">
    <label class="nds-color-picker__summary-label" for="color-picker-summary-input">Choose Color</label>
    <button class="nds-button nds-color-picker__summary-button nds-button_icon nds-button_icon-more">
      <span class="nds-swatch" style="background: rgb(87, 123, 193) none repeat scroll 0% 0%;">
        <span class="nds-assistive-text">hsl(220, 46%, 55%)</span>
      </span>
      <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
      </svg>
      <span class="nds-assistive-text">Choose a color. Current color: #5679C0</span>
    </button>
    <div class="nds-form-element nds-color-picker__summary-input">
      <div class="nds-form-element__control">
        <input type="text" id="color-picker-summary-input" class="nds-input" placeholder="Placeholder Text" value="#5679C0">
      </div>
    </div>
  </div>
  <section class="nds-popover nds-color-picker__selector nds-show" role="dialog" aria-label="Choose a color" aria-describedby="dialog-body-id-5">
    <div class="nds-popover__body" id="dialog-body-id-5">
      <div class="nds-tabs_default">
        <ul class="nds-tabs_default__nav" role="tablist">
          <li class="nds-tabs_default__item" title="Default" role="presentation">
            <a class="nds-tabs_default__link" href="javascript:void(0);" role="tab" tabindex="-1" aria-selected="false" aria-controls="color-picker-default" id="color-picker-default__item">Default</a>
          </li>
          <li class="nds-tabs_default__item nds-is-active" title="Custom" role="presentation">
            <a class="nds-tabs_default__link" href="javascript:void(0);" role="tab" tabindex="0" aria-selected="true" aria-controls="color-picker-custom" id="color-picker-custom__item">Custom</a>
          </li>
        </ul>
        <div id="color-picker-default" class="nds-tabs_default__content nds-hide" role="tabpanel" aria-labelledby="color-picker-default__item">
          <ul class="nds-color-picker__swatches" role="listbox">
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="0">
                <span class="nds-swatch" style="background: rgb(227, 171, 236) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#e3abec</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(194, 219, 247) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#c2dbf7</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(159, 214, 255) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#9fd6ff</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(157, 231, 218) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#9de7da</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(157, 240, 192) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#9df0c0</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(255, 240, 153) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#fff099</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(254, 212, 154) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#fed49a</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(208, 115, 224) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#d073e0</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(134, 186, 243) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#86baf3</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(94, 187, 255) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#5ebbff</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(68, 216, 190) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#44d8be</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(59, 226, 130) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#3be282</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(255, 230, 84) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#ffe654</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(255, 183, 88) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#ffb758</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(189, 53, 189) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#bd35bd</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(87, 121, 193) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#5779c1</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(94, 187, 255) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#5ebbff</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(0, 174, 169) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#00aea9</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(60, 186, 76) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#3cba4c</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(245, 188, 37) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#f5bc25</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(249, 146, 33) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#f99221</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(88, 13, 140) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#580d8c</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(0, 25, 112) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#001970</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(10, 35, 153) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#0a2399</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(11, 116, 119) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#0b7477</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(11, 107, 80) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#0b6b50</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(182, 126, 17) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#b67e11</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="option" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(184, 93, 13) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#b85d0d</span>
                </span>
              </a>
            </li>
          </ul>
        </div>
        <div id="color-picker-custom" class="nds-tabs_default__content nds-show" role="tabpanel" aria-labelledby="color-picker-custom__item">
          <div class="nds-color-picker__custom">
            <p id="color-picker-instructions" class="nds-assistive-text">Use arrow keys to select a saturation and brightness, on an x and y axis.</p>
            <div class="nds-color-picker__custom-range" style="background: rgb(0, 85, 255) none repeat scroll 0% 0%;">
              <a class="nds-color-picker__range-indicator" href="#" aria-live="assertive" aria-atomic="true" aria-describedby="color-picker-instructions" style="bottom: 45%; left: 46%;">
                <span class="nds-assistive-text">Saturation: 46%. Brightness: 45%.</span>
              </a>
            </div>
            <div class="nds-color-picker__hue-and-preview">
              <label class="nds-assistive-text" for="color-picker-input-range-5">Select Hue</label>
              <input type="range" min="0" max="360" class="nds-color-picker__hue-slider" id="color-picker-input-range-5" value="208">
              <span class="nds-swatch" style="background: rgb(86, 121, 192) none repeat scroll 0% 0%;">
                <span class="nds-assistive-text" aria-hidden="true">#5679C0</span>
              </span>
            </div>
            <div class="nds-color-picker__custom-inputs">
              <div class="nds-form-element nds-color-picker__input-custom-hex nds-has-error">
                <label class="nds-form-element__label" for="color-picker-input-hex-5">
                  Hex

                </label>
                <div class="nds-form-element__control">
                  <input type="text" id="color-picker-input-hex-5" aria-describedby="color-picker-custom-error" class="nds-input" placeholder="Placeholder Text" value="#5679C0">
                </div>
              </div>
              <div class="nds-form-element">
                <label class="nds-form-element__label" for="color-picker-input-r-5">
                  <abbr title="Red">R</abbr>
                </label>
                <div class="nds-form-element__control">
                  <input type="text" id="color-picker-input-r-5" class="nds-input" placeholder="Placeholder Text" value="86">
                </div>
              </div>
              <div class="nds-form-element">
                <label class="nds-form-element__label" for="color-picker-input-g-5">
                  <abbr title="Green">G</abbr>
                </label>
                <div class="nds-form-element__control">
                  <input type="text" id="color-picker-input-g-5" class="nds-input" placeholder="Placeholder Text" value="121">
                </div>
              </div>
              <div class="nds-form-element">
                <label class="nds-form-element__label" for="color-picker-input-b-5">
                  <abbr title="blue">B</abbr>
                </label>
                <div class="nds-form-element__control">
                  <input type="text" id="color-picker-input-b-5" class="nds-input" placeholder="Placeholder Text" value="192">
                </div>
              </div>
            </div>
            <p class="nds-form-error" id="color-picker-custom-error">Please ensure value is correct</p>
          </div>
        </div>
      </div>
    </div>
    <footer class="nds-popover__footer">
      <div class="nds-color-picker__selector-footer">
        <button class="nds-button nds-button_neutral">Cancel</button>
        <button class="nds-button nds-button_brand">Done</button>
      </div>
    </footer>
  </section>
</div>`);
  });
