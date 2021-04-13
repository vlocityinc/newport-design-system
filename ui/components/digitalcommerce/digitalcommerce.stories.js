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
  .add("dcCatalog", () => {
    return withExample(`
    <div class="nds-dc-mobile-catalog-wrapper">
        <slot name="dc-catalog-wrapper-small">
          <svg class="nds-dc-menu-icon"> <svg height="32px" style="enable-background:new 0 0 32 32;" version="1.1"
              viewBox="0 0 32 32" width="32px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink">
              <path
                d="M4,10h24c1.104,0,2-0.896,2-2s-0.896-2-2-2H4C2.896,6,2,6.896,2,8S2.896,10,4,10z M28,14H4c-1.104,0-2,0.896-2,2  s0.896,2,2,2h24c1.104,0,2-0.896,2-2S29.104,14,28,14z M28,22H4c-1.104,0-2,0.896-2,2s0.896,2,2,2h24c1.104,0,2-0.896,2-2  S29.104,22,28,22z">
              </path>
            </svg></svg>
          <div class="nds-dc-mobile-menu-list">
            <svg class="nds-dc-menu-icon"> <svg viewport="0 0 12 12" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <line x1="1" y1="11" x2="11" y2="1" stroke="white" stroke-width="2"></line>
                <line x1="1" y1="1" x2="11" y2="11" stroke="white" stroke-width="2"></line>
              </svg> </svg>
            <ul>
              <li class="nds-dc-catalogMobile active" data-catalog-code="mobile">
                Mobile
              </li>
              <li class="nds-dc-catalogMobile" data-catalog-code="plan">
                Plans
              </li>
              <li class="nds-dc-catalogMobile" data-catalog-code="business">
                Business
              </li>
              <li class="nds-dc-catalogMobile" data-catalog-code="accessories">
                Accessories
              </li>
              <li class="nds-dc-catalogMobile" data-catalog-code="voice">
                Voice
              </li>
              <li class="nds-dc-catalogMobile" data-catalog-code="television">
                Television
              </li>
              <li class="nds-dc-catalogMobile" data-catalog-code="internet">
                Internet
              </li>
              <li class="nds-dc-catalogMobile" data-catalog-code="business">
                Business
              </li>
            </ul>
          </div>
        </slot>
      </div>
      <slot name="dc-catalog-wrapper-large">
        <div class="nds-dc-catalog-wrapper">
          <div class="nds-dc-catalog-scrollable">
            <slot name="dc-catalog-mobile">
              <div class="nds-dc-catalog-item nds-dc-active-catalog">
                <div>
                  <svg>
                    <svg viewBox="0 0 60 60" version="1.1" xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink">
                      <title>icon/mobile</title>
                      <desc>Created with Sketch.</desc>
                      <defs></defs>
                      <g id="icon/mobile" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <g id="Group-3" transform="translate(17.000000, 6.000000)" stroke="#FFFFFF" stroke-width="2">
                          <rect id="Rectangle-3" x="1" y="1" width="25" height="47" rx="4"></rect>
                          <path d="M1.5,39 L25.5,39" id="Line" stroke-linecap="square"></path>
                          <path d="M1.5,7 L25.5,7" id="Line" stroke-linecap="square"></path>
                          <path d="M10.5,43 L16.5,43" id="Line" stroke-linecap="square"></path>
                        </g>
                      </g>
                    </svg>
                  </svg>
                </div>
                Mobile
              </div>
            </slot>
            <slot name="dc-catalog-plan">
              <div class="nds-dc-catalog-item">
                <div>
                  <svg>
                    <svg viewBox="0 0 27 34" version="1.1" xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink">
                      <desc>Created with Sketch.</desc>
                      <defs></defs>
                      <g id="Telecom---VISUAL" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <g id="01---Nav" transform="translate(-263.000000, -600.000000)" stroke-width="1" stroke="#0070D2">
                          <g id="Group-25" transform="translate(237.000000, 543.000000)">
                            <g id="Group-16" transform="translate(0.000000, 39.000000)">
                              <g id="Group-24">
                                <g id="Group-21">
                                  <g id="Group" transform="translate(26.000000, 18.000000)">
                                    <rect id="Rectangle" x="1" y="1" width="25" height="32" rx="1.4"></rect>
                                    <path d="M6.03947368,7 L11.0131579,7" id="Line" stroke-linecap="square"></path>
                                    <path d="M6.03947368,14 L20.25,14" id="Line" stroke-linecap="square"></path>
                                    <path d="M6.03947368,19 L20.25,19" id="Line" stroke-linecap="square"></path>
                                    <path d="M6.03947368,23 L20.25,23" id="Line" stroke-linecap="square"></path>
                                  </g>
                                </g>
                              </g>
                            </g>
                          </g>
                        </g>
                      </g>
                    </svg>
                  </svg>
                </div>
                Plans
              </div>
            </slot>
            <slot name="dc-catalog-business">
              <div class="nds-dc-catalog-item">
                <div>
                  <svg>
                    <svg viewBox="0 0 60 60" version="1.1" xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink">
                      <title>icon/business</title>
                      <desc>Created with Sketch.</desc>
                      <defs></defs>
                      <g id="icon/business" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <g id="Group-49" transform="translate(6.000000, 10.000000)" stroke-width="2">
                          <path
                            d="M14,8 L33,8 L33,1.9973917 C33,1.44715127 32.5537285,1 32.0054385,1 L14.9945615,1 C14.4509942,1 14,1.45017674 14,1.9973917 L14,8 Z"
                            id="Rectangle-17" stroke="#1564BF"></path>
                          <rect id="Rectangle-15" stroke="#1564BF" x="1" y="8" width="46" height="32"></rect>
                          <path d="M1,19 L46.0099983,19" id="Line" stroke="#0070D2" stroke-linecap="square"></path>
                          <rect id="Rectangle-18" stroke="#1564BF" x="20" y="19" width="8" height="5"></rect>
                        </g>
                      </g>
                    </svg>
                  </svg>
                </div>
                Business
              </div>
            </slot>
            <slot name="dc-catalog-accessories">
              <div class="nds-dc-catalog-item">
                <div>
                  <svg>
                    <svg viewBox="0 0 60 60" version="1.1" xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink">
                      <title>icon/accessories</title>
                      <desc>Created with Sketch.</desc>
                      <defs></defs>
                      <g id="icon/accessories" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <g id="Group-52" transform="translate(10.000000, 10.000000)" stroke="#1564BF" stroke-width="2">
                          <path
                            d="M0,30 L0,20.0038134 C0,8.95601232 8.95187636,0 20,0 C31.045695,0 40,8.94763392 40,20.0038134 L40,30"
                            id="Rectangle-20" stroke-linecap="round"></path>
                          <rect id="Rectangle-21" x="31" y="23.2222222" width="5.77777778" height="15.7777778"
                            rx="2.88888889"></rect>
                          <rect id="Rectangle-21" x="3.22222222" y="23.2222222" width="5.77777778" height="15.7777778"
                            rx="2.88888889"></rect>
                        </g>
                      </g>
                    </svg>
                  </svg>
                </div>
                Accessories
              </div>
            </slot>
            <slot name="dc-catalog-voice">
              <div class="nds-dc-catalog-item">
                <div>
                  <svg>
                    <svg viewBox="0 0 60 60" version="1.1" xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink">
                      <title>icon/voice</title>
                      <desc>Created with Sketch.</desc>
                      <defs></defs>
                      <g id="icon/voice" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <g id="Group-47" transform="translate(5.000000, 12.000000)" stroke="#1564BF">
                          <path
                            d="M14.92,3.92 L14.92,34.08 L46.0098214,34.08 C47.7054613,34.08 49.08,32.7003203 49.08,30.9957423 L49.08,7.0042577 C49.08,5.29782952 47.7061287,3.92 46.0098214,3.92 L14.92,3.92 Z"
                            id="Rectangle-3" stroke-width="1.84"></path>
                          <rect id="Rectangle-16" stroke-width="2" x="21" y="10" width="22" height="7" rx="1"></rect>
                          <rect id="Rectangle-3" stroke-width="1.84" x="0.92" y="0.92" width="14.16" height="35.16" rx="4">
                          </rect>
                        </g>
                      </g>
                    </svg>
                  </svg>
                </div>
                Voice
              </div>
            </slot>
            <slot name="dc-catalog-television">
              <div class="nds-dc-catalog-item">
                <div>
                  <svg>
                    <svg viewBox="0 0 58 40" version="1.1" xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink">
                      <desc>Created with Sketch.</desc>
                      <defs>
                        <rect id="path-1" x="0" y="0" width="58" height="36" rx="2"></rect>
                      </defs>
                      <g id="Telecom---VISUAL" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <g id="01---Nav" transform="translate(-704.000000, -1029.000000)">
                          <g id="Group-43" transform="translate(234.000000, 929.000000)">
                            <g id="Group-53">
                              <g id="Group-5">
                                <g id="Group-10" transform="translate(0.000000, 59.000000)">
                                  <g id="Group-51" transform="translate(470.000000, 41.000000)">
                                    <g id="Group-50" transform="translate(7.000000, 29.000000)" stroke="#0070D2"
                                      stroke-width="2">
                                      <rect id="Rectangle-19" x="1" y="1" width="4" height="9" rx="2"></rect>
                                      <rect id="Rectangle-19" x="40" y="1" width="4" height="9" rx="2"></rect>
                                    </g>
                                    <g id="Rectangle-12">
                                      <use fill="#F8FBFE" fill-rule="evenodd" xlink:href="#path-1"></use>
                                      <rect stroke="#0070D2" stroke-width="1.84" x="0.92" y="0.92" width="56.16"
                                        height="34.16" rx="2"></rect>
                                    </g>
                                  </g>
                                </g>
                              </g>
                            </g>
                          </g>
                        </g>
                      </g>
                    </svg>
                  </svg>
                </div>
                Television
              </div>
            </slot>
            <slot name="dc-catalog-internet">
              <div class="nds-dc-catalog-item">
                <div>
                  <svg>
                    <svg viewBox="0 0 60 60" version="1.1" xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink">
                      <title>icon/internet</title>
                      <desc>Created with Sketch.</desc>
                      <defs></defs>
                      <g id="icon/internet" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <g id="Group-46" transform="translate(8.000000, 13.000000)" stroke="#1564BF" stroke-width="2">
                          <circle id="Oval-5" cx="22.5" cy="29.5" r="4.5"></circle>
                          <path
                            d="M31.5425215,30.0776541 C31.9079285,28.7811355 32.1034132,27.4133967 32.1034132,26 C32.1034132,17.7157288 25.3876844,11 17.1034132,11 C15.6806527,11 14.3041571,11.1980834 13,11.5681766"
                            id="Oval-8" stroke-linecap="round"
                            transform="translate(22.551707, 20.538827) rotate(-45.000000) translate(-22.551707, -20.538827) ">
                          </path>
                          <path
                            d="M44.3813712,13.4053578 C40.2021933,5.43639964 31.8494351,0 22.2269378,0 C12.5484681,0 4.15455217,5.49982878 0,13.5446765"
                            id="Oval-8" stroke-linecap="round"></path>
                        </g>
                      </g>
                    </svg>
                  </svg>
                </div>
                Internet
              </div>
            </slot>
            <slot name="dc-catalog-business">
              <div class="nds-dc-catalog-item">
                <div>
                  <svg>
                    <svg viewBox="0 0 60 60" version="1.1" xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink">
                      <title>icon/business</title>
                      <desc>Created with Sketch.</desc>
                      <defs></defs>
                      <g id="icon/business" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <g id="Group-49" transform="translate(6.000000, 10.000000)" stroke-width="2">
                          <path
                            d="M14,8 L33,8 L33,1.9973917 C33,1.44715127 32.5537285,1 32.0054385,1 L14.9945615,1 C14.4509942,1 14,1.45017674 14,1.9973917 L14,8 Z"
                            id="Rectangle-17" stroke="#1564BF"></path>
                          <rect id="Rectangle-15" stroke="#1564BF" x="1" y="8" width="46" height="32"></rect>
                          <path d="M1,19 L46.0099983,19" id="Line" stroke="#0070D2" stroke-linecap="square"></path>
                          <rect id="Rectangle-18" stroke="#1564BF" x="20" y="19" width="8" height="5"></rect>
                        </g>
                      </g>
                    </svg>
                  </svg>
                </div>
                Business
              </div>
            </slot>
          </div>
        </div>
      </slot>
    `);
  })
  .add("dcChildCatalogs", () => {
    return withExample(`
      <div class="nds-dc-child-catalog-container">
        <div class="nds-dc-catalog-title-container">
          <slot name="dc-title">
            <h3>Mobile</h3>
          </slot><span class="underline-title"></span>
        </div>
        <slot name="dc-child-catalog-wrapper">
          <div class="item-list nds-dc-wrapper">
            <div data-catalog="Phones" class="slds-size--1-of-3 nds-dc-child-catalog-item tabMenu active"><span
                class="nds-dc-child-catalog-item">Phones</span></div>
            <div data-catalog="Tablets" class="slds-size--1-of-3 nds-dc-child-catalog-item tabMenu"><span
                class="nds-dc-child-catalog-item">Tablets</span></div>
            <div data-catalog="Wearables" class="slds-size--1-of-3 nds-dc-child-catalog-item tabMenu"><span
                class="nds-dc-child-catalog-item">Wearables</span></div>
          </div>
        </slot>
      </div>
    `);
  })
  .add("dcFilter", () => {
    return withExample(`
      <slot name="dc-filter-wrapper">
        <div class="via-nds nds-dc-filter">
          <button class="
              nds-button 
              nds-dc-filter_button
              nds-button_brand">
            <span class="nds-button__icon nds-button__icon_left">
              <svg enable-background="new 0 0 36 30" height="30px"
                id="Layer_1" version="1.1" viewBox="0 0 36 30" width="36px" xml:space="preserve"
                xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <polygon fill="#FFFF" points="14,30 22,25 22,17 35.999,0 17.988,0 0,0 14,17 "></polygon>
              </svg>
            </span>
            Refine
          </button>
          <div class="
            nds-dc-filter-container
            nds-dc-filter_container_show">
            <div class="nds-dc-filter-section_container">
              <div class="nds-dc-filter-group">
                <div class="nds-dc-filter-section">
                  Promotion
                </div> <label class="nds-checkbox">
                  <input type="checkbox" name="Promotion only" value="promotions">
                  <span class="nds-checkbox_faux"></span>
                  <label class="nds-checkbox__label">
                    <span class="nds-form-element__label">Promotion only</span>
                  </label> </label><br>
              </div>
            </div>
          </div>
          <div class="nds-dc-filter_criteria-container">
            <span class="nds-dc-filter-criteria">Promotion only</span><span class="nds-dc-filter-remove">✕</span>
          </div>
        </div>
      </slot>
    `);
  })
  .add("dcOffersList", () => {
    return withExample(`
      <c-dc-offers-list>
        <div class="nds-dc-offerlist-container">
          <div class="nds-dc-filter-wrapper">
            <slot name="dc-offer-list-switch-wrapper">
              <span>
                <svg width="44px" height="44px" viewBox="0 0 44 44" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                  <!-- Generator: Sketch 49 (51002) - http://www.bohemiancoding.com/sketch -->
                  <title>list view/base</title>
                  <desc>Created with Sketch.</desc>
                  <defs></defs>
                  <g id="list-view/base" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g id="Group-9">
                      <g id="tab/product/base">
                        <rect id="Rectangle-Copy" stroke="#D8DDE6" stroke-width="1" x="0.5" y="0.5" width="43" height="43" rx="1"></rect>
                        <text id="Tablets" font-family="SalesforceSans-Regular, Salesforce Sans" font-size="12" font-weight="normal" line-spacing="16"></text>
                      </g>
                      <g id="icon/list-light" transform="translate(10.000000, 10.000000)" fill="#54698D">
                        <rect id="Rectangle-11" x="0" y="0" width="5" height="5" rx="1"></rect>
                        <rect id="Rectangle-11-Copy-2" x="0" y="9" width="5" height="5" rx="1"></rect>
                        <rect id="Rectangle-11-Copy-4" x="0" y="19" width="5" height="5" rx="1"></rect>
                        <rect id="Rectangle-11-Copy" x="7" y="0" width="17" height="5" rx="1"></rect>
                        <rect id="Rectangle-11-Copy-3" x="7" y="9" width="17" height="5" rx="1"></rect>
                        <path d="M8.10479481,18.9499728 L23.1047948,18.9461196 C23.6570795,18.9459866 24.1049026,19.393594 24.1050356,19.9458787 C24.1050356,19.945959 24.1050356,19.9460393 24.1050356,19.9461196 L24.1047948,22.9461196 C24.1047948,23.4984043 23.6570796,23.9461196 23.1047948,23.9461196 L8.10479484,23.9461196 C7.55251009,23.9461196 7.10479484,23.4984043 7.10479484,22.9461196 L7.1050357,19.9502137 C7.1050357,19.398023 7.55260418,18.9503467 8.10479487,18.9502137 Z" id="Rectangle-11-Copy-5"></path>
                      </g>
                    </g>
                  </g>
                </svg>
              </span>
              <span>
                <svg width="44px" height="44px" viewBox="0 0 44 44" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                  <!-- Generator: Sketch 49 (51002) - http://www.bohemiancoding.com/sketch -->
                  <title>grid view/selected</title>
                  <desc>Created with Sketch.</desc>
                  <defs>
                    <rect id="path-1" x="0" y="0" width="44" height="44" rx="1"></rect>
                  </defs>
                  <g id="grid-view/selected" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g id="tab/product/selected">
                      <g id="Rectangle">
                        <use fill="#FFFFFF" fill-rule="evenodd" xlink:href="#path-1"></use>
                        <rect stroke="#FF6D00" stroke-width="1" x="0.5" y="0.5" width="43" height="43" rx="1"></rect>
                      </g>
                      <text id="Phones" font-family="SalesforceSans-Regular, Salesforce Sans" font-size="12" font-weight="normal" line-spacing="16"></text>
                    </g>
                    <g id="icon/grid" transform="translate(10.000000, 10.000000)" fill="#FF6D00">
                      <g id="Group-9">
                        <rect id="Rectangle" x="0" y="0" width="11" height="11" rx="1"></rect>
                        <rect id="Rectangle-Copy-2" x="13" y="0" width="11" height="11" rx="1"></rect>
                        <rect id="Rectangle-Copy" x="0" y="13" width="11" height="11" rx="1"></rect>
                        <rect id="Rectangle-Copy-3" x="13" y="13" width="11" height="11" rx="1"></rect>
                      </g>
                    </g>
                  </g>
                </svg>
              </span>
            </slot>
          </div>
          <div>
            <c-dc-offer-grid-view>
              <slot name="dc-offer-grid-view-wrapper">
                <div class="nds-grid nds-wrap nds-dc-offer-grid-view"><span data-id="0"
                    class="nds-size--1-of-1 nds-medium-size--1-of-2 nds-large-size--1-of-3 nds-dc-offer-board">
                    <div data-offer-code="iPhoneX" class="nds-dc-offer-item-tile">
                      <div class="nds-dc-offer-tag">SPECIAL OFFER - iPhoneXOffer</div>
                      <ul class="slds-has-dividers_around-space">
                        <li class="nds-dc-nds-item">
                          <article class="slds-tile slds-tile_board nds-dc-offer-item">
                            <c-dc-offer-list-view-image>
                              <slot name="dc-offer-image-wrapper">
                                <div class="nds-dc-offer-image-container"><img
                                    src="https://images-na.ssl-images-amazon.com/images/I/61682XpNGFL._SY879_.jpg"
                                    class="nds-dc-listview"></div>
                              </slot>
                            </c-dc-offer-list-view-image>
                            <div class="nds-dc-offer-item-details">
                              <slot name="dc-attributes">
                                <div class="nds-grid nds-wrap">
                                  <div class="nds-size--1-of-2">
                                    <div class="nds-dc-tile-text">Apple</div>
                                    <div class="nds-dc-offer-name">iPhone X</div>
                                  </div>
                                  <div class="nds-size--1-of-2">
                                    <c-dc-offer-list-view-attribute>
                                      <slot name="dc-list-view-attribute-wrapper">
                                        <div class="nds-dc-offer-attributes">
                                          <div class="nds-dc-tile-text">Available in</div>
                                          <div>
                                            <div>
                                              <slot name="dc-offer-list-config-attribute">
                                                <div class="nds-dc-offer-button-set"></div>
                                              </slot>
                                            </div>
                                          </div>
                                          <div>
                                            <div>
                                              <slot name="dc-offer-list-config-attribute">
                                                <div class="nds-dc-offer-button-set"></div>
                                              </slot>
                                            </div>
                                          </div>
                                          <div>
                                            <div>
                                              <slot name="dc-offer-list-radio-attribute">
                                                <div class="nds-dc-offer-round-button-set"><span
                                                    class="nds-dc-offer-attribute"
                                                    style="background-color: rgb(255, 0, 0);"></span><span
                                                    class="nds-dc-offer-attribute"
                                                    style="background-color: rgb(212, 175, 55);"></span><span
                                                    class="nds-dc-offer-attribute"
                                                    style="background-color: rgb(0, 0, 0);"></span></div>
                                              </slot>
                                            </div>
                                          </div>
                                          <div>
                                            <div>
                                              <slot name="dc-offer-list-config-attribute">
                                                <div class="nds-dc-offer-button-set"></div>
                                              </slot>
                                            </div>
                                          </div>
                                          <div>
                                            <div>
                                              <slot name="dc-offer-list-config-attribute">
                                                <div class="nds-dc-offer-button-set">
                                                  <div><span class="nds-dc-tile-text-small nds-dc-offer-attribute">16GB</span>
                                                  </div>
                                                  <div><span class="nds-dc-tile-text-small nds-dc-offer-attribute">32GB</span>
                                                  </div>
                                                  <div><span class="nds-dc-tile-text-small nds-dc-offer-attribute">64GB</span>
                                                  </div>
                                                </div>
                                              </slot>
                                            </div>
                                          </div>
                                          <div>
                                            <div>
                                              <slot name="dc-offer-list-config-attribute">
                                                <div class="nds-dc-offer-button-set"></div>
                                              </slot>
                                            </div>
                                          </div>
                                        </div>
                                      </slot>
                                    </c-dc-offer-list-view-attribute>
                                  </div>
                                </div>
                              </slot>
                              <hr>
                              <c-dc-offer-list-view-price class="pricelist">
                                <div class="nds-dc-list-prices">
                                  <slot name="dc-list-view-price-wrapper">
                                    <div class="nds-grid nds-wrap nds-dc-offer-price-wrapper nds-dc-offer-gridview">
                                      <div class="nds-size--1-of-2 nds-dc-price-items">
                                        <div class="nds-dc-offer-price"><span
                                            class="nds-dc-offer-discount-price">$89</span><span
                                            class="nds-dc-offer-actual-price"><strike
                                              class="nds-dc-offer-base-amount">$89</strike></span></div>
                                      </div>
                                      <div class="nds-size--1-of-2 nds-grid nds-wrap nds-dc-price-items">
                                        <div class="nds-size--2-of-3">
                                          <div class="nds-dc-offer-price"><span
                                              class="nds-dc-offer-discount-price">$910</span><span
                                              class="nds-dc-offer-actual-price"><strike
                                                class="nds-dc-offer-base-amount">$910</strike></span></div>
                                        </div>
                                      </div>
                                    </div>
                                  </slot>
                                </div>
                              </c-dc-offer-list-view-price>
                              <slot name="dc-offer-desc">
                                <hr>
                                <div class="slds-tile__detail nds-dc-offer-detail">iPhone X with A10 Bionic chip processor and
                                  6inch Retina HD display.</div>
                              </slot>
                            </div>
                          </article>
                        </li>
                      </ul>
                    </div>
                  </span><span data-id="1"
                    class="nds-size--1-of-1 nds-medium-size--1-of-2 nds-large-size--1-of-3 nds-dc-offer-board">
                    <div data-offer-code="iPhone11" class="nds-dc-offer-item-tile">
                      <div class="nds-dc-offer-tag">SPECIAL OFFER - Welcome10</div>
                      <ul class="slds-has-dividers_around-space">
                        <li class="nds-dc-nds-item">
                          <article class="slds-tile slds-tile_board nds-dc-offer-item">
                            <c-dc-offer-list-view-image>
                              <slot name="dc-offer-image-wrapper">
                                <div class="nds-dc-offer-image-container"><img
                                    src="https://images-na.ssl-images-amazon.com/images/I/715HCLsOHbL._AC_SL1500_.jpg"
                                    class="nds-dc-listview"></div>
                              </slot>
                            </c-dc-offer-list-view-image>
                            <div class="nds-dc-offer-item-details">
                              <slot name="dc-attributes">
                                <div class="nds-grid nds-wrap">
                                  <div class="nds-size--1-of-2">
                                    <div class="nds-dc-tile-text">Apple</div>
                                    <div class="nds-dc-offer-name">iPhone11</div>
                                  </div>
                                  <div class="nds-size--1-of-2">
                                    <c-dc-offer-list-view-attribute>
                                      <slot name="dc-list-view-attribute-wrapper">
                                        <div class="nds-dc-offer-attributes">
                                          <div class="nds-dc-tile-text">Available in</div>
                                          <div>
                                            <div>
                                              <slot name="dc-offer-list-config-attribute">
                                                <div class="nds-dc-offer-button-set"></div>
                                              </slot>
                                            </div>
                                          </div>
                                          <div>
                                            <div>
                                              <slot name="dc-offer-list-config-attribute">
                                                <div class="nds-dc-offer-button-set"></div>
                                              </slot>
                                            </div>
                                          </div>
                                          <div>
                                            <div>
                                              <slot name="dc-offer-list-radio-attribute">
                                                <div class="nds-dc-offer-round-button-set"><span
                                                    class="nds-dc-offer-attribute"
                                                    style="background-color: rgb(255, 0, 0);"></span><span
                                                    class="nds-dc-offer-attribute"
                                                    style="background-color: rgb(0, 0, 0);"></span><span
                                                    class="nds-dc-offer-attribute"
                                                    style="background-color: rgb(255, 255, 255);"></span></div>
                                              </slot>
                                            </div>
                                          </div>
                                          <div>
                                            <div>
                                              <slot name="dc-offer-list-config-attribute">
                                                <div class="nds-dc-offer-button-set"></div>
                                              </slot>
                                            </div>
                                          </div>
                                          <div>
                                            <div>
                                              <slot name="dc-offer-list-config-attribute">
                                                <div class="nds-dc-offer-button-set">
                                                  <div><span class="nds-dc-tile-text-small nds-dc-offer-attribute">32GB</span>
                                                  </div>
                                                  <div><span class="nds-dc-tile-text-small nds-dc-offer-attribute">64GB</span>
                                                  </div>
                                                  <div><span
                                                      class="nds-dc-tile-text-small nds-dc-offer-attribute">128GB</span></div>
                                                </div>
                                              </slot>
                                            </div>
                                          </div>
                                          <div>
                                            <div>
                                              <slot name="dc-offer-list-config-attribute">
                                                <div class="nds-dc-offer-button-set"></div>
                                              </slot>
                                            </div>
                                          </div>
                                        </div>
                                      </slot>
                                    </c-dc-offer-list-view-attribute>
                                  </div>
                                </div>
                              </slot>
                              <hr>
                              <c-dc-offer-list-view-price class="pricelist">
                                <div class="nds-dc-list-prices">
                                  <slot name="dc-list-view-price-wrapper">
                                    <div class="nds-grid nds-wrap nds-dc-offer-price-wrapper nds-dc-offer-gridview">
                                      <div class="nds-size--1-of-2 nds-dc-price-items">
                                        <div class="nds-dc-offer-price"><span
                                            class="nds-dc-offer-discount-price">$49</span><span
                                            class="nds-dc-offer-actual-price"><strike
                                              class="nds-dc-offer-base-amount">$49</strike></span></div>
                                      </div>
                                      <div class="nds-size--1-of-2 nds-grid nds-wrap nds-dc-price-items">
                                        <div class="nds-size--2-of-3">
                                          <div class="nds-dc-offer-price"><span
                                              class="nds-dc-offer-discount-price">$699</span><span
                                              class="nds-dc-offer-actual-price"><strike
                                                class="nds-dc-offer-base-amount">$699</strike></span></div>
                                        </div>
                                      </div>
                                    </div>
                                  </slot>
                                </div>
                              </c-dc-offer-list-view-price>
                              <slot name="dc-offer-desc">
                                <hr>
                                <div class="slds-tile__detail nds-dc-offer-detail">Just the right amount of everything. New
                                  dual-camera system. All-day battery. The toughest glass in a smartphone. And Apple's fastest
                                  chip ever.</div>
                              </slot>
                            </div>
                          </article>
                        </li>
                      </ul>
                    </div>
                  </span><span data-id="2"
                    class="nds-size--1-of-1 nds-medium-size--1-of-2 nds-large-size--1-of-3 nds-dc-offer-board">
                    <div data-offer-code="iPhoneX" class="nds-dc-offer-item-tile">
                      <div class="nds-dc-offer-tag">SPECIAL OFFER - Welcome10</div>
                      <ul class="slds-has-dividers_around-space">
                        <li class="nds-dc-nds-item">
                          <article class="slds-tile slds-tile_board nds-dc-offer-item">
                            <c-dc-offer-list-view-image>
                              <slot name="dc-offer-image-wrapper">
                                <div class="nds-dc-offer-image-container"><img
                                    src="https://images-na.ssl-images-amazon.com/images/I/61682XpNGFL._SY879_.jpg"
                                    class="nds-dc-listview"></div>
                              </slot>
                            </c-dc-offer-list-view-image>
                            <div class="nds-dc-offer-item-details">
                              <slot name="dc-attributes">
                                <div class="nds-grid nds-wrap">
                                  <div class="nds-size--1-of-2">
                                    <div class="nds-dc-tile-text">Apple</div>
                                    <div class="nds-dc-offer-name">iPhone X</div>
                                  </div>
                                  <div class="nds-size--1-of-2">
                                    <c-dc-offer-list-view-attribute>
                                      <slot name="dc-list-view-attribute-wrapper">
                                        <div class="nds-dc-offer-attributes">
                                          <div class="nds-dc-tile-text">Available in</div>
                                          <div>
                                            <div>
                                              <slot name="dc-offer-list-config-attribute">
                                                <div class="nds-dc-offer-button-set"></div>
                                              </slot>
                                            </div>
                                          </div>
                                          <div>
                                            <div>
                                              <slot name="dc-offer-list-config-attribute">
                                                <div class="nds-dc-offer-button-set"></div>
                                              </slot>
                                            </div>
                                          </div>
                                          <div>
                                            <div>
                                              <slot name="dc-offer-list-radio-attribute">
                                                <div class="nds-dc-offer-round-button-set"><span
                                                    class="nds-dc-offer-attribute"
                                                    style="background-color: rgb(255, 0, 0);"></span><span
                                                    class="nds-dc-offer-attribute"
                                                    style="background-color: rgb(212, 175, 55);"></span><span
                                                    class="nds-dc-offer-attribute"
                                                    style="background-color: rgb(0, 0, 0);"></span></div>
                                              </slot>
                                            </div>
                                          </div>
                                          <div>
                                            <div>
                                              <slot name="dc-offer-list-config-attribute">
                                                <div class="nds-dc-offer-button-set"></div>
                                              </slot>
                                            </div>
                                          </div>
                                          <div>
                                            <div>
                                              <slot name="dc-offer-list-config-attribute">
                                                <div class="nds-dc-offer-button-set">
                                                  <div><span class="nds-dc-tile-text-small nds-dc-offer-attribute">16GB</span>
                                                  </div>
                                                  <div><span class="nds-dc-tile-text-small nds-dc-offer-attribute">32GB</span>
                                                  </div>
                                                  <div><span class="nds-dc-tile-text-small nds-dc-offer-attribute">64GB</span>
                                                  </div>
                                                </div>
                                              </slot>
                                            </div>
                                          </div>
                                          <div>
                                            <div>
                                              <slot name="dc-offer-list-config-attribute">
                                                <div class="nds-dc-offer-button-set"></div>
                                              </slot>
                                            </div>
                                          </div>
                                        </div>
                                      </slot>
                                    </c-dc-offer-list-view-attribute>
                                  </div>
                                </div>
                              </slot>
                              <hr>
                              <c-dc-offer-list-view-price class="pricelist">
                                <div class="nds-dc-list-prices">
                                  <slot name="dc-list-view-price-wrapper">
                                    <div class="nds-grid nds-wrap nds-dc-offer-price-wrapper nds-dc-offer-gridview">
                                      <div class="nds-size--1-of-2 nds-dc-price-items">
                                        <div class="nds-dc-offer-price"><span
                                            class="nds-dc-offer-discount-price">$89</span><span
                                            class="nds-dc-offer-actual-price"><strike
                                              class="nds-dc-offer-base-amount">$89</strike></span></div>
                                      </div>
                                      <div class="nds-size--1-of-2 nds-grid nds-wrap nds-dc-price-items">
                                        <div class="nds-size--2-of-3">
                                          <div class="nds-dc-offer-price"><span
                                              class="nds-dc-offer-discount-price">$910</span><span
                                              class="nds-dc-offer-actual-price"><strike
                                                class="nds-dc-offer-base-amount">$910</strike></span></div>
                                        </div>
                                      </div>
                                    </div>
                                  </slot>
                                </div>
                              </c-dc-offer-list-view-price>
                              <slot name="dc-offer-desc">
                                <hr>
                                <div class="slds-tile__detail nds-dc-offer-detail">iPhone X with A10 Bionic chip processor and
                                  6inch Retina HD display.</div>
                              </slot>
                            </div>
                          </article>
                        </li>
                      </ul>
                    </div>
                  </span></div>
              </slot>
            </c-dc-offer-grid-view>
          </div>
        </div>
      </c-dc-offers-list>
    `);
  })
  .add("dcOfferListView", () => {
    return withExample(`
      <c-dc-offer-list-view>
        <slot name="dc-offer-list-view-wrapper">
          <div class="nds-dc-offer-list-view">
            <div data-id="0" class="nds-grid nds-wrap"><span class="nds-size--1-of-1 nds-dc-offer-board">
                <div data-offer-code="iPhoneX" class="nds-dc-offer-item-list">
                  <div class="nds-dc-offer-tag"> - iPhoneXOffer</div>
                  <ul class="slds-has-dividers_around-space">
                    <li class="nds-dc-nds-item">
                      <article class="slds-tile slds-tile_board nds-dc-offer-item">
                        <div class="nds-dc-offer-wrapper">
                          <div class="nds-dc-offer-item-values">
                            <div class="nds-dc-image-container">
                              <c-dc-offer-list-view-image>
                                <slot name="dc-offer-image-wrapper">
                                  <div class="nds-dc-offer-image-container"><img
                                      src="https://images-na.ssl-images-amazon.com/images/I/61682XpNGFL._SY879_.jpg"
                                      class="nds-dc-listview"></div>
                                </slot>
                              </c-dc-offer-list-view-image>
                            </div>
                          </div>
                          <div class="nds-grid nds-wrap nds-dc-offer-details">
                            <slot name="dc-offer-title-container">
                              <div class="nds-dc-offer-title-container">
                                <div class="nds-dc-tile-text">Apple</div>
                                <div class="nds-dc-offer-name">iPhone X</div>
                              </div>
                            </slot>
                            <div class="nds-dc-offer-item-config">
                              <c-dc-offer-list-view-attribute>
                                <slot name="dc-list-view-attribute-wrapper">
                                  <div class="nds-dc-offer-attributes">
                                    <div class="nds-dc-tile-text">Available in</div>
                                    <div>
                                      <div>
                                        <slot name="dc-offer-list-config-attribute">
                                          <div class="nds-dc-offer-button-set"></div>
                                        </slot>
                                      </div>
                                    </div>
                                    <div>
                                      <div>
                                        <slot name="dc-offer-list-config-attribute">
                                          <div class="nds-dc-offer-button-set"></div>
                                        </slot>
                                      </div>
                                    </div>
                                    <div>
                                      <div>
                                        <slot name="dc-offer-list-radio-attribute">
                                          <div class="nds-dc-offer-round-button-set"><span class="nds-dc-offer-attribute"
                                              style="background-color: rgb(255, 0, 0);"></span><span
                                              class="nds-dc-offer-attribute"
                                              style="background-color: rgb(212, 175, 55);"></span><span
                                              class="nds-dc-offer-attribute" style="background-color: rgb(0, 0, 0);"></span>
                                          </div>
                                        </slot>
                                      </div>
                                    </div>
                                    <div>
                                      <div>
                                        <slot name="dc-offer-list-config-attribute">
                                          <div class="nds-dc-offer-button-set"></div>
                                        </slot>
                                      </div>
                                    </div>
                                    <div>
                                      <div>
                                        <slot name="dc-offer-list-config-attribute">
                                          <div class="nds-dc-offer-button-set">
                                            <div><span class="nds-dc-tile-text-small nds-dc-offer-attribute">16GB</span></div>
                                            <div><span class="nds-dc-tile-text-small nds-dc-offer-attribute">32GB</span></div>
                                            <div><span class="nds-dc-tile-text-small nds-dc-offer-attribute">64GB</span></div>
                                          </div>
                                        </slot>
                                      </div>
                                    </div>
                                    <div>
                                      <div>
                                        <slot name="dc-offer-list-config-attribute">
                                          <div class="nds-dc-offer-button-set"></div>
                                        </slot>
                                      </div>
                                    </div>
                                  </div>
                                </slot>
                              </c-dc-offer-list-view-attribute>
                            </div>
                          </div>
                        </div>
                        <div class="nds-dc-offer-item-details">
                          <c-dc-offer-list-view-price class="pricelist">
                            <div class="nds-dc-list-prices">
                              <slot name="dc-list-view-price-wrapper">
                                <div class="nds-grid nds-wrap nds-dc-offer-price-wrapper nds-dc-offer-listview">
                                  <div class="nds-size--1-of-2 nds-dc-price-items">
                                    <div class="nds-dc-offer-price"><span class="nds-dc-offer-discount-price">$89</span><span
                                        class="nds-dc-offer-actual-price"><strike
                                          class="nds-dc-offer-base-amount">$89</strike></span></div>
                                  </div>
                                  <div class="nds-size--1-of-2 nds-grid nds-wrap nds-dc-price-items">
                                    <div class="nds-size--2-of-3">
                                      <div class="nds-dc-offer-price"><span
                                          class="nds-dc-offer-discount-price">$910</span><span
                                          class="nds-dc-offer-actual-price"><strike
                                            class="nds-dc-offer-base-amount">$910</strike></span></div>
                                    </div>
                                  </div>
                                </div>
                              </slot>
                            </div>
                          </c-dc-offer-list-view-price>
                        </div>
                      </article>
                    </li>
                  </ul>
                </div>
              </span></div>
            <div data-id="1" class="nds-grid nds-wrap"><span class="nds-size--1-of-1 nds-dc-offer-board">
                <div data-offer-code="iPhone11" class="nds-dc-offer-item-list">
                  <div class="nds-dc-offer-tag"> - Welcome10</div>
                  <ul class="slds-has-dividers_around-space">
                    <li class="nds-dc-nds-item">
                      <article class="slds-tile slds-tile_board nds-dc-offer-item">
                        <div class="nds-dc-offer-wrapper">
                          <div class="nds-dc-offer-item-values">
                            <div class="nds-dc-image-container">
                              <c-dc-offer-list-view-image>
                                <slot name="dc-offer-image-wrapper">
                                  <div class="nds-dc-offer-image-container"><img
                                      src="https://images-na.ssl-images-amazon.com/images/I/715HCLsOHbL._AC_SL1500_.jpg"
                                      class="nds-dc-listview"></div>
                                </slot>
                              </c-dc-offer-list-view-image>
                            </div>
                          </div>
                          <div class="nds-grid nds-wrap nds-dc-offer-details">
                            <slot name="dc-offer-title-container">
                              <div class="nds-dc-offer-title-container">
                                <div class="nds-dc-tile-text">Apple</div>
                                <div class="nds-dc-offer-name">iPhone11</div>
                              </div>
                            </slot>
                            <div class="nds-dc-offer-item-config">
                              <c-dc-offer-list-view-attribute>
                                <slot name="dc-list-view-attribute-wrapper">
                                  <div class="nds-dc-offer-attributes">
                                    <div class="nds-dc-tile-text">Available in</div>
                                    <div>
                                      <div>
                                        <slot name="dc-offer-list-config-attribute">
                                          <div class="nds-dc-offer-button-set"></div>
                                        </slot>
                                      </div>
                                    </div>
                                    <div>
                                      <div>
                                        <slot name="dc-offer-list-config-attribute">
                                          <div class="nds-dc-offer-button-set"></div>
                                        </slot>
                                      </div>
                                    </div>
                                    <div>
                                      <div>
                                        <slot name="dc-offer-list-radio-attribute">
                                          <div class="nds-dc-offer-round-button-set"><span class="nds-dc-offer-attribute"
                                              style="background-color: rgb(255, 0, 0);"></span><span
                                              class="nds-dc-offer-attribute"
                                              style="background-color: rgb(0, 0, 0);"></span><span
                                              class="nds-dc-offer-attribute"
                                              style="background-color: rgb(255, 255, 255);"></span></div>
                                        </slot>
                                      </div>
                                    </div>
                                    <div>
                                      <div>
                                        <slot name="dc-offer-list-config-attribute">
                                          <div class="nds-dc-offer-button-set"></div>
                                        </slot>
                                      </div>
                                    </div>
                                    <div>
                                      <div>
                                        <slot name="dc-offer-list-config-attribute">
                                          <div class="nds-dc-offer-button-set">
                                            <div><span class="nds-dc-tile-text-small nds-dc-offer-attribute">32GB</span></div>
                                            <div><span class="nds-dc-tile-text-small nds-dc-offer-attribute">64GB</span></div>
                                            <div><span class="nds-dc-tile-text-small nds-dc-offer-attribute">128GB</span>
                                            </div>
                                          </div>
                                        </slot>
                                      </div>
                                    </div>
                                    <div>
                                      <div>
                                        <slot name="dc-offer-list-config-attribute">
                                          <div class="nds-dc-offer-button-set"></div>
                                        </slot>
                                      </div>
                                    </div>
                                  </div>
                                </slot>
                              </c-dc-offer-list-view-attribute>
                            </div>
                          </div>
                        </div>
                        <div class="nds-dc-offer-item-details">
                          <c-dc-offer-list-view-price class="pricelist">
                            <div class="nds-dc-list-prices">
                              <slot name="dc-list-view-price-wrapper">
                                <div class="nds-grid nds-wrap nds-dc-offer-price-wrapper nds-dc-offer-listview">
                                  <div class="nds-size--1-of-2 nds-dc-price-items">
                                    <div class="nds-dc-offer-price"><span class="nds-dc-offer-discount-price">$49</span><span
                                        class="nds-dc-offer-actual-price"><strike
                                          class="nds-dc-offer-base-amount">$49</strike></span></div>
                                  </div>
                                  <div class="nds-size--1-of-2 nds-grid nds-wrap nds-dc-price-items">
                                    <div class="nds-size--2-of-3">
                                      <div class="nds-dc-offer-price"><span
                                          class="nds-dc-offer-discount-price">$699</span><span
                                          class="nds-dc-offer-actual-price"><strike
                                            class="nds-dc-offer-base-amount">$699</strike></span></div>
                                    </div>
                                  </div>
                                </div>
                              </slot>
                            </div>
                          </c-dc-offer-list-view-price>
                        </div>
                      </article>
                    </li>
                  </ul>
                </div>
              </span></div>
            <div data-id="2" class="nds-grid nds-wrap"><span class="nds-size--1-of-1 nds-dc-offer-board">
                <div data-offer-code="iPhoneX" class="nds-dc-offer-item-list">
                  <div class="nds-dc-offer-tag"> - Welcome10</div>
                  <ul class="slds-has-dividers_around-space">
                    <li class="nds-dc-nds-item">
                      <article class="slds-tile slds-tile_board nds-dc-offer-item">
                        <div class="nds-dc-offer-wrapper">
                          <div class="nds-dc-offer-item-values">
                            <div class="nds-dc-image-container">
                              <c-dc-offer-list-view-image>
                                <slot name="dc-offer-image-wrapper">
                                  <div class="nds-dc-offer-image-container"><img
                                      src="https://images-na.ssl-images-amazon.com/images/I/61682XpNGFL._SY879_.jpg"
                                      class="nds-dc-listview"></div>
                                </slot>
                              </c-dc-offer-list-view-image>
                            </div>
                          </div>
                          <div class="nds-grid nds-wrap nds-dc-offer-details">
                            <slot name="dc-offer-title-container">
                              <div class="nds-dc-offer-title-container">
                                <div class="nds-dc-tile-text">Apple</div>
                                <div class="nds-dc-offer-name">iPhone X</div>
                              </div>
                            </slot>
                            <div class="nds-dc-offer-item-config">
                              <c-dc-offer-list-view-attribute>
                                <slot name="dc-list-view-attribute-wrapper">
                                  <div class="nds-dc-offer-attributes">
                                    <div class="nds-dc-tile-text">Available in</div>
                                    <div>
                                      <div>
                                        <slot name="dc-offer-list-config-attribute">
                                          <div class="nds-dc-offer-button-set"></div>
                                        </slot>
                                      </div>
                                    </div>
                                    <div>
                                      <div>
                                        <slot name="dc-offer-list-config-attribute">
                                          <div class="nds-dc-offer-button-set"></div>
                                        </slot>
                                      </div>
                                    </div>
                                    <div>
                                      <div>
                                        <slot name="dc-offer-list-radio-attribute">
                                          <div class="nds-dc-offer-round-button-set"><span class="nds-dc-offer-attribute"
                                              style="background-color: rgb(255, 0, 0);"></span><span
                                              class="nds-dc-offer-attribute"
                                              style="background-color: rgb(212, 175, 55);"></span><span
                                              class="nds-dc-offer-attribute" style="background-color: rgb(0, 0, 0);"></span>
                                          </div>
                                        </slot>
                                      </div>
                                    </div>
                                    <div>
                                      <div>
                                        <slot name="dc-offer-list-config-attribute">
                                          <div class="nds-dc-offer-button-set"></div>
                                        </slot>
                                      </div>
                                    </div>
                                    <div>
                                      <div>
                                        <slot name="dc-offer-list-config-attribute">
                                          <div class="nds-dc-offer-button-set">
                                            <div><span class="nds-dc-tile-text-small nds-dc-offer-attribute">16GB</span></div>
                                            <div><span class="nds-dc-tile-text-small nds-dc-offer-attribute">32GB</span></div>
                                            <div><span class="nds-dc-tile-text-small nds-dc-offer-attribute">64GB</span></div>
                                          </div>
                                        </slot>
                                      </div>
                                    </div>
                                    <div>
                                      <div>
                                        <slot name="dc-offer-list-config-attribute">
                                          <div class="nds-dc-offer-button-set"></div>
                                        </slot>
                                      </div>
                                    </div>
                                  </div>
                                </slot>
                              </c-dc-offer-list-view-attribute>
                            </div>
                          </div>
                        </div>
                        <div class="nds-dc-offer-item-details">
                          <c-dc-offer-list-view-price class="pricelist">
                            <div class="nds-dc-list-prices">
                              <slot name="dc-list-view-price-wrapper">
                                <div class="nds-grid nds-wrap nds-dc-offer-price-wrapper nds-dc-offer-listview">
                                  <div class="nds-size--1-of-2 nds-dc-price-items">
                                    <div class="nds-dc-offer-price"><span class="nds-dc-offer-discount-price">$89</span><span
                                        class="nds-dc-offer-actual-price"><strike
                                          class="nds-dc-offer-base-amount">$89</strike></span></div>
                                  </div>
                                  <div class="nds-size--1-of-2 nds-grid nds-wrap nds-dc-price-items">
                                    <div class="nds-size--2-of-3">
                                      <div class="nds-dc-offer-price"><span
                                          class="nds-dc-offer-discount-price">$910</span><span
                                          class="nds-dc-offer-actual-price"><strike
                                            class="nds-dc-offer-base-amount">$910</strike></span></div>
                                    </div>
                                  </div>
                                </div>
                              </slot>
                            </div>
                          </c-dc-offer-list-view-price>
                        </div>
                      </article>
                    </li>
                  </ul>
                </div>
              </span></div>
          </div>
        </slot>
      </c-dc-offer-list-view>
    `);
  })
  .add("dcMediaViewer", () => {
    return withExample(`
      <c-dc-media-viewer>
        <div class="via-nds">
          <slot name="dc-media-viewer-wrapper">
            <div class="nds-dc-offer_media">
              <div class="nds-dc-media_view-wrapper"><a data-resource-index="-1" data-source-arrow="true"
                  class="nds-dc-carousel-prev nds-dc-carousel-controls">
                  <slot name="dc-left-icon">❮</slot>
                </a>
                <li data-catalog-index="0" class="nds-dc-slide" style="transform: translate3d(0%, 0px, 0px);">
                  <div><img alt="#FF0000" src="https://images-na.ssl-images-amazon.com/images/I/51YXG1bDM5L._SL1024_.jpg">
                  </div>
                </li>
                <li data-catalog-index="1" class="nds-dc-slide" style="transform: translate3d(100%, 0px, 0px);">
                  <div><img alt="#FF0000" src="https://images-na.ssl-images-amazon.com/images/I/61IM1qjdoEL._SY879_.jpg">
                  </div>
                </li>
                <li data-catalog-index="2" class="nds-dc-slide" style="transform: translate3d(200%, 0px, 0px);">
                  <div><img alt="#FF0000" src="https://images-na.ssl-images-amazon.com/images/I/51sChdi5DML._SL1024_.jpg">
                  </div>
                </li>
                <li data-catalog-index="3" class="nds-dc-slide" style="transform: translate3d(300%, 0px, 0px);">
                  <div><img alt="#FF0000" src="https://images-na.ssl-images-amazon.com/images/I/41CITWMluaL._SL1024_.jpg">
                  </div>
                </li><a data-resource-index="1" data-source-arrow="true"
                  class="nds-dc-carousel-next nds-dc-carousel-controls">
                  <slot name="dc-right-icon">❯</slot>
                </a>
              </div>
              <div class="nds-dc-carousel-preview-container"><span data-resource-index="0" data-source-arrow="false"
                  class="nds-dc-media-preview"><img alt="0"
                    src="https://images-na.ssl-images-amazon.com/images/I/51YXG1bDM5L._SL1024_.jpg"
                    class="nds-dc-corousel-img">
                  <div class="nds-dc-media-overlay nds-dc-active-media-overlay"></div>
                </span><span data-resource-index="1" data-source-arrow="false" class="nds-dc-media-preview"><img alt="1"
                    src="https://images-na.ssl-images-amazon.com/images/I/61IM1qjdoEL._SY879_.jpg"
                    class="nds-dc-corousel-img">
                  <div class="nds-dc-media-overlay"></div>
                </span><span data-resource-index="2" data-source-arrow="false" class="nds-dc-media-preview"><img alt="2"
                    src="https://images-na.ssl-images-amazon.com/images/I/51sChdi5DML._SL1024_.jpg"
                    class="nds-dc-corousel-img">
                  <div class="nds-dc-media-overlay"></div>
                </span><span data-resource-index="3" data-source-arrow="false" class="nds-dc-media-preview"><img alt="3"
                    src="https://images-na.ssl-images-amazon.com/images/I/41CITWMluaL._SL1024_.jpg"
                    class="nds-dc-corousel-img">
                  <div class="nds-dc-media-overlay"></div>
                </span></div>
            </div>
          </slot>
        </div>
      </c-dc-media-viewer>
    `);
  })
  .add("dcOfferConfig", () => {
    return withExample(`
      <c-dc-offer-config>
        <div class="via-nds">
          <div class="nds-dc-offer_config">
            <div>
              <slot name="dc-offer-title">
                <div class="nds-dc-offer-config-title-container">
                  <div class="nds-dc-plan-title">iPhone X</div><span class="nds-dc-underline-title"></span>
                </div>
              </slot>
              <slot name="dc-offer-details">
                <div class="nds-dc-offer-config-container">
                  <div class="nds-dc-media-container">
                    <c-dc-media-viewer>
                      <div class="via-nds">
                        <slot name="dc-media-viewer-wrapper">
                          <div class="nds-dc-offer_media">
                            <div class="nds-dc-media_view-wrapper"><a data-resource-index="-1" data-source-arrow="true"
                                class="nds-dc-carousel-prev nds-dc-carousel-controls">
                                <slot name="dc-left-icon">❮</slot>
                              </a>
                              <li data-catalog-index="0" class="nds-dc-slide" style="transform: translate3d(0%, 0px, 0px);">
                                <div><img alt="#FF0000"
                                    src="https://images-na.ssl-images-amazon.com/images/I/51YXG1bDM5L._SL1024_.jpg"></div>
                              </li>
                              <li data-catalog-index="1" class="nds-dc-slide" style="transform: translate3d(100%, 0px, 0px);">
                                <div><img alt="#FF0000"
                                    src="https://images-na.ssl-images-amazon.com/images/I/61IM1qjdoEL._SY879_.jpg"></div>
                              </li>
                              <li data-catalog-index="2" class="nds-dc-slide" style="transform: translate3d(200%, 0px, 0px);">
                                <div><img alt="#FF0000"
                                    src="https://images-na.ssl-images-amazon.com/images/I/51sChdi5DML._SL1024_.jpg"></div>
                              </li>
                              <li data-catalog-index="3" class="nds-dc-slide" style="transform: translate3d(300%, 0px, 0px);">
                                <div><img alt="#FF0000"
                                    src="https://images-na.ssl-images-amazon.com/images/I/41CITWMluaL._SL1024_.jpg"></div>
                              </li><a data-resource-index="1" data-source-arrow="true"
                                class="nds-dc-carousel-next nds-dc-carousel-controls">
                                <slot name="dc-right-icon">❯</slot>
                              </a>
                            </div>
                            <div class="nds-dc-carousel-preview-container"><span data-resource-index="0"
                                data-source-arrow="false" class="nds-dc-media-preview"><img alt="0"
                                  src="https://images-na.ssl-images-amazon.com/images/I/51YXG1bDM5L._SL1024_.jpg"
                                  class="nds-dc-corousel-img">
                                <div class="nds-dc-media-overlay nds-dc-active-media-overlay"></div>
                              </span><span data-resource-index="1" data-source-arrow="false" class="nds-dc-media-preview"><img
                                  alt="1" src="https://images-na.ssl-images-amazon.com/images/I/61IM1qjdoEL._SY879_.jpg"
                                  class="nds-dc-corousel-img">
                                <div class="nds-dc-media-overlay"></div>
                              </span><span data-resource-index="2" data-source-arrow="false" class="nds-dc-media-preview"><img
                                  alt="2" src="https://images-na.ssl-images-amazon.com/images/I/51sChdi5DML._SL1024_.jpg"
                                  class="nds-dc-corousel-img">
                                <div class="nds-dc-media-overlay"></div>
                              </span><span data-resource-index="3" data-source-arrow="false" class="nds-dc-media-preview"><img
                                  alt="3" src="https://images-na.ssl-images-amazon.com/images/I/41CITWMluaL._SL1024_.jpg"
                                  class="nds-dc-corousel-img">
                                <div class="nds-dc-media-overlay"></div>
                              </span></div>
                          </div>
                        </slot>
                      </div>
                    </c-dc-media-viewer>
                  </div>
                  <div class="nds-dc-offer-config-details">
                    <c-dc-offer-config-details>
                      <div class="via-nds">
                        <div class="nds-dc-offer-details">
                          <slot name="dc-offer-title">
                            <h2>iPhone X</h2>
                          </slot>
                          <slot name="dc-offer-details">
                            <div>
                              <div>
                                <c-dc-offer-configurations class="nds-dc-offer-configurations">
                                  <div class="via-nds">
                                    <slot name="dc-offer-configurations-wrapper">
                                      <div class="nds-dc-text-attributes">
                                        <div class="nds-dc-attributes-placeholder">
                                          <div class="nds-dc-offer-text-set nds-dc-addborder"><span
                                              class="nds-dc-offer-text-attribute-label">Battery</span><br>
                                            <div class="nds-dc-spacer"></div><span class="nds-dc-offer-text-attribute-value">
                                              5000mAh </span>
                                          </div>
                                        </div>
                                        <div class="nds-dc-attributes-placeholder">
                                          <div class="nds-dc-offer-text-set nds-dc-addborder"><span
                                              class="nds-dc-offer-text-attribute-label">Camera</span><br>
                                            <div class="nds-dc-spacer"></div><span class="nds-dc-offer-text-attribute-value">
                                              16MP </span>
                                          </div>
                                        </div>
                                        <div class="nds-dc-attributes-placeholder">
                                          <div class="nds-dc-offer-text-set nds-dc-addborder"><span
                                              class="nds-dc-offer-text-attribute-label">Display</span><br>
                                            <div class="nds-dc-spacer"></div><span class="nds-dc-offer-text-attribute-value">
                                              Retina HD Plus </span>
                                          </div>
                                        </div>
                                        <div class="nds-dc-attributes-placeholder">
                                          <div class="nds-dc-offer-text-set nds-dc-addborder"><span
                                              class="nds-dc-offer-text-attribute-label">Processor</span><br>
                                            <div class="nds-dc-spacer"></div><span class="nds-dc-offer-text-attribute-value">
                                              A10 Bionic Chip </span>
                                          </div>
                                        </div>
                                      </div>
                                    </slot>
                                  </div>
                                </c-dc-offer-configurations><span></span><span></span><span>
                                  <c-dc-offer-color-config class="nds-dc-offer-color-config-component">
                                    <div class="via-nds">
                                      <slot name="dc-offer-color-config-wrapper">
                                        <div class="nds-dc-offer-round-button-set nds-dc-color-attribute-container"><span
                                            class="nds-dc-offer-attribute-label">Color :</span><span data-value="#000000"
                                            class="nds-dc-offer-attribute"><span class="nds-dc-offer-color-bg"
                                              style="background-color: rgb(0, 0, 0);"></span>Black</span><span
                                            data-value="#D4AF37" class="nds-dc-offer-attribute"><span
                                              class="nds-dc-offer-color-bg"
                                              style="background-color: rgb(212, 175, 55);"></span>Gold</span><span
                                            data-value="#FF0000" class="nds-dc-offer-attribute nds-dc-active"><span
                                              class="nds-dc-offer-color-bg"
                                              style="background-color: rgb(255, 0, 0);"></span>Red</span></div>
                                      </slot>
                                    </div>
                                  </c-dc-offer-color-config>
                                </span><span></span><span>
                                  <c-dc-offer-attribute-config class="nds-dc-offer-attribute-config">
                                    <div class="via-nds">
                                      <slot name="dc-offer-attribute-wrapper">
                                        <div class="nds-dc-offer-button-set"><span class="nds-dc-offer-attribute-label">Memory
                                            :</span><span data-value="16GB"
                                            class="nds-dc-offer-attribute nds-dc-active">16GB</span><span data-value="32GB"
                                            class="nds-dc-offer-attribute">32GB</span><span data-value="64GB"
                                            class="nds-dc-offer-attribute">64GB</span></div>
                                      </slot>
                                    </div>
                                  </c-dc-offer-attribute-config>
                                </span><span></span>
                              </div>
                            </div>
                            <c-dc-offer-input-config class="nds-dc-offer-input-config">
                              <div class="via-nds">
                                <slot name="dc-offer-config-input-wrapper">
                                  <div class="nds-dc-offer-config-input-field"><span
                                      class="nds-dc-offer-attribute-label">Quantity :</span><input type="number"
                                      placeholder="Enter Quantity" min="1"></div>
                                </slot>
                              </div>
                            </c-dc-offer-input-config>
                            <c-dc-offer-payment-config>
                              <div class="via-nds">
                                <slot name="dc-offer-payment-wrapper">
                                  <div class="nds-dc-offer-payment"><span class="nds-dc-offer-attribute-label">Payment
                                      :</span>
                                    <div class="nds-dc-offer-payment-config">
                                      <div data-payment-type="oneTimeCharge" class="nds-dc-offer-config-payment-plans"><span
                                          class="nds-dc-term-text">oneTimeCharge</span><br><span
                                          class="nds-dc-term-value">$910</span></div>
                                      <div data-payment-type="recurringCharge" class="nds-dc-offer-config-payment-plans"><span
                                          class="nds-dc-term-text">recurringCharge</span><br><span
                                          class="nds-dc-term-value">$89</span></div>
                                    </div>
                                  </div>
                                </slot>
                              </div>
                            </c-dc-offer-payment-config>
                          </slot>
                        </div>
                      </div>
                    </c-dc-offer-config-details>
                  </div>
                </div>
                <div class="nds-dc-offer-group-sections">
                  <c-dc-offer-group-sections dc108dev-dcoffergroupsections_dcoffergroupsections-host="">
                    <div dc108dev-dcoffergroupsections_dcoffergroupsections="" class="via-nds">
                      <slot dc108dev-dcoffergroupsections_dcoffergroupsections="" name="dc-offer-group-sections-wrapper">
                        <div dc108dev-dcoffergroupsections_dcoffergroupsections="" class="nds-dc-offer-group_container">
                          <div dc108dev-dcoffergroupsections_dcoffergroupsections="">
                            <c-dc-offer-group dc108dev-dcoffergroupsections_dcoffergroupsections="">
                              <div class="via-nds">
                                <slot name="dc-offer-group-wrapper">
                                  <div class="nds-dc-offer_group">
                                    <div class="nds-dc-offer_navigation">
                                      <slot name="dc-offer-group-title">
                                        <div>
                                          <div class="nds-dc-plan_title">Protection Plan</div><span
                                            class="nds-dc-underline_title"></span>
                                        </div>
                                      </slot>
                                      <slot name="dc-offer-group-collapse-icons">
                                        <div>
                                          <div id="productCollapseInOut-64" class="nds-dc-product_collapse-in-out"><img
                                              src="/resource/1586875002000/dc108dev__dc_assets/images/collapse.svg"
                                              class="nds-dc-expand_collapse-icons nds-dc-collapse"></div>
                                        </div>
                                      </slot>
                                      <fieldset id="01t6g000000OIQiAAO-64" class="nds-form-element nds-dc-offers_fieldset">
                                        <div class="nds-dc-plan_options nds-dc-plan_options-child-products">
                                          <div class="nds-grid nds-wrap">
                                            <div
                                              class="nds-size--1-of-1 nds-small-size--1-of-1 nds-medium-size--1-of-2 nds-large-size--1-of-3 nds-dc-plan_board nds-dc-group_sections">
                                              <ul>
                                                <c-dc-offer-group-selection class="nds-dc-radio-selection">
                                                  <div class="via-nds">
                                                    <div>
                                                      <slot name="dc-group-selection-radio-wrapper">
                                                        <li class="nds-item nds-dc-nav_type nds-dc-selected">
                                                          <article
                                                            class="nds-tile nds-tile_board nds-dc-tile_board nds-m-top_small">
                                                            <div class="nds-dc-desc_part"><input type="radio"
                                                                name="01t6g000000OIQiAAO"
                                                                id="Premium Mobile Device Protection-65"
                                                                value="01t6g000000OIPzAAO" class="nds-dc-radiobtn"><label
                                                                for="Premium Mobile Device Protection-65"><span
                                                                  title="Premium Mobile Device Protection"
                                                                  class="nds-tile__title nds-truncate nds-dc-plan_name">Premium
                                                                  Mobile Device Protection</span></label>
                                                              <slot name="dc-offer-description">
                                                                <div class="nds-tile__detail nds-dc-plan_item-description">As
                                                                  soon as next-day device replacement for loss, theft, damage
                                                                  &amp; post-warranty defects, expanded cracked screen repair
                                                                  options1; international coverage2 and unlimited access to
                                                                  Tech Coach experts.</div>
                                                              </slot>
                                                            </div>
                                                            <slot name="dc-offer-payment">
                                                              <div
                                                                class="nds-grid nds-dc-plan_item-details nds-dc-single_price">
                                                                <div class="nds-col nds-dc-plan_item-price-section">
                                                                  <span>$99</span>
                                                                  <p class="nds-dc-payment_type">One Time</p>
                                                                </div>
                                                              </div>
                                                            </slot>
                                                          </article>
                                                        </li>
                                                      </slot>
                                                    </div>
                                                  </div>
                                                </c-dc-offer-group-selection>
                                              </ul>
                                            </div>
                                            <div
                                              class="nds-size--1-of-1 nds-small-size--1-of-1 nds-medium-size--1-of-2 nds-large-size--1-of-3 nds-dc-plan_board nds-dc-group_sections">
                                              <ul>
                                                <c-dc-offer-group-selection class="nds-dc-radio-selection">
                                                  <div class="via-nds">
                                                    <div>
                                                      <slot name="dc-group-selection-radio-wrapper">
                                                        <li class="nds-item nds-dc-nav_type">
                                                          <article
                                                            class="nds-tile nds-tile_board nds-dc-tile_board nds-m-top_small">
                                                            <div class="nds-dc-desc_part"><input type="radio"
                                                                name="01t6g000000OIQiAAO" id="Decline Equipment Protection-66"
                                                                value="01t6g000000OIQ7AAO" class="nds-dc-radiobtn"><label
                                                                for="Decline Equipment Protection-66"><span
                                                                  title="Decline Equipment Protection"
                                                                  class="nds-tile__title nds-truncate nds-dc-plan_name">Decline
                                                                  Equipment Protection</span></label>
                                                              <slot name="dc-offer-description">
                                                                <div class="nds-tile__detail nds-dc-plan_item-description">If
                                                                  your device is lost, stolen, damaged or experiences a
                                                                  post-warranty defect, the replacement cost may be as high as
                                                                  the retail prices. You only have 30 days to enroll in
                                                                  coverage after your device activation.</div>
                                                              </slot>
                                                            </div>
                                                            <slot name="dc-offer-payment">
                                                              <div
                                                                class="nds-grid nds-dc-plan_item-details nds-dc-single_price">
                                                                <div class="nds-col nds-dc-plan_item-price-section">
                                                                  <span>--</span>
                                                                  <p class="nds-dc-payment_type">One Time</p>
                                                                </div>
                                                              </div>
                                                            </slot>
                                                          </article>
                                                        </li>
                                                      </slot>
                                                    </div>
                                                  </div>
                                                </c-dc-offer-group-selection>
                                              </ul>
                                            </div>
                                          </div>
                                        </div>
                                      </fieldset>
                                    </div>
                                    <div class="nds-dc-offer_group-separator"></div>
                                  </div>
                                </slot>
                              </div>
                            </c-dc-offer-group>
                          </div>
                        </div>
                      </slot>
                    </div>
                  </c-dc-offer-group-sections>
                </div>
              </slot>
              <div><button class="nds-button nds-button_brand nds-dc-continue-btn">More Add-ons</button></div>
            </div>
          </div>
        </div>
      </c-dc-offer-config>
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
  .add("dcOfferAddons", () => {
    return withExample(`
      <c-dc-offer-addons>
        <div class="via-nds">
          <slot name="dc-offer-addon-wrapper">
            <div class="nds-dc-offer_navigation">
              <div class="nds-dc-offer_navigation-group">
                <c-dc-offer-group>
                  <div class="via-nds">
                    <slot name="dc-offer-group-wrapper">
                      <div class="nds-dc-offer_group">
                        <div class="nds-dc-offer_navigation nds-dc-parent">
                          <slot name="dc-offer-group-title">
                            <div>
                              <div class="nds-dc-plan_title">Select your Mobile Plan</div><span
                                class="nds-dc-underline_title"></span>
                            </div>
                          </slot>
                          <slot name="dc-offer-group-collapse-icons">
                            <div></div>
                          </slot>
                          <fieldset id="01t6g000000OIRMAA4-163" class="nds-form-element nds-dc-offers_fieldset"></fieldset>
                          <div></div>
                        </div>
                      </div>
                    </slot>
                  </div>
                </c-dc-offer-group>
                <div>
                  <c-dc-offer-group>
                    <div class="via-nds">
                      <slot name="dc-offer-group-wrapper">
                        <div class="nds-dc-offer_group">
                          <div class="nds-dc-offer_navigation">
                            <slot name="dc-offer-group-title">
                              <div>
                                <div class="nds-dc-plan_title">Voice Options</div><span class="nds-dc-underline_title"></span>
                              </div>
                            </slot>
                            <slot name="dc-offer-group-collapse-icons">
                              <div>
                                <div id="productCollapseInOut-164" class="nds-dc-product_collapse-in-out"><img
                                    src="/resource/1586875002000/dc108dev__dc_assets/images/collapse.svg"
                                    class="nds-dc-expand_collapse-icons nds-dc-collapse"></div>
                              </div>
                            </slot>
                            <fieldset id="01t6g000000OIQOAA4-164" class="nds-form-element nds-dc-offers_fieldset">
                              <div class="nds-dc-plan_options nds-dc-plan_options-child-products">
                                <div class="nds-grid nds-wrap">
                                  <div
                                    class="nds-size--1-of-1 nds-small-size--1-of-1 nds-medium-size--1-of-2 nds-large-size--1-of-3 nds-dc-plan_board">
                                    <ul>
                                      <c-dc-offer-group-selection class="nds-dc-radio-selection">
                                        <div class="via-nds">
                                          <div>
                                            <slot name="dc-group-selection-radio-wrapper">
                                              <li class="nds-item nds-dc-nav_type nds-dc-selected">
                                                <article class="nds-tile nds-tile_board nds-dc-tile_board nds-m-top_small">
                                                  <div class="nds-dc-desc_part"><input type="radio" name="01t6g000000OIQOAA4"
                                                      id="Up to 150 National Mins-165" value="01t6g000000OIQ4AAO"
                                                      class="nds-dc-radiobtn"><label for="Up to 150 National Mins-165"><span
                                                        title="Up to 150 National Mins"
                                                        class="nds-tile__title nds-truncate nds-dc-plan_name">Up to 150
                                                        National Mins</span></label>
                                                    <slot name="dc-offer-description">
                                                      <div class="nds-tile__detail nds-dc-plan_item-description">Standard
                                                        National calls to landlines and mobiles to selected countries (Charged
                                                        per min).</div>
                                                    </slot>
                                                  </div>
                                                  <slot name="dc-offer-payment">
                                                    <div class="nds-grid nds-dc-plan_item-details nds-dc-single_price">
                                                      <div class="nds-col nds-dc-plan_item-price-section"><span>$39</span>
                                                        <p class="nds-dc-payment_type">One Time</p>
                                                      </div>
                                                    </div>
                                                  </slot>
                                                </article>
                                              </li>
                                            </slot>
                                          </div>
                                        </div>
                                      </c-dc-offer-group-selection>
                                    </ul>
                                  </div>
                                  <div
                                    class="nds-size--1-of-1 nds-small-size--1-of-1 nds-medium-size--1-of-2 nds-large-size--1-of-3 nds-dc-plan_board">
                                    <ul>
                                      <c-dc-offer-group-selection class="nds-dc-radio-selection">
                                        <div class="via-nds">
                                          <div>
                                            <slot name="dc-group-selection-radio-wrapper">
                                              <li class="nds-item nds-dc-nav_type">
                                                <article class="nds-tile nds-tile_board nds-dc-tile_board nds-m-top_small">
                                                  <div class="nds-dc-desc_part"><input type="radio" name="01t6g000000OIQOAA4"
                                                      id="Up to 300 National Mins-166" value="01t6g000000OIQ0AAO"
                                                      class="nds-dc-radiobtn"><label for="Up to 300 National Mins-166"><span
                                                        title="Up to 300 National Mins"
                                                        class="nds-tile__title nds-truncate nds-dc-plan_name">Up to 300
                                                        National Mins</span></label>
                                                    <slot name="dc-offer-description">
                                                      <div class="nds-tile__detail nds-dc-plan_item-description">Standard
                                                        National calls to landlines and mobiles to selected countries (Charged
                                                        per min).</div>
                                                    </slot>
                                                  </div>
                                                  <slot name="dc-offer-payment">
                                                    <div class="nds-grid nds-dc-plan_item-details nds-dc-single_price">
                                                      <div class="nds-col nds-dc-plan_item-price-section"><span>$59</span>
                                                        <p class="nds-dc-payment_type">One Time</p>
                                                      </div>
                                                    </div>
                                                  </slot>
                                                </article>
                                              </li>
                                            </slot>
                                          </div>
                                        </div>
                                      </c-dc-offer-group-selection>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </fieldset>
                          </div>
                          <div class="nds-dc-offer_group-separator"></div>
                        </div>
                      </slot>
                    </div>
                  </c-dc-offer-group>
                </div>
                <div>
                  <c-dc-offer-group>
                    <div class="via-nds">
                      <slot name="dc-offer-group-wrapper">
                        <div class="nds-dc-offer_group">
                          <div class="nds-dc-offer_navigation">
                            <slot name="dc-offer-group-title">
                              <div>
                                <div class="nds-dc-plan_title">Data Options</div><span class="nds-dc-underline_title"></span>
                              </div>
                            </slot>
                            <slot name="dc-offer-group-collapse-icons">
                              <div>
                                <div id="productCollapseInOut-167" class="nds-dc-product_collapse-in-out"><img
                                    src="/resource/1586875002000/dc108dev__dc_assets/images/collapse.svg"
                                    class="nds-dc-expand_collapse-icons nds-dc-collapse"></div>
                              </div>
                            </slot>
                            <fieldset id="01t6g000000OIQsAAO-167" class="nds-form-element nds-dc-offers_fieldset">
                              <div class="nds-dc-plan_options nds-dc-plan_options-child-products">
                                <div class="nds-grid nds-wrap">
                                  <div
                                    class="nds-size--1-of-1 nds-small-size--1-of-1 nds-medium-size--1-of-2 nds-large-size--1-of-3 nds-dc-plan_board">
                                    <ul>
                                      <c-dc-offer-group-selection class="nds-dc-radio-selection">
                                        <div class="via-nds">
                                          <div>
                                            <slot name="dc-group-selection-radio-wrapper">
                                              <li class="nds-item nds-dc-nav_type nds-dc-selected">
                                                <article class="nds-tile nds-tile_board nds-dc-tile_board nds-m-top_small">
                                                  <div class="nds-dc-desc_part"><input type="radio" name="01t6g000000OIQsAAO"
                                                      id="1.5GB/Day Packs-168" value="01t6g000000OIQ3AAO"
                                                      class="nds-dc-radiobtn"><label for="1.5GB/Day Packs-168"><span
                                                        title="1.5GB/Day Packs"
                                                        class="nds-tile__title nds-truncate nds-dc-plan_name">1.5GB/Day
                                                        Packs</span></label>
                                                    <slot name="dc-offer-description">
                                                      <div class="nds-tile__detail nds-dc-plan_item-description">With validity
                                                        90 days and benefits upto 135GB. Unlimited calls and 100 SMS per day
                                                      </div>
                                                    </slot>
                                                  </div>
                                                  <slot name="dc-offer-payment">
                                                    <div class="nds-grid nds-dc-plan_item-details nds-dc-single_price">
                                                      <div class="nds-col nds-dc-plan_item-price-section"><span>$40</span>
                                                        <p class="nds-dc-payment_type">One Time</p>
                                                      </div>
                                                    </div>
                                                  </slot>
                                                </article>
                                              </li>
                                            </slot>
                                          </div>
                                        </div>
                                      </c-dc-offer-group-selection>
                                    </ul>
                                  </div>
                                  <div
                                    class="nds-size--1-of-1 nds-small-size--1-of-1 nds-medium-size--1-of-2 nds-large-size--1-of-3 nds-dc-plan_board">
                                    <ul>
                                      <c-dc-offer-group-selection class="nds-dc-radio-selection">
                                        <div class="via-nds">
                                          <div>
                                            <slot name="dc-group-selection-radio-wrapper">
                                              <li class="nds-item nds-dc-nav_type">
                                                <article class="nds-tile nds-tile_board nds-dc-tile_board nds-m-top_small">
                                                  <div class="nds-dc-desc_part"><input type="radio" name="01t6g000000OIQsAAO"
                                                      id="2GB/Day Packs-169" value="01t6g000000OIQ6AAO"
                                                      class="nds-dc-radiobtn"><label for="2GB/Day Packs-169"><span
                                                        title="2GB/Day Packs"
                                                        class="nds-tile__title nds-truncate nds-dc-plan_name">2GB/Day
                                                        Packs</span></label>
                                                    <slot name="dc-offer-description">
                                                      <div class="nds-tile__detail nds-dc-plan_item-description">With validity
                                                        90 days and benefits upto 182GB. Unlimited calls and 100 SMS per day
                                                      </div>
                                                    </slot>
                                                  </div>
                                                  <slot name="dc-offer-payment">
                                                    <div class="nds-grid nds-dc-plan_item-details nds-dc-single_price">
                                                      <div class="nds-col nds-dc-plan_item-price-section"><span>$60</span>
                                                        <p class="nds-dc-payment_type">One Time</p>
                                                      </div>
                                                    </div>
                                                  </slot>
                                                </article>
                                              </li>
                                            </slot>
                                          </div>
                                        </div>
                                      </c-dc-offer-group-selection>
                                    </ul>
                                  </div>
                                  <div
                                    class="nds-size--1-of-1 nds-small-size--1-of-1 nds-medium-size--1-of-2 nds-large-size--1-of-3 nds-dc-plan_board">
                                    <ul>
                                      <c-dc-offer-group-selection class="nds-dc-radio-selection">
                                        <div class="via-nds">
                                          <div>
                                            <slot name="dc-group-selection-radio-wrapper">
                                              <li class="nds-item nds-dc-nav_type">
                                                <article class="nds-tile nds-tile_board nds-dc-tile_board nds-m-top_small">
                                                  <div class="nds-dc-desc_part"><input type="radio" name="01t6g000000OIQsAAO"
                                                      id="Long Term Packs-170" value="01t6g000000OIQ8AAO"
                                                      class="nds-dc-radiobtn"><label for="Long Term Packs-170"><span
                                                        title="Long Term Packs"
                                                        class="nds-tile__title nds-truncate nds-dc-plan_name">Long Term
                                                        Packs</span></label>
                                                    <slot name="dc-offer-description">
                                                      <div class="nds-tile__detail nds-dc-plan_item-description">Validity 360
                                                        days and benefits upto 750GB. Truly Unlimited voice calls, Unlimited
                                                        SMS. Complimentary subscription to Netflix.</div>
                                                    </slot>
                                                  </div>
                                                  <slot name="dc-offer-payment">
                                                    <div class="nds-grid nds-dc-plan_item-details nds-dc-single_price">
                                                      <div class="nds-col nds-dc-plan_item-price-section"><span>$499</span>
                                                        <p class="nds-dc-payment_type">One Time</p>
                                                      </div>
                                                    </div>
                                                  </slot>
                                                </article>
                                              </li>
                                            </slot>
                                          </div>
                                        </div>
                                      </c-dc-offer-group-selection>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </fieldset>
                          </div>
                          <div class="nds-dc-offer_group-separator"></div>
                        </div>
                      </slot>
                    </div>
                  </c-dc-offer-group>
                </div>
              </div>
            </div>
            <slot name="dc-addons-next-btn"><button
                class="nds-button nds-button_brand nds-align_absolute-center nds-dc-add_to-cart-btn nds-m-top_x-large nds-dc-next-button">More
                Add-ons</button></slot>
          </slot>
        </div>
      </c-dc-offer-addons>
    `);
  })
  .add("dcShoppingCart", () => {
    return withExample(`
      <c-dc-shopping-cart>
        <div class="via-nds">
          <slot name="dc-shopping-cart-wrapper">
            <div class="via-nds">
              <div class="nds-dc-cart">
                <div class="nds-dc-cart_heading"><span class="nds-dc-cart_heading-title">My Cart</span>
                  <div class="nds-dc-cart_heading-notifcation"><span class="nds-badge nds-badge_brand">1</span></div><button
                    class="nds-button nds-dc-button nds-button_brand">Continue Shopping</button>
                    <div class="nds-dc-save-cart_icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path d="M10 21.5c0 .829-.672 1.5-1.5 1.5s-1.5-.671-1.5-1.5c0-.828.672-1.5 1.5-1.5s1.5.672 1.5 1.5zm3.5-1.5c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5c0-.828-.672-1.5-1.5-1.5zm6.305-15l-3.432 12h-10.428l-3.777-9h-2.168l4.615 11h13.239l3.474-12h1.929l.743-2h-4.195zm-13.805-4c6.712 1.617 7 9 7 9h2l-4 4-4-4h2s.94-6.42-3-9z"></path>
                      </svg>
                    </div>
                </div>
                <div class="nds-dc-cart_container"><span class="nds-dc-cart_offer-board">
                    <div class="nds-dc-edit-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512 512" enable-background="new 0 0 512 512" xml:space="preserve">
                        <g>
                          <path fill="#020202" d="M422.953,176.019c0.549-0.48,1.09-0.975,1.612-1.498l21.772-21.772c12.883-12.883,12.883-33.771,0-46.654   l-40.434-40.434c-12.883-12.883-33.771-12.883-46.653,0l-21.772,21.772c-0.523,0.523-1.018,1.064-1.498,1.613L422.953,176.019z"></path>
                          <polygon fill="#020202" points="114.317,397.684 157.317,440.684 106.658,448.342 56,456 63.658,405.341 71.316,354.683  "></polygon>
                          <polygon fill="#020202" points="349.143,125.535 118.982,355.694 106.541,343.253 336.701,113.094 324.26,100.653 81.659,343.253    168.747,430.341 411.348,187.74  "></polygon>
                        </g>
                      </svg>
                    </div>
                    <div class="nds-dc-cart_offer-item-list">
                      <ul class="nds-has-dividers_around-space nds-dc-offer_item-list-ul">
                        <li class="nds-dc-each_offer-container">
                          <c-dc-shopping-offer-details>
                            <div class="via-nds">
                              <slot name="dc-shopping-details-wrapper">
                                <div class="nds-dc-cart_line-item">
                                  <div class="nds-dc-each_item">
                                    <div class="nds-dc-cart_item-category">Devices</div>
                                    <article class="nds-tile nds-tile_board nds-dc-offer_item">
                                      <div class="nds-dc-title_container">
                                        <div class="nds-dc-offer_menu">
                                          <div class="nds-dc-tile_text nds-dc-title"></div>
                                          <div class="nds-dc-tile_text nds-dc-quantity">Quantity</div>
                                          <div class="nds-dc-tile_text nds-dc-due">Due Today</div>
                                          <div class="nds-dc-tile_text nds-dc-due">Due Monthly</div>
                                          <slot name="dc-extra-column-title"></slot>
                                          <div class="nds-dc-tile_text nds-dc-icons"></div>
                                        </div>
                                        <div class="nds-dc-offer_menu nds-dc-offer_details">
                                          <div class="nds-dc-tile_text nds-dc-title">iPhone X</div>
                                          <div class="nds-dc-tile_text nds-dc-quantity"><input type="number" value="1" min="1" name=""
                                              placeholder="DCEnterQuantity"></div>
                                          <div class="nds-dc-tile_text nds-dc-due">$910</div>
                                          <div class="nds-dc-tile_text nds-dc-due">$89</div>
                                          <slot name="dc-extra-column-value"></slot>
                                          <div class="nds-dc-tile_text nds-dc-icons">
                                            <svg class="nds-dc-tile_trash" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" fill="rgb(28, 102, 188);" viewBox="0 0 900.5 900.5" style="enable-background:new 0 0 900.5 900.5; height: .8rem" xml:space="preserve">
                                              <g>
                                                <path d="M176.415,880.5c0,11.046,8.954,20,20,20h507.67c11.046,0,20-8.954,20-20V232.487h-547.67V880.5L176.415,880.5z
                                          M562.75,342.766h75v436.029h-75V342.766z M412.75,342.766h75v436.029h-75V342.766z M262.75,342.766h75v436.029h-75V342.766z"></path>
                                                <path d="M618.825,91.911V20c0-11.046-8.954-20-20-20h-297.15c-11.046,0-20,8.954-20,20v71.911v12.5v12.5H141.874
                                          c-11.046,0-20,8.954-20,20v50.576c0,11.045,8.954,20,20,20h34.541h547.67h34.541c11.046,0,20-8.955,20-20v-50.576
                                          c0-11.046-8.954-20-20-20H618.825v-12.5V91.911z M543.825,112.799h-187.15v-8.389v-12.5V75h187.15v16.911v12.5V112.799z"></path>
                                              </g>
                                            </svg>
                                            <span class="nds-dc-tile_trash-title">Remove</span>
                                          </div>
                                          <div class="nds-dc-edit-icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512 512" enable-background="new 0 0 512 512" xml:space="preserve">
                                              <g>
                                                <path fill="#020202" d="M422.953,176.019c0.549-0.48,1.09-0.975,1.612-1.498l21.772-21.772c12.883-12.883,12.883-33.771,0-46.654   l-40.434-40.434c-12.883-12.883-33.771-12.883-46.653,0l-21.772,21.772c-0.523,0.523-1.018,1.064-1.498,1.613L422.953,176.019z"></path>
                                                <polygon fill="#020202" points="114.317,397.684 157.317,440.684 106.658,448.342 56,456 63.658,405.341 71.316,354.683  "></polygon>
                                                <polygon fill="#020202" points="349.143,125.535 118.982,355.694 106.541,343.253 336.701,113.094 324.26,100.653 81.659,343.253    168.747,430.341 411.348,187.74  "></polygon>
                                              </g>
                                            </svg>
                                          </div>
                                        </div>
                                      </div>
                                    </article>
                                  </div>
                                  <c-modal class="nds-dc-base-modal">
                                    <div class="modal-container" style="display: none;">
                                      <section role="dialog" tabindex="-1" aria-modal="true"
                                        aria-describedby="modal-content-320"
                                        class="slds-modal slds-fade-in-open slds-modal_small">
                                        <div class="slds-modal__container">
                                          <header class="slds-modal__header"><button title="Close"
                                              class="slds-button slds-button_icon slds-modal__close slds-button_icon-inverse">
                                              <c-icon><svg aria-hidden="true"
                                                  class="slds-icon slds-icon-text-inverse slds-icon_small">
                                                  <use
                                                    xlink:href="#httpsdc108devdevedlightningforcecomsldsiconsutilityspritesvgsymbolssvg_close">
                                                  </use>
                                                </svg><span class="slds-assistive-text"></span></c-icon>
                                            </button>
                                            <h2 class="slds-text-heading_medium slds-hyphenate"></h2>
                                            <slot name="header">
                                              <div slot="header">
                                                <h1>Remove Item(s)</h1>
                                              </div>
                                            </slot>
                                          </header>
                                          <div class="slds-modal__content slds-p-around_medium" style="">
                                            <slot name="content">
                                              <div slot="content">
                                                <p>You are about to remove Offer: iPhone X from the cart.</p>
                                                <p>All the related items will be removed at the same time.</p>
                                                <p>Are you sure?</p>
                                              </div>
                                            </slot>
                                          </div>
                                          <footer class="slds-modal__footer">
                                            <slot name="footer">
                                              <div slot="footer">
                                                <c-button><button type="button"
                                                    class="vlocity-btn slds-button slds-button_neutral">Cancel</button>
                                                </c-button>
                                                <c-button><button type="button"
                                                    class="vlocity-btn slds-button slds-button_brand slds-m-left_x-small">Remove
                                                    from Cart</button></c-button>
                                              </div>
                                            </slot>
                                          </footer>
                                        </div>
                                      </section>
                                      <div class="slds-backdrop slds-backdrop_open"></div>
                                    </div>
                                  </c-modal>
                                </div>
                              </slot>
                            </div>
                          </c-dc-shopping-offer-details>
                        </li>
                        <li class="nds-dc-each_offer-container">
                          <c-dc-shopping-nested-offer>
                            <div class="via-nds">
                              <slot name="dc-nested-cart-wrapper">
                                <div data-id="nestedCartOffer" class="nds-dc-each_cart-item-li">
                                  <div>
                                    <div>
                                      <div>
                                        <div>
                                          <c-dc-shopping-offer-details>
                                            <div class="via-nds">
                                              <slot name="dc-shopping-details-wrapper">
                                                <div class="nds-dc-cart_line-item">
                                                  <div class="nds-dc-each_item">
                                                    <div class="nds-dc-cart_item-category">Protection Plan</div>
                                                    <article class="nds-tile nds-tile_board nds-dc-offer_item">
                                                      <div class="nds-dc-title_container">
                                                        <div class="nds-dc-offer_menu">
                                                          <div class="nds-dc-tile_text nds-dc-title"></div>
                                                          <div class="nds-dc-tile_text nds-dc-quantity">Quantity</div>
                                                          <div class="nds-dc-tile_text nds-dc-due">Due Today</div>
                                                          <div class="nds-dc-tile_text nds-dc-due">Due Monthly</div>
                                                          <slot name="dc-extra-column-title"></slot>
                                                          <div class="nds-dc-tile_text nds-dc-icons"></div>
                                                        </div>
                                                        <div class="nds-dc-offer_menu nds-dc-offer_details">
                                                          <div class="nds-dc-tile_text nds-dc-title">Premium Mobile Device
                                                            Protection</div>
                                                          <div class="nds-dc-tile_text nds-dc-quantity"><input type="number"
                                                              min="1" value="1" name="" placeholder="DCEnterQuantity"></div>
                                                          <div class="nds-dc-tile_text nds-dc-due">---</div>
                                                          <div class="nds-dc-tile_text nds-dc-due">---</div>
                                                          <slot name="dc-extra-column-value"></slot>
                                                          <div class="nds-dc-tile_text nds-dc-icons">
                                                              <svg class="nds-dc-tile_trash" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" fill="rgb(28, 102, 188);" viewBox="0 0 900.5 900.5" style="enable-background:new 0 0 900.5 900.5; height: .8rem" xml:space="preserve">
                                                                <g>
                                                                  <path d="M176.415,880.5c0,11.046,8.954,20,20,20h507.67c11.046,0,20-8.954,20-20V232.487h-547.67V880.5L176.415,880.5z
                                                            M562.75,342.766h75v436.029h-75V342.766z M412.75,342.766h75v436.029h-75V342.766z M262.75,342.766h75v436.029h-75V342.766z"></path>
                                                                  <path d="M618.825,91.911V20c0-11.046-8.954-20-20-20h-297.15c-11.046,0-20,8.954-20,20v71.911v12.5v12.5H141.874
                                                            c-11.046,0-20,8.954-20,20v50.576c0,11.045,8.954,20,20,20h34.541h547.67h34.541c11.046,0,20-8.955,20-20v-50.576
                                                            c0-11.046-8.954-20-20-20H618.825v-12.5V91.911z M543.825,112.799h-187.15v-8.389v-12.5V75h187.15v16.911v12.5V112.799z"></path>
                                                                </g>
                                                              </svg>
                                                              <span
                                                              class="nds-dc-tile_trash-title">Remove</span></div>
                                                          <div class="nds-dc-edit-icon">
                                                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512 512" enable-background="new 0 0 512 512" xml:space="preserve">
                                                              <g>
                                                                <path fill="#020202" d="M422.953,176.019c0.549-0.48,1.09-0.975,1.612-1.498l21.772-21.772c12.883-12.883,12.883-33.771,0-46.654   l-40.434-40.434c-12.883-12.883-33.771-12.883-46.653,0l-21.772,21.772c-0.523,0.523-1.018,1.064-1.498,1.613L422.953,176.019z"></path>
                                                                <polygon fill="#020202" points="114.317,397.684 157.317,440.684 106.658,448.342 56,456 63.658,405.341 71.316,354.683  "></polygon>
                                                                <polygon fill="#020202" points="349.143,125.535 118.982,355.694 106.541,343.253 336.701,113.094 324.26,100.653 81.659,343.253    168.747,430.341 411.348,187.74  "></polygon>
                                                              </g>
                                                            </svg>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </article>
                                                  </div>
                                                  <c-modal class="nds-dc-base-modal">
                                                    <div class="modal-container" style="display: none;">
                                                      <section role="dialog" tabindex="-1" aria-modal="true"
                                                        aria-describedby="modal-content-326"
                                                        class="slds-modal slds-fade-in-open slds-modal_small">
                                                        <div class="slds-modal__container">
                                                          <header class="slds-modal__header"><button title="Close"
                                                              class="slds-button slds-button_icon slds-modal__close slds-button_icon-inverse">
                                                              <c-icon><svg aria-hidden="true"
                                                                  class="slds-icon slds-icon-text-inverse slds-icon_small">
                                                                  <use
                                                                    xlink:href="#httpsdc108devdevedlightningforcecomsldsiconsutilityspritesvgsymbolssvg_close">
                                                                  </use>
                                                                </svg><span class="slds-assistive-text"></span></c-icon>
                                                            </button>
                                                            <h2 class="slds-text-heading_medium slds-hyphenate"></h2>
                                                            <slot name="header">
                                                              <div slot="header">
                                                                <h1>Remove Item(s)</h1>
                                                              </div>
                                                            </slot>
                                                          </header>
                                                          <div class="slds-modal__content slds-p-around_medium" style="">
                                                            <slot name="content">
                                                              <div slot="content">
                                                                <p>You are about to remove Offer: Premium Mobile Device
                                                                  Protection from the cart.</p>
                                                                <p>All the related items will be removed at the same time.</p>
                                                                <p>Are you sure?</p>
                                                              </div>
                                                            </slot>
                                                          </div>
                                                          <footer class="slds-modal__footer">
                                                            <slot name="footer">
                                                              <div slot="footer">
                                                                <c-button><button type="button"
                                                                    class="vlocity-btn slds-button slds-button_neutral">Cancel</button>
                                                                </c-button>
                                                                <c-button><button type="button"
                                                                    class="vlocity-btn slds-button slds-button_brand slds-m-left_x-small">Remove
                                                                    from Cart</button></c-button>
                                                              </div>
                                                            </slot>
                                                          </footer>
                                                        </div>
                                                      </section>
                                                      <div class="slds-backdrop slds-backdrop_open"></div>
                                                    </div>
                                                  </c-modal>
                                                </div>
                                              </slot>
                                            </div>
                                          </c-dc-shopping-offer-details>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </slot>
                            </div>
                          </c-dc-shopping-nested-offer>
                        </li>
                        <li class="nds-dc-each_offer-container">
                          <c-dc-shopping-nested-offer>
                            <div class="via-nds">
                              <slot name="dc-nested-cart-wrapper">
                                <div data-id="nestedCartOffer" class="nds-dc-each_cart-item-li noChildren">
                                  <div></div>
                                  <div>
                                    <c-dc-shopping-nested-offer>
                                      <div class="via-nds">
                                        <slot name="dc-nested-cart-wrapper">
                                          <div data-id="nestedCartOffer" class="nds-dc-each_cart-item-li">
                                            <div>
                                              <div>
                                                <div>
                                                  <div>
                                                    <c-dc-shopping-offer-details>
                                                      <div class="via-nds">
                                                        <slot name="dc-shopping-details-wrapper">
                                                          <div class="nds-dc-cart_line-item">
                                                            <div class="nds-dc-each_item">
                                                              <div class="nds-dc-cart_item-category">Select your Mobile Plan
                                                              </div>
                                                              <article class="nds-tile nds-tile_board nds-dc-offer_item">
                                                                <div class="nds-dc-title_container">
                                                                  <div class="nds-dc-offer_menu">
                                                                    <div class="nds-dc-tile_text nds-dc-title"></div>
                                                                    <div class="nds-dc-tile_text nds-dc-quantity">Quantity
                                                                    </div>
                                                                    <div class="nds-dc-tile_text nds-dc-due">Due Today</div>
                                                                    <div class="nds-dc-tile_text nds-dc-due">Due Monthly</div>
                                                                    <slot name="dc-extra-column-title"></slot>
                                                                    <div class="nds-dc-tile_text nds-dc-icons"></div>
                                                                  </div>
                                                                  <div class="nds-dc-offer_menu nds-dc-offer_details">
                                                                    <div class="nds-dc-tile_text nds-dc-title">Up to 150
                                                                      National Mins</div>
                                                                    <div class="nds-dc-tile_text nds-dc-quantity"><input
                                                                        type="number" min="1" value="1" name=""
                                                                        placeholder="DCEnterQuantity"></div>
                                                                    <div class="nds-dc-tile_text nds-dc-due">$39</div>
                                                                    <div class="nds-dc-tile_text nds-dc-due">---</div>
                                                                    <slot name="dc-extra-column-value"></slot>
                                                                    <div class="nds-dc-tile_text nds-dc-icons">
                                                                    <svg class="nds-dc-tile_trash" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" fill="rgb(28, 102, 188);" viewBox="0 0 900.5 900.5" style="enable-background:new 0 0 900.5 900.5; height: .8rem" xml:space="preserve">
                                                                        <g>
                                                                          <path d="M176.415,880.5c0,11.046,8.954,20,20,20h507.67c11.046,0,20-8.954,20-20V232.487h-547.67V880.5L176.415,880.5z
                                                                    M562.75,342.766h75v436.029h-75V342.766z M412.75,342.766h75v436.029h-75V342.766z M262.75,342.766h75v436.029h-75V342.766z"></path>
                                                                          <path d="M618.825,91.911V20c0-11.046-8.954-20-20-20h-297.15c-11.046,0-20,8.954-20,20v71.911v12.5v12.5H141.874
                                                                    c-11.046,0-20,8.954-20,20v50.576c0,11.045,8.954,20,20,20h34.541h547.67h34.541c11.046,0,20-8.955,20-20v-50.576
                                                                    c0-11.046-8.954-20-20-20H618.825v-12.5V91.911z M543.825,112.799h-187.15v-8.389v-12.5V75h187.15v16.911v12.5V112.799z"></path>
                                                                        </g>
                                                                      </svg>
                                                                      <span
                                                                        class="nds-dc-tile_trash-title">Remove</span></div>
                                                                    <div class="nds-dc-edit-icon">
                                                                      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512 512" enable-background="new 0 0 512 512" xml:space="preserve">
                                                                        <g>
                                                                          <path fill="#020202" d="M422.953,176.019c0.549-0.48,1.09-0.975,1.612-1.498l21.772-21.772c12.883-12.883,12.883-33.771,0-46.654   l-40.434-40.434c-12.883-12.883-33.771-12.883-46.653,0l-21.772,21.772c-0.523,0.523-1.018,1.064-1.498,1.613L422.953,176.019z"></path>
                                                                          <polygon fill="#020202" points="114.317,397.684 157.317,440.684 106.658,448.342 56,456 63.658,405.341 71.316,354.683  "></polygon>
                                                                          <polygon fill="#020202" points="349.143,125.535 118.982,355.694 106.541,343.253 336.701,113.094 324.26,100.653 81.659,343.253    168.747,430.341 411.348,187.74  "></polygon>
                                                                        </g>
                                                                      </svg>
                                                                    </div>
                                                                  </div>
                                                                </div>
                                                              </article>
                                                            </div>
                                                            <c-modal class="nds-dc-base-modal">
                                                              <div class="modal-container" style="display: none;">
                                                                <section role="dialog" tabindex="-1" aria-modal="true"
                                                                  aria-describedby="modal-content-333"
                                                                  class="slds-modal slds-fade-in-open slds-modal_small">
                                                                  <div class="slds-modal__container">
                                                                    <header class="slds-modal__header"><button title="Close"
                                                                        class="slds-button slds-button_icon slds-modal__close slds-button_icon-inverse">
                                                                        <c-icon><svg aria-hidden="true"
                                                                            class="slds-icon slds-icon-text-inverse slds-icon_small">
                                                                            <use
                                                                              xlink:href="#httpsdc108devdevedlightningforcecomsldsiconsutilityspritesvgsymbolssvg_close">
                                                                            </use>
                                                                          </svg><span class="slds-assistive-text"></span>
                                                                        </c-icon>
                                                                      </button>
                                                                      <h2 class="slds-text-heading_medium slds-hyphenate">
                                                                      </h2>
                                                                      <slot name="header">
                                                                        <div slot="header">
                                                                          <h1>Remove Item(s)</h1>
                                                                        </div>
                                                                      </slot>
                                                                    </header>
                                                                    <div class="slds-modal__content slds-p-around_medium"
                                                                      style="">
                                                                      <slot name="content">
                                                                        <div slot="content">
                                                                          <p>You are about to remove Offer: Up to 150 National
                                                                            Mins from the cart.</p>
                                                                          <p>All the related items will be removed at the same
                                                                            time.</p>
                                                                          <p>Are you sure?</p>
                                                                        </div>
                                                                      </slot>
                                                                    </div>
                                                                    <footer class="slds-modal__footer">
                                                                      <slot name="footer">
                                                                        <div slot="footer">
                                                                          <c-button><button type="button"
                                                                              class="vlocity-btn slds-button slds-button_neutral">Cancel</button>
                                                                          </c-button>
                                                                          <c-button><button type="button"
                                                                              class="vlocity-btn slds-button slds-button_brand slds-m-left_x-small">Remove
                                                                              from Cart</button></c-button>
                                                                        </div>
                                                                      </slot>
                                                                    </footer>
                                                                  </div>
                                                                </section>
                                                                <div class="slds-backdrop slds-backdrop_open"></div>
                                                              </div>
                                                            </c-modal>
                                                          </div>
                                                        </slot>
                                                      </div>
                                                    </c-dc-shopping-offer-details>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </slot>
                                      </div>
                                    </c-dc-shopping-nested-offer>
                                    <c-dc-shopping-nested-offer>
                                      <div class="via-nds">
                                        <slot name="dc-nested-cart-wrapper">
                                          <div data-id="nestedCartOffer" class="nds-dc-each_cart-item-li">
                                            <div>
                                              <div>
                                                <div>
                                                  <c-dc-shopping-offer-details>
                                                    <div class="via-nds">
                                                      <slot name="dc-shopping-details-wrapper">
                                                        <div class="nds-dc-cart_line-item">
                                                          <div class="nds-dc-each_item nds-dc-line_item">
                                                            <article class="slds-tile slds-tile_board nds-dc-offer_item">
                                                              <div class="nds-dc-title_container">
                                                                <div class="nds-dc-offer_menu nds-dc-offer_details">
                                                                  <div class="nds-dc-tile_text nds-dc-title">1.5GB/Day Packs
                                                                  </div>
                                                                  <div class="nds-dc-tile_text nds-dc-quantity"><input
                                                                      type="number" name="" min="1" value="1"
                                                                      placeholder="DCEnterQuantity"></div>
                                                                  <div class="nds-dc-tile_text nds-dc-due">$40</div>
                                                                  <div class="nds-dc-tile_text nds-dc-due">$5</div>
                                                                  <div class="nds-dc-tile_text nds-dc-icons">
                                                                  <svg class="nds-dc-tile_trash" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" fill="rgb(28, 102, 188);" viewBox="0 0 900.5 900.5" style="enable-background:new 0 0 900.5 900.5; height: .8rem" xml:space="preserve">
                                                                  <g>
                                                                    <path d="M176.415,880.5c0,11.046,8.954,20,20,20h507.67c11.046,0,20-8.954,20-20V232.487h-547.67V880.5L176.415,880.5z
                                                              M562.75,342.766h75v436.029h-75V342.766z M412.75,342.766h75v436.029h-75V342.766z M262.75,342.766h75v436.029h-75V342.766z"></path>
                                                                    <path d="M618.825,91.911V20c0-11.046-8.954-20-20-20h-297.15c-11.046,0-20,8.954-20,20v71.911v12.5v12.5H141.874
                                                              c-11.046,0-20,8.954-20,20v50.576c0,11.045,8.954,20,20,20h34.541h547.67h34.541c11.046,0,20-8.955,20-20v-50.576
                                                              c0-11.046-8.954-20-20-20H618.825v-12.5V91.911z M543.825,112.799h-187.15v-8.389v-12.5V75h187.15v16.911v12.5V112.799z"></path>
                                                                  </g>
                                                                </svg>
                                                                  <span
                                                                      class="nds-dc-tile_trash-title">Remove</span></div>
                                                                  <div class="nds-dc-edit-icon">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512 512" enable-background="new 0 0 512 512" xml:space="preserve">
                                                                      <g>
                                                                        <path fill="#020202" d="M422.953,176.019c0.549-0.48,1.09-0.975,1.612-1.498l21.772-21.772c12.883-12.883,12.883-33.771,0-46.654   l-40.434-40.434c-12.883-12.883-33.771-12.883-46.653,0l-21.772,21.772c-0.523,0.523-1.018,1.064-1.498,1.613L422.953,176.019z"></path>
                                                                        <polygon fill="#020202" points="114.317,397.684 157.317,440.684 106.658,448.342 56,456 63.658,405.341 71.316,354.683  "></polygon>
                                                                        <polygon fill="#020202" points="349.143,125.535 118.982,355.694 106.541,343.253 336.701,113.094 324.26,100.653 81.659,343.253    168.747,430.341 411.348,187.74  "></polygon>
                                                                      </g>
                                                                    </svg>
                                                                  </div>
                                                                </div>
                                                              </div>
                                                            </article>
                                                          </div>
                                                          <c-modal class="nds-dc-base-modal">
                                                            <div class="modal-container" style="display: none;">
                                                              <section role="dialog" tabindex="-1" aria-modal="true"
                                                                aria-describedby="modal-content-339"
                                                                class="slds-modal slds-fade-in-open slds-modal_small">
                                                                <div class="slds-modal__container">
                                                                  <header class="slds-modal__header"><button title="Close"
                                                                      class="slds-button slds-button_icon slds-modal__close slds-button_icon-inverse">
                                                                      <c-icon><svg aria-hidden="true"
                                                                          class="slds-icon slds-icon-text-inverse slds-icon_small">
                                                                          <use
                                                                            xlink:href="#httpsdc108devdevedlightningforcecomsldsiconsutilityspritesvgsymbolssvg_close">
                                                                          </use>
                                                                        </svg><span class="slds-assistive-text"></span>
                                                                      </c-icon>
                                                                    </button>
                                                                    <h2 class="slds-text-heading_medium slds-hyphenate"></h2>
                                                                    <slot name="header">
                                                                      <div slot="header">
                                                                        <h1>Remove Item(s)</h1>
                                                                      </div>
                                                                    </slot>
                                                                  </header>
                                                                  <div class="slds-modal__content slds-p-around_medium"
                                                                    style="">
                                                                    <slot name="content">
                                                                      <div slot="content">
                                                                        <p>You are about to remove Offer: 1.5GB/Day Packs from
                                                                          the cart.</p>
                                                                        <p>All the related items will be removed at the same
                                                                          time.</p>
                                                                        <p>Are you sure?</p>
                                                                      </div>
                                                                    </slot>
                                                                  </div>
                                                                  <footer class="slds-modal__footer">
                                                                    <slot name="footer">
                                                                      <div slot="footer">
                                                                        <c-button><button type="button"
                                                                            class="vlocity-btn slds-button slds-button_neutral">Cancel</button>
                                                                        </c-button>
                                                                        <c-button><button type="button"
                                                                            class="vlocity-btn slds-button slds-button_brand slds-m-left_x-small">Remove
                                                                            from Cart</button></c-button>
                                                                      </div>
                                                                    </slot>
                                                                  </footer>
                                                                </div>
                                                              </section>
                                                              <div class="slds-backdrop slds-backdrop_open"></div>
                                                            </div>
                                                          </c-modal>
                                                        </div>
                                                      </slot>
                                                    </div>
                                                  </c-dc-shopping-offer-details>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </slot>
                                      </div>
                                    </c-dc-shopping-nested-offer>
                                  </div>
                                </div>
                              </slot>
                            </div>
                          </c-dc-shopping-nested-offer>
                        </li>
                        <li class="nds-dc-each_offer-container">
                          <c-dc-shopping-nested-offer>
                            <div class="via-nds">
                              <slot name="dc-nested-cart-wrapper">
                                <div data-id="nestedCartOffer" class="nds-dc-each_cart-item-li noChildren"></div>
                              </slot>
                            </div>
                          </c-dc-shopping-nested-offer>
                        </li>
                        <c-dc-promotion-list>
                          <div class="via-nds">
                            <slot name="dc-promotion-list-wrapper">
                              <div class="nds-dc-promotion_list-component">
                                <div class="nds-dc-promotion_list-heading">Available Promotions</div>
                                <div id="promoList-344" class="nds-dc-promotion_list">
                                  <div class="nds-grid nds-wrap">
                                    <div
                                      class="nds-p-horizontal_small nds-size_1-of-2 nds-medium-size_4-of-6 nds-large-size_10-of-12">
                                      <input type="checkbox" name="iPhoneXOffer" data-id="iPhoneXOffer">
                                      <slot name="dc-promotion-content-wrapper"><label
                                          class="nds-dc-promotion_list-container">
                                          <div class="nds-dc-promotion_list-title">iPhoneXOffer</div>
                                          <div class="nds-dc-promotion_list-description">iPhone X with A10 Bionic chip
                                            processor and 6inch Retina HD display.</div>
                                        </label></slot>
                                    </div>
                                    <div
                                      class="nds-p-horizontal_small nds-size_1-of-2 nds-medium-size_2-of-6 nds-large-size_2-of-12 nds-dc-align_center">
                                      <label for="iPhoneXOffer-344"
                                        class="nds-dc-promotion_list-apply nds-button nds-button_neutral">Apply Promo</label>
                                    </div>
                                  </div>
                                </div>
                                <div id="promoList-344" class="nds-dc-promotion_list">
                                  <div class="nds-grid nds-wrap">
                                    <div
                                      class="nds-p-horizontal_small nds-size_1-of-2 nds-medium-size_4-of-6 nds-large-size_10-of-12">
                                      <input type="checkbox" name="Welcome10" data-id="Welcome10">
                                      <slot name="dc-promotion-content-wrapper"><label
                                          class="nds-dc-promotion_list-container">
                                          <div class="nds-dc-promotion_list-title">Welcome10</div>
                                          <div class="nds-dc-promotion_list-description">iPhone X with A10 Bionic chip
                                            processor and 6inch Retina HD display.</div>
                                        </label></slot>
                                    </div>
                                    <div
                                      class="nds-p-horizontal_small nds-size_1-of-2 nds-medium-size_2-of-6 nds-large-size_2-of-12 nds-dc-align_center">
                                      <label for="Welcome10-344"
                                        class="nds-dc-promotion_list-apply nds-button nds-button_neutral">Apply Promo</label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </slot>
                          </div>
                        </c-dc-promotion-list>
                        <li class="nds-dc-cart_offer-item nds-dc-sub-total">
                          <div class="nds-dc-cart_item-category">Sub-total</div>
                          <article class="nds-tile_board nds-dc-offer_item">
                            <div class="nds-dc-title_container">
                              <div class="nds-dc-cart_offer-menu">
                                <div class="nds-dc-tile_text nds-dc-title"></div>
                                <div class="nds-dc-tile_text nds-dc-quantity"></div>
                                <div class="nds-dc-tile_text nds-dc-due">Due Today</div>
                                <div class="nds-dc-tile_text nds-dc-due">Due Monthly</div>
                                <slot name="dc-sub-total-extra-column-title"></slot>
                                <div class="nds-dc-tile_text nds-dc-icons"></div>
                              </div>
                              <div class="nds-dc-cart_offer-menu nds-dc-sub-total">
                                <div class="nds-dc-tile_text nds-dc-title"></div>
                                <div class="nds-dc-tile_text nds-dc-quantity"></div>
                                <div class="nds-dc-tile_text nds-dc-due">$989</div>
                                <div class="nds-dc-tile_text nds-dc-due">$94</div>
                                <slot name="dc-sub-total-extra-column-value"></slot>
                                <div class="nds-dc-tile_text nds-dc-icons"></div>
                              </div>
                            </div>
                          </article>
                        </li>
                      </ul>
                    </div>
                  </span></div>
                <c-dc-total-bar>
                  <slot name="dc-total-bar-wrapper">
                    <div class="via-nds">
                      <div class="nds-dc-totalbar">
                        <div class="nds-dc-totalbar_price-container">
                          <div class="nds-dc-totalbar_container"><span class="nds-dc-totalbar_label">Due Monthly</span>
                            <div class="nds-dc-totalbar_value">$94</div>
                          </div><span class="nds-dc-totalbar_container nds-dc-totalbar_container-pipe"></span>
                          <div class="nds-dc-totalbar_container nds-text-align_right"><span class="nds-dc-totalbar_label">Due
                              Today</span>
                            <div class="nds-dc-totalbar_value">$989</div>
                          </div>
                          <slot name="dc-extra-price-info"></slot>
                        </div>
                        <slot name="dc-next-button"><button class="nds-button nds-dc-checkout-button">Check Out</button>
                        </slot>
                      </div>
                    </div>
                  </slot>
                </c-dc-total-bar>
                <div></div>
              </div>
            </div>
            <c-modal class="nds-dc-edit-modal">
              <div class="modal-container" style="display: none;">
                <section role="dialog" tabindex="-1" aria-modal="true" aria-describedby="modal-content-227"
                  class="slds-modal slds-fade-in-open slds-modal_small">
                  <div class="slds-modal__container">
                    <header class="slds-modal__header"><button title="Close"
                        class="slds-button slds-button_icon slds-modal__close slds-button_icon-inverse">
                        <c-icon><svg aria-hidden="true" class="slds-icon slds-icon-text-inverse slds-icon_small">
                            <use xlink:href="#httpsdc108devdevedlightningforcecomsldsiconsutilityspritesvgsymbolssvg_close">
                            </use>
                          </svg><span class="slds-assistive-text"></span></c-icon>
                      </button>
                      <h2 class="slds-text-heading_medium slds-hyphenate"></h2>
                      <slot name="header"></slot>
                    </header>
                    <div class="slds-modal__content slds-p-around_medium" style="">
                      <slot name="content">
                        <div slot="content">
                          <div>
                            <c-dc-offer-config-details>
                              <div class="via-nds">
                                <div class="nds-dc-offer-details">
                                  <slot name="dc-offer-title">
                                    <h2>iPhone X</h2>
                                  </slot>
                                  <slot name="dc-offer-details">
                                    <div>
                                      <div>
                                        <c-dc-offer-configurations class="nds-dc-offer-configurations">
                                          <div class="via-nds">
                                            <slot name="dc-offer-configurations-wrapper">
                                              <div class="nds-dc-text-attributes">
                                                <div class="nds-dc-attributes-placeholder">
                                                  <div class="nds-dc-offer-text-set nds-dc-addborder"><span
                                                      class="nds-dc-offer-text-attribute-label">Battery</span><br>
                                                    <div class="nds-dc-spacer"></div><span
                                                      class="nds-dc-offer-text-attribute-value"> 5000mAh </span>
                                                  </div>
                                                </div>
                                                <div class="nds-dc-attributes-placeholder">
                                                  <div class="nds-dc-offer-text-set nds-dc-addborder"><span
                                                      class="nds-dc-offer-text-attribute-label">Camera</span><br>
                                                    <div class="nds-dc-spacer"></div><span
                                                      class="nds-dc-offer-text-attribute-value"> 16MP </span>
                                                  </div>
                                                </div>
                                                <div class="nds-dc-attributes-placeholder">
                                                  <div class="nds-dc-offer-text-set nds-dc-addborder"><span
                                                      class="nds-dc-offer-text-attribute-label">Display</span><br>
                                                    <div class="nds-dc-spacer"></div><span
                                                      class="nds-dc-offer-text-attribute-value"> Retina HD Plus </span>
                                                  </div>
                                                </div>
                                                <div class="nds-dc-attributes-placeholder">
                                                  <div class="nds-dc-offer-text-set nds-dc-addborder"><span
                                                      class="nds-dc-offer-text-attribute-label">Processor</span><br>
                                                    <div class="nds-dc-spacer"></div><span
                                                      class="nds-dc-offer-text-attribute-value"> A10 Bionic Chip </span>
                                                  </div>
                                                </div>
                                              </div>
                                            </slot>
                                          </div>
                                        </c-dc-offer-configurations><span></span><span></span><span>
                                          <c-dc-offer-color-config class="nds-dc-offer-color-config-component">
                                            <div class="via-nds">
                                              <slot name="dc-offer-color-config-wrapper">
                                                <div class="nds-dc-offer-round-button-set nds-dc-color-attribute-container">
                                                  <span class="nds-dc-offer-attribute-label">Color :</span><span
                                                    data-value="#000000" class="nds-dc-offer-attribute"><span
                                                      class="nds-dc-offer-color-bg"
                                                      style="background-color: rgb(0, 0, 0);"></span>Black</span><span
                                                    data-value="#D4AF37" class="nds-dc-offer-attribute"><span
                                                      class="nds-dc-offer-color-bg"
                                                      style="background-color: rgb(212, 175, 55);"></span>Gold</span><span
                                                    data-value="#FF0000" class="nds-dc-offer-attribute nds-dc-active"><span
                                                      class="nds-dc-offer-color-bg"
                                                      style="background-color: rgb(255, 0, 0);"></span>Red</span></div>
                                              </slot>
                                            </div>
                                          </c-dc-offer-color-config>
                                        </span><span></span><span>
                                          <c-dc-offer-attribute-config class="nds-dc-offer-attribute-config">
                                            <div class="via-nds">
                                              <slot name="dc-offer-attribute-wrapper">
                                                <div class="nds-dc-offer-button-set"><span
                                                    class="nds-dc-offer-attribute-label">Memory :</span><span
                                                    data-value="16GB"
                                                    class="nds-dc-offer-attribute nds-dc-active">16GB</span><span
                                                    data-value="32GB" class="nds-dc-offer-attribute">32GB</span><span
                                                    data-value="64GB" class="nds-dc-offer-attribute">64GB</span></div>
                                              </slot>
                                            </div>
                                          </c-dc-offer-attribute-config>
                                        </span><span></span>
                                      </div>
                                    </div>
                                    <c-dc-offer-input-config class="nds-dc-offer-input-config">
                                      <div class="via-nds">
                                        <slot name="dc-offer-config-input-wrapper">
                                          <div class="nds-dc-offer-config-input-field"><span
                                              class="nds-dc-offer-attribute-label">Quantity :</span><input type="number"
                                              placeholder="Enter Quantity" value="1" min="1"></div>
                                        </slot>
                                      </div>
                                    </c-dc-offer-input-config>
                                    <c-dc-offer-payment-config>
                                      <div class="via-nds">
                                        <slot name="dc-offer-payment-wrapper">
                                          <div class="nds-dc-offer-payment"><span class="nds-dc-offer-attribute-label">Payment
                                              :</span>
                                            <div class="nds-dc-offer-payment-config">
                                              <div data-payment-type="oneTimeCharge"
                                                class="nds-dc-offer-config-payment-plans"><span
                                                  class="nds-dc-term-text">oneTimeCharge</span><br><span
                                                  class="nds-dc-term-value">$910</span></div>
                                              <div data-payment-type="recurringCharge"
                                                class="nds-dc-offer-config-payment-plans"><span
                                                  class="nds-dc-term-text">recurringCharge</span><br><span
                                                  class="nds-dc-term-value">$89</span></div>
                                            </div>
                                          </div>
                                        </slot>
                                      </div>
                                    </c-dc-offer-payment-config>
                                  </slot>
                                </div>
                              </div>
                            </c-dc-offer-config-details>
                            <c-dc-offer-group-sections dc108dev-dcoffergroupsections_dcoffergroupsections-host="">
                              <div dc108dev-dcoffergroupsections_dcoffergroupsections="" class="via-nds">
                                <slot dc108dev-dcoffergroupsections_dcoffergroupsections=""
                                  name="dc-offer-group-sections-wrapper">
                                  <div dc108dev-dcoffergroupsections_dcoffergroupsections=""
                                    class="nds-dc-offer-group_container">
                                    <div dc108dev-dcoffergroupsections_dcoffergroupsections="">
                                      <c-dc-offer-group dc108dev-dcoffergroupsections_dcoffergroupsections="">
                                        <div class="via-nds">
                                          <slot name="dc-offer-group-wrapper">
                                            <div class="nds-dc-offer_group">
                                              <div class="nds-dc-offer_navigation">
                                                <slot name="dc-offer-group-title">
                                                  <div>
                                                    <div class="nds-dc-plan_title">Protection Plan</div><span
                                                      class="nds-dc-underline_title"></span>
                                                  </div>
                                                </slot>
                                                <slot name="dc-offer-group-collapse-icons">
                                                  <div>
                                                    <div id="productCollapseInOut-300" class="nds-dc-product_collapse-in-out">
                                                      <img
                                                        src="/resource/1586875002000/dc108dev__dc_assets/images/collapse.svg"
                                                        class="nds-dc-expand_collapse-icons nds-dc-collapse"></div>
                                                  </div>
                                                </slot>
                                                <fieldset id="01t6g000000OIQiAAO-300"
                                                  class="nds-form-element nds-dc-offers_fieldset">
                                                  <div class="nds-dc-plan_options nds-dc-plan_options-child-products">
                                                    <div class="nds-grid nds-wrap">
                                                      <div
                                                        class="nds-size--1-of-1 nds-small-size--1-of-1 nds-medium-size--1-of-2 nds-large-size--1-of-3 nds-dc-plan_board nds-dc-group_sections">
                                                        <ul>
                                                          <c-dc-offer-group-selection class="nds-dc-radio-selection">
                                                            <div class="via-nds">
                                                              <div>
                                                                <slot name="dc-group-selection-radio-wrapper">
                                                                  <li class="nds-item nds-dc-nav_type">
                                                                    <article
                                                                      class="nds-tile nds-tile_board nds-dc-tile_board nds-m-top_small">
                                                                      <div class="nds-dc-desc_part"><input type="radio"
                                                                          name="01t6g000000OIQiAAO"
                                                                          id="Decline Equipment Protection-301"
                                                                          value="01t6g000000OIQ7AAO"
                                                                          class="nds-dc-radiobtn"><label
                                                                          for="Decline Equipment Protection-301"><span
                                                                            title="Decline Equipment Protection"
                                                                            class="nds-tile__title nds-truncate nds-dc-plan_name">Decline
                                                                            Equipment Protection</span></label>
                                                                        <slot name="dc-offer-description">
                                                                          <div
                                                                            class="nds-tile__detail nds-dc-plan_item-description">
                                                                          </div>
                                                                        </slot>
                                                                      </div>
                                                                      <slot name="dc-offer-payment">
                                                                        <div
                                                                          class="nds-grid nds-dc-plan_item-details nds-dc-single_price">
                                                                          <div class="nds-col nds-dc-plan_item-price-section">
                                                                            <span>--</span>
                                                                            <p class="nds-dc-payment_type">One Time</p>
                                                                          </div>
                                                                        </div>
                                                                      </slot>
                                                                    </article>
                                                                  </li>
                                                                </slot>
                                                              </div>
                                                            </div>
                                                          </c-dc-offer-group-selection>
                                                        </ul>
                                                      </div>
                                                      <div
                                                        class="nds-size--1-of-1 nds-small-size--1-of-1 nds-medium-size--1-of-2 nds-large-size--1-of-3 nds-dc-plan_board nds-dc-group_sections">
                                                        <ul>
                                                          <c-dc-offer-group-selection class="nds-dc-radio-selection">
                                                            <div class="via-nds">
                                                              <div>
                                                                <slot name="dc-group-selection-radio-wrapper">
                                                                  <li class="nds-item nds-dc-nav_type nds-dc-selected">
                                                                    <article
                                                                      class="nds-tile nds-tile_board nds-dc-tile_board nds-m-top_small">
                                                                      <div class="nds-dc-desc_part"><input type="radio"
                                                                          name="01t6g000000OIQiAAO"
                                                                          id="Premium Mobile Device Protection-302"
                                                                          value="01t6g000000OIPzAAO"
                                                                          class="nds-dc-radiobtn"><label
                                                                          for="Premium Mobile Device Protection-302"><span
                                                                            title="Premium Mobile Device Protection"
                                                                            class="nds-tile__title nds-truncate nds-dc-plan_name">Premium
                                                                            Mobile Device Protection</span></label>
                                                                        <slot name="dc-offer-description">
                                                                          <div
                                                                            class="nds-tile__detail nds-dc-plan_item-description">
                                                                          </div>
                                                                        </slot>
                                                                      </div>
                                                                      <slot name="dc-offer-payment">
                                                                        <div
                                                                          class="nds-grid nds-dc-plan_item-details nds-dc-single_price">
                                                                          <div class="nds-col nds-dc-plan_item-price-section">
                                                                            <span>--</span>
                                                                            <p class="nds-dc-payment_type">One Time</p>
                                                                          </div>
                                                                        </div>
                                                                      </slot>
                                                                    </article>
                                                                  </li>
                                                                </slot>
                                                              </div>
                                                            </div>
                                                          </c-dc-offer-group-selection>
                                                        </ul>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </fieldset>
                                              </div>
                                              <div class="nds-dc-offer_group-separator"></div>
                                            </div>
                                          </slot>
                                        </div>
                                      </c-dc-offer-group>
                                    </div>
                                    <div dc108dev-dcoffergroupsections_dcoffergroupsections="">
                                      <c-dc-offer-group dc108dev-dcoffergroupsections_dcoffergroupsections="">
                                        <div class="via-nds">
                                          <slot name="dc-offer-group-wrapper">
                                            <div class="nds-dc-offer_group">
                                              <div class="nds-dc-offer_navigation">
                                                <slot name="dc-offer-group-title">
                                                  <div>
                                                    <div class="nds-dc-plan_title">Select your Mobile Plan</div><span
                                                      class="nds-dc-underline_title"></span>
                                                  </div>
                                                </slot>
                                                <slot name="dc-offer-group-collapse-icons">
                                                  <div></div>
                                                </slot>
                                                <fieldset id="01t6g000000OIRMAA4-303"
                                                  class="nds-form-element nds-dc-offers_fieldset"></fieldset>
                                                <div></div>
                                              </div>
                                            </div>
                                          </slot>
                                        </div>
                                      </c-dc-offer-group>
                                      <div dc108dev-dcoffergroupsections_dcoffergroupsections="">
                                        <c-dc-offer-group dc108dev-dcoffergroupsections_dcoffergroupsections="">
                                          <div class="via-nds">
                                            <slot name="dc-offer-group-wrapper">
                                              <div class="nds-dc-offer_group">
                                                <div class="nds-dc-offer_navigation">
                                                  <slot name="dc-offer-group-title">
                                                    <div>
                                                      <div class="nds-dc-plan_title">Voice Options</div><span
                                                        class="nds-dc-underline_title"></span>
                                                    </div>
                                                  </slot>
                                                  <slot name="dc-offer-group-collapse-icons">
                                                    <div>
                                                      <div id="productCollapseInOut-304"
                                                        class="nds-dc-product_collapse-in-out"><img
                                                          src="/resource/1586875002000/dc108dev__dc_assets/images/collapse.svg"
                                                          class="nds-dc-expand_collapse-icons nds-dc-collapse"></div>
                                                    </div>
                                                  </slot>
                                                  <fieldset id="01t6g000000OIQOAA4-304"
                                                    class="nds-form-element nds-dc-offers_fieldset">
                                                    <div class="nds-dc-plan_options nds-dc-plan_options-child-products">
                                                      <div class="nds-grid nds-wrap">
                                                        <div
                                                          class="nds-size--1-of-1 nds-small-size--1-of-1 nds-medium-size--1-of-2 nds-large-size--1-of-3 nds-dc-plan_board nds-dc-group_sections">
                                                          <ul>
                                                            <c-dc-offer-group-selection class="nds-dc-radio-selection">
                                                              <div class="via-nds">
                                                                <div>
                                                                  <slot name="dc-group-selection-radio-wrapper">
                                                                    <li class="nds-item nds-dc-nav_type">
                                                                      <article
                                                                        class="nds-tile nds-tile_board nds-dc-tile_board nds-m-top_small">
                                                                        <div class="nds-dc-desc_part"><input type="radio"
                                                                            name="01t6g000000OIQOAA4"
                                                                            id="Up to 300 National Mins-305"
                                                                            value="01t6g000000OIQ0AAO"
                                                                            class="nds-dc-radiobtn"><label
                                                                            for="Up to 300 National Mins-305"><span
                                                                              title="Up to 300 National Mins"
                                                                              class="nds-tile__title nds-truncate nds-dc-plan_name">Up
                                                                              to 300 National Mins</span></label>
                                                                          <slot name="dc-offer-description">
                                                                            <div
                                                                              class="nds-tile__detail nds-dc-plan_item-description">
                                                                            </div>
                                                                          </slot>
                                                                        </div>
                                                                        <slot name="dc-offer-payment">
                                                                          <div
                                                                            class="nds-grid nds-dc-plan_item-details nds-dc-single_price">
                                                                            <div
                                                                              class="nds-col nds-dc-plan_item-price-section">
                                                                              <span>--</span>
                                                                              <p class="nds-dc-payment_type">One Time</p>
                                                                            </div>
                                                                          </div>
                                                                        </slot>
                                                                      </article>
                                                                    </li>
                                                                  </slot>
                                                                </div>
                                                              </div>
                                                            </c-dc-offer-group-selection>
                                                          </ul>
                                                        </div>
                                                        <div
                                                          class="nds-size--1-of-1 nds-small-size--1-of-1 nds-medium-size--1-of-2 nds-large-size--1-of-3 nds-dc-plan_board nds-dc-group_sections">
                                                          <ul>
                                                            <c-dc-offer-group-selection class="nds-dc-radio-selection">
                                                              <div class="via-nds">
                                                                <div>
                                                                  <slot name="dc-group-selection-radio-wrapper">
                                                                    <li class="nds-item nds-dc-nav_type nds-dc-selected">
                                                                      <article
                                                                        class="nds-tile nds-tile_board nds-dc-tile_board nds-m-top_small">
                                                                        <div class="nds-dc-desc_part"><input type="radio"
                                                                            name="01t6g000000OIQOAA4"
                                                                            id="Up to 150 National Mins-306"
                                                                            value="01t6g000000OIQ4AAO"
                                                                            class="nds-dc-radiobtn"><label
                                                                            for="Up to 150 National Mins-306"><span
                                                                              title="Up to 150 National Mins"
                                                                              class="nds-tile__title nds-truncate nds-dc-plan_name">Up
                                                                              to 150 National Mins</span></label>
                                                                          <slot name="dc-offer-description">
                                                                            <div
                                                                              class="nds-tile__detail nds-dc-plan_item-description">
                                                                            </div>
                                                                          </slot>
                                                                        </div>
                                                                        <slot name="dc-offer-payment">
                                                                          <div
                                                                            class="nds-grid nds-dc-plan_item-details nds-dc-single_price">
                                                                            <div
                                                                              class="nds-col nds-dc-plan_item-price-section">
                                                                              <span>$39</span>
                                                                              <p class="nds-dc-payment_type">One Time</p>
                                                                            </div>
                                                                          </div>
                                                                        </slot>
                                                                      </article>
                                                                    </li>
                                                                  </slot>
                                                                </div>
                                                              </div>
                                                            </c-dc-offer-group-selection>
                                                          </ul>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </fieldset>
                                                </div>
                                                <div class="nds-dc-offer_group-separator"></div>
                                              </div>
                                            </slot>
                                          </div>
                                        </c-dc-offer-group>
                                      </div>
                                      <div dc108dev-dcoffergroupsections_dcoffergroupsections="">
                                        <c-dc-offer-group dc108dev-dcoffergroupsections_dcoffergroupsections="">
                                          <div class="via-nds">
                                            <slot name="dc-offer-group-wrapper">
                                              <div class="nds-dc-offer_group">
                                                <div class="nds-dc-offer_navigation">
                                                  <slot name="dc-offer-group-title">
                                                    <div>
                                                      <div class="nds-dc-plan_title">Data Options</div><span
                                                        class="nds-dc-underline_title"></span>
                                                    </div>
                                                  </slot>
                                                  <slot name="dc-offer-group-collapse-icons">
                                                    <div>
                                                      <div id="productCollapseInOut-307"
                                                        class="nds-dc-product_collapse-in-out"><img
                                                          src="/resource/1586875002000/dc108dev__dc_assets/images/collapse.svg"
                                                          class="nds-dc-expand_collapse-icons nds-dc-collapse"></div>
                                                    </div>
                                                  </slot>
                                                  <fieldset id="01t6g000000OIQsAAO-307"
                                                    class="nds-form-element nds-dc-offers_fieldset">
                                                    <div class="nds-dc-plan_options nds-dc-plan_options-child-products">
                                                      <div class="nds-grid nds-wrap">
                                                        <div
                                                          class="nds-size--1-of-1 nds-small-size--1-of-1 nds-medium-size--1-of-2 nds-large-size--1-of-3 nds-dc-plan_board nds-dc-group_sections">
                                                          <ul>
                                                            <c-dc-offer-group-selection class="nds-dc-radio-selection">
                                                              <div class="via-nds">
                                                                <div>
                                                                  <slot name="dc-group-selection-radio-wrapper">
                                                                    <li class="nds-item nds-dc-nav_type">
                                                                      <article
                                                                        class="nds-tile nds-tile_board nds-dc-tile_board nds-m-top_small">
                                                                        <div class="nds-dc-desc_part"><input type="radio"
                                                                            name="01t6g000000OIQsAAO" id="2GB/Day Packs-308"
                                                                            value="01t6g000000OIQ6AAO"
                                                                            class="nds-dc-radiobtn"><label
                                                                            for="2GB/Day Packs-308"><span
                                                                              title="2GB/Day Packs"
                                                                              class="nds-tile__title nds-truncate nds-dc-plan_name">2GB/Day
                                                                              Packs</span></label>
                                                                          <slot name="dc-offer-description">
                                                                            <div
                                                                              class="nds-tile__detail nds-dc-plan_item-description">
                                                                            </div>
                                                                          </slot>
                                                                        </div>
                                                                        <slot name="dc-offer-payment">
                                                                          <div
                                                                            class="nds-grid nds-dc-plan_item-details nds-dc-single_price">
                                                                            <div
                                                                              class="nds-col nds-dc-plan_item-price-section">
                                                                              <span>--</span>
                                                                              <p class="nds-dc-payment_type">One Time</p>
                                                                            </div>
                                                                          </div>
                                                                        </slot>
                                                                      </article>
                                                                    </li>
                                                                  </slot>
                                                                </div>
                                                              </div>
                                                            </c-dc-offer-group-selection>
                                                          </ul>
                                                        </div>
                                                        <div
                                                          class="nds-size--1-of-1 nds-small-size--1-of-1 nds-medium-size--1-of-2 nds-large-size--1-of-3 nds-dc-plan_board nds-dc-group_sections">
                                                          <ul>
                                                            <c-dc-offer-group-selection class="nds-dc-radio-selection">
                                                              <div class="via-nds">
                                                                <div>
                                                                  <slot name="dc-group-selection-radio-wrapper">
                                                                    <li class="nds-item nds-dc-nav_type">
                                                                      <article
                                                                        class="nds-tile nds-tile_board nds-dc-tile_board nds-m-top_small">
                                                                        <div class="nds-dc-desc_part"><input type="radio"
                                                                            name="01t6g000000OIQsAAO" id="Long Term Packs-309"
                                                                            value="01t6g000000OIQ8AAO"
                                                                            class="nds-dc-radiobtn"><label
                                                                            for="Long Term Packs-309"><span
                                                                              title="Long Term Packs"
                                                                              class="nds-tile__title nds-truncate nds-dc-plan_name">Long
                                                                              Term Packs</span></label>
                                                                          <slot name="dc-offer-description">
                                                                            <div
                                                                              class="nds-tile__detail nds-dc-plan_item-description">
                                                                            </div>
                                                                          </slot>
                                                                        </div>
                                                                        <slot name="dc-offer-payment">
                                                                          <div
                                                                            class="nds-grid nds-dc-plan_item-details nds-dc-single_price">
                                                                            <div
                                                                              class="nds-col nds-dc-plan_item-price-section">
                                                                              <span>--</span>
                                                                              <p class="nds-dc-payment_type">One Time</p>
                                                                            </div>
                                                                          </div>
                                                                        </slot>
                                                                      </article>
                                                                    </li>
                                                                  </slot>
                                                                </div>
                                                              </div>
                                                            </c-dc-offer-group-selection>
                                                          </ul>
                                                        </div>
                                                        <div
                                                          class="nds-size--1-of-1 nds-small-size--1-of-1 nds-medium-size--1-of-2 nds-large-size--1-of-3 nds-dc-plan_board nds-dc-group_sections">
                                                          <ul>
                                                            <c-dc-offer-group-selection class="nds-dc-radio-selection">
                                                              <div class="via-nds">
                                                                <div>
                                                                  <slot name="dc-group-selection-radio-wrapper">
                                                                    <li class="nds-item nds-dc-nav_type nds-dc-selected">
                                                                      <article
                                                                        class="nds-tile nds-tile_board nds-dc-tile_board nds-m-top_small">
                                                                        <div class="nds-dc-desc_part"><input type="radio"
                                                                            name="01t6g000000OIQsAAO" id="1.5GB/Day Packs-310"
                                                                            value="01t6g000000OIQ3AAO"
                                                                            class="nds-dc-radiobtn"><label
                                                                            for="1.5GB/Day Packs-310"><span
                                                                              title="1.5GB/Day Packs"
                                                                              class="nds-tile__title nds-truncate nds-dc-plan_name">1.5GB/Day
                                                                              Packs</span></label>
                                                                          <slot name="dc-offer-description">
                                                                            <div
                                                                              class="nds-tile__detail nds-dc-plan_item-description">
                                                                            </div>
                                                                          </slot>
                                                                        </div>
                                                                        <slot name="dc-offer-payment">
                                                                          <div
                                                                            class="nds-grid nds-dc-plan_item-details nds-dc-single_price">
                                                                            <div
                                                                              class="nds-col nds-dc-plan_item-price-section">
                                                                              <span>$40</span>
                                                                              <p class="nds-dc-payment_type">One Time</p>
                                                                            </div>
                                                                          </div>
                                                                        </slot>
                                                                      </article>
                                                                    </li>
                                                                  </slot>
                                                                </div>
                                                              </div>
                                                            </c-dc-offer-group-selection>
                                                          </ul>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </fieldset>
                                                </div>
                                                <div class="nds-dc-offer_group-separator"></div>
                                              </div>
                                            </slot>
                                          </div>
                                        </c-dc-offer-group>
                                      </div>
                                    </div>
                                    <div dc108dev-dcoffergroupsections_dcoffergroupsections="">
                                      <c-dc-offer-group dc108dev-dcoffergroupsections_dcoffergroupsections="">
                                        <div class="via-nds">
                                          <slot name="dc-offer-group-wrapper">
                                            <div class="nds-dc-offer_group">
                                              <div class="nds-dc-offer_navigation">
                                                <slot name="dc-offer-group-title">
                                                  <div>
                                                    <div class="nds-dc-plan_title">Accessories</div><span
                                                      class="nds-dc-underline_title"></span>
                                                  </div>
                                                </slot>
                                                <slot name="dc-offer-group-collapse-icons">
                                                  <div>
                                                    <div id="productCollapseInOut-311" class="nds-dc-product_collapse-in-out">
                                                      <img
                                                        src="/resource/1586875002000/dc108dev__dc_assets/images/collapse.svg"
                                                        class="nds-dc-expand_collapse-icons nds-dc-collapse"></div>
                                                  </div>
                                                </slot>
                                                <fieldset id="01t6g000000OIQYAA4-311"
                                                  class="nds-form-element nds-dc-offers_fieldset">
                                                  <div class="nds-dc-plan_options nds-dc-plan_options-child-products">
                                                    <div class="nds-grid nds-wrap">
                                                      <div
                                                        class="nds-size--1-of-1 nds-small-size--1-of-1 nds-medium-size--1-of-2 nds-large-size--1-of-3 nds-dc-plan_board nds-dc-group_sections">
                                                        <ul>
                                                          <c-dc-offer-group-selection class="nds-dc-checkbox-selection">
                                                            <div class="via-nds">
                                                              <div>
                                                                <slot name="dc-group-selection-checkbox-wrapper">
                                                                  <li class="nds-item nds-dc-nav_type nds-dc-checkbox">
                                                                    <article class="nds-tile nds-tile_board nds-m-top_small">
                                                                      <div class="nds-dc-desc_part"><label
                                                                          for="Beats by Dr. Dre - urBeats Earbud Headphones-315"><span
                                                                            title="Beats by Dr. Dre - urBeats Earbud Headphones"
                                                                            class="nds-tile__title nds-truncate nds-dc-plan_name">Beats
                                                                            by Dr. Dre - urBeats Earbud
                                                                            Headphones</span></label>
                                                                        <slot name="dc-offer-description">
                                                                          <div
                                                                            class="nds-tile__detail nds-dc-plan_item-description">
                                                                          </div>
                                                                        </slot>
                                                                      </div>
                                                                      <slot name="dc-offer-payment">
                                                                        <div
                                                                          class="nds-grid nds-dc-plan_item-details nds-dc-single_price-quantity">
                                                                          <div class="nds-dc-quantity">
                                                                            <div class="nds-dc-quantity_label">Quantity</div>
                                                                            <input type="number" min="0" name=""
                                                                              placeholder="Quantity"
                                                                              class="nds-dc-quantity_input">
                                                                          </div>
                                                                          <div
                                                                            class="nds-col nds-dc-plan_item-price-section nds-dc-checkbox_price">
                                                                            $<p class="nds-dc-payment_type">One Time</p>
                                                                          </div>
                                                                        </div>
                                                                      </slot>
                                                                    </article>
                                                                  </li>
                                                                </slot>
                                                              </div>
                                                            </div>
                                                          </c-dc-offer-group-selection>
                                                        </ul>
                                                      </div>
                                                      <div
                                                        class="nds-size--1-of-1 nds-small-size--1-of-1 nds-medium-size--1-of-2 nds-large-size--1-of-3 nds-dc-plan_board nds-dc-group_sections">
                                                        <ul>
                                                          <c-dc-offer-group-selection class="nds-dc-checkbox-selection">
                                                            <div class="via-nds">
                                                              <div>
                                                                <slot name="dc-group-selection-checkbox-wrapper">
                                                                  <li class="nds-item nds-dc-nav_type nds-dc-checkbox">
                                                                    <article class="nds-tile nds-tile_board nds-m-top_small">
                                                                      <div class="nds-dc-desc_part"><label
                                                                          for="OtterBox - Symmetry series case for iPhone X-316"><span
                                                                            title="OtterBox - Symmetry series case for iPhone X"
                                                                            class="nds-tile__title nds-truncate nds-dc-plan_name">OtterBox
                                                                            - Symmetry series case for iPhone X</span></label>
                                                                        <slot name="dc-offer-description">
                                                                          <div
                                                                            class="nds-tile__detail nds-dc-plan_item-description">
                                                                          </div>
                                                                        </slot>
                                                                      </div>
                                                                      <slot name="dc-offer-payment">
                                                                        <div
                                                                          class="nds-grid nds-dc-plan_item-details nds-dc-single_price-quantity">
                                                                          <div class="nds-dc-quantity">
                                                                            <div class="nds-dc-quantity_label">Quantity</div>
                                                                            <input type="number" min="0" name=""
                                                                              placeholder="Quantity"
                                                                              class="nds-dc-quantity_input">
                                                                          </div>
                                                                          <div
                                                                            class="nds-col nds-dc-plan_item-price-section nds-dc-checkbox_price">
                                                                            $<p class="nds-dc-payment_type">One Time</p>
                                                                          </div>
                                                                        </div>
                                                                      </slot>
                                                                    </article>
                                                                  </li>
                                                                </slot>
                                                              </div>
                                                            </div>
                                                          </c-dc-offer-group-selection>
                                                        </ul>
                                                      </div>
                                                      <div
                                                        class="nds-size--1-of-1 nds-small-size--1-of-1 nds-medium-size--1-of-2 nds-large-size--1-of-3 nds-dc-plan_board nds-dc-group_sections">
                                                        <ul>
                                                          <c-dc-offer-group-selection class="nds-dc-checkbox-selection">
                                                            <div class="via-nds">
                                                              <div>
                                                                <slot name="dc-group-selection-checkbox-wrapper">
                                                                  <li class="nds-item nds-dc-nav_type nds-dc-checkbox">
                                                                    <article class="nds-tile nds-tile_board nds-m-top_small">
                                                                      <div class="nds-dc-desc_part"><label
                                                                          for="Apple AirPods with Charging Case (Latest Model)-317"><span
                                                                            title="Apple AirPods with Charging Case (Latest Model)"
                                                                            class="nds-tile__title nds-truncate nds-dc-plan_name">Apple
                                                                            AirPods with Charging Case (Latest
                                                                            Model)</span></label>
                                                                        <slot name="dc-offer-description">
                                                                          <div
                                                                            class="nds-tile__detail nds-dc-plan_item-description">
                                                                          </div>
                                                                        </slot>
                                                                      </div>
                                                                      <slot name="dc-offer-payment">
                                                                        <div
                                                                          class="nds-grid nds-dc-plan_item-details nds-dc-single_price-quantity">
                                                                          <div class="nds-dc-quantity">
                                                                            <div class="nds-dc-quantity_label">Quantity</div>
                                                                            <input type="number" min="0" name=""
                                                                              placeholder="Quantity"
                                                                              class="nds-dc-quantity_input">
                                                                          </div>
                                                                          <div
                                                                            class="nds-col nds-dc-plan_item-price-section nds-dc-checkbox_price">
                                                                            $<p class="nds-dc-payment_type">One Time</p>
                                                                          </div>
                                                                        </div>
                                                                      </slot>
                                                                    </article>
                                                                  </li>
                                                                </slot>
                                                              </div>
                                                            </div>
                                                          </c-dc-offer-group-selection>
                                                        </ul>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </fieldset>
                                              </div>
                                              <div class="nds-dc-offer_group-separator"></div>
                                            </div>
                                          </slot>
                                        </div>
                                      </c-dc-offer-group>
                                    </div>
                                  </div>
                                </slot>
                              </div>
                            </c-dc-offer-group-sections>
                          </div>
                        </div>
                      </slot>
                    </div>
                    <footer class="slds-modal__footer">
                      <slot name="footer"></slot>
                    </footer>
                  </div>
                </section>
                <div class="slds-backdrop slds-backdrop_open"></div>
              </div>
            </c-modal>
            <c-modal class="nds-dc-save-cart-modal">
              <div class="modal-container" style="display: none;">
                <section role="dialog" tabindex="-1" aria-modal="true" aria-describedby="modal-content-229"
                  class="slds-modal slds-fade-in-open slds-modal_small">
                  <div class="slds-modal__container">
                    <header class="slds-modal__header slds-modal__header_empty"><button title="Close"
                        class="slds-button slds-button_icon slds-modal__close slds-button_icon-inverse">
                        <c-icon><svg aria-hidden="true" class="slds-icon slds-icon-text-inverse slds-icon_small">
                            <use xlink:href="#httpsdc108devdevedlightningforcecomsldsiconsutilityspritesvgsymbolssvg_close">
                            </use>
                          </svg><span class="slds-assistive-text"></span></c-icon>
                      </button></header>
                    <div class="slds-modal__content slds-p-around_medium" style="">
                      <slot name="content">
                        <div slot="content">
                          <c-dc-sign-in>
                            <div class="via-nds">
                              <div class="nds-dc-sign-in">
                                <div class="nds-step_label nds-dc-step_label">Personal Info</div>
                                <slot name="dc-login-radio-toggle">
                                  <fieldset class="nds-form-element">
                                    <div class="nds-form-element__control"><span class="nds-radio"><input type="radio"
                                          data-id="sign-up" id="sign-up-231" name="options" value="true"><label
                                          for="sign-up-231" class="nds-radio__label"><span
                                            class="nds-radio_faux nds-dc-radio_faux"></span><span
                                            class="nds-form-element__label">New Customer</span></label></span><span
                                        class="nds-radio"><input type="radio" data-id="sign-in" id="sign-in-231"
                                          name="options" value="false"><label for="sign-in-231" class="nds-radio__label"><span
                                            class="nds-radio_faux nds-dc-radio_faux"></span><span
                                            class="nds-form-element__label">Existing customer sign in</span></label></span>
                                    </div>
                                  </fieldset>
                                </slot>
                                <slot name="dc-sign-up"></slot>
                                <slot name="dc-sign-in">
                                  <fieldset class="nds-form nds-form_compound">
                                    <div class="nds-form-element__label nds-dc-form_label">Login Info</div>
                                    <div
                                      class="nds-form-element__control nds-form-element__control-animated-label nds-dc-form-element_row nds-dc-form-element">
                                      <input type="text" id="signin-email-231" data-id="email" required=""
                                        class="nds-input nds-has-value signin-email"><label for="signin-email-231"
                                        class="nds-form-element__label"><abbr title="required"
                                          class="nds-required">*</abbr>Email</label></div>
                                    <div
                                      class="nds-form-element__control nds-form-element__control-animated-label nds-dc-form-element_row nds-dc-form-element nds-p-left_none">
                                      <input type="password" id="signin-pwd-231" data-id="password" required=""
                                        class="nds-input nds-has-value"><label for="signin-pwd-231"
                                        class="nds-form-element__label"><abbr title="required"
                                          class="nds-required">*</abbr>Password</label></div>
                                  </fieldset>
                                </slot>
                              </div>
                            </div>
                          </c-dc-sign-in>
                        </div>
                      </slot>
                    </div>
                    <footer class="slds-modal__footer">
                      <slot name="footer">
                        <div slot="footer"><button class="nds-button nds-dc-button nds-button_brand">Next</button></div>
                      </slot>
                    </footer>
                  </div>
                </section>
                <div class="slds-backdrop slds-backdrop_open"></div>
              </div>
            </c-modal><a
              href="/lwc/s/checkout?params=catalogCode/Phones/cartContextKey/7740d448a66b9b70ad37021656ef81bd/dueTotal/989/dueMonthly/94/total/989/saveCart/no"
              data-id="nds-dc-checkout-router"></a><a
              href="/lwc/s/checkout?params=catalogCode/Phones/cartContextKey/7740d448a66b9b70ad37021656ef81bd/dueTotal/989/dueMonthly/94/total/989/saveCart/yes"
              data-id="nds-dc-savecart-router"></a>
          </slot>
        </div>
      </c-dc-shopping-cart>
    `);
  })
  .add("dcPromotionList", ()=>{
    return withExample(`
      <c-dc-promotion-list>
        <div class="via-nds">
          <slot name="dc-promotion-list-wrapper">
            <div class="nds-dc-promotion_list-component">
              <div class="nds-dc-promotion_list-heading">Available Promotions</div>
              <div id="promoList-121" class="nds-dc-promotion_list">
                <div class="nds-grid nds-wrap">
                  <div class="nds-p-horizontal_small nds-size_1-of-2 nds-medium-size_4-of-6 nds-large-size_10-of-12"><input
                      type="checkbox" name="iPhoneXOffer" data-id="iPhoneXOffer">
                    <slot name="dc-promotion-content-wrapper"><label class="nds-dc-promotion_list-container">
                        <div class="nds-dc-promotion_list-title">iPhoneXOffer</div>
                        <div class="nds-dc-promotion_list-description">iPhone X with A10 Bionic chip processor and 6inch
                          Retina HD display.</div>
                      </label></slot>
                  </div>
                  <div
                    class="nds-p-horizontal_small nds-size_1-of-2 nds-medium-size_2-of-6 nds-large-size_2-of-12 nds-dc-align_center">
                    <label for="iPhoneXOffer-121" class="nds-dc-promotion_list-apply nds-button nds-button_neutral">Apply
                      Promo</label></div>
                </div>
              </div>
              <div id="promoList-121" class="nds-dc-promotion_list">
                <div class="nds-grid nds-wrap">
                  <div class="nds-p-horizontal_small nds-size_1-of-2 nds-medium-size_4-of-6 nds-large-size_10-of-12"><input
                      type="checkbox" name="Welcome10" data-id="Welcome10">
                    <slot name="dc-promotion-content-wrapper"><label class="nds-dc-promotion_list-container">
                        <div class="nds-dc-promotion_list-title">Welcome10</div>
                        <div class="nds-dc-promotion_list-description">iPhone X with A10 Bionic chip processor and 6inch
                          Retina HD display.</div>
                      </label></slot>
                  </div>
                  <div
                    class="nds-p-horizontal_small nds-size_1-of-2 nds-medium-size_2-of-6 nds-large-size_2-of-12 nds-dc-align_center">
                    <label for="Welcome10-121" class="nds-dc-promotion_list-apply nds-button nds-button_neutral">Apply
                      Promo</label></div>
                </div>
              </div>
            </div>
          </slot>
        </div>
      </c-dc-promotion-list>
    `);
  })
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
  .add("dcCheckOut-Sign-in", () => {
    return withExample(`
      <c-dc-sign-in>
        <div class="via-nds">
          <div class="nds-dc-sign-in">
            <div class="nds-step_label nds-dc-step_label">Personal Info</div>
            <slot name="dc-login-radio-toggle">
              <fieldset class="nds-form-element">
                <div class="nds-form-element__control"><span class="nds-radio"><input type="radio" data-id="sign-up"
                      id="sign-up-128" name="options" value="true"><label for="sign-up-128" class="nds-radio__label"><span
                        class="nds-radio_faux nds-dc-radio_faux"></span><span class="nds-form-element__label">New
                        Customer</span></label></span><span class="nds-radio"><input type="radio" data-id="sign-in"
                      id="sign-in-128" name="options" value="false"><label for="sign-in-128" class="nds-radio__label"><span
                        class="nds-radio_faux nds-dc-radio_faux"></span><span class="nds-form-element__label">Existing
                        customer sign in</span></label></span></div>
              </fieldset>
            </slot>
            <slot name="dc-sign-up"></slot>
            <slot name="dc-sign-in">
              <fieldset class="nds-form nds-form_compound">
                <div class="nds-form-element__label nds-dc-form_label">Login Info</div>
                <div
                  class="nds-form-element__control nds-form-element__control-animated-label nds-dc-form-element_row nds-dc-form-element">
                  <input type="text" id="signin-email-128" data-id="email" required=""
                    class="nds-input nds-has-value signin-email"><label for="signin-email-128"
                    class="nds-form-element__label"><abbr title="required" class="nds-required">*</abbr>Email</label></div>
                <div
                  class="nds-form-element__control nds-form-element__control-animated-label nds-dc-form-element_row nds-dc-form-element nds-p-left_none">
                  <input type="password" id="signin-pwd-128" data-id="password" required=""
                    class="nds-input nds-has-value"><label for="signin-pwd-128" class="nds-form-element__label"><abbr
                      title="required" class="nds-required">*</abbr>Password</label></div>
              </fieldset>
            </slot>
          </div>
        </div>
      </c-dc-sign-in>
    `);
  })
  .add("dcCheckOut-Update-billing-address", () => {
    return withExample(`
      <div class="nds-dc-update-address">
        <slot name="dc-title">
          <div class="nds-step_label nds-dc-step_label">
            Billing &amp; Shipping
            
          </div>
        </slot>
        <slot name="dc-billing-address">
          <fieldset class="nds-form nds-form_compound">
            <div class="nds-form-element__label nds-dc-form_label">
              Billing Address
              
            </div>
            <div class="nds-form-element__control nds-form-element__control-animated-label nds-dc-form-element">
              <input type="text" required="" id="billing-address" data-label="address" class="nds-input nds-has-value"
                value="">
              <label class="nds-form-element__label" for="billing-address"><abbr class="nds-required"
                  title="required">*</abbr>Address Line
                </label>
            </div>
            <div
              class="nds-form-element__control nds-form-element__control-animated-label nds-dc-form-element_row nds-dc-form-element nds-p-left_none">
              <input type="text" required="" id="billing-city" data-label="city" class="nds-input nds-has-value" value="">
              <label class="nds-form-element__label" for="billing-city"><abbr class="nds-required"
                  title="required">*</abbr>City
                </label>
            </div>
            <div class="nds-form-element__row nds-dc-form-element_row nds-dc-form-element">
              <div class="nds-form-element__control nds-form-element__control-animated-label nds-size_1-of-2">
                <input type="text" required="" id="billing-state" data-label="state" class="nds-input nds-has-value" value="">
                <label class="nds-form-element__label" for="billing-state"><abbr class="nds-required"
                    title="required">*</abbr>State
                  </label>
              </div>
              <div class="nds-form-element__control nds-form-element__control-animated-label nds-size_1-of-2">
                <input type="text" required="" id="billing-zip" data-label="zip" class="nds-input nds-has-value" value="">
                <label class="nds-form-element__label" for="billing-zip"><abbr class="nds-required"
                    title="required">*</abbr>Zip Code
                  </label>
              </div>
            </div>
          </fieldset>
        </slot>
        <hr class="nds-dc-checkout_hr">
        <slot name="dc-shipping-address">
          <fieldset class="nds-form nds-form_compound">
            <div class="nds-form-element__label nds-dc-form_label">
              Shipping Address
              
            </div>
            <div class="nds-form-element__control">
              <label class="nds-checkbox nds-dc-checkbox">
                <input type="checkbox" name="options" id="dc-same-as-billing-address" value="on">
                <span class="nds-checkbox_faux"></span>
                <label class="nds-checkbox__label">
                  <span class="nds-form-element__label">
                    Same as billing address
                    </span>
                </label>
              </label>
            </div>

            <div>
              <div class="nds-form-element__control nds-form-element__control-animated-label nds-dc-form-element">
                <input type="text" required="" id="shipping-address" data-label="address" class="nds-input nds-has-value"
                  value="">
                <label class="nds-form-element__label" for="shipping-address"><abbr class="nds-required"
                    title="required">*</abbr>Address Line
                  </label>
              </div>
              <div
                class="nds-form-element__control nds-form-element__control-animated-label nds-dc-form-element_row nds-dc-form-element nds-p-left_none">
                <input type="text" required="" id="shipping-city" data-label="city" class="nds-input nds-has-value" value="">
                <label class="nds-form-element__label" for="shipping-city"><abbr class="nds-required"
                    title="required">*</abbr>City
                  </label>
              </div>
              <div class="nds-form-element__row nds-dc-form-element_row nds-dc-form-element">
                <div class="nds-form-element__control nds-form-element__control-animated-label nds-size_1-of-2">
                  <input type="text" required="" id="shipping-state" data-label="state" class="nds-input nds-has-value"
                    value="">
                  <label class="nds-form-element__label" for="shipping-state"><abbr class="nds-required"
                      title="required">*</abbr>State
                    </label>
                </div>
                <div class="nds-form-element__control nds-form-element__control-animated-label nds-size_1-of-2">
                  <input type="text" required="" id="shipping-zip" data-label="zip" class="nds-input nds-has-value" value="">
                  <label class="nds-form-element__label" for="shipping-zip"><abbr class="nds-required"
                      title="required">*</abbr>Zip Code
                    </label>
                </div>
              </div>
            </div>

          </fieldset>
        </slot>
      </div>
    `);
  })
  .add("dcCheckout-Review-order", () => {
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
  ;
