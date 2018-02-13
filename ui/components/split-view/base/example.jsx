// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import SvgIcon from '../../../shared/svg-icon';
import classNames from 'classnames';
import _ from '../../../shared/helpers';
import { ButtonIcon } from '../../button-icons/base/example';

const results = [
  {
    unread: true,
    colOne: 'Riley Shultz',
    colTwo: '99',
    colThree: 'Biotech, Inc.',
    colFour: 'Nurturing'
  },
  {
    unread: true,
    colOne: 'Jason A. - VP of Sales',
    colTwo: '92',
    colThree: 'Case Management Solutions',
    colFour: 'Contacted'
  },
  {
    unread: true,
    colOne: 'Josh Smith',
    colTwo: '90',
    colThree: 'Acme, Inc.',
    colFour: 'Contacted'
  },
  {
    unread: true,
    colOne: 'Bobby Tree',
    colTwo: '89',
    colThree: 'Salesforce, Inc.',
    colFour: 'Closing'
  },
  {
    selected: true,
    colOne: 'Riley Shultz',
    colTwo: '74',
    colThree: 'Tesla',
    colFour: 'Contacted'
  },
  {
    unread: true,
    colOne: 'Andy Smith',
    colTwo: '72',
    colThree: 'Universal Technologies',
    colFour: 'New'
  },
  {
    colOne: 'Jim Steele',
    colTwo: '71',
    colThree: 'BigList, Inc.',
    colFour: 'New'
  },
  {
    colOne: 'John Gardner',
    colTwo: '70',
    colThree: '3C Systems',
    colFour: 'Contacted'
  },
  {
    colOne: 'Sarah Loehr',
    colTwo: '68',
    colThree: 'MedLife, Inc.',
    colFour: 'New'
  }
];

/// ////////////////////////////////////////
// Partial(s)
/// ////////////////////////////////////////

let SplitView = props => (
  <div
    className={classNames(
      'nds-split-view_container',
      props.hidden ? 'nds-is-closed' : 'nds-is-open'
    )}
  >
    <ButtonIcon
      aria-controls="split-view-id"
      aria-expanded={props.hidden ? 'false' : 'true'}
      className={classNames(
        'nds-button_icon nds-split-view__toggle-button',
        props.hidden ? 'nds-is-closed' : 'nds-is-open'
      )}
      iconClassName="nds-button__icon_x-small"
      symbol="left"
      assistiveText={props.hidden ? 'Open Split View' : 'Close Split View'}
      title={props.hidden ? 'Open Split View' : 'Close Split View'}
    />
    <article
      aria-hidden={props.hidden ? 'true' : 'false'}
      id="split-view-id"
      className={classNames(
        'nds-split-view nds-grid nds-grid_vertical nds-grow',
        props.className
      )}
    >
      <header className="nds-split-view__header">
        <div className="nds-grid nds-grid_vertical-align-center nds-m-bottom_xx-small">
          <div className="nds-has-flexi-truncate">
            <div className="nds-media nds-media_center">
              <div className="nds-media__figure">
                <div className="nds-icon_container nds-icon-standard-lead">
                  <SvgIcon
                    className="nds-icon"
                    sprite="standard"
                    symbol="lead"
                  />
                  <span className="nds-assistive-text">Leads</span>
                </div>
              </div>
              <div className="nds-media__body">
                <h1 className="nds-text-heading_small nds-text-color_default nds-p-right_x-small">
                  <button
                    className="nds-button nds-button_reset nds-type-focus nds-truncate"
                    aria-haspopup="true"
                    title=""
                  >
                    <span className="nds-grid nds-has-flexi-truncate nds-grid_vertical-align-center">
                      <span className="nds-truncate" title="My Leads">
                        My Leads
                      </span>
                      <SvgIcon
                        className="nds-button__icon nds-button__icon_right nds-no-flex"
                        sprite="utility"
                        symbol="down"
                      />
                    </span>
                  </button>
                </h1>
              </div>
            </div>
          </div>
          <div className="nds-no-flex nds-grid">
            <ButtonIcon
              className="nds-button_icon-border-filled"
              symbol="down"
              aria-haspopup="true"
              assistiveText="More Actions"
              title="More Actions"
            />
          </div>
        </div>
        <div className="nds-grid nds-grid_vertical-align-center">
          <p className="nds-text-body_small nds-text-color_weak">
            42 items &bull; Updated just now
          </p>
          <div className="nds-no-flex nds-grid nds-col_bump-left">
            <div className="nds-button-group">
              <ButtonIcon
                hasDropdown
                className="nds-button_icon nds-button_icon-container-more"
                symbol="side_list"
                title="Display As Split View"
                assistiveText="Display As Split View"
              />
            </div>
            <div className="nds-button-group">
              <ButtonIcon
                className="nds-button_icon nds-button_icon-container"
                symbol="refresh"
                title="Refresh List"
                assistiveText="Refresh List"
              />
            </div>
          </div>
        </div>
      </header>
      <div className="nds-grid nds-grid_vertical">
        <div className="nds-split-view__list-header nds-grid nds-text-title_caps">
          <span className="nds-assistive-text">Sorted by:</span>
          <span>
            Lead Score
            <SvgIcon
              className="nds-icon nds-icon_xx-small nds-icon-text-default nds-align-top"
              sprite="utility"
              symbol="arrowdown"
            />
          </span>
          <span className="nds-assistive-text">- Descending</span>
        </div>
        <ul
          aria-multiselectable="true"
          className="nds-scrollable_y"
          role="listbox"
          aria-label="Select an item to open it in a new workspace tab."
        >
          {props.children}
        </ul>
      </div>
    </article>
  </div>
);

