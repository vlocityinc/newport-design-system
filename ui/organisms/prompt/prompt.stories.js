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
    return withExample(`<div class="demo-only" style="height: 24rem;">
  <section role="alertdialog" tabindex="-1" aria-labelledby="prompt-heading-id" aria-describedby="prompt-message-wrapper" class="nds-modal nds-fade-in-open nds-modal_prompt" aria-modal="true">
    <div class="nds-modal__container">
      <header class="nds-modal__header nds-theme_error nds-theme_alert-texture">
        <button class="nds-button nds-button_icon nds-modal__close nds-button_icon-inverse" title="Close">
          <svg class="nds-button__icon nds-button__icon_large" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
          </svg>
          <span class="nds-assistive-text">Close</span>
        </button>
        <h2 class="nds-text-heading_medium" id="prompt-heading-id">Service Unavailable</h2>
      </header>
      <div class="nds-modal__content nds-p-around_medium" id="modal-content-id-1">
        <p>Sit nulla est ex deserunt exercitation anim occaecat. Nostrud ullamco deserunt aute id consequat veniam incididunt duis in sint irure nisi. Mollit officia cillum Lorem ullamco minim nostrud elit officia tempor esse quis. Cillum sunt ad dolore
          quis aute consequat ipsum magna exercitation reprehenderit magna. Tempor cupidatat consequat elit dolor adipisicing.</p>
      </div>
      <footer class="nds-modal__footer nds-theme_default">
        <button class="nds-button nds-button_neutral">Okay</button>
      </footer>
    </div>
  </section>
  <div class="nds-backdrop nds-backdrop_open"></div>
</div>`);
  });
