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
return withExample(`
<div class="nds-communities-hero nds-is-relative nds-align_absolute-center">
    <div class="nds-is-absolute" style="height: 16rem; width: 100%; top:0">
        <div class="nds-communities-global_navigation">
            <div class="nds-context-bar">
                <nav class="nds-context-bar__mobile" role="navigation">
                    <slot name="dc-catalog-wrapper-small">
                        <svg class="nds-dc-menu-icon"> <svg height="32px" style="enable-background:new 0 0 32 32;"
                                version="1.1" viewBox="0 0 32 32" width="32px" xml:space="preserve"
                                xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                                <path
                                    d="M4,10h24c1.104,0,2-0.896,2-2s-0.896-2-2-2H4C2.896,6,2,6.896,2,8S2.896,10,4,10z M28,14H4c-1.104,0-2,0.896-2,2  s0.896,2,2,2h24c1.104,0,2-0.896,2-2S29.104,14,28,14z M28,22H4c-1.104,0-2,0.896-2,2s0.896,2,2,2h24c1.104,0,2-0.896,2-2  S29.104,22,28,22z">
                                </path>
                            </svg></svg>
                        <div class="nds-dc-mobile-menu-list" style="display:none">
                            <svg class="nds-dc-menu-icon"> <svg viewport="0 0 12 12" version="1.1"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <line x1="1" y1="11" x2="11" y2="1" stroke="white" stroke-width="2"></line>
                                    <line x1="1" y1="1" x2="11" y2="11" stroke="white" stroke-width="2"></line>
                                </svg> </svg>
                            <ul>
                                <li class="nds-dc-catalogMobile active" data-catalog-code="mobile">
                                    Mobile
                                </li>
                                <li class="nds-dc-catalogMobile" data-catalog-code="plan">
                                    Plans
                                </li>
                                <li class="nds-dc-catalogMobile" data-catalog-code="business">
                                    Business
                                </li>
                                <li class="nds-dc-catalogMobile" data-catalog-code="accessories">
                                    Accessories
                                </li>
                                <li class="nds-dc-catalogMobile" data-catalog-code="voice">
                                    Voice
                                </li>
                                <li class="nds-dc-catalogMobile" data-catalog-code="television">
                                    Television
                                </li>
                                <li class="nds-dc-catalogMobile" data-catalog-code="internet">
                                    Internet
                                </li>
                                <li class="nds-dc-catalogMobile" data-catalog-code="business">
                                    Business
                                </li>
                            </ul>
                        </div>
                    </slot>
                </nav>
                <div class="nds-context-bar__primary">
                    <div
                        class="nds-context-bar__item nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-no-hover">
                        <span class="nds-context-bar__label-action nds-context-bar__app-name">
                            <div class="nds-global-header__item">
                                <div class="nds-global-header__logo">
                                    <img src="/assets/images/communities/demo/logo.png" alt="">
                                </div>
                            </div>
                        </span>
                    </div>
                </div>
                <nav class="nds-context-bar__secondary" role="navigation">
                    <ul class="nds-grid">
                        <li class="nds-context-bar__item">
                            <a href="javascript:void(0);" class="nds-context-bar__label-action" title="Home">
                                <span class="nds-truncate" title="Home">Home</span>
                            </a>
                        </li>
                        <li class="nds-context-bar__item nds-is-active">
                            <a href="javascript:void(0);" class="nds-context-bar__label-action" title="Menu Item">
                                <span class="nds-assistive-text">Current Page:</span>
                                <span class="nds-truncate" title="Products">Products</span>
                            </a>
                        </li>
                        <li class="nds-context-bar__item">
                            <a href="javascript:void(0);" class="nds-context-bar__label-action" title="Menu Item 0">
                                <span class="nds-truncate" title="Tools & Resources">Tools & Resources</span>
                            </a>
                        </li>
                        <li class="nds-context-bar__item">
                            <a href="javascript:void(0);" class="nds-context-bar__label-action" title="Menu Item 1">
                                <span class="nds-truncate" title="FAQ">FAQ</span>
                            </a>
                        </li>
                    </ul>
                </nav>
                <div class="nds-context-bar__actions">
                    <ul class="nds-communities-card nds-list_horizontal nds-wrap nds-has-dividers_right">
                        <li class="nds-item">
                            <button class="nds-button nds-button_icon" aria-haspopup="true">
                                <svg class="nds-button__icon" aria-hidden="true">
                                    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#search"></use>
                                </svg>
                                <span class="nds-assistive-text">Search</span>
                            </button>
                        </li>
                        <li class="nds-item">
                            <button class="nds-button nds-button_icon" aria-haspopup="true">
                                <svg class="nds-button__icon" aria-hidden="true">
                                    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#cart"></use>
                                </svg>
                                <span class="nds-assistive-text">Cart</span>
                            </button>
                        </li>
                        <li class="nds-item">
                            <button class="nds-theme_inverse nds-text-link" aria-haspopup="true">Sign In</button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    <div class="nds-communities-card nds-is-absolute">
        <div
            class="nds-text-heading_large nds-align_absolute-center nds-large-size_3-of-4 nds-text-align_center nds-m-bottom_large nds-is-relative">
            <div>Get personalized service from a local agent</div>
        </div>
        <div class="nds-communities-search nds-card nds-grid nds-grid_wrap nds-p-around_small">
            <div class="nds-form-element nds-m-right_small nds-size_7-of-8">
                <div class="nds-form-element__control">
                    <input type="text" id="text-input-id-1" class="nds-input" placeholder="Enter Your Zip"
                        value="Enter Your Zip" />
                </div>
            </div>
            <div class="nds-communities-search__button">
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
    <div class="nds-hero">
        <img alt="Cityscape Image" src="./assets/images/communities/demo/cityscape.png" title="Cityscape" />
    </div>
</div>
`);
});
