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
    return withExample(`<div class="nds-page-header">
  <div class="nds-grid">
    <div class="nds-col nds-has-flexi-truncate">
      <div class="nds-media nds-no-space nds-grow">
        <div class="nds-media__figure">
          <span class="nds-icon_container nds-icon-standard-opportunity" title="Description of icon when needed">
            <svg class="nds-icon" aria-hidden="true">
              <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#opportunity"></use>
            </svg>
          </span>
        </div>
        <div class="nds-media__body">
          <nav>
            <ol class="nds-breadcrumb nds-line-height_reset">
              <li class="nds-breadcrumb__item">
                <span>Opportunities</span>
              </li>
            </ol>
          </nav>
          <h1 class="nds-page-header__title nds-m-right_small nds-align-middle nds-truncate" title="Acme - 1,200 Widgets">Acme - 1,200 Widgets</h1>
        </div>
      </div>
    </div>
    <div class="nds-col nds-no-flex nds-grid nds-align-top">
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
      <div class="nds-button-group" role="group">
        <button class="nds-button nds-button_neutral">Edit</button>
        <button class="nds-button nds-button_neutral">Delete</button>
        <button class="nds-button nds-button_neutral">Clone</button>
        <div class="nds-dropdown-trigger nds-dropdown-trigger_click nds-button_last" aria-expanded="false">
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
  <ul class="nds-grid nds-page-header__detail-row">
    <li class="nds-page-header__detail-block">
      <p class="nds-text-title nds-truncate nds-m-bottom_xx-small" title="Field 1">Field 1</p>
      <p class="nds-text-body_regular nds-truncate" title="Description that demonstrates truncation with a long text field">Description that demonstrates truncation with a long text field.</p>
    </li>
    <li class="nds-page-header__detail-block">
      <p class="nds-text-title nds-truncate nds-m-bottom_xx-small" title="Field2 (3)">
        Field 2 (3)

        <button class="nds-button nds-button_icon nds-button_icon" aria-haspopup="true" title="More Actions">
          <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
          </svg>
          <span class="nds-assistive-text">More Actions</span>
        </button>
      </p>
      <p class="nds-text-body_regular">Multiple Values</p>
    </li>
    <li class="nds-page-header__detail-block">
      <p class="nds-text-title nds-truncate nds-m-bottom_xx-small" title="Field 3">Field 3</p>
      <a href="javascript:void(0);">Hyperlink</a>
    </li>
    <li class="nds-page-header__detail-block">
      <p class="nds-text-title nds-truncate nds-m-bottom_xx-small" title="Field 4">Field 4</p>
      <p title="Description (2-line truncation—must use JS to truncate).">Description (2-line truncati...</p>
    </li>
  </ul>
</div>`);
  });
