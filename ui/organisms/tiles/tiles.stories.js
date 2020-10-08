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
    return withExample(`<div class="demo-only" style="width: 30rem;">
  <article class="nds-tile">
    <h3 class="nds-tile__title nds-truncate" title="Salesforce UX">
      <a href="javascript:void(0);">Salesforce UX</a>
    </h3>
    <div class="nds-tile__detail">
      <dl class="nds-list_horizontal nds-wrap">
        <dt class="nds-item_label nds-text-color_weak nds-truncate" title="First Label">First Label:</dt>
        <dd class="nds-item_detail nds-truncate" title="Description for first label">Description for first label</dd>
        <dt class="nds-item_label nds-text-color_weak nds-truncate" title="Second Label">Second Label:</dt>
        <dd class="nds-item_detail nds-truncate" title="Description for second label">Description for second label</dd>
      </dl>
    </div>
  </article>
</div>`);
  })
  .add('With Action (examples)', () => {
    return withExample(`<div class="demo-only" style="width: 30rem;">
  <article class="nds-tile nds-hint-parent">
    <div class="nds-grid nds-grid_align-spread nds-has-flexi-truncate">
      <h3 class="nds-tile__title nds-truncate" title="Salesforce UX">
        <a href="javascript:void(0);">Salesforce UX</a>
      </h3>
      <div class="nds-shrink-none">
        <button class="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small" aria-haspopup="true" title="More options">
          <svg class="nds-button__icon nds-button__icon_hint" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
          </svg>
          <span class="nds-assistive-text">More options</span>
        </button>
      </div>
    </div>
    <div class="nds-tile__detail">
      <dl class="nds-list_horizontal nds-wrap">
        <dt class="nds-item_label nds-text-color_weak nds-truncate" title="First Label">First Label:</dt>
        <dd class="nds-item_detail nds-truncate" title="Description for first label">Description for first label</dd>
        <dt class="nds-item_label nds-text-color_weak nds-truncate" title="Second Label">Second Label:</dt>
        <dd class="nds-item_detail nds-truncate" title="Description for second label">Description for second label</dd>
      </dl>
    </div>
  </article>
</div>`);
  })
  .add('With Icon (examples)', () => {
    return withExample(`<div class="demo-only" style="width: 30rem;">
  <article class="nds-tile nds-media">
    <div class="nds-media__figure">
      <span class="nds-icon_container" title="description of icon when needed">
        <svg class="nds-icon nds-icon-standard-groups" aria-hidden="true">
          <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#groups"></use>
        </svg>
      </span>
    </div>
    <div class="nds-media__body">
      <h3 class="nds-tile__title nds-truncate" title="Salesforce UX">
        <a href="javascript:void(0);">Salesforce UX</a>
      </h3>
      <div class="nds-tile__detail">
        <dl class="nds-list_horizontal nds-wrap">
          <dt class="nds-item_label nds-text-color_weak nds-truncate" title="First Label">First Label:</dt>
          <dd class="nds-item_detail nds-truncate" title="Description for first label">Description for first label</dd>
          <dt class="nds-item_label nds-text-color_weak nds-truncate" title="Second Label">Second Label:</dt>
          <dd class="nds-item_detail nds-truncate" title="Description for second label">Description for second label</dd>
        </dl>
      </div>
    </div>
  </article>
</div>`);
  })
  .add('With Avatar (examples)', () => {
    return withExample(`<div class="demo-only" style="width: 30rem;">
  <article class="nds-tile nds-media">
    <div class="nds-media__figure">
      <span class="nds-avatar nds-avatar_circle nds-avatar_medium">
        <img alt="" src="/assets/images/avatar2.jpg" title="Lexee L. Jackson avatar">
      </span>
    </div>
    <div class="nds-media__body">
      <h3 class="nds-tile__title nds-truncate" title="Lexee L. Jackson">
        <a href="javascript:void(0);">Lexee L. Jackson</a>
      </h3>
      <div class="nds-tile__detail">
        <dl class="nds-list_horizontal nds-wrap">
          <dt class="nds-item_label nds-text-color_weak nds-truncate" title="First Label">First Label:</dt>
          <dd class="nds-item_detail nds-truncate" title="Description for first label">Description for first label</dd>
          <dt class="nds-item_label nds-text-color_weak nds-truncate" title="Second Label">Second Label:</dt>
          <dd class="nds-item_detail nds-truncate" title="Description for second label">Description for second label</dd>
        </dl>
      </div>
    </div>
  </article>
</div>`);
  })
  .add('Task (examples)', () => {
    return withExample(`<div class="demo-only" style="width: 320px;">
  <article class="nds-tile nds-media">
    <div class="nds-media__figure">
      <label class="nds-checkbox">
        <input type="checkbox" name="options" id="checkbox-1" value="on">
        <span class="nds-checkbox_faux"></span>
        <label class="nds-checkbox__label">
          <span class="nds-form-element__label nds-assistive-text">Did you complete the task: Contact Trammel Crow Company?</span>
        </label>
      </label>
    </div>
    <div class="nds-media__body">
      <h3 class="nds-tile__title nds-truncate" title="Contact Trammel Crow Company">
        <a href="javascript:void(0);">Contact Trammel Crow Company</a>
      </h3>
      <div class="nds-tile__detail">
        <p class="nds-truncate" title="Assignee">Assignee</p>
      </div>
    </div>
  </article>
</div>`);
  })
  .add('Article (examples)', () => {
    return withExample(`<div class="demo-only" style="width: 320px;">
  <article class="nds-tile">
    <h3 class="nds-tile__title nds-truncate" title="Company One beats Company Two to the 200-mile affordable electric car">
      <a href="javascript:void(0);">Company One beats Company Two to the 200-mile affordable electric car</a>
    </h3>
    <div class="nds-tile__detail">
      <p>by Steve Author</p>
      <ul class="nds-list_horizontal nds-has-dividers_right">
        <li class="nds-item">Breaking News</li>
        <li class="nds-item">1 day ago</li>
      </ul>
    </div>
  </article>
</div>`);
  })
  .add('Article Liker Bar (examples)', () => {
    return withExample(`<div class="demo-only" style="width: 320px;">
  <article class="nds-tile">
    <h3 class="nds-tile__title nds-truncate" title="Company One beats Company Two to the 200-mile affordable electric car">
      <a href="javascript:void(0);">Company One beats Company Two to the 200-mile affordable electric car</a>
    </h3>
    <div class="nds-tile__detail">
      <p>...an introduction for beginners about climbing ropes and how they can use...</p>
      <ul class="nds-list_horizontal nds-has-dividers_right nds-m-top_xx-small">
        <li class="nds-item">000001296</li>
        <li class="nds-item">Published</li>
        <li class="nds-item">How to Guide</li>
      </ul>
      <p>Last Modified: 1/14/16</p>
      <ul class="nds-list_horizontal nds-m-top_xx-small">
        <li class="nds-m-right_small">
          <button class="nds-button nds-button_icon nds-button_icon-border nds-button_icon-x-small" aria-pressed="false">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#like"></use>
            </svg>
            <span class="nds-assistive-text">Upvote</span>
          </button>
          <span class="nds-align-middle">1320</span>
        </li>
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border nds-button_icon-x-small" aria-pressed="false">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#dislike"></use>
            </svg>
            <span class="nds-assistive-text">Downvote</span>
          </button>
          <span class="nds-align-middle">362</span>
        </li>
      </ul>
    </div>
  </article>
</div>`);
  })
  .add('Board (examples)', () => {
    return withExample(`<div class="demo-only" style="width: 320px;">
  <ul class="nds-has-dividers_around-space">
    <li class="nds-item">
      <article class="nds-tile nds-tile_board">
        <h3 class="nds-tile__title nds-truncate" title="Anypoint Connectors">
          <a href="javascript:void(0);">Anypoint Connectors</a>
        </h3>
        <div class="nds-tile__detail">
          <p class="nds-text-heading_medium">$500,000</p>
          <p class="nds-truncate" title="Company One">
            <a href="javascript:void(0);">Company One</a>
          </p>
          <p class="nds-truncate" title="Closing 9/30/2015">Closing 9/30/2015</p>
        </div>
      </article>
    </li>
    <li class="nds-item">
      <article class="nds-tile nds-tile_board">
        <h3 class="nds-tile__title nds-truncate" title="Cloudhub">
          <a href="javascript:void(0);">Cloudhub</a>
        </h3>
        <div class="nds-tile__detail">
          <p class="nds-text-heading_medium">$185,000</p>
          <p class="nds-truncate" title="Company Two">
            <a href="javascript:void(0);">Company Two</a>
          </p>
          <p class="nds-truncate nds-has-alert" title="Closing 12/15/2015">Closing 12/15/2015</p>
          <span class="nds-icon_container nds-tile_board__icon" title="description of icon when needed">
            <svg class="nds-icon nds-icon-text-warning nds-icon_x-small" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#warning"></use>
            </svg>
            <span class="nds-assistive-text">Warning Icon</span>
          </span>
        </div>
      </article>
    </li>
    <li class="nds-item">
      <article class="nds-tile nds-tile_board">
        <h3 class="nds-tile__title nds-truncate" title="600 Widgets">
          <a href="javascript:void(0);">600 Widgets</a>
        </h3>
        <div class="nds-tile__detail">
          <p class="nds-text-heading_medium">$35,000</p>
          <p class="nds-truncate" title="Company Three">
            <a href="javascript:void(0);">Company Three</a>
          </p>
          <p class="nds-truncate" title="Closing 10/12/2015">Closing 10/12/2015</p>
        </div>
      </article>
    </li>
  </ul>
</div>`);
  })
  .add('Brand (examples)', () => {
    return withExample(`<div class="demo-only" style="width: 320px;">
  <ul class="nds-has-dividers_around-space">
    <li>
      <article class="nds-tile nds-tile_brand">
        <h3 class="nds-tile__title nds-truncate" title="Anypoint Connectors">
          <a href="javascript:void(0);">Anypoint Connectors</a>
        </h3>
        <div class="nds-tile__detail">
          <p class="nds-text-heading_medium">$500,000</p>
          <p class="nds-truncate" title="Company One">
            <a href="javascript:void(0);">Company One</a>
          </p>
          <p class="nds-truncate" title="Closing 9/30/2015">Closing 9/30/2015</p>
        </div>
      </article>
    </li>
    <li>
      <article class="nds-tile nds-tile_brand">
        <h3 class="nds-tile__title nds-truncate" title="Cloudhub">
          <a href="javascript:void(0);">Cloudhub</a>
        </h3>
        <div class="nds-tile__detail">
          <p class="nds-text-heading_medium">$185,000</p>
          <p class="nds-truncate" title="Company Two">
            <a href="javascript:void(0);">Company Two</a>
          </p>
          <p class="nds-truncate nds-has-alert" title="Closing 12/15/2015">Closing 12/15/2015</p>
          <span class="nds-icon_container nds-tile_board__icon" title="description of icon when needed">
            <svg class="nds-icon nds-icon-text-warning nds-icon_x-small" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#warning"></use>
            </svg>
            <span class="nds-assistive-text">Warning Icon</span>
          </span>
        </div>
      </article>
    </li>
    <li>
      <article class="nds-tile nds-tile_brand">
        <h3 class="nds-tile__title nds-truncate" title="600 Widgets">
          <a href="javascript:void(0);">600 Widgets</a>
        </h3>
        <div class="nds-tile__detail">
          <p class="nds-text-heading_medium">$35,000</p>
          <p class="nds-truncate" title="Company Three">
            <a href="javascript:void(0);">Company Three</a>
          </p>
          <p class="nds-truncate" title="Closing 10/12/2015">Closing 10/12/2015</p>
        </div>
      </article>
    </li>
  </ul>
</div>`);
  });
