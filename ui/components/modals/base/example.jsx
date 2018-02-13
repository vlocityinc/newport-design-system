// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import { ButtonIcon } from '../../button-icons/base/example';
import classNames from 'classnames';

/// ///////////////////////////////////////////
// Partial(s)
/// ///////////////////////////////////////////

let Demo = props => (
  <div className="demo-only" {...props}>
    {props.children}
    <div className="nds-backdrop nds-backdrop_open" />
  </div>
);

export let Modal = props => (
  <section
    role="dialog"
    tabIndex="-1"
    {...props}
    aria-modal="true"
    aria-describedby={props['aria-describedby'] || 'modal-content-id-1'}
    className={classNames('nds-modal nds-fade-in-open', props.className)}
  >
    <div className="nds-modal__container">{props.children}</div>
  </section>
);

export let ModalHeader = props => (
  <header className={classNames('nds-modal__header', props.className)}>
    {props.closeButton != 'false' ? (
      <ButtonIcon
        className="nds-modal__close nds-button_icon-inverse"
        iconClassName="nds-button__icon_large"
        symbol="close"
        title="Close"
        assistiveText="Close"
      />
    ) : null}
    {props.children}
  </header>
);

export let ModalContent = props => (
  <div
    className={classNames('nds-modal__content', props.className)}
    id={props['aria-describedby'] || 'modal-content-id-1'}
  >
    {props.children}
  </div>
);

export let ModalFooter = props => (
  <footer className={classNames('nds-modal__footer', props.className)}>
    {props.children}
  </footer>
);

/// ///////////////////////////////////////////
// State Constructor(s)
/// ///////////////////////////////////////////

let Taglines = props => (
  <Demo style={{ height: '640px' }}>
    <Modal aria-labelledby="modal-heading-01">
      <ModalHeader>
        <h2
          id="modal-heading-01"
          className="nds-text-heading_medium nds-hyphenate"
        >
          Modal Header
        </h2>
        <p className="nds-m-top_x-small">
          Here&rsquo;s a tagline if you need it. It is allowed to extend across
          mulitple lines, so I&rsquo;m making up content to show that to you. It
          is allowed to{' '}
          <a href="javascript:void(0);">contain links or be a link</a>.
        </p>
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
  </Demo>
);

let Large = props => (
  <Demo style={{ height: '640px' }}>
    <Modal className="nds-modal_large" aria-labelledby="modal-heading-01">
      <ModalHeader>
        <h2
          id="modal-heading-01"
          className="nds-text-heading_medium nds-hyphenate"
        >
          Modal Header
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
  </Demo>
);

let Directional = props => (
  <Demo style={{ height: '640px' }}>
    <Modal aria-labelledby="modal-heading-01">
      <ModalHeader>
        <h2
          id="modal-heading-01"
          className="nds-text-heading_medium nds-hyphenate"
        >
          Modal Header
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
        <p>
          Dolor eiusmod sunt ex incididunt cillum quis nostrud velit duis sit
          officia. Lorem aliqua enim laboris do dolor eiusmod officia. Mollit
          incididunt nisi consectetur esse laborum eiusmod pariatur proident.
          Eiusmod et adipisicing culpa deserunt nostrud ad veniam nulla aute
          est. Labore esse esse cupidatat amet velit id elit consequat minim
          ullamco mollit enim excepteur ea.
        </p>
      </ModalContent>
      <ModalFooter className="nds-modal__footer_directional">
        <button className="nds-button nds-button_neutral">
          Skip This Step
        </button>
        <button className="nds-button nds-button_brand">Save &#38; Next</button>
      </ModalFooter>
    </Modal>
  </Demo>
);

let Headless = props => (
  <Demo style={{ height: '640px' }}>
    <Modal aria-label="Meaningful description of the modal content">
      <ModalHeader className="nds-modal__header_empty" />
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
  </Demo>
);

let Footless = props => (
  <Demo style={{ height: '640px' }}>
    <Modal aria-labelledby="modal-heading-01">
      <ModalHeader>
        <h2
          id="modal-heading-01"
          className="nds-text-heading_medium nds-hyphenate"
        >
          Modal Header
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
        <p>
          Dolor eiusmod sunt ex incididunt cillum quis nostrud velit duis sit
          officia. Lorem aliqua enim laboris do dolor eiusmod officia. Mollit
          incididunt nisi consectetur esse laborum eiusmod pariatur proident.
          Eiusmod et adipisicing culpa deserunt nostrud ad veniam nulla aute
          est. Labore esse esse cupidatat amet velit id elit consequat minim
          ullamco mollit enim excepteur ea.
        </p>
      </ModalContent>
    </Modal>
  </Demo>
);

/// ///////////////////////////////////////////
// Export
/// ///////////////////////////////////////////

export default (
  <Demo style={{ height: '640px' }}>
    <Modal aria-labelledby="modal-heading-01">
      <ModalHeader>
        <h2
          id="modal-heading-01"
          className="nds-text-heading_medium nds-hyphenate"
        >
          Modal Header
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
  </Demo>
);

export let examples = [
  {
    id: 'taglines',
    label: 'Taglines',
    element: <Taglines />
  },
  {
    id: 'headless',
    label: 'Header empty',
    element: <Headless />
  },
  {
    id: 'footless',
    label: 'Footer removed',
    element: <Footless />
  }
];