let Row = props => (
  <li
    className={classNames(
      'nds-split-view__list-item',
      props.className,
      props.unread ? 'nds-is-unread' : null
    )}
    role="presentation"
  >
    <a
      href="javascript:void(0);"
      aria-selected={!!props.selected}
      role="option"
      className="nds-split-view__list-item-action nds-grow nds-has-flexi-truncate"
      tabIndex={props.tabIndex}
    >
      {props.unread ? (
        <abbr
          className="nds-indicator_unread"
          title="Unread Item"
          aria-label="Unread Item"
        >
          <span className="nds-assistive-text">●</span>
        </abbr>
      ) : null}
      <div className="nds-grid nds-wrap">
        <span
          className="nds-truncate nds-text-body_regular nds-text-color_default"
          title={props.colOne || 'Object Name'}
        >
          {props.colOne || 'Column 1'}
        </span>
        <span
          className="nds-truncate nds-col_bump-left"
          title={props.colTwo || 'Column 2'}
        >
          {props.colTwo || 'Column 2'}
        </span>
      </div>
      <div className="nds-grid nds-wrap">
        <span className="nds-truncate" title={props.colThree || 'Column 3'}>
          {props.colThree || 'Column 3'}
        </span>
        <span
          className="nds-truncate nds-col_bump-left"
          title={props.colFour || 'Column 4'}
        >
          {props.colFour || 'Column 4'}
        </span>
      </div>
    </a>
  </li>
);

/// ////////////////////////////////////////
// Export
/// ////////////////////////////////////////

export default (
  <div
    className="demo-only"
    style={{ display: 'flex', width: '20rem', height: '37.5rem' }}
  >
    <SplitView>
      {results
        .slice(0, 5)
        .map((result, i) => (
          <Row
            key={i}
            colOne={result.colOne}
            colTwo={result.colTwo}
            colThree={result.colThree}
            colFour={result.colFour}
            tabIndex={i === 0 ? 0 : -1}
          />
        ))}
    </SplitView>
  </div>
);

export let states = [
  {
    id: 'selected-item',
    label: 'Selected Item',
    element: (
      <div
        className="demo-only"
        style={{ display: 'flex', width: '20rem', height: '37.5rem' }}
      >
        <SplitView>
          {results
            .slice(0, 5)
            .map((result, i) => (
              <Row
                key={i}
                selected={result.selected}
                colOne={result.colOne}
                colTwo={result.colTwo}
                colThree={result.colThree}
                colFour={result.colFour}
                tabIndex={i === 0 ? 0 : -1}
              />
            ))}
        </SplitView>
      </div>
    )
  },
  {
    id: 'overflow',
    label: 'Overflow',
    element: (
      <div
        className="demo-only"
        style={{ display: 'flex', width: '20rem', height: '37.5rem' }}
      >
        <SplitView>
          {results.map((result, i) => (
            <Row
              key={i}
              colOne={result.colOne}
              colTwo={result.colTwo}
              colThree={result.colThree}
              colFour={result.colFour}
              tabIndex={i === 0 ? 0 : -1}
            />
          ))}
        </SplitView>
      </div>
    )
  },
  {
    id: 'unread',
    label: 'Unread Items',
    element: (
      <div
        className="demo-only"
        style={{ display: 'flex', width: '20rem', height: '37.5rem' }}
      >
        <SplitView>
          {results.map((result, i) => (
            <Row
              key={i}
              unread={result.unread}
              colOne={result.colOne}
              colTwo={result.colTwo}
              colThree={result.colThree}
              colFour={result.colFour}
              tabIndex={i === 0 ? 0 : -1}
            />
          ))}
        </SplitView>
      </div>
    )
  },
  {
    id: 'panel-collapsed',
    label: 'Collapsed Panel',
    element: (
      <div
        className="demo-only"
        style={{ display: 'flex', width: '20rem', height: '37.5rem' }}
      >
        <SplitView hidden>
          {results.map((result, i) => (
            <Row
              key={i}
              unread={result.unread}
              colOne={result.colOne}
              colTwo={result.colTwo}
              colThree={result.colThree}
              colFour={result.colFour}
              tabIndex={i === 0 ? 0 : -1}
            />
          ))}
        </SplitView>
      </div>
    )
  }
];
