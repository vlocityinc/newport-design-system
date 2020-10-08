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
    return withExample(`<div style="padding-left: 2rem; padding-top: 5rem; position: relative;">
  <div class="nds-form-element">
    <div class="nds-form-element__icon nds-align-middle">
      <button class="nds-button nds-button_icon nds-button nds-button_icon" aria-describedby="help" title="Help">
        <svg class="nds-button__icon" aria-hidden="true">
          <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#info"></use>
        </svg>
        <span class="nds-assistive-text">Help</span>
      </button>
    </div>
  </div>
  <div class="nds-popover nds-popover_tooltip nds-nubbin_bottom-left" role="tooltip" id="help" style="position: absolute; top: 0px; left: 15px;">
    <div class="nds-popover__body">Sit nulla est ex deserunt exercitation anim occaecat. Nostrud ullamco deserunt aute id consequat veniam incididunt duis in sint irure nisi.</div>
  </div>
</div>`);
  });
