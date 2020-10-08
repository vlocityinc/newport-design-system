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
    return withExample(`<div class="demo-only" style="min-height: 180px;">
  <div class="nds-rich-text-editor nds-form-element nds-grid nds-grid_vertical nds-nowrap">
    <div role="toolbar" class="nds-rich-text-editor__toolbar nds-shrink-none">
      <ul aria-label="Format text" class="nds-button-group-list">
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="0" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#bold"></use>
            </svg>
            <span class="nds-assistive-text">Bold</span>
          </button>
        </li>
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#italic"></use>
            </svg>
            <span class="nds-assistive-text">Italic</span>
          </button>
        </li>
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#underline"></use>
            </svg>
            <span class="nds-assistive-text">Underline</span>
          </button>
        </li>
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#strikethrough"></use>
            </svg>
            <span class="nds-assistive-text">Strike Through</span>
          </button>
        </li>
      </ul>
      <ul aria-label="Format body" class="nds-button-group-list">
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#richtextbulletedlist"></use>
            </svg>
            <span class="nds-assistive-text">Bulleted List</span>
          </button>
        </li>
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#richtextnumberedlist"></use>
            </svg>
            <span class="nds-assistive-text">Numbered List</span>
          </button>
        </li>
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#richtextindent"></use>
            </svg>
            <span class="nds-assistive-text">Indent</span>
          </button>
        </li>
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#richtextoutdent"></use>
            </svg>
            <span class="nds-assistive-text">Outdent</span>
          </button>
        </li>
      </ul>
      <ul aria-label="Remove Formatting" class="nds-button-group-list">
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#remove_formatting"></use>
            </svg>
            <span class="nds-assistive-text">Remove Formatting</span>
          </button>
        </li>
      </ul>
    </div>
    <div class="nds-rich-text-editor__textarea nds-grid">
      <div aria-label="Compose text" class="nds-rich-text-area__content nds-text-color_weak nds-grow" contenteditable="true">Compose text...</div>
    </div>
  </div>
</div>`);
  })
  .add('Focused (states)', () => {
    return withExample(`<div class="demo-only" style="min-height: 180px;">
  <div class="nds-rich-text-editor nds-form-element nds-grid nds-grid_vertical nds-nowrap nds-has-focus">
    <div role="toolbar" class="nds-rich-text-editor__toolbar nds-shrink-none">
      <ul aria-label="Format text" class="nds-button-group-list">
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="0" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#bold"></use>
            </svg>
            <span class="nds-assistive-text">Bold</span>
          </button>
        </li>
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#italic"></use>
            </svg>
            <span class="nds-assistive-text">Italic</span>
          </button>
        </li>
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#underline"></use>
            </svg>
            <span class="nds-assistive-text">Underline</span>
          </button>
        </li>
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#strikethrough"></use>
            </svg>
            <span class="nds-assistive-text">Strike Through</span>
          </button>
        </li>
      </ul>
      <ul aria-label="Format body" class="nds-button-group-list">
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#richtextbulletedlist"></use>
            </svg>
            <span class="nds-assistive-text">Bulleted List</span>
          </button>
        </li>
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#richtextnumberedlist"></use>
            </svg>
            <span class="nds-assistive-text">Numbered List</span>
          </button>
        </li>
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#richtextindent"></use>
            </svg>
            <span class="nds-assistive-text">Indent</span>
          </button>
        </li>
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#richtextoutdent"></use>
            </svg>
            <span class="nds-assistive-text">Outdent</span>
          </button>
        </li>
      </ul>
      <ul aria-label="Remove Formatting" class="nds-button-group-list">
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#remove_formatting"></use>
            </svg>
            <span class="nds-assistive-text">Remove Formatting</span>
          </button>
        </li>
      </ul>
    </div>
    <div class="nds-rich-text-editor__textarea nds-grid">
      <div aria-label="Compose text" class="nds-rich-text-area__content nds-text-color_weak nds-grow" contenteditable="true">Compose text...</div>
    </div>
  </div>
</div>`);
  })
  .add('Filled Out (states)', () => {
    return withExample(`<div class="demo-only" style="min-height: 180px;">
  <div class="nds-rich-text-editor nds-form-element nds-grid nds-grid_vertical nds-nowrap">
    <div role="toolbar" class="nds-rich-text-editor__toolbar nds-shrink-none">
      <ul aria-label="Format text" class="nds-button-group-list">
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="0" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#bold"></use>
            </svg>
            <span class="nds-assistive-text">Bold</span>
          </button>
        </li>
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#italic"></use>
            </svg>
            <span class="nds-assistive-text">Italic</span>
          </button>
        </li>
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#underline"></use>
            </svg>
            <span class="nds-assistive-text">Underline</span>
          </button>
        </li>
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#strikethrough"></use>
            </svg>
            <span class="nds-assistive-text">Strike Through</span>
          </button>
        </li>
      </ul>
      <ul aria-label="Format body" class="nds-button-group-list">
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#richtextbulletedlist"></use>
            </svg>
            <span class="nds-assistive-text">Bulleted List</span>
          </button>
        </li>
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#richtextnumberedlist"></use>
            </svg>
            <span class="nds-assistive-text">Numbered List</span>
          </button>
        </li>
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#richtextindent"></use>
            </svg>
            <span class="nds-assistive-text">Indent</span>
          </button>
        </li>
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#richtextoutdent"></use>
            </svg>
            <span class="nds-assistive-text">Outdent</span>
          </button>
        </li>
      </ul>
      <ul aria-label="Remove Formatting" class="nds-button-group-list">
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#remove_formatting"></use>
            </svg>
            <span class="nds-assistive-text">Remove Formatting</span>
          </button>
        </li>
      </ul>
    </div>
    <div class="nds-rich-text-editor__textarea nds-grid">
      <div aria-label="Compose text" class="nds-rich-text-area__content nds-grow" contenteditable="true">
        <div>
          <h1>Heading - h1</h1>
          <p>
            Lorem ipsum dolor sit amet,

            <strong>strong</strong>
            adipisicing elit, sed do

            <em>emphasis</em>
            tempor incididunt ut

            <u>underlined</u>
            et dolore



            <strike>strikethrough</strike>
            aliqua. Ut

            <sub>subscript</sub>
            ad



            <sup>superscript</sup>
            veniam,

            <abbr>quis</abbr>
            nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in

            <a href="#">link</a>
            in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

          </p>
          <h2>Heading - h2</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          <ul>
            <li>Unordered list item</li>
            <li>Unordered list item</li>
            <li>Unordered list item</li>
          </ul>
          <h3>Heading - h3</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          <ol>
            <li>Ordered list item</li>
            <li>Ordered list item</li>
            <li>Ordered list item</li>
          </ol>
          <h4>Heading - h4</h4>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          <dl>
            <dt>Description List - Term</dt>
            <dd>Description List - Description</dd>
            <dt>Description List - Term</dt>
            <dd>Description List - Description</dd>
          </dl>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          <table>
            <thead>
              <tr>
                <th>Column</th>
                <th>Column</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Row</td>
                <td>Row</td>
              </tr>
              <tr>
                <td>Row</td>
                <td>Row</td>
              </tr>
            </tbody>
          </table>
          <h5>Heading - h5</h5>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
            irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          <blockquote>Blockquote - incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation</blockquote>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
            irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          <h6>Heading - h6</h6>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,



            <a href="#">https://url.com/document/d/1dSOGKlCQtSG73NcSJB7qCJVyjE52MdTjvjGNqc3L2Rw/edE52MdTjvjGNqc3L2Rw/edE52MdTjvjGNqc3L2Rw/edE52MdTjvjGNqc3L2Rw/edE52MdTjvjGNqc3L2Rw/edE52MdTjvjGNqc3L2Rw/edE52MdTjvjGNqc3L2Rw/edE52MdTjvjGNqc3L2Rw/edE52MdTjvjGNqc3L2Rw/edE52MdTjvjGNqc3L2Rw/edE52MdTjvjGNqc3L2Rw/edE52MdTjvjGNqc3L2Rw/edE52MdTjvjGNqc3L2Rw/edE52MdTjvjGNqc3L2Rw/ed</a>


            quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

          </p>
        </div>
      </div>
    </div>
  </div>
</div>`);
  })
  .add('Error (states)', () => {
    return withExample(`<div class="demo-only" style="min-height: 180px;">
  <div class="nds-rich-text-editor nds-form-element nds-grid nds-grid_vertical nds-nowrap nds-has-error">
    <div role="toolbar" class="nds-rich-text-editor__toolbar nds-shrink-none">
      <ul aria-label="Format text" class="nds-button-group-list">
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="0" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#bold"></use>
            </svg>
            <span class="nds-assistive-text">Bold</span>
          </button>
        </li>
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#italic"></use>
            </svg>
            <span class="nds-assistive-text">Italic</span>
          </button>
        </li>
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#underline"></use>
            </svg>
            <span class="nds-assistive-text">Underline</span>
          </button>
        </li>
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#strikethrough"></use>
            </svg>
            <span class="nds-assistive-text">Strike Through</span>
          </button>
        </li>
      </ul>
      <ul aria-label="Format body" class="nds-button-group-list">
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#richtextbulletedlist"></use>
            </svg>
            <span class="nds-assistive-text">Bulleted List</span>
          </button>
        </li>
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#richtextnumberedlist"></use>
            </svg>
            <span class="nds-assistive-text">Numbered List</span>
          </button>
        </li>
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#richtextindent"></use>
            </svg>
            <span class="nds-assistive-text">Indent</span>
          </button>
        </li>
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#richtextoutdent"></use>
            </svg>
            <span class="nds-assistive-text">Outdent</span>
          </button>
        </li>
      </ul>
      <ul aria-label="Remove Formatting" class="nds-button-group-list">
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#remove_formatting"></use>
            </svg>
            <span class="nds-assistive-text">Remove Formatting</span>
          </button>
        </li>
      </ul>
    </div>
    <div class="nds-rich-text-editor__textarea nds-grid">
      <div aria-describedby="rte-error-01" aria-label="Compose text" class="nds-rich-text-area__content nds-text-color_weak nds-grow" contenteditable="true">Compose text...</div>
    </div>
    <div id="rte-error-01" class="nds-form-element__help nds-p-around_small">This field is required</div>
  </div>
</div>`);
  })
  .add('Disabled (states)', () => {
    return withExample(`<div class="demo-only" style="min-height: 180px;">
  <div class="nds-rich-text-editor nds-form-element nds-grid nds-grid_vertical nds-nowrap">
    <div role="toolbar" aria-label="disabled" class="nds-rich-text-editor__toolbar nds-shrink-none">
      <ul aria-label="Format text" class="nds-button-group-list">
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" disabled="" tabindex="0" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#bold"></use>
            </svg>
            <span class="nds-assistive-text">Bold</span>
          </button>
        </li>
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" disabled="" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#italic"></use>
            </svg>
            <span class="nds-assistive-text">Italic</span>
          </button>
        </li>
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" disabled="" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#underline"></use>
            </svg>
            <span class="nds-assistive-text">Underline</span>
          </button>
        </li>
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" disabled="" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#strikethrough"></use>
            </svg>
            <span class="nds-assistive-text">Strike Through</span>
          </button>
        </li>
      </ul>
      <ul aria-label="Format body" class="nds-button-group-list">
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" disabled="" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#richtextbulletedlist"></use>
            </svg>
            <span class="nds-assistive-text">Bulleted List</span>
          </button>
        </li>
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" disabled="" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#richtextnumberedlist"></use>
            </svg>
            <span class="nds-assistive-text">Numbered List</span>
          </button>
        </li>
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" disabled="" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#richtextindent"></use>
            </svg>
            <span class="nds-assistive-text">Indent</span>
          </button>
        </li>
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" disabled="" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#richtextoutdent"></use>
            </svg>
            <span class="nds-assistive-text">Outdent</span>
          </button>
        </li>
      </ul>
      <ul aria-label="Remove Formatting" class="nds-button-group-list">
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" disabled="" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#remove_formatting"></use>
            </svg>
            <span class="nds-assistive-text">Remove Formatting</span>
          </button>
        </li>
      </ul>
    </div>
    <div class="nds-rich-text-editor__textarea nds-grid">
      <div aria-label="Compose text" class="nds-rich-text-area__content nds-text-color_weak nds-grow">Compose text...</div>
    </div>
  </div>
</div>`);
  })
  .add('Tooltip (states)', () => {
    return withExample(`<div class="demo-only" style="min-height: 180px;">
  <div class="nds-rich-text-editor nds-form-element nds-grid nds-grid_vertical nds-nowrap">
    <div role="toolbar" class="nds-rich-text-editor__toolbar nds-shrink-none">
      <ul aria-label="Format text" class="nds-button-group-list">
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" aria-describedby="bold" tabindex="0" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#bold"></use>
            </svg>
            <span class="nds-assistive-text">Bold</span>
          </button>
        </li>
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#italic"></use>
            </svg>
            <span class="nds-assistive-text">Italic</span>
          </button>
        </li>
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#underline"></use>
            </svg>
            <span class="nds-assistive-text">Underline</span>
          </button>
        </li>
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#strikethrough"></use>
            </svg>
            <span class="nds-assistive-text">Strike Through</span>
          </button>
        </li>
      </ul>
      <ul aria-label="Format body" class="nds-button-group-list">
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#richtextbulletedlist"></use>
            </svg>
            <span class="nds-assistive-text">Bulleted List</span>
          </button>
        </li>
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#richtextnumberedlist"></use>
            </svg>
            <span class="nds-assistive-text">Numbered List</span>
          </button>
        </li>
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#richtextindent"></use>
            </svg>
            <span class="nds-assistive-text">Indent</span>
          </button>
        </li>
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#richtextoutdent"></use>
            </svg>
            <span class="nds-assistive-text">Outdent</span>
          </button>
        </li>
      </ul>
      <ul aria-label="Remove Formatting" class="nds-button-group-list">
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#remove_formatting"></use>
            </svg>
            <span class="nds-assistive-text">Remove Formatting</span>
          </button>
        </li>
      </ul>
    </div>
    <div class="nds-rich-text-editor__textarea nds-grid">
      <div aria-label="Compose text" class="nds-rich-text-area__content nds-text-color_weak nds-grow" contenteditable="true">Compose text...</div>
    </div>
    <div class="nds-popover nds-popover_tooltip nds-nubbin_top-left" role="tooltip" id="bold" style="position: absolute; top: 48px; left: 2px;">
      <div class="nds-popover__body">
        Bold

        <kbd>cmd+b</kbd>
      </div>
    </div>
  </div>
</div>`);
  })
  .add('Bottom Toolbar (examples)', () => {
    return withExample(`<div class="demo-only" style="min-height: 180px;">
  <div class="nds-rich-text-editor nds-form-element nds-grid nds-grid_vertical nds-nowrap">
    <div class="nds-rich-text-editor__textarea nds-grid">
      <div aria-label="Compose text" class="nds-rich-text-area__content nds-text-color_weak nds-grow" contenteditable="true">Compose text...</div>
    </div>
    <div role="toolbar" class="nds-rich-text-editor__toolbar nds-shrink-none nds-rich-text-editor__toolbar_bottom">
      <ul aria-label="Format text" class="nds-button-group-list">
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="0" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#bold"></use>
            </svg>
            <span class="nds-assistive-text">Bold</span>
          </button>
        </li>
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#italic"></use>
            </svg>
            <span class="nds-assistive-text">Italic</span>
          </button>
        </li>
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#underline"></use>
            </svg>
            <span class="nds-assistive-text">Underline</span>
          </button>
        </li>
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#strikethrough"></use>
            </svg>
            <span class="nds-assistive-text">Strike Through</span>
          </button>
        </li>
      </ul>
      <ul aria-label="Format body" class="nds-button-group-list">
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#richtextbulletedlist"></use>
            </svg>
            <span class="nds-assistive-text">Bulleted List</span>
          </button>
        </li>
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#richtextnumberedlist"></use>
            </svg>
            <span class="nds-assistive-text">Numbered List</span>
          </button>
        </li>
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#richtextindent"></use>
            </svg>
            <span class="nds-assistive-text">Indent</span>
          </button>
        </li>
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#richtextoutdent"></use>
            </svg>
            <span class="nds-assistive-text">Outdent</span>
          </button>
        </li>
      </ul>
      <ul aria-label="Remove Formatting" class="nds-button-group-list">
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#remove_formatting"></use>
            </svg>
            <span class="nds-assistive-text">Remove Formatting</span>
          </button>
        </li>
      </ul>
    </div>
  </div>
</div>`);
  })
  .add('Email (examples)', () => {
    return withExample(`<div class="demo-only" style="min-height: 180px;">
  <div class="nds-rich-text-editor nds-form-element nds-grid nds-grid_vertical nds-nowrap">
    <div role="toolbar" class="nds-rich-text-editor__toolbar nds-shrink-none">
      <div class="nds-grid" role="group" aria-label="Format font family &amp; size">
        <div class="nds-rich-text-editor__select">
          <div class="nds-form-element">
            <label class="nds-form-element__label nds-assistive-text" for="font-family">Choose a Font</label>
            <div class="nds-form-element__control">
              <div class="nds-combobox_container">
                <div class="nds-combobox nds-dropdown-trigger nds-dropdown-trigger_click nds-size_x-small" aria-expanded="false" aria-haspopup="listbox" role="combobox">
                  <div class="nds-combobox__form-element nds-input-has-icon nds-input-has-icon_right" role="none">
                    <input type="text" class="nds-input nds-combobox__input" id="font-family" aria-controls="family-listbox" autocomplete="off" role="textbox" placeholder="Select an Option" readonly="" value="Font">
                    <span class="nds-icon_container nds-icon-utility-down nds-input__icon nds-input__icon_right" title="Description of icon when needed">
                      <svg class="nds-icon nds-icon nds-icon_x-small nds-icon-text-default" aria-hidden="true">
                        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
                      </svg>
                      <span class="nds-assistive-text">Description of icon</span>
                    </span>
                  </div>
                  <div id="listbox-unique-id" role="listbox">
                    <ul class="nds-listbox nds-listbox_vertical nds-dropdown nds-dropdown_fluid" role="presentation">
                      <li role="presentation" class="nds-listbox__item">
                        <span id="listbox-option-unique-id-01" class="nds-media nds-listbox__option nds-listbox__option_plain nds-media_small nds-media_center" role="option">
                          <span class="nds-media__body">
                            <span class="nds-truncate" title="Times New Roman">


                              Times New Roman

                            </span>
                          </span>
                        </span>
                      </li>
                      <li role="presentation" class="nds-listbox__item">
                        <span id="listbox-option-unique-id-02" class="nds-media nds-listbox__option nds-listbox__option_plain nds-media_small nds-media_center" role="option">
                          <span class="nds-media__body">
                            <span class="nds-truncate" title="Arial">


                              Arial

                            </span>
                          </span>
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="nds-rich-text-editor__select">
          <div class="nds-form-element">
            <label class="nds-form-element__label nds-assistive-text" for="font-size">Choose a Font Size</label>
            <div class="nds-form-element__control">
              <div class="nds-combobox_container">
                <div class="nds-combobox nds-dropdown-trigger nds-dropdown-trigger_click nds-size_xx-small" aria-expanded="false" aria-haspopup="listbox" role="combobox">
                  <div class="nds-combobox__form-element nds-input-has-icon nds-input-has-icon_right" role="none">
                    <input type="text" class="nds-input nds-combobox__input" id="font-size" aria-controls="size-listbox" autocomplete="off" role="textbox" placeholder="Select an Option" readonly="" tabindex="-1" value="Size">
                    <span class="nds-icon_container nds-icon-utility-down nds-input__icon nds-input__icon_right" title="Description of icon when needed">
                      <svg class="nds-icon nds-icon nds-icon_x-small nds-icon-text-default" aria-hidden="true">
                        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
                      </svg>
                      <span class="nds-assistive-text">Description of icon</span>
                    </span>
                  </div>
                  <div id="family-listbox" role="listbox">
                    <ul class="nds-listbox nds-listbox_vertical nds-dropdown nds-dropdown_fluid" role="presentation">
                      <li role="presentation" class="nds-listbox__item">
                        <span id="listbox-option-unique-id-03" class="nds-media nds-listbox__option nds-listbox__option_plain nds-media_small nds-media_center" role="option">
                          <span class="nds-media__body">
                            <span class="nds-truncate" title="12px">


                              12px

                            </span>
                          </span>
                        </span>
                      </li>
                      <li role="presentation" class="nds-listbox__item">
                        <span id="listbox-option-unique-id-04" class="nds-media nds-listbox__option nds-listbox__option_plain nds-media_small nds-media_center" role="option">
                          <span class="nds-media__body">
                            <span class="nds-truncate" title="14px">


                              14px

                            </span>
                          </span>
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ul aria-label="Format text" class="nds-button-group-list">
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#bold"></use>
            </svg>
            <span class="nds-assistive-text">Bold</span>
          </button>
        </li>
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#italic"></use>
            </svg>
            <span class="nds-assistive-text">Italic</span>
          </button>
        </li>
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#underline"></use>
            </svg>
            <span class="nds-assistive-text">Underline</span>
          </button>
        </li>
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#strikethrough"></use>
            </svg>
            <span class="nds-assistive-text">Strike Through</span>
          </button>
        </li>
      </ul>
      <ul aria-label="Format background &amp; text color" class="nds-button-group-list">
        <li>
          <button tabindex="-1" class="nds-button nds-button_icon nds-button_icon-more nds-button_icon-more-filled" aria-haspopup="true">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#text_background_color"></use>
            </svg>
            <svg class="nds-button__icon nds-button__icon_x-small" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
            </svg>
            <span class="nds-assistive-text">Background Color</span>
          </button>
        </li>
        <li>
          <button tabindex="-1" class="nds-button nds-button_icon nds-button_icon-more nds-button_icon-more-filled" aria-haspopup="true">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#text_color"></use>
            </svg>
            <svg class="nds-button__icon nds-button__icon_x-small" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
            </svg>
            <span class="nds-assistive-text">Text Color</span>
          </button>
        </li>
      </ul>
      <ul aria-label="Format body" class="nds-button-group-list">
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#richtextbulletedlist"></use>
            </svg>
            <span class="nds-assistive-text">Bulleted List</span>
          </button>
        </li>
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#richtextnumberedlist"></use>
            </svg>
            <span class="nds-assistive-text">Numbered List</span>
          </button>
        </li>
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#richtextindent"></use>
            </svg>
            <span class="nds-assistive-text">Indent</span>
          </button>
        </li>
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#richtextoutdent"></use>
            </svg>
            <span class="nds-assistive-text">Outdent</span>
          </button>
        </li>
      </ul>
      <ul aria-label="Align text" class="nds-button-group-list">
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#left_align_text"></use>
            </svg>
            <span class="nds-assistive-text">Left Align Text</span>
          </button>
        </li>
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#center_align_text"></use>
            </svg>
            <span class="nds-assistive-text">Center Align Text</span>
          </button>
        </li>
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#right_align_text"></use>
            </svg>
            <span class="nds-assistive-text">Right Align Text</span>
          </button>
        </li>
      </ul>
      <ul aria-label="Insert content" class="nds-button-group-list">
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#emoji"></use>
            </svg>
            <span class="nds-assistive-text">Add Emoji</span>
          </button>
        </li>
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#image"></use>
            </svg>
            <span class="nds-assistive-text">Add Image</span>
          </button>
        </li>
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#link"></use>
            </svg>
            <span class="nds-assistive-text">Add Link</span>
          </button>
        </li>
      </ul>
      <ul aria-label="Remove Formatting" class="nds-button-group-list">
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#remove_formatting"></use>
            </svg>
            <span class="nds-assistive-text">Remove Formatting</span>
          </button>
        </li>
      </ul>
    </div>
    <div class="nds-rich-text-editor__textarea nds-grid">
      <div aria-label="Compose text" class="nds-rich-text-area__content nds-text-color_weak nds-grow" contenteditable="true">Compose Email...</div>
    </div>
  </div>
</div>`);
  })
  .add('Feed (examples)', () => {
    return withExample(`<div class="demo-only" style="min-height: 180px;">
  <div class="nds-rich-text-editor nds-form-element nds-grid nds-grid_vertical nds-nowrap">
    <div role="toolbar" class="nds-rich-text-editor__toolbar nds-shrink-none">
      <ul aria-label="Format text" class="nds-button-group-list">
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="0" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#bold"></use>
            </svg>
            <span class="nds-assistive-text">Bold</span>
          </button>
        </li>
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#italic"></use>
            </svg>
            <span class="nds-assistive-text">Italic</span>
          </button>
        </li>
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#underline"></use>
            </svg>
            <span class="nds-assistive-text">Underline</span>
          </button>
        </li>
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#strikethrough"></use>
            </svg>
            <span class="nds-assistive-text">Strike Through</span>
          </button>
        </li>
      </ul>
      <ul aria-label="Format body" class="nds-button-group-list">
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#richtextbulletedlist"></use>
            </svg>
            <span class="nds-assistive-text">Bulleted List</span>
          </button>
        </li>
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#richtextnumberedlist"></use>
            </svg>
            <span class="nds-assistive-text">Numbered List</span>
          </button>
        </li>
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#richtextindent"></use>
            </svg>
            <span class="nds-assistive-text">Indent</span>
          </button>
        </li>
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#richtextoutdent"></use>
            </svg>
            <span class="nds-assistive-text">Outdent</span>
          </button>
        </li>
      </ul>
      <ul aria-label="Align text" class="nds-button-group-list">
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#left_align_text"></use>
            </svg>
            <span class="nds-assistive-text">Left Align Text</span>
          </button>
        </li>
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#center_align_text"></use>
            </svg>
            <span class="nds-assistive-text">Center Align Text</span>
          </button>
        </li>
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#right_align_text"></use>
            </svg>
            <span class="nds-assistive-text">Right Align Text</span>
          </button>
        </li>
      </ul>
      <ul aria-label="Insert content" class="nds-button-group-list">
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#emoji"></use>
            </svg>
            <span class="nds-assistive-text">Add Emoji</span>
          </button>
        </li>
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#image"></use>
            </svg>
            <span class="nds-assistive-text">Add Image</span>
          </button>
        </li>
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#link"></use>
            </svg>
            <span class="nds-assistive-text">Add Link</span>
          </button>
        </li>
      </ul>
      <ul aria-label="Add user" class="nds-button-group-list">
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#adduser"></use>
            </svg>
            <span class="nds-assistive-text">Add User</span>
          </button>
        </li>
      </ul>
      <ul aria-label="Remove Formatting" class="nds-button-group-list">
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#remove_formatting"></use>
            </svg>
            <span class="nds-assistive-text">Remove Formatting</span>
          </button>
        </li>
      </ul>
    </div>
    <div class="nds-rich-text-editor__textarea nds-grid">
      <div aria-label="Compose text" class="nds-rich-text-area__content nds-text-color_weak nds-grow" contenteditable="true">Post to feed...</div>
    </div>
  </div>
</div>`);
  })
  .add('Note (examples)', () => {
    return withExample(`<div class="demo-only" style="min-height: 180px;">
  <div class="nds-rich-text-editor nds-form-element nds-grid nds-grid_vertical nds-nowrap">
    <div role="toolbar" class="nds-rich-text-editor__toolbar nds-shrink-none">
      <ul aria-label="Format text" class="nds-button-group-list">
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="0" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#bold"></use>
            </svg>
            <span class="nds-assistive-text">Bold</span>
          </button>
        </li>
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#italic"></use>
            </svg>
            <span class="nds-assistive-text">Italic</span>
          </button>
        </li>
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#underline"></use>
            </svg>
            <span class="nds-assistive-text">Underline</span>
          </button>
        </li>
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#strikethrough"></use>
            </svg>
            <span class="nds-assistive-text">Strike Through</span>
          </button>
        </li>
      </ul>
      <ul aria-label="Format body" class="nds-button-group-list">
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#richtextbulletedlist"></use>
            </svg>
            <span class="nds-assistive-text">Bulleted List</span>
          </button>
        </li>
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#richtextnumberedlist"></use>
            </svg>
            <span class="nds-assistive-text">Numbered List</span>
          </button>
        </li>
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#richtextindent"></use>
            </svg>
            <span class="nds-assistive-text">Indent</span>
          </button>
        </li>
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#richtextoutdent"></use>
            </svg>
            <span class="nds-assistive-text">Outdent</span>
          </button>
        </li>
      </ul>
      <ul aria-label="Insert content" class="nds-button-group-list">
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#emoji"></use>
            </svg>
            <span class="nds-assistive-text">Add Emoji</span>
          </button>
        </li>
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#image"></use>
            </svg>
            <span class="nds-assistive-text">Add Image</span>
          </button>
        </li>
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#link"></use>
            </svg>
            <span class="nds-assistive-text">Add Link</span>
          </button>
        </li>
      </ul>
      <ul aria-label="Remove Formatting" class="nds-button-group-list">
        <li>
          <button class="nds-button nds-button_icon nds-button_icon-border-filled" tabindex="-1" title="Provide description of action">
            <svg class="nds-button__icon" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#remove_formatting"></use>
            </svg>
            <span class="nds-assistive-text">Remove Formatting</span>
          </button>
        </li>
      </ul>
    </div>
    <div class="nds-rich-text-editor__textarea nds-grid">
      <div aria-label="Compose text" class="nds-rich-text-area__content nds-text-color_weak nds-grow" contenteditable="true">Compose Note...</div>
    </div>
  </div>
</div>`);
  });
