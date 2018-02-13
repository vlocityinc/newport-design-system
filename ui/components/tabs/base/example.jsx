// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import Tabs from '../index.react';
import SvgIcon from '../../../shared/svg-icon';
import { Menu, MenuList, MenuItem } from '../../menus/dropdown/example';
import { Default as ScopedTabs } from '../../scoped-tabs/base/example';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter
} from '../../cards/base/example';
import classNames from 'classnames';

/// ///////////////////////////////////////////
// State Constructor(s)
/// ///////////////////////////////////////////

let Default = props => (
  <Tabs className={props.className} selectedIndex={props.selectedIndex || 0}>
    <Tabs.Item title="Item One" id="tab-default-1">
      {props.itemOneContent || 'Item One Content'}
    </Tabs.Item>
    <Tabs.Item title="Item Two" id="tab-default-2">
      Item Two Content
    </Tabs.Item>
    <Tabs.Item title="Item Three" id="tab-default-3">
      Item Three Content
    </Tabs.Item>
  </Tabs>
);

let Overflowing = props => (
  <div className="demo-only" style={{ height: '10rem' }}>
    <Tabs>
      <Tabs.Item title="Item One" id="tab-default-1">
        Item One Content
      </Tabs.Item>
      <Tabs.Item title="Item Two" id="tab-default-2">
        Item Two Content
      </Tabs.Item>
      <Tabs.Item title="Item Three" id="tab-default-3">
        Item Three Content
      </Tabs.Item>
      <Tabs.Item title="Item Four" id="tab-default-4">
        <h2>Item Four Content</h2>
      </Tabs.Item>
      <Tabs.Item title="Item Five" id="tab-default-5">
        <h2>Item Five Content</h2>
      </Tabs.Item>
      <Tabs.Item title="Item Six" id="tab-default-6">
        <h2>Item Six Content</h2>
      </Tabs.Item>
      <Tabs.Item title="Item Seven" id="tab-default-7">
        <h2>Item Seven Content</h2>
      </Tabs.Item>
      <Tabs.ItemOverflow
        title="More tabs"
        className="nds-dropdown-trigger nds-dropdown-trigger_click nds-is-open nds-tabs_default__item"
      >
        <a
          className="nds-button nds-tabs_default__link"
          href="javascript:void(0);"
          aria-haspopup="true"
        >
          <span className="nds-truncate" title="More tabs">
            More <span className="nds-assistive-text">tabs</span>
          </span>
          <SvgIcon
            className="nds-button__icon nds-button__icon_x-small"
            sprite="utility"
            symbol="down"
          />
        </a>
        <Menu className="nds-dropdown_right">
          <MenuList className="nds-dropdown_length-with-icon-10">
            <MenuItem>
              <SvgIcon
                className="nds-icon nds-icon_small nds-icon-standard-account nds-m-right_small"
                sprite="standard"
                symbol="account"
              />
              Accounts
            </MenuItem>
            <MenuItem>
              <SvgIcon
                className="nds-icon nds-icon_small nds-icon-standard-approval nds-m-right_small"
                sprite="standard"
                symbol="approval"
              />
              Approvals
            </MenuItem>
            <MenuItem>
              <SvgIcon
                className="nds-icon nds-icon_small nds-icon-standard-lead nds-m-right_small"
                sprite="standard"
                symbol="lead"
              />
              Lead
            </MenuItem>
          </MenuList>
        </Menu>
      </Tabs.ItemOverflow>
    </Tabs>
  </div>
);

/// ///////////////////////////////////////////
// Export
/// ///////////////////////////////////////////

export default <Default />;

export let states = [
  {
    id: 'selected',
    label: 'Item Two Selected',
    element: <Default selectedIndex={1} />
  }
];

export let examples = [
  {
    id: 'overflow',
    label: 'Overflowing items',
    element: <Overflowing />
  },
  {
    id: 'nested',
    label: 'With Nested Scoped Tabs',
    element: <Default itemOneContent={<ScopedTabs />} />
  },
  {
    id: 'card-look',
    label: 'Tab Card-look',
    element: (
      <Tabs className="nds-tabs_card" selectedIndex={0}>
        <Tabs.Item title="Item One" id="tab-default-1">
          <Card>
            <CardHeader symbol="contact" actions>
              <span className="nds-text-heading_small">Card Header</span>
            </CardHeader>
            <CardBody className="nds-card__body_inner">
              Card Body (custom goes in here)
            </CardBody>
            <CardFooter>Card Footer</CardFooter>
          </Card>
          <Card>
            <CardHeader symbol="contact" actions>
              <span className="nds-text-heading_small">Card Header</span>
            </CardHeader>
            <CardBody className="nds-card__body_inner">
              Card Body (custom goes in here)
            </CardBody>
            <CardFooter>Card Footer</CardFooter>
          </Card>
        </Tabs.Item>
        <Tabs.Item title="Item Two" id="tab-default-2">
          Item Two Content
        </Tabs.Item>
        <Tabs.Item title="Item Three" id="tab-default-3">
          Item Three Content
        </Tabs.Item>
      </Tabs>
    )
  }
];
