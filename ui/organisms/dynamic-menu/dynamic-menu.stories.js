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
    return withExample(`<div class="demo-only" style="height: 12rem;">
  <button class="nds-button nds-button_icon nds-button_icon-border-filled" title="Show Favorites">
    <svg class="nds-button__icon" aria-hidden="true">
      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#favorite"></use>
    </svg>
    <span class="nds-assistive-text">Show Favorites</span>
  </button>
  <section class="nds-popover nds-nubbin_top-left nds-dynamic-menu" role="dialog" aria-label="My Favourites" aria-describedby="dialog-body-id-1" style="position: absolute; left: 0px; top: 55px;">
    <div class="nds-popover__body nds-p-horizontal_none" id="dialog-body-id-1">
      <div class="nds-p-vertical_x-small nds-p-horizontal_small">
        <h3 class="nds-text-title_caps nds-m-bottom_x-small" role="presentation">My Favorites</h3>
        <p>You can favorite any page!</p>
      </div>
    </div>
    <footer class="nds-popover__footer">
      <ul>
        <li>
          <button class="nds-button nds-button_reset nds-p-vertical_xx-small nds-size_1-of-1">
            <svg class="nds-button__icon nds-button__icon_left" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#add"></use>
            </svg>
            Favorite this page

          </button>
        </li>
        <li>
          <button class="nds-button nds-button_reset nds-p-vertical_xx-small nds-size_1-of-1">
            <svg class="nds-button__icon nds-button__icon_left" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
            </svg>
            Edit Favorites

          </button>
        </li>
      </ul>
    </footer>
  </section>
</div>`);
  })
  .add('Dynamic Menu 0 Items (states)', () => {
    return withExample(`<div class="demo-only" style="height: 12rem;">
  <button class="nds-button nds-button_icon nds-button_icon-border-filled" title="Show Favorites">
    <svg class="nds-button__icon" aria-hidden="true">
      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#favorite"></use>
    </svg>
    <span class="nds-assistive-text">Show Favorites</span>
  </button>
  <section class="nds-popover nds-nubbin_top-left nds-dynamic-menu" role="dialog" aria-label="My Favourites" aria-describedby="dialog-body-id-2" style="position: absolute; left: 0px; top: 55px;">
    <div class="nds-popover__body nds-p-horizontal_none" id="dialog-body-id-2">
      <div class="nds-p-vertical_x-small nds-p-horizontal_small">
        <h3 class="nds-text-title_caps nds-m-bottom_x-small" role="presentation">My Favorites</h3>
        <p>You can favorite any page!</p>
      </div>
    </div>
    <footer class="nds-popover__footer">
      <ul>
        <li>
          <button class="nds-button nds-button_reset nds-p-vertical_xx-small nds-size_1-of-1">
            <svg class="nds-button__icon nds-button__icon_left" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#add"></use>
            </svg>
            Favorite this page

          </button>
        </li>
        <li>
          <button class="nds-button nds-button_reset nds-p-vertical_xx-small nds-size_1-of-1">
            <svg class="nds-button__icon nds-button__icon_left" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
            </svg>
            Edit Favorites

          </button>
        </li>
      </ul>
    </footer>
  </section>
</div>`);
  })
  .add('Dynamic Menu 1 Item (states)', () => {
    return withExample(`<div class="demo-only" style="height: 13rem;">
  <button class="nds-button nds-button_icon nds-button_icon-border-filled" title="Show Favorites">
    <svg class="nds-button__icon" aria-hidden="true">
      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#favorite"></use>
    </svg>
    <span class="nds-assistive-text">Show Favorites</span>
  </button>
  <section class="nds-popover nds-nubbin_top-left nds-dynamic-menu" role="dialog" aria-label="My Favourites" aria-describedby="dialog-body-id-3" style="position: absolute; left: 0px; top: 55px;">
    <div class="nds-popover__body nds-p-horizontal_none" id="dialog-body-id-3">
      <div id="listbox-unique-id" role="listbox">
        <ul class="nds-listbox nds-listbox_vertical nds-dropdown_length-10" role="group" aria-label="My Favorites">
          <li role="presentation" class="nds-listbox__item">
            <span class="nds-media nds-listbox__option nds-listbox__option_plain" role="presentation">
              <h3 class="nds-text-title_caps" role="presentation">My Favorites</h3>
            </span>
          </li>
          <li role="presentation" class="nds-listbox__item">
            <span id="listbox-option-id-1" class="nds-media nds-listbox__option nds-listbox__option_entity nds-listbox__option_has-meta" role="option" tabindex="0">
              <span class="nds-media__figure">
                <span class="nds-icon_container nds-icon-standard-account" title="Description of icon when needed">
                  <svg class="nds-icon nds-icon_small" aria-hidden="true">
                    <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#account"></use>
                  </svg>
                  <span class="nds-assistive-text">Description of icon</span>
                </span>
              </span>
              <span class="nds-media__body">
                <span class="nds-listbox__option-text nds-listbox__option-text_entity">Acme</span>
                <span class="nds-listbox__option-meta nds-listbox__option-meta_entity">
                  Account

                  •



                  San Francisco

                </span>
              </span>
            </span>
          </li>
        </ul>
      </div>
    </div>
    <footer class="nds-popover__footer">
      <ul>
        <li>
          <button class="nds-button nds-button_reset nds-p-vertical_xx-small nds-size_1-of-1">
            <svg class="nds-button__icon nds-button__icon_left" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#add"></use>
            </svg>
            Favorite this page

          </button>
        </li>
        <li>
          <button class="nds-button nds-button_reset nds-p-vertical_xx-small nds-size_1-of-1">
            <svg class="nds-button__icon nds-button__icon_left" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
            </svg>
            Edit Favorites

          </button>
        </li>
      </ul>
    </footer>
  </section>
</div>`);
  })
  .add('Dynamic Menu Sub 10 Item (states)', () => {
    return withExample(`<div class="demo-only" style="height: 27rem;">
  <button class="nds-button nds-button_icon nds-button_icon-border-filled" title="Show Favorites">
    <svg class="nds-button__icon" aria-hidden="true">
      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#favorite"></use>
    </svg>
    <span class="nds-assistive-text">Show Favorites</span>
  </button>
  <section class="nds-popover nds-nubbin_top-left nds-dynamic-menu" role="dialog" aria-label="My Favourites" aria-describedby="dialog-body-id-4" style="position: absolute; left: 0px; top: 55px;">
    <div class="nds-popover__body nds-p-horizontal_none" id="dialog-body-id-4">
      <div id="listbox-unique-id" role="listbox">
        <ul class="nds-listbox nds-listbox_vertical nds-dropdown_length-10" role="group" aria-label="My Favorites">
          <li role="presentation" class="nds-listbox__item">
            <span class="nds-media nds-listbox__option nds-listbox__option_plain" role="presentation">
              <h3 class="nds-text-title_caps" role="presentation">My Favorites</h3>
            </span>
          </li>
          <li role="presentation" class="nds-listbox__item">
            <span id="listbox-option-id-2" class="nds-media nds-listbox__option nds-listbox__option_entity nds-listbox__option_has-meta" role="option" tabindex="0">
              <span class="nds-media__figure">
                <span class="nds-icon_container nds-icon-standard-account" title="Description of icon when needed">
                  <svg class="nds-icon nds-icon_small" aria-hidden="true">
                    <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#account"></use>
                  </svg>
                  <span class="nds-assistive-text">Description of icon</span>
                </span>
              </span>
              <span class="nds-media__body">
                <span class="nds-listbox__option-text nds-listbox__option-text_entity">Acme</span>
                <span class="nds-listbox__option-meta nds-listbox__option-meta_entity">
                  Account

                  •



                  San Francisco

                </span>
              </span>
            </span>
          </li>
          <li role="presentation" class="nds-listbox__item">
            <span id="listbox-option-id-3" class="nds-media nds-listbox__option nds-listbox__option_entity nds-listbox__option_has-meta" role="option">
              <span class="nds-media__figure">
                <span class="nds-icon_container nds-icon-standard-account" title="Description of icon when needed">
                  <svg class="nds-icon nds-icon_small" aria-hidden="true">
                    <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#account"></use>
                  </svg>
                  <span class="nds-assistive-text">Description of icon</span>
                </span>
              </span>
              <span class="nds-media__body">
                <span class="nds-listbox__option-text nds-listbox__option-text_entity">Edge SLA</span>
                <span class="nds-listbox__option-meta nds-listbox__option-meta_entity">
                  Account

                  •



                  San Francisco

                </span>
              </span>
            </span>
          </li>
          <li role="presentation" class="nds-listbox__item">
            <span id="listbox-option-id-4" class="nds-media nds-listbox__option nds-listbox__option_entity nds-listbox__option_has-meta" role="option">
              <span class="nds-media__figure">
                <span class="nds-icon_container nds-icon-standard-account" title="Description of icon when needed">
                  <svg class="nds-icon nds-icon_small" aria-hidden="true">
                    <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#account"></use>
                  </svg>
                  <span class="nds-assistive-text">Description of icon</span>
                </span>
              </span>
              <span class="nds-media__body">
                <span class="nds-listbox__option-text nds-listbox__option-text_entity">Express Logistics SLA</span>
                <span class="nds-listbox__option-meta nds-listbox__option-meta_entity">
                  Account

                  •



                  San Francisco

                </span>
              </span>
            </span>
          </li>
          <li role="presentation" class="nds-listbox__item">
            <span id="listbox-option-id-5" class="nds-media nds-listbox__option nds-listbox__option_entity nds-listbox__option_has-meta" role="option">
              <span class="nds-media__figure">
                <span class="nds-icon_container nds-icon-standard-account" title="Description of icon when needed">
                  <svg class="nds-icon nds-icon_small" aria-hidden="true">
                    <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#account"></use>
                  </svg>
                  <span class="nds-assistive-text">Description of icon</span>
                </span>
              </span>
              <span class="nds-media__body">
                <span class="nds-listbox__option-text nds-listbox__option-text_entity">GenePoint Lab Generators</span>
                <span class="nds-listbox__option-meta nds-listbox__option-meta_entity">
                  Account

                  •



                  San Francisco

                </span>
              </span>
            </span>
          </li>
          <li role="presentation" class="nds-listbox__item">
            <span id="listbox-option-id-6" class="nds-media nds-listbox__option nds-listbox__option_entity nds-listbox__option_has-meta" role="option">
              <span class="nds-media__figure">
                <span class="nds-icon_container nds-icon-standard-account" title="Description of icon when needed">
                  <svg class="nds-icon nds-icon_small" aria-hidden="true">
                    <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#account"></use>
                  </svg>
                  <span class="nds-assistive-text">Description of icon</span>
                </span>
              </span>
              <span class="nds-media__body">
                <span class="nds-listbox__option-text nds-listbox__option-text_entity">GenePoint SLA</span>
                <span class="nds-listbox__option-meta nds-listbox__option-meta_entity">
                  Account

                  •



                  San Francisco

                </span>
              </span>
            </span>
          </li>
          <li role="presentation" class="nds-listbox__item">
            <span id="listbox-option-id-7" class="nds-media nds-listbox__option nds-listbox__option_entity nds-listbox__option_has-meta" role="option">
              <span class="nds-media__figure">
                <span class="nds-icon_container nds-icon-standard-account" title="Description of icon when needed">
                  <svg class="nds-icon nds-icon_small" aria-hidden="true">
                    <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#account"></use>
                  </svg>
                  <span class="nds-assistive-text">Description of icon</span>
                </span>
              </span>
              <span class="nds-media__body">
                <span class="nds-listbox__option-text nds-listbox__option-text_entity">Pyramid Emergency Generators</span>
                <span class="nds-listbox__option-meta nds-listbox__option-meta_entity">
                  Account

                  •



                  San Francisco

                </span>
              </span>
            </span>
          </li>
        </ul>
      </div>
    </div>
    <footer class="nds-popover__footer">
      <ul>
        <li>
          <button class="nds-button nds-button_reset nds-p-vertical_xx-small nds-size_1-of-1">
            <svg class="nds-button__icon nds-button__icon_left" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#add"></use>
            </svg>
            Favorite this page

          </button>
        </li>
        <li>
          <button class="nds-button nds-button_reset nds-p-vertical_xx-small nds-size_1-of-1">
            <svg class="nds-button__icon nds-button__icon_left" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
            </svg>
            Edit Favorites

          </button>
        </li>
      </ul>
    </footer>
  </section>
</div>`);
  })
  .add('Dynamic Menu Over 10 Item (states)', () => {
    return withExample(`<div class="demo-only" style="height: 34rem;">
  <button class="nds-button nds-button_icon nds-button_icon-border-filled" title="Show Favorites">
    <svg class="nds-button__icon" aria-hidden="true">
      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#favorite"></use>
    </svg>
    <span class="nds-assistive-text">Show Favorites</span>
  </button>
  <section class="nds-popover nds-nubbin_top-left nds-dynamic-menu" role="dialog" aria-label="My Favourites" aria-describedby="dialog-body-id-5" style="position: absolute; left: 0px; top: 55px;">
    <div class="nds-popover__body nds-p-horizontal_none" id="dialog-body-id-5">
      <div class="nds-form-element">
        <label class="nds-form-element__label nds-assistive-text" for="combobox-unique-id">Search</label>
        <div class="nds-form-element__control">
          <div class="nds-combobox_container">
            <div class="nds-combobox nds-is-open" aria-expanded="true" aria-haspopup="listbox" role="combobox">
              <div class="nds-combobox__form-element nds-input-has-icon nds-input-has-icon_right nds-m-around_small" role="none">
                <input type="text" class="nds-input nds-combobox__input" id="combobox-unique-id" aria-autocomplete="list" aria-controls="listbox-unique-id" autocomplete="off" role="textbox" placeholder="Search Favorites">
                <span class="nds-icon_container nds-icon-utility-search nds-input__icon nds-input__icon_right">
                  <svg class="nds-icon nds-icon nds-icon_x-small nds-icon-text-default" aria-hidden="true">
                    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#search"></use>
                  </svg>
                </span>
              </div>
              <div id="listbox-unique-id" role="listbox">
                <ul class="nds-listbox nds-listbox_vertical nds-dropdown_length-10" role="group" aria-label="My Favorites">
                  <li role="presentation" class="nds-listbox__item">
                    <span class="nds-media nds-listbox__option nds-listbox__option_plain" role="presentation">
                      <h3 class="nds-text-title_caps" role="presentation">My Favorites</h3>
                    </span>
                  </li>
                  <li role="presentation" class="nds-listbox__item">
                    <span id="listbox-option-id-8" class="nds-media nds-listbox__option nds-listbox__option_entity nds-listbox__option_has-meta" role="option">
                      <span class="nds-media__figure">
                        <span class="nds-icon_container nds-icon-standard-account" title="Description of icon when needed">
                          <svg class="nds-icon nds-icon_small" aria-hidden="true">
                            <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#account"></use>
                          </svg>
                          <span class="nds-assistive-text">Description of icon</span>
                        </span>
                      </span>
                      <span class="nds-media__body">
                        <span class="nds-listbox__option-text nds-listbox__option-text_entity">Acme</span>
                        <span class="nds-listbox__option-meta nds-listbox__option-meta_entity">
                          Account

                          •



                          San Francisco

                        </span>
                      </span>
                    </span>
                  </li>
                  <li role="presentation" class="nds-listbox__item">
                    <span id="listbox-option-id-9" class="nds-media nds-listbox__option nds-listbox__option_entity nds-listbox__option_has-meta" role="option">
                      <span class="nds-media__figure">
                        <span class="nds-icon_container nds-icon-standard-account" title="Description of icon when needed">
                          <svg class="nds-icon nds-icon_small" aria-hidden="true">
                            <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#account"></use>
                          </svg>
                          <span class="nds-assistive-text">Description of icon</span>
                        </span>
                      </span>
                      <span class="nds-media__body">
                        <span class="nds-listbox__option-text nds-listbox__option-text_entity">Edge SLA</span>
                        <span class="nds-listbox__option-meta nds-listbox__option-meta_entity">
                          Account

                          •



                          San Francisco

                        </span>
                      </span>
                    </span>
                  </li>
                  <li role="presentation" class="nds-listbox__item">
                    <span id="listbox-option-id-10" class="nds-media nds-listbox__option nds-listbox__option_entity nds-listbox__option_has-meta" role="option">
                      <span class="nds-media__figure">
                        <span class="nds-icon_container nds-icon-standard-account" title="Description of icon when needed">
                          <svg class="nds-icon nds-icon_small" aria-hidden="true">
                            <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#account"></use>
                          </svg>
                          <span class="nds-assistive-text">Description of icon</span>
                        </span>
                      </span>
                      <span class="nds-media__body">
                        <span class="nds-listbox__option-text nds-listbox__option-text_entity">Express Logistics SLA</span>
                        <span class="nds-listbox__option-meta nds-listbox__option-meta_entity">
                          Account

                          •



                          San Francisco

                        </span>
                      </span>
                    </span>
                  </li>
                  <li role="presentation" class="nds-listbox__item">
                    <span id="listbox-option-id-11" class="nds-media nds-listbox__option nds-listbox__option_entity nds-listbox__option_has-meta" role="option">
                      <span class="nds-media__figure">
                        <span class="nds-icon_container nds-icon-standard-account" title="Description of icon when needed">
                          <svg class="nds-icon nds-icon_small" aria-hidden="true">
                            <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#account"></use>
                          </svg>
                          <span class="nds-assistive-text">Description of icon</span>
                        </span>
                      </span>
                      <span class="nds-media__body">
                        <span class="nds-listbox__option-text nds-listbox__option-text_entity">GenePoint Lab Generators</span>
                        <span class="nds-listbox__option-meta nds-listbox__option-meta_entity">
                          Account

                          •



                          San Francisco

                        </span>
                      </span>
                    </span>
                  </li>
                  <li role="presentation" class="nds-listbox__item">
                    <span id="listbox-option-id-12" class="nds-media nds-listbox__option nds-listbox__option_entity nds-listbox__option_has-meta" role="option">
                      <span class="nds-media__figure">
                        <span class="nds-icon_container nds-icon-standard-account" title="Description of icon when needed">
                          <svg class="nds-icon nds-icon_small" aria-hidden="true">
                            <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#account"></use>
                          </svg>
                          <span class="nds-assistive-text">Description of icon</span>
                        </span>
                      </span>
                      <span class="nds-media__body">
                        <span class="nds-listbox__option-text nds-listbox__option-text_entity">GenePoint SLA</span>
                        <span class="nds-listbox__option-meta nds-listbox__option-meta_entity">
                          Account

                          •



                          San Francisco

                        </span>
                      </span>
                    </span>
                  </li>
                  <li role="presentation" class="nds-listbox__item">
                    <span id="listbox-option-id-13" class="nds-media nds-listbox__option nds-listbox__option_entity nds-listbox__option_has-meta" role="option">
                      <span class="nds-media__figure">
                        <span class="nds-icon_container nds-icon-standard-account" title="Description of icon when needed">
                          <svg class="nds-icon nds-icon_small" aria-hidden="true">
                            <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#account"></use>
                          </svg>
                          <span class="nds-assistive-text">Description of icon</span>
                        </span>
                      </span>
                      <span class="nds-media__body">
                        <span class="nds-listbox__option-text nds-listbox__option-text_entity">Pyramid Emergency Generators</span>
                        <span class="nds-listbox__option-meta nds-listbox__option-meta_entity">
                          Account

                          •



                          San Francisco

                        </span>
                      </span>
                    </span>
                  </li>
                  <li role="presentation" class="nds-listbox__item">
                    <span id="listbox-option-id-14" class="nds-media nds-listbox__option nds-listbox__option_entity nds-listbox__option_has-meta" role="option">
                      <span class="nds-media__figure">
                        <span class="nds-icon_container nds-icon-standard-account" title="Description of icon when needed">
                          <svg class="nds-icon nds-icon_small" aria-hidden="true">
                            <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#account"></use>
                          </svg>
                          <span class="nds-assistive-text">Description of icon</span>
                        </span>
                      </span>
                      <span class="nds-media__body">
                        <span class="nds-listbox__option-text nds-listbox__option-text_entity">United Oil Installations</span>
                        <span class="nds-listbox__option-meta nds-listbox__option-meta_entity">
                          Account

                          •



                          San Francisco

                        </span>
                      </span>
                    </span>
                  </li>
                  <li role="presentation" class="nds-listbox__item">
                    <span id="listbox-option-id-15" class="nds-media nds-listbox__option nds-listbox__option_entity nds-listbox__option_has-meta" role="option">
                      <span class="nds-media__figure">
                        <span class="nds-icon_container nds-icon-standard-account" title="Description of icon when needed">
                          <svg class="nds-icon nds-icon_small" aria-hidden="true">
                            <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#account"></use>
                          </svg>
                          <span class="nds-assistive-text">Description of icon</span>
                        </span>
                      </span>
                      <span class="nds-media__body">
                        <span class="nds-listbox__option-text nds-listbox__option-text_entity">United Oil Plant Standby Generators</span>
                        <span class="nds-listbox__option-meta nds-listbox__option-meta_entity">
                          Account

                          •



                          San Francisco

                        </span>
                      </span>
                    </span>
                  </li>
                  <li role="presentation" class="nds-listbox__item">
                    <span id="listbox-option-id-16" class="nds-media nds-listbox__option nds-listbox__option_entity nds-listbox__option_has-meta" role="option">
                      <span class="nds-media__figure">
                        <span class="nds-icon_container nds-icon-standard-account" title="Description of icon when needed">
                          <svg class="nds-icon nds-icon_small" aria-hidden="true">
                            <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#account"></use>
                          </svg>
                          <span class="nds-assistive-text">Description of icon</span>
                        </span>
                      </span>
                      <span class="nds-media__body">
                        <span class="nds-listbox__option-text nds-listbox__option-text_entity">University of AZ Installations</span>
                        <span class="nds-listbox__option-meta nds-listbox__option-meta_entity">
                          Account

                          •



                          San Francisco

                        </span>
                      </span>
                    </span>
                  </li>
                  <li role="presentation" class="nds-listbox__item">
                    <span id="listbox-option-id-17" class="nds-media nds-listbox__option nds-listbox__option_entity nds-listbox__option_has-meta" role="option">
                      <span class="nds-media__figure">
                        <span class="nds-icon_container nds-icon-standard-account" title="Description of icon when needed">
                          <svg class="nds-icon nds-icon_small" aria-hidden="true">
                            <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#account"></use>
                          </svg>
                          <span class="nds-assistive-text">Description of icon</span>
                        </span>
                      </span>
                      <span class="nds-media__body">
                        <span class="nds-listbox__option-text nds-listbox__option-text_entity">University of AZ Portable Generators</span>
                        <span class="nds-listbox__option-meta nds-listbox__option-meta_entity">
                          Account

                          •



                          San Francisco

                        </span>
                      </span>
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <footer class="nds-popover__footer">
      <ul>
        <li>
          <button class="nds-button nds-button_reset nds-p-vertical_xx-small nds-size_1-of-1">
            <svg class="nds-button__icon nds-button__icon_left" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#add"></use>
            </svg>
            Favorite this page

          </button>
        </li>
        <li>
          <button class="nds-button nds-button_reset nds-p-vertical_xx-small nds-size_1-of-1">
            <svg class="nds-button__icon nds-button__icon_left" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
            </svg>
            Edit Favorites

          </button>
        </li>
      </ul>
    </footer>
  </section>
</div>`);
  });
