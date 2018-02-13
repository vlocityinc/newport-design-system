// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import { ButtonIcon } from '../../button-icons/base/example';
import { Checkbox } from '../../checkbox/base/example';
import { Select } from '../../select/base/example';
import { Pill, PillContainer } from '../../pills/base/example';
import SvgIcon from '../../../shared/svg-icon';
import classNames from 'classnames';

/// ////////////////////////////////////////
// Partial(s)
/// ////////////////////////////////////////

let Demo = props => (
  <div
    className="demo-only nds-grid"
    style={{
      height: '845px',
      maxWidth: '420px',
      background: '#f4f6f9',
      padding: '1rem'
    }}
  >
    {props.children}
  </div>
);

export let Panel = props => (
  <div
    className={classNames(
      'nds-panel nds-grid nds-grid_vertical nds-nowrap',
      props.className
    )}
  >
    {props.children}
  </div>
);

export let PanelBody = props => (
  <div
    className={classNames(
      'nds-form nds-form_stacked nds-grow nds-scrollable_y',
      props.className
    )}
  >
    {props.children}
  </div>
);

export let PanelSection = props => (
  <div className={classNames('nds-panel__section', props.className)}>
    {props.children}
  </div>
);

let PanelHeader = props => (
  <div className="nds-media">
    <div className="nds-media__figure">
      <Checkbox label="Complete Task" hideLabel />
    </div>
    <div className="nds-media__body">
      <h2
        className="nds-truncate nds-text-heading_small"
        title="Follow up on '15 contact"
      >
        <a href="javascript:void(0);">Follow up on '15 contact</a>
      </h2>
      <p className="nds-truncate nds-text-body_small" title="Jun 18">
        Jun 18
      </p>
      <div className="nds-button-group nds-m-top_small" role="group">
        <button className="nds-button nds-button_neutral nds-grow">Edit</button>
        <button className="nds-button nds-button_neutral nds-grow">
          Follow Up
        </button>
        <button className="nds-button nds-button_neutral nds-grow">
          Delete
        </button>
        <ButtonIcon
          className="nds-button_icon-border-filled"
          symbol="down"
          aria-haspopup="true"
          assistiveText="More Actions"
          title="More Actions"
        />
      </div>
    </div>
  </div>
);

export let FormElementStatic = props => (
  <li
    className={classNames(
      'nds-form-element nds-hint-parent nds-border_bottom',
      props.inlineEdit ? 'nds-form-element_edit' : null
    )}
  >
    <span className="nds-form-element__label">{props.label}</span>
    <div className="nds-form-element__control">
      <span
        className={classNames(
          'nds-form-element__static',
          props.longform ? 'nds-text-longform' : null
        )}
      >
        {props.text}
      </span>
      {props.inlineEdit ? (
        <ButtonIcon
          className="nds-float_right nds-button_icon nds-button_icon-small"
          iconClassName="nds-button__icon_hint"
          symbol="edit"
          assistiveText="Edit this Field"
          title="Edit this Field"
        />
      ) : null}
    </div>
  </li>
);

let FormElement = props => (
  <div className="nds-form-element">
    <label className="nds-form-element__label" htmlFor={props.id}>
      {props.label}
    </label>
    <div className="nds-form-element__control">{props.children}</div>
  </div>
);

let Lookup = props => (
  <div className="nds-form-element nds-lookup nds-has-selection">
    <span className="nds-form-element__label" htmlFor={props.id}>
      {props.label}
    </span>
    <div className="nds-form-element__control">{props.children}</div>
  </div>
);

/// ////////////////////////////////////////
// State Constructor(s)
/// ////////////////////////////////////////

let Default = props => (
  <Demo>
    <Panel containerClassName="panel_container--space">
      <PanelBody>
        <PanelSection className="nds-border_bottom">
          <PanelHeader />
        </PanelSection>
        <PanelSection>
          <h3 className="nds-text-heading_small nds-m-bottom_medium">
            Task Information
          </h3>
          <ul>
            <FormElementStatic
              label="Subject"
              text="Follow up on '15 Contract"
            />
            <FormElementStatic label="Due Date" text="6/18/16" />
            <FormElementStatic label="Assigned TO" text="Jason Dewar" />
            <FormElementStatic label="Name" text="Adam Choi" />
            <FormElementStatic
              label="Related To"
              text="Tesla Cloudhub + Anypoint Connectors"
            />
            <FormElementStatic
              longform
              label="Comments"
              text="Adam was open to doing more business in the 4th quarter. Follow up with marketing demo and email templates."
            />
          </ul>
        </PanelSection>
        <PanelSection>
          <h3 className="nds-text-heading_small nds-m-bottom_medium">
            Additional Information
          </h3>
          <ul>
            <FormElementStatic label="Status" text="Not Started" />
            <FormElementStatic label="Priority" text="Normal" />
          </ul>
        </PanelSection>
      </PanelBody>
    </Panel>
  </Demo>
);

