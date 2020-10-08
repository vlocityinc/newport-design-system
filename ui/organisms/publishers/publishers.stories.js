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
    return withExample(`<div class="nds-publisher">
  <label for="comment-text-input2" class="nds-publisher__toggle-visibility nds-m-bottom_small">
    <span class="nds-assistive-text">Write a comment</span>
    To: My followers
  </label>
  <textarea id="comment-text-input2" class="nds-publisher__input nds-textarea nds-text-longform" placeholder="Write a comment…"></textarea>
  <div class="nds-publisher__actions nds-grid nds-grid_align-spread">
    <ul class="nds-grid nds-publisher__toggle-visibility">
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
    <button class="nds-button nds-button_brand">Share</button>
  </div>
</div>`);
  });
