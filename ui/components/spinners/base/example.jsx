// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import classNames from 'classnames';

/// ////////////////////////////////////////
// Partial(s)
/// ////////////////////////////////////////

let Demo = props => (
  <div
    className={classNames('demo-only', props.className)}
    style={{ height: '9rem' }}
  >
    {props.children}
  </div>
);

export let SpinnerContainer = props => (
  <div className={classNames('nds-spinner_container', props.className)}>
    {props.children}
  </div>
);

export let Spinner = props => (
  <div role="status" className={classNames('nds-spinner', props.className)}>
    <span className="nds-assistive-text">Loading</span>
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <circle cy="50">
        <animateTransform
          attributeName="transform"
          dur="1s"
          type="translate"
          values="0 15 ; 0 -15; 0 15"
          repeatCount="indefinite"
          begin="0.1"
        />
      </circle>
      <circle cy="50">
        <animateTransform
          attributeName="transform"
          dur="1s"
          type="translate"
          values="0 10 ; 0 -10; 0 10"
          repeatCount="indefinite"
          begin="0.2"
        />
      </circle>
      <circle cy="50">
        <animateTransform
          attributeName="transform"
          dur="1s"
          type="translate"
          values="0 5 ; 0 -5; 0 5"
          repeatCount="indefinite"
          begin="0.3"
        />
      </circle>
    </svg>
  </div>
);

/// ///////////////////////////////////////////
// Export
/// ///////////////////////////////////////////

export default (
  <Demo>
    <Spinner className="nds-spinner_medium" />
  </Demo>
);

export let examples = [
  {
    id: 'without-container',
    label: 'Without Container',
    description:
      'A container is not required to use the spinner. Here, it is placed on a dark background to illustrate there is nothing there. The spinner will position itself to the closest positioned parent. So if you want it to spin over a single component, the class <code>.nds-is-relative</code> can be added to the parent.',
    element: (
      <Demo className="demo--inverse">
        <Spinner className="nds-spinner_medium" />
      </Demo>
    )
  },
  {
    id: 'with-container',
    label: 'With Container',
    description:
      'Here, the regular spinner container is used making the dark background look lighter. The spinner container will position itself to the closest positioned parent. So if you want it to spin over a single component, the class <code>.nds-is-relative</code> can be added to the parent.',
    element: (
      <Demo className="demo--inverse">
        <SpinnerContainer>
          <Spinner className="nds-spinner_medium" />
        </SpinnerContainer>
      </Demo>
    )
  },
  {
    id: 'fixed-container',
    label: 'Fixed Container',
    description:
      'The spinner container may be used with a container with fixed positioning by adding the <code>.nds-is-fixed</code> class to the container. This may be needed if you are dynamically loading portions of a component after the spinner is showing.',
    element: (
      <Demo className="demo--inverse">
        <SpinnerContainer className="nds-is-fixed">
          <Spinner className="nds-spinner_medium" />
        </SpinnerContainer>
      </Demo>
    )
  }
];
