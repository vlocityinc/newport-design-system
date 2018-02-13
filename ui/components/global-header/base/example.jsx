// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import SvgIcon from '../../../shared/svg-icon';
import { ButtonIcon } from '../../button-icons/base/example';
import { Menu, MenuList, MenuItem } from '../../menus/dropdown/example';
import classNames from 'classnames';

/// ///////////////////////////////////////////
// Partial(s)
/// ///////////////////////////////////////////

const SetupDropdown = (
  <Menu className="nds-dropdown_right nds-nubbin_top-right">
    <MenuList>
      <li className="nds-dropdown__header" role="separator">
        <span className="nds-text-title_caps">Setup</span>
      </li>
      <MenuItem tabIndex="0">Setup Home</MenuItem>
    </MenuList>
  </Menu>
);

const ActionsDropdown = (
  <Menu className="nds-dropdown_right nds-nubbin_top-right">
    <MenuList>
      <li className="nds-dropdown__header" role="separator">
        <span className="nds-text-title_caps">Create</span>
      </li>
      <MenuItem tabIndex="0">
        <SvgIcon
          className="nds-icon nds-icon_small nds-icon-standard-note nds-m-right_x-small"
          sprite="standard"
          symbol="note"
        />{' '}
        New Note
      </MenuItem>
      <MenuItem>
        <SvgIcon
          className="nds-icon nds-icon_small nds-icon-standard-log-a-call nds-m-right_x-small"
          sprite="standard"
          symbol="log_a_call"
        />{' '}
        Log a Call
      </MenuItem>
      <MenuItem>
        <SvgIcon
          className="nds-icon nds-icon_small nds-icon-standard-event nds-m-right_x-small"
          sprite="standard"
          symbol="event"
        />{' '}
        New Event
      </MenuItem>
    </MenuList>
  </Menu>
);

let GlobalSearch = props => (
  <div
    aria-expanded={props.expanded ? 'true' : 'false'}
    aria-haspopup="listbox"
    className={classNames(
      'nds-form-element nds-lookup',
      props.expanded ? 'nds-is-open' : null
    )}
    role="combobox"
  >
    <label className="nds-assistive-text" htmlFor="global-search-01">
      Search Salesforce
    </label>

    <div className="nds-form-element__control nds-input-has-icon nds-input-has-icon_left-right">
      <SvgIcon
        className="nds-input__icon nds-input__icon_left"
        sprite="utility"
        symbol="search"
      />
      <input
        aria-activedescendant=""
        aria-autocomplete="list"
        aria-controls="global-search-list-01"
        autoComplete="off"
        className="nds-input nds-lookup__search-input"
        id="global-search-01"
        placeholder="Search Salesforce"
        role="textbox"
        type="text"
        defaultValue={props.value}
      />
      {props.value ? (
        <button className="nds-input__icon nds-input__icon_right nds-button nds-button_icon">
          <SvgIcon
            className="nds-button__icon"
            sprite="utility"
            symbol="clear"
          />
          <span className="nds-assistive-text">
            Clear the current search term
          </span>
        </button>
      ) : null}
    </div>

    <div className="nds-lookup__menu" role="listbox" id="global-search-list-01">
      {props.value ? <GlobalSearchSearchOptions /> : <GlobalSearchMRUs />}
    </div>
  </div>
);

