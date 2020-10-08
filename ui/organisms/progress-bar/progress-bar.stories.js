import { storiesOf } from '@storybook/html';
import { withKnobs, radios, number } from '@storybook/addon-knobs';
import base from 'paths.macro';
import notes from './doc.md';
import scss from './base/_index.scss';
import {
  withExample,
  withDocs,
  commentToHTML
} from '../../../scripts/storybook';

const label = 'Value';
const defaultValue = 50;
const options = {
  range: true,
  min: 0,
  max: 100,
  step: 1
};

const sizeLabel = 'Size';
const sizeOptions = {
  None: '',
  XSmall: ' nds-progress-bar_x-small',
  Small: ' nds-progress-bar_small',
  Medium: ' nds-progress-bar_medium',
  Large: ' nds-progress-bar_large'
};
const sizeDefaultValue = '';

const radiusLabel = 'Radius';
const radiusOptions = {
  None: '',
  Circlular: ' nds-progress-bar_circular'
};
const radiusDefaultValue = '';

const statusLabel = 'Status';
const statusOptions = {
  None: '',
  Success: ' nds-progress-bar__value_success '
};
const statusDefaultValue = '';

storiesOf(`${base}`, module)
  .addDecorator(withKnobs)
  .addDecorator(withDocs(notes))
  .addDecorator(commentToHTML(scss))
  .add('Default (default)', () => {
    const size = radios(sizeLabel, sizeOptions, sizeDefaultValue);
    const radius = radios(radiusLabel, radiusOptions, radiusDefaultValue);
    const value = number(label, defaultValue, options);
    const status = radios(statusLabel, statusOptions, statusDefaultValue);
    return withExample(`<div class="nds-progress-bar${size}${radius}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${value}" role="progressbar">
  <span class="nds-progress-bar__value ${status}" style="width: ${value}%;">
    <span class="nds-assistive-text">
      Progress: ${value}%
    </span>
  </span>
</div>`);
  });
