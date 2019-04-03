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
    return withExample(`<div class="nds-tabs_default nds-sub-tabs">
  <ul class="nds-tabs_default__nav" role="tablist">
    <li class="nds-tabs_default__item nds-sub-tabs__item nds-grid nds-grid_vertical-align-center nds-active" role="presentation">
      <a aria-controls="subtab-tabpanel-01" aria-selected="true" class="nds-tabs_default__link nds-p-horizontal_xx-small" href="javascript:void(0);" id="subtab-tabitem-01" role="tab" tabindex="0" title="00071938">
        <div class="nds-icon_container" title="Case">
          <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
            <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#case"></use>
          </svg>
          <span class="nds-assistive-text">
            Case

            :

          </span>
        </div>
        <span class="nds-truncate" title="00071938">00071938</span>
      </a>
      <div class="nds-col_bump-left nds-p-left_none nds-p-right_none">
        <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" tabindex="0" title="Close 00071938">
          <svg class="nds-button__icon" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
          </svg>
          <span class="nds-assistive-text">Close 00071938</span>
        </button>
      </div>
    </li>
    <li class="nds-tabs_default__item nds-sub-tabs__item nds-grid nds-grid_vertical-align-center" role="presentation">
      <a aria-controls="subtab-tabpanel-02" aria-selected="false" class="nds-tabs_default__link nds-p-horizontal_xx-small" href="javascript:void(0);" id="subtab-tabitem-02" role="tab" tabindex="-1" title="Chat - Customer">
        <div class="nds-icon_container" title="Live Chat">
          <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
            <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#live_chat"></use>
          </svg>
          <span class="nds-assistive-text">
            Live Chat

            :

          </span>
        </div>
        <span class="nds-truncate" title="Chat - Customer">Chat - Customer</span>
      </a>
      <div class="nds-col_bump-left nds-p-left_none nds-p-right_none">
        <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" tabindex="-1" title="Close Chat - Customer">
          <svg class="nds-button__icon" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
          </svg>
          <span class="nds-assistive-text">Close Chat - Customer</span>
        </button>
      </div>
    </li>
  </ul>
  <div class="nds-tabs_default__content nds-show" id="subtab-tabpanel-01" role="tabpanel" aria-labelledby="subtab-tabitem-01">Item One Content</div>
  <div class="nds-tabs_default__content nds-hide" id="subtab-tabpanel-02" role="tabpanel" aria-labelledby="subtab-tabitem-02">Item Two Content</div>
</div>`);
  })
  .add('Subtabs Has Focus (states)', () => {
    return withExample(`<div class="nds-tabs_default nds-sub-tabs">
  <ul class="nds-tabs_default__nav" role="tablist">
    <li class="nds-tabs_default__item nds-sub-tabs__item nds-grid nds-grid_vertical-align-center nds-has-focus nds-active" role="presentation">
      <a aria-controls="subtab-tabpanel-01" aria-selected="true" class="nds-tabs_default__link nds-p-horizontal_xx-small" href="javascript:void(0);" id="subtab-tabitem-01" role="tab" tabindex="0" title="00071938">
        <div class="nds-icon_container" title="Case">
          <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
            <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#case"></use>
          </svg>
          <span class="nds-assistive-text">
            Case

            :

          </span>
        </div>
        <span class="nds-truncate" title="00071938">00071938</span>
      </a>
      <div class="nds-col_bump-left nds-p-left_none nds-p-right_none">
        <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" tabindex="0" title="Close 00071938">
          <svg class="nds-button__icon" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
          </svg>
          <span class="nds-assistive-text">Close 00071938</span>
        </button>
      </div>
    </li>
    <li class="nds-tabs_default__item nds-sub-tabs__item nds-grid nds-grid_vertical-align-center" role="presentation">
      <a aria-controls="subtab-tabpanel-02" aria-selected="false" class="nds-tabs_default__link nds-p-horizontal_xx-small" href="javascript:void(0);" id="subtab-tabitem-02" role="tab" tabindex="-1" title="Chat - Customer">
        <div class="nds-icon_container" title="Live Chat">
          <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
            <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#live_chat"></use>
          </svg>
          <span class="nds-assistive-text">
            Live Chat

            :

          </span>
        </div>
        <span class="nds-truncate" title="Chat - Customer">Chat - Customer</span>
      </a>
      <div class="nds-col_bump-left nds-p-left_none nds-p-right_none">
        <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" tabindex="-1" title="Close Chat - Customer">
          <svg class="nds-button__icon" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
          </svg>
          <span class="nds-assistive-text">Close Chat - Customer</span>
        </button>
      </div>
    </li>
  </ul>
  <div class="nds-tabs_default__content nds-show" id="subtab-tabpanel-01" role="tabpanel" aria-labelledby="subtab-tabitem-01">Item One Content</div>
  <div class="nds-tabs_default__content nds-hide" id="subtab-tabpanel-02" role="tabpanel" aria-labelledby="subtab-tabitem-02">Item Two Content</div>
</div>`);
  })
  .add('Subtabs Unsaved (states)', () => {
    return withExample(`<div class="nds-tabs_default nds-sub-tabs">
  <ul class="nds-tabs_default__nav" role="tablist">
    <li class="nds-tabs_default__item nds-sub-tabs__item nds-grid nds-grid_vertical-align-center nds-active" role="presentation">
      <a aria-controls="subtab-tabpanel-01" aria-selected="true" class="nds-tabs_default__link nds-p-horizontal_xx-small" href="javascript:void(0);" id="subtab-tabitem-01" role="tab" tabindex="0" title="00071938">
        <abbr class="nds-indicator_unsaved" title="Tab Not Saved" aria-label="Tab Not Saved">*</abbr>
        <div class="nds-icon_container" title="Case">
          <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
            <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#case"></use>
          </svg>
          <span class="nds-assistive-text">
            Case

            :

          </span>
        </div>
        <span class="nds-truncate" title="00071938">00071938</span>
      </a>
      <div class="nds-col_bump-left nds-p-left_none nds-p-right_none">
        <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" tabindex="0" title="Close 00071938">
          <svg class="nds-button__icon" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
          </svg>
          <span class="nds-assistive-text">Close 00071938</span>
        </button>
      </div>
    </li>
    <li class="nds-tabs_default__item nds-sub-tabs__item nds-grid nds-grid_vertical-align-center" role="presentation">
      <a aria-controls="subtab-tabpanel-02" aria-selected="false" class="nds-tabs_default__link nds-p-horizontal_xx-small" href="javascript:void(0);" id="subtab-tabitem-02" role="tab" tabindex="-1" title="Chat - Customer">
        <div class="nds-icon_container" title="Live Chat">
          <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
            <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#live_chat"></use>
          </svg>
          <span class="nds-assistive-text">
            Live Chat

            :

          </span>
        </div>
        <span class="nds-truncate" title="Chat - Customer">Chat - Customer</span>
      </a>
      <div class="nds-col_bump-left nds-p-left_none nds-p-right_none">
        <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" tabindex="-1" title="Close Chat - Customer">
          <svg class="nds-button__icon" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
          </svg>
          <span class="nds-assistive-text">Close Chat - Customer</span>
        </button>
      </div>
    </li>
  </ul>
  <div class="nds-tabs_default__content nds-show" id="subtab-tabpanel-01" role="tabpanel" aria-labelledby="subtab-tabitem-01">Item One Content</div>
  <div class="nds-tabs_default__content nds-hide" id="subtab-tabpanel-02" role="tabpanel" aria-labelledby="subtab-tabitem-02">Item Two Content</div>
</div>`);
  })
  .add('Subtabs Borders (states)', () => {
    return withExample(`<div class="nds-tabs_default nds-sub-tabs">
  <ul class="nds-tabs_default__nav" role="tablist">
    <li class="nds-tabs_default__item nds-sub-tabs__item nds-grid nds-grid_vertical-align-center nds-active nds-border_right nds-border_left" role="presentation">
      <a aria-controls="subtab-tabpanel-01" aria-selected="true" class="nds-tabs_default__link nds-p-horizontal_xx-small" href="javascript:void(0);" id="subtab-tabitem-01" role="tab" tabindex="0" title="00071938">
        <div class="nds-icon_container" title="Case">
          <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
            <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#case"></use>
          </svg>
          <span class="nds-assistive-text">
            Case

            :

          </span>
        </div>
        <span class="nds-truncate" title="00071938">00071938</span>
      </a>
      <div class="nds-col_bump-left nds-p-left_none nds-p-right_none">
        <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" tabindex="0" title="Close 00071938">
          <svg class="nds-button__icon" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
          </svg>
          <span class="nds-assistive-text">Close 00071938</span>
        </button>
      </div>
    </li>
    <li class="nds-tabs_default__item nds-sub-tabs__item nds-grid nds-grid_vertical-align-center nds-border_right" role="presentation">
      <a aria-controls="subtab-tabpanel-02" aria-selected="false" class="nds-tabs_default__link nds-p-horizontal_xx-small" href="javascript:void(0);" id="subtab-tabitem-02" role="tab" tabindex="-1" title="Chat - Customer">
        <div class="nds-icon_container" title="Live Chat">
          <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
            <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#live_chat"></use>
          </svg>
          <span class="nds-assistive-text">
            Live Chat

            :

          </span>
        </div>
        <span class="nds-truncate" title="Chat - Customer">Chat - Customer</span>
      </a>
      <div class="nds-col_bump-left nds-p-left_none nds-p-right_none">
        <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" tabindex="-1" title="Close Chat - Customer">
          <svg class="nds-button__icon" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
          </svg>
          <span class="nds-assistive-text">Close Chat - Customer</span>
        </button>
      </div>
    </li>
  </ul>
  <div class="nds-tabs_default__content nds-show" id="subtab-tabpanel-01" role="tabpanel" aria-labelledby="subtab-tabitem-01">Item One Content</div>
  <div class="nds-tabs_default__content nds-hide" id="subtab-tabpanel-02" role="tabpanel" aria-labelledby="subtab-tabitem-02">Item Two Content</div>
</div>`);
  })
  .add('Subtabs Menu (states)', () => {
    return withExample(`<div class="nds-tabs_default nds-sub-tabs">
  <ul class="nds-tabs_default__nav" role="tablist">
    <li class="nds-tabs_default__item nds-sub-tabs__item nds-grid nds-grid_vertical-align-center nds-active" role="presentation">
      <a aria-controls="subtab-tabpanel-01" aria-selected="true" class="nds-tabs_default__link nds-p-horizontal_xx-small" href="javascript:void(0);" id="subtab-tabitem-01" role="tab" tabindex="0" title="00071938">
        <div class="nds-icon_container" title="Case">
          <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
            <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#case"></use>
          </svg>
          <span class="nds-assistive-text">
            Case

            :

          </span>
        </div>
        <span class="nds-truncate" title="00071938">00071938</span>
      </a>
      <div class="nds-dropdown-trigger nds-dropdown-trigger_click nds-p-left_none nds-p-right_none">
        <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" tabindex="0" title="Actions for 00071938">
          <svg class="nds-button__icon" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
          </svg>
          <span class="nds-assistive-text">Actions for 00071938</span>
        </button>
      </div>
      <div class="nds-col_bump-left nds-p-left_none nds-p-right_none">
        <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" tabindex="0" title="Close 00071938">
          <svg class="nds-button__icon" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
          </svg>
          <span class="nds-assistive-text">Close 00071938</span>
        </button>
      </div>
    </li>
    <li class="nds-tabs_default__item nds-sub-tabs__item nds-grid nds-grid_vertical-align-center" role="presentation">
      <a aria-controls="subtab-tabpanel-02" aria-selected="false" class="nds-tabs_default__link nds-p-horizontal_xx-small" href="javascript:void(0);" id="subtab-tabitem-02" role="tab" tabindex="-1" title="Chat - Customer">
        <div class="nds-icon_container" title="Live Chat">
          <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
            <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#live_chat"></use>
          </svg>
          <span class="nds-assistive-text">
            Live Chat

            :

          </span>
        </div>
        <span class="nds-truncate" title="Chat - Customer">Chat - Customer</span>
      </a>
      <div class="nds-dropdown-trigger nds-dropdown-trigger_click nds-p-left_none nds-p-right_none">
        <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" tabindex="-1" title="Actions for Chat - Customer">
          <svg class="nds-button__icon" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
          </svg>
          <span class="nds-assistive-text">Actions for Chat - Customer</span>
        </button>
      </div>
      <div class="nds-col_bump-left nds-p-left_none nds-p-right_none">
        <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" tabindex="-1" title="Close Chat - Customer">
          <svg class="nds-button__icon" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
          </svg>
          <span class="nds-assistive-text">Close Chat - Customer</span>
        </button>
      </div>
    </li>
  </ul>
  <div class="nds-tabs_default__content nds-show" id="subtab-tabpanel-01" role="tabpanel" aria-labelledby="subtab-tabitem-01">Item One Content</div>
  <div class="nds-tabs_default__content nds-hide" id="subtab-tabpanel-02" role="tabpanel" aria-labelledby="subtab-tabitem-02">Item Two Content</div>
</div>`);
  })
  .add('Subtabs Notification (states)', () => {
    return withExample(`<div class="nds-tabs_default nds-sub-tabs">
  <ul class="nds-tabs_default__nav" role="tablist">
    <li class="nds-tabs_default__item nds-sub-tabs__item nds-grid nds-grid_vertical-align-center nds-active" role="presentation">
      <a aria-controls="subtab-tabpanel-01" aria-selected="true" class="nds-tabs_default__link nds-p-horizontal_xx-small" href="javascript:void(0);" id="subtab-tabitem-01" role="tab" tabindex="0" title="00071938">
        <div class="nds-icon_container" title="Case">
          <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
            <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#case"></use>
          </svg>
          <span class="nds-assistive-text">
            Case

            :

          </span>
        </div>
        <span class="nds-truncate" title="00071938">00071938</span>
      </a>
      <div class="nds-col_bump-left nds-p-left_none nds-p-right_none">
        <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" tabindex="0" title="Close 00071938">
          <svg class="nds-button__icon" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
          </svg>
          <span class="nds-assistive-text">Close 00071938</span>
        </button>
      </div>
    </li>
    <li class="nds-tabs_default__item nds-sub-tabs__item nds-grid nds-grid_vertical-align-center nds-has-notification" role="presentation">
      <a aria-controls="subtab-tabpanel-02" aria-selected="false" class="nds-tabs_default__link nds-p-horizontal_xx-small" href="javascript:void(0);" id="subtab-tabitem-02" role="tab" tabindex="-1" title="Chat - Customer">
        <span aria-label="New Activity" class="nds-indicator_unread" role="alert" title="New Activity">
          <span class="nds-assistive-text">
            New activity in Tab:

            Chat - Customer

          </span>
        </span>
        <div class="nds-icon_container" title="Live Chat">
          <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
            <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#live_chat"></use>
          </svg>
          <span class="nds-assistive-text">
            Live Chat

            :

          </span>
        </div>
        <span class="nds-truncate" title="Chat - Customer">Chat - Customer</span>
      </a>
      <div class="nds-col_bump-left nds-p-left_none nds-p-right_none">
        <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" tabindex="-1" title="Close Chat - Customer">
          <svg class="nds-button__icon" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
          </svg>
          <span class="nds-assistive-text">Close Chat - Customer</span>
        </button>
      </div>
    </li>
  </ul>
  <div class="nds-tabs_default__content nds-show" id="subtab-tabpanel-01" role="tabpanel" aria-labelledby="subtab-tabitem-01">Item One Content</div>
  <div class="nds-tabs_default__content nds-hide" id="subtab-tabpanel-02" role="tabpanel" aria-labelledby="subtab-tabitem-02">Item Two Content</div>
</div>`);
  });
