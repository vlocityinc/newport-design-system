import { storiesOf } from '@storybook/html';
import base from 'paths.macro';
import notes from '../doc.md';
import additionalNotes from './index.markup.md';
import scss from './_index.scss';
import {
  withExample,
  withDocs,
  commentToHTML
} from '../../../../scripts/storybook';

storiesOf(`${base}`, module)
  .addDecorator(withDocs(notes + additionalNotes))
  .addDecorator(commentToHTML(scss))
  .add('Default (default)', () => {
    return withExample(`<table class="nds-table nds-table_bordered nds-max-medium-table_stacked-horizontal">
  <thead>
    <tr class="nds-text-title_caps">
      <th class="nds-cell-shrink" scope="col">
        <label class="nds-checkbox">
          <input type="checkbox" name="options" value="on">
          <span class="nds-checkbox_faux"></span>
          <span class="nds-assistive-text">Select All</span>
        </label>
      </th>
      <th scope="col">
        <div class="nds-truncate" title="Close Date">
          <!-- react-text: 12 -->Opportunity Name
          <!-- /react-text -->
          <button class="nds-button nds-button_icon nds-button_icon" title="Sort">
            <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
            <span class="nds-assistive-text">Sort</span>
          </button>
        </div>
      </th>
      <th scope="col">
        <div class="nds-truncate" title="Account Name">
          <!-- react-text: 19 -->Account Name
          <!-- /react-text -->
          <button class="nds-button nds-button_icon nds-button_icon" title="Sort">
            <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
            <span class="nds-assistive-text">Sort</span>
          </button>
        </div>
      </th>
      <th scope="col">
        <div class="nds-truncate" title="Close Date">
          <!-- react-text: 26 -->Close Date
          <!-- /react-text -->
          <button class="nds-button nds-button_icon nds-button_icon" title="Sort">
            <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
            <span class="nds-assistive-text">Sort</span>
          </button>
        </div>
      </th>
      <th scope="col">
        <div class="nds-truncate" title="Stage">
          <!-- react-text: 33 -->Stage
          <!-- /react-text -->
          <button class="nds-button nds-button_icon nds-button_icon" title="Sort">
            <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
            <span class="nds-assistive-text">Sort</span>
          </button>
        </div>
      </th>
      <th scope="col">
        <div class="nds-truncate" title="Confidence">
          <!-- react-text: 40 -->Confidence
          <!-- /react-text -->
          <button class="nds-button nds-button_icon nds-button_icon" title="Sort">
            <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
            <span class="nds-assistive-text">Sort</span>
          </button>
        </div>
      </th>
      <th scope="col">
        <div class="nds-truncate" title="Amount">
          <!-- react-text: 47 -->Amount
          <!-- /react-text -->
          <button class="nds-button nds-button_icon nds-button_icon" title="Sort">
            <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
            <span class="nds-assistive-text">Sort</span>
          </button>
        </div>
      </th>
      <th scope="col">
        <div class="nds-truncate" title="Contact">
          <!-- react-text: 54 -->Contact
          <!-- /react-text -->
          <button class="nds-button nds-button_icon nds-button_icon" title="Sort">
            <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
            <span class="nds-assistive-text">Sort</span>
          </button>
        </div>
      </th>
      <th class="nds-cell-shrink" scope="col"></th>
    </tr>
  </thead>
  <tbody>
    <tr class="nds-hint-parent">
      <td class="nds-cell-shrink" data-label="Select Row">
        <label class="nds-checkbox">
          <input type="checkbox" name="options" value="on">
          <span class="nds-checkbox_faux"></span>
          <span class="nds-assistive-text">Select Row</span>
        </label>
      </td>
      <th scope="row" data-label="Opportunity Name">
        <div class="nds-truncate" title="Cloudhub">Cloudhub</div>
      </th>
      <td data-label="Account Name">
        <div class="nds-truncate" title="Cloudhub">Cloudhub</div>
      </td>
      <td data-label="Close Date">
        <div class="nds-truncate" title="4/14/2015">4/14/2015</div>
      </td>
      <td data-label="Prospecting">
        <div class="nds-truncate" title="Prospecting">Prospecting</div>
      </td>
      <td data-label="Confidence">
        <div class="nds-truncate" title="20%">20%</div>
      </td>
      <td data-label="Amount">
        <div class="nds-truncate" title="$25k">$25k</div>
      </td>
      <td data-label="Contact">
        <div class="nds-truncate" title="jrogers@cloudhub.com">
          <a href="javascript:void(0);">jrogers@cloudhub.com</a>
        </div>
      </td>
      <td class="nds-cell-shrink" data-label="Actions">
        <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" title="Show More">
          <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
          </svg>
          <span class="nds-assistive-text">Show More</span>
        </button>
      </td>
    </tr>
    <tr class="nds-hint-parent">
      <td class="nds-cell-shrink" data-label="Select Row">
        <label class="nds-checkbox">
          <input type="checkbox" name="options" value="on">
          <span class="nds-checkbox_faux"></span>
          <span class="nds-assistive-text">Select Row</span>
        </label>
      </td>
      <th scope="row" data-label="Opportunity Name">
        <div class="nds-truncate" title="Cloudhub + Anypoint Connectors">Cloudhub + Anypoint Connectors</div>
      </th>
      <td data-label="Account Name">
        <div class="nds-truncate" title="Cloudhub">Cloudhub</div>
      </td>
      <td data-label="Close Date">
        <div class="nds-truncate" title="4/14/2015">4/14/2015</div>
      </td>
      <td data-label="Prospecting">
        <div class="nds-truncate" title="Prospecting">Prospecting</div>
      </td>
      <td data-label="Confidence">
        <div class="nds-truncate" title="20%">20%</div>
      </td>
      <td data-label="Amount">
        <div class="nds-truncate" title="$25k">$25k</div>
      </td>
      <td data-label="Contact">
        <div class="nds-truncate" title="jrogers@cloudhub.com">
          <a href="javascript:void(0);">jrogers@cloudhub.com</a>
        </div>
      </td>
      <td class="nds-cell-shrink" data-label="Actions">
        <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" title="Show More">
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
  .add('Data Table Responsive Horizontal (states)', () => {
    return withExample(`<table class="nds-table nds-table_bordered nds-max-medium-table_stacked-horizontal">
  <thead>
    <tr class="nds-text-title_caps">
      <th class="nds-cell-shrink" scope="col">
        <label class="nds-checkbox">
          <input type="checkbox" name="options" value="on">
          <span class="nds-checkbox_faux"></span>
          <span class="nds-assistive-text">Select All</span>
        </label>
      </th>
      <th scope="col">
        <div class="nds-truncate" title="Close Date">
          <!-- react-text: 12 -->Opportunity Name
          <!-- /react-text -->
          <button class="nds-button nds-button_icon nds-button_icon" title="Sort">
            <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
            <span class="nds-assistive-text">Sort</span>
          </button>
        </div>
      </th>
      <th scope="col">
        <div class="nds-truncate" title="Account Name">
          <!-- react-text: 19 -->Account Name
          <!-- /react-text -->
          <button class="nds-button nds-button_icon nds-button_icon" title="Sort">
            <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
            <span class="nds-assistive-text">Sort</span>
          </button>
        </div>
      </th>
      <th scope="col">
        <div class="nds-truncate" title="Close Date">
          <!-- react-text: 26 -->Close Date
          <!-- /react-text -->
          <button class="nds-button nds-button_icon nds-button_icon" title="Sort">
            <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
            <span class="nds-assistive-text">Sort</span>
          </button>
        </div>
      </th>
      <th scope="col">
        <div class="nds-truncate" title="Stage">
          <!-- react-text: 33 -->Stage
          <!-- /react-text -->
          <button class="nds-button nds-button_icon nds-button_icon" title="Sort">
            <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
            <span class="nds-assistive-text">Sort</span>
          </button>
        </div>
      </th>
      <th scope="col">
        <div class="nds-truncate" title="Confidence">
          <!-- react-text: 40 -->Confidence
          <!-- /react-text -->
          <button class="nds-button nds-button_icon nds-button_icon" title="Sort">
            <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
            <span class="nds-assistive-text">Sort</span>
          </button>
        </div>
      </th>
      <th scope="col">
        <div class="nds-truncate" title="Amount">
          <!-- react-text: 47 -->Amount
          <!-- /react-text -->
          <button class="nds-button nds-button_icon nds-button_icon" title="Sort">
            <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
            <span class="nds-assistive-text">Sort</span>
          </button>
        </div>
      </th>
      <th scope="col">
        <div class="nds-truncate" title="Contact">
          <!-- react-text: 54 -->Contact
          <!-- /react-text -->
          <button class="nds-button nds-button_icon nds-button_icon" title="Sort">
            <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
            <span class="nds-assistive-text">Sort</span>
          </button>
        </div>
      </th>
      <th class="nds-cell-shrink" scope="col"></th>
    </tr>
  </thead>
  <tbody>
    <tr class="nds-hint-parent">
      <td class="nds-cell-shrink" data-label="Select Row">
        <label class="nds-checkbox">
          <input type="checkbox" name="options" value="on">
          <span class="nds-checkbox_faux"></span>
          <span class="nds-assistive-text">Select Row</span>
        </label>
      </td>
      <th scope="row" data-label="Opportunity Name">
        <div class="nds-truncate" title="Cloudhub">Cloudhub</div>
      </th>
      <td data-label="Account Name">
        <div class="nds-truncate" title="Cloudhub">Cloudhub</div>
      </td>
      <td data-label="Close Date">
        <div class="nds-truncate" title="4/14/2015">4/14/2015</div>
      </td>
      <td data-label="Prospecting">
        <div class="nds-truncate" title="Prospecting">Prospecting</div>
      </td>
      <td data-label="Confidence">
        <div class="nds-truncate" title="20%">20%</div>
      </td>
      <td data-label="Amount">
        <div class="nds-truncate" title="$25k">$25k</div>
      </td>
      <td data-label="Contact">
        <div class="nds-truncate" title="jrogers@cloudhub.com">
          <a href="javascript:void(0);">jrogers@cloudhub.com</a>
        </div>
      </td>
      <td class="nds-cell-shrink" data-label="Actions">
        <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" title="Show More">
          <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
          </svg>
          <span class="nds-assistive-text">Show More</span>
        </button>
      </td>
    </tr>
    <tr class="nds-hint-parent">
      <td class="nds-cell-shrink" data-label="Select Row">
        <label class="nds-checkbox">
          <input type="checkbox" name="options" value="on">
          <span class="nds-checkbox_faux"></span>
          <span class="nds-assistive-text">Select Row</span>
        </label>
      </td>
      <th scope="row" data-label="Opportunity Name">
        <div class="nds-truncate" title="Cloudhub + Anypoint Connectors">Cloudhub + Anypoint Connectors</div>
      </th>
      <td data-label="Account Name">
        <div class="nds-truncate" title="Cloudhub">Cloudhub</div>
      </td>
      <td data-label="Close Date">
        <div class="nds-truncate" title="4/14/2015">4/14/2015</div>
      </td>
      <td data-label="Prospecting">
        <div class="nds-truncate" title="Prospecting">Prospecting</div>
      </td>
      <td data-label="Confidence">
        <div class="nds-truncate" title="20%">20%</div>
      </td>
      <td data-label="Amount">
        <div class="nds-truncate" title="$25k">$25k</div>
      </td>
      <td data-label="Contact">
        <div class="nds-truncate" title="jrogers@cloudhub.com">
          <a href="javascript:void(0);">jrogers@cloudhub.com</a>
        </div>
      </td>
      <td class="nds-cell-shrink" data-label="Actions">
        <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" title="Show More">
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
  .add('Data Table Responsive Stacked (states)', () => {
    return withExample(`<table class="nds-table nds-table_bordered nds-max-medium-table_stacked">
  <thead>
    <tr class="nds-text-title_caps">
      <th class="nds-cell-shrink" scope="col">
        <label class="nds-checkbox">
          <input type="checkbox" name="options" value="on">
          <span class="nds-checkbox_faux"></span>
          <span class="nds-assistive-text">Select All</span>
        </label>
      </th>
      <th scope="col">
        <div class="nds-truncate" title="Close Date">
          <!-- react-text: 12 -->Opportunity Name
          <!-- /react-text -->
          <button class="nds-button nds-button_icon nds-button_icon" title="Sort">
            <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
            <span class="nds-assistive-text">Sort</span>
          </button>
        </div>
      </th>
      <th scope="col">
        <div class="nds-truncate" title="Account Name">
          <!-- react-text: 19 -->Account Name
          <!-- /react-text -->
          <button class="nds-button nds-button_icon nds-button_icon" title="Sort">
            <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
            <span class="nds-assistive-text">Sort</span>
          </button>
        </div>
      </th>
      <th scope="col">
        <div class="nds-truncate" title="Close Date">
          <!-- react-text: 26 -->Close Date
          <!-- /react-text -->
          <button class="nds-button nds-button_icon nds-button_icon" title="Sort">
            <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
            <span class="nds-assistive-text">Sort</span>
          </button>
        </div>
      </th>
      <th scope="col">
        <div class="nds-truncate" title="Stage">
          <!-- react-text: 33 -->Stage
          <!-- /react-text -->
          <button class="nds-button nds-button_icon nds-button_icon" title="Sort">
            <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
            <span class="nds-assistive-text">Sort</span>
          </button>
        </div>
      </th>
      <th scope="col">
        <div class="nds-truncate" title="Confidence">
          <!-- react-text: 40 -->Confidence
          <!-- /react-text -->
          <button class="nds-button nds-button_icon nds-button_icon" title="Sort">
            <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
            <span class="nds-assistive-text">Sort</span>
          </button>
        </div>
      </th>
      <th scope="col">
        <div class="nds-truncate" title="Amount">
          <!-- react-text: 47 -->Amount
          <!-- /react-text -->
          <button class="nds-button nds-button_icon nds-button_icon" title="Sort">
            <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
            <span class="nds-assistive-text">Sort</span>
          </button>
        </div>
      </th>
      <th scope="col">
        <div class="nds-truncate" title="Contact">
          <!-- react-text: 54 -->Contact
          <!-- /react-text -->
          <button class="nds-button nds-button_icon nds-button_icon" title="Sort">
            <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#arrowdown"></use>
            </svg>
            <span class="nds-assistive-text">Sort</span>
          </button>
        </div>
      </th>
      <th class="nds-cell-shrink" scope="col"></th>
    </tr>
  </thead>
  <tbody>
    <tr class="nds-hint-parent">
      <td class="nds-cell-shrink" data-label="Select Row">
        <label class="nds-checkbox">
          <input type="checkbox" name="options" value="on">
          <span class="nds-checkbox_faux"></span>
          <span class="nds-assistive-text">Select Row</span>
        </label>
      </td>
      <th scope="row" data-label="Opportunity Name">
        <div class="nds-truncate" title="Cloudhub">Cloudhub</div>
      </th>
      <td data-label="Account Name">
        <div class="nds-truncate" title="Cloudhub">Cloudhub</div>
      </td>
      <td data-label="Close Date">
        <div class="nds-truncate" title="4/14/2015">4/14/2015</div>
      </td>
      <td data-label="Prospecting">
        <div class="nds-truncate" title="Prospecting">Prospecting</div>
      </td>
      <td data-label="Confidence">
        <div class="nds-truncate" title="20%">20%</div>
      </td>
      <td data-label="Amount">
        <div class="nds-truncate" title="$25k">$25k</div>
      </td>
      <td data-label="Contact">
        <div class="nds-truncate" title="jrogers@cloudhub.com">
          <a href="javascript:void(0);">jrogers@cloudhub.com</a>
        </div>
      </td>
      <td class="nds-cell-shrink" data-label="Actions">
        <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" title="Show More">
          <svg class="nds-button__icon nds-button__icon_hint nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
          </svg>
          <span class="nds-assistive-text">Show More</span>
        </button>
      </td>
    </tr>
    <tr class="nds-hint-parent">
      <td class="nds-cell-shrink" data-label="Select Row">
        <label class="nds-checkbox">
          <input type="checkbox" name="options" value="on">
          <span class="nds-checkbox_faux"></span>
          <span class="nds-assistive-text">Select Row</span>
        </label>
      </td>
      <th scope="row" data-label="Opportunity Name">
        <div class="nds-truncate" title="Cloudhub + Anypoint Connectors">Cloudhub + Anypoint Connectors</div>
      </th>
      <td data-label="Account Name">
        <div class="nds-truncate" title="Cloudhub">Cloudhub</div>
      </td>
      <td data-label="Close Date">
        <div class="nds-truncate" title="4/14/2015">4/14/2015</div>
      </td>
      <td data-label="Prospecting">
        <div class="nds-truncate" title="Prospecting">Prospecting</div>
      </td>
      <td data-label="Confidence">
        <div class="nds-truncate" title="20%">20%</div>
      </td>
      <td data-label="Amount">
        <div class="nds-truncate" title="$25k">$25k</div>
      </td>
      <td data-label="Contact">
        <div class="nds-truncate" title="jrogers@cloudhub.com">
          <a href="javascript:void(0);">jrogers@cloudhub.com</a>
        </div>
      </td>
      <td class="nds-cell-shrink" data-label="Actions">
        <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" title="Show More">
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
