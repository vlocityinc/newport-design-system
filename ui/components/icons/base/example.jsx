// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import SvgIcon from '../../../shared/svg-icon';
import classNames from 'classnames';

export let UtilityIcon = props => {
  const symbol = props.symbol || 'announcement';
  return (
    <span
      className={classNames(
        'nds-icon_container nds-icon-utility-' + symbol,
        props.containerClassName
      )}
      title={
        props.title !== false ? (
          props.title || 'Description of icon when needed'
        ) : null
      }
    >
      <SvgIcon
        className={classNames('nds-icon', props.className)}
        sprite="utility"
        symbol={symbol}
      />
      {props.assistiveText != false ? (
        <span className="nds-assistive-text">
          {props.assistiveText || 'Description of icon'}
        </span>
      ) : null}
    </span>
  );
};

/// ///////////////////////////////////////////
// Export
/// ///////////////////////////////////////////

export default <UtilityIcon className="nds-icon-text-default" />;
