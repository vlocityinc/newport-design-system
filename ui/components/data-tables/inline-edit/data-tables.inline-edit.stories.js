import { storiesOf } from '@storybook/html';
import base from 'paths.macro';
import notes from '../doc.md';
import scss from './_index.scss';
import {
  withExample,
  withDocs,
  commentToHTML
} from '../../../../scripts/storybook';

storiesOf(`${base}`, module)
  .addDecorator(withDocs(notes))
  .addDecorator(commentToHTML(scss))
  .add('Default (default)', () => {
    return withExample(`<div class="nds-table_edit_container nds-is-relative">
  <table class="nds-table nds-table_bordered nds-table_resizable-cols nds-table_fixed-layout nds-no-cell-focus nds-table_edit" role="grid" style="width: 66.75rem;">
    <thead>
      <tr class="nds-line-height_reset">
        <th scope="col" style="width: 3.75rem;">
          <div class="nds-th__action">
            <span class="nds-assistive-text">Errors</span>
          </div>
        </th>
        <th scope="col" style="width: 2rem;">
          <div class="nds-th__action nds-th__action_form">
            <label class="nds-checkbox">
              <input type="checkbox" name="options" id="checkbox-65" tabindex="-1" value="on">
              <span class="nds-checkbox_faux"></span>
              <label class="nds-checkbox__label">
                <span class="nds-form-element__label nds-assistive-text">Select All</span>
              </label>
            </label>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Name" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Name column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-113" tabindex="-1">
            <span class="nds-resizable__handle">
              <span class="nds-resizable__divider"></span>
            </span>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Account Name" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Account Name column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-114" tabindex="-1">
            <span class="nds-resizable__handle">
              <span class="nds-resizable__divider"></span>
            </span>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Close Date" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Close Date column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-115" tabindex="-1">
            <span class="nds-resizable__handle">
              <span class="nds-resizable__divider"></span>
            </span>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Stage" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Stage column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-116" tabindex="-1">
            <span class="nds-resizable__handle">
              <span class="nds-resizable__divider"></span>
            </span>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Confidence" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Confidence column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-117" tabindex="-1">
            <span class="nds-resizable__handle">
              <span class="nds-resizable__divider"></span>
            </span>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Amount" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Amount column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-118" tabindex="-1">
            <span class="nds-resizable__handle">
              <span class="nds-resizable__divider"></span>
            </span>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Contact" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Contact column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-119" tabindex="-1">
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
        <td class="nds-cell-error nds-cell-edit" role="gridcell">
          <button class="nds-button nds-button_icon nds-button_icon-error nds-m-horizontal_xxx-small nds-hidden" aria-hidden="true" id="error-01" tabindex="-1" title="Item 1 has errors">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#warning"></use>
            </svg>
            <span class="nds-assistive-text">Item 1 has errors</span>
          </button>
          <span class="nds-row-number nds-text-body_small nds-text-color_weak"></span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <label class="nds-checkbox">
            <input type="checkbox" name="options" id="checkbox-01" tabindex="-1" value="on">
            <span class="nds-checkbox_faux"></span>
            <label class="nds-checkbox__label">
              <span class="nds-form-element__label nds-assistive-text">Select item 1</span>
            </label>
          </label>
        </td>
        <th class="nds-cell-edit" scope="row" tabindex="0">
          <span class="nds-grid nds-grid_align-spread">
            <a href="javascript:void(0);" class="nds-truncate" id="link-01" tabindex="-1" title="Acme - 1,200 Widgets">Acme - 1,200 Widgets</a>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="-1" title="Edit Name: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Name: Item 1</span>
            </button>
          </span>
        </th>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="Acme">Acme</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="-1" title="Edit Account Name: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Account Name: Item 1</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="4/10/15">4/10/15</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="-1" title="Edit Close Date: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Close Date: Item 1</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="Value Proposition">Value Proposition</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="-1" title="Edit Stage: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Stage: Item 1</span>
            </button>
          </span>
        </td>
        <td aria-readonly="true" class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="30%">30%</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" disabled="" tabindex="-1" title="Edit Confidence: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_lock nds-button__icon_small" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#lock"></use>
              </svg>
              <span class="nds-assistive-text">Edit Confidence: Item 1</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="$25,000,000">$25,000,000</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="-1" title="Edit Amount: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Amount: Item 1</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="jrogers@acme.com">jrogers@acme.com</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="-1" title="Edit Contact: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Contact: Item 1</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" tabindex="-1" title="Show More">
            <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
            </svg>
            <span class="nds-assistive-text">Show More</span>
          </button>
        </td>
      </tr>
      <tr class="nds-hint-parent">
        <td class="nds-cell-error nds-cell-edit" role="gridcell">
          <button class="nds-button nds-button_icon nds-button_icon-error nds-m-horizontal_xxx-small nds-hidden" aria-hidden="true" id="error-02" tabindex="-1" title="Item 2 has errors">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#warning"></use>
            </svg>
            <span class="nds-assistive-text">Item 2 has errors</span>
          </button>
          <span class="nds-row-number nds-text-body_small nds-text-color_weak"></span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <label class="nds-checkbox">
            <input type="checkbox" name="options" id="checkbox-02" tabindex="-1" value="on">
            <span class="nds-checkbox_faux"></span>
            <label class="nds-checkbox__label">
              <span class="nds-form-element__label nds-assistive-text">Select item 2</span>
            </label>
          </label>
        </td>
        <th class="nds-cell-edit" scope="row">
          <span class="nds-grid nds-grid_align-spread">
            <a href="javascript:void(0);" class="nds-truncate" id="link-02" tabindex="-1" title="Acme - 200 Widgets">Acme - 200 Widgets</a>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="-1" title="Edit Name: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Name: Item 2</span>
            </button>
          </span>
        </th>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="Acme">Acme</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="-1" title="Edit Account Name: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Account Name: Item 2</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="1/31/15">1/31/15</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="-1" title="Edit Close Date: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Close Date: Item 2</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="Prospecting">Prospecting</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="-1" title="Edit Stage: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Stage: Item 2</span>
            </button>
          </span>
        </td>
        <td aria-readonly="true" class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="60%">60%</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" disabled="" tabindex="-1" title="Edit Confidence: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_lock nds-button__icon_small" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#lock"></use>
              </svg>
              <span class="nds-assistive-text">Edit Confidence: Item 2</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="$5,000,000">$5,000,000</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="-1" title="Edit Amount: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Amount: Item 2</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="bob@acme.com">bob@acme.com</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="-1" title="Edit Contact: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Contact: Item 2</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" tabindex="-1" title="Show More">
            <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
            </svg>
            <span class="nds-assistive-text">Show More</span>
          </button>
        </td>
      </tr>
      <tr class="nds-hint-parent">
        <td class="nds-cell-error nds-cell-edit" role="gridcell">
          <button class="nds-button nds-button_icon nds-button_icon-error nds-m-horizontal_xxx-small nds-hidden" aria-hidden="true" id="error-03" tabindex="-1" title="Item 3 has errors">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#warning"></use>
            </svg>
            <span class="nds-assistive-text">Item 3 has errors</span>
          </button>
          <span class="nds-row-number nds-text-body_small nds-text-color_weak"></span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <label class="nds-checkbox">
            <input type="checkbox" name="options" id="checkbox-03" tabindex="-1" value="on">
            <span class="nds-checkbox_faux"></span>
            <label class="nds-checkbox__label">
              <span class="nds-form-element__label nds-assistive-text">Select item 3</span>
            </label>
          </label>
        </td>
        <th class="nds-cell-edit" scope="row">
          <span class="nds-grid nds-grid_align-spread">
            <a href="javascript:void(0);" class="nds-truncate" id="link-03" tabindex="-1" title="salesforce.com - 1,000 Widgets">salesforce.com - 1,000 Widgets</a>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="-1" title="Edit Name: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Name: Item 3</span>
            </button>
          </span>
        </th>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="salesforce.com">salesforce.com</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="-1" title="Edit Account Name: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Account Name: Item 3</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="1/31/15 3:45PM">1/31/15 3:45PM</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="-1" title="Edit Close Date: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Close Date: Item 3</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="Id. Decision Makers">Id. Decision Makers</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="-1" title="Edit Stage: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Stage: Item 3</span>
            </button>
          </span>
        </td>
        <td aria-readonly="true" class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="70%">70%</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" disabled="" tabindex="-1" title="Edit Confidence: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_lock nds-button__icon_small" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#lock"></use>
              </svg>
              <span class="nds-assistive-text">Edit Confidence: Item 3</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="$25,000">$25,000</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="-1" title="Edit Amount: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Amount: Item 3</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="nathan@salesforce.com">nathan@salesforce.com</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="-1" title="Edit Contact: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Contact: Item 3</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" tabindex="-1" title="Show More">
            <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
            </svg>
            <span class="nds-assistive-text">Show More</span>
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</div>`);
  })
  .add('With Link (states)', () => {
    return withExample(`<div class="nds-table_edit_container nds-is-relative">
  <table class="nds-table nds-table_bordered nds-table_resizable-cols nds-table_fixed-layout nds-table_edit" role="grid" style="width: 66.75rem;">
    <thead>
      <tr class="nds-line-height_reset">
        <th scope="col" style="width: 3.75rem;">
          <div class="nds-th__action">
            <span class="nds-assistive-text">Errors</span>
          </div>
        </th>
        <th scope="col" style="width: 2rem;">
          <div class="nds-th__action nds-th__action_form">
            <label class="nds-checkbox">
              <input type="checkbox" name="options" id="checkbox-69" tabindex="0" value="on">
              <span class="nds-checkbox_faux"></span>
              <label class="nds-checkbox__label">
                <span class="nds-form-element__label nds-assistive-text">Select All</span>
              </label>
            </label>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Name" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Name column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-120" tabindex="0">
            <span class="nds-resizable__handle">
              <span class="nds-resizable__divider"></span>
            </span>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Account Name" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Account Name column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-121" tabindex="0">
            <span class="nds-resizable__handle">
              <span class="nds-resizable__divider"></span>
            </span>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Close Date" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Close Date column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-122" tabindex="0">
            <span class="nds-resizable__handle">
              <span class="nds-resizable__divider"></span>
            </span>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Stage" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Stage column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-123" tabindex="0">
            <span class="nds-resizable__handle">
              <span class="nds-resizable__divider"></span>
            </span>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Confidence" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Confidence column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-124" tabindex="0">
            <span class="nds-resizable__handle">
              <span class="nds-resizable__divider"></span>
            </span>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Amount" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Amount column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-125" tabindex="0">
            <span class="nds-resizable__handle">
              <span class="nds-resizable__divider"></span>
            </span>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Contact" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Contact column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-126" tabindex="0">
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
        <td class="nds-cell-error nds-cell-edit" role="gridcell">
          <button class="nds-button nds-button_icon nds-button_icon-error nds-m-horizontal_xxx-small nds-hidden" aria-hidden="true" id="error-01" tabindex="-1" title="Item 1 has errors">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#warning"></use>
            </svg>
            <span class="nds-assistive-text">Item 1 has errors</span>
          </button>
          <span class="nds-row-number nds-text-body_small nds-text-color_weak"></span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <label class="nds-checkbox">
            <input type="checkbox" name="options" id="checkbox-01" tabindex="0" value="on">
            <span class="nds-checkbox_faux"></span>
            <label class="nds-checkbox__label">
              <span class="nds-form-element__label nds-assistive-text">Select item 1</span>
            </label>
          </label>
        </td>
        <th class="nds-cell-edit nds-has-focus" scope="row">
          <span class="nds-grid nds-grid_align-spread">
            <a href="javascript:void(0);" class="nds-truncate" id="link-01" tabindex="0" title="Acme - 1,200 Widgets">Acme - 1,200 Widgets</a>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Name: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Name: Item 1</span>
            </button>
          </span>
        </th>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="Acme">Acme</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Account Name: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Account Name: Item 1</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="4/10/15">4/10/15</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Close Date: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Close Date: Item 1</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="Value Proposition">Value Proposition</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Stage: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Stage: Item 1</span>
            </button>
          </span>
        </td>
        <td aria-readonly="true" class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="30%">30%</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" disabled="" tabindex="0" title="Edit Confidence: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_lock nds-button__icon_small" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#lock"></use>
              </svg>
              <span class="nds-assistive-text">Edit Confidence: Item 1</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="$25,000,000">$25,000,000</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Amount: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Amount: Item 1</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="jrogers@acme.com">jrogers@acme.com</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Contact: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Contact: Item 1</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" tabindex="0" title="Show More">
            <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
            </svg>
            <span class="nds-assistive-text">Show More</span>
          </button>
        </td>
      </tr>
      <tr class="nds-hint-parent">
        <td class="nds-cell-error nds-cell-edit" role="gridcell">
          <button class="nds-button nds-button_icon nds-button_icon-error nds-m-horizontal_xxx-small nds-hidden" aria-hidden="true" id="error-02" tabindex="-1" title="Item 2 has errors">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#warning"></use>
            </svg>
            <span class="nds-assistive-text">Item 2 has errors</span>
          </button>
          <span class="nds-row-number nds-text-body_small nds-text-color_weak"></span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <label class="nds-checkbox">
            <input type="checkbox" name="options" id="checkbox-02" tabindex="0" value="on">
            <span class="nds-checkbox_faux"></span>
            <label class="nds-checkbox__label">
              <span class="nds-form-element__label nds-assistive-text">Select item 2</span>
            </label>
          </label>
        </td>
        <th class="nds-cell-edit" scope="row">
          <span class="nds-grid nds-grid_align-spread">
            <a href="javascript:void(0);" class="nds-truncate" id="link-02" tabindex="0" title="Acme - 200 Widgets">Acme - 200 Widgets</a>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Name: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Name: Item 2</span>
            </button>
          </span>
        </th>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="Acme">Acme</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Account Name: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Account Name: Item 2</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="1/31/15">1/31/15</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Close Date: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Close Date: Item 2</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="Prospecting">Prospecting</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Stage: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Stage: Item 2</span>
            </button>
          </span>
        </td>
        <td aria-readonly="true" class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="60%">60%</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" disabled="" tabindex="0" title="Edit Confidence: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_lock nds-button__icon_small" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#lock"></use>
              </svg>
              <span class="nds-assistive-text">Edit Confidence: Item 2</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="$5,000,000">$5,000,000</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Amount: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Amount: Item 2</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="bob@acme.com">bob@acme.com</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Contact: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Contact: Item 2</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" tabindex="0" title="Show More">
            <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
            </svg>
            <span class="nds-assistive-text">Show More</span>
          </button>
        </td>
      </tr>
      <tr class="nds-hint-parent">
        <td class="nds-cell-error nds-cell-edit" role="gridcell">
          <button class="nds-button nds-button_icon nds-button_icon-error nds-m-horizontal_xxx-small nds-hidden" aria-hidden="true" id="error-03" tabindex="-1" title="Item 3 has errors">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#warning"></use>
            </svg>
            <span class="nds-assistive-text">Item 3 has errors</span>
          </button>
          <span class="nds-row-number nds-text-body_small nds-text-color_weak"></span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <label class="nds-checkbox">
            <input type="checkbox" name="options" id="checkbox-03" tabindex="0" value="on">
            <span class="nds-checkbox_faux"></span>
            <label class="nds-checkbox__label">
              <span class="nds-form-element__label nds-assistive-text">Select item 3</span>
            </label>
          </label>
        </td>
        <th class="nds-cell-edit" scope="row">
          <span class="nds-grid nds-grid_align-spread">
            <a href="javascript:void(0);" class="nds-truncate" id="link-03" tabindex="0" title="salesforce.com - 1,000 Widgets">salesforce.com - 1,000 Widgets</a>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Name: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Name: Item 3</span>
            </button>
          </span>
        </th>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="salesforce.com">salesforce.com</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Account Name: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Account Name: Item 3</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="1/31/15 3:45PM">1/31/15 3:45PM</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Close Date: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Close Date: Item 3</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="Id. Decision Makers">Id. Decision Makers</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Stage: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Stage: Item 3</span>
            </button>
          </span>
        </td>
        <td aria-readonly="true" class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="70%">70%</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" disabled="" tabindex="0" title="Edit Confidence: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_lock nds-button__icon_small" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#lock"></use>
              </svg>
              <span class="nds-assistive-text">Edit Confidence: Item 3</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="$25,000">$25,000</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Amount: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Amount: Item 3</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="nathan@salesforce.com">nathan@salesforce.com</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Contact: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Contact: Item 3</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" tabindex="0" title="Show More">
            <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
            </svg>
            <span class="nds-assistive-text">Show More</span>
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</div>`);
  })
  .add('Checkbox (states)', () => {
    return withExample(`<div class="nds-table_edit_container nds-is-relative">
  <table class="nds-table nds-table_bordered nds-table_resizable-cols nds-table_fixed-layout nds-table_edit" role="grid" style="width: 66.75rem;">
    <thead>
      <tr class="nds-line-height_reset">
        <th scope="col" style="width: 3.75rem;">
          <div class="nds-th__action">
            <span class="nds-assistive-text">Errors</span>
          </div>
        </th>
        <th scope="col" style="width: 2rem;">
          <div class="nds-th__action nds-th__action_form">
            <label class="nds-checkbox">
              <input type="checkbox" name="options" id="checkbox-73" tabindex="0" value="on">
              <span class="nds-checkbox_faux"></span>
              <label class="nds-checkbox__label">
                <span class="nds-form-element__label nds-assistive-text">Select All</span>
              </label>
            </label>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Name" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Name column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-127" tabindex="0">
            <span class="nds-resizable__handle">
              <span class="nds-resizable__divider"></span>
            </span>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Account Name" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Account Name column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-128" tabindex="0">
            <span class="nds-resizable__handle">
              <span class="nds-resizable__divider"></span>
            </span>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Close Date" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Close Date column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-129" tabindex="0">
            <span class="nds-resizable__handle">
              <span class="nds-resizable__divider"></span>
            </span>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Stage" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Stage column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-130" tabindex="0">
            <span class="nds-resizable__handle">
              <span class="nds-resizable__divider"></span>
            </span>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Confidence" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Confidence column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-131" tabindex="0">
            <span class="nds-resizable__handle">
              <span class="nds-resizable__divider"></span>
            </span>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Amount" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Amount column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-132" tabindex="0">
            <span class="nds-resizable__handle">
              <span class="nds-resizable__divider"></span>
            </span>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Contact" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Contact column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-133" tabindex="0">
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
        <td class="nds-cell-error nds-cell-edit" role="gridcell">
          <button class="nds-button nds-button_icon nds-button_icon-error nds-m-horizontal_xxx-small nds-hidden" aria-hidden="true" id="error-01" tabindex="-1" title="Item 1 has errors">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#warning"></use>
            </svg>
            <span class="nds-assistive-text">Item 1 has errors</span>
          </button>
          <span class="nds-row-number nds-text-body_small nds-text-color_weak"></span>
        </td>
        <td class="nds-cell-edit nds-has-focus" role="gridcell">
          <label class="nds-checkbox">
            <input type="checkbox" name="options" id="checkbox-01" tabindex="0" value="on">
            <span class="nds-checkbox_faux"></span>
            <label class="nds-checkbox__label">
              <span class="nds-form-element__label nds-assistive-text">Select item 1</span>
            </label>
          </label>
        </td>
        <th class="nds-cell-edit" scope="row">
          <span class="nds-grid nds-grid_align-spread">
            <a href="javascript:void(0);" class="nds-truncate" id="link-01" tabindex="0" title="Acme - 1,200 Widgets">Acme - 1,200 Widgets</a>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Name: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Name: Item 1</span>
            </button>
          </span>
        </th>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="Acme">Acme</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Account Name: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Account Name: Item 1</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="4/10/15">4/10/15</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Close Date: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Close Date: Item 1</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="Value Proposition">Value Proposition</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Stage: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Stage: Item 1</span>
            </button>
          </span>
        </td>
        <td aria-readonly="true" class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="30%">30%</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" disabled="" tabindex="0" title="Edit Confidence: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_lock nds-button__icon_small" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#lock"></use>
              </svg>
              <span class="nds-assistive-text">Edit Confidence: Item 1</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="$25,000,000">$25,000,000</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Amount: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Amount: Item 1</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="jrogers@acme.com">jrogers@acme.com</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Contact: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Contact: Item 1</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" tabindex="0" title="Show More">
            <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
            </svg>
            <span class="nds-assistive-text">Show More</span>
          </button>
        </td>
      </tr>
      <tr class="nds-hint-parent">
        <td class="nds-cell-error nds-cell-edit" role="gridcell">
          <button class="nds-button nds-button_icon nds-button_icon-error nds-m-horizontal_xxx-small nds-hidden" aria-hidden="true" id="error-02" tabindex="-1" title="Item 2 has errors">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#warning"></use>
            </svg>
            <span class="nds-assistive-text">Item 2 has errors</span>
          </button>
          <span class="nds-row-number nds-text-body_small nds-text-color_weak"></span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <label class="nds-checkbox">
            <input type="checkbox" name="options" id="checkbox-02" tabindex="0" value="on">
            <span class="nds-checkbox_faux"></span>
            <label class="nds-checkbox__label">
              <span class="nds-form-element__label nds-assistive-text">Select item 2</span>
            </label>
          </label>
        </td>
        <th class="nds-cell-edit" scope="row">
          <span class="nds-grid nds-grid_align-spread">
            <a href="javascript:void(0);" class="nds-truncate" id="link-02" tabindex="0" title="Acme - 200 Widgets">Acme - 200 Widgets</a>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Name: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Name: Item 2</span>
            </button>
          </span>
        </th>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="Acme">Acme</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Account Name: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Account Name: Item 2</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="1/31/15">1/31/15</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Close Date: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Close Date: Item 2</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="Prospecting">Prospecting</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Stage: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Stage: Item 2</span>
            </button>
          </span>
        </td>
        <td aria-readonly="true" class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="60%">60%</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" disabled="" tabindex="0" title="Edit Confidence: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_lock nds-button__icon_small" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#lock"></use>
              </svg>
              <span class="nds-assistive-text">Edit Confidence: Item 2</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="$5,000,000">$5,000,000</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Amount: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Amount: Item 2</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="bob@acme.com">bob@acme.com</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Contact: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Contact: Item 2</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" tabindex="0" title="Show More">
            <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
            </svg>
            <span class="nds-assistive-text">Show More</span>
          </button>
        </td>
      </tr>
      <tr class="nds-hint-parent">
        <td class="nds-cell-error nds-cell-edit" role="gridcell">
          <button class="nds-button nds-button_icon nds-button_icon-error nds-m-horizontal_xxx-small nds-hidden" aria-hidden="true" id="error-03" tabindex="-1" title="Item 3 has errors">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#warning"></use>
            </svg>
            <span class="nds-assistive-text">Item 3 has errors</span>
          </button>
          <span class="nds-row-number nds-text-body_small nds-text-color_weak"></span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <label class="nds-checkbox">
            <input type="checkbox" name="options" id="checkbox-03" tabindex="0" value="on">
            <span class="nds-checkbox_faux"></span>
            <label class="nds-checkbox__label">
              <span class="nds-form-element__label nds-assistive-text">Select item 3</span>
            </label>
          </label>
        </td>
        <th class="nds-cell-edit" scope="row">
          <span class="nds-grid nds-grid_align-spread">
            <a href="javascript:void(0);" class="nds-truncate" id="link-03" tabindex="0" title="salesforce.com - 1,000 Widgets">salesforce.com - 1,000 Widgets</a>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Name: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Name: Item 3</span>
            </button>
          </span>
        </th>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="salesforce.com">salesforce.com</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Account Name: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Account Name: Item 3</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="1/31/15 3:45PM">1/31/15 3:45PM</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Close Date: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Close Date: Item 3</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="Id. Decision Makers">Id. Decision Makers</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Stage: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Stage: Item 3</span>
            </button>
          </span>
        </td>
        <td aria-readonly="true" class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="70%">70%</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" disabled="" tabindex="0" title="Edit Confidence: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_lock nds-button__icon_small" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#lock"></use>
              </svg>
              <span class="nds-assistive-text">Edit Confidence: Item 3</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="$25,000">$25,000</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Amount: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Amount: Item 3</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="nathan@salesforce.com">nathan@salesforce.com</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Contact: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Contact: Item 3</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" tabindex="0" title="Show More">
            <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
            </svg>
            <span class="nds-assistive-text">Show More</span>
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</div>`);
  })
  .add('Focused (states)', () => {
    return withExample(`<div class="nds-table_edit_container nds-is-relative">
  <table class="nds-table nds-table_bordered nds-table_resizable-cols nds-table_fixed-layout nds-table_edit" role="grid" style="width: 66.75rem;">
    <thead>
      <tr class="nds-line-height_reset">
        <th scope="col" style="width: 3.75rem;">
          <div class="nds-th__action">
            <span class="nds-assistive-text">Errors</span>
          </div>
        </th>
        <th scope="col" style="width: 2rem;">
          <div class="nds-th__action nds-th__action_form">
            <label class="nds-checkbox">
              <input type="checkbox" name="options" id="checkbox-93" tabindex="-1" value="on">
              <span class="nds-checkbox_faux"></span>
              <label class="nds-checkbox__label">
                <span class="nds-form-element__label nds-assistive-text">Select All</span>
              </label>
            </label>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Name" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Name column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-162" tabindex="-1">
            <span class="nds-resizable__handle">
              <span class="nds-resizable__divider"></span>
            </span>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Account Name" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Account Name column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-163" tabindex="-1">
            <span class="nds-resizable__handle">
              <span class="nds-resizable__divider"></span>
            </span>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Close Date" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Close Date column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-164" tabindex="-1">
            <span class="nds-resizable__handle">
              <span class="nds-resizable__divider"></span>
            </span>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Stage" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Stage column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-165" tabindex="-1">
            <span class="nds-resizable__handle">
              <span class="nds-resizable__divider"></span>
            </span>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Confidence" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Confidence column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-166" tabindex="-1">
            <span class="nds-resizable__handle">
              <span class="nds-resizable__divider"></span>
            </span>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Amount" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Amount column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-167" tabindex="-1">
            <span class="nds-resizable__handle">
              <span class="nds-resizable__divider"></span>
            </span>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Contact" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Contact column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-168" tabindex="-1">
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
        <td class="nds-cell-error nds-cell-edit" role="gridcell">
          <button class="nds-button nds-button_icon nds-button_icon-error nds-m-horizontal_xxx-small nds-hidden" aria-hidden="true" id="error-01" tabindex="-1" title="Item 1 has errors">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#warning"></use>
            </svg>
            <span class="nds-assistive-text">Item 1 has errors</span>
          </button>
          <span class="nds-row-number nds-text-body_small nds-text-color_weak"></span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <label class="nds-checkbox">
            <input type="checkbox" name="options" id="checkbox-01" tabindex="-1" value="on">
            <span class="nds-checkbox_faux"></span>
            <label class="nds-checkbox__label">
              <span class="nds-form-element__label nds-assistive-text">Select item 1</span>
            </label>
          </label>
        </td>
        <th class="nds-cell-edit" scope="row">
          <span class="nds-grid nds-grid_align-spread">
            <a href="javascript:void(0);" class="nds-truncate" id="link-01" tabindex="-1" title="Acme - 1,200 Widgets">Acme - 1,200 Widgets</a>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="-1" title="Edit Name: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Name: Item 1</span>
            </button>
          </span>
        </th>
        <td class="nds-cell-edit nds-has-focus" role="gridcell" tabindex="0">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="Acme">Acme</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="-1" title="Edit Account Name: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Account Name: Item 1</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="4/10/15">4/10/15</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="-1" title="Edit Close Date: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Close Date: Item 1</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="Value Proposition">Value Proposition</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="-1" title="Edit Stage: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Stage: Item 1</span>
            </button>
          </span>
        </td>
        <td aria-readonly="true" class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="30%">30%</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" disabled="" tabindex="-1" title="Edit Confidence: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_lock nds-button__icon_small" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#lock"></use>
              </svg>
              <span class="nds-assistive-text">Edit Confidence: Item 1</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="$25,000,000">$25,000,000</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="-1" title="Edit Amount: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Amount: Item 1</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="jrogers@acme.com">jrogers@acme.com</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="-1" title="Edit Contact: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Contact: Item 1</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" tabindex="-1" title="Show More">
            <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
            </svg>
            <span class="nds-assistive-text">Show More</span>
          </button>
        </td>
      </tr>
      <tr class="nds-hint-parent">
        <td class="nds-cell-error nds-cell-edit" role="gridcell">
          <button class="nds-button nds-button_icon nds-button_icon-error nds-m-horizontal_xxx-small nds-hidden" aria-hidden="true" id="error-02" tabindex="-1" title="Item 2 has errors">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#warning"></use>
            </svg>
            <span class="nds-assistive-text">Item 2 has errors</span>
          </button>
          <span class="nds-row-number nds-text-body_small nds-text-color_weak"></span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <label class="nds-checkbox">
            <input type="checkbox" name="options" id="checkbox-02" tabindex="-1" value="on">
            <span class="nds-checkbox_faux"></span>
            <label class="nds-checkbox__label">
              <span class="nds-form-element__label nds-assistive-text">Select item 2</span>
            </label>
          </label>
        </td>
        <th class="nds-cell-edit" scope="row">
          <span class="nds-grid nds-grid_align-spread">
            <a href="javascript:void(0);" class="nds-truncate" id="link-02" tabindex="-1" title="Acme - 200 Widgets">Acme - 200 Widgets</a>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="-1" title="Edit Name: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Name: Item 2</span>
            </button>
          </span>
        </th>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="Acme">Acme</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="-1" title="Edit Account Name: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Account Name: Item 2</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="1/31/15">1/31/15</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="-1" title="Edit Close Date: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Close Date: Item 2</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="Prospecting">Prospecting</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="-1" title="Edit Stage: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Stage: Item 2</span>
            </button>
          </span>
        </td>
        <td aria-readonly="true" class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="60%">60%</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" disabled="" tabindex="-1" title="Edit Confidence: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_lock nds-button__icon_small" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#lock"></use>
              </svg>
              <span class="nds-assistive-text">Edit Confidence: Item 2</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="$5,000,000">$5,000,000</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="-1" title="Edit Amount: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Amount: Item 2</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="bob@acme.com">bob@acme.com</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="-1" title="Edit Contact: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Contact: Item 2</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" tabindex="-1" title="Show More">
            <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
            </svg>
            <span class="nds-assistive-text">Show More</span>
          </button>
        </td>
      </tr>
      <tr class="nds-hint-parent">
        <td class="nds-cell-error nds-cell-edit" role="gridcell">
          <button class="nds-button nds-button_icon nds-button_icon-error nds-m-horizontal_xxx-small nds-hidden" aria-hidden="true" id="error-03" tabindex="-1" title="Item 3 has errors">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#warning"></use>
            </svg>
            <span class="nds-assistive-text">Item 3 has errors</span>
          </button>
          <span class="nds-row-number nds-text-body_small nds-text-color_weak"></span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <label class="nds-checkbox">
            <input type="checkbox" name="options" id="checkbox-03" tabindex="-1" value="on">
            <span class="nds-checkbox_faux"></span>
            <label class="nds-checkbox__label">
              <span class="nds-form-element__label nds-assistive-text">Select item 3</span>
            </label>
          </label>
        </td>
        <th class="nds-cell-edit" scope="row">
          <span class="nds-grid nds-grid_align-spread">
            <a href="javascript:void(0);" class="nds-truncate" id="link-03" tabindex="-1" title="salesforce.com - 1,000 Widgets">salesforce.com - 1,000 Widgets</a>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="-1" title="Edit Name: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Name: Item 3</span>
            </button>
          </span>
        </th>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="salesforce.com">salesforce.com</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="-1" title="Edit Account Name: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Account Name: Item 3</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="1/31/15 3:45PM">1/31/15 3:45PM</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="-1" title="Edit Close Date: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Close Date: Item 3</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="Id. Decision Makers">Id. Decision Makers</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="-1" title="Edit Stage: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Stage: Item 3</span>
            </button>
          </span>
        </td>
        <td aria-readonly="true" class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="70%">70%</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" disabled="" tabindex="-1" title="Edit Confidence: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_lock nds-button__icon_small" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#lock"></use>
              </svg>
              <span class="nds-assistive-text">Edit Confidence: Item 3</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="$25,000">$25,000</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="-1" title="Edit Amount: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Amount: Item 3</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="nathan@salesforce.com">nathan@salesforce.com</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="-1" title="Edit Contact: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Contact: Item 3</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" tabindex="-1" title="Show More">
            <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
            </svg>
            <span class="nds-assistive-text">Show More</span>
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</div>`);
  })
  .add('Edit (states)', () => {
    return withExample(`<div class="nds-table_edit_container nds-is-relative">
  <table class="nds-table nds-table_bordered nds-table_resizable-cols nds-table_fixed-layout nds-table_edit" role="grid" style="width: 66.75rem;">
    <thead>
      <tr class="nds-line-height_reset">
        <th scope="col" style="width: 3.75rem;">
          <div class="nds-th__action">
            <span class="nds-assistive-text">Errors</span>
          </div>
        </th>
        <th scope="col" style="width: 2rem;">
          <div class="nds-th__action nds-th__action_form">
            <label class="nds-checkbox">
              <input type="checkbox" name="options" id="checkbox-77" tabindex="0" value="on">
              <span class="nds-checkbox_faux"></span>
              <label class="nds-checkbox__label">
                <span class="nds-form-element__label nds-assistive-text">Select All</span>
              </label>
            </label>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Name" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Name column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-134" tabindex="0">
            <span class="nds-resizable__handle">
              <span class="nds-resizable__divider"></span>
            </span>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Account Name" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Account Name column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-135" tabindex="0">
            <span class="nds-resizable__handle">
              <span class="nds-resizable__divider"></span>
            </span>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Close Date" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Close Date column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-136" tabindex="0">
            <span class="nds-resizable__handle">
              <span class="nds-resizable__divider"></span>
            </span>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Stage" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Stage column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-137" tabindex="0">
            <span class="nds-resizable__handle">
              <span class="nds-resizable__divider"></span>
            </span>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Confidence" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Confidence column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-138" tabindex="0">
            <span class="nds-resizable__handle">
              <span class="nds-resizable__divider"></span>
            </span>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Amount" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Amount column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-139" tabindex="0">
            <span class="nds-resizable__handle">
              <span class="nds-resizable__divider"></span>
            </span>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Contact" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Contact column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-140" tabindex="0">
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
        <td class="nds-cell-error nds-cell-edit" role="gridcell">
          <button class="nds-button nds-button_icon nds-button_icon-error nds-m-horizontal_xxx-small nds-hidden" aria-hidden="true" id="error-01" tabindex="-1" title="Item 1 has errors">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#warning"></use>
            </svg>
            <span class="nds-assistive-text">Item 1 has errors</span>
          </button>
          <span class="nds-row-number nds-text-body_small nds-text-color_weak"></span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <label class="nds-checkbox">
            <input type="checkbox" name="options" id="checkbox-01" tabindex="0" value="on">
            <span class="nds-checkbox_faux"></span>
            <label class="nds-checkbox__label">
              <span class="nds-form-element__label nds-assistive-text">Select item 1</span>
            </label>
          </label>
        </td>
        <th class="nds-cell-edit" scope="row">
          <span class="nds-grid nds-grid_align-spread">
            <a href="javascript:void(0);" class="nds-truncate" id="link-01" tabindex="0" title="Acme - 1,200 Widgets">Acme - 1,200 Widgets</a>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Name: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Name: Item 1</span>
            </button>
          </span>
        </th>
        <td aria-selected="true" class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="Acme">Acme</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Account Name: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Account Name: Item 1</span>
            </button>
          </span>
          <section class="nds-popover nds-popover_edit" role="dialog" style="position: absolute; top: 0px; left: 0.0625rem;">
            <span id="form-start" tabindex="0"></span>
            <div class="nds-popover__body">
              <div class="nds-form-element nds-grid nds-wrap">
                <label class="nds-form-element__label nds-form-element__label_edit nds-no-flex" for="company-01">
                  <span class="nds-assistive-text">Company</span>
                </label>
                <div class="nds-form-element__control nds-grow">
                  <input type="text" id="company-01" class="nds-input" value="Acme Enterprises">
                </div>
              </div>
            </div>
            <span id="form-end" tabindex="0"></span>
          </section>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="4/10/15">4/10/15</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Close Date: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Close Date: Item 1</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="Value Proposition">Value Proposition</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Stage: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Stage: Item 1</span>
            </button>
          </span>
        </td>
        <td aria-readonly="true" class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="30%">30%</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" disabled="" tabindex="0" title="Edit Confidence: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_lock nds-button__icon_small" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#lock"></use>
              </svg>
              <span class="nds-assistive-text">Edit Confidence: Item 1</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="$25,000,000">$25,000,000</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Amount: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Amount: Item 1</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="jrogers@acme.com">jrogers@acme.com</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Contact: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Contact: Item 1</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" tabindex="0" title="Show More">
            <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
            </svg>
            <span class="nds-assistive-text">Show More</span>
          </button>
        </td>
      </tr>
      <tr class="nds-hint-parent">
        <td class="nds-cell-error nds-cell-edit" role="gridcell">
          <button class="nds-button nds-button_icon nds-button_icon-error nds-m-horizontal_xxx-small nds-hidden" aria-hidden="true" id="error-02" tabindex="-1" title="Item 2 has errors">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#warning"></use>
            </svg>
            <span class="nds-assistive-text">Item 2 has errors</span>
          </button>
          <span class="nds-row-number nds-text-body_small nds-text-color_weak"></span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <label class="nds-checkbox">
            <input type="checkbox" name="options" id="checkbox-02" tabindex="0" value="on">
            <span class="nds-checkbox_faux"></span>
            <label class="nds-checkbox__label">
              <span class="nds-form-element__label nds-assistive-text">Select item 2</span>
            </label>
          </label>
        </td>
        <th class="nds-cell-edit" scope="row">
          <span class="nds-grid nds-grid_align-spread">
            <a href="javascript:void(0);" class="nds-truncate" id="link-02" tabindex="0" title="Acme - 200 Widgets">Acme - 200 Widgets</a>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Name: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Name: Item 2</span>
            </button>
          </span>
        </th>
        <td aria-selected="false" class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="Acme">Acme</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Account Name: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Account Name: Item 2</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="1/31/15">1/31/15</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Close Date: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Close Date: Item 2</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="Prospecting">Prospecting</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Stage: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Stage: Item 2</span>
            </button>
          </span>
        </td>
        <td aria-readonly="true" class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="60%">60%</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" disabled="" tabindex="0" title="Edit Confidence: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_lock nds-button__icon_small" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#lock"></use>
              </svg>
              <span class="nds-assistive-text">Edit Confidence: Item 2</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="$5,000,000">$5,000,000</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Amount: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Amount: Item 2</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="bob@acme.com">bob@acme.com</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Contact: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Contact: Item 2</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" tabindex="0" title="Show More">
            <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
            </svg>
            <span class="nds-assistive-text">Show More</span>
          </button>
        </td>
      </tr>
      <tr class="nds-hint-parent">
        <td class="nds-cell-error nds-cell-edit" role="gridcell">
          <button class="nds-button nds-button_icon nds-button_icon-error nds-m-horizontal_xxx-small nds-hidden" aria-hidden="true" id="error-03" tabindex="-1" title="Item 3 has errors">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#warning"></use>
            </svg>
            <span class="nds-assistive-text">Item 3 has errors</span>
          </button>
          <span class="nds-row-number nds-text-body_small nds-text-color_weak"></span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <label class="nds-checkbox">
            <input type="checkbox" name="options" id="checkbox-03" tabindex="0" value="on">
            <span class="nds-checkbox_faux"></span>
            <label class="nds-checkbox__label">
              <span class="nds-form-element__label nds-assistive-text">Select item 3</span>
            </label>
          </label>
        </td>
        <th class="nds-cell-edit" scope="row">
          <span class="nds-grid nds-grid_align-spread">
            <a href="javascript:void(0);" class="nds-truncate" id="link-03" tabindex="0" title="salesforce.com - 1,000 Widgets">salesforce.com - 1,000 Widgets</a>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Name: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Name: Item 3</span>
            </button>
          </span>
        </th>
        <td aria-selected="false" class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="salesforce.com">salesforce.com</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Account Name: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Account Name: Item 3</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="1/31/15 3:45PM">1/31/15 3:45PM</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Close Date: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Close Date: Item 3</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="Id. Decision Makers">Id. Decision Makers</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Stage: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Stage: Item 3</span>
            </button>
          </span>
        </td>
        <td aria-readonly="true" class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="70%">70%</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" disabled="" tabindex="0" title="Edit Confidence: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_lock nds-button__icon_small" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#lock"></use>
              </svg>
              <span class="nds-assistive-text">Edit Confidence: Item 3</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="$25,000">$25,000</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Amount: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Amount: Item 3</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="nathan@salesforce.com">nathan@salesforce.com</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Contact: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Contact: Item 3</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" tabindex="0" title="Show More">
            <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
            </svg>
            <span class="nds-assistive-text">Show More</span>
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</div>`);
  })
  .add('Required (states)', () => {
    return withExample(`<div class="nds-table_edit_container nds-is-relative">
  <table class="nds-table nds-table_bordered nds-table_resizable-cols nds-table_fixed-layout nds-table_edit" role="grid" style="width: 66.75rem;">
    <thead>
      <tr class="nds-line-height_reset">
        <th scope="col" style="width: 3.75rem;">
          <div class="nds-th__action">
            <span class="nds-assistive-text">Errors</span>
          </div>
        </th>
        <th scope="col" style="width: 2rem;">
          <div class="nds-th__action nds-th__action_form">
            <label class="nds-checkbox">
              <input type="checkbox" name="options" id="checkbox-81" tabindex="0" value="on">
              <span class="nds-checkbox_faux"></span>
              <label class="nds-checkbox__label">
                <span class="nds-form-element__label nds-assistive-text">Select All</span>
              </label>
            </label>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Name" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Name column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-141" tabindex="0">
            <span class="nds-resizable__handle">
              <span class="nds-resizable__divider"></span>
            </span>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Account Name" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Account Name column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-142" tabindex="0">
            <span class="nds-resizable__handle">
              <span class="nds-resizable__divider"></span>
            </span>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Close Date" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Close Date column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-143" tabindex="0">
            <span class="nds-resizable__handle">
              <span class="nds-resizable__divider"></span>
            </span>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Stage" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Stage column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-144" tabindex="0">
            <span class="nds-resizable__handle">
              <span class="nds-resizable__divider"></span>
            </span>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Confidence" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Confidence column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-145" tabindex="0">
            <span class="nds-resizable__handle">
              <span class="nds-resizable__divider"></span>
            </span>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Amount" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Amount column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-146" tabindex="0">
            <span class="nds-resizable__handle">
              <span class="nds-resizable__divider"></span>
            </span>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Contact" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Contact column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-147" tabindex="0">
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
        <td class="nds-cell-error nds-cell-edit" role="gridcell">
          <button class="nds-button nds-button_icon nds-button_icon-error nds-m-horizontal_xxx-small nds-hidden" aria-hidden="true" id="error-01" tabindex="-1" title="Item 1 has errors">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#warning"></use>
            </svg>
            <span class="nds-assistive-text">Item 1 has errors</span>
          </button>
          <span class="nds-row-number nds-text-body_small nds-text-color_weak"></span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <label class="nds-checkbox">
            <input type="checkbox" name="options" id="checkbox-01" tabindex="0" value="on">
            <span class="nds-checkbox_faux"></span>
            <label class="nds-checkbox__label">
              <span class="nds-form-element__label nds-assistive-text">Select item 1</span>
            </label>
          </label>
        </td>
        <th class="nds-cell-edit" scope="row">
          <span class="nds-grid nds-grid_align-spread">
            <a href="javascript:void(0);" class="nds-truncate" id="link-01" tabindex="0" title="Acme - 1,200 Widgets">Acme - 1,200 Widgets</a>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Name: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Name: Item 1</span>
            </button>
          </span>
        </th>
        <td aria-selected="true" class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="Acme">Acme</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Account Name: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Account Name: Item 1</span>
            </button>
          </span>
          <section class="nds-popover nds-popover_edit" role="dialog" style="position: absolute; top: 0px; left: 0.0625rem;">
            <span id="form-start" tabindex="0"></span>
            <div class="nds-popover__body">
              <div class="nds-form-element nds-grid nds-wrap">
                <label class="nds-form-element__label nds-form-element__label_edit nds-no-flex" for="company-01">
                  <abbr class="nds-required" title="required">*</abbr>
                  <span class="nds-assistive-text">Company</span>
                </label>
                <div class="nds-form-element__control nds-grow">
                  <input type="text" id="company-01" class="nds-input input--required" required="" value="Acme Enterprises">
                </div>
              </div>
            </div>
            <span id="form-end" tabindex="0"></span>
          </section>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="4/10/15">4/10/15</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Close Date: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Close Date: Item 1</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="Value Proposition">Value Proposition</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Stage: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Stage: Item 1</span>
            </button>
          </span>
        </td>
        <td aria-readonly="true" class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="30%">30%</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" disabled="" tabindex="0" title="Edit Confidence: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_lock nds-button__icon_small" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#lock"></use>
              </svg>
              <span class="nds-assistive-text">Edit Confidence: Item 1</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="$25,000,000">$25,000,000</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Amount: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Amount: Item 1</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="jrogers@acme.com">jrogers@acme.com</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Contact: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Contact: Item 1</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" tabindex="0" title="Show More">
            <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
            </svg>
            <span class="nds-assistive-text">Show More</span>
          </button>
        </td>
      </tr>
      <tr class="nds-hint-parent">
        <td class="nds-cell-error nds-cell-edit" role="gridcell">
          <button class="nds-button nds-button_icon nds-button_icon-error nds-m-horizontal_xxx-small nds-hidden" aria-hidden="true" id="error-02" tabindex="-1" title="Item 2 has errors">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#warning"></use>
            </svg>
            <span class="nds-assistive-text">Item 2 has errors</span>
          </button>
          <span class="nds-row-number nds-text-body_small nds-text-color_weak"></span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <label class="nds-checkbox">
            <input type="checkbox" name="options" id="checkbox-02" tabindex="0" value="on">
            <span class="nds-checkbox_faux"></span>
            <label class="nds-checkbox__label">
              <span class="nds-form-element__label nds-assistive-text">Select item 2</span>
            </label>
          </label>
        </td>
        <th class="nds-cell-edit" scope="row">
          <span class="nds-grid nds-grid_align-spread">
            <a href="javascript:void(0);" class="nds-truncate" id="link-02" tabindex="0" title="Acme - 200 Widgets">Acme - 200 Widgets</a>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Name: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Name: Item 2</span>
            </button>
          </span>
        </th>
        <td aria-selected="false" class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="Acme">Acme</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Account Name: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Account Name: Item 2</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="1/31/15">1/31/15</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Close Date: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Close Date: Item 2</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="Prospecting">Prospecting</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Stage: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Stage: Item 2</span>
            </button>
          </span>
        </td>
        <td aria-readonly="true" class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="60%">60%</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" disabled="" tabindex="0" title="Edit Confidence: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_lock nds-button__icon_small" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#lock"></use>
              </svg>
              <span class="nds-assistive-text">Edit Confidence: Item 2</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="$5,000,000">$5,000,000</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Amount: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Amount: Item 2</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="bob@acme.com">bob@acme.com</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Contact: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Contact: Item 2</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" tabindex="0" title="Show More">
            <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
            </svg>
            <span class="nds-assistive-text">Show More</span>
          </button>
        </td>
      </tr>
      <tr class="nds-hint-parent">
        <td class="nds-cell-error nds-cell-edit" role="gridcell">
          <button class="nds-button nds-button_icon nds-button_icon-error nds-m-horizontal_xxx-small nds-hidden" aria-hidden="true" id="error-03" tabindex="-1" title="Item 3 has errors">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#warning"></use>
            </svg>
            <span class="nds-assistive-text">Item 3 has errors</span>
          </button>
          <span class="nds-row-number nds-text-body_small nds-text-color_weak"></span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <label class="nds-checkbox">
            <input type="checkbox" name="options" id="checkbox-03" tabindex="0" value="on">
            <span class="nds-checkbox_faux"></span>
            <label class="nds-checkbox__label">
              <span class="nds-form-element__label nds-assistive-text">Select item 3</span>
            </label>
          </label>
        </td>
        <th class="nds-cell-edit" scope="row">
          <span class="nds-grid nds-grid_align-spread">
            <a href="javascript:void(0);" class="nds-truncate" id="link-03" tabindex="0" title="salesforce.com - 1,000 Widgets">salesforce.com - 1,000 Widgets</a>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Name: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Name: Item 3</span>
            </button>
          </span>
        </th>
        <td aria-selected="false" class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="salesforce.com">salesforce.com</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Account Name: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Account Name: Item 3</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="1/31/15 3:45PM">1/31/15 3:45PM</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Close Date: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Close Date: Item 3</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="Id. Decision Makers">Id. Decision Makers</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Stage: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Stage: Item 3</span>
            </button>
          </span>
        </td>
        <td aria-readonly="true" class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="70%">70%</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" disabled="" tabindex="0" title="Edit Confidence: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_lock nds-button__icon_small" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#lock"></use>
              </svg>
              <span class="nds-assistive-text">Edit Confidence: Item 3</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="$25,000">$25,000</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Amount: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Amount: Item 3</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="nathan@salesforce.com">nathan@salesforce.com</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Contact: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Contact: Item 3</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" tabindex="0" title="Show More">
            <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
            </svg>
            <span class="nds-assistive-text">Show More</span>
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</div>`);
  })
  .add('Error (states)', () => {
    return withExample(`<div class="nds-table_edit_container nds-is-relative">
  <table class="nds-table nds-table_bordered nds-table_resizable-cols nds-table_fixed-layout nds-table_edit" role="grid" style="width: 66.75rem;">
    <thead>
      <tr class="nds-line-height_reset">
        <th scope="col" style="width: 3.75rem;">
          <div class="nds-th__action">
            <span class="nds-assistive-text">Errors</span>
          </div>
        </th>
        <th scope="col" style="width: 2rem;">
          <div class="nds-th__action nds-th__action_form">
            <label class="nds-checkbox">
              <input type="checkbox" name="options" id="checkbox-85" tabindex="0" value="on">
              <span class="nds-checkbox_faux"></span>
              <label class="nds-checkbox__label">
                <span class="nds-form-element__label nds-assistive-text">Select All</span>
              </label>
            </label>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Name" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Name column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-148" tabindex="0">
            <span class="nds-resizable__handle">
              <span class="nds-resizable__divider"></span>
            </span>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Account Name" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Account Name column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-149" tabindex="0">
            <span class="nds-resizable__handle">
              <span class="nds-resizable__divider"></span>
            </span>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Close Date" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Close Date column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-150" tabindex="0">
            <span class="nds-resizable__handle">
              <span class="nds-resizable__divider"></span>
            </span>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Stage" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Stage column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-151" tabindex="0">
            <span class="nds-resizable__handle">
              <span class="nds-resizable__divider"></span>
            </span>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Confidence" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Confidence column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-152" tabindex="0">
            <span class="nds-resizable__handle">
              <span class="nds-resizable__divider"></span>
            </span>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Amount" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Amount column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-153" tabindex="0">
            <span class="nds-resizable__handle">
              <span class="nds-resizable__divider"></span>
            </span>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Contact" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Contact column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-154" tabindex="0">
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
        <td class="nds-cell-error nds-cell-edit" role="gridcell">
          <button class="nds-button nds-button_icon nds-button_icon-error nds-m-horizontal_xxx-small nds-hidden" aria-hidden="true" id="error-01" tabindex="-1" title="Item 1 has errors">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#warning"></use>
            </svg>
            <span class="nds-assistive-text">Item 1 has errors</span>
          </button>
          <span class="nds-row-number nds-text-body_small nds-text-color_weak"></span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <label class="nds-checkbox">
            <input type="checkbox" name="options" id="checkbox-01" tabindex="0" value="on">
            <span class="nds-checkbox_faux"></span>
            <label class="nds-checkbox__label">
              <span class="nds-form-element__label nds-assistive-text">Select item 1</span>
            </label>
          </label>
        </td>
        <th class="nds-cell-edit" scope="row">
          <span class="nds-grid nds-grid_align-spread">
            <a href="javascript:void(0);" class="nds-truncate" id="link-01" tabindex="0" title="Acme - 1,200 Widgets">Acme - 1,200 Widgets</a>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Name: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Name: Item 1</span>
            </button>
          </span>
        </th>
        <td aria-selected="true" class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="Acme">Acme</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Account Name: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Account Name: Item 1</span>
            </button>
          </span>
          <section class="nds-popover nds-popover_edit" role="dialog" style="position: absolute; top: 0px; left: 0.0625rem;">
            <span id="form-start" tabindex="0"></span>
            <div class="nds-popover__body">
              <div class="nds-form-element nds-grid nds-wrap nds-has-error">
                <label class="nds-form-element__label nds-form-element__label_edit nds-no-flex" for="company-01">
                  <abbr class="nds-required" title="required">*</abbr>
                  <span class="nds-assistive-text">Company</span>
                </label>
                <div class="nds-form-element__control nds-grow">
                  <input type="text" id="company-01" class="nds-input input--required" required="" aria-describedby="error-message-01" value="Acme Enterprises">
                </div>
                <div id="error-message-01" class="nds-form-element__help">This field is required</div>
              </div>
            </div>
            <span id="form-end" tabindex="0"></span>
          </section>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="4/10/15">4/10/15</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Close Date: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Close Date: Item 1</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="Value Proposition">Value Proposition</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Stage: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Stage: Item 1</span>
            </button>
          </span>
        </td>
        <td aria-readonly="true" class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="30%">30%</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" disabled="" tabindex="0" title="Edit Confidence: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_lock nds-button__icon_small" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#lock"></use>
              </svg>
              <span class="nds-assistive-text">Edit Confidence: Item 1</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="$25,000,000">$25,000,000</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Amount: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Amount: Item 1</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="jrogers@acme.com">jrogers@acme.com</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Contact: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Contact: Item 1</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" tabindex="0" title="Show More">
            <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
            </svg>
            <span class="nds-assistive-text">Show More</span>
          </button>
        </td>
      </tr>
      <tr class="nds-hint-parent">
        <td class="nds-cell-error nds-cell-edit" role="gridcell">
          <button class="nds-button nds-button_icon nds-button_icon-error nds-m-horizontal_xxx-small nds-hidden" aria-hidden="true" id="error-02" tabindex="-1" title="Item 2 has errors">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#warning"></use>
            </svg>
            <span class="nds-assistive-text">Item 2 has errors</span>
          </button>
          <span class="nds-row-number nds-text-body_small nds-text-color_weak"></span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <label class="nds-checkbox">
            <input type="checkbox" name="options" id="checkbox-02" tabindex="0" value="on">
            <span class="nds-checkbox_faux"></span>
            <label class="nds-checkbox__label">
              <span class="nds-form-element__label nds-assistive-text">Select item 2</span>
            </label>
          </label>
        </td>
        <th class="nds-cell-edit" scope="row">
          <span class="nds-grid nds-grid_align-spread">
            <a href="javascript:void(0);" class="nds-truncate" id="link-02" tabindex="0" title="Acme - 200 Widgets">Acme - 200 Widgets</a>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Name: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Name: Item 2</span>
            </button>
          </span>
        </th>
        <td aria-selected="false" class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="Acme">Acme</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Account Name: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Account Name: Item 2</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="1/31/15">1/31/15</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Close Date: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Close Date: Item 2</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="Prospecting">Prospecting</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Stage: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Stage: Item 2</span>
            </button>
          </span>
        </td>
        <td aria-readonly="true" class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="60%">60%</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" disabled="" tabindex="0" title="Edit Confidence: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_lock nds-button__icon_small" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#lock"></use>
              </svg>
              <span class="nds-assistive-text">Edit Confidence: Item 2</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="$5,000,000">$5,000,000</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Amount: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Amount: Item 2</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="bob@acme.com">bob@acme.com</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Contact: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Contact: Item 2</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" tabindex="0" title="Show More">
            <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
            </svg>
            <span class="nds-assistive-text">Show More</span>
          </button>
        </td>
      </tr>
      <tr class="nds-hint-parent">
        <td class="nds-cell-error nds-cell-edit" role="gridcell">
          <button class="nds-button nds-button_icon nds-button_icon-error nds-m-horizontal_xxx-small nds-hidden" aria-hidden="true" id="error-03" tabindex="-1" title="Item 3 has errors">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#warning"></use>
            </svg>
            <span class="nds-assistive-text">Item 3 has errors</span>
          </button>
          <span class="nds-row-number nds-text-body_small nds-text-color_weak"></span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <label class="nds-checkbox">
            <input type="checkbox" name="options" id="checkbox-03" tabindex="0" value="on">
            <span class="nds-checkbox_faux"></span>
            <label class="nds-checkbox__label">
              <span class="nds-form-element__label nds-assistive-text">Select item 3</span>
            </label>
          </label>
        </td>
        <th class="nds-cell-edit" scope="row">
          <span class="nds-grid nds-grid_align-spread">
            <a href="javascript:void(0);" class="nds-truncate" id="link-03" tabindex="0" title="salesforce.com - 1,000 Widgets">salesforce.com - 1,000 Widgets</a>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Name: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Name: Item 3</span>
            </button>
          </span>
        </th>
        <td aria-selected="false" class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="salesforce.com">salesforce.com</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Account Name: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Account Name: Item 3</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="1/31/15 3:45PM">1/31/15 3:45PM</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Close Date: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Close Date: Item 3</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="Id. Decision Makers">Id. Decision Makers</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Stage: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Stage: Item 3</span>
            </button>
          </span>
        </td>
        <td aria-readonly="true" class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="70%">70%</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" disabled="" tabindex="0" title="Edit Confidence: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_lock nds-button__icon_small" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#lock"></use>
              </svg>
              <span class="nds-assistive-text">Edit Confidence: Item 3</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="$25,000">$25,000</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Amount: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Amount: Item 3</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="nathan@salesforce.com">nathan@salesforce.com</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Contact: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Contact: Item 3</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" tabindex="0" title="Show More">
            <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
            </svg>
            <span class="nds-assistive-text">Show More</span>
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</div>`);
  })
  .add('Edited (states)', () => {
    return withExample(`<div class="nds-table_edit_container nds-is-relative">
  <table class="nds-table nds-table_bordered nds-table_resizable-cols nds-table_fixed-layout nds-table_edit" role="grid" style="width: 66.75rem;">
    <thead>
      <tr class="nds-line-height_reset">
        <th scope="col" style="width: 3.75rem;">
          <div class="nds-th__action">
            <span class="nds-assistive-text">Errors</span>
          </div>
        </th>
        <th scope="col" style="width: 2rem;">
          <div class="nds-th__action nds-th__action_form">
            <label class="nds-checkbox">
              <input type="checkbox" name="options" id="checkbox-89" tabindex="0" value="on">
              <span class="nds-checkbox_faux"></span>
              <label class="nds-checkbox__label">
                <span class="nds-form-element__label nds-assistive-text">Select All</span>
              </label>
            </label>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Name" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Name column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-155" tabindex="0">
            <span class="nds-resizable__handle">
              <span class="nds-resizable__divider"></span>
            </span>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Account Name" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Account Name column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-156" tabindex="0">
            <span class="nds-resizable__handle">
              <span class="nds-resizable__divider"></span>
            </span>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Close Date" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Close Date column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-157" tabindex="0">
            <span class="nds-resizable__handle">
              <span class="nds-resizable__divider"></span>
            </span>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Stage" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Stage column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-158" tabindex="0">
            <span class="nds-resizable__handle">
              <span class="nds-resizable__divider"></span>
            </span>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Confidence" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Confidence column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-159" tabindex="0">
            <span class="nds-resizable__handle">
              <span class="nds-resizable__divider"></span>
            </span>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Amount" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Amount column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-160" tabindex="0">
            <span class="nds-resizable__handle">
              <span class="nds-resizable__divider"></span>
            </span>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Contact" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Contact column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-161" tabindex="0">
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
        <td class="nds-cell-error nds-cell-edit" role="gridcell">
          <button class="nds-button nds-button_icon nds-button_icon-error nds-m-horizontal_xxx-small nds-hidden" aria-hidden="true" id="error-01" tabindex="-1" title="Item 1 has errors">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#warning"></use>
            </svg>
            <span class="nds-assistive-text">Item 1 has errors</span>
          </button>
          <span class="nds-row-number nds-text-body_small nds-text-color_weak"></span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <label class="nds-checkbox">
            <input type="checkbox" name="options" id="checkbox-01" tabindex="0" value="on">
            <span class="nds-checkbox_faux"></span>
            <label class="nds-checkbox__label">
              <span class="nds-form-element__label nds-assistive-text">Select item 1</span>
            </label>
          </label>
        </td>
        <th class="nds-cell-edit" scope="row">
          <span class="nds-grid nds-grid_align-spread">
            <a href="javascript:void(0);" class="nds-truncate" id="link-01" tabindex="0" title="Acme - 1,200 Widgets">Acme - 1,200 Widgets</a>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Name: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Name: Item 1</span>
            </button>
          </span>
        </th>
        <td class="nds-cell-edit nds-is-edited" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="Acme">Acme</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Account Name: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Account Name: Item 1</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="4/10/15">4/10/15</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Close Date: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Close Date: Item 1</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="Value Proposition">Value Proposition</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Stage: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Stage: Item 1</span>
            </button>
          </span>
        </td>
        <td aria-readonly="true" class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="30%">30%</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" disabled="" tabindex="0" title="Edit Confidence: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_lock nds-button__icon_small" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#lock"></use>
              </svg>
              <span class="nds-assistive-text">Edit Confidence: Item 1</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="$25,000,000">$25,000,000</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Amount: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Amount: Item 1</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="jrogers@acme.com">jrogers@acme.com</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Contact: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Contact: Item 1</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" tabindex="0" title="Show More">
            <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
            </svg>
            <span class="nds-assistive-text">Show More</span>
          </button>
        </td>
      </tr>
      <tr class="nds-hint-parent">
        <td class="nds-cell-error nds-cell-edit" role="gridcell">
          <button class="nds-button nds-button_icon nds-button_icon-error nds-m-horizontal_xxx-small nds-hidden" aria-hidden="true" id="error-02" tabindex="-1" title="Item 2 has errors">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#warning"></use>
            </svg>
            <span class="nds-assistive-text">Item 2 has errors</span>
          </button>
          <span class="nds-row-number nds-text-body_small nds-text-color_weak"></span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <label class="nds-checkbox">
            <input type="checkbox" name="options" id="checkbox-02" tabindex="0" value="on">
            <span class="nds-checkbox_faux"></span>
            <label class="nds-checkbox__label">
              <span class="nds-form-element__label nds-assistive-text">Select item 2</span>
            </label>
          </label>
        </td>
        <th class="nds-cell-edit" scope="row">
          <span class="nds-grid nds-grid_align-spread">
            <a href="javascript:void(0);" class="nds-truncate" id="link-02" tabindex="0" title="Acme - 200 Widgets">Acme - 200 Widgets</a>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Name: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Name: Item 2</span>
            </button>
          </span>
        </th>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="Acme">Acme</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Account Name: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Account Name: Item 2</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="1/31/15">1/31/15</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Close Date: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Close Date: Item 2</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="Prospecting">Prospecting</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Stage: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Stage: Item 2</span>
            </button>
          </span>
        </td>
        <td aria-readonly="true" class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="60%">60%</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" disabled="" tabindex="0" title="Edit Confidence: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_lock nds-button__icon_small" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#lock"></use>
              </svg>
              <span class="nds-assistive-text">Edit Confidence: Item 2</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="$5,000,000">$5,000,000</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Amount: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Amount: Item 2</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="bob@acme.com">bob@acme.com</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Contact: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Contact: Item 2</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" tabindex="0" title="Show More">
            <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
            </svg>
            <span class="nds-assistive-text">Show More</span>
          </button>
        </td>
      </tr>
      <tr class="nds-hint-parent">
        <td class="nds-cell-error nds-cell-edit" role="gridcell">
          <button class="nds-button nds-button_icon nds-button_icon-error nds-m-horizontal_xxx-small nds-hidden" aria-hidden="true" id="error-03" tabindex="-1" title="Item 3 has errors">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#warning"></use>
            </svg>
            <span class="nds-assistive-text">Item 3 has errors</span>
          </button>
          <span class="nds-row-number nds-text-body_small nds-text-color_weak"></span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <label class="nds-checkbox">
            <input type="checkbox" name="options" id="checkbox-03" tabindex="0" value="on">
            <span class="nds-checkbox_faux"></span>
            <label class="nds-checkbox__label">
              <span class="nds-form-element__label nds-assistive-text">Select item 3</span>
            </label>
          </label>
        </td>
        <th class="nds-cell-edit" scope="row">
          <span class="nds-grid nds-grid_align-spread">
            <a href="javascript:void(0);" class="nds-truncate" id="link-03" tabindex="0" title="salesforce.com - 1,000 Widgets">salesforce.com - 1,000 Widgets</a>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Name: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Name: Item 3</span>
            </button>
          </span>
        </th>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="salesforce.com">salesforce.com</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Account Name: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Account Name: Item 3</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="1/31/15 3:45PM">1/31/15 3:45PM</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Close Date: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Close Date: Item 3</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="Id. Decision Makers">Id. Decision Makers</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Stage: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Stage: Item 3</span>
            </button>
          </span>
        </td>
        <td aria-readonly="true" class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="70%">70%</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" disabled="" tabindex="0" title="Edit Confidence: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_lock nds-button__icon_small" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#lock"></use>
              </svg>
              <span class="nds-assistive-text">Edit Confidence: Item 3</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="$25,000">$25,000</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Amount: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Amount: Item 3</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="nathan@salesforce.com">nathan@salesforce.com</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Contact: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Contact: Item 3</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" tabindex="0" title="Show More">
            <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
            </svg>
            <span class="nds-assistive-text">Show More</span>
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</div>`);
  })
  .add('Row Error (states)', () => {
    return withExample(`<div class="nds-table_edit_container nds-is-relative">
  <table class="nds-table nds-table_bordered nds-table_resizable-cols nds-table_fixed-layout nds-table_edit" role="grid" style="width: 66.75rem;">
    <thead>
      <tr class="nds-line-height_reset">
        <th scope="col" style="width: 3.75rem;">
          <div class="nds-th__action">
            <span class="nds-assistive-text">Errors</span>
          </div>
        </th>
        <th scope="col" style="width: 2rem;">
          <div class="nds-th__action nds-th__action_form">
            <label class="nds-checkbox">
              <input type="checkbox" name="options" id="checkbox-97" tabindex="0" value="on">
              <span class="nds-checkbox_faux"></span>
              <label class="nds-checkbox__label">
                <span class="nds-form-element__label nds-assistive-text">Select All</span>
              </label>
            </label>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Name" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Name column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-169" tabindex="0">
            <span class="nds-resizable__handle">
              <span class="nds-resizable__divider"></span>
            </span>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Account Name" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Account Name column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-170" tabindex="0">
            <span class="nds-resizable__handle">
              <span class="nds-resizable__divider"></span>
            </span>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Close Date" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Close Date column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-171" tabindex="0">
            <span class="nds-resizable__handle">
              <span class="nds-resizable__divider"></span>
            </span>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Stage" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Stage column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-172" tabindex="0">
            <span class="nds-resizable__handle">
              <span class="nds-resizable__divider"></span>
            </span>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Confidence" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Confidence column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-173" tabindex="0">
            <span class="nds-resizable__handle">
              <span class="nds-resizable__divider"></span>
            </span>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Amount" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Amount column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-174" tabindex="0">
            <span class="nds-resizable__handle">
              <span class="nds-resizable__divider"></span>
            </span>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Contact" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Contact column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-175" tabindex="0">
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
        <td class="nds-cell-error nds-cell-edit" role="gridcell">
          <button class="nds-button nds-button_icon nds-button_icon-error nds-m-horizontal_xxx-small" id="error-01" title="Item 1 has errors">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#warning"></use>
            </svg>
            <span class="nds-assistive-text">Item 1 has errors</span>
          </button>
          <span class="nds-row-number nds-text-body_small nds-text-color_weak"></span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <label class="nds-checkbox">
            <input type="checkbox" name="options" id="checkbox-01" tabindex="0" value="on">
            <span class="nds-checkbox_faux"></span>
            <label class="nds-checkbox__label">
              <span class="nds-form-element__label nds-assistive-text">Select item 1</span>
            </label>
          </label>
        </td>
        <th class="nds-cell-edit" scope="row">
          <span class="nds-grid nds-grid_align-spread">
            <a href="javascript:void(0);" class="nds-truncate" id="link-01" tabindex="0" title="Acme - 1,200 Widgets">Acme - 1,200 Widgets</a>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Name: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Name: Item 1</span>
            </button>
          </span>
        </th>
        <td class="nds-cell-edit nds-has-focus nds-has-error" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="Acme">Acme</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Account Name: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Account Name: Item 1</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="4/10/15">4/10/15</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Close Date: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Close Date: Item 1</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="Value Proposition">Value Proposition</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Stage: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Stage: Item 1</span>
            </button>
          </span>
        </td>
        <td aria-readonly="true" class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="30%">30%</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" disabled="" tabindex="0" title="Edit Confidence: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_lock nds-button__icon_small" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#lock"></use>
              </svg>
              <span class="nds-assistive-text">Edit Confidence: Item 1</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="$25,000,000">$25,000,000</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Amount: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Amount: Item 1</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="jrogers@acme.com">jrogers@acme.com</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Contact: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Contact: Item 1</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" tabindex="0" title="Show More">
            <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
            </svg>
            <span class="nds-assistive-text">Show More</span>
          </button>
        </td>
      </tr>
      <tr class="nds-hint-parent">
        <td class="nds-cell-error nds-cell-edit" role="gridcell">
          <button class="nds-button nds-button_icon nds-button_icon-error nds-m-horizontal_xxx-small nds-hidden" aria-hidden="true" id="error-02" tabindex="-1" title="Item 2 has errors">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#warning"></use>
            </svg>
            <span class="nds-assistive-text">Item 2 has errors</span>
          </button>
          <span class="nds-row-number nds-text-body_small nds-text-color_weak"></span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <label class="nds-checkbox">
            <input type="checkbox" name="options" id="checkbox-02" tabindex="0" value="on">
            <span class="nds-checkbox_faux"></span>
            <label class="nds-checkbox__label">
              <span class="nds-form-element__label nds-assistive-text">Select item 2</span>
            </label>
          </label>
        </td>
        <th class="nds-cell-edit" scope="row">
          <span class="nds-grid nds-grid_align-spread">
            <a href="javascript:void(0);" class="nds-truncate" id="link-02" tabindex="0" title="Acme - 200 Widgets">Acme - 200 Widgets</a>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Name: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Name: Item 2</span>
            </button>
          </span>
        </th>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="Acme">Acme</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Account Name: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Account Name: Item 2</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="1/31/15">1/31/15</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Close Date: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Close Date: Item 2</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="Prospecting">Prospecting</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Stage: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Stage: Item 2</span>
            </button>
          </span>
        </td>
        <td aria-readonly="true" class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="60%">60%</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" disabled="" tabindex="0" title="Edit Confidence: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_lock nds-button__icon_small" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#lock"></use>
              </svg>
              <span class="nds-assistive-text">Edit Confidence: Item 2</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="$5,000,000">$5,000,000</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Amount: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Amount: Item 2</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="bob@acme.com">bob@acme.com</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Contact: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Contact: Item 2</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" tabindex="0" title="Show More">
            <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
            </svg>
            <span class="nds-assistive-text">Show More</span>
          </button>
        </td>
      </tr>
      <tr class="nds-hint-parent">
        <td class="nds-cell-error nds-cell-edit" role="gridcell">
          <button class="nds-button nds-button_icon nds-button_icon-error nds-m-horizontal_xxx-small nds-hidden" aria-hidden="true" id="error-03" tabindex="-1" title="Item 3 has errors">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#warning"></use>
            </svg>
            <span class="nds-assistive-text">Item 3 has errors</span>
          </button>
          <span class="nds-row-number nds-text-body_small nds-text-color_weak"></span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <label class="nds-checkbox">
            <input type="checkbox" name="options" id="checkbox-03" tabindex="0" value="on">
            <span class="nds-checkbox_faux"></span>
            <label class="nds-checkbox__label">
              <span class="nds-form-element__label nds-assistive-text">Select item 3</span>
            </label>
          </label>
        </td>
        <th class="nds-cell-edit" scope="row">
          <span class="nds-grid nds-grid_align-spread">
            <a href="javascript:void(0);" class="nds-truncate" id="link-03" tabindex="0" title="salesforce.com - 1,000 Widgets">salesforce.com - 1,000 Widgets</a>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Name: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Name: Item 3</span>
            </button>
          </span>
        </th>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="salesforce.com">salesforce.com</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Account Name: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Account Name: Item 3</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="1/31/15 3:45PM">1/31/15 3:45PM</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Close Date: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Close Date: Item 3</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="Id. Decision Makers">Id. Decision Makers</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Stage: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Stage: Item 3</span>
            </button>
          </span>
        </td>
        <td aria-readonly="true" class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="70%">70%</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" disabled="" tabindex="0" title="Edit Confidence: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_lock nds-button__icon_small" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#lock"></use>
              </svg>
              <span class="nds-assistive-text">Edit Confidence: Item 3</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="$25,000">$25,000</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Amount: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Amount: Item 3</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="nathan@salesforce.com">nathan@salesforce.com</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Contact: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Contact: Item 3</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" tabindex="0" title="Show More">
            <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
            </svg>
            <span class="nds-assistive-text">Show More</span>
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</div>`);
  })
  .add('Row Error Focused (states)', () => {
    return withExample(`<div class="nds-table_edit_container nds-is-relative">
  <table class="nds-table nds-table_bordered nds-table_resizable-cols nds-table_fixed-layout nds-table_edit" role="grid" style="width: 66.75rem;">
    <thead>
      <tr class="nds-line-height_reset">
        <th scope="col" style="width: 3.75rem;">
          <div class="nds-th__action">
            <span class="nds-assistive-text">Errors</span>
          </div>
        </th>
        <th scope="col" style="width: 2rem;">
          <div class="nds-th__action nds-th__action_form">
            <label class="nds-checkbox">
              <input type="checkbox" name="options" id="checkbox-101" tabindex="0" value="on">
              <span class="nds-checkbox_faux"></span>
              <label class="nds-checkbox__label">
                <span class="nds-form-element__label nds-assistive-text">Select All</span>
              </label>
            </label>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Name" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Name column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-176" tabindex="0">
            <span class="nds-resizable__handle">
              <span class="nds-resizable__divider"></span>
            </span>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Account Name" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Account Name column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-177" tabindex="0">
            <span class="nds-resizable__handle">
              <span class="nds-resizable__divider"></span>
            </span>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Close Date" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Close Date column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-178" tabindex="0">
            <span class="nds-resizable__handle">
              <span class="nds-resizable__divider"></span>
            </span>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Stage" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Stage column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-179" tabindex="0">
            <span class="nds-resizable__handle">
              <span class="nds-resizable__divider"></span>
            </span>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Confidence" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Confidence column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-180" tabindex="0">
            <span class="nds-resizable__handle">
              <span class="nds-resizable__divider"></span>
            </span>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Amount" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Amount column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-181" tabindex="0">
            <span class="nds-resizable__handle">
              <span class="nds-resizable__divider"></span>
            </span>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Contact" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Contact column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-182" tabindex="0">
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
        <td class="nds-cell-error nds-cell-edit nds-has-focus" role="gridcell" tabindex="0">
          <button class="nds-button nds-button_icon nds-button_icon-error nds-m-horizontal_xxx-small" aria-describedby="error-tooltip-01" id="error-01" title="Item 1 has errors">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#warning"></use>
            </svg>
            <span class="nds-assistive-text">Item 1 has errors</span>
          </button>
          <span class="nds-row-number nds-text-body_small nds-text-color_weak"></span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <label class="nds-checkbox">
            <input type="checkbox" name="options" id="checkbox-01" tabindex="0" value="on">
            <span class="nds-checkbox_faux"></span>
            <label class="nds-checkbox__label">
              <span class="nds-form-element__label nds-assistive-text">Select item 1</span>
            </label>
          </label>
        </td>
        <th class="nds-cell-edit" scope="row">
          <span class="nds-grid nds-grid_align-spread">
            <a href="javascript:void(0);" class="nds-truncate" id="link-01" tabindex="0" title="Acme - 1,200 Widgets">Acme - 1,200 Widgets</a>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Name: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Name: Item 1</span>
            </button>
          </span>
        </th>
        <td class="nds-cell-edit nds-has-error" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="Acme">Acme</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Account Name: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Account Name: Item 1</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="4/10/15">4/10/15</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Close Date: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Close Date: Item 1</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="Value Proposition">Value Proposition</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Stage: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Stage: Item 1</span>
            </button>
          </span>
        </td>
        <td aria-readonly="true" class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="30%">30%</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" disabled="" tabindex="0" title="Edit Confidence: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_lock nds-button__icon_small" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#lock"></use>
              </svg>
              <span class="nds-assistive-text">Edit Confidence: Item 1</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="$25,000,000">$25,000,000</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Amount: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Amount: Item 1</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="jrogers@acme.com">jrogers@acme.com</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Contact: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Contact: Item 1</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" tabindex="0" title="Show More">
            <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
            </svg>
            <span class="nds-assistive-text">Show More</span>
          </button>
        </td>
      </tr>
      <tr class="nds-hint-parent">
        <td class="nds-cell-error nds-cell-edit" role="gridcell">
          <button class="nds-button nds-button_icon nds-button_icon-error nds-m-horizontal_xxx-small nds-hidden" aria-hidden="true" id="error-02" tabindex="-1" title="Item 2 has errors">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#warning"></use>
            </svg>
            <span class="nds-assistive-text">Item 2 has errors</span>
          </button>
          <span class="nds-row-number nds-text-body_small nds-text-color_weak"></span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <label class="nds-checkbox">
            <input type="checkbox" name="options" id="checkbox-02" tabindex="0" value="on">
            <span class="nds-checkbox_faux"></span>
            <label class="nds-checkbox__label">
              <span class="nds-form-element__label nds-assistive-text">Select item 2</span>
            </label>
          </label>
        </td>
        <th class="nds-cell-edit" scope="row">
          <span class="nds-grid nds-grid_align-spread">
            <a href="javascript:void(0);" class="nds-truncate" id="link-02" tabindex="0" title="Acme - 200 Widgets">Acme - 200 Widgets</a>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Name: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Name: Item 2</span>
            </button>
          </span>
        </th>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="Acme">Acme</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Account Name: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Account Name: Item 2</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="1/31/15">1/31/15</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Close Date: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Close Date: Item 2</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="Prospecting">Prospecting</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Stage: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Stage: Item 2</span>
            </button>
          </span>
        </td>
        <td aria-readonly="true" class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="60%">60%</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" disabled="" tabindex="0" title="Edit Confidence: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_lock nds-button__icon_small" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#lock"></use>
              </svg>
              <span class="nds-assistive-text">Edit Confidence: Item 2</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="$5,000,000">$5,000,000</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Amount: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Amount: Item 2</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="bob@acme.com">bob@acme.com</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Contact: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Contact: Item 2</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" tabindex="0" title="Show More">
            <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
            </svg>
            <span class="nds-assistive-text">Show More</span>
          </button>
        </td>
      </tr>
      <tr class="nds-hint-parent">
        <td class="nds-cell-error nds-cell-edit" role="gridcell">
          <button class="nds-button nds-button_icon nds-button_icon-error nds-m-horizontal_xxx-small nds-hidden" aria-hidden="true" id="error-03" tabindex="-1" title="Item 3 has errors">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#warning"></use>
            </svg>
            <span class="nds-assistive-text">Item 3 has errors</span>
          </button>
          <span class="nds-row-number nds-text-body_small nds-text-color_weak"></span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <label class="nds-checkbox">
            <input type="checkbox" name="options" id="checkbox-03" tabindex="0" value="on">
            <span class="nds-checkbox_faux"></span>
            <label class="nds-checkbox__label">
              <span class="nds-form-element__label nds-assistive-text">Select item 3</span>
            </label>
          </label>
        </td>
        <th class="nds-cell-edit" scope="row">
          <span class="nds-grid nds-grid_align-spread">
            <a href="javascript:void(0);" class="nds-truncate" id="link-03" tabindex="0" title="salesforce.com - 1,000 Widgets">salesforce.com - 1,000 Widgets</a>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Name: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Name: Item 3</span>
            </button>
          </span>
        </th>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="salesforce.com">salesforce.com</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Account Name: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Account Name: Item 3</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="1/31/15 3:45PM">1/31/15 3:45PM</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Close Date: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Close Date: Item 3</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="Id. Decision Makers">Id. Decision Makers</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Stage: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Stage: Item 3</span>
            </button>
          </span>
        </td>
        <td aria-readonly="true" class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="70%">70%</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" disabled="" tabindex="0" title="Edit Confidence: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_lock nds-button__icon_small" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#lock"></use>
              </svg>
              <span class="nds-assistive-text">Edit Confidence: Item 3</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="$25,000">$25,000</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Amount: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Amount: Item 3</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="nathan@salesforce.com">nathan@salesforce.com</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="0" title="Edit Contact: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Contact: Item 3</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" tabindex="0" title="Show More">
            <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
            </svg>
            <span class="nds-assistive-text">Show More</span>
          </button>
        </td>
      </tr>
    </tbody>
  </table>
  <div class="nds-popover nds-popover_tooltip nds-nubbin_bottom-left nds-theme_error" role="tooltip" id="error-tooltip-01" style="position: absolute; top: -1rem; left: 0px; width: auto;">
    <div class="nds-popover__body">Company encountered an error.</div>
  </div>
</div>`);
  })
  .add('Header Cell Focused (states)', () => {
    return withExample(`<div class="nds-table_edit_container nds-is-relative">
  <table class="nds-table nds-table_bordered nds-table_resizable-cols nds-table_fixed-layout nds-table_edit" role="grid" style="width: 66.75rem;">
    <thead>
      <tr class="nds-line-height_reset">
        <th scope="col" style="width: 3.75rem;">
          <div class="nds-th__action">
            <span class="nds-assistive-text">Errors</span>
          </div>
        </th>
        <th scope="col" style="width: 2rem;">
          <div class="nds-th__action nds-th__action_form">
            <label class="nds-checkbox">
              <input type="checkbox" name="options" id="checkbox-105" tabindex="-1" value="on">
              <span class="nds-checkbox_faux"></span>
              <label class="nds-checkbox__label">
                <span class="nds-form-element__label nds-assistive-text">Select All</span>
              </label>
            </label>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps nds-has-focus" aria-label="Name" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Name column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-183" tabindex="-1">
            <span class="nds-resizable__handle">
              <span class="nds-resizable__divider"></span>
            </span>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Account Name" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Account Name column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-184" tabindex="-1">
            <span class="nds-resizable__handle">
              <span class="nds-resizable__divider"></span>
            </span>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Close Date" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Close Date column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-185" tabindex="-1">
            <span class="nds-resizable__handle">
              <span class="nds-resizable__divider"></span>
            </span>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Stage" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Stage column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-186" tabindex="-1">
            <span class="nds-resizable__handle">
              <span class="nds-resizable__divider"></span>
            </span>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Confidence" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Confidence column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-187" tabindex="-1">
            <span class="nds-resizable__handle">
              <span class="nds-resizable__divider"></span>
            </span>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Amount" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Amount column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-188" tabindex="-1">
            <span class="nds-resizable__handle">
              <span class="nds-resizable__divider"></span>
            </span>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Contact" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Contact column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-189" tabindex="-1">
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
        <td class="nds-cell-error nds-cell-edit" role="gridcell">
          <button class="nds-button nds-button_icon nds-button_icon-error nds-m-horizontal_xxx-small nds-hidden" aria-hidden="true" id="error-01" tabindex="-1" title="Item 1 has errors">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#warning"></use>
            </svg>
            <span class="nds-assistive-text">Item 1 has errors</span>
          </button>
          <span class="nds-row-number nds-text-body_small nds-text-color_weak"></span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <label class="nds-checkbox">
            <input type="checkbox" name="options" id="checkbox-01" tabindex="-1" value="on">
            <span class="nds-checkbox_faux"></span>
            <label class="nds-checkbox__label">
              <span class="nds-form-element__label nds-assistive-text">Select item 1</span>
            </label>
          </label>
        </td>
        <th class="nds-cell-edit" scope="row">
          <span class="nds-grid nds-grid_align-spread">
            <a href="javascript:void(0);" class="nds-truncate" id="link-01" tabindex="-1" title="Acme - 1,200 Widgets">Acme - 1,200 Widgets</a>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="-1" title="Edit Name: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Name: Item 1</span>
            </button>
          </span>
        </th>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="Acme">Acme</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="-1" title="Edit Account Name: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Account Name: Item 1</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="4/10/15">4/10/15</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="-1" title="Edit Close Date: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Close Date: Item 1</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="Value Proposition">Value Proposition</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="-1" title="Edit Stage: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Stage: Item 1</span>
            </button>
          </span>
        </td>
        <td aria-readonly="true" class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="30%">30%</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" disabled="" tabindex="-1" title="Edit Confidence: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_lock nds-button__icon_small" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#lock"></use>
              </svg>
              <span class="nds-assistive-text">Edit Confidence: Item 1</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="$25,000,000">$25,000,000</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="-1" title="Edit Amount: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Amount: Item 1</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="jrogers@acme.com">jrogers@acme.com</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="-1" title="Edit Contact: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Contact: Item 1</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" tabindex="-1" title="Show More">
            <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
            </svg>
            <span class="nds-assistive-text">Show More</span>
          </button>
        </td>
      </tr>
      <tr class="nds-hint-parent">
        <td class="nds-cell-error nds-cell-edit" role="gridcell">
          <button class="nds-button nds-button_icon nds-button_icon-error nds-m-horizontal_xxx-small nds-hidden" aria-hidden="true" id="error-02" tabindex="-1" title="Item 2 has errors">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#warning"></use>
            </svg>
            <span class="nds-assistive-text">Item 2 has errors</span>
          </button>
          <span class="nds-row-number nds-text-body_small nds-text-color_weak"></span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <label class="nds-checkbox">
            <input type="checkbox" name="options" id="checkbox-02" tabindex="-1" value="on">
            <span class="nds-checkbox_faux"></span>
            <label class="nds-checkbox__label">
              <span class="nds-form-element__label nds-assistive-text">Select item 2</span>
            </label>
          </label>
        </td>
        <th class="nds-cell-edit" scope="row">
          <span class="nds-grid nds-grid_align-spread">
            <a href="javascript:void(0);" class="nds-truncate" id="link-02" tabindex="-1" title="Acme - 200 Widgets">Acme - 200 Widgets</a>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="-1" title="Edit Name: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Name: Item 2</span>
            </button>
          </span>
        </th>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="Acme">Acme</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="-1" title="Edit Account Name: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Account Name: Item 2</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="1/31/15">1/31/15</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="-1" title="Edit Close Date: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Close Date: Item 2</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="Prospecting">Prospecting</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="-1" title="Edit Stage: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Stage: Item 2</span>
            </button>
          </span>
        </td>
        <td aria-readonly="true" class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="60%">60%</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" disabled="" tabindex="-1" title="Edit Confidence: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_lock nds-button__icon_small" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#lock"></use>
              </svg>
              <span class="nds-assistive-text">Edit Confidence: Item 2</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="$5,000,000">$5,000,000</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="-1" title="Edit Amount: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Amount: Item 2</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="bob@acme.com">bob@acme.com</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="-1" title="Edit Contact: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Contact: Item 2</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" tabindex="-1" title="Show More">
            <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
            </svg>
            <span class="nds-assistive-text">Show More</span>
          </button>
        </td>
      </tr>
      <tr class="nds-hint-parent">
        <td class="nds-cell-error nds-cell-edit" role="gridcell">
          <button class="nds-button nds-button_icon nds-button_icon-error nds-m-horizontal_xxx-small nds-hidden" aria-hidden="true" id="error-03" tabindex="-1" title="Item 3 has errors">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#warning"></use>
            </svg>
            <span class="nds-assistive-text">Item 3 has errors</span>
          </button>
          <span class="nds-row-number nds-text-body_small nds-text-color_weak"></span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <label class="nds-checkbox">
            <input type="checkbox" name="options" id="checkbox-03" tabindex="-1" value="on">
            <span class="nds-checkbox_faux"></span>
            <label class="nds-checkbox__label">
              <span class="nds-form-element__label nds-assistive-text">Select item 3</span>
            </label>
          </label>
        </td>
        <th class="nds-cell-edit" scope="row">
          <span class="nds-grid nds-grid_align-spread">
            <a href="javascript:void(0);" class="nds-truncate" id="link-03" tabindex="-1" title="salesforce.com - 1,000 Widgets">salesforce.com - 1,000 Widgets</a>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="-1" title="Edit Name: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Name: Item 3</span>
            </button>
          </span>
        </th>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="salesforce.com">salesforce.com</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="-1" title="Edit Account Name: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Account Name: Item 3</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="1/31/15 3:45PM">1/31/15 3:45PM</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="-1" title="Edit Close Date: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Close Date: Item 3</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="Id. Decision Makers">Id. Decision Makers</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="-1" title="Edit Stage: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Stage: Item 3</span>
            </button>
          </span>
        </td>
        <td aria-readonly="true" class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="70%">70%</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" disabled="" tabindex="-1" title="Edit Confidence: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_lock nds-button__icon_small" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#lock"></use>
              </svg>
              <span class="nds-assistive-text">Edit Confidence: Item 3</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="$25,000">$25,000</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="-1" title="Edit Amount: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Amount: Item 3</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="nathan@salesforce.com">nathan@salesforce.com</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="-1" title="Edit Contact: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Contact: Item 3</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" tabindex="-1" title="Show More">
            <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
            </svg>
            <span class="nds-assistive-text">Show More</span>
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</div>`);
  })
  .add('Header Cell Marked (states)', () => {
    return withExample(`<div class="nds-table_edit_container nds-is-relative">
  <table class="nds-table nds-table_bordered nds-table_resizable-cols nds-table_fixed-layout nds-no-cell-focus nds-table_edit" role="grid" style="width: 66.75rem;">
    <thead>
      <tr class="nds-line-height_reset">
        <th scope="col" style="width: 3.75rem;">
          <div class="nds-th__action">
            <span class="nds-assistive-text">Errors</span>
          </div>
        </th>
        <th scope="col" style="width: 2rem;">
          <div class="nds-th__action nds-th__action_form">
            <label class="nds-checkbox">
              <input type="checkbox" name="options" id="checkbox-109" tabindex="-1" value="on">
              <span class="nds-checkbox_faux"></span>
              <label class="nds-checkbox__label">
                <span class="nds-form-element__label nds-assistive-text">Select All</span>
              </label>
            </label>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps nds-has-focus" aria-label="Name" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Name column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-190" tabindex="-1">
            <span class="nds-resizable__handle">
              <span class="nds-resizable__divider"></span>
            </span>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Account Name" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Account Name column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-191" tabindex="-1">
            <span class="nds-resizable__handle">
              <span class="nds-resizable__divider"></span>
            </span>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Close Date" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Close Date column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-192" tabindex="-1">
            <span class="nds-resizable__handle">
              <span class="nds-resizable__divider"></span>
            </span>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Stage" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Stage column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-193" tabindex="-1">
            <span class="nds-resizable__handle">
              <span class="nds-resizable__divider"></span>
            </span>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Confidence" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Confidence column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-194" tabindex="-1">
            <span class="nds-resizable__handle">
              <span class="nds-resizable__divider"></span>
            </span>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Amount" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Amount column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-195" tabindex="-1">
            <span class="nds-resizable__handle">
              <span class="nds-resizable__divider"></span>
            </span>
          </div>
        </th>
        <th aria-sort="none" class="nds-is-sortable nds-is-resizable nds-text-title_caps" aria-label="Contact" scope="col" style="width: 8.75rem;">
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
            <input type="range" min="20" max="1000" aria-label="Contact column width" class="nds-resizable__input nds-assistive-text" id="cell-resize-handle-196" tabindex="-1">
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
        <td class="nds-cell-error nds-cell-edit" role="gridcell">
          <button class="nds-button nds-button_icon nds-button_icon-error nds-m-horizontal_xxx-small nds-hidden" aria-hidden="true" id="error-01" tabindex="-1" title="Item 1 has errors">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#warning"></use>
            </svg>
            <span class="nds-assistive-text">Item 1 has errors</span>
          </button>
          <span class="nds-row-number nds-text-body_small nds-text-color_weak"></span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <label class="nds-checkbox">
            <input type="checkbox" name="options" id="checkbox-01" tabindex="-1" value="on">
            <span class="nds-checkbox_faux"></span>
            <label class="nds-checkbox__label">
              <span class="nds-form-element__label nds-assistive-text">Select item 1</span>
            </label>
          </label>
        </td>
        <th class="nds-cell-edit" scope="row">
          <span class="nds-grid nds-grid_align-spread">
            <a href="javascript:void(0);" class="nds-truncate" id="link-01" tabindex="-1" title="Acme - 1,200 Widgets">Acme - 1,200 Widgets</a>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="-1" title="Edit Name: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Name: Item 1</span>
            </button>
          </span>
        </th>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="Acme">Acme</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="-1" title="Edit Account Name: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Account Name: Item 1</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="4/10/15">4/10/15</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="-1" title="Edit Close Date: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Close Date: Item 1</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="Value Proposition">Value Proposition</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="-1" title="Edit Stage: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Stage: Item 1</span>
            </button>
          </span>
        </td>
        <td aria-readonly="true" class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="30%">30%</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" disabled="" tabindex="-1" title="Edit Confidence: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_lock nds-button__icon_small" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#lock"></use>
              </svg>
              <span class="nds-assistive-text">Edit Confidence: Item 1</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="$25,000,000">$25,000,000</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="-1" title="Edit Amount: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Amount: Item 1</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="jrogers@acme.com">jrogers@acme.com</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="-1" title="Edit Contact: Item 1">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Contact: Item 1</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" tabindex="-1" title="Show More">
            <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
            </svg>
            <span class="nds-assistive-text">Show More</span>
          </button>
        </td>
      </tr>
      <tr class="nds-hint-parent">
        <td class="nds-cell-error nds-cell-edit" role="gridcell">
          <button class="nds-button nds-button_icon nds-button_icon-error nds-m-horizontal_xxx-small nds-hidden" aria-hidden="true" id="error-02" tabindex="-1" title="Item 2 has errors">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#warning"></use>
            </svg>
            <span class="nds-assistive-text">Item 2 has errors</span>
          </button>
          <span class="nds-row-number nds-text-body_small nds-text-color_weak"></span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <label class="nds-checkbox">
            <input type="checkbox" name="options" id="checkbox-02" tabindex="-1" value="on">
            <span class="nds-checkbox_faux"></span>
            <label class="nds-checkbox__label">
              <span class="nds-form-element__label nds-assistive-text">Select item 2</span>
            </label>
          </label>
        </td>
        <th class="nds-cell-edit" scope="row">
          <span class="nds-grid nds-grid_align-spread">
            <a href="javascript:void(0);" class="nds-truncate" id="link-02" tabindex="-1" title="Acme - 200 Widgets">Acme - 200 Widgets</a>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="-1" title="Edit Name: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Name: Item 2</span>
            </button>
          </span>
        </th>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="Acme">Acme</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="-1" title="Edit Account Name: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Account Name: Item 2</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="1/31/15">1/31/15</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="-1" title="Edit Close Date: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Close Date: Item 2</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="Prospecting">Prospecting</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="-1" title="Edit Stage: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Stage: Item 2</span>
            </button>
          </span>
        </td>
        <td aria-readonly="true" class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="60%">60%</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" disabled="" tabindex="-1" title="Edit Confidence: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_lock nds-button__icon_small" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#lock"></use>
              </svg>
              <span class="nds-assistive-text">Edit Confidence: Item 2</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="$5,000,000">$5,000,000</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="-1" title="Edit Amount: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Amount: Item 2</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="bob@acme.com">bob@acme.com</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="-1" title="Edit Contact: Item 2">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Contact: Item 2</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" tabindex="-1" title="Show More">
            <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
            </svg>
            <span class="nds-assistive-text">Show More</span>
          </button>
        </td>
      </tr>
      <tr class="nds-hint-parent">
        <td class="nds-cell-error nds-cell-edit" role="gridcell">
          <button class="nds-button nds-button_icon nds-button_icon-error nds-m-horizontal_xxx-small nds-hidden" aria-hidden="true" id="error-03" tabindex="-1" title="Item 3 has errors">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#warning"></use>
            </svg>
            <span class="nds-assistive-text">Item 3 has errors</span>
          </button>
          <span class="nds-row-number nds-text-body_small nds-text-color_weak"></span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <label class="nds-checkbox">
            <input type="checkbox" name="options" id="checkbox-03" tabindex="-1" value="on">
            <span class="nds-checkbox_faux"></span>
            <label class="nds-checkbox__label">
              <span class="nds-form-element__label nds-assistive-text">Select item 3</span>
            </label>
          </label>
        </td>
        <th class="nds-cell-edit" scope="row">
          <span class="nds-grid nds-grid_align-spread">
            <a href="javascript:void(0);" class="nds-truncate" id="link-03" tabindex="-1" title="salesforce.com - 1,000 Widgets">salesforce.com - 1,000 Widgets</a>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="-1" title="Edit Name: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Name: Item 3</span>
            </button>
          </span>
        </th>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="salesforce.com">salesforce.com</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="-1" title="Edit Account Name: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Account Name: Item 3</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="1/31/15 3:45PM">1/31/15 3:45PM</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="-1" title="Edit Close Date: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Close Date: Item 3</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="Id. Decision Makers">Id. Decision Makers</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="-1" title="Edit Stage: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Stage: Item 3</span>
            </button>
          </span>
        </td>
        <td aria-readonly="true" class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="70%">70%</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" disabled="" tabindex="-1" title="Edit Confidence: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_lock nds-button__icon_small" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#lock"></use>
              </svg>
              <span class="nds-assistive-text">Edit Confidence: Item 3</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="$25,000">$25,000</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="-1" title="Edit Amount: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Amount: Item 3</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <span class="nds-grid nds-grid_align-spread">
            <span class="nds-truncate" title="nathan@salesforce.com">nathan@salesforce.com</span>
            <button class="nds-button nds-button_icon nds-cell-edit__button nds-m-left_x-small" tabindex="-1" title="Edit Contact: Item 3">
              <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_edit" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
              </svg>
              <span class="nds-assistive-text">Edit Contact: Item 3</span>
            </button>
          </span>
        </td>
        <td class="nds-cell-edit" role="gridcell">
          <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" tabindex="-1" title="Show More">
            <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
            </svg>
            <span class="nds-assistive-text">Show More</span>
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</div>`);
  });
