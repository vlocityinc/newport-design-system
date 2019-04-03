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
  <section class="nds-popover nds-color-picker__selector nds-hide" role="dialog" aria-label="Choose a color" aria-describedby="dialog-body-id-14">
    <div class="nds-popover__body" id="dialog-body-id-14">
      <div class="nds-color-picker__custom">
        <p id="color-picker-instructions" class="nds-assistive-text">Use arrow keys to select a saturation and brightness, on an x and y axis.</p>
        <div class="nds-color-picker__custom-range" style="background: rgb(0, 85, 255) none repeat scroll 0% 0%;">
          <a class="nds-color-picker__range-indicator" href="#" aria-live="assertive" aria-atomic="true" aria-describedby="color-picker-instructions" style="bottom: 45%; left: 46%;">
            <span class="nds-assistive-text">Saturation: 46%. Brightness: 45%.</span>
          </a>
        </div>
        <div class="nds-color-picker__hue-and-preview">
          <label class="nds-assistive-text" for="color-picker-input-range-14">Select Hue</label>
          <input type="range" min="0" max="360" class="nds-color-picker__hue-slider" id="color-picker-input-range-14" value="208">
          <span class="nds-swatch" style="background: rgb(86, 121, 192) none repeat scroll 0% 0%;">
            <span class="nds-assistive-text" aria-hidden="true">#5679C0</span>
          </span>
        </div>
        <div class="nds-color-picker__custom-inputs">
          <div class="nds-form-element nds-color-picker__input-custom-hex">
            <label class="nds-form-element__label" for="color-picker-input-hex-14">
              Hex

            </label>
            <div class="nds-form-element__control">
              <input type="text" id="color-picker-input-hex-14" class="nds-input" placeholder="Placeholder Text" value="#5679C0">
            </div>
          </div>
          <div class="nds-form-element">
            <label class="nds-form-element__label" for="color-picker-input-r-14">
              <abbr title="Red">R</abbr>
            </label>
            <div class="nds-form-element__control">
              <input type="text" id="color-picker-input-r-14" class="nds-input" placeholder="Placeholder Text" value="86">
            </div>
          </div>
          <div class="nds-form-element">
            <label class="nds-form-element__label" for="color-picker-input-g-14">
              <abbr title="Green">G</abbr>
            </label>
            <div class="nds-form-element__control">
              <input type="text" id="color-picker-input-g-14" class="nds-input" placeholder="Placeholder Text" value="121">
            </div>
          </div>
          <div class="nds-form-element">
            <label class="nds-form-element__label" for="color-picker-input-b-14">
              <abbr title="blue">B</abbr>
            </label>
            <div class="nds-form-element__control">
              <input type="text" id="color-picker-input-b-14" class="nds-input" placeholder="Placeholder Text" value="192">
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
  .add('Custom Color Picker Open (states)', () => {
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
  <section class="nds-popover nds-color-picker__selector nds-show" role="dialog" aria-label="Choose a color" aria-describedby="dialog-body-id-15">
    <div class="nds-popover__body" id="dialog-body-id-15">
      <div class="nds-color-picker__custom">
        <p id="color-picker-instructions" class="nds-assistive-text">Use arrow keys to select a saturation and brightness, on an x and y axis.</p>
        <div class="nds-color-picker__custom-range" style="background: rgb(0, 85, 255) none repeat scroll 0% 0%;">
          <a class="nds-color-picker__range-indicator" href="#" aria-live="assertive" aria-atomic="true" aria-describedby="color-picker-instructions" style="bottom: 45%; left: 46%;">
            <span class="nds-assistive-text">Saturation: 46%. Brightness: 45%.</span>
          </a>
        </div>
        <div class="nds-color-picker__hue-and-preview">
          <label class="nds-assistive-text" for="color-picker-input-range-15">Select Hue</label>
          <input type="range" min="0" max="360" class="nds-color-picker__hue-slider" id="color-picker-input-range-15" value="208">
          <span class="nds-swatch" style="background: rgb(86, 121, 192) none repeat scroll 0% 0%;">
            <span class="nds-assistive-text" aria-hidden="true">#5679C0</span>
          </span>
        </div>
        <div class="nds-color-picker__custom-inputs">
          <div class="nds-form-element nds-color-picker__input-custom-hex">
            <label class="nds-form-element__label" for="color-picker-input-hex-15">
              Hex

            </label>
            <div class="nds-form-element__control">
              <input type="text" id="color-picker-input-hex-15" class="nds-input" placeholder="Placeholder Text" value="#5679C0">
            </div>
          </div>
          <div class="nds-form-element">
            <label class="nds-form-element__label" for="color-picker-input-r-15">
              <abbr title="Red">R</abbr>
            </label>
            <div class="nds-form-element__control">
              <input type="text" id="color-picker-input-r-15" class="nds-input" placeholder="Placeholder Text" value="86">
            </div>
          </div>
          <div class="nds-form-element">
            <label class="nds-form-element__label" for="color-picker-input-g-15">
              <abbr title="Green">G</abbr>
            </label>
            <div class="nds-form-element__control">
              <input type="text" id="color-picker-input-g-15" class="nds-input" placeholder="Placeholder Text" value="121">
            </div>
          </div>
          <div class="nds-form-element">
            <label class="nds-form-element__label" for="color-picker-input-b-15">
              <abbr title="blue">B</abbr>
            </label>
            <div class="nds-form-element__control">
              <input type="text" id="color-picker-input-b-15" class="nds-input" placeholder="Placeholder Text" value="192">
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
  .add('Custom Color Picker Open Error (states)', () => {
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
  <section class="nds-popover nds-color-picker__selector nds-show" role="dialog" aria-label="Choose a color" aria-describedby="dialog-body-id-16">
    <div class="nds-popover__body" id="dialog-body-id-16">
      <div class="nds-color-picker__custom">
        <p id="color-picker-instructions" class="nds-assistive-text">Use arrow keys to select a saturation and brightness, on an x and y axis.</p>
        <div class="nds-color-picker__custom-range" style="background: rgb(0, 85, 255) none repeat scroll 0% 0%;">
          <a class="nds-color-picker__range-indicator" href="#" aria-live="assertive" aria-atomic="true" aria-describedby="color-picker-instructions" style="bottom: 45%; left: 46%;">
            <span class="nds-assistive-text">Saturation: 46%. Brightness: 45%.</span>
          </a>
        </div>
        <div class="nds-color-picker__hue-and-preview">
          <label class="nds-assistive-text" for="color-picker-input-range-16">Select Hue</label>
          <input type="range" min="0" max="360" class="nds-color-picker__hue-slider" id="color-picker-input-range-16" value="208">
          <span class="nds-swatch" style="background: rgb(86, 121, 192) none repeat scroll 0% 0%;">
            <span class="nds-assistive-text" aria-hidden="true">#5679C0</span>
          </span>
        </div>
        <div class="nds-color-picker__custom-inputs">
          <div class="nds-form-element nds-color-picker__input-custom-hex nds-has-error">
            <label class="nds-form-element__label" for="color-picker-input-hex-16">
              Hex

            </label>
            <div class="nds-form-element__control">
              <input type="text" id="color-picker-input-hex-16" aria-describedby="color-picker-custom-error" class="nds-input" placeholder="Placeholder Text" value="#5679C0">
            </div>
          </div>
          <div class="nds-form-element">
            <label class="nds-form-element__label" for="color-picker-input-r-16">
              <abbr title="Red">R</abbr>
            </label>
            <div class="nds-form-element__control">
              <input type="text" id="color-picker-input-r-16" class="nds-input" placeholder="Placeholder Text" value="86">
            </div>
          </div>
          <div class="nds-form-element">
            <label class="nds-form-element__label" for="color-picker-input-g-16">
              <abbr title="Green">G</abbr>
            </label>
            <div class="nds-form-element__control">
              <input type="text" id="color-picker-input-g-16" class="nds-input" placeholder="Placeholder Text" value="121">
            </div>
          </div>
          <div class="nds-form-element">
            <label class="nds-form-element__label" for="color-picker-input-b-16">
              <abbr title="blue">B</abbr>
            </label>
            <div class="nds-form-element__control">
              <input type="text" id="color-picker-input-b-16" class="nds-input" placeholder="Placeholder Text" value="192">
            </div>
          </div>
        </div>
        <p class="nds-form-error" id="color-picker-custom-error">Please ensure value is correct</p>
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
