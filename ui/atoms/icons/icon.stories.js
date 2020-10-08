import { storiesOf } from '@storybook/html';
import { withKnobs, radios } from '@storybook/addon-knobs';
import base from 'paths.macro';
import notes from './doc.md';
import scss from './base/_index.scss';
import actionscss from './action/_index.scss';
import customscss from './custom/_index.scss';
import doctypescss from './doctype/_index.scss';
import standardscss from './standard/_index.scss';
import {
  withExample,
  withDocs,
  commentToHTML
} from '../../../scripts/storybook';

const sizeLabel = 'Size';
const sizeOptions = {
  None: '',
  XSmall: ' nds-icon_x-small',
  Small: ' nds-icon_small',
  Large: ' nds-icon_large'
};
const sizeDefaultValue = '';

const colorLabel = 'Color';
const colorOptions = {
  Default: ' nds-icon-text-default',
  Warning: ' nds-icon-text-warning',
  Error: ' nds-icon-text-error',
  Light: ' nds-icon-text-light'
};
const colorDefaultValue = ' nds-icon-text-default';

storiesOf(`${base}`, module)
  .addDecorator(withKnobs)
  .addDecorator(withDocs(notes))
  .addDecorator(
    commentToHTML(scss + actionscss + customscss + standardscss + doctypescss)
  )
  .add('Default', () => {
    const size = radios(sizeLabel, sizeOptions, sizeDefaultValue);
    const color = radios(colorLabel, colorOptions, colorDefaultValue);
    return withExample(`<span class="nds-icon_container nds-icon-utility-announcement" title="Description of icon when needed">
  <svg class="nds-icon${size}${color}" aria-hidden="true">
    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#announcement"></use>
  </svg>
  <span class="nds-assistive-text">Description of icon</span>
</span>`);
  })
  .add('Action', () => {
    const size = radios(sizeLabel, sizeOptions, sizeDefaultValue);
    return withExample(`<span class="nds-icon_container nds-icon_container_circle nds-icon-action-description" title="Description of icon when needed">
      <svg class="nds-icon${size}" aria-hidden="true">
        <use xlink:href="/assets/icons/action-sprite/svg/symbols.svg#description"></use>
      </svg>
      <span class="nds-assistive-text">Description of icon</span>
    </span>`);
  })
  .add('Custom', () => {
    const size = radios(sizeLabel, sizeOptions, sizeDefaultValue);

    return withExample(`<span class="nds-icon_container nds-icon-custom-custom5" title="Description of icon when needed">
      <svg class="nds-icon${size}" aria-hidden="true">
        <use xlink:href="/assets/icons/custom-sprite/svg/symbols.svg#custom5"></use>
      </svg>
      <span class="nds-assistive-text">Description of icon</span>
    </span>`);
  })
  .add('Doctype', () => {
    const size = radios(sizeLabel, sizeOptions, sizeDefaultValue);

    return withExample(`<span class="nds-icon_container nds-icon-doctype-xml" title="Description of icon when needed">
      <svg class="nds-icon${size}" aria-hidden="true">
        <use xlink:href="/assets/icons/doctype-sprite/svg/symbols.svg#xml"></use>
      </svg>
      <span class="nds-assistive-text">Description of icon</span>
    </span>`);
  })
  .add('Standard', () => {
    const size = radios(sizeLabel, sizeOptions, sizeDefaultValue);

    return withExample(`<span class="nds-icon_container nds-icon-standard-account" title="Description of icon when needed">
      <svg class="nds-icon${size}" aria-hidden="true">
        <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#account"></use>
      </svg>
      <span class="nds-assistive-text">Description of icon</span>
    </span>
    `);
  });
