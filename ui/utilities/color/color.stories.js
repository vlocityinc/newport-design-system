import { storiesOf } from '@storybook/html';
import base from 'paths.macro';
import notes from './doc.md';
import scss from './_index.scss';
import {
  withExample,
  withDocs,
  commentToHTML
} from '../../../scripts/storybook';

storiesOf(`${base}`.replace(/(^\/)|(\/$)/g, ''),  module)
  .addDecorator(withDocs(notes))
  .addDecorator(commentToHTML(scss))
  .add('Color Grays (examples)', () => {
    return withExample(`<div>
  <h2 class="nds-text-heading_large nds-m-bottom_medium">Background Colors</h2>
  <div class="nds-m-bottom_large">
    <div class="nds-color__background_gray-1 nds-p-around_medium">
      <p>
        .nds-color__background_gray-

        1

      </p>
    </div>
    <div class="nds-color__background_gray-2 nds-p-around_medium">
      <p>
        .nds-color__background_gray-

        2

      </p>
    </div>
    <div class="nds-color__background_gray-3 nds-p-around_medium">
      <p>
        .nds-color__background_gray-

        3

      </p>
    </div>
    <div class="nds-color__background_gray-4 nds-p-around_medium">
      <p>
        .nds-color__background_gray-

        4

      </p>
    </div>
    <div class="nds-color__background_gray-5 nds-p-around_medium">
      <p>
        .nds-color__background_gray-

        5

      </p>
    </div>
    <div class="nds-color__background_gray-6 nds-p-around_medium">
      <p>
        .nds-color__background_gray-

        6

      </p>
    </div>
    <div class="nds-color__background_gray-7 nds-p-around_medium">
      <p>
        .nds-color__background_gray-

        7

      </p>
    </div>
    <div class="nds-color__background_gray-8 nds-p-around_medium">
      <p>
        .nds-color__background_gray-

        8

      </p>
    </div>
    <div class="nds-color__background_gray-9 nds-p-around_medium">
      <p class="nds-color__text_gray-1">
        .nds-color__background_gray-

        9

      </p>
    </div>
    <div class="nds-color__background_gray-10 nds-p-around_medium">
      <p class="nds-color__text_gray-1">
        .nds-color__background_gray-

        10

      </p>
    </div>
    <div class="nds-color__background_gray-11 nds-p-around_medium">
      <p class="nds-color__text_gray-1">
        .nds-color__background_gray-

        11

      </p>
    </div>
    <div class="nds-color__background_gray-12 nds-p-around_medium">
      <p class="nds-color__text_gray-1">
        .nds-color__background_gray-

        12

      </p>
    </div>
  </div>
  <h2 class="nds-text-heading_large nds-m-bottom_medium">Text Colors</h2>
  <div class="nds-m-bottom_large">
    <div class="nds-grid nds-grid_vertical-align-center">
      <div class="nds-color__background_gray-1" style="height: 3rem; width: 3rem; display: inline-block;"></div>
      <p class="nds-color__text_gray-1 nds-p-left_small">
        .nds-color__text_gray-

        1

      </p>
    </div>
    <div class="nds-grid nds-grid_vertical-align-center">
      <div class="nds-color__background_gray-2" style="height: 3rem; width: 3rem; display: inline-block;"></div>
      <p class="nds-color__text_gray-2 nds-p-left_small">
        .nds-color__text_gray-

        2

      </p>
    </div>
    <div class="nds-grid nds-grid_vertical-align-center">
      <div class="nds-color__background_gray-3" style="height: 3rem; width: 3rem; display: inline-block;"></div>
      <p class="nds-color__text_gray-3 nds-p-left_small">
        .nds-color__text_gray-

        3

      </p>
    </div>
    <div class="nds-grid nds-grid_vertical-align-center">
      <div class="nds-color__background_gray-4" style="height: 3rem; width: 3rem; display: inline-block;"></div>
      <p class="nds-color__text_gray-4 nds-p-left_small">
        .nds-color__text_gray-

        4

      </p>
    </div>
    <div class="nds-grid nds-grid_vertical-align-center">
      <div class="nds-color__background_gray-5" style="height: 3rem; width: 3rem; display: inline-block;"></div>
      <p class="nds-color__text_gray-5 nds-p-left_small">
        .nds-color__text_gray-

        5

      </p>
    </div>
    <div class="nds-grid nds-grid_vertical-align-center">
      <div class="nds-color__background_gray-6" style="height: 3rem; width: 3rem; display: inline-block;"></div>
      <p class="nds-color__text_gray-6 nds-p-left_small">
        .nds-color__text_gray-

        6

      </p>
    </div>
    <div class="nds-grid nds-grid_vertical-align-center">
      <div class="nds-color__background_gray-7" style="height: 3rem; width: 3rem; display: inline-block;"></div>
      <p class="nds-color__text_gray-7 nds-p-left_small">
        .nds-color__text_gray-

        7

      </p>
    </div>
    <div class="nds-grid nds-grid_vertical-align-center">
      <div class="nds-color__background_gray-8" style="height: 3rem; width: 3rem; display: inline-block;"></div>
      <p class="nds-color__text_gray-8 nds-p-left_small">
        .nds-color__text_gray-

        8

      </p>
    </div>
    <div class="nds-grid nds-grid_vertical-align-center">
      <div class="nds-color__background_gray-9" style="height: 3rem; width: 3rem; display: inline-block;"></div>
      <p class="nds-color__text_gray-9 nds-p-left_small">
        .nds-color__text_gray-

        9

      </p>
    </div>
    <div class="nds-grid nds-grid_vertical-align-center">
      <div class="nds-color__background_gray-10" style="height: 3rem; width: 3rem; display: inline-block;"></div>
      <p class="nds-color__text_gray-10 nds-p-left_small">
        .nds-color__text_gray-

        10

      </p>
    </div>
    <div class="nds-grid nds-grid_vertical-align-center">
      <div class="nds-color__background_gray-11" style="height: 3rem; width: 3rem; display: inline-block;"></div>
      <p class="nds-color__text_gray-11 nds-p-left_small">
        .nds-color__text_gray-

        11

      </p>
    </div>
    <div class="nds-grid nds-grid_vertical-align-center">
      <div class="nds-color__background_gray-12" style="height: 3rem; width: 3rem; display: inline-block;"></div>
      <p class="nds-color__text_gray-12 nds-p-left_small">
        .nds-color__text_gray-

        12

      </p>
    </div>
    <div class="nds-grid nds-grid_vertical-align-center">
      <div class="nds-color-text-secondary" style="height: 3rem; width: 3rem; display: inline-block;"></div>
      <p class="nds-color-text-secondary nds-p-left_small">.nds-color-text-secondary</p>
    </div>
  </div>
  <h2 class="nds-text-heading_large nds-m-bottom_medium">Border Colors</h2>
  <div class="nds-m-bottom_large">
    <div class="nds-color__border_gray-1 nds-p-around_medium nds-m-bottom_small" style="border-width: 1px; border-style: solid;">
      .nds-color__border_gray-

      1

    </div>
    <div class="nds-color__border_gray-2 nds-p-around_medium nds-m-bottom_small" style="border-width: 1px; border-style: solid;">
      .nds-color__border_gray-

      2

    </div>
    <div class="nds-color__border_gray-3 nds-p-around_medium nds-m-bottom_small" style="border-width: 1px; border-style: solid;">
      .nds-color__border_gray-

      3

    </div>
    <div class="nds-color__border_gray-4 nds-p-around_medium nds-m-bottom_small" style="border-width: 1px; border-style: solid;">
      .nds-color__border_gray-

      4

    </div>
    <div class="nds-color__border_gray-5 nds-p-around_medium nds-m-bottom_small" style="border-width: 1px; border-style: solid;">
      .nds-color__border_gray-

      5

    </div>
    <div class="nds-color__border_gray-6 nds-p-around_medium nds-m-bottom_small" style="border-width: 1px; border-style: solid;">
      .nds-color__border_gray-

      6

    </div>
    <div class="nds-color__border_gray-7 nds-p-around_medium nds-m-bottom_small" style="border-width: 1px; border-style: solid;">
      .nds-color__border_gray-

      7

    </div>
    <div class="nds-color__border_gray-8 nds-p-around_medium nds-m-bottom_small" style="border-width: 1px; border-style: solid;">
      .nds-color__border_gray-

      8

    </div>
    <div class="nds-color__border_gray-9 nds-p-around_medium nds-m-bottom_small" style="border-width: 1px; border-style: solid;">
      .nds-color__border_gray-

      9

    </div>
    <div class="nds-color__border_gray-10 nds-p-around_medium nds-m-bottom_small" style="border-width: 1px; border-style: solid;">
      .nds-color__border_gray-

      10

    </div>
    <div class="nds-color__border_gray-11 nds-p-around_medium nds-m-bottom_small" style="border-width: 1px; border-style: solid;">
      .nds-color__border_gray-

      11

    </div>
    <div class="nds-color__border_gray-12 nds-p-around_medium nds-m-bottom_small" style="border-width: 1px; border-style: solid;">
      .nds-color__border_gray-

      12

    </div>
  </div>
  <h2 class="nds-text-heading_large nds-m-bottom_medium">SVG Fill Colors</h2>
  <div class="nds-m-bottom_large">
    <div class="nds-p-around_small">
      <svg class="nds-color__fill_gray-1 nds-icon_small" aria-hidden="true">
        <use xlink:href="./assets/icons/action-sprite/svg/symbols.svg#check"></use>
      </svg>
      <span class="nds-p-left_small">
        .nds-color__fill_gray-

        1

      </span>
    </div>
    <div class="nds-p-around_small">
      <svg class="nds-color__fill_gray-2 nds-icon_small" aria-hidden="true">
        <use xlink:href="./assets/icons/action-sprite/svg/symbols.svg#check"></use>
      </svg>
      <span class="nds-p-left_small">
        .nds-color__fill_gray-

        2

      </span>
    </div>
    <div class="nds-p-around_small">
      <svg class="nds-color__fill_gray-3 nds-icon_small" aria-hidden="true">
        <use xlink:href="./assets/icons/action-sprite/svg/symbols.svg#check"></use>
      </svg>
      <span class="nds-p-left_small">
        .nds-color__fill_gray-

        3

      </span>
    </div>
    <div class="nds-p-around_small">
      <svg class="nds-color__fill_gray-4 nds-icon_small" aria-hidden="true">
        <use xlink:href="./assets/icons/action-sprite/svg/symbols.svg#check"></use>
      </svg>
      <span class="nds-p-left_small">
        .nds-color__fill_gray-

        4

      </span>
    </div>
    <div class="nds-p-around_small">
      <svg class="nds-color__fill_gray-5 nds-icon_small" aria-hidden="true">
        <use xlink:href="./assets/icons/action-sprite/svg/symbols.svg#check"></use>
      </svg>
      <span class="nds-p-left_small">
        .nds-color__fill_gray-

        5

      </span>
    </div>
    <div class="nds-p-around_small">
      <svg class="nds-color__fill_gray-6 nds-icon_small" aria-hidden="true">
        <use xlink:href="./assets/icons/action-sprite/svg/symbols.svg#check"></use>
      </svg>
      <span class="nds-p-left_small">
        .nds-color__fill_gray-

        6

      </span>
    </div>
    <div class="nds-p-around_small">
      <svg class="nds-color__fill_gray-7 nds-icon_small" aria-hidden="true">
        <use xlink:href="./assets/icons/action-sprite/svg/symbols.svg#check"></use>
      </svg>
      <span class="nds-p-left_small">
        .nds-color__fill_gray-

        7

      </span>
    </div>
    <div class="nds-p-around_small">
      <svg class="nds-color__fill_gray-8 nds-icon_small" aria-hidden="true">
        <use xlink:href="./assets/icons/action-sprite/svg/symbols.svg#check"></use>
      </svg>
      <span class="nds-p-left_small">
        .nds-color__fill_gray-

        8

      </span>
    </div>
    <div class="nds-p-around_small">
      <svg class="nds-color__fill_gray-9 nds-icon_small" aria-hidden="true">
        <use xlink:href="./assets/icons/action-sprite/svg/symbols.svg#check"></use>
      </svg>
      <span class="nds-p-left_small">
        .nds-color__fill_gray-

        9

      </span>
    </div>
    <div class="nds-p-around_small">
      <svg class="nds-color__fill_gray-10 nds-icon_small" aria-hidden="true">
        <use xlink:href="./assets/icons/action-sprite/svg/symbols.svg#check"></use>
      </svg>
      <span class="nds-p-left_small">
        .nds-color__fill_gray-

        10

      </span>
    </div>
    <div class="nds-p-around_small">
      <svg class="nds-color__fill_gray-11 nds-icon_small" aria-hidden="true">
        <use xlink:href="./assets/icons/action-sprite/svg/symbols.svg#check"></use>
      </svg>
      <span class="nds-p-left_small">
        .nds-color__fill_gray-

        11

      </span>
    </div>
    <div class="nds-p-around_small">
      <svg class="nds-color__fill_gray-12 nds-icon_small" aria-hidden="true">
        <use xlink:href="./assets/icons/action-sprite/svg/symbols.svg#check"></use>
      </svg>
      <span class="nds-p-left_small">
        .nds-color__fill_gray-

        12

      </span>
    </div>
  </div>
</div>`);
  });
