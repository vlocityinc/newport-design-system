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
return withExample(`
<div class="nds-communities-hero nds-is-relative nds-align_absolute-center">
    <div class="nds-is-absolute nds-text-align_center nds-size_1-of-1">
        <div class="nds-text-heading_large nds-text-color_inverse">
            <div>Get personalized service from</div>
            <div>a local agent</div>
        </div>
    </div>
    <img class="nds-hero" alt="Cityscape Image" src="assets/images/communities/cityscape.svg" title="Community Hero"/>
    <img class="nds-hero-mobile" alt="CityScapeImage" src="assets/images/communities/cityscape-mobile.svg"
        title="Community Hero"/>
</div>
`);
});