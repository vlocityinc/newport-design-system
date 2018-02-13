// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import MediaObject from '../../../utilities/media-objects/index.react';
import SvgIcon from '../../../shared/svg-icon';

const Image = (
  <SvgIcon
    className="nds-icon nds-icon-standard-opportunity"
    sprite="standard"
    symbol="opportunity"
  />
);

const Button = <button className="nds-button nds-button_neutral">New</button>;

export default (
  <div className="nds-page-header" role="banner">
    <MediaObject flavor="center" figureLeft={Image} figureRight={Button}>
      <p
        className="nds-page-header__title nds-truncate"
        title="Rohde Corp - 80,000 Widgets"
      >
        Opportunities
      </p>
    </MediaObject>
  </div>
);
