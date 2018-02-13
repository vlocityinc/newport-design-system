// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import SvgIcon from '../../../shared/svg-icon';
import { Modal, ModalHeader, ModalContent } from '../../modals/base/example';
import { AppLauncherTile } from '../tile/example';
import {
  Section,
  SectionContent,
  SectionTitle,
  SectionTitleAction
} from '../../expandable-section/base/example';
import classNames from 'classnames';

/// ///////////////////////////////////////////
// Partial(s)
/// ///////////////////////////////////////////

let AppLauncherModal = props => (
  <Modal
    aria-labelledby="header43"
    className="nds-modal_large nds-app-launcher"
  >
    <ModalHeader className="nds-app-launcher__header nds-grid nds-grid_align-spread nds-grid_vertical-align-center">
      <h2 id="header43" className="nds-text-heading_medium">
        App Launcher
      </h2>
      <div className="nds-app-launcher__header-search">
        <div className="nds-form-element">
          <label
            htmlFor="app-launcher-search"
            className="nds-form-element__label nds-assistive-text"
          >
            Find an app
          </label>
          <div className="nds-form-element__control nds-input-has-icon nds-input-has-icon_left">
            <SvgIcon
              className="nds-input__icon"
              sprite="utility"
              symbol="search"
            />
            <input
              type="search"
              className="nds-input"
              id="app-launcher-search"
              placeholder="sales"
            />
          </div>
        </div>
      </div>
      <button className="nds-button nds-button_neutral">App Exchange</button>
    </ModalHeader>
    <ModalContent className="nds-app-launcher__content nds-p-around_medium">
      <Section className="nds-is-open">
        <SectionTitle>
          <SectionTitleAction isOpen referenceId="appsContent">
            All Apps
          </SectionTitleAction>
        </SectionTitle>
        <SectionContent isOpen referenceId="appsContent">
          <ul className="nds-grid nds-grid_pull-padded nds-wrap">
            <li className="nds-p-horizontal_small nds-size_1-of-1 nds-medium-size_1-of-3">
              <AppLauncherTile
                objectInitials="SC"
                figureClass="nds-icon-custom-27"
                draggable
              >
                <span className="nds-text-link">
                  <mark>Sales</mark> Cloud
                </span>
                <p>
                  The primary internal Salesforce org. Used to run our...<span className="nds-text-link">More</span>
                </p>
              </AppLauncherTile>
            </li>
          </ul>
        </SectionContent>
      </Section>

      <hr />

      <Section className="nds-is-open">
        <SectionTitle>
          <SectionTitleAction isOpen referenceId="itemsContent">
            All Items
          </SectionTitleAction>
        </SectionTitle>
        <SectionContent isOpen referenceId="itemsContent">
          <ul className="nds-grid nds-grid_pull-padded nds-wrap">
            <li className="nds-p-horizontal_small nds-size_xx-small">
              <AppLauncherTile flavor="small" symbol="account">
                <p
                  className="nds-truncate nds-text-link"
                  title="Sales Invoices"
                >
                  <mark>Sales</mark> Invoices
                </p>
              </AppLauncherTile>
            </li>
            <li className="nds-p-horizontal_small nds-size_xx-small">
              <AppLauncherTile flavor="small" symbol="announcement">
                <p className="nds-truncate nds-text-link" title="Sales Objects">
                  <mark>Sales</mark> Objects
                </p>
              </AppLauncherTile>
            </li>
          </ul>
        </SectionContent>
      </Section>
    </ModalContent>
  </Modal>
);

/// ///////////////////////////////////////////
// Export
/// ///////////////////////////////////////////

export default (
  <div className="demo-only" style={{ height: '800px' }}>
    <AppLauncherModal />
    <div className="nds-backdrop nds-backdrop_open" />
  </div>
);
