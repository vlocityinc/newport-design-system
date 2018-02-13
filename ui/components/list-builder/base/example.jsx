// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import {
  Modal,
  ModalHeader,
  ModalContent,
  ModalFooter
} from '../../modals/base/example';
import { CheckboxAddButton } from '../../checkbox-button/base/example';
import {
  ComboboxContainer,
  Listbox,
  ListboxItem,
  EntityOption
} from '../../combobox/base/example';
import { Th } from '../../data-tables/';
import { PillContainer } from '../../pills/base/example';
import { ListboxPill } from '../../pills/listbox-of-pill-options/example';
import classNames from 'classnames';
import _ from '../../../shared/helpers';

/* -----------------------------------------------------------------------------
    Variables and Objects
----------------------------------------------------------------------------- */

const listboxSelectionsId = 'listbox-selections-unique-id';
const listboxOptionId01 = 'listbox-option-unique-id-01';
const listboxOptionId02 = 'listbox-option-unique-id-02';
const columns = ['Name', 'Product Code', 'List Price', 'Product Family'];
const rows = [
  {
    name: 'Analytics',
    productCode: 'ANTLY',
    listPrice: '5000.00',
    productFamily: 'Analytics Product'
  },
  {
    name: 'Analytics',
    productCode: 'ANTLY',
    listPrice: '5000.00',
    productFamily: 'Analytics Product'
  },
  {
    name: 'Analytics',
    productCode: 'ANTLY',
    listPrice: '5000.00',
    productFamily: 'Analytics Product'
  },
  {
    name: 'Analytics',
    productCode: 'ANTLY',
    listPrice: '5000.00',
    productFamily: 'Analytics Product'
  },
  {
    name: 'Analytics',
    productCode: 'ANTLY',
    listPrice: '5000.00',
    productFamily: 'Analytics Product'
  },
  {
    name: 'Analytics',
    productCode: 'ANTLY',
    listPrice: '5000.00',
    productFamily: 'Analytics Product'
  },
  {
    name: 'Analytics',
    productCode: 'ANTLY',
    listPrice: '5000.00',
    productFamily: 'Analytics Product'
  },
  {
    name: 'Analytics',
    productCode: 'ANTLY',
    listPrice: '5000.00',
    productFamily: 'Analytics Product'
  }
];

/* -----------------------------------------------------------------------------
    Private
----------------------------------------------------------------------------- */

const ListboxDropdown = props => (
  <Listbox className="nds-dropdown nds-dropdown_fluid" vertical>
    <ListboxItem>
      <EntityOption
        id={listboxOptionId01}
        entityTitle="Acme"
        entityMeta
        focused={props.focused}
      />
    </ListboxItem>
    <ListboxItem>
      <EntityOption
        id={listboxOptionId02}
        entityTitle="Salesforce.com, Inc."
        entityMeta
      />
    </ListboxItem>
  </Listbox>
);

let ProductListHeader = props => (
  <div className="nds-p-vertical_x-small nds-p-horizontal_large nds-shrink-none nds-theme_shade">
    <ComboboxContainer
      autocomplete
      hideLabel
      inputIcon="right"
      inputIconRightSymbol="search"
      listbox={<ListboxDropdown />}
    />
    {props.selectedFilters ? props.selectedFilters : null}
    <div className="nds-text-title nds-m-top_x-small" aria-live="polite">
      {props.itemsSelected || '0'} Item(s) Selected
    </div>
  </div>
);

let ProductList = props => (
  <div className="nds-scrollable nds-grow">
    <table
      role="grid"
      className="nds-table nds-table_fixed-layout nds-table_bordered nds-table_resizable-cols nds-no-row-hover nds-scrollable_none"
    >
      <thead>
        <tr className="nds-line-height_reset">
          <th scope="col" style={{ width: '3.75rem' }} />
          {_.times(columns.length, i => (
            <Th key={i} columnName={columns[i]} aria-label={columns[i]} />
          ))}
        </tr>
      </thead>
      <tbody>{props.children}</tbody>
    </table>
  </div>
);

let RowData = props => {
  let checkboxLabel = 'Select item ' + props.index;

  return (
    <tr
      className={classNames('nds-hint-parent', props.className)}
      aria-selected={props.checked}
    >
      <td
        role="gridcell"
        tabIndex={props.index === 1 ? '0' : '-1'}
        className="nds-text-align_right"
        style={{ width: '3.75rem' }}
      >
        <CheckboxAddButton
          label={checkboxLabel}
          checked={props.checked}
          tabIndex="-1"
        />
      </td>
      <th scope="row">
        <div className="nds-truncate" title={props.name}>
          {props.name}
        </div>
      </th>
      <td role="gridcell">
        <div className="nds-truncate" title={props.productCode}>
          {props.productCode}
        </div>
      </td>
      <td role="gridcell">
        <div className="nds-truncate" title={props.listPrice}>
          {props.listPrice}
        </div>
      </td>
      <td role="gridcell">
        <div className="nds-truncate" title={props.productFamily}>
          {props.productFamily}
        </div>
      </td>
    </tr>
  );
};

