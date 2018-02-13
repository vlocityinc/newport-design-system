// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import SvgIcon from '../../../shared/svg-icon';
import { Menu, MenuList, MenuItem } from '../../menus/dropdown/example';
import { ButtonIcon } from '../../button-icons/base/example';
import { WaffleIcon } from '../../dynamic-icons/waffle/example';
import classNames from 'classnames';
import _ from '../../../shared/helpers';

/// ///////////////////////////////////////////
// Partial(s)
/// ///////////////////////////////////////////

// Context Item Dropdown
const contextDropdown = (
  <Menu className="nds-dropdown_right">
    <MenuList>
      <MenuItem>
        <SvgIcon
          className="nds-icon nds-icon_x-small nds-icon-text-default nds-m-right_x-small"
          sprite="utility"
          symbol="add"
        />
        Main action
      </MenuItem>
      <li
        className="nds-dropdown__header nds-has-divider_top-space"
        role="separator"
      >
        <span className="nds-text-title_caps">Menu header</span>
      </li>
      <MenuItem>Menu Item One</MenuItem>
      <MenuItem>Menu Item Two</MenuItem>
      <MenuItem>Menu Item Three</MenuItem>
    </MenuList>
  </Menu>
);

/// ///////////////////////////////////////////
// State Constructor(s)
/// ///////////////////////////////////////////

export let ContextBar = props => (
  <div className={classNames('nds-context-bar', props.className)}>
    {/* Primary Section */}
    <div className="nds-context-bar__primary">
      {/* App Switcher */}
      <div className="nds-context-bar__item nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-no-hover">
        <div className="nds-context-bar__icon-action">
          <WaffleIcon className="nds-context-bar__button" />
        </div>
        {/* App Name */}
        <span className="nds-context-bar__label-action nds-context-bar__app-name">
          <span className="nds-truncate" title={props.appName || 'App Name'}>
            {props.stencil ? (
              '🁢🁢🁢🁢🁢🁢🁢🁢🁢🁢🁢🁢🁢'
            ) : (
              props.appName || 'App Name'
            )}
          </span>
        </span>
      </div>
    </div>
    {/* End Primary */}

    {/* Secondary Section */}
    <nav className="nds-context-bar__secondary" role="navigation">
      <ul className="nds-grid">
        <li className="nds-context-bar__item">
          <a
            href="javascript:void(0);"
            className="nds-context-bar__label-action"
            title="Home"
          >
            <span className="nds-truncate" title="Home">
              {props.stencil ? '🁢🁢🁢🁢🁢🁢🁢🁢🁢🁢🁢🁢🁢' : 'Home'}
            </span>
          </a>
        </li>
        <li className="nds-context-bar__item nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_hover">
          <a
            href="javascript:void(0);"
            className="nds-context-bar__label-action"
            title="Menu Item"
          >
            <span className="nds-truncate" title="Menu Item">
              {props.stencil ? '🁢🁢🁢🁢🁢🁢🁢🁢🁢🁢🁢🁢🁢' : 'Menu Item'}
            </span>
          </a>
          <div className="nds-context-bar__icon-action nds-p-left_none">
            <ButtonIcon
              className="nds-button_icon nds-context-bar__button"
              symbol="chevrondown"
              aria-haspopup="true"
              assistiveText="Open menu item submenu"
              title="Open menu item submenu"
            />
          </div>
          {!props.hideDropdown ? contextDropdown : null}
        </li>
        {!props.children ? (
          _.times(3, i => (
            <li className="nds-context-bar__item" key={i}>
              <a
                href="javascript:void(0);"
                className="nds-context-bar__label-action"
                title="Menu Item"
              >
                <span className="nds-truncate" title="Menu Item">
                  {props.stencil ? '🁢🁢🁢🁢🁢🁢🁢🁢🁢🁢🁢🁢🁢' : 'Menu Item'}
                </span>
              </a>
            </li>
          ))
        ) : (
          props.children
        )}
      </ul>
    </nav>
    {/* End Secondary Section */}

    {/* Tertiary Section Goes Here */}
  </div>
);

/// ///////////////////////////////////////////
// Export
/// ///////////////////////////////////////////

export const Context = props => (
  <div style={{ height: '16rem' }}>{props.children}</div>
);

export default <ContextBar itemActive />;

export let states = [
  {
    id: 'item-active',
    label: 'Item Active',
    element: (
      <ContextBar>
        <li className="nds-context-bar__item nds-is-active">
          <a
            href="javascript:void(0);"
            className="nds-context-bar__label-action"
            title={'Menu Item'}
          >
            <span className="nds-assistive-text">Current Page:</span>
            <span className="nds-truncate" title="Menu Item">
              Menu Item
            </span>
          </a>
        </li>
        {_.times(2, i => (
          <li className="nds-context-bar__item" key={i}>
            <a
              href="javascript:void(0);"
              className="nds-context-bar__label-action"
              title={'Menu Item ' + i}
            >
              <span className="nds-truncate" title="Menu Item">
                Menu Item
              </span>
            </a>
          </li>
        ))}
      </ContextBar>
    )
  }
];
