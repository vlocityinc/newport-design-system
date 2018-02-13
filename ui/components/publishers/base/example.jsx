// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import { ButtonIcon } from '../../button-icons/base/example';
import classNames from 'classnames';

/// ////////////////////////////////////////
// Partial(s)
/// ////////////////////////////////////////

const image = (
  <a
    className="nds-avatar nds-avatar_circle nds-avatar_small"
    href="javascript:void(0);"
  >
    <img
      alt="Jenna Davis"
      src="/assets/images/avatar2.jpg"
      title="Jenna Davis avatar"
    />
  </a>
);

let Publisher = props => (
  <div className={classNames('nds-publisher', props.className)}>
    <label
      htmlFor="comment-text-input2"
      className="nds-publisher__toggle-visibility nds-m-bottom_small"
    >
      <span className="nds-assistive-text">Write a comment</span>To: My
      followers
    </label>
    <textarea
      id="comment-text-input2"
      className="nds-publisher__input nds-textarea nds-text-longform"
      placeholder="Write a comment&hellip;"
    />
    {props.children}
  </div>
);

let PublisherActions = props => (
  <div className="nds-publisher__actions nds-grid nds-grid_align-spread">
    <ul className="nds-grid nds-publisher__toggle-visibility">
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
    <button className="nds-button nds-button_brand">Share</button>
  </div>
);

/// ////////////////////////////////////////
// Export
/// ////////////////////////////////////////

export default (
  <Publisher>
    <PublisherActions />
  </Publisher>
);
