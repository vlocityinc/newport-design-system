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
    return withExample(`<div class="nds-tree_container" role="application">
  <h4 class="nds-text-title_caps" id="treeheading">Tree Group Header</h4>
  <ul class="nds-tree" role="tree" aria-labelledby="treeheading">
    <li role="treeitem" aria-level="1" tabindex="0">
      <div class="nds-tree__item">
        <button class="nds-button nds-button_icon nds-button_icon nds-m-right_x-small nds-is-disabled" aria-hidden="true" tabindex="-1" title="Expand Tree Item">
          <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevronright"></use>
          </svg>
          <span class="nds-assistive-text">Expand Tree Item</span>
        </button>
        <span class="nds-truncate" title="Tree Item">Tree Item</span>
      </div>
    </li>
    <li role="treeitem" aria-level="1" aria-expanded="false" aria-label="Tree Branch">
      <div class="nds-tree__item">
        <button class="nds-button nds-button_icon nds-button_icon nds-m-right_x-small" aria-hidden="true" tabindex="-1" title="Expand Tree Branch">
          <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevronright"></use>
          </svg>
          <span class="nds-assistive-text">Expand Tree Branch</span>
        </button>
        <span class="nds-truncate" title="Tree Branch">Tree Branch</span>
      </div>
      <ul role="group">
        <li role="treeitem" aria-level="2" aria-selected="false">
          <div class="nds-tree__item">
            <button class="nds-button nds-button_icon nds-button_icon nds-m-right_x-small nds-is-disabled" aria-hidden="true" tabindex="-1" title="Expand Tree Item">
              <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevronright"></use>
              </svg>
              <span class="nds-assistive-text">Expand Tree Item</span>
            </button>
            <span class="nds-truncate" title="Tree Item">Tree Item</span>
          </div>
        </li>
      </ul>
    </li>
    <li role="treeitem" aria-level="1" aria-expanded="false" aria-label="Tree Branch">
      <div class="nds-tree__item">
        <button class="nds-button nds-button_icon nds-button_icon nds-m-right_x-small" aria-hidden="true" tabindex="-1" title="Expand Tree Branch">
          <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevronright"></use>
          </svg>
          <span class="nds-assistive-text">Expand Tree Branch</span>
        </button>
        <span class="nds-truncate" title="Tree Branch">Tree Branch</span>
      </div>
      <ul role="group">
        <li role="treeitem" aria-level="2">
          <div class="nds-tree__item">
            <button class="nds-button nds-button_icon nds-button_icon nds-m-right_x-small nds-is-disabled" aria-hidden="true" tabindex="-1" title="Expand Tree Item">
              <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevronright"></use>
              </svg>
              <span class="nds-assistive-text">Expand Tree Item</span>
            </button>
            <span class="nds-truncate" title="Tree Item">Tree Item</span>
          </div>
        </li>
      </ul>
    </li>
    <li role="treeitem" aria-level="1">
      <div class="nds-tree__item">
        <button class="nds-button nds-button_icon nds-button_icon nds-m-right_x-small nds-is-disabled" aria-hidden="true" tabindex="-1" title="Expand Tree Item">
          <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevronright"></use>
          </svg>
          <span class="nds-assistive-text">Expand Tree Item</span>
        </button>
        <span class="nds-truncate" title="Tree Item">Tree Item</span>
      </div>
    </li>
  </ul>
</div>`);
  })
  .add('Expanded (states)', () => {
    return withExample(`<div class="nds-tree_container" role="application">
  <h4 class="nds-text-title_caps" id="treeheading">Tree Group Header</h4>
  <ul class="nds-tree" role="tree" aria-labelledby="treeheading">
    <li role="treeitem" aria-level="1" tabindex="0">
      <div class="nds-tree__item">
        <button class="nds-button nds-button_icon nds-button_icon nds-m-right_x-small nds-is-disabled" aria-hidden="true" tabindex="-1" title="Expand Tree Item">
          <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevronright"></use>
          </svg>
          <span class="nds-assistive-text">Expand Tree Item</span>
        </button>
        <span class="nds-truncate" title="Tree Item">Tree Item</span>
      </div>
    </li>
    <li role="treeitem" aria-level="1" aria-expanded="true" aria-label="Tree Branch">
      <div class="nds-tree__item">
        <button class="nds-button nds-button_icon nds-button_icon nds-m-right_x-small" aria-hidden="true" tabindex="-1" title="Expand Tree Branch">
          <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevronright"></use>
          </svg>
          <span class="nds-assistive-text">Expand Tree Branch</span>
        </button>
        <span class="nds-truncate" title="Tree Branch">Tree Branch</span>
      </div>
      <ul role="group">
        <li role="treeitem" aria-level="2" aria-selected="false">
          <div class="nds-tree__item">
            <button class="nds-button nds-button_icon nds-button_icon nds-m-right_x-small nds-is-disabled" aria-hidden="true" tabindex="-1" title="Expand Tree Item">
              <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevronright"></use>
              </svg>
              <span class="nds-assistive-text">Expand Tree Item</span>
            </button>
            <span class="nds-truncate" title="Tree Item">Tree Item</span>
          </div>
        </li>
      </ul>
    </li>
    <li role="treeitem" aria-level="1" aria-expanded="false" aria-label="Tree Branch">
      <div class="nds-tree__item">
        <button class="nds-button nds-button_icon nds-button_icon nds-m-right_x-small" aria-hidden="true" tabindex="-1" title="Expand Tree Branch">
          <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevronright"></use>
          </svg>
          <span class="nds-assistive-text">Expand Tree Branch</span>
        </button>
        <span class="nds-truncate" title="Tree Branch">Tree Branch</span>
      </div>
      <ul role="group">
        <li role="treeitem" aria-level="2">
          <div class="nds-tree__item">
            <button class="nds-button nds-button_icon nds-button_icon nds-m-right_x-small nds-is-disabled" aria-hidden="true" tabindex="-1" title="Expand Tree Item">
              <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevronright"></use>
              </svg>
              <span class="nds-assistive-text">Expand Tree Item</span>
            </button>
            <span class="nds-truncate" title="Tree Item">Tree Item</span>
          </div>
        </li>
      </ul>
    </li>
    <li role="treeitem" aria-level="1">
      <div class="nds-tree__item">
        <button class="nds-button nds-button_icon nds-button_icon nds-m-right_x-small nds-is-disabled" aria-hidden="true" tabindex="-1" title="Expand Tree Item">
          <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevronright"></use>
          </svg>
          <span class="nds-assistive-text">Expand Tree Item</span>
        </button>
        <span class="nds-truncate" title="Tree Item">Tree Item</span>
      </div>
    </li>
  </ul>
</div>`);
  })
  .add('Selected (states)', () => {
    return withExample(`<div class="nds-tree_container" role="application">
  <h4 class="nds-text-title_caps" id="treeheading">Tree Group Header</h4>
  <ul class="nds-tree" role="tree" aria-labelledby="treeheading">
    <li role="treeitem" aria-level="1">
      <div class="nds-tree__item">
        <button class="nds-button nds-button_icon nds-button_icon nds-m-right_x-small nds-is-disabled" aria-hidden="true" tabindex="-1" title="Expand Tree Item">
          <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevronright"></use>
          </svg>
          <span class="nds-assistive-text">Expand Tree Item</span>
        </button>
        <span class="nds-truncate" title="Tree Item">Tree Item</span>
      </div>
    </li>
    <li role="treeitem" aria-level="1" aria-expanded="true" aria-label="Tree Branch">
      <div class="nds-tree__item">
        <button class="nds-button nds-button_icon nds-button_icon nds-m-right_x-small" aria-hidden="true" tabindex="-1" title="Expand Tree Branch">
          <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevronright"></use>
          </svg>
          <span class="nds-assistive-text">Expand Tree Branch</span>
        </button>
        <span class="nds-truncate" title="Tree Branch">Tree Branch</span>
      </div>
      <ul role="group">
        <li role="treeitem" aria-level="2" aria-selected="true" tabindex="0">
          <div class="nds-tree__item">
            <button class="nds-button nds-button_icon nds-button_icon nds-m-right_x-small nds-is-disabled" aria-hidden="true" tabindex="-1" title="Expand Tree Item">
              <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevronright"></use>
              </svg>
              <span class="nds-assistive-text">Expand Tree Item</span>
            </button>
            <span class="nds-truncate" title="Tree Item">Tree Item</span>
          </div>
        </li>
      </ul>
    </li>
    <li role="treeitem" aria-level="1" aria-expanded="false" aria-label="Tree Branch">
      <div class="nds-tree__item">
        <button class="nds-button nds-button_icon nds-button_icon nds-m-right_x-small" aria-hidden="true" tabindex="-1" title="Expand Tree Branch">
          <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevronright"></use>
          </svg>
          <span class="nds-assistive-text">Expand Tree Branch</span>
        </button>
        <span class="nds-truncate" title="Tree Branch">Tree Branch</span>
      </div>
      <ul role="group">
        <li role="treeitem" aria-level="2">
          <div class="nds-tree__item">
            <button class="nds-button nds-button_icon nds-button_icon nds-m-right_x-small nds-is-disabled" aria-hidden="true" tabindex="-1" title="Expand Tree Item">
              <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevronright"></use>
              </svg>
              <span class="nds-assistive-text">Expand Tree Item</span>
            </button>
            <span class="nds-truncate" title="Tree Item">Tree Item</span>
          </div>
        </li>
      </ul>
    </li>
    <li role="treeitem" aria-level="1">
      <div class="nds-tree__item">
        <button class="nds-button nds-button_icon nds-button_icon nds-m-right_x-small nds-is-disabled" aria-hidden="true" tabindex="-1" title="Expand Tree Item">
          <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevronright"></use>
          </svg>
          <span class="nds-assistive-text">Expand Tree Item</span>
        </button>
        <span class="nds-truncate" title="Tree Item">Tree Item</span>
      </div>
    </li>
  </ul>
</div>`);
  })
  .add('Deep Nesting (states)', () => {
    return withExample(`<div class="nds-tree_container" role="application">
  <h4 class="nds-text-title_caps" id="treeheading">Tree Group Header</h4>
  <ul class="nds-tree" role="tree" aria-labelledby="treeheading">
    <li role="treeitem" aria-level="1" tabindex="0">
      <div class="nds-tree__item">
        <button class="nds-button nds-button_icon nds-button_icon nds-m-right_x-small nds-is-disabled" aria-hidden="true" tabindex="-1" title="Expand Tree Item">
          <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevronright"></use>
          </svg>
          <span class="nds-assistive-text">Expand Tree Item</span>
        </button>
        <span class="nds-truncate" title="Tree Item">Tree Item</span>
      </div>
    </li>
    <li role="treeitem" aria-level="1" aria-expanded="true" aria-label="Tree Branch">
      <div class="nds-tree__item">
        <button class="nds-button nds-button_icon nds-button_icon nds-m-right_x-small" aria-hidden="true" tabindex="-1" title="Expand Tree Branch">
          <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevronright"></use>
          </svg>
          <span class="nds-assistive-text">Expand Tree Branch</span>
        </button>
        <span class="nds-truncate" title="Tree Branch">Tree Branch</span>
      </div>
      <ul role="group">
        <li role="treeitem" aria-level="2" aria-selected="false">
          <div class="nds-tree__item">
            <button class="nds-button nds-button_icon nds-button_icon nds-m-right_x-small nds-is-disabled" aria-hidden="true" tabindex="-1" title="Expand Tree Item">
              <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevronright"></use>
              </svg>
              <span class="nds-assistive-text">Expand Tree Item</span>
            </button>
            <span class="nds-truncate" title="Tree Item">Tree Item</span>
          </div>
        </li>
        <li aria-expanded="true" aria-label="Tree Branch" aria-level="2" id="tree0-node1-1" role="treeitem">
          <div class="nds-tree__item">
            <button class="nds-button nds-button_icon nds-button_icon nds-m-right_x-small" aria-hidden="true" tabindex="-1" title="Expand Tree Branch">
              <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevronright"></use>
              </svg>
              <span class="nds-assistive-text">Expand Tree Branch</span>
            </button>
            <span class="nds-truncate" title="Tree Branch">Tree Branch</span>
          </div>
          <ul role="group">
            <li role="treeitem" aria-level="3">
              <div class="nds-tree__item">
                <button class="nds-button nds-button_icon nds-button_icon nds-m-right_x-small nds-is-disabled" aria-hidden="true" tabindex="-1" title="Expand Tree Item">
                  <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
                    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevronright"></use>
                  </svg>
                  <span class="nds-assistive-text">Expand Tree Item</span>
                </button>
                <span class="nds-truncate" title="Tree Item">Tree Item</span>
              </div>
            </li>
            <li role="treeitem" aria-level="3">
              <div class="nds-tree__item">
                <button class="nds-button nds-button_icon nds-button_icon nds-m-right_x-small nds-is-disabled" aria-hidden="true" tabindex="-1" title="Expand Tree Item">
                  <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
                    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevronright"></use>
                  </svg>
                  <span class="nds-assistive-text">Expand Tree Item</span>
                </button>
                <span class="nds-truncate" title="Tree Item">Tree Item</span>
              </div>
            </li>
            <li role="treeitem" aria-level="3" aria-expanded="false" aria-label="Tree Branch">
              <div class="nds-tree__item">
                <button class="nds-button nds-button_icon nds-button_icon nds-m-right_x-small" aria-hidden="true" tabindex="-1" title="Expand Tree Branch">
                  <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
                    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevronright"></use>
                  </svg>
                  <span class="nds-assistive-text">Expand Tree Branch</span>
                </button>
                <span class="nds-truncate" title="Tree Branch">Tree Branch</span>
              </div>
              <ul role="group">
                <li role="treeitem" aria-level="4">
                  <div class="nds-tree__item">
                    <button class="nds-button nds-button_icon nds-button_icon nds-m-right_x-small nds-is-disabled" aria-hidden="true" tabindex="-1" title="Expand Tree Item">
                      <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
                        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevronright"></use>
                      </svg>
                      <span class="nds-assistive-text">Expand Tree Item</span>
                    </button>
                    <span class="nds-truncate" title="Tree Item">Tree Item</span>
                  </div>
                </li>
                <li role="treeitem" aria-level="4">
                  <div class="nds-tree__item">
                    <button class="nds-button nds-button_icon nds-button_icon nds-m-right_x-small nds-is-disabled" aria-hidden="true" tabindex="-1" title="Expand Tree Item">
                      <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
                        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevronright"></use>
                      </svg>
                      <span class="nds-assistive-text">Expand Tree Item</span>
                    </button>
                    <span class="nds-truncate" title="Tree Item">Tree Item</span>
                  </div>
                </li>
                <li role="treeitem" aria-level="4">
                  <div class="nds-tree__item">
                    <button class="nds-button nds-button_icon nds-button_icon nds-m-right_x-small nds-is-disabled" aria-hidden="true" tabindex="-1" title="Expand Tree Item">
                      <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
                        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevronright"></use>
                      </svg>
                      <span class="nds-assistive-text">Expand Tree Item</span>
                    </button>
                    <span class="nds-truncate" title="Tree Item">Tree Item</span>
                  </div>
                </li>
              </ul>
            </li>
            <li role="treeitem" aria-level="3" aria-expanded="true" aria-label="Tree Branch">
              <div class="nds-tree__item">
                <button class="nds-button nds-button_icon nds-button_icon nds-m-right_x-small" aria-hidden="true" tabindex="-1" title="Expand Tree Branch">
                  <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
                    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevronright"></use>
                  </svg>
                  <span class="nds-assistive-text">Expand Tree Branch</span>
                </button>
                <span class="nds-truncate" title="Tree Branch">Tree Branch</span>
              </div>
              <ul role="group">
                <li role="treeitem" aria-level="4">
                  <div class="nds-tree__item">
                    <button class="nds-button nds-button_icon nds-button_icon nds-m-right_x-small nds-is-disabled" aria-hidden="true" tabindex="-1" title="Expand Tree Item">
                      <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
                        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevronright"></use>
                      </svg>
                      <span class="nds-assistive-text">Expand Tree Item</span>
                    </button>
                    <span class="nds-truncate" title="Tree Item">Tree Item</span>
                  </div>
                </li>
                <li role="treeitem" aria-level="4">
                  <div class="nds-tree__item">
                    <button class="nds-button nds-button_icon nds-button_icon nds-m-right_x-small nds-is-disabled" aria-hidden="true" tabindex="-1" title="Expand Tree Item">
                      <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
                        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevronright"></use>
                      </svg>
                      <span class="nds-assistive-text">Expand Tree Item</span>
                    </button>
                    <span class="nds-truncate" title="Tree Item">Tree Item</span>
                  </div>
                </li>
                <li role="treeitem" aria-level="4">
                  <div class="nds-tree__item">
                    <button class="nds-button nds-button_icon nds-button_icon nds-m-right_x-small nds-is-disabled" aria-hidden="true" tabindex="-1" title="Expand Tree Item">
                      <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
                        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevronright"></use>
                      </svg>
                      <span class="nds-assistive-text">Expand Tree Item</span>
                    </button>
                    <span class="nds-truncate" title="Tree Item">Tree Item</span>
                  </div>
                </li>
                <li role="treeitem" aria-level="4" aria-expanded="true" aria-label="Tree Branch">
                  <div class="nds-tree__item">
                    <button class="nds-button nds-button_icon nds-button_icon nds-m-right_x-small" aria-hidden="true" tabindex="-1" title="Expand Tree Branch">
                      <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
                        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevronright"></use>
                      </svg>
                      <span class="nds-assistive-text">Expand Tree Branch</span>
                    </button>
                    <span class="nds-truncate" title="Tree Branch">Tree Branch</span>
                  </div>
                  <ul role="group">
                    <li role="treeitem" aria-level="5">
                      <div class="nds-tree__item">
                        <button class="nds-button nds-button_icon nds-button_icon nds-m-right_x-small nds-is-disabled" aria-hidden="true" tabindex="-1" title="Expand Tree Item">
                          <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
                            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevronright"></use>
                          </svg>
                          <span class="nds-assistive-text">Expand Tree Item</span>
                        </button>
                        <span class="nds-truncate" title="Tree Item">Tree Item</span>
                      </div>
                    </li>
                    <li role="treeitem" aria-level="5">
                      <div class="nds-tree__item">
                        <button class="nds-button nds-button_icon nds-button_icon nds-m-right_x-small nds-is-disabled" aria-hidden="true" tabindex="-1" title="Expand Tree Item">
                          <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
                            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevronright"></use>
                          </svg>
                          <span class="nds-assistive-text">Expand Tree Item</span>
                        </button>
                        <span class="nds-truncate" title="Tree Item">Tree Item</span>
                      </div>
                    </li>
                    <li role="treeitem" aria-level="5">
                      <div class="nds-tree__item">
                        <button class="nds-button nds-button_icon nds-button_icon nds-m-right_x-small nds-is-disabled" aria-hidden="true" tabindex="-1" title="Expand Tree Item">
                          <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
                            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevronright"></use>
                          </svg>
                          <span class="nds-assistive-text">Expand Tree Item</span>
                        </button>
                        <span class="nds-truncate" title="Tree Item">Tree Item</span>
                      </div>
                    </li>
                  </ul>
                </li>
                <li role="treeitem" aria-level="4">
                  <div class="nds-tree__item">
                    <button class="nds-button nds-button_icon nds-button_icon nds-m-right_x-small nds-is-disabled" aria-hidden="true" tabindex="-1" title="Expand Tree Item">
                      <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
                        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevronright"></use>
                      </svg>
                      <span class="nds-assistive-text">Expand Tree Item</span>
                    </button>
                    <span class="nds-truncate" title="Tree Item">Tree Item</span>
                  </div>
                </li>
              </ul>
            </li>
            <li role="treeitem" aria-level="3">
              <div class="nds-tree__item">
                <button class="nds-button nds-button_icon nds-button_icon nds-m-right_x-small nds-is-disabled" aria-hidden="true" tabindex="-1" title="Expand Tree Item">
                  <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
                    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevronright"></use>
                  </svg>
                  <span class="nds-assistive-text">Expand Tree Item</span>
                </button>
                <span class="nds-truncate" title="Tree Item">Tree Item</span>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </li>
    <li role="treeitem" aria-level="1" aria-expanded="false" aria-label="Tree Branch">
      <div class="nds-tree__item">
        <button class="nds-button nds-button_icon nds-button_icon nds-m-right_x-small" aria-hidden="true" tabindex="-1" title="Expand Tree Branch">
          <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevronright"></use>
          </svg>
          <span class="nds-assistive-text">Expand Tree Branch</span>
        </button>
        <span class="nds-truncate" title="Tree Branch">Tree Branch</span>
      </div>
      <ul role="group">
        <li role="treeitem" aria-level="2">
          <div class="nds-tree__item">
            <button class="nds-button nds-button_icon nds-button_icon nds-m-right_x-small nds-is-disabled" aria-hidden="true" tabindex="-1" title="Expand Tree Item">
              <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevronright"></use>
              </svg>
              <span class="nds-assistive-text">Expand Tree Item</span>
            </button>
            <span class="nds-truncate" title="Tree Item">Tree Item</span>
          </div>
        </li>
      </ul>
    </li>
    <li role="treeitem" aria-level="1">
      <div class="nds-tree__item">
        <button class="nds-button nds-button_icon nds-button_icon nds-m-right_x-small nds-is-disabled" aria-hidden="true" tabindex="-1" title="Expand Tree Item">
          <svg class="nds-button__icon nds-button__icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevronright"></use>
          </svg>
          <span class="nds-assistive-text">Expand Tree Item</span>
        </button>
        <span class="nds-truncate" title="Tree Item">Tree Item</span>
      </div>
    </li>
  </ul>
</div>`);
  });