let GlobalSearchMRUs = props => (
  <ul className="nds-lookup__list" role="group" aria-label="Recent Items">
    <li role="presentation">
      <h3
        role="presentation"
        className="nds-lookup__item_label nds-text-body_small"
      >
        Recent Items
      </h3>
    </li>
    <li role="presentation">
      <span
        className="nds-lookup__item-action nds-media"
        id="option-01"
        role="option"
      >
        <SvgIcon
          className="nds-icon nds-icon-standard-opportunity nds-icon_small nds-media__figure"
          sprite="standard"
          symbol="opportunity"
        />
        <span className="nds-media__body">
          <span className="nds-lookup__result-text">
            Salesforce - 1,000 Licenses
          </span>
          <span className="nds-lookup__result-meta nds-text-body_small">
            Opportunity &bull; Prospecting
          </span>
        </span>
      </span>
    </li>
    <li role="presentation">
      <span
        className="nds-lookup__item-action nds-media"
        id="option-02"
        role="option"
      >
        <SvgIcon
          className="nds-icon nds-icon-standard-contact nds-icon_small nds-media__figure"
          sprite="standard"
          symbol="contact"
        />
        <span className="nds-media__body">
          <span className="nds-lookup__result-text">Art Vandelay</span>
          <span className="nds-lookup__result-meta nds-text-body_small">
            Contact &bull; avandelay@vandelay.com
          </span>
        </span>
      </span>
    </li>
    <li role="presentation">
      <span
        className="nds-lookup__item-action nds-media"
        id="option-03"
        role="option"
      >
        <SvgIcon
          className="nds-icon nds-icon-standard-account nds-icon_small nds-media__figure"
          sprite="standard"
          symbol="account"
        />
        <span className="nds-media__body">
          <span className="nds-lookup__result-text">Vandelary Industries</span>
          <span className="nds-lookup__result-meta nds-text-body_small">
            Account &bull; San Francisco
          </span>
        </span>
      </span>
    </li>
    <li role="presentation">
      <span
        className="nds-lookup__item-action nds-media"
        id="option-04"
        role="option"
      >
        <SvgIcon
          className="nds-icon nds-icon-custom-8 nds-icon_small nds-media__figure"
          sprite="custom"
          symbol="custom8"
        />
        <span className="nds-media__body">
          <span className="nds-lookup__result-text">
            Salesforce UK 2016 Events
          </span>
          <span className="nds-lookup__result-meta nds-text-body_small">
            General Ledger &bull; $20,000
          </span>
        </span>
      </span>
    </li>
    <li role="presentation">
      <span
        className="nds-lookup__item-action nds-media"
        id="option-05"
        role="option"
      >
        <SvgIcon
          className="nds-icon nds-icon-standard-lead nds-icon_small nds-media__figure"
          sprite="standard"
          symbol="lead"
        />
        <span className="nds-media__body">
          <span className="nds-lookup__result-text">H.E. Pennypacker</span>
          <span className="nds-lookup__result-meta nds-text-body_small">
            Lead &bull; Nursing
          </span>
        </span>
      </span>
    </li>
  </ul>
);

