// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import SvgIcon from '../../../shared/svg-icon';
import { Avatar } from '../base/example';
import classNames from 'classnames';

/// ///////////////////////////////////////////
// Export
/// ///////////////////////////////////////////

export default (
  <Avatar>
    <abbr
      className="nds-avatar__initials nds-icon-standard-account"
      title="company name"
    >
      Ac
    </abbr>
  </Avatar>
);

export let states = [
  {
    id: 'avatar-square-initials',
    label: 'Square Initials',
    element: (
      <Avatar className="nds-avatar_medium">
        <abbr
          className="nds-avatar__initials nds-icon-standard-account"
          title="company name"
        >
          Ac
        </abbr>
      </Avatar>
    )
  },
  {
    id: 'avatar-circle-initials',
    label: 'Circle Initials',
    element: (
      <Avatar className="nds-avatar_circle nds-avatar_medium">
        <abbr
          className="nds-avatar__initials nds-icon-standard-user"
          title="person name"
        >
          AB
        </abbr>
      </Avatar>
    )
  },
  {
    id: 'size-x-small',
    label: 'Size - X Small',
    element: (
      <Avatar className="nds-avatar_x-small">
        <abbr
          className="nds-avatar__initials nds-icon-standard-account"
          title="company name"
        >
          Ac
        </abbr>
      </Avatar>
    )
  },
  {
    id: 'size-small',
    label: 'Size - Small',
    element: (
      <Avatar className="nds-avatar_small">
        <abbr
          className="nds-avatar__initials nds-icon-standard-account"
          title="company name"
        >
          Ac
        </abbr>
      </Avatar>
    )
  },
  {
    id: 'size-medium',
    label: 'Size - Medium',
    element: (
      <Avatar className="nds-avatar_medium">
        <abbr
          className="nds-avatar__initials nds-icon-standard-account"
          title="company name"
        >
          Ac
        </abbr>
      </Avatar>
    )
  },
  {
    id: 'size-large',
    label: 'Size - Large',
    element: (
      <Avatar className="nds-avatar_large">
        <abbr
          className="nds-avatar__initials nds-icon-standard-account"
          title="company name"
        >
          Ac
        </abbr>
      </Avatar>
    )
  }
];
