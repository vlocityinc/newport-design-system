// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import SvgIcon from '../../../shared/svg-icon';
import classNames from 'classnames';
import { UtilityIcon } from '../../icons/base/example';

/// ////////////////////////////////////////
// Partial(s)
/// ////////////////////////////////////////

export let VisualPickerMediaObject = props => (
  <a
    href="javascript:void(0);"
    className={classNames(
      'nds-box nds-box_link nds-box_x-small nds-media',
      props.className
    )}
  >
    <div className="nds-media__figure nds-media__figure_fixed-width nds-align_absolute-center nds-m-left_xx-small">
      <UtilityIcon className="nds-icon-text-default" symbol="knowledge_base" />
    </div>
    <div className="nds-media__body nds-border_left nds-p-around_small">
      {props.children}
    </div>
  </a>
);

/// ////////////////////////////////////////
// Export
/// ////////////////////////////////////////

export default (
  <div className="demo-only" style={{ width: '24rem' }}>
    <VisualPickerMediaObject symbol="user">
      <h2
        className="nds-truncate nds-text-heading_small"
        title="Share the knowledge"
      >
        Share the knowledge
      </h2>
      <p className="nds-m-top_small">
        Harness your team's collective know-how with our powerful knowledge base
      </p>
    </VisualPickerMediaObject>
  </div>
);
