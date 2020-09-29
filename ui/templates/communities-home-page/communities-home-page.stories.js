import { storiesOf } from '@storybook/html';
import base from 'paths.macro';
import { withKnobs, radios } from '@storybook/addon-knobs';
import {
withExample,
withDocs,
commentToHTML
} from '../../../scripts/storybook';
import scss from './base/_index.scss';
import notes from './doc.md';

const label = 'Open Sections';
const options = {
None: '',
One: 'One',
Two: 'Two',
Three: 'Three'
};
const defaultValue = '';

storiesOf(`${base}`, module)
.addDecorator(withKnobs)
.addDecorator(commentToHTML(scss))
.addDecorator(withDocs(notes))
.add('Default', () => {
const value = radios(label, options, defaultValue);
return withExample(`
<div class="nds-communities-hero nds-is-relative nds-align_absolute-center">
  <div class="nds-is-absolute nds-text-align_center nds-size_1-of-1">
    <div class="nds-text-heading_large nds-text-color_inverse">
      <div>Get personalized service from</div>
      <div>a local agent</div>
    </div>
    <div class="nds-align_absolute-center nds-m-top_xx-large">
      <div class="nds-communities-search nds-card nds-grid nds-grid_wrap nds-p-around_small nds-size_1-of-3">
        <div class="nds-form-element nds-m-right_small nds-size_7-of-8">
          <div class="nds-form-element__control">
            <input type="text" id="text-input-id-1" class="nds-input" placeholder="Enter Your Zip" />
          </div>
        </div>
        <div class="nds-communities-search_button">
          <button class="nds-button_text nds-button nds-button_brand">Find an Agent</button>
          <button class="nds-button nds-button_brand nds-button_icon nds-button_icon-border-filled"
            aria-haspopup="true">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevronright"></use>
            </svg>
            <span class="nds-assistive-text">More Options</span>
          </button>
        </div>
      </div>
    </div>
  </div>
  <img class="nds-hero" alt="Cityscape Image" src="assets/images/communities/cityscape.svg" title="Community Hero" />
  <img class="nds-hero-mobile" alt="CityScapeImage" src="assets/images/communities/cityscape-mobile.svg"
    title="Community Hero" />
</div>
<div class="nds-m-around_xx-large">
    <div class="nds-text-heading_large nds-align_absolute-center">Page Content...</div>
</div>
<div class="nds-communities-search-card nds-text-color_inverse nds-grid nds-grid_wrap">
  <div class="nds-large-size_1-of-2 nds-p-left_x-small nds-communities-search-card__info-col">
      <div class="nds-communities-search-card_heading">Find an agent today.</div>
      <div class="nds-text-body_medium">Message us or give us a call at (987) 654-3210</div>
  </div>
  <div class="nds-communities-search-card__search-col nds-large-size_1-of-2">
      <div class="nds-communities-search nds-card nds-grid nds-grid_wrap nds-p-around_small">
          <div class="nds-form-element nds-m-right_small nds-size_7-of-8">
              <div class="nds-form-element__control">
                  <input type="text" id="text-input-id-1" class="nds-input" placeholder="Enter Your Zip" />
              </div>
          </div>
          <div class="nds-communities-search_button">
              <button class="nds-button_text nds-button nds-button_brand">Find an Agent</button>
              <button class="nds-button nds-button_brand nds-button_icon nds-button_icon-border-filled"
                  aria-haspopup="true">
                  <svg class="nds-button__icon" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevronright"></use>
                  </svg>
                  <span class="nds-assistive-text">More Options</span>
              </button>
          </div>
      </div>
  </div>
</div>
<div class="nds-footer-communities">
  <ul class="nds-footer-communities_body nds-grid nds-grid_wrap nds-accordion">

    <li class="nds-accordion__list-item nds-large-size_1-of-4 nds-size_1-of-1 nds-grid nds-grid_wrap">
      <section class="nds-accordion__section nds-is-open">
        <div class="nds-accordion__summary">
          <div
            class="nds-footer-communities_col-header nds-text-title_caps nds-text-color_inverse nds-text-heading_medium">
            Contact Us
          </div>
          <h3 class="nds-accordion__summary-heading">
            <button aria-controls="accordion-details-01" aria-expanded="true"
              class="nds-button nds-button_reset nds-accordion__summary-action">
              <svg class="nds-accordion__summary-action-icon nds-button__icon nds-button__icon_left" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
              </svg>
              <span class="nds-truncate nds-text-title_caps nds-text-color_inverse nds-text-heading_medium"
                title="Contact Us">Contact Us</span>
            </button>
          </h3>
        </div>
        <div aria-hidden="true" class="nds-footer-communities_col-content nds-accordion__content" id="accordion-details-01">
          <ul class="nds-action nds-footer-communities__accordion-section">
            <li class="nds-size_1-of-1 nds-item nds-action_inline nds-p-bottom_small">
              <a role="menuitem" tabindex="0" class="nds-action_item">
                <span class="nds-action_text nds-text-title_caps">View or Pay My Bill</span>
              </a>
            </li>
            <li class="nds-size_1-of-1 nds-item nds-action_inline nds-p-bottom_small">
              <a role="menuitem" tabindex="0" class="nds-action_item">
                <span class="nds-action_text nds-text-title_caps">Go Paperless</span>
              </a>
            </li>
            <li class="nds-size_1-of-1 nds-item nds-action_inline nds-p-bottom_small">
              <a role="menuitem" tabindex="0" class="nds-action_item">
                <span class="nds-action_text nds-text-title_caps">Check Order Status</span>
              </a>
            </li>
            <li class="nds-size_1-of-1 nds-item nds-action_inline nds-p-bottom_small">
              <a role="menuitem" tabindex="0" class="nds-action_item">
                <span class="nds-action_text nds-text-title_caps">View Wireless Coverage Map</span>
              </a>
            </li>
            <li class="nds-size_1-of-1 nds-item nds-action_inline nds-p-bottom_small">
              <a role="menuitem" tabindex="0" class="nds-action_item">
                <span class="nds-action_text nds-text-title_caps">Check Wireless Usage</span>
              </a>
          </ul>
        </div>
      </section>
      <div class="nds-divider"></div>
    </li>

    <li class="nds-accordion__list-item nds-large-size_1-of-4 nds-size_1-of-1 nds-grid nds-grid_wrap">
      <section class="nds-accordion__section">
        <div class="nds-accordion__summary">
          <div
            class="nds-footer-communities_col-header nds-text-title_caps nds-text-color_inverse nds-text-heading_medium">
            Shop
          </div>
          <h3 class="nds-accordion__summary-heading">
            <button aria-controls="accordion-details-02" aria-expanded="true"
              class="nds-button nds-button_reset nds-accordion__summary-action">
              <svg class="nds-accordion__summary-action-icon nds-button__icon nds-button__icon_left" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#add"></use>
              </svg>
              <span class="nds-truncate nds-text-title_caps nds-text-color_inverse nds-text-heading_medium"
                title="Shop">Shop</span>
            </button>
          </h3>
        </div>
        <div aria-hidden="true" class="nds-footer-communities_col-content nds-accordion__content" id="accordion-details-02">
          <ul class="nds-action nds-footer-communities__accordion-section">
            <li class="nds-size_1-of-1 nds-item nds-action_inline nds-p-bottom_small">
              <a role="menuitem" tabindex="0" class="nds-action_item">
                <span class="nds-action_text nds-text-title_caps">Iphone 7</span>
              </a>
            </li>
            <li class="nds-size_1-of-1 nds-item nds-action_inline nds-p-bottom_small">
              <a role="menuitem" tabindex="0" class="nds-action_item">
                <span class="nds-action_text nds-text-title_caps">Samsung Galaxy 57</span>
              </a>
            </li>
            <li class="nds-size_1-of-1 nds-item nds-action_inline nds-p-bottom_small">
              <a role="menuitem" tabindex="0" class="nds-action_item">
                <span class="nds-action_text nds-text-title_caps">Cell Phones & Tablets</span>
              </a>
            </li>
            <li class="nds-size_1-of-1 nds-item nds-action_inline nds-p-bottom_small">
              <a role="menuitem" tabindex="0" class="nds-action_item">
                <span class="nds-action_text nds-text-title_caps">Wireless Plans</span>
              </a>
            </li>
            <li class="nds-size_1-of-1 nds-item nds-action_inline nds-p-bottom_small">
              <a role="menuitem" tabindex="0" class="nds-action_item">
                <span class="nds-action_text nds-text-title_caps">Deals on Smartphones</span>
              </a>
          </ul>
        </div>
      </section>
      <div class="nds-divider"></div>
    </li>

    <li class="nds-accordion__list-item nds-large-size_1-of-4 nds-size_1-of-1 nds-grid nds-grid_wrap">
      <section class="nds-accordion__section">
        <div class="nds-accordion__summary">
          <div
            class="nds-footer-communities_col-header nds-text-title_caps nds-text-color_inverse nds-text-heading_medium">
            Help & Support
          </div>
          <h3 class="nds-accordion__summary-heading">
            <button aria-controls="accordion-details-03" aria-expanded="true"
              class="nds-button nds-button_reset nds-accordion__summary-action">
              <svg class="nds-accordion__summary-action-icon nds-button__icon nds-button__icon_left" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#add"></use>
              </svg>
              <span class="nds-truncate nds-text-title_caps nds-text-color_inverse nds-text-heading_medium"
                title="Help & Support">Help & Support</span>
            </button>
          </h3>
        </div>
        <div aria-hidden="true" class="nds-footer-communities_col-content nds-accordion__content" id="accordion-details-03">
          <ul class="nds-action nds-footer-communities__accordion-section">
            <li class="nds-size_1-of-1 nds-item nds-action_inline nds-p-bottom_small">
              <a role="menuitem" tabindex="0" class="nds-action_item">
                <span class="nds-action_text nds-text-title_caps">Contact Us</span>
              </a>
            </li>
            <li class="nds-size_1-of-1 nds-item nds-action_inline nds-p-bottom_small">
              <a role="menuitem" tabindex="0" class="nds-action_item">
                <span class="nds-action_text nds-text-title_caps">Billing</span>
              </a>
            </li>
            <li class="nds-size_1-of-1 nds-item nds-action_inline nds-p-bottom_small">
              <a role="menuitem" tabindex="0" class="nds-action_item">
                <span class="nds-action_text nds-text-title_caps">Wireless</span>
              </a>
            </li>
            <li class="nds-size_1-of-1 nds-item nds-action_inline nds-p-bottom_small">
              <a role="menuitem" tabindex="0" class="nds-action_item">
                <span class="nds-action_text nds-text-title_caps">Uverse Internet</span>
              </a>
            </li>
            <li class="nds-size_1-of-1 nds-item nds-action_inline nds-p-bottom_small">
              <a role="menuitem" tabindex="0" class="nds-action_item">
                <span class="nds-action_text nds-text-title_caps">Uverse Tv</span>
              </a>
          </ul>
        </div>
      </section>
      <div class="nds-divider"></div>
    </li>

    <li class="nds-accordion__list-item nds-large-size_1-of-4 nds-size_1-of-1 nds-grid nds-grid_wrap">
      <section class="nds-accordion__section">
        <div class="nds-accordion__summary">
          <div
            class="nds-footer-communities_col-header nds-text-title_caps nds-text-color_inverse nds-text-heading_medium">
            Connect With AT&T
          </div>
          <h3 class="nds-accordion__summary-heading">
            <button aria-controls="accordion-details-04" aria-expanded="true"
              class="nds-button nds-button_reset nds-accordion__summary-action">
              <svg class="nds-accordion__summary-action-icon nds-button__icon nds-button__icon_left" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#add"></use>
              </svg>
              <span class="nds-truncate nds-text-title_caps nds-text-color_inverse nds-text-heading_medium"
                title="Connect With AT&T">Connect With AT&T</span>
            </button>
          </h3>
        </div>
        <div aria-hidden="true" class="nds-footer-communities_col-content nds-accordion__content" id="accordion-details-04">
          <ul class="nds-action nds-footer-communities__accordion-section">
            <li class="nds-size_1-of-1 nds-item nds-action_inline nds-p-bottom_small">
              <a role="menuitem" tabindex="0" class="nds-action_item">
                <span class="nds-action_text nds-text-title_caps">Careers</span>
              </a>
            </li>
            <li class="nds-size_1-of-1 nds-item nds-action_inline nds-p-bottom_small">
              <a role="menuitem" tabindex="0" class="nds-action_item">
                <span class="nds-action_text nds-text-title_caps">Emergency Planning</span>
              </a>
            </li>
            <li class="nds-size_1-of-1 nds-item nds-action_inline nds-p-bottom_small">
              <a role="menuitem" tabindex="0" class="nds-action_item">
                <span class="nds-action_text nds-text-title_caps">Sustainability Report</span>
              </a>
            </li>
            <li class="nds-size_1-of-1 nds-item nds-action_inline nds-p-bottom_small">
              <a role="menuitem" tabindex="0" class="nds-action_item">
                <span class="nds-action_text nds-text-title_caps">Wireless Networking</span>
              </a>
            </li>
            <li class="nds-size_1-of-1 nds-item nds-action_inline nds-p-bottom_small">
              <a role="menuitem" tabindex="0" class="nds-action_item">
                <span class="nds-action_text nds-text-title_caps">Investor Relations</span>
              </a>
          </ul>
        </div>
      </section>
      <div class="nds-divider"></div>
    </li>

  </ul>
</div>`);
});