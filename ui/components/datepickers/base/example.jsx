// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import classNames from 'classnames';
import { UtilityIcon } from '../../icons/base/example';
import { ButtonIcon } from '../../button-icons/base/example';
import { Select } from '../../select/base/example';
import { FormElement } from '../../form-element/base/example';
import { Input } from '../../input/base/example';

/* -----------------------------------------------------------------------------
    Variables
----------------------------------------------------------------------------- */

const dateInputId = 'date-input-id';
const dateRangeInputId01 = 'date-input-id-01';
const dateRangeInputId02 = 'date-input-id-02';
const timeInputId = 'time-input-id';

/* -----------------------------------------------------------------------------
    Private
----------------------------------------------------------------------------- */

let DatepickerContainer = props => (
  <div
    aria-hidden="false"
    aria-label="Date picker: June"
    className={classNames('nds-datepicker', props.className)}
    role="dialog"
  >
    {props.children}
    <button className="nds-button nds-align_absolute-center nds-text-link">
      Today
    </button>
  </div>
);

let DatepickerHeader = props => (
  <div className="nds-datepicker__filter nds-grid">
    <div className="nds-datepicker__filter_month nds-grid nds-grid_align-spread nds-grow">
      <div className="nds-align-middle">
        <ButtonIcon
          assistiveText="Previous Month"
          className="nds-button_icon-container"
          symbol="left"
          title="Previous Month"
        />
      </div>
      <h2
        aria-atomic="true"
        aria-live="assertive"
        className="nds-align-middle"
        id="month"
      >
        June
      </h2>
      <div className="nds-align-middle">
        <ButtonIcon
          assistiveText="Next Month"
          className="nds-button_icon-container"
          symbol="right"
          title="Next Month"
        />
      </div>
    </div>
    <div className="nds-shrink-none">
      <label className="nds-assistive-text" htmlFor="select-01">
        Pick a Year
      </label>
      <Select>
        <option>2014</option>
        <option>2015</option>
        <option>2016</option>
      </Select>
    </div>
  </div>
);

let Weekdays = props => (
  <tr id="weekdays">
    <th id="Sunday" scope="col">
      <abbr title="Sunday">Sun</abbr>
    </th>
    <th id="Monday" scope="col">
      <abbr title="Monday">Mon</abbr>
    </th>
    <th id="Tuesday" scope="col">
      <abbr title="Tuesday">Tue</abbr>
    </th>
    <th id="Wednesday" scope="col">
      <abbr title="Wednesday">Wed</abbr>
    </th>
    <th id="Thursday" scope="col">
      <abbr title="Thursday">Thu</abbr>
    </th>
    <th id="Friday" scope="col">
      <abbr title="Friday">Fri</abbr>
    </th>
    <th id="Saturday" scope="col">
      <abbr title="Saturday">Sat</abbr>
    </th>
  </tr>
);

let Week = props => <tr {...props}>{props.children}</tr>;

let Day = props => (
  <td
    aria-disabled={props['aria-disabled']}
    aria-selected={props['aria-selected']}
    aria-current={props['aria-current']}
    className={props.className}
    role="gridcell"
    tabIndex={props.tabIndex}
  >
    <span className="nds-day">{props.children}</span>
  </td>
);

/* -----------------------------------------------------------------------------
    Public
----------------------------------------------------------------------------- */

