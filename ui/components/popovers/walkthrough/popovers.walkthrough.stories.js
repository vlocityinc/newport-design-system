import { storiesOf } from '@storybook/html';
import { withKnobs, radios } from '@storybook/addon-knobs';
import base from 'paths.macro';
import notes from '../doc.md';
import scss from './_index.scss';
import {
  withExample,
  withDocs,
  commentToHTML
} from '../../../../scripts/storybook';

const nubbinsLabel = 'Nubbin';
const verticalVariations = ['top', 'bottom'];
const horizVariations = ['left', 'right'];

function generateOptions(array1, array2, obj) {
  return array1.reduce((obj, variation) => {
    obj[variation] = ` nds-nubbin_${variation}`;
    array2.forEach(subvar => {
      obj[variation + ' ' + subvar] = ` nds-nubbin_${variation}-${subvar}`;
    });
    return obj;
  }, obj);
}

const nubbinsOptions = generateOptions(
  horizVariations,
  verticalVariations,
  generateOptions(verticalVariations, horizVariations, {
    None: ''
  })
);
const nubbinsDefaultValue = ' nds-nubbin_left';

storiesOf(`${base}`, module)
  .addDecorator(withKnobs)
  .addDecorator(withDocs(notes))
  .addDecorator(commentToHTML(scss))
  .add('Default (default)', () => {
    const nubbin = radios(nubbinsLabel, nubbinsOptions, nubbinsDefaultValue);
    return withExample(`<section class="nds-popover nds-popover_walkthrough${nubbin}" role="dialog" aria-labelledby="dialog-heading-id-01" aria-describedby="dialog-body-id-22">
  <button class="nds-button nds-button_icon nds-button_icon-small nds-float_right nds-popover__close nds-button_icon-inverse" title="Close dialog">
    <svg class="nds-button__icon" aria-hidden="true">
      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
    </svg>
    <span class="nds-assistive-text">Close dialog</span>
  </button>
  <header class="nds-popover__header nds-p-vertical_medium">
    <h2 id="dialog-heading-id-01" class="nds-text-heading_medium">Manage your channels</h2>
  </header>
  <div class="nds-popover__body" id="dialog-body-id-22">
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
  </div>
  <footer class="nds-popover__footer">
    <div class="nds-grid nds-grid_vertical-align-center">
      <span class="nds-text-title">Step 2 of 4</span>
      <button class="nds-button nds-button_brand nds-col_bump-left">Next</button>
    </div>
  </footer>
</section>`);
  })
  .add('Micro Setup (examples)', () => {
    const nubbin = radios(nubbinsLabel, nubbinsOptions, nubbinsDefaultValue);
    return withExample(`<section class="nds-popover nds-popover_walkthrough${nubbin}" role="dialog" aria-labelledby="dialog-heading-id-01" aria-describedby="dialog-body-id-23">
  <button class="nds-button nds-button_icon nds-button_icon-small nds-float_right nds-popover__close nds-button_icon-inverse" title="Close dialog">
    <svg class="nds-button__icon" aria-hidden="true">
      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
    </svg>
    <span class="nds-assistive-text">Close dialog</span>
  </button>
  <header class="nds-popover__header nds-p-vertical_medium">
    <h2 id="dialog-heading-id-01" class="nds-text-heading_medium">Manage your channels</h2>
  </header>
  <div class="nds-popover__body" id="dialog-body-id-23">
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
  </div>
  <footer class="nds-popover__footer">
    <div class="nds-grid nds-grid_vertical-align-center">
      <span class="nds-text-title">Step 2 of 4</span>
      <button class="nds-button nds-button_success nds-col_bump-left">Setup Email</button>
      <button class="nds-button nds-button_brand nds-col_bump-left">Next</button>
    </div>
  </footer>
</section>`);
  })
  .add('Micro Setup Alternate (examples)', () => {
    const nubbin = radios(nubbinsLabel, nubbinsOptions, nubbinsDefaultValue);
    return withExample(`<section class="nds-popover nds-popover_walkthrough${nubbin}"" role="dialog" aria-labelledby="dialog-heading-id-01" aria-describedby="dialog-body-id-24">
  <button class="nds-button nds-button_icon nds-button_icon-small nds-float_right nds-popover__close nds-button_icon-inverse" title="Close dialog">
    <svg class="nds-button__icon" aria-hidden="true">
      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
    </svg>
    <span class="nds-assistive-text">Close dialog</span>
  </button>
  <header class="nds-popover__header nds-p-vertical_medium">
    <h2 id="dialog-heading-id-01" class="nds-text-heading_medium">Manage your channels</h2>
  </header>
  <div class="nds-popover__body" id="dialog-body-id-24">
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
  </div>
  <footer class="nds-popover__footer">
    <div class="nds-grid nds-grid_vertical-align-center">
      <span class="nds-text-title">Step 2 of 4</span>
      <button class="nds-button nds-button_brand nds-col_bump-left">Skip</button>
      <button class="nds-button nds-button_success nds-col_bump-left">Setup Email</button>
    </div>
  </footer>
</section>`);
  })
  .add('Micro Setup In Page (examples)', () => {
    const nubbin = radios(nubbinsLabel, nubbinsOptions, nubbinsDefaultValue);
    return withExample(`<section class="nds-popover nds-popover_walkthrough${nubbin}" role="dialog" aria-labelledby="dialog-heading-id-01" aria-describedby="dialog-body-id-25">
  <button class="nds-button nds-button_icon nds-button_icon-small nds-float_right nds-popover__close nds-button_icon-inverse" title="Close dialog">
    <svg class="nds-button__icon" aria-hidden="true">
      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
    </svg>
    <span class="nds-assistive-text">Close dialog</span>
  </button>
  <header class="nds-popover__header nds-p-vertical_medium">
    <h2 id="dialog-heading-id-01" class="nds-text-heading_medium">Manage your channels</h2>
  </header>
  <div class="nds-popover__body" id="dialog-body-id-25">
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
  </div>
  <footer class="nds-popover__footer">
    <div class="nds-grid nds-grid_vertical-align-center">
      <span class="nds-text-title">Step 2 of 4</span>
      <button class="nds-button nds-button_brand nds-col_bump-left">Skip</button>
    </div>
  </footer>
</section>`);
  })
  .add('Micro Setup Inline Form (examples)', () => {
    const nubbin = radios(nubbinsLabel, nubbinsOptions, nubbinsDefaultValue);
    return withExample(`<section class="nds-popover nds-popover_walkthrough${nubbin}" role="dialog" aria-labelledby="dialog-heading-id-01" aria-describedby="dialog-body-id-26">
  <button class="nds-button nds-button_icon nds-button_icon-small nds-float_right nds-popover__close nds-button_icon-inverse" title="Close dialog">
    <svg class="nds-button__icon" aria-hidden="true">
      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
    </svg>
    <span class="nds-assistive-text">Close dialog</span>
  </button>
  <header class="nds-popover__header nds-p-vertical_medium">
    <h2 id="dialog-heading-id-01" class="nds-text-heading_medium">Manage your channels</h2>
  </header>
  <div class="nds-popover__body" id="dialog-body-id-26">
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
    <div class="nds-form-element nds-p-top_small">
      <label class="nds-form-element__label nds-assistive-text" for="email-text-input-01">Email Address</label>
      <div class="nds-form-element__control">
        <input type="text" id="email-text-input-01" class="nds-input" placeholder="Email Address">
      </div>
    </div>
  </div>
  <footer class="nds-popover__footer">
    <div class="nds-grid nds-grid_vertical-align-center">
      <span class="nds-text-title">Step 2 of 4</span>
      <button class="nds-button nds-button_brand nds-col_bump-left">Skip</button>
      <button class="nds-button nds-button_brand nds-col_bump-left">Next</button>
    </div>
  </footer>
</section>`);
  })
  .add('Action Popover (examples)', () => {
    const nubbin = radios(nubbinsLabel, nubbinsOptions, nubbinsDefaultValue);
    return withExample(`<section class="nds-popover nds-popover_walkthrough nds-popover_walkthrough-alt${nubbin}" role="dialog" aria-label="Action dialog" aria-describedby="dialog-body-id-28">
  <button class="nds-button nds-button_icon nds-button_icon-small nds-float_right nds-popover__close nds-button_icon-inverse" title="Close dialog">
    <svg class="nds-button__icon" aria-hidden="true">
      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
    </svg>
    <span class="nds-assistive-text">Close dialog</span>
  </button>
  <div class="nds-popover__body" id="dialog-body-id-28">
    <div class="nds-media nds-media_center">
      <div class="nds-media__figure">
        <span class="nds-icon_container" title="description of icon when needed">
          <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#touch_action"></use>
          </svg>
          <span class="nds-assistive-text">Description of icon</span>
        </span>
      </div>
      <div class="nds-media__body">
        <p>Text that describes the action</p>
      </div>
    </div>
  </div>
</section>`);
  })
  .add('Action Popover Heading (examples)', () => {
    const nubbin = radios(nubbinsLabel, nubbinsOptions, nubbinsDefaultValue);
    return withExample(`<section class="nds-popover nds-popover_walkthrough nds-popover_walkthrough-alt${nubbin}" role="dialog" aria-labelledby="dialog-heading-id-01" aria-describedby="dialog-body-id-27">
  <button class="nds-button nds-button_icon nds-button_icon-small nds-float_right nds-popover__close nds-button_icon-inverse" title="Close dialog">
    <svg class="nds-button__icon" aria-hidden="true">
      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
    </svg>
    <span class="nds-assistive-text">Close dialog</span>
  </button>
  <div class="nds-popover__body" id="dialog-body-id-27">
    <div class="nds-media">
      <div class="nds-media__figure">
        <span class="nds-icon_container" title="description of icon when needed">
          <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#touch_action"></use>
          </svg>
          <span class="nds-assistive-text">Description of icon</span>
        </span>
      </div>
      <div class="nds-media__body">
        <h2 id="dialog-heading-id-01" class="nds-text-heading_small">Title</h2>
        <p>Text that describes the action</p>
      </div>
    </div>
  </div>
</section>`);
  });
