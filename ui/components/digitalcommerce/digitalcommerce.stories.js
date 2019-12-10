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
          <span class="nds-dc-totalbar_label">Due Monthly</span>
          <div class="nds-dc-totalbar_value">$90</div>
        </div>
        <span class="nds-dc-totalbar_container nds-dc-totalbar_container-pipe"></span>
        <div class="nds-dc-totalbar_container">
          <span class="nds-dc-totalbar_label">Due Today</span>
          <div class="nds-dc-totalbar_value">$1200</div>
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
          <span class="nds-badge nds-badge_brand">2</span>
        </div>
        <button class="nds-button nds-dc-button nds-button_brand">Continue Shopping</button>
      </div>
      <span class="nds-dc-underline_title"></span>
      <div class="nds-dc-offer_attribute">
        <div class="nds-grid nds-wrap nds-dc-cart_container">
          <span class="nds-dc-cart_offer-board">
            <div class="nds-dc-cart_offer-item-list">
              <ul class="nds-has-dividers_around-space nds-dc-offer_item-list-ul">
                <li class="nds-dc-cart_offer-item nds-dc-sub-total">
                  <div class="nds-dc-cart_item-category">Sub total</div>
                  <article class="nds-tile_board nds-dc-offer_item">
                    <div class="nds-dc-title_container">
                      <div class="nds-dc-cart_offer-menu">
                          <div class="nds-dc-tile_text nds-dc-title"></div>
                          <div class="nds-dc-tile_text nds-dc-quantity"></div>
                          <div class="nds-dc-tile_text nds-dc-due">Due Today</div>
                          <div class="nds-dc-tile_text nds-dc-due">Due Monthly</div>
                          <div class="nds-dc-tile_text nds-dc-icons"></div>
                      </div>
                      <div class="nds-dc-cart_offer-menu nds-dc-sub-total">
                          <div class="nds-dc-tile_text nds-dc-title"></div>
                          <div class="nds-dc-tile_text nds-dc-quantity"></div>
                          <div class="nds-dc-tile_text nds-dc-due">$900</div>
                          <div class="nds-dc-tile_text nds-dc-due">$79</div>
                          <div class="nds-dc-tile_text nds-dc-icons"></div>
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
  .add("dcShoppingOfferDetails", () => {
    return withExample(`
    <div class="nds-dc-cart_line-item">
      <div class="nds-dc-each_item">
        <div class="nds-dc-cart_item-category">Devices</div>
        <article class="nds-dc-offer_item">
          <div class="nds-dc-title_container">
            <div class="nds-dc-offer_menu">
              <div class="nds-dc-tile_text nds-dc-title"></div>
              <div class="nds-dc-tile_text nds-dc-quantity">Quantity</div>
              <div class="nds-dc-tile_text nds-dc-due">Due Today</div>
              <div class="nds-dc-tile_text nds-dc-due">Due Monthly</div>
              <div class="nds-dc-tile_text nds-dc-icons"></div>
            </div>
            <div class="nds-dc-offer_menu nds-dc-offer_details">
              <div class="nds-dc-tile_text nds-dc-title">iPhone X</div>
              <div class="nds-dc-tile_text nds-dc-quantity"><input type="number" min ="1" name="" placeholder="Quantity" value="1"></div>
              <div class="nds-dc-tile_text nds-dc-due">$320</div>
              <div class="nds-dc-tile_text nds-dc-due">$19</div>
              <div class="nds-dc-tile_text nds-dc-icons"><span class="nds-dc-tile_trash-title">Remove</span></div>
            </div>
          </div>
        </article>
      </div>
      <div class="nds-dc-each_item nds-dc-line_item">
        <article class="nds-dc-offer_item">
          <div class="nds-dc-title_container">
            <div class="nds-dc-offer_menu nds-dc-offer_details">
              <div class="nds-dc-tile_text nds-dc-title">iPhone X Case</div>
              <div class="nds-dc-tile_text nds-dc-quantity"><input type="number" name="" placeholder="Enter Quantity" min ="1" value="1"></div>
              <div class="nds-dc-tile_text nds-dc-due">$69</div>
              <div class="nds-dc-tile_text nds-dc-due">$7</div>
              <div class="nds-dc-tile_text nds-dc-icons"><span class="nds-dc-tile_trash-title">Remove</span></div>
            </div>
          </div>
        </article>
      </div>
    </div>
    `);
  })
  .add("dcAddons", () => {
    return withExample(`
      <div class="nds-dc-offer_addons">
        <div class="nds-align_absolute-center nds-text-heading_large nds-m-top_x-large">
            No Add-ons
        </div>
      </div>
      <button class="nds-align_absolute-center nds-button nds-button_brand nds-m-top_x-large nds-dc-add_to-cart-btn">Add To Cart</button>
    `);
  })
  .add("dcOfferGroupSelection", () => {
    return withExample(`
      <li class="nds-item nds-dc-nav_type nds-dc-selected">
        <article class="nds-tile_board nds-dc-tile_board nds-m-top_small">
          <div class="nds-dc-desc_part">
            <input class="nds-dc-radiobtn" type="radio" name="radio1" value="123" 
            checked="true"
            id="radio1"/>
            <label for="radio1">
              <span class="nds-tile__title nds-truncate nds-dc-plan_name" title="Radio">Protection Plan</span>
            </label>
            <slot name="offerDescriptionSlot"><div class="nds-tile__detail nds-dc-plan_item-description">Protects your device for Accidental and liquid damage.</div></slot>
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
  })
  .add("dcFilter", () => {
    return withExample(`
      <div class="nds-dc-filter">
        <button class="nds-button nds-button_brand nds-dc-filter_btn">
          <span class="nds-button__icon nds-button__icon_left">
            <svg enable-background="new 0 0 36 30" height="30px" id="Layer_1" version="1.1" viewBox="0 0 36 30" width="36px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><polygon fill="#FFFF" points="14,30 22,25 22,17 35.999,0 17.988,0 0,0 14,17 "></polygon></svg>
          </span>
          Refine
        </button>
        <div class="nds-dc-filter-dropdown_show">
          <div class="nds-dc-filter-section_container">
              <div class="nds-dc-filter-group">
                <div class="nds-dc-filter-section">Promotion</div>

                <label class="nds-checkbox">
                  <input type="checkbox" name="options" id="checkbox-1" value="on">
                  <span class="nds-checkbox_faux"></span>
                  <label class="nds-checkbox__label">
                    <span class="nds-form-element__label">Promotion only</span>
                  </label>
                </label>

              </div>
          </div>
        </div>
        <div class="nds-dc-filter-criteria_container">
          <span class="nds-dc-filter-criteria">
            Promotion only
          </span>
          <span class="nds-dc-filter-remove">✕</span>
        </div>
      </div>
    `);
  })
  .add("dcPromotionList", () => {
    return withExample(`
    <div class="nds-dc-promotion_list-component">
      <div class="nds-dc-promotion_list-heading">Available Promotion</div>

      <div id="promoList" class="nds-dc-promotion_list">
        <div class="nds-grid nds-wrap">
          <div class="nds-p-horizontal_small nds-size_1-of-2 nds-medium-size_4-of-6 nds-large-size_10-of-12">
            <input type="checkbox" name="iPhone11ProOffer" id="iPhone11ProOffer">
            <label class="nds-dc-promotion_list-container">
              <div class="nds-dc-promotion_list-title">iPhone11ProOffer</div>
              <div class="nds-dc-promotion_list-description">Pro Triple Cameras.  6.5 inch Super Retina XDR display. Fastest processor ever A13 chip.</div>
            </label>
          </div>
          <div class="nds-p-horizontal_small nds-size_1-of-2 nds-medium-size_2-of-6 nds-large-size_2-of-12 nds-dc-align_center">
            <label class="nds-dc-promotion_list-apply nds-button nds-button_neutral" name="iPhone11ProOffer" for="iPhone11ProOffer">
              Apply Promo
            </label>
          </div>
        </div>
      </div>
      <div id="promoList" class="nds-dc-promotion_list">
        <div class="nds-grid nds-wrap">
          <div class="nds-p-horizontal_small nds-size_1-of-2 nds-medium-size_4-of-6 nds-large-size_10-of-12">
            <input type="checkbox" name="5percentOffer" id="5percentOffer">
            <label class="nds-dc-promotion_list-container">
              <div class="nds-dc-promotion_list-title">5percentOffer</div>
              <div class="nds-dc-promotion_list-description">Pro Triple Cameras.  6.5 inch Super Retina XDR display. Fastest processor ever A13 chip.</div>
            </label>
          </div>
          <div class="nds-p-horizontal_small nds-size_1-of-2 nds-medium-size_2-of-6 nds-large-size_2-of-12 nds-dc-align_center">
            <label class="nds-dc-promotion_list-apply nds-button nds-button_neutral" name="5percentOffer" for="5percentOffer">
              Apply Promo
            </label>
          </div>
        </div>
      </div>
      <div id="promoList" class="nds-dc-promotion_list">
        <div class="nds-grid nds-wrap">
          <div class="nds-p-horizontal_small nds-size_1-of-2 nds-medium-size_4-of-6 nds-large-size_10-of-12">
            <input type="checkbox" name="10percentOffer" id="10percentOffer">
            <label class="nds-dc-promotion_list-container">
              <div class="nds-dc-promotion_list-title">10percentOffer</div>
              <div class="nds-dc-promotion_list-description">Pro Triple Cameras.  6.5 inch Super Retina XDR display. Fastest processor ever A13 chip.</div>
            </label>
          </div>
          <div class="nds-p-horizontal_small nds-size_1-of-2 nds-medium-size_2-of-6 nds-large-size_2-of-12 nds-dc-align_center">
            <label class="nds-dc-promotion_list-apply nds-button nds-button_neutral" name="10percentOffer" for="10percentOffer">
              Apply Promo
            </label>
          </div>
        </div>
      </div>
    </div>
    `);
  })
  .add("dcAppliedPromotionList", () => {
    return withExample(`
      <article class="nds-dc-applied-promo-container">
        <div class="nds-dc-applied-promo">
          <div class="nds-dc-applied-promo-label">10percentOffer</div>
          <div class="nds-dc-adjustment-value-one-time">
            <span class="">
              -100$
            </span>
          </div>
          <div class="nds-dc-adjustment-value-recurring"></div>

          <div class="nds-dc-delete-icon">
            <svg class="nds-dc-tile_trash" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" fill="rgb(28, 102, 188);" viewBox="0 0 900.5 900.5" style="enable-background:new 0 0 900.5 900.5; height: .8rem" xml:space="preserve">
              <g>
                <path d="M176.415,880.5c0,11.046,8.954,20,20,20h507.67c11.046,0,20-8.954,20-20V232.487h-547.67V880.5L176.415,880.5z
              M562.75,342.766h75v436.029h-75V342.766z M412.75,342.766h75v436.029h-75V342.766z M262.75,342.766h75v436.029h-75V342.766z"></path>
                <path d="M618.825,91.911V20c0-11.046-8.954-20-20-20h-297.15c-11.046,0-20,8.954-20,20v71.911v12.5v12.5H141.874
              c-11.046,0-20,8.954-20,20v50.576c0,11.045,8.954,20,20,20h34.541h547.67h34.541c11.046,0,20-8.955,20-20v-50.576
              c0-11.046-8.954-20-20-20H618.825v-12.5V91.911z M543.825,112.799h-187.15v-8.389v-12.5V75h187.15v16.911v12.5V112.799z"></path>
              </g>
            </svg>
            <span class="nds-dc-tile_trash-title nds-dc-trash-title">Remove</span>
          </div>
          <div class="nds-dc-edit-column"></div>
        </div>
        <div class="nds-dc-offer-group-separator nestedChild"></div>
      </article>
    `);
  });;