export let DatePicker = props => (
  <DatepickerContainer className="nds-dropdown nds-dropdown_left">
    <DatepickerHeader />
    <table
      aria-labelledby="month"
      aria-multiselectable="true"
      className="nds-datepicker__month"
      role="grid"
    >
      <thead>
        <Weekdays />
      </thead>
      <tbody>
        <Week>
          <Day
            aria-disabled="true"
            aria-selected="false"
            className="nds-disabled-text"
          >
            31
          </Day>
          <Day aria-selected="false" tabIndex="0">
            1
          </Day>
          <Day aria-selected="false">2</Day>
          <Day aria-selected="false">3</Day>
          <Day aria-selected="false">4</Day>
          <Day aria-selected="false">5</Day>
          <Day aria-selected="false">6</Day>
        </Week>
        <Week>
          <Day aria-selected="false">7</Day>
          <Day aria-selected="false">8</Day>
          <Day aria-selected="false">9</Day>
          <Day aria-selected="false">10</Day>
          <Day aria-selected="false">11</Day>
          <Day aria-selected="false">12</Day>
          <Day aria-selected="false">13</Day>
        </Week>
        <Week>
          <Day aria-selected="false">14</Day>
          <Day aria-selected="false">15</Day>
          <Day aria-selected="false">16</Day>
          <Day aria-selected="false">17</Day>
          <Day
            aria-selected="false"
            aria-current={props.todayActive ? 'date' : null}
            className={props.todayActive ? 'nds-is-today' : null}
          >
            18
          </Day>
          <Day aria-selected="false">19</Day>
          <Day aria-selected="false">20</Day>
        </Week>
        <Week
          className={classNames({
            'nds-has-multi-selection': props.dateRange == 'week-4',
            'nds-has-multi-row-selection': props.dateRangeMulti
          })}
        >
          <Day aria-selected="false">21</Day>
          <Day aria-selected="false">22</Day>
          <Day aria-selected="false">23</Day>
          <Day
            aria-selected={
              props.dateSelected &&
              (props.dateRange === 'week-4' ||
                props.dateRange === 'week-4-5') ? (
                'true'
              ) : (
                'false'
              )
            }
            className={classNames({
              'nds-is-selected':
                props.dateSelected === 'single' &&
                (props.dateRange === 'week-4' ||
                  props.dateRange === 'week-4-5'),
              'nds-is-selected nds-is-selected-multi':
                props.dateSelected != 'single' &&
                (props.dateRange === 'week-4' || props.dateRange === 'week-4-5')
            })}
          >
            24
          </Day>
          <Day
            aria-selected={
              props.dateSelected != 'single' &&
              (props.dateRange === 'week-4' ||
                props.dateRange === 'week-4-5') ? (
                'true'
              ) : (
                'false'
              )
            }
            className={classNames({
              'nds-is-selected nds-is-selected-multi':
                props.dateSelected != 'single' &&
                (props.dateRange === 'week-4' ||
                  props.dateRange === 'week-4-5'),
              'nds-is-today': props.todayActiveInRange
            })}
          >
            25
          </Day>
          <Day
            aria-selected={
              props.dateSelected != 'single' &&
              (props.dateRange === 'week-4' ||
                props.dateRange === 'week-4-5') ? (
                'true'
              ) : (
                'false'
              )
            }
            className={
              props.dateSelected != 'single' &&
              (props.dateRange === 'week-4' ||
                props.dateRange === 'week-4-5') ? (
                'nds-is-selected nds-is-selected-multi'
              ) : null
            }
          >
            26
          </Day>
          <Day
            aria-selected={
              props.dateSelected != 'single' &&
              (props.dateRange === 'week-4' ||
                props.dateRange === 'week-4-5') ? (
                'true'
              ) : (
                'false'
              )
            }
            className={
              props.dateSelected != 'single' &&
              (props.dateRange === 'week-4' ||
                props.dateRange === 'week-4-5') ? (
                'nds-is-selected nds-is-selected-multi'
              ) : null
            }
          >
            27
          </Day>
        </Week>
        <Week
          className={classNames({
            'nds-has-multi-selection': props.dateRange == 'week-5',
            'nds-has-multi-row-selection': props.dateRangeMulti
          })}
        >
          <Day
            aria-selected={
              props.dateSelected &&
              (props.dateRange === 'week-5' ||
                props.dateRange === 'week-4-5') ? (
                'true'
              ) : (
                'false'
              )
            }
            className={classNames({
              'nds-is-selected':
                props.dateSelected === 'single' && props.dateRange === 'week-5',
              'nds-is-selected nds-is-selected-multi':
                props.dateSelected != 'single' &&
                (props.dateRange === 'week-5' || props.dateRange === 'week-4-5')
            })}
          >
            28
          </Day>
          <Day
            aria-selected={
              props.dateSelected != 'single' &&
              (props.dateRange === 'week-5' ||
                props.dateRange === 'week-4-5') ? (
                'true'
              ) : (
                'false'
              )
            }
            className={
              props.dateSelected != 'single' &&
              (props.dateRange === 'week-5' ||
                props.dateRange === 'week-4-5') ? (
                'nds-is-selected nds-is-selected-multi'
              ) : null
            }
          >
            29
          </Day>
          <Day
            aria-selected={
              props.dateSelected != 'single' &&
              (props.dateRange === 'week-5' ||
                props.dateRange === 'week-4-5') ? (
                'true'
              ) : (
                'false'
              )
            }
            className={
              props.dateSelected != 'single' &&
              (props.dateRange === 'week-5' ||
                props.dateRange === 'week-4-5') ? (
                'nds-is-selected nds-is-selected-multi'
              ) : null
            }
          >
            30
          </Day>
          <Day
            aria-disabled="true"
            aria-selected={
              props.dateSelected != 'single' && props.dateRange === 'week-5' ? (
                'true'
              ) : (
                'false'
              )
            }
            className={classNames(
              'nds-disabled-text',
              props.dateSelected != 'single' && props.dateRange === 'week-5'
                ? 'nds-is-selected nds-is-selected-multi'
                : null
            )}
          >
            1
          </Day>
          <Day
            aria-disabled="true"
            aria-selected={
              props.dateSelected != 'single' && props.dateRange === 'week-5' ? (
                'true'
              ) : (
                'false'
              )
            }
            className={classNames(
              'nds-disabled-text',
              props.dateSelected != 'single' && props.dateRange === 'week-5'
                ? 'nds-is-selected nds-is-selected-multi'
                : null
            )}
          >
            2
          </Day>
          <Day
            aria-disabled="true"
            aria-selected={
              props.dateSelected != 'single' && props.dateRange === 'week-5' ? (
                'true'
              ) : (
                'false'
              )
            }
            className={classNames(
              'nds-disabled-text',
              props.dateSelected != 'single' && props.dateRange === 'week-5'
                ? 'nds-is-selected nds-is-selected-multi'
                : null
            )}
          >
            3
          </Day>
          <Day
            aria-disabled="true"
            aria-selected={
              props.dateSelected != 'single' && props.dateRange === 'week-5' ? (
                'true'
              ) : (
                'false'
              )
            }
            className={classNames(
              'nds-disabled-text',
              props.dateSelected != 'single' && props.dateRange === 'week-5'
                ? 'nds-is-selected nds-is-selected-multi'
                : null
            )}
          >
            4
          </Day>
        </Week>
      </tbody>
    </table>
  </DatepickerContainer>
);

