// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import classNames from 'classnames';
import { UtilityIcon } from '../../icons/base/example';

/// ////////////////////////////////////////
// Partial(s)
/// ////////////////////////////////////////

let Fieldset = props => (
  <fieldset className={classNames('nds-form-element', props.className)}>
    <legend className="nds-form-element__legend nds-form-element__label">
      Scheduled Day(s)
    </legend>
    <div className="nds-form-element__control">{props.children}</div>
  </fieldset>
);

let CheckboxGroup = props => (
  <div className="nds-checkbox_custom-group nds-clearfix">{props.children}</div>
);

let Checkbox = props => (
  <span
    className={classNames(
      'nds-button nds-checkbox_button nds-float_left  nds-cont-width',
      props.className
    )}
  >
    <input
      aria-describedby={props.errorId}
      disabled={props.disabled}
      id={props.id}
      name="checkbox"
      type="checkbox"
    />
    <label className="nds-checkbox_button__label" htmlFor={props.id}>
      <img src="https://vlocity.com/cms/resources/vlocity-comms-bugreversed.svg" />
      <span className="nds-checkbox_custom-faux">{props.children}</span>
    </label>
  </span>
);

let CheckboxNoimage = props => (
  <span
    className={classNames(
      'nds-button nds-checkbox_button nds-float_left nds-cont-width',
      props.className
    )}
  >
    <input
      aria-describedby={props.errorId}
      disabled={props.disabled}
      id={props.id}
      name="checkbox"
      type="checkbox"
    />
    <label className="nds-checkbox_button__label" htmlFor={props.id}>
      <span className="nds-checkbox_custom-faux nds-title">
        {props.children}
      </span>

      <div className="nds-icon_container nds-icon-utility-check nds-multi-select">
        <UtilityIcon className="nds-list__icon--size" symbol="check" />
      </div>
    </label>
  </span>
);

let Noimage = props => (
  <Fieldset>
    <CheckboxGroup>
      <CheckboxNoimage id="monday">Mon</CheckboxNoimage>
      <CheckboxNoimage id="tuesday">Tue</CheckboxNoimage>
      <CheckboxNoimage id="wednesday">Wed</CheckboxNoimage>
      <CheckboxNoimage id="thursday">Thu</CheckboxNoimage>
      <CheckboxNoimage id="friday">Fri</CheckboxNoimage>
    </CheckboxGroup>
  </Fieldset>
);

/// ////////////////////////////////////////
// Export
/// ////////////////////////////////////////

export default (
  <Fieldset>
    <CheckboxGroup>
      <Checkbox id="monday">Mon</Checkbox>
      <Checkbox id="tuesday">Tue</Checkbox>
      <Checkbox id="wednesday">Wed</Checkbox>
      <Checkbox id="thursday">Thu</Checkbox>
      <Checkbox id="friday">Fri</Checkbox>
    </CheckboxGroup>
  </Fieldset>
);

export let states = [
  {
    id: 'noimage',
    label: 'noimage',
    element: <Noimage />
  },
  {
    id: 'has-error',
    label: 'Error',
    element: (
      <Fieldset className="nds-has-error">
        <CheckboxGroup>
          <Checkbox errorId="error_01" id="monday">
            Mon
          </Checkbox>
          <Checkbox errorId="error_01" id="tuesday">
            Tue
          </Checkbox>
          <Checkbox errorId="error_01" id="wednesday">
            Wed
          </Checkbox>
          <Checkbox errorId="error_01" id="thursday">
            Thu
          </Checkbox>
          <Checkbox errorId="error_01" id="friday">
            Fri
          </Checkbox>
        </CheckboxGroup>
        <div id="error_01" className="nds-form-element__help">
          This field is required
        </div>
      </Fieldset>
    )
  },
  {
    id: 'disabled',
    label: 'Disabled',
    element: (
      <Fieldset>
        <CheckboxGroup>
          <Checkbox id="monday" disabled="true">
            Mon
          </Checkbox>
          <Checkbox id="tuesday" disabled="true">
            Tue
          </Checkbox>
          <Checkbox id="wednesday" disabled="true">
            Wed
          </Checkbox>
          <Checkbox id="thursday" disabled="true">
            Thu
          </Checkbox>
          <Checkbox id="friday" disabled="true">
            Fri
          </Checkbox>
        </CheckboxGroup>
      </Fieldset>
    )
  }
];
