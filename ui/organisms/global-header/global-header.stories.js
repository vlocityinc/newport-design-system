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
    return withExample(`<div class="demo-only" style="height: 340px;">
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
  </header>
</div>`);
  })
  .add('Favorites Selected (states)', () => {
    return withExample(`<div class="demo-only" style="height: 340px;">
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
          <button class="nds-button nds-button_icon nds-button_icon nds-button_icon-container nds-button_icon-small nds-global-header__button_icon-favorites nds-is-selected" aria-pressed="true" title="Toggle Favorites">
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
  </header>
</div>`);
  })
  .add('Favorites Disabled (states)', () => {
    return withExample(`<div class="demo-only" style="height: 340px;">
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
          <button class="nds-button nds-button_icon nds-button_icon nds-button_icon-container nds-button_icon-small nds-global-header__button_icon-favorites nds-is-disabled" disabled="" aria-pressed="false" title="Toggle Favorites">
            <svg class="nds-button__icon nds-global-header__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#favorite"></use>
            </svg>
            <span class="nds-assistive-text">Toggle Favorite</span>
          </button>
          <span class="nds-dropdown-trigger nds-dropdown-trigger_click">
            <button class="nds-button nds-button_icon nds-button_icon nds-button_icon-container nds-button_icon-small nds-global-header__button_icon nds-m-left_none" disabled="" title="View Favorites">
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
  </header>
</div>`);
  })
  .add('Actions Active (states)', () => {
    return withExample(`<div class="demo-only" style="height: 340px;">
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
          <span class="nds-dropdown-trigger nds-dropdown-trigger_click nds-is-open">
            <button class="nds-button nds-button_icon nds-button_icon nds-button_icon-container nds-button_icon-small nds-global-header__button_icon nds-m-left_none" title="View Favorites">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
              </svg>
              <span class="nds-assistive-text">View Favorites</span>
            </button>
          </span>
        </li>
        <li class="nds-dropdown-trigger nds-dropdown-trigger_click nds-p-horizontal_xxx-small nds-is-open">
          <button class="nds-button nds-button_icon nds-button_icon nds-button_icon-small nds-button_icon-container nds-button_icon-x-small nds-global-header__button_icon-actions nds-m-horizontal_xx-small" title="Global Actions">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#add"></use>
            </svg>
            <span class="nds-assistive-text">Global Actions</span>
          </button>
          <div class="nds-dropdown nds-dropdown_right nds-nubbin_top-right">
            <ul class="nds-dropdown__list" role="menu">
              <li class="nds-dropdown__header" role="separator">
                <span class="nds-text-title_caps">Create</span>
              </li>
              <li class="nds-dropdown__item" role="presentation">
                <a href="javascript:void(0);" role="menuitem" tabindex="0">
                  <span class="nds-truncate" title="[object Object], ,New Note">
                    <svg class="nds-icon nds-icon_small nds-icon-standard-note nds-m-right_x-small" aria-hidden="true">
                      <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#note"></use>
                    </svg>
                    <!-- react-text: 81 -->
                    <!-- /react-text -->
                    <!-- react-text: 82 -->New Note
                    <!-- /react-text -->
                  </span>
                </a>
              </li>
              <li class="nds-dropdown__item" role="presentation">
                <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                  <span class="nds-truncate" title="[object Object], ,Log a Call">
                    <svg class="nds-icon nds-icon_small nds-icon-standard-log-a-call nds-m-right_x-small" aria-hidden="true">
                      <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#log_a_call"></use>
                    </svg>
                    <!-- react-text: 88 -->
                    <!-- /react-text -->
                    <!-- react-text: 89 -->Log a Call
                    <!-- /react-text -->
                  </span>
                </a>
              </li>
              <li class="nds-dropdown__item" role="presentation">
                <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                  <span class="nds-truncate" title="[object Object], ,New Event">
                    <svg class="nds-icon nds-icon_small nds-icon-standard-event nds-m-right_x-small" aria-hidden="true">
                      <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#event"></use>
                    </svg>
                    <!-- react-text: 95 -->
                    <!-- /react-text -->
                    <!-- react-text: 96 -->New Event
                    <!-- /react-text -->
                  </span>
                </a>
              </li>
            </ul>
          </div>
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
  </header>
</div>`);
  })
  .add('Global Header Setup Active (states)', () => {
    return withExample(`<div class="demo-only" style="height: 340px;">
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
        <li class="nds-dropdown-trigger nds-dropdown-trigger_click nds-is-open">
          <button class="nds-button nds-button_icon nds-button_icon nds-button_icon-container nds-button_icon-small nds-global-header__button_icon" title="Setup">
            <svg class="nds-button__icon nds-global-header__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#setup"></use>
            </svg>
            <span class="nds-assistive-text">Setup</span>
          </button>
          <div class="nds-dropdown nds-dropdown_right nds-nubbin_top-right">
            <ul class="nds-dropdown__list" role="menu">
              <li class="nds-dropdown__header" role="separator">
                <span class="nds-text-title_caps">Setup</span>
              </li>
              <li class="nds-dropdown__item" role="presentation">
                <a href="javascript:void(0);" role="menuitem" tabindex="0">
                  <span class="nds-truncate" title="Setup Home">
                    <!-- react-text: 89 -->Setup Home
                    <!-- /react-text -->
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </li>
        <li class="nds-dropdown-trigger nds-dropdown-trigger_click nds-is-open">
          <button class="nds-button nds-button_icon nds-button_icon nds-button_icon-container nds-button_icon-small nds-global-header__button_icon" title="Notifications">
            <svg class="nds-button__icon nds-global-header__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#notification"></use>
            </svg>
            <span class="nds-assistive-text">Notifications</span>
          </button>
        </li>
        <li class="nds-dropdown-trigger nds-dropdown-trigger_click nds-m-left_x-small nds-is-open">
          <button class="nds-button" title="person name" aria-haspopup="true">
            <span class="nds-avatar nds-avatar_circle nds-avatar_medium">
              <img alt="Person name" src="/assets/images/avatar2.jpg" title="User avatar">
            </span>
          </button>
        </li>
      </ul>
    </div>
  </header>
</div>`);
  })
  .add('Global Header Search Active (states)', () => {
    return withExample(`<div class="demo-only" style="height: 340px;">
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
        <div aria-expanded="true" aria-haspopup="listbox" class="nds-form-element nds-lookup nds-is-open" role="combobox">
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
  </header>
</div>`);
  })
  .add('Global Header Search Typeahead (states)', () => {
    return withExample(`<div class="demo-only" style="height: 340px;">
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
        <div aria-expanded="true" aria-haspopup="listbox" class="nds-form-element nds-lookup nds-is-open" role="combobox">
          <label class="nds-assistive-text" for="global-search-01">Search Salesforce</label>
          <div class="nds-form-element__control nds-input-has-icon nds-input-has-icon_left-right">
            <svg class="nds-input__icon nds-input__icon_left" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#search"></use>
            </svg>
            <input type="text" aria-activedescendant="" aria-autocomplete="list" aria-controls="global-search-list-01" autocomplete="off" class="nds-input nds-lookup__search-input" id="global-search-01" placeholder="Search Salesforce" role="textbox" value="ibm">
            <button class="nds-input__icon nds-input__icon_right nds-button nds-button_icon">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#clear"></use>
              </svg>
              <span class="nds-assistive-text">Clear the current search term</span>
            </button>
          </div>
          <div class="nds-lookup__menu" role="listbox" id="global-search-list-01">
            <ul class="nds-lookup__list" role="presentation">
              <li role="presentation">
                <span class="nds-lookup__item-action nds-lookup__item-action_label nds-text-body_small nds-has-focus" id="option-00" role="option">
                  <svg class="nds-icon nds-icon_x-small nds-icon-text-default" aria-hidden="true">
                    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#search"></use>
                  </svg>
                  <span class="nds-truncate" title="'ibm' in Salesforce">"ibm" in Salesforce</span>
                </span>
              </li>
              <li role="presentation">
                <span class="nds-lookup__item-action nds-media" id="option-01" role="option">
                  <svg class="nds-icon nds-icon-standard-opportunity nds-icon_small nds-media__figure" aria-hidden="true">
                    <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#opportunity"></use>
                  </svg>
                  <span class="nds-media__body">
                    <span class="nds-lookup__result-text">
                      <mark>IBM</mark>
                      <!-- react-text: 35 -->- 1yr/100k
                      <!-- /react-text -->
                    </span>
                    <span class="nds-lookup__result-meta nds-text-body_small">Opportunity • Proposal/Quote</span>
                  </span>
                </span>
              </li>
              <li role="presentation">
                <span class="nds-lookup__item-action nds-media" id="option-02" role="option">
                  <svg class="nds-icon nds-icon-standard-account nds-icon_small nds-media__figure" aria-hidden="true">
                    <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#account"></use>
                  </svg>
                  <span class="nds-media__body">
                    <span class="nds-lookup__result-text">
                      <mark>IBM</mark>
                    </span>
                    <span class="nds-lookup__result-meta nds-text-body_small">Account • Menlo Park</span>
                  </span>
                </span>
              </li>
              <li role="presentation">
                <span class="nds-lookup__item-action nds-media" id="option-03" role="option">
                  <svg class="nds-icon nds-icon-standard-account nds-icon_small nds-media__figure" aria-hidden="true">
                    <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#account"></use>
                  </svg>
                  <span class="nds-media__body">
                    <span class="nds-lookup__result-text">
                      <mark>IBM</mark>
                      <!-- react-text: 52 -->Watson
                      <!-- /react-text -->
                    </span>
                    <span class="nds-lookup__result-meta nds-text-body_small">Account • Menlo Park</span>
                  </span>
                </span>
              </li>
              <li role="presentation">
                <span class="nds-lookup__item-action nds-media" id="option-04" role="option">
                  <svg class="nds-icon nds-icon-standard-opportunity nds-icon_small nds-media__figure" aria-hidden="true">
                    <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#opportunity"></use>
                  </svg>
                  <span class="nds-media__body">
                    <span class="nds-lookup__result-text">
                      <!-- react-text: 60 -->200 Service Licenses -
                      <!-- /react-text -->
                      <mark>IBM</mark>
                    </span>
                    <span class="nds-lookup__result-meta nds-text-body_small">Opportunity • Close-Won</span>
                  </span>
                </span>
              </li>
              <li role="presentation">
                <span class="nds-lookup__item-action nds-media" id="option-05" role="option">
                  <svg class="nds-icon nds-icon-standard-contact nds-icon_small nds-media__figure" aria-hidden="true">
                    <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#contact"></use>
                  </svg>
                  <span class="nds-media__body">
                    <span class="nds-lookup__result-text">
                      <!-- react-text: 69 -->Art Vandelay (
                      <!-- /react-text -->
                      <mark>IBM</mark>
                      <!-- react-text: 71 -->)
                      <!-- /react-text -->
                    </span>
                    <span class="nds-lookup__result-meta nds-text-body_small">User • Latex Salesman</span>
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
  </header>
</div>`);
  });
