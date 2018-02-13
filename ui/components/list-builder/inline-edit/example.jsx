// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import { ButtonIcon } from '../../button-icons/base/example';
import SvgIcon from '../../../shared/svg-icon';
import {
  Modal,
  ModalHeader,
  ModalContent,
  ModalFooter
} from '../../modals/base/example';
import classNames from 'classnames';

/// ////////////////////////////////////////
// Partial(s)
/// ////////////////////////////////////////

let Th = props => (
  <th className={props.className} scope={props.scope} style={props.style}>
    <a
      href="javascript:void(0);"
      className="nds-th__action nds-text-link_reset"
    >
      <span className="nds-assistive-text">Sort Column</span>
      <span className="nds-truncate" title={props.title}>
        {props.children}
      </span>
      <div className="nds-icon_container" title="Sort Column">
        <SvgIcon
          className="nds-icon nds-icon_x-small nds-icon-text-default nds-is-sortable__icon"
          sprite="utility"
          symbol="arrowdown"
        />
      </div>
    </a>
  </th>
);

let ProductList = props => (
  <div className="nds-scrollable">
    <table
      role="grid"
      className="nds-table nds-table_fixed-layout nds-table_bordered nds-no-row-hover nds-table_cell-buffer"
    >
      <thead>
        <tr className="nds-text-title_caps">
          <Th className="nds-is-sortable" scope="col" title="Name">
            Name
          </Th>
          <Th className="nds-is-sortable" scope="col" title="List Price">
            List Price
          </Th>
          <Th className="nds-is-sortable" scope="col" title="Discount">
            Discount
          </Th>
          <Th className="nds-is-sortable" scope="col" title="Sale Price">
            Sale Price
          </Th>
          <Th className="nds-is-sortable" scope="col" title="Quantity">
            Quantity
          </Th>
          <Th className="nds-is-sortable" scope="col" title="Date">
            Date
          </Th>
          <Th className="nds-is-sortable" scope="col" title="Product Family">
            Product Family
          </Th>
          <Th className="nds-is-sortable" scope="col" title="Total Price">
            Total Price
          </Th>
          <th className="nds-cell-shrink" scope="col" />
        </tr>
      </thead>
      <tbody>{props.children}</tbody>
    </table>
  </div>
);

/// ////////////////////////////////////////
// Export
/// ////////////////////////////////////////

export default (
  <div className="demo-only" style={{ height: '640px' }}>
    <Modal className="nds-modal_large">
      <ModalHeader>
        <h2 className="nds-text-heading_medium">Edit All Products</h2>
        <p className="nds-m-top_x-small">
          Edit the details of the products associated with your opportunity
        </p>
      </ModalHeader>
      <ModalContent className="nds-grid nds-nowrap">
        <div className="nds-col nds-grid nds-grid_vertical nds-nowrap">
          <ProductList>
            <tr>
              <th scope="row" data-label="Name">
                <div className="nds-truncate" title="Beta Product">
                  Beta Product
                </div>
              </th>
              <td data-label="List Price" role="gridcell">
                <div className="nds-truncate" title="5,000.00">
                  5,000.00
                </div>
              </td>
              <td data-label="Discount" role="gridcell">
                <label htmlFor="discount-01" className="nds-assistive-text">
                  Discount
                </label>
                <input
                  className="nds-input"
                  id="discount-01"
                  defaultValue="300.00"
                />
              </td>
              <td data-label="Sale Price" role="gridcell">
                <label htmlFor="sale-price-01" className="nds-assistive-text">
                  Sale Price
                </label>
                <input
                  className="nds-input"
                  id="sale-price-01"
                  defaultValue="5000.00"
                />
              </td>
              <td data-label="Quantity" role="gridcell">
                <label htmlFor="quantity-01" className="nds-assistive-text">
                  Quantity
                </label>
                <input
                  className="nds-input"
                  id="quantity-01"
                  defaultValue="1"
                />
              </td>
              <td data-label="Date" role="gridcell">
                <label htmlFor="date-01" className="nds-assistive-text">
                  Date
                </label>
                <input
                  className="nds-input"
                  id="date-01"
                  defaultValue="8/12/16"
                />
              </td>
              <td data-label="Product Family" role="gridcell">
                <div className="nds-truncate" title="Family B">
                  Family B
                </div>
              </td>
              <td data-label="Total Price" role="gridcell">
                <div className="nds-truncate" title="$4,700.00">
                  $4,700.00
                </div>
              </td>
              <td role="gridcell">
                <ButtonIcon
                  className="nds-button_icon-border-filled nds-button_icon-x-small"
                  symbol="down"
                  assistiveText="Show More"
                  title="Show More"
                />
              </td>
            </tr>
            <tr>
              <th scope="row" data-label="Name">
                <div className="nds-truncate" title="Service Product">
                  Service Product
                </div>
              </th>
              <td data-label="List Price" role="gridcell">
                <div className="nds-truncate" title="3,750.00">
                  3,750.00
                </div>
              </td>
              <td data-label="Discount" role="gridcell">
                <label htmlFor="discount-02" className="nds-assistive-text">
                  Discount
                </label>
                <input className="nds-input" id="discount-02" />
              </td>
              <td data-label="Sale Price" role="gridcell">
                <label htmlFor="sale-price-02" className="nds-assistive-text">
                  Sale Price
                </label>
                <input
                  className="nds-input"
                  id="sale-price-02"
                  defaultValue="3750.00"
                />
              </td>
              <td data-label="Quantity" role="gridcell">
                <label htmlFor="quantity-02" className="nds-assistive-text">
                  Quantity
                </label>
                <input
                  className="nds-input"
                  id="quantity-02"
                  defaultValue="3"
                />
              </td>
              <td data-label="Date" role="gridcell">
                <label htmlFor="date-02" className="nds-assistive-text">
                  Date
                </label>
                <input
                  className="nds-input"
                  id="date-02"
                  defaultValue="8/12/16"
                />
              </td>
              <td data-label="Product Family" role="gridcell">
                <div className="nds-truncate" title="Family B">
                  Family B
                </div>
              </td>
              <td data-label="Total Price" role="gridcell">
                <div className="nds-truncate" title="$11,250.00">
                  $11,250.00
                </div>
              </td>
              <td role="gridcell">
                <ButtonIcon
                  className="nds-button_icon-border-filled nds-button_icon-x-small"
                  symbol="down"
                  assistiveText="Show More"
                  title="Show More"
                />
              </td>
            </tr>
          </ProductList>
          <div className="nds-grid nds-grid_vertical-align-center nds-p-vertical_x-small nds-p-horizontal_large">
            <div className="nds-text-title_caps">
              <span className="nds-m-right_x-small">Total Products</span>
              <span className="nds-text-heading_small">2</span>
            </div>
            <div className="nds-col_bump-left nds-text-title_caps nds-text-align_right">
              <span className="nds-m-right_x-small">Total</span>
              <span className="nds-text-heading_small">$15,950</span>
            </div>
          </div>
        </div>
      </ModalContent>
      <ModalFooter className="nds-modal__footer_directional">
        <button className="nds-button nds-button_neutral">Cancel</button>
        <button className="nds-button nds-button_brand">Save</button>
      </ModalFooter>
    </Modal>
    <div className="nds-backdrop nds-backdrop_open" />
  </div>
);
