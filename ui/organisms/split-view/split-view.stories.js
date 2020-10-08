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
    return withExample(`<div class="demo-only" style="display: flex; width: 20rem; height: 37.5rem;">
  <div class="nds-split-view_container nds-is-open">
    <button class="nds-button nds-button_icon nds-button_icon nds-split-view__toggle-button nds-is-open" aria-expanded="true" aria-controls="split-view-id" title="Close Split View">
      <svg class="nds-button__icon nds-button__icon_x-small" aria-hidden="true">
        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#left"></use>
      </svg>
      <span class="nds-assistive-text">Close Split View</span>
    </button>
    <article aria-hidden="false" id="split-view-id" class="nds-split-view nds-grid nds-grid_vertical nds-grow">
      <header class="nds-split-view__header">
        <div class="nds-grid nds-grid_vertical-align-center nds-m-bottom_xx-small">
          <div class="nds-has-flexi-truncate">
            <div class="nds-media nds-media_center">
              <div class="nds-media__figure">
                <div class="nds-icon_container nds-icon-standard-lead">
                  <svg class="nds-icon" aria-hidden="true">
                    <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#lead"></use>
                  </svg>
                  <span class="nds-assistive-text">Leads</span>
                </div>
              </div>
              <div class="nds-media__body">
                <h1 class="nds-text-heading_small nds-text-color_default nds-p-right_x-small">
                  <button class="nds-button nds-button_reset nds-type-focus nds-truncate" aria-haspopup="true" title="">
                    <span class="nds-grid nds-has-flexi-truncate nds-grid_vertical-align-center">
                      <span class="nds-truncate" title="My Leads">My Leads</span>
                      <svg class="nds-button__icon nds-button__icon_right nds-no-flex" aria-hidden="true">
                        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
                      </svg>
                    </span>
                  </button>
                </h1>
              </div>
            </div>
          </div>
          <div class="nds-no-flex nds-grid">
            <button class="nds-button nds-button_icon nds-button_icon-border-filled" aria-haspopup="true" title="More Actions">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
              </svg>
              <span class="nds-assistive-text">More Actions</span>
            </button>
          </div>
        </div>
        <div class="nds-grid nds-grid_vertical-align-center">
          <p class="nds-text-body_small nds-text-color_weak">42 items • Updated just now</p>
          <div class="nds-no-flex nds-grid nds-col_bump-left">
            <div class="nds-button-group">
              <button class="nds-button nds-button_icon nds-button_icon nds-button_icon-container-more" aria-haspopup="true" title="Display As Split View">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#side_list"></use>
                </svg>
                <svg class="nds-button__icon nds-button__icon_x-small" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
                </svg>
                <span class="nds-assistive-text">Display As Split View</span>
              </button>
            </div>
            <div class="nds-button-group">
              <button class="nds-button nds-button_icon nds-button_icon nds-button_icon-container" title="Refresh List">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#refresh"></use>
                </svg>
                <span class="nds-assistive-text">Refresh List</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      <div class="nds-grid nds-grid_vertical">
        <div class="nds-split-view__list-header nds-grid nds-text-title_caps">
          <span class="nds-assistive-text">Sorted by:</span>
          <span>
            <!-- react-text: 49 -->Lead Score
            <!-- /react-text -->
            <svg class="nds-icon nds-icon_xx-small nds-icon-text-default nds-align-top" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
          </span>
          <span class="nds-assistive-text">- Descending</span>
        </div>
        <ul aria-multiselectable="true" class="nds-scrollable_y" role="listbox" aria-label="Select an item to open it in a new workspace tab.">
          <li class="nds-split-view__list-item" role="presentation">
            <a href="javascript:void(0);" aria-selected="false" role="option" class="nds-split-view__list-item-action nds-grow nds-has-flexi-truncate" tabindex="0">
              <div class="nds-grid nds-wrap">
                <span class="nds-truncate nds-text-body_regular nds-text-color_default" title="Riley Shultz">Riley Shultz</span>
                <span class="nds-truncate nds-col_bump-left" title="99">99</span>
              </div>
              <div class="nds-grid nds-wrap">
                <span class="nds-truncate" title="Biotech, Inc.">Biotech, Inc.</span>
                <span class="nds-truncate nds-col_bump-left" title="Nurturing">Nurturing</span>
              </div>
            </a>
          </li>
          <li class="nds-split-view__list-item" role="presentation">
            <a href="javascript:void(0);" aria-selected="false" role="option" class="nds-split-view__list-item-action nds-grow nds-has-flexi-truncate" tabindex="-1">
              <div class="nds-grid nds-wrap">
                <span class="nds-truncate nds-text-body_regular nds-text-color_default" title="Jason A. - VP of Sales">Jason A. - VP of Sales</span>
                <span class="nds-truncate nds-col_bump-left" title="92">92</span>
              </div>
              <div class="nds-grid nds-wrap">
                <span class="nds-truncate" title="Case Management Solutions">Case Management Solutions</span>
                <span class="nds-truncate nds-col_bump-left" title="Contacted">Contacted</span>
              </div>
            </a>
          </li>
          <li class="nds-split-view__list-item" role="presentation">
            <a href="javascript:void(0);" aria-selected="false" role="option" class="nds-split-view__list-item-action nds-grow nds-has-flexi-truncate" tabindex="-1">
              <div class="nds-grid nds-wrap">
                <span class="nds-truncate nds-text-body_regular nds-text-color_default" title="Josh Smith">Josh Smith</span>
                <span class="nds-truncate nds-col_bump-left" title="90">90</span>
              </div>
              <div class="nds-grid nds-wrap">
                <span class="nds-truncate" title="Acme, Inc.">Acme, Inc.</span>
                <span class="nds-truncate nds-col_bump-left" title="Contacted">Contacted</span>
              </div>
            </a>
          </li>
          <li class="nds-split-view__list-item" role="presentation">
            <a href="javascript:void(0);" aria-selected="false" role="option" class="nds-split-view__list-item-action nds-grow nds-has-flexi-truncate" tabindex="-1">
              <div class="nds-grid nds-wrap">
                <span class="nds-truncate nds-text-body_regular nds-text-color_default" title="Bobby Tree">Bobby Tree</span>
                <span class="nds-truncate nds-col_bump-left" title="89">89</span>
              </div>
              <div class="nds-grid nds-wrap">
                <span class="nds-truncate" title="Salesforce, Inc.">Salesforce, Inc.</span>
                <span class="nds-truncate nds-col_bump-left" title="Closing">Closing</span>
              </div>
            </a>
          </li>
          <li class="nds-split-view__list-item" role="presentation">
            <a href="javascript:void(0);" aria-selected="false" role="option" class="nds-split-view__list-item-action nds-grow nds-has-flexi-truncate" tabindex="-1">
              <div class="nds-grid nds-wrap">
                <span class="nds-truncate nds-text-body_regular nds-text-color_default" title="Riley Shultz">Riley Shultz</span>
                <span class="nds-truncate nds-col_bump-left" title="74">74</span>
              </div>
              <div class="nds-grid nds-wrap">
                <span class="nds-truncate" title="Tesla">Tesla</span>
                <span class="nds-truncate nds-col_bump-left" title="Contacted">Contacted</span>
              </div>
            </a>
          </li>
        </ul>
      </div>
    </article>
  </div>
</div>`);
  })
  .add('Selected Item (states)', () => {
    return withExample(`<div class="demo-only" style="display: flex; width: 20rem; height: 37.5rem;">
  <div class="nds-split-view_container nds-is-open">
    <button class="nds-button nds-button_icon nds-button_icon nds-split-view__toggle-button nds-is-open" aria-expanded="true" aria-controls="split-view-id" title="Close Split View">
      <svg class="nds-button__icon nds-button__icon_x-small" aria-hidden="true">
        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#left"></use>
      </svg>
      <span class="nds-assistive-text">Close Split View</span>
    </button>
    <article aria-hidden="false" id="split-view-id" class="nds-split-view nds-grid nds-grid_vertical nds-grow">
      <header class="nds-split-view__header">
        <div class="nds-grid nds-grid_vertical-align-center nds-m-bottom_xx-small">
          <div class="nds-has-flexi-truncate">
            <div class="nds-media nds-media_center">
              <div class="nds-media__figure">
                <div class="nds-icon_container nds-icon-standard-lead">
                  <svg class="nds-icon" aria-hidden="true">
                    <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#lead"></use>
                  </svg>
                  <span class="nds-assistive-text">Leads</span>
                </div>
              </div>
              <div class="nds-media__body">
                <h1 class="nds-text-heading_small nds-text-color_default nds-p-right_x-small">
                  <button class="nds-button nds-button_reset nds-type-focus nds-truncate" aria-haspopup="true" title="">
                    <span class="nds-grid nds-has-flexi-truncate nds-grid_vertical-align-center">
                      <span class="nds-truncate" title="My Leads">My Leads</span>
                      <svg class="nds-button__icon nds-button__icon_right nds-no-flex" aria-hidden="true">
                        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
                      </svg>
                    </span>
                  </button>
                </h1>
              </div>
            </div>
          </div>
          <div class="nds-no-flex nds-grid">
            <button class="nds-button nds-button_icon nds-button_icon-border-filled" aria-haspopup="true" title="More Actions">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
              </svg>
              <span class="nds-assistive-text">More Actions</span>
            </button>
          </div>
        </div>
        <div class="nds-grid nds-grid_vertical-align-center">
          <p class="nds-text-body_small nds-text-color_weak">42 items • Updated just now</p>
          <div class="nds-no-flex nds-grid nds-col_bump-left">
            <div class="nds-button-group">
              <button class="nds-button nds-button_icon nds-button_icon nds-button_icon-container-more" aria-haspopup="true" title="Display As Split View">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#side_list"></use>
                </svg>
                <svg class="nds-button__icon nds-button__icon_x-small" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
                </svg>
                <span class="nds-assistive-text">Display As Split View</span>
              </button>
            </div>
            <div class="nds-button-group">
              <button class="nds-button nds-button_icon nds-button_icon nds-button_icon-container" title="Refresh List">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#refresh"></use>
                </svg>
                <span class="nds-assistive-text">Refresh List</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      <div class="nds-grid nds-grid_vertical">
        <div class="nds-split-view__list-header nds-grid nds-text-title_caps">
          <span class="nds-assistive-text">Sorted by:</span>
          <span>
            <!-- react-text: 49 -->Lead Score
            <!-- /react-text -->
            <svg class="nds-icon nds-icon_xx-small nds-icon-text-default nds-align-top" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
          </span>
          <span class="nds-assistive-text">- Descending</span>
        </div>
        <ul aria-multiselectable="true" class="nds-scrollable_y" role="listbox" aria-label="Select an item to open it in a new workspace tab.">
          <li class="nds-split-view__list-item" role="presentation">
            <a href="javascript:void(0);" aria-selected="false" role="option" class="nds-split-view__list-item-action nds-grow nds-has-flexi-truncate" tabindex="0">
              <div class="nds-grid nds-wrap">
                <span class="nds-truncate nds-text-body_regular nds-text-color_default" title="Riley Shultz">Riley Shultz</span>
                <span class="nds-truncate nds-col_bump-left" title="99">99</span>
              </div>
              <div class="nds-grid nds-wrap">
                <span class="nds-truncate" title="Biotech, Inc.">Biotech, Inc.</span>
                <span class="nds-truncate nds-col_bump-left" title="Nurturing">Nurturing</span>
              </div>
            </a>
          </li>
          <li class="nds-split-view__list-item" role="presentation">
            <a href="javascript:void(0);" aria-selected="false" role="option" class="nds-split-view__list-item-action nds-grow nds-has-flexi-truncate" tabindex="-1">
              <div class="nds-grid nds-wrap">
                <span class="nds-truncate nds-text-body_regular nds-text-color_default" title="Jason A. - VP of Sales">Jason A. - VP of Sales</span>
                <span class="nds-truncate nds-col_bump-left" title="92">92</span>
              </div>
              <div class="nds-grid nds-wrap">
                <span class="nds-truncate" title="Case Management Solutions">Case Management Solutions</span>
                <span class="nds-truncate nds-col_bump-left" title="Contacted">Contacted</span>
              </div>
            </a>
          </li>
          <li class="nds-split-view__list-item" role="presentation">
            <a href="javascript:void(0);" aria-selected="false" role="option" class="nds-split-view__list-item-action nds-grow nds-has-flexi-truncate" tabindex="-1">
              <div class="nds-grid nds-wrap">
                <span class="nds-truncate nds-text-body_regular nds-text-color_default" title="Josh Smith">Josh Smith</span>
                <span class="nds-truncate nds-col_bump-left" title="90">90</span>
              </div>
              <div class="nds-grid nds-wrap">
                <span class="nds-truncate" title="Acme, Inc.">Acme, Inc.</span>
                <span class="nds-truncate nds-col_bump-left" title="Contacted">Contacted</span>
              </div>
            </a>
          </li>
          <li class="nds-split-view__list-item" role="presentation">
            <a href="javascript:void(0);" aria-selected="false" role="option" class="nds-split-view__list-item-action nds-grow nds-has-flexi-truncate" tabindex="-1">
              <div class="nds-grid nds-wrap">
                <span class="nds-truncate nds-text-body_regular nds-text-color_default" title="Bobby Tree">Bobby Tree</span>
                <span class="nds-truncate nds-col_bump-left" title="89">89</span>
              </div>
              <div class="nds-grid nds-wrap">
                <span class="nds-truncate" title="Salesforce, Inc.">Salesforce, Inc.</span>
                <span class="nds-truncate nds-col_bump-left" title="Closing">Closing</span>
              </div>
            </a>
          </li>
          <li class="nds-split-view__list-item" role="presentation">
            <a href="javascript:void(0);" aria-selected="true" role="option" class="nds-split-view__list-item-action nds-grow nds-has-flexi-truncate" tabindex="-1">
              <div class="nds-grid nds-wrap">
                <span class="nds-truncate nds-text-body_regular nds-text-color_default" title="Riley Shultz">Riley Shultz</span>
                <span class="nds-truncate nds-col_bump-left" title="74">74</span>
              </div>
              <div class="nds-grid nds-wrap">
                <span class="nds-truncate" title="Tesla">Tesla</span>
                <span class="nds-truncate nds-col_bump-left" title="Contacted">Contacted</span>
              </div>
            </a>
          </li>
        </ul>
      </div>
    </article>
  </div>
</div>`);
  })
  .add('Overflow (states)', () => {
    return withExample(`<div class="demo-only" style="display: flex; width: 20rem; height: 37.5rem;">
  <div class="nds-split-view_container nds-is-open">
    <button class="nds-button nds-button_icon nds-button_icon nds-split-view__toggle-button nds-is-open" aria-expanded="true" aria-controls="split-view-id" title="Close Split View">
      <svg class="nds-button__icon nds-button__icon_x-small" aria-hidden="true">
        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#left"></use>
      </svg>
      <span class="nds-assistive-text">Close Split View</span>
    </button>
    <article aria-hidden="false" id="split-view-id" class="nds-split-view nds-grid nds-grid_vertical nds-grow">
      <header class="nds-split-view__header">
        <div class="nds-grid nds-grid_vertical-align-center nds-m-bottom_xx-small">
          <div class="nds-has-flexi-truncate">
            <div class="nds-media nds-media_center">
              <div class="nds-media__figure">
                <div class="nds-icon_container nds-icon-standard-lead">
                  <svg class="nds-icon" aria-hidden="true">
                    <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#lead"></use>
                  </svg>
                  <span class="nds-assistive-text">Leads</span>
                </div>
              </div>
              <div class="nds-media__body">
                <h1 class="nds-text-heading_small nds-text-color_default nds-p-right_x-small">
                  <button class="nds-button nds-button_reset nds-type-focus nds-truncate" aria-haspopup="true" title="">
                    <span class="nds-grid nds-has-flexi-truncate nds-grid_vertical-align-center">
                      <span class="nds-truncate" title="My Leads">My Leads</span>
                      <svg class="nds-button__icon nds-button__icon_right nds-no-flex" aria-hidden="true">
                        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
                      </svg>
                    </span>
                  </button>
                </h1>
              </div>
            </div>
          </div>
          <div class="nds-no-flex nds-grid">
            <button class="nds-button nds-button_icon nds-button_icon-border-filled" aria-haspopup="true" title="More Actions">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
              </svg>
              <span class="nds-assistive-text">More Actions</span>
            </button>
          </div>
        </div>
        <div class="nds-grid nds-grid_vertical-align-center">
          <p class="nds-text-body_small nds-text-color_weak">42 items • Updated just now</p>
          <div class="nds-no-flex nds-grid nds-col_bump-left">
            <div class="nds-button-group">
              <button class="nds-button nds-button_icon nds-button_icon nds-button_icon-container-more" aria-haspopup="true" title="Display As Split View">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#side_list"></use>
                </svg>
                <svg class="nds-button__icon nds-button__icon_x-small" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
                </svg>
                <span class="nds-assistive-text">Display As Split View</span>
              </button>
            </div>
            <div class="nds-button-group">
              <button class="nds-button nds-button_icon nds-button_icon nds-button_icon-container" title="Refresh List">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#refresh"></use>
                </svg>
                <span class="nds-assistive-text">Refresh List</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      <div class="nds-grid nds-grid_vertical">
        <div class="nds-split-view__list-header nds-grid nds-text-title_caps">
          <span class="nds-assistive-text">Sorted by:</span>
          <span>
            <!-- react-text: 49 -->Lead Score
            <!-- /react-text -->
            <svg class="nds-icon nds-icon_xx-small nds-icon-text-default nds-align-top" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
          </span>
          <span class="nds-assistive-text">- Descending</span>
        </div>
        <ul aria-multiselectable="true" class="nds-scrollable_y" role="listbox" aria-label="Select an item to open it in a new workspace tab.">
          <li class="nds-split-view__list-item" role="presentation">
            <a href="javascript:void(0);" aria-selected="false" role="option" class="nds-split-view__list-item-action nds-grow nds-has-flexi-truncate" tabindex="0">
              <div class="nds-grid nds-wrap">
                <span class="nds-truncate nds-text-body_regular nds-text-color_default" title="Riley Shultz">Riley Shultz</span>
                <span class="nds-truncate nds-col_bump-left" title="99">99</span>
              </div>
              <div class="nds-grid nds-wrap">
                <span class="nds-truncate" title="Biotech, Inc.">Biotech, Inc.</span>
                <span class="nds-truncate nds-col_bump-left" title="Nurturing">Nurturing</span>
              </div>
            </a>
          </li>
          <li class="nds-split-view__list-item" role="presentation">
            <a href="javascript:void(0);" aria-selected="false" role="option" class="nds-split-view__list-item-action nds-grow nds-has-flexi-truncate" tabindex="-1">
              <div class="nds-grid nds-wrap">
                <span class="nds-truncate nds-text-body_regular nds-text-color_default" title="Jason A. - VP of Sales">Jason A. - VP of Sales</span>
                <span class="nds-truncate nds-col_bump-left" title="92">92</span>
              </div>
              <div class="nds-grid nds-wrap">
                <span class="nds-truncate" title="Case Management Solutions">Case Management Solutions</span>
                <span class="nds-truncate nds-col_bump-left" title="Contacted">Contacted</span>
              </div>
            </a>
          </li>
          <li class="nds-split-view__list-item" role="presentation">
            <a href="javascript:void(0);" aria-selected="false" role="option" class="nds-split-view__list-item-action nds-grow nds-has-flexi-truncate" tabindex="-1">
              <div class="nds-grid nds-wrap">
                <span class="nds-truncate nds-text-body_regular nds-text-color_default" title="Josh Smith">Josh Smith</span>
                <span class="nds-truncate nds-col_bump-left" title="90">90</span>
              </div>
              <div class="nds-grid nds-wrap">
                <span class="nds-truncate" title="Acme, Inc.">Acme, Inc.</span>
                <span class="nds-truncate nds-col_bump-left" title="Contacted">Contacted</span>
              </div>
            </a>
          </li>
          <li class="nds-split-view__list-item" role="presentation">
            <a href="javascript:void(0);" aria-selected="false" role="option" class="nds-split-view__list-item-action nds-grow nds-has-flexi-truncate" tabindex="-1">
              <div class="nds-grid nds-wrap">
                <span class="nds-truncate nds-text-body_regular nds-text-color_default" title="Bobby Tree">Bobby Tree</span>
                <span class="nds-truncate nds-col_bump-left" title="89">89</span>
              </div>
              <div class="nds-grid nds-wrap">
                <span class="nds-truncate" title="Salesforce, Inc.">Salesforce, Inc.</span>
                <span class="nds-truncate nds-col_bump-left" title="Closing">Closing</span>
              </div>
            </a>
          </li>
          <li class="nds-split-view__list-item" role="presentation">
            <a href="javascript:void(0);" aria-selected="false" role="option" class="nds-split-view__list-item-action nds-grow nds-has-flexi-truncate" tabindex="-1">
              <div class="nds-grid nds-wrap">
                <span class="nds-truncate nds-text-body_regular nds-text-color_default" title="Riley Shultz">Riley Shultz</span>
                <span class="nds-truncate nds-col_bump-left" title="74">74</span>
              </div>
              <div class="nds-grid nds-wrap">
                <span class="nds-truncate" title="Tesla">Tesla</span>
                <span class="nds-truncate nds-col_bump-left" title="Contacted">Contacted</span>
              </div>
            </a>
          </li>
          <li class="nds-split-view__list-item" role="presentation">
            <a href="javascript:void(0);" aria-selected="false" role="option" class="nds-split-view__list-item-action nds-grow nds-has-flexi-truncate" tabindex="-1">
              <div class="nds-grid nds-wrap">
                <span class="nds-truncate nds-text-body_regular nds-text-color_default" title="Andy Smith">Andy Smith</span>
                <span class="nds-truncate nds-col_bump-left" title="72">72</span>
              </div>
              <div class="nds-grid nds-wrap">
                <span class="nds-truncate" title="Universal Technologies">Universal Technologies</span>
                <span class="nds-truncate nds-col_bump-left" title="New">New</span>
              </div>
            </a>
          </li>
          <li class="nds-split-view__list-item" role="presentation">
            <a href="javascript:void(0);" aria-selected="false" role="option" class="nds-split-view__list-item-action nds-grow nds-has-flexi-truncate" tabindex="-1">
              <div class="nds-grid nds-wrap">
                <span class="nds-truncate nds-text-body_regular nds-text-color_default" title="Jim Steele">Jim Steele</span>
                <span class="nds-truncate nds-col_bump-left" title="71">71</span>
              </div>
              <div class="nds-grid nds-wrap">
                <span class="nds-truncate" title="BigList, Inc.">BigList, Inc.</span>
                <span class="nds-truncate nds-col_bump-left" title="New">New</span>
              </div>
            </a>
          </li>
          <li class="nds-split-view__list-item" role="presentation">
            <a href="javascript:void(0);" aria-selected="false" role="option" class="nds-split-view__list-item-action nds-grow nds-has-flexi-truncate" tabindex="-1">
              <div class="nds-grid nds-wrap">
                <span class="nds-truncate nds-text-body_regular nds-text-color_default" title="John Gardner">John Gardner</span>
                <span class="nds-truncate nds-col_bump-left" title="70">70</span>
              </div>
              <div class="nds-grid nds-wrap">
                <span class="nds-truncate" title="3C Systems">3C Systems</span>
                <span class="nds-truncate nds-col_bump-left" title="Contacted">Contacted</span>
              </div>
            </a>
          </li>
          <li class="nds-split-view__list-item" role="presentation">
            <a href="javascript:void(0);" aria-selected="false" role="option" class="nds-split-view__list-item-action nds-grow nds-has-flexi-truncate" tabindex="-1">
              <div class="nds-grid nds-wrap">
                <span class="nds-truncate nds-text-body_regular nds-text-color_default" title="Sarah Loehr">Sarah Loehr</span>
                <span class="nds-truncate nds-col_bump-left" title="68">68</span>
              </div>
              <div class="nds-grid nds-wrap">
                <span class="nds-truncate" title="MedLife, Inc.">MedLife, Inc.</span>
                <span class="nds-truncate nds-col_bump-left" title="New">New</span>
              </div>
            </a>
          </li>
        </ul>
      </div>
    </article>
  </div>
</div>`);
  })
  .add('Unread (states)', () => {
    return withExample(`<div class="demo-only" style="display: flex; width: 20rem; height: 37.5rem;">
  <div class="nds-split-view_container nds-is-open">
    <button class="nds-button nds-button_icon nds-button_icon nds-split-view__toggle-button nds-is-open" aria-expanded="true" aria-controls="split-view-id" title="Close Split View">
      <svg class="nds-button__icon nds-button__icon_x-small" aria-hidden="true">
        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#left"></use>
      </svg>
      <span class="nds-assistive-text">Close Split View</span>
    </button>
    <article aria-hidden="false" id="split-view-id" class="nds-split-view nds-grid nds-grid_vertical nds-grow">
      <header class="nds-split-view__header">
        <div class="nds-grid nds-grid_vertical-align-center nds-m-bottom_xx-small">
          <div class="nds-has-flexi-truncate">
            <div class="nds-media nds-media_center">
              <div class="nds-media__figure">
                <div class="nds-icon_container nds-icon-standard-lead">
                  <svg class="nds-icon" aria-hidden="true">
                    <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#lead"></use>
                  </svg>
                  <span class="nds-assistive-text">Leads</span>
                </div>
              </div>
              <div class="nds-media__body">
                <h1 class="nds-text-heading_small nds-text-color_default nds-p-right_x-small">
                  <button class="nds-button nds-button_reset nds-type-focus nds-truncate" aria-haspopup="true" title="">
                    <span class="nds-grid nds-has-flexi-truncate nds-grid_vertical-align-center">
                      <span class="nds-truncate" title="My Leads">My Leads</span>
                      <svg class="nds-button__icon nds-button__icon_right nds-no-flex" aria-hidden="true">
                        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
                      </svg>
                    </span>
                  </button>
                </h1>
              </div>
            </div>
          </div>
          <div class="nds-no-flex nds-grid">
            <button class="nds-button nds-button_icon nds-button_icon-border-filled" aria-haspopup="true" title="More Actions">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
              </svg>
              <span class="nds-assistive-text">More Actions</span>
            </button>
          </div>
        </div>
        <div class="nds-grid nds-grid_vertical-align-center">
          <p class="nds-text-body_small nds-text-color_weak">42 items • Updated just now</p>
          <div class="nds-no-flex nds-grid nds-col_bump-left">
            <div class="nds-button-group">
              <button class="nds-button nds-button_icon nds-button_icon nds-button_icon-container-more" aria-haspopup="true" title="Display As Split View">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#side_list"></use>
                </svg>
                <svg class="nds-button__icon nds-button__icon_x-small" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
                </svg>
                <span class="nds-assistive-text">Display As Split View</span>
              </button>
            </div>
            <div class="nds-button-group">
              <button class="nds-button nds-button_icon nds-button_icon nds-button_icon-container" title="Refresh List">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#refresh"></use>
                </svg>
                <span class="nds-assistive-text">Refresh List</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      <div class="nds-grid nds-grid_vertical">
        <div class="nds-split-view__list-header nds-grid nds-text-title_caps">
          <span class="nds-assistive-text">Sorted by:</span>
          <span>
            <!-- react-text: 49 -->Lead Score
            <!-- /react-text -->
            <svg class="nds-icon nds-icon_xx-small nds-icon-text-default nds-align-top" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
          </span>
          <span class="nds-assistive-text">- Descending</span>
        </div>
        <ul aria-multiselectable="true" class="nds-scrollable_y" role="listbox" aria-label="Select an item to open it in a new workspace tab.">
          <li class="nds-split-view__list-item nds-is-unread" role="presentation">
            <a href="javascript:void(0);" aria-selected="false" role="option" class="nds-split-view__list-item-action nds-grow nds-has-flexi-truncate" tabindex="0">
              <abbr class="nds-indicator_unread" title="Unread Item" aria-label="Unread Item">
                <span class="nds-assistive-text">●</span>
              </abbr>
              <div class="nds-grid nds-wrap">
                <span class="nds-truncate nds-text-body_regular nds-text-color_default" title="Riley Shultz">Riley Shultz</span>
                <span class="nds-truncate nds-col_bump-left" title="99">99</span>
              </div>
              <div class="nds-grid nds-wrap">
                <span class="nds-truncate" title="Biotech, Inc.">Biotech, Inc.</span>
                <span class="nds-truncate nds-col_bump-left" title="Nurturing">Nurturing</span>
              </div>
            </a>
          </li>
          <li class="nds-split-view__list-item nds-is-unread" role="presentation">
            <a href="javascript:void(0);" aria-selected="false" role="option" class="nds-split-view__list-item-action nds-grow nds-has-flexi-truncate" tabindex="-1">
              <abbr class="nds-indicator_unread" title="Unread Item" aria-label="Unread Item">
                <span class="nds-assistive-text">●</span>
              </abbr>
              <div class="nds-grid nds-wrap">
                <span class="nds-truncate nds-text-body_regular nds-text-color_default" title="Jason A. - VP of Sales">Jason A. - VP of Sales</span>
                <span class="nds-truncate nds-col_bump-left" title="92">92</span>
              </div>
              <div class="nds-grid nds-wrap">
                <span class="nds-truncate" title="Case Management Solutions">Case Management Solutions</span>
                <span class="nds-truncate nds-col_bump-left" title="Contacted">Contacted</span>
              </div>
            </a>
          </li>
          <li class="nds-split-view__list-item nds-is-unread" role="presentation">
            <a href="javascript:void(0);" aria-selected="false" role="option" class="nds-split-view__list-item-action nds-grow nds-has-flexi-truncate" tabindex="-1">
              <abbr class="nds-indicator_unread" title="Unread Item" aria-label="Unread Item">
                <span class="nds-assistive-text">●</span>
              </abbr>
              <div class="nds-grid nds-wrap">
                <span class="nds-truncate nds-text-body_regular nds-text-color_default" title="Josh Smith">Josh Smith</span>
                <span class="nds-truncate nds-col_bump-left" title="90">90</span>
              </div>
              <div class="nds-grid nds-wrap">
                <span class="nds-truncate" title="Acme, Inc.">Acme, Inc.</span>
                <span class="nds-truncate nds-col_bump-left" title="Contacted">Contacted</span>
              </div>
            </a>
          </li>
          <li class="nds-split-view__list-item nds-is-unread" role="presentation">
            <a href="javascript:void(0);" aria-selected="false" role="option" class="nds-split-view__list-item-action nds-grow nds-has-flexi-truncate" tabindex="-1">
              <abbr class="nds-indicator_unread" title="Unread Item" aria-label="Unread Item">
                <span class="nds-assistive-text">●</span>
              </abbr>
              <div class="nds-grid nds-wrap">
                <span class="nds-truncate nds-text-body_regular nds-text-color_default" title="Bobby Tree">Bobby Tree</span>
                <span class="nds-truncate nds-col_bump-left" title="89">89</span>
              </div>
              <div class="nds-grid nds-wrap">
                <span class="nds-truncate" title="Salesforce, Inc.">Salesforce, Inc.</span>
                <span class="nds-truncate nds-col_bump-left" title="Closing">Closing</span>
              </div>
            </a>
          </li>
          <li class="nds-split-view__list-item" role="presentation">
            <a href="javascript:void(0);" aria-selected="false" role="option" class="nds-split-view__list-item-action nds-grow nds-has-flexi-truncate" tabindex="-1">
              <div class="nds-grid nds-wrap">
                <span class="nds-truncate nds-text-body_regular nds-text-color_default" title="Riley Shultz">Riley Shultz</span>
                <span class="nds-truncate nds-col_bump-left" title="74">74</span>
              </div>
              <div class="nds-grid nds-wrap">
                <span class="nds-truncate" title="Tesla">Tesla</span>
                <span class="nds-truncate nds-col_bump-left" title="Contacted">Contacted</span>
              </div>
            </a>
          </li>
          <li class="nds-split-view__list-item nds-is-unread" role="presentation">
            <a href="javascript:void(0);" aria-selected="false" role="option" class="nds-split-view__list-item-action nds-grow nds-has-flexi-truncate" tabindex="-1">
              <abbr class="nds-indicator_unread" title="Unread Item" aria-label="Unread Item">
                <span class="nds-assistive-text">●</span>
              </abbr>
              <div class="nds-grid nds-wrap">
                <span class="nds-truncate nds-text-body_regular nds-text-color_default" title="Andy Smith">Andy Smith</span>
                <span class="nds-truncate nds-col_bump-left" title="72">72</span>
              </div>
              <div class="nds-grid nds-wrap">
                <span class="nds-truncate" title="Universal Technologies">Universal Technologies</span>
                <span class="nds-truncate nds-col_bump-left" title="New">New</span>
              </div>
            </a>
          </li>
          <li class="nds-split-view__list-item" role="presentation">
            <a href="javascript:void(0);" aria-selected="false" role="option" class="nds-split-view__list-item-action nds-grow nds-has-flexi-truncate" tabindex="-1">
              <div class="nds-grid nds-wrap">
                <span class="nds-truncate nds-text-body_regular nds-text-color_default" title="Jim Steele">Jim Steele</span>
                <span class="nds-truncate nds-col_bump-left" title="71">71</span>
              </div>
              <div class="nds-grid nds-wrap">
                <span class="nds-truncate" title="BigList, Inc.">BigList, Inc.</span>
                <span class="nds-truncate nds-col_bump-left" title="New">New</span>
              </div>
            </a>
          </li>
          <li class="nds-split-view__list-item" role="presentation">
            <a href="javascript:void(0);" aria-selected="false" role="option" class="nds-split-view__list-item-action nds-grow nds-has-flexi-truncate" tabindex="-1">
              <div class="nds-grid nds-wrap">
                <span class="nds-truncate nds-text-body_regular nds-text-color_default" title="John Gardner">John Gardner</span>
                <span class="nds-truncate nds-col_bump-left" title="70">70</span>
              </div>
              <div class="nds-grid nds-wrap">
                <span class="nds-truncate" title="3C Systems">3C Systems</span>
                <span class="nds-truncate nds-col_bump-left" title="Contacted">Contacted</span>
              </div>
            </a>
          </li>
          <li class="nds-split-view__list-item" role="presentation">
            <a href="javascript:void(0);" aria-selected="false" role="option" class="nds-split-view__list-item-action nds-grow nds-has-flexi-truncate" tabindex="-1">
              <div class="nds-grid nds-wrap">
                <span class="nds-truncate nds-text-body_regular nds-text-color_default" title="Sarah Loehr">Sarah Loehr</span>
                <span class="nds-truncate nds-col_bump-left" title="68">68</span>
              </div>
              <div class="nds-grid nds-wrap">
                <span class="nds-truncate" title="MedLife, Inc.">MedLife, Inc.</span>
                <span class="nds-truncate nds-col_bump-left" title="New">New</span>
              </div>
            </a>
          </li>
        </ul>
      </div>
    </article>
  </div>
</div>`);
  })
  .add('Panel Collapsed (states)', () => {
    return withExample(`<div class="demo-only" style="display: flex; width: 20rem; height: 37.5rem;">
  <div class="nds-split-view_container nds-is-closed">
    <button class="nds-button nds-button_icon nds-button_icon nds-split-view__toggle-button nds-is-closed" aria-expanded="false" aria-controls="split-view-id" title="Open Split View">
      <svg class="nds-button__icon nds-button__icon_x-small" aria-hidden="true">
        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#left"></use>
      </svg>
      <span class="nds-assistive-text">Open Split View</span>
    </button>
    <article aria-hidden="true" id="split-view-id" class="nds-split-view nds-grid nds-grid_vertical nds-grow">
      <header class="nds-split-view__header">
        <div class="nds-grid nds-grid_vertical-align-center nds-m-bottom_xx-small">
          <div class="nds-has-flexi-truncate">
            <div class="nds-media nds-media_center">
              <div class="nds-media__figure">
                <div class="nds-icon_container nds-icon-standard-lead">
                  <svg class="nds-icon" aria-hidden="true">
                    <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#lead"></use>
                  </svg>
                  <span class="nds-assistive-text">Leads</span>
                </div>
              </div>
              <div class="nds-media__body">
                <h1 class="nds-text-heading_small nds-text-color_default nds-p-right_x-small">
                  <button class="nds-button nds-button_reset nds-type-focus nds-truncate" aria-haspopup="true" title="">
                    <span class="nds-grid nds-has-flexi-truncate nds-grid_vertical-align-center">
                      <span class="nds-truncate" title="My Leads">My Leads</span>
                      <svg class="nds-button__icon nds-button__icon_right nds-no-flex" aria-hidden="true">
                        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
                      </svg>
                    </span>
                  </button>
                </h1>
              </div>
            </div>
          </div>
          <div class="nds-no-flex nds-grid">
            <button class="nds-button nds-button_icon nds-button_icon-border-filled" aria-haspopup="true" title="More Actions">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
              </svg>
              <span class="nds-assistive-text">More Actions</span>
            </button>
          </div>
        </div>
        <div class="nds-grid nds-grid_vertical-align-center">
          <p class="nds-text-body_small nds-text-color_weak">42 items • Updated just now</p>
          <div class="nds-no-flex nds-grid nds-col_bump-left">
            <div class="nds-button-group">
              <button class="nds-button nds-button_icon nds-button_icon nds-button_icon-container-more" aria-haspopup="true" title="Display As Split View">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#side_list"></use>
                </svg>
                <svg class="nds-button__icon nds-button__icon_x-small" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
                </svg>
                <span class="nds-assistive-text">Display As Split View</span>
              </button>
            </div>
            <div class="nds-button-group">
              <button class="nds-button nds-button_icon nds-button_icon nds-button_icon-container" title="Refresh List">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#refresh"></use>
                </svg>
                <span class="nds-assistive-text">Refresh List</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      <div class="nds-grid nds-grid_vertical">
        <div class="nds-split-view__list-header nds-grid nds-text-title_caps">
          <span class="nds-assistive-text">Sorted by:</span>
          <span>
            <!-- react-text: 49 -->Lead Score
            <!-- /react-text -->
            <svg class="nds-icon nds-icon_xx-small nds-icon-text-default nds-align-top" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
          </span>
          <span class="nds-assistive-text">- Descending</span>
        </div>
        <ul aria-multiselectable="true" class="nds-scrollable_y" role="listbox" aria-label="Select an item to open it in a new workspace tab.">
          <li class="nds-split-view__list-item nds-is-unread" role="presentation">
            <a href="javascript:void(0);" aria-selected="false" role="option" class="nds-split-view__list-item-action nds-grow nds-has-flexi-truncate" tabindex="0">
              <abbr class="nds-indicator_unread" title="Unread Item" aria-label="Unread Item">
                <span class="nds-assistive-text">●</span>
              </abbr>
              <div class="nds-grid nds-wrap">
                <span class="nds-truncate nds-text-body_regular nds-text-color_default" title="Riley Shultz">Riley Shultz</span>
                <span class="nds-truncate nds-col_bump-left" title="99">99</span>
              </div>
              <div class="nds-grid nds-wrap">
                <span class="nds-truncate" title="Biotech, Inc.">Biotech, Inc.</span>
                <span class="nds-truncate nds-col_bump-left" title="Nurturing">Nurturing</span>
              </div>
            </a>
          </li>
          <li class="nds-split-view__list-item nds-is-unread" role="presentation">
            <a href="javascript:void(0);" aria-selected="false" role="option" class="nds-split-view__list-item-action nds-grow nds-has-flexi-truncate" tabindex="-1">
              <abbr class="nds-indicator_unread" title="Unread Item" aria-label="Unread Item">
                <span class="nds-assistive-text">●</span>
              </abbr>
              <div class="nds-grid nds-wrap">
                <span class="nds-truncate nds-text-body_regular nds-text-color_default" title="Jason A. - VP of Sales">Jason A. - VP of Sales</span>
                <span class="nds-truncate nds-col_bump-left" title="92">92</span>
              </div>
              <div class="nds-grid nds-wrap">
                <span class="nds-truncate" title="Case Management Solutions">Case Management Solutions</span>
                <span class="nds-truncate nds-col_bump-left" title="Contacted">Contacted</span>
              </div>
            </a>
          </li>
          <li class="nds-split-view__list-item nds-is-unread" role="presentation">
            <a href="javascript:void(0);" aria-selected="false" role="option" class="nds-split-view__list-item-action nds-grow nds-has-flexi-truncate" tabindex="-1">
              <abbr class="nds-indicator_unread" title="Unread Item" aria-label="Unread Item">
                <span class="nds-assistive-text">●</span>
              </abbr>
              <div class="nds-grid nds-wrap">
                <span class="nds-truncate nds-text-body_regular nds-text-color_default" title="Josh Smith">Josh Smith</span>
                <span class="nds-truncate nds-col_bump-left" title="90">90</span>
              </div>
              <div class="nds-grid nds-wrap">
                <span class="nds-truncate" title="Acme, Inc.">Acme, Inc.</span>
                <span class="nds-truncate nds-col_bump-left" title="Contacted">Contacted</span>
              </div>
            </a>
          </li>
          <li class="nds-split-view__list-item nds-is-unread" role="presentation">
            <a href="javascript:void(0);" aria-selected="false" role="option" class="nds-split-view__list-item-action nds-grow nds-has-flexi-truncate" tabindex="-1">
              <abbr class="nds-indicator_unread" title="Unread Item" aria-label="Unread Item">
                <span class="nds-assistive-text">●</span>
              </abbr>
              <div class="nds-grid nds-wrap">
                <span class="nds-truncate nds-text-body_regular nds-text-color_default" title="Bobby Tree">Bobby Tree</span>
                <span class="nds-truncate nds-col_bump-left" title="89">89</span>
              </div>
              <div class="nds-grid nds-wrap">
                <span class="nds-truncate" title="Salesforce, Inc.">Salesforce, Inc.</span>
                <span class="nds-truncate nds-col_bump-left" title="Closing">Closing</span>
              </div>
            </a>
          </li>
          <li class="nds-split-view__list-item" role="presentation">
            <a href="javascript:void(0);" aria-selected="false" role="option" class="nds-split-view__list-item-action nds-grow nds-has-flexi-truncate" tabindex="-1">
              <div class="nds-grid nds-wrap">
                <span class="nds-truncate nds-text-body_regular nds-text-color_default" title="Riley Shultz">Riley Shultz</span>
                <span class="nds-truncate nds-col_bump-left" title="74">74</span>
              </div>
              <div class="nds-grid nds-wrap">
                <span class="nds-truncate" title="Tesla">Tesla</span>
                <span class="nds-truncate nds-col_bump-left" title="Contacted">Contacted</span>
              </div>
            </a>
          </li>
          <li class="nds-split-view__list-item nds-is-unread" role="presentation">
            <a href="javascript:void(0);" aria-selected="false" role="option" class="nds-split-view__list-item-action nds-grow nds-has-flexi-truncate" tabindex="-1">
              <abbr class="nds-indicator_unread" title="Unread Item" aria-label="Unread Item">
                <span class="nds-assistive-text">●</span>
              </abbr>
              <div class="nds-grid nds-wrap">
                <span class="nds-truncate nds-text-body_regular nds-text-color_default" title="Andy Smith">Andy Smith</span>
                <span class="nds-truncate nds-col_bump-left" title="72">72</span>
              </div>
              <div class="nds-grid nds-wrap">
                <span class="nds-truncate" title="Universal Technologies">Universal Technologies</span>
                <span class="nds-truncate nds-col_bump-left" title="New">New</span>
              </div>
            </a>
          </li>
          <li class="nds-split-view__list-item" role="presentation">
            <a href="javascript:void(0);" aria-selected="false" role="option" class="nds-split-view__list-item-action nds-grow nds-has-flexi-truncate" tabindex="-1">
              <div class="nds-grid nds-wrap">
                <span class="nds-truncate nds-text-body_regular nds-text-color_default" title="Jim Steele">Jim Steele</span>
                <span class="nds-truncate nds-col_bump-left" title="71">71</span>
              </div>
              <div class="nds-grid nds-wrap">
                <span class="nds-truncate" title="BigList, Inc.">BigList, Inc.</span>
                <span class="nds-truncate nds-col_bump-left" title="New">New</span>
              </div>
            </a>
          </li>
          <li class="nds-split-view__list-item" role="presentation">
            <a href="javascript:void(0);" aria-selected="false" role="option" class="nds-split-view__list-item-action nds-grow nds-has-flexi-truncate" tabindex="-1">
              <div class="nds-grid nds-wrap">
                <span class="nds-truncate nds-text-body_regular nds-text-color_default" title="John Gardner">John Gardner</span>
                <span class="nds-truncate nds-col_bump-left" title="70">70</span>
              </div>
              <div class="nds-grid nds-wrap">
                <span class="nds-truncate" title="3C Systems">3C Systems</span>
                <span class="nds-truncate nds-col_bump-left" title="Contacted">Contacted</span>
              </div>
            </a>
          </li>
          <li class="nds-split-view__list-item" role="presentation">
            <a href="javascript:void(0);" aria-selected="false" role="option" class="nds-split-view__list-item-action nds-grow nds-has-flexi-truncate" tabindex="-1">
              <div class="nds-grid nds-wrap">
                <span class="nds-truncate nds-text-body_regular nds-text-color_default" title="Sarah Loehr">Sarah Loehr</span>
                <span class="nds-truncate nds-col_bump-left" title="68">68</span>
              </div>
              <div class="nds-grid nds-wrap">
                <span class="nds-truncate" title="MedLife, Inc.">MedLife, Inc.</span>
                <span class="nds-truncate nds-col_bump-left" title="New">New</span>
              </div>
            </a>
          </li>
        </ul>
      </div>
    </article>
  </div>
</div>`);
  });
