// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';

export let examples = [
  {
    id: 'name-value-pair-horizontal',
    label: 'Horizontal',
    element: (
      <dl className="nds-list_horizontal nds-wrap">
        <dt
          className="nds-item_label nds-text-color_weak nds-truncate"
          title="First Label"
        >
          First Label:
        </dt>
        <dd
          className="nds-item_detail nds-truncate"
          title="Description for first label"
        >
          Description for first label
        </dd>
        <dt
          className="nds-item_label nds-text-color_weak nds-truncate"
          title="Second Label"
        >
          Second Label:
        </dt>
        <dd
          className="nds-item_detail nds-truncate"
          title="Description for second label"
        >
          Description for second label
        </dd>
      </dl>
    )
  },
  {
    id: 'name-value-pair-inline',
    label: 'Inline',
    element: (
      <dl className="nds-list_inline">
        <dt
          className="nds-item_label nds-text-color_weak nds-truncate"
          title="First Label"
        >
          First Label:
        </dt>
        <dd
          className="nds-item_detail nds-truncate"
          title="Description for first label"
        >
          Description for first label
        </dd>
        <dt
          className="nds-item_label nds-text-color_weak nds-truncate"
          title="Second Label"
        >
          Second Label:
        </dt>
        <dd
          className="nds-item_detail nds-truncate"
          title="Description for second label"
        >
          Description for second label
        </dd>
      </dl>
    )
  },
  {
    id: 'name-value-pair-stacked',
    label: 'Stacked',
    element: (
      <dl className="nds-list_stacked">
        <dt
          className="nds-item_label nds-text-color_weak nds-truncate"
          title="First Label"
        >
          First Label:
        </dt>
        <dd
          className="nds-item_detail nds-truncate"
          title="Description for first label"
        >
          Description for first label
        </dd>
        <dt
          className="nds-item_label nds-text-color_weak nds-truncate"
          title="Second Label"
        >
          Second Label:
        </dt>
        <dd className="nds-item_detail nds-truncate" title="Second description">
          Second description
        </dd>
      </dl>
    )
  }
];
