import { storiesOf } from '@storybook/html';
import base from 'paths.macro';
import notes from '../doc.md';
import scss from './_index.scss';
import {
  withExample,
  withDocs,
  commentToHTML
} from '../../../../scripts/storybook';

storiesOf(`${base}`, module)
  .addDecorator(withDocs(notes))
  .addDecorator(commentToHTML(scss))
  .add('Default (default)', () => {
    return withExample(`<div class="demo-only nds-grid" style="height: 800px; max-width: 420px; overflow: hidden;">
  <div class="nds-panel nds-grid nds-grid_vertical nds-nowrap nds-panel_filters">
    <div class="nds-form nds-form_stacked nds-grow nds-scrollable_y nds-grid nds-grid_vertical">
      <div class="nds-filters">
        <div class="nds-filters__header nds-grid nds-has-divider_bottom-space">
          <h2 class="nds-align-middle nds-text-heading_small">Filter</h2>
          <button class="nds-button nds-button_icon nds-col_bump-left nds-button_icon nds-button_icon-small" title="Close Filter Panel">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#forward"></use>
            </svg>
            <span class="nds-assistive-text">Close Filter Panel</span>
          </button>
        </div>
        <div class="nds-filters__body">
          <ol class="nds-list_vertical nds-list_vertical-space">
            <li class="nds-item nds-hint-parent">
              <div class="nds-filters__item nds-grid nds-grid_vertical-align-center">
                <button href="javascript:void(0);" class="nds-button_reset nds-grow nds-has-blur-focus">
                  <span class="nds-assistive-text">Edit filter:</span>
                  <p class="nds-text-body_small">Show Me</p>
                  <p>All Products</p>
                </button>
              </div>
            </li>
          </ol>
          <h3 class="nds-text-body_small nds-m-vertical_x-small">Matching all these filters</h3>
          <ol class="nds-list_vertical nds-list_vertical-space">
            <li class="nds-item nds-hint-parent">
              <div class="nds-filters__item nds-grid nds-grid_vertical-align-center">
                <button href="javascript:void(0);" class="nds-button_reset nds-grow nds-has-blur-focus">
                  <span class="nds-assistive-text">Edit filter:</span>
                  <p class="nds-text-body_small">Created Date</p>
                  <p>equals THIS WEEK</p>
                </button>
                <button class="nds-button nds-button_icon nds-button_icon nds-button_icon-small" title="Remove equals THIS WEEK">
                  <svg class="nds-button__icon nds-button__icon_hint" aria-hidden="true">
                    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                  </svg>
                  <span class="nds-assistive-text">Remove filter: Created Date equals THIS WEEK</span>
                </button>
              </div>
            </li>
            <li class="nds-item nds-hint-parent">
              <div class="nds-filters__item nds-grid nds-grid_vertical-align-center">
                <button href="javascript:void(0);" class="nds-button_reset nds-grow nds-has-blur-focus">
                  <span class="nds-assistive-text">Edit filter:</span>
                  <p class="nds-text-body_small">List Price</p>
                  <p>greater than "500"</p>
                </button>
                <button class="nds-button nds-button_icon nds-button_icon nds-button_icon-small" title="Remove greater than &quot;500&quot;">
                  <svg class="nds-button__icon nds-button__icon_hint" aria-hidden="true">
                    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                  </svg>
                  <span class="nds-assistive-text">Remove filter: List Price greater than "500"</span>
                </button>
              </div>
            </li>
          </ol>
        </div>
        <div class="nds-filters__footer nds-grid nds-shrink-none">
          <button class="nds-button_reset nds-text-link" href="javascript:void(0);">Add Filter</button>
          <button class="nds-button_reset nds-text-link nds-col_bump-left" href="javascript:void(0);">Remove All</button>
        </div>
      </div>
    </div>
  </div>
</div>`);
  })
  .add('Filtering New Object (states)', () => {
    return withExample(`<div class="demo-only nds-grid" style="height: 800px; max-width: 420px; overflow: hidden;">
  <div class="nds-panel nds-grid nds-grid_vertical nds-nowrap nds-panel_filters">
    <div class="nds-form nds-form_stacked nds-grow nds-scrollable_y nds-grid nds-grid_vertical">
      <div class="nds-filters">
        <div class="nds-filters__header nds-grid nds-has-divider_bottom-space nds-grid_align-spread">
          <button class="nds-button nds-button_neutral">Cancel</button>
          <button class="nds-button nds-button_brand">Save</button>
        </div>
        <div class="nds-filters__body">
          <ol class="nds-list_vertical nds-list_vertical-space">
            <li class="nds-item nds-hint-parent">
              <div class="nds-filters__item nds-grid nds-grid_vertical-align-center">
                <button href="javascript:void(0);" class="nds-button_reset nds-grow nds-has-blur-focus">
                  <span class="nds-assistive-text">Edit filter:</span>
                  <p class="nds-text-body_small">Show Me</p>
                  <p>All Products</p>
                </button>
              </div>
            </li>
          </ol>
          <h3 class="nds-text-body_small nds-m-vertical_x-small">Matching all these filters</h3>
          <ul class="nds-list_vertical nds-list_vertical-space">
            <li class="nds-item nds-hint-parent">
              <div class="nds-filters__item nds-grid nds-grid_vertical-align-center">
                <button href="javascript:void(0);" class="nds-button_reset nds-grow nds-has-blur-focus">
                  <span class="nds-assistive-text">Edit filter:</span>
                  <p class="nds-text-body_small">Created Date</p>
                  <p>equals THIS WEEK</p>
                </button>
                <button class="nds-button nds-button_icon nds-button_icon nds-button_icon-small" title="Remove equals THIS WEEK">
                  <svg class="nds-button__icon nds-button__icon_hint" aria-hidden="true">
                    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                  </svg>
                  <span class="nds-assistive-text">Remove filter: Created Date equals THIS WEEK</span>
                </button>
              </div>
            </li>
            <li class="nds-item nds-hint-parent">
              <div class="nds-filters__item nds-grid nds-grid_vertical-align-center">
                <button href="javascript:void(0);" class="nds-button_reset nds-grow nds-has-blur-focus">
                  <span class="nds-assistive-text">Edit filter:</span>
                  <p class="nds-text-body_small">List Price</p>
                  <p>greater than "500"</p>
                </button>
                <button class="nds-button nds-button_icon nds-button_icon nds-button_icon-small" title="Remove greater than &quot;500&quot;">
                  <svg class="nds-button__icon nds-button__icon_hint" aria-hidden="true">
                    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                  </svg>
                  <span class="nds-assistive-text">Remove filter: List Price greater than "500"</span>
                </button>
              </div>
            </li>
            <li class="nds-item nds-hint-parent">
              <div class="nds-filters__item nds-grid nds-grid_vertical-align-center nds-is-new">
                <button href="javascript:void(0);" class="nds-button_reset nds-grow nds-has-blur-focus">
                  <span class="nds-assistive-text">Edit filter:</span>
                  <p>New Filter</p>
                </button>
                <button class="nds-button nds-button_icon nds-button_icon nds-button_icon-small" title="Remove New Filter">
                  <svg class="nds-button__icon nds-button__icon_hint" aria-hidden="true">
                    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                  </svg>
                  <span class="nds-assistive-text">Remove filter: New Filter</span>
                </button>
              </div>
            </li>
          </ul>
        </div>
        <div class="nds-filters__footer nds-grid nds-shrink-none">
          <button class="nds-button_reset nds-text-link" href="javascript:void(0);">Add Filter</button>
          <button class="nds-button_reset nds-text-link nds-col_bump-left" href="javascript:void(0);">Remove All</button>
        </div>
      </div>
    </div>
  </div>
</div>`);
  })
  .add('Filtering Error (states)', () => {
    return withExample(`<div class="demo-only nds-grid" style="height: 800px; max-width: 420px; overflow: hidden;">
  <div class="nds-panel nds-grid nds-grid_vertical nds-nowrap nds-panel_filters">
    <div class="nds-form nds-form_stacked nds-grow nds-scrollable_y nds-grid nds-grid_vertical">
      <div class="nds-filters">
        <div class="nds-filters__header nds-grid nds-has-divider_bottom-space nds-grid_align-spread">
          <button class="nds-button nds-button_neutral">Cancel</button>
          <button class="nds-button nds-button_brand">Save</button>
        </div>
        <div class="nds-filters__body">
          <div class="nds-text-color_error nds-m-bottom_x-small" role="alert">Filters could not be applied. Please fix the validation errors below.</div>
          <ol class="nds-list_vertical nds-list_vertical-space">
            <li class="nds-item nds-hint-parent">
              <div class="nds-filters__item nds-grid nds-grid_vertical-align-center">
                <button href="javascript:void(0);" class="nds-button_reset nds-grow nds-has-blur-focus">
                  <span class="nds-assistive-text">Edit filter:</span>
                  <p class="nds-text-body_small">Show Me</p>
                  <p>All Products</p>
                </button>
              </div>
            </li>
          </ol>
          <h3 class="nds-text-body_small nds-m-vertical_x-small">Matching all these filters</h3>
          <ol class="nds-list_vertical nds-list_vertical-space">
            <li class="nds-item nds-hint-parent">
              <div class="nds-filters__item nds-grid nds-grid_vertical-align-center">
                <button href="javascript:void(0);" class="nds-button_reset nds-grow nds-has-blur-focus">
                  <span class="nds-assistive-text">Edit filter:</span>
                  <p class="nds-text-body_small">Created Date</p>
                  <p>equals THIS WEEK</p>
                </button>
                <button class="nds-button nds-button_icon nds-button_icon nds-button_icon-small" title="Remove equals THIS WEEK">
                  <svg class="nds-button__icon nds-button__icon_hint" aria-hidden="true">
                    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                  </svg>
                  <span class="nds-assistive-text">Remove filter: Created Date equals THIS WEEK</span>
                </button>
              </div>
            </li>
            <li class="nds-item nds-hint-parent">
              <div class="nds-filters__item nds-grid nds-grid_vertical-align-center">
                <button href="javascript:void(0);" class="nds-button_reset nds-grow nds-has-blur-focus">
                  <span class="nds-assistive-text">Edit filter:</span>
                  <p class="nds-text-body_small">List Price</p>
                  <p>greater than "500"</p>
                </button>
                <button class="nds-button nds-button_icon nds-button_icon nds-button_icon-small" title="Remove greater than &quot;500&quot;">
                  <svg class="nds-button__icon nds-button__icon_hint" aria-hidden="true">
                    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                  </svg>
                  <span class="nds-assistive-text">Remove filter: List Price greater than "500"</span>
                </button>
              </div>
            </li>
            <li class="nds-item nds-hint-parent">
              <div class="nds-filters__item nds-grid nds-grid_vertical-align-center nds-has-error">
                <button href="javascript:void(0);" class="nds-button_reset nds-grow nds-has-blur-focus" aria-describedby="error-filter-01">
                  <span class="nds-assistive-text">Edit filter:</span>
                  <p class="nds-text-body_small">Stage</p>
                  <p>equals "Red"</p>
                </button>
                <button class="nds-button nds-button_icon nds-button_icon nds-button_icon-small" title="Remove equals &quot;Red&quot;">
                  <svg class="nds-button__icon nds-button__icon_hint" aria-hidden="true">
                    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                  </svg>
                  <span class="nds-assistive-text">Remove filter: Stage equals "Red"</span>
                </button>
              </div>
              <p id="error-filter-01" class="nds-text-color_error nds-m-top_xx-small">Error Message</p>
            </li>
          </ol>
        </div>
        <div class="nds-filters__footer nds-grid nds-shrink-none">
          <button class="nds-button_reset nds-text-link" href="javascript:void(0);">Add Filter</button>
          <button class="nds-button_reset nds-text-link nds-col_bump-left" href="javascript:void(0);">Remove All</button>
        </div>
      </div>
    </div>
  </div>
</div>`);
  })
  .add('Filtering Locked (states)', () => {
    return withExample(`<div class="demo-only nds-grid" style="height: 800px; max-width: 420px; overflow: hidden;">
  <div class="nds-panel nds-grid nds-grid_vertical nds-nowrap nds-panel_filters">
    <div class="nds-form nds-form_stacked nds-grow nds-scrollable_y nds-grid nds-grid_vertical">
      <div class="nds-filters">
        <div class="nds-filters__header nds-grid nds-has-divider_bottom-space">
          <h2 class="nds-align-middle nds-text-heading_small">Filter</h2>
          <button class="nds-button nds-button_icon nds-col_bump-left nds-button_icon nds-button_icon-small" title="Close Filter Panel">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#forward"></use>
            </svg>
            <span class="nds-assistive-text">Close Filter Panel</span>
          </button>
        </div>
        <div class="nds-filters__body">
          <ol class="nds-list_vertical nds-list_vertical-space">
            <li class="nds-item nds-hint-parent">
              <div class="nds-filters__item nds-grid nds-grid_vertical-align-center">
                <button href="javascript:void(0);" class="nds-button_reset nds-grow nds-has-blur-focus">
                  <span class="nds-assistive-text">Edit filter:</span>
                  <p class="nds-text-body_small">Show Me</p>
                  <p>All Products</p>
                </button>
              </div>
            </li>
          </ol>
          <h3 class="nds-text-body_small nds-m-vertical_x-small">Matching all these filters</h3>
          <ol class="nds-list_vertical nds-list_vertical-space">
            <li class="nds-item nds-hint-parent">
              <div class="nds-filters__item nds-grid nds-grid_vertical-align-center">
                <button href="javascript:void(0);" class="nds-button_reset nds-grow nds-has-blur-focus">
                  <span class="nds-assistive-text">Edit filter:</span>
                  <p class="nds-text-body_small">Created Date</p>
                  <p>equals THIS WEEK</p>
                </button>
                <button class="nds-button nds-button_icon nds-button_icon nds-button_icon-small" title="Remove equals THIS WEEK">
                  <svg class="nds-button__icon nds-button__icon_hint" aria-hidden="true">
                    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                  </svg>
                  <span class="nds-assistive-text">Remove filter: Created Date equals THIS WEEK</span>
                </button>
              </div>
            </li>
            <li class="nds-item nds-hint-parent">
              <div class="nds-filters__item nds-grid nds-grid_vertical-align-center">
                <button href="javascript:void(0);" class="nds-button_reset nds-grow nds-has-blur-focus">
                  <span class="nds-assistive-text">Edit filter:</span>
                  <p class="nds-text-body_small">List Price</p>
                  <p>greater than "500"</p>
                </button>
                <button class="nds-button nds-button_icon nds-button_icon nds-button_icon-small" title="Remove greater than &quot;500&quot;">
                  <svg class="nds-button__icon nds-button__icon_hint" aria-hidden="true">
                    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                  </svg>
                  <span class="nds-assistive-text">Remove filter: List Price greater than "500"</span>
                </button>
              </div>
            </li>
          </ol>
          <h3 class="nds-text-body_small nds-m-vertical_x-small nds-grid">
            Locked Filters

            <svg class="nds-icon nds-icon_x-small nds-icon-text-default nds-m-left_x-small" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#lock"></use>
            </svg>
          </h3>
          <ol class="nds-list_vertical nds-list_vertical-space">
            <li class="nds-item nds-hint-parent">
              <div class="nds-filters__item nds-grid nds-grid_vertical-align-center nds-is-locked">
                <button href="javascript:void(0);" class="nds-button_reset nds-grow nds-has-blur-focus" disabled="">
                  <span class="nds-assistive-text">Edit filter:</span>
                  <p class="nds-text-body_small">Name</p>
                  <p>equals "ACME"</p>
                </button>
              </div>
            </li>
          </ol>
        </div>
        <div class="nds-filters__footer nds-grid nds-shrink-none">
          <button class="nds-button_reset nds-text-link" href="javascript:void(0);">Add Filter</button>
          <button class="nds-button_reset nds-text-link nds-col_bump-left" href="javascript:void(0);">Remove All</button>
        </div>
      </div>
    </div>
  </div>
</div>`);
  });
