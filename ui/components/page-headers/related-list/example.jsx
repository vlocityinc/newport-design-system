// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import BreadCrumbs, { Crumb } from '../../breadcrumbs/index.react';
import { ButtonIcon } from '../../button-icons/base/example';
import SvgIcon from '../../../shared/svg-icon';
import Heading from '../../heading/index.react';

export default (
  <div className="nds-page-header">
    <div className="nds-grid">
      <div className="nds-col nds-has-flexi-truncate">
        <BreadCrumbs className="nds-m-bottom_xx-small">
          <Crumb href="javascript:void(0);">Accounts</Crumb>
          <Crumb href="javascript:void(0);">Company One</Crumb>
        </BreadCrumbs>
        <h1
          className="nds-page-header__title nds-truncate"
          title="Contacts (will truncate)"
        >
          Contacts (will truncate)
        </h1>
      </div>
      <div className="nds-col nds-no-flex nds-grid nds-align-top">
        <div className="nds-button-group" role="group">
          <button className="nds-button nds-button_neutral">Add Contact</button>
          <div className="nds-dropdown-trigger nds-dropdown-trigger_click nds-button_last">
            <ButtonIcon
              className="nds-button_icon-border-filled"
              symbol="down"
              aria-haspopup="true"
              assistiveText="More Actions"
              title="More Actions"
            />
          </div>
        </div>
      </div>
    </div>
    <div className="nds-grid">
      <div className="nds-col nds-align-bottom">
        <p className="nds-text-body_small">10 items &bull; sorted by name</p>
      </div>
      <div className="nds-col nds-no-flex nds-grid nds-align-bottom">
        <div className="nds-dropdown-trigger nds-dropdown-trigger_click">
          <ButtonIcon
            className="nds-button_icon-more"
            symbol="table"
            hasDropdown
            assistiveText="Change view"
            title="Change view"
          />
        </div>
        <div className="nds-button-group nds-m-left_xx-small" role="group">
          <ButtonIcon
            className="nds-button_icon-border"
            symbol="chart"
            assistiveText="Chart"
            title="Chart"
          />
          <ButtonIcon
            className="nds-button_icon-border"
            symbol="filterList"
            assistiveText="Filter List"
            title="Filter List"
          />
          <div className="nds-dropdown-trigger nds-dropdown-trigger_click nds-button_last">
            <ButtonIcon
              className="nds-button_icon-more"
              symbol="sort"
              hasDropdown
              assistiveText="Sort"
              title="Sort"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);
