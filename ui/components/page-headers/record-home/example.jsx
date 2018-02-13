// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import Truncate from '../../../shared/truncate/index.react';
import Heading from '../../heading/index.react';
import { ButtonIcon } from '../../button-icons/base/example';
import SvgIcon from '../../../shared/svg-icon';
import { StandardIcon } from '../../icons/standard/example';
import { StatefulButton } from '../../buttons/stateful/example';

export let RecordHome = props => (
  <div className="nds-page-header">
    <div className="nds-grid">
      <div className="nds-col nds-has-flexi-truncate">
        <div className="nds-media nds-no-space nds-grow">
          <div className="nds-media__figure">
            <StandardIcon symbol="opportunity" assistiveText={false} />
          </div>
          <div className="nds-media__body">
            <nav>
              <ol className="nds-breadcrumb nds-line-height_reset">
                <li className="nds-breadcrumb__item">
                  <span>Opportunities</span>
                </li>
              </ol>
            </nav>
            <h1
              className="nds-page-header__title nds-m-right_small nds-align-middle nds-truncate"
              title="Acme - 1,200 Widgets"
            >
              Acme - 1,200 Widgets
            </h1>
          </div>
        </div>
      </div>
      <div className="nds-col nds-no-flex nds-grid nds-align-top">
        <StatefulButton className="nds-button_neutral nds-not-selected" />
        <div className="nds-button-group" role="group">
          <button className="nds-button nds-button_neutral">Edit</button>
          <button className="nds-button nds-button_neutral">Delete</button>
          <button className="nds-button nds-button_neutral">Clone</button>
          <div
            className="nds-dropdown-trigger nds-dropdown-trigger_click nds-button_last"
            aria-expanded="false"
          >
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
    <ul className="nds-grid nds-page-header__detail-row">
      <li className="nds-page-header__detail-block">
        <p
          className="nds-text-title nds-truncate nds-m-bottom_xx-small"
          title="Field 1"
        >
          Field 1
        </p>
        <p
          className="nds-text-body_regular nds-truncate"
          title="Description that demonstrates truncation with a long text field"
        >
          Description that demonstrates truncation with a long text field.
        </p>
      </li>
      <li className="nds-page-header__detail-block">
        <p
          className="nds-text-title nds-truncate nds-m-bottom_xx-small"
          title="Field2 (3)"
        >
          Field 2 (3)
          <ButtonIcon
            className="nds-button_icon"
            iconClassName="nds-button__icon_small"
            symbol="down"
            aria-haspopup="true"
            assistiveText="More Actions"
            title="More Actions"
          />
        </p>
        <p className="nds-text-body_regular">Multiple Values</p>
      </li>
      <li className="nds-page-header__detail-block">
        <p
          className="nds-text-title nds-truncate nds-m-bottom_xx-small"
          title="Field 3"
        >
          Field 3
        </p>
        <a href="javascript:void(0);">Hyperlink</a>
      </li>
      <li className="nds-page-header__detail-block">
        <p
          className="nds-text-title nds-truncate nds-m-bottom_xx-small"
          title="Field 4"
        >
          Field 4
        </p>
        <p title="Description (2-line truncation—must use JS to truncate).">
          Description (2-line truncati...
        </p>
      </li>
    </ul>
  </div>
);

export default <RecordHome />;
