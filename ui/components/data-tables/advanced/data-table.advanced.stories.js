import { storiesOf } from '@storybook/html';
import base from 'paths.macro';
import notes from '../doc.md';
import scss from '../base/_index.scss';
import {
  withExample,
  withDocs,
  commentToHTML
} from '../../../../scripts/storybook';

storiesOf(`${base}`, module)
  .addDecorator(withDocs(notes))
  .addDecorator(commentToHTML(scss))
  .add('Default (default)', () => {
    return withExample(`<table class="nds-table nds-table_bordered nds-table_resizable-cols nds-table_fixed-layout" role="grid">
  <thead>
    <tr class="nds-line-height_reset">
      <th class="nds-text-align_right" scope="col" style="width: 3.25rem;">
        <div class="nds-th__action nds-th__action_form">
          <label class="nds-checkbox">
            <input type="checkbox" name="options" id="checkbox-33" tabindex="-1" value="on">
            <span class="nds-checkbox_faux"></span>
            <label class="nds-checkbox__label">
              <span class="nds-form-element__label nds-assistive-text">Select All</span>
            </label>
          </label>
        </div>
      </th>
      <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Name" scope="col">
        <a class="nds-th__action nds-text-link_reset" href="javascript:void(0);" role="button" tabindex="-1">
          <span class="nds-assistive-text">Sort by: </span>
          <span class="nds-truncate" title="Name">Name</span>
          <div class="nds-icon_container">
            <svg class="nds-icon nds-icon_x-small nds-icon-text-default nds-is-sortable__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
          </div>
        </a>
        <span class="nds-assistive-text" aria-live="assertive" aria-atomic="true">
          Sorted

          none

        </span>
        <div class="nds-resizable">
          <input type="range" min="20" max="1000" aria-label="Name column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-57" tabindex="-1">
          <span class="nds-resizable__handle">
            <span class="nds-resizable__divider"></span>
          </span>
        </div>
      </th>
      <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Account Name" scope="col">
        <a class="nds-th__action nds-text-link_reset" href="javascript:void(0);" role="button" tabindex="-1">
          <span class="nds-assistive-text">Sort by: </span>
          <span class="nds-truncate" title="Account Name">Account Name</span>
          <div class="nds-icon_container">
            <svg class="nds-icon nds-icon_x-small nds-icon-text-default nds-is-sortable__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
          </div>
        </a>
        <span class="nds-assistive-text" aria-live="assertive" aria-atomic="true">
          Sorted

          none

        </span>
        <div class="nds-resizable">
          <input type="range" min="20" max="1000" aria-label="Account Name column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-58" tabindex="-1">
          <span class="nds-resizable__handle">
            <span class="nds-resizable__divider"></span>
          </span>
        </div>
      </th>
      <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Close Date" scope="col">
        <a class="nds-th__action nds-text-link_reset" href="javascript:void(0);" role="button" tabindex="-1">
          <span class="nds-assistive-text">Sort by: </span>
          <span class="nds-truncate" title="Close Date">Close Date</span>
          <div class="nds-icon_container">
            <svg class="nds-icon nds-icon_x-small nds-icon-text-default nds-is-sortable__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
          </div>
        </a>
        <span class="nds-assistive-text" aria-live="assertive" aria-atomic="true">
          Sorted

          none

        </span>
        <div class="nds-resizable">
          <input type="range" min="20" max="1000" aria-label="Close Date column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-59" tabindex="-1">
          <span class="nds-resizable__handle">
            <span class="nds-resizable__divider"></span>
          </span>
        </div>
      </th>
      <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Stage" scope="col">
        <a class="nds-th__action nds-text-link_reset" href="javascript:void(0);" role="button" tabindex="-1">
          <span class="nds-assistive-text">Sort by: </span>
          <span class="nds-truncate" title="Stage">Stage</span>
          <div class="nds-icon_container">
            <svg class="nds-icon nds-icon_x-small nds-icon-text-default nds-is-sortable__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
          </div>
        </a>
        <span class="nds-assistive-text" aria-live="assertive" aria-atomic="true">
          Sorted

          none

        </span>
        <div class="nds-resizable">
          <input type="range" min="20" max="1000" aria-label="Stage column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-60" tabindex="-1">
          <span class="nds-resizable__handle">
            <span class="nds-resizable__divider"></span>
          </span>
        </div>
      </th>
      <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Confidence" scope="col">
        <a class="nds-th__action nds-text-link_reset" href="javascript:void(0);" role="button" tabindex="-1">
          <span class="nds-assistive-text">Sort by: </span>
          <span class="nds-truncate" title="Confidence">Confidence</span>
          <div class="nds-icon_container">
            <svg class="nds-icon nds-icon_x-small nds-icon-text-default nds-is-sortable__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
          </div>
        </a>
        <span class="nds-assistive-text" aria-live="assertive" aria-atomic="true">
          Sorted

          none

        </span>
        <div class="nds-resizable">
          <input type="range" min="20" max="1000" aria-label="Confidence column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-61" tabindex="-1">
          <span class="nds-resizable__handle">
            <span class="nds-resizable__divider"></span>
          </span>
        </div>
      </th>
      <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Amount" scope="col">
        <a class="nds-th__action nds-text-link_reset" href="javascript:void(0);" role="button" tabindex="-1">
          <span class="nds-assistive-text">Sort by: </span>
          <span class="nds-truncate" title="Amount">Amount</span>
          <div class="nds-icon_container">
            <svg class="nds-icon nds-icon_x-small nds-icon-text-default nds-is-sortable__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
          </div>
        </a>
        <span class="nds-assistive-text" aria-live="assertive" aria-atomic="true">
          Sorted

          none

        </span>
        <div class="nds-resizable">
          <input type="range" min="20" max="1000" aria-label="Amount column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-62" tabindex="-1">
          <span class="nds-resizable__handle">
            <span class="nds-resizable__divider"></span>
          </span>
        </div>
      </th>
      <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Contact" scope="col">
        <a class="nds-th__action nds-text-link_reset" href="javascript:void(0);" role="button" tabindex="-1">
          <span class="nds-assistive-text">Sort by: </span>
          <span class="nds-truncate" title="Contact">Contact</span>
          <div class="nds-icon_container">
            <svg class="nds-icon nds-icon_x-small nds-icon-text-default nds-is-sortable__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
          </div>
        </a>
        <span class="nds-assistive-text" aria-live="assertive" aria-atomic="true">
          Sorted

          none

        </span>
        <div class="nds-resizable">
          <input type="range" min="20" max="1000" aria-label="Contact column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-63" tabindex="-1">
          <span class="nds-resizable__handle">
            <span class="nds-resizable__divider"></span>
          </span>
        </div>
      </th>
      <th scope="col" style="width: 3.25rem;">
        <div class="nds-th__action">
          <span class="nds-assistive-text">Actions</span>
        </div>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr class="nds-hint-parent">
      <td class="nds-text-align_right" role="gridcell">
        <label class="nds-checkbox">
          <input type="checkbox" name="options" id="checkbox-01" tabindex="-1" value="on">
          <span class="nds-checkbox_faux"></span>
          <label class="nds-checkbox__label">
            <span class="nds-form-element__label nds-assistive-text">Select item 1</span>
          </label>
        </label>
      </td>
      <th scope="row" tabindex="0">
        <div class="nds-truncate" title="Acme - 1,200 Widgets">
          <a href="javascript:void(0);" tabindex="-1">Acme - 1,200 Widgets</a>
        </div>
      </th>
      <td role="gridcell">
        <div class="nds-truncate" title="Acme">Acme</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="4/10/15">4/10/15</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="Value Proposition">Value Proposition</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="30%">30%</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="$25,000,000">$25,000,000</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="jrogers@acme.com">
          <a href="javascript:void(0);" tabindex="-1">jrogers@acme.com</a>
        </div>
      </td>
      <td role="gridcell">
        <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" tabindex="-1" title="Show More">
          <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
          </svg>
          <span class="nds-assistive-text">Show More</span>
        </button>
      </td>
    </tr>
    <tr class="nds-hint-parent">
      <td class="nds-text-align_right" role="gridcell">
        <label class="nds-checkbox">
          <input type="checkbox" name="options" id="checkbox-02" tabindex="-1" value="on">
          <span class="nds-checkbox_faux"></span>
          <label class="nds-checkbox__label">
            <span class="nds-form-element__label nds-assistive-text">Select item 2</span>
          </label>
        </label>
      </td>
      <th scope="row">
        <div class="nds-truncate" title="Acme - 200 Widgets">
          <a href="javascript:void(0);" tabindex="-1">Acme - 200 Widgets</a>
        </div>
      </th>
      <td role="gridcell">
        <div class="nds-truncate" title="Acme">Acme</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="1/31/15">1/31/15</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="Prospecting">Prospecting</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="60%">60%</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="$5,000,000">$5,000,000</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="bob@acme.com">
          <a href="javascript:void(0);" tabindex="-1">bob@acme.com</a>
        </div>
      </td>
      <td role="gridcell">
        <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" tabindex="-1" title="Show More">
          <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
          </svg>
          <span class="nds-assistive-text">Show More</span>
        </button>
      </td>
    </tr>
    <tr class="nds-hint-parent">
      <td class="nds-text-align_right" role="gridcell">
        <label class="nds-checkbox">
          <input type="checkbox" name="options" id="checkbox-03" tabindex="-1" value="on">
          <span class="nds-checkbox_faux"></span>
          <label class="nds-checkbox__label">
            <span class="nds-form-element__label nds-assistive-text">Select item 3</span>
          </label>
        </label>
      </td>
      <th scope="row">
        <div class="nds-truncate" title="salesforce.com - 1,000 Widgets">
          <a href="javascript:void(0);" tabindex="-1">salesforce.com - 1,000 Widgets</a>
        </div>
      </th>
      <td role="gridcell">
        <div class="nds-truncate" title="salesforce.com">salesforce.com</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="1/31/15 3:45PM">1/31/15 3:45PM</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="Id. Decision Makers">Id. Decision Makers</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="70%">70%</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="$25,000">$25,000</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="nathan@salesforce.com">
          <a href="javascript:void(0);" tabindex="-1">nathan@salesforce.com</a>
        </div>
      </td>
      <td role="gridcell">
        <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" tabindex="-1" title="Show More">
          <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
          </svg>
          <span class="nds-assistive-text">Show More</span>
        </button>
      </td>
    </tr>
  </tbody>
</table>`);
  })
  .add('Cell Focused (states)', () => {
    return withExample(`<table class="nds-table nds-table_bordered nds-table_resizable-cols nds-table_fixed-layout" role="grid">
  <thead>
    <tr class="nds-line-height_reset">
      <th class="nds-text-align_right" scope="col" style="width: 3.25rem;">
        <div class="nds-th__action nds-th__action_form">
          <label class="nds-checkbox">
            <input type="checkbox" name="options" id="checkbox-37" tabindex="-1" value="on">
            <span class="nds-checkbox_faux"></span>
            <label class="nds-checkbox__label">
              <span class="nds-form-element__label nds-assistive-text">Select All</span>
            </label>
          </label>
        </div>
      </th>
      <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Name" scope="col">
        <a class="nds-th__action nds-text-link_reset" href="javascript:void(0);" role="button" tabindex="-1">
          <span class="nds-assistive-text">Sort by: </span>
          <span class="nds-truncate" title="Name">Name</span>
          <div class="nds-icon_container">
            <svg class="nds-icon nds-icon_x-small nds-icon-text-default nds-is-sortable__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
          </div>
        </a>
        <span class="nds-assistive-text" aria-live="assertive" aria-atomic="true">
          Sorted

          none

        </span>
        <div class="nds-resizable">
          <input type="range" min="20" max="1000" aria-label="Name column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-64" tabindex="-1">
          <span class="nds-resizable__handle">
            <span class="nds-resizable__divider"></span>
          </span>
        </div>
      </th>
      <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Account Name" scope="col">
        <a class="nds-th__action nds-text-link_reset" href="javascript:void(0);" role="button" tabindex="-1">
          <span class="nds-assistive-text">Sort by: </span>
          <span class="nds-truncate" title="Account Name">Account Name</span>
          <div class="nds-icon_container">
            <svg class="nds-icon nds-icon_x-small nds-icon-text-default nds-is-sortable__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
          </div>
        </a>
        <span class="nds-assistive-text" aria-live="assertive" aria-atomic="true">
          Sorted

          none

        </span>
        <div class="nds-resizable">
          <input type="range" min="20" max="1000" aria-label="Account Name column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-65" tabindex="-1">
          <span class="nds-resizable__handle">
            <span class="nds-resizable__divider"></span>
          </span>
        </div>
      </th>
      <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Close Date" scope="col">
        <a class="nds-th__action nds-text-link_reset" href="javascript:void(0);" role="button" tabindex="-1">
          <span class="nds-assistive-text">Sort by: </span>
          <span class="nds-truncate" title="Close Date">Close Date</span>
          <div class="nds-icon_container">
            <svg class="nds-icon nds-icon_x-small nds-icon-text-default nds-is-sortable__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
          </div>
        </a>
        <span class="nds-assistive-text" aria-live="assertive" aria-atomic="true">
          Sorted

          none

        </span>
        <div class="nds-resizable">
          <input type="range" min="20" max="1000" aria-label="Close Date column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-66" tabindex="-1">
          <span class="nds-resizable__handle">
            <span class="nds-resizable__divider"></span>
          </span>
        </div>
      </th>
      <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Stage" scope="col">
        <a class="nds-th__action nds-text-link_reset" href="javascript:void(0);" role="button" tabindex="-1">
          <span class="nds-assistive-text">Sort by: </span>
          <span class="nds-truncate" title="Stage">Stage</span>
          <div class="nds-icon_container">
            <svg class="nds-icon nds-icon_x-small nds-icon-text-default nds-is-sortable__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
          </div>
        </a>
        <span class="nds-assistive-text" aria-live="assertive" aria-atomic="true">
          Sorted

          none

        </span>
        <div class="nds-resizable">
          <input type="range" min="20" max="1000" aria-label="Stage column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-67" tabindex="-1">
          <span class="nds-resizable__handle">
            <span class="nds-resizable__divider"></span>
          </span>
        </div>
      </th>
      <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Confidence" scope="col">
        <a class="nds-th__action nds-text-link_reset" href="javascript:void(0);" role="button" tabindex="-1">
          <span class="nds-assistive-text">Sort by: </span>
          <span class="nds-truncate" title="Confidence">Confidence</span>
          <div class="nds-icon_container">
            <svg class="nds-icon nds-icon_x-small nds-icon-text-default nds-is-sortable__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
          </div>
        </a>
        <span class="nds-assistive-text" aria-live="assertive" aria-atomic="true">
          Sorted

          none

        </span>
        <div class="nds-resizable">
          <input type="range" min="20" max="1000" aria-label="Confidence column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-68" tabindex="-1">
          <span class="nds-resizable__handle">
            <span class="nds-resizable__divider"></span>
          </span>
        </div>
      </th>
      <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Amount" scope="col">
        <a class="nds-th__action nds-text-link_reset" href="javascript:void(0);" role="button" tabindex="-1">
          <span class="nds-assistive-text">Sort by: </span>
          <span class="nds-truncate" title="Amount">Amount</span>
          <div class="nds-icon_container">
            <svg class="nds-icon nds-icon_x-small nds-icon-text-default nds-is-sortable__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
          </div>
        </a>
        <span class="nds-assistive-text" aria-live="assertive" aria-atomic="true">
          Sorted

          none

        </span>
        <div class="nds-resizable">
          <input type="range" min="20" max="1000" aria-label="Amount column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-69" tabindex="-1">
          <span class="nds-resizable__handle">
            <span class="nds-resizable__divider"></span>
          </span>
        </div>
      </th>
      <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Contact" scope="col">
        <a class="nds-th__action nds-text-link_reset" href="javascript:void(0);" role="button" tabindex="-1">
          <span class="nds-assistive-text">Sort by: </span>
          <span class="nds-truncate" title="Contact">Contact</span>
          <div class="nds-icon_container">
            <svg class="nds-icon nds-icon_x-small nds-icon-text-default nds-is-sortable__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
          </div>
        </a>
        <span class="nds-assistive-text" aria-live="assertive" aria-atomic="true">
          Sorted

          none

        </span>
        <div class="nds-resizable">
          <input type="range" min="20" max="1000" aria-label="Contact column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-70" tabindex="-1">
          <span class="nds-resizable__handle">
            <span class="nds-resizable__divider"></span>
          </span>
        </div>
      </th>
      <th scope="col" style="width: 3.25rem;">
        <div class="nds-th__action">
          <span class="nds-assistive-text">Actions</span>
        </div>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr class="nds-hint-parent">
      <td class="nds-text-align_right" role="gridcell">
        <label class="nds-checkbox">
          <input type="checkbox" name="options" id="checkbox-01" tabindex="-1" value="on">
          <span class="nds-checkbox_faux"></span>
          <label class="nds-checkbox__label">
            <span class="nds-form-element__label nds-assistive-text">Select item 1</span>
          </label>
        </label>
      </td>
      <th class="nds-has-focus" scope="row" tabindex="0">
        <div class="nds-truncate" title="Acme - 1,200 Widgets">
          <a href="javascript:void(0);" tabindex="-1">Acme - 1,200 Widgets</a>
        </div>
      </th>
      <td role="gridcell">
        <div class="nds-truncate" title="Acme">Acme</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="4/10/15">4/10/15</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="Value Proposition">Value Proposition</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="30%">30%</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="$25,000,000">$25,000,000</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="jrogers@acme.com">
          <a href="javascript:void(0);" tabindex="-1">jrogers@acme.com</a>
        </div>
      </td>
      <td role="gridcell">
        <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" tabindex="-1" title="Show More">
          <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
          </svg>
          <span class="nds-assistive-text">Show More</span>
        </button>
      </td>
    </tr>
    <tr class="nds-hint-parent">
      <td class="nds-text-align_right" role="gridcell">
        <label class="nds-checkbox">
          <input type="checkbox" name="options" id="checkbox-02" tabindex="-1" value="on">
          <span class="nds-checkbox_faux"></span>
          <label class="nds-checkbox__label">
            <span class="nds-form-element__label nds-assistive-text">Select item 2</span>
          </label>
        </label>
      </td>
      <th scope="row">
        <div class="nds-truncate" title="Acme - 200 Widgets">
          <a href="javascript:void(0);" tabindex="-1">Acme - 200 Widgets</a>
        </div>
      </th>
      <td role="gridcell">
        <div class="nds-truncate" title="Acme">Acme</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="1/31/15">1/31/15</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="Prospecting">Prospecting</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="60%">60%</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="$5,000,000">$5,000,000</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="bob@acme.com">
          <a href="javascript:void(0);" tabindex="-1">bob@acme.com</a>
        </div>
      </td>
      <td role="gridcell">
        <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" tabindex="-1" title="Show More">
          <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
          </svg>
          <span class="nds-assistive-text">Show More</span>
        </button>
      </td>
    </tr>
    <tr class="nds-hint-parent">
      <td class="nds-text-align_right" role="gridcell">
        <label class="nds-checkbox">
          <input type="checkbox" name="options" id="checkbox-03" tabindex="-1" value="on">
          <span class="nds-checkbox_faux"></span>
          <label class="nds-checkbox__label">
            <span class="nds-form-element__label nds-assistive-text">Select item 3</span>
          </label>
        </label>
      </td>
      <th scope="row">
        <div class="nds-truncate" title="salesforce.com - 1,000 Widgets">
          <a href="javascript:void(0);" tabindex="-1">salesforce.com - 1,000 Widgets</a>
        </div>
      </th>
      <td role="gridcell">
        <div class="nds-truncate" title="salesforce.com">salesforce.com</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="1/31/15 3:45PM">1/31/15 3:45PM</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="Id. Decision Makers">Id. Decision Makers</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="70%">70%</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="$25,000">$25,000</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="nathan@salesforce.com">
          <a href="javascript:void(0);" tabindex="-1">nathan@salesforce.com</a>
        </div>
      </td>
      <td role="gridcell">
        <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" tabindex="-1" title="Show More">
          <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
          </svg>
          <span class="nds-assistive-text">Show More</span>
        </button>
      </td>
    </tr>
  </tbody>
</table>`);
  })
  .add('Actionable Mode (states)', () => {
    return withExample(`<table class="nds-table nds-table_bordered nds-table_resizable-cols nds-table_fixed-layout" role="grid">
  <thead>
    <tr class="nds-line-height_reset">
      <th class="nds-text-align_right" scope="col" style="width: 3.25rem;">
        <div class="nds-th__action nds-th__action_form">
          <label class="nds-checkbox">
            <input type="checkbox" name="options" id="checkbox-41" tabindex="0" value="on">
            <span class="nds-checkbox_faux"></span>
            <label class="nds-checkbox__label">
              <span class="nds-form-element__label nds-assistive-text">Select All</span>
            </label>
          </label>
        </div>
      </th>
      <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Name" scope="col">
        <a class="nds-th__action nds-text-link_reset" href="javascript:void(0);" role="button" tabindex="0">
          <span class="nds-assistive-text">Sort by: </span>
          <span class="nds-truncate" title="Name">Name</span>
          <div class="nds-icon_container">
            <svg class="nds-icon nds-icon_x-small nds-icon-text-default nds-is-sortable__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
          </div>
        </a>
        <span class="nds-assistive-text" aria-live="assertive" aria-atomic="true">
          Sorted

          none

        </span>
        <div class="nds-resizable">
          <input type="range" min="20" max="1000" aria-label="Name column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-71" tabindex="0">
          <span class="nds-resizable__handle">
            <span class="nds-resizable__divider"></span>
          </span>
        </div>
      </th>
      <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Account Name" scope="col">
        <a class="nds-th__action nds-text-link_reset" href="javascript:void(0);" role="button" tabindex="0">
          <span class="nds-assistive-text">Sort by: </span>
          <span class="nds-truncate" title="Account Name">Account Name</span>
          <div class="nds-icon_container">
            <svg class="nds-icon nds-icon_x-small nds-icon-text-default nds-is-sortable__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
          </div>
        </a>
        <span class="nds-assistive-text" aria-live="assertive" aria-atomic="true">
          Sorted

          none

        </span>
        <div class="nds-resizable">
          <input type="range" min="20" max="1000" aria-label="Account Name column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-72" tabindex="0">
          <span class="nds-resizable__handle">
            <span class="nds-resizable__divider"></span>
          </span>
        </div>
      </th>
      <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Close Date" scope="col">
        <a class="nds-th__action nds-text-link_reset" href="javascript:void(0);" role="button" tabindex="0">
          <span class="nds-assistive-text">Sort by: </span>
          <span class="nds-truncate" title="Close Date">Close Date</span>
          <div class="nds-icon_container">
            <svg class="nds-icon nds-icon_x-small nds-icon-text-default nds-is-sortable__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
          </div>
        </a>
        <span class="nds-assistive-text" aria-live="assertive" aria-atomic="true">
          Sorted

          none

        </span>
        <div class="nds-resizable">
          <input type="range" min="20" max="1000" aria-label="Close Date column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-73" tabindex="0">
          <span class="nds-resizable__handle">
            <span class="nds-resizable__divider"></span>
          </span>
        </div>
      </th>
      <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Stage" scope="col">
        <a class="nds-th__action nds-text-link_reset" href="javascript:void(0);" role="button" tabindex="0">
          <span class="nds-assistive-text">Sort by: </span>
          <span class="nds-truncate" title="Stage">Stage</span>
          <div class="nds-icon_container">
            <svg class="nds-icon nds-icon_x-small nds-icon-text-default nds-is-sortable__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
          </div>
        </a>
        <span class="nds-assistive-text" aria-live="assertive" aria-atomic="true">
          Sorted

          none

        </span>
        <div class="nds-resizable">
          <input type="range" min="20" max="1000" aria-label="Stage column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-74" tabindex="0">
          <span class="nds-resizable__handle">
            <span class="nds-resizable__divider"></span>
          </span>
        </div>
      </th>
      <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Confidence" scope="col">
        <a class="nds-th__action nds-text-link_reset" href="javascript:void(0);" role="button" tabindex="0">
          <span class="nds-assistive-text">Sort by: </span>
          <span class="nds-truncate" title="Confidence">Confidence</span>
          <div class="nds-icon_container">
            <svg class="nds-icon nds-icon_x-small nds-icon-text-default nds-is-sortable__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
          </div>
        </a>
        <span class="nds-assistive-text" aria-live="assertive" aria-atomic="true">
          Sorted

          none

        </span>
        <div class="nds-resizable">
          <input type="range" min="20" max="1000" aria-label="Confidence column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-75" tabindex="0">
          <span class="nds-resizable__handle">
            <span class="nds-resizable__divider"></span>
          </span>
        </div>
      </th>
      <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Amount" scope="col">
        <a class="nds-th__action nds-text-link_reset" href="javascript:void(0);" role="button" tabindex="0">
          <span class="nds-assistive-text">Sort by: </span>
          <span class="nds-truncate" title="Amount">Amount</span>
          <div class="nds-icon_container">
            <svg class="nds-icon nds-icon_x-small nds-icon-text-default nds-is-sortable__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
          </div>
        </a>
        <span class="nds-assistive-text" aria-live="assertive" aria-atomic="true">
          Sorted

          none

        </span>
        <div class="nds-resizable">
          <input type="range" min="20" max="1000" aria-label="Amount column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-76" tabindex="0">
          <span class="nds-resizable__handle">
            <span class="nds-resizable__divider"></span>
          </span>
        </div>
      </th>
      <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Contact" scope="col">
        <a class="nds-th__action nds-text-link_reset" href="javascript:void(0);" role="button" tabindex="0">
          <span class="nds-assistive-text">Sort by: </span>
          <span class="nds-truncate" title="Contact">Contact</span>
          <div class="nds-icon_container">
            <svg class="nds-icon nds-icon_x-small nds-icon-text-default nds-is-sortable__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
          </div>
        </a>
        <span class="nds-assistive-text" aria-live="assertive" aria-atomic="true">
          Sorted

          none

        </span>
        <div class="nds-resizable">
          <input type="range" min="20" max="1000" aria-label="Contact column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-77" tabindex="0">
          <span class="nds-resizable__handle">
            <span class="nds-resizable__divider"></span>
          </span>
        </div>
      </th>
      <th scope="col" style="width: 3.25rem;">
        <div class="nds-th__action">
          <span class="nds-assistive-text">Actions</span>
        </div>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr class="nds-hint-parent">
      <td class="nds-text-align_right" role="gridcell">
        <label class="nds-checkbox">
          <input type="checkbox" name="options" id="checkbox-01" tabindex="0" value="on">
          <span class="nds-checkbox_faux"></span>
          <label class="nds-checkbox__label">
            <span class="nds-form-element__label nds-assistive-text">Select item 1</span>
          </label>
        </label>
      </td>
      <th scope="row">
        <div class="nds-truncate" title="Acme - 1,200 Widgets">
          <a href="javascript:void(0);" tabindex="0">Acme - 1,200 Widgets</a>
        </div>
      </th>
      <td role="gridcell">
        <div class="nds-truncate" title="Acme">Acme</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="4/10/15">4/10/15</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="Value Proposition">Value Proposition</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="30%">30%</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="$25,000,000">$25,000,000</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="jrogers@acme.com">
          <a href="javascript:void(0);" tabindex="0">jrogers@acme.com</a>
        </div>
      </td>
      <td role="gridcell">
        <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" tabindex="0" title="Show More">
          <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
          </svg>
          <span class="nds-assistive-text">Show More</span>
        </button>
      </td>
    </tr>
    <tr class="nds-hint-parent">
      <td class="nds-text-align_right" role="gridcell">
        <label class="nds-checkbox">
          <input type="checkbox" name="options" id="checkbox-02" tabindex="0" value="on">
          <span class="nds-checkbox_faux"></span>
          <label class="nds-checkbox__label">
            <span class="nds-form-element__label nds-assistive-text">Select item 2</span>
          </label>
        </label>
      </td>
      <th scope="row">
        <div class="nds-truncate" title="Acme - 200 Widgets">
          <a href="javascript:void(0);" tabindex="0">Acme - 200 Widgets</a>
        </div>
      </th>
      <td role="gridcell">
        <div class="nds-truncate" title="Acme">Acme</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="1/31/15">1/31/15</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="Prospecting">Prospecting</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="60%">60%</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="$5,000,000">$5,000,000</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="bob@acme.com">
          <a href="javascript:void(0);" tabindex="0">bob@acme.com</a>
        </div>
      </td>
      <td role="gridcell">
        <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" tabindex="0" title="Show More">
          <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
          </svg>
          <span class="nds-assistive-text">Show More</span>
        </button>
      </td>
    </tr>
    <tr class="nds-hint-parent">
      <td class="nds-text-align_right" role="gridcell">
        <label class="nds-checkbox">
          <input type="checkbox" name="options" id="checkbox-03" tabindex="0" value="on">
          <span class="nds-checkbox_faux"></span>
          <label class="nds-checkbox__label">
            <span class="nds-form-element__label nds-assistive-text">Select item 3</span>
          </label>
        </label>
      </td>
      <th scope="row">
        <div class="nds-truncate" title="salesforce.com - 1,000 Widgets">
          <a href="javascript:void(0);" tabindex="0">salesforce.com - 1,000 Widgets</a>
        </div>
      </th>
      <td role="gridcell">
        <div class="nds-truncate" title="salesforce.com">salesforce.com</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="1/31/15 3:45PM">1/31/15 3:45PM</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="Id. Decision Makers">Id. Decision Makers</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="70%">70%</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="$25,000">$25,000</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="nathan@salesforce.com">
          <a href="javascript:void(0);" tabindex="0">nathan@salesforce.com</a>
        </div>
      </td>
      <td role="gridcell">
        <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" tabindex="0" title="Show More">
          <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
          </svg>
          <span class="nds-assistive-text">Show More</span>
        </button>
      </td>
    </tr>
  </tbody>
</table>`);
  })
  .add('Row Selected (states)', () => {
    return withExample(`<table class="nds-table nds-table_bordered nds-table_resizable-cols nds-table_fixed-layout" role="grid">
  <thead>
    <tr class="nds-line-height_reset">
      <th class="nds-text-align_right" scope="col" style="width: 3.25rem;">
        <div class="nds-th__action nds-th__action_form">
          <label class="nds-checkbox">
            <input type="checkbox" name="options" id="checkbox-45" tabindex="0" value="on">
            <span class="nds-checkbox_faux"></span>
            <label class="nds-checkbox__label">
              <span class="nds-form-element__label nds-assistive-text">Select All</span>
            </label>
          </label>
        </div>
      </th>
      <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Name" scope="col">
        <a class="nds-th__action nds-text-link_reset" href="javascript:void(0);" role="button" tabindex="0">
          <span class="nds-assistive-text">Sort by: </span>
          <span class="nds-truncate" title="Name">Name</span>
          <div class="nds-icon_container">
            <svg class="nds-icon nds-icon_x-small nds-icon-text-default nds-is-sortable__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
          </div>
        </a>
        <span class="nds-assistive-text" aria-live="assertive" aria-atomic="true">
          Sorted

          none

        </span>
        <div class="nds-resizable">
          <input type="range" min="20" max="1000" aria-label="Name column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-78" tabindex="0">
          <span class="nds-resizable__handle">
            <span class="nds-resizable__divider"></span>
          </span>
        </div>
      </th>
      <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Account Name" scope="col">
        <a class="nds-th__action nds-text-link_reset" href="javascript:void(0);" role="button" tabindex="0">
          <span class="nds-assistive-text">Sort by: </span>
          <span class="nds-truncate" title="Account Name">Account Name</span>
          <div class="nds-icon_container">
            <svg class="nds-icon nds-icon_x-small nds-icon-text-default nds-is-sortable__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
          </div>
        </a>
        <span class="nds-assistive-text" aria-live="assertive" aria-atomic="true">
          Sorted

          none

        </span>
        <div class="nds-resizable">
          <input type="range" min="20" max="1000" aria-label="Account Name column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-79" tabindex="0">
          <span class="nds-resizable__handle">
            <span class="nds-resizable__divider"></span>
          </span>
        </div>
      </th>
      <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Close Date" scope="col">
        <a class="nds-th__action nds-text-link_reset" href="javascript:void(0);" role="button" tabindex="0">
          <span class="nds-assistive-text">Sort by: </span>
          <span class="nds-truncate" title="Close Date">Close Date</span>
          <div class="nds-icon_container">
            <svg class="nds-icon nds-icon_x-small nds-icon-text-default nds-is-sortable__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
          </div>
        </a>
        <span class="nds-assistive-text" aria-live="assertive" aria-atomic="true">
          Sorted

          none

        </span>
        <div class="nds-resizable">
          <input type="range" min="20" max="1000" aria-label="Close Date column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-80" tabindex="0">
          <span class="nds-resizable__handle">
            <span class="nds-resizable__divider"></span>
          </span>
        </div>
      </th>
      <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Stage" scope="col">
        <a class="nds-th__action nds-text-link_reset" href="javascript:void(0);" role="button" tabindex="0">
          <span class="nds-assistive-text">Sort by: </span>
          <span class="nds-truncate" title="Stage">Stage</span>
          <div class="nds-icon_container">
            <svg class="nds-icon nds-icon_x-small nds-icon-text-default nds-is-sortable__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
          </div>
        </a>
        <span class="nds-assistive-text" aria-live="assertive" aria-atomic="true">
          Sorted

          none

        </span>
        <div class="nds-resizable">
          <input type="range" min="20" max="1000" aria-label="Stage column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-81" tabindex="0">
          <span class="nds-resizable__handle">
            <span class="nds-resizable__divider"></span>
          </span>
        </div>
      </th>
      <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Confidence" scope="col">
        <a class="nds-th__action nds-text-link_reset" href="javascript:void(0);" role="button" tabindex="0">
          <span class="nds-assistive-text">Sort by: </span>
          <span class="nds-truncate" title="Confidence">Confidence</span>
          <div class="nds-icon_container">
            <svg class="nds-icon nds-icon_x-small nds-icon-text-default nds-is-sortable__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
          </div>
        </a>
        <span class="nds-assistive-text" aria-live="assertive" aria-atomic="true">
          Sorted

          none

        </span>
        <div class="nds-resizable">
          <input type="range" min="20" max="1000" aria-label="Confidence column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-82" tabindex="0">
          <span class="nds-resizable__handle">
            <span class="nds-resizable__divider"></span>
          </span>
        </div>
      </th>
      <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Amount" scope="col">
        <a class="nds-th__action nds-text-link_reset" href="javascript:void(0);" role="button" tabindex="0">
          <span class="nds-assistive-text">Sort by: </span>
          <span class="nds-truncate" title="Amount">Amount</span>
          <div class="nds-icon_container">
            <svg class="nds-icon nds-icon_x-small nds-icon-text-default nds-is-sortable__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
          </div>
        </a>
        <span class="nds-assistive-text" aria-live="assertive" aria-atomic="true">
          Sorted

          none

        </span>
        <div class="nds-resizable">
          <input type="range" min="20" max="1000" aria-label="Amount column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-83" tabindex="0">
          <span class="nds-resizable__handle">
            <span class="nds-resizable__divider"></span>
          </span>
        </div>
      </th>
      <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Contact" scope="col">
        <a class="nds-th__action nds-text-link_reset" href="javascript:void(0);" role="button" tabindex="0">
          <span class="nds-assistive-text">Sort by: </span>
          <span class="nds-truncate" title="Contact">Contact</span>
          <div class="nds-icon_container">
            <svg class="nds-icon nds-icon_x-small nds-icon-text-default nds-is-sortable__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
          </div>
        </a>
        <span class="nds-assistive-text" aria-live="assertive" aria-atomic="true">
          Sorted

          none

        </span>
        <div class="nds-resizable">
          <input type="range" min="20" max="1000" aria-label="Contact column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-84" tabindex="0">
          <span class="nds-resizable__handle">
            <span class="nds-resizable__divider"></span>
          </span>
        </div>
      </th>
      <th scope="col" style="width: 3.25rem;">
        <div class="nds-th__action">
          <span class="nds-assistive-text">Actions</span>
        </div>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr class="nds-hint-parent">
      <td class="nds-text-align_right" role="gridcell">
        <label class="nds-checkbox">
          <input type="checkbox" name="options" id="checkbox-01" tabindex="0" value="on">
          <span class="nds-checkbox_faux"></span>
          <label class="nds-checkbox__label">
            <span class="nds-form-element__label nds-assistive-text">Select item 1</span>
          </label>
        </label>
      </td>
      <th scope="row">
        <div class="nds-truncate" title="Acme - 1,200 Widgets">
          <a href="javascript:void(0);" tabindex="0">Acme - 1,200 Widgets</a>
        </div>
      </th>
      <td role="gridcell">
        <div class="nds-truncate" title="Acme">Acme</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="4/10/15">4/10/15</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="Value Proposition">Value Proposition</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="30%">30%</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="$25,000,000">$25,000,000</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="jrogers@acme.com">
          <a href="javascript:void(0);" tabindex="0">jrogers@acme.com</a>
        </div>
      </td>
      <td role="gridcell">
        <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" tabindex="0" title="Show More">
          <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
          </svg>
          <span class="nds-assistive-text">Show More</span>
        </button>
      </td>
    </tr>
    <tr class="nds-hint-parent nds-is-selected" aria-selected="true">
      <td class="nds-text-align_right" role="gridcell">
        <label class="nds-checkbox">
          <input type="checkbox" name="options" id="checkbox-02" tabindex="0" value="on">
          <span class="nds-checkbox_faux"></span>
          <label class="nds-checkbox__label">
            <span class="nds-form-element__label nds-assistive-text">Select item 2</span>
          </label>
        </label>
      </td>
      <th scope="row">
        <div class="nds-truncate" title="Acme - 200 Widgets">
          <a href="javascript:void(0);" tabindex="0">Acme - 200 Widgets</a>
        </div>
      </th>
      <td role="gridcell">
        <div class="nds-truncate" title="Acme">Acme</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="1/31/15">1/31/15</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="Prospecting">Prospecting</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="60%">60%</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="$5,000,000">$5,000,000</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="bob@acme.com">
          <a href="javascript:void(0);" tabindex="0">bob@acme.com</a>
        </div>
      </td>
      <td role="gridcell">
        <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" tabindex="0" title="Show More">
          <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
          </svg>
          <span class="nds-assistive-text">Show More</span>
        </button>
      </td>
    </tr>
    <tr class="nds-hint-parent">
      <td class="nds-text-align_right" role="gridcell">
        <label class="nds-checkbox">
          <input type="checkbox" name="options" id="checkbox-03" tabindex="0" value="on">
          <span class="nds-checkbox_faux"></span>
          <label class="nds-checkbox__label">
            <span class="nds-form-element__label nds-assistive-text">Select item 3</span>
          </label>
        </label>
      </td>
      <th scope="row">
        <div class="nds-truncate" title="salesforce.com - 1,000 Widgets">
          <a href="javascript:void(0);" tabindex="0">salesforce.com - 1,000 Widgets</a>
        </div>
      </th>
      <td role="gridcell">
        <div class="nds-truncate" title="salesforce.com">salesforce.com</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="1/31/15 3:45PM">1/31/15 3:45PM</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="Id. Decision Makers">Id. Decision Makers</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="70%">70%</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="$25,000">$25,000</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="nathan@salesforce.com">
          <a href="javascript:void(0);" tabindex="0">nathan@salesforce.com</a>
        </div>
      </td>
      <td role="gridcell">
        <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" tabindex="0" title="Show More">
          <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
          </svg>
          <span class="nds-assistive-text">Show More</span>
        </button>
      </td>
    </tr>
  </tbody>
</table>`);
  })
  .add('All Row Selected (states)', () => {
    return withExample(`<table class="nds-table nds-table_bordered nds-table_resizable-cols nds-table_fixed-layout" role="grid">
  <thead>
    <tr class="nds-line-height_reset">
      <th class="nds-text-align_right" scope="col" style="width: 3.25rem;">
        <div class="nds-th__action nds-th__action_form">
          <label class="nds-checkbox">
            <input type="checkbox" name="options" id="checkbox-49" tabindex="0" value="on">
            <span class="nds-checkbox_faux"></span>
            <label class="nds-checkbox__label">
              <span class="nds-form-element__label nds-assistive-text">Select All</span>
            </label>
          </label>
        </div>
      </th>
      <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Name" scope="col">
        <a class="nds-th__action nds-text-link_reset" href="javascript:void(0);" role="button" tabindex="0">
          <span class="nds-assistive-text">Sort by: </span>
          <span class="nds-truncate" title="Name">Name</span>
          <div class="nds-icon_container">
            <svg class="nds-icon nds-icon_x-small nds-icon-text-default nds-is-sortable__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
          </div>
        </a>
        <span class="nds-assistive-text" aria-live="assertive" aria-atomic="true">
          Sorted

          none

        </span>
        <div class="nds-resizable">
          <input type="range" min="20" max="1000" aria-label="Name column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-85" tabindex="0">
          <span class="nds-resizable__handle">
            <span class="nds-resizable__divider"></span>
          </span>
        </div>
      </th>
      <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Account Name" scope="col">
        <a class="nds-th__action nds-text-link_reset" href="javascript:void(0);" role="button" tabindex="0">
          <span class="nds-assistive-text">Sort by: </span>
          <span class="nds-truncate" title="Account Name">Account Name</span>
          <div class="nds-icon_container">
            <svg class="nds-icon nds-icon_x-small nds-icon-text-default nds-is-sortable__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
          </div>
        </a>
        <span class="nds-assistive-text" aria-live="assertive" aria-atomic="true">
          Sorted

          none

        </span>
        <div class="nds-resizable">
          <input type="range" min="20" max="1000" aria-label="Account Name column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-86" tabindex="0">
          <span class="nds-resizable__handle">
            <span class="nds-resizable__divider"></span>
          </span>
        </div>
      </th>
      <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Close Date" scope="col">
        <a class="nds-th__action nds-text-link_reset" href="javascript:void(0);" role="button" tabindex="0">
          <span class="nds-assistive-text">Sort by: </span>
          <span class="nds-truncate" title="Close Date">Close Date</span>
          <div class="nds-icon_container">
            <svg class="nds-icon nds-icon_x-small nds-icon-text-default nds-is-sortable__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
          </div>
        </a>
        <span class="nds-assistive-text" aria-live="assertive" aria-atomic="true">
          Sorted

          none

        </span>
        <div class="nds-resizable">
          <input type="range" min="20" max="1000" aria-label="Close Date column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-87" tabindex="0">
          <span class="nds-resizable__handle">
            <span class="nds-resizable__divider"></span>
          </span>
        </div>
      </th>
      <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Stage" scope="col">
        <a class="nds-th__action nds-text-link_reset" href="javascript:void(0);" role="button" tabindex="0">
          <span class="nds-assistive-text">Sort by: </span>
          <span class="nds-truncate" title="Stage">Stage</span>
          <div class="nds-icon_container">
            <svg class="nds-icon nds-icon_x-small nds-icon-text-default nds-is-sortable__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
          </div>
        </a>
        <span class="nds-assistive-text" aria-live="assertive" aria-atomic="true">
          Sorted

          none

        </span>
        <div class="nds-resizable">
          <input type="range" min="20" max="1000" aria-label="Stage column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-88" tabindex="0">
          <span class="nds-resizable__handle">
            <span class="nds-resizable__divider"></span>
          </span>
        </div>
      </th>
      <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Confidence" scope="col">
        <a class="nds-th__action nds-text-link_reset" href="javascript:void(0);" role="button" tabindex="0">
          <span class="nds-assistive-text">Sort by: </span>
          <span class="nds-truncate" title="Confidence">Confidence</span>
          <div class="nds-icon_container">
            <svg class="nds-icon nds-icon_x-small nds-icon-text-default nds-is-sortable__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
          </div>
        </a>
        <span class="nds-assistive-text" aria-live="assertive" aria-atomic="true">
          Sorted

          none

        </span>
        <div class="nds-resizable">
          <input type="range" min="20" max="1000" aria-label="Confidence column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-89" tabindex="0">
          <span class="nds-resizable__handle">
            <span class="nds-resizable__divider"></span>
          </span>
        </div>
      </th>
      <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Amount" scope="col">
        <a class="nds-th__action nds-text-link_reset" href="javascript:void(0);" role="button" tabindex="0">
          <span class="nds-assistive-text">Sort by: </span>
          <span class="nds-truncate" title="Amount">Amount</span>
          <div class="nds-icon_container">
            <svg class="nds-icon nds-icon_x-small nds-icon-text-default nds-is-sortable__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
          </div>
        </a>
        <span class="nds-assistive-text" aria-live="assertive" aria-atomic="true">
          Sorted

          none

        </span>
        <div class="nds-resizable">
          <input type="range" min="20" max="1000" aria-label="Amount column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-90" tabindex="0">
          <span class="nds-resizable__handle">
            <span class="nds-resizable__divider"></span>
          </span>
        </div>
      </th>
      <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Contact" scope="col">
        <a class="nds-th__action nds-text-link_reset" href="javascript:void(0);" role="button" tabindex="0">
          <span class="nds-assistive-text">Sort by: </span>
          <span class="nds-truncate" title="Contact">Contact</span>
          <div class="nds-icon_container">
            <svg class="nds-icon nds-icon_x-small nds-icon-text-default nds-is-sortable__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
          </div>
        </a>
        <span class="nds-assistive-text" aria-live="assertive" aria-atomic="true">
          Sorted

          none

        </span>
        <div class="nds-resizable">
          <input type="range" min="20" max="1000" aria-label="Contact column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-91" tabindex="0">
          <span class="nds-resizable__handle">
            <span class="nds-resizable__divider"></span>
          </span>
        </div>
      </th>
      <th scope="col" style="width: 3.25rem;">
        <div class="nds-th__action">
          <span class="nds-assistive-text">Actions</span>
        </div>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr class="nds-hint-parent nds-is-selected" aria-selected="true">
      <td class="nds-text-align_right" role="gridcell">
        <label class="nds-checkbox">
          <input type="checkbox" name="options" id="checkbox-01" tabindex="0" value="on">
          <span class="nds-checkbox_faux"></span>
          <label class="nds-checkbox__label">
            <span class="nds-form-element__label nds-assistive-text">Select item 1</span>
          </label>
        </label>
      </td>
      <th scope="row">
        <div class="nds-truncate" title="Acme - 1,200 Widgets">
          <a href="javascript:void(0);" tabindex="0">Acme - 1,200 Widgets</a>
        </div>
      </th>
      <td role="gridcell">
        <div class="nds-truncate" title="Acme">Acme</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="4/10/15">4/10/15</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="Value Proposition">Value Proposition</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="30%">30%</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="$25,000,000">$25,000,000</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="jrogers@acme.com">
          <a href="javascript:void(0);" tabindex="0">jrogers@acme.com</a>
        </div>
      </td>
      <td role="gridcell">
        <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" tabindex="0" title="Show More">
          <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
          </svg>
          <span class="nds-assistive-text">Show More</span>
        </button>
      </td>
    </tr>
    <tr class="nds-hint-parent nds-is-selected" aria-selected="true">
      <td class="nds-text-align_right" role="gridcell">
        <label class="nds-checkbox">
          <input type="checkbox" name="options" id="checkbox-02" tabindex="0" value="on">
          <span class="nds-checkbox_faux"></span>
          <label class="nds-checkbox__label">
            <span class="nds-form-element__label nds-assistive-text">Select item 2</span>
          </label>
        </label>
      </td>
      <th scope="row">
        <div class="nds-truncate" title="Acme - 200 Widgets">
          <a href="javascript:void(0);" tabindex="0">Acme - 200 Widgets</a>
        </div>
      </th>
      <td role="gridcell">
        <div class="nds-truncate" title="Acme">Acme</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="1/31/15">1/31/15</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="Prospecting">Prospecting</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="60%">60%</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="$5,000,000">$5,000,000</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="bob@acme.com">
          <a href="javascript:void(0);" tabindex="0">bob@acme.com</a>
        </div>
      </td>
      <td role="gridcell">
        <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" tabindex="0" title="Show More">
          <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
          </svg>
          <span class="nds-assistive-text">Show More</span>
        </button>
      </td>
    </tr>
    <tr class="nds-hint-parent nds-is-selected" aria-selected="true">
      <td class="nds-text-align_right" role="gridcell">
        <label class="nds-checkbox">
          <input type="checkbox" name="options" id="checkbox-03" tabindex="0" value="on">
          <span class="nds-checkbox_faux"></span>
          <label class="nds-checkbox__label">
            <span class="nds-form-element__label nds-assistive-text">Select item 3</span>
          </label>
        </label>
      </td>
      <th scope="row">
        <div class="nds-truncate" title="salesforce.com - 1,000 Widgets">
          <a href="javascript:void(0);" tabindex="0">salesforce.com - 1,000 Widgets</a>
        </div>
      </th>
      <td role="gridcell">
        <div class="nds-truncate" title="salesforce.com">salesforce.com</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="1/31/15 3:45PM">1/31/15 3:45PM</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="Id. Decision Makers">Id. Decision Makers</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="70%">70%</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="$25,000">$25,000</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="nathan@salesforce.com">
          <a href="javascript:void(0);" tabindex="0">nathan@salesforce.com</a>
        </div>
      </td>
      <td role="gridcell">
        <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" tabindex="0" title="Show More">
          <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
          </svg>
          <span class="nds-assistive-text">Show More</span>
        </button>
      </td>
    </tr>
  </tbody>
</table>`);
  })
  .add('Sorted Column Asc (states)', () => {
    return withExample(`<table class="nds-table nds-table_bordered nds-table_resizable-cols nds-table_fixed-layout" role="grid">
  <thead>
    <tr class="nds-line-height_reset">
      <th class="nds-text-align_right" scope="col" style="width: 3.25rem;">
        <div class="nds-th__action nds-th__action_form">
          <label class="nds-checkbox">
            <input type="checkbox" name="options" id="checkbox-53" tabindex="0" value="on">
            <span class="nds-checkbox_faux"></span>
            <label class="nds-checkbox__label">
              <span class="nds-form-element__label nds-assistive-text">Select All</span>
            </label>
          </label>
        </div>
      </th>
      <th aria-sort="ascending" class="nds-is-sortable nds-is-resizable nds-text-title_caps nds-is-sorted nds-is-sorted_asc" aria-label="Name" scope="col">
        <a class="nds-th__action nds-text-link_reset" href="javascript:void(0);" role="button" tabindex="0">
          <span class="nds-assistive-text">Sort by: </span>
          <span class="nds-truncate" title="Name">Name</span>
          <div class="nds-icon_container">
            <svg class="nds-icon nds-icon_x-small nds-icon-text-default nds-is-sortable__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
          </div>
        </a>
        <span class="nds-assistive-text" aria-live="assertive" aria-atomic="true">
          Sorted

          ascending

        </span>
        <div class="nds-resizable">
          <input type="range" min="20" max="1000" aria-label="Name column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-92" tabindex="0">
          <span class="nds-resizable__handle">
            <span class="nds-resizable__divider"></span>
          </span>
        </div>
      </th>
      <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Account Name" scope="col">
        <a class="nds-th__action nds-text-link_reset" href="javascript:void(0);" role="button" tabindex="0">
          <span class="nds-assistive-text">Sort by: </span>
          <span class="nds-truncate" title="Account Name">Account Name</span>
          <div class="nds-icon_container">
            <svg class="nds-icon nds-icon_x-small nds-icon-text-default nds-is-sortable__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
          </div>
        </a>
        <span class="nds-assistive-text" aria-live="assertive" aria-atomic="true">
          Sorted

          none

        </span>
        <div class="nds-resizable">
          <input type="range" min="20" max="1000" aria-label="Account Name column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-93" tabindex="0">
          <span class="nds-resizable__handle">
            <span class="nds-resizable__divider"></span>
          </span>
        </div>
      </th>
      <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Close Date" scope="col">
        <a class="nds-th__action nds-text-link_reset" href="javascript:void(0);" role="button" tabindex="0">
          <span class="nds-assistive-text">Sort by: </span>
          <span class="nds-truncate" title="Close Date">Close Date</span>
          <div class="nds-icon_container">
            <svg class="nds-icon nds-icon_x-small nds-icon-text-default nds-is-sortable__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
          </div>
        </a>
        <span class="nds-assistive-text" aria-live="assertive" aria-atomic="true">
          Sorted

          none

        </span>
        <div class="nds-resizable">
          <input type="range" min="20" max="1000" aria-label="Close Date column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-94" tabindex="0">
          <span class="nds-resizable__handle">
            <span class="nds-resizable__divider"></span>
          </span>
        </div>
      </th>
      <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Stage" scope="col">
        <a class="nds-th__action nds-text-link_reset" href="javascript:void(0);" role="button" tabindex="0">
          <span class="nds-assistive-text">Sort by: </span>
          <span class="nds-truncate" title="Stage">Stage</span>
          <div class="nds-icon_container">
            <svg class="nds-icon nds-icon_x-small nds-icon-text-default nds-is-sortable__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
          </div>
        </a>
        <span class="nds-assistive-text" aria-live="assertive" aria-atomic="true">
          Sorted

          none

        </span>
        <div class="nds-resizable">
          <input type="range" min="20" max="1000" aria-label="Stage column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-95" tabindex="0">
          <span class="nds-resizable__handle">
            <span class="nds-resizable__divider"></span>
          </span>
        </div>
      </th>
      <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Confidence" scope="col">
        <a class="nds-th__action nds-text-link_reset" href="javascript:void(0);" role="button" tabindex="0">
          <span class="nds-assistive-text">Sort by: </span>
          <span class="nds-truncate" title="Confidence">Confidence</span>
          <div class="nds-icon_container">
            <svg class="nds-icon nds-icon_x-small nds-icon-text-default nds-is-sortable__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
          </div>
        </a>
        <span class="nds-assistive-text" aria-live="assertive" aria-atomic="true">
          Sorted

          none

        </span>
        <div class="nds-resizable">
          <input type="range" min="20" max="1000" aria-label="Confidence column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-96" tabindex="0">
          <span class="nds-resizable__handle">
            <span class="nds-resizable__divider"></span>
          </span>
        </div>
      </th>
      <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Amount" scope="col">
        <a class="nds-th__action nds-text-link_reset" href="javascript:void(0);" role="button" tabindex="0">
          <span class="nds-assistive-text">Sort by: </span>
          <span class="nds-truncate" title="Amount">Amount</span>
          <div class="nds-icon_container">
            <svg class="nds-icon nds-icon_x-small nds-icon-text-default nds-is-sortable__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
          </div>
        </a>
        <span class="nds-assistive-text" aria-live="assertive" aria-atomic="true">
          Sorted

          none

        </span>
        <div class="nds-resizable">
          <input type="range" min="20" max="1000" aria-label="Amount column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-97" tabindex="0">
          <span class="nds-resizable__handle">
            <span class="nds-resizable__divider"></span>
          </span>
        </div>
      </th>
      <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Contact" scope="col">
        <a class="nds-th__action nds-text-link_reset" href="javascript:void(0);" role="button" tabindex="0">
          <span class="nds-assistive-text">Sort by: </span>
          <span class="nds-truncate" title="Contact">Contact</span>
          <div class="nds-icon_container">
            <svg class="nds-icon nds-icon_x-small nds-icon-text-default nds-is-sortable__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
          </div>
        </a>
        <span class="nds-assistive-text" aria-live="assertive" aria-atomic="true">
          Sorted

          none

        </span>
        <div class="nds-resizable">
          <input type="range" min="20" max="1000" aria-label="Contact column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-98" tabindex="0">
          <span class="nds-resizable__handle">
            <span class="nds-resizable__divider"></span>
          </span>
        </div>
      </th>
      <th scope="col" style="width: 3.25rem;">
        <div class="nds-th__action">
          <span class="nds-assistive-text">Actions</span>
        </div>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr class="nds-hint-parent">
      <td class="nds-text-align_right" role="gridcell">
        <label class="nds-checkbox">
          <input type="checkbox" name="options" id="checkbox-01" tabindex="0" value="on">
          <span class="nds-checkbox_faux"></span>
          <label class="nds-checkbox__label">
            <span class="nds-form-element__label nds-assistive-text">Select item 1</span>
          </label>
        </label>
      </td>
      <th scope="row">
        <div class="nds-truncate" title="Acme - 1,200 Widgets">
          <a href="javascript:void(0);" tabindex="0">Acme - 1,200 Widgets</a>
        </div>
      </th>
      <td role="gridcell">
        <div class="nds-truncate" title="Acme">Acme</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="4/10/15">4/10/15</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="Value Proposition">Value Proposition</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="30%">30%</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="$25,000,000">$25,000,000</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="jrogers@acme.com">
          <a href="javascript:void(0);" tabindex="0">jrogers@acme.com</a>
        </div>
      </td>
      <td role="gridcell">
        <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" tabindex="0" title="Show More">
          <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
          </svg>
          <span class="nds-assistive-text">Show More</span>
        </button>
      </td>
    </tr>
    <tr class="nds-hint-parent">
      <td class="nds-text-align_right" role="gridcell">
        <label class="nds-checkbox">
          <input type="checkbox" name="options" id="checkbox-02" tabindex="0" value="on">
          <span class="nds-checkbox_faux"></span>
          <label class="nds-checkbox__label">
            <span class="nds-form-element__label nds-assistive-text">Select item 2</span>
          </label>
        </label>
      </td>
      <th scope="row">
        <div class="nds-truncate" title="Acme - 200 Widgets">
          <a href="javascript:void(0);" tabindex="0">Acme - 200 Widgets</a>
        </div>
      </th>
      <td role="gridcell">
        <div class="nds-truncate" title="Acme">Acme</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="1/31/15">1/31/15</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="Prospecting">Prospecting</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="60%">60%</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="$5,000,000">$5,000,000</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="bob@acme.com">
          <a href="javascript:void(0);" tabindex="0">bob@acme.com</a>
        </div>
      </td>
      <td role="gridcell">
        <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" tabindex="0" title="Show More">
          <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
          </svg>
          <span class="nds-assistive-text">Show More</span>
        </button>
      </td>
    </tr>
    <tr class="nds-hint-parent">
      <td class="nds-text-align_right" role="gridcell">
        <label class="nds-checkbox">
          <input type="checkbox" name="options" id="checkbox-03" tabindex="0" value="on">
          <span class="nds-checkbox_faux"></span>
          <label class="nds-checkbox__label">
            <span class="nds-form-element__label nds-assistive-text">Select item 3</span>
          </label>
        </label>
      </td>
      <th scope="row">
        <div class="nds-truncate" title="salesforce.com - 1,000 Widgets">
          <a href="javascript:void(0);" tabindex="0">salesforce.com - 1,000 Widgets</a>
        </div>
      </th>
      <td role="gridcell">
        <div class="nds-truncate" title="salesforce.com">salesforce.com</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="1/31/15 3:45PM">1/31/15 3:45PM</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="Id. Decision Makers">Id. Decision Makers</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="70%">70%</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="$25,000">$25,000</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="nathan@salesforce.com">
          <a href="javascript:void(0);" tabindex="0">nathan@salesforce.com</a>
        </div>
      </td>
      <td role="gridcell">
        <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" tabindex="0" title="Show More">
          <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
          </svg>
          <span class="nds-assistive-text">Show More</span>
        </button>
      </td>
    </tr>
  </tbody>
</table>`);
  })
  .add('Sorted Column Desc (states)', () => {
    return withExample(`<table class="nds-table nds-table_bordered nds-table_resizable-cols nds-table_fixed-layout" role="grid">
  <thead>
    <tr class="nds-line-height_reset">
      <th class="nds-text-align_right" scope="col" style="width: 3.25rem;">
        <div class="nds-th__action nds-th__action_form">
          <label class="nds-checkbox">
            <input type="checkbox" name="options" id="checkbox-61" tabindex="0" value="on">
            <span class="nds-checkbox_faux"></span>
            <label class="nds-checkbox__label">
              <span class="nds-form-element__label nds-assistive-text">Select All</span>
            </label>
          </label>
        </div>
      </th>
      <th aria-sort="descending" class="nds-is-sortable nds-is-resizable nds-text-title_caps nds-is-sorted nds-is-sorted_desc" aria-label="Name" scope="col">
        <a class="nds-th__action nds-text-link_reset" href="javascript:void(0);" role="button" tabindex="0">
          <span class="nds-assistive-text">Sort by: </span>
          <span class="nds-truncate" title="Name">Name</span>
          <div class="nds-icon_container">
            <svg class="nds-icon nds-icon_x-small nds-icon-text-default nds-is-sortable__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
          </div>
        </a>
        <span class="nds-assistive-text" aria-live="assertive" aria-atomic="true">
          Sorted

          descending

        </span>
        <div class="nds-resizable">
          <input type="range" min="20" max="1000" aria-label="Name column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-106" tabindex="0">
          <span class="nds-resizable__handle">
            <span class="nds-resizable__divider"></span>
          </span>
        </div>
      </th>
      <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Account Name" scope="col">
        <a class="nds-th__action nds-text-link_reset" href="javascript:void(0);" role="button" tabindex="0">
          <span class="nds-assistive-text">Sort by: </span>
          <span class="nds-truncate" title="Account Name">Account Name</span>
          <div class="nds-icon_container">
            <svg class="nds-icon nds-icon_x-small nds-icon-text-default nds-is-sortable__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
          </div>
        </a>
        <span class="nds-assistive-text" aria-live="assertive" aria-atomic="true">
          Sorted

          none

        </span>
        <div class="nds-resizable">
          <input type="range" min="20" max="1000" aria-label="Account Name column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-107" tabindex="0">
          <span class="nds-resizable__handle">
            <span class="nds-resizable__divider"></span>
          </span>
        </div>
      </th>
      <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Close Date" scope="col">
        <a class="nds-th__action nds-text-link_reset" href="javascript:void(0);" role="button" tabindex="0">
          <span class="nds-assistive-text">Sort by: </span>
          <span class="nds-truncate" title="Close Date">Close Date</span>
          <div class="nds-icon_container">
            <svg class="nds-icon nds-icon_x-small nds-icon-text-default nds-is-sortable__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
          </div>
        </a>
        <span class="nds-assistive-text" aria-live="assertive" aria-atomic="true">
          Sorted

          none

        </span>
        <div class="nds-resizable">
          <input type="range" min="20" max="1000" aria-label="Close Date column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-108" tabindex="0">
          <span class="nds-resizable__handle">
            <span class="nds-resizable__divider"></span>
          </span>
        </div>
      </th>
      <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Stage" scope="col">
        <a class="nds-th__action nds-text-link_reset" href="javascript:void(0);" role="button" tabindex="0">
          <span class="nds-assistive-text">Sort by: </span>
          <span class="nds-truncate" title="Stage">Stage</span>
          <div class="nds-icon_container">
            <svg class="nds-icon nds-icon_x-small nds-icon-text-default nds-is-sortable__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
          </div>
        </a>
        <span class="nds-assistive-text" aria-live="assertive" aria-atomic="true">
          Sorted

          none

        </span>
        <div class="nds-resizable">
          <input type="range" min="20" max="1000" aria-label="Stage column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-109" tabindex="0">
          <span class="nds-resizable__handle">
            <span class="nds-resizable__divider"></span>
          </span>
        </div>
      </th>
      <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Confidence" scope="col">
        <a class="nds-th__action nds-text-link_reset" href="javascript:void(0);" role="button" tabindex="0">
          <span class="nds-assistive-text">Sort by: </span>
          <span class="nds-truncate" title="Confidence">Confidence</span>
          <div class="nds-icon_container">
            <svg class="nds-icon nds-icon_x-small nds-icon-text-default nds-is-sortable__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
          </div>
        </a>
        <span class="nds-assistive-text" aria-live="assertive" aria-atomic="true">
          Sorted

          none

        </span>
        <div class="nds-resizable">
          <input type="range" min="20" max="1000" aria-label="Confidence column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-110" tabindex="0">
          <span class="nds-resizable__handle">
            <span class="nds-resizable__divider"></span>
          </span>
        </div>
      </th>
      <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Amount" scope="col">
        <a class="nds-th__action nds-text-link_reset" href="javascript:void(0);" role="button" tabindex="0">
          <span class="nds-assistive-text">Sort by: </span>
          <span class="nds-truncate" title="Amount">Amount</span>
          <div class="nds-icon_container">
            <svg class="nds-icon nds-icon_x-small nds-icon-text-default nds-is-sortable__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
          </div>
        </a>
        <span class="nds-assistive-text" aria-live="assertive" aria-atomic="true">
          Sorted

          none

        </span>
        <div class="nds-resizable">
          <input type="range" min="20" max="1000" aria-label="Amount column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-111" tabindex="0">
          <span class="nds-resizable__handle">
            <span class="nds-resizable__divider"></span>
          </span>
        </div>
      </th>
      <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Contact" scope="col">
        <a class="nds-th__action nds-text-link_reset" href="javascript:void(0);" role="button" tabindex="0">
          <span class="nds-assistive-text">Sort by: </span>
          <span class="nds-truncate" title="Contact">Contact</span>
          <div class="nds-icon_container">
            <svg class="nds-icon nds-icon_x-small nds-icon-text-default nds-is-sortable__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
          </div>
        </a>
        <span class="nds-assistive-text" aria-live="assertive" aria-atomic="true">
          Sorted

          none

        </span>
        <div class="nds-resizable">
          <input type="range" min="20" max="1000" aria-label="Contact column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-112" tabindex="0">
          <span class="nds-resizable__handle">
            <span class="nds-resizable__divider"></span>
          </span>
        </div>
      </th>
      <th scope="col" style="width: 3.25rem;">
        <div class="nds-th__action">
          <span class="nds-assistive-text">Actions</span>
        </div>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr class="nds-hint-parent">
      <td class="nds-text-align_right" role="gridcell">
        <label class="nds-checkbox">
          <input type="checkbox" name="options" id="checkbox-03" tabindex="0" value="on">
          <span class="nds-checkbox_faux"></span>
          <label class="nds-checkbox__label">
            <span class="nds-form-element__label nds-assistive-text">Select item 3</span>
          </label>
        </label>
      </td>
      <th scope="row">
        <div class="nds-truncate" title="salesforce.com - 1,000 Widgets">
          <a href="javascript:void(0);" tabindex="0">salesforce.com - 1,000 Widgets</a>
        </div>
      </th>
      <td role="gridcell">
        <div class="nds-truncate" title="salesforce.com">salesforce.com</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="1/31/15 3:45PM">1/31/15 3:45PM</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="Id. Decision Makers">Id. Decision Makers</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="70%">70%</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="$25,000">$25,000</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="nathan@salesforce.com">
          <a href="javascript:void(0);" tabindex="0">nathan@salesforce.com</a>
        </div>
      </td>
      <td role="gridcell">
        <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" tabindex="0" title="Show More">
          <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
          </svg>
          <span class="nds-assistive-text">Show More</span>
        </button>
      </td>
    </tr>
    <tr class="nds-hint-parent">
      <td class="nds-text-align_right" role="gridcell">
        <label class="nds-checkbox">
          <input type="checkbox" name="options" id="checkbox-02" tabindex="0" value="on">
          <span class="nds-checkbox_faux"></span>
          <label class="nds-checkbox__label">
            <span class="nds-form-element__label nds-assistive-text">Select item 2</span>
          </label>
        </label>
      </td>
      <th scope="row">
        <div class="nds-truncate" title="Acme - 200 Widgets">
          <a href="javascript:void(0);" tabindex="0">Acme - 200 Widgets</a>
        </div>
      </th>
      <td role="gridcell">
        <div class="nds-truncate" title="Acme">Acme</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="1/31/15">1/31/15</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="Prospecting">Prospecting</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="60%">60%</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="$5,000,000">$5,000,000</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="bob@acme.com">
          <a href="javascript:void(0);" tabindex="0">bob@acme.com</a>
        </div>
      </td>
      <td role="gridcell">
        <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" tabindex="0" title="Show More">
          <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
          </svg>
          <span class="nds-assistive-text">Show More</span>
        </button>
      </td>
    </tr>
    <tr class="nds-hint-parent">
      <td class="nds-text-align_right" role="gridcell">
        <label class="nds-checkbox">
          <input type="checkbox" name="options" id="checkbox-01" tabindex="0" value="on">
          <span class="nds-checkbox_faux"></span>
          <label class="nds-checkbox__label">
            <span class="nds-form-element__label nds-assistive-text">Select item 1</span>
          </label>
        </label>
      </td>
      <th scope="row">
        <div class="nds-truncate" title="Acme - 1,200 Widgets">
          <a href="javascript:void(0);" tabindex="0">Acme - 1,200 Widgets</a>
        </div>
      </th>
      <td role="gridcell">
        <div class="nds-truncate" title="Acme">Acme</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="4/10/15">4/10/15</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="Value Proposition">Value Proposition</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="30%">30%</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="$25,000,000">$25,000,000</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="jrogers@acme.com">
          <a href="javascript:void(0);" tabindex="0">jrogers@acme.com</a>
        </div>
      </td>
      <td role="gridcell">
        <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" tabindex="0" title="Show More">
          <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
          </svg>
          <span class="nds-assistive-text">Show More</span>
        </button>
      </td>
    </tr>
  </tbody>
</table>`);
  })
  .add('Resized Column (states)', () => {
    return withExample(`<table class="nds-table nds-table_bordered nds-table_resizable-cols nds-table_fixed-layout" role="grid">
  <thead>
    <tr class="nds-line-height_reset">
      <th class="nds-text-align_right" scope="col" style="width: 3.25rem;">
        <div class="nds-th__action nds-th__action_form">
          <label class="nds-checkbox">
            <input type="checkbox" name="options" id="checkbox-57" tabindex="0" value="on">
            <span class="nds-checkbox_faux"></span>
            <label class="nds-checkbox__label">
              <span class="nds-form-element__label nds-assistive-text">Select All</span>
            </label>
          </label>
        </div>
      </th>
      <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Name" scope="col" style="width: 300px;">
        <a class="nds-th__action nds-text-link_reset" href="javascript:void(0);" role="button" tabindex="0">
          <span class="nds-assistive-text">Sort by: </span>
          <span class="nds-truncate" title="Name">Name</span>
          <div class="nds-icon_container">
            <svg class="nds-icon nds-icon_x-small nds-icon-text-default nds-is-sortable__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
          </div>
        </a>
        <span class="nds-assistive-text" aria-live="assertive" aria-atomic="true">
          Sorted

          none

        </span>
        <div class="nds-resizable">
          <input type="range" min="20" max="1000" aria-label="Name column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-99" tabindex="0">
          <span class="nds-resizable__handle">
            <span class="nds-resizable__divider"></span>
          </span>
        </div>
      </th>
      <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Account Name" scope="col">
        <a class="nds-th__action nds-text-link_reset" href="javascript:void(0);" role="button" tabindex="0">
          <span class="nds-assistive-text">Sort by: </span>
          <span class="nds-truncate" title="Account Name">Account Name</span>
          <div class="nds-icon_container">
            <svg class="nds-icon nds-icon_x-small nds-icon-text-default nds-is-sortable__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
          </div>
        </a>
        <span class="nds-assistive-text" aria-live="assertive" aria-atomic="true">
          Sorted

          none

        </span>
        <div class="nds-resizable">
          <input type="range" min="20" max="1000" aria-label="Account Name column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-100" tabindex="0">
          <span class="nds-resizable__handle">
            <span class="nds-resizable__divider"></span>
          </span>
        </div>
      </th>
      <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Close Date" scope="col">
        <a class="nds-th__action nds-text-link_reset" href="javascript:void(0);" role="button" tabindex="0">
          <span class="nds-assistive-text">Sort by: </span>
          <span class="nds-truncate" title="Close Date">Close Date</span>
          <div class="nds-icon_container">
            <svg class="nds-icon nds-icon_x-small nds-icon-text-default nds-is-sortable__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
          </div>
        </a>
        <span class="nds-assistive-text" aria-live="assertive" aria-atomic="true">
          Sorted

          none

        </span>
        <div class="nds-resizable">
          <input type="range" min="20" max="1000" aria-label="Close Date column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-101" tabindex="0">
          <span class="nds-resizable__handle">
            <span class="nds-resizable__divider"></span>
          </span>
        </div>
      </th>
      <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Stage" scope="col">
        <a class="nds-th__action nds-text-link_reset" href="javascript:void(0);" role="button" tabindex="0">
          <span class="nds-assistive-text">Sort by: </span>
          <span class="nds-truncate" title="Stage">Stage</span>
          <div class="nds-icon_container">
            <svg class="nds-icon nds-icon_x-small nds-icon-text-default nds-is-sortable__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
          </div>
        </a>
        <span class="nds-assistive-text" aria-live="assertive" aria-atomic="true">
          Sorted

          none

        </span>
        <div class="nds-resizable">
          <input type="range" min="20" max="1000" aria-label="Stage column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-102" tabindex="0">
          <span class="nds-resizable__handle">
            <span class="nds-resizable__divider"></span>
          </span>
        </div>
      </th>
      <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Confidence" scope="col">
        <a class="nds-th__action nds-text-link_reset" href="javascript:void(0);" role="button" tabindex="0">
          <span class="nds-assistive-text">Sort by: </span>
          <span class="nds-truncate" title="Confidence">Confidence</span>
          <div class="nds-icon_container">
            <svg class="nds-icon nds-icon_x-small nds-icon-text-default nds-is-sortable__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
          </div>
        </a>
        <span class="nds-assistive-text" aria-live="assertive" aria-atomic="true">
          Sorted

          none

        </span>
        <div class="nds-resizable">
          <input type="range" min="20" max="1000" aria-label="Confidence column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-103" tabindex="0">
          <span class="nds-resizable__handle">
            <span class="nds-resizable__divider"></span>
          </span>
        </div>
      </th>
      <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Amount" scope="col">
        <a class="nds-th__action nds-text-link_reset" href="javascript:void(0);" role="button" tabindex="0">
          <span class="nds-assistive-text">Sort by: </span>
          <span class="nds-truncate" title="Amount">Amount</span>
          <div class="nds-icon_container">
            <svg class="nds-icon nds-icon_x-small nds-icon-text-default nds-is-sortable__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
          </div>
        </a>
        <span class="nds-assistive-text" aria-live="assertive" aria-atomic="true">
          Sorted

          none

        </span>
        <div class="nds-resizable">
          <input type="range" min="20" max="1000" aria-label="Amount column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-104" tabindex="0">
          <span class="nds-resizable__handle">
            <span class="nds-resizable__divider"></span>
          </span>
        </div>
      </th>
      <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Contact" scope="col">
        <a class="nds-th__action nds-text-link_reset" href="javascript:void(0);" role="button" tabindex="0">
          <span class="nds-assistive-text">Sort by: </span>
          <span class="nds-truncate" title="Contact">Contact</span>
          <div class="nds-icon_container">
            <svg class="nds-icon nds-icon_x-small nds-icon-text-default nds-is-sortable__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
          </div>
        </a>
        <span class="nds-assistive-text" aria-live="assertive" aria-atomic="true">
          Sorted

          none

        </span>
        <div class="nds-resizable">
          <input type="range" min="20" max="1000" aria-label="Contact column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-105" tabindex="0">
          <span class="nds-resizable__handle">
            <span class="nds-resizable__divider"></span>
          </span>
        </div>
      </th>
      <th scope="col" style="width: 3.25rem;">
        <div class="nds-th__action">
          <span class="nds-assistive-text">Actions</span>
        </div>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr class="nds-hint-parent">
      <td class="nds-text-align_right" role="gridcell">
        <label class="nds-checkbox">
          <input type="checkbox" name="options" id="checkbox-01" tabindex="0" value="on">
          <span class="nds-checkbox_faux"></span>
          <label class="nds-checkbox__label">
            <span class="nds-form-element__label nds-assistive-text">Select item 1</span>
          </label>
        </label>
      </td>
      <th scope="row">
        <div class="nds-truncate" title="Acme - 1,200 Widgets">
          <a href="javascript:void(0);" tabindex="0">Acme - 1,200 Widgets</a>
        </div>
      </th>
      <td role="gridcell">
        <div class="nds-truncate" title="Acme">Acme</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="4/10/15">4/10/15</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="Value Proposition">Value Proposition</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="30%">30%</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="$25,000,000">$25,000,000</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="jrogers@acme.com">
          <a href="javascript:void(0);" tabindex="0">jrogers@acme.com</a>
        </div>
      </td>
      <td role="gridcell">
        <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" tabindex="0" title="Show More">
          <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
          </svg>
          <span class="nds-assistive-text">Show More</span>
        </button>
      </td>
    </tr>
    <tr class="nds-hint-parent">
      <td class="nds-text-align_right" role="gridcell">
        <label class="nds-checkbox">
          <input type="checkbox" name="options" id="checkbox-02" tabindex="0" value="on">
          <span class="nds-checkbox_faux"></span>
          <label class="nds-checkbox__label">
            <span class="nds-form-element__label nds-assistive-text">Select item 2</span>
          </label>
        </label>
      </td>
      <th scope="row">
        <div class="nds-truncate" title="Acme - 200 Widgets">
          <a href="javascript:void(0);" tabindex="0">Acme - 200 Widgets</a>
        </div>
      </th>
      <td role="gridcell">
        <div class="nds-truncate" title="Acme">Acme</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="1/31/15">1/31/15</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="Prospecting">Prospecting</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="60%">60%</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="$5,000,000">$5,000,000</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="bob@acme.com">
          <a href="javascript:void(0);" tabindex="0">bob@acme.com</a>
        </div>
      </td>
      <td role="gridcell">
        <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" tabindex="0" title="Show More">
          <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
          </svg>
          <span class="nds-assistive-text">Show More</span>
        </button>
      </td>
    </tr>
    <tr class="nds-hint-parent">
      <td class="nds-text-align_right" role="gridcell">
        <label class="nds-checkbox">
          <input type="checkbox" name="options" id="checkbox-03" tabindex="0" value="on">
          <span class="nds-checkbox_faux"></span>
          <label class="nds-checkbox__label">
            <span class="nds-form-element__label nds-assistive-text">Select item 3</span>
          </label>
        </label>
      </td>
      <th scope="row">
        <div class="nds-truncate" title="salesforce.com - 1,000 Widgets">
          <a href="javascript:void(0);" tabindex="0">salesforce.com - 1,000 Widgets</a>
        </div>
      </th>
      <td role="gridcell">
        <div class="nds-truncate" title="salesforce.com">salesforce.com</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="1/31/15 3:45PM">1/31/15 3:45PM</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="Id. Decision Makers">Id. Decision Makers</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="70%">70%</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="$25,000">$25,000</div>
      </td>
      <td role="gridcell">
        <div class="nds-truncate" title="nathan@salesforce.com">
          <a href="javascript:void(0);" tabindex="0">nathan@salesforce.com</a>
        </div>
      </td>
      <td role="gridcell">
        <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" tabindex="0" title="Show More">
          <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
          </svg>
          <span class="nds-assistive-text">Show More</span>
        </button>
      </td>
    </tr>
  </tbody>
</table>`);
  });
