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
return withExample(` <div class="nds-communities-page-content_list nds-m-bottom_xx-large">
    <div class="nds-media nds-media_center nds-p-vertical_xx-large">
        <div class="nds-media__body nds-large-size_1-of-2 nds-size_1-of-1 nds-p-around_xx-large">
            <div class="nds-text-heading_large nds-m-bottom_large"><b>Home is where the ❤️ is.</b></div>
            <div class="nds-text-heading_medium">From theft to natural disasters, whatever it is — we’ve got you
                covered.</div>
        </div>
        <div class="nds-media__figure nds-media__figure_reverse nds-large-size_1-of-2 nds-size_1-of-1">
            <span class="nds-size_1-of-1">
                <img alt="Home Interior" src="/assets/images/communities/homeinterior.svg" title="Home Interior">
            </span>
        </div>
    </div>

    <div class="nds-media nds-media_center nds-p-vertical_xx-large">
        <div class="nds-media__figure nds-large-size_1-of-2 nds-size_1-of-1">
            <span class="nds-size_1-of-1">
                <img alt="Person name" src="/assets/images/communities/autohomepage.svg" title="Auto Image">
            </span>
        </div>
        <div class="nds-media__body nds-large-size_1-of-2 nds-size_1-of-1 nds-p-around_xx-large">
            <div class="nds-text-heading_large nds-m-bottom_large"><b>Vroom, Vroom.</b></div>
            <div class="nds-text-heading_medium">From accidents and windshield damage to lawsuits and more, we have
                affordable insurance options to
                protect against just about anything.</div>
        </div>
    </div>

    <div class="nds-media nds-media_center nds-p-vertical_xx-large">
        <div class="nds-media__body nds-large-size_1-of-2 nds-size_1-of-1 nds-p-around_xx-large">
            <div class="nds-text-heading_large nds-m-bottom_large"><b>Protect what matters most.</b></div>
            <div class="nds-text-heading_medium">Medical insurance provides peace of mind, access to affordable health
                care, and a safeguard from
                finanacial loss for you and your family.</div>
        </div>
        <div class="nds-media__figure nds-media__figure_reverse nds-large-size_1-of-2 nds-size_1-of-1">
            <span class="nds-size_1-of-1">
                <img alt="Protect Image" src="/assets/images/communities/protecthomepage.svg" title="Protect Img">
            </span>
        </div>
    </div>

</div>`);
});