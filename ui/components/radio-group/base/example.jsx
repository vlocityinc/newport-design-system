// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import classNames from 'classnames';
import _ from '../../../shared/helpers';

/// ////////////////////////////////////////
// Partial(s)
/// ////////////////////////////////////////

export let Fieldset = props => (
  <fieldset className={classNames('nds-form-element', props.className)}>
    {props.children}
  </fieldset>
);

export let Legend = props => (
  <legend
    className={classNames(
      'nds-form-element__legend nds-form-element__label',
      props.className
    )}
  >
    {props.children}
  </legend>
);

export let FormElementControl = props => (
  <div className={classNames('nds-form-element__control', props.className)}>
    {props.children}
  </div>
);

export let Radio = props => {
  const uniqueId = _.uniqueId('radio-');

  return (
    <span className={classNames('nds-radio', props.className)}>
      <input
        type="radio"
        id={uniqueId}
        name={props.name || 'options'}
        disabled={props.disabled}
        defaultChecked={props.checked}
        aria-describedby={props.errorId}
      />
      <label className="nds-radio__label" htmlFor={uniqueId}>
        <span className="nds-radio_faux" />
        <span className="nds-form-element__label">{props.label}</span>
      </label>
    </span>
  );
};

/// ///////////////////////////////////////////
// Export
/// ///////////////////////////////////////////

export default (
  <Fieldset>
    <Legend>Radio Group Label</Legend>
    <FormElementControl>
      <Radio checked label="Radio Label One" />
      <Radio label="Radio Label Two" />
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
          <Radio disabled label="Radio Label One" />
          <Radio disable label="Radio Label Two" />
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
          <abbr className="nds-required" title="required">
            *
          </abbr>{' '}
          Radio Group Label
        </Legend>
        <FormElementControl>
          <Radio checked label="Radio Label One" />
          <Radio label="Radio Label Two" />
        </FormElementControl>
      </Fieldset>
    )
  },
  {
    id: 'error',
    label: 'Error',
    element: (
      <Fieldset className="nds-has-error">
        <Legend>
          <abbr className="nds-required" title="required">
            *
          </abbr>{' '}
          Radio Group Label
        </Legend>
        <FormElementControl>
          <Radio errorId="error_01" checked label="Radio Label One" />
          <Radio errorId="error_01" label="Radio Label Two" />
        </FormElementControl>
        <div id="error_01" className="nds-form-element__help">
          This field is required
        </div>
      </Fieldset>
    )
  }
];