let GlobalSearchSearchOptions = props => (
  <ul className="nds-lookup__list" role="presentation">
    <li role="presentation">
      <span
        className="nds-lookup__item-action nds-lookup__item-action_label nds-text-body_small nds-has-focus"
        id="option-00"
        role="option"
      >
        <SvgIcon
          className="nds-icon nds-icon_x-small nds-icon-text-default"
          sprite="utility"
          symbol="search"
        />
        <span className="nds-truncate" title="'ibm' in Salesforce">
          "ibm" in Salesforce
        </span>
      </span>
    </li>
    <li role="presentation">
      <span
        className="nds-lookup__item-action nds-media"
        id="option-01"
        role="option"
      >
        <SvgIcon
          className="nds-icon nds-icon-standard-opportunity nds-icon_small nds-media__figure"
          sprite="standard"
          symbol="opportunity"
        />
        <span className="nds-media__body">
          <span className="nds-lookup__result-text">
            <mark>IBM</mark> - 1yr/100k
          </span>
          <span className="nds-lookup__result-meta nds-text-body_small">
            Opportunity &bull; Proposal/Quote
          </span>
        </span>
      </span>
    </li>
    <li role="presentation">
      <span
        className="nds-lookup__item-action nds-media"
        id="option-02"
        role="option"
      >
        <SvgIcon
          className="nds-icon nds-icon-standard-account nds-icon_small nds-media__figure"
          sprite="standard"
          symbol="account"
        />
        <span className="nds-media__body">
          <span className="nds-lookup__result-text">
            <mark>IBM</mark>
          </span>
          <span className="nds-lookup__result-meta nds-text-body_small">
            Account &bull; Menlo Park
          </span>
        </span>
      </span>
    </li>
    <li role="presentation">
      <span
        className="nds-lookup__item-action nds-media"
        id="option-03"
        role="option"
      >
        <SvgIcon
          className="nds-icon nds-icon-standard-account nds-icon_small nds-media__figure"
          sprite="standard"
          symbol="account"
        />
        <span className="nds-media__body">
          <span className="nds-lookup__result-text">
            <mark>IBM</mark> Watson
          </span>
          <span className="nds-lookup__result-meta nds-text-body_small">
            Account &bull; Menlo Park
          </span>
        </span>
      </span>
    </li>
    <li role="presentation">
      <span
        className="nds-lookup__item-action nds-media"
        id="option-04"
        role="option"
      >
        <SvgIcon
          className="nds-icon nds-icon-standard-opportunity nds-icon_small nds-media__figure"
          sprite="standard"
          symbol="opportunity"
        />
        <span className="nds-media__body">
          <span className="nds-lookup__result-text">
            200 Service Licenses - <mark>IBM</mark>
          </span>
          <span className="nds-lookup__result-meta nds-text-body_small">
            Opportunity &bull; Close-Won
          </span>
        </span>
      </span>
    </li>
    <li role="presentation">
      <span
        className="nds-lookup__item-action nds-media"
        id="option-05"
        role="option"
      >
        <SvgIcon
          className="nds-icon nds-icon-standard-contact nds-icon_small nds-media__figure"
          sprite="standard"
          symbol="contact"
        />
        <span className="nds-media__body">
          <span className="nds-lookup__result-text">
            Art Vandelay (<mark>IBM</mark>)
          </span>
          <span className="nds-lookup__result-meta nds-text-body_small">
            User &bull; Latex Salesman
          </span>
        </span>
      </span>
    </li>
  </ul>
);

