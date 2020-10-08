import { storiesOf } from '@storybook/html';
import base from 'paths.macro';
import scss from './base/_index.scss';
import notes from './doc.md';
import {
  withExample,
  withDocs,
  commentToHTML
} from '../../../scripts/storybook';

storiesOf(`${base}`, module)
  .addDecorator(withDocs(notes))
  .addDecorator(commentToHTML(scss))
  .add('Default', () => {
    return withExample(`<span class="nds-badge">Badge Label</span>`);
  })
  .add('Brand', () => {
    return withExample(
      `<span class="nds-badge nds-badge_brand">Badge Label</span>`
    );
  })
  .add('Inverse', () => {
    return withExample(
      `<span class="nds-badge nds-badge_inverse">Badge Label</span>`
    );
  })
  .add('Light with icon', () => {
    return withExample(`<span class="nds-badge nds-badge_lightest">
    <span class="nds-icon_container nds-icon-utility-moneybag nds-m-right_xx-small" title="Description of icon when needed">
      <svg class="nds-icon nds-icon_xx-small nds-icon-text-default" aria-hidden="true">
        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#moneybag"></use>
      </svg>
    </span>
    423 Credits Available
  </span>`);
  });
