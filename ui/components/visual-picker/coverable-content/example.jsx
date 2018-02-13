// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import SvgIcon from '../../../shared/svg-icon';
import classNames from 'classnames';
import _ from '../../../shared/helpers';

import {
  Fieldset,
  Legend,
  FormElementControl
} from '../../radio-group/base/example';
import { UtilityIcon } from '../../icons/base/example';

/// ////////////////////////////////////////
// Partial(s)
/// ////////////////////////////////////////

export let VisualPicker = props => {
  const uniqueId = _.uniqueId('visual-picker-');

  return (
    <div
      className={classNames('nds-visual-picker', {
        'nds-visual-picker_large': props.size === 'large',
        'nds-visual-picker_medium': props.size == 'medium'
      })}
    >
      <input
        type={props.type}
        id={uniqueId}
        name="options"
        defaultChecked={props.checked}
        disabled={props.disabled}
      />
      <label htmlFor={uniqueId}>
        {props.icon ? (
          <span
            className={classNames(
              'nds-visual-picker__figure nds-visual-picker__icon nds-align_absolute-center',
              props.className
            )}
          >
            <span className="nds-is-selected">
              <span
                className="nds-icon_container"
                title="description of icon when needed"
              >
                <SvgIcon
                  className="nds-icon nds-icon_large nds-icon-action-check"
                  sprite="action"
                  symbol="check"
                />
                <span className="nds-assistive-text">
                  Provide description of icon
                </span>
              </span>
            </span>
            <span className="nds-is-not-selected">
              <span
                className="nds-icon_container"
                title="description of icon when needed"
              >
                <SvgIcon
                  className={classNames(
                    'nds-icon nds-icon-' +
                      props.sprite +
                      '-' +
                      props.symbol +
                      ' nds-icon_large',
                    { 'nds-icon-text-default': props.sprite === 'utility' }
                  )}
                  sprite={props.sprite || 'action'}
                  symbol={props.symbol}
                />
                <span className="nds-assistive-text">
                  Provide description of icon
                </span>
              </span>
            </span>
          </span>
        ) : (
          <span
            className={classNames(
              'nds-visual-picker__figure nds-visual-picker__text nds-align_absolute-center',
              props.className
            )}
          >
            {props.children}
          </span>
        )}
        {props.label ? (
          <span className="nds-visual-picker__body">{props.label}</span>
        ) : null}
        {!props.icon ? (
          <span className="nds-icon_container nds-visual-picker__text-check">
            <SvgIcon
              className="nds-icon nds-icon-text-check nds-icon_x-small"
              sprite="utility"
              symbol="check"
            />
          </span>
        ) : null}
      </label>
    </div>
  );
};

export let VisualPickerMediaObject = props => (
  <a
    href="javascript:void(0);"
    className={classNames(
      'nds-box nds-box_link nds-box_x-small nds-media',
      props.className
    )}
  >
    <div className="nds-media__figure nds-media__figure_fixed-width nds-align_absolute-center nds-m-left_xx-small">
      <UtilityIcon className="nds-icon-text-default" symbol="knowledge_base" />
    </div>
    <div className="nds-media__body nds-border_left nds-p-around_small">
      {props.children}
    </div>
  </a>
);

/// ////////////////////////////////////////
// Export
/// ////////////////////////////////////////

export default (
  <Fieldset>
    <Legend>Select an app</Legend>
    <FormElementControl>
      <VisualPicker
        type="radio"
        icon
        sprite="utility"
        symbol="connected_apps"
        label="Connected App"
        size="medium"
      />
      <VisualPicker
        type="radio"
        icon
        sprite="utility"
        symbol="custom_apps"
        label="Custom App"
        size="medium"
      />
    </FormElementControl>
  </Fieldset>
);

export let states = [
  {
    id: 'disabled',
    label: 'Disabled option',
    element: (
      <Fieldset>
        <Legend>Select an app</Legend>
        <FormElementControl>
          <VisualPicker
            type="checkbox"
            icon
            sprite="utility"
            symbol="connected_apps"
            label="Connected App"
            size="medium"
          />
          <VisualPicker
            type="checkbox"
            disabled
            icon
            sprite="utility"
            symbol="custom_apps"
            label="Custom App"
            size="medium"
          />
        </FormElementControl>
      </Fieldset>
    )
  }
];

export let examples = [
  {
    id: 'checkbox-group',
    label: 'Checkbox group',
    element: (
      <Fieldset>
        <Legend>Add the following object(s)</Legend>
        <FormElementControl>
          <VisualPicker
            type="checkbox"
            icon
            sprite="standard"
            symbol="account"
            label="Account"
            size="medium"
          />
          <VisualPicker
            type="checkbox"
            icon
            sprite="standard"
            symbol="lead"
            label="Lead"
            size="medium"
          />
          <VisualPicker
            type="checkbox"
            icon
            sprite="standard"
            symbol="orders"
            label="Orders"
            size="medium"
          />
        </FormElementControl>
      </Fieldset>
    )
  }
];
