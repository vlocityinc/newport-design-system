// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import SvgIcon from '../../../shared/svg-icon';
import { Menu, MenuList, MenuItem } from '../../menus/dropdown/example';
import { WaffleIcon } from '../../dynamic-icons/waffle/example';
import { ButtonIcon } from '../../button-icons/base/example';
import classNames from 'classnames';
import _ from '../../../shared/helpers';

const tabPanelId01 = 'context-tab-panel-1';
const tabPanelId02 = 'context-tab-panel-2';
const tabPanelId03 = 'context-tab-panel-3';
const tabId01 = 'context-tab-id-1';
const tabId02 = 'context-tab-id-2';
const tabId03 = 'context-tab-id-3';

/// ///////////////////////////////////////////
// Partial(s)
/// ///////////////////////////////////////////

let ShortCutKey = props => (
  <span className="nds-text-body_small nds-text-color_weak nds-p-left_large">
    <span className="nds-assistive-text">:</span>
    {props.children}
  </span>
);

// Context Tab
let ContextTab = props => (
  <li
    className={classNames(
      'nds-context-bar__item nds-context-bar__item_tab',
      props.className,
      {
        'nds-is-active': props.itemActive,
        'nds-is-unsaved': props.itemUnsaved,
        'nds-is-pinned': props.pinned,
        'nds-has-notification': props.itemUnread
      }
    )}
    role="presentation"
  >
    <a
      href="javascript:void(0);"
      className="nds-context-bar__label-action"
      role="tab"
      title={props.title || 'tab name'}
      aria-selected={props.itemActive ? 'true' : 'false'}
      tabIndex={props.itemActive ? '0' : '-1'}
      aria-controls={props.tabPanelId}
      id={props.id}
    >
      {props.itemUnsaved ? (
        <abbr className="nds-indicator_unsaved" title="Tab Not Saved">
          *
        </abbr>
      ) : null}
      {props.itemUnread && (
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
          {_.startCase(props.symbol) || 'Case'}
        </span>
      </div>
      <span
        className={classNames(
          'nds-truncate',
          props.pinned ? 'nds-assistive-text' : null
        )}
        title={props.title || 'tab name'}
      >
        {props.title || 'tab name'}
      </span>
    </a>
    <div
      className={classNames(
        'nds-context-bar__icon-action nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-p-left_none nds-p-right_none',
        props.actionOverflow == 'true' ? 'nds-is-open' : null
      )}
    >
      <ButtonIcon
        className="nds-button_icon-container nds-button_icon-x-small"
        tabIndex={props.itemActive ? '0' : '-1'}
        symbol="chevrondown"
        aria-haspopup="true"
        assistiveText={'Actions for ' + props.title}
        title={'Actions for ' + props.title}
      />
      <Menu className="nds-dropdown_right">
        <MenuList>
          <MenuItem iconRight={<ShortCutKey>r</ShortCutKey>}>
            Refresh Tab
          </MenuItem>
          <MenuItem iconRight={<ShortCutKey>⇧ + n</ShortCutKey>}>
            Open in a new window
          </MenuItem>
          <MenuItem iconRight={<ShortCutKey>p</ShortCutKey>}>Pin Tab</MenuItem>
          <MenuItem iconRight={<ShortCutKey>w</ShortCutKey>}>
            Close Tab
          </MenuItem>
        </MenuList>
      </Menu>
    </div>
    {!props.pinned ? (
      <div className="nds-context-bar__icon-action nds-col_bump-left nds-p-left_none">
        <ButtonIcon
          className="nds-button_icon-container nds-button_icon-x-small"
          tabIndex={props.itemActive ? '0' : '-1'}
          symbol="close"
          assistiveText={'Close ' + props.title}
          title={'Close ' + props.title}
        />
      </div>
    ) : null}
  </li>
);

let ContextTabPanel = props => (
  <div
    id={props.id}
    className={classNames(
      'nds-p-vertical_medium',
      props.show ? 'nds-show' : 'nds-hide'
    )}
    role="tabpanel"
    aria-labelledby={props.tabId}
  >
    {props.children}
  </div>
);

/// ///////////////////////////////////////////
// State Constructor(s)
/// ///////////////////////////////////////////

export let ContextTabBar = props => (
  <div
    className={classNames(
      'nds-context-bar nds-context-bar_tabs',
      props.className
    )}
  >
    <div className="nds-context-bar__primary">
      <div className="nds-context-bar__item nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-no-hover">
        <div className="nds-context-bar__icon-action">
          <WaffleIcon className="nds-context-bar__button" />
        </div>
        <span className="nds-context-bar__label-action nds-context-bar__app-name">
          <span className="nds-truncate" title={props.appName || 'App Name'}>
            {props.appName || 'App Name'}
          </span>
        </span>
      </div>

      <div
        className={classNames(
          'nds-context-bar__item nds-context-bar__object-switcher nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click',
          props.objectSwitchClassName
        )}
      >
        <a href="javascript:void(0);" className="nds-context-bar__label-action">
          <span className="nds-truncate" title="Object">
            Object
          </span>
        </a>
        <div className="nds-context-bar__icon-action">
          <ButtonIcon
            className="nds-button_icon-container nds-button_icon-x-small"
            symbol="chevrondown"
            aria-haspopup="true"
            assistiveText="Open object switcher menu"
            title="Open object switcher menu"
          />
        </div>
        <Menu className="nds-dropdown_right">
          <MenuList>
            <MenuItem>
              <SvgIcon
                className="nds-icon nds-icon_small nds-icon-standard-account nds-m-right_small"
                sprite="standard"
                symbol="account"
              />
              Accounts
            </MenuItem>
            <MenuItem>
              <SvgIcon
                className="nds-icon nds-icon_small nds-icon-standard-case nds-m-right_small"
                sprite="standard"
                symbol="case"
              />
              Cases
            </MenuItem>
            <MenuItem>
              <SvgIcon
                className="nds-icon nds-icon_small nds-icon-standard-work-order nds-m-right_small"
                sprite="standard"
                symbol="work_order"
              />
              Insights
            </MenuItem>
          </MenuList>
        </Menu>
      </div>
      <div
        className={classNames(
          'nds-context-bar__item nds-dropdown-trigger nds-dropdown-trigger_click',
          props.addTabClassName
        )}
      >
        <div className="nds-context-bar__icon-action">
          <ButtonIcon
            className={classNames(
              'nds-button_icon-container nds-button_icon-small',
              props.splitViewActive ? 'nds-is-selected' : null
            )}
            symbol="side_list"
            assistiveText="Toggle split view"
            title="Toggle split view"
            aria-expanded={props.splitViewActive ? 'true' : 'false'}
            aria-controls="id_of_split_view_container"
          />
        </div>
      </div>
      <div className="nds-context-bar__vertical-divider" />
      <div
        className={classNames(
          'nds-context-bar__item nds-dropdown-trigger nds-dropdown-trigger_click',
          props.addTabActive ? 'nds-is-open' : null,
          props.addTabClassName
        )}
      >
        <div className="nds-context-bar__icon-action">
          <ButtonIcon
            className="nds-button_icon-container nds-button_icon-small"
            symbol="add"
            assistiveText="Open a New Tab"
            title="Open a New Tab"
          />
        </div>
        {props.addTabActive ? (
          <section
            className="nds-popover nds-nubbin_top"
            role="dialog"
            aria-label="Add tab by URL or ID"
            style={{
              position: 'absolute',
              left: '1.125rem',
              top: '2.75rem',
              marginLeft: '-10rem'
            }}
          >
            <div className="nds-popover__body">
              <div className="nds-form-element">
                <label
                  className="nds-form-element__label"
                  htmlFor="text-input-01"
                >
                  Add Page by URL or ID
                </label>
                <div className="nds-form-element__control nds-grid">
                  <input
                    id="text-input-01"
                    className="nds-input"
                    type="text"
                    placeholder="Placeholder Text"
                  />
                  <button
                    className="nds-button nds-button_brand nds-shrink-none nds-m-left_small"
                    type="submit"
                  >
                    Add Tab
                  </button>
                </div>
              </div>
            </div>
          </section>
        ) : null}
      </div>
    </div>

    <div className="nds-context-bar__secondary">
      <div className="nds-context-bar__vertical-divider" />
      <ul className="nds-grid" role="tablist">
        {props.children}
      </ul>
    </div>
  </div>
);

/// ///////////////////////////////////////////
// Export
/// ///////////////////////////////////////////

export const Context = props => (
  <div style={{ height: '16rem' }}>{props.children}</div>
);

export default (
  <div className="demo-only">
    <ContextTabBar>
      <ContextTab
        title="Home"
        symbol="home"
        tabPanelId={tabPanelId01}
        id={tabId01}
        itemActive
      />
      <ContextTab title="Tab Item 1" tabPanelId={tabPanelId02} id={tabId02} />
      <ContextTab title="Tab Item 2" tabPanelId={tabPanelId03} id={tabId03} />
    </ContextTabBar>
    <ContextTabPanel show id={tabPanelId01} tabId={tabId01}>
      Tab Home Content
    </ContextTabPanel>
    <ContextTabPanel id={tabPanelId02} tabId={tabId02}>
      Tab One Content
    </ContextTabPanel>
    <ContextTabPanel id={tabPanelId03} tabId={tabId03}>
      Tab Two Content
    </ContextTabPanel>
  </div>
);

export let states = [
  {
    id: 'split-view',
    label: 'Split View - Active',
    element: (
      <div className="demo-only">
        <ContextTabBar splitViewActive>
          <ContextTab
            title="Home"
            symbol="home"
            tabPanelId={tabPanelId01}
            id={tabId01}
            itemActive
          />
          <ContextTab
            title="Tab Item 1"
            tabPanelId={tabPanelId02}
            id={tabId02}
          />
          <ContextTab
            title="Tab Item 2"
            tabPanelId={tabPanelId03}
            id={tabId03}
          />
        </ContextTabBar>
        <ContextTabPanel show id={tabPanelId01} tabId={tabId01}>
          Tab Home Content
        </ContextTabPanel>
        <ContextTabPanel id={tabPanelId02} tabId={tabId02}>
          Tab One Content
        </ContextTabPanel>
        <ContextTabPanel id={tabPanelId03} tabId={tabId03}>
          Tab Two Content
        </ContextTabPanel>
      </div>
    )
  },
  {
    id: 'tab-active',
    label: 'Tab - Active',
    element: (
      <div className="demo-only">
        <ContextTabBar>
          <ContextTab
            title="Home"
            symbol="home"
            tabPanelId={tabPanelId01}
            id={tabId01}
          />
          <ContextTab
            title="Tab Item 1"
            tabPanelId={tabPanelId02}
            id={tabId02}
            itemActive
          />
          <ContextTab
            title="Tab Item 2"
            tabPanelId={tabPanelId03}
            id={tabId03}
          />
        </ContextTabBar>
        <ContextTabPanel id={tabPanelId01} tabId={tabId01}>
          Tab Home Content
        </ContextTabPanel>
        <ContextTabPanel show id={tabPanelId02} tabId={tabId02}>
          Tab One Content
        </ContextTabPanel>
        <ContextTabPanel id={tabPanelId03} tabId={tabId03}>
          Tab Two Content
        </ContextTabPanel>
      </div>
    )
  },
  {
    id: 'tab-active-focus',
    label: 'Tab - Active Focus',
    element: (
      <div className="demo-only">
        <ContextTabBar>
          <ContextTab
            title="Home"
            symbol="home"
            tabPanelId={tabPanelId01}
            id={tabId01}
          />
          <ContextTab
            title="Tab Item 1"
            tabPanelId={tabPanelId02}
            id={tabId02}
            itemActive
            className="nds-has-focus"
          />
          <ContextTab
            title="Tab Item 2"
            tabPanelId={tabPanelId03}
            id={tabId03}
          />
        </ContextTabBar>
        <ContextTabPanel id={tabPanelId01} tabId={tabId01}>
          Tab Home Content
        </ContextTabPanel>
        <ContextTabPanel show id={tabPanelId02} tabId={tabId02}>
          Tab One Content
        </ContextTabPanel>
        <ContextTabPanel id={tabPanelId03} tabId={tabId03}>
          Tab Two Content
        </ContextTabPanel>
      </div>
    )
  },
  {
    id: 'tab-item-action-menu-open',
    label: 'Tab - Action Overflow',
    element: (
      <div className="demo-only" style={{ height: '12rem' }}>
        <ContextTabBar>
          <ContextTab
            title="Home"
            symbol="home"
            tabPanelId={tabPanelId01}
            id={tabId01}
          />
          <ContextTab
            title="Tab Item 1"
            tabPanelId={tabPanelId02}
            id={tabId02}
            itemActive
            actionOverflow="true"
          />
          <ContextTab
            title="Tab Item 2"
            tabPanelId={tabPanelId03}
            id={tabId03}
          />
        </ContextTabBar>
        <ContextTabPanel id={tabPanelId01} tabId={tabId01}>
          Tab Home Content
        </ContextTabPanel>
        <ContextTabPanel show id={tabPanelId02} tabId={tabId02}>
          Tab One Content
        </ContextTabPanel>
        <ContextTabPanel id={tabPanelId03} tabId={tabId03}>
          Tab Two Content
        </ContextTabPanel>
      </div>
    )
  },
  {
    id: 'unsaved-tab',
    label: 'Unsaved Tab',
    element: (
      <div className="demo-only">
        <ContextTabBar>
          <ContextTab
            title="Home"
            symbol="home"
            tabPanelId={tabPanelId01}
            id={tabId01}
            itemActive
          />
          <ContextTab
            title="Tab Item 1"
            tabPanelId={tabPanelId02}
            id={tabId02}
          />
          <ContextTab
            title="Tab Item 2"
            tabPanelId={tabPanelId03}
            id={tabId03}
            itemUnsaved
          />
        </ContextTabBar>
        <ContextTabPanel show id={tabPanelId01} tabId={tabId01}>
          Tab Home Content
        </ContextTabPanel>
        <ContextTabPanel id={tabPanelId02} tabId={tabId02}>
          Tab One Content
        </ContextTabPanel>
        <ContextTabPanel id={tabPanelId03} tabId={tabId03}>
          Tab Two Content
        </ContextTabPanel>
      </div>
    )
  },
  {
    id: 'unread-tab',
    label: 'Unread Tab',
    element: (
      <div className="demo-only">
        <ContextTabBar>
          <ContextTab
            title="Home"
            symbol="home"
            tabPanelId={tabPanelId01}
            id={tabId01}
            itemActive
          />
          <ContextTab
            title="Tab Item 1"
            tabPanelId={tabPanelId02}
            id={tabId02}
          />
          <ContextTab
            title="Chat - Customer"
            tabPanelId={tabPanelId03}
            id={tabId03}
            symbol="live_chat"
            itemUnread
          />
        </ContextTabBar>
        <ContextTabPanel show id={tabPanelId01} tabId={tabId01}>
          Tab Home Content
        </ContextTabPanel>
        <ContextTabPanel id={tabPanelId02} tabId={tabId02}>
          Tab One Content
        </ContextTabPanel>
        <ContextTabPanel id={tabPanelId03} tabId={tabId03}>
          Tab Two Content
        </ContextTabPanel>
      </div>
    )
  },
  {
    id: 'unread-unsaved-tab',
    label: 'Unread/Unsaved Tab',
    element: (
      <div className="demo-only">
        <ContextTabBar>
          <ContextTab
            title="Home"
            symbol="home"
            tabPanelId={tabPanelId01}
            id={tabId01}
            itemActive
          />
          <ContextTab
            title="Tab Item 1"
            tabPanelId={tabPanelId02}
            id={tabId02}
          />
          <ContextTab
            title="Chat - Customer"
            tabPanelId={tabPanelId03}
            id={tabId03}
            symbol="live_chat"
            itemUnread
            itemUnsaved
          />
        </ContextTabBar>
        <ContextTabPanel show id={tabPanelId01} tabId={tabId01}>
          Tab Home Content
        </ContextTabPanel>
        <ContextTabPanel id={tabPanelId02} tabId={tabId02}>
          Tab One Content
        </ContextTabPanel>
        <ContextTabPanel id={tabPanelId03} tabId={tabId03}>
          Tab Two Content
        </ContextTabPanel>
      </div>
    )
  },
  {
    id: 'pinned-tab',
    label: 'Pinned Tab',
    element: (
      <div className="demo-only">
        <ContextTabBar>
          <ContextTab
            title="Home"
            symbol="home"
            tabPanelId={tabPanelId01}
            id={tabId01}
            pinned
          />
          <ContextTab
            title="Tab Item 1"
            tabPanelId={tabPanelId02}
            id={tabId02}
            itemActive
          />
          <ContextTab
            title="Tab Item 2"
            tabPanelId={tabPanelId03}
            id={tabId03}
          />
        </ContextTabBar>
        <ContextTabPanel id={tabPanelId01} tabId={tabId01}>
          Tab Home Content
        </ContextTabPanel>
        <ContextTabPanel show id={tabPanelId02} tabId={tabId02}>
          Tab One Content
        </ContextTabPanel>
        <ContextTabPanel id={tabPanelId03} tabId={tabId03}>
          Tab Two Content
        </ContextTabPanel>
      </div>
    )
  },
  {
    id: 'pinned-tab-active',
    label: 'Pinned Tab - Active',
    element: (
      <div className="demo-only">
        <ContextTabBar>
          <ContextTab
            title="Home"
            symbol="home"
            tabPanelId={tabPanelId01}
            id={tabId01}
            itemActive
            pinned
          />
          <ContextTab
            title="Tab Item 1"
            tabPanelId={tabPanelId02}
            id={tabId02}
          />
          <ContextTab
            title="Tab Item 2"
            tabPanelId={tabPanelId03}
            id={tabId03}
          />
        </ContextTabBar>
        <ContextTabPanel show id={tabPanelId01} tabId={tabId01}>
          Tab Home Content
        </ContextTabPanel>
        <ContextTabPanel id={tabPanelId02} tabId={tabId02}>
          Tab One Content
        </ContextTabPanel>
        <ContextTabPanel id={tabPanelId03} tabId={tabId03}>
          Tab Two Content
        </ContextTabPanel>
      </div>
    )
  },
  {
    id: 'pinned-tab-active-focus',
    label: 'Pinned Tab - Active Focus',
    element: (
      <div className="demo-only">
        <ContextTabBar>
          <ContextTab
            title="Home"
            symbol="home"
            tabPanelId={tabPanelId01}
            id={tabId01}
            itemActive
            pinned
            className="nds-has-focus"
          />
          <ContextTab
            title="Tab Item 1"
            tabPanelId={tabPanelId02}
            id={tabId02}
          />
          <ContextTab
            title="Tab Item 2"
            tabPanelId={tabPanelId03}
            id={tabId03}
          />
        </ContextTabBar>
        <ContextTabPanel show id={tabPanelId01} tabId={tabId01}>
          Tab Home Content
        </ContextTabPanel>
        <ContextTabPanel id={tabPanelId02} tabId={tabId02}>
          Tab One Content
        </ContextTabPanel>
        <ContextTabPanel id={tabPanelId03} tabId={tabId03}>
          Tab Two Content
        </ContextTabPanel>
      </div>
    )
  },
  {
    id: 'unsaved-pinned-tab',
    label: 'Unsaved Pinned Tab',
    element: (
      <div className="demo-only">
        <ContextTabBar>
          <ContextTab
            title="Home"
            symbol="home"
            tabPanelId={tabPanelId01}
            id={tabId01}
            pinned
            itemUnsaved
          />
          <ContextTab
            title="Tab Item 1"
            tabPanelId={tabPanelId02}
            id={tabId02}
            itemActive
          />
          <ContextTab
            title="Tab Item 2"
            tabPanelId={tabPanelId03}
            id={tabId03}
          />
        </ContextTabBar>
        <ContextTabPanel id={tabPanelId01} tabId={tabId01}>
          Tab Home Content
        </ContextTabPanel>
        <ContextTabPanel show id={tabPanelId02} tabId={tabId02}>
          Tab One Content
        </ContextTabPanel>
        <ContextTabPanel id={tabPanelId03} tabId={tabId03}>
          Tab Two Content
        </ContextTabPanel>
      </div>
    )
  },
  {
    id: 'unread-pinned-tab',
    label: 'Unread Pinned Tab',
    element: (
      <div className="demo-only">
        <ContextTabBar>
          <ContextTab
            title="Chat - Customer"
            symbol="live_chat"
            tabPanelId={tabPanelId01}
            id={tabId01}
            pinned
            itemUnread
          />
          <ContextTab
            title="Tab Item 1"
            tabPanelId={tabPanelId02}
            id={tabId02}
            itemActive
          />
          <ContextTab
            title="Tab Item 2"
            tabPanelId={tabPanelId03}
            id={tabId03}
          />
        </ContextTabBar>
        <ContextTabPanel id={tabPanelId01} tabId={tabId01}>
          Tab Home Content
        </ContextTabPanel>
        <ContextTabPanel show id={tabPanelId02} tabId={tabId02}>
          Tab One Content
        </ContextTabPanel>
        <ContextTabPanel id={tabPanelId03} tabId={tabId03}>
          Tab Two Content
        </ContextTabPanel>
      </div>
    )
  },
  {
    id: 'overflow-tabs',
    label: 'Overflow Tabs',
    element: (
      <div className="demo-only">
        <ContextTabBar>
          <ContextTab
            title="Home"
            symbol="home"
            tabPanelId={tabPanelId01}
            id={tabId01}
            itemActive
          />
          <ContextTab
            title="Tab Item 1"
            tabPanelId={tabPanelId02}
            id={tabId02}
          />
          <ContextTab
            title="Tab Item 2"
            tabPanelId={tabPanelId03}
            id={tabId03}
          />
          <li className="nds-context-bar__item nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click">
            <button
              className="nds-button nds-context-bar__label-action"
              aria-haspopup="true"
            >
              <span
                className="nds-p-left_xx-small nds-truncate"
                title="More Tab Items"
              >
                More <span className="nds-assistive-text">Tabs</span>
              </span>
              <SvgIcon
                className="nds-button__icon nds-button__icon_small nds-button__icon_right"
                sprite="utility"
                symbol="chevrondown"
              />
            </button>
          </li>
        </ContextTabBar>
        <ContextTabPanel show id={tabPanelId01} tabId={tabId01}>
          Tab Home Content
        </ContextTabPanel>
        <ContextTabPanel id={tabPanelId02} tabId={tabId02}>
          Tab One Content
        </ContextTabPanel>
        <ContextTabPanel id={tabPanelId03} tabId={tabId03}>
          Tab Two Content
        </ContextTabPanel>
      </div>
    )
  },
  {
    id: 'overflow-tabs-open',
    label: 'Overflow Tabs - Open',
    element: (
      <div className="demo-only" style={{ height: '8rem' }}>
        <ContextTabBar>
          <ContextTab
            title="Home"
            symbol="home"
            tabPanelId={tabPanelId01}
            id={tabId01}
            itemActive
          />
          <ContextTab
            title="Tab Item 1"
            tabPanelId={tabPanelId02}
            id={tabId02}
          />
          <ContextTab
            title="Tab Item 2"
            tabPanelId={tabPanelId03}
            id={tabId03}
          />
          <li className="nds-context-bar__item nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-is-open">
            <button
              className="nds-button nds-context-bar__label-action"
              aria-haspopup="true"
            >
              <span
                className="nds-p-left_xx-small nds-truncate"
                title="More Tab Items"
              >
                More <span className="nds-assistive-text">Tabs</span>
              </span>
              <SvgIcon
                className="nds-button__icon nds-button__icon_small nds-button__icon_right"
                sprite="utility"
                symbol="chevrondown"
              />
            </button>
            <Menu className="nds-dropdown_right">
              <MenuList>
                <MenuItem>
                  <SvgIcon
                    className="nds-icon nds-icon_small nds-icon-text-default"
                    sprite="standard"
                    symbol="case"
                  />
                  <span>Overflow Tab Item</span>
                </MenuItem>
                <MenuItem>
                  <SvgIcon
                    className="nds-icon nds-icon_small nds-icon-text-default"
                    sprite="standard"
                    symbol="case"
                  />
                  <span>Overflow Tab Item</span>
                </MenuItem>
              </MenuList>
            </Menu>
          </li>
        </ContextTabBar>
        <ContextTabPanel show id={tabPanelId01} tabId={tabId01}>
          Tab Home Content
        </ContextTabPanel>
        <ContextTabPanel id={tabPanelId02} tabId={tabId02}>
          Tab One Content
        </ContextTabPanel>
        <ContextTabPanel id={tabPanelId03} tabId={tabId03}>
          Tab Two Content
        </ContextTabPanel>
      </div>
    )
  },
  {
    id: 'unsaved-overflow-tabs',
    label: 'Unsaved Overflow Tabs',
    element: (
      <div className="demo-only">
        <ContextTabBar>
          <ContextTab
            title="Home"
            symbol="home"
            tabPanelId={tabPanelId01}
            id={tabId01}
            itemActive
          />
          <ContextTab
            title="Tab Item 1"
            tabPanelId={tabPanelId02}
            id={tabId02}
          />
          <ContextTab
            title="Tab Item 2"
            tabPanelId={tabPanelId03}
            id={tabId03}
          />
          <li className="nds-context-bar__item nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-is-unsaved">
            <button
              className="nds-button nds-context-bar__label-action"
              title="More Tab Items"
              aria-haspopup="true"
            >
              <abbr
                className="nds-indicator_unsaved"
                title="Tab(s) within menu not saved"
              >
                *
              </abbr>
              <span
                className="nds-p-left_xx-small nds-truncate"
                title="More Tabs"
              >
                More <span className="nds-assistive-text">Tabs</span>
              </span>
              <SvgIcon
                className="nds-button__icon nds-button__icon_small nds-button__icon_right"
                sprite="utility"
                symbol="chevrondown"
              />
            </button>
          </li>
        </ContextTabBar>
        <ContextTabPanel show id={tabPanelId01} tabId={tabId01}>
          Tab Home Content
        </ContextTabPanel>
        <ContextTabPanel id={tabPanelId02} tabId={tabId02}>
          Tab One Content
        </ContextTabPanel>
        <ContextTabPanel id={tabPanelId03} tabId={tabId03}>
          Tab Two Content
        </ContextTabPanel>
      </div>
    )
  },
  {
    id: 'unsaved-overflow-tabs-open',
    label: 'Unsaved Overflow Tabs - Open',
    element: (
      <div className="demo-only" style={{ height: '8rem' }}>
        <ContextTabBar>
          <ContextTab
            title="Home"
            symbol="home"
            tabPanelId={tabPanelId01}
            id={tabId01}
            itemActive
          />
          <ContextTab
            title="Tab Item 1"
            tabPanelId={tabPanelId02}
            id={tabId02}
          />
          <ContextTab
            title="Tab Item 2"
            tabPanelId={tabPanelId03}
            id={tabId03}
          />
          <li className="nds-context-bar__item nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-is-open nds-is-unsaved">
            <button
              className="nds-button nds-context-bar__label-action"
              title="More Tab Items"
              aria-haspopup="true"
            >
              <abbr
                className="nds-indicator_unsaved"
                title="Tab(s) within menu not saved"
              >
                *
              </abbr>
              <span
                className="nds-p-left_xx-small nds-truncate"
                title="More Tabs"
              >
                More <span className="nds-assistive-text">Tabs</span>
              </span>
              <SvgIcon
                className="nds-button__icon nds-button__icon_small nds-button__icon_right"
                sprite="utility"
                symbol="chevrondown"
              />
            </button>
            <Menu className="nds-dropdown_right">
              <MenuList>
                <MenuItem className="nds-is-unsaved" title="Overflow Tab Item">
                  <abbr
                    className="nds-unsaved-indicator"
                    title="Tab(s) within menu not saved"
                  >
                    *
                  </abbr>
                  <SvgIcon
                    className="nds-icon nds-icon_small nds-icon-text-default"
                    sprite="standard"
                    symbol="case"
                  />
                  <span>Overflow Tab Item</span>
                </MenuItem>
                <MenuItem title="Overflow Tab Item">
                  <SvgIcon
                    className="nds-icon nds-icon_small nds-icon-text-default"
                    sprite="standard"
                    symbol="case"
                  />
                  <span>Overflow Tab Item</span>
                </MenuItem>
              </MenuList>
            </Menu>
          </li>
        </ContextTabBar>
        <ContextTabPanel show id={tabPanelId01} tabId={tabId01}>
          Tab Home Content
        </ContextTabPanel>
        <ContextTabPanel id={tabPanelId02} tabId={tabId02}>
          Tab One Content
        </ContextTabPanel>
        <ContextTabPanel id={tabPanelId03} tabId={tabId03}>
          Tab Two Content
        </ContextTabPanel>
      </div>
    )
  },
  {
    id: 'unread-overflow-tabs',
    label: 'Unread Overflow Tabs',
    element: (
      <div className="demo-only">
        <ContextTabBar>
          <ContextTab
            title="Home"
            symbol="home"
            tabPanelId={tabPanelId01}
            id={tabId01}
            itemActive
          />
          <ContextTab
            title="Tab Item 1"
            tabPanelId={tabPanelId02}
            id={tabId02}
          />
          <ContextTab
            title="Tab Item 2"
            tabPanelId={tabPanelId03}
            id={tabId03}
          />
          <li className="nds-context-bar__item nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-has-notification">
            <button
              className="nds-button nds-context-bar__label-action"
              title="More Tab Items"
              aria-haspopup="true"
            >
              <span
                aria-label="New Activity"
                className="nds-indicator_unread"
                role="alert"
                title="New Activity"
              >
                <span className="nds-assistive-text">
                  New Tab activity with in More Tabs menu
                </span>
              </span>
              <span
                className="nds-p-left_xx-small nds-truncate"
                title="More Tabs"
              >
                More <span className="nds-assistive-text">Tabs</span>
              </span>
              <SvgIcon
                className="nds-button__icon nds-button__icon_small nds-button__icon_right"
                sprite="utility"
                symbol="chevrondown"
              />
            </button>
          </li>
        </ContextTabBar>
        <ContextTabPanel show id={tabPanelId01} tabId={tabId01}>
          Tab Home Content
        </ContextTabPanel>
        <ContextTabPanel id={tabPanelId02} tabId={tabId02}>
          Tab One Content
        </ContextTabPanel>
        <ContextTabPanel id={tabPanelId03} tabId={tabId03}>
          Tab Two Content
        </ContextTabPanel>
      </div>
    )
  },
  {
    id: 'unread-overflow-tabs-open',
    label: 'Unread Overflow Tabs - Open',
    element: (
      <div className="demo-only" style={{ height: '8rem' }}>
        <ContextTabBar>
          <ContextTab
            title="Home"
            symbol="home"
            tabPanelId={tabPanelId01}
            id={tabId01}
            itemActive
          />
          <ContextTab
            title="Tab Item 1"
            tabPanelId={tabPanelId02}
            id={tabId02}
          />
          <ContextTab
            title="Tab Item 2"
            tabPanelId={tabPanelId03}
            id={tabId03}
          />
          <li className="nds-context-bar__item nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-is-open nds-has-notification">
            <button
              className="nds-button nds-context-bar__label-action"
              title="More Tab Items"
              aria-haspopup="true"
            >
              <span
                aria-label="New Activity"
                className="nds-indicator_unread"
                role="alert"
                title="New Activity"
              >
                <span className="nds-assistive-text">
                  New Tab activity with in More Tabs menu
                </span>
              </span>
              <span
                className="nds-p-left_xx-small nds-truncate"
                title="More Tabs"
              >
                More <span className="nds-assistive-text">Tabs</span>
              </span>
              <SvgIcon
                className="nds-button__icon nds-button__icon_small nds-button__icon_right"
                sprite="utility"
                symbol="chevrondown"
              />
            </button>
            <Menu className="nds-dropdown_right">
              <MenuList>
                <MenuItem
                  className="nds-has-notification"
                  title="Chat - Customer"
                >
                  <span className="nds-indicator_unread" title="New Activity">
                    <span className="nds-assistive-text">New Activity</span>
                  </span>
                  <SvgIcon
                    className="nds-icon nds-icon_small nds-icon-text-default"
                    sprite="standard"
                    symbol="live_chat"
                  />
                  <span>Chat - Customer</span>
                </MenuItem>
                <MenuItem title="Overflow Tab Item">
                  <SvgIcon
                    className="nds-icon nds-icon_small nds-icon-text-default"
                    sprite="standard"
                    symbol="case"
                  />
                  <span>Overflow Tab Item</span>
                </MenuItem>
              </MenuList>
            </Menu>
          </li>
        </ContextTabBar>
        <ContextTabPanel show id={tabPanelId01} tabId={tabId01}>
          Tab Home Content
        </ContextTabPanel>
        <ContextTabPanel id={tabPanelId02} tabId={tabId02}>
          Tab One Content
        </ContextTabPanel>
        <ContextTabPanel id={tabPanelId03} tabId={tabId03}>
          Tab Two Content
        </ContextTabPanel>
      </div>
    )
  },
  {
    id: 'object-switcher-active',
    label: 'Object Switcher - Active',
    element: (
      <div className="demo-only">
        <ContextTabBar objectSwitchClassName="nds-is-active">
          <ContextTab
            title="Home"
            symbol="home"
            tabPanelId={tabPanelId01}
            id={tabId01}
          />
          <ContextTab
            title="Tab Item 1"
            tabPanelId={tabPanelId02}
            id={tabId02}
          />
          <ContextTab
            title="Tab Item 2"
            tabPanelId={tabPanelId03}
            id={tabId03}
          />
        </ContextTabBar>
        <ContextTabPanel id={tabPanelId01} tabId={tabId01}>
          Tab Home Content
        </ContextTabPanel>
        <ContextTabPanel id={tabPanelId02} tabId={tabId02}>
          Tab One Content
        </ContextTabPanel>
        <ContextTabPanel id={tabPanelId03} tabId={tabId03}>
          Tab Two Content
        </ContextTabPanel>
      </div>
    )
  },
  {
    id: 'object-switcher-menu-open',
    label: 'Object Switcher - Open',
    element: (
      <div className="demo-only" style={{ height: '11rem' }}>
        <ContextTabBar objectSwitchClassName="nds-is-open">
          <ContextTab
            title="Home"
            symbol="home"
            tabPanelId={tabPanelId01}
            id={tabId01}
          />
          <ContextTab
            title="Tab Item 1"
            tabPanelId={tabPanelId02}
            id={tabId02}
          />
          <ContextTab
            title="Tab Item 2"
            tabPanelId={tabPanelId03}
            id={tabId03}
          />
        </ContextTabBar>
        <ContextTabPanel id={tabPanelId01} tabId={tabId01}>
          Tab Home Content
        </ContextTabPanel>
        <ContextTabPanel id={tabPanelId02} tabId={tabId02}>
          Tab One Content
        </ContextTabPanel>
        <ContextTabPanel id={tabPanelId03} tabId={tabId03}>
          Tab Two Content
        </ContextTabPanel>
      </div>
    )
  },
  {
    id: 'add-tab-dialog-open',
    label: 'Add Tab Dialog - Open',
    element: (
      <div className="demo-only" style={{ height: '8rem' }}>
        <ContextTabBar addTabActive>
          <ContextTab
            title="Home"
            symbol="home"
            tabPanelId={tabPanelId01}
            id={tabId01}
          />
          <ContextTab
            title="Tab Item 1"
            tabPanelId={tabPanelId02}
            id={tabId02}
          />
          <ContextTab
            title="Tab Item 2"
            tabPanelId={tabPanelId03}
            id={tabId03}
          />
        </ContextTabBar>
        <ContextTabPanel id={tabPanelId01} tabId={tabId01}>
          Tab Home Content
        </ContextTabPanel>
        <ContextTabPanel id={tabPanelId02} tabId={tabId02}>
          Tab One Content
        </ContextTabPanel>
        <ContextTabPanel id={tabPanelId03} tabId={tabId03}>
          Tab Two Content
        </ContextTabPanel>
      </div>
    )
  }
];
