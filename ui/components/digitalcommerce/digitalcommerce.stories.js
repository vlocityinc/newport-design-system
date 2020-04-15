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
  });
