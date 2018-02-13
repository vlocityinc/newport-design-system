// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import { ButtonIcon } from '../../button-icons/base/example';
import SvgIcon from '../../../shared/svg-icon';
import classNames from 'classnames';
import { Panel } from '../detail/example';
import { PanelBody } from '../detail/example';
import { PanelSection } from '../detail/example';

/// ////////////////////////////////////////
// Partial(s)
/// ////////////////////////////////////////

let Demo = props => (
  <div
    className="demo-only nds-grid"
    style={{ height: '800px', maxWidth: '420px', overflow: 'hidden' }}
  >
    {props.children}
  </div>
);

export let Filters = props => (
  <div className={classNames('nds-filters', props.className)}>
    {props.children}
  </div>
);

export let FiltersHeader = props => (
  <div
    className={classNames(
      'nds-filters__header nds-grid nds-has-divider_bottom-space',
      props.className
    )}
  >
    {props.children}
  </div>
);

export let FiltersBody = props => (
  <div className="nds-filters__body">{props.children}</div>
);

export let FiltersFooter = props => (
  <div className="nds-filters__footer nds-grid nds-shrink-none">
    <button
      className="nds-button_reset nds-text-link"
      href="javascript:void(0);"
    >
      Add Filter
    </button>
    <button
      className="nds-button_reset nds-text-link nds-col_bump-left"
      href="javascript:void(0);"
    >
      Remove All
    </button>
  </div>
);

export let FilterObject = props => {
  let ariaDesribedBy;
  if (props.errorMessage) {
    ariaDesribedBy = 'error-filter-01';
  }

  return (
    <li className="nds-item nds-hint-parent">
      <div
        className={classNames(
          'nds-filters__item nds-grid nds-grid_vertical-align-center',
          props.className
        )}
      >
        <button
          href="javascript:void(0);"
          className="nds-button_reset nds-grow nds-has-blur-focus"
          aria-describedby={ariaDesribedBy}
          disabled={props.disabled}
        >
          <span className="nds-assistive-text">Edit filter:</span>
          {props.type ? (
            <p className="nds-text-body_small">{props.type}</p>
          ) : null}
          <p>{props.children}</p>
        </button>
        {props.removable ? (
          <ButtonIcon
            className="nds-button_icon nds-button_icon-small"
            iconClassName="nds-button__icon_hint"
            symbol="close"
            assistiveText={
              props.type ? (
                'Remove filter: ' + props.type + ' ' + props.children
              ) : (
                'Remove filter: ' + props.children
              )
            }
            title={'Remove ' + props.children}
          />
        ) : null}
      </div>
      {props.errorMessage ? (
        <p
          id={ariaDesribedBy}
          className="nds-text-color_error nds-m-top_xx-small"
        >
          {props.errorMessage}
        </p>
      ) : null}
    </li>
  );
};

/// ////////////////////////////////////////
// State Constructor(s)
/// ////////////////////////////////////////

let Default = props => (
  <Demo>
    <Panel className="nds-panel_filters">
      <PanelBody className="nds-grid nds-grid_vertical">
        <Filters>
          <FiltersHeader>
            <h2 className="nds-align-middle nds-text-heading_small">Filter</h2>
            <ButtonIcon
              className="nds-col_bump-left nds-button_icon nds-button_icon-small"
              symbol="forward"
              assistiveText="Close Filter Panel"
              title="Close Filter Panel"
            />
          </FiltersHeader>
          <FiltersBody>
            <ol className="nds-list_vertical nds-list_vertical-space">
              <FilterObject type="Show Me">All Products</FilterObject>
            </ol>
            <h3 className="nds-text-body_small nds-m-vertical_x-small">
              Matching all these filters
            </h3>
            <ol className="nds-list_vertical nds-list_vertical-space">
              <FilterObject type="Created Date" removable>
                equals THIS WEEK
              </FilterObject>
              <FilterObject type="List Price" removable>
                greater than "500"
              </FilterObject>
            </ol>
          </FiltersBody>
          <FiltersFooter />
        </Filters>
      </PanelBody>
    </Panel>
  </Demo>
);

