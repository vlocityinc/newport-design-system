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
    <div class="nds-communities-coverage">
        <article
            class="nds-grid nds-p-top_medium nds-p-bottom_large nds-communities-policy-item">
            <div class="nds-communities-custom-icon">
                <div class="nds-icon nds-icon-text-default nds-icon_medium">
                    <?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" width="2rem" height="2rem" viewBox="0 0 100 100"><g style="fill: rgb(77, 103, 146);"><path d="m77.8 32.6c-3-0.9-5.6-3-7.3-5.7-1.3-2.1-1.4-6.9-4.6-6.9h-31.8c-3.3 0-3.3 4.8-4.6 6.9-2.1 3.3-4.8 4.1-8 6-3.3 1.9-0.2 9.9 0.5 12.7 3.1 11.1 9 21.4 18.2 28.7 2.6 2.1 5.4 3.9 8.4 5.4 2.7 1.4 7.2-2.5 9.2-4 5.2-3.7 9.5-8.4 12.9-13.7 2.9-4.6 5.1-9.6 6.7-14.8 0.6-2.1 1.2-4.2 1.6-6.4 0.4-1.8 1.3-4.6 0.7-6.4-0.2-0.8-1-1.5-1.9-1.8-4.6-1.4 1.4 0.4 0 0z m-4.4 7c-2.7 13.4-9.9 25.9-21.8 33.2l-1.6 1-1.6-1c-14.4-8.8-19.8-22.9-21.8-33.2l-0.4-2.1 1.8-1.1c3.1-1.9 6-5.2 7.7-8.7l0.8-1.8h27l0.5 1.3c1.7 3.8 4.8 7.4 8.5 9.5l1.3 0.7v0.1l-0.4 2.1z m-24.5-7.6c-2.3 0-7.9 0-9 1-1.9 1.7-3 4.2-5 5.9-2.1 1.8-1.1 3.6-0.4 6 1.4 4.2 3.3 8.3 5.9 12 1.3 1.9 2.8 3.7 4.5 5.3 0.5 0.5 5.1 5.1 5.1 2.2v-30.4c0-1.1 0-2-1.1-2z"></path></g></svg>
                </div>
            </div>
            <div
                class="nds-p-top_medium nds-p-left_medium nds-communities-policy-item-coverages-container">
                <div class="nds-grid nds-grid_align-spread nds-grid_vertical-align-center">
                    <div class=" nds-p-right_medium">
                        <h3 class="nds-text-heading_small">
                            Comprehensive</h3>
                    </div>
                    <div class="nds-text-heading_small">
                        £500
                    </div>
                </div>
                <div class="nds-communities-policy-item_category">
                    <div>
                        <div class=" nds-grid nds-wrap">
                            <div class="nds-col nds-size_1-of-1 nds-small-size_1-of-1">
                                <div class="nds-communities-attribute-container nds-m-around_small">
                                    <div class="nds-p-bottom_xx-small">
                                        <div
                                            class="nds-grid nds-grid_align-spread nds-communities-attr nds-communities-attr_coverage nds-p-bottom_small nds-m-horizontal_medium nds-p-left_xx-small">
                                            <div
                                                class="nds-communities-attr-label nds-size_1-of-2 nds-p-left_xxx-small">
                                                <div>Comprehensive</div>
                                            </div>
                                            <div class="nds-size_1-of-2 nds-text-align_left">
                                                <div
                                                    class="nds-communities-attr-label nds-communities-attr-value">
                                                    $500 deductible</div>
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
`);
});
