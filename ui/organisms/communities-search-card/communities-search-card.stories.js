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

storiesOf(`${base}`, module)
.addDecorator(withKnobs)
.addDecorator(commentToHTML(scss))
.addDecorator(withDocs(notes))
.add('Default', () => {
const value = radios(label, options, defaultValue);
return withExample(`<div class="nds-communities-search-card nds-text-color_inverse nds-grid nds-grid_wrap">
    <div class="nds-large-size_1-of-2 nds-p-left_x-small nds-communities-search__info-col">
        <div class="nds-communities-search_heading">Find an agent today.</div> 
        <div class="nds-text-body_medium">Message us or give us a call at (987) 654-3210</div> 
    </div>
    <div class="nds-communities-search__search-col nds-large-size_1-of-2">
        Search box
    </div>   
</div>`);
});