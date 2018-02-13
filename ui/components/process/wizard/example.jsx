// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';

export default (
  <div className="demo-only">
    <div className="nds-wizard" role="navigation">
      <ol className="nds-wizard__list">
        <li className="nds-wizard__item nds-is-active">
          <a href="javascript:void(0);" className="nds-wizard__link">
            <span className="nds-wizard__marker" />
            <span
              className="nds-wizard__label nds-text-title_caps nds-truncate"
              title="Navigation"
            >
              Navigation
            </span>
          </a>
        </li>
        <li className="nds-wizard__item nds-is-active">
          <a href="javascript:void(0);" className="nds-wizard__link">
            <span className="nds-wizard__marker" />
            <span
              className="nds-wizard__label nds-text-title_caps nds-truncate"
              title="Actions"
            >
              Actions
            </span>
          </a>
        </li>
        <li className="nds-wizard__item nds-is-active">
          <a href="javascript:void(0);" className="nds-wizard__link">
            <span className="nds-wizard__marker" />
            <span
              className="nds-wizard__label nds-text-title_caps nds-truncate"
              title="Compact Layout"
            >
              Compact Layout
            </span>
          </a>
        </li>
        <li className="nds-wizard__item">
          <a href="javascript:void(0);" className="nds-wizard__link">
            <span className="nds-wizard__marker" />
            <span
              className="nds-wizard__label nds-text-title_caps nds-truncate"
              title="Review"
            >
              Review
            </span>
          </a>
        </li>
        <li className="nds-wizard__item">
          <a href="javascript:void(0);" className="nds-wizard__link">
            <span className="nds-wizard__marker" />
            <span
              className="nds-wizard__label nds-text-title_caps nds-truncate"
              title="Invite"
            >
              Invite
            </span>
          </a>
        </li>
      </ol>
      <span className="nds-wizard__progress">
        <span className="nds-wizard__progress-bar" style={{ width: '50%' }} />
      </span>
    </div>
  </div>
);
