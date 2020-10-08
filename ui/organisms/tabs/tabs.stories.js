import { storiesOf } from '@storybook/html';
import base from 'paths.macro';
import notes from './doc.md';
import scss from './base/_index.scss';
import {
  withExample,
  withDocs,
  commentToHTML
} from '../../../scripts/storybook';

storiesOf(`${base}`, module)
  .addDecorator(withDocs(notes))
  .addDecorator(commentToHTML(scss))
  .add('Default (default)', () => {
    return withExample(`<div class="nds-tabs_default">
  <ul class="nds-tabs_default__nav" role="tablist">
    <li class="nds-tabs_default__item nds-is-active" title="Item One" role="presentation">
      <a class="nds-tabs_default__link" href="javascript:void(0);" role="tab" tabindex="0" aria-selected="true" aria-controls="tab-default-1" id="tab-default-1__item">Item One</a>
    </li>
    <li class="nds-tabs_default__item" title="Item Two" role="presentation">
      <a class="nds-tabs_default__link" href="javascript:void(0);" role="tab" tabindex="-1" aria-selected="false" aria-controls="tab-default-2" id="tab-default-2__item">Item Two</a>
    </li>
    <li class="nds-tabs_default__item" title="Item Three" role="presentation">
      <a class="nds-tabs_default__link" href="javascript:void(0);" role="tab" tabindex="-1" aria-selected="false" aria-controls="tab-default-3" id="tab-default-3__item">Item Three</a>
    </li>
  </ul>
  <div id="tab-default-1" class="nds-tabs_default__content nds-show" role="tabpanel" aria-labelledby="tab-default-1__item">Item One Content</div>
  <div id="tab-default-2" class="nds-tabs_default__content nds-hide" role="tabpanel" aria-labelledby="tab-default-2__item">Item Two Content</div>
  <div id="tab-default-3" class="nds-tabs_default__content nds-hide" role="tabpanel" aria-labelledby="tab-default-3__item">Item Three Content</div>
</div>`);
  })
  .add('Selected (states)', () => {
    return withExample(`<div class="nds-tabs_default">
  <ul class="nds-tabs_default__nav" role="tablist">
    <li class="nds-tabs_default__item" title="Item One" role="presentation">
      <a class="nds-tabs_default__link" href="javascript:void(0);" role="tab" tabindex="-1" aria-selected="false" aria-controls="tab-default-1" id="tab-default-1__item">Item One</a>
    </li>
    <li class="nds-tabs_default__item nds-is-active" title="Item Two" role="presentation">
      <a class="nds-tabs_default__link" href="javascript:void(0);" role="tab" tabindex="0" aria-selected="true" aria-controls="tab-default-2" id="tab-default-2__item">Item Two</a>
    </li>
    <li class="nds-tabs_default__item" title="Item Three" role="presentation">
      <a class="nds-tabs_default__link" href="javascript:void(0);" role="tab" tabindex="-1" aria-selected="false" aria-controls="tab-default-3" id="tab-default-3__item">Item Three</a>
    </li>
  </ul>
  <div id="tab-default-1" class="nds-tabs_default__content nds-hide" role="tabpanel" aria-labelledby="tab-default-1__item">Item One Content</div>
  <div id="tab-default-2" class="nds-tabs_default__content nds-show" role="tabpanel" aria-labelledby="tab-default-2__item">Item Two Content</div>
  <div id="tab-default-3" class="nds-tabs_default__content nds-hide" role="tabpanel" aria-labelledby="tab-default-3__item">Item Three Content</div>
</div>`);
  })
  .add('Overflow (examples)', () => {
    return withExample(`<div class="demo-only" style="height: 10rem;">
  <div class="nds-tabs_default">
    <ul class="nds-tabs_default__nav" role="tablist">
      <li class="nds-tabs_default__item nds-is-active" title="Item One" role="presentation">
        <a class="nds-tabs_default__link" href="javascript:void(0);" role="tab" tabindex="0" aria-selected="true" aria-controls="tab-default-1" id="tab-default-1__item">Item One</a>
      </li>
      <li class="nds-tabs_default__item" title="Item Two" role="presentation">
        <a class="nds-tabs_default__link" href="javascript:void(0);" role="tab" tabindex="-1" aria-selected="false" aria-controls="tab-default-2" id="tab-default-2__item">Item Two</a>
      </li>
      <li class="nds-tabs_default__item" title="Item Three" role="presentation">
        <a class="nds-tabs_default__link" href="javascript:void(0);" role="tab" tabindex="-1" aria-selected="false" aria-controls="tab-default-3" id="tab-default-3__item">Item Three</a>
      </li>
      <li class="nds-tabs_default__item" title="Item Four" role="presentation">
        <a class="nds-tabs_default__link" href="javascript:void(0);" role="tab" tabindex="-1" aria-selected="false" aria-controls="tab-default-4" id="tab-default-4__item">Item Four</a>
      </li>
      <li class="nds-tabs_default__item" title="Item Five" role="presentation">
        <a class="nds-tabs_default__link" href="javascript:void(0);" role="tab" tabindex="-1" aria-selected="false" aria-controls="tab-default-5" id="tab-default-5__item">Item Five</a>
      </li>
      <li class="nds-tabs_default__item" title="Item Six" role="presentation">
        <a class="nds-tabs_default__link" href="javascript:void(0);" role="tab" tabindex="-1" aria-selected="false" aria-controls="tab-default-6" id="tab-default-6__item">Item Six</a>
      </li>
      <li class="nds-tabs_default__item" title="Item Seven" role="presentation">
        <a class="nds-tabs_default__link" href="javascript:void(0);" role="tab" tabindex="-1" aria-selected="false" aria-controls="tab-default-7" id="tab-default-7__item">Item Seven</a>
      </li>
      <li class="nds-dropdown-trigger nds-dropdown-trigger_click nds-is-open nds-tabs_default__item nds-tabs__item_overflow" title="More tabs" role="presentation">
        <a class="nds-button nds-tabs_default__link" href="javascript:void(0);" aria-haspopup="true">
          <span class="nds-truncate" title="More tabs">
            <!-- react-text: 22 -->More
            <!-- /react-text -->
            <span class="nds-assistive-text">tabs</span>
          </span>
          <svg class="nds-button__icon nds-button__icon_x-small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
          </svg>
        </a>
        <div class="nds-dropdown nds-dropdown_right">
          <ul class="nds-dropdown__list nds-dropdown_length-with-icon-10" role="menu">
            <li class="nds-dropdown__item" role="presentation">
              <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                <span class="nds-truncate" title="[object Object],Accounts">
                  <svg class="nds-icon nds-icon_small nds-icon-standard-account nds-m-right_small" aria-hidden="true">
                    <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#account"></use>
                  </svg>
                  <!-- react-text: 33 -->Accounts
                  <!-- /react-text -->
                </span>
              </a>
            </li>
            <li class="nds-dropdown__item" role="presentation">
              <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                <span class="nds-truncate" title="[object Object],Approvals">
                  <svg class="nds-icon nds-icon_small nds-icon-standard-approval nds-m-right_small" aria-hidden="true">
                    <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#approval"></use>
                  </svg>
                  <!-- react-text: 39 -->Approvals
                  <!-- /react-text -->
                </span>
              </a>
            </li>
            <li class="nds-dropdown__item" role="presentation">
              <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                <span class="nds-truncate" title="[object Object],Lead">
                  <svg class="nds-icon nds-icon_small nds-icon-standard-lead nds-m-right_small" aria-hidden="true">
                    <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#lead"></use>
                  </svg>
                  <!-- react-text: 45 -->Lead
                  <!-- /react-text -->
                </span>
              </a>
            </li>
          </ul>
        </div>
      </li>
    </ul>
    <div id="tab-default-1" class="nds-tabs_default__content nds-show" role="tabpanel" aria-labelledby="tab-default-1__item">Item One Content</div>
    <div id="tab-default-2" class="nds-tabs_default__content nds-hide" role="tabpanel" aria-labelledby="tab-default-2__item">Item Two Content</div>
    <div id="tab-default-3" class="nds-tabs_default__content nds-hide" role="tabpanel" aria-labelledby="tab-default-3__item">Item Three Content</div>
    <div id="tab-default-4" class="nds-tabs_default__content nds-hide" role="tabpanel" aria-labelledby="tab-default-4__item">
      <h2>Item Four Content</h2>
    </div>
    <div id="tab-default-5" class="nds-tabs_default__content nds-hide" role="tabpanel" aria-labelledby="tab-default-5__item">
      <h2>Item Five Content</h2>
    </div>
    <div id="tab-default-6" class="nds-tabs_default__content nds-hide" role="tabpanel" aria-labelledby="tab-default-6__item">
      <h2>Item Six Content</h2>
    </div>
    <div id="tab-default-7" class="nds-tabs_default__content nds-hide" role="tabpanel" aria-labelledby="tab-default-7__item">
      <h2>Item Seven Content</h2>
    </div>
  </div>
</div>`);
  })
  .add('Nested (examples)', () => {
    return withExample(`<div class="nds-tabs_default">
  <ul class="nds-tabs_default__nav" role="tablist">
    <li class="nds-tabs_default__item nds-is-active" title="Item One" role="presentation">
      <a class="nds-tabs_default__link" href="javascript:void(0);" role="tab" tabindex="0" aria-selected="true" aria-controls="tab-default-1" id="tab-default-1__item">Item One</a>
    </li>
    <li class="nds-tabs_default__item" title="Item Two" role="presentation">
      <a class="nds-tabs_default__link" href="javascript:void(0);" role="tab" tabindex="-1" aria-selected="false" aria-controls="tab-default-2" id="tab-default-2__item">Item Two</a>
    </li>
    <li class="nds-tabs_default__item" title="Item Three" role="presentation">
      <a class="nds-tabs_default__link" href="javascript:void(0);" role="tab" tabindex="-1" aria-selected="false" aria-controls="tab-default-3" id="tab-default-3__item">Item Three</a>
    </li>
  </ul>
  <div id="tab-default-1" class="nds-tabs_default__content nds-show" role="tabpanel" aria-labelledby="tab-default-1__item">
    <div class="nds-tabs_scoped">
      <ul class="nds-tabs_scoped__nav" role="tablist">
        <li class="nds-tabs_scoped__item nds-is-active" title="Item One" role="presentation">
          <a class="nds-tabs_scoped__link" href="javascript:void(0);" role="tab" tabindex="0" aria-selected="true" aria-controls="tab-scoped-1" id="tab-scoped-1__item">Item One</a>
        </li>
        <li class="nds-tabs_scoped__item" title="Item Two" role="presentation">
          <a class="nds-tabs_scoped__link" href="javascript:void(0);" role="tab" tabindex="-1" aria-selected="false" aria-controls="tab-scoped-2" id="tab-scoped-2__item">Item Two</a>
        </li>
        <li class="nds-tabs_scoped__item" title="Item Three" role="presentation">
          <a class="nds-tabs_scoped__link" href="javascript:void(0);" role="tab" tabindex="-1" aria-selected="false" aria-controls="tab-scoped-3" id="tab-scoped-3__item">Item Three</a>
        </li>
      </ul>
      <div id="tab-scoped-1" class="nds-tabs_scoped__content nds-show" role="tabpanel" aria-labelledby="tab-scoped-1__item">Item One Content</div>
      <div id="tab-scoped-2" class="nds-tabs_scoped__content nds-hide" role="tabpanel" aria-labelledby="tab-scoped-2__item">Item Two Content</div>
      <div id="tab-scoped-3" class="nds-tabs_scoped__content nds-hide" role="tabpanel" aria-labelledby="tab-scoped-3__item">Item Three Content</div>
    </div>
  </div>
  <div id="tab-default-2" class="nds-tabs_default__content nds-hide" role="tabpanel" aria-labelledby="tab-default-2__item">Item Two Content</div>
  <div id="tab-default-3" class="nds-tabs_default__content nds-hide" role="tabpanel" aria-labelledby="tab-default-3__item">Item Three Content</div>
</div>`);
  })
  .add('Card Look (examples)', () => {
    return withExample(`<div class="nds-tabs_card nds-tabs_default">
  <ul class="nds-tabs_default__nav" role="tablist">
    <li class="nds-tabs_default__item nds-is-active" title="Item One" role="presentation">
      <a class="nds-tabs_default__link" href="javascript:void(0);" role="tab" tabindex="0" aria-selected="true" aria-controls="tab-default-1" id="tab-default-1__item">Item One</a>
    </li>
    <li class="nds-tabs_default__item" title="Item Two" role="presentation">
      <a class="nds-tabs_default__link" href="javascript:void(0);" role="tab" tabindex="-1" aria-selected="false" aria-controls="tab-default-2" id="tab-default-2__item">Item Two</a>
    </li>
    <li class="nds-tabs_default__item" title="Item Three" role="presentation">
      <a class="nds-tabs_default__link" href="javascript:void(0);" role="tab" tabindex="-1" aria-selected="false" aria-controls="tab-default-3" id="tab-default-3__item">Item Three</a>
    </li>
  </ul>
  <div id="tab-default-1" class="nds-tabs_default__content nds-show" role="tabpanel" aria-labelledby="tab-default-1__item">
    <article class="nds-card">
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
                <span class="nds-text-heading_small">Card Header</span>
              </a>
            </h2>
          </div>
        </header>
        <div class="nds-no-flex">
          <button class="nds-button nds-button_neutral">New</button>
        </div>
      </div>
      <div class="nds-card__body nds-card__body_inner">Card Body (custom goes in here)</div>
      <footer class="nds-card__footer">Card Footer</footer>
    </article>
    <article class="nds-card">
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
                <span class="nds-text-heading_small">Card Header</span>
              </a>
            </h2>
          </div>
        </header>
        <div class="nds-no-flex">
          <button class="nds-button nds-button_neutral">New</button>
        </div>
      </div>
      <div class="nds-card__body nds-card__body_inner">Card Body (custom goes in here)</div>
      <footer class="nds-card__footer">Card Footer</footer>
    </article>
  </div>
  <div id="tab-default-2" class="nds-tabs_default__content nds-hide" role="tabpanel" aria-labelledby="tab-default-2__item">Item Two Content</div>
  <div id="tab-default-3" class="nds-tabs_default__content nds-hide" role="tabpanel" aria-labelledby="tab-default-3__item">Item Three Content</div>
</div>`);
  });
