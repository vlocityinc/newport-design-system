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
    return withExample(`<div style="padding: 0.5rem;">
  <button class="nds-button nds-button_icon" title="Provide description of action">
    <svg class="nds-button__icon" aria-hidden="true">
      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#settings"></use>
    </svg>
    <span class="nds-assistive-text">Provide description of action</span>
  </button>
</div>`);
  })
  .add('Button Icon Error (states)', () => {
    return withExample(`<div style="padding: 0.5rem;">
  <button class="nds-button nds-button_icon nds-button_icon-error" title="Warning">
    <svg class="nds-button__icon" aria-hidden="true">
      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#warning"></use>
    </svg>
    <span class="nds-assistive-text">Warning</span>
  </button>
</div>`);
  })
  .add('Button Icon Disabled (states)', () => {
    return withExample(`<div style="padding: 0.5rem;">
  <button class="nds-button nds-button_icon" disabled="" title="Provide description of action">
    <svg class="nds-button__icon" aria-hidden="true">
      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#settings"></use>
    </svg>
    <span class="nds-assistive-text">Provide description of action</span>
  </button>
</div>`);
  })
  .add('Hint Hover (examples)', () => {
    return withExample(`<div style="padding: 0.5rem;">
  <div class="nds-hint-parent">
    <button class="nds-button nds-button_icon nds-button_icon" title="Provide description of action">
      <svg class="nds-button__icon nds-button__icon_hint" aria-hidden="true">
        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#settings"></use>
      </svg>
      <span class="nds-assistive-text">Provide description of action</span>
    </button>
  </div>
</div>`);
  })
  .add('Button Icon Inverse (examples)', () => {
    return withExample(`<div style="padding: 0.5rem;">
  <div style="padding: 0.5rem; background-color: rgb(22, 50, 92);">
    <button class="nds-button nds-button_icon nds-button_icon-inverse" title="Provide description of action">
      <svg class="nds-button__icon" aria-hidden="true">
        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#settings"></use>
      </svg>
      <span class="nds-assistive-text">Provide description of action</span>
    </button>
  </div>
</div>`);
  })
  .add('Button Icon Inverse Disabled (examples)', () => {
    return withExample(`<div style="padding: 0.5rem;">
  <div style="padding: 0.5rem; background-color: rgb(22, 50, 92);">
    <button class="nds-button nds-button_icon nds-button_icon-inverse" disabled="" title="Provide description of action">
      <svg class="nds-button__icon" aria-hidden="true">
        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#settings"></use>
      </svg>
      <span class="nds-assistive-text">Provide description of action</span>
    </button>
  </div>
</div>`);
  });
