// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import classNames from 'classnames';

const Spinner = props => (
  <div className="nds-spinner_container">
    <div
      {...props}
      className={classNames('nds-spinner', props.className)}
      role="status"
    >
      <span className="nds-assistive-text">Loading</span>
      <div className="nds-spinner__dot-a" />
      <div className="nds-spinner__dot-b" />
    </div>
    {props.children}
  </div>
);

export default Spinner;
