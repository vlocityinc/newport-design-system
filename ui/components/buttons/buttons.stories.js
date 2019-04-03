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

const label = 'Theme';
const options = {
  None: '',
  Neutral: 'neutral',
  Brand: 'brand',
  Destructive: 'destructive',
  Success: 'success'
};
const defaultValue = 'neutral';

storiesOf(`${base}`, module)
  .addDecorator(withKnobs)
  .addDecorator(withDocs(notes))
  .addDecorator(commentToHTML(scss))
  .add('Simple', () => {
    const value = radios(label, options, defaultValue);
    const classes = 'nds-button ' + (value ? 'nds-button_' + value : '');
    return withExample(`<button class="${classes}">Button</button>`);
  })
  .add('Disabled', () => {
    const value = radios(label, options, defaultValue);
    const classes = 'nds-button ' + (value ? 'nds-button_' + value : '');
    return withExample(`<button disabled class="${classes}">Button</button>`);
  })
  .add('With left icon', () => {
    const value = radios(label, options, defaultValue);
    const classes = 'nds-button ' + (value ? 'nds-button_' + value : '');
    return withExample(`<button class="${classes}">
      <svg class="nds-button__icon nds-button__icon_left" aria-hidden="true">
        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="assets/icons/utility-sprite/svg/symbols.svg#download" />
      </svg>
      Button With Left Icon
    </button>`);
  })
  .add('With right icon', () => {
    const value = radios(label, options, defaultValue);
    const classes = 'nds-button ' + (value ? 'nds-button_' + value : '');
    return withExample(`<button class="${classes}">
      Button With Right Icon
      <svg class="nds-button__icon nds-button__icon_right" aria-hidden="true">
        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="assets/icons/utility-sprite/svg/symbols.svg#download" />
      </svg>
    </button>`);
  })
  .add('Stateful', () => {
    const label = 'State';
    const options = {
      'nds-not-selected': 'nds-not-selected',
      'nds-is-selected-clicked': 'nds-is-selected-clicked',
      'nds-is-selected': 'nds-is-selected'
    };
    const defaultValue = 'nds-not-selected';

    const value = radios(label, options, defaultValue);

    return withExample(`<button
        class='nds-button nds-button_neutral nds-button_stateful ${value}'
        aria-live="assertive">
        <span class="nds-text-not-selected">
          <svg class="nds-button__icon_stateful nds-button__icon_left" aria-hidden="true">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="assets/icons/utility-sprite/svg/symbols.svg#add" />
          </svg>
          Follow
        </span>
        <span class="nds-text-selected">
          <svg class="nds-button__icon_stateful nds-button__icon_left" aria-hidden="true">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="assets/icons/utility-sprite/svg/symbols.svg#check" />
          </svg>
          Following
        </span>
        <span class="nds-text-selected-focus">
          <svg class="nds-button__icon_stateful nds-button__icon_left" aria-hidden="true">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="assets/icons/utility-sprite/svg/symbols.svg#close" />
          </svg>
          Unfollow
        </span>
      </button>`);
  });
