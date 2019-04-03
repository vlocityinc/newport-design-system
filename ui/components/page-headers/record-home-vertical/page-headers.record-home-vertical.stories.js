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
    return withExample(`<div class="demo-only" style="width: 300px;">
  <div class="nds-page-header nds-page-header_vertical">
    <div class="nds-grid nds-grid_vertical">
      <div>
        <div class="nds-media nds-no-space nds-has-divider_bottom-space nds-media_center">
          <div class="nds-media__figure">
            <div class="nds-icon_container nds-icon-standard-lead">
              <svg class="nds-icon" aria-hidden="true">
                <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#lead"></use>
              </svg>
              <span class="nds-assistive-text">Lead</span>
            </div>
          </div>
          <div class="nds-media__body">
            <h1 class="nds-page-header__title nds-align-middle">Record Title</h1>
          </div>
        </div>
      </div>
      <div class="nds-has-divider_bottom-space">
        <button class="nds-button nds-button_stateful nds-button_neutral nds-not-selected" aria-live="assertive">
          <span class="nds-text-not-selected">
            <svg class="nds-button__icon_stateful nds-button__icon_left" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#add"></use>
            </svg>
            Follow

          </span>
          <span class="nds-text-selected">
            <svg class="nds-button__icon_stateful nds-button__icon_left" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
            </svg>
            Following

          </span>
          <span class="nds-text-selected-focus">
            <svg class="nds-button__icon_stateful nds-button__icon_left" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
            </svg>
            Unfollow

          </span>
        </button>
        <div class="nds-button-group nds-m-left_none nds-m-top_x-small" role="group">
          <button class="nds-button nds-button_neutral">Convert</button>
          <button class="nds-button nds-button_neutral">Clone</button>
          <button class="nds-button nds-button_neutral">Edit</button>
          <div class="nds-dropdown-trigger nds-dropdown-trigger_click nds-button_last">
            <button class="nds-button nds-button_icon nds-button_icon-border-filled" aria-haspopup="true" title="More Actions">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
              </svg>
              <span class="nds-assistive-text">More Actions</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <ul class="nds-list_vertical-space-medium nds-m-left_xx-small">
      <li class="nds-item">
        <div class="nds-text-title nds-m-bottom_xx-small">Field 1</div>
        <div class="nds-text-body_regular" title="Description that demonstrates truncation with a long text field">Description that demonstrates a long text field and will eventually wrap.</div>
      </li>
      <li class="nds-item">
        <div class="nds-text-title nds-m-bottom_xx-small">Field 2</div>
        <div class="nds-text-body_regular" title="Hyperlink">
          <a href="javascript:void(0);">Hyperlink</a>
        </div>
      </li>
      <li class="nds-item">
        <div class="nds-text-title nds-m-bottom_xx-small">Field 3</div>
        <div class="nds-truncate" title="Description">Description</div>
      </li>
      <li class="nds-item">
        <div class="nds-text-title nds-m-bottom_xx-small">
          <button class="nds-button nds-text-link_reset" aria-haspopup="true">
            Field 4 (3)

            <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
            </svg>
          </button>
        </div>
        <div class="nds-text-body_regular">
          <div>1 Market St</div>
          <div>San Francisco, CA 94105</div>
        </div>
      </li>
      <li class="nds-item">
        <div class="nds-text-title nds-m-bottom_xx-small">Field 5</div>
        <div class="nds-text-body_regular" title="Description">Description</div>
      </li>
      <li class="nds-item">
        <div class="nds-text-title nds-m-bottom_xx-small">Field 6</div>
        <div class="nds-text-body_regular" title="Description">Description</div>
      </li>
      <li class="nds-item">
        <div class="nds-text-title nds-truncate nds-m-bottom_xx-small" title="Field 7">Field 7</div>
        <div class="nds-text-body_regular" title="Description">Description</div>
      </li>
    </ul>
  </div>
</div>`);
  });
