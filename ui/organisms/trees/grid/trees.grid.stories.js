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
    return withExample(`<table class="nds-table nds-table_bordered nds-tree nds-table_tree" role="treegrid" aria-readonly="true">
  <thead>
    <tr class="nds-text-title_caps">
      <th class="nds-cell-buffer_left" scope="col">
        <div class="nds-grid nds-grid_vertical-align-center">
          <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small nds-m-right_x-small nds-shrink-none nds-table_tree__toggle" tabindex="-1" title="Expand all rows">
            <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
            </svg>
            <span class="nds-assistive-text">Expand all rows</span>
          </button>
          <div class="nds-truncate" title="Account Name">Account Name</div>
        </div>
      </th>
      <th scope="col">
        <div class="nds-truncate" title="Employees">Employees</div>
      </th>
      <th scope="col">
        <div class="nds-truncate" title="Phone Number">Phone Number</div>
      </th>
      <th scope="col">
        <div class="nds-truncate" title="Account Owner">Account Owner</div>
      </th>
      <th scope="col">
        <div class="nds-truncate" title="Billing City">Billing City</div>
      </th>
      <th class="nds-cell-shrink" scope="col">
        <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" aria-haspopup="true" tabindex="-1" title="Show More">
          <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
          </svg>
          <span class="nds-assistive-text">Show More</span>
        </button>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr aria-level="1" aria-posinset="1" aria-setsize="4" class="nds-hint-parent" tabindex="0">
      <th class="nds-tree__item" data-label="Account Name" scope="row">
        <button class="nds-button nds-button_icon nds-button_icon nds-button_icon-x-small nds-m-right_x-small nds-is-disabled" aria-hidden="true" tabindex="-1" title="Expand Rewis Inc">
          <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevronright"></use>
          </svg>
          <span class="nds-assistive-text">Collapse Rewis Inc</span>
        </button>
        <div class="nds-truncate" title="Rewis Inc">
          <a href="javascript:void(0);" tabindex="-1">Rewis Inc</a>
        </div>
      </th>
      <td data-label="Employees">
        <div class="nds-truncate" title="3,100">3,100</div>
      </td>
      <td data-label="Phone Number">
        <div class="nds-truncate" title="837-555-1212">837-555-1212</div>
      </td>
      <td data-label="Account Owner">
        <div class="nds-truncate" title="Jane Doe">
          <a href="javascript:void(0);" tabindex="-1">Jane Doe</a>
        </div>
      </td>
      <td data-label="Billing City">
        <div class="nds-truncate" title="Phoenix, AZ">Phoenix, AZ</div>
      </td>
      <td class="nds-cell-shrink">
        <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" aria-haspopup="true" tabindex="-1" title="More actions for Rewis Inc">
          <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
          </svg>
          <span class="nds-assistive-text">More actions for Rewis Inc</span>
        </button>
      </td>
    </tr>
    <tr aria-expanded="false" aria-level="1" aria-posinset="2" aria-setsize="4" class="nds-hint-parent">
      <th class="nds-tree__item" data-label="Account Name" scope="row">
        <button class="nds-button nds-button_icon nds-button_icon nds-button_icon-x-small nds-m-right_x-small" aria-hidden="true" tabindex="-1" title="Collapse Acme Corporation">
          <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevronright"></use>
          </svg>
          <span class="nds-assistive-text">Expand Acme Corporation</span>
        </button>
        <div class="nds-truncate" title="Acme Corporation">
          <a href="javascript:void(0);" tabindex="-1">Acme Corporation</a>
        </div>
      </th>
      <td data-label="Employees">
        <div class="nds-truncate" title="10,000">10,000</div>
      </td>
      <td data-label="Phone Number">
        <div class="nds-truncate" title="837-555-1212">837-555-1212</div>
      </td>
      <td data-label="Account Owner">
        <div class="nds-truncate" title="John Doe">
          <a href="javascript:void(0);" tabindex="-1">John Doe</a>
        </div>
      </td>
      <td data-label="Billing City">
        <div class="nds-truncate" title="San Francisco, CA">San Francisco, CA</div>
      </td>
      <td class="nds-cell-shrink">
        <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" aria-haspopup="true" tabindex="-1" title="More actions for Acme Corporation">
          <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
          </svg>
          <span class="nds-assistive-text">More actions for Acme Corporation</span>
        </button>
      </td>
    </tr>
    <tr aria-expanded="false" aria-level="1" aria-posinset="3" aria-setsize="4" class="nds-hint-parent">
      <th class="nds-tree__item" data-label="Account Name" scope="row">
        <button class="nds-button nds-button_icon nds-button_icon nds-button_icon-x-small nds-m-right_x-small" aria-hidden="true" tabindex="-1" title="Collapse Rohde Enterprises">
          <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevronright"></use>
          </svg>
          <span class="nds-assistive-text">Expand Rohde Enterprises</span>
        </button>
        <div class="nds-truncate" title="Rohde Enterprises">
          <a href="javascript:void(0);" tabindex="-1">Rohde Enterprises</a>
        </div>
      </th>
      <td data-label="Employees">
        <div class="nds-truncate" title="6,000">6,000</div>
      </td>
      <td data-label="Phone Number">
        <div class="nds-truncate" title="837-555-1212">837-555-1212</div>
      </td>
      <td data-label="Account Owner">
        <div class="nds-truncate" title="John Doe">
          <a href="javascript:void(0);" tabindex="-1">John Doe</a>
        </div>
      </td>
      <td data-label="Billing City">
        <div class="nds-truncate" title="New York, NY">New York, NY</div>
      </td>
      <td class="nds-cell-shrink">
        <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" aria-haspopup="true" tabindex="-1" title="More actions for Rohde Enterprises">
          <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
          </svg>
          <span class="nds-assistive-text">More actions for Rohde Enterprises</span>
        </button>
      </td>
    </tr>
    <tr aria-level="1" aria-posinset="4" aria-setsize="4" class="nds-hint-parent">
      <th class="nds-tree__item" data-label="Account Name" scope="row">
        <button class="nds-button nds-button_icon nds-button_icon nds-button_icon-x-small nds-m-right_x-small nds-is-disabled" aria-hidden="true" tabindex="-1" title="Expand Cheese Corp">
          <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevronright"></use>
          </svg>
          <span class="nds-assistive-text">Collapse Cheese Corp</span>
        </button>
        <div class="nds-truncate" title="Cheese Corp">
          <a href="javascript:void(0);" tabindex="-1">Cheese Corp</a>
        </div>
      </th>
      <td data-label="Employees">
        <div class="nds-truncate" title="1,234">1,234</div>
      </td>
      <td data-label="Phone Number">
        <div class="nds-truncate" title="837-555-1212">837-555-1212</div>
      </td>
      <td data-label="Account Owner">
        <div class="nds-truncate" title="Jane Doe">
          <a href="javascript:void(0);" tabindex="-1">Jane Doe</a>
        </div>
      </td>
      <td data-label="Billing City">
        <div class="nds-truncate" title="Paris, France">Paris, France</div>
      </td>
      <td class="nds-cell-shrink">
        <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" aria-haspopup="true" tabindex="-1" title="More actions for Cheese Corp">
          <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
          </svg>
          <span class="nds-assistive-text">More actions for Cheese Corp</span>
        </button>
      </td>
    </tr>
  </tbody>
</table>`);
  })
  .add('Expanded (states)', () => {
    return withExample(`<table class="nds-table nds-table_bordered nds-tree nds-table_tree" role="treegrid" aria-readonly="true">
  <thead>
    <tr class="nds-text-title_caps">
      <th class="nds-cell-buffer_left" scope="col">
        <div class="nds-grid nds-grid_vertical-align-center">
          <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small nds-m-right_x-small nds-shrink-none nds-table_tree__toggle" tabindex="-1" title="Expand all rows">
            <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
            </svg>
            <span class="nds-assistive-text">Expand all rows</span>
          </button>
          <div class="nds-truncate" title="Account Name">Account Name</div>
        </div>
      </th>
      <th scope="col">
        <div class="nds-truncate" title="Employees">Employees</div>
      </th>
      <th scope="col">
        <div class="nds-truncate" title="Phone Number">Phone Number</div>
      </th>
      <th scope="col">
        <div class="nds-truncate" title="Account Owner">Account Owner</div>
      </th>
      <th scope="col">
        <div class="nds-truncate" title="Billing City">Billing City</div>
      </th>
      <th class="nds-cell-shrink" scope="col">
        <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" aria-haspopup="true" tabindex="-1" title="Show More">
          <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
          </svg>
          <span class="nds-assistive-text">Show More</span>
        </button>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr aria-level="1" aria-posinset="1" aria-setsize="4" class="nds-hint-parent" tabindex="0">
      <th class="nds-tree__item" data-label="Account Name" scope="row">
        <button class="nds-button nds-button_icon nds-button_icon nds-button_icon-x-small nds-m-right_x-small nds-is-disabled" aria-hidden="true" tabindex="-1" title="Expand Rewis Inc">
          <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevronright"></use>
          </svg>
          <span class="nds-assistive-text">Collapse Rewis Inc</span>
        </button>
        <div class="nds-truncate" title="Rewis Inc">
          <a href="javascript:void(0);" tabindex="-1">Rewis Inc</a>
        </div>
      </th>
      <td data-label="Employees">
        <div class="nds-truncate" title="3,100">3,100</div>
      </td>
      <td data-label="Phone Number">
        <div class="nds-truncate" title="837-555-1212">837-555-1212</div>
      </td>
      <td data-label="Account Owner">
        <div class="nds-truncate" title="Jane Doe">
          <a href="javascript:void(0);" tabindex="-1">Jane Doe</a>
        </div>
      </td>
      <td data-label="Billing City">
        <div class="nds-truncate" title="Phoenix, AZ">Phoenix, AZ</div>
      </td>
      <td class="nds-cell-shrink">
        <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" aria-haspopup="true" tabindex="-1" title="More actions for Rewis Inc">
          <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
          </svg>
          <span class="nds-assistive-text">More actions for Rewis Inc</span>
        </button>
      </td>
    </tr>
    <tr aria-expanded="true" aria-level="1" aria-posinset="2" aria-setsize="4" class="nds-hint-parent">
      <th class="nds-tree__item" data-label="Account Name" scope="row">
        <button class="nds-button nds-button_icon nds-button_icon nds-button_icon-x-small nds-m-right_x-small" aria-hidden="true" tabindex="-1" title="Collapse Acme Corporation">
          <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevronright"></use>
          </svg>
          <span class="nds-assistive-text">Expand Acme Corporation</span>
        </button>
        <div class="nds-truncate" title="Acme Corporation">
          <a href="javascript:void(0);" tabindex="-1">Acme Corporation</a>
        </div>
      </th>
      <td data-label="Employees">
        <div class="nds-truncate" title="10,000">10,000</div>
      </td>
      <td data-label="Phone Number">
        <div class="nds-truncate" title="837-555-1212">837-555-1212</div>
      </td>
      <td data-label="Account Owner">
        <div class="nds-truncate" title="John Doe">
          <a href="javascript:void(0);" tabindex="-1">John Doe</a>
        </div>
      </td>
      <td data-label="Billing City">
        <div class="nds-truncate" title="San Francisco, CA">San Francisco, CA</div>
      </td>
      <td class="nds-cell-shrink">
        <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" aria-haspopup="true" tabindex="-1" title="More actions for Acme Corporation">
          <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
          </svg>
          <span class="nds-assistive-text">More actions for Acme Corporation</span>
        </button>
      </td>
    </tr>
    <tr aria-level="2" aria-posinset="1" aria-setsize="1" class="nds-hint-parent">
      <th class="nds-tree__item" data-label="Account Name" scope="row">
        <button class="nds-button nds-button_icon nds-button_icon nds-button_icon-x-small nds-m-right_x-small nds-is-disabled" aria-hidden="true" tabindex="-1" title="Expand Acme Corporation (Oakland)">
          <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevronright"></use>
          </svg>
          <span class="nds-assistive-text">Collapse Acme Corporation (Oakland)</span>
        </button>
        <div class="nds-truncate" title="Acme Corporation (Oakland)">
          <a href="javascript:void(0);" tabindex="-1">Acme Corporation (Oakland)</a>
        </div>
      </th>
      <td data-label="Employees">
        <div class="nds-truncate" title="745">745</div>
      </td>
      <td data-label="Phone Number">
        <div class="nds-truncate" title="837-555-1212">837-555-1212</div>
      </td>
      <td data-label="Account Owner">
        <div class="nds-truncate" title="John Doe">
          <a href="javascript:void(0);" tabindex="-1">John Doe</a>
        </div>
      </td>
      <td data-label="Billing City">
        <div class="nds-truncate" title="New York, NY">New York, NY</div>
      </td>
      <td class="nds-cell-shrink">
        <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" aria-haspopup="true" tabindex="-1" title="More actions for Acme Corporation (Oakland)">
          <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
          </svg>
          <span class="nds-assistive-text">More actions for Acme Corporation (Oakland)</span>
        </button>
      </td>
    </tr>
    <tr aria-expanded="false" aria-level="1" aria-posinset="3" aria-setsize="4" class="nds-hint-parent">
      <th class="nds-tree__item" data-label="Account Name" scope="row">
        <button class="nds-button nds-button_icon nds-button_icon nds-button_icon-x-small nds-m-right_x-small" aria-hidden="true" tabindex="-1" title="Collapse Rohde Enterprises">
          <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevronright"></use>
          </svg>
          <span class="nds-assistive-text">Expand Rohde Enterprises</span>
        </button>
        <div class="nds-truncate" title="Rohde Enterprises">
          <a href="javascript:void(0);" tabindex="-1">Rohde Enterprises</a>
        </div>
      </th>
      <td data-label="Employees">
        <div class="nds-truncate" title="6,000">6,000</div>
      </td>
      <td data-label="Phone Number">
        <div class="nds-truncate" title="837-555-1212">837-555-1212</div>
      </td>
      <td data-label="Account Owner">
        <div class="nds-truncate" title="John Doe">
          <a href="javascript:void(0);" tabindex="-1">John Doe</a>
        </div>
      </td>
      <td data-label="Billing City">
        <div class="nds-truncate" title="New York, NY">New York, NY</div>
      </td>
      <td class="nds-cell-shrink">
        <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" aria-haspopup="true" tabindex="-1" title="More actions for Rohde Enterprises">
          <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
          </svg>
          <span class="nds-assistive-text">More actions for Rohde Enterprises</span>
        </button>
      </td>
    </tr>
    <tr aria-level="1" aria-posinset="4" aria-setsize="4" class="nds-hint-parent">
      <th class="nds-tree__item" data-label="Account Name" scope="row">
        <button class="nds-button nds-button_icon nds-button_icon nds-button_icon-x-small nds-m-right_x-small nds-is-disabled" aria-hidden="true" tabindex="-1" title="Expand Cheese Corp">
          <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevronright"></use>
          </svg>
          <span class="nds-assistive-text">Collapse Cheese Corp</span>
        </button>
        <div class="nds-truncate" title="Cheese Corp">
          <a href="javascript:void(0);" tabindex="-1">Cheese Corp</a>
        </div>
      </th>
      <td data-label="Employees">
        <div class="nds-truncate" title="1,234">1,234</div>
      </td>
      <td data-label="Phone Number">
        <div class="nds-truncate" title="837-555-1212">837-555-1212</div>
      </td>
      <td data-label="Account Owner">
        <div class="nds-truncate" title="Jane Doe">
          <a href="javascript:void(0);" tabindex="-1">Jane Doe</a>
        </div>
      </td>
      <td data-label="Billing City">
        <div class="nds-truncate" title="Paris, France">Paris, France</div>
      </td>
      <td class="nds-cell-shrink">
        <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" aria-haspopup="true" tabindex="-1" title="More actions for Cheese Corp">
          <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
          </svg>
          <span class="nds-assistive-text">More actions for Cheese Corp</span>
        </button>
      </td>
    </tr>
  </tbody>
</table>`);
  })
  .add('Deep Nesting (states)', () => {
    return withExample(`<table class="nds-table nds-table_bordered nds-tree nds-table_tree" role="treegrid" aria-readonly="true">
  <thead>
    <tr class="nds-text-title_caps">
      <th class="nds-cell-buffer_left" scope="col">
        <div class="nds-grid nds-grid_vertical-align-center">
          <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small nds-m-right_x-small nds-shrink-none nds-table_tree__toggle" tabindex="-1" title="Expand all rows">
            <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
            </svg>
            <span class="nds-assistive-text">Expand all rows</span>
          </button>
          <div class="nds-truncate" title="Account Name">Account Name</div>
        </div>
      </th>
      <th scope="col">
        <div class="nds-truncate" title="Employees">Employees</div>
      </th>
      <th scope="col">
        <div class="nds-truncate" title="Phone Number">Phone Number</div>
      </th>
      <th scope="col">
        <div class="nds-truncate" title="Account Owner">Account Owner</div>
      </th>
      <th scope="col">
        <div class="nds-truncate" title="Billing City">Billing City</div>
      </th>
      <th class="nds-cell-shrink" scope="col">
        <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" aria-haspopup="true" tabindex="-1" title="Show More">
          <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
          </svg>
          <span class="nds-assistive-text">Show More</span>
        </button>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr aria-level="1" aria-posinset="1" aria-setsize="4" class="nds-hint-parent" tabindex="0">
      <th class="nds-tree__item" data-label="Account Name" scope="row">
        <button class="nds-button nds-button_icon nds-button_icon nds-button_icon-x-small nds-m-right_x-small nds-is-disabled" aria-hidden="true" tabindex="-1" title="Expand Rewis Inc">
          <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevronright"></use>
          </svg>
          <span class="nds-assistive-text">Collapse Rewis Inc</span>
        </button>
        <div class="nds-truncate" title="Rewis Inc">
          <a href="javascript:void(0);" tabindex="-1">Rewis Inc</a>
        </div>
      </th>
      <td data-label="Employees">
        <div class="nds-truncate" title="3,100">3,100</div>
      </td>
      <td data-label="Phone Number">
        <div class="nds-truncate" title="837-555-1212">837-555-1212</div>
      </td>
      <td data-label="Account Owner">
        <div class="nds-truncate" title="Jane Doe">
          <a href="javascript:void(0);" tabindex="-1">Jane Doe</a>
        </div>
      </td>
      <td data-label="Billing City">
        <div class="nds-truncate" title="Phoenix, AZ">Phoenix, AZ</div>
      </td>
      <td class="nds-cell-shrink">
        <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" aria-haspopup="true" tabindex="-1" title="More actions for Rewis Inc">
          <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
          </svg>
          <span class="nds-assistive-text">More actions for Rewis Inc</span>
        </button>
      </td>
    </tr>
    <tr aria-expanded="true" aria-level="1" aria-posinset="2" aria-setsize="4" class="nds-hint-parent">
      <th class="nds-tree__item" data-label="Account Name" scope="row">
        <button class="nds-button nds-button_icon nds-button_icon nds-button_icon-x-small nds-m-right_x-small" aria-hidden="true" tabindex="-1" title="Collapse Acme Corporation">
          <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevronright"></use>
          </svg>
          <span class="nds-assistive-text">Expand Acme Corporation</span>
        </button>
        <div class="nds-truncate" title="Acme Corporation">
          <a href="javascript:void(0);" tabindex="-1">Acme Corporation</a>
        </div>
      </th>
      <td data-label="Employees">
        <div class="nds-truncate" title="10,000">10,000</div>
      </td>
      <td data-label="Phone Number">
        <div class="nds-truncate" title="837-555-1212">837-555-1212</div>
      </td>
      <td data-label="Account Owner">
        <div class="nds-truncate" title="John Doe">
          <a href="javascript:void(0);" tabindex="-1">John Doe</a>
        </div>
      </td>
      <td data-label="Billing City">
        <div class="nds-truncate" title="San Francisco, CA">San Francisco, CA</div>
      </td>
      <td class="nds-cell-shrink">
        <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" aria-haspopup="true" tabindex="-1" title="More actions for Acme Corporation">
          <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
          </svg>
          <span class="nds-assistive-text">More actions for Acme Corporation</span>
        </button>
      </td>
    </tr>
    <tr aria-expanded="true" aria-level="2" aria-posinset="1" aria-setsize="2" class="nds-hint-parent">
      <th class="nds-tree__item" data-label="Account Name" scope="row">
        <button class="nds-button nds-button_icon nds-button_icon nds-button_icon-x-small nds-m-right_x-small" aria-hidden="true" tabindex="-1" title="Collapse Acme Corporation (Bay Area)">
          <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevronright"></use>
          </svg>
          <span class="nds-assistive-text">Expand Acme Corporation (Bay Area)</span>
        </button>
        <div class="nds-truncate" title="Acme Corporation (Bay Area)">
          <a href="javascript:void(0);" tabindex="-1">Acme Corporation (Bay Area)</a>
        </div>
      </th>
      <td data-label="Employees">
        <div class="nds-truncate" title="3,000">3,000</div>
      </td>
      <td data-label="Phone Number">
        <div class="nds-truncate" title="837-555-1212">837-555-1212</div>
      </td>
      <td data-label="Account Owner">
        <div class="nds-truncate" title="John Doe">
          <a href="javascript:void(0);" tabindex="-1">John Doe</a>
        </div>
      </td>
      <td data-label="Billing City">
        <div class="nds-truncate" title="New York, NY">New York, NY</div>
      </td>
      <td class="nds-cell-shrink">
        <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" aria-haspopup="true" tabindex="-1" title="More actions for Acme Corporation (Bay Area)">
          <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
          </svg>
          <span class="nds-assistive-text">More actions for Acme Corporation (Bay Area)</span>
        </button>
      </td>
    </tr>
    <tr aria-level="3" aria-posinset="1" aria-setsize="2" class="nds-hint-parent">
      <th class="nds-tree__item" data-label="Account Name" scope="row">
        <button class="nds-button nds-button_icon nds-button_icon nds-button_icon-x-small nds-m-right_x-small nds-is-disabled" aria-hidden="true" tabindex="-1" title="Expand Acme Corporation (Oakland)">
          <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevronright"></use>
          </svg>
          <span class="nds-assistive-text">Collapse Acme Corporation (Oakland)</span>
        </button>
        <div class="nds-truncate" title="Acme Corporation (Oakland)">
          <a href="javascript:void(0);" tabindex="-1">Acme Corporation (Oakland)</a>
        </div>
      </th>
      <td data-label="Employees">
        <div class="nds-truncate" title="745">745</div>
      </td>
      <td data-label="Phone Number">
        <div class="nds-truncate" title="837-555-1212">837-555-1212</div>
      </td>
      <td data-label="Account Owner">
        <div class="nds-truncate" title="John Doe">
          <a href="javascript:void(0);" tabindex="-1">John Doe</a>
        </div>
      </td>
      <td data-label="Billing City">
        <div class="nds-truncate" title="New York, NY">New York, NY</div>
      </td>
      <td class="nds-cell-shrink">
        <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" aria-haspopup="true" tabindex="-1" title="More actions for Acme Corporation (Oakland)">
          <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
          </svg>
          <span class="nds-assistive-text">More actions for Acme Corporation (Oakland)</span>
        </button>
      </td>
    </tr>
    <tr aria-level="3" aria-posinset="2" aria-setsize="2" class="nds-hint-parent">
      <th class="nds-tree__item" data-label="Account Name" scope="row">
        <button class="nds-button nds-button_icon nds-button_icon nds-button_icon-x-small nds-m-right_x-small nds-is-disabled" aria-hidden="true" tabindex="-1" title="Expand Acme Corporation (San Francisco)">
          <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevronright"></use>
          </svg>
          <span class="nds-assistive-text">Collapse Acme Corporation (San Francisco)</span>
        </button>
        <div class="nds-truncate" title="Acme Corporation (San Francisco)">
          <a href="javascript:void(0);" tabindex="-1">Acme Corporation (San Francisco)</a>
        </div>
      </th>
      <td data-label="Employees">
        <div class="nds-truncate" title="578">578</div>
      </td>
      <td data-label="Phone Number">
        <div class="nds-truncate" title="837-555-1212">837-555-1212</div>
      </td>
      <td data-label="Account Owner">
        <div class="nds-truncate" title="Jane Doe">
          <a href="javascript:void(0);" tabindex="-1">Jane Doe</a>
        </div>
      </td>
      <td data-label="Billing City">
        <div class="nds-truncate" title="Los Angeles, CA">Los Angeles, CA</div>
      </td>
      <td class="nds-cell-shrink">
        <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" aria-haspopup="true" tabindex="-1" title="More actions for Acme Corporation (San Francisco)">
          <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
          </svg>
          <span class="nds-assistive-text">More actions for Acme Corporation (San Francisco)</span>
        </button>
      </td>
    </tr>
    <tr aria-expanded="true" aria-level="2" aria-posinset="2" aria-setsize="2" class="nds-hint-parent">
      <th class="nds-tree__item" data-label="Account Name" scope="row">
        <button class="nds-button nds-button_icon nds-button_icon nds-button_icon-x-small nds-m-right_x-small" aria-hidden="true" tabindex="-1" title="Collapse Acme Corporation (East)">
          <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevronright"></use>
          </svg>
          <span class="nds-assistive-text">Expand Acme Corporation (East)</span>
        </button>
        <div class="nds-truncate" title="Acme Corporation (East)">
          <a href="javascript:void(0);" tabindex="-1">Acme Corporation (East)</a>
        </div>
      </th>
      <td data-label="Employees">
        <div class="nds-truncate" title="430">430</div>
      </td>
      <td data-label="Phone Number">
        <div class="nds-truncate" title="837-555-1212">837-555-1212</div>
      </td>
      <td data-label="Account Owner">
        <div class="nds-truncate" title="John Doe">
          <a href="javascript:void(0);" tabindex="-1">John Doe</a>
        </div>
      </td>
      <td data-label="Billing City">
        <div class="nds-truncate" title="San Francisco, CA">San Francisco, CA</div>
      </td>
      <td class="nds-cell-shrink">
        <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" aria-haspopup="true" tabindex="-1" title="More actions for Acme Corporation (East)">
          <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
          </svg>
          <span class="nds-assistive-text">More actions for Acme Corporation (East)</span>
        </button>
      </td>
    </tr>
    <tr aria-level="3" aria-posinset="1" aria-setsize="2" class="nds-hint-parent">
      <th class="nds-tree__item" data-label="Account Name" scope="row">
        <button class="nds-button nds-button_icon nds-button_icon nds-button_icon-x-small nds-m-right_x-small nds-is-disabled" aria-hidden="true" tabindex="-1" title="Expand Acme Corporation (NY)">
          <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevronright"></use>
          </svg>
          <span class="nds-assistive-text">Collapse Acme Corporation (NY)</span>
        </button>
        <div class="nds-truncate" title="Acme Corporation (NY)">
          <a href="javascript:void(0);" tabindex="-1">Acme Corporation (NY)</a>
        </div>
      </th>
      <td data-label="Employees">
        <div class="nds-truncate" title="1,210">1,210</div>
      </td>
      <td data-label="Phone Number">
        <div class="nds-truncate" title="837-555-1212">837-555-1212</div>
      </td>
      <td data-label="Account Owner">
        <div class="nds-truncate" title="Jane Doe">
          <a href="javascript:void(0);" tabindex="-1">Jane Doe</a>
        </div>
      </td>
      <td data-label="Billing City">
        <div class="nds-truncate" title="New York, NY">New York, NY</div>
      </td>
      <td class="nds-cell-shrink">
        <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" aria-haspopup="true" tabindex="-1" title="More actions for Acme Corporation (NY)">
          <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
          </svg>
          <span class="nds-assistive-text">More actions for Acme Corporation (NY)</span>
        </button>
      </td>
    </tr>
    <tr aria-expanded="true" aria-level="3" aria-posinset="2" aria-setsize="2" class="nds-hint-parent">
      <th class="nds-tree__item" data-label="Account Name" scope="row">
        <button class="nds-button nds-button_icon nds-button_icon nds-button_icon-x-small nds-m-right_x-small" aria-hidden="true" tabindex="-1" title="Collapse Acme Corporation (VA)">
          <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevronright"></use>
          </svg>
          <span class="nds-assistive-text">Expand Acme Corporation (VA)</span>
        </button>
        <div class="nds-truncate" title="Acme Corporation (VA)">
          <a href="javascript:void(0);" tabindex="-1">Acme Corporation (VA)</a>
        </div>
      </th>
      <td data-label="Employees">
        <div class="nds-truncate" title="410">410</div>
      </td>
      <td data-label="Phone Number">
        <div class="nds-truncate" title="837-555-1212">837-555-1212</div>
      </td>
      <td data-label="Account Owner">
        <div class="nds-truncate" title="John Doe">
          <a href="javascript:void(0);" tabindex="-1">John Doe</a>
        </div>
      </td>
      <td data-label="Billing City">
        <div class="nds-truncate" title="New York, NY">New York, NY</div>
      </td>
      <td class="nds-cell-shrink">
        <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" aria-haspopup="true" tabindex="-1" title="More actions for Acme Corporation (VA)">
          <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
          </svg>
          <span class="nds-assistive-text">More actions for Acme Corporation (VA)</span>
        </button>
      </td>
    </tr>
    <tr aria-expanded="true" aria-level="4" aria-posinset="1" aria-setsize="1" class="nds-hint-parent">
      <th class="nds-tree__item" data-label="Account Name" scope="row">
        <button class="nds-button nds-button_icon nds-button_icon nds-button_icon-x-small nds-m-right_x-small" aria-hidden="true" tabindex="-1" title="Collapse Allied Technologies">
          <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevronright"></use>
          </svg>
          <span class="nds-assistive-text">Expand Allied Technologies</span>
        </button>
        <div class="nds-truncate" title="Allied Technologies">
          <a href="javascript:void(0);" tabindex="-1">Allied Technologies</a>
        </div>
      </th>
      <td data-label="Employees">
        <div class="nds-truncate" title="390">390</div>
      </td>
      <td data-label="Phone Number">
        <div class="nds-truncate" title="837-555-1212">837-555-1212</div>
      </td>
      <td data-label="Account Owner">
        <div class="nds-truncate" title="Jane Doe">
          <a href="javascript:void(0);" tabindex="-1">Jane Doe</a>
        </div>
      </td>
      <td data-label="Billing City">
        <div class="nds-truncate" title="Los Angeles, CA">Los Angeles, CA</div>
      </td>
      <td class="nds-cell-shrink">
        <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" aria-haspopup="true" tabindex="-1" title="More actions for Allied Technologies">
          <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
          </svg>
          <span class="nds-assistive-text">More actions for Allied Technologies</span>
        </button>
      </td>
    </tr>
    <tr aria-level="5" aria-posinset="1" aria-setsize="1" class="nds-hint-parent">
      <th class="nds-tree__item" data-label="Account Name" scope="row">
        <button class="nds-button nds-button_icon nds-button_icon nds-button_icon-x-small nds-m-right_x-small nds-is-disabled" aria-hidden="true" tabindex="-1" title="Expand Allied Technologies (UV)">
          <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevronright"></use>
          </svg>
          <span class="nds-assistive-text">Collapse Allied Technologies (UV)</span>
        </button>
        <div class="nds-truncate" title="Allied Technologies (UV)">
          <a href="javascript:void(0);" tabindex="-1">Allied Technologies (UV)</a>
        </div>
      </th>
      <td data-label="Employees">
        <div class="nds-truncate" title="270">270</div>
      </td>
      <td data-label="Phone Number">
        <div class="nds-truncate" title="837-555-1212">837-555-1212</div>
      </td>
      <td data-label="Account Owner">
        <div class="nds-truncate" title="John Doe">
          <a href="javascript:void(0);" tabindex="-1">John Doe</a>
        </div>
      </td>
      <td data-label="Billing City">
        <div class="nds-truncate" title="San Francisco, CA">San Francisco, CA</div>
      </td>
      <td class="nds-cell-shrink">
        <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" aria-haspopup="true" tabindex="-1" title="More actions for Allied Technologies (UV)">
          <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
          </svg>
          <span class="nds-assistive-text">More actions for Allied Technologies (UV)</span>
        </button>
      </td>
    </tr>
    <tr aria-expanded="true" aria-level="1" aria-posinset="3" aria-setsize="4" class="nds-hint-parent">
      <th class="nds-tree__item" data-label="Account Name" scope="row">
        <button class="nds-button nds-button_icon nds-button_icon nds-button_icon-x-small nds-m-right_x-small" aria-hidden="true" tabindex="-1" title="Collapse Rohde Enterprises">
          <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevronright"></use>
          </svg>
          <span class="nds-assistive-text">Expand Rohde Enterprises</span>
        </button>
        <div class="nds-truncate" title="Rohde Enterprises">
          <a href="javascript:void(0);" tabindex="-1">Rohde Enterprises</a>
        </div>
      </th>
      <td data-label="Employees">
        <div class="nds-truncate" title="6,000">6,000</div>
      </td>
      <td data-label="Phone Number">
        <div class="nds-truncate" title="837-555-1212">837-555-1212</div>
      </td>
      <td data-label="Account Owner">
        <div class="nds-truncate" title="John Doe">
          <a href="javascript:void(0);" tabindex="-1">John Doe</a>
        </div>
      </td>
      <td data-label="Billing City">
        <div class="nds-truncate" title="New York, NY">New York, NY</div>
      </td>
      <td class="nds-cell-shrink">
        <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" aria-haspopup="true" tabindex="-1" title="More actions for Rohde Enterprises">
          <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
          </svg>
          <span class="nds-assistive-text">More actions for Rohde Enterprises</span>
        </button>
      </td>
    </tr>
    <tr aria-level="2" aria-posinset="1" aria-setsize="1" class="nds-hint-parent">
      <th class="nds-tree__item" data-label="Account Name" scope="row">
        <button class="nds-button nds-button_icon nds-button_icon nds-button_icon-x-small nds-m-right_x-small nds-is-disabled" aria-hidden="true" tabindex="-1" title="Expand Rohde Enterprises (UCA)">
          <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevronright"></use>
          </svg>
          <span class="nds-assistive-text">Collapse Rohde Enterprises (UCA)</span>
        </button>
        <div class="nds-truncate" title="Rohde Enterprises (UCA)">
          <a href="javascript:void(0);" tabindex="-1">Rohde Enterprises (UCA)</a>
        </div>
      </th>
      <td data-label="Employees">
        <div class="nds-truncate" title="2,540">2,540</div>
      </td>
      <td data-label="Phone Number">
        <div class="nds-truncate" title="837-555-1212">837-555-1212</div>
      </td>
      <td data-label="Account Owner">
        <div class="nds-truncate" title="John Doe">
          <a href="javascript:void(0);" tabindex="-1">John Doe</a>
        </div>
      </td>
      <td data-label="Billing City">
        <div class="nds-truncate" title="New York, NY">New York, NY</div>
      </td>
      <td class="nds-cell-shrink">
        <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" aria-haspopup="true" tabindex="-1" title="More actions for Rohde Enterprises (UCA)">
          <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
          </svg>
          <span class="nds-assistive-text">More actions for Rohde Enterprises (UCA)</span>
        </button>
      </td>
    </tr>
    <tr aria-expanded="true" aria-level="1" aria-posinset="4" aria-setsize="4" class="nds-hint-parent">
      <th class="nds-tree__item" data-label="Account Name" scope="row">
        <button class="nds-button nds-button_icon nds-button_icon nds-button_icon-x-small nds-m-right_x-small" aria-hidden="true" tabindex="-1" title="Collapse Tech Labs">
          <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevronright"></use>
          </svg>
          <span class="nds-assistive-text">Expand Tech Labs</span>
        </button>
        <div class="nds-truncate" title="Tech Labs">
          <a href="javascript:void(0);" tabindex="-1">Tech Labs</a>
        </div>
      </th>
      <td data-label="Employees">
        <div class="nds-truncate" title="1,856">1,856</div>
      </td>
      <td data-label="Phone Number">
        <div class="nds-truncate" title="837-555-1212">837-555-1212</div>
      </td>
      <td data-label="Account Owner">
        <div class="nds-truncate" title="John Doe">
          <a href="javascript:void(0);" tabindex="-1">John Doe</a>
        </div>
      </td>
      <td data-label="Billing City">
        <div class="nds-truncate" title="New York, NY">New York, NY</div>
      </td>
      <td class="nds-cell-shrink">
        <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" aria-haspopup="true" tabindex="-1" title="More actions for Tech Labs">
          <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
          </svg>
          <span class="nds-assistive-text">More actions for Tech Labs</span>
        </button>
      </td>
    </tr>
    <tr aria-level="2" aria-posinset="1" aria-setsize="1" class="nds-hint-parent">
      <th class="nds-tree__item" data-label="Account Name" scope="row">
        <button class="nds-button nds-button_icon nds-button_icon nds-button_icon-x-small nds-m-right_x-small nds-is-disabled" aria-hidden="true" tabindex="-1" title="Expand Opportunity Resources Inc">
          <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevronright"></use>
          </svg>
          <span class="nds-assistive-text">Collapse Opportunity Resources Inc</span>
        </button>
        <div class="nds-truncate" title="Opportunity Resources Inc">
          <a href="javascript:void(0);" tabindex="-1">Opportunity Resources Inc</a>
        </div>
      </th>
      <td data-label="Employees">
        <div class="nds-truncate" title="1,934">1,934</div>
      </td>
      <td data-label="Phone Number">
        <div class="nds-truncate" title="837-555-1212">837-555-1212</div>
      </td>
      <td data-label="Account Owner">
        <div class="nds-truncate" title="John Doe">
          <a href="javascript:void(0);" tabindex="-1">John Doe</a>
        </div>
      </td>
      <td data-label="Billing City">
        <div class="nds-truncate" title="Los Angeles, CA">Los Angeles, CA</div>
      </td>
      <td class="nds-cell-shrink">
        <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" aria-haspopup="true" tabindex="-1" title="More actions for Opportunity Resources Inc">
          <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
          </svg>
          <span class="nds-assistive-text">More actions for Opportunity Resources Inc</span>
        </button>
      </td>
    </tr>
  </tbody>
</table>`);
  });
