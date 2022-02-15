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
<div class="nds-carousel nds-m-vertical-xx-large">
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
                        <h2 class="nds-carousel__content-title">Sally G</h2>
                        <p>The simplest and easiest insurance I’ve ever purchased, “old” insurance companies need to
                            step into the current century!!! 👏 👏 👏 The simplest and easiest insurance I’ve ever purchased, “old” insurance companies need to
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
`);
});
