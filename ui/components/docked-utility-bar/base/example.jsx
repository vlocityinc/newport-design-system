// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import SvgIcon from '../../../shared/svg-icon';
import { ButtonIcon } from '../../button-icons/base/example';
import classNames from 'classnames';

/// ////////////////////////////////////////
// Partial(s)
/// ////////////////////////////////////////

export let UtilityPanel = props => (
  <section
    className={classNames(
      'nds-utility-panel nds-grid nds-grid_vertical',
      props.className
    )}
    role="dialog"
    aria-labelledby="panel-heading-01"
  >
    <header className="nds-utility-panel__header nds-grid nds-shrink-none">
      <div className="nds-media nds-media_center">
        <div className="nds-media__figure nds-m-right_x-small">
          <span className="nds-icon_container">
            <SvgIcon
              className="nds-icon nds-icon_small nds-icon-text-default"
              sprite="standard"
              symbol="call"
            />
          </span>
        </div>
        <div className="nds-media__body">
          <h2 id="panel-heading-01">{props.header || 'Header'}</h2>
        </div>
      </div>
      <div className="nds-col_bump-left nds-shrink-none">
        <ButtonIcon
          className="nds-button_icon"
          symbol="minimize_window"
          assistiveText="Close Panel"
          title="Close Panel"
        />
      </div>
    </header>
    <div className="nds-utility-panel__body">{props.children}</div>
  </section>
);

export let UtilityBarItem = props => (
  <li
    className={classNames(
      'nds-utility-bar__item',
      { 'nds-has-notification': props.notification },
      props.className
    )}
  >
    <button
      className={classNames('nds-button nds-utility-bar__action', {
        'nds-is-active': props.active
      })}
      aria-pressed={!!props.active}
    >
      {props.notification ? (
        <abbr
          className="nds-indicator_unread"
          title="Unread Item"
          aria-label="Unread Item"
        >
          <span className="nds-assistive-text">●</span>
        </abbr>
      ) : null}
      <SvgIcon
        className="nds-button__icon nds-button__icon_left"
        sprite="utility"
        symbol={props.symbol}
      />
      <span className="nds-utility-bar__text">{props.children}</span>
    </button>
  </li>
);

export let UtilityBar = props => (
  <footer className="nds-utility-bar_container" aria-label="Utility Bar">
    <h2 className="nds-assistive-text">Utility Bar</h2>
    <ul className="nds-utility-bar">{props.children}</ul>
    {props.panel}
  </footer>
);

const PanelOpen = (
  <UtilityPanel className="nds-is-open" header="Call">
    <div className="nds-align_absolute-center">Utility Panel Body</div>
  </UtilityPanel>
);

/// ////////////////////////////////////////
// Export
/// ////////////////////////////////////////

export const Context = props => (
  <div style={{ height: '540px' }}>{props.children}</div>
);

export default (
  <UtilityBar
    panel={
      <UtilityPanel header="Call">
        <div className="nds-align_absolute-center">Utility Panel Body</div>
      </UtilityPanel>
    }
  >
    <UtilityBarItem symbol="call">Call</UtilityBarItem>
    <UtilityBarItem symbol="clock">History</UtilityBarItem>
    <UtilityBarItem symbol="note">Notes</UtilityBarItem>
    <UtilityBarItem symbol="omni_channel">
      <span className="nds-m-bottom_xxx-small">Online</span>
      <span>Omni-Channel</span>
    </UtilityBarItem>
  </UtilityBar>
);

export let states = [
  {
    id: 'open',
    label: 'Panel Open',
    element: (
      <UtilityBar panel={PanelOpen}>
        <UtilityBarItem symbol="call" active>
          Call
        </UtilityBarItem>
        <UtilityBarItem symbol="clock">History</UtilityBarItem>
        <UtilityBarItem symbol="note">Notes</UtilityBarItem>
        <UtilityBarItem symbol="omni_channel">
          <span className="nds-m-bottom_xxx-small">Online</span>
          <span>Omni-Channel</span>
        </UtilityBarItem>
      </UtilityBar>
    )
  },
  {
    id: 'notification',
    label: 'Item has notification',
    element: (
      <UtilityBar>
        <UtilityBarItem symbol="call">Call</UtilityBarItem>
        <UtilityBarItem symbol="clock">History</UtilityBarItem>
        <UtilityBarItem symbol="note">Notes</UtilityBarItem>
        <UtilityBarItem symbol="omni_channel" notification>
          <span className="nds-m-bottom_xxx-small">Online</span>
          <span>Omni-Channel</span>
        </UtilityBarItem>
      </UtilityBar>
    )
  }
];
