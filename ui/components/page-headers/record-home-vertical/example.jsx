// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import Truncate from '../../../shared/truncate/index.react';
import Heading from '../../heading/index.react';
import { ButtonIcon } from '../../button-icons/base/example';
import MediaObject from '../../../utilities/media-objects/index.react';
import SvgIcon from '../../../shared/svg-icon';

const image = (
  <div className="nds-icon_container nds-icon-standard-lead">
    <SvgIcon className="nds-icon" sprite="standard" symbol="lead" />
    <span className="nds-assistive-text">Lead</span>
  </div>
);

export default (
  <div className="demo-only" style={{ width: '300px' }}>
    <div className="nds-page-header nds-page-header_vertical">
      <div className="nds-grid nds-grid_vertical">
        <div>
          <MediaObject
            flavor="center"
            figureLeft={image}
            className="nds-no-space nds-has-divider_bottom-space"
          >
            <h1 className="nds-page-header__title nds-align-middle">
              Record Title
            </h1>
          </MediaObject>
        </div>
        <div className="nds-has-divider_bottom-space">
          <button
            className="nds-button nds-button_stateful nds-button_neutral nds-not-selected"
            aria-live="assertive"
          >
            <span className="nds-text-not-selected">
              <SvgIcon
                className="nds-button__icon_stateful nds-button__icon_left"
                sprite="utility"
                symbol="add"
              />Follow
            </span>
            <span className="nds-text-selected">
              <SvgIcon
                className="nds-button__icon_stateful nds-button__icon_left"
                sprite="utility"
                symbol="check"
              />Following
            </span>
            <span className="nds-text-selected-focus">
              <SvgIcon
                className="nds-button__icon_stateful nds-button__icon_left"
                sprite="utility"
                symbol="close"
              />Unfollow
            </span>
          </button>
          <div
            className="nds-button-group nds-m-left_none nds-m-top_x-small"
            role="group"
          >
            <button className="nds-button nds-button_neutral">Convert</button>
            <button className="nds-button nds-button_neutral">Clone</button>
            <button className="nds-button nds-button_neutral">Edit</button>
            <div className="nds-dropdown-trigger nds-dropdown-trigger_click nds-button_last">
              <ButtonIcon
                className="nds-button_icon-border-filled"
                symbol="down"
                aria-haspopup="true"
                assistiveText="More Actions"
                title="More Actions"
              />
            </div>
          </div>
        </div>
      </div>
      <ul className="nds-list_vertical-space-medium nds-m-left_xx-small">
        <li className="nds-item">
          <div className="nds-text-title nds-m-bottom_xx-small">Field 1</div>
          <div
            className="nds-text-body_regular"
            title="Description that demonstrates truncation with a long text field"
          >
            Description that demonstrates a long text field and will eventually
            wrap.
          </div>
        </li>
        <li className="nds-item">
          <div className="nds-text-title nds-m-bottom_xx-small">Field 2</div>
          <div className="nds-text-body_regular" title="Hyperlink">
            <a href="javascript:void(0);">Hyperlink</a>
          </div>
        </li>
        <li className="nds-item">
          <div className="nds-text-title nds-m-bottom_xx-small">Field 3</div>
          <div className="nds-truncate" title="Description">
            Description
          </div>
        </li>
        <li className="nds-item">
          <div className="nds-text-title nds-m-bottom_xx-small">
            <button
              className="nds-button nds-text-link_reset"
              aria-haspopup="true"
            >
              Field 4 (3)
              <SvgIcon
                className="nds-button__icon nds-button__icon_small"
                sprite="utility"
                symbol="down"
              />
            </button>
          </div>
          <div className="nds-text-body_regular">
            <div>1 Market St</div>
            <div>San Francisco, CA 94105</div>
          </div>
        </li>
        <li className="nds-item">
          <div className="nds-text-title nds-m-bottom_xx-small">Field 5</div>
          <div className="nds-text-body_regular" title="Description">
            Description
          </div>
        </li>
        <li className="nds-item">
          <div className="nds-text-title nds-m-bottom_xx-small">Field 6</div>
          <div className="nds-text-body_regular" title="Description">
            Description
          </div>
        </li>
        <li className="nds-item">
          <div
            className="nds-text-title nds-truncate nds-m-bottom_xx-small"
            title="Field 7"
          >
            Field 7
          </div>
          <div className="nds-text-body_regular" title="Description">
            Description
          </div>
        </li>
      </ul>
    </div>
  </div>
);
