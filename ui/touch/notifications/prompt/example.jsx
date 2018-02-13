// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import SvgIcon from '../../../shared/svg-icon';
import {
  Modal,
  ModalHeader,
  ModalContent
} from '../../../components/modals/base/example';

/// ////////////////////////////////////////
// Export
/// ////////////////////////////////////////

export let states = [
  {
    id: 'default',
    label: 'Default',
    element: (
      <div className="demo-only" style={{ height: '640px' }}>
        <Modal>
          <ModalContent className="nds-modal__menu">
            <button className="nds-button nds-button_neutral">
              Upload from Device
            </button>
            <button className="nds-button nds-button_neutral">
              Select a Salesforce File
            </button>
            <button className="nds-button nds-button_neutral">Cancel</button>
          </ModalContent>
        </Modal>
        <div className="nds-backdrop nds-backdrop_open" />
      </div>
    )
  },
  {
    id: 'with-header',
    label: 'With Header',
    element: (
      <div className="demo-only" style={{ height: '640px' }}>
        <Modal>
          <ModalHeader closeButton="false">
            <h2 className="nds-text-heading_medium">
              Select a New Record Type
            </h2>
          </ModalHeader>
          <ModalContent className="nds-modal__menu">
            <button className="nds-button nds-button_neutral">Simple</button>
            <button className="nds-button nds-button_neutral">Advanced</button>
            <button className="nds-button nds-button_neutral">Partner</button>
            <button className="nds-button nds-button_neutral">
              Person Accounts
            </button>
            <button className="nds-button nds-button_neutral">Cancel</button>
          </ModalContent>
        </Modal>
        <div className="nds-backdrop nds-backdrop_open" />
      </div>
    )
  },
  {
    id: 'with-header-and-tagline',
    label: 'With Header and Tagline',
    element: (
      <div className="demo-only" style={{ height: '640px' }}>
        <Modal>
          <ModalHeader closeButton="false">
            <h2 className="nds-text-heading_medium">Delete Account</h2>
            <p className="nds-m-top_x-small">
              Are you sure you want to delete this account?
            </p>
          </ModalHeader>
          <ModalContent className="nds-modal__menu">
            <button className="nds-button nds-button_destructive">
              Delete
            </button>
            <button className="nds-button nds-button_neutral">Cancel</button>
          </ModalContent>
        </Modal>
        <div className="nds-backdrop nds-backdrop_open" />
      </div>
    )
  },
  {
    id: 'with-header-and-tagline-plus-image',
    label: 'With Header and Tagline + image',
    element: (
      <div className="demo-only" style={{ height: '640px' }}>
        <Modal>
          <ModalHeader closeButton="false">
            <span className="nds-icon_container nds-icon-action-share-thanks nds-m-bottom_x-small">
              <SvgIcon
                className="nds-icon nds-icon_medium"
                sprite="action"
                symbol="share_thanks"
              />
              <span className="nds-assistive-text">Share Thanks</span>
            </span>
            <h2 className="nds-text-heading_medium">
              Your Feedback is Valuable
            </h2>
            <p className="nds-m-top_x-small">
              We&rsquo;re glad to hear you&rsquo;re enjoying the app! Your input
              helps drive our products. Would you mind taking a moment to give
              us feedback through the App Store? We really appreciate your
              support.
            </p>
          </ModalHeader>
          <ModalContent className="nds-modal__menu">
            <button className="nds-button nds-button_neutral">
              Upload from Device
            </button>
            <button className="nds-button nds-button_neutral">
              Select a Salesforce File
            </button>
            <button className="nds-button nds-button_neutral">Cancel</button>
          </ModalContent>
        </Modal>
        <div className="nds-backdrop nds-backdrop_open" />
      </div>
    )
  }
];
