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
          <h1 class="nds-page-header__title nds-p-right_x-small">
            <button class="nds-button nds-button_reset nds-type-focus nds-truncate" aria-haspopup="true" title="">
              <span class="nds-grid nds-has-flexi-truncate nds-grid_vertical-align-center">
                <span class="nds-truncate" title="Recently Viewed">Recently Viewed</span>
                <span class="nds-icon_container nds-icon-utility-down" title="Description of icon when needed">
                  <svg class="nds-icon nds-icon--x-small nds-m-left_xx-small" aria-hidden="true">
                    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
                  </svg>
                  <span class="nds-assistive-text">Description of icon</span>
                </span>
              </span>
            </button>
          </h1>
        </div>
      </div>
    </div>
    <div class="nds-col nds-no-flex nds-grid nds-align-top nds-p-bottom_xx-small">
      <div class="nds-button-group" role="group">
        <button class="nds-button nds-button_neutral">New</button>
        <div class="nds-button_last">
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
  <div class="nds-grid">
    <div class="nds-col nds-align-middle">
      <p class="nds-text-body_small">10 items • Updated 13 minutes ago</p>
    </div>
    <div class="nds-col nds-no-flex nds-grid nds-align-bottom">
      <div class="nds-dropdown-trigger nds-dropdown-trigger_click nds-m-left_x-small" aria-expanded="false">
        <button class="nds-button nds-button_icon nds-button_icon-more" aria-haspopup="true" title="List View Controls">
          <svg class="nds-button__icon" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#settings"></use>
          </svg>
          <svg class="nds-button__icon nds-button__icon_x-small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
          </svg>
          <span class="nds-assistive-text">List View Controls</span>
        </button>
      </div>
      <div class="nds-dropdown-trigger nds-dropdown-trigger_click nds-m-left_xx-small">
        <button class="nds-button nds-button_icon nds-button_icon-more" aria-haspopup="true" title="Change view">
          <svg class="nds-button__icon" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#table"></use>
          </svg>
          <svg class="nds-button__icon nds-button__icon_x-small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
          </svg>
          <span class="nds-assistive-text">Change view</span>
        </button>
      </div>
      <button class="nds-button nds-button_icon nds-m-left_xx-small nds-button_icon-border-filled" title="Edit List">
        <svg class="nds-button__icon" aria-hidden="true">
          <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
        </svg>
        <span class="nds-assistive-text">Edit List</span>
      </button>
      <button class="nds-button nds-button_icon nds-m-left_xx-small nds-button_icon-border-filled" title="Refresh">
        <svg class="nds-button__icon" aria-hidden="true">
          <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#refresh"></use>
        </svg>
        <span class="nds-assistive-text">Refresh</span>
      </button>
      <div class="nds-button-group" role="group">
        <button class="nds-button nds-button_icon nds-button_icon-border-filled" title="Charts">
          <svg class="nds-button__icon" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chart"></use>
          </svg>
          <span class="nds-assistive-text">Charts</span>
        </button>
        <button class="nds-button nds-button_icon nds-button_icon-border-filled" title="Filters">
          <svg class="nds-button__icon" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#filterList"></use>
          </svg>
          <span class="nds-assistive-text">Filters</span>
        </button>
      </div>
    </div>
  </div>
