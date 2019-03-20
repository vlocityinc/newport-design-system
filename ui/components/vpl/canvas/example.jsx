// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import classNames from 'classnames';

/// ////////////////////////////////////////
// Partial(s)
/// ////////////////////////////////////////

export let NdsCanvas = props => (
  <div className="nds-canvas">{props.children}</div>
);

export let CanvasBody = props => (
  <div className="nds-p-around_small">
    <CanvasTitle />
    <div className="nds-grid nds-m-bottom_small nds-wrap cards-container">
      <div className="nds-size_1-of-1 nds-m-bottom--large">My Action 1</div>
      <div className="nds-size_1-of-1 nds-m-bottom--large">My Action 2</div>
    </div>
  </div>
);

export let CanvasTitle = props => (
  <h3 className="nds-is-relative nds-m-bottom_large nds-canvas__title">
    My Session
  </h3>
);

/// ////////////////////////////////////////
// Export
/// ////////////////////////////////////////

export default (
  <NdsCanvas>
    <CanvasBody />
  </NdsCanvas>
);

export let states = [];
