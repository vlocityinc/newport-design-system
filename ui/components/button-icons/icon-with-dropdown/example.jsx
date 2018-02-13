// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import { ButtonIcon } from '../base/example';

/// ////////////////////////////////////////
// Export
/// ////////////////////////////////////////

export default (
  <ButtonIcon
    hasDropdown
    className="nds-button_icon-more"
    assistiveText="More options"
    title="More Options"
  />
);

export let states = [
  {
    id: 'button-icon-container-with-dropdown',
    label: 'Default - Container Only',
    element: (
      <ButtonIcon
        hasDropdown
        className="nds-button_icon-container-more"
        assistiveText="More options"
        title="More Options"
      />
    )
  },
  {
    id: 'button-icon-with-dropdown-filled',
    label: 'Filled',
    element: (
      <ButtonIcon
        hasDropdown
        className="nds-button_icon-more nds-button_icon-more-filled"
        assistiveText="More options"
        title="More Options"
      />
    )
  },
  {
    id: 'button-icon-with-dropdown-inverse',
    label: 'Inverse',
    element: (
      <div style={{ padding: '0.5rem', backgroundColor: '#16325C' }}>
        <ButtonIcon
          hasDropdown
          className="nds-button_icon-inverse nds-button_icon-more"
          assistiveText="More options"
          title="More Options"
        />
      </div>
    )
  },
  {
    id: 'button-icon-container-with-dropdown-inverse',
    label: 'Inverse - Container Only',
    element: (
      <div style={{ padding: '0.5rem', backgroundColor: '#16325C' }}>
        <ButtonIcon
          hasDropdown
          className="nds-button_icon-inverse nds-button_icon-container-more"
          assistiveText="More options"
          title="More Options"
        />
      </div>
    )
  }
];
