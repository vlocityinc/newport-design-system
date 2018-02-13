// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import { ButtonIcon } from '../../button-icons/base/example';
import { PillContainer } from '../base/example';
import { Avatar } from '../../avatar/base/example';
import SvgIcon from '../../../shared/svg-icon';
import classNames from 'classnames';

/// ////////////////////////////////////////
// Partial(s)
/// ////////////////////////////////////////

export let ListboxPill = props => (
  <span
    className={classNames('nds-pill', props.className)}
    role="option"
    tabIndex={props.tabIndex}
    aria-selected="true"
  >
    {props.children}
    <span
      className="nds-pill__label"
      title={props.label || 'Full pill label verbiage mirrored here'}
    >
      {props.label || 'Pill Label'}
    </span>
    <span className="nds-icon_container nds-pill__remove" title="Remove">
      <SvgIcon
        className="nds-icon nds-icon_x-small nds-icon-text-default"
        sprite="utility"
        symbol="close"
      />
      <span className="nds-assistive-text">
        Press delete or backspace to remove
      </span>
    </span>
  </span>
);

export let ListboxHoriz = props => (
  <ul
    className="nds-listbox nds-listbox_horizontal"
    role="listbox"
    aria-label="Selected Options:"
    aria-orientation="horizontal"
  >
    {props.children}
  </ul>
);

export let ListItemHoriz = props => (
  <li role="presentation">{props.children}</li>
);

/// ////////////////////////////////////////
// Export
/// ////////////////////////////////////////

export default (
  <PillContainer>
    <ListboxHoriz>
      <ListItemHoriz>
        <ListboxPill tabIndex="0" />
      </ListItemHoriz>
      <ListItemHoriz>
        <ListboxPill />
      </ListItemHoriz>
    </ListboxHoriz>
  </PillContainer>
);

export let states = [
  {
    id: 'listbox-pill-with-icon',
    label: 'With icon',
    element: (
      <PillContainer>
        <ListboxHoriz>
          <ListItemHoriz>
            <ListboxPill tabIndex="0">
              <span
                className="nds-icon_container nds-icon-standard-account nds-pill__icon_container"
                title="Account"
              >
                <SvgIcon
                  className="nds-icon"
                  sprite="standard"
                  symbol="account"
                />
                <span className="nds-assistive-text">Account</span>
              </span>
            </ListboxPill>
          </ListItemHoriz>
          <ListItemHoriz>
            <ListboxPill>
              <span
                className="nds-icon_container nds-icon-standard-case nds-pill__icon_container"
                title="Case"
              >
                <SvgIcon className="nds-icon" sprite="standard" symbol="case" />
                <span className="nds-assistive-text">Case</span>
              </span>
            </ListboxPill>
          </ListItemHoriz>
        </ListboxHoriz>
      </PillContainer>
    )
  },
  {
    id: 'listbox-pill-with-avatar',
    label: 'With avatar',
    element: (
      <PillContainer>
        <ListboxHoriz>
          <ListItemHoriz>
            <ListboxPill tabIndex="0">
              <Avatar className="nds-avatar_x-small nds-pill__icon_container">
                <img
                  alt="Person name"
                  src="/assets/images/avatar2.jpg"
                  title="User avatar"
                />
              </Avatar>
            </ListboxPill>
          </ListItemHoriz>
          <ListItemHoriz>
            <ListboxPill>
              <Avatar className="nds-avatar_x-small nds-pill__icon_container">
                <img
                  alt="Person name"
                  src="/assets/images/avatar2.jpg"
                  title="User avatar"
                />
              </Avatar>
            </ListboxPill>
          </ListItemHoriz>
        </ListboxHoriz>
      </PillContainer>
    )
  }
];
