import { storiesOf } from '@storybook/html';
import base from 'paths.macro';
import notes from '../doc.md';
import scss from '../base/_index.scss';
import postscss from './_index.scss';
import {
  withExample,
  withDocs,
  commentToHTML
} from '../../../../scripts/storybook';

storiesOf(`${base}`, module)
  .addDecorator(withDocs(notes))
  .addDecorator(commentToHTML(scss + postscss))
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
    </li>
  </ul>
</div>`);
  })
  .add('Post With Liker Bar (states)', () => {
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
              <button title="Like this item" class="nds-button_reset nds-post__footer-action nds-is-active" aria-pressed="true">
                <svg class="nds-icon nds-icon-text-default nds-icon_x-small nds-align-middle" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#like"></use>
                </svg>
                Liked

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
        <div class="nds-p-horizontal_medium nds-p-vertical_x-small">
          <a href="javascript:void(0);">You</a>
          liked this post

        </div>
      </div>
    </li>
  </ul>
</div>`);
  })
  .add('Post Attachment Link (examples)', () => {
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
        <div class="nds-post__payload">
          <a href="javascript:void(0);" class="nds-media nds-box nds-grow nds-text-link_reset">
            <div class="nds-media__figure nds-medium-show">
              <div class="nds-file nds-size_small">
                <div class="nds-file__crop nds-file__crop_16-by-9">
                  <img src="/assets/images/placeholder-img@16x9.jpg" alt="Image Title">
                </div>
              </div>
            </div>
            <div class="nds-media__body">
              <h3 class="nds-text-heading_small">Maui By Air The Best Way Around The Island</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt.</p>
              <span class="nds-text-body_small">Maui By Air The Best Way Around The Island</span>
            </div>
          </a>
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
  })
  .add('Post Attachment Files (examples)', () => {
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
        <div class="nds-post__payload">
          <ul class="nds-grid nds-grid_pull-padded">
            <li class="nds-p-horizontal_xx-small nds-size_1-of-2 nds-medium-size_1-of-3">
              <div class="nds-file nds-file_card">
                <figure>
                  <a href="javascript:void(0);" class="nds-file__crop nds-file__crop_16-by-9">
                    <img src="/assets/images/placeholder-img@16x9.jpg" alt="Description of the image">
                  </a>
                  <figcaption class="nds-file__title nds-file__title_card">
                    <div class="nds-media nds-media_small nds-media_center">
                      <div class="nds-media__figure nds-line-height_reset">
                        <span class="nds-icon_container" title="image">
                          <svg class="nds-icon nds-icon_x-small" aria-hidden="true">
                            <use xlink:href="/assets/icons/doctype-sprite/svg/symbols.svg#image"></use>
                          </svg>
                          <span class="nds-assistive-text">image</span>
                        </span>
                      </div>
                      <div class="nds-media__body">
                        <span class="nds-file__text nds-truncate" title="Image Title">
                          Image Title

                        </span>
                      </div>
                    </div>
                  </figcaption>
                </figure>
              </div>
            </li>
            <li class="nds-p-horizontal_xx-small nds-size_1-of-2 nds-medium-size_1-of-3 nds-medium-show">
              <div class="nds-file nds-file_card">
                <figure>
                  <a href="javascript:void(0);" class="nds-file__crop nds-file__crop_16-by-9">
                    <span class="nds-file__icon nds-icon_container" title="pdf">
                      <svg class="nds-icon" aria-hidden="true">
                        <use xlink:href="/assets/icons/doctype-sprite/svg/symbols.svg#pdf"></use>
                      </svg>
                      <span class="nds-assistive-text">Image Title</span>
                    </span>
                  </a>
                  <figcaption class="nds-file__title nds-file__title_card">
                    <div class="nds-media nds-media_small nds-media_center">
                      <div class="nds-media__figure nds-line-height_reset">
                        <span class="nds-icon_container" title="pdf">
                          <svg class="nds-icon nds-icon_x-small" aria-hidden="true">
                            <use xlink:href="/assets/icons/doctype-sprite/svg/symbols.svg#pdf"></use>
                          </svg>
                          <span class="nds-assistive-text">pdf</span>
                        </span>
                      </div>
                      <div class="nds-media__body">
                        <span class="nds-file__text nds-truncate" title="Image Title">
                          Image Title

                        </span>
                      </div>
                    </div>
                  </figcaption>
                </figure>
              </div>
            </li>
            <li class="nds-p-horizontal_xx-small nds-size_1-of-2 nds-medium-size_1-of-3">
              <div class="nds-file nds-file_card">
                <figure>
                  <a href="javascript:void(0);" class="nds-file__crop nds-file__crop_16-by-9">
                    <div class="nds-file_overlay"></div>
                    <img src="/assets/images/placeholder-img@16x9.jpg" alt="Description of the image">
                  </a>
                  <figcaption class="nds-file__title nds-file__title_overlay nds-align_absolute-center nds-text-heading_large">
                    <div class="nds-media nds-media_small nds-media_center">
                      <div class="nds-media__figure nds-line-height_reset"></div>
                      <div class="nds-media__body">
                        <span class="nds-file__text nds-truncate" title="22+">
                          22+

                          <span class="nds-assistive-text">more files</span>
                        </span>
                      </div>
                    </div>
                  </figcaption>
                </figure>
              </div>
            </li>
          </ul>
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
  })
  .add('Post With Comments (examples)', () => {
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
            <li class="nds-item">
              2

              comments

            </li>
            <li class="nds-item">20 shares</li>
            <li class="nds-item">259 views</li>
          </ul>
        </footer>
      </article>
      <div class="nds-feed__item-comments">
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
        <div class="nds-media nds-comment nds-hint-parent">
          <div class="nds-media__figure">
            <a class="nds-avatar nds-avatar_circle nds-avatar_medium" href="javascript:void(0);">
              <img alt="Person name" src="/assets/images/avatar2.jpg" title="User avatar">
            </a>
          </div>
          <div class="nds-media__body">
            <div class="nds-publisher nds-publisher_comment">
              <label for="comment-text-input-01" class="nds-assistive-text">Write a comment</label>
              <textarea id="comment-text-input-01" class="nds-publisher__input nds-input_bare nds-text-longform" placeholder="Write a comment…"></textarea>
              <div class="nds-publisher__actions nds-grid nds-grid_align-spread">
                <ul class="nds-grid">
                  <li>
                    <button class="nds-button nds-button_icon nds-button_icon-container" title="Add User">
                      <svg class="nds-button__icon" aria-hidden="true">
                        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#adduser"></use>
                      </svg>
                      <span class="nds-assistive-text">Add User</span>
                    </button>
                  </li>
                  <li>
                    <button class="nds-button nds-button_icon nds-button_icon-container" title="Attach a file">
                      <svg class="nds-button__icon" aria-hidden="true">
                        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#attach"></use>
                      </svg>
                      <span class="nds-assistive-text">Attach a file</span>
                    </button>
                  </li>
                </ul>
                <button class="nds-button nds-button_brand">Comment</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </li>
  </ul>
</div>`);
  })
  .add('Post With Overflow (examples)', () => {
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
            Here's the latest demo presentation



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
            <li class="nds-item">
              8

              comments

            </li>
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
        <div class="nds-media nds-comment nds-hint-parent">
          <div class="nds-media__figure">
            <a class="nds-avatar nds-avatar_circle nds-avatar_medium" href="javascript:void(0);">
              <img alt="Person name" src="/assets/images/avatar2.jpg" title="User avatar">
            </a>
          </div>
          <div class="nds-media__body">
            <div class="nds-publisher nds-publisher_comment">
              <label for="comment-text-input-01" class="nds-assistive-text">Write a comment</label>
              <textarea id="comment-text-input-01" class="nds-publisher__input nds-input_bare nds-text-longform" placeholder="Write a comment…"></textarea>
              <div class="nds-publisher__actions nds-grid nds-grid_align-spread">
                <ul class="nds-grid">
                  <li>
                    <button class="nds-button nds-button_icon nds-button_icon-container" title="Add User">
                      <svg class="nds-button__icon" aria-hidden="true">
                        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#adduser"></use>
                      </svg>
                      <span class="nds-assistive-text">Add User</span>
                    </button>
                  </li>
                  <li>
                    <button class="nds-button nds-button_icon nds-button_icon-container" title="Attach a file">
                      <svg class="nds-button__icon" aria-hidden="true">
                        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#attach"></use>
                      </svg>
                      <span class="nds-assistive-text">Attach a file</span>
                    </button>
                  </li>
                </ul>
                <button class="nds-button nds-button_brand">Comment</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </li>
  </ul>
</div>`);
  })
  .add('Post With Publisher Active (examples)', () => {
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
            Here's the latest demo presentation



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
            <li class="nds-item">
              8

              comments

            </li>
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
        <div class="nds-media nds-comment nds-hint-parent">
          <div class="nds-media__figure">
            <a class="nds-avatar nds-avatar_circle nds-avatar_medium" href="javascript:void(0);">
              <img alt="Person name" src="/assets/images/avatar2.jpg" title="User avatar">
            </a>
          </div>
          <div class="nds-media__body">
            <div class="nds-publisher nds-publisher_comment nds-is-active nds-has-focus">
              <label for="comment-text-input-01" class="nds-assistive-text">Write a comment</label>
              <textarea id="comment-text-input-01" class="nds-publisher__input nds-input_bare nds-text-longform" placeholder="Write a comment…"></textarea>
              <div class="nds-publisher__actions nds-grid nds-grid_align-spread">
                <ul class="nds-grid">
                  <li>
                    <button class="nds-button nds-button_icon nds-button_icon-container" title="Add User">
                      <svg class="nds-button__icon" aria-hidden="true">
                        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#adduser"></use>
                      </svg>
                      <span class="nds-assistive-text">Add User</span>
                    </button>
                  </li>
                  <li>
                    <button class="nds-button nds-button_icon nds-button_icon-container" title="Attach a file">
                      <svg class="nds-button__icon" aria-hidden="true">
                        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#attach"></use>
                      </svg>
                      <span class="nds-assistive-text">Attach a file</span>
                    </button>
                  </li>
                </ul>
                <button class="nds-button nds-button_brand">Comment</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </li>
  </ul>
</div>`);
  })
  .add('Questions (examples)', () => {
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
          <h3 class="nds-text-heading_small">Barbecue Party Tips For A Truly Amazing Event?</h3>
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
