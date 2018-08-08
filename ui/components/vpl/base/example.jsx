// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import SvgIcon from '../../../shared/svg-icon';
import classNames from 'classnames';

/// ////////////////////////////////////////
// Partial(s)
/// ////////////////////////////////////////

export let Canvas = props => (
  <div className={classNames('nds-canvas', props.className)}>
    {props.children}
  </div>
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
  <Canvas>
    <CanvasBody />
  </Canvas>
);

export let states = [
  {
    id: 'border',
    label: 'Border',
    element: (
      <Canvas>
        <CanvasBody />
      </Canvas>
    )
  }
];

export let examples = [
  {
    id: 'related-list-table',
    label: 'With data-table',
    element: (
      <Canvas>
        <CanvasBody />
      </Canvas>
    )
  }
];
