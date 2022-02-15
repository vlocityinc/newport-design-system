import { storiesOf } from '@storybook/html';
import { withKnobs, radios } from '@storybook/addon-knobs';
import base from 'paths.macro';
import notes from './doc.md';
import scss from './_index.scss';
import {
  withExample,
  withDocs,
  commentToHTML
} from '../../../scripts/storybook';

const label = 'Theme';
const options = {
  Default: 'default',
  Inverse: 'inverse',
  AltInverse: 'alt-inverse',
  Warning: 'warning',
  Info: 'info',
  Error: 'error',
  Offline: 'offline',
  Success: 'success'
};
const defaultValue = 'default';

storiesOf(`${base}`.replace(/(^\/)|(\/$)/g, ''),  module)
  .addDecorator(withKnobs)
  .addDecorator(withDocs(notes))
  .addDecorator(commentToHTML(scss))
  .add('Default (examples)', () => {
    const value = radios(label, options, defaultValue);
    return withExample(`<div class="nds-box nds-theme_${value}">
  <p>
    This is a <strong>${value}</strong> theme and here is a <a href="javascript:void(0);">link</a>.
  </p>
</div>`);
  })
  .add('Shade (examples)', () => {
    const value = radios(label, options, defaultValue);

    return withExample(`<div class="nds-box nds-theme_${value} nds-theme_shade">
  <p>
    This is a <strong>${value}</strong> theme and here is a <a href="javascript:void(0);">link</a>.
  </p>
</div>`);
  })
  .add('Texture (examples)', () => {
    const value = radios(label, options, defaultValue);
    return withExample(`<div class="nds-box nds-theme_${value} nds-theme_shade nds-theme_alert-texture">
  <p>
    This theme has the <strong>alert texture</strong> added to the ${value} theme and has a <a href="javascript:void(0);">link</a>.
  </p>
</div>`);
  });
