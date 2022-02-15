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
<div class="nds-communities-card">
    <div class="nds-text-heading_large">Get personalized service from a local agent</div>
    <div class="nds-text-heading_medium">Find and agent today</div>
    <div class="nds-text-body_medium">Message us or give us a call at (987) 654-3210</div>
    <button class="nds-button nds-button_icon nds-button-inverse" aria-haspopup="true">
        <svg class="nds-button__icon nds-icon__small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#search"></use>
        </svg>
        <span class="nds-assistive-text">Search</span>
    </button>
</div>`);
});
