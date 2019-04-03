import { storiesOf } from '@storybook/html';
import base from 'paths.macro';
import notes from '../doc.md';
import panelNotes from './doc.md';
import scss from './_index.scss';
import {
  withExample,
  withDocs,
  commentToHTML
} from '../../../../scripts/storybook';

storiesOf(`${base}`, module)
  .addDecorator(withDocs(panelNotes + notes))
  .addDecorator(commentToHTML(scss))
  .add('Default (default)', () => {
    return withExample(`<section aria-labelledby="panel-heading-id" class="nds-popover nds-popover_panel nds-nubbin_left-top" role="dialog">
  <button class="nds-button nds-button_icon nds-button_icon nds-button_icon-small nds-float_right nds-popover__close" title="Close dialog">
    <svg class="nds-button__icon" aria-hidden="true">
      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
    </svg>
    <span class="nds-assistive-text">Close dialog</span>
  </button>
  <div class="nds-popover__header">
    <header class="nds-media nds-media_center nds-m-bottom_small">
      <span class="nds-icon_container nds-icon-standard-account nds-media__figure">
        <svg class="nds-icon nds-icon_small" aria-hidden="true">
          <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#account"></use>
        </svg>
      </span>
      <div class="nds-media__body">
        <h2 class="nds-text-heading_medium nds-hyphenate" id="panel-heading-id">
          <a href="javascript:void(0);">Tesla Motors</a>
        </h2>
      </div>
    </header>
    <footer class="nds-grid nds-wrap nds-grid_pull-padded">
      <div class="nds-p-horizontal_small nds-size_1-of-2 nds-p-bottom_x-small">
        <dl>
          <dt>
            <p class="nds-text-title_caps nds-truncate" title="Billing Address">Billing Address</p>
          </dt>
          <dd>
            <p class="nds-truncate" title="3500 Deer Creek Rd.">3500 Deer Creek Rd.</p>
            <p class="nds-truncate" title="Palo Alto, CA 94304">Palo Alto, CA 94304</p>
          </dd>
        </dl>
      </div>
      <div class="nds-p-horizontal_small nds-size_1-of-2 nds-p-bottom_x-small">
        <dl>
          <dt>
            <p class="nds-text-title_caps nds-truncate" title="Phone">Phone</p>
          </dt>
          <dd>
            <a href="javascript:void(0);">212-345-3485</a>
          </dd>
        </dl>
      </div>
      <div class="nds-p-horizontal_small nds-size_1-of-2 nds-p-bottom_x-small">
        <dl>
          <dt>
            <p class="nds-text-title_caps nds-truncate" title="Website">Website</p>
          </dt>
          <dd>
            <a href="javascript:void(0);">teslamotors.com</a>
          </dd>
        </dl>
      </div>
      <div class="nds-p-horizontal_small nds-size_1-of-2 nds-p-bottom_x-small">
        <dl>
          <dt>
            <p class="nds-text-title_caps nds-truncate" title="Account Owner">Account Owner</p>
          </dt>
          <dd>
            <a href="javascript:void(0);">Jeff Maguire</a>
          </dd>
        </dl>
      </div>
    </footer>
  </div>
  <div class="nds-popover__body">
    <dl class="nds-popover__body-list">
      <dt class="nds-m-bottom_small">
        <div class="nds-media nds-media_center">
          <div class="nds-media__figure">
            <span class="nds-icon_container nds-icon-standard-opportunity">
              <svg class="nds-icon nds-icon_small" aria-hidden="true">
                <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#opportunity"></use>
              </svg>
              <span class="nds-assistive-text">Opportunities</span>
            </span>
          </div>
          <div class="nds-media__body">
            <p class="nds-text-heading_small nds-hyphenate">Opportunities (2+)</p>
          </div>
        </div>
      </dt>
      <dd class="nds-m-top_x-small">
        <p class="nds-truncate" title="Tesla - Mule ESB">
          <a href="javascript:void(0);">Tesla - Mule ESB</a>
        </p>
        <dl class="nds-list_horizontal nds-wrap nds-text-body_small">
          <dt class="nds-item_label nds-text-color_weak nds-truncate" title="Value">Value</dt>
          <dd class="nds-item_detail nds-text-color_weak nds-truncate" title="$500,000">$500,000</dd>
          <dt class="nds-item_label nds-text-color_weak nds-truncate" title="Close Date">Close Date</dt>
          <dd class="nds-item_detail nds-text-color_weak nds-truncate" title="Dec 15, 2015">Dec 15, 2015</dd>
        </dl>
      </dd>
      <dd class="nds-m-top_x-small">
        <p class="nds-truncate" title="Tesla - Anypoint Studios">
          <a href="javascript:void(0);">Tesla - Anypoint Studios</a>
        </p>
        <dl class="nds-list_horizontal nds-wrap nds-text-body_small">
          <dt class="nds-item_label nds-text-color_weak nds-truncate" title="Value">Value</dt>
          <dd class="nds-item_detail nds-text-color_weak nds-truncate" title="$60,000">$60,000</dd>
          <dt class="nds-item_label nds-text-color_weak nds-truncate" title="Close Date">Close Date</dt>
          <dd class="nds-item_detail nds-text-color_weak nds-truncate" title="Jan 15, 2016">Jan 15, 2016</dd>
        </dl>
      </dd>
      <dd class="nds-m-top_x-small nds-text-align_right">
        <a href="javascript:void(0);" title="View all Opportunities">View All</a>
      </dd>
    </dl>
    <dl class="nds-popover__body-list">
      <dt class="nds-m-bottom_small">
        <div class="nds-media nds-media_center">
          <div class="nds-media__figure">
            <span class="nds-icon_container nds-icon-standard-case">
              <svg class="nds-icon nds-icon_small" aria-hidden="true">
                <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#case"></use>
              </svg>
              <span class="nds-assistive-text">Cases</span>
            </span>
          </div>
          <div class="nds-media__body">
            <p class="nds-text-heading_small nds-hyphenate">Cases (1)</p>
          </div>
        </div>
      </dt>
      <dd class="nds-m-top_x-small">
        <p class="nds-truncate" title="Tesla - Anypoint Studios">
          <a href="javascript:void(0);">Tesla - Anypoint Studios</a>
        </p>
        <dl class="nds-list_horizontal nds-wrap nds-text-body_small">
          <dt class="nds-item_label nds-text-color_weak nds-truncate" title="Value">Value</dt>
          <dd class="nds-item_detail nds-text-color_weak nds-truncate" title="$60,000">$60,000</dd>
          <dt class="nds-item_label nds-text-color_weak nds-truncate" title="Close Date">Close Date</dt>
          <dd class="nds-item_detail nds-text-color_weak nds-truncate" title="Jan 15, 2016">Jan 15, 2016</dd>
        </dl>
      </dd>
      <dd class="nds-m-top_x-small nds-text-align_right">
        <a href="javascript:void(0);" title="View all Opportunities">View All</a>
      </dd>
    </dl>
  </div>
</section>`);
  });
