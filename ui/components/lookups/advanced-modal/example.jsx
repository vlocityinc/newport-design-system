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

export default (
  <div className="demo-only" style={{ height: '640px' }}>
    <Modal className="nds-modal_large">
      <ModalHeader>
        <h2 className="nds-text-heading_medium">Account Name</h2>
      </ModalHeader>

      <ModalContent>
        <div
          className="nds-lookup"
          data-select="multi"
          data-scope="single"
          data-typeahead="true"
        >
          <div className="nds-form-element nds-p-top_medium nds-p-horizontal_medium nds-m-bottom_small">
            <label className="nds-form-element__label" htmlFor="lookup">
              Accounts
            </label>
            <div className="nds-form-element__control nds-input-has-icon nds-input-has-icon_right">
              <SvgIcon
                className="nds-icon nds-input__icon nds-icon-text-default"
                sprite="utility"
                symbol="search"
              />
              <input
                id="lookup"
                className="nds-input"
                type="text"
                aria-haspopup="true"
                aria-autocomplete="list"
                role="combobox"
                aria-activedescendant=""
              />
            </div>
          </div>
          <table
            className="nds-table nds-table_bordered nds-table_cell-buffer nds-no-row-hover"
            role="listbox"
          >
            <thead>
              <tr>
                <th colSpan="4" scope="col">
                  <div className="nds-float_right">
                    <ButtonIcon
                      className="nds-button_icon nds-button_icon-x-small"
                      symbol="filterList"
                      assistiveText="Filter List"
                      title="Filter List"
                    />
                    <ButtonIcon
                      className="nds-button_icon nds-button_icon-x-small"
                      symbol="sort"
                      assistiveText="Sort"
                      title="Sort"
                    />
                  </div>
                  5 Results, sorted by relevancy
                </th>
              </tr>
              <tr>
                <th scope="col">
                  <div className="nds-truncate" title="Account Name">
                    Account Name
                  </div>
                </th>
                <th scope="col">
                  <div className="nds-truncate" title="Location">
                    Location
                  </div>
                </th>
                <th scope="col">
                  <div className="nds-truncate" title="Secondary Column">
                    Secondary Column
                  </div>
                </th>
                <th scope="col">
                  <div className="nds-truncate" title="Tertiary Column">
                    Tertiary Column
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">
                  <a id="s01" href="javascript:void(0);" role="option">
                    <div className="nds-truncate" title="Acme Landscape">
                      <SvgIcon
                        className="nds-icon nds-icon-standard-account nds-icon_small nds-m-right_x-small"
                        sprite="standard"
                        symbol="account"
                      />
                      Acme Landscape
                    </div>
                  </a>
                </th>
                <td>
                  <div className="nds-truncate" title="Seattle, WA">
                    Seattle, WA
                  </div>
                </td>
                <td>
                  <div className="nds-truncate" title="Secondary Field">
                    Secondary Field
                  </div>
                </td>
                <td>
                  <div className="nds-truncate" title="Tertiary Field">
                    Tertiary Field
                  </div>
                </td>
              </tr>
              <tr>
                <th scope="row">
                  <a id="s02" href="javascript:void(0);" role="option">
                    <div className="nds-truncate" title="ACME Construction">
                      <SvgIcon
                        className="nds-icon nds-icon-standard-account nds-icon_small nds-m-right_x-small"
                        sprite="standard"
                        symbol="account"
                      />
                      ACME Construction
                    </div>
                  </a>
                </th>
                <td>
                  <div className="nds-truncate" title="San Francisco, CA">
                    San Francisco, CA
                  </div>
                </td>
                <td>
                  <div className="nds-truncate" title="Secondary Field">
                    Secondary Field
                  </div>
                </td>
                <td>
                  <div className="nds-truncate" title="Tertiary Field">
                    Tertiary Field
                  </div>
                </td>
              </tr>
              <tr>
                <th scope="row">
                  <a id="s03" href="javascript:void(0);" role="option">
                    <div className="nds-truncate" title="Action Sports">
                      <SvgIcon
                        className="nds-icon nds-icon-standard-account nds-icon_small nds-m-right_x-small"
                        sprite="standard"
                        symbol="account"
                      />
                      Action Sports
                    </div>
                  </a>
                </th>
                <td>
                  <div className="nds-truncate" title="Madison, WI">
                    Madison, WI
                  </div>
                </td>
                <td>
                  <div className="nds-truncate" title="Secondary Field">
                    Secondary Field
                  </div>
                </td>
                <td>
                  <div className="nds-truncate" title="Tertiary Field">
                    Tertiary Field
                  </div>
                </td>
              </tr>
              <tr>
                <th scope="row">
                  <a id="s04" href="javascript:void(0);" role="option">
                    <div className="nds-truncate" title="Moderno Bistro">
                      <SvgIcon
                        className="nds-icon nds-icon-standard-account nds-icon_small nds-m-right_x-small"
                        sprite="standard"
                        symbol="account"
                      />
                      Moderno Bistro
                    </div>
                  </a>
                </th>
                <td>
                  <div className="nds-truncate" title="Acton, OH">
                    Acton, OH
                  </div>
                </td>
                <td>
                  <div className="nds-truncate" title="Secondary Field">
                    Secondary Field
                  </div>
                </td>
                <td>
                  <div className="nds-truncate" title="Tertiary Field">
                    Tertiary Field
                  </div>
                </td>
              </tr>
              <tr>
                <th scope="row">
                  <a id="s05" href="javascript:void(0);" role="option">
                    <div className="nds-truncate" title="Cozy Kitchen">
                      <SvgIcon
                        className="nds-icon nds-icon-standard-account nds-icon_small nds-m-right_x-small"
                        sprite="standard"
                        symbol="account"
                      />
                      Cozy Kitchen
                    </div>
                  </a>
                </th>
                <td>
                  <div className="nds-truncate" title="Acton, CA">
                    Acton, CA
                  </div>
                </td>
                <td>
                  <div className="nds-truncate" title="Secondary Field">
                    Secondary Field
                  </div>
                </td>
                <td>
                  <div className="nds-truncate" title="Tertiary Field">
                    Tertiary Field
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </ModalContent>

      <ModalFooter className="nds-modal__footer_directional">
        <button className="nds-button nds-button_neutral">Cancel</button>
        <button className="nds-button nds-button_neutral">New Account</button>
      </ModalFooter>
    </Modal>
    <div className="nds-backdrop nds-backdrop_open" />
  </div>
);
