import {
  storiesOf
} from '@storybook/html';
import base from 'paths.macro';
import scss from './base/_index.scss';
import notes from './doc.md';
import {
  withExample,
  withDocs,
  commentToHTML
} from '../../../scripts/storybook';

storiesOf(`${base}`, module)
  .addDecorator(withDocs(notes))
  .addDecorator(commentToHTML(scss))
  .add('Default', () => {
  return withExample(`<ul class="nds-timeline">
    <li>
      <div class="nds-timeline__item">
        <span class="nds-assistive-text">Task</span>
        <div class="nds-media">
          <div class="nds-media__body">
            <div class="nds-media nds-timeline__media nds-timeline__media_task">
              <div class="nds-media__figure nds-timeline__icon">
                <div class="nds-icon_container nds-icon-standard-task"
                    title="task">
                  <svg class="nds-icon nds-icon_small"
                      aria-hidden="true">
                    <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#task"></use>
                  </svg>
                </div>
              </div>
              <div class="nds-media__body">
                <div class="nds-media">
                  <div class="nds-media__figure">
                    <label class="nds-checkbox">
                      <input type="checkbox"
                          name="options"
                          id="checkbox-3"
                          value="on">
                      <span class="nds-checkbox_faux"></span>
                      <label class="nds-checkbox__label">
                        <span
                            class="nds-form-element__label nds-assistive-text">mark-complete</span>
                      </label>
                    </label>
                  </div>
                  <div class="nds-media__body">
                    <h3 class="nds-truncate"
                        title="Review proposals for EBC deck with larger team and have marketing review this">
                      <a href="javascript:void(0);">Review proposals for EBC deck with larger team and
                          have marketing review this</a>
                    </h3>
                    <ul class="nds-list_horizontal nds-wrap">
                      <li class="nds-m-right_large">
                        <span class="nds-text-title">Contact:</span>
                        <span class="nds-text-body_small">
                          <a href="javascript:void(0);">Lei Chan</a>
                        </span>
                      </li>
                      <li class="nds-m-right_large">
                        <span class="nds-text-title">Assigned to:</span>
                        <span class="nds-text-body_small">
                          <a href="javascript:void(0);">Betty Mason</a>
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="nds-media__figure nds-media__figure_reverse">
            <div class="nds-timeline__actions">
              <p class="nds-timeline__date">Feb 24</p>
              <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small"
                    aria-haspopup="true"
                    title="More Options for Task, Review proposals">
                <svg class="nds-button__icon"
                    aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
                </svg>
                <span class="nds-assistive-text">More Options for Task, Review proposals</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </li>
    <li>
      <div class="nds-timeline__item">
        <span class="nds-assistive-text">Event</span>
        <div class="nds-media">
          <div class="nds-media__body">
            <div class="nds-media nds-timeline__media nds-timeline__media_event">
              <div class="nds-media__figure nds-timeline__icon">
                <div class="nds-icon_container nds-icon-standard-event"
                    title="event">
                  <svg class="nds-icon nds-icon_small"
                      aria-hidden="true">
                    <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#event"></use>
                  </svg>
                </div>
              </div>
              <div class="nds-media__body">
                <h3 class="nds-truncate"
                    title="Company One — EBC Meeting">
                  <a href="javascript:void(0);">Company One — EBC Meeting</a>
                </h3>
                <p class="nds-truncate"
                  title="Let’s get together to review the theater’s layout and facilities. We’ll also discuss potential things that truncate at a certain width.">
                  Let’s get together to review the theater’s layout and facilities. We’ll also discuss
                  potential things that truncate at a certain width.</p>
                <ul class="nds-list_horizontal nds-wrap">
                  <li class="nds-m-right_large">
                    <span class="nds-text-title">Time:</span>
                    <span class="nds-text-body_small">
                      <a href="javascript:void(0);">Feb 23, 2015 11:00am–12:00pm</a>
                    </span>
                  </li>
                  <li class="nds-m-right_large">
                    <span class="nds-text-title">Location:</span>
                    <span class="nds-text-body_small">
                      <a href="javascript:void(0);">300 Pike St, San Francisco CA</a>
                    </span>
                  </li>
                  <li class="nds-m-right_large">
                    <span class="nds-text-title">Name:</span>
                    <span class="nds-text-body_small">
                      <a href="javascript:void(0);">Lei Chan</a>
                      <a href="javascript:void(0);">Jason Dewar</a>
                      <a href="javascript:void(0);">Gwen Jones</a> and
                      <a href="javascript:void(0);">Pete Schaffer</a>
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="nds-media__figure nds-media__figure_reverse">
            <div class="nds-timeline__actions">
              <p class="nds-timeline__date">Feb 24</p>
              <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small"
                  aria-haspopup="true"
                  title="More Options for Event, Company One">
                <svg class="nds-button__icon"
                  aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
                </svg>
                <span class="nds-assistive-text">More Options for Event, Company One</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </li>
    <li>
      <div class="nds-timeline__item">
        <span class="nds-assistive-text">Call</span>
        <div class="nds-media">
          <div class="nds-media__body">
            <div class="nds-media nds-timeline__media nds-timeline__media_call">
              <div class="nds-media__figure nds-timeline__icon">
                <div class="nds-icon_container nds-icon-standard-log-a-call"
                  title="call">
                  <svg class="nds-icon nds-icon_small"
                    aria-hidden="true">
                    <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#log_a_call"></use>
                  </svg>
                </div>
              </div>
              <div class="nds-media__body">
                <h3 class="nds-truncate"
                  title="Mobile conversation on Monday">
                  <a href="javascript:void(0);">Mobile conversation on Monday</a>
                </h3>
                <p class="nds-truncate"
                  title="Lei seemed interested in closing this deal quickly! Let’s move.">Lei seemed
                  interested in closing this deal quickly! Let’s move.</p>
                <ul class="nds-list_horizontal nds-wrap">
                  <li class="nds-m-right_large">
                    <span class="nds-text-title">Name:</span>
                    <span class="nds-text-body_small">
                      <a href="javascript:void(0);">Lei Chan</a>
                    </span>
                  </li>
                  <li class="nds-m-right_large">
                    <span class="nds-text-title">Assigned to:</span>
                    <span class="nds-text-body_small">
                      <a href="javascript:void(0);">Betty Mason</a>
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="nds-media__figure nds-media__figure_reverse">
            <div class="nds-timeline__actions">
              <p class="nds-timeline__date">Feb 24</p>
              <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small"
                  aria-haspopup="true"
                  title="More Options for Call, Mobile conversation">
                <svg class="nds-button__icon"
                    aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
                </svg>
                <span class="nds-assistive-text">More Options for Call, Mobile conversation</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </li>
    <li>
      <div class="nds-timeline__item">
        <span class="nds-assistive-text">Email</span>
        <div class="nds-media">
          <div class="nds-media__body">
            <div class="nds-media nds-timeline__media nds-timeline__media_email">
              <div class="nds-media__figure nds-timeline__icon">
                <div class="nds-icon_container nds-icon-standard-email"
                    title="email">
                  <svg class="nds-icon nds-icon_small"
                      aria-hidden="true">
                    <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#email"></use>
                  </svg>
                </div>
              </div>
              <div class="nds-media__body">
                <h3 class="nds-truncate"
                  title="Mobile conversation on Monday">
                  <a href="javascript:void(0);">Mobile conversation on Monday</a>
                </h3>
                <p class="nds-truncate"
                  title="Hi guys, Thanks for meeting with the team today and going through the proposals we saw. This goes on until it’s truncated.">
                  Hi guys, Thanks for meeting with the team today and going through the proposals we saw.
                  This goes on until it’s truncated.</p>
                <ul class="nds-list_horizontal nds-wrap">
                  <li class="nds-truncate_container_50 nds-m-right_large nds-grid">
                    <span class="nds-text-title">To:</span>
                    <span class="nds-text-body_small nds-m-left_xx-small nds-truncate"
                      title="Lei Chan with Long Name that might go on for quite some distance futher than you might expect">
                      <a href="javascript:void(0);">Lei Chan with Long Name that might go on for quite
                        some distance futher than you might expect</a>
                    </span>
                    <span class="nds-no-flex nds-text-body_small"> + 44 more</span>
                  </li>
                  <li class="nds-m-right_large">
                    <span class="nds-text-title">From:</span>
                    <span class="nds-text-body_small">
                      <a href="javascript:void(0);">Jason Dewar</a>
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="nds-media__figure nds-media__figure_reverse">
            <div class="nds-timeline__actions">
              <p class="nds-timeline__date">Feb 24</p>
              <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small"
                  aria-haspopup="true"
                  title="More Options for Email, Mobile conversation">
                <svg class="nds-button__icon"
                    aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
                </svg>
                <span class="nds-assistive-text">More Options for Email, Mobile conversation</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </li>
  </ul>`);
});
