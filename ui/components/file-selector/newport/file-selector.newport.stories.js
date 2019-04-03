import { storiesOf } from '@storybook/html';
import base from 'paths.macro';
import notes from '../doc.md';
import basescss from '../base/_index.scss';
import scss from './_index.scss';
import {
  withExample,
  withDocs,
  commentToHTML
} from '../../../../scripts/storybook';

storiesOf(`${base}`, module)
  .addDecorator(withDocs(notes))
  .addDecorator(commentToHTML(basescss + scss))
  .add('Default (default)', () => {
    return withExample(`<div class="nds-form-element">
  <div class="nds-form-element__control">
    <div class="nds-file-selector nds-file-custom-selector nds-file-selector_files">
      <div class="nds-file-selector__dropzone">
        <input type="file" class="nds-file-selector__input" accept="image/png" id="file-upload-input-01" aria-labelledby="file-selector-primary-label file-selector-secondary-label">
        <label class="nds-file-selector__body" for="file-upload-input-01" id="file-selector-secondary-label">
          <span class="nds-file-selector__button nds-button nds-button_neutral">Attachment</span>
          <span class="nds-file-icon">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#attach"></use>
            </svg>
          </span>
        </label>
      </div>
    </div>
  </div>
</div>`);
  })
  .add('File Selector Files List (states)', () => {
    return withExample(`<div class="nds-form-element">
  <div class="nds-form-element__control">
    <div class="nds-file-selector nds-file-custom-selector nds-file-selector_files">
      <div class="nds-file-selector__dropzone">
        <input type="file" class="nds-file-selector__input" accept="image/png" id="file-upload-input-01" aria-labelledby="file-selector-primary-label file-selector-secondary-label">
        <label class="nds-file-selector__body" for="file-upload-input-01" id="file-selector-secondary-label">
          <span class="nds-file-selector__button nds-button nds-button_neutral">Attachment</span>
          <span class="nds-file-icon">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#attach"></use>
            </svg>
          </span>
        </label>
        <ul class="nds-file-list">
          <li>
            <span class="nds-file-selector__button nds-button nds-button_neutral">peel-ux.png</span>
            <span class="nds-file-icon">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#clear"></use>
              </svg>
            </span>
          </li>
          <li>
            <span class="nds-file-selector__button nds-button nds-button_neutral">peel-ux.png</span>
            <span class="nds-file-icon">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#clear"></use>
              </svg>
            </span>
          </li>
          <li>
            <span class="nds-file-selector__button nds-button nds-button_neutral">peel-ux.png</span>
            <span class="nds-file-icon">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#clear"></use>
              </svg>
            </span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>`);
  })
  .add('File Selector Files Error (states)', () => {
    return withExample(`<div class="nds-form-element nds-has-error">
  <div class="nds-form-element__control">
    <div class="nds-file-selector nds-file-custom-selector nds-file-selector_files">
      <div class="nds-file-selector__dropzone">
        <input type="file" class="nds-file-selector__input" accept="image/png" id="file-upload-input-01" aria-describedby="error-01" aria-labelledby="file-selector-primary-label file-selector-secondary-label">
        <label class="nds-file-selector__body" for="file-upload-input-01" id="file-selector-secondary-label">
          <span class="nds-file-selector__button nds-button nds-button_neutral">Attachment</span>
          <span class="nds-file-icon">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#attach"></use>
            </svg>
          </span>
        </label>
      </div>
    </div>
  </div>
  <div class="nds-form-element__help" id="error-01">File type not supported</div>
</div>`);
  })
  .add('File Selector Files Draggover (states)', () => {
    return withExample(`<div class="nds-form-element">
  <div class="nds-form-element__control">
    <div class="nds-file-selector nds-file-custom-selector nds-file-selector_files">
      <div class="nds-file-selector__dropzone nds-has-drag-over">
        <input type="file" class="nds-file-selector__input" accept="image/png" id="file-upload-input-01" aria-labelledby="file-selector-primary-label file-selector-secondary-label">
        <label class="nds-file-selector__body" for="file-upload-input-01" id="file-selector-secondary-label">
          <span class="nds-file-selector__button nds-button nds-button_neutral">Attachment</span>
          <span class="nds-file-icon">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#attach"></use>
            </svg>
          </span>
        </label>
      </div>
    </div>
  </div>
</div>`);
  })
  .add('File Selector Files Draggover Error (states)', () => {
    return withExample(`<div class="nds-form-element nds-has-error">
  <div class="nds-form-element__control">
    <div class="nds-file-selector nds-file-custom-selector nds-file-selector_files">
      <div class="nds-file-selector__dropzone">
        <input type="file" class="nds-file-selector__input" accept="image/png" id="file-upload-input-01" disabled="" aria-describedby="error-01" aria-labelledby="file-selector-primary-label file-selector-secondary-label">
        <label class="nds-file-selector__body" for="file-upload-input-01" id="file-selector-secondary-label">
          <span class="nds-file-selector__button nds-button nds-button_neutral">Attachment</span>
          <span class="nds-file-icon">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#attach"></use>
            </svg>
          </span>
        </label>
      </div>
    </div>
  </div>
  <div class="nds-form-element__help" id="error-01">File type not supported</div>
</div>`);
  });
