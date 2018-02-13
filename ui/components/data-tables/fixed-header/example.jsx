// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import { ButtonIcon } from '../../button-icons/base/example';
import { Table, RowData } from '../inline-edit/example';
import SvgIcon from '../../../shared/svg-icon';
import classNames from 'classnames';
import _ from '../../../shared/helpers';

const columns = [
  'Name',
  'Account Name',
  'Close Date',
  'Stage',
  'Confidence',
  'Amount',
  'Contact'
];

const rows = [
  {
    recordName: 'Acme - 1,200 Widgets',
    accountName: 'Acme',
    closeDate: '4/10/15',
    stage: 'Value Proposition',
    confidence: '30%',
    amount: '$25,000,000',
    contact: 'jrogers@acme.com'
  },
  {
    recordName: 'Acme - 200 Widgets',
    accountName: 'Acme',
    closeDate: '1/31/15',
    stage: 'Prospecting',
    confidence: '60%',
    amount: '$5,000,000',
    contact: 'bob@acme.com'
  },
  {
    recordName: 'salesforce.com - 1,000 Widgets',
    accountName: 'salesforce.com',
    closeDate: '1/31/15 3:45PM',
    stage: 'Id. Decision Makers',
    confidence: '70%',
    amount: '$25,000',
    contact: 'nathan@salesforce.com'
  }
];

/// ////////////////////////////////////////
// Partial(s)
/// ////////////////////////////////////////

let Container = props => (
  <div
    className="nds-table_header-fixed_container"
    tabIndex={props.tabIndex}
    id={props.id}
  >
    <div
      className="nds-scrollable"
      style={{ height: '100px', position: 'static' }}
    >
      <div className="table--header-fixed_container--inner nds-table_edit_container">
        {props.children}
      </div>
    </div>
  </div>
);

let Th = props => {
  const { columnName, ...rest } = props;
  const uniqueId = _.uniqueId('cell-resize-handle-');
  let sortDirection;
  if (props['aria-sort']) {
    sortDirection =
      props['aria-sort'] === 'ascending'
        ? 'Sorted ascending'
        : 'Sorted descending';
  }

  return (
    <th
      {...rest}
      className={classNames(
        'nds-is-sortable nds-is-resizable nds-text-title_caps',
        props.className
      )}
      scope="col"
      style={{ width: '8.75rem' }}
    >
      <div className="nds-cell-fixed" style={{ width: '8.75rem' }}>
        <a
          href="javascript:void(0);"
          className="nds-th__action nds-text-link_reset"
          tabIndex={!props.focusable ? '-1' : '0'}
        >
          <span className="nds-assistive-text">Sort </span>
          <span className="nds-truncate" title={columnName || 'Column Name'}>
            {columnName || 'Column Name'}
          </span>
          <div className="nds-icon_container">
            <SvgIcon
              className="nds-icon nds-icon_x-small nds-icon-text-default nds-is-sortable__icon"
              sprite="utility"
              symbol="arrowdown"
            />
          </div>
          <span
            className="nds-assistive-text"
            aria-live="assertive"
            aria-atomic="true"
          >
            {sortDirection}
          </span>
        </a>
        <div className="nds-resizable">
          <label htmlFor={uniqueId} className="nds-assistive-text">
            {columnName || 'Column Name'} column width
          </label>
          <input
            className="nds-resizable__input nds-assistive-text"
            type="range"
            min="20"
            max="1000"
            id={uniqueId}
            tabIndex={!props.focusable ? '-1' : '0'}
          />
          <span className="nds-resizable__handle">
            <span className="nds-resizable__divider" />
          </span>
        </div>
      </div>
    </th>
  );
};

let Checkbox = props => (
  <label className="nds-checkbox">
    <input
      type="checkbox"
      name="options"
      disabled={props.disabled}
      defaultChecked={props.checked}
      tabIndex={props.tabIndex || '-1'}
      id={props.checkID}
    />
    <span className="nds-checkbox_faux" />
    <span className="nds-assistive-text">{props.label}</span>
  </label>
);

/// ///////////////////////////////////////////
// Export
/// ///////////////////////////////////////////

export default (
  <Container>
    <Table className="nds-no-cell-focus nds-table_header-fixed">
      <thead>
        <tr className="nds-line-height_reset">
          <th scope="col" style={{ width: '3.75rem' }}>
            <div
              style={{ width: '3.75rem' }}
              className="nds-th__action nds-cell-fixed"
            >
              <span className="nds-assistive-text">Errors</span>
            </div>
          </th>
          <th scope="col" style={{ width: '2rem' }}>
            <div
              style={{ width: '2rem' }}
              className="nds-th__action nds-cell-fixed nds-p-around_x-small"
            >
              <Checkbox label="Select All" />
            </div>
          </th>
          {_.times(columns.length, i => (
            <Th columnName={columns[i]} key={i} style={{ width: '8.75rem' }} />
          ))}
          <th scope="col" style={{ width: '3.25rem' }}>
            <div
              style={{ width: '2.75rem' }}
              className="nds-th__action nds-cell-fixed"
            >
              <span className="nds-assistive-text">Actions</span>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        {_.times(rows.length, i => (
          <RowData
            key={i}
            recordName={rows[i].recordName}
            accountName={rows[i].accountName}
            closeDate={rows[i].closeDate}
            stage={rows[i].stage}
            confidence={rows[i].confidence}
            amount={rows[i].amount}
            contact={rows[i].contact}
            buttonInvisible="nds-hidden"
          />
        ))}
      </tbody>
    </Table>
  </Container>
);