let FilteredItem = props => (
  <PillContainer className="nds-pill_container_bare">
    <Listbox horizonta>
      <ListboxItem>
        <ListboxPill label="Analytics" tabIndex="0" />
      </ListboxItem>
    </Listbox>
  </PillContainer>
);

let FilteredItems = props => (
  <PillContainer className="nds-pill_container_bare">
    <Listbox horizontal>
      <ListboxItem>
        <ListboxPill label="Option A" tabIndex="0" />
      </ListboxItem>
      <ListboxItem>
        <ListboxPill label="Option B" />
      </ListboxItem>
    </Listbox>
  </PillContainer>
);

/* -----------------------------------------------------------------------------
    Exports
----------------------------------------------------------------------------- */

export default (
  <div className="demo-only" style={{ height: '640px' }}>
    <Modal
      className="nds-modal_large nds-list-builder"
      aria-labelledby="id-of-modalheader-h2"
    >
      <ModalHeader>
        <h2 id="id-of-modalheader-h2" className="nds-text-heading_medium">
          Add Products
        </h2>
        <p className="nds-m-top_x-small">Pricebook: Salesforce Products</p>
      </ModalHeader>
      <ModalContent className="nds-grid nds-grow">
        <div className="nds-grid nds-grid_vertical">
          <ProductListHeader />
          <ProductList>
            {_.times(rows.length, i => (
              <RowData
                key={i}
                index={i + 1}
                name={rows[i].name}
                productCode={rows[i].productCode}
                listPrice={rows[i].listPrice}
                productFamily={rows[i].productFamily}
              />
            ))}
          </ProductList>
        </div>
      </ModalContent>
      <ModalFooter>
        <button className="nds-button nds-button_neutral">Cancel</button>
        <button className="nds-button nds-button_brand">Next</button>
      </ModalFooter>
    </Modal>
    <div className="nds-backdrop nds-backdrop_open" />
  </div>
);

export let states = [
  {
    id: 'items-selected',
    label: 'Items selected',
    element: (
      <div className="demo-only" style={{ height: '640px' }}>
        <Modal
          className="nds-modal_large"
          aria-labelledby="id-of-modalheader-h2"
        >
          <ModalHeader>
            <h2 id="id-of-modalheader-h2" className="nds-text-heading_medium">
              Add Products
            </h2>
            <p className="nds-m-top_x-small">Pricebook: Salesforce Products</p>
          </ModalHeader>
          <ModalContent className="nds-grid nds-nowrap">
            <div className="nds-col nds-grid nds-grid_vertical nds-nowrap">
              <ProductListHeader
                selectedFilters={<FilteredItem />}
                itemsSelected="1"
              />
              <ProductList>
                {_.times(rows.length, i => (
                  <RowData
                    key={i}
                    index={i + 1}
                    checked={i === 0 ? true : null}
                    name={rows[i].name}
                    productCode={rows[i].productCode}
                    listPrice={rows[i].listPrice}
                    productFamily={rows[i].productFamily}
                  />
                ))}
              </ProductList>
            </div>
          </ModalContent>
          <ModalFooter>
            <button className="nds-button nds-button_neutral">Cancel</button>
            <button className="nds-button nds-button_brand">Next</button>
          </ModalFooter>
        </Modal>
        <div className="nds-backdrop nds-backdrop_open" />
      </div>
    )
  },
  {
    id: 'filtered',
    label: 'Filtered Results',
    element: (
      <div className="demo-only" style={{ height: '640px' }}>
        <Modal
          className="nds-modal_large"
          aria-labelledby="id-of-modalheader-h2"
        >
          <ModalHeader>
            <h2 id="id-of-modalheader-h2" className="nds-text-heading_medium">
              Add Products
            </h2>
            <p className="nds-m-top_x-small">Pricebook: Salesforce Products</p>
          </ModalHeader>
          <ModalContent className="nds-grid nds-grow">
            <div className="nds-grid nds-grid_vertical">
              <ProductListHeader
                selectedFilters={<FilteredItems />}
                itemsSelected="2"
              />
              <ProductList>
                <RowData
                  index={1}
                  name={rows[0].name}
                  productCode={rows[0].productCode}
                  listPrice={rows[0].listPrice}
                  productFamily={rows[0].productFamily}
                />
              </ProductList>
            </div>
          </ModalContent>
          <ModalFooter>
            <button className="nds-button nds-button_neutral">Cancel</button>
            <button className="nds-button nds-button_brand">Next</button>
          </ModalFooter>
        </Modal>
        <div className="nds-backdrop nds-backdrop_open" />
      </div>
    )
  }
];
