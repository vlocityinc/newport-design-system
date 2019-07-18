/* eslint-env browser */
import { storiesOf } from '@storybook/html';
import base from 'paths.macro';
import notes from './doc.md';
import scss from './base/_index.scss';
import {
  withExample,
  withDocs,
  commentToHTML
} from '../../../scripts/storybook';

storiesOf(`${base}`, module)
  .addDecorator(withDocs(notes))
  .addDecorator(commentToHTML(scss))
  .add('Default (default)', () => {
    requestAnimationFrame(() => {
      const bpView = document.getElementById(`VlocityBPView`);
      bpView.addEventListener('change', event => {
        if (event.target.value) {
          event.target.classList.add('nds-has-value');
        } else {
          event.target.classList.remove('nds-has-value');
        }
      });
    });
    return withExample(`<div id="VlocityBP" class="vlocity via-slds via-omni via-nds">
  <ng-view id="VlocityBPView" autoscroll="true">
    <div class="nds-col nds-clearfix">
      <sidebar class="nds-col_padded nds-cleafix">
        <div></div>
      </sidebar>
      <auto-saveforlater-msg></auto-saveforlater-msg>
      <div>
        <section class="nds-page-header nds-m-top_x-small">
          <div class="nds-size_1-of-1">
            <div class="nds-size_6-of-12 nds-align_absolute-center nds-grid">
              <div class="nds-size_1-of-1 nds-col_bump-right">
                <div class="nds-progress nds-size_1-of-1">
                  <ol class="nds-progress__list">
                    <li class="nds-progress__item nds-is-relative nds-progress__visited completed nds-is-completed" role="button">
                      <button class="nds-button nds-progress__marker">
                        <svg aria-hidden="true" class="slds-icon slds-icon--small nds-icon nds-icon_small nds-button__icon" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" icon="'success'" viewBox="0 0 52 52" alt="success">
                          <path fill="inherit" xmlns="http://www.w3.org/2000/svg" d="m26 2c-13.3 0-24 10.7-24 24s10.7 24 24 24 24-10.7 24-24-10.7-24-24-24z m13.4 18l-15.3 15.5c-0.6 0.6-1.6 0.6-2.2 0l-8.4-8.5c-0.6-0.6-0.6-1.6 0-2.2l2.2-2.2c0.6-0.6 1.6-0.6 2.2 0l4.4 4.5c0.4 0.4 1.1 0.4 1.5 0l11.2-11.6c0.6-0.6 1.6-0.6 2.2 0l2.2 2.2c0.7 0.6 0.7 1.6 0 2.3z"></path>
                        </svg>
                      </button>
                      <div class="nds-is-absolute">
                        <div class="nds-popover nds-popover_tooltip nds-nubbin_bottom" role="tooltip">
                          <div class="nds-popover__body">Step7</div>
                        </div>
                      </div>
                    </li>
                    <li class="nds-progress__item nds-is-relative nds-progress__visited completed nds-is-completed" role="button">
                      <button class="nds-button nds-progress__marker">
                        <svg aria-hidden="true" class="slds-icon slds-icon--small nds-icon nds-icon_small nds-button__icon" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" icon="'success'" viewBox="0 0 52 52" alt="success">
                          <path fill="inherit" xmlns="http://www.w3.org/2000/svg" d="m26 2c-13.3 0-24 10.7-24 24s10.7 24 24 24 24-10.7 24-24-10.7-24-24-24z m13.4 18l-15.3 15.5c-0.6 0.6-1.6 0.6-2.2 0l-8.4-8.5c-0.6-0.6-0.6-1.6 0-2.2l2.2-2.2c0.6-0.6 1.6-0.6 2.2 0l4.4 4.5c0.4 0.4 1.1 0.4 1.5 0l11.2-11.6c0.6-0.6 1.6-0.6 2.2 0l2.2 2.2c0.7 0.6 0.7 1.6 0 2.3z"></path>
                        </svg>
                      </button>
                      <div class="nds-is-absolute">
                        <div class="nds-popover nds-popover_tooltip nds-nubbin_bottom" role="tooltip">
                          <div class="nds-popover__body">Fetch Pick List SFDC Load</div>
                        </div>
                      </div>
                    </li>
                    <li class="nds-progress__item nds-is-relative active nds-progress__visited nds-is-active" role="button">
                      <button class="nds-button nds-progress__marker" aria-hidden="false"></button>
                      <div class="nds-is-absolute">
                        <div class="nds-m-top_medium nds-is-relative nds-progress__step-label">
                          <div>Newport to be enabled here for Set Values</div>
                        </div>
                      </div>
                    </li>
                    <li class="nds-progress__item nds-is-relative" role="button">
                      <button class="nds-button nds-progress__marker" aria-hidden="false"></button>
                      <div class="nds-is-absolute">
                        <div class="nds-popover nds-popover_tooltip nds-nubbin_bottom" role="tooltip">
                          <div class="nds-popover__body">Newport to be enabled here for Seed Data</div>
                        </div>
                      </div>
                    </li>
                    <li class="nds-progress__item nds-is-relative" role="button">
                      <button class="nds-button nds-progress__marker" aria-hidden="false"></button>
                      <div class="nds-is-absolute">
                        <div class="nds-popover nds-popover_tooltip nds-nubbin_bottom" role="tooltip">
                          <div class="nds-popover__body">Newport to be enabled here for all elements marked Required and we are setting the values</div>
                        </div>
                      </div>
                    </li>
                    <li class="nds-progress__item nds-is-relative" role="button">
                      <button class="nds-button nds-progress__marker" aria-hidden="false"></button>
                      <div class="nds-is-absolute">
                        <div class="nds-popover nds-popover_tooltip nds-nubbin_bottom" role="tooltip">
                          <div class="nds-popover__body">Newport to be enabled here for all elements marked Required</div>
                        </div>
                      </div>
                    </li>
                    <li class="nds-progress__item nds-is-relative" role="button">
                      <button class="nds-button nds-progress__marker" aria-hidden="false"></button>
                      <div class="nds-is-absolute">
                        <div class="nds-popover nds-popover_tooltip nds-nubbin_bottom" role="tooltip">
                          <div class="nds-popover__body">Newport to be enabled here for all elements Repeat</div>
                        </div>
                      </div>
                    </li>
                  </ol>
                  <div class="nds-progress-bar nds-progress-bar_x-small" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" role="progressbar">
                    <span class="nds-progress-bar__value" style="width: 224.156px; background: rgb(94, 180, 255) none repeat scroll 0% 0%;">
                      <span class="nds-assistive-text">Progress: 0%</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <div>
        <bptree class="nds-clearfix" style="width: 100%;">
          <child >
            <div class="nds-grid vlc-slds-step_container nds-size_1-of-1 ">
              <section id="Step for Newport-SetValues" class="step-step nds-size_1-of-1 animate-if" aria-hidden="false">
                <div class="nds-col_padded nds-align_absolute-center nds-size_6-of-12 nds-medium-size_6-of-12 nds-small-size_1-of-1 nds-x-small-size_1-of-1 nds-p-top_xx-large">
                  <h1 class="nds-step_label">Newport to be enabled here for Set Values</h1>
                </div>
                <div role="form" name="a1L61000001lGHqEAM-5" id="a1L61000001lGHqEAM-5" class="nds-grid nds-wrap nds-align_absolute-center nds-size_6-of-12 nds-medium-size_6-of-12 nds-small-size_1-of-1 nds-x-small-size_1-of-1 nds-p-top_xx-large">
                  <div class="nds-col_padded nds-size_1-of-1">
                    <div class="nds-grid nds-wrap nds-grid_pull-padded">
                      <child class="nds-medium-size_1-of-1 nds-small-size_1-of-1 nds-x-small-size_1-of-1 nds-large-size_12-of-12" aria-hidden="false">
                        <div class="nds-size_1-of-1">
                          <form class="nds-form-element nds-size_1-of-1 nds-m-bottom_large nds-p-around_small nds-input__tooltip">
                            <div class="nds-form-element__control nds-form-element__control-animated-label nds-grid">
                              <input type="text" id="Text6" class="nds-input" aria-invalid="false" >
                              <label class="nds-form-element__label">Text6</label>
                              <div class="nds-control-action__container">
                                <svg aria-hidden="true" class="nds-button__icon nds-button__icon_medium " xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" icon="'add'" role="button" aria-disabled="false"
                                  viewBox="0 0 52 52" alt="add">
                                  <path fill="inherit" xmlns="http://www.w3.org/2000/svg" d="m30 29h16.5c0.8 0 1.5-0.7 1.5-1.5v-3c0-0.8-0.7-1.5-1.5-1.5h-16.5c-0.6 0-1-0.4-1-1v-16.5c0-0.8-0.7-1.5-1.5-1.5h-3c-0.8 0-1.5 0.7-1.5 1.5v16.5c0 0.6-0.4 1-1 1h-16.5c-0.8 0-1.5 0.7-1.5 1.5v3c0 0.8 0.7 1.5 1.5 1.5h16.5c0.6 0 1 0.4 1 1v16.5c0 0.8 0.7 1.5 1.5 1.5h3c0.8 0 1.5-0.7 1.5-1.5v-16.5c0-0.6 0.4-1 1-1z"></path>
                                </svg>
                              </div>
                            </div>
                          </form>
                        </div>
                      </child>
                      <child class="nds-medium-size_1-of-1 nds-small-size_1-of-1 nds-x-small-size_1-of-1 nds-large-size_12-of-12" aria-hidden="false">
                        <div class="nds-size_1-of-1">
                          <form name="loopform" class="nds-form-element nds-m-bottom_large nds-p-around_small">
                            <div class="nds-form-element__control nds-lookup nds-input-has-icon nds-grid nds-form-element__control-animated-label">
                              <div class="nds-grid nds-cont-wrapper">
                                <svg aria-hidden="true" class="nds-button__icon nds-m-right_xx-small slds-icon slds-icon--small nds-icon nds-icon_small " xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" icon="'search'" viewBox="0 0 52 52"
                                  alt="search">
                                  <path d="m49.6 45.3l-13.4-13.3c2.7-3.8 4.1-8.6 3.4-13.7-1.2-8.6-8.2-15.4-16.9-16.2-11.8-1.2-21.8 8.8-20.6 20.7 0.8 8.6 7.6 15.7 16.2 16.9 5.1 0.7 9.9-0.7 13.7-3.4l13.3 13.3c0.6 0.6 1.5 0.6 2.1 0l2.1-2.1c0.6-0.6 0.6-1.6 0.1-2.2z m-41.6-24.4c0-7.1 5.8-12.9 12.9-12.9 7.1 0 12.9 5.8 12.9 12.9 0 7.1-5.8 12.9-12.9 12.9-7.1 0-12.9-5.7-12.9-12.9z"
                                    fill="inherit" xmlns="http://www.w3.org/2000/svg"></path>
                                </svg>
                                <input type="text" id="Lookup1" name="loopname" class="nds-input" aria-invalid="false">
                                <label class="nds-form-element__label nds-p-left_large">Lookup1</label>
                              </div>
                              <div class="nds-control-action__container">
                                <svg aria-hidden="true" class="nds-button__icon nds-button__icon_medium " xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" icon="'add'" role="button" aria-disabled="false"
                                  viewBox="0 0 52 52" alt="add">
                                  <path fill="inherit" xmlns="http://www.w3.org/2000/svg" d="m30 29h16.5c0.8 0 1.5-0.7 1.5-1.5v-3c0-0.8-0.7-1.5-1.5-1.5h-16.5c-0.6 0-1-0.4-1-1v-16.5c0-0.8-0.7-1.5-1.5-1.5h-3c-0.8 0-1.5 0.7-1.5 1.5v16.5c0 0.6-0.4 1-1 1h-16.5c-0.8 0-1.5 0.7-1.5 1.5v3c0 0.8 0.7 1.5 1.5 1.5h16.5c0.6 0 1 0.4 1 1v16.5c0 0.8 0.7 1.5 1.5 1.5h3c0.8 0 1.5-0.7 1.5-1.5v-16.5c0-0.6 0.4-1 1-1z"></path>
                                </svg>
                              </div>
                            </div>
                          </form>
                        </div>
                      </child>
                      <child class="nds-medium-size_1-of-1 nds-small-size_1-of-1 nds-x-small-size_1-of-1 nds-large-size_12-of-12" aria-hidden="false">
                        <div class="nds-size_1-of-1 ">
                          <form name="loopform" class="nds-form-element nds-m-bottom_large nds-p-around_small nds-input__tooltip ">
                            <div class="nds-form-element__control nds-form-element__control-animated-label nds-grid">
                              <input type="email" id="Email7" class="nds-input form-control" name="loopname" aria-invalid="false">
                              <label class="nds-form-element__label">Email7</label>
                              <div class="nds-control-action__container">
                                <svg aria-hidden="true" class="nds-button__icon nds-button__icon_medium " xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" icon="'add'" role="button" aria-disabled="false"
                                  viewBox="0 0 52 52" alt="add">
                                  <path fill="inherit" xmlns="http://www.w3.org/2000/svg" d="m30 29h16.5c0.8 0 1.5-0.7 1.5-1.5v-3c0-0.8-0.7-1.5-1.5-1.5h-16.5c-0.6 0-1-0.4-1-1v-16.5c0-0.8-0.7-1.5-1.5-1.5h-3c-0.8 0-1.5 0.7-1.5 1.5v16.5c0 0.6-0.4 1-1 1h-16.5c-0.8 0-1.5 0.7-1.5 1.5v3c0 0.8 0.7 1.5 1.5 1.5h16.5c0.6 0 1 0.4 1 1v16.5c0 0.8 0.7 1.5 1.5 1.5h3c0.8 0 1.5-0.7 1.5-1.5v-16.5c0-0.6 0.4-1 1-1z"></path>
                                </svg>
                              </div>
                            </div>
                          </form>
                        </div>
                      </child>
                      <child class="nds-medium-size_1-of-1 nds-small-size_1-of-1 nds-x-small-size_1-of-1 nds-large-size_12-of-12" aria-hidden="false">
                        <div class="nds-size_1-of-1 ">
                          <form name="loopform" class="nds-form-element nds-m-bottom_large nds-p-around_small nds-input__tooltip ">
                            <div class="nds-grid nds-form--multi-input__container">
                              <div class="nds-form-element__control nds-form-element__control-animated-label nds-size_2-of-3 nds-p-right_small">
                                <input type="text" id="Date/Time5" name="loopname" class="nds-input" data-date-format="MM-dd-yyyy" data-max-date="" data-min-date="" aria-invalid="false">
                                <label class="nds-form-element__label">Date/Time5</label>
                              </div>
                              <div class="nds-form-element__control nds-form-element__control-animated-label" style="width: 100%;">
                                <input type="text" class="nds-input" name="timectrl" data-time-format="hh:mm a" data-default-date="today" aria-invalid="false">
                              </div>
                              <div class="nds-control-action__container">
                                <svg aria-hidden="true" class="nds-button__icon nds-button__icon_medium " xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" icon="'add'" role="button" aria-disabled="false"
                                  viewBox="0 0 52 52" alt="add">
                                  <path fill="inherit" xmlns="http://www.w3.org/2000/svg" d="m30 29h16.5c0.8 0 1.5-0.7 1.5-1.5v-3c0-0.8-0.7-1.5-1.5-1.5h-16.5c-0.6 0-1-0.4-1-1v-16.5c0-0.8-0.7-1.5-1.5-1.5h-3c-0.8 0-1.5 0.7-1.5 1.5v16.5c0 0.6-0.4 1-1 1h-16.5c-0.8 0-1.5 0.7-1.5 1.5v3c0 0.8 0.7 1.5 1.5 1.5h16.5c0.6 0 1 0.4 1 1v16.5c0 0.8 0.7 1.5 1.5 1.5h3c0.8 0 1.5-0.7 1.5-1.5v-16.5c0-0.6 0.4-1 1-1z"></path>
                                </svg>
                              </div>
                            </div>
                          </form>
                        </div>
                      </child>
                      <child class="nds-medium-size_1-of-1 nds-small-size_1-of-1 nds-x-small-size_1-of-1 nds-large-size_12-of-12" aria-hidden="false">
                        <div class="nds-size_1-of-1 ">
                          <form name="loopform" class="nds-form-element nds-m-bottom_large nds-p-around_small" id="Multi-select13|0" aria-required="false">
                            <fieldset class="nds-form-element">
                              <legend class="nds-form-element__legend nds-form-element__label">
                                <span>Multi-select13</span>
                                <div class="nds-tooltip_container ">
                                  <div class="nds-nonfocused_control nds-inline-help-text ">
                                    <svg aria-hidden="true" class="slds-icon slds-icon--small nds-icon nds-icon_small " xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" icon="'info'" viewBox="0 0 52 52" alt="info">
                                      <path fill="inherit" xmlns="http://www.w3.org/2000/svg" d="m26 2c-13.3 0-24 10.7-24 24s10.7 24 24 24 24-10.7 24-24-10.7-24-24-24z m0 12.1c1.7 0 3 1.3 3 3s-1.3 3-3 3-3-1.3-3-3 1.3-3 3-3z m5 21c0 0.5-0.4 0.9-1 0.9h-8c-0.5 0-1-0.3-1-0.9v-2c0-0.5 0.4-1.1 1-1.1 0.5 0 1-0.3 1-0.9v-4c0-0.5-0.4-1.1-1-1.1-0.5 0-1-0.3-1-0.9v-2c0-0.5 0.4-1.1 1-1.1h6c0.5 0 1 0.5 1 1.1v8c0 0.5 0.4 0.9 1 0.9 0.5 0 1 0.5 1 1.1v2z"></path>
                                    </svg>
                                    <div class="nds-is-absolute">
                                      <div class="nds-popover nds-popover_tooltip nds-nubbin_bottom-right" role="tooltip">
                                        <div class="nds-popover__body">Pick Multi-Select</div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div class="nds-control-action__container">
                                  <svg aria-hidden="true" class="nds-button__icon nds-button__icon_medium " xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" icon="'add'" role="button" aria-disabled="false"
                                    viewBox="0 0 52 52" alt="add">
                                    <path fill="inherit" xmlns="http://www.w3.org/2000/svg" d="m30 29h16.5c0.8 0 1.5-0.7 1.5-1.5v-3c0-0.8-0.7-1.5-1.5-1.5h-16.5c-0.6 0-1-0.4-1-1v-16.5c0-0.8-0.7-1.5-1.5-1.5h-3c-0.8 0-1.5 0.7-1.5 1.5v16.5c0 0.6-0.4 1-1 1h-16.5c-0.8 0-1.5 0.7-1.5 1.5v3c0 0.8 0.7 1.5 1.5 1.5h16.5c0.6 0 1 0.4 1 1v16.5c0 0.8 0.7 1.5 1.5 1.5h3c0.8 0 1.5-0.7 1.5-1.5v-16.5c0-0.6 0.4-1 1-1z"></path>
                                  </svg>
                                </div>
                              </legend>
                              <div class="nds-form-element__control">
                                <div class="nds-checkbox_custom-group nds-clearfix ">
                                  <label class="nds-button nds-checkbox_button nds-checkbox_aspect-ratio " style="width: calc(33.3333% - 1.25rem); padding-top: calc(33.3333% - 1.25rem); margin-bottom: 1rem;">
                                    <input type="checkbox" id="Multi-select13" aria-invalid="false" value="on">
                                    <span class="nds-checkbox_button__label ">
                                      <span class="nds-checkbox_custom-faux nds-title">Hi</span>
                                    </span>
                                  </label>
                                  <label class="nds-button nds-checkbox_button nds-checkbox_aspect-ratio " style="width: calc(33.3333% - 1.25rem); padding-top: calc(33.3333% - 1.25rem); margin-bottom: 1rem;">
                                    <input type="checkbox" id="Multi-select13" aria-invalid="false" value="on">
                                    <span class="nds-checkbox_button__label ">
                                      <span class="nds-checkbox_custom-faux nds-title">Hello</span>
                                    </span>
                                  </label>
                                </div>
                              </div>
                            </fieldset>
                            <div class="nds-has-error nds-grid">
                              <div aria-hidden="false"></div>
                            </div>
                          </form>
                        </div>
                      </child>
                      <child class="nds-medium-size_1-of-1 nds-small-size_1-of-1 nds-x-small-size_1-of-1 nds-large-size_12-of-12" aria-hidden="false">
                        <div class="nds-size_1-of-1 ">
                          <form name="loopform" class="nds-form-element nds-m-bottom_large nds-p-around_small ">
                            <div class="nds-grid nds-form--multi-input__container">
                              <div class="nds-cont-wrapper nds-form-element__control nds-form-element__control-animated-label">
                                <input type="text" id="Date6" name="loopname" class="nds-input" data-date-format="MM-dd-yyyy" data-max-date="" data-min-date="" aria-invalid="false">
                                <label class="nds-form-element__label">Date6</label>
                              </div>
                              <div class="nds-control-action__container">
                                <svg aria-hidden="true" class="nds-button__icon nds-button__icon_medium " xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" icon="'add'" role="button" aria-disabled="false"
                                  viewBox="0 0 52 52" alt="add">
                                  <path fill="inherit" xmlns="http://www.w3.org/2000/svg" d="m30 29h16.5c0.8 0 1.5-0.7 1.5-1.5v-3c0-0.8-0.7-1.5-1.5-1.5h-16.5c-0.6 0-1-0.4-1-1v-16.5c0-0.8-0.7-1.5-1.5-1.5h-3c-0.8 0-1.5 0.7-1.5 1.5v16.5c0 0.6-0.4 1-1 1h-16.5c-0.8 0-1.5 0.7-1.5 1.5v3c0 0.8 0.7 1.5 1.5 1.5h16.5c0.6 0 1 0.4 1 1v16.5c0 0.8 0.7 1.5 1.5 1.5h3c0.8 0 1.5-0.7 1.5-1.5v-16.5c0-0.6 0.4-1 1-1z"></path>
                                </svg>
                              </div>
                            </div>
                          </form>
                        </div>
                      </child>
                      <child class="nds-medium-size_1-of-1 nds-small-size_1-of-1 nds-x-small-size_1-of-1 nds-large-size_6-of-12" aria-hidden="false">
                        <div class="nds-size_1-of-1 ">
                          <form name="loopform" class="nds-form-element nds-m-bottom_large nds-p-around_small ">
                            <div class="nds-grid nds-form--multi-input__container">
                              <div class="nds-cont-wrapper nds-form-element__control nds-form-element__control-animated-label">
                                <input type="text" id="Date1" name="loopname" class="nds-input " data-date-format="MM-dd-yyyy" data-max-date="" data-min-date="" aria-invalid="false">
                                <label class="nds-form-element__label">Date1</label>
                              </div>
                              <div class="nds-tooltip_container ">
                                <div class="nds-nonfocused_control nds-inline-help-text ">
                                  <svg aria-hidden="true" class="slds-icon slds-icon--small nds-icon nds-icon_small " xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" icon="'info'" viewBox="0 0 52 52" alt="info">
                                    <path fill="inherit" xmlns="http://www.w3.org/2000/svg" d="m26 2c-13.3 0-24 10.7-24 24s10.7 24 24 24 24-10.7 24-24-10.7-24-24-24z m0 12.1c1.7 0 3 1.3 3 3s-1.3 3-3 3-3-1.3-3-3 1.3-3 3-3z m5 21c0 0.5-0.4 0.9-1 0.9h-8c-0.5 0-1-0.3-1-0.9v-2c0-0.5 0.4-1.1 1-1.1 0.5 0 1-0.3 1-0.9v-4c0-0.5-0.4-1.1-1-1.1-0.5 0-1-0.3-1-0.9v-2c0-0.5 0.4-1.1 1-1.1h6c0.5 0 1 0.5 1 1.1v8c0 0.5 0.4 0.9 1 0.9 0.5 0 1 0.5 1 1.1v2z"></path>
                                  </svg>
                                  <div class="nds-is-absolute">
                                    <div class="nds-popover nds-popover_tooltip nds-nubbin_bottom-right" role="tooltip">
                                      <div class="nds-popover__body">Pick a Date</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div class="nds-control-action__container">
                                <svg aria-hidden="true" class="nds-button__icon nds-button__icon_medium " xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" icon="'add'" role="button" aria-disabled="false"
                                  viewBox="0 0 52 52" alt="add">
                                  <path fill="inherit" xmlns="http://www.w3.org/2000/svg" d="m30 29h16.5c0.8 0 1.5-0.7 1.5-1.5v-3c0-0.8-0.7-1.5-1.5-1.5h-16.5c-0.6 0-1-0.4-1-1v-16.5c0-0.8-0.7-1.5-1.5-1.5h-3c-0.8 0-1.5 0.7-1.5 1.5v16.5c0 0.6-0.4 1-1 1h-16.5c-0.8 0-1.5 0.7-1.5 1.5v3c0 0.8 0.7 1.5 1.5 1.5h16.5c0.6 0 1 0.4 1 1v16.5c0 0.8 0.7 1.5 1.5 1.5h3c0.8 0 1.5-0.7 1.5-1.5v-16.5c0-0.6 0.4-1 1-1z"></path>
                                </svg>
                              </div>
                            </div>
                          </form>
                        </div>
                      </child>
                      <child class="nds-medium-size_1-of-1 nds-small-size_1-of-1 nds-x-small-size_1-of-1 nds-large-size_12-of-12" aria-hidden="false">
                        <div class="nds-size_1-of-1 ">
                          <form name="loopform" class="nds-form-element nds-m-bottom_large nds-p-around_small">
                            <div class="nds-form-element__control">
                              <label class="nds-checkbox">
                                <input type="checkbox" id="Checkbox1" name="loopname" class="" aria-invalid="false" value="on">
                                <span class="nds-checkbox_faux"></span>
                                <label class="nds-checkbox__label">
                                  <span class="nds-form-element__label nds-form-element__control-help">Checkbox1</span>
                                  <div class="nds-tooltip_container ">
                                    <div class="nds-nonfocused_control nds-inline-help-text ">
                                      <svg aria-hidden="true" class="slds-icon slds-icon--small nds-icon nds-icon_small " xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" icon="'info'" viewBox="0 0 52 52" alt="info">
                                        <path fill="inherit" xmlns="http://www.w3.org/2000/svg" d="m26 2c-13.3 0-24 10.7-24 24s10.7 24 24 24 24-10.7 24-24-10.7-24-24-24z m0 12.1c1.7 0 3 1.3 3 3s-1.3 3-3 3-3-1.3-3-3 1.3-3 3-3z m5 21c0 0.5-0.4 0.9-1 0.9h-8c-0.5 0-1-0.3-1-0.9v-2c0-0.5 0.4-1.1 1-1.1 0.5 0 1-0.3 1-0.9v-4c0-0.5-0.4-1.1-1-1.1-0.5 0-1-0.3-1-0.9v-2c0-0.5 0.4-1.1 1-1.1h6c0.5 0 1 0.5 1 1.1v8c0 0.5 0.4 0.9 1 0.9 0.5 0 1 0.5 1 1.1v2z"></path>
                                      </svg>
                                      <div class="nds-is-absolute">
                                        <div class="nds-popover nds-popover_tooltip nds-nubbin_bottom-right" role="tooltip">
                                          <div class="nds-popover__body">Check It out</div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div class="nds-control-action__container">
                                    <svg aria-hidden="true" class="nds-button__icon nds-button__icon_medium " xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" icon="'add'" role="button" aria-disabled="false"
                                      viewBox="0 0 52 52" alt="add">
                                      <path fill="inherit" xmlns="http://www.w3.org/2000/svg" d="m30 29h16.5c0.8 0 1.5-0.7 1.5-1.5v-3c0-0.8-0.7-1.5-1.5-1.5h-16.5c-0.6 0-1-0.4-1-1v-16.5c0-0.8-0.7-1.5-1.5-1.5h-3c-0.8 0-1.5 0.7-1.5 1.5v16.5c0 0.6-0.4 1-1 1h-16.5c-0.8 0-1.5 0.7-1.5 1.5v3c0 0.8 0.7 1.5 1.5 1.5h16.5c0.6 0 1 0.4 1 1v16.5c0 0.8 0.7 1.5 1.5 1.5h3c0.8 0 1.5-0.7 1.5-1.5v-16.5c0-0.6 0.4-1 1-1z"></path>
                                    </svg>
                                  </div>
                                </label>
                              </label>
                            </div>
                          </form>
                        </div>
                      </child>
                      <child class="nds-medium-size_1-of-1 nds-small-size_1-of-1 nds-x-small-size_1-of-1 nds-large-size_12-of-12" aria-hidden="false">
                        <div class="nds-size_1-of-1 ">
                          <form name="loopform" class="nds-form-element nds-size_1-of-1 nds-m-bottom_large nds-p-around_small">
                            <div class="nds-form-element__control nds-form-element__control-animated-label nds-input-has-icon_right nds-grid">
                              <span class="nds-form-element__addon ">¥</span>
                              <input type="text" id="Aggregate1" name="loopname" class="nds-input " disabled="" aria-invalid="false">
                              <label class="nds-form-element__label nds-p-left_large">Aggregate1</label>
                              <div class="nds-control-action__container"></div>
                            </div>
                          </form>
                        </div>
                      </child>
                      <child class="nds-medium-size_1-of-1 nds-small-size_1-of-1 nds-x-small-size_1-of-1 nds-large-size_12-of-12" aria-hidden="false">
                        <div class="nds-size_1-of-1 ">
                          <form name="loopform" class="nds-form-element nds-size_1-of-1 nds-m-bottom_large nds-p-around_small">
                            <div class="nds-form-element__control nds-form-element__control-animated-label nds-input-has-icon_right nds-grid">
                              <span class="nds-form-element__addon ">¥</span>
                              <input type="text" id="Formula1" name="loopname" class="nds-input " disabled="" aria-invalid="false">
                              <label class="nds-form-element__label nds-p-left_large">Formula1</label>
                              <div class="nds-control-action__container"></div>
                            </div>
                          </form>
                        </div>
                      </child>
                      <child class="nds-medium-size_1-of-1 nds-small-size_1-of-1 nds-x-small-size_1-of-1 nds-large-size_12-of-12" aria-hidden="false">
                        <div class="nds-size_1-of-1 ">
                          <form name="loopform" class="nds-form-element nds-size_1-of-1 nds-m-bottom_large nds-p-around_small nds-input__tooltip ">
                            <div class="nds-form-element__control nds-form-element__control-animated-label nds-input-has-icon nds-input-has-icon_right nds-grid" data-content="">
                              <span class="nds-form-element__addon">¥</span>
                              <div class="nds-cont-wrapper">
                                <input type="tel" min="::control.propSetMap.min" max="::control.propSetMap.max" id="Currency7" name="loopname" class="nds-input" aria-invalid="false">
                                <label class="nds-form-element__label">Currency7</label>
                              </div>
                              <svg aria-hidden="true" class="slds-icon slds-icon--small nds-icon nds-icon_small " xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" icon="'moneybag'" viewBox="0 0 52 52" alt="moneybag">
                                <path fill="inherit" xmlns="http://www.w3.org/2000/svg" d="m20.5 9.1c0.2 0.6 0.8 0.9 1.4 0.9h8.1c0.6 0 1.2-0.3 1.4-0.9l3.2-5.9c0.2-0.6-0.2-1.2-0.8-1.2h-15.6c-0.6 0-1 0.6-0.7 1.1l3 6z m10.2 5.6h-9.4c-7.9 0-14.3 6.5-14.3 14.5v16c0 2.6 2.1 4.8 4.8 4.8h28.4c2.6 0 4.8-2.2 4.8-4.8v-16c0-8-6.5-14.5-14.3-14.5z m-2.3 27v2.7c0 0.5-0.5 0.8-1 0.8h-3.2c-0.5 0-0.6-0.3-0.6-0.8v-2.6c-2.4-0.5-4.4-1.5-4.9-2-0.6-0.6-0.8-1.1-0.3-1.8l1-1.6c0.2-0.4 0.7-0.6 1.2-0.6 0.3 0 0.6 0.1 0.8 0.2h0.1c1.6 1 3 1.4 4 1.4 1.1 0 2-0.6 2-1.2 0-0.5-0.3-1.3-3.3-2.3-2.7-1-6-2.6-6-6.3 0-2.2 1.4-4.7 5.4-5.5v-2.4c0-0.5 0.2-0.8 0.6-0.8h3.2c0.5 0 1 0.3 1 0.8v2.3c1.6 0.4 3.3 1.2 3.9 1.6 0.3 0.2 0.5 0.6 0.6 1 0.1 0.4-0.1 0.8-0.3 1l-1.4 1.4c-0.3 0.4-0.9 0.7-1.3 0.7-0.2 0-0.5-0.1-0.7-0.2-1.6-0.9-2.9-1.4-3.8-1.4-1.3 0-1.9 0.6-1.9 1 0 0.6 0.3 1.2 3 2.2 3.3 1.1 7 2.9 7 6.7 0.1 2.6-2 4.9-5.1 5.7z"></path>
                              </svg>
                              <div class="nds-control-action__container">
                                <svg aria-hidden="true" class="nds-button__icon nds-button__icon_medium " xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" icon="'add'" role="button" aria-disabled="false"
                                  viewBox="0 0 52 52" alt="add">
                                  <path fill="inherit" xmlns="http://www.w3.org/2000/svg" d="m30 29h16.5c0.8 0 1.5-0.7 1.5-1.5v-3c0-0.8-0.7-1.5-1.5-1.5h-16.5c-0.6 0-1-0.4-1-1v-16.5c0-0.8-0.7-1.5-1.5-1.5h-3c-0.8 0-1.5 0.7-1.5 1.5v16.5c0 0.6-0.4 1-1 1h-16.5c-0.8 0-1.5 0.7-1.5 1.5v3c0 0.8 0.7 1.5 1.5 1.5h16.5c0.6 0 1 0.4 1 1v16.5c0 0.8 0.7 1.5 1.5 1.5h3c0.8 0 1.5-0.7 1.5-1.5v-16.5c0-0.6 0.4-1 1-1z"></path>
                                </svg>
                              </div>
                            </div>
                          </form>
                        </div>
                      </child>
                      <child class="nds-medium-size_1-of-1 nds-small-size_1-of-1 nds-x-small-size_1-of-1 nds-large-size_12-of-12" aria-hidden="false">
                        <div class="nds-size_1-of-1 ">
                          <form name="loopform" class="nds-form-element nds-size_1-of-1 nds-m-bottom_large nds-p-around_small nds-rich-text-editor__output " id="Headline1">
                            <div class="nds-form-element__control">
                              <h1 >
                                <p>Headline1 : </p>
                              </h1>
                            </div>
                          </form>
                        </div>
                      </child>
                      <child class="nds-medium-size_1-of-1 nds-small-size_1-of-1 nds-x-small-size_1-of-1 nds-large-size_12-of-12" aria-hidden="false">
                        <div class="nds-size_1-of-1 ">
                          <form name="loopform" class="nds-form-element nds-size_1-of-1 nds-m-bottom_large nds-p-around_small nds-rich-text-editor__output " id="TextBlock1">
                            <div class="nds-form-element__control">
                              <p>
                                <p>TextBlock : </p>
                              </p>
                            </div>
                          </form>
                        </div>
                      </child>
                      <child class="nds-medium-size_1-of-1 nds-small-size_1-of-1 nds-x-small-size_1-of-1 nds-large-size_12-of-12" aria-hidden="false">
                        <div class="nds-size_1-of-1 ">
                          <form name="loopform" class="nds-form-element nds-size_1-of-1 nds-m-bottom_large nds-p-around_small nds-input__tooltip ">
                            <div class="nds-form-element__control nds-form-element__control-animated-label nds-input-has-icon nds-input-has-icon_right nds-grid" data-content="">
                              <span class="nds-form-element__addon">¥</span>
                              <div class="nds-cont-wrapper">
                                <input type="tel" min="::control.propSetMap.min" max="::control.propSetMap.max" id="Currency8" name="loopname" class="nds-input" aria-invalid="false">
                                <label class="nds-form-element__label">Currency8</label>
                              </div>
                              <svg aria-hidden="true" class="slds-icon slds-icon--small nds-icon nds-icon_small " xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" icon="'moneybag'" viewBox="0 0 52 52" alt="moneybag">
                                <path fill="inherit" xmlns="http://www.w3.org/2000/svg" d="m20.5 9.1c0.2 0.6 0.8 0.9 1.4 0.9h8.1c0.6 0 1.2-0.3 1.4-0.9l3.2-5.9c0.2-0.6-0.2-1.2-0.8-1.2h-15.6c-0.6 0-1 0.6-0.7 1.1l3 6z m10.2 5.6h-9.4c-7.9 0-14.3 6.5-14.3 14.5v16c0 2.6 2.1 4.8 4.8 4.8h28.4c2.6 0 4.8-2.2 4.8-4.8v-16c0-8-6.5-14.5-14.3-14.5z m-2.3 27v2.7c0 0.5-0.5 0.8-1 0.8h-3.2c-0.5 0-0.6-0.3-0.6-0.8v-2.6c-2.4-0.5-4.4-1.5-4.9-2-0.6-0.6-0.8-1.1-0.3-1.8l1-1.6c0.2-0.4 0.7-0.6 1.2-0.6 0.3 0 0.6 0.1 0.8 0.2h0.1c1.6 1 3 1.4 4 1.4 1.1 0 2-0.6 2-1.2 0-0.5-0.3-1.3-3.3-2.3-2.7-1-6-2.6-6-6.3 0-2.2 1.4-4.7 5.4-5.5v-2.4c0-0.5 0.2-0.8 0.6-0.8h3.2c0.5 0 1 0.3 1 0.8v2.3c1.6 0.4 3.3 1.2 3.9 1.6 0.3 0.2 0.5 0.6 0.6 1 0.1 0.4-0.1 0.8-0.3 1l-1.4 1.4c-0.3 0.4-0.9 0.7-1.3 0.7-0.2 0-0.5-0.1-0.7-0.2-1.6-0.9-2.9-1.4-3.8-1.4-1.3 0-1.9 0.6-1.9 1 0 0.6 0.3 1.2 3 2.2 3.3 1.1 7 2.9 7 6.7 0.1 2.6-2 4.9-5.1 5.7z"></path>
                              </svg>
                              <div class="nds-control-action__container">
                                <svg aria-hidden="true" class="nds-button__icon nds-button__icon_medium " xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" icon="'add'" role="button" aria-disabled="false"
                                  viewBox="0 0 52 52" alt="add">
                                  <path fill="inherit" xmlns="http://www.w3.org/2000/svg" d="m30 29h16.5c0.8 0 1.5-0.7 1.5-1.5v-3c0-0.8-0.7-1.5-1.5-1.5h-16.5c-0.6 0-1-0.4-1-1v-16.5c0-0.8-0.7-1.5-1.5-1.5h-3c-0.8 0-1.5 0.7-1.5 1.5v16.5c0 0.6-0.4 1-1 1h-16.5c-0.8 0-1.5 0.7-1.5 1.5v3c0 0.8 0.7 1.5 1.5 1.5h16.5c0.6 0 1 0.4 1 1v16.5c0 0.8 0.7 1.5 1.5 1.5h3c0.8 0 1.5-0.7 1.5-1.5v-16.5c0-0.6 0.4-1 1-1z"></path>
                                </svg>
                              </div>
                            </div>
                          </form>
                        </div>
                      </child>
                      <child class="nds-medium-size_1-of-1 nds-small-size_1-of-1 nds-x-small-size_1-of-1 nds-large-size_6-of-12" aria-hidden="false">
                        <div class="nds-size_1-of-1 ">
                          <form name="loopform" class="nds-form-element nds-size_1-of-1 nds-m-bottom_large nds-p-around_small nds-input__tooltip ">
                            <div class="nds-form-element__control nds-form-element__control-animated-label nds-input-has-icon nds-input-has-icon_right nds-grid" data-content="">
                              <span class="nds-form-element__addon">¥</span>
                              <div class="nds-cont-wrapper">
                                <input type="tel" min="::control.propSetMap.min" max="::control.propSetMap.max" id="Currency1" name="loopname" class="nds-input " aria-invalid="false">
                                <label class="nds-form-element__label">Currency1</label>
                              </div>
                              <svg aria-hidden="true" class="slds-icon slds-icon--small nds-icon nds-icon_small " xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" icon="'moneybag'" viewBox="0 0 52 52" alt="moneybag">
                                <path fill="inherit" xmlns="http://www.w3.org/2000/svg" d="m20.5 9.1c0.2 0.6 0.8 0.9 1.4 0.9h8.1c0.6 0 1.2-0.3 1.4-0.9l3.2-5.9c0.2-0.6-0.2-1.2-0.8-1.2h-15.6c-0.6 0-1 0.6-0.7 1.1l3 6z m10.2 5.6h-9.4c-7.9 0-14.3 6.5-14.3 14.5v16c0 2.6 2.1 4.8 4.8 4.8h28.4c2.6 0 4.8-2.2 4.8-4.8v-16c0-8-6.5-14.5-14.3-14.5z m-2.3 27v2.7c0 0.5-0.5 0.8-1 0.8h-3.2c-0.5 0-0.6-0.3-0.6-0.8v-2.6c-2.4-0.5-4.4-1.5-4.9-2-0.6-0.6-0.8-1.1-0.3-1.8l1-1.6c0.2-0.4 0.7-0.6 1.2-0.6 0.3 0 0.6 0.1 0.8 0.2h0.1c1.6 1 3 1.4 4 1.4 1.1 0 2-0.6 2-1.2 0-0.5-0.3-1.3-3.3-2.3-2.7-1-6-2.6-6-6.3 0-2.2 1.4-4.7 5.4-5.5v-2.4c0-0.5 0.2-0.8 0.6-0.8h3.2c0.5 0 1 0.3 1 0.8v2.3c1.6 0.4 3.3 1.2 3.9 1.6 0.3 0.2 0.5 0.6 0.6 1 0.1 0.4-0.1 0.8-0.3 1l-1.4 1.4c-0.3 0.4-0.9 0.7-1.3 0.7-0.2 0-0.5-0.1-0.7-0.2-1.6-0.9-2.9-1.4-3.8-1.4-1.3 0-1.9 0.6-1.9 1 0 0.6 0.3 1.2 3 2.2 3.3 1.1 7 2.9 7 6.7 0.1 2.6-2 4.9-5.1 5.7z"></path>
                              </svg>
                              <div class="nds-control-action__container">
                                <svg aria-hidden="true" class="nds-button__icon nds-button__icon_medium " xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" icon="'add'" role="button" aria-disabled="false"
                                  viewBox="0 0 52 52" alt="add">
                                  <path fill="inherit" xmlns="http://www.w3.org/2000/svg" d="m30 29h16.5c0.8 0 1.5-0.7 1.5-1.5v-3c0-0.8-0.7-1.5-1.5-1.5h-16.5c-0.6 0-1-0.4-1-1v-16.5c0-0.8-0.7-1.5-1.5-1.5h-3c-0.8 0-1.5 0.7-1.5 1.5v16.5c0 0.6-0.4 1-1 1h-16.5c-0.8 0-1.5 0.7-1.5 1.5v3c0 0.8 0.7 1.5 1.5 1.5h16.5c0.6 0 1 0.4 1 1v16.5c0 0.8 0.7 1.5 1.5 1.5h3c0.8 0 1.5-0.7 1.5-1.5v-16.5c0-0.6 0.4-1 1-1z"></path>
                                </svg>
                              </div>
                            </div>
                            <div class="nds-form-element__control-help ">Enter an Amount</div>
                          </form>
                        </div>
                      </child>
                      <child class="nds-medium-size_1-of-1 nds-small-size_1-of-1 nds-x-small-size_1-of-1 nds-large-size_6-of-12" aria-hidden="false">
                        <div class="nds-size_1-of-1 ">
                          <form name="loopform" class="nds-form-element nds-m-bottom_large nds-p-around_small nds-input__tooltip ">
                            <div class="nds-grid nds-form--multi-input__container">
                              <div class="nds-form-element__control nds-form-element__control-animated-label nds-size_2-of-3 nds-p-right_small">
                                <input type="text" id="Date/Time1" name="loopname" class="nds-input " data-date-format="MM-dd-yyyy" data-max-date="" data-min-date="" aria-invalid="false">
                                <label class="nds-form-element__label">Date/Time1</label>
                              </div>
                              <div class="nds-form-element__control nds-form-element__control-animated-label" style="width: 100%;">
                                <input type="text" class="nds-input " name="timectrl" data-time-format="hh:mm a" data-default-date="today" aria-invalid="false">
                              </div>
                              <div class="nds-control-action__container">
                                <svg aria-hidden="true" class="nds-button__icon nds-button__icon_medium " xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" icon="'add'" role="button" aria-disabled="false"
                                  viewBox="0 0 52 52" alt="add">
                                  <path fill="inherit" xmlns="http://www.w3.org/2000/svg" d="m30 29h16.5c0.8 0 1.5-0.7 1.5-1.5v-3c0-0.8-0.7-1.5-1.5-1.5h-16.5c-0.6 0-1-0.4-1-1v-16.5c0-0.8-0.7-1.5-1.5-1.5h-3c-0.8 0-1.5 0.7-1.5 1.5v16.5c0 0.6-0.4 1-1 1h-16.5c-0.8 0-1.5 0.7-1.5 1.5v3c0 0.8 0.7 1.5 1.5 1.5h16.5c0.6 0 1 0.4 1 1v16.5c0 0.8 0.7 1.5 1.5 1.5h3c0.8 0 1.5-0.7 1.5-1.5v-16.5c0-0.6 0.4-1 1-1z"></path>
                                </svg>
                              </div>
                            </div>
                            <div class="nds-form-element__control-help ">Pick a Date/Time</div>
                          </form>
                        </div>
                      </child>
                      <child class="nds-medium-size_1-of-1 nds-small-size_1-of-1 nds-x-small-size_1-of-1 nds-large-size_12-of-12" aria-hidden="false">
                        <div class="nds-size_1-of-1 ">
                          <form name="loopform" class="nds-form-element nds-size_1-of-1 nds-m-bottom_large nds-p-around_small ">
                            <div class="nds-form-element__control">
                              <div>
                                <div class="nds-form-element__label nds-m-bottom_x-small">Disclosure1</div>
                                <div class="nds-box">
                                  <p>
                                    <p>This is Disclosure element</p>
                                  </p>
                                </div>
                                <div class="nds-m-top_x-small">
                                  <label class="nds-checkbox">
                                    <input type="checkbox" id="Disclosure1" name="loopname" class="" aria-invalid="false" value="on">
                                    <span class="nds-checkbox_faux"></span>
                                    <span class="nds-form-element__label">Disclosure1</span>
                                  </label>
                                </div>
                              </div>
                            </div>
                          </form>
                        </div>
                      </child>
                      <child class="nds-medium-size_1-of-1 nds-small-size_1-of-1 nds-x-small-size_1-of-1 nds-large-size_12-of-12" aria-hidden="false">
                        <div class="nds-size_1-of-1 ">
                          <form name="loopform" class="nds-form-element nds-m-bottom_large nds-p-around_small nds-input__tooltip ">
                            <div class="nds-form-element__control nds-form-element__control-animated-label nds-grid">
                              <input type="email" id="Email1" class="nds-input form-control " name="loopname" aria-invalid="false">
                              <label class="nds-form-element__label">Email1</label>
                              <div class="nds-control-action__container">
                                <svg aria-hidden="true" class="nds-button__icon nds-button__icon_medium " xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" icon="'add'" role="button" aria-disabled="false"
                                  viewBox="0 0 52 52" alt="add">
                                  <path fill="inherit" xmlns="http://www.w3.org/2000/svg" d="m30 29h16.5c0.8 0 1.5-0.7 1.5-1.5v-3c0-0.8-0.7-1.5-1.5-1.5h-16.5c-0.6 0-1-0.4-1-1v-16.5c0-0.8-0.7-1.5-1.5-1.5h-3c-0.8 0-1.5 0.7-1.5 1.5v16.5c0 0.6-0.4 1-1 1h-16.5c-0.8 0-1.5 0.7-1.5 1.5v3c0 0.8 0.7 1.5 1.5 1.5h16.5c0.6 0 1 0.4 1 1v16.5c0 0.8 0.7 1.5 1.5 1.5h3c0.8 0 1.5-0.7 1.5-1.5v-16.5c0-0.6 0.4-1 1-1z"></path>
                                </svg>
                              </div>
                            </div>
                            <div class="nds-form-element__control-help ">Enter an Email</div>
                          </form>
                        </div>
                      </child>
                      <child class="nds-medium-size_1-of-1 nds-small-size_1-of-1 nds-x-small-size_1-of-1 nds-large-size_6-of-12" aria-hidden="false">
                        <div class="nds-size_1-of-1 ">
                          <form name="loopform" class="nds-form-element nds-m-bottom_large nds-p-around_small ">
                            <div class="nds-form-element__control nds-grid">
                              <div class="nds-file-selector nds-file-custom-selector nds-file-selector_files">
                                <div class="nds-file-selector__dropzone">
                                  <input type="file" id="File1" name="loopname" class="nds-input nds-file-selector__input" aria-invalid="false">
                                  <label class="nds-file-selector__body nds-form-element__control-help">
                                    <span class="nds-file-selector__button nds-button nds-button_neutral">File1</span>
                                    <span class="nds-file-icon">
                                      <svg aria-hidden="true" class="nds-button__icon slds-icon slds-icon--large nds-icon nds-icon_large " xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" icon="'attach'" viewBox="0 0 52 52" alt="attach">
                                        <path fill="inherit" xmlns="http://www.w3.org/2000/svg" d="m17.6 36.7c0.6 0.6 1.5 0.5 2.1 0l10-10c0.7-0.7 1.9-0.8 2.8 0 0.9 0.8 0.8 2.2 0 3l-12.3 12.1c-2.7 2.7-7.2 2.7-9.9 0l-0.1-0.1c-2.7-2.7-2.7-7.2 0-9.9l21.7-21.7c2.7-2.7 7.2-2.7 9.9 0l0.1 0.1c2.7 2.7 2.7 7.2 0 9.9l-0.1 0.1c-0.5 0.5-0.6 1.2-0.2 1.8 0.6 1.1 1.1 2.3 1.4 3.5 0.2 0.8 1.1 1 1.7 0.5 0.8-0.8 1.5-1.6 1.5-1.6 5.1-5.1 5.1-13.4 0-18.5h-0.2c-5.1-5.1-13.4-5.1-18.5 0l-21.7 21.6c-5.1 5.1-5.1 13.4 0 18.5l0.2 0.2c5.1 5.1 13.3 5.1 18.4 0l12.4-12.3c3.2-3.2 3.1-8.4-0.2-11.6-3.2-3.1-8.4-2.9-11.5 0.3l-9.8 9.8c-0.6 0.6-0.6 1.6 0 2.2l2.3 2.1z"></path>
                                      </svg>
                                    </span>
                                  </label>
                                </div>
                              </div>
                              <div class="nds-tooltip_container ">
                                <div class="nds-nonfocused_control nds-inline-help-text ">
                                  <svg aria-hidden="true" class="slds-icon slds-icon--small nds-icon nds-icon_small " xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" icon="'info'" viewBox="0 0 52 52" alt="info">
                                    <path fill="inherit" xmlns="http://www.w3.org/2000/svg" d="m26 2c-13.3 0-24 10.7-24 24s10.7 24 24 24 24-10.7 24-24-10.7-24-24-24z m0 12.1c1.7 0 3 1.3 3 3s-1.3 3-3 3-3-1.3-3-3 1.3-3 3-3z m5 21c0 0.5-0.4 0.9-1 0.9h-8c-0.5 0-1-0.3-1-0.9v-2c0-0.5 0.4-1.1 1-1.1 0.5 0 1-0.3 1-0.9v-4c0-0.5-0.4-1.1-1-1.1-0.5 0-1-0.3-1-0.9v-2c0-0.5 0.4-1.1 1-1.1h6c0.5 0 1 0.5 1 1.1v8c0 0.5 0.4 0.9 1 0.9 0.5 0 1 0.5 1 1.1v2z"></path>
                                  </svg>
                                  <div class="nds-is-absolute">
                                    <div class="nds-popover nds-popover_tooltip nds-nubbin_bottom-right" role="tooltip">
                                      <div class="nds-popover__body">Upload a file</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </form>
                        </div>
                      </child>
                      <child class="nds-medium-size_1-of-1 nds-small-size_1-of-1 nds-x-small-size_1-of-1 nds-large-size_6-of-12" aria-hidden="false">
                        <div class="nds-size_1-of-1 ">
                          <form name="loopform" class="nds-form-element nds-m-bottom_large nds-p-around_small ">
                            <div class="nds-form-element__control nds-grid">
                              <div class="nds-file-selector nds-file-custom-selector nds-file-selector_files nds-file__image">
                                <div class="nds-file-selector__dropzone">
                                  <input type="file" id="Image1" name="loopname" class="nds-file-selector__input" accept="image/*" aria-invalid="false">
                                  <label class="nds-file-selector__body nds-form-element__control-help">
                                    <span class="nds-file-selector__button nds-button nds-button_neutral">Image1</span>
                                    <span class="nds-file-icon">
                                      <svg aria-hidden="true" class="nds-button__icon slds-icon slds-icon--large nds-icon nds-icon_large " xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" icon="'attach'" viewBox="0 0 52 52" alt="attach">
                                        <path fill="inherit" xmlns="http://www.w3.org/2000/svg" d="m17.6 36.7c0.6 0.6 1.5 0.5 2.1 0l10-10c0.7-0.7 1.9-0.8 2.8 0 0.9 0.8 0.8 2.2 0 3l-12.3 12.1c-2.7 2.7-7.2 2.7-9.9 0l-0.1-0.1c-2.7-2.7-2.7-7.2 0-9.9l21.7-21.7c2.7-2.7 7.2-2.7 9.9 0l0.1 0.1c2.7 2.7 2.7 7.2 0 9.9l-0.1 0.1c-0.5 0.5-0.6 1.2-0.2 1.8 0.6 1.1 1.1 2.3 1.4 3.5 0.2 0.8 1.1 1 1.7 0.5 0.8-0.8 1.5-1.6 1.5-1.6 5.1-5.1 5.1-13.4 0-18.5h-0.2c-5.1-5.1-13.4-5.1-18.5 0l-21.7 21.6c-5.1 5.1-5.1 13.4 0 18.5l0.2 0.2c5.1 5.1 13.3 5.1 18.4 0l12.4-12.3c3.2-3.2 3.1-8.4-0.2-11.6-3.2-3.1-8.4-2.9-11.5 0.3l-9.8 9.8c-0.6 0.6-0.6 1.6 0 2.2l2.3 2.1z"></path>
                                      </svg>
                                    </span>
                                  </label>
                                </div>
                              </div>
                              <div class="nds-tooltip_container ">
                                <div class="nds-nonfocused_control nds-inline-help-text ">
                                  <svg aria-hidden="true" class="slds-icon slds-icon--small nds-icon nds-icon_small " xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" icon="'info'" viewBox="0 0 52 52" alt="info">
                                    <path fill="inherit" xmlns="http://www.w3.org/2000/svg" d="m26 2c-13.3 0-24 10.7-24 24s10.7 24 24 24 24-10.7 24-24-10.7-24-24-24z m0 12.1c1.7 0 3 1.3 3 3s-1.3 3-3 3-3-1.3-3-3 1.3-3 3-3z m5 21c0 0.5-0.4 0.9-1 0.9h-8c-0.5 0-1-0.3-1-0.9v-2c0-0.5 0.4-1.1 1-1.1 0.5 0 1-0.3 1-0.9v-4c0-0.5-0.4-1.1-1-1.1-0.5 0-1-0.3-1-0.9v-2c0-0.5 0.4-1.1 1-1.1h6c0.5 0 1 0.5 1 1.1v8c0 0.5 0.4 0.9 1 0.9 0.5 0 1 0.5 1 1.1v2z"></path>
                                  </svg>
                                  <div class="nds-is-absolute">
                                    <div class="nds-popover nds-popover_tooltip nds-nubbin_bottom-right" role="tooltip">
                                      <div class="nds-popover__body">Upload an Image</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </form>
                        </div>
                      </child>
                      <child class="nds-medium-size_1-of-1 nds-small-size_1-of-1 nds-x-small-size_1-of-1 nds-large-size_12-of-12" aria-hidden="false">
                        <div class="nds-size_1-of-1 ">
                          <form name="loopform" class="nds-form-element nds-m-bottom_large nds-p-around_small" id="Multi-select1|0" aria-required="false">
                            <fieldset class="nds-form-element">
                              <legend class="nds-form-element__legend nds-form-element__label">
                                <span>Multi-select1</span>
                                <div class="nds-tooltip_container ">
                                  <div class="nds-nonfocused_control nds-inline-help-text ">
                                    <svg aria-hidden="true" class="slds-icon slds-icon--small nds-icon nds-icon_small " xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" icon="'info'" viewBox="0 0 52 52" alt="info">
                                      <path fill="inherit" xmlns="http://www.w3.org/2000/svg" d="m26 2c-13.3 0-24 10.7-24 24s10.7 24 24 24 24-10.7 24-24-10.7-24-24-24z m0 12.1c1.7 0 3 1.3 3 3s-1.3 3-3 3-3-1.3-3-3 1.3-3 3-3z m5 21c0 0.5-0.4 0.9-1 0.9h-8c-0.5 0-1-0.3-1-0.9v-2c0-0.5 0.4-1.1 1-1.1 0.5 0 1-0.3 1-0.9v-4c0-0.5-0.4-1.1-1-1.1-0.5 0-1-0.3-1-0.9v-2c0-0.5 0.4-1.1 1-1.1h6c0.5 0 1 0.5 1 1.1v8c0 0.5 0.4 0.9 1 0.9 0.5 0 1 0.5 1 1.1v2z"></path>
                                    </svg>
                                    <div class="nds-is-absolute">
                                      <div class="nds-popover nds-popover_tooltip nds-nubbin_bottom-right" role="tooltip">
                                        <div class="nds-popover__body">Pick a Value from Multi-select</div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div class="nds-control-action__container">
                                  <svg aria-hidden="true" class="nds-button__icon nds-button__icon_medium " xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" icon="'add'" role="button" aria-disabled="false"
                                    viewBox="0 0 52 52" alt="add">
                                    <path fill="inherit" xmlns="http://www.w3.org/2000/svg" d="m30 29h16.5c0.8 0 1.5-0.7 1.5-1.5v-3c0-0.8-0.7-1.5-1.5-1.5h-16.5c-0.6 0-1-0.4-1-1v-16.5c0-0.8-0.7-1.5-1.5-1.5h-3c-0.8 0-1.5 0.7-1.5 1.5v16.5c0 0.6-0.4 1-1 1h-16.5c-0.8 0-1.5 0.7-1.5 1.5v3c0 0.8 0.7 1.5 1.5 1.5h16.5c0.6 0 1 0.4 1 1v16.5c0 0.8 0.7 1.5 1.5 1.5h3c0.8 0 1.5-0.7 1.5-1.5v-16.5c0-0.6 0.4-1 1-1z"></path>
                                  </svg>
                                </div>
                              </legend>
                              <div class="nds-form-element__control">
                                <div class="nds-checkbox_custom-group nds-clearfix ">
                                  <label class="nds-button nds-checkbox_button nds-checkbox_aspect-ratio " style="width: calc(33.3333% - 1.25rem); padding-top: calc(33.3333% - 1.25rem); margin-bottom: 1rem;">
                                    <input type="checkbox" id="Multi-select1" aria-invalid="false" value="on">
                                    <span class="nds-checkbox_button__label ">
                                      <span class="nds-checkbox_custom-faux nds-title">Uttar Pradesh</span>
                                    </span>
                                  </label>
                                  <label class="nds-button nds-checkbox_button nds-checkbox_aspect-ratio " style="width: calc(33.3333% - 1.25rem); padding-top: calc(33.3333% - 1.25rem); margin-bottom: 1rem;">
                                    <input type="checkbox" id="Multi-select1" aria-invalid="false" value="on">
                                    <span class="nds-checkbox_button__label ">
                                      <span class="nds-checkbox_custom-faux nds-title">Madhya Pradesh</span>
                                    </span>
                                  </label>
                                  <label class="nds-button nds-checkbox_button nds-checkbox_aspect-ratio " style="width: calc(33.3333% - 1.25rem); padding-top: calc(33.3333% - 1.25rem); margin-bottom: 1rem;">
                                    <input type="checkbox" id="Multi-select1" aria-invalid="false" value="on">
                                    <span class="nds-checkbox_button__label ">
                                      <span class="nds-checkbox_custom-faux nds-title">Maharastra</span>
                                    </span>
                                  </label>
                                </div>
                              </div>
                            </fieldset>
                            <div class="nds-has-error nds-grid">
                              <div aria-hidden="false"></div>
                            </div>
                          </form>
                        </div>
                      </child>
                      <child class="nds-medium-size_1-of-1 nds-small-size_1-of-1 nds-x-small-size_1-of-1 nds-large-size_12-of-12" aria-hidden="false">
                        <div class="nds-size_1-of-1 ">
                          <form name="loopform" class="nds-form-element nds-size_1-of-1 nds-m-bottom_large nds-p-around_small nds-input__tooltip">
                            <div class="nds-form-element__control nds-form-element__control-animated-label nds-grid">
                              <input type="password" id="Password1" name="loopname" class="nds-input form-control " aria-invalid="false">
                              <label class="nds-form-element__label">Password1</label>
                              <div class="nds-control-action__container">
                                <svg aria-hidden="true" class="nds-button__icon nds-button__icon_medium " xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" icon="'add'" role="button" aria-disabled="false"
                                  viewBox="0 0 52 52" alt="add">
                                  <path fill="inherit" xmlns="http://www.w3.org/2000/svg" d="m30 29h16.5c0.8 0 1.5-0.7 1.5-1.5v-3c0-0.8-0.7-1.5-1.5-1.5h-16.5c-0.6 0-1-0.4-1-1v-16.5c0-0.8-0.7-1.5-1.5-1.5h-3c-0.8 0-1.5 0.7-1.5 1.5v16.5c0 0.6-0.4 1-1 1h-16.5c-0.8 0-1.5 0.7-1.5 1.5v3c0 0.8 0.7 1.5 1.5 1.5h16.5c0.6 0 1 0.4 1 1v16.5c0 0.8 0.7 1.5 1.5 1.5h3c0.8 0 1.5-0.7 1.5-1.5v-16.5c0-0.6 0.4-1 1-1z"></path>
                                </svg>
                              </div>
                            </div>
                            <div class="nds-form-element__control-help ">Enter a secured Password</div>
                          </form>
                        </div>
                      </child>
                      <child class="nds-medium-size_1-of-1 nds-small-size_1-of-1 nds-x-small-size_1-of-1 nds-large-size_12-of-12" aria-hidden="false">
                        <div class="nds-size_1-of-1 ">
                          <form name="loopform" class="nds-form-element nds-m-bottom_large nds-p-around_small nds-input__tooltip ">
                            <div class="nds-form-element__control nds-form-element__control-animated-label nds-grid">
                              <input type="tel" id="Number1" name="loopname" class="nds-input form-control " aria-invalid="false">
                              <label class="nds-form-element__label">Number1</label>
                              <div class="nds-control-action__container">
                                <svg aria-hidden="true" class="nds-button__icon nds-button__icon_medium " xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" icon="'add'" role="button" aria-disabled="false"
                                  viewBox="0 0 52 52" alt="add">
                                  <path fill="inherit" xmlns="http://www.w3.org/2000/svg" d="m30 29h16.5c0.8 0 1.5-0.7 1.5-1.5v-3c0-0.8-0.7-1.5-1.5-1.5h-16.5c-0.6 0-1-0.4-1-1v-16.5c0-0.8-0.7-1.5-1.5-1.5h-3c-0.8 0-1.5 0.7-1.5 1.5v16.5c0 0.6-0.4 1-1 1h-16.5c-0.8 0-1.5 0.7-1.5 1.5v3c0 0.8 0.7 1.5 1.5 1.5h16.5c0.6 0 1 0.4 1 1v16.5c0 0.8 0.7 1.5 1.5 1.5h3c0.8 0 1.5-0.7 1.5-1.5v-16.5c0-0.6 0.4-1 1-1z"></path>
                                </svg>
                              </div>
                            </div>
                            <div class="nds-form-element__control-help ">This is a Number Field</div>
                          </form>
                        </div>
                      </child>
                      <child class="nds-medium-size_1-of-1 nds-small-size_1-of-1 nds-x-small-size_1-of-1 nds-large-size_12-of-12" aria-hidden="false">
                        <div class="nds-size_1-of-1 ">
                          <form name="loopform" id="Radio1|0" class="nds-form-element nds-m-bottom_large nds-p-around_small ">
                            <fieldset class="nds-form-element">
                              <legend class="nds-form-element__legend nds-form-element__label nds-form-element__control-help">
                                <span>Radio1</span>
                                <div class="nds-tooltip_container ">
                                  <div class="nds-nonfocused_control nds-inline-help-text ">
                                    <svg aria-hidden="true" class="slds-icon slds-icon--small nds-icon nds-icon_small " xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" icon="'info'" viewBox="0 0 52 52" alt="info">
                                      <path fill="inherit" xmlns="http://www.w3.org/2000/svg" d="m26 2c-13.3 0-24 10.7-24 24s10.7 24 24 24 24-10.7 24-24-10.7-24-24-24z m0 12.1c1.7 0 3 1.3 3 3s-1.3 3-3 3-3-1.3-3-3 1.3-3 3-3z m5 21c0 0.5-0.4 0.9-1 0.9h-8c-0.5 0-1-0.3-1-0.9v-2c0-0.5 0.4-1.1 1-1.1 0.5 0 1-0.3 1-0.9v-4c0-0.5-0.4-1.1-1-1.1-0.5 0-1-0.3-1-0.9v-2c0-0.5 0.4-1.1 1-1.1h6c0.5 0 1 0.5 1 1.1v8c0 0.5 0.4 0.9 1 0.9 0.5 0 1 0.5 1 1.1v2z"></path>
                                    </svg>
                                    <div class="nds-is-absolute">
                                      <div class="nds-popover nds-popover_tooltip nds-nubbin_bottom-right" role="tooltip">
                                        <div class="nds-popover__body">This is a Radio picklist</div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div class="nds-control-action__container">
                                  <svg aria-hidden="true" class="nds-button__icon nds-button__icon_medium " xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" icon="'add'" role="button" aria-disabled="false"
                                    viewBox="0 0 52 52" alt="add">
                                    <path fill="inherit" xmlns="http://www.w3.org/2000/svg" d="m30 29h16.5c0.8 0 1.5-0.7 1.5-1.5v-3c0-0.8-0.7-1.5-1.5-1.5h-16.5c-0.6 0-1-0.4-1-1v-16.5c0-0.8-0.7-1.5-1.5-1.5h-3c-0.8 0-1.5 0.7-1.5 1.5v16.5c0 0.6-0.4 1-1 1h-16.5c-0.8 0-1.5 0.7-1.5 1.5v3c0 0.8 0.7 1.5 1.5 1.5h16.5c0.6 0 1 0.4 1 1v16.5c0 0.8 0.7 1.5 1.5 1.5h3c0.8 0 1.5-0.7 1.5-1.5v-16.5c0-0.6 0.4-1 1-1z"></path>
                                  </svg>
                                </div>
                              </legend>
                              <div class="nds-form-element__control">
                                <div class="nds-radio_button-group ">
                                  <label class="nds-button nds-radio_button " style="width: 50%;">
                                    <input type="radio" id="Radio1" class="" name="953" value="TV" aria-invalid="false">
                                    <span class="nds-radio_button__label">
                                      <span class="nds-radio_faux">Television</span>
                                      <div class="nds-radio-overlay"></div>
                                    </span>
                                  </label>
                                  <label class="nds-button nds-radio_button " style="width: 50%;">
                                    <input type="radio" id="Radio1" class="" name="956" value="Set" aria-invalid="false">
                                    <span class="nds-radio_button__label">
                                      <span class="nds-radio_faux">Setupbox</span>
                                      <div class="nds-radio-overlay"></div>
                                    </span>
                                  </label>
                                </div>
                              </div>
                            </fieldset>
                          </form>
                        </div>
                      </child>
                      <child class="nds-medium-size_1-of-1 nds-small-size_1-of-1 nds-x-small-size_1-of-1 nds-large-size_12-of-12" aria-hidden="false">
                        <div class="nds-size_1-of-1 ">
                          <form name="loopform" id="Radio7|0" class="nds-form-element nds-m-bottom_large nds-p-around_small ">
                            <fieldset class="nds-form-element">
                              <legend class="nds-form-element__legend nds-form-element__label nds-form-element__control-help">
                                <span>Radio7</span>
                                <a class="nds-tooltip_container " vlc-slds-tool-tip="test" nubbin-direction="auto top-left" tabindex="0" aria-hidden="false">
                                  <div class="nds-nonfocused_control nds-inline-help-text ">
                                    <svg aria-hidden="true" class="slds-icon slds-icon--small nds-icon nds-icon_small " xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" sprite="'utility'" icon="'info'" size="'small'" viewBox="0 0 52 52" alt="info">
                                        <path fill="inherit" xmlns="http://www.w3.org/2000/svg" d="m26 2c-13.3 0-24 10.7-24 24s10.7 24 24 24 24-10.7 24-24-10.7-24-24-24z m0 12.1c1.7 0 3 1.3 3 3s-1.3 3-3 3-3-1.3-3-3 1.3-3 3-3z m5 21c0 0.5-0.4 0.9-1 0.9h-8c-0.5 0-1-0.3-1-0.9v-2c0-0.5 0.4-1.1 1-1.1 0.5 0 1-0.3 1-0.9v-4c0-0.5-0.4-1.1-1-1.1-0.5 0-1-0.3-1-0.9v-2c0-0.5 0.4-1.1 1-1.1h6c0.5 0 1 0.5 1 1.1v8c0 0.5 0.4 0.9 1 0.9 0.5 0 1 0.5 1 1.1v2z"></path>
                                    </svg>
                                  </div>
                                </a>
                                <div class="nds-popover nds-nubbin--bottom-left nds-popover_tooltip vlc-slds--tooltip nds-is-absolute" role="tooltip" style="display: block; visibility: visible; min-width: 85px; top: -50px; left: 38px;">
                                    <div class="nds-popover__body">This is a Radio picklist</div>
                                </div>
                                <div class="nds-control-action__container">
                                  <svg aria-hidden="true" class="nds-button__icon nds-button__icon_medium " xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" icon="'add'" role="button" aria-disabled="false"
                                    viewBox="0 0 52 52" alt="add">
                                    <path fill="inherit" xmlns="http://www.w3.org/2000/svg" d="m30 29h16.5c0.8 0 1.5-0.7 1.5-1.5v-3c0-0.8-0.7-1.5-1.5-1.5h-16.5c-0.6 0-1-0.4-1-1v-16.5c0-0.8-0.7-1.5-1.5-1.5h-3c-0.8 0-1.5 0.7-1.5 1.5v16.5c0 0.6-0.4 1-1 1h-16.5c-0.8 0-1.5 0.7-1.5 1.5v3c0 0.8 0.7 1.5 1.5 1.5h16.5c0.6 0 1 0.4 1 1v16.5c0 0.8 0.7 1.5 1.5 1.5h3c0.8 0 1.5-0.7 1.5-1.5v-16.5c0-0.6 0.4-1 1-1z"></path>
                                  </svg>
                                </div>
                              </legend>
                              <div class="nds-form-element__control">
                                <div class="nds-radio_button-group ">
                                  <label class="nds-button nds-radio_button " style="width: 50%;">
                                    <input type="radio" id="Radio7" name="976" value="TV" aria-invalid="false">
                                    <span class="nds-radio_button__label">
                                      <span class="nds-radio_faux">Television</span>
                                      <div class="nds-radio-overlay"></div>
                                    </span>
                                  </label>
                                  <label class="nds-button nds-radio_button " style="width: 50%;">
                                    <input type="radio" id="Radio7" name="979" value="Set" aria-invalid="false">
                                    <span class="nds-radio_button__label">
                                      <span class="nds-radio_faux">Setupbox</span>
                                      <div class="nds-radio-overlay"></div>
                                    </span>
                                  </label>
                                </div>
                              </div>
                            </fieldset>
                          </form>
                        </div>
                      </child>
                      <child class="nds-medium-size_1-of-1 nds-small-size_1-of-1 nds-x-small-size_1-of-1 nds-large-size_12-of-12" aria-hidden="false">
                        <div class="nds-size--1-of-1 ">
                          <form name="loopform" class="nds-form-element nds-m-bottom_large nds-p-around_small vlc-slds-range-control">
                            <div class="nds-form-element__control nds-m-bottom_medium">
                              <label class="nds-form-element__label">
                              <span class="nds-slider-label">
                                  <span class="nds-slider-label__label">Range1</span>
                                  <a class="nds-tooltip_container " vlc-slds-tool-tip="test" nubbin-direction="auto top-left" tabindex="0" aria-hidden="false">
                                    <div class="nds-nonfocused_control nds-inline-help-text ">
                                      <svg aria-hidden="true" class="slds-icon slds-icon--small nds-icon nds-icon_small " xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" sprite="'utility'" icon="'info'" size="'small'" viewBox="0 0 52 52" alt="info">
                                          <path fill="inherit" xmlns="http://www.w3.org/2000/svg" d="m26 2c-13.3 0-24 10.7-24 24s10.7 24 24 24 24-10.7 24-24-10.7-24-24-24z m0 12.1c1.7 0 3 1.3 3 3s-1.3 3-3 3-3-1.3-3-3 1.3-3 3-3z m5 21c0 0.5-0.4 0.9-1 0.9h-8c-0.5 0-1-0.3-1-0.9v-2c0-0.5 0.4-1.1 1-1.1 0.5 0 1-0.3 1-0.9v-4c0-0.5-0.4-1.1-1-1.1-0.5 0-1-0.3-1-0.9v-2c0-0.5 0.4-1.1 1-1.1h6c0.5 0 1 0.5 1 1.1v8c0 0.5 0.4 0.9 1 0.9 0.5 0 1 0.5 1 1.1v2z"></path>
                                      </svg>
                                    </div>
                                  </a>
                                  <div class="nds-popover nds-nubbin--bottom-left nds-popover_tooltip vlc-slds--tooltip nds-is-absolute" role="tooltip" style="display: block; visibility: visible; min-width: 85px; top: -50px; left: 38px;">
                                      <div class="nds-popover__body">This is a Range slider</div>
                                  </div>
                                  <div class="nds-control-action__container">
                                    <svg aria-hidden="true" class="nds-button__icon nds-button__icon_medium " xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" icon="'add'" role="button" aria-disabled="false"
                                      viewBox="0 0 52 52" alt="add">
                                      <path fill="inherit" xmlns="http://www.w3.org/2000/svg" d="m30 29h16.5c0.8 0 1.5-0.7 1.5-1.5v-3c0-0.8-0.7-1.5-1.5-1.5h-16.5c-0.6 0-1-0.4-1-1v-16.5c0-0.8-0.7-1.5-1.5-1.5h-3c-0.8 0-1.5 0.7-1.5 1.5v16.5c0 0.6-0.4 1-1 1h-16.5c-0.8 0-1.5 0.7-1.5 1.5v3c0 0.8 0.7 1.5 1.5 1.5h16.5c0.6 0 1 0.4 1 1v16.5c0 0.8 0.7 1.5 1.5 1.5h3c0.8 0 1.5-0.7 1.5-1.5v-16.5c0-0.6 0.4-1 1-1z"></path>
                                    </svg>
                                  </div>
                                </span>
                              </label>
                              <div class="vlc-control-wrapper">
                                <div class="nds-form-element__control">
                                  <div class="nds-slider">
                                    <input type="range" step="1" min="5" max="100" id="Range1" name="loopname" class="nds-slider__range">
                                    <span class="nds-slider__value"
                                      aria-hidden="true">20</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </form>
                        </div>
                      </child>
                      <child class="nds-medium-size_1-of-1 nds-small-size_1-of-1 nds-x-small-size_1-of-1 nds-large-size_12-of-12" aria-hidden="false">
                        <div class="nds-size_1-of-1 ">
                          <form name="loopform" class="nds-form-element nds-m-bottom_large nds-p-around_small ">
                            <div class="nds-grid nds-cont-wrapper nds-select-wrapper">
                              <div class="nds-form-element__control nds-select_container nds-form-element__control-animated-label" style="height: 2rem;">
                                <select name="loopname" id="Select1" class="nds-select " aria-invalid="false">
                                  <option value=""></option>
                                  <option label="Computers" value="CSC">Computers</option>
                                  <option label="Electronics" value="ECE">Electronics</option>
                                  <option label="Production" value="IPE">Production</option>
                                </select>
                                <label class="nds-form-element__label">Select1</label>
                              </div>
                              <div class="nds-control-action__container">
                                <svg aria-hidden="true" class="nds-button__icon nds-button__icon_medium " xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" icon="'add'" role="button" aria-disabled="false"
                                  viewBox="0 0 52 52" alt="add">
                                  <path fill="inherit" xmlns="http://www.w3.org/2000/svg" d="m30 29h16.5c0.8 0 1.5-0.7 1.5-1.5v-3c0-0.8-0.7-1.5-1.5-1.5h-16.5c-0.6 0-1-0.4-1-1v-16.5c0-0.8-0.7-1.5-1.5-1.5h-3c-0.8 0-1.5 0.7-1.5 1.5v16.5c0 0.6-0.4 1-1 1h-16.5c-0.8 0-1.5 0.7-1.5 1.5v3c0 0.8 0.7 1.5 1.5 1.5h16.5c0.6 0 1 0.4 1 1v16.5c0 0.8 0.7 1.5 1.5 1.5h3c0.8 0 1.5-0.7 1.5-1.5v-16.5c0-0.6 0.4-1 1-1z"></path>
                                </svg>
                              </div>
                            </div>
                          </form>
                        </div>
                      </child>
                      <child class="nds-medium-size_1-of-1 nds-small-size_1-of-1 nds-x-small-size_1-of-1 nds-large-size_12-of-12" aria-hidden="false">
                        <div class="nds-size_1-of-1 ">
                          <form name="loopform" class="nds-form-element nds-m-bottom_large nds-p-around_small nds-input__tooltip ">
                            <div class="nds-form-element__control nds-form-element__control-animated-label nds-grid">
                              <input type="text" id="Telephone1" name="loopname" class="nds-input" placeholder="(___) ___-____" aria-invalid="false">
                              <label class="nds-form-element__label">Telephone1</label>
                              <div class="nds-control-action__container">
                                <svg aria-hidden="true" class="nds-button__icon nds-button__icon_medium " xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" icon="'add'" role="button" aria-disabled="false"
                                  viewBox="0 0 52 52" alt="add">
                                  <path fill="inherit" xmlns="http://www.w3.org/2000/svg" d="m30 29h16.5c0.8 0 1.5-0.7 1.5-1.5v-3c0-0.8-0.7-1.5-1.5-1.5h-16.5c-0.6 0-1-0.4-1-1v-16.5c0-0.8-0.7-1.5-1.5-1.5h-3c-0.8 0-1.5 0.7-1.5 1.5v16.5c0 0.6-0.4 1-1 1h-16.5c-0.8 0-1.5 0.7-1.5 1.5v3c0 0.8 0.7 1.5 1.5 1.5h16.5c0.6 0 1 0.4 1 1v16.5c0 0.8 0.7 1.5 1.5 1.5h3c0.8 0 1.5-0.7 1.5-1.5v-16.5c0-0.6 0.4-1 1-1z"></path>
                                </svg>
                              </div>
                            </div>
                            <div class="nds-form-element__control-help ">Enter a Mobile Number</div>
                          </form>
                        </div>
                      </child>
                      <child class="nds-medium-size_1-of-1 nds-small-size_1-of-1 nds-x-small-size_1-of-1 nds-large-size_12-of-12" aria-hidden="false">
                        <div class="nds-size_1-of-1 ">
                          <form name="loopform" class="nds-form-element nds-m-bottom_large nds-p-around_small nds-input__tooltip ">
                            <div class="nds-form-element__control nds-form-element__control-animated-label nds-grid">
                              <input type="text" id="Signature1" name="loopname" class="nds-input form-control " aria-invalid="false">
                              <label class="nds-form-element__label">Signature1</label>
                              <div class="nds-control-action__container">
                                <svg aria-hidden="true" class="nds-button__icon nds-button__icon_medium " xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" icon="'add'" role="button" aria-disabled="false"
                                  viewBox="0 0 52 52" alt="add">
                                  <path fill="inherit" xmlns="http://www.w3.org/2000/svg" d="m30 29h16.5c0.8 0 1.5-0.7 1.5-1.5v-3c0-0.8-0.7-1.5-1.5-1.5h-16.5c-0.6 0-1-0.4-1-1v-16.5c0-0.8-0.7-1.5-1.5-1.5h-3c-0.8 0-1.5 0.7-1.5 1.5v16.5c0 0.6-0.4 1-1 1h-16.5c-0.8 0-1.5 0.7-1.5 1.5v3c0 0.8 0.7 1.5 1.5 1.5h16.5c0.6 0 1 0.4 1 1v16.5c0 0.8 0.7 1.5 1.5 1.5h3c0.8 0 1.5-0.7 1.5-1.5v-16.5c0-0.6 0.4-1 1-1z"></path>
                                </svg>
                              </div>
                            </div>
                            <div class="nds-form-element__control-help ">Please Sign</div>
                          </form>
                        </div>
                      </child>
                      <child class="nds-medium-size_1-of-1 nds-small-size_1-of-1 nds-x-small-size_1-of-1 nds-large-size_12-of-12" aria-hidden="false">
                        <div class="nds-size_1-of-1 ">
                          <form name="loopform" class="nds-form-element nds-m-bottom_large nds-p-around_small nds-input__tooltip ">
                            <div class="nds-form-element__control nds-form-element__control-animated-label nds-grid">
                              <input type="text" id="Time1" name="loopname" class="nds-input nds-time-picker " data-time-format="hh:mm a" aria-invalid="false">
                              <label class="nds-form-element__label">Time1</label>
                              <div class="nds-control-action__container">
                                <svg aria-hidden="true" class="nds-button__icon nds-button__icon_medium " xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" icon="'add'" role="button" aria-disabled="false"
                                  viewBox="0 0 52 52" alt="add">
                                  <path fill="inherit" xmlns="http://www.w3.org/2000/svg" d="m30 29h16.5c0.8 0 1.5-0.7 1.5-1.5v-3c0-0.8-0.7-1.5-1.5-1.5h-16.5c-0.6 0-1-0.4-1-1v-16.5c0-0.8-0.7-1.5-1.5-1.5h-3c-0.8 0-1.5 0.7-1.5 1.5v16.5c0 0.6-0.4 1-1 1h-16.5c-0.8 0-1.5 0.7-1.5 1.5v3c0 0.8 0.7 1.5 1.5 1.5h16.5c0.6 0 1 0.4 1 1v16.5c0 0.8 0.7 1.5 1.5 1.5h3c0.8 0 1.5-0.7 1.5-1.5v-16.5c0-0.6 0.4-1 1-1z"></path>
                                </svg>
                              </div>
                            </div>
                            <div class="nds-form-element__control-help ">Pick a Time</div>
                          </form>
                        </div>
                      </child>
                      <child class="nds-medium-size_1-of-1 nds-small-size_1-of-1 nds-x-small-size_1-of-1 nds-large-size_12-of-12" aria-hidden="false">
                        <div class="nds-size_1-of-1 ">
                          <form name="loopform" class="nds-form-element nds-m-bottom_large nds-p-around_small nds-input__tooltip ">
                            <div class="nds-form-element__control nds-form-element__control-animated-label nds-grid">
                              <input type="url" id="URL1" name="loopname" class="nds-input form-control " aria-invalid="false">
                              <label class="nds-form-element__label">URL1</label>
                              <div class="nds-control-action__container">
                                <svg aria-hidden="true" class="nds-button__icon nds-button__icon_medium " xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" icon="'add'" role="button" aria-disabled="false"
                                  viewBox="0 0 52 52" alt="add">
                                  <path fill="inherit" xmlns="http://www.w3.org/2000/svg" d="m30 29h16.5c0.8 0 1.5-0.7 1.5-1.5v-3c0-0.8-0.7-1.5-1.5-1.5h-16.5c-0.6 0-1-0.4-1-1v-16.5c0-0.8-0.7-1.5-1.5-1.5h-3c-0.8 0-1.5 0.7-1.5 1.5v16.5c0 0.6-0.4 1-1 1h-16.5c-0.8 0-1.5 0.7-1.5 1.5v3c0 0.8 0.7 1.5 1.5 1.5h16.5c0.6 0 1 0.4 1 1v16.5c0 0.8 0.7 1.5 1.5 1.5h3c0.8 0 1.5-0.7 1.5-1.5v-16.5c0-0.6 0.4-1 1-1z"></path>
                                </svg>
                              </div>
                            </div>
                            <div class="nds-form-element__control-help ">Enter a URL</div>
                          </form>
                        </div>
                      </child>
                      <child class="nds-medium-size_1-of-1 nds-small-size_1-of-1 nds-x-small-size_1-of-1 nds-large-size_12-of-12" aria-hidden="false">
                        <div class="nds-size_1-of-1 ">
                          <form name="loopform" class="nds-form-element nds-size_1-of-1 nds-m-bottom_large nds-p-around_small nds-input__tooltip ">
                            <div class="nds-form-element__control nds-form-element__control-animated-label nds-grid">
                              <input type="text" id="Text1" name="loopname" class="nds-input " aria-invalid="false">
                              <label class="nds-form-element__label">Text1</label>
                              <div class="nds-control-action__container">
                                <svg aria-hidden="true" class="nds-button__icon nds-button__icon_medium " xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" icon="'add'" role="button" aria-disabled="false"
                                  viewBox="0 0 52 52" alt="add">
                                  <path fill="inherit" xmlns="http://www.w3.org/2000/svg" d="m30 29h16.5c0.8 0 1.5-0.7 1.5-1.5v-3c0-0.8-0.7-1.5-1.5-1.5h-16.5c-0.6 0-1-0.4-1-1v-16.5c0-0.8-0.7-1.5-1.5-1.5h-3c-0.8 0-1.5 0.7-1.5 1.5v16.5c0 0.6-0.4 1-1 1h-16.5c-0.8 0-1.5 0.7-1.5 1.5v3c0 0.8 0.7 1.5 1.5 1.5h16.5c0.6 0 1 0.4 1 1v16.5c0 0.8 0.7 1.5 1.5 1.5h3c0.8 0 1.5-0.7 1.5-1.5v-16.5c0-0.6 0.4-1 1-1z"></path>
                                </svg>
                              </div>
                            </div>
                            <div class="nds-form-element__control-help ">Enter a Text Value</div>
                          </form>
                        </div>
                      </child>
                    </div>
                  </div>
                  <div class="nds-col_padded nds-size_1-of-1 nds-m-top_medium nds-m-bottom_xx-large">
                    <div class="nds-grid nds-wrap vlc-slds-button_footer nds-form-element__control-help">
                      <div class="nds-grid nds-size_1-of-1 nds-p-bottom_small">
                        <div class="nds-cursor-pointer " role="button">Cancel</div>
                        <div class="nds-col_bump-left nds-cursor-pointer " role="button">Save for later</div>
                      </div>
                      <div class="nds-size_1-of-1 nds-header__desktop ">
                        <div class="nds-wrap">
                          <div class="nds-align_absolute-center">
                            <button class="nds-button nds-button_brand nds-p-around_xx-small nds-size_1-of-1 nds-medium-size_12-of-12" id="Step for Newport-SetValues_nextBtn" aria-hidden="false">Next</button>
                          </div>
                          <div class="nds-align_absolute-center nds-p-around_xx-small">
                            <button class="nds-button nds-button_neutral nds-p-around_xx-small nds-size_1-of-1 nds-medium-size_3-of-12" id="Step for Newport-SetValues_prevBtn" style="border: medium none;">Previous</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </child>
        </bptree>
      </div>
    </div>
  </ng-view>
</div>`);
  });
