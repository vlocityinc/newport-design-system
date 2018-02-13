// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import SvgIcon from '../../../shared/svg-icon';
import { Tile, TileMedia } from '../base/example';
import classNames from 'classnames';

/// ////////////////////////////////////////
// Export
/// ////////////////////////////////////////

export let states = [
  {
    id: 'tile-article',
    label: 'Default',
    element: (
      <div className="demo-only" style={{ width: '320px' }}>
        <Tile title="Company One beats Company Two to the 200-mile affordable electric car">
          <p>by Steve Author</p>
          <ul className="nds-list_horizontal nds-has-dividers_right">
            <li className="nds-item">Breaking News</li>
            <li className="nds-item">1 day ago</li>
          </ul>
        </Tile>
      </div>
    )
  },
  {
    id: 'tile-article-liker-bar',
    label: 'With like bar',
    element: (
      <div className="demo-only" style={{ width: '320px' }}>
        <Tile title="Company One beats Company Two to the 200-mile affordable electric car">
          <p>
            ...an introduction for beginners about climbing ropes and how they
            can use...
          </p>
          <ul className="nds-list_horizontal nds-has-dividers_right nds-m-top_xx-small">
            <li className="nds-item">000001296</li>
            <li className="nds-item">Published</li>
            <li className="nds-item">How to Guide</li>
          </ul>
          <p>Last Modified: 1/14/16</p>
          <ul className="nds-list_horizontal nds-m-top_xx-small">
            <li className="nds-m-right_small">
              <button
                className="nds-button nds-button_icon nds-button_icon-border nds-button_icon-x-small"
                aria-pressed="false"
              >
                <SvgIcon
                  className="nds-button__icon"
                  sprite="utility"
                  symbol="like"
                />
                <span className="nds-assistive-text">Upvote</span>
              </button>
              <span className="nds-align-middle">1320</span>
            </li>
            <li>
              <button
                className="nds-button nds-button_icon nds-button_icon-border nds-button_icon-x-small"
                aria-pressed="false"
              >
                <SvgIcon
                  className="nds-button__icon"
                  sprite="utility"
                  symbol="dislike"
                />
                <span className="nds-assistive-text">Downvote</span>
              </button>
              <span className="nds-align-middle">362</span>
            </li>
          </ul>
        </Tile>
      </div>
    )
  }
];
