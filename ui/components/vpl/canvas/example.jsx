// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import classNames from 'classnames';

/// ////////////////////////////////////////
// Partial(s)
/// ////////////////////////////////////////

export let NdsCanvas = props => (
  <div className="nds-canvas">{props.children}</div>
);

export let CanvasBody = props => (
  <div className="nds-p-around_small">
    <CanvasTitle />
    {props.children}
  </div>
);

export let CanvasTitle = props => (
  <h3 className="nds-is-relative nds-m-bottom_large nds-canvas__title">
    {props.title || 'Title'}
  </h3>
);

/// ////////////////////////////////////////
// Export
/// ////////////////////////////////////////

export default (
  <NdsCanvas>
    <CanvasBody>
      <div className="nds-grid nds-m-bottom_small nds-wrap cards-container">
        <div className="nds-size_1-of-1 nds-m-bottom--large">My Action 1</div>
        <div className="nds-size_1-of-1 nds-m-bottom--large">My Action 2</div>
      </div>
    </CanvasBody>
  </NdsCanvas>
);

export let states = [
  {
    id: 'recent-transactions',
    label: 'Recent Transactions',
    element: (
      <NdsCanvas>
        <CanvasBody title="Transactions">
          <div>
            <table className="nds-no-row-hover nds-table__custom">
              <thead className="nds-max-small-hide">
                <tr className="nds-text-heading_label">
                  <th scope="col">
                    <div>Date</div>
                  </th>
                  <th scope="col">
                    <div>Policy Name</div>
                  </th>
                  <th scope="col">
                    <div>Amount</div>
                  </th>
                  <th scope="col">
                    <div>Billing Name</div>
                  </th>
                  <th scope="col">
                    <div>Type</div>
                  </th>
                  <th className="nds-cell-shrink" />
                </tr>
              </thead>
              <tbody>
                <tr className="nds-border_bottom">
                  <td className="nds-truncate" data-label="Date">
                    2019-04-01
                  </td>
                  <td className="nds-truncate" data-label="Policy Name">
                    Superior Business - Orrico Latest
                  </td>
                  <td className="nds-truncate" data-label="Amount">
                    $0.06
                  </td>
                  <td className="nds-truncate" data-label="Billing Name">
                    Premium Paid
                  </td>
                  <td className="nds-truncate" data-label="Type">
                    Premium Paid
                  </td>
                </tr>
              </tbody>
              <tbody>
                <tr className="nds-border_bottom">
                  <td className="nds-truncate" data-label="Date">
                    2019-03-19
                  </td>
                  <td className="nds-truncate" data-label="Policy Name">
                    Superior Business - Orrico Latest
                  </td>
                  <td className="nds-truncate" data-label="Amount">
                    $1,200.00
                  </td>
                  <td className="nds-truncate" data-label="Billing Name">
                    Renewal Transaction
                  </td>
                  <td className="nds-truncate" data-label="Type">
                    Renewal
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CanvasBody>
      </NdsCanvas>
    )
  }
];
