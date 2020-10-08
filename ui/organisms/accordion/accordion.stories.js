import { storiesOf } from '@storybook/html';
import base from 'paths.macro';
import { withKnobs, radios } from '@storybook/addon-knobs';
import {
  withExample,
  withDocs,
  commentToHTML
} from '../../../scripts/storybook';
import scss from './base/_index.scss';
import notes from './doc.md';

const label = 'Open Sections';
const options = {
  None: '',
  One: 'One',
  Two: 'Two',
  Three: 'Three'
};
const defaultValue = '';

storiesOf(`${base}`, module)
  .addDecorator(withKnobs)
  .addDecorator(commentToHTML(scss))
  .addDecorator(withDocs(notes))
  .add('Default', () => {
    const value = radios(label, options, defaultValue);
    return withExample(`<ul class="nds-accordion">
      <li class="nds-accordion__list-item">
        <section class="nds-accordion__section ${value === 'One'
          ? 'nds-is-open'
          : ''}">
          <div class="nds-accordion__summary">
            <h3 class="nds-text-heading_small nds-accordion__summary-heading">
              <button aria-controls="accordion-details-01" aria-expanded="true" class="nds-button nds-button_reset nds-accordion__summary-action">
                <svg class="nds-accordion__summary-action-icon nds-button__icon nds-button__icon_left" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#switch"></use>
                </svg>
                <span class="nds-truncate" title="Accordion summary">Accordion summary</span>
              </button>
            </h3>
            <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small nds-shrink-none" aria-haspopup="true">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
              </svg>
              <span class="nds-assistive-text">More Options</span>
            </button>
          </div>
          <div aria-hidden="false" class="nds-accordion__content" id="accordion-details-01">Accordion details - A</div>
        </section>
      </li>
      <li class="nds-accordion__list-item">
        <section class="nds-accordion__section ${value === 'Two'
          ? 'nds-is-open'
          : ''}">
          <div class="nds-accordion__summary">
            <h3 class="nds-text-heading_small nds-accordion__summary-heading">
              <button aria-controls="accordion-details-02" aria-expanded="false" class="nds-button nds-button_reset nds-accordion__summary-action">
                <svg class="nds-accordion__summary-action-icon nds-button__icon nds-button__icon_left" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#switch"></use>
                </svg>
                <span class="nds-truncate" title="Accordion summary">Accordion summary</span>
              </button>
            </h3>
            <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small nds-shrink-none" aria-haspopup="true">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
              </svg>
              <span class="nds-assistive-text">More Options</span>
            </button>
          </div>
          <div aria-hidden="true" class="nds-accordion__content" id="accordion-details-02">Accordion details - B</div>
        </section>
      </li>
      <li class="nds-accordion__list-item">
        <section class="nds-accordion__section ${value === 'Three'
          ? 'nds-is-open'
          : ''}">
          <div class="nds-accordion__summary">
            <h3 class="nds-text-heading_small nds-accordion__summary-heading">
              <button aria-controls="accordion-details-03" aria-expanded="false" class="nds-button nds-button_reset nds-accordion__summary-action">
                <svg class="nds-accordion__summary-action-icon nds-button__icon nds-button__icon_left" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#switch"></use>
                </svg>
                <span class="nds-truncate" title="Accordion summary">Accordion summary</span>
              </button>
            </h3>
            <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small nds-shrink-none" aria-haspopup="true">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
              </svg>
              <span class="nds-assistive-text">More Options</span>
            </button>
          </div>
          <div aria-hidden="true" class="nds-accordion__content" id="accordion-details-03">Accordion details - C</div>
        </section>
      </li>
    </ul>`);
  })
  .add('In Card', () => {
    const value = radios(label, options, defaultValue);
    return withExample(`<div class="nds-card">
  <ul class="nds-accordion">
    <li class="nds-accordion__list-item">
      <section class="nds-accordion__section ${value === 'One'
        ? 'nds-is-open'
        : ''}">
        <div class="nds-accordion__summary">
          <h3 class="nds-text-heading_small nds-accordion__summary-heading">
            <button aria-controls="accordion-details-01" aria-expanded="true" class="nds-button nds-button_reset nds-accordion__summary-action">
              <svg class="nds-accordion__summary-action-icon nds-button__icon nds-button__icon_left" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#switch"></use>
              </svg>
              <span class="nds-truncate" title="Accordion summary">Accordion summary</span>
            </button>
          </h3>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small nds-shrink-none" aria-haspopup="true">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
            </svg>
            <span class="nds-assistive-text">More Options</span>
          </button>
        </div>
        <div aria-hidden="false" class="nds-accordion__content" id="accordion-details-01">Accordion details - A</div>
      </section>
    </li>
    <li class="nds-accordion__list-item">
      <section class="nds-accordion__section ${value === 'Two'
        ? 'nds-is-open'
        : ''}">
        <div class="nds-accordion__summary">
          <h3 class="nds-text-heading_small nds-accordion__summary-heading">
            <button aria-controls="accordion-details-02" aria-expanded="false" class="nds-button nds-button_reset nds-accordion__summary-action">
              <svg class="nds-accordion__summary-action-icon nds-button__icon nds-button__icon_left" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#switch"></use>
              </svg>
              <span class="nds-truncate" title="Accordion summary">Accordion summary</span>
            </button>
          </h3>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small nds-shrink-none" aria-haspopup="true">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
            </svg>
            <span class="nds-assistive-text">More Options</span>
          </button>
        </div>
        <div aria-hidden="true" class="nds-accordion__content" id="accordion-details-02">Accordion details - B</div>
      </section>
    </li>
    <li class="nds-accordion__list-item">
      <section class="nds-accordion__section ${value === 'Three'
        ? 'nds-is-open'
        : ''}">
        <div class="nds-accordion__summary">
          <h3 class="nds-text-heading_small nds-accordion__summary-heading">
            <button aria-controls="accordion-details-03" aria-expanded="false" class="nds-button nds-button_reset nds-accordion__summary-action">
              <svg class="nds-accordion__summary-action-icon nds-button__icon nds-button__icon_left" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#switch"></use>
              </svg>
              <span class="nds-truncate" title="Accordion summary">Accordion summary</span>
            </button>
          </h3>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small nds-shrink-none" aria-haspopup="true">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
            </svg>
            <span class="nds-assistive-text">More Options</span>
          </button>
        </div>
        <div aria-hidden="true" class="nds-accordion__content" id="accordion-details-03">Accordion details - C</div>
      </section>
    </li>
  </ul>
</div>`);
  });
