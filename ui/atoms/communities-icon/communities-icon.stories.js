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
return withExample(`<img class="nds-icon nds-icon_x-large" alt="auto" src="./assets/images/communities/icons/auto.svg"
    title="Auto" />`);
})
.add('Icon With Background', () => {
const value = radios(label, options, defaultValue);
return withExample(`
<img class="nds-icon nds-icon_x-large nds-is-absolute" alt="auto" src="./assets/images/communities/icons/auto.svg"
    title="Auto" />
<img class="nds-icon nds-icon_x-large" alt="ellipse" src="./assets/images/communities/icons/ellipse.svg" title="Ellipse" />`);
});
