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
    return withExample(`<div style="width: 20rem;">
  <div class="nds-file nds-file_card">
    <figure>
      <a href="javascript:void(0);" class="nds-file__crop">
        <img src="/assets/images/placeholder-img@16x9.jpg" alt="Description of the image">
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
            <span class="nds-file__text nds-truncate" title="Proposal.pdf">
              Proposal.pdf

            </span>
          </div>
        </div>
      </figcaption>
    </figure>
  </div>
</div>`);
  })
  .add('Attachment File No Image (examples)', () => {
    return withExample(`<div style="width: 20rem;">
  <div class="nds-file nds-file_card">
    <figure>
      <a href="javascript:void(0);" class="nds-file__crop">
        <span class="nds-file__icon nds-icon_container" title="image">
          <svg class="nds-icon" aria-hidden="true">
            <use xlink:href="/assets/icons/doctype-sprite/svg/symbols.svg#image"></use>
          </svg>
          <span class="nds-assistive-text">Image Title</span>
        </span>
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
</div>`);
  })
  .add('Attachment File No Title (examples)', () => {
    return withExample(`<div style="width: 20rem;">
  <div class="nds-file nds-file_card">
    <figure>
      <a href="javascript:void(0);" class="nds-file__crop">
        <img src="/assets/images/placeholder-img@16x9.jpg" alt="Description of the image">
      </a>
    </figure>
  </div>
</div>`);
  })
  .add('Attachment File With Actions (examples)', () => {
    return withExample(`<div style="width: 20rem;">
  <div class="nds-file nds-file_card">
    <figure>
      <a href="javascript:void(0);" class="nds-file__crop">
        <img src="/assets/images/placeholder-img@16x9.jpg" alt="Description of the image">
      </a>
      <figcaption class="nds-file__title nds-file__title_card nds-file-has-actions">
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
            <span class="nds-file__text nds-truncate" title="Proposal.pdf">
              Proposal.pdf

            </span>
          </div>
        </div>
      </figcaption>
    </figure>
    <div class="nds-file__actions-menu">
      <div class="nds-button-group" role="group">
        <button class="nds-button nds-button_icon nds-button_icon nds-button_icon-x-small" title="Download">
          <svg class="nds-button__icon" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#download"></use>
          </svg>
          <span class="nds-assistive-text">Download</span>
        </button>
        <button class="nds-button nds-button_icon nds-button_icon nds-button_icon-x-small" aria-haspopup="true" title="More Actions">
          <svg class="nds-button__icon" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
          </svg>
          <span class="nds-assistive-text">More Actions</span>
        </button>
      </div>
    </div>
  </div>
</div>`);
  })
  .add('Attachment File With No Title Actions (examples)', () => {
    return withExample(`<div style="width: 20rem;">
  <div class="nds-file nds-file_card">
    <figure>
      <a href="javascript:void(0);" class="nds-file__crop">
        <img src="/assets/images/placeholder-img@16x9.jpg" alt="Description of the image">
      </a>
    </figure>
    <div class="nds-file__title nds-file__title_scrim">
      <div class="nds-file__actions-menu">
        <div class="nds-button-group" role="group">
          <button class="nds-button nds-button_icon nds-button_icon nds-button_icon-x-small nds-button_icon-inverse" title="Download">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#download"></use>
            </svg>
            <span class="nds-assistive-text">Download</span>
          </button>
          <button class="nds-button nds-button_icon nds-button_icon nds-button_icon-x-small nds-button_icon-inverse" aria-haspopup="true" title="More Actions">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
            </svg>
            <span class="nds-assistive-text">More Actions</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</div>`);
  })
  .add('Attachment File External Icon (examples)', () => {
    return withExample(`<div style="width: 20rem;">
  <div class="nds-file nds-file_card">
    <figure>
      <a href="javascript:void(0);" class="nds-file__crop">
        <span class="nds-file__icon nds-icon_container" title="pdf">
          <svg class="nds-icon" aria-hidden="true">
            <use xlink:href="/assets/icons/doctype-sprite/svg/symbols.svg#pdf"></use>
          </svg>
          <span class="nds-assistive-text">Proposal.pdf</span>
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
            <span class="nds-file__text nds-truncate" title="Proposal.pdf">
              Proposal.pdf

            </span>
          </div>
        </div>
      </figcaption>
    </figure>
    <div class="nds-file__external-icon">
      <span class="nds-file__icon nds-icon_container" title="salesforce1">
        <svg class="nds-icon nds-icon-text-default" aria-hidden="true">
          <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#salesforce1"></use>
        </svg>
        <span class="nds-assistive-text">
          Data provided by:

          salesforce1

        </span>
      </span>
    </div>
  </div>
</div>`);
  })
  .add('Attachment File Loading No Title (examples)', () => {
    return withExample(`<div style="width: 20rem;">
  <div class="nds-file nds-file_card">
    <figure>
      <a href="javascript:void(0);" class="nds-file__crop">
        <span class="nds-file__icon nds-icon_container" title="image">
          <svg class="nds-icon nds-file__loading-icon nds-icon_large" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#image"></use>
          </svg>
          <span class="nds-assistive-text">Image Title</span>
        </span>
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
</div>`);
  })
  .add('Attachment File Loading (examples)', () => {
    return withExample(`<div style="width: 20rem;">
  <div class="nds-file nds-file_card nds-file_center-icon">
    <figure>
      <a href="javascript:void(0);" class="nds-file__crop">
        <span class="nds-file__icon nds-icon_container" title="image">
          <svg class="nds-icon nds-file__loading-icon nds-icon_large" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#image"></use>
          </svg>
          <span class="nds-assistive-text">Image Title</span>
        </span>
      </a>
    </figure>
  </div>
</div>`);
  })
  .add('Multi Attachments (examples)', () => {
    return withExample(`<ul class="nds-grid nds-grid_pull-padded">
  <li class="nds-p-horizontal_xx-small nds-size_1-of-2 nds-medium-size_1-of-3">
    <div class="nds-file nds-file_card">
      <figure>
        <a href="javascript:void(0);" class="nds-file__crop">
          <img src="/assets/images/placeholder-img@16x9.jpg" alt="Description of the image">
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
              <span class="nds-file__text nds-truncate" title="Proposal.pdf">
                Proposal.pdf

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
        <a href="javascript:void(0);" class="nds-file__crop">
          <span class="nds-file__icon nds-icon_container" title="pdf">
            <svg class="nds-icon" aria-hidden="true">
              <use xlink:href="/assets/icons/doctype-sprite/svg/symbols.svg#pdf"></use>
            </svg>
            <span class="nds-assistive-text">Proposal.pdf</span>
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
              <span class="nds-file__text nds-truncate" title="Proposal.pdf">
                Proposal.pdf

              </span>
            </div>
          </div>
        </figcaption>
      </figure>
    </div>
  </li>
</ul>`);
  })
  .add('Multi Attachments Overflow (examples)', () => {
    return withExample(`<ul class="nds-grid nds-grid_pull-padded">
  <li class="nds-p-horizontal_xx-small nds-size_1-of-2 nds-medium-size_1-of-3">
    <div class="nds-file nds-file_card">
      <figure>
        <a href="javascript:void(0);" class="nds-file__crop">
          <img src="/assets/images/placeholder-img@16x9.jpg" alt="Description of the image">
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
              <span class="nds-file__text nds-truncate" title="Proposal.pdf">
                Proposal.pdf

              </span>
            </div>
          </div>
        </figcaption>
      </figure>
    </div>
  </li>
  <li class="nds-p-horizontal_xx-small nds-size_1-of-2 nds-medium-size_1-of-3  nds-medium-show">
    <div class="nds-file nds-file_card">
      <figure>
        <a href="javascript:void(0);" class="nds-file__crop">
          <span class="nds-file__icon nds-icon_container" title="pdf">
            <svg class="nds-icon" aria-hidden="true">
              <use xlink:href="/assets/icons/doctype-sprite/svg/symbols.svg#pdf"></use>
            </svg>
            <span class="nds-assistive-text">Proposal.pdf</span>
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
              <span class="nds-file__text nds-truncate" title="Proposal.pdf">
                Proposal.pdf

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
        <a href="javascript:void(0);" class="nds-file__crop">
          <div class="nds-file_overlay"></div>
          <img src="/assets/images/placeholder-img@16x9.jpg" alt="Description of the image">
        </a>
        <figcaption class="nds-file__title nds-file__title_overlay nds-align_absolute-center nds-text-heading_large">
          <div class="nds-media nds-media_small nds-media_center">
            <div class="nds-media__figure nds-line-height_reset"></div>
            <div class="nds-media__body">
              <span class="nds-file__text nds-truncate" title="+22">
                +22

                <span class="nds-assistive-text">more files</span>
              </span>
            </div>
          </div>
        </figcaption>
      </figure>
    </div>
  </li>
</ul>`);
  })
  .add('Link Attachment (examples)', () => {
    return withExample(`<a href="javascript:void(0);" class="nds-media nds-box nds-grow nds-text-link_reset">
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
</a>`);
  });
