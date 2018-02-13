// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import classNames from 'classnames';

/// ////////////////////////////////////////
// Partial(s)
/// ////////////////////////////////////////

let Table = props => (
  <table
    className={classNames(
      'nds-table nds-table_bordered nds-table_cell-buffer',
      props.className
    )}
  >
    {props.children}
  </table>
);

let HeadRowData = props => (
  <tr className="nds-text-title_caps">
    <th scope="col">
      <div className="nds-truncate" title="Opportunity Name">
        Opportunity Name
      </div>
    </th>
    <th scope="col">
      <div className="nds-truncate" title="Account Name">
        Account Name
      </div>
    </th>
    <th scope="col">
      <div className="nds-truncate" title="Close Date">
        Close Date
      </div>
    </th>
    <th scope="col">
      <div className="nds-truncate" title="Stage">
        Stage
      </div>
    </th>
    <th scope="col">
      <div className="nds-truncate" title="Confidence">
        Confidence
      </div>
    </th>
    <th scope="col">
      <div className="nds-truncate" title="Amount">
        Amount
      </div>
    </th>
    <th scope="col">
      <div className="nds-truncate" title="Contact">
        Contact
      </div>
    </th>
  </tr>
);

let RowData = props => (
  <tr className={props.className}>
    <th scope="row" data-label="Opportunity Name">
      <div className="nds-truncate" title={props.title}>
        <a href="javascript:void(0);">{props.title}</a>
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
  </tr>
);

/// ///////////////////////////////////////////
// Export
/// ///////////////////////////////////////////

export default (
  <Table>
    <thead>
      <HeadRowData />
    </thead>
    <tbody>
      <RowData title="Cloudhub" />
      <RowData title="Cloudhub + Anypoint Connectors" />
    </tbody>
  </Table>
);

export let states = [
  {
    id: 'data-table-striped-rows',
    label: 'With striped rows',
    element: (
      <Table className="nds-table_striped">
        <thead>
          <HeadRowData />
        </thead>
        <tbody>
          <RowData title="Cloudhub" />
          <RowData title="Cloudhub + Anypoint Connectors" />
          <RowData title="Cloudhub" />
        </tbody>
      </Table>
    )
  },
  {
    id: 'data-table-no-hover',
    label: 'With no row hovers',
    element: (
      <Table className="nds-no-row-hover">
        <thead>
          <HeadRowData />
        </thead>
        <tbody>
          <RowData title="Cloudhub" />
          <RowData title="Cloudhub + Anypoint Connectors" />
        </tbody>
      </Table>
    )
  },
  {
    id: 'data-table-vertical-borders',
    label: 'With vertical borders',
    element: (
      <Table className="nds-table_col-bordered">
        <thead>
          <HeadRowData />
        </thead>
        <tbody>
          <RowData title="Cloudhub" />
          <RowData title="Cloudhub + Anypoint Connectors" />
        </tbody>
      </Table>
    )
  }
];
