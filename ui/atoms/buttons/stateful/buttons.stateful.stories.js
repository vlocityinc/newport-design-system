import { storiesOf } from '@storybook/html';
import { withKnobs, radios } from '@storybook/addon-knobs';
import base from 'paths.macro';
import notes from './doc.md';
import scss from './_index.scss';
import {
  withExample,
  withDocs,
  commentToHTML
} from '..././../../scripts/storybook';

storiesOf(`${base}`, module)
  .addDecorator(withKnobs)
  .addDecorator(withDocs(notes))
  .addDecorator(commentToHTML(scss))
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
