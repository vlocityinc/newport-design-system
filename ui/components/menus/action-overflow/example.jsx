// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import { ButtonIcon } from '../../button-icons/base/example';
import { Trigger } from '../dropdown/example';
import { Menu } from '../dropdown/example';
import { MenuList } from '../dropdown/example';
import { MenuItem } from '../dropdown/example';

/// ////////////////////////////////////////
// Partial(s)
/// ////////////////////////////////////////

const moreIcon = (
  <ButtonIcon
    className="nds-button_icon-border-filled nds-button_icon-x-small"
    sprite="utility"
    symbol="down"
    assistiveText="Show More"
    aria-haspopup="true"
    title="Show More"
  />
);

/// ///////////////////////////////////////////
// Export
/// ///////////////////////////////////////////

export default (
  <div className="demo-only" style={{ height: '165px' }}>
    <Trigger className="nds-is-open" triggerIcon={moreIcon}>
      <Menu className="nds-dropdown_left nds-dropdown_actions">
        <MenuList>
          <MenuItem tabIndex="0">Action One</MenuItem>
          <MenuItem>Action Two</MenuItem>
          <MenuItem>Action Three</MenuItem>
        </MenuList>
      </Menu>
    </Trigger>
  </div>
);