let NewFilter = props => (
  <Demo>
    <Panel className="nds-panel_filters">
      <PanelBody className="nds-grid nds-grid_vertical">
        <Filters>
          <FiltersHeader className="nds-grid_align-spread">
            <button className="nds-button nds-button_neutral">Cancel</button>
            <button className="nds-button nds-button_brand">Save</button>
          </FiltersHeader>
          <FiltersBody>
            <ol className="nds-list_vertical nds-list_vertical-space">
              <FilterObject type="Show Me">All Products</FilterObject>
            </ol>
            <h3 className="nds-text-body_small nds-m-vertical_x-small">
              Matching all these filters
            </h3>
            <ul className="nds-list_vertical nds-list_vertical-space">
              <FilterObject type="Created Date" removable>
                equals THIS WEEK
              </FilterObject>
              <FilterObject type="List Price" removable>
                greater than "500"
              </FilterObject>
              <FilterObject className="nds-is-new" removable>
                New Filter
              </FilterObject>
            </ul>
          </FiltersBody>
          <FiltersFooter />
        </Filters>
      </PanelBody>
    </Panel>
  </Demo>
);

let ErrorPanel = props => (
  <Demo>
    <Panel className="nds-panel_filters">
      <PanelBody className="nds-grid nds-grid_vertical">
        <Filters>
          <FiltersHeader className="nds-grid_align-spread">
            <button className="nds-button nds-button_neutral">Cancel</button>
            <button className="nds-button nds-button_brand">Save</button>
          </FiltersHeader>
          <FiltersBody>
            <div
              className="nds-text-color_error nds-m-bottom_x-small"
              role="alert"
            >
              Filters could not be applied. Please fix the validation errors
              below.
            </div>
            <ol className="nds-list_vertical nds-list_vertical-space">
              <FilterObject type="Show Me">All Products</FilterObject>
            </ol>
            <h3 className="nds-text-body_small nds-m-vertical_x-small">
              Matching all these filters
            </h3>
            <ol className="nds-list_vertical nds-list_vertical-space">
              <FilterObject type="Created Date" removable>
                equals THIS WEEK
              </FilterObject>
              <FilterObject type="List Price" removable>
                greater than "500"
              </FilterObject>
              <FilterObject
                className="nds-has-error"
                type="Stage"
                errorMessage="Error Message"
                removable
              >
                equals "Red"
              </FilterObject>
            </ol>
          </FiltersBody>
          <FiltersFooter />
        </Filters>
      </PanelBody>
    </Panel>
  </Demo>
);

let Locked = props => (
  <Demo>
    <Panel className="nds-panel_filters">
      <PanelBody className="nds-grid nds-grid_vertical">
        <Filters>
          <FiltersHeader>
            <h2 className="nds-align-middle nds-text-heading_small">Filter</h2>
            <ButtonIcon
              className="nds-col_bump-left nds-button_icon nds-button_icon-small"
              symbol="forward"
              assistiveText="Close Filter Panel"
              title="Close Filter Panel"
            />
          </FiltersHeader>
          <FiltersBody>
            <ol className="nds-list_vertical nds-list_vertical-space">
              <FilterObject type="Show Me">All Products</FilterObject>
            </ol>
            <h3 className="nds-text-body_small nds-m-vertical_x-small">
              Matching all these filters
            </h3>
            <ol className="nds-list_vertical nds-list_vertical-space">
              <FilterObject type="Created Date" removable>
                equals THIS WEEK
              </FilterObject>
              <FilterObject type="List Price" removable>
                greater than "500"
              </FilterObject>
            </ol>
            <h3 className="nds-text-body_small nds-m-vertical_x-small nds-grid">
              Locked Filters
              <SvgIcon
                className="nds-icon nds-icon_x-small nds-icon-text-default nds-m-left_x-small"
                sprite="utility"
                symbol="lock"
              />
            </h3>
            <ol className="nds-list_vertical nds-list_vertical-space">
              <FilterObject className="nds-is-locked" type="Name" disabled>
                equals "ACME"
              </FilterObject>
            </ol>
          </FiltersBody>
          <FiltersFooter />
        </Filters>
      </PanelBody>
    </Panel>
  </Demo>
);

/// ////////////////////////////////////////
// Export
/// ////////////////////////////////////////

export default <Default />;

export let states = [
  {
    id: 'filtering-new-object',
    label: 'New filter',
    element: <NewFilter />
  },
  {
    id: 'filtering-error',
    label: 'Error',
    element: <ErrorPanel />
  },
  {
    id: 'filtering-locked',
    label: 'Locked Filters',
    element: <Locked />
  }
];
