import { storiesOf } from '@storybook/html';
import base from 'paths.macro';
import notes from '../doc.md';
import scss from '../base/_index.scss';
import {
  withExample,
  withDocs,
  commentToHTML
} from '../../../../scripts/storybook';

storiesOf(`${base}`, module)
  .addDecorator(withDocs(notes))
  .addDecorator(commentToHTML(scss))
  .add('Default (default)', () => {
    return withExample(`<button class="nds-button nds-button_icon nds-button_icon-more" aria-haspopup="true" title="More Options">
  <svg class="nds-button__icon" aria-hidden="true">
    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#settings"></use>
  </svg>
  <svg class="nds-button__icon nds-button__icon_x-small" aria-hidden="true">
    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
  </svg>
  <span class="nds-assistive-text">More options</span>
</button>`);
  })
  .add('Button Icon Container With Dropdown (states)', () => {
    return withExample(`<button class="nds-button nds-button_icon nds-button_icon-container-more" aria-haspopup="true" title="More Options">
  <svg class="nds-button__icon" aria-hidden="true">
    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#settings"></use>
  </svg>
  <svg class="nds-button__icon nds-button__icon_x-small" aria-hidden="true">
    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
  </svg>
  <span class="nds-assistive-text">More options</span>
</button>`);
  })
  .add('Button Icon With Dropdown Filled (states)', () => {
    return withExample(`<button class="nds-button nds-button_icon nds-button_icon-more nds-button_icon-more-filled" aria-haspopup="true" title="More Options">
  <svg class="nds-button__icon" aria-hidden="true">
    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#settings"></use>
  </svg>
  <svg class="nds-button__icon nds-button__icon_x-small" aria-hidden="true">
    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
  </svg>
  <span class="nds-assistive-text">More options</span>
</button>`);
  })
  .add('Button Icon With Dropdown Inverse (states)', () => {
    return withExample(`<div style="padding: 0.5rem; background-color: rgb(22, 50, 92);">
  <button class="nds-button nds-button_icon nds-button_icon-inverse nds-button_icon-more" aria-haspopup="true" title="More Options">
    <svg class="nds-button__icon" aria-hidden="true">
      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#settings"></use>
    </svg>
    <svg class="nds-button__icon nds-button__icon_x-small" aria-hidden="true">
      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
    </svg>
    <span class="nds-assistive-text">More options</span>
  </button>
</div>`);
  })
  .add('Button Icon Container With Dropdown Inverse (states)', () => {
    return withExample(`<div style="padding: 0.5rem; background-color: rgb(22, 50, 92);">
  <button class="nds-button nds-button_icon nds-button_icon-inverse nds-button_icon-container-more" aria-haspopup="true" title="More Options">
    <svg class="nds-button__icon" aria-hidden="true">
      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#settings"></use>
    </svg>
    <svg class="nds-button__icon nds-button__icon_x-small" aria-hidden="true">
      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
    </svg>
    <span class="nds-assistive-text">More options</span>
  </button>
</div>`);
  });
