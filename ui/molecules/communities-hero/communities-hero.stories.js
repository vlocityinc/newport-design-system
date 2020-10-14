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
    <div class="nds-communities-card nds-is-absolute">
        <div
            class="nds-text-heading_large nds-align_absolute-center nds-large-size_3-of-4 nds-text-align_center nds-is-relative">
            <div>Get personalized service from a local agent</div>
        </div>
    </div>
    <div class="nds-hero">
        <img alt="Cityscape Image" src="./assets/images/communities/demo/cityscape.png" title="Cityscape" />
    </div>
</div>
`);
});