import { storiesOf } from "@storybook/html";
import base from "paths.macro";
import notes from "./doc.md";
import {
  withExample,
  withDocs,
  commentToHTML
} from "../../../scripts/storybook";

storiesOf(`${base}`, module)
  .addDecorator(withDocs(notes))
  .add("dcTotalBar", () => {
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
  .add("dcShoppingCart", () => {
    return withExample(`
    <div class="nds-dc-cart">
      <div class="nds-dc-cart_heading">
        <span class="nds-dc-cart_heading-title">My Cart</span>
        <div class="nds-dc-cart_heading-notifcation">
          <span class="nds-badge nds-badge_brand">1</span>
        </div>
        <button class="nds-button nds-dc-button nds-button_brand">Continue Shopping</button>
      </div>
      <div class="nds-dc-cart_container">
        <div class="nds-dc-cart_offer-board">
          <ul class="nds-dc-cart_offer-item-list">
              <li class="nds-dc-sub-total">
                <div class="nds-dc-cart_offer-item-title">Sub total</div>
                <article class="nds-dc-cart_offer-item">
                  <div class="nds-dc-title-container">
                    <div class="nds-dc-cart_offer-menu">
                        <div class="nds-dc-tile-text nds-dc-title"></div>
                        <div class="nds-dc-tile-text nds-dc-quantity"></div>
                        <div class="nds-dc-tile-text nds-dc-due">Due Today</div>
                        <div class="nds-dc-tile-text nds-dc-due">Due Monthly</div>
                        <div class="nds-dc-tile-text nds-dc-icons"></div>
                    </div>
                    <div class="nds-dc-cart_offer-menu nds-dc-sub-total">
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
      </div>
    </div>`);
  })
  .add("dcShoppingOfferDetails", () => {
    return withExample(`
    <div class="nds-dc-cart-line-item">
      <div class="nds-dc-each-item">
        <div class="nds-dc-cart-item-category">Devices</div>
        <article class="nds-dc-offer-item">
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
              <div class="nds-dc-tile-text nds-dc-quantity">
                <input type="number" min ="1" name="" placeholder="Quantity" value="1">
              </div>
              <div class="nds-dc-tile-text nds-dc-due">$320</div>
              <div class="nds-dc-tile-text nds-dc-due">$19</div>
              <div class="nds-dc-tile-text nds-dc-icons"><span class="nds-dc-tile-trash-title">Remove</span></div>
            </div>
          </div>
        </article>
      </div>
      <div class="nds-dc-each-item nds-dc-line-item">
        <article class="nds-dc-offer-item">
          <div class="nds-dc-title-container">
            <div class="nds-dc-offer-menu nds-dc-offer-details">
              <div class="nds-dc-tile-text nds-dc-title">iPhone X Case</div>
              <div class="nds-dc-tile-text nds-dc-quantity">
                <input type="number" name="" placeholder="Enter Quantity" min ="1" value="1">
                  </div>
              <div class="nds-dc-tile-text nds-dc-due">$69</div>
              <div class="nds-dc-tile-text nds-dc-due">$7</div>
              <div class="nds-dc-tile-text nds-dc-icons"><span class="nds-dc-tile-trash-title">Remove</span></div>
            </div>
          </div>
        </article>
      </div>
    </div>
    `);
  })
  .add("dcAddons", () => {
    return withExample(`
      <div class="nds-dc-offer-addons">
        <div class="nds-align_absolute-center nds-text-heading_large nds-m-top_x-large">
            No Add-ons
        </div>
      </div>
      <button class="nds-align_absolute-center nds-button nds-button_brand nds-m-top_x-large">Add To Cart</button>
    `);
  })
  .add("dcOfferGroupSelection", () => {
    return withExample(`
      <li class="nds-item nds-dc-nav-type selected">
        <article class="nds-dc-tile_board nds-m-top_small">
          <div class="nds-dc-desc-part">
          <span class="nds-radio">
            <input type="radio" id="radio-15" name="options" value="on">
            <label class="nds-radio__label" for="radio-15">
              <span class="nds-radio_faux"></span>
              <span class="nds-form-element__label">Protection Plan</span>
            </label>
          </span>
            <slot name="offerDescriptionSlot">
              <div class="nnds-dc-plan-item-description">Protects your device for Accidental and liquid damage.</div>
              </slot>
          </div>
          <slot name="offerPaymentSlot">
            <div class="nds-grid nds-dc-plan_item-details nds-dc-single_price">
              <div class="nds-col nds-dc-plan_item-price-section">$76
                <p class="nds-dc-payment_type">One-time</p>
              </div>
            </div>
          </slot>
        </article>
      </li>
      <!-- when parent max quantity > 1 -->
      <li class="nds-item nds-dc-nav_type nds-dc-checkbox nds-dc-checked">
                <div class="nds-dc-offer_tag">Special Offer</div>
                <article class="nds-tile_board nds-m-top_small">
                  <div class="nds-dc-desc_part">
                    <div class="nds-dc-accessories"><img src="https://images-na.ssl-images-amazon.com/images/I/81t2wF1AvfL._SL1500_.jpg" alt="Mobile Case"/></div>
                    <label for="iPhoneX">
                      <span class="nds-tile__title nds-truncate nds-dc-plan_name" title="iPhoneX">Symmetry case for iPhoneX</span>
                    </label>
                    <slot name="offerDescriptionSlot"><div class="nds-tile__detail nds-dc-plan_item-description">Let the beautiful lines of your Apple iPhone X shone through the clear construction of this OtterBox Symmetry Series case.</div></slot>
                  </div>
                  <slot name="offerPaymentSlot">
                    <div class="nds-grid nds-dc-plan_item_details nds-dc-single_price-quantity">
                      <div class="nds-dc-quantity">
                        <div class="nds-dc-quantity_label">Quantity</div>
                        <input type="number" class="nds-dc-quantity_input" min="0" name="iPhoneX" placeholder="Quantity" value="1">
                      </div>
                      <div class="nds-col nds-dc-plan_item-price-section nds-dc-checkbox_price">$15
                        <p class="nds-dc-payment_type">One-time</p>
                      </div>
                    </div>
                  </slot>
                </article>
              </li>
    `);
  });
