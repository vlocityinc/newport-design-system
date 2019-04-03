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
    return withExample(`<div class="nds-path">
  <div class="nds-grid nds-path__track">
    <div class="nds-grid nds-path__scroller-container">
      <div class="nds-path__scroller" role="application">
        <div class="nds-path__scroller_inner">
          <ul class="nds-path__nav" role="listbox" aria-orientation="horizontal">
            <li class="nds-path__item nds-is-current nds-is-active" role="presentation">
              <a aria-selected="true" class="nds-path__link" href="javascript:void(0);" id="path-1" role="option" tabindex="0">
                <span class="nds-path__stage">
                  <svg class="nds-icon nds-icon_x-small" aria-hidden="true">
                    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                  </svg>
                  <span class="nds-assistive-text">Stage Complete</span>
                </span>
                <span class="nds-path__title">Contacted</span>
              </a>
            </li>
            <li class="nds-path__item nds-is-incomplete" role="presentation">
              <a aria-selected="false" class="nds-path__link" href="javascript:void(0);" id="path-2" role="option" tabindex="-1">
                <span class="nds-path__stage">
                  <svg class="nds-icon nds-icon_x-small" aria-hidden="true">
                    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                  </svg>
                  <span class="nds-assistive-text">Stage Complete</span>
                </span>
                <span class="nds-path__title">Open</span>
              </a>
            </li>
            <li class="nds-path__item nds-is-incomplete" role="presentation">
              <a aria-selected="false" class="nds-path__link" href="javascript:void(0);" id="path-3" role="option" tabindex="-1">
                <span class="nds-path__stage">
                  <svg class="nds-icon nds-icon_x-small" aria-hidden="true">
                    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                  </svg>
                  <span class="nds-assistive-text">Current Stage:</span>
                </span>
                <span class="nds-path__title">Unqualified</span>
              </a>
            </li>
            <li class="nds-path__item nds-is-incomplete" role="presentation">
              <a aria-selected="false" class="nds-path__link" href="javascript:void(0);" id="path-4" role="option" tabindex="-1">
                <span class="nds-path__stage">
                  <svg class="nds-icon nds-icon_x-small" aria-hidden="true">
                    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                  </svg>
                </span>
                <span class="nds-path__title">Nurturing</span>
              </a>
            </li>
            <li class="nds-path__item nds-is-incomplete" role="presentation">
              <a aria-selected="false" class="nds-path__link" href="javascript:void(0);" id="path-5" role="option" tabindex="-1">
                <span class="nds-path__stage">
                  <svg class="nds-icon nds-icon_x-small" aria-hidden="true">
                    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                  </svg>
                </span>
                <span class="nds-path__title">Closed</span>
              </a>
            </li>
          </ul>
          <div class="nds-path__scroll-controls">
            <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Scroll left">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#left"></use>
              </svg>
              <span class="nds-assistive-text">Scroll left</span>
            </button>
            <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Scroll right">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#right"></use>
              </svg>
              <span class="nds-assistive-text">Scroll right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="nds-grid nds-path__action">
      <span class="nds-path__stage-name">Stage: Unqualified</span>
      <button class="nds-button nds-button_brand nds-path__mark-complete">
        <svg class="nds-button__icon nds-button__icon_left" aria-hidden="true">
          <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
        </svg>
        Mark Status as Complete

      </button>
    </div>
  </div>
</div>`);
  })
  .add('Later Stage (states)', () => {
    return withExample(`<div class="nds-path">
  <div class="nds-grid nds-path__track">
    <div class="nds-grid nds-path__scroller-container">
      <div class="nds-path__scroller" role="application">
        <div class="nds-path__scroller_inner">
          <ul class="nds-path__nav" role="listbox" aria-orientation="horizontal">
            <li class="nds-path__item nds-is-complete" role="presentation">
              <a aria-selected="false" class="nds-path__link" href="javascript:void(0);" id="path-1" role="option" tabindex="-1">
                <span class="nds-path__stage">
                  <svg class="nds-icon nds-icon_x-small" aria-hidden="true">
                    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                  </svg>
                  <span class="nds-assistive-text">Stage Complete</span>
                </span>
                <span class="nds-path__title">Contacted</span>
              </a>
            </li>
            <li class="nds-path__item nds-is-complete" role="presentation">
              <a aria-selected="false" class="nds-path__link" href="javascript:void(0);" id="path-2" role="option" tabindex="-1">
                <span class="nds-path__stage">
                  <svg class="nds-icon nds-icon_x-small" aria-hidden="true">
                    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                  </svg>
                  <span class="nds-assistive-text">Stage Complete</span>
                </span>
                <span class="nds-path__title">Open</span>
              </a>
            </li>
            <li class="nds-path__item nds-is-current nds-is-active" role="presentation">
              <a aria-selected="true" class="nds-path__link" href="javascript:void(0);" id="path-3" role="option" tabindex="0">
                <span class="nds-path__stage">
                  <svg class="nds-icon nds-icon_x-small" aria-hidden="true">
                    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                  </svg>
                  <span class="nds-assistive-text">Current Stage:</span>
                </span>
                <span class="nds-path__title">Unqualified</span>
              </a>
            </li>
            <li class="nds-path__item nds-is-incomplete" role="presentation">
              <a aria-selected="false" class="nds-path__link" href="javascript:void(0);" id="path-4" role="option" tabindex="-1">
                <span class="nds-path__stage">
                  <svg class="nds-icon nds-icon_x-small" aria-hidden="true">
                    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                  </svg>
                </span>
                <span class="nds-path__title">Nurturing</span>
              </a>
            </li>
            <li class="nds-path__item nds-is-incomplete" role="presentation">
              <a aria-selected="false" class="nds-path__link" href="javascript:void(0);" id="path-5" role="option" tabindex="-1">
                <span class="nds-path__stage">
                  <svg class="nds-icon nds-icon_x-small" aria-hidden="true">
                    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                  </svg>
                </span>
                <span class="nds-path__title">Closed</span>
              </a>
            </li>
          </ul>
          <div class="nds-path__scroll-controls">
            <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Scroll left">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#left"></use>
              </svg>
              <span class="nds-assistive-text">Scroll left</span>
            </button>
            <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Scroll right">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#right"></use>
              </svg>
              <span class="nds-assistive-text">Scroll right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="nds-grid nds-path__action">
      <span class="nds-path__stage-name">Stage: Unqualified</span>
      <button class="nds-button nds-button_brand nds-path__mark-complete">
        <svg class="nds-button__icon nds-button__icon_left" aria-hidden="true">
          <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
        </svg>
        Mark Status as Complete

      </button>
    </div>
  </div>
</div>`);
  })
  .add('With Coaching (states)', () => {
    return withExample(`<div class="nds-path">
  <div class="nds-grid nds-path__track">
    <div class="nds-grid nds-path__scroller-container">
      <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-path__trigger" title="Expand Sales Coaching Tab Panels">
        <svg class="nds-button__icon" aria-hidden="true">
          <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
        </svg>
        <span class="nds-assistive-text">Expand Sales Coach Tab Panels</span>
      </button>
      <div class="nds-path__scroller" role="application">
        <div class="nds-path__scroller_inner">
          <ul class="nds-path__nav" role="tablist">
            <li class="nds-path__item nds-is-complete" role="presentation">
              <a aria-controls="path-content-1" aria-expanded="false" aria-selected="false" class="nds-path__link" href="javascript:void(0);" id="path-1" role="tab" tabindex="-1">
                <span class="nds-path__stage">
                  <svg class="nds-icon nds-icon_x-small" aria-hidden="true">
                    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                  </svg>
                  <span class="nds-assistive-text">Stage Complete</span>
                </span>
                <span class="nds-path__title">Contacted</span>
              </a>
            </li>
            <li class="nds-path__item nds-is-complete" role="presentation">
              <a aria-controls="path-content-2" aria-expanded="false" aria-selected="false" class="nds-path__link" href="javascript:void(0);" id="path-2" role="tab" tabindex="-1">
                <span class="nds-path__stage">
                  <svg class="nds-icon nds-icon_x-small" aria-hidden="true">
                    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                  </svg>
                  <span class="nds-assistive-text">Stage Complete</span>
                </span>
                <span class="nds-path__title">Open</span>
              </a>
            </li>
            <li class="nds-path__item nds-is-current nds-is-active" role="presentation">
              <a aria-controls="path-content-3" aria-expanded="false" aria-selected="true" class="nds-path__link" href="javascript:void(0);" id="path-3" role="tab" tabindex="0">
                <span class="nds-path__stage">
                  <svg class="nds-icon nds-icon_x-small" aria-hidden="true">
                    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                  </svg>
                  <span class="nds-assistive-text">Current Stage:</span>
                </span>
                <span class="nds-path__title">Unqualified</span>
              </a>
            </li>
            <li class="nds-path__item nds-is-incomplete" role="presentation">
              <a aria-controls="path-content-4" aria-expanded="false" aria-selected="false" class="nds-path__link" href="javascript:void(0);" id="path-4" role="tab" tabindex="-1">
                <span class="nds-path__stage">
                  <svg class="nds-icon nds-icon_x-small" aria-hidden="true">
                    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                  </svg>
                </span>
                <span class="nds-path__title">Nurturing</span>
              </a>
            </li>
            <li class="nds-path__item nds-is-incomplete" role="presentation">
              <a aria-controls="path-content-5" aria-expanded="false" aria-selected="false" class="nds-path__link" href="javascript:void(0);" id="path-5" role="tab" tabindex="-1">
                <span class="nds-path__stage">
                  <svg class="nds-icon nds-icon_x-small" aria-hidden="true">
                    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                  </svg>
                </span>
                <span class="nds-path__title">Closed</span>
              </a>
            </li>
          </ul>
          <div class="nds-path__scroll-controls">
            <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Scroll left">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#left"></use>
              </svg>
              <span class="nds-assistive-text">Scroll left</span>
            </button>
            <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Scroll right">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#right"></use>
              </svg>
              <span class="nds-assistive-text">Scroll right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="nds-grid nds-path__action">
      <span class="nds-path__stage-name">Stage: Unqualified</span>
      <button class="nds-button nds-button_brand nds-path__mark-complete">
        <svg class="nds-button__icon nds-button__icon_left" aria-hidden="true">
          <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
        </svg>
        Mark Status as Complete

      </button>
    </div>
  </div>
  <div aria-labelledby="path-1" class="nds-path__content nds-hide" id="path-content-1" role="tabpanel">
    <h2>Path 1 Content</h2>
  </div>
  <div aria-labelledby="path-2" class="nds-path__content nds-hide" id="path-content-2" role="tabpanel">
    <h2>Path 2 Content</h2>
  </div>
  <div aria-labelledby="path-3" class="nds-path__content nds-hide" id="path-content-3" role="tabpanel">
    <h2>Path 3 Content</h2>
  </div>
  <div aria-labelledby="path-4" class="nds-path__content nds-hide" id="path-content-4" role="tabpanel">
    <h2>Path 4 Content</h2>
  </div>
  <div aria-labelledby="path-5" class="nds-path__content nds-hide" id="path-content-5" role="tabpanel">
    <h2>Path 5 Content</h2>
  </div>
</div>`);
  })
  .add('Current Coaching (states)', () => {
    return withExample(`<div class="demo-only">
  <div class="nds-path nds-is-expanded">
    <div class="nds-grid nds-path__track">
      <div class="nds-grid nds-path__scroller-container">
        <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-path__trigger nds-flip_vertical" title="Collapse Sales Coaching Tab Panels">
          <svg class="nds-button__icon" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
          </svg>
          <span class="nds-assistive-text">Collapse Sales Coach Tab Panels</span>
        </button>
        <div class="nds-path__scroller" role="application">
          <div class="nds-path__scroller_inner">
            <ul class="nds-path__nav" role="tablist">
              <li class="nds-path__item nds-is-complete" role="presentation">
                <a aria-controls="path-content-1" aria-expanded="true" aria-selected="false" class="nds-path__link" href="javascript:void(0);" id="path-1" role="tab" tabindex="-1">
                  <span class="nds-path__stage">
                    <svg class="nds-icon nds-icon_x-small" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                    <span class="nds-assistive-text">Stage Complete</span>
                  </span>
                  <span class="nds-path__title">Contacted</span>
                </a>
              </li>
              <li class="nds-path__item nds-is-complete" role="presentation">
                <a aria-controls="path-content-2" aria-expanded="true" aria-selected="false" class="nds-path__link" href="javascript:void(0);" id="path-2" role="tab" tabindex="-1">
                  <span class="nds-path__stage">
                    <svg class="nds-icon nds-icon_x-small" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                    <span class="nds-assistive-text">Stage Complete</span>
                  </span>
                  <span class="nds-path__title">Open</span>
                </a>
              </li>
              <li class="nds-path__item nds-is-current nds-is-active" role="presentation">
                <a aria-controls="path-content-3" aria-expanded="true" aria-selected="true" class="nds-path__link" href="javascript:void(0);" id="path-3" role="tab" tabindex="0">
                  <span class="nds-path__stage">
                    <svg class="nds-icon nds-icon_x-small" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                    <span class="nds-assistive-text">Current Stage:</span>
                  </span>
                  <span class="nds-path__title">Unqualified</span>
                </a>
              </li>
              <li class="nds-path__item nds-is-incomplete" role="presentation">
                <a aria-controls="path-content-4" aria-expanded="true" aria-selected="false" class="nds-path__link" href="javascript:void(0);" id="path-4" role="tab" tabindex="-1">
                  <span class="nds-path__stage">
                    <svg class="nds-icon nds-icon_x-small" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                  </span>
                  <span class="nds-path__title">Nurturing</span>
                </a>
              </li>
              <li class="nds-path__item nds-is-incomplete" role="presentation">
                <a aria-controls="path-content-5" aria-expanded="true" aria-selected="false" class="nds-path__link" href="javascript:void(0);" id="path-5" role="tab" tabindex="-1">
                  <span class="nds-path__stage">
                    <svg class="nds-icon nds-icon_x-small" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                  </span>
                  <span class="nds-path__title">Closed</span>
                </a>
              </li>
            </ul>
            <div class="nds-path__scroll-controls">
              <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Scroll left">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#left"></use>
                </svg>
                <span class="nds-assistive-text">Scroll left</span>
              </button>
              <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Scroll right">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#right"></use>
                </svg>
                <span class="nds-assistive-text">Scroll right</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="nds-grid nds-path__action">
        <span class="nds-path__stage-name">Stage: Unqualified</span>
        <button class="nds-button nds-button_brand nds-path__mark-complete">
          <svg class="nds-button__icon nds-button__icon_left" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
          </svg>
          Mark Status as Complete

        </button>
      </div>
    </div>
    <div aria-labelledby="path-1" class="nds-path__content nds-hide" id="path-content-1" role="tabpanel">
      <h2>Path 1 Content</h2>
    </div>
    <div aria-labelledby="path-2" class="nds-path__content nds-hide" id="path-content-2" role="tabpanel">
      <h2>Path 2 Content</h2>
    </div>
    <div aria-labelledby="path-3" class="nds-path__content nds-show" id="path-content-3" role="tabpanel">
      <div class="nds-path__coach nds-grid">
        <div class="nds-path__keys nds-form nds-form_stacked">
          <div class="nds-grid nds-grid_align-spread nds-path__coach-title">
            <h2>Key Fields This Stage</h2>
            <button class="nds-button nds-button_reset nds-text-body_small">Edit</button>
          </div>
          <ul>
            <li class="nds-form-element nds-hint-parent nds-border_bottom nds-form-element_edit">
              <span class="nds-form-element__label">Expected Budget</span>
              <div class="nds-form-element__control">
                <span class="nds-form-element__static">$10,000</span>
                <button class="nds-button nds-button_icon nds-float_right nds-button_icon nds-button_icon-small" title="Edit this Field">
                  <svg class="nds-button__icon nds-button__icon_hint" aria-hidden="true">
                    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
                  </svg>
                  <span class="nds-assistive-text">Edit this Field</span>
                </button>
              </div>
            </li>
            <li class="nds-form-element nds-hint-parent nds-border_bottom nds-form-element_edit">
              <span class="nds-form-element__label">Lead Source</span>
              <div class="nds-form-element__control">
                <span class="nds-form-element__static">Marketing and Web Referral</span>
                <button class="nds-button nds-button_icon nds-float_right nds-button_icon nds-button_icon-small" title="Edit this Field">
                  <svg class="nds-button__icon nds-button__icon_hint" aria-hidden="true">
                    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
                  </svg>
                  <span class="nds-assistive-text">Edit this Field</span>
                </button>
              </div>
            </li>
            <li class="nds-form-element nds-hint-parent nds-border_bottom nds-form-element_edit">
              <span class="nds-form-element__label">Support Engineer</span>
              <div class="nds-form-element__control">
                <span class="nds-form-element__static">Jack Arthur</span>
                <button class="nds-button nds-button_icon nds-float_right nds-button_icon nds-button_icon-small" title="Edit this Field">
                  <svg class="nds-button__icon nds-button__icon_hint" aria-hidden="true">
                    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
                  </svg>
                  <span class="nds-assistive-text">Edit this Field</span>
                </button>
              </div>
            </li>
          </ul>
        </div>
        <div class="nds-path__guidance">
          <h2 class="nds-path__coach-title">Guidance for Success</h2>
          <div class="nds-text-longform nds-path__guidance-content">
            <p>
              Regularly cross-sell related products using



              <a href="javascript:void(0);">cross-sell tactics and principles</a>
              .

            </p>
            <p>
              Prepare demo deck using the



              <a href="javascript:void(0);">latest template</a>
              and review with Marketing and Sales teams. Review demo copy with Legal and Doc team.

            </p>
            <p>
              Look up

              <a href="javascript:void(0);">needs analysis principles</a>


              and review selling plan with Sales Engineer.

            </p>
          </div>
        </div>
      </div>
    </div>
    <div aria-labelledby="path-4" class="nds-path__content nds-hide" id="path-content-4" role="tabpanel">
      <h2>Path 4 Content</h2>
    </div>
    <div aria-labelledby="path-5" class="nds-path__content nds-hide" id="path-content-5" role="tabpanel">
      <h2>Path 5 Content</h2>
    </div>
  </div>
</div>`);
  })
  .add('Different Coaching (states)', () => {
    return withExample(`<div class="demo-only">
  <div class="nds-path nds-is-expanded">
    <div class="nds-grid nds-path__track">
      <div class="nds-grid nds-path__scroller-container">
        <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-path__trigger nds-flip_vertical" title="Collapse Sales Coaching Tab Panels">
          <svg class="nds-button__icon" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
          </svg>
          <span class="nds-assistive-text">Collapse Sales Coach Tab Panels</span>
        </button>
        <div class="nds-path__scroller" role="application">
          <div class="nds-path__scroller_inner">
            <ul class="nds-path__nav" role="tablist">
              <li class="nds-path__item nds-is-complete" role="presentation">
                <a aria-controls="path-content-1" aria-expanded="true" aria-selected="false" class="nds-path__link" href="javascript:void(0);" id="path-1" role="tab" tabindex="-1">
                  <span class="nds-path__stage">
                    <svg class="nds-icon nds-icon_x-small" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                    <span class="nds-assistive-text">Stage Complete</span>
                  </span>
                  <span class="nds-path__title">Contacted</span>
                </a>
              </li>
              <li class="nds-path__item nds-is-complete" role="presentation">
                <a aria-controls="path-content-2" aria-expanded="true" aria-selected="false" class="nds-path__link" href="javascript:void(0);" id="path-2" role="tab" tabindex="-1">
                  <span class="nds-path__stage">
                    <svg class="nds-icon nds-icon_x-small" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                    <span class="nds-assistive-text">Stage Complete</span>
                  </span>
                  <span class="nds-path__title">Open</span>
                </a>
              </li>
              <li class="nds-path__item nds-is-current" role="presentation">
                <a aria-controls="path-content-3" aria-expanded="true" aria-selected="false" class="nds-path__link" href="javascript:void(0);" id="path-3" role="tab" tabindex="-1">
                  <span class="nds-path__stage">
                    <svg class="nds-icon nds-icon_x-small" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                    <span class="nds-assistive-text">Current Stage:</span>
                  </span>
                  <span class="nds-path__title">Unqualified</span>
                </a>
              </li>
              <li class="nds-path__item nds-is-incomplete nds-is-active nds-is-active" role="presentation">
                <a aria-controls="path-content-4" aria-expanded="true" aria-selected="true" class="nds-path__link" href="javascript:void(0);" id="path-4" role="tab" tabindex="0">
                  <span class="nds-path__stage">
                    <svg class="nds-icon nds-icon_x-small" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                  </span>
                  <span class="nds-path__title">Nurturing</span>
                </a>
              </li>
              <li class="nds-path__item nds-is-incomplete" role="presentation">
                <a aria-controls="path-content-5" aria-expanded="true" aria-selected="false" class="nds-path__link" href="javascript:void(0);" id="path-5" role="tab" tabindex="-1">
                  <span class="nds-path__stage">
                    <svg class="nds-icon nds-icon_x-small" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                  </span>
                  <span class="nds-path__title">Closed</span>
                </a>
              </li>
            </ul>
            <div class="nds-path__scroll-controls">
              <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Scroll left">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#left"></use>
                </svg>
                <span class="nds-assistive-text">Scroll left</span>
              </button>
              <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Scroll right">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#right"></use>
                </svg>
                <span class="nds-assistive-text">Scroll right</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="nds-grid nds-path__action">
        <span class="nds-path__stage-name">Stage: Unqualified</span>
        <button class="nds-button nds-button_brand nds-path__mark-complete nds-path__mark-current">Mark as Current Stage</button>
      </div>
    </div>
    <div aria-labelledby="path-1" class="nds-path__content nds-hide" id="path-content-1" role="tabpanel">
      <h2>Path 1 Content</h2>
    </div>
    <div aria-labelledby="path-2" class="nds-path__content nds-hide" id="path-content-2" role="tabpanel">
      <h2>Path 2 Content</h2>
    </div>
    <div aria-labelledby="path-3" class="nds-path__content nds-hide" id="path-content-3" role="tabpanel">
      <h2>Path 3 Content</h2>
    </div>
    <div aria-labelledby="path-4" class="nds-path__content nds-show" id="path-content-4" role="tabpanel">
      <div class="nds-path__coach nds-grid">
        <div class="nds-path__keys nds-form nds-form_stacked">
          <div class="nds-grid nds-grid_align-spread nds-path__coach-title">
            <h2>Key Fields This Stage</h2>
            <button class="nds-button nds-button_reset nds-text-body_small">Edit</button>
          </div>
          <ul>
            <li class="nds-form-element nds-hint-parent nds-border_bottom nds-form-element_edit">
              <span class="nds-form-element__label">Build State</span>
              <div class="nds-form-element__control">
                <span class="nds-form-element__static">In Motion</span>
                <button class="nds-button nds-button_icon nds-float_right nds-button_icon nds-button_icon-small" title="Edit this Field">
                  <svg class="nds-button__icon nds-button__icon_hint" aria-hidden="true">
                    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
                  </svg>
                  <span class="nds-assistive-text">Edit this Field</span>
                </button>
              </div>
            </li>
            <li class="nds-form-element nds-hint-parent nds-border_bottom nds-form-element_edit">
              <span class="nds-form-element__label">Expected Sign Date</span>
              <div class="nds-form-element__control">
                <span class="nds-form-element__static">&nbsp;</span>
                <button class="nds-button nds-button_icon nds-float_right nds-button_icon nds-button_icon-small" title="Edit this Field">
                  <svg class="nds-button__icon nds-button__icon_hint" aria-hidden="true">
                    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
                  </svg>
                  <span class="nds-assistive-text">Edit this Field</span>
                </button>
              </div>
            </li>
            <li class="nds-form-element nds-hint-parent nds-border_bottom nds-form-element_edit">
              <span class="nds-form-element__label">Key Buyer</span>
              <div class="nds-form-element__control">
                <span class="nds-form-element__static">&nbsp;</span>
                <button class="nds-button nds-button_icon nds-float_right nds-button_icon nds-button_icon-small" title="Edit this Field">
                  <svg class="nds-button__icon nds-button__icon_hint" aria-hidden="true">
                    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
                  </svg>
                  <span class="nds-assistive-text">Edit this Field</span>
                </button>
              </div>
            </li>
          </ul>
        </div>
        <div class="nds-path__guidance">
          <h2 class="nds-path__coach-title">Guidance for Success</h2>
          <div class="nds-text-longform nds-path__guidance-content">
            <p>
              Check out the latest Negotiation and Review tactics on our



              <a href="javascript:void(0);">online portal here</a>
              .

            </p>
            <p>Review Quote with the Legal and Marketing team and be sure to approve with Exec.</p>
            <p>Set up at time to delivery schedule and check with Inventory.</p>
          </div>
        </div>
      </div>
    </div>
    <div aria-labelledby="path-5" class="nds-path__content nds-hide" id="path-content-5" role="tabpanel">
      <h2>Path 5 Content</h2>
    </div>
  </div>
</div>`);
  })
  .add('Lost (states)', () => {
    return withExample(`<div class="nds-path">
  <div class="nds-grid nds-path__track">
    <div class="nds-grid nds-path__scroller-container">
      <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-path__trigger" title="Expand Sales Coaching Tab Panels">
        <svg class="nds-button__icon" aria-hidden="true">
          <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
        </svg>
        <span class="nds-assistive-text">Expand Sales Coach Tab Panels</span>
      </button>
      <div class="nds-path__scroller" role="application">
        <div class="nds-path__scroller_inner">
          <ul class="nds-path__nav" role="tablist">
            <li class="nds-path__item nds-is-incomplete" role="presentation">
              <a aria-controls="path-content-1" aria-expanded="false" aria-selected="false" class="nds-path__link" href="javascript:void(0);" id="path-1" role="tab" tabindex="-1">
                <span class="nds-path__stage">
                  <svg class="nds-icon nds-icon_x-small" aria-hidden="true">
                    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                  </svg>
                  <span class="nds-assistive-text">Stage Complete</span>
                </span>
                <span class="nds-path__title">Contacted</span>
              </a>
            </li>
            <li class="nds-path__item nds-is-incomplete" role="presentation">
              <a aria-controls="path-content-2" aria-expanded="false" aria-selected="false" class="nds-path__link" href="javascript:void(0);" id="path-2" role="tab" tabindex="-1">
                <span class="nds-path__stage">
                  <svg class="nds-icon nds-icon_x-small" aria-hidden="true">
                    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                  </svg>
                  <span class="nds-assistive-text">Stage Complete</span>
                </span>
                <span class="nds-path__title">Open</span>
              </a>
            </li>
            <li class="nds-path__item nds-is-incomplete" role="presentation">
              <a aria-controls="path-content-3" aria-expanded="false" aria-selected="false" class="nds-path__link" href="javascript:void(0);" id="path-3" role="tab" tabindex="-1">
                <span class="nds-path__stage">
                  <svg class="nds-icon nds-icon_x-small" aria-hidden="true">
                    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                  </svg>
                </span>
                <span class="nds-path__title">Unqualified</span>
              </a>
            </li>
            <li class="nds-path__item nds-is-incomplete" role="presentation">
              <a aria-controls="path-content-4" aria-expanded="false" aria-selected="false" class="nds-path__link" href="javascript:void(0);" id="path-4" role="tab" tabindex="-1">
                <span class="nds-path__stage">
                  <svg class="nds-icon nds-icon_x-small" aria-hidden="true">
                    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                  </svg>
                </span>
                <span class="nds-path__title">Nurturing</span>
              </a>
            </li>
            <li class="nds-path__item nds-is-lost nds-is-active" role="presentation">
              <a aria-controls="path-content-5" aria-expanded="false" aria-selected="true" class="nds-path__link" href="javascript:void(0);" id="path-5" role="tab" tabindex="0">
                <span class="nds-path__stage">
                  <svg class="nds-icon nds-icon_x-small" aria-hidden="true">
                    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                  </svg>
                  <span class="nds-assistive-text">Current Stage:</span>
                </span>
                <span class="nds-path__title">Closed Lost</span>
              </a>
            </li>
          </ul>
          <div class="nds-path__scroll-controls">
            <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Scroll left">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#left"></use>
              </svg>
              <span class="nds-assistive-text">Scroll left</span>
            </button>
            <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Scroll right">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#right"></use>
              </svg>
              <span class="nds-assistive-text">Scroll right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="nds-grid nds-path__action">
      <span class="nds-path__stage-name">Stage: Closed Lost</span>
      <button class="nds-button nds-button_brand nds-path__mark-complete">Change Closed State</button>
    </div>
  </div>
  <div aria-labelledby="path-1" class="nds-path__content nds-hide" id="path-content-1" role="tabpanel">
    <h2>Path 1 Content</h2>
  </div>
  <div aria-labelledby="path-2" class="nds-path__content nds-hide" id="path-content-2" role="tabpanel">
    <h2>Path 2 Content</h2>
  </div>
  <div aria-labelledby="path-3" class="nds-path__content nds-hide" id="path-content-3" role="tabpanel">
    <h2>Path 3 Content</h2>
  </div>
  <div aria-labelledby="path-4" class="nds-path__content nds-hide" id="path-content-4" role="tabpanel">
    <h2>Path 4 Content</h2>
  </div>
  <div aria-labelledby="path-5" class="nds-path__content nds-hide" id="path-content-5" role="tabpanel">
    <h2>Path 5 Content</h2>
  </div>
</div>`);
  })
  .add('Won (states)', () => {
    return withExample(`<div class="nds-path">
  <div class="nds-grid nds-path__track">
    <div class="nds-grid nds-path__scroller-container">
      <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-path__trigger" title="Expand Sales Coaching Tab Panels">
        <svg class="nds-button__icon" aria-hidden="true">
          <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
        </svg>
        <span class="nds-assistive-text">Expand Sales Coach Tab Panels</span>
      </button>
      <div class="nds-path__scroller" role="application">
        <div class="nds-path__scroller_inner">
          <ul class="nds-path__nav" role="tablist">
            <li class="nds-path__item nds-is-complete" role="presentation">
              <a aria-controls="path-content-1" aria-expanded="false" aria-selected="false" class="nds-path__link" href="javascript:void(0);" id="path-1" role="tab" tabindex="-1">
                <span class="nds-path__stage">
                  <svg class="nds-icon nds-icon_x-small" aria-hidden="true">
                    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                  </svg>
                  <span class="nds-assistive-text">Stage Complete</span>
                </span>
                <span class="nds-path__title">Contacted</span>
              </a>
            </li>
            <li class="nds-path__item nds-is-complete" role="presentation">
              <a aria-controls="path-content-2" aria-expanded="false" aria-selected="false" class="nds-path__link" href="javascript:void(0);" id="path-2" role="tab" tabindex="-1">
                <span class="nds-path__stage">
                  <svg class="nds-icon nds-icon_x-small" aria-hidden="true">
                    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                  </svg>
                  <span class="nds-assistive-text">Stage Complete</span>
                </span>
                <span class="nds-path__title">Open</span>
              </a>
            </li>
            <li class="nds-path__item nds-is-complete" role="presentation">
              <a aria-controls="path-content-3" aria-expanded="false" aria-selected="false" class="nds-path__link" href="javascript:void(0);" id="path-3" role="tab" tabindex="-1">
                <span class="nds-path__stage">
                  <svg class="nds-icon nds-icon_x-small" aria-hidden="true">
                    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                  </svg>
                </span>
                <span class="nds-path__title">Unqualified</span>
              </a>
            </li>
            <li class="nds-path__item nds-is-complete" role="presentation">
              <a aria-controls="path-content-4" aria-expanded="false" aria-selected="false" class="nds-path__link" href="javascript:void(0);" id="path-4" role="tab" tabindex="-1">
                <span class="nds-path__stage">
                  <svg class="nds-icon nds-icon_x-small" aria-hidden="true">
                    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                  </svg>
                </span>
                <span class="nds-path__title">Nurturing</span>
              </a>
            </li>
            <li class="nds-path__item nds-is-complete nds-is-won nds-is-active" role="presentation">
              <a aria-controls="path-content-5" aria-expanded="false" aria-selected="true" class="nds-path__link" href="javascript:void(0);" id="path-5" role="tab" tabindex="0">
                <span class="nds-path__stage">
                  <svg class="nds-icon nds-icon_x-small" aria-hidden="true">
                    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                  </svg>
                  <span class="nds-assistive-text">Current Stage:</span>
                </span>
                <span class="nds-path__title">Closed Won</span>
              </a>
            </li>
          </ul>
          <div class="nds-path__scroll-controls">
            <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Scroll left">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#left"></use>
              </svg>
              <span class="nds-assistive-text">Scroll left</span>
            </button>
            <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Scroll right">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#right"></use>
              </svg>
              <span class="nds-assistive-text">Scroll right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="nds-grid nds-path__action">
      <span class="nds-path__stage-name">Stage: Closed Won</span>
      <button class="nds-button nds-button_brand nds-path__mark-complete">Change Closed State</button>
    </div>
  </div>
  <div aria-labelledby="path-1" class="nds-path__content nds-hide" id="path-content-1" role="tabpanel">
    <h2>Path 1 Content</h2>
  </div>
  <div aria-labelledby="path-2" class="nds-path__content nds-hide" id="path-content-2" role="tabpanel">
    <h2>Path 2 Content</h2>
  </div>
  <div aria-labelledby="path-3" class="nds-path__content nds-hide" id="path-content-3" role="tabpanel">
    <h2>Path 3 Content</h2>
  </div>
  <div aria-labelledby="path-4" class="nds-path__content nds-hide" id="path-content-4" role="tabpanel">
    <h2>Path 4 Content</h2>
  </div>
  <div aria-labelledby="path-5" class="nds-path__content nds-hide" id="path-content-5" role="tabpanel">
    <h2>Path 5 Content</h2>
  </div>
</div>`);
  })
  .add('With Overflow (states)', () => {
    return withExample(`<div class="demo-only">
  <div class="nds-path">
    <div class="nds-grid nds-path__track nds-has-overflow">
      <div class="nds-grid nds-path__scroller-container">
        <div class="nds-path__scroller" role="application">
          <div class="nds-path__scroller_inner">
            <ul class="nds-path__nav" role="listbox" aria-orientation="horizontal">
              <li class="nds-path__item nds-is-complete" role="presentation">
                <a aria-selected="false" class="nds-path__link" href="javascript:void(0);" id="path-11" role="option" tabindex="-1">
                  <span class="nds-path__stage">
                    <svg class="nds-icon nds-icon_x-small" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                    <span class="nds-assistive-text">Stage Complete</span>
                  </span>
                  <span class="nds-path__title">Contacted</span>
                </a>
              </li>
              <li class="nds-path__item nds-is-complete" role="presentation">
                <a aria-selected="false" class="nds-path__link" href="javascript:void(0);" id="path-12" role="option" tabindex="-1">
                  <span class="nds-path__stage">
                    <svg class="nds-icon nds-icon_x-small" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                    <span class="nds-assistive-text">Stage Complete</span>
                  </span>
                  <span class="nds-path__title">Open</span>
                </a>
              </li>
              <li class="nds-path__item nds-is-complete" role="presentation">
                <a aria-selected="false" class="nds-path__link" href="javascript:void(0);" id="path-1" role="option" tabindex="-1">
                  <span class="nds-path__stage">
                    <svg class="nds-icon nds-icon_x-small" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                    <span class="nds-assistive-text">Stage Complete</span>
                  </span>
                  <span class="nds-path__title">Contacted</span>
                </a>
              </li>
              <li class="nds-path__item nds-is-complete" role="presentation">
                <a aria-selected="false" class="nds-path__link" href="javascript:void(0);" id="path-2" role="option" tabindex="-1">
                  <span class="nds-path__stage">
                    <svg class="nds-icon nds-icon_x-small" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                    <span class="nds-assistive-text">Stage Complete</span>
                  </span>
                  <span class="nds-path__title">Open</span>
                </a>
              </li>
              <li class="nds-path__item nds-is-complete" role="presentation">
                <a aria-selected="false" class="nds-path__link" href="javascript:void(0);" id="path-3" role="option" tabindex="-1">
                  <span class="nds-path__stage">
                    <svg class="nds-icon nds-icon_x-small" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                    <span class="nds-assistive-text">Stage Complete</span>
                  </span>
                  <span class="nds-path__title">Contacted</span>
                </a>
              </li>
              <li class="nds-path__item nds-is-complete" role="presentation">
                <a aria-selected="false" class="nds-path__link" href="javascript:void(0);" id="path-4" role="option" tabindex="-1">
                  <span class="nds-path__stage">
                    <svg class="nds-icon nds-icon_x-small" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                    <span class="nds-assistive-text">Stage Complete</span>
                  </span>
                  <span class="nds-path__title">Open</span>
                </a>
              </li>
              <li class="nds-path__item nds-is-complete" role="presentation">
                <a aria-selected="false" class="nds-path__link" href="javascript:void(0);" id="path-5" role="option" tabindex="-1">
                  <span class="nds-path__stage">
                    <svg class="nds-icon nds-icon_x-small" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                    <span class="nds-assistive-text">Stage Complete</span>
                  </span>
                  <span class="nds-path__title">Contacted</span>
                </a>
              </li>
              <li class="nds-path__item nds-is-complete" role="presentation">
                <a aria-selected="false" class="nds-path__link" href="javascript:void(0);" id="path-6" role="option" tabindex="-1">
                  <span class="nds-path__stage">
                    <svg class="nds-icon nds-icon_x-small" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                    <span class="nds-assistive-text">Stage Complete</span>
                  </span>
                  <span class="nds-path__title">Open</span>
                </a>
              </li>
              <li class="nds-path__item nds-is-complete" role="presentation">
                <a aria-selected="false" class="nds-path__link" href="javascript:void(0);" id="path-7" role="option" tabindex="-1">
                  <span class="nds-path__stage">
                    <svg class="nds-icon nds-icon_x-small" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                    <span class="nds-assistive-text">Stage Complete</span>
                  </span>
                  <span class="nds-path__title">Contacted</span>
                </a>
              </li>
              <li class="nds-path__item nds-is-current nds-is-active" role="presentation">
                <a aria-selected="true" class="nds-path__link" href="javascript:void(0);" id="path-8" role="option" tabindex="0">
                  <span class="nds-path__stage">
                    <svg class="nds-icon nds-icon_x-small" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                    <span class="nds-assistive-text">Current Stage:</span>
                  </span>
                  <span class="nds-path__title">Unqualified</span>
                </a>
              </li>
              <li class="nds-path__item nds-is-incomplete" role="presentation">
                <a aria-selected="false" class="nds-path__link" href="javascript:void(0);" id="path-9" role="option" tabindex="-1">
                  <span class="nds-path__stage">
                    <svg class="nds-icon nds-icon_x-small" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                  </span>
                  <span class="nds-path__title">Nurturing</span>
                </a>
              </li>
              <li class="nds-path__item nds-is-incomplete" role="presentation">
                <a aria-selected="false" class="nds-path__link" href="javascript:void(0);" id="path-10" role="option" tabindex="-1">
                  <span class="nds-path__stage">
                    <svg class="nds-icon nds-icon_x-small" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                  </span>
                  <span class="nds-path__title">Closed</span>
                </a>
              </li>
            </ul>
            <div class="nds-path__scroll-controls">
              <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Scroll left">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#left"></use>
                </svg>
                <span class="nds-assistive-text">Scroll left</span>
              </button>
              <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Scroll right">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#right"></use>
                </svg>
                <span class="nds-assistive-text">Scroll right</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="nds-grid nds-path__action">
        <span class="nds-path__stage-name">Stage: Unqualified</span>
        <button class="nds-button nds-button_brand nds-path__mark-complete">
          <svg class="nds-button__icon nds-button__icon_left" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
          </svg>
          Mark Status as Complete

        </button>
      </div>
    </div>
  </div>
</div>`);
  })
  .add('Medium Coaching (states)', () => {
    return withExample(`<div class="nds-region_medium" style="width: 700px;">
  <div class="nds-path nds-is-expanded">
    <div class="nds-grid nds-path__track nds-has-overflow">
      <div class="nds-grid nds-path__scroller-container">
        <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-path__trigger nds-flip_vertical" title="Collapse Sales Coaching Tab Panels">
          <svg class="nds-button__icon" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
          </svg>
          <span class="nds-assistive-text">Collapse Sales Coach Tab Panels</span>
        </button>
        <div class="nds-path__scroller" role="application">
          <div class="nds-path__scroller_inner">
            <ul class="nds-path__nav" role="tablist">
              <li class="nds-path__item nds-is-complete" role="presentation">
                <a aria-controls="path-content-1" aria-expanded="true" aria-selected="false" class="nds-path__link" href="javascript:void(0);" id="path-1" role="tab" tabindex="-1">
                  <span class="nds-path__stage">
                    <svg class="nds-icon nds-icon_x-small" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                    <span class="nds-assistive-text">Stage Complete</span>
                  </span>
                  <span class="nds-path__title">Contacted</span>
                </a>
              </li>
              <li class="nds-path__item nds-is-complete" role="presentation">
                <a aria-controls="path-content-2" aria-expanded="true" aria-selected="false" class="nds-path__link" href="javascript:void(0);" id="path-2" role="tab" tabindex="-1">
                  <span class="nds-path__stage">
                    <svg class="nds-icon nds-icon_x-small" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                    <span class="nds-assistive-text">Stage Complete</span>
                  </span>
                  <span class="nds-path__title">Open</span>
                </a>
              </li>
              <li class="nds-path__item nds-is-complete" role="presentation">
                <a aria-controls="path-content-3" aria-expanded="true" aria-selected="false" class="nds-path__link" href="javascript:void(0);" id="path-3" role="tab" tabindex="-1">
                  <span class="nds-path__stage">
                    <svg class="nds-icon nds-icon_x-small" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                    <span class="nds-assistive-text">Stage Complete</span>
                  </span>
                  <span class="nds-path__title">Contacted</span>
                </a>
              </li>
              <li class="nds-path__item nds-is-complete" role="presentation">
                <a aria-controls="path-content-4" aria-expanded="true" aria-selected="false" class="nds-path__link" href="javascript:void(0);" id="path-4" role="tab" tabindex="-1">
                  <span class="nds-path__stage">
                    <svg class="nds-icon nds-icon_x-small" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                    <span class="nds-assistive-text">Stage Complete</span>
                  </span>
                  <span class="nds-path__title">Open</span>
                </a>
              </li>
              <li class="nds-path__item nds-is-complete" role="presentation">
                <a aria-controls="path-content-5" aria-expanded="true" aria-selected="false" class="nds-path__link" href="javascript:void(0);" id="path-5" role="tab" tabindex="-1">
                  <span class="nds-path__stage">
                    <svg class="nds-icon nds-icon_x-small" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                    <span class="nds-assistive-text">Stage Complete</span>
                  </span>
                  <span class="nds-path__title">Contacted</span>
                </a>
              </li>
              <li class="nds-path__item nds-is-complete" role="presentation">
                <a aria-controls="path-content-6" aria-expanded="true" aria-selected="false" class="nds-path__link" href="javascript:void(0);" id="path-6" role="tab" tabindex="-1">
                  <span class="nds-path__stage">
                    <svg class="nds-icon nds-icon_x-small" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                    <span class="nds-assistive-text">Stage Complete</span>
                  </span>
                  <span class="nds-path__title">Open</span>
                </a>
              </li>
              <li class="nds-path__item nds-is-complete" role="presentation">
                <a aria-controls="path-content-7" aria-expanded="true" aria-selected="false" class="nds-path__link" href="javascript:void(0);" id="path-7" role="tab" tabindex="-1">
                  <span class="nds-path__stage">
                    <svg class="nds-icon nds-icon_x-small" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                    <span class="nds-assistive-text">Stage Complete</span>
                  </span>
                  <span class="nds-path__title">Contacted</span>
                </a>
              </li>
              <li class="nds-path__item nds-is-current nds-is-active" role="presentation">
                <a aria-controls="path-content-8" aria-expanded="true" aria-selected="true" class="nds-path__link" href="javascript:void(0);" id="path-8" role="tab" tabindex="0">
                  <span class="nds-path__stage">
                    <svg class="nds-icon nds-icon_x-small" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                    <span class="nds-assistive-text">Current Stage:</span>
                  </span>
                  <span class="nds-path__title">Unqualified</span>
                </a>
              </li>
              <li class="nds-path__item nds-is-incomplete" role="presentation">
                <a aria-controls="path-content-9" aria-expanded="true" aria-selected="false" class="nds-path__link" href="javascript:void(0);" id="path-9" role="tab" tabindex="-1">
                  <span class="nds-path__stage">
                    <svg class="nds-icon nds-icon_x-small" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                  </span>
                  <span class="nds-path__title">Nurturing</span>
                </a>
              </li>
              <li class="nds-path__item nds-is-incomplete" role="presentation">
                <a aria-controls="path-content-10" aria-expanded="true" aria-selected="false" class="nds-path__link" href="javascript:void(0);" id="path-10" role="tab" tabindex="-1">
                  <span class="nds-path__stage">
                    <svg class="nds-icon nds-icon_x-small" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                  </span>
                  <span class="nds-path__title">Closed</span>
                </a>
              </li>
            </ul>
            <div class="nds-path__scroll-controls">
              <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Scroll left">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#left"></use>
                </svg>
                <span class="nds-assistive-text">Scroll left</span>
              </button>
              <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Scroll right">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#right"></use>
                </svg>
                <span class="nds-assistive-text">Scroll right</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="nds-grid nds-path__action">
        <span class="nds-path__stage-name">Stage: Unqualified</span>
        <button class="nds-button nds-button_brand nds-path__mark-complete">
          <svg class="nds-button__icon nds-button__icon_left" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
          </svg>
          Mark Status as Complete

        </button>
      </div>
    </div>
    <div aria-labelledby="path-1" class="nds-path__content nds-hide" id="path-content-1" role="tabpanel">
      <h2>Path 1 Content</h2>
    </div>
    <div aria-labelledby="path-2" class="nds-path__content nds-hide" id="path-content-2" role="tabpanel">
      <h2>Path 2 Content</h2>
    </div>
    <div aria-labelledby="path-3" class="nds-path__content nds-hide" id="path-content-3" role="tabpanel">
      <h2>Path 1 Content</h2>
    </div>
    <div aria-labelledby="path-4" class="nds-path__content nds-hide" id="path-content-4" role="tabpanel">
      <h2>Path 2 Content</h2>
    </div>
    <div aria-labelledby="path-5" class="nds-path__content nds-hide" id="path-content-5" role="tabpanel">
      <h2>Path 1 Content</h2>
    </div>
    <div aria-labelledby="path-6" class="nds-path__content nds-hide" id="path-content-6" role="tabpanel">
      <h2>Path 2 Content</h2>
    </div>
    <div aria-labelledby="path-7" class="nds-path__content nds-hide" id="path-content-7" role="tabpanel">
      <h2>Path 1 Content</h2>
    </div>
    <div aria-labelledby="path-8" class="nds-path__content nds-show" id="path-content-8" role="tabpanel">
      <div class="nds-path__coach nds-grid">
        <div class="nds-path__keys nds-form nds-form_stacked">
          <div class="nds-grid nds-grid_align-spread nds-path__coach-title">
            <h2>Key Fields This Stage</h2>
            <button class="nds-button nds-button_reset nds-text-body_small">Edit</button>
          </div>
          <ul>
            <li class="nds-form-element nds-hint-parent nds-border_bottom nds-form-element_edit">
              <span class="nds-form-element__label">Expected Budget</span>
              <div class="nds-form-element__control">
                <span class="nds-form-element__static">$10,000</span>
                <button class="nds-button nds-button_icon nds-float_right nds-button_icon nds-button_icon-small" title="Edit this Field">
                  <svg class="nds-button__icon nds-button__icon_hint" aria-hidden="true">
                    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
                  </svg>
                  <span class="nds-assistive-text">Edit this Field</span>
                </button>
              </div>
            </li>
            <li class="nds-form-element nds-hint-parent nds-border_bottom nds-form-element_edit">
              <span class="nds-form-element__label">Lead Source</span>
              <div class="nds-form-element__control">
                <span class="nds-form-element__static">Marketing and Web Referral</span>
                <button class="nds-button nds-button_icon nds-float_right nds-button_icon nds-button_icon-small" title="Edit this Field">
                  <svg class="nds-button__icon nds-button__icon_hint" aria-hidden="true">
                    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
                  </svg>
                  <span class="nds-assistive-text">Edit this Field</span>
                </button>
              </div>
            </li>
            <li class="nds-form-element nds-hint-parent nds-border_bottom nds-form-element_edit">
              <span class="nds-form-element__label">Support Engineer</span>
              <div class="nds-form-element__control">
                <span class="nds-form-element__static">Jack Arthur</span>
                <button class="nds-button nds-button_icon nds-float_right nds-button_icon nds-button_icon-small" title="Edit this Field">
                  <svg class="nds-button__icon nds-button__icon_hint" aria-hidden="true">
                    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
                  </svg>
                  <span class="nds-assistive-text">Edit this Field</span>
                </button>
              </div>
            </li>
          </ul>
        </div>
        <div class="nds-path__guidance">
          <h2 class="nds-path__coach-title">Guidance for Success</h2>
          <div class="nds-text-longform nds-path__guidance-content">
            <p>
              Regularly cross-sell related products using



              <a href="javascript:void(0);">cross-sell tactics and principles</a>
              .

            </p>
            <p>
              Prepare demo deck using the



              <a href="javascript:void(0);">latest template</a>
              and review with Marketing and Sales teams. Review demo copy with Legal and Doc team.

            </p>
            <p>
              Look up

              <a href="javascript:void(0);">needs analysis principles</a>


              and review selling plan with Sales Engineer.

            </p>
          </div>
        </div>
      </div>
    </div>
    <div aria-labelledby="path-9" class="nds-path__content nds-hide" id="path-content-9" role="tabpanel">
      <h2>Path 4 Content</h2>
    </div>
    <div aria-labelledby="path-10" class="nds-path__content nds-hide" id="path-content-10" role="tabpanel">
      <h2>Path 5 Content</h2>
    </div>
  </div>
</div>`);
  })
  .add('Small Coaching (states)', () => {
    return withExample(`<div class="nds-region_small" style="width: 360px;">
  <div class="nds-path nds-is-expanded">
    <div class="nds-grid nds-path__track nds-has-overflow">
      <div class="nds-grid nds-path__scroller-container">
        <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-path__trigger nds-flip_vertical" title="Collapse Sales Coaching Tab Panels">
          <svg class="nds-button__icon" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
          </svg>
          <span class="nds-assistive-text">Collapse Sales Coach Tab Panels</span>
        </button>
        <div class="nds-path__scroller" role="application">
          <div class="nds-path__scroller_inner">
            <ul class="nds-path__nav" role="tablist">
              <li class="nds-path__item nds-is-complete" role="presentation">
                <a aria-controls="path-content-1" aria-expanded="true" aria-selected="false" class="nds-path__link" href="javascript:void(0);" id="path-1" role="tab" tabindex="-1">
                  <span class="nds-path__stage">
                    <svg class="nds-icon nds-icon_x-small" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                    <span class="nds-assistive-text">Stage Complete</span>
                  </span>
                  <span class="nds-path__title">Contacted</span>
                </a>
              </li>
              <li class="nds-path__item nds-is-complete" role="presentation">
                <a aria-controls="path-content-2" aria-expanded="true" aria-selected="false" class="nds-path__link" href="javascript:void(0);" id="path-2" role="tab" tabindex="-1">
                  <span class="nds-path__stage">
                    <svg class="nds-icon nds-icon_x-small" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                    <span class="nds-assistive-text">Stage Complete</span>
                  </span>
                  <span class="nds-path__title">Open</span>
                </a>
              </li>
              <li class="nds-path__item nds-is-complete" role="presentation">
                <a aria-controls="path-content-3" aria-expanded="true" aria-selected="false" class="nds-path__link" href="javascript:void(0);" id="path-3" role="tab" tabindex="-1">
                  <span class="nds-path__stage">
                    <svg class="nds-icon nds-icon_x-small" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                    <span class="nds-assistive-text">Stage Complete</span>
                  </span>
                  <span class="nds-path__title">Contacted</span>
                </a>
              </li>
              <li class="nds-path__item nds-is-complete" role="presentation">
                <a aria-controls="path-content-4" aria-expanded="true" aria-selected="false" class="nds-path__link" href="javascript:void(0);" id="path-4" role="tab" tabindex="-1">
                  <span class="nds-path__stage">
                    <svg class="nds-icon nds-icon_x-small" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                    <span class="nds-assistive-text">Stage Complete</span>
                  </span>
                  <span class="nds-path__title">Open</span>
                </a>
              </li>
              <li class="nds-path__item nds-is-complete" role="presentation">
                <a aria-controls="path-content-5" aria-expanded="true" aria-selected="false" class="nds-path__link" href="javascript:void(0);" id="path-5" role="tab" tabindex="-1">
                  <span class="nds-path__stage">
                    <svg class="nds-icon nds-icon_x-small" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                    <span class="nds-assistive-text">Stage Complete</span>
                  </span>
                  <span class="nds-path__title">Contacted</span>
                </a>
              </li>
              <li class="nds-path__item nds-is-complete" role="presentation">
                <a aria-controls="path-content-6" aria-expanded="true" aria-selected="false" class="nds-path__link" href="javascript:void(0);" id="path-6" role="tab" tabindex="-1">
                  <span class="nds-path__stage">
                    <svg class="nds-icon nds-icon_x-small" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                    <span class="nds-assistive-text">Stage Complete</span>
                  </span>
                  <span class="nds-path__title">Open</span>
                </a>
              </li>
              <li class="nds-path__item nds-is-complete" role="presentation">
                <a aria-controls="path-content-7" aria-expanded="true" aria-selected="false" class="nds-path__link" href="javascript:void(0);" id="path-7" role="tab" tabindex="-1">
                  <span class="nds-path__stage">
                    <svg class="nds-icon nds-icon_x-small" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                    <span class="nds-assistive-text">Stage Complete</span>
                  </span>
                  <span class="nds-path__title">Contacted</span>
                </a>
              </li>
              <li class="nds-path__item nds-is-current nds-is-active" role="presentation">
                <a aria-controls="path-content-8" aria-expanded="true" aria-selected="true" class="nds-path__link" href="javascript:void(0);" id="path-8" role="tab" tabindex="0">
                  <span class="nds-path__stage">
                    <svg class="nds-icon nds-icon_x-small" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                    <span class="nds-assistive-text">Current Stage:</span>
                  </span>
                  <span class="nds-path__title">Unqualified</span>
                </a>
              </li>
              <li class="nds-path__item nds-is-incomplete" role="presentation">
                <a aria-controls="path-content-9" aria-expanded="true" aria-selected="false" class="nds-path__link" href="javascript:void(0);" id="path-9" role="tab" tabindex="-1">
                  <span class="nds-path__stage">
                    <svg class="nds-icon nds-icon_x-small" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                  </span>
                  <span class="nds-path__title">Nurturing</span>
                </a>
              </li>
              <li class="nds-path__item nds-is-incomplete" role="presentation">
                <a aria-controls="path-content-10" aria-expanded="true" aria-selected="false" class="nds-path__link" href="javascript:void(0);" id="path-10" role="tab" tabindex="-1">
                  <span class="nds-path__stage">
                    <svg class="nds-icon nds-icon_x-small" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                  </span>
                  <span class="nds-path__title">Closed</span>
                </a>
              </li>
            </ul>
            <div class="nds-path__scroll-controls">
              <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Scroll left">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#left"></use>
                </svg>
                <span class="nds-assistive-text">Scroll left</span>
              </button>
              <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Scroll right">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#right"></use>
                </svg>
                <span class="nds-assistive-text">Scroll right</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="nds-grid nds-path__action">
        <span class="nds-path__stage-name">Stage: Unqualified</span>
        <button class="nds-button nds-button_brand nds-path__mark-complete">
          <svg class="nds-button__icon nds-button__icon_left" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
          </svg>
          Mark Status as Complete

        </button>
      </div>
    </div>
    <div aria-labelledby="path-1" class="nds-path__content nds-hide" id="path-content-1" role="tabpanel">
      <h2>Path 1 Content</h2>
    </div>
    <div aria-labelledby="path-2" class="nds-path__content nds-hide" id="path-content-2" role="tabpanel">
      <h2>Path 2 Content</h2>
    </div>
    <div aria-labelledby="path-3" class="nds-path__content nds-hide" id="path-content-3" role="tabpanel">
      <h2>Path 1 Content</h2>
    </div>
    <div aria-labelledby="path-4" class="nds-path__content nds-hide" id="path-content-4" role="tabpanel">
      <h2>Path 2 Content</h2>
    </div>
    <div aria-labelledby="path-5" class="nds-path__content nds-hide" id="path-content-5" role="tabpanel">
      <h2>Path 1 Content</h2>
    </div>
    <div aria-labelledby="path-6" class="nds-path__content nds-hide" id="path-content-6" role="tabpanel">
      <h2>Path 2 Content</h2>
    </div>
    <div aria-labelledby="path-7" class="nds-path__content nds-hide" id="path-content-7" role="tabpanel">
      <h2>Path 1 Content</h2>
    </div>
    <div aria-labelledby="path-8" class="nds-path__content nds-show" id="path-content-8" role="tabpanel">
      <div class="nds-path__coach nds-grid">
        <div class="nds-path__keys nds-form nds-form_stacked">
          <div class="nds-grid nds-grid_align-spread nds-path__coach-title">
            <h2>Key Fields This Stage</h2>
            <button class="nds-button nds-button_reset nds-text-body_small">Edit</button>
          </div>
          <ul>
            <li class="nds-form-element nds-hint-parent nds-border_bottom nds-form-element_edit">
              <span class="nds-form-element__label">Expected Budget</span>
              <div class="nds-form-element__control">
                <span class="nds-form-element__static">$10,000</span>
                <button class="nds-button nds-button_icon nds-float_right nds-button_icon nds-button_icon-small" title="Edit this Field">
                  <svg class="nds-button__icon nds-button__icon_hint" aria-hidden="true">
                    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
                  </svg>
                  <span class="nds-assistive-text">Edit this Field</span>
                </button>
              </div>
            </li>
            <li class="nds-form-element nds-hint-parent nds-border_bottom nds-form-element_edit">
              <span class="nds-form-element__label">Lead Source</span>
              <div class="nds-form-element__control">
                <span class="nds-form-element__static">Marketing and Web Referral</span>
                <button class="nds-button nds-button_icon nds-float_right nds-button_icon nds-button_icon-small" title="Edit this Field">
                  <svg class="nds-button__icon nds-button__icon_hint" aria-hidden="true">
                    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
                  </svg>
                  <span class="nds-assistive-text">Edit this Field</span>
                </button>
              </div>
            </li>
            <li class="nds-form-element nds-hint-parent nds-border_bottom nds-form-element_edit">
              <span class="nds-form-element__label">Support Engineer</span>
              <div class="nds-form-element__control">
                <span class="nds-form-element__static">Jack Arthur</span>
                <button class="nds-button nds-button_icon nds-float_right nds-button_icon nds-button_icon-small" title="Edit this Field">
                  <svg class="nds-button__icon nds-button__icon_hint" aria-hidden="true">
                    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
                  </svg>
                  <span class="nds-assistive-text">Edit this Field</span>
                </button>
              </div>
            </li>
          </ul>
        </div>
        <div class="nds-path__guidance">
          <h2 class="nds-path__coach-title">Guidance for Success</h2>
          <div class="nds-text-longform nds-path__guidance-content">
            <p>
              Regularly cross-sell related products using



              <a href="javascript:void(0);">cross-sell tactics and principles</a>
              .

            </p>
            <p>
              Prepare demo deck using the



              <a href="javascript:void(0);">latest template</a>
              and review with Marketing and Sales teams. Review demo copy with Legal and Doc team.

            </p>
            <p>
              Look up

              <a href="javascript:void(0);">needs analysis principles</a>


              and review selling plan with Sales Engineer.

            </p>
          </div>
        </div>
      </div>
    </div>
    <div aria-labelledby="path-9" class="nds-path__content nds-hide" id="path-content-9" role="tabpanel">
      <h2>Path 4 Content</h2>
    </div>
    <div aria-labelledby="path-10" class="nds-path__content nds-hide" id="path-content-10" role="tabpanel">
      <h2>Path 5 Content</h2>
    </div>
  </div>
</div>`);
  });