/* -----------------------------------------------------------------------------
    Exports
----------------------------------------------------------------------------- */

export const Context = props => (
  <div style={{ height: '25rem' }}>{props.children}</div>
);

export default (
  <FormElement
    className="nds-dropdown-trigger nds-dropdown-trigger_click nds-is-open"
    label="Date"
    inputId={dateInputId}
    inputIcon="right"
    dropdown={<DatePicker todayActive />}
  >
    <Input id={dateInputId} placeholder=" " />
    <ButtonIcon
      className="nds-input__icon nds-input__icon_right"
      symbol="event"
      assistiveText="Select a date"
      title="Select a date"
    />
  </FormElement>
);

export let states = [
  {
    id: 'datepicker-day-selected',
    label: 'Date selected',
    element: (
      <FormElement
        className="nds-dropdown-trigger nds-dropdown-trigger_click nds-is-open"
        label="Date"
        inputId={dateInputId}
        inputIcon="right"
        dropdown={
          <DatePicker todayActive dateSelected="single" dateRange="week-4" />
        }
      >
        <Input id={dateInputId} placeholder=" " defaultValue="06/24/2014" />
        <ButtonIcon
          className="nds-input__icon nds-input__icon_right"
          symbol="event"
          assistiveText="Select a date"
          title="Select a date"
        />
      </FormElement>
    )
  }
];
