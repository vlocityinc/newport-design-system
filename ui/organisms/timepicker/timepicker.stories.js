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
    return withExample(`<div style="height: 15rem;">
  <div class="nds-form-element">
    <label class="nds-form-element__label" for="combobox-unique-id">Time</label>
    <div class="nds-form-element__control">
      <div class="nds-combobox_container">
        <div class="nds-combobox nds-dropdown-trigger nds-dropdown-trigger_click nds-combobox-picklist nds-timepicker" aria-expanded="false" aria-haspopup="listbox" role="combobox">
          <div class="nds-combobox__form-element nds-input-has-icon nds-input-has-icon_right" role="none">
            <input type="text" class="nds-input nds-combobox__input" id="combobox-unique-id" aria-controls="listbox-unique-id" autocomplete="off" role="textbox" placeholder=" ">
            <span class="nds-icon_container nds-icon-utility-clock nds-input__icon nds-input__icon_right" title="Description of icon when needed">
              <svg class="nds-icon nds-icon nds-icon_x-small nds-icon-text-default" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#clock"></use>
              </svg>
              <span class="nds-assistive-text">Description of icon</span>
            </span>
          </div>
          <div id="listbox-unique-id" role="listbox">
            <ul class="nds-listbox nds-listbox_vertical nds-dropdown nds-dropdown--fluid nds-dropdown--length-5" role="presentation">
              <li role="presentation" class="nds-listbox__item">
                <span id="listbox-option-unique-id-01" class="nds-media nds-listbox__option nds-listbox__option_plain nds-media_small nds-media_center" role="option">
                  <span class="nds-media__figure">
                    <svg class="nds-icon nds-icon_x-small nds-listbox__icon-selected" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                  </span>
                  <span class="nds-media__body">
                    <span class="nds-truncate" title="6:00am">


                      6:00am

                    </span>
                  </span>
                </span>
              </li>
              <li role="presentation" class="nds-listbox__item">
                <span id="listbox-option-unique-id-02" class="nds-media nds-listbox__option nds-listbox__option_plain nds-media_small nds-media_center" role="option">
                  <span class="nds-media__figure">
                    <svg class="nds-icon nds-icon_x-small nds-listbox__icon-selected" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                  </span>
                  <span class="nds-media__body">
                    <span class="nds-truncate" title="7:00am">


                      7:00am

                    </span>
                  </span>
                </span>
              </li>
              <li role="presentation" class="nds-listbox__item">
                <span id="listbox-option-unique-id-03" class="nds-media nds-listbox__option nds-listbox__option_plain nds-media_small nds-media_center" role="option">
                  <span class="nds-media__figure">
                    <svg class="nds-icon nds-icon_x-small nds-listbox__icon-selected" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                  </span>
                  <span class="nds-media__body">
                    <span class="nds-truncate" title="8:00am">


                      8:00am

                    </span>
                  </span>
                </span>
              </li>
              <li role="presentation" class="nds-listbox__item">
                <span id="listbox-option-unique-id-04" class="nds-media nds-listbox__option nds-listbox__option_plain nds-media_small nds-media_center" role="option">
                  <span class="nds-media__figure">
                    <svg class="nds-icon nds-icon_x-small nds-listbox__icon-selected" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                  </span>
                  <span class="nds-media__body">
                    <span class="nds-truncate" title="9:00am">


                      9:00am

                    </span>
                  </span>
                </span>
              </li>
              <li role="presentation" class="nds-listbox__item">
                <span id="listbox-option-unique-id-05" class="nds-media nds-listbox__option nds-listbox__option_plain nds-media_small nds-media_center" role="option">
                  <span class="nds-media__figure">
                    <svg class="nds-icon nds-icon_x-small nds-listbox__icon-selected" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                  </span>
                  <span class="nds-media__body">
                    <span class="nds-truncate" title="10:00am">


                      10:00am

                    </span>
                  </span>
                </span>
              </li>
              <li role="presentation" class="nds-listbox__item">
                <span id="listbox-option-unique-id-06" class="nds-media nds-listbox__option nds-listbox__option_plain nds-media_small nds-media_center" role="option">
                  <span class="nds-media__figure">
                    <svg class="nds-icon nds-icon_x-small nds-listbox__icon-selected" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                  </span>
                  <span class="nds-media__body">
                    <span class="nds-truncate" title="11:00am">


                      11:00am

                    </span>
                  </span>
                </span>
              </li>
              <li role="presentation" class="nds-listbox__item">
                <span id="listbox-option-unique-id-07" class="nds-media nds-listbox__option nds-listbox__option_plain nds-media_small nds-media_center" role="option">
                  <span class="nds-media__figure">
                    <svg class="nds-icon nds-icon_x-small nds-listbox__icon-selected" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                  </span>
                  <span class="nds-media__body">
                    <span class="nds-truncate" title="12:00pm">


                      12:00pm

                    </span>
                  </span>
                </span>
              </li>
              <li role="presentation" class="nds-listbox__item">
                <span id="listbox-option-unique-id-08" class="nds-media nds-listbox__option nds-listbox__option_plain nds-media_small nds-media_center" role="option">
                  <span class="nds-media__figure">
                    <svg class="nds-icon nds-icon_x-small nds-listbox__icon-selected" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                  </span>
                  <span class="nds-media__body">
                    <span class="nds-truncate" title="1:00pm">


                      1:00pm

                    </span>
                  </span>
                </span>
              </li>
              <li role="presentation" class="nds-listbox__item">
                <span id="listbox-option-unique-id-09" class="nds-media nds-listbox__option nds-listbox__option_plain nds-media_small nds-media_center" role="option">
                  <span class="nds-media__figure">
                    <svg class="nds-icon nds-icon_x-small nds-listbox__icon-selected" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                  </span>
                  <span class="nds-media__body">
                    <span class="nds-truncate" title="2:00pm">


                      2:00pm

                    </span>
                  </span>
                </span>
              </li>
              <li role="presentation" class="nds-listbox__item">
                <span id="listbox-option-unique-id-10" class="nds-media nds-listbox__option nds-listbox__option_plain nds-media_small nds-media_center" role="option">
                  <span class="nds-media__figure">
                    <svg class="nds-icon nds-icon_x-small nds-listbox__icon-selected" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                  </span>
                  <span class="nds-media__body">
                    <span class="nds-truncate" title="3:00pm">


                      3:00pm

                    </span>
                  </span>
                </span>
              </li>
              <li role="presentation" class="nds-listbox__item">
                <span id="listbox-option-unique-id-11" class="nds-media nds-listbox__option nds-listbox__option_plain nds-media_small nds-media_center" role="option">
                  <span class="nds-media__figure">
                    <svg class="nds-icon nds-icon_x-small nds-listbox__icon-selected" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                  </span>
                  <span class="nds-media__body">
                    <span class="nds-truncate" title="4:00pm">


                      4:00pm

                    </span>
                  </span>
                </span>
              </li>
              <li role="presentation" class="nds-listbox__item">
                <span id="listbox-option-unique-id-12" class="nds-media nds-listbox__option nds-listbox__option_plain nds-media_small nds-media_center" role="option">
                  <span class="nds-media__figure">
                    <svg class="nds-icon nds-icon_x-small nds-listbox__icon-selected" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                  </span>
                  <span class="nds-media__body">
                    <span class="nds-truncate" title="5:00pm">


                      5:00pm

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
    return withExample(`<div style="height: 15rem;">
  <div class="nds-form-element">
    <label class="nds-form-element__label" for="combobox-unique-id">Time</label>
    <div class="nds-form-element__control">
      <div class="nds-combobox_container">
        <div class="nds-combobox nds-dropdown-trigger nds-dropdown-trigger_click nds-is-open nds-combobox-picklist nds-timepicker" aria-expanded="true" aria-haspopup="listbox" role="combobox">
          <div class="nds-combobox__form-element nds-input-has-icon nds-input-has-icon_right" role="none">
            <input type="text" class="nds-input nds-combobox__input" id="combobox-unique-id" aria-controls="listbox-unique-id" autocomplete="off" role="textbox" placeholder=" ">
            <span class="nds-icon_container nds-icon-utility-clock nds-input__icon nds-input__icon_right" title="Description of icon when needed">
              <svg class="nds-icon nds-icon nds-icon_x-small nds-icon-text-default" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#clock"></use>
              </svg>
              <span class="nds-assistive-text">Description of icon</span>
            </span>
          </div>
          <div id="listbox-unique-id" role="listbox">
            <ul class="nds-listbox nds-listbox_vertical nds-dropdown nds-dropdown--fluid nds-dropdown--length-5" role="presentation">
              <li role="presentation" class="nds-listbox__item">
                <span id="listbox-option-unique-id-01" class="nds-media nds-listbox__option nds-listbox__option_plain nds-media_small nds-media_center" role="option">
                  <span class="nds-media__figure">
                    <svg class="nds-icon nds-icon_x-small nds-listbox__icon-selected" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                  </span>
                  <span class="nds-media__body">
                    <span class="nds-truncate" title="6:00am">


                      6:00am

                    </span>
                  </span>
                </span>
              </li>
              <li role="presentation" class="nds-listbox__item">
                <span id="listbox-option-unique-id-02" class="nds-media nds-listbox__option nds-listbox__option_plain nds-media_small nds-media_center" role="option">
                  <span class="nds-media__figure">
                    <svg class="nds-icon nds-icon_x-small nds-listbox__icon-selected" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                  </span>
                  <span class="nds-media__body">
                    <span class="nds-truncate" title="7:00am">


                      7:00am

                    </span>
                  </span>
                </span>
              </li>
              <li role="presentation" class="nds-listbox__item">
                <span id="listbox-option-unique-id-03" class="nds-media nds-listbox__option nds-listbox__option_plain nds-media_small nds-media_center" role="option">
                  <span class="nds-media__figure">
                    <svg class="nds-icon nds-icon_x-small nds-listbox__icon-selected" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                  </span>
                  <span class="nds-media__body">
                    <span class="nds-truncate" title="8:00am">


                      8:00am

                    </span>
                  </span>
                </span>
              </li>
              <li role="presentation" class="nds-listbox__item">
                <span id="listbox-option-unique-id-04" class="nds-media nds-listbox__option nds-listbox__option_plain nds-media_small nds-media_center" role="option">
                  <span class="nds-media__figure">
                    <svg class="nds-icon nds-icon_x-small nds-listbox__icon-selected" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                  </span>
                  <span class="nds-media__body">
                    <span class="nds-truncate" title="9:00am">


                      9:00am

                    </span>
                  </span>
                </span>
              </li>
              <li role="presentation" class="nds-listbox__item">
                <span id="listbox-option-unique-id-05" class="nds-media nds-listbox__option nds-listbox__option_plain nds-media_small nds-media_center" role="option">
                  <span class="nds-media__figure">
                    <svg class="nds-icon nds-icon_x-small nds-listbox__icon-selected" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                  </span>
                  <span class="nds-media__body">
                    <span class="nds-truncate" title="10:00am">


                      10:00am

                    </span>
                  </span>
                </span>
              </li>
              <li role="presentation" class="nds-listbox__item">
                <span id="listbox-option-unique-id-06" class="nds-media nds-listbox__option nds-listbox__option_plain nds-media_small nds-media_center" role="option">
                  <span class="nds-media__figure">
                    <svg class="nds-icon nds-icon_x-small nds-listbox__icon-selected" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                  </span>
                  <span class="nds-media__body">
                    <span class="nds-truncate" title="11:00am">


                      11:00am

                    </span>
                  </span>
                </span>
              </li>
              <li role="presentation" class="nds-listbox__item">
                <span id="listbox-option-unique-id-07" class="nds-media nds-listbox__option nds-listbox__option_plain nds-media_small nds-media_center" role="option">
                  <span class="nds-media__figure">
                    <svg class="nds-icon nds-icon_x-small nds-listbox__icon-selected" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                  </span>
                  <span class="nds-media__body">
                    <span class="nds-truncate" title="12:00pm">


                      12:00pm

                    </span>
                  </span>
                </span>
              </li>
              <li role="presentation" class="nds-listbox__item">
                <span id="listbox-option-unique-id-08" class="nds-media nds-listbox__option nds-listbox__option_plain nds-media_small nds-media_center" role="option">
                  <span class="nds-media__figure">
                    <svg class="nds-icon nds-icon_x-small nds-listbox__icon-selected" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                  </span>
                  <span class="nds-media__body">
                    <span class="nds-truncate" title="1:00pm">


                      1:00pm

                    </span>
                  </span>
                </span>
              </li>
              <li role="presentation" class="nds-listbox__item">
                <span id="listbox-option-unique-id-09" class="nds-media nds-listbox__option nds-listbox__option_plain nds-media_small nds-media_center" role="option">
                  <span class="nds-media__figure">
                    <svg class="nds-icon nds-icon_x-small nds-listbox__icon-selected" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                  </span>
                  <span class="nds-media__body">
                    <span class="nds-truncate" title="2:00pm">


                      2:00pm

                    </span>
                  </span>
                </span>
              </li>
              <li role="presentation" class="nds-listbox__item">
                <span id="listbox-option-unique-id-10" class="nds-media nds-listbox__option nds-listbox__option_plain nds-media_small nds-media_center" role="option">
                  <span class="nds-media__figure">
                    <svg class="nds-icon nds-icon_x-small nds-listbox__icon-selected" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                  </span>
                  <span class="nds-media__body">
                    <span class="nds-truncate" title="3:00pm">


                      3:00pm

                    </span>
                  </span>
                </span>
              </li>
              <li role="presentation" class="nds-listbox__item">
                <span id="listbox-option-unique-id-11" class="nds-media nds-listbox__option nds-listbox__option_plain nds-media_small nds-media_center" role="option">
                  <span class="nds-media__figure">
                    <svg class="nds-icon nds-icon_x-small nds-listbox__icon-selected" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                  </span>
                  <span class="nds-media__body">
                    <span class="nds-truncate" title="4:00pm">


                      4:00pm

                    </span>
                  </span>
                </span>
              </li>
              <li role="presentation" class="nds-listbox__item">
                <span id="listbox-option-unique-id-12" class="nds-media nds-listbox__option nds-listbox__option_plain nds-media_small nds-media_center" role="option">
                  <span class="nds-media__figure">
                    <svg class="nds-icon nds-icon_x-small nds-listbox__icon-selected" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                  </span>
                  <span class="nds-media__body">
                    <span class="nds-truncate" title="5:00pm">


                      5:00pm

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
    return withExample(`<div style="height: 15rem;">
  <div class="nds-form-element">
    <label class="nds-form-element__label" for="combobox-unique-id">Time</label>
    <div class="nds-form-element__control">
      <div class="nds-combobox_container">
        <div class="nds-combobox nds-dropdown-trigger nds-dropdown-trigger_click nds-is-open nds-combobox-picklist nds-timepicker" aria-expanded="true" aria-haspopup="listbox" role="combobox">
          <div class="nds-combobox__form-element nds-input-has-icon nds-input-has-icon_right" role="none">
            <input type="text" class="nds-input nds-combobox__input" id="combobox-unique-id" aria-activedescendant="listbox-option-unique-id-01" aria-controls="listbox-unique-id" autocomplete="off" role="textbox" placeholder=" ">
            <span class="nds-icon_container nds-icon-utility-clock nds-input__icon nds-input__icon_right" title="Description of icon when needed">
              <svg class="nds-icon nds-icon nds-icon_x-small nds-icon-text-default" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#clock"></use>
              </svg>
              <span class="nds-assistive-text">Description of icon</span>
            </span>
          </div>
          <div id="listbox-unique-id" role="listbox">
            <ul class="nds-listbox nds-listbox_vertical nds-dropdown nds-dropdown--fluid nds-dropdown--length-5" role="presentation">
              <li role="presentation" class="nds-listbox__item">
                <span id="listbox-option-unique-id-01" class="nds-media nds-listbox__option nds-listbox__option_plain nds-media_small nds-media_center nds-has-focus" role="option">
                  <span class="nds-media__figure">
                    <svg class="nds-icon nds-icon_x-small nds-listbox__icon-selected" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                  </span>
                  <span class="nds-media__body">
                    <span class="nds-truncate" title="6:00am">


                      6:00am

                    </span>
                  </span>
                </span>
              </li>
              <li role="presentation" class="nds-listbox__item">
                <span id="listbox-option-unique-id-02" class="nds-media nds-listbox__option nds-listbox__option_plain nds-media_small nds-media_center" role="option">
                  <span class="nds-media__figure">
                    <svg class="nds-icon nds-icon_x-small nds-listbox__icon-selected" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                  </span>
                  <span class="nds-media__body">
                    <span class="nds-truncate" title="7:00am">


                      7:00am

                    </span>
                  </span>
                </span>
              </li>
              <li role="presentation" class="nds-listbox__item">
                <span id="listbox-option-unique-id-03" class="nds-media nds-listbox__option nds-listbox__option_plain nds-media_small nds-media_center" role="option">
                  <span class="nds-media__figure">
                    <svg class="nds-icon nds-icon_x-small nds-listbox__icon-selected" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                  </span>
                  <span class="nds-media__body">
                    <span class="nds-truncate" title="8:00am">


                      8:00am

                    </span>
                  </span>
                </span>
              </li>
              <li role="presentation" class="nds-listbox__item">
                <span id="listbox-option-unique-id-04" class="nds-media nds-listbox__option nds-listbox__option_plain nds-media_small nds-media_center" role="option">
                  <span class="nds-media__figure">
                    <svg class="nds-icon nds-icon_x-small nds-listbox__icon-selected" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                  </span>
                  <span class="nds-media__body">
                    <span class="nds-truncate" title="9:00am">


                      9:00am

                    </span>
                  </span>
                </span>
              </li>
              <li role="presentation" class="nds-listbox__item">
                <span id="listbox-option-unique-id-05" class="nds-media nds-listbox__option nds-listbox__option_plain nds-media_small nds-media_center" role="option">
                  <span class="nds-media__figure">
                    <svg class="nds-icon nds-icon_x-small nds-listbox__icon-selected" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                  </span>
                  <span class="nds-media__body">
                    <span class="nds-truncate" title="10:00am">


                      10:00am

                    </span>
                  </span>
                </span>
              </li>
              <li role="presentation" class="nds-listbox__item">
                <span id="listbox-option-unique-id-06" class="nds-media nds-listbox__option nds-listbox__option_plain nds-media_small nds-media_center" role="option">
                  <span class="nds-media__figure">
                    <svg class="nds-icon nds-icon_x-small nds-listbox__icon-selected" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                  </span>
                  <span class="nds-media__body">
                    <span class="nds-truncate" title="11:00am">


                      11:00am

                    </span>
                  </span>
                </span>
              </li>
              <li role="presentation" class="nds-listbox__item">
                <span id="listbox-option-unique-id-07" class="nds-media nds-listbox__option nds-listbox__option_plain nds-media_small nds-media_center" role="option">
                  <span class="nds-media__figure">
                    <svg class="nds-icon nds-icon_x-small nds-listbox__icon-selected" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                  </span>
                  <span class="nds-media__body">
                    <span class="nds-truncate" title="12:00pm">


                      12:00pm

                    </span>
                  </span>
                </span>
              </li>
              <li role="presentation" class="nds-listbox__item">
                <span id="listbox-option-unique-id-08" class="nds-media nds-listbox__option nds-listbox__option_plain nds-media_small nds-media_center" role="option">
                  <span class="nds-media__figure">
                    <svg class="nds-icon nds-icon_x-small nds-listbox__icon-selected" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                  </span>
                  <span class="nds-media__body">
                    <span class="nds-truncate" title="1:00pm">


                      1:00pm

                    </span>
                  </span>
                </span>
              </li>
              <li role="presentation" class="nds-listbox__item">
                <span id="listbox-option-unique-id-09" class="nds-media nds-listbox__option nds-listbox__option_plain nds-media_small nds-media_center" role="option">
                  <span class="nds-media__figure">
                    <svg class="nds-icon nds-icon_x-small nds-listbox__icon-selected" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                  </span>
                  <span class="nds-media__body">
                    <span class="nds-truncate" title="2:00pm">


                      2:00pm

                    </span>
                  </span>
                </span>
              </li>
              <li role="presentation" class="nds-listbox__item">
                <span id="listbox-option-unique-id-10" class="nds-media nds-listbox__option nds-listbox__option_plain nds-media_small nds-media_center" role="option">
                  <span class="nds-media__figure">
                    <svg class="nds-icon nds-icon_x-small nds-listbox__icon-selected" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                  </span>
                  <span class="nds-media__body">
                    <span class="nds-truncate" title="3:00pm">


                      3:00pm

                    </span>
                  </span>
                </span>
              </li>
              <li role="presentation" class="nds-listbox__item">
                <span id="listbox-option-unique-id-11" class="nds-media nds-listbox__option nds-listbox__option_plain nds-media_small nds-media_center" role="option">
                  <span class="nds-media__figure">
                    <svg class="nds-icon nds-icon_x-small nds-listbox__icon-selected" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                  </span>
                  <span class="nds-media__body">
                    <span class="nds-truncate" title="4:00pm">


                      4:00pm

                    </span>
                  </span>
                </span>
              </li>
              <li role="presentation" class="nds-listbox__item">
                <span id="listbox-option-unique-id-12" class="nds-media nds-listbox__option nds-listbox__option_plain nds-media_small nds-media_center" role="option">
                  <span class="nds-media__figure">
                    <svg class="nds-icon nds-icon_x-small nds-listbox__icon-selected" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                  </span>
                  <span class="nds-media__body">
                    <span class="nds-truncate" title="5:00pm">


                      5:00pm

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
  .add('Time Selection (states)', () => {
    return withExample(`<div style="height: 15rem;">
  <div class="nds-form-element">
    <label class="nds-form-element__label" for="combobox-unique-id">Time</label>
    <div class="nds-form-element__control">
      <div class="nds-combobox_container">
        <div class="nds-combobox nds-dropdown-trigger nds-dropdown-trigger_click nds-is-open nds-combobox-picklist nds-timepicker" aria-expanded="true" aria-haspopup="listbox" role="combobox">
          <div class="nds-combobox__form-element nds-input-has-icon nds-input-has-icon_right" role="none">
            <input type="text" class="nds-input nds-combobox__input" id="combobox-unique-id" aria-controls="listbox-unique-id" autocomplete="off" role="textbox" placeholder=" " value="8:00am">
            <span class="nds-icon_container nds-icon-utility-clock nds-input__icon nds-input__icon_right" title="Description of icon when needed">
              <svg class="nds-icon nds-icon nds-icon_x-small nds-icon-text-default" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#clock"></use>
              </svg>
              <span class="nds-assistive-text">Description of icon</span>
            </span>
          </div>
          <div id="listbox-unique-id" role="listbox">
            <ul class="nds-listbox nds-listbox_vertical nds-dropdown nds-dropdown--fluid nds-dropdown--length-5" role="presentation">
              <li role="presentation" class="nds-listbox__item">
                <span id="listbox-option-unique-id-01" class="nds-media nds-listbox__option nds-listbox__option_plain nds-media_small nds-media_center" role="option">
                  <span class="nds-media__figure">
                    <svg class="nds-icon nds-icon_x-small nds-listbox__icon-selected" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                  </span>
                  <span class="nds-media__body">
                    <span class="nds-truncate" title="6:00am">


                      6:00am

                    </span>
                  </span>
                </span>
              </li>
              <li role="presentation" class="nds-listbox__item">
                <span id="listbox-option-unique-id-02" class="nds-media nds-listbox__option nds-listbox__option_plain nds-media_small nds-media_center" role="option">
                  <span class="nds-media__figure">
                    <svg class="nds-icon nds-icon_x-small nds-listbox__icon-selected" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                  </span>
                  <span class="nds-media__body">
                    <span class="nds-truncate" title="7:00am">


                      7:00am

                    </span>
                  </span>
                </span>
              </li>
              <li role="presentation" class="nds-listbox__item">
                <span id="listbox-option-unique-id-03" class="nds-media nds-listbox__option nds-listbox__option_plain nds-media_small nds-media_center nds-is-selected" role="option">
                  <span class="nds-media__figure">
                    <svg class="nds-icon nds-icon_x-small nds-listbox__icon-selected" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                  </span>
                  <span class="nds-media__body">
                    <span class="nds-truncate" title="8:00am">
                      <span class="nds-assistive-text">Current Selection:</span>


                      8:00am

                    </span>
                  </span>
                </span>
              </li>
              <li role="presentation" class="nds-listbox__item">
                <span id="listbox-option-unique-id-04" class="nds-media nds-listbox__option nds-listbox__option_plain nds-media_small nds-media_center" role="option">
                  <span class="nds-media__figure">
                    <svg class="nds-icon nds-icon_x-small nds-listbox__icon-selected" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                  </span>
                  <span class="nds-media__body">
                    <span class="nds-truncate" title="9:00am">


                      9:00am

                    </span>
                  </span>
                </span>
              </li>
              <li role="presentation" class="nds-listbox__item">
                <span id="listbox-option-unique-id-05" class="nds-media nds-listbox__option nds-listbox__option_plain nds-media_small nds-media_center" role="option">
                  <span class="nds-media__figure">
                    <svg class="nds-icon nds-icon_x-small nds-listbox__icon-selected" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                  </span>
                  <span class="nds-media__body">
                    <span class="nds-truncate" title="10:00am">


                      10:00am

                    </span>
                  </span>
                </span>
              </li>
              <li role="presentation" class="nds-listbox__item">
                <span id="listbox-option-unique-id-06" class="nds-media nds-listbox__option nds-listbox__option_plain nds-media_small nds-media_center" role="option">
                  <span class="nds-media__figure">
                    <svg class="nds-icon nds-icon_x-small nds-listbox__icon-selected" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                  </span>
                  <span class="nds-media__body">
                    <span class="nds-truncate" title="11:00am">


                      11:00am

                    </span>
                  </span>
                </span>
              </li>
              <li role="presentation" class="nds-listbox__item">
                <span id="listbox-option-unique-id-07" class="nds-media nds-listbox__option nds-listbox__option_plain nds-media_small nds-media_center" role="option">
                  <span class="nds-media__figure">
                    <svg class="nds-icon nds-icon_x-small nds-listbox__icon-selected" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                  </span>
                  <span class="nds-media__body">
                    <span class="nds-truncate" title="12:00pm">


                      12:00pm

                    </span>
                  </span>
                </span>
              </li>
              <li role="presentation" class="nds-listbox__item">
                <span id="listbox-option-unique-id-08" class="nds-media nds-listbox__option nds-listbox__option_plain nds-media_small nds-media_center" role="option">
                  <span class="nds-media__figure">
                    <svg class="nds-icon nds-icon_x-small nds-listbox__icon-selected" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                  </span>
                  <span class="nds-media__body">
                    <span class="nds-truncate" title="1:00pm">


                      1:00pm

                    </span>
                  </span>
                </span>
              </li>
              <li role="presentation" class="nds-listbox__item">
                <span id="listbox-option-unique-id-09" class="nds-media nds-listbox__option nds-listbox__option_plain nds-media_small nds-media_center" role="option">
                  <span class="nds-media__figure">
                    <svg class="nds-icon nds-icon_x-small nds-listbox__icon-selected" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                  </span>
                  <span class="nds-media__body">
                    <span class="nds-truncate" title="2:00pm">


                      2:00pm

                    </span>
                  </span>
                </span>
              </li>
              <li role="presentation" class="nds-listbox__item">
                <span id="listbox-option-unique-id-10" class="nds-media nds-listbox__option nds-listbox__option_plain nds-media_small nds-media_center" role="option">
                  <span class="nds-media__figure">
                    <svg class="nds-icon nds-icon_x-small nds-listbox__icon-selected" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                  </span>
                  <span class="nds-media__body">
                    <span class="nds-truncate" title="3:00pm">


                      3:00pm

                    </span>
                  </span>
                </span>
              </li>
              <li role="presentation" class="nds-listbox__item">
                <span id="listbox-option-unique-id-11" class="nds-media nds-listbox__option nds-listbox__option_plain nds-media_small nds-media_center" role="option">
                  <span class="nds-media__figure">
                    <svg class="nds-icon nds-icon_x-small nds-listbox__icon-selected" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                  </span>
                  <span class="nds-media__body">
                    <span class="nds-truncate" title="4:00pm">


                      4:00pm

                    </span>
                  </span>
                </span>
              </li>
              <li role="presentation" class="nds-listbox__item">
                <span id="listbox-option-unique-id-12" class="nds-media nds-listbox__option nds-listbox__option_plain nds-media_small nds-media_center" role="option">
                  <span class="nds-media__figure">
                    <svg class="nds-icon nds-icon_x-small nds-listbox__icon-selected" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                    </svg>
                  </span>
                  <span class="nds-media__body">
                    <span class="nds-truncate" title="5:00pm">


                      5:00pm

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
  });
