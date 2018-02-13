// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import SvgIcon from '../../../shared/svg-icon';
import { TileMedia } from '../base/example';

const icon = (
  <span className="nds-icon_container" title="description of icon when needed">
    <SvgIcon className="nds-icon" sprite="doctype" symbol="zip" />
  </span>
);

export default (
  <ul className="nds-has-dividers_bottom-space">
    <li className="nds-item">
      <TileMedia title="NDS_038.zip" media={icon}>
        <ul className="nds-list_horizontal nds-has-dividers_right">
          <li className="nds-item">May 9th, 2015</li>
          <li className="nds-item">3.6mb</li>
        </ul>
      </TileMedia>
    </li>
    <li className="nds-item">
      <TileMedia title="NDS_038.zip" media={icon}>
        <ul className="nds-list_horizontal nds-has-dividers_right">
          <li className="nds-item">May 9th, 2015</li>
          <li className="nds-item">3.6mb</li>
        </ul>
      </TileMedia>
    </li>
    <li className="nds-item">
      <TileMedia title="NDS_038.zip" media={icon}>
        <ul className="nds-list_horizontal nds-has-dividers_right">
          <li className="nds-item">May 9th, 2015</li>
          <li className="nds-item">3.6mb</li>
        </ul>
      </TileMedia>
    </li>
  </ul>
);
