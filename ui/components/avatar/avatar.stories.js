import { storiesOf } from '@storybook/html';
import { withKnobs, radios } from '@storybook/addon-knobs';
import base from 'paths.macro';
import scss from './base/_index.scss';
import notes from './doc.md';
import {
  withExample,
  withDocs,
  commentToHTML
} from '../../../scripts/storybook';

const sizeLabel = 'Size';
const sizes = {
  default: '',
  'nds-avatar_x-small': ' nds-avatar_x-small',
  'nds-avatar_small': ' nds-avatar_small',
  'nds-avatar_medium': ' nds-avatar_medium',
  'nds-avatar_large': ' nds-avatar_large'
};

const shapeLabel = 'Shape';
const shapes = {
  default: '',
  circle: ' nds-avatar_circle'
};

storiesOf(`${base}`, module)
  .addDecorator(withKnobs)
  .addDecorator(withDocs(notes))
  .addDecorator(commentToHTML(scss))
  .add('Default', () => {
    const size = radios(sizeLabel, sizes, '');
    const shape = radios(shapeLabel, shapes, '');
    return withExample(`<span class="nds-avatar${size}${shape}">
      <img alt="Person name" src="/assets/images/avatar2.jpg" title="User avatar">
    </span>`);
  })
  .add('Fallback (user initials)', () => {
    const size = radios(sizeLabel, sizes, '');
    const shape = radios(shapeLabel, shapes, '');
    return withExample(`<span class="nds-avatar${size}${shape}">
      <abbr class="nds-avatar__initials nds-icon-standard-user" title="person name">AB</abbr>
    </span>`);
  })
  .add('Fallback (user icon)', () => {
    const size = radios(sizeLabel, sizes, '');
    const shape = radios(shapeLabel, shapes, '');
    return withExample(`<span class="nds-avatar${size}${shape}">
    <span class="nds-icon_container nds-icon-standard-user" title="Description of icon when needed">
      <svg class="nds-icon" aria-hidden="true">
        <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#user"></use>
      </svg>
      <span class="nds-assistive-text">Description of icon</span>
    </span>
  </span>`);
  });
