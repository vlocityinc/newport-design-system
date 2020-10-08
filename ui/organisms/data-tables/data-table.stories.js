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
    return withExample(`<table class="nds-table nds-table_bordered nds-table_cell-buffer">
  <thead>
    <tr class="nds-text-title_caps">
      <th scope="col">
        <div class="nds-truncate" title="Opportunity Name">Opportunity Name</div>
      </th>
      <th scope="col">
        <div class="nds-truncate" title="Account Name">Account Name</div>
      </th>
      <th scope="col">
        <div class="nds-truncate" title="Close Date">Close Date</div>
      </th>
      <th scope="col">
        <div class="nds-truncate" title="Stage">Stage</div>
      </th>
      <th scope="col">
        <div class="nds-truncate" title="Confidence">Confidence</div>
      </th>
      <th scope="col">
        <div class="nds-truncate" title="Amount">Amount</div>
      </th>
      <th scope="col">
        <div class="nds-truncate" title="Contact">Contact</div>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row" data-label="Opportunity Name">
        <div class="nds-truncate" title="Cloudhub">
          <a href="javascript:void(0);">Cloudhub</a>
        </div>
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
    </tr>
    <tr>
      <th scope="row" data-label="Opportunity Name">
        <div class="nds-truncate" title="Cloudhub + Anypoint Connectors">
          <a href="javascript:void(0);">Cloudhub + Anypoint Connectors</a>
        </div>
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
    </tr>
  </tbody>
</table>`);
  })
  .add('Data Table Striped Rows (states)', () => {
    return withExample(`<table class="nds-table nds-table_bordered nds-table_cell-buffer nds-table_striped">
  <thead>
    <tr class="nds-text-title_caps">
      <th scope="col">
        <div class="nds-truncate" title="Opportunity Name">Opportunity Name</div>
      </th>
      <th scope="col">
        <div class="nds-truncate" title="Account Name">Account Name</div>
      </th>
      <th scope="col">
        <div class="nds-truncate" title="Close Date">Close Date</div>
      </th>
      <th scope="col">
        <div class="nds-truncate" title="Stage">Stage</div>
      </th>
      <th scope="col">
        <div class="nds-truncate" title="Confidence">Confidence</div>
      </th>
      <th scope="col">
        <div class="nds-truncate" title="Amount">Amount</div>
      </th>
      <th scope="col">
        <div class="nds-truncate" title="Contact">Contact</div>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row" data-label="Opportunity Name">
        <div class="nds-truncate" title="Cloudhub">
          <a href="javascript:void(0);">Cloudhub</a>
        </div>
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
    </tr>
    <tr>
      <th scope="row" data-label="Opportunity Name">
        <div class="nds-truncate" title="Cloudhub + Anypoint Connectors">
          <a href="javascript:void(0);">Cloudhub + Anypoint Connectors</a>
        </div>
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
    </tr>
    <tr>
      <th scope="row" data-label="Opportunity Name">
        <div class="nds-truncate" title="Cloudhub">
          <a href="javascript:void(0);">Cloudhub</a>
        </div>
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
    </tr>
  </tbody>
</table>`);
  })
  .add('Data Table No Hover (states)', () => {
    return withExample(`<table class="nds-table nds-table_bordered nds-table_cell-buffer nds-no-row-hover">
  <thead>
    <tr class="nds-text-title_caps">
      <th scope="col">
        <div class="nds-truncate" title="Opportunity Name">Opportunity Name</div>
      </th>
      <th scope="col">
        <div class="nds-truncate" title="Account Name">Account Name</div>
      </th>
      <th scope="col">
        <div class="nds-truncate" title="Close Date">Close Date</div>
      </th>
      <th scope="col">
        <div class="nds-truncate" title="Stage">Stage</div>
      </th>
      <th scope="col">
        <div class="nds-truncate" title="Confidence">Confidence</div>
      </th>
      <th scope="col">
        <div class="nds-truncate" title="Amount">Amount</div>
      </th>
      <th scope="col">
        <div class="nds-truncate" title="Contact">Contact</div>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row" data-label="Opportunity Name">
        <div class="nds-truncate" title="Cloudhub">
          <a href="javascript:void(0);">Cloudhub</a>
        </div>
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
    </tr>
    <tr>
      <th scope="row" data-label="Opportunity Name">
        <div class="nds-truncate" title="Cloudhub + Anypoint Connectors">
          <a href="javascript:void(0);">Cloudhub + Anypoint Connectors</a>
        </div>
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
    </tr>
  </tbody>
</table>`);
  })
  .add('Data Table Vertical Borders (states)', () => {
    return withExample(`<table class="nds-table nds-table_bordered nds-table_cell-buffer nds-table_col-bordered">
  <thead>
    <tr class="nds-text-title_caps">
      <th scope="col">
        <div class="nds-truncate" title="Opportunity Name">Opportunity Name</div>
      </th>
      <th scope="col">
        <div class="nds-truncate" title="Account Name">Account Name</div>
      </th>
      <th scope="col">
        <div class="nds-truncate" title="Close Date">Close Date</div>
      </th>
      <th scope="col">
        <div class="nds-truncate" title="Stage">Stage</div>
      </th>
      <th scope="col">
        <div class="nds-truncate" title="Confidence">Confidence</div>
      </th>
      <th scope="col">
        <div class="nds-truncate" title="Amount">Amount</div>
      </th>
      <th scope="col">
        <div class="nds-truncate" title="Contact">Contact</div>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row" data-label="Opportunity Name">
        <div class="nds-truncate" title="Cloudhub">
          <a href="javascript:void(0);">Cloudhub</a>
        </div>
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
    </tr>
    <tr>
      <th scope="row" data-label="Opportunity Name">
        <div class="nds-truncate" title="Cloudhub + Anypoint Connectors">
          <a href="javascript:void(0);">Cloudhub + Anypoint Connectors</a>
        </div>
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
    </tr>
  </tbody>
</table>`);
  });
