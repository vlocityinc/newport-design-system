import { storiesOf } from '@storybook/html';
import base from 'paths.macro';
import notes from './doc.md';
import scss from './base/_index.scss';
import utilityPanelScss from './utility-panel/_index.scss';
import {
  withExample,
  withDocs,
  commentToHTML
} from '../../../scripts/storybook';

storiesOf(`${base}`, module)
  .addDecorator(withDocs(notes))
  .addDecorator(commentToHTML(scss + utilityPanelScss))
  .add('Default (default)', () => {
    return withExample(`<div style="height: 540px;">
  <footer class="nds-utility-bar_container" aria-label="Utility Bar">
    <h2 class="nds-assistive-text">Utility Bar</h2>
    <ul class="nds-utility-bar">
      <li class="nds-utility-bar__item">
        <button class="nds-button nds-utility-bar__action" aria-pressed="false">
          <svg class="nds-button__icon nds-button__icon_left" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#call"></use>
          </svg>
          <span class="nds-utility-bar__text">Call</span>
        </button>
      </li>
      <li class="nds-utility-bar__item">
        <button class="nds-button nds-utility-bar__action" aria-pressed="false">
          <svg class="nds-button__icon nds-button__icon_left" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#clock"></use>
          </svg>
          <span class="nds-utility-bar__text">History</span>
        </button>
      </li>
      <li class="nds-utility-bar__item">
        <button class="nds-button nds-utility-bar__action" aria-pressed="false">
          <svg class="nds-button__icon nds-button__icon_left" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#note"></use>
          </svg>
          <span class="nds-utility-bar__text">Notes</span>
        </button>
      </li>
      <li class="nds-utility-bar__item">
        <button class="nds-button nds-utility-bar__action" aria-pressed="false">
          <svg class="nds-button__icon nds-button__icon_left" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#omni_channel"></use>
          </svg>
          <span class="nds-utility-bar__text">
            <span class="nds-m-bottom_xxx-small">Online</span>
            <span>Omni-Channel</span>
          </span>
        </button>
      </li>
    </ul>
    <section class="nds-utility-panel nds-grid nds-grid_vertical" role="dialog" aria-labelledby="panel-heading-01">
      <header class="nds-utility-panel__header nds-grid nds-shrink-none">
        <div class="nds-media nds-media_center">
          <div class="nds-media__figure nds-m-right_x-small">
            <span class="nds-icon_container">
              <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#call"></use>
              </svg>
            </span>
          </div>
          <div class="nds-media__body">
            <h2 id="panel-heading-01">Call</h2>
          </div>
        </div>
        <div class="nds-col_bump-left nds-shrink-none">
          <button class="nds-button nds-button_icon nds-button_icon" title="Close Panel">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#minimize_window"></use>
            </svg>
            <span class="nds-assistive-text">Close Panel</span>
          </button>
        </div>
      </header>
      <div class="nds-utility-panel__body">
        <div class="nds-align_absolute-center">Utility Panel Body</div>
      </div>
    </section>
  </footer>
</div>`);
  })
  .add('Open (states)', () => {
    return withExample(`<div style="height: 540px;">
  <footer class="nds-utility-bar_container" aria-label="Utility Bar">
    <h2 class="nds-assistive-text">Utility Bar</h2>
    <ul class="nds-utility-bar">
      <li class="nds-utility-bar__item">
        <button class="nds-button nds-utility-bar__action nds-is-active" aria-pressed="true">
          <svg class="nds-button__icon nds-button__icon_left" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#call"></use>
          </svg>
          <span class="nds-utility-bar__text">Call</span>
        </button>
      </li>
      <li class="nds-utility-bar__item">
        <button class="nds-button nds-utility-bar__action" aria-pressed="false">
          <svg class="nds-button__icon nds-button__icon_left" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#clock"></use>
          </svg>
          <span class="nds-utility-bar__text">History</span>
        </button>
      </li>
      <li class="nds-utility-bar__item">
        <button class="nds-button nds-utility-bar__action" aria-pressed="false">
          <svg class="nds-button__icon nds-button__icon_left" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#note"></use>
          </svg>
          <span class="nds-utility-bar__text">Notes</span>
        </button>
      </li>
      <li class="nds-utility-bar__item">
        <button class="nds-button nds-utility-bar__action" aria-pressed="false">
          <svg class="nds-button__icon nds-button__icon_left" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#omni_channel"></use>
          </svg>
          <span class="nds-utility-bar__text">
            <span class="nds-m-bottom_xxx-small">Online</span>
            <span>Omni-Channel</span>
          </span>
        </button>
      </li>
    </ul>
    <section class="nds-utility-panel nds-grid nds-grid_vertical nds-is-open" role="dialog" aria-labelledby="panel-heading-01">
      <header class="nds-utility-panel__header nds-grid nds-shrink-none">
        <div class="nds-media nds-media_center">
          <div class="nds-media__figure nds-m-right_x-small">
            <span class="nds-icon_container">
              <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#call"></use>
              </svg>
            </span>
          </div>
          <div class="nds-media__body">
            <h2 id="panel-heading-01">Call</h2>
          </div>
        </div>
        <div class="nds-col_bump-left nds-shrink-none">
          <button class="nds-button nds-button_icon nds-button_icon" title="Close Panel">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#minimize_window"></use>
            </svg>
            <span class="nds-assistive-text">Close Panel</span>
          </button>
        </div>
      </header>
      <div class="nds-utility-panel__body">
        <div class="nds-align_absolute-center">Utility Panel Body</div>
      </div>
    </section>
  </footer>
</div>`);
  })
  .add('Notification (states)', () => {
    return withExample(`<div style="height: 540px;">
  <footer class="nds-utility-bar_container" aria-label="Utility Bar">
    <h2 class="nds-assistive-text">Utility Bar</h2>
    <ul class="nds-utility-bar">
      <li class="nds-utility-bar__item">
        <button class="nds-button nds-utility-bar__action" aria-pressed="false">
          <svg class="nds-button__icon nds-button__icon_left" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#call"></use>
          </svg>
          <span class="nds-utility-bar__text">Call</span>
        </button>
      </li>
      <li class="nds-utility-bar__item">
        <button class="nds-button nds-utility-bar__action" aria-pressed="false">
          <svg class="nds-button__icon nds-button__icon_left" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#clock"></use>
          </svg>
          <span class="nds-utility-bar__text">History</span>
        </button>
      </li>
      <li class="nds-utility-bar__item">
        <button class="nds-button nds-utility-bar__action" aria-pressed="false">
          <svg class="nds-button__icon nds-button__icon_left" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#note"></use>
          </svg>
          <span class="nds-utility-bar__text">Notes</span>
        </button>
      </li>
      <li class="nds-utility-bar__item nds-has-notification">
        <button class="nds-button nds-utility-bar__action" aria-pressed="false">
          <abbr class="nds-indicator_unread" title="Unread Item" aria-label="Unread Item">
            <span class="nds-assistive-text">●</span>
          </abbr>
          <svg class="nds-button__icon nds-button__icon_left" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#omni_channel"></use>
          </svg>
          <span class="nds-utility-bar__text">
            <span class="nds-m-bottom_xxx-small">Online</span>
            <span>Omni-Channel</span>
          </span>
        </button>
      </li>
    </ul>
  </footer>
</div>`);
  });
