/* eslint-env browser */
import { storiesOf } from '@storybook/html';
import { withKnobs, radios } from '@storybook/addon-knobs';
import base from 'paths.macro';
import notes from './doc.md';
import {
  withExample,
  withExampleAndHeight,
  withDocs,
} from '../../../../../scripts/storybook';

storiesOf(`${base}`.replace(/(^\/)|(\/$)/g, ''), module)
  .addDecorator(withKnobs)
  .addDecorator(withDocs(notes))
  .add('Action Block', () => {
    return withExample('Action Block', `<div class="nds-is-relative nds-p-around_x-small nds-m-bottom_x-small">
    <c-button>
      <button type="button" label="Action Block" class="vlocity-btn nds-button nds-button_brand nds-button_stretch">
        <span class="btnLabel">Action Block</span>
      </button>
    </c-button>
  </div>`);
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
  .add('Radio Group', () => {
    return withExample('Radio Group', `<c-omniscript-radio-group data-omni-key="RadioGroup1"
    class="nds-size_12-of-12 nds-medium-size_12-of-12">
    <slot>
        <fieldset class="nds-form-element nds-form-container nds-m-top_small">
            <label
                class="nds-form-element__legend nds-form-element__label nds-form-element__control-help nds-radio-relative-tooltip">
                <span>Radio Group</span>
            </label>
            <div class="nds-grid nds-grid_vertical nds-form-element">
                <div class="nds-grid">
                    <div class="nds-p-right_small nds-size_6-of-12"></div>
                    <div class="nds-grid nds-size_6-of-12">
                        <label class="nds-form-element__label" style="width: 50%;">
                            <strong></strong>
                        </label>
                        <label class="nds-form-element__label" style="width: 50%;">
                            <strong></strong>
                        </label>
                    </div>
                </div>
                <div class="nds-grid nds-p-bottom_small">
                    <div class="nds-p-right_small nds-size_6-of-12">
                        <span>Person 1</span>
                    </div>
                    <div class="nds-grid nds-size_6-of-12">
                        <label class="nds-radio" style="width: 50%;">
                            <input type="radio" data-row="0" data-col="0" name="RadioGroup1-0" data-omni-input="" value="ABC">
                                <span class="nds-radio--faux"></span>
                                <span class="nds-form-element__label">abc</span>
                        </label>
                        <label  class="nds-radio" style="width: 50%;">
                            <input type="radio" data-row="0" data-col="1" name="RadioGroup1-0" data-omni-input="" value="DEF">
                            <span class="nds-radio--faux"></span>
                            <span class="nds-form-element__label">def</span>
                        </label>
                    </div>
                </div>
                <div class="nds-grid nds-p-bottom_small">
                    <div class="rlabels nds-p-right_small nds-size_6-of-12">
                        <span>Person 2</span>
                    </div>
                    <div class="nds-grid nds-size_6-of-12">
                        <label class="nds-radio" style="width: 50%;">
                            <input type="radio" data-row="1" data-col="0" name="RadioGroup1-1" data-omni-input="" value="ABC">
                            <span class="nds-radio--faux"></span>
                            <span class="nds-form-element__label">abc</span>
                        </label>
                        <label class="nds-radio" style="width: 50%;">
                            <input type="radio" data-row="1" data-col="1" name="RadioGroup1-1" data-omni-input="" value="DEF">
                            <span class="nds-radio--faux"></span>
                            <span class="nds-form-element__label">def</span>
                        </label>
                    </div>
                </div>
            </div>
            <div class="nds-has-error nds-m-top_none"></div>
        </fieldset>
    </slot>
</c-omniscript-radio-group>`) +
      withExample('Radio Group (selected)', `<c-omniscript-radio-group data-omni-key="RadioGroup1"
class="nds-size_12-of-12 nds-medium-size_12-of-12">
<slot>
    <fieldset class="nds-form-element nds-form-container nds-m-top_small">
        <label
            class="nds-form-element__legend nds-form-element__label nds-form-element__control-help nds-radio-relative-tooltip">
            <span>Radio Group</span>
        </label>
        <div class="nds-grid nds-grid_vertical nds-form-element">
            <div class="nds-grid">
                <div class="nds-p-right_small nds-size_6-of-12"></div>
                <div class="nds-grid nds-size_6-of-12">
                    <label class="nds-form-element__label" style="width: 50%;">
                        <strong></strong>
                    </label>
                    <label class="nds-form-element__label" style="width: 50%;">
                        <strong></strong>
                    </label>
                </div>
            </div>
            <div class="nds-grid nds-p-bottom_small">
                <div class="nds-p-right_small nds-size_6-of-12">
                    <span>Person 1</span>
                </div>
                <div class="nds-grid nds-size_6-of-12">
                    <label class="nds-radio" style="width: 50%;">
                        <input type="radio" data-row="0" data-col="0" name="RadioGroup1-0" data-omni-input="" value="ABC" checked>
                            <span class="nds-radio--faux"></span>
                            <span class="nds-form-element__label">abc</span>
                    </label>
                    <label  class="nds-radio" style="width: 50%;">
                        <input type="radio" data-row="0" data-col="1" name="RadioGroup1-0" data-omni-input="" value="DEF">
                        <span class="nds-radio--faux"></span>
                        <span class="nds-form-element__label">def</span>
                    </label>
                </div>
            </div>
            <div class="nds-grid nds-p-bottom_small">
                <div class="rlabels nds-p-right_small nds-size_6-of-12">
                    <span>Person 2</span>
                </div>
                <div class="nds-grid nds-size_6-of-12">
                    <label class="nds-radio" style="width: 50%;">
                        <input type="radio" data-row="1" data-col="0" name="RadioGroup1-1" data-omni-input="" value="ABC">
                        <span class="nds-radio--faux"></span>
                        <span class="nds-form-element__label">abc</span>
                    </label>
                    <label class="nds-radio" style="width: 50%;">
                        <input type="radio" data-row="1" data-col="1" name="RadioGroup1-1" data-omni-input="" value="DEF" checked>
                        <span class="nds-radio--faux"></span>
                        <span class="nds-form-element__label">def</span>
                    </label>
                </div>
            </div>
        </div>
        <div class="nds-has-error nds-m-top_none"></div>
    </fieldset>
</slot>
</c-omniscript-radio-group>`) +
      withExample('Radio Group (required)', `<c-omniscript-radio-group data-omni-key="RadioGroup1"
      class="nds-size_12-of-12 nds-medium-size_12-of-12">
      <slot>
          <fieldset class="nds-form-element nds-form-container nds-m-top_small">
              <label
                  class="nds-form-element__legend nds-form-element__label nds-form-element__control-help nds-radio-relative-tooltip">
                  <abbr title="required" class="nds-required">*</abbr>
                  <span>RadioGroup1</span>
              </label>
              <div class="nds-grid nds-grid_vertical nds-form-element">
                  <div class="nds-grid">
                      <div class="nds-p-right_small nds-size_6-of-12"></div>
                      <div class="nds-grid nds-size_6-of-12">
                          <label class="nds-form-element__label" style="width: 50%;">
                              <strong></strong>
                          </label>
                          <label class="nds-form-element__label" style="width: 50%;">
                              <strong></strong>
                          </label>
                      </div>
                  </div>
                  <div class="nds-grid nds-p-bottom_small">
                      <div class="nds-p-right_small nds-size_6-of-12">
                          <span>Person 1</span>
                      </div>
                      <div class="nds-grid nds-size_6-of-12">
                          <label class="nds-radio" style="width: 50%;">
                              <input type="radio" data-row="0" data-col="0" name="RadioGroup1-0" data-omni-input="" value="ABC">
                                  <span class="nds-radio--faux"></span>
                                  <span class="nds-form-element__label">abc</span>
                          </label>
                          <label  class="nds-radio" style="width: 50%;">
                              <input type="radio" data-row="0" data-col="1" name="RadioGroup1-0" data-omni-input="" value="DEF">
                              <span class="nds-radio--faux"></span>
                              <span class="nds-form-element__label">def</span>
                          </label>
                      </div>
                  </div>
                  <div class="nds-grid nds-p-bottom_small">
                      <div class="rlabels nds-p-right_small nds-size_6-of-12">
                          <span>Person 2</span>
                      </div>
                      <div class="nds-grid nds-size_6-of-12">
                          <label class="nds-radio" style="width: 50%;">
                              <input type="radio" data-row="1" data-col="0" name="RadioGroup1-1" data-omni-input="" value="ABC">
                              <span class="nds-radio--faux"></span>
                              <span class="nds-form-element__label">abc</span>
                          </label>
                          <label class="nds-radio" style="width: 50%;">
                              <input type="radio" data-row="1" data-col="1" name="RadioGroup1-1" data-omni-input="" value="DEF">
                              <span class="nds-radio--faux"></span>
                              <span class="nds-form-element__label">def</span>
                          </label>
                      </div>
                  </div>
              </div>
              <div class="nds-has-error nds-m-top_none">
                  <div class="nds-form-element__help nds-form-element__help_text-transform__none">Required</div>
              </div>
          </fieldset>
      </slot>
  </c-omniscript-radio-group>`)
      +
      withExample('Radio Group (read-only)', `<c-omniscript-radio-group data-omni-key="RadioGroup1"
  class="nds-size_12-of-12 nds-medium-size_12-of-12 nds-read-only" aria-disabled="true">
  <slot>
      <fieldset class="nds-form-element nds-form-container nds-m-top_small">
          <label
              class="nds-form-element__legend nds-form-element__label nds-form-element__control-help nds-radio-relative-tooltip">
              <span>RadioGroup1</span>
          </label>
          <div class="nds-grid nds-grid_vertical nds-form-element">
              <div class="nds-grid">
                  <div class="nds-p-right_small nds-size_6-of-12"></div>
                  <div class="nds-grid nds-size_6-of-12">
                      <label class="nds-form-element__label" style="width: 50%;">
                          <strong></strong>
                      </label>
                      <label class="nds-form-element__label" style="width: 50%;">
                          <strong></strong>
                      </label>
                  </div>
              </div>
              <div class="nds-grid nds-p-bottom_small">
                  <div class="nds-p-right_small nds-size_6-of-12">
                      <span>Person 1</span>
                  </div>
                  <div class="nds-grid nds-size_6-of-12">
                      <label class="nds-radio" style="width: 50%;">
                          <input type="radio" data-row="0" data-col="0" name="RadioGroup1-0" data-omni-input="" value="ABC">
                              <span class="nds-radio--faux"></span>
                              <span class="nds-form-element__label">abc</span>
                      </label>
                      <label  class="nds-radio" style="width: 50%;">
                          <input type="radio" data-row="0" data-col="1" name="RadioGroup1-0" data-omni-input="" value="DEF">
                          <span class="nds-radio--faux"></span>
                          <span class="nds-form-element__label">def</span>
                      </label>
                  </div>
              </div>
              <div class="nds-grid nds-p-bottom_small">
                  <div class="rlabels nds-p-right_small nds-size_6-of-12">
                      <span>Person 2</span>
                  </div>
                  <div class="nds-grid nds-size_6-of-12">
                      <label class="nds-radio" style="width: 50%;">
                          <input type="radio" data-row="1" data-col="0" name="RadioGroup1-1" data-omni-input="" value="ABC">
                          <span class="nds-radio--faux"></span>
                          <span class="nds-form-element__label">abc</span>
                      </label>
                      <label class="nds-radio" style="width: 50%;">
                          <input type="radio" data-row="1" data-col="1" name="RadioGroup1-1" data-omni-input="" value="DEF">
                          <span class="nds-radio--faux"></span>
                          <span class="nds-form-element__label">def</span>
                      </label>
                  </div>
              </div>
          </div>
          <div class="nds-has-error nds-m-top_none">
          </div>
      </fieldset>
  </slot>
</c-omniscript-radio-group>`)
      +
      withExample('Radio Group (tooltip)', `<c-omniscript-radio-group data-omni-key="RadioGroup1"
class="nds-size_12-of-12 nds-medium-size_12-of-12">
<slot>
<fieldset class="nds-form-element nds-form-container nds-m-top_small">
    <label class="nds-form-element__legend nds-form-element__label nds-form-element__control-help nds-radio-relative-tooltip">
          <span>RadioGroup1</span>
          <c-tooltip class="nds-tooltip__container">
            <span style="position: relative;">
              <c-button tabindex="0" aria-describedby="help-40" aria-disabled="true">
                <button type="button" label="utility:info" class="vlocity-btn nds-button nds-button_icon">
                  <c-icon>
                    <svg aria-hidden="true" class="nds-button__icon nds-icon_xx-small">
                      <use xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#info"></use>
                    </svg>
                    <span class="nds-assistive-text"></span>
                  </c-icon>
                  <span aria-label="Tooltip"></span>
                </button>
              </c-button>
              <span role="tooltip" id="help-40" class="nds-popover nds-nubbin_bottom-left nds-popover_tooltip bottom-left nds-fall-into-ground" style="white-space: normal;">
                <div class="nds-popover__body">Tooltip</div>
              </span>
            </span>
          </c-tooltip>
    </label>
    <div class="nds-grid nds-grid_vertical nds-form-element">
        <div class="nds-grid">
            <div class="nds-p-right_small nds-size_6-of-12"></div>
            <div class="nds-grid nds-size_6-of-12">
                <label class="nds-form-element__label" style="width: 50%;">
                    <strong></strong>
                </label>
                <label class="nds-form-element__label" style="width: 50%;">
                    <strong></strong>
                </label>
            </div>
        </div>
        <div class="nds-grid nds-p-bottom_small">
            <div class="nds-p-right_small nds-size_6-of-12">
                <span>Person 1</span>
            </div>
            <div class="nds-grid nds-size_6-of-12">
                <label class="nds-radio" style="width: 50%;">
                    <input type="radio" data-row="0" data-col="0" name="RadioGroup1-0" data-omni-input="" value="ABC">
                        <span class="nds-radio--faux"></span>
                        <span class="nds-form-element__label">abc</span>
                </label>
                <label  class="nds-radio" style="width: 50%;">
                    <input type="radio" data-row="0" data-col="1" name="RadioGroup1-0" data-omni-input="" value="DEF">
                    <span class="nds-radio--faux"></span>
                    <span class="nds-form-element__label">def</span>
                </label>
            </div>
        </div>
        <div class="nds-grid nds-p-bottom_small">
            <div class="rlabels nds-p-right_small nds-size_6-of-12">
                <span>Person 2</span>
            </div>
            <div class="nds-grid nds-size_6-of-12">
                <label class="nds-radio" style="width: 50%;">
                    <input type="radio" data-row="1" data-col="0" name="RadioGroup1-1" data-omni-input="" value="ABC">
                    <span class="nds-radio--faux"></span>
                    <span class="nds-form-element__label">abc</span>
                </label>
                <label class="nds-radio" style="width: 50%;">
                    <input type="radio" data-row="1" data-col="1" name="RadioGroup1-1" data-omni-input="" value="DEF">
                    <span class="nds-radio--faux"></span>
                    <span class="nds-form-element__label">def</span>
                </label>
            </div>
        </div>
    </div>
    <div class="nds-has-error nds-m-top_none">
    </div>
</fieldset>
</slot>
</c-omniscript-radio-group>`);
  })
  .add('Step', () => {
    return withExample(`<h1 class="nds-page-header__title nds-align_absolute-center nds-text-align_center nds-medium-size_8-of-12 nds-p-vertical_large nds-step_label">Step Title</h1>
    <div class="nds-medium-size_8-of-12 nds-align_absolute-center">
      <div class="nds-grid nds-wrap nds-col_padded nds-size_1-of-1 omniscript-step__body-nds">
        Step Body
      </div>
    </div>`);
  })
  .add('Type Ahead Block', () => {
    return '<p>Type Ahead Block stories coming soon...</p>';
  });
