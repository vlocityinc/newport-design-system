// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import classNames from 'classnames';
import { ButtonIcon } from '../../button-icons/base/example';

export let Tooltip = props => (
  <div
    className={classNames('nds-popover nds-popover_tooltip', props.className)}
    role="tooltip"
    id={props.id}
    style={props.style}
  >
    <div className="nds-popover__body">{props.children}</div>
  </div>
);

export default (
  <div
    style={{ paddingLeft: '2rem', paddingTop: '5rem', position: 'relative' }}
  >
    <div className="nds-form-element">
      <div className="nds-form-element__icon nds-align-middle">
        <ButtonIcon
          className="nds-button nds-button_icon"
          symbol="info"
          aria-describedby="help"
          assistiveText="Help"
          title="Help"
        />
      </div>
    </div>
    <Tooltip
      className="nds-nubbin_bottom-left"
      id="help"
      style={{ position: 'absolute', top: '0px', left: '15px' }}
    >
      Sit nulla est ex deserunt exercitation anim occaecat. Nostrud ullamco
      deserunt aute id consequat veniam incididunt duis in sint irure nisi.
    </Tooltip>
  </div>
);
