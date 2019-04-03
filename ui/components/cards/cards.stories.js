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
  .add('Default', () => {
    return withExample(`<article class="nds-card">
      <div class="nds-card__header nds-grid">
        <header class="nds-media nds-media_center nds-has-flexi-truncate">
          <div class="nds-media__figure">
            <span class="nds-icon_container nds-icon-standard-contact" title="description of icon when needed">
              <svg class="nds-icon nds-icon_small" aria-hidden="true">
                <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#contact"></use>
              </svg>
            </span>
          </div>
          <div class="nds-media__body">
            <h2>
              <a href="javascript:void(0);" class="nds-card__header-link nds-truncate" title="[object Object]">
                <span class="nds-text-heading_small">Card Header</span>
              </a>
            </h2>
          </div>
        </header>
        <div class="nds-no-flex">
          <button class="nds-button nds-button_neutral">New</button>
        </div>
      </div>
      <div class="nds-card__body nds-card__body_inner">Card Body (custom goes in here)</div>
      <footer class="nds-card__footer">Card Footer</footer>
    </article>`);
  })
  .add('Empty ', () => {
    return withExample(`<article class="nds-card">
      <div class="nds-card__header nds-grid">
        <header class="nds-media nds-media_center nds-has-flexi-truncate">
          <div class="nds-media__figure">
            <span class="nds-icon_container nds-icon-standard-contact" title="description of icon when needed">
              <svg class="nds-icon nds-icon_small" aria-hidden="true">
                <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#contact"></use>
              </svg>
            </span>
          </div>
          <div class="nds-media__body">
            <h2>
              <a href="javascript:void(0);" class="nds-card__header-link nds-truncate" title="[object Object]">
                <span class="nds-text-heading_small">Card Header</span>
              </a>
            </h2>
          </div>
        </header>
        <div class="nds-no-flex">
          <button class="nds-button nds-button_neutral">New</button>
        </div>
      </div>
      <div class="nds-card__body"></div>
      <footer class="nds-card__footer"></footer>
    </article>`);
  })
  .add('Related List Table', () => {
    return withExample(`<article class="nds-card">
      <div class="nds-card__header nds-grid">
        <header class="nds-media nds-media_center nds-has-flexi-truncate">
          <div class="nds-media__figure">
            <span class="nds-icon_container nds-icon-standard-contact" title="description of icon when needed">
              <svg class="nds-icon nds-icon_small" aria-hidden="true">
                <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#contact"></use>
              </svg>
            </span>
          </div>
          <div class="nds-media__body">
            <h2>
              <a href="javascript:void(0);" class="nds-card__header-link nds-truncate" title="[object Object]">
                <span class="nds-text-heading_small">Contacts (1)</span>
              </a>
            </h2>
          </div>
        </header>
        <div class="nds-no-flex">
          <button class="nds-button nds-button_neutral">New</button>
        </div>
      </div>
      <div class="nds-card__body">
        <table class="nds-table nds-table_fixed-layout nds-table_bordered nds-no-row-hover nds-table_cell-buffer">
          <thead>
            <tr class="nds-text-title_caps">
              <th scope="col">
                <div class="nds-truncate" title="Name">Name</div>
              </th>
              <th scope="col">
                <div class="nds-truncate" title="Company">Company</div>
              </th>
              <th scope="col">
                <div class="nds-truncate" title="Title">Title</div>
              </th>
              <th scope="col">
                <div class="nds-truncate" title="Email">Email</div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr class="nds-hint-parent">
              <th scope="row">
                <div class="nds-truncate" title="Adam Choi">
                  <a href="javascript:void(0);">Adam Choi</a>
                </div>
              </th>
              <td>
                <div class="nds-truncate" title="Company One">Company One</div>
              </td>
              <td>
                <div class="nds-truncate" title="Director of Operations">Director of Operations</div>
              </td>
              <td>
                <div class="nds-truncate" title="adam@company.com">adam@company.com</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <footer class="nds-card__footer">
        <a href="javascript:void(0);">
          View All
          <span class="nds-assistive-text">entity type</span>
        </a>
      </footer>
    </article>`);
  })
  .add('Newport Asset Detail', () => {
    return withExample(`<article class="nds-card nds-card_asset-detail">
      <div class="nds-card__header nds-grid">
        <header class="nds-media nds-media_center nds-has-flexi-truncate">
          <div class="nds-media__figure">
            <span class="nds-icon_container nds-icon-standard-contact" title="description of icon when needed">
              <svg class="nds-icon nds-icon_small" aria-hidden="true">
                <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#contact"></use>
              </svg>
            </span>
          </div>
          <div class="nds-media__body">
            <h2>
              <a href="javascript:void(0);" class="nds-card__header-link nds-truncate" title="[object Object]">
                <span class="nds-text-heading_small">Card Header</span>
              </a>
            </h2>
          </div>
        </header>
        <div class="nds-no-flex">
          <button class="nds-button nds-button_neutral">New</button>
        </div>
      </div>
      <div class="nds-card__body nds-card__body_inner">Card Body (custom goes in here)</div>
      <footer class="nds-card__footer">Card Footer</footer>
    </article>`);
  });
