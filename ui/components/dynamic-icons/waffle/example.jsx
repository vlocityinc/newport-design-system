// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import classNames from 'classnames';

/* -----------------------------------------------------------------------------
    Public
----------------------------------------------------------------------------- */

export let WaffleIcon = props => (
  <button
    {...props}
    className={classNames(
      'nds-button nds-icon-waffle_container',
      props.className
    )}
    title="Description of the icon when needed"
  >
    <span className="nds-icon-waffle">
      <span className="nds-r1" />
      <span className="nds-r2" />
      <span className="nds-r3" />
      <span className="nds-r4" />
      <span className="nds-r5" />
      <span className="nds-r6" />
      <span className="nds-r7" />
      <span className="nds-r8" />
      <span className="nds-r9" />
    </span>
    <span className="nds-assistive-text">Open App Launcher</span>
  </button>
);

/* -----------------------------------------------------------------------------
    Exports
----------------------------------------------------------------------------- */

// Default
export default <WaffleIcon />;
