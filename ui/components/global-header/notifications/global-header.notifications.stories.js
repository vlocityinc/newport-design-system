import { storiesOf } from '@storybook/html';
import base from 'paths.macro';
import notes from '../doc.md';
import basescss from '../base/_index.scss';
import scss from './_index.scss';
import {
  withExample,
  withDocs,
  commentToHTML
} from '../../../../scripts/storybook';

storiesOf(`${base}`, module)
  .addDecorator(withDocs(notes))
  .addDecorator(commentToHTML(basescss + scss))
  .add('Default (default)', () => {
    return withExample(`<div class="demo-only" style="height: 28.571rem;">
  <header class="nds-global-header_container">
    <a href="javascript:void(0);" class="nds-assistive-text nds-assistive-text_focus">Skip to Navigation</a>
    <a href="javascript:void(0);" class="nds-assistive-text nds-assistive-text_focus">Skip to Main Content</a>
    <div class="nds-global-header nds-grid nds-grid_align-spread">
      <div class="nds-global-header__item">
        <div class="nds-global-header__logo">
          <img src="/assets/images/logo-noname.svg" alt="">
        </div>
      </div>
      <div class="nds-global-header__item nds-global-header__item_search">
        <div aria-expanded="false" aria-haspopup="listbox" class="nds-form-element nds-lookup" role="combobox">
          <label class="nds-assistive-text" for="global-search-01">Search Salesforce</label>
          <div class="nds-form-element__control nds-input-has-icon nds-input-has-icon_left-right">
            <svg class="nds-input__icon nds-input__icon_left" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#search"></use>
            </svg>
            <input type="text" aria-activedescendant="" aria-autocomplete="list" aria-controls="global-search-list-01" autocomplete="off" class="nds-input nds-lookup__search-input" id="global-search-01" placeholder="Search Salesforce" role="textbox">
          </div>
          <div class="nds-lookup__menu" role="listbox" id="global-search-list-01">
            <ul class="nds-lookup__list" role="group" aria-label="Recent Items">
              <li role="presentation">
                <h3 role="presentation" class="nds-lookup__item_label nds-text-body_small">Recent Items</h3>
              </li>
              <li role="presentation">
                <span class="nds-lookup__item-action nds-media" id="option-01" role="option">
                  <svg class="nds-icon nds-icon-standard-opportunity nds-icon_small nds-media__figure" aria-hidden="true">
                    <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#opportunity"></use>
                  </svg>
                  <span class="nds-media__body">
                    <span class="nds-lookup__result-text">Salesforce - 1,000 Licenses</span>
                    <span class="nds-lookup__result-meta nds-text-body_small">Opportunity • Prospecting</span>
                  </span>
                </span>
              </li>
              <li role="presentation">
                <span class="nds-lookup__item-action nds-media" id="option-02" role="option">
                  <svg class="nds-icon nds-icon-standard-contact nds-icon_small nds-media__figure" aria-hidden="true">
                    <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#contact"></use>
                  </svg>
                  <span class="nds-media__body">
                    <span class="nds-lookup__result-text">Art Vandelay</span>
                    <span class="nds-lookup__result-meta nds-text-body_small">Contact • avandelay@vandelay.com</span>
                  </span>
                </span>
              </li>
              <li role="presentation">
                <span class="nds-lookup__item-action nds-media" id="option-03" role="option">
                  <svg class="nds-icon nds-icon-standard-account nds-icon_small nds-media__figure" aria-hidden="true">
                    <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#account"></use>
                  </svg>
                  <span class="nds-media__body">
                    <span class="nds-lookup__result-text">Vandelary Industries</span>
                    <span class="nds-lookup__result-meta nds-text-body_small">Account • San Francisco</span>
                  </span>
                </span>
              </li>
              <li role="presentation">
                <span class="nds-lookup__item-action nds-media" id="option-04" role="option">
                  <svg class="nds-icon nds-icon-custom-8 nds-icon_small nds-media__figure" aria-hidden="true">
                    <use xlink:href="/assets/icons/custom-sprite/svg/symbols.svg#custom8"></use>
                  </svg>
                  <span class="nds-media__body">
                    <span class="nds-lookup__result-text">Salesforce UK 2016 Events</span>
                    <span class="nds-lookup__result-meta nds-text-body_small">General Ledger • $20,000</span>
                  </span>
                </span>
              </li>
              <li role="presentation">
                <span class="nds-lookup__item-action nds-media" id="option-05" role="option">
                  <svg class="nds-icon nds-icon-standard-lead nds-icon_small nds-media__figure" aria-hidden="true">
                    <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#lead"></use>
                  </svg>
                  <span class="nds-media__body">
                    <span class="nds-lookup__result-text">H.E. Pennypacker</span>
                    <span class="nds-lookup__result-meta nds-text-body_small">Lead • Nursing</span>
                  </span>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <ul class="nds-global-header__item nds-grid nds-grid_vertical-align-center">
        <li class="nds-grid">
          <button class="nds-button nds-button_icon nds-button_icon nds-button_icon-container nds-button_icon-small nds-global-header__button_icon-favorites" aria-pressed="false" title="Toggle Favorites">
            <svg class="nds-button__icon nds-global-header__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#favorite"></use>
            </svg>
            <span class="nds-assistive-text">Toggle Favorite</span>
          </button>
          <span class="nds-dropdown-trigger nds-dropdown-trigger_click">
            <button class="nds-button nds-button_icon nds-button_icon nds-button_icon-container nds-button_icon-small nds-global-header__button_icon nds-m-left_none" title="View Favorites">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
              </svg>
              <span class="nds-assistive-text">View Favorites</span>
            </button>
          </span>
        </li>
        <li class="nds-dropdown-trigger nds-dropdown-trigger_click nds-p-horizontal_xxx-small">
          <button class="nds-button nds-button_icon nds-button_icon nds-button_icon-small nds-button_icon-container nds-button_icon-x-small nds-global-header__button_icon-actions nds-m-horizontal_xx-small" title="Global Actions">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#add"></use>
            </svg>
            <span class="nds-assistive-text">Global Actions</span>
          </button>
        </li>
        <li class="nds-dropdown-trigger nds-dropdown-trigger_click">
          <button class="nds-button nds-button_icon nds-button_icon nds-button_icon-container nds-button_icon-small nds-global-header__button_icon" title="Help and Training">
            <svg class="nds-button__icon nds-global-header__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#question"></use>
            </svg>
            <span class="nds-assistive-text">Help and Training</span>
          </button>
        </li>
        <li class="nds-dropdown-trigger nds-dropdown-trigger_click">
          <button class="nds-button nds-button_icon nds-button_icon nds-button_icon-container nds-button_icon-small nds-global-header__button_icon" title="Setup">
            <svg class="nds-button__icon nds-global-header__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#setup"></use>
            </svg>
            <span class="nds-assistive-text">Setup</span>
          </button>
        </li>
        <li class="nds-dropdown-trigger nds-dropdown-trigger_click">
          <button class="nds-button nds-button_icon nds-button_icon nds-button_icon-container nds-button_icon-small nds-global-header__button_icon" title="Notifications">
            <svg class="nds-button__icon nds-global-header__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#notification"></use>
            </svg>
            <span class="nds-assistive-text">Notifications</span>
          </button>
        </li>
        <li class="nds-dropdown-trigger nds-dropdown-trigger_click nds-m-left_x-small">
          <button class="nds-button" title="person name" aria-haspopup="true">
            <span class="nds-avatar nds-avatar_circle nds-avatar_medium">
              <img alt="Person name" src="/assets/images/avatar2.jpg" title="User avatar">
            </span>
          </button>
        </li>
      </ul>
    </div>
    <section class="nds-popover nds-popover_large nds-nubbin_top-right" role="dialog" aria-label="Notifications" aria-describedby="notifications-container" style="position: absolute; right: 3.125rem;">
      <div id="notifications-container" class="nds-popover__body nds-p-around_none">
        <ul>
          <li class="nds-global-header__notification nds-p-around_xx-small nds-global-header__notification_unread">
            <div class="nds-media nds-has-flexi-truncate nds-p-around_x-small">
              <div class="nds-media__figure">
                <span class="nds-avatar nds-avatar_small nds-avatar_circle">
                  <img alt="Kelly Chan" src="/assets/images/avatar3.jpg" title="Kelly Chan avatar">
                </span>
              </div>
              <div class="nds-media__body">
                <div class="nds-grid nds-grid_align-spread">
                  <a href="javascript:void(0);" class="nds-text-link_reset nds-has-flexi-truncate">
                    <h3 class="nds-truncate" title="Kelly Chan mentioned you in a comment:">
                      <strong>Kelly Chan mentioned you in a comment:</strong>
                    </h3>
                    <p class="nds-truncate" title="I need you to review this for me @Paulina">I need you to review this for me @Paulina</p>
                    <p class="nds-m-top_x-small nds-text-color_weak">10m ago</p>
                  </a>
                  <div class="nds-no-flex nds-grid nds-grid_vertical">
                    <div class="nds-dropdown-trigger nds-dropdown-trigger_click nds-is-open">
                      <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" aria-haspopup="true" title="Show More">
                        <svg class="nds-button__icon" aria-hidden="true">
                          <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
                        </svg>
                        <span class="nds-assistive-text">Show More</span>
                      </button>
                    </div>
                    <div class="nds-align-middle">
                      <abbr class="nds-required nds-text-link" title="unread">●</abbr>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
          <li class="nds-global-header__notification nds-p-around_xx-small">
            <div class="nds-media nds-has-flexi-truncate nds-p-around_x-small">
              <div class="nds-media__figure">
                <span class="nds-avatar nds-avatar_small nds-avatar_circle">
                  <img alt="Kelly Chan" src="/assets/images/avatar3.jpg" title="Kelly Chan avatar">
                </span>
              </div>
              <div class="nds-media__body">
                <div class="nds-grid nds-grid_align-spread">
                  <a href="javascript:void(0);" class="nds-text-link_reset nds-has-flexi-truncate">
                    <h3 class="nds-truncate" title="Kelly Chan mentioned you in a comment:">
                      <strong>Kelly Chan mentioned you in a comment:</strong>
                    </h3>
                    <p class="nds-truncate" title="I need you to review this for me @Paulina">I need you to review this for me @Paulina</p>
                    <p class="nds-m-top_x-small nds-text-color_weak">10m ago</p>
                  </a>
                  <div class="nds-no-flex nds-grid nds-grid_vertical">
                    <div class="nds-dropdown-trigger nds-dropdown-trigger_click nds-is-open">
                      <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" aria-haspopup="true" title="Show More">
                        <svg class="nds-button__icon" aria-hidden="true">
                          <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
                        </svg>
                        <span class="nds-assistive-text">Show More</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
          <li class="nds-global-header__notification nds-p-around_xx-small">
            <div class="nds-media nds-has-flexi-truncate nds-p-around_x-small">
              <div class="nds-media__figure">
                <span class="nds-avatar nds-avatar_small nds-avatar_circle">
                  <img alt="Kelly Chan" src="/assets/images/avatar3.jpg" title="Kelly Chan avatar">
                </span>
              </div>
              <div class="nds-media__body">
                <div class="nds-grid nds-grid_align-spread">
                  <a href="javascript:void(0);" class="nds-text-link_reset nds-has-flexi-truncate">
                    <h3 class="nds-truncate" title="Kelly Chan mentioned you in a comment:">
                      <strong>Kelly Chan mentioned you in a comment:</strong>
                    </h3>
                    <p class="nds-truncate" title="I need you to review this for me @Paulina">I need you to review this for me @Paulina</p>
                    <p class="nds-m-top_x-small nds-text-color_weak">10m ago</p>
                  </a>
                  <div class="nds-no-flex nds-grid nds-grid_vertical">
                    <div class="nds-dropdown-trigger nds-dropdown-trigger_click nds-is-open">
                      <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" aria-haspopup="true" title="Show More">
                        <svg class="nds-button__icon" aria-hidden="true">
                          <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
                        </svg>
                        <span class="nds-assistive-text">Show More</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </section>
  </header>
</div>`);
  });