</div>`);
  })
  .add('Card (examples)', () => {
    return withExample(`<div class="nds-card">
  <div class="nds-page-header">
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
            <h1 class="nds-page-header__title nds-p-right_x-small">
              <button class="nds-button nds-button_reset nds-type-focus nds-truncate" aria-haspopup="true" title="">
                <span class="nds-grid nds-has-flexi-truncate nds-grid_vertical-align-center">
                  <span class="nds-truncate" title="Recently Viewed">Recently Viewed</span>
                  <span class="nds-icon_container nds-icon-utility-down" title="Description of icon when needed">
                    <svg class="nds-icon nds-icon--x-small nds-m-left_xx-small" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
                    </svg>
                    <span class="nds-assistive-text">Description of icon</span>
                  </span>
                </span>
              </button>
            </h1>
          </div>
        </div>
      </div>
      <div class="nds-col nds-no-flex nds-grid nds-align-top nds-p-bottom_xx-small">
        <div class="nds-button-group" role="group">
          <button class="nds-button nds-button_neutral">New</button>
          <div class="nds-button_last">
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
    <div class="nds-grid">
      <div class="nds-col nds-align-middle">
        <p class="nds-text-body_small">10 items • Updated 13 minutes ago</p>
      </div>
      <div class="nds-col nds-no-flex nds-grid nds-align-bottom">
        <div class="nds-dropdown-trigger nds-dropdown-trigger_click nds-m-left_x-small" aria-expanded="false">
          <button class="nds-button nds-button_icon nds-button_icon-more" aria-haspopup="true" title="List View Controls">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#settings"></use>
            </svg>
            <svg class="nds-button__icon nds-button__icon_x-small" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
            </svg>
            <span class="nds-assistive-text">List View Controls</span>
          </button>
        </div>
        <div class="nds-dropdown-trigger nds-dropdown-trigger_click nds-m-left_xx-small">
          <button class="nds-button nds-button_icon nds-button_icon-more" aria-haspopup="true" title="Change view">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#table"></use>
            </svg>
            <svg class="nds-button__icon nds-button__icon_x-small" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
            </svg>
            <span class="nds-assistive-text">Change view</span>
          </button>
        </div>
        <button class="nds-button nds-button_icon nds-m-left_xx-small nds-button_icon-border-filled" title="Edit List">
          <svg class="nds-button__icon" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
          </svg>
          <span class="nds-assistive-text">Edit List</span>
        </button>
        <button class="nds-button nds-button_icon nds-m-left_xx-small nds-button_icon-border-filled" title="Refresh">
          <svg class="nds-button__icon" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#refresh"></use>
          </svg>
          <span class="nds-assistive-text">Refresh</span>
        </button>
        <div class="nds-button-group" role="group">
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" title="Charts">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chart"></use>
            </svg>
            <span class="nds-assistive-text">Charts</span>
          </button>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" title="Filters">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#filterList"></use>
            </svg>
            <span class="nds-assistive-text">Filters</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</div>`);
  })
  .add('Tab Card (examples)', () => {
    return withExample(`<div class="nds-tabs_card">
  <div class="nds-page-header">
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
            <h1 class="nds-page-header__title nds-p-right_x-small">
              <button class="nds-button nds-button_reset nds-type-focus nds-truncate" aria-haspopup="true" title="">
                <span class="nds-grid nds-has-flexi-truncate nds-grid_vertical-align-center">
                  <span class="nds-truncate" title="Recently Viewed">Recently Viewed</span>
                  <span class="nds-icon_container nds-icon-utility-down" title="Description of icon when needed">
                    <svg class="nds-icon nds-icon--x-small nds-m-left_xx-small" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
                    </svg>
                    <span class="nds-assistive-text">Description of icon</span>
                  </span>
                </span>
              </button>
            </h1>
          </div>
        </div>
      </div>
      <div class="nds-col nds-no-flex nds-grid nds-align-top nds-p-bottom_xx-small">
        <div class="nds-button-group" role="group">
          <button class="nds-button nds-button_neutral">New</button>
          <div class="nds-button_last">
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
    <div class="nds-grid">
      <div class="nds-col nds-align-middle">
        <p class="nds-text-body_small">10 items • Updated 13 minutes ago</p>
      </div>
      <div class="nds-col nds-no-flex nds-grid nds-align-bottom">
        <div class="nds-dropdown-trigger nds-dropdown-trigger_click nds-m-left_x-small" aria-expanded="false">
          <button class="nds-button nds-button_icon nds-button_icon-more" aria-haspopup="true" title="List View Controls">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#settings"></use>
            </svg>
            <svg class="nds-button__icon nds-button__icon_x-small" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
            </svg>
            <span class="nds-assistive-text">List View Controls</span>
          </button>
        </div>
        <div class="nds-dropdown-trigger nds-dropdown-trigger_click nds-m-left_xx-small">
          <button class="nds-button nds-button_icon nds-button_icon-more" aria-haspopup="true" title="Change view">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#table"></use>
            </svg>
            <svg class="nds-button__icon nds-button__icon_x-small" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
            </svg>
            <span class="nds-assistive-text">Change view</span>
          </button>
        </div>
        <button class="nds-button nds-button_icon nds-m-left_xx-small nds-button_icon-border-filled" title="Edit List">
          <svg class="nds-button__icon" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
          </svg>
          <span class="nds-assistive-text">Edit List</span>
        </button>
        <button class="nds-button nds-button_icon nds-m-left_xx-small nds-button_icon-border-filled" title="Refresh">
          <svg class="nds-button__icon" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#refresh"></use>
          </svg>
          <span class="nds-assistive-text">Refresh</span>
        </button>
        <div class="nds-button-group" role="group">
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" title="Charts">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chart"></use>
            </svg>
            <span class="nds-assistive-text">Charts</span>
          </button>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" title="Filters">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#filterList"></use>
            </svg>
            <span class="nds-assistive-text">Filters</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</div>`);
  });
