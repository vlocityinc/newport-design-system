import { storiesOf } from '@storybook/html';
import base from 'paths.macro';
import notes from './doc.md';
import scss from './coverable-content/_index.scss';
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
  <legend class="nds-form-element__legend nds-form-element__label">Select an app</legend>
  <div class="nds-form-element__control">
    <div class="nds-visual-picker nds-visual-picker_medium">
      <input type="radio" id="visual-picker-1" name="options" value="on">
      <label for="visual-picker-1">
        <span class="nds-visual-picker__figure nds-visual-picker__icon nds-align_absolute-center">
          <span class="nds-is-selected">
            <span class="nds-icon_container" title="description of icon when needed">
              <svg class="nds-icon nds-icon_large nds-icon-action-check" aria-hidden="true">
                <use xlink:href="/assets/icons/action-sprite/svg/symbols.svg#check"></use>
              </svg>
              <span class="nds-assistive-text">Provide description of icon</span>
            </span>
          </span>
          <span class="nds-is-not-selected">
            <span class="nds-icon_container" title="description of icon when needed">
              <svg class="nds-icon nds-icon-utility-connected_apps nds-icon_large nds-icon-text-default" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#connected_apps"></use>
              </svg>
              <span class="nds-assistive-text">Provide description of icon</span>
            </span>
          </span>
        </span>
        <span class="nds-visual-picker__body">Connected App</span>
      </label>
    </div>
    <div class="nds-visual-picker nds-visual-picker_medium">
      <input type="radio" id="visual-picker-2" name="options" value="on">
      <label for="visual-picker-2">
        <span class="nds-visual-picker__figure nds-visual-picker__icon nds-align_absolute-center">
          <span class="nds-is-selected">
            <span class="nds-icon_container" title="description of icon when needed">
              <svg class="nds-icon nds-icon_large nds-icon-action-check" aria-hidden="true">
                <use xlink:href="/assets/icons/action-sprite/svg/symbols.svg#check"></use>
              </svg>
              <span class="nds-assistive-text">Provide description of icon</span>
            </span>
          </span>
          <span class="nds-is-not-selected">
            <span class="nds-icon_container" title="description of icon when needed">
              <svg class="nds-icon nds-icon-utility-custom_apps nds-icon_large nds-icon-text-default" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#custom_apps"></use>
              </svg>
              <span class="nds-assistive-text">Provide description of icon</span>
            </span>
          </span>
        </span>
        <span class="nds-visual-picker__body">Custom App</span>
      </label>
    </div>
  </div>
</fieldset>`);
  })
  .add('Disabled (states)', () => {
    return withExample(`<fieldset class="nds-form-element">
  <legend class="nds-form-element__legend nds-form-element__label">Select an app</legend>
  <div class="nds-form-element__control">
    <div class="nds-visual-picker nds-visual-picker_medium">
      <input type="checkbox" id="visual-picker-3" name="options" value="on">
      <label for="visual-picker-3">
        <span class="nds-visual-picker__figure nds-visual-picker__icon nds-align_absolute-center">
          <span class="nds-is-selected">
            <span class="nds-icon_container" title="description of icon when needed">
              <svg class="nds-icon nds-icon_large nds-icon-action-check" aria-hidden="true">
                <use xlink:href="/assets/icons/action-sprite/svg/symbols.svg#check"></use>
              </svg>
              <span class="nds-assistive-text">Provide description of icon</span>
            </span>
          </span>
          <span class="nds-is-not-selected">
            <span class="nds-icon_container" title="description of icon when needed">
              <svg class="nds-icon nds-icon-utility-connected_apps nds-icon_large nds-icon-text-default" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#connected_apps"></use>
              </svg>
              <span class="nds-assistive-text">Provide description of icon</span>
            </span>
          </span>
        </span>
        <span class="nds-visual-picker__body">Connected App</span>
      </label>
    </div>
    <div class="nds-visual-picker nds-visual-picker_medium">
      <input type="checkbox" id="visual-picker-4" name="options" disabled="" value="on">
      <label for="visual-picker-4">
        <span class="nds-visual-picker__figure nds-visual-picker__icon nds-align_absolute-center">
          <span class="nds-is-selected">
            <span class="nds-icon_container" title="description of icon when needed">
              <svg class="nds-icon nds-icon_large nds-icon-action-check" aria-hidden="true">
                <use xlink:href="/assets/icons/action-sprite/svg/symbols.svg#check"></use>
              </svg>
              <span class="nds-assistive-text">Provide description of icon</span>
            </span>
          </span>
          <span class="nds-is-not-selected">
            <span class="nds-icon_container" title="description of icon when needed">
              <svg class="nds-icon nds-icon-utility-custom_apps nds-icon_large nds-icon-text-default" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#custom_apps"></use>
              </svg>
              <span class="nds-assistive-text">Provide description of icon</span>
            </span>
          </span>
        </span>
        <span class="nds-visual-picker__body">Custom App</span>
      </label>
    </div>
  </div>
