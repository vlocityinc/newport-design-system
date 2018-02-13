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
  <div className="nds-radio_custom-group nds-clearfix">{props.children}</div>
);

let RadioButton = props => (
  <span
    className={classNames(
      'nds-button nds-radio_button nds-float_left nds-cont-width',
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
    <label className="nds-radio_button__label" htmlFor={props.id}>
      <img src="https://vlocity.com/cms/resources/vlocity-comms-bugreversed.svg" />
      <div className="nds-radio_custom-faux">{props.children}</div>
    </label>
  </span>
);

let RadioButtonNoimage = props => (
  <span
    className={classNames(
      'nds-button nds-radio_button nds-float_left nds-cont-width',
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
    <label className="nds-radio_button__label" htmlFor={props.id}>
      <div className="nds-radio_custom-faux nds-title">{props.children}</div>
    </label>
  </span>
);

let Noimage = props => (
  <Fieldset>
    <Legend>Radio Group Label Without Image</Legend>
    <FormElementControl>
      <RadioButtonGroup>
        <RadioButtonNoimage id="monday">Mon</RadioButtonNoimage>
        <RadioButtonNoimage id="tuesday">Tue</RadioButtonNoimage>
        <RadioButtonNoimage id="wednesday">Wed</RadioButtonNoimage>
        <RadioButtonNoimage id="thursday">Thu</RadioButtonNoimage>
        <RadioButtonNoimage id="friday">Fri</RadioButtonNoimage>
      </RadioButtonGroup>
    </FormElementControl>
  </Fieldset>
);

/// ////////////////////////////////////////
// Export
/// ////////////////////////////////////////

export default (
  <Fieldset>
    <Legend>Radio Group Label</Legend>
    <FormElementControl>
      <RadioButtonGroup>
        <RadioButton id="monday">Mon</RadioButton>
        <RadioButton id="tuesday">Tue</RadioButton>
        <RadioButton id="wednesday">Wed</RadioButton>
        <RadioButton id="thursday">Thu</RadioButton>
        <RadioButton id="friday">Fri</RadioButton>
      </RadioButtonGroup>
    </FormElementControl>
  </Fieldset>
);

export let states = [
  {
    id: 'noimage',
    label: 'noimage',
    element: <Noimage />
  },
  {
    id: 'disabled',
    label: 'Disabled',
    element: (
      <Fieldset>
        <Legend>Radio Group Label</Legend>
        <FormElementControl>
          <RadioButtonGroup>
            <RadioButton id="monday" disabled="true">
              Mon
            </RadioButton>
            <RadioButton id="tuesday" disabled="true">
              Tue
            </RadioButton>
            <RadioButton id="wednesday" disabled="true">
              Wed
            </RadioButton>
            <RadioButton id="thursday" disabled="true">
              Thu
            </RadioButton>
            <RadioButton id="friday" disabled="true">
              Fri
            </RadioButton>
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
          <abbr className="nds-required" title="required">
            *
          </abbr>Radio Group Label
        </Legend>
        <FormElementControl>
          <RadioButtonGroup>
            <RadioButton id="monday">Mon</RadioButton>
            <RadioButton id="tuesday">Tue</RadioButton>
            <RadioButton id="wednesday">Wed</RadioButton>
            <RadioButton id="thursday">Thu</RadioButton>
            <RadioButton id="friday">Fri</RadioButton>
          </RadioButtonGroup>
        </FormElementControl>
      </Fieldset>
    )
  },
  {
    id: 'error',
    label: 'Has error',
    element: (
      <Fieldset className="nds-has-error">
        <Legend>
          <abbr className="nds-required" title="required">
            *
          </abbr>Radio Group Label
        </Legend>
        <FormElementControl>
          <RadioButtonGroup>
            <RadioButton errorId="error_01" id="monday">
              Mon
            </RadioButton>
            <RadioButton errorId="error_01" id="tuesday">
              Tue
            </RadioButton>
            <RadioButton errorId="error_01" id="wednesday">
              Wed
            </RadioButton>
            <RadioButton errorId="error_01" id="thursday">
              Thu
            </RadioButton>
            <RadioButton errorId="error_01" id="friday">
              Fri
            </RadioButton>
          </RadioButtonGroup>
          <div id="error_01" className="nds-form-element__help">
            This field is required
          </div>
        </FormElementControl>
      </Fieldset>
    )
  }
];
