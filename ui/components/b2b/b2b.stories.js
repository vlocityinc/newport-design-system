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
  .add("b2bCategoriesList", () => {
    return withExample(`
    <div class="nds-b2b-categories-list">
      <nav class="nds-b2b-categories-list_nav" role="navigation">
        <ul class="nds-b2b-categories-list_nav-list">
          <c-b2b-category-item>
            <li>
              <input id="group-1" type="checkbox" hidden />
              <label for="group-1" class="nds-b2b-category-name nds-b2b-category-name_label">
                <c-icon theme="nds" icon-name="utility:rows" size="small" extraclass="nds-icon-text-default" class="nds-b2b-category-icon">
                  <span class="nds-icon_container nds-icon-utility-phone_portrait">
                    <svg class="nds-icon nds-icon-text-default nds-icon_x-small" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#phone_portrait"></use>
                    </svg>
                  </span>
                </c-icon>
                Ethernet
                <span class="nds-b2b-switch-icon">
                  <svg class="nds-accordion__summary-action-icon nds-button__icon nds-button__icon_left" aria-hidden="true">
                    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#switch"></use>
                  </svg>
                </span>
              </label>
              <ul class="nds-b2b-category_group-list">
                <li class="nds-b2b-category-name">E-LAN</li>
                <li class="nds-b2b-category-name">Cloud</li>
                <li class="nds-b2b-category-name">Point to Point</li>
                <c-b2b-category-item>
                  <li>
                    <input id="sub-group-1" type="checkbox" hidden />
                    <label for="sub-group-1" class="nds-b2b-category-name"> Sub Child Categories 
                      <span class="nds-b2b-switch-icon">
                        <svg class="nds-accordion__summary-action-icon nds-button__icon nds-button__icon_left" aria-hidden="true">
                          <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#switch"></use>
                        </svg>
                      </span> 
                    </label>
                    <ul class="nds-b2b-category_group-list">
                      <li class="nds-b2b-category-name">one</li>
                      <li class="nds-b2b-category-name">two</li>
                      <li class="nds-b2b-category-name">three</li>
                    </ul>
                  </li>
                </c-b2b-category-item>
              </ul>
            </li>
            <li>
              <input id="group-2" type="checkbox" hidden />
              <label for="group-2" class="nds-b2b-category-name nds-b2b-category-name_label">
                <c-icon theme="nds" icon-name="utility:rows" size="small" extraclass="nds-icon-text-default" class="nds-b2b-category-icon">
                  <span class="nds-icon_container nds-icon-utility-phone_portrait">
                    <svg class="nds-icon nds-icon-text-default nds-icon_x-small" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#phone_portrait"></use>
                    </svg>
                  </span>
                </c-icon>
                Accessories
                <span class="nds-b2b-switch-icon">
                  <svg class="nds-accordion__summary-action-icon nds-button__icon nds-button__icon_left" aria-hidden="true">
                    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#switch"></use>
                  </svg>
                </span>
              </label>
              <ul class="nds-b2b-category_group-list">
                <li class="nds-b2b-category-name">E-LAN</li>
                <li class="nds-b2b-category-name">Cloud</li>
                <li class="nds-b2b-category-name">Point to Point</li>
              </ul>
            </li>
            <li>
              <input id="group-3" type="checkbox" hidden />
              <label for="group-3" class="nds-b2b-category-name nds-b2b-category-name_label">
                <c-icon theme="nds" icon-name="utility:rows" size="small" extraclass="nds-icon-text-default" class="nds-b2b-category-icon">
                  <span class="nds-icon_container nds-icon-utility-phone_portrait">
                    <svg class="nds-icon nds-icon-text-default nds-icon_x-small" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#phone_portrait"></use>
                    </svg>
                  </span>
                </c-icon>
                Plans & Services
                <span class="nds-b2b-switch-icon">
                  <svg class="nds-accordion__summary-action-icon nds-button__icon nds-button__icon_left" aria-hidden="true">
                    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#switch"></use>
                  </svg>
                </span>
              </label>
              <ul class="nds-b2b-category_group-list">
                <li class="nds-b2b-category-name">E-LAN</li>
                <li class="nds-b2b-category-name">Cloud</li>
                <li class="nds-b2b-category-name">Point to Point</li>
              </ul>
            </li>
          </c-b2b-category-item>
        </ul>
      </nav>
    </div>`);
  })
  .add("b2bPromoItem", () => {
    return withExample(`
    <div class="nds-b2b-promo-item">
      <div class="nds-b2b-promo-name">
        <c-icon theme="nds" icon-name="utility:rows" size="small" extraclass="nds-icon-text-default" class="nds-b2b-promo-icon">
          <span class="nds-icon_container nds-icon-utility-wifi">
            <svg class="nds-icon nds-icon-text-default nds-icon_x-small" xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 52 52">
              <path fill="#1589ee" d="m47.7 15.8c-5.5-6.1-13.3-9.5-21.6-9.5s-16.1 3.4-21.6 9.5c-0.4 0.4-0.3 1.1 0.1 1.4l3 2.6c0.4 0.4 1 0.3 1.4-0.1 4.4-4.7 10.6-7.4 17.1-7.4s12.7 2.7 17.1 7.4c0.4 0.4 1 0.4 1.4 0.1l3-2.6c0.4-0.4 0.5-1 0.1-1.4z m-21.6 4.5c-4.2 0-8.2 1.8-11 5-0.4 0.4-0.3 1.1 0.1 1.5l3.2 2.4c0.4 0.3 1 0.3 1.3-0.1 1.7-1.8 4-2.8 6.4-2.8s4.7 1 6.3 2.7c0.3 0.4 0.9 0.4 1.3 0.1l3.2-2.4c0.5-0.4 0.5-1 0.1-1.5-2.7-3.1-6.7-4.9-10.9-4.9z m0.1 13.9c2.7 0 5 2.2 5 5s-2.2 5-5 5-5-2.2-5-5 2.3-5 5-5z"></path>
            </svg>
          </span>
        </c-icon>
        WAN Promotion Name 
      </div>
      <div class="nds-b2b-promo-description">A short description of how best to use this product and what it includes.Lorem ipsum dolar sit amet, consectetur, adipisci velit5</div>
      <div class="nds-b2b-promo-period">Offer ends 2/29/20</div>
    </div>`);
  })
  .add("b2bProductItem", () => {
    return withExample(`
    <div class="nds-b2b-product-item">
      <div class="nds-b2b-product-item_container">
        <div class="nds-b2b-product-name">
          <c-icon theme="nds" icon-name="utility:rows" size="small" extraclass="nds-icon-text-default" class="nds-b2b-product-icon">
            <span class="nds-icon_container nds-icon-utility-wifi">
              <svg class="nds-icon nds-icon-text-default nds-icon_x-small" xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 52 52">
                <path fill="#1589ee" d="m47.7 15.8c-5.5-6.1-13.3-9.5-21.6-9.5s-16.1 3.4-21.6 9.5c-0.4 0.4-0.3 1.1 0.1 1.4l3 2.6c0.4 0.4 1 0.3 1.4-0.1 4.4-4.7 10.6-7.4 17.1-7.4s12.7 2.7 17.1 7.4c0.4 0.4 1 0.4 1.4 0.1l3-2.6c0.4-0.4 0.5-1 0.1-1.4z m-21.6 4.5c-4.2 0-8.2 1.8-11 5-0.4 0.4-0.3 1.1 0.1 1.5l3.2 2.4c0.4 0.3 1 0.3 1.3-0.1 1.7-1.8 4-2.8 6.4-2.8s4.7 1 6.3 2.7c0.3 0.4 0.9 0.4 1.3 0.1l3.2-2.4c0.5-0.4 0.5-1 0.1-1.5-2.7-3.1-6.7-4.9-10.9-4.9z m0.1 13.9c2.7 0 5 2.2 5 5s-2.2 5-5 5-5-2.2-5-5 2.3-5 5-5z"></path>
              </svg>
            </span>
          </c-icon>
          Recommended Ethernet Product Name 
        </div>
        <div class="nds-b2b-product-description">A short description of how best to use this product and what it includes.Lorem ipsum dolar sit amet, consectetur, adipisci velit5</div>
        <div class="nds-b2b-product-badge_container">
          <span class="nds-badge nds-b2b-product-badge">Family Owned</span>
          <span class="nds-badge nds-b2b-product-badge">Small Business</span>
        </div>
        <div class="nds-b2b-product_price-range">$6,600 - $6,945</div>
      </div>
    </div>`);
  })
  .add("b2bItemsGrid", () => {
    return withExample(`
    <div class="nds-b2b-items-grid">
        <div class="nds-b2b-items-grid_title">
          <slot name="title">Recommended Products</slot>
        </div>
        <div class="nds-b2b-items-grid_container">
          <slot name="items">
            <div class="nds-b2b-product-item">
              <div class="nds-b2b-product-item_container">
                <div class="nds-b2b-product-name">
                  <c-icon theme="nds" icon-name="utility:rows" size="small" extraclass="nds-icon-text-default" class="nds-b2b-product-icon">
                    <span class="nds-icon_container nds-icon-utility-wifi">
                      <svg class="nds-icon nds-icon-text-default nds-icon_x-small" xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 52 52">
                        <path fill="#1589ee" d="m47.7 15.8c-5.5-6.1-13.3-9.5-21.6-9.5s-16.1 3.4-21.6 9.5c-0.4 0.4-0.3 1.1 0.1 1.4l3 2.6c0.4 0.4 1 0.3 1.4-0.1 4.4-4.7 10.6-7.4 17.1-7.4s12.7 2.7 17.1 7.4c0.4 0.4 1 0.4 1.4 0.1l3-2.6c0.4-0.4 0.5-1 0.1-1.4z m-21.6 4.5c-4.2 0-8.2 1.8-11 5-0.4 0.4-0.3 1.1 0.1 1.5l3.2 2.4c0.4 0.3 1 0.3 1.3-0.1 1.7-1.8 4-2.8 6.4-2.8s4.7 1 6.3 2.7c0.3 0.4 0.9 0.4 1.3 0.1l3.2-2.4c0.5-0.4 0.5-1 0.1-1.5-2.7-3.1-6.7-4.9-10.9-4.9z m0.1 13.9c2.7 0 5 2.2 5 5s-2.2 5-5 5-5-2.2-5-5 2.3-5 5-5z"></path>
                      </svg>
                    </span>
                  </c-icon>
                  Recommended Ethernet Product Name 
                </div>
                <div class="nds-b2b-product-description">A short description of how best to use this product and what it includes.Lorem ipsum dolar sit amet, consectetur, adipisci velit5</div>
                <div class="nds-b2b-product-badge_container">
                  <span class="nds-badge nds-b2b-product-badge">Family Owned</span>
                  <span class="nds-badge nds-b2b-product-badge">Small Business</span>
                </div>
                <div class="nds-b2b-product_price-range">$6,600 - $6,945</div>
              </div>
            </div>

            <div class="nds-b2b-product-item">
              <div class="nds-b2b-product-item_container">
                <div class="nds-b2b-product-name">
                  <c-icon theme="nds" icon-name="utility:rows" size="small" extraclass="nds-icon-text-default" class="nds-b2b-product-icon">
                    <span class="nds-icon_container nds-icon-utility-wifi">
                      <svg class="nds-icon nds-icon-text-default nds-icon_x-small" xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 52 52">
                        <path fill="#1589ee" d="m47.7 15.8c-5.5-6.1-13.3-9.5-21.6-9.5s-16.1 3.4-21.6 9.5c-0.4 0.4-0.3 1.1 0.1 1.4l3 2.6c0.4 0.4 1 0.3 1.4-0.1 4.4-4.7 10.6-7.4 17.1-7.4s12.7 2.7 17.1 7.4c0.4 0.4 1 0.4 1.4 0.1l3-2.6c0.4-0.4 0.5-1 0.1-1.4z m-21.6 4.5c-4.2 0-8.2 1.8-11 5-0.4 0.4-0.3 1.1 0.1 1.5l3.2 2.4c0.4 0.3 1 0.3 1.3-0.1 1.7-1.8 4-2.8 6.4-2.8s4.7 1 6.3 2.7c0.3 0.4 0.9 0.4 1.3 0.1l3.2-2.4c0.5-0.4 0.5-1 0.1-1.5-2.7-3.1-6.7-4.9-10.9-4.9z m0.1 13.9c2.7 0 5 2.2 5 5s-2.2 5-5 5-5-2.2-5-5 2.3-5 5-5z"></path>
                      </svg>
                    </span>
                  </c-icon>
                  Recommended Ethernet Product Name 
                </div>
                <div class="nds-b2b-product-description">A short description of how best to use this product and what it includes.Lorem ipsum dolar sit amet, consectetur, adipisci velit5</div>
                <div class="nds-b2b-product-badge_container">
                  <span class="nds-badge nds-b2b-product-badge">Family Owned</span>
                  <span class="nds-badge nds-b2b-product-badge">Small Business</span>
                </div>
                <div class="nds-b2b-product_price-range">$6,600 - $6,945</div>
              </div>
            </div>
          </slot>
        </div>
    </div>`);
  });
