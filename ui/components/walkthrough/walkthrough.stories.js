import { storiesOf } from '@storybook/html';
import base from 'paths.macro';
import notes from './doc.md';
import scss from './header/_index.scss';
import {
  withExample,
  withDocs,
  commentToHTML
} from '../../../scripts/storybook';

storiesOf(`${base}`, module)
  .addDecorator(withDocs(notes))
  .addDecorator(commentToHTML(scss))
  .add('Default (default)', () => {
    return withExample(`<div class="nds-trial-header nds-grid">
  <div class="nds-grid">
    <button class="nds-button nds-m-right_small">Take the salesforce tour</button>
    <div class="nds-grid nds-dropdown-trigger nds-dropdown-trigger_click">
      <button class="nds-button" aria-haspopup="true">
        <svg class="nds-button__icon nds-button__icon_left" aria-hidden="true">
          <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#right"></use>
        </svg>
        <!-- react-text: 9 -->Choose your tour
        <!-- /react-text -->
      </button>
      <div class="nds-dropdown nds-dropdown_inverse nds-dropdown_left">
        <ul class="nds-dropdown__list" role="menu">
          <li class="nds-dropdown__item nds-is-selected" role="presentation">
            <a href="javascript:void(0);" role="menuitem" tabindex="0">
              <span class="nds-truncate" title="[object Object],[object Object], Conquer Your Cases">
                <svg class="nds-icon nds-icon_selected nds-icon_x-small nds-m-right_x-small" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                </svg>
                <span class="nds-assistive-text">Completed:</span>
                <!-- react-text: 18 -->Conquer Your Cases
                <!-- /react-text -->
              </span>
            </a>
          </li>
          <li class="nds-dropdown__item" role="presentation">
            <a href="javascript:void(0);" role="menuitem" tabindex="-1">
              <span class="nds-truncate" title="[object Object],Automate For Speed">
                <svg class="nds-icon nds-icon_selected nds-icon_x-small nds-m-right_x-small" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                </svg>
                <!-- react-text: 24 -->Automate For Speed
                <!-- /react-text -->
              </span>
            </a>
          </li>
          <li class="nds-dropdown__item" role="presentation">
            <a href="javascript:void(0);" role="menuitem" tabindex="-1">
              <span class="nds-truncate" title="[object Object],Share Your Knowledge">
                <svg class="nds-icon nds-icon_selected nds-icon_x-small nds-m-right_x-small" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                </svg>
                <!-- react-text: 30 -->Share Your Knowledge
                <!-- /react-text -->
              </span>
            </a>
          </li>
          <li class="nds-dropdown__item" role="presentation">
            <a href="javascript:void(0);" role="menuitem" tabindex="-1">
              <span class="nds-truncate" title="[object Object],Finish it up in a Flash">
                <svg class="nds-icon nds-icon_selected nds-icon_x-small nds-m-right_x-small" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                </svg>
                <!-- react-text: 36 -->Finish it up in a Flash
                <!-- /react-text -->
              </span>
            </a>
          </li>
          <li class="nds-has-divider_top-space" role="separator"></li>
          <li class="nds-dropdown__item" role="presentation">
            <a href="javascript:void(0);" role="menuitem" tabindex="-1">
              <span class="nds-truncate" title="[object Object],Import Contacts and Accounts">
                <svg class="nds-icon nds-icon_x-small nds-m-right_x-small" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#upload"></use>
                </svg>
                <!-- react-text: 43 -->Import Contacts and Accounts
                <!-- /react-text -->
              </span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
  <div class="nds-grid nds-grid_vertical-align-center nds-col_bump-left">
    <span class="nds-box nds-box_xx-small nds-theme_default">30</span>
    <span class="nds-m-horizontal_x-small">Days left in trial</span>
    <a href="javascript:void(0);" class="nds-button nds-button_success">Subscribe Now</a>
  </div>
</div>`);
  })
  .add('Menu Open (states)', () => {
    return withExample(`<div class="demo-only" style="height: 240px;">
  <div class="nds-trial-header nds-grid">
    <div class="nds-grid">
      <button class="nds-button nds-m-right_small">Take the salesforce tour</button>
      <div class="nds-grid nds-dropdown-trigger nds-dropdown-trigger_click nds-is-open">
        <button class="nds-button" aria-haspopup="true">
          <svg class="nds-button__icon nds-button__icon_left" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#right"></use>
          </svg>
          <!-- react-text: 10 -->Choose your tour
          <!-- /react-text -->
        </button>
        <div class="nds-dropdown nds-dropdown_inverse nds-dropdown_left">
          <ul class="nds-dropdown__list" role="menu">
            <li class="nds-dropdown__item nds-is-selected" role="presentation">
              <a href="javascript:void(0);" role="menuitem" tabindex="0">
                <span class="nds-truncate" title="[object Object],[object Object], Conquer Your Cases">
                  <svg class="nds-icon nds-icon_selected nds-icon_x-small nds-m-right_x-small" aria-hidden="true">
                    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                  </svg>
                  <span class="nds-assistive-text">Completed:</span>
                  <!-- react-text: 19 -->Conquer Your Cases
                  <!-- /react-text -->
                </span>
              </a>
            </li>
            <li class="nds-dropdown__item" role="presentation">
              <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                <span class="nds-truncate" title="[object Object],Automate For Speed">
                  <svg class="nds-icon nds-icon_selected nds-icon_x-small nds-m-right_x-small" aria-hidden="true">
                    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                  </svg>
                  <!-- react-text: 25 -->Automate For Speed
                  <!-- /react-text -->
                </span>
              </a>
            </li>
            <li class="nds-dropdown__item" role="presentation">
              <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                <span class="nds-truncate" title="[object Object],Share Your Knowledge">
                  <svg class="nds-icon nds-icon_selected nds-icon_x-small nds-m-right_x-small" aria-hidden="true">
                    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                  </svg>
                  <!-- react-text: 31 -->Share Your Knowledge
                  <!-- /react-text -->
                </span>
              </a>
            </li>
            <li class="nds-dropdown__item" role="presentation">
              <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                <span class="nds-truncate" title="[object Object],Finish it up in a Flash">
                  <svg class="nds-icon nds-icon_selected nds-icon_x-small nds-m-right_x-small" aria-hidden="true">
                    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                  </svg>
                  <!-- react-text: 37 -->Finish it up in a Flash
                  <!-- /react-text -->
                </span>
              </a>
            </li>
            <li class="nds-has-divider_top-space" role="separator"></li>
            <li class="nds-dropdown__item" role="presentation">
              <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                <span class="nds-truncate" title="[object Object],Import Contacts and Accounts">
                  <svg class="nds-icon nds-icon_x-small nds-m-right_x-small" aria-hidden="true">
                    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#upload"></use>
                  </svg>
                  <!-- react-text: 44 -->Import Contacts and Accounts
                  <!-- /react-text -->
                </span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="nds-grid nds-grid_vertical-align-center nds-col_bump-left">
      <span class="nds-box nds-box_xx-small nds-theme_default">30</span>
      <span class="nds-m-horizontal_x-small">Days left in trial</span>
      <a href="javascript:void(0);" class="nds-button nds-button_success">Subscribe Now</a>
    </div>
  </div>
</div>`);
  });
