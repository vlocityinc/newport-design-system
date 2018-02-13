// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import classNames from 'classnames';
import SvgIcon from '../../../shared/svg-icon';
import { ButtonIcon } from '../../button-icons/base/example';
import _ from '../../../shared/helpers';

/// ///////////////////////////////////////////
// State Constructor(s)
/// ///////////////////////////////////////////

let Subtab = props => (
  <li
    className={classNames(
      'nds-tabs_default__item nds-sub-tabs__item nds-grid nds-grid_vertical-align-center',
      {
        'nds-has-notification': props.hasNotification,
        'nds-has-focus': props.hasFocus,
        'nds-active': props.active
      },
      props.className
    )}
    role="presentation"
  >
    <a
      aria-controls={props.tabPanelId}
      aria-selected={props.active ? 'true' : 'false'}
      className="nds-tabs_default__link nds-p-horizontal_xx-small"
      href="javascript:void(0);"
      id={props.tabItemId}
      role="tab"
      tabIndex={props.active ? '0' : '-1'}
      title={props.title || 'Subtab Name'}
    >
      {props.itemUnsaved ? (
        <abbr
          className="nds-indicator_unsaved"
          title="Tab Not Saved"
          aria-label="Tab Not Saved"
        >
          *
        </abbr>
      ) : null}
      {props.hasNotification && (
        <span
          aria-label="New Activity"
          className="nds-indicator_unread"
          role="alert"
          title="New Activity"
        >
          <span className="nds-assistive-text">
            New activity in Tab: {props.title || 'Subtab Name'}
          </span>
        </span>
      )}
      <div
        className="nds-icon_container"
        title={_.startCase(props.symbol) || 'Case'}
      >
        <SvgIcon
          className="nds-icon nds-icon_small nds-icon-text-default"
          sprite="standard"
          symbol={props.symbol || 'case'}
        />
        <span className="nds-assistive-text">
          {_.startCase(props.symbol) || 'Case'}:
        </span>
      </div>
      <span
        className={classNames(
          'nds-truncate',
          props.pinned ? 'nds-assistive-text' : null
        )}
        title={props.title || 'Subtab Name'}
      >
        {props.title || 'Subtab Name'}
      </span>
    </a>
    {props.menuIcon ? (
      <div
        className={classNames(
          'nds-dropdown-trigger nds-dropdown-trigger_click nds-p-left_none nds-p-right_none',
          props.actionOverflow == 'true' ? 'nds-is-open' : null
        )}
      >
        <ButtonIcon
          className="nds-button_icon-container nds-button_icon-x-small"
          tabIndex={props.active ? '0' : '-1'}
          symbol="chevrondown"
          aria-haspopup="true"
          assistiveText={'Actions for ' + props.title}
          title={'Actions for ' + props.title}
        />
      </div>
    ) : null}
    <div
      className={classNames(
        'nds-col_bump-left nds-p-left_none nds-p-right_none',
        props.pinned ? 'nds-assistive-text' : null
      )}
    >
      <ButtonIcon
        className="nds-button_icon-container nds-button_icon-x-small"
        tabIndex={props.active ? '0' : '-1'}
        symbol="close"
        assistiveText={'Close ' + props.title}
        title={'Close ' + props.title}
      />
    </div>
  </li>
);

/// ///////////////////////////////////////////
// Export
/// ///////////////////////////////////////////

export default (
  <div className="nds-tabs_default nds-sub-tabs">
    <ul className="nds-tabs_default__nav" role="tablist">
      <Subtab
        active
        title="00071938"
        tabItemId="subtab-tabitem-01"
        tabPanelId="subtab-tabpanel-01"
      />
      <Subtab
        title="Chat - Customer"
        tabItemId="subtab-tabitem-02"
        tabPanelId="subtab-tabpanel-02"
        symbol="live_chat"
      />
    </ul>
    <div
      className="nds-tabs_default__content nds-show"
      id="subtab-tabpanel-01"
      role="tabpanel"
      aria-labelledby="subtab-tabitem-01"
    >
      Item One Content
    </div>
    <div
      className="nds-tabs_default__content nds-hide"
      id="subtab-tabpanel-02"
      role="tabpanel"
      aria-labelledby="subtab-tabitem-02"
    >
      Item Two Content
    </div>
  </div>
);

