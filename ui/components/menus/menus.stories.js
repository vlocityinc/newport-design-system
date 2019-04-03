import { storiesOf } from '@storybook/html';
import { withKnobs, radios } from '@storybook/addon-knobs';
import base from 'paths.macro';
import notes from './doc.md';
import scss from './dropdown/_index.scss';
import {
  withExample,
  withDocs,
  commentToHTML
} from '../../../scripts/storybook';

const widthLabel = 'Width';
const widthOptions = {
  None: '',
  XXSmall: ' nds-dropdown_xx-small',
  XSmall: ' nds-dropdown_x-small',
  Small: ' nds-dropdown_small',
  Medium: ' nds-dropdown_medium',
  Large: ' nds-dropdown_large'
};
const widthDefaultValue = '';
const heightLabel = 'Height';
const heightOptions = {
  None: '',
  Length5: ' nds-dropdown_length-5',
  Length7: ' nds-dropdown_length-7',
  Length10: ' nds-dropdown_length-10',
  LengthWithIcon5: ' nds-dropdown_length-with-icon-5',
  LengthWithIcon7: ' nds-dropdown_length-with-icon-7',
  LengthWithIcon10: ' nds-dropdown_length-with-icon-10'
};
const heightDefaultValue = '';
const positionLabel = 'Position';
const positionOptions = {
  Left: ' nds-dropdown_left',
  Right: ' nds-dropdown_right',
  Bottom: ' nds-dropdown_down'
};
const positionDefaultValue = ' nds-dropdown_left';
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
const nubbinsDefaultValue = '';

