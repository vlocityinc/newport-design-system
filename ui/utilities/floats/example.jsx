// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';

export const Context = props => (
  <div className="nds-clearfix">{props.children}</div>
);

export default (
  <div>
    <p>I’m floooaaaating</p>
  </div>
);

export let examples = [
  {
    id: 'left',
    label: 'Left',
    element: (
      <div className="nds-clearfix">
        <div className="nds-float_left">
          <p>I’m floooaaaating</p>
        </div>
      </div>
    )
  },
  {
    id: 'right',
    label: 'Right',
    element: (
      <div className="nds-clearfix">
        <div className="nds-float_right">
          <p>I’m floooaaaating</p>
        </div>
      </div>
    )
  },
  {
    id: 'none',
    label: 'None',
    element: (
      <div className="nds-float_none">
        <p>I’m not floooaaaating</p>
      </div>
    )
  },
  {
    id: 'clearfix',
    label: 'Clearfix',
    element: (
      <div className="nds-clearfix">
        <div className="nds-float_left">
          <p>I’m floooaaaating</p>
        </div>
        <div className="nds-float_right">
          <p>I’m floooaaaating</p>
        </div>
      </div>
    )
  }
];
