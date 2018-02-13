// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import { StandardIcon } from '../../icons/standard/example';

export default (
  <div className="nds-page-header">
    <div className="nds-media">
      <div className="nds-media__figure">
        <StandardIcon
          className="nds-page-header__icon"
          symbol="opportunity"
          assistiveText={false}
        />
      </div>
      <div className="nds-media__body">
        <h1
          className="nds-page-header__title nds-truncate nds-align-middle"
          title="Rohde Corp - 80,000 Widgets"
        >
          Rohde Corp - 80,000 Widgets
        </h1>
        <p className="nds-text-body_small nds-line-height_reset">
          Mark Jaeckal &bull; Unlimited Customer &bull; 11/13/15
        </p>
      </div>
    </div>
  </div>
);