export let GlobalHeader = props => (
  <header
    className={classNames('nds-global-header_container', props.className)}
  >
    <a
      href="javascript:void(0);"
      className="nds-assistive-text nds-assistive-text_focus"
    >
      Skip to Navigation
    </a>
    <a
      href="javascript:void(0);"
      className="nds-assistive-text nds-assistive-text_focus"
    >
      Skip to Main Content
    </a>
    <div className="nds-global-header nds-grid nds-grid_align-spread">
      <div className="nds-global-header__item">
        <div className="nds-global-header__logo">
          <img src="/assets/images/logo-noname.svg" alt="" />
        </div>
      </div>
      <div className="nds-global-header__item nds-global-header__item_search">
        <GlobalSearch expanded={props.expanded} value={props.searchingFor} />
      </div>
      <ul className="nds-global-header__item nds-grid nds-grid_vertical-align-center">
        <li className="nds-grid">
          <ButtonIcon
            className={classNames(
              'nds-button_icon nds-button_icon-container nds-button_icon-small nds-global-header__button_icon-favorites',
              {
                'nds-is-selected': props.favoritesSelected,
                'nds-is-disabled': props.favoritesDisabled
              }
            )}
            disabled={props.favoritesDisabled}
            aria-pressed={props.favoritesSelected ? 'true' : 'false'}
            iconClassName="nds-global-header__icon"
            symbol="favorite"
            title="Toggle Favorites"
            assistiveText="Toggle Favorite"
          />
          <span
            className={classNames(
              'nds-dropdown-trigger nds-dropdown-trigger_click',
              props.actions ? 'nds-is-open' : null
            )}
          >
            <ButtonIcon
              className={classNames(
                'nds-button_icon nds-button_icon-container nds-button_icon-small nds-global-header__button_icon nds-m-left_none'
              )}
              hasPopup
              disabled={props.favoritesDisabled}
              symbol="chevrondown"
              title="View Favorites"
              assistiveText="View Favorites"
            />
          </span>
        </li>
        <li
          className={classNames(
            'nds-dropdown-trigger nds-dropdown-trigger_click nds-p-horizontal_xxx-small',
            props.actions ? 'nds-is-open' : null
          )}
        >
          <ButtonIcon
            className="nds-button_icon nds-button_icon-small nds-button_icon-container nds-button_icon-x-small nds-global-header__button_icon-actions nds-m-horizontal_xx-small"
            hasPopup
            symbol="add"
            title="Global Actions"
            assistiveText="Global Actions"
          />
          {props.actions ? ActionsDropdown : null}
        </li>
        <li
          className={classNames(
            'nds-dropdown-trigger nds-dropdown-trigger_click',
            props.help ? 'nds-is-open' : null
          )}
        >
          <ButtonIcon
            className="nds-button_icon nds-button_icon-container nds-button_icon-small nds-global-header__button_icon"
            iconClassName="nds-global-header__icon"
            hasPopup
            symbol="question"
            title="Help and Training"
            assistiveText="Help and Training"
          />
        </li>
        <li
          className={classNames(
            'nds-dropdown-trigger nds-dropdown-trigger_click',
            props.setup ? 'nds-is-open' : null
          )}
        >
          <ButtonIcon
            className="nds-button_icon nds-button_icon-container nds-button_icon-small nds-global-header__button_icon"
            iconClassName="nds-global-header__icon"
            hasPopup
            symbol="setup"
            title="Setup"
            assistiveText="Setup"
          />
          {props.setup ? SetupDropdown : null}
        </li>
        <li
          className={classNames(
            'nds-dropdown-trigger nds-dropdown-trigger_click',
            props.setup ? 'nds-is-open' : null
          )}
        >
          <ButtonIcon
            className="nds-button_icon nds-button_icon-container nds-button_icon-small nds-global-header__button_icon"
            iconClassName="nds-global-header__icon"
            hasPopup
            symbol="notification"
            title="Notifications"
            assistiveText="Notifications"
          />
        </li>
        <li
          className={classNames(
            'nds-dropdown-trigger nds-dropdown-trigger_click nds-m-left_x-small',
            props.setup ? 'nds-is-open' : null
          )}
        >
          <button
            className="nds-button"
            title="person name"
            aria-haspopup="true"
          >
            <span className="nds-avatar nds-avatar_circle nds-avatar_medium">
              <img
                alt="Person name"
                src="/assets/images/avatar2.jpg"
                title="User avatar"
              />
            </span>
          </button>
        </li>
      </ul>
    </div>
    {props.popoverMenu ? props.children : null}
  </header>
);

/// ///////////////////////////////////////////
// Export
/// ///////////////////////////////////////////

export const Context = props => (
  <div className="demo-only" style={{ height: '340px' }}>
    {props.children}
  </div>
);

export default <GlobalHeader />;

export let states = [
  {
    id: 'favorites-selected',
    label: 'Favorites selected',
    element: <GlobalHeader favoritesSelected />
  },
  {
    id: 'favorites-disabled',
    label: 'Favorites disabled',
    element: <GlobalHeader favoritesDisabled />
  },
  {
    id: 'actions-active',
    label: 'Global actions active',
    element: <GlobalHeader actions />
  },
  {
    id: 'global-header-setup-active',
    label: 'Setup active',
    element: <GlobalHeader setup />
  },
  {
    id: 'global-header-search-active',
    label: 'Active',
    element: <GlobalHeader expanded />,
    script: `
      document.getElementById('global-search-01').focus()
    `
  },
  {
    id: 'global-header-search-typeahead',
    label: 'Typeahead',
    element: <GlobalHeader expanded searchingFor="ibm" />,
    script: `
      document.getElementById('global-search-01').focus()
    `
  }
];
