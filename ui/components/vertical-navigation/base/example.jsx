// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import { UtilityIcon } from '../../icons/base/example.jsx';
import { FormElement } from '../../form-element/base/example';
import { Input } from '../../input/base/example';
import SvgIcon from '../../../shared/svg-icon';
import classNames from 'classnames';

const inputId01 = 'input-id-01';
const sectionId01 = 'entity-header';
const sectionId02 = 'folder-header';
const sectionId03 = 'search-results';
const sectionId04 = 'external-results';

/// ////////////////////////////////////////
// Partial(s)
/// ////////////////////////////////////////

export let NavVertical = props => (
  <nav
    className={classNames('nds-nav-vertical', props.className)}
    aria-label="Sub page"
  >
    {props.children}
  </nav>
);

export let NavVerticalItem = props => (
  <li
    className={classNames(
      'nds-nav-vertical__item',
      { 'nds-is-active': props.active },
      props.className
    )}
  >
    <a
      href="javascript:void(0);"
      className="nds-nav-vertical__action"
      aria-describedby={props['aria-describedby']}
      aria-current={props.active ? 'page' : null}
    >
      {props.children}
    </a>
  </li>
);

export let NavVerticalSection = props => {
  let hasExpando = props.collapsed || props.expanded;

  return (
    <div
      className={classNames(
        hasExpando ? 'nds-nav-vertical__overflow' : 'nds-nav-vertical__section',
        props.className
      )}
    >
      {!hasExpando && props.title ? (
        <h2
          id={props.id}
          className={classNames('nds-nav-vertical__title nds-text-title_caps')}
        >
          {props.title}
        </h2>
      ) : null}
      {hasExpando ? (
        <button
          className="nds-button nds-button_reset nds-nav-vertical__action nds-nav-vertical__action_overflow"
          aria-controls={props.listId}
          aria-expanded={props.expanded ? 'true' : 'false'}
        >
          <SvgIcon
            className="nds-button__icon nds-button__icon_left"
            sprite="utility"
            symbol="chevronright"
          />
          <span className="nds-nav-vertical__action-text">
            {props.collapsed ? 'Show More' : 'Show Less'}
            <span className="nds-assistive-text">{props.title}</span>
          </span>
        </button>
      ) : null}
      {hasExpando ? (
        <div
          id={props.listId}
          className={classNames({
            'nds-hide': props.collapsed,
            'nds-show': props.expanded
          })}
        >
          <ul>{props.children}</ul>
        </div>
      ) : (
        <ul id={props.listId}>{props.children}</ul>
      )}
    </div>
  );
};

/// ////////////////////////////////////////
// Export
/// ////////////////////////////////////////

export default (
  <div className="demo-only" style={{ width: '320px' }}>
    <NavVertical>
      <NavVerticalSection id={sectionId01} title="Reports">
        <NavVerticalItem aria-describedby={sectionId01} active>
          Recent
        </NavVerticalItem>
        <NavVerticalItem aria-describedby={sectionId01}>
          Created by Me
        </NavVerticalItem>
        <NavVerticalItem aria-describedby={sectionId01}>
          Private Reports
        </NavVerticalItem>
        <NavVerticalItem aria-describedby={sectionId01}>
          Public Reports
        </NavVerticalItem>
        <NavVerticalItem aria-describedby={sectionId01}>
          All Reports
        </NavVerticalItem>
      </NavVerticalSection>
      <NavVerticalSection id={sectionId02} title="Folders">
        <NavVerticalItem aria-describedby={sectionId02}>
          Created by Me
        </NavVerticalItem>
        <NavVerticalItem aria-describedby={sectionId02}>
          Shared with Me
        </NavVerticalItem>
        <NavVerticalItem aria-describedby={sectionId02}>
          All Reports
        </NavVerticalItem>
      </NavVerticalSection>
    </NavVertical>
  </div>
);

