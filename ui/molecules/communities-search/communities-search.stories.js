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
<div class="nds-communities-search nds-card nds-grid nds-grid_wrap nds-p-around_small">
    <div class="nds-form-element nds-m-right_small nds-size_7-of-8">
        <div class="nds-form-element__control">
            <input type="text" id="text-input-id-1" class="nds-input" placeholder="Enter Your Zip"></input>
        </div>
    </div>
    <div class="nds-communities-search__button">
        <button class="nds-button_text nds-button nds-button_brand">Find an Agent</button>
        <button class="nds-button nds-button_brand nds-button_icon nds-button_icon-border-filled" aria-haspopup="true">
            <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevronright"></use>
            </svg>
            <span class="nds-assistive-text">Find an Agent</span>
        </button>
    </div>
</div>`);
});
