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
    return withExample(`<div style="height: 25rem;">
  <div class="nds-form-element nds-dropdown-trigger nds-dropdown-trigger_click nds-is-open">
    <label class="nds-form-element__label" for="date-input-id">
      Date

    </label>
    <div class="nds-form-element__control nds-input-has-icon nds-input-has-icon_right">
      <input type="text" id="date-input-id" placeholder=" " class="nds-input">
      <button class="nds-button nds-button_icon nds-input__icon nds-input__icon_right" title="Select a date">
        <svg class="nds-button__icon" aria-hidden="true">
          <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#event"></use>
        </svg>
        <span class="nds-assistive-text">Select a date</span>
      </button>
    </div>
    <div aria-hidden="false" aria-label="Date picker: June" class="nds-datepicker nds-dropdown nds-dropdown_left" role="dialog">
      <div class="nds-datepicker__filter nds-grid">
        <div class="nds-datepicker__filter_month nds-grid nds-grid_align-spread nds-grow">
          <div class="nds-align-middle">
            <button class="nds-button nds-button_icon nds-button_icon-container" title="Previous Month">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#left"></use>
              </svg>
              <span class="nds-assistive-text">Previous Month</span>
            </button>
          </div>
          <h2 aria-atomic="true" aria-live="assertive" class="nds-align-middle" id="month">June</h2>
          <div class="nds-align-middle">
            <button class="nds-button nds-button_icon nds-button_icon-container" title="Next Month">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#right"></use>
              </svg>
              <span class="nds-assistive-text">Next Month</span>
            </button>
          </div>
        </div>
        <div class="nds-shrink-none">
          <label class="nds-assistive-text" for="select-01">Pick a Year</label>
          <div class="nds-select_container">
            <select class="nds-select" id="select-01">
              <option>2014</option>
              <option>2015</option>
              <option>2016</option>
            </select>
          </div>
        </div>
      </div>
      <table aria-labelledby="month" aria-multiselectable="true" class="nds-datepicker__month" role="grid">
        <thead>
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
        </thead>
        <tbody>
          <tr>
            <td aria-disabled="true" aria-selected="false" class="nds-disabled-text" role="gridcell">
              <span class="nds-day">31</span>
            </td>
            <td aria-selected="false" role="gridcell" tabindex="0">
              <span class="nds-day">1</span>
            </td>
            <td aria-selected="false" role="gridcell">
              <span class="nds-day">2</span>
            </td>
            <td aria-selected="false" role="gridcell">
              <span class="nds-day">3</span>
            </td>
            <td aria-selected="false" role="gridcell">
              <span class="nds-day">4</span>
            </td>
            <td aria-selected="false" role="gridcell">
              <span class="nds-day">5</span>
            </td>
            <td aria-selected="false" role="gridcell">
              <span class="nds-day">6</span>
            </td>
          </tr>
          <tr>
            <td aria-selected="false" role="gridcell">
              <span class="nds-day">7</span>
            </td>
            <td aria-selected="false" role="gridcell">
              <span class="nds-day">8</span>
            </td>
            <td aria-selected="false" role="gridcell">
              <span class="nds-day">9</span>
            </td>
            <td aria-selected="false" role="gridcell">
              <span class="nds-day">10</span>
            </td>
            <td aria-selected="false" role="gridcell">
              <span class="nds-day">11</span>
            </td>
            <td aria-selected="false" role="gridcell">
              <span class="nds-day">12</span>
            </td>
            <td aria-selected="false" role="gridcell">
              <span class="nds-day">13</span>
            </td>
          </tr>
          <tr>
            <td aria-selected="false" role="gridcell">
              <span class="nds-day">14</span>
            </td>
            <td aria-selected="false" role="gridcell">
              <span class="nds-day">15</span>
            </td>
            <td aria-selected="false" role="gridcell">
              <span class="nds-day">16</span>
            </td>
            <td aria-selected="false" role="gridcell">
              <span class="nds-day">17</span>
            </td>
            <td aria-selected="false" aria-current="date" class="nds-is-today" role="gridcell">
              <span class="nds-day">18</span>
            </td>
            <td aria-selected="false" role="gridcell">
              <span class="nds-day">19</span>
            </td>
            <td aria-selected="false" role="gridcell">
              <span class="nds-day">20</span>
            </td>
          </tr>
          <tr class="">
            <td aria-selected="false" role="gridcell">
              <span class="nds-day">21</span>
            </td>
            <td aria-selected="false" role="gridcell">
              <span class="nds-day">22</span>
            </td>
            <td aria-selected="false" role="gridcell">
              <span class="nds-day">23</span>
            </td>
            <td aria-selected="false" class="" role="gridcell">
              <span class="nds-day">24</span>
            </td>
            <td aria-selected="false" class="" role="gridcell">
              <span class="nds-day">25</span>
            </td>
            <td aria-selected="false" role="gridcell">
              <span class="nds-day">26</span>
            </td>
            <td aria-selected="false" role="gridcell">
              <span class="nds-day">27</span>
            </td>
          </tr>
          <tr class="">
            <td aria-selected="false" class="" role="gridcell">
              <span class="nds-day">28</span>
            </td>
            <td aria-selected="false" role="gridcell">
              <span class="nds-day">29</span>
            </td>
            <td aria-selected="false" role="gridcell">
              <span class="nds-day">30</span>
            </td>
            <td aria-disabled="true" aria-selected="false" class="nds-disabled-text" role="gridcell">
              <span class="nds-day">1</span>
            </td>
            <td aria-disabled="true" aria-selected="false" class="nds-disabled-text" role="gridcell">
              <span class="nds-day">2</span>
            </td>
            <td aria-disabled="true" aria-selected="false" class="nds-disabled-text" role="gridcell">
              <span class="nds-day">3</span>
            </td>
            <td aria-disabled="true" aria-selected="false" class="nds-disabled-text" role="gridcell">
              <span class="nds-day">4</span>
            </td>
          </tr>
        </tbody>
      </table>
      <button class="nds-button nds-align_absolute-center nds-text-link">Today</button>
    </div>
  </div>
</div>`);
  })
  .add('Datepicker Day Selected (states)', () => {
    return withExample(`<div style="height: 25rem;">
  <div class="nds-form-element nds-dropdown-trigger nds-dropdown-trigger_click nds-is-open">
    <label class="nds-form-element__label" for="date-input-id">
      Date

    </label>
    <div class="nds-form-element__control nds-input-has-icon nds-input-has-icon_right">
      <input type="text" id="date-input-id" placeholder=" " class="nds-input" value="06/24/2014">
      <button class="nds-button nds-button_icon nds-input__icon nds-input__icon_right" title="Select a date">
        <svg class="nds-button__icon" aria-hidden="true">
          <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#event"></use>
        </svg>
        <span class="nds-assistive-text">Select a date</span>
      </button>
    </div>
    <div aria-hidden="false" aria-label="Date picker: June" class="nds-datepicker nds-dropdown nds-dropdown_left" role="dialog">
      <div class="nds-datepicker__filter nds-grid">
        <div class="nds-datepicker__filter_month nds-grid nds-grid_align-spread nds-grow">
          <div class="nds-align-middle">
            <button class="nds-button nds-button_icon nds-button_icon-container" title="Previous Month">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#left"></use>
              </svg>
              <span class="nds-assistive-text">Previous Month</span>
            </button>
          </div>
          <h2 aria-atomic="true" aria-live="assertive" class="nds-align-middle" id="month">June</h2>
          <div class="nds-align-middle">
            <button class="nds-button nds-button_icon nds-button_icon-container" title="Next Month">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#right"></use>
              </svg>
              <span class="nds-assistive-text">Next Month</span>
            </button>
          </div>
        </div>
        <div class="nds-shrink-none">
          <label class="nds-assistive-text" for="select-01">Pick a Year</label>
          <div class="nds-select_container">
            <select class="nds-select" id="select-01">
              <option>2014</option>
              <option>2015</option>
              <option>2016</option>
            </select>
          </div>
        </div>
      </div>
      <table aria-labelledby="month" aria-multiselectable="true" class="nds-datepicker__month" role="grid">
        <thead>
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
        </thead>
        <tbody>
          <tr>
            <td aria-disabled="true" aria-selected="false" class="nds-disabled-text" role="gridcell">
              <span class="nds-day">31</span>
            </td>
            <td aria-selected="false" role="gridcell" tabindex="0">
              <span class="nds-day">1</span>
            </td>
            <td aria-selected="false" role="gridcell">
              <span class="nds-day">2</span>
            </td>
            <td aria-selected="false" role="gridcell">
              <span class="nds-day">3</span>
            </td>
            <td aria-selected="false" role="gridcell">
              <span class="nds-day">4</span>
            </td>
            <td aria-selected="false" role="gridcell">
              <span class="nds-day">5</span>
            </td>
            <td aria-selected="false" role="gridcell">
              <span class="nds-day">6</span>
            </td>
          </tr>
          <tr>
            <td aria-selected="false" role="gridcell">
              <span class="nds-day">7</span>
            </td>
            <td aria-selected="false" role="gridcell">
              <span class="nds-day">8</span>
            </td>
            <td aria-selected="false" role="gridcell">
              <span class="nds-day">9</span>
            </td>
            <td aria-selected="false" role="gridcell">
              <span class="nds-day">10</span>
            </td>
            <td aria-selected="false" role="gridcell">
              <span class="nds-day">11</span>
            </td>
            <td aria-selected="false" role="gridcell">
              <span class="nds-day">12</span>
            </td>
            <td aria-selected="false" role="gridcell">
              <span class="nds-day">13</span>
            </td>
          </tr>
          <tr>
            <td aria-selected="false" role="gridcell">
              <span class="nds-day">14</span>
            </td>
            <td aria-selected="false" role="gridcell">
              <span class="nds-day">15</span>
            </td>
            <td aria-selected="false" role="gridcell">
              <span class="nds-day">16</span>
            </td>
            <td aria-selected="false" role="gridcell">
              <span class="nds-day">17</span>
            </td>
            <td aria-selected="false" aria-current="date" class="nds-is-today" role="gridcell">
              <span class="nds-day">18</span>
            </td>
            <td aria-selected="false" role="gridcell">
              <span class="nds-day">19</span>
            </td>
            <td aria-selected="false" role="gridcell">
              <span class="nds-day">20</span>
            </td>
          </tr>
          <tr class="nds-has-multi-selection">
            <td aria-selected="false" role="gridcell">
              <span class="nds-day">21</span>
            </td>
            <td aria-selected="false" role="gridcell">
              <span class="nds-day">22</span>
            </td>
            <td aria-selected="false" role="gridcell">
              <span class="nds-day">23</span>
            </td>
            <td aria-selected="true" class="nds-is-selected" role="gridcell">
              <span class="nds-day">24</span>
            </td>
            <td aria-selected="false" class="" role="gridcell">
              <span class="nds-day">25</span>
            </td>
            <td aria-selected="false" role="gridcell">
              <span class="nds-day">26</span>
            </td>
            <td aria-selected="false" role="gridcell">
              <span class="nds-day">27</span>
            </td>
          </tr>
          <tr class="">
            <td aria-selected="false" class="" role="gridcell">
              <span class="nds-day">28</span>
            </td>
            <td aria-selected="false" role="gridcell">
              <span class="nds-day">29</span>
            </td>
            <td aria-selected="false" role="gridcell">
              <span class="nds-day">30</span>
            </td>
            <td aria-disabled="true" aria-selected="false" class="nds-disabled-text" role="gridcell">
              <span class="nds-day">1</span>
            </td>
            <td aria-disabled="true" aria-selected="false" class="nds-disabled-text" role="gridcell">
              <span class="nds-day">2</span>
            </td>
            <td aria-disabled="true" aria-selected="false" class="nds-disabled-text" role="gridcell">
              <span class="nds-day">3</span>
            </td>
            <td aria-disabled="true" aria-selected="false" class="nds-disabled-text" role="gridcell">
              <span class="nds-day">4</span>
            </td>
          </tr>
        </tbody>
      </table>
      <button class="nds-button nds-align_absolute-center nds-text-link">Today</button>
    </div>
  </div>
</div>`);
  });
