// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';

export const Context = props => (
  <div className="demo-only-spacing demo-only-margin">{props.children}</div>
);

export let examples = [
  {
    id: 'top',
    label: 'Top',
    element: (
      <div>
        <div className="nds-m-top_none" />
        <div className="nds-m-top_xxx-small" />
        <div className="nds-m-top_xx-small" />
        <div className="nds-m-top_x-small" />
        <div className="nds-m-top_small" />
        <div className="nds-m-top_medium" />
        <div className="nds-m-top_large" />
        <div className="nds-m-top_x-large" />
        <div className="nds-m-top_xx-large" />
      </div>
    )
  },
  {
    id: 'right',
    label: 'Right',
    element: (
      <div>
        <div className="nds-m-right_none" />
        <div className="nds-m-right_xxx-small" />
        <div className="nds-m-right_xx-small" />
        <div className="nds-m-right_x-small" />
        <div className="nds-m-right_small" />
        <div className="nds-m-right_medium" />
        <div className="nds-m-right_large" />
        <div className="nds-m-right_x-large" />
        <div className="nds-m-right_xx-large" />
      </div>
    )
  },
  {
    id: 'bottom',
    label: 'Bottom',
    element: (
      <div>
        <div className="nds-m-bottom_none" />
        <div className="nds-m-bottom_xxx-small" />
        <div className="nds-m-bottom_xx-small" />
        <div className="nds-m-bottom_x-small" />
        <div className="nds-m-bottom_small" />
        <div className="nds-m-bottom_medium" />
        <div className="nds-m-bottom_large" />
        <div className="nds-m-bottom_x-large" />
        <div className="nds-m-bottom_xx-large" />
      </div>
    )
  },
  {
    id: 'left',
    label: 'Left',
    element: (
      <div>
        <div className="nds-m-left_none" />
        <div className="nds-m-left_xxx-small" />
        <div className="nds-m-left_xx-small" />
        <div className="nds-m-left_x-small" />
        <div className="nds-m-left_small" />
        <div className="nds-m-left_medium" />
        <div className="nds-m-left_large" />
        <div className="nds-m-left_x-large" />
        <div className="nds-m-left_xx-large" />
      </div>
    )
  },
  {
    id: 'vertical',
    label: 'Vertical',
    element: (
      <div>
        <div className="nds-m-vertical_none" />
        <div className="nds-m-vertical_xxx-small" />
        <div className="nds-m-vertical_xx-small" />
        <div className="nds-m-vertical_x-small" />
        <div className="nds-m-vertical_small" />
        <div className="nds-m-vertical_medium" />
        <div className="nds-m-vertical_large" />
        <div className="nds-m-vertical_x-large" />
        <div className="nds-m-vertical_xx-large" />
      </div>
    )
  },
  {
    id: 'horizontal',
    label: 'Horizontal',
    element: (
      <div>
        <div className="nds-m-horizontal_none" />
        <div className="nds-m-horizontal_xxx-small" />
        <div className="nds-m-horizontal_xx-small" />
        <div className="nds-m-horizontal_x-small" />
        <div className="nds-m-horizontal_small" />
        <div className="nds-m-horizontal_medium" />
        <div className="nds-m-horizontal_large" />
        <div className="nds-m-horizontal_x-large" />
        <div className="nds-m-horizontal_xx-large" />
      </div>
    )
  },
  {
    id: 'around',
    label: 'Around',
    element: (
      <div>
        <div className="nds-m-around_none" />
        <div className="nds-m-around_xxx-small" />
        <div className="nds-m-around_xx-small" />
        <div className="nds-m-around_x-small" />
        <div className="nds-m-around_small" />
        <div className="nds-m-around_medium" />
        <div className="nds-m-around_large" />
        <div className="nds-m-around_x-large" />
        <div className="nds-m-around_xx-large" />
      </div>
    )
  }
];
