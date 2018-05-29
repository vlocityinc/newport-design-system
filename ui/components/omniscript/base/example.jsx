// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';

export default (
  <div id="VlocityBP" className="vlocity via-slds via-omni via-nds">
    <ng-view id="VlocityBPView" autoscroll="true">
      <div className="nds-col nds-clearfix">
        <sidebar className="nds-col_padded nds-cleafix">
          <div />
        </sidebar>
        <auto-saveforlater-msg />
        <div>
          <section className="nds-page-header nds-m-top_x-small">
            <div className="nds-size_1-of-1">
              <div className="nds-size_6-of-12 nds-align_absolute-center nds-grid">
                <div className="nds-size_1-of-1 nds-col_bump-right">
                  <div className="nds-progress nds-size_1-of-1">
                    <ol className="nds-progress__list">
                      <li
                        className="nds-progress__item nds-is-relative nds-progress__visited completed nds-is-completed"
                        state="false"
                        vlc-slds-step-styler=""
                        role="button"
                        tabindex="0"
                      >
                        <button className="nds-button nds-progress__marker">
                          <svg
                            aria-hidden="true"
                            className="slds-icon slds-icon--small nds-icon nds-icon_small nds-button__icon"
                            xmlns="http://www.w3.org/2000/svg"
                            preserveAspectRatio="xMidYMid meet"
                            sprite="'utility'"
                            icon="'success'"
                            size="'small'"
                            extra-classes="'nds-button__icon'"
                            viewBox="0 0 52 52"
                            alt="success"
                          >
                            <path
                              fill="inherit"
                              xmlns="http://www.w3.org/2000/svg"
                              d="m26 2c-13.3 0-24 10.7-24 24s10.7 24 24 24 24-10.7 24-24-10.7-24-24-24z m13.4 18l-15.3 15.5c-0.6 0.6-1.6 0.6-2.2 0l-8.4-8.5c-0.6-0.6-0.6-1.6 0-2.2l2.2-2.2c0.6-0.6 1.6-0.6 2.2 0l4.4 4.5c0.4 0.4 1.1 0.4 1.5 0l11.2-11.6c0.6-0.6 1.6-0.6 2.2 0l2.2 2.2c0.7 0.6 0.7 1.6 0 2.3z"
                            />
                          </svg>
                        </button>
                        <div className="nds-is-absolute">
                          <div
                            className="nds-popover nds-popover_tooltip nds-nubbin_bottom"
                            role="tooltip"
                          >
                            <div className="nds-popover__body">Step7</div>
                          </div>
                        </div>
                      </li>
                      <li
                        className="nds-progress__item nds-is-relative nds-progress__visited completed nds-is-completed"
                        state="false"
                        vlc-slds-step-styler=""
                        role="button"
                        tabindex="0"
                      >
                        <button className="nds-button nds-progress__marker">
                          <svg
                            aria-hidden="true"
                            className="slds-icon slds-icon--small nds-icon nds-icon_small nds-button__icon"
                            xmlns="http://www.w3.org/2000/svg"
                            preserveAspectRatio="xMidYMid meet"
                            sprite="'utility'"
                            icon="'success'"
                            size="'small'"
                            extra-classes="'nds-button__icon'"
                            viewBox="0 0 52 52"
                            alt="success"
                          >
                            <path
                              fill="inherit"
                              xmlns="http://www.w3.org/2000/svg"
                              d="m26 2c-13.3 0-24 10.7-24 24s10.7 24 24 24 24-10.7 24-24-10.7-24-24-24z m13.4 18l-15.3 15.5c-0.6 0.6-1.6 0.6-2.2 0l-8.4-8.5c-0.6-0.6-0.6-1.6 0-2.2l2.2-2.2c0.6-0.6 1.6-0.6 2.2 0l4.4 4.5c0.4 0.4 1.1 0.4 1.5 0l11.2-11.6c0.6-0.6 1.6-0.6 2.2 0l2.2 2.2c0.7 0.6 0.7 1.6 0 2.3z"
                            />
                          </svg>
                        </button>
                        <div className="nds-is-absolute">
                          <div
                            className="nds-popover nds-popover_tooltip nds-nubbin_bottom"
                            role="tooltip"
                          >
                            <div className="nds-popover__body">
                              Fetch Pick List SFDC Load
                            </div>
                          </div>
                        </div>
                      </li>
                      <li
                        className="nds-progress__item nds-is-relative active nds-progress__visited nds-is-active"
                        state="true"
                        vlc-slds-step-styler=""
                        role="button"
                        tabindex="0"
                      >
                        <button
                          className="nds-button nds-progress__marker"
                          aria-hidden="false"
                        />
                        <div className="nds-is-absolute">
                          <div className="nds-m-top_medium nds-is-relative nds-progress__step-label">
                            <div>Newport to be enabled here for Set Values</div>
                          </div>
                        </div>
                      </li>
                      <li
                        className="nds-progress__item nds-is-relative"
                        state="false"
                        vlc-slds-step-styler=""
                        role="button"
                        tabindex="0"
                      >
                        <button
                          className="nds-button nds-progress__marker"
                          aria-hidden="false"
                        />
                        <div className="nds-is-absolute">
                          <div
                            className="nds-popover nds-popover_tooltip nds-nubbin_bottom"
                            role="tooltip"
                          >
                            <div className="nds-popover__body">
                              Newport to be enabled here for Seed Data
                            </div>
                          </div>
                        </div>
                      </li>
                      <li
                        className="nds-progress__item nds-is-relative"
                        state="false"
                        vlc-slds-step-styler=""
                        role="button"
                        tabindex="0"
                      >
                        <button
                          className="nds-button nds-progress__marker"
                          aria-hidden="false"
                        />
                        <div className="nds-is-absolute">
                          <div
                            className="nds-popover nds-popover_tooltip nds-nubbin_bottom"
                            role="tooltip"
                          >
                            <div className="nds-popover__body">
                              Newport to be enabled here for all elements marked
                              Required and we are setting the values
                            </div>
                          </div>
                        </div>
                      </li>
                      <li
                        className="nds-progress__item nds-is-relative"
                        state="false"
                        vlc-slds-step-styler=""
                        role="button"
                        tabindex="0"
                      >
                        <button
                          className="nds-button nds-progress__marker"
                          aria-hidden="false"
                        />
                        <div className="nds-is-absolute">
                          <div
                            className="nds-popover nds-popover_tooltip nds-nubbin_bottom"
                            role="tooltip"
                          >
                            <div className="nds-popover__body">
                              Newport to be enabled here for all elements marked
                              Required
                            </div>
                          </div>
                        </div>
                      </li>
                      <li
                        className="nds-progress__item nds-is-relative"
                        state="false"
                        vlc-slds-step-styler=""
                        role="button"
                        tabindex="0"
                      >
                        <button
                          className="nds-button nds-progress__marker"
                          aria-hidden="false"
                        />
                        <div className="nds-is-absolute">
                          <div
                            className="nds-popover nds-popover_tooltip nds-nubbin_bottom"
                            role="tooltip"
                          >
                            <div className="nds-popover__body">
                              Newport to be enabled here for all elements Repeat
                            </div>
                          </div>
                        </div>
                      </li>
                    </ol>
                    <div
                      className="nds-progress-bar nds-progress-bar_x-small"
                      aria-valuemin="0"
                      aria-valuemax="100"
                      aria-valuenow="0"
                      role="progressbar"
                    >
                      <span
                        className="nds-progress-bar__value"
                        style={{
                          width: '224.156px',
                          background: 'rgb(94, 180, 255)'
                        }}
                      >
                        <span className="nds-assistive-text">Progress: 0%</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        <div>
          <bptree className="nds-clearfix" style={{ width: '100%' }}>
            <child className="ng-scope">
              <div
                className="nds-grid vlc-slds-step_container nds-size_1-of-1 ng-scope"
                vlc-slds-window-scroll="test"
              >
                <section
                  id="Step for Newport-SetValues"
                  className="step-step nds-size_1-of-1 animate-if"
                  aria-hidden="false"
                >
                  <div className="nds-col_padded nds-align_absolute-center nds-size_6-of-12 nds-medium-size_6-of-12 nds-small-size_1-of-1 nds-x-small-size_1-of-1 nds-p-top_xx-large">
                    <h1 className="nds-step_label ng-binding" prev="true">
                      Newport to be enabled here for Set Values
                    </h1>
                  </div>
                  <form
                    novalidate=""
                    role="form"
                    stepform=""
                    name="a1L61000001lGHqEAM-5"
                    id="a1L61000001lGHqEAM-5"
                    vlc-slds-disable-auto-complete="testing"
                    className="nds-grid nds-wrap nds-align_absolute-center nds-size_6-of-12 nds-medium-size_6-of-12 nds-small-size_1-of-1 nds-x-small-size_1-of-1 nds-p-top_xx-large ng-valid-minlength ng-valid-maxlength ng-valid-validate-val-lookup ng-valid-pattern ng-valid-email ng-dirty ng-valid-min-int ng-valid-max-int ng-valid-min ng-valid-max ng-valid-step ng-valid-mask ng-valid ng-valid-required ng-valid-url ng-pristine-remove ng-dirty-add ng-valid-url-remove"
                    autocomplete="off"
                    autocorrect="off"
                    autocapitalize="off"
                    spellcheck="false"
                    style={{ border: '0px' }}
                  >
                    <div className="nds-col_padded nds-size_1-of-1">
                      <div className="nds-gridx nds-wrap nds-grid_pull-padded">
                        <child
                          className="nds-medium-size_1-of-1 nds-small-size_1-of-1 nds-x-small-size_1-of-1 nds-large-size_12-of-12"
                          aria-hidden="false"
                        >
                          <div className="nds-size_1-of-1 ng-scope">
                            <form
                              name="loopform"
                              className="nds-form-element nds-size_1-of-1 nds-m-bottom_large nds-p-around_small nds-input__tooltip ng-pristine ng-scope ng-valid-minlength ng-valid-maxlength ng-valid ng-valid-required"
                            >
                              <div className="nds-form-element__control nds-form-element__control-animated-label nds-grid">
                                <input
                                  id="Text6"
                                  type="text"
                                  name="loopname"
                                  ng-disabled="control.ro"
                                  ng-required="control.req"
                                  ng-model="control.response"
                                  ng-blur="aggregate(this, control.index, control.indexInParent, true, -1)"
                                  ng-model-options="{ updateOn: 'default focusout blur', debounce: { 'default': control.propSetMap.debounceValue, 'focusout': 0, 'blur': 0 } }"
                                  className="nds-input ng-pristine ng-untouched ng-valid-minlength ng-valid-maxlength ng-empty ng-valid ng-valid-required"
                                  ui-mask=""
                                  ng-maxlength="255"
                                  vlc-slds-ng-pattern=""
                                  ng-minlength="0"
                                  vlc-slds-min-max-len="response"
                                  vlc-slds-val-checker="response"
                                  aria-invalid="false"
                                />
                                <label
                                  for="Text6"
                                  className="nds-form-element__label ng-binding"
                                >
                                  Text6
                                </label>
                                <div className="nds-control-action__container">
                                  <svg
                                    aria-hidden="true"
                                    className="slds-button__icon slds-button__icon--medium nds-button__icon nds-button__icon_medium "
                                    xmlns="http://www.w3.org/2000/svg"
                                    preserveAspectRatio="xMidYMid meet"
                                    sprite="'utility'"
                                    icon="'add'"
                                    size="'medium'"
                                    ng-disabled="control.propSetMap.repeatLimit !== undefined &amp;&amp; control.propSetMap.repeatLimit !== null &amp;&amp; child.eleArray.length >= control.propSetMap.repeatLimit+1"
                                    ng-click="baseCtrl.addItem(this, child, $index)"
                                    role="button"
                                    tabindex="0"
                                    aria-disabled="false"
                                    viewBox="0 0 52 52"
                                    alt="add"
                                  >
                                    <path
                                      fill="inherit"
                                      xmlns="http://www.w3.org/2000/svg"
                                      d="m30 29h16.5c0.8 0 1.5-0.7 1.5-1.5v-3c0-0.8-0.7-1.5-1.5-1.5h-16.5c-0.6 0-1-0.4-1-1v-16.5c0-0.8-0.7-1.5-1.5-1.5h-3c-0.8 0-1.5 0.7-1.5 1.5v16.5c0 0.6-0.4 1-1 1h-16.5c-0.8 0-1.5 0.7-1.5 1.5v3c0 0.8 0.7 1.5 1.5 1.5h16.5c0.6 0 1 0.4 1 1v16.5c0 0.8 0.7 1.5 1.5 1.5h3c0.8 0 1.5-0.7 1.5-1.5v-16.5c0-0.6 0.4-1 1-1z"
                                    />
                                  </svg>
                                </div>
                              </div>
                            </form>
                          </div>
                        </child>
                        <child
                          className="nds-medium-size_1-of-1 nds-small-size_1-of-1 nds-x-small-size_1-of-1 nds-large-size_12-of-12"
                          aria-hidden="false"
                        >
                          <div className="nds-size_1-of-1 ng-scope">
                            <form
                              name="loopform"
                              className="nds-form-element nds-m-bottom_large nds-p-around_small ng-pristine ng-scope ng-valid-validate-val-lookup ng-valid ng-valid-required"
                              autocomplete="false"
                            >
                              <div className="nds-form-element__control nds-lookup nds-input-has-icon nds-grid nds-form-element__control-animated-label">
                                <div className="nds-grid nds-cont-wrapper">
                                  <svg
                                    aria-hidden="true"
                                    className="nds-button__icon nds-m-right_xx-small slds-icon slds-icon--small nds-icon nds-icon_small "
                                    xmlns="http://www.w3.org/2000/svg"
                                    preserveAspectRatio="xMidYMid meet"
                                    sprite="'utility'"
                                    icon="'search'"
                                    size="'small'"
                                    viewBox="0 0 52 52"
                                    alt="search"
                                  >
                                    <title />
                                    <desc />
                                    <path
                                      d="m49.6 45.3l-13.4-13.3c2.7-3.8 4.1-8.6 3.4-13.7-1.2-8.6-8.2-15.4-16.9-16.2-11.8-1.2-21.8 8.8-20.6 20.7 0.8 8.6 7.6 15.7 16.2 16.9 5.1 0.7 9.9-0.7 13.7-3.4l13.3 13.3c0.6 0.6 1.5 0.6 2.1 0l2.1-2.1c0.6-0.6 0.6-1.6 0.1-2.2z m-41.6-24.4c0-7.1 5.8-12.9 12.9-12.9 7.1 0 12.9 5.8 12.9 12.9 0 7.1-5.8 12.9-12.9 12.9-7.1 0-12.9-5.7-12.9-12.9z"
                                      fill="inherit"
                                      xmlns="http://www.w3.org/2000/svg"
                                    />
                                  </svg>

                                  <input
                                    id="Lookup1"
                                    ng-disabled="control.ro"
                                    ng-required="control.req"
                                    ng-change="aggregate(this, control.index, control.indexInParent, true, -1)"
                                    ng-click="convertToObject(true);control.showSubList = true"
                                    name="loopname"
                                    type="text"
                                    className="nds-input ng-pristine ng-untouched ng-empty ng-valid-validate-val-lookup ng-valid ng-valid-required"
                                    ng-model="control.response"
                                    vlc-slds-lookup-control="test"
                                    ng-init="init(this, control)"
                                    vlc-disable-auto-complete="off"
                                    autocomplete="off"
                                    readonly="readonly"
                                    aria-invalid="false"
                                  />
                                  <label
                                    for="Lookup1"
                                    className="nds-form-element__label nds-p-left_large ng-binding"
                                  >
                                    Lookup1
                                  </label>
                                </div>

                                <div className="nds-control-action__container">
                                  <svg
                                    aria-hidden="true"
                                    className="slds-button__icon slds-button__icon--medium nds-button__icon nds-button__icon_medium "
                                    xmlns="http://www.w3.org/2000/svg"
                                    preserveAspectRatio="xMidYMid meet"
                                    sprite="'utility'"
                                    icon="'add'"
                                    size="'medium'"
                                    ng-disabled="control.propSetMap.repeatLimit !== undefined &amp;&amp; control.propSetMap.repeatLimit !== null &amp;&amp; child.eleArray.length >= control.propSetMap.repeatLimit+1"
                                    ng-click="baseCtrl.addItem(this, child, $index)"
                                    role="button"
                                    tabindex="0"
                                    aria-disabled="false"
                                    viewBox="0 0 52 52"
                                    alt="add"
                                  >
                                    <path
                                      fill="inherit"
                                      xmlns="http://www.w3.org/2000/svg"
                                      d="m30 29h16.5c0.8 0 1.5-0.7 1.5-1.5v-3c0-0.8-0.7-1.5-1.5-1.5h-16.5c-0.6 0-1-0.4-1-1v-16.5c0-0.8-0.7-1.5-1.5-1.5h-3c-0.8 0-1.5 0.7-1.5 1.5v16.5c0 0.6-0.4 1-1 1h-16.5c-0.8 0-1.5 0.7-1.5 1.5v3c0 0.8 0.7 1.5 1.5 1.5h16.5c0.6 0 1 0.4 1 1v16.5c0 0.8 0.7 1.5 1.5 1.5h3c0.8 0 1.5-0.7 1.5-1.5v-16.5c0-0.6 0.4-1 1-1z"
                                    />
                                  </svg>
                                </div>
                              </div>
                            </form>
                          </div>
                        </child>

                        <child
                          className="nds-medium-size_1-of-1 nds-small-size_1-of-1 nds-x-small-size_1-of-1 nds-large-size_12-of-12"
                          aria-hidden="false"
                        >
                          <div className="nds-size_1-of-1 ng-scope">
                            <form
                              name="loopform"
                              className="nds-form-element nds-m-bottom_large nds-p-around_small nds-input__tooltip ng-pristine ng-scope ng-valid-pattern ng-valid ng-valid-required ng-valid-email"
                            >
                              <div className="nds-form-element__control nds-form-element__control-animated-label nds-grid">
                                <input
                                  id="Email7"
                                  type="email"
                                  ng-disabled="control.ro"
                                  ng-required="control.req"
                                  className="nds-input form-control ng-pristine ng-untouched ng-valid-pattern ng-empty ng-valid ng-valid-required ng-valid-email"
                                  name="loopname"
                                  ng-init="init(this, control)"
                                  ng-model="control.response"
                                  ng-model-options="{ updateOn: 'default focusout blur', debounce: { 'default': control.propSetMap.debounceValue, 'focusout': 0, 'blur': 0 } }"
                                  ng-blur="aggregate(this, control.index, control.indexInParent, true, -1)"
                                  vlc-slds-ng-pattern="[a-z0-9._-]+@[a-z0-9._-]+\.[a-z]{2,4}"
                                  vlc-slds-val-checker="response"
                                  aria-invalid="false"
                                />

                                <label
                                  for="Email7"
                                  className="nds-form-element__label ng-binding"
                                >
                                  Email7
                                </label>

                                <div className="nds-control-action__container">
                                  <svg
                                    aria-hidden="true"
                                    className="slds-button__icon slds-button__icon--medium nds-button__icon nds-button__icon_medium "
                                    xmlns="http://www.w3.org/2000/svg"
                                    preserveAspectRatio="xMidYMid meet"
                                    sprite="'utility'"
                                    icon="'add'"
                                    size="'medium'"
                                    ng-disabled="control.propSetMap.repeatLimit !== undefined &amp;&amp; control.propSetMap.repeatLimit !== null &amp;&amp; child.eleArray.length >= control.propSetMap.repeatLimit+1"
                                    ng-click="baseCtrl.addItem(this, child, $index)"
                                    role="button"
                                    tabindex="0"
                                    aria-disabled="false"
                                    viewBox="0 0 52 52"
                                    alt="add"
                                  >
                                    <path
                                      fill="inherit"
                                      xmlns="http://www.w3.org/2000/svg"
                                      d="m30 29h16.5c0.8 0 1.5-0.7 1.5-1.5v-3c0-0.8-0.7-1.5-1.5-1.5h-16.5c-0.6 0-1-0.4-1-1v-16.5c0-0.8-0.7-1.5-1.5-1.5h-3c-0.8 0-1.5 0.7-1.5 1.5v16.5c0 0.6-0.4 1-1 1h-16.5c-0.8 0-1.5 0.7-1.5 1.5v3c0 0.8 0.7 1.5 1.5 1.5h16.5c0.6 0 1 0.4 1 1v16.5c0 0.8 0.7 1.5 1.5 1.5h3c0.8 0 1.5-0.7 1.5-1.5v-16.5c0-0.6 0.4-1 1-1z"
                                    />
                                  </svg>
                                </div>
                              </div>
                            </form>
                          </div>
                        </child>

                        <child
                          className="nds-medium-size_1-of-1 nds-small-size_1-of-1 nds-x-small-size_1-of-1 nds-large-size_12-of-12"
                          aria-hidden="false"
                        >
                          <div className="nds-size_1-of-1 ng-scope">
                            <form
                              name="loopform"
                              className="nds-form-element nds-m-bottom_large nds-p-around_small nds-input__tooltip ng-pristine ng-scope ng-valid ng-valid-required"
                            >
                              <div className="nds-grid nds-form--multi-input__container">
                                <div className="nds-form-element__control nds-form-element__control-animated-label nds-size_2-of-3 nds-p-right_small">
                                  <input
                                    id="Date/Time5"
                                    name="loopname"
                                    ng-disabled="control.ro"
                                    ng-required="control.req"
                                    type="text"
                                    placement="none"
                                    ng-change="aggregate(this, control.index, control.indexInParent, true, -1)"
                                    className="nds-input ng-pristine ng-untouched ng-empty ng-valid ng-valid-required"
                                    ng-model="control.response"
                                    ng-init="init(this, control)"
                                    data-date-format="MM-dd-yyyy"
                                    data-max-date=""
                                    data-min-date=""
                                    timezone="-60"
                                    slds-date-picker=""
                                    vlc-slds-val-checker="response"
                                    aria-invalid="false"
                                  />

                                  <label
                                    for="Date/Time5"
                                    className="nds-form-element__label ng-binding"
                                  >
                                    Date/Time5
                                  </label>
                                </div>
                                <div
                                  className="nds-form-element__control nds-form-element__control-animated-label"
                                  style={{ width: '100%' }}
                                >
                                  <input
                                    type="text"
                                    placement="none"
                                    ng-disabled="control.ro"
                                    ng-required="control.req"
                                    ng-change="aggregate(this, control.index, control.indexInParent, true, -1)"
                                    className="nds-input ng-pristine ng-untouched ng-empty ng-valid ng-valid-required"
                                    ng-model="control.response"
                                    name="timectrl"
                                    ng-init="init(this, control)"
                                    data-time-format="hh:mm a"
                                    timezone="-60"
                                    slds-time-picker=""
                                    data-default-date="today"
                                    vlc-slds-val-checker="reponse"
                                    autocomplete="off"
                                    aria-invalid="false"
                                  />
                                </div>
                                <div className="nds-control-action__container">
                                  <svg
                                    aria-hidden="true"
                                    className="slds-button__icon slds-button__icon--medium nds-button__icon nds-button__icon_medium "
                                    xmlns="http://www.w3.org/2000/svg"
                                    preserveAspectRatio="xMidYMid meet"
                                    sprite="'utility'"
                                    icon="'add'"
                                    size="'medium'"
                                    ng-disabled="control.propSetMap.repeatLimit !== undefined &amp;&amp; control.propSetMap.repeatLimit !== null &amp;&amp; child.eleArray.length >= control.propSetMap.repeatLimit+1"
                                    ng-click="baseCtrl.addItem(this, child, $index)"
                                    role="button"
                                    tabindex="0"
                                    aria-disabled="false"
                                    viewBox="0 0 52 52"
                                    alt="add"
                                  >
                                    <path
                                      fill="inherit"
                                      xmlns="http://www.w3.org/2000/svg"
                                      d="m30 29h16.5c0.8 0 1.5-0.7 1.5-1.5v-3c0-0.8-0.7-1.5-1.5-1.5h-16.5c-0.6 0-1-0.4-1-1v-16.5c0-0.8-0.7-1.5-1.5-1.5h-3c-0.8 0-1.5 0.7-1.5 1.5v16.5c0 0.6-0.4 1-1 1h-16.5c-0.8 0-1.5 0.7-1.5 1.5v3c0 0.8 0.7 1.5 1.5 1.5h16.5c0.6 0 1 0.4 1 1v16.5c0 0.8 0.7 1.5 1.5 1.5h3c0.8 0 1.5-0.7 1.5-1.5v-16.5c0-0.6 0.4-1 1-1z"
                                    />
                                  </svg>
                                </div>
                              </div>
                            </form>
                          </div>
                        </child>

                        <child
                          className="nds-medium-size_1-of-1 nds-small-size_1-of-1 nds-x-small-size_1-of-1 nds-large-size_12-of-12"
                          aria-hidden="false"
                        >
                          <div className="nds-size_1-of-1 ng-scope">
                            <form
                              name="loopform"
                              className="nds-form-element nds-m-bottom_large nds-p-around_small ng-valid ng-scope ng-valid-required ng-dirty"
                              id="Multi-select13|0"
                              ng-required="control.req"
                              aria-required="false"
                            >
                              <fieldset className="nds-form-element">
                                <legend
                                  className="nds-form-element__legend nds-form-element__label"
                                  for="Multi-select13|0"
                                >
                                  <span className="ng-binding">
                                    Multi-select13
                                  </span>

                                  <div
                                    className="nds-tooltip_container ng-scope"
                                    ng-include="'vlcNewportTooltip.html'"
                                  >
                                    <div className="nds-nonfocused_control ng-scope">
                                      <svg
                                        aria-hidden="true"
                                        className="slds-icon slds-icon--small nds-icon nds-icon_small "
                                        xmlns="http://www.w3.org/2000/svg"
                                        preserveAspectRatio="xMidYMid meet"
                                        sprite="'utility'"
                                        icon="'info'"
                                        size="'small'"
                                        viewBox="0 0 52 52"
                                        alt="info"
                                      >
                                        <path
                                          fill="inherit"
                                          xmlns="http://www.w3.org/2000/svg"
                                          d="m26 2c-13.3 0-24 10.7-24 24s10.7 24 24 24 24-10.7 24-24-10.7-24-24-24z m0 12.1c1.7 0 3 1.3 3 3s-1.3 3-3 3-3-1.3-3-3 1.3-3 3-3z m5 21c0 0.5-0.4 0.9-1 0.9h-8c-0.5 0-1-0.3-1-0.9v-2c0-0.5 0.4-1.1 1-1.1 0.5 0 1-0.3 1-0.9v-4c0-0.5-0.4-1.1-1-1.1-0.5 0-1-0.3-1-0.9v-2c0-0.5 0.4-1.1 1-1.1h6c0.5 0 1 0.5 1 1.1v8c0 0.5 0.4 0.9 1 0.9 0.5 0 1 0.5 1 1.1v2z"
                                        />
                                      </svg>

                                      <div className="nds-is-absolute">
                                        <div
                                          className="nds-popover nds-popover_tooltip nds-nubbin_bottom"
                                          role="tooltip"
                                        >
                                          <div className="nds-popover__body ng-binding">
                                            Pick Multi-Select
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="nds-control-action__container">
                                    <svg
                                      aria-hidden="true"
                                      className="slds-button__icon slds-button__icon--medium nds-button__icon nds-button__icon_medium "
                                      xmlns="http://www.w3.org/2000/svg"
                                      preserveAspectRatio="xMidYMid meet"
                                      sprite="'utility'"
                                      icon="'add'"
                                      size="'medium'"
                                      ng-disabled="control.propSetMap.repeatLimit !== undefined &amp;&amp; control.propSetMap.repeatLimit !== null &amp;&amp; child.eleArray.length >= control.propSetMap.repeatLimit+1"
                                      ng-click="baseCtrl.addItem(this, child, $index)"
                                      role="button"
                                      tabindex="0"
                                      aria-disabled="false"
                                      viewBox="0 0 52 52"
                                      alt="add"
                                    >
                                      <path
                                        fill="inherit"
                                        xmlns="http://www.w3.org/2000/svg"
                                        d="m30 29h16.5c0.8 0 1.5-0.7 1.5-1.5v-3c0-0.8-0.7-1.5-1.5-1.5h-16.5c-0.6 0-1-0.4-1-1v-16.5c0-0.8-0.7-1.5-1.5-1.5h-3c-0.8 0-1.5 0.7-1.5 1.5v16.5c0 0.6-0.4 1-1 1h-16.5c-0.8 0-1.5 0.7-1.5 1.5v3c0 0.8 0.7 1.5 1.5 1.5h16.5c0.6 0 1 0.4 1 1v16.5c0 0.8 0.7 1.5 1.5 1.5h3c0.8 0 1.5-0.7 1.5-1.5v-16.5c0-0.6 0.4-1 1-1z"
                                      />
                                    </svg>
                                  </div>
                                </legend>

                                <div className="nds-form-element__control">
                                  <div
                                    className="nds-checkbox_custom-group nds-clearfix ng-scope"
                                    ng-init="init(this, control)"
                                  >
                                    <label
                                      className="nds-button nds-checkbox_button nds-checkbox_aspect-ratio ng-scope"
                                      style={{
                                        width: 'calc(33.3333% - 1.25rem)',
                                        paddingTop: 'calc(33.3333% - 1.25rem)',
                                        marginBottom: '1rem'
                                      }}
                                    >
                                      <input
                                        id="Multi-select13"
                                        ng-disabled="control.ro"
                                        type="checkbox"
                                        ng-model="option.selected"
                                        vlc-slds-mu-val-checker="response"
                                        ng-change="onMultiSelect(this, control, option)"
                                        className="ng-valid ng-touched ng-dirty ng-empty"
                                        aria-invalid="false"
                                      />

                                      <span className="nds-checkbox_button__label ng-scope">
                                        <span className="nds-checkbox_custom-faux nds-title ng-binding">
                                          Hi
                                        </span>
                                      </span>
                                    </label>

                                    <label
                                      className="nds-button nds-checkbox_button nds-checkbox_aspect-ratio ng-scope"
                                      style={{
                                        width: 'calc(33.3333% - 1.25rem)',
                                        paddingTop: 'calc(33.3333% - 1.25rem)',
                                        marginBottom: '1rem'
                                      }}
                                    >
                                      <input
                                        id="Multi-select13"
                                        ng-disabled="control.ro"
                                        type="checkbox"
                                        ng-model="option.selected"
                                        vlc-slds-mu-val-checker="response"
                                        ng-change="onMultiSelect(this, control, option)"
                                        className="ng-valid ng-touched ng-dirty ng-empty"
                                        aria-invalid="false"
                                      />

                                      <span className="nds-checkbox_button__label ng-scope">
                                        <span className="nds-checkbox_custom-faux nds-title ng-binding">
                                          Hello
                                        </span>
                                      </span>
                                    </label>
                                  </div>
                                </div>
                              </fieldset>
                              <div className="nds-has-error nds-grid">
                                <div aria-hidden="false" />
                              </div>
                            </form>
                          </div>
                        </child>

                        <child
                          className="nds-medium-size_1-of-1 nds-small-size_1-of-1 nds-x-small-size_1-of-1 nds-large-size_12-of-12"
                          aria-hidden="false"
                        >
                          <div className="nds-size_1-of-1 ng-scope">
                            <form
                              name="loopform"
                              className="nds-form-element nds-m-bottom_large nds-p-around_small ng-pristine ng-scope ng-valid ng-valid-required"
                            >
                              <div className="nds-grid nds-form--multi-input__container">
                                <div className="nds-cont-wrapper nds-form-element__control nds-form-element__control-animated-label">
                                  <input
                                    id="Date6"
                                    name="loopname"
                                    ng-disabled="control.ro"
                                    ng-required="control.req"
                                    type="text"
                                    placement="none"
                                    ng-change="aggregate(this, control.index, control.indexInParent, true, -1)"
                                    className="nds-input ng-pristine ng-untouched ng-empty ng-valid ng-valid-required"
                                    ng-model="control.response"
                                    ng-init="init(this, control)"
                                    data-date-format="MM-dd-yyyy"
                                    data-max-date=""
                                    data-min-date=""
                                    date-type="string"
                                    model-date-format="yyyy-MM-dd"
                                    slds-date-picker=""
                                    vlc-slds-val-checker="response"
                                    aria-invalid="false"
                                  />

                                  <label
                                    for="Date6"
                                    className="nds-form-element__label ng-binding"
                                  >
                                    Date6
                                  </label>
                                </div>

                                <div className="nds-control-action__container">
                                  <svg
                                    aria-hidden="true"
                                    className="slds-button__icon slds-button__icon--medium nds-button__icon nds-button__icon_medium "
                                    xmlns="http://www.w3.org/2000/svg"
                                    preserveAspectRatio="xMidYMid meet"
                                    sprite="'utility'"
                                    icon="'add'"
                                    size="'medium'"
                                    ng-disabled="control.propSetMap.repeatLimit !== undefined &amp;&amp; control.propSetMap.repeatLimit !== null &amp;&amp; child.eleArray.length >= control.propSetMap.repeatLimit+1"
                                    ng-click="baseCtrl.addItem(this, child, $index)"
                                    role="button"
                                    tabindex="0"
                                    aria-disabled="false"
                                    viewBox="0 0 52 52"
                                    alt="add"
                                  >
                                    <path
                                      fill="inherit"
                                      xmlns="http://www.w3.org/2000/svg"
                                      d="m30 29h16.5c0.8 0 1.5-0.7 1.5-1.5v-3c0-0.8-0.7-1.5-1.5-1.5h-16.5c-0.6 0-1-0.4-1-1v-16.5c0-0.8-0.7-1.5-1.5-1.5h-3c-0.8 0-1.5 0.7-1.5 1.5v16.5c0 0.6-0.4 1-1 1h-16.5c-0.8 0-1.5 0.7-1.5 1.5v3c0 0.8 0.7 1.5 1.5 1.5h16.5c0.6 0 1 0.4 1 1v16.5c0 0.8 0.7 1.5 1.5 1.5h3c0.8 0 1.5-0.7 1.5-1.5v-16.5c0-0.6 0.4-1 1-1z"
                                    />
                                  </svg>
                                </div>
                              </div>
                            </form>
                          </div>
                        </child>

                        <child
                          className="nds-medium-size_1-of-1 nds-small-size_1-of-1 nds-x-small-size_1-of-1 nds-large-size_6-of-12"
                          aria-hidden="false"
                        >
                          <div className="nds-size_1-of-1 ng-scope">
                            <form
                              name="loopform"
                              className="nds-form-element nds-m-bottom_large nds-p-around_small ng-scope ng-valid ng-valid-required ng-dirty"
                            >
                              <div className="nds-grid nds-form--multi-input__container">
                                <div className="nds-cont-wrapper nds-form-element__control nds-form-element__control-animated-label">
                                  <input
                                    id="Date1"
                                    name="loopname"
                                    ng-disabled="control.ro"
                                    ng-required="control.req"
                                    type="text"
                                    placement="none"
                                    ng-change="aggregate(this, control.index, control.indexInParent, true, -1)"
                                    className="nds-input ng-valid ng-valid-required ng-touched ng-dirty ng-not-empty"
                                    ng-model="control.response"
                                    ng-init="init(this, control)"
                                    data-date-format="MM-dd-yyyy"
                                    data-max-date=""
                                    data-min-date=""
                                    date-type="string"
                                    model-date-format="yyyy-MM-dd"
                                    slds-date-picker=""
                                    vlc-slds-val-checker="response"
                                    aria-invalid="false"
                                  />

                                  <label
                                    for="Date1"
                                    className="nds-form-element__label ng-binding"
                                  >
                                    Date1
                                  </label>
                                </div>

                                <div
                                  className="nds-tooltip_container ng-scope"
                                  ng-include="'vlcNewportTooltip.html'"
                                >
                                  <div className="nds-nonfocused_control ng-scope">
                                    <svg
                                      aria-hidden="true"
                                      className="slds-icon slds-icon--small nds-icon nds-icon_small "
                                      xmlns="http://www.w3.org/2000/svg"
                                      preserveAspectRatio="xMidYMid meet"
                                      sprite="'utility'"
                                      icon="'info'"
                                      size="'small'"
                                      viewBox="0 0 52 52"
                                      alt="info"
                                    >
                                      <path
                                        fill="inherit"
                                        xmlns="http://www.w3.org/2000/svg"
                                        d="m26 2c-13.3 0-24 10.7-24 24s10.7 24 24 24 24-10.7 24-24-10.7-24-24-24z m0 12.1c1.7 0 3 1.3 3 3s-1.3 3-3 3-3-1.3-3-3 1.3-3 3-3z m5 21c0 0.5-0.4 0.9-1 0.9h-8c-0.5 0-1-0.3-1-0.9v-2c0-0.5 0.4-1.1 1-1.1 0.5 0 1-0.3 1-0.9v-4c0-0.5-0.4-1.1-1-1.1-0.5 0-1-0.3-1-0.9v-2c0-0.5 0.4-1.1 1-1.1h6c0.5 0 1 0.5 1 1.1v8c0 0.5 0.4 0.9 1 0.9 0.5 0 1 0.5 1 1.1v2z"
                                      />
                                    </svg>

                                    <div className="nds-is-absolute">
                                      <div
                                        className="nds-popover nds-popover_tooltip nds-nubbin_bottom"
                                        role="tooltip"
                                      >
                                        <div className="nds-popover__body ng-binding">
                                          Pick a Date
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="nds-control-action__container">
                                  <svg
                                    aria-hidden="true"
                                    className="slds-button__icon slds-button__icon--medium nds-button__icon nds-button__icon_medium "
                                    xmlns="http://www.w3.org/2000/svg"
                                    preserveAspectRatio="xMidYMid meet"
                                    sprite="'utility'"
                                    icon="'add'"
                                    size="'medium'"
                                    ng-disabled="control.propSetMap.repeatLimit !== undefined &amp;&amp; control.propSetMap.repeatLimit !== null &amp;&amp; child.eleArray.length >= control.propSetMap.repeatLimit+1"
                                    ng-click="baseCtrl.addItem(this, child, $index)"
                                    role="button"
                                    tabindex="0"
                                    aria-disabled="false"
                                    viewBox="0 0 52 52"
                                    alt="add"
                                  >
                                    <path
                                      fill="inherit"
                                      xmlns="http://www.w3.org/2000/svg"
                                      d="m30 29h16.5c0.8 0 1.5-0.7 1.5-1.5v-3c0-0.8-0.7-1.5-1.5-1.5h-16.5c-0.6 0-1-0.4-1-1v-16.5c0-0.8-0.7-1.5-1.5-1.5h-3c-0.8 0-1.5 0.7-1.5 1.5v16.5c0 0.6-0.4 1-1 1h-16.5c-0.8 0-1.5 0.7-1.5 1.5v3c0 0.8 0.7 1.5 1.5 1.5h16.5c0.6 0 1 0.4 1 1v16.5c0 0.8 0.7 1.5 1.5 1.5h3c0.8 0 1.5-0.7 1.5-1.5v-16.5c0-0.6 0.4-1 1-1z"
                                    />
                                  </svg>
                                </div>
                              </div>
                            </form>
                          </div>
                        </child>
                        <child
                          className="nds-medium-size_1-of-1 nds-small-size_1-of-1 nds-x-small-size_1-of-1 nds-large-size_12-of-12"
                          aria-hidden="false"
                        >
                          <div className="nds-size_1-of-1 ng-scope">
                            <form
                              name="loopform"
                              className="nds-form-element nds-m-bottom_large nds-p-around_small ng-valid ng-scope ng-dirty"
                            >
                              <div className="nds-form-element__control">
                                <label className="nds-checkbox">
                                  <input
                                    id="Checkbox1"
                                    type="checkbox"
                                    name="loopname"
                                    ng-disabled="control.ro"
                                    ng-model="control.response"
                                    ng-init="init(this, control)"
                                    vlc-slds-check-val-checker="response"
                                    ng-change="aggregate(this, control.index, control.indexInParent, true, -1)"
                                    className="ng-valid ng-touched ng-dirty ng-not-empty"
                                    aria-invalid="false"
                                  />

                                  <span className="nds-checkbox_faux" />

                                  <label
                                    className="nds-checkbox__label"
                                    vlc-bubble-canceller="test"
                                  >
                                    <span className="nds-form-element__label nds-form-element__control-help ng-binding">
                                      Checkbox1
                                    </span>

                                    <div
                                      className="nds-tooltip_container ng-scope"
                                      ng-include="'vlcNewportTooltip.html'"
                                    >
                                      <div className="nds-nonfocused_control ng-scope">
                                        <svg
                                          aria-hidden="true"
                                          className="slds-icon slds-icon--small nds-icon nds-icon_small "
                                          xmlns="http://www.w3.org/2000/svg"
                                          preserveAspectRatio="xMidYMid meet"
                                          sprite="'utility'"
                                          icon="'info'"
                                          size="'small'"
                                          viewBox="0 0 52 52"
                                          alt="info"
                                        >
                                          <path
                                            fill="inherit"
                                            xmlns="http://www.w3.org/2000/svg"
                                            d="m26 2c-13.3 0-24 10.7-24 24s10.7 24 24 24 24-10.7 24-24-10.7-24-24-24z m0 12.1c1.7 0 3 1.3 3 3s-1.3 3-3 3-3-1.3-3-3 1.3-3 3-3z m5 21c0 0.5-0.4 0.9-1 0.9h-8c-0.5 0-1-0.3-1-0.9v-2c0-0.5 0.4-1.1 1-1.1 0.5 0 1-0.3 1-0.9v-4c0-0.5-0.4-1.1-1-1.1-0.5 0-1-0.3-1-0.9v-2c0-0.5 0.4-1.1 1-1.1h6c0.5 0 1 0.5 1 1.1v8c0 0.5 0.4 0.9 1 0.9 0.5 0 1 0.5 1 1.1v2z"
                                          />
                                        </svg>

                                        <div className="nds-is-absolute">
                                          <div
                                            className="nds-popover nds-popover_tooltip nds-nubbin_bottom"
                                            role="tooltip"
                                          >
                                            <div className="nds-popover__body ng-binding">
                                              Check It out
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="nds-control-action__container">
                                      <svg
                                        aria-hidden="true"
                                        className="slds-button__icon slds-button__icon--medium nds-button__icon nds-button__icon_medium "
                                        xmlns="http://www.w3.org/2000/svg"
                                        preserveAspectRatio="xMidYMid meet"
                                        sprite="'utility'"
                                        icon="'add'"
                                        size="'medium'"
                                        ng-disabled="control.propSetMap.repeatLimit !== undefined &amp;&amp; control.propSetMap.repeatLimit !== null &amp;&amp; child.eleArray.length >= control.propSetMap.repeatLimit+1"
                                        ng-click="baseCtrl.addItem(this, child, $index)"
                                        role="button"
                                        tabindex="0"
                                        aria-disabled="false"
                                        viewBox="0 0 52 52"
                                        alt="add"
                                      >
                                        <path
                                          fill="inherit"
                                          xmlns="http://www.w3.org/2000/svg"
                                          d="m30 29h16.5c0.8 0 1.5-0.7 1.5-1.5v-3c0-0.8-0.7-1.5-1.5-1.5h-16.5c-0.6 0-1-0.4-1-1v-16.5c0-0.8-0.7-1.5-1.5-1.5h-3c-0.8 0-1.5 0.7-1.5 1.5v16.5c0 0.6-0.4 1-1 1h-16.5c-0.8 0-1.5 0.7-1.5 1.5v3c0 0.8 0.7 1.5 1.5 1.5h16.5c0.6 0 1 0.4 1 1v16.5c0 0.8 0.7 1.5 1.5 1.5h3c0.8 0 1.5-0.7 1.5-1.5v-16.5c0-0.6 0.4-1 1-1z"
                                        />
                                      </svg>
                                    </div>
                                  </label>
                                </label>
                              </div>
                            </form>
                          </div>
                        </child>

                        <child
                          className="nds-medium-size_1-of-1 nds-small-size_1-of-1 nds-x-small-size_1-of-1 nds-large-size_12-of-12"
                          aria-hidden="false"
                        >
                          <div className="nds-size_1-of-1 ng-scope">
                            <form
                              name="loopform"
                              className="nds-form-element nds-size_1-of-1 nds-m-bottom_large nds-p-around_small ng-pristine ng-valid ng-scope ng-valid-min-int ng-valid-max-int"
                            >
                              <div className="nds-form-element__control nds-form-element__control-animated-label nds-input-has-icon_right nds-grid">
                                <span className="nds-form-element__addon ng-binding ng-scope">
                                  ¥
                                </span>

                                <input
                                  id="Aggregate1"
                                  type="text"
                                  name="loopname"
                                  ng-model="control.response"
                                  className="nds-input ng-pristine ng-untouched ng-valid ng-scope ng-valid-min-int ng-valid-max-int ng-not-empty"
                                  via-mask="::control.propSetMap.mask"
                                  vlc-slds-readonly="test"
                                  autocomplete="off"
                                  readonly="readonly"
                                  disabled="disabled"
                                  cloned="dirty"
                                  aria-invalid="false"
                                />

                                <label
                                  for="Aggregate1"
                                  className="nds-form-element__label ng-binding nds-p-left_large"
                                >
                                  Aggregate1
                                </label>

                                <div className="nds-control-action__container" />
                              </div>
                            </form>
                          </div>
                        </child>

                        <child
                          className="nds-medium-size_1-of-1 nds-small-size_1-of-1 nds-x-small-size_1-of-1 nds-large-size_12-of-12"
                          aria-hidden="false"
                        >
                          <div className="nds-size_1-of-1 ng-scope">
                            <form
                              name="loopform"
                              className="nds-form-element nds-size_1-of-1 nds-m-bottom_large nds-p-around_small ng-pristine ng-valid ng-scope ng-valid-min-int ng-valid-max-int"
                            >
                              <div className="nds-form-element__control nds-form-element__control-animated-label nds-input-has-icon_right nds-grid">
                                <span className="nds-form-element__addon ng-binding ng-scope">
                                  ¥
                                </span>

                                <input
                                  id="Formula1"
                                  type="text"
                                  name="loopname"
                                  ng-model="control.response"
                                  className="nds-input ng-pristine ng-untouched ng-valid ng-scope ng-valid-min-int ng-valid-max-int ng-not-empty"
                                  via-mask="::control.propSetMap.mask"
                                  vlc-slds-readonly="test"
                                  autocomplete="off"
                                  readonly="readonly"
                                  disabled="disabled"
                                  cloned="dirty"
                                  aria-invalid="false"
                                />

                                <label
                                  for="Formula1"
                                  className="nds-form-element__label ng-binding nds-p-left_large"
                                >
                                  Formula1
                                </label>

                                <div className="nds-control-action__container" />
                              </div>
                            </form>
                          </div>
                        </child>

                        <child
                          className="nds-medium-size_1-of-1 nds-small-size_1-of-1 nds-x-small-size_1-of-1 nds-large-size_12-of-12"
                          aria-hidden="false"
                        >
                          <div className="nds-size_1-of-1 ng-scope">
                            <form
                              name="loopform"
                              className="nds-form-element nds-size_1-of-1 nds-m-bottom_large nds-p-around_small nds-input__tooltip ng-pristine ng-scope ng-valid-min ng-valid-max ng-valid ng-valid-required"
                            >
                              <div
                                className="nds-form-element__control nds-form-element__control-animated-label nds-input-has-icon nds-input-has-icon_right nds-grid"
                                data-content=""
                              >
                                <span className="nds-form-element__addon ng-binding">
                                  ¥
                                </span>

                                <div className="nds-cont-wrapper">
                                  <input
                                    id="Currency7"
                                    type="tel"
                                    ng-blur="aggregate(this, control.index, control.indexInParent, true, -1)"
                                    ng-disabled="control.ro"
                                    ng-required="control.req"
                                    ui-number-mask="::control.propSetMap.mask"
                                    ui-negative-number="false"
                                    ui-hide-group-sep="false"
                                    min="::control.propSetMap.min"
                                    max="::control.propSetMap.max"
                                    name="loopname"
                                    ng-model="control.response"
                                    ng-model-options="{ updateOn: 'default focusout blur', debounce: { 'default': control.propSetMap.debounceValue, 'focusout': 0, 'blur': 0 } }"
                                    className="nds-input ng-pristine ng-untouched ng-valid-min ng-valid-max ng-empty ng-valid ng-valid-required"
                                    ng-init="init(this, control)"
                                    vlc-slds-val-check-currency="response"
                                    vlc-slds-val-checker="response"
                                    aria-invalid="false"
                                  />

                                  <label
                                    for="Currency7"
                                    className="nds-form-element__label ng-binding"
                                  >
                                    Currency7
                                  </label>
                                </div>

                                <svg
                                  aria-hidden="true"
                                  className="slds-icon slds-icon--small nds-icon nds-icon_small "
                                  xmlns="http://www.w3.org/2000/svg"
                                  preserveAspectRatio="xMidYMid meet"
                                  sprite="'utility'"
                                  icon="'moneybag'"
                                  size="'small'"
                                  viewBox="0 0 52 52"
                                  alt="moneybag"
                                >
                                  <path
                                    fill="inherit"
                                    xmlns="http://www.w3.org/2000/svg"
                                    d="m20.5 9.1c0.2 0.6 0.8 0.9 1.4 0.9h8.1c0.6 0 1.2-0.3 1.4-0.9l3.2-5.9c0.2-0.6-0.2-1.2-0.8-1.2h-15.6c-0.6 0-1 0.6-0.7 1.1l3 6z m10.2 5.6h-9.4c-7.9 0-14.3 6.5-14.3 14.5v16c0 2.6 2.1 4.8 4.8 4.8h28.4c2.6 0 4.8-2.2 4.8-4.8v-16c0-8-6.5-14.5-14.3-14.5z m-2.3 27v2.7c0 0.5-0.5 0.8-1 0.8h-3.2c-0.5 0-0.6-0.3-0.6-0.8v-2.6c-2.4-0.5-4.4-1.5-4.9-2-0.6-0.6-0.8-1.1-0.3-1.8l1-1.6c0.2-0.4 0.7-0.6 1.2-0.6 0.3 0 0.6 0.1 0.8 0.2h0.1c1.6 1 3 1.4 4 1.4 1.1 0 2-0.6 2-1.2 0-0.5-0.3-1.3-3.3-2.3-2.7-1-6-2.6-6-6.3 0-2.2 1.4-4.7 5.4-5.5v-2.4c0-0.5 0.2-0.8 0.6-0.8h3.2c0.5 0 1 0.3 1 0.8v2.3c1.6 0.4 3.3 1.2 3.9 1.6 0.3 0.2 0.5 0.6 0.6 1 0.1 0.4-0.1 0.8-0.3 1l-1.4 1.4c-0.3 0.4-0.9 0.7-1.3 0.7-0.2 0-0.5-0.1-0.7-0.2-1.6-0.9-2.9-1.4-3.8-1.4-1.3 0-1.9 0.6-1.9 1 0 0.6 0.3 1.2 3 2.2 3.3 1.1 7 2.9 7 6.7 0.1 2.6-2 4.9-5.1 5.7z"
                                  />
                                </svg>
                                <div className="nds-control-action__container">
                                  <svg
                                    aria-hidden="true"
                                    className="slds-button__icon slds-button__icon--medium nds-button__icon nds-button__icon_medium "
                                    xmlns="http://www.w3.org/2000/svg"
                                    preserveAspectRatio="xMidYMid meet"
                                    sprite="'utility'"
                                    icon="'add'"
                                    size="'medium'"
                                    ng-disabled="control.propSetMap.repeatLimit !== undefined &amp;&amp; control.propSetMap.repeatLimit !== null &amp;&amp; child.eleArray.length >= control.propSetMap.repeatLimit+1"
                                    ng-click="baseCtrl.addItem(this, child, $index)"
                                    role="button"
                                    tabindex="0"
                                    aria-disabled="false"
                                    viewBox="0 0 52 52"
                                    alt="add"
                                  >
                                    <path
                                      fill="inherit"
                                      xmlns="http://www.w3.org/2000/svg"
                                      d="m30 29h16.5c0.8 0 1.5-0.7 1.5-1.5v-3c0-0.8-0.7-1.5-1.5-1.5h-16.5c-0.6 0-1-0.4-1-1v-16.5c0-0.8-0.7-1.5-1.5-1.5h-3c-0.8 0-1.5 0.7-1.5 1.5v16.5c0 0.6-0.4 1-1 1h-16.5c-0.8 0-1.5 0.7-1.5 1.5v3c0 0.8 0.7 1.5 1.5 1.5h16.5c0.6 0 1 0.4 1 1v16.5c0 0.8 0.7 1.5 1.5 1.5h3c0.8 0 1.5-0.7 1.5-1.5v-16.5c0-0.6 0.4-1 1-1z"
                                    />
                                  </svg>
                                </div>
                              </div>
                            </form>
                          </div>
                        </child>

                        <child
                          className="nds-medium-size_1-of-1 nds-small-size_1-of-1 nds-x-small-size_1-of-1 nds-large-size_12-of-12"
                          aria-hidden="false"
                        >
                          <div className="nds-size_1-of-1 ng-scope">
                            <form
                              name="loopform"
                              className="nds-form-element nds-size_1-of-1 nds-m-bottom_large nds-p-around_small nds-rich-text-editor__output ng-pristine ng-valid ng-scope"
                              id="Headline1"
                            >
                              <div className="nds-form-element__control">
                                <h1
                                  ng-bind-html="control.propSetMap.value"
                                  className="ng-binding ng-scope"
                                >
                                  <p>Headline1 : </p>
                                </h1>
                              </div>
                            </form>
                          </div>
                        </child>

                        <child
                          className="nds-medium-size_1-of-1 nds-small-size_1-of-1 nds-x-small-size_1-of-1 nds-large-size_12-of-12"
                          aria-hidden="false"
                        >
                          <div className="nds-size_1-of-1 ng-scope">
                            <form
                              name="loopform"
                              className="nds-form-element nds-size_1-of-1 nds-m-bottom_large nds-p-around_small nds-rich-text-editor__output ng-pristine ng-valid ng-scope"
                              id="TextBlock1"
                            >
                              <div className="nds-form-element__control">
                                <p
                                  vlc-bind-html="::control.propSetMap.value"
                                  className="ng-binding"
                                >
                                  <p>TextBlock : </p>
                                </p>
                              </div>
                            </form>
                          </div>
                        </child>

                        <child
                          className="nds-medium-size_1-of-1 nds-small-size_1-of-1 nds-x-small-size_1-of-1 nds-large-size_12-of-12"
                          aria-hidden="false"
                        >
                          <div className="nds-size_1-of-1 ng-scope">
                            <form
                              name="loopform"
                              className="nds-form-element nds-size_1-of-1 nds-m-bottom_large nds-p-around_small nds-input__tooltip ng-pristine ng-scope ng-valid-min ng-valid-max ng-valid ng-valid-required"
                            >
                              <div
                                className="nds-form-element__control nds-form-element__control-animated-label nds-input-has-icon nds-input-has-icon_right nds-grid"
                                data-content=""
                              >
                                <span className="nds-form-element__addon ng-binding">
                                  ¥
                                </span>

                                <div className="nds-cont-wrapper">
                                  <input
                                    id="Currency8"
                                    type="tel"
                                    ng-blur="aggregate(this, control.index, control.indexInParent, true, -1)"
                                    ng-disabled="control.ro"
                                    ng-required="control.req"
                                    ui-number-mask="::control.propSetMap.mask"
                                    ui-negative-number="false"
                                    ui-hide-group-sep="false"
                                    min="::control.propSetMap.min"
                                    max="::control.propSetMap.max"
                                    name="loopname"
                                    ng-model="control.response"
                                    ng-model-options="{ updateOn: 'default focusout blur', debounce: { 'default': control.propSetMap.debounceValue, 'focusout': 0, 'blur': 0 } }"
                                    className="nds-input ng-pristine ng-untouched ng-valid-min ng-valid-max ng-empty ng-valid ng-valid-required"
                                    ng-init="init(this, control)"
                                    vlc-slds-val-check-currency="response"
                                    vlc-slds-val-checker="response"
                                    aria-invalid="false"
                                  />

                                  <label
                                    for="Currency8"
                                    className="nds-form-element__label ng-binding"
                                  >
                                    Currency8
                                  </label>
                                </div>

                                <svg
                                  aria-hidden="true"
                                  className="slds-icon slds-icon--small nds-icon nds-icon_small "
                                  xmlns="http://www.w3.org/2000/svg"
                                  preserveAspectRatio="xMidYMid meet"
                                  sprite="'utility'"
                                  icon="'moneybag'"
                                  size="'small'"
                                  viewBox="0 0 52 52"
                                  alt="moneybag"
                                >
                                  <path
                                    fill="inherit"
                                    xmlns="http://www.w3.org/2000/svg"
                                    d="m20.5 9.1c0.2 0.6 0.8 0.9 1.4 0.9h8.1c0.6 0 1.2-0.3 1.4-0.9l3.2-5.9c0.2-0.6-0.2-1.2-0.8-1.2h-15.6c-0.6 0-1 0.6-0.7 1.1l3 6z m10.2 5.6h-9.4c-7.9 0-14.3 6.5-14.3 14.5v16c0 2.6 2.1 4.8 4.8 4.8h28.4c2.6 0 4.8-2.2 4.8-4.8v-16c0-8-6.5-14.5-14.3-14.5z m-2.3 27v2.7c0 0.5-0.5 0.8-1 0.8h-3.2c-0.5 0-0.6-0.3-0.6-0.8v-2.6c-2.4-0.5-4.4-1.5-4.9-2-0.6-0.6-0.8-1.1-0.3-1.8l1-1.6c0.2-0.4 0.7-0.6 1.2-0.6 0.3 0 0.6 0.1 0.8 0.2h0.1c1.6 1 3 1.4 4 1.4 1.1 0 2-0.6 2-1.2 0-0.5-0.3-1.3-3.3-2.3-2.7-1-6-2.6-6-6.3 0-2.2 1.4-4.7 5.4-5.5v-2.4c0-0.5 0.2-0.8 0.6-0.8h3.2c0.5 0 1 0.3 1 0.8v2.3c1.6 0.4 3.3 1.2 3.9 1.6 0.3 0.2 0.5 0.6 0.6 1 0.1 0.4-0.1 0.8-0.3 1l-1.4 1.4c-0.3 0.4-0.9 0.7-1.3 0.7-0.2 0-0.5-0.1-0.7-0.2-1.6-0.9-2.9-1.4-3.8-1.4-1.3 0-1.9 0.6-1.9 1 0 0.6 0.3 1.2 3 2.2 3.3 1.1 7 2.9 7 6.7 0.1 2.6-2 4.9-5.1 5.7z"
                                  />
                                </svg>
                                <div className="nds-control-action__container">
                                  <svg
                                    aria-hidden="true"
                                    className="slds-button__icon slds-button__icon--medium nds-button__icon nds-button__icon_medium "
                                    xmlns="http://www.w3.org/2000/svg"
                                    preserveAspectRatio="xMidYMid meet"
                                    sprite="'utility'"
                                    icon="'add'"
                                    size="'medium'"
                                    ng-disabled="control.propSetMap.repeatLimit !== undefined &amp;&amp; control.propSetMap.repeatLimit !== null &amp;&amp; child.eleArray.length >= control.propSetMap.repeatLimit+1"
                                    ng-click="baseCtrl.addItem(this, child, $index)"
                                    role="button"
                                    tabindex="0"
                                    aria-disabled="false"
                                    viewBox="0 0 52 52"
                                    alt="add"
                                  >
                                    <path
                                      fill="inherit"
                                      xmlns="http://www.w3.org/2000/svg"
                                      d="m30 29h16.5c0.8 0 1.5-0.7 1.5-1.5v-3c0-0.8-0.7-1.5-1.5-1.5h-16.5c-0.6 0-1-0.4-1-1v-16.5c0-0.8-0.7-1.5-1.5-1.5h-3c-0.8 0-1.5 0.7-1.5 1.5v16.5c0 0.6-0.4 1-1 1h-16.5c-0.8 0-1.5 0.7-1.5 1.5v3c0 0.8 0.7 1.5 1.5 1.5h16.5c0.6 0 1 0.4 1 1v16.5c0 0.8 0.7 1.5 1.5 1.5h3c0.8 0 1.5-0.7 1.5-1.5v-16.5c0-0.6 0.4-1 1-1z"
                                    />
                                  </svg>
                                </div>
                              </div>
                            </form>
                          </div>
                        </child>

                        <child
                          className="nds-medium-size_1-of-1 nds-small-size_1-of-1 nds-x-small-size_1-of-1 nds-large-size_6-of-12"
                          aria-hidden="false"
                        >
                          <div className="nds-size_1-of-1 ng-scope">
                            <form
                              name="loopform"
                              className="nds-form-element nds-size_1-of-1 nds-m-bottom_large nds-p-around_small nds-input__tooltip ng-scope ng-valid-min ng-valid-max ng-valid ng-valid-required ng-dirty"
                            >
                              <div
                                className="nds-form-element__control nds-form-element__control-animated-label nds-input-has-icon nds-input-has-icon_right nds-grid"
                                data-content=""
                              >
                                <span className="nds-form-element__addon ng-binding">
                                  ¥
                                </span>

                                <div className="nds-cont-wrapper">
                                  <input
                                    id="Currency1"
                                    type="tel"
                                    ng-blur="aggregate(this, control.index, control.indexInParent, true, -1)"
                                    ng-disabled="control.ro"
                                    ng-required="control.req"
                                    ui-number-mask="::control.propSetMap.mask"
                                    ui-negative-number="false"
                                    ui-hide-group-sep="false"
                                    min="::control.propSetMap.min"
                                    max="::control.propSetMap.max"
                                    name="loopname"
                                    ng-model="control.response"
                                    ng-model-options="{ updateOn: 'default focusout blur', debounce: { 'default': control.propSetMap.debounceValue, 'focusout': 0, 'blur': 0 } }"
                                    className="nds-input ng-valid-min ng-valid-max ng-valid ng-valid-required ng-touched ng-dirty ng-not-empty"
                                    ng-init="init(this, control)"
                                    vlc-slds-val-check-currency="response"
                                    vlc-slds-val-checker="response"
                                    aria-invalid="false"
                                  />

                                  <label
                                    for="Currency1"
                                    className="nds-form-element__label ng-binding"
                                  >
                                    Currency1
                                  </label>
                                </div>

                                <svg
                                  aria-hidden="true"
                                  className="slds-icon slds-icon--small nds-icon nds-icon_small "
                                  xmlns="http://www.w3.org/2000/svg"
                                  preserveAspectRatio="xMidYMid meet"
                                  sprite="'utility'"
                                  icon="'moneybag'"
                                  size="'small'"
                                  viewBox="0 0 52 52"
                                  alt="moneybag"
                                >
                                  <path
                                    fill="inherit"
                                    xmlns="http://www.w3.org/2000/svg"
                                    d="m20.5 9.1c0.2 0.6 0.8 0.9 1.4 0.9h8.1c0.6 0 1.2-0.3 1.4-0.9l3.2-5.9c0.2-0.6-0.2-1.2-0.8-1.2h-15.6c-0.6 0-1 0.6-0.7 1.1l3 6z m10.2 5.6h-9.4c-7.9 0-14.3 6.5-14.3 14.5v16c0 2.6 2.1 4.8 4.8 4.8h28.4c2.6 0 4.8-2.2 4.8-4.8v-16c0-8-6.5-14.5-14.3-14.5z m-2.3 27v2.7c0 0.5-0.5 0.8-1 0.8h-3.2c-0.5 0-0.6-0.3-0.6-0.8v-2.6c-2.4-0.5-4.4-1.5-4.9-2-0.6-0.6-0.8-1.1-0.3-1.8l1-1.6c0.2-0.4 0.7-0.6 1.2-0.6 0.3 0 0.6 0.1 0.8 0.2h0.1c1.6 1 3 1.4 4 1.4 1.1 0 2-0.6 2-1.2 0-0.5-0.3-1.3-3.3-2.3-2.7-1-6-2.6-6-6.3 0-2.2 1.4-4.7 5.4-5.5v-2.4c0-0.5 0.2-0.8 0.6-0.8h3.2c0.5 0 1 0.3 1 0.8v2.3c1.6 0.4 3.3 1.2 3.9 1.6 0.3 0.2 0.5 0.6 0.6 1 0.1 0.4-0.1 0.8-0.3 1l-1.4 1.4c-0.3 0.4-0.9 0.7-1.3 0.7-0.2 0-0.5-0.1-0.7-0.2-1.6-0.9-2.9-1.4-3.8-1.4-1.3 0-1.9 0.6-1.9 1 0 0.6 0.3 1.2 3 2.2 3.3 1.1 7 2.9 7 6.7 0.1 2.6-2 4.9-5.1 5.7z"
                                  />
                                </svg>
                                <div className="nds-control-action__container">
                                  <svg
                                    aria-hidden="true"
                                    className="slds-button__icon slds-button__icon--medium nds-button__icon nds-button__icon_medium "
                                    xmlns="http://www.w3.org/2000/svg"
                                    preserveAspectRatio="xMidYMid meet"
                                    sprite="'utility'"
                                    icon="'add'"
                                    size="'medium'"
                                    ng-disabled="control.propSetMap.repeatLimit !== undefined &amp;&amp; control.propSetMap.repeatLimit !== null &amp;&amp; child.eleArray.length >= control.propSetMap.repeatLimit+1"
                                    ng-click="baseCtrl.addItem(this, child, $index)"
                                    role="button"
                                    tabindex="0"
                                    aria-disabled="false"
                                    viewBox="0 0 52 52"
                                    alt="add"
                                  >
                                    <path
                                      fill="inherit"
                                      xmlns="http://www.w3.org/2000/svg"
                                      d="m30 29h16.5c0.8 0 1.5-0.7 1.5-1.5v-3c0-0.8-0.7-1.5-1.5-1.5h-16.5c-0.6 0-1-0.4-1-1v-16.5c0-0.8-0.7-1.5-1.5-1.5h-3c-0.8 0-1.5 0.7-1.5 1.5v16.5c0 0.6-0.4 1-1 1h-16.5c-0.8 0-1.5 0.7-1.5 1.5v3c0 0.8 0.7 1.5 1.5 1.5h16.5c0.6 0 1 0.4 1 1v16.5c0 0.8 0.7 1.5 1.5 1.5h3c0.8 0 1.5-0.7 1.5-1.5v-16.5c0-0.6 0.4-1 1-1z"
                                    />
                                  </svg>
                                </div>
                              </div>

                              <div className="nds-form-element__control-help ng-binding ng-scope">
                                Enter an Amount
                              </div>
                            </form>
                          </div>
                        </child>

                        <child
                          className="nds-medium-size_1-of-1 nds-small-size_1-of-1 nds-x-small-size_1-of-1 nds-large-size_6-of-12"
                          aria-hidden="false"
                        >
                          <div className="nds-size_1-of-1 ng-scope">
                            <form
                              name="loopform"
                              className="nds-form-element nds-m-bottom_large nds-p-around_small nds-input__tooltip ng-scope ng-valid ng-valid-required ng-dirty"
                            >
                              <div className="nds-grid nds-form--multi-input__container">
                                <div className="nds-form-element__control nds-form-element__control-animated-label nds-size_2-of-3 nds-p-right_small">
                                  <input
                                    id="Date/Time1"
                                    name="loopname"
                                    ng-disabled="control.ro"
                                    ng-required="control.req"
                                    type="text"
                                    placement="none"
                                    ng-change="aggregate(this, control.index, control.indexInParent, true, -1)"
                                    className="nds-input ng-valid ng-valid-required ng-touched ng-dirty ng-not-empty"
                                    ng-model="control.response"
                                    ng-init="init(this, control)"
                                    data-date-format="MM-dd-yyyy"
                                    data-max-date=""
                                    data-min-date=""
                                    timezone="-60"
                                    slds-date-picker=""
                                    vlc-slds-val-checker="response"
                                    aria-invalid="false"
                                  />

                                  <label
                                    for="Date/Time1"
                                    className="nds-form-element__label ng-binding"
                                  >
                                    Date/Time1
                                  </label>
                                </div>
                                <div
                                  className="nds-form-element__control nds-form-element__control-animated-label"
                                  style={{ width: '100%' }}
                                >
                                  <input
                                    type="text"
                                    placement="none"
                                    ng-disabled="control.ro"
                                    ng-required="control.req"
                                    ng-change="aggregate(this, control.index, control.indexInParent, true, -1)"
                                    className="nds-input ng-valid ng-valid-required ng-touched ng-dirty ng-not-empty"
                                    ng-model="control.response"
                                    name="timectrl"
                                    ng-init="init(this, control)"
                                    data-time-format="hh:mm a"
                                    timezone="-60"
                                    slds-time-picker=""
                                    data-default-date="today"
                                    vlc-slds-val-checker="reponse"
                                    autocomplete="off"
                                    aria-invalid="false"
                                  />
                                </div>
                                <div className="nds-control-action__container">
                                  <svg
                                    aria-hidden="true"
                                    className="slds-button__icon slds-button__icon--medium nds-button__icon nds-button__icon_medium "
                                    xmlns="http://www.w3.org/2000/svg"
                                    preserveAspectRatio="xMidYMid meet"
                                    sprite="'utility'"
                                    icon="'add'"
                                    size="'medium'"
                                    ng-disabled="control.propSetMap.repeatLimit !== undefined &amp;&amp; control.propSetMap.repeatLimit !== null &amp;&amp; child.eleArray.length >= control.propSetMap.repeatLimit+1"
                                    ng-click="baseCtrl.addItem(this, child, $index)"
                                    role="button"
                                    tabindex="0"
                                    aria-disabled="false"
                                    viewBox="0 0 52 52"
                                    alt="add"
                                  >
                                    <path
                                      fill="inherit"
                                      xmlns="http://www.w3.org/2000/svg"
                                      d="m30 29h16.5c0.8 0 1.5-0.7 1.5-1.5v-3c0-0.8-0.7-1.5-1.5-1.5h-16.5c-0.6 0-1-0.4-1-1v-16.5c0-0.8-0.7-1.5-1.5-1.5h-3c-0.8 0-1.5 0.7-1.5 1.5v16.5c0 0.6-0.4 1-1 1h-16.5c-0.8 0-1.5 0.7-1.5 1.5v3c0 0.8 0.7 1.5 1.5 1.5h16.5c0.6 0 1 0.4 1 1v16.5c0 0.8 0.7 1.5 1.5 1.5h3c0.8 0 1.5-0.7 1.5-1.5v-16.5c0-0.6 0.4-1 1-1z"
                                    />
                                  </svg>
                                </div>
                              </div>

                              <div className="nds-form-element__control-help ng-binding ng-scope">
                                Pick a Date/Time
                              </div>
                            </form>
                          </div>
                        </child>

                        <child
                          className="nds-medium-size_1-of-1 nds-small-size_1-of-1 nds-x-small-size_1-of-1 nds-large-size_12-of-12"
                          aria-hidden="false"
                        >
                          <div className="nds-size_1-of-1 ng-scope">
                            <form
                              name="loopform"
                              className="nds-form-element nds-size_1-of-1 nds-m-bottom_large nds-p-around_small ng-scope ng-valid ng-valid-required ng-dirty"
                            >
                              <div className="nds-form-element__control">
                                <div>
                                  <div className="nds-form-element__label nds-m-bottom_x-small ng-binding">
                                    Disclosure1
                                  </div>
                                  <div className="nds-box">
                                    <p
                                      vlc-bind-html="::control.propSetMap.text"
                                      className="ng-binding"
                                    >
                                      <p>This is Disclosure element</p>
                                    </p>
                                  </div>
                                  <div className="nds-m-top_x-small">
                                    <label className="nds-checkbox">
                                      <input
                                        id="Disclosure1"
                                        ng-disabled="control.ro"
                                        ng-required="control.req"
                                        type="checkbox"
                                        name="loopname"
                                        ng-model="control.response"
                                        ng-init="init(this, control)"
                                        vlc-slds-val-checker="response"
                                        ng-change="aggregate(this, control.index, control.indexInParent, true, -1)"
                                        className="ng-not-empty ng-valid ng-valid-required ng-touched ng-dirty"
                                        aria-invalid="false"
                                      />

                                      <span className="nds-checkbox_faux" />
                                      <span className="nds-form-element__label ng-binding">
                                        Disclosure1
                                      </span>
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </form>
                          </div>
                        </child>

                        <child
                          className="nds-medium-size_1-of-1 nds-small-size_1-of-1 nds-x-small-size_1-of-1 nds-large-size_12-of-12"
                          aria-hidden="false"
                        >
                          <div className="nds-size_1-of-1 ng-scope">
                            <form
                              name="loopform"
                              className="nds-form-element nds-m-bottom_large nds-p-around_small nds-input__tooltip ng-scope ng-valid-pattern ng-valid ng-valid-required ng-valid-email ng-dirty"
                            >
                              <div className="nds-form-element__control nds-form-element__control-animated-label nds-grid">
                                <input
                                  id="Email1"
                                  type="email"
                                  ng-disabled="control.ro"
                                  ng-required="control.req"
                                  className="nds-input form-control ng-valid-pattern ng-valid ng-valid-required ng-valid-email ng-touched ng-dirty ng-not-empty"
                                  name="loopname"
                                  ng-init="init(this, control)"
                                  ng-model="control.response"
                                  ng-model-options="{ updateOn: 'default focusout blur', debounce: { 'default': control.propSetMap.debounceValue, 'focusout': 0, 'blur': 0 } }"
                                  ng-blur="aggregate(this, control.index, control.indexInParent, true, -1)"
                                  vlc-slds-ng-pattern="[a-z0-9._-]+@[a-z0-9._-]+\.[a-z]{2,4}"
                                  vlc-slds-val-checker="response"
                                  aria-invalid="false"
                                />

                                <label
                                  for="Email1"
                                  className="nds-form-element__label ng-binding"
                                >
                                  Email1
                                </label>

                                <div className="nds-control-action__container">
                                  <svg
                                    aria-hidden="true"
                                    className="slds-button__icon slds-button__icon--medium nds-button__icon nds-button__icon_medium "
                                    xmlns="http://www.w3.org/2000/svg"
                                    preserveAspectRatio="xMidYMid meet"
                                    sprite="'utility'"
                                    icon="'add'"
                                    size="'medium'"
                                    ng-disabled="control.propSetMap.repeatLimit !== undefined &amp;&amp; control.propSetMap.repeatLimit !== null &amp;&amp; child.eleArray.length >= control.propSetMap.repeatLimit+1"
                                    ng-click="baseCtrl.addItem(this, child, $index)"
                                    role="button"
                                    tabindex="0"
                                    aria-disabled="false"
                                    viewBox="0 0 52 52"
                                    alt="add"
                                  >
                                    <path
                                      fill="inherit"
                                      xmlns="http://www.w3.org/2000/svg"
                                      d="m30 29h16.5c0.8 0 1.5-0.7 1.5-1.5v-3c0-0.8-0.7-1.5-1.5-1.5h-16.5c-0.6 0-1-0.4-1-1v-16.5c0-0.8-0.7-1.5-1.5-1.5h-3c-0.8 0-1.5 0.7-1.5 1.5v16.5c0 0.6-0.4 1-1 1h-16.5c-0.8 0-1.5 0.7-1.5 1.5v3c0 0.8 0.7 1.5 1.5 1.5h16.5c0.6 0 1 0.4 1 1v16.5c0 0.8 0.7 1.5 1.5 1.5h3c0.8 0 1.5-0.7 1.5-1.5v-16.5c0-0.6 0.4-1 1-1z"
                                    />
                                  </svg>
                                </div>
                              </div>

                              <div className="nds-form-element__control-help ng-binding ng-scope">
                                Enter an Email
                              </div>
                            </form>
                          </div>
                        </child>

                        <child
                          className="nds-medium-size_1-of-1 nds-small-size_1-of-1 nds-x-small-size_1-of-1 nds-large-size_6-of-12"
                          aria-hidden="false"
                        >
                          <div className="nds-size_1-of-1 ng-scope">
                            <form
                              name="loopform"
                              className="nds-form-element nds-m-bottom_large nds-p-around_small ng-pristine ng-valid ng-scope"
                            >
                              <div className="nds-form-element__control nds-grid">
                                <div className="nds-file-selector nds-file-custom-selector nds-file-selector_files">
                                  <div className="nds-file-selector__dropzone">
                                    <input
                                      type="file"
                                      id="File1"
                                      name="loopname"
                                      className="nds-input nds-file-selector__input ng-pristine ng-untouched ng-valid ng-empty"
                                      ng-model="control.response"
                                      multiple=""
                                      app-filereader=""
                                      aria-invalid="false"
                                    />

                                    <label
                                      for="File1"
                                      className="nds-file-selector__body nds-form-element__control-help"
                                    >
                                      <span className="nds-file-selector__button nds-button nds-button_neutral ng-binding">
                                        File1
                                      </span>

                                      <span className="nds-file-icon">
                                        <svg
                                          aria-hidden="true"
                                          className="nds-button__icon slds-icon slds-icon--large nds-icon nds-icon_large "
                                          xmlns="http://www.w3.org/2000/svg"
                                          preserveAspectRatio="xMidYMid meet"
                                          sprite="'utility'"
                                          icon="'attach'"
                                          size="'large'"
                                          viewBox="0 0 52 52"
                                          alt="attach"
                                        >
                                          <path
                                            fill="inherit"
                                            xmlns="http://www.w3.org/2000/svg"
                                            d="m17.6 36.7c0.6 0.6 1.5 0.5 2.1 0l10-10c0.7-0.7 1.9-0.8 2.8 0 0.9 0.8 0.8 2.2 0 3l-12.3 12.1c-2.7 2.7-7.2 2.7-9.9 0l-0.1-0.1c-2.7-2.7-2.7-7.2 0-9.9l21.7-21.7c2.7-2.7 7.2-2.7 9.9 0l0.1 0.1c2.7 2.7 2.7 7.2 0 9.9l-0.1 0.1c-0.5 0.5-0.6 1.2-0.2 1.8 0.6 1.1 1.1 2.3 1.4 3.5 0.2 0.8 1.1 1 1.7 0.5 0.8-0.8 1.5-1.6 1.5-1.6 5.1-5.1 5.1-13.4 0-18.5h-0.2c-5.1-5.1-13.4-5.1-18.5 0l-21.7 21.6c-5.1 5.1-5.1 13.4 0 18.5l0.2 0.2c5.1 5.1 13.3 5.1 18.4 0l12.4-12.3c3.2-3.2 3.1-8.4-0.2-11.6-3.2-3.1-8.4-2.9-11.5 0.3l-9.8 9.8c-0.6 0.6-0.6 1.6 0 2.2l2.3 2.1z"
                                          />
                                        </svg>
                                      </span>
                                    </label>
                                  </div>
                                </div>

                                <div
                                  className="nds-tooltip_container ng-scope"
                                  ng-include="'vlcNewportTooltip.html'"
                                >
                                  <div className="nds-nonfocused_control ng-scope">
                                    <svg
                                      aria-hidden="true"
                                      className="slds-icon slds-icon--small nds-icon nds-icon_small "
                                      xmlns="http://www.w3.org/2000/svg"
                                      preserveAspectRatio="xMidYMid meet"
                                      sprite="'utility'"
                                      icon="'info'"
                                      size="'small'"
                                      viewBox="0 0 52 52"
                                      alt="info"
                                    >
                                      <path
                                        fill="inherit"
                                        xmlns="http://www.w3.org/2000/svg"
                                        d="m26 2c-13.3 0-24 10.7-24 24s10.7 24 24 24 24-10.7 24-24-10.7-24-24-24z m0 12.1c1.7 0 3 1.3 3 3s-1.3 3-3 3-3-1.3-3-3 1.3-3 3-3z m5 21c0 0.5-0.4 0.9-1 0.9h-8c-0.5 0-1-0.3-1-0.9v-2c0-0.5 0.4-1.1 1-1.1 0.5 0 1-0.3 1-0.9v-4c0-0.5-0.4-1.1-1-1.1-0.5 0-1-0.3-1-0.9v-2c0-0.5 0.4-1.1 1-1.1h6c0.5 0 1 0.5 1 1.1v8c0 0.5 0.4 0.9 1 0.9 0.5 0 1 0.5 1 1.1v2z"
                                      />
                                    </svg>

                                    <div className="nds-is-absolute">
                                      <div
                                        className="nds-popover nds-popover_tooltip nds-nubbin_bottom"
                                        role="tooltip"
                                      >
                                        <div className="nds-popover__body ng-binding">
                                          Upload a file
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </form>
                          </div>
                        </child>

                        <child
                          className="nds-medium-size_1-of-1 nds-small-size_1-of-1 nds-x-small-size_1-of-1 nds-large-size_6-of-12"
                          aria-hidden="false"
                        >
                          <div className="nds-size_1-of-1 ng-scope">
                            <form
                              name="loopform"
                              className="nds-form-element nds-m-bottom_large nds-p-around_small ng-pristine ng-valid ng-scope"
                            >
                              <div className="nds-form-element__control nds-grid">
                                <div className="nds-file-selector nds-file-custom-selector nds-file-selector_files nds-file__image">
                                  <div className="nds-file-selector__dropzone">
                                    <input
                                      type="file"
                                      id="Image1"
                                      name="loopname"
                                      ng-model="control.response"
                                      className="nds-file-selector__input ng-pristine ng-untouched ng-valid ng-empty"
                                      vlc-slds-file-select="false"
                                      app-filereader=""
                                      accept="image/*"
                                      aria-invalid="false"
                                    />

                                    <label
                                      for="Image1"
                                      className="nds-file-selector__body nds-form-element__control-help"
                                    >
                                      <span className="nds-file-selector__button nds-button nds-button_neutral ng-binding">
                                        Image1
                                      </span>

                                      <span className="nds-file-icon">
                                        <svg
                                          aria-hidden="true"
                                          className="nds-button__icon slds-icon slds-icon--large nds-icon nds-icon_large "
                                          xmlns="http://www.w3.org/2000/svg"
                                          preserveAspectRatio="xMidYMid meet"
                                          sprite="'utility'"
                                          icon="'attach'"
                                          size="'large'"
                                          viewBox="0 0 52 52"
                                          alt="attach"
                                        >
                                          <path
                                            fill="inherit"
                                            xmlns="http://www.w3.org/2000/svg"
                                            d="m17.6 36.7c0.6 0.6 1.5 0.5 2.1 0l10-10c0.7-0.7 1.9-0.8 2.8 0 0.9 0.8 0.8 2.2 0 3l-12.3 12.1c-2.7 2.7-7.2 2.7-9.9 0l-0.1-0.1c-2.7-2.7-2.7-7.2 0-9.9l21.7-21.7c2.7-2.7 7.2-2.7 9.9 0l0.1 0.1c2.7 2.7 2.7 7.2 0 9.9l-0.1 0.1c-0.5 0.5-0.6 1.2-0.2 1.8 0.6 1.1 1.1 2.3 1.4 3.5 0.2 0.8 1.1 1 1.7 0.5 0.8-0.8 1.5-1.6 1.5-1.6 5.1-5.1 5.1-13.4 0-18.5h-0.2c-5.1-5.1-13.4-5.1-18.5 0l-21.7 21.6c-5.1 5.1-5.1 13.4 0 18.5l0.2 0.2c5.1 5.1 13.3 5.1 18.4 0l12.4-12.3c3.2-3.2 3.1-8.4-0.2-11.6-3.2-3.1-8.4-2.9-11.5 0.3l-9.8 9.8c-0.6 0.6-0.6 1.6 0 2.2l2.3 2.1z"
                                          />
                                        </svg>
                                      </span>
                                    </label>
                                  </div>
                                </div>

                                <div
                                  className="nds-tooltip_container ng-scope"
                                  ng-include="'vlcNewportTooltip.html'"
                                >
                                  <div className="nds-nonfocused_control ng-scope">
                                    <svg
                                      aria-hidden="true"
                                      className="slds-icon slds-icon--small nds-icon nds-icon_small "
                                      xmlns="http://www.w3.org/2000/svg"
                                      preserveAspectRatio="xMidYMid meet"
                                      sprite="'utility'"
                                      icon="'info'"
                                      size="'small'"
                                      viewBox="0 0 52 52"
                                      alt="info"
                                    >
                                      <path
                                        fill="inherit"
                                        xmlns="http://www.w3.org/2000/svg"
                                        d="m26 2c-13.3 0-24 10.7-24 24s10.7 24 24 24 24-10.7 24-24-10.7-24-24-24z m0 12.1c1.7 0 3 1.3 3 3s-1.3 3-3 3-3-1.3-3-3 1.3-3 3-3z m5 21c0 0.5-0.4 0.9-1 0.9h-8c-0.5 0-1-0.3-1-0.9v-2c0-0.5 0.4-1.1 1-1.1 0.5 0 1-0.3 1-0.9v-4c0-0.5-0.4-1.1-1-1.1-0.5 0-1-0.3-1-0.9v-2c0-0.5 0.4-1.1 1-1.1h6c0.5 0 1 0.5 1 1.1v8c0 0.5 0.4 0.9 1 0.9 0.5 0 1 0.5 1 1.1v2z"
                                      />
                                    </svg>

                                    <div className="nds-is-absolute">
                                      <div
                                        className="nds-popover nds-popover_tooltip nds-nubbin_bottom"
                                        role="tooltip"
                                      >
                                        <div className="nds-popover__body ng-binding">
                                          Upload an Image
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </form>
                          </div>
                        </child>

                        <child
                          className="nds-medium-size_1-of-1 nds-small-size_1-of-1 nds-x-small-size_1-of-1 nds-large-size_12-of-12"
                          aria-hidden="false"
                        >
                          <div className="nds-size_1-of-1 ng-scope">
                            <form
                              name="loopform"
                              className="nds-form-element nds-m-bottom_large nds-p-around_small ng-valid ng-scope ng-valid-required ng-dirty"
                              id="Multi-select1|0"
                              ng-required="control.req"
                              aria-required="false"
                            >
                              <fieldset className="nds-form-element">
                                <legend
                                  className="nds-form-element__legend nds-form-element__label"
                                  for="Multi-select1|0"
                                >
                                  <span className="ng-binding">
                                    Multi-select1
                                  </span>

                                  <div
                                    className="nds-tooltip_container ng-scope"
                                    ng-include="'vlcNewportTooltip.html'"
                                  >
                                    <div className="nds-nonfocused_control ng-scope">
                                      <svg
                                        aria-hidden="true"
                                        className="slds-icon slds-icon--small nds-icon nds-icon_small "
                                        xmlns="http://www.w3.org/2000/svg"
                                        preserveAspectRatio="xMidYMid meet"
                                        sprite="'utility'"
                                        icon="'info'"
                                        size="'small'"
                                        viewBox="0 0 52 52"
                                        alt="info"
                                      >
                                        <path
                                          fill="inherit"
                                          xmlns="http://www.w3.org/2000/svg"
                                          d="m26 2c-13.3 0-24 10.7-24 24s10.7 24 24 24 24-10.7 24-24-10.7-24-24-24z m0 12.1c1.7 0 3 1.3 3 3s-1.3 3-3 3-3-1.3-3-3 1.3-3 3-3z m5 21c0 0.5-0.4 0.9-1 0.9h-8c-0.5 0-1-0.3-1-0.9v-2c0-0.5 0.4-1.1 1-1.1 0.5 0 1-0.3 1-0.9v-4c0-0.5-0.4-1.1-1-1.1-0.5 0-1-0.3-1-0.9v-2c0-0.5 0.4-1.1 1-1.1h6c0.5 0 1 0.5 1 1.1v8c0 0.5 0.4 0.9 1 0.9 0.5 0 1 0.5 1 1.1v2z"
                                        />
                                      </svg>

                                      <div className="nds-is-absolute">
                                        <div
                                          className="nds-popover nds-popover_tooltip nds-nubbin_bottom"
                                          role="tooltip"
                                        >
                                          <div className="nds-popover__body ng-binding">
                                            Pick a Value from Multi-select
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="nds-control-action__container">
                                    <svg
                                      aria-hidden="true"
                                      className="slds-button__icon slds-button__icon--medium nds-button__icon nds-button__icon_medium "
                                      xmlns="http://www.w3.org/2000/svg"
                                      preserveAspectRatio="xMidYMid meet"
                                      sprite="'utility'"
                                      icon="'add'"
                                      size="'medium'"
                                      ng-disabled="control.propSetMap.repeatLimit !== undefined &amp;&amp; control.propSetMap.repeatLimit !== null &amp;&amp; child.eleArray.length >= control.propSetMap.repeatLimit+1"
                                      ng-click="baseCtrl.addItem(this, child, $index)"
                                      role="button"
                                      tabindex="0"
                                      aria-disabled="false"
                                      viewBox="0 0 52 52"
                                      alt="add"
                                    >
                                      <path
                                        fill="inherit"
                                        xmlns="http://www.w3.org/2000/svg"
                                        d="m30 29h16.5c0.8 0 1.5-0.7 1.5-1.5v-3c0-0.8-0.7-1.5-1.5-1.5h-16.5c-0.6 0-1-0.4-1-1v-16.5c0-0.8-0.7-1.5-1.5-1.5h-3c-0.8 0-1.5 0.7-1.5 1.5v16.5c0 0.6-0.4 1-1 1h-16.5c-0.8 0-1.5 0.7-1.5 1.5v3c0 0.8 0.7 1.5 1.5 1.5h16.5c0.6 0 1 0.4 1 1v16.5c0 0.8 0.7 1.5 1.5 1.5h3c0.8 0 1.5-0.7 1.5-1.5v-16.5c0-0.6 0.4-1 1-1z"
                                      />
                                    </svg>
                                  </div>
                                </legend>

                                <div className="nds-form-element__control">
                                  <div
                                    className="nds-checkbox_custom-group nds-clearfix ng-scope"
                                    ng-init="init(this, control)"
                                  >
                                    <label
                                      className="nds-button nds-checkbox_button nds-checkbox_aspect-ratio ng-scope"
                                      style={{
                                        width: 'calc(33.3333% - 1.25rem)',
                                        paddingTop: 'calc(33.3333% - 1.25rem)',
                                        marginBottom: '1rem'
                                      }}
                                    >
                                      <input
                                        id="Multi-select1"
                                        ng-disabled="control.ro"
                                        type="checkbox"
                                        ng-model="option.selected"
                                        vlc-slds-mu-val-checker="response"
                                        ng-change="onMultiSelect(this, control, option)"
                                        className="ng-valid ng-touched ng-dirty ng-empty"
                                        aria-invalid="false"
                                      />

                                      <span className="nds-checkbox_button__label ng-scope">
                                        <span className="nds-checkbox_custom-faux nds-title ng-binding">
                                          Uttar Pradesh
                                        </span>
                                      </span>
                                    </label>

                                    <label
                                      className="nds-button nds-checkbox_button nds-checkbox_aspect-ratio ng-scope"
                                      style={{
                                        width: 'calc(33.3333% - 1.25rem)',
                                        paddingTop: 'calc(33.3333% - 1.25rem)',
                                        marginBottom: '1rem'
                                      }}
                                    >
                                      <input
                                        id="Multi-select1"
                                        ng-disabled="control.ro"
                                        type="checkbox"
                                        ng-model="option.selected"
                                        vlc-slds-mu-val-checker="response"
                                        ng-change="onMultiSelect(this, control, option)"
                                        className="ng-valid ng-touched ng-dirty ng-empty"
                                        aria-invalid="false"
                                      />

                                      <span className="nds-checkbox_button__label ng-scope">
                                        <span className="nds-checkbox_custom-faux nds-title ng-binding">
                                          Madhya Pradesh
                                        </span>
                                      </span>
                                    </label>

                                    <label
                                      className="nds-button nds-checkbox_button nds-checkbox_aspect-ratio ng-scope"
                                      style={{
                                        width: 'calc(33.3333% - 1.25rem)',
                                        paddingTop: 'calc(33.3333% - 1.25rem)',
                                        marginBottom: '1rem'
                                      }}
                                    >
                                      <input
                                        id="Multi-select1"
                                        ng-disabled="control.ro"
                                        type="checkbox"
                                        ng-model="option.selected"
                                        vlc-slds-mu-val-checker="response"
                                        ng-change="onMultiSelect(this, control, option)"
                                        className="ng-valid ng-touched ng-dirty ng-empty"
                                        aria-invalid="false"
                                      />

                                      <span className="nds-checkbox_button__label ng-scope">
                                        <span className="nds-checkbox_custom-faux nds-title ng-binding">
                                          Maharastra
                                        </span>
                                      </span>
                                    </label>
                                  </div>
                                </div>
                              </fieldset>
                              <div className="nds-has-error nds-grid">
                                <div aria-hidden="false" />
                              </div>
                            </form>
                          </div>
                        </child>

                        <child
                          className="nds-medium-size_1-of-1 nds-small-size_1-of-1 nds-x-small-size_1-of-1 nds-large-size_12-of-12"
                          aria-hidden="false"
                        >
                          <div className="nds-size_1-of-1 ng-scope">
                            <form
                              name="loopform"
                              className="nds-form-element nds-size_1-of-1 nds-m-bottom_large nds-p-around_small nds-input__tooltip ng-scope ng-valid-minlength ng-valid-maxlength ng-valid ng-valid-required ng-dirty"
                            >
                              <div className="nds-form-element__control nds-form-element__control-animated-label nds-grid">
                                <input
                                  id="Password1"
                                  type="password"
                                  ng-disabled="control.ro"
                                  ng-required="control.req"
                                  name="loopname"
                                  ng-init="init(this, control)"
                                  ng-model="control.response"
                                  ng-blur="aggregate(this, control.index, control.indexInParent, true, -1)"
                                  ng-model-options="{ updateOn: 'default focusout blur', debounce: { 'default': control.propSetMap.debounceValue, 'focusout': 0, 'blur': 0 } }"
                                  className="nds-input form-control ng-valid-minlength ng-valid-maxlength ng-valid ng-valid-required ng-touched ng-dirty ng-not-empty"
                                  ng-maxlength="255"
                                  ng-minlength="0"
                                  vlc-slds-ng-pattern=""
                                  vlc-slds-val-checker="response"
                                  aria-invalid="false"
                                />

                                <label
                                  for="Password1"
                                  className="nds-form-element__label ng-binding"
                                >
                                  Password1
                                </label>

                                <div className="nds-control-action__container">
                                  <svg
                                    aria-hidden="true"
                                    className="slds-button__icon slds-button__icon--medium nds-button__icon nds-button__icon_medium "
                                    xmlns="http://www.w3.org/2000/svg"
                                    preserveAspectRatio="xMidYMid meet"
                                    sprite="'utility'"
                                    icon="'add'"
                                    size="'medium'"
                                    ng-disabled="control.propSetMap.repeatLimit !== undefined &amp;&amp; control.propSetMap.repeatLimit !== null &amp;&amp; child.eleArray.length >= control.propSetMap.repeatLimit+1"
                                    ng-click="baseCtrl.addItem(this, child, $index)"
                                    role="button"
                                    tabindex="0"
                                    aria-disabled="false"
                                    viewBox="0 0 52 52"
                                    alt="add"
                                  >
                                    <path
                                      fill="inherit"
                                      xmlns="http://www.w3.org/2000/svg"
                                      d="m30 29h16.5c0.8 0 1.5-0.7 1.5-1.5v-3c0-0.8-0.7-1.5-1.5-1.5h-16.5c-0.6 0-1-0.4-1-1v-16.5c0-0.8-0.7-1.5-1.5-1.5h-3c-0.8 0-1.5 0.7-1.5 1.5v16.5c0 0.6-0.4 1-1 1h-16.5c-0.8 0-1.5 0.7-1.5 1.5v3c0 0.8 0.7 1.5 1.5 1.5h16.5c0.6 0 1 0.4 1 1v16.5c0 0.8 0.7 1.5 1.5 1.5h3c0.8 0 1.5-0.7 1.5-1.5v-16.5c0-0.6 0.4-1 1-1z"
                                    />
                                  </svg>
                                </div>
                              </div>

                              <div className="nds-form-element__control-help ng-binding ng-scope">
                                Enter a secured Password
                              </div>
                            </form>
                          </div>
                        </child>

                        <child
                          className="nds-medium-size_1-of-1 nds-small-size_1-of-1 nds-x-small-size_1-of-1 nds-large-size_12-of-12"
                          aria-hidden="false"
                        >
                          <div className="nds-size_1-of-1 ng-scope">
                            <form
                              name="loopform"
                              className="nds-form-element nds-m-bottom_large nds-p-around_small nds-input__tooltip ng-scope ng-valid-min-int ng-valid-max-int ng-valid ng-valid-required ng-dirty"
                            >
                              <div className="nds-form-element__control nds-form-element__control-animated-label nds-grid">
                                <input
                                  id="Number1"
                                  type="tel"
                                  ng-disabled="control.ro"
                                  ng-required="control.req"
                                  name="loopname"
                                  ng-model="control.response"
                                  ng-blur="aggregate(this, control.index, control.indexInParent, true, -1)"
                                  ng-model-options="{ updateOn: 'default focusout blur', debounce: { 'default': control.propSetMap.debounceValue, 'focusout': 0, 'blur': 0 } }"
                                  className="nds-input form-control ng-valid-min-int ng-valid-max-int ng-valid ng-valid-required ng-touched ng-dirty ng-not-empty"
                                  via-mask="::control.propSetMap.mask"
                                  vlc-slds-ng-pattern=""
                                  vlc-slds-num-val-checker="response"
                                  vlc-slds-only-numeric="response"
                                  vlc-slds-attr="placeholder"
                                  aria-invalid="false"
                                />

                                <label
                                  for="Number1"
                                  className="nds-form-element__label ng-binding"
                                >
                                  Number1
                                </label>

                                <div className="nds-control-action__container">
                                  <svg
                                    aria-hidden="true"
                                    className="slds-button__icon slds-button__icon--medium nds-button__icon nds-button__icon_medium "
                                    xmlns="http://www.w3.org/2000/svg"
                                    preserveAspectRatio="xMidYMid meet"
                                    sprite="'utility'"
                                    icon="'add'"
                                    size="'medium'"
                                    ng-disabled="control.propSetMap.repeatLimit !== undefined &amp;&amp; control.propSetMap.repeatLimit !== null &amp;&amp; child.eleArray.length >= control.propSetMap.repeatLimit+1"
                                    ng-click="baseCtrl.addItem(this, child, $index)"
                                    role="button"
                                    tabindex="0"
                                    aria-disabled="false"
                                    viewBox="0 0 52 52"
                                    alt="add"
                                  >
                                    <path
                                      fill="inherit"
                                      xmlns="http://www.w3.org/2000/svg"
                                      d="m30 29h16.5c0.8 0 1.5-0.7 1.5-1.5v-3c0-0.8-0.7-1.5-1.5-1.5h-16.5c-0.6 0-1-0.4-1-1v-16.5c0-0.8-0.7-1.5-1.5-1.5h-3c-0.8 0-1.5 0.7-1.5 1.5v16.5c0 0.6-0.4 1-1 1h-16.5c-0.8 0-1.5 0.7-1.5 1.5v3c0 0.8 0.7 1.5 1.5 1.5h16.5c0.6 0 1 0.4 1 1v16.5c0 0.8 0.7 1.5 1.5 1.5h3c0.8 0 1.5-0.7 1.5-1.5v-16.5c0-0.6 0.4-1 1-1z"
                                    />
                                  </svg>
                                </div>
                              </div>

                              <div className="nds-form-element__control-help ng-binding ng-scope">
                                This is a Number Field
                              </div>
                            </form>
                          </div>
                        </child>

                        <child
                          className="nds-medium-size_1-of-1 nds-small-size_1-of-1 nds-x-small-size_1-of-1 nds-large-size_12-of-12"
                          aria-hidden="false"
                        >
                          <div className="nds-size_1-of-1 ng-scope">
                            <form
                              name="loopform"
                              id="Radio1|0"
                              className="nds-form-element nds-m-bottom_large nds-p-around_small ng-scope ng-valid ng-valid-required ng-dirty"
                            >
                              <fieldset className="nds-form-element">
                                <legend
                                  className="nds-form-element__legend nds-form-element__label nds-form-element__control-help"
                                  for="Radio1|0"
                                >
                                  <span className="ng-binding">Radio1</span>

                                  <div
                                    className="nds-tooltip_container ng-scope"
                                    ng-include="'vlcNewportTooltip.html'"
                                  >
                                    <div className="nds-nonfocused_control ng-scope">
                                      <svg
                                        aria-hidden="true"
                                        className="slds-icon slds-icon--small nds-icon nds-icon_small "
                                        xmlns="http://www.w3.org/2000/svg"
                                        preserveAspectRatio="xMidYMid meet"
                                        sprite="'utility'"
                                        icon="'info'"
                                        size="'small'"
                                        viewBox="0 0 52 52"
                                        alt="info"
                                      >
                                        <path
                                          fill="inherit"
                                          xmlns="http://www.w3.org/2000/svg"
                                          d="m26 2c-13.3 0-24 10.7-24 24s10.7 24 24 24 24-10.7 24-24-10.7-24-24-24z m0 12.1c1.7 0 3 1.3 3 3s-1.3 3-3 3-3-1.3-3-3 1.3-3 3-3z m5 21c0 0.5-0.4 0.9-1 0.9h-8c-0.5 0-1-0.3-1-0.9v-2c0-0.5 0.4-1.1 1-1.1 0.5 0 1-0.3 1-0.9v-4c0-0.5-0.4-1.1-1-1.1-0.5 0-1-0.3-1-0.9v-2c0-0.5 0.4-1.1 1-1.1h6c0.5 0 1 0.5 1 1.1v8c0 0.5 0.4 0.9 1 0.9 0.5 0 1 0.5 1 1.1v2z"
                                        />
                                      </svg>

                                      <div className="nds-is-absolute">
                                        <div
                                          className="nds-popover nds-popover_tooltip nds-nubbin_bottom"
                                          role="tooltip"
                                        >
                                          <div className="nds-popover__body ng-binding">
                                            This is a Radio picklist
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="nds-control-action__container">
                                    <svg
                                      aria-hidden="true"
                                      className="slds-button__icon slds-button__icon--medium nds-button__icon nds-button__icon_medium "
                                      xmlns="http://www.w3.org/2000/svg"
                                      preserveAspectRatio="xMidYMid meet"
                                      sprite="'utility'"
                                      icon="'add'"
                                      size="'medium'"
                                      ng-disabled="control.propSetMap.repeatLimit !== undefined &amp;&amp; control.propSetMap.repeatLimit !== null &amp;&amp; child.eleArray.length >= control.propSetMap.repeatLimit+1"
                                      ng-click="baseCtrl.addItem(this, child, $index)"
                                      role="button"
                                      tabindex="0"
                                      aria-disabled="false"
                                      viewBox="0 0 52 52"
                                      alt="add"
                                    >
                                      <path
                                        fill="inherit"
                                        xmlns="http://www.w3.org/2000/svg"
                                        d="m30 29h16.5c0.8 0 1.5-0.7 1.5-1.5v-3c0-0.8-0.7-1.5-1.5-1.5h-16.5c-0.6 0-1-0.4-1-1v-16.5c0-0.8-0.7-1.5-1.5-1.5h-3c-0.8 0-1.5 0.7-1.5 1.5v16.5c0 0.6-0.4 1-1 1h-16.5c-0.8 0-1.5 0.7-1.5 1.5v3c0 0.8 0.7 1.5 1.5 1.5h16.5c0.6 0 1 0.4 1 1v16.5c0 0.8 0.7 1.5 1.5 1.5h3c0.8 0 1.5-0.7 1.5-1.5v-16.5c0-0.6 0.4-1 1-1z"
                                      />
                                    </svg>
                                  </div>
                                </legend>

                                <div className="nds-form-element__control">
                                  <div className="nds-radio_button-group ng-scope">
                                    <label
                                      className="nds-button nds-radio_button ng-scope"
                                      style={{ width: '50%' }}
                                    >
                                      <input
                                        id="Radio1"
                                        ng-disabled="control.ro"
                                        ng-required="!control.response &amp;&amp; control.req"
                                        type="radio"
                                        ng-init="init(this, control)"
                                        ng-value="option.name"
                                        ng-model="control.response"
                                        ng-change="aggregate(this, control.index, control.indexInParent, true, -1);"
                                        vlc-slds-val-checker="response"
                                        ng-click="autoAdvance(option.autoAdv);"
                                        className="ng-valid ng-valid-required ng-touched ng-dirty ng-not-empty"
                                        name="953"
                                        value="TV"
                                        aria-invalid="false"
                                      />
                                      <span className="nds-radio_button__label">
                                        <span className="nds-radio_faux ng-binding">
                                          Television
                                        </span>
                                        <div className="nds-radio-overlay" />
                                      </span>
                                    </label>

                                    <label
                                      className="nds-button nds-radio_button ng-scope"
                                      style={{ width: '50%' }}
                                    >
                                      <input
                                        id="Radio1"
                                        ng-disabled="control.ro"
                                        ng-required="!control.response &amp;&amp; control.req"
                                        type="radio"
                                        ng-init="init(this, control)"
                                        ng-value="option.name"
                                        ng-model="control.response"
                                        ng-change="aggregate(this, control.index, control.indexInParent, true, -1);"
                                        vlc-slds-val-checker="response"
                                        ng-click="autoAdvance(option.autoAdv);"
                                        className="ng-valid ng-valid-required ng-touched ng-dirty ng-not-empty"
                                        name="956"
                                        value="Set"
                                        aria-invalid="false"
                                      />
                                      <span className="nds-radio_button__label">
                                        <span className="nds-radio_faux ng-binding">
                                          Setupbox
                                        </span>
                                        <div className="nds-radio-overlay" />
                                      </span>
                                    </label>
                                  </div>
                                </div>
                              </fieldset>
                            </form>
                          </div>
                        </child>

                        <child
                          className="nds-medium-size_1-of-1 nds-small-size_1-of-1 nds-x-small-size_1-of-1 nds-large-size_12-of-12"
                          aria-hidden="false"
                        >
                          <div className="nds-size_1-of-1 ng-scope">
                            <form
                              name="loopform"
                              id="Radio7|0"
                              className="nds-form-element nds-m-bottom_large nds-p-around_small ng-pristine ng-scope ng-valid ng-valid-required"
                            >
                              <fieldset className="nds-form-element">
                                <legend
                                  className="nds-form-element__legend nds-form-element__label nds-form-element__control-help"
                                  for="Radio7|0"
                                >
                                  <span className="ng-binding">Radio7</span>

                                  <div
                                    className="nds-tooltip_container ng-scope"
                                    ng-include="'vlcNewportTooltip.html'"
                                  >
                                    <div className="nds-nonfocused_control ng-scope">
                                      <svg
                                        aria-hidden="true"
                                        className="slds-icon slds-icon--small nds-icon nds-icon_small "
                                        xmlns="http://www.w3.org/2000/svg"
                                        preserveAspectRatio="xMidYMid meet"
                                        sprite="'utility'"
                                        icon="'info'"
                                        size="'small'"
                                        viewBox="0 0 52 52"
                                        alt="info"
                                      >
                                        <path
                                          fill="inherit"
                                          xmlns="http://www.w3.org/2000/svg"
                                          d="m26 2c-13.3 0-24 10.7-24 24s10.7 24 24 24 24-10.7 24-24-10.7-24-24-24z m0 12.1c1.7 0 3 1.3 3 3s-1.3 3-3 3-3-1.3-3-3 1.3-3 3-3z m5 21c0 0.5-0.4 0.9-1 0.9h-8c-0.5 0-1-0.3-1-0.9v-2c0-0.5 0.4-1.1 1-1.1 0.5 0 1-0.3 1-0.9v-4c0-0.5-0.4-1.1-1-1.1-0.5 0-1-0.3-1-0.9v-2c0-0.5 0.4-1.1 1-1.1h6c0.5 0 1 0.5 1 1.1v8c0 0.5 0.4 0.9 1 0.9 0.5 0 1 0.5 1 1.1v2z"
                                        />
                                      </svg>

                                      <div className="nds-is-absolute">
                                        <div
                                          className="nds-popover nds-popover_tooltip nds-nubbin_bottom"
                                          role="tooltip"
                                        >
                                          <div className="nds-popover__body ng-binding">
                                            This is a Radio picklist
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="nds-control-action__container">
                                    <svg
                                      aria-hidden="true"
                                      className="slds-button__icon slds-button__icon--medium nds-button__icon nds-button__icon_medium "
                                      xmlns="http://www.w3.org/2000/svg"
                                      preserveAspectRatio="xMidYMid meet"
                                      sprite="'utility'"
                                      icon="'add'"
                                      size="'medium'"
                                      ng-disabled="control.propSetMap.repeatLimit !== undefined &amp;&amp; control.propSetMap.repeatLimit !== null &amp;&amp; child.eleArray.length >= control.propSetMap.repeatLimit+1"
                                      ng-click="baseCtrl.addItem(this, child, $index)"
                                      role="button"
                                      tabindex="0"
                                      aria-disabled="false"
                                      viewBox="0 0 52 52"
                                      alt="add"
                                    >
                                      <path
                                        fill="inherit"
                                        xmlns="http://www.w3.org/2000/svg"
                                        d="m30 29h16.5c0.8 0 1.5-0.7 1.5-1.5v-3c0-0.8-0.7-1.5-1.5-1.5h-16.5c-0.6 0-1-0.4-1-1v-16.5c0-0.8-0.7-1.5-1.5-1.5h-3c-0.8 0-1.5 0.7-1.5 1.5v16.5c0 0.6-0.4 1-1 1h-16.5c-0.8 0-1.5 0.7-1.5 1.5v3c0 0.8 0.7 1.5 1.5 1.5h16.5c0.6 0 1 0.4 1 1v16.5c0 0.8 0.7 1.5 1.5 1.5h3c0.8 0 1.5-0.7 1.5-1.5v-16.5c0-0.6 0.4-1 1-1z"
                                      />
                                    </svg>
                                  </div>
                                </legend>

                                <div className="nds-form-element__control">
                                  <div className="nds-radio_button-group ng-scope">
                                    <label
                                      className="nds-button nds-radio_button ng-scope"
                                      style={{ width: '50%' }}
                                    >
                                      <input
                                        id="Radio7"
                                        ng-disabled="control.ro"
                                        ng-required="!control.response &amp;&amp; control.req"
                                        type="radio"
                                        ng-init="init(this, control)"
                                        ng-value="option.name"
                                        ng-model="control.response"
                                        ng-change="aggregate(this, control.index, control.indexInParent, true, -1);"
                                        vlc-slds-val-checker="response"
                                        ng-click="autoAdvance(option.autoAdv);"
                                        className="ng-pristine ng-untouched ng-empty ng-valid ng-valid-required"
                                        name="976"
                                        value="TV"
                                        aria-invalid="false"
                                      />
                                      <span className="nds-radio_button__label">
                                        <span className="nds-radio_faux ng-binding">
                                          Television
                                        </span>
                                        <div className="nds-radio-overlay" />
                                      </span>
                                    </label>

                                    <label
                                      className="nds-button nds-radio_button ng-scope"
                                      style={{ width: '50%' }}
                                    >
                                      <input
                                        id="Radio7"
                                        ng-disabled="control.ro"
                                        ng-required="!control.response &amp;&amp; control.req"
                                        type="radio"
                                        ng-init="init(this, control)"
                                        ng-value="option.name"
                                        ng-model="control.response"
                                        ng-change="aggregate(this, control.index, control.indexInParent, true, -1);"
                                        vlc-slds-val-checker="response"
                                        ng-click="autoAdvance(option.autoAdv);"
                                        className="ng-pristine ng-untouched ng-empty ng-valid ng-valid-required"
                                        name="979"
                                        value="Set"
                                        aria-invalid="false"
                                      />
                                      <span className="nds-radio_button__label">
                                        <span className="nds-radio_faux ng-binding">
                                          Setupbox
                                        </span>
                                        <div className="nds-radio-overlay" />
                                      </span>
                                    </label>
                                  </div>
                                </div>
                              </fieldset>
                            </form>
                          </div>
                        </child>

                        <child
                          className="nds-medium-size_1-of-1 nds-small-size_1-of-1 nds-x-small-size_1-of-1 nds-large-size_12-of-12"
                          aria-hidden="false"
                        >
                          <div className="nds-size--1-of-1 ng-scope">
                            <form
                              name="loopform"
                              className="nds-form-element nds-m-bottom_large nds-p-around_small vlc-slds-range-control ng-valid ng-scope ng-valid-min ng-valid-max ng-valid-step ng-valid-required ng-dirty"
                            >
                              <div className="nds-form-element__control nds-m-bottom_medium">
                                <label
                                  for="Range1"
                                  className="nds-form-element__label"
                                >
                                  <span className="ng-binding">Range1</span>

                                  <div
                                    className="nds-tooltip_container ng-scope"
                                    ng-include="'vlcNewportTooltip.html'"
                                  >
                                    <div className="nds-nonfocused_control ng-scope">
                                      <svg
                                        aria-hidden="true"
                                        className="slds-icon slds-icon--small nds-icon nds-icon_small "
                                        xmlns="http://www.w3.org/2000/svg"
                                        preserveAspectRatio="xMidYMid meet"
                                        sprite="'utility'"
                                        icon="'info'"
                                        size="'small'"
                                        viewBox="0 0 52 52"
                                        alt="info"
                                      >
                                        <path
                                          fill="inherit"
                                          xmlns="http://www.w3.org/2000/svg"
                                          d="m26 2c-13.3 0-24 10.7-24 24s10.7 24 24 24 24-10.7 24-24-10.7-24-24-24z m0 12.1c1.7 0 3 1.3 3 3s-1.3 3-3 3-3-1.3-3-3 1.3-3 3-3z m5 21c0 0.5-0.4 0.9-1 0.9h-8c-0.5 0-1-0.3-1-0.9v-2c0-0.5 0.4-1.1 1-1.1 0.5 0 1-0.3 1-0.9v-4c0-0.5-0.4-1.1-1-1.1-0.5 0-1-0.3-1-0.9v-2c0-0.5 0.4-1.1 1-1.1h6c0.5 0 1 0.5 1 1.1v8c0 0.5 0.4 0.9 1 0.9 0.5 0 1 0.5 1 1.1v2z"
                                        />
                                      </svg>

                                      <div className="nds-is-absolute">
                                        <div
                                          className="nds-popover nds-popover_tooltip nds-nubbin_bottom"
                                          role="tooltip"
                                        >
                                          <div className="nds-popover__body ng-binding">
                                            This is a Range slider
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="nds-control-action__container">
                                    <svg
                                      aria-hidden="true"
                                      className="slds-button__icon slds-button__icon--medium nds-button__icon nds-button__icon_medium "
                                      xmlns="http://www.w3.org/2000/svg"
                                      preserveAspectRatio="xMidYMid meet"
                                      sprite="'utility'"
                                      icon="'add'"
                                      size="'medium'"
                                      ng-disabled="control.propSetMap.repeatLimit !== undefined &amp;&amp; control.propSetMap.repeatLimit !== null &amp;&amp; child.eleArray.length >= control.propSetMap.repeatLimit+1"
                                      ng-click="baseCtrl.addItem(this, child, $index)"
                                      role="button"
                                      tabindex="0"
                                      aria-disabled="false"
                                      viewBox="0 0 52 52"
                                      alt="add"
                                    >
                                      <path
                                        fill="inherit"
                                        xmlns="http://www.w3.org/2000/svg"
                                        d="m30 29h16.5c0.8 0 1.5-0.7 1.5-1.5v-3c0-0.8-0.7-1.5-1.5-1.5h-16.5c-0.6 0-1-0.4-1-1v-16.5c0-0.8-0.7-1.5-1.5-1.5h-3c-0.8 0-1.5 0.7-1.5 1.5v16.5c0 0.6-0.4 1-1 1h-16.5c-0.8 0-1.5 0.7-1.5 1.5v3c0 0.8 0.7 1.5 1.5 1.5h16.5c0.6 0 1 0.4 1 1v16.5c0 0.8 0.7 1.5 1.5 1.5h3c0.8 0 1.5-0.7 1.5-1.5v-16.5c0-0.6 0.4-1 1-1z"
                                      />
                                    </svg>
                                  </div>
                                </label>

                                <div className="vlc-control-wrapper">
                                  <input
                                    ng-init="init(this, control)"
                                    id="Range1"
                                    type="range"
                                    vlc-range-slider=""
                                    ng-change="aggregate(this, control.index, control.indexInParent, true, -1)"
                                    ng-disabled="control.ro"
                                    ng-required="control.req"
                                    name="loopname"
                                    min="5"
                                    max="100"
                                    step="1"
                                    ng-model="control.response"
                                    mask=""
                                    vlc-slds-val-checker="response"
                                    className="ng-valid ng-valid-min ng-valid-max ng-valid-step ng-valid-required ng-touched ng-dirty ng-not-empty"
                                    aria-valuemin="5"
                                    aria-valuemax="100"
                                    aria-valuenow="20"
                                    aria-invalid="false"
                                    style={{ display: 'none' }}
                                  />
                                  <div
                                    className="noUISlider noUi-target noUi-ltr noUi-horizontal"
                                    vlc-range-slider-generated=""
                                  >
                                    <div className="noUi-base">
                                      <div
                                        className="noUi-origin"
                                        style={{ left: '15.7895%' }}
                                      >
                                        <div
                                          className="noUi-handle noUi-handle-lower"
                                          data-handle="0"
                                          tabindex="0"
                                          role="slider"
                                          aria-orientation="horizontal"
                                          aria-valuemin="0.0"
                                          aria-valuemax="100.0"
                                          aria-valuenow="15.8"
                                          aria-valuetext="20"
                                          style={{ zIndex: '4' }}
                                        >
                                          <div className="noUi-tooltip">20</div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </form>
                          </div>
                        </child>

                        <child
                          className="nds-medium-size_1-of-1 nds-small-size_1-of-1 nds-x-small-size_1-of-1 nds-large-size_12-of-12"
                          aria-hidden="false"
                        >
                          <div className="nds-size_1-of-1 ng-scope">
                            <form
                              name="loopform"
                              className="nds-form-element nds-m-bottom_large nds-p-around_small ng-scope ng-valid ng-valid-required ng-dirty"
                            >
                              <div className="nds-grid nds-cont-wrapper nds-select-wrapper">
                                <div
                                  className="nds-form-element__control nds-select_container nds-form-element__control-animated-label"
                                  style={{ height: '2rem' }}
                                >
                                  <select
                                    name="loopname"
                                    id="Select1"
                                    ng-disabled="control.ro"
                                    ng-required="control.req"
                                    chainup="test"
                                    ng-model="control.response"
                                    className="nds-select ng-valid ng-valid-required ng-touched ng-dirty ng-not-empty"
                                    vlc-slds-val-checker="response"
                                    ng-init="init(this, control)"
                                    ng-options="sOption as sOption.value for sOption in getOptions(control, this) track by sOption.name"
                                    ng-change="autoAdvance(control.response.autoAdv);"
                                    aria-invalid="false"
                                  >
                                    <option value="" />
                                    <option label="Computers" value="CSC">
                                      Computers
                                    </option>
                                    <option label="Electronics" value="ECE">
                                      Electronics
                                    </option>
                                    <option
                                      label="Production"
                                      value="IPE"
                                      selected="selected"
                                    >
                                      Production
                                    </option>
                                  </select>

                                  <label
                                    for="Select1"
                                    className="nds-form-element__label ng-binding"
                                  >
                                    Select1
                                  </label>
                                </div>

                                <div className="nds-control-action__container">
                                  <svg
                                    aria-hidden="true"
                                    className="slds-button__icon slds-button__icon--medium nds-button__icon nds-button__icon_medium "
                                    xmlns="http://www.w3.org/2000/svg"
                                    preserveAspectRatio="xMidYMid meet"
                                    sprite="'utility'"
                                    icon="'add'"
                                    size="'medium'"
                                    ng-disabled="control.propSetMap.repeatLimit !== undefined &amp;&amp; control.propSetMap.repeatLimit !== null &amp;&amp; child.eleArray.length >= control.propSetMap.repeatLimit+1"
                                    ng-click="baseCtrl.addItem(this, child, $index)"
                                    role="button"
                                    tabindex="0"
                                    aria-disabled="false"
                                    viewBox="0 0 52 52"
                                    alt="add"
                                  >
                                    <path
                                      fill="inherit"
                                      xmlns="http://www.w3.org/2000/svg"
                                      d="m30 29h16.5c0.8 0 1.5-0.7 1.5-1.5v-3c0-0.8-0.7-1.5-1.5-1.5h-16.5c-0.6 0-1-0.4-1-1v-16.5c0-0.8-0.7-1.5-1.5-1.5h-3c-0.8 0-1.5 0.7-1.5 1.5v16.5c0 0.6-0.4 1-1 1h-16.5c-0.8 0-1.5 0.7-1.5 1.5v3c0 0.8 0.7 1.5 1.5 1.5h16.5c0.6 0 1 0.4 1 1v16.5c0 0.8 0.7 1.5 1.5 1.5h3c0.8 0 1.5-0.7 1.5-1.5v-16.5c0-0.6 0.4-1 1-1z"
                                    />
                                  </svg>
                                </div>
                              </div>
                            </form>
                          </div>
                        </child>

                        <child
                          className="nds-medium-size_1-of-1 nds-small-size_1-of-1 nds-x-small-size_1-of-1 nds-large-size_12-of-12"
                          aria-hidden="false"
                        >
                          <div className="nds-size_1-of-1 ng-scope">
                            <form
                              name="loopform"
                              className="nds-form-element nds-m-bottom_large nds-p-around_small nds-input__tooltip ng-pristine ng-scope ng-valid-mask ng-valid-minlength ng-valid-maxlength ng-valid ng-valid-required"
                            >
                              <div className="nds-form-element__control nds-form-element__control-animated-label nds-grid">
                                <input
                                  id="Telephone1"
                                  type="text"
                                  ng-disabled="control.ro"
                                  ng-required="control.req"
                                  name="loopname"
                                  ng-model="control.response"
                                  ng-blur="aggregate(this, control.index, control.indexInParent, true, -1)"
                                  ng-model-options="{ updateOn: 'default focusout blur', debounce: { 'default': control.propSetMap.debounceValue, 'focusout': 0, 'blur': 0 } }"
                                  className="nds-input ng-pristine ng-untouched ng-valid-mask ng-valid-minlength ng-valid-maxlength ng-empty ng-valid ng-valid-required"
                                  vlc-slds-val-checker="telControl"
                                  ui-mask="(999) 999-9999"
                                  ng-minlength="0"
                                  ng-maxlength="255"
                                  vlc-slds-ng-pattern=""
                                  vlc-slds-attr="placeholder"
                                  placeholder="(___) ___-____"
                                  aria-invalid="false"
                                />

                                <label
                                  for="Telephone1"
                                  className="nds-form-element__label ng-binding"
                                >
                                  Telephone1
                                </label>

                                <div className="nds-control-action__container">
                                  <svg
                                    aria-hidden="true"
                                    className="slds-button__icon slds-button__icon--medium nds-button__icon nds-button__icon_medium "
                                    xmlns="http://www.w3.org/2000/svg"
                                    preserveAspectRatio="xMidYMid meet"
                                    sprite="'utility'"
                                    icon="'add'"
                                    size="'medium'"
                                    ng-disabled="control.propSetMap.repeatLimit !== undefined &amp;&amp; control.propSetMap.repeatLimit !== null &amp;&amp; child.eleArray.length >= control.propSetMap.repeatLimit+1"
                                    ng-click="baseCtrl.addItem(this, child, $index)"
                                    role="button"
                                    tabindex="0"
                                    aria-disabled="false"
                                    viewBox="0 0 52 52"
                                    alt="add"
                                  >
                                    <path
                                      fill="inherit"
                                      xmlns="http://www.w3.org/2000/svg"
                                      d="m30 29h16.5c0.8 0 1.5-0.7 1.5-1.5v-3c0-0.8-0.7-1.5-1.5-1.5h-16.5c-0.6 0-1-0.4-1-1v-16.5c0-0.8-0.7-1.5-1.5-1.5h-3c-0.8 0-1.5 0.7-1.5 1.5v16.5c0 0.6-0.4 1-1 1h-16.5c-0.8 0-1.5 0.7-1.5 1.5v3c0 0.8 0.7 1.5 1.5 1.5h16.5c0.6 0 1 0.4 1 1v16.5c0 0.8 0.7 1.5 1.5 1.5h3c0.8 0 1.5-0.7 1.5-1.5v-16.5c0-0.6 0.4-1 1-1z"
                                    />
                                  </svg>
                                </div>
                              </div>
                              <div className="nds-form-element__control-help ng-binding ng-scope">
                                Enter a Mobile Number
                              </div>
                            </form>
                          </div>
                        </child>

                        <child
                          className="nds-medium-size_1-of-1 nds-small-size_1-of-1 nds-x-small-size_1-of-1 nds-large-size_12-of-12"
                          aria-hidden="false"
                        >
                          <div className="nds-size_1-of-1 ng-scope">
                            <form
                              name="loopform"
                              className="nds-form-element nds-m-bottom_large nds-p-around_small nds-input__tooltip ng-scope ng-valid-minlength ng-valid-maxlength ng-valid ng-valid-required ng-dirty"
                            >
                              <div className="nds-form-element__control nds-form-element__control-animated-label nds-grid">
                                <input
                                  id="Signature1"
                                  ng-blur="aggregate(this, control.index, control.indexInParent, true, -1)"
                                  type="text"
                                  ng-disabled="control.ro"
                                  ng-required="control.req"
                                  name="loopname"
                                  ng-model="control.response"
                                  ng-model-options="{ updateOn: 'default focusout blur', debounce: { 'default': control.propSetMap.debounceValue, 'focusout': 0, 'blur': 0 } }"
                                  className="nds-input form-control ng-valid-minlength ng-valid-maxlength ng-valid ng-valid-required ng-touched ng-dirty ng-not-empty"
                                  style={{ fontFamily: 'cursive !important' }}
                                  vlc-slds-val-watch="response"
                                  ng-maxlength="255"
                                  ng-minlength="0"
                                  ng-init="init(this, control)"
                                  vlc-slds-val-checker="response"
                                  aria-invalid="false"
                                />

                                <label
                                  for="Signature1"
                                  className="nds-form-element__label ng-binding"
                                >
                                  Signature1
                                </label>
                                <div className="nds-control-action__container">
                                  <svg
                                    aria-hidden="true"
                                    className="slds-button__icon slds-button__icon--medium nds-button__icon nds-button__icon_medium "
                                    xmlns="http://www.w3.org/2000/svg"
                                    preserveAspectRatio="xMidYMid meet"
                                    sprite="'utility'"
                                    icon="'add'"
                                    size="'medium'"
                                    ng-disabled="control.propSetMap.repeatLimit !== undefined &amp;&amp; control.propSetMap.repeatLimit !== null &amp;&amp; child.eleArray.length >= control.propSetMap.repeatLimit+1"
                                    ng-click="baseCtrl.addItem(this, child, $index)"
                                    role="button"
                                    tabindex="0"
                                    aria-disabled="false"
                                    viewBox="0 0 52 52"
                                    alt="add"
                                  >
                                    <path
                                      fill="inherit"
                                      xmlns="http://www.w3.org/2000/svg"
                                      d="m30 29h16.5c0.8 0 1.5-0.7 1.5-1.5v-3c0-0.8-0.7-1.5-1.5-1.5h-16.5c-0.6 0-1-0.4-1-1v-16.5c0-0.8-0.7-1.5-1.5-1.5h-3c-0.8 0-1.5 0.7-1.5 1.5v16.5c0 0.6-0.4 1-1 1h-16.5c-0.8 0-1.5 0.7-1.5 1.5v3c0 0.8 0.7 1.5 1.5 1.5h16.5c0.6 0 1 0.4 1 1v16.5c0 0.8 0.7 1.5 1.5 1.5h3c0.8 0 1.5-0.7 1.5-1.5v-16.5c0-0.6 0.4-1 1-1z"
                                    />
                                  </svg>
                                </div>
                              </div>

                              <div className="nds-form-element__control-help ng-binding ng-scope">
                                Please Sign
                              </div>
                            </form>
                          </div>
                        </child>

                        <child
                          className="nds-medium-size_1-of-1 nds-small-size_1-of-1 nds-x-small-size_1-of-1 nds-large-size_12-of-12"
                          aria-hidden="false"
                        >
                          <div className="nds-size_1-of-1 ng-scope">
                            <form
                              name="loopform"
                              className="nds-form-element nds-m-bottom_large nds-p-around_small nds-input__tooltip ng-scope ng-valid ng-valid-required ng-dirty"
                            >
                              <div className="nds-form-element__control nds-form-element__control-animated-label nds-grid">
                                <input
                                  id="Time1"
                                  placement="none"
                                  ng-disabled="control.ro"
                                  ng-required="control.req"
                                  type="text"
                                  name="loopname"
                                  ng-change="aggregate(this, control.index, control.indexInParent, true, -1)"
                                  className="nds-input nds-time-picker ng-valid ng-valid-required ng-touched ng-dirty ng-not-empty"
                                  ng-model="control.response"
                                  ng-init="init(this, control)"
                                  slds-time-picker=""
                                  data-time-format="hh:mm a"
                                  vlc-slds-val-checker="response"
                                  aria-invalid="false"
                                />

                                <label
                                  for="Time1"
                                  className="nds-form-element__label ng-binding"
                                >
                                  Time1
                                </label>

                                <div className="nds-control-action__container">
                                  <svg
                                    aria-hidden="true"
                                    className="slds-button__icon slds-button__icon--medium nds-button__icon nds-button__icon_medium "
                                    xmlns="http://www.w3.org/2000/svg"
                                    preserveAspectRatio="xMidYMid meet"
                                    sprite="'utility'"
                                    icon="'add'"
                                    size="'medium'"
                                    ng-disabled="control.propSetMap.repeatLimit !== undefined &amp;&amp; control.propSetMap.repeatLimit !== null &amp;&amp; child.eleArray.length >= control.propSetMap.repeatLimit+1"
                                    ng-click="baseCtrl.addItem(this, child, $index)"
                                    role="button"
                                    tabindex="0"
                                    aria-disabled="false"
                                    viewBox="0 0 52 52"
                                    alt="add"
                                  >
                                    <path
                                      fill="inherit"
                                      xmlns="http://www.w3.org/2000/svg"
                                      d="m30 29h16.5c0.8 0 1.5-0.7 1.5-1.5v-3c0-0.8-0.7-1.5-1.5-1.5h-16.5c-0.6 0-1-0.4-1-1v-16.5c0-0.8-0.7-1.5-1.5-1.5h-3c-0.8 0-1.5 0.7-1.5 1.5v16.5c0 0.6-0.4 1-1 1h-16.5c-0.8 0-1.5 0.7-1.5 1.5v3c0 0.8 0.7 1.5 1.5 1.5h16.5c0.6 0 1 0.4 1 1v16.5c0 0.8 0.7 1.5 1.5 1.5h3c0.8 0 1.5-0.7 1.5-1.5v-16.5c0-0.6 0.4-1 1-1z"
                                    />
                                  </svg>
                                </div>
                              </div>

                              <div className="nds-form-element__control-help ng-binding ng-scope">
                                Pick a Time
                              </div>
                            </form>
                          </div>
                        </child>

                        <child
                          className="nds-medium-size_1-of-1 nds-small-size_1-of-1 nds-x-small-size_1-of-1 nds-large-size_12-of-12"
                          aria-hidden="false"
                        >
                          <div className="nds-size_1-of-1 ng-scope">
                            <form
                              name="loopform"
                              className="nds-form-element nds-m-bottom_large nds-p-around_small nds-input__tooltip ng-scope ng-valid-pattern ng-valid ng-valid-required ng-valid-url ng-dirty"
                            >
                              <div className="nds-form-element__control nds-form-element__control-animated-label nds-grid">
                                <input
                                  id="URL1"
                                  ng-disabled="control.ro"
                                  ng-required="control.req"
                                  type="url"
                                  name="loopname"
                                  ng-model="control.response"
                                  ng-model-options="{ updateOn: 'default focusout blur', debounce: { 'default': control.propSetMap.debounceValue, 'focusout': 0, 'blur': 0 } }"
                                  ng-blur="aggregate(this, control.index, control.indexInParent, true, -1)"
                                  className="nds-input form-control ng-valid-pattern ng-valid ng-valid-required ng-valid-url ng-touched ng-dirty ng-not-empty"
                                  ng-init="init(this, control)"
                                  vlc-slds-ng-pattern="(ht|f)tps?:\/\/[a-z0-9-\.]+\.[a-z]{2,4}\/?([^\s<>\#%\,\{\}\\|\\\^\[\]`]+)?"
                                  vlc-slds-val-checker="response"
                                  aria-invalid="false"
                                />

                                <label
                                  for="URL1"
                                  className="nds-form-element__label ng-binding"
                                >
                                  URL1
                                </label>

                                <div className="nds-control-action__container">
                                  <svg
                                    aria-hidden="true"
                                    className="slds-button__icon slds-button__icon--medium nds-button__icon nds-button__icon_medium "
                                    xmlns="http://www.w3.org/2000/svg"
                                    preserveAspectRatio="xMidYMid meet"
                                    sprite="'utility'"
                                    icon="'add'"
                                    size="'medium'"
                                    ng-disabled="control.propSetMap.repeatLimit !== undefined &amp;&amp; control.propSetMap.repeatLimit !== null &amp;&amp; child.eleArray.length >= control.propSetMap.repeatLimit+1"
                                    ng-click="baseCtrl.addItem(this, child, $index)"
                                    role="button"
                                    tabindex="0"
                                    aria-disabled="false"
                                    viewBox="0 0 52 52"
                                    alt="add"
                                  >
                                    <path
                                      fill="inherit"
                                      xmlns="http://www.w3.org/2000/svg"
                                      d="m30 29h16.5c0.8 0 1.5-0.7 1.5-1.5v-3c0-0.8-0.7-1.5-1.5-1.5h-16.5c-0.6 0-1-0.4-1-1v-16.5c0-0.8-0.7-1.5-1.5-1.5h-3c-0.8 0-1.5 0.7-1.5 1.5v16.5c0 0.6-0.4 1-1 1h-16.5c-0.8 0-1.5 0.7-1.5 1.5v3c0 0.8 0.7 1.5 1.5 1.5h16.5c0.6 0 1 0.4 1 1v16.5c0 0.8 0.7 1.5 1.5 1.5h3c0.8 0 1.5-0.7 1.5-1.5v-16.5c0-0.6 0.4-1 1-1z"
                                    />
                                  </svg>
                                </div>
                              </div>

                              <div className="nds-form-element__control-help ng-binding ng-scope">
                                Enter a URL
                              </div>
                            </form>
                          </div>
                        </child>

                        <child
                          className="nds-medium-size_1-of-1 nds-small-size_1-of-1 nds-x-small-size_1-of-1 nds-large-size_12-of-12"
                          aria-hidden="false"
                        >
                          <div className="nds-size_1-of-1 ng-scope">
                            <form
                              name="loopform"
                              className="nds-form-element nds-size_1-of-1 nds-m-bottom_large nds-p-around_small nds-input__tooltip ng-scope ng-valid-minlength ng-valid-maxlength ng-valid ng-valid-required ng-dirty"
                            >
                              <div className="nds-form-element__control nds-form-element__control-animated-label nds-grid">
                                <input
                                  id="Text1"
                                  type="text"
                                  name="loopname"
                                  ng-disabled="control.ro"
                                  ng-required="control.req"
                                  ng-model="control.response"
                                  ng-blur="aggregate(this, control.index, control.indexInParent, true, -1)"
                                  ng-model-options="{ updateOn: 'default focusout blur', debounce: { 'default': control.propSetMap.debounceValue, 'focusout': 0, 'blur': 0 } }"
                                  className="nds-input ng-valid-minlength ng-valid-maxlength ng-valid ng-valid-required ng-touched ng-dirty ng-not-empty"
                                  ui-mask=""
                                  ng-maxlength="255"
                                  vlc-slds-ng-pattern=""
                                  ng-minlength="0"
                                  vlc-slds-min-max-len="response"
                                  vlc-slds-val-checker="response"
                                  aria-invalid="false"
                                />

                                <label
                                  for="Text1"
                                  className="nds-form-element__label ng-binding"
                                >
                                  Text1
                                </label>
                                <div className="nds-control-action__container">
                                  <svg
                                    aria-hidden="true"
                                    className="slds-button__icon slds-button__icon--medium nds-button__icon nds-button__icon_medium "
                                    xmlns="http://www.w3.org/2000/svg"
                                    preserveAspectRatio="xMidYMid meet"
                                    sprite="'utility'"
                                    icon="'add'"
                                    size="'medium'"
                                    ng-disabled="control.propSetMap.repeatLimit !== undefined &amp;&amp; control.propSetMap.repeatLimit !== null &amp;&amp; child.eleArray.length >= control.propSetMap.repeatLimit+1"
                                    ng-click="baseCtrl.addItem(this, child, $index)"
                                    role="button"
                                    tabindex="0"
                                    aria-disabled="false"
                                    viewBox="0 0 52 52"
                                    alt="add"
                                  >
                                    <path
                                      fill="inherit"
                                      xmlns="http://www.w3.org/2000/svg"
                                      d="m30 29h16.5c0.8 0 1.5-0.7 1.5-1.5v-3c0-0.8-0.7-1.5-1.5-1.5h-16.5c-0.6 0-1-0.4-1-1v-16.5c0-0.8-0.7-1.5-1.5-1.5h-3c-0.8 0-1.5 0.7-1.5 1.5v16.5c0 0.6-0.4 1-1 1h-16.5c-0.8 0-1.5 0.7-1.5 1.5v3c0 0.8 0.7 1.5 1.5 1.5h16.5c0.6 0 1 0.4 1 1v16.5c0 0.8 0.7 1.5 1.5 1.5h3c0.8 0 1.5-0.7 1.5-1.5v-16.5c0-0.6 0.4-1 1-1z"
                                    />
                                  </svg>
                                </div>
                              </div>

                              <div className="nds-form-element__control-help ng-binding ng-scope">
                                Enter a Text Value
                              </div>
                            </form>
                          </div>
                        </child>
                      </div>
                    </div>

                    <div className="nds-col_padded nds-size_1-of-1 nds-m-top_medium nds-m-bottom_xx-large">
                      <div className="nds-grid nds-wrap vlc-slds-button_footer nds-form-element__control-help">
                        <div className="nds-grid nds-size_1-of-1 nds-p-bottom_small">
                          <div
                            className="nds-cursor-pointer ng-binding ng-scope"
                            confirmed-click="cancel()"
                            ng-confirm-click="Are you sure?"
                            role="button"
                            tabindex="0"
                          >
                            Cancel
                          </div>

                          <div
                            className="nds-col_bump-left nds-cursor-pointer ng-binding ng-scope"
                            confirmed-click="saveForLater(child)"
                            ng-confirm-click="Are you sure you want to save it for later?"
                            role="button"
                            tabindex="0"
                          >
                            Save for later
                          </div>
                        </div>

                        <div className="nds-size_1-of-1 nds-header__desktop ng-scope">
                          <div className="nds-wrap">
                            <div className="nds-align_absolute-center">
                              <button
                                className="nds-button nds-button_brand nds-p-around_xx-small nds-size_1-of-1 nds-medium-size_12-of-12"
                                id="Step for Newport-SetValues_nextBtn"
                                ng-click="nextRepeater(child.nextIndex, child.indexInParent)"
                                ng-disabled="checkValidity(this, child.index, child.indexInParent, &quot;Step&quot;, null, true)"
                                vlc-animation-slider="test"
                                aria-hidden="false"
                              >
                                Next
                              </button>
                            </div>
                            <div className="nds-align_absolute-center nds-p-around_xx-small">
                              <button
                                className="nds-button nds-button_neutral nds-p-around_xx-small nds-size_1-of-1 nds-medium-size_3-of-12"
                                id="Step for Newport-SetValues_prevBtn"
                                ng-click="previous(this,child)"
                                vlc-animation-slider="test"
                                reverse="true"
                                style={{ border: 'none' }}
                              >
                                Previous
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </section>
              </div>
            </child>
          </bptree>
        </div>
      </div>
    </ng-view>
  </div>
);
