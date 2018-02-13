// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import { ButtonIcon } from '../../button-icons/base/example';

/// ///////////////////////////////////////////
// State Constructor(s)
/// ///////////////////////////////////////////

let Popover = props => (
  <div
    aria-label="Dialog title"
    aria-describedby="popover-body-id"
    className={`nds-popover nds-nubbin_left nds-theme_${props.theme}`}
    role="dialog"
  >
    <ButtonIcon
      className="nds-button_icon-inverse nds-button_icon-small nds-float_right nds-popover__close"
      symbol="close"
      assistiveText="Close dialog"
      title="Close dialog"
    />
    <div id="popover-body-id" className="nds-popover__body">
      Sit nulla est ex deserunt exercitation anim occaecat. Nostrud ullamco
      deserunt aute id consequat veniam incididunt duis in sint irure nisi.
    </div>
  </div>
);

/// ///////////////////////////////////////////
// Export
/// ///////////////////////////////////////////

export let states = [
  {
    id: 'info',
    label: 'Info',
    element: <Popover theme="info" />
  },
  {
    id: 'error',
    label: 'Error',
    element: <Popover theme="error" />
  },
  {
    id: 'warning',
    label: 'Warning',
    element: <Popover theme="warning" />
  },
  {
    id: 'success',
    label: 'Success',
    element: <Popover theme="success" />
  }
];
