// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import SvgIcon from '../../../shared/svg-icon';
import classNames from 'classnames';

export let DoctypeIcon = props => {
  const symbol = props.symbol || 'xml';
  return (
    <span
      className={classNames('nds-icon_container nds-icon-doctype-' + symbol)}
      title={props.title || 'Description of icon when needed'}
    >
      <SvgIcon
        className={classNames('nds-icon', props.className)}
        sprite="doctype"
        symbol={symbol}
      />
      <span className="nds-assistive-text">
        {props.assistiveText || 'Description of icon'}
      </span>
    </span>
  );
};

/// ///////////////////////////////////////////
// Export
/// ///////////////////////////////////////////

export default <DoctypeIcon />;
