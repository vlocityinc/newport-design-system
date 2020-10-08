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
    return withExample(`<div class="demo-only" style="width: 320px;">
  <nav class="nds-nav-vertical" aria-label="Sub page">
    <div class="nds-nav-vertical__section">
      <h2 id="entity-header" class="nds-nav-vertical__title nds-text-title_caps">Reports</h2>
      <ul>
        <li class="nds-nav-vertical__item nds-is-active">
          <a href="javascript:void(0);" class="nds-nav-vertical__action" aria-describedby="entity-header" aria-current="page">Recent</a>
        </li>
        <li class="nds-nav-vertical__item">
          <a href="javascript:void(0);" class="nds-nav-vertical__action" aria-describedby="entity-header">Created by Me</a>
        </li>
        <li class="nds-nav-vertical__item">
          <a href="javascript:void(0);" class="nds-nav-vertical__action" aria-describedby="entity-header">Private Reports</a>
        </li>
        <li class="nds-nav-vertical__item">
          <a href="javascript:void(0);" class="nds-nav-vertical__action" aria-describedby="entity-header">Public Reports</a>
        </li>
        <li class="nds-nav-vertical__item">
          <a href="javascript:void(0);" class="nds-nav-vertical__action" aria-describedby="entity-header">All Reports</a>
        </li>
      </ul>
    </div>
    <div class="nds-nav-vertical__section">
      <h2 id="folder-header" class="nds-nav-vertical__title nds-text-title_caps">Folders</h2>
      <ul>
        <li class="nds-nav-vertical__item">
          <a href="javascript:void(0);" class="nds-nav-vertical__action" aria-describedby="folder-header">Created by Me</a>
        </li>
        <li class="nds-nav-vertical__item">
          <a href="javascript:void(0);" class="nds-nav-vertical__action" aria-describedby="folder-header">Shared with Me</a>
        </li>
        <li class="nds-nav-vertical__item">
          <a href="javascript:void(0);" class="nds-nav-vertical__action" aria-describedby="folder-header">All Reports</a>
        </li>
      </ul>
    </div>
  </nav>
</div>`);
  })
  .add('Collapsed (states)', () => {
    return withExample(`<div class="demo-only" style="width: 320px;">
  <nav class="nds-nav-vertical" aria-label="Sub page">
    <div class="nds-nav-vertical__section">
      <h2 id="entity-header" class="nds-nav-vertical__title nds-text-title_caps">Reports</h2>
      <ul>
        <li class="nds-nav-vertical__item nds-is-active">
          <a href="javascript:void(0);" class="nds-nav-vertical__action" aria-describedby="entity-header" aria-current="page">Recent</a>
        </li>
        <li class="nds-nav-vertical__item">
          <a href="javascript:void(0);" class="nds-nav-vertical__action" aria-describedby="entity-header">Created by Me</a>
        </li>
        <li class="nds-nav-vertical__item">
          <a href="javascript:void(0);" class="nds-nav-vertical__action" aria-describedby="entity-header">Private Reports</a>
        </li>
        <li class="nds-nav-vertical__item">
          <a href="javascript:void(0);" class="nds-nav-vertical__action" aria-describedby="entity-header">Public Reports</a>
        </li>
        <li class="nds-nav-vertical__item">
          <a href="javascript:void(0);" class="nds-nav-vertical__action" aria-describedby="entity-header">All Reports</a>
        </li>
      </ul>
    </div>
    <div class="nds-nav-vertical__section">
      <h2 id="folder-header" class="nds-nav-vertical__title nds-text-title_caps">Folders</h2>
      <ul>
        <li class="nds-nav-vertical__item">
          <a href="javascript:void(0);" class="nds-nav-vertical__action" aria-describedby="folder-header">Created by Me</a>
        </li>
        <li class="nds-nav-vertical__item">
          <a href="javascript:void(0);" class="nds-nav-vertical__action" aria-describedby="folder-header">Shared with Me</a>
        </li>
      </ul>
    </div>
    <div class="nds-nav-vertical__overflow">
      <button class="nds-button nds-button_reset nds-nav-vertical__action nds-nav-vertical__action_overflow" aria-controls="search-results" aria-expanded="false">
        <svg class="nds-button__icon nds-button__icon_left" aria-hidden="true">
          <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevronright"></use>
        </svg>
        <span class="nds-nav-vertical__action-text">
          <!-- react-text: 29 -->Show More
          <!-- /react-text -->
          <span class="nds-assistive-text">Folders</span>
        </span>
      </button>
      <div id="search-results" class="nds-hide">
        <ul>
          <li class="nds-nav-vertical__item">
            <a href="javascript:void(0);" class="nds-nav-vertical__action" aria-describedby="folder-header">Overflow Item One</a>
          </li>
          <li class="nds-nav-vertical__item">
            <a href="javascript:void(0);" class="nds-nav-vertical__action" aria-describedby="folder-header">Overflow Item Two</a>
          </li>
          <li class="nds-nav-vertical__item">
            <a href="javascript:void(0);" class="nds-nav-vertical__action" aria-describedby="folder-header">Overflow Item Three</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</div>`);
  })
  .add('Expanded (states)', () => {
    return withExample(`<div class="demo-only" style="width: 320px;">
  <nav class="nds-nav-vertical" aria-label="Sub page">
    <div class="nds-nav-vertical__section">
      <h2 id="entity-header" class="nds-nav-vertical__title nds-text-title_caps">Reports</h2>
      <ul>
        <li class="nds-nav-vertical__item nds-is-active">
          <a href="javascript:void(0);" class="nds-nav-vertical__action" aria-describedby="entity-header" aria-current="page">Recent</a>
        </li>
        <li class="nds-nav-vertical__item">
          <a href="javascript:void(0);" class="nds-nav-vertical__action" aria-describedby="entity-header">Created by Me</a>
        </li>
        <li class="nds-nav-vertical__item">
          <a href="javascript:void(0);" class="nds-nav-vertical__action" aria-describedby="entity-header">Private Reports</a>
        </li>
        <li class="nds-nav-vertical__item">
          <a href="javascript:void(0);" class="nds-nav-vertical__action" aria-describedby="entity-header">Public Reports</a>
        </li>
        <li class="nds-nav-vertical__item">
          <a href="javascript:void(0);" class="nds-nav-vertical__action" aria-describedby="entity-header">All Reports</a>
        </li>
      </ul>
    </div>
    <div class="nds-nav-vertical__section">
      <h2 id="folder-header" class="nds-nav-vertical__title nds-text-title_caps">Folders</h2>
      <ul>
        <li class="nds-nav-vertical__item">
          <a href="javascript:void(0);" class="nds-nav-vertical__action" aria-describedby="folder-header">Created by Me</a>
        </li>
        <li class="nds-nav-vertical__item">
          <a href="javascript:void(0);" class="nds-nav-vertical__action" aria-describedby="folder-header">Shared with Me</a>
        </li>
      </ul>
    </div>
    <div class="nds-nav-vertical__overflow">
      <button class="nds-button nds-button_reset nds-nav-vertical__action nds-nav-vertical__action_overflow" aria-controls="search-results" aria-expanded="true">
        <svg class="nds-button__icon nds-button__icon_left" aria-hidden="true">
          <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevronright"></use>
        </svg>
        <span class="nds-nav-vertical__action-text">
          <!-- react-text: 29 -->Show Less
          <!-- /react-text -->
          <span class="nds-assistive-text">Folders</span>
        </span>
      </button>
      <div id="search-results" class="nds-show">
        <ul>
          <li class="nds-nav-vertical__item">
            <a href="javascript:void(0);" class="nds-nav-vertical__action" aria-describedby="folder-header">Overflow Item One</a>
          </li>
          <li class="nds-nav-vertical__item">
            <a href="javascript:void(0);" class="nds-nav-vertical__action" aria-describedby="folder-header">Overflow Item Two</a>
          </li>
          <li class="nds-nav-vertical__item">
            <a href="javascript:void(0);" class="nds-nav-vertical__action" aria-describedby="folder-header">Overflow Item Three</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</div>`);
  })
  .add('Compact (examples)', () => {
    return withExample(`<div class="demo-only" style="width: 320px;">
  <nav class="nds-nav-vertical nds-nav-vertical_compact" aria-label="Sub page">
    <div class="nds-nav-vertical__section">
      <h2 id="entity-header" class="nds-nav-vertical__title nds-text-title_caps">Reports</h2>
      <ul>
        <li class="nds-nav-vertical__item nds-is-active">
          <a href="javascript:void(0);" class="nds-nav-vertical__action" aria-describedby="entity-header" aria-current="page">Recent</a>
        </li>
        <li class="nds-nav-vertical__item">
          <a href="javascript:void(0);" class="nds-nav-vertical__action" aria-describedby="entity-header">Created by Me</a>
        </li>
        <li class="nds-nav-vertical__item">
          <a href="javascript:void(0);" class="nds-nav-vertical__action" aria-describedby="entity-header">Private Reports</a>
        </li>
        <li class="nds-nav-vertical__item">
          <a href="javascript:void(0);" class="nds-nav-vertical__action" aria-describedby="entity-header">Public Reports</a>
        </li>
        <li class="nds-nav-vertical__item">
          <a href="javascript:void(0);" class="nds-nav-vertical__action" aria-describedby="entity-header">All Reports</a>
        </li>
      </ul>
    </div>
    <div class="nds-nav-vertical__section">
      <h2 id="folder-header" class="nds-nav-vertical__title nds-text-title_caps">Folders</h2>
      <ul>
        <li class="nds-nav-vertical__item">
          <a href="javascript:void(0);" class="nds-nav-vertical__action" aria-describedby="folder-header">Created by Me</a>
        </li>
        <li class="nds-nav-vertical__item">
          <a href="javascript:void(0);" class="nds-nav-vertical__action" aria-describedby="folder-header">Shared with Me</a>
        </li>
        <li class="nds-nav-vertical__item">
          <a href="javascript:void(0);" class="nds-nav-vertical__action" aria-describedby="folder-header">All Reports</a>
        </li>
      </ul>
    </div>
  </nav>
</div>`);
  })
  .add('Items With Icons (examples)', () => {
    return withExample(`<div class="demo-only" style="width: 320px;">
  <nav class="nds-nav-vertical" aria-label="Sub page">
    <div class="nds-nav-vertical__section">
      <h2 id="entity-header" class="nds-nav-vertical__title nds-text-title_caps">Reports</h2>
      <ul>
        <li class="nds-nav-vertical__item nds-is-active">
          <a href="javascript:void(0);" class="nds-nav-vertical__action" aria-describedby="entity-header" aria-current="page">Recent</a>
        </li>
        <li class="nds-nav-vertical__item">
          <a href="javascript:void(0);" class="nds-nav-vertical__action" aria-describedby="entity-header">Created by Me</a>
        </li>
        <li class="nds-nav-vertical__item">
          <a href="javascript:void(0);" class="nds-nav-vertical__action" aria-describedby="entity-header">Private Reports</a>
        </li>
        <li class="nds-nav-vertical__item">
          <a href="javascript:void(0);" class="nds-nav-vertical__action" aria-describedby="entity-header">Public Reports</a>
        </li>
        <li class="nds-nav-vertical__item">
          <a href="javascript:void(0);" class="nds-nav-vertical__action" aria-describedby="entity-header">All Reports</a>
        </li>
      </ul>
    </div>
    <div class="nds-nav-vertical__section">
      <h2 id="folder-header" class="nds-nav-vertical__title nds-text-title_caps">Folders</h2>
      <ul>
        <li class="nds-nav-vertical__item">
          <a href="javascript:void(0);" class="nds-nav-vertical__action" aria-describedby="folder-header">
            <span class="nds-icon_container nds-icon-utility-open_folder nds-line-height_reset" title="Description of icon when needed">
              <svg class="nds-icon nds-icon-text-default nds-icon_x-small nds-m-right_x-small" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#open_folder"></use>
              </svg>
              <span class="nds-assistive-text">Folder</span>
            </span>
            <!-- react-text: 26 -->Created by Me
            <!-- /react-text -->
          </a>
        </li>
        <li class="nds-nav-vertical__item">
          <a href="javascript:void(0);" class="nds-nav-vertical__action" aria-describedby="folder-header">
            <span class="nds-icon_container nds-icon-utility-open_folder nds-line-height_reset" title="Description of icon when needed">
              <svg class="nds-icon nds-icon-text-default nds-icon_x-small nds-m-right_x-small" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#open_folder"></use>
              </svg>
              <span class="nds-assistive-text">Folder</span>
            </span>
            <!-- react-text: 33 -->Shared with Me
            <!-- /react-text -->
          </a>
        </li>
        <li class="nds-nav-vertical__item">
          <a href="javascript:void(0);" class="nds-nav-vertical__action" aria-describedby="folder-header">All Reports</a>
        </li>
      </ul>
    </div>
  </nav>
</div>`);
  })
  .add('Items With Notifications (examples)', () => {
    return withExample(`<div class="demo-only" style="width: 320px;">
  <nav class="nds-nav-vertical" aria-label="Sub page">
    <div class="nds-nav-vertical__section">
      <h2 id="entity-header" class="nds-nav-vertical__title nds-text-title_caps">Reports</h2>
      <ul>
        <li class="nds-nav-vertical__item nds-is-active">
          <a href="javascript:void(0);" class="nds-nav-vertical__action" aria-describedby="entity-header" aria-current="page">
            <!-- react-text: 9 -->Recent
            <!-- /react-text -->
            <span class="nds-badge nds-col_bump-left">
              <span class="nds-assistive-text">:</span>
              <!-- react-text: 12 -->3
              <!-- /react-text -->
              <span class="nds-assistive-text">New Items</span>
            </span>
          </a>
        </li>
        <li class="nds-nav-vertical__item">
          <a href="javascript:void(0);" class="nds-nav-vertical__action" aria-describedby="entity-header">Created by Me</a>
        </li>
        <li class="nds-nav-vertical__item">
          <a href="javascript:void(0);" class="nds-nav-vertical__action" aria-describedby="entity-header">Private Reports</a>
        </li>
        <li class="nds-nav-vertical__item">
          <a href="javascript:void(0);" class="nds-nav-vertical__action" aria-describedby="entity-header">Public Reports</a>
        </li>
        <li class="nds-nav-vertical__item">
          <a href="javascript:void(0);" class="nds-nav-vertical__action" aria-describedby="entity-header">All Reports</a>
        </li>
      </ul>
    </div>
    <div class="nds-nav-vertical__section">
      <h2 id="folder-header" class="nds-nav-vertical__title nds-text-title_caps">Folders</h2>
      <ul>
        <li class="nds-nav-vertical__item">
          <a href="javascript:void(0);" class="nds-nav-vertical__action" aria-describedby="folder-header">Created by Me</a>
        </li>
        <li class="nds-nav-vertical__item">
          <a href="javascript:void(0);" class="nds-nav-vertical__action" aria-describedby="folder-header">Shared with Me</a>
        </li>
        <li class="nds-nav-vertical__item">
          <a href="javascript:void(0);" class="nds-nav-vertical__action" aria-describedby="folder-header">All Reports</a>
        </li>
      </ul>
    </div>
  </nav>
</div>`);
  })
  .add('Shade (examples)', () => {
    return withExample(`<div class="demo-only" style="width: 320px; background-color: rgb(250, 250, 251);">
  <nav class="nds-nav-vertical nds-nav-vertical_shade" aria-label="Sub page">
    <div class="nds-nav-vertical__section">
      <h2 id="entity-header" class="nds-nav-vertical__title nds-text-title_caps">Reports</h2>
      <ul>
        <li class="nds-nav-vertical__item nds-is-active">
          <a href="javascript:void(0);" class="nds-nav-vertical__action" aria-describedby="entity-header" aria-current="page">Recent</a>
        </li>
        <li class="nds-nav-vertical__item">
          <a href="javascript:void(0);" class="nds-nav-vertical__action" aria-describedby="entity-header">Created by Me</a>
        </li>
        <li class="nds-nav-vertical__item">
          <a href="javascript:void(0);" class="nds-nav-vertical__action" aria-describedby="entity-header">Private Reports</a>
        </li>
        <li class="nds-nav-vertical__item">
          <a href="javascript:void(0);" class="nds-nav-vertical__action" aria-describedby="entity-header">Public Reports</a>
        </li>
        <li class="nds-nav-vertical__item">
          <a href="javascript:void(0);" class="nds-nav-vertical__action" aria-describedby="entity-header">All Reports</a>
        </li>
      </ul>
    </div>
    <div class="nds-nav-vertical__section">
      <h2 id="folder-header" class="nds-nav-vertical__title nds-text-title_caps">Folders</h2>
      <ul>
        <li class="nds-nav-vertical__item">
          <a href="javascript:void(0);" class="nds-nav-vertical__action" aria-describedby="folder-header">Created by Me</a>
        </li>
        <li class="nds-nav-vertical__item">
          <a href="javascript:void(0);" class="nds-nav-vertical__action" aria-describedby="folder-header">Shared with Me</a>
        </li>
        <li class="nds-nav-vertical__item">
          <a href="javascript:void(0);" class="nds-nav-vertical__action" aria-describedby="folder-header">All Reports</a>
        </li>
      </ul>
    </div>
  </nav>
</div>`);
  })
  .add('Quickfind (examples)', () => {
    return withExample(`<div class="demo-only" style="width: 320px;">
  <nav class="nds-nav-vertical" aria-label="Sub page">
    <div class="nds-form-element nds-p-horizontal_large">
      <label class="nds-form-element__label nds-assistive-text" for="input-id-01">
        <!-- react-text: 6 -->Filter navigation items
        <!-- /react-text -->
      </label>
      <div class="nds-form-element__control nds-input-has-icon nds-input-has-icon_left">
        <svg class="nds-icon nds-input__icon nds-input__icon_right nds-icon-text-default" aria-hidden="true">
          <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#search"></use>
        </svg>
        <input type="search" id="input-id-01" placeholder="Quick Find" class="nds-input">
      </div>
    </div>
    <div class="nds-nav-vertical__section">
      <h2 id="entity-header" class="nds-nav-vertical__title nds-text-title_caps">Reports</h2>
      <ul>
        <li class="nds-nav-vertical__item nds-is-active">
          <a href="javascript:void(0);" class="nds-nav-vertical__action" aria-describedby="entity-header" aria-current="page">Recent</a>
        </li>
        <li class="nds-nav-vertical__item">
          <a href="javascript:void(0);" class="nds-nav-vertical__action" aria-describedby="entity-header">Created by Me</a>
        </li>
        <li class="nds-nav-vertical__item">
          <a href="javascript:void(0);" class="nds-nav-vertical__action" aria-describedby="entity-header">Private Reports</a>
        </li>
        <li class="nds-nav-vertical__item">
          <a href="javascript:void(0);" class="nds-nav-vertical__action" aria-describedby="entity-header">Public Reports</a>
        </li>
        <li class="nds-nav-vertical__item">
          <a href="javascript:void(0);" class="nds-nav-vertical__action" aria-describedby="entity-header">All Reports</a>
        </li>
      </ul>
    </div>
    <div class="nds-nav-vertical__section">
      <h2 id="folder-header" class="nds-nav-vertical__title nds-text-title_caps">Folders</h2>
      <ul>
        <li class="nds-nav-vertical__item">
          <a href="javascript:void(0);" class="nds-nav-vertical__action" aria-describedby="folder-header">Created by Me</a>
        </li>
        <li class="nds-nav-vertical__item">
          <a href="javascript:void(0);" class="nds-nav-vertical__action" aria-describedby="folder-header">Shared with Me</a>
        </li>
      </ul>
    </div>
  </nav>
</div>`);
  });
