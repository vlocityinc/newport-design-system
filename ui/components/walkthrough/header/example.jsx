// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import SvgIcon from '../../../shared/svg-icon';
import { ButtonIcon } from '../../button-icons/base/example';
import { Menu, MenuList, MenuItem } from '../../menus/dropdown/example';
import classNames from 'classnames';

/// ///////////////////////////////////////////
// Partial(s)
/// ///////////////////////////////////////////

let Header = props => (
  <div className="nds-trial-header nds-grid">
    <div className="nds-grid">
      <button className="nds-button nds-m-right_small">
        Take the salesforce tour
      </button>
      <div
        className={classNames(
          'nds-grid nds-dropdown-trigger nds-dropdown-trigger_click',
          props.tourMenuOpen ? 'nds-is-open' : null
        )}
      >
        <button className="nds-button" aria-haspopup="true">
          <SvgIcon
            className="nds-button__icon nds-button__icon_left"
            sprite="utility"
            symbol="right"
          />
          Choose your tour
        </button>
        <Menu className="nds-dropdown_inverse nds-dropdown_left">
          <MenuList>
            <MenuItem tabIndex="0" className="nds-is-selected">
              <SvgIcon
                className="nds-icon nds-icon_selected nds-icon_x-small nds-m-right_x-small"
                sprite="utility"
                symbol="check"
              />
              <span className="nds-assistive-text">Completed:</span> Conquer
              Your Cases
            </MenuItem>
            <MenuItem>
              <SvgIcon
                className="nds-icon nds-icon_selected nds-icon_x-small nds-m-right_x-small"
                sprite="utility"
                symbol="check"
              />
              Automate For Speed
            </MenuItem>
            <MenuItem>
              <SvgIcon
                className="nds-icon nds-icon_selected nds-icon_x-small nds-m-right_x-small"
                sprite="utility"
                symbol="check"
              />
              Share Your Knowledge
            </MenuItem>
            <MenuItem>
              <SvgIcon
                className="nds-icon nds-icon_selected nds-icon_x-small nds-m-right_x-small"
                sprite="utility"
                symbol="check"
              />
              Finish it up in a Flash
            </MenuItem>
            <li className="nds-has-divider_top-space" role="separator" />
            <MenuItem>
              <SvgIcon
                className="nds-icon nds-icon_x-small nds-m-right_x-small"
                sprite="utility"
                symbol="upload"
              />
              Import Contacts and Accounts
            </MenuItem>
          </MenuList>
        </Menu>
      </div>
    </div>
    <div className="nds-grid nds-grid_vertical-align-center nds-col_bump-left">
      <span className="nds-box nds-box_xx-small nds-theme_default">30</span>
      <span className="nds-m-horizontal_x-small">Days left in trial</span>
      <a href="javascript:void(0);" className="nds-button nds-button_success">
        Subscribe Now
      </a>
    </div>
  </div>
);

/// ///////////////////////////////////////////
// Export
/// ///////////////////////////////////////////

export default <Header />;

export let states = [
  {
    id: 'menu-open',
    label: 'Tour Menu Open',
    element: (
      <div className="demo-only" style={{ height: '240px' }}>
        <Header tourMenuOpen />
      </div>
    )
  }
];