export let states = [
  {
    id: 'collapsed',
    label: 'Collapsed',
    element: (
      <div className="demo-only" style={{ width: '320px' }}>
        <NavVertical>
          <NavVerticalSection id={sectionId01} title="Reports">
            <NavVerticalItem aria-describedby={sectionId01} active>
              Recent
            </NavVerticalItem>
            <NavVerticalItem aria-describedby={sectionId01}>
              Created by Me
            </NavVerticalItem>
            <NavVerticalItem aria-describedby={sectionId01}>
              Private Reports
            </NavVerticalItem>
            <NavVerticalItem aria-describedby={sectionId01}>
              Public Reports
            </NavVerticalItem>
            <NavVerticalItem aria-describedby={sectionId01}>
              All Reports
            </NavVerticalItem>
          </NavVerticalSection>
          <NavVerticalSection id={sectionId02} title="Folders">
            <NavVerticalItem aria-describedby={sectionId02}>
              Created by Me
            </NavVerticalItem>
            <NavVerticalItem aria-describedby={sectionId02}>
              Shared with Me
            </NavVerticalItem>
          </NavVerticalSection>
          <NavVerticalSection title="Folders" collapsed listId={sectionId03}>
            <NavVerticalItem aria-describedby={sectionId02}>
              Overflow Item One
            </NavVerticalItem>
            <NavVerticalItem aria-describedby={sectionId02}>
              Overflow Item Two
            </NavVerticalItem>
            <NavVerticalItem aria-describedby={sectionId02}>
              Overflow Item Three
            </NavVerticalItem>
          </NavVerticalSection>
        </NavVertical>
      </div>
    )
  },
  {
    id: 'expanded',
    label: 'Expanded',
    element: (
      <div className="demo-only" style={{ width: '320px' }}>
        <NavVertical>
          <NavVerticalSection id={sectionId01} title="Reports">
            <NavVerticalItem aria-describedby={sectionId01} active>
              Recent
            </NavVerticalItem>
            <NavVerticalItem aria-describedby={sectionId01}>
              Created by Me
            </NavVerticalItem>
            <NavVerticalItem aria-describedby={sectionId01}>
              Private Reports
            </NavVerticalItem>
            <NavVerticalItem aria-describedby={sectionId01}>
              Public Reports
            </NavVerticalItem>
            <NavVerticalItem aria-describedby={sectionId01}>
              All Reports
            </NavVerticalItem>
          </NavVerticalSection>
          <NavVerticalSection id={sectionId02} title="Folders">
            <NavVerticalItem aria-describedby={sectionId02}>
              Created by Me
            </NavVerticalItem>
            <NavVerticalItem aria-describedby={sectionId02}>
              Shared with Me
            </NavVerticalItem>
          </NavVerticalSection>
          <NavVerticalSection title="Folders" expanded listId={sectionId03}>
            <NavVerticalItem aria-describedby={sectionId02}>
              Overflow Item One
            </NavVerticalItem>
            <NavVerticalItem aria-describedby={sectionId02}>
              Overflow Item Two
            </NavVerticalItem>
            <NavVerticalItem aria-describedby={sectionId02}>
              Overflow Item Three
            </NavVerticalItem>
          </NavVerticalSection>
        </NavVertical>
      </div>
    )
  }
];

