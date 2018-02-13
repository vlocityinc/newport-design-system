// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import {
  Modal,
  ModalHeader,
  ModalContent,
  ModalFooter
} from '../../modals/base/example';

export default (
  <div className="demo-only" style={{ height: '24rem' }}>
    <Modal
      role="alertdialog"
      aria-labelledby="prompt-heading-id"
      aria-describedby="prompt-message-wrapper"
      className="nds-modal_prompt"
    >
      <ModalHeader
        className="nds-theme_error nds-theme_alert-texture"
        closeButton={false}
      >
        <h2 className="nds-text-heading_medium" id="prompt-heading-id">
          Service Unavailable
        </h2>
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
      </ModalContent>

      <ModalFooter className="nds-theme_default">
        <button className="nds-button nds-button_neutral">Okay</button>
      </ModalFooter>
    </Modal>
    <div className="nds-backdrop nds-backdrop_open" />
  </div>
);
