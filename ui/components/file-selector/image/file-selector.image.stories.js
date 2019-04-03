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
    return withExample(`<div class="demo-only" style="max-width: 320px;">
  <div class="nds-form-element">
    <span class="nds-form-element__label" id="file-selector-primary-label">Attachment</span>
    <div class="nds-form-element__control">
      <div class="nds-file-selector nds-file-selector_images">
        <div class="nds-file-selector__dropzone">
          <input type="file" class="nds-file-selector__input nds-assistive-text" accept="image/png" id="file-upload-input-01" aria-labelledby="file-selector-primary-label file-selector-secondary-label">
          <label class="nds-file-selector__body" for="file-upload-input-01" id="file-selector-secondary-label">
            <span class="nds-file-selector__button nds-button nds-button_neutral">
              <svg class="nds-button__icon nds-button__icon_left" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#upload"></use>
              </svg>
              Upload

              Image

            </span>
            <span class="nds-file-selector__text nds-medium-show">
              or Drop

              Image

            </span>
          </label>
        </div>
      </div>
    </div>
  </div>
</div>`);
  })
  .add('File Selector Images Error (states)', () => {
    return withExample(`<div class="demo-only" style="max-width: 320px;">
  <div class="nds-form-element nds-has-error">
    <span class="nds-form-element__label" id="file-selector-primary-label">Attachment</span>
    <div class="nds-form-element__control">
      <div class="nds-file-selector nds-file-selector_images">
        <div class="nds-file-selector__dropzone">
          <input type="file" class="nds-file-selector__input nds-assistive-text" accept="image/png" id="file-upload-input-01" aria-describedby="error-01" aria-labelledby="file-selector-primary-label file-selector-secondary-label">
          <label class="nds-file-selector__body" for="file-upload-input-01" id="file-selector-secondary-label">
            <span class="nds-file-selector__button nds-button nds-button_neutral">
              <svg class="nds-button__icon nds-button__icon_left" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#upload"></use>
              </svg>
              Upload

              Image

            </span>
            <span class="nds-file-selector__text nds-medium-show">
              or Drop

              Image

            </span>
          </label>
        </div>
      </div>
    </div>
    <div class="nds-form-element__help" id="error-01">File type not supported</div>
  </div>
</div>`);
  })
  .add('File Selector Images Draggover (states)', () => {
    return withExample(`<div class="demo-only" style="max-width: 320px;">
  <div class="nds-form-element">
    <span class="nds-form-element__label" id="file-selector-primary-label">Attachment</span>
    <div class="nds-form-element__control">
      <div class="nds-file-selector nds-file-selector_images">
        <div class="nds-file-selector__dropzone nds-has-drag-over">
          <input type="file" class="nds-file-selector__input nds-assistive-text" accept="image/png" id="file-upload-input-01" aria-labelledby="file-selector-primary-label file-selector-secondary-label">
          <label class="nds-file-selector__body" for="file-upload-input-01" id="file-selector-secondary-label">
            <span class="nds-file-selector__button nds-button nds-button_neutral">
              <svg class="nds-button__icon nds-button__icon_left" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#upload"></use>
              </svg>
              Upload

              Image

            </span>
            <span class="nds-file-selector__text nds-medium-show">
              or Drop

              Image

            </span>
          </label>
        </div>
      </div>
    </div>
  </div>
</div>`);
  })
  .add('File Selector Images Draggover Error (states)', () => {
    return withExample(`<div class="demo-only" style="max-width: 320px;">
  <div class="nds-form-element nds-has-error">
    <span class="nds-form-element__label" id="file-selector-primary-label">Attachment</span>
    <div class="nds-form-element__control">
      <div class="nds-file-selector nds-file-selector_images">
        <div class="nds-file-selector__dropzone">
          <input type="file" class="nds-file-selector__input nds-assistive-text" accept="image/png" id="file-upload-input-01" disabled="" aria-describedby="error-01" aria-labelledby="file-selector-primary-label file-selector-secondary-label">
          <label class="nds-file-selector__body" for="file-upload-input-01" id="file-selector-secondary-label">
            <span class="nds-file-selector__button nds-button nds-button_neutral">
              <svg class="nds-button__icon nds-button__icon_left" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#upload"></use>
              </svg>
              Upload

              Image

            </span>
            <span class="nds-file-selector__text nds-medium-show">
              or Drop

              Image

            </span>
          </label>
        </div>
      </div>
    </div>
    <div class="nds-form-element__help" id="error-01">File type not supported</div>
  </div>
</div>`);
  });
