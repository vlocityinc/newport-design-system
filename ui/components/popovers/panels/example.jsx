// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import SvgIcon from '../../../shared/svg-icon';
import MediaObject from '../../../utilities/media-objects/index.react';
import { ButtonIcon } from '../../button-icons/base/example';

const iconHeader = (
  <span className="nds-icon_container nds-icon-standard-account">
    <SvgIcon
      className="nds-icon nds-icon_small"
      sprite="standard"
      symbol="account"
    />
    <span className="nds-assistive-text">Tesla Motors</span>
  </span>
);
const iconOpportunity = (
  <span className="nds-icon_container nds-icon-standard-opportunity">
    <SvgIcon
      className="nds-icon nds-icon_small"
      sprite="standard"
      symbol="opportunity"
    />
    <span className="nds-assistive-text">Opportunities</span>
  </span>
);
const iconCases = (
  <span className="nds-icon_container nds-icon-standard-case">
    <SvgIcon
      className="nds-icon nds-icon_small"
      sprite="standard"
      symbol="case"
    />
    <span className="nds-assistive-text">Cases</span>
  </span>
);

const ViewAll = () => (
  <dd className="nds-m-top_x-small nds-text-align_right">
    <a href="javascript:void(0);" title="View all Opportunities">
      View All
    </a>
  </dd>
);

export default (
  <section
    aria-labelledby="panel-heading-id"
    className="nds-popover nds-popover_panel nds-nubbin_left-top"
    role="dialog"
  >
    <ButtonIcon
      className="nds-button_icon nds-button_icon-small nds-float_right nds-popover__close"
      symbol="close"
      assistiveText="Close dialog"
      title="Close dialog"
    />
    <div className="nds-popover__header">
      <header className="nds-media nds-media_center nds-m-bottom_small">
        <span className="nds-icon_container nds-icon-standard-account nds-media__figure">
          <SvgIcon
            className="nds-icon nds-icon_small"
            sprite="standard"
            symbol="account"
          />
        </span>
        <div className="nds-media__body">
          <h2
            className="nds-text-heading_medium nds-hyphenate"
            id="panel-heading-id"
          >
            <a href="javascript:void(0);">Tesla Motors</a>
          </h2>
        </div>
      </header>

      {/* Additional Info */}
      <footer className="nds-grid nds-wrap nds-grid_pull-padded">
        <div className="nds-p-horizontal_small nds-size_1-of-2 nds-p-bottom_x-small">
          <dl>
            <dt>
              <p
                className="nds-text-title_caps nds-truncate"
                title="Billing Address"
              >
                Billing Address
              </p>
            </dt>
            <dd>
              <p className="nds-truncate" title="3500 Deer Creek Rd.">
                3500 Deer Creek Rd.
              </p>
              <p className="nds-truncate" title="Palo Alto, CA 94304">
                Palo Alto, CA 94304
              </p>
            </dd>
          </dl>
        </div>

        <div className="nds-p-horizontal_small nds-size_1-of-2 nds-p-bottom_x-small">
          <dl>
            <dt>
              <p className="nds-text-title_caps nds-truncate" title="Phone">
                Phone
              </p>
            </dt>
            <dd>
              <a href="javascript:void(0);">212-345-3485</a>
            </dd>
          </dl>
        </div>

        <div className="nds-p-horizontal_small nds-size_1-of-2 nds-p-bottom_x-small">
          <dl>
            <dt>
              <p className="nds-text-title_caps nds-truncate" title="Website">
                Website
              </p>
            </dt>
            <dd>
              <a href="javascript:void(0);">teslamotors.com</a>
            </dd>
          </dl>
        </div>

        <div className="nds-p-horizontal_small nds-size_1-of-2 nds-p-bottom_x-small">
          <dl>
            <dt>
              <p
                className="nds-text-title_caps nds-truncate"
                title="Account Owner"
              >
                Account Owner
              </p>
            </dt>
            <dd>
              <a href="javascript:void(0);">Jeff Maguire</a>
            </dd>
          </dl>
        </div>
      </footer>
    </div>
    <div className="nds-popover__body">
      <dl className="nds-popover__body-list">
        <dt className="nds-m-bottom_small">
          <MediaObject figureLeft={iconOpportunity} flavor="center">
            <p className="nds-text-heading_small nds-hyphenate">
              Opportunities (2+)
            </p>
          </MediaObject>
        </dt>
        {/* Opportunity One */}
        <dd className="nds-m-top_x-small">
          <p className="nds-truncate" title="Tesla - Mule ESB">
            <a href="javascript:void(0);">Tesla - Mule ESB</a>
          </p>
          <dl className="nds-list_horizontal nds-wrap nds-text-body_small">
            <dt
              className="nds-item_label nds-text-color_weak nds-truncate"
              title="Value"
            >
              Value
            </dt>
            <dd
              className="nds-item_detail nds-text-color_weak nds-truncate"
              title="$500,000"
            >
              $500,000
            </dd>
            <dt
              className="nds-item_label nds-text-color_weak nds-truncate"
              title="Close Date"
            >
              Close Date
            </dt>
            <dd
              className="nds-item_detail nds-text-color_weak nds-truncate"
              title="Dec 15, 2015"
            >
              Dec 15, 2015
            </dd>
          </dl>
        </dd>
        {/* Opportunity Two */}
        <dd className="nds-m-top_x-small">
          <p className="nds-truncate" title="Tesla - Anypoint Studios">
            <a href="javascript:void(0);">Tesla - Anypoint Studios</a>
          </p>
          <dl className="nds-list_horizontal nds-wrap nds-text-body_small">
            <dt
              className="nds-item_label nds-text-color_weak nds-truncate"
              title="Value"
            >
              Value
            </dt>
            <dd
              className="nds-item_detail nds-text-color_weak nds-truncate"
              title="$60,000"
            >
              $60,000
            </dd>
            <dt
              className="nds-item_label nds-text-color_weak nds-truncate"
              title="Close Date"
            >
              Close Date
            </dt>
            <dd
              className="nds-item_detail nds-text-color_weak nds-truncate"
              title="Jan 15, 2016"
            >
              Jan 15, 2016
            </dd>
          </dl>
        </dd>
        <ViewAll />
      </dl>

      <dl className="nds-popover__body-list">
        <dt className="nds-m-bottom_small">
          <MediaObject figureLeft={iconCases} flavor="center">
            <p className="nds-text-heading_small nds-hyphenate">Cases (1)</p>
          </MediaObject>
        </dt>
        {/* Case One */}
        <dd className="nds-m-top_x-small">
          <p className="nds-truncate" title="Tesla - Anypoint Studios">
            <a href="javascript:void(0);">Tesla - Anypoint Studios</a>
          </p>
          <dl className="nds-list_horizontal nds-wrap nds-text-body_small">
            <dt
              className="nds-item_label nds-text-color_weak nds-truncate"
              title="Value"
            >
              Value
            </dt>
            <dd
              className="nds-item_detail nds-text-color_weak nds-truncate"
              title="$60,000"
            >
              $60,000
            </dd>
            <dt
              className="nds-item_label nds-text-color_weak nds-truncate"
              title="Close Date"
            >
              Close Date
            </dt>
            <dd
              className="nds-item_detail nds-text-color_weak nds-truncate"
              title="Jan 15, 2016"
            >
              Jan 15, 2016
            </dd>
          </dl>
        </dd>
        <ViewAll />
      </dl>
    </div>
  </section>
);
