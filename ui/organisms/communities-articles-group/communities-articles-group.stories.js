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
<div class="nds-communities-articles-group nds-grid nds-wrap nds-m-top_large nds-align_absolute-center">
    <div
        class="nds-communities-article nds-large-size_1-of-5 nds-medium-size_1-of-4 nds-size_1-of-1 nds-m-around_small">
        <img alt="Article" src="./assets/images/communities/demo/article.png" title="Article" />
        <div class="nds-communities-article_text nds-p-around_medium">
            <div class="nds-text-title_caps nds-m-bottom_small"><b>Homeowners</b></div>
            <div class="nds-text-heading_small"><b>How to Prevent Fires, Inside and Outside the Home.</b></div>
        </div>
    </div>
    <div
        class="nds-communities-article nds-large-size_1-of-5 nds-medium-size_1-of-4 nds-size_1-of-1 nds-m-around_small">
        <img alt="Article" src="./assets/images/communities/demo/article.png" title="Article" />
        <div class="nds-communities-article_text nds-p-around_medium">
            <div class="nds-text-title_caps nds-m-bottom_small"><b>Homeowners</b></div>
            <div class="nds-text-heading_small"><b>Umbrella Insurance. Do you really need it?</b></div>
        </div>
    </div>
    <div
        class="nds-communities-article nds-large-size_1-of-5 nds-medium-size_1-of-4 nds-size_1-of-1 nds-m-around_small">
        <img alt="Article" src="./assets/images/communities/demo/article.png" title="Article" />
        <div class="nds-communities-article_text nds-p-around_medium">
            <div class="nds-text-title_caps nds-m-bottom_small"><b>Homeowners</b></div>
            <div class="nds-text-heading_small"><b>How to Prevent Fires, Inside and Outside the Home.</b></div>
        </div>
    </div>
    <div
        class="nds-communities-article nds-large-size_1-of-5 nds-medium-size_1-of-4 nds-size_1-of-1 nds-m-around_small">
        <img alt="Article" src="./assets/images/communities/demo/article.png" title="Article" />
        <div class="nds-communities-article_text nds-p-around_medium">
            <div class="nds-text-title_caps nds-m-bottom_small"><b>Homeowners</b></div>
            <div class="nds-text-heading_small"><b>Rules of the road for Safe Driving.</b></div>
        </div>
    </div>
</div>
`);
});
