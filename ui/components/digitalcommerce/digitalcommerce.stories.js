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
  .add('Product List', () => {
    return withExample(`<article class="nds-product-list">
      <div class="nds-card__header nds-grid">
        <header class="nds-media nds-media_center nds-has-flexi-truncate">
          <div class="nds-media__figure">
            <span class="nds-icon_container nds-icon-standard-contact" title="description of icon when needed">
              <svg class="nds-icon nds-icon_small" aria-hidden="true">
                <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#contact"></use>
              </svg>
            </span>
          </div>
          <div class="nds-media__body">
            <h2>
              <a href="javascript:void(0);" class="nds-card__header-link nds-truncate" title="[object Object]">
                <span class="nds-text-heading_small">Product List</span>
              </a>
            </h2>
          </div>
        </header>
        <div class="nds-no-flex">
          <button class="nds-button nds-button_neutral">New</button>
        </div>
      </div>
      <div class="nds-card__body nds-card__body_inner">      <ul>
      <li>One</li>
      <li>Two</li>
      <li>Three</li>
      </ul>
      </div>
      <footer class="nds-card__footer">Card Footer</footer>
    </article>`);
  })
  .add('Product Card', () => {
    return withExample(`<div class="nds-product-offer-item-tile"><ul class="nds-has-dividers_around-space"><li class="nds-product-nds-item">
    <a>
      <article class="qnds-tile qnds-tile_board nds-tile_board nds-product-offer-item">      <nds-product-offer-list-view-image displaymode="grid">
      <div class="via-nds">
      <slot>
                  <div class="nds-product-offer-image-container">
                    <img class="listview" src="https://images-na.ssl-images-amazon.com/images/I/51YXG1bDM5L._SL1024_.jpg">
                  </div>
      </slot>
    </div></nds-product-offer-list-view-image>
        <div class="nds-product-offer-item-details">
          <slot name="gridviewAttributesSlot">
            <div class="nds-grid nds-wrap">
              <div class="nds-size--1-of-2">
                <div class="nds-product-tile-text">
                  Apple
                </div>
                <div class="nds-product-offer-name">
                  iPhone X
                </div>
              </div>
              <div class="nds-size--1-of-2">
                <nds-product-offer-list-view-attribute>
                <div class="via-nds">
      <slot name="listAttributes">              <div class="nds-product-offer-attributes">
                              <slot name="productListTextAttribute">
                                <div class="nds-product-tile-text">
                                   :
                                  5000mAh
                                </div>
                              </slot>
                              <slot name="productListTextAttribute">
                                <div class="nds-product-tile-text">
                                   :
                                  16MP
                                </div>
                              </slot>
                              <div class="nds-product-tile-text">
                                Available in
                              </div>
                              <slot name="productListRadioAttribute">
                                <div class="nds-product-offer-round-button-set">
                                      <span class="nds-product-offer-attribute" style="background-color: #FF0000"></span>
                                      <span class="nds-product-offer-attribute" style="background-color: #D4AF37"></span>
                                      <span class="nds-product-offer-attribute" style="background-color: #000000"></span>
                                </div>
                              </slot>
                              <slot name="productListTextAttribute">
                                <div class="nds-product-tile-text">
                                   :
                                  Retina HD Plus
                                </div>
                              </slot>
                              <slot name="productListConfigAttribute">
                                <div class="nds-product-offer-button-set">
                                      <span class="nds-product-tile-text-small nds-product-offer-attribute">16GB</span>

                                      <span class="nds-product-tile-text-small nds-product-offer-attribute">32GB</span>

                                      <span class="nds-product-tile-text-small nds-product-offer-attribute">64GB</span>

                                </div>
                              </slot>
                                                    <slot name="productListTextAttribute">
                                <div class="nds-product-tile-text">
                                   :
                                  A10 Bionic Chip
                                </div>
                              </slot>

              </div>      </slot>
    </div></nds-product-offer-list-view-attribute>
              </div>
            </div>
          </slot>
          <hr>
          <nds-product-offer-list-view-price class="pricelist" displaymode="grid">
          <div class="via-nds">
      <slot name="listViewPriceSlot">
        <div class="nds-product-tile-text-small">
          Starting From
        </div>              <div class="nds-grid nds-wrap nds-product-offer-price-wrapper gridview">
                <div class="nds-size--1-of-2 nds-product-price-items">
                  <div class="nds-product-offer-price">
                    <span class="nds-product-offer-discount-price">
                      $89
                    </span>
                  </div>
                  <div class="nds-product-tile-text-small">Recurring</div>
                </div>
                <div class="nds-size--1-of-2 nds-grid nds-wrap nds-product-price-items">
                  <div class="nds-size--1-of-3 nds-product-tile-text-small">
                    or
                  </div>
                  <div class="nds-size--2-of-3">
                    <div class="nds-product-offer-price">
                      $990
                    </div>
                    <div class="nds-product-tile-text-small">One-time</div>
                  </div>
                </div>
              </div>      </slot>
    </div></nds-product-offer-list-view-price>
          <slot name="productListDescSlot">
            <hr>
            <div class="nds-tile__detail nds-product-offer-detail">
              iPhone X with A10 Bionic chip processor and 6inch Retina HD display.
            </div>
          </slot>
        </div>
      </article>
    </a>
  </li></ul></div>`);
  });
