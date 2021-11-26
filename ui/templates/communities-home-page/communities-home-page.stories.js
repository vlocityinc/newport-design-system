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
<div class="nds-communities-page-content nds-communities-page-content__list nds-m-vertical_xx-large">
        <div class="nds-text-align_center">
            <div class="nds-text-heading_large nds-m-bottom_large nds-align_absolute-center"><b>Insure the things that
                    matter most.</b></div>
            <div class="nds-text-heading_medium nds-align_absolute-center">Policies & protection you can rely on,
                customized for your needs.</div>
        </div>
        <div class="nds-communities-actions-group nds-grid nds-wrap nds-m-top_xx-large nds-p-top_large">
            <div
                class="nds-communities-action nds-large-size_1-of-4 nds-medium-size_1-of-4 nds-size_1-of-2 nds-m-bottom_large">
                <div class="nds-align_absolute-center">
                    <img class="nds-icon nds-icon_xx-large nds-is-absolute" alt="health"
                        src="./assets/images/communities/icons/auto.svg" title="Health" />
                    <img class="nds-icon nds-icon_xx-large" alt="ellipse" src="./assets/images/communities/icons/ellipse.svg"
                        title="Ellipse" />
                </div>
                <div class="nds-text-heading_medium nds-align_absolute-center"><b>Health Insurance</b></div>
                <div class="nds-align_absolute-center">
                    <button class="nds-button nds-button_link" label="Get a quote">Get a quote</button>
                </div>
            </div>

            <div
                class="nds-communities-action nds-large-size_1-of-4 nds-medium-size_1-of-4 nds-size_1-of-2 nds-m-bottom_large">
                <div class="nds-align_absolute-center">
                    <img class="nds-icon nds-icon_xx-large nds-is-absolute" alt="auto"
                        src="./assets/images/communities/icons/auto.svg" title="Auto" />
                    <img class="nds-icon nds-icon_xx-large" alt="ellipse" src="./assets/images/communities/icons/ellipse.svg"
                        title="Ellipse" />
                </div>
                <div class="nds-text-heading_medium nds-align_absolute-center"><b>Auto & Property</b></div>
                <div class="nds-align_absolute-center">
                    <button class="nds-button nds-button_link" label="Get a quote">Get a quote</button>
                </div>
            </div>

            <div
                class="nds-communities-action nds-large-size_1-of-4 nds-medium-size_1-of-4 nds-size_1-of-2 nds-m-bottom_large">
                <div class="nds-align_absolute-center">
                    <img class="nds-icon nds-icon_xx-large nds-is-absolute" alt="homeowners"
                        src="./assets/images/communities/icons/auto.svg" title="Homeowners" />
                    <img class="nds-icon nds-icon_xx-large" alt="ellipse" src="./assets/images/communities/icons/ellipse.svg"
                        title="Ellipse" />
                </div>
                <div class="nds-text-heading_medium nds-align_absolute-center"><b>Homeowners</b></div>
                <div class="nds-align_absolute-center">
                    <button class="nds-button nds-button_link" label="Get a quote">Get a quote</button>
                </div>
            </div>

            <div
                class="nds-communities-action nds-large-size_1-of-4 nds-medium-size_1-of-4 nds-size_1-of-2 nds-m-bottom_large">
                <div class="nds-align_absolute-center">
                    <img class="nds-icon nds-icon_xx-large nds-is-absolute" alt="shield"
                        src="./assets/images/communities/icons/auto.svg" title="Shield" />
                    <img class="nds-icon nds-icon_xx-large" alt="ellipse" src="./assets/images/communities/icons/ellipse.svg"
                        title="Ellipse" />
                </div>
                <div class="nds-text-heading_medium nds-align_absolute-center"><b>Life Insurance</b></div>
                <div class="nds-align_absolute-center">
                    <button class="nds-button nds-button_link" label="Get a quote">Get a quote</button>
                </div>

            </div>
        </div>
        <div class="nds-text-align_center nds-m-vertical_x-large nds-p-vertical_x-large">
            <div class="nds-text-heading_large nds-m-bottom_large nds-align_absolute-center"><b>What Customers Are
                    Saying</b></div>
            <div class="nds-text-heading_medium nds-align_absolute-center">Over 2,329 Happy Customers</div>
        </div>
        <div class="nds-carousel nds-m-vertical-xx-large nds-p-bottom_x-large">
    <div class="nds-carousel__stage">
        <div class="nds-carousel__panels" style="transform:translateX(-5%)">
            <div id="content-id-01" class="nds-carousel__panel" role="tabpanel" aria-hidden="true"
                aria-labelledby="indicator-id-01">
                <a href="javascript:void(0);" class="nds-carousel__panel-action nds-text-link_reset" tabindex="-1">
                    <div class="nds-carousel__image nds-align_absolute-center">
                        <img src="./assets/images/communities/demo/icon.png" alt="Visit App Exchange" />
                    </div>
                    <div class="nds-carousel__content">
                        <h2 class="nds-carousel__content-title">Jake P</h2>
                        <p>The simplest and easiest insurance I’ve ever purchased, “old” insurance companies need to
                            step into the current century!!! 👏 👏 👏</p>
                    </div>
                </a>
            </div>
            <div id="content-id-02" class="nds-carousel__panel" role="tabpanel" aria-hidden="false"
                aria-labelledby="indicator-id-02">
                <a href="javascript:void(0);" class="nds-carousel__panel-action nds-text-link_reset" tabindex="0">
                    <div class="nds-carousel__image nds-align_absolute-center">
                        <img src="./assets/images/communities/demo/icon.png" alt="Click to Customize" />
                    </div>
                    <div class="nds-carousel__content">
                        <h2 class="nds-carousel__content-title">Jake P</h2>
                        <p>The simplest and easiest insurance I’ve ever purchased, “old” insurance companies need to
                            step into the current century!!! 👏 👏 👏</p>
                    </div>
                </a>
            </div>
            <div id="content-id-03" class="nds-carousel__panel" role="tabpanel" aria-hidden="true"
                aria-labelledby="indicator-id-03">
                <a href="javascript:void(0);" class="nds-carousel__panel-action nds-text-link_reset" tabindex="-1">
                    <div class="nds-carousel__image nds-align_absolute-center">
                        <img src="./assets/images/communities/demo/icon.png" alt="Download SalesforceA" />
                    </div>
                    <div class="nds-carousel__content">
                        <h2 class="nds-carousel__content-title">Jake P</h2>
                        <p>The simplest and easiest insurance I’ve ever purchased, “old” insurance companies need to
                            step into the current century!!! 👏 👏 👏</p>
                    </div>
                </a>
            </div>
            <div id="content-id-04" class="nds-carousel__panel" role="tabpanel" aria-hidden="true"
                aria-labelledby="indicator-id-04">
                <a href="javascript:void(0);" class="nds-carousel__panel-action nds-text-link_reset" tabindex="-1">
                    <div class="nds-carousel__image nds-align_absolute-center">
                        <img src="./assets/images/communities/demo/icon.png" alt="Download SalesforceA" />
                    </div>
                    <div class="nds-carousel__content">
                        <h2 class="nds-carousel__content-title">Jake P</h2>
                        <p>The simplest and easiest insurance I’ve ever purchased, “old” insurance companies need to
                            step into the current century!!! 👏 👏 👏</p>
                    </div>
                </a>
            </div>
            <div id="content-id-05" class="nds-carousel__panel" role="tabpanel" aria-hidden="true"
                aria-labelledby="indicator-id-05">
                <a href="javascript:void(0);" class="nds-carousel__panel-action nds-text-link_reset" tabindex="-1">
                    <div class="nds-carousel__image nds-align_absolute-center">
                        <img src="./assets/images/communities/demo/icon.png" alt="Visit App Exchange" />
                    </div>
                    <div class="nds-carousel__content">
                        <h2 class="nds-carousel__content-title">Jake P</h2>
                        <p>The simplest and easiest insurance I’ve ever purchased, “old” insurance companies need to
                            step into the current century!!! 👏 👏 👏</p>
                    </div>
                </a>
            </div>
            <div id="content-id-06" class="nds-carousel__panel" role="tabpanel" aria-hidden="true"
                aria-labelledby="indicator-id-06">
                <a href="javascript:void(0);" class="nds-carousel__panel-action nds-text-link_reset" tabindex="-1">
                    <div class="nds-carousel__image nds-align_absolute-center">
                        <img src="./assets/images/communities/demo/icon.png" alt="Download SalesforceA" />
                    </div>
                    <div class="nds-carousel__content">
                        <h2 class="nds-carousel__content-title">Jake P</h2>
                        <p>The simplest and easiest insurance I’ve ever purchased, “old” insurance companies need to
                            step into the current century!!! 👏 👏 👏</p>
                    </div>
                </a>
            </div>
        </div>
        <ul class="nds-carousel__indicators" role="tablist">
            <li class="nds-carousel__indicator" role="presentation">
                <a id="indicator-id-01" class="nds-carousel__indicator-action" href="javascript:void(0);" role="tab"
                    tabindex="-1" aria-selected="false" aria-controls="content-id-01" title="Visit App Exchange tab">
                    <span class="nds-assistive-text">Visit App Exchange tab</span>
                </a>
            </li>
            <li class="nds-carousel__indicator" role="presentation">
                <a id="indicator-id-02" class="nds-carousel__indicator-action nds-is-active" href="javascript:void(0);"
                    role="tab" tabindex="0" aria-selected="true" aria-controls="content-id-02"
                    title="Click to Customize tab">
                    <span class="nds-assistive-text">Click to Customize tab</span>
                </a>
            </li>
            <li class="nds-carousel__indicator" role="presentation">
                <a id="indicator-id-03" class="nds-carousel__indicator-action" href="javascript:void(0);" role="tab"
                    tabindex="-1" aria-selected="false" aria-controls="content-id-03" title="Download SalesforceA tab">
                    <span class="nds-assistive-text">Download Salesforce A tab</span>
                </a>
            </li>
        </ul>
    </div>
