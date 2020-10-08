import { storiesOf } from '@storybook/html';
import base from 'paths.macro';
import notes from './doc.md';
import scss from './navigation-bar/_index.scss';
import {
  withExample,
  withDocs,
  commentToHTML
} from '../../../scripts/storybook';

storiesOf(`${base}`, module)
  .addDecorator(withDocs(notes))
  .addDecorator(commentToHTML(scss))
  .add('Default (default)', () => {
    return withExample(`<div style="height: 16rem;">
  <div class="nds-context-bar">
    <div class="nds-context-bar__primary">
      <div class="nds-context-bar__item nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-no-hover">
        <div class="nds-context-bar__icon-action">
          <button class="nds-button nds-icon-waffle_container nds-context-bar__button" title="Description of the icon when needed">
            <span class="nds-icon-waffle">
              <span class="nds-r1"></span>
              <span class="nds-r2"></span>
              <span class="nds-r3"></span>
              <span class="nds-r4"></span>
              <span class="nds-r5"></span>
              <span class="nds-r6"></span>
              <span class="nds-r7"></span>
              <span class="nds-r8"></span>
              <span class="nds-r9"></span>
            </span>
            <span class="nds-assistive-text">Open App Launcher</span>
          </button>
        </div>
        <span class="nds-context-bar__label-action nds-context-bar__app-name">
          <span class="nds-truncate" title="App Name">App Name</span>
        </span>
      </div>
    </div>
    <nav class="nds-context-bar__secondary" role="navigation">
      <ul class="nds-grid">
        <li class="nds-context-bar__item">
          <a href="javascript:void(0);" class="nds-context-bar__label-action" title="Home">
            <span class="nds-truncate" title="Home">Home</span>
          </a>
        </li>
        <li class="nds-context-bar__item nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_hover">
          <a href="javascript:void(0);" class="nds-context-bar__label-action" title="Menu Item">
            <span class="nds-truncate" title="Menu Item">Menu Item</span>
          </a>
          <div class="nds-context-bar__icon-action nds-p-left_none">
            <button class="nds-button nds-button_icon nds-button_icon nds-context-bar__button" aria-haspopup="true" title="Open menu item submenu">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
              </svg>
              <span class="nds-assistive-text">Open menu item submenu</span>
            </button>
          </div>
          <div class="nds-dropdown nds-dropdown_right">
            <ul class="nds-dropdown__list" role="menu">
              <li class="nds-dropdown__item" role="presentation">
                <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                  <span class="nds-truncate" title="[object Object],Main action">
                    <svg class="nds-icon nds-icon_x-small nds-icon-text-default nds-m-right_x-small" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#add"></use>
                    </svg>
                    Main action

                  </span>
                </a>
              </li>
              <li class="nds-dropdown__header nds-has-divider_top-space" role="separator">
                <span class="nds-text-title_caps">Menu header</span>
              </li>
              <li class="nds-dropdown__item" role="presentation">
                <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                  <span class="nds-truncate" title="Menu Item One">
                    Menu Item One

                  </span>
                </a>
              </li>
              <li class="nds-dropdown__item" role="presentation">
                <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                  <span class="nds-truncate" title="Menu Item Two">
                    Menu Item Two

                  </span>
                </a>
              </li>
              <li class="nds-dropdown__item" role="presentation">
                <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                  <span class="nds-truncate" title="Menu Item Three">
                    Menu Item Three

                  </span>
                </a>
              </li>
            </ul>
          </div>
        </li>
        <li class="nds-context-bar__item">
          <a href="javascript:void(0);" class="nds-context-bar__label-action" title="Menu Item">
            <span class="nds-truncate" title="Menu Item">Menu Item</span>
          </a>
        </li>
        <li class="nds-context-bar__item">
          <a href="javascript:void(0);" class="nds-context-bar__label-action" title="Menu Item">
            <span class="nds-truncate" title="Menu Item">Menu Item</span>
          </a>
        </li>
        <li class="nds-context-bar__item">
          <a href="javascript:void(0);" class="nds-context-bar__label-action" title="Menu Item">
            <span class="nds-truncate" title="Menu Item">Menu Item</span>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</div>`);
  })
  .add('Item Active (states)', () => {
    return withExample(`<div style="height: 16rem;">
  <div class="nds-context-bar">
    <div class="nds-context-bar__primary">
      <div class="nds-context-bar__item nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-no-hover">
        <div class="nds-context-bar__icon-action">
          <button class="nds-button nds-icon-waffle_container nds-context-bar__button" title="Description of the icon when needed">
            <span class="nds-icon-waffle">
              <span class="nds-r1"></span>
              <span class="nds-r2"></span>
              <span class="nds-r3"></span>
              <span class="nds-r4"></span>
              <span class="nds-r5"></span>
              <span class="nds-r6"></span>
              <span class="nds-r7"></span>
              <span class="nds-r8"></span>
              <span class="nds-r9"></span>
            </span>
            <span class="nds-assistive-text">Open App Launcher</span>
          </button>
        </div>
        <span class="nds-context-bar__label-action nds-context-bar__app-name">
          <span class="nds-truncate" title="App Name">App Name</span>
        </span>
      </div>
    </div>
    <nav class="nds-context-bar__secondary" role="navigation">
      <ul class="nds-grid">
        <li class="nds-context-bar__item">
          <a href="javascript:void(0);" class="nds-context-bar__label-action" title="Home">
            <span class="nds-truncate" title="Home">Home</span>
          </a>
        </li>
        <li class="nds-context-bar__item nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_hover">
          <a href="javascript:void(0);" class="nds-context-bar__label-action" title="Menu Item">
            <span class="nds-truncate" title="Menu Item">Menu Item</span>
          </a>
          <div class="nds-context-bar__icon-action nds-p-left_none">
            <button class="nds-button nds-button_icon nds-button_icon nds-context-bar__button" aria-haspopup="true" title="Open menu item submenu">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
              </svg>
              <span class="nds-assistive-text">Open menu item submenu</span>
            </button>
          </div>
          <div class="nds-dropdown nds-dropdown_right">
            <ul class="nds-dropdown__list" role="menu">
              <li class="nds-dropdown__item" role="presentation">
                <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                  <span class="nds-truncate" title="[object Object],Main action">
                    <svg class="nds-icon nds-icon_x-small nds-icon-text-default nds-m-right_x-small" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#add"></use>
                    </svg>
                    Main action

                  </span>
                </a>
              </li>
              <li class="nds-dropdown__header nds-has-divider_top-space" role="separator">
                <span class="nds-text-title_caps">Menu header</span>
              </li>
              <li class="nds-dropdown__item" role="presentation">
                <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                  <span class="nds-truncate" title="Menu Item One">
                    Menu Item One

                  </span>
                </a>
              </li>
              <li class="nds-dropdown__item" role="presentation">
                <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                  <span class="nds-truncate" title="Menu Item Two">
                    Menu Item Two

                  </span>
                </a>
              </li>
              <li class="nds-dropdown__item" role="presentation">
                <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                  <span class="nds-truncate" title="Menu Item Three">
                    Menu Item Three

                  </span>
                </a>
              </li>
            </ul>
          </div>
        </li>
        <li class="nds-context-bar__item nds-is-active">
          <a href="javascript:void(0);" class="nds-context-bar__label-action" title="Menu Item">
            <span class="nds-assistive-text">Current Page:</span>
            <span class="nds-truncate" title="Menu Item">Menu Item</span>
          </a>
        </li>
        <li class="nds-context-bar__item">
          <a href="javascript:void(0);" class="nds-context-bar__label-action" title="Menu Item 0">
            <span class="nds-truncate" title="Menu Item">Menu Item</span>
          </a>
        </li>
        <li class="nds-context-bar__item">
          <a href="javascript:void(0);" class="nds-context-bar__label-action" title="Menu Item 1">
            <span class="nds-truncate" title="Menu Item">Menu Item</span>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</div>`);
  });
