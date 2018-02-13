// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import MediaObject from '../../../utilities/media-objects/index.react';
import { TimelineIcon, TimelineActions } from '../base/example';

export let ActivityTimelineItem = props => (
  <div className="nds-timeline__item">
    <span className="nds-assistive-text">Email</span>
    <MediaObject
      figureRight={
        <TimelineActions
          title="More Options for Email, Mobile conversation"
          assistiveText="More Options for Email, Mobile conversation"
        />
      }
    >
      <MediaObject
        className="nds-timeline__media nds-timeline__media_email"
        figureLeft={<TimelineIcon symbol="email" />}
        figureLeftClassName="nds-timeline__icon"
      >
        <h3 className="nds-truncate" title="Mobile conversation on Monday">
          <a href="javascript:void(0);">Mobile conversation on Monday</a>
        </h3>
        <p
          className="nds-truncate"
          title="Hi guys, Thanks for meeting with the team today and going through the proposals we saw. This goes on until it&rsquo;s truncated."
        >
          Hi guys, Thanks for meeting with the team today and going through the
          proposals we saw. This goes on until it&rsquo;s truncated.
        </p>
        <ul className="nds-list_horizontal nds-wrap">
          <li className="nds-truncate_container_50 nds-m-right_large nds-grid">
            <span className="nds-text-title">To:</span>
            <span
              className="nds-text-body_small nds-m-left_xx-small nds-truncate"
              title="Lei Chan with Long Name that might go on for quite some distance futher than you might expect"
            >
              <a href="javascript:void(0);">
                Lei Chan with Long Name that might go on for quite some distance
                futher than you might expect
              </a>
            </span>
            <span className="nds-no-flex nds-text-body_small"> + 44 more</span>
          </li>
          <li className="nds-m-right_large">
            <span className="nds-text-title">From:</span>
            <span className="nds-text-body_small">
              <a href="javascript:void(0);">Jason Dewar</a>
            </span>
          </li>
        </ul>
      </MediaObject>
    </MediaObject>
  </div>
);

export default <ActivityTimelineItem />;
