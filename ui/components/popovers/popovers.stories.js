import { storiesOf } from '@storybook/html';
import { withKnobs, radios } from '@storybook/addon-knobs';
import base from 'paths.macro';
import notes from './doc.md';
import scss from './base/_index.scss';
import {
  withExample,
  withDocs,
  commentToHTML
} from '../../../scripts/storybook';

const sizeLabel = 'Size';
const sizeOptions = {
  None: '',
  Small: ' nds-popover_small',
  Medium: ' nds-popover_medium',
  Large: ' nds-popover_large'
};
const sizeDefaultValue = '';

const themeLabel = 'Theme';
const themeOptions = {
  None: '',
  Info: ' nds-theme_info',
  Error: ' nds-theme_error',
  Warning: ' nds-theme_warning',
  Success: ' nds-theme_success'
};
const themeDefaultValue = '';
const nubbinsLabel = 'Nubbin';
const verticalVariations = ['top', 'bottom'];
const horizVariations = ['left', 'right'];

function generateOptions(array1, array2, obj) {
  return array1.reduce((obj, variation) => {
    obj[variation] = ` nds-nubbin_${variation}`;
    array2.forEach(subvar => {
      obj[variation + ' ' + subvar] = ` nds-nubbin_${variation}-${subvar}`;
    });
    return obj;
  }, obj);
}

const nubbinsOptions = generateOptions(
  horizVariations,
  verticalVariations,
  generateOptions(verticalVariations, horizVariations, {
    None: ''
  })
);
const nubbinsDefaultValue = ' nds-nubbin_left';

storiesOf(`${base}`, module)
  .addDecorator(withKnobs)
  .addDecorator(withDocs(notes))
  .addDecorator(commentToHTML(scss))
  .add('Default (default)', () => {
    const size = radios(sizeLabel, sizeOptions, sizeDefaultValue);
    const nubbin = radios(nubbinsLabel, nubbinsOptions, nubbinsDefaultValue);
    const theme = radios(themeLabel, themeOptions, themeDefaultValue);
    return withExample(`<section class="nds-popover${size}${nubbin}${theme}" role="dialog" aria-label="Dialog Title" aria-describedby="dialog-body-id-19">
  <button class="nds-button nds-button_icon nds-button_icon-small nds-float_right nds-popover__close nds-button_icon" title="Close dialog">
    <svg class="nds-button__icon" aria-hidden="true">
      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
    </svg>
    <span class="nds-assistive-text">Close dialog</span>
  </button>
  <div class="nds-popover__body" id="dialog-body-id-19">
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
  </div>
</section>`);
  })
  .add('Header (examples)', () => {
    const size = radios(sizeLabel, sizeOptions, sizeDefaultValue);
    const nubbin = radios(nubbinsLabel, nubbinsOptions, nubbinsDefaultValue);
    const theme = radios(themeLabel, themeOptions, themeDefaultValue);
    return withExample(`<section class="nds-popover${size}${nubbin}${theme}" role="dialog" aria-labelledby="dialog-heading-id-20" aria-describedby="dialog-body-id-20">
  <button class="nds-button nds-button_icon nds-button_icon-small nds-float_right nds-popover__close nds-button_icon" title="Close dialog">
    <svg class="nds-button__icon" aria-hidden="true">
      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
    </svg>
    <span class="nds-assistive-text">Close dialog</span>
  </button>
  <header class="nds-popover__header">
    <h2 id="dialog-heading-id-20" class="nds-text-heading_small">Header Title</h2>
  </header>
  <div class="nds-popover__body" id="dialog-body-id-20">
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
  </div>
</section>`);
  })
  .add('Footer (examples)', () => {
    const size = radios(sizeLabel, sizeOptions, sizeDefaultValue);
    const nubbin = radios(nubbinsLabel, nubbinsOptions, nubbinsDefaultValue);
    const theme = radios(themeLabel, themeOptions, themeDefaultValue);
    return withExample(`<section class="nds-popover${size}${nubbin}${theme}" role="dialog" aria-label="Dialog Title" aria-describedby="dialog-body-id-21">
  <button class="nds-button nds-button_icon nds-button_icon-small nds-float_right nds-popover__close nds-button_icon" title="Close dialog">
    <svg class="nds-button__icon" aria-hidden="true">
      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
    </svg>
    <span class="nds-assistive-text">Close dialog</span>
  </button>
  <div class="nds-popover__body" id="dialog-body-id-21">
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
  </div>
  <footer class="nds-popover__footer">
    <p>Footer Item</p>
  </footer>
</section>`);
  });