</div>
        <div class="nds-communities-home-img-list nds-m-bottom_xx-large">
            <div class="nds-media nds-media_center nds-p-vertical_xx-large">
                <div class="nds-media__body nds-large-size_1-of-2 nds-size_1-of-1 nds-p-around_xx-large">
                    <div class="nds-text-heading_large nds-m-bottom_large"><b>Home is where the ❤️ is.</b></div>
                    <div class="nds-text-heading_medium nds-m-bottom_large">From theft to natural disasters, whatever it is — we’ve got you
                        covered.</div>
                    <button class="nds-button nds-button_brand">Homeowners Insurance</button>
                </div>
                <div class="nds-media__figure nds-media__figure_reverse nds-large-size_1-of-2 nds-size_1-of-1">
                    <span class="nds-size_1-of-1">
                        <img alt="Home Interior" src="/assets/images/communities/demo/article.png" title="Home Interior">
                    </span>
                </div>
            </div>

            <div class="nds-media nds-media_center nds-p-vertical_xx-large">
                <div class="nds-media__figure nds-large-size_1-of-2 nds-size_1-of-1">
                    <span class="nds-size_1-of-1">
                        <img alt="Person name" src="/assets/images/communities/demo/article.png" title="Auto Image">
                    </span>
                </div>
                <div class="nds-media__body nds-large-size_1-of-2 nds-size_1-of-1 nds-p-around_xx-large">
                    <div class="nds-text-heading_large nds-m-bottom_large"><b>Vroom, Vroom.</b></div>
                    <div class="nds-text-heading_medium nds-m-bottom_large">From accidents and windshield damage to lawsuits and more, we have
                        affordable insurance options to
                        protect against just about anything.</div>
                    <button class="nds-button nds-button_brand">Auto Insurance</button>
                </div>
            </div>

            <div class="nds-media nds-media_center nds-p-vertical_xx-large">
                <div class="nds-media__body nds-large-size_1-of-2 nds-size_1-of-1 nds-p-around_xx-large">
                    <div class="nds-text-heading_large nds-m-bottom_large"><b>Protect what matters most.</b></div>
                    <div class="nds-text-heading_medium nds-m-bottom_large">Medical insurance provides peace of mind, access to affordable health
                        care, and a safeguard from
                        finanacial loss for you and your family.</div>
                    <button class="nds-button nds-button_brand">Health Insurance</button>
                </div>
                <div class="nds-media__figure nds-media__figure_reverse nds-large-size_1-of-2 nds-size_1-of-1">
                    <span class="nds-size_1-of-1">
                        <img alt="Protect Image" src="/assets/images/communities/demo/article.png" title="Protect Img">
                    </span>
                </div>
            </div>

        </div>

        <div
            class="nds-text-heading_large nds-m-bottom_large nds-align_absolute-center nds-p-top_large nds-text-align_center">
            <b>Learn more about coverages</b></div>
            <div class="nds-communities-articles-group nds-grid nds-wrap nds-m-top_large nds-align_absolute-center">
                <div class="nds-communities-article nds-large-size_1-of-5 nds-medium-size_1-of-4 nds-size_1-of-1 nds-m-around_small">
                    <img alt="Article" src="./assets/images/communities/demo/article.png" title="Article" />
                    <div class="nds-communities-article_text nds-p-around_medium">
                        <div class="nds-text-title_caps nds-m-bottom_small"><b>Homeowners</b></div>
                        <div class="nds-text-heading_small"><b>How to Prevent Fires, Inside and Outside the Home.</b></div>
                    </div>
                </div>
                <div class="nds-communities-article nds-large-size_1-of-5 nds-medium-size_1-of-4 nds-size_1-of-1 nds-m-around_small">
                    <img alt="Article" src="./assets/images/communities/demo/article.png" title="Article" />
                    <div class="nds-communities-article_text nds-p-around_medium">
                        <div class="nds-text-title_caps nds-m-bottom_small"><b>Homeowners</b></div>
                        <div class="nds-text-heading_small"><b>Umbrella Insurance. Do you really need it?</b></div>
                    </div>
                </div>
                <div class="nds-communities-article nds-large-size_1-of-5 nds-medium-size_1-of-4 nds-size_1-of-1 nds-m-around_small">
                    <img alt="Article" src="./assets/images/communities/demo/article.png" title="Article" />
                    <div class="nds-communities-article_text nds-p-around_medium">
                        <div class="nds-text-title_caps nds-m-bottom_small"><b>Homeowners</b></div>
                        <div class="nds-text-heading_small"><b>How to Prevent Fires, Inside and Outside the Home.</b></div>
                    </div>
                </div>
                <div class="nds-communities-article nds-large-size_1-of-5 nds-medium-size_1-of-4 nds-size_1-of-1 nds-m-around_small">
                    <img alt="Article" src="./assets/images/communities/demo/article.png" title="Article" />
                    <div class="nds-communities-article_text nds-p-around_medium">
                        <div class="nds-text-title_caps nds-m-bottom_small"><b>Homeowners</b></div>
                        <div class="nds-text-heading_small"><b>Rules of the road for Safe Driving.</b></div>
                    </div>
                </div>
            </div>


</div>
<div class="nds-communities-card nds-communities-search-card nds-text-color_inverse nds-grid nds-grid_wrap nds-m-top_x-large">
    <div class="nds-large-size_1-of-2 nds-p-left_x-small nds-m-bottom_large nds-m-right_small">
        <div class="nds-text-heading_medium">Find an agent today.</div>
        <div class="nds-text-body_medium">Message us or give us a call at (987) 654-3210</div>
    </div>
    <div class="nds-large-size_1-of-2">
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
</div>
<div class="nds-communities-footer">
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
