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
    return withExample(`<div class="nds-canvas">
  <div class="nds-p-around_small">
    <h3 class="nds-is-relative nds-m-bottom--xx-large nds-canvas__title">Title</h3>
    <div class="nds-grid nds-m-bottom_small nds-wrap cards-container">
      <div class="nds-size_1-of-1 nds-m-bottom--large">My Action 1</div>
      <div class="nds-size_1-of-1 nds-m-bottom--large">My Action 2</div>
    </div>
  </div>
</div>`);
  })
  .add('Recent Transactions (states)', () => {
    return withExample(`<div class="nds-canvas">
  <div class="nds-p-around_small">
    <h3 class="nds-is-relative nds-m-bottom--xx-large nds-canvas__title">Title</h3>
    <div>
      <table class="nds-no-row-hover nds-table__custom">
        <thead class="nds-max-small-hide">
          <tr class="nds-text-heading_label">
            <th scope="col">
              <div>Date</div>
            </th>
            <th scope="col">
              <div>Policy Name</div>
            </th>
            <th scope="col">
              <div>Amount</div>
            </th>
            <th scope="col">
              <div>Billing Name</div>
            </th>
            <th scope="col">
              <div>Type</div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr class="nds-border_bottom">
            <td class="nds-truncate" data-label="Date">2019-04-01</td>
            <td class="nds-truncate" data-label="Policy Name">Superior Business - Orrico Latest</td>
            <td class="nds-truncate" data-label="Amount">$0.06</td>
            <td class="nds-truncate" data-label="Billing Name">Premium Paid</td>
            <td class="nds-truncate" data-label="Type">Premium Paid</td>
          </tr>
        </tbody>
        <tbody>
          <tr class="nds-border_bottom">
            <td class="nds-truncate" data-label="Date">2019-03-19</td>
            <td class="nds-truncate" data-label="Policy Name">Superior Business - Orrico Latest</td>
            <td class="nds-truncate" data-label="Amount">$1,200.00</td>
            <td class="nds-truncate" data-label="Billing Name">Renewal Transaction</td>
            <td class="nds-truncate" data-label="Type">Renewal</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>`);
  });
