// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import SvgIcon from '../../../shared/svg-icon';
import { ButtonIcon } from '../../button-icons/base/example';
import { Checkbox } from '../../checkbox/base/example';
import classNames from 'classnames';

/// ////////////////////////////////////////
// Partial(s)
/// ////////////////////////////////////////

export let Tile = props => (
  <article
    className={classNames(
      'nds-tile',
      props.className,
      props.actions ? 'nds-hint-parent' : null
    )}
  >
    {props.actions ? (
      <div className="nds-grid nds-grid_align-spread nds-has-flexi-truncate">
        <h3
          className="nds-tile__title nds-truncate"
          title={props.title || 'Title'}
        >
          <a href="javascript:void(0);">{props.title || 'Title'}</a>
        </h3>
        <div className="nds-shrink-none">
          <ButtonIcon
            className="nds-button_icon-border-filled nds-button_icon-x-small"
            iconClassName="nds-button__icon_hint"
            symbol="down"
            aria-haspopup="true"
            assistiveText="More options"
            title="More options"
          />
        </div>
      </div>
    ) : (
      <h3
        className="nds-tile__title nds-truncate"
        title={props.title || 'Title'}
      >
        <a href="javascript:void(0);">{props.title || 'Title'}</a>
      </h3>
    )}
    <div className="nds-tile__detail">
      {props.children ? props.children : <Detail />}
    </div>
  </article>
);

export let TileMedia = props => (
  <article
    className={classNames(
      'nds-tile nds-media',
      props.className,
      props.actions ? 'nds-hint-parent' : null
    )}
  >
    {props.media ? (
      <div className="nds-media__figure">{props.media}</div>
    ) : null}
    <div className="nds-media__body">
      {props.actions ? (
        <div className="nds-grid nds-grid_align-spread nds-has-flexi-truncate">
          <h3
            className="nds-tile__title nds-truncate"
            title={props.title || 'Title'}
          >
            <a href="javascript:void(0);">{props.title || 'Title'}</a>
          </h3>
          <div className="nds-shrink-none">
            <ButtonIcon
              className="nds-button_icon-border-filled nds-button_icon-x-small"
              iconClassName="nds-button__icon_hint"
              symbol="down"
              aria-haspopup="true"
              assistiveText="More options"
              title="More options"
            />
          </div>
        </div>
      ) : (
        <h3
          className="nds-tile__title nds-truncate"
          title={props.title || 'Title'}
        >
          <a href="javascript:void(0);">{props.title || 'Title'}</a>
        </h3>
      )}
      <div className="nds-tile__detail">
        {props.children ? props.children : <Detail />}
      </div>
    </div>
  </article>
);

let Detail = props => (
  <dl className="nds-list_horizontal nds-wrap">
    <dt
      className="nds-item_label nds-text-color_weak nds-truncate"
      title="First Label"
    >
      First Label:
    </dt>
    <dd
      className="nds-item_detail nds-truncate"
      title="Description for first label"
    >
      Description for first label
    </dd>
    <dt
      className="nds-item_label nds-text-color_weak nds-truncate"
      title="Second Label"
    >
      Second Label:
    </dt>
    <dd
      className="nds-item_detail nds-truncate"
      title="Description for second label"
    >
      Description for second label
    </dd>
  </dl>
);

const icon = (
  <span className="nds-icon_container" title="description of icon when needed">
    <SvgIcon
      className="nds-icon nds-icon-standard-groups"
      sprite="standard"
      symbol="groups"
    />
  </span>
);

const avatar = (
  <span className="nds-avatar nds-avatar_circle nds-avatar_medium">
    <img
      alt=""
      src="/assets/images/avatar2.jpg"
      title="Lexee L. Jackson avatar"
    />
  </span>
);

/// ////////////////////////////////////////
// Export
/// ////////////////////////////////////////

export default (
  <div className="demo-only" style={{ width: '30rem' }}>
    <Tile title="Salesforce UX" />
  </div>
);

export let examples = [
  {
    id: 'with-action',
    label: 'Default with actions',
    element: (
      <div className="demo-only" style={{ width: '30rem' }}>
        <Tile title="Salesforce UX" actions />
      </div>
    )
  },
  {
    id: 'with-icon',
    label: 'With icon',
    element: (
      <div className="demo-only" style={{ width: '30rem' }}>
        <TileMedia title="Salesforce UX" media={icon} />
      </div>
    )
  },
  {
    id: 'with-avatar',
    label: 'With avatar',
    element: (
      <div className="demo-only" style={{ width: '30rem' }}>
        <TileMedia title="Lexee L. Jackson" media={avatar} />
      </div>
    )
  },
  {
    id: 'task',
    label: 'Task',
    element: (
      <div className="demo-only" style={{ width: '320px' }}>
        <TileMedia
          title="Contact Trammel Crow Company"
          media={
            <Checkbox
              label="Did you complete the task: Contact Trammel Crow Company?"
              hideLabel
            />
          }
        >
          <p className="nds-truncate" title="Assignee">
            Assignee
          </p>
        </TileMedia>
      </div>
    )
  },
  {
    id: 'article',
    label: 'Article',
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
    id: 'article-liker-bar',
    label: 'Article With like bar',
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
  },
  {
    id: 'board',
    label: 'Board',
    element: (
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
              <p
                className="nds-truncate nds-has-alert"
                title="Closing 12/15/2015"
              >
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
    )
  },
  {
    id: 'brand',
    label: 'Brand',
    element: (
      <div className="demo-only" style={{ width: '320px' }}>
        <ul className="nds-has-dividers_around-space">
          <li>
            <Tile title="Anypoint Connectors" className="nds-tile_brand">
              <p className="nds-text-heading_medium">$500,000</p>
              <p className="nds-truncate" title="Company One">
                <a href="javascript:void(0);">Company One</a>
              </p>
              <p className="nds-truncate" title="Closing 9/30/2015">
                Closing 9/30/2015
              </p>
            </Tile>
          </li>
          <li>
            <Tile title="Cloudhub" className="nds-tile_brand">
              <p className="nds-text-heading_medium">$185,000</p>
              <p className="nds-truncate" title="Company Two">
                <a href="javascript:void(0);">Company Two</a>
              </p>
              <p
                className="nds-truncate nds-has-alert"
                title="Closing 12/15/2015"
              >
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
          <li>
            <Tile title="600 Widgets" className="nds-tile_brand">
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
    )
  }
];
