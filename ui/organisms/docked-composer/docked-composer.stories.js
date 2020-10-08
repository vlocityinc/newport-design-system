import { storiesOf } from '@storybook/html';
import base from 'paths.macro';
import notes from './doc.md';
import scss from './base/_index.scss';
import emailScss from './email/_index.scss';
import {
  withExample,
  withDocs,
  commentToHTML
} from '../../../scripts/storybook';

storiesOf(`${base}`, module)
  .addDecorator(withDocs(notes))
  .addDecorator(commentToHTML(scss + emailScss))
  .add('Default (default)', () => {
    return withExample(`<div style="height: 500px; min-width: 615px; overflow-x: auto;">
  <div class="nds-docked_container">
    <section class="nds-docked-composer nds-grid nds-grid_vertical nds-is-open" role="dialog" aria-labelledby="modal-heading-id-1" aria-describedby="modal-content-id-1">
      <header class="nds-docked-composer__header nds-grid nds-shrink-none" aria-live="assertive">
        <div class="nds-media nds-media_center nds-no-space">
          <div class="nds-media__figure nds-m-right_x-small">
            <span class="nds-icon_container">
              <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#call"></use>
              </svg>
            </span>
          </div>
          <div class="nds-media__body">
            <h2 class="nds-truncate" id="modal-heading-id-1" title="Header">Header</h2>
          </div>
        </div>
        <div class="nds-col_bump-left nds-shrink-none">
          <button class="nds-button nds-button_icon nds-button_icon" title="Minimize window">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#minimize_window"></use>
            </svg>
            <span class="nds-assistive-text">Minimize Composer Panel</span>
          </button>
          <button class="nds-button nds-button_icon nds-button_icon" title="Expand Composer">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#expand_alt"></use>
            </svg>
            <span class="nds-assistive-text">Expand Composer Panel</span>
          </button>
          <button class="nds-button nds-button_icon nds-button_icon" title="Close">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
            </svg>
            <span class="nds-assistive-text">Close Composer Panel</span>
          </button>
        </div>
      </header>
      <div class="nds-docked-composer__body" id="modal-content-id-1">
        <div class="nds-align_absolute-center">
          Docked Composer Panel Body

          <br>
          This area consumes the feature

        </div>
      </div>
      <footer class="nds-docked-composer__footer nds-shrink-none">
        <div class="nds-col_bump-left nds-text-align_right">
          <button class="nds-button nds-button_brand">Action</button>
        </div>
      </footer>
    </section>
  </div>
</div>`);
  })
  .add('Single Composer Open (states)', () => {
    return withExample(`<div style="height: 500px; min-width: 615px; overflow-x: auto;">
  <div class="nds-docked_container">
    <section class="nds-docked-composer nds-grid nds-grid_vertical nds-is-open" role="dialog" aria-labelledby="modal-heading-id-1" aria-describedby="modal-content-id-1">
      <header class="nds-docked-composer__header nds-grid nds-shrink-none" aria-live="assertive">
        <div class="nds-media nds-media_center nds-no-space">
          <div class="nds-media__figure nds-m-right_x-small">
            <span class="nds-icon_container">
              <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#call"></use>
              </svg>
            </span>
          </div>
          <div class="nds-media__body">
            <h2 class="nds-truncate" id="modal-heading-id-1" title="Header">Header</h2>
          </div>
        </div>
        <div class="nds-col_bump-left nds-shrink-none">
          <button class="nds-button nds-button_icon nds-button_icon" title="Minimize window">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#minimize_window"></use>
            </svg>
            <span class="nds-assistive-text">Minimize Composer Panel</span>
          </button>
          <button class="nds-button nds-button_icon nds-button_icon" title="Expand Composer">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#expand_alt"></use>
            </svg>
            <span class="nds-assistive-text">Expand Composer Panel</span>
          </button>
          <button class="nds-button nds-button_icon nds-button_icon" title="Close">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
            </svg>
            <span class="nds-assistive-text">Close Composer Panel</span>
          </button>
        </div>
      </header>
      <div class="nds-docked-composer__body" id="modal-content-id-1">
        <div class="nds-align_absolute-center">
          Docked Composer Panel Body

          <br>
          This area consumes the feature

        </div>
      </div>
      <footer class="nds-docked-composer__footer nds-shrink-none">
        <div class="nds-col_bump-left nds-text-align_right">
          <button class="nds-button nds-button_brand">Action</button>
        </div>
      </footer>
    </section>
  </div>
</div>`);
  })
  .add('Single Composer Focused (states)', () => {
    return withExample(`<div style="height: 500px; min-width: 615px; overflow-x: auto;">
  <div class="nds-docked_container">
    <section class="nds-docked-composer nds-grid nds-grid_vertical nds-is-open nds-has-focus" role="dialog" aria-labelledby="modal-heading-id-1" aria-describedby="modal-content-id-1">
      <header class="nds-docked-composer__header nds-grid nds-shrink-none" aria-live="assertive">
        <div class="nds-media nds-media_center nds-no-space">
          <div class="nds-media__figure nds-m-right_x-small">
            <span class="nds-icon_container">
              <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#call"></use>
              </svg>
            </span>
          </div>
          <div class="nds-media__body">
            <h2 class="nds-truncate" id="modal-heading-id-1" title="Header">Header</h2>
          </div>
        </div>
        <div class="nds-col_bump-left nds-shrink-none">
          <button class="nds-button nds-button_icon nds-button_icon" title="Minimize window">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#minimize_window"></use>
            </svg>
            <span class="nds-assistive-text">Minimize Composer Panel</span>
          </button>
          <button class="nds-button nds-button_icon nds-button_icon" title="Expand Composer">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#expand_alt"></use>
            </svg>
            <span class="nds-assistive-text">Expand Composer Panel</span>
          </button>
          <button class="nds-button nds-button_icon nds-button_icon" title="Close">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
            </svg>
            <span class="nds-assistive-text">Close Composer Panel</span>
          </button>
        </div>
      </header>
      <div class="nds-docked-composer__body" id="modal-content-id-1">
        <div class="nds-align_absolute-center">
          Docked Composer Panel Body

          <br>
          This area consumes the feature

        </div>
      </div>
      <footer class="nds-docked-composer__footer nds-shrink-none">
        <div class="nds-col_bump-left nds-text-align_right">
          <button class="nds-button nds-button_brand">Action</button>
        </div>
      </footer>
    </section>
  </div>
</div>`);
  })
  .add('Single Composer Closed (states)', () => {
    return withExample(`<div style="height: 500px; min-width: 615px; overflow-x: auto;">
  <div class="nds-docked_container">
    <section class="nds-docked-composer nds-grid nds-grid_vertical nds-is-closed" role="dialog" aria-labelledby="modal-heading-id-1" aria-describedby="modal-content-id-1">
      <header class="nds-docked-composer__header nds-grid nds-shrink-none" aria-live="assertive">
        <div class="nds-media nds-media_center nds-no-space">
          <div class="nds-media__figure nds-m-right_x-small">
            <span class="nds-icon_container">
              <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#call"></use>
              </svg>
            </span>
          </div>
          <div class="nds-media__body">
            <span class="nds-assistive-text">Minimized</span>
            <h2 class="nds-truncate" id="modal-heading-id-1" title="Header">Header</h2>
          </div>
        </div>
        <div class="nds-col_bump-left nds-shrink-none">
          <button class="nds-button nds-button_icon nds-button_icon" title="Minimize window">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#minimize_window"></use>
            </svg>
            <span class="nds-assistive-text">Minimize Composer Panel</span>
          </button>
          <button class="nds-button nds-button_icon nds-button_icon" title="Expand Composer">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#expand_alt"></use>
            </svg>
            <span class="nds-assistive-text">Expand Composer Panel</span>
          </button>
          <button class="nds-button nds-button_icon nds-button_icon" title="Close">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
            </svg>
            <span class="nds-assistive-text">Close Composer Panel</span>
          </button>
        </div>
      </header>
      <div class="nds-docked-composer__body" id="modal-content-id-1">
        <div class="nds-align_absolute-center">
          Docked Composer Panel Body

          <br>
          This area consumes the feature

        </div>
      </div>
      <footer class="nds-docked-composer__footer nds-shrink-none">
        <div class="nds-col_bump-left nds-text-align_right">
          <button class="nds-button nds-button_brand">Action</button>
        </div>
      </footer>
    </section>
  </div>
</div>`);
  })
  .add('Single Composer Closed Focused (states)', () => {
    return withExample(`<div style="height: 500px; min-width: 615px; overflow-x: auto;">
  <div class="nds-docked_container">
    <section class="nds-docked-composer nds-grid nds-grid_vertical nds-has-focus nds-is-closed" role="dialog" aria-labelledby="modal-heading-id-1" aria-describedby="modal-content-id-1">
      <header class="nds-docked-composer__header nds-grid nds-shrink-none" aria-live="assertive">
        <div class="nds-media nds-media_center nds-no-space">
          <div class="nds-media__figure nds-m-right_x-small">
            <span class="nds-icon_container">
              <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#call"></use>
              </svg>
            </span>
          </div>
          <div class="nds-media__body">
            <span class="nds-assistive-text">Minimized</span>
            <h2 class="nds-truncate" id="modal-heading-id-1" title="Header">Header</h2>
          </div>
        </div>
        <div class="nds-col_bump-left nds-shrink-none">
          <button class="nds-button nds-button_icon nds-button_icon" title="Minimize window">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#minimize_window"></use>
            </svg>
            <span class="nds-assistive-text">Minimize Composer Panel</span>
          </button>
          <button class="nds-button nds-button_icon nds-button_icon" title="Expand Composer">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#expand_alt"></use>
            </svg>
            <span class="nds-assistive-text">Expand Composer Panel</span>
          </button>
          <button class="nds-button nds-button_icon nds-button_icon" title="Close">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
            </svg>
            <span class="nds-assistive-text">Close Composer Panel</span>
          </button>
        </div>
      </header>
      <div class="nds-docked-composer__body" id="modal-content-id-1">
        <div class="nds-align_absolute-center">
          Docked Composer Panel Body

          <br>
          This area consumes the feature

        </div>
      </div>
      <footer class="nds-docked-composer__footer nds-shrink-none">
        <div class="nds-col_bump-left nds-text-align_right">
          <button class="nds-button nds-button_brand">Action</button>
        </div>
      </footer>
    </section>
  </div>
</div>`);
  })
  .add('Single Composer Popout (states)', () => {
    return withExample(`<div style="height: 500px; min-width: 615px; overflow-x: auto;">
  <div>
    <section role="dialog" tabindex="-1" class="nds-modal nds-fade-in-open nds-docked-composer-modal" aria-labelledby="modal-heading-id-1" aria-describedby="modal-content-id-1" aria-modal="true">
      <div class="nds-modal__container">
        <div class="nds-modal__content" id="modal-content-id-1">
          <section class="nds-docked-composer nds-grid nds-grid_vertical">
            <header class="nds-docked-composer__header nds-grid nds-shrink-none" aria-live="assertive">
              <div class="nds-media nds-media_center nds-no-space">
                <div class="nds-media__figure nds-m-right_x-small">
                  <span class="nds-icon_container">
                    <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                      <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#call"></use>
                    </svg>
                  </span>
                </div>
                <div class="nds-media__body">
                  <h2 class="nds-truncate" id="modal-heading-id-1" title="Header">Header</h2>
                </div>
              </div>
              <div class="nds-col_bump-left nds-shrink-none">
                <button class="nds-button nds-button_icon nds-button_icon" title="Minimize window">
                  <svg class="nds-button__icon" aria-hidden="true">
                    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#minimize_window"></use>
                  </svg>
                  <span class="nds-assistive-text">Minimize Composer Panel</span>
                </button>
                <button class="nds-button nds-button_icon nds-button_icon" title="Expand Composer">
                  <svg class="nds-button__icon" aria-hidden="true">
                    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#expand_alt"></use>
                  </svg>
                  <span class="nds-assistive-text">Expand Composer Panel</span>
                </button>
                <button class="nds-button nds-button_icon nds-button_icon" title="Close">
                  <svg class="nds-button__icon" aria-hidden="true">
                    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                  </svg>
                  <span class="nds-assistive-text">Close Composer Panel</span>
                </button>
              </div>
            </header>
            <div class="nds-docked-composer__body" id="modal-content-id-1">
              <div class="nds-align_absolute-center">
                Docked Composer Panel Body

                <br>
                This area consumes the feature

              </div>
            </div>
            <footer class="nds-docked-composer__footer nds-shrink-none">
              <div class="nds-col_bump-left nds-text-align_right">
                <button class="nds-button nds-button_brand">Action</button>
              </div>
            </footer>
          </section>
        </div>
      </div>
    </section>
    <div class="nds-backdrop nds-backdrop_open"></div>
  </div>
</div>`);
  })
  .add('Multiple Composer Overflow (states)', () => {
    return withExample(`<div style="height: 500px; min-width: 615px; overflow-x: auto;">
  <div class="nds-docked_container">
    <div class="nds-docked-composer nds-docked-composer_overflow">
      <button class="nds-button nds-button_icon nds-docked-composer_overflow__button" aria-haspopup="true">
        <svg class="nds-button__icon" aria-hidden="true">
          <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#standard_objects"></use>
        </svg>
        <span class="nds-text-body_small nds-m-left_xx-small">
          3



          <span class="nds-assistive-text">other docked composer panels</span>
        </span>
      </button>
      <div class="nds-dropdown nds-dropdown_left nds-dropdown_bottom nds-dropdown_medium nds-nubbin_bottom-left">
        <ul class="nds-dropdown__list nds-dropdown_length-with-icon-7" role="menu">
          <li class="nds-dropdown__item" role="presentation">
            <a href="javascript:void(0);" role="menuitem" tabindex="-1">
              <span class="nds-truncate" title="[object Object],Agenda for next week">
                <span class="nds-icon_container nds-icon-standard-email nds-m-right_x-small">
                  <svg class="nds-icon nds-icon_small" aria-hidden="true">
                    <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#email"></use>
                  </svg>
                  <span class="nds-assistive-text">email</span>
                </span>
                Agenda for next week

              </span>
            </a>
          </li>
          <li class="nds-dropdown__item" role="presentation">
            <a href="javascript:void(0);" role="menuitem" tabindex="-1">
              <span class="nds-truncate" title="[object Object],Lei Chan">
                <span class="nds-icon_container nds-icon-standard-call nds-m-right_x-small">
                  <svg class="nds-icon nds-icon_small" aria-hidden="true">
                    <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#call"></use>
                  </svg>
                  <span class="nds-assistive-text">call</span>
                </span>
                Lei Chan

              </span>
            </a>
          </li>
          <li class="nds-dropdown__item" role="presentation">
            <a href="javascript:void(0);" role="menuitem" tabindex="-1">
              <span class="nds-truncate" title="[object Object],August 14 Meeting Notes">
                <span class="nds-icon_container nds-icon-standard-task nds-m-right_x-small">
                  <svg class="nds-icon nds-icon_small" aria-hidden="true">
                    <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#task"></use>
                  </svg>
                  <span class="nds-assistive-text">task</span>
                </span>
                August 14 Meeting Notes

              </span>
            </a>
          </li>
        </ul>
      </div>
    </div>
    <section class="nds-docked-composer nds-grid nds-grid_vertical nds-is-open" role="dialog" aria-labelledby="modal-heading-id-1" aria-describedby="modal-content-id-1">
      <header class="nds-docked-composer__header nds-grid nds-shrink-none" aria-live="assertive">
        <div class="nds-media nds-media_center nds-no-space">
          <div class="nds-media__figure nds-m-right_x-small">
            <span class="nds-icon_container">
              <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#call"></use>
              </svg>
            </span>
          </div>
          <div class="nds-media__body">
            <h2 class="nds-truncate" id="modal-heading-id-1" title="Header">Header</h2>
          </div>
        </div>
        <div class="nds-col_bump-left nds-shrink-none">
          <button class="nds-button nds-button_icon nds-button_icon" title="Minimize window">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#minimize_window"></use>
            </svg>
            <span class="nds-assistive-text">Minimize Composer Panel</span>
          </button>
          <button class="nds-button nds-button_icon nds-button_icon" title="Expand Composer">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#expand_alt"></use>
            </svg>
            <span class="nds-assistive-text">Expand Composer Panel</span>
          </button>
          <button class="nds-button nds-button_icon nds-button_icon" title="Close">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
            </svg>
            <span class="nds-assistive-text">Close Composer Panel</span>
          </button>
        </div>
      </header>
      <div class="nds-docked-composer__body" id="modal-content-id-1">
        <div class="nds-align_absolute-center">
          Docked Composer Panel Body

          <br>
          This area consumes the feature

        </div>
      </div>
      <footer class="nds-docked-composer__footer nds-shrink-none">
        <div class="nds-col_bump-left nds-text-align_right">
          <button class="nds-button nds-button_brand">Action</button>
        </div>
      </footer>
    </section>
  </div>
</div>`);
  })
  .add('Task (examples)', () => {
    return withExample(`<div style="height: 500px; min-width: 615px; overflow-x: auto;">
  <div class="nds-docked_container">
    <section class="nds-docked-composer nds-grid nds-grid_vertical nds-is-open" role="dialog" aria-labelledby="modal-heading-id-1" aria-describedby="modal-content-id-1">
      <header class="nds-docked-composer__header nds-grid nds-shrink-none" aria-live="assertive">
        <div class="nds-media nds-media_center nds-no-space">
          <div class="nds-media__figure nds-m-right_x-small">
            <span class="nds-icon_container">
              <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#task"></use>
              </svg>
            </span>
          </div>
          <div class="nds-media__body">
            <h2 class="nds-truncate" id="modal-heading-id-1" title="New Task">New Task</h2>
          </div>
        </div>
        <div class="nds-col_bump-left nds-shrink-none">
          <button class="nds-button nds-button_icon nds-button_icon" title="Minimize window">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#minimize_window"></use>
            </svg>
            <span class="nds-assistive-text">Minimize Composer Panel</span>
          </button>
          <button class="nds-button nds-button_icon nds-button_icon" title="Expand Composer">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#expand_alt"></use>
            </svg>
            <span class="nds-assistive-text">Expand Composer Panel</span>
          </button>
          <button class="nds-button nds-button_icon nds-button_icon" title="Close">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
            </svg>
            <span class="nds-assistive-text">Close Composer Panel</span>
          </button>
        </div>
      </header>
      <div class="nds-docked-composer__body nds-docked-composer__body_form" id="modal-content-id-1">
        <fieldset class="nds-form nds-form_compound">
          <legend class="nds-assistive-text">Log new task</legend>
          <div class="form-element__group">
            <div class="nds-form-element__row">
              <div class="nds-form-element nds-size_1-of-1">
                <label class="nds-form-element__label" for="text-input-01">Subject</label>
                <div class="nds-form-element__control">
                  <input type="text" class="nds-input" id="text-input-01">
                </div>
              </div>
            </div>
            <div class="nds-form-element__row">
              <div class="nds-form-element nds-size_1-of-2">
                <label class="nds-form-element__label" for="text-input-02">Assigned To</label>
                <div class="nds-form-element__control">
                  <input type="text" class="nds-input" id="text-input-02">
                </div>
              </div>
              <div class="nds-form-element nds-size_1-of-2">
                <label class="nds-form-element__label" for="text-input-03">Due Dates</label>
                <div class="nds-form-element__control">
                  <input type="text" class="nds-input" id="text-input-03">
                </div>
              </div>
            </div>
            <div class="nds-form-element__row">
              <div class="nds-form-element nds-size_1-of-2">
                <label class="nds-form-element__label" for="combobox-unique-id">Name</label>
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
                        <input type="text" class="nds-input nds-combobox__input" id="combobox-unique-id" aria-autocomplete="list" aria-controls="listbox-unique-id" autocomplete="off" role="textbox" placeholder="Search Leads">
                        <span class="nds-icon_container nds-icon-utility-search nds-input__icon nds-input__icon_right">
                          <svg class="nds-icon nds-icon nds-icon_x-small nds-icon-text-default" aria-hidden="true">
                            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#search"></use>
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="nds-form-element nds-size_1-of-2">
                <label class="nds-form-element__label" for="combobox-unique-id">Name</label>
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
                        <input type="text" class="nds-input nds-combobox__input" id="combobox-unique-id" aria-autocomplete="list" aria-controls="listbox-unique-id" autocomplete="off" role="textbox" placeholder="Search Accounts">
                        <span class="nds-icon_container nds-icon-utility-search nds-input__icon nds-input__icon_right">
                          <svg class="nds-icon nds-icon nds-icon_x-small nds-icon-text-default" aria-hidden="true">
                            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#search"></use>
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </fieldset>
      </div>
      <footer class="nds-docked-composer__footer nds-shrink-none">
        <button class="nds-button nds-button_brand nds-col_bump-left">Save</button>
      </footer>
    </section>
  </div>
</div>`);
  })
  .add('Voice Composer Queued (examples)', () => {
    return withExample(`<div style="height: 500px; min-width: 615px; overflow-x: auto;">
  <div class="nds-docked_container">
    <section class="nds-docked-composer nds-grid nds-grid_vertical nds-is-open" role="dialog" aria-labelledby="modal-heading-id-1" aria-describedby="modal-content-id-1">
      <header class="nds-docked-composer__header nds-grid nds-shrink-none" aria-live="assertive">
        <div class="nds-media nds-media_center nds-no-space">
          <div class="nds-media__figure nds-m-right_x-small">
            <span class="nds-icon_container">
              <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#call"></use>
              </svg>
            </span>
          </div>
          <div class="nds-media__body">
            <h2 class="nds-truncate" id="modal-heading-id-1" title="Lei Chan - Connecting...">Lei Chan - Connecting...</h2>
          </div>
        </div>
        <div class="nds-col_bump-left nds-shrink-none">
          <button class="nds-button nds-button_icon nds-button_icon" title="Minimize window">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#minimize_window"></use>
            </svg>
            <span class="nds-assistive-text">Minimize Composer Panel</span>
          </button>
          <button class="nds-button nds-button_icon nds-button_icon" title="Expand Composer">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#expand_alt"></use>
            </svg>
            <span class="nds-assistive-text">Expand Composer Panel</span>
          </button>
          <button class="nds-button nds-button_icon nds-button_icon" title="Close">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
            </svg>
            <span class="nds-assistive-text">Close Composer Panel</span>
          </button>
        </div>
      </header>
      <div class="nds-docked-composer__body nds-align_absolute-center" id="modal-content-id-1">
        <div class="nds-text-align_center nds-align-middle">
          <span class="nds-avatar nds-avatar_large">
            <img alt="" src="/assets/images/avatar2.jpg" title="Lei Chan avatar">
          </span>
          <h3 class="nds-text-heading_large">Lei Chan</h3>
          <ul class="nds-list_horizontal nds-has-dividers_right nds-text-body_small">
            <li class="nds-item">VP of Sales</li>
            <li class="nds-item ">Acme Corporation</li>
          </ul>
          <p class="nds-text-heading_medium nds-m-top_medium">Connecting...</p>
        </div>
      </div>
      <footer class="nds-docked-composer__footer nds-shrink-none">
        <button class="nds-button nds-button_destructive nds-size_1-of-1">End Call</button>
      </footer>
    </section>
  </div>
</div>`);
  })
  .add('Voice Composer Ringing (examples)', () => {
    return withExample(`<div style="height: 500px; min-width: 615px; overflow-x: auto;">
  <div class="nds-docked_container">
    <section class="nds-docked-composer nds-grid nds-grid_vertical nds-is-open" role="dialog" aria-labelledby="modal-heading-id-1" aria-describedby="modal-content-id-1">
      <header class="nds-docked-composer__header nds-grid nds-shrink-none" aria-live="assertive">
        <div class="nds-media nds-media_center nds-no-space">
          <div class="nds-media__figure nds-m-right_x-small">
            <span class="nds-icon_container">
              <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#call"></use>
              </svg>
            </span>
          </div>
          <div class="nds-media__body">
            <h2 class="nds-truncate" id="modal-heading-id-1" title="Lei Chan - Dialing...">Lei Chan - Dialing...</h2>
          </div>
        </div>
        <div class="nds-col_bump-left nds-shrink-none">
          <button class="nds-button nds-button_icon nds-button_icon" title="Minimize window">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#minimize_window"></use>
            </svg>
            <span class="nds-assistive-text">Minimize Composer Panel</span>
          </button>
          <button class="nds-button nds-button_icon nds-button_icon" title="Expand Composer">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#expand_alt"></use>
            </svg>
            <span class="nds-assistive-text">Expand Composer Panel</span>
          </button>
          <button class="nds-button nds-button_icon nds-button_icon" title="Close">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
            </svg>
            <span class="nds-assistive-text">Close Composer Panel</span>
          </button>
        </div>
      </header>
      <div class="nds-docked-composer__body nds-align_absolute-center" id="modal-content-id-1">
        <div class="nds-text-align_center nds-align-middle">
          <span class="nds-avatar nds-avatar_large">
            <img alt="" src="/assets/images/avatar2.jpg" title="Lei Chan avatar">
          </span>
          <h3 class="nds-text-heading_large">Lei Chan</h3>
          <ul class="nds-list_horizontal nds-has-dividers_right nds-text-body_small">
            <li class="nds-item">VP of Sales</li>
            <li class="nds-item ">Acme Corporation</li>
          </ul>
          <p class="nds-text-heading_medium nds-m-top_medium">Dialing...</p>
        </div>
      </div>
      <footer class="nds-docked-composer__footer nds-shrink-none">
        <button class="nds-button nds-button_destructive nds-size_1-of-1">End Call</button>
      </footer>
    </section>
  </div>
</div>`);
  })
  .add('Voice Composer Connected (examples)', () => {
    return withExample(`<div style="height: 500px; min-width: 615px; overflow-x: auto;">
  <div class="nds-docked_container">
    <section class="nds-docked-composer nds-grid nds-grid_vertical nds-is-open" role="dialog" aria-labelledby="modal-heading-id-1" aria-describedby="modal-content-id-1">
      <header class="nds-docked-composer__header nds-grid nds-shrink-none" aria-live="assertive">
        <div class="nds-media nds-media_center nds-no-space">
          <div class="nds-media__figure nds-m-right_x-small">
            <span class="nds-icon_container">
              <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#call"></use>
              </svg>
            </span>
          </div>
          <div class="nds-media__body">
            <h2 class="nds-truncate" id="modal-heading-id-1" title="Lei Chan - Call in Progress">Lei Chan - Call in Progress</h2>
          </div>
        </div>
        <div class="nds-col_bump-left nds-shrink-none">
          <button class="nds-button nds-button_icon nds-button_icon" title="Minimize window">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#minimize_window"></use>
            </svg>
            <span class="nds-assistive-text">Minimize Composer Panel</span>
          </button>
          <button class="nds-button nds-button_icon nds-button_icon" title="Expand Composer">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#expand_alt"></use>
            </svg>
            <span class="nds-assistive-text">Expand Composer Panel</span>
          </button>
          <button class="nds-button nds-button_icon nds-button_icon" title="Close">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
            </svg>
            <span class="nds-assistive-text">Close Composer Panel</span>
          </button>
        </div>
      </header>
      <div class="nds-docked-composer__body" id="modal-content-id-1">
        <div class="nds-docked-composer__lead">
          <div class="nds-media">
            <div class="nds-media__figure">
              <span class="nds-avatar nds-avatar_medium">
                <img alt="" src="/assets/images/avatar2.jpg" title="Lei Chan avatar">
              </span>
            </div>
            <div class="nds-media__body">
              <p class="nds-text-heading_medium">Lei Chan</p>
              <ul class="nds-list_horizontal nds-has-dividers_right nds-text-body_small">
                <li class="nds-item">VP of Sales</li>
                <li class="nds-item ">Acme Corporation</li>
              </ul>
            </div>
          </div>
          <p class="nds-col_bump-left nds-text-heading_large">5:37</p>
        </div>
        <div class="nds-docked-composer__toolbar">
          <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-small" aria-pressed="false" title="Mute Yourself">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#unmuted"></use>
            </svg>
            <span class="nds-assistive-text">Mute Yourself</span>
          </button>
        </div>
        <label class="nds-assistive-text" for="composer-text-input-1">Take notes</label>
        <textarea id="composer-text-input-1" class="nds-docked-composer__input nds-input_bare nds-text-longform nds-grow" placeholder="Jot down notes here..."></textarea>
      </div>
      <footer class="nds-docked-composer__footer nds-shrink-none">
        <button class="nds-button nds-button_destructive nds-col_bump-left">End Call</button>
      </footer>
    </section>
  </div>
</div>`);
  })
  .add('Voice Composer Cancelled (examples)', () => {
    return withExample(`<div style="height: 500px; min-width: 615px; overflow-x: auto;">
  <div class="nds-docked_container">
    <section class="nds-docked-composer nds-grid nds-grid_vertical nds-is-open" role="dialog" aria-labelledby="modal-heading-id-1" aria-describedby="modal-content-id-1">
      <header class="nds-docked-composer__header nds-grid nds-shrink-none" aria-live="assertive">
        <div class="nds-media nds-media_center nds-no-space">
          <div class="nds-media__figure nds-m-right_x-small">
            <span class="nds-icon_container">
              <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#call"></use>
              </svg>
            </span>
          </div>
          <div class="nds-media__body">
            <h2 class="nds-truncate" id="modal-heading-id-1" title="Lei Chan - Cancelling...">Lei Chan - Cancelling...</h2>
          </div>
        </div>
        <div class="nds-col_bump-left nds-shrink-none">
          <button class="nds-button nds-button_icon nds-button_icon" title="Minimize window">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#minimize_window"></use>
            </svg>
            <span class="nds-assistive-text">Minimize Composer Panel</span>
          </button>
          <button class="nds-button nds-button_icon nds-button_icon" title="Expand Composer">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#expand_alt"></use>
            </svg>
            <span class="nds-assistive-text">Expand Composer Panel</span>
          </button>
          <button class="nds-button nds-button_icon nds-button_icon" title="Close">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
            </svg>
            <span class="nds-assistive-text">Close Composer Panel</span>
          </button>
        </div>
      </header>
      <div class="nds-docked-composer__body nds-align_absolute-center" id="modal-content-id-1">
        <div class="nds-text-align_center nds-align-middle">
          <span class="nds-avatar nds-avatar_large">
            <img alt="" src="/assets/images/avatar2.jpg" title="Lei Chan avatar">
          </span>
          <h3 class="nds-text-heading_large">Lei Chan</h3>
          <ul class="nds-list_horizontal nds-has-dividers_right nds-text-body_small">
            <li class="nds-item">VP of Sales</li>
            <li class="nds-item ">Acme Corporation</li>
          </ul>
          <p class="nds-text-heading_medium nds-m-top_medium">Cancelling...</p>
        </div>
      </div>
    </section>
  </div>
</div>`);
  })
  .add('Voice Composer Busy (examples)', () => {
    return withExample(`<div style="height: 500px; min-width: 615px; overflow-x: auto;">
  <div class="nds-docked_container">
    <section class="nds-docked-composer nds-grid nds-grid_vertical nds-is-open" role="dialog" aria-labelledby="modal-heading-id-1" aria-describedby="modal-content-id-1">
      <header class="nds-docked-composer__header nds-grid nds-shrink-none" aria-live="assertive">
        <div class="nds-media nds-media_center nds-no-space">
          <div class="nds-media__figure nds-m-right_x-small">
            <span class="nds-icon_container">
              <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#call"></use>
              </svg>
            </span>
          </div>
          <div class="nds-media__body">
            <h2 class="nds-truncate" id="modal-heading-id-1" title="Lei Chan - Busy">Lei Chan - Busy</h2>
          </div>
        </div>
        <div class="nds-col_bump-left nds-shrink-none">
          <button class="nds-button nds-button_icon nds-button_icon" title="Minimize window">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#minimize_window"></use>
            </svg>
            <span class="nds-assistive-text">Minimize Composer Panel</span>
          </button>
          <button class="nds-button nds-button_icon nds-button_icon" title="Expand Composer">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#expand_alt"></use>
            </svg>
            <span class="nds-assistive-text">Expand Composer Panel</span>
          </button>
          <button class="nds-button nds-button_icon nds-button_icon" title="Close">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
            </svg>
            <span class="nds-assistive-text">Close Composer Panel</span>
          </button>
        </div>
      </header>
      <div class="nds-docked-composer__body nds-align_absolute-center" id="modal-content-id-1">
        <div class="nds-text-align_center nds-align-middle">
          <span class="nds-avatar nds-avatar_large">
            <img alt="" src="/assets/images/avatar2.jpg" title="Lei Chan avatar">
          </span>
          <h3 class="nds-text-heading_large">Lei Chan</h3>
          <ul class="nds-list_horizontal nds-has-dividers_right nds-text-body_small">
            <li class="nds-item">VP of Sales</li>
            <li class="nds-item ">Acme Corporation</li>
          </ul>
          <p class="nds-text-heading_medium nds-m-top_medium">Busy</p>
        </div>
      </div>
      <footer class="nds-docked-composer__footer nds-shrink-none">
        <button class="nds-button nds-button_neutral nds-size_1-of-2">Follow-Up Later</button>
        <button class="nds-button nds-button_brand nds-size_1-of-2">Call Again</button>
      </footer>
    </section>
  </div>
</div>`);
  })
  .add('Voice Composer Failed (examples)', () => {
    return withExample(`<div style="height: 500px; min-width: 615px; overflow-x: auto;">
  <div class="nds-docked_container">
    <section class="nds-docked-composer nds-grid nds-grid_vertical nds-is-open" role="dialog" aria-labelledby="modal-heading-id-1" aria-describedby="modal-content-id-1">
      <header class="nds-docked-composer__header nds-grid nds-shrink-none" aria-live="assertive">
        <div class="nds-media nds-media_center nds-no-space">
          <div class="nds-media__figure nds-m-right_x-small">
            <span class="nds-icon_container">
              <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#call"></use>
              </svg>
            </span>
          </div>
          <div class="nds-media__body">
            <h2 class="nds-truncate" id="modal-heading-id-1" title="Lei Chan - Call Failed">Lei Chan - Call Failed</h2>
          </div>
        </div>
        <div class="nds-col_bump-left nds-shrink-none">
          <button class="nds-button nds-button_icon nds-button_icon" title="Minimize window">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#minimize_window"></use>
            </svg>
            <span class="nds-assistive-text">Minimize Composer Panel</span>
          </button>
          <button class="nds-button nds-button_icon nds-button_icon" title="Expand Composer">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#expand_alt"></use>
            </svg>
            <span class="nds-assistive-text">Expand Composer Panel</span>
          </button>
          <button class="nds-button nds-button_icon nds-button_icon" title="Close">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
            </svg>
            <span class="nds-assistive-text">Close Composer Panel</span>
          </button>
        </div>
      </header>
      <div class="nds-docked-composer__body nds-align_absolute-center" id="modal-content-id-1">
        <div class="nds-text-align_center nds-align-middle">
          <span class="nds-avatar nds-avatar_large">
            <img alt="" src="/assets/images/avatar2.jpg" title="Lei Chan avatar">
          </span>
          <h3 class="nds-text-heading_large">Lei Chan</h3>
          <ul class="nds-list_horizontal nds-has-dividers_right nds-text-body_small">
            <li class="nds-item">VP of Sales</li>
            <li class="nds-item ">Acme Corporation</li>
          </ul>
          <p class="nds-text-heading_medium nds-m-top_medium">Call Failed</p>
        </div>
      </div>
      <footer class="nds-docked-composer__footer nds-shrink-none">
        <button class="nds-button nds-button_neutral nds-size_1-of-2">Edit Phone Number</button>
        <button class="nds-button nds-button_brand nds-size_1-of-2">Call Again</button>
      </footer>
    </section>
  </div>
</div>`);
  })
  .add('Voice Composer No Answer (examples)', () => {
    return withExample(`<div style="height: 500px; min-width: 615px; overflow-x: auto;">
  <div class="nds-docked_container">
    <section class="nds-docked-composer nds-grid nds-grid_vertical nds-is-open" role="dialog" aria-labelledby="modal-heading-id-1" aria-describedby="modal-content-id-1">
      <header class="nds-docked-composer__header nds-grid nds-shrink-none" aria-live="assertive">
        <div class="nds-media nds-media_center nds-no-space">
          <div class="nds-media__figure nds-m-right_x-small">
            <span class="nds-icon_container">
              <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#call"></use>
              </svg>
            </span>
          </div>
          <div class="nds-media__body">
            <h2 class="nds-truncate" id="modal-heading-id-1" title="Lei Chan - No Answer">Lei Chan - No Answer</h2>
          </div>
        </div>
        <div class="nds-col_bump-left nds-shrink-none">
          <button class="nds-button nds-button_icon nds-button_icon" title="Minimize window">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#minimize_window"></use>
            </svg>
            <span class="nds-assistive-text">Minimize Composer Panel</span>
          </button>
          <button class="nds-button nds-button_icon nds-button_icon" title="Expand Composer">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#expand_alt"></use>
            </svg>
            <span class="nds-assistive-text">Expand Composer Panel</span>
          </button>
          <button class="nds-button nds-button_icon nds-button_icon" title="Close">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
            </svg>
            <span class="nds-assistive-text">Close Composer Panel</span>
          </button>
        </div>
      </header>
      <div class="nds-docked-composer__body nds-align_absolute-center" id="modal-content-id-1">
        <div class="nds-text-align_center nds-align-middle">
          <span class="nds-avatar nds-avatar_large">
            <img alt="" src="/assets/images/avatar2.jpg" title="Lei Chan avatar">
          </span>
          <h3 class="nds-text-heading_large">Lei Chan</h3>
          <ul class="nds-list_horizontal nds-has-dividers_right nds-text-body_small">
            <li class="nds-item">VP of Sales</li>
            <li class="nds-item ">Acme Corporation</li>
          </ul>
          <p class="nds-text-heading_medium nds-m-top_medium">No Answer</p>
        </div>
      </div>
      <footer class="nds-docked-composer__footer nds-shrink-none">
        <button class="nds-button nds-button_neutral nds-size_1-of-2">Follow-Up Later</button>
        <button class="nds-button nds-button_brand nds-size_1-of-2">Call Again</button>
      </footer>
    </section>
  </div>
</div>`);
  })
  .add('Voice Composer Call Finished (examples)', () => {
    return withExample(`<div style="height: 500px; min-width: 615px; overflow-x: auto;">
  <div class="nds-docked_container">
    <section class="nds-docked-composer nds-grid nds-grid_vertical nds-is-open" role="dialog" aria-labelledby="modal-heading-id-1" aria-describedby="modal-content-id-1">
      <header class="nds-docked-composer__header nds-grid nds-shrink-none" aria-live="assertive">
        <div class="nds-media nds-media_center nds-no-space">
          <div class="nds-media__figure nds-m-right_x-small">
            <span class="nds-icon_container">
              <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#call"></use>
              </svg>
            </span>
          </div>
          <div class="nds-media__body">
            <h2 class="nds-truncate" id="modal-heading-id-1" title="Lei Chan - Call Finished">Lei Chan - Call Finished</h2>
          </div>
        </div>
        <div class="nds-col_bump-left nds-shrink-none">
          <button class="nds-button nds-button_icon nds-button_icon" title="Minimize window">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#minimize_window"></use>
            </svg>
            <span class="nds-assistive-text">Minimize Composer Panel</span>
          </button>
          <button class="nds-button nds-button_icon nds-button_icon" title="Expand Composer">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#expand_alt"></use>
            </svg>
            <span class="nds-assistive-text">Expand Composer Panel</span>
          </button>
          <button class="nds-button nds-button_icon nds-button_icon" title="Close">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
            </svg>
            <span class="nds-assistive-text">Close Composer Panel</span>
          </button>
        </div>
      </header>
      <div class="nds-docked-composer__body" id="modal-content-id-1">
        <div class="nds-docked-composer__lead">
          <div class="nds-media">
            <div class="nds-media__figure">
              <span class="nds-avatar nds-avatar_medium">
                <img alt="" src="/assets/images/avatar2.jpg" title="Lei Chan avatar">
              </span>
            </div>
            <div class="nds-media__body">
              <p class="nds-text-heading_medium">Lei Chan</p>
              <ul class="nds-list_horizontal nds-has-dividers_right nds-text-body_small">
                <li class="nds-item">VP of Sales</li>
                <li class="nds-item ">Acme Corporation</li>
              </ul>
            </div>
          </div>
        </div>
        <div class="nds-docked-composer__toolbar">
          <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-small" aria-pressed="false" title="Mute Yourself">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#unmuted"></use>
            </svg>
            <span class="nds-assistive-text">Mute Yourself</span>
          </button>
        </div>
        <label class="nds-assistive-text" for="composer-text-input-1">Take notes</label>
        <textarea id="composer-text-input-1" class="nds-docked-composer__input nds-input_bare nds-text-longform nds-grow" placeholder="Jot down notes here..."></textarea>
      </div>
      <footer class="nds-docked-composer__footer nds-shrink-none">
        <button class="nds-button nds-button_brand nds-col_bump-left">Finish Notes</button>
      </footer>
    </section>
  </div>
</div>`);
  })
  .add('Voice Composer Call Incoming (examples)', () => {
    return withExample(`<div style="height: 500px; min-width: 615px; overflow-x: auto;">
  <div class="nds-docked_container">
    <section class="nds-docked-composer nds-grid nds-grid_vertical nds-is-open" role="dialog" aria-labelledby="modal-heading-id-1" aria-describedby="modal-content-id-1">
      <header class="nds-docked-composer__header nds-grid nds-shrink-none" aria-live="assertive">
        <div class="nds-media nds-media_center nds-no-space">
          <div class="nds-media__figure nds-m-right_x-small">
            <span class="nds-icon_container">
              <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#call"></use>
              </svg>
            </span>
          </div>
          <div class="nds-media__body">
            <h2 class="nds-truncate" id="modal-heading-id-1" title="Lei Chan - Incoming Call...">Lei Chan - Incoming Call...</h2>
          </div>
        </div>
        <div class="nds-col_bump-left nds-shrink-none">
          <button class="nds-button nds-button_icon nds-button_icon" title="Minimize window">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#minimize_window"></use>
            </svg>
            <span class="nds-assistive-text">Minimize Composer Panel</span>
          </button>
          <button class="nds-button nds-button_icon nds-button_icon" title="Expand Composer">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#expand_alt"></use>
            </svg>
            <span class="nds-assistive-text">Expand Composer Panel</span>
          </button>
          <button class="nds-button nds-button_icon nds-button_icon" title="Close">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
            </svg>
            <span class="nds-assistive-text">Close Composer Panel</span>
          </button>
        </div>
      </header>
      <div class="nds-docked-composer__body nds-align_absolute-center nds-size_1-of-1" id="modal-content-id-1">
        <div class="nds-text-align_center nds-align-middle">
          <span class="nds-avatar nds-avatar_large">
            <img alt="" src="/assets/images/avatar2.jpg" title="Lei Chan avatar">
          </span>
          <h3 class="nds-text-heading_large">Lei Chan</h3>
          <ul class="nds-list_horizontal nds-has-dividers_right nds-text-body_small">
            <li class="nds-item">VP of Sales</li>
            <li class="nds-item ">Acme Corporation</li>
          </ul>
          <p class="nds-text-heading_medium nds-m-top_medium">(416) 555-1234</p>
        </div>
        <div class="nds-p-horizontal_x-small nds-text-align_left nds-size_1-of-1">
          <h3 class="nds-m-bottom_x-small">Recent Activity</h3>
          <ul class="nds-has-dividers_around-space">
            <li class="nds-item nds-theme_shade nds-grid">
              <span class="nds-icon_container nds-icon-standard-task nds-m-right_x-small">
                <svg class="nds-icon nds-icon_small" aria-hidden="true">
                  <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#task"></use>
                </svg>
                <span class="nds-assistive-text">Task</span>
              </span>
              Discussed New Pricing Models

              <span class="nds-col_bump-left">Yesterday</span>
            </li>
            <li class="nds-item nds-theme_shade nds-grid">
              <span class="nds-icon_container nds-icon-standard-email nds-m-right_x-small">
                <svg class="nds-icon nds-icon_small" aria-hidden="true">
                  <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#email"></use>
                </svg>
                <span class="nds-assistive-text">Email</span>
              </span>
              Re: Updated Proposals

              <span class="nds-col_bump-left">4 Hours Ago</span>
            </li>
            <li class="nds-item nds-theme_shade nds-grid">
              <span class="nds-icon_container nds-icon-standard-note nds-m-right_x-small">
                <svg class="nds-icon nds-icon_small" aria-hidden="true">
                  <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#note"></use>
                </svg>
                <span class="nds-assistive-text">Note</span>
              </span>
              Discuss Slides for Nov EBC

              <span class="nds-col_bump-left">2 Days Ago</span>
            </li>
          </ul>
        </div>
      </div>
      <footer class="nds-docked-composer__footer nds-shrink-none">
        <button class="nds-button nds-button_brand nds-col_bump-left">Finish Notes</button>
      </footer>
    </section>
  </div>
</div>`);
  })
  .add('Voice Composer Call Logged (examples)', () => {
    return withExample(`<div style="height: 500px; min-width: 615px; overflow-x: auto;">
  <div class="nds-docked_container">
    <section class="nds-docked-composer nds-grid nds-grid_vertical nds-is-open" role="dialog" aria-labelledby="modal-heading-id-1" aria-describedby="modal-content-id-1">
      <header class="nds-docked-composer__header nds-grid nds-shrink-none" aria-live="assertive">
        <div class="nds-media nds-media_center nds-no-space">
          <div class="nds-media__figure nds-m-right_x-small">
            <span class="nds-icon_container">
              <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#call"></use>
              </svg>
            </span>
          </div>
          <div class="nds-media__body">
            <h2 class="nds-truncate" id="modal-heading-id-1" title="Lei Chan">Lei Chan</h2>
          </div>
        </div>
        <div class="nds-col_bump-left nds-shrink-none">
          <button class="nds-button nds-button_icon nds-button_icon" title="Minimize window">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#minimize_window"></use>
            </svg>
            <span class="nds-assistive-text">Minimize Composer Panel</span>
          </button>
          <button class="nds-button nds-button_icon nds-button_icon" title="Expand Composer">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#expand_alt"></use>
            </svg>
            <span class="nds-assistive-text">Expand Composer Panel</span>
          </button>
          <button class="nds-button nds-button_icon nds-button_icon" title="Close">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
            </svg>
            <span class="nds-assistive-text">Close Composer Panel</span>
          </button>
        </div>
      </header>
      <div class="nds-docked-composer__body nds-docked-composer__body_form" id="modal-content-id-1">
        <fieldset class="nds-form nds-form_compound">
          <legend class="nds-assistive-text">Log a call</legend>
          <div class="form-element__group">
            <div class="nds-form-element__row">
              <div class="nds-form-element nds-size_1-of-1">
                <label class="nds-form-element__label" for="text-input-01">Subject</label>
                <div class="nds-form-element__control">
                  <input type="text" class="nds-input" id="text-input-01">
                </div>
              </div>
            </div>
            <div class="nds-form-element__row">
              <div class="nds-form-element nds-size_1-of-1">
                <label class="nds-form-element__label" for="textarea-input-01">Comments</label>
                <div class="nds-form-element__control">
                  <textarea class="nds-textarea" id="textarea-input-01"></textarea>
                </div>
              </div>
            </div>
            <div class="nds-form-element__row">
              <div class="nds-form-element nds-size_1-of-2">
                <label class="nds-form-element__label" for="combobox-unique-id">Name</label>
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
                        <input type="text" class="nds-input nds-combobox__input" id="combobox-unique-id" aria-autocomplete="list" aria-controls="listbox-unique-id" autocomplete="off" role="textbox" placeholder="Search Leads">
                        <span class="nds-icon_container nds-icon-utility-search nds-input__icon nds-input__icon_right">
                          <svg class="nds-icon nds-icon nds-icon_x-small nds-icon-text-default" aria-hidden="true">
                            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#search"></use>
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="nds-form-element nds-size_1-of-2">
                <label class="nds-form-element__label" for="combobox-unique-id">Name</label>
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
                        <input type="text" class="nds-input nds-combobox__input" id="combobox-unique-id" aria-autocomplete="list" aria-controls="listbox-unique-id" autocomplete="off" role="textbox" placeholder="Search Accounts">
                        <span class="nds-icon_container nds-icon-utility-search nds-input__icon nds-input__icon_right">
                          <svg class="nds-icon nds-icon nds-icon_x-small nds-icon-text-default" aria-hidden="true">
                            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#search"></use>
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </fieldset>
      </div>
      <footer class="nds-docked-composer__footer nds-shrink-none">
        <button class="nds-button nds-button_brand nds-col_bump-left">Save</button>
      </footer>
    </section>
  </div>
</div>`);
  })
  .add('Email (examples)', () => {
    return withExample(`<div style="height: 500px; min-width: 615px; overflow-x: auto;">
  <div class="nds-docked_container">
    <section class="nds-docked-composer nds-grid nds-grid_vertical nds-is-open" role="dialog" aria-labelledby="modal-heading-id-1" aria-describedby="modal-content-id-1">
      <header class="nds-docked-composer__header nds-grid nds-shrink-none" aria-live="assertive">
        <div class="nds-media nds-media_center nds-no-space">
          <div class="nds-media__figure nds-m-right_x-small">
            <span class="nds-icon_container">
              <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
                <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#email"></use>
              </svg>
            </span>
          </div>
          <div class="nds-media__body">
            <h2 class="nds-truncate" id="modal-heading-id-1" title="New Email">New Email</h2>
          </div>
        </div>
        <div class="nds-col_bump-left nds-shrink-none">
          <button class="nds-button nds-button_icon nds-button_icon" title="Minimize window">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#minimize_window"></use>
            </svg>
            <span class="nds-assistive-text">Minimize Composer Panel</span>
          </button>
          <button class="nds-button nds-button_icon nds-button_icon" title="Expand Composer">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#expand_alt"></use>
            </svg>
            <span class="nds-assistive-text">Expand Composer Panel</span>
          </button>
          <button class="nds-button nds-button_icon nds-button_icon" title="Close">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
            </svg>
            <span class="nds-assistive-text">Close Composer Panel</span>
          </button>
        </div>
      </header>
      <div class="nds-docked-composer__body" id="modal-content-id-1">
        <div class="nds-email-composer">
          <div class="nds-form-element nds-email-composer__combobox">
            <label class="nds-form-element__label" for="recipients-to">To</label>
            <div class="nds-form-element__control">
              <div class="nds-combobox_container nds-has-inline-listbox">
                <div id="selected-recipients-to" role="listbox" aria-orientation="horizontal">
                  <ul class="nds-listbox nds-listbox_inline" role="group" aria-label="Recipients:">
                    <li role="presentation" class="nds-listbox__item">
                      <span class="nds-pill" role="option" tabindex="0" aria-selected="true">
                        <span class="nds-avatar nds-avatar_x-small nds-pill__icon_container">
                          <img alt="Person name" src="/assets/images/avatar2.jpg" title="User avatar">
                        </span>
                        <span class="nds-pill__label" title="jrogers@cloudhub.com">jrogers@cloudhub.com</span>
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
                <div class="nds-combobox" aria-expanded="false" aria-haspopup="listbox" role="combobox">
                  <div class="nds-combobox__form-element" role="none">
                    <input type="text" class="nds-input nds-combobox__input" id="recipients-to" aria-autocomplete="list" aria-controls="selected-recipients-to" autocomplete="off" role="textbox" placeholder=" ">
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="nds-form-element nds-email-composer__combobox">
            <label class="nds-form-element__label" for="recipients-bcc">Bcc</label>
            <div class="nds-form-element__control">
              <div class="nds-combobox_container nds-has-inline-listbox">
                <div class="nds-combobox" aria-expanded="false" aria-haspopup="listbox" role="combobox">
                  <div class="nds-combobox__form-element" role="none">
                    <input type="text" class="nds-input nds-combobox__input" id="recipients-bcc" aria-autocomplete="list" aria-controls="listbox-unique-id" autocomplete="off" role="textbox" placeholder=" ">
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="nds-form-element nds-email-composer__combobox">
            <label class="nds-form-element__label" for="recipients-cc">Cc</label>
            <div class="nds-form-element__control">
              <div class="nds-combobox_container nds-has-inline-listbox">
                <div class="nds-combobox" aria-expanded="false" aria-haspopup="listbox" role="combobox">
                  <div class="nds-combobox__form-element" role="none">
                    <input type="text" class="nds-input nds-combobox__input" id="recipients-cc" aria-autocomplete="list" aria-controls="listbox-unique-id" autocomplete="off" role="textbox" placeholder=" ">
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="nds-form-element">
            <label class="nds-form-element__label nds-assistive-text" for="input-subject-01">
              Enter subject

            </label>
            <div class="nds-form-element__control">
              <input type="text" id="input-subject-01" class="nds-input nds-input_bare" placeholder="Enter Subject">
            </div>
          </div>
          <div class="nds-rich-text-editor nds-form-element nds-grid nds-grid_vertical nds-nowrap">
            <div role="toolbar" class="nds-rich-text-editor__toolbar nds-shrink-none">
              <div class="nds-grid" role="group" aria-label="Format font family &amp; size">
                <div class="nds-rich-text-editor__select">
                  <div class="nds-form-element">
                    <label class="nds-form-element__label nds-assistive-text" for="font-family">Choose a Font</label>
                    <div class="nds-form-element__control">
                      <div class="nds-combobox_container">
                        <div class="nds-combobox nds-dropdown-trigger nds-dropdown-trigger_click nds-size_x-small" aria-expanded="false" aria-haspopup="listbox" role="combobox">
                          <div class="nds-combobox__form-element nds-input-has-icon nds-input-has-icon_right" role="none">
                            <input type="text" class="nds-input nds-combobox__input" id="font-family" aria-controls="family-listbox" autocomplete="off" role="textbox" placeholder="Select an Option" readonly="" value="Font">
                            <span class="nds-icon_container nds-icon-utility-down nds-input__icon nds-input__icon_right" title="Description of icon when needed">
                              <svg class="nds-icon nds-icon nds-icon_x-small nds-icon-text-default" aria-hidden="true">
                                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
                              </svg>
                              <span class="nds-assistive-text">Description of icon</span>
                            </span>
                          </div>
                          <div id="listbox-unique-id" role="listbox">
                            <ul class="nds-listbox nds-listbox_vertical nds-dropdown nds-dropdown_fluid" role="presentation">
                              <li role="presentation" class="nds-listbox__item">
                                <span id="listbox-option-unique-id-01" class="nds-media nds-listbox__option nds-listbox__option_plain nds-media_small nds-media_center" role="option">
                                  <span class="nds-media__body">
                                    <span class="nds-truncate" title="Times New Roman">


                                      Times New Roman

                                    </span>
                                  </span>
                                </span>
                              </li>
                              <li role="presentation" class="nds-listbox__item">
                                <span id="listbox-option-unique-id-02" class="nds-media nds-listbox__option nds-listbox__option_plain nds-media_small nds-media_center" role="option">
                                  <span class="nds-media__body">
                                    <span class="nds-truncate" title="Arial">


                                      Arial

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
                <div class="nds-rich-text-editor__select">
                  <div class="nds-form-element">
                    <label class="nds-form-element__label nds-assistive-text" for="font-size">Choose a Font Size</label>
                    <div class="nds-form-element__control">
                      <div class="nds-combobox_container">
                        <div class="nds-combobox nds-dropdown-trigger nds-dropdown-trigger_click nds-size_xx-small" aria-expanded="false" aria-haspopup="listbox" role="combobox">
                          <div class="nds-combobox__form-element nds-input-has-icon nds-input-has-icon_right" role="none">
                            <input type="text" class="nds-input nds-combobox__input" id="font-size" aria-controls="size-listbox" autocomplete="off" role="textbox" placeholder="Select an Option" readonly="" tabindex="-1" value="Size">
                            <span class="nds-icon_container nds-icon-utility-down nds-input__icon nds-input__icon_right" title="Description of icon when needed">
                              <svg class="nds-icon nds-icon nds-icon_x-small nds-icon-text-default" aria-hidden="true">
                                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
                              </svg>
                              <span class="nds-assistive-text">Description of icon</span>
                            </span>
                          </div>
                          <div id="family-listbox" role="listbox">
                            <ul class="nds-listbox nds-listbox_vertical nds-dropdown nds-dropdown_fluid" role="presentation">
                              <li role="presentation" class="nds-listbox__item">
                                <span id="listbox-option-unique-id-03" class="nds-media nds-listbox__option nds-listbox__option_plain nds-media_small nds-media_center" role="option">
                                  <span class="nds-media__body">
                                    <span class="nds-truncate" title="12px">


                                      12px

                                    </span>
                                  </span>
                                </span>
                              </li>
                              <li role="presentation" class="nds-listbox__item">
                                <span id="listbox-option-unique-id-04" class="nds-media nds-listbox__option nds-listbox__option_plain nds-media_small nds-media_center" role="option">
                                  <span class="nds-media__body">
                                    <span class="nds-truncate" title="14px">


                                      14px

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
              </div>
              <ul aria-label="Format text" class="nds-button-group-list">
                <li>
                  <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
                    <svg class="nds-button__icon" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#bold"></use>
                    </svg>
                    <span class="nds-assistive-text">Bold</span>
                  </button>
                </li>
                <li>
                  <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
                    <svg class="nds-button__icon" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#italic"></use>
                    </svg>
                    <span class="nds-assistive-text">Italic</span>
                  </button>
                </li>
                <li>
                  <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
                    <svg class="nds-button__icon" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#underline"></use>
                    </svg>
                    <span class="nds-assistive-text">Underline</span>
                  </button>
                </li>
                <li>
                  <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
                    <svg class="nds-button__icon" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#strikethrough"></use>
                    </svg>
                    <span class="nds-assistive-text">Strike Through</span>
                  </button>
                </li>
              </ul>
              <ul aria-label="Format background &amp; text color" class="nds-button-group-list">
                <li>
                  <button tabindex="-1" class="nds-button nds-button_icon nds-button_icon-more nds-button_icon-more-filled" aria-haspopup="true">
                    <svg class="nds-button__icon" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#text_background_color"></use>
                    </svg>
                    <svg class="nds-button__icon nds-button__icon_x-small" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
                    </svg>
                    <span class="nds-assistive-text">Background Color</span>
                  </button>
                </li>
                <li>
                  <button tabindex="-1" class="nds-button nds-button_icon nds-button_icon-more nds-button_icon-more-filled" aria-haspopup="true">
                    <svg class="nds-button__icon" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#text_color"></use>
                    </svg>
                    <svg class="nds-button__icon nds-button__icon_x-small" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
                    </svg>
                    <span class="nds-assistive-text">Text Color</span>
                  </button>
                </li>
              </ul>
              <ul aria-label="Format body" class="nds-button-group-list">
                <li>
                  <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
                    <svg class="nds-button__icon" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#richtextbulletedlist"></use>
                    </svg>
                    <span class="nds-assistive-text">Bulleted List</span>
                  </button>
                </li>
                <li>
                  <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
                    <svg class="nds-button__icon" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#richtextnumberedlist"></use>
                    </svg>
                    <span class="nds-assistive-text">Numbered List</span>
                  </button>
                </li>
                <li>
                  <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
                    <svg class="nds-button__icon" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#richtextindent"></use>
                    </svg>
                    <span class="nds-assistive-text">Indent</span>
                  </button>
                </li>
                <li>
                  <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
                    <svg class="nds-button__icon" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#richtextoutdent"></use>
                    </svg>
                    <span class="nds-assistive-text">Outdent</span>
                  </button>
                </li>
              </ul>
              <ul aria-label="Align text" class="nds-button-group-list">
                <li>
                  <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
                    <svg class="nds-button__icon" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#left_align_text"></use>
                    </svg>
                    <span class="nds-assistive-text">Left Align Text</span>
                  </button>
                </li>
                <li>
                  <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
                    <svg class="nds-button__icon" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#center_align_text"></use>
                    </svg>
                    <span class="nds-assistive-text">Center Align Text</span>
                  </button>
                </li>
                <li>
                  <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
                    <svg class="nds-button__icon" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#right_align_text"></use>
                    </svg>
                    <span class="nds-assistive-text">Right Align Text</span>
                  </button>
                </li>
              </ul>
              <ul aria-label="Insert content" class="nds-button-group-list">
                <li>
                  <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
                    <svg class="nds-button__icon" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#emoji"></use>
                    </svg>
                    <span class="nds-assistive-text">Add Emoji</span>
                  </button>
                </li>
                <li>
                  <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
                    <svg class="nds-button__icon" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#image"></use>
                    </svg>
                    <span class="nds-assistive-text">Add Image</span>
                  </button>
                </li>
                <li>
                  <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
                    <svg class="nds-button__icon" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#link"></use>
                    </svg>
                    <span class="nds-assistive-text">Add Link</span>
                  </button>
                </li>
              </ul>
              <ul aria-label="Remove Formatting" class="nds-button-group-list">
                <li>
                  <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
                    <svg class="nds-button__icon" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#remove_formatting"></use>
                    </svg>
                    <span class="nds-assistive-text">Remove Formatting</span>
                  </button>
                </li>
              </ul>
            </div>
            <div class="nds-rich-text-editor__textarea nds-grid">
              <div aria-label="Compose text" class="nds-rich-text-area__content nds-text-color_weak nds-grow" contenteditable="true">Compose Email...</div>
            </div>
          </div>
        </div>
      </div>
      <footer class="nds-docked-composer__footer nds-shrink-none">
        <div class="nds-col_bump-left nds-grid nds-grid_vertical-align-center">
          <div class="nds-grid nds-m-right_small" role="toolbar">
            <ul class="nds-grid" aria-label="Insert content">
              <li>
                <button class="nds-button nds-button_icon nds-button_icon-small" title="Attach File">
                  <svg class="nds-button__icon" aria-hidden="true">
                    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#link"></use>
                  </svg>
                  <span class="nds-assistive-text">Attach File</span>
                </button>
              </li>
              <li>
                <button class="nds-button nds-button_icon nds-button_icon-small" tabindex="-1" title="Insert Template">
                  <svg class="nds-button__icon" aria-hidden="true">
                    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#insert_template"></use>
                  </svg>
                  <span class="nds-assistive-text">Insert Template</span>
                </button>
              </li>
              <li>
                <button class="nds-button nds-button_icon nds-button_icon-small" tabindex="-1" title="Insert HTML">
                  <svg class="nds-button__icon" aria-hidden="true">
                    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#insert_tag_field"></use>
                  </svg>
                  <span class="nds-assistive-text">Insert HTML</span>
                </button>
              </li>
            </ul>
            <button class="nds-button nds-button_icon nds-button_icon-small" tabindex="-1" title="Preview">
              <svg class="nds-button__icon" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#preview"></use>
              </svg>
              <span class="nds-assistive-text">Preview</span>
            </button>
          </div>
          <button class="nds-button nds-button_brand">Send</button>
        </div>
      </footer>
    </section>
  </div>
</div>`);
  });
