// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';

export default (
  <div className="demo-only" style={{ width: '440px' }}>
    <div className="nds-form nds-form_compound">
      <fieldset className="nds-form-element">
        <legend className="nds-form-element__label nds-text-title_caps">
          Location
        </legend>
        <div className="nds-form-element__group">
          <div className="nds-form-element__row">
            <div className="nds-form-element nds-size_1-of-2">
              <label className="nds-form-element__label" htmlFor="input-01">
                Latitude
              </label>
              <input id="input-01" className="nds-input" type="text" />
            </div>
            <div className="nds-form-element nds-size_1-of-2">
              <label className="nds-form-element__label" htmlFor="input-02">
                Longitude
              </label>
              <input id="input-02" className="nds-input" type="text" />
            </div>
          </div>
        </div>
      </fieldset>

      <fieldset className="nds-form-element">
        <legend className="nds-form-element__label nds-text-title_caps">
          Address
        </legend>
        <div className="nds-form-element__group">
          <div className="nds-form-element__row">
            <div className="nds-form-element nds-size_1-of-1">
              <label className="nds-form-element__label" htmlFor="input-03">
                Street
              </label>
              <input id="input-03" className="nds-input" type="text" />
            </div>
          </div>
          <div className="nds-form-element__row">
            <div className="nds-form-element nds-size_1-of-2">
              <label className="nds-form-element__label" htmlFor="input-04">
                City
              </label>
              <input id="input-04" className="nds-input" type="text" />
            </div>
            <div className="nds-form-element nds-size_1-of-2">
              <label className="nds-form-element__label" htmlFor="input-05">
                State
              </label>
              <input id="input-05" className="nds-input" type="text" />
            </div>
          </div>
          <div className="nds-form-element__row">
            <div className="nds-form-element nds-size_1-of-2">
              <label className="nds-form-element__label" htmlFor="input-06">
                ZIP Code
              </label>
              <input id="input-06" className="nds-input" type="text" />
            </div>
          </div>
        </div>
      </fieldset>
    </div>
  </div>
);
