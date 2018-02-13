// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import _ from '../../../shared/helpers';

let Score = props => (
  <span
    {...props}
    className="nds-icon-score"
    title="Description of the icon when needed"
  >
    <svg
      viewBox="0 0 5 5"
      className="nds-icon-score__positive"
      aria-hidden="true"
    >
      <circle cx="50%" cy="50%" r="1.875" />
    </svg>
    <svg
      viewBox="0 0 5 5"
      className="nds-icon-score__negative"
      aria-hidden="true"
    >
      <circle cx="50%" cy="50%" r="1.875" />
    </svg>
    <span className="nds-assistive-text">Text alternative when needed</span>
  </span>
);

/* -----------------------------------------------------------------------------
    Exports
----------------------------------------------------------------------------- */

// Default
export default <Score data-nds-state="positive" />;

// States
export let states = [
  {
    id: 'positive',
    label: 'Positive',
    element: <Score data-nds-state="positive" />
  },
  {
    id: 'negative',
    label: 'Negative',
    element: <Score data-nds-state="negative" />
  }
];
