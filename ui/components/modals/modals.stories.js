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

const label = 'Footer';
const options = {
  Default: '',
  Directional: ' nds-modal__footer_directional'
};
const defaultValue = '';

storiesOf(`${base}`, module)
  .addDecorator(withKnobs)
  .addDecorator(withDocs(notes))
  .addDecorator(commentToHTML(scss))
  .add('Default (default)', () => {
    const footer = radios(label, options, defaultValue);
    return withExample(`<div class="demo-only" style="height: 640px;">
  <section role="dialog" tabindex="-1" aria-labelledby="modal-heading-01" aria-modal="true" aria-describedby="modal-content-id-1" class="nds-modal nds-fade-in-open">
    <div class="nds-modal__container">
      <header class="nds-modal__header">
        <button class="nds-button nds-button_icon nds-modal__close nds-button_icon-inverse" title="Close">
          <svg class="nds-button__icon nds-button__icon_large" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
          </svg>
          <span class="nds-assistive-text">Close</span>
        </button>
        <h2 id="modal-heading-01" class="nds-text-heading_medium nds-hyphenate">Modal Header</h2>
      </header>
      <div class="nds-modal__content nds-p-around_medium" id="modal-content-id-1">
        <p>Sit nulla est ex deserunt exercitation anim occaecat. Nostrud ullamco deserunt aute id consequat veniam incididunt duis in sint irure nisi. Mollit officia cillum Lorem ullamco minim nostrud elit officia tempor esse quis. Cillum sunt ad dolore
          quis aute consequat ipsum magna exercitation reprehenderit magna. Tempor cupidatat consequat elit dolor adipisicing.</p>
        <p>Dolor eiusmod sunt ex incididunt cillum quis nostrud velit duis sit officia. Lorem aliqua enim laboris do dolor eiusmod officia. Mollit incididunt nisi consectetur esse laborum eiusmod pariatur proident. Eiusmod et adipisicing culpa deserunt nostrud
          ad veniam nulla aute est. Labore esse esse cupidatat amet velit id elit consequat minim ullamco mollit enim excepteur ea.</p>
      </div>
      <footer class="nds-modal__footer${footer}">
        <button class="nds-button nds-button_neutral">Cancel</button>
        <button class="nds-button nds-button_brand">Save</button>
      </footer>
    </div>
  </section>
  <div class="nds-backdrop nds-backdrop_open"></div>
</div>`);
  })
  .add('Taglines (examples)', () => {
    const footer = radios(label, options, defaultValue);

    return withExample(`<div class="demo-only" style="height: 640px;">
  <section role="dialog" tabindex="-1" aria-labelledby="modal-heading-01" aria-modal="true" aria-describedby="modal-content-id-1" class="nds-modal nds-fade-in-open">
    <div class="nds-modal__container">
      <header class="nds-modal__header">
        <button class="nds-button nds-button_icon nds-modal__close nds-button_icon-inverse" title="Close">
          <svg class="nds-button__icon nds-button__icon_large" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
          </svg>
          <span class="nds-assistive-text">Close</span>
        </button>
        <h2 id="modal-heading-01" class="nds-text-heading_medium nds-hyphenate">Modal Header</h2>
        <p class="nds-m-top_x-small">
          Here’s a tagline if you need it. It is allowed to extend across mulitple lines, so I’m making up content to show that to you. It is allowed to



          <a href="javascript:void(0);">contain links or be a link</a>
          .

        </p>
      </header>
      <div class="nds-modal__content nds-p-around_medium" id="modal-content-id-1">
        <p>Sit nulla est ex deserunt exercitation anim occaecat. Nostrud ullamco deserunt aute id consequat veniam incididunt duis in sint irure nisi. Mollit officia cillum Lorem ullamco minim nostrud elit officia tempor esse quis. Cillum sunt ad dolore
          quis aute consequat ipsum magna exercitation reprehenderit magna. Tempor cupidatat consequat elit dolor adipisicing.</p>
        <p>Dolor eiusmod sunt ex incididunt cillum quis nostrud velit duis sit officia. Lorem aliqua enim laboris do dolor eiusmod officia. Mollit incididunt nisi consectetur esse laborum eiusmod pariatur proident. Eiusmod et adipisicing culpa deserunt nostrud
          ad veniam nulla aute est. Labore esse esse cupidatat amet velit id elit consequat minim ullamco mollit enim excepteur ea.</p>
      </div>
      <footer class="nds-modal__footer${footer}">
        <button class="nds-button nds-button_neutral">Cancel</button>
        <button class="nds-button nds-button_brand">Save</button>
      </footer>
    </div>
  </section>
  <div class="nds-backdrop nds-backdrop_open"></div>
</div>`);
  })
  .add('Headless (examples)', () => {
    const footer = radios(label, options, defaultValue);

    return withExample(`<div class="demo-only" style="height: 640px;">
  <section role="dialog" tabindex="-1" aria-label="Meaningful description of the modal content" aria-modal="true" aria-describedby="modal-content-id-1" class="nds-modal nds-fade-in-open">
    <div class="nds-modal__container">
      <header class="nds-modal__header nds-modal__header_empty">
        <button class="nds-button nds-button_icon nds-modal__close nds-button_icon-inverse" title="Close">
          <svg class="nds-button__icon nds-button__icon_large" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
          </svg>
          <span class="nds-assistive-text">Close</span>
        </button>
      </header>
      <div class="nds-modal__content nds-p-around_medium" id="modal-content-id-1">
        <p>Sit nulla est ex deserunt exercitation anim occaecat. Nostrud ullamco deserunt aute id consequat veniam incididunt duis in sint irure nisi. Mollit officia cillum Lorem ullamco minim nostrud elit officia tempor esse quis. Cillum sunt ad dolore
          quis aute consequat ipsum magna exercitation reprehenderit magna. Tempor cupidatat consequat elit dolor adipisicing.</p>
        <p>Dolor eiusmod sunt ex incididunt cillum quis nostrud velit duis sit officia. Lorem aliqua enim laboris do dolor eiusmod officia. Mollit incididunt nisi consectetur esse laborum eiusmod pariatur proident. Eiusmod et adipisicing culpa deserunt nostrud
          ad veniam nulla aute est. Labore esse esse cupidatat amet velit id elit consequat minim ullamco mollit enim excepteur ea.</p>
      </div>
      <footer class="nds-modal__footer${footer}">
        <button class="nds-button nds-button_neutral">Cancel</button>
        <button class="nds-button nds-button_brand">Save</button>
      </footer>
    </div>
  </section>
  <div class="nds-backdrop nds-backdrop_open"></div>
</div>`);
  })
  .add('Footless (examples)', () => {
    return withExample(`<div class="demo-only" style="height: 640px;">
  <section role="dialog" tabindex="-1" aria-labelledby="modal-heading-01" aria-modal="true" aria-describedby="modal-content-id-1" class="nds-modal nds-fade-in-open">
    <div class="nds-modal__container">
      <header class="nds-modal__header">
        <button class="nds-button nds-button_icon nds-modal__close nds-button_icon-inverse" title="Close">
          <svg class="nds-button__icon nds-button__icon_large" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
          </svg>
          <span class="nds-assistive-text">Close</span>
        </button>
        <h2 id="modal-heading-01" class="nds-text-heading_medium nds-hyphenate">Modal Header</h2>
      </header>
      <div class="nds-modal__content nds-p-around_medium" id="modal-content-id-1">
        <p>Sit nulla est ex deserunt exercitation anim occaecat. Nostrud ullamco deserunt aute id consequat veniam incididunt duis in sint irure nisi. Mollit officia cillum Lorem ullamco minim nostrud elit officia tempor esse quis. Cillum sunt ad dolore
          quis aute consequat ipsum magna exercitation reprehenderit magna. Tempor cupidatat consequat elit dolor adipisicing.</p>
        <p>Dolor eiusmod sunt ex incididunt cillum quis nostrud velit duis sit officia. Lorem aliqua enim laboris do dolor eiusmod officia. Mollit incididunt nisi consectetur esse laborum eiusmod pariatur proident. Eiusmod et adipisicing culpa deserunt nostrud
          ad veniam nulla aute est. Labore esse esse cupidatat amet velit id elit consequat minim ullamco mollit enim excepteur ea.</p>
      </div>
    </div>
  </section>
  <div class="nds-backdrop nds-backdrop_open"></div>
</div>`);
  });
