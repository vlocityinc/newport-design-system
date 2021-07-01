import { storiesOf } from '@storybook/html';
import base from 'paths.macro';
import notes from './doc.md';
import scss from './base/_index.scss';
import {
  withExample,
  withDocs,
  commentToHTML
} from '../../../scripts/storybook';

storiesOf(`${base}`.replace(/(^\/)|(\/$)/g, ''),  module)
  .addDecorator(withDocs(notes))
  .addDecorator(commentToHTML(scss))
  .add('Cards', () => {
    return withExample(`<div
    class="nds-grid nds-wrap nds-size_1-of-1 nds-is-relative nds-size_12-of-12">
    <div class="nds-size_1-of-1 nds-m-vertical_small">
        <div class="nds-element_text-font">
            <label aria-label="Contacts" aria-live="polite" class="nds-m-horizontal_small nds-text-heading_small nds-text">Contacts</label>
        </div>
    </div>
    <div class="nds-size_12-of-12 nds-large-size_3-of-12 nds-medium-size_6-of-12">
        <div class="nds-p-horizontal_small">
            <div class="nds-grid nds-wrap nds-element_text-font">
            <div class="nds-size_1-of-1 nds-show">
            <div role="button" tabindex="0"
                class="nds-box nds-box_x-small nds-grid nds-grid_vertical nds-grid_vertical-align-center nds-is-relative nds-size_12-of-12 nds-m-right_medium nds-m-bottom_medium  nds-edit-block_shortcards">
                <div class="nds-dropdown-trigger nds-dropdown-trigger_click nds-is-open nds-col_bump-left">
                    <button type="button" aria-haspopup="true" title="Show More"
                        class="nds-button nds-button_icon-border-filled nds-editblock_action-button nds-element_text-font">
                        <svg aria-hidden="true"
                                class="nds-icon nds-input__icon nds-icon-text-default nds-icon_x-small">
                                <use
                                    xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#chevrondown">
                                </use>
                            </svg><span class="nds-assistive-text">down icon</span>
                    </button></div>
                <div class="nds-edit-block_shortcards-circle"><span
                        class="nds-icon_container nds-icon_container_circle slds-current-color omni-icon-circle"
                        style="color: rgb(21, 100, 191);">
                        <svg aria-hidden="true"
                                class="nds-icon nds-input__icon nds-icon-text-default nds-icon_large">
                                <use
                                    xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#user">
                                </use>
                            </svg><span class="nds-assistive-text">icon</span>
                    </span></div>
                <div
                    class="nds-grid nds-grid_vertical nds-grid_vertical-align-center nds-m-top_x-small nds-size_1-of-1">
                    <span class="nds-truncate">Matt</span><span class="nds-truncate">Example</span><span
                        class="nds-truncate">mexample@example.com</span></div>
                        <span class="nds-is-absolute slds-icon_container nds-icon_container--circle" style="top: -1rem; right: -1rem; background: rgb(80, 227, 194);">
                        <svg aria-hidden="true" class="nds-icon nds-input__icon nds-icon-text- nds-icon_small">
                          <use xlink:href="./assets/icons/action-sprite/svg/symbols.svg#approval"></use></svg><span class="nds-assistive-text">icon</span>
                      </span>
            </div>

        </div>
                <div class="nds-size_1-of-1 nds-hide">
                    <div class="nds-modal_custom">
                        <section role="dialog" tabindex="-1" aria-modal="true"
                            class="nds-modal nds-fade-in-open nds-modal_large">
                            <div class="nds-modal__container">
                                <header class="nds-modal__header">
                                    <h1 class="nds-text-heading_small nds-step_label">Contacts</h1>
                                </header>
                                <div class="nds-modal__content nds-p-around_medium">
                                    <slot class="nds-grid nds-wrap nds-grid_pull-padded"></slot>
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
    </div>
    <div
        class="nds-large-size_3-of-12 nds-medium-size_6-of-12 nds-m-bottom_xx-small">
        <div class="nds-p-horizontal_small">
            <div role="button" tabindex="0"
                class="nds-box nds-box_x-small nds-grid nds-grid_vertical nds-grid_vertical-align-center nds-edit-block_cards-add-card nds-edit-block_shortcards">
                <div class="nds-m-top_x-large nds-edit-block_shortcards-circle"><span
                        class="nds-icon_container nds-icon_container_circle">
                        <svg aria-hidden="true"
                                class="nds-icon nds-input__icon nds-icon-text-default nds-icon_large">
                                <use
                                    xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#user">
                                </use>
                            </svg><span class="nds-assistive-text">user icon</span>
                    </span></div>
                <div class="nds-m-top_x-small nds-size_1-of-1 nds-text-align_center nds-edit-block_shortcards-add-icon">
                    <svg aria-hidden="true"
                            class="nds-icon nds-input__icon nds-button__icon nds-button__icon_small nds-icon-text-default nds-icon_x-small">
                            <use
                                xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#add">
                            </use>
                        </svg><span class="nds-assistive-text">add icon</span><span>New Contact</span>
                </div>
            </div>
        </div>
    </div>
</div>`);
  })
  .add('Long Cards', () => {
    return withExample(`<div class="nds-grid nds-wrap nds-size_1-of-1 nds-is-relative nds-size_12-of-12">
    <div class="nds-size_1-of-1 nds-m-vertical_small">
        <div class="nds-element_text-font">
            <label aria-label="Contacts" aria-live="polite"
                class="nds-m-horizontal_small nds-text-heading_small nds-text">Contacts</label>
        </div>
    </div>
    <div class="nds-size_12-of-12">
        <div class="nds-p-horizontal_small">
            <div class="nds-grid nds-wrap nds-element_text-font">
                <div class="nds-size_1-of-1 nds-show">
                    <div role="button" tabindex="0"
                        class="nds-grid nds-grid_align-center nds-is-relative nds-size_12-of-12 nds-m-right_medium nds-m-bottom_medium nds-grid_vertical-align-center omni-edit-block-card nds-edit-block_longcards"
                        style="justify-content: flex-start;">
                        <div class="nds-edit-block_longcards-circle">
                            <div class="nds-grid nds-grid_align-center nds-grid_vertical-align-center"
                                style="height: 100%;"><span
                                    class="nds-icon_container nds-icon_container_circle slds-current-color omni-icon-circle"
                                    style="color: rgb(21, 100, 191); position: unset;">
                                    <svg aria-hidden="true"
                                        class="nds-icon nds-input__icon nds-icon-text-default nds-icon_large">
                                        <use xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#user">
                                        </use>
                                    </svg><span class="nds-assistive-text">icon</span>
                                </span></div>
                        </div>
                        <div
                            class="nds-grid nds-grid_vertical nds-grid_align-center nds-p-left_small nds-max-small-size_5-of-12 nds-small-size_8-of-12">
                            <span class="nds-truncate">Matt</span><span class="nds-truncate">G</span><span
                                class="nds-truncate">m@g.com</span></div>
                        <div
                            class="nds-grid nds-dropdown-trigger nds-dropdown-trigger_click nds-is-open nds-col_bump-left nds-m-right_small">
                            <button type="button" aria-haspopup="true" title="Show More"
                                class="nds-button nds-button_icon-border-filled nds-editblock_action-button nds-element_text-font">
                                <svg aria-hidden="true"
                                    class="nds-icon nds-input__icon nds-icon-text-default nds-icon_x-small">
                                    <use xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#chevrondown">
                                    </use>
                                </svg><span class="nds-assistive-text">down icon</span>
                            </button></div><span class="nds-is-absolute slds-icon_container nds-icon_container--circle"
                            style="top: -1rem; right: -1rem; background: rgb(80, 227, 194);">
                            <svg aria-hidden="true" class="nds-icon nds-input__icon nds-icon-text- nds-icon_small">
                                <use xlink:href="./assets/icons/action-sprite/svg/symbols.svg#approval">
                                </use>
                            </svg><span class="nds-assistive-text">icon</span>
                        </span>
                    </div>

                </div>
                <div class="nds-size_1-of-1 nds-hide">
                    <div class="nds-modal_custom">
                        <section role="dialog" tabindex="-1" aria-modal="true"
                            class="nds-modal nds-fade-in-open nds-modal_large">
                            <div class="nds-modal__container">
                                <header class="nds-modal__header">
                                    <h1 class="nds-text-heading_small nds-step_label">Contacts</h1>
                                </header>
                                <div class="nds-modal__content nds-p-around_medium">
                                    <slot class="nds-grid nds-wrap nds-grid_pull-padded"></slot>
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
                <div role="button" tabindex="0"
                    class="nds-grid nds-grid_align-center nds-m-right_medium nds-m-bottom_medium nds-size_12-of-12 omni-edit-block-card nds-edit-block_cards-add-card nds-edit-block_longcards">
                    <div class="nds-grid nds-cont-wrapper">
                        <div class="nds-edit-block_longcards-circle">
                            <div class="nds-grid nds-grid_align-center nds-grid_vertical-align-center"
                                style="height: 100%;"><span class="nds-icon_container nds-icon_container_circle"
                                    style="position: unset;">
                                    <svg aria-hidden="true"
                                            class="nds-icon nds-input__icon nds-icon-text-default nds-icon_large">
                                            <use
                                                xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#user">
                                            </use>
                                        </svg><span class="nds-assistive-text">user icon</span>
                                </span></div>
                        </div>
                        <div
                            class="nds-edit-block_longcards-add-icon nds-grid nds-has-flexi-truncate nds-align_absolute-center">
                            <c-icon class="nds-align_absolute-center"><svg aria-hidden="true"
                                    class="nds-icon nds-button__icon nds-icon-text-default nds-icon_xx-small">
                                    <use
                                        xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#add">
                                    </use>
                                </svg><span class="nds-assistive-text">add icon</span><span>New Contact</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>`);
  });
