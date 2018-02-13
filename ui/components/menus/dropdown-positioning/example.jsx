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

const settingsIcon = (
  <ButtonIcon
    className="nds-button_icon-container"
    symbol="settings"
    assistiveText="Settings"
    title="Settings"
    aria-haspopup="true"
  />
);

/// ///////////////////////////////////////////
// State Constructor(s)
/// ///////////////////////////////////////////

let TopLeft = props => (
  <div className="demo-only" style={{ height: '185px', paddingLeft: '2rem' }}>
    <Trigger className="nds-is-open" triggerIcon={settingsIcon}>
      <Menu className="nds-dropdown_left nds-nubbin_top-left">
        <MenuList>
          <MenuItem tabIndex="0">Menu Item One</MenuItem>
          <MenuItem>Menu Item Two</MenuItem>
          <MenuItem>Menu Item Three</MenuItem>
        </MenuList>
      </Menu>
    </Trigger>
  </div>
);

let Top = props => (
  <div className="demo-only" style={{ height: '185px', textAlign: 'center' }}>
    <Trigger className="nds-is-open" triggerIcon={settingsIcon}>
      <Menu className="nds-nubbin_top">
        <MenuList>
          <MenuItem tabIndex="0">Menu Item One</MenuItem>
          <MenuItem>Menu Item Two</MenuItem>
          <MenuItem>Menu Item Three</MenuItem>
        </MenuList>
      </Menu>
    </Trigger>
  </div>
);

let TopRight = props => (
  <div
    className="demo-only"
    style={{ height: '185px', textAlign: 'right', paddingRight: '2rem' }}
  >
    <Trigger className="nds-is-open" triggerIcon={settingsIcon}>
      <Menu className="nds-dropdown_right nds-nubbin_top-right">
        <MenuList>
          <MenuItem tabIndex="0">Menu Item One</MenuItem>
          <MenuItem>Menu Item Two</MenuItem>
          <MenuItem>Menu Item Three</MenuItem>
        </MenuList>
      </Menu>
    </Trigger>
  </div>
);

let BottomLeft = props => (
  <div
    className="demo-only nds-grid nds-grid_vertical-align-end"
    style={{ height: '185px', paddingLeft: '2rem' }}
  >
    <Trigger className="nds-is-open" triggerIcon={settingsIcon}>
      <Menu className="nds-dropdown_bottom nds-dropdown_left nds-nubbin_bottom-left">
        <MenuList>
          <MenuItem tabIndex="0">Menu Item One</MenuItem>
          <MenuItem>Menu Item Two</MenuItem>
          <MenuItem>Menu Item Three</MenuItem>
        </MenuList>
      </Menu>
    </Trigger>
  </div>
);

let Bottom = props => (
  <div
    className="demo-only nds-grid nds-grid_vertical-align-end nds-grid_align-center"
    style={{ height: '185px' }}
  >
    <Trigger className="nds-is-open" triggerIcon={settingsIcon}>
      <Menu className="nds-dropdown_bottom nds-nubbin_bottom">
        <MenuList>
          <MenuItem tabIndex="0">Menu Item One</MenuItem>
          <MenuItem>Menu Item Two</MenuItem>
          <MenuItem>Menu Item Three</MenuItem>
        </MenuList>
      </Menu>
    </Trigger>
  </div>
);

let BottomRight = props => (
  <div
    className="demo-only nds-grid nds-grid_vertical-align-end nds-grid_align-end"
    style={{ height: '185px', paddingRight: '2rem' }}
  >
    <Trigger className="nds-is-open" triggerIcon={settingsIcon}>
      <Menu className="nds-dropdown_bottom nds-dropdown_right nds-nubbin_bottom-right">
        <MenuList>
          <MenuItem tabIndex="0">Menu Item One</MenuItem>
          <MenuItem>Menu Item Two</MenuItem>
          <MenuItem>Menu Item Three</MenuItem>
        </MenuList>
      </Menu>
    </Trigger>
  </div>
);

/// ///////////////////////////////////////////
// Export
/// ///////////////////////////////////////////

export let states = [
  {
    id: 'dropdown-menu-nubbin-top-left',
    label: 'Top Left',
    element: <TopLeft />
  },
  {
    id: 'dropdown-menu-nubbin-top',
    label: 'Top',
    element: <Top />
  },
  {
    id: 'dropdown-menu-nubbin-top-right',
    label: 'Top Right',
    element: <TopRight />
  },
  {
    id: 'dropdown-menu-nubbin-bottom-left',
    label: 'Bottom Left',
    element: <BottomLeft />
  },
  {
    id: 'dropdown-menu-nubbin-bottom',
    label: 'Bottom',
    element: <Bottom />
  },
  {
    id: 'dropdown-menu-nubbin-bottom-right',
    label: 'Bottom Right',
    element: <BottomRight />
  }
];