export let examples = [
  {
    id: 'compact',
    label: 'Compact',
    element: (
      <div className="demo-only" style={{ width: '320px' }}>
        <NavVertical className="nds-nav-vertical_compact">
          <NavVerticalSection id={sectionId01} title="Reports">
            <NavVerticalItem aria-describedby={sectionId01} active>
              Recent
            </NavVerticalItem>
            <NavVerticalItem aria-describedby={sectionId01}>
              Created by Me
            </NavVerticalItem>
            <NavVerticalItem aria-describedby={sectionId01}>
              Private Reports
            </NavVerticalItem>
            <NavVerticalItem aria-describedby={sectionId01}>
              Public Reports
            </NavVerticalItem>
            <NavVerticalItem aria-describedby={sectionId01}>
              All Reports
            </NavVerticalItem>
          </NavVerticalSection>
          <NavVerticalSection id={sectionId02} title="Folders">
            <NavVerticalItem aria-describedby={sectionId02}>
              Created by Me
            </NavVerticalItem>
            <NavVerticalItem aria-describedby={sectionId02}>
              Shared with Me
            </NavVerticalItem>
            <NavVerticalItem aria-describedby={sectionId02}>
              All Reports
            </NavVerticalItem>
          </NavVerticalSection>
        </NavVertical>
      </div>
    )
  },
  {
    id: 'items-with-icons',
    label: 'Items with icon',
    element: (
      <div className="demo-only" style={{ width: '320px' }}>
        <NavVertical>
          <NavVerticalSection id={sectionId01} title="Reports">
            <NavVerticalItem aria-describedby={sectionId01} active>
              Recent
            </NavVerticalItem>
            <NavVerticalItem aria-describedby={sectionId01}>
              Created by Me
            </NavVerticalItem>
            <NavVerticalItem aria-describedby={sectionId01}>
              Private Reports
            </NavVerticalItem>
            <NavVerticalItem aria-describedby={sectionId01}>
              Public Reports
            </NavVerticalItem>
            <NavVerticalItem aria-describedby={sectionId01}>
              All Reports
            </NavVerticalItem>
          </NavVerticalSection>
          <NavVerticalSection id={sectionId02} title="Folders">
            <NavVerticalItem aria-describedby={sectionId02}>
              <UtilityIcon
                symbol="open_folder"
                containerClassName="nds-line-height_reset"
                className="nds-icon-text-default nds-icon_x-small nds-m-right_x-small"
                assistiveText="Folder"
              />
              Created by Me
            </NavVerticalItem>
            <NavVerticalItem aria-describedby={sectionId02}>
              <UtilityIcon
                symbol="open_folder"
                containerClassName="nds-line-height_reset"
                className="nds-icon-text-default nds-icon_x-small nds-m-right_x-small"
                assistiveText="Folder"
              />
              Shared with Me
            </NavVerticalItem>
            <NavVerticalItem aria-describedby={sectionId02}>
              All Reports
            </NavVerticalItem>
          </NavVerticalSection>
        </NavVertical>
      </div>
    )
  },
  {
    id: 'items-with-notifications',
    label: 'Items with notification',
    element: (
      <div className="demo-only" style={{ width: '320px' }}>
        <NavVertical>
          <NavVerticalSection id={sectionId01} title="Reports">
            <NavVerticalItem aria-describedby={sectionId01} active>
              Recent
              <span className="nds-badge nds-col_bump-left">
                <span className="nds-assistive-text">:</span>
                3
                <span className="nds-assistive-text">New Items</span>
              </span>
            </NavVerticalItem>
            <NavVerticalItem aria-describedby={sectionId01}>
              Created by Me
            </NavVerticalItem>
            <NavVerticalItem aria-describedby={sectionId01}>
              Private Reports
            </NavVerticalItem>
            <NavVerticalItem aria-describedby={sectionId01}>
              Public Reports
            </NavVerticalItem>
            <NavVerticalItem aria-describedby={sectionId01}>
              All Reports
            </NavVerticalItem>
          </NavVerticalSection>
          <NavVerticalSection id={sectionId02} title="Folders">
            <NavVerticalItem aria-describedby={sectionId02}>
              Created by Me
            </NavVerticalItem>
            <NavVerticalItem aria-describedby={sectionId02}>
              Shared with Me
            </NavVerticalItem>
            <NavVerticalItem aria-describedby={sectionId02}>
              All Reports
            </NavVerticalItem>
          </NavVerticalSection>
        </NavVertical>
      </div>
    )
  },
  {
    id: 'shade',
    label: 'Shaded Background',
    element: (
      <div
        className="demo-only"
        style={{ width: '320px', backgroundColor: '#FAFAFB' }}
      >
        <NavVertical className="nds-nav-vertical_shade">
          <NavVerticalSection id={sectionId01} title="Reports">
            <NavVerticalItem aria-describedby={sectionId01} active>
              Recent
            </NavVerticalItem>
            <NavVerticalItem aria-describedby={sectionId01}>
              Created by Me
            </NavVerticalItem>
            <NavVerticalItem aria-describedby={sectionId01}>
              Private Reports
            </NavVerticalItem>
            <NavVerticalItem aria-describedby={sectionId01}>
              Public Reports
            </NavVerticalItem>
            <NavVerticalItem aria-describedby={sectionId01}>
              All Reports
            </NavVerticalItem>
          </NavVerticalSection>
          <NavVerticalSection id={sectionId02} title="Folders">
            <NavVerticalItem aria-describedby={sectionId02}>
              Created by Me
            </NavVerticalItem>
            <NavVerticalItem aria-describedby={sectionId02}>
              Shared with Me
            </NavVerticalItem>
            <NavVerticalItem aria-describedby={sectionId02}>
              All Reports
            </NavVerticalItem>
          </NavVerticalSection>
        </NavVertical>
      </div>
    )
  },
  {
    id: 'quickfind',
    label: 'Quickfind',
    element: (
      <div className="demo-only" style={{ width: '320px' }}>
        <NavVertical>
          <FormElement
            className="nds-p-horizontal_large"
            label="Filter navigation items"
            inputId={inputId01}
            inputIcon="left"
            hideLabel
          >
            <SvgIcon
              className="nds-icon nds-input__icon nds-input__icon_right nds-icon-text-default"
              sprite="utility"
              symbol="search"
            />
            <Input type="search" id={inputId01} placeholder="Quick Find" />
          </FormElement>
          <NavVerticalSection id={sectionId01} title="Reports">
            <NavVerticalItem aria-describedby={sectionId01} active>
              Recent
            </NavVerticalItem>
            <NavVerticalItem aria-describedby={sectionId01}>
              Created by Me
            </NavVerticalItem>
            <NavVerticalItem aria-describedby={sectionId01}>
              Private Reports
            </NavVerticalItem>
            <NavVerticalItem aria-describedby={sectionId01}>
              Public Reports
            </NavVerticalItem>
            <NavVerticalItem aria-describedby={sectionId01}>
              All Reports
            </NavVerticalItem>
          </NavVerticalSection>
          <NavVerticalSection id={sectionId02} title="Folders">
            <NavVerticalItem aria-describedby={sectionId02}>
              Created by Me
            </NavVerticalItem>
            <NavVerticalItem aria-describedby={sectionId02}>
              Shared with Me
            </NavVerticalItem>
          </NavVerticalSection>
        </NavVertical>
      </div>
    )
  }
];