</fieldset>`);
  })
  .add('Checkbox Group (examples)', () => {
    return withExample(`<fieldset class="nds-form-element">
  <legend class="nds-form-element__legend nds-form-element__label">Add the following object(s)</legend>
  <div class="nds-form-element__control">
    <div class="nds-visual-picker nds-visual-picker_medium">
      <input type="checkbox" id="visual-picker-5" name="options" value="on">
      <label for="visual-picker-5">
        <span class="nds-visual-picker__figure nds-visual-picker__icon nds-align_absolute-center">
          <span class="nds-is-selected">
            <span class="nds-icon_container" title="description of icon when needed">
              <svg class="nds-icon nds-icon_large nds-icon-action-check" aria-hidden="true">
                <use xlink:href="/assets/icons/action-sprite/svg/symbols.svg#check"></use>
              </svg>
              <span class="nds-assistive-text">Provide description of icon</span>
            </span>
          </span>
          <span class="nds-is-not-selected">
            <span class="nds-icon_container" title="description of icon when needed">
              <svg class="nds-icon nds-icon-standard-account nds-icon_large" aria-hidden="true">
                <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#account"></use>
              </svg>
              <span class="nds-assistive-text">Provide description of icon</span>
            </span>
          </span>
        </span>
        <span class="nds-visual-picker__body">Account</span>
      </label>
    </div>
    <div class="nds-visual-picker nds-visual-picker_medium">
      <input type="checkbox" id="visual-picker-6" name="options" value="on">
      <label for="visual-picker-6">
        <span class="nds-visual-picker__figure nds-visual-picker__icon nds-align_absolute-center">
          <span class="nds-is-selected">
            <span class="nds-icon_container" title="description of icon when needed">
              <svg class="nds-icon nds-icon_large nds-icon-action-check" aria-hidden="true">
                <use xlink:href="/assets/icons/action-sprite/svg/symbols.svg#check"></use>
              </svg>
              <span class="nds-assistive-text">Provide description of icon</span>
            </span>
          </span>
          <span class="nds-is-not-selected">
            <span class="nds-icon_container" title="description of icon when needed">
              <svg class="nds-icon nds-icon-standard-lead nds-icon_large" aria-hidden="true">
                <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#lead"></use>
              </svg>
              <span class="nds-assistive-text">Provide description of icon</span>
            </span>
          </span>
        </span>
        <span class="nds-visual-picker__body">Lead</span>
      </label>
    </div>
    <div class="nds-visual-picker nds-visual-picker_medium">
      <input type="checkbox" id="visual-picker-7" name="options" value="on">
      <label for="visual-picker-7">
        <span class="nds-visual-picker__figure nds-visual-picker__icon nds-align_absolute-center">
          <span class="nds-is-selected">
            <span class="nds-icon_container" title="description of icon when needed">
              <svg class="nds-icon nds-icon_large nds-icon-action-check" aria-hidden="true">
                <use xlink:href="/assets/icons/action-sprite/svg/symbols.svg#check"></use>
              </svg>
              <span class="nds-assistive-text">Provide description of icon</span>
            </span>
          </span>
          <span class="nds-is-not-selected">
            <span class="nds-icon_container" title="description of icon when needed">
              <svg class="nds-icon nds-icon-standard-orders nds-icon_large" aria-hidden="true">
                <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#orders"></use>
              </svg>
              <span class="nds-assistive-text">Provide description of icon</span>
            </span>
          </span>
        </span>
        <span class="nds-visual-picker__body">Orders</span>
      </label>
    </div>
  </div>
</fieldset>`);
  });
