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
    return withExample(`<div class="demo-only" style="padding: 1rem;">
  <div class="nds-progress">
    <ol class="nds-progress__list">
      <li class="nds-progress__item nds-is-active">
        <button class="nds-button nds-progress__marker">
          <span class="nds-assistive-text">
            Step 1



            - Active

          </span>
        </button>
      </li>
      <li class="nds-progress__item">
        <button class="nds-button nds-progress__marker">
          <span class="nds-assistive-text">
            Step 2



          </span>
        </button>
      </li>
      <li class="nds-progress__item">
        <button class="nds-button nds-progress__marker">
          <span class="nds-assistive-text">
            Step 3



          </span>
        </button>
      </li>
      <li class="nds-progress__item">
        <button class="nds-button nds-progress__marker">
          <span class="nds-assistive-text">
            Step 4



          </span>
        </button>
      </li>
      <li class="nds-progress__item">
        <button class="nds-button nds-progress__marker">
          <span class="nds-assistive-text">
            Step 5



          </span>
        </button>
      </li>
    </ol>
    <div class="nds-progress-bar nds-progress-bar_x-small" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" role="progressbar">
      <span class="nds-progress-bar__value" style="width: 0%;">
        <span class="nds-assistive-text">
          Progress:

          0%

        </span>
      </span>
    </div>
  </div>
</div>`);
  })
  .add('Next Step (states)', () => {
    return withExample(`<div class="demo-only" style="padding: 1rem;">
  <div class="nds-progress">
    <ol class="nds-progress__list">
      <li class="nds-progress__item nds-is-completed">
        <button class="nds-button nds-button_icon nds-button_icon nds-progress__marker nds-progress__marker_icon" title="Step 1 - Completed">
          <svg class="nds-button__icon" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#success"></use>
          </svg>
          <span class="nds-assistive-text">Step 1 - Completed</span>
        </button>
      </li>
      <li class="nds-progress__item nds-is-active">
        <button class="nds-button nds-progress__marker">
          <span class="nds-assistive-text">
            Step 2



            - Active

          </span>
        </button>
      </li>
      <li class="nds-progress__item">
        <button class="nds-button nds-progress__marker">
          <span class="nds-assistive-text">
            Step 3



          </span>
        </button>
      </li>
      <li class="nds-progress__item">
        <button class="nds-button nds-progress__marker">
          <span class="nds-assistive-text">
            Step 4



          </span>
        </button>
      </li>
      <li class="nds-progress__item">
        <button class="nds-button nds-progress__marker">
          <span class="nds-assistive-text">
            Step 5



          </span>
        </button>
      </li>
    </ol>
    <div class="nds-progress-bar nds-progress-bar_x-small" aria-valuemin="0" aria-valuemax="100" aria-valuenow="25" role="progressbar">
      <span class="nds-progress-bar__value" style="width: 25%;">
        <span class="nds-assistive-text">
          Progress:

          25%

        </span>
      </span>
    </div>
  </div>
</div>`);
  })
  .add('Has Error (states)', () => {
    return withExample(`<div class="demo-only" style="padding: 1rem;">
  <div class="nds-progress">
    <ol class="nds-progress__list">
      <li class="nds-progress__item nds-is-completed">
        <button class="nds-button nds-button_icon nds-button_icon nds-progress__marker nds-progress__marker_icon" title="Step 1 - Completed">
          <svg class="nds-button__icon" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#success"></use>
          </svg>
          <span class="nds-assistive-text">Step 1 - Completed</span>
        </button>
      </li>
      <li class="nds-progress__item nds-has-error">
        <button class="nds-button nds-button_icon nds-button_icon nds-progress__marker nds-progress__marker_icon" title="Step 2 - Error">
          <svg class="nds-button__icon" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#warning"></use>
          </svg>
          <span class="nds-assistive-text">Step 2 - Error</span>
        </button>
      </li>
      <li class="nds-progress__item">
        <button class="nds-button nds-progress__marker">
          <span class="nds-assistive-text">
            Step 3



          </span>
        </button>
      </li>
      <li class="nds-progress__item">
        <button class="nds-button nds-progress__marker">
          <span class="nds-assistive-text">
            Step 4



          </span>
        </button>
      </li>
      <li class="nds-progress__item">
        <button class="nds-button nds-progress__marker">
          <span class="nds-assistive-text">
            Step 5



          </span>
        </button>
      </li>
    </ol>
    <div class="nds-progress-bar nds-progress-bar_x-small" aria-valuemin="0" aria-valuemax="100" aria-valuenow="25" role="progressbar">
      <span class="nds-progress-bar__value" style="width: 25%;">
        <span class="nds-assistive-text">
          Progress:

          25%

        </span>
      </span>
    </div>
  </div>
</div>`);
  })
  .add('Tooltip (states)', () => {
    return withExample(`<div class="demo-only" style="padding: 3rem 1rem 0px;">
  <div class="nds-progress">
    <ol class="nds-progress__list">
      <li class="nds-progress__item nds-is-completed">
        <button class="nds-button nds-button_icon nds-button_icon nds-progress__marker nds-progress__marker_icon" title="Step 1 - Completed">
          <svg class="nds-button__icon" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#success"></use>
          </svg>
          <span class="nds-assistive-text">Step 1 - Completed</span>
        </button>
      </li>
      <li class="nds-progress__item nds-is-completed">
        <button class="nds-button nds-button_icon nds-button_icon nds-progress__marker nds-progress__marker_icon" title="Step 2 - Completed">
          <svg class="nds-button__icon" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#success"></use>
          </svg>
          <span class="nds-assistive-text">Step 2 - Completed</span>
        </button>
      </li>
      <li class="nds-progress__item nds-is-active">
        <button class="nds-button nds-progress__marker" aria-describedby="step-3-tooltip">
          <span class="nds-assistive-text">
            Step 3



            - Active

          </span>
        </button>
      </li>
      <li class="nds-progress__item">
        <button class="nds-button nds-progress__marker">
          <span class="nds-assistive-text">
            Step 4



          </span>
        </button>
      </li>
      <li class="nds-progress__item">
        <button class="nds-button nds-progress__marker">
          <span class="nds-assistive-text">
            Step 5



          </span>
        </button>
      </li>
    </ol>
    <div class="nds-progress-bar nds-progress-bar_x-small" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50" role="progressbar">
      <span class="nds-progress-bar__value" style="width: 50%;">
        <span class="nds-assistive-text">
          Progress:

          50%

        </span>
      </span>
    </div>
  </div>
  <div class="nds-popover nds-popover_tooltip nds-nubbin_bottom" role="tooltip" id="step-3-tooltip" style="position: absolute; top: 0px; left: calc(50% + 7px); transform: translateX(-50%);">
    <div class="nds-popover__body">Verify Email</div>
  </div>
</div>`);
  })
  .add('Modal (examples)', () => {
    return withExample(`<div class="demo-only" style="height: 640px;">
  <section role="dialog" tabindex="-1" class="nds-modal nds-fade-in-open nds-modal_large" aria-labelledby="header43" aria-modal="true" aria-describedby="modal-content-id-1">
    <div class="nds-modal__container">
      <header class="nds-modal__header">
        <button class="nds-button nds-button_icon nds-modal__close nds-button_icon-inverse" title="Close">
          <svg class="nds-button__icon nds-button__icon_large" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
          </svg>
          <span class="nds-assistive-text">Close</span>
        </button>
        <h2 id="header43" class="nds-text-heading_medium">Modal Header</h2>
      </header>
      <div class="nds-modal__content nds-grow nds-p-around_medium" id="modal-content-id-1"></div>
      <footer class="nds-modal__footer nds-grid nds-grid_align-spread">
        <button class="nds-button nds-button_neutral">Cancel</button>
        <div class="nds-progress nds-progress_shade">
          <ol class="nds-progress__list">
            <li class="nds-progress__item nds-is-completed">
              <button class="nds-button nds-button_icon nds-button_icon nds-progress__marker nds-progress__marker_icon" title="Step 1 - Completed">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#success"></use>
                </svg>
                <span class="nds-assistive-text">Step 1 - Completed</span>
              </button>
            </li>
            <li class="nds-progress__item nds-is-active">
              <button class="nds-button nds-progress__marker">
                <span class="nds-assistive-text">
                  Step 2



                  - Active

                </span>
              </button>
            </li>
            <li class="nds-progress__item">
              <button class="nds-button nds-progress__marker">
                <span class="nds-assistive-text">
                  Step 3



                </span>
              </button>
            </li>
            <li class="nds-progress__item">
              <button class="nds-button nds-progress__marker">
                <span class="nds-assistive-text">
                  Step 4



                </span>
              </button>
            </li>
            <li class="nds-progress__item">
              <button class="nds-button nds-progress__marker">
                <span class="nds-assistive-text">
                  Step 5



                </span>
              </button>
            </li>
          </ol>
          <div class="nds-progress-bar nds-progress-bar_x-small" aria-valuemin="0" aria-valuemax="100" aria-valuenow="25" role="progressbar">
            <span class="nds-progress-bar__value" style="width: 25%;">
              <span class="nds-assistive-text">
                Progress:

                25%

              </span>
            </span>
          </div>
        </div>
        <button class="nds-button nds-button_brand">Save</button>
      </footer>
    </div>
  </section>
  <div class="nds-backdrop nds-backdrop_open"></div>
</div>`);
  })
  .add('Shade (examples)', () => {
    return withExample(`<div class="demo-only" style="background: rgb(244, 246, 249) none repeat scroll 0% 0%; padding: 1rem;">
  <div class="nds-progress nds-progress_shade">
    <ol class="nds-progress__list">
      <li class="nds-progress__item nds-is-completed">
        <button class="nds-button nds-button_icon nds-button_icon nds-progress__marker nds-progress__marker_icon" title="Step 1 - Completed">
          <svg class="nds-button__icon" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#success"></use>
          </svg>
          <span class="nds-assistive-text">Step 1 - Completed</span>
        </button>
      </li>
      <li class="nds-progress__item nds-is-active">
        <button class="nds-button nds-progress__marker">
          <span class="nds-assistive-text">
            Step 2



            - Active

          </span>
        </button>
      </li>
      <li class="nds-progress__item">
        <button class="nds-button nds-progress__marker">
          <span class="nds-assistive-text">
            Step 3



          </span>
        </button>
      </li>
      <li class="nds-progress__item">
        <button class="nds-button nds-progress__marker">
          <span class="nds-assistive-text">
            Step 4



          </span>
        </button>
      </li>
      <li class="nds-progress__item">
        <button class="nds-button nds-progress__marker">
          <span class="nds-assistive-text">
            Step 5



          </span>
        </button>
      </li>
    </ol>
    <div class="nds-progress-bar nds-progress-bar_x-small" aria-valuemin="0" aria-valuemax="100" aria-valuenow="25" role="progressbar">
      <span class="nds-progress-bar__value" style="width: 25%;">
        <span class="nds-assistive-text">
          Progress:

          25%

        </span>
      </span>
    </div>
  </div>
</div>`);
  });
