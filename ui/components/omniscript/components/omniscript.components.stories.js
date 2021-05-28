/* eslint-env browser */
import { storiesOf } from '@storybook/html';
import { withKnobs, radios } from '@storybook/addon-knobs';
import base from 'paths.macro';
import notes from './doc.md';
import {
  withExample,
  withExampleAndHeight,
  withDocs,
} from '../../../../scripts/storybook';

storiesOf(`${base}`.replace(/(^\/)|(\/$)/g, ''), module)
  .addDecorator(withKnobs)
  .addDecorator(withDocs(notes))
  .add('Actions', () => {
    return withExample('Simple Action as Button', 'Actions will appear as a button when inside the Step of an OmniScript. If the Action is outside of Steps then it is not rendered and a standard Newport spinner is shown instead', `
      <div class="nds-is-relative nds-p-around_x-small nds-m-bottom_x-small">
      <c-button>
        <button type="button" label="My Action" class="vlocity-btn nds-button nds-button_brand nds-button_stretch">
          <span class="btnLabel">My Action</span>
        </button>
      </c-button>
    </div>`);
  })
  .add('Action Block', () => {
    return withExample('Action Block', `<div class="nds-is-relative nds-p-around_x-small nds-m-bottom_x-small">
    <c-button>
      <button type="button" label="Action Block" class="vlocity-btn nds-button nds-button_brand nds-button_stretch">
        <span class="btnLabel">Action Block</span>
      </button>
    </c-button>
  </div>`);
  })
  .add('Aggregate / Formula', () => {
    return withExample('Empty Aggregate / Formula', `<c-masked-input>
      <div aria-live="polite" class="nds-form-element nds-form-container">
        <div class="nds-form-element__control nds-form-element__control-animated-label">
          <input id="input1-31" type="text" readonly="" disabled="" class="vlocity-input nds-input_mask nds-input">
        <div class="nds-form-element__label nds-align-middle nds-animated-label__ease-out">
          <label aria-label="Aggregate" for="input1-31">Aggregate</label>
        </div>
      </div>
      <div class="nds-form-element__control nds-form-element__control-animated-label">
        <div class="nds-form-element__label nds-align-middle nds-animated-label__ease-out"></div>
      </div>
      <div class="nds-grid"></div>
    </div>
    </c-masked-input>`) +
      withExample('Aggregate / Formula with value', `<c-masked-input>
      <div aria-live="polite" class="nds-form-element nds-form-container">
        <div class="nds-form-element__control nds-form-element__control-animated-label">
          <input id="input1-31" type="text" readonly="" disabled="" class="vlocity-input nds-input_mask nds-input nds-not-empty nds-is-dirty" value="$0.00">
        <div class="nds-form-element__label nds-align-middle nds-animated-label__ease-out">
          <label aria-label="Aggregate" for="input1-31">Aggregate</label>
        </div>
      </div>
      <div class="nds-form-element__control nds-form-element__control-animated-label">
        <div class="nds-form-element__label nds-align-middle nds-animated-label__ease-out"></div>
      </div>
      <div class="nds-grid"></div>
    </div>
    </c-masked-input>`);
  })
  .add('Block', () => {
    let stateValue = radios('State', {
      Open: 'Open',
      Closed: 'Closed'
    }, 'Open');
    if (stateValue === '' || stateValue == null) {
      stateValue = 'Open';
    }
    const resolvedValue = stateValue === 'Open';
    return withExample('Simple Block', `<div class="nds-size_1-of-1">
      <div class="nds-form-element nds-clearfix nds-block nds-p-around_small ${resolvedValue && 'nds-is-open'}">
        <div class="nds-form-element__control nds-block_container">
          <label class="nds-form-element__label nds-clearfix">
            <button label="toggle" aria-controls="content-11" tabindex="0" aria-expanded="${resolvedValue}" class="nds-grid nds-button--reset nds-size_1-of-1 nds-cursor-pointer">
              <c-icon>
                <svg aria-hidden="true" class="nds-icon nds-block__action-icon nds-button__icon nds-button__icon-left nds-icon-text-default nds-icon_small">
                  <use xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#switch"></use>
                </svg>
                <span class="nds-assistive-text"></span>
              </c-icon>
              <div role="status" class="nds-form-element__label_toggle-text">Block Label</div>
              <div class="nds-control-action__container"></div>
            </button>
          </label>
          <div aria-hidden="${resolvedValue}" id="content-11" class="nds-size_1-of-1 nds-block_body">
            <div class="nds-grid nds-wrap nds-grid_pull-padded">Some Content</div>
          </div>
        </div>
      </div>
    </div>`) +
      withExample('Block with repeat enabled', `<div class="nds-size_1-of-1">
      <div class="nds-form-element nds-clearfix nds-block nds-p-around_small ${resolvedValue && 'nds-is-open'}">
        <div class="nds-form-element__control nds-block_container">
          <label class="nds-form-element__label nds-clearfix">
            <button label="toggle" aria-controls="content-11" tabindex="0" aria-expanded="${resolvedValue}" class="nds-grid nds-button--reset nds-size_1-of-1 nds-cursor-pointer">
              <c-icon>
                <svg aria-hidden="true" class="nds-icon nds-block__action-icon nds-button__icon nds-button__icon-left nds-icon-text-default nds-icon_small">
                  <use xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#switch"></use>
                </svg>
                <span class="nds-assistive-text"></span>
              </c-icon>
              <div role="status" class="nds-form-element__label_toggle-text">Block Label</div>
              <div class="nds-control-action__container"></div>
            </button>
          </label>
          <div role="group" class="nds-is-absolute nds-button-group">
            <c-button>
              <button type="button" label="Add" class="vlocity-btn nds-button nds-button_base">
                <span aria-label="Add a new block" class="btnLabel">Add</span>
              </button>
            </c-button>
            <c-button class="nds-m-left_x-small">
              <button type="button" label="Delete" class="vlocity-btn nds-button nds-button_base">
                <span aria-label="Delete block" class="btnLabel">Delete</span>
              </button>
            </c-button>
          </div>
          <div aria-hidden="${resolvedValue}" id="content-11" class="nds-size_1-of-1 nds-block_body">
            <div class="nds-grid nds-wrap nds-grid_pull-padded">Some Content</div>
          </div>
        </div>
      </div>
    </div>`) +
      withExample('Simple Block with Errors', `<div class="nds-size_1-of-1">
      <div class="nds-form-element nds-clearfix nds-block nds-p-around_small ${resolvedValue && 'nds-is-open'}">
        <div class="nds-form-element__control nds-block_container">
          <label class="nds-form-element__label nds-clearfix">
            <button label="toggle" aria-controls="content-11" tabindex="0" aria-expanded="${resolvedValue}" class="nds-grid nds-button--reset nds-size_1-of-1 nds-cursor-pointer">
              <c-icon>
                <svg aria-hidden="true" class="nds-icon nds-block__action-icon nds-button__icon nds-button__icon-left nds-icon-text-default nds-icon_small">
                  <use xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#switch"></use>
                </svg>
                <span class="nds-assistive-text"></span>
              </c-icon>
              <div role="status" class="nds-form-element__label_toggle-text">Block Label
                <div class="nds-has-error">
                  <div class="nds-form-element__help nds-form-element__help_text-transform__none">
                    Please expand to fix all invalid fields.
                  </div>
                </div>
              </div>
              <div class="nds-control-action__container"></div>
            </button>
          </label>
          <div aria-hidden="${resolvedValue}" id="content-11" class="nds-size_1-of-1 nds-block_body">
            <div class="nds-grid nds-wrap nds-grid_pull-padded">Some Content</div>
          </div>
        </div>
      </div>
    </div>`) +
      withExample('Block with repeat enabled with errors', `<div class="nds-size_1-of-1">
      <div class="nds-form-element nds-clearfix nds-block nds-p-around_small ${resolvedValue && 'nds-is-open'}">
        <div class="nds-form-element__control nds-block_container">
          <label class="nds-form-element__label nds-clearfix">
            <button label="toggle" aria-controls="content-11" tabindex="0" aria-expanded="${resolvedValue}" class="nds-grid nds-button--reset nds-size_1-of-1 nds-cursor-pointer">
              <c-icon>
                <svg aria-hidden="true" class="nds-icon nds-block__action-icon nds-button__icon nds-button__icon-left nds-icon-text-default nds-icon_small">
                  <use xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#switch"></use>
                </svg>
                <span class="nds-assistive-text"></span>
              </c-icon>
              <div role="status" class="nds-form-element__label_toggle-text">Block Label
                <div class="nds-has-error">
                  <div class="nds-form-element__help nds-form-element__help_text-transform__none">
                    <span class="nds-text-link_faux">Please expand to fix all invalid fields.</span>
                  </div>
                </div>
              </div>
              <div class="nds-control-action__container"></div>
            </button>
          </label>
          <div role="group" class="nds-is-absolute nds-button-group">
            <c-button>
              <button type="button" label="Add" class="vlocity-btn nds-button nds-button_base">
                <span aria-label="Add a new block" class="btnLabel">Add</span>
              </button>
            </c-button>
            <c-button class="nds-m-left_x-small">
              <button type="button" label="Delete" class="vlocity-btn nds-button nds-button_base">
                <span aria-label="Delete block" class="btnLabel">Delete</span>
              </button>
            </c-button>
          </div>
          <div aria-hidden="${resolvedValue}" id="content-11" class="nds-size_1-of-1 nds-block_body">
            <div class="nds-grid nds-wrap nds-grid_pull-padded">Some Content</div>
          </div>
        </div>
      </div>
    </div>`);
  })
  .add('Checkbox', () => {
    return withExample('Checkbox', `<div class="nds-grid">
    <c-input>
      <div class="nds-form-element nds-form-container nds-relative-tooltip nds-wrap">
        <div class="nds-form-element__control">
          <div class="nds-checkbox">
            <input type="checkbox" id="input1-12" value="" class="vlocity-input nds-input_mask">
              <label data-label="true" for="input1-12" class="nds-checkbox__label">
                <span class="nds-checkbox_faux"></span>
                <span class="nds-form-element__label nds-form-element__control-help nds-checkbox-span">Checkbox</span>
            </label>
          </div>
        </div>
        <div class="nds-form-element__control"></div>
      </div>
    </c-input>
  </div>`)
      +
      withExample('Checkbox with tooltip', 'Note: the tooltip is not visible here because JavaScript is used in the underlying component to ensure it is positioned correctly',
        `<div class="nds-grid">
        <c-input>
          <div class="nds-form-element nds-form-container nds-relative-tooltip nds-wrap">
            <div class="nds-form-element__control">
              <div class="nds-checkbox">
                <input type="checkbox" id="input3-14" value="" class="vlocity-input nds-input_mask">
                  <label data-label="true" for="input3-14" class="nds-checkbox__label">
                    <span class="nds-checkbox_faux"></span>
                    <span class="nds-form-element__label nds-form-element__control-help nds-checkbox-span">Checkbox</span>
                  </label>
                <c-tooltip data-field-level-help="" class="nds-tooltip__container"><span
                    style="position: relative;">
                    <c-button tabindex="0" aria-describedby="help-15" aria-disabled="true">
                      <button
                        type="button" label="utility:info" class="vlocity-btn nds-button nds-button_icon">
                        <c-icon>
                          <svg aria-hidden="true" class="nds-button__icon nds-icon_xx-small">
                            <use xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#info"></use>
                          </svg>
                          <span class="nds-assistive-text"></span>
                        </c-icon>
                        <span aria-label="A tooltip" class="btnLabel"></span>
                      </button>
                    </c-button>
                    <span role="tooltip" id="help-15" class="nds-popover nds-nubbin_bottom-left nds-popover_tooltip nds-fall-into-ground bottom-left tooltipSection" style="white-space: normal;">
                      <div class="nds-popover__body">A tooltip</div>
                    </span>
                  </span>
                </c-tooltip>
              </div>
            </div>
            <div class="nds-form-element__control"></div>
          </div>
        </c-input>
      </div>`)
      +
      withExample('Checkbox checked', `<div class="nds-grid">
      <c-input>
        <div class="nds-form-element nds-form-container nds-relative-tooltip nds-wrap">
          <div class="nds-form-element__control">
            <div class="nds-checkbox"><input type="checkbox" id="input5-19" checked
                class="vlocity-input nds-input_mask"><label data-label="true" for="input5-19"
                class="nds-checkbox__label"><span class="nds-checkbox_faux"></span><span
                  class="nds-form-element__label nds-form-element__control-help nds-checkbox-span">Checkbox</span></label>
            </div>
          </div>
          <div class="nds-form-element__control"></div>
        </div>
      </c-input>
    </div>`)
      +
      withExample('Checkbox with repeat', `<div class="nds-grid">
      <c-input>
        <div class="nds-form-element nds-form-container nds-relative-tooltip nds-wrap">
          <div class="nds-form-element__control">
            <div class="nds-checkbox"><input type="checkbox" id="input23-81" value=""
                class="vlocity-input nds-input_mask"><label data-label="true" for="input23-81"
                class="nds-checkbox__label"><span class="nds-checkbox_faux"></span><span
                  class="nds-form-element__label nds-form-element__control-help nds-checkbox-span">Checkbox</span></label>
              <slot name="label"><span slot="label" role="group"
                  class="omni-repeat-button-group nds-form-element nds-form-container nds-button-group nds-p-top_none nds-p-bottom_none"><button
                    class="nds-button_reset nds-m-right_x-small">
                    <c-icon><svg aria-hidden="true"
                        class="slds-icon nds-button__icon nds-button__icon_small slds-icon-text-default slds-icon_xx-small">
                        <use
                          xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#add">
                        </use>
                      </svg><span class="nds-assistive-text">Repeat Checkbox</span></c-icon>
                  </button><button class="nds-button_reset nds-m-right_x-small">
                    <c-icon><svg aria-hidden="true"
                        class="slds-icon nds-button__icon nds-button__icon_small slds-icon-text-default slds-icon_xx-small">
                        <use
                          xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#close">
                        </use>
                      </svg><span class="nds-assistive-text">Remove Checkbox</span></c-icon>
                  </button></span></slot>
            </div>
          </div>
          <div class="nds-form-element__control"></div>
        </div>
      </c-input>
    </div>`)
      +
      withExample('Readonly Checkbox', `<div class="nds-grid">
      <c-input>
        <div class="nds-form-element nds-form-container nds-relative-tooltip nds-wrap">
          <div class="nds-form-element__control">
            <div class="nds-checkbox"><input type="checkbox" id="input9-24" value="" class="vlocity-input nds-input_mask"
                tabindex="-1"><label data-label="true" for="input9-24" class="nds-checkbox__label"><span
                  class="nds-checkbox_faux"></span><span
                  class="nds-form-element__label nds-form-element__control-help nds-checkbox-span">Checkbox</span></label>
            </div>
          </div>
          <div class="nds-form-element__control"></div>
        </div>
      </c-input>
    </div>`);
  })
  .add('Currency', () => {
    return withExample('Currency with required flag', `<c-masked-input class="nds-container_fluid">
    <div aria-live="polite" class="nds-form-element nds-form-container nds-has-error">
      <div class="nds-form-element__control nds-form-element__control-animated-label"><input id="input1-9" type="text"
          inputmode="decimal" required="" placeholder="e.g. $100.00" class="vlocity-input nds-input_mask nds-input">
        <div class="nds-form-element__label nds-align-middle nds-animated-label__ease-out"><label aria-label="Currency"
            for="input1-9">Currency<abbr title="required" class="nds-required nds-p-left_xx-small">*</abbr></label>
        </div>
        <div class="nds-form-element__help nds-form-element__help_text-transform__none">Required</div>
      </div>
      <div class="nds-grid"></div>
    </div>
  </c-masked-input>`)
      +
      withExample('Currency with tooltip', 'Note: the tooltip is not visible here because JavaScript is used in the underlying component to ensure it is positioned correctly',
        `<c-masked-input class="nds-container_fluid">
        <div aria-live="polite" class="nds-form-element nds-form-container">
          <div class="nds-form-element__control nds-form-element__control-animated-label"><input id="input3-11" type="text"
              inputmode="decimal" placeholder="" class="vlocity-input nds-input_mask nds-input">
            <div class="nds-form-element__label nds-align-middle nds-animated-label__ease-out"><label aria-label="Currency"
                for="input3-11">Currency</label>
              <c-tooltip class="nds-tooltip__container" ><span
                  style="position: relative;">
                  <c-button tabindex="0" aria-describedby="help-12" aria-disabled="true"><button
                      type="button" label="utility:info" class="vlocity-btn nds-button nds-button_icon">
                      <c-icon><svg aria-hidden="true" class="nds-button__icon nds-icon_xx-small">
                          <use
                            xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#info">
                          </use>
                        </svg><span class="nds-assistive-text"></span></c-icon><span aria-label="Currency tooltip"
                        class="btnLabel"></span>
                    </button></c-button><span role="tooltip" id="help-12"
                    class="nds-popover nds-nubbin_bottom-left nds-popover_tooltip nds-fall-into-ground bottom-left tooltipSection"
                    style="white-space: normal;">
                    <div class="nds-popover__body">Currency tooltip</div>
                  </span>
                </span></c-tooltip>
            </div>
          </div>
          <div class="nds-grid"></div>
        </div>
      </c-masked-input>`)
      +
      withExample('Currency with error message', `<c-masked-input class="nds-container_fluid">
      <div aria-live="polite" class="nds-form-element nds-form-container nds-has-error">
        <div class="nds-form-element__control nds-form-element__control-animated-label"><input id="input5-16" min="1000000" value="$10,000.00"
            type="text" inputmode="decimal" placeholder=""
            class="vlocity-input nds-input_mask nds-input nds-not-empty nds-is-dirty">
          <div class="nds-form-element__label nds-align-middle nds-animated-label__ease-out"><label aria-label="Currency"
              for="input5-16">Currency</label>
            <slot name="label"></slot>
          </div>
          <div class="nds-form-element__help nds-form-element__help_text-transform__none">The number is too low.</div>
        </div>
        <div class="nds-grid"></div>
      </div>
    </c-masked-input>`)
      +
      withExample('Currency with repeat', `<c-masked-input class="nds-container_fluid nds-input-has-icon_right">
      <div aria-live="polite" class="nds-form-element nds-form-container">
        <div class="nds-form-element__control nds-form-element__control-animated-label"><input id="input7-18" type="text"
            inputmode="decimal" placeholder="" class="vlocity-input nds-input_mask nds-input">
          <div class="nds-form-element__label nds-align-middle nds-animated-label__ease-out"><label aria-label="Currency"
              for="input7-18">Currency</label>
            <slot name="label"><span slot="label" role="group"
                class="omni-repeat-button-group nds-button-group nds-m-right_x-small nds-tooltip__container"
                style="bottom: 7px; right: -11px;"><button tabindex="0"
                  class="nds-button_reset nds-m-right_x-small vlocity-btn nds-button nds-button_icon">
                  <c-icon><svg aria-hidden="true"
                      class="slds-icon nds-button__icon nds-button__icon_small slds-icon-text-default slds-icon_xx-small">
                      <use
                        xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#add">
                      </use>
                    </svg><span class="nds-assistive-text">Save Currency and add a new currency field</span></c-icon>
                </button><button class="nds-button_reset nds-m-right_x-small vlocity-btn nds-button nds-button_icon">
                  <c-icon><svg aria-hidden="true"
                      class="slds-icon nds-button__icon nds-button__icon_small slds-icon-text-default slds-icon_xx-small">
                      <use
                        xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#close">
                      </use>
                    </svg><span class="nds-assistive-text">Delete Currency and remove the currency field</span></c-icon>
                </button></span></slot>
          </div>
        </div>
        <div class="nds-grid"></div>
      </div>
    </c-masked-input>`)
      +
      withExample('Readonly currency', `<c-masked-input class="nds-container_fluid">
      <div aria-live="polite" class="nds-form-element nds-form-container">
        <div class="nds-form-element__control nds-form-element__control-animated-label"><input id="input9-21" type="text"
            inputmode="decimal" placeholder="" class="vlocity-input nds-input_mask nds-input" tabindex="-1">
          <div class="nds-form-element__label nds-align-middle nds-animated-label__ease-out"><label aria-label="Currency"
              for="input9-21">Currency</label>
          </div>
        </div>
        <div class="nds-grid"></div>
      </div>
    </c-masked-input>`)
      +
      withExample('Currency with currency code', `<c-masked-input class="nds-container_fluid">
      <div aria-live="polite" class="nds-form-element nds-form-container">
        <div class="nds-form-element__control nds-form-element__control-animated-label"><input id="input11-23" type="text"
            inputmode="decimal" value="USD 100,000.00" placeholder="" class="vlocity-input nds-input_mask nds-input nds-not-empty nds-is-dirty">
          <div class="nds-form-element__label nds-align-middle nds-animated-label__ease-out"><label aria-label="Currency"
              for="input11-23">Currency</label>
          </div>
        </div>
        <div class="nds-grid"></div>
      </div>
    </c-masked-input>`);
  })
  .add('Date', () => {
    return withExample('Date with required flag', `<c-omniscript-date class="nds-size_12-of-12 nds-medium-size_12-of-12">
    <c-input class="nds-container_fluid">
      <c-date-picker>
        <div class="via-nds datePickerHt">
          <div class="nds-form nds-form_compound">
            <fieldset class="nds-form-element nds-form-container">
              <div class="nds-grid nds-gutters nds-size_1-of-1 nds-m-around_none">
                <div class="nds-col nds-p-around_none">
                  <div class="nds-form-element nds-size_1-of-1 nds-dropdown-trigger nds-dropdown-trigger_click">
                    <div class="nds-datepicker nds-form-element__control nds-input-has-icon nds-input-has-icon_right nds-form-element__control-animated-label">
                      <input type="text" required="" aria-label="Date" id="date-input-10"
                        data-id="date-picker-nds-input" autocomplete="off" aria-invalid="true" class="nds-input">
                      <div data-label="true"
                        class="nds-form-element__label nds-align-middle nds-animated-label__ease-out nds-date-label">
                        <label aria-label="Date" for="date-input-10">Date<abbr title="Required"
                            class="nds-required nds-p-left_xx-small">*</abbr></label>
                      </div><button data-id="datePickerBtn" title="Select Date" type="button"
                        class="nds-button nds-button_icon nds-input__icon nds-input__icon_right Date">
                        <c-icon class="Date"><svg aria-hidden="true"
                            class="nds-icon nds-icon-text-default nds-icon_x-small">
                            <use
                              xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#event">
                            </use>
                          </svg><span class="nds-assistive-text"></span></c-icon><span class="nds-assistive-text">Select
                          Date</span>
                      </button>
                    </div>
                    <div role="dialog" aria-hidden="false" aria-label="Date picker" data-id="date-picker-div"
                      class="calendar-div nds-datepicker nds-dropdown nds-dropdown_left posAbsolute">
                      <div class="nds-datepicker__filter nds-grid">
                        <div class="nds-datepicker__filter_month nds-grid nds-grid_align-spread nds-grow">
                          <div class="nds-align-middle"><button data-id="prevMonthBtnId" tabindex="0"
                              title="Previous Month" type="button"
                              class="nds-button nds-button_icon nds-button_icon-container prevMonth">
                              <c-icon class="prevMonth"><svg aria-hidden="true"
                                  class="nds-icon nds-icon-text-default nds-icon_x-small">
                                  <use
                                    xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#left">
                                  </use>
                                </svg><span class="nds-assistive-text"></span></c-icon><span
                                class="nds-assistive-text">Previous Month</span>
                            </button></div>
                          <h2 aria-atomic="true" aria-live="assertive" data-id="selected_month" id="month-10"
                            class="nds-align-middle">May</h2>
                          <div class="nds-align-middle"><button data-id="nextMonthBtnId" tabindex="0" title="Next Month"
                              type="button" class="nds-button nds-button_icon nds-button_icon-container nextMonth">
                              <c-icon class="nextMonth"><svg aria-hidden="true"
                                  class="nds-icon nds-icon-text-default nds-icon_x-small">
                                  <use
                                    xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#right">
                                  </use>
                                </svg><span class="nds-assistive-text"></span></c-icon><span
                                class="nds-assistive-text">Next Month</span>
                            </button></div>
                        </div>
                        <div class="nds-shrink-none"><label for="select-01-10" class="nds-assistive-text">Pick a
                            year</label>
                          <div class="nds-select_container"><select tabindex="0" data-id="select-01" id="select-01-10"
                              class="nds-select">
                              <option><span>2019</span></option>
                              <option><span>2020</span></option>
                              <option><span>2021</span></option>
                              <option><span>2022</span></option>
                            </select></div>
                        </div>
                      </div>
                      <table aria-labelledby="month-10" aria-multiselectable="true" role="grid"
                        class="nds-datepicker__month">
                        <thead>
                          <tr data-id="weekdays">
                            <th data-id="Sun" tabindex="-1" scope="col" class="nds-disabled-text"><abbr
                                title="Sun">Sun</abbr></th>
                            <th data-id="Mon" tabindex="-1" scope="col" class="nds-disabled-text"><abbr
                                title="Mon">Mon</abbr></th>
                            <th data-id="Tue" tabindex="-1" scope="col" class="nds-disabled-text"><abbr
                                title="Tue">Tue</abbr></th>
                            <th data-id="Wed" tabindex="-1" scope="col" class="nds-disabled-text"><abbr
                                title="Wed">Wed</abbr></th>
                            <th data-id="Thu" tabindex="-1" scope="col" class="nds-disabled-text"><abbr
                                title="Thu">Thu</abbr></th>
                            <th data-id="Fri" tabindex="-1" scope="col" class="nds-disabled-text"><abbr
                                title="Fri">Fri</abbr></th>
                            <th data-id="Sat" tabindex="-1" scope="col" class="nds-disabled-text"><abbr
                                title="Sat">Sat</abbr></th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td aria-disabled="true" data-id="prev-month-dayId25" aria-selected="false" tabindex="0"
                              role="gridcell"
                              class="day-val day nds-day nds-day_adjacent-month prev-month dayId-prev25"><span
                                class="nds-day">25</span></td>
                            <td aria-disabled="true" data-id="prev-month-dayId26" aria-selected="false" tabindex="0"
                              role="gridcell"
                              class="day-val day nds-day nds-day_adjacent-month prev-month dayId-prev26"><span
                                class="nds-day">26</span></td>
                            <td aria-disabled="true" data-id="prev-month-dayId27" aria-selected="false" tabindex="0"
                              role="gridcell"
                              class="day-val day nds-day nds-day_adjacent-month prev-month dayId-prev27"><span
                                class="nds-day">27</span></td>
                            <td aria-disabled="true" data-id="prev-month-dayId28" aria-selected="false" tabindex="0"
                              role="gridcell"
                              class="day-val day nds-day nds-day_adjacent-month prev-month dayId-prev28"><span
                                class="nds-day">28</span></td>
                            <td aria-disabled="true" data-id="prev-month-dayId29" aria-selected="false" tabindex="0"
                              role="gridcell"
                              class="day-val day nds-day nds-day_adjacent-month prev-month dayId-prev29"><span
                                class="nds-day">29</span></td>
                            <td aria-disabled="true" data-id="prev-month-dayId30" aria-selected="false" tabindex="0"
                              role="gridcell"
                              class="day-val day nds-day nds-day_adjacent-month prev-month dayId-prev30"><span
                                class="nds-day">30</span></td>
                            <td aria-disabled="true" data-id="dayId1" aria-selected="false" tabindex="0" role="gridcell"
                              class="day-val day nds-day dayId1"><span class="nds-day">1</span></td>
                          </tr>
                          <tr>
                            <td aria-disabled="true" data-id="dayId2" aria-selected="false" tabindex="0" role="gridcell"
                              class="day-val day nds-day dayId2"><span class="nds-day">2</span></td>
                            <td aria-disabled="true" data-id="dayId3" aria-selected="false" tabindex="0" role="gridcell"
                              class="day-val day nds-day dayId3"><span class="nds-day">3</span></td>
                            <td aria-disabled="true" data-id="dayId4" aria-selected="false" tabindex="0" role="gridcell"
                              class="day-val day nds-day dayId4 nds-is-today"><span class="nds-day">4</span></td>
                            <td aria-disabled="true" data-id="dayId5" aria-selected="false" tabindex="0" role="gridcell"
                              class="day-val day nds-day dayId5"><span class="nds-day">5</span></td>
                            <td aria-disabled="true" data-id="dayId6" aria-selected="false" tabindex="0" role="gridcell"
                              class="day-val day nds-day dayId6"><span class="nds-day">6</span></td>
                            <td aria-disabled="true" data-id="dayId7" aria-selected="false" tabindex="0" role="gridcell"
                              class="day-val day nds-day dayId7"><span class="nds-day">7</span></td>
                            <td aria-disabled="true" data-id="dayId8" aria-selected="false" tabindex="0" role="gridcell"
                              class="day-val day nds-day dayId8"><span class="nds-day">8</span></td>
                          </tr>
                          <tr>
                            <td aria-disabled="true" data-id="dayId9" aria-selected="false" tabindex="0" role="gridcell"
                              class="day-val day nds-day dayId9"><span class="nds-day">9</span></td>
                            <td aria-disabled="true" data-id="dayId10" aria-selected="false" tabindex="0"
                              role="gridcell" class="day-val day nds-day dayId10"><span class="nds-day">10</span></td>
                            <td aria-disabled="true" data-id="dayId11" aria-selected="false" tabindex="0"
                              role="gridcell" class="day-val day nds-day dayId11"><span class="nds-day">11</span></td>
                            <td aria-disabled="true" data-id="dayId12" aria-selected="false" tabindex="0"
                              role="gridcell" class="day-val day nds-day dayId12"><span class="nds-day">12</span></td>
                            <td aria-disabled="true" data-id="dayId13" aria-selected="false" tabindex="0"
                              role="gridcell" class="day-val day nds-day dayId13"><span class="nds-day">13</span></td>
                            <td aria-disabled="true" data-id="dayId14" aria-selected="false" tabindex="0"
                              role="gridcell" class="day-val day nds-day dayId14"><span class="nds-day">14</span></td>
                            <td aria-disabled="true" data-id="dayId15" aria-selected="false" tabindex="0"
                              role="gridcell" class="day-val day nds-day dayId15"><span class="nds-day">15</span></td>
                          </tr>
                          <tr>
                            <td aria-disabled="true" data-id="dayId16" aria-selected="false" tabindex="0"
                              role="gridcell" class="day-val day nds-day dayId16"><span class="nds-day">16</span></td>
                            <td aria-disabled="true" data-id="dayId17" aria-selected="false" tabindex="0"
                              role="gridcell" class="day-val day nds-day dayId17"><span class="nds-day">17</span></td>
                            <td aria-disabled="true" data-id="dayId18" aria-selected="false" tabindex="0"
                              role="gridcell" class="day-val day nds-day dayId18"><span class="nds-day">18</span></td>
                            <td aria-disabled="true" data-id="dayId19" aria-selected="false" tabindex="0"
                              role="gridcell" class="day-val day nds-day dayId19"><span class="nds-day">19</span></td>
                            <td aria-disabled="true" data-id="dayId20" aria-selected="false" tabindex="0"
                              role="gridcell" class="day-val day nds-day dayId20"><span class="nds-day">20</span></td>
                            <td aria-disabled="true" data-id="dayId21" aria-selected="false" tabindex="0"
                              role="gridcell" class="day-val day nds-day dayId21"><span class="nds-day">21</span></td>
                            <td aria-disabled="true" data-id="dayId22" aria-selected="false" tabindex="0"
                              role="gridcell" class="day-val day nds-day dayId22"><span class="nds-day">22</span></td>
                          </tr>
                          <tr>
                            <td aria-disabled="true" data-id="dayId23" aria-selected="false" tabindex="0"
                              role="gridcell" class="day-val day nds-day dayId23"><span class="nds-day">23</span></td>
                            <td aria-disabled="true" data-id="dayId24" aria-selected="false" tabindex="0"
                              role="gridcell" class="day-val day nds-day dayId24"><span class="nds-day">24</span></td>
                            <td aria-disabled="true" data-id="dayId25" aria-selected="false" tabindex="0"
                              role="gridcell" class="day-val day nds-day dayId25"><span class="nds-day">25</span></td>
                            <td aria-disabled="true" data-id="dayId26" aria-selected="false" tabindex="0"
                              role="gridcell" class="day-val day nds-day dayId26"><span class="nds-day">26</span></td>
                            <td aria-disabled="true" data-id="dayId27" aria-selected="false" tabindex="0"
                              role="gridcell" class="day-val day nds-day dayId27"><span class="nds-day">27</span></td>
                            <td aria-disabled="true" data-id="dayId28" aria-selected="false" tabindex="0"
                              role="gridcell" class="day-val day nds-day dayId28"><span class="nds-day">28</span></td>
                            <td aria-disabled="true" data-id="dayId29" aria-selected="false" tabindex="0"
                              role="gridcell" class="day-val day nds-day dayId29"><span class="nds-day">29</span></td>
                          </tr>
                          <tr>
                            <td aria-disabled="true" data-id="dayId30" aria-selected="false" tabindex="0"
                              role="gridcell" class="day-val day nds-day dayId30"><span class="nds-day">30</span></td>
                            <td aria-disabled="true" data-id="dayId31" aria-selected="false" tabindex="0"
                              role="gridcell" class="day-val day nds-day dayId31"><span class="nds-day">31</span></td>
                            <td aria-disabled="true" data-id="next-month-dayId1" aria-selected="false" tabindex="0"
                              role="gridcell" class="day-val day nds-day nds-day_adjacent-month next-month dayId-next1">
                              <span class="nds-day">1</span></td>
                            <td aria-disabled="true" data-id="next-month-dayId2" aria-selected="false" tabindex="0"
                              role="gridcell" class="day-val day nds-day nds-day_adjacent-month next-month dayId-next2">
                              <span class="nds-day">2</span></td>
                            <td aria-disabled="true" data-id="next-month-dayId3" aria-selected="false" tabindex="0"
                              role="gridcell" class="day-val day nds-day nds-day_adjacent-month next-month dayId-next3">
                              <span class="nds-day">3</span></td>
                            <td aria-disabled="true" data-id="next-month-dayId4" aria-selected="false" tabindex="0"
                              role="gridcell" class="day-val day nds-day nds-day_adjacent-month next-month dayId-next4">
                              <span class="nds-day">4</span></td>
                            <td aria-disabled="true" data-id="next-month-dayId5" aria-selected="false" tabindex="0"
                              role="gridcell" class="day-val day nds-day nds-day_adjacent-month next-month dayId-next5">
                              <span class="nds-day">5</span></td>
                          </tr>
                        </tbody>
                      </table><button data-id="current-date" tabindex="0" type="button"
                        class="nds-button nds-align_absolute-center nds-text-link currentDate">Today</button>
                    </div>
                  </div>
                </div>
              </div>
            </fieldset>
          </div>
        </div>
      </c-date-picker>
    </c-input>
</c-omniscript-date>`)
      +
      withExample('Date with tooltip', 'Note: the tooltip is not visible here because JavaScript is used in the underlying component to ensure it is positioned correctly',
        `<c-omniscript-date class="nds-size_12-of-12 nds-medium-size_12-of-12">
        <c-input class="nds-container_fluid">
          <c-date-picker>
            <div class="via-nds datePickerHt">
              <div class="nds-form nds-form_compound">
                <fieldset class="nds-form-element nds-form-container">
                  <div class="nds-grid nds-gutters nds-size_1-of-1 nds-m-around_none">
                    <div class="nds-col nds-p-around_none">
                      <div
                        class="nds-form-element nds-size_1-of-1 nds-dropdown-trigger nds-dropdown-trigger_click">
                        <div
                          class="nds-datepicker nds-form-element__control nds-input-has-icon nds-input-has-icon_right nds-form-element__control-animated-label">
                          <input type="text" aria-label="Date" id="date-input-14" data-id="date-picker-nds-input"
                            autocomplete="off" aria-invalid="false" class="nds-input">
                          <div data-label="true"
                            class="nds-form-element__label nds-align-middle nds-animated-label__ease-out nds-date-label">
                            <label aria-label="Date" for="date-input-14">Date</label>
                            <c-tooltip data-field-level-help="" class="nds-tooltip__container"><span style="position: relative;">
                                <c-button tabindex="0" aria-describedby="help-15"
                                  aria-disabled="true"><button type="button" label="utility:info"
                                    class="vlocity-btn nds-button nds-button_icon">
                                    <c-icon><svg aria-hidden="true" class="nds-button__icon nds-icon_xx-small">
                                        <use
                                          xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#info">
                                        </use>
                                      </svg><span class="nds-assistive-text"></span></c-icon><span aria-label="Date tooltip"
                                      class="btnLabel"></span>
                                  </button></c-button><span role="tooltip" id="help-15"
                                  class="nds-popover nds-nubbin_bottom-left nds-popover_tooltip nds-fall-into-ground bottom-left tooltipSection"
                                  style="white-space: normal;">
                                  <div class="nds-popover__body">Date tooltip</div>
                                </span>
                              </span></c-tooltip>
                            <slot name="label">
                              <slot slot="label" name="label"></slot>
                            </slot>
                          </div><button data-id="datePickerBtn" title="Select Date" type="button"
                            class="nds-button nds-button_icon nds-input__icon nds-input__icon_right Date">
                            <c-icon class="Date"><svg aria-hidden="true"
                                class="nds-icon nds-icon-text-default nds-icon_x-small">
                                <use
                                  xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#event">
                                </use>
                              </svg><span class="nds-assistive-text"></span></c-icon><span class="nds-assistive-text">Select
                              Date</span>
                          </button>
                        </div>
                        <div role="dialog" aria-hidden="true" aria-label="Date picker" data-id="date-picker-div"
                          class="calendar-div nds-datepicker nds-dropdown nds-dropdown_left posAbsolute">
                          <div class="nds-datepicker__filter nds-grid">
                            <div class="nds-datepicker__filter_month nds-grid nds-grid_align-spread nds-grow">
                              <div class="nds-align-middle"><button data-id="prevMonthBtnId" tabindex="0"
                                  title="Previous Month" type="button"
                                  class="nds-button nds-button_icon nds-button_icon-container prevMonth">
                                  <c-icon class="prevMonth"><svg aria-hidden="true"
                                      class="nds-icon nds-icon-text-default nds-icon_x-small">
                                      <use
                                        xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#left">
                                      </use>
                                    </svg><span class="nds-assistive-text"></span></c-icon><span
                                    class="nds-assistive-text">Previous Month</span>
                                </button></div>
                              <h2 aria-atomic="true" aria-live="assertive" data-id="selected_month" id="month-14"
                                class="nds-align-middle">May</h2>
                              <div class="nds-align-middle"><button data-id="nextMonthBtnId" tabindex="0" title="Next Month"
                                  type="button" class="nds-button nds-button_icon nds-button_icon-container nextMonth">
                                  <c-icon class="nextMonth"><svg aria-hidden="true"
                                      class="nds-icon nds-icon-text-default nds-icon_x-small">
                                      <use
                                        xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#right">
                                      </use>
                                    </svg><span class="nds-assistive-text"></span></c-icon><span
                                    class="nds-assistive-text">Next Month</span>
                                </button></div>
                            </div>
                            <div class="nds-shrink-none"><label for="select-01-14" class="nds-assistive-text">Pick a
                                year</label>
                              <div class="nds-select_container"><select tabindex="0" data-id="select-01" id="select-01-14"
                                  class="nds-select">
                                  <option><span>2019</span></option>
                                  <option><span>2020</span></option>
                                  <option><span>2021</span></option>
                                  <option><span>2022</span></option>
                                </select></div>
                            </div>
                          </div>
                          <table aria-labelledby="month-14" aria-multiselectable="true" role="grid"
                            class="nds-datepicker__month">
                            <thead>
                              <tr data-id="weekdays">
                                <th data-id="Sun" tabindex="-1" scope="col" class="nds-disabled-text"><abbr
                                    title="Sun">Sun</abbr></th>
                                <th data-id="Mon" tabindex="-1" scope="col" class="nds-disabled-text"><abbr
                                    title="Mon">Mon</abbr></th>
                                <th data-id="Tue" tabindex="-1" scope="col" class="nds-disabled-text"><abbr
                                    title="Tue">Tue</abbr></th>
                                <th data-id="Wed" tabindex="-1" scope="col" class="nds-disabled-text"><abbr
                                    title="Wed">Wed</abbr></th>
                                <th data-id="Thu" tabindex="-1" scope="col" class="nds-disabled-text"><abbr
                                    title="Thu">Thu</abbr></th>
                                <th data-id="Fri" tabindex="-1" scope="col" class="nds-disabled-text"><abbr
                                    title="Fri">Fri</abbr></th>
                                <th data-id="Sat" tabindex="-1" scope="col" class="nds-disabled-text"><abbr
                                    title="Sat">Sat</abbr></th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td aria-disabled="true" data-id="prev-month-dayId25" aria-selected="false" tabindex="0"
                                  role="gridcell"
                                  class="day-val day nds-day nds-day_adjacent-month prev-month dayId-prev25"><span
                                    class="nds-day">25</span></td>
                                <td aria-disabled="true" data-id="prev-month-dayId26" aria-selected="false" tabindex="0"
                                  role="gridcell"
                                  class="day-val day nds-day nds-day_adjacent-month prev-month dayId-prev26"><span
                                    class="nds-day">26</span></td>
                                <td aria-disabled="true" data-id="prev-month-dayId27" aria-selected="false" tabindex="0"
                                  role="gridcell"
                                  class="day-val day nds-day nds-day_adjacent-month prev-month dayId-prev27"><span
                                    class="nds-day">27</span></td>
                                <td aria-disabled="true" data-id="prev-month-dayId28" aria-selected="false" tabindex="0"
                                  role="gridcell"
                                  class="day-val day nds-day nds-day_adjacent-month prev-month dayId-prev28"><span
                                    class="nds-day">28</span></td>
                                <td aria-disabled="true" data-id="prev-month-dayId29" aria-selected="false" tabindex="0"
                                  role="gridcell"
                                  class="day-val day nds-day nds-day_adjacent-month prev-month dayId-prev29"><span
                                    class="nds-day">29</span></td>
                                <td aria-disabled="true" data-id="prev-month-dayId30" aria-selected="false" tabindex="0"
                                  role="gridcell"
                                  class="day-val day nds-day nds-day_adjacent-month prev-month dayId-prev30"><span
                                    class="nds-day">30</span></td>
                                <td aria-disabled="true" data-id="dayId1" aria-selected="false" tabindex="0" role="gridcell"
                                  class="day-val day nds-day dayId1"><span class="nds-day">1</span></td>
                              </tr>
                              <tr>
                                <td aria-disabled="true" data-id="dayId2" aria-selected="false" tabindex="0" role="gridcell"
                                  class="day-val day nds-day dayId2"><span class="nds-day">2</span></td>
                                <td aria-disabled="true" data-id="dayId3" aria-selected="false" tabindex="0" role="gridcell"
                                  class="day-val day nds-day dayId3"><span class="nds-day">3</span></td>
                                <td aria-disabled="true" data-id="dayId4" aria-selected="false" tabindex="0" role="gridcell"
                                  class="day-val day nds-day dayId4 nds-is-today"><span class="nds-day">4</span></td>
                                <td aria-disabled="true" data-id="dayId5" aria-selected="false" tabindex="0" role="gridcell"
                                  class="day-val day nds-day dayId5"><span class="nds-day">5</span></td>
                                <td aria-disabled="true" data-id="dayId6" aria-selected="false" tabindex="0" role="gridcell"
                                  class="day-val day nds-day dayId6"><span class="nds-day">6</span></td>
                                <td aria-disabled="true" data-id="dayId7" aria-selected="false" tabindex="0" role="gridcell"
                                  class="day-val day nds-day dayId7"><span class="nds-day">7</span></td>
                                <td aria-disabled="true" data-id="dayId8" aria-selected="false" tabindex="0" role="gridcell"
                                  class="day-val day nds-day dayId8"><span class="nds-day">8</span></td>
                              </tr>
                              <tr>
                                <td aria-disabled="true" data-id="dayId9" aria-selected="false" tabindex="0" role="gridcell"
                                  class="day-val day nds-day dayId9"><span class="nds-day">9</span></td>
                                <td aria-disabled="true" data-id="dayId10" aria-selected="false" tabindex="0"
                                  role="gridcell" class="day-val day nds-day dayId10"><span class="nds-day">10</span></td>
                                <td aria-disabled="true" data-id="dayId11" aria-selected="false" tabindex="0"
                                  role="gridcell" class="day-val day nds-day dayId11"><span class="nds-day">11</span></td>
                                <td aria-disabled="true" data-id="dayId12" aria-selected="false" tabindex="0"
                                  role="gridcell" class="day-val day nds-day dayId12"><span class="nds-day">12</span></td>
                                <td aria-disabled="true" data-id="dayId13" aria-selected="false" tabindex="0"
                                  role="gridcell" class="day-val day nds-day dayId13"><span class="nds-day">13</span></td>
                                <td aria-disabled="true" data-id="dayId14" aria-selected="false" tabindex="0"
                                  role="gridcell" class="day-val day nds-day dayId14"><span class="nds-day">14</span></td>
                                <td aria-disabled="true" data-id="dayId15" aria-selected="false" tabindex="0"
                                  role="gridcell" class="day-val day nds-day dayId15"><span class="nds-day">15</span></td>
                              </tr>
                              <tr>
                                <td aria-disabled="true" data-id="dayId16" aria-selected="false" tabindex="0"
                                  role="gridcell" class="day-val day nds-day dayId16"><span class="nds-day">16</span></td>
                                <td aria-disabled="true" data-id="dayId17" aria-selected="false" tabindex="0"
                                  role="gridcell" class="day-val day nds-day dayId17"><span class="nds-day">17</span></td>
                                <td aria-disabled="true" data-id="dayId18" aria-selected="false" tabindex="0"
                                  role="gridcell" class="day-val day nds-day dayId18"><span class="nds-day">18</span></td>
                                <td aria-disabled="true" data-id="dayId19" aria-selected="false" tabindex="0"
                                  role="gridcell" class="day-val day nds-day dayId19"><span class="nds-day">19</span></td>
                                <td aria-disabled="true" data-id="dayId20" aria-selected="false" tabindex="0"
                                  role="gridcell" class="day-val day nds-day dayId20"><span class="nds-day">20</span></td>
                                <td aria-disabled="true" data-id="dayId21" aria-selected="false" tabindex="0"
                                  role="gridcell" class="day-val day nds-day dayId21"><span class="nds-day">21</span></td>
                                <td aria-disabled="true" data-id="dayId22" aria-selected="false" tabindex="0"
                                  role="gridcell" class="day-val day nds-day dayId22"><span class="nds-day">22</span></td>
                              </tr>
                              <tr>
                                <td aria-disabled="true" data-id="dayId23" aria-selected="false" tabindex="0"
                                  role="gridcell" class="day-val day nds-day dayId23"><span class="nds-day">23</span></td>
                                <td aria-disabled="true" data-id="dayId24" aria-selected="false" tabindex="0"
                                  role="gridcell" class="day-val day nds-day dayId24"><span class="nds-day">24</span></td>
                                <td aria-disabled="true" data-id="dayId25" aria-selected="false" tabindex="0"
                                  role="gridcell" class="day-val day nds-day dayId25"><span class="nds-day">25</span></td>
                                <td aria-disabled="true" data-id="dayId26" aria-selected="false" tabindex="0"
                                  role="gridcell" class="day-val day nds-day dayId26"><span class="nds-day">26</span></td>
                                <td aria-disabled="true" data-id="dayId27" aria-selected="false" tabindex="0"
                                  role="gridcell" class="day-val day nds-day dayId27"><span class="nds-day">27</span></td>
                                <td aria-disabled="true" data-id="dayId28" aria-selected="false" tabindex="0"
                                  role="gridcell" class="day-val day nds-day dayId28"><span class="nds-day">28</span></td>
                                <td aria-disabled="true" data-id="dayId29" aria-selected="false" tabindex="0"
                                  role="gridcell" class="day-val day nds-day dayId29"><span class="nds-day">29</span></td>
                              </tr>
                              <tr>
                                <td aria-disabled="true" data-id="dayId30" aria-selected="false" tabindex="0"
                                  role="gridcell" class="day-val day nds-day dayId30"><span class="nds-day">30</span></td>
                                <td aria-disabled="true" data-id="dayId31" aria-selected="false" tabindex="0"
                                  role="gridcell" class="day-val day nds-day dayId31"><span class="nds-day">31</span></td>
                                <td aria-disabled="true" data-id="next-month-dayId1" aria-selected="false" tabindex="0"
                                  role="gridcell" class="day-val day nds-day nds-day_adjacent-month next-month dayId-next1">
                                  <span class="nds-day">1</span></td>
                                <td aria-disabled="true" data-id="next-month-dayId2" aria-selected="false" tabindex="0"
                                  role="gridcell" class="day-val day nds-day nds-day_adjacent-month next-month dayId-next2">
                                  <span class="nds-day">2</span></td>
                                <td aria-disabled="true" data-id="next-month-dayId3" aria-selected="false" tabindex="0"
                                  role="gridcell" class="day-val day nds-day nds-day_adjacent-month next-month dayId-next3">
                                  <span class="nds-day">3</span></td>
                                <td aria-disabled="true" data-id="next-month-dayId4" aria-selected="false" tabindex="0"
                                  role="gridcell" class="day-val day nds-day nds-day_adjacent-month next-month dayId-next4">
                                  <span class="nds-day">4</span></td>
                                <td aria-disabled="true" data-id="next-month-dayId5" aria-selected="false" tabindex="0"
                                  role="gridcell" class="day-val day nds-day nds-day_adjacent-month next-month dayId-next5">
                                  <span class="nds-day">5</span></td>
                              </tr>
                            </tbody>
                          </table><button data-id="current-date" tabindex="0" type="button"
                            class="nds-button nds-align_absolute-center nds-text-link currentDate">Today</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </fieldset>
              </div>
            </div>
          </c-date-picker>
        </c-input>
    </c-omniscript-date>`)
      +
      withExample('Date with error message', `<c-omniscript-date class="nds-size_12-of-12 nds-medium-size_12-of-12">
      <c-input data-omni-input="" class="nds-container_fluid">
        <c-date-picker>
          <div class="via-nds datePickerHt">
            <div class="nds-form nds-form_compound">
              <fieldset class="nds-form-element nds-form-container">
                <div class="nds-grid nds-gutters nds-size_1-of-1 nds-m-around_none">
                  <div class="nds-col nds-p-around_none">
                    <div
                      class="nds-form-element nds-size_1-of-1 nds-dropdown-trigger nds-dropdown-trigger_click nds-has-error">
                      <div
                        class="nds-datepicker nds-form-element__control nds-input-has-icon nds-input-has-icon_right nds-form-element__control-animated-label">
                        <input type="text" aria-label="Date" id="date-input-21" data-id="date-picker-nds-input"
                          autocomplete="off" aria-invalid="true" class="nds-input nds-not-empty nds-is-dirty">
                        <div data-label="true"
                          class="nds-form-element__label nds-align-middle nds-animated-label__ease-out nds-date-label">
                          <label aria-label="Date" for="date-input-21">Date</label>
                          <slot name="label">
                            <slot slot="label" name="label"></slot>
                          </slot>
                        </div><button data-id="datePickerBtn" title="Select Date" type="button"
                          class="nds-button nds-button_icon nds-input__icon nds-input__icon_right Date">
                          <c-icon class="Date"><svg aria-hidden="true"
                              class="nds-icon nds-icon-text-default nds-icon_x-small">
                              <use xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#event">
                              </use>
                            </svg><span class="nds-assistive-text"></span></c-icon><span class="nds-assistive-text">Select
                            Date</span>
                        </button>
                      </div>
                      <div role="dialog" aria-hidden="false" aria-label="Date picker" data-id="date-picker-div"
                        class="calendar-div nds-datepicker nds-dropdown nds-dropdown_left posAbsolute">
                        <div class="nds-datepicker__filter nds-grid">
                          <div class="nds-datepicker__filter_month nds-grid nds-grid_align-spread nds-grow">
                            <div class="nds-align-middle"><button data-id="prevMonthBtnId" tabindex="0"
                                title="Previous Month" type="button"
                                class="nds-button nds-button_icon nds-button_icon-container prevMonth">
                                <c-icon class="prevMonth"><svg aria-hidden="true"
                                    class="nds-icon nds-icon-text-default nds-icon_x-small">
                                    <use xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#left">
                                    </use>
                                  </svg><span class="nds-assistive-text"></span></c-icon><span
                                  class="nds-assistive-text">Previous Month</span>
                              </button></div>
                            <h2 aria-atomic="true" aria-live="assertive" data-id="selected_month" id="month-21"
                              class="nds-align-middle">March</h2>
                            <div class="nds-align-middle"><button data-id="nextMonthBtnId" tabindex="0" title="Next Month"
                                type="button" class="nds-button nds-button_icon nds-button_icon-container nextMonth">
                                <c-icon class="nextMonth"><svg aria-hidden="true"
                                    class="nds-icon nds-icon-text-default nds-icon_x-small">
                                    <use xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#right">
                                    </use>
                                  </svg><span class="nds-assistive-text"></span></c-icon><span
                                  class="nds-assistive-text">Next Month</span>
                              </button></div>
                          </div>
                          <div class="nds-shrink-none"><label for="select-01-21" class="nds-assistive-text">Pick a
                              year</label>
                            <div class="nds-select_container"><select tabindex="0" data-id="select-01" id="select-01-21"
                                class="nds-select">
                                <option><span>2018</span></option>
                                <option><span>2019</span></option>
                                <option><span>2020</span></option>
                                <option><span>2021</span></option>
                                <option><span>2022</span></option>
                              </select></div>
                          </div>
                        </div>
                        <table aria-labelledby="month-21" aria-multiselectable="true" role="grid"
                          class="nds-datepicker__month">
                          <thead>
                            <tr data-id="weekdays">
                              <th data-id="Sun" tabindex="-1" scope="col" class="nds-disabled-text"><abbr
                                  title="Sun">Sun</abbr></th>
                              <th data-id="Mon" tabindex="-1" scope="col" class="nds-disabled-text"><abbr
                                  title="Mon">Mon</abbr></th>
                              <th data-id="Tue" tabindex="-1" scope="col" class="nds-disabled-text"><abbr
                                  title="Tue">Tue</abbr></th>
                              <th data-id="Wed" tabindex="-1" scope="col" class="nds-disabled-text"><abbr
                                  title="Wed">Wed</abbr></th>
                              <th data-id="Thu" tabindex="-1" scope="col" class="nds-disabled-text"><abbr
                                  title="Thu">Thu</abbr></th>
                              <th data-id="Fri" tabindex="-1" scope="col" class="nds-disabled-text"><abbr
                                  title="Fri">Fri</abbr></th>
                              <th data-id="Sat" tabindex="-1" scope="col" class="nds-disabled-text"><abbr
                                  title="Sat">Sat</abbr></th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td aria-disabled="true" data-id="prev-month-dayId26" aria-selected="false" tabindex="0"
                                role="gridcell"
                                class="day-val day nds-day nds-disabled-text nds-day_adjacent-month prev-month dayId-prev26">
                                <span class="nds-day">26</span></td>
                              <td aria-disabled="true" data-id="prev-month-dayId27" aria-selected="false" tabindex="0"
                                role="gridcell"
                                class="day-val day nds-day nds-disabled-text nds-day_adjacent-month prev-month dayId-prev27">
                                <span class="nds-day">27</span></td>
                              <td aria-disabled="true" data-id="prev-month-dayId28" aria-selected="false" tabindex="0"
                                role="gridcell"
                                class="day-val day nds-day nds-disabled-text nds-day_adjacent-month prev-month dayId-prev28">
                                <span class="nds-day">28</span></td>
                              <td aria-disabled="true" data-id="prev-month-dayId29" aria-selected="false" tabindex="0"
                                role="gridcell"
                                class="day-val day nds-day nds-disabled-text nds-day_adjacent-month prev-month dayId-prev29">
                                <span class="nds-day">29</span></td>
                              <td aria-disabled="true" data-id="dayId1" aria-selected="false" tabindex="0" role="gridcell"
                                class="day-val day nds-day nds-disabled-text dayId1"><span class="nds-day">1</span></td>
                              <td aria-disabled="true" data-id="dayId2" aria-selected="false" tabindex="0" role="gridcell"
                                class="day-val day nds-day nds-disabled-text dayId2"><span class="nds-day">2</span></td>
                              <td aria-disabled="true" data-id="dayId3" aria-selected="false" tabindex="0" role="gridcell"
                                class="day-val day nds-day nds-disabled-text dayId3"><span class="nds-day">3</span></td>
                            </tr>
                            <tr>
                              <td aria-disabled="true" data-id="dayId4" aria-selected="false" tabindex="0" role="gridcell"
                                class="day-val day nds-day nds-disabled-text dayId4"><span class="nds-day">4</span></td>
                              <td aria-disabled="true" data-id="dayId5" aria-selected="false" tabindex="0" role="gridcell"
                                class="day-val day nds-day nds-disabled-text dayId5"><span class="nds-day">5</span></td>
                              <td aria-disabled="true" data-id="dayId6" aria-selected="false" tabindex="0" role="gridcell"
                                class="day-val day nds-day nds-disabled-text dayId6"><span class="nds-day">6</span></td>
                              <td aria-disabled="true" data-id="dayId7" aria-selected="false" tabindex="0" role="gridcell"
                                class="day-val day nds-day nds-disabled-text dayId7"><span class="nds-day">7</span></td>
                              <td aria-disabled="true" data-id="dayId8" aria-selected="false" tabindex="0" role="gridcell"
                                class="day-val day nds-day nds-disabled-text dayId8"><span class="nds-day">8</span></td>
                              <td aria-disabled="true" data-id="dayId9" aria-selected="false" tabindex="0" role="gridcell"
                                class="day-val day nds-day nds-disabled-text dayId9"><span class="nds-day">9</span></td>
                              <td aria-disabled="true" data-id="dayId10" aria-selected="false" tabindex="0" role="gridcell"
                                class="day-val day nds-day nds-disabled-text dayId10"><span class="nds-day">10</span></td>
                            </tr>
                            <tr>
                              <td aria-disabled="true" data-id="dayId11" aria-selected="false" tabindex="0" role="gridcell"
                                class="day-val day nds-day nds-disabled-text dayId11"><span class="nds-day">11</span></td>
                              <td aria-disabled="true" data-id="dayId12" aria-selected="false" tabindex="0" role="gridcell"
                                class="day-val day nds-day nds-disabled-text dayId12"><span class="nds-day">12</span></td>
                              <td aria-disabled="true" data-id="dayId13" aria-selected="false" tabindex="0" role="gridcell"
                                class="day-val day nds-day nds-disabled-text dayId13"><span class="nds-day">13</span></td>
                              <td aria-disabled="true" data-id="dayId14" aria-selected="false" tabindex="0" role="gridcell"
                                class="day-val day nds-day nds-disabled-text dayId14"><span class="nds-day">14</span></td>
                              <td aria-disabled="true" data-id="dayId15" aria-selected="false" tabindex="0" role="gridcell"
                                class="day-val day nds-day nds-disabled-text dayId15"><span class="nds-day">15</span></td>
                              <td aria-disabled="true" data-id="dayId16" aria-selected="false" tabindex="0" role="gridcell"
                                class="day-val day nds-day nds-disabled-text dayId16"><span class="nds-day">16</span></td>
                              <td aria-disabled="true" data-id="dayId17" aria-selected="false" tabindex="0" role="gridcell"
                                class="day-val day nds-day nds-disabled-text dayId17"><span class="nds-day">17</span></td>
                            </tr>
                            <tr>
                              <td aria-disabled="true" data-id="dayId18" aria-selected="false" tabindex="0" role="gridcell"
                                class="day-val day nds-day nds-disabled-text dayId18"><span class="nds-day">18</span></td>
                              <td aria-disabled="true" data-id="dayId19" aria-selected="false" tabindex="0" role="gridcell"
                                class="day-val day nds-day nds-disabled-text dayId19"><span class="nds-day">19</span></td>
                              <td aria-disabled="true" data-id="dayId20" aria-selected="false" tabindex="0" role="gridcell"
                                class="day-val day nds-day nds-disabled-text dayId20"><span class="nds-day">20</span></td>
                              <td aria-disabled="true" data-id="dayId21" aria-selected="false" tabindex="0" role="gridcell"
                                class="day-val day nds-day nds-disabled-text dayId21"><span class="nds-day">21</span></td>
                              <td aria-disabled="true" data-id="dayId22" aria-selected="false" tabindex="0" role="gridcell"
                                class="day-val day nds-day nds-disabled-text dayId22"><span class="nds-day">22</span></td>
                              <td aria-disabled="true" data-id="dayId23" aria-selected="false" tabindex="0" role="gridcell"
                                class="day-val day nds-day nds-disabled-text dayId23"><span class="nds-day">23</span></td>
                              <td aria-disabled="true" data-id="dayId24" aria-selected="false" tabindex="0" role="gridcell"
                                class="day-val day nds-day nds-disabled-text dayId24"><span class="nds-day">24</span></td>
                            </tr>
                            <tr>
                              <td aria-disabled="true" data-id="dayId25" aria-selected="false" tabindex="0" role="gridcell"
                                class="day-val day nds-day nds-disabled-text dayId25"><span class="nds-day">25</span></td>
                              <td aria-disabled="true" data-id="dayId26" aria-selected="false" tabindex="0" role="gridcell"
                                class="day-val day nds-day nds-disabled-text dayId26 nds-is-selected">
                                <span class="nds-day">26</span></td>
                              <td aria-disabled="true" data-id="dayId27" aria-selected="false" tabindex="0" role="gridcell"
                                class="day-val day nds-day dayId27"><span class="nds-day">27</span></td>
                              <td aria-disabled="true" data-id="dayId28" aria-selected="false" tabindex="0" role="gridcell"
                                class="day-val day nds-day dayId28"><span class="nds-day">28</span></td>
                              <td aria-disabled="true" data-id="dayId29" aria-selected="false" tabindex="0" role="gridcell"
                                class="day-val day nds-day dayId29"><span class="nds-day">29</span></td>
                              <td aria-disabled="true" data-id="dayId30" aria-selected="false" tabindex="0" role="gridcell"
                                class="day-val day nds-day dayId30"><span class="nds-day">30</span></td>
                              <td aria-disabled="true" data-id="dayId31" aria-selected="false" tabindex="0" role="gridcell"
                                class="day-val day nds-day dayId31"><span class="nds-day">31</span></td>
                            </tr>
                            <tr>
                              <td aria-disabled="true" data-id="next-month-dayId1" aria-selected="false" tabindex="0"
                                role="gridcell" class="day-val day nds-day nds-day_adjacent-month next-month dayId-next1">
                                <span class="nds-day">1</span></td>
                              <td aria-disabled="true" data-id="next-month-dayId2" aria-selected="false" tabindex="0"
                                role="gridcell" class="day-val day nds-day nds-day_adjacent-month next-month dayId-next2">
                                <span class="nds-day">2</span></td>
                              <td aria-disabled="true" data-id="next-month-dayId3" aria-selected="false" tabindex="0"
                                role="gridcell" class="day-val day nds-day nds-day_adjacent-month next-month dayId-next3">
                                <span class="nds-day">3</span></td>
                              <td aria-disabled="true" data-id="next-month-dayId4" aria-selected="false" tabindex="0"
                                role="gridcell" class="day-val day nds-day nds-day_adjacent-month next-month dayId-next4">
                                <span class="nds-day">4</span></td>
                              <td aria-disabled="true" data-id="next-month-dayId5" aria-selected="false" tabindex="0"
                                role="gridcell" class="day-val day nds-day nds-day_adjacent-month next-month dayId-next5">
                                <span class="nds-day">5</span></td>
                              <td aria-disabled="true" data-id="next-month-dayId6" aria-selected="false" tabindex="0"
                                role="gridcell" class="day-val day nds-day nds-day_adjacent-month next-month dayId-next6">
                                <span class="nds-day">6</span></td>
                              <td aria-disabled="true" data-id="next-month-dayId7" aria-selected="false" tabindex="0"
                                role="gridcell" class="day-val day nds-day nds-day_adjacent-month next-month dayId-next7">
                                <span class="nds-day">7</span></td>
                            </tr>
                          </tbody>
                        </table><button data-id="current-date" tabindex="0" type="button"
                          class="nds-button nds-align_absolute-center nds-text-link currentDate">Today</button>
                      </div>
                    </div>
                    <div class="nds-has-error"><span
                        class="nds-form-element__help nds-form-element__help_text-transform__none">This date has been
                        disabled. Please select a date on or after 03-27-1984</span></div>
                  </div>
                </div>
              </fieldset>
            </div>
          </div>
        </c-date-picker>
      </c-input>
    </c-omniscript-date>`)
      +
      withExample('Date with repeat', `<c-omniscript-date class="nds-size_12-of-12 nds-medium-size_12-of-12">
      <slot>
        <c-input data-omni-input="" class="nds-container_fluid nds-input-has-icon_right">
          <c-date-picker>
            <div class="via-nds datePickerHt">
              <div class="nds-form nds-form_compound">
                <fieldset class="nds-form-element nds-form-container">
                  <div class="nds-grid nds-gutters nds-size_1-of-1 nds-m-around_none">
                    <div class="nds-col nds-p-around_none">
                      <div class="nds-form-element nds-size_1-of-1 nds-dropdown-trigger nds-dropdown-trigger_click">
                        <div
                          class="nds-datepicker nds-form-element__control nds-input-has-icon nds-input-has-icon_right nds-form-element__control-animated-label">
                          <input type="text" aria-label="Date" id="date-input-41" data-id="date-picker-nds-input"
                            autocomplete="off" aria-invalid="false" class="nds-input">
                          <div data-label="true"
                            class="nds-form-element__label nds-align-middle nds-animated-label__ease-out nds-date-label">
                            <label aria-label="Date" for="date-input-41">Date</label>
                            <slot name="label">
                              <slot slot="label" name="label"><span slot="label" role="group"
                                  class="omni-repeat-button-group nds-button-group nds-m-right_x-small nds-tooltip__container"
                                  style="bottom: 7px; right: 11px;"><button
                                    class="nds-button_reset nds-m-right_x-small vlocity-btn nds-button nds-button_icon">
                                    <c-icon><svg aria-hidden="true"
                                        class="slds-icon nds-button__icon nds-button__icon_small slds-icon-text-default slds-icon_xx-small">
                                        <use
                                          xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#add">
                                        </use>
                                      </svg><span class="nds-assistive-text">Repeat Date</span></c-icon>
                                  </button><button
                                    class="nds-button_reset nds-m-right_x-small vlocity-btn nds-button nds-button_icon">
                                    <c-icon><svg aria-hidden="true"
                                        class="slds-icon nds-button__icon nds-button__icon_small slds-icon-text-default slds-icon_xx-small">
                                        <use
                                          xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#close">
                                        </use>
                                      </svg><span class="nds-assistive-text">Remove Date</span></c-icon>
                                  </button></span></slot>
                            </slot>
                          </div><button data-id="datePickerBtn" title="Select Date" type="button"
                            class="nds-button nds-button_icon nds-input__icon nds-input__icon_right Date">
                            <c-icon class="Date"><svg aria-hidden="true"
                                class="nds-icon nds-icon-text-default nds-icon_x-small">
                                <use
                                  xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#event">
                                </use>
                              </svg><span class="nds-assistive-text"></span></c-icon><span class="nds-assistive-text">Select
                              Date</span>
                          </button>
                        </div>
                        <div role="dialog" aria-hidden="false" aria-label="Date picker" data-id="date-picker-div"
                          class="calendar-div nds-datepicker nds-dropdown nds-dropdown_left posAbsolute">
                          <div class="nds-datepicker__filter nds-grid">
                            <div class="nds-datepicker__filter_month nds-grid nds-grid_align-spread nds-grow">
                              <div class="nds-align-middle"><button data-id="prevMonthBtnId" tabindex="0"
                                  title="Previous Month" type="button"
                                  class="nds-button nds-button_icon nds-button_icon-container prevMonth">
                                  <c-icon class="prevMonth"><svg aria-hidden="true"
                                      class="nds-icon nds-icon-text-default nds-icon_x-small">
                                      <use
                                        xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#left">
                                      </use>
                                    </svg><span class="nds-assistive-text"></span></c-icon><span
                                    class="nds-assistive-text">Previous Month</span>
                                </button></div>
                              <h2 aria-atomic="true" aria-live="assertive" data-id="selected_month" id="month-41"
                                class="nds-align-middle">May</h2>
                              <div class="nds-align-middle"><button data-id="nextMonthBtnId" tabindex="0" title="Next Month"
                                  type="button" class="nds-button nds-button_icon nds-button_icon-container nextMonth">
                                  <c-icon class="nextMonth"><svg aria-hidden="true"
                                      class="nds-icon nds-icon-text-default nds-icon_x-small">
                                      <use
                                        xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#right">
                                      </use>
                                    </svg><span class="nds-assistive-text"></span></c-icon><span
                                    class="nds-assistive-text">Next Month</span>
                                </button></div>
                            </div>
                            <div class="nds-shrink-none"><label for="select-01-41" class="nds-assistive-text">Pick a
                                year</label>
                              <div class="nds-select_container"><select tabindex="0" data-id="select-01" id="select-01-41"
                                  class="nds-select">
                                  <option><span>2019</span></option>
                                  <option><span>2020</span></option>
                                  <option><span>2021</span></option>
                                </select></div>
                            </div>
                          </div>
                          <table aria-labelledby="month-41" aria-multiselectable="true" role="grid"
                            class="nds-datepicker__month">
                            <thead>
                              <tr data-id="weekdays">
                                <th data-id="Sun" tabindex="-1" scope="col" class="nds-disabled-text"><abbr
                                    title="Sun">Sun</abbr></th>
                                <th data-id="Mon" tabindex="-1" scope="col" class="nds-disabled-text"><abbr
                                    title="Mon">Mon</abbr></th>
                                <th data-id="Tue" tabindex="-1" scope="col" class="nds-disabled-text"><abbr
                                    title="Tue">Tue</abbr></th>
                                <th data-id="Wed" tabindex="-1" scope="col" class="nds-disabled-text"><abbr
                                    title="Wed">Wed</abbr></th>
                                <th data-id="Thu" tabindex="-1" scope="col" class="nds-disabled-text"><abbr
                                    title="Thu">Thu</abbr></th>
                                <th data-id="Fri" tabindex="-1" scope="col" class="nds-disabled-text"><abbr
                                    title="Fri">Fri</abbr></th>
                                <th data-id="Sat" tabindex="-1" scope="col" class="nds-disabled-text"><abbr
                                    title="Sat">Sat</abbr></th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td aria-disabled="true" data-id="prev-month-dayId25" aria-selected="false" tabindex="0"
                                  role="gridcell"
                                  class="day-val day nds-day nds-day_adjacent-month prev-month dayId-prev25"><span
                                    class="nds-day">25</span></td>
                                <td aria-disabled="true" data-id="prev-month-dayId26" aria-selected="false" tabindex="0"
                                  role="gridcell"
                                  class="day-val day nds-day nds-day_adjacent-month prev-month dayId-prev26"><span
                                    class="nds-day">26</span></td>
                                <td aria-disabled="true" data-id="prev-month-dayId27" aria-selected="false" tabindex="0"
                                  role="gridcell"
                                  class="day-val day nds-day nds-day_adjacent-month prev-month dayId-prev27"><span
                                    class="nds-day">27</span></td>
                                <td aria-disabled="true" data-id="prev-month-dayId28" aria-selected="false" tabindex="0"
                                  role="gridcell"
                                  class="day-val day nds-day nds-day_adjacent-month prev-month dayId-prev28"><span
                                    class="nds-day">28</span></td>
                                <td aria-disabled="true" data-id="prev-month-dayId29" aria-selected="false" tabindex="0"
                                  role="gridcell"
                                  class="day-val day nds-day nds-day_adjacent-month prev-month dayId-prev29"><span
                                    class="nds-day">29</span></td>
                                <td aria-disabled="true" data-id="prev-month-dayId30" aria-selected="false" tabindex="0"
                                  role="gridcell"
                                  class="day-val day nds-day nds-day_adjacent-month prev-month dayId-prev30"><span
                                    class="nds-day">30</span></td>
                                <td aria-disabled="true" data-id="dayId1" aria-selected="false" tabindex="0" role="gridcell"
                                  class="day-val day nds-day dayId1"><span class="nds-day">1</span></td>
                              </tr>
                              <tr>
                                <td aria-disabled="true" data-id="dayId2" aria-selected="false" tabindex="0" role="gridcell"
                                  class="day-val day nds-day dayId2"><span class="nds-day">2</span></td>
                                <td aria-disabled="true" data-id="dayId3" aria-selected="false" tabindex="0" role="gridcell"
                                  class="day-val day nds-day dayId3"><span class="nds-day">3</span></td>
                                <td aria-disabled="true" data-id="dayId4" aria-selected="false" tabindex="0" role="gridcell"
                                  class="day-val day nds-day dayId4 nds-is-today"><span class="nds-day">4</span></td>
                                <td aria-disabled="true" data-id="dayId5" aria-selected="false" tabindex="0" role="gridcell"
                                  class="day-val day nds-day dayId5"><span class="nds-day">5</span></td>
                                <td aria-disabled="true" data-id="dayId6" aria-selected="false" tabindex="0" role="gridcell"
                                  class="day-val day nds-day dayId6"><span class="nds-day">6</span></td>
                                <td aria-disabled="true" data-id="dayId7" aria-selected="false" tabindex="0" role="gridcell"
                                  class="day-val day nds-day dayId7"><span class="nds-day">7</span></td>
                                <td aria-disabled="true" data-id="dayId8" aria-selected="false" tabindex="0" role="gridcell"
                                  class="day-val day nds-day dayId8"><span class="nds-day">8</span></td>
                              </tr>
                              <tr>
                                <td aria-disabled="true" data-id="dayId9" aria-selected="false" tabindex="0" role="gridcell"
                                  class="day-val day nds-day dayId9"><span class="nds-day">9</span></td>
                                <td aria-disabled="true" data-id="dayId10" aria-selected="false" tabindex="0"
                                  role="gridcell" class="day-val day nds-day dayId10"><span class="nds-day">10</span></td>
                                <td aria-disabled="true" data-id="dayId11" aria-selected="false" tabindex="0"
                                  role="gridcell" class="day-val day nds-day dayId11"><span class="nds-day">11</span></td>
                                <td aria-disabled="true" data-id="dayId12" aria-selected="false" tabindex="0"
                                  role="gridcell" class="day-val day nds-day dayId12"><span class="nds-day">12</span></td>
                                <td aria-disabled="true" data-id="dayId13" aria-selected="false" tabindex="0"
                                  role="gridcell" class="day-val day nds-day dayId13"><span class="nds-day">13</span></td>
                                <td aria-disabled="true" data-id="dayId14" aria-selected="false" tabindex="0"
                                  role="gridcell" class="day-val day nds-day dayId14"><span class="nds-day">14</span></td>
                                <td aria-disabled="true" data-id="dayId15" aria-selected="false" tabindex="0"
                                  role="gridcell" class="day-val day nds-day dayId15"><span class="nds-day">15</span></td>
                              </tr>
                              <tr>
                                <td aria-disabled="true" data-id="dayId16" aria-selected="false" tabindex="0"
                                  role="gridcell" class="day-val day nds-day dayId16"><span class="nds-day">16</span></td>
                                <td aria-disabled="true" data-id="dayId17" aria-selected="false" tabindex="0"
                                  role="gridcell" class="day-val day nds-day dayId17"><span class="nds-day">17</span></td>
                                <td aria-disabled="true" data-id="dayId18" aria-selected="false" tabindex="0"
                                  role="gridcell" class="day-val day nds-day dayId18"><span class="nds-day">18</span></td>
                                <td aria-disabled="true" data-id="dayId19" aria-selected="false" tabindex="0"
                                  role="gridcell" class="day-val day nds-day dayId19"><span class="nds-day">19</span></td>
                                <td aria-disabled="true" data-id="dayId20" aria-selected="false" tabindex="0"
                                  role="gridcell" class="day-val day nds-day dayId20"><span class="nds-day">20</span></td>
                                <td aria-disabled="true" data-id="dayId21" aria-selected="false" tabindex="0"
                                  role="gridcell" class="day-val day nds-day dayId21"><span class="nds-day">21</span></td>
                                <td aria-disabled="true" data-id="dayId22" aria-selected="false" tabindex="0"
                                  role="gridcell" class="day-val day nds-day dayId22"><span class="nds-day">22</span></td>
                              </tr>
                              <tr>
                                <td aria-disabled="true" data-id="dayId23" aria-selected="false" tabindex="0"
                                  role="gridcell" class="day-val day nds-day dayId23"><span class="nds-day">23</span></td>
                                <td aria-disabled="true" data-id="dayId24" aria-selected="false" tabindex="0"
                                  role="gridcell" class="day-val day nds-day dayId24"><span class="nds-day">24</span></td>
                                <td aria-disabled="true" data-id="dayId25" aria-selected="false" tabindex="0"
                                  role="gridcell" class="day-val day nds-day dayId25"><span class="nds-day">25</span></td>
                                <td aria-disabled="true" data-id="dayId26" aria-selected="false" tabindex="0"
                                  role="gridcell" class="day-val day nds-day dayId26"><span class="nds-day">26</span></td>
                                <td aria-disabled="true" data-id="dayId27" aria-selected="false" tabindex="0"
                                  role="gridcell" class="day-val day nds-day dayId27"><span class="nds-day">27</span></td>
                                <td aria-disabled="true" data-id="dayId28" aria-selected="false" tabindex="0"
                                  role="gridcell" class="day-val day nds-day dayId28"><span class="nds-day">28</span></td>
                                <td aria-disabled="true" data-id="dayId29" aria-selected="false" tabindex="0"
                                  role="gridcell" class="day-val day nds-day dayId29"><span class="nds-day">29</span></td>
                              </tr>
                              <tr>
                                <td aria-disabled="true" data-id="dayId30" aria-selected="false" tabindex="0"
                                  role="gridcell" class="day-val day nds-day dayId30"><span class="nds-day">30</span></td>
                                <td aria-disabled="true" data-id="dayId31" aria-selected="false" tabindex="0"
                                  role="gridcell" class="day-val day nds-day dayId31"><span class="nds-day">31</span></td>
                                <td aria-disabled="true" data-id="next-month-dayId1" aria-selected="false" tabindex="0"
                                  role="gridcell" class="day-val day nds-day nds-day_adjacent-month next-month dayId-next1">
                                  <span class="nds-day">1</span></td>
                                <td aria-disabled="true" data-id="next-month-dayId2" aria-selected="false" tabindex="0"
                                  role="gridcell" class="day-val day nds-day nds-day_adjacent-month next-month dayId-next2">
                                  <span class="nds-day">2</span></td>
                                <td aria-disabled="true" data-id="next-month-dayId3" aria-selected="false" tabindex="0"
                                  role="gridcell" class="day-val day nds-day nds-day_adjacent-month next-month dayId-next3">
                                  <span class="nds-day">3</span></td>
                                <td aria-disabled="true" data-id="next-month-dayId4" aria-selected="false" tabindex="0"
                                  role="gridcell" class="day-val day nds-day nds-day_adjacent-month next-month dayId-next4">
                                  <span class="nds-day">4</span></td>
                                <td aria-disabled="true" data-id="next-month-dayId5" aria-selected="false" tabindex="0"
                                  role="gridcell" class="day-val day nds-day nds-day_adjacent-month next-month dayId-next5">
                                  <span class="nds-day">5</span></td>
                              </tr>
                            </tbody>
                          </table><button data-id="current-date" tabindex="0" type="button"
                            class="nds-button nds-align_absolute-center nds-text-link currentDate">Today</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </fieldset>
              </div>
            </div>
          </c-date-picker>
        </c-input>
      </slot>
    </c-omniscript-date>`)
      +
      withExample('Readonly Date', `<c-omniscript-date class="nds-size_12-of-12 nds-medium-size_12-of-12 nds-read-only" aria-disabled="true">
      <c-input class="nds-container_fluid">
        <c-date-picker>
          <div class="via-nds datePickerHt">
            <div class="nds-form nds-form_compound">
              <fieldset class="nds-form-element nds-form-container">
                <div class="nds-grid nds-gutters nds-size_1-of-1 nds-m-around_none">
                  <div class="nds-col nds-p-around_none">
                    <div class="nds-form-element nds-size_1-of-1 nds-dropdown-trigger nds-dropdown-trigger_click">
                      <div
                        class="nds-datepicker nds-form-element__control nds-input-has-icon nds-input-has-icon_right nds-form-element__control-animated-label">
                        <input type="text" aria-label="Date" id="date-input-30" data-id="date-picker-nds-input"
                          autocomplete="off" aria-invalid="false" class="nds-input" tabindex="-1">
                        <div data-label="true"
                          class="nds-form-element__label nds-align-middle nds-animated-label__ease-out nds-date-label">
                          <label aria-label="Date" for="date-input-30">Date</label>
                          <slot name="label">
                            <slot slot="label" name="label"></slot>
                          </slot>
                        </div><button data-id="datePickerBtn" title="Select Date" type="button"
                          class="nds-button nds-button_icon nds-input__icon nds-input__icon_right Date" tabindex="-1">
                          <c-icon class="Date"><svg aria-hidden="true"
                              class="nds-icon nds-icon-text-default nds-icon_x-small">
                              <use xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#event">
                              </use>
                            </svg><span class="nds-assistive-text"></span></c-icon><span class="nds-assistive-text">Select
                            Date</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </fieldset>
            </div>
          </div>
        </c-date-picker>
      </c-input>
    </c-omniscript-date>`);
  })
  .add('Date/Time', () => {
    return withExample('Date/Time with required flag', `  <c-omniscript-date-time class="nds-size_12-of-12 nds-medium-size_12-of-12">
    <c-input class="nds-container_fluid">
      <c-datetime-picker name="datetime-0">
        <div class="nds-grid nds-gutters nds-wrap">
          <div class="nds-col nds-size_1-of-1 nds-medium-size_7-of-12 nds-large-size_1-of-2">
            <c-date-picker>
              <div class="via-nds datePickerHt">
                <div class="nds-form nds-form_compound">
                  <fieldset class="nds-form-element nds-form-container">
                    <div class="nds-grid nds-gutters nds-size_1-of-1 nds-m-around_none">
                      <div class="nds-col nds-p-around_none">
                        <div
                          class="nds-form-element nds-size_1-of-1 nds-dropdown-trigger nds-dropdown-trigger_click nds-has-error">
                          <div
                            class="nds-datepicker nds-form-element__control nds-input-has-icon nds-input-has-icon_right nds-form-element__control-animated-label">
                            <input type="text" required="" placeholder="date placeholder" aria-label="Date Time: Date"
                              name="date" id="date-input-11" data-id="date-picker-nds-input" autocomplete="off"
                              aria-invalid="true" class="nds-input">
                            <div data-label="true"
                              class="nds-form-element__label nds-align-middle nds-animated-label__ease-out nds-date-label">
                              <label aria-label="Date Time" for="date-input-11">Date Time<abbr title="Required"
                                  class="nds-required nds-p-left_xx-small">*</abbr></label>
                              <slot name="label">
                                <slot slot="label" name="label">
                                  <slot slot="label" name="label"></slot>
                                </slot>
                              </slot>
                            </div><button data-id="datePickerBtn" title="Select Date" type="button"
                              class="nds-button nds-button_icon nds-input__icon nds-input__icon_right Date">
                              <c-icon class="Date"><svg aria-hidden="true"
                                  class="nds-icon nds-icon-text-default nds-icon_x-small">
                                  <use xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#event"></use>
                                </svg><span class="nds-assistive-text"></span></c-icon><span
                                class="nds-assistive-text">Select Date</span>
                            </button>
                          </div>
                          <div role="dialog" aria-hidden="false" aria-label="Date picker" data-id="date-picker-div"
                            class="calendar-div nds-datepicker nds-dropdown nds-dropdown_left posAbsolute">
                            <div class="nds-datepicker__filter nds-grid">
                              <div class="nds-datepicker__filter_month nds-grid nds-grid_align-spread nds-grow">
                                <div class="nds-align-middle"><button data-id="prevMonthBtnId" tabindex="0"
                                    title="Previous Month" type="button"
                                    class="nds-button nds-button_icon nds-button_icon-container prevMonth">
                                    <c-icon class="prevMonth"><svg aria-hidden="true"
                                        class="nds-icon nds-icon-text-default nds-icon_x-small">
                                        <use xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#left"></use>
                                      </svg><span class="nds-assistive-text"></span></c-icon><span
                                      class="nds-assistive-text">Previous Month</span>
                                  </button></div>
                                <h2 aria-atomic="true" aria-live="assertive" data-id="selected_month" id="month-11"
                                  class="nds-align-middle">May</h2>
                                <div class="nds-align-middle"><button data-id="nextMonthBtnId" tabindex="0"
                                    title="Next Month" type="button"
                                    class="nds-button nds-button_icon nds-button_icon-container nextMonth">
                                    <c-icon class="nextMonth"><svg aria-hidden="true"
                                        class="nds-icon nds-icon-text-default nds-icon_x-small">
                                        <use xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#right"></use>
                                      </svg><span class="nds-assistive-text"></span></c-icon><span
                                      class="nds-assistive-text">Next Month</span>
                                  </button></div>
                              </div>
                              <div class="nds-shrink-none"><label for="select-01-11" class="nds-assistive-text">Pick a
                                  year</label>
                                <div class="nds-select_container"><select tabindex="0" data-id="select-01"
                                    id="select-01-11" class="nds-select">
                                    <option><span>1921</span></option>
                                    <option><span>1922</span></option>
                                    <option><span>1923</span></option>
                                    <option><span>1924</span></option>
                                    <option><span>1925</span></option>
                                    <option><span>1926</span></option>
                                    <option><span>1927</span></option>
                                    <option><span>1928</span></option>
                                    <option><span>1929</span></option>
                                    <option><span>1930</span></option>
                                    <option><span>1931</span></option>
                                    <option><span>1932</span></option>
                                    <option><span>1933</span></option>
                                    <option><span>1934</span></option>
                                    <option><span>1935</span></option>
                                    <option><span>1936</span></option>
                                    <option><span>1937</span></option>
                                    <option><span>1938</span></option>
                                    <option><span>1939</span></option>
                                    <option><span>1940</span></option>
                                    <option><span>1941</span></option>
                                    <option><span>1942</span></option>
                                    <option><span>1943</span></option>
                                    <option><span>1944</span></option>
                                    <option><span>1945</span></option>
                                    <option><span>1946</span></option>
                                    <option><span>1947</span></option>
                                    <option><span>1948</span></option>
                                    <option><span>1949</span></option>
                                    <option><span>1950</span></option>
                                    <option><span>1951</span></option>
                                    <option><span>1952</span></option>
                                    <option><span>1953</span></option>
                                    <option><span>1954</span></option>
                                    <option><span>1955</span></option>
                                    <option><span>1956</span></option>
                                    <option><span>1957</span></option>
                                    <option><span>1958</span></option>
                                    <option><span>1959</span></option>
                                    <option><span>1960</span></option>
                                    <option><span>1961</span></option>
                                    <option><span>1962</span></option>
                                    <option><span>1963</span></option>
                                    <option><span>1964</span></option>
                                    <option><span>1965</span></option>
                                    <option><span>1966</span></option>
                                    <option><span>1967</span></option>
                                    <option><span>1968</span></option>
                                    <option><span>1969</span></option>
                                    <option><span>1970</span></option>
                                    <option><span>1971</span></option>
                                    <option><span>1972</span></option>
                                    <option><span>1973</span></option>
                                    <option><span>1974</span></option>
                                    <option><span>1975</span></option>
                                    <option><span>1976</span></option>
                                    <option><span>1977</span></option>
                                    <option><span>1978</span></option>
                                    <option><span>1979</span></option>
                                    <option><span>1980</span></option>
                                    <option><span>1981</span></option>
                                    <option><span>1982</span></option>
                                    <option><span>1983</span></option>
                                    <option><span>1984</span></option>
                                    <option><span>1985</span></option>
                                    <option><span>1986</span></option>
                                    <option><span>1987</span></option>
                                    <option><span>1988</span></option>
                                    <option><span>1989</span></option>
                                    <option><span>1990</span></option>
                                    <option><span>1991</span></option>
                                    <option><span>1992</span></option>
                                    <option><span>1993</span></option>
                                    <option><span>1994</span></option>
                                    <option><span>1995</span></option>
                                    <option><span>1996</span></option>
                                    <option><span>1997</span></option>
                                    <option><span>1998</span></option>
                                    <option><span>1999</span></option>
                                    <option><span>2000</span></option>
                                    <option><span>2001</span></option>
                                    <option><span>2002</span></option>
                                    <option><span>2003</span></option>
                                    <option><span>2004</span></option>
                                    <option><span>2005</span></option>
                                    <option><span>2006</span></option>
                                    <option><span>2007</span></option>
                                    <option><span>2008</span></option>
                                    <option><span>2009</span></option>
                                    <option><span>2010</span></option>
                                    <option><span>2011</span></option>
                                    <option><span>2012</span></option>
                                    <option><span>2013</span></option>
                                    <option><span>2014</span></option>
                                    <option><span>2015</span></option>
                                    <option><span>2016</span></option>
                                    <option><span>2017</span></option>
                                    <option><span>2018</span></option>
                                    <option><span>2019</span></option>
                                    <option><span>2020</span></option>
                                    <option><span>2021</span></option>
                                    <option><span>2022</span></option>
                                    <option><span>2023</span></option>
                                    <option><span>2024</span></option>
                                    <option><span>2025</span></option>
                                    <option><span>2026</span></option>
                                    <option><span>2027</span></option>
                                    <option><span>2028</span></option>
                                    <option><span>2029</span></option>
                                    <option><span>2030</span></option>
                                    <option><span>2031</span></option>
                                    <option><span>2032</span></option>
                                    <option><span>2033</span></option>
                                    <option><span>2034</span></option>
                                    <option><span>2035</span></option>
                                    <option><span>2036</span></option>
                                    <option><span>2037</span></option>
                                    <option><span>2038</span></option>
                                    <option><span>2039</span></option>
                                    <option><span>2040</span></option>
                                    <option><span>2041</span></option>
                                    <option><span>2042</span></option>
                                    <option><span>2043</span></option>
                                    <option><span>2044</span></option>
                                    <option><span>2045</span></option>
                                    <option><span>2046</span></option>
                                    <option><span>2047</span></option>
                                    <option><span>2048</span></option>
                                    <option><span>2049</span></option>
                                    <option><span>2050</span></option>
                                    <option><span>2051</span></option>
                                    <option><span>2052</span></option>
                                    <option><span>2053</span></option>
                                    <option><span>2054</span></option>
                                    <option><span>2055</span></option>
                                    <option><span>2056</span></option>
                                    <option><span>2057</span></option>
                                    <option><span>2058</span></option>
                                    <option><span>2059</span></option>
                                    <option><span>2060</span></option>
                                    <option><span>2061</span></option>
                                    <option><span>2062</span></option>
                                    <option><span>2063</span></option>
                                    <option><span>2064</span></option>
                                    <option><span>2065</span></option>
                                    <option><span>2066</span></option>
                                    <option><span>2067</span></option>
                                    <option><span>2068</span></option>
                                    <option><span>2069</span></option>
                                    <option><span>2070</span></option>
                                    <option><span>2071</span></option>
                                    <option><span>2072</span></option>
                                    <option><span>2073</span></option>
                                    <option><span>2074</span></option>
                                    <option><span>2075</span></option>
                                    <option><span>2076</span></option>
                                    <option><span>2077</span></option>
                                    <option><span>2078</span></option>
                                    <option><span>2079</span></option>
                                    <option><span>2080</span></option>
                                    <option><span>2081</span></option>
                                    <option><span>2082</span></option>
                                    <option><span>2083</span></option>
                                    <option><span>2084</span></option>
                                    <option><span>2085</span></option>
                                    <option><span>2086</span></option>
                                    <option><span>2087</span></option>
                                    <option><span>2088</span></option>
                                    <option><span>2089</span></option>
                                    <option><span>2090</span></option>
                                    <option><span>2091</span></option>
                                    <option><span>2092</span></option>
                                    <option><span>2093</span></option>
                                    <option><span>2094</span></option>
                                    <option><span>2095</span></option>
                                    <option><span>2096</span></option>
                                    <option><span>2097</span></option>
                                    <option><span>2098</span></option>
                                    <option><span>2099</span></option>
                                    <option><span>2100</span></option>
                                    <option><span>2101</span></option>
                                    <option><span>2102</span></option>
                                    <option><span>2103</span></option>
                                    <option><span>2104</span></option>
                                    <option><span>2105</span></option>
                                    <option><span>2106</span></option>
                                    <option><span>2107</span></option>
                                    <option><span>2108</span></option>
                                    <option><span>2109</span></option>
                                    <option><span>2110</span></option>
                                    <option><span>2111</span></option>
                                    <option><span>2112</span></option>
                                    <option><span>2113</span></option>
                                    <option><span>2114</span></option>
                                    <option><span>2115</span></option>
                                    <option><span>2116</span></option>
                                    <option><span>2117</span></option>
                                    <option><span>2118</span></option>
                                    <option><span>2119</span></option>
                                    <option><span>2120</span></option>
                                    <option><span>2121</span></option>
                                  </select></div>
                              </div>
                            </div>
                            <table aria-labelledby="month-11" aria-multiselectable="true" role="grid"
                              class="nds-datepicker__month">
                              <thead>
                                <tr data-id="weekdays">
                                  <th data-id="Sun" tabindex="-1" scope="col" class="nds-disabled-text"><abbr
                                      title="Sun">Sun</abbr></th>
                                  <th data-id="Mon" tabindex="-1" scope="col" class="nds-disabled-text"><abbr
                                      title="Mon">Mon</abbr></th>
                                  <th data-id="Tue" tabindex="-1" scope="col" class="nds-disabled-text"><abbr
                                      title="Tue">Tue</abbr></th>
                                  <th data-id="Wed" tabindex="-1" scope="col" class="nds-disabled-text"><abbr
                                      title="Wed">Wed</abbr></th>
                                  <th data-id="Thu" tabindex="-1" scope="col" class="nds-disabled-text"><abbr
                                      title="Thu">Thu</abbr></th>
                                  <th data-id="Fri" tabindex="-1" scope="col" class="nds-disabled-text"><abbr
                                      title="Fri">Fri</abbr></th>
                                  <th data-id="Sat" tabindex="-1" scope="col" class="nds-disabled-text"><abbr
                                      title="Sat">Sat</abbr></th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td aria-disabled="true" data-id="prev-month-dayId25" aria-selected="false"
                                    tabindex="0" role="gridcell"
                                    class="day-val day nds-day nds-day_adjacent-month prev-month dayId-prev25"><span
                                      class="nds-day">25</span></td>
                                  <td aria-disabled="true" data-id="prev-month-dayId26" aria-selected="false"
                                    tabindex="0" role="gridcell"
                                    class="day-val day nds-day nds-day_adjacent-month prev-month dayId-prev26"><span
                                      class="nds-day">26</span></td>
                                  <td aria-disabled="true" data-id="prev-month-dayId27" aria-selected="false"
                                    tabindex="0" role="gridcell"
                                    class="day-val day nds-day nds-day_adjacent-month prev-month dayId-prev27"><span
                                      class="nds-day">27</span></td>
                                  <td aria-disabled="true" data-id="prev-month-dayId28" aria-selected="false"
                                    tabindex="0" role="gridcell"
                                    class="day-val day nds-day nds-day_adjacent-month prev-month dayId-prev28"><span
                                      class="nds-day">28</span></td>
                                  <td aria-disabled="true" data-id="prev-month-dayId29" aria-selected="false"
                                    tabindex="0" role="gridcell"
                                    class="day-val day nds-day nds-day_adjacent-month prev-month dayId-prev29"><span
                                      class="nds-day">29</span></td>
                                  <td aria-disabled="true" data-id="prev-month-dayId30" aria-selected="false"
                                    tabindex="0" role="gridcell"
                                    class="day-val day nds-day nds-day_adjacent-month prev-month dayId-prev30"><span
                                      class="nds-day">30</span></td>
                                  <td aria-disabled="true" data-id="dayId1" aria-selected="false" tabindex="0"
                                    role="gridcell" class="day-val day nds-day dayId1"><span class="nds-day">1</span>
                                  </td>
                                </tr>
                                <tr>
                                  <td aria-disabled="true" data-id="dayId2" aria-selected="false" tabindex="0"
                                    role="gridcell" class="day-val day nds-day dayId2"><span class="nds-day">2</span>
                                  </td>
                                  <td aria-disabled="true" data-id="dayId3" aria-selected="false" tabindex="0"
                                    role="gridcell" class="day-val day nds-day dayId3"><span class="nds-day">3</span>
                                  </td>
                                  <td aria-disabled="true" data-id="dayId4" aria-selected="false" tabindex="0"
                                    role="gridcell" class="day-val day nds-day dayId4 nds-is-today"><span
                                      class="nds-day">4</span></td>
                                  <td aria-disabled="true" data-id="dayId5" aria-selected="false" tabindex="0"
                                    role="gridcell" class="day-val day nds-day dayId5"><span class="nds-day">5</span>
                                  </td>
                                  <td aria-disabled="true" data-id="dayId6" aria-selected="false" tabindex="0"
                                    role="gridcell" class="day-val day nds-day dayId6"><span class="nds-day">6</span>
                                  </td>
                                  <td aria-disabled="true" data-id="dayId7" aria-selected="false" tabindex="0"
                                    role="gridcell" class="day-val day nds-day dayId7"><span class="nds-day">7</span>
                                  </td>
                                  <td aria-disabled="true" data-id="dayId8" aria-selected="false" tabindex="0"
                                    role="gridcell" class="day-val day nds-day dayId8"><span class="nds-day">8</span>
                                  </td>
                                </tr>
                                <tr>
                                  <td aria-disabled="true" data-id="dayId9" aria-selected="false" tabindex="0"
                                    role="gridcell" class="day-val day nds-day dayId9"><span class="nds-day">9</span>
                                  </td>
                                  <td aria-disabled="true" data-id="dayId10" aria-selected="false" tabindex="0"
                                    role="gridcell" class="day-val day nds-day dayId10"><span class="nds-day">10</span>
                                  </td>
                                  <td aria-disabled="true" data-id="dayId11" aria-selected="false" tabindex="0"
                                    role="gridcell" class="day-val day nds-day dayId11"><span class="nds-day">11</span>
                                  </td>
                                  <td aria-disabled="true" data-id="dayId12" aria-selected="false" tabindex="0"
                                    role="gridcell" class="day-val day nds-day dayId12"><span class="nds-day">12</span>
                                  </td>
                                  <td aria-disabled="true" data-id="dayId13" aria-selected="false" tabindex="0"
                                    role="gridcell" class="day-val day nds-day dayId13"><span class="nds-day">13</span>
                                  </td>
                                  <td aria-disabled="true" data-id="dayId14" aria-selected="false" tabindex="0"
                                    role="gridcell" class="day-val day nds-day dayId14"><span class="nds-day">14</span>
                                  </td>
                                  <td aria-disabled="true" data-id="dayId15" aria-selected="false" tabindex="0"
                                    role="gridcell" class="day-val day nds-day dayId15"><span class="nds-day">15</span>
                                  </td>
                                </tr>
                                <tr>
                                  <td aria-disabled="true" data-id="dayId16" aria-selected="false" tabindex="0"
                                    role="gridcell" class="day-val day nds-day dayId16"><span class="nds-day">16</span>
                                  </td>
                                  <td aria-disabled="true" data-id="dayId17" aria-selected="false" tabindex="0"
                                    role="gridcell" class="day-val day nds-day dayId17"><span class="nds-day">17</span>
                                  </td>
                                  <td aria-disabled="true" data-id="dayId18" aria-selected="false" tabindex="0"
                                    role="gridcell" class="day-val day nds-day dayId18"><span class="nds-day">18</span>
                                  </td>
                                  <td aria-disabled="true" data-id="dayId19" aria-selected="false" tabindex="0"
                                    role="gridcell" class="day-val day nds-day dayId19"><span class="nds-day">19</span>
                                  </td>
                                  <td aria-disabled="true" data-id="dayId20" aria-selected="false" tabindex="0"
                                    role="gridcell" class="day-val day nds-day dayId20"><span class="nds-day">20</span>
                                  </td>
                                  <td aria-disabled="true" data-id="dayId21" aria-selected="false" tabindex="0"
                                    role="gridcell" class="day-val day nds-day dayId21"><span class="nds-day">21</span>
                                  </td>
                                  <td aria-disabled="true" data-id="dayId22" aria-selected="false" tabindex="0"
                                    role="gridcell" class="day-val day nds-day dayId22"><span class="nds-day">22</span>
                                  </td>
                                </tr>
                                <tr>
                                  <td aria-disabled="true" data-id="dayId23" aria-selected="false" tabindex="0"
                                    role="gridcell" class="day-val day nds-day dayId23"><span class="nds-day">23</span>
                                  </td>
                                  <td aria-disabled="true" data-id="dayId24" aria-selected="false" tabindex="0"
                                    role="gridcell" class="day-val day nds-day dayId24"><span class="nds-day">24</span>
                                  </td>
                                  <td aria-disabled="true" data-id="dayId25" aria-selected="false" tabindex="0"
                                    role="gridcell" class="day-val day nds-day dayId25"><span class="nds-day">25</span>
                                  </td>
                                  <td aria-disabled="true" data-id="dayId26" aria-selected="false" tabindex="0"
                                    role="gridcell" class="day-val day nds-day dayId26"><span class="nds-day">26</span>
                                  </td>
                                  <td aria-disabled="true" data-id="dayId27" aria-selected="false" tabindex="0"
                                    role="gridcell" class="day-val day nds-day dayId27"><span class="nds-day">27</span>
                                  </td>
                                  <td aria-disabled="true" data-id="dayId28" aria-selected="false" tabindex="0"
                                    role="gridcell" class="day-val day nds-day dayId28"><span class="nds-day">28</span>
                                  </td>
                                  <td aria-disabled="true" data-id="dayId29" aria-selected="false" tabindex="0"
                                    role="gridcell" class="day-val day nds-day dayId29"><span class="nds-day">29</span>
                                  </td>
                                </tr>
                                <tr>
                                  <td aria-disabled="true" data-id="dayId30" aria-selected="false" tabindex="0"
                                    role="gridcell" class="day-val day nds-day dayId30"><span class="nds-day">30</span>
                                  </td>
                                  <td aria-disabled="true" data-id="dayId31" aria-selected="false" tabindex="0"
                                    role="gridcell" class="day-val day nds-day dayId31"><span class="nds-day">31</span>
                                  </td>
                                  <td aria-disabled="true" data-id="next-month-dayId1" aria-selected="false"
                                    tabindex="0" role="gridcell"
                                    class="day-val day nds-day nds-day_adjacent-month next-month dayId-next1"><span
                                      class="nds-day">1</span></td>
                                  <td aria-disabled="true" data-id="next-month-dayId2" aria-selected="false"
                                    tabindex="0" role="gridcell"
                                    class="day-val day nds-day nds-day_adjacent-month next-month dayId-next2"><span
                                      class="nds-day">2</span></td>
                                  <td aria-disabled="true" data-id="next-month-dayId3" aria-selected="false"
                                    tabindex="0" role="gridcell"
                                    class="day-val day nds-day nds-day_adjacent-month next-month dayId-next3"><span
                                      class="nds-day">3</span></td>
                                  <td aria-disabled="true" data-id="next-month-dayId4" aria-selected="false"
                                    tabindex="0" role="gridcell"
                                    class="day-val day nds-day nds-day_adjacent-month next-month dayId-next4"><span
                                      class="nds-day">4</span></td>
                                  <td aria-disabled="true" data-id="next-month-dayId5" aria-selected="false"
                                    tabindex="0" role="gridcell"
                                    class="day-val day nds-day nds-day_adjacent-month next-month dayId-next5"><span
                                      class="nds-day">5</span></td>
                                </tr>
                              </tbody>
                            </table><button data-id="current-date" tabindex="0" type="button"
                              class="nds-button nds-align_absolute-center nds-text-link currentDate">Today</button>
                          </div>
                        </div>
                        <div class="nds-has-error"><span
                            class="nds-form-element__help nds-form-element__help_text-transform__none">Required</span>
                        </div>
                      </div>
                    </div>
                  </fieldset>
                </div>
              </div>
            </c-date-picker>
          </div>
          <div class="nds-col nds-size_1-of-1 nds-medium-size_5-of-12 nds-large-size_1-of-2">
            <c-time-picker>
              <div class="nds-form-element nds-form-container">
                <div class="nds-form-element__control">
                  <div class="nds-combobox_container">
                    <div aria-expanded="false" aria-haspopup="listbox" role="combobox"
                      class="nds-combobox nds-dropdown-trigger nds-dropdown-trigger_click nds-combobox-picklist nds-timepicker">
                      <div role="none"
                        class="nds-combobox__form-element nds-input-has-icon nds-input-has-icon_right nds-form-element__control nds-form-element__control-animated-label">
                        <input autocomplete="off" id="time-input-13" aria-label="Date Time: Time" role="textbox"
                          type="text" name="time" required="" placeholder="time placeholder" aria-autocomplete="both"
                          class="nds-input nds-combobox__input nds-combobox__input-value">
                        <div data-label="true"
                          class="nds-form-element__label nds-align-middle nds-animated-label__ease-out">
                          <slot name="label"></slot>
                        </div><span
                          class="nds-icon_container nds-icon-utility-clock nds-input__icon nds-input__icon_right">
                          <c-icon><svg aria-hidden="true" class="nds-icon nds-icon-text-default nds-icon_x-small">
                              <use xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#clock"></use>
                            </svg><span class="nds-assistive-text">Clock Icon</span></c-icon>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </c-time-picker>
          </div>
        </div>
      </c-datetime-picker>
    </c-input>
    </slot>
  </c-omniscript-date-time>`)
      +
      withExample('Date with tooltip', 'Note: the tooltip is not visible here because JavaScript is used in the underlying component to ensure it is positioned correctly',
        `<c-omniscript-date-time class="nds-size_12-of-12 nds-medium-size_12-of-12">
        <c-input class="nds-container_fluid">
          <c-datetime-picker name="datetime-1">
            <div class="nds-grid nds-gutters nds-wrap">
              <div class="nds-col nds-size_1-of-1 nds-medium-size_7-of-12 nds-large-size_1-of-2">
                <c-date-picker>
                  <div class="via-nds datePickerHt">
                    <div class="nds-form nds-form_compound">
                      <fieldset class="nds-form-element nds-form-container">
                        <div class="nds-grid nds-gutters nds-size_1-of-1 nds-m-around_none">
                          <div class="nds-col nds-p-around_none">
                            <div class="nds-form-element nds-size_1-of-1 nds-dropdown-trigger nds-dropdown-trigger_click">
                              <div
                                class="nds-datepicker nds-form-element__control nds-input-has-icon nds-input-has-icon_right nds-form-element__control-animated-label">
                                <input type="text" aria-label="Date Time: Date" name="date" id="date-input-18"
                                  data-id="date-picker-nds-input" autocomplete="off" aria-invalid="false" class="nds-input">
                                <div data-label="true"
                                  class="nds-form-element__label nds-align-middle nds-animated-label__ease-out nds-date-label">
                                  <label aria-label="Date Time" for="date-input-18">Date Time</label>
                                  <c-tooltip data-field-level-help="" class="nds-tooltip__container"
                                    vloc_mg-tooltip_tooltip-host=""><span vloc_mg-tooltip_tooltip=""
                                      style="position: relative;">
                                      <c-button vloc_mg-tooltip_tooltip="" tabindex="0" aria-describedby="help-19"
                                        aria-disabled="true"><button type="button" label="utility:info"
                                          class="vlocity-btn nds-button nds-button_icon">
                                          <c-icon><svg aria-hidden="true" class="nds-button__icon nds-icon_xx-small">
                                              <use xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#info"></use>
                                            </svg><span class="nds-assistive-text"></span></c-icon><span
                                            aria-label="Date time tooltip" class="btnLabel"></span>
                                        </button></c-button><span vloc_mg-tooltip_tooltip="" role="tooltip" id="help-19"
                                        class="nds-popover nds-nubbin_bottom-left nds-popover_tooltip bottom-left tooltipSection nds-fall-into-ground"
                                        style="white-space: normal;">
                                        <div vloc_mg-tooltip_tooltip="" class="nds-popover__body">Date time tooltip</div>
                                      </span>
                                    </span></c-tooltip>
                                  <slot name="label">
                                    <slot slot="label" name="label">
                                      <slot slot="label" name="label"></slot>
                                    </slot>
                                  </slot>
                                </div><button data-id="datePickerBtn" title="Select Date" type="button"
                                  class="nds-button nds-button_icon nds-input__icon nds-input__icon_right Date">
                                  <c-icon class="Date"><svg aria-hidden="true"
                                      class="nds-icon nds-icon-text-default nds-icon_x-small">
                                      <use xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#event"></use>
                                    </svg><span class="nds-assistive-text"></span></c-icon><span
                                    class="nds-assistive-text">Select Date</span>
                                </button>
                              </div>
                              <div role="dialog" aria-hidden="false" aria-label="Date picker" data-id="date-picker-div"
                                class="calendar-div nds-datepicker nds-dropdown nds-dropdown_left posAbsolute">
                                <div class="nds-datepicker__filter nds-grid">
                                  <div class="nds-datepicker__filter_month nds-grid nds-grid_align-spread nds-grow">
                                    <div class="nds-align-middle"><button data-id="prevMonthBtnId" tabindex="0"
                                        title="Previous Month" type="button"
                                        class="nds-button nds-button_icon nds-button_icon-container prevMonth">
                                        <c-icon class="prevMonth"><svg aria-hidden="true"
                                            class="nds-icon nds-icon-text-default nds-icon_x-small">
                                            <use xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#left"></use>
                                          </svg><span class="nds-assistive-text"></span></c-icon><span
                                          class="nds-assistive-text">Previous Month</span>
                                      </button></div>
                                    <h2 aria-atomic="true" aria-live="assertive" data-id="selected_month" id="month-18"
                                      class="nds-align-middle">May</h2>
                                    <div class="nds-align-middle"><button data-id="nextMonthBtnId" tabindex="0"
                                        title="Next Month" type="button"
                                        class="nds-button nds-button_icon nds-button_icon-container nextMonth">
                                        <c-icon class="nextMonth"><svg aria-hidden="true"
                                            class="nds-icon nds-icon-text-default nds-icon_x-small">
                                            <use xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#right"></use>
                                          </svg><span class="nds-assistive-text"></span></c-icon><span
                                          class="nds-assistive-text">Next Month</span>
                                      </button></div>
                                  </div>
                                  <div class="nds-shrink-none"><label for="select-01-18" class="nds-assistive-text">Pick a
                                      year</label>
                                    <div class="nds-select_container"><select tabindex="0" data-id="select-01"
                                        id="select-01-18" class="nds-select">
                                        <option><span>1921</span></option>
                                        <option><span>1922</span></option>
                                        <option><span>1923</span></option>
                                        <option><span>1924</span></option>
                                        <option><span>1925</span></option>
                                        <option><span>1926</span></option>
                                        <option><span>1927</span></option>
                                        <option><span>1928</span></option>
                                        <option><span>1929</span></option>
                                        <option><span>1930</span></option>
                                        <option><span>1931</span></option>
                                        <option><span>1932</span></option>
                                        <option><span>1933</span></option>
                                        <option><span>1934</span></option>
                                        <option><span>1935</span></option>
                                        <option><span>1936</span></option>
                                        <option><span>1937</span></option>
                                        <option><span>1938</span></option>
                                        <option><span>1939</span></option>
                                        <option><span>1940</span></option>
                                        <option><span>1941</span></option>
                                        <option><span>1942</span></option>
                                        <option><span>1943</span></option>
                                        <option><span>1944</span></option>
                                        <option><span>1945</span></option>
                                        <option><span>1946</span></option>
                                        <option><span>1947</span></option>
                                        <option><span>1948</span></option>
                                        <option><span>1949</span></option>
                                        <option><span>1950</span></option>
                                        <option><span>1951</span></option>
                                        <option><span>1952</span></option>
                                        <option><span>1953</span></option>
                                        <option><span>1954</span></option>
                                        <option><span>1955</span></option>
                                        <option><span>1956</span></option>
                                        <option><span>1957</span></option>
                                        <option><span>1958</span></option>
                                        <option><span>1959</span></option>
                                        <option><span>1960</span></option>
                                        <option><span>1961</span></option>
                                        <option><span>1962</span></option>
                                        <option><span>1963</span></option>
                                        <option><span>1964</span></option>
                                        <option><span>1965</span></option>
                                        <option><span>1966</span></option>
                                        <option><span>1967</span></option>
                                        <option><span>1968</span></option>
                                        <option><span>1969</span></option>
                                        <option><span>1970</span></option>
                                        <option><span>1971</span></option>
                                        <option><span>1972</span></option>
                                        <option><span>1973</span></option>
                                        <option><span>1974</span></option>
                                        <option><span>1975</span></option>
                                        <option><span>1976</span></option>
                                        <option><span>1977</span></option>
                                        <option><span>1978</span></option>
                                        <option><span>1979</span></option>
                                        <option><span>1980</span></option>
                                        <option><span>1981</span></option>
                                        <option><span>1982</span></option>
                                        <option><span>1983</span></option>
                                        <option><span>1984</span></option>
                                        <option><span>1985</span></option>
                                        <option><span>1986</span></option>
                                        <option><span>1987</span></option>
                                        <option><span>1988</span></option>
                                        <option><span>1989</span></option>
                                        <option><span>1990</span></option>
                                        <option><span>1991</span></option>
                                        <option><span>1992</span></option>
                                        <option><span>1993</span></option>
                                        <option><span>1994</span></option>
                                        <option><span>1995</span></option>
                                        <option><span>1996</span></option>
                                        <option><span>1997</span></option>
                                        <option><span>1998</span></option>
                                        <option><span>1999</span></option>
                                        <option><span>2000</span></option>
                                        <option><span>2001</span></option>
                                        <option><span>2002</span></option>
                                        <option><span>2003</span></option>
                                        <option><span>2004</span></option>
                                        <option><span>2005</span></option>
                                        <option><span>2006</span></option>
                                        <option><span>2007</span></option>
                                        <option><span>2008</span></option>
                                        <option><span>2009</span></option>
                                        <option><span>2010</span></option>
                                        <option><span>2011</span></option>
                                        <option><span>2012</span></option>
                                        <option><span>2013</span></option>
                                        <option><span>2014</span></option>
                                        <option><span>2015</span></option>
                                        <option><span>2016</span></option>
                                        <option><span>2017</span></option>
                                        <option><span>2018</span></option>
                                        <option><span>2019</span></option>
                                        <option><span>2020</span></option>
                                        <option><span>2021</span></option>
                                        <option><span>2022</span></option>
                                        <option><span>2023</span></option>
                                        <option><span>2024</span></option>
                                        <option><span>2025</span></option>
                                        <option><span>2026</span></option>
                                        <option><span>2027</span></option>
                                        <option><span>2028</span></option>
                                        <option><span>2029</span></option>
                                        <option><span>2030</span></option>
                                        <option><span>2031</span></option>
                                        <option><span>2032</span></option>
                                        <option><span>2033</span></option>
                                        <option><span>2034</span></option>
                                        <option><span>2035</span></option>
                                        <option><span>2036</span></option>
                                        <option><span>2037</span></option>
                                        <option><span>2038</span></option>
                                        <option><span>2039</span></option>
                                        <option><span>2040</span></option>
                                        <option><span>2041</span></option>
                                        <option><span>2042</span></option>
                                        <option><span>2043</span></option>
                                        <option><span>2044</span></option>
                                        <option><span>2045</span></option>
                                        <option><span>2046</span></option>
                                        <option><span>2047</span></option>
                                        <option><span>2048</span></option>
                                        <option><span>2049</span></option>
                                        <option><span>2050</span></option>
                                        <option><span>2051</span></option>
                                        <option><span>2052</span></option>
                                        <option><span>2053</span></option>
                                        <option><span>2054</span></option>
                                        <option><span>2055</span></option>
                                        <option><span>2056</span></option>
                                        <option><span>2057</span></option>
                                        <option><span>2058</span></option>
                                        <option><span>2059</span></option>
                                        <option><span>2060</span></option>
                                        <option><span>2061</span></option>
                                        <option><span>2062</span></option>
                                        <option><span>2063</span></option>
                                        <option><span>2064</span></option>
                                        <option><span>2065</span></option>
                                        <option><span>2066</span></option>
                                        <option><span>2067</span></option>
                                        <option><span>2068</span></option>
                                        <option><span>2069</span></option>
                                        <option><span>2070</span></option>
                                        <option><span>2071</span></option>
                                        <option><span>2072</span></option>
                                        <option><span>2073</span></option>
                                        <option><span>2074</span></option>
                                        <option><span>2075</span></option>
                                        <option><span>2076</span></option>
                                        <option><span>2077</span></option>
                                        <option><span>2078</span></option>
                                        <option><span>2079</span></option>
                                        <option><span>2080</span></option>
                                        <option><span>2081</span></option>
                                        <option><span>2082</span></option>
                                        <option><span>2083</span></option>
                                        <option><span>2084</span></option>
                                        <option><span>2085</span></option>
                                        <option><span>2086</span></option>
                                        <option><span>2087</span></option>
                                        <option><span>2088</span></option>
                                        <option><span>2089</span></option>
                                        <option><span>2090</span></option>
                                        <option><span>2091</span></option>
                                        <option><span>2092</span></option>
                                        <option><span>2093</span></option>
                                        <option><span>2094</span></option>
                                        <option><span>2095</span></option>
                                        <option><span>2096</span></option>
                                        <option><span>2097</span></option>
                                        <option><span>2098</span></option>
                                        <option><span>2099</span></option>
                                        <option><span>2100</span></option>
                                        <option><span>2101</span></option>
                                        <option><span>2102</span></option>
                                        <option><span>2103</span></option>
                                        <option><span>2104</span></option>
                                        <option><span>2105</span></option>
                                        <option><span>2106</span></option>
                                        <option><span>2107</span></option>
                                        <option><span>2108</span></option>
                                        <option><span>2109</span></option>
                                        <option><span>2110</span></option>
                                        <option><span>2111</span></option>
                                        <option><span>2112</span></option>
                                        <option><span>2113</span></option>
                                        <option><span>2114</span></option>
                                        <option><span>2115</span></option>
                                        <option><span>2116</span></option>
                                        <option><span>2117</span></option>
                                        <option><span>2118</span></option>
                                        <option><span>2119</span></option>
                                        <option><span>2120</span></option>
                                        <option><span>2121</span></option>
                                      </select></div>
                                  </div>
                                </div>
                                <table aria-labelledby="month-18" aria-multiselectable="true" role="grid"
                                  class="nds-datepicker__month">
                                  <thead>
                                    <tr data-id="weekdays">
                                      <th data-id="Sun" tabindex="-1" scope="col" class="nds-disabled-text"><abbr
                                          title="Sun">Sun</abbr></th>
                                      <th data-id="Mon" tabindex="-1" scope="col" class="nds-disabled-text"><abbr
                                          title="Mon">Mon</abbr></th>
                                      <th data-id="Tue" tabindex="-1" scope="col" class="nds-disabled-text"><abbr
                                          title="Tue">Tue</abbr></th>
                                      <th data-id="Wed" tabindex="-1" scope="col" class="nds-disabled-text"><abbr
                                          title="Wed">Wed</abbr></th>
                                      <th data-id="Thu" tabindex="-1" scope="col" class="nds-disabled-text"><abbr
                                          title="Thu">Thu</abbr></th>
                                      <th data-id="Fri" tabindex="-1" scope="col" class="nds-disabled-text"><abbr
                                          title="Fri">Fri</abbr></th>
                                      <th data-id="Sat" tabindex="-1" scope="col" class="nds-disabled-text"><abbr
                                          title="Sat">Sat</abbr></th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td aria-disabled="true" data-id="prev-month-dayId25" aria-selected="false"
                                        tabindex="0" role="gridcell"
                                        class="day-val day nds-day nds-day_adjacent-month prev-month dayId-prev25"><span
                                          class="nds-day">25</span></td>
                                      <td aria-disabled="true" data-id="prev-month-dayId26" aria-selected="false"
                                        tabindex="0" role="gridcell"
                                        class="day-val day nds-day nds-day_adjacent-month prev-month dayId-prev26"><span
                                          class="nds-day">26</span></td>
                                      <td aria-disabled="true" data-id="prev-month-dayId27" aria-selected="false"
                                        tabindex="0" role="gridcell"
                                        class="day-val day nds-day nds-day_adjacent-month prev-month dayId-prev27"><span
                                          class="nds-day">27</span></td>
                                      <td aria-disabled="true" data-id="prev-month-dayId28" aria-selected="false"
                                        tabindex="0" role="gridcell"
                                        class="day-val day nds-day nds-day_adjacent-month prev-month dayId-prev28"><span
                                          class="nds-day">28</span></td>
                                      <td aria-disabled="true" data-id="prev-month-dayId29" aria-selected="false"
                                        tabindex="0" role="gridcell"
                                        class="day-val day nds-day nds-day_adjacent-month prev-month dayId-prev29"><span
                                          class="nds-day">29</span></td>
                                      <td aria-disabled="true" data-id="prev-month-dayId30" aria-selected="false"
                                        tabindex="0" role="gridcell"
                                        class="day-val day nds-day nds-day_adjacent-month prev-month dayId-prev30"><span
                                          class="nds-day">30</span></td>
                                      <td aria-disabled="true" data-id="dayId1" aria-selected="false" tabindex="0"
                                        role="gridcell" class="day-val day nds-day dayId1"><span class="nds-day">1</span>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td aria-disabled="true" data-id="dayId2" aria-selected="false" tabindex="0"
                                        role="gridcell" class="day-val day nds-day dayId2"><span class="nds-day">2</span>
                                      </td>
                                      <td aria-disabled="true" data-id="dayId3" aria-selected="false" tabindex="0"
                                        role="gridcell" class="day-val day nds-day dayId3"><span class="nds-day">3</span>
                                      </td>
                                      <td aria-disabled="true" data-id="dayId4" aria-selected="false" tabindex="0"
                                        role="gridcell" class="day-val day nds-day dayId4 nds-is-today"><span
                                          class="nds-day">4</span></td>
                                      <td aria-disabled="true" data-id="dayId5" aria-selected="false" tabindex="0"
                                        role="gridcell" class="day-val day nds-day dayId5"><span class="nds-day">5</span>
                                      </td>
                                      <td aria-disabled="true" data-id="dayId6" aria-selected="false" tabindex="0"
                                        role="gridcell" class="day-val day nds-day dayId6"><span class="nds-day">6</span>
                                      </td>
                                      <td aria-disabled="true" data-id="dayId7" aria-selected="false" tabindex="0"
                                        role="gridcell" class="day-val day nds-day dayId7"><span class="nds-day">7</span>
                                      </td>
                                      <td aria-disabled="true" data-id="dayId8" aria-selected="false" tabindex="0"
                                        role="gridcell" class="day-val day nds-day dayId8"><span class="nds-day">8</span>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td aria-disabled="true" data-id="dayId9" aria-selected="false" tabindex="0"
                                        role="gridcell" class="day-val day nds-day dayId9"><span class="nds-day">9</span>
                                      </td>
                                      <td aria-disabled="true" data-id="dayId10" aria-selected="false" tabindex="0"
                                        role="gridcell" class="day-val day nds-day dayId10"><span class="nds-day">10</span>
                                      </td>
                                      <td aria-disabled="true" data-id="dayId11" aria-selected="false" tabindex="0"
                                        role="gridcell" class="day-val day nds-day dayId11"><span class="nds-day">11</span>
                                      </td>
                                      <td aria-disabled="true" data-id="dayId12" aria-selected="false" tabindex="0"
                                        role="gridcell" class="day-val day nds-day dayId12"><span class="nds-day">12</span>
                                      </td>
                                      <td aria-disabled="true" data-id="dayId13" aria-selected="false" tabindex="0"
                                        role="gridcell" class="day-val day nds-day dayId13"><span class="nds-day">13</span>
                                      </td>
                                      <td aria-disabled="true" data-id="dayId14" aria-selected="false" tabindex="0"
                                        role="gridcell" class="day-val day nds-day dayId14"><span class="nds-day">14</span>
                                      </td>
                                      <td aria-disabled="true" data-id="dayId15" aria-selected="false" tabindex="0"
                                        role="gridcell" class="day-val day nds-day dayId15"><span class="nds-day">15</span>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td aria-disabled="true" data-id="dayId16" aria-selected="false" tabindex="0"
                                        role="gridcell" class="day-val day nds-day dayId16"><span class="nds-day">16</span>
                                      </td>
                                      <td aria-disabled="true" data-id="dayId17" aria-selected="false" tabindex="0"
                                        role="gridcell" class="day-val day nds-day dayId17"><span class="nds-day">17</span>
                                      </td>
                                      <td aria-disabled="true" data-id="dayId18" aria-selected="false" tabindex="0"
                                        role="gridcell" class="day-val day nds-day dayId18"><span class="nds-day">18</span>
                                      </td>
                                      <td aria-disabled="true" data-id="dayId19" aria-selected="false" tabindex="0"
                                        role="gridcell" class="day-val day nds-day dayId19"><span class="nds-day">19</span>
                                      </td>
                                      <td aria-disabled="true" data-id="dayId20" aria-selected="false" tabindex="0"
                                        role="gridcell" class="day-val day nds-day dayId20"><span class="nds-day">20</span>
                                      </td>
                                      <td aria-disabled="true" data-id="dayId21" aria-selected="false" tabindex="0"
                                        role="gridcell" class="day-val day nds-day dayId21"><span class="nds-day">21</span>
                                      </td>
                                      <td aria-disabled="true" data-id="dayId22" aria-selected="false" tabindex="0"
                                        role="gridcell" class="day-val day nds-day dayId22"><span class="nds-day">22</span>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td aria-disabled="true" data-id="dayId23" aria-selected="false" tabindex="0"
                                        role="gridcell" class="day-val day nds-day dayId23"><span class="nds-day">23</span>
                                      </td>
                                      <td aria-disabled="true" data-id="dayId24" aria-selected="false" tabindex="0"
                                        role="gridcell" class="day-val day nds-day dayId24"><span class="nds-day">24</span>
                                      </td>
                                      <td aria-disabled="true" data-id="dayId25" aria-selected="false" tabindex="0"
                                        role="gridcell" class="day-val day nds-day dayId25"><span class="nds-day">25</span>
                                      </td>
                                      <td aria-disabled="true" data-id="dayId26" aria-selected="false" tabindex="0"
                                        role="gridcell" class="day-val day nds-day dayId26"><span class="nds-day">26</span>
                                      </td>
                                      <td aria-disabled="true" data-id="dayId27" aria-selected="false" tabindex="0"
                                        role="gridcell" class="day-val day nds-day dayId27"><span class="nds-day">27</span>
                                      </td>
                                      <td aria-disabled="true" data-id="dayId28" aria-selected="false" tabindex="0"
                                        role="gridcell" class="day-val day nds-day dayId28"><span class="nds-day">28</span>
                                      </td>
                                      <td aria-disabled="true" data-id="dayId29" aria-selected="false" tabindex="0"
                                        role="gridcell" class="day-val day nds-day dayId29"><span class="nds-day">29</span>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td aria-disabled="true" data-id="dayId30" aria-selected="false" tabindex="0"
                                        role="gridcell" class="day-val day nds-day dayId30"><span class="nds-day">30</span>
                                      </td>
                                      <td aria-disabled="true" data-id="dayId31" aria-selected="false" tabindex="0"
                                        role="gridcell" class="day-val day nds-day dayId31"><span class="nds-day">31</span>
                                      </td>
                                      <td aria-disabled="true" data-id="next-month-dayId1" aria-selected="false"
                                        tabindex="0" role="gridcell"
                                        class="day-val day nds-day nds-day_adjacent-month next-month dayId-next1"><span
                                          class="nds-day">1</span></td>
                                      <td aria-disabled="true" data-id="next-month-dayId2" aria-selected="false"
                                        tabindex="0" role="gridcell"
                                        class="day-val day nds-day nds-day_adjacent-month next-month dayId-next2"><span
                                          class="nds-day">2</span></td>
                                      <td aria-disabled="true" data-id="next-month-dayId3" aria-selected="false"
                                        tabindex="0" role="gridcell"
                                        class="day-val day nds-day nds-day_adjacent-month next-month dayId-next3"><span
                                          class="nds-day">3</span></td>
                                      <td aria-disabled="true" data-id="next-month-dayId4" aria-selected="false"
                                        tabindex="0" role="gridcell"
                                        class="day-val day nds-day nds-day_adjacent-month next-month dayId-next4"><span
                                          class="nds-day">4</span></td>
                                      <td aria-disabled="true" data-id="next-month-dayId5" aria-selected="false"
                                        tabindex="0" role="gridcell"
                                        class="day-val day nds-day nds-day_adjacent-month next-month dayId-next5"><span
                                          class="nds-day">5</span></td>
                                    </tr>
                                  </tbody>
                                </table><button data-id="current-date" tabindex="0" type="button"
                                  class="nds-button nds-align_absolute-center nds-text-link currentDate">Today</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </fieldset>
                    </div>
                  </div>
                </c-date-picker>
              </div>
              <div class="nds-col nds-size_1-of-1 nds-medium-size_5-of-12 nds-large-size_1-of-2">
                <c-time-picker>
                  <div class="nds-form-element nds-form-container">
                    <div class="nds-form-element__control">
                      <div class="nds-combobox_container">
                        <div aria-expanded="false" aria-haspopup="listbox" role="combobox"
                          class="nds-combobox nds-dropdown-trigger nds-dropdown-trigger_click nds-combobox-picklist nds-timepicker">
                          <div role="none"
                            class="nds-combobox__form-element nds-input-has-icon nds-input-has-icon_right nds-form-element__control nds-form-element__control-animated-label">
                            <input autocomplete="off" id="time-input-23" aria-label="Date Time: Time" role="textbox"
                              type="text" name="time" aria-autocomplete="both"
                              class="nds-input nds-combobox__input nds-combobox__input-value">
                            <div data-label="true"
                              class="nds-form-element__label nds-align-middle nds-animated-label__ease-out">
                              <slot name="label"></slot>
                            </div><span
                              class="nds-icon_container nds-icon-utility-clock nds-input__icon nds-input__icon_right">
                              <c-icon><svg aria-hidden="true" class="nds-icon nds-icon-text-default nds-icon_x-small">
                                  <use xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#clock"></use>
                                </svg><span class="nds-assistive-text">Clock Icon</span></c-icon>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </c-time-picker>
              </div>
            </div>
          </c-datetime-picker>
        </c-input>
      </c-omniscript-date-time>`)
      +
      withExample('Date with error message', `<c-omniscript-date-time class="nds-size_12-of-12 nds-medium-size_12-of-12">
      <c-input class="nds-container_fluid">
        <c-datetime-picker name="datetime-3">
          <div class="nds-grid nds-gutters nds-wrap">
            <div class="nds-col nds-size_1-of-1 nds-medium-size_7-of-12 nds-large-size_1-of-2">
              <c-date-picker>
                <div class="via-nds datePickerHt">
                  <div class="nds-form nds-form_compound">
                    <fieldset class="nds-form-element nds-form-container">
                      <div class="nds-grid nds-gutters nds-size_1-of-1 nds-m-around_none">
                        <div class="nds-col nds-p-around_none">
                          <div
                            class="nds-form-element nds-size_1-of-1 nds-dropdown-trigger nds-dropdown-trigger_click nds-has-error">
                            <div
                              class="nds-datepicker nds-form-element__control nds-input-has-icon nds-input-has-icon_right nds-form-element__control-animated-label">
                              <input type="text" aria-label="Date Time: Date" name="date" id="date-input-36"
                                data-id="date-picker-nds-input" autocomplete="off" aria-invalid="true"
                                class="nds-input nds-not-empty nds-is-dirty">
                              <div data-label="true"
                                class="nds-form-element__label nds-align-middle nds-animated-label__ease-out nds-date-label">
                                <label aria-label="Date Time" for="date-input-36">Date Time</label>
                                <slot name="label">
                                  <slot slot="label" name="label">
                                    <slot slot="label" name="label"></slot>
                                  </slot>
                                </slot>
                              </div><button data-id="datePickerBtn" title="Select Date" type="button"
                                class="nds-button nds-button_icon nds-input__icon nds-input__icon_right Date">
                                <c-icon class="Date"><svg aria-hidden="true"
                                    class="nds-icon nds-icon-text-default nds-icon_x-small">
                                    <use
                                      xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#event">
                                    </use>
                                  </svg><span class="nds-assistive-text"></span></c-icon><span
                                  class="nds-assistive-text">Select Date</span>
                              </button>
                            </div>
                            <div role="dialog" aria-hidden="false" aria-label="Date picker" data-id="date-picker-div"
                              class="calendar-div nds-datepicker nds-dropdown nds-dropdown_left posAbsolute">
                              <div class="nds-datepicker__filter nds-grid">
                                <div class="nds-datepicker__filter_month nds-grid nds-grid_align-spread nds-grow">
                                  <div class="nds-align-middle"><button data-id="prevMonthBtnId" tabindex="0"
                                      title="Previous Month" type="button"
                                      class="nds-button nds-button_icon nds-button_icon-container prevMonth">
                                      <c-icon class="prevMonth"><svg aria-hidden="true"
                                          class="nds-icon nds-icon-text-default nds-icon_x-small">
                                          <use
                                            xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#left">
                                          </use>
                                        </svg><span class="nds-assistive-text"></span></c-icon><span
                                        class="nds-assistive-text">Previous Month</span>
                                    </button></div>
                                  <h2 aria-atomic="true" aria-live="assertive" data-id="selected_month" id="month-36"
                                    class="nds-align-middle">February</h2>
                                  <div class="nds-align-middle"><button data-id="nextMonthBtnId" tabindex="0"
                                      title="Next Month" type="button"
                                      class="nds-button nds-button_icon nds-button_icon-container nextMonth">
                                      <c-icon class="nextMonth"><svg aria-hidden="true"
                                          class="nds-icon nds-icon-text-default nds-icon_x-small">
                                          <use
                                            xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#right">
                                          </use>
                                        </svg><span class="nds-assistive-text"></span></c-icon><span
                                        class="nds-assistive-text">Next Month</span>
                                    </button></div>
                                </div>
                                <div class="nds-shrink-none"><label for="select-01-36" class="nds-assistive-text">Pick a
                                    year</label>
                                  <div class="nds-select_container"><select tabindex="0" data-id="select-01"
                                      id="select-01-36" class="nds-select">
                                      <option><span>1984</span></option>
                                      <option><span>1985</span></option>
                                      <option><span>1986</span></option>
                                      <option><span>1987</span></option>
                                      <option><span>1988</span></option>
                                      <option><span>1989</span></option>
                                      <option><span>1990</span></option>
                                      <option><span>1991</span></option>
                                      <option><span>1992</span></option>
                                      <option><span>1993</span></option>
                                      <option><span>1994</span></option>
                                      <option><span>1995</span></option>
                                      <option><span>1996</span></option>
                                      <option><span>1997</span></option>
                                      <option><span>1998</span></option>
                                      <option><span>1999</span></option>
                                      <option><span>2000</span></option>
                                      <option><span>2001</span></option>
                                      <option><span>2002</span></option>
                                      <option><span>2003</span></option>
                                      <option><span>2004</span></option>
                                      <option><span>2005</span></option>
                                      <option><span>2006</span></option>
                                      <option><span>2007</span></option>
                                      <option><span>2008</span></option>
                                      <option><span>2009</span></option>
                                      <option><span>2010</span></option>
                                      <option><span>2011</span></option>
                                      <option><span>2012</span></option>
                                      <option><span>2013</span></option>
                                      <option><span>2014</span></option>
                                      <option><span>2015</span></option>
                                      <option><span>2016</span></option>
                                      <option><span>2017</span></option>
                                      <option><span>2018</span></option>
                                      <option><span>2019</span></option>
                                      <option><span>2020</span></option>
                                      <option><span>2021</span></option>
                                      <option><span>2022</span></option>
                                      <option><span>2023</span></option>
                                      <option><span>2024</span></option>
                                      <option><span>2025</span></option>
                                      <option><span>2026</span></option>
                                      <option><span>2027</span></option>
                                      <option><span>2028</span></option>
                                      <option><span>2029</span></option>
                                      <option><span>2030</span></option>
                                      <option><span>2031</span></option>
                                      <option><span>2032</span></option>
                                      <option><span>2033</span></option>
                                      <option><span>2034</span></option>
                                      <option><span>2035</span></option>
                                      <option><span>2036</span></option>
                                      <option><span>2037</span></option>
                                      <option><span>2038</span></option>
                                      <option><span>2039</span></option>
                                      <option><span>2040</span></option>
                                      <option><span>2041</span></option>
                                      <option><span>2042</span></option>
                                      <option><span>2043</span></option>
                                      <option><span>2044</span></option>
                                      <option><span>2045</span></option>
                                      <option><span>2046</span></option>
                                      <option><span>2047</span></option>
                                      <option><span>2048</span></option>
                                      <option><span>2049</span></option>
                                      <option><span>2050</span></option>
                                      <option><span>2051</span></option>
                                      <option><span>2052</span></option>
                                      <option><span>2053</span></option>
                                      <option><span>2054</span></option>
                                      <option><span>2055</span></option>
                                      <option><span>2056</span></option>
                                      <option><span>2057</span></option>
                                      <option><span>2058</span></option>
                                      <option><span>2059</span></option>
                                      <option><span>2060</span></option>
                                      <option><span>2061</span></option>
                                      <option><span>2062</span></option>
                                      <option><span>2063</span></option>
                                      <option><span>2064</span></option>
                                      <option><span>2065</span></option>
                                      <option><span>2066</span></option>
                                      <option><span>2067</span></option>
                                      <option><span>2068</span></option>
                                      <option><span>2069</span></option>
                                      <option><span>2070</span></option>
                                      <option><span>2071</span></option>
                                      <option><span>2072</span></option>
                                      <option><span>2073</span></option>
                                      <option><span>2074</span></option>
                                      <option><span>2075</span></option>
                                      <option><span>2076</span></option>
                                      <option><span>2077</span></option>
                                      <option><span>2078</span></option>
                                      <option><span>2079</span></option>
                                      <option><span>2080</span></option>
                                      <option><span>2081</span></option>
                                      <option><span>2082</span></option>
                                      <option><span>2083</span></option>
                                      <option><span>2084</span></option>
                                      <option><span>2085</span></option>
                                      <option><span>2086</span></option>
                                    </select></div>
                                </div>
                              </div>
                              <table aria-labelledby="month-36" aria-multiselectable="true" role="grid"
                                class="nds-datepicker__month">
                                <thead>
                                  <tr data-id="weekdays">
                                    <th data-id="Sun" tabindex="-1" scope="col" class="nds-disabled-text"><abbr
                                        title="Sun">Sun</abbr></th>
                                    <th data-id="Mon" tabindex="-1" scope="col" class="nds-disabled-text"><abbr
                                        title="Mon">Mon</abbr></th>
                                    <th data-id="Tue" tabindex="-1" scope="col" class="nds-disabled-text"><abbr
                                        title="Tue">Tue</abbr></th>
                                    <th data-id="Wed" tabindex="-1" scope="col" class="nds-disabled-text"><abbr
                                        title="Wed">Wed</abbr></th>
                                    <th data-id="Thu" tabindex="-1" scope="col" class="nds-disabled-text"><abbr
                                        title="Thu">Thu</abbr></th>
                                    <th data-id="Fri" tabindex="-1" scope="col" class="nds-disabled-text"><abbr
                                        title="Fri">Fri</abbr></th>
                                    <th data-id="Sat" tabindex="-1" scope="col" class="nds-disabled-text"><abbr
                                        title="Sat">Sat</abbr></th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td aria-disabled="true" data-id="prev-month-dayId26" aria-selected="false"
                                      tabindex="0" role="gridcell"
                                      class="day-val day nds-day nds-day_adjacent-month prev-month dayId-prev26"><span
                                        class="nds-day">26</span></td>
                                    <td aria-disabled="true" data-id="prev-month-dayId27" aria-selected="false"
                                      tabindex="0" role="gridcell"
                                      class="day-val day nds-day nds-day_adjacent-month prev-month dayId-prev27"><span
                                        class="nds-day">27</span></td>
                                    <td aria-disabled="true" data-id="prev-month-dayId28" aria-selected="false"
                                      tabindex="0" role="gridcell"
                                      class="day-val day nds-day nds-day_adjacent-month prev-month dayId-prev28"><span
                                        class="nds-day">28</span></td>
                                    <td aria-disabled="true" data-id="prev-month-dayId29" aria-selected="false"
                                      tabindex="0" role="gridcell"
                                      class="day-val day nds-day nds-day_adjacent-month prev-month dayId-prev29"><span
                                        class="nds-day">29</span></td>
                                    <td aria-disabled="true" data-id="prev-month-dayId30" aria-selected="false"
                                      tabindex="0" role="gridcell"
                                      class="day-val day nds-day nds-day_adjacent-month prev-month dayId-prev30"><span
                                        class="nds-day">30</span></td>
                                    <td aria-disabled="true" data-id="prev-month-dayId31" aria-selected="false"
                                      tabindex="0" role="gridcell"
                                      class="day-val day nds-day nds-day_adjacent-month prev-month dayId-prev31"><span
                                        class="nds-day">31</span></td>
                                    <td aria-disabled="true" data-id="dayId1" aria-selected="false" tabindex="0"
                                      role="gridcell" class="day-val day nds-day dayId1"><span class="nds-day">1</span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td aria-disabled="true" data-id="dayId2" aria-selected="false" tabindex="0"
                                      role="gridcell" class="day-val day nds-day dayId2"><span class="nds-day">2</span>
                                    </td>
                                    <td aria-disabled="true" data-id="dayId3" aria-selected="false" tabindex="0"
                                      role="gridcell" class="day-val day nds-day dayId3 nds-is-selected"><span
                                        class="nds-day">3</span></td>
                                    <td aria-disabled="true" data-id="dayId4" aria-selected="false" tabindex="0"
                                      role="gridcell" class="day-val day nds-day dayId4"><span class="nds-day">4</span>
                                    </td>
                                    <td aria-disabled="true" data-id="dayId5" aria-selected="false" tabindex="0"
                                      role="gridcell" class="day-val day nds-day dayId5"><span class="nds-day">5</span>
                                    </td>
                                    <td aria-disabled="true" data-id="dayId6" aria-selected="false" tabindex="0"
                                      role="gridcell" class="day-val day nds-day dayId6"><span class="nds-day">6</span>
                                    </td>
                                    <td aria-disabled="true" data-id="dayId7" aria-selected="false" tabindex="0"
                                      role="gridcell" class="day-val day nds-day dayId7"><span class="nds-day">7</span>
                                    </td>
                                    <td aria-disabled="true" data-id="dayId8" aria-selected="false" tabindex="0"
                                      role="gridcell" class="day-val day nds-day dayId8"><span class="nds-day">8</span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td aria-disabled="true" data-id="dayId9" aria-selected="false" tabindex="0"
                                      role="gridcell" class="day-val day nds-day dayId9"><span class="nds-day">9</span>
                                    </td>
                                    <td aria-disabled="true" data-id="dayId10" aria-selected="false" tabindex="0"
                                      role="gridcell" class="day-val day nds-day dayId10"><span class="nds-day">10</span>
                                    </td>
                                    <td aria-disabled="true" data-id="dayId11" aria-selected="false" tabindex="0"
                                      role="gridcell" class="day-val day nds-day dayId11"><span class="nds-day">11</span>
                                    </td>
                                    <td aria-disabled="true" data-id="dayId12" aria-selected="false" tabindex="0"
                                      role="gridcell" class="day-val day nds-day dayId12"><span class="nds-day">12</span>
                                    </td>
                                    <td aria-disabled="true" data-id="dayId13" aria-selected="false" tabindex="0"
                                      role="gridcell" class="day-val day nds-day dayId13"><span class="nds-day">13</span>
                                    </td>
                                    <td aria-disabled="true" data-id="dayId14" aria-selected="false" tabindex="0"
                                      role="gridcell" class="day-val day nds-day dayId14"><span class="nds-day">14</span>
                                    </td>
                                    <td aria-disabled="true" data-id="dayId15" aria-selected="false" tabindex="0"
                                      role="gridcell" class="day-val day nds-day dayId15"><span class="nds-day">15</span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td aria-disabled="true" data-id="dayId16" aria-selected="false" tabindex="0"
                                      role="gridcell" class="day-val day nds-day dayId16"><span class="nds-day">16</span>
                                    </td>
                                    <td aria-disabled="true" data-id="dayId17" aria-selected="false" tabindex="0"
                                      role="gridcell" class="day-val day nds-day dayId17"><span class="nds-day">17</span>
                                    </td>
                                    <td aria-disabled="true" data-id="dayId18" aria-selected="false" tabindex="0"
                                      role="gridcell" class="day-val day nds-day dayId18"><span class="nds-day">18</span>
                                    </td>
                                    <td aria-disabled="true" data-id="dayId19" aria-selected="false" tabindex="0"
                                      role="gridcell" class="day-val day nds-day dayId19"><span class="nds-day">19</span>
                                    </td>
                                    <td aria-disabled="true" data-id="dayId20" aria-selected="false" tabindex="0"
                                      role="gridcell" class="day-val day nds-day dayId20"><span class="nds-day">20</span>
                                    </td>
                                    <td aria-disabled="true" data-id="dayId21" aria-selected="false" tabindex="0"
                                      role="gridcell" class="day-val day nds-day dayId21"><span class="nds-day">21</span>
                                    </td>
                                    <td aria-disabled="true" data-id="dayId22" aria-selected="false" tabindex="0"
                                      role="gridcell" class="day-val day nds-day dayId22"><span class="nds-day">22</span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td aria-disabled="true" data-id="dayId23" aria-selected="false" tabindex="0"
                                      role="gridcell" class="day-val day nds-day dayId23"><span class="nds-day">23</span>
                                    </td>
                                    <td aria-disabled="true" data-id="dayId24" aria-selected="false" tabindex="0"
                                      role="gridcell" class="day-val day nds-day dayId24"><span class="nds-day">24</span>
                                    </td>
                                    <td aria-disabled="true" data-id="dayId25" aria-selected="false" tabindex="0"
                                      role="gridcell" class="day-val day nds-day dayId25"><span class="nds-day">25</span>
                                    </td>
                                    <td aria-disabled="true" data-id="dayId26" aria-selected="false" tabindex="0"
                                      role="gridcell" class="day-val day nds-day dayId26"><span class="nds-day">26</span>
                                    </td>
                                    <td aria-disabled="true" data-id="dayId27" aria-selected="false" tabindex="0"
                                      role="gridcell" class="day-val day nds-day dayId27"><span class="nds-day">27</span>
                                    </td>
                                    <td aria-disabled="true" data-id="dayId28" aria-selected="false" tabindex="0"
                                      role="gridcell" class="day-val day nds-day dayId28"><span class="nds-day">28</span>
                                    </td>
                                    <td aria-disabled="true" data-id="next-month-dayId1" aria-selected="false"
                                      tabindex="0" role="gridcell"
                                      class="day-val day nds-day nds-day_adjacent-month next-month dayId-next1"><span
                                        class="nds-day">1</span></td>
                                  </tr>
                                  <tr>
                                    <td aria-disabled="true" data-id="next-month-dayId2" aria-selected="false"
                                      tabindex="0" role="gridcell"
                                      class="day-val day nds-day nds-day_adjacent-month next-month dayId-next2"><span
                                        class="nds-day">2</span></td>
                                    <td aria-disabled="true" data-id="next-month-dayId3" aria-selected="false"
                                      tabindex="0" role="gridcell"
                                      class="day-val day nds-day nds-day_adjacent-month next-month dayId-next3"><span
                                        class="nds-day">3</span></td>
                                    <td aria-disabled="true" data-id="next-month-dayId4" aria-selected="false"
                                      tabindex="0" role="gridcell"
                                      class="day-val day nds-day nds-day_adjacent-month next-month dayId-next4"><span
                                        class="nds-day">4</span></td>
                                    <td aria-disabled="true" data-id="next-month-dayId5" aria-selected="false"
                                      tabindex="0" role="gridcell"
                                      class="day-val day nds-day nds-day_adjacent-month next-month dayId-next5"><span
                                        class="nds-day">5</span></td>
                                    <td aria-disabled="true" data-id="next-month-dayId6" aria-selected="false"
                                      tabindex="0" role="gridcell"
                                      class="day-val day nds-day nds-day_adjacent-month next-month dayId-next6"><span
                                        class="nds-day">6</span></td>
                                    <td aria-disabled="true" data-id="next-month-dayId7" aria-selected="false"
                                      tabindex="0" role="gridcell"
                                      class="day-val day nds-day nds-day_adjacent-month next-month dayId-next7"><span
                                        class="nds-day">7</span></td>
                                    <td aria-disabled="true" data-id="next-month-dayId8" aria-selected="false"
                                      tabindex="0" role="gridcell"
                                      class="day-val day nds-day nds-day_adjacent-month next-month dayId-next8"><span
                                        class="nds-day">8</span></td>
                                  </tr>
                                </tbody>
                              </table><button data-id="current-date" tabindex="0" type="button"
                                class="nds-button nds-align_absolute-center nds-text-link currentDate">Today</button>
                            </div>
                          </div>
                          <div class="nds-has-error"><span
                              class="nds-form-element__help nds-form-element__help_text-transform__none">This date has
                              been disabled. Please select a date on or after 03-27-1984</span></div>
                        </div>
                      </div>
                    </fieldset>
                  </div>
                </div>
              </c-date-picker>
            </div>
            <div class="nds-col nds-size_1-of-1 nds-medium-size_5-of-12 nds-large-size_1-of-2">
              <c-time-picker>
                <div class="nds-form-element nds-form-container">
                  <div class="nds-form-element__control">
                    <div class="nds-combobox_container">
                      <div aria-expanded="false" aria-haspopup="listbox" role="combobox"
                        class="nds-combobox nds-dropdown-trigger nds-dropdown-trigger_click nds-combobox-picklist nds-timepicker">
                        <div role="none"
                          class="nds-combobox__form-element nds-input-has-icon nds-input-has-icon_right nds-form-element__control nds-form-element__control-animated-label">
                          <input autocomplete="off" id="time-input-38" aria-label="Date Time: Time" role="textbox"
                            type="text" name="time" aria-autocomplete="both"
                            class="nds-input nds-combobox__input nds-combobox__input-value nds-not-empty nds-is-dirty">
                          <div data-label="true"
                            class="nds-form-element__label nds-align-middle nds-animated-label__ease-out">
                            <slot name="label"></slot>
                          </div><span
                            class="nds-icon_container nds-icon-utility-clock nds-input__icon nds-input__icon_right">
                            <c-icon><svg aria-hidden="true" class="nds-icon nds-icon-text-default nds-icon_x-small">
                                <use
                                  xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#clock">
                                </use>
                              </svg><span class="nds-assistive-text">Clock Icon</span></c-icon>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </c-time-picker>
            </div>
          </div>
        </c-datetime-picker>
      </c-input>
  </c-omniscript-date-time>`)
      +
      withExample('Date with repeat', `<c-omniscript-date-time class="nds-size_12-of-12 nds-medium-size_12-of-12">
      <c-input class="nds-container_fluid nds-input-has-icon_right">
        <c-datetime-picker name="datetime-2">
          <div class="nds-grid nds-gutters nds-wrap">
            <div class="nds-col nds-size_1-of-1 nds-medium-size_7-of-12 nds-large-size_1-of-2">
              <c-date-picker>
                <div class="via-nds datePickerHt">
                  <div class="nds-form nds-form_compound">
                    <fieldset class="nds-form-element nds-form-container">
                      <div class="nds-grid nds-gutters nds-size_1-of-1 nds-m-around_none">
                        <div class="nds-col nds-p-around_none">
                          <div class="nds-form-element nds-size_1-of-1 nds-dropdown-trigger nds-dropdown-trigger_click">
                            <div
                              class="nds-datepicker nds-form-element__control nds-input-has-icon nds-input-has-icon_right nds-form-element__control-animated-label">
                              <input type="text" aria-label="Date Time: Date" name="date" id="date-input-28"
                                data-id="date-picker-nds-input" autocomplete="off" aria-invalid="false" class="nds-input">
                              <div data-label="true"
                                class="nds-form-element__label nds-align-middle nds-animated-label__ease-out nds-date-label">
                                <label aria-label="Date Time" for="date-input-28">Date Time</label>
                                <slot name="label">
                                  <slot slot="label" name="label">
                                    <slot slot="label" name="label"><span slot="label" role="group"
                                        class="omni-repeat-button-group nds-button-group nds-m-right_x-small nds-tooltip__container"
                                        style="bottom: 7px; right: 13px;"><button
                                          class="nds-button_reset nds-m-right_x-small vlocity-btn nds-button nds-button_icon">
                                          <c-icon><svg aria-hidden="true"
                                              class="slds-icon nds-button__icon nds-button__icon_small slds-icon-text-default slds-icon_xx-small">
                                              <use xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#add"></use>
                                            </svg><span class="nds-assistive-text">Repeat Date/Time</span></c-icon>
                                        </button>
                                        <button class="nds-button_reset nds-m-right_x-small vlocity-btn nds-button nds-button_icon"><c-icon><svg aria-hidden="true" class="slds-icon nds-button__icon nds-button__icon_small slds-icon-text-default slds-icon_xx-small"><use xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#close"></use></svg><span class="nds-assistive-text">Remove Date/Time</span></c-icon></button></span></slot>
                                  </slot>
                                </slot>
                              </div><button data-id="datePickerBtn" title="Select Date" type="button"
                                class="nds-button nds-button_icon nds-input__icon nds-input__icon_right Date">
                                <c-icon class="Date"><svg aria-hidden="true"
                                    class="nds-icon nds-icon-text-default nds-icon_x-small">
                                    <use xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#event"></use>
                                  </svg><span class="nds-assistive-text"></span></c-icon><span
                                  class="nds-assistive-text">Select Date</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </fieldset>
                  </div>
                </div>
              </c-date-picker>
            </div>
            <div class="nds-col nds-size_1-of-1 nds-medium-size_5-of-12 nds-large-size_1-of-2">
              <c-time-picker>
                <div class="nds-form-element nds-form-container">
                  <div class="nds-form-element__control">
                    <div class="nds-combobox_container">
                      <div aria-expanded="false" aria-haspopup="listbox" role="combobox"
                        class="nds-combobox nds-dropdown-trigger nds-dropdown-trigger_click nds-combobox-picklist nds-timepicker">
                        <div role="none"
                          class="nds-combobox__form-element nds-input-has-icon nds-input-has-icon_right nds-form-element__control nds-form-element__control-animated-label">
                          <input autocomplete="off" id="time-input-31" aria-label="Date Time: Time" role="textbox"
                            type="text" name="time" aria-autocomplete="both"
                            class="nds-input nds-combobox__input nds-combobox__input-value">
                          <div data-label="true"
                            class="nds-form-element__label nds-align-middle nds-animated-label__ease-out">
                            <slot name="label"></slot>
                          </div><span
                            class="nds-icon_container nds-icon-utility-clock nds-input__icon nds-input__icon_right">
                            <c-icon><svg aria-hidden="true" class="nds-icon nds-icon-text-default nds-icon_x-small">
                                <use xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#clock"></use>
                              </svg><span class="nds-assistive-text">Clock Icon</span></c-icon>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </c-time-picker>
            </div>
          </div>
        </c-datetime-picker>
      </c-input>
    </c-omniscript-date-time>`)
      +
      withExample('Readonly Date', `<c-omniscript-date-time class="nds-size_12-of-12 nds-medium-size_12-of-12 nds-read-only" aria-disabled="true">
      <c-input class="nds-container_fluid">
        <c-datetime-picker name="datetime-4">
          <div class="nds-grid nds-gutters nds-wrap">
            <div class="nds-col nds-size_1-of-1 nds-medium-size_7-of-12 nds-large-size_1-of-2">
              <c-date-picker>
                <div class="via-nds datePickerHt">
                  <div class="nds-form nds-form_compound">
                    <fieldset class="nds-form-element nds-form-container">
                      <div class="nds-grid nds-gutters nds-size_1-of-1 nds-m-around_none">
                        <div class="nds-col nds-p-around_none">
                          <div class="nds-form-element nds-size_1-of-1 nds-dropdown-trigger nds-dropdown-trigger_click">
                            <div
                              class="nds-datepicker nds-form-element__control nds-input-has-icon nds-input-has-icon_right nds-form-element__control-animated-label">
                              <input type="text" aria-label="Date Time: Date" name="date" id="date-input-43"
                                data-id="date-picker-nds-input" autocomplete="off" aria-invalid="false"
                                class="nds-input nds-not-empty nds-is-dirty" tabindex="-1">
                              <div data-label="true"
                                class="nds-form-element__label nds-align-middle nds-animated-label__ease-out nds-date-label">
                                <label aria-label="Date Time" for="date-input-43">Date Time</label>
                                <slot name="label">
                                  <slot slot="label" name="label">
                                    <slot slot="label" name="label"></slot>
                                  </slot>
                                </slot>
                              </div><button data-id="datePickerBtn" title="Select Date" type="button"
                                class="nds-button nds-button_icon nds-input__icon nds-input__icon_right Date"
                                tabindex="-1">
                                <c-icon class="Date"><svg aria-hidden="true"
                                    class="nds-icon nds-icon-text-default nds-icon_x-small">
                                    <use xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#event"></use>
                                  </svg><span class="nds-assistive-text"></span></c-icon><span
                                  class="nds-assistive-text">Select Date</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </fieldset>
                  </div>
                </div>
              </c-date-picker>
            </div>
            <div class="nds-col nds-size_1-of-1 nds-medium-size_5-of-12 nds-large-size_1-of-2">
              <c-time-picker>
                <div class="nds-form-element nds-form-container">
                  <div class="nds-form-element__control">
                    <div class="nds-combobox_container">
                      <div aria-expanded="false" aria-haspopup="listbox" role="combobox"
                        class="nds-combobox nds-dropdown-trigger nds-dropdown-trigger_click nds-combobox-picklist nds-timepicker">
                        <div role="none"
                          class="nds-combobox__form-element nds-input-has-icon nds-input-has-icon_right nds-form-element__control nds-form-element__control-animated-label">
                          <input autocomplete="off" id="time-input-45" aria-label="Date Time: Time" role="textbox"
                            type="text" name="time" aria-autocomplete="both"
                            class="nds-input nds-combobox__input nds-combobox__input-value nds-not-empty nds-is-dirty"
                            tabindex="-1">
                          <div data-label="true"
                            class="nds-form-element__label nds-align-middle nds-animated-label__ease-out">
                            <slot name="label"></slot>
                          </div><span
                            class="nds-icon_container nds-icon-utility-clock nds-input__icon nds-input__icon_right">
                            <c-icon><svg aria-hidden="true" class="nds-icon nds-icon-text-default nds-icon_x-small">
                                <use xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#clock"></use>
                              </svg><span class="nds-assistive-text">Clock Icon</span></c-icon>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </c-time-picker>
            </div>
          </div>
        </c-datetime-picker>
      </c-input>
    </c-omniscript-date-time>`);
  })
  .add('Disclosure', () => {
    return withExample('Disclosure', `<c-omniscript-disclosure class="nds-size_12-of-12 nds-medium-size_12-of-12">
    <div class="nds-size_1-of-1">
      <div class="nds-form-element nds-size_1-of-1 nds-m-bottom_large nds-p-around_small">
        <div class="nds-form-element__control">
          <div class="nds-disclosure">
            <div class="nds-form-element__label nds-m-bottom_x-small">Disclosure</div>
            <div class="nds-box">
              <c-omniscript-formatted-rich-text>
                <lightning-formatted-rich-text class="slds-rich-text-editor__output"><span>
                    <p>This is a disclosure</p>
                  </span></lightning-formatted-rich-text>
              </c-omniscript-formatted-rich-text>
            </div>
            <div class="nds-m-top_x-small">
              <c-input data-omni-input="">
                <div class="nds-form-element nds-form-container nds-relative-tooltip nds-wrap">
                  <div class="nds-form-element__control">
                    <div class="nds-checkbox"><input type="checkbox" id="input1-11" value=""
                        class="vlocity-input nds-input_mask"><label data-label="true" for="input1-11"
                        class="nds-checkbox__label"><span class="nds-checkbox_faux"></span><span
                          class="nds-form-element__label nds-form-element__control-help nds-checkbox-span">Checkbox</span></label>
                    </div>
                  </div>
                  <div class="nds-form-element__control"></div>
                </div>
              </c-input>
            </div>
          </div>
        </div>
      </div>
    </div>
  </c-omniscript-disclosure>`) +
      withExample('Disclosure with required', `<c-omniscript-disclosure class="nds-size_12-of-12 nds-medium-size_12-of-12">
      <div class="nds-size_1-of-1">
        <div class="nds-form-element nds-size_1-of-1 nds-m-bottom_large nds-p-around_small">
          <div class="nds-form-element__control">
            <div class="nds-disclosure">
              <div class="nds-form-element__label nds-m-bottom_x-small">Disclosure</div>
              <div class="nds-box">
                <c-omniscript-formatted-rich-text>
                  <lightning-formatted-rich-text class="slds-rich-text-editor__output"><span>
                      <p>This is a disclosure</p>
                    </span></lightning-formatted-rich-text>
                </c-omniscript-formatted-rich-text>
              </div>
              <div class="nds-m-top_x-small">
                <c-input data-omni-input="">
                  <div class="nds-form-element nds-form-container nds-relative-tooltip nds-wrap">
                    <div class="nds-form-element__control">
                      <div class="nds-checkbox"><abbr title="Required" class="nds-required">*</abbr><input required=""
                          type="checkbox" id="input3-15" checked class="vlocity-input nds-input_mask"><label
                          data-label="true" for="input3-15" class="nds-checkbox__label"><span
                            class="nds-checkbox_faux"></span><span
                            class="nds-form-element__label nds-form-element__control-help nds-checkbox-span">Checkbox</span></label>
                        <slot name="label"></slot>
                      </div>
                    </div>
                    <div class="nds-form-element__control"></div>
                  </div>
                </c-input>
              </div>
            </div>
          </div>
        </div>
      </div>
    </c-omniscript-disclosure>`) +
      withExample('Disclosure with error', `<c-omniscript-disclosure class="nds-size_12-of-12 nds-medium-size_12-of-12">
      <div class="nds-size_1-of-1">
        <div class="nds-form-element nds-size_1-of-1 nds-m-bottom_large nds-p-around_small">
          <div class="nds-form-element__control">
            <div class="nds-disclosure">
              <div class="nds-form-element__label nds-m-bottom_x-small">Disclosure</div>
              <div class="nds-box">
                <c-omniscript-formatted-rich-text>
                  <lightning-formatted-rich-text class="slds-rich-text-editor__output"><span>
                      <p>This is a disclosure</p>
                    </span></lightning-formatted-rich-text>
                </c-omniscript-formatted-rich-text>
              </div>
              <div class="nds-m-top_x-small">
                <c-input data-omni-input="">
                  <div class="nds-form-element nds-form-container nds-relative-tooltip nds-wrap nds-has-error">
                    <div class="nds-form-element__control">
                      <div class="nds-checkbox"><abbr title="Required" class="nds-required">*</abbr><input required=""
                          type="checkbox" id="input3-15" value="" class="vlocity-input nds-input_mask"
                          aria-describedby="errorMessageBlock-15"><label data-label="true" for="input3-15"
                          class="nds-checkbox__label"><span class="nds-checkbox_faux"></span><span
                            class="nds-form-element__label nds-form-element__control-help nds-checkbox-span">Checkbox</span></label>
                        <slot name="label"></slot>
                      </div>
                    </div>
                    <div class="nds-form-element__control"></div>
                    <div aria-live="assertive" id="errorMessageBlock-15" class="nds-form-element__help nds-size_1-of-1">
                      Required</div>
                  </div>
                </c-input>
              </div>
            </div>
          </div>
        </div>
      </div>
    </c-omniscript-disclosure>`);
  })
  .add('Edit Block (Inline)', () => {
    return withExample('Empty Edit Block', `<c-omniscript-edit-block-wrapper class="nds-grid nds-wrap nds-size_1-of-1 nds-is-relative nds-size_12-of-12">
    <div id="edit-block-item-count-label-15" aria-live="polite" class="slds-assistive-text nds-assistive-text">0 items</div>
    <slot aria-describedby="edit-block-item-count-label-15">
      <c-omniscript-edit-block class="nds-size_12-of-12">
        <div class="nds-element_text-font nds-editblock_inline nds-grid nds-grid_vertical nds-p-horizontal_small">
          <div class="nds-m-bottom_x-small">
            <label aria-label="Edit Block" aria-live="polite">Edit Block</label>
          </div>
          <div class="nds-size_1-of-1 nds-hide">
            <div class="nds-edit-block_longcards nds-m-bottom_medium">
              <form data-edit-action="edit" role="button" tabindex="0" class="nds-grid nds-cont-wrapper" aria-invalid="false">
                <span class="nds-edit-block_longcards-circle">
                  <span class="nds-icon_container nds-icon_container_circle">
                    <c-icon>
                      <svg aria-hidden="true" class="nds-icon nds-input__icon nds-icon-text-default nds-icon_large">
                        <use
                          xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#user">
                        </use>
                      </svg>
                      <span class="nds-assistive-text">icon</span>
                    </c-icon>
                  </span>
                </span>
                <div class="nds-edit-block_longcards-controls-container"></div>
                <div class="nds-grid nds-edit-block_inline-action-container">
                  <c-icon data-remove-button="" tabindex="0" role="button">
                    <svg aria-hidden="true" class="nds-icon nds-input__icon nds-editblock_delete nds-icon-text-default nds-icon_small">
                      <use xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#close">
                      </use>
                    </svg><span class="nds-assistive-text">Delete</span></c-icon>
                </div>
              </form>
            </div>
          </div>
          <div class="nds-size_1-of-1 nds-hide">
            <div class="nds-edit-block-edit__container nds-m-bottom_medium" style="z-index: 1;">
              <div class="nds-cont-wrapper">
                <header class="nds-size_1-of-1">
                  <h1 class="nds-text-heading_small nds-step_label nds-m-left_small">Edit Block</h1>
                </header>
                <slot class="nds-grid nds-wrap"></slot>
                <c-icon role="button" tabindex="0"><svg aria-hidden="true"
                    class="nds-icon nds-input__icon nds-editblock_close nds-m-right_x-small nds-icon-text-default nds-icon_small">
                    <use
                      xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#close">
                    </use>
                  </svg><span class="nds-assistive-text">close icon</span></c-icon>
                <div class="nds-grid nds-wrap nds-grid_align-center nds-p-horizontal_medium nds-m-top_medium"></div>
              </div>
            </div>
          </div>
          <div role="button" tabindex="0"
            class="nds-edit-block_longcards nds-edit-block_cards-add-card nds-grid nds-m-bottom_medium">
            <div class="nds-grid nds-cont-wrapper"><span class="nds-edit-block_longcards-circle"><span
                  class="nds-icon_container nds-icon_container_circle">
                  <c-icon><svg aria-hidden="true" class="nds-icon nds-input__icon nds-icon-text-default nds-icon_large">
                      <use
                        xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#user">
                      </use>
                    </svg><span class="nds-assistive-text">user icon</span></c-icon>
                </span></span>
              <div class="nds-edit-block_longcards-add-icon nds-grid nds-has-flexi-truncate nds-align_absolute-center">
                <c-icon class="nds-align_absolute-center"><svg aria-hidden="true"
                    class="nds-icon nds-button__icon nds-icon-text-default nds-icon_xx-small">
                    <use
                      xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#add">
                    </use>
                  </svg><span class="nds-assistive-text">add icon</span></c-icon><span>New</span>
              </div>
            </div>
          </div>
        </div>
      </c-omniscript-edit-block>
    </slot>
  </c-omniscript-edit-block-wrapper>`)
      +
      withExample('Edit Block (Edit Mode)', `<c-omniscript-edit-block-wrapper
      class="nds-grid nds-wrap nds-size_1-of-1 nds-is-relative nds-size_12-of-12">
      <slot name="label">
        <c-omniscript-edit-block-label  slot="label"
          class="nds-size_1-of-1 nds-m-vertical_small"></c-omniscript-edit-block-label>
      </slot>
      <div id="edit-block-item-count-label-15" aria-live="polite" class="slds-assistive-text nds-assistive-text">0 items
      </div>
      <slot aria-describedby="edit-block-item-count-label-15">
        <c-omniscript-edit-block  data-omni-key="EditBlock2"
          class="nds-size_12-of-12">
          <div class="nds-element_text-font nds-editblock_inline nds-grid nds-grid_vertical nds-p-horizontal_small">
            <div class="nds-m-bottom_x-small"><label aria-label="Edit Block" aria-live="polite">Edit Block</label></div>
            <div class="nds-size_1-of-1 nds-hide">
              <div class="nds-edit-block_longcards nds-m-bottom_medium">
                <form data-edit-action="edit" role="button" tabindex="0" class="nds-grid nds-cont-wrapper"><span
                    class="nds-edit-block_longcards-circle"><span class="nds-icon_container nds-icon_container_circle">
                      <c-icon><svg aria-hidden="true" class="nds-icon nds-input__icon nds-icon-text-default nds-icon_large">
                          <use
                            xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#user">
                          </use>
                        </svg><span class="nds-assistive-text">icon</span></c-icon>
                    </span></span>
                  <div class="nds-edit-block_longcards-controls-container">
                    <div class="nds-p-left_x-small">ABC</div>
                    <div class="nds-p-left_x-small">DEF</div>
                    <div class="nds-p-left_x-small">123</div>
                  </div>
                  <div class="nds-grid nds-edit-block_inline-action-container">
                    <c-icon data-remove-button="" tabindex="0" role="button"><svg aria-hidden="true"
                        class="nds-icon nds-input__icon nds-editblock_delete nds-icon-text-default nds-icon_small">
                        <use
                          xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#close">
                        </use>
                      </svg><span class="nds-assistive-text">Delete</span></c-icon>
                  </div>
                </form>
              </div>
            </div>
            <div class="nds-size_1-of-1 nds-show">
              <div class="nds-edit-block-edit__container nds-m-bottom_medium" style="z-index: 1;">
                <div class="nds-cont-wrapper">
                  <header class="nds-size_1-of-1">
                    <h1 class="nds-text-heading_small nds-step_label nds-m-left_small">Edit Block</h1>
                  </header>
                  <slot class="nds-grid nds-wrap">
                    <p>Fields go here</p>
                  </slot>
                  <c-icon role="button" tabindex="0"><svg aria-hidden="true"
                      class="nds-icon nds-input__icon nds-editblock_close nds-m-right_x-small nds-icon-text-default nds-icon_small">
                      <use
                        xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#close">
                      </use>
                    </svg><span class="nds-assistive-text">close icon</span></c-icon>
                  <div class="nds-grid nds-wrap nds-grid_align-center nds-p-horizontal_medium nds-m-top_medium"><button
                      class="nds-button nds-button_neutral nds-button_brand nds-custom_button">Save</button></div>
                </div>
              </div>
            </div>
          </div>
        </c-omniscript-edit-block>
      </slot>
    </c-omniscript-edit-block-wrapper>`)
      +
      withExample('Edit Block 1 item', `<c-omniscript-edit-block-wrapper
      class="nds-grid nds-wrap nds-size_1-of-1 nds-is-relative nds-size_12-of-12">
      <slot name="label">
        <c-omniscript-edit-block-label  slot="label"
          class="nds-size_1-of-1 nds-m-vertical_small"></c-omniscript-edit-block-label>
      </slot>
      <div id="edit-block-item-count-label-15" aria-live="polite" class="slds-assistive-text nds-assistive-text">1 item
      </div>
      <slot aria-describedby="edit-block-item-count-label-15">
        <c-omniscript-edit-block  data-omni-key="EditBlock2"
          class="nds-size_12-of-12">
          <div class="nds-element_text-font nds-editblock_inline nds-grid nds-grid_vertical nds-p-horizontal_small">
            <div class="nds-m-bottom_x-small"><label aria-label="Edit Block" aria-live="polite">Edit Block</label></div>
            <div class="nds-size_1-of-1 nds-show">
              <div class="nds-edit-block_longcards nds-m-bottom_medium">
                <form data-edit-action="edit" role="button" tabindex="0" class="nds-grid nds-cont-wrapper" aria-invalid="false"><span
                    class="nds-edit-block_longcards-circle"><span class="nds-icon_container nds-icon_container_circle">
                      <c-icon><svg aria-hidden="true" class="nds-icon nds-input__icon nds-icon-text-default nds-icon_large">
                          <use
                            xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#user">
                          </use>
                        </svg><span class="nds-assistive-text">icon</span></c-icon>
                    </span></span>
                  <div class="nds-edit-block_longcards-controls-container">
                    <div class="nds-p-left_x-small">Some Value</div>
                  </div>
                  <div class="nds-grid nds-edit-block_inline-action-container">
                    <c-icon data-remove-button="" tabindex="0" role="button"><svg aria-hidden="true"
                        class="nds-icon nds-input__icon nds-editblock_delete nds-icon-text-default nds-icon_small">
                        <use
                          xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#close">
                        </use>
                      </svg><span class="nds-assistive-text">Delete</span></c-icon>
                  </div>
                </form>
              </div>
            </div>
            <div class="nds-size_1-of-1 nds-hide">
              <div class="nds-edit-block-edit__container nds-m-bottom_medium" style="z-index: 1;">
                <div class="nds-cont-wrapper">
                  <header class="nds-size_1-of-1">
                    <h1 class="nds-text-heading_small nds-step_label nds-m-left_small">Edit Block</h1>
                  </header>
                  <slot class="nds-grid nds-wrap">
                    <c-omniscript-text  data-omni-key="Text1"
                      class="nds-size_12-of-12 nds-medium-size_12-of-12">
                      <slot>
                        <c-input data-omni-input="" class="nds-container_fluid">
                          <div class="nds-form-element nds-form-container">
                            <div class="nds-form-element__control nds-form-element__control-animated-label"><input
                                id="input1-25" maxlength="255" minlength="0" type="text" data-isnumber="false"
                                placeholder="" class="vlocity-input nds-input nds-input_mask nds-not-empty nds-is-dirty">
                              <div class="nds-form-element__label nds-align-middle nds-animated-label__ease-out"><label
                                  aria-label="Text" for="input1-25" data-label="true">Text</label>
                                <slot name="label"></slot>
                              </div>
                            </div>
                          </div>
                        </c-input>
                      </slot>
                    </c-omniscript-text>
                    <c-omniscript-text  data-omni-key="Text2"
                      class="nds-size_12-of-12 nds-medium-size_12-of-12">
                      <slot>
                        <c-input data-omni-input="" class="nds-container_fluid">
                          <div class="nds-form-element nds-form-container">
                            <div class="nds-form-element__control nds-form-element__control-animated-label"><input
                                id="input3-27" maxlength="255" minlength="0" type="text" data-isnumber="false"
                                placeholder="" class="vlocity-input nds-input nds-input_mask nds-not-empty nds-is-dirty">
                              <div class="nds-form-element__label nds-align-middle nds-animated-label__ease-out"><label
                                  aria-label="Text 2" for="input3-27" data-label="true">Text 2</label>
                                <slot name="label"></slot>
                              </div>
                            </div>
                          </div>
                        </c-input>
                      </slot>
                    </c-omniscript-text>
                    <c-omniscript-text  data-omni-key="Text3"
                      class="nds-size_12-of-12 nds-medium-size_12-of-12">
                      <slot>
                        <c-input data-omni-input="" class="nds-container_fluid">
                          <div class="nds-form-element nds-form-container">
                            <div class="nds-form-element__control nds-form-element__control-animated-label"><input
                                id="input5-29" maxlength="255" minlength="0" type="text" data-isnumber="false"
                                placeholder="" class="vlocity-input nds-input nds-input_mask nds-not-empty nds-is-dirty">
                              <div class="nds-form-element__label nds-align-middle nds-animated-label__ease-out"><label
                                  aria-label="Text 3" for="input5-29" data-label="true">Text 3</label>
                                <slot name="label"></slot>
                              </div>
                            </div>
                          </div>
                        </c-input>
                      </slot>
                    </c-omniscript-text>
                  </slot>
                  <c-icon role="button" tabindex="0"><svg aria-hidden="true"
                      class="nds-icon nds-input__icon nds-editblock_close nds-m-right_x-small nds-icon-text-default nds-icon_small">
                      <use
                        xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#close">
                      </use>
                    </svg><span class="nds-assistive-text">close icon</span></c-icon>
                  <div class="nds-grid nds-wrap nds-grid_align-center nds-p-horizontal_medium nds-m-top_medium"></div>
                </div>
              </div>
            </div>
            <div role="button" tabindex="0"
              class="nds-edit-block_longcards nds-edit-block_cards-add-card nds-grid nds-m-bottom_medium">
              <div class="nds-grid nds-cont-wrapper"><span class="nds-edit-block_longcards-circle"><span
                    class="nds-icon_container nds-icon_container_circle">
                    <c-icon><svg aria-hidden="true" class="nds-icon nds-input__icon nds-icon-text-default nds-icon_large">
                        <use
                          xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#user">
                        </use>
                      </svg><span class="nds-assistive-text">user icon</span></c-icon>
                  </span></span>
                <div class="nds-edit-block_longcards-add-icon nds-grid nds-has-flexi-truncate nds-align_absolute-center">
                  <c-icon class="nds-align_absolute-center"><svg aria-hidden="true"
                      class="nds-icon nds-button__icon nds-icon-text-default nds-icon_xx-small">
                      <use
                        xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#add">
                      </use>
                    </svg><span class="nds-assistive-text">add icon</span></c-icon><span>New</span>
                </div>
              </div>
            </div>
          </div>
        </c-omniscript-edit-block>
      </slot>
      <slot name="new">
        <c-omniscript-edit-block-new  slot="new">
        </c-omniscript-edit-block-new>
      </slot>
    </c-omniscript-edit-block-wrapper>`)
    +
      withExample('Edit Block item invalid', `<c-omniscript-edit-block-wrapper
      class="nds-grid nds-wrap nds-size_1-of-1 nds-is-relative nds-size_12-of-12">
      <slot name="label">
        <c-omniscript-edit-block-label  slot="label"
          class="nds-size_1-of-1 nds-m-vertical_small"></c-omniscript-edit-block-label>
      </slot>
      <div id="edit-block-item-count-label-15" aria-live="polite" class="slds-assistive-text nds-assistive-text">1 item
      </div>
      <slot aria-describedby="edit-block-item-count-label-15">
        <c-omniscript-edit-block  data-omni-key="EditBlock2"
          class="nds-size_12-of-12">
          <div class="nds-element_text-font nds-editblock_inline nds-grid nds-grid_vertical nds-p-horizontal_small">
            <div class="nds-m-bottom_x-small"><label aria-label="Edit Block" aria-live="polite">Edit Block</label></div>
            <div class="nds-size_1-of-1 nds-show">
              <div class="nds-edit-block_longcards nds-m-bottom_medium">
                <form data-edit-action="edit" role="button" tabindex="0" class="nds-grid nds-cont-wrapper" aria-invalid="true"><span
                    class="nds-edit-block_longcards-circle"><span class="nds-icon_container nds-icon_container_circle">
                      <c-icon><svg aria-hidden="true" class="nds-icon nds-input__icon nds-icon-text-default nds-icon_large">
                          <use
                            xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#user">
                          </use>
                        </svg><span class="nds-assistive-text">icon</span></c-icon>
                    </span></span>
                  <div class="nds-edit-block_longcards-controls-container">
                    <div class="nds-p-left_x-small">Some Value</div>
                  </div>
                  <div class="nds-grid nds-edit-block_inline-action-container">
                    <c-icon data-remove-button="" tabindex="0" role="button"><svg aria-hidden="true"
                        class="nds-icon nds-input__icon nds-editblock_delete nds-icon-text-default nds-icon_small">
                        <use
                          xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#close">
                        </use>
                      </svg><span class="nds-assistive-text">Delete</span></c-icon>
                  </div>
                </form>
              </div>
            </div>
            <div class="nds-size_1-of-1 nds-hide">
              <div class="nds-edit-block-edit__container nds-m-bottom_medium" style="z-index: 1;">
                <div class="nds-cont-wrapper">
                  <header class="nds-size_1-of-1">
                    <h1 class="nds-text-heading_small nds-step_label nds-m-left_small">Edit Block</h1>
                  </header>
                  <slot class="nds-grid nds-wrap">
                    <c-omniscript-text  data-omni-key="Text1"
                      class="nds-size_12-of-12 nds-medium-size_12-of-12">
                      <slot>
                        <c-input data-omni-input="" class="nds-container_fluid">
                          <div class="nds-form-element nds-form-container">
                            <div class="nds-form-element__control nds-form-element__control-animated-label"><input
                                id="input1-25" maxlength="255" minlength="0" type="text" data-isnumber="false"
                                placeholder="" class="vlocity-input nds-input nds-input_mask nds-not-empty nds-is-dirty">
                              <div class="nds-form-element__label nds-align-middle nds-animated-label__ease-out"><label
                                  aria-label="Text" for="input1-25" data-label="true">Text</label>
                                <slot name="label"></slot>
                              </div>
                            </div>
                          </div>
                        </c-input>
                      </slot>
                    </c-omniscript-text>
                    <c-omniscript-text  data-omni-key="Text2"
                      class="nds-size_12-of-12 nds-medium-size_12-of-12">
                      <slot>
                        <c-input data-omni-input="" class="nds-container_fluid">
                          <div class="nds-form-element nds-form-container">
                            <div class="nds-form-element__control nds-form-element__control-animated-label"><input
                                id="input3-27" maxlength="255" minlength="0" type="text" data-isnumber="false"
                                placeholder="" class="vlocity-input nds-input nds-input_mask nds-not-empty nds-is-dirty">
                              <div class="nds-form-element__label nds-align-middle nds-animated-label__ease-out"><label
                                  aria-label="Text 2" for="input3-27" data-label="true">Text 2</label>
                                <slot name="label"></slot>
                              </div>
                            </div>
                          </div>
                        </c-input>
                      </slot>
                    </c-omniscript-text>
                    <c-omniscript-text  data-omni-key="Text3"
                      class="nds-size_12-of-12 nds-medium-size_12-of-12">
                      <slot>
                        <c-input data-omni-input="" class="nds-container_fluid">
                          <div class="nds-form-element nds-form-container">
                            <div class="nds-form-element__control nds-form-element__control-animated-label"><input
                                id="input5-29" maxlength="255" minlength="0" type="text" data-isnumber="false"
                                placeholder="" class="vlocity-input nds-input nds-input_mask nds-not-empty nds-is-dirty">
                              <div class="nds-form-element__label nds-align-middle nds-animated-label__ease-out"><label
                                  aria-label="Text 3" for="input5-29" data-label="true">Text 3</label>
                                <slot name="label"></slot>
                              </div>
                            </div>
                          </div>
                        </c-input>
                      </slot>
                    </c-omniscript-text>
                  </slot>
                  <c-icon role="button" tabindex="0"><svg aria-hidden="true"
                      class="nds-icon nds-input__icon nds-editblock_close nds-m-right_x-small nds-icon-text-default nds-icon_small">
                      <use
                        xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#close">
                      </use>
                    </svg><span class="nds-assistive-text">close icon</span></c-icon>
                  <div class="nds-grid nds-wrap nds-grid_align-center nds-p-horizontal_medium nds-m-top_medium"></div>
                </div>
              </div>
            </div>
            <div role="button" tabindex="0"
              class="nds-edit-block_longcards nds-edit-block_cards-add-card nds-grid nds-m-bottom_medium">
              <div class="nds-grid nds-cont-wrapper"><span class="nds-edit-block_longcards-circle"><span
                    class="nds-icon_container nds-icon_container_circle">
                    <c-icon><svg aria-hidden="true" class="nds-icon nds-input__icon nds-icon-text-default nds-icon_large">
                        <use
                          xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#user">
                        </use>
                      </svg><span class="nds-assistive-text">user icon</span></c-icon>
                  </span></span>
                <div class="nds-edit-block_longcards-add-icon nds-grid nds-has-flexi-truncate nds-align_absolute-center">
                  <c-icon class="nds-align_absolute-center"><svg aria-hidden="true"
                      class="nds-icon nds-button__icon nds-icon-text-default nds-icon_xx-small">
                      <use
                        xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#add">
                      </use>
                    </svg><span class="nds-assistive-text">add icon</span></c-icon><span>New</span>
                </div>
              </div>
            </div>
          </div>
        </c-omniscript-edit-block>
      </slot>
      <slot name="new">
        <c-omniscript-edit-block-new  slot="new">
        </c-omniscript-edit-block-new>
      </slot>
    </c-omniscript-edit-block-wrapper>`);
  })
  .add('Edit Block (Table)', () => {
    return withExample('Empty Edit Block (3 columns)', `<c-omniscript-edit-block class="nds-size_12-of-12">
    <div class="nds-element_text-font nds-editblock_inline nds-grid nds-grid_vertical nds-p-horizontal_small">
      <div class="nds-m-bottom_x-small nds-grid nds-m-top_small">
        <label aria-label="Edit Block" aria-live="polite" class="nds-text-heading_small nds-text">Edit Block</label></div>
      <div class="nds-border_bottom nds-border_top nds-border_left nds-border_right nds-grid nds-p-vertical_xx-small">
        <div class="nds-size_11-of-12 nds-grid">
          <div class="nds-p-horizontal_small nds-truncate nds-size_4-of-12"><strong
              class="nds-text-title_caps nds-text-heading--label nds-p-vertical_x-small">Text 1</strong></div>
          <div class="nds-p-horizontal_small nds-truncate nds-size_4-of-12"><strong
              class="nds-text-title_caps nds-text-heading--label nds-p-vertical_x-small">Text 2</strong></div>
          <div class="nds-p-horizontal_small nds-truncate nds-size_4-of-12"><strong
              class="nds-text-title_caps nds-text-heading--label nds-p-vertical_x-small">Text 3</strong></div>
        </div>
        <div class="nds-size_1-of-12">&nbsp;</div>
      </div>
      <div class="nds-grid nds-m-top_small">
          <button type="button" tabindex="0"
          class="nds-button nds-m-top_x-small nds-text-align_center nds-editblock_add-button nds-col_bump-left">
          <c-icon class="nds-m-right_xx-small">
              <svg aria-hidden="true"
              class="nds-icon nds-input__icon nds-icon-text-default nds-icon_x-small">
              <use xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#add">
              </use>
            </svg><span class="nds-assistive-text">add icon</span></c-icon><span>New</span>
        </button></div>
    </div>
  </c-omniscript-edit-block>`)
      +
      withExampleAndHeight('Edit Block (Edit Mode)', `<c-omniscript-edit-block class="nds-size_12-of-12">
      <div class="nds-element_text-font nds-editblock_inline nds-grid nds-grid_vertical nds-p-horizontal_small">
        <div class="nds-m-bottom_x-small nds-grid nds-m-top_small"><label aria-label="Edit Block" aria-live="polite"
            class="nds-text-heading_small nds-text">Edit Block</label></div>
        <div class="nds-border_bottom nds-border_top nds-border_left nds-border_right nds-grid nds-p-vertical_xx-small">
          <div class="nds-size_11-of-12 nds-grid">
            <div class="nds-p-horizontal_small nds-truncate nds-size_4-of-12"><strong
                class="nds-text-title_caps nds-text-heading--label nds-p-vertical_x-small">Text 1</strong></div>
            <div class="nds-p-horizontal_small nds-truncate nds-size_4-of-12"><strong
                class="nds-text-title_caps nds-text-heading--label nds-p-vertical_x-small">Text 2</strong></div>
            <div class="nds-p-horizontal_small nds-truncate nds-size_4-of-12"><strong
                class="nds-text-title_caps nds-text-heading--label nds-p-vertical_x-small">Text 3</strong></div>
          </div>
          <div class="nds-size_1-of-12">&nbsp;</div>
        </div>
        <div class="nds-size_1-of-1 nds-show">
          <div class="nds-modal_custom">
            <section role="dialog" tabindex="-1" aria-modal="true" class="nds-modal nds-fade-in-open nds-modal_large">
              <div class="nds-modal__container">
                <header class="nds-modal__header">
                  <h1 class="nds-text-heading_small nds-step_label">Edit Block</h1>
                </header>
                <div class="nds-modal__content nds-p-around_medium">
                  <slot class="nds-grid nds-wrap nds-grid_pull-padded nds-p-left_small">
                    <p>Fields go here</p>
                  </slot>
                </div>
                <footer class="nds-modal__footer nds-button_text-font"><button type="button"
                    class="nds-button nds-button_neutral nds-size_2-of-12 nds-text-align_center">Cancel</button><button
                    type="button"
                    class="nds-button nds-button_neutral nds-button_brand nds-size_2-of-12 nds-text-align_center">Save</button>
                </footer>
              </div>
            </section>
            <div class="nds-backdrop nds-backdrop_open"></div>
          </div>
        </div>
      </div>
    </c-omniscript-edit-block>`, '300px')
      +
      withExample('Edit Block 1 item', `<c-omniscript-edit-block class="nds-size_12-of-12">
      <div class="nds-element_text-font nds-editblock_inline nds-grid nds-grid_vertical nds-p-horizontal_small">
        <div class="nds-m-bottom_x-small nds-grid nds-m-top_small"><label aria-label="Edit Block" aria-live="polite"
            class="nds-text-heading_small nds-text">Edit Block</label></div>
        <div class="nds-border_bottom nds-border_top nds-border_left nds-border_right nds-grid nds-p-vertical_xx-small">
          <div class="nds-size_11-of-12 nds-grid">
            <div class="nds-p-horizontal_small nds-truncate nds-size_4-of-12"><strong
                class="nds-text-title_caps nds-text-heading--label nds-p-vertical_x-small">Text</strong></div>
            <div class="nds-p-horizontal_small nds-truncate nds-size_4-of-12"><strong
                class="nds-text-title_caps nds-text-heading--label nds-p-vertical_x-small">Text 2</strong></div>
            <div class="nds-p-horizontal_small nds-truncate nds-size_4-of-12"><strong
                class="nds-text-title_caps nds-text-heading--label nds-p-vertical_x-small">Text 3</strong></div>
          </div>
          <div class="nds-size_1-of-12">&nbsp;</div>
        </div>
        <div data-is-selected="false"
          class="nds-grid nds-cont-wrapper nds-border_top nds-border_bottom nds-border_left nds-border_right nds-editblock-table-row">
          <div class="nds-size_12-of-12 nds-grid">
            <div class="nds-size_11-of-12 nds-grid">
              <div class="nds-p-around_small nds-truncate nds-size_4-of-12">ABC</div>
              <div class="nds-p-around_small nds-truncate nds-size_4-of-12">DEFHIJKLMN</div>
              <div class="nds-p-around_small nds-truncate nds-size_4-of-12">123</div>
            </div>
            <div class="nds-size_1-of-12 nds-grid nds-grid--vertical-align-center">
              <div
                class="nds-grid nds-grid_vertical nds-grid_vertical-align-end nds-col_bump-left nds-is-relative nds-m-right_x-small">
                <button data-action-button-menu="" aria-haspopup="true" tabindex="0" type="button"
                  class="nds-button nds-button--icon-border-filled">
                  <c-icon><svg aria-hidden="true" class="nds-icon nds-input__icon nds-icon-text-default nds-icon_x-small">
                      <use xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#down"></use>
                    </svg><span class="nds-assistive-text">down icon</span></c-icon>
                </button></div>
            </div>
          </div>
        </div>
        <div class="nds-border_bottom nds-size-1-of-1"></div>
        <div class="nds-grid nds-m-top_small"><button type="button" tabindex="0"
            class="nds-button nds-m-top_x-small nds-text-align_center nds-editblock_add-button nds-col_bump-left">
            <c-icon class="nds-m-right_xx-small"><svg aria-hidden="true"
                class="nds-icon nds-input__icon nds-icon-text-default nds-icon_x-small">
                <use xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#add"></use>
              </svg><span class="nds-assistive-text">add icon</span></c-icon><span>New</span>
          </button></div>
      </div>
    </c-omniscript-edit-block>`)
    +
      withExample('Edit Block item invalid', `<c-omniscript-edit-block class="nds-size_12-of-12">
      <div class="nds-element_text-font nds-editblock_inline nds-grid nds-grid_vertical nds-p-horizontal_small">
        <div class="nds-m-bottom_x-small nds-grid nds-m-top_small"><label aria-label="Edit Block" aria-live="polite"
            class="nds-text-heading_small nds-text">Edit Block</label></div>
        <div class="nds-border_bottom nds-border_top nds-border_left nds-border_right nds-grid nds-p-vertical_xx-small">
          <div class="nds-size_11-of-12 nds-grid">
            <div class="nds-p-horizontal_small nds-truncate nds-size_4-of-12"><strong
                class="nds-text-title_caps nds-text-heading--label nds-p-vertical_x-small">Text</strong></div>
            <div class="nds-p-horizontal_small nds-truncate nds-size_4-of-12"><strong
                class="nds-text-title_caps nds-text-heading--label nds-p-vertical_x-small">Text 2</strong></div>
            <div class="nds-p-horizontal_small nds-truncate nds-size_4-of-12"><strong
                class="nds-text-title_caps nds-text-heading--label nds-p-vertical_x-small">Text 3</strong></div>
          </div>
          <div class="nds-size_1-of-12">&nbsp;</div>
        </div>
        <div data-is-selected="false"
          class="nds-grid nds-cont-wrapper nds-border_top nds-border_bottom nds-border_left nds-border_right nds-editblock-table-row" aria-invalid="true">
          <div class="nds-size_12-of-12 nds-grid">
            <div class="nds-size_11-of-12 nds-grid">
              <div class="nds-p-around_small nds-truncate nds-size_4-of-12">ABC</div>
              <div class="nds-p-around_small nds-truncate nds-size_4-of-12">DEFHIJKLMN</div>
              <div class="nds-p-around_small nds-truncate nds-size_4-of-12">123</div>
            </div>
            <div class="nds-size_1-of-12 nds-grid nds-grid--vertical-align-center">
              <div
                class="nds-grid nds-grid_vertical nds-grid_vertical-align-end nds-col_bump-left nds-is-relative nds-m-right_x-small">
                <button data-action-button-menu="" aria-haspopup="true" tabindex="0" type="button"
                  class="nds-button nds-button--icon-border-filled">
                  <c-icon><svg aria-hidden="true" class="nds-icon nds-input__icon nds-icon-text-default nds-icon_x-small">
                      <use xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#down"></use>
                    </svg><span class="nds-assistive-text">down icon</span></c-icon>
                </button></div>
            </div>
          </div>
        </div>
        <div class="nds-border_bottom nds-size-1-of-1"></div>
        <div class="nds-grid nds-m-top_small"><button type="button" tabindex="0"
            class="nds-button nds-m-top_x-small nds-text-align_center nds-editblock_add-button nds-col_bump-left">
            <c-icon class="nds-m-right_xx-small"><svg aria-hidden="true"
                class="nds-icon nds-input__icon nds-icon-text-default nds-icon_x-small">
                <use xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#add"></use>
              </svg><span class="nds-assistive-text">add icon</span></c-icon><span>New</span>
          </button></div>
      </div>
    </c-omniscript-edit-block>`)
    +
    withExampleAndHeight('Edit Block Menu Open', `<c-omniscript-edit-block class="nds-size_12-of-12">
    <div class="nds-element_text-font nds-editblock_inline nds-grid nds-grid_vertical nds-p-horizontal_small">
      <div class="nds-m-bottom_x-small nds-grid nds-m-top_small"><label aria-label="Edit Block" aria-live="polite"
          class="nds-text-heading_small nds-text">Edit Block</label></div>
      <div class="nds-border_bottom nds-border_top nds-border_left nds-border_right nds-grid nds-p-vertical_xx-small">
        <div class="nds-size_11-of-12 nds-grid">
          <div class="nds-p-horizontal_small nds-truncate nds-size_4-of-12"><strong
              class="nds-text-title_caps nds-text-heading--label nds-p-vertical_x-small">Text</strong></div>
          <div class="nds-p-horizontal_small nds-truncate nds-size_4-of-12"><strong
              class="nds-text-title_caps nds-text-heading--label nds-p-vertical_x-small">Text 2</strong></div>
          <div class="nds-p-horizontal_small nds-truncate nds-size_4-of-12"><strong
              class="nds-text-title_caps nds-text-heading--label nds-p-vertical_x-small">Text 3</strong></div>
        </div>
        <div class="nds-size_1-of-12">&nbsp;</div>
      </div>
      <div data-is-selected="false"
        class="nds-grid nds-cont-wrapper nds-border_top nds-border_bottom nds-border_left nds-border_right nds-editblock-table-row">
        <div class="nds-size_12-of-12 nds-grid">
          <div class="nds-size_11-of-12 nds-grid">
            <div class="nds-p-around_small nds-truncate nds-size_4-of-12">ABC</div>
            <div class="nds-p-around_small nds-truncate nds-size_4-of-12">DEFHIJKLMN</div>
            <div class="nds-p-around_small nds-truncate nds-size_4-of-12">123</div>
          </div>
          <div class="nds-size_1-of-12 nds-grid nds-grid--vertical-align-center">
            <div
              class="nds-grid nds-grid_vertical nds-grid_vertical-align-end nds-col_bump-left nds-is-relative nds-m-right_x-small">
              <button data-action-button-menu="" aria-haspopup="true" tabindex="0" type="button"
                class="nds-button nds-button--icon-border-filled">
                <c-icon><svg aria-hidden="true"
                    class="nds-icon nds-input__icon nds-icon-text-default nds-icon_x-small">
                    <use xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#down"></use>
                  </svg><span class="nds-assistive-text">down icon</span></c-icon>
              </button>
              <div class="nds-dropdown nds-dropdown_right" style="top: 100%;">
                <ul role="menu" class="nds-dropdown__list">
                  <li role="presentation" class="nds-dropdown__item"><a href="javascript:void(0);" role="menuitem"
                      tabindex="0"><span class="nds-truncate">Edit</span></a></li>
                  <li role="presentation" class="nds-dropdown__item"><a href="javascript:void(0);" role="menuitem"
                      tabindex="0"><span class="nds-truncate">Delete</span></a></li>
                </ul>
              </div>
              <div class="nds-is-absolute" style="width: 1000vh; height: 1000vh; left: -200vw; top: -200vh;"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="nds-border_bottom nds-size-1-of-1"></div>
      <div class="nds-grid nds-m-top_small"><button type="button" tabindex="0"
          class="nds-button nds-m-top_x-small nds-text-align_center nds-editblock_add-button nds-col_bump-left">
          <c-icon class="nds-m-right_xx-small"><svg aria-hidden="true"
              class="nds-icon nds-input__icon nds-icon-text-default nds-icon_x-small">
              <use xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#add"></use>
            </svg><span class="nds-assistive-text">add icon</span></c-icon><span>New</span>
        </button></div>
    </div>
  </c-omniscript-edit-block>`, '250px');
  })
  .add('Edit Block (Financial statement)', () => {
    return withExample('Empty Edit Block (3 columns)', `<c-omniscript-edit-block data-omni-key="EditBlock2" class="nds-size_12-of-12">
    <div class="nds-element_text-font nds-editblock_inline nds-grid nds-grid_vertical nds-p-horizontal_small">
      <div class="nds-m-bottom_x-small nds-grid"><label aria-label="Edit Block" aria-live="polite"
          class="nds-text-heading_small nds-text">Edit Block</label></div>
      <div class="nds-border_bottom nds-border_top nds-grid nds-m-bottom_small">
        <div class="nds-size_11-of-12 nds-grid">
          <div class="nds-p-horizontal_small nds-truncate nds-size_4-of-12"><strong>Text</strong></div>
          <div class="nds-p-horizontal_small nds-truncate nds-size_4-of-12"><strong>Text 2</strong></div>
          <div class="nds-p-horizontal_small nds-truncate nds-size_4-of-12"><strong>Text 3</strong></div>
        </div>
        <div class="nds-size_1-of-12">&nbsp;</div>
      </div>
      <div class="nds-size_1-of-1 nds-hide">
        <div class="nds-grid">
          <div class="nds-size_11-of-12 nds-grid">
            <slot class="nds-m-bottom_medium"></slot>
          </div>
          <div class="nds-size_1-of-12 nds-m-top_medium nds-grid nds-grid_align-center"></div>
        </div>
      </div>
      <div class="nds-grid">
        <div class="nds-size_11-of-12 nds-grid">&nbsp;</div>
        <div class="nds-size_1-of-12 nds-p-horizontal_small nds-grid nds-grid_align-center">
          <c-icon role="button" tabindex="0" class="nds-m-top_large" style="cursor: pointer;"><svg aria-hidden="true"
              class="nds-icon nds-button__icon nds-icon-text-default nds-icon_xx-small">
              <use xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#add"></use>
            </svg><span class="nds-assistive-text">add icon</span></c-icon>
        </div>
      </div>
    </div>
  </c-omniscript-edit-block>`)
      +
      withExample('Edit Block (Edit Mode)', `<c-omniscript-edit-block data-omni-key="EditBlock2" class="nds-size_12-of-12">
      <div class="nds-element_text-font nds-editblock_inline nds-grid nds-grid_vertical nds-p-horizontal_small">
        <div class="nds-m-bottom_x-small nds-grid"><label aria-label="Edit Block" aria-live="polite"
            class="nds-text-heading_small nds-text">Edit Block</label></div>
        <div class="nds-border_bottom nds-border_top nds-grid nds-m-bottom_small">
          <div class="nds-size_11-of-12 nds-grid">
            <div class="nds-p-horizontal_small nds-truncate nds-size_4-of-12"><strong>Text</strong></div>
            <div class="nds-p-horizontal_small nds-truncate nds-size_4-of-12"><strong>Text 2</strong></div>
            <div class="nds-p-horizontal_small nds-truncate nds-size_4-of-12"><strong>Text 3</strong></div>
          </div>
          <div class="nds-size_1-of-12">&nbsp;</div>
        </div>
        <div class="nds-size_1-of-1 nds-show">
          <div class="nds-grid">
            <div class="nds-size_11-of-12 nds-grid">
              <slot class="nds-m-bottom_medium">
                <p>Fields are here</p>
              </slot>
            </div>
            <div class="nds-size_1-of-12 nds-m-top_medium nds-grid nds-grid_align-center">
              <c-icon role="button" tabindex="0" style="cursor: pointer;"><svg aria-hidden="true"
                  class="nds-icon nds-button__icon nds-icon-text-default nds-icon_xx-small">
                  <use xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#check"></use>
                </svg><span class="nds-assistive-text">save check icon</span></c-icon>
              <c-icon role="button" tabindex="0" class="nds-m-left_medium" style="cursor: pointer;"><svg aria-hidden="true"
                  class="nds-icon nds-button__icon nds-icon-text-default nds-icon_xx-small">
                  <use xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                </svg><span class="nds-assistive-text">close icon</span></c-icon>
            </div>
          </div>
        </div>
      </div>
    </c-omniscript-edit-block>`)
      +
      withExample('Edit Block 1 item', `<c-omniscript-edit-block class="nds-size_12-of-12">
      <div class="nds-element_text-font nds-editblock_inline nds-grid nds-grid_vertical nds-p-horizontal_small">
        <div class="nds-m-bottom_x-small nds-grid"><label aria-label="Edit Block" aria-live="polite"
            class="nds-text-heading_small nds-text">Edit Block</label></div>
        <div class="nds-border_bottom nds-border_top nds-grid nds-m-bottom_small">
          <div class="nds-size_11-of-12 nds-grid">
            <div class="nds-p-horizontal_small nds-truncate nds-size_4-of-12"><strong>Text</strong></div>
            <div class="nds-p-horizontal_small nds-truncate nds-size_4-of-12"><strong>Text 2</strong></div>
            <div class="nds-p-horizontal_small nds-truncate nds-size_4-of-12"><strong>Text 3</strong></div>
          </div>
          <div class="nds-size_1-of-12">&nbsp;</div>
        </div>
        <form class="nds-grid nds-cont-wrapper nds-edit-block-fs-row" aria-invalid="false">
          <div class="nds-size_12-of-12 nds-grid">
            <div role="button" tabindex="0" class="nds-size_11-of-12 nds-grid" style="cursor: pointer;">
              <div class="nds-p-around_small nds-truncate nds-size_4-of-12">abc</div>
              <div class="nds-p-around_small nds-truncate nds-size_4-of-12">defhigjklm</div>
              <div class="nds-p-around_small nds-truncate nds-size_4-of-12">123</div>
            </div>
            <div class="nds-size_1-of-12">
              <div class="nds-edit-block_inline-action-container nds-p-around_small nds-grid nds-grid_align-center">
                <c-icon data-remove-button="" role="button" tabindex="0" style="cursor: pointer;"><svg aria-hidden="true"
                    class="nds-icon nds-input__icon nds-editblock_delete nds-icon-text-default nds-icon_x-small">
                    <use xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#dash"></use>
                  </svg><span class="nds-assistive-text">delete icon</span></c-icon>
              </div>
            </div>
          </div>
        </form>
        <div class="nds-border_bottom nds-p-top_small nds-size_12-of-12"></div>
        <div class="nds-grid">
          <div class="nds-size_11-of-12 nds-grid">&nbsp;</div>
          <div class="nds-size_1-of-12 nds-p-horizontal_small nds-grid nds-grid_align-center">
            <c-icon role="button" tabindex="0" class="nds-m-top_large" style="cursor: pointer;"><svg aria-hidden="true"
                class="nds-icon nds-button__icon nds-icon-text-default nds-icon_xx-small">
                <use xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#add"></use>
              </svg><span class="nds-assistive-text">add icon</span></c-icon>
          </div>
        </div>
      </div>
    </c-omniscript-edit-block>`)
    +
      withExample('Edit Block item invalid', `<c-omniscript-edit-block class="nds-size_12-of-12">
      <div class="nds-element_text-font nds-editblock_inline nds-grid nds-grid_vertical nds-p-horizontal_small">
        <div class="nds-m-bottom_x-small nds-grid"><label aria-label="Edit Block" aria-live="polite"
            class="nds-text-heading_small nds-text">Edit Block</label></div>
        <div class="nds-border_bottom nds-border_top nds-grid nds-m-bottom_small">
          <div class="nds-size_11-of-12 nds-grid">
            <div class="nds-p-horizontal_small nds-truncate nds-size_4-of-12"><strong>Text</strong></div>
            <div class="nds-p-horizontal_small nds-truncate nds-size_4-of-12"><strong>Text 2</strong></div>
            <div class="nds-p-horizontal_small nds-truncate nds-size_4-of-12"><strong>Text 3</strong></div>
          </div>
          <div class="nds-size_1-of-12">&nbsp;</div>
        </div>
        <form class="nds-grid nds-cont-wrapper nds-edit-block-fs-row" aria-invalid="true">
          <div class="nds-size_12-of-12 nds-grid">
            <div role="button" tabindex="0" class="nds-size_11-of-12 nds-grid" style="cursor: pointer;">
              <div class="nds-p-around_small nds-truncate nds-size_4-of-12">abc</div>
              <div class="nds-p-around_small nds-truncate nds-size_4-of-12">defhigjklm</div>
              <div class="nds-p-around_small nds-truncate nds-size_4-of-12">123</div>
            </div>
            <div class="nds-size_1-of-12">
              <div class="nds-edit-block_inline-action-container nds-p-around_small nds-grid nds-grid_align-center">
                <c-icon data-remove-button="" role="button" tabindex="0" style="cursor: pointer;"><svg aria-hidden="true"
                    class="nds-icon nds-input__icon nds-editblock_delete nds-icon-text-default nds-icon_x-small">
                    <use xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#dash"></use>
                  </svg><span class="nds-assistive-text">delete icon</span></c-icon>
              </div>
            </div>
          </div>
        </form>
        <div class="nds-border_bottom nds-p-top_small nds-size_12-of-12"></div>
        <div class="nds-grid">
          <div class="nds-size_11-of-12 nds-grid">&nbsp;</div>
          <div class="nds-size_1-of-12 nds-p-horizontal_small nds-grid nds-grid_align-center">
            <c-icon role="button" tabindex="0" class="nds-m-top_large" style="cursor: pointer;"><svg aria-hidden="true"
                class="nds-icon nds-button__icon nds-icon-text-default nds-icon_xx-small">
                <use xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#add"></use>
              </svg><span class="nds-assistive-text">add icon</span></c-icon>
          </div>
        </div>
      </div>
    </c-omniscript-edit-block>`);
  })
  .add('Edit Block (Cards)', () => {
    return withExample('Empty Edit Block', `<c-omniscript-edit-block-wrapper class="nds-grid nds-wrap nds-size_1-of-1 nds-is-relative nds-size_12-of-12">
    <slot name="label">
      <c-omniscript-edit-block-label slot="label" class="nds-size_1-of-1 nds-m-vertical_small">
        <div class="nds-element_text-font">
          <label aria-label="Edit Block" aria-live="polite" class="nds-m-horizontal_small nds-text-heading_small nds-text">Edit Block</label>
        </div>
      </c-omniscript-edit-block-label>
    </slot>
    <div id="edit-block-item-count-label-10" aria-live="polite" class="slds-assistive-text nds-assistive-text">0 items
    </div>
    <slot aria-describedby="edit-block-item-count-label-10">
      <c-omniscript-edit-block class="nds-size_12-of-12 nds-large-size_3-of-12 nds-medium-size_6-of-12 nds-size_0-of-12">
        <div class="nds-p-horizontal_small">
          <div class="nds-grid nds-wrap nds-element_text-font">
            <div class="nds-size_1-of-1 nds-hide">
              <div data-edit-action="default" role="button" tabindex="0"
                class="nds-box nds-box_x-small nds-grid nds-grid_vertical nds-grid_vertical-align-center nds-is-relative nds-size_12-of-12 nds-m-right_medium nds-m-bottom_medium omni-edit-block-card nds-edit-block_shortcards">
                <div class="nds-dropdown-trigger nds-dropdown-trigger_click nds-is-open nds-col_bump-left"><button
                    type="button" aria-haspopup="true" title="Show More"
                    class="nds-button nds-button_icon-border-filled nds-editblock_action-button nds-element_text-font">
                    <c-icon><svg aria-hidden="true"
                        class="nds-icon nds-input__icon nds-icon-text-default nds-icon_x-small">
                        <use
                          xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#chevrondown">
                        </use>
                      </svg><span class="nds-assistive-text">down icon</span></c-icon>
                  </button></div>
                <div class="nds-edit-block_shortcards-circle"><span
                    class="nds-icon_container nds-icon_container_circle slds-current-color omni-icon-circle"
                    style="color: rgb(21, 100, 191);">
                    <c-icon><svg aria-hidden="true" class="nds-icon nds-input__icon nds-icon-text-default nds-icon_large">
                        <use
                          xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#user">
                        </use>
                      </svg><span class="nds-assistive-text">icon</span></c-icon>
                  </span></div>
                <div class="nds-grid nds-grid_vertical nds-grid_vertical-align-center nds-m-top_x-small nds-size_1-of-1">
                </div>
              </div>
            </div>
          </div>
        </div>
      </c-omniscript-edit-block>
    </slot>
    <slot name="new">
      <c-omniscript-edit-block-new slot="new"
        class="nds-large-size_3-of-12 nds-medium-size_6-of-12 nds-m-bottom_xx-small">
        <div class="nds-p-horizontal_small">
          <div role="button" tabindex="0"
            class="nds-box nds-box_x-small nds-grid nds-grid_vertical nds-grid_vertical-align-center nds-edit-block_cards-add-card nds-edit-block_shortcards">
            <div class="nds-m-top_x-large nds-edit-block_shortcards-circle"><span
                class="nds-icon_container nds-icon_container_circle">
                <c-icon><svg aria-hidden="true" class="nds-icon nds-input__icon nds-icon-text-default nds-icon_large">
                    <use
                      xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#user">
                    </use>
                  </svg><span class="nds-assistive-text">user icon</span></c-icon>
              </span></div>
            <div class="nds-m-top_x-small nds-size_1-of-1 nds-text-align_center nds-edit-block_shortcards-add-icon">
              <c-icon><svg aria-hidden="true"
                  class="nds-icon nds-input__icon nds-button__icon nds-button__icon_small nds-icon-text-default nds-icon_x-small">
                  <use
                    xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#add">
                  </use>
                </svg><span class="nds-assistive-text">add icon</span></c-icon><span>New</span>
            </div>
          </div>
        </div>
      </c-omniscript-edit-block-new>
    </slot>
  </c-omniscript-edit-block-wrapper>`)
      +
      withExampleAndHeight('Edit Block (Edit Mode)', `<c-omniscript-edit-block-wrapper
      class="nds-grid nds-wrap nds-size_1-of-1 nds-is-relative nds-size_12-of-12">
      <slot name="label">
        <c-omniscript-edit-block-label slot="label"
          class="nds-size_1-of-1 nds-m-vertical_small">
          <div class="nds-element_text-font"><label aria-label="Edit Block" aria-live="polite"
              class="nds-m-horizontal_small nds-text-heading_small nds-text">Edit Block</label></div>
        </c-omniscript-edit-block-label>
      </slot>
      <div id="edit-block-item-count-label-10" aria-live="polite" class="slds-assistive-text nds-assistive-text">0 items
      </div>
      <slot aria-describedby="edit-block-item-count-label-10">
        <c-omniscript-edit-block data-omni-key="EditBlock2"
          class="nds-size_12-of-12 nds-large-size_3-of-12 nds-medium-size_6-of-12">
          <div class="nds-p-horizontal_small">
            <div class="nds-grid nds-wrap nds-element_text-font">
              <div class="nds-size_1-of-1 nds-hide">
                <div data-edit-action="default" role="button" tabindex="0"
                  class="nds-box nds-box_x-small nds-grid nds-grid_vertical nds-grid_vertical-align-center nds-is-relative nds-size_12-of-12 nds-m-right_medium nds-m-bottom_medium omni-edit-block-card nds-edit-block_shortcards">
                  <div class="nds-dropdown-trigger nds-dropdown-trigger_click nds-is-open nds-col_bump-left"><button
                      type="button" aria-haspopup="true" title="Show More"
                      class="nds-button nds-button_icon-border-filled nds-editblock_action-button nds-element_text-font">
                      <c-icon><svg aria-hidden="true"
                          class="nds-icon nds-input__icon nds-icon-text-default nds-icon_x-small">
                          <use xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
                        </svg><span class="nds-assistive-text">down icon</span></c-icon>
                    </button></div>
                  <div class="nds-edit-block_shortcards-circle"><span
                      class="nds-icon_container nds-icon_container_circle slds-current-color omni-icon-circle"
                      style="color: rgb(21, 100, 191);">
                      <c-icon><svg aria-hidden="true" class="nds-icon nds-input__icon nds-icon-text-default nds-icon_large">
                          <use xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#user"></use>
                        </svg><span class="nds-assistive-text">icon</span></c-icon>
                    </span></div>
                  <div class="nds-grid nds-grid_vertical nds-grid_vertical-align-center nds-m-top_x-small nds-size_1-of-1">
                    <span class="nds-truncate"></span><span class="nds-truncate"></span><span class="nds-truncate"></span>
                  </div>
                </div>
              </div>
              <div class="nds-size_1-of-1 nds-show">
                <div class="nds-modal_custom">
                  <section role="dialog" tabindex="-1" aria-modal="true" class="nds-modal nds-fade-in-open nds-modal_large">
                    <div class="nds-modal__container">
                      <header class="nds-modal__header">
                        <h1 class="nds-text-heading_small nds-step_label">Edit Block</h1>
                      </header>
                      <div class="nds-modal__content nds-p-around_medium">
                        <slot class="nds-grid nds-wrap nds-grid_pull-padded">
                          <p>Fields appear here</p>
                        </slot>
                      </div>
                      <footer class="nds-modal__footer nds-button_text-font"><button type="button"
                          class="nds-button nds-button_neutral nds-size_2-of-12 nds-text-align_center">Cancel</button><button
                          type="button"
                          class="nds-button nds-button_neutral nds-button_brand nds-size_2-of-12 nds-text-align_center">Save</button>
                      </footer>
                    </div>
                  </section>
                  <div class="nds-backdrop nds-backdrop_open"></div>
                </div>
              </div>
            </div>
          </div>
        </c-omniscript-edit-block>
      </slot>
      <slot name="new">
        <c-omniscript-edit-block-new slot="new"
          class="nds-large-size_3-of-12 nds-medium-size_6-of-12 nds-m-bottom_xx-small">
          <div class="nds-p-horizontal_small">
            <div role="button" tabindex="0"
              class="nds-box nds-box_x-small nds-grid nds-grid_vertical nds-grid_vertical-align-center nds-edit-block_cards-add-card nds-edit-block_shortcards">
              <div class="nds-m-top_x-large nds-edit-block_shortcards-circle"><span
                  class="nds-icon_container nds-icon_container_circle">
                  <c-icon><svg aria-hidden="true" class="nds-icon nds-input__icon nds-icon-text-default nds-icon_large">
                      <use xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#user"></use>
                    </svg><span class="nds-assistive-text">user icon</span></c-icon>
                </span></div>
              <div class="nds-m-top_x-small nds-size_1-of-1 nds-text-align_center nds-edit-block_shortcards-add-icon">
                <c-icon><svg aria-hidden="true"
                    class="nds-icon nds-input__icon nds-button__icon nds-button__icon_small nds-icon-text-default nds-icon_x-small">
                    <use xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#add"></use>
                  </svg><span class="nds-assistive-text">add icon</span></c-icon><span>New</span>
              </div>
            </div>
          </div>
        </c-omniscript-edit-block-new>
      </slot>
    </c-omniscript-edit-block-wrapper>`, '300px')
      +
      withExample('Edit Block 1 item', `<c-omniscript-edit-block-wrapper
      class="nds-grid nds-wrap nds-size_1-of-1 nds-is-relative nds-size_12-of-12">
      <slot name="label">
        <c-omniscript-edit-block-label slot="label"
          class="nds-size_1-of-1 nds-m-vertical_small">
          <div class="nds-element_text-font"><label aria-label="Edit Block" aria-live="polite"
              class="nds-m-horizontal_small nds-text-heading_small nds-text">Edit Block</label></div>
        </c-omniscript-edit-block-label>
      </slot>
      <div id="edit-block-item-count-label-10" aria-live="polite" class="slds-assistive-text nds-assistive-text">1 item
      </div>
      <slot aria-describedby="edit-block-item-count-label-10">
        <c-omniscript-edit-block
          class="nds-size_12-of-12 nds-large-size_3-of-12 nds-medium-size_6-of-12">
          <div class="nds-p-horizontal_small">
            <div class="nds-grid nds-wrap nds-element_text-font">
              <div class="nds-size_1-of-1 nds-show">
                <div data-edit-action="default" role="button" tabindex="0" aria-invalid="false"
                  class="nds-box nds-box_x-small nds-grid nds-grid_vertical nds-grid_vertical-align-center nds-is-relative nds-size_12-of-12 nds-m-right_medium nds-m-bottom_medium omni-edit-block-card nds-edit-block_shortcards">
                  <div class="nds-dropdown-trigger nds-dropdown-trigger_click nds-is-open nds-col_bump-left"><button
                      type="button" aria-haspopup="true" title="Show More"
                      class="nds-button nds-button_icon-border-filled nds-editblock_action-button nds-element_text-font">
                      <c-icon><svg aria-hidden="true"
                          class="nds-icon nds-input__icon nds-icon-text-default nds-icon_x-small">
                          <use
                            xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#chevrondown">
                          </use>
                        </svg><span class="nds-assistive-text">down icon</span></c-icon>
                    </button></div>
                  <div class="nds-edit-block_shortcards-circle"><span
                      class="nds-icon_container nds-icon_container_circle slds-current-color omni-icon-circle"
                      style="color: rgb(21, 100, 191);">
                      <c-icon><svg aria-hidden="true" class="nds-icon nds-input__icon nds-icon-text-default nds-icon_large">
                          <use
                            xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#user">
                          </use>
                        </svg><span class="nds-assistive-text">icon</span></c-icon>
                    </span></div>
                  <div class="nds-grid nds-grid_vertical nds-grid_vertical-align-center nds-m-top_x-small nds-size_1-of-1">
                    <span class="nds-truncate">abc</span><span class="nds-truncate">defhijklm</span><span
                      class="nds-truncate">123</span></div>
                </div>
              </div>
            </div>
          </div>
        </c-omniscript-edit-block>
      </slot>
      <slot name="new">
        <c-omniscript-edit-block-new slot="new"
          class="nds-large-size_3-of-12 nds-medium-size_6-of-12 nds-m-bottom_xx-small">
          <div class="nds-p-horizontal_small">
            <div role="button" tabindex="0"
              class="nds-box nds-box_x-small nds-grid nds-grid_vertical nds-grid_vertical-align-center nds-edit-block_cards-add-card nds-edit-block_shortcards">
              <div class="nds-m-top_x-large nds-edit-block_shortcards-circle"><span
                  class="nds-icon_container nds-icon_container_circle">
                  <c-icon><svg aria-hidden="true" class="nds-icon nds-input__icon nds-icon-text-default nds-icon_large">
                      <use
                        xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#user">
                      </use>
                    </svg><span class="nds-assistive-text">user icon</span></c-icon>
                </span></div>
              <div class="nds-m-top_x-small nds-size_1-of-1 nds-text-align_center nds-edit-block_shortcards-add-icon">
                <c-icon><svg aria-hidden="true"
                    class="nds-icon nds-input__icon nds-button__icon nds-button__icon_small nds-icon-text-default nds-icon_x-small">
                    <use
                      xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#add">
                    </use>
                  </svg><span class="nds-assistive-text">add icon</span></c-icon><span>New</span>
              </div>
            </div>
          </div>
        </c-omniscript-edit-block-new>
      </slot>
    </c-omniscript-edit-block-wrapper>`)
    +
      withExample('Edit Block item invalid', `<c-omniscript-edit-block-wrapper
      class="nds-grid nds-wrap nds-size_1-of-1 nds-is-relative nds-size_12-of-12">
      <slot name="label">
        <c-omniscript-edit-block-label slot="label"
          class="nds-size_1-of-1 nds-m-vertical_small">
          <div class="nds-element_text-font"><label aria-label="Edit Block" aria-live="polite"
              class="nds-m-horizontal_small nds-text-heading_small nds-text">Edit Block</label></div>
        </c-omniscript-edit-block-label>
      </slot>
      <div id="edit-block-item-count-label-10" aria-live="polite" class="slds-assistive-text nds-assistive-text">1 item
      </div>
      <slot aria-describedby="edit-block-item-count-label-10">
        <c-omniscript-edit-block
          class="nds-size_12-of-12 nds-large-size_3-of-12 nds-medium-size_6-of-12">
          <div class="nds-p-horizontal_small">
            <div class="nds-grid nds-wrap nds-element_text-font">
              <div class="nds-size_1-of-1 nds-show">
                <div data-edit-action="default" role="button" tabindex="0" aria-invalid="true"
                  class="nds-box nds-box_x-small nds-grid nds-grid_vertical nds-grid_vertical-align-center nds-is-relative nds-size_12-of-12 nds-m-right_medium nds-m-bottom_medium omni-edit-block-card nds-edit-block_shortcards">
                  <div class="nds-dropdown-trigger nds-dropdown-trigger_click nds-is-open nds-col_bump-left"><button
                      type="button" aria-haspopup="true" title="Show More"
                      class="nds-button nds-button_icon-border-filled nds-editblock_action-button nds-element_text-font">
                      <c-icon><svg aria-hidden="true"
                          class="nds-icon nds-input__icon nds-icon-text-default nds-icon_x-small">
                          <use
                            xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#chevrondown">
                          </use>
                        </svg><span class="nds-assistive-text">down icon</span></c-icon>
                    </button></div>
                  <div class="nds-edit-block_shortcards-circle"><span
                      class="nds-icon_container nds-icon_container_circle slds-current-color omni-icon-circle"
                      style="color: rgb(21, 100, 191);">
                      <c-icon><svg aria-hidden="true" class="nds-icon nds-input__icon nds-icon-text-default nds-icon_large">
                          <use
                            xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#user">
                          </use>
                        </svg><span class="nds-assistive-text">icon</span></c-icon>
                    </span></div>
                  <div class="nds-grid nds-grid_vertical nds-grid_vertical-align-center nds-m-top_x-small nds-size_1-of-1">
                    <span class="nds-truncate">abc</span><span class="nds-truncate">defhijklm</span><span
                      class="nds-truncate">123</span></div>
                </div>
              </div>
            </div>
          </div>
        </c-omniscript-edit-block>
      </slot>
      <slot name="new">
        <c-omniscript-edit-block-new slot="new"
          class="nds-large-size_3-of-12 nds-medium-size_6-of-12 nds-m-bottom_xx-small">
          <div class="nds-p-horizontal_small">
            <div role="button" tabindex="0"
              class="nds-box nds-box_x-small nds-grid nds-grid_vertical nds-grid_vertical-align-center nds-edit-block_cards-add-card nds-edit-block_shortcards">
              <div class="nds-m-top_x-large nds-edit-block_shortcards-circle"><span
                  class="nds-icon_container nds-icon_container_circle">
                  <c-icon><svg aria-hidden="true" class="nds-icon nds-input__icon nds-icon-text-default nds-icon_large">
                      <use
                        xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#user">
                      </use>
                    </svg><span class="nds-assistive-text">user icon</span></c-icon>
                </span></div>
              <div class="nds-m-top_x-small nds-size_1-of-1 nds-text-align_center nds-edit-block_shortcards-add-icon">
                <c-icon><svg aria-hidden="true"
                    class="nds-icon nds-input__icon nds-button__icon nds-button__icon_small nds-icon-text-default nds-icon_x-small">
                    <use
                      xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#add">
                    </use>
                  </svg><span class="nds-assistive-text">add icon</span></c-icon><span>New</span>
              </div>
            </div>
          </div>
        </c-omniscript-edit-block-new>
      </slot>
    </c-omniscript-edit-block-wrapper>`)
    +
    withExample('Edit Block Menu Open', `<c-omniscript-edit-block-wrapper
    class="nds-grid nds-wrap nds-size_1-of-1 nds-is-relative nds-size_12-of-12">
    <slot name="label">
      <c-omniscript-edit-block-label slot="label" class="nds-size_1-of-1 nds-m-vertical_small">
        <div class="nds-element_text-font"><label aria-label="Edit Block" aria-live="polite"
            class="nds-m-horizontal_small nds-text-heading_small nds-text">Edit Block</label></div>
      </c-omniscript-edit-block-label>
    </slot>
    <div id="edit-block-item-count-label-10" aria-live="polite" class="slds-assistive-text nds-assistive-text">1 item
    </div>
    <slot aria-describedby="edit-block-item-count-label-10">
      <c-omniscript-edit-block data-omni-key="EditBlock2"
        class="nds-size_12-of-12 nds-large-size_3-of-12 nds-medium-size_6-of-12">
        <div class="nds-p-horizontal_small">
          <div class="nds-grid nds-wrap nds-element_text-font">
            <div class="nds-size_1-of-1 nds-show">
              <div data-edit-action="default" role="button" tabindex="0" aria-invalid="false"
                class="nds-box nds-box_x-small nds-grid nds-grid_vertical nds-grid_vertical-align-center nds-is-relative nds-size_12-of-12 nds-m-right_medium nds-m-bottom_medium omni-edit-block-card nds-edit-block_shortcards">
                <div class="nds-dropdown-trigger nds-dropdown-trigger_click nds-is-open nds-col_bump-left"><button
                    type="button" aria-haspopup="true" title="Show More"
                    class="nds-button nds-button_icon-border-filled nds-editblock_action-button nds-element_text-font">
                    <c-icon><svg aria-hidden="true"
                        class="nds-icon nds-input__icon nds-icon-text-default nds-icon_x-small">
                        <use xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
                      </svg><span class="nds-assistive-text">down icon</span></c-icon>
                  </button>
                  <div class="nds-dropdown nds-dropdown_right">
                    <ul role="menu" class="nds-dropdown__list">
                      <li role="presentation" class="nds-dropdown__item"><a href="javascript:void(0);" role="menuitem"
                          tabindex="0"><span class="nds-truncate">Edit</span></a></li>
                      <li role="presentation" class="nds-dropdown__item"><a href="javascript:void(0);" role="menuitem"
                          tabindex="0"><span class="nds-truncate">Delete</span></a></li>
                    </ul>
                  </div>
                  <div class="nds-is-absolute" style="width: 1000vh; height: 1000vh; left: -200vw; top: -200vh;"></div>
                </div>
                <div class="nds-edit-block_shortcards-circle"><span
                    class="nds-icon_container nds-icon_container_circle slds-current-color omni-icon-circle"
                    style="color: rgb(21, 100, 191);">
                    <c-icon><svg aria-hidden="true" class="nds-icon nds-input__icon nds-icon-text-default nds-icon_large">
                        <use xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#user"></use>
                      </svg><span class="nds-assistive-text">icon</span></c-icon>
                  </span></div>
                <div class="nds-grid nds-grid_vertical nds-grid_vertical-align-center nds-m-top_x-small nds-size_1-of-1">
                  <span class="nds-truncate">abc</span><span class="nds-truncate">defhijklm</span><span
                    class="nds-truncate">123</span></div>
              </div>
            </div>
          </div>
        </div>
      </c-omniscript-edit-block>
    </slot>
    <slot name="new">
      <c-omniscript-edit-block-new slot="new"
        class="nds-large-size_3-of-12 nds-medium-size_6-of-12 nds-m-bottom_xx-small">
        <div class="nds-p-horizontal_small">
          <div role="button" tabindex="0"
            class="nds-box nds-box_x-small nds-grid nds-grid_vertical nds-grid_vertical-align-center nds-edit-block_cards-add-card nds-edit-block_shortcards">
            <div class="nds-m-top_x-large nds-edit-block_shortcards-circle"><span
                class="nds-icon_container nds-icon_container_circle">
                <c-icon><svg aria-hidden="true" class="nds-icon nds-input__icon nds-icon-text-default nds-icon_large">
                    <use xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#user"></use>
                  </svg><span class="nds-assistive-text">user icon</span></c-icon>
              </span></div>
            <div class="nds-m-top_x-small nds-size_1-of-1 nds-text-align_center nds-edit-block_shortcards-add-icon">
              <c-icon><svg aria-hidden="true"
                  class="nds-icon nds-input__icon nds-button__icon nds-button__icon_small nds-icon-text-default nds-icon_x-small">
                  <use xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#add"></use>
                </svg><span class="nds-assistive-text">add icon</span></c-icon><span>New</span>
            </div>
          </div>
        </div>
      </c-omniscript-edit-block-new>
    </slot>
  </c-omniscript-edit-block-wrapper>`);
  })
  .add('Edit Block (Long Cards)', () => {
    return withExample('Empty Edit Block', `<c-omniscript-edit-block-wrapper
    class="nds-grid nds-wrap nds-size_1-of-1 nds-is-relative nds-size_12-of-12">
    <slot name="label">
      <c-omniscript-edit-block-label slot="label" class="nds-size_1-of-1 nds-m-vertical_small">
        <div class="nds-element_text-font"><label aria-label="Edit Block" aria-live="polite"
            class="nds-m-horizontal_small nds-text-heading_small nds-text">Edit Block</label></div>
      </c-omniscript-edit-block-label>
    </slot>
    <div id="edit-block-item-count-label-10" aria-live="polite" class="slds-assistive-text nds-assistive-text">0 items
    </div>
    <slot aria-describedby="edit-block-item-count-label-10">
      <c-omniscript-edit-block data-omni-key="EditBlock2" class="nds-size_12-of-12">
        <div class="nds-p-horizontal_small">
          <div class="nds-grid nds-wrap nds-element_text-font">
            <div role="button" tabindex="0"
              class="nds-grid nds-grid_align-center nds-m-right_medium nds-m-bottom_medium nds-size_12-of-12 omni-edit-block-card nds-edit-block_cards-add-card nds-edit-block_longcards">
              <div class="nds-grid nds-cont-wrapper">
                <div class="nds-edit-block_longcards-circle">
                  <div class="nds-grid nds-grid_align-center nds-grid_vertical-align-center" style="height: 100%;"><span
                      class="nds-icon_container nds-icon_container_circle" style="position: unset;">
                      <c-icon><svg aria-hidden="true"
                          class="nds-icon nds-input__icon nds-icon-text-default nds-icon_large">
                          <use xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#user"></use>
                        </svg><span class="nds-assistive-text">user icon</span></c-icon>
                    </span></div>
                </div>
                <div class="nds-edit-block_longcards-add-icon nds-grid nds-has-flexi-truncate nds-align_absolute-center">
                  <c-icon class="nds-align_absolute-center"><svg aria-hidden="true"
                      class="nds-icon nds-button__icon nds-icon-text-default nds-icon_xx-small">
                      <use xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#add"></use>
                    </svg><span class="nds-assistive-text">add icon</span></c-icon><span>New</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </c-omniscript-edit-block>
    </slot>
    <slot name="new">
      <c-omniscript-edit-block-new slot="new"></c-omniscript-edit-block-new>
    </slot>
  </c-omniscript-edit-block-wrapper>`)
      +
      withExampleAndHeight('Edit Block (Edit Mode)', `<c-omniscript-edit-block-wrapper
      class="nds-grid nds-wrap nds-size_1-of-1 nds-is-relative nds-size_12-of-12" style="min-height:300px">
      <slot name="label">
        <c-omniscript-edit-block-label slot="label" class="nds-size_1-of-1 nds-m-vertical_small">
          <div class="nds-element_text-font"><label aria-label="Edit Block" aria-live="polite"
              class="nds-m-horizontal_small nds-text-heading_small nds-text">Edit Block</label></div>
        </c-omniscript-edit-block-label>
      </slot>
      <div id="edit-block-item-count-label-10" aria-live="polite" class="slds-assistive-text nds-assistive-text">0 items
      </div>
      <slot aria-describedby="edit-block-item-count-label-10">
        <c-omniscript-edit-block data-omni-key="EditBlock2" class="nds-size_12-of-12">
          <div class="nds-p-horizontal_small">
            <div class="nds-grid nds-wrap nds-element_text-font">
              <div class="nds-size_1-of-1 nds-show">
                <div class="nds-modal_custom">
                  <section role="dialog" tabindex="-1" aria-modal="true" class="nds-modal nds-fade-in-open nds-modal_large">
                    <div class="nds-modal__container">
                      <header class="nds-modal__header">
                        <h1 class="nds-text-heading_small nds-step_label">Edit Block</h1>
                      </header>
                      <div class="nds-modal__content nds-p-around_medium">
                        <slot class="nds-grid nds-wrap nds-grid_pull-padded">
                          <p>fields go here</p>
                        </slot>
                      </div>
                      <footer class="nds-modal__footer nds-button_text-font"><button type="button"
                          class="nds-button nds-button_neutral nds-size_2-of-12 nds-text-align_center">Cancel</button><button
                          type="button"
                          class="nds-button nds-button_neutral nds-button_brand nds-size_2-of-12 nds-text-align_center">Save</button>
                      </footer>
                    </div>
                  </section>
                  <div class="nds-backdrop nds-backdrop_open"></div>
                </div>
              </div>
            </div>
          </div>
        </c-omniscript-edit-block>
      </slot>
      <slot name="new">
        <c-omniscript-edit-block-new slot="new"></c-omniscript-edit-block-new>
      </slot>
    </c-omniscript-edit-block-wrapper>`, '300px')
      +
      withExample('Edit Block 1 item', `<c-omniscript-edit-block-wrapper
      class="nds-grid nds-wrap nds-size_1-of-1 nds-is-relative nds-size_12-of-12">
      <slot name="label">
        <c-omniscript-edit-block-label slot="label"
          class="nds-size_1-of-1 nds-m-vertical_small">
          <div class="nds-element_text-font"><label aria-label="Edit Block" aria-live="polite"
              class="nds-m-horizontal_small nds-text-heading_small nds-text">Edit Block</label></div>
        </c-omniscript-edit-block-label>
      </slot>
      <div id="edit-block-item-count-label-10" aria-live="polite" class="slds-assistive-text nds-assistive-text">1 item
      </div>
      <slot aria-describedby="edit-block-item-count-label-10">
        <c-omniscript-edit-block data-omni-key="EditBlock2"
          class="nds-size_12-of-12">
          <div class="nds-p-horizontal_small">
            <div class="nds-grid nds-wrap nds-element_text-font">
              <div class="nds-size_1-of-1 nds-show">
                <div data-edit-action="default" role="button" tabindex="0" aria-invalid="false"
                  class="nds-grid nds-grid_align-center nds-is-relative nds-size_12-of-12 nds-m-right_medium nds-m-bottom_medium nds-grid_vertical-align-center omni-edit-block-card nds-edit-block_longcards"
                  style="justify-content: flex-start;">
                  <div class="nds-edit-block_longcards-circle">
                    <div class="nds-grid nds-grid_align-center nds-grid_vertical-align-center" style="height: 100%;"><span
                        class="nds-icon_container nds-icon_container_circle slds-current-color omni-icon-circle"
                        style="color: rgb(21, 100, 191); position: unset;">
                        <c-icon><svg aria-hidden="true"
                            class="nds-icon nds-input__icon nds-icon-text-default nds-icon_large">
                            <use
                              xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#user">
                            </use>
                          </svg><span class="nds-assistive-text">icon</span></c-icon>
                      </span></div>
                  </div>
                  <div
                    class="nds-grid nds-grid_vertical nds-grid_align-center nds-p-left_small nds-max-small-size_5-of-12 nds-small-size_8-of-12">
                    <span class="nds-truncate">abc</span><span class="nds-truncate">defhijklm</span><span
                      class="nds-truncate">123</span></div>
                  <div
                    class="nds-grid nds-dropdown-trigger nds-dropdown-trigger_click nds-is-open nds-col_bump-left nds-m-right_small">
                    <button type="button" aria-haspopup="true" title="Show More" data-action-button-menu=""
                      class="nds-button nds-button_icon-border-filled nds-editblock_action-button nds-element_text-font">
                      <c-icon><svg aria-hidden="true"
                          class="nds-icon nds-input__icon nds-icon-text-default nds-icon_x-small">
                          <use
                            xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#chevrondown">
                          </use>
                        </svg><span class="nds-assistive-text">down icon</span></c-icon>
                    </button></div>
                </div>
              </div>
              <div role="button" tabindex="0"
                class="nds-grid nds-grid_align-center nds-m-right_medium nds-m-bottom_medium nds-size_12-of-12 omni-edit-block-card nds-edit-block_cards-add-card nds-edit-block_longcards">
                <div class="nds-grid nds-cont-wrapper">
                  <div class="nds-edit-block_longcards-circle">
                    <div class="nds-grid nds-grid_align-center nds-grid_vertical-align-center" style="height: 100%;"><span
                        class="nds-icon_container nds-icon_container_circle" style="position: unset;">
                        <c-icon><svg aria-hidden="true"
                            class="nds-icon nds-input__icon nds-icon-text-default nds-icon_large">
                            <use
                              xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#user">
                            </use>
                          </svg><span class="nds-assistive-text">user icon</span></c-icon>
                      </span></div>
                  </div>
                  <div class="nds-edit-block_longcards-add-icon nds-grid nds-has-flexi-truncate nds-align_absolute-center">
                    <c-icon class="nds-align_absolute-center"><svg aria-hidden="true"
                        class="nds-icon nds-button__icon nds-icon-text-default nds-icon_xx-small">
                        <use
                          xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#add">
                        </use>
                      </svg><span class="nds-assistive-text">add icon</span></c-icon><span>New</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </c-omniscript-edit-block>
      </slot>
      <slot name="new">
        <c-omniscript-edit-block-new slot="new">
        </c-omniscript-edit-block-new>
      </slot>
    </c-omniscript-edit-block-wrapper>`)
    +
      withExample('Edit Block item invalid', `<c-omniscript-edit-block-wrapper
      class="nds-grid nds-wrap nds-size_1-of-1 nds-is-relative nds-size_12-of-12">
      <slot name="label">
        <c-omniscript-edit-block-label slot="label"
          class="nds-size_1-of-1 nds-m-vertical_small">
          <div class="nds-element_text-font"><label aria-label="Edit Block" aria-live="polite"
              class="nds-m-horizontal_small nds-text-heading_small nds-text">Edit Block</label></div>
        </c-omniscript-edit-block-label>
      </slot>
      <div id="edit-block-item-count-label-10" aria-live="polite" class="slds-assistive-text nds-assistive-text">1 item
      </div>
      <slot aria-describedby="edit-block-item-count-label-10">
        <c-omniscript-edit-block data-omni-key="EditBlock2"
          class="nds-size_12-of-12">
          <div class="nds-p-horizontal_small">
            <div class="nds-grid nds-wrap nds-element_text-font">
              <div class="nds-size_1-of-1 nds-show">
                <div data-edit-action="default" role="button" tabindex="0" aria-invalid="true"
                  class="nds-grid nds-grid_align-center nds-is-relative nds-size_12-of-12 nds-m-right_medium nds-m-bottom_medium nds-grid_vertical-align-center omni-edit-block-card nds-edit-block_longcards"
                  style="justify-content: flex-start;">
                  <div class="nds-edit-block_longcards-circle">
                    <div class="nds-grid nds-grid_align-center nds-grid_vertical-align-center" style="height: 100%;"><span
                        class="nds-icon_container nds-icon_container_circle slds-current-color omni-icon-circle"
                        style="color: rgb(21, 100, 191); position: unset;">
                        <c-icon><svg aria-hidden="true"
                            class="nds-icon nds-input__icon nds-icon-text-default nds-icon_large">
                            <use
                              xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#user">
                            </use>
                          </svg><span class="nds-assistive-text">icon</span></c-icon>
                      </span></div>
                  </div>
                  <div
                    class="nds-grid nds-grid_vertical nds-grid_align-center nds-p-left_small nds-max-small-size_5-of-12 nds-small-size_8-of-12">
                    <span class="nds-truncate">abc</span><span class="nds-truncate">defhijklm</span><span
                      class="nds-truncate">123</span></div>
                  <div
                    class="nds-grid nds-dropdown-trigger nds-dropdown-trigger_click nds-is-open nds-col_bump-left nds-m-right_small">
                    <button type="button" aria-haspopup="true" title="Show More" data-action-button-menu=""
                      class="nds-button nds-button_icon-border-filled nds-editblock_action-button nds-element_text-font">
                      <c-icon><svg aria-hidden="true"
                          class="nds-icon nds-input__icon nds-icon-text-default nds-icon_x-small">
                          <use
                            xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#chevrondown">
                          </use>
                        </svg><span class="nds-assistive-text">down icon</span></c-icon>
                    </button></div>
                </div>
              </div>
              <div role="button" tabindex="0"
                class="nds-grid nds-grid_align-center nds-m-right_medium nds-m-bottom_medium nds-size_12-of-12 omni-edit-block-card nds-edit-block_cards-add-card nds-edit-block_longcards">
                <div class="nds-grid nds-cont-wrapper">
                  <div class="nds-edit-block_longcards-circle">
                    <div class="nds-grid nds-grid_align-center nds-grid_vertical-align-center" style="height: 100%;"><span
                        class="nds-icon_container nds-icon_container_circle" style="position: unset;">
                        <c-icon><svg aria-hidden="true"
                            class="nds-icon nds-input__icon nds-icon-text-default nds-icon_large">
                            <use
                              xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#user">
                            </use>
                          </svg><span class="nds-assistive-text">user icon</span></c-icon>
                      </span></div>
                  </div>
                  <div class="nds-edit-block_longcards-add-icon nds-grid nds-has-flexi-truncate nds-align_absolute-center">
                    <c-icon class="nds-align_absolute-center"><svg aria-hidden="true"
                        class="nds-icon nds-button__icon nds-icon-text-default nds-icon_xx-small">
                        <use
                          xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#add">
                        </use>
                      </svg><span class="nds-assistive-text">add icon</span></c-icon><span>New</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </c-omniscript-edit-block>
      </slot>
      <slot name="new">
        <c-omniscript-edit-block-new slot="new">
        </c-omniscript-edit-block-new>
      </slot>
    </c-omniscript-edit-block-wrapper>`)
    +
    withExample('Edit Block Menu Open', `<c-omniscript-edit-block-wrapper
    class="nds-grid nds-wrap nds-size_1-of-1 nds-is-relative nds-size_12-of-12">
    <slot name="label">
      <c-omniscript-edit-block-label slot="label" class="nds-size_1-of-1 nds-m-vertical_small">
        <div class="nds-element_text-font"><label aria-label="Edit Block" aria-live="polite"
            class="nds-m-horizontal_small nds-text-heading_small nds-text">Edit Block</label></div>
      </c-omniscript-edit-block-label>
    </slot>
    <div id="edit-block-item-count-label-10" aria-live="polite" class="slds-assistive-text nds-assistive-text">1 item
    </div>
    <slot aria-describedby="edit-block-item-count-label-10">
      <c-omniscript-edit-block data-omni-key="EditBlock2" class="nds-size_12-of-12">
        <div class="nds-p-horizontal_small">
          <div class="nds-grid nds-wrap nds-element_text-font">
            <div class="nds-size_1-of-1 nds-show">
              <div data-edit-action="default" role="button" tabindex="0"
                class="nds-grid nds-grid_align-center nds-is-relative nds-size_12-of-12 nds-m-right_medium nds-m-bottom_medium nds-grid_vertical-align-center omni-edit-block-card nds-edit-block_longcards"
                style="justify-content: flex-start;">
                <div class="nds-edit-block_longcards-circle">
                  <div class="nds-grid nds-grid_align-center nds-grid_vertical-align-center" style="height: 100%;"><span
                      class="nds-icon_container nds-icon_container_circle slds-current-color omni-icon-circle"
                      style="color: rgb(21, 100, 191); position: unset;">
                      <c-icon><svg aria-hidden="true"
                          class="nds-icon nds-input__icon nds-icon-text-default nds-icon_large">
                          <use xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#user"></use>
                        </svg><span class="nds-assistive-text">icon</span></c-icon>
                    </span></div>
                </div>
                <div
                  class="nds-grid nds-grid_vertical nds-grid_align-center nds-p-left_small nds-max-small-size_5-of-12 nds-small-size_8-of-12">
                  <span class="nds-truncate">abc</span><span class="nds-truncate">defhijklm</span><span
                    class="nds-truncate">123</span></div>
                <div
                  class="nds-grid nds-dropdown-trigger nds-dropdown-trigger_click nds-is-open nds-col_bump-left nds-m-right_small">
                  <button type="button" aria-haspopup="true" title="Show More" data-action-button-menu=""
                    class="nds-button nds-button_icon-border-filled nds-editblock_action-button nds-element_text-font">
                    <c-icon><svg aria-hidden="true"
                        class="nds-icon nds-input__icon nds-icon-text-default nds-icon_x-small">
                        <use xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use>
                      </svg><span class="nds-assistive-text">down icon</span></c-icon>
                  </button>
                  <div class="nds-dropdown nds-dropdown_right">
                    <ul role="menu" class="nds-dropdown__list">
                      <li role="presentation" class="nds-dropdown__item"><a href="javascript:void(0);" role="menuitem"
                          tabindex="0"><span class="nds-truncate">Edit</span></a></li>
                      <li role="presentation" class="nds-dropdown__item"><a href="javascript:void(0);" role="menuitem"
                          tabindex="0"><span class="nds-truncate">Delete</span></a></li>
                    </ul>
                  </div>
                  <div class="nds-is-absolute" style="width: 1000vh; height: 1000vh; left: -200vw; top: -200vh;"></div>
                </div>
              </div>
            </div>
            <div role="button" tabindex="0"
              class="nds-grid nds-grid_align-center nds-m-right_medium nds-m-bottom_medium nds-size_12-of-12 omni-edit-block-card nds-edit-block_cards-add-card nds-edit-block_longcards">
              <div class="nds-grid nds-cont-wrapper">
                <div class="nds-edit-block_longcards-circle">
                  <div class="nds-grid nds-grid_align-center nds-grid_vertical-align-center" style="height: 100%;"><span
                      class="nds-icon_container nds-icon_container_circle" style="position: unset;">
                      <c-icon><svg aria-hidden="true"
                          class="nds-icon nds-input__icon nds-icon-text-default nds-icon_large">
                          <use xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#user"></use>
                        </svg><span class="nds-assistive-text">user icon</span></c-icon>
                    </span></div>
                </div>
                <div class="nds-edit-block_longcards-add-icon nds-grid nds-has-flexi-truncate nds-align_absolute-center">
                  <c-icon class="nds-align_absolute-center"><svg aria-hidden="true"
                      class="nds-icon nds-button__icon nds-icon-text-default nds-icon_xx-small">
                      <use xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#add"></use>
                    </svg><span class="nds-assistive-text">add icon</span></c-icon><span>New</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </c-omniscript-edit-block>
    </slot>
    <slot name="new">
      <c-omniscript-edit-block-new slot="new"></c-omniscript-edit-block-new>
    </slot>
  </c-omniscript-edit-block-wrapper>`);
  })
  .add('Email', () => {
    return withExample('Email with required flag', `<c-input class="nds-container_fluid">
      <div class="nds-form-element nds-form-container">
        <div class="nds-form-element__control nds-form-element__control-animated-label">
          <input id="input1-12" maxlength="255" minlength="0" type="email" data-isnumber="false" placeholder="placeholder" class="vlocity-input nds-input nds-input_mask">
          <div class="nds-form-element__label nds-align-middle nds-animated-label__ease-out">
            <label aria-label="Email" for="input1-12" data-label="true">Email<abbr class="nds-required nds-p-left_xx-small">*</abbr></label>
          </div>
        </div>
      </div>
    </c-input>`)
      +
      withExample('Email with tooltip', 'Note: the tooltip is not visible here because JavaScript is used in the underlying component to ensure it is positioned correctly',
        `<c-input class="nds-container_fluid">
          <div class="nds-form-element nds-form-container">
            <div class="nds-form-element__control nds-form-element__control-animated-label">
              <input id="input3-14" maxlength="255" minlength="0" type="email" data-isnumber="false" required="" placeholder="placeholder" class="vlocity-input nds-input nds-input_mask">
              <div class="nds-form-element__label nds-align-middle nds-animated-label__ease-out">
                <label aria-label="Email" for="input3-14" data-label="true">Email<abbr class="nds-required nds-p-left_xx-small">*</abbr></label>
                <c-tooltip data-field-level-help="" class="nds-tooltip__container">
                  <span style="position: relative;">
                    <c-button tabindex="0" aria-describedby="help-15" aria-disabled="true">
                      <button type="button" label="utility:info" class="vlocity-btn nds-button nds-button_icon">
                        <c-icon>
                          <svg aria-hidden="true" class="nds-button__icon nds-icon_xx-small">
                            <use xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#info"></use>
                          </svg>
                          <span class="nds-assistive-text"></span>
                        </c-icon>
                        <span aria-label="Tooltip Email" class="btnLabel"></span>
                      </button>
                    </c-button>
                    <span role="tooltip" id="help-15" class="nds-popover nds-nubbin_bottom-left nds-popover_tooltip nds-fall-into-ground bottom-left tooltipSection" style="white-space: normal;">
                      <div class="nds-popover__body">Tooltip Email</div>
                    </span>
                  </span>
                </c-tooltip>
              </div>
            </div>
          </div>
        </c-input>`)
      +
      withExample('Email with error message', `
        <c-input class="nds-container_fluid">
          <div class="nds-form-element nds-form-container nds-has-error">
            <div class="nds-form-element__control nds-form-element__control-animated-label">
              <input id="input5-19" pattern="abc" maxlength="255" minlength="0" type="email" data-isnumber="false" placeholder="placeholder" class="vlocity-input nds-input nds-input_mask nds-not-empty nds-is-dirty" aria-describedby="errorMessageBlock-19">
              <div class="nds-form-element__label nds-align-middle nds-animated-label__ease-out">
                <label aria-label="Email" for="input5-19" data-label="true">Email</label>
              </div>
            </div>
            <div aria-live="assertive" id="errorMessageBlock-19" class="nds-form-element__help nds-size_1-of-1">Value does not match pattern</div>
          </div>
        </c-input>`)
      +
      withExample('Email with repeat', `
        <c-input class="nds-container_fluid nds-input-has-icon_right">
          <div class="nds-form-element nds-form-container">
            <div class="nds-form-element__control nds-form-element__control-animated-label">
              <input id="input7-21" maxlength="255" minlength="0" type="email" data-isnumber="false" required="" placeholder="placeholder" class="vlocity-input nds-input nds-input_mask">
              <div class="nds-form-element__label nds-align-middle nds-animated-label__ease-out">
                <label aria-label="Email" for="input7-21" data-label="true">Email<abbr class="nds-required nds-p-left_xx-small">*</abbr></label>
                <slot name="label">
                  <span slot="label" role="group" class="omni-repeat-button-group nds-button-group nds-m-right_x-small nds-tooltip__container" style="bottom: 7px; right: -11px;">
                    <button class="nds-button_reset nds-m-right_x-small vlocity-btn nds-button nds-button_icon">
                      <c-icon>
                        <svg aria-hidden="true" class="slds-icon nds-button__icon nds-button__icon_small slds-icon-text-default slds-icon_xx-small">
                          <use xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#add"></use>
                        </svg>
                        <span class="nds-assistive-text">Save Email and add a new field</span>
                      </c-icon>
                    </button>
                    <button class="nds-button_reset nds-m-right_x-small vlocity-btn nds-button nds-button_icon">
                      <c-icon>
                        <svg aria-hidden="true" class="slds-icon nds-button__icon nds-button__icon_small slds-icon-text-default slds-icon_xx-small">
                          <use xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                        </svg>
                        <span class="nds-assistive-text">Delete Email and remove the field</span>
                      </c-icon>
                    </button>
                  </span>
                </slot>
              </div>
            </div>
          </div>
        </c-input>
      `)
      +
      withExample('Readonly email', `
      <c-input class="nds-container_fluid">
        <div class="nds-form-element nds-form-container">
          <div class="nds-form-element__control nds-form-element__control-animated-label"><input id="input9-24"
              maxlength="255" minlength="0" type="email" data-isnumber="false" required="" placeholder="placeholder"
              class="vlocity-input nds-input nds-input_mask" tabindex="-1">
            <div class="nds-form-element__label nds-align-middle nds-animated-label__ease-out"><label
                aria-label="Email readonly" for="input9-24" data-label="true">Email readonly<abbr
                  class="nds-required nds-p-left_xx-small">*</abbr></label>
              <slot name="label"></slot>
            </div>
          </div>
        </div>
      </c-input>`);
  })
  .add('Line Break', () => {
    return withExample('', 'A line break configured in the designer has a property to set the bottom padding value as pixels.', `<div class="nds-size_1-of-1 nds-line_break"
      style="padding-bottom: 20px"></div>`);
  })
  .add('Lookup', () => {
    return withExample('Lookup with required', `<c-omniscript-lookup class="nds-size_12-of-12 nds-medium-size_12-of-12">
    <slot>
      <div class="nds-grid">
        <fieldset class="nds-form-element nds-container_fluid nds-form-container">
          <div class="nds-combobox_container">
            <div aria-expanded="false" aria-haspopup="listbox" role="combobox"
              class="nds-combobox nds-dropdown-trigger nds-dropdown-trigger_click">
              <div role="none"
                class="nds-combobox__form-element nds-input-has-icon nds-input-has-icon_right nds-form-element__control nds-form-element__control-animated-label">
                <input type="text" required="" readonly="" aria-controls="lookup-11" id="lookupId-11" placeholder="lookup"
                  data-omni-input="" class="vlocity-input nds-input">
                <div class="nds-form-element__label nds-align-middle nds-animated-label__ease-out"><label
                    aria-label="Lookup" for="lookupId-11">Lookup<abbr title="required"
                      class="nds-required nds-p-left_xx-small">*</abbr></label></div><span
                  class="nds-icon_container nds-input__icon_right">
                  <c-icon><svg aria-hidden="true"
                      class="nds-icon nds-input__icon nds-icon-text-default nds-icon_small nds-icon_right">
                      <use
                        xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#search">
                      </use>
                    </svg><span class="nds-assistive-text">lookup</span></c-icon>
                </span>
                <div role="listbox" id="lookup-11" class="nds-dropdown nds-dropdown_fluid">
                  <ul role="presentation" class="nds-listbox nds-listbox_vertical"></ul>
                </div>
              </div>
              <div class="nds-has-error nds-m-top_none"></div>
            </div>
          </div>
        </fieldset>
      </div>
    </slot>
  </c-omniscript-lookup>`)
      +
      withExample('Lookup with Tooltip', `<c-omniscript-lookup class="nds-size_12-of-12 nds-medium-size_12-of-12">
      <slot>
        <div class="nds-grid">
          <fieldset class="nds-form-element nds-container_fluid nds-form-container">
            <div class="nds-combobox_container">
              <div aria-expanded="false" aria-haspopup="listbox" role="combobox"
                class="nds-combobox nds-dropdown-trigger nds-dropdown-trigger_click">
                <div role="none"
                  class="nds-combobox__form-element nds-input-has-icon nds-input-has-icon_right nds-form-element__control nds-form-element__control-animated-label">
                  <input type="text" readonly="" aria-controls="lookup-13" id="lookupId-13" placeholder=""
                    data-omni-input="" class="vlocity-input nds-input">
                  <div class="nds-form-element__label nds-align-middle nds-animated-label__ease-out"><label
                      aria-label="Lookup" for="lookupId-13">Lookup</label>
                    <c-tooltip class="nds-tooltip__container" vloc_mg-tooltip_tooltip-host=""><span
                        vloc_mg-tooltip_tooltip="" style="position: relative;">
                        <c-button vloc_mg-tooltip_tooltip="" tabindex="0" aria-describedby="help-14" aria-disabled="true">
                          <button type="button" label="utility:info" class="vlocity-btn nds-button nds-button_icon">
                            <c-icon><svg aria-hidden="true" class="nds-button__icon nds-icon_xx-small">
                                <use xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#info"></use>
                              </svg><span class="nds-assistive-text"></span></c-icon><span aria-label="Look Tooltip"
                              class="btnLabel"></span>
                          </button></c-button><span vloc_mg-tooltip_tooltip="" role="tooltip" id="help-14"
                          class="nds-popover nds-nubbin_bottom-left nds-popover_tooltip nds-fall-into-ground bottom-left tooltipSection"
                          style="white-space: normal;">
                          <div vloc_mg-tooltip_tooltip="" class="nds-popover__body">Look Tooltip</div>
                        </span>
                      </span></c-tooltip>
                  </div><span class="nds-icon_container nds-input__icon_right">
                    <c-icon><svg aria-hidden="true"
                        class="nds-icon nds-input__icon nds-icon-text-default nds-icon_small nds-icon_right">
                        <use xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#search"></use>
                      </svg><span class="nds-assistive-text">lookup</span></c-icon>
                  </span>
                  <div role="listbox" id="lookup-13" class="nds-dropdown nds-dropdown_fluid">
                    <ul role="presentation" class="nds-listbox nds-listbox_vertical"></ul>
                  </div>
                </div>
                <div class="nds-has-error nds-m-top_none"></div>
              </div>
            </div>
          </fieldset>
        </div>
      </slot>
    </c-omniscript-lookup>`)
      +
      withExample('Lookup with Repeat', `<c-omniscript-lookup class="nds-size_12-of-12 nds-medium-size_12-of-12">
      <slot>
        <div class="nds-grid">
          <fieldset class="nds-form-element nds-container_fluid nds-form-container">
            <div class="nds-combobox_container">
              <div aria-expanded="false" aria-haspopup="listbox" role="combobox"
                class="nds-combobox nds-dropdown-trigger nds-dropdown-trigger_click">
                <div role="none"
                  class="nds-combobox__form-element nds-input-has-icon nds-input-has-icon_right nds-form-element__control nds-form-element__control-animated-label">
                  <input type="text" readonly="" aria-controls="lookup-18" id="lookupId-18" placeholder=""
                    data-omni-input="" class="vlocity-input nds-input">
                  <div class="nds-form-element__label nds-align-middle nds-animated-label__ease-out"><label
                      aria-label="Lookup" for="lookupId-18" class="nds-lookup-form-element__label">Lookup</label>
                    <div role="group"
                      class="nds-button-group nds-m-right_x-small nds-tooltip__container omni-repeat-button-group"
                      style="float: right; right: 17px; top: 3px;"><button
                        class="nds-button_reset nds-button nds-button_icon nds-m-right_x-small">
                        <c-icon><svg aria-hidden="true"
                            class="slds-icon nds-button__icon nds-button__icon_small slds-icon-text-default slds-icon_xx-small">
                            <use
                              xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#add">
                            </use>
                          </svg><span class="nds-assistive-text">Repeat Lookup</span></c-icon>
                      </button><button class="nds-button_reset nds-button nds-button_icon">
                        <c-icon><svg aria-hidden="true"
                            class="slds-icon nds-button__icon nds-button__icon_small slds-icon-text-default slds-icon_xx-small">
                            <use
                              xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#close">
                            </use>
                          </svg><span class="nds-assistive-text">Remove Lookup</span></c-icon>
                      </button></div>
                  </div><span class="nds-icon_container nds-input__icon_right">
                    <c-icon><svg aria-hidden="true"
                        class="nds-icon nds-input__icon nds-icon-text-default nds-icon_small nds-icon_right">
                        <use
                          xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#search">
                        </use>
                      </svg><span class="nds-assistive-text">lookup</span></c-icon>
                  </span>
                  <div role="listbox" id="lookup-18" class="nds-dropdown nds-dropdown_fluid">
                    <ul role="presentation" class="nds-listbox nds-listbox_vertical"></ul>
                  </div>
                </div>
                <div class="nds-has-error nds-m-top_none"></div>
              </div>
            </div>
          </fieldset>
        </div>
      </slot>
    </c-omniscript-lookup>`)
      +
      withExampleAndHeight('Lookup dropdown open', `<c-omniscript-lookup class="nds-size_12-of-12 nds-medium-size_12-of-12">
    <slot>
      <div class="nds-grid">
        <fieldset class="nds-form-element nds-container_fluid nds-form-container">
          <div class="nds-combobox_container">
            <div aria-expanded="true" aria-haspopup="listbox" role="combobox"
              class="nds-combobox nds-dropdown-trigger nds-dropdown-trigger_click nds-is-open">
              <div role="none"
                class="nds-combobox__form-element nds-input-has-icon nds-input-has-icon_right nds-form-element__control nds-form-element__control-animated-label">
                <input type="text" readonly="" aria-controls="lookup-21" id="lookupId-21" placeholder=""
                  data-omni-input="" class="vlocity-input nds-input">
                <div class="nds-form-element__label nds-align-middle nds-animated-label__ease-out"><label
                    aria-label="Lookup" for="lookupId-21">Lookup</label></div><span
                  class="nds-icon_container nds-input__icon_right">
                  <c-icon><svg aria-hidden="true"
                      class="nds-icon nds-input__icon nds-icon-text-default nds-icon_small nds-icon_right">
                      <use xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#search"></use>
                    </svg><span class="nds-assistive-text">lookup</span></c-icon>
                </span>
                <div role="listbox" id="lookup-21" class="nds-dropdown nds-dropdown_fluid">
                  <ul role="presentation" class="nds-listbox nds-listbox_vertical">
                    <li role="presentation" class="nds-listbox__item">
                      <div role="option" data-option-index="0"
                        class="nds-media nds-listbox__option nds-listbox__option_entity nds-listbox__option_has-meta">
                        <span data-option-index="0" class="nds-media__body"><span data-option-index="0"
                            class="nds-listbox__option-text nds-listbox__option-text_entity">--</span></span></div>
                    </li>
                    <li role="presentation" class="nds-listbox__item">
                      <div role="option" data-option-index="1"
                        class="nds-media nds-listbox__option nds-listbox__option_entity nds-listbox__option_has-meta nds-has-focus">
                        <span data-option-index="1" class="nds-media__body"><span data-option-index="1"
                            class="nds-listbox__option-text nds-listbox__option-text_entity"></span></span></div>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="nds-has-error nds-m-top_none"></div>
            </div>
          </div>
        </fieldset>
      </div>
    </slot>
  </c-omniscript-lookup>`, '200px')
      +
      withExample('Lookup with error', `<c-omniscript-lookup data-omni-key="Lookup1" class="nds-size_12-of-12 nds-medium-size_12-of-12">
    <slot>
      <div class="nds-grid">
        <fieldset class="nds-form-element nds-container_fluid nds-form-container nds-has-error">
          <div class="nds-combobox_container">
            <div aria-expanded="false" aria-haspopup="listbox" role="combobox"
              class="nds-combobox nds-dropdown-trigger nds-dropdown-trigger_click">
              <div role="none"
                class="nds-combobox__form-element nds-input-has-icon nds-input-has-icon_right nds-form-element__control nds-form-element__control-animated-label">
                <input type="text" required="" readonly="" aria-controls="lookup-11" id="lookupId-11" placeholder="lookup"
                  data-omni-input="" class="vlocity-input nds-input">
                <div class="nds-form-element__label nds-align-middle nds-animated-label__ease-out"><label
                    aria-label="Lookup" for="lookupId-11">Lookup<abbr title="required"
                      class="nds-required nds-p-left_xx-small">*</abbr></label></div><span
                  class="nds-icon_container nds-input__icon_right">
                  <c-icon><svg aria-hidden="true"
                      class="nds-icon nds-input__icon nds-icon-text-default nds-icon_small nds-icon_right">
                      <use xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#search"></use>
                    </svg><span class="nds-assistive-text">lookup</span></c-icon>
                </span>
                <div role="listbox" id="lookup-11" class="nds-dropdown nds-dropdown_fluid">
                  <ul role="presentation" class="nds-listbox nds-listbox_vertical"></ul>
                </div>
              </div>
              <div class="nds-has-error nds-m-top_none">
                <div class="nds-form-element__help nds-form-element__help_text-transform__none">Required</div>
              </div>
            </div>
          </div>
        </fieldset>
      </div>
    </slot>
  </c-omniscript-lookup>`);
  })
  .add('Messaging', () => {
    const ValueMap = {
      Success: {
        iconName: 'utility:check',
        iconVariant: 'success',
      },
      Comment: {
        iconName: 'utility:chat',
        iconVariant: 'default',
      },
      Warning: {
        iconName: 'utility:warning',
        iconVariant: 'warning',
      },
      Requirement: {
        iconName: 'utility:close',
        iconVariant: 'error',
        textClass: 'nds-text-color--error',
        ariaRole: 'alert',
        wrapperClassDynamic: 'nds-scoped-notification--error',
      }
    };
    let value = radios('Types', {
      Success: 'Success',
      Comment: 'Comment',
      Warning: 'Warning',
      Requirement: 'Requirement'
    }, 'Success');
    if (value === '' || value == null) {
      value = 'Success';
    }
    return withExample(`Requirement with label`, 'Use the Knobs to toggle the different states of the Messages', `
      <div ${ValueMap[value].ariaRole ? `role="${ValueMap[value].ariaRole}"` : ''}class="nds-is-relative nds-scoped-notification nds-scoped-notification_form ${ValueMap[value].wrapperClassDynamic || ''}">
        <div class="nds-form-element__control nds-form-element__control-animated-label nds-grid">
          <div msg="${value}" class="nds-faux-animate">
            <span title="${value}" class="nds-icon_container nds-icon_container_circle nds-m-right_small">
              <c-icon>
                <svg aria-hidden="true" class="nds-icon nds-icon-text-${ValueMap[value].iconVariant}">
                  <use xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#${ValueMap[value].iconName.split(':')[1]}"></use>
                </svg>
                <span class="nds-assistive-text"></span>
              </c-icon>
            </span>
            <span class="${ValueMap[value].textClass}">Message</span>
          </div>
          <label class="nds-form-element__label" style="top: 0rem;">
            <span>Messaging</span>
          </label>
        </div>
      </div>`) +
      withExample('Requirement without label', 'Use the Knobs to toggle the different states of the Messages', `
      <div ${ValueMap[value].ariaRole ? `role="${ValueMap[value].ariaRole}"` : ''}class="nds-is-relative nds-scoped-notification nds-scoped-notification_form ${ValueMap[value].wrapperClassDynamic || ''}">
        <div class="nds-form-element__control nds-form-element__control-animated-label nds-grid">
          <div msg="${value}" class="nds-faux-animate">
            <span title="${value}" class="nds-icon_container nds-icon_container_circle nds-m-right_small">
              <c-icon>
                <svg aria-hidden="true" class="nds-icon nds-icon-text-${ValueMap[value].iconVariant}">
                  <use xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#${ValueMap[value].iconName.split(':')[1]}"></use>
                </svg>
                <span class="nds-assistive-text"></span>
              </c-icon>
            </span>
            <span class="${ValueMap[value].textClass}">Message</span>
          </div>
        </div>
      </div>`);

  })
  .add('Multi-select (Vertical)', () => {
    return withExample('Multi-select required', `<c-omniscript-multiselect class="nds-size_12-of-12 nds-medium-size_12-of-12">
    <slot>
      <c-checkbox-group data-refresh="false">
        <div class="nds-form-element nds-form-container">
          <fieldset class="nds-form-element"><span
              class="nds-form-element__legend nds-form-element__label nds-form-element__control-help nds-radio-relative-tooltip nds-show"><abbr
                title="Required" class="nds-required">*</abbr><span class="nds-m-right_x-small">Multi-select</span><span
                class="nds-nowrap-whitespace">
                <slot name="label"></slot>
              </span></span>
            <div class="nds-form-element__control nds-vertical_checkbox"><span class="nds-checkbox"><input type="checkbox"
                  required="" id="vlocity-checkbox-0-0-12" data-index="0" name="Multi-select1" value="abc"><label
                  data-index="0" for="vlocity-checkbox-0-0-12" class="nds-checkbox__label"><span
                    class="nds-checkbox_faux"></span><span class="nds-form-element__label">abc</span></label></span><span
                class="nds-checkbox"><input type="checkbox" required="" id="vlocity-checkbox-0-1-12" data-index="1"
                  name="Multi-select1" value="def"><label data-index="1" for="vlocity-checkbox-0-1-12"
                  class="nds-checkbox__label"><span class="nds-checkbox_faux"></span><span
                    class="nds-form-element__label">def</span></label></span></div>
          </fieldset>
        </div>
      </c-checkbox-group>
    </slot>
  </c-omniscript-multiselect>`)
      +
      withExample('Multi-select with tooltip', `<c-omniscript-multiselect class="nds-size_12-of-12 nds-medium-size_12-of-12">
    <slot>
      <c-checkbox-group data-refresh="false">
        <div class="nds-form-element nds-form-container">
          <fieldset class="nds-form-element"><span
              class="nds-form-element__legend nds-form-element__label nds-form-element__control-help nds-radio-relative-tooltip nds-show"><span
                class="nds-m-right_x-small">Multi-select</span><span class="nds-nowrap-whitespace">
                <c-tooltip class="nds-tooltip__container" vloc_mg-tooltip_tooltip-host=""><span vloc_mg-tooltip_tooltip=""
                    style="position: relative;">
                    <c-button vloc_mg-tooltip_tooltip="" tabindex="0" aria-describedby="help-15" aria-disabled="true">
                      <button type="button" label="utility:info" class="vlocity-btn nds-button nds-button_icon">
                        <c-icon><svg aria-hidden="true" class="nds-button__icon nds-icon_xx-small">
                            <use xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#info"></use>
                          </svg><span class="nds-assistive-text"></span></c-icon><span aria-label="Multi-select Tooltip"
                          class="btnLabel"></span>
                      </button></c-button><span vloc_mg-tooltip_tooltip="" role="tooltip" id="help-15"
                      class="nds-popover nds-nubbin_bottom-left nds-popover_tooltip nds-fall-into-ground bottom-left tooltipSection"
                      style="white-space: normal;">
                      <div vloc_mg-tooltip_tooltip="" class="nds-popover__body">Multi-select Tooltip</div>
                    </span>
                  </span></c-tooltip>
                <slot name="label"></slot>
              </span></span>
            <div class="nds-form-element__control nds-vertical_checkbox"><span class="nds-checkbox"><input type="checkbox"
                  id="vlocity-checkbox-1-0-14" data-index="0" name="Multi-select2" value="abc"><label data-index="0"
                  for="vlocity-checkbox-1-0-14" class="nds-checkbox__label"><span class="nds-checkbox_faux"></span><span
                    class="nds-form-element__label">abc</span></label></span><span class="nds-checkbox"><input
                  type="checkbox" id="vlocity-checkbox-1-1-14" data-index="1" name="Multi-select2" value="def"><label
                  data-index="1" for="vlocity-checkbox-1-1-14" class="nds-checkbox__label"><span
                    class="nds-checkbox_faux"></span><span class="nds-form-element__label">def</span></label></span></div>
          </fieldset>
        </div>
      </c-checkbox-group>
    </slot>
  </c-omniscript-multiselect>`)
      +
      withExample('Multi-select with repeat', `<c-omniscript-multiselect class="nds-size_12-of-12 nds-medium-size_12-of-12">
      <slot>
        <c-checkbox-group data-refresh="false">
          <div class="nds-form-element nds-form-container">
            <fieldset class="nds-form-element"><span
                class="nds-form-element__legend nds-form-element__label nds-form-element__control-help nds-radio-relative-tooltip nds-show"><span
                  class="nds-m-right_x-small">Multi-select</span><span class="nds-nowrap-whitespace">
                  <slot name="label"><span slot="label" role="group"
                      class="omni-repeat-button-group nds-m-bottom_xx-small"><button
                        class="nds-button_reset nds-m-right_x-small">
                        <c-icon><svg aria-hidden="true"
                            class="slds-icon nds-button__icon nds-button__icon_small nds-m-bottom_xxx-small slds-icon-text-default slds-icon_xx-small">
                            <use xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#add"></use>
                          </svg><span class="nds-assistive-text">Repeat Multiselect</span></c-icon>
                      </button><button class="nds-button_reset nds-m-right_x-small">
                        <c-icon><svg aria-hidden="true"
                            class="slds-icon nds-button__icon nds-button__icon_small nds-m-bottom_xxx-small slds-icon-text-default slds-icon_xx-small">
                            <use xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                          </svg><span class="nds-assistive-text">Remove Multiselect</span></c-icon>
                      </button></span></slot>
                </span></span>
              <div class="nds-form-element__control nds-vertical_checkbox"><span class="nds-checkbox"><input type="checkbox"
                    id="vlocity-checkbox-2-0-19" data-index="0" name="Multi-select3" value="abc"><label data-index="0"
                    for="vlocity-checkbox-2-0-19" class="nds-checkbox__label"><span class="nds-checkbox_faux"></span><span
                      class="nds-form-element__label">abc</span></label></span><span class="nds-checkbox"><input
                    type="checkbox" id="vlocity-checkbox-2-1-19" data-index="1" name="Multi-select3" value="def"><label
                    data-index="1" for="vlocity-checkbox-2-1-19" class="nds-checkbox__label"><span
                      class="nds-checkbox_faux"></span><span class="nds-form-element__label">def</span></label></span></div>
            </fieldset>
          </div>
        </c-checkbox-group>
      </slot>
    </c-omniscript-multiselect>`)
      +
      withExample('Multi-select with readonly', `<c-omniscript-multiselect class="nds-size_12-of-12 nds-medium-size_12-of-12 nds-read-only" aria-disabled="true">
    <slot>
      <c-checkbox-group data-refresh="false">
        <div class="nds-form-element nds-form-container">
          <fieldset class="nds-form-element"><span
              class="nds-form-element__legend nds-form-element__label nds-form-element__control-help nds-radio-relative-tooltip nds-show"><span
                class="nds-m-right_x-small">Multi-select</span><span class="nds-nowrap-whitespace">
                <slot name="label"></slot>
              </span></span>
            <div class="nds-form-element__control nds-vertical_checkbox"><span class="nds-checkbox"><input type="checkbox"
                  id="vlocity-checkbox-3-0-22" data-index="0" name="Multi-select4" value="abc" tabindex="-1"><label
                  data-index="0" for="vlocity-checkbox-3-0-22" class="nds-checkbox__label"><span
                    class="nds-checkbox_faux"></span><span class="nds-form-element__label">abc</span></label></span><span
                class="nds-checkbox"><input type="checkbox" id="vlocity-checkbox-3-1-22" data-index="1"
                  name="Multi-select4" value="def" tabindex="-1"><label data-index="1" for="vlocity-checkbox-3-1-22"
                  class="nds-checkbox__label"><span class="nds-checkbox_faux"></span><span
                    class="nds-form-element__label">def</span></label></span></div>
          </fieldset>
        </div>
      </c-checkbox-group>
    </slot>
  </c-omniscript-multiselect>`)
      +
      withExample('Multi-select with error', `<c-omniscript-multiselect class="nds-size_12-of-12 nds-medium-size_12-of-12">
      <slot>
        <c-checkbox-group data-refresh="false">
          <div class="nds-form-element nds-form-container nds-has-error">
            <fieldset class="nds-form-element"><span
                class="nds-form-element__legend nds-form-element__label nds-form-element__control-help nds-radio-relative-tooltip nds-show"><abbr
                  title="Required" class="nds-required">*</abbr><span class="nds-m-right_x-small">Multi-select1</span><span
                  class="nds-nowrap-whitespace">
                  <slot name="label"></slot>
                </span></span>
              <div class="nds-form-element__control nds-vertical_checkbox"><span class="nds-checkbox"><input type="checkbox"
                    required="" id="vlocity-checkbox-0-0-12" data-index="0" name="Multi-select1" value="abc"><label
                    data-index="0" for="vlocity-checkbox-0-0-12" class="nds-checkbox__label"><span
                      class="nds-checkbox_faux"></span><span class="nds-form-element__label">abc</span></label></span><span
                  class="nds-checkbox"><input type="checkbox" required="" id="vlocity-checkbox-0-1-12" data-index="1"
                    name="Multi-select1" value="def"><label data-index="1" for="vlocity-checkbox-0-1-12"
                    class="nds-checkbox__label"><span class="nds-checkbox_faux"></span><span
                      class="nds-form-element__label">def</span></label></span></div>
            </fieldset>
            <div class="nds-form-element__help nds-form-element__help_text-transform__none">Required</div>
          </div>
        </c-checkbox-group>
      </slot>
    </c-omniscript-multiselect>`);
  })
  .add('Multi-select (Horizontal)', () => {
    return withExample('Multi-select required', `<c-omniscript-multiselect class="nds-size_12-of-12 nds-medium-size_12-of-12">
    <slot>
      <c-checkbox-group data-refresh="false">
        <div class="nds-form-element nds-form-container">
          <fieldset class="nds-form-element"><span
              class="nds-form-element__legend nds-form-element__label nds-form-element__control-help nds-radio-relative-tooltip nds-show"><abbr
                title="Required" class="nds-required">*</abbr><span class="nds-m-right_x-small">Multi-select</span><span
                class="nds-nowrap-whitespace">
                <slot name="label"></slot>
              </span></span>
            <div class="nds-form-element__control nds-horizontal_checkbox"><span class="nds-checkbox"><input type="checkbox"
                  required="" id="vlocity-checkbox-0-0-12" data-index="0" name="Multi-select1" value="abc"><label
                  data-index="0" for="vlocity-checkbox-0-0-12" class="nds-checkbox__label"><span
                    class="nds-checkbox_faux"></span><span class="nds-form-element__label">abc</span></label></span><span
                class="nds-checkbox"><input type="checkbox" required="" id="vlocity-checkbox-0-1-12" data-index="1"
                  name="Multi-select1" value="def"><label data-index="1" for="vlocity-checkbox-0-1-12"
                  class="nds-checkbox__label"><span class="nds-checkbox_faux"></span><span
                    class="nds-form-element__label">def</span></label></span></div>
          </fieldset>
        </div>
      </c-checkbox-group>
    </slot>
  </c-omniscript-multiselect>`)
      +
      withExample('Multi-select with tooltip', `<c-omniscript-multiselect class="nds-size_12-of-12 nds-medium-size_12-of-12">
    <slot>
      <c-checkbox-group data-refresh="false">
        <div class="nds-form-element nds-form-container">
          <fieldset class="nds-form-element"><span
              class="nds-form-element__legend nds-form-element__label nds-form-element__control-help nds-radio-relative-tooltip nds-show"><span
                class="nds-m-right_x-small">Multi-select</span><span class="nds-nowrap-whitespace">
                <c-tooltip class="nds-tooltip__container" vloc_mg-tooltip_tooltip-host=""><span vloc_mg-tooltip_tooltip=""
                    style="position: relative;">
                    <c-button vloc_mg-tooltip_tooltip="" tabindex="0" aria-describedby="help-15" aria-disabled="true">
                      <button type="button" label="utility:info" class="vlocity-btn nds-button nds-button_icon">
                        <c-icon><svg aria-hidden="true" class="nds-button__icon nds-icon_xx-small">
                            <use xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#info"></use>
                          </svg><span class="nds-assistive-text"></span></c-icon><span aria-label="Multi-select Tooltip"
                          class="btnLabel"></span>
                      </button></c-button><span vloc_mg-tooltip_tooltip="" role="tooltip" id="help-15"
                      class="nds-popover nds-nubbin_bottom-left nds-popover_tooltip nds-fall-into-ground bottom-left tooltipSection"
                      style="white-space: normal;">
                      <div vloc_mg-tooltip_tooltip="" class="nds-popover__body">Multi-select Tooltip</div>
                    </span>
                  </span></c-tooltip>
                <slot name="label"></slot>
              </span></span>
            <div class="nds-form-element__control nds-horizontal_checkbox"><span class="nds-checkbox"><input type="checkbox"
                  id="vlocity-checkbox-1-0-14" data-index="0" name="Multi-select2" value="abc"><label data-index="0"
                  for="vlocity-checkbox-1-0-14" class="nds-checkbox__label"><span class="nds-checkbox_faux"></span><span
                    class="nds-form-element__label">abc</span></label></span><span class="nds-checkbox"><input
                  type="checkbox" id="vlocity-checkbox-1-1-14" data-index="1" name="Multi-select2" value="def"><label
                  data-index="1" for="vlocity-checkbox-1-1-14" class="nds-checkbox__label"><span
                    class="nds-checkbox_faux"></span><span class="nds-form-element__label">def</span></label></span></div>
          </fieldset>
        </div>
      </c-checkbox-group>
    </slot>
  </c-omniscript-multiselect>`)
      +
      withExample('Multi-select with repeat', `<c-omniscript-multiselect class="nds-size_12-of-12 nds-medium-size_12-of-12">
      <slot>
        <c-checkbox-group data-refresh="false">
          <div class="nds-form-element nds-form-container">
            <fieldset class="nds-form-element"><span
                class="nds-form-element__legend nds-form-element__label nds-form-element__control-help nds-radio-relative-tooltip nds-show"><span
                  class="nds-m-right_x-small">Multi-select</span><span class="nds-nowrap-whitespace">
                  <slot name="label"><span slot="label" role="group"
                      class="omni-repeat-button-group nds-m-bottom_xx-small"><button
                        class="nds-button_reset nds-m-right_x-small">
                        <c-icon><svg aria-hidden="true"
                            class="slds-icon nds-button__icon nds-button__icon_small nds-m-bottom_xxx-small slds-icon-text-default slds-icon_xx-small">
                            <use xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#add"></use>
                          </svg><span class="nds-assistive-text">Repeat Multiselect</span></c-icon>
                      </button><button class="nds-button_reset nds-m-right_x-small">
                        <c-icon><svg aria-hidden="true"
                            class="slds-icon nds-button__icon nds-button__icon_small nds-m-bottom_xxx-small slds-icon-text-default slds-icon_xx-small">
                            <use xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                          </svg><span class="nds-assistive-text">Remove Multiselect</span></c-icon>
                      </button></span></slot>
                </span></span>
              <div class="nds-form-element__control nds-horizontal_checkbox"><span class="nds-checkbox"><input type="checkbox"
                    id="vlocity-checkbox-2-0-19" data-index="0" name="Multi-select3" value="abc"><label data-index="0"
                    for="vlocity-checkbox-2-0-19" class="nds-checkbox__label"><span class="nds-checkbox_faux"></span><span
                      class="nds-form-element__label">abc</span></label></span><span class="nds-checkbox"><input
                    type="checkbox" id="vlocity-checkbox-2-1-19" data-index="1" name="Multi-select3" value="def"><label
                    data-index="1" for="vlocity-checkbox-2-1-19" class="nds-checkbox__label"><span
                      class="nds-checkbox_faux"></span><span class="nds-form-element__label">def</span></label></span></div>
            </fieldset>
          </div>
        </c-checkbox-group>
      </slot>
    </c-omniscript-multiselect>`)
      +
      withExample('Multi-select with readonly', `<c-omniscript-multiselect class="nds-size_12-of-12 nds-medium-size_12-of-12 nds-read-only" aria-disabled="true">
    <slot>
      <c-checkbox-group data-refresh="false">
        <div class="nds-form-element nds-form-container">
          <fieldset class="nds-form-element"><span
              class="nds-form-element__legend nds-form-element__label nds-form-element__control-help nds-radio-relative-tooltip nds-show"><span
                class="nds-m-right_x-small">Multi-select</span><span class="nds-nowrap-whitespace">
                <slot name="label"></slot>
              </span></span>
            <div class="nds-form-element__control nds-horizontal_checkbox"><span class="nds-checkbox"><input type="checkbox"
                  id="vlocity-checkbox-3-0-22" data-index="0" name="Multi-select4" value="abc" tabindex="-1"><label
                  data-index="0" for="vlocity-checkbox-3-0-22" class="nds-checkbox__label"><span
                    class="nds-checkbox_faux"></span><span class="nds-form-element__label">abc</span></label></span><span
                class="nds-checkbox"><input type="checkbox" id="vlocity-checkbox-3-1-22" data-index="1"
                  name="Multi-select4" value="def" tabindex="-1"><label data-index="1" for="vlocity-checkbox-3-1-22"
                  class="nds-checkbox__label"><span class="nds-checkbox_faux"></span><span
                    class="nds-form-element__label">def</span></label></span></div>
          </fieldset>
        </div>
      </c-checkbox-group>
    </slot>
  </c-omniscript-multiselect>`)
      +
      withExample('Multi-select with error', `<c-omniscript-multiselect class="nds-size_12-of-12 nds-medium-size_12-of-12">
      <slot>
        <c-checkbox-group data-refresh="false">
          <div class="nds-form-element nds-form-container nds-has-error">
            <fieldset class="nds-form-element"><span
                class="nds-form-element__legend nds-form-element__label nds-form-element__control-help nds-radio-relative-tooltip nds-show"><abbr
                  title="Required" class="nds-required">*</abbr><span class="nds-m-right_x-small">Multi-select1</span><span
                  class="nds-nowrap-whitespace">
                  <slot name="label"></slot>
                </span></span>
              <div class="nds-form-element__control nds-horizontal_checkbox"><span class="nds-checkbox"><input type="checkbox"
                    required="" id="vlocity-checkbox-0-0-12" data-index="0" name="Multi-select1" value="abc"><label
                    data-index="0" for="vlocity-checkbox-0-0-12" class="nds-checkbox__label"><span
                      class="nds-checkbox_faux"></span><span class="nds-form-element__label">abc</span></label></span><span
                  class="nds-checkbox"><input type="checkbox" required="" id="vlocity-checkbox-0-1-12" data-index="1"
                    name="Multi-select1" value="def"><label data-index="1" for="vlocity-checkbox-0-1-12"
                    class="nds-checkbox__label"><span class="nds-checkbox_faux"></span><span
                      class="nds-form-element__label">def</span></label></span></div>
            </fieldset>
            <div class="nds-form-element__help nds-form-element__help_text-transform__none">Required</div>
          </div>
        </c-checkbox-group>
      </slot>
    </c-omniscript-multiselect>`);
  })
  .add('Multi-select (Image)', () => {
    const imageSet = `<div class="nds-img-item_select-container">
      <img src="/assets/images/placeholder-img@16x9.jpg" alt="abc" title="abc" class="nds-img-item">
    </div>
    <div class="nds-caption-out_cont nds-p-top_none">
      <span class="captionOut nds-form-element__label">abc</span>
    </div>`;
    const imageUnset = `<div class="nds-img-item_select-container">
      <span class="nds-img-item-caption">abc</span>
    </div>`;

    let stateValue = radios('State', {
      'With Image': 'With Image',
      'Without Image': 'Without Image'
    }, 'With Image');
    if (stateValue === '' || stateValue == null) {
      stateValue = 'With Image';
    }
    const resolvedValue = stateValue === 'With Image' ? imageSet : imageUnset;

    return withExample('Multi-select required', `<c-omniscript-multiselect class="nds-size_12-of-12 nds-medium-size_12-of-12">
    <slot>
      <c-checkbox-image-group data-refresh="false" data-omni-input="" class="nds-size_1-of-1">
        <div class="nds-form-element nds-form-container">
          <fieldset>
            <div class="nds-form-element__control"><span
                class="nds-form-element__legend nds-form-element__label nds-form-element__control-help nds-radio-relative-tooltip nds-show"><abbr
                  title="required" class="nds-required">*</abbr><span
                  class="nds-m-right_x-small">Multi-select</span><span class="nds-nowrap-whitespace">
                  <slot name="label"></slot>
                </span></span>
              <div>
                <div
                  class="nds-checkbox nds-checkbox_custom-group nds-float_left vlc-img-wrapper nds-img-wrapper_cont nds-size_1-of-3"
                  style="padding-top: 100px;"><input type="checkbox" required="" name="Multi-select1"
                    id="vlocity-checkbox-0-0-12" value="abc"><label for="vlocity-checkbox-0-0-12"
                    class="nds-checkbox__label vlc-img_select-container nds-img_select-cont nds-img_no-width-height nds-m-bottom_none">
                    ${resolvedValue}
                  </label></div>
              </div>
            </div>
          </fieldset>
        </div>
      </c-checkbox-image-group>
    </slot>
  </c-omniscript-multiselect>`)
      +
      withExample('Multi-select with tooltip', `<c-omniscript-multiselect class="nds-size_12-of-12 nds-medium-size_12-of-12">
      <slot>
        <c-checkbox-image-group data-refresh="false" data-omni-input="" class="nds-size_1-of-1">
          <div class="nds-form-element nds-form-container">
            <fieldset>
              <div class="nds-form-element__control"><span
                  class="nds-form-element__legend nds-form-element__label nds-form-element__control-help nds-radio-relative-tooltip nds-show"><span
                    class="nds-m-right_x-small">Multi-select</span><span class="nds-nowrap-whitespace">
                    <c-tooltip class="nds-tooltip__container" vloc_mg-tooltip_tooltip-host=""><span
                        style="position: relative;">
                        <c-button tabindex="0" aria-describedby="help-15" aria-disabled="true">
                          <button type="button" label="utility:info" class="vlocity-btn nds-button nds-button_icon">
                            <c-icon><svg aria-hidden="true" class="nds-button__icon nds-icon_xx-small">
                                <use xlink:href="./assets/icons/utility-sprite/svg/symbols.svginfo"></use>
                              </svg><span class="nds-assistive-text"></span></c-icon><span aria-label="Multi-select Tooltip"
                              class="btnLabel"></span>
                          </button></c-button><span role="tooltip" id="help-15"
                          class="nds-popover nds-nubbin_bottom-left nds-popover_tooltip bottom-left tooltipSection nds-fall-into-ground"
                          style="white-space: normal;">
                          <div class="nds-popover__body">Multi-select Tooltip</div>
                        </span>
                      </span></c-tooltip>
                    <slot name="label"></slot>
                  </span></span>
                <div>
                  <div
                    class="nds-checkbox nds-checkbox_custom-group nds-float_left vlc-img-wrapper nds-img-wrapper_cont nds-size_1-of-3"
                    style="padding-top: 100px;"><input type="checkbox" name="Multi-select2" id="vlocity-checkbox-1-0-14"
                      value="abc"><label for="vlocity-checkbox-1-0-14"
                      class="nds-checkbox__label vlc-img_select-container nds-img_select-cont nds-img_no-width-height nds-m-bottom_none">
                      ${resolvedValue}
                    </label></div>
                </div>
              </div>
            </fieldset>
          </div>
        </c-checkbox-image-group>
      </slot>
    </c-omniscript-multiselect>`)
      +
      withExample('Multi-select with repeat', `<c-omniscript-multiselect class="nds-size_12-of-12 nds-medium-size_12-of-12">
      <slot>
        <c-checkbox-image-group data-refresh="false" class="nds-size_1-of-1">
          <div class="nds-form-element nds-form-container">
            <fieldset>
              <div class="nds-form-element__control"><span
                  class="nds-form-element__legend nds-form-element__label nds-form-element__control-help nds-radio-relative-tooltip nds-show"><span
                    class="nds-m-right_x-small">Multi-select</span><span class="nds-nowrap-whitespace">
                    <slot name="label"><span slot="label" role="group"
                        class="omni-repeat-button-group nds-m-bottom_xx-small"><button
                          class="nds-button_reset nds-m-right_x-small">
                          <c-icon><svg aria-hidden="true"
                              class="slds-icon nds-button__icon nds-button__icon_small nds-m-bottom_xxx-small slds-icon-text-default slds-icon_xx-small">
                              <use xlink:href="./assets/icons/utility-sprite/svg/symbols.svgadd"></use>
                            </svg><span class="nds-assistive-text">Repeat Multiselect</span></c-icon>
                        </button><button class="nds-button_reset nds-m-right_x-small">
                          <c-icon><svg aria-hidden="true"
                              class="slds-icon nds-button__icon nds-button__icon_small nds-m-bottom_xxx-small slds-icon-text-default slds-icon_xx-small">
                              <use xlink:href="./assets/icons/utility-sprite/svg/symbols.svgclose"></use>
                            </svg><span class="nds-assistive-text">Remove Multiselect</span></c-icon>
                        </button></span></slot>
                  </span></span>
                <div>
                  <div
                    class="nds-checkbox nds-checkbox_custom-group nds-float_left vlc-img-wrapper nds-img-wrapper_cont nds-size_1-of-3"
                    style="padding-top: 100px;"><input type="checkbox" name="Multi-select3" id="vlocity-checkbox-4-0-25"
                      value="abc"><label for="vlocity-checkbox-4-0-25"
                      class="nds-checkbox__label vlc-img_select-container nds-img_select-cont nds-img_no-width-height nds-m-bottom_none">
                      ${resolvedValue}
                    </label></div>
                </div>
              </div>
            </fieldset>
          </div>
        </c-checkbox-image-group>
      </slot>
    </c-omniscript-multiselect>`)
      +
      withExample('Multi-select with readonly', `<c-omniscript-multiselect class="nds-size_12-of-12 nds-medium-size_12-of-12 nds-read-only" aria-disabled="true">
      <slot>
        <c-checkbox-image-group data-refresh="false" class="nds-size_1-of-1">
          <div class="nds-form-element nds-form-container">
            <fieldset>
              <div class="nds-form-element__control"><span
                  class="nds-form-element__legend nds-form-element__label nds-form-element__control-help nds-radio-relative-tooltip nds-show"><span
                    class="nds-m-right_x-small">Multi-select1</span><span class="nds-nowrap-whitespace">
                    <slot name="label"></slot>
                  </span></span>
                <div>
                  <div
                    class="nds-checkbox nds-checkbox_custom-group nds-float_left vlc-img-wrapper nds-img-wrapper_cont nds-size_1-of-3"
                    style="padding-top: 100px;"><input type="checkbox" name="Multi-select4" id="vlocity-checkbox-3-0-22"
                      value="abc" tabindex="-1"><label for="vlocity-checkbox-3-0-22"
                      class="nds-checkbox__label vlc-img_select-container nds-img_select-cont nds-img_no-width-height nds-m-bottom_none">
                      ${resolvedValue}
                    </label></div>
                </div>
              </div>
            </fieldset>
          </div>
        </c-checkbox-image-group>
      </slot>
    </c-omniscript-multiselect>`)
      +
      withExample('Multi-select with error', `<c-omniscript-multiselect class="nds-size_12-of-12 nds-medium-size_12-of-12">
      <slot>
        <c-checkbox-image-group data-refresh="false" data-omni-input="" class="nds-size_1-of-1">
          <div class="nds-form-element nds-form-container nds-has-error">
            <fieldset>
              <div class="nds-form-element__control"><span
                  class="nds-form-element__legend nds-form-element__label nds-form-element__control-help nds-radio-relative-tooltip nds-show"><abbr
                    title="required" class="nds-required">*</abbr><span class="nds-m-right_x-small">Multi-select</span><span
                    class="nds-nowrap-whitespace">
                    <slot name="label"></slot>
                  </span></span>
                <div>
                  <div
                    class="nds-checkbox nds-checkbox_custom-group nds-float_left vlc-img-wrapper nds-img-wrapper_cont nds-size_1-of-3"
                    style="padding-top: 100px;"><input type="checkbox" required="" name="Multi-select1"
                      id="vlocity-checkbox-0-0-12" value="abc"><label for="vlocity-checkbox-0-0-12"
                      class="nds-checkbox__label vlc-img_select-container nds-img_select-cont nds-img_no-width-height nds-m-bottom_none">
                      ${resolvedValue}
                    </label></div>
                </div>
              </div>
            </fieldset>
            <div class="nds-form-element__help nds-form-element__help_text-transform__none">Required</div>
          </div>
        </c-checkbox-image-group>
      </slot>
    </c-omniscript-multiselect>`);
  })
  .add('Step', () => {
    return withExample(`<h1 class="nds-page-header__title nds-align_absolute-center nds-text-align_center nds-medium-size_8-of-12 nds-p-vertical_large nds-step_label">Step Title</h1>
    <div class="nds-medium-size_8-of-12 nds-align_absolute-center">
      <div class="nds-grid nds-wrap nds-col_padded nds-size_1-of-1 omniscript-step__body-nds">
        Step Body
      </div>
    </div>`);
  })
  .add('Text Block', () => {
    return withExample(`
      <div class="nds-form-element nds-form-container nds-text-block">
      <lightning-formatted-rich-text class="nds-rich-text-editor__output"><span>
      <p><strong>This is a text block</strong></p>
      </span></lightning-formatted-rich-text>
      </div>`);
  })
  .add('Text', () => {
    return withExample('Text with required flag', `<c-input class="nds-container_fluid">
      <div class="nds-form-element nds-form-container">
        <div class="nds-form-element__control nds-form-element__control-animated-label">
          <input id="input1-12" maxlength="255" minlength="0" type="text" data-isnumber="false" placeholder="placeholder" class="vlocity-input nds-input nds-input_mask">
          <div class="nds-form-element__label nds-align-middle nds-animated-label__ease-out">
            <label aria-label="Text" for="input1-12" data-label="true">Text<abbr class="nds-required nds-p-left_xx-small">*</abbr></label>
          </div>
        </div>
      </div>
    </c-input>`)
      +
      withExample('Text with tooltip', 'Note: the tooltip is not visible here because JavaScript is used in the underlying component to ensure it is positioned correctly',
        `<c-input class="nds-container_fluid">
          <div class="nds-form-element nds-form-container">
            <div class="nds-form-element__control nds-form-element__control-animated-label">
              <input id="input3-14" maxlength="255" minlength="0" type="text" data-isnumber="false" required="" placeholder="placeholder" class="vlocity-input nds-input nds-input_mask">
              <div class="nds-form-element__label nds-align-middle nds-animated-label__ease-out">
                <label aria-label="Text" for="input3-14" data-label="true">Text<abbr class="nds-required nds-p-left_xx-small">*</abbr></label>
                <c-tooltip data-field-level-help="" class="nds-tooltip__container">
                  <span style="position: relative;">
                    <c-button tabindex="0" aria-describedby="help-15" aria-disabled="true">
                      <button type="button" label="utility:info" class="vlocity-btn nds-button nds-button_icon">
                        <c-icon>
                          <svg aria-hidden="true" class="nds-button__icon nds-icon_xx-small">
                            <use xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#info"></use>
                          </svg>
                          <span class="nds-assistive-text"></span>
                        </c-icon>
                        <span aria-label="Tooltip Text" class="btnLabel"></span>
                      </button>
                    </c-button>
                    <span role="tooltip" id="help-15" class="nds-popover nds-nubbin_bottom-left nds-popover_tooltip nds-fall-into-ground bottom-left tooltipSection" style="white-space: normal;">
                      <div class="nds-popover__body">Tooltip Text</div>
                    </span>
                  </span>
                </c-tooltip>
              </div>
            </div>
          </div>
        </c-input>`)
      +
      withExample('Text with error message', `
        <c-input class="nds-container_fluid">
          <div class="nds-form-element nds-form-container nds-has-error">
            <div class="nds-form-element__control nds-form-element__control-animated-label">
              <input id="input5-19" pattern="abc" maxlength="255" minlength="0" type="text" data-isnumber="false" placeholder="placeholder" class="vlocity-input nds-input nds-input_mask nds-not-empty nds-is-dirty" aria-describedby="errorMessageBlock-19">
              <div class="nds-form-element__label nds-align-middle nds-animated-label__ease-out">
                <label aria-label="Text" for="input5-19" data-label="true">Text</label>
              </div>
            </div>
            <div aria-live="assertive" id="errorMessageBlock-19" class="nds-form-element__help nds-size_1-of-1">Value does not match pattern</div>
          </div>
        </c-input>`)
      +
      withExample('Text with repeat', `
        <c-input class="nds-container_fluid nds-input-has-icon_right">
          <div class="nds-form-element nds-form-container">
            <div class="nds-form-element__control nds-form-element__control-animated-label">
              <input id="input7-21" maxlength="255" minlength="0" type="text" data-isnumber="false" required="" placeholder="placeholder" class="vlocity-input nds-input nds-input_mask">
              <div class="nds-form-element__label nds-align-middle nds-animated-label__ease-out">
                <label aria-label="Text" for="input7-21" data-label="true">Text<abbr class="nds-required nds-p-left_xx-small">*</abbr></label>
                <slot name="label">
                  <span slot="label" role="group" class="omni-repeat-button-group nds-button-group nds-m-right_x-small nds-tooltip__container" style="bottom: 7px; right: -11px;">
                    <button class="nds-button_reset nds-m-right_x-small vlocity-btn nds-button nds-button_icon">
                      <c-icon>
                        <svg aria-hidden="true" class="slds-icon nds-button__icon nds-button__icon_small slds-icon-text-default slds-icon_xx-small">
                          <use xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#add"></use>
                        </svg>
                        <span class="nds-assistive-text">Save Text and add a new field</span>
                      </c-icon>
                    </button>
                    <button class="nds-button_reset nds-m-right_x-small vlocity-btn nds-button nds-button_icon">
                      <c-icon>
                        <svg aria-hidden="true" class="slds-icon nds-button__icon nds-button__icon_small slds-icon-text-default slds-icon_xx-small">
                          <use xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                        </svg>
                        <span class="nds-assistive-text">Delete Text and remove the field</span>
                      </c-icon>
                    </button>
                  </span>
                </slot>
              </div>
            </div>
          </div>
        </c-input>
      `)
      +
      withExample('Readonly text', `
      <c-input class="nds-container_fluid">
        <div class="nds-form-element nds-form-container">
          <div class="nds-form-element__control nds-form-element__control-animated-label"><input id="input9-24"
              maxlength="255" minlength="0" type="text" data-isnumber="false" required="" placeholder="placeholder"
              class="vlocity-input nds-input nds-input_mask" tabindex="-1">
            <div class="nds-form-element__label nds-align-middle nds-animated-label__ease-out"><label
                aria-label="Text readonly" for="input9-24" data-label="true">Text readonly<abbr
                  class="nds-required nds-p-left_xx-small">*</abbr></label>
              <slot name="label"></slot>
            </div>
          </div>
        </div>
      </c-input>`);
  });
