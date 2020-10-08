import { storiesOf } from '@storybook/html';
import base from 'paths.macro';
import scss from './base/_index.scss';
import notes from './doc.md';
import {
  withExample,
  withDocs,
  commentToHTML
} from '../../../scripts/storybook';

storiesOf(`${base}`, module)
  .addDecorator(withDocs(notes))
  .addDecorator(commentToHTML(scss))
  .add('Default', () => {
    return withExample(`<div class="nds-notify nds-notify_alert nds-theme_alert-texture nds-theme_info" role="alert">
      <span class="nds-assistive-text">info</span>
      <span class="nds-icon_container nds-icon-utility-user nds-m-right_x-small" title="Description of icon when needed">
        <svg class="nds-icon nds-icon_x-small" aria-hidden="true">
          <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#user"></use>
        </svg>
      </span>
      <h2>
        Logged in as John Smith (johnsmith@acme.com).
        <a href="javascript:void(0);">Log out</a>
      </h2>
      <button class="nds-button nds-button_icon nds-notify__close nds-button_icon-inverse" title="Close">
        <svg class="nds-button__icon" aria-hidden="true">
          <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
        </svg>
        <span class="nds-assistive-text">Close</span>
      </button>
    </div>`);
  })
  .add('Warning', () => {
    return withExample(`<div class="nds-notify nds-notify_alert nds-theme_alert-texture nds-theme_warning" role="alert">
      <span class="nds-assistive-text">warning</span>
      <span class="nds-icon_container nds-icon-utility-warning nds-m-right_x-small" title="Description of icon when needed">
        <svg class="nds-icon nds-icon_x-small" aria-hidden="true">
          <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#warning"></use>
        </svg>
      </span>
      <h2>
        Your browser is outdated. Your experience may be degraded.
        <a href="javascript:void(0);">More Information</a>
      </h2>
      <button class="nds-button nds-button_icon nds-notify__close nds-button_icon-inverse" title="Close">
        <svg class="nds-button__icon" aria-hidden="true">
          <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
        </svg>
        <span class="nds-assistive-text">Close</span>
      </button>
    </div>`);
  })
  .add('Error', () => {
    return withExample(`<div class="nds-notify nds-notify_alert nds-theme_alert-texture nds-theme_error" role="alert">
    <span class="nds-assistive-text">error</span>
    <span class="nds-icon_container nds-icon-utility-ban nds-m-right_x-small" title="Description of icon when needed">
      <svg class="nds-icon nds-icon_x-small" aria-hidden="true">
        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#ban"></use>
      </svg>
    </span>
    <h2>
      Your browser is currently not supported. Your experience may be degraded.
      <a href="javascript:void(0);">More Information</a>
    </h2>
    <button class="nds-button nds-button_icon nds-notify__close nds-button_icon-inverse" title="Close">
      <svg class="nds-button__icon" aria-hidden="true">
        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
      </svg>
      <span class="nds-assistive-text">Close</span>
    </button>
  </div>`);
  })
  .add('Offline', () => {
    return withExample(`<div class="nds-notify nds-notify_alert nds-theme_alert-texture nds-theme_offline" role="alert">
    <span class="nds-assistive-text">offline</span>
    <span class="nds-icon_container nds-icon-utility-offline nds-m-right_x-small" title="Description of icon when needed">
      <svg class="nds-icon nds-icon_x-small" aria-hidden="true">
        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#offline"></use>
      </svg>
    </span>
    <h2>
      You are in offline mode.
      <a href="javascript:void(0);">More Information</a>
    </h2>
    <button class="nds-button nds-button_icon nds-notify__close nds-button_icon-inverse" title="Close">
      <svg class="nds-button__icon" aria-hidden="true">
        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
      </svg>
      <span class="nds-assistive-text">Close</span>
    </button>
  </div>`);
  });
