import { storiesOf } from '@storybook/html';
import base from 'paths.macro';
import notes from './doc.md';
import scss from './base/_index.scss';
import {
  withExample,
  withDocs,
  commentToHTML
} from '../../../scripts/storybook';

storiesOf(`${base}`, module)
  .addDecorator(withDocs(notes))
  .addDecorator(commentToHTML(scss))
  .add('Default (default)', () => {
    return withExample(`<div class="nds-page-header">
  <div class="nds-media">
    <div class="nds-media__figure">
      <span class="nds-icon_container nds-icon-standard-opportunity" title="Description of icon when needed">
        <svg class="nds-icon nds-page-header__icon" aria-hidden="true">
          <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#opportunity"></use>
        </svg>
      </span>
    </div>
    <div class="nds-media__body">
      <h1 class="nds-page-header__title nds-truncate nds-align-middle" title="Rohde Corp - 80,000 Widgets">Rohde Corp - 80,000 Widgets</h1>
      <p class="nds-text-body_small nds-line-height_reset">Mark Jaeckal • Unlimited Customer • 11/13/15</p>
    </div>
  </div>
</div>`);
  });
