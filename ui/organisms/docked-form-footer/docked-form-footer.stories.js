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
    return withExample(`<div style="height: 180px;">
  <div class="nds-docked-form-footer">
    <button type="button" class="nds-button nds-button_neutral">Cancel</button>
    <button type="button" class="nds-button nds-button_brand">Save</button>
  </div>
</div>`);
  })
  .add('Docked Form Footer With Error (states)', () => {
    return withExample(`<div style="height: 180px;">
  <div class="nds-docked-form-footer">
    <button class="nds-button nds-button_icon nds-button_icon nds-button_icon-error" title="Review the Following Errors">
      <svg class="nds-button__icon nds-button__icon_large" aria-hidden="true">
        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#warning"></use>
      </svg>
      <span class="nds-assistive-text">Review the Following Errors</span>
    </button>
    <button type="button" class="nds-button nds-button_neutral">Cancel</button>
    <button type="button" class="nds-button nds-button_brand">Save</button>
  </div>
</div>`);
  })
  .add('Docked Form Footer With Popover (states)', () => {
    return withExample(`<div style="height: 180px;">
  <div class="nds-docked-form-footer">
    <button class="nds-button nds-button_icon nds-button_icon nds-button_icon-error" title="Review the Following Errors">
      <svg class="nds-button__icon nds-button__icon_large" aria-hidden="true">
        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#warning"></use>
      </svg>
      <span class="nds-assistive-text">Review the Following Errors</span>
    </button>
    <button type="button" class="nds-button nds-button_neutral">Cancel</button>
    <button type="button" class="nds-button nds-button_brand">Save</button>
    <section class="nds-popover nds-nubbin_bottom-left nds-theme_error" role="dialog" aria-label="Contextual title of this dialog" aria-describedby="dialog-description-01" style="position: absolute; bottom: 56px; left: 50%; margin-left: 66px; transform: translateX(-50%);">
      <button class="nds-button nds-button_icon nds-button_icon-inverse nds-button_icon-small nds-float_right nds-popover__close" title="Close">
        <svg class="nds-button__icon" aria-hidden="true">
          <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
        </svg>
        <span class="nds-assistive-text">Close</span>
      </button>
      <div class="nds-popover__body nds-text-longform" id="dialog-description-01">
        <p>Sit nulla est ex deserunt exercitation anim occaecat. Nostrud ullamco deserunt aute id consequat veniam incididunt duis in sint irure nisi.</p>
      </div>
    </section>
  </div>
</div>`);
  });
