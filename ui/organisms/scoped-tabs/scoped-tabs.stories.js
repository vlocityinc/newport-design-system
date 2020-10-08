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
    return withExample(`<div class="nds-tabs_scoped">
  <ul class="nds-tabs_scoped__nav" role="tablist">
    <li class="nds-tabs_scoped__item nds-is-active" title="Item One" role="presentation">
      <a class="nds-tabs_scoped__link" href="javascript:void(0);" role="tab" tabindex="0" aria-selected="true" aria-controls="tab-scoped-1" id="tab-scoped-1__item">Item One</a>
    </li>
    <li class="nds-tabs_scoped__item" title="Item Two" role="presentation">
      <a class="nds-tabs_scoped__link" href="javascript:void(0);" role="tab" tabindex="-1" aria-selected="false" aria-controls="tab-scoped-2" id="tab-scoped-2__item">Item Two</a>
    </li>
    <li class="nds-tabs_scoped__item" title="Item Three" role="presentation">
      <a class="nds-tabs_scoped__link" href="javascript:void(0);" role="tab" tabindex="-1" aria-selected="false" aria-controls="tab-scoped-3" id="tab-scoped-3__item">Item Three</a>
    </li>
  </ul>
  <div id="tab-scoped-1" class="nds-tabs_scoped__content nds-show" role="tabpanel" aria-labelledby="tab-scoped-1__item">Item One Content</div>
  <div id="tab-scoped-2" class="nds-tabs_scoped__content nds-hide" role="tabpanel" aria-labelledby="tab-scoped-2__item">Item Two Content</div>
  <div id="tab-scoped-3" class="nds-tabs_scoped__content nds-hide" role="tabpanel" aria-labelledby="tab-scoped-3__item">Item Three Content</div>
</div>`);
  })
  .add('Selected (states)', () => {
    return withExample(`<div class="nds-tabs_scoped">
  <ul class="nds-tabs_scoped__nav" role="tablist">
    <li class="nds-tabs_scoped__item" title="Item One" role="presentation">
      <a class="nds-tabs_scoped__link" href="javascript:void(0);" role="tab" tabindex="-1" aria-selected="false" aria-controls="tab-scoped-1" id="tab-scoped-1__item">Item One</a>
    </li>
    <li class="nds-tabs_scoped__item nds-is-active" title="Item Two" role="presentation">
      <a class="nds-tabs_scoped__link" href="javascript:void(0);" role="tab" tabindex="0" aria-selected="true" aria-controls="tab-scoped-2" id="tab-scoped-2__item">Item Two</a>
    </li>
    <li class="nds-tabs_scoped__item" title="Item Three" role="presentation">
      <a class="nds-tabs_scoped__link" href="javascript:void(0);" role="tab" tabindex="-1" aria-selected="false" aria-controls="tab-scoped-3" id="tab-scoped-3__item">Item Three</a>
    </li>
  </ul>
  <div id="tab-scoped-1" class="nds-tabs_scoped__content nds-hide" role="tabpanel" aria-labelledby="tab-scoped-1__item">Item One Content</div>
  <div id="tab-scoped-2" class="nds-tabs_scoped__content nds-show" role="tabpanel" aria-labelledby="tab-scoped-2__item">Item Two Content</div>
  <div id="tab-scoped-3" class="nds-tabs_scoped__content nds-hide" role="tabpanel" aria-labelledby="tab-scoped-3__item">Item Three Content</div>
</div>`);
  });
