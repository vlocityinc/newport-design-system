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
    <div id="content-id-01" class="nds-carousel__panel" role="tabpanel" aria-hidden="true"
    aria-labelledby="indicator-id-01">
    <a href="javascript:void(0);" class="nds-carousel__panel-action nds-text-link_reset" tabindex="-1">
        <div class="nds-carousel__image nds-align_absolute-center">
            <img src="./assets/images/communities/demo/icon.png" alt="Visit App Exchange" />
        </div>
        <div class="nds-carousel__content">
            <h2 class="nds-carousel__content-title">Jake P</h2>
            <p>The simplest and easiest insurance I’ve ever purchased, “old” insurance companies need to step into the current century!!! 👏 👏 👏</p>
        </div>
    </a>
</div>
`);
});
