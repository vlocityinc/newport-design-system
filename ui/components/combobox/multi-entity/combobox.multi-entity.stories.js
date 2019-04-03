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
    return withExample(`<div class="demo-only" style="height: 10rem;">
  <div class="nds-form-element">
    <label class="nds-form-element__label" for="combobox-unique-id">Search</label>
    <div class="nds-form-element__control">
      <div class="nds-combobox_container nds-has-object-switcher">
        <div class="nds-listbox_object-switcher nds-dropdown-trigger nds-dropdown-trigger_click">
          <button class="nds-button nds-button_icon" aria-haspopup="true" title="Select object to search in">
            <span class="nds-icon_container nds-icon-standard-account" title="Accounts">
              <svg class="nds-icon nds-icon_small" aria-hidden="true">
                <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#account"></use>
              </svg>
              <span class="nds-assistive-text">Searching in: Accounts</span>
            </span>
            <svg class="nds-button__icon nds-button__icon_x-small" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
            </svg>
          </button>
        </div>
        <div class="nds-combobox nds-dropdown-trigger nds-dropdown-trigger_click" aria-expanded="false" aria-haspopup="listbox" role="combobox">
          <div class="nds-combobox__form-element nds-input-has-icon nds-input-has-icon_right" role="none">
            <input type="text" class="nds-input nds-combobox__input" id="combobox-unique-id" aria-autocomplete="list" aria-controls="listbox-unique-id" autocomplete="off" role="textbox" placeholder="Search Salesforce">
            <span class="nds-icon_container nds-icon-utility-search nds-input__icon nds-input__icon_right">
              <svg class="nds-icon nds-icon nds-icon_x-small nds-icon-text-default" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#search"></use>
              </svg>
            </span>
          </div>
          <div id="listbox-unique-id" role="listbox">
            <ul class="nds-listbox nds-listbox_vertical nds-dropdown nds-dropdown_fluid" role="presentation">
              <li role="presentation" class="nds-listbox__item">
                <span id="listbox-option-unique-id-01" class="nds-media nds-listbox__option nds-listbox__option_entity nds-listbox__option_has-meta" role="option">
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
                <span id="listbox-option-unique-id-02" class="nds-media nds-listbox__option nds-listbox__option_entity nds-listbox__option_has-meta" role="option">
                  <span class="nds-media__figure">
                    <span class="nds-icon_container nds-icon-standard-account" title="Description of icon when needed">
                      <svg class="nds-icon nds-icon_small" aria-hidden="true">
                        <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#account"></use>
                      </svg>
                      <span class="nds-assistive-text">Description of icon</span>
                    </span>
                  </span>
                  <span class="nds-media__body">
                    <span class="nds-listbox__option-text nds-listbox__option-text_entity">Salesforce.com, Inc.</span>
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
</div>`);
  })
  .add('Focused (states)', () => {
    return withExample(`<div class="demo-only" style="height: 10rem;">
  <div class="nds-form-element">
    <label class="nds-form-element__label" for="combobox-unique-id">Search</label>
    <div class="nds-form-element__control">
      <div class="nds-combobox_container nds-has-object-switcher nds-has-input-focus">
        <div class="nds-listbox_object-switcher nds-dropdown-trigger nds-dropdown-trigger_click">
          <button class="nds-button nds-button_icon" aria-haspopup="true" title="Select object to search in">
            <span class="nds-icon_container nds-icon-standard-account" title="Accounts">
              <svg class="nds-icon nds-icon_small" aria-hidden="true">
                <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#account"></use>
              </svg>
              <span class="nds-assistive-text">Searching in: Accounts</span>
            </span>
            <svg class="nds-button__icon nds-button__icon_x-small" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
            </svg>
          </button>
        </div>
        <div class="nds-combobox nds-dropdown-trigger nds-dropdown-trigger_click nds-is-open" aria-expanded="true" aria-haspopup="listbox" role="combobox">
          <div class="nds-combobox__form-element nds-input-has-icon nds-input-has-icon_right" role="none">
            <input type="text" class="nds-input nds-combobox__input" id="combobox-unique-id" aria-autocomplete="list" aria-controls="listbox-unique-id" autocomplete="off" role="textbox" placeholder="Search Salesforce">
            <span class="nds-icon_container nds-icon-utility-search nds-input__icon nds-input__icon_right">
              <svg class="nds-icon nds-icon nds-icon_x-small nds-icon-text-default" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#search"></use>
              </svg>
            </span>
          </div>
          <div id="listbox-unique-id" role="listbox">
            <ul class="nds-listbox nds-listbox_vertical nds-dropdown nds-dropdown_fluid" role="presentation">
              <li role="presentation" class="nds-listbox__item">
                <span id="listbox-option-unique-id-01" class="nds-media nds-listbox__option nds-listbox__option_entity nds-listbox__option_has-meta" role="option">
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
                <span id="listbox-option-unique-id-02" class="nds-media nds-listbox__option nds-listbox__option_entity nds-listbox__option_has-meta" role="option">
                  <span class="nds-media__figure">
                    <span class="nds-icon_container nds-icon-standard-account" title="Description of icon when needed">
                      <svg class="nds-icon nds-icon_small" aria-hidden="true">
                        <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#account"></use>
                      </svg>
                      <span class="nds-assistive-text">Description of icon</span>
                    </span>
                  </span>
                  <span class="nds-media__body">
                    <span class="nds-listbox__option-text nds-listbox__option-text_entity">Salesforce.com, Inc.</span>
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
</div>`);
  })
  .add('Open Item Focused (states)', () => {
    return withExample(`<div class="demo-only" style="height: 10rem;">
  <div class="nds-form-element">
    <label class="nds-form-element__label" for="combobox-unique-id">Search</label>
    <div class="nds-form-element__control">
      <div class="nds-combobox_container nds-has-object-switcher">
        <div class="nds-listbox_object-switcher nds-dropdown-trigger nds-dropdown-trigger_click">
          <button class="nds-button nds-button_icon" aria-haspopup="true" title="Select object to search in">
            <span class="nds-icon_container nds-icon-standard-account" title="Accounts">
              <svg class="nds-icon nds-icon_small" aria-hidden="true">
                <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#account"></use>
              </svg>
              <span class="nds-assistive-text">Searching in: Accounts</span>
            </span>
            <svg class="nds-button__icon nds-button__icon_x-small" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
            </svg>
          </button>
        </div>
        <div class="nds-combobox nds-dropdown-trigger nds-dropdown-trigger_click nds-is-open" aria-expanded="true" aria-haspopup="listbox" role="combobox">
          <div class="nds-combobox__form-element nds-input-has-icon nds-input-has-icon_right" role="none">
            <input type="text" class="nds-input nds-combobox__input" id="combobox-unique-id" aria-activedescendant="listbox-option-unique-id-01" aria-autocomplete="list" aria-controls="listbox-unique-id" autocomplete="off" role="textbox" placeholder="Search Salesforce">
            <span class="nds-icon_container nds-icon-utility-search nds-input__icon nds-input__icon_right">
              <svg class="nds-icon nds-icon nds-icon_x-small nds-icon-text-default" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#search"></use>
              </svg>
            </span>
          </div>
          <div id="listbox-unique-id" role="listbox">
            <ul class="nds-listbox nds-listbox_vertical nds-dropdown nds-dropdown_fluid" role="presentation">
              <li role="presentation" class="nds-listbox__item">
                <span id="listbox-option-unique-id-01" class="nds-media nds-listbox__option nds-listbox__option_entity nds-listbox__option_has-meta nds-has-focus" role="option">
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
                <span id="listbox-option-unique-id-02" class="nds-media nds-listbox__option nds-listbox__option_entity nds-listbox__option_has-meta" role="option">
                  <span class="nds-media__figure">
                    <span class="nds-icon_container nds-icon-standard-account" title="Description of icon when needed">
                      <svg class="nds-icon nds-icon_small" aria-hidden="true">
                        <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#account"></use>
                      </svg>
                      <span class="nds-assistive-text">Description of icon</span>
                    </span>
                  </span>
                  <span class="nds-media__body">
                    <span class="nds-listbox__option-text nds-listbox__option-text_entity">Salesforce.com, Inc.</span>
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
</div>`);
  })
  .add('Options Selected (states)', () => {
    return withExample(`<div class="nds-form-element">
  <label class="nds-form-element__label" for="combobox-unique-id">Search</label>
  <div class="nds-form-element__control">
    <div class="nds-combobox_container nds-has-object-switcher">
      <div class="nds-listbox_object-switcher nds-dropdown-trigger nds-dropdown-trigger_click">
        <button class="nds-button nds-button_icon" aria-haspopup="true" title="Select object to search in">
          <span class="nds-icon_container nds-icon-standard-account" title="Accounts">
            <svg class="nds-icon nds-icon_small" aria-hidden="true">
              <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#account"></use>
            </svg>
            <span class="nds-assistive-text">Searching in: Accounts</span>
          </span>
          <svg class="nds-button__icon nds-button__icon_x-small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
          </svg>
        </button>
      </div>
      <div class="nds-combobox nds-dropdown-trigger nds-dropdown-trigger_click" aria-expanded="false" aria-haspopup="listbox" role="combobox">
        <div class="nds-combobox__form-element nds-input-has-icon nds-input-has-icon_right" role="none">
          <input type="text" class="nds-input nds-combobox__input" id="combobox-unique-id" aria-autocomplete="list" aria-controls="listbox-unique-id" autocomplete="off" role="textbox" placeholder="Search Salesforce">
          <span class="nds-icon_container nds-icon-utility-search nds-input__icon nds-input__icon_right">
            <svg class="nds-icon nds-icon nds-icon_x-small nds-icon-text-default" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#search"></use>
            </svg>
          </span>
        </div>
      </div>
    </div>
    <div id="listbox-selections-unique-id" role="listbox" aria-orientation="horizontal">
      <ul class="nds-listbox nds-listbox_inline nds-p-top_xxx-small" role="group" aria-label="Selected Options:">
        <li role="presentation" class="nds-listbox__item">
          <span class="nds-pill" role="option" tabindex="0" aria-selected="true">
            <span class="nds-avatar nds-avatar_x-small nds-pill__icon_container">
              <span class="nds-icon_container nds-icon-standard-account" title="Description of icon when needed">
                <svg class="nds-icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#account"></use>
                </svg>
                <span class="nds-assistive-text">Description of icon</span>
              </span>
            </span>
            <span class="nds-pill__label" title="Acme">Acme</span>
            <span class="nds-icon_container nds-pill__remove" title="Remove">
              <svg class="nds-icon nds-icon_x-small nds-icon-text-default" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
              </svg>
              <span class="nds-assistive-text">Press delete or backspace to remove</span>
            </span>
          </span>
        </li>
        <li role="presentation" class="nds-listbox__item">
          <span class="nds-pill" role="option" aria-selected="true">
            <span class="nds-avatar nds-avatar_x-small nds-pill__icon_container">
              <span class="nds-icon_container nds-icon-standard-opportunity" title="Description of icon when needed">
                <svg class="nds-icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#opportunity"></use>
                </svg>
                <span class="nds-assistive-text">Description of icon</span>
              </span>
            </span>
            <span class="nds-pill__label" title="Salesforce.com, Inc.">Salesforce.com, Inc.</span>
            <span class="nds-icon_container nds-pill__remove" title="Remove">
              <svg class="nds-icon nds-icon_x-small nds-icon-text-default" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
              </svg>
              <span class="nds-assistive-text">Press delete or backspace to remove</span>
            </span>
          </span>
        </li>
      </ul>
    </div>
  </div>
</div>`);
  })
  .add('Focused Options Selected (states)', () => {
    return withExample(`<div class="demo-only" style="height: 10rem;">
  <div class="nds-form-element">
    <label class="nds-form-element__label" for="combobox-unique-id">Search</label>
    <div class="nds-form-element__control">
      <div class="nds-combobox_container nds-has-object-switcher nds-has-input-focus">
        <div class="nds-listbox_object-switcher nds-dropdown-trigger nds-dropdown-trigger_click">
          <button class="nds-button nds-button_icon" aria-haspopup="true" title="Select object to search in">
            <span class="nds-icon_container nds-icon-standard-account" title="Accounts">
              <svg class="nds-icon nds-icon_small" aria-hidden="true">
                <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#account"></use>
              </svg>
              <span class="nds-assistive-text">Searching in: Accounts</span>
            </span>
            <svg class="nds-button__icon nds-button__icon_x-small" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
            </svg>
          </button>
        </div>
        <div class="nds-combobox nds-dropdown-trigger nds-dropdown-trigger_click nds-is-open" aria-expanded="true" aria-haspopup="listbox" role="combobox">
          <div class="nds-combobox__form-element nds-input-has-icon nds-input-has-icon_right" role="none">
            <input type="text" class="nds-input nds-combobox__input" id="combobox-unique-id" aria-autocomplete="list" aria-controls="listbox-unique-id" autocomplete="off" role="textbox" placeholder="Search Salesforce">
            <span class="nds-icon_container nds-icon-utility-search nds-input__icon nds-input__icon_right">
              <svg class="nds-icon nds-icon nds-icon_x-small nds-icon-text-default" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#search"></use>
              </svg>
            </span>
          </div>
          <div id="listbox-unique-id" role="listbox">
            <ul class="nds-listbox nds-listbox_vertical nds-dropdown nds-dropdown_fluid" role="presentation">
              <li role="presentation" class="nds-listbox__item">
                <span id="listbox-option-unique-id-01" class="nds-media nds-listbox__option nds-listbox__option_entity nds-listbox__option_has-meta" role="option">
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
                <span id="listbox-option-unique-id-02" class="nds-media nds-listbox__option nds-listbox__option_entity nds-listbox__option_has-meta" role="option">
                  <span class="nds-media__figure">
                    <span class="nds-icon_container nds-icon-standard-account" title="Description of icon when needed">
                      <svg class="nds-icon nds-icon_small" aria-hidden="true">
                        <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#account"></use>
                      </svg>
                      <span class="nds-assistive-text">Description of icon</span>
                    </span>
                  </span>
                  <span class="nds-media__body">
                    <span class="nds-listbox__option-text nds-listbox__option-text_entity">Salesforce.com, Inc.</span>
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
      <div id="listbox-selections-unique-id" role="listbox" aria-orientation="horizontal">
        <ul class="nds-listbox nds-listbox_inline nds-p-top_xxx-small" role="group" aria-label="Selected Options:">
          <li role="presentation" class="nds-listbox__item">
            <span class="nds-pill" role="option" tabindex="0" aria-selected="true">
              <span class="nds-avatar nds-avatar_x-small nds-pill__icon_container">
                <span class="nds-icon_container nds-icon-standard-account" title="Description of icon when needed">
                  <svg class="nds-icon" aria-hidden="true">
                    <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#account"></use>
                  </svg>
                  <span class="nds-assistive-text">Description of icon</span>
                </span>
              </span>
              <span class="nds-pill__label" title="Acme">Acme</span>
              <span class="nds-icon_container nds-pill__remove" title="Remove">
                <svg class="nds-icon nds-icon_x-small nds-icon-text-default" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                </svg>
                <span class="nds-assistive-text">Press delete or backspace to remove</span>
              </span>
            </span>
          </li>
          <li role="presentation" class="nds-listbox__item">
            <span class="nds-pill" role="option" aria-selected="true">
              <span class="nds-avatar nds-avatar_x-small nds-pill__icon_container">
                <span class="nds-icon_container nds-icon-standard-opportunity" title="Description of icon when needed">
                  <svg class="nds-icon" aria-hidden="true">
                    <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#opportunity"></use>
                  </svg>
                  <span class="nds-assistive-text">Description of icon</span>
                </span>
              </span>
              <span class="nds-pill__label" title="Salesforce.com, Inc.">Salesforce.com, Inc.</span>
              <span class="nds-icon_container nds-pill__remove" title="Remove">
                <svg class="nds-icon nds-icon_x-small nds-icon-text-default" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                </svg>
                <span class="nds-assistive-text">Press delete or backspace to remove</span>
              </span>
            </span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>`);
  });
