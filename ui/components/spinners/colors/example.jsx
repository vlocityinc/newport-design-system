// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import classNames from 'classnames';
import { SpinnerContainer } from '../base/example';
import { Spinner } from '../base/example';

/// ////////////////////////////////////////
// Partial(s)
/// ////////////////////////////////////////

let Demo = props => (
  <div
    className={classNames('demo-only', props.className)}
    style={{ height: '9rem' }}
  >
    {props.children}
  </div>
);

/// ///////////////////////////////////////////
// Export
/// ///////////////////////////////////////////

export let states = [
  {
    id: 'default',
    label: 'Default',
    element: (
      <Demo>
        <SpinnerContainer>
          <Spinner className="nds-spinner_medium" />
        </SpinnerContainer>
      </Demo>
    )
  },
  {
    id: 'brand',
    label: 'Brand',
    element: (
      <Demo>
        <SpinnerContainer>
          <Spinner className="nds-spinner_medium nds-spinner_brand" />
        </SpinnerContainer>
      </Demo>
    )
  },
  {
    id: 'inverse',
    label: 'Inverse',
    element: (
      <Demo className="demo--inverse">
        <SpinnerContainer>
          <Spinner className="nds-spinner_medium nds-spinner_inverse" />
        </SpinnerContainer>
      </Demo>
    )
  }
];
