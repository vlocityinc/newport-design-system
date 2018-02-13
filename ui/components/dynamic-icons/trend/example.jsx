// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import _ from '../../../shared/helpers';
import classNames from 'classnames';

/* -----------------------------------------------------------------------------
    Private
----------------------------------------------------------------------------- */

let Trend = props => {
  const { assistiveText, ...rest } = props;

  return (
    <span {...rest} className={classNames('nds-icon-trend', props.className)}>
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <path
          className="nds-icon-trend__arrow"
          d="M.75 8H11M8 4.5L11.5 8 8 11.5"
        />
        <circle
          className="nds-icon-trend__circle"
          cy="8"
          cx="8"
          r="7.375"
          transform="rotate(-28 8 8) scale(-1 1) translate(-16 0)"
        />
      </svg>
      <span className="nds-assistive-text">{assistiveText}</span>
    </span>
  );
};

Trend.propTypes = {
  title: React.PropTypes.string.isRequired,
  assistiveText: React.PropTypes.string.isRequired
};

/* -----------------------------------------------------------------------------
    Exports
----------------------------------------------------------------------------- */

// Default
export default (
  <Trend
    data-nds-trend="neutral"
    className="nds-is-animated"
    title="Description of the icon"
    assistiveText="Text alternative"
  />
);

// States
export let states = [
  {
    id: 'down',
    label: 'Down',
    element: (
      <Trend
        data-nds-trend="down"
        className="nds-is-animated"
        title="Description of the icon"
        assistiveText="Text alternative"
      />
    )
  },
  {
    id: 'up',
    label: 'Up',
    element: (
      <Trend
        data-nds-trend="up"
        className="nds-is-animated"
        title="Description of the icon"
        assistiveText="Text alternative"
      />
    )
  },
  {
    id: 'static',
    label: 'Static (no animation)',
    element: (
      <Trend
        data-nds-trend="up"
        title="Description of the icon"
        assistiveText="Text alternative"
      />
    )
  },
  {
    id: 'paused',
    label: 'Paused',
    element: (
      <Trend
        data-nds-trend="up"
        className="nds-is-animated nds-is-paused"
        title="Description of the icon"
        assistiveText="Text alternative"
      />
    )
  }
];
