// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import Truncate from '../../../shared/truncate/index.react';
import { ButtonIcon } from '../../button-icons/base/example';
import { StandardIcon } from '../../icons/standard/example';
import { UtilityIcon } from '../../icons/base/example';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter
} from '../../cards/base/example';
import SvgIcon from '../../../shared/svg-icon';
import Heading from '../../heading/index.react';
import classNames from 'classnames';

const icon = (
  <SvgIcon
    className="nds-button__icon nds-button__icon_right nds-no-flex"
    sprite="utility"
    symbol="down"
  />
);

const image = (
  <span className="nds-icon_container nds-icon-standard-lead">
    <SvgIcon className="nds-icon" sprite="standard" symbol="lead" />
  </span>
);

export let ObjectHome = props => (
  <div className={classNames('nds-page-header', props.className)}>
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
            <h1 className="nds-page-header__title nds-p-right_x-small">
              <button
                className="nds-button nds-button_reset nds-type-focus nds-truncate"
                aria-haspopup="true"
                title=""
              >
                <span className="nds-grid nds-has-flexi-truncate nds-grid_vertical-align-center">
                  <span className="nds-truncate" title="Recently Viewed">
                    Recently Viewed
                  </span>
                  <UtilityIcon
                    className="nds-icon--x-small nds-m-left_xx-small"
                    symbol="down"
                  />
                </span>
              </button>
            </h1>
          </div>
        </div>
      </div>
      <div className="nds-col nds-no-flex nds-grid nds-align-top nds-p-bottom_xx-small">
        <div className="nds-button-group" role="group">
          <button className="nds-button nds-button_neutral">New</button>
          <div className="nds-button_last">
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
    <div className="nds-grid">
      <div className="nds-col nds-align-middle">
        <p className="nds-text-body_small">
          10 items &bull; Updated 13 minutes ago
        </p>
      </div>
      <div className="nds-col nds-no-flex nds-grid nds-align-bottom">
        <div
          className="nds-dropdown-trigger nds-dropdown-trigger_click nds-m-left_x-small"
          aria-expanded="false"
        >
          <ButtonIcon
            className="nds-button_icon-more"
            symbol="settings"
            hasDropdown
            assistiveText="List View Controls"
            title="List View Controls"
          />
        </div>
        <div className="nds-dropdown-trigger nds-dropdown-trigger_click nds-m-left_xx-small">
          <ButtonIcon
            className="nds-button_icon-more"
            symbol="table"
            hasDropdown
            assistiveText="Change view"
            title="Change view"
          />
        </div>
        <ButtonIcon
          className="nds-m-left_xx-small nds-button_icon-border-filled"
          symbol="edit"
          assistiveText="Edit List"
          title="Edit List"
        />
        <ButtonIcon
          className="nds-m-left_xx-small nds-button_icon-border-filled"
          symbol="refresh"
          assistiveText="Refresh"
          title="Refresh"
        />
        <div className="nds-button-group" role="group">
          <ButtonIcon
            className="nds-button_icon-border-filled"
            symbol="chart"
            assistiveText="Charts"
            title="Charts"
          />
          <ButtonIcon
            className="nds-button_icon-border-filled"
            symbol="filterList"
            assistiveText="Filters"
            title="Filters"
          />
        </div>
      </div>
    </div>
  </div>
);

export default <ObjectHome />;

export let examples = [
  {
    id: 'card',
    label: 'Inside a card',
    element: (
      <div className="nds-card">
        <ObjectHome />
      </div>
    )
  },
  {
    id: 'tab-card',
    label: 'Inside a tabs card',
    element: (
      <div className="nds-tabs_card">
        <ObjectHome />
      </div>
    )
  }
];
