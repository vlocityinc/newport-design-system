import { storiesOf } from '@storybook/html';
import base from 'paths.macro';
import notes from '../doc.md';
import scss from '../base/_index.scss';
import {
  withExample,
  withDocs,
  commentToHTML
} from '../../../../scripts/storybook';

storiesOf(`${base}`, module)
  .addDecorator(withDocs(notes))
  .addDecorator(commentToHTML(scss))
  .add('Default (default)', () => {
    return withExample(`<button class="nds-button nds-button_icon nds-button_icon-border-filled" aria-pressed="false" title="Like">
  <svg class="nds-button__icon" aria-hidden="true">
    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#like"></use>
  </svg>
  <span class="nds-assistive-text">Like</span>
</button>`);
  })
  .add('Button Icon Stateful Selected (states)', () => {
    return withExample(`<button class="nds-button nds-button_icon nds-button_icon-border-filled nds-is-selected" aria-pressed="true" title="Like">
  <svg class="nds-button__icon" aria-hidden="true">
    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#like"></use>
  </svg>
  <span class="nds-assistive-text">Like</span>
</button>`);
  });