let HasEditing = props => (
  <Demo>
    <Panel containerClassName="panel_container--space">
      <PanelBody>
        <PanelSection className="nds-border_bottom">
          <PanelHeader />
        </PanelSection>
        <PanelSection>
          <h3 className="nds-text-heading_small nds-m-bottom_medium">
            Task Information
          </h3>
          <ul>
            <FormElementStatic
              inlineEdit
              label="Subject"
              text="Follow up on '15 Contract"
            />
            <FormElementStatic inlineEdit label="Due Date" text="6/18/16" />
            <FormElementStatic
              inlineEdit
              label="Assigned TO"
              text="Jason Dewar"
            />
            <FormElementStatic inlineEdit label="Name" text="Adam Choi" />
            <FormElementStatic
              inlineEdit
              label="Related To"
              text="Tesla Cloudhub + Anypoint Connectors"
            />
            <FormElementStatic
              inlineEdit
              longform
              label="Comments"
              text="Adam was open to doing more business in the 4th quarter. Follow up with marketing demo and email templates."
            />
          </ul>
        </PanelSection>
        <PanelSection>
          <h3 className="nds-text-heading_small nds-m-bottom_medium">
            Additional Information
          </h3>
          <ul>
            <FormElementStatic inlineEdit label="Status" text="Not Started" />
            <FormElementStatic inlineEdit label="Priority" text="Normal" />
          </ul>
        </PanelSection>
      </PanelBody>
    </Panel>
  </Demo>
);

let IsEditing = props => (
  <Demo>
    <Panel
      containerClassName="panel_container--space"
      className="nds-is-editing"
    >
      <PanelBody>
        <PanelSection className="nds-border_bottom">
          <PanelHeader />
        </PanelSection>
        <PanelSection>
          <h3 className="nds-text-heading_small nds-m-bottom_medium">
            Task Information
          </h3>
          <ul>
            <FormElement label="Subject" id="text-input-01">
              <input
                className="nds-input"
                id="text-input-01"
                defaultValue="Follow up on '15 Contract"
              />
            </FormElement>
            <FormElement label="Due Date" id="date-input-01">
              <input
                className="nds-input"
                id="date-input-01"
                defaultValue="6/18/16"
              />
            </FormElement>
            <Lookup label="Assigned To" id="text-input-02">
              <PillContainer>
                <Pill label="Jason Dewar">
                  <span className="nds-icon_container nds-icon-standard-avatar nds-pill__icon_container">
                    <SvgIcon
                      className="nds-icon"
                      sprite="standard"
                      symbol="avatar"
                    />
                    <span className="nds-assistive-text">Person</span>
                  </span>
                </Pill>
              </PillContainer>
            </Lookup>
            <Lookup label="Name" id="text-input-03">
              <PillContainer>
                <Pill label="Adam Choi">
                  <span className="nds-icon_container nds-icon-standard-avatar nds-pill__icon_container">
                    <SvgIcon
                      className="nds-icon"
                      sprite="standard"
                      symbol="avatar"
                    />
                    <span className="nds-assistive-text">Person</span>
                  </span>
                </Pill>
              </PillContainer>
            </Lookup>
            <Lookup label="Related To" id="text-input-04">
              <PillContainer>
                <Pill label="Tesla Cloudhub + Anypoint Connectors">
                  <span className="nds-icon_container nds-icon-standard-account nds-pill__icon_container">
                    <SvgIcon
                      className="nds-icon"
                      sprite="standard"
                      symbol="account"
                    />
                    <span className="nds-assistive-text">Account</span>
                  </span>
                </Pill>
              </PillContainer>
            </Lookup>
            <FormElement label="Comments" id="text-input-05">
              <textarea
                className="nds-textarea"
                id="text-input-05"
                defaultValue="Adam was open to doing more business in the 4th quarter. Follow up with marketing demo and email templates."
              />
            </FormElement>
          </ul>
        </PanelSection>
        <PanelSection>
          <h3 className="nds-text-heading_small nds-m-bottom_medium">
            Additional Information
          </h3>
          <ul>
            <FormElement label="Status" id="non-text-input-01">
              <Select id="non-text-input-01">
                <option>Not Started</option>
                <option>Prospecting</option>
              </Select>
            </FormElement>
            <FormElement label="Priority" id="non-text-input-02">
              <Select id="non-text-input-02">
                <option>Normal</option>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </Select>
            </FormElement>
          </ul>
        </PanelSection>
      </PanelBody>
      <div className="nds-panel__actions nds-border_top">
        <div className="nds-grid nds-grid_align-center">
          <button type="button" className="nds-button nds-button_neutral">
            Cancel
          </button>
          <button type="button" className="nds-button nds-button_brand">
            Save
          </button>
        </div>
      </div>
    </Panel>
  </Demo>
);

/// ////////////////////////////////////////
// Export
/// ////////////////////////////////////////

export default <Default />;

export let states = [
  {
    id: 'panel-form-edit-mode',
    label: 'Form with Inline Edit',
    element: <HasEditing />
  },
  {
    id: 'panel-form-edit-mode-active',
    label: 'Form with Inline Edit Active',
    element: <IsEditing />
  }
];
