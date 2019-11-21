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
  })
  .add('dcShoppingCart', () => {
    return withExample(`
    <div class="nds-dc-cart">
      <div class="nds-text-heading_large">
        <span class="nds-dc-cart-header-title">My Cart</span>
        <span class="nds-dc-total-items-circle">1</span>
        <div class="nds-float_right nds-text-align_right">
          <button class="nds-button nds-dc-button nds-button_brand nds-text-body_regular nds-p-vertical_xx-small nds-p-horizontal_x-small">Continue Shopping</button>
        </div> 
      </div>
      <span class="nds-dc-underline-title"></span>
      <!-- <div class="nds-dc-spinner nds-spinner_container">
        <lightning-spinner alternative-text={translatedLabelsObj.DCLoading} size="large" variant="brand"></lightning-spinner>
      </div> -->
      <div class="nds-dc-offer-attribute">
        <div class="nds-grid nds-wrap ng-scope nds-dc-cart-container">
          <span class="nds-size--1-of-1 nds-dc-cart-offer-board">
            <div class="nds-dc-offer-item-list">
              <ul class="nds-has-dividers_around-space nds-dc-offer-item-list-ul">
                <!-- sub total -->
                <li class="nds-dc-cart-item-li nds-dc-sub-total">
                  <div class="nds-dc-cart-item-category">Sub total</div>
                  <article class="nds-tile nds-tile_board nds-dc-offer-item">
                    <div class="nds-dc-title-container">
                      <div class="nds-dc-offer-menu">
                          <div class="nds-dc-tile-text nds-dc-title"></div>
                          <div class="nds-dc-tile-text nds-dc-quantity"></div>
                          <div class="nds-dc-tile-text nds-dc-due">Due Today</div>
                          <div class="nds-dc-tile-text nds-dc-due">Due Monthly</div>
                          <div class="nds-dc-tile-text nds-dc-icons"></div>
                      </div>
                      <div class="nds-dc-offer-menu nds-dc-sub-total">
                          <div class="nds-dc-tile-text nds-dc-title"></div>
                          <div class="nds-dc-tile-text nds-dc-quantity"></div>
                          <div class="nds-dc-tile-text nds-dc-due">$900</div>
                          <div class="nds-dc-tile-text nds-dc-due">$79</div>
                          <div class="nds-dc-tile-text nds-dc-icons"></div>
                      </div>
                    </div>
                  </article>
                </li>
              </ul>
            </div>
          </span>
        </div>
      </div>
    </div>`);
  })
  .add('dcShoppingOfferDetails', () => {
    return withExample(`
    <div class="nds-dc-cart-line-item">
      <div class="nds-dc-each-item">
        <div class="nds-dc-cart-item-category">Devices</div>
        <article class="nds-tile nds-tile_board nds-dc-offer-item">
          <div class="nds-dc-title-container">
            <div class="nds-dc-offer-menu">
              <div class="nds-dc-tile-text nds-dc-title"></div>
              <div class="nds-dc-tile-text nds-dc-quantity">Quantity</div>
              <div class="nds-dc-tile-text nds-dc-due">Due Today</div>
              <div class="nds-dc-tile-text nds-dc-due">Due Monthly</div>
              <div class="nds-dc-tile-text nds-dc-icons"></div>
            </div>
            <div class="nds-dc-offer-menu nds-dc-offer-details">
              <div class="nds-dc-tile-text nds-dc-title">iPhone X</div>
              <div class="nds-dc-tile-text nds-dc-quantity"><input type="number" min ="1" name="" placeholder="Quantity" value="1"></div>
              <div class="nds-dc-tile-text nds-dc-due">$320</div>
              <div class="nds-dc-tile-text nds-dc-due">$19</div>
              <div class="nds-dc-tile-text nds-dc-icons"><span class="nds-dc-tile-trash-title">Remove</span></div>
            </div>
          </div>
        </article>
      </div>
      <div if:true={offerOnly} class="nds-dc-each-item nds-dc-line-item">
        <article class="slds-tile slds-tile_board nds-dc-offer-item">
          <div class="nds-dc-title-container">
            <div class="nds-dc-offer-menu nds-dc-offer-details">
              <div class="nds-dc-tile-text nds-dc-title">iPhone X Case</div>
              <div class="nds-dc-tile-text nds-dc-quantity"><input type="number" name="" placeholder="Enter Quantity" min ="1" value="1"></div>
              <div class="nds-dc-tile-text nds-dc-due">$69</div>
              <div class="nds-dc-tile-text nds-dc-due">$7</div>
              <div class="nds-dc-tile-text nds-dc-icons"><span class="nds-dc-tile-trash-title">Remove</span></div>
            </div>
          </div>
        </article>
      </div>
    </div>
    `);
  });
