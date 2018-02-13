// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import { ButtonIcon } from '../../button-icons/base/example';
import SvgIcon from '../../../shared/svg-icon';
import classNames from 'classnames';

/// ////////////////////////////////////////
// Partial(s)
/// ////////////////////////////////////////

export let Comment = props => (
  <article
    className={classNames(
      'nds-comment nds-media nds-hint-parent',
      props.className
    )}
  >
    <div className="nds-media__figure">
      <a
        href="javascript:void(0);"
        className="nds-avatar nds-avatar_circle nds-avatar_medium"
      >
        <img
          alt="Jenna Davis"
          src="/assets/images/avatar2.jpg"
          title="Jenna Davis avatar"
        />
      </a>
    </div>
    <div className="nds-media__body">{props.children}</div>
  </article>
);

export let CommentHeader = props => (
  <header className="nds-media nds-media_center">
    <div className="nds-grid nds-grid_align-spread nds-has-flexi-truncate">
      <p className="nds-truncate" title="Jenna Davis">
        <a href="javascript:void(0);">Jenna Davis</a>
      </p>
      <ButtonIcon
        className="nds-button_icon-border nds-button_icon-x-small"
        aria-haspopup="true"
        symbol="down"
        assistiveText="More Options"
        title="More Options"
      />
    </div>
  </header>
);

export let CommentContent = props => (
  <div
    className={classNames(
      'nds-comment__content nds-text-longform',
      props.className
    )}
  >
    {props.children}
  </div>
);

export let CommentFooter = props => (
  <footer>
    <ul className="nds-list_horizontal nds-has-dividers_right nds-text-body_small">
      <li className="nds-item">
        <button
          className="nds-button_reset nds-text-color_weak"
          title="Like this item"
          aria-pressed={!!props.liked}
        >
          {props.liked ? 'Liked' : 'Like'}
        </button>
      </li>
      {props.liked ? <li className="nds-item">1 Like</li> : null}
      <li className="nds-item">16hr Ago</li>
    </ul>
  </footer>
);

/// ////////////////////////////////////////
// Export
/// ////////////////////////////////////////

export default (
  <Comment>
    <CommentHeader />
    <CommentContent>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua.
    </CommentContent>
    <CommentFooter />
  </Comment>
);

export let states = [
  {
    id: 'comment-liked',
    label: 'Like',
    element: (
      <Comment>
        <CommentHeader />
        <CommentContent>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </CommentContent>
        <CommentFooter liked />
      </Comment>
    )
  }
];
