// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import {
  Modal,
  ModalHeader,
  ModalContent,
  ModalFooter
} from '../../modals/base/example';
import { ButtonIcon } from '../../button-icons/base/example';
import SvgIcon from '../../../shared/svg-icon';

export default (
  <div className="demo-only" style={{ height: '24rem' }}>
    <Modal className="nds-modal_large">
      <ModalHeader>
        <div className="nds-notify_container">
          <div
            className="nds-notify nds-notify_toast nds-theme_error"
            role="alert"
          >
            <span className="nds-assistive-text">Error</span>
            <ButtonIcon
              className="nds-notify__close nds-button_icon-inverse"
              iconClassName="nds-button__icon_large"
              symbol="close"
              assistiveText="Close"
              title="Close"
            />
            <div className="nds-notify__content nds-grid">
              <SvgIcon
                className="nds-icon nds-icon_small nds-m-right_small nds-col nds-no-flex"
                sprite="utility"
                symbol="warning"
              />
              <div className="nds-col nds-align-middle">
                <h2 className="nds-text-heading_small">
                  You've encountered some errors when trying to save edits to
                  Samuel Smith.
                </h2>
              </div>
            </div>
          </div>
        </div>
        <h2 className="nds-text-heading_medium">Modal Header</h2>
      </ModalHeader>

      <ModalContent className="nds-p-around_medium">
        <p>
          Sit nulla est ex deserunt exercitation anim occaecat. Nostrud ullamco
          deserunt aute id consequat veniam incididunt duis in sint irure nisi.
          Mollit officia cillum Lorem ullamco minim nostrud elit officia tempor
          esse quis. Cillum sunt ad dolore quis aute consequat ipsum magna
          exercitation reprehenderit magna. Tempor cupidatat consequat elit
          dolor adipisicing.
        </p>
        <p>
          Dolor eiusmod sunt ex incididunt cillum quis nostrud velit duis sit
          officia. Lorem aliqua enim laboris do dolor eiusmod officia. Mollit
          incididunt nisi consectetur esse laborum eiusmod pariatur proident.
          Eiusmod et adipisicing culpa deserunt nostrud ad veniam nulla aute
          est. Labore esse esse cupidatat amet velit id elit consequat minim
          ullamco mollit enim excepteur ea.
        </p>
      </ModalContent>

      <ModalFooter>
        <button className="nds-button nds-button_neutral">Cancel</button>
        <button className="nds-button nds-button_brand">Save</button>
      </ModalFooter>
    </Modal>
    <div className="nds-backdrop nds-backdrop_open" />
  </div>
);