storiesOf(`${base}`, module)
  .addDecorator(withKnobs)
  .addDecorator(withDocs(notes))
  .addDecorator(commentToHTML(scss))
  .add('Default (default)', () => {
    const height = radios(heightLabel, heightOptions, heightDefaultValue);
    const width = radios(widthLabel, widthOptions, widthDefaultValue);
    const position = radios(
      positionLabel,
      positionOptions,
      positionDefaultValue
    );
    const nubbin = radios(nubbinsLabel, nubbinsOptions, nubbinsDefaultValue);
    return withExample(`<div style="height: 260px;">
  <div class="nds-dropdown-trigger nds-dropdown-trigger_click nds-is-open">
    <button class="nds-button nds-button_icon nds-button_icon-border-filled" aria-haspopup="true" title="Show More">
      <svg class="nds-button__icon" aria-hidden="true">
        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
      </svg>
      <span class="nds-assistive-text">Show More</span>
    </button>
    <div class="nds-dropdown${width}${height}${position}${nubbin}">
      <ul class="nds-dropdown__list" role="menu">
        <li class="nds-dropdown__item" role="presentation">
          <a href="javascript:void(0);" role="menuitem" tabindex="0">
            <span class="nds-truncate" title="Menu Item One">
              Menu Item One

            </span>
          </a>
        </li>
        <li class="nds-dropdown__item" role="presentation">
          <a href="javascript:void(0);" role="menuitem" tabindex="-1">
            <span class="nds-truncate" title="Menu Item Two">
              Menu Item Two

            </span>
          </a>
        </li>
        <li class="nds-dropdown__item" role="presentation">
          <a href="javascript:void(0);" role="menuitem" tabindex="-1">
            <span class="nds-truncate" title="Menu Item Three">
              Menu Item Three

            </span>
          </a>
        </li>
        <li class="nds-has-divider_top-space" role="separator"></li>
        <li class="nds-dropdown__item" role="presentation">
          <a href="javascript:void(0);" role="menuitem" tabindex="-1">
            <span class="nds-truncate" title="Menu Item Four">
              Menu Item Four

            </span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</div>`);
  })
  .add('Dropdown Menu Header (examples)', () => {
    const height = radios(heightLabel, heightOptions, heightDefaultValue);
    const width = radios(widthLabel, widthOptions, widthDefaultValue);
    const position = radios(
      positionLabel,
      positionOptions,
      positionDefaultValue
    );
    const nubbin = radios(nubbinsLabel, nubbinsOptions, nubbinsDefaultValue);
    return withExample(`<div style="height: 260px;">
  <div class="demo-only" style="height: 260px;">
    <div class="nds-dropdown-trigger nds-dropdown-trigger_click nds-is-open">
      <button class="nds-button nds-button_icon nds-button_icon-border-filled" aria-haspopup="true" title="Show More">
        <svg class="nds-button__icon" aria-hidden="true">
          <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
        </svg>
        <span class="nds-assistive-text">Show More</span>
      </button>
      <div class="nds-dropdown${width}${height}${position}${nubbin} nds-dropdown_small">
        <ul class="nds-dropdown__list" role="menu">
          <li class="nds-dropdown__header nds-truncate" title="Menu Sub Heading" role="separator">
            <span class="nds-text-title_caps">Menu Sub Heading</span>
          </li>
          <li class="nds-dropdown__item" role="presentation">
            <a href="javascript:void(0);" role="menuitem" tabindex="0">
              <span class="nds-truncate" title="Menu Item One">
                Menu Item One

              </span>
            </a>
          </li>
          <li class="nds-dropdown__item" role="presentation">
            <a href="javascript:void(0);" role="menuitem" tabindex="-1">
              <span class="nds-truncate" title="Menu Item Two">
                Menu Item Two

              </span>
            </a>
          </li>
          <li class="nds-dropdown__header nds-truncate" title="Menu Sub Heading" role="separator">
            <span class="nds-text-title_caps">Menu Sub Heading</span>
          </li>
          <li class="nds-dropdown__item" role="presentation">
            <a href="javascript:void(0);" role="menuitem" tabindex="-1">
              <span class="nds-truncate" title="Menu Item One">
                Menu Item One

              </span>
            </a>
          </li>
          <li class="nds-dropdown__item" role="presentation">
            <a href="javascript:void(0);" role="menuitem" tabindex="-1">
              <span class="nds-truncate" title="Menu Item Two">
                Menu Item Two

              </span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>`);
  })
  .add('Dropdown Menu Icon Left (examples)', () => {
    const height = radios(heightLabel, heightOptions, heightDefaultValue);
    const width = radios(widthLabel, widthOptions, widthDefaultValue);
    const position = radios(
      positionLabel,
      positionOptions,
      positionDefaultValue
    );
    const nubbin = radios(nubbinsLabel, nubbinsOptions, nubbinsDefaultValue);
    return withExample(`<div style="height: 260px;">
  <div class="demo-only" style="height: 170px;">
    <div class="nds-dropdown-trigger nds-dropdown-trigger_click nds-is-open">
      <button class="nds-button nds-button_icon nds-button_icon-border-filled" aria-haspopup="true" title="Show More">
        <svg class="nds-button__icon" aria-hidden="true">
          <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
        </svg>
        <span class="nds-assistive-text">Show More</span>
      </button>
      <div class="nds-dropdown${width}${height}${position}${nubbin} nds-dropdown_small">
        <ul class="nds-dropdown__list" role="menu">
          <li class="nds-dropdown__item nds-is-selected" role="presentation">
            <a href="javascript:void(0);" role="menuitemcheckbox" aria-checked="true" tabindex="0">
              <span class="nds-truncate" title="Menu Item One">
                <svg class="nds-icon nds-icon_selected nds-icon_x-small nds-icon-text-default nds-m-right_x-small" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                </svg>
                Menu Item One

              </span>
            </a>
          </li>
          <li class="nds-dropdown__item" role="presentation">
            <a href="javascript:void(0);" role="menuitemcheckbox" aria-checked="false" tabindex="-1">
              <span class="nds-truncate" title="Menu Item Two">
                <svg class="nds-icon nds-icon_selected nds-icon_x-small nds-icon-text-default nds-m-right_x-small" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                </svg>
                Menu Item Two

              </span>
            </a>
          </li>
          <li class="nds-dropdown__item" role="presentation">
            <a href="javascript:void(0);" role="menuitemcheckbox" aria-checked="false" tabindex="-1">
              <span class="nds-truncate" title="Menu Item Three">
                <svg class="nds-icon nds-icon_selected nds-icon_x-small nds-icon-text-default nds-m-right_x-small" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                </svg>
                Menu Item Three

              </span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>`);
  })
  .add('Dropdown Menu Icon Double (examples)', () => {
    const height = radios(heightLabel, heightOptions, heightDefaultValue);
    const width = radios(widthLabel, widthOptions, widthDefaultValue);
    const position = radios(
      positionLabel,
      positionOptions,
      positionDefaultValue
    );
    const nubbin = radios(nubbinsLabel, nubbinsOptions, nubbinsDefaultValue);
    return withExample(`<div style="height: 260px;">
  <div class="demo-only" style="height: 170px;">
    <div class="nds-dropdown-trigger nds-dropdown-trigger_click nds-is-open">
      <button class="nds-button nds-button_icon nds-button_icon-border-filled" aria-haspopup="true" title="Show More">
        <svg class="nds-button__icon" aria-hidden="true">
          <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
        </svg>
        <span class="nds-assistive-text">Show More</span>
      </button>
      <div class="nds-dropdown${width}${height}${position}${nubbin} nds-dropdown_small">
        <ul class="nds-dropdown__list" role="menu">
          <li class="nds-dropdown__item nds-is-selected" role="presentation">
            <a href="javascript:void(0);" role="menuitemcheckbox" aria-checked="true" tabindex="0">
              <span class="nds-truncate" title="Table View">
                <svg class="nds-icon nds-icon_selected nds-icon_x-small nds-icon-text-default nds-m-right_x-small" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                </svg>
                Table View

              </span>
              <svg class="nds-icon nds-icon_x-small nds-icon-text-default nds-m-left_small nds-shrink-none" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#table"></use>
              </svg>
            </a>
          </li>
          <li class="nds-dropdown__item" role="presentation">
            <a href="javascript:void(0);" role="menuitemcheckbox" aria-checked="false" tabindex="-1">
              <span class="nds-truncate" title="Kanban Board">
                <svg class="nds-icon nds-icon_selected nds-icon_x-small nds-icon-text-default nds-m-right_x-small" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                </svg>
                Kanban Board

              </span>
              <svg class="nds-icon nds-icon_x-small nds-icon-text-default nds-m-left_small nds-shrink-none" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#kanban"></use>
              </svg>
            </a>
          </li>
          <li class="nds-dropdown__item" role="presentation">
            <a href="javascript:void(0);" role="menuitemcheckbox" aria-checked="false" tabindex="-1">
              <span class="nds-truncate" title="List View">
                <svg class="nds-icon nds-icon_selected nds-icon_x-small nds-icon-text-default nds-m-right_x-small" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                </svg>
                List View

              </span>
              <svg class="nds-icon nds-icon_x-small nds-icon-text-default nds-m-left_small nds-shrink-none" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#side_list"></use>
              </svg>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>`);
  })
  .add('Dropdown Menu Icon Right (examples)', () => {
    const height = radios(heightLabel, heightOptions, heightDefaultValue);
    const width = radios(widthLabel, widthOptions, widthDefaultValue);
    const position = radios(
      positionLabel,
      positionOptions,
      positionDefaultValue
    );
    const nubbin = radios(nubbinsLabel, nubbinsOptions, nubbinsDefaultValue);
    return withExample(`<div style="height: 260px;">
  <div class="demo-only" style="height: 170px;">
    <div class="nds-dropdown-trigger nds-dropdown-trigger_click nds-is-open">
      <button class="nds-button nds-button_icon nds-button_icon-border-filled" aria-haspopup="true" title="Show More">
        <svg class="nds-button__icon" aria-hidden="true">
          <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
        </svg>
        <span class="nds-assistive-text">Show More</span>
      </button>
      <div class="nds-dropdown${width}${height}${position}${nubbin} nds-dropdown_small">
        <ul class="nds-dropdown__list" role="menu">
          <li class="nds-dropdown__item" role="presentation">
            <a href="javascript:void(0);" role="menuitem" tabindex="0">
              <span class="nds-truncate" title="Table View">
                Table View

              </span>
              <svg class="nds-icon nds-icon_x-small nds-icon-text-default nds-m-left_small nds-shrink-none" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#table"></use>
              </svg>
            </a>
          </li>
          <li class="nds-dropdown__item" role="presentation">
            <a href="javascript:void(0);" role="menuitem" tabindex="-1">
              <span class="nds-truncate" title="Kanban Board">
                Kanban Board

              </span>
              <svg class="nds-icon nds-icon_x-small nds-icon-text-default nds-m-left_small nds-shrink-none" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#kanban"></use>
              </svg>
            </a>
          </li>
          <li class="nds-dropdown__item" role="presentation">
            <a href="javascript:void(0);" role="menuitem" tabindex="-1">
              <span class="nds-truncate" title="List View">
                List View

              </span>
              <svg class="nds-icon nds-icon_x-small nds-icon-text-default nds-m-left_small nds-shrink-none" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#side_list"></use>
              </svg>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>`);
  })
  .add('Action Overflow (examples)', () => {
    const height = radios(heightLabel, heightOptions, heightDefaultValue);
    const width = radios(widthLabel, widthOptions, widthDefaultValue);
    const position = radios(
      positionLabel,
      positionOptions,
      positionDefaultValue
    );
    const nubbin = radios(nubbinsLabel, nubbinsOptions, nubbinsDefaultValue);
    return withExample(`<div style="height: 260px;">
  <div class="nds-dropdown-trigger nds-dropdown-trigger_click nds-is-open">
    <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" aria-haspopup="true" title="Show More">
      <svg class="nds-button__icon" aria-hidden="true">
        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
      </svg>
      <span class="nds-assistive-text">Show More</span>
    </button>
    <div class="nds-dropdown${width}${height}${position}${nubbin} nds-dropdown_actions">
      <ul class="nds-dropdown__list" role="menu">
        <li class="nds-dropdown__item" role="presentation">
          <a href="javascript:void(0);" role="menuitem" tabindex="0">
            <span class="nds-truncate" title="Action One">
              Action One

            </span>
          </a>
        </li>
        <li class="nds-dropdown__item" role="presentation">
          <a href="javascript:void(0);" role="menuitem" tabindex="-1">
            <span class="nds-truncate" title="Action Two">
              Action Two

            </span>
          </a>
        </li>
        <li class="nds-dropdown__item" role="presentation">
          <a href="javascript:void(0);" role="menuitem" tabindex="-1">
            <span class="nds-truncate" title="Action Three">
              Action Three

            </span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</div>`);
  });
