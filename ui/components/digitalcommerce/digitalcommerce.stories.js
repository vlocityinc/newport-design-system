import { storiesOf } from '@storybook/html';
import base from 'paths.macro';
import notes from './doc.md';
import {
  withExample,
  withDocs,
  commentToHTML
} from '../../../scripts/storybook';
storiesOf(`${base}`, module)
  .addDecorator(withDocs(notes))
  .add('dcTotalBar', () => {
    return withExample(`
    <div class="nds-dc-totalbar">
      <div class="nds-dc-totalbar_price-container">
        <div class="nds-dc-totalbar_container">
          <span class="nds-dc-totalbar_label">
            Due Monthly
          </span>
          <div class="nds-dc-totalbar_value">
            $90
          </div>
        </div>
        <span class="nds-dc-totalbar_container nds-dc-totalbar_container-pipe">
        </span>
        <div class="nds-dc-totalbar_container">
          <span class="nds-dc-totalbar_label">
            Due Today
          </span>
          <div class="nds-dc-totalbar_value">
            $1200
          </div>
        </div>
      </div>
      <button class="nds-dc-checkout-button">Checkout</button>
    </div>`);
  });
