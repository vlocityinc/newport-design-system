// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import { ButtonIcon } from '../../button-icons/base/example';
import MediaObject from '../../../utilities/media-objects/index.react';
import classNames from 'classnames';

/// ////////////////////////////////////////
// Partial(s)
/// ////////////////////////////////////////

const image = (
  <a
    className="nds-avatar nds-avatar_circle nds-avatar_medium"
    href="javascript:void(0);"
  >
    <img
      alt="Person name"
      src="/assets/images/avatar2.jpg"
      title="User avatar"
    />
  </a>
);

export let Publisher = props => (
  <MediaObject figureLeft={image} className="nds-comment nds-hint-parent">
    <div
      className={classNames(
        'nds-publisher nds-publisher_comment',
        props.className
      )}
    >
      <label htmlFor="comment-text-input-01" className="nds-assistive-text">
        Write a comment
      </label>
      <textarea
        id="comment-text-input-01"
        className="nds-publisher__input nds-input_bare nds-text-longform"
        placeholder="Write a comment&hellip;"
      />
      <div className="nds-publisher__actions nds-grid nds-grid_align-spread">
        <ul className="nds-grid">
          <li>
            <ButtonIcon
              className="nds-button_icon-container"
              symbol="adduser"
              assistiveText="Add User"
              title="Add User"
            />
          </li>
          <li>
            <ButtonIcon
              className="nds-button_icon-container"
              symbol="attach"
              assistiveText="Attach a file"
              title="Attach a file"
            />
          </li>
        </ul>
        <button className="nds-button nds-button_brand">Comment</button>
      </div>
    </div>
  </MediaObject>
);

/// ////////////////////////////////////////
// State Constructor(s)
/// ////////////////////////////////////////

// @todo - Need to find imports and delete this part

export let Default = props => <Publisher />;

/// ////////////////////////////////////////
// Export
/// ////////////////////////////////////////

export default <Publisher />;
