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
    return withExample(`<div class="nds-dropdown-trigger nds-dropdown-trigger_click">
  <button class="nds-button nds-button_icon nds-button_icon-border-filled" aria-haspopup="true" title="Show More">
    <svg class="nds-button__icon" aria-hidden="true">
      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
    </svg>
    <span class="nds-assistive-text">Show More</span>
  </button>
  <div class="nds-dropdown nds-dropdown--left">
    <div class="nds-color-picker nds-color-picker_swatches-only">
      <div class="nds-color-picker__selector">
        <ul class="nds-color-picker__swatches" role="menu">
          <li class="nds-color-picker__swatch" role="presentation">
            <a class="nds-color-picker__swatch-trigger" href="#" role="menuitem" tabindex="0">
              <span class="nds-swatch" style="background: rgb(227, 171, 236) none repeat scroll 0% 0%;">
                <span class="nds-assistive-text">#e3abec</span>
              </span>
            </a>
          </li>
          <li class="nds-color-picker__swatch" role="presentation">
            <a class="nds-color-picker__swatch-trigger" href="#" role="menuitem" tabindex="-1">
              <span class="nds-swatch" style="background: rgb(194, 219, 247) none repeat scroll 0% 0%;">
                <span class="nds-assistive-text">#c2dbf7</span>
              </span>
            </a>
          </li>
          <li class="nds-color-picker__swatch" role="presentation">
            <a class="nds-color-picker__swatch-trigger" href="#" role="menuitem" tabindex="-1">
              <span class="nds-swatch" style="background: rgb(159, 214, 255) none repeat scroll 0% 0%;">
                <span class="nds-assistive-text">#9fd6ff</span>
              </span>
            </a>
          </li>
          <li class="nds-color-picker__swatch" role="presentation">
            <a class="nds-color-picker__swatch-trigger" href="#" role="menuitem" tabindex="-1">
              <span class="nds-swatch" style="background: rgb(157, 231, 218) none repeat scroll 0% 0%;">
                <span class="nds-assistive-text">#9de7da</span>
              </span>
            </a>
          </li>
          <li class="nds-color-picker__swatch" role="presentation">
            <a class="nds-color-picker__swatch-trigger" href="#" role="menuitem" tabindex="-1">
              <span class="nds-swatch" style="background: rgb(157, 240, 192) none repeat scroll 0% 0%;">
                <span class="nds-assistive-text">#9df0c0</span>
              </span>
            </a>
          </li>
          <li class="nds-color-picker__swatch" role="presentation">
            <a class="nds-color-picker__swatch-trigger" href="#" role="menuitem" tabindex="-1">
              <span class="nds-swatch" style="background: rgb(255, 240, 153) none repeat scroll 0% 0%;">
                <span class="nds-assistive-text">#fff099</span>
              </span>
            </a>
          </li>
          <li class="nds-color-picker__swatch" role="presentation">
            <a class="nds-color-picker__swatch-trigger" href="#" role="menuitem" tabindex="-1">
              <span class="nds-swatch" style="background: rgb(254, 212, 154) none repeat scroll 0% 0%;">
                <span class="nds-assistive-text">#fed49a</span>
              </span>
            </a>
          </li>
          <li class="nds-color-picker__swatch" role="presentation">
            <a class="nds-color-picker__swatch-trigger" href="#" role="menuitem" tabindex="-1">
              <span class="nds-swatch" style="background: rgb(208, 115, 224) none repeat scroll 0% 0%;">
                <span class="nds-assistive-text">#d073e0</span>
              </span>
            </a>
          </li>
          <li class="nds-color-picker__swatch" role="presentation">
            <a class="nds-color-picker__swatch-trigger" href="#" role="menuitem" tabindex="-1">
              <span class="nds-swatch" style="background: rgb(134, 186, 243) none repeat scroll 0% 0%;">
                <span class="nds-assistive-text">#86baf3</span>
              </span>
            </a>
          </li>
          <li class="nds-color-picker__swatch" role="presentation">
            <a class="nds-color-picker__swatch-trigger" href="#" role="menuitem" tabindex="-1">
              <span class="nds-swatch" style="background: rgb(94, 187, 255) none repeat scroll 0% 0%;">
                <span class="nds-assistive-text">#5ebbff</span>
              </span>
            </a>
          </li>
          <li class="nds-color-picker__swatch" role="presentation">
            <a class="nds-color-picker__swatch-trigger" href="#" role="menuitem" tabindex="-1">
              <span class="nds-swatch" style="background: rgb(68, 216, 190) none repeat scroll 0% 0%;">
                <span class="nds-assistive-text">#44d8be</span>
              </span>
            </a>
          </li>
          <li class="nds-color-picker__swatch" role="presentation">
            <a class="nds-color-picker__swatch-trigger" href="#" role="menuitem" tabindex="-1">
              <span class="nds-swatch" style="background: rgb(59, 226, 130) none repeat scroll 0% 0%;">
                <span class="nds-assistive-text">#3be282</span>
              </span>
            </a>
          </li>
          <li class="nds-color-picker__swatch" role="presentation">
            <a class="nds-color-picker__swatch-trigger" href="#" role="menuitem" tabindex="-1">
              <span class="nds-swatch" style="background: rgb(255, 230, 84) none repeat scroll 0% 0%;">
                <span class="nds-assistive-text">#ffe654</span>
              </span>
            </a>
          </li>
          <li class="nds-color-picker__swatch" role="presentation">
            <a class="nds-color-picker__swatch-trigger" href="#" role="menuitem" tabindex="-1">
              <span class="nds-swatch" style="background: rgb(255, 183, 88) none repeat scroll 0% 0%;">
                <span class="nds-assistive-text">#ffb758</span>
              </span>
            </a>
          </li>
          <li class="nds-color-picker__swatch" role="presentation">
            <a class="nds-color-picker__swatch-trigger" href="#" role="menuitem" tabindex="-1">
              <span class="nds-swatch" style="background: rgb(189, 53, 189) none repeat scroll 0% 0%;">
                <span class="nds-assistive-text">#bd35bd</span>
              </span>
            </a>
          </li>
          <li class="nds-color-picker__swatch" role="presentation">
            <a class="nds-color-picker__swatch-trigger" href="#" role="menuitem" tabindex="-1">
              <span class="nds-swatch" style="background: rgb(87, 121, 193) none repeat scroll 0% 0%;">
                <span class="nds-assistive-text">#5779c1</span>
              </span>
            </a>
          </li>
          <li class="nds-color-picker__swatch" role="presentation">
            <a class="nds-color-picker__swatch-trigger" href="#" role="menuitem" tabindex="-1">
              <span class="nds-swatch" style="background: rgb(94, 187, 255) none repeat scroll 0% 0%;">
                <span class="nds-assistive-text">#5ebbff</span>
              </span>
            </a>
          </li>
          <li class="nds-color-picker__swatch" role="presentation">
            <a class="nds-color-picker__swatch-trigger" href="#" role="menuitem" tabindex="-1">
              <span class="nds-swatch" style="background: rgb(0, 174, 169) none repeat scroll 0% 0%;">
                <span class="nds-assistive-text">#00aea9</span>
              </span>
            </a>
          </li>
          <li class="nds-color-picker__swatch" role="presentation">
            <a class="nds-color-picker__swatch-trigger" href="#" role="menuitem" tabindex="-1">
              <span class="nds-swatch" style="background: rgb(60, 186, 76) none repeat scroll 0% 0%;">
                <span class="nds-assistive-text">#3cba4c</span>
              </span>
            </a>
          </li>
          <li class="nds-color-picker__swatch" role="presentation">
            <a class="nds-color-picker__swatch-trigger" href="#" role="menuitem" tabindex="-1">
              <span class="nds-swatch" style="background: rgb(245, 188, 37) none repeat scroll 0% 0%;">
                <span class="nds-assistive-text">#f5bc25</span>
              </span>
            </a>
          </li>
          <li class="nds-color-picker__swatch" role="presentation">
            <a class="nds-color-picker__swatch-trigger" href="#" role="menuitem" tabindex="-1">
              <span class="nds-swatch" style="background: rgb(249, 146, 33) none repeat scroll 0% 0%;">
                <span class="nds-assistive-text">#f99221</span>
              </span>
            </a>
          </li>
          <li class="nds-color-picker__swatch" role="presentation">
            <a class="nds-color-picker__swatch-trigger" href="#" role="menuitem" tabindex="-1">
              <span class="nds-swatch" style="background: rgb(88, 13, 140) none repeat scroll 0% 0%;">
                <span class="nds-assistive-text">#580d8c</span>
              </span>
            </a>
          </li>
          <li class="nds-color-picker__swatch" role="presentation">
            <a class="nds-color-picker__swatch-trigger" href="#" role="menuitem" tabindex="-1">
              <span class="nds-swatch" style="background: rgb(0, 25, 112) none repeat scroll 0% 0%;">
                <span class="nds-assistive-text">#001970</span>
              </span>
            </a>
          </li>
          <li class="nds-color-picker__swatch" role="presentation">
            <a class="nds-color-picker__swatch-trigger" href="#" role="menuitem" tabindex="-1">
              <span class="nds-swatch" style="background: rgb(10, 35, 153) none repeat scroll 0% 0%;">
                <span class="nds-assistive-text">#0a2399</span>
              </span>
            </a>
          </li>
          <li class="nds-color-picker__swatch" role="presentation">
            <a class="nds-color-picker__swatch-trigger" href="#" role="menuitem" tabindex="-1">
              <span class="nds-swatch" style="background: rgb(11, 116, 119) none repeat scroll 0% 0%;">
                <span class="nds-assistive-text">#0b7477</span>
              </span>
            </a>
          </li>
          <li class="nds-color-picker__swatch" role="presentation">
            <a class="nds-color-picker__swatch-trigger" href="#" role="menuitem" tabindex="-1">
              <span class="nds-swatch" style="background: rgb(11, 107, 80) none repeat scroll 0% 0%;">
                <span class="nds-assistive-text">#0b6b50</span>
              </span>
            </a>
          </li>
          <li class="nds-color-picker__swatch" role="presentation">
            <a class="nds-color-picker__swatch-trigger" href="#" role="menuitem" tabindex="-1">
              <span class="nds-swatch" style="background: rgb(182, 126, 17) none repeat scroll 0% 0%;">
                <span class="nds-assistive-text">#b67e11</span>
              </span>
            </a>
          </li>
          <li class="nds-color-picker__swatch" role="presentation">
            <a class="nds-color-picker__swatch-trigger" href="#" role="menuitem" tabindex="-1">
              <span class="nds-swatch" style="background: rgb(184, 93, 13) none repeat scroll 0% 0%;">
                <span class="nds-assistive-text">#b85d0d</span>
              </span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>`);
  })
  .add('Open Swatches Only Color Picker (states)', () => {
    return withExample(`<div style="height: 12rem;">
  <div class="nds-dropdown-trigger nds-dropdown-trigger_click nds-is-open">
    <button class="nds-button nds-button_icon nds-button_icon-border-filled" aria-haspopup="true" title="Show More">
      <svg class="nds-button__icon" aria-hidden="true">
        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
      </svg>
      <span class="nds-assistive-text">Show More</span>
    </button>
    <div class="nds-dropdown nds-dropdown--left">
      <div class="nds-color-picker nds-color-picker_swatches-only">
        <div class="nds-color-picker__selector">
          <ul class="nds-color-picker__swatches" role="menu">
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="menuitem" tabindex="0">
                <span class="nds-swatch" style="background: rgb(227, 171, 236) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#e3abec</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="menuitem" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(194, 219, 247) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#c2dbf7</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="menuitem" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(159, 214, 255) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#9fd6ff</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="menuitem" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(157, 231, 218) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#9de7da</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="menuitem" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(157, 240, 192) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#9df0c0</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="menuitem" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(255, 240, 153) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#fff099</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="menuitem" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(254, 212, 154) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#fed49a</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="menuitem" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(208, 115, 224) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#d073e0</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="menuitem" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(134, 186, 243) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#86baf3</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="menuitem" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(94, 187, 255) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#5ebbff</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="menuitem" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(68, 216, 190) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#44d8be</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="menuitem" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(59, 226, 130) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#3be282</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="menuitem" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(255, 230, 84) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#ffe654</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="menuitem" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(255, 183, 88) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#ffb758</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="menuitem" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(189, 53, 189) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#bd35bd</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="menuitem" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(87, 121, 193) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#5779c1</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="menuitem" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(94, 187, 255) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#5ebbff</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="menuitem" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(0, 174, 169) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#00aea9</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="menuitem" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(60, 186, 76) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#3cba4c</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="menuitem" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(245, 188, 37) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#f5bc25</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="menuitem" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(249, 146, 33) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#f99221</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="menuitem" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(88, 13, 140) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#580d8c</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="menuitem" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(0, 25, 112) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#001970</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="menuitem" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(10, 35, 153) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#0a2399</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="menuitem" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(11, 116, 119) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#0b7477</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="menuitem" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(11, 107, 80) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#0b6b50</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="menuitem" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(182, 126, 17) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#b67e11</span>
                </span>
              </a>
            </li>
            <li class="nds-color-picker__swatch" role="presentation">
              <a class="nds-color-picker__swatch-trigger" href="#" role="menuitem" tabindex="-1">
                <span class="nds-swatch" style="background: rgb(184, 93, 13) none repeat scroll 0% 0%;">
                  <span class="nds-assistive-text">#b85d0d</span>
                </span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</div>`);
  });
