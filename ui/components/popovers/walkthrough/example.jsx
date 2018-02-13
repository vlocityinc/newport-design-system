// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import SvgIcon from '../../../shared/svg-icon';
import { ButtonIcon } from '../../button-icons/base/example';
import { Popover } from '../base/example';
import classNames from 'classnames';

const headingUniqueId = 'dialog-heading-id-01';

let Header = props => (
  <header className="nds-popover__header nds-p-vertical_medium">
    <h2 id={headingUniqueId} className="nds-text-heading_medium">
      {props.title}
    </h2>
  </header>
);

let Footer = props => (
  <div className="nds-grid nds-grid_vertical-align-center">
    <span className="nds-text-title">Step 2 of 4</span>
    {props.skipButton ? (
      <button className="nds-button nds-button_brand nds-col_bump-left">
        Skip
      </button>
    ) : null}
    {props.setupButton ? (
      <button className="nds-button nds-button_success nds-col_bump-left">
        Setup Email
      </button>
    ) : null}
    {props.nextButton ? (
      <button className="nds-button nds-button_brand nds-col_bump-left">
        Next
      </button>
    ) : null}
  </div>
);

/// ///////////////////////////////////////////
// Export
/// ///////////////////////////////////////////

export default (
  <Popover
    className="nds-popover_walkthrough nds-nubbin_left"
    headingId={headingUniqueId}
    header={<Header title="Manage your channels" />}
    footer={<Footer nextButton />}
    closeButton
    inverse
  >
    <p>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua.
    </p>
  </Popover>
);

export let examples = [
  {
    id: 'micro-setup',
    label: 'Micro Setup',
    element: (
      <Popover
        className="nds-popover_walkthrough nds-nubbin_left"
        headingId={headingUniqueId}
        header={<Header title="Manage your channels" />}
        footer={<Footer setupButton nextButton />}
        closeButton
        inverse
      >
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </Popover>
    )
  },
  {
    id: 'micro-setup-alternate',
    label: 'Micro Setup - Alternate',
    element: (
      <Popover
        className="nds-popover_walkthrough nds-nubbin_left"
        headingId={headingUniqueId}
        header={<Header title="Manage your channels" />}
        footer={<Footer skipButton setupButton />}
        closeButton
        inverse
      >
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </Popover>
    )
  },
  {
    id: 'micro-setup-in-page',
    label: 'Micro Setup - In Page',
    element: (
      <Popover
        className="nds-popover_walkthrough nds-nubbin_left"
        headingId={headingUniqueId}
        header={<Header title="Manage your channels" />}
        footer={<Footer skipButton />}
        closeButton
        inverse
      >
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </Popover>
    )
  },
  {
    id: 'micro-setup-inline-form',
    label: 'Micro Setup - Inline Form',
    element: (
      <Popover
        className="nds-popover_walkthrough nds-nubbin_left"
        headingId={headingUniqueId}
        header={<Header title="Manage your channels" />}
        footer={<Footer skipButton nextButton />}
        closeButton
        inverse
      >
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
        <div className="nds-form-element nds-p-top_small">
          <label
            className="nds-form-element__label nds-assistive-text"
            htmlFor="email-text-input-01"
          >
            Email Address
          </label>
          <div className="nds-form-element__control">
            <input
              id="email-text-input-01"
              className="nds-input"
              type="text"
              placeholder="Email Address"
            />
          </div>
        </div>
      </Popover>
    )
  },
  {
    id: 'action-popover',
    label: 'Action Popover',
    element: (
      <Popover
        className="nds-popover_walkthrough nds-popover_walkthrough-alt nds-nubbin_top-left"
        title="Action dialog"
        closeButton
        inverse
      >
        <div className="nds-media nds-media_center">
          <div className="nds-media__figure">
            <span
              className="nds-icon_container"
              title="description of icon when needed"
            >
              <SvgIcon
                className="nds-icon nds-icon_small nds-icon-text-default"
                sprite="utility"
                symbol="touch_action"
              />
              <span className="nds-assistive-text">Description of icon</span>
            </span>
          </div>
          <div className="nds-media__body">
            <p>Text that describes the action</p>
          </div>
        </div>
      </Popover>
    )
  },
  {
    id: 'action-popover-heading',
    label: 'Action Popover - With Heading',
    element: (
      <Popover
        className="nds-popover_walkthrough nds-popover_walkthrough-alt nds-nubbin_top-left"
        headingId="dialog-heading-id-01"
        closeButton
        inverse
      >
        <div className="nds-media">
          <div className="nds-media__figure">
            <span
              className="nds-icon_container"
              title="description of icon when needed"
            >
              <SvgIcon
                className="nds-icon nds-icon_small nds-icon-text-default"
                sprite="utility"
                symbol="touch_action"
              />
              <span className="nds-assistive-text">Description of icon</span>
            </span>
          </div>
          <div className="nds-media__body">
            <h2 id="dialog-heading-id-01" className="nds-text-heading_small">
              Title
            </h2>
            <p>Text that describes the action</p>
          </div>
        </div>
      </Popover>
    )
  }
];
