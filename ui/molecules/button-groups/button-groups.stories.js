import { storiesOf } from '@storybook/html';
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
    return withExample(`<div class="nds-button-group" role="group">
      <button class="nds-button nds-button_neutral">Refresh</button>
      <button class="nds-button nds-button_neutral">Edit</button>
      <button class="nds-button nds-button_neutral">Save</button>
    </div>`);
  })
  .add('Disabled', () => {
    return withExample(`<div class="nds-button-group" role="group">
    <button class="nds-button nds-button_neutral">Refresh</button>
    <button class="nds-button nds-button_neutral">Edit</button>
    <button class="nds-button nds-button_neutral" disabled="">Save</button>
  </div>`);
  })
  .add('Using HTML List', () => {
    return withExample(`<ul class="nds-button-group-list">
    <li>
      <button class="nds-button nds-button_neutral">Refresh</button>
    </li>
    <li>
      <button class="nds-button nds-button_neutral">Edit</button>
    </li>
    <li>
      <button class="nds-button nds-button_neutral">Save</button>
    </li>
  </ul>`);
  })
  .add('Overflow', () => {
    return withExample(`<div class="nds-button-group" role="group">
    <button class="nds-button nds-button_neutral">Refresh</button>
    <button class="nds-button nds-button_neutral">Edit</button>
    <button class="nds-button nds-button_neutral">Save</button>
    <div class="nds-dropdown-trigger nds-dropdown-trigger_click nds-button_last">
      <button class="nds-button nds-button_icon nds-button_icon-border-filled" aria-haspopup="true" title="Show More">
        <svg class="nds-button__icon" aria-hidden="true">
          <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
        </svg>
        <span class="nds-assistive-text">Show More</span>
      </button>
    </div>
  </div>`);
  })
  .add('Overflow (open dropdown)', () => {
    return withExample(`<div class="demo-only" style="height: 8.75rem;">
    <div class="nds-button-group" role="group">
      <button class="nds-button nds-button_neutral">Refresh</button>
      <button class="nds-button nds-button_neutral">Edit</button>
      <button class="nds-button nds-button_neutral">Save</button>
      <div class="nds-dropdown-trigger nds-dropdown-trigger_click nds-button_last nds-is-open">
        <button class="nds-button nds-button_icon nds-button_icon-border-filled" aria-haspopup="true" title="Show More">
          <svg class="nds-button__icon" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
          </svg>
          <span class="nds-assistive-text">Show More</span>
        </button>
        <div class="nds-dropdown nds-dropdown_right">
          <ul class="nds-dropdown__list" role="menu">
            <li class="nds-dropdown__item" role="presentation">
              <a href="javascript:void(0);" role="menuitem" tabindex="0">
                <span class="nds-truncate" title="Overflow Item One">
                  Overflow Item One
                </span>
              </a>
            </li>
            <li class="nds-dropdown__item" role="presentation">
              <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                <span class="nds-truncate" title="Overflow Item Two">
                  Overflow Item Two
                </span>
              </a>
            </li>
            <li class="nds-dropdown__item" role="presentation">
              <a href="javascript:void(0);" role="menuitem" tabindex="-1">
                <span class="nds-truncate" title="Overflow Item Three">
                  Overflow Item Three
                </span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>`);
  })
  .add('Overflow disabled', () => {
    return withExample(`<div class="nds-button-group" role="group">
    <button class="nds-button nds-button_neutral">Refresh</button>
    <button class="nds-button nds-button_neutral">Edit</button>
    <button class="nds-button nds-button_neutral">Save</button>
    <div class="nds-dropdown-trigger nds-dropdown-trigger_click nds-button_last">
      <button class="nds-button nds-button_icon nds-button_icon-border-filled" disabled="" aria-haspopup="true" title="More Actions">
        <svg class="nds-button__icon" aria-hidden="true">
          <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
        </svg>
        <span class="nds-assistive-text">More Actions</span>
      </button>
    </div>
  </div>`);
  });
