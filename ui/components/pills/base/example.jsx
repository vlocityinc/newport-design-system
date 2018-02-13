// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import { ButtonIcon } from '../../button-icons/base/example';
import SvgIcon from '../../../shared/svg-icon';
import classNames from 'classnames';

/// ////////////////////////////////////////
// Partial(s)
/// ////////////////////////////////////////

export let Pill = props => (
  <span className={classNames('nds-pill nds-pill_link', props.className)}>
    {props.children}
    <a
      href="javascript:void(0);"
      className="nds-pill__action"
      title={props.label || 'Full pill label verbiage mirrored here'}
    >
      <span className="nds-pill__label">{props.label || 'Pill Label'}</span>
    </a>
    <ButtonIcon
      className="nds-button_icon nds-pill__remove"
      symbol="close"
      assistiveText="Remove"
      title="Remove"
    />
  </span>
);

export let PillContainer = props => (
  <div className={classNames('nds-pill_container', props.className)}>
    {props.children}
  </div>
);

/// ////////////////////////////////////////
// Export
/// ////////////////////////////////////////

export default <Pill />;

export let examples = [
  {
    id: 'icon',
    label: 'With icon',
    element: (
      <Pill>
        <span className="nds-pill__icon_container">
          <span
            className="nds-icon_container nds-icon-standard-account"
            title="Account"
          >
            <SvgIcon className="nds-icon" sprite="standard" symbol="account" />
            <span className="nds-assistive-text">Account</span>
          </span>
        </span>
      </Pill>
    )
  },
  {
    id: 'avatar',
    label: 'With avatar',
    element: (
      <Pill>
        <span className="nds-pill__icon_container">
          <span className="nds-avatar nds-avatar_circle" title="User avatar">
            <img
              alt="Person name"
              src="/assets/images/avatar2.jpg"
              title="User avatar"
            />
          </span>
        </span>
      </Pill>
    )
  },
  {
    id: 'truncated',
    label: 'Truncated',
    element: (
      <div className="demo-only" style={{ width: '220px' }}>
        <PillContainer>
          <Pill label="Pill label that is longer than the area that contains it" />
        </PillContainer>
      </div>
    )
  },
  {
    id: 'container',
    label: 'Pill with Container',
    element: (
      <PillContainer>
        <Pill />
        <Pill />
        <Pill />
      </PillContainer>
    )
  },
  {
    id: 'error',
    label: 'Error',
    element: (
      <Pill className="nds-has-error">
        <span className="nds-pill__icon_container">
          <span className="nds-icon_container" title="Error">
            <SvgIcon
              className="nds-icon nds-icon-text-error"
              sprite="utility"
              symbol="warning"
            />
            <span className="nds-assistive-text">Warning</span>
          </span>
        </span>
      </Pill>
    )
  }
];
