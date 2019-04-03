import { storiesOf } from '@storybook/html';
import base from 'paths.macro';
import notes from '../doc.md';
import scss from '../base/_index.scss';
import {
  withExample,
  withDocs,
  commentToHTML
} from '../../../../scripts/storybook';

storiesOf(`${base}`, module)
  .addDecorator(withDocs(notes))
  .addDecorator(commentToHTML(scss))
  .add('Default (default)', () => {
    return withExample(`<div class="demo-only" style="width: 320px; height: 320px;">
  <div class="nds-file-selector nds-file-selector_integrated nds-file-selector_integrated">
    <div class="nds-file-selector__dropzone nds-file-selector__dropzone_integrated" aria-hidden="true">
      <input type="file" class="nds-file-selector__input nds-assistive-text" accept="image/png" id="file-upload-input-01" tabindex="-1">
      <label class="nds-file-selector__body nds-file-selector__body_integrated" for="file-upload-input-01">
        <svg class="nds-file-selector__body-icon nds-icon nds-icon-text-default" aria-hidden="true">
          <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#upload"></use>
        </svg>
        <span class="nds-file-selector__text nds-file-selector__text_integrated nds-text-heading_medium nds-text-align_center">Drop Files</span>
      </label>
    </div>
    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
    dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

  </div>
</div>`);
  })
  .add('Integrated File Selector Drag (states)', () => {
    return withExample(`<div class="demo-only" style="width: 320px; height: 320px;">
  <div class="nds-file-selector nds-file-selector_integrated nds-file-selector_integrated">
    <div class="nds-file-selector__dropzone nds-file-selector__dropzone_integrated nds-has-drag" aria-hidden="true">
      <input type="file" class="nds-file-selector__input nds-assistive-text" accept="image/png" id="file-upload-input-01" tabindex="-1">
      <label class="nds-file-selector__body nds-file-selector__body_integrated" for="file-upload-input-01">
        <svg class="nds-file-selector__body-icon nds-icon nds-icon-text-default" aria-hidden="true">
          <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#upload"></use>
        </svg>
        <span class="nds-file-selector__text nds-file-selector__text_integrated nds-text-heading_medium nds-text-align_center">Drop Files</span>
      </label>
    </div>
    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
    dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

  </div>
</div>`);
  })
  .add('Integrated File Selector Draggover (states)', () => {
    return withExample(`<div class="demo-only" style="width: 320px; height: 320px;">
  <div class="nds-file-selector nds-file-selector_integrated nds-file-selector_integrated">
    <div class="nds-file-selector__dropzone nds-file-selector__dropzone_integrated nds-has-drag nds-has-drag-over" aria-hidden="true">
      <input type="file" class="nds-file-selector__input nds-assistive-text" accept="image/png" id="file-upload-input-01" tabindex="-1">
      <label class="nds-file-selector__body nds-file-selector__body_integrated" for="file-upload-input-01">
        <svg class="nds-file-selector__body-icon nds-icon nds-icon-text-default" aria-hidden="true">
          <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#upload"></use>
        </svg>
        <span class="nds-file-selector__text nds-file-selector__text_integrated nds-text-heading_medium nds-text-align_center">Drop Files</span>
      </label>
    </div>
    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
    dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

  </div>
</div>`);
  })
  .add('Integrated File Selector Draggover Error (states)', () => {
    return withExample(`<div class="demo-only" style="width: 320px; height: 320px;">
  <div class="nds-file-selector nds-file-selector_integrated nds-file-selector_integrated">
    <div class="nds-file-selector__dropzone nds-file-selector__dropzone_integrated nds-has-drag" aria-hidden="true">
      <input type="file" class="nds-file-selector__input nds-assistive-text" accept="image/png" id="file-upload-input-01" disabled="" tabindex="-1">
      <label class="nds-file-selector__body nds-file-selector__body_integrated" for="file-upload-input-01">
        <svg class="nds-file-selector__body-icon nds-icon nds-icon-text-default" aria-hidden="true">
          <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#ban"></use>
        </svg>
        <span class="nds-file-selector__text nds-file-selector__text_integrated nds-text-heading_medium nds-text-align_center">Too many files selected. Attach up to 1 file.</span>
      </label>
    </div>
    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
    dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

  </div>
</div>`);
  });
