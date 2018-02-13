// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import SvgIcon from '../../../shared/svg-icon';
import { Tile, TileMedia } from '../base/example';

export default (
  <div className="demo-only" style={{ width: '320px' }}>
    <ul className="nds-has-dividers_around-space">
      <li className="nds-item">
        <Tile title="Anypoint Connectors" className="nds-tile_board">
          <p className="nds-text-heading_medium">$500,000</p>
          <p className="nds-truncate" title="Company One">
            <a href="javascript:void(0);">Company One</a>
          </p>
          <p className="nds-truncate" title="Closing 9/30/2015">
            Closing 9/30/2015
          </p>
        </Tile>
      </li>
      <li className="nds-item">
        <Tile title="Cloudhub" className="nds-tile_board">
          <p className="nds-text-heading_medium">$185,000</p>
          <p className="nds-truncate" title="Company Two">
            <a href="javascript:void(0);">Company Two</a>
          </p>
          <p className="nds-truncate nds-has-alert" title="Closing 12/15/2015">
            Closing 12/15/2015
          </p>
          <span
            className="nds-icon_container nds-tile_board__icon"
            title="description of icon when needed"
          >
            <SvgIcon
              className="nds-icon nds-icon-text-warning nds-icon_x-small"
              sprite="utility"
              symbol="warning"
            />
            <span className="nds-assistive-text">Warning Icon</span>
          </span>
        </Tile>
      </li>
      <li className="nds-item">
        <Tile title="600 Widgets" className="nds-tile_board">
          <p className="nds-text-heading_medium">$35,000</p>
          <p className="nds-truncate" title="Company Three">
            <a href="javascript:void(0);">Company Three</a>
          </p>
          <p className="nds-truncate" title="Closing 10/12/2015">
            Closing 10/12/2015
          </p>
        </Tile>
      </li>
    </ul>
  </div>
);
