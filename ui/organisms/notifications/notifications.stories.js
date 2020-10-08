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
    return withExample(`<div class="demo-only nds-is-relative" style="height: 4.5rem;">
  <div class="nds-notification-container">
    <div aria-live="assertive" aria-atomic="true" class="nds-assistive-text">event notification: Tesla - Renewal meeting</div>
    <section class="nds-notification" role="dialog" aria-labelledby="noti52" aria-describedby="dialog-body-id-6">
      <div class="nds-notification__body" id="dialog-body-id-6">
        <a class="nds-notification__target nds-media" href="javascript:void(0);">
          <span class="nds-icon_container nds-icon-standard-event nds-media__figure" title="event">
            <svg class="nds-icon nds-icon--small" aria-hidden="true">
              <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#event"></use>
            </svg>
          </span>
          <div class="nds-media__body">
            <h2 class="nds-text-heading--small nds-m-bottom--xx-small" id="noti52">
              <span class="nds-assistive-text">event notification:</span>
              Tesla - Renewal meeting

            </h2>
            <p>Event at 11:00am on Jan 8</p>
          </div>
        </a>
        <button class="nds-button nds-button_icon nds-button--icon-container nds-notification__close" title="Dismiss Tesla - Renewal meeting notification">
          <svg class="nds-button__icon" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
          </svg>
          <span class="nds-assistive-text">Dismiss Tesla - Renewal meeting notification</span>
        </button>
      </div>
    </section>
  </div>
</div>`);
  })
  .add('Task Notification (examples)', () => {
    return withExample(`<div class="demo-only nds-is-relative" style="height: 4.5rem;">
  <div class="nds-notification-container">
    <div aria-live="assertive" aria-atomic="true" class="nds-assistive-text">task notification: Call Two: Jane Johnson</div>
    <section class="nds-notification" role="dialog" aria-labelledby="noti77" aria-describedby="dialog-body-id-10">
      <div class="nds-notification__body" id="dialog-body-id-10">
        <a class="nds-notification__target nds-media" href="javascript:void(0);">
          <span class="nds-icon_container nds-icon-standard-task nds-media__figure" title="task">
            <svg class="nds-icon nds-icon--small" aria-hidden="true">
              <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#task"></use>
            </svg>
          </span>
          <div class="nds-media__body">
            <h2 class="nds-text-heading--small nds-m-bottom--xx-small" id="noti77">
              <span class="nds-assistive-text">task notification:</span>
              Call Two: Jane Johnson

            </h2>
            <p>Task due on Jan 8</p>
          </div>
        </a>
        <button class="nds-button nds-button_icon nds-button--icon-container nds-notification__close" title="Dismiss Call Two: Jane Johnson notification">
          <svg class="nds-button__icon" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
          </svg>
          <span class="nds-assistive-text">Dismiss Call Two: Jane Johnson notification</span>
        </button>
      </div>
    </section>
  </div>
</div>`);
  })
  .add('Stacked 2 (examples)', () => {
    return withExample(`<div class="demo-only nds-is-relative" style="height: 15rem;">
  <div class="nds-notification-container">
    <div aria-live="assertive" aria-atomic="true" class="nds-assistive-text">task notification: Call Two: Jane Johnson</div>
    <section class="nds-notification" role="dialog" aria-labelledby="noti77" aria-describedby="dialog-body-id-11">
      <div class="nds-notification__body" id="dialog-body-id-11">
        <a class="nds-notification__target nds-media" href="javascript:void(0);">
          <span class="nds-icon_container nds-icon-standard-task nds-media__figure" title="task">
            <svg class="nds-icon nds-icon--small" aria-hidden="true">
              <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#task"></use>
            </svg>
          </span>
          <div class="nds-media__body">
            <h2 class="nds-text-heading--small nds-m-bottom--xx-small" id="noti77">
              <span class="nds-assistive-text">task notification:</span>
              Call Two: Jane Johnson

            </h2>
            <p>Task due on Jan 8</p>
          </div>
        </a>
        <button class="nds-button nds-button_icon nds-button--icon-container nds-notification__close" title="Dismiss Call Two: Jane Johnson notification">
          <svg class="nds-button__icon" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
          </svg>
          <span class="nds-assistive-text">Dismiss Call Two: Jane Johnson notification</span>
        </button>
      </div>
    </section>
    <section class="nds-notification" role="dialog" aria-labelledby="noti52" aria-describedby="dialog-body-id-12">
      <div class="nds-notification__body" id="dialog-body-id-12">
        <a class="nds-notification__target nds-media" href="javascript:void(0);">
          <span class="nds-icon_container nds-icon-standard-event nds-media__figure" title="event">
            <svg class="nds-icon nds-icon--small" aria-hidden="true">
              <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#event"></use>
            </svg>
          </span>
          <div class="nds-media__body">
            <h2 class="nds-text-heading--small nds-m-bottom--xx-small" id="noti52">
              <span class="nds-assistive-text">event notification:</span>
              Tesla - Renewal meeting

            </h2>
            <p>Event at 11:00am on Jan 8</p>
          </div>
        </a>
        <button class="nds-button nds-button_icon nds-button--icon-container nds-notification__close" title="Dismiss Tesla - Renewal meeting notification">
          <svg class="nds-button__icon" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
          </svg>
          <span class="nds-assistive-text">Dismiss Tesla - Renewal meeting notification</span>
        </button>
      </div>
    </section>
  </div>
</div>`);
  })
  .add('Stacked 3 (examples)', () => {
    return withExample(`<div class="demo-only nds-is-relative" style="height: 15rem;">
  <div class="nds-notification-container">
    <div aria-live="assertive" aria-atomic="true" class="nds-assistive-text">task notification: Call Two: Jane Johnson</div>
    <section class="nds-notification" role="dialog" aria-labelledby="noti77" aria-describedby="dialog-body-id-7">
      <div class="nds-notification__body" id="dialog-body-id-7">
        <a class="nds-notification__target nds-media" href="javascript:void(0);">
          <span class="nds-icon_container nds-icon-standard-task nds-media__figure" title="task">
            <svg class="nds-icon nds-icon--small" aria-hidden="true">
              <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#task"></use>
            </svg>
          </span>
          <div class="nds-media__body">
            <h2 class="nds-text-heading--small nds-m-bottom--xx-small" id="noti77">
              <span class="nds-assistive-text">task notification:</span>
              Call Two: Jane Johnson

            </h2>
            <p>Task due on Jan 8</p>
          </div>
        </a>
        <button class="nds-button nds-button_icon nds-button--icon-container nds-notification__close" title="Dismiss Call Two: Jane Johnson notification">
          <svg class="nds-button__icon" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
          </svg>
          <span class="nds-assistive-text">Dismiss Call Two: Jane Johnson notification</span>
        </button>
      </div>
    </section>
    <section class="nds-notification" role="dialog" aria-labelledby="noti52" aria-describedby="dialog-body-id-8">
      <div class="nds-notification__body" id="dialog-body-id-8">
        <a class="nds-notification__target nds-media" href="javascript:void(0);">
          <span class="nds-icon_container nds-icon-standard-event nds-media__figure" title="event">
            <svg class="nds-icon nds-icon--small" aria-hidden="true">
              <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#event"></use>
            </svg>
          </span>
          <div class="nds-media__body">
            <h2 class="nds-text-heading--small nds-m-bottom--xx-small" id="noti52">
              <span class="nds-assistive-text">event notification:</span>
              Tesla - Renewal meeting

            </h2>
            <p>Event at 11:00am on Jan 8</p>
          </div>
        </a>
        <button class="nds-button nds-button_icon nds-button--icon-container nds-notification__close" title="Dismiss Tesla - Renewal meeting notification">
          <svg class="nds-button__icon" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
          </svg>
          <span class="nds-assistive-text">Dismiss Tesla - Renewal meeting notification</span>
        </button>
      </div>
    </section>
    <section class="nds-notification" role="dialog" aria-labelledby="noti66" aria-describedby="dialog-body-id-9">
      <div class="nds-notification__body" id="dialog-body-id-9">
        <a class="nds-notification__target nds-media" href="javascript:void(0);">
          <span class="nds-icon_container nds-icon-standard-task nds-media__figure" title="task">
            <svg class="nds-icon nds-icon--small" aria-hidden="true">
              <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#task"></use>
            </svg>
          </span>
          <div class="nds-media__body">
            <h2 class="nds-text-heading--small nds-m-bottom--xx-small" id="noti66">
              <span class="nds-assistive-text">task notification:</span>
              Call Three: Jim Jameson

            </h2>
            <p>Task due on Jan 8</p>
          </div>
        </a>
        <button class="nds-button nds-button_icon nds-button--icon-container nds-notification__close" title="Dismiss Call Three: Jim Jameson notification">
          <svg class="nds-button__icon" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
          </svg>
          <span class="nds-assistive-text">Dismiss Call Three: Jim Jameson notification</span>
        </button>
      </div>
    </section>
  </div>
</div>`);
  })
  .add('Overflow Six (examples)', () => {
    return withExample(`<div class="demo-only nds-is-relative" style="height: 17rem;">
  <div class="nds-notification-container">
    <div aria-live="assertive" aria-atomic="true" class="nds-assistive-text">task notification: Call Two: Jane Johnson</div>
    <section class="nds-notification" role="dialog" aria-labelledby="noti77" aria-describedby="dialog-body-id-13">
      <div class="nds-notification__body" id="dialog-body-id-13">
        <a class="nds-notification__target nds-media" href="javascript:void(0);">
          <span class="nds-icon_container nds-icon-standard-task nds-media__figure" title="task">
            <svg class="nds-icon nds-icon--small" aria-hidden="true">
              <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#task"></use>
            </svg>
          </span>
          <div class="nds-media__body">
            <h2 class="nds-text-heading--small nds-m-bottom--xx-small" id="noti77">
              <span class="nds-assistive-text">task notification:</span>
              Call Two: Jane Johnson

            </h2>
            <p>Task due on Jan 8</p>
          </div>
        </a>
        <button class="nds-button nds-button_icon nds-button--icon-container nds-notification__close" title="Dismiss Call Two: Jane Johnson notification">
          <svg class="nds-button__icon" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
          </svg>
          <span class="nds-assistive-text">Dismiss Call Two: Jane Johnson notification</span>
        </button>
      </div>
    </section>
    <section class="nds-notification" role="dialog" aria-labelledby="noti52" aria-describedby="dialog-body-id-14">
      <div class="nds-notification__body" id="dialog-body-id-14">
        <a class="nds-notification__target nds-media" href="javascript:void(0);">
          <span class="nds-icon_container nds-icon-standard-event nds-media__figure" title="event">
            <svg class="nds-icon nds-icon--small" aria-hidden="true">
              <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#event"></use>
            </svg>
          </span>
          <div class="nds-media__body">
            <h2 class="nds-text-heading--small nds-m-bottom--xx-small" id="noti52">
              <span class="nds-assistive-text">event notification:</span>
              Tesla - Renewal meeting

            </h2>
            <p>Event at 11:00am on Jan 8</p>
          </div>
        </a>
        <button class="nds-button nds-button_icon nds-button--icon-container nds-notification__close" title="Dismiss Tesla - Renewal meeting notification">
          <svg class="nds-button__icon" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
          </svg>
          <span class="nds-assistive-text">Dismiss Tesla - Renewal meeting notification</span>
        </button>
      </div>
    </section>
    <section class="nds-notification" role="dialog" aria-labelledby="noti66" aria-describedby="dialog-body-id-15">
      <div class="nds-notification__body" id="dialog-body-id-15">
        <a class="nds-notification__target nds-media" href="javascript:void(0);">
          <span class="nds-icon_container nds-icon-standard-task nds-media__figure" title="task">
            <svg class="nds-icon nds-icon--small" aria-hidden="true">
              <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#task"></use>
            </svg>
          </span>
          <div class="nds-media__body">
            <h2 class="nds-text-heading--small nds-m-bottom--xx-small" id="noti66">
              <span class="nds-assistive-text">task notification:</span>
              Call Three: Jim Jameson

            </h2>
            <p>Task due on Jan 8</p>
          </div>
        </a>
        <button class="nds-button nds-button_icon nds-button--icon-container nds-notification__close" title="Dismiss Call Three: Jim Jameson notification">
          <svg class="nds-button__icon" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
          </svg>
          <span class="nds-assistive-text">Dismiss Call Three: Jim Jameson notification</span>
        </button>
      </div>
    </section>
    <section class="nds-notification" role="dialog" aria-labelledby="noti48" aria-describedby="dialog-body-id-16">
      <div class="nds-notification__body" id="dialog-body-id-16">
        <a class="nds-notification__target nds-media" href="javascript:void(0);">
          <span class="nds-icon_container nds-icon-standard-task nds-media__figure" title="task">
            <svg class="nds-icon nds-icon--small" aria-hidden="true">
              <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#task"></use>
            </svg>
          </span>
          <div class="nds-media__body">
            <h2 class="nds-text-heading--small nds-m-bottom--xx-small" id="noti48">
              <span class="nds-assistive-text">task notification:</span>
              Call Two: Jane Johnson

            </h2>
            <p>Task due on Jan 8</p>
          </div>
        </a>
        <button class="nds-button nds-button_icon nds-button--icon-container nds-notification__close" title="Dismiss Call Two: Jane Johnson notification">
          <svg class="nds-button__icon" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
          </svg>
          <span class="nds-assistive-text">Dismiss Call Two: Jane Johnson notification</span>
        </button>
      </div>
    </section>
    <section class="nds-notification" role="dialog" aria-labelledby="noti59" aria-describedby="dialog-body-id-17">
      <div class="nds-notification__body" id="dialog-body-id-17">
        <a class="nds-notification__target nds-media" href="javascript:void(0);">
          <span class="nds-icon_container nds-icon-standard-event nds-media__figure" title="event">
            <svg class="nds-icon nds-icon--small" aria-hidden="true">
              <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#event"></use>
            </svg>
          </span>
          <div class="nds-media__body">
            <h2 class="nds-text-heading--small nds-m-bottom--xx-small" id="noti59">
              <span class="nds-assistive-text">event notification:</span>
              Tesla - Renewal meeting

            </h2>
            <p>Event at 11:00am on Jan 8</p>
          </div>
        </a>
        <button class="nds-button nds-button_icon nds-button--icon-container nds-notification__close" title="Dismiss Tesla - Renewal meeting notification">
          <svg class="nds-button__icon" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
          </svg>
          <span class="nds-assistive-text">Dismiss Tesla - Renewal meeting notification</span>
        </button>
      </div>
    </section>
    <section class="nds-notification" role="dialog" aria-labelledby="noti86" aria-describedby="dialog-body-id-18">
      <div class="nds-notification__body" id="dialog-body-id-18">
        <a class="nds-notification__target nds-media" href="javascript:void(0);">
          <span class="nds-icon_container nds-icon-standard-task nds-media__figure" title="task">
            <svg class="nds-icon nds-icon--small" aria-hidden="true">
              <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#task"></use>
            </svg>
          </span>
          <div class="nds-media__body">
            <h2 class="nds-text-heading--small nds-m-bottom--xx-small" id="noti86">
              <span class="nds-assistive-text">task notification:</span>
              Call Three: Jim Jameson

            </h2>
            <p>Task due on Jan 8</p>
          </div>
        </a>
        <button class="nds-button nds-button_icon nds-button--icon-container nds-notification__close" title="Dismiss Call Three: Jim Jameson notification">
          <svg class="nds-button__icon" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
          </svg>
          <span class="nds-assistive-text">Dismiss Call Three: Jim Jameson notification</span>
        </button>
      </div>
    </section>
  </div>
</div>`);
  });
