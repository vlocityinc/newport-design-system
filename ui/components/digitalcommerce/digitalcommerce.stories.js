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
  .add("dcUpdateBillingAddress", () => {
    return withExample(`
      <div class="nds-dc-update-address">
        <div class="nds-step_label nds-dc-step_label">Billing & Shipping</div>
        <fieldset class="nds-form nds-form_compound">
          <div class="nds-form-element__label nds-dc-form_label">Billing Address</div>
          <div class="nds-form-element__control nds-form-element__control-animated-label nds-dc-form-element">
            <input type="text" required="" id="text-input-id-1" class="nds-input nds-has-value">
            <label class="nds-form-element__label" for="text-input-id-1"><abbr class="nds-required" title="required">*</abbr>Address Line</label>
          </div>
          <div class="nds-form-element__control nds-form-element__control-animated-label nds-dc-form-element_row nds-dc-form-element nds-p-left_none">
            <input type="text" required="" id="text-input-id-1" class="nds-input nds-has-value">
            <label class="nds-form-element__label" for="text-input-id-1"><abbr class="nds-required" title="required">*</abbr>City</label>
          </div>
          <div class="nds-form-element__row nds-dc-form-element_row nds-dc-form-element">
            <div class="nds-form-element__control nds-form-element__control-animated-label nds-size_1-of-2">
              <input type="text" required="" id="text-input-id-1" class="nds-input nds-has-value">
              <label class="nds-form-element__label" for="text-input-id-1"><abbr class="nds-required" title="required">*</abbr>State</label>
            </div>
            <div class="nds-form-element__control nds-form-element__control-animated-label nds-size_1-of-2">
              <input type="text" required="" id="text-input-id-1" class="nds-input nds-has-value">
              <label class="nds-form-element__label" for="text-input-id-1"><abbr class="nds-required" title="required">*</abbr>Zip Code</label>
            </div>
          </div>
        </fieldset>
        <hr class="nds-dc-checkout_hr"/>
        <fieldset class="nds-form nds-form_compound">
          <div class="nds-form-element__label nds-dc-form_label">Shipping Address</div>
          <div class="nds-form-element__control">
            <label class="nds-checkbox nds-dc-checkbox">
              <input type="checkbox" name="options" id="checkbox-113" value="on">
              <span class="nds-checkbox_faux"></span>
              <label class="nds-checkbox__label">
                <span class="nds-form-element__label">Same as billing address</span>
              </label>
            </label>
          </div>
          <div class="nds-form-element__control nds-form-element__control-animated-label nds-dc-form-element">
            <input type="text" required="" id="text-input-id-1" class="nds-input nds-has-value">
            <label class="nds-form-element__label" for="text-input-id-1"><abbr class="nds-required" title="required">*</abbr>Address Line</label>
          </div>
          <div class="nds-form-element__control nds-form-element__control-animated-label nds-dc-form-element_row nds-dc-form-element nds-p-left_none">
            <input type="text" required="" id="text-input-id-1" class="nds-input nds-has-value">
            <label class="nds-form-element__label" for="text-input-id-1"><abbr class="nds-required" title="required">*</abbr>City</label>
          </div>
          <div class="nds-form-element__row nds-dc-form-element_row nds-dc-form-element">
            <div class="nds-form-element__control nds-form-element__control-animated-label nds-size_1-of-2">
              <input type="text" required="" id="text-input-id-1" class="nds-input nds-has-value">
              <label class="nds-form-element__label" for="text-input-id-1"><abbr class="nds-required" title="required">*</abbr>State</label>
            </div>
            <div class="nds-form-element__control nds-form-element__control-animated-label nds-size_1-of-2">
              <input type="text" required="" id="text-input-id-1" class="nds-input nds-has-value">
              <label class="nds-form-element__label" for="text-input-id-1"><abbr class="nds-required" title="required">*</abbr>Zip Code</label>
            </div>
          </div>
        </fieldset>
      </div>
    `);
  })
  .add("dcCheckoutReviewOrder", () => {
    return withExample(`
      <div class="nds-dc-review-order_container nds-dc-checkout">
        <div class="nds-step_label nds-dc-step_label">
          Review Order
        </div>
        <div class="nds-dc-checkout_review-order">
          <div class="nds-dc-checkout_details-container">
            <span class="nds-dc-review_title">Contact Information</span>
            <div class="nds-dc-review_details-body">
              <p class="nds-dc-review_name">Jenny Smith</p>
              <p class="nds-dc-review_name">jsmith@salesforce.com</p>
            </div>
          </div>
          <div class="nds-dc-checkout_details-container">
            <span class="nds-dc-review_title">Billing Address</span>
            <div class="nds-dc-review_details-body">
              <p class="nds-dc-review_name">1 Market St, Unit 111</p>
              <p class="nds-dc-review_name">San Fransisco, CA 94105</p>
            </div>
          </div>
          <div class="nds-dc-checkout_details-container">
            <span class="nds-dc-review_title">Payment</span>
            <div class="nds-dc-review_details-body nds-dc-checkout_payment-review">
              <p class="nds-dc-review_name">Jenny Smith</p>
              <p class="nds-dc-review_name">Visa | 1234 5678 9876 5432</p>
              <p class="nds-dc-review_name">03/19</p>
            </div>
          </div>
        </div>
        <div class="nds-dc-terms-conditions">
          <div class="nds-form-element__control">
            <label class="nds-checkbox nds-dc-checkbox">
              <input type="checkbox" name="options" id="checkbox-113" value="on">
              <span class="nds-checkbox_faux"></span>
              <label class="nds-checkbox__label">
                <span class="nds-form-element__label">By checking this box I agree to Vlocity's Terms and Conditions and Privacy Statement.</span>
              </label>
            </label>
          </div>
        </div>
      </div>
    `);
  })
  .add("dcProgressIndicator", () => {
    return withExample(`
      <div class="nds-dc-progress-indicator">
        <div class="nds-size_1-of-1 nds-small-size_1-of-1 nds-medium-size_8-of-12 nds-large-size_6-of-12 nds-align_absolute-center nds-grid nds-m-top_x-large nds-m-bottom_x-large">
          <div class="nds-size_1-of-1">
            <div class="nds-progress">
              <ol class="nds-progress__list">
                <li data-index="0" class="nds-progress__item nds-is-relative nds-is-completed"><button data-index="0" class="nds-button nds-button_icon nds-progress__marker nds-progress__marker_icon">
                  <svg data-index="0" aria-hidden="true" class="nds-button__icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path d="M12 .9C5.9.9.9 5.9.9 12s5 11.1 11.1 11.1 11.1-5 11.1-11.1S18.1.9 12 .9zm6.2 8.3l-7.1 7.2c-.3.3-.7.3-1 0l-3.9-3.9c-.2-.3-.2-.8 0-1.1l1-1c.3-.2.8-.2 1.1 0l2 2.1c.2.2.5.2.7 0l5.2-5.3c.2-.3.7-.3 1 0l1 1c.3.2.3.7 0 1z"></path>
                    </svg>
                  </svg>
                  </button>
                  <div class="nds-is-absolute">
                    <div data-index="1" class="nds-m-top_medium nds-is-relative nds-progress__step-label nds-p-top_xx-small">Personal Info</div>
                  </div>
                </li>
                <li data-index="1" class="nds-progress__item nds-is-active"><button data-index="1" disabled="" class="nds-button nds-progress__marker"><span class="nds-assistive-text">In Progress</span></button>
                  <div class="nds-is-absolute">
                    <div data-index="1" class="nds-m-top_medium nds-is-relative nds-progress__step-label nds-p-top_xx-small">Billing & Shipping</div>
                  </div>
                </li>
                <li class="nds-progress__item"><button data-index="2" disabled="" class="nds-button nds-progress__marker"><span class="nds-assistive-text">Pristine</span></button>
                  <div class="nds-is-absolute">
                    <div data-index="1" class="nds-m-top_medium nds-is-relative nds-progress__step-label nds-p-top_xx-small">Payment</div>
                  </div>
                </li>
                <li class="nds-progress__item"><button data-index="3" disabled="" class="nds-button nds-progress__marker"><span class="nds-assistive-text">Pristine</span></button>
                  <div class="nds-is-absolute">
                    <div data-index="1" class="nds-m-top_medium nds-is-relative nds-progress__step-label nds-p-top_xx-small">Review Order</div>
                  </div>
                </li>
              </ol>
              <div aria-valuemin="0" aria-valuemax="100" aria-valuenow="25" role="progressbar" class="nds-progress-bar nds-progress-bar_x-small"><span class="nds-progress-bar__value" style="width: 33%;"><span class="nds-assistive-text">Progress: 25%</span></span></div>
            </div>
          </div>
        </div>
      </div>
    `);
  })
  .add("dcLogin", () => {
    return withExample(`
      <div class="nds-dc-sign-in">
        <div class="nds-step_label nds-dc-step_label">Personal Info</div>
        <fieldset class="nds-form-element">
          <div class="nds-form-element__control">
            <span class="nds-radio">
              <input type="radio" id="radio-15" name="options" value="on">
              <label class="nds-radio__label" for="radio-15">
                <span class="nds-radio_faux nds-dc-radio_faux"></span>
                <span class="nds-form-element__label">New Customer</span>
              </label>
            </span>
            <span class="nds-radio">
              <input type="radio" id="radio-16" name="options" value="on">
              <label class="nds-radio__label" for="radio-16">
                <span class="nds-radio_faux nds-dc-radio_faux"></span>
                <span class="nds-form-element__label">Existig customer sign in</span>
              </label>
            </span>
          </div>
        </fieldset>
        <fieldset class="nds-form nds-form_compound">
          <div class="nds-form-element__label nds-dc-form_label">Contact Info</div>
          <div class="nds-form-element__row nds-dc-form-element_row nds-dc-form-element">
            <div class="nds-form-element__control nds-form-element__control-animated-label nds-size_1-of-2">
              <input type="text" required id="text-input-id-1" class="nds-input nds-has-value">
              <label class="nds-form-element__label" for="text-input-id-1"><abbr class="nds-required" title="required">*</abbr>First Name</label>
            </div>
            <div class="nds-form-element__control nds-form-element__control-animated-label nds-size_1-of-2">
              <input type="text" required id="text-input-id-1" class="nds-input nds-has-value">
              <label class="nds-form-element__label" for="text-input-id-1"><abbr class="nds-required" title="required">*</abbr>Last Name</label>
            </div>
          </div>
          <div class="nds-form-element__row nds-dc-form-element_row nds-dc-form-element">
            <div class="nds-form-element__control nds-form-element__control-animated-label nds-size_1-of-2">
              <input type="number" required id="text-input-id-1" class="nds-input nds-has-value">
              <label class="nds-form-element__label" for="text-input-id-1"><abbr class="nds-required" title="required">*</abbr>Phone Number</label>
            </div>
            <div class="nds-form-element__control nds-form-element__control-animated-label nds-size_1-of-2">
              <input type="email" required id="text-input-id-1" class="nds-input nds-has-value">
              <label class="nds-form-element__label" for="text-input-id-1"><abbr class="nds-required" title="required">*</abbr>Email Address</label>
            </div>
          </div>
        </fieldset>
      </div>
    `);
  });
