// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import { ButtonIcon } from '../../button-icons/base/example';
import classNames from 'classnames';
import SvgIcon from '../../../shared/svg-icon';

/// ///////////////////////////////////////////
// State Constructor(s)
/// ///////////////////////////////////////////

const TreeGrid = props => (
  <table
    className="nds-table nds-table_bordered nds-tree nds-table_tree"
    role="treegrid"
    aria-readonly="true"
  >
    <thead>
      <tr className="nds-text-title_caps">
        <th className="nds-cell-buffer_left" scope="col">
          <div className="nds-grid nds-grid_vertical-align-center">
            <ButtonIcon
              assistiveText="Expand all rows"
              className="nds-button_icon-border-filled nds-button_icon-x-small nds-m-right_x-small nds-shrink-none nds-table_tree__toggle"
              iconClassName="nds-button__icon_small"
              symbol="chevrondown"
              tabIndex="-1"
              title="Expand all rows"
            />
            <div className="nds-truncate" title="Account Name">
              Account Name
            </div>
          </div>
        </th>
        <th scope="col">
          <div className="nds-truncate" title="Employees">
            Employees
          </div>
        </th>
        <th scope="col">
          <div className="nds-truncate" title="Phone Number">
            Phone Number
          </div>
        </th>
        <th scope="col">
          <div className="nds-truncate" title="Account Owner">
            Account Owner
          </div>
        </th>
        <th scope="col">
          <div className="nds-truncate" title="Billing City">
            Billing City
          </div>
        </th>
        <th className="nds-cell-shrink" scope="col">
          <ButtonIcon
            aria-haspopup="true"
            assistiveText="Show More"
            className="nds-button_icon-border-filled nds-button_icon-x-small"
            iconClassName="nds-button__icon_hint nds-button__icon_small"
            symbol="down"
            tabIndex="-1"
            title="Show More"
          />
        </th>
      </tr>
    </thead>
    {props.children}
  </table>
);

const Row = props => (
  <tr
    aria-expanded={props['aria-expanded']}
    aria-level={props['aria-level']}
    aria-posinset={props['aria-posinset']}
    aria-setsize={props['aria-setsize']}
    className="nds-hint-parent"
    tabIndex={props.focusable ? '0' : null}
  >
    <th className="nds-tree__item" data-label="Account Name" scope="row">
      <ButtonIcon
        aria-hidden="true"
        assistiveText={
          props['aria-expanded'] ? (
            `Expand ${props.name}`
          ) : (
            `Collapse ${props.name}`
          )
        }
        className={classNames(
          'nds-button_icon nds-button_icon-x-small nds-m-right_x-small',
          props['aria-expanded'] ? null : 'nds-is-disabled'
        )}
        iconClassName="nds-button__icon_small"
        symbol="chevronright"
        tabIndex="-1"
        title={
          props['aria-expanded'] ? (
            `Collapse ${props.name}`
          ) : (
            `Expand ${props.name}`
          )
        }
      />
      <div className="nds-truncate" title={props.name}>
        <a href="javascript:void(0);" tabIndex="-1">
          {props.name}
        </a>
      </div>
    </th>
    <td data-label="Employees">
      <div className="nds-truncate" title={props.employees}>
        {props.employees}
      </div>
    </td>
    <td data-label="Phone Number">
      <div className="nds-truncate" title={props.phone}>
        {props.phone}
      </div>
    </td>
    <td data-label="Account Owner">
      <div className="nds-truncate" title={props.owner}>
        <a href="javascript:void(0);" tabIndex="-1">
          {props.owner}
        </a>
      </div>
    </td>
    <td data-label="Billing City">
      <div className="nds-truncate" title={props.city}>
        {props.city}
      </div>
    </td>
    <td className="nds-cell-shrink">
      <ButtonIcon
        aria-haspopup="true"
        assistiveText={`More actions for ${props.name}`}
        className="nds-button_icon-border-filled nds-button_icon-x-small"
        iconClassName="nds-button__icon_hint nds-button__icon_small"
        symbol="down"
        tabIndex="-1"
        title={`More actions for ${props.name}`}
      />
    </td>
  </tr>
);

const Default = props => (
  <tbody>
    <Row
      aria-level="1"
      aria-posinset="1"
      aria-setsize="4"
      name="Rewis Inc"
      employees="3,100"
      phone="837-555-1212"
      owner="Jane Doe"
      city="Phoenix, AZ"
      focusable
    />
    <Row
      aria-expanded={props.isExpanded ? 'true' : 'false'}
      aria-level="1"
      aria-posinset="2"
      aria-setsize="4"
      name="Acme Corporation"
      employees="10,000"
      phone="837-555-1212"
      owner="John Doe"
      city="San Francisco, CA"
    />
    {props.additionalItem}
    <Row
      aria-expanded="false"
      aria-level="1"
      aria-posinset="3"
      aria-setsize="4"
      name="Rohde Enterprises"
      employees="6,000"
      phone="837-555-1212"
      owner="John Doe"
      city="New York, NY"
    />
    <Row
      aria-level="1"
      aria-posinset="4"
      aria-setsize="4"
      name="Cheese Corp"
      employees="1,234"
      phone="837-555-1212"
      owner="Jane Doe"
      city="Paris, France"
    />
  </tbody>
);

