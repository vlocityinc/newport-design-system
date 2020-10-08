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
    return withExample(`<div class="nds-section nds-is-open">
  <h3 class="nds-section__title">
    <button aria-controls="expando-unique-id" aria-expanded="true" class="nds-button nds-section__title-action">
      <svg class="nds-section__title-action-icon nds-button__icon nds-button__icon_left" aria-hidden="true">
        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#switch"></use>
      </svg>
      <span class="nds-truncate" title="Section Title">Section Title</span>
    </button>
  </h3>
  <div aria-hidden="false" class="nds-section__content" id="expando-unique-id">
    <p>Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Nullam quis risus eget urna mollis ornare vel eu leo. Nulla vitae elit libero, a pharetra augue.</p>
  </div>
</div>`);
  })
  .add('Closed (states)', () => {
    return withExample(`<div class="nds-section">
  <h3 class="nds-section__title">
    <button aria-controls="expando-unique-id" aria-expanded="false" class="nds-button nds-section__title-action">
      <svg class="nds-section__title-action-icon nds-button__icon nds-button__icon_left" aria-hidden="true">
        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#switch"></use>
      </svg>
      <span class="nds-truncate" title="Section Title">Section Title</span>
    </button>
  </h3>
  <div aria-hidden="true" class="nds-section__content" id="expando-unique-id">
    <p>Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Nullam quis risus eget urna mollis ornare vel eu leo. Nulla vitae elit libero, a pharetra augue.</p>
  </div>
</div>`);
  })
  .add('Non Collapsable (examples)', () => {
    return withExample(`<div class="nds-section nds-is-open">
  <h3 class="nds-section__title nds-theme_shade">
    <span class="nds-truncate nds-p-horizontal_small" title="Section Title">Section Title</span>
  </h3>
  <div aria-hidden="false" class="nds-section__content">
    <p>Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Nullam quis risus eget urna mollis ornare vel eu leo. Nulla vitae elit libero, a pharetra augue.</p>
  </div>
</div>`);
  });
