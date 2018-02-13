// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import { ButtonIcon } from '../../button-icons/base/example';
import SvgIcon from '../../../shared/svg-icon';
import classNames from 'classnames';

/// ////////////////////////////////////////
// Partial(s)
/// ////////////////////////////////////////

let Table = props => (
  <table
    className={classNames('nds-table nds-table_bordered', props.className)}
  >
    {props.children}
  </table>
);

let Checkbox = props => (
  <label className="nds-checkbox">
    <input
      type="checkbox"
      name="options"
      disabled={props.disabled}
      defaultChecked={props.checked}
    />
    <span className="nds-checkbox_faux" />
    <span className="nds-assistive-text">{props.label}</span>
  </label>
);

let HeadRowData = props => (
  <tr className="nds-text-title_caps">
    <th className="nds-cell-shrink" scope="col">
      <Checkbox label="Select All" checked={props.checked} />
    </th>
    <th scope="col">
      <div className="nds-truncate" title="Close Date">
        Opportunity Name
        <ButtonIcon
          className="nds-button_icon"
          iconClassName="nds-button__icon_small"
          symbol="arrowdown"
          assistiveText="Sort"
          title="Sort"
        />
      </div>
    </th>
    <th scope="col">
      <div className="nds-truncate" title="Account Name">
        Account Name
        <ButtonIcon
          className="nds-button_icon"
          iconClassName="nds-button__icon_small"
          symbol="arrowdown"
          assistiveText="Sort"
          title="Sort"
        />
      </div>
    </th>
    <th scope="col">
      <div className="nds-truncate" title="Close Date">
        Close Date
        <ButtonIcon
          className="nds-button_icon"
          iconClassName="nds-button__icon_small"
          symbol="arrowdown"
          assistiveText="Sort"
          title="Sort"
        />
      </div>
    </th>
    <th scope="col">
      <div className="nds-truncate" title="Stage">
        Stage
        <ButtonIcon
          className="nds-button_icon"
          iconClassName="nds-button__icon_small"
          symbol="arrowdown"
          assistiveText="Sort"
          title="Sort"
        />
      </div>
    </th>
    <th scope="col">
      <div className="nds-truncate" title="Confidence">
        Confidence
        <ButtonIcon
          className="nds-button_icon"
          iconClassName="nds-button__icon_small"
          symbol="arrowdown"
          assistiveText="Sort"
          title="Sort"
        />
      </div>
    </th>
    <th scope="col">
      <div className="nds-truncate" title="Amount">
        Amount
        <ButtonIcon
          className="nds-button_icon"
          iconClassName="nds-button__icon_small"
          symbol="arrowdown"
          assistiveText="Sort"
          title="Sort"
        />
      </div>
    </th>
    <th scope="col">
      <div className="nds-truncate" title="Contact">
        Contact
        <ButtonIcon
          className="nds-button_icon"
          iconClassName="nds-button__icon_small"
          symbol="arrowdown"
          assistiveText="Sort"
          title="Sort"
        />
      </div>
    </th>
    <th className="nds-cell-shrink" scope="col" />
  </tr>
);

let RowData = props => (
  <tr className="nds-hint-parent">
    <td className="nds-cell-shrink" data-label="Select Row">
      <Checkbox label="Select Row" checked={props.checked} />
    </td>
    <th scope="row" data-label="Opportunity Name">
      <div className="nds-truncate" title={props.title}>
        {props.title}
      </div>
    </th>
    <td data-label="Account Name">
      <div className="nds-truncate" title="Cloudhub">
        Cloudhub
      </div>
    </td>
    <td data-label="Close Date">
      <div className="nds-truncate" title="4/14/2015">
        4/14/2015
      </div>
    </td>
    <td data-label="Prospecting">
      <div className="nds-truncate" title="Prospecting">
        Prospecting
      </div>
    </td>
    <td data-label="Confidence">
      <div className="nds-truncate" title="20%">
        20%
      </div>
    </td>
    <td data-label="Amount">
      <div className="nds-truncate" title="$25k">
        $25k
      </div>
    </td>
    <td data-label="Contact">
      <div className="nds-truncate" title="jrogers@cloudhub.com">
        <a href="javascript:void(0);">jrogers@cloudhub.com</a>
      </div>
    </td>
    <td className="nds-cell-shrink" data-label="Actions">
      <ButtonIcon
        className="nds-button_icon-border-filled nds-button_icon-x-small"
        iconClassName="nds-button__icon_hint nds-button__icon_small"
        symbol="down"
        assistiveText="Show More"
        title="Show More"
      />
    </td>
  </tr>
);

/// ///////////////////////////////////////////
// State Constructor(s)
/// ///////////////////////////////////////////

let Overflow = props => (
  <div className="nds-scrollable_x">
    <Table>
      <thead>
        <HeadRowData />
      </thead>
      <tbody>
        <RowData title="Cloudhub" />
        <RowData title="Cloudhub + Anypoint Connectors" />
      </tbody>
    </Table>
  </div>
);

let Stacked = props => (
  <Table className="nds-max-medium-table_stacked">
    <thead>
      <HeadRowData />
    </thead>
    <tbody>
      <RowData title="Cloudhub" />
      <RowData title="Cloudhub + Anypoint Connectors" />
    </tbody>
  </Table>
);

let Horizontal = props => (
  <Table className="nds-max-medium-table_stacked-horizontal">
    <thead>
      <HeadRowData />
    </thead>
    <tbody>
      <RowData title="Cloudhub" />
      <RowData title="Cloudhub + Anypoint Connectors" />
    </tbody>
  </Table>
);

/// ///////////////////////////////////////////
// Export
/// ///////////////////////////////////////////

export default <Horizontal />;

export let states = [
  {
    id: 'data-table-responsive-horizontal',
    label: 'Stacked with Horizontal Cells',
    element: <Horizontal />
  },
  {
    id: 'data-table-responsive-stacked',
    label: 'Stacked',
    element: <Stacked />
  }
  // , @TODO - wait for S1 to fix scrolling
  // {
  //   id: 'data-table-responsive-overflow',
  //   label: 'Overflow',
  //   element: <Overflow />
  // }
];
