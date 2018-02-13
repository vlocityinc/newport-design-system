// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import MediaObject from '../../../utilities/media-objects/index.react';
import { TimelineIcon, TimelineActions } from '../base/example';

export let ActivityTimelineItem = props => (
  <div className="nds-timeline__item">
    <span className="nds-assistive-text">Call</span>
    <MediaObject
      figureRight={
        <TimelineActions
          title="More Options for Call, Mobile conversation"
          assistiveText="More Options for Call, Mobile conversation"
        />
      }
    >
      <MediaObject
        className="nds-timeline__media nds-timeline__media_call"
        figureLeft={<TimelineIcon symbol="log_a_call" />}
        figureLeftClassName="nds-timeline__icon"
      >
        <h3 className="nds-truncate" title="Mobile conversation on Monday">
          <a href="javascript:void(0);">Mobile conversation on Monday</a>
        </h3>
        <p
          className="nds-truncate"
          title="Lei seemed interested in closing this deal quickly! Let&rsquo;s move."
        >
          Lei seemed interested in closing this deal quickly! Let&rsquo;s move.
        </p>
        <ul className="nds-list_horizontal nds-wrap">
          <li className="nds-m-right_large">
            <span className="nds-text-title">Name:</span>
            <span className="nds-text-body_small">
              <a href="javascript:void(0);">Lei Chan</a>
            </span>
          </li>
          <li className="nds-m-right_large">
            <span className="nds-text-title">Assigned to:</span>
            <span className="nds-text-body_small">
              <a href="javascript:void(0);">Betty Mason</a>
            </span>
          </li>
        </ul>
      </MediaObject>
    </MediaObject>
  </div>
);

export default <ActivityTimelineItem />;
