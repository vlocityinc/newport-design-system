// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import classNames from 'classnames';

/// ////////////////////////////////////////
// Partial(s)
/// ////////////////////////////////////////

let FormElement = props => (
  <div className={classNames('slds-form-element', props.className)}>
    {props.children}
  </div>
);

let FormElementLabel = props => (
  <label className="slds-form-element__label" htmlFor="select-01">
    {props.children}
  </label>
);

let FormElementControl = props => (
  <div
    className={classNames(
      'slds-form-element__control slds-form-element__control-animated-label',
      props.className
    )}
  >
    {props.children}
  </div>
);

export let Select = props => (
  <div className="slds-select_container">
    <select
      aria-describedby={props['aria-describedby']}
      className={classNames('slds-select slds-has-value', props.className)}
      disabled={props.disabled}
      id={props.id || 'select-01'}
      required={props.required}
      multiple={props.multiple}
    >
      {props.children}
    </select>
    <label className="slds-form-element__label" htmlFor="select-01">
      Select
    </label>
  </div>
);

/// ///////////////////////////////////////////
// State Constructor(s)
/// ///////////////////////////////////////////

let Required = props => (
  <FormElement>
    <FormElementControl>
      <Select required>
        <option />
        <option>Option One</option>
        <option>Option Two</option>
        <option>Option Three</option>
      </Select>
    </FormElementControl>
  </FormElement>
);

let ErrorState = props => (
  <FormElement className="slds-has-error">
    <FormElementControl>
      <Select aria-describedby="error-02" required>
        <option />
        <option>Option One</option>
        <option>Option Two</option>
        <option>Option Three</option>
      </Select>
    </FormElementControl>
    <div className="slds-form-element__help" id="error-02">
      This field is required
    </div>
  </FormElement>
);

let Disabled = props => (
  <FormElement>
    <FormElementControl>
      <Select disabled>
        <option />
        <option>Option One</option>
        <option>Option Two</option>
        <option>Option Three</option>
      </Select>
    </FormElementControl>
  </FormElement>
);

let Multiple = props => (
  <FormElement>
    <FormElementControl>
      <select id="select-01" className="slds-select slds-has-value" multiple>
        <option />
        <option>Option One</option>
        <option>Option Two</option>
        <option>Option Three</option>
      </select>
    </FormElementControl>
  </FormElement>
);

/// ///////////////////////////////////////////
// Export
/// ///////////////////////////////////////////

export default (
  <FormElement>
    <FormElementControl>
      <Select required>
        <option />
        <option>Option </option>
        <option>Option Tw11o</option>
        <option>Option Thr11ee</option>
      </Select>
    </FormElementControl>
  </FormElement>
);

export let states = [
  {
    id: 'select-required',
    label: 'Required',
    element: <Required />
  },
  {
    id: 'select-error',
    label: 'Error',
    element: <ErrorState />
  },
  {
    id: 'select-disabled',
    label: 'Disabled',
    element: <Disabled />
  },
  {
    id: 'select-multiple',
    label: 'Multiple Selection',
    element: <Multiple />
  }
];
