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
<div class="nds-grid nds-wrap">
    <div class="nds-col nds-size_12-of-12">
        <article class="nds-communities-policy-item nds-p-around_x-large nds-border_bottom">
            <section class="nds-grid nds-grid_align-spread">
                <div class="nds-grid nds-grid_align-start nds-size_2-of-3">
                    <div class="nds-size_1-of-12 nds-m-right_x-large">
                        <div class="nds-communities-icon_container nds-communities-icon-item nds-communities-custom-img nds-align_absolute-center nds-icon_container nds-p-around_x-small">
                            <img class="nds-icon nds-icon-text-default nds-icon_medium" style="fill: rgb(77, 103, 146);"
                                alt="health" src="./assets/icons/utility/shield.svg" title="auto" />
                        </div>
                    </div>
                    <div class="nds-communities-header-content">
                        <div class="nds-communities-title-container nds-grid">
                            <h2 class="nds-communities-title nds-communities-bold">2015 LexuLX250</h2>
                        </div>
                        <div>
                            <span class="nds-communities-separator-container nds-communities-title">Year: 2015<span
                                    class="nds-communities-separator nds-p-horizontal_xx-small">|</span></span><span
                                class="nds-communities-separator-container nds-communities-title">Est. Annual Mileage:
                                1-10000<span
                                    class="nds-communities-separator nds-p-horizontal_xx-small">|</span></span><span
                                class="nds-communities-separator-container nds-communities-title">Make: Audi<span
                                    class="nds-communities-separator nds-p-horizontal_xx-small">|</span></span>
                        </div>
                        <div class="nds-size_1-of-1 nds-m-top_small"><span
                                class="nds-communities-bold nds-text-link nds-m-right_xx-small">View fewer details</span>
                            <img class="nds-icon nds-m-right_xx-small nds-m-bottom_xxx-small nds-icon-text-default nds-icon_xx-small"
                                style="fill: rgb(0, 112, 210);" alt="right" src="./assets/icons/utility/right.svg"
                                title="right" />
                        </div>
                    </div>
                </div>
                <div class="nds-grid nds-grid_align-end nds-size_1-of-3">
                    <div aria-describedby="price-303"
                        class="nds-communities-title nds-text-align_right nds-grid nds-wrap">
                        <div class="nds-is-relative nds-m-right_xxx-small">
                            <div class="nds-communities-price-icon">
                                <div class="vlocity-btn nds-button_icon nds-m-bottom_xxx-small">
                                    <img style="fill: rgb(77, 103, 146);"
                                        class="nds-icon nds-icon-text-default nds-icon_x-small" alt="health"
                                        src="./assets/icons/utility/info.svg" title="auto" />
                                </div>
                            </div>
                            <div role="tooltip" id="price-303"
                                class="nds-popover nds-popover_tooltip nds-nubbin_bottom-right nds-rise-from-ground nds-communities-price-tooltip">
                                <div class="nds-popover__body">
                                    <div class="nds-grid nds-grid_align-spread">
                                        <div class="nds-m-right_small">Premium:</div>
                                        <div>£1,575.00</div>
                                    </div>
                                    <div class="nds-grid nds-grid_align-spread">
                                        <div class="nds-m-right_small">Taxes:</div>
                                        <div>£157.50</div>
                                    </div>
                                    <div class="nds-grid nds-grid_align-spread">
                                        <div class="nds-m-right_small">Fees:</div>
                                        <div>£25.00</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="nds-p-top_xx-small">£1,575.00</div>
                    </div>
                </div>
            </section>
            <section class="nds-grid nds-wrap">
                <div class="nds-size_1-of-12"></div>
                <div class="nds-size_11-of-12">
                    <div class="nds-communities-heading nds-communities-bold nds-p-vertical_medium nds-border_bottom nds-m-top_large">
                        Vehicle Info
                    </div>
                    <div class="nds-grid nds-wrap">
                        <div class="nds-col nds-size_1-of-1 nds-small-size_1-of-1">
                            <div class="nds-communities-attribute-container nds-m-around_small">
                                <div class="nds-p-bottom_xx-small">
                                    <div class="nds-grid nds-grid_align-spread nds-communities-attr">
                                        <div class="nds-communities-attr-label nds-size_1-of-2">
                                            <div>Estimated Annual Value</div>
                                        </div>
                                        <div class="nds-size_1-of-2 nds-text-align_left">
                                            <div class="nds-communities-attr-label nds-communities-attr-value">0-1000</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="nds-col nds-size_1-of-1 nds-small-size_1-of-1">
                            <div class="nds-communities-attribute-container nds-m-around_small">
                                <div class="nds-p-bottom_xx-small">
                                    <div class="nds-grid nds-grid_align-spread nds-communities-attr">
                                        <div class="nds-communities-attr-label nds-size_1-of-2">
                                            <div>Car Value</div>
                                        </div>
                                        <div class="nds-size_1-of-2 nds-text-align_left">
                                            <div class="nds-communities-attr-label nds-communities-attr-value">£10,575.00</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="nds-grid nds-wrap">
                        <div class="nds-col nds-size_1-of-1 nds-small-size_1-of-1">
                            <div class="nds-communities-attribute-container nds-m-around_small">
                                <div class="nds-p-bottom_xx-small">
                                    <div class="nds-grid nds-grid_align-spread nds-communities-attr">
                                        <div class="nds-communities-attr-label nds-size_1-of-2">
                                            <div>Year</div>
                                        </div>
                                        <div class="nds-size_1-of-2 nds-text-align_left">
                                            <div class="nds-communities-attr-label nds-communities-attr-value">2015</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="nds-col nds-size_1-of-1 nds-small-size_1-of-1">
                            <div class="nds-communities-attribute-container nds-m-around_small">
                                <div class="nds-p-bottom_xx-small">
                                    <div class="nds-grid nds-grid_align-spread nds-communities-attr">
                                        <div class="nds-communities-attr-label nds-size_1-of-2">
                                            <div>Make</div>
                                        </div>
                                        <div class="nds-size_1-of-2 nds-text-align_left">
                                            <div class="nds-communities-attr-label nds-communities-attr-value">Audi</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="nds-communities-heading nds-communities-bold nds-p-vertical_medium nds-border_bottom">
                        Coverages
                    </div>
                    <div class="nds-p-vertical_small nds-communities-heading">Covered Drivers</div>
                    <div class="nds-p-bottom_small">These drivers are covered under your policy for thivehicle</div>
                    <ul class="nds-grid nds-wrap nds-p-vertical_large">
                        <li class="nds-m-right_small">
                            <div class="nds-size_1-of-1 nds-align_absolute-center">
                                <div class="nds-icon_container nds-communities-icon_container nds-p-around_x-small nds-communities-icon-grandchild nds-border_bottom nds-border_right nds-border_left nds-border_top">
                                    <img class="nds-icon nds-icon-text-default nds-icon_medium"
                                        style="fill: rgb(255, 255, 255);" alt="health"
                                        src="./assets/icons/utility/user.svg" title="auto" />
                                </div>
                            </div>
                            <div class="nds-size_1-of-1">
                                <div data-grand-child-id="a4B5w000006zBR2EAM"><button type="button"
                                        label="undefined" class="vlocity-btn nds-button nds-button_base"><span
                                            class="btnLabel">*Joan Smith</span></button></div>
                            </div>
                        </li>
                        <li>
                            <div class="nds-size_1-of-1 nds-align_absolute-center">
                                <div class="nds-communities-icon_container nds-icon_container nds-p-around_x-small nds-border_bottom nds-border_right nds-border_left nds-border_top">
                                    <img class="nds-icon nds-icon-text-default nds-icon_medium"
                                        style="fill:rgb(0, 112, 210);" alt="health" src="./assets/icons/utility/add.svg"
                                        title="auto" />
                                </div>
                            </div>
                            <div class="nds-size_1-of-1">
                                <div data-grand-child-id="a4A5w000001XdqOEAS"><button type="button"
                                        label="undefined" class="vlocity-btn nds-button nds-button_base"><span
                                            class="btnLabel">Create New</span></button></div>
                            </div>
                        </li>
                    </ul>
                    <div>
                        <div class="nds-communities-coverage">
                            <div>
                                <article class="nds-grid nds-p-top_medium nds-p-bottom_large nds-communities-policy-item">
                                    <div class="nds-communities-custom-icon">
                                        <div class="nds-icon nds-icon-text-default nds-icon_medium">
                                            <?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" width="2rem"
                                                height="2rem" viewBox="0 0 100 100">
                                                <g style="fill: rgb(77, 103, 146);">
                                                    <path
                                                        d="m77.8 32.6c-3-0.9-5.6-3-7.3-5.7-1.3-2.1-1.4-6.9-4.6-6.9h-31.8c-3.3 0-3.3 4.8-4.6 6.9-2.1 3.3-4.8 4.1-8 6-3.3 1.9-0.2 9.9 0.5 12.7 3.1 11.1 9 21.4 18.2 28.7 2.6 2.1 5.4 3.9 8.4 5.4 2.7 1.4 7.2-2.5 9.2-4 5.2-3.7 9.5-8.4 12.9-13.7 2.9-4.6 5.1-9.6 6.7-14.8 0.6-2.1 1.2-4.2 1.6-6.4 0.4-1.8 1.3-4.6 0.7-6.4-0.2-0.8-1-1.5-1.9-1.8-4.6-1.4 1.4 0.4 0 0z m-4.4 7c-2.7 13.4-9.9 25.9-21.8 33.2l-1.6 1-1.6-1c-14.4-8.8-19.8-22.9-21.8-33.2l-0.4-2.1 1.8-1.1c3.1-1.9 6-5.2 7.7-8.7l0.8-1.8h27l0.5 1.3c1.7 3.8 4.8 7.4 8.5 9.5l1.3 0.7v0.1l-0.4 2.1z m-24.5-7.6c-2.3 0-7.9 0-9 1-1.9 1.7-3 4.2-5 5.9-2.1 1.8-1.1 3.6-0.4 6 1.4 4.2 3.3 8.3 5.9 12 1.3 1.9 2.8 3.7 4.5 5.3 0.5 0.5 5.1 5.1 5.1 2.2v-30.4c0-1.1 0-2-1.1-2z">
                                                    </path>
                                                </g>
                                            </svg>
                                        </div>
                                    </div>
                                    <div class="nds-p-top_medium nds-p-left_medium nds-communities-policy-item-coverages-container">
                                        <div class="nds-grid nds-grid_align-spread nds-grid_vertical-align-center">
                                            <div class="nds-p-right_medium">
                                                <h3 class="nds-text-heading_small">Roadside</h3>
                                            </div>
                                        </div>
                                        <div class="nds-communities-policy-item_category">
                                            <div>
                                                <div class="nds-grid nds-wrap">
                                                    <div class="nds-col nds-size_1-of-1 nds-small-size_1-of-1">
                                                        <div class="nds-communities-attribute-container nds-m-around_small">
                                                            <div class="nds-p-bottom_xx-small">
                                                                <div class="nds-grid nds-grid_align-spread nds-communities-attr nds-communities-attr_coverage nds-p-bottom_small nds-m-horizontal_medium nds-p-left_xx-small">
                                                                    <div class="nds-communities-attr-label nds-size_1-of-2 nds-p-left_xxx-small">
                                                                        <div>Roadside</div>
                                                                    </div>
                                                                    <div class="nds-size_1-of-2 nds-text-align_left">
                                                                        <div class="nds-communities-attr-label nds-communities-attr-value">Coverage selected</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            </div>
                        </div>
                        <div class="nds-communities-coverage">
                            <div>
                                <article class="nds-grid nds-p-top_medium nds-p-bottom_large nds-communities-policy-item">
                                    <div class="nds-communities-custom-icon">
                                        <div class="nds-icon nds-icon-text-default nds-icon_medium">
                                            <?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" width="2rem"
                                                height="2rem" viewBox="0 0 100 100">
                                                <g style="fill: rgb(77, 103, 146);">
                                                    <path
                                                        d="m77.8 32.6c-3-0.9-5.6-3-7.3-5.7-1.3-2.1-1.4-6.9-4.6-6.9h-31.8c-3.3 0-3.3 4.8-4.6 6.9-2.1 3.3-4.8 4.1-8 6-3.3 1.9-0.2 9.9 0.5 12.7 3.1 11.1 9 21.4 18.2 28.7 2.6 2.1 5.4 3.9 8.4 5.4 2.7 1.4 7.2-2.5 9.2-4 5.2-3.7 9.5-8.4 12.9-13.7 2.9-4.6 5.1-9.6 6.7-14.8 0.6-2.1 1.2-4.2 1.6-6.4 0.4-1.8 1.3-4.6 0.7-6.4-0.2-0.8-1-1.5-1.9-1.8-4.6-1.4 1.4 0.4 0 0z m-4.4 7c-2.7 13.4-9.9 25.9-21.8 33.2l-1.6 1-1.6-1c-14.4-8.8-19.8-22.9-21.8-33.2l-0.4-2.1 1.8-1.1c3.1-1.9 6-5.2 7.7-8.7l0.8-1.8h27l0.5 1.3c1.7 3.8 4.8 7.4 8.5 9.5l1.3 0.7v0.1l-0.4 2.1z m-24.5-7.6c-2.3 0-7.9 0-9 1-1.9 1.7-3 4.2-5 5.9-2.1 1.8-1.1 3.6-0.4 6 1.4 4.2 3.3 8.3 5.9 12 1.3 1.9 2.8 3.7 4.5 5.3 0.5 0.5 5.1 5.1 5.1 2.2v-30.4c0-1.1 0-2-1.1-2z">
                                                    </path>
                                                </g>
                                            </svg>
                                        </div>
                                    </div>
                                    <div class="nds-p-top_medium nds-p-left_medium nds-communities-policy-item-coverages-container">
                                        <div class="nds-grid nds-grid_align-spread nds-grid_vertical-align-center">
                                            <div class="nds-p-right_medium">
                                                <h3 class="nds-text-heading_small">Medical Payments</h3>
                                            </div>
                                        </div>
                                        <div class="nds-communities-policy-item_category">
                                            <div>
                                                <div class="nds-grid nds-wrap">
                                                    <div class="nds-col nds-size_1-of-1 nds-small-size_1-of-1">
                                                        <div
                                                            class="nds-communities-attribute-container nds-m-around_small">
                                                            <div class="nds-p-bottom_xx-small">
                                                                <div class="nds-grid nds-grid_align-spread nds-communities-attr nds-communities-attr_coverage nds-p-bottom_small nds-m-horizontal_medium nds-p-left_xx-small">
                                                                    <div class="nds-communities-attr-label nds-size_1-of-2 nds-p-left_xxx-small">
                                                                        <div>Medical Payments</div>
                                                                    </div>
                                                                    <div class="nds-size_1-of-2 nds-text-align_left">
                                                                        <div class="nds-communities-attr-label nds-communities-attr-value">$1k per person</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            </div>
                        </div>
                        <div class="nds-communities-coverage">
                            <div>
                                <article class="nds-grid nds-p-top_medium nds-p-bottom_large nds-communities-policy-item">
                                    <div class="nds-communities-custom-icon">
                                        <div class="nds-icon nds-icon-text-default nds-icon_medium">
                                            <?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" width="2rem"
                                                height="2rem" viewBox="0 0 100 100">
                                                <g style="fill: rgb(77, 103, 146);">
                                                    <path
                                                        d="m77.8 32.6c-3-0.9-5.6-3-7.3-5.7-1.3-2.1-1.4-6.9-4.6-6.9h-31.8c-3.3 0-3.3 4.8-4.6 6.9-2.1 3.3-4.8 4.1-8 6-3.3 1.9-0.2 9.9 0.5 12.7 3.1 11.1 9 21.4 18.2 28.7 2.6 2.1 5.4 3.9 8.4 5.4 2.7 1.4 7.2-2.5 9.2-4 5.2-3.7 9.5-8.4 12.9-13.7 2.9-4.6 5.1-9.6 6.7-14.8 0.6-2.1 1.2-4.2 1.6-6.4 0.4-1.8 1.3-4.6 0.7-6.4-0.2-0.8-1-1.5-1.9-1.8-4.6-1.4 1.4 0.4 0 0z m-4.4 7c-2.7 13.4-9.9 25.9-21.8 33.2l-1.6 1-1.6-1c-14.4-8.8-19.8-22.9-21.8-33.2l-0.4-2.1 1.8-1.1c3.1-1.9 6-5.2 7.7-8.7l0.8-1.8h27l0.5 1.3c1.7 3.8 4.8 7.4 8.5 9.5l1.3 0.7v0.1l-0.4 2.1z m-24.5-7.6c-2.3 0-7.9 0-9 1-1.9 1.7-3 4.2-5 5.9-2.1 1.8-1.1 3.6-0.4 6 1.4 4.2 3.3 8.3 5.9 12 1.3 1.9 2.8 3.7 4.5 5.3 0.5 0.5 5.1 5.1 5.1 2.2v-30.4c0-1.1 0-2-1.1-2z">
                                                    </path>
                                                </g>
                                            </svg>
                                        </div>
                                    </div>
                                    <div
                                        class="nds-p-top_medium nds-p-left_medium nds-communities-policy-item-coverages-container">
                                        <div class="nds-grid nds-grid_align-spread nds-grid_vertical-align-center">
                                            <div class="nds-p-right_medium">
                                                <h3 class="nds-text-heading_small">Liability (BI/PD)</h3>
                                            </div>
                                            <div class="nds-text-heading_small">£575</div>
                                        </div>
                                        <div class="nds-communities-policy-item_category">
                                            <div>
                                                <div class="nds-grid nds-wrap">
                                                    <div class="nds-col nds-size_1-of-1 nds-small-size_1-of-1">
                                                        <div class="nds-communities-attribute-container nds-m-around_small">
                                                            <div class="nds-p-bottom_xx-small">
                                                                <div class="nds-grid nds-grid_align-spread nds-communities-attr nds-communities-attr_coverage nds-p-bottom_small nds-m-horizontal_medium nds-p-left_xx-small">
                                                                    <div class="nds-communities-attr-label nds-size_1-of-2 nds-p-left_xxx-small">
                                                                        <div>Liability &#8203;(BI/&#8203;PD)</div>
                                                                    </div>
                                                                    <div class="nds-size_1-of-2 nds-text-align_left">
                                                                        <div class="nds-communities-attr-label nds-communities-attr-value">$50k/$100k/$25k</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            </div>
                        </div>
                        <div class="nds-communities-coverage">
                            <div>
                                <article
                                    class="nds-grid nds-p-top_medium nds-p-bottom_large nds-communities-policy-item">
                                    <div class="nds-communities-custom-icon">
                                        <div class="nds-icon nds-icon-text-default nds-icon_medium">
                                            <?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" width="2rem"
                                                height="2rem" viewBox="0 0 100 100">
                                                <g style="fill: rgb(77, 103, 146);">
                                                    <path
                                                        d="m77.8 32.6c-3-0.9-5.6-3-7.3-5.7-1.3-2.1-1.4-6.9-4.6-6.9h-31.8c-3.3 0-3.3 4.8-4.6 6.9-2.1 3.3-4.8 4.1-8 6-3.3 1.9-0.2 9.9 0.5 12.7 3.1 11.1 9 21.4 18.2 28.7 2.6 2.1 5.4 3.9 8.4 5.4 2.7 1.4 7.2-2.5 9.2-4 5.2-3.7 9.5-8.4 12.9-13.7 2.9-4.6 5.1-9.6 6.7-14.8 0.6-2.1 1.2-4.2 1.6-6.4 0.4-1.8 1.3-4.6 0.7-6.4-0.2-0.8-1-1.5-1.9-1.8-4.6-1.4 1.4 0.4 0 0z m-4.4 7c-2.7 13.4-9.9 25.9-21.8 33.2l-1.6 1-1.6-1c-14.4-8.8-19.8-22.9-21.8-33.2l-0.4-2.1 1.8-1.1c3.1-1.9 6-5.2 7.7-8.7l0.8-1.8h27l0.5 1.3c1.7 3.8 4.8 7.4 8.5 9.5l1.3 0.7v0.1l-0.4 2.1z m-24.5-7.6c-2.3 0-7.9 0-9 1-1.9 1.7-3 4.2-5 5.9-2.1 1.8-1.1 3.6-0.4 6 1.4 4.2 3.3 8.3 5.9 12 1.3 1.9 2.8 3.7 4.5 5.3 0.5 0.5 5.1 5.1 5.1 2.2v-30.4c0-1.1 0-2-1.1-2z">
                                                    </path>
                                                </g>
                                            </svg>
                                        </div>
                                    </div>
                                    <div
                                        class="nds-p-top_medium nds-p-left_medium nds-communities-policy-item-coverages-container">
                                        <div class="nds-grid nds-grid_align-spread nds-grid_vertical-align-center">
                                            <div class="nds-p-right_medium">
                                                <h3 class="nds-text-heading_small">Comprehensive</h3>
                                            </div>
                                            <div class="nds-text-heading_small">£500</div>
                                        </div>
                                        <div class="nds-communities-policy-item_category">
                                            <div>
                                                <div class="nds-grid nds-wrap">
                                                    <div class="nds-col nds-size_1-of-1 nds-small-size_1-of-1">
                                                        <div class="nds-communities-attribute-container nds-m-around_small">
                                                            <div class="nds-p-bottom_xx-small">
                                                                <div class="nds-grid nds-grid_align-spread nds-communities-attr nds-communities-attr_coverage nds-p-bottom_small nds-m-horizontal_medium nds-p-left_xx-small">
                                                                    <div class="nds-communities-attr-label nds-size_1-of-2 nds-p-left_xxx-small">
                                                                        <div>Comprehensive</div>
                                                                    </div>
                                                                    <div class="nds-size_1-of-2 nds-text-align_left">
                                                                        <div class="nds-communities-attr-label nds-communities-attr-value">$500 deductible</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            </div>
                        </div>
                        <div class="nds-communities-coverage">
                            <div>
                                <article
                                    class="nds-grid nds-p-top_medium nds-p-bottom_large nds-communities-policy-item">
                                    <div class="nds-communities-custom-icon">
                                        <div class="nds-icon nds-icon-text-default nds-icon_medium">
                                            <?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" width="2rem"
                                                height="2rem" viewBox="0 0 100 100">
                                                <g style="fill: rgb(77, 103, 146);">
                                                    <path
                                                        d="m77.8 32.6c-3-0.9-5.6-3-7.3-5.7-1.3-2.1-1.4-6.9-4.6-6.9h-31.8c-3.3 0-3.3 4.8-4.6 6.9-2.1 3.3-4.8 4.1-8 6-3.3 1.9-0.2 9.9 0.5 12.7 3.1 11.1 9 21.4 18.2 28.7 2.6 2.1 5.4 3.9 8.4 5.4 2.7 1.4 7.2-2.5 9.2-4 5.2-3.7 9.5-8.4 12.9-13.7 2.9-4.6 5.1-9.6 6.7-14.8 0.6-2.1 1.2-4.2 1.6-6.4 0.4-1.8 1.3-4.6 0.7-6.4-0.2-0.8-1-1.5-1.9-1.8-4.6-1.4 1.4 0.4 0 0z m-4.4 7c-2.7 13.4-9.9 25.9-21.8 33.2l-1.6 1-1.6-1c-14.4-8.8-19.8-22.9-21.8-33.2l-0.4-2.1 1.8-1.1c3.1-1.9 6-5.2 7.7-8.7l0.8-1.8h27l0.5 1.3c1.7 3.8 4.8 7.4 8.5 9.5l1.3 0.7v0.1l-0.4 2.1z m-24.5-7.6c-2.3 0-7.9 0-9 1-1.9 1.7-3 4.2-5 5.9-2.1 1.8-1.1 3.6-0.4 6 1.4 4.2 3.3 8.3 5.9 12 1.3 1.9 2.8 3.7 4.5 5.3 0.5 0.5 5.1 5.1 5.1 2.2v-30.4c0-1.1 0-2-1.1-2z">
                                                    </path>
                                                </g>
                                            </svg>
                                        </div>
                                    </div>
                                    <div
                                        class="nds-p-top_medium nds-p-left_medium nds-communities-policy-item-coverages-container">
                                        <div class="nds-grid nds-grid_align-spread nds-grid_vertical-align-center">
                                            <div class="nds-p-right_medium">
                                                <h3 class="nds-text-heading_small">Collision</h3>
                                            </div>
                                            <div class="nds-text-heading_small">
                                                <div>£500</div>
                                            </div>
                                        </div>
                                        <div class="nds-communities-policy-item_category">
                                            <div>
                                                <div class="nds-grid nds-wrap">
                                                    <div class="nds-col nds-size_1-of-1 nds-small-size_1-of-1">
                                                        <div class="nds-communities-attribute-container nds-m-around_small">
                                                            <div class="nds-p-bottom_xx-small">
                                                                <div
                                                                    class="nds-grid nds-grid_align-spread nds-communities-attr nds-communities-attr_coverage nds-p-bottom_small nds-m-horizontal_medium nds-p-left_xx-small">
                                                                    <div class="nds-communities-attr-label nds-size_1-of-2 nds-p-left_xxx-small">
                                                                        <div>Collision</div>
                                                                    </div>
                                                                    <div class="nds-size_1-of-2 nds-text-align_left">
                                                                        <div class="nds-communities-attr-label nds-communities-attr-value">$500 deductible</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            </div>
                        </div>
                        <div class="nds-communities-coverage">
                            <div>
                                <article
                                    class="nds-grid nds-p-top_medium nds-p-bottom_large nds-communities-policy-item">
                                    <div class="nds-communities-custom-icon">
                                        <div class="nds-icon nds-icon-text-default nds-icon_medium">
                                            <?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" width="2rem"
                                                height="2rem" viewBox="0 0 100 100">
                                                <g style="fill: rgb(77, 103, 146);">
                                                    <path
                                                        d="m77.8 32.6c-3-0.9-5.6-3-7.3-5.7-1.3-2.1-1.4-6.9-4.6-6.9h-31.8c-3.3 0-3.3 4.8-4.6 6.9-2.1 3.3-4.8 4.1-8 6-3.3 1.9-0.2 9.9 0.5 12.7 3.1 11.1 9 21.4 18.2 28.7 2.6 2.1 5.4 3.9 8.4 5.4 2.7 1.4 7.2-2.5 9.2-4 5.2-3.7 9.5-8.4 12.9-13.7 2.9-4.6 5.1-9.6 6.7-14.8 0.6-2.1 1.2-4.2 1.6-6.4 0.4-1.8 1.3-4.6 0.7-6.4-0.2-0.8-1-1.5-1.9-1.8-4.6-1.4 1.4 0.4 0 0z m-4.4 7c-2.7 13.4-9.9 25.9-21.8 33.2l-1.6 1-1.6-1c-14.4-8.8-19.8-22.9-21.8-33.2l-0.4-2.1 1.8-1.1c3.1-1.9 6-5.2 7.7-8.7l0.8-1.8h27l0.5 1.3c1.7 3.8 4.8 7.4 8.5 9.5l1.3 0.7v0.1l-0.4 2.1z m-24.5-7.6c-2.3 0-7.9 0-9 1-1.9 1.7-3 4.2-5 5.9-2.1 1.8-1.1 3.6-0.4 6 1.4 4.2 3.3 8.3 5.9 12 1.3 1.9 2.8 3.7 4.5 5.3 0.5 0.5 5.1 5.1 5.1 2.2v-30.4c0-1.1 0-2-1.1-2z">
                                                    </path>
                                                </g>
                                            </svg>
                                        </div>
                                    </div>
                                    <div
                                        class="nds-p-top_medium nds-p-left_medium nds-communities-policy-item-coverages-container">
                                        <div class="nds-grid nds-grid_align-spread nds-grid_vertical-align-center">
                                            <div class="nds-p-right_medium">
                                                <h3 class="nds-text-heading_small">Uninsured Motorist PD</h3>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            </div>
                        </div>
                        <div class="nds-communities-coverage">
                            <div>
                                <article
                                    class="nds-grid nds-p-top_medium nds-p-bottom_large nds-communities-policy-item">
                                    <div class="nds-communities-custom-icon">
                                        <div class="nds-icon nds-icon-text-default nds-icon_medium">
                                            <?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" width="2rem"
                                                height="2rem" viewBox="0 0 100 100">
                                                <g style="fill: rgb(77, 103, 146);">
                                                    <path
                                                        d="m77.8 32.6c-3-0.9-5.6-3-7.3-5.7-1.3-2.1-1.4-6.9-4.6-6.9h-31.8c-3.3 0-3.3 4.8-4.6 6.9-2.1 3.3-4.8 4.1-8 6-3.3 1.9-0.2 9.9 0.5 12.7 3.1 11.1 9 21.4 18.2 28.7 2.6 2.1 5.4 3.9 8.4 5.4 2.7 1.4 7.2-2.5 9.2-4 5.2-3.7 9.5-8.4 12.9-13.7 2.9-4.6 5.1-9.6 6.7-14.8 0.6-2.1 1.2-4.2 1.6-6.4 0.4-1.8 1.3-4.6 0.7-6.4-0.2-0.8-1-1.5-1.9-1.8-4.6-1.4 1.4 0.4 0 0z m-4.4 7c-2.7 13.4-9.9 25.9-21.8 33.2l-1.6 1-1.6-1c-14.4-8.8-19.8-22.9-21.8-33.2l-0.4-2.1 1.8-1.1c3.1-1.9 6-5.2 7.7-8.7l0.8-1.8h27l0.5 1.3c1.7 3.8 4.8 7.4 8.5 9.5l1.3 0.7v0.1l-0.4 2.1z m-24.5-7.6c-2.3 0-7.9 0-9 1-1.9 1.7-3 4.2-5 5.9-2.1 1.8-1.1 3.6-0.4 6 1.4 4.2 3.3 8.3 5.9 12 1.3 1.9 2.8 3.7 4.5 5.3 0.5 0.5 5.1 5.1 5.1 2.2v-30.4c0-1.1 0-2-1.1-2z">
                                                    </path>
                                                </g>
                                            </svg>
                                        </div>
                                    </div>
                                    <div
                                        class="nds-p-top_medium nds-p-left_medium nds-communities-policy-item-coverages-container">
                                        <div class="nds-grid nds-grid_align-spread nds-grid_vertical-align-center">
                                            <div class="nds-p-right_medium">
                                                <h3 class="nds-text-heading_small">Collision Deductible Waiver</h3>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </article>
        <article class="nds-communities-policy-item nds-p-around_x-large nds-border_bottom">
            <section class="nds-grid nds-grid_align-spread">
                <div class="nds-grid nds-grid_align-start nds-size_2-of-3">
                    <div class="nds-size_1-of-12 nds-m-right_x-large">
                        <div
                            class="nds-communities-icon_container nds-communities-icon-item nds-communities-custom-img nds-align_absolute-center nds-icon_container nds-p-around_x-small">
                            <div class="nds-icon nds-icon-text-default nds-icon_medium">
                            </div>
                        </div>
                    </div>
                    <div class="nds-communities-header-content">
                        <div class="nds-communities-title-container nds-grid">
                            <h2 class="nds-communities-title nds-communities-bold">Collision Deductible Waiver</h2>
                        </div>
                        <div><span class="nds-communities-separator-container nds-communities-title">Collision Deductible Waiver:
                            <span class="nds-communities-separator nds-p-horizontal_xx-small">|</span></span>
                        </div>
                        <div class="nds-size_1-of-1 nds-m-top_small"><span
                                class="nds-communities-bold nds-text-link nds-m-right_xx-small">View more
                                details</span>
                            <img class="nds-icon nds-m-right_xx-small nds-m-bottom_xxx-small nds-icon-text-default nds-icon_xx-small"
                                style="fill: rgb(0, 112, 210);" alt="down" src="./assets/icons/utility/down.svg"
                                title="down" />
                        </div>
                    </div>
                </div>
            </section>
        </article>
    </div>
</div>
`);
});
