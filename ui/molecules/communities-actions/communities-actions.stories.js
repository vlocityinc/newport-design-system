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
    <div class="nds-communities-action nds-large-size_1-of-4 nds-size_1-of-2">
        <div class="nds-align_absolute-center">
            <img class="nds-icon nds-icon_xx-large nds-is-absolute" alt="auto" src="./assets/images/communities/icons/auto.svg"
                title="Auto" />
            <img class="nds-icon nds-icon_xx-large" alt="ellipse" src="./assets/images/communities/icons/ellipse.svg"
                title="Ellipse" />
        </div>
        <div class="nds-text-heading_medium nds-align_absolute-center"><b>Auto & Property</b></div>
        <div class="nds-align_absolute-center">
            <button class="nds-button nds-button_link" label="Get a quote">Get a quote</button>
        </div>
    </div>
`);
})
.add('Global Actions List', () => {
const value = radios(label, options, defaultValue);
return withExample(`
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
`);
});
