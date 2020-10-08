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
    return withExample(`<span class="nds-pill nds-pill_link">
  <a href="javascript:void(0);" class="nds-pill__action" title="Full pill label verbiage mirrored here">
    <span class="nds-pill__label">Pill Label</span>
  </a>
  <button class="nds-button nds-button_icon nds-button_icon nds-pill__remove" title="Remove">
    <svg class="nds-button__icon" aria-hidden="true">
      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
    </svg>
    <span class="nds-assistive-text">Remove</span>
  </button>
</span>`);
  })
  .add('Icon (examples)', () => {
    return withExample(`<span class="nds-pill nds-pill_link">
  <span class="nds-pill__icon_container">
    <span class="nds-icon_container nds-icon-standard-account" title="Account">
      <svg class="nds-icon" aria-hidden="true">
        <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#account"></use>
      </svg>
      <span class="nds-assistive-text">Account</span>
    </span>
  </span>
  <a href="javascript:void(0);" class="nds-pill__action" title="Full pill label verbiage mirrored here">
    <span class="nds-pill__label">Pill Label</span>
  </a>
  <button class="nds-button nds-button_icon nds-button_icon nds-pill__remove" title="Remove">
    <svg class="nds-button__icon" aria-hidden="true">
      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
    </svg>
    <span class="nds-assistive-text">Remove</span>
  </button>
</span>`);
  })
  .add('Avatar (examples)', () => {
    return withExample(`<span class="nds-pill nds-pill_link">
  <span class="nds-pill__icon_container">
    <span class="nds-avatar nds-avatar_circle" title="User avatar">
      <img alt="Person name" src="/assets/images/avatar2.jpg" title="User avatar">
    </span>
  </span>
  <a href="javascript:void(0);" class="nds-pill__action" title="Full pill label verbiage mirrored here">
    <span class="nds-pill__label">Pill Label</span>
  </a>
  <button class="nds-button nds-button_icon nds-button_icon nds-pill__remove" title="Remove">
    <svg class="nds-button__icon" aria-hidden="true">
      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
    </svg>
    <span class="nds-assistive-text">Remove</span>
  </button>
</span>`);
  })
  .add('Truncated (examples)', () => {
    return withExample(`<div class="demo-only" style="width: 220px;">
  <div class="nds-pill_container">
    <span class="nds-pill nds-pill_link">
      <a href="javascript:void(0);" class="nds-pill__action" title="Pill label that is longer than the area that contains it">
        <span class="nds-pill__label">Pill label that is longer than the area that contains it</span>
      </a>
      <button class="nds-button nds-button_icon nds-button_icon nds-pill__remove" title="Remove">
        <svg class="nds-button__icon" aria-hidden="true">
          <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
        </svg>
        <span class="nds-assistive-text">Remove</span>
      </button>
    </span>
  </div>
</div>`);
  })
  .add('Container (examples)', () => {
    return withExample(`<div class="nds-pill_container">
  <span class="nds-pill nds-pill_link">
    <a href="javascript:void(0);" class="nds-pill__action" title="Full pill label verbiage mirrored here">
      <span class="nds-pill__label">Pill Label</span>
    </a>
    <button class="nds-button nds-button_icon nds-button_icon nds-pill__remove" title="Remove">
      <svg class="nds-button__icon" aria-hidden="true">
        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
      </svg>
      <span class="nds-assistive-text">Remove</span>
    </button>
  </span>
  <span class="nds-pill nds-pill_link">
    <a href="javascript:void(0);" class="nds-pill__action" title="Full pill label verbiage mirrored here">
      <span class="nds-pill__label">Pill Label</span>
    </a>
    <button class="nds-button nds-button_icon nds-button_icon nds-pill__remove" title="Remove">
      <svg class="nds-button__icon" aria-hidden="true">
        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
      </svg>
      <span class="nds-assistive-text">Remove</span>
    </button>
  </span>
  <span class="nds-pill nds-pill_link">
    <a href="javascript:void(0);" class="nds-pill__action" title="Full pill label verbiage mirrored here">
      <span class="nds-pill__label">Pill Label</span>
    </a>
    <button class="nds-button nds-button_icon nds-button_icon nds-pill__remove" title="Remove">
      <svg class="nds-button__icon" aria-hidden="true">
        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
      </svg>
      <span class="nds-assistive-text">Remove</span>
    </button>
  </span>
</div>`);
  })
  .add('Error (examples)', () => {
    return withExample(`<span class="nds-pill nds-pill_link nds-has-error">
  <span class="nds-pill__icon_container">
    <span class="nds-icon_container" title="Error">
      <svg class="nds-icon nds-icon-text-error" aria-hidden="true">
        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#warning"></use>
      </svg>
      <span class="nds-assistive-text">Warning</span>
    </span>
  </span>
  <a href="javascript:void(0);" class="nds-pill__action" title="Full pill label verbiage mirrored here">
    <span class="nds-pill__label">Pill Label</span>
  </a>
  <button class="nds-button nds-button_icon nds-button_icon nds-pill__remove" title="Remove">
    <svg class="nds-button__icon" aria-hidden="true">
      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
    </svg>
    <span class="nds-assistive-text">Remove</span>
  </button>
</span>`);
  });
