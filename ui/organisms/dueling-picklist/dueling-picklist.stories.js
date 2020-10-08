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
    return withExample(`<div class="nds-dueling-list">
  <div class="nds-assistive-text" id="drag-live-region" aria-live="assertive"></div>
  <div class="nds-assistive-text" id="option-drag-label">Press space bar when on an item, to move it within the list. CMD plus left and right arrow keys, to move items between lists.</div>
  <div class="nds-dueling-list__column">
    <span class="nds-form-element__label" id="label-1">First Category</span>
    <div class="nds-dueling-list__options" role="application">
      <ul aria-describedby="option-drag-label" aria-labelledby="label-1" aria-multiselectable="true" class="nds-listbox nds-listbox_vertical" role="listbox">
        <li role="presentation" class="nds-listbox__item">
          <span class="nds-listbox__option nds-listbox__option_plain nds-media" aria-selected="false" draggable="true" role="option" tabindex="0">
            <span class="nds-truncate" title="Option 1">
              Option 1

            </span>
          </span>
        </li>
        <li role="presentation" class="nds-listbox__item">
          <span class="nds-listbox__option nds-listbox__option_plain nds-media" aria-selected="false" draggable="true" role="option" tabindex="-1">
            <span class="nds-truncate" title="Option 2">
              Option 2

            </span>
          </span>
        </li>
        <li role="presentation" class="nds-listbox__item">
          <span class="nds-listbox__option nds-listbox__option_plain nds-media" aria-selected="false" draggable="true" role="option" tabindex="-1">
            <span class="nds-truncate" title="Option 3">
              Option 3

            </span>
          </span>
        </li>
        <li role="presentation" class="nds-listbox__item">
          <span class="nds-listbox__option nds-listbox__option_plain nds-media" aria-selected="false" draggable="true" role="option" tabindex="-1">
            <span class="nds-truncate" title="Option 6">
              Option 6

            </span>
          </span>
        </li>
      </ul>
    </div>
  </div>
  <div class="nds-dueling-list__column">
    <button class="nds-button nds-button_icon nds-button_icon-container" title="Up">
      <svg class="nds-button__icon" aria-hidden="true">
        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#right"></use>
      </svg>
      <span class="nds-assistive-text">
        Move Selection



        to Second Category

      </span>
    </button>
    <button class="nds-button nds-button_icon nds-button_icon-container" title="Down">
      <svg class="nds-button__icon" aria-hidden="true">
        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#left"></use>
      </svg>
      <span class="nds-assistive-text">
        Move Selection



        to First Category

      </span>
    </button>
  </div>
  <div class="nds-dueling-list__column">
    <span class="nds-form-element__label" id="label-2">Second Category</span>
    <div class="nds-dueling-list__options" role="application">
      <ul aria-describedby="option-drag-label" aria-labelledby="label-2" aria-multiselectable="true" class="nds-listbox nds-listbox_vertical" role="listbox">
        <li role="presentation" class="nds-listbox__item">
          <span class="nds-listbox__option nds-listbox__option_plain nds-media" aria-selected="false" draggable="true" role="option" tabindex="0">
            <span class="nds-truncate" title="Option 4">
              Option 4

            </span>
          </span>
        </li>
        <li role="presentation" class="nds-listbox__item">
          <span class="nds-listbox__option nds-listbox__option_plain nds-media" aria-selected="false" draggable="true" role="option" tabindex="-1">
            <span class="nds-truncate" title="Option 5">
              Option 5

            </span>
          </span>
        </li>
      </ul>
    </div>
  </div>
  <div class="nds-dueling-list__column">
    <button class="nds-button nds-button_icon nds-button_icon-container" title="Up">
      <svg class="nds-button__icon" aria-hidden="true">
        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#up"></use>
      </svg>
      <span class="nds-assistive-text">
        Move Selection



        Up

      </span>
    </button>
    <button class="nds-button nds-button_icon nds-button_icon-container" title="Down">
      <svg class="nds-button__icon" aria-hidden="true">
        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
      </svg>
      <span class="nds-assistive-text">
        Move Selection



        Down

      </span>
    </button>
  </div>
</div>`);
  })
  .add('Required Dueling Picklist (states)', () => {
    return withExample(`<div class="nds-dueling-list">
  <div class="nds-assistive-text" id="drag-live-region" aria-live="assertive"></div>
  <div class="nds-assistive-text" id="option-drag-label">Press space bar when on an item, to move it within the list. CMD plus left and right arrow keys, to move items between lists. Required items must remain in the second category.</div>
  <div class="nds-dueling-list__column">
    <span class="nds-form-element__label" id="label-3">First Category</span>
    <div class="nds-dueling-list__options" role="application">
      <ul aria-describedby="option-drag-label" aria-labelledby="label-3" aria-multiselectable="true" class="nds-listbox nds-listbox_vertical" role="listbox">
        <li role="presentation" class="nds-listbox__item">
          <span class="nds-listbox__option nds-listbox__option_plain nds-media" aria-selected="false" draggable="true" role="option" tabindex="0">
            <span class="nds-truncate" title="Option 1">
              Option 1

            </span>
          </span>
        </li>
        <li role="presentation" class="nds-listbox__item">
          <span class="nds-listbox__option nds-listbox__option_plain nds-media" aria-selected="false" draggable="true" role="option" tabindex="-1">
            <span class="nds-truncate" title="Option 2">
              Option 2

            </span>
          </span>
        </li>
        <li role="presentation" class="nds-listbox__item">
          <span class="nds-listbox__option nds-listbox__option_plain nds-media" aria-selected="false" draggable="true" role="option" tabindex="-1">
            <span class="nds-truncate" title="Option 3">
              Option 3

            </span>
          </span>
        </li>
        <li role="presentation" class="nds-listbox__item">
          <span class="nds-listbox__option nds-listbox__option_plain nds-media" aria-selected="false" draggable="true" role="option" tabindex="-1">
            <span class="nds-truncate" title="Option 6">
              Option 6

            </span>
          </span>
        </li>
      </ul>
    </div>
  </div>
  <div class="nds-dueling-list__column">
    <button class="nds-button nds-button_icon nds-button_icon-container" title="Up">
      <svg class="nds-button__icon" aria-hidden="true">
        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#right"></use>
      </svg>
      <span class="nds-assistive-text">
        Move Selection



        to Second Category

      </span>
    </button>
    <button class="nds-button nds-button_icon nds-button_icon-container" title="Down">
      <svg class="nds-button__icon" aria-hidden="true">
        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#left"></use>
      </svg>
      <span class="nds-assistive-text">
        Move Selection



        to First Category

      </span>
    </button>
  </div>
  <div class="nds-dueling-list__column">
    <span class="nds-form-element__label" id="label-4">Second Category</span>
    <div class="nds-dueling-list__options" role="application">
      <ul aria-describedby="option-drag-label" aria-labelledby="label-4" aria-multiselectable="true" class="nds-listbox nds-listbox_vertical" role="listbox">
        <li role="presentation" class="nds-listbox__item">
          <span class="nds-listbox__option nds-listbox__option_plain nds-media" aria-selected="false" draggable="true" role="option" tabindex="0">
            <span class="nds-truncate" title="Option 4">
              Option 4

              <abbr class="nds-required" title="required">*</abbr>
            </span>
          </span>
        </li>
        <li role="presentation" class="nds-listbox__item">
          <span class="nds-listbox__option nds-listbox__option_plain nds-media" aria-selected="false" draggable="true" role="option" tabindex="-1">
            <span class="nds-truncate" title="Option 5">
              Option 5

            </span>
          </span>
        </li>
      </ul>
    </div>
  </div>
  <div class="nds-dueling-list__column">
    <button class="nds-button nds-button_icon nds-button_icon-container" title="Up">
      <svg class="nds-button__icon" aria-hidden="true">
        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#up"></use>
      </svg>
      <span class="nds-assistive-text">
        Move Selection



        Up

      </span>
    </button>
    <button class="nds-button nds-button_icon nds-button_icon-container" title="Down">
      <svg class="nds-button__icon" aria-hidden="true">
        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
      </svg>
      <span class="nds-assistive-text">
        Move Selection



        Down

      </span>
    </button>
  </div>
</div>`);
  })
  .add('Disabled Dueling Picklist (states)', () => {
    return withExample(`<div class="nds-dueling-list">
  <div class="nds-assistive-text" id="drag-live-region" aria-live="assertive"></div>
  <div class="nds-assistive-text" id="option-drag-label">Press space bar when on an item, to move it within the list. CMD plus left and right arrow keys, to move items between lists.</div>
  <div class="nds-dueling-list__column">
    <span class="nds-form-element__label" id="label-5">First Category</span>
    <div class="nds-dueling-list__options" role="application" aria-disabled="true">
      <ul aria-describedby="option-drag-label" aria-labelledby="label-5" aria-multiselectable="true" class="nds-listbox nds-listbox_vertical" role="listbox">
        <li role="presentation" class="nds-listbox__item">
          <span class="nds-listbox__option nds-listbox__option_plain nds-media" aria-selected="false" draggable="true" role="option" tabindex="0">
            <span class="nds-truncate" title="Option 1">
              Option 1

            </span>
          </span>
        </li>
        <li role="presentation" class="nds-listbox__item">
          <span class="nds-listbox__option nds-listbox__option_plain nds-media" aria-selected="false" draggable="true" role="option" tabindex="-1">
            <span class="nds-truncate" title="Option 2">
              Option 2

            </span>
          </span>
        </li>
        <li role="presentation" class="nds-listbox__item">
          <span class="nds-listbox__option nds-listbox__option_plain nds-media" aria-selected="false" draggable="true" role="option" tabindex="-1">
            <span class="nds-truncate" title="Option 3">
              Option 3

            </span>
          </span>
        </li>
        <li role="presentation" class="nds-listbox__item">
          <span class="nds-listbox__option nds-listbox__option_plain nds-media" aria-selected="false" draggable="true" role="option" tabindex="-1">
            <span class="nds-truncate" title="Option 6">
              Option 6

            </span>
          </span>
        </li>
      </ul>
    </div>
  </div>
  <div class="nds-dueling-list__column">
    <button class="nds-button nds-button_icon nds-button_icon-container" title="Up" disabled="">
      <svg class="nds-button__icon" aria-hidden="true">
        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#right"></use>
      </svg>
      <span class="nds-assistive-text">
        Move Selection



        to Second Category

      </span>
    </button>
    <button class="nds-button nds-button_icon nds-button_icon-container" title="Down" disabled="">
      <svg class="nds-button__icon" aria-hidden="true">
        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#left"></use>
      </svg>
      <span class="nds-assistive-text">
        Move Selection



        to First Category

      </span>
    </button>
  </div>
  <div class="nds-dueling-list__column">
    <span class="nds-form-element__label" id="label-6">Second Category</span>
    <div class="nds-dueling-list__options" role="application" aria-disabled="true">
      <ul aria-describedby="option-drag-label" aria-labelledby="label-6" aria-multiselectable="true" class="nds-listbox nds-listbox_vertical" role="listbox">
        <li role="presentation" class="nds-listbox__item">
          <span class="nds-listbox__option nds-listbox__option_plain nds-media" aria-selected="false" draggable="true" role="option" tabindex="0">
            <span class="nds-truncate" title="Option 4">
              Option 4

            </span>
          </span>
        </li>
        <li role="presentation" class="nds-listbox__item">
          <span class="nds-listbox__option nds-listbox__option_plain nds-media" aria-selected="false" draggable="true" role="option" tabindex="-1">
            <span class="nds-truncate" title="Option 5">
              Option 5

            </span>
          </span>
        </li>
      </ul>
    </div>
  </div>
  <div class="nds-dueling-list__column">
    <button class="nds-button nds-button_icon nds-button_icon-container" title="Up" disabled="">
      <svg class="nds-button__icon" aria-hidden="true">
        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#up"></use>
      </svg>
      <span class="nds-assistive-text">
        Move Selection



        Up

      </span>
    </button>
    <button class="nds-button nds-button_icon nds-button_icon-container" title="Down" disabled="">
      <svg class="nds-button__icon" aria-hidden="true">
        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
      </svg>
      <span class="nds-assistive-text">
        Move Selection



        Down

      </span>
    </button>
  </div>
</div>`);
  })
  .add('Multi Select Selected Item (states)', () => {
    return withExample(`<div class="nds-dueling-list">
  <div class="nds-assistive-text" id="drag-live-region" aria-live="assertive"></div>
  <div class="nds-assistive-text" id="option-drag-label">Press space bar when on an item, to move it within the list. CMD plus left and right arrow keys, to move items between lists.</div>
  <div class="nds-dueling-list__column">
    <span class="nds-form-element__label" id="label-7">First Category</span>
    <div class="nds-dueling-list__options" role="application">
      <ul aria-describedby="option-drag-label" aria-labelledby="label-7" aria-multiselectable="true" class="nds-listbox nds-listbox_vertical" role="listbox">
        <li role="presentation" class="nds-listbox__item">
          <span class="nds-listbox__option nds-listbox__option_plain nds-media nds-is-selected" aria-selected="true" draggable="true" role="option" tabindex="0">
            <span class="nds-truncate" title="Option 1">
              Option 1

            </span>
          </span>
        </li>
        <li role="presentation" class="nds-listbox__item">
          <span class="nds-listbox__option nds-listbox__option_plain nds-media" aria-selected="false" draggable="true" role="option" tabindex="-1">
            <span class="nds-truncate" title="Option 2">
              Option 2

            </span>
          </span>
        </li>
        <li role="presentation" class="nds-listbox__item">
          <span class="nds-listbox__option nds-listbox__option_plain nds-media" aria-selected="false" draggable="true" role="option" tabindex="-1">
            <span class="nds-truncate" title="Option 3">
              Option 3

            </span>
          </span>
        </li>
        <li role="presentation" class="nds-listbox__item">
          <span class="nds-listbox__option nds-listbox__option_plain nds-media" aria-selected="false" draggable="true" role="option" tabindex="-1">
            <span class="nds-truncate" title="Option 6">
              Option 6

            </span>
          </span>
        </li>
      </ul>
    </div>
  </div>
  <div class="nds-dueling-list__column">
    <button class="nds-button nds-button_icon nds-button_icon-container" title="Up">
      <svg class="nds-button__icon" aria-hidden="true">
        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#right"></use>
      </svg>
      <span class="nds-assistive-text">
        Move Selection



        to Second Category

      </span>
    </button>
    <button class="nds-button nds-button_icon nds-button_icon-container" title="Down">
      <svg class="nds-button__icon" aria-hidden="true">
        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#left"></use>
      </svg>
      <span class="nds-assistive-text">
        Move Selection



        to First Category

      </span>
    </button>
  </div>
  <div class="nds-dueling-list__column">
    <span class="nds-form-element__label" id="label-8">Second Category</span>
    <div class="nds-dueling-list__options" role="application">
      <ul aria-describedby="option-drag-label" aria-labelledby="label-8" aria-multiselectable="true" class="nds-listbox nds-listbox_vertical" role="listbox">
        <li role="presentation" class="nds-listbox__item">
          <span class="nds-listbox__option nds-listbox__option_plain nds-media" aria-selected="false" draggable="true" role="option" tabindex="0">
            <span class="nds-truncate" title="Option 4">
              Option 4

            </span>
          </span>
        </li>
        <li role="presentation" class="nds-listbox__item">
          <span class="nds-listbox__option nds-listbox__option_plain nds-media" aria-selected="false" draggable="true" role="option" tabindex="-1">
            <span class="nds-truncate" title="Option 5">
              Option 5

            </span>
          </span>
        </li>
      </ul>
    </div>
  </div>
  <div class="nds-dueling-list__column">
    <button class="nds-button nds-button_icon nds-button_icon-container" title="Up">
      <svg class="nds-button__icon" aria-hidden="true">
        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#up"></use>
      </svg>
      <span class="nds-assistive-text">
        Move Selection



        Up

      </span>
    </button>
    <button class="nds-button nds-button_icon nds-button_icon-container" title="Down">
      <svg class="nds-button__icon" aria-hidden="true">
        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
      </svg>
      <span class="nds-assistive-text">
        Move Selection



        Down

      </span>
    </button>
  </div>
</div>`);
  })
  .add('Multi Select Multi Selected Items (states)', () => {
    return withExample(`<div class="nds-dueling-list">
  <div class="nds-assistive-text" id="drag-live-region" aria-live="assertive"></div>
  <div class="nds-assistive-text" id="option-drag-label">Press space bar when on an item, to move it within the list. CMD plus left and right arrow keys, to move items between lists.</div>
  <div class="nds-dueling-list__column">
    <span class="nds-form-element__label" id="label-9">First Category</span>
    <div class="nds-dueling-list__options" role="application">
      <ul aria-describedby="option-drag-label" aria-labelledby="label-9" aria-multiselectable="true" class="nds-listbox nds-listbox_vertical" role="listbox">
        <li role="presentation" class="nds-listbox__item">
          <span class="nds-listbox__option nds-listbox__option_plain nds-media nds-is-selected" aria-selected="true" draggable="true" role="option" tabindex="-1">
            <span class="nds-truncate" title="Option 1">
              Option 1

            </span>
          </span>
        </li>
        <li role="presentation" class="nds-listbox__item">
          <span class="nds-listbox__option nds-listbox__option_plain nds-media" aria-selected="false" draggable="true" role="option" tabindex="-1">
            <span class="nds-truncate" title="Option 2">
              Option 2

            </span>
          </span>
        </li>
        <li role="presentation" class="nds-listbox__item">
          <span class="nds-listbox__option nds-listbox__option_plain nds-media nds-is-selected" aria-selected="true" draggable="true" role="option" tabindex="0">
            <span class="nds-truncate" title="Option 3">
              Option 3

            </span>
          </span>
        </li>
        <li role="presentation" class="nds-listbox__item">
          <span class="nds-listbox__option nds-listbox__option_plain nds-media" aria-selected="false" draggable="true" role="option" tabindex="-1">
            <span class="nds-truncate" title="Option 6">
              Option 6

            </span>
          </span>
        </li>
      </ul>
    </div>
  </div>
  <div class="nds-dueling-list__column">
    <button class="nds-button nds-button_icon nds-button_icon-container" title="Up">
      <svg class="nds-button__icon" aria-hidden="true">
        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#right"></use>
      </svg>
      <span class="nds-assistive-text">
        Move Selection



        to Second Category

      </span>
    </button>
    <button class="nds-button nds-button_icon nds-button_icon-container" title="Down">
      <svg class="nds-button__icon" aria-hidden="true">
        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#left"></use>
      </svg>
      <span class="nds-assistive-text">
        Move Selection



        to First Category

      </span>
    </button>
  </div>
  <div class="nds-dueling-list__column">
    <span class="nds-form-element__label" id="label-10">Second Category</span>
    <div class="nds-dueling-list__options" role="application">
      <ul aria-describedby="option-drag-label" aria-labelledby="label-10" aria-multiselectable="true" class="nds-listbox nds-listbox_vertical" role="listbox">
        <li role="presentation" class="nds-listbox__item">
          <span class="nds-listbox__option nds-listbox__option_plain nds-media" aria-selected="false" draggable="true" role="option" tabindex="0">
            <span class="nds-truncate" title="Option 4">
              Option 4

            </span>
          </span>
        </li>
        <li role="presentation" class="nds-listbox__item">
          <span class="nds-listbox__option nds-listbox__option_plain nds-media" aria-selected="false" draggable="true" role="option" tabindex="-1">
            <span class="nds-truncate" title="Option 5">
              Option 5

            </span>
          </span>
        </li>
      </ul>
    </div>
  </div>
  <div class="nds-dueling-list__column">
    <button class="nds-button nds-button_icon nds-button_icon-container" title="Up">
      <svg class="nds-button__icon" aria-hidden="true">
        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#up"></use>
      </svg>
      <span class="nds-assistive-text">
        Move Selection



        Up

      </span>
    </button>
    <button class="nds-button nds-button_icon nds-button_icon-container" title="Down">
      <svg class="nds-button__icon" aria-hidden="true">
        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
      </svg>
      <span class="nds-assistive-text">
        Move Selection



        Down

      </span>
    </button>
  </div>
</div>`);
  })
  .add('Multi Select Grabbed (states)', () => {
    return withExample(`<div class="nds-dueling-list">
  <div class="nds-assistive-text" id="drag-live-region" aria-live="assertive">Option 3: current position 3 of 4. Press up or down arrows to move within list.</div>
  <div class="nds-assistive-text" id="option-drag-label"></div>
  <div class="nds-dueling-list__column">
    <span class="nds-form-element__label" id="label-11">First Category</span>
    <div class="nds-dueling-list__options" role="application">
      <ul aria-describedby="option-drag-label" aria-labelledby="label-11" aria-multiselectable="true" class="nds-listbox nds-listbox_vertical" role="listbox">
        <li role="presentation" class="nds-listbox__item">
          <span class="nds-listbox__option nds-listbox__option_plain nds-media" aria-selected="false" draggable="true" role="option" tabindex="-1">
            <span class="nds-truncate" title="Option 1">
              Option 1

            </span>
          </span>
        </li>
        <li role="presentation" class="nds-listbox__item">
          <span class="nds-listbox__option nds-listbox__option_plain nds-media" aria-selected="false" draggable="true" role="option" tabindex="-1">
            <span class="nds-truncate" title="Option 2">
              Option 2

            </span>
          </span>
        </li>
        <li role="presentation" class="nds-listbox__item">
          <span class="nds-listbox__option nds-listbox__option_plain nds-media nds-is-grabbed nds-is-selected" aria-selected="true" draggable="true" role="option" tabindex="0">
            <span class="nds-truncate" title="Option 3">
              Option 3

            </span>
          </span>
        </li>
        <li role="presentation" class="nds-listbox__item">
          <span class="nds-listbox__option nds-listbox__option_plain nds-media" aria-selected="false" draggable="true" role="option" tabindex="-1">
            <span class="nds-truncate" title="Option 6">
              Option 6

            </span>
          </span>
        </li>
      </ul>
    </div>
  </div>
  <div class="nds-dueling-list__column">
    <button class="nds-button nds-button_icon nds-button_icon-container" title="Up">
      <svg class="nds-button__icon" aria-hidden="true">
        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#right"></use>
      </svg>
      <span class="nds-assistive-text">
        Move Selection



        to Second Category

      </span>
    </button>
    <button class="nds-button nds-button_icon nds-button_icon-container" title="Down">
      <svg class="nds-button__icon" aria-hidden="true">
        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#left"></use>
      </svg>
      <span class="nds-assistive-text">
        Move Selection



        to First Category

      </span>
    </button>
  </div>
  <div class="nds-dueling-list__column">
    <span class="nds-form-element__label" id="label-12">Second Category</span>
    <div class="nds-dueling-list__options" role="application">
      <ul aria-describedby="option-drag-label" aria-labelledby="label-12" aria-multiselectable="true" class="nds-listbox nds-listbox_vertical" role="listbox">
        <li role="presentation" class="nds-listbox__item">
          <span class="nds-listbox__option nds-listbox__option_plain nds-media" aria-selected="false" draggable="true" role="option" tabindex="0">
            <span class="nds-truncate" title="Option 4">
              Option 4

            </span>
          </span>
        </li>
        <li role="presentation" class="nds-listbox__item">
          <span class="nds-listbox__option nds-listbox__option_plain nds-media" aria-selected="false" draggable="true" role="option" tabindex="-1">
            <span class="nds-truncate" title="Option 5">
              Option 5

            </span>
          </span>
        </li>
      </ul>
    </div>
  </div>
  <div class="nds-dueling-list__column">
    <button class="nds-button nds-button_icon nds-button_icon-container" title="Up">
      <svg class="nds-button__icon" aria-hidden="true">
        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#up"></use>
      </svg>
      <span class="nds-assistive-text">
        Move Selection



        Up

      </span>
    </button>
    <button class="nds-button nds-button_icon nds-button_icon-container" title="Down">
      <svg class="nds-button__icon" aria-hidden="true">
        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
      </svg>
      <span class="nds-assistive-text">
        Move Selection



        Down

      </span>
    </button>
  </div>
</div>`);
  })
  .add('Multi Select Moved In (states)', () => {
    return withExample(`<div class="nds-dueling-list">
  <div class="nds-assistive-text" id="drag-live-region" aria-live="assertive">Option 3: current position 2 of 4.</div>
  <div class="nds-assistive-text" id="option-drag-label"></div>
  <div class="nds-dueling-list__column">
    <span class="nds-form-element__label" id="label-13">First Category</span>
    <div class="nds-dueling-list__options" role="application">
      <ul aria-describedby="option-drag-label" aria-labelledby="label-13" aria-multiselectable="true" class="nds-listbox nds-listbox_vertical" role="listbox">
        <li role="presentation" class="nds-listbox__item">
          <span class="nds-listbox__option nds-listbox__option_plain nds-media" aria-selected="false" draggable="true" role="option" tabindex="-1">
            <span class="nds-truncate" title="Option 1">
              Option 1

            </span>
          </span>
        </li>
        <li role="presentation" class="nds-listbox__item">
          <span class="nds-listbox__option nds-listbox__option_plain nds-media nds-is-grabbed nds-is-selected" aria-selected="true" draggable="true" role="option" tabindex="0">
            <span class="nds-truncate" title="Option 3">
              Option 3

            </span>
          </span>
        </li>
        <li role="presentation" class="nds-listbox__item">
          <span class="nds-listbox__option nds-listbox__option_plain nds-media" aria-selected="false" draggable="true" role="option" tabindex="-1">
            <span class="nds-truncate" title="Option 2">
              Option 2

            </span>
          </span>
        </li>
        <li role="presentation" class="nds-listbox__item">
          <span class="nds-listbox__option nds-listbox__option_plain nds-media" aria-selected="false" draggable="true" role="option" tabindex="-1">
            <span class="nds-truncate" title="Option 6">
              Option 6

            </span>
          </span>
        </li>
      </ul>
    </div>
  </div>
  <div class="nds-dueling-list__column">
    <button class="nds-button nds-button_icon nds-button_icon-container" title="Up">
      <svg class="nds-button__icon" aria-hidden="true">
        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#right"></use>
      </svg>
      <span class="nds-assistive-text">
        Move Selection



        to Second Category

      </span>
    </button>
    <button class="nds-button nds-button_icon nds-button_icon-container" title="Down">
      <svg class="nds-button__icon" aria-hidden="true">
        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#left"></use>
      </svg>
      <span class="nds-assistive-text">
        Move Selection



        to First Category

      </span>
    </button>
  </div>
  <div class="nds-dueling-list__column">
    <span class="nds-form-element__label" id="label-14">Second Category</span>
    <div class="nds-dueling-list__options" role="application">
      <ul aria-describedby="option-drag-label" aria-labelledby="label-14" aria-multiselectable="true" class="nds-listbox nds-listbox_vertical" role="listbox">
        <li role="presentation" class="nds-listbox__item">
          <span class="nds-listbox__option nds-listbox__option_plain nds-media" aria-selected="false" draggable="true" role="option" tabindex="0">
            <span class="nds-truncate" title="Option 4">
              Option 4

            </span>
          </span>
        </li>
        <li role="presentation" class="nds-listbox__item">
          <span class="nds-listbox__option nds-listbox__option_plain nds-media" aria-selected="false" draggable="true" role="option" tabindex="-1">
            <span class="nds-truncate" title="Option 5">
              Option 5

            </span>
          </span>
        </li>
      </ul>
    </div>
  </div>
  <div class="nds-dueling-list__column">
    <button class="nds-button nds-button_icon nds-button_icon-container" title="Up">
      <svg class="nds-button__icon" aria-hidden="true">
        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#up"></use>
      </svg>
      <span class="nds-assistive-text">
        Move Selection



        Up

      </span>
    </button>
    <button class="nds-button nds-button_icon nds-button_icon-container" title="Down">
      <svg class="nds-button__icon" aria-hidden="true">
        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
      </svg>
      <span class="nds-assistive-text">
        Move Selection



        Down

      </span>
    </button>
  </div>
</div>`);
  })
  .add('Multi Select Dropped (states)', () => {
    return withExample(`<div class="nds-dueling-list">
  <div class="nds-assistive-text" id="drag-live-region" aria-live="assertive">Option 3: final position 2 of 4.</div>
  <div class="nds-assistive-text" id="option-drag-label">Press space bar when on an item, to move it within the list. CMD plus left and right arrow keys, to move items between lists.</div>
  <div class="nds-dueling-list__column">
    <span class="nds-form-element__label" id="label-15">First Category</span>
    <div class="nds-dueling-list__options" role="application">
      <ul aria-describedby="option-drag-label" aria-labelledby="label-15" aria-multiselectable="true" class="nds-listbox nds-listbox_vertical" role="listbox">
        <li role="presentation" class="nds-listbox__item">
          <span class="nds-listbox__option nds-listbox__option_plain nds-media" aria-selected="false" draggable="true" role="option" tabindex="-1">
            <span class="nds-truncate" title="Option 1">
              Option 1

            </span>
          </span>
        </li>
        <li role="presentation" class="nds-listbox__item">
          <span class="nds-listbox__option nds-listbox__option_plain nds-media nds-is-selected" aria-selected="true" draggable="true" role="option" tabindex="0">
            <span class="nds-truncate" title="Option 3">
              Option 3

            </span>
          </span>
        </li>
        <li role="presentation" class="nds-listbox__item">
          <span class="nds-listbox__option nds-listbox__option_plain nds-media" aria-selected="false" draggable="true" role="option" tabindex="-1">
            <span class="nds-truncate" title="Option 2">
              Option 2

            </span>
          </span>
        </li>
        <li role="presentation" class="nds-listbox__item">
          <span class="nds-listbox__option nds-listbox__option_plain nds-media" aria-selected="false" draggable="true" role="option" tabindex="-1">
            <span class="nds-truncate" title="Option 6">
              Option 6

            </span>
          </span>
        </li>
      </ul>
    </div>
  </div>
  <div class="nds-dueling-list__column">
    <button class="nds-button nds-button_icon nds-button_icon-container" title="Up">
      <svg class="nds-button__icon" aria-hidden="true">
        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#right"></use>
      </svg>
      <span class="nds-assistive-text">
        Move Selection



        to Second Category

      </span>
    </button>
    <button class="nds-button nds-button_icon nds-button_icon-container" title="Down">
      <svg class="nds-button__icon" aria-hidden="true">
        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#left"></use>
      </svg>
      <span class="nds-assistive-text">
        Move Selection



        to First Category

      </span>
    </button>
  </div>
  <div class="nds-dueling-list__column">
    <span class="nds-form-element__label" id="label-16">Second Category</span>
    <div class="nds-dueling-list__options" role="application">
      <ul aria-describedby="option-drag-label" aria-labelledby="label-16" aria-multiselectable="true" class="nds-listbox nds-listbox_vertical" role="listbox">
        <li role="presentation" class="nds-listbox__item">
          <span class="nds-listbox__option nds-listbox__option_plain nds-media" aria-selected="false" draggable="true" role="option" tabindex="0">
            <span class="nds-truncate" title="Option 4">
              Option 4

            </span>
          </span>
        </li>
        <li role="presentation" class="nds-listbox__item">
          <span class="nds-listbox__option nds-listbox__option_plain nds-media" aria-selected="false" draggable="true" role="option" tabindex="-1">
            <span class="nds-truncate" title="Option 5">
              Option 5

            </span>
          </span>
        </li>
      </ul>
    </div>
  </div>
  <div class="nds-dueling-list__column">
    <button class="nds-button nds-button_icon nds-button_icon-container" title="Up">
      <svg class="nds-button__icon" aria-hidden="true">
        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#up"></use>
      </svg>
      <span class="nds-assistive-text">
        Move Selection



        Up

      </span>
    </button>
    <button class="nds-button nds-button_icon nds-button_icon-container" title="Down">
      <svg class="nds-button__icon" aria-hidden="true">
        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
      </svg>
      <span class="nds-assistive-text">
        Move Selection



        Down

      </span>
    </button>
  </div>
</div>`);
  })
  .add('Multi Select Moved To (states)', () => {
    return withExample(`<div class="nds-dueling-list">
  <div class="nds-assistive-text" id="drag-live-region" aria-live="assertive">Option 3: Moved to Second Category.</div>
  <div class="nds-assistive-text" id="option-drag-label">Press space bar when on an item, to move it within the list. CMD plus left and right arrow keys, to move items between lists.</div>
  <div class="nds-dueling-list__column">
    <span class="nds-form-element__label" id="label-17">First Category</span>
    <div class="nds-dueling-list__options" role="application">
      <ul aria-describedby="option-drag-label" aria-labelledby="label-17" aria-multiselectable="true" class="nds-listbox nds-listbox_vertical" role="listbox">
        <li role="presentation" class="nds-listbox__item">
          <span class="nds-listbox__option nds-listbox__option_plain nds-media" aria-selected="false" draggable="true" role="option" tabindex="-1">
            <span class="nds-truncate" title="Option 1">
              Option 1

            </span>
          </span>
        </li>
        <li role="presentation" class="nds-listbox__item">
          <span class="nds-listbox__option nds-listbox__option_plain nds-media" aria-selected="false" draggable="true" role="option" tabindex="-1">
            <span class="nds-truncate" title="Option 2">
              Option 2

            </span>
          </span>
        </li>
        <li role="presentation" class="nds-listbox__item">
          <span class="nds-listbox__option nds-listbox__option_plain nds-media" aria-selected="false" draggable="true" role="option" tabindex="-1">
            <span class="nds-truncate" title="Option 6">
              Option 6

            </span>
          </span>
        </li>
      </ul>
    </div>
  </div>
  <div class="nds-dueling-list__column">
    <button class="nds-button nds-button_icon nds-button_icon-container" title="Up">
      <svg class="nds-button__icon" aria-hidden="true">
        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#right"></use>
      </svg>
      <span class="nds-assistive-text">
        Move Selection



        to Second Category

      </span>
    </button>
    <button class="nds-button nds-button_icon nds-button_icon-container" title="Down">
      <svg class="nds-button__icon" aria-hidden="true">
        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#left"></use>
      </svg>
      <span class="nds-assistive-text">
        Move Selection



        to First Category

      </span>
    </button>
  </div>
  <div class="nds-dueling-list__column">
    <span class="nds-form-element__label" id="label-18">Second Category</span>
    <div class="nds-dueling-list__options" role="application">
      <ul aria-describedby="option-drag-label" aria-labelledby="label-18" aria-multiselectable="true" class="nds-listbox nds-listbox_vertical" role="listbox">
        <li role="presentation" class="nds-listbox__item">
          <span class="nds-listbox__option nds-listbox__option_plain nds-media" aria-selected="false" draggable="true" role="option" tabindex="0">
            <span class="nds-truncate" title="Option 4">
              Option 4

            </span>
          </span>
        </li>
        <li role="presentation" class="nds-listbox__item">
          <span class="nds-listbox__option nds-listbox__option_plain nds-media" aria-selected="false" draggable="true" role="option" tabindex="-1">
            <span class="nds-truncate" title="Option 5">
              Option 5

            </span>
          </span>
        </li>
        <li role="presentation" class="nds-listbox__item">
          <span class="nds-listbox__option nds-listbox__option_plain nds-media nds-is-selected" aria-selected="true" draggable="true" role="option" tabindex="0">
            <span class="nds-truncate" title="Option 3">
              Option 3

            </span>
          </span>
        </li>
      </ul>
    </div>
  </div>
  <div class="nds-dueling-list__column">
    <button class="nds-button nds-button_icon nds-button_icon-container" title="Up">
      <svg class="nds-button__icon" aria-hidden="true">
        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#up"></use>
      </svg>
      <span class="nds-assistive-text">
        Move Selection



        Up

      </span>
    </button>
    <button class="nds-button nds-button_icon nds-button_icon-container" title="Down">
      <svg class="nds-button__icon" aria-hidden="true">
        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
      </svg>
      <span class="nds-assistive-text">
        Move Selection



        Down

      </span>
    </button>
  </div>
</div>`);
  });
