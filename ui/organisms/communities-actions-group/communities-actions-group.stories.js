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
<div class="nds-communities-actions-group nds-grid nds-wrap nds-m-top_large">
    <div class="nds-communities-action nds-large-size_1-of-4 nds-medium-size_1-of-4 nds-size_1-of-2 nds-m-bottom_large">
        <div class="nds-align_absolute-center">
            <img class="nds-icon nds-icon_xx-large nds-is-absolute" alt="health" src="./assets/images/communities/icons/auto.svg"
                title="Health"/>
            <img class="nds-icon nds-icon_xx-large" alt="ellipse" src="./assets/images/communities/icons/ellipse.svg"
                title="Ellipse" />
        </div>
        <div class="nds-text-heading_medium nds-align_absolute-center"><b>Health Insurance</b></div>
        <div class="nds-align_absolute-center">
            <button class="nds-button nds-button_link" label="Get a quote">Get a quote</button>
        </div>
    </div>

    <div class="nds-communities-action nds-large-size_1-of-4 nds-medium-size_1-of-4 nds-size_1-of-2 nds-m-bottom_large">
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

    <div class="nds-communities-action nds-large-size_1-of-4 nds-medium-size_1-of-4 nds-size_1-of-2 nds-m-bottom_large">
        <div class="nds-align_absolute-center">
            <img class="nds-icon nds-icon_xx-large nds-is-absolute" alt="homeowners" src="./assets/images/communities/icons/auto.svg"
                title="Homeowners" />
            <img class="nds-icon nds-icon_xx-large" alt="ellipse" src="./assets/images/communities/icons/ellipse.svg"
                title="Ellipse" />
        </div>
        <div class="nds-text-heading_medium nds-align_absolute-center"><b>Homeowners</b></div>
        <div class="nds-align_absolute-center">
            <button class="nds-button nds-button_link" label="Get a quote">Get a quote</button>
        </div>
    </div>

    <div class="nds-communities-action nds-large-size_1-of-4 nds-medium-size_1-of-4 nds-size_1-of-2 nds-m-bottom_large">
        <div class="nds-align_absolute-center">
            <img class="nds-icon nds-icon_xx-large nds-is-absolute" alt="shield" src="./assets/images/communities/icons/auto.svg"
                title="Shield" />
            <img class="nds-icon nds-icon_xx-large" alt="ellipse" src="./assets/images/communities/icons/ellipse.svg"
                title="Ellipse" />
        </div>
        <div class="nds-text-heading_medium nds-align_absolute-center"><b>Life Insurance</b></div>
        <div class="nds-align_absolute-center">
            <button class="nds-button nds-button_link" label="Get a quote">Get a quote</button>
        </div>

    </div>
</div>
`);
});
