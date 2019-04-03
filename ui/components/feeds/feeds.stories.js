import { storiesOf } from '@storybook/html';
import base from 'paths.macro';
import notes from './doc.md';
import additionalNotes from './base/index.markup.md';
import scss from './base/_index.scss';
import {
  withExample,
  withDocs,
  commentToHTML
} from '../../../scripts/storybook';

storiesOf(`${base}`, module)
  .addDecorator(withDocs(notes + additionalNotes))
  .addDecorator(commentToHTML(scss))
  .add('Default (default)', () => {
    return withExample(`<div class="nds-feed">
  <ul class="nds-feed__list">
    <li class="nds-feed__item">
      <article class="nds-post">
        <header class="nds-post__header nds-media">
          <div class="nds-media__figure">
            <a href="javascript:void(0);" class="nds-avatar nds-avatar_circle nds-avatar_large">
              <img alt="Jason Rodgers" src="/assets/images/avatar1.jpg" title="Jason Rodgers avatar">
            </a>
          </div>
          <div class="nds-media__body">
            <div class="nds-grid nds-grid_align-spread nds-has-flexi-truncate">
              <p>
                <a href="javascript:void(0);" title="Jason Rodgers">Jason Rogers</a>


                —



                <a href="javascript:void(0);" title="Design Systems">Design Systems</a>
              </p>
              <button class="nds-button nds-button_icon nds-button_icon-border nds-button_icon-x-small" aria-haspopup="true" title="More Options">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
                </svg>
                <span class="nds-assistive-text">More Options</span>
              </button>
            </div>
            <p class="nds-text-body_small">
              <a href="javascript:void(0);" title="Click for single-item view of this post" class="nds-text-link_reset">5 days Ago</a>
            </p>
          </div>
        </header>
        <div class="nds-post__content nds-text-longform">
          <p>
            Hey there! Here's the latest demo presentation



            <a href="javascript:void(0);" title="Jenna Davis">@Jenna Davis</a>
            , let me know if there are any changes. I've updated slides 3-8 and slides 16-18 slides with new product shots.

          </p>
        </div>
        <footer class="nds-post__footer">
          <ul class="nds-post__footer-actions-list nds-list_horizontal">
            <li class="nds-col nds-item nds-m-right_medium">
              <button title="Like this item" class="nds-button_reset nds-post__footer-action" aria-pressed="false">
                <svg class="nds-icon nds-icon-text-default nds-icon_x-small nds-align-middle" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#like"></use>
                </svg>
                Like

              </button>
            </li>
            <li class="nds-col nds-item nds-m-right_medium">
              <button title="Comment on this item" class="nds-button_reset nds-post__footer-action">
                <svg class="nds-icon nds-icon-text-default nds-icon_x-small nds-align-middle" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#share_post"></use>
                </svg>


                Comment

              </button>
            </li>
            <li class="nds-col nds-item nds-m-right_medium">
              <button title="Share this item" class="nds-button_reset nds-post__footer-action">
                <svg class="nds-icon nds-icon-text-default nds-icon_x-small nds-align-middle" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#share"></use>
                </svg>


                Share

              </button>
            </li>
          </ul>
          <ul class="nds-post__footer-meta-list nds-list_horizontal nds-has-dividers_right nds-text-title">
            <li class="nds-item">20 shares</li>
            <li class="nds-item">259 views</li>
          </ul>
        </footer>
      </article>
      <div class="nds-feed__item-comments">
        <div class="nds-p-horizontal_medium nds-p-vertical_x-small nds-grid">
          <button class="nds-button_reset nds-text-link">More comments</button>
          <span class="nds-text-body_small nds-col_bump-left">1 of 8</span>
        </div>
        <ul>
          <li>
            <article class="nds-comment nds-media nds-hint-parent">
              <div class="nds-media__figure">
                <a href="javascript:void(0);" class="nds-avatar nds-avatar_circle nds-avatar_medium">
                  <img alt="Jenna Davis" src="/assets/images/avatar2.jpg" title="Jenna Davis avatar">
                </a>
              </div>
              <div class="nds-media__body">
                <header class="nds-media nds-media_center">
                  <div class="nds-grid nds-grid_align-spread nds-has-flexi-truncate">
                    <p class="nds-truncate" title="Jenna Davis">
                      <a href="javascript:void(0);">Jenna Davis</a>
                    </p>
                    <button class="nds-button nds-button_icon nds-button_icon-border nds-button_icon-x-small" aria-haspopup="true" title="More Options">
                      <svg class="nds-button__icon" aria-hidden="true">
                        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
                      </svg>
                      <span class="nds-assistive-text">More Options</span>
                    </button>
                  </div>
                </header>
                <div class="nds-comment__content nds-text-longform">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>
                <footer>
                  <ul class="nds-list_horizontal nds-has-dividers_right nds-text-body_small">
                    <li class="nds-item">
                      <button class="nds-button_reset nds-text-color_weak" title="Like this item" aria-pressed="false">Like</button>
                    </li>
                    <li class="nds-item">16hr Ago</li>
                  </ul>
                </footer>
              </div>
            </article>
          </li>
        </ul>
      </div>
    </li>
    <li class="nds-feed__item">
      <article class="nds-post">
        <header class="nds-post__header nds-media">
          <div class="nds-media__figure">
            <a href="javascript:void(0);" class="nds-avatar nds-avatar_circle nds-avatar_large">
              <img alt="Jason Rodgers" src="/assets/images/avatar1.jpg" title="Jason Rodgers avatar">
            </a>
          </div>
          <div class="nds-media__body">
            <div class="nds-grid nds-grid_align-spread nds-has-flexi-truncate">
              <p>
                <a href="javascript:void(0);" title="Jason Rodgers">Jason Rogers</a>


                —



                <a href="javascript:void(0);" title="Design Systems">Design Systems</a>
              </p>
              <button class="nds-button nds-button_icon nds-button_icon-border nds-button_icon-x-small" aria-haspopup="true" title="More Options">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
                </svg>
                <span class="nds-assistive-text">More Options</span>
              </button>
            </div>
            <p class="nds-text-body_small">
              <a href="javascript:void(0);" title="Click for single-item view of this post" class="nds-text-link_reset">5 days Ago</a>
            </p>
          </div>
        </header>
        <div class="nds-post__content nds-text-longform">
          <p>
            Hey there! Here's the latest demo presentation



            <a href="javascript:void(0);" title="Jenna Davis">@Jenna Davis</a>
            , let me know if there are any changes. I've updated slides 3-8 and slides 16-18 slides with new product shots.

          </p>
        </div>
        <footer class="nds-post__footer">
          <ul class="nds-post__footer-actions-list nds-list_horizontal">
            <li class="nds-col nds-item nds-m-right_medium">
              <button title="Like this item" class="nds-button_reset nds-post__footer-action" aria-pressed="false">
                <svg class="nds-icon nds-icon-text-default nds-icon_x-small nds-align-middle" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#like"></use>
                </svg>
                Like

              </button>
            </li>
            <li class="nds-col nds-item nds-m-right_medium">
              <button title="Comment on this item" class="nds-button_reset nds-post__footer-action">
                <svg class="nds-icon nds-icon-text-default nds-icon_x-small nds-align-middle" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#share_post"></use>
                </svg>


                Comment

              </button>
            </li>
            <li class="nds-col nds-item nds-m-right_medium">
              <button title="Share this item" class="nds-button_reset nds-post__footer-action">
                <svg class="nds-icon nds-icon-text-default nds-icon_x-small nds-align-middle" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#share"></use>
                </svg>


                Share

              </button>
            </li>
          </ul>
          <ul class="nds-post__footer-meta-list nds-list_horizontal nds-has-dividers_right nds-text-title">
            <li class="nds-item">20 shares</li>
            <li class="nds-item">259 views</li>
          </ul>
        </footer>
      </article>
    </li>
  </ul>
</div>`);
  });
