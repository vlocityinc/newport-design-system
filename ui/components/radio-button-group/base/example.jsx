// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import classNames from 'classnames';
import { FormElementControl } from '../../radio-group/base/example';
import { Fieldset, Legend } from '../../radio-group/base/example';

/// ////////////////////////////////////////
// Partial(s)
/// ////////////////////////////////////////

let RadioButtonGroup = props => (
  <div className="slds-radio_button-group">{props.children}</div>
);

let RadioButton = props => (
  <span
    className={classNames(
      'slds-button slds-radio_button slds-size--6-of-12',
      props.className
    )}
  >
    <input
      name="radio"
      type="radio"
      id={props.id}
      disabled={props.disabled}
      aria-describedby={props.errorId}
    />
    <label className="slds-radio_button__label" htmlFor={props.id}>
      <span className="slds-radio_faux">{props.children}</span>
      <div className="slds-radio-overlay" />
    </label>
  </span>
);

/// ////////////////////////////////////////
// Export
/// ////////////////////////////////////////

export default (
  <Fieldset>
    <Legend>Radio Group Label</Legend>
    <FormElementControl>
      <RadioButtonGroup>
        <RadioButton id="male">Male</RadioButton>
        <RadioButton id="female">Female</RadioButton>
      </RadioButtonGroup>
    </FormElementControl>
  </Fieldset>
);

export let states = [
  {
    id: 'disabled',
    label: 'Disabled',
    element: (
      <Fieldset>
        <Legend>Radio Group Label</Legend>
        <FormElementControl>
          <RadioButtonGroup>
            <RadioButton id="male">Male</RadioButton>
            <RadioButton id="female">Female</RadioButton>
          </RadioButtonGroup>
        </FormElementControl>
      </Fieldset>
    )
  },
  {
    id: 'required',
    label: 'Required',
    element: (
      <Fieldset>
        <Legend>
          <abbr className="slds-required" title="required">
            *
          </abbr>Radio Group Label
        </Legend>
        <FormElementControl>
          <RadioButtonGroup>
            <RadioButton id="male">Male</RadioButton>
            <RadioButton id="female">Female</RadioButton>
          </RadioButtonGroup>
        </FormElementControl>
      </Fieldset>
    )
  },
  {
    id: 'error',
    label: 'Has error',
    element: (
      <Fieldset className="slds-has-error">
        <Legend>
          <abbr className="slds-required" title="required">
            *
          </abbr>Radio Group Label
        </Legend>
        <FormElementControl>
          <RadioButtonGroup>
            <RadioButton errorId="error_01" id="male">
              Male
            </RadioButton>
            <RadioButton errorId="error_01" id="female">
              Female
            </RadioButton>
          </RadioButtonGroup>
          <div id="error_01" className="slds-form-element__help">
            This field is required
          </div>
        </FormElementControl>
      </Fieldset>
    )
  }
];
