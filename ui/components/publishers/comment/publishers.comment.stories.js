import { storiesOf } from '@storybook/html';
import base from 'paths.macro';
import notes from '../doc.md';
import scss from './_index.scss';
import {
  withExample,
  withDocs,
  commentToHTML
} from '../../../../scripts/storybook';

storiesOf(`${base}`, module)
  .addDecorator(withDocs(notes))
  .addDecorator(commentToHTML(scss))
  .add('Default (default)', () => {
    return withExample(`<div class="nds-media nds-comment nds-hint-parent">
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
</div>`);
  });