export let states = [
  {
    id: 'subtabs-has-focus',
    label: 'Tab - Focus',
    element: (
      <div className="nds-tabs_default nds-sub-tabs">
        <ul className="nds-tabs_default__nav" role="tablist">
          <Subtab
            title="00071938"
            id="subtab-01"
            active
            hasFocus
            tabItemId="subtab-tabitem-01"
            tabPanelId="subtab-tabpanel-01"
          />
          <Subtab
            title="Chat - Customer"
            tabItemId="subtab-tabitem-02"
            tabPanelId="subtab-tabpanel-02"
            symbol="live_chat"
          />
        </ul>
        <div
          className="nds-tabs_default__content nds-show"
          id="subtab-tabpanel-01"
          role="tabpanel"
          aria-labelledby="subtab-tabitem-01"
        >
          Item One Content
        </div>
        <div
          className="nds-tabs_default__content nds-hide"
          id="subtab-tabpanel-02"
          role="tabpanel"
          aria-labelledby="subtab-tabitem-02"
        >
          Item Two Content
        </div>
      </div>
    ),
    script: `
      document.getElementById('subtab-01').focus()
    `
  },
  {
    id: 'subtabs-unsaved',
    label: 'Unsaved Tab',
    element: (
      <div className="nds-tabs_default nds-sub-tabs">
        <ul className="nds-tabs_default__nav" role="tablist">
          <Subtab
            title="00071938"
            active
            itemUnsaved
            tabItemId="subtab-tabitem-01"
            tabPanelId="subtab-tabpanel-01"
          />
          <Subtab
            title="Chat - Customer"
            tabItemId="subtab-tabitem-02"
            tabPanelId="subtab-tabpanel-02"
            symbol="live_chat"
          />
        </ul>
        <div
          className="nds-tabs_default__content nds-show"
          id="subtab-tabpanel-01"
          role="tabpanel"
          aria-labelledby="subtab-tabitem-01"
        >
          Item One Content
        </div>
        <div
          className="nds-tabs_default__content nds-hide"
          id="subtab-tabpanel-02"
          role="tabpanel"
          aria-labelledby="subtab-tabitem-02"
        >
          Item Two Content
        </div>
      </div>
    )
  },
  {
    id: 'subtabs-borders',
    label: 'With Borders',
    element: (
      <div className="nds-tabs_default nds-sub-tabs">
        <ul className="nds-tabs_default__nav" role="tablist">
          <Subtab
            title="00071938"
            active
            className="nds-border_right nds-border_left"
            tabItemId="subtab-tabitem-01"
            tabPanelId="subtab-tabpanel-01"
          />
          <Subtab
            title="Chat - Customer"
            tabItemId="subtab-tabitem-02"
            tabPanelId="subtab-tabpanel-02"
            symbol="live_chat"
            className="nds-border_right"
          />
        </ul>
        <div
          className="nds-tabs_default__content nds-show"
          id="subtab-tabpanel-01"
          role="tabpanel"
          aria-labelledby="subtab-tabitem-01"
        >
          Item One Content
        </div>
        <div
          className="nds-tabs_default__content nds-hide"
          id="subtab-tabpanel-02"
          role="tabpanel"
          aria-labelledby="subtab-tabitem-02"
        >
          Item Two Content
        </div>
      </div>
    )
  },
  {
    id: 'subtabs-menu',
    label: 'Tab - Action Overflow',
    element: (
      <div className="nds-tabs_default nds-sub-tabs">
        <ul className="nds-tabs_default__nav" role="tablist">
          <Subtab
            title="00071938"
            active
            menuIcon
            tabItemId="subtab-tabitem-01"
            tabPanelId="subtab-tabpanel-01"
          />
          <Subtab
            title="Chat - Customer"
            tabItemId="subtab-tabitem-02"
            tabPanelId="subtab-tabpanel-02"
            symbol="live_chat"
            menuIcon
          />
        </ul>
        <div
          className="nds-tabs_default__content nds-show"
          id="subtab-tabpanel-01"
          role="tabpanel"
          aria-labelledby="subtab-tabitem-01"
        >
          Item One Content
        </div>
        <div
          className="nds-tabs_default__content nds-hide"
          id="subtab-tabpanel-02"
          role="tabpanel"
          aria-labelledby="subtab-tabitem-02"
        >
          Item Two Content
        </div>
      </div>
    )
  },
  {
    id: 'subtabs-notification',
    label: 'Tab Notification',
    element: (
      <div className="nds-tabs_default nds-sub-tabs">
        <ul className="nds-tabs_default__nav" role="tablist">
          <Subtab
            title="00071938"
            active
            tabItemId="subtab-tabitem-01"
            tabPanelId="subtab-tabpanel-01"
          />
          <Subtab
            title="Chat - Customer"
            hasNotification
            tabItemId="subtab-tabitem-02"
            tabPanelId="subtab-tabpanel-02"
            symbol="live_chat"
          />
        </ul>
        <div
          className="nds-tabs_default__content nds-show"
          id="subtab-tabpanel-01"
          role="tabpanel"
          aria-labelledby="subtab-tabitem-01"
        >
          Item One Content
        </div>
        <div
          className="nds-tabs_default__content nds-hide"
          id="subtab-tabpanel-02"
          role="tabpanel"
          aria-labelledby="subtab-tabitem-02"
        >
          Item Two Content
        </div>
      </div>
    )
  }
];
