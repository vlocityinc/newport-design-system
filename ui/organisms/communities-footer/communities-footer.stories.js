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

storiesOf(`${base}`.replace(/(^\/)|(\/$)/g, ''),  module)
.addDecorator(withKnobs)
.addDecorator(commentToHTML(scss))
.addDecorator(withDocs(notes))
.add('Default', () => {
const value = radios(label, options, defaultValue);
return withExample(`<div class="nds-communities-footer">
    <ul class="nds-communities-footer__body nds-grid nds-grid_wrap nds-accordion">

        <li class="nds-accordion__list-item nds-large-size_1-of-4 nds-size_1-of-1 nds-grid nds-grid_wrap">
            <section class="nds-accordion__section nds-is-open">
                <div class="nds-accordion__summary">
                    <div
                        class="nds-communities-footer_col-header nds-text-title_caps nds-text-color_inverse nds-text-heading_medium">
                        Contact Us
                    </div>
                    <h3 class="nds-accordion__summary-heading">
                        <button aria-controls="accordion-details-01" aria-expanded="true"
                            class="nds-button nds-button_reset nds-accordion__summary-action">
                            <svg class="nds-accordion__summary-action-icon nds-button__icon nds-button__icon_left"
                                aria-hidden="true">
                                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                            </svg>
                            <span
                                class="nds-truncate nds-text-title_caps nds-text-color_inverse nds-text-heading_medium"
                                title="Contact Us">Contact Us</span>
                        </button>
                    </h3>
                </div>
                <div aria-hidden="true" class="nds-communities-footer__col-content nds-accordion__content"
                    id="accordion-details-01">
                    <ul class="nds-action nds-communities-footer__accordion-section">
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
                        </li>
                    </ul>
                </div>
            </section>
            <div class="nds-divider"></div>
        </li>

        <li class="nds-accordion__list-item nds-large-size_1-of-4 nds-size_1-of-1 nds-grid nds-grid_wrap">
            <section class="nds-accordion__section">
                <div class="nds-accordion__summary">
                    <div
                        class="nds-communities-footer_col-header nds-text-title_caps nds-text-color_inverse nds-text-heading_medium">
                        Shop
                    </div>
                    <h3 class="nds-accordion__summary-heading">
                        <button aria-controls="accordion-details-02" aria-expanded="true"
                            class="nds-button nds-button_reset nds-accordion__summary-action">
                            <svg class="nds-accordion__summary-action-icon nds-button__icon nds-button__icon_left"
                                aria-hidden="true">
                                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#add"></use>
                            </svg>
                            <span
                                class="nds-truncate nds-text-title_caps nds-text-color_inverse nds-text-heading_medium"
                                title="Shop">Shop</span>
                        </button>
                    </h3>
                </div>
                <div aria-hidden="true" class="nds-communities-footer__col-content nds-accordion__content"
                    id="accordion-details-02">
                    <ul class="nds-action nds-communities-footer__accordion-section">
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
                        class="nds-communities-footer_col-header nds-text-title_caps nds-text-color_inverse nds-text-heading_medium">
                        Help & Support
                    </div>
                    <h3 class="nds-accordion__summary-heading">
                        <button aria-controls="accordion-details-03" aria-expanded="true"
                            class="nds-button nds-button_reset nds-accordion__summary-action">
                            <svg class="nds-accordion__summary-action-icon nds-button__icon nds-button__icon_left"
                                aria-hidden="true">
                                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#add"></use>
                            </svg>
                            <span
                                class="nds-truncate nds-text-title_caps nds-text-color_inverse nds-text-heading_medium"
                                title="Help & Support">Help & Support</span>
                        </button>
                    </h3>
                </div>
                <div aria-hidden="true" class="nds-communities-footer__col-content nds-accordion__content"
                    id="accordion-details-03">
                    <ul class="nds-action nds-communities-footer__accordion-section">
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
                        class="nds-communities-footer_col-header nds-text-title_caps nds-text-color_inverse nds-text-heading_medium">
                        Connect With AT&T
                    </div>
                    <h3 class="nds-accordion__summary-heading">
                        <button aria-controls="accordion-details-04" aria-expanded="true"
                            class="nds-button nds-button_reset nds-accordion__summary-action">
                            <svg class="nds-accordion__summary-action-icon nds-button__icon nds-button__icon_left"
                                aria-hidden="true">
                                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#add"></use>
                            </svg>
                            <span
                                class="nds-truncate nds-text-title_caps nds-text-color_inverse nds-text-heading_medium"
                                title="Connect With AT&T">Connect With AT&T</span>
                        </button>
                    </h3>
                </div>
                <div aria-hidden="true" class="nds-communities-footer__col-content nds-accordion__content"
                    id="accordion-details-04">
                    <ul class="nds-action nds-communities-footer__accordion-section">
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
