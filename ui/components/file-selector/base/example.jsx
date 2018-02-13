// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import SvgIcon from '../../../shared/svg-icon';
import classNames from 'classnames';

export let FileSelector = props => (
  <div
    className={classNames(
      'nds-form-element',
      props.error ? 'nds-has-error' : null
    )}
  >
    <span className="nds-form-element__label" id="file-selector-primary-label">
      Attachment
    </span>
    <div className="nds-form-element__control">
      <div className={classNames('nds-file-selector', props.className)}>
        <div
          className={classNames(
            'nds-file-selector__dropzone',
            props.draggover ? 'nds-has-drag-over' : null
          )}
        >
          <input
            className="nds-file-selector__input nds-assistive-text"
            accept="image/png"
            type="file"
            id="file-upload-input-01"
            disabled={props.draggoverError}
            aria-describedby={props.error ? 'error-01' : null}
            aria-labelledby="file-selector-primary-label file-selector-secondary-label"
          />
          <label
            className="nds-file-selector__body"
            htmlFor="file-upload-input-01"
            id="file-selector-secondary-label"
          >
            <span className="nds-file-selector__button nds-button nds-button_neutral">
              <SvgIcon
                className="nds-button__icon nds-button__icon_left"
                sprite="utility"
                symbol="upload"
              />Upload {props.files ? 'Files' : 'Image'}
            </span>
            <span className="nds-file-selector__text nds-medium-show">
              or Drop {props.files ? 'Files' : 'Image'}
            </span>
          </label>
        </div>
      </div>
    </div>
    {props.error ? (
      <div className="nds-form-element__help" id="error-01">
        File type not supported
      </div>
    ) : null}
  </div>
);

export default <FileSelector files className="nds-file-selector_files" />;

export let states = [
  {
    id: 'file-selector-files-error',
    label: 'Error',
    element: <FileSelector files className="nds-file-selector_files" error />
  },
  {
    id: 'file-selector-files-draggover',
    label: 'Dragover',
    element: (
      <FileSelector files className="nds-file-selector_files" draggover />
    )
  },
  {
    id: 'file-selector-files-draggover-error',
    label: 'Dragover with error',
    element: (
      <FileSelector
        files
        className="nds-file-selector_files"
        draggoverError
        error
      />
    )
  }
];
