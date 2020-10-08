import { storiesOf } from '@storybook/html';
import base from 'paths.macro';
import {
  withExample,
  withDocs,
  commentToHTML
} from '../../../scripts/storybook';
import scss from './base/_index.scss';
import notes from './doc.md';

storiesOf(`${base}`, module)
.addDecorator(commentToHTML(scss))
.addDecorator(withDocs(notes))
.add('Default', () => {
  return withExample(`<div class="nds-p-around_x-small nds-action">
  <ul>
  <li class="nds-item nds-action_inline">
  <a role="menuitem"
  tabindex="0"
  class="nds-action_item nds-p-horizontal_small">
  <div class="nds-action_icon nds-m-around_small">
  <svg aria-hidden="true"
  class="nds-icon nds-m-around_xxx-small slds-m-right_small nds-icon-text-default nds-icon_small"
  style="fill: rgb(5, 166, 223);">
  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#display_text">
  </use>
  </svg>
  <span class="nds-assistive-text">My Action</span>
  </div>
  <span class="nds-action_text">My Action</span>
  </a>
  </li>
  </ul>
  </div>`);
});
