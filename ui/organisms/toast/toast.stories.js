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
    return withExample(`<div class="demo-only" style="height: 4rem;">
  <div class="nds-notify_container nds-is-relative">
    <div class="nds-notify nds-notify_toast nds-theme_info" role="alert">
      <span class="nds-assistive-text">info</span>
      <span class="nds-icon_container nds-icon-utility-info nds-m-right_small nds-no-flex nds-align-top" title="Description of icon when needed">
        <svg class="nds-icon nds-icon_small" aria-hidden="true">
          <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#info"></use>
        </svg>
      </span>
      <div class="nds-notify__content">
        <h2 class="nds-text-heading_small">
          <!-- react-text: 11 -->26 potential duplicate leads were found.
          <!-- /react-text -->
          <!-- react-text: 12 -->
          <!-- /react-text -->
          <a href="javascript:void(0);">Select Leads to Merge</a>
        </h2>
      </div>
      <button class="nds-button nds-button_icon nds-notify__close nds-button_icon-inverse" title="Close">
        <svg class="nds-button__icon nds-button__icon_large" aria-hidden="true">
          <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
        </svg>
        <span class="nds-assistive-text">Close</span>
      </button>
    </div>
  </div>
</div>`);
  })
  .add('Success (states)', () => {
    return withExample(`<div class="demo-only" style="height: 4rem;">
  <div class="nds-notify_container nds-is-relative">
    <div class="nds-notify nds-notify_toast nds-theme_success" role="alert">
      <span class="nds-assistive-text">success</span>
      <span class="nds-icon_container nds-icon-utility-success nds-m-right_small nds-no-flex nds-align-top" title="Description of icon when needed">
        <svg class="nds-icon nds-icon_small" aria-hidden="true">
          <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#success"></use>
        </svg>
      </span>
      <div class="nds-notify__content">
        <h2 class="nds-text-heading_small ">
          <!-- react-text: 11 -->Account
          <!-- /react-text -->
          <a href="javascript:void(0);">ACME - 100</a>
          <!-- react-text: 13 -->widgets was created.
          <!-- /react-text -->
        </h2>
      </div>
      <button class="nds-button nds-button_icon nds-notify__close nds-button_icon-inverse" title="Close">
        <svg class="nds-button__icon nds-button__icon_large" aria-hidden="true">
          <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
        </svg>
        <span class="nds-assistive-text">Close</span>
      </button>
    </div>
  </div>
</div>`);
  })
  .add('Warning (states)', () => {
    return withExample(`<div class="demo-only" style="height: 4rem;">
  <div class="nds-notify_container nds-is-relative">
    <div class="nds-notify nds-notify_toast nds-theme_warning" role="alert">
      <span class="nds-assistive-text">warning</span>
      <span class="nds-icon_container nds-icon-utility-warning nds-m-right_small nds-no-flex nds-align-top" title="Description of icon when needed">
        <svg class="nds-icon nds-icon_small" aria-hidden="true">
          <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#warning"></use>
        </svg>
      </span>
      <div class="nds-notify__content">
        <h2 class="nds-text-heading_small ">Can’t share file “report-q3.pdf” with the selected users.</h2>
      </div>
      <button class="nds-button nds-button_icon nds-notify__close nds-button_icon-inverse" title="Close">
        <svg class="nds-button__icon nds-button__icon_large" aria-hidden="true">
          <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
        </svg>
        <span class="nds-assistive-text">Close</span>
      </button>
    </div>
  </div>
</div>`);
  })
  .add('Error (states)', () => {
    return withExample(`<div class="demo-only" style="height: 4rem;">
  <div class="nds-notify_container nds-is-relative">
    <div class="nds-notify nds-notify_toast nds-theme_error" role="alert">
      <span class="nds-assistive-text">error</span>
      <span class="nds-icon_container nds-icon-utility-error nds-m-right_small nds-no-flex nds-align-top" title="Description of icon when needed">
        <svg class="nds-icon nds-icon_small" aria-hidden="true">
          <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#error"></use>
        </svg>
      </span>
      <div class="nds-notify__content">
        <h2 class="nds-text-heading_small ">Can’t save lead “Sally Wong” because another lead has the same name.</h2>
      </div>
      <button class="nds-button nds-button_icon nds-notify__close nds-button_icon-inverse" title="Close">
        <svg class="nds-button__icon nds-button__icon_large" aria-hidden="true">
          <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
        </svg>
        <span class="nds-assistive-text">Close</span>
      </button>
    </div>
  </div>
</div>`);
  })
  .add('Error With Details (states)', () => {
    return withExample(`<div class="demo-only" style="height: 4rem;">
  <div class="nds-notify_container nds-is-relative">
    <div class="nds-notify nds-notify_toast nds-theme_error" role="alert">
      <span class="nds-assistive-text">error</span>
      <span class="nds-icon_container nds-icon-utility-error nds-m-right_small nds-no-flex nds-align-top" title="Description of icon when needed">
        <svg class="nds-icon nds-icon_small" aria-hidden="true">
          <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#error"></use>
        </svg>
      </span>
      <div class="nds-notify__content">
        <h2 class="nds-text-heading_small">You've encountered some errors when trying to save edits to Samuel Smith.</h2>
        <p>Here's some detail of what happened, being very descriptive and transparent.</p>
      </div>
      <button class="nds-button nds-button_icon nds-notify__close nds-button_icon-inverse" title="Close">
        <svg class="nds-button__icon nds-button__icon_large" aria-hidden="true">
          <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
        </svg>
        <span class="nds-assistive-text">Close</span>
      </button>
    </div>
  </div>
</div>`);
  })
  .add('Small (examples)', () => {
    return withExample(`<div class="demo-only" style="height: 4rem; width: 25rem;">
  <div class="nds-region_narrow nds-is-relative">
    <div class="nds-notify_container nds-is-absolute">
      <div class="nds-notify nds-notify_toast nds-theme_info" role="alert">
        <span class="nds-assistive-text">info</span>
        <div class="nds-notify__content">
          <h2 class="nds-text-heading_small">26 potential duplicate leads were found.</h2>
        </div>
        <button class="nds-button nds-button_icon nds-notify__close nds-button_icon-inverse" title="Close">
          <svg class="nds-button__icon nds-button__icon_large" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
          </svg>
          <span class="nds-assistive-text">Close</span>
        </button>
      </div>
    </div>
  </div>
</div>`);
  });