const Expanded = props => (
  <Row
    aria-level="2"
    aria-posinset="1"
    aria-setsize="1"
    name="Acme Corporation (Oakland)"
    employees="745"
    phone="837-555-1212"
    owner="John Doe"
    city="New York, NY"
  />
);

const DeepNesting = props => (
  <tbody>
    <Row
      aria-level="1"
      aria-posinset="1"
      aria-setsize="4"
      name="Rewis Inc"
      employees="3,100"
      phone="837-555-1212"
      owner="Jane Doe"
      city="Phoenix, AZ"
      focusable
    />
    <Row
      aria-expanded="true"
      aria-level="1"
      aria-posinset="2"
      aria-setsize="4"
      name="Acme Corporation"
      employees="10,000"
      phone="837-555-1212"
      owner="John Doe"
      city="San Francisco, CA"
    />
    <Row
      aria-expanded="true"
      aria-level="2"
      aria-posinset="1"
      aria-setsize="2"
      name="Acme Corporation (Bay Area)"
      employees="3,000"
      phone="837-555-1212"
      owner="John Doe"
      city="New York, NY"
    />
    <Row
      aria-level="3"
      aria-posinset="1"
      aria-setsize="2"
      name="Acme Corporation (Oakland)"
      employees="745"
      phone="837-555-1212"
      owner="John Doe"
      city="New York, NY"
    />
    <Row
      aria-level="3"
      aria-posinset="2"
      aria-setsize="2"
      name="Acme Corporation (San Francisco)"
      employees="578"
      phone="837-555-1212"
      owner="Jane Doe"
      city="Los Angeles, CA"
    />
    <Row
      aria-expanded="true"
      aria-level="2"
      aria-posinset="2"
      aria-setsize="2"
      name="Acme Corporation (East)"
      employees="430"
      phone="837-555-1212"
      owner="John Doe"
      city="San Francisco, CA"
    />
    <Row
      aria-level="3"
      aria-posinset="1"
      aria-setsize="2"
      name="Acme Corporation (NY)"
      employees="1,210"
      phone="837-555-1212"
      owner="Jane Doe"
      city="New York, NY"
    />
    <Row
      aria-expanded="true"
      aria-level="3"
      aria-posinset="2"
      aria-setsize="2"
      name="Acme Corporation (VA)"
      employees="410"
      phone="837-555-1212"
      owner="John Doe"
      city="New York, NY"
    />
    <Row
      aria-expanded="true"
      aria-level="4"
      aria-posinset="1"
      aria-setsize="1"
      name="Allied Technologies"
      employees="390"
      phone="837-555-1212"
      owner="Jane Doe"
      city="Los Angeles, CA"
    />
    <Row
      aria-level="5"
      aria-posinset="1"
      aria-setsize="1"
      name="Allied Technologies (UV)"
      employees="270"
      phone="837-555-1212"
      owner="John Doe"
      city="San Francisco, CA"
    />
    <Row
      aria-expanded="true"
      aria-level="1"
      aria-posinset="3"
      aria-setsize="4"
      name="Rohde Enterprises"
      employees="6,000"
      phone="837-555-1212"
      owner="John Doe"
      city="New York, NY"
    />
    <Row
      aria-level="2"
      aria-posinset="1"
      aria-setsize="1"
      name="Rohde Enterprises (UCA)"
      employees="2,540"
      phone="837-555-1212"
      owner="John Doe"
      city="New York, NY"
    />
    <Row
      aria-expanded="true"
      aria-level="1"
      aria-posinset="4"
      aria-setsize="4"
      name="Tech Labs"
      employees="1,856"
      phone="837-555-1212"
      owner="John Doe"
      city="New York, NY"
    />
    <Row
      aria-level="2"
      aria-posinset="1"
      aria-setsize="1"
      name="Opportunity Resources Inc"
      employees="1,934"
      phone="837-555-1212"
      owner="John Doe"
      city="Los Angeles, CA"
    />
  </tbody>
);

/// ///////////////////////////////////////////
// Export
/// ///////////////////////////////////////////

export default (
  <TreeGrid>
    <Default />
  </TreeGrid>
);

export let states = [
  {
    id: 'expanded',
    label: 'Expanded',
    element: (
      <TreeGrid>
        <Default isExpanded additionalItem={<Expanded />} />
      </TreeGrid>
    )
  },
  {
    id: 'deep-nesting',
    label: 'Deeply nested branches',
    element: (
      <TreeGrid>
        <DeepNesting />
      </TreeGrid>
    )
  }
];
