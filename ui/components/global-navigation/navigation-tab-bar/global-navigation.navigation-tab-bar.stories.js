import { storiesOf } from '@storybook/html';
import base from 'paths.macro';
import notes from '../doc.md';
import scss from '../navigation-bar/_index.scss';
import {
  withExample,
  withDocs,
  commentToHTML
} from '../../../../scripts/storybook';

storiesOf(`${base}`, module)
  .addDecorator(withDocs(notes))
  .addDecorator(commentToHTML(scss))
  .add('Default (default)', () => {
    return withExample(`<div style="height: 16rem;">
  <div class="demo-only">
    <div class="nds-context-bar nds-context-bar_tabs">
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
        <div class="nds-context-bar__item nds-context-bar__object-switcher nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click">
          <a href="javascript:void(0);" class="nds-context-bar__label-action">
            <span class="nds-truncate" title="Object">Object</span>
          </a>
          <div class="nds-context-bar__icon-action">
            <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" title="Open object switcher menu">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
              </svg>
              <span class="nds-assistive-text">Open object switcher menu</span>
            </button>
          </div>
          <div class="nds-dropdown nds-dropdown_right">
            <ul class="nds-dropdown__list" role="menu">
              <li class="nds-dropdown__item" role="presentation">
                <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                  <span class="nds-truncate" title="[object Object],Accounts">
                    <svg class="nds-icon nds-icon_small nds-icon-standard-account nds-m-right_small" aria-hidden="true">
                      <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#account"></use>
                    </svg>
                    Accounts

                  </span>
                </a>
              </li>
              <li class="nds-dropdown__item" role="presentation">
                <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                  <span class="nds-truncate" title="[object Object],Cases">
                    <svg class="nds-icon nds-icon_small nds-icon-standard-case nds-m-right_small" aria-hidden="true">
                      <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#case"></use>
                    </svg>
                    Cases

                  </span>
                </a>
              </li>
              <li class="nds-dropdown__item" role="presentation">
                <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                  <span class="nds-truncate" title="[object Object],Insights">
                    <svg class="nds-icon nds-icon_small nds-icon-standard-work-order nds-m-right_small" aria-hidden="true">
                      <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#work_order"></use>
                    </svg>
                    Insights

                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div class="nds-context-bar__item nds-dropdown-trigger nds-dropdown-trigger_click">
          <div class="nds-context-bar__icon-action">
            <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-small" aria-expanded="false" aria-controls="id_of_split_view_container" title="Toggle split view">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#side_list"></use>
              </svg>
              <span class="nds-assistive-text">Toggle split view</span>
            </button>
          </div>
        </div>
        <div class="nds-context-bar__vertical-divider"></div>
        <div class="nds-context-bar__item nds-dropdown-trigger nds-dropdown-trigger_click">
          <div class="nds-context-bar__icon-action">
            <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-small" title="Open a New Tab">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#add"></use>
              </svg>
              <span class="nds-assistive-text">Open a New Tab</span>
            </button>
          </div>
        </div>
      </div>
      <div class="nds-context-bar__secondary">
        <div class="nds-context-bar__vertical-divider"></div>
        <ul class="nds-grid" role="tablist">
          <li class="nds-context-bar__item nds-context-bar__item_tab nds-is-active" role="presentation">
            <a href="javascript:void(0);" class="nds-context-bar__label-action" role="tab" title="Home" aria-selected="true" tabindex="0" aria-controls="context-tab-panel-1" id="context-tab-id-1">
              <div class="nds-icon_container" title="Home">
                <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                  <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#home"></use>
                </svg>
                <span class="nds-assistive-text">Home</span>
              </div>
              <span class="nds-truncate" title="Home">Home</span>
            </a>
            <div class="nds-context-bar__icon-action nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-p-left_none nds-p-right_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" tabindex="0" title="Actions for Home">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
                </svg>
                <span class="nds-assistive-text">Actions for Home</span>
              </button>
              <div class="nds-dropdown nds-dropdown_right">
                <ul class="nds-dropdown__list" role="menu">
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Refresh Tab">
                        Refresh Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        r

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Open in a new window">
                        Open in a new window

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        ⇧ + n

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Pin Tab">
                        Pin Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        p

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Close Tab">
                        Close Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        w

                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="nds-context-bar__icon-action nds-col_bump-left nds-p-left_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" tabindex="0" title="Close Home">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                </svg>
                <span class="nds-assistive-text">Close Home</span>
              </button>
            </div>
          </li>
          <li class="nds-context-bar__item nds-context-bar__item_tab" role="presentation">
            <a href="javascript:void(0);" class="nds-context-bar__label-action" role="tab" title="Tab Item 1" aria-selected="false" tabindex="-1" aria-controls="context-tab-panel-2" id="context-tab-id-2">
              <div class="nds-icon_container" title="Case">
                <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                  <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#case"></use>
                </svg>
                <span class="nds-assistive-text">Case</span>
              </div>
              <span class="nds-truncate" title="Tab Item 1">Tab Item 1</span>
            </a>
            <div class="nds-context-bar__icon-action nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-p-left_none nds-p-right_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" tabindex="-1" title="Actions for Tab Item 1">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
                </svg>
                <span class="nds-assistive-text">Actions for Tab Item 1</span>
              </button>
              <div class="nds-dropdown nds-dropdown_right">
                <ul class="nds-dropdown__list" role="menu">
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Refresh Tab">
                        Refresh Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        r

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Open in a new window">
                        Open in a new window

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        ⇧ + n

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Pin Tab">
                        Pin Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        p

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Close Tab">
                        Close Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        w

                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="nds-context-bar__icon-action nds-col_bump-left nds-p-left_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" tabindex="-1" title="Close Tab Item 1">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                </svg>
                <span class="nds-assistive-text">Close Tab Item 1</span>
              </button>
            </div>
          </li>
          <li class="nds-context-bar__item nds-context-bar__item_tab" role="presentation">
            <a href="javascript:void(0);" class="nds-context-bar__label-action" role="tab" title="Tab Item 2" aria-selected="false" tabindex="-1" aria-controls="context-tab-panel-3" id="context-tab-id-3">
              <div class="nds-icon_container" title="Case">
                <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                  <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#case"></use>
                </svg>
                <span class="nds-assistive-text">Case</span>
              </div>
              <span class="nds-truncate" title="Tab Item 2">Tab Item 2</span>
            </a>
            <div class="nds-context-bar__icon-action nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-p-left_none nds-p-right_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" tabindex="-1" title="Actions for Tab Item 2">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
                </svg>
                <span class="nds-assistive-text">Actions for Tab Item 2</span>
              </button>
              <div class="nds-dropdown nds-dropdown_right">
                <ul class="nds-dropdown__list" role="menu">
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Refresh Tab">
                        Refresh Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        r

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Open in a new window">
                        Open in a new window

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        ⇧ + n

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Pin Tab">
                        Pin Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        p

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Close Tab">
                        Close Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        w

                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="nds-context-bar__icon-action nds-col_bump-left nds-p-left_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" tabindex="-1" title="Close Tab Item 2">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                </svg>
                <span class="nds-assistive-text">Close Tab Item 2</span>
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div id="context-tab-panel-1" class="nds-p-vertical_medium nds-show" role="tabpanel" aria-labelledby="context-tab-id-1">Tab Home Content</div>
    <div id="context-tab-panel-2" class="nds-p-vertical_medium nds-hide" role="tabpanel" aria-labelledby="context-tab-id-2">Tab One Content</div>
    <div id="context-tab-panel-3" class="nds-p-vertical_medium nds-hide" role="tabpanel" aria-labelledby="context-tab-id-3">Tab Two Content</div>
  </div>
</div>`);
  })
  .add('Split View (states)', () => {
    return withExample(`<div style="height: 16rem;">
  <div class="demo-only">
    <div class="nds-context-bar nds-context-bar_tabs">
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
        <div class="nds-context-bar__item nds-context-bar__object-switcher nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click">
          <a href="javascript:void(0);" class="nds-context-bar__label-action">
            <span class="nds-truncate" title="Object">Object</span>
          </a>
          <div class="nds-context-bar__icon-action">
            <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" title="Open object switcher menu">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
              </svg>
              <span class="nds-assistive-text">Open object switcher menu</span>
            </button>
          </div>
          <div class="nds-dropdown nds-dropdown_right">
            <ul class="nds-dropdown__list" role="menu">
              <li class="nds-dropdown__item" role="presentation">
                <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                  <span class="nds-truncate" title="[object Object],Accounts">
                    <svg class="nds-icon nds-icon_small nds-icon-standard-account nds-m-right_small" aria-hidden="true">
                      <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#account"></use>
                    </svg>
                    Accounts

                  </span>
                </a>
              </li>
              <li class="nds-dropdown__item" role="presentation">
                <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                  <span class="nds-truncate" title="[object Object],Cases">
                    <svg class="nds-icon nds-icon_small nds-icon-standard-case nds-m-right_small" aria-hidden="true">
                      <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#case"></use>
                    </svg>
                    Cases

                  </span>
                </a>
              </li>
              <li class="nds-dropdown__item" role="presentation">
                <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                  <span class="nds-truncate" title="[object Object],Insights">
                    <svg class="nds-icon nds-icon_small nds-icon-standard-work-order nds-m-right_small" aria-hidden="true">
                      <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#work_order"></use>
                    </svg>
                    Insights

                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div class="nds-context-bar__item nds-dropdown-trigger nds-dropdown-trigger_click">
          <div class="nds-context-bar__icon-action">
            <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-small nds-is-selected" aria-expanded="true" aria-controls="id_of_split_view_container" title="Toggle split view">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#side_list"></use>
              </svg>
              <span class="nds-assistive-text">Toggle split view</span>
            </button>
          </div>
        </div>
        <div class="nds-context-bar__vertical-divider"></div>
        <div class="nds-context-bar__item nds-dropdown-trigger nds-dropdown-trigger_click">
          <div class="nds-context-bar__icon-action">
            <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-small" title="Open a New Tab">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#add"></use>
              </svg>
              <span class="nds-assistive-text">Open a New Tab</span>
            </button>
          </div>
        </div>
      </div>
      <div class="nds-context-bar__secondary">
        <div class="nds-context-bar__vertical-divider"></div>
        <ul class="nds-grid" role="tablist">
          <li class="nds-context-bar__item nds-context-bar__item_tab nds-is-active" role="presentation">
            <a href="javascript:void(0);" class="nds-context-bar__label-action" role="tab" title="Home" aria-selected="true" tabindex="0" aria-controls="context-tab-panel-1" id="context-tab-id-1">
              <div class="nds-icon_container" title="Home">
                <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                  <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#home"></use>
                </svg>
                <span class="nds-assistive-text">Home</span>
              </div>
              <span class="nds-truncate" title="Home">Home</span>
            </a>
            <div class="nds-context-bar__icon-action nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-p-left_none nds-p-right_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" tabindex="0" title="Actions for Home">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
                </svg>
                <span class="nds-assistive-text">Actions for Home</span>
              </button>
              <div class="nds-dropdown nds-dropdown_right">
                <ul class="nds-dropdown__list" role="menu">
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Refresh Tab">
                        Refresh Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        r

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Open in a new window">
                        Open in a new window

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        ⇧ + n

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Pin Tab">
                        Pin Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        p

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Close Tab">
                        Close Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        w

                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="nds-context-bar__icon-action nds-col_bump-left nds-p-left_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" tabindex="0" title="Close Home">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                </svg>
                <span class="nds-assistive-text">Close Home</span>
              </button>
            </div>
          </li>
          <li class="nds-context-bar__item nds-context-bar__item_tab" role="presentation">
            <a href="javascript:void(0);" class="nds-context-bar__label-action" role="tab" title="Tab Item 1" aria-selected="false" tabindex="-1" aria-controls="context-tab-panel-2" id="context-tab-id-2">
              <div class="nds-icon_container" title="Case">
                <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                  <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#case"></use>
                </svg>
                <span class="nds-assistive-text">Case</span>
              </div>
              <span class="nds-truncate" title="Tab Item 1">Tab Item 1</span>
            </a>
            <div class="nds-context-bar__icon-action nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-p-left_none nds-p-right_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" tabindex="-1" title="Actions for Tab Item 1">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
                </svg>
                <span class="nds-assistive-text">Actions for Tab Item 1</span>
              </button>
              <div class="nds-dropdown nds-dropdown_right">
                <ul class="nds-dropdown__list" role="menu">
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Refresh Tab">
                        Refresh Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        r

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Open in a new window">
                        Open in a new window

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        ⇧ + n

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Pin Tab">
                        Pin Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        p

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Close Tab">
                        Close Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        w

                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="nds-context-bar__icon-action nds-col_bump-left nds-p-left_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" tabindex="-1" title="Close Tab Item 1">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                </svg>
                <span class="nds-assistive-text">Close Tab Item 1</span>
              </button>
            </div>
          </li>
          <li class="nds-context-bar__item nds-context-bar__item_tab" role="presentation">
            <a href="javascript:void(0);" class="nds-context-bar__label-action" role="tab" title="Tab Item 2" aria-selected="false" tabindex="-1" aria-controls="context-tab-panel-3" id="context-tab-id-3">
              <div class="nds-icon_container" title="Case">
                <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                  <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#case"></use>
                </svg>
                <span class="nds-assistive-text">Case</span>
              </div>
              <span class="nds-truncate" title="Tab Item 2">Tab Item 2</span>
            </a>
            <div class="nds-context-bar__icon-action nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-p-left_none nds-p-right_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" tabindex="-1" title="Actions for Tab Item 2">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
                </svg>
                <span class="nds-assistive-text">Actions for Tab Item 2</span>
              </button>
              <div class="nds-dropdown nds-dropdown_right">
                <ul class="nds-dropdown__list" role="menu">
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Refresh Tab">
                        Refresh Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        r

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Open in a new window">
                        Open in a new window

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        ⇧ + n

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Pin Tab">
                        Pin Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        p

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Close Tab">
                        Close Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        w

                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="nds-context-bar__icon-action nds-col_bump-left nds-p-left_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" tabindex="-1" title="Close Tab Item 2">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                </svg>
                <span class="nds-assistive-text">Close Tab Item 2</span>
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div id="context-tab-panel-1" class="nds-p-vertical_medium nds-show" role="tabpanel" aria-labelledby="context-tab-id-1">Tab Home Content</div>
    <div id="context-tab-panel-2" class="nds-p-vertical_medium nds-hide" role="tabpanel" aria-labelledby="context-tab-id-2">Tab One Content</div>
    <div id="context-tab-panel-3" class="nds-p-vertical_medium nds-hide" role="tabpanel" aria-labelledby="context-tab-id-3">Tab Two Content</div>
  </div>
</div>`);
  })
  .add('Tab Active (states)', () => {
    return withExample(`<div style="height: 16rem;">
  <div class="demo-only">
    <div class="nds-context-bar nds-context-bar_tabs">
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
        <div class="nds-context-bar__item nds-context-bar__object-switcher nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click">
          <a href="javascript:void(0);" class="nds-context-bar__label-action">
            <span class="nds-truncate" title="Object">Object</span>
          </a>
          <div class="nds-context-bar__icon-action">
            <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" title="Open object switcher menu">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
              </svg>
              <span class="nds-assistive-text">Open object switcher menu</span>
            </button>
          </div>
          <div class="nds-dropdown nds-dropdown_right">
            <ul class="nds-dropdown__list" role="menu">
              <li class="nds-dropdown__item" role="presentation">
                <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                  <span class="nds-truncate" title="[object Object],Accounts">
                    <svg class="nds-icon nds-icon_small nds-icon-standard-account nds-m-right_small" aria-hidden="true">
                      <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#account"></use>
                    </svg>
                    Accounts

                  </span>
                </a>
              </li>
              <li class="nds-dropdown__item" role="presentation">
                <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                  <span class="nds-truncate" title="[object Object],Cases">
                    <svg class="nds-icon nds-icon_small nds-icon-standard-case nds-m-right_small" aria-hidden="true">
                      <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#case"></use>
                    </svg>
                    Cases

                  </span>
                </a>
              </li>
              <li class="nds-dropdown__item" role="presentation">
                <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                  <span class="nds-truncate" title="[object Object],Insights">
                    <svg class="nds-icon nds-icon_small nds-icon-standard-work-order nds-m-right_small" aria-hidden="true">
                      <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#work_order"></use>
                    </svg>
                    Insights

                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div class="nds-context-bar__item nds-dropdown-trigger nds-dropdown-trigger_click">
          <div class="nds-context-bar__icon-action">
            <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-small" aria-expanded="false" aria-controls="id_of_split_view_container" title="Toggle split view">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#side_list"></use>
              </svg>
              <span class="nds-assistive-text">Toggle split view</span>
            </button>
          </div>
        </div>
        <div class="nds-context-bar__vertical-divider"></div>
        <div class="nds-context-bar__item nds-dropdown-trigger nds-dropdown-trigger_click">
          <div class="nds-context-bar__icon-action">
            <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-small" title="Open a New Tab">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#add"></use>
              </svg>
              <span class="nds-assistive-text">Open a New Tab</span>
            </button>
          </div>
        </div>
      </div>
      <div class="nds-context-bar__secondary">
        <div class="nds-context-bar__vertical-divider"></div>
        <ul class="nds-grid" role="tablist">
          <li class="nds-context-bar__item nds-context-bar__item_tab" role="presentation">
            <a href="javascript:void(0);" class="nds-context-bar__label-action" role="tab" title="Home" aria-selected="false" tabindex="-1" aria-controls="context-tab-panel-1" id="context-tab-id-1">
              <div class="nds-icon_container" title="Home">
                <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                  <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#home"></use>
                </svg>
                <span class="nds-assistive-text">Home</span>
              </div>
              <span class="nds-truncate" title="Home">Home</span>
            </a>
            <div class="nds-context-bar__icon-action nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-p-left_none nds-p-right_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" tabindex="-1" title="Actions for Home">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
                </svg>
                <span class="nds-assistive-text">Actions for Home</span>
              </button>
              <div class="nds-dropdown nds-dropdown_right">
                <ul class="nds-dropdown__list" role="menu">
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Refresh Tab">
                        Refresh Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        r

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Open in a new window">
                        Open in a new window

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        ⇧ + n

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Pin Tab">
                        Pin Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        p

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Close Tab">
                        Close Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        w

                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="nds-context-bar__icon-action nds-col_bump-left nds-p-left_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" tabindex="-1" title="Close Home">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                </svg>
                <span class="nds-assistive-text">Close Home</span>
              </button>
            </div>
          </li>
          <li class="nds-context-bar__item nds-context-bar__item_tab nds-is-active" role="presentation">
            <a href="javascript:void(0);" class="nds-context-bar__label-action" role="tab" title="Tab Item 1" aria-selected="true" tabindex="0" aria-controls="context-tab-panel-2" id="context-tab-id-2">
              <div class="nds-icon_container" title="Case">
                <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                  <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#case"></use>
                </svg>
                <span class="nds-assistive-text">Case</span>
              </div>
              <span class="nds-truncate" title="Tab Item 1">Tab Item 1</span>
            </a>
            <div class="nds-context-bar__icon-action nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-p-left_none nds-p-right_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" tabindex="0" title="Actions for Tab Item 1">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
                </svg>
                <span class="nds-assistive-text">Actions for Tab Item 1</span>
              </button>
              <div class="nds-dropdown nds-dropdown_right">
                <ul class="nds-dropdown__list" role="menu">
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Refresh Tab">
                        Refresh Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        r

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Open in a new window">
                        Open in a new window

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        ⇧ + n

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Pin Tab">
                        Pin Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        p

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Close Tab">
                        Close Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        w

                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="nds-context-bar__icon-action nds-col_bump-left nds-p-left_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" tabindex="0" title="Close Tab Item 1">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                </svg>
                <span class="nds-assistive-text">Close Tab Item 1</span>
              </button>
            </div>
          </li>
          <li class="nds-context-bar__item nds-context-bar__item_tab" role="presentation">
            <a href="javascript:void(0);" class="nds-context-bar__label-action" role="tab" title="Tab Item 2" aria-selected="false" tabindex="-1" aria-controls="context-tab-panel-3" id="context-tab-id-3">
              <div class="nds-icon_container" title="Case">
                <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                  <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#case"></use>
                </svg>
                <span class="nds-assistive-text">Case</span>
              </div>
              <span class="nds-truncate" title="Tab Item 2">Tab Item 2</span>
            </a>
            <div class="nds-context-bar__icon-action nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-p-left_none nds-p-right_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" tabindex="-1" title="Actions for Tab Item 2">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
                </svg>
                <span class="nds-assistive-text">Actions for Tab Item 2</span>
              </button>
              <div class="nds-dropdown nds-dropdown_right">
                <ul class="nds-dropdown__list" role="menu">
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Refresh Tab">
                        Refresh Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        r

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Open in a new window">
                        Open in a new window

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        ⇧ + n

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Pin Tab">
                        Pin Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        p

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Close Tab">
                        Close Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        w

                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="nds-context-bar__icon-action nds-col_bump-left nds-p-left_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" tabindex="-1" title="Close Tab Item 2">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                </svg>
                <span class="nds-assistive-text">Close Tab Item 2</span>
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div id="context-tab-panel-1" class="nds-p-vertical_medium nds-hide" role="tabpanel" aria-labelledby="context-tab-id-1">Tab Home Content</div>
    <div id="context-tab-panel-2" class="nds-p-vertical_medium nds-show" role="tabpanel" aria-labelledby="context-tab-id-2">Tab One Content</div>
    <div id="context-tab-panel-3" class="nds-p-vertical_medium nds-hide" role="tabpanel" aria-labelledby="context-tab-id-3">Tab Two Content</div>
  </div>
</div>`);
  })
  .add('Tab Active Focus (states)', () => {
    return withExample(`<div style="height: 16rem;">
  <div class="demo-only">
    <div class="nds-context-bar nds-context-bar_tabs">
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
        <div class="nds-context-bar__item nds-context-bar__object-switcher nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click">
          <a href="javascript:void(0);" class="nds-context-bar__label-action">
            <span class="nds-truncate" title="Object">Object</span>
          </a>
          <div class="nds-context-bar__icon-action">
            <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" title="Open object switcher menu">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
              </svg>
              <span class="nds-assistive-text">Open object switcher menu</span>
            </button>
          </div>
          <div class="nds-dropdown nds-dropdown_right">
            <ul class="nds-dropdown__list" role="menu">
              <li class="nds-dropdown__item" role="presentation">
                <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                  <span class="nds-truncate" title="[object Object],Accounts">
                    <svg class="nds-icon nds-icon_small nds-icon-standard-account nds-m-right_small" aria-hidden="true">
                      <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#account"></use>
                    </svg>
                    Accounts

                  </span>
                </a>
              </li>
              <li class="nds-dropdown__item" role="presentation">
                <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                  <span class="nds-truncate" title="[object Object],Cases">
                    <svg class="nds-icon nds-icon_small nds-icon-standard-case nds-m-right_small" aria-hidden="true">
                      <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#case"></use>
                    </svg>
                    Cases

                  </span>
                </a>
              </li>
              <li class="nds-dropdown__item" role="presentation">
                <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                  <span class="nds-truncate" title="[object Object],Insights">
                    <svg class="nds-icon nds-icon_small nds-icon-standard-work-order nds-m-right_small" aria-hidden="true">
                      <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#work_order"></use>
                    </svg>
                    Insights

                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div class="nds-context-bar__item nds-dropdown-trigger nds-dropdown-trigger_click">
          <div class="nds-context-bar__icon-action">
            <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-small" aria-expanded="false" aria-controls="id_of_split_view_container" title="Toggle split view">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#side_list"></use>
              </svg>
              <span class="nds-assistive-text">Toggle split view</span>
            </button>
          </div>
        </div>
        <div class="nds-context-bar__vertical-divider"></div>
        <div class="nds-context-bar__item nds-dropdown-trigger nds-dropdown-trigger_click">
          <div class="nds-context-bar__icon-action">
            <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-small" title="Open a New Tab">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#add"></use>
              </svg>
              <span class="nds-assistive-text">Open a New Tab</span>
            </button>
          </div>
        </div>
      </div>
      <div class="nds-context-bar__secondary">
        <div class="nds-context-bar__vertical-divider"></div>
        <ul class="nds-grid" role="tablist">
          <li class="nds-context-bar__item nds-context-bar__item_tab" role="presentation">
            <a href="javascript:void(0);" class="nds-context-bar__label-action" role="tab" title="Home" aria-selected="false" tabindex="-1" aria-controls="context-tab-panel-1" id="context-tab-id-1">
              <div class="nds-icon_container" title="Home">
                <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                  <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#home"></use>
                </svg>
                <span class="nds-assistive-text">Home</span>
              </div>
              <span class="nds-truncate" title="Home">Home</span>
            </a>
            <div class="nds-context-bar__icon-action nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-p-left_none nds-p-right_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" tabindex="-1" title="Actions for Home">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
                </svg>
                <span class="nds-assistive-text">Actions for Home</span>
              </button>
              <div class="nds-dropdown nds-dropdown_right">
                <ul class="nds-dropdown__list" role="menu">
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Refresh Tab">
                        Refresh Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        r

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Open in a new window">
                        Open in a new window

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        ⇧ + n

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Pin Tab">
                        Pin Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        p

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Close Tab">
                        Close Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        w

                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="nds-context-bar__icon-action nds-col_bump-left nds-p-left_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" tabindex="-1" title="Close Home">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                </svg>
                <span class="nds-assistive-text">Close Home</span>
              </button>
            </div>
          </li>
          <li class="nds-context-bar__item nds-context-bar__item_tab nds-has-focus nds-is-active" role="presentation">
            <a href="javascript:void(0);" class="nds-context-bar__label-action" role="tab" title="Tab Item 1" aria-selected="true" tabindex="0" aria-controls="context-tab-panel-2" id="context-tab-id-2">
              <div class="nds-icon_container" title="Case">
                <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                  <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#case"></use>
                </svg>
                <span class="nds-assistive-text">Case</span>
              </div>
              <span class="nds-truncate" title="Tab Item 1">Tab Item 1</span>
            </a>
            <div class="nds-context-bar__icon-action nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-p-left_none nds-p-right_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" tabindex="0" title="Actions for Tab Item 1">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
                </svg>
                <span class="nds-assistive-text">Actions for Tab Item 1</span>
              </button>
              <div class="nds-dropdown nds-dropdown_right">
                <ul class="nds-dropdown__list" role="menu">
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Refresh Tab">
                        Refresh Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        r

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Open in a new window">
                        Open in a new window

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        ⇧ + n

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Pin Tab">
                        Pin Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        p

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Close Tab">
                        Close Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        w

                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="nds-context-bar__icon-action nds-col_bump-left nds-p-left_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" tabindex="0" title="Close Tab Item 1">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                </svg>
                <span class="nds-assistive-text">Close Tab Item 1</span>
              </button>
            </div>
          </li>
          <li class="nds-context-bar__item nds-context-bar__item_tab" role="presentation">
            <a href="javascript:void(0);" class="nds-context-bar__label-action" role="tab" title="Tab Item 2" aria-selected="false" tabindex="-1" aria-controls="context-tab-panel-3" id="context-tab-id-3">
              <div class="nds-icon_container" title="Case">
                <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                  <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#case"></use>
                </svg>
                <span class="nds-assistive-text">Case</span>
              </div>
              <span class="nds-truncate" title="Tab Item 2">Tab Item 2</span>
            </a>
            <div class="nds-context-bar__icon-action nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-p-left_none nds-p-right_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" tabindex="-1" title="Actions for Tab Item 2">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
                </svg>
                <span class="nds-assistive-text">Actions for Tab Item 2</span>
              </button>
              <div class="nds-dropdown nds-dropdown_right">
                <ul class="nds-dropdown__list" role="menu">
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Refresh Tab">
                        Refresh Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        r

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Open in a new window">
                        Open in a new window

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        ⇧ + n

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Pin Tab">
                        Pin Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        p

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Close Tab">
                        Close Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        w

                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="nds-context-bar__icon-action nds-col_bump-left nds-p-left_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" tabindex="-1" title="Close Tab Item 2">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                </svg>
                <span class="nds-assistive-text">Close Tab Item 2</span>
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div id="context-tab-panel-1" class="nds-p-vertical_medium nds-hide" role="tabpanel" aria-labelledby="context-tab-id-1">Tab Home Content</div>
    <div id="context-tab-panel-2" class="nds-p-vertical_medium nds-show" role="tabpanel" aria-labelledby="context-tab-id-2">Tab One Content</div>
    <div id="context-tab-panel-3" class="nds-p-vertical_medium nds-hide" role="tabpanel" aria-labelledby="context-tab-id-3">Tab Two Content</div>
  </div>
</div>`);
  })
  .add('Tab Item Action Menu Open (states)', () => {
    return withExample(`<div style="height: 16rem;">
  <div class="demo-only" style="height: 12rem;">
    <div class="nds-context-bar nds-context-bar_tabs">
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
        <div class="nds-context-bar__item nds-context-bar__object-switcher nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click">
          <a href="javascript:void(0);" class="nds-context-bar__label-action">
            <span class="nds-truncate" title="Object">Object</span>
          </a>
          <div class="nds-context-bar__icon-action">
            <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" title="Open object switcher menu">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
              </svg>
              <span class="nds-assistive-text">Open object switcher menu</span>
            </button>
          </div>
          <div class="nds-dropdown nds-dropdown_right">
            <ul class="nds-dropdown__list" role="menu">
              <li class="nds-dropdown__item" role="presentation">
                <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                  <span class="nds-truncate" title="[object Object],Accounts">
                    <svg class="nds-icon nds-icon_small nds-icon-standard-account nds-m-right_small" aria-hidden="true">
                      <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#account"></use>
                    </svg>
                    Accounts

                  </span>
                </a>
              </li>
              <li class="nds-dropdown__item" role="presentation">
                <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                  <span class="nds-truncate" title="[object Object],Cases">
                    <svg class="nds-icon nds-icon_small nds-icon-standard-case nds-m-right_small" aria-hidden="true">
                      <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#case"></use>
                    </svg>
                    Cases

                  </span>
                </a>
              </li>
              <li class="nds-dropdown__item" role="presentation">
                <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                  <span class="nds-truncate" title="[object Object],Insights">
                    <svg class="nds-icon nds-icon_small nds-icon-standard-work-order nds-m-right_small" aria-hidden="true">
                      <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#work_order"></use>
                    </svg>
                    Insights

                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div class="nds-context-bar__item nds-dropdown-trigger nds-dropdown-trigger_click">
          <div class="nds-context-bar__icon-action">
            <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-small" aria-expanded="false" aria-controls="id_of_split_view_container" title="Toggle split view">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#side_list"></use>
              </svg>
              <span class="nds-assistive-text">Toggle split view</span>
            </button>
          </div>
        </div>
        <div class="nds-context-bar__vertical-divider"></div>
        <div class="nds-context-bar__item nds-dropdown-trigger nds-dropdown-trigger_click">
          <div class="nds-context-bar__icon-action">
            <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-small" title="Open a New Tab">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#add"></use>
              </svg>
              <span class="nds-assistive-text">Open a New Tab</span>
            </button>
          </div>
        </div>
      </div>
      <div class="nds-context-bar__secondary">
        <div class="nds-context-bar__vertical-divider"></div>
        <ul class="nds-grid" role="tablist">
          <li class="nds-context-bar__item nds-context-bar__item_tab" role="presentation">
            <a href="javascript:void(0);" class="nds-context-bar__label-action" role="tab" title="Home" aria-selected="false" tabindex="-1" aria-controls="context-tab-panel-1" id="context-tab-id-1">
              <div class="nds-icon_container" title="Home">
                <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                  <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#home"></use>
                </svg>
                <span class="nds-assistive-text">Home</span>
              </div>
              <span class="nds-truncate" title="Home">Home</span>
            </a>
            <div class="nds-context-bar__icon-action nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-p-left_none nds-p-right_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" tabindex="-1" title="Actions for Home">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
                </svg>
                <span class="nds-assistive-text">Actions for Home</span>
              </button>
              <div class="nds-dropdown nds-dropdown_right">
                <ul class="nds-dropdown__list" role="menu">
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Refresh Tab">
                        Refresh Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        r

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Open in a new window">
                        Open in a new window

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        ⇧ + n

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Pin Tab">
                        Pin Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        p

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Close Tab">
                        Close Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        w

                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="nds-context-bar__icon-action nds-col_bump-left nds-p-left_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" tabindex="-1" title="Close Home">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                </svg>
                <span class="nds-assistive-text">Close Home</span>
              </button>
            </div>
          </li>
          <li class="nds-context-bar__item nds-context-bar__item_tab nds-is-active" role="presentation">
            <a href="javascript:void(0);" class="nds-context-bar__label-action" role="tab" title="Tab Item 1" aria-selected="true" tabindex="0" aria-controls="context-tab-panel-2" id="context-tab-id-2">
              <div class="nds-icon_container" title="Case">
                <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                  <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#case"></use>
                </svg>
                <span class="nds-assistive-text">Case</span>
              </div>
              <span class="nds-truncate" title="Tab Item 1">Tab Item 1</span>
            </a>
            <div class="nds-context-bar__icon-action nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-p-left_none nds-p-right_none nds-is-open">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" tabindex="0" title="Actions for Tab Item 1">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
                </svg>
                <span class="nds-assistive-text">Actions for Tab Item 1</span>
              </button>
              <div class="nds-dropdown nds-dropdown_right">
                <ul class="nds-dropdown__list" role="menu">
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Refresh Tab">
                        Refresh Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        r

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Open in a new window">
                        Open in a new window

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        ⇧ + n

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Pin Tab">
                        Pin Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        p

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Close Tab">
                        Close Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        w

                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="nds-context-bar__icon-action nds-col_bump-left nds-p-left_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" tabindex="0" title="Close Tab Item 1">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                </svg>
                <span class="nds-assistive-text">Close Tab Item 1</span>
              </button>
            </div>
          </li>
          <li class="nds-context-bar__item nds-context-bar__item_tab" role="presentation">
            <a href="javascript:void(0);" class="nds-context-bar__label-action" role="tab" title="Tab Item 2" aria-selected="false" tabindex="-1" aria-controls="context-tab-panel-3" id="context-tab-id-3">
              <div class="nds-icon_container" title="Case">
                <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                  <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#case"></use>
                </svg>
                <span class="nds-assistive-text">Case</span>
              </div>
              <span class="nds-truncate" title="Tab Item 2">Tab Item 2</span>
            </a>
            <div class="nds-context-bar__icon-action nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-p-left_none nds-p-right_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" tabindex="-1" title="Actions for Tab Item 2">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
                </svg>
                <span class="nds-assistive-text">Actions for Tab Item 2</span>
              </button>
              <div class="nds-dropdown nds-dropdown_right">
                <ul class="nds-dropdown__list" role="menu">
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Refresh Tab">
                        Refresh Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        r

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Open in a new window">
                        Open in a new window

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        ⇧ + n

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Pin Tab">
                        Pin Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        p

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Close Tab">
                        Close Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        w

                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="nds-context-bar__icon-action nds-col_bump-left nds-p-left_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" tabindex="-1" title="Close Tab Item 2">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                </svg>
                <span class="nds-assistive-text">Close Tab Item 2</span>
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div id="context-tab-panel-1" class="nds-p-vertical_medium nds-hide" role="tabpanel" aria-labelledby="context-tab-id-1">Tab Home Content</div>
    <div id="context-tab-panel-2" class="nds-p-vertical_medium nds-show" role="tabpanel" aria-labelledby="context-tab-id-2">Tab One Content</div>
    <div id="context-tab-panel-3" class="nds-p-vertical_medium nds-hide" role="tabpanel" aria-labelledby="context-tab-id-3">Tab Two Content</div>
  </div>
</div>`);
  })
  .add('Unsaved Tab (states)', () => {
    return withExample(`<div style="height: 16rem;">
  <div class="demo-only">
    <div class="nds-context-bar nds-context-bar_tabs">
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
        <div class="nds-context-bar__item nds-context-bar__object-switcher nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click">
          <a href="javascript:void(0);" class="nds-context-bar__label-action">
            <span class="nds-truncate" title="Object">Object</span>
          </a>
          <div class="nds-context-bar__icon-action">
            <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" title="Open object switcher menu">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
              </svg>
              <span class="nds-assistive-text">Open object switcher menu</span>
            </button>
          </div>
          <div class="nds-dropdown nds-dropdown_right">
            <ul class="nds-dropdown__list" role="menu">
              <li class="nds-dropdown__item" role="presentation">
                <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                  <span class="nds-truncate" title="[object Object],Accounts">
                    <svg class="nds-icon nds-icon_small nds-icon-standard-account nds-m-right_small" aria-hidden="true">
                      <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#account"></use>
                    </svg>
                    Accounts

                  </span>
                </a>
              </li>
              <li class="nds-dropdown__item" role="presentation">
                <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                  <span class="nds-truncate" title="[object Object],Cases">
                    <svg class="nds-icon nds-icon_small nds-icon-standard-case nds-m-right_small" aria-hidden="true">
                      <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#case"></use>
                    </svg>
                    Cases

                  </span>
                </a>
              </li>
              <li class="nds-dropdown__item" role="presentation">
                <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                  <span class="nds-truncate" title="[object Object],Insights">
                    <svg class="nds-icon nds-icon_small nds-icon-standard-work-order nds-m-right_small" aria-hidden="true">
                      <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#work_order"></use>
                    </svg>
                    Insights

                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div class="nds-context-bar__item nds-dropdown-trigger nds-dropdown-trigger_click">
          <div class="nds-context-bar__icon-action">
            <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-small" aria-expanded="false" aria-controls="id_of_split_view_container" title="Toggle split view">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#side_list"></use>
              </svg>
              <span class="nds-assistive-text">Toggle split view</span>
            </button>
          </div>
        </div>
        <div class="nds-context-bar__vertical-divider"></div>
        <div class="nds-context-bar__item nds-dropdown-trigger nds-dropdown-trigger_click">
          <div class="nds-context-bar__icon-action">
            <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-small" title="Open a New Tab">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#add"></use>
              </svg>
              <span class="nds-assistive-text">Open a New Tab</span>
            </button>
          </div>
        </div>
      </div>
      <div class="nds-context-bar__secondary">
        <div class="nds-context-bar__vertical-divider"></div>
        <ul class="nds-grid" role="tablist">
          <li class="nds-context-bar__item nds-context-bar__item_tab nds-is-active" role="presentation">
            <a href="javascript:void(0);" class="nds-context-bar__label-action" role="tab" title="Home" aria-selected="true" tabindex="0" aria-controls="context-tab-panel-1" id="context-tab-id-1">
              <div class="nds-icon_container" title="Home">
                <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                  <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#home"></use>
                </svg>
                <span class="nds-assistive-text">Home</span>
              </div>
              <span class="nds-truncate" title="Home">Home</span>
            </a>
            <div class="nds-context-bar__icon-action nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-p-left_none nds-p-right_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" tabindex="0" title="Actions for Home">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
                </svg>
                <span class="nds-assistive-text">Actions for Home</span>
              </button>
              <div class="nds-dropdown nds-dropdown_right">
                <ul class="nds-dropdown__list" role="menu">
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Refresh Tab">
                        Refresh Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        r

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Open in a new window">
                        Open in a new window

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        ⇧ + n

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Pin Tab">
                        Pin Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        p

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Close Tab">
                        Close Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        w

                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="nds-context-bar__icon-action nds-col_bump-left nds-p-left_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" tabindex="0" title="Close Home">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                </svg>
                <span class="nds-assistive-text">Close Home</span>
              </button>
            </div>
          </li>
          <li class="nds-context-bar__item nds-context-bar__item_tab" role="presentation">
            <a href="javascript:void(0);" class="nds-context-bar__label-action" role="tab" title="Tab Item 1" aria-selected="false" tabindex="-1" aria-controls="context-tab-panel-2" id="context-tab-id-2">
              <div class="nds-icon_container" title="Case">
                <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                  <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#case"></use>
                </svg>
                <span class="nds-assistive-text">Case</span>
              </div>
              <span class="nds-truncate" title="Tab Item 1">Tab Item 1</span>
            </a>
            <div class="nds-context-bar__icon-action nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-p-left_none nds-p-right_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" tabindex="-1" title="Actions for Tab Item 1">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
                </svg>
                <span class="nds-assistive-text">Actions for Tab Item 1</span>
              </button>
              <div class="nds-dropdown nds-dropdown_right">
                <ul class="nds-dropdown__list" role="menu">
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Refresh Tab">
                        Refresh Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        r

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Open in a new window">
                        Open in a new window

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        ⇧ + n

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Pin Tab">
                        Pin Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        p

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Close Tab">
                        Close Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        w

                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="nds-context-bar__icon-action nds-col_bump-left nds-p-left_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" tabindex="-1" title="Close Tab Item 1">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                </svg>
                <span class="nds-assistive-text">Close Tab Item 1</span>
              </button>
            </div>
          </li>
          <li class="nds-context-bar__item nds-context-bar__item_tab nds-is-unsaved" role="presentation">
            <a href="javascript:void(0);" class="nds-context-bar__label-action" role="tab" title="Tab Item 2" aria-selected="false" tabindex="-1" aria-controls="context-tab-panel-3" id="context-tab-id-3">
              <abbr class="nds-indicator_unsaved" title="Tab Not Saved">*</abbr>
              <div class="nds-icon_container" title="Case">
                <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                  <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#case"></use>
                </svg>
                <span class="nds-assistive-text">Case</span>
              </div>
              <span class="nds-truncate" title="Tab Item 2">Tab Item 2</span>
            </a>
            <div class="nds-context-bar__icon-action nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-p-left_none nds-p-right_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" tabindex="-1" title="Actions for Tab Item 2">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
                </svg>
                <span class="nds-assistive-text">Actions for Tab Item 2</span>
              </button>
              <div class="nds-dropdown nds-dropdown_right">
                <ul class="nds-dropdown__list" role="menu">
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Refresh Tab">
                        Refresh Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        r

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Open in a new window">
                        Open in a new window

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        ⇧ + n

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Pin Tab">
                        Pin Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        p

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Close Tab">
                        Close Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        w

                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="nds-context-bar__icon-action nds-col_bump-left nds-p-left_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" tabindex="-1" title="Close Tab Item 2">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                </svg>
                <span class="nds-assistive-text">Close Tab Item 2</span>
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div id="context-tab-panel-1" class="nds-p-vertical_medium nds-show" role="tabpanel" aria-labelledby="context-tab-id-1">Tab Home Content</div>
    <div id="context-tab-panel-2" class="nds-p-vertical_medium nds-hide" role="tabpanel" aria-labelledby="context-tab-id-2">Tab One Content</div>
    <div id="context-tab-panel-3" class="nds-p-vertical_medium nds-hide" role="tabpanel" aria-labelledby="context-tab-id-3">Tab Two Content</div>
  </div>
</div>`);
  })
  .add('Unread Tab (states)', () => {
    return withExample(`<div style="height: 16rem;">
  <div class="demo-only">
    <div class="nds-context-bar nds-context-bar_tabs">
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
        <div class="nds-context-bar__item nds-context-bar__object-switcher nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click">
          <a href="javascript:void(0);" class="nds-context-bar__label-action">
            <span class="nds-truncate" title="Object">Object</span>
          </a>
          <div class="nds-context-bar__icon-action">
            <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" title="Open object switcher menu">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
              </svg>
              <span class="nds-assistive-text">Open object switcher menu</span>
            </button>
          </div>
          <div class="nds-dropdown nds-dropdown_right">
            <ul class="nds-dropdown__list" role="menu">
              <li class="nds-dropdown__item" role="presentation">
                <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                  <span class="nds-truncate" title="[object Object],Accounts">
                    <svg class="nds-icon nds-icon_small nds-icon-standard-account nds-m-right_small" aria-hidden="true">
                      <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#account"></use>
                    </svg>
                    Accounts

                  </span>
                </a>
              </li>
              <li class="nds-dropdown__item" role="presentation">
                <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                  <span class="nds-truncate" title="[object Object],Cases">
                    <svg class="nds-icon nds-icon_small nds-icon-standard-case nds-m-right_small" aria-hidden="true">
                      <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#case"></use>
                    </svg>
                    Cases

                  </span>
                </a>
              </li>
              <li class="nds-dropdown__item" role="presentation">
                <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                  <span class="nds-truncate" title="[object Object],Insights">
                    <svg class="nds-icon nds-icon_small nds-icon-standard-work-order nds-m-right_small" aria-hidden="true">
                      <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#work_order"></use>
                    </svg>
                    Insights

                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div class="nds-context-bar__item nds-dropdown-trigger nds-dropdown-trigger_click">
          <div class="nds-context-bar__icon-action">
            <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-small" aria-expanded="false" aria-controls="id_of_split_view_container" title="Toggle split view">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#side_list"></use>
              </svg>
              <span class="nds-assistive-text">Toggle split view</span>
            </button>
          </div>
        </div>
        <div class="nds-context-bar__vertical-divider"></div>
        <div class="nds-context-bar__item nds-dropdown-trigger nds-dropdown-trigger_click">
          <div class="nds-context-bar__icon-action">
            <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-small" title="Open a New Tab">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#add"></use>
              </svg>
              <span class="nds-assistive-text">Open a New Tab</span>
            </button>
          </div>
        </div>
      </div>
      <div class="nds-context-bar__secondary">
        <div class="nds-context-bar__vertical-divider"></div>
        <ul class="nds-grid" role="tablist">
          <li class="nds-context-bar__item nds-context-bar__item_tab nds-is-active" role="presentation">
            <a href="javascript:void(0);" class="nds-context-bar__label-action" role="tab" title="Home" aria-selected="true" tabindex="0" aria-controls="context-tab-panel-1" id="context-tab-id-1">
              <div class="nds-icon_container" title="Home">
                <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                  <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#home"></use>
                </svg>
                <span class="nds-assistive-text">Home</span>
              </div>
              <span class="nds-truncate" title="Home">Home</span>
            </a>
            <div class="nds-context-bar__icon-action nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-p-left_none nds-p-right_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" tabindex="0" title="Actions for Home">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
                </svg>
                <span class="nds-assistive-text">Actions for Home</span>
              </button>
              <div class="nds-dropdown nds-dropdown_right">
                <ul class="nds-dropdown__list" role="menu">
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Refresh Tab">
                        Refresh Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        r

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Open in a new window">
                        Open in a new window

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        ⇧ + n

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Pin Tab">
                        Pin Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        p

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Close Tab">
                        Close Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        w

                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="nds-context-bar__icon-action nds-col_bump-left nds-p-left_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" tabindex="0" title="Close Home">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                </svg>
                <span class="nds-assistive-text">Close Home</span>
              </button>
            </div>
          </li>
          <li class="nds-context-bar__item nds-context-bar__item_tab" role="presentation">
            <a href="javascript:void(0);" class="nds-context-bar__label-action" role="tab" title="Tab Item 1" aria-selected="false" tabindex="-1" aria-controls="context-tab-panel-2" id="context-tab-id-2">
              <div class="nds-icon_container" title="Case">
                <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                  <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#case"></use>
                </svg>
                <span class="nds-assistive-text">Case</span>
              </div>
              <span class="nds-truncate" title="Tab Item 1">Tab Item 1</span>
            </a>
            <div class="nds-context-bar__icon-action nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-p-left_none nds-p-right_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" tabindex="-1" title="Actions for Tab Item 1">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
                </svg>
                <span class="nds-assistive-text">Actions for Tab Item 1</span>
              </button>
              <div class="nds-dropdown nds-dropdown_right">
                <ul class="nds-dropdown__list" role="menu">
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Refresh Tab">
                        Refresh Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        r

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Open in a new window">
                        Open in a new window

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        ⇧ + n

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Pin Tab">
                        Pin Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        p

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Close Tab">
                        Close Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        w

                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="nds-context-bar__icon-action nds-col_bump-left nds-p-left_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" tabindex="-1" title="Close Tab Item 1">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                </svg>
                <span class="nds-assistive-text">Close Tab Item 1</span>
              </button>
            </div>
          </li>
          <li class="nds-context-bar__item nds-context-bar__item_tab nds-has-notification" role="presentation">
            <a href="javascript:void(0);" class="nds-context-bar__label-action" role="tab" title="Chat - Customer" aria-selected="false" tabindex="-1" aria-controls="context-tab-panel-3" id="context-tab-id-3">
              <span aria-label="New Activity" class="nds-indicator_unread" role="alert" title="New Activity">
                <span class="nds-assistive-text">
                  New activity in Tab:

                  Chat - Customer

                </span>
              </span>
              <div class="nds-icon_container" title="Live Chat">
                <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                  <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#live_chat"></use>
                </svg>
                <span class="nds-assistive-text">Live Chat</span>
              </div>
              <span class="nds-truncate" title="Chat - Customer">Chat - Customer</span>
            </a>
            <div class="nds-context-bar__icon-action nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-p-left_none nds-p-right_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" tabindex="-1" title="Actions for Chat - Customer">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
                </svg>
                <span class="nds-assistive-text">Actions for Chat - Customer</span>
              </button>
              <div class="nds-dropdown nds-dropdown_right">
                <ul class="nds-dropdown__list" role="menu">
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Refresh Tab">
                        Refresh Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        r

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Open in a new window">
                        Open in a new window

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        ⇧ + n

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Pin Tab">
                        Pin Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        p

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Close Tab">
                        Close Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        w

                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="nds-context-bar__icon-action nds-col_bump-left nds-p-left_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" tabindex="-1" title="Close Chat - Customer">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                </svg>
                <span class="nds-assistive-text">Close Chat - Customer</span>
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div id="context-tab-panel-1" class="nds-p-vertical_medium nds-show" role="tabpanel" aria-labelledby="context-tab-id-1">Tab Home Content</div>
    <div id="context-tab-panel-2" class="nds-p-vertical_medium nds-hide" role="tabpanel" aria-labelledby="context-tab-id-2">Tab One Content</div>
    <div id="context-tab-panel-3" class="nds-p-vertical_medium nds-hide" role="tabpanel" aria-labelledby="context-tab-id-3">Tab Two Content</div>
  </div>
</div>`);
  })
  .add('Unread Unsaved Tab (states)', () => {
    return withExample(`<div style="height: 16rem;">
  <div class="demo-only">
    <div class="nds-context-bar nds-context-bar_tabs">
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
        <div class="nds-context-bar__item nds-context-bar__object-switcher nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click">
          <a href="javascript:void(0);" class="nds-context-bar__label-action">
            <span class="nds-truncate" title="Object">Object</span>
          </a>
          <div class="nds-context-bar__icon-action">
            <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" title="Open object switcher menu">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
              </svg>
              <span class="nds-assistive-text">Open object switcher menu</span>
            </button>
          </div>
          <div class="nds-dropdown nds-dropdown_right">
            <ul class="nds-dropdown__list" role="menu">
              <li class="nds-dropdown__item" role="presentation">
                <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                  <span class="nds-truncate" title="[object Object],Accounts">
                    <svg class="nds-icon nds-icon_small nds-icon-standard-account nds-m-right_small" aria-hidden="true">
                      <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#account"></use>
                    </svg>
                    Accounts

                  </span>
                </a>
              </li>
              <li class="nds-dropdown__item" role="presentation">
                <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                  <span class="nds-truncate" title="[object Object],Cases">
                    <svg class="nds-icon nds-icon_small nds-icon-standard-case nds-m-right_small" aria-hidden="true">
                      <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#case"></use>
                    </svg>
                    Cases

                  </span>
                </a>
              </li>
              <li class="nds-dropdown__item" role="presentation">
                <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                  <span class="nds-truncate" title="[object Object],Insights">
                    <svg class="nds-icon nds-icon_small nds-icon-standard-work-order nds-m-right_small" aria-hidden="true">
                      <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#work_order"></use>
                    </svg>
                    Insights

                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div class="nds-context-bar__item nds-dropdown-trigger nds-dropdown-trigger_click">
          <div class="nds-context-bar__icon-action">
            <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-small" aria-expanded="false" aria-controls="id_of_split_view_container" title="Toggle split view">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#side_list"></use>
              </svg>
              <span class="nds-assistive-text">Toggle split view</span>
            </button>
          </div>
        </div>
        <div class="nds-context-bar__vertical-divider"></div>
        <div class="nds-context-bar__item nds-dropdown-trigger nds-dropdown-trigger_click">
          <div class="nds-context-bar__icon-action">
            <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-small" title="Open a New Tab">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#add"></use>
              </svg>
              <span class="nds-assistive-text">Open a New Tab</span>
            </button>
          </div>
        </div>
      </div>
      <div class="nds-context-bar__secondary">
        <div class="nds-context-bar__vertical-divider"></div>
        <ul class="nds-grid" role="tablist">
          <li class="nds-context-bar__item nds-context-bar__item_tab nds-is-active" role="presentation">
            <a href="javascript:void(0);" class="nds-context-bar__label-action" role="tab" title="Home" aria-selected="true" tabindex="0" aria-controls="context-tab-panel-1" id="context-tab-id-1">
              <div class="nds-icon_container" title="Home">
                <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                  <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#home"></use>
                </svg>
                <span class="nds-assistive-text">Home</span>
              </div>
              <span class="nds-truncate" title="Home">Home</span>
            </a>
            <div class="nds-context-bar__icon-action nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-p-left_none nds-p-right_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" tabindex="0" title="Actions for Home">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
                </svg>
                <span class="nds-assistive-text">Actions for Home</span>
              </button>
              <div class="nds-dropdown nds-dropdown_right">
                <ul class="nds-dropdown__list" role="menu">
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Refresh Tab">
                        Refresh Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        r

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Open in a new window">
                        Open in a new window

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        ⇧ + n

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Pin Tab">
                        Pin Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        p

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Close Tab">
                        Close Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        w

                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="nds-context-bar__icon-action nds-col_bump-left nds-p-left_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" tabindex="0" title="Close Home">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                </svg>
                <span class="nds-assistive-text">Close Home</span>
              </button>
            </div>
          </li>
          <li class="nds-context-bar__item nds-context-bar__item_tab" role="presentation">
            <a href="javascript:void(0);" class="nds-context-bar__label-action" role="tab" title="Tab Item 1" aria-selected="false" tabindex="-1" aria-controls="context-tab-panel-2" id="context-tab-id-2">
              <div class="nds-icon_container" title="Case">
                <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                  <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#case"></use>
                </svg>
                <span class="nds-assistive-text">Case</span>
              </div>
              <span class="nds-truncate" title="Tab Item 1">Tab Item 1</span>
            </a>
            <div class="nds-context-bar__icon-action nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-p-left_none nds-p-right_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" tabindex="-1" title="Actions for Tab Item 1">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
                </svg>
                <span class="nds-assistive-text">Actions for Tab Item 1</span>
              </button>
              <div class="nds-dropdown nds-dropdown_right">
                <ul class="nds-dropdown__list" role="menu">
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Refresh Tab">
                        Refresh Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        r

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Open in a new window">
                        Open in a new window

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        ⇧ + n

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Pin Tab">
                        Pin Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        p

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Close Tab">
                        Close Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        w

                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="nds-context-bar__icon-action nds-col_bump-left nds-p-left_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" tabindex="-1" title="Close Tab Item 1">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                </svg>
                <span class="nds-assistive-text">Close Tab Item 1</span>
              </button>
            </div>
          </li>
          <li class="nds-context-bar__item nds-context-bar__item_tab nds-is-unsaved nds-has-notification" role="presentation">
            <a href="javascript:void(0);" class="nds-context-bar__label-action" role="tab" title="Chat - Customer" aria-selected="false" tabindex="-1" aria-controls="context-tab-panel-3" id="context-tab-id-3">
              <abbr class="nds-indicator_unsaved" title="Tab Not Saved">*</abbr>
              <span aria-label="New Activity" class="nds-indicator_unread" role="alert" title="New Activity">
                <span class="nds-assistive-text">
                  New activity in Tab:

                  Chat - Customer

                </span>
              </span>
              <div class="nds-icon_container" title="Live Chat">
                <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                  <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#live_chat"></use>
                </svg>
                <span class="nds-assistive-text">Live Chat</span>
              </div>
              <span class="nds-truncate" title="Chat - Customer">Chat - Customer</span>
            </a>
            <div class="nds-context-bar__icon-action nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-p-left_none nds-p-right_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" tabindex="-1" title="Actions for Chat - Customer">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
                </svg>
                <span class="nds-assistive-text">Actions for Chat - Customer</span>
              </button>
              <div class="nds-dropdown nds-dropdown_right">
                <ul class="nds-dropdown__list" role="menu">
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Refresh Tab">
                        Refresh Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        r

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Open in a new window">
                        Open in a new window

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        ⇧ + n

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Pin Tab">
                        Pin Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        p

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Close Tab">
                        Close Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        w

                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="nds-context-bar__icon-action nds-col_bump-left nds-p-left_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" tabindex="-1" title="Close Chat - Customer">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                </svg>
                <span class="nds-assistive-text">Close Chat - Customer</span>
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div id="context-tab-panel-1" class="nds-p-vertical_medium nds-show" role="tabpanel" aria-labelledby="context-tab-id-1">Tab Home Content</div>
    <div id="context-tab-panel-2" class="nds-p-vertical_medium nds-hide" role="tabpanel" aria-labelledby="context-tab-id-2">Tab One Content</div>
    <div id="context-tab-panel-3" class="nds-p-vertical_medium nds-hide" role="tabpanel" aria-labelledby="context-tab-id-3">Tab Two Content</div>
  </div>
</div>`);
  })
  .add('Pinned Tab (states)', () => {
    return withExample(`<div style="height: 16rem;">
  <div class="demo-only">
    <div class="nds-context-bar nds-context-bar_tabs">
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
        <div class="nds-context-bar__item nds-context-bar__object-switcher nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click">
          <a href="javascript:void(0);" class="nds-context-bar__label-action">
            <span class="nds-truncate" title="Object">Object</span>
          </a>
          <div class="nds-context-bar__icon-action">
            <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" title="Open object switcher menu">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
              </svg>
              <span class="nds-assistive-text">Open object switcher menu</span>
            </button>
          </div>
          <div class="nds-dropdown nds-dropdown_right">
            <ul class="nds-dropdown__list" role="menu">
              <li class="nds-dropdown__item" role="presentation">
                <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                  <span class="nds-truncate" title="[object Object],Accounts">
                    <svg class="nds-icon nds-icon_small nds-icon-standard-account nds-m-right_small" aria-hidden="true">
                      <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#account"></use>
                    </svg>
                    Accounts

                  </span>
                </a>
              </li>
              <li class="nds-dropdown__item" role="presentation">
                <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                  <span class="nds-truncate" title="[object Object],Cases">
                    <svg class="nds-icon nds-icon_small nds-icon-standard-case nds-m-right_small" aria-hidden="true">
                      <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#case"></use>
                    </svg>
                    Cases

                  </span>
                </a>
              </li>
              <li class="nds-dropdown__item" role="presentation">
                <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                  <span class="nds-truncate" title="[object Object],Insights">
                    <svg class="nds-icon nds-icon_small nds-icon-standard-work-order nds-m-right_small" aria-hidden="true">
                      <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#work_order"></use>
                    </svg>
                    Insights

                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div class="nds-context-bar__item nds-dropdown-trigger nds-dropdown-trigger_click">
          <div class="nds-context-bar__icon-action">
            <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-small" aria-expanded="false" aria-controls="id_of_split_view_container" title="Toggle split view">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#side_list"></use>
              </svg>
              <span class="nds-assistive-text">Toggle split view</span>
            </button>
          </div>
        </div>
        <div class="nds-context-bar__vertical-divider"></div>
        <div class="nds-context-bar__item nds-dropdown-trigger nds-dropdown-trigger_click">
          <div class="nds-context-bar__icon-action">
            <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-small" title="Open a New Tab">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#add"></use>
              </svg>
              <span class="nds-assistive-text">Open a New Tab</span>
            </button>
          </div>
        </div>
      </div>
      <div class="nds-context-bar__secondary">
        <div class="nds-context-bar__vertical-divider"></div>
        <ul class="nds-grid" role="tablist">
          <li class="nds-context-bar__item nds-context-bar__item_tab nds-is-pinned" role="presentation">
            <a href="javascript:void(0);" class="nds-context-bar__label-action" role="tab" title="Home" aria-selected="false" tabindex="-1" aria-controls="context-tab-panel-1" id="context-tab-id-1">
              <div class="nds-icon_container" title="Home">
                <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                  <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#home"></use>
                </svg>
                <span class="nds-assistive-text">Home</span>
              </div>
              <span class="nds-truncate nds-assistive-text" title="Home">Home</span>
            </a>
            <div class="nds-context-bar__icon-action nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-p-left_none nds-p-right_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" tabindex="-1" title="Actions for Home">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
                </svg>
                <span class="nds-assistive-text">Actions for Home</span>
              </button>
              <div class="nds-dropdown nds-dropdown_right">
                <ul class="nds-dropdown__list" role="menu">
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Refresh Tab">
                        Refresh Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        r

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Open in a new window">
                        Open in a new window

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        ⇧ + n

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Pin Tab">
                        Pin Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        p

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Close Tab">
                        Close Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        w

                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </li>
          <li class="nds-context-bar__item nds-context-bar__item_tab nds-is-active" role="presentation">
            <a href="javascript:void(0);" class="nds-context-bar__label-action" role="tab" title="Tab Item 1" aria-selected="true" tabindex="0" aria-controls="context-tab-panel-2" id="context-tab-id-2">
              <div class="nds-icon_container" title="Case">
                <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                  <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#case"></use>
                </svg>
                <span class="nds-assistive-text">Case</span>
              </div>
              <span class="nds-truncate" title="Tab Item 1">Tab Item 1</span>
            </a>
            <div class="nds-context-bar__icon-action nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-p-left_none nds-p-right_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" tabindex="0" title="Actions for Tab Item 1">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
                </svg>
                <span class="nds-assistive-text">Actions for Tab Item 1</span>
              </button>
              <div class="nds-dropdown nds-dropdown_right">
                <ul class="nds-dropdown__list" role="menu">
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Refresh Tab">
                        Refresh Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        r

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Open in a new window">
                        Open in a new window

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        ⇧ + n

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Pin Tab">
                        Pin Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        p

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Close Tab">
                        Close Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        w

                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="nds-context-bar__icon-action nds-col_bump-left nds-p-left_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" tabindex="0" title="Close Tab Item 1">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                </svg>
                <span class="nds-assistive-text">Close Tab Item 1</span>
              </button>
            </div>
          </li>
          <li class="nds-context-bar__item nds-context-bar__item_tab" role="presentation">
            <a href="javascript:void(0);" class="nds-context-bar__label-action" role="tab" title="Tab Item 2" aria-selected="false" tabindex="-1" aria-controls="context-tab-panel-3" id="context-tab-id-3">
              <div class="nds-icon_container" title="Case">
                <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                  <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#case"></use>
                </svg>
                <span class="nds-assistive-text">Case</span>
              </div>
              <span class="nds-truncate" title="Tab Item 2">Tab Item 2</span>
            </a>
            <div class="nds-context-bar__icon-action nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-p-left_none nds-p-right_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" tabindex="-1" title="Actions for Tab Item 2">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
                </svg>
                <span class="nds-assistive-text">Actions for Tab Item 2</span>
              </button>
              <div class="nds-dropdown nds-dropdown_right">
                <ul class="nds-dropdown__list" role="menu">
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Refresh Tab">
                        Refresh Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        r

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Open in a new window">
                        Open in a new window

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        ⇧ + n

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Pin Tab">
                        Pin Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        p

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Close Tab">
                        Close Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        w

                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="nds-context-bar__icon-action nds-col_bump-left nds-p-left_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" tabindex="-1" title="Close Tab Item 2">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                </svg>
                <span class="nds-assistive-text">Close Tab Item 2</span>
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div id="context-tab-panel-1" class="nds-p-vertical_medium nds-hide" role="tabpanel" aria-labelledby="context-tab-id-1">Tab Home Content</div>
    <div id="context-tab-panel-2" class="nds-p-vertical_medium nds-show" role="tabpanel" aria-labelledby="context-tab-id-2">Tab One Content</div>
    <div id="context-tab-panel-3" class="nds-p-vertical_medium nds-hide" role="tabpanel" aria-labelledby="context-tab-id-3">Tab Two Content</div>
  </div>
</div>`);
  })
  .add('Pinned Tab Active (states)', () => {
    return withExample(`<div style="height: 16rem;">
  <div class="demo-only">
    <div class="nds-context-bar nds-context-bar_tabs">
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
        <div class="nds-context-bar__item nds-context-bar__object-switcher nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click">
          <a href="javascript:void(0);" class="nds-context-bar__label-action">
            <span class="nds-truncate" title="Object">Object</span>
          </a>
          <div class="nds-context-bar__icon-action">
            <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" title="Open object switcher menu">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
              </svg>
              <span class="nds-assistive-text">Open object switcher menu</span>
            </button>
          </div>
          <div class="nds-dropdown nds-dropdown_right">
            <ul class="nds-dropdown__list" role="menu">
              <li class="nds-dropdown__item" role="presentation">
                <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                  <span class="nds-truncate" title="[object Object],Accounts">
                    <svg class="nds-icon nds-icon_small nds-icon-standard-account nds-m-right_small" aria-hidden="true">
                      <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#account"></use>
                    </svg>
                    Accounts

                  </span>
                </a>
              </li>
              <li class="nds-dropdown__item" role="presentation">
                <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                  <span class="nds-truncate" title="[object Object],Cases">
                    <svg class="nds-icon nds-icon_small nds-icon-standard-case nds-m-right_small" aria-hidden="true">
                      <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#case"></use>
                    </svg>
                    Cases

                  </span>
                </a>
              </li>
              <li class="nds-dropdown__item" role="presentation">
                <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                  <span class="nds-truncate" title="[object Object],Insights">
                    <svg class="nds-icon nds-icon_small nds-icon-standard-work-order nds-m-right_small" aria-hidden="true">
                      <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#work_order"></use>
                    </svg>
                    Insights

                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div class="nds-context-bar__item nds-dropdown-trigger nds-dropdown-trigger_click">
          <div class="nds-context-bar__icon-action">
            <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-small" aria-expanded="false" aria-controls="id_of_split_view_container" title="Toggle split view">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#side_list"></use>
              </svg>
              <span class="nds-assistive-text">Toggle split view</span>
            </button>
          </div>
        </div>
        <div class="nds-context-bar__vertical-divider"></div>
        <div class="nds-context-bar__item nds-dropdown-trigger nds-dropdown-trigger_click">
          <div class="nds-context-bar__icon-action">
            <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-small" title="Open a New Tab">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#add"></use>
              </svg>
              <span class="nds-assistive-text">Open a New Tab</span>
            </button>
          </div>
        </div>
      </div>
      <div class="nds-context-bar__secondary">
        <div class="nds-context-bar__vertical-divider"></div>
        <ul class="nds-grid" role="tablist">
          <li class="nds-context-bar__item nds-context-bar__item_tab nds-is-active nds-is-pinned" role="presentation">
            <a href="javascript:void(0);" class="nds-context-bar__label-action" role="tab" title="Home" aria-selected="true" tabindex="0" aria-controls="context-tab-panel-1" id="context-tab-id-1">
              <div class="nds-icon_container" title="Home">
                <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                  <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#home"></use>
                </svg>
                <span class="nds-assistive-text">Home</span>
              </div>
              <span class="nds-truncate nds-assistive-text" title="Home">Home</span>
            </a>
            <div class="nds-context-bar__icon-action nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-p-left_none nds-p-right_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" tabindex="0" title="Actions for Home">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
                </svg>
                <span class="nds-assistive-text">Actions for Home</span>
              </button>
              <div class="nds-dropdown nds-dropdown_right">
                <ul class="nds-dropdown__list" role="menu">
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Refresh Tab">
                        Refresh Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        r

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Open in a new window">
                        Open in a new window

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        ⇧ + n

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Pin Tab">
                        Pin Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        p

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Close Tab">
                        Close Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        w

                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </li>
          <li class="nds-context-bar__item nds-context-bar__item_tab" role="presentation">
            <a href="javascript:void(0);" class="nds-context-bar__label-action" role="tab" title="Tab Item 1" aria-selected="false" tabindex="-1" aria-controls="context-tab-panel-2" id="context-tab-id-2">
              <div class="nds-icon_container" title="Case">
                <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                  <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#case"></use>
                </svg>
                <span class="nds-assistive-text">Case</span>
              </div>
              <span class="nds-truncate" title="Tab Item 1">Tab Item 1</span>
            </a>
            <div class="nds-context-bar__icon-action nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-p-left_none nds-p-right_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" tabindex="-1" title="Actions for Tab Item 1">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
                </svg>
                <span class="nds-assistive-text">Actions for Tab Item 1</span>
              </button>
              <div class="nds-dropdown nds-dropdown_right">
                <ul class="nds-dropdown__list" role="menu">
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Refresh Tab">
                        Refresh Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        r

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Open in a new window">
                        Open in a new window

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        ⇧ + n

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Pin Tab">
                        Pin Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        p

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Close Tab">
                        Close Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        w

                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="nds-context-bar__icon-action nds-col_bump-left nds-p-left_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" tabindex="-1" title="Close Tab Item 1">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                </svg>
                <span class="nds-assistive-text">Close Tab Item 1</span>
              </button>
            </div>
          </li>
          <li class="nds-context-bar__item nds-context-bar__item_tab" role="presentation">
            <a href="javascript:void(0);" class="nds-context-bar__label-action" role="tab" title="Tab Item 2" aria-selected="false" tabindex="-1" aria-controls="context-tab-panel-3" id="context-tab-id-3">
              <div class="nds-icon_container" title="Case">
                <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                  <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#case"></use>
                </svg>
                <span class="nds-assistive-text">Case</span>
              </div>
              <span class="nds-truncate" title="Tab Item 2">Tab Item 2</span>
            </a>
            <div class="nds-context-bar__icon-action nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-p-left_none nds-p-right_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" tabindex="-1" title="Actions for Tab Item 2">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
                </svg>
                <span class="nds-assistive-text">Actions for Tab Item 2</span>
              </button>
              <div class="nds-dropdown nds-dropdown_right">
                <ul class="nds-dropdown__list" role="menu">
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Refresh Tab">
                        Refresh Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        r

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Open in a new window">
                        Open in a new window

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        ⇧ + n

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Pin Tab">
                        Pin Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        p

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Close Tab">
                        Close Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        w

                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="nds-context-bar__icon-action nds-col_bump-left nds-p-left_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" tabindex="-1" title="Close Tab Item 2">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                </svg>
                <span class="nds-assistive-text">Close Tab Item 2</span>
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div id="context-tab-panel-1" class="nds-p-vertical_medium nds-show" role="tabpanel" aria-labelledby="context-tab-id-1">Tab Home Content</div>
    <div id="context-tab-panel-2" class="nds-p-vertical_medium nds-hide" role="tabpanel" aria-labelledby="context-tab-id-2">Tab One Content</div>
    <div id="context-tab-panel-3" class="nds-p-vertical_medium nds-hide" role="tabpanel" aria-labelledby="context-tab-id-3">Tab Two Content</div>
  </div>
</div>`);
  })
  .add('Pinned Tab Active Focus (states)', () => {
    return withExample(`<div style="height: 16rem;">
  <div class="demo-only">
    <div class="nds-context-bar nds-context-bar_tabs">
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
        <div class="nds-context-bar__item nds-context-bar__object-switcher nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click">
          <a href="javascript:void(0);" class="nds-context-bar__label-action">
            <span class="nds-truncate" title="Object">Object</span>
          </a>
          <div class="nds-context-bar__icon-action">
            <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" title="Open object switcher menu">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
              </svg>
              <span class="nds-assistive-text">Open object switcher menu</span>
            </button>
          </div>
          <div class="nds-dropdown nds-dropdown_right">
            <ul class="nds-dropdown__list" role="menu">
              <li class="nds-dropdown__item" role="presentation">
                <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                  <span class="nds-truncate" title="[object Object],Accounts">
                    <svg class="nds-icon nds-icon_small nds-icon-standard-account nds-m-right_small" aria-hidden="true">
                      <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#account"></use>
                    </svg>
                    Accounts

                  </span>
                </a>
              </li>
              <li class="nds-dropdown__item" role="presentation">
                <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                  <span class="nds-truncate" title="[object Object],Cases">
                    <svg class="nds-icon nds-icon_small nds-icon-standard-case nds-m-right_small" aria-hidden="true">
                      <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#case"></use>
                    </svg>
                    Cases

                  </span>
                </a>
              </li>
              <li class="nds-dropdown__item" role="presentation">
                <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                  <span class="nds-truncate" title="[object Object],Insights">
                    <svg class="nds-icon nds-icon_small nds-icon-standard-work-order nds-m-right_small" aria-hidden="true">
                      <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#work_order"></use>
                    </svg>
                    Insights

                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div class="nds-context-bar__item nds-dropdown-trigger nds-dropdown-trigger_click">
          <div class="nds-context-bar__icon-action">
            <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-small" aria-expanded="false" aria-controls="id_of_split_view_container" title="Toggle split view">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#side_list"></use>
              </svg>
              <span class="nds-assistive-text">Toggle split view</span>
            </button>
          </div>
        </div>
        <div class="nds-context-bar__vertical-divider"></div>
        <div class="nds-context-bar__item nds-dropdown-trigger nds-dropdown-trigger_click">
          <div class="nds-context-bar__icon-action">
            <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-small" title="Open a New Tab">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#add"></use>
              </svg>
              <span class="nds-assistive-text">Open a New Tab</span>
            </button>
          </div>
        </div>
      </div>
      <div class="nds-context-bar__secondary">
        <div class="nds-context-bar__vertical-divider"></div>
        <ul class="nds-grid" role="tablist">
          <li class="nds-context-bar__item nds-context-bar__item_tab nds-has-focus nds-is-active nds-is-pinned" role="presentation">
            <a href="javascript:void(0);" class="nds-context-bar__label-action" role="tab" title="Home" aria-selected="true" tabindex="0" aria-controls="context-tab-panel-1" id="context-tab-id-1">
              <div class="nds-icon_container" title="Home">
                <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                  <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#home"></use>
                </svg>
                <span class="nds-assistive-text">Home</span>
              </div>
              <span class="nds-truncate nds-assistive-text" title="Home">Home</span>
            </a>
            <div class="nds-context-bar__icon-action nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-p-left_none nds-p-right_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" tabindex="0" title="Actions for Home">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
                </svg>
                <span class="nds-assistive-text">Actions for Home</span>
              </button>
              <div class="nds-dropdown nds-dropdown_right">
                <ul class="nds-dropdown__list" role="menu">
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Refresh Tab">
                        Refresh Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        r

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Open in a new window">
                        Open in a new window

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        ⇧ + n

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Pin Tab">
                        Pin Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        p

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Close Tab">
                        Close Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        w

                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </li>
          <li class="nds-context-bar__item nds-context-bar__item_tab" role="presentation">
            <a href="javascript:void(0);" class="nds-context-bar__label-action" role="tab" title="Tab Item 1" aria-selected="false" tabindex="-1" aria-controls="context-tab-panel-2" id="context-tab-id-2">
              <div class="nds-icon_container" title="Case">
                <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                  <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#case"></use>
                </svg>
                <span class="nds-assistive-text">Case</span>
              </div>
              <span class="nds-truncate" title="Tab Item 1">Tab Item 1</span>
            </a>
            <div class="nds-context-bar__icon-action nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-p-left_none nds-p-right_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" tabindex="-1" title="Actions for Tab Item 1">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
                </svg>
                <span class="nds-assistive-text">Actions for Tab Item 1</span>
              </button>
              <div class="nds-dropdown nds-dropdown_right">
                <ul class="nds-dropdown__list" role="menu">
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Refresh Tab">
                        Refresh Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        r

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Open in a new window">
                        Open in a new window

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        ⇧ + n

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Pin Tab">
                        Pin Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        p

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Close Tab">
                        Close Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        w

                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="nds-context-bar__icon-action nds-col_bump-left nds-p-left_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" tabindex="-1" title="Close Tab Item 1">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                </svg>
                <span class="nds-assistive-text">Close Tab Item 1</span>
              </button>
            </div>
          </li>
          <li class="nds-context-bar__item nds-context-bar__item_tab" role="presentation">
            <a href="javascript:void(0);" class="nds-context-bar__label-action" role="tab" title="Tab Item 2" aria-selected="false" tabindex="-1" aria-controls="context-tab-panel-3" id="context-tab-id-3">
              <div class="nds-icon_container" title="Case">
                <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                  <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#case"></use>
                </svg>
                <span class="nds-assistive-text">Case</span>
              </div>
              <span class="nds-truncate" title="Tab Item 2">Tab Item 2</span>
            </a>
            <div class="nds-context-bar__icon-action nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-p-left_none nds-p-right_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" tabindex="-1" title="Actions for Tab Item 2">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
                </svg>
                <span class="nds-assistive-text">Actions for Tab Item 2</span>
              </button>
              <div class="nds-dropdown nds-dropdown_right">
                <ul class="nds-dropdown__list" role="menu">
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Refresh Tab">
                        Refresh Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        r

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Open in a new window">
                        Open in a new window

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        ⇧ + n

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Pin Tab">
                        Pin Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        p

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Close Tab">
                        Close Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        w

                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="nds-context-bar__icon-action nds-col_bump-left nds-p-left_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" tabindex="-1" title="Close Tab Item 2">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                </svg>
                <span class="nds-assistive-text">Close Tab Item 2</span>
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div id="context-tab-panel-1" class="nds-p-vertical_medium nds-show" role="tabpanel" aria-labelledby="context-tab-id-1">Tab Home Content</div>
    <div id="context-tab-panel-2" class="nds-p-vertical_medium nds-hide" role="tabpanel" aria-labelledby="context-tab-id-2">Tab One Content</div>
    <div id="context-tab-panel-3" class="nds-p-vertical_medium nds-hide" role="tabpanel" aria-labelledby="context-tab-id-3">Tab Two Content</div>
  </div>
</div>`);
  })
  .add('Unsaved Pinned Tab (states)', () => {
    return withExample(`<div style="height: 16rem;">
  <div class="demo-only">
    <div class="nds-context-bar nds-context-bar_tabs">
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
        <div class="nds-context-bar__item nds-context-bar__object-switcher nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click">
          <a href="javascript:void(0);" class="nds-context-bar__label-action">
            <span class="nds-truncate" title="Object">Object</span>
          </a>
          <div class="nds-context-bar__icon-action">
            <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" title="Open object switcher menu">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
              </svg>
              <span class="nds-assistive-text">Open object switcher menu</span>
            </button>
          </div>
          <div class="nds-dropdown nds-dropdown_right">
            <ul class="nds-dropdown__list" role="menu">
              <li class="nds-dropdown__item" role="presentation">
                <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                  <span class="nds-truncate" title="[object Object],Accounts">
                    <svg class="nds-icon nds-icon_small nds-icon-standard-account nds-m-right_small" aria-hidden="true">
                      <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#account"></use>
                    </svg>
                    Accounts

                  </span>
                </a>
              </li>
              <li class="nds-dropdown__item" role="presentation">
                <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                  <span class="nds-truncate" title="[object Object],Cases">
                    <svg class="nds-icon nds-icon_small nds-icon-standard-case nds-m-right_small" aria-hidden="true">
                      <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#case"></use>
                    </svg>
                    Cases

                  </span>
                </a>
              </li>
              <li class="nds-dropdown__item" role="presentation">
                <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                  <span class="nds-truncate" title="[object Object],Insights">
                    <svg class="nds-icon nds-icon_small nds-icon-standard-work-order nds-m-right_small" aria-hidden="true">
                      <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#work_order"></use>
                    </svg>
                    Insights

                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div class="nds-context-bar__item nds-dropdown-trigger nds-dropdown-trigger_click">
          <div class="nds-context-bar__icon-action">
            <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-small" aria-expanded="false" aria-controls="id_of_split_view_container" title="Toggle split view">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#side_list"></use>
              </svg>
              <span class="nds-assistive-text">Toggle split view</span>
            </button>
          </div>
        </div>
        <div class="nds-context-bar__vertical-divider"></div>
        <div class="nds-context-bar__item nds-dropdown-trigger nds-dropdown-trigger_click">
          <div class="nds-context-bar__icon-action">
            <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-small" title="Open a New Tab">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#add"></use>
              </svg>
              <span class="nds-assistive-text">Open a New Tab</span>
            </button>
          </div>
        </div>
      </div>
      <div class="nds-context-bar__secondary">
        <div class="nds-context-bar__vertical-divider"></div>
        <ul class="nds-grid" role="tablist">
          <li class="nds-context-bar__item nds-context-bar__item_tab nds-is-unsaved nds-is-pinned" role="presentation">
            <a href="javascript:void(0);" class="nds-context-bar__label-action" role="tab" title="Home" aria-selected="false" tabindex="-1" aria-controls="context-tab-panel-1" id="context-tab-id-1">
              <abbr class="nds-indicator_unsaved" title="Tab Not Saved">*</abbr>
              <div class="nds-icon_container" title="Home">
                <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                  <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#home"></use>
                </svg>
                <span class="nds-assistive-text">Home</span>
              </div>
              <span class="nds-truncate nds-assistive-text" title="Home">Home</span>
            </a>
            <div class="nds-context-bar__icon-action nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-p-left_none nds-p-right_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" tabindex="-1" title="Actions for Home">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
                </svg>
                <span class="nds-assistive-text">Actions for Home</span>
              </button>
              <div class="nds-dropdown nds-dropdown_right">
                <ul class="nds-dropdown__list" role="menu">
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Refresh Tab">
                        Refresh Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        r

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Open in a new window">
                        Open in a new window

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        ⇧ + n

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Pin Tab">
                        Pin Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        p

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Close Tab">
                        Close Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        w

                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </li>
          <li class="nds-context-bar__item nds-context-bar__item_tab nds-is-active" role="presentation">
            <a href="javascript:void(0);" class="nds-context-bar__label-action" role="tab" title="Tab Item 1" aria-selected="true" tabindex="0" aria-controls="context-tab-panel-2" id="context-tab-id-2">
              <div class="nds-icon_container" title="Case">
                <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                  <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#case"></use>
                </svg>
                <span class="nds-assistive-text">Case</span>
              </div>
              <span class="nds-truncate" title="Tab Item 1">Tab Item 1</span>
            </a>
            <div class="nds-context-bar__icon-action nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-p-left_none nds-p-right_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" tabindex="0" title="Actions for Tab Item 1">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
                </svg>
                <span class="nds-assistive-text">Actions for Tab Item 1</span>
              </button>
              <div class="nds-dropdown nds-dropdown_right">
                <ul class="nds-dropdown__list" role="menu">
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Refresh Tab">
                        Refresh Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        r

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Open in a new window">
                        Open in a new window

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        ⇧ + n

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Pin Tab">
                        Pin Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        p

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Close Tab">
                        Close Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        w

                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="nds-context-bar__icon-action nds-col_bump-left nds-p-left_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" tabindex="0" title="Close Tab Item 1">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                </svg>
                <span class="nds-assistive-text">Close Tab Item 1</span>
              </button>
            </div>
          </li>
          <li class="nds-context-bar__item nds-context-bar__item_tab" role="presentation">
            <a href="javascript:void(0);" class="nds-context-bar__label-action" role="tab" title="Tab Item 2" aria-selected="false" tabindex="-1" aria-controls="context-tab-panel-3" id="context-tab-id-3">
              <div class="nds-icon_container" title="Case">
                <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                  <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#case"></use>
                </svg>
                <span class="nds-assistive-text">Case</span>
              </div>
              <span class="nds-truncate" title="Tab Item 2">Tab Item 2</span>
            </a>
            <div class="nds-context-bar__icon-action nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-p-left_none nds-p-right_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" tabindex="-1" title="Actions for Tab Item 2">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
                </svg>
                <span class="nds-assistive-text">Actions for Tab Item 2</span>
              </button>
              <div class="nds-dropdown nds-dropdown_right">
                <ul class="nds-dropdown__list" role="menu">
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Refresh Tab">
                        Refresh Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        r

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Open in a new window">
                        Open in a new window

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        ⇧ + n

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Pin Tab">
                        Pin Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        p

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Close Tab">
                        Close Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        w

                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="nds-context-bar__icon-action nds-col_bump-left nds-p-left_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" tabindex="-1" title="Close Tab Item 2">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                </svg>
                <span class="nds-assistive-text">Close Tab Item 2</span>
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div id="context-tab-panel-1" class="nds-p-vertical_medium nds-hide" role="tabpanel" aria-labelledby="context-tab-id-1">Tab Home Content</div>
    <div id="context-tab-panel-2" class="nds-p-vertical_medium nds-show" role="tabpanel" aria-labelledby="context-tab-id-2">Tab One Content</div>
    <div id="context-tab-panel-3" class="nds-p-vertical_medium nds-hide" role="tabpanel" aria-labelledby="context-tab-id-3">Tab Two Content</div>
  </div>
</div>`);
  })
  .add('Unread Pinned Tab (states)', () => {
    return withExample(`<div style="height: 16rem;">
  <div class="demo-only">
    <div class="nds-context-bar nds-context-bar_tabs">
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
        <div class="nds-context-bar__item nds-context-bar__object-switcher nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click">
          <a href="javascript:void(0);" class="nds-context-bar__label-action">
            <span class="nds-truncate" title="Object">Object</span>
          </a>
          <div class="nds-context-bar__icon-action">
            <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" title="Open object switcher menu">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
              </svg>
              <span class="nds-assistive-text">Open object switcher menu</span>
            </button>
          </div>
          <div class="nds-dropdown nds-dropdown_right">
            <ul class="nds-dropdown__list" role="menu">
              <li class="nds-dropdown__item" role="presentation">
                <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                  <span class="nds-truncate" title="[object Object],Accounts">
                    <svg class="nds-icon nds-icon_small nds-icon-standard-account nds-m-right_small" aria-hidden="true">
                      <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#account"></use>
                    </svg>
                    Accounts

                  </span>
                </a>
              </li>
              <li class="nds-dropdown__item" role="presentation">
                <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                  <span class="nds-truncate" title="[object Object],Cases">
                    <svg class="nds-icon nds-icon_small nds-icon-standard-case nds-m-right_small" aria-hidden="true">
                      <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#case"></use>
                    </svg>
                    Cases

                  </span>
                </a>
              </li>
              <li class="nds-dropdown__item" role="presentation">
                <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                  <span class="nds-truncate" title="[object Object],Insights">
                    <svg class="nds-icon nds-icon_small nds-icon-standard-work-order nds-m-right_small" aria-hidden="true">
                      <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#work_order"></use>
                    </svg>
                    Insights

                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div class="nds-context-bar__item nds-dropdown-trigger nds-dropdown-trigger_click">
          <div class="nds-context-bar__icon-action">
            <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-small" aria-expanded="false" aria-controls="id_of_split_view_container" title="Toggle split view">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#side_list"></use>
              </svg>
              <span class="nds-assistive-text">Toggle split view</span>
            </button>
          </div>
        </div>
        <div class="nds-context-bar__vertical-divider"></div>
        <div class="nds-context-bar__item nds-dropdown-trigger nds-dropdown-trigger_click">
          <div class="nds-context-bar__icon-action">
            <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-small" title="Open a New Tab">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#add"></use>
              </svg>
              <span class="nds-assistive-text">Open a New Tab</span>
            </button>
          </div>
        </div>
      </div>
      <div class="nds-context-bar__secondary">
        <div class="nds-context-bar__vertical-divider"></div>
        <ul class="nds-grid" role="tablist">
          <li class="nds-context-bar__item nds-context-bar__item_tab nds-is-pinned nds-has-notification" role="presentation">
            <a href="javascript:void(0);" class="nds-context-bar__label-action" role="tab" title="Chat - Customer" aria-selected="false" tabindex="-1" aria-controls="context-tab-panel-1" id="context-tab-id-1">
              <span aria-label="New Activity" class="nds-indicator_unread" role="alert" title="New Activity">
                <span class="nds-assistive-text">
                  New activity in Tab:

                  Chat - Customer

                </span>
              </span>
              <div class="nds-icon_container" title="Live Chat">
                <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                  <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#live_chat"></use>
                </svg>
                <span class="nds-assistive-text">Live Chat</span>
              </div>
              <span class="nds-truncate nds-assistive-text" title="Chat - Customer">Chat - Customer</span>
            </a>
            <div class="nds-context-bar__icon-action nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-p-left_none nds-p-right_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" tabindex="-1" title="Actions for Chat - Customer">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
                </svg>
                <span class="nds-assistive-text">Actions for Chat - Customer</span>
              </button>
              <div class="nds-dropdown nds-dropdown_right">
                <ul class="nds-dropdown__list" role="menu">
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Refresh Tab">
                        Refresh Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        r

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Open in a new window">
                        Open in a new window

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        ⇧ + n

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Pin Tab">
                        Pin Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        p

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Close Tab">
                        Close Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        w

                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </li>
          <li class="nds-context-bar__item nds-context-bar__item_tab nds-is-active" role="presentation">
            <a href="javascript:void(0);" class="nds-context-bar__label-action" role="tab" title="Tab Item 1" aria-selected="true" tabindex="0" aria-controls="context-tab-panel-2" id="context-tab-id-2">
              <div class="nds-icon_container" title="Case">
                <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                  <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#case"></use>
                </svg>
                <span class="nds-assistive-text">Case</span>
              </div>
              <span class="nds-truncate" title="Tab Item 1">Tab Item 1</span>
            </a>
            <div class="nds-context-bar__icon-action nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-p-left_none nds-p-right_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" tabindex="0" title="Actions for Tab Item 1">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
                </svg>
                <span class="nds-assistive-text">Actions for Tab Item 1</span>
              </button>
              <div class="nds-dropdown nds-dropdown_right">
                <ul class="nds-dropdown__list" role="menu">
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Refresh Tab">
                        Refresh Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        r

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Open in a new window">
                        Open in a new window

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        ⇧ + n

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Pin Tab">
                        Pin Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        p

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Close Tab">
                        Close Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        w

                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="nds-context-bar__icon-action nds-col_bump-left nds-p-left_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" tabindex="0" title="Close Tab Item 1">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                </svg>
                <span class="nds-assistive-text">Close Tab Item 1</span>
              </button>
            </div>
          </li>
          <li class="nds-context-bar__item nds-context-bar__item_tab" role="presentation">
            <a href="javascript:void(0);" class="nds-context-bar__label-action" role="tab" title="Tab Item 2" aria-selected="false" tabindex="-1" aria-controls="context-tab-panel-3" id="context-tab-id-3">
              <div class="nds-icon_container" title="Case">
                <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                  <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#case"></use>
                </svg>
                <span class="nds-assistive-text">Case</span>
              </div>
              <span class="nds-truncate" title="Tab Item 2">Tab Item 2</span>
            </a>
            <div class="nds-context-bar__icon-action nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-p-left_none nds-p-right_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" tabindex="-1" title="Actions for Tab Item 2">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
                </svg>
                <span class="nds-assistive-text">Actions for Tab Item 2</span>
              </button>
              <div class="nds-dropdown nds-dropdown_right">
                <ul class="nds-dropdown__list" role="menu">
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Refresh Tab">
                        Refresh Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        r

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Open in a new window">
                        Open in a new window

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        ⇧ + n

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Pin Tab">
                        Pin Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        p

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Close Tab">
                        Close Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        w

                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="nds-context-bar__icon-action nds-col_bump-left nds-p-left_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" tabindex="-1" title="Close Tab Item 2">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                </svg>
                <span class="nds-assistive-text">Close Tab Item 2</span>
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div id="context-tab-panel-1" class="nds-p-vertical_medium nds-hide" role="tabpanel" aria-labelledby="context-tab-id-1">Tab Home Content</div>
    <div id="context-tab-panel-2" class="nds-p-vertical_medium nds-show" role="tabpanel" aria-labelledby="context-tab-id-2">Tab One Content</div>
    <div id="context-tab-panel-3" class="nds-p-vertical_medium nds-hide" role="tabpanel" aria-labelledby="context-tab-id-3">Tab Two Content</div>
  </div>
</div>`);
  })
  .add('Overflow Tabs (states)', () => {
    return withExample(`<div style="height: 16rem;">
  <div class="demo-only">
    <div class="nds-context-bar nds-context-bar_tabs">
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
        <div class="nds-context-bar__item nds-context-bar__object-switcher nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click">
          <a href="javascript:void(0);" class="nds-context-bar__label-action">
            <span class="nds-truncate" title="Object">Object</span>
          </a>
          <div class="nds-context-bar__icon-action">
            <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" title="Open object switcher menu">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
              </svg>
              <span class="nds-assistive-text">Open object switcher menu</span>
            </button>
          </div>
          <div class="nds-dropdown nds-dropdown_right">
            <ul class="nds-dropdown__list" role="menu">
              <li class="nds-dropdown__item" role="presentation">
                <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                  <span class="nds-truncate" title="[object Object],Accounts">
                    <svg class="nds-icon nds-icon_small nds-icon-standard-account nds-m-right_small" aria-hidden="true">
                      <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#account"></use>
                    </svg>
                    Accounts

                  </span>
                </a>
              </li>
              <li class="nds-dropdown__item" role="presentation">
                <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                  <span class="nds-truncate" title="[object Object],Cases">
                    <svg class="nds-icon nds-icon_small nds-icon-standard-case nds-m-right_small" aria-hidden="true">
                      <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#case"></use>
                    </svg>
                    Cases

                  </span>
                </a>
              </li>
              <li class="nds-dropdown__item" role="presentation">
                <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                  <span class="nds-truncate" title="[object Object],Insights">
                    <svg class="nds-icon nds-icon_small nds-icon-standard-work-order nds-m-right_small" aria-hidden="true">
                      <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#work_order"></use>
                    </svg>
                    Insights

                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div class="nds-context-bar__item nds-dropdown-trigger nds-dropdown-trigger_click">
          <div class="nds-context-bar__icon-action">
            <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-small" aria-expanded="false" aria-controls="id_of_split_view_container" title="Toggle split view">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#side_list"></use>
              </svg>
              <span class="nds-assistive-text">Toggle split view</span>
            </button>
          </div>
        </div>
        <div class="nds-context-bar__vertical-divider"></div>
        <div class="nds-context-bar__item nds-dropdown-trigger nds-dropdown-trigger_click">
          <div class="nds-context-bar__icon-action">
            <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-small" title="Open a New Tab">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#add"></use>
              </svg>
              <span class="nds-assistive-text">Open a New Tab</span>
            </button>
          </div>
        </div>
      </div>
      <div class="nds-context-bar__secondary">
        <div class="nds-context-bar__vertical-divider"></div>
        <ul class="nds-grid" role="tablist">
          <li class="nds-context-bar__item nds-context-bar__item_tab nds-is-active" role="presentation">
            <a href="javascript:void(0);" class="nds-context-bar__label-action" role="tab" title="Home" aria-selected="true" tabindex="0" aria-controls="context-tab-panel-1" id="context-tab-id-1">
              <div class="nds-icon_container" title="Home">
                <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                  <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#home"></use>
                </svg>
                <span class="nds-assistive-text">Home</span>
              </div>
              <span class="nds-truncate" title="Home">Home</span>
            </a>
            <div class="nds-context-bar__icon-action nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-p-left_none nds-p-right_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" tabindex="0" title="Actions for Home">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
                </svg>
                <span class="nds-assistive-text">Actions for Home</span>
              </button>
              <div class="nds-dropdown nds-dropdown_right">
                <ul class="nds-dropdown__list" role="menu">
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Refresh Tab">
                        Refresh Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        r

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Open in a new window">
                        Open in a new window

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        ⇧ + n

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Pin Tab">
                        Pin Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        p

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Close Tab">
                        Close Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        w

                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="nds-context-bar__icon-action nds-col_bump-left nds-p-left_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" tabindex="0" title="Close Home">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                </svg>
                <span class="nds-assistive-text">Close Home</span>
              </button>
            </div>
          </li>
          <li class="nds-context-bar__item nds-context-bar__item_tab" role="presentation">
            <a href="javascript:void(0);" class="nds-context-bar__label-action" role="tab" title="Tab Item 1" aria-selected="false" tabindex="-1" aria-controls="context-tab-panel-2" id="context-tab-id-2">
              <div class="nds-icon_container" title="Case">
                <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                  <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#case"></use>
                </svg>
                <span class="nds-assistive-text">Case</span>
              </div>
              <span class="nds-truncate" title="Tab Item 1">Tab Item 1</span>
            </a>
            <div class="nds-context-bar__icon-action nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-p-left_none nds-p-right_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" tabindex="-1" title="Actions for Tab Item 1">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
                </svg>
                <span class="nds-assistive-text">Actions for Tab Item 1</span>
              </button>
              <div class="nds-dropdown nds-dropdown_right">
                <ul class="nds-dropdown__list" role="menu">
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Refresh Tab">
                        Refresh Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        r

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Open in a new window">
                        Open in a new window

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        ⇧ + n

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Pin Tab">
                        Pin Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        p

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Close Tab">
                        Close Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        w

                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="nds-context-bar__icon-action nds-col_bump-left nds-p-left_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" tabindex="-1" title="Close Tab Item 1">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                </svg>
                <span class="nds-assistive-text">Close Tab Item 1</span>
              </button>
            </div>
          </li>
          <li class="nds-context-bar__item nds-context-bar__item_tab" role="presentation">
            <a href="javascript:void(0);" class="nds-context-bar__label-action" role="tab" title="Tab Item 2" aria-selected="false" tabindex="-1" aria-controls="context-tab-panel-3" id="context-tab-id-3">
              <div class="nds-icon_container" title="Case">
                <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                  <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#case"></use>
                </svg>
                <span class="nds-assistive-text">Case</span>
              </div>
              <span class="nds-truncate" title="Tab Item 2">Tab Item 2</span>
            </a>
            <div class="nds-context-bar__icon-action nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-p-left_none nds-p-right_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" tabindex="-1" title="Actions for Tab Item 2">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
                </svg>
                <span class="nds-assistive-text">Actions for Tab Item 2</span>
              </button>
              <div class="nds-dropdown nds-dropdown_right">
                <ul class="nds-dropdown__list" role="menu">
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Refresh Tab">
                        Refresh Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        r

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Open in a new window">
                        Open in a new window

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        ⇧ + n

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Pin Tab">
                        Pin Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        p

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Close Tab">
                        Close Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        w

                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="nds-context-bar__icon-action nds-col_bump-left nds-p-left_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" tabindex="-1" title="Close Tab Item 2">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                </svg>
                <span class="nds-assistive-text">Close Tab Item 2</span>
              </button>
            </div>
          </li>
          <li class="nds-context-bar__item nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click">
            <button class="nds-button nds-context-bar__label-action" aria-haspopup="true">
              <span class="nds-p-left_xx-small nds-truncate" title="More Tab Items">
                More

                <span class="nds-assistive-text">Tabs</span>
              </span>
              <svg class="nds-button__icon nds-button__icon_small nds-button__icon_right" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
              </svg>
            </button>
          </li>
        </ul>
      </div>
    </div>
    <div id="context-tab-panel-1" class="nds-p-vertical_medium nds-show" role="tabpanel" aria-labelledby="context-tab-id-1">Tab Home Content</div>
    <div id="context-tab-panel-2" class="nds-p-vertical_medium nds-hide" role="tabpanel" aria-labelledby="context-tab-id-2">Tab One Content</div>
    <div id="context-tab-panel-3" class="nds-p-vertical_medium nds-hide" role="tabpanel" aria-labelledby="context-tab-id-3">Tab Two Content</div>
  </div>
</div>`);
  })
  .add('Overflow Tabs Open (states)', () => {
    return withExample(`<div style="height: 16rem;">
  <div class="demo-only" style="height: 8rem;">
    <div class="nds-context-bar nds-context-bar_tabs">
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
        <div class="nds-context-bar__item nds-context-bar__object-switcher nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click">
          <a href="javascript:void(0);" class="nds-context-bar__label-action">
            <span class="nds-truncate" title="Object">Object</span>
          </a>
          <div class="nds-context-bar__icon-action">
            <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" title="Open object switcher menu">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
              </svg>
              <span class="nds-assistive-text">Open object switcher menu</span>
            </button>
          </div>
          <div class="nds-dropdown nds-dropdown_right">
            <ul class="nds-dropdown__list" role="menu">
              <li class="nds-dropdown__item" role="presentation">
                <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                  <span class="nds-truncate" title="[object Object],Accounts">
                    <svg class="nds-icon nds-icon_small nds-icon-standard-account nds-m-right_small" aria-hidden="true">
                      <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#account"></use>
                    </svg>
                    Accounts

                  </span>
                </a>
              </li>
              <li class="nds-dropdown__item" role="presentation">
                <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                  <span class="nds-truncate" title="[object Object],Cases">
                    <svg class="nds-icon nds-icon_small nds-icon-standard-case nds-m-right_small" aria-hidden="true">
                      <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#case"></use>
                    </svg>
                    Cases

                  </span>
                </a>
              </li>
              <li class="nds-dropdown__item" role="presentation">
                <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                  <span class="nds-truncate" title="[object Object],Insights">
                    <svg class="nds-icon nds-icon_small nds-icon-standard-work-order nds-m-right_small" aria-hidden="true">
                      <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#work_order"></use>
                    </svg>
                    Insights

                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div class="nds-context-bar__item nds-dropdown-trigger nds-dropdown-trigger_click">
          <div class="nds-context-bar__icon-action">
            <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-small" aria-expanded="false" aria-controls="id_of_split_view_container" title="Toggle split view">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#side_list"></use>
              </svg>
              <span class="nds-assistive-text">Toggle split view</span>
            </button>
          </div>
        </div>
        <div class="nds-context-bar__vertical-divider"></div>
        <div class="nds-context-bar__item nds-dropdown-trigger nds-dropdown-trigger_click">
          <div class="nds-context-bar__icon-action">
            <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-small" title="Open a New Tab">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#add"></use>
              </svg>
              <span class="nds-assistive-text">Open a New Tab</span>
            </button>
          </div>
        </div>
      </div>
      <div class="nds-context-bar__secondary">
        <div class="nds-context-bar__vertical-divider"></div>
        <ul class="nds-grid" role="tablist">
          <li class="nds-context-bar__item nds-context-bar__item_tab nds-is-active" role="presentation">
            <a href="javascript:void(0);" class="nds-context-bar__label-action" role="tab" title="Home" aria-selected="true" tabindex="0" aria-controls="context-tab-panel-1" id="context-tab-id-1">
              <div class="nds-icon_container" title="Home">
                <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                  <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#home"></use>
                </svg>
                <span class="nds-assistive-text">Home</span>
              </div>
              <span class="nds-truncate" title="Home">Home</span>
            </a>
            <div class="nds-context-bar__icon-action nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-p-left_none nds-p-right_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" tabindex="0" title="Actions for Home">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
                </svg>
                <span class="nds-assistive-text">Actions for Home</span>
              </button>
              <div class="nds-dropdown nds-dropdown_right">
                <ul class="nds-dropdown__list" role="menu">
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Refresh Tab">
                        Refresh Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        r

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Open in a new window">
                        Open in a new window

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        ⇧ + n

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Pin Tab">
                        Pin Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        p

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Close Tab">
                        Close Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        w

                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="nds-context-bar__icon-action nds-col_bump-left nds-p-left_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" tabindex="0" title="Close Home">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                </svg>
                <span class="nds-assistive-text">Close Home</span>
              </button>
            </div>
          </li>
          <li class="nds-context-bar__item nds-context-bar__item_tab" role="presentation">
            <a href="javascript:void(0);" class="nds-context-bar__label-action" role="tab" title="Tab Item 1" aria-selected="false" tabindex="-1" aria-controls="context-tab-panel-2" id="context-tab-id-2">
              <div class="nds-icon_container" title="Case">
                <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                  <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#case"></use>
                </svg>
                <span class="nds-assistive-text">Case</span>
              </div>
              <span class="nds-truncate" title="Tab Item 1">Tab Item 1</span>
            </a>
            <div class="nds-context-bar__icon-action nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-p-left_none nds-p-right_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" tabindex="-1" title="Actions for Tab Item 1">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
                </svg>
                <span class="nds-assistive-text">Actions for Tab Item 1</span>
              </button>
              <div class="nds-dropdown nds-dropdown_right">
                <ul class="nds-dropdown__list" role="menu">
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Refresh Tab">
                        Refresh Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        r

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Open in a new window">
                        Open in a new window

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        ⇧ + n

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Pin Tab">
                        Pin Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        p

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Close Tab">
                        Close Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        w

                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="nds-context-bar__icon-action nds-col_bump-left nds-p-left_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" tabindex="-1" title="Close Tab Item 1">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                </svg>
                <span class="nds-assistive-text">Close Tab Item 1</span>
              </button>
            </div>
          </li>
          <li class="nds-context-bar__item nds-context-bar__item_tab" role="presentation">
            <a href="javascript:void(0);" class="nds-context-bar__label-action" role="tab" title="Tab Item 2" aria-selected="false" tabindex="-1" aria-controls="context-tab-panel-3" id="context-tab-id-3">
              <div class="nds-icon_container" title="Case">
                <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                  <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#case"></use>
                </svg>
                <span class="nds-assistive-text">Case</span>
              </div>
              <span class="nds-truncate" title="Tab Item 2">Tab Item 2</span>
            </a>
            <div class="nds-context-bar__icon-action nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-p-left_none nds-p-right_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" tabindex="-1" title="Actions for Tab Item 2">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
                </svg>
                <span class="nds-assistive-text">Actions for Tab Item 2</span>
              </button>
              <div class="nds-dropdown nds-dropdown_right">
                <ul class="nds-dropdown__list" role="menu">
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Refresh Tab">
                        Refresh Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        r

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Open in a new window">
                        Open in a new window

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        ⇧ + n

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Pin Tab">
                        Pin Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        p

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Close Tab">
                        Close Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        w

                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="nds-context-bar__icon-action nds-col_bump-left nds-p-left_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" tabindex="-1" title="Close Tab Item 2">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                </svg>
                <span class="nds-assistive-text">Close Tab Item 2</span>
              </button>
            </div>
          </li>
          <li class="nds-context-bar__item nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-is-open">
            <button class="nds-button nds-context-bar__label-action" aria-haspopup="true">
              <span class="nds-p-left_xx-small nds-truncate" title="More Tab Items">
                More

                <span class="nds-assistive-text">Tabs</span>
              </span>
              <svg class="nds-button__icon nds-button__icon_small nds-button__icon_right" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
              </svg>
            </button>
            <div class="nds-dropdown nds-dropdown_right">
              <ul class="nds-dropdown__list" role="menu">
                <li class="nds-dropdown__item" role="presentation">
                  <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                    <span class="nds-truncate" title="[object Object],[object Object]">
                      <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                        <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#case"></use>
                      </svg>
                      <span>Overflow Tab Item</span>
                    </span>
                  </a>
                </li>
                <li class="nds-dropdown__item" role="presentation">
                  <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                    <span class="nds-truncate" title="[object Object],[object Object]">
                      <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                        <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#case"></use>
                      </svg>
                      <span>Overflow Tab Item</span>
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div id="context-tab-panel-1" class="nds-p-vertical_medium nds-show" role="tabpanel" aria-labelledby="context-tab-id-1">Tab Home Content</div>
    <div id="context-tab-panel-2" class="nds-p-vertical_medium nds-hide" role="tabpanel" aria-labelledby="context-tab-id-2">Tab One Content</div>
    <div id="context-tab-panel-3" class="nds-p-vertical_medium nds-hide" role="tabpanel" aria-labelledby="context-tab-id-3">Tab Two Content</div>
  </div>
</div>`);
  })
  .add('Unsaved Overflow Tabs (states)', () => {
    return withExample(`<div style="height: 16rem;">
  <div class="demo-only">
    <div class="nds-context-bar nds-context-bar_tabs">
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
        <div class="nds-context-bar__item nds-context-bar__object-switcher nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click">
          <a href="javascript:void(0);" class="nds-context-bar__label-action">
            <span class="nds-truncate" title="Object">Object</span>
          </a>
          <div class="nds-context-bar__icon-action">
            <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" title="Open object switcher menu">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
              </svg>
              <span class="nds-assistive-text">Open object switcher menu</span>
            </button>
          </div>
          <div class="nds-dropdown nds-dropdown_right">
            <ul class="nds-dropdown__list" role="menu">
              <li class="nds-dropdown__item" role="presentation">
                <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                  <span class="nds-truncate" title="[object Object],Accounts">
                    <svg class="nds-icon nds-icon_small nds-icon-standard-account nds-m-right_small" aria-hidden="true">
                      <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#account"></use>
                    </svg>
                    Accounts

                  </span>
                </a>
              </li>
              <li class="nds-dropdown__item" role="presentation">
                <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                  <span class="nds-truncate" title="[object Object],Cases">
                    <svg class="nds-icon nds-icon_small nds-icon-standard-case nds-m-right_small" aria-hidden="true">
                      <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#case"></use>
                    </svg>
                    Cases

                  </span>
                </a>
              </li>
              <li class="nds-dropdown__item" role="presentation">
                <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                  <span class="nds-truncate" title="[object Object],Insights">
                    <svg class="nds-icon nds-icon_small nds-icon-standard-work-order nds-m-right_small" aria-hidden="true">
                      <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#work_order"></use>
                    </svg>
                    Insights

                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div class="nds-context-bar__item nds-dropdown-trigger nds-dropdown-trigger_click">
          <div class="nds-context-bar__icon-action">
            <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-small" aria-expanded="false" aria-controls="id_of_split_view_container" title="Toggle split view">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#side_list"></use>
              </svg>
              <span class="nds-assistive-text">Toggle split view</span>
            </button>
          </div>
        </div>
        <div class="nds-context-bar__vertical-divider"></div>
        <div class="nds-context-bar__item nds-dropdown-trigger nds-dropdown-trigger_click">
          <div class="nds-context-bar__icon-action">
            <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-small" title="Open a New Tab">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#add"></use>
              </svg>
              <span class="nds-assistive-text">Open a New Tab</span>
            </button>
          </div>
        </div>
      </div>
      <div class="nds-context-bar__secondary">
        <div class="nds-context-bar__vertical-divider"></div>
        <ul class="nds-grid" role="tablist">
          <li class="nds-context-bar__item nds-context-bar__item_tab nds-is-active" role="presentation">
            <a href="javascript:void(0);" class="nds-context-bar__label-action" role="tab" title="Home" aria-selected="true" tabindex="0" aria-controls="context-tab-panel-1" id="context-tab-id-1">
              <div class="nds-icon_container" title="Home">
                <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                  <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#home"></use>
                </svg>
                <span class="nds-assistive-text">Home</span>
              </div>
              <span class="nds-truncate" title="Home">Home</span>
            </a>
            <div class="nds-context-bar__icon-action nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-p-left_none nds-p-right_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" tabindex="0" title="Actions for Home">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
                </svg>
                <span class="nds-assistive-text">Actions for Home</span>
              </button>
              <div class="nds-dropdown nds-dropdown_right">
                <ul class="nds-dropdown__list" role="menu">
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Refresh Tab">
                        Refresh Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        r

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Open in a new window">
                        Open in a new window

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        ⇧ + n

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Pin Tab">
                        Pin Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        p

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Close Tab">
                        Close Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        w

                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="nds-context-bar__icon-action nds-col_bump-left nds-p-left_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" tabindex="0" title="Close Home">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                </svg>
                <span class="nds-assistive-text">Close Home</span>
              </button>
            </div>
          </li>
          <li class="nds-context-bar__item nds-context-bar__item_tab" role="presentation">
            <a href="javascript:void(0);" class="nds-context-bar__label-action" role="tab" title="Tab Item 1" aria-selected="false" tabindex="-1" aria-controls="context-tab-panel-2" id="context-tab-id-2">
              <div class="nds-icon_container" title="Case">
                <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                  <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#case"></use>
                </svg>
                <span class="nds-assistive-text">Case</span>
              </div>
              <span class="nds-truncate" title="Tab Item 1">Tab Item 1</span>
            </a>
            <div class="nds-context-bar__icon-action nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-p-left_none nds-p-right_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" tabindex="-1" title="Actions for Tab Item 1">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
                </svg>
                <span class="nds-assistive-text">Actions for Tab Item 1</span>
              </button>
              <div class="nds-dropdown nds-dropdown_right">
                <ul class="nds-dropdown__list" role="menu">
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Refresh Tab">
                        Refresh Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        r

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Open in a new window">
                        Open in a new window

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        ⇧ + n

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Pin Tab">
                        Pin Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        p

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Close Tab">
                        Close Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        w

                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="nds-context-bar__icon-action nds-col_bump-left nds-p-left_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" tabindex="-1" title="Close Tab Item 1">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                </svg>
                <span class="nds-assistive-text">Close Tab Item 1</span>
              </button>
            </div>
          </li>
          <li class="nds-context-bar__item nds-context-bar__item_tab" role="presentation">
            <a href="javascript:void(0);" class="nds-context-bar__label-action" role="tab" title="Tab Item 2" aria-selected="false" tabindex="-1" aria-controls="context-tab-panel-3" id="context-tab-id-3">
              <div class="nds-icon_container" title="Case">
                <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                  <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#case"></use>
                </svg>
                <span class="nds-assistive-text">Case</span>
              </div>
              <span class="nds-truncate" title="Tab Item 2">Tab Item 2</span>
            </a>
            <div class="nds-context-bar__icon-action nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-p-left_none nds-p-right_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" tabindex="-1" title="Actions for Tab Item 2">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
                </svg>
                <span class="nds-assistive-text">Actions for Tab Item 2</span>
              </button>
              <div class="nds-dropdown nds-dropdown_right">
                <ul class="nds-dropdown__list" role="menu">
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Refresh Tab">
                        Refresh Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        r

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Open in a new window">
                        Open in a new window

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        ⇧ + n

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Pin Tab">
                        Pin Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        p

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Close Tab">
                        Close Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        w

                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="nds-context-bar__icon-action nds-col_bump-left nds-p-left_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" tabindex="-1" title="Close Tab Item 2">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                </svg>
                <span class="nds-assistive-text">Close Tab Item 2</span>
              </button>
            </div>
          </li>
          <li class="nds-context-bar__item nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-is-unsaved">
            <button class="nds-button nds-context-bar__label-action" title="More Tab Items" aria-haspopup="true">
              <abbr class="nds-indicator_unsaved" title="Tab(s) within menu not saved">*</abbr>
              <span class="nds-p-left_xx-small nds-truncate" title="More Tabs">
                More

                <span class="nds-assistive-text">Tabs</span>
              </span>
              <svg class="nds-button__icon nds-button__icon_small nds-button__icon_right" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
              </svg>
            </button>
          </li>
        </ul>
      </div>
    </div>
    <div id="context-tab-panel-1" class="nds-p-vertical_medium nds-show" role="tabpanel" aria-labelledby="context-tab-id-1">Tab Home Content</div>
    <div id="context-tab-panel-2" class="nds-p-vertical_medium nds-hide" role="tabpanel" aria-labelledby="context-tab-id-2">Tab One Content</div>
    <div id="context-tab-panel-3" class="nds-p-vertical_medium nds-hide" role="tabpanel" aria-labelledby="context-tab-id-3">Tab Two Content</div>
  </div>
</div>`);
  })
  .add('Unsaved Overflow Tabs Open (states)', () => {
    return withExample(`<div style="height: 16rem;">
  <div class="demo-only" style="height: 8rem;">
    <div class="nds-context-bar nds-context-bar_tabs">
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
        <div class="nds-context-bar__item nds-context-bar__object-switcher nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click">
          <a href="javascript:void(0);" class="nds-context-bar__label-action">
            <span class="nds-truncate" title="Object">Object</span>
          </a>
          <div class="nds-context-bar__icon-action">
            <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" title="Open object switcher menu">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
              </svg>
              <span class="nds-assistive-text">Open object switcher menu</span>
            </button>
          </div>
          <div class="nds-dropdown nds-dropdown_right">
            <ul class="nds-dropdown__list" role="menu">
              <li class="nds-dropdown__item" role="presentation">
                <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                  <span class="nds-truncate" title="[object Object],Accounts">
                    <svg class="nds-icon nds-icon_small nds-icon-standard-account nds-m-right_small" aria-hidden="true">
                      <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#account"></use>
                    </svg>
                    Accounts

                  </span>
                </a>
              </li>
              <li class="nds-dropdown__item" role="presentation">
                <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                  <span class="nds-truncate" title="[object Object],Cases">
                    <svg class="nds-icon nds-icon_small nds-icon-standard-case nds-m-right_small" aria-hidden="true">
                      <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#case"></use>
                    </svg>
                    Cases

                  </span>
                </a>
              </li>
              <li class="nds-dropdown__item" role="presentation">
                <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                  <span class="nds-truncate" title="[object Object],Insights">
                    <svg class="nds-icon nds-icon_small nds-icon-standard-work-order nds-m-right_small" aria-hidden="true">
                      <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#work_order"></use>
                    </svg>
                    Insights

                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div class="nds-context-bar__item nds-dropdown-trigger nds-dropdown-trigger_click">
          <div class="nds-context-bar__icon-action">
            <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-small" aria-expanded="false" aria-controls="id_of_split_view_container" title="Toggle split view">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#side_list"></use>
              </svg>
              <span class="nds-assistive-text">Toggle split view</span>
            </button>
          </div>
        </div>
        <div class="nds-context-bar__vertical-divider"></div>
        <div class="nds-context-bar__item nds-dropdown-trigger nds-dropdown-trigger_click">
          <div class="nds-context-bar__icon-action">
            <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-small" title="Open a New Tab">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#add"></use>
              </svg>
              <span class="nds-assistive-text">Open a New Tab</span>
            </button>
          </div>
        </div>
      </div>
      <div class="nds-context-bar__secondary">
        <div class="nds-context-bar__vertical-divider"></div>
        <ul class="nds-grid" role="tablist">
          <li class="nds-context-bar__item nds-context-bar__item_tab nds-is-active" role="presentation">
            <a href="javascript:void(0);" class="nds-context-bar__label-action" role="tab" title="Home" aria-selected="true" tabindex="0" aria-controls="context-tab-panel-1" id="context-tab-id-1">
              <div class="nds-icon_container" title="Home">
                <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                  <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#home"></use>
                </svg>
                <span class="nds-assistive-text">Home</span>
              </div>
              <span class="nds-truncate" title="Home">Home</span>
            </a>
            <div class="nds-context-bar__icon-action nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-p-left_none nds-p-right_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" tabindex="0" title="Actions for Home">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
                </svg>
                <span class="nds-assistive-text">Actions for Home</span>
              </button>
              <div class="nds-dropdown nds-dropdown_right">
                <ul class="nds-dropdown__list" role="menu">
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Refresh Tab">
                        Refresh Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        r

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Open in a new window">
                        Open in a new window

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        ⇧ + n

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Pin Tab">
                        Pin Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        p

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Close Tab">
                        Close Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        w

                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="nds-context-bar__icon-action nds-col_bump-left nds-p-left_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" tabindex="0" title="Close Home">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                </svg>
                <span class="nds-assistive-text">Close Home</span>
              </button>
            </div>
          </li>
          <li class="nds-context-bar__item nds-context-bar__item_tab" role="presentation">
            <a href="javascript:void(0);" class="nds-context-bar__label-action" role="tab" title="Tab Item 1" aria-selected="false" tabindex="-1" aria-controls="context-tab-panel-2" id="context-tab-id-2">
              <div class="nds-icon_container" title="Case">
                <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                  <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#case"></use>
                </svg>
                <span class="nds-assistive-text">Case</span>
              </div>
              <span class="nds-truncate" title="Tab Item 1">Tab Item 1</span>
            </a>
            <div class="nds-context-bar__icon-action nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-p-left_none nds-p-right_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" tabindex="-1" title="Actions for Tab Item 1">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
                </svg>
                <span class="nds-assistive-text">Actions for Tab Item 1</span>
              </button>
              <div class="nds-dropdown nds-dropdown_right">
                <ul class="nds-dropdown__list" role="menu">
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Refresh Tab">
                        Refresh Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        r

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Open in a new window">
                        Open in a new window

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        ⇧ + n

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Pin Tab">
                        Pin Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        p

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Close Tab">
                        Close Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        w

                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="nds-context-bar__icon-action nds-col_bump-left nds-p-left_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" tabindex="-1" title="Close Tab Item 1">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                </svg>
                <span class="nds-assistive-text">Close Tab Item 1</span>
              </button>
            </div>
          </li>
          <li class="nds-context-bar__item nds-context-bar__item_tab" role="presentation">
            <a href="javascript:void(0);" class="nds-context-bar__label-action" role="tab" title="Tab Item 2" aria-selected="false" tabindex="-1" aria-controls="context-tab-panel-3" id="context-tab-id-3">
              <div class="nds-icon_container" title="Case">
                <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                  <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#case"></use>
                </svg>
                <span class="nds-assistive-text">Case</span>
              </div>
              <span class="nds-truncate" title="Tab Item 2">Tab Item 2</span>
            </a>
            <div class="nds-context-bar__icon-action nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-p-left_none nds-p-right_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" tabindex="-1" title="Actions for Tab Item 2">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
                </svg>
                <span class="nds-assistive-text">Actions for Tab Item 2</span>
              </button>
              <div class="nds-dropdown nds-dropdown_right">
                <ul class="nds-dropdown__list" role="menu">
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Refresh Tab">
                        Refresh Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        r

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Open in a new window">
                        Open in a new window

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        ⇧ + n

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Pin Tab">
                        Pin Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        p

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Close Tab">
                        Close Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        w

                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="nds-context-bar__icon-action nds-col_bump-left nds-p-left_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" tabindex="-1" title="Close Tab Item 2">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                </svg>
                <span class="nds-assistive-text">Close Tab Item 2</span>
              </button>
            </div>
          </li>
          <li class="nds-context-bar__item nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-is-open nds-is-unsaved">
            <button class="nds-button nds-context-bar__label-action" title="More Tab Items" aria-haspopup="true">
              <abbr class="nds-indicator_unsaved" title="Tab(s) within menu not saved">*</abbr>
              <span class="nds-p-left_xx-small nds-truncate" title="More Tabs">
                More

                <span class="nds-assistive-text">Tabs</span>
              </span>
              <svg class="nds-button__icon nds-button__icon_small nds-button__icon_right" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
              </svg>
            </button>
            <div class="nds-dropdown nds-dropdown_right">
              <ul class="nds-dropdown__list" role="menu">
                <li class="nds-dropdown__item nds-is-unsaved" role="presentation">
                  <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                    <span class="nds-truncate" title="Overflow Tab Item">
                      <abbr class="nds-unsaved-indicator" title="Tab(s) within menu not saved">*</abbr>
                      <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                        <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#case"></use>
                      </svg>
                      <span>Overflow Tab Item</span>
                    </span>
                  </a>
                </li>
                <li class="nds-dropdown__item" role="presentation">
                  <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                    <span class="nds-truncate" title="Overflow Tab Item">
                      <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                        <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#case"></use>
                      </svg>
                      <span>Overflow Tab Item</span>
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div id="context-tab-panel-1" class="nds-p-vertical_medium nds-show" role="tabpanel" aria-labelledby="context-tab-id-1">Tab Home Content</div>
    <div id="context-tab-panel-2" class="nds-p-vertical_medium nds-hide" role="tabpanel" aria-labelledby="context-tab-id-2">Tab One Content</div>
    <div id="context-tab-panel-3" class="nds-p-vertical_medium nds-hide" role="tabpanel" aria-labelledby="context-tab-id-3">Tab Two Content</div>
  </div>
</div>`);
  })
  .add('Unread Overflow Tabs (states)', () => {
    return withExample(`<div style="height: 16rem;">
  <div class="demo-only">
    <div class="nds-context-bar nds-context-bar_tabs">
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
        <div class="nds-context-bar__item nds-context-bar__object-switcher nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click">
          <a href="javascript:void(0);" class="nds-context-bar__label-action">
            <span class="nds-truncate" title="Object">Object</span>
          </a>
          <div class="nds-context-bar__icon-action">
            <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" title="Open object switcher menu">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
              </svg>
              <span class="nds-assistive-text">Open object switcher menu</span>
            </button>
          </div>
          <div class="nds-dropdown nds-dropdown_right">
            <ul class="nds-dropdown__list" role="menu">
              <li class="nds-dropdown__item" role="presentation">
                <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                  <span class="nds-truncate" title="[object Object],Accounts">
                    <svg class="nds-icon nds-icon_small nds-icon-standard-account nds-m-right_small" aria-hidden="true">
                      <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#account"></use>
                    </svg>
                    Accounts

                  </span>
                </a>
              </li>
              <li class="nds-dropdown__item" role="presentation">
                <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                  <span class="nds-truncate" title="[object Object],Cases">
                    <svg class="nds-icon nds-icon_small nds-icon-standard-case nds-m-right_small" aria-hidden="true">
                      <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#case"></use>
                    </svg>
                    Cases

                  </span>
                </a>
              </li>
              <li class="nds-dropdown__item" role="presentation">
                <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                  <span class="nds-truncate" title="[object Object],Insights">
                    <svg class="nds-icon nds-icon_small nds-icon-standard-work-order nds-m-right_small" aria-hidden="true">
                      <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#work_order"></use>
                    </svg>
                    Insights

                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div class="nds-context-bar__item nds-dropdown-trigger nds-dropdown-trigger_click">
          <div class="nds-context-bar__icon-action">
            <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-small" aria-expanded="false" aria-controls="id_of_split_view_container" title="Toggle split view">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#side_list"></use>
              </svg>
              <span class="nds-assistive-text">Toggle split view</span>
            </button>
          </div>
        </div>
        <div class="nds-context-bar__vertical-divider"></div>
        <div class="nds-context-bar__item nds-dropdown-trigger nds-dropdown-trigger_click">
          <div class="nds-context-bar__icon-action">
            <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-small" title="Open a New Tab">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#add"></use>
              </svg>
              <span class="nds-assistive-text">Open a New Tab</span>
            </button>
          </div>
        </div>
      </div>
      <div class="nds-context-bar__secondary">
        <div class="nds-context-bar__vertical-divider"></div>
        <ul class="nds-grid" role="tablist">
          <li class="nds-context-bar__item nds-context-bar__item_tab nds-is-active" role="presentation">
            <a href="javascript:void(0);" class="nds-context-bar__label-action" role="tab" title="Home" aria-selected="true" tabindex="0" aria-controls="context-tab-panel-1" id="context-tab-id-1">
              <div class="nds-icon_container" title="Home">
                <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                  <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#home"></use>
                </svg>
                <span class="nds-assistive-text">Home</span>
              </div>
              <span class="nds-truncate" title="Home">Home</span>
            </a>
            <div class="nds-context-bar__icon-action nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-p-left_none nds-p-right_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" tabindex="0" title="Actions for Home">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
                </svg>
                <span class="nds-assistive-text">Actions for Home</span>
              </button>
              <div class="nds-dropdown nds-dropdown_right">
                <ul class="nds-dropdown__list" role="menu">
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Refresh Tab">
                        Refresh Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        r

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Open in a new window">
                        Open in a new window

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        ⇧ + n

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Pin Tab">
                        Pin Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        p

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Close Tab">
                        Close Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        w

                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="nds-context-bar__icon-action nds-col_bump-left nds-p-left_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" tabindex="0" title="Close Home">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                </svg>
                <span class="nds-assistive-text">Close Home</span>
              </button>
            </div>
          </li>
          <li class="nds-context-bar__item nds-context-bar__item_tab" role="presentation">
            <a href="javascript:void(0);" class="nds-context-bar__label-action" role="tab" title="Tab Item 1" aria-selected="false" tabindex="-1" aria-controls="context-tab-panel-2" id="context-tab-id-2">
              <div class="nds-icon_container" title="Case">
                <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                  <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#case"></use>
                </svg>
                <span class="nds-assistive-text">Case</span>
              </div>
              <span class="nds-truncate" title="Tab Item 1">Tab Item 1</span>
            </a>
            <div class="nds-context-bar__icon-action nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-p-left_none nds-p-right_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" tabindex="-1" title="Actions for Tab Item 1">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
                </svg>
                <span class="nds-assistive-text">Actions for Tab Item 1</span>
              </button>
              <div class="nds-dropdown nds-dropdown_right">
                <ul class="nds-dropdown__list" role="menu">
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Refresh Tab">
                        Refresh Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        r

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Open in a new window">
                        Open in a new window

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        ⇧ + n

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Pin Tab">
                        Pin Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        p

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Close Tab">
                        Close Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        w

                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="nds-context-bar__icon-action nds-col_bump-left nds-p-left_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" tabindex="-1" title="Close Tab Item 1">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                </svg>
                <span class="nds-assistive-text">Close Tab Item 1</span>
              </button>
            </div>
          </li>
          <li class="nds-context-bar__item nds-context-bar__item_tab" role="presentation">
            <a href="javascript:void(0);" class="nds-context-bar__label-action" role="tab" title="Tab Item 2" aria-selected="false" tabindex="-1" aria-controls="context-tab-panel-3" id="context-tab-id-3">
              <div class="nds-icon_container" title="Case">
                <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                  <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#case"></use>
                </svg>
                <span class="nds-assistive-text">Case</span>
              </div>
              <span class="nds-truncate" title="Tab Item 2">Tab Item 2</span>
            </a>
            <div class="nds-context-bar__icon-action nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-p-left_none nds-p-right_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" tabindex="-1" title="Actions for Tab Item 2">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
                </svg>
                <span class="nds-assistive-text">Actions for Tab Item 2</span>
              </button>
              <div class="nds-dropdown nds-dropdown_right">
                <ul class="nds-dropdown__list" role="menu">
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Refresh Tab">
                        Refresh Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        r

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Open in a new window">
                        Open in a new window

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        ⇧ + n

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Pin Tab">
                        Pin Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        p

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Close Tab">
                        Close Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        w

                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="nds-context-bar__icon-action nds-col_bump-left nds-p-left_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" tabindex="-1" title="Close Tab Item 2">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                </svg>
                <span class="nds-assistive-text">Close Tab Item 2</span>
              </button>
            </div>
          </li>
          <li class="nds-context-bar__item nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-has-notification">
            <button class="nds-button nds-context-bar__label-action" title="More Tab Items" aria-haspopup="true">
              <span aria-label="New Activity" class="nds-indicator_unread" role="alert" title="New Activity">
                <span class="nds-assistive-text">New Tab activity with in More Tabs menu</span>
              </span>
              <span class="nds-p-left_xx-small nds-truncate" title="More Tabs">
                More

                <span class="nds-assistive-text">Tabs</span>
              </span>
              <svg class="nds-button__icon nds-button__icon_small nds-button__icon_right" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
              </svg>
            </button>
          </li>
        </ul>
      </div>
    </div>
    <div id="context-tab-panel-1" class="nds-p-vertical_medium nds-show" role="tabpanel" aria-labelledby="context-tab-id-1">Tab Home Content</div>
    <div id="context-tab-panel-2" class="nds-p-vertical_medium nds-hide" role="tabpanel" aria-labelledby="context-tab-id-2">Tab One Content</div>
    <div id="context-tab-panel-3" class="nds-p-vertical_medium nds-hide" role="tabpanel" aria-labelledby="context-tab-id-3">Tab Two Content</div>
  </div>
</div>`);
  })
  .add('Unread Overflow Tabs Open (states)', () => {
    return withExample(`<div style="height: 16rem;">
  <div class="demo-only" style="height: 8rem;">
    <div class="nds-context-bar nds-context-bar_tabs">
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
        <div class="nds-context-bar__item nds-context-bar__object-switcher nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click">
          <a href="javascript:void(0);" class="nds-context-bar__label-action">
            <span class="nds-truncate" title="Object">Object</span>
          </a>
          <div class="nds-context-bar__icon-action">
            <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" title="Open object switcher menu">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
              </svg>
              <span class="nds-assistive-text">Open object switcher menu</span>
            </button>
          </div>
          <div class="nds-dropdown nds-dropdown_right">
            <ul class="nds-dropdown__list" role="menu">
              <li class="nds-dropdown__item" role="presentation">
                <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                  <span class="nds-truncate" title="[object Object],Accounts">
                    <svg class="nds-icon nds-icon_small nds-icon-standard-account nds-m-right_small" aria-hidden="true">
                      <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#account"></use>
                    </svg>
                    Accounts

                  </span>
                </a>
              </li>
              <li class="nds-dropdown__item" role="presentation">
                <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                  <span class="nds-truncate" title="[object Object],Cases">
                    <svg class="nds-icon nds-icon_small nds-icon-standard-case nds-m-right_small" aria-hidden="true">
                      <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#case"></use>
                    </svg>
                    Cases

                  </span>
                </a>
              </li>
              <li class="nds-dropdown__item" role="presentation">
                <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                  <span class="nds-truncate" title="[object Object],Insights">
                    <svg class="nds-icon nds-icon_small nds-icon-standard-work-order nds-m-right_small" aria-hidden="true">
                      <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#work_order"></use>
                    </svg>
                    Insights

                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div class="nds-context-bar__item nds-dropdown-trigger nds-dropdown-trigger_click">
          <div class="nds-context-bar__icon-action">
            <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-small" aria-expanded="false" aria-controls="id_of_split_view_container" title="Toggle split view">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#side_list"></use>
              </svg>
              <span class="nds-assistive-text">Toggle split view</span>
            </button>
          </div>
        </div>
        <div class="nds-context-bar__vertical-divider"></div>
        <div class="nds-context-bar__item nds-dropdown-trigger nds-dropdown-trigger_click">
          <div class="nds-context-bar__icon-action">
            <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-small" title="Open a New Tab">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#add"></use>
              </svg>
              <span class="nds-assistive-text">Open a New Tab</span>
            </button>
          </div>
        </div>
      </div>
      <div class="nds-context-bar__secondary">
        <div class="nds-context-bar__vertical-divider"></div>
        <ul class="nds-grid" role="tablist">
          <li class="nds-context-bar__item nds-context-bar__item_tab nds-is-active" role="presentation">
            <a href="javascript:void(0);" class="nds-context-bar__label-action" role="tab" title="Home" aria-selected="true" tabindex="0" aria-controls="context-tab-panel-1" id="context-tab-id-1">
              <div class="nds-icon_container" title="Home">
                <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                  <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#home"></use>
                </svg>
                <span class="nds-assistive-text">Home</span>
              </div>
              <span class="nds-truncate" title="Home">Home</span>
            </a>
            <div class="nds-context-bar__icon-action nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-p-left_none nds-p-right_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" tabindex="0" title="Actions for Home">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
                </svg>
                <span class="nds-assistive-text">Actions for Home</span>
              </button>
              <div class="nds-dropdown nds-dropdown_right">
                <ul class="nds-dropdown__list" role="menu">
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Refresh Tab">
                        Refresh Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        r

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Open in a new window">
                        Open in a new window

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        ⇧ + n

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Pin Tab">
                        Pin Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        p

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Close Tab">
                        Close Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        w

                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="nds-context-bar__icon-action nds-col_bump-left nds-p-left_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" tabindex="0" title="Close Home">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                </svg>
                <span class="nds-assistive-text">Close Home</span>
              </button>
            </div>
          </li>
          <li class="nds-context-bar__item nds-context-bar__item_tab" role="presentation">
            <a href="javascript:void(0);" class="nds-context-bar__label-action" role="tab" title="Tab Item 1" aria-selected="false" tabindex="-1" aria-controls="context-tab-panel-2" id="context-tab-id-2">
              <div class="nds-icon_container" title="Case">
                <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                  <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#case"></use>
                </svg>
                <span class="nds-assistive-text">Case</span>
              </div>
              <span class="nds-truncate" title="Tab Item 1">Tab Item 1</span>
            </a>
            <div class="nds-context-bar__icon-action nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-p-left_none nds-p-right_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" tabindex="-1" title="Actions for Tab Item 1">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
                </svg>
                <span class="nds-assistive-text">Actions for Tab Item 1</span>
              </button>
              <div class="nds-dropdown nds-dropdown_right">
                <ul class="nds-dropdown__list" role="menu">
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Refresh Tab">
                        Refresh Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        r

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Open in a new window">
                        Open in a new window

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        ⇧ + n

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Pin Tab">
                        Pin Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        p

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Close Tab">
                        Close Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        w

                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="nds-context-bar__icon-action nds-col_bump-left nds-p-left_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" tabindex="-1" title="Close Tab Item 1">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                </svg>
                <span class="nds-assistive-text">Close Tab Item 1</span>
              </button>
            </div>
          </li>
          <li class="nds-context-bar__item nds-context-bar__item_tab" role="presentation">
            <a href="javascript:void(0);" class="nds-context-bar__label-action" role="tab" title="Tab Item 2" aria-selected="false" tabindex="-1" aria-controls="context-tab-panel-3" id="context-tab-id-3">
              <div class="nds-icon_container" title="Case">
                <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                  <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#case"></use>
                </svg>
                <span class="nds-assistive-text">Case</span>
              </div>
              <span class="nds-truncate" title="Tab Item 2">Tab Item 2</span>
            </a>
            <div class="nds-context-bar__icon-action nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-p-left_none nds-p-right_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" tabindex="-1" title="Actions for Tab Item 2">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
                </svg>
                <span class="nds-assistive-text">Actions for Tab Item 2</span>
              </button>
              <div class="nds-dropdown nds-dropdown_right">
                <ul class="nds-dropdown__list" role="menu">
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Refresh Tab">
                        Refresh Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        r

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Open in a new window">
                        Open in a new window

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        ⇧ + n

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Pin Tab">
                        Pin Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        p

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Close Tab">
                        Close Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        w

                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="nds-context-bar__icon-action nds-col_bump-left nds-p-left_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" tabindex="-1" title="Close Tab Item 2">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                </svg>
                <span class="nds-assistive-text">Close Tab Item 2</span>
              </button>
            </div>
          </li>
          <li class="nds-context-bar__item nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-is-open nds-has-notification">
            <button class="nds-button nds-context-bar__label-action" title="More Tab Items" aria-haspopup="true">
              <span aria-label="New Activity" class="nds-indicator_unread" role="alert" title="New Activity">
                <span class="nds-assistive-text">New Tab activity with in More Tabs menu</span>
              </span>
              <span class="nds-p-left_xx-small nds-truncate" title="More Tabs">
                More

                <span class="nds-assistive-text">Tabs</span>
              </span>
              <svg class="nds-button__icon nds-button__icon_small nds-button__icon_right" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
              </svg>
            </button>
            <div class="nds-dropdown nds-dropdown_right">
              <ul class="nds-dropdown__list" role="menu">
                <li class="nds-dropdown__item nds-has-notification" role="presentation">
                  <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                    <span class="nds-truncate" title="Chat - Customer">
                      <span class="nds-indicator_unread" title="New Activity">
                        <span class="nds-assistive-text">New Activity</span>
                      </span>
                      <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                        <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#live_chat"></use>
                      </svg>
                      <span>Chat - Customer</span>
                    </span>
                  </a>
                </li>
                <li class="nds-dropdown__item" role="presentation">
                  <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                    <span class="nds-truncate" title="Overflow Tab Item">
                      <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                        <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#case"></use>
                      </svg>
                      <span>Overflow Tab Item</span>
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div id="context-tab-panel-1" class="nds-p-vertical_medium nds-show" role="tabpanel" aria-labelledby="context-tab-id-1">Tab Home Content</div>
    <div id="context-tab-panel-2" class="nds-p-vertical_medium nds-hide" role="tabpanel" aria-labelledby="context-tab-id-2">Tab One Content</div>
    <div id="context-tab-panel-3" class="nds-p-vertical_medium nds-hide" role="tabpanel" aria-labelledby="context-tab-id-3">Tab Two Content</div>
  </div>
</div>`);
  })
  .add('Object Switcher Active (states)', () => {
    return withExample(`<div style="height: 16rem;">
  <div class="demo-only">
    <div class="nds-context-bar nds-context-bar_tabs">
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
        <div class="nds-context-bar__item nds-context-bar__object-switcher nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-is-active">
          <a href="javascript:void(0);" class="nds-context-bar__label-action">
            <span class="nds-truncate" title="Object">Object</span>
          </a>
          <div class="nds-context-bar__icon-action">
            <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" title="Open object switcher menu">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
              </svg>
              <span class="nds-assistive-text">Open object switcher menu</span>
            </button>
          </div>
          <div class="nds-dropdown nds-dropdown_right">
            <ul class="nds-dropdown__list" role="menu">
              <li class="nds-dropdown__item" role="presentation">
                <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                  <span class="nds-truncate" title="[object Object],Accounts">
                    <svg class="nds-icon nds-icon_small nds-icon-standard-account nds-m-right_small" aria-hidden="true">
                      <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#account"></use>
                    </svg>
                    Accounts

                  </span>
                </a>
              </li>
              <li class="nds-dropdown__item" role="presentation">
                <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                  <span class="nds-truncate" title="[object Object],Cases">
                    <svg class="nds-icon nds-icon_small nds-icon-standard-case nds-m-right_small" aria-hidden="true">
                      <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#case"></use>
                    </svg>
                    Cases

                  </span>
                </a>
              </li>
              <li class="nds-dropdown__item" role="presentation">
                <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                  <span class="nds-truncate" title="[object Object],Insights">
                    <svg class="nds-icon nds-icon_small nds-icon-standard-work-order nds-m-right_small" aria-hidden="true">
                      <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#work_order"></use>
                    </svg>
                    Insights

                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div class="nds-context-bar__item nds-dropdown-trigger nds-dropdown-trigger_click">
          <div class="nds-context-bar__icon-action">
            <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-small" aria-expanded="false" aria-controls="id_of_split_view_container" title="Toggle split view">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#side_list"></use>
              </svg>
              <span class="nds-assistive-text">Toggle split view</span>
            </button>
          </div>
        </div>
        <div class="nds-context-bar__vertical-divider"></div>
        <div class="nds-context-bar__item nds-dropdown-trigger nds-dropdown-trigger_click">
          <div class="nds-context-bar__icon-action">
            <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-small" title="Open a New Tab">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#add"></use>
              </svg>
              <span class="nds-assistive-text">Open a New Tab</span>
            </button>
          </div>
        </div>
      </div>
      <div class="nds-context-bar__secondary">
        <div class="nds-context-bar__vertical-divider"></div>
        <ul class="nds-grid" role="tablist">
          <li class="nds-context-bar__item nds-context-bar__item_tab" role="presentation">
            <a href="javascript:void(0);" class="nds-context-bar__label-action" role="tab" title="Home" aria-selected="false" tabindex="-1" aria-controls="context-tab-panel-1" id="context-tab-id-1">
              <div class="nds-icon_container" title="Home">
                <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                  <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#home"></use>
                </svg>
                <span class="nds-assistive-text">Home</span>
              </div>
              <span class="nds-truncate" title="Home">Home</span>
            </a>
            <div class="nds-context-bar__icon-action nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-p-left_none nds-p-right_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" tabindex="-1" title="Actions for Home">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
                </svg>
                <span class="nds-assistive-text">Actions for Home</span>
              </button>
              <div class="nds-dropdown nds-dropdown_right">
                <ul class="nds-dropdown__list" role="menu">
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Refresh Tab">
                        Refresh Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        r

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Open in a new window">
                        Open in a new window

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        ⇧ + n

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Pin Tab">
                        Pin Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        p

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Close Tab">
                        Close Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        w

                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="nds-context-bar__icon-action nds-col_bump-left nds-p-left_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" tabindex="-1" title="Close Home">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                </svg>
                <span class="nds-assistive-text">Close Home</span>
              </button>
            </div>
          </li>
          <li class="nds-context-bar__item nds-context-bar__item_tab" role="presentation">
            <a href="javascript:void(0);" class="nds-context-bar__label-action" role="tab" title="Tab Item 1" aria-selected="false" tabindex="-1" aria-controls="context-tab-panel-2" id="context-tab-id-2">
              <div class="nds-icon_container" title="Case">
                <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                  <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#case"></use>
                </svg>
                <span class="nds-assistive-text">Case</span>
              </div>
              <span class="nds-truncate" title="Tab Item 1">Tab Item 1</span>
            </a>
            <div class="nds-context-bar__icon-action nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-p-left_none nds-p-right_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" tabindex="-1" title="Actions for Tab Item 1">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
                </svg>
                <span class="nds-assistive-text">Actions for Tab Item 1</span>
              </button>
              <div class="nds-dropdown nds-dropdown_right">
                <ul class="nds-dropdown__list" role="menu">
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Refresh Tab">
                        Refresh Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        r

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Open in a new window">
                        Open in a new window

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        ⇧ + n

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Pin Tab">
                        Pin Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        p

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Close Tab">
                        Close Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        w

                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="nds-context-bar__icon-action nds-col_bump-left nds-p-left_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" tabindex="-1" title="Close Tab Item 1">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                </svg>
                <span class="nds-assistive-text">Close Tab Item 1</span>
              </button>
            </div>
          </li>
          <li class="nds-context-bar__item nds-context-bar__item_tab" role="presentation">
            <a href="javascript:void(0);" class="nds-context-bar__label-action" role="tab" title="Tab Item 2" aria-selected="false" tabindex="-1" aria-controls="context-tab-panel-3" id="context-tab-id-3">
              <div class="nds-icon_container" title="Case">
                <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                  <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#case"></use>
                </svg>
                <span class="nds-assistive-text">Case</span>
              </div>
              <span class="nds-truncate" title="Tab Item 2">Tab Item 2</span>
            </a>
            <div class="nds-context-bar__icon-action nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-p-left_none nds-p-right_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" tabindex="-1" title="Actions for Tab Item 2">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
                </svg>
                <span class="nds-assistive-text">Actions for Tab Item 2</span>
              </button>
              <div class="nds-dropdown nds-dropdown_right">
                <ul class="nds-dropdown__list" role="menu">
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Refresh Tab">
                        Refresh Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        r

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Open in a new window">
                        Open in a new window

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        ⇧ + n

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Pin Tab">
                        Pin Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        p

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Close Tab">
                        Close Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        w

                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="nds-context-bar__icon-action nds-col_bump-left nds-p-left_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" tabindex="-1" title="Close Tab Item 2">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                </svg>
                <span class="nds-assistive-text">Close Tab Item 2</span>
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div id="context-tab-panel-1" class="nds-p-vertical_medium nds-hide" role="tabpanel" aria-labelledby="context-tab-id-1">Tab Home Content</div>
    <div id="context-tab-panel-2" class="nds-p-vertical_medium nds-hide" role="tabpanel" aria-labelledby="context-tab-id-2">Tab One Content</div>
    <div id="context-tab-panel-3" class="nds-p-vertical_medium nds-hide" role="tabpanel" aria-labelledby="context-tab-id-3">Tab Two Content</div>
  </div>
</div>`);
  })
  .add('Object Switcher Menu Open (states)', () => {
    return withExample(`<div style="height: 16rem;">
  <div class="demo-only" style="height: 11rem;">
    <div class="nds-context-bar nds-context-bar_tabs">
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
        <div class="nds-context-bar__item nds-context-bar__object-switcher nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-is-open">
          <a href="javascript:void(0);" class="nds-context-bar__label-action">
            <span class="nds-truncate" title="Object">Object</span>
          </a>
          <div class="nds-context-bar__icon-action">
            <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" title="Open object switcher menu">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
              </svg>
              <span class="nds-assistive-text">Open object switcher menu</span>
            </button>
          </div>
          <div class="nds-dropdown nds-dropdown_right">
            <ul class="nds-dropdown__list" role="menu">
              <li class="nds-dropdown__item" role="presentation">
                <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                  <span class="nds-truncate" title="[object Object],Accounts">
                    <svg class="nds-icon nds-icon_small nds-icon-standard-account nds-m-right_small" aria-hidden="true">
                      <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#account"></use>
                    </svg>
                    Accounts

                  </span>
                </a>
              </li>
              <li class="nds-dropdown__item" role="presentation">
                <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                  <span class="nds-truncate" title="[object Object],Cases">
                    <svg class="nds-icon nds-icon_small nds-icon-standard-case nds-m-right_small" aria-hidden="true">
                      <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#case"></use>
                    </svg>
                    Cases

                  </span>
                </a>
              </li>
              <li class="nds-dropdown__item" role="presentation">
                <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                  <span class="nds-truncate" title="[object Object],Insights">
                    <svg class="nds-icon nds-icon_small nds-icon-standard-work-order nds-m-right_small" aria-hidden="true">
                      <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#work_order"></use>
                    </svg>
                    Insights

                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div class="nds-context-bar__item nds-dropdown-trigger nds-dropdown-trigger_click">
          <div class="nds-context-bar__icon-action">
            <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-small" aria-expanded="false" aria-controls="id_of_split_view_container" title="Toggle split view">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#side_list"></use>
              </svg>
              <span class="nds-assistive-text">Toggle split view</span>
            </button>
          </div>
        </div>
        <div class="nds-context-bar__vertical-divider"></div>
        <div class="nds-context-bar__item nds-dropdown-trigger nds-dropdown-trigger_click">
          <div class="nds-context-bar__icon-action">
            <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-small" title="Open a New Tab">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#add"></use>
              </svg>
              <span class="nds-assistive-text">Open a New Tab</span>
            </button>
          </div>
        </div>
      </div>
      <div class="nds-context-bar__secondary">
        <div class="nds-context-bar__vertical-divider"></div>
        <ul class="nds-grid" role="tablist">
          <li class="nds-context-bar__item nds-context-bar__item_tab" role="presentation">
            <a href="javascript:void(0);" class="nds-context-bar__label-action" role="tab" title="Home" aria-selected="false" tabindex="-1" aria-controls="context-tab-panel-1" id="context-tab-id-1">
              <div class="nds-icon_container" title="Home">
                <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                  <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#home"></use>
                </svg>
                <span class="nds-assistive-text">Home</span>
              </div>
              <span class="nds-truncate" title="Home">Home</span>
            </a>
            <div class="nds-context-bar__icon-action nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-p-left_none nds-p-right_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" tabindex="-1" title="Actions for Home">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
                </svg>
                <span class="nds-assistive-text">Actions for Home</span>
              </button>
              <div class="nds-dropdown nds-dropdown_right">
                <ul class="nds-dropdown__list" role="menu">
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Refresh Tab">
                        Refresh Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        r

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Open in a new window">
                        Open in a new window

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        ⇧ + n

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Pin Tab">
                        Pin Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        p

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Close Tab">
                        Close Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        w

                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="nds-context-bar__icon-action nds-col_bump-left nds-p-left_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" tabindex="-1" title="Close Home">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                </svg>
                <span class="nds-assistive-text">Close Home</span>
              </button>
            </div>
          </li>
          <li class="nds-context-bar__item nds-context-bar__item_tab" role="presentation">
            <a href="javascript:void(0);" class="nds-context-bar__label-action" role="tab" title="Tab Item 1" aria-selected="false" tabindex="-1" aria-controls="context-tab-panel-2" id="context-tab-id-2">
              <div class="nds-icon_container" title="Case">
                <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                  <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#case"></use>
                </svg>
                <span class="nds-assistive-text">Case</span>
              </div>
              <span class="nds-truncate" title="Tab Item 1">Tab Item 1</span>
            </a>
            <div class="nds-context-bar__icon-action nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-p-left_none nds-p-right_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" tabindex="-1" title="Actions for Tab Item 1">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
                </svg>
                <span class="nds-assistive-text">Actions for Tab Item 1</span>
              </button>
              <div class="nds-dropdown nds-dropdown_right">
                <ul class="nds-dropdown__list" role="menu">
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Refresh Tab">
                        Refresh Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        r

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Open in a new window">
                        Open in a new window

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        ⇧ + n

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Pin Tab">
                        Pin Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        p

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Close Tab">
                        Close Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        w

                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="nds-context-bar__icon-action nds-col_bump-left nds-p-left_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" tabindex="-1" title="Close Tab Item 1">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                </svg>
                <span class="nds-assistive-text">Close Tab Item 1</span>
              </button>
            </div>
          </li>
          <li class="nds-context-bar__item nds-context-bar__item_tab" role="presentation">
            <a href="javascript:void(0);" class="nds-context-bar__label-action" role="tab" title="Tab Item 2" aria-selected="false" tabindex="-1" aria-controls="context-tab-panel-3" id="context-tab-id-3">
              <div class="nds-icon_container" title="Case">
                <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                  <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#case"></use>
                </svg>
                <span class="nds-assistive-text">Case</span>
              </div>
              <span class="nds-truncate" title="Tab Item 2">Tab Item 2</span>
            </a>
            <div class="nds-context-bar__icon-action nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-p-left_none nds-p-right_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" tabindex="-1" title="Actions for Tab Item 2">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
                </svg>
                <span class="nds-assistive-text">Actions for Tab Item 2</span>
              </button>
              <div class="nds-dropdown nds-dropdown_right">
                <ul class="nds-dropdown__list" role="menu">
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Refresh Tab">
                        Refresh Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        r

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Open in a new window">
                        Open in a new window

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        ⇧ + n

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Pin Tab">
                        Pin Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        p

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Close Tab">
                        Close Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        w

                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="nds-context-bar__icon-action nds-col_bump-left nds-p-left_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" tabindex="-1" title="Close Tab Item 2">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                </svg>
                <span class="nds-assistive-text">Close Tab Item 2</span>
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div id="context-tab-panel-1" class="nds-p-vertical_medium nds-hide" role="tabpanel" aria-labelledby="context-tab-id-1">Tab Home Content</div>
    <div id="context-tab-panel-2" class="nds-p-vertical_medium nds-hide" role="tabpanel" aria-labelledby="context-tab-id-2">Tab One Content</div>
    <div id="context-tab-panel-3" class="nds-p-vertical_medium nds-hide" role="tabpanel" aria-labelledby="context-tab-id-3">Tab Two Content</div>
  </div>
</div>`);
  })
  .add('Add Tab Dialog Open (states)', () => {
    return withExample(`<div style="height: 16rem;">
  <div class="demo-only" style="height: 8rem;">
    <div class="nds-context-bar nds-context-bar_tabs">
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
        <div class="nds-context-bar__item nds-context-bar__object-switcher nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click">
          <a href="javascript:void(0);" class="nds-context-bar__label-action">
            <span class="nds-truncate" title="Object">Object</span>
          </a>
          <div class="nds-context-bar__icon-action">
            <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" title="Open object switcher menu">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
              </svg>
              <span class="nds-assistive-text">Open object switcher menu</span>
            </button>
          </div>
          <div class="nds-dropdown nds-dropdown_right">
            <ul class="nds-dropdown__list" role="menu">
              <li class="nds-dropdown__item" role="presentation">
                <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                  <span class="nds-truncate" title="[object Object],Accounts">
                    <svg class="nds-icon nds-icon_small nds-icon-standard-account nds-m-right_small" aria-hidden="true">
                      <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#account"></use>
                    </svg>
                    Accounts

                  </span>
                </a>
              </li>
              <li class="nds-dropdown__item" role="presentation">
                <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                  <span class="nds-truncate" title="[object Object],Cases">
                    <svg class="nds-icon nds-icon_small nds-icon-standard-case nds-m-right_small" aria-hidden="true">
                      <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#case"></use>
                    </svg>
                    Cases

                  </span>
                </a>
              </li>
              <li class="nds-dropdown__item" role="presentation">
                <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                  <span class="nds-truncate" title="[object Object],Insights">
                    <svg class="nds-icon nds-icon_small nds-icon-standard-work-order nds-m-right_small" aria-hidden="true">
                      <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#work_order"></use>
                    </svg>
                    Insights

                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div class="nds-context-bar__item nds-dropdown-trigger nds-dropdown-trigger_click">
          <div class="nds-context-bar__icon-action">
            <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-small" aria-expanded="false" aria-controls="id_of_split_view_container" title="Toggle split view">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#side_list"></use>
              </svg>
              <span class="nds-assistive-text">Toggle split view</span>
            </button>
          </div>
        </div>
        <div class="nds-context-bar__vertical-divider"></div>
        <div class="nds-context-bar__item nds-dropdown-trigger nds-dropdown-trigger_click nds-is-open">
          <div class="nds-context-bar__icon-action">
            <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-small" title="Open a New Tab">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#add"></use>
              </svg>
              <span class="nds-assistive-text">Open a New Tab</span>
            </button>
          </div>
          <section class="nds-popover nds-nubbin_top" role="dialog" aria-label="Add tab by URL or ID" style="position: absolute; left: 1.125rem; top: 2.75rem; margin-left: -10rem;">
            <div class="nds-popover__body">
              <div class="nds-form-element">
                <label class="nds-form-element__label" for="text-input-01">Add Page by URL or ID</label>
                <div class="nds-form-element__control nds-grid">
                  <input type="text" id="text-input-01" class="nds-input" placeholder="Placeholder Text">
                  <button class="nds-button nds-button_brand nds-shrink-none nds-m-left_small" type="submit">Add Tab</button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      <div class="nds-context-bar__secondary">
        <div class="nds-context-bar__vertical-divider"></div>
        <ul class="nds-grid" role="tablist">
          <li class="nds-context-bar__item nds-context-bar__item_tab" role="presentation">
            <a href="javascript:void(0);" class="nds-context-bar__label-action" role="tab" title="Home" aria-selected="false" tabindex="-1" aria-controls="context-tab-panel-1" id="context-tab-id-1">
              <div class="nds-icon_container" title="Home">
                <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                  <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#home"></use>
                </svg>
                <span class="nds-assistive-text">Home</span>
              </div>
              <span class="nds-truncate" title="Home">Home</span>
            </a>
            <div class="nds-context-bar__icon-action nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-p-left_none nds-p-right_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" tabindex="-1" title="Actions for Home">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
                </svg>
                <span class="nds-assistive-text">Actions for Home</span>
              </button>
              <div class="nds-dropdown nds-dropdown_right">
                <ul class="nds-dropdown__list" role="menu">
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Refresh Tab">
                        Refresh Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        r

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Open in a new window">
                        Open in a new window

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        ⇧ + n

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Pin Tab">
                        Pin Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        p

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Close Tab">
                        Close Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        w

                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="nds-context-bar__icon-action nds-col_bump-left nds-p-left_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" tabindex="-1" title="Close Home">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                </svg>
                <span class="nds-assistive-text">Close Home</span>
              </button>
            </div>
          </li>
          <li class="nds-context-bar__item nds-context-bar__item_tab" role="presentation">
            <a href="javascript:void(0);" class="nds-context-bar__label-action" role="tab" title="Tab Item 1" aria-selected="false" tabindex="-1" aria-controls="context-tab-panel-2" id="context-tab-id-2">
              <div class="nds-icon_container" title="Case">
                <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                  <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#case"></use>
                </svg>
                <span class="nds-assistive-text">Case</span>
              </div>
              <span class="nds-truncate" title="Tab Item 1">Tab Item 1</span>
            </a>
            <div class="nds-context-bar__icon-action nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-p-left_none nds-p-right_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" tabindex="-1" title="Actions for Tab Item 1">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
                </svg>
                <span class="nds-assistive-text">Actions for Tab Item 1</span>
              </button>
              <div class="nds-dropdown nds-dropdown_right">
                <ul class="nds-dropdown__list" role="menu">
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Refresh Tab">
                        Refresh Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        r

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Open in a new window">
                        Open in a new window

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        ⇧ + n

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Pin Tab">
                        Pin Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        p

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Close Tab">
                        Close Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        w

                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="nds-context-bar__icon-action nds-col_bump-left nds-p-left_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" tabindex="-1" title="Close Tab Item 1">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                </svg>
                <span class="nds-assistive-text">Close Tab Item 1</span>
              </button>
            </div>
          </li>
          <li class="nds-context-bar__item nds-context-bar__item_tab" role="presentation">
            <a href="javascript:void(0);" class="nds-context-bar__label-action" role="tab" title="Tab Item 2" aria-selected="false" tabindex="-1" aria-controls="context-tab-panel-3" id="context-tab-id-3">
              <div class="nds-icon_container" title="Case">
                <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                  <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#case"></use>
                </svg>
                <span class="nds-assistive-text">Case</span>
              </div>
              <span class="nds-truncate" title="Tab Item 2">Tab Item 2</span>
            </a>
            <div class="nds-context-bar__icon-action nds-context-bar__dropdown-trigger nds-dropdown-trigger nds-dropdown-trigger_click nds-p-left_none nds-p-right_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" aria-haspopup="true" tabindex="-1" title="Actions for Tab Item 2">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
                </svg>
                <span class="nds-assistive-text">Actions for Tab Item 2</span>
              </button>
              <div class="nds-dropdown nds-dropdown_right">
                <ul class="nds-dropdown__list" role="menu">
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Refresh Tab">
                        Refresh Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        r

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Open in a new window">
                        Open in a new window

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        ⇧ + n

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Pin Tab">
                        Pin Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        p

                      </span>
                    </a>
                  </li>
                  <li class="nds-dropdown__item" role="presentation">
                    <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                      <span class="nds-truncate" title="Close Tab">
                        Close Tab

                      </span>
                      <span class="nds-text-body_small nds-text-color_weak nds-p-left_large">
                        <span class="nds-assistive-text">:</span>
                        w

                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="nds-context-bar__icon-action nds-col_bump-left nds-p-left_none">
              <button class="nds-button nds-button_icon nds-button_icon-container nds-button_icon-x-small" tabindex="-1" title="Close Tab Item 2">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                </svg>
                <span class="nds-assistive-text">Close Tab Item 2</span>
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div id="context-tab-panel-1" class="nds-p-vertical_medium nds-hide" role="tabpanel" aria-labelledby="context-tab-id-1">Tab Home Content</div>
    <div id="context-tab-panel-2" class="nds-p-vertical_medium nds-hide" role="tabpanel" aria-labelledby="context-tab-id-2">Tab One Content</div>
    <div id="context-tab-panel-3" class="nds-p-vertical_medium nds-hide" role="tabpanel" aria-labelledby="context-tab-id-3">Tab Two Content</div>
  </div>
</div>`);
  });
